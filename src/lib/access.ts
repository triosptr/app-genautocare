import type { AppRole } from '@/types/app';

export interface NavItem {
  to: string;
  label: string;
  roles: AppRole[];
}

export const navItems: NavItem[] = [
  { to: '/', label: 'Ringkasan', roles: ['kasir'] },
  { to: '/cashier', label: 'Transaksi', roles: ['kasir'] },
  { to: '/pos', label: 'Mode POS', roles: ['kasir'] },
  { to: '/queue', label: 'Antrian', roles: ['kasir'] },
  { to: '/customers', label: 'Pelanggan', roles: ['kasir'] },
  { to: '/reports/daily', label: 'Laporan', roles: ['kasir'] },
];

export function canAccess(role: AppRole | null, path: string) {
  if (!role) {
    return false;
  }

  const match = navItems.find((item) => item.to === path);
  if (!match) {
    return path === '/pos' ? role === 'kasir' : false;
  }

  return match.roles.includes(role);
}

export function getRoleLabel(role: AppRole | null) {
  switch (role) {
    case 'kasir':
      return 'Kasir';
    default:
      return 'Kasir';
  }
}
