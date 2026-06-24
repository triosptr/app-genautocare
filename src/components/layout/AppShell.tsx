import {
  Bell,
  Clock3,
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
      ? 'max-w-[430px] grid-cols-1 shadow-[0_0_0_12px_#111318] rounded-[40px] overflow-hidden my-4 mx-auto min-h-[852px]'
      : deviceMode === 'ipad'
        ? 'max-w-[1024px] lg:grid-cols-[220px_minmax(0,1fr)] shadow-[0_0_0_12px_#111318] rounded-[40px] overflow-hidden my-6 mx-auto min-h-[768px]'
        : 'w-full lg:grid-cols-[250px_minmax(0,1fr)]';
  const asideClass = deviceMode === 'mobile' ? 'p-4' : 'p-5';
  const navClass = deviceMode === 'mobile' ? 'grid grid-cols-2 gap-2' : 'space-y-2';
  const previewLabel = deviceMode === 'mobile' ? 'Mobile' : deviceMode === 'ipad' ? 'iPad' : 'Desktop';
  const nowLabel = new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' });

  return (
    <div className={cn("min-h-screen bg-[#eef0f5] text-slate-900 flex flex-col", deviceMode === 'desktop' ? 'p-0' : 'p-4 md:p-6 lg:p-8')}>
      <div className={cn('w-full grid bg-[#f7f8fb]', shellLayoutClass, deviceMode === 'desktop' && 'min-h-screen')}>
        <aside className={cn('bg-[#1535D4] text-white', asideClass, deviceMode !== 'mobile' && deviceMode !== 'desktop' && 'rounded-br-[24px] rounded-tr-[24px]')}>
          <div className="rounded-[18px] bg-[#1535D4] px-4 py-4">
            <BrandLogo compact variant="on-dark" />
          </div>

          <div className="mt-5 rounded-[18px] border border-white/10 bg-white/8 p-4">
            <p className="brand-eyebrow text-[#C8F400]">{mode === 'hybrid' ? 'Hybrid mode' : 'Demo kasir'}</p>
            <p className="mt-2 text-sm text-white/78">
              {mode === 'hybrid'
                ? 'Versi ringan untuk operasional kasir tetap aktif di project yang sama.'
                : 'Tampilan difokuskan untuk kasir dengan modul yang lebih ringkas.'}
            </p>
          </div>

          <div className="mt-5 rounded-[18px] border border-white/10 bg-white/8 p-3">
            <p className="px-2 text-[10px] font-semibold uppercase tracking-[0.18em] text-white/55">Mode tampilan</p>
            <div className="mt-3 grid grid-cols-3 gap-2">
              {deviceButtons.map((item) => {
                const Icon = item.icon;
                return (
                  <button
                    key={item.mode}
                    type="button"
                    onClick={() => onChangeDeviceMode(item.mode)}
                    className={cn(
                      'rounded-[12px] border px-3 py-3 text-[11px] font-semibold transition',
                      deviceMode === item.mode
                        ? 'border-[#C8F400] bg-[#C8F400] text-[#111318]'
                        : 'border-white/10 bg-white/6 text-white/72',
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

          <nav className={cn('mt-5', navClass)}>
            {links.map((link) => {
              const Icon = iconMap[link.to as keyof typeof iconMap] ?? LayoutGrid;
              return (
                <NavLink
                  key={link.to}
                  to={link.to}
                  className={({ isActive }) =>
                    cn(
                      'flex items-center gap-3 rounded-[14px] px-4 py-3 text-sm font-medium transition hover:bg-white/8',
                      isActive
                        ? 'bg-[#C8F400] text-[#111318]'
                        : 'border border-transparent text-white/86',
                    )
                  }
                >
                  <Icon className="h-4 w-4" />
                  <span>{link.label}</span>
                </NavLink>
              );
            })}
          </nav>

          <div className="mt-6 border-t border-white/12 pt-4">
            <div className="flex items-center gap-3 rounded-[16px] bg-white/8 p-3 text-sm text-white/82">
              <div className="h-10 w-10 rounded-[12px] bg-white/10" />
              <div>
                <p className="font-semibold text-white">{getRoleLabel(role)}</p>
                <p className="text-xs text-white/58">Modul kasir harian aktif</p>
              </div>
            </div>
          </div>

          {onSignOut && (
            <button
              type="button"
              onClick={onSignOut}
              className="mt-4 flex w-full items-center justify-center gap-2 rounded-[14px] border border-white/10 bg-white/8 px-4 py-3 text-sm font-medium text-white transition hover:bg-white/12"
            >
              <LogOut className="h-4 w-4" />
              Sign out
            </button>
          )}
        </aside>

        <div className={cn("space-y-6", deviceMode === 'desktop' ? 'p-8 max-w-7xl mx-auto w-full' : 'py-6 pr-6')}>
          <header className="brand-panel flex flex-col gap-4 rounded-[24px] p-4 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <div className="h-3 w-36 rounded-full bg-slate-200" />
              <div className="mt-2 h-2 w-24 rounded-full bg-slate-100" />
            </div>
            <div className="flex flex-wrap items-center gap-3">
              <div className="brand-primary-btn rounded-[12px] px-4 py-3 text-sm font-semibold text-[#111318]">{previewLabel}</div>
              <div className="brand-blue-btn rounded-[12px] px-4 py-3 text-sm font-semibold">Live</div>
            </div>
          </header>

          <div className="px-1 text-center text-[10px] uppercase tracking-[0.24em] text-white/24">
            Header · judul + jam + tombol aksi
          </div>

          <main className="brand-panel rounded-[24px] p-4 md:p-7">
            <div className="mb-5 flex flex-col gap-3 border-b border-slate-200 pb-4 lg:flex-row lg:items-end lg:justify-between">
              <div>
                <p className="brand-eyebrow text-slate-500">GEN Auto Care</p>
                <h1 className="mt-2 brand-title text-[26px] text-slate-900">{pageName}</h1>
              </div>
              <div className="flex flex-wrap items-center gap-3 text-sm text-slate-600">
                <div className="inline-flex items-center gap-2 rounded-[12px] border border-slate-200 bg-white px-4 py-2">
                  <Clock3 className="h-4 w-4 text-[#1535D4]" />
                  <span>{nowLabel}</span>
                </div>
                <div className="inline-flex items-center gap-2 rounded-[12px] border border-slate-200 bg-white px-4 py-2">
                  <Bell className="h-4 w-4 text-[#1535D4]" />
                  <span>{previewLabel}</span>
                </div>
              </div>
            </div>
            {children}
          </main>
        </div>
      </div>
    </div>
  );
}
