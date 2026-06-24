import { Panel } from '@/components/ui/Panel';
import { createWhatsAppLink } from '@/lib/whatsapp';
import { useCashierStore } from '@/store/useCashierStore';
import { formatCurrency } from '@/utils/format';

export default function DailyReportPage() {
  const { transactions, settings } = useCashierStore();
  const totalRevenue = transactions.reduce((sum, tx) => sum + tx.total, 0);
  const paymentGroups = ['cash', 'qris', 'transfer'].map((method) => ({
    method,
    total: transactions.filter((tx) => tx.pay === method).reduce((sum, tx) => sum + tx.total, 0),
  }));
  const reportMessage = [
    'Laporan Harian GEN AUTO CARE',
    `Total pendapatan: ${formatCurrency(totalRevenue)}`,
    `Jumlah transaksi: ${transactions.length}`,
    ...paymentGroups.map((entry) => `${entry.method.toUpperCase()}: ${formatCurrency(entry.total)}`),
  ].join('\n');

  return (
    <div className="grid gap-6 xl:grid-cols-[0.95fr_1.05fr]">
      <Panel title="Laporan Harian" subtitle="Total pendapatan, jumlah transaksi, dan breakdown metode bayar.">
        <div className="grid gap-4 md:grid-cols-3">
          <div className="brand-soft-card rounded-3xl p-4">
            <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Pendapatan</p>
            <p className="mt-3 font-display text-3xl text-white">{formatCurrency(totalRevenue)}</p>
          </div>
          <div className="brand-soft-card rounded-3xl p-4">
            <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Jumlah transaksi</p>
            <p className="mt-3 font-display text-3xl text-white">{transactions.length}</p>
          </div>
          <div className="brand-soft-card rounded-3xl p-4">
            <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Siap PDF</p>
            <p className="mt-3 text-sm text-slate-300">Struktur laporan siap dikembangkan ke export PDF.</p>
          </div>
        </div>
        <div className="mt-6 space-y-3">
          {paymentGroups.map((group) => (
            <div key={group.method} className="brand-soft-card flex items-center justify-between rounded-2xl p-4">
              <span className="text-white">{group.method.toUpperCase()}</span>
              <span className="text-[#C8F400]">{formatCurrency(group.total)}</span>
            </div>
          ))}
        </div>
      </Panel>

      <Panel title="Kirim Ke Owner" subtitle="Ringkasan laporan dapat dikirim cepat lewat WhatsApp owner.">
        <div className="space-y-4">
          <div className="brand-soft-card rounded-3xl p-4">
            <p className="text-sm text-slate-300 whitespace-pre-line">{reportMessage}</p>
          </div>
          <a
            href={createWhatsAppLink('081234567890', reportMessage)}
            target="_blank"
            rel="noreferrer"
            className="brand-primary-btn inline-flex rounded-2xl px-4 py-3 text-sm font-medium"
          >
            Kirim via WhatsApp
          </a>
          <p className="text-sm text-slate-400">{settings.receiptFooter}</p>
        </div>
      </Panel>
    </div>
  );
}
