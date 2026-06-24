import { useMemo, useState } from 'react';
import { Panel } from '@/components/ui/Panel';
import { useCashierStore } from '@/store/useCashierStore';
import { formatCurrency, formatDateTime } from '@/utils/format';

export default function CustomersPage() {
  const { customers, transactions, qcRecords, saveCustomer } = useCashierStore();
  const [query, setQuery] = useState('');
  const [selectedCustomerId, setSelectedCustomerId] = useState<string>(customers[0]?.id ?? '');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [plate, setPlate] = useState('');
  const [merk, setMerk] = useState('');

  const filteredCustomers = useMemo(
    () => customers.filter((customer) => [customer.name, customer.phone, customer.plate].join(' ').toLowerCase().includes(query.toLowerCase())),
    [customers, query],
  );

  const selectedCustomer = customers.find((customer) => customer.id === selectedCustomerId) ?? filteredCustomers[0] ?? null;
  const customerTransactions = transactions.filter((tx) => tx.customerId === selectedCustomer?.id);
  const customerQC = qcRecords.filter((qc) => selectedCustomer?.vehicles.some((vehicle) => vehicle.plate === qc.plate));

  function handleSave() {
    if (!name || !phone || !plate || !merk) {
      return;
    }

    const customerId = saveCustomer({ id: selectedCustomerId || undefined, name, phone, plate, merk });
    setSelectedCustomerId(customerId);
    setName('');
    setPhone('');
    setPlate('');
    setMerk('');
  }

  return (
    <div className="grid gap-6 xl:grid-cols-[0.95fr_1.05fr]">
      <Panel title="Database Pelanggan" subtitle="Nama, WhatsApp, plat, jumlah kunjungan, total belanja, dan poin.">
        <input
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Cari nama, WA, atau plat"
          className="brand-input mb-4 w-full rounded-2xl px-4 py-3"
        />
        <div className="space-y-3">
          {filteredCustomers.map((customer) => (
            <button
              key={customer.id}
              type="button"
              onClick={() => setSelectedCustomerId(customer.id)}
              className={`brand-soft-card w-full rounded-3xl p-4 text-left transition ${
                customer.id === selectedCustomer?.id ? 'border-[#C8F400]/30 bg-[#1535D4]/18' : ''
              }`}
            >
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="font-medium text-white">{customer.name}</p>
                  <p className="mt-1 text-sm text-slate-400">{customer.phone}</p>
                </div>
                <span className="rounded-full border border-[#C8F400]/20 px-2 py-1 text-xs uppercase tracking-[0.2em] text-[#C8F400]">
                  {customer.points} poin
                </span>
              </div>
              <div className="mt-4 flex items-center justify-between text-sm text-slate-300">
                <span>{customer.visits} kunjungan</span>
                <span>{formatCurrency(customer.spend)}</span>
              </div>
              <p className="mt-2 text-sm text-slate-300">
                {customer.vehicles.map((vehicle) => `${vehicle.plate} · ${vehicle.merk}`).join(' | ')}
              </p>
            </button>
          ))}
        </div>
      </Panel>

      <div className="space-y-6">
        <Panel title="Detail Pelanggan" subtitle="Kendaraan, riwayat kunjungan, dan QC per motor.">
          {selectedCustomer ? (
            <div className="space-y-4">
              <div className="brand-soft-card rounded-3xl p-4">
                <p className="font-display text-3xl text-white">{selectedCustomer.name}</p>
                <p className="mt-2 text-sm text-slate-300">{selectedCustomer.phone}</p>
                <div className="mt-4 grid gap-3 md:grid-cols-3">
                  <div className="rounded-2xl bg-[#1535D4]/35 p-4">
                    <p className="text-xs uppercase tracking-[0.2em] text-slate-200">Kunjungan</p>
                    <p className="mt-2 font-display text-2xl text-white">{selectedCustomer.visits}</p>
                  </div>
                  <div className="rounded-2xl bg-[#373A4A]/85 p-4">
                    <p className="text-xs uppercase tracking-[0.2em] text-slate-200">Total belanja</p>
                    <p className="mt-2 font-display text-2xl text-white">{formatCurrency(selectedCustomer.spend)}</p>
                  </div>
                  <div className="rounded-2xl bg-[#C8F400]/12 p-4">
                    <p className="text-xs uppercase tracking-[0.2em] text-[#C8F400]">Poin</p>
                    <p className="mt-2 font-display text-2xl text-white">{selectedCustomer.points}</p>
                  </div>
                </div>
              </div>

              <div className="brand-soft-card rounded-3xl p-4">
                <p className="text-sm uppercase tracking-[0.2em] text-slate-400">Daftar kendaraan</p>
                <div className="mt-3 space-y-3">
                  {selectedCustomer.vehicles.map((vehicle) => (
                    <div key={vehicle.plate} className="rounded-2xl border border-white/10 bg-[#2e3140]/80 p-4">
                      <p className="font-medium text-white">{vehicle.plate}</p>
                      <p className="mt-1 text-sm text-slate-300">{vehicle.merk}</p>
                      <div className="mt-3 space-y-2">
                        {customerQC
                          .filter((qc) => qc.plate === vehicle.plate)
                          .map((qc) => (
                            <div key={qc.id} className="flex items-center justify-between text-sm text-slate-300">
                              <span>{formatDateTime(qc.time)} · {qc.washer}</span>
                              <span className="text-[#C8F400]">Skor {qc.score}</span>
                            </div>
                          ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="brand-soft-card rounded-3xl p-4">
                <p className="text-sm uppercase tracking-[0.2em] text-slate-400">Riwayat kunjungan</p>
                <div className="mt-3 space-y-3">
                  {customerTransactions.map((tx) => (
                    <div key={tx.id} className="flex items-center justify-between rounded-2xl border border-white/10 bg-[#2e3140]/80 p-4">
                      <div>
                        <p className="font-medium text-white">{tx.services.join(', ')}</p>
                        <p className="mt-1 text-sm text-slate-300">{tx.washer} · {formatDateTime(tx.time)}</p>
                      </div>
                      <span className="text-white">{formatCurrency(tx.total)}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <p className="text-sm text-slate-400">Belum ada pelanggan dipilih.</p>
          )}
        </Panel>

        <Panel title="Tambah Pelanggan" subtitle="Tambah pelanggan baru atau kendaraan baru untuk owner yang sama.">
          <div className="grid gap-4 md:grid-cols-2">
            <input value={name} onChange={(event) => setName(event.target.value)} placeholder="Nama pelanggan" className="brand-input rounded-2xl px-4 py-3" />
            <input value={phone} onChange={(event) => setPhone(event.target.value)} placeholder="Nomor WhatsApp" className="brand-input rounded-2xl px-4 py-3" />
            <input value={plate} onChange={(event) => setPlate(event.target.value.toUpperCase())} placeholder="Plat nomor" className="brand-input rounded-2xl px-4 py-3" />
            <input value={merk} onChange={(event) => setMerk(event.target.value)} placeholder="Merk motor" className="brand-input rounded-2xl px-4 py-3" />
          </div>
          <button type="button" onClick={handleSave} className="brand-primary-btn mt-4 rounded-2xl px-4 py-3 font-medium">
            Simpan pelanggan
          </button>
        </Panel>
      </div>
    </div>
  );
}
