import { useMemo, useState } from 'react';
import { Panel } from '@/components/ui/Panel';
import { useCashierStore } from '@/store/useCashierStore';
import { formatCurrency, formatDateTime } from '@/utils/format';

export default function TransactionsPage() {
  const { orders, orderItems, customers } = useCashierStore();
  const [paymentFilter, setPaymentFilter] = useState('all');

  const filteredOrders = useMemo(
    () => orders.filter((order) => paymentFilter === 'all' || order.payment_method === paymentFilter),
    [orders, paymentFilter],
  );

  return (
    <Panel
      title="Transaction History"
      subtitle="Review completed orders, customer details, and the service composition per ticket."
      actions={
        <select
          value={paymentFilter}
          onChange={(event) => setPaymentFilter(event.target.value)}
          className="brand-input rounded-2xl px-4 py-3 text-sm"
        >
          <option value="all">All payments</option>
          <option value="cash">Cash</option>
          <option value="card">Card</option>
          <option value="transfer">Transfer</option>
          <option value="qris">QRIS</option>
        </select>
      }
    >
      <div className="space-y-4">
        {filteredOrders.map((order) => {
          const customer = customers.find((entry) => entry.id === order.customer_id);
          const lines = orderItems.filter((item) => item.order_id === order.id);
          return (
            <article key={order.id} className="brand-soft-card rounded-3xl p-5">
              <div className="flex flex-col gap-4 border-b border-white/10 pb-4 lg:flex-row lg:items-center lg:justify-between">
                <div>
                  <p className="font-display text-2xl text-white">{order.order_number}</p>
                  <p className="mt-1 text-sm text-slate-400">{customer?.name ?? 'Walk-in customer'} · {formatDateTime(order.created_at)}</p>
                </div>
                <div className="text-right">
                  <p className="font-display text-3xl text-[#C8F400]">{formatCurrency(order.total)}</p>
                  <p className="mt-1 text-xs uppercase tracking-[0.2em] text-slate-400">{order.payment_method}</p>
                </div>
              </div>

              <div className="mt-4 grid gap-3 md:grid-cols-2">
                {lines.map((line) => (
                  <div key={line.id} className="rounded-2xl border border-white/10 bg-slate-950/60 p-4">
                    <div className="flex items-center justify-between gap-3">
                      <p className="font-medium text-white">{line.item_name}</p>
                      <span className="text-sm text-slate-400">x{line.quantity}</span>
                    </div>
                    <p className="mt-2 text-sm text-slate-400">{line.item_type}</p>
                    <p className="mt-3 text-lg text-white">{formatCurrency(line.line_total)}</p>
                  </div>
                ))}
              </div>
            </article>
          );
        })}
      </div>
    </Panel>
  );
}
