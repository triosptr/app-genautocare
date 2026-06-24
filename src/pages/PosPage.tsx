import { MonitorUp, Search, ShoppingCart } from 'lucide-react';
import { useMemo, useState } from 'react';
import { Panel } from '@/components/ui/Panel';
import { useCashierStore } from '@/store/useCashierStore';
import type { PaymentMethod } from '@/types/app';
import { formatCurrency } from '@/utils/format';

const paymentMethods: PaymentMethod[] = ['cash', 'qris', 'transfer'];

export default function PosPage() {
  const { customers, services, employees, settings, createTransaction, transactions, updateQueueStatus, runQuickQC } =
    useCashierStore();
  const [query, setQuery] = useState('');
  const [selectedServices, setSelectedServices] = useState<string[]>([]);
  const [selectedCustomer, setSelectedCustomer] = useState<string>('');
  const [plate, setPlate] = useState('');
  const [merk, setMerk] = useState('');
  const [washerId, setWasherId] = useState('');
  const [discount, setDiscount] = useState(0);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('qris');
  const [usePoints, setUsePoints] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const filteredItems = useMemo(
    () => services.filter((item) => [item.name, item.tier].join(' ').toLowerCase().includes(query.toLowerCase())),
    [services, query],
  );

  const activeEmployees = employees.filter((employee) => employee.role === 'cuci' && employee.present);
  const selectedCustomerData = customers.find((customer) => customer.id === selectedCustomer) ?? null;
  const selectedServiceData = services.filter((service) => selectedServices.includes(service.id));
  const subtotal = selectedServiceData.reduce((sum, item) => sum + item.price, 0);
  const pointsValue =
    usePoints && (selectedCustomerData?.points ?? 0) >= settings.pointRedeemThreshold
      ? selectedServiceData[0]?.price ?? 0
      : 0;
  const total = Math.max(0, subtotal - discount - pointsValue);
  const queueStats = {
    masuk: transactions.filter((tx) => tx.status === 'Masuk').length,
    dicuci: transactions.filter((tx) => tx.status === 'Dicuci').length,
    selesai: transactions.filter((tx) => tx.status === 'Selesai').length,
  };
  const paymentBreakdown = paymentMethods.reduce<Record<string, number>>((acc, method) => {
    acc[method] = transactions.filter((tx) => tx.pay === method).reduce((sum, tx) => sum + tx.total, 0);
    return acc;
  }, {});

  async function handleCheckout() {
    if (!selectedServiceData.length || !washerId) {
      return;
    }

    setSubmitting(true);
    createTransaction({
      customerId: selectedCustomer || null,
      customerName: selectedCustomerData?.name ?? 'Walk In',
      phone: selectedCustomerData?.phone ?? '081234567890',
      plate: plate || selectedCustomerData?.plate || 'BH 0000 XX',
      merk: merk || selectedCustomerData?.vehicles[0]?.merk || 'Motor Customer',
      serviceIds: selectedServices,
      washerId,
      paymentMethod,
      discount,
      usePoints,
    });
    setSelectedServices([]);
    setDiscount(0);
    setUsePoints(false);
    setSubmitting(false);
  }

  return (
    <div className="space-y-6">
      <Panel title="Mode POS" subtitle="Satu layar untuk transaksi cepat.">
        <div className="mb-4 flex items-center gap-2 text-sm text-slate-600">
          <MonitorUp className="h-4 w-4 text-[#1535D4]" />
          <span>Tombol proses langsung membuat transaksi dan memasukkan motor ke antrian.</span>
        </div>
      </Panel>

      <div className="grid gap-6 xl:grid-cols-[1.15fr_0.85fr]">
        <Panel title="Pilih Data" subtitle="Cari pelanggan, layanan, dan teknisi." className="min-h-[720px]">
          <label className="brand-soft-card mb-4 flex items-center gap-3 rounded-2xl px-4 py-3">
            <Search className="h-4 w-4 text-slate-400" />
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Cari pelanggan, plat, layanan, atau tier"
              className="w-full bg-transparent text-sm text-slate-900 outline-none placeholder:text-slate-400"
            />
          </label>

          <div className="grid gap-4 md:grid-cols-2">
            <select value={selectedCustomer} onChange={(event) => setSelectedCustomer(event.target.value)} className="brand-input rounded-2xl px-4 py-3">
              <option value="">Walk in customer</option>
              {customers.map((customer) => (
                <option key={customer.id} value={customer.id}>
                  {customer.name} - {customer.plate}
                </option>
              ))}
            </select>
            <select value={washerId} onChange={(event) => setWasherId(event.target.value)} className="brand-input rounded-2xl px-4 py-3">
              <option value="">Pilih teknisi hadir</option>
              {activeEmployees.map((employee) => (
                <option key={employee.id} value={employee.id}>
                  {employee.name}
                </option>
              ))}
            </select>
            <input value={plate} onChange={(event) => setPlate(event.target.value.toUpperCase())} placeholder="Plat nomor" className="brand-input rounded-2xl px-4 py-3" />
            <input value={merk} onChange={(event) => setMerk(event.target.value)} placeholder="Merk motor" className="brand-input rounded-2xl px-4 py-3" />
          </div>

          <div className="mt-5 grid gap-3 md:grid-cols-2">
            {filteredItems.map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() =>
                  setSelectedServices((current) =>
                    current.includes(item.id) ? current.filter((entry) => entry !== item.id) : [...current, item.id],
                  )
                }
                className={`rounded-3xl border p-4 text-left transition ${
                  selectedServices.includes(item.id)
                    ? 'border-[#1535D4] bg-[#eef4ff] text-[#1535D4]'
                    : 'brand-soft-card text-slate-900 hover:border-[#1535D4]/16 hover:bg-[#f8fbff]'
                }`}
              >
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="font-medium">{item.name}</p>
                    <p className="mt-1 text-sm opacity-80">{item.tier}</p>
                  </div>
                  <span className="rounded-full border border-slate-200 px-2 py-1 text-[11px] uppercase tracking-[0.12em]">{item.tier}</span>
                </div>
                <p className="mt-4 font-display text-xl text-[#1535D4]">{formatCurrency(item.price)}</p>
              </button>
            ))}
          </div>
        </Panel>

        <Panel title="Ringkasan Order" subtitle="Total, bayar, dan proses transaksi." className="sticky top-4 h-fit">
          <div className="space-y-5">
            <div className="brand-soft-card rounded-3xl p-4">
              <div className="flex items-center gap-2 text-sm uppercase tracking-[0.2em] text-slate-400">
                <ShoppingCart className="h-4 w-4 text-[#1535D4]" />
                Ringkasan order
              </div>
              <div className="mt-4 space-y-3">
                {selectedServiceData.length === 0 && <p className="text-sm text-slate-400">Belum ada layanan dipilih.</p>}
                {selectedServiceData.map((item) => (
                  <div key={item.id} className="rounded-2xl border border-slate-200 bg-[#f8fafc] p-4">
                    <p className="font-medium text-slate-900">{item.name}</p>
                    <p className="mt-1 text-sm text-slate-500">{item.tier}</p>
                    <p className="mt-3 text-lg text-[#1535D4]">{formatCurrency(item.price)}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <input
                type="number"
                value={discount}
                onChange={(event) => setDiscount(Number(event.target.value))}
                className="brand-input rounded-2xl px-4 py-3"
                placeholder="Diskon Rp"
              />
              <label className="brand-soft-card flex items-center gap-3 rounded-2xl px-4 py-3 text-sm text-slate-700">
                <input type="checkbox" checked={usePoints} onChange={(event) => setUsePoints(event.target.checked)} />
                Gunakan poin
              </label>
            </div>

            <div className="grid gap-3 md:grid-cols-3">
              {paymentMethods.map((method) => (
                <button
                  key={method}
                  type="button"
                  onClick={() => setPaymentMethod(method)}
                  className={`rounded-2xl border px-4 py-3 text-sm font-medium transition ${
                    paymentMethod === method ? 'border-[#1535D4] bg-[#1535D4] text-white' : 'border-slate-200 bg-white text-slate-700'
                  }`}
                >
                  {method.toUpperCase()}
                </button>
              ))}
            </div>

            <div className="rounded-3xl border border-[#1535D4]/10 bg-[#eef4ff] p-5">
              <div className="flex items-center justify-between text-sm text-slate-600">
                <span>Subtotal</span>
                <span>{formatCurrency(subtotal)}</span>
              </div>
              <div className="mt-2 flex items-center justify-between text-sm text-slate-600">
                <span>Diskon + poin</span>
                <span>- {formatCurrency(discount + pointsValue)}</span>
              </div>
              <div className="mt-4 flex items-center justify-between border-t border-[#1535D4]/10 pt-4">
                <span className="text-sm uppercase tracking-[0.16em] text-[#1535D4]">Total</span>
                <span className="font-display text-[30px] text-slate-900">{formatCurrency(total)}</span>
              </div>
            </div>

            <button
              type="button"
              disabled={!selectedServiceData.length || !washerId || submitting}
              onClick={handleCheckout}
              className="brand-primary-btn w-full rounded-2xl px-4 py-4 text-lg font-semibold disabled:cursor-not-allowed disabled:opacity-60"
            >
              {submitting ? 'Memproses...' : 'PROSES'}
            </button>
          </div>
        </Panel>
      </div>

      <Panel title="Status Ringkas" subtitle="Pantau antrian dan pembayaran tanpa pindah halaman.">
        <div className="grid gap-4 xl:grid-cols-3">
          <div className="rounded-3xl border border-slate-200 bg-white p-5">
            <p className="text-[11px] uppercase tracking-[0.16em] text-slate-500">Live Queue</p>
            <div className="mt-4 grid gap-3 md:grid-cols-3">
              <div className="rounded-2xl bg-[#eef4ff] p-4">
                <p className="text-sm text-slate-600">Masuk</p>
                <p className="mt-2 font-display text-3xl text-[#1535D4]">{queueStats.masuk}</p>
              </div>
              <div className="rounded-2xl bg-[#f8fafc] p-4">
                <p className="text-sm text-slate-600">Dicuci</p>
                <p className="mt-2 font-display text-3xl text-slate-900">{queueStats.dicuci}</p>
              </div>
              <div className="rounded-2xl bg-[#f5ffcf] p-4">
                <p className="text-sm text-[#6b7f00]">Selesai</p>
                <p className="mt-2 font-display text-3xl text-slate-900">{queueStats.selesai}</p>
              </div>
            </div>
          </div>

          <div className="rounded-3xl border border-slate-200 bg-white p-5">
            <p className="text-[11px] uppercase tracking-[0.16em] text-slate-500">Pendapatan</p>
            <div className="mt-4 space-y-3">
              {Object.entries(paymentBreakdown).map(([key, amount]) => (
                <div key={key} className="flex items-center justify-between text-sm text-slate-700">
                  <span>{key.toUpperCase()}</span>
                  <span>{formatCurrency(amount)}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-3xl border border-slate-200 bg-white p-5">
            <p className="text-[11px] uppercase tracking-[0.16em] text-slate-500">Teknisi hadir</p>
            <div className="mt-4 space-y-3">
              {activeEmployees.map((employee) => (
                <div key={employee.id} className="flex items-center justify-between text-sm text-slate-700">
                  <span>{employee.name}</span>
                  <span>{employee.activeMotorCount} motor</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-6 grid gap-4 xl:grid-cols-3">
          {(['Masuk', 'Dicuci', 'Selesai'] as const).map((status) => (
            <div key={status} className="brand-soft-card rounded-3xl p-4">
              <p className="text-sm font-semibold uppercase tracking-[0.16em] text-slate-900">{status}</p>
              <div className="mt-4 space-y-3">
                {transactions
                  .filter((tx) => tx.status === status)
                  .slice(0, 3)
                  .map((tx) => (
                    <div key={tx.id} className="rounded-2xl border border-slate-200 bg-[#f8fafc] p-3">
                      <p className="font-medium text-slate-900">{tx.plate}</p>
                      <p className="mt-1 text-sm text-slate-500">{tx.cust}</p>
                      <div className="mt-3 flex gap-2">
                        {status === 'Masuk' && (
                          <button type="button" onClick={() => updateQueueStatus(tx.id, 'Dicuci')} className="brand-secondary-btn rounded-xl px-3 py-2 text-xs">
                            Mulai Cuci
                          </button>
                        )}
                        {status === 'Dicuci' && (
                          <>
                            <button type="button" onClick={() => runQuickQC(tx.id)} className="brand-secondary-btn rounded-xl px-3 py-2 text-xs">
                              Quick QC
                            </button>
                            <button type="button" onClick={() => updateQueueStatus(tx.id, 'Selesai')} className="brand-primary-btn rounded-xl px-3 py-2 text-xs">
                              Selesai
                            </button>
                          </>
                        )}
                        {status === 'Selesai' && (
                          <button type="button" onClick={() => runQuickQC(tx.id)} className="brand-secondary-btn rounded-xl px-3 py-2 text-xs">
                            QC →
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          ))}
        </div>
      </Panel>
    </div>
  );
}
