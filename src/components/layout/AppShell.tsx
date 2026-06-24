import {
  Bell,
  CalendarCheck,
  ChartNoAxesCombined,
  ClipboardCheck,
  Coins,
  LayoutGrid,
  LogOut,
  Package,
  ReceiptText,
  Settings,
  ShoppingCart,
  Users,
  Warehouse,
} from 'lucide-react';
import type { ReactNode } from 'react';
import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import { BrandLogo } from '@/components/branding/BrandLogo';
import { getRoleLabel, navItems } from '@/lib/access';
import { cn } from '@/lib/utils';
import type { AppMode, AppRole } from '@/types/app';

const iconMap = {
  '/': LayoutGrid,
  '/cashier': ReceiptText,
  '/pos': ShoppingCart,
  '/queue': ChartNoAxesCombined,
  '/inventory': Warehouse,
  '/quality': ClipboardCheck,
  '/attendance': CalendarCheck,
  '/customers': Users,
  '/reports/daily': ReceiptText,
  '/costs': Coins,
  '/recap': ChartNoAxesCombined,
  '/settings': Settings,
  '/catalog': Package,
};

interface AppShellProps {
  mode: AppMode;
  role: AppRole;
  onSignOut?: () => void;
  children: ReactNode;
}

export function AppShell({ mode, role, onSignOut, children }: AppShellProps) {
  const navigate = useNavigate();
  const location = useLocation();
  const links = navItems.filter((item) => item.roles.includes(role));
  const pageName = links.find((link) => link.to === location.pathname)?.label ?? 'Dashboard';
  const canOpenPosFromHeader = role === 'owner' || role === 'manager_ops';

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top_left,_rgba(200,244,0,0.14),_transparent_22%),linear-gradient(180deg,_#1535D4_0%,_#2035A6_42%,_#373A4A_100%)] text-slate-100">
      <div className="mx-auto grid min-h-screen max-w-[1600px] gap-6 px-4 py-4 lg:grid-cols-[280px_minmax(0,1fr)] lg:px-6">
        <aside className="rounded-[32px] border border-white/15 bg-[linear-gradient(180deg,rgba(21,53,212,0.92)_0%,rgba(55,58,74,0.96)_100%)] p-5 shadow-[0_28px_80px_-36px_rgba(21,53,212,0.72)] backdrop-blur-xl">
          <div className="flex items-center gap-3 rounded-3xl border border-white/10 bg-white/5 px-4 py-4">
            <BrandLogo compact variant="on-dark" />
          </div>

          <div className="mt-6 rounded-3xl border border-[#C8F400]/20 bg-[#C8F400]/10 p-4">
            <p className="text-xs uppercase tracking-[0.25em] text-[#C8F400]">{mode === 'hybrid' ? 'Hybrid mode' : 'Demo mode'}</p>
            <p className="mt-2 text-sm text-slate-200">
              {mode === 'hybrid'
                ? 'Fondasi React dan deploy tetap aktif sambil mengikuti spesifikasi operasional baru.'
                : 'Login role demo aktif sesuai kebutuhan aplikasi operasional.'}
            </p>
          </div>

          <nav className="mt-6 space-y-2">
            {links.map((link) => {
              const Icon = iconMap[link.to as keyof typeof iconMap] ?? LayoutGrid;
              return (
                <NavLink
                  key={link.to}
                  to={link.to}
                  className={({ isActive }) =>
                    cn(
                      'flex items-center gap-3 rounded-2xl px-4 py-3 text-sm transition hover:bg-white/5',
                      isActive
                        ? 'border border-[#C8F400]/30 bg-[#C8F400] text-[#1535D4]'
                        : 'border border-transparent text-slate-300',
                    )
                  }
                >
                  <Icon className="h-4 w-4" />
                  <span>{link.label}</span>
                </NavLink>
              );
            })}
          </nav>

          <div className="mt-6 rounded-3xl border border-white/10 bg-white/5 p-4 text-sm text-slate-300">
            <p className="font-medium text-white">{getRoleLabel(role)}</p>
            <p className="mt-1 text-slate-400">Navigasi otomatis menyesuaikan hak akses role aktif.</p>
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
          <header className="brand-panel rounded-[32px] p-5">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
              <div>
                <p className="text-xs uppercase tracking-[0.3em] text-slate-500">Operational view</p>
                <h1 className="mt-2 font-display text-4xl uppercase tracking-[0.16em] text-white">{pageName}</h1>
              </div>
              <div className="flex flex-wrap items-center gap-3">
                {canOpenPosFromHeader && (
                  <button
                    type="button"
                    onClick={() => navigate('/pos')}
                    className="brand-primary-btn rounded-2xl px-4 py-3 text-sm font-semibold"
                  >
                    Buka Mode POS
                  </button>
                )}
                <div className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-slate-300">
                  <Bell className="h-4 w-4 text-[#C8F400]" />
                  <span>Counter-ready interface for fast service turnover.</span>
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
