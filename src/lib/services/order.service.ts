import { v4 as uuidv4 } from 'uuid';
import { TransactWriteCommand } from '@aws-sdk/lib-dynamodb';
import { TransactionCanceledException } from '@aws-sdk/client-dynamodb';
import { ddb } from '@/lib/db/client';
import { TABLES } from '@/lib/db/tables';
import { OrderRepository } from '@/lib/repositories/order.repository';
import { CartRepository } from '@/lib/repositories/cart.repository';
import { CartService } from '@/lib/services/cart.service';
import { createRazorpayOrder, verifyRazorpaySignature, createRazorpayRefund } from '@/lib/payments/razorpay';
import { ValidationError, NotFoundError, ForbiddenError } from '@/lib/errors/app-error';
import type { ShippingAddressInput } from '@/lib/validation/schemas';
import { CANCELLABLE_STATUSES, type Order, type OrderItem, type OrderStatus, type OrderStatusEvent } from '@/types';

export const OrderService = {
  /**
   * Step 1 of checkout: snapshot the user's current cart, make sure every
   * item is still in stock, and open a Razorpay order for the total. No
   * money moves yet and nothing is written to the Orders table — that only
   * happens once the payment is verified (see confirmPayment below).
   */
  async startCheckout(userId: string) {
    const cart = await CartService.getCart(userId);
    if (cart.items.length === 0) {
      throw new ValidationError('Your cart is empty');
    }
    for (const item of cart.items) {
      if (item.quantity > item.product.stock) {
        throw new ValidationError(`${item.product.name} only has ${item.product.stock} left in stock`);
      }
    }

    // Razorpay caps `receipt` at 56 chars. A full UUID userId plus prefix and
    // timestamp can exceed that, so we only use the first 8 chars of the
    // userId — still enough to spot which user an order belongs to when
    // scanning receipts, without risking the length limit.
    const receipt = `bkt_${userId.slice(0, 8)}_${Date.now()}`;
    const razorpayOrder = await createRazorpayOrder(cart.total, receipt);
    return { razorpayOrder, cart };
  },

  /**
   * Step 2 of checkout: called after Razorpay's checkout widget reports a
   * successful payment. We verify the cryptographic signature ourselves
   * (never trust the client's word for it), re-check stock, decrement it,
   * write the Order record, and clear the cart.
   */
  async confirmPayment(
    userId: string,
    input: {
      razorpay_order_id: string;
      razorpay_payment_id: string;
      razorpay_signature: string;
      shippingAddress: ShippingAddressInput;
    }
  ): Promise<Order> {
    const isValid = verifyRazorpaySignature(
      input.razorpay_order_id,
      input.razorpay_payment_id,
      input.razorpay_signature
    );
    if (!isValid) {
      throw new ValidationError('Payment could not be verified. If money was deducted, it will be refunded automatically.');
    }

    const cart = await CartService.getCart(userId);
    if (cart.items.length === 0) {
      throw new ValidationError('Your cart is empty — nothing to confirm');
    }

    const now = new Date().toISOString();
    const items: OrderItem[] = cart.items.map((i) => ({
      productId: i.productId,
      name: i.product.name,
      image: i.product.images[0],
      price: i.product.price,
      quantity: i.quantity,
    }));

    const order: Order = {
      id: uuidv4(),
      userId,
      items,
      subtotal: cart.subtotal,
      shipping: cart.shipping,
      total: cart.total,
      status: 'paid',
      shippingAddress: input.shippingAddress,
      paymentMethod: 'online',
      paymentStatus: 'paid',
      razorpayOrderId: input.razorpay_order_id,
      razorpayPaymentId: input.razorpay_payment_id,
      statusHistory: [{ status: 'paid', at: now, note: 'Payment received' }],
      createdAt: now,
      updatedAt: now,
    };

    // One atomic transaction: decrement stock for every item (each with its
    // own "enough stock?" condition) AND write the order in a single
    // all-or-nothing operation. If any product is out of stock, the whole
    // transaction is rejected — we never end up decrementing some items'
    // stock but not others, or creating an order without reserving stock.
    try {
      await ddb.send(
        new TransactWriteCommand({
          TransactItems: [
            ...cart.items.map((i) => ({
              Update: {
                TableName: TABLES.PRODUCTS,
                Key: { id: i.productId },
                UpdateExpression: 'SET stock = stock - :qty',
                ConditionExpression: 'stock >= :qty',
                ExpressionAttributeValues: { ':qty': i.quantity },
              },
            })),
            { Put: { TableName: TABLES.ORDERS, Item: order } },
          ],
        })
      );
    } catch (err) {
      if (err instanceof TransactionCanceledException) {
        throw new ValidationError('One or more items sold out while you were checking out. Please review your cart.');
      }
      throw err;
    }

    await CartRepository.clearForUser(userId);
    return order;
  },

  /**
   * Cash on Delivery / Pay on Delivery: skips Razorpay entirely. The order is
   * placed and stock reserved immediately; payment itself is collected by the
   * courier when the parcel is delivered.
   */
  async placeCodOrder(userId: string, shippingAddress: ShippingAddressInput): Promise<Order> {
    const cart = await CartService.getCart(userId);
    if (cart.items.length === 0) {
      throw new ValidationError('Your cart is empty');
    }
    for (const item of cart.items) {
      if (item.quantity > item.product.stock) {
        throw new ValidationError(`${item.product.name} only has ${item.product.stock} left in stock`);
      }
    }

    const now = new Date().toISOString();
    const items: OrderItem[] = cart.items.map((i) => ({
      productId: i.productId,
      name: i.product.name,
      image: i.product.images[0],
      price: i.product.price,
      quantity: i.quantity,
    }));

    const order: Order = {
      id: uuidv4(),
      userId,
      items,
      subtotal: cart.subtotal,
      shipping: cart.shipping,
      total: cart.total,
      status: 'processing',
      shippingAddress,
      paymentMethod: 'cod',
      paymentStatus: 'unpaid',
      statusHistory: [{ status: 'processing', at: now, note: 'Order placed — pay on delivery' }],
      createdAt: now,
      updatedAt: now,
    };

    try {
      await ddb.send(
        new TransactWriteCommand({
          TransactItems: [
            ...cart.items.map((i) => ({
              Update: {
                TableName: TABLES.PRODUCTS,
                Key: { id: i.productId },
                UpdateExpression: 'SET stock = stock - :qty',
                ConditionExpression: 'stock >= :qty',
                ExpressionAttributeValues: { ':qty': i.quantity },
              },
            })),
            { Put: { TableName: TABLES.ORDERS, Item: order } },
          ],
        })
      );
    } catch (err) {
      if (err instanceof TransactionCanceledException) {
        throw new ValidationError('One or more items sold out while you were checking out. Please review your cart.');
      }
      throw err;
    }

    await CartRepository.clearForUser(userId);
    return order;
  },

  async getForUser(userId: string): Promise<Order[]> {
    return OrderRepository.findAllForUser(userId);
  },

  async getById(userId: string, orderId: string, isAdmin = false): Promise<Order> {
    const order = await OrderRepository.findById(orderId);
    if (!order) throw new NotFoundError('Order not found');
    if (order.userId !== userId && !isAdmin) throw new ForbiddenError('This is not your order');
    return order;
  },

  // --- Admin -----------------------------------------------------------------
  async listAll(): Promise<Order[]> {
    const orders = await OrderRepository.findAll();
    return orders.sort((a, b) => b.createdAt.localeCompare(a.createdAt));
  },

  async updateStatus(
    orderId: string,
    status: OrderStatus,
    extra?: { trackingNumber?: string; courier?: string; estimatedDelivery?: string }
  ): Promise<void> {
    const order = await OrderRepository.findById(orderId);
    if (!order) throw new NotFoundError('Order not found');

    const now = new Date().toISOString();
    const event: OrderStatusEvent = { status, at: now };
    const history = [...(order.statusHistory || []), event];

    const patch: Partial<Order> = { status, statusHistory: history };
    if (extra?.trackingNumber !== undefined) patch.trackingNumber = extra.trackingNumber;
    if (extra?.courier !== undefined) patch.courier = extra.courier;
    if (extra?.estimatedDelivery !== undefined) patch.estimatedDelivery = extra.estimatedDelivery;
    // COD orders collect payment on delivery — settle the payment status once delivered.
    if (status === 'delivered' && order.paymentMethod === 'cod' && order.paymentStatus === 'unpaid') {
      patch.paymentStatus = 'paid';
    }

    await OrderRepository.patch(orderId, patch);
  },

  /**
   * Customer-initiated cancellation. Only possible before an order has
   * shipped. Restocks every item and, for orders already paid online,
   * automatically kicks off a Razorpay refund; COD orders never needed a
   * charge, so there's nothing to refund.
   */
  async cancelOrder(userId: string, orderId: string, reason?: string): Promise<Order> {
    const order = await OrderRepository.findById(orderId);
    if (!order) throw new NotFoundError('Order not found');
    if (order.userId !== userId) throw new ForbiddenError('This is not your order');
    if (!CANCELLABLE_STATUSES.includes(order.status)) {
      throw new ValidationError('This order can no longer be cancelled — it has already shipped.');
    }

    const now = new Date().toISOString();
    const history = [...(order.statusHistory || []), { status: 'cancelled' as OrderStatus, at: now, note: reason }];
    const patch: Partial<Order> = {
      status: 'cancelled',
      statusHistory: history,
      cancelReason: reason,
      cancelledAt: now,
    };

    if (order.paymentMethod === 'online' && order.paymentStatus === 'paid' && order.razorpayPaymentId) {
      patch.paymentStatus = 'refund_pending';
      try {
        await createRazorpayRefund(order.razorpayPaymentId, order.total);
        patch.paymentStatus = 'refunded';
        patch.refundedAt = now;
      } catch (err) {
        // Payment gateway hiccup — leave it as refund_pending so an admin can retry from the dashboard.
        console.error('[refund_failed]', err);
      }
    }

    await OrderRepository.patch(orderId, patch);
    await OrderRepository.restockItems(order);

    return { ...order, ...patch };
  },

  /** Admin-triggered (re)issue of a refund — e.g. after a failed automatic refund, or a manual return/exchange. */
  async adminRefund(orderId: string): Promise<Order> {
    const order = await OrderRepository.findById(orderId);
    if (!order) throw new NotFoundError('Order not found');
    if (order.paymentMethod !== 'online' || !order.razorpayPaymentId) {
      throw new ValidationError('This order has no online payment to refund.');
    }
    if (order.paymentStatus === 'refunded') {
      throw new ValidationError('This order has already been refunded.');
    }

    const now = new Date().toISOString();
    let patch: Partial<Order>;
    try {
      await createRazorpayRefund(order.razorpayPaymentId, order.total);
      patch = { paymentStatus: 'refunded', refundedAt: now };
    } catch (err) {
      patch = { paymentStatus: 'refund_failed' };
      await OrderRepository.patch(orderId, patch);
      throw new ValidationError('The refund could not be processed by the payment gateway. Please try again.');
    }

    await OrderRepository.patch(orderId, patch);
    return { ...order, ...patch };
  },
};