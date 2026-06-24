import { ArrowUpRight, ReceiptText, Wallet } from 'lucide-react';
import { Panel } from '@/components/ui/Panel';
import { StatCard } from '@/components/ui/StatCard';
import { useCashierStore } from '@/store/useCashierStore';
import { formatCurrency, formatDateTime } from '@/utils/format';

export default function DashboardPage() {
  const { orders, customers, catalogItems, orderItems } = useCashierStore();
  const completedOrders = orders.filter((order) => order.status === 'completed');
  const revenueToday = completedOrders.reduce((sum, order) => sum + order.total, 0);
  const averageBasket = completedOrders.length ? revenueToday / completedOrders.length : 0;
  const servicesCount = catalogItems.filter((item) => item.item_type === 'service').length;

  const topItems = Object.entries(
    orderItems.reduce<Record<string, number>>((acc, item) => {
      acc[item.item_name] = (acc[item.item_name] ?? 0) + item.line_total;
      return acc;
    }, {}),
  )
    .sort((a, b) => b[1] - a[1])
    .slice(0, 4);

  return (
    <div className="space-y-6">
      <section className="grid gap-4 xl:grid-cols-4">
        <StatCard label="Revenue Today" value={formatCurrency(revenueToday)} hint="Gross completed sales across the active dataset." />
        <StatCard label="Tickets" value={String(completedOrders.length)} hint="Completed transactions available for reporting." />
        <StatCard label="Average Basket" value={formatCurrency(averageBasket)} hint="Blended transaction value after discounts and tax." />
        <StatCard label="Services Active" value={String(servicesCount)} hint="Sellable service entries currently available in the catalog." />
      </section>

      <section className="grid gap-6 xl:grid-cols-[1.35fr_0.65fr]">
        <Panel title="Recent Transactions" subtitle="Latest cashier activity flowing into the operating dashboard.">
          <div className="space-y-3">
            {completedOrders.slice(0, 5).map((order) => {
              const customerName = customers.find((customer) => customer.id === order.customer_id)?.name ?? 'Walk-in customer';
              return (
                <div key={order.id} className="brand-soft-card flex flex-col gap-4 rounded-2xl p-4 lg:flex-row lg:items-center lg:justify-between">
                  <div>
                    <p className="font-medium text-white">{order.order_number}</p>
                    <p className="mt-1 text-sm text-slate-400">{customerName}</p>
                  </div>
                  <div className="flex items-center gap-6">
                    <div className="text-sm text-slate-400">{formatDateTime(order.created_at)}</div>
                    <div className="text-right">
                      <p className="font-display text-xl text-white">{formatCurrency(order.total)}</p>
                      <p className="text-xs uppercase tracking-[0.2em] text-[#C8F400]">{order.payment_method}</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </Panel>

        <Panel title="Quick Focus" subtitle="Operational signals that need immediate attention.">
          <div className="space-y-4">
            <div className="rounded-3xl border border-[#1535D4]/30 bg-[#1535D4]/28 p-5">
              <ReceiptText className="h-5 w-5 text-[#F9F9FF]" />
              <p className="mt-4 text-sm uppercase tracking-[0.2em] text-[#F9F9FF]">Catalog readiness</p>
              <p className="mt-2 text-2xl font-display text-white">{catalogItems.length} items loaded</p>
            </div>
            <div className="rounded-3xl border border-[#C8F400]/18 bg-[#C8F400]/10 p-5">
              <Wallet className="h-5 w-5 text-[#C8F400]" />
              <p className="mt-4 text-sm uppercase tracking-[0.2em] text-[#C8F400]">Customer base</p>
              <p className="mt-2 text-2xl font-display text-white">{customers.length} records tracked</p>
            </div>
            <div className="brand-soft-card rounded-3xl p-5">
              <ArrowUpRight className="h-5 w-5 text-white" />
              <p className="mt-4 text-sm uppercase tracking-[0.2em] text-slate-400">Top sellers</p>
              <div className="mt-3 space-y-2">
                {topItems.map(([name, total]) => (
                  <div key={name} className="flex items-center justify-between text-sm">
                    <span className="text-slate-300">{name}</span>
                    <span className="text-white">{formatCurrency(total)}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </Panel>
      </section>
    </div>
  );
}
