import { Panel } from '@/components/ui/Panel';
import { useCashierStore } from '@/store/useCashierStore';
import { formatCurrency } from '@/utils/format';

export default function ReportsPage() {
  const { orders, orderItems } = useCashierStore();
  const totalRevenue = orders.reduce((sum, order) => sum + order.total, 0);

  const paymentGroups = ['cash', 'card', 'transfer', 'qris'].map((method) => ({
    method,
    total: orders.filter((order) => order.payment_method === method).reduce((sum, order) => sum + order.total, 0),
  }));

  const maxPayment = Math.max(...paymentGroups.map((entry) => entry.total), 1);

  const topItems = Object.entries(
    orderItems.reduce<Record<string, number>>((acc, item) => {
      acc[item.item_name] = (acc[item.item_name] ?? 0) + item.line_total;
      return acc;
    }, {}),
  )
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5);

  return (
    <div className="grid gap-6 xl:grid-cols-[0.95fr_1.05fr]">
      <Panel title="Payment Breakdown" subtitle="See how revenue is distributed across cashier payment channels.">
        <div className="space-y-4">
          {paymentGroups.map((group) => (
            <div key={group.method}>
              <div className="mb-2 flex items-center justify-between text-sm">
                <span className="uppercase tracking-[0.2em] text-slate-400">{group.method}</span>
                <span className="text-white">{formatCurrency(group.total)}</span>
              </div>
              <div className="h-3 rounded-full bg-white/5">
                <div
                  className="h-3 rounded-full bg-gradient-to-r from-cyan-300 to-lime-300"
                  style={{ width: `${(group.total / maxPayment) * 100}%` }}
                />
              </div>
            </div>
          ))}
        </div>

        <div className="mt-6 rounded-3xl border border-lime-300/15 bg-lime-300/10 p-5">
          <p className="text-xs uppercase tracking-[0.25em] text-lime-100">Total revenue</p>
          <p className="mt-3 font-display text-4xl text-white">{formatCurrency(totalRevenue)}</p>
        </div>
      </Panel>

      <Panel title="Top Performing Services" subtitle="Revenue contribution by item across all completed tickets.">
        <div className="space-y-3">
          {topItems.map(([name, total], index) => (
            <div key={name} className="rounded-3xl border border-white/10 bg-white/5 p-4">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="text-xs uppercase tracking-[0.25em] text-slate-500">Rank {index + 1}</p>
                  <p className="mt-2 font-medium text-white">{name}</p>
                </div>
                <p className="font-display text-2xl text-cyan-200">{formatCurrency(total)}</p>
              </div>
            </div>
          ))}
        </div>
      </Panel>
    </div>
  );
}
