import { useMemo, useState } from 'react';
import { Panel } from '@/components/ui/Panel';
import { InvoiceModal } from '@/components/invoice/InvoiceModal';
import { cn } from '@/lib/utils';
import { useCashierStore } from '@/store/useCashierStore';
import type { PaymentMethod, ServiceTier } from '@/types/app';
import { formatCurrency } from '@/utils/format';

const paymentMethods: PaymentMethod[] = ['cash', 'qris', 'transfer'];

const tierStyles: Record<ServiceTier, string> = {
  BASIC: 'bg-[#f8f9fc] text-slate-900 border-[#d8dce7]',
  STANDARD: 'bg-[#f8f9fc] text-slate-900 border-[#d8dce7]',
  PREMIUM: 'bg-[#f8f9fc] text-slate-900 border-[#d8dce7]',
  ELITE: 'bg-[#f8f9fc] text-slate-900 border-[#d8dce7]',
};

export default function CashierDetailPage() {
  const { customers, services, employees, settings, createTransaction, transactions } = useCashierStore();
  const [search, setSearch] = useState('');
  const [selectedCustomerId, setSelectedCustomerId] = useState<string>('');
  const [customerName, setCustomerName] = useState('');
  const [phone, setPhone] = useState('');
  const [plate, setPlate] = useState('');
  const [merk, setMerk] = useState('');
  const [selectedServices, setSelectedServices] = useState<string[]>([]);
  const [washerId, setWasherId] = useState('');
  const [discountInput, setDiscountInput] = useState(0);
  const [usePoints, setUsePoints] = useState(false);
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
  const selectedCustomer = selectedCustomerId ? customers.find((entry) => entry.id === selectedCustomerId) ?? null : null;
  const customerPoints = selectedCustomer?.points ?? 0;
  const eligiblePoints = customerPoints >= 150;
  const redeemValue = usePoints && eligiblePoints && pickedServices.length > 0 ? Math.min(...pickedServices.map((service) => service.price)) : 0;
  const subtotal = pickedServices.reduce((sum, service) => sum + service.price, 0);
  const commissionPreview = pickedServices.reduce((sum, service) => sum + Math.round((service.price * service.commissionPct) / 100), 0);
  const discountValue =
    settings.discountMode === 'percent' ? Math.round((subtotal * discountInput) / 100) : discountInput;
  const total = Math.max(0, subtotal - discountValue - redeemValue);
  const currentTx = lastTxId ? transactions.find((tx) => tx.id === lastTxId) ?? null : null;

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
    setUsePoints(false);
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
      discount: discountValue,
      usePoints,
    });

    setLastTxId(txId);
    setShowInvoice(true);
    
    setCustomerName('');
    setPhone('');
    setPlate('');
    setMerk('');
    setSelectedServices([]);
    setWasherId('');
    setDiscountInput(0);
    setUsePoints(false);
    setSelectedCustomerId('');
  }

  return (
    <div className="space-y-6">
      <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
        <div className="space-y-6">
          <Panel title="1. Data Motor & Pelanggan" subtitle="Cari pelanggan lama atau isi data pelanggan baru.">
            <div className="space-y-4">
              <input
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Cari nama / plat / WA"
                className="brand-input w-full rounded-2xl px-4 py-3"
              />

              {search && matchedCustomers.length > 0 && (
                <div className="grid gap-3 sm:grid-cols-2">
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

              <div className="grid gap-4 sm:grid-cols-2">
                <input
                  value={plate}
                  onChange={(event) => setPlate(event.target.value.toUpperCase())}
                  placeholder="Plat nomor"
                  className="brand-input rounded-2xl px-4 py-3"
                />
                <input value={merk} onChange={(event) => setMerk(event.target.value)} placeholder="Merk / tipe motor" className="brand-input rounded-2xl px-4 py-3" />
                <input value={customerName} onChange={(event) => setCustomerName(event.target.value)} placeholder="Nama pelanggan" className="brand-input rounded-2xl px-4 py-3" />
                <input value={phone} onChange={(event) => setPhone(event.target.value)} placeholder="No. WhatsApp" className="brand-input rounded-2xl px-4 py-3" />
              </div>
            </div>
          </Panel>

          <Panel title="2. Pilih Layanan" subtitle="Tap untuk menambahkan ke transaksi.">
            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
              {services.map((service) => (
                <button
                  key={service.id}
                  type="button"
                  onClick={() => toggleService(service.id)}
                  className={cn(
                        'relative flex min-h-[160px] flex-col justify-between rounded-[16px] border p-4 text-left transition-all duration-200 hover:-translate-y-1 hover:shadow-lg',
                    tierStyles[service.tier],
                        selectedServices.includes(service.id) ? 'brand-selected' : '',
                  )}
                >
                  <div>
                    <div className="flex items-start justify-between gap-2">
                          <p className={cn('text-[10px] uppercase tracking-[0.14em]', selectedServices.includes(service.id) ? 'text-white/70' : 'text-slate-500')}>
                            {service.tier}
                          </p>
                    </div>
                    <p className="mt-3 font-display text-[18px] leading-tight md:text-[20px]">{service.name}</p>
                  </div>
                  <div className="mt-5 space-y-2">
                    <p className="font-display text-[22px] font-bold leading-none tabular-nums md:text-[24px]">{formatCurrency(service.price)}</p>
                        <p className={cn('text-[10px] uppercase tracking-[0.14em]', selectedServices.includes(service.id) ? 'text-white/80' : 'text-slate-500')}>
                      Komisi {service.commissionPct}%
                    </p>
                  </div>
                </button>
              ))}
            </div>
          </Panel>

          <Panel title="3. Pilih Teknisi" subtitle="Pilih teknisi yang menangani transaksi ini.">
            <div className="grid gap-3 sm:grid-cols-3">
              {activeEmployees.map((employee) => (
                <button
                  key={employee.id}
                  type="button"
                  onClick={() => setWasherId(employee.id)}
                  className={cn(
                    'brand-outline-card flex items-center justify-between rounded-[16px] p-4 text-left transition',
                    washerId === employee.id ? 'brand-selected' : '',
                  )}
                >
                  <p className={cn('font-medium', washerId === employee.id ? 'text-white' : 'text-slate-900')}>{employee.name}</p>
                  <span className={cn('text-[11px] uppercase tracking-[0.16em]', washerId === employee.id ? 'text-white/80' : 'text-[#1535D4]')}>
                    Pilih
                  </span>
                </button>
              ))}
            </div>
          </Panel>
        </div>

        <div className="h-fit lg:sticky lg:top-28">
          <Panel title="Ringkasan" subtitle="Periksa total dan proses invoice.">
            <div className="space-y-4">
              <div className="brand-outline-card rounded-[16px] p-4">
                <p className="text-[11px] uppercase tracking-[0.16em] text-slate-500">Layanan dipilih</p>
                <div className="mt-3 space-y-2">
                  {pickedServices.length === 0 ? (
                    <p className="text-sm text-slate-500">Belum ada layanan dipilih.</p>
                  ) : (
                    pickedServices.map((svc) => (
                      <div key={svc.id} className="flex items-center justify-between text-sm text-slate-700">
                        <span className="min-w-0 font-medium text-slate-900">
                          <span className="block truncate">{svc.name}</span>
                        </span>
                        <span className="tabular-nums text-slate-700">{formatCurrency(svc.price)}</span>
                      </div>
                    ))
                  )}
                </div>
              </div>

              <div className="grid gap-3 sm:grid-cols-2">
                <div className="brand-outline-card rounded-[16px] p-4">
                  <p className="text-[11px] uppercase tracking-[0.16em] text-slate-500">Subtotal</p>
                  <p className="mt-2 font-display text-[26px] text-[#1535D4] tabular-nums">{formatCurrency(subtotal)}</p>
                </div>
                <div className="brand-outline-card rounded-[16px] p-4">
                  <p className="text-[11px] uppercase tracking-[0.16em] text-slate-500">Komisi teknisi</p>
                  <p className="mt-2 font-display text-[26px] text-slate-900 tabular-nums">{formatCurrency(commissionPreview)}</p>
                </div>
              </div>

              <div className="brand-outline-card rounded-[16px] p-4">
                <p className="text-[11px] uppercase tracking-[0.16em] text-slate-500">
                  Diskon {settings.discountMode === 'percent' ? '(%)' : '(Rp)'}
                </p>
                <input
                  type="number"
                  value={discountInput || ''}
                  onChange={(event) => setDiscountInput(Number(event.target.value))}
                  placeholder="0"
                  className="brand-input mt-3 w-full rounded-2xl px-4 py-3"
                />
                {settings.discountMode === 'percent' && (
                  <p className="mt-2 text-xs text-slate-500">Setara {formatCurrency(discountValue)} dari subtotal.</p>
                )}
              </div>

              {selectedCustomer && (
                <div className="brand-outline-card rounded-[16px] p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="text-[11px] uppercase tracking-[0.16em] text-slate-500">Poin Member</p>
                      <p className="mt-2 text-sm font-semibold text-slate-900 tabular-nums">{customerPoints} / 150</p>
                      <p className="mt-1 text-xs text-slate-500">+10 poin per transaksi · Tukar 150 poin = gratis 1x cuci</p>
                    </div>
                    <button
                      type="button"
                      disabled={!eligiblePoints || pickedServices.length === 0}
                      onClick={() => setUsePoints((value) => !value)}
                      className={cn(
                        'rounded-[12px] border px-3 py-2 text-xs font-semibold transition',
                        usePoints
                          ? 'brand-selected'
                          : 'border-slate-300 bg-white text-slate-700 hover:bg-[#f8f9fc]',
                        (!eligiblePoints || pickedServices.length === 0) && 'opacity-60',
                      )}
                    >
                      Gunakan
                    </button>
                  </div>

                  {usePoints && redeemValue > 0 && (
                    <div className="mt-3 flex items-center justify-between rounded-[14px] bg-[#eef4ff] px-4 py-3 text-sm">
                      <span className="text-slate-700">Tukar 150 poin (gratis 1x cuci)</span>
                      <span className="font-semibold text-[#1535D4] tabular-nums">- {formatCurrency(redeemValue)}</span>
                    </div>
                  )}
                </div>
              )}

              <div className="grid gap-3 sm:grid-cols-3">
                {paymentMethods.map((method) => (
                  <button
                    key={method}
                    type="button"
                    onClick={() => setPayment(method)}
                    className={cn(
                      'rounded-[12px] border px-4 py-3 text-sm font-semibold transition',
                      payment === method
                        ? 'brand-selected'
                        : 'border-slate-300 bg-[#f8f9fc] text-slate-700 hover:bg-white',
                    )}
                  >
                    {method.toUpperCase()}
                  </button>
                ))}
              </div>

              {payment === 'transfer' && (
                <div className="brand-outline-card rounded-[16px] p-4 text-sm text-slate-700">
                  <p>{settings.bankBank}</p>
                  <p className="mt-1">{settings.bankName}</p>
                  <p className="mt-1 font-display text-2xl text-slate-900 tabular-nums">{settings.bankNo}</p>
                </div>
              )}

              <div className="rounded-[16px] border border-[#1535D4] bg-[#1535D4] p-5">
                <div className="flex items-center justify-between">
                  <span className="text-sm uppercase tracking-[0.16em] text-white/70">TOTAL</span>
                  <span className="font-display text-[30px] text-white tabular-nums">{formatCurrency(total)}</span>
                </div>
              </div>

              <button type="button" onClick={processTransaction} className="brand-primary-btn w-full rounded-2xl px-4 py-3 font-semibold">
                Proses & Buat Invoice
              </button>
            </div>
          </Panel>
        </div>
      </div>

      {showInvoice && currentTx && (
        <InvoiceModal
          transaction={currentTx}
          businessName={settings.businessName}
          paymentInfo={{ bankBank: settings.bankBank, bankName: settings.bankName, bankNo: settings.bankNo }}
          receiptFooter={settings.receiptFooter}
          onClose={() => setShowInvoice(false)}
        />
      )}
    </div>
  );
}
