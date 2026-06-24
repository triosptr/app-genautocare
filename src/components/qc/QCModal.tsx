import { Camera, CheckCircle2, X } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { cn } from '@/lib/utils';
import type { QCDetailDraft, QCRating, Transaction } from '@/types/app';

const qcOptions: Array<{ label: string; value: QCRating }> = [
  { label: 'Kotor', value: 40 },
  { label: 'Kurang Bersih', value: 70 },
  { label: 'Bersih', value: 100 },
];

const qcFields: Array<{ key: keyof QCDetailDraft; label: string }> = [
  { key: 'body', label: 'Body & Cat' },
  { key: 'velg', label: 'Velg & Ban' },
  { key: 'spakbor', label: 'Spakbor' },
  { key: 'jok', label: 'Jok' },
  { key: 'spionLampu', label: 'Spion & Lampu' },
  { key: 'areaMesin', label: 'Area Mesin' },
  { key: 'kekeringan', label: 'Kekeringan' },
];

interface QCModalProps {
  open: boolean;
  transaction: Transaction | null;
  onClose: () => void;
  onSubmit: (details: QCDetailDraft, afterPhoto: string | null) => void;
}

export function QCModal({ open, transaction, onClose, onSubmit }: QCModalProps) {
  const [details, setDetails] = useState<QCDetailDraft>({});
  const [afterPhoto, setAfterPhoto] = useState<string | null>(null);

  useEffect(() => {
    if (!open) {
      return;
    }

    setDetails({});
    setAfterPhoto(transaction?.afterPhoto ?? null);
  }, [open, transaction]);

  const selectedCount = useMemo(
    () => Object.values(details).filter((value) => typeof value === 'number').length,
    [details],
  );

  const liveScore = useMemo(() => {
    const values = Object.values(details).filter((value): value is QCRating => typeof value === 'number');
    if (values.length === 0) {
      return 0;
    }
    return Math.round(values.reduce((sum, value) => sum + value, 0) / values.length);
  }, [details]);

  if (!open || !transaction) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#1535D4]/22 px-4 py-6 backdrop-blur-sm">
      <div className="w-full max-w-4xl rounded-[32px] border border-[#1535D4]/14 bg-white shadow-[0_30px_80px_-36px_rgba(21,53,212,0.3)]">
        <div className="flex items-start justify-between gap-4 border-b border-slate-200 px-6 py-5">
          <div>
            <p className="text-[11px] uppercase tracking-[0.16em] text-[#1535D4]">Quality Check</p>
            <h3 className="mt-2 font-display text-[28px] uppercase tracking-[0.08em] text-slate-900">
              {transaction.plate}
            </h3>
            <p className="mt-1 text-sm text-slate-600">
              {transaction.merk} · {transaction.cust} · dicuci {transaction.washer}
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="brand-secondary-btn inline-flex rounded-2xl px-3 py-3"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="grid gap-6 px-6 py-6 lg:grid-cols-[1.15fr_0.85fr]">
          <div className="space-y-4">
            <div className="rounded-3xl border border-[#1535D4]/10 bg-[#eef4ff] p-4">
              <p className="text-sm text-slate-700">
                Checklist 7 titik. Minimal 3 titik harus dinilai sebelum QC disimpan.
              </p>
            </div>

            <div className="grid gap-3">
              {qcFields.map((field) => (
                <div key={field.key} className="rounded-3xl border border-slate-200 bg-[#f8fafc] p-4">
                  <p className="text-sm font-semibold text-slate-900">{field.label}</p>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {qcOptions.map((option) => (
                      <button
                        key={option.value}
                        type="button"
                        onClick={() => setDetails((current) => ({ ...current, [field.key]: option.value }))}
                        className={cn(
                          'rounded-2xl border px-3 py-2 text-xs font-medium transition',
                          details[field.key] === option.value
                            ? option.value === 100
                              ? 'border-[#C8F400] bg-[#f5ffcf] text-[#516000]'
                              : option.value === 70
                                ? 'border-[#f0d39c] bg-[#fff5df] text-[#8a5a00]'
                                : 'border-[#f4bbb5] bg-[#fff1ef] text-[#b42318]'
                            : 'border-slate-200 bg-white text-slate-600',
                        )}
                      >
                        {option.label}
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-4">
            <div className="rounded-3xl border border-[#C8F400]/18 bg-[#f5ffcf] p-5">
              <p className="text-[11px] uppercase tracking-[0.16em] text-[#516000]">Skor QC</p>
              <p className="mt-2 font-display text-[40px] leading-none text-slate-900">{liveScore || '-'}</p>
              <p className="mt-2 text-sm text-slate-600">{selectedCount}/7 titik sudah dinilai</p>
            </div>

            <div className="brand-soft-card rounded-3xl p-4">
              <p className="text-sm font-semibold text-slate-900">Foto Sesudah</p>
              <p className="mt-2 text-sm text-slate-600">
                Gunakan tombol ini sebagai placeholder proses foto sesudah cuci.
              </p>
              <button
                type="button"
                onClick={() => setAfterPhoto('after-photo-ready')}
                className="brand-secondary-btn mt-4 inline-flex items-center gap-2 rounded-2xl px-4 py-3 text-sm"
              >
                <Camera className="h-4 w-4" />
                {afterPhoto ? 'Foto Sesudah Siap' : 'Ambil Foto Sesudah'}
              </button>
            </div>

            <div className="brand-soft-card rounded-3xl p-4">
              <p className="text-sm font-semibold text-slate-900">Ringkasan Konsep</p>
              <ul className="mt-3 space-y-2 text-sm text-slate-600">
                <li>Body & Cat, Velg & Ban, Spakbor, Jok</li>
                <li>Spion & Lampu, Area Mesin, Kekeringan</li>
                <li>Skor dihitung dari rata-rata titik yang dinilai</li>
              </ul>
            </div>

            <button
              type="button"
              onClick={() => onSubmit(details, afterPhoto)}
              disabled={selectedCount < 3}
              className="brand-primary-btn inline-flex w-full items-center justify-center gap-2 rounded-2xl px-4 py-4 text-sm font-semibold disabled:cursor-not-allowed disabled:opacity-60"
            >
              <CheckCircle2 className="h-4 w-4" />
              Simpan QC
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
