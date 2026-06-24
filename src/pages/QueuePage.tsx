import { Panel } from '@/components/ui/Panel';
import { useCashierStore } from '@/store/useCashierStore';
import { formatDateTime } from '@/utils/format';

export default function QueuePage() {
  const { transactions, updateQueueStatus, runQuickQC } = useCashierStore();
  const columns = [
    { key: 'Masuk' as const, title: 'Masuk', description: 'Foto sebelum dan assign teknisi' },
    { key: 'Dicuci' as const, title: 'Dicuci', description: 'Quick QC dan selesai cuci' },
    { key: 'Selesai' as const, title: 'Selesai', description: 'Menunggu QC atau sudah diverifikasi' },
  ];

  return (
    <Panel title="Antrian Harian" subtitle="Kanban `Masuk → Dicuci → Selesai` dengan foto sebelum dan aksi cepat.">
      <div className="grid gap-4 xl:grid-cols-3">
        {columns.map((column) => (
          <div key={column.key} className="brand-soft-card rounded-3xl p-4">
            <p className="font-display text-2xl uppercase tracking-[0.12em] text-white">{column.title}</p>
            <p className="mt-1 text-sm text-slate-400">{column.description}</p>
            <div className="mt-4 space-y-3">
              {transactions
                .filter((tx) => tx.status === column.key)
                .map((tx) => (
                  <div key={tx.id} className="rounded-2xl border border-white/10 bg-[#2e3140]/90 p-4">
                    <p className="font-medium text-white">{tx.plate}</p>
                    <p className="mt-1 text-sm text-slate-300">{tx.merk} · {tx.cust}</p>
                    <p className="mt-1 text-xs uppercase tracking-[0.2em] text-[#C8F400]">{tx.washer}</p>
                    <p className="mt-2 text-xs text-slate-500">{formatDateTime(tx.time)}</p>
                    <div className="mt-4 flex flex-wrap gap-2">
                      {column.key === 'Masuk' && (
                        <>
                          <button type="button" className="brand-secondary-btn rounded-xl px-3 py-2 text-xs">
                            Foto Sebelum
                          </button>
                          <button type="button" onClick={() => updateQueueStatus(tx.id, 'Dicuci')} className="brand-primary-btn rounded-xl px-3 py-2 text-xs">
                            Mulai Cuci
                          </button>
                        </>
                      )}
                      {column.key === 'Dicuci' && (
                        <>
                          <button type="button" onClick={() => runQuickQC(tx.id)} className="brand-secondary-btn rounded-xl px-3 py-2 text-xs">
                            Quick QC
                          </button>
                          <button type="button" onClick={() => updateQueueStatus(tx.id, 'Selesai')} className="brand-primary-btn rounded-xl px-3 py-2 text-xs">
                            Selesai
                          </button>
                        </>
                      )}
                      {column.key === 'Selesai' && (
                        <button type="button" onClick={() => runQuickQC(tx.id)} className="brand-secondary-btn rounded-xl px-3 py-2 text-xs">
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
  );
}
