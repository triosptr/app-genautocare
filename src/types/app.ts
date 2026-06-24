export type AppMode = 'demo' | 'hybrid';
export type AppRole = 'owner' | 'manager_ops' | 'kasir';
export type EmployeeRole = 'cuci' | 'kasir' | 'manager';
export type PaymentMethod = 'cash' | 'qris' | 'transfer';
export type QueueStatus = 'Masuk' | 'Dicuci' | 'Selesai';
export type CommissionType = 'flat' | 'persen';
export type ServiceTier = 'BASIC' | 'STANDARD' | 'PREMIUM' | 'ELITE';
export type StockMoveType = 'in' | 'out';
export type CostType = 'bulanan' | 'harian';
export type ChecklistState = 'Siap' | 'Perlu Restok';
export type QCRating = 40 | 70 | 100;

export interface RoleCard {
  id: AppRole;
  label: string;
  short: string;
  description: string;
}

export interface Service {
  id: string;
  name: string;
  price: number;
  tier: ServiceTier;
  kType: CommissionType;
  kVal: number;
  modalItems: string[];
  active: boolean;
}

export interface Employee {
  id: string;
  name: string;
  role: EmployeeRole;
  present: boolean;
  in: string | null;
  out: string | null;
  photo: string | null;
  active: boolean;
  activeMotorCount: number;
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
  customerId: string;
  washerId: string;
  washer: string;
  services: string[];
  serviceIds: string[];
  subtotal: number;
  total: number;
  komisi: number;
  pay: PaymentMethod;
  status: QueueStatus;
  disc: number;
  pointsUsed: boolean;
  pointsEarned: number;
  finishedAt: string | null;
  beforePhoto: string | null;
  afterPhoto: string | null;
}

export interface QCDetail {
  body: QCRating;
  velg: QCRating;
  spakbor: QCRating;
  jok: QCRating;
  spionLampu: QCRating;
  areaMesin: QCRating;
  kekeringan: QCRating;
}

export interface QCRecord {
  id: string;
  txId: string;
  plate: string;
  merk: string;
  washer: string;
  washerId: string;
  score: number;
  time: string;
  details: QCDetail;
  afterPhoto: string | null;
}

export interface PendingQC {
  id: string;
  txId: string;
  plate: string;
  merk: string;
  washer: string;
  washerId: string;
  time: string;
  cust: string;
}

export interface InventoryItem {
  id: string;
  name: string;
  unit: string;
  stock: number;
  min: number;
  costPrice: number;
  litersPerUnit: number;
  motorsPerLiter: number;
  autoDeduct: boolean;
}

export interface StockMove {
  id: string;
  itemId: string;
  type: StockMoveType;
  qty: number;
  note: string;
  by: string;
  time: string;
  status: 'pending' | 'approved';
  verified: boolean;
}

export interface OpsCost {
  id: string;
  name: string;
  amount: number;
  type: CostType;
  date: string;
}

export interface DailyProductCheck {
  id: string;
  label: string;
  state: ChecklistState;
}

export interface TxPhotos {
  txId: string;
  before: string | null;
  after: string | null;
}

export interface DashboardMetric {
  label: string;
  value: string;
  hint: string;
  tone?: 'blue' | 'lime' | 'muted';
}

export interface QueueColumnStat {
  key: QueueStatus;
  label: string;
  count: number;
}

export interface ServiceCartItem {
  id: string;
  name: string;
  tier: ServiceTier;
  price: number;
  commission: number;
}

export interface PaymentInfo {
  bankName: string;
  bankNo: string;
  bankBank: string;
  qrImage: string;
}

export interface SettingsState extends PaymentInfo {
  businessName: string;
  receiptFooter: string;
  pointRewardPerTx: number;
  pointRedeemThreshold: number;
  services: Service[];
}
