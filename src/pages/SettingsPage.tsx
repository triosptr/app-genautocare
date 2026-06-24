import { type FormEvent, useState } from 'react';
import { Panel } from '@/components/ui/Panel';
import { useCashierStore } from '@/store/useCashierStore';
import type { CommissionType, ServiceTier } from '@/types/app';

const serviceTiers: ServiceTier[] = ['BASIC', 'STANDARD', 'PREMIUM', 'ELITE'];
const commissionTypes: CommissionType[] = ['flat', 'persen'];

export default function SettingsPage() {
  const { settings, updateSettings, saveService, employees } = useCashierStore();
  const [form, setForm] = useState(settings);
  const [serviceName, setServiceName] = useState('');
  const [servicePrice, setServicePrice] = useState(0);
  const [serviceTier, setServiceTier] = useState<ServiceTier>('STANDARD');
  const [serviceKType, setServiceKType] = useState<CommissionType>('flat');
  const [serviceKVal, setServiceKVal] = useState(0);

  function saveSettings(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    updateSettings(form);
  }

  function addService() {
    if (!serviceName || !servicePrice) {
      return;
    }

    saveService({
      id: crypto.randomUUID(),
      name: serviceName,
      price: servicePrice,
      tier: serviceTier,
      kType: serviceKType,
      kVal: serviceKVal,
      modalItems: [],
      active: true,
    });
    setServiceName('');
    setServicePrice(0);
    setServiceKVal(0);
  }

  return (
    <div className="space-y-6">
      <section className="grid gap-6 xl:grid-cols-[0.95fr_1.05fr]">
        <Panel title="Info Pembayaran" subtitle="Nama rekening, nomor rekening, bank, dan QRIS untuk transfer dan pembayaran digital.">
          <form className="space-y-4" onSubmit={saveSettings}>
            <input value={form.businessName} onChange={(event) => setForm((current) => ({ ...current, businessName: event.target.value }))} placeholder="Nama bisnis" className="brand-input w-full rounded-2xl px-4 py-3" />
            <input value={form.bankName} onChange={(event) => setForm((current) => ({ ...current, bankName: event.target.value }))} placeholder="Atas nama rekening" className="brand-input w-full rounded-2xl px-4 py-3" />
            <div className="grid gap-4 md:grid-cols-2">
              <input value={form.bankNo} onChange={(event) => setForm((current) => ({ ...current, bankNo: event.target.value }))} placeholder="Nomor rekening" className="brand-input rounded-2xl px-4 py-3" />
              <input value={form.bankBank} onChange={(event) => setForm((current) => ({ ...current, bankBank: event.target.value }))} placeholder="Bank" className="brand-input rounded-2xl px-4 py-3" />
            </div>
            <input value={form.qrImage} onChange={(event) => setForm((current) => ({ ...current, qrImage: event.target.value }))} placeholder="URL gambar QRIS" className="brand-input w-full rounded-2xl px-4 py-3" />
            <textarea value={form.receiptFooter} onChange={(event) => setForm((current) => ({ ...current, receiptFooter: event.target.value }))} rows={4} placeholder="Footer invoice" className="brand-input w-full rounded-2xl px-4 py-3" />
            <button type="submit" className="brand-primary-btn rounded-2xl px-4 py-3 font-medium">
              Simpan pengaturan
            </button>
          </form>
        </Panel>

        <Panel title="Layanan & Komisi" subtitle="Harga layanan, tier visual, dan model komisi flat atau persen.">
          <div className="grid gap-4 md:grid-cols-2">
            <input value={serviceName} onChange={(event) => setServiceName(event.target.value)} placeholder="Nama layanan" className="brand-input rounded-2xl px-4 py-3" />
            <input type="number" value={servicePrice} onChange={(event) => setServicePrice(Number(event.target.value))} placeholder="Harga layanan" className="brand-input rounded-2xl px-4 py-3" />
            <select value={serviceTier} onChange={(event) => setServiceTier(event.target.value as ServiceTier)} className="brand-input rounded-2xl px-4 py-3">
              {serviceTiers.map((tier) => (
                <option key={tier} value={tier}>
                  {tier}
                </option>
              ))}
            </select>
            <select value={serviceKType} onChange={(event) => setServiceKType(event.target.value as CommissionType)} className="brand-input rounded-2xl px-4 py-3">
              {commissionTypes.map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </select>
            <input type="number" value={serviceKVal} onChange={(event) => setServiceKVal(Number(event.target.value))} placeholder="Nilai komisi" className="brand-input rounded-2xl px-4 py-3 md:col-span-2" />
          </div>
          <button type="button" onClick={addService} className="brand-primary-btn mt-4 rounded-2xl px-4 py-3 font-medium">
            Tambah layanan
          </button>
          <div className="mt-6 space-y-3">
            {form.services.map((service) => (
              <div key={service.id} className="brand-soft-card flex items-center justify-between rounded-2xl p-4">
                <div>
                  <p className="font-medium text-white">{service.name}</p>
                  <p className="mt-1 text-sm text-slate-300">{service.tier} · {service.kType} {service.kType === 'flat' ? service.kVal : `${service.kVal}%`}</p>
                </div>
                <span className="text-white">Rp {service.price.toLocaleString('id-ID')}</span>
              </div>
            ))}
          </div>
        </Panel>
      </section>

      <section className="grid gap-6 xl:grid-cols-2">
        <Panel title="Teknisi" subtitle="Data teknisi aktif yang hadir di operasi harian.">
          <div className="space-y-3">
            {employees
              .filter((employee) => employee.role === 'cuci')
              .map((employee) => (
                <div key={employee.id} className="brand-soft-card flex items-center justify-between rounded-2xl p-4">
                  <div>
                    <p className="font-medium text-white">{employee.name}</p>
                    <p className="mt-1 text-sm text-slate-300">{employee.present ? 'Hadir' : 'Tidak hadir'}</p>
                  </div>
                  <span className="text-[#C8F400]">{employee.activeMotorCount} motor aktif</span>
                </div>
              ))}
          </div>
        </Panel>

        <Panel title="Hak Akses" subtitle="Ringkasan modul berdasarkan role.">
          <div className="space-y-3 text-sm text-slate-300">
            <div className="brand-soft-card rounded-2xl p-4">Owner: semua modul termasuk pengaturan dan rekap.</div>
            <div className="brand-soft-card rounded-2xl p-4">Manager Ops: semua modul operasional tanpa pengaturan owner.</div>
            <div className="brand-soft-card rounded-2xl p-4">Kasir: fokus transaksi, antrian, pelanggan, absensi, laporan, dan view gudang.</div>
          </div>
        </Panel>
      </section>
    </div>
  );
}
