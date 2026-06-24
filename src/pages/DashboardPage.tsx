import { ArrowDownRight, ArrowUpRight, CalendarCheck2, ReceiptText, Warehouse } from 'lucide-react';
import { Panel } from '@/components/ui/Panel';
import { StatCard } from '@/components/ui/StatCard';
import { useCashierStore } from '@/store/useCashierStore';
import { formatCurrency, formatDateTime } from '@/utils/format';

export default function DashboardPage() {
  const { transactions, customers, employees, inventory, currentRole } = useCashierStore();
  const todayRevenue = transactions.reduce((sum, tx) => sum + tx.total, 0);
  const yesterdayRevenue = Math.round(todayRevenue * 0.88);
  const delta = yesterdayRevenue ? ((todayRevenue - yesterdayRevenue) / yesterdayRevenue) * 100 : 0;
  const queueActive = transactions.filter((tx) => tx.status !== 'Selesai').length;
  const presentCount = employees.filter((employee) => employee.present).length;
  const stockLow = inventory.filter((item) => item.stock <= item.min).length;

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
        <StatCard label="Teknisi Hadir" value={String(presentCount)} hint="Semua role dapat melihat kehadiran hari ini." />
      </section>

      <section className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
        <Panel title="Transaksi Terbaru" subtitle="Kasir, layanan, dan status antrian terbaru pada hari aktif.">
          <div className="space-y-3">
            {transactions.slice(0, 5).map((tx) => {
              const customerName = customers.find((customer) => customer.id === tx.customerId)?.name ?? tx.cust;
              return (
                <div key={tx.id} className="brand-soft-card flex flex-col gap-4 rounded-2xl p-4 lg:flex-row lg:items-center lg:justify-between">
                  <div>
                    <p className="font-medium text-white">{tx.invoiceNo}</p>
                    <p className="mt-1 text-sm text-slate-400">
                      {customerName} · {tx.plate} · {tx.merk}
                    </p>
                  </div>
                  <div className="flex items-center gap-6">
                    <div className="text-sm text-slate-400">{formatDateTime(tx.time)}</div>
                    <div className="text-right">
                      <p className="font-display text-xl text-white">{formatCurrency(tx.total)}</p>
                      <p className="text-xs uppercase tracking-[0.2em] text-[#C8F400]">
                        {tx.pay} · {tx.status}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </Panel>

        <Panel title="Ringkasan Operasional" subtitle="Panel cepat untuk owner, manager, dan kasir.">
          <div className="space-y-4">
            <div className="rounded-3xl border border-[#1535D4]/30 bg-[#1535D4]/28 p-5">
              <ReceiptText className="h-5 w-5 text-[#F9F9FF]" />
              <p className="mt-4 text-sm uppercase tracking-[0.2em] text-[#F9F9FF]">Pendapatan vs kemarin</p>
              <div className="mt-3 flex items-center gap-3">
                {delta >= 0 ? <ArrowUpRight className="h-5 w-5 text-[#C8F400]" /> : <ArrowDownRight className="h-5 w-5 text-[#e0483c]" />}
                <p className="text-2xl font-display text-white">{delta.toFixed(1)}%</p>
              </div>
            </div>
            <div className="rounded-3xl border border-[#C8F400]/18 bg-[#C8F400]/10 p-5">
              <Warehouse className="h-5 w-5 text-[#C8F400]" />
              <p className="mt-4 text-sm uppercase tracking-[0.2em] text-[#C8F400]">Stok gudang</p>
              <p className="mt-2 text-2xl font-display text-white">{stockLow} item menipis</p>
            </div>
            <div className="brand-soft-card rounded-3xl p-5">
              <CalendarCheck2 className="h-5 w-5 text-white" />
              <p className="mt-4 text-sm uppercase tracking-[0.2em] text-slate-400">Kehadiran hari ini</p>
              <div className="mt-3 space-y-2">
                {employees.map((employee) => (
                  <div key={employee.id} className="flex items-center justify-between text-sm">
                    <span className="text-slate-300">{employee.name}</span>
                    <span className="text-white">{employee.present ? `Masuk ${employee.in}` : 'Belum hadir'}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </Panel>
      </section>

      <section className="grid gap-6 xl:grid-cols-3">
        <Panel title="Teknisi Teratas" subtitle="Ranking teknisi berdasarkan jumlah motor.">
          <div className="space-y-3">
            {topTechnicians.map(([name, count], index) => (
              <div key={name} className="brand-soft-card flex items-center justify-between rounded-2xl p-4">
                <div>
                  <p className="text-xs uppercase tracking-[0.2em] text-slate-500">Rank {index + 1}</p>
                  <p className="mt-2 font-medium text-white">{name}</p>
                </div>
                <p className="font-display text-3xl text-[#C8F400]">{count}</p>
              </div>
            ))}
          </div>
        </Panel>

        <Panel title="Layanan Terlaris" subtitle="Semua role dapat melihat layanan paling sering dipilih.">
          <div className="space-y-3">
            {topServices.map(([name, count]) => (
              <div key={name} className="brand-soft-card flex items-center justify-between rounded-2xl p-4">
                <span className="text-slate-200">{name}</span>
                <span className="font-display text-2xl text-white">{count}</span>
              </div>
            ))}
          </div>
        </Panel>

        <Panel title="Ringkasan Bisnis" subtitle="Pendapatan bulanan dan tahunan untuk owner.">
          <div className="space-y-4">
            <div className="brand-soft-card rounded-2xl p-4">
              <p className="text-sm uppercase tracking-[0.2em] text-slate-400">Pendapatan bulan ini</p>
              <p className="mt-3 font-display text-3xl text-white">{formatCurrency(todayRevenue * 18)}</p>
            </div>
            <div className="brand-soft-card rounded-2xl p-4">
              <p className="text-sm uppercase tracking-[0.2em] text-slate-400">Pendapatan tahun ini</p>
              <p className="mt-3 font-display text-3xl text-white">{formatCurrency(todayRevenue * 220)}</p>
            </div>
            <div className="brand-soft-card rounded-2xl p-4">
              <p className="text-sm uppercase tracking-[0.2em] text-slate-400">Role aktif</p>
              <p className="mt-3 font-display text-2xl text-[#C8F400]">{currentRole === 'manager_ops' ? 'Manager Ops' : currentRole === 'owner' ? 'Owner' : 'Kasir'}</p>
            </div>
          </div>
        </Panel>
      </section>
    </div>
  );
}
