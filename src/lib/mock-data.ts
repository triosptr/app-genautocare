import type {
  Customer,
  Employee,
  Service,
  SettingsState,
  Transaction,
} from '@/types/app';

const now = new Date();
const today = now.toISOString();

function isoHoursAgo(hours: number) {
  return new Date(now.getTime() - hours * 60 * 60 * 1000).toISOString();
}

export const demoServices: Service[] = [
  { id: 'svc-1', name: 'Basic Wash', price: 18000, tier: 'BASIC' },
  { id: 'svc-2', name: 'Standard Wash', price: 25000, tier: 'STANDARD' },
  { id: 'svc-3', name: 'Premium Wash', price: 35000, tier: 'PREMIUM' },
  { id: 'svc-4', name: 'Elite Detailing', price: 50000, tier: 'ELITE' },
];

export const demoEmployees: Employee[] = [
  { id: 'emp-1', name: 'Rizky', present: true },
  { id: 'emp-2', name: 'Aldi', present: true },
  { id: 'emp-3', name: 'Salsa', present: true },
  { id: 'emp-4', name: 'Dimas', present: true },
];

export const demoCustomers: Customer[] = [
  {
    id: 'cust-1',
    name: 'Raka Pratama',
    phone: '081234567890',
    plate: 'BH 1009 JFR',
    visits: 12,
    spend: 410000,
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
    vehicles: [{ plate: 'BH 4567 AC', merk: 'Honda Scoopy' }],
  },
];

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
    pay: 'qris',
    disc: 0,
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
    pay: 'cash',
    disc: 0,
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
    pay: 'transfer',
    disc: 0,
  },
];

export const defaultSettings: SettingsState = {
  businessName: 'GEN AUTO CARE',
  receiptFooter: 'Terima kasih telah mempercayakan motor Anda kepada GEN AUTO CARE.',
  bankName: 'GEN AUTO CARE',
  bankNo: '1234567890',
  bankBank: 'BCA',
  services: demoServices,
};
