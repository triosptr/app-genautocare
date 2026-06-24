import { type FormEvent, useMemo, useState } from 'react';
import { Panel } from '@/components/ui/Panel';
import { useCashierStore } from '@/store/useCashierStore';
import type { Customer } from '@/types/app';
import { formatDateTime } from '@/utils/format';

const emptyForm = {
  id: '',
  name: '',
  phone: '',
  vehicle_plate: '',
  vehicle_model: '',
  notes: '',
};

export default function CustomersPage() {
  const { customers, orders, saveCustomer } = useCashierStore();
  const [query, setQuery] = useState('');
  const [form, setForm] = useState(emptyForm);

  const filteredCustomers = useMemo(
    () =>
      customers.filter((customer) =>
        [customer.name, customer.phone ?? '', customer.vehicle_plate ?? ''].join(' ').toLowerCase().includes(query.toLowerCase()),
      ),
    [customers, query],
  );

  function editCustomer(customer: Customer) {
    setForm({
      id: customer.id,
      name: customer.name,
      phone: customer.phone ?? '',
      vehicle_plate: customer.vehicle_plate ?? '',
      vehicle_model: customer.vehicle_model ?? '',
      notes: customer.notes ?? '',
    });
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    await saveCustomer({
      id: form.id || undefined,
      name: form.name,
      phone: form.phone || null,
      vehicle_plate: form.vehicle_plate || null,
      vehicle_model: form.vehicle_model || null,
      notes: form.notes || null,
    });
    setForm(emptyForm);
  }

  return (
    <div className="grid gap-6 xl:grid-cols-[0.95fr_1.05fr]">
      <Panel title="Customer Base" subtitle="Search, review, and edit customer records with service context.">
        <input
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Search by name, phone, or plate"
          className="brand-input mb-4 w-full rounded-2xl px-4 py-3"
        />
        <div className="space-y-3">
          {filteredCustomers.map((customer) => {
            const visits = orders.filter((order) => order.customer_id === customer.id).length;
            return (
              <button
                key={customer.id}
                type="button"
                onClick={() => editCustomer(customer)}
                className="brand-soft-card w-full rounded-3xl p-4 text-left transition hover:border-[#C8F400]/30 hover:bg-[#1535D4]/18"
              >
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="font-medium text-white">{customer.name}</p>
                    <p className="mt-1 text-sm text-slate-400">{customer.phone ?? 'No phone number'}</p>
                  </div>
                  <span className="rounded-full border border-white/10 px-2 py-1 text-xs uppercase tracking-[0.2em] text-slate-300">
                    {visits} visits
                  </span>
                </div>
                <p className="mt-4 text-sm text-slate-300">{customer.vehicle_plate ?? 'No plate'} · {customer.vehicle_model ?? 'Vehicle not set'}</p>
                <p className="mt-2 text-xs text-slate-500">Created {formatDateTime(customer.created_at)}</p>
              </button>
            );
          })}
        </div>
      </Panel>

      <Panel title="Customer Editor" subtitle="Add walk-in customers to history or update repeat customer details.">
        <form className="grid gap-4 md:grid-cols-2" onSubmit={handleSubmit}>
          <label className="block md:col-span-2">
            <span className="mb-2 block text-sm text-slate-400">Customer name</span>
            <input
              value={form.name}
              onChange={(event) => setForm((current) => ({ ...current, name: event.target.value }))}
              required
              className="brand-input w-full rounded-2xl px-4 py-3"
            />
          </label>

          <label className="block">
            <span className="mb-2 block text-sm text-slate-400">Phone number</span>
            <input
              value={form.phone}
              onChange={(event) => setForm((current) => ({ ...current, phone: event.target.value }))}
              className="brand-input w-full rounded-2xl px-4 py-3"
            />
          </label>

          <label className="block">
            <span className="mb-2 block text-sm text-slate-400">Vehicle plate</span>
            <input
              value={form.vehicle_plate}
              onChange={(event) => setForm((current) => ({ ...current, vehicle_plate: event.target.value }))}
              className="brand-input w-full rounded-2xl px-4 py-3"
            />
          </label>

          <label className="block">
            <span className="mb-2 block text-sm text-slate-400">Vehicle model</span>
            <input
              value={form.vehicle_model}
              onChange={(event) => setForm((current) => ({ ...current, vehicle_model: event.target.value }))}
              className="brand-input w-full rounded-2xl px-4 py-3"
            />
          </label>

          <label className="block md:col-span-2">
            <span className="mb-2 block text-sm text-slate-400">Notes</span>
            <textarea
              value={form.notes}
              onChange={(event) => setForm((current) => ({ ...current, notes: event.target.value }))}
              rows={4}
              className="brand-input w-full rounded-2xl px-4 py-3"
            />
          </label>

          <div className="flex gap-3 md:col-span-2">
            <button type="submit" className="brand-primary-btn rounded-2xl px-4 py-3 font-medium">
              {form.id ? 'Update customer' : 'Create customer'}
            </button>
            <button type="button" onClick={() => setForm(emptyForm)} className="brand-secondary-btn rounded-2xl px-4 py-3 text-slate-300">
              Reset form
            </button>
          </div>
        </form>
      </Panel>
    </div>
  );
}
