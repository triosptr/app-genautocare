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
  const previewWrapRef = useRef<HTMLDivElement>(null);
  const [previewScale, setPreviewScale] = useState(1);
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

  useEffect(() => {
    function syncScale() {
      const el = previewWrapRef.current;
      if (!el) return;
      const width = el.getBoundingClientRect().width;
      setPreviewScale(width / 794);
    }

    syncScale();
    window.addEventListener('resize', syncScale);
    return () => window.removeEventListener('resize', syncScale);
  }, []);

  const statusLabel = 'LUNAS';

  const invoicePoster = (
    <div
      style={{
        width: 794,
        height: 1123,
        background: '#1535d4',
        borderRadius: 6,
        overflow: 'hidden',
        position: 'relative',
        color: '#f9f9f9',
        padding: '56px 60px',
        fontFamily: "'Manrope',sans-serif",
        boxShadow: '0 40px 90px -30px rgba(8,18,80,0.7)',
      }}
    >
      <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 6, background: '#C8F400' }} />

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 44 }}>
        <div>
          <div
            style={{
              fontFamily: "'Space Grotesk',sans-serif",
              fontStyle: 'italic',
              fontWeight: 700,
              fontSize: 30,
              lineHeight: 1,
              letterSpacing: '-0.01em',
            }}
          >
            <span style={{ color: '#C8F400' }}>GEN</span>
            <span style={{ color: '#f9f9f9', fontWeight: 600, marginLeft: 7 }}>AUTO CARE</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 9, marginTop: 9 }}>
            <span style={{ width: 26, height: 3, background: '#C8F400', borderRadius: 2 }} />
            <span style={{ fontSize: 11, fontWeight: 700, color: '#C8F400', letterSpacing: '0.22em' }}>GROOM EVERY NEED</span>
          </div>
        </div>

        <div style={{ textAlign: 'right' }}>
          <div style={{ fontFamily: "'Space Grotesk',sans-serif", fontWeight: 600, fontSize: 30, letterSpacing: '0.16em', color: '#f9f9f9' }}>
            INVOICE
          </div>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 7, marginTop: 11, padding: '5px 13px', background: '#C8F400', borderRadius: 20 }}>
            <span style={{ width: 7, height: 7, borderRadius: '50%', background: '#16181d' }} />
            <span style={{ fontSize: 11, fontWeight: 800, letterSpacing: '0.14em', color: '#16181d' }}>{statusLabel}</span>
          </div>
        </div>
      </div>

      <div style={{ display: 'flex', gap: 24, marginBottom: 40 }}>
        <div style={{ flex: 1.2, background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.18)', borderRadius: 16, padding: '22px 24px' }}>
          <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.6)', textTransform: 'uppercase', letterSpacing: '0.12em', marginBottom: 12 }}>
            Ditagihkan Kepada
          </div>
          <div style={{ fontSize: 18, fontWeight: 700, marginBottom: 14 }}>{transaction.cust || 'Walk In'}</div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{ background: '#f9f9f9', color: '#16181d', borderRadius: 9, padding: '7px 13px', fontFamily: "'JetBrains Mono',monospace", fontWeight: 700, fontSize: 16, letterSpacing: '0.06em' }}>
              {transaction.plate}
            </div>
            <div style={{ fontSize: 14, fontWeight: 500, color: 'rgba(255,255,255,0.82)' }}>{transaction.merk}</div>
          </div>
        </div>

        <div style={{ flex: 1, background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.18)', borderRadius: 16, padding: '22px 24px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: 13, marginBottom: 13, borderBottom: '1px solid rgba(255,255,255,0.16)' }}>
            <span style={{ fontSize: 13, color: 'rgba(255,255,255,0.6)' }}>No. Invoice</span>
            <span style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 13, fontWeight: 600 }}>{transaction.invoiceNo}</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: 13, marginBottom: 13, borderBottom: '1px solid rgba(255,255,255,0.16)' }}>
            <span style={{ fontSize: 13, color: 'rgba(255,255,255,0.6)' }}>Tanggal</span>
            <span style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 13, fontWeight: 600 }}>
              {invoiceDate.toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' })}
            </span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span style={{ fontSize: 13, color: 'rgba(255,255,255,0.6)' }}>Metode Bayar</span>
            <span style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 13, fontWeight: 600 }}>{transaction.pay.toUpperCase()}</span>
          </div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 70px 150px 150px', padding: '0 4px 13px', borderBottom: '2px solid #C8F400' }}>
        <span style={{ fontSize: 10, color: 'rgba(255,255,255,0.6)', textTransform: 'uppercase', letterSpacing: '0.12em' }}>Layanan</span>
        <span style={{ fontSize: 10, color: 'rgba(255,255,255,0.6)', textTransform: 'uppercase', letterSpacing: '0.12em', textAlign: 'center' }}>Qty</span>
        <span style={{ fontSize: 10, color: 'rgba(255,255,255,0.6)', textTransform: 'uppercase', letterSpacing: '0.12em', textAlign: 'right' }}>Harga</span>
        <span style={{ fontSize: 10, color: 'rgba(255,255,255,0.6)', textTransform: 'uppercase', letterSpacing: '0.12em', textAlign: 'right' }}>Jumlah</span>
      </div>

      {invoiceLines.map((line) => (
        <div
          key={line.id}
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr 70px 150px 150px',
            alignItems: 'center',
            padding: '17px 4px',
            borderBottom: '1px solid rgba(255,255,255,0.12)',
          }}
        >
          <span style={{ fontSize: 15, fontWeight: 600 }}>{line.name}</span>
          <span style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 13, textAlign: 'center', color: 'rgba(255,255,255,0.7)' }}>1</span>
          <span style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 13, textAlign: 'right', color: 'rgba(255,255,255,0.7)' }}>{formatCurrency(line.price)}</span>
          <span style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 13, textAlign: 'right', fontWeight: 600 }}>{formatCurrency(line.price)}</span>
        </div>
      ))}

      <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 30 }}>
        <div style={{ width: 340 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 0' }}>
            <span style={{ fontSize: 14, color: 'rgba(255,255,255,0.7)' }}>Subtotal</span>
            <span style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 14 }}>{formatCurrency(subtotal)}</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 0', borderBottom: '1px solid rgba(255,255,255,0.18)' }}>
            <span style={{ fontSize: 14, color: 'rgba(255,255,255,0.7)' }}>Diskon</span>
            <span style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 14, color: '#C8F400', fontWeight: 600 }}>
              − {formatCurrency(discount)}
            </span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 16, padding: '18px 22px', background: '#C8F400', borderRadius: 14, boxShadow: '0 16px 34px -12px rgba(200,244,0,0.55)' }}>
            <span style={{ fontSize: 15, fontWeight: 800, color: '#16181d', letterSpacing: '0.04em' }}>TOTAL</span>
            <span style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 24, fontWeight: 700, color: '#16181d' }}>{formatCurrency(total)}</span>
          </div>
        </div>
      </div>

      <div style={{ position: 'absolute', left: 60, right: 60, bottom: 46, paddingTop: 24, borderTop: '1px dashed rgba(255,255,255,0.22)', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
        <div>
          <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.72)', lineHeight: 1.6 }}>
            {receiptFooter.split('\n').map((line, index) => (
              <div key={`${index}-${line}`}>{line}</div>
            ))}
          </div>
          <div style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 11, color: 'rgba(255,255,255,0.5)', marginTop: 10, letterSpacing: '0.04em' }}>
            Setiap hari · 08.00 – 21.00 WIB
          </div>
        </div>
        <div style={{ textAlign: 'right' }}>
          <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.6)', textTransform: 'uppercase', letterSpacing: '0.12em', marginBottom: 6 }}>Hormat Kami</div>
          <div style={{ fontFamily: "'Space Grotesk',sans-serif", fontStyle: 'italic', fontWeight: 700, fontSize: 15, color: '#C8F400' }}>{businessName}</div>
        </div>
      </div>
    </div>
  );

  const invoiceMessage = [
    `*${businessName}*`,
    `Invoice: ${transaction.invoiceNo}`,
    `Tanggal: ${invoiceDate.toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' })}`,
    '',
    `Pelanggan: ${transaction.cust || 'Walk In'}`,
    `Motor: ${transaction.merk} · ${transaction.plate}`,
    `Teknisi: ${transaction.washer}`,
    '',
    '*Rincian Layanan*',
    ...invoiceLines.map((line) => `- ${line.name} — ${formatCurrency(line.price)}`),
    '',
    `Subtotal: ${formatCurrency(subtotal)}`,
    `Diskon: - ${formatCurrency(discount)}`,
    `TOTAL: ${formatCurrency(total)}`,
    '',
    `Metode Bayar: ${transaction.pay.toUpperCase()}`,
    ...(transaction.pay === 'transfer'
      ? ['Transfer ke:', `${paymentInfo.bankBank} · ${paymentInfo.bankName}`, `${paymentInfo.bankNo}`]
      : []),
    '',
    receiptFooter,
  ].join('\n');

  const waLink = createWhatsAppLink(transaction.customerPhone || '081234567890', invoiceMessage);

  const handleSendWA = async () => {
    if (!invoiceRef.current) return;
    
    try {
      setIsProcessing(true);
      setStatus(null);

      try {
        await (document as unknown as { fonts?: { ready: Promise<void> } }).fonts?.ready;
      } catch {}

      await new Promise<void>((resolve) => {
        requestAnimationFrame(() => requestAnimationFrame(() => resolve()));
      });
      
      const canvas = await html2canvas(invoiceRef.current, { 
        scale: 2,
        backgroundColor: '#1535d4',
        useCORS: true,
        width: 794,
        height: 1123,
        windowWidth: 794,
        windowHeight: 1123,
        scrollX: 0,
        scrollY: 0,
        onclone: (doc) => {
          doc.documentElement.style.background = '#1535d4';
          doc.body.style.background = '#1535d4';
          doc.body.style.margin = '0';
        },
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
      <div className="w-full max-w-[520px] overflow-hidden rounded-[24px] border border-slate-200 bg-white shadow-[0_24px_80px_-54px_rgba(15,20,34,0.35)]">
        <div className="p-4">
          <div ref={previewWrapRef} className="aspect-[794/1123] w-full overflow-hidden rounded-[16px] border border-slate-200 bg-white">
            <div style={{ width: 794, height: 1123, transform: `scale(${previewScale})`, transformOrigin: 'top left' }}>
              {invoicePoster}
            </div>
          </div>
          <div className="fixed left-[-99999px] top-0">
            <div ref={invoiceRef} style={{ width: 794, height: 1123 }}>
              {invoicePoster}
            </div>
          </div>
        </div>

        <div className="px-6 pb-6 space-y-3">
          <button
            type="button"
            onClick={handleSendWA}
            disabled={isProcessing}
            className="brand-primary-btn flex w-full items-center justify-center gap-2 rounded-[16px] px-4 py-4 text-[15px] font-semibold disabled:opacity-70"
          >
            {isProcessing ? 'Memproses...' : 'Copy Invoice & Buka WhatsApp'}
          </button>
          {status && <p className="text-center text-xs text-slate-600">{status}</p>}
          <button
            type="button"
            onClick={onClose}
            disabled={isProcessing}
            className="brand-secondary-btn w-full rounded-[16px] px-4 py-4 text-[15px] font-medium disabled:opacity-50"
          >
            Tutup
          </button>
        </div>
      </div>
    </div>
  );
}
