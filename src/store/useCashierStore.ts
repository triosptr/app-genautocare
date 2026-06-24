import { create } from 'zustand';
import {
  defaultSettings,
  demoCustomers,
  demoDailyChecks,
  demoEmployees,
  demoInventory,
  demoOpsCosts,
  demoPendingQC,
  demoQCRecords,
  demoServices,
  demoStockMoves,
  demoTransactions,
} from '@/lib/mock-data';
import type {
  AppMode,
  AppRole,
  Customer,
  DailyProductCheck,
  DeviceMode,
  Employee,
  InventoryItem,
  OpsCost,
  PaymentMethod,
  PendingQC,
  QCDetail,
  QCDetailDraft,
  QCRecord,
  QueueStatus,
  Service,
  SettingsState,
  StockMove,
  StockMoveType,
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
  usePoints: boolean;
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
  deviceMode: DeviceMode;
  services: Service[];
  employees: Employee[];
  customers: Customer[];
  transactions: Transaction[];
  qcRecords: QCRecord[];
  pendingQC: PendingQC[];
  inventory: InventoryItem[];
  stockMoves: StockMove[];
  opsCosts: OpsCost[];
  dailyChecks: DailyProductCheck[];
  settings: SettingsState;
  initialize: () => void;
  setRole: (role: AppRole) => void;
  setDeviceMode: (mode: DeviceMode) => void;
  clearRole: () => void;
  saveCustomer: (input: SaveCustomerInput) => string;
  createTransaction: (input: CreateTransactionInput) => string;
  updateQueueStatus: (txId: string, status: QueueStatus) => void;
  markBeforePhoto: (txId: string) => void;
  runQuickQC: (txId: string) => void;
  saveQC: (txId: string, details: QCDetail | QCDetailDraft, afterPhoto?: string | null) => void;
  clockToggle: (employeeId: string) => void;
  saveService: (service: Service) => void;
  updateSettings: (input: SettingsState) => void;
  recordStockMove: (itemId: string, type: StockMoveType, qty: number, note: string, by: string) => void;
}

const roleKey = 'gen-autocare-role';
const settingsKey = 'gen-autocare-settings-v2';
const deviceModeKey = 'gen-autocare-device-mode';

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
    return JSON.parse(raw) as SettingsState;
  } catch {
    return defaultSettings;
  }
}

function readDeviceMode() {
  const raw = localStorage.getItem(deviceModeKey);
  if (raw === 'ipad' || raw === 'mobile' || raw === 'desktop') {
    return raw;
  }
  return 'desktop' as DeviceMode;
}

function buildInvoiceNumber() {
  return `INV-${new Date().toISOString().slice(2, 10).replace(/-/g, '')}-${Date.now().toString().slice(-3)}`;
}

function calculateCommission(service: Service) {
  return service.kType === 'flat' ? service.kVal : Math.round((service.price * service.kVal) / 100);
}

function scoreFromDetails(details: QCDetail) {
  const values = Object.values(details);
  return Math.round(values.reduce((sum, value) => sum + value, 0) / values.length);
}

function normalizeQCDetails(details: QCDetail | QCDetailDraft) {
  return {
    body: details.body ?? 100,
    velg: details.velg ?? 100,
    spakbor: details.spakbor ?? 100,
    jok: details.jok ?? 100,
    spionLampu: details.spionLampu ?? 100,
    areaMesin: details.areaMesin ?? 100,
    kekeringan: details.kekeringan ?? 100,
  } satisfies QCDetail;
}

export const useCashierStore = create<CashierStore>((set, get) => ({
  mode: 'demo',
  ready: false,
  currentRole: null,
  deviceMode: 'desktop',
  services: [],
  employees: [],
  customers: [],
  transactions: [],
  qcRecords: [],
  pendingQC: [],
  inventory: [],
  stockMoves: [],
  opsCosts: [],
  dailyChecks: [],
  settings: defaultSettings,
  initialize: () => {
    set({
      ready: true,
      currentRole: readRole(),
      deviceMode: readDeviceMode(),
      services: demoServices,
      employees: demoEmployees,
      customers: demoCustomers,
      transactions: demoTransactions,
      qcRecords: demoQCRecords,
      pendingQC: demoPendingQC,
      inventory: demoInventory,
      stockMoves: demoStockMoves,
      opsCosts: demoOpsCosts,
      dailyChecks: demoDailyChecks,
      settings: readSettings(),
    });
  },
  setRole: (role) => {
    localStorage.setItem(roleKey, role);
    set({ currentRole: role });
  },
  setDeviceMode: (mode) => {
    localStorage.setItem(deviceModeKey, mode);
    set({ deviceMode: mode });
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
        points: existing?.points ?? 0,
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
    const settings = get().settings;
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
    const customer = get().customers.find((entry) => entry.id === customerId);
    const subtotal = services.reduce((sum, service) => sum + service.price, 0);
    const commission = services.reduce((sum, service) => sum + calculateCommission(service), 0);
    const canUsePoints = input.usePoints && (customer?.points ?? 0) >= settings.pointRedeemThreshold;
    const redeemedValue = canUsePoints ? Math.min(subtotal - input.discount, services[0]?.price ?? 0) : 0;
    const total = Math.max(0, subtotal - input.discount - redeemedValue);
    const pointsEarned = canUsePoints ? 0 : settings.pointRewardPerTx;

    const transaction: Transaction = {
      id: transactionId,
      invoiceNo: buildInvoiceNumber(),
      time: now,
      txDate: now,
      plate: input.plate,
      merk: input.merk,
      cust: customerName,
      customerId,
      washerId: input.washerId,
      washer: washer?.name ?? 'Belum dipilih',
      services: services.map((service) => service.name),
      serviceIds: services.map((service) => service.id),
      subtotal,
      total,
      komisi: commission,
      pay: input.paymentMethod,
      status: 'Masuk',
      disc: input.discount + redeemedValue,
      pointsUsed: canUsePoints,
      pointsEarned,
      finishedAt: null,
      beforePhoto: null,
      afterPhoto: null,
    };

    set((state) => ({
      transactions: [transaction, ...state.transactions],
      customers: state.customers.map((entry) => {
        if (entry.id !== customerId) {
          return entry;
        }

        const nextPoints = canUsePoints ? 0 : entry.points + settings.pointRewardPerTx;
        const vehicles = entry.vehicles.some((vehicle) => vehicle.plate === input.plate)
          ? entry.vehicles
          : [{ plate: input.plate, merk: input.merk }, ...entry.vehicles];

        return {
          ...entry,
          plate: input.plate,
          visits: entry.visits + 1,
          spend: entry.spend + total,
          points: nextPoints,
          vehicles,
        };
      }),
      employees: state.employees.map((entry) =>
        entry.id === input.washerId ? { ...entry, activeMotorCount: entry.activeMotorCount + 1 } : entry,
      ),
    }));

    return transactionId;
  },
  updateQueueStatus: (txId, status) => {
    set((state) => {
      const target = state.transactions.find((entry) => entry.id === txId);
      if (!target) {
        return state;
      }

      const nextPending =
        status === 'Selesai' && !state.pendingQC.some((entry) => entry.txId === txId)
          ? [
              {
                id: crypto.randomUUID(),
                txId,
                plate: target.plate,
                merk: target.merk,
                washer: target.washer,
                washerId: target.washerId,
                time: new Date().toISOString(),
                cust: target.cust,
              },
              ...state.pendingQC,
            ]
          : state.pendingQC;

      return {
        transactions: state.transactions.map((entry) =>
          entry.id === txId
            ? {
                ...entry,
                status,
                beforePhoto: status !== 'Masuk' ? entry.beforePhoto ?? 'before-photo-ready' : entry.beforePhoto,
                finishedAt: status === 'Selesai' ? new Date().toISOString() : entry.finishedAt,
              }
            : entry,
        ),
        pendingQC: nextPending,
      };
    });
  },
  markBeforePhoto: (txId) => {
    set((state) => ({
      transactions: state.transactions.map((entry) =>
        entry.id === txId ? { ...entry, beforePhoto: entry.beforePhoto ?? 'before-photo-ready' } : entry,
      ),
    }));
  },
  runQuickQC: (txId) => {
    get().saveQC(txId, {
      body: 100,
      velg: 100,
      spakbor: 100,
      jok: 70,
      spionLampu: 100,
      areaMesin: 70,
      kekeringan: 100,
    });
  },
  saveQC: (txId, details, afterPhoto) => {
    set((state) => {
      const target = state.transactions.find((entry) => entry.id === txId);
      if (!target) {
        return state;
      }

      const normalizedDetails = normalizeQCDetails(details);

      const qcRecord: QCRecord = {
        id: crypto.randomUUID(),
        txId,
        plate: target.plate,
        merk: target.merk,
        washer: target.washer,
        washerId: target.washerId,
        score: scoreFromDetails(normalizedDetails),
        time: new Date().toISOString(),
        details: normalizedDetails,
        afterPhoto: afterPhoto ?? target.afterPhoto ?? 'after-photo-ready',
      };

      return {
        qcRecords: [qcRecord, ...state.qcRecords],
        pendingQC: state.pendingQC.filter((entry) => entry.txId !== txId),
        transactions: state.transactions.map((entry) =>
          entry.id === txId
            ? { ...entry, afterPhoto: afterPhoto ?? entry.afterPhoto ?? 'after-photo-ready' }
            : entry,
        ),
        employees: state.employees.map((entry) =>
          entry.id === target.washerId ? { ...entry, activeMotorCount: Math.max(0, entry.activeMotorCount - 1) } : entry,
        ),
      };
    });
  },
  clockToggle: (employeeId) => {
    set((state) => ({
      employees: state.employees.map((entry) =>
        entry.id === employeeId
          ? {
              ...entry,
              present: !entry.present,
              in: !entry.present ? new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }) : entry.in,
              out: entry.present ? new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }) : null,
            }
          : entry,
      ),
    }));
  },
  saveService: (service) => {
    set((state) => {
      const services = [service, ...state.services.filter((entry) => entry.id !== service.id)];
      const nextSettings = { ...state.settings, services };
      localStorage.setItem(settingsKey, JSON.stringify(nextSettings));
      return { services, settings: nextSettings };
    });
  },
  updateSettings: (input) => {
    localStorage.setItem(settingsKey, JSON.stringify(input));
    set({ settings: input, services: input.services });
  },
  recordStockMove: (itemId, type, qty, note, by) => {
    set((state) => ({
      stockMoves: [
        {
          id: crypto.randomUUID(),
          itemId,
          type,
          qty,
          note,
          by,
          time: new Date().toISOString(),
          status: by === 'Owner' || by === 'Manager Ops' ? 'approved' : 'pending',
          verified: by === 'Owner' || by === 'Manager Ops',
        },
        ...state.stockMoves,
      ],
      inventory: state.inventory.map((entry) =>
        entry.id === itemId
          ? { ...entry, stock: type === 'in' ? entry.stock + qty : Math.max(0, entry.stock - qty) }
          : entry,
      ),
    }));
  },
}));
