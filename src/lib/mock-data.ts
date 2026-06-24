import type { CatalogItem, Customer, Order, OrderItem, SettingsState } from '@/types/app';

const now = new Date();

export const demoCatalogItems: CatalogItem[] = [
  {
    id: 'item-1',
    name: 'Premium Wash',
    item_type: 'service',
    sku: null,
    category: 'wash',
    price: 85000,
    cost: null,
    stock_qty: null,
    is_active: true,
    created_at: now.toISOString(),
  },
  {
    id: 'item-2',
    name: 'Nano Coating',
    item_type: 'service',
    sku: null,
    category: 'detailing',
    price: 350000,
    cost: null,
    stock_qty: null,
    is_active: true,
    created_at: now.toISOString(),
  },
  {
    id: 'item-3',
    name: 'Tire Shine',
    item_type: 'product',
    sku: 'PROD-TS-01',
    category: 'retail',
    price: 45000,
    cost: 22000,
    stock_qty: 18,
    is_active: true,
    created_at: now.toISOString(),
  },
  {
    id: 'item-4',
    name: 'Cabin Sanitizer',
    item_type: 'service',
    sku: null,
    category: 'interior',
    price: 125000,
    cost: null,
    stock_qty: null,
    is_active: true,
    created_at: now.toISOString(),
  },
];

export const demoCustomers: Customer[] = [
  {
    id: 'customer-1',
    name: 'Raka Pratama',
    phone: '081234567890',
    vehicle_plate: 'B 1234 GAC',
    vehicle_model: 'Toyota Yaris',
    notes: 'Prefers morning bookings',
    created_at: now.toISOString(),
  },
  {
    id: 'customer-2',
    name: 'Nadia Kusuma',
    phone: '081299988877',
    vehicle_plate: 'D 88 AUTO',
    vehicle_model: 'Honda HR-V',
    notes: 'Frequently adds detailing upsell',
    created_at: now.toISOString(),
  },
];

export const demoOrders: Order[] = [
  {
    id: 'order-1',
    order_number: 'GAC-240601',
    customer_id: 'customer-1',
    subtotal: 170000,
    discount: 10000,
    tax: 16000,
    total: 176000,
    payment_method: 'qris',
    status: 'completed',
    cashier_user_id: 'demo-cashier',
    notes: 'Demo transaction',
    created_at: new Date(now.getTime() - 3 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'order-2',
    order_number: 'GAC-240602',
    customer_id: 'customer-2',
    subtotal: 350000,
    discount: 0,
    tax: 35000,
    total: 385000,
    payment_method: 'card',
    status: 'completed',
    cashier_user_id: 'demo-cashier',
    notes: null,
    created_at: new Date(now.getTime() - 90 * 60 * 1000).toISOString(),
  },
];

export const demoOrderItems: OrderItem[] = [
  {
    id: 'line-1',
    order_id: 'order-1',
    catalog_item_id: 'item-1',
    item_name: 'Premium Wash',
    item_type: 'service',
    quantity: 2,
    unit_price: 85000,
    line_total: 170000,
  },
  {
    id: 'line-2',
    order_id: 'order-2',
    catalog_item_id: 'item-2',
    item_name: 'Nano Coating',
    item_type: 'service',
    quantity: 1,
    unit_price: 350000,
    line_total: 350000,
  },
];

export const defaultSettings: SettingsState = {
  businessName: 'GEN AUTOCARE',
  taxRate: 10,
  receiptFooter: 'Thank you for trusting GEN AUTOCARE.',
};
