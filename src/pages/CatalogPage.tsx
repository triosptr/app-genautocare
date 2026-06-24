import { type FormEvent, useMemo, useState } from 'react';
import { Panel } from '@/components/ui/Panel';
import { useCashierStore } from '@/store/useCashierStore';
import type { CatalogItem, CatalogItemType } from '@/types/app';
import { formatCurrency } from '@/utils/format';

const emptyForm = {
  id: '',
  name: '',
  item_type: 'service' as CatalogItemType,
  sku: '',
  category: 'general',
  price: 0,
  cost: 0,
  stock_qty: 0,
  is_active: true,
};

export default function CatalogPage() {
  const { catalogItems, saveCatalogItem } = useCashierStore();
  const [query, setQuery] = useState('');
  const [form, setForm] = useState(emptyForm);

  const filteredItems = useMemo(
    () => catalogItems.filter((item) => item.name.toLowerCase().includes(query.toLowerCase())),
    [catalogItems, query],
  );

  function editItem(item: CatalogItem) {
    setForm({
      id: item.id,
      name: item.name,
      item_type: item.item_type,
      sku: item.sku ?? '',
      category: item.category,
      price: item.price,
      cost: item.cost ?? 0,
      stock_qty: item.stock_qty ?? 0,
      is_active: item.is_active,
    });
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    await saveCatalogItem({
      id: form.id || undefined,
      name: form.name,
      item_type: form.item_type,
      sku: form.sku || null,
      category: form.category,
      price: Number(form.price),
      cost: form.item_type === 'product' ? Number(form.cost) : null,
      stock_qty: form.item_type === 'product' ? Number(form.stock_qty) : null,
      is_active: form.is_active,
    });
    setForm(emptyForm);
  }

  return (
    <div className="grid gap-6 xl:grid-cols-[1.05fr_0.95fr]">
      <Panel title="Catalog Table" subtitle="Maintain products and services sold from the cashier counter.">
        <input
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Search item name"
          className="mb-4 w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none"
        />

        <div className="overflow-hidden rounded-3xl border border-white/10">
          <table className="min-w-full divide-y divide-white/10 text-left text-sm">
            <thead className="bg-white/5 text-slate-400">
              <tr>
                <th className="px-4 py-3">Name</th>
                <th className="px-4 py-3">Type</th>
                <th className="px-4 py-3">Price</th>
                <th className="px-4 py-3">Stock</th>
                <th className="px-4 py-3">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {filteredItems.map((item) => (
                <tr key={item.id} className="cursor-pointer bg-slate-950/40 transition hover:bg-white/5" onClick={() => editItem(item)}>
                  <td className="px-4 py-3 text-white">{item.name}</td>
                  <td className="px-4 py-3 text-slate-300">{item.item_type}</td>
                  <td className="px-4 py-3 text-slate-200">{formatCurrency(item.price)}</td>
                  <td className="px-4 py-3 text-slate-300">{item.stock_qty ?? '-'}</td>
                  <td className="px-4 py-3">
                    <span className={`rounded-full px-2 py-1 text-xs uppercase tracking-[0.2em] ${item.is_active ? 'bg-lime-300/15 text-lime-200' : 'bg-white/10 text-slate-400'}`}>
                      {item.is_active ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Panel>

      <Panel title="Item Editor" subtitle="Create a new sellable service or update an existing retail product.">
        <form className="grid gap-4 md:grid-cols-2" onSubmit={handleSubmit}>
          <label className="block md:col-span-2">
            <span className="mb-2 block text-sm text-slate-400">Item name</span>
            <input
              value={form.name}
              onChange={(event) => setForm((current) => ({ ...current, name: event.target.value }))}
              required
              className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none"
            />
          </label>

          <label className="block">
            <span className="mb-2 block text-sm text-slate-400">Type</span>
            <select
              value={form.item_type}
              onChange={(event) => setForm((current) => ({ ...current, item_type: event.target.value as CatalogItemType }))}
              className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none"
            >
              <option value="service">Service</option>
              <option value="product">Product</option>
            </select>
          </label>

          <label className="block">
            <span className="mb-2 block text-sm text-slate-400">Category</span>
            <input
              value={form.category}
              onChange={(event) => setForm((current) => ({ ...current, category: event.target.value }))}
              className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none"
            />
          </label>

          <label className="block">
            <span className="mb-2 block text-sm text-slate-400">SKU</span>
            <input
              value={form.sku}
              onChange={(event) => setForm((current) => ({ ...current, sku: event.target.value }))}
              className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none"
            />
          </label>

          <label className="block">
            <span className="mb-2 block text-sm text-slate-400">Price</span>
            <input
              type="number"
              value={form.price}
              onChange={(event) => setForm((current) => ({ ...current, price: Number(event.target.value) }))}
              className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none"
            />
          </label>

          <label className="block">
            <span className="mb-2 block text-sm text-slate-400">Cost</span>
            <input
              type="number"
              value={form.cost}
              onChange={(event) => setForm((current) => ({ ...current, cost: Number(event.target.value) }))}
              disabled={form.item_type !== 'product'}
              className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none disabled:opacity-50"
            />
          </label>

          <label className="block">
            <span className="mb-2 block text-sm text-slate-400">Stock</span>
            <input
              type="number"
              value={form.stock_qty}
              onChange={(event) => setForm((current) => ({ ...current, stock_qty: Number(event.target.value) }))}
              disabled={form.item_type !== 'product'}
              className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none disabled:opacity-50"
            />
          </label>

          <label className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-slate-300">
            <input
              type="checkbox"
              checked={form.is_active}
              onChange={(event) => setForm((current) => ({ ...current, is_active: event.target.checked }))}
            />
            Active item
          </label>

          <div className="flex gap-3 md:col-span-2">
            <button type="submit" className="rounded-2xl bg-cyan-300 px-4 py-3 font-medium text-slate-950 transition hover:bg-cyan-200">
              {form.id ? 'Update item' : 'Create item'}
            </button>
            <button type="button" onClick={() => setForm(emptyForm)} className="rounded-2xl border border-white/10 px-4 py-3 text-slate-300 transition hover:bg-white/5">
              Reset form
            </button>
          </div>
        </form>
      </Panel>
    </div>
  );
}
