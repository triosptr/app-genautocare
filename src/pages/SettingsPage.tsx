import { Plus, Save, Trash2 } from 'lucide-react';
import { useMemo, useState } from 'react';
import { Panel } from '@/components/ui/Panel';
import { cn } from '@/lib/utils';
import { useCashierStore } from '@/store/useCashierStore';
import type { DiscountMode, Service, ServiceTier } from '@/types/app';
import { formatCurrency } from '@/utils/format';

const tiers: ServiceTier[] = ['BASIC', 'STANDARD', 'PREMIUM', 'ELITE'];

function sanitizePct(value: number) {
  if (!Number.isFinite(value)) return 0;
  return Math.max(0, Math.min(100, Math.round(value)));
}

function sanitizeMoney(value: number) {
  if (!Number.isFinite(value)) return 0;
  return Math.max(0, Math.round(value));
}

export default function SettingsPage() {
  const { settings, setServices, updateSettings } = useCashierStore();
  const [draftMode, setDraftMode] = useState<DiscountMode>(settings.discountMode ?? 'amount');
  const [draftServices, setDraftServices] = useState<Service[]>(() => settings.services);

  const isDirty = useMemo(() => {
    if (draftMode !== settings.discountMode) return true;
    if (draftServices.length !== settings.services.length) return true;
    return draftServices.some((draft, index) => {
      const original = settings.services[index];
      if (!original) return true;
      return (
        draft.id !== original.id ||
        draft.name !== original.name ||
        draft.price !== original.price ||
        draft.tier !== original.tier ||
        draft.commissionPct !== original.commissionPct
      );
    });
  }, [draftMode, draftServices, settings.discountMode, settings.services]);

  function updateService(id: string, patch: Partial<Service>) {
    setDraftServices((current) =>
      current.map((svc) => (svc.id === id ? { ...svc, ...patch } : svc)),
    );
  }

  function addService() {
    const next: Service = {
      id: crypto.randomUUID(),
      name: 'Layanan Baru',
      price: 0,
      tier: 'BASIC',
      commissionPct: 0,
    };
    setDraftServices((current) => [next, ...current]);
  }

  function removeService(id: string) {
    setDraftServices((current) => current.filter((svc) => svc.id !== id));
  }

  function save() {
    updateSettings({ discountMode: draftMode });
    setServices(draftServices);
  }

  return (
    <div className="space-y-6">
      <Panel
        title="Pengaturan"
        subtitle="Atur menu layanan, komisi teknisi, dan sistem diskon."
        actions={
          <button
            type="button"
            onClick={save}
            disabled={!isDirty}
            className={cn(
              'brand-blue-btn inline-flex items-center gap-2 rounded-[14px] px-4 py-3 text-sm font-semibold',
              !isDirty && 'opacity-60',
            )}
          >
            <Save className="h-4 w-4" />
            Simpan
          </button>
        }
      >
        <div className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
          <div className="space-y-4">
            <div className="brand-outline-card rounded-[16px] p-4">
              <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-500">Sistem Diskon</p>
              <div className="mt-4 grid gap-3 sm:grid-cols-2">
                <button
                  type="button"
                  onClick={() => setDraftMode('amount')}
                  className={cn('brand-outline-card rounded-[16px] p-4 text-left', draftMode === 'amount' && 'brand-selected')}
                >
                  <p className={cn('text-sm font-semibold', draftMode === 'amount' ? 'text-white' : 'text-slate-900')}>Diskon Rupiah</p>
                  <p className={cn('mt-2 text-sm', draftMode === 'amount' ? 'text-white/80' : 'text-slate-500')}>Input diskon dalam Rp (mis. 10.000).</p>
                </button>
                <button
                  type="button"
                  onClick={() => setDraftMode('percent')}
                  className={cn('brand-outline-card rounded-[16px] p-4 text-left', draftMode === 'percent' && 'brand-selected')}
                >
                  <p className={cn('text-sm font-semibold', draftMode === 'percent' ? 'text-white' : 'text-slate-900')}>Diskon Persen</p>
                  <p className={cn('mt-2 text-sm', draftMode === 'percent' ? 'text-white/80' : 'text-slate-500')}>Input diskon dalam % dari subtotal.</p>
                </button>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-500">Menu & Komisi</p>
                <p className="mt-1 text-sm text-slate-500">Kelola daftar layanan beserta harga dan komisi teknisi.</p>
              </div>
              <button
                type="button"
                onClick={addService}
                className="brand-primary-btn inline-flex items-center gap-2 rounded-[14px] px-4 py-3 text-sm font-semibold"
              >
                <Plus className="h-4 w-4" />
                Tambah Layanan
              </button>
            </div>

            <div className="space-y-3">
              {draftServices.length === 0 ? (
                <div className="rounded-[16px] border border-slate-200 bg-white p-5 text-sm text-slate-500">
                  Belum ada layanan.
                </div>
              ) : (
                draftServices.map((service) => (
                  <div key={service.id} className="rounded-[18px] border border-slate-200 bg-white p-4">
                    <div className="grid gap-3 lg:grid-cols-[1.2fr_0.5fr_0.6fr_0.4fr_auto] lg:items-end">
                      <div>
                        <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-500">Nama</p>
                        <input
                          value={service.name}
                          onChange={(event) => updateService(service.id, { name: event.target.value })}
                          className="brand-input mt-2 w-full rounded-2xl px-4 py-3"
                        />
                      </div>

                      <div>
                        <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-500">Tier</p>
                        <select
                          value={service.tier}
                          onChange={(event) => updateService(service.id, { tier: event.target.value as ServiceTier })}
                          className="brand-input mt-2 w-full rounded-2xl px-4 py-3"
                        >
                          {tiers.map((tier) => (
                            <option key={tier} value={tier}>
                              {tier}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-500">Harga (Rp)</p>
                        <input
                          type="number"
                          value={service.price}
                          onChange={(event) => updateService(service.id, { price: sanitizeMoney(Number(event.target.value)) })}
                          className="brand-input mt-2 w-full rounded-2xl px-4 py-3"
                        />
                        <p className="mt-2 text-xs text-slate-500">{formatCurrency(service.price)}</p>
                      </div>

                      <div>
                        <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-500">Komisi (%)</p>
                        <input
                          type="number"
                          value={service.commissionPct}
                          onChange={(event) => updateService(service.id, { commissionPct: sanitizePct(Number(event.target.value)) })}
                          className="brand-input mt-2 w-full rounded-2xl px-4 py-3"
                        />
                      </div>

                      <button
                        type="button"
                        onClick={() => removeService(service.id)}
                        className="brand-secondary-btn inline-flex h-12 items-center justify-center rounded-[14px] px-4 text-sm font-semibold text-slate-700"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </Panel>
    </div>
  );
}

