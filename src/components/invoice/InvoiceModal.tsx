import { useEffect, useMemo, useRef, useState } from 'react';
import html2canvas from 'html2canvas';
import { createWhatsAppLink } from '@/lib/whatsapp';
import { useCashierStore } from '@/store/useCashierStore';
import type { PaymentInfo, Transaction } from '@/types/app';
import { formatCurrency } from '@/utils/format';

interface InvoiceModalProps {
  transaction: Transaction | null;
  businessName: string;
  paymentInfo: PaymentInfo;
  receiptFooter: string;
  onClose: () => void;
}

export function InvoiceModal({ transaction, businessName, paymentInfo, receiptFooter, onClose }: InvoiceModalProps) {
  const invoiceRef = useRef<HTMLDivElement>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [status, setStatus] = useState<string | null>(null);

  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape' && !isProcessing) onClose();
    }
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose, isProcessing]);

  if (!transaction) return null;

  const services = useCashierStore((state) => state.services);
  const invoiceLines = useMemo(() => {
    const byId = Object.fromEntries(services.map((service) => [service.id, service]));
    return transaction.serviceIds.map((id) => {
      const svc = byId[id];
      return {
        id,
        name: svc?.name ?? id,
        price: svc?.price ?? 0,
      };
    });
  }, [services, transaction.serviceIds]);

  const subtotal = invoiceLines.reduce((sum, line) => sum + line.price, 0);
  const discount = transaction.disc ?? 0;
  const total = Math.max(0, subtotal - discount);
  const invoiceDate = new Date(transaction.time);

  const invoiceMessage = [
    `*${businessName}*`,
    `No Invoice: ${transaction.invoiceNo}`,
    `Tanggal: ${invoiceDate.toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' })}`,
    `Motor: ${transaction.merk} - ${transaction.plate}`,
    `Layanan: ${transaction.services.join(', ')}`,
    `Subtotal: ${formatCurrency(subtotal)}`,
    `Diskon: ${formatCurrency(transaction.disc)}`,
    `Total: ${formatCurrency(total)}`,
    `Metode Bayar: ${transaction.pay.toUpperCase()}`,
    `Teknisi: ${transaction.washer}`,
    '',
    'Invoice sudah tersalin. Tinggal paste ke chat lalu kirim.',
    receiptFooter,
  ].join('\n');

  const waLink = createWhatsAppLink(transaction.customerPhone || '081234567890', invoiceMessage);

  const handleSendWA = async () => {
    if (!invoiceRef.current) return;
    
    try {
      setIsProcessing(true);
      setStatus(null);
      
      const canvas = await html2canvas(invoiceRef.current, { 
        scale: 2,
        backgroundColor: null,
        useCORS: true,
        windowWidth: invoiceRef.current.scrollWidth,
        windowHeight: invoiceRef.current.scrollHeight,
      });
      
      canvas.toBlob(async (blob) => {
        if (!blob) throw new Error('Gagal memproses gambar');
        
        const file = new File([blob], `${transaction.invoiceNo}.png`, { type: 'image/png' });

        const canShareFiles =
          typeof navigator !== 'undefined' &&
          typeof navigator.share === 'function' &&
          (!navigator.canShare || navigator.canShare({ files: [file] }));

        let copiedText = false;
        let copiedImage = false;

        try {
          await navigator.clipboard.writeText(invoiceMessage);
          copiedText = true;
        } catch {}

        try {
          await navigator.clipboard.write([
            new ClipboardItem({
              'image/png': blob,
            })
          ]);
          copiedImage = true;
        } catch (clipboardError) {
          if (canShareFiles) {
            try {
              await navigator.share({
                title: `Invoice ${businessName}`,
                text: invoiceMessage,
                files: [file],
              });
              setIsProcessing(false);
              return;
            } catch {}
          }

          try {
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `${transaction.invoiceNo}.png`;
            a.click();
            URL.revokeObjectURL(url);
          } catch {}
        }

        const nextStatus =
          copiedImage && copiedText
            ? 'Gambar + teks invoice sudah tercopy. WhatsApp dibuka, tinggal paste lalu kirim.'
            : copiedImage
              ? 'Gambar invoice sudah tercopy. WhatsApp dibuka, tinggal paste lalu kirim.'
              : copiedText
                ? 'Teks invoice sudah tercopy. WhatsApp dibuka, tinggal paste lalu kirim.'
                : 'Gambar invoice ter-download. WhatsApp dibuka, lampirkan gambar lalu kirim.';

        setStatus(nextStatus);
        window.open(waLink, '_blank');
        setIsProcessing(false);
      }, 'image/png');
      
    } catch (error) {
      console.error('Error generating invoice image:', error);
      setStatus('Gagal memproses gambar. WhatsApp dibuka dengan teks invoice.');
      window.open(waLink, '_blank');
      setIsProcessing(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
      <div className="w-full max-w-[420px] overflow-hidden rounded-[24px] bg-white shadow-2xl">
        <div className="p-4">
          <div
            ref={invoiceRef}
            className="relative aspect-[3/4] w-full overflow-hidden rounded-[20px] bg-[#1535D4] text-white shadow-[0_18px_50px_-26px_rgba(0,0,0,0.6)]"
          >
            <div className="absolute inset-0 opacity-[0.18]" style={{ backgroundImage: 'linear-gradient(rgba(255,255,255,0.14) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.14) 1px, transparent 1px)', backgroundSize: '36px 36px' }} />
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(200,244,0,0.18),_transparent_42%),radial-gradient(circle_at_bottom_right,_rgba(17,19,24,0.22),_transparent_55%)]" />

            <div className="relative flex h-full flex-col p-6">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <div className="inline-flex items-center gap-2 rounded-full border border-white/12 bg-white/8 px-3 py-2">
                    <span className="font-display text-[16px] font-black italic tracking-[-0.04em] text-[#C8F400]">GEN</span>
                    <span className="font-display text-[16px] font-black tracking-tight text-white">AUTO CARE</span>
                  </div>
                  <p className="mt-3 text-[11px] uppercase tracking-[0.22em] text-white/68">GROOM EVERY NEED</p>
                </div>

                <div className="text-right">
                  <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-white/70">Invoice</p>
                  <p className="mt-2 text-sm font-semibold text-white">{transaction.invoiceNo}</p>
                  <p className="mt-1 text-xs text-white/70">{invoiceDate.toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' })}</p>
                </div>
              </div>

              <div className="mt-8">
                <p className="font-display text-[46px] font-black leading-[0.92] tracking-[-0.06em] text-[#C8F400] drop-shadow-[0_10px_28px_rgba(0,0,0,0.45)] sm:text-[60px]">
                  INVOICE
                </p>
              </div>

              <div className="mt-7 grid grid-cols-2 gap-4 text-sm">
                <div className="rounded-[16px] border border-white/10 bg-white/8 p-4">
                  <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-white/70">Billing To</p>
                  <p className="mt-3 font-semibold text-white">{transaction.cust || 'Walk In'}</p>
                  <p className="mt-1 text-xs text-white/70">{transaction.customerPhone || '-'}</p>
                </div>
                <div className="rounded-[16px] border border-white/10 bg-white/8 p-4">
                  <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-white/70">Detail Motor</p>
                  <p className="mt-3 font-semibold text-white">{transaction.merk}</p>
                  <p className="mt-1 text-xs text-white/70">{transaction.plate}</p>
                  <p className="mt-2 text-[11px] uppercase tracking-[0.18em] text-white/68">Teknisi</p>
                  <p className="mt-1 text-sm font-semibold text-white">{transaction.washer}</p>
                </div>
              </div>

              <div className="mt-7 overflow-hidden rounded-[18px] border border-white/12 bg-white">
                <div className="grid grid-cols-[1.2fr_0.6fr_0.4fr_0.7fr] gap-2 bg-[#C8F400] px-4 py-3 text-[11px] font-semibold uppercase tracking-[0.18em] text-[#111318]">
                  <div>Layanan</div>
                  <div className="text-right">Harga</div>
                  <div className="text-right">Qty</div>
                  <div className="text-right">Total</div>
                </div>
                <div className="divide-y divide-slate-200/80">
                  {invoiceLines.map((line) => (
                    <div key={line.id} className="grid grid-cols-[1.2fr_0.6fr_0.4fr_0.7fr] items-center gap-2 px-4 py-3 text-[13px] text-slate-900">
                      <div className="min-w-0 font-medium">
                        <p className="truncate">{line.name}</p>
                      </div>
                      <div className="text-right tabular-nums">{formatCurrency(line.price)}</div>
                      <div className="text-right">1</div>
                      <div className="text-right font-medium tabular-nums">{formatCurrency(line.price)}</div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-7 grid grid-cols-2 gap-4">
                <div className="rounded-[16px] border border-white/10 bg-white/8 p-4 text-sm">
                  <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-white/70">Pembayaran</p>
                  <p className="mt-3 font-semibold uppercase text-white">{transaction.pay}</p>
                  {transaction.pay === 'transfer' && (
                    <div className="mt-3 text-xs text-white/70">
                      <p>{paymentInfo.bankBank}</p>
                      <p className="mt-1">{paymentInfo.bankName}</p>
                      <p className="mt-1 font-semibold text-white">{paymentInfo.bankNo}</p>
                    </div>
                  )}
                </div>

                <div className="rounded-[16px] border border-white/10 bg-white/8 p-4 text-sm">
                  <div className="flex items-center justify-between text-white/80 tabular-nums">
                    <span>Subtotal</span>
                    <span>{formatCurrency(subtotal)}</span>
                  </div>
                  <div className="mt-2 flex items-center justify-between text-white/80 tabular-nums">
                    <span>Diskon</span>
                    <span>- {formatCurrency(discount)}</span>
                  </div>
                  <div className="mt-4 rounded-[14px] bg-[#1535D4] px-4 py-4 text-white">
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] font-semibold uppercase tracking-[0.18em] text-white/70">Total</span>
                      <span className="font-display text-[28px] font-extrabold tabular-nums">{formatCurrency(total)}</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-auto pt-6">
                <div className="rounded-[16px] border border-white/10 bg-white/8 p-4 text-xs text-white/72">
                  <p className="font-semibold text-white/88">{receiptFooter}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="px-6 pb-6 space-y-3">
          <button
            type="button"
            onClick={handleSendWA}
            disabled={isProcessing}
            className="flex w-full items-center justify-center gap-2 rounded-[16px] bg-[#2f9e44] px-4 py-4 text-[15px] font-semibold text-white transition hover:bg-[#2b8a3e] disabled:opacity-70"
          >
            {isProcessing ? 'Memproses...' : 'Copy Invoice & Buka WhatsApp'}
          </button>
          {status && <p className="text-center text-xs text-slate-600">{status}</p>}
          <button
            type="button"
            onClick={onClose}
            disabled={isProcessing}
            className="w-full rounded-[16px] px-4 py-4 text-[15px] font-medium text-slate-500 transition hover:bg-slate-100 hover:text-slate-900 disabled:opacity-50"
          >
            Tutup
          </button>
        </div>
      </div>
    </div>
  );
}
