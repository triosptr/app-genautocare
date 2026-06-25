export type AppMode = 'demo' | 'hybrid';
export type AppRole = 'kasir';
export type PaymentMethod = 'cash' | 'qris' | 'transfer';
export type ServiceTier = 'BASIC' | 'STANDARD' | 'PREMIUM' | 'ELITE';
export type DiscountMode = 'amount' | 'percent';

export interface Service {
  id: string;
  name: string;
  price: number;
  tier: ServiceTier;
  commissionPct: number;
}

export interface Employee {
  id: string;
  name: string;
  present: boolean;
}

export interface Vehicle {
  plate: string;
  merk: string;
}

export interface Customer {
  id: string;
  name: string;
  phone: string;
  plate: string;
  visits: number;
  spend: number;
  points: number;
  vehicles: Vehicle[];
}

export interface Transaction {
  id: string;
  invoiceNo: string;
  time: string;
  txDate: string;
  plate: string;
  merk: string;
  cust: string;
  customerPhone: string;
  customerId: string;
  washerId: string;
  washer: string;
  services: string[];
  serviceIds: string[];
  subtotal: number;
  total: number;
  commissionTotal: number;
  pay: PaymentMethod;
  disc: number;
  pointsEarned: number;
  pointsRedeemed: number;
}

export interface PaymentInfo {
  bankName: string;
  bankNo: string;
  bankBank: string;
}

export interface SettingsState extends PaymentInfo {
  businessName: string;
  receiptFooter: string;
  services: Service[];
  discountMode: DiscountMode;
}
