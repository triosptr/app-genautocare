import type {
  Customer,
  DailyProductCheck,
  Employee,
  InventoryItem,
  OpsCost,
  PendingQC,
  QCDetail,
  QCRecord,
  RoleCard,
  Service,
  SettingsState,
  StockMove,
  Transaction,
} from '@/types/app';

const now = new Date();
const today = now.toISOString();

function isoHoursAgo(hours: number) {
  return new Date(now.getTime() - hours * 60 * 60 * 1000).toISOString();
}

export const roleCards: RoleCard[] = [
  {
    id: 'owner',
    label: 'Owner',
    short: 'Akses penuh bisnis',
    description: 'Melihat semua modul, pengaturan, rekap keuangan, dan membuka Mode POS dari header.',
  },
  {
    id: 'manager_ops',
    label: 'Manager Ops',
    short: 'Kontrol operasional harian',
    description: 'Mengelola antrian, QC, gudang, absensi, laporan, dan membuka Mode POS dari header.',
  },
  {
    id: 'kasir',
    label: 'Kasir',
    short: 'Fokus transaksi cepat',
    description: 'Menggunakan dashboard, kasir detail, mode POS, antrian, pelanggan, absensi, dan laporan harian.',
  },
];

export const demoServices: Service[] = [
  { id: 'svc-1', name: 'Basic Wash', price: 18000, tier: 'BASIC', kType: 'flat', kVal: 3000, modalItems: ['inv-1'], active: true },
  { id: 'svc-2', name: 'Standard Wash', price: 25000, tier: 'STANDARD', kType: 'flat', kVal: 5000, modalItems: ['inv-1', 'inv-2'], active: true },
  { id: 'svc-3', name: 'Premium Wash', price: 35000, tier: 'PREMIUM', kType: 'persen', kVal: 15, modalItems: ['inv-1', 'inv-2', 'inv-3'], active: true },
  { id: 'svc-4', name: 'Elite Detailing', price: 50000, tier: 'ELITE', kType: 'persen', kVal: 20, modalItems: ['inv-1', 'inv-2', 'inv-3', 'inv-4'], active: true },
];

export const demoEmployees: Employee[] = [
  { id: 'emp-1', name: 'Rizky', role: 'cuci', present: true, in: '07:40', out: null, photo: null, active: true, activeMotorCount: 2 },
  { id: 'emp-2', name: 'Aldi', role: 'cuci', present: true, in: '07:50', out: null, photo: null, active: true, activeMotorCount: 1 },
  { id: 'emp-3', name: 'Salsa', role: 'kasir', present: true, in: '08:00', out: null, photo: null, active: true, activeMotorCount: 0 },
  { id: 'emp-4', name: 'Dimas', role: 'manager', present: true, in: '07:30', out: null, photo: null, active: true, activeMotorCount: 0 },
];

export const demoCustomers: Customer[] = [
  {
    id: 'cust-1',
    name: 'Raka Pratama',
    phone: '081234567890',
    plate: 'BH 1009 JFR',
    visits: 12,
    spend: 410000,
    points: 80,
    vehicles: [
      { plate: 'BH 1009 JFR', merk: 'Honda Beat' },
      { plate: 'BH 2177 ZK', merk: 'Yamaha NMax' },
    ],
  },
  {
    id: 'cust-2',
    name: 'Nadia Kusuma',
    phone: '081299988877',
    plate: 'BH 4567 AC',
    visits: 7,
    spend: 255000,
    points: 60,
    vehicles: [{ plate: 'BH 4567 AC', merk: 'Honda Scoopy' }],
  },
];

function baseQC(score: number): QCDetail {
  const value = score >= 90 ? 100 : 70;
  return {
    body: value,
    velg: value,
    spakbor: value,
    jok: value,
    spionLampu: value,
    areaMesin: value,
    kekeringan: value,
  };
}

export const demoTransactions: Transaction[] = [
  {
    id: 'tx-1',
    invoiceNo: 'INV-240624-001',
    time: isoHoursAgo(4),
    txDate: today,
    plate: 'BH 1009 JFR',
    merk: 'Honda Beat',
    cust: 'Raka Pratama',
    customerId: 'cust-1',
    washerId: 'emp-1',
    washer: 'Rizky',
    services: ['Premium Wash'],
    serviceIds: ['svc-3'],
    subtotal: 35000,
    total: 35000,
    komisi: 5250,
    pay: 'qris',
    status: 'Selesai',
    disc: 0,
    pointsUsed: false,
    pointsEarned: 10,
    finishedAt: isoHoursAgo(2),
    beforePhoto: 'https://images.unsplash.com/photo-1558981806-ec527fa84c39?auto=format&fit=crop&w=900&q=80',
    afterPhoto: 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=900&q=80',
  },
  {
    id: 'tx-2',
    invoiceNo: 'INV-240624-002',
    time: isoHoursAgo(2),
    txDate: today,
    plate: 'BH 4567 AC',
    merk: 'Honda Scoopy',
    cust: 'Nadia Kusuma',
    customerId: 'cust-2',
    washerId: 'emp-2',
    washer: 'Aldi',
    services: ['Standard Wash'],
    serviceIds: ['svc-2'],
    subtotal: 25000,
    total: 25000,
    komisi: 5000,
    pay: 'cash',
    status: 'Dicuci',
    disc: 0,
    pointsUsed: false,
    pointsEarned: 10,
    finishedAt: null,
    beforePhoto: 'https://images.unsplash.com/photo-1517524206127-48bbd363f3d7?auto=format&fit=crop&w=900&q=80',
    afterPhoto: null,
  },
  {
    id: 'tx-3',
    invoiceNo: 'INV-240624-003',
    time: isoHoursAgo(1),
    txDate: today,
    plate: 'BH 8881 QQ',
    merk: 'Yamaha Mio',
    cust: 'Walk In',
    customerId: 'walk-in',
    washerId: 'emp-1',
    washer: 'Rizky',
    services: ['Basic Wash'],
    serviceIds: ['svc-1'],
    subtotal: 18000,
    total: 18000,
    komisi: 3000,
    pay: 'transfer',
    status: 'Masuk',
    disc: 0,
    pointsUsed: false,
    pointsEarned: 0,
    finishedAt: null,
    beforePhoto: null,
    afterPhoto: null,
  },
];

export const demoQCRecords: QCRecord[] = [
  {
    id: 'qc-1',
    txId: 'tx-1',
    plate: 'BH 1009 JFR',
    merk: 'Honda Beat',
    washer: 'Rizky',
    washerId: 'emp-1',
    score: 90,
    time: isoHoursAgo(1),
    details: baseQC(90),
    afterPhoto: 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=900&q=80',
  },
];

export const demoPendingQC: PendingQC[] = [
  {
    id: 'pqc-1',
    txId: 'tx-1',
    plate: 'BH 1009 JFR',
    merk: 'Honda Beat',
    washer: 'Rizky',
    washerId: 'emp-1',
    time: isoHoursAgo(1),
    cust: 'Raka Pratama',
  },
];

export const demoInventory: InventoryItem[] = [
  { id: 'inv-1', name: 'Shampoo Snow', unit: 'botol', stock: 12, min: 4, costPrice: 42000, litersPerUnit: 1, motorsPerLiter: 10, autoDeduct: true },
  { id: 'inv-2', name: 'Degreaser', unit: 'botol', stock: 7, min: 3, costPrice: 50000, litersPerUnit: 1, motorsPerLiter: 8, autoDeduct: true },
  { id: 'inv-3', name: 'Wax Spray', unit: 'botol', stock: 6, min: 2, costPrice: 78000, litersPerUnit: 1, motorsPerLiter: 12, autoDeduct: true },
  { id: 'inv-4', name: 'Lap Microfiber', unit: 'pcs', stock: 22, min: 10, costPrice: 15000, litersPerUnit: 1, motorsPerLiter: 999, autoDeduct: false },
];

export const demoStockMoves: StockMove[] = [
  { id: 'sm-1', itemId: 'inv-1', type: 'out', qty: 1, note: 'Pemakaian operasional pagi', by: 'Dimas', time: isoHoursAgo(3), status: 'approved', verified: true },
  { id: 'sm-2', itemId: 'inv-3', type: 'in', qty: 4, note: 'Restok supplier', by: 'Dimas', time: isoHoursAgo(10), status: 'approved', verified: true },
  { id: 'sm-3', itemId: 'inv-2', type: 'out', qty: 1, note: 'Belum diverifikasi', by: 'Salsa', time: isoHoursAgo(1), status: 'pending', verified: false },
];

export const demoOpsCosts: OpsCost[] = [
  { id: 'cost-1', name: 'Konsumsi tim', amount: 65000, type: 'harian', date: today },
  { id: 'cost-2', name: 'Bensin operasional', amount: 50000, type: 'harian', date: today },
  { id: 'cost-3', name: 'Sewa lokasi', amount: 2500000, type: 'bulanan', date: today },
];

export const demoDailyChecks: DailyProductCheck[] = [
  { id: 'chk-1', label: 'Sabun utama', state: 'Siap' },
  { id: 'chk-2', label: 'Air dan sprayer', state: 'Siap' },
  { id: 'chk-3', label: 'Kompresor', state: 'Siap' },
  { id: 'chk-4', label: 'Vacuum', state: 'Siap' },
  { id: 'chk-5', label: 'Wax dan poles', state: 'Perlu Restok' },
  { id: 'chk-6', label: 'Lap microfiber', state: 'Siap' },
  { id: 'chk-7', label: 'Kebersihan area', state: 'Siap' },
];

export const defaultSettings: SettingsState = {
  businessName: 'GEN AUTO CARE',
  receiptFooter: 'Terima kasih telah mempercayakan motor Anda kepada GEN AUTO CARE.',
  pointRewardPerTx: 10,
  pointRedeemThreshold: 100,
  bankName: 'GEN AUTO CARE',
  bankNo: '1234567890',
  bankBank: 'BCA',
  qrImage: 'https://images.unsplash.com/photo-1556742031-c6961e8560b0?auto=format&fit=crop&w=800&q=80',
  services: demoServices,
};
