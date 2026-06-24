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
      <Panel title="Pelanggan" subtitle="Cari pelanggan dengan cepat dari meja kasir.">
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
                customer.id === selectedCustomer?.id ? 'border-[#1535D4]/16 bg-[#f8fbff]' : ''
              }`}
            >
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="font-medium text-slate-900">{customer.name}</p>
                  <p className="mt-1 text-sm text-slate-500">{customer.phone}</p>
                </div>
                <span className="rounded-full border border-[#1535D4]/12 px-2 py-1 text-[11px] uppercase tracking-[0.16em] text-[#1535D4]">
                  {customer.points} poin
                </span>
              </div>
              <div className="mt-4 flex items-center justify-between text-sm text-slate-600">
                <span>{customer.visits} kunjungan</span>
                <span>{formatCurrency(customer.spend)}</span>
              </div>
              <p className="mt-2 text-sm text-slate-600">
                {customer.vehicles.map((vehicle) => `${vehicle.plate} · ${vehicle.merk}`).join(' | ')}
              </p>
            </button>
          ))}
        </div>
      </Panel>

      <div className="space-y-6">
        <Panel title="Detail Pelanggan" subtitle="Riwayat singkat kendaraan dan transaksi pelanggan.">
          {selectedCustomer ? (
            <div className="space-y-4">
              <div className="brand-soft-card rounded-3xl p-4">
                <p className="font-display text-[28px] text-slate-900">{selectedCustomer.name}</p>
                <p className="mt-2 text-sm text-slate-600">{selectedCustomer.phone}</p>
                <div className="mt-4 grid gap-3 md:grid-cols-3">
                  <div className="rounded-2xl bg-[#eef4ff] p-4">
                    <p className="text-[11px] uppercase tracking-[0.16em] text-slate-500">Kunjungan</p>
                    <p className="mt-2 font-display text-2xl text-[#1535D4]">{selectedCustomer.visits}</p>
                  </div>
                  <div className="rounded-2xl bg-[#f8fafc] p-4">
                    <p className="text-[11px] uppercase tracking-[0.16em] text-slate-500">Total belanja</p>
                    <p className="mt-2 font-display text-2xl text-slate-900">{formatCurrency(selectedCustomer.spend)}</p>
                  </div>
                  <div className="rounded-2xl bg-[#f5ffcf] p-4">
                    <p className="text-[11px] uppercase tracking-[0.16em] text-[#6b7f00]">Poin</p>
                    <p className="mt-2 font-display text-2xl text-slate-900">{selectedCustomer.points}</p>
                  </div>
                </div>
              </div>

              <div className="brand-soft-card rounded-3xl p-4">
                <p className="text-sm uppercase tracking-[0.16em] text-slate-500">Daftar kendaraan</p>
                <div className="mt-3 space-y-3">
                  {selectedCustomer.vehicles.map((vehicle) => (
                    <div key={vehicle.plate} className="rounded-2xl border border-slate-200 bg-[#f8fafc] p-4">
                      <p className="font-medium text-slate-900">{vehicle.plate}</p>
                      <p className="mt-1 text-sm text-slate-600">{vehicle.merk}</p>
                      <div className="mt-3 space-y-2">
                        {customerQC
                          .filter((qc) => qc.plate === vehicle.plate)
                          .map((qc) => (
                            <div key={qc.id} className="flex items-center justify-between text-sm text-slate-600">
                              <span>{formatDateTime(qc.time)} · {qc.washer}</span>
                              <span className="text-[#1535D4]">Skor {qc.score}</span>
                            </div>
                          ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="brand-soft-card rounded-3xl p-4">
                <p className="text-sm uppercase tracking-[0.16em] text-slate-500">Riwayat kunjungan</p>
                <div className="mt-3 space-y-3">
                  {customerTransactions.map((tx) => (
                    <div key={tx.id} className="flex items-center justify-between rounded-2xl border border-slate-200 bg-[#f8fafc] p-4">
                      <div>
                        <p className="font-medium text-slate-900">{tx.services.join(', ')}</p>
                        <p className="mt-1 text-sm text-slate-600">{tx.washer} · {formatDateTime(tx.time)}</p>
                      </div>
                      <span className="text-slate-900">{formatCurrency(tx.total)}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <p className="text-sm text-slate-400">Belum ada pelanggan dipilih.</p>
          )}
        </Panel>

        <Panel title="Tambah Pelanggan" subtitle="Tambah data pelanggan baru secara cepat.">
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
