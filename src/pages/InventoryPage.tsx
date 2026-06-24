import { Panel } from '@/components/ui/Panel';
import { useCashierStore } from '@/store/useCashierStore';
import { formatCurrency, formatDateTime } from '@/utils/format';

export default function InventoryPage() {
  const { inventory, stockMoves, recordStockMove, transactions, currentRole } = useCashierStore();
  const canEdit = currentRole === 'owner' || currentRole === 'manager_ops';
  const completedMotors = transactions.filter((tx) => tx.status === 'Selesai').length;
  const totalAsset = inventory.reduce((sum, item) => sum + item.stock * item.costPrice, 0);
  const lowStock = inventory.filter((item) => item.stock <= item.min).length;
  const pendingVerification = stockMoves.filter((move) => !move.verified).length;

  function effectiveStock(stock: number, litersPerUnit: number, motorsPerLiter: number) {
    const usageToday = motorsPerLiter >= 999 ? 0 : completedMotors / (litersPerUnit * motorsPerLiter);
    return Math.max(0, stock - usageToday);
  }

  return (
    <div className="space-y-6">
      <section className="grid gap-4 xl:grid-cols-4">
        <div className="brand-panel rounded-3xl p-5">
          <p className="text-xs uppercase tracking-[0.2em] text-[#C8F400]">Total item</p>
          <p className="mt-3 font-display text-4xl text-white">{inventory.length}</p>
        </div>
        <div className="brand-panel rounded-3xl p-5">
          <p className="text-xs uppercase tracking-[0.2em] text-[#C8F400]">Stok menipis</p>
          <p className="mt-3 font-display text-4xl text-white">{lowStock}</p>
        </div>
        <div className="brand-panel rounded-3xl p-5">
          <p className="text-xs uppercase tracking-[0.2em] text-[#C8F400]">Pending verifikasi</p>
          <p className="mt-3 font-display text-4xl text-white">{pendingVerification}</p>
        </div>
        <div className="brand-panel rounded-3xl p-5">
          <p className="text-xs uppercase tracking-[0.2em] text-[#C8F400]">Total aset</p>
          <p className="mt-3 font-display text-4xl text-white">{formatCurrency(totalAsset)}</p>
        </div>
      </section>

      <Panel title="Gudang" subtitle="Stok fisik, sisa efektif, formula pemakaian otomatis, dan aksi restok atau pakai.">
        <div className="overflow-hidden rounded-3xl border border-white/10">
          <table className="min-w-full divide-y divide-white/10 text-left text-sm">
            <thead className="bg-white/5 text-slate-400">
              <tr>
                <th className="px-4 py-3">Item</th>
                <th className="px-4 py-3">Stok fisik</th>
                <th className="px-4 py-3">Sisa efektif</th>
                <th className="px-4 py-3">Formula</th>
                <th className="px-4 py-3">Total aset</th>
                <th className="px-4 py-3">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/10">
              {inventory.map((item) => (
                <tr key={item.id} className="bg-[#2e3140]/55">
                  <td className="px-4 py-4">
                    <p className="font-medium text-white">{item.name}</p>
                    <p className="text-xs text-slate-400">{item.unit} · min {item.min}</p>
                  </td>
                  <td className="px-4 py-4 text-white">{item.stock}</td>
                  <td className="px-4 py-4 text-[#C8F400]">{effectiveStock(item.stock, item.litersPerUnit, item.motorsPerLiter).toFixed(1)}</td>
                  <td className="px-4 py-4 text-slate-300">1 unit ({item.litersPerUnit}L) = {item.motorsPerLiter} motor</td>
                  <td className="px-4 py-4 text-white">{formatCurrency(item.stock * item.costPrice)}</td>
                  <td className="px-4 py-4">
                    <div className="flex flex-wrap gap-2">
                      <button
                        type="button"
                        onClick={() =>
                          canEdit &&
                          recordStockMove(item.id, 'out', 1, 'Pakai operasional', currentRole === 'owner' ? 'Owner' : 'Manager Ops')
                        }
                        className="brand-secondary-btn rounded-xl px-3 py-2 text-xs"
                        disabled={!canEdit}
                      >
                        Pakai
                      </button>
                      <button
                        type="button"
                        onClick={() =>
                          canEdit &&
                          recordStockMove(item.id, 'in', 1, 'Restok harian', currentRole === 'owner' ? 'Owner' : 'Manager Ops')
                        }
                        className="brand-primary-btn rounded-xl px-3 py-2 text-xs"
                        disabled={!canEdit}
                      >
                        Restok
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {!canEdit && <p className="mt-4 text-sm text-slate-400">Kasir hanya bisa melihat data gudang tanpa melakukan edit.</p>}
      </Panel>

      <Panel title="Pergerakan Stok" subtitle="Semua mutasi stok dan status verifikasi manager ops.">
        <div className="space-y-3">
          {stockMoves.map((move) => (
            <div key={move.id} className="brand-soft-card flex items-center justify-between rounded-2xl p-4">
              <div>
                <p className="font-medium text-white">{inventory.find((item) => item.id === move.itemId)?.name}</p>
                <p className="mt-1 text-sm text-slate-300">{move.type === 'in' ? 'Restok' : 'Pakai'} {move.qty} · {move.note}</p>
                <p className="mt-1 text-xs text-slate-500">{move.by} · {formatDateTime(move.time)}</p>
              </div>
              <span className={`rounded-full px-3 py-1 text-xs uppercase tracking-[0.2em] ${move.verified ? 'bg-[#C8F400]/12 text-[#C8F400]' : 'bg-[#e8a93b]/12 text-[#e8a93b]'}`}>
                {move.verified ? 'Verified' : 'Pending'}
              </span>
            </div>
          ))}
        </div>
      </Panel>
    </div>
  );
}
