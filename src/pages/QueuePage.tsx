import { useState } from 'react';
import { QCModal } from '@/components/qc/QCModal';
import { Panel } from '@/components/ui/Panel';
import { useCashierStore } from '@/store/useCashierStore';
import type { Transaction } from '@/types/app';
import { formatDateTime } from '@/utils/format';

export default function QueuePage() {
  const { transactions, updateQueueStatus, saveQC, markBeforePhoto, deviceMode } = useCashierStore();
  const [qcTarget, setQCTarget] = useState<Transaction | null>(null);
  const columns = [
    { key: 'Masuk' as const, title: 'Masuk', description: 'Foto sebelum dan assign teknisi' },
    { key: 'Dicuci' as const, title: 'Dicuci', description: 'Pantau proses cuci dan lanjutkan ke selesai' },
    { key: 'Selesai' as const, title: 'Selesai', description: 'Menunggu QC atau sudah diverifikasi' },
  ];

  return (
    <>
      <Panel title="Antrian Harian" subtitle="Pantau status motor yang sedang diproses.">
        <div className={`grid gap-4 ${deviceMode === 'mobile' ? 'grid-cols-1' : 'xl:grid-cols-3'}`}>
          {columns.map((column) => (
            <div key={column.key} className="brand-soft-card rounded-3xl p-4">
              <p className="font-display text-xl uppercase tracking-[0.08em] text-slate-900">{column.title}</p>
              <p className="mt-1 text-sm text-slate-500">{column.description}</p>
              <div className="mt-4 space-y-3">
                {transactions
                  .filter((tx) => tx.status === column.key)
                  .map((tx) => (
                    <div key={tx.id} className="rounded-2xl border border-slate-200 bg-[#f8fafc] p-4">
                      <p className="font-medium text-slate-900">{tx.plate}</p>
                      <p className="mt-1 text-sm text-slate-500">{tx.merk} · {tx.cust}</p>
                      <p className="mt-1 text-[11px] uppercase tracking-[0.16em] text-[#1535D4]">{tx.washer}</p>
                      <p className="mt-2 text-xs text-slate-500">{formatDateTime(tx.time)}</p>
                      <div className="mt-3 flex flex-wrap gap-2">
                        {tx.beforePhoto && (
                          <span className="rounded-full border border-[#1535D4]/10 bg-[#eef4ff] px-2 py-1 text-[10px] uppercase tracking-[0.14em] text-[#1535D4]">
                            Foto Sebelum Siap
                          </span>
                        )}
                        {tx.afterPhoto && (
                          <span className="rounded-full border border-[#C8F400]/20 bg-[#f5ffcf] px-2 py-1 text-[10px] uppercase tracking-[0.14em] text-[#516000]">
                            Foto Sesudah Siap
                          </span>
                        )}
                      </div>
                      <div className="mt-4 flex flex-wrap gap-2">
                        {column.key === 'Masuk' && (
                          <>
                            <button type="button" onClick={() => markBeforePhoto(tx.id)} className="brand-secondary-btn rounded-xl px-3 py-2 text-xs">
                              {tx.beforePhoto ? 'Ulang Foto Sebelum' : 'Foto Sebelum'}
                            </button>
                            <button type="button" onClick={() => updateQueueStatus(tx.id, 'Dicuci')} className="brand-primary-btn rounded-xl px-3 py-2 text-xs">
                              Mulai Cuci
                            </button>
                          </>
                        )}
                        {column.key === 'Dicuci' && (
                          <>
                            <button type="button" onClick={() => setQCTarget(tx)} className="brand-secondary-btn rounded-xl px-3 py-2 text-xs">
                              QC Popup
                            </button>
                            <button type="button" onClick={() => updateQueueStatus(tx.id, 'Selesai')} className="brand-primary-btn rounded-xl px-3 py-2 text-xs">
                              Selesai
                            </button>
                          </>
                        )}
                        {column.key === 'Selesai' && (
                          <button type="button" onClick={() => setQCTarget(tx)} className="brand-primary-btn rounded-xl px-3 py-2 text-xs">
                            QC →
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          ))}
        </div>
      </Panel>

      <QCModal
        open={Boolean(qcTarget)}
        transaction={qcTarget}
        onClose={() => setQCTarget(null)}
        onSubmit={(details, afterPhoto) => {
          if (!qcTarget) {
            return;
          }
          saveQC(qcTarget.id, details, afterPhoto);
          setQCTarget(null);
        }}
      />
    </>
  );
}
