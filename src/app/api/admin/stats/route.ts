import { withErrorHandling, ok } from '@/lib/errors/handler';
import { requireAdmin } from '@/lib/auth/guards';
import { OrderService } from '@/lib/services/order.service';
import { ProductService } from '@/lib/services/product.service';
import { CategoryService } from '@/lib/services/category.service';
import { UserService } from '@/lib/services/user.service';
import { CartRepository } from '@/lib/repositories/cart.repository';
import { WishlistRepository } from '@/lib/repositories/wishlist.repository';

export const GET = withErrorHandling(async () => {
  await requireAdmin();
  const [orders, products, categories, users, cartItems, wishlistItems] = await Promise.all([
    OrderService.listAll(),
    ProductService.list(),
    CategoryService.listAll(),
    UserService.listAll(),
    CartRepository.findAll(),
    WishlistRepository.findAll(),
  ]);

  const paidOrders = orders.filter((o) => o.status !== 'cancelled');
  const totalRevenue = paidOrders.reduce((sum, o) => sum + o.total, 0);
  const lowStock = products.filter((p) => p.stock > 0 && p.stock <= 5);
  const outOfStock = products.filter((p) => p.stock === 0);

  // Revenue for the last 7 days, bucketed by calendar day, for a simple chart.
  const days: { date: string; revenue: number; orders: number }[] = [];
  for (let i = 6; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    const key = d.toISOString().slice(0, 10);
    const dayOrders = paidOrders.filter((o) => o.createdAt.slice(0, 10) === key);
    days.push({ date: key, revenue: dayOrders.reduce((s, o) => s + o.total, 0), orders: dayOrders.length });
  }

  // Trend badges compare the last 7 days against the 7 days before that —
  // computed from the orders we already have in memory, so it costs no
  // extra DB round trips.
  const now = Date.now();
  const DAY_MS = 24 * 60 * 60 * 1000;
  const inWindow = (o: (typeof orders)[number], startDaysAgo: number, endDaysAgo: number) => {
    const t = new Date(o.createdAt).getTime();
    return t > now - startDaysAgo * DAY_MS && t <= now - endDaysAgo * DAY_MS;
  };
  const last7 = paidOrders.filter((o) => inWindow(o, 7, 0));
  const prev7 = paidOrders.filter((o) => inWindow(o, 14, 7));
  const pctChange = (current: number, previous: number) => {
    if (previous === 0) return current > 0 ? 100 : 0;
    return Math.round(((current - previous) / previous) * 100);
  };
  const revenueTrendPercent = pctChange(
    last7.reduce((s, o) => s + o.total, 0),
    prev7.reduce((s, o) => s + o.total, 0)
  );
  const ordersTrendPercent = pctChange(last7.length, prev7.length);

  const categoryDistribution = categories
    .map((c) => ({ id: c.id, name: c.name, productCount: c.productCount }))
    .sort((a, b) => b.productCount - a.productCount);

  return ok({
    totalOrders: orders.length,
    totalRevenue,
    totalProducts: products.length,
    totalCategories: categories.length,
    totalUsers: users.length,
    cartItemCount: cartItems.length,
    wishlistItemCount: wishlistItems.length,
    lowStockCount: lowStock.length,
    outOfStockCount: outOfStock.length,
    lowStockProducts: lowStock.slice(0, 10),
    recentOrders: orders.slice(0, 8),
    recentUsers: users.slice(0, 6).map((u) => ({ id: u.id, name: u.name, email: u.email, createdAt: u.createdAt })),
    revenueByDay: days,
    revenueTrendPercent,
    ordersTrendPercent,
    categoryDistribution,
  });
});
