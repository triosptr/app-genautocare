import type { AppRole } from '@/types/app';

export interface NavItem {
  to: string;
  label: string;
  roles: AppRole[];
}

export const navItems: NavItem[] = [
  { to: '/', label: 'Dashboard', roles: ['kasir'] },
  { to: '/cashier', label: 'Transaksi', roles: ['kasir'] },
  { to: '/customers', label: 'Pelanggan', roles: ['kasir'] },
  { to: '/reports', label: 'Laporan Pendapatan', roles: ['kasir'] },
  { to: '/settings', label: 'Pengaturan', roles: ['kasir'] },
];

export function canAccess(role: AppRole | null, path: string) {
  if (!role) {
    return false;
  }

  const match = navItems.find((item) => item.to === path);
  if (!match) {
    return false;
  }

  return match.roles.includes(role);
}

export function getRoleLabel(role: AppRole | null) {
  return 'Kasir';
}
