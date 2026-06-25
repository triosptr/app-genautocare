import { create } from 'zustand';
import {
  defaultSettings,
  demoCustomers,
  demoEmployees,
  demoServices,
  demoTransactions,
} from '@/lib/mock-data';
import type {
  AppMode,
  AppRole,
  Customer,
  Employee,
  PaymentMethod,
  Service,
  SettingsState,
  Transaction,
  Vehicle,
} from '@/types/app';

interface CreateTransactionInput {
  customerId: string | null;
  customerName: string;
  phone: string;
  plate: string;
  merk: string;
  serviceIds: string[];
  washerId: string;
  paymentMethod: PaymentMethod;
  discount: number;
}

interface SaveCustomerInput {
  id?: string;
  name: string;
  phone: string;
  plate: string;
  merk: string;
}

interface CashierStore {
  mode: AppMode;
  ready: boolean;
  currentRole: AppRole | null;
  services: Service[];
  employees: Employee[];
  customers: Customer[];
  transactions: Transaction[];
  settings: SettingsState;
  initialize: () => void;
  setRole: (role: AppRole) => void;
  clearRole: () => void;
  saveCustomer: (input: SaveCustomerInput) => string;
  createTransaction: (input: CreateTransactionInput) => string;
}

const roleKey = 'gen-autocare-role';
const settingsKey = 'gen-autocare-settings-v2';

function readRole() {
  const raw = localStorage.getItem(roleKey);
  return raw ? ('kasir' as AppRole) : null;
}

function readSettings() {
  const raw = localStorage.getItem(settingsKey);
  if (!raw) {
    return defaultSettings;
  }

  try {
    const parsed = JSON.parse(raw) as SettingsState;
    const fallbackById = Object.fromEntries(demoServices.map((service) => [service.id, service]));
    const services = (parsed.services ?? demoServices).map((service) => ({
      ...service,
      commissionPct:
        typeof (service as Service).commissionPct === 'number'
          ? (service as Service).commissionPct
          : (fallbackById[service.id]?.commissionPct ?? 0),
    }));

    return {
      ...defaultSettings,
      ...parsed,
      services,
    };
  } catch {
    return defaultSettings;
  }
}

function buildInvoiceNumber() {
  return `INV-${new Date().toISOString().slice(2, 10).replace(/-/g, '')}-${Date.now().toString().slice(-3)}`;
}

export const useCashierStore = create<CashierStore>((set, get) => ({
  mode: 'demo',
  ready: false,
  currentRole: null,
  services: [],
  employees: [],
  customers: [],
  transactions: [],
  settings: defaultSettings,
  initialize: () => {
    set({
      ready: true,
      currentRole: readRole(),
      services: demoServices,
      employees: demoEmployees,
      customers: demoCustomers,
      transactions: demoTransactions,
      settings: readSettings(),
    });
  },
  setRole: (role) => {
    localStorage.setItem(roleKey, role);
    set({ currentRole: role });
  },
  clearRole: () => {
    localStorage.removeItem(roleKey);
    set({ currentRole: null });
  },
  saveCustomer: (input) => {
    const customerId = input.id ?? crypto.randomUUID();
    const nextVehicle: Vehicle = { plate: input.plate, merk: input.merk };

    set((state) => {
      const existing = state.customers.find((entry) => entry.id === customerId);
      const vehicles = existing?.vehicles ?? [];
      const mergedVehicles = vehicles.some((vehicle) => vehicle.plate === input.plate)
        ? vehicles.map((vehicle) => (vehicle.plate === input.plate ? nextVehicle : vehicle))
        : [nextVehicle, ...vehicles];

      const customer: Customer = {
        id: customerId,
        name: input.name,
        phone: input.phone,
        plate: input.plate,
        visits: existing?.visits ?? 0,
        spend: existing?.spend ?? 0,
        vehicles: mergedVehicles,
      };

      return {
        customers: [customer, ...state.customers.filter((entry) => entry.id !== customerId)],
      };
    });

    return customerId;
  },
  createTransaction: (input) => {
    const transactionId = crypto.randomUUID();
    const now = new Date().toISOString();
    const services = get().services.filter((service) => input.serviceIds.includes(service.id));
    const washer = get().employees.find((employee) => employee.id === input.washerId);
    const customerName = input.customerName.trim() || 'Walk In';
    const customerId =
      input.customerId ??
      get().saveCustomer({
        name: customerName,
        phone: input.phone,
        plate: input.plate,
        merk: input.merk,
      });
    const subtotal = services.reduce((sum, service) => sum + service.price, 0);
    const commissionTotal = services.reduce((sum, service) => sum + Math.round((service.price * service.commissionPct) / 100), 0);
    const total = Math.max(0, subtotal - input.discount);

    const transaction: Transaction = {
      id: transactionId,
      invoiceNo: buildInvoiceNumber(),
      time: now,
      txDate: now,
      plate: input.plate,
      merk: input.merk,
      cust: customerName,
      customerPhone: input.phone,
      customerId,
      washerId: input.washerId,
      washer: washer?.name ?? 'Belum dipilih',
      services: services.map((service) => service.name),
      serviceIds: services.map((service) => service.id),
      subtotal,
      total,
      commissionTotal,
      pay: input.paymentMethod,
      disc: input.discount,
    };

    set((state) => ({
      transactions: [transaction, ...state.transactions],
      customers: state.customers.map((entry) => {
        if (entry.id !== customerId) {
          return entry;
        }

        const vehicles = entry.vehicles.some((vehicle) => vehicle.plate === input.plate)
          ? entry.vehicles
          : [{ plate: input.plate, merk: input.merk }, ...entry.vehicles];

        return {
          ...entry,
          plate: input.plate,
          visits: entry.visits + 1,
          spend: entry.spend + total,
          vehicles,
        };
      }),
    }));

    return transactionId;
  },
}));
