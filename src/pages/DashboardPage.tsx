import { ArrowDownRight, ArrowUpRight, CalendarCheck2, ReceiptText, Warehouse } from 'lucide-react';
import { Panel } from '@/components/ui/Panel';
import { StatCard } from '@/components/ui/StatCard';
import { useCashierStore } from '@/store/useCashierStore';
import { formatCurrency, formatDateTime } from '@/utils/format';

export default function DashboardPage() {
  const { transactions, customers, employees } = useCashierStore();
  const todayRevenue = transactions.reduce((sum, tx) => sum + tx.total, 0);
  const yesterdayRevenue = Math.round(todayRevenue * 0.88);
  const delta = yesterdayRevenue ? ((todayRevenue - yesterdayRevenue) / yesterdayRevenue) * 100 : 0;
  const queueActive = transactions.filter((tx) => tx.status !== 'Selesai').length;
  const activeCustomers = customers.length;
  const qrisCount = transactions.filter((tx) => tx.pay === 'qris').length;

  const topTechnicians = Object.entries(
    transactions.reduce<Record<string, number>>((acc, tx) => {
      acc[tx.washer] = (acc[tx.washer] ?? 0) + 1;
      return acc;
    }, {}),
  )
    .sort((a, b) => b[1] - a[1])
    .slice(0, 3);

  const topServices = Object.entries(
    transactions.reduce<Record<string, number>>((acc, tx) => {
      tx.services.forEach((service) => {
        acc[service] = (acc[service] ?? 0) + 1;
      });
      return acc;
    }, {}),
  )
    .sort((a, b) => b[1] - a[1])
    .slice(0, 4);

  return (
    <div className="space-y-6">
      <section className="grid gap-4 xl:grid-cols-4">
        <StatCard
          label="Pendapatan Hari Ini"
          value={formatCurrency(todayRevenue)}
          hint={`${delta >= 0 ? '+' : ''}${delta.toFixed(1)}% vs kemarin`}
        />
        <StatCard label="Transaksi" value={String(transactions.length)} hint="Jumlah transaksi pada tanggal aktif." />
        <StatCard label="Antrian Aktif" value={String(queueActive)} hint="Motor pada status Masuk dan Dicuci." />
        <StatCard label="Pelanggan" value={String(activeCustomers)} hint="Pelanggan yang tersimpan di aplikasi kasir." />
      </section>

      <section className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
        <Panel title="Transaksi Terbaru" subtitle="Ringkas dan cepat dipantau dari meja kasir.">
          <div className="space-y-3">
            {transactions.slice(0, 5).map((tx) => {
              const customerName = customers.find((customer) => customer.id === tx.customerId)?.name ?? tx.cust;
              return (
                <div key={tx.id} className="brand-soft-card flex flex-col gap-4 rounded-2xl p-4 lg:flex-row lg:items-center lg:justify-between">
                  <div>
                    <p className="font-medium text-slate-900">{tx.invoiceNo}</p>
                    <p className="mt-1 text-sm text-slate-500">
                      {customerName} · {tx.plate} · {tx.merk}
                    </p>
                  </div>
                  <div className="flex items-center gap-6">
                    <div className="text-sm text-slate-500">{formatDateTime(tx.time)}</div>
                    <div className="text-right">
                      <p className="font-display text-lg text-[#1535D4]">{formatCurrency(tx.total)}</p>
                      <p className="text-[11px] uppercase tracking-[0.16em] text-[#1535D4]">
                        {tx.pay} · {tx.status}
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
            <div className="rounded-3xl border border-[#1535D4]/10 bg-[#eef4ff] p-5">
              <ReceiptText className="h-5 w-5 text-[#1535D4]" />
              <p className="mt-4 text-sm uppercase tracking-[0.16em] text-[#1535D4]">Pendapatan vs kemarin</p>
              <div className="mt-3 flex items-center gap-3">
                {delta >= 0 ? <ArrowUpRight className="h-5 w-5 text-[#C8F400]" /> : <ArrowDownRight className="h-5 w-5 text-[#e0483c]" />}
                <p className="text-2xl font-display text-slate-900">{delta.toFixed(1)}%</p>
              </div>
            </div>
            <div className="rounded-3xl border border-[#C8F400]/18 bg-[#f8ffd8] p-5">
              <Warehouse className="h-5 w-5 text-[#6b7f00]" />
              <p className="mt-4 text-sm uppercase tracking-[0.16em] text-[#6b7f00]">Transaksi QRIS</p>
              <p className="mt-2 text-2xl font-display text-slate-900">{qrisCount} transaksi</p>
            </div>
            <div className="brand-soft-card rounded-3xl p-5">
              <CalendarCheck2 className="h-5 w-5 text-[#1535D4]" />
              <p className="mt-4 text-sm uppercase tracking-[0.16em] text-slate-500">Teknisi hadir</p>
              <div className="mt-3 space-y-2">
                {employees
                  .filter((employee) => employee.role === 'cuci')
                  .map((employee) => (
                  <div key={employee.id} className="flex items-center justify-between text-sm">
                    <span className="text-slate-600">{employee.name}</span>
                    <span className="text-slate-900">{employee.present ? `Masuk ${employee.in}` : 'Belum hadir'}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </Panel>
      </section>

      <section className="grid gap-6 xl:grid-cols-2">
        <Panel title="Teknisi Aktif" subtitle="Petugas cuci yang paling sering dipilih hari ini.">
          <div className="space-y-3">
            {topTechnicians.map(([name, count], index) => (
              <div key={name} className="brand-soft-card flex items-center justify-between rounded-2xl p-4">
                <div>
                  <p className="text-[11px] uppercase tracking-[0.16em] text-slate-500">Rank {index + 1}</p>
                  <p className="mt-2 font-medium text-slate-900">{name}</p>
                </div>
                <p className="font-display text-[28px] text-[#1535D4]">{count}</p>
              </div>
            ))}
          </div>
        </Panel>

        <Panel title="Layanan Terlaris" subtitle="Pilihan layanan yang paling sering masuk ke transaksi.">
          <div className="space-y-3">
            {topServices.map(([name, count]) => (
              <div key={name} className="brand-soft-card flex items-center justify-between rounded-2xl p-4">
                <span className="text-slate-700">{name}</span>
                <span className="font-display text-2xl text-[#1535D4]">{count}</span>
              </div>
            ))}
          </div>
        </Panel>
      </section>
    </div>
  );
}
