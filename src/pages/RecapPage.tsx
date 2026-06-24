import { Panel } from '@/components/ui/Panel';
import { useCashierStore } from '@/store/useCashierStore';
import { formatCurrency } from '@/utils/format';

export default function RecapPage() {
  const { transactions, inventory, employees, opsCosts, qcRecords } = useCashierStore();
  const gross = transactions.reduce((sum, tx) => sum + tx.total, 0);
  const materialCost = inventory.reduce((sum, item) => sum + Math.min(item.stock, 1) * item.costPrice * 0.15, 0);
  const opsTotal = opsCosts.reduce((sum, cost) => sum + cost.amount, 0);
  const net = gross - materialCost - opsTotal;
  const technicians = employees.filter((employee) => employee.role === 'cuci');

  return (
    <div className="space-y-6">
      <section className="grid gap-4 xl:grid-cols-4">
        <div className="brand-panel rounded-3xl p-5">
          <p className="text-xs uppercase tracking-[0.2em] text-[#C8F400]">Kotor</p>
          <p className="mt-3 font-display text-4xl text-white">{formatCurrency(gross)}</p>
        </div>
        <div className="brand-panel rounded-3xl p-5">
          <p className="text-xs uppercase tracking-[0.2em] text-[#C8F400]">Modal bahan</p>
          <p className="mt-3 font-display text-4xl text-white">{formatCurrency(materialCost)}</p>
        </div>
        <div className="brand-panel rounded-3xl p-5">
          <p className="text-xs uppercase tracking-[0.2em] text-[#C8F400]">Biaya operasional</p>
          <p className="mt-3 font-display text-4xl text-white">{formatCurrency(opsTotal)}</p>
        </div>
        <div className="brand-panel rounded-3xl p-5">
          <p className="text-xs uppercase tracking-[0.2em] text-[#C8F400]">Bersih</p>
          <p className="mt-3 font-display text-4xl text-white">{formatCurrency(net)}</p>
        </div>
      </section>

      <Panel title="Bagi Hasil Teknisi" subtitle="Jumlah motor, skor QC rata-rata, dan total komisi per teknisi.">
        <div className="grid gap-4 xl:grid-cols-3">
          {technicians.map((tech) => {
            const txByTech = transactions.filter((tx) => tx.washerId === tech.id);
            const qcByTech = qcRecords.filter((qc) => qc.washerId === tech.id);
            const avgScore = qcByTech.length ? Math.round(qcByTech.reduce((sum, qc) => sum + qc.score, 0) / qcByTech.length) : 0;
            const totalKomisi = txByTech.reduce((sum, tx) => sum + tx.komisi, 0);
            return (
              <div key={tech.id} className="brand-soft-card rounded-3xl p-4">
                <p className="font-display text-2xl uppercase tracking-[0.08em] text-white">{tech.name}</p>
                <div className="mt-4 space-y-3 text-sm text-slate-300">
                  <div className="flex items-center justify-between">
                    <span>Jumlah motor</span>
                    <span className="text-white">{txByTech.length}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Rata-rata QC</span>
                    <span className="text-[#C8F400]">{avgScore}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Total komisi</span>
                    <span className="text-white">{formatCurrency(totalKomisi)}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </Panel>
    </div>
  );
}
