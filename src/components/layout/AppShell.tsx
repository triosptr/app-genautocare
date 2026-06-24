import {
  Bell,
  MonitorSmartphone,
  TabletSmartphone,
  LayoutGrid,
  LogOut,
  ReceiptText,
  ShoppingCart,
  Users,
} from 'lucide-react';
import type { ReactNode } from 'react';
import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import { BrandLogo } from '@/components/branding/BrandLogo';
import { getRoleLabel, navItems } from '@/lib/access';
import { cn } from '@/lib/utils';
import type { AppMode, AppRole, DeviceMode } from '@/types/app';

const iconMap = {
  '/': LayoutGrid,
  '/cashier': ReceiptText,
  '/pos': ShoppingCart,
  '/queue': LayoutGrid,
  '/customers': Users,
  '/reports/daily': ReceiptText,
};

interface AppShellProps {
  mode: AppMode;
  role: AppRole;
  deviceMode: DeviceMode;
  onChangeDeviceMode: (mode: DeviceMode) => void;
  onSignOut?: () => void;
  children: ReactNode;
}

const deviceButtons: Array<{ mode: DeviceMode; label: string; icon: typeof TabletSmartphone }> = [
  { mode: 'desktop', label: 'Default', icon: LayoutGrid },
  { mode: 'ipad', label: 'iPad', icon: TabletSmartphone },
  { mode: 'mobile', label: 'Mobile', icon: MonitorSmartphone },
];

export function AppShell({ mode, role, deviceMode, onChangeDeviceMode, onSignOut, children }: AppShellProps) {
  const navigate = useNavigate();
  const location = useLocation();
  const links = navItems.filter((item) => item.roles.includes(role));
  const pageName = links.find((link) => link.to === location.pathname)?.label ?? 'Dashboard';
  const shellLayoutClass =
    deviceMode === 'mobile'
      ? 'max-w-[430px] grid-cols-1'
      : deviceMode === 'ipad'
        ? 'max-w-[1024px] lg:grid-cols-[220px_minmax(0,1fr)]'
        : 'max-w-[1480px] lg:grid-cols-[250px_minmax(0,1fr)]';
  const asideClass = deviceMode === 'mobile' ? 'p-4' : 'p-5';
  const navClass = deviceMode === 'mobile' ? 'grid grid-cols-2 gap-2' : 'space-y-2';

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top_left,_rgba(21,53,212,0.08),_transparent_20%),radial-gradient(circle_at_bottom_right,_rgba(200,244,0,0.18),_transparent_24%),linear-gradient(180deg,_#eff5ff_0%,_#f7ffdd_100%)] text-slate-900">
      <div className={cn('mx-auto grid min-h-screen gap-5 px-4 py-4 lg:px-6', shellLayoutClass)}>
        <aside className={cn('rounded-[28px] border border-[#1535D4]/10 bg-white shadow-[0_18px_42px_-30px_rgba(21,53,212,0.2)]', asideClass)}>
          <div className="rounded-3xl border border-[#1535D4]/10 bg-[linear-gradient(135deg,_#1535D4_0%,_#2448ef_100%)] px-4 py-4">
            <BrandLogo compact variant="on-dark" />
          </div>

          <div className="mt-6 rounded-3xl border border-[#C8F400]/22 bg-[#f5ffcf] p-4">
            <p className="text-[11px] uppercase tracking-[0.2em] text-[#1535D4]">{mode === 'hybrid' ? 'Hybrid mode' : 'Demo kasir'}</p>
            <p className="mt-2 text-sm text-slate-600">
              {mode === 'hybrid'
                ? 'Versi ringan untuk operasional kasir tetap aktif di project yang sama.'
                : 'Tampilan difokuskan untuk kasir dengan modul yang lebih ringkas.'}
            </p>
          </div>

          <div className="mt-6 rounded-3xl border border-[#1535D4]/10 bg-[#eef4ff] p-3">
            <p className="px-2 text-[11px] uppercase tracking-[0.16em] text-slate-500">Mode tampilan</p>
            <div className="mt-3 grid grid-cols-3 gap-2">
              {deviceButtons.map((item) => {
                const Icon = item.icon;
                return (
                  <button
                    key={item.mode}
                    type="button"
                    onClick={() => onChangeDeviceMode(item.mode)}
                    className={cn(
                      'rounded-2xl border px-3 py-3 text-xs font-medium transition',
                      deviceMode === item.mode
                        ? 'border-[#1535D4] bg-[#1535D4] text-white'
                        : 'border-[#1535D4]/10 bg-white text-slate-600',
                    )}
                  >
                    <span className="flex items-center justify-center gap-1.5">
                      <Icon className="h-3.5 w-3.5" />
                      {item.label}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          <nav className={cn('mt-6', navClass)}>
            {links.map((link) => {
              const Icon = iconMap[link.to as keyof typeof iconMap] ?? LayoutGrid;
              return (
                <NavLink
                  key={link.to}
                  to={link.to}
                  className={({ isActive }) =>
                    cn(
                      'flex items-center gap-3 rounded-2xl px-4 py-3 text-sm transition hover:bg-[#f5f8ff]',
                      isActive
                        ? 'border border-[#1535D4]/12 bg-[#1535D4] text-white shadow-[0_14px_30px_-22px_rgba(21,53,212,0.55)]'
                        : 'border border-transparent text-slate-600',
                    )
                  }
                >
                  <Icon className="h-4 w-4" />
                  <span>{link.label}</span>
                </NavLink>
              );
            })}
          </nav>

          <div className="mt-6 rounded-3xl border border-slate-200 bg-[#f8fafc] p-4 text-sm text-slate-600">
            <p className="font-medium text-slate-900">{getRoleLabel(role)}</p>
            <p className="mt-1 text-slate-500">Modul difokuskan untuk transaksi kasir harian.</p>
          </div>

          {onSignOut && (
            <button
              type="button"
              onClick={onSignOut}
              className="brand-secondary-btn mt-4 flex w-full items-center justify-center gap-2 rounded-2xl px-4 py-3 text-sm"
            >
              <LogOut className="h-4 w-4" />
              Sign out
            </button>
          )}
        </aside>

        <div className="space-y-6">
          <header className="brand-panel rounded-[28px] p-5">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
              <div>
                <p className="text-[11px] uppercase tracking-[0.2em] text-slate-500">Kasir App</p>
                <h1 className="mt-2 font-display text-[30px] uppercase tracking-[0.1em] text-slate-900">{pageName}</h1>
              </div>
              <div className="flex flex-wrap items-center gap-3">
                <button
                  type="button"
                  onClick={() => navigate('/pos')}
                  className="brand-primary-btn rounded-2xl px-4 py-3 text-sm font-semibold"
                >
                  Buka POS
                </button>
                <div className="flex items-center gap-3 rounded-2xl border border-[#C8F400]/22 bg-[#f5ffcf] px-4 py-3 text-sm text-slate-700">
                  <Bell className="h-4 w-4 text-[#1535D4]" />
                  <span>{deviceMode === 'mobile' ? 'Preview mobile aktif.' : deviceMode === 'ipad' ? 'Preview iPad aktif.' : 'Gunakan kombinasi biru dan lime brand.'}</span>
                </div>
              </div>
            </div>
          </header>

          <main>{children}</main>
        </div>
      </div>
    </div>
  );
}
