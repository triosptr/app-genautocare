import type { AppRole } from '@/types/app';

export interface NavItem {
  to: string;
  label: string;
  roles: AppRole[];
}

export const navItems: NavItem[] = [
  { to: '/', label: 'Dashboard', roles: ['owner', 'manager_ops', 'kasir'] },
  { to: '/cashier', label: 'Kasir Detail', roles: ['owner', 'manager_ops', 'kasir'] },
  { to: '/pos', label: 'Mode POS', roles: ['kasir'] },
  { to: '/queue', label: 'Antrian', roles: ['owner', 'manager_ops', 'kasir'] },
  { to: '/inventory', label: 'Gudang', roles: ['owner', 'manager_ops', 'kasir'] },
  { to: '/quality', label: 'Quality Check', roles: ['owner', 'manager_ops'] },
  { to: '/attendance', label: 'Absensi', roles: ['owner', 'manager_ops', 'kasir'] },
  { to: '/customers', label: 'Pelanggan', roles: ['owner', 'manager_ops', 'kasir'] },
  { to: '/reports/daily', label: 'Laporan Harian', roles: ['owner', 'manager_ops', 'kasir'] },
  { to: '/costs', label: 'Biaya Operasional', roles: ['owner', 'manager_ops'] },
  { to: '/recap', label: 'Rekap & Bagi Hasil', roles: ['owner', 'manager_ops'] },
  { to: '/settings', label: 'Pengaturan', roles: ['owner'] },
];

export function canAccess(role: AppRole | null, path: string) {
  if (!role) {
    return false;
  }

  const match = navItems.find((item) => item.to === path);
  if (!match) {
    return path === '/pos' ? role === 'kasir' || role === 'owner' || role === 'manager_ops' : false;
  }

  return match.roles.includes(role);
}

export function getRoleLabel(role: AppRole | null) {
  switch (role) {
    case 'owner':
      return 'Owner';
    case 'manager_ops':
      return 'Manager Ops';
    case 'kasir':
      return 'Kasir';
    default:
      return 'Belum dipilih';
  }
}
