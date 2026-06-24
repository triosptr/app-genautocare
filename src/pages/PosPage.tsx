import { Minus, Plus, Search, ShoppingCart, Trash2 } from 'lucide-react';
import { useMemo, useState } from 'react';
import { Panel } from '@/components/ui/Panel';
import { useCashierStore } from '@/store/useCashierStore';
import type { CartItem, CatalogItem, PaymentMethod } from '@/types/app';
import { formatCurrency } from '@/utils/format';

const paymentMethods: PaymentMethod[] = ['cash', 'card', 'transfer', 'qris'];

function buildCartItem(item: CatalogItem): CartItem {
  return {
    id: item.id,
    name: item.name,
    itemType: item.item_type,
    quantity: 1,
    price: item.price,
    lineTotal: item.price,
  };
}

export default function PosPage() {
  const { catalogItems, customers, settings, createOrder } = useCashierStore();
  const [query, setQuery] = useState('');
  const [cart, setCart] = useState<CartItem[]>([]);
  const [selectedCustomer, setSelectedCustomer] = useState<string>('');
  const [discount, setDiscount] = useState(0);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('qris');
  const [notes, setNotes] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const filteredItems = useMemo(
    () =>
      catalogItems.filter((item) =>
        [item.name, item.category, item.sku ?? ''].join(' ').toLowerCase().includes(query.toLowerCase()),
      ),
    [catalogItems, query],
  );

  const subtotal = cart.reduce((sum, item) => sum + item.lineTotal, 0);
  const tax = Math.round((subtotal - discount) * (settings.taxRate / 100));
  const total = subtotal - discount + tax;

  function addItem(item: CatalogItem) {
    setCart((current) => {
      const existing = current.find((entry) => entry.id === item.id);
      if (!existing) {
        return [...current, buildCartItem(item)];
      }

      return current.map((entry) =>
        entry.id === item.id
          ? { ...entry, quantity: entry.quantity + 1, lineTotal: (entry.quantity + 1) * entry.price }
          : entry,
      );
    });
  }

  function updateQuantity(id: string, nextQuantity: number) {
    setCart((current) =>
      current
        .map((entry) =>
          entry.id === id
            ? { ...entry, quantity: Math.max(1, nextQuantity), lineTotal: Math.max(1, nextQuantity) * entry.price }
            : entry,
        )
        .filter((entry) => entry.quantity > 0),
    );
  }

  async function handleCheckout() {
    if (!cart.length) {
      return;
    }

    setSubmitting(true);
    await createOrder({
      customerId: selectedCustomer || null,
      discount,
      tax,
      paymentMethod,
      notes,
      items: cart.map((item) => ({
        catalogItemId: item.id,
        itemName: item.name,
        itemType: item.itemType,
        quantity: item.quantity,
        unitPrice: item.price,
        lineTotal: item.lineTotal,
      })),
    });
    setCart([]);
    setSelectedCustomer('');
    setDiscount(0);
    setNotes('');
    setSubmitting(false);
  }

  return (
    <div className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
      <Panel title="Catalog Search" subtitle="Build the basket with services and retail products." className="min-h-[720px]">
        <label className="brand-soft-card mb-4 flex items-center gap-3 rounded-2xl px-4 py-3">
          <Search className="h-4 w-4 text-slate-400" />
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search by name, category, or SKU"
            className="w-full bg-transparent text-sm text-white outline-none placeholder:text-slate-500"
          />
        </label>

        <div className="grid gap-3 md:grid-cols-2">
          {filteredItems.map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => addItem(item)}
              className="brand-soft-card rounded-3xl p-4 text-left transition hover:border-[#C8F400]/30 hover:bg-[#1535D4]/18"
            >
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="font-medium text-white">{item.name}</p>
                  <p className="mt-1 text-sm text-slate-400">{item.category}</p>
                </div>
                <span className="rounded-full border border-white/10 px-2 py-1 text-xs uppercase tracking-[0.16em] text-slate-300">
                  {item.item_type}
                </span>
              </div>
              <p className="mt-4 font-display text-2xl text-[#C8F400]">{formatCurrency(item.price)}</p>
            </button>
          ))}
        </div>
      </Panel>

      <Panel title="Checkout Panel" subtitle="Finalize the customer, payment, and pricing breakdown.">
        <div className="space-y-5">
          <div className="brand-soft-card rounded-3xl p-4">
            <div className="flex items-center gap-2 text-sm uppercase tracking-[0.2em] text-slate-400">
              <ShoppingCart className="h-4 w-4 text-[#C8F400]" />
              Active cart
            </div>
            <div className="mt-4 space-y-3">
              {cart.length === 0 && <p className="text-sm text-slate-400">No items yet. Add services or products from the left panel.</p>}
              {cart.map((item) => (
                <div key={item.id} className="rounded-2xl border border-white/10 bg-[#2e3140]/90 p-4">
                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <p className="font-medium text-white">{item.name}</p>
                      <p className="text-sm text-slate-400">{formatCurrency(item.price)} each</p>
                    </div>
                    <button type="button" onClick={() => setCart((current) => current.filter((entry) => entry.id !== item.id))} className="text-slate-400 transition hover:text-red-300">
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                  <div className="mt-4 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <button type="button" onClick={() => updateQuantity(item.id, item.quantity - 1)} className="brand-secondary-btn rounded-xl p-2 text-slate-300">
                        <Minus className="h-4 w-4" />
                      </button>
                      <span className="min-w-10 text-center text-sm text-white">{item.quantity}</span>
                      <button type="button" onClick={() => updateQuantity(item.id, item.quantity + 1)} className="brand-secondary-btn rounded-xl p-2 text-slate-300">
                        <Plus className="h-4 w-4" />
                      </button>
                    </div>
                    <p className="font-display text-xl text-white">{formatCurrency(item.lineTotal)}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <label className="block">
              <span className="mb-2 block text-sm text-slate-400">Customer</span>
              <select
                value={selectedCustomer}
                onChange={(event) => setSelectedCustomer(event.target.value)}
                className="brand-input w-full rounded-2xl px-4 py-3"
              >
                <option value="">Walk-in customer</option>
                {customers.map((customer) => (
                  <option key={customer.id} value={customer.id}>
                    {customer.name}
                  </option>
                ))}
              </select>
            </label>

            <label className="block">
              <span className="mb-2 block text-sm text-slate-400">Payment method</span>
              <select
                value={paymentMethod}
                onChange={(event) => setPaymentMethod(event.target.value as PaymentMethod)}
                className="brand-input w-full rounded-2xl px-4 py-3"
              >
                {paymentMethods.map((method) => (
                  <option key={method} value={method}>
                    {method.toUpperCase()}
                  </option>
                ))}
              </select>
            </label>
          </div>

          <label className="block">
            <span className="mb-2 block text-sm text-slate-400">Discount</span>
            <input
              type="number"
              value={discount}
              onChange={(event) => setDiscount(Number(event.target.value))}
              className="brand-input w-full rounded-2xl px-4 py-3"
            />
          </label>

          <label className="block">
            <span className="mb-2 block text-sm text-slate-400">Notes</span>
            <textarea
              value={notes}
              onChange={(event) => setNotes(event.target.value)}
              rows={3}
              className="brand-input w-full rounded-2xl px-4 py-3"
              placeholder="Optional notes for the service team"
            />
          </label>

          <div className="rounded-3xl border border-[#C8F400]/18 bg-[#C8F400]/10 p-5">
            <div className="flex items-center justify-between text-sm text-slate-300">
              <span>Subtotal</span>
              <span>{formatCurrency(subtotal)}</span>
            </div>
            <div className="mt-2 flex items-center justify-between text-sm text-slate-300">
              <span>Discount</span>
              <span>- {formatCurrency(discount)}</span>
            </div>
            <div className="mt-2 flex items-center justify-between text-sm text-slate-300">
              <span>Tax ({settings.taxRate}%)</span>
              <span>{formatCurrency(tax)}</span>
            </div>
            <div className="mt-4 flex items-center justify-between border-t border-lime-300/15 pt-4">
              <span className="text-sm uppercase tracking-[0.2em] text-[#C8F400]">Total</span>
              <span className="font-display text-3xl text-white">{formatCurrency(total)}</span>
            </div>
          </div>

          <button
            type="button"
            disabled={!cart.length || submitting}
            onClick={handleCheckout}
            className="brand-primary-btn w-full rounded-2xl px-4 py-3 font-medium disabled:cursor-not-allowed disabled:opacity-60"
          >
            {submitting ? 'Saving transaction...' : 'Complete transaction'}
          </button>
        </div>
      </Panel>
    </div>
  );
}
