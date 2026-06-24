import { Panel } from '@/components/ui/Panel';
import { useCashierStore } from '@/store/useCashierStore';
import { formatDateTime } from '@/utils/format';

const labelMap = {
  body: 'Body & Cat',
  velg: 'Velg & Ban',
  spakbor: 'Spakbor',
  jok: 'Jok',
  spionLampu: 'Spion & Lampu',
  areaMesin: 'Area Mesin',
  kekeringan: 'Kekeringan',
};

export default function QualityPage() {
  const { pendingQC, qcRecords, dailyChecks, runQuickQC } = useCashierStore();

  return (
    <div className="grid gap-6 xl:grid-cols-[0.95fr_1.05fr]">
      <div className="space-y-6">
        <Panel title="Pending QC" subtitle="Task list QC manager ops. Kasir dapat membantu bila manager tidak ada.">
          <div className="space-y-3">
            {pendingQC.map((item) => (
              <div key={item.id} className="brand-soft-card rounded-3xl p-4">
                <p className="font-medium text-white">{item.plate} · {item.merk}</p>
                <p className="mt-1 text-sm text-slate-300">{item.cust} · dicuci {item.washer}</p>
                <p className="mt-1 text-xs text-slate-500">{formatDateTime(item.time)}</p>
                <button type="button" onClick={() => runQuickQC(item.txId)} className="brand-primary-btn mt-4 rounded-2xl px-4 py-3 text-sm font-medium">
                  QC Sekarang
                </button>
              </div>
            ))}
          </div>
        </Panel>

        <Panel title="Cek Produk Harian" subtitle="Checklist buka dan tutup operasional.">
          <div className="space-y-3">
            {dailyChecks.map((check) => (
              <div key={check.id} className="brand-soft-card flex items-center justify-between rounded-2xl p-4">
                <span className="text-white">{check.label}</span>
                <span className={`rounded-full px-3 py-1 text-xs uppercase tracking-[0.2em] ${check.state === 'Siap' ? 'bg-[#C8F400]/12 text-[#C8F400]' : 'bg-[#e8a93b]/12 text-[#e8a93b]'}`}>
                  {check.state}
                </span>
              </div>
            ))}
          </div>
        </Panel>
      </div>

      <Panel title="Riwayat Quality Check" subtitle="Checklist 7 titik, skor rata-rata, dan foto sesudah cuci.">
        <div className="space-y-4">
          {qcRecords.map((qc) => (
            <div key={qc.id} className="brand-soft-card rounded-3xl p-4">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="font-medium text-white">{qc.plate} · {qc.merk}</p>
                  <p className="mt-1 text-sm text-slate-300">Dicuci {qc.washer}</p>
                  <p className="mt-1 text-xs text-slate-500">{formatDateTime(qc.time)}</p>
                </div>
                <span className="rounded-full bg-[#C8F400]/12 px-3 py-1 text-sm font-semibold text-[#C8F400]">
                  Skor {qc.score}
                </span>
              </div>
              <div className="mt-4 grid gap-3 md:grid-cols-2">
                {Object.entries(qc.details).map(([key, value]) => (
                  <div key={key} className="rounded-2xl border border-white/10 bg-[#2e3140]/80 p-3">
                    <p className="text-sm text-slate-300">{labelMap[key as keyof typeof labelMap]}</p>
                    <p className="mt-1 font-medium text-white">
                      {value === 100 ? 'Bersih' : value === 70 ? 'Kurang Bersih' : 'Kotor'}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </Panel>
    </div>
  );
}
