import { ArrowDownRight, ArrowUpRight, ReceiptText, Users } from 'lucide-react';
import { Panel } from '@/components/ui/Panel';
import { StatCard } from '@/components/ui/StatCard';
import { useCashierStore } from '@/store/useCashierStore';
import { formatCurrency, formatDateTime } from '@/utils/format';

function dateKeyFromLocal(date: Date) {
  const year = date.getFullYear();
  const month = `${date.getMonth() + 1}`.padStart(2, '0');
  const day = `${date.getDate()}`.padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export default function DashboardPage() {
  const { transactions, customers } = useCashierStore();
  const todayKey = dateKeyFromLocal(new Date());
  const yesterdayKey = dateKeyFromLocal(new Date(Date.now() - 24 * 60 * 60 * 1000));
  const todayTransactions = transactions.filter((tx) => dateKeyFromLocal(new Date(tx.time)) === todayKey);
  const yesterdayTransactions = transactions.filter((tx) => dateKeyFromLocal(new Date(tx.time)) === yesterdayKey);
  const todayRevenue = todayTransactions.reduce((sum, tx) => sum + tx.total, 0);
  const yesterdayRevenue = yesterdayTransactions.reduce((sum, tx) => sum + tx.total, 0);
  const delta = yesterdayRevenue ? ((todayRevenue - yesterdayRevenue) / yesterdayRevenue) * 100 : 0;
  const activeCustomers = customers.length;
  const todayCommission = todayTransactions.reduce((sum, tx) => sum + tx.commissionTotal, 0);
  const qrisCount = todayTransactions.filter((tx) => tx.pay === 'qris').length;

  const last7Days = Array.from({ length: 7 }).map((_, index) => {
    const date = new Date();
    date.setDate(date.getDate() - (6 - index));
    const key = dateKeyFromLocal(date);
    const revenue = transactions
      .filter((tx) => dateKeyFromLocal(new Date(tx.time)) === key)
      .reduce((sum, tx) => sum + tx.total, 0);
    const label = date.toLocaleDateString('id-ID', { weekday: 'short' });
    return { key, label, revenue };
  });
  const maxRevenue = Math.max(1, ...last7Days.map((entry) => entry.revenue));

  const topTechnicians = Object.entries(
    todayTransactions.reduce<Record<string, number>>((acc, tx) => {
      acc[tx.washer] = (acc[tx.washer] ?? 0) + 1;
      return acc;
    }, {}),
  )
    .sort((a, b) => b[1] - a[1])
    .slice(0, 3);

  return (
    <div className="space-y-6">
      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        <StatCard
          label="Pendapatan Hari Ini"
          value={formatCurrency(todayRevenue)}
          hint={`${delta >= 0 ? '+' : ''}${delta.toFixed(1)}% vs kemarin`}
          accent="blue"
        />
        <StatCard label="Transaksi" value={String(todayTransactions.length)} hint="Jumlah transaksi pada hari ini." accent="neutral" />
        <StatCard label="Pelanggan" value={String(activeCustomers)} hint="Pelanggan yang tersimpan di aplikasi kasir." accent="dark" />
      </section>

      <Panel title="Pendapatan 7 Hari Terakhir" subtitle={`Hari ini ${formatCurrency(todayRevenue)} · Kemarin ${formatCurrency(yesterdayRevenue)}`}>
        <div className="grid gap-6 lg:grid-cols-[1.15fr_0.85fr]">
          <div className="brand-outline-card rounded-[16px] p-5">
            <div className="flex items-end justify-between gap-2">
              {last7Days.map((entry) => {
                const height = Math.round((entry.revenue / maxRevenue) * 140);
                const isToday = entry.key === todayKey;
                const isYesterday = entry.key === yesterdayKey;
                return (
                  <div key={entry.key} className="flex flex-1 flex-col items-center gap-2">
                    <div className="text-[11px] font-semibold tabular-nums text-slate-500">{entry.revenue ? formatCurrency(entry.revenue).replace('Rp', '').trim() : '0'}</div>
                    <div className="flex w-full items-end justify-center">
                      <div
                        className={`w-[78%] rounded-[12px] ${isToday ? 'bg-[#1535D4]' : isYesterday ? 'bg-[#b7c6ff]' : 'bg-[#d9e2ff]'}`}
                        style={{ height: Math.max(18, height) }}
                      />
                    </div>
                    <div className="text-[11px] font-semibold text-slate-600">{entry.label}</div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="space-y-3">
            <div className="brand-outline-card rounded-[16px] p-5">
              <p className="text-[11px] uppercase tracking-[0.16em] text-slate-500">Trend vs kemarin</p>
              <div className="mt-3 flex items-center gap-3">
                {delta >= 0 ? <ArrowUpRight className="h-5 w-5 text-[#1535D4]" /> : <ArrowDownRight className="h-5 w-5 text-[#e0483c]" />}
                <p className="font-display text-2xl text-slate-900">{delta.toFixed(1)}%</p>
              </div>
            </div>
            <div className="brand-outline-card rounded-[16px] p-5">
              <p className="text-[11px] uppercase tracking-[0.16em] text-slate-500">Total 7 hari</p>
              <p className="mt-2 font-display text-2xl text-slate-900 tabular-nums">
                {formatCurrency(last7Days.reduce((sum, entry) => sum + entry.revenue, 0))}
              </p>
            </div>
          </div>
        </div>
      </Panel>

      <section className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
        <Panel title="Transaksi Terbaru" subtitle="Ringkas dan cepat dipantau dari meja kasir.">
          <div className="space-y-3">
            {todayTransactions.slice(0, 5).map((tx) => {
              const customerName = customers.find((customer) => customer.id === tx.customerId)?.name ?? tx.cust;
              return (
                <div key={tx.id} className="brand-outline-card flex flex-col gap-4 rounded-[16px] p-4 lg:flex-row lg:items-center lg:justify-between">
                  <div>
                    <p className="font-medium text-slate-900">{tx.invoiceNo}</p>
                    <p className="mt-1 text-sm text-slate-500">
                      {customerName} · {tx.plate} · {tx.merk}
                    </p>
                  </div>
                  <div className="flex items-center gap-6">
                    <div className="text-sm text-slate-500">{formatDateTime(tx.time)}</div>
                    <div className="text-right">
                      <p className="font-display text-lg text-[#1535D4] tabular-nums">{formatCurrency(tx.total)}</p>
                      <p className="text-[11px] uppercase tracking-[0.16em] text-[#79809a]">
                        {tx.pay}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </Panel>

        <Panel title="Ringkasan Kasir" subtitle="Informasi penting tanpa modul tambahan yang tidak dibutuhkan kasir.">
          <div className="space-y-4">
            <div className="rounded-[16px] border border-[#1535D4] bg-[#1535D4] p-5 text-white">
              <ReceiptText className="h-5 w-5 text-[#C8F400]" />
              <p className="mt-4 text-sm uppercase tracking-[0.16em] text-white/72">Pendapatan vs kemarin</p>
              <div className="mt-3 flex items-center gap-3">
                {delta >= 0 ? <ArrowUpRight className="h-5 w-5 text-[#C8F400]" /> : <ArrowDownRight className="h-5 w-5 text-[#e0483c]" />}
                <p className="text-2xl font-display text-white">{delta.toFixed(1)}%</p>
              </div>
            </div>
            <div className="brand-outline-card rounded-[16px] p-5">
              <p className="text-sm uppercase tracking-[0.16em] text-[#79809a]">Komisi teknisi hari ini</p>
              <p className="mt-2 font-display text-2xl text-slate-900 tabular-nums">{formatCurrency(todayCommission)}</p>
            </div>
            <div className="brand-outline-card rounded-[16px] p-5">
              <Users className="h-5 w-5 text-[#1535D4]" />
              <p className="mt-4 text-sm uppercase tracking-[0.16em] text-[#79809a]">Transaksi QRIS</p>
              <p className="mt-2 text-2xl font-display text-slate-900 tabular-nums">{qrisCount} transaksi</p>
            </div>
          </div>
        </Panel>
      </section>

      <section className="grid gap-6">
        <Panel title="Teknisi Aktif" subtitle="Petugas yang paling sering dipilih hari ini.">
          <div className="grid gap-4 md:grid-cols-3">
            {topTechnicians.map(([name, count], index) => (
              <div key={name} className="brand-outline-card flex items-center justify-between rounded-[16px] p-4">
                <div>
                  <p className="text-[11px] uppercase tracking-[0.16em] text-[#79809a]">Rank {index + 1}</p>
                  <p className="mt-2 font-medium text-slate-900">{name}</p>
                </div>
                <p className="font-display text-[28px] text-[#1535D4] tabular-nums">{count}</p>
              </div>
            ))}
          </div>
        </Panel>
      </section>
    </div>
  );
}
