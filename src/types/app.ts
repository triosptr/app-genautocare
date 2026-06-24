export type AppMode = 'demo' | 'live';
export type CatalogItemType = 'product' | 'service';
export type PaymentMethod = 'cash' | 'card' | 'transfer' | 'qris';
export type OrderStatus = 'completed' | 'refunded' | 'void';

export interface CatalogItem {
  id: string;
  name: string;
  item_type: CatalogItemType;
  sku: string | null;
  category: string;
  price: number;
  cost: number | null;
  stock_qty: number | null;
  is_active: boolean;
  created_at: string;
}

export interface Customer {
  id: string;
  name: string;
  phone: string | null;
  vehicle_plate: string | null;
  vehicle_model: string | null;
  notes: string | null;
  created_at: string;
}

export interface Order {
  id: string;
  order_number: string;
  customer_id: string | null;
  subtotal: number;
  discount: number;
  tax: number;
  total: number;
  payment_method: PaymentMethod;
  status: OrderStatus;
  cashier_user_id: string;
  notes: string | null;
  created_at: string;
}

export interface OrderItem {
  id: string;
  order_id: string;
  catalog_item_id: string | null;
  item_name: string;
  item_type: CatalogItemType;
  quantity: number;
  unit_price: number;
  line_total: number;
}

export interface CartItem {
  id: string;
  name: string;
  itemType: CatalogItemType;
  quantity: number;
  price: number;
  lineTotal: number;
}

export interface DashboardMetric {
  label: string;
  value: string;
  hint: string;
}

export interface SettingsState {
  businessName: string;
  taxRate: number;
  receiptFooter: string;
}
