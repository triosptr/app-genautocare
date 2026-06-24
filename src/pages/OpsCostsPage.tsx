import { Panel } from '@/components/ui/Panel';
import { useCashierStore } from '@/store/useCashierStore';
import { formatCurrency } from '@/utils/format';

export default function OpsCostsPage() {
  const { opsCosts } = useCashierStore();
  const daily = opsCosts.filter((cost) => cost.type === 'harian');
  const monthly = opsCosts.filter((cost) => cost.type === 'bulanan');
  const dailyTotal = daily.reduce((sum, cost) => sum + cost.amount, 0);
  const monthlyTotal = monthly.reduce((sum, cost) => sum + cost.amount, 0);

  return (
    <div className="grid gap-6 xl:grid-cols-2">
      <Panel title="Biaya Operasional Harian" subtitle="Bensin, konsumsi, dan biaya harian lain.">
        <div className="space-y-3">
          {daily.map((cost) => (
            <div key={cost.id} className="brand-soft-card flex items-center justify-between rounded-2xl p-4">
              <div>
                <p className="font-medium text-white">{cost.name}</p>
                <p className="mt-1 text-sm text-slate-400">{new Date(cost.date).toLocaleDateString('id-ID')}</p>
              </div>
              <span className="text-white">{formatCurrency(cost.amount)}</span>
            </div>
          ))}
        </div>
        <div className="mt-6 rounded-3xl border border-[#C8F400]/18 bg-[#C8F400]/10 p-5">
          <p className="text-xs uppercase tracking-[0.2em] text-[#C8F400]">Total harian</p>
          <p className="mt-3 font-display text-4xl text-white">{formatCurrency(dailyTotal)}</p>
        </div>
      </Panel>

      <Panel title="Biaya Bulanan" subtitle="Sewa, gaji, dan biaya tetap yang masuk rekap bulanan.">
        <div className="space-y-3">
          {monthly.map((cost) => (
            <div key={cost.id} className="brand-soft-card flex items-center justify-between rounded-2xl p-4">
              <div>
                <p className="font-medium text-white">{cost.name}</p>
                <p className="mt-1 text-sm text-slate-400">{new Date(cost.date).toLocaleDateString('id-ID')}</p>
              </div>
              <span className="text-white">{formatCurrency(cost.amount)}</span>
            </div>
          ))}
        </div>
        <div className="mt-6 rounded-3xl border border-[#1535D4]/25 bg-[#1535D4]/25 p-5">
          <p className="text-xs uppercase tracking-[0.2em] text-white">Total bulanan</p>
          <p className="mt-3 font-display text-4xl text-white">{formatCurrency(monthlyTotal)}</p>
        </div>
      </Panel>
    </div>
  );
}
