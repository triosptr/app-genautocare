import { useMemo, useState } from 'react';
import { Panel } from '@/components/ui/Panel';
import { useCashierStore } from '@/store/useCashierStore';
import { formatCurrency, toInputDate } from '@/utils/format';

export default function ReportsPage() {
  const { transactions, employees } = useCashierStore();
  const [dateKey, setDateKey] = useState(() => new Date().toISOString().split('T')[0]);

  const selectedDate = useMemo(() => new Date(`${dateKey}T00:00:00.000Z`), [dateKey]);
  const prevDateKey = useMemo(
    () => new Date(selectedDate.getTime() - 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    [selectedDate],
  );

  const dayTransactions = useMemo(
    () => transactions.filter((tx) => new Date(tx.time).toISOString().split('T')[0] === dateKey),
    [transactions, dateKey],
  );
  const prevTransactions = useMemo(
    () => transactions.filter((tx) => new Date(tx.time).toISOString().split('T')[0] === prevDateKey),
    [transactions, prevDateKey],
  );

  const revenue = useMemo(() => dayTransactions.reduce((sum, tx) => sum + tx.total, 0), [dayTransactions]);
  const revenuePrev = useMemo(() => prevTransactions.reduce((sum, tx) => sum + tx.total, 0), [prevTransactions]);
  const commission = useMemo(() => dayTransactions.reduce((sum, tx) => sum + tx.commissionTotal, 0), [dayTransactions]);
  const txCount = dayTransactions.length;
  const delta = revenuePrev ? ((revenue - revenuePrev) / revenuePrev) * 100 : 0;

  const payBreakdown = useMemo(() => {
    return dayTransactions.reduce(
      (acc, tx) => {
        acc[tx.pay] += tx.total;
        return acc;
      },
      { cash: 0, qris: 0, transfer: 0 },
    );
  }, [dayTransactions]);

  const technicianRows = useMemo(() => {
    const grouped = dayTransactions.reduce<Record<string, { count: number; revenue: number; commission: number }>>((acc, tx) => {
      const key = tx.washerId || tx.washer || 'unknown';
      const current = acc[key] ?? { count: 0, revenue: 0, commission: 0 };
      current.count += 1;
      current.revenue += tx.total;
      current.commission += tx.commissionTotal;
      acc[key] = current;
      return acc;
    }, {});

    const rows = Object.entries(grouped).map(([key, metrics]) => {
      const employee = employees.find((emp) => emp.id === key) ?? employees.find((emp) => emp.name === key) ?? null;
      return {
        key,
        name: employee?.name ?? key,
        ...metrics,
      };
    });

    return rows.sort((a, b) => b.revenue - a.revenue);
  }, [dayTransactions, employees]);

  return (
    <div className="space-y-6">
      <Panel title="Laporan" subtitle="Pendapatan dan komisi teknisi untuk tanggal yang dipilih.">
        <div className="grid gap-4 lg:grid-cols-[1fr_auto] lg:items-end">
          <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
            <div className="brand-outline-card rounded-[16px] p-4">
              <p className="text-[11px] uppercase tracking-[0.16em] text-slate-500">Pendapatan</p>
              <p className="mt-2 font-display text-[24px] text-[#1535D4] tabular-nums">{formatCurrency(revenue)}</p>
              <p className="mt-2 text-sm text-slate-500">{delta >= 0 ? '+' : ''}{delta.toFixed(1)}% vs kemarin</p>
            </div>
            <div className="brand-outline-card rounded-[16px] p-4">
              <p className="text-[11px] uppercase tracking-[0.16em] text-slate-500">Komisi teknisi</p>
              <p className="mt-2 font-display text-[24px] text-slate-900 tabular-nums">{formatCurrency(commission)}</p>
              <p className="mt-2 text-sm text-slate-500">{txCount} transaksi</p>
            </div>
            <div className="brand-outline-card rounded-[16px] p-4">
              <p className="text-[11px] uppercase tracking-[0.16em] text-slate-500">Cash</p>
              <p className="mt-2 font-display text-[24px] text-slate-900 tabular-nums">{formatCurrency(payBreakdown.cash)}</p>
            </div>
            <div className="brand-outline-card rounded-[16px] p-4">
              <p className="text-[11px] uppercase tracking-[0.16em] text-slate-500">QRIS / Transfer</p>
              <p className="mt-2 font-display text-[24px] text-slate-900 tabular-nums">{formatCurrency(payBreakdown.qris + payBreakdown.transfer)}</p>
            </div>
          </div>

          <div className="flex items-end gap-3">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-500">Tanggal</p>
              <input
                type="date"
                value={dateKey}
                onChange={(event) => setDateKey(event.target.value)}
                className="brand-input mt-2 rounded-2xl px-4 py-3"
              />
            </div>
          </div>
        </div>
      </Panel>

      <Panel title="Komisi per Teknisi" subtitle={`Tanggal ${toInputDate(dateKey)} (vs ${prevDateKey})`}>
        <div className="overflow-hidden rounded-[16px] border border-slate-200 bg-white">
          <div className="grid grid-cols-[1.2fr_0.6fr_0.8fr_0.8fr] gap-2 bg-[#f7f8fb] px-4 py-3 text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-500">
            <div>Teknisi</div>
            <div className="text-right">Transaksi</div>
            <div className="text-right">Pendapatan</div>
            <div className="text-right">Komisi</div>
          </div>
          <div className="divide-y divide-slate-200">
            {technicianRows.length === 0 ? (
              <div className="p-5 text-sm text-slate-500">Belum ada transaksi untuk tanggal ini.</div>
            ) : (
              technicianRows.map((row) => (
                <div key={row.key} className="grid grid-cols-[1.2fr_0.6fr_0.8fr_0.8fr] items-center gap-2 px-4 py-4 text-sm">
                  <div className="font-medium text-slate-900">{row.name}</div>
                  <div className="text-right tabular-nums">{row.count}</div>
                  <div className="text-right font-medium tabular-nums text-slate-900">{formatCurrency(row.revenue)}</div>
                  <div className="text-right font-medium tabular-nums text-[#1535D4]">{formatCurrency(row.commission)}</div>
                </div>
              ))
            )}
          </div>
        </div>
      </Panel>
    </div>
  );
}
