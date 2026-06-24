import { create } from 'zustand';
import type { Session } from '@supabase/supabase-js';
import { defaultSettings, demoCatalogItems, demoCustomers, demoOrderItems, demoOrders } from '@/lib/mock-data';
import { isSupabaseConfigured, supabase } from '@/lib/supabase';
import type { AppMode, CatalogItem, Customer, Order, OrderItem, PaymentMethod, SettingsState } from '@/types/app';

type CatalogInput = Omit<CatalogItem, 'id' | 'created_at'> & { id?: string };
type CustomerInput = Omit<Customer, 'id' | 'created_at'> & { id?: string };

interface CreateOrderInput {
  customerId: string | null;
  discount: number;
  tax: number;
  paymentMethod: PaymentMethod;
  notes: string;
  items: Array<{
    catalogItemId: string | null;
    itemName: string;
    itemType: CatalogItem['item_type'];
    quantity: number;
    unitPrice: number;
    lineTotal: number;
  }>;
}

interface CashierStore {
  mode: AppMode;
  ready: boolean;
  loading: boolean;
  authLoading: boolean;
  session: Session | null;
  authError: string | null;
  dataError: string | null;
  catalogItems: CatalogItem[];
  customers: Customer[];
  orders: Order[];
  orderItems: OrderItem[];
  settings: SettingsState;
  initialize: () => Promise<void>;
  setSession: (session: Session | null) => Promise<void>;
  signIn: (email: string, password: string) => Promise<boolean>;
  signOut: () => Promise<void>;
  refreshData: () => Promise<void>;
  saveCatalogItem: (input: CatalogInput) => Promise<void>;
  saveCustomer: (input: CustomerInput) => Promise<void>;
  createOrder: (input: CreateOrderInput) => Promise<void>;
  updateSettings: (input: SettingsState) => void;
}

const settingsKey = 'gen-autocare-settings';

function readStoredSettings() {
  const raw = localStorage.getItem(settingsKey);
  if (!raw) {
    return defaultSettings;
  }

  try {
    return JSON.parse(raw) as SettingsState;
  } catch {
    return defaultSettings;
  }
}

function buildOrderNumber() {
  return `GAC-${Date.now().toString().slice(-8)}`;
}

export const useCashierStore = create<CashierStore>((set, get) => ({
  mode: isSupabaseConfigured ? 'live' : 'demo',
  ready: false,
  loading: false,
  authLoading: false,
  session: null,
  authError: null,
  dataError: null,
  catalogItems: [],
  customers: [],
  orders: [],
  orderItems: [],
  settings: defaultSettings,
  initialize: async () => {
    if (!isSupabaseConfigured || !supabase) {
      set({
        mode: 'demo',
        ready: true,
        settings: readStoredSettings(),
        catalogItems: demoCatalogItems,
        customers: demoCustomers,
        orders: demoOrders,
        orderItems: demoOrderItems,
      });
      return;
    }

    const { data } = await supabase.auth.getSession();
    set({ settings: readStoredSettings(), ready: true });
    await get().setSession(data.session);
  },
  setSession: async (session) => {
    set({ session, mode: isSupabaseConfigured ? 'live' : 'demo', authError: null });

    if (!isSupabaseConfigured || !supabase || !session) {
      set({
        ready: true,
        loading: false,
        catalogItems: demoCatalogItems,
        customers: demoCustomers,
        orders: demoOrders,
        orderItems: demoOrderItems,
      });
      return;
    }

    await get().refreshData();
  },
  signIn: async (email, password) => {
    if (!supabase) {
      return false;
    }

    set({ authLoading: true, authError: null });
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });

    if (error) {
      set({ authLoading: false, authError: error.message });
      return false;
    }

    set({ authLoading: false });
    await get().setSession(data.session);
    return true;
  },
  signOut: async () => {
    if (supabase) {
      await supabase.auth.signOut();
    }

    set({
      session: null,
      catalogItems: demoCatalogItems,
      customers: demoCustomers,
      orders: demoOrders,
      orderItems: demoOrderItems,
    });
  },
  refreshData: async () => {
    if (!supabase || !get().session) {
      return;
    }

    set({ loading: true, dataError: null });

    const [catalogRes, customerRes, orderRes, orderItemRes] = await Promise.all([
      supabase.from('catalog_items').select('*').order('created_at', { ascending: false }),
      supabase.from('customers').select('*').order('created_at', { ascending: false }),
      supabase.from('orders').select('*').order('created_at', { ascending: false }),
      supabase.from('order_items').select('*'),
    ]);

    const error =
      catalogRes.error || customerRes.error || orderRes.error || orderItemRes.error || null;

    if (error) {
      set({
        loading: false,
        dataError: error.message,
        catalogItems: demoCatalogItems,
        customers: demoCustomers,
        orders: demoOrders,
        orderItems: demoOrderItems,
      });
      return;
    }

    set({
      loading: false,
      catalogItems: catalogRes.data ?? [],
      customers: customerRes.data ?? [],
      orders: orderRes.data ?? [],
      orderItems: orderItemRes.data ?? [],
    });
  },
  saveCatalogItem: async (input) => {
    if (!supabase || !get().session) {
      const item: CatalogItem = {
        ...input,
        id: input.id ?? crypto.randomUUID(),
        created_at: new Date().toISOString(),
      };

      set((state) => ({
        catalogItems: [item, ...state.catalogItems.filter((entry) => entry.id !== item.id)],
      }));
      return;
    }

    await supabase.from('catalog_items').upsert(input);
    await get().refreshData();
  },
  saveCustomer: async (input) => {
    if (!supabase || !get().session) {
      const customer: Customer = {
        ...input,
        id: input.id ?? crypto.randomUUID(),
        created_at: new Date().toISOString(),
      };

      set((state) => ({
        customers: [customer, ...state.customers.filter((entry) => entry.id !== customer.id)],
      }));
      return;
    }

    await supabase.from('customers').upsert(input);
    await get().refreshData();
  },
  createOrder: async (input) => {
    const orderId = crypto.randomUUID();
    const createdAt = new Date().toISOString();
    const orderNumber = buildOrderNumber();
    const cashierUserId = get().session?.user.id ?? 'demo-cashier';
    const subtotal = input.items.reduce((sum, item) => sum + item.lineTotal, 0);
    const total = subtotal - input.discount + input.tax;

    const order: Order = {
      id: orderId,
      order_number: orderNumber,
      customer_id: input.customerId,
      subtotal,
      discount: input.discount,
      tax: input.tax,
      total,
      payment_method: input.paymentMethod,
      status: 'completed',
      cashier_user_id: cashierUserId,
      notes: input.notes || null,
      created_at: createdAt,
    };

    const items: OrderItem[] = input.items.map((item) => ({
      id: crypto.randomUUID(),
      order_id: orderId,
      catalog_item_id: item.catalogItemId,
      item_name: item.itemName,
      item_type: item.itemType,
      quantity: item.quantity,
      unit_price: item.unitPrice,
      line_total: item.lineTotal,
    }));

    if (!supabase || !get().session) {
      set((state) => ({
        orders: [order, ...state.orders],
        orderItems: [...items, ...state.orderItems],
      }));
      return;
    }

    const { error: orderError } = await supabase.from('orders').insert(order);
    if (orderError) {
      set({ dataError: orderError.message });
      return;
    }

    const { error: itemError } = await supabase.from('order_items').insert(items);
    if (itemError) {
      set({ dataError: itemError.message });
      return;
    }

    await get().refreshData();
  },
  updateSettings: (input) => {
    localStorage.setItem(settingsKey, JSON.stringify(input));
    set({ settings: input });
  },
}));
