import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { Panel } from '@/components/ui/Panel';
import { createWhatsAppLink } from '@/lib/whatsapp';
import { useCashierStore } from '@/store/useCashierStore';
import type { PaymentMethod, ServiceTier } from '@/types/app';
import { formatCurrency } from '@/utils/format';

const paymentMethods: PaymentMethod[] = ['cash', 'qris', 'transfer'];

const tierStyles: Record<ServiceTier, string> = {
  BASIC: 'bg-[#f0f2f7] text-[#373A4A] border-[#d8dbe5]',
  STANDARD: 'bg-[#1535D4] text-white border-[#1535D4]',
  PREMIUM: 'bg-[#e8a93b] text-[#111318] border-[#e8a93b]',
  ELITE: 'bg-[#1a1c25] text-[#C8F400] border-[#C8F400]/30',
};

export default function CashierDetailPage() {
  const { customers, services, employees, settings, createTransaction } = useCashierStore();
  const [search, setSearch] = useState('');
  const [selectedCustomerId, setSelectedCustomerId] = useState<string>('');
  const [customerName, setCustomerName] = useState('');
  const [phone, setPhone] = useState('');
  const [plate, setPlate] = useState('');
  const [merk, setMerk] = useState('');
  const [selectedServices, setSelectedServices] = useState<string[]>([]);
  const [washerId, setWasherId] = useState('');
  const [discount, setDiscount] = useState(0);
  const [payment, setPayment] = useState<PaymentMethod>('cash');
  const [usePoints, setUsePoints] = useState(false);
  const [lastTxId, setLastTxId] = useState<string | null>(null);

  const activeEmployees = employees.filter((employee) => employee.role === 'cuci' && employee.present);
  const matchedCustomers = useMemo(
    () =>
      customers.filter((customer) =>
        [customer.name, customer.phone, customer.plate, customer.vehicles.map((vehicle) => vehicle.plate).join(' ')]
          .join(' ')
          .toLowerCase()
          .includes(search.toLowerCase()),
      ),
    [customers, search],
  );

  const selectedCustomer = customers.find((customer) => customer.id === selectedCustomerId) ?? null;
  const pickedServices = services.filter((service) => selectedServices.includes(service.id));
  const subtotal = pickedServices.reduce((sum, service) => sum + service.price, 0);
  const total = Math.max(0, subtotal - discount - (usePoints && (selectedCustomer?.points ?? 0) >= settings.pointRedeemThreshold ? pickedServices[0]?.price ?? 0 : 0));
  const currentTx = lastTxId ? useCashierStore.getState().transactions.find((tx) => tx.id === lastTxId) : null;

  function selectCustomer(customerId: string) {
    const customer = customers.find((entry) => entry.id === customerId);
    if (!customer) {
      return;
    }

    setSelectedCustomerId(customer.id);
    setCustomerName(customer.name);
    setPhone(customer.phone);
    setPlate(customer.plate);
    setMerk(customer.vehicles[0]?.merk ?? '');
  }

  function toggleService(serviceId: string) {
    setSelectedServices((current) =>
      current.includes(serviceId) ? current.filter((entry) => entry !== serviceId) : [...current, serviceId],
    );
  }

  function processTransaction() {
    if (!customerName || !plate || !merk || !washerId || selectedServices.length === 0) {
      return;
    }

    const confirmed = window.confirm('Apakah data sudah benar?');
    if (!confirmed) {
      return;
    }

    const txId = createTransaction({
      customerId: selectedCustomerId || null,
      customerName,
      phone,
      plate,
      merk,
      serviceIds: selectedServices,
      washerId,
      paymentMethod: payment,
      discount,
      usePoints,
    });

    setLastTxId(txId);
  }

  const invoiceMessage = currentTx
    ? [
        'GEN AUTO CARE',
        `No Invoice: ${currentTx.invoiceNo}`,
        `Tanggal: ${new Date(currentTx.time).toLocaleDateString('id-ID')}`,
        `Motor: ${currentTx.merk} - ${currentTx.plate}`,
        `Layanan: ${currentTx.services.join(', ')}`,
        `Subtotal: ${formatCurrency(currentTx.subtotal)}`,
        `Diskon: ${formatCurrency(currentTx.disc)}`,
        `Total: ${formatCurrency(currentTx.total)}`,
        `Metode Bayar: ${currentTx.pay.toUpperCase()}`,
        `Teknisi: ${currentTx.washer}`,
        'Terima kasih telah menggunakan GEN AUTO CARE.',
      ].join('\n')
    : '';

  return (
    <div className="space-y-6">
      <section className="grid gap-6 xl:grid-cols-[1.15fr_0.85fr]">
        <Panel title="Step 1 — Data Motor & Pelanggan" subtitle="Cari pelanggan lama atau isi pelanggan baru dan data kendaraan.">
          <div className="space-y-4">
            <input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Cari by nama, plat, atau nomor HP"
              className="brand-input w-full rounded-2xl px-4 py-3"
            />
            <div className="grid gap-3 md:grid-cols-2">
              {matchedCustomers.slice(0, 4).map((customer) => (
                <button
                  key={customer.id}
                  type="button"
                  onClick={() => selectCustomer(customer.id)}
                  className="brand-soft-card rounded-2xl p-4 text-left transition hover:border-[#C8F400]/30 hover:bg-[#1535D4]/18"
                >
                  <p className="font-medium text-white">{customer.name}</p>
                  <p className="mt-1 text-sm text-slate-300">{customer.phone}</p>
                  <p className="mt-2 text-xs uppercase tracking-[0.2em] text-[#C8F400]">
                    {customer.vehicles.length} kendaraan · {customer.points} poin
                  </p>
                </button>
              ))}
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <input value={customerName} onChange={(event) => setCustomerName(event.target.value)} placeholder="Nama pelanggan" className="brand-input rounded-2xl px-4 py-3" />
              <input value={phone} onChange={(event) => setPhone(event.target.value)} placeholder="Nomor WhatsApp" className="brand-input rounded-2xl px-4 py-3" />
              <input value={plate} onChange={(event) => setPlate(event.target.value.toUpperCase())} placeholder="Nomor plat" className="brand-input rounded-2xl px-4 py-3" />
              <input value={merk} onChange={(event) => setMerk(event.target.value)} placeholder="Merk motor" className="brand-input rounded-2xl px-4 py-3" />
            </div>
          </div>
        </Panel>

        <Panel title="Ringkasan Invoice" subtitle="Subtotal, diskon, poin, metode bayar, dan invoice WhatsApp.">
          <div className="space-y-4">
            <div className="brand-soft-card rounded-2xl p-4">
              <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Subtotal</p>
              <p className="mt-2 font-display text-3xl text-white">{formatCurrency(subtotal)}</p>
            </div>
            <div className="brand-soft-card rounded-2xl p-4">
              <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Diskon</p>
              <input
                type="number"
                value={discount}
                onChange={(event) => setDiscount(Number(event.target.value))}
                className="brand-input mt-3 w-full rounded-2xl px-4 py-3"
              />
            </div>
            <label className="brand-soft-card flex items-center gap-3 rounded-2xl px-4 py-3 text-sm text-slate-200">
              <input type="checkbox" checked={usePoints} onChange={(event) => setUsePoints(event.target.checked)} />
              Gunakan poin pelanggan jika mencapai {settings.pointRedeemThreshold} poin
            </label>
            <div className="grid gap-3 md:grid-cols-3">
              {paymentMethods.map((method) => (
                <button
                  key={method}
                  type="button"
                  onClick={() => setPayment(method)}
                  className={`rounded-2xl border px-4 py-3 text-sm font-medium transition ${
                    payment === method ? 'border-[#C8F400] bg-[#C8F400] text-[#1535D4]' : 'border-white/10 bg-white/5 text-white'
                  }`}
                >
                  {method.toUpperCase()}
                </button>
              ))}
            </div>
            {payment === 'transfer' && (
              <div className="brand-soft-card rounded-2xl p-4 text-sm text-slate-200">
                <p>{settings.bankBank}</p>
                <p className="mt-1">{settings.bankName}</p>
                <p className="mt-1 font-display text-2xl text-white">{settings.bankNo}</p>
              </div>
            )}
            <div className="rounded-3xl border border-[#C8F400]/18 bg-[#C8F400]/10 p-5">
              <div className="flex items-center justify-between">
                <span className="text-sm uppercase tracking-[0.2em] text-[#C8F400]">Total</span>
                <span className="font-display text-3xl text-white">{formatCurrency(total)}</span>
              </div>
            </div>
            <button type="button" onClick={processTransaction} className="brand-primary-btn w-full rounded-2xl px-4 py-3 font-semibold">
              Proses Transaksi
            </button>
            {currentTx && (
              <a
                href={createWhatsAppLink(phone || '081234567890', invoiceMessage)}
                target="_blank"
                rel="noreferrer"
                className="brand-secondary-btn block rounded-2xl px-4 py-3 text-center text-sm font-medium"
              >
                Kirim Invoice ke WhatsApp
              </a>
            )}
          </div>
        </Panel>
      </section>

      <section className="grid gap-6 xl:grid-cols-[1.15fr_0.85fr]">
        <Panel title="Step 2 — Pilih Layanan" subtitle="Pilih layanan dengan tier visual sesuai harga dan komisi.">
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            {services.map((service) => (
              <button
                key={service.id}
                type="button"
                onClick={() => toggleService(service.id)}
                className={`rounded-3xl border p-4 text-left transition ${tierStyles[service.tier]} ${
                  selectedServices.includes(service.id) ? 'ring-2 ring-[#C8F400]' : ''
                }`}
              >
                <p className="text-xs uppercase tracking-[0.22em]">{service.tier}</p>
                <p className="mt-3 font-display text-2xl">{service.name}</p>
                <p className="mt-4 text-3xl font-black">{formatCurrency(service.price)}</p>
                <p className="mt-3 text-xs uppercase tracking-[0.18em]">
                  Komisi {service.kType === 'flat' ? formatCurrency(service.kVal) : `${service.kVal}%`}
                </p>
              </button>
            ))}
          </div>
        </Panel>

        <Panel title="Step 3 — Pilih Teknisi" subtitle="Hanya teknisi yang hadir yang dapat dipilih.">
          <div className="space-y-3">
            {activeEmployees.map((employee) => (
              <button
                key={employee.id}
                type="button"
                onClick={() => setWasherId(employee.id)}
                className={`brand-soft-card flex w-full items-center justify-between rounded-2xl p-4 text-left transition ${
                  washerId === employee.id ? 'border-[#C8F400]/30 bg-[#1535D4]/18' : ''
                }`}
              >
                <div>
                  <p className="font-medium text-white">{employee.name}</p>
                  <p className="mt-1 text-sm text-slate-300">{employee.activeMotorCount} motor aktif</p>
                </div>
                <span className="text-xs uppercase tracking-[0.2em] text-[#C8F400]">Hadir</span>
              </button>
            ))}
          </div>
        </Panel>
      </section>

      <Panel title="Akses Cepat" subtitle="Mode POS untuk proses super cepat tanpa dialog konfirmasi tambahan.">
        <Link to="/pos" className="brand-primary-btn inline-flex rounded-2xl px-5 py-3 text-sm font-semibold">
          Buka Mode POS Fullscreen
        </Link>
      </Panel>
    </div>
  );
}
