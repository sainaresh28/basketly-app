import { withErrorHandling, ok } from '@/lib/errors/handler';
import { requireAdmin } from '@/lib/auth/guards';
import { OrderService } from '@/lib/services/order.service';
import { ProductService } from '@/lib/services/product.service';

export const GET = withErrorHandling(async () => {
  await requireAdmin();
  const [orders, products] = await Promise.all([OrderService.listAll(), ProductService.list()]);

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

  return ok({
    totalOrders: orders.length,
    totalRevenue,
    totalProducts: products.length,
    lowStockCount: lowStock.length,
    outOfStockCount: outOfStock.length,
    lowStockProducts: lowStock.slice(0, 10),
    recentOrders: orders.slice(0, 8),
    revenueByDay: days,
  });
});
