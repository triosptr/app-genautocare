import { useMemo, useState } from 'react';
import { Panel } from '@/components/ui/Panel';
import { InvoiceModal } from '@/components/invoice/InvoiceModal';
import { useCashierStore } from '@/store/useCashierStore';
import type { PaymentMethod, ServiceTier } from '@/types/app';
import { formatCurrency } from '@/utils/format';

const paymentMethods: PaymentMethod[] = ['cash', 'qris', 'transfer'];

const tierStyles: Record<ServiceTier, string> = {
  BASIC: 'bg-[#f3f4f8] text-[#5e6578] border-[#d8dce7]',
  STANDARD: 'bg-[#1535D4] text-white border-[#1535D4]',
  PREMIUM: 'bg-[#f0b13f] text-[#111318] border-[#f0b13f]',
  ELITE: 'bg-[#373A4A] text-[#C8F400] border-[#373A4A]',
};

export default function CashierDetailPage() {
  const { customers, services, employees, settings, createTransaction, deviceMode } = useCashierStore();
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
  const [lastTxId, setLastTxId] = useState<string | null>(null);
  const [showInvoice, setShowInvoice] = useState(false);

  const activeEmployees = employees.filter((employee) => employee.present);
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

  const pickedServices = services.filter((service) => selectedServices.includes(service.id));
  const subtotal = pickedServices.reduce((sum, service) => sum + service.price, 0);
  const total = Math.max(0, subtotal - discount);
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
      alert('Mohon lengkapi data pelanggan, layanan, dan teknisi terlebih dahulu.');
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
    });

    setLastTxId(txId);
    setShowInvoice(true);
    
    // reset form
    setCustomerName('');
    setPhone('');
    setPlate('');
    setMerk('');
    setSelectedServices([]);
    setWasherId('');
    setDiscount(0);
    setSelectedCustomerId('');
  }

  return (
    <div className="space-y-6">
      <section className={`grid gap-6 ${deviceMode === 'mobile' ? 'grid-cols-1' : 'xl:grid-cols-[1.1fr_0.9fr]'}`}>
        <Panel title="1. Data Pelanggan" subtitle="Cari pelanggan lama atau isi data pelanggan baru.">
          <div className="space-y-4">
            <input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Cari by nama, plat, atau nomor HP"
              className="brand-input w-full rounded-2xl px-4 py-3"
            />
            {search && matchedCustomers.length > 0 && (
              <div className="grid gap-3 md:grid-cols-2">
                {matchedCustomers.slice(0, 4).map((customer) => (
                  <button
                    key={customer.id}
                    type="button"
                    onClick={() => selectCustomer(customer.id)}
                    className="brand-outline-card rounded-[16px] p-4 text-left"
                  >
                    <p className="font-medium text-slate-900">{customer.name}</p>
                    <p className="mt-1 text-sm text-slate-500">{customer.phone}</p>
                    <p className="mt-2 text-[11px] uppercase tracking-[0.16em] text-[#1535D4]">
                      {customer.vehicles.length} kendaraan
                    </p>
                  </button>
                ))}
              </div>
            )}

            <div className="grid gap-4 md:grid-cols-2">
              <input value={customerName} onChange={(event) => setCustomerName(event.target.value)} placeholder="Nama pelanggan" className="brand-input rounded-2xl px-4 py-3" />
              <input value={phone} onChange={(event) => setPhone(event.target.value)} placeholder="Nomor WhatsApp" className="brand-input rounded-2xl px-4 py-3" />
              <input value={plate} onChange={(event) => setPlate(event.target.value.toUpperCase())} placeholder="Nomor plat" className="brand-input rounded-2xl px-4 py-3" />
              <input value={merk} onChange={(event) => setMerk(event.target.value)} placeholder="Merk motor" className="brand-input rounded-2xl px-4 py-3" />
            </div>
          </div>
        </Panel>

        <Panel title="Ringkasan" subtitle="Total, diskon, metode bayar, dan kirim invoice.">
          <div className="space-y-4">
            <div className="brand-outline-card rounded-[16px] p-4">
              <p className="text-[11px] uppercase tracking-[0.16em] text-slate-500">Subtotal</p>
              <p className="mt-2 font-display text-[28px] text-[#1535D4]">{formatCurrency(subtotal)}</p>
            </div>
            <div className="brand-outline-card rounded-[16px] p-4">
              <p className="text-[11px] uppercase tracking-[0.16em] text-slate-500">Diskon</p>
              <input
                type="number"
                value={discount || ''}
                onChange={(event) => setDiscount(Number(event.target.value))}
                placeholder="0"
                className="brand-input mt-3 w-full rounded-2xl px-4 py-3"
              />
            </div>
            
            <div className="grid gap-3 md:grid-cols-3">
              {paymentMethods.map((method) => (
                <button
                  key={method}
                  type="button"
                  onClick={() => setPayment(method)}
                  className={`rounded-[12px] border px-4 py-3 text-sm font-semibold transition ${
                    payment === method ? 'border-[#1535D4] bg-white text-[#1535D4] shadow-[inset_0_0_0_1px_#1535D4]' : 'border-slate-300 bg-[#f8f9fc] text-slate-700'
                  }`}
                >
                  {method.toUpperCase()}
                </button>
              ))}
            </div>
            {payment === 'transfer' && (
              <div className="brand-outline-card rounded-[16px] p-4 text-sm text-slate-700">
                <p>{settings.bankBank}</p>
                <p className="mt-1">{settings.bankName}</p>
                <p className="mt-1 font-display text-2xl text-slate-900">{settings.bankNo}</p>
              </div>
            )}
            <div className="rounded-[16px] border border-[#1535D4] bg-[#1535D4] p-5">
              <div className="flex items-center justify-between">
                <span className="text-sm uppercase tracking-[0.16em] text-white/70">Total</span>
                <span className="font-display text-[30px] text-white">{formatCurrency(total)}</span>
              </div>
            </div>
            <button type="button" onClick={processTransaction} className="brand-primary-btn w-full rounded-2xl px-4 py-3 font-semibold">
              Proses & Buat Invoice
            </button>
          </div>
        </Panel>
      </section>

      <section className={`grid gap-6 ${deviceMode === 'mobile' ? 'grid-cols-1' : 'xl:grid-cols-[1.1fr_0.9fr]'}`}>
        <Panel title="2. Pilih Layanan" subtitle="Layanan yang akan masuk ke invoice.">
          <div className={`grid gap-4 ${deviceMode === 'mobile' ? 'grid-cols-1' : deviceMode === 'ipad' ? 'md:grid-cols-2' : 'md:grid-cols-2 2xl:grid-cols-4'}`}>
            {services.map((service) => (
              <button
                key={service.id}
                type="button"
                onClick={() => toggleService(service.id)}
                className={`flex min-h-[160px] flex-col justify-between rounded-[16px] border p-4 text-left transition-all duration-200 hover:-translate-y-1 hover:shadow-lg ${tierStyles[service.tier]} ${
                  selectedServices.includes(service.id) ? 'ring-2 ring-[#C8F400] ring-offset-2 ring-offset-[#eef0f5]' : ''
                }`}
              >
                <div>
                  <p className="text-[10px] uppercase tracking-[0.14em]">{service.tier}</p>
                  <p className="mt-3 font-display text-[18px] leading-tight md:text-[20px]">{service.name}</p>
                </div>
                <div className="mt-5 space-y-2">
                  <p className="font-display text-[22px] leading-none font-bold md:text-[24px]">{formatCurrency(service.price)}</p>
                </div>
              </button>
            ))}
          </div>
        </Panel>

        <Panel title="3. Pilih Teknisi" subtitle="Pilih nama teknisi yang menangani.">
          <div className="space-y-3">
            {activeEmployees.map((employee) => (
              <button
                key={employee.id}
                type="button"
                onClick={() => setWasherId(employee.id)}
                className={`brand-outline-card flex w-full items-center justify-between rounded-[16px] p-4 text-left transition ${
                  washerId === employee.id ? 'border-[#1535D4] bg-white shadow-[inset_0_0_0_1px_#1535D4]' : ''
                }`}
              >
                <p className="font-medium text-slate-900">{employee.name}</p>
                <span className="text-[11px] uppercase tracking-[0.16em] text-[#1535D4]">Pilih</span>
              </button>
            ))}
          </div>
        </Panel>
      </section>

      {showInvoice && currentTx && (
        <InvoiceModal
          transaction={currentTx}
          businessName={settings.businessName}
          receiptFooter={settings.receiptFooter}
          onClose={() => setShowInvoice(false)}
        />
      )}
    </div>
  );
}
