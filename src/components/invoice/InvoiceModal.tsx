import { useEffect } from 'react';
import { createWhatsAppLink } from '@/lib/whatsapp';
import type { Transaction } from '@/types/app';
import { formatCurrency } from '@/utils/format';

interface InvoiceModalProps {
  transaction: Transaction | null;
  businessName: string;
  receiptFooter: string;
  onClose: () => void;
}

export function InvoiceModal({ transaction, businessName, receiptFooter, onClose }: InvoiceModalProps) {
  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') onClose();
    }
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  if (!transaction) return null;

  const invoiceMessage = [
    businessName,
    `No Invoice: ${transaction.invoiceNo}`,
    `Tanggal: ${new Date(transaction.time).toLocaleDateString('id-ID')}`,
    `Motor: ${transaction.merk} - ${transaction.plate}`,
    `Layanan: ${transaction.services.join(', ')}`,
    `Subtotal: ${formatCurrency(transaction.subtotal)}`,
    `Diskon: ${formatCurrency(transaction.disc)}`,
    `Total: ${formatCurrency(transaction.total)}`,
    `Metode Bayar: ${transaction.pay.toUpperCase()}`,
    `Teknisi: ${transaction.washer}`,
    receiptFooter,
  ].join('\n');

  const waLink = createWhatsAppLink(transaction.customerPhone || '081234567890', invoiceMessage);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
      <div className="w-full max-w-[420px] overflow-hidden rounded-[24px] bg-white shadow-2xl">
        <div className="bg-[#111318] p-6 text-white">
          <div className="flex items-center gap-2">
            <span className="font-display text-2xl font-black italic tracking-[-0.04em] text-[#C8F400]">GEN</span>
            <span className="font-display text-2xl font-black tracking-tight">AUTO CARE</span>
          </div>
          <p className="mt-2 text-sm text-slate-400">
            {transaction.invoiceNo} · {new Date(transaction.time).toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' })}
          </p>
        </div>

        <div className="p-6">
          <div className="space-y-3 border-b border-slate-200 pb-4 text-sm">
            <div className="flex justify-between">
              <span className="text-slate-500">Motor</span>
              <span className="font-medium text-slate-900">{transaction.merk} · {transaction.plate}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Dikerjakan</span>
              <span className="font-medium text-slate-900">{transaction.washer}</span>
            </div>
          </div>

          <div className="border-b border-slate-200 py-4 text-sm">
            <div className="flex justify-between">
              <span className="font-medium text-slate-900">{transaction.services.join(', ')}</span>
              <span className="font-medium text-slate-900">{formatCurrency(transaction.subtotal)}</span>
            </div>
          </div>

          <div className="space-y-2 py-4 text-sm">
            <div className="flex justify-between">
              <span className="text-slate-500">Subtotal</span>
              <span className="text-slate-500">{formatCurrency(transaction.subtotal)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Diskon</span>
              <span className="text-slate-500">- {formatCurrency(transaction.disc)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Pembayaran</span>
              <span className="text-slate-500 uppercase">{transaction.pay}</span>
            </div>
          </div>

          <div className="mt-2 rounded-[16px] bg-[#1535D4] p-5 text-white">
            <div className="flex items-center justify-between">
              <span className="font-medium tracking-wide">TOTAL</span>
              <span className="font-display text-3xl">{formatCurrency(transaction.total)}</span>
            </div>
          </div>

          <div className="mt-6 space-y-3">
            <a
              href={waLink}
              target="_blank"
              rel="noreferrer"
              className="flex w-full items-center justify-center gap-2 rounded-[16px] bg-[#2f9e44] px-4 py-4 text-[15px] font-semibold text-white transition hover:bg-[#2b8a3e]"
            >
              Kirim Invoice ke WhatsApp
            </a>
            <button
              type="button"
              onClick={onClose}
              className="w-full rounded-[16px] px-4 py-4 text-[15px] font-medium text-slate-500 transition hover:bg-slate-100 hover:text-slate-900"
            >
              Tutup
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}