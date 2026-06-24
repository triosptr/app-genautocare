import { Bell, ChartNoAxesCombined, LayoutGrid, LogOut, Package, ReceiptText, Settings, ShoppingCart, Users } from 'lucide-react';
import type { ReactNode } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';
import type { AppMode } from '@/types/app';

const links = [
  { to: '/', label: 'Dashboard', icon: LayoutGrid },
  { to: '/pos', label: 'POS', icon: ShoppingCart },
  { to: '/catalog', label: 'Catalog', icon: Package },
  { to: '/customers', label: 'Customers', icon: Users },
  { to: '/transactions', label: 'Transactions', icon: ReceiptText },
  { to: '/reports', label: 'Reports', icon: ChartNoAxesCombined },
  { to: '/settings', label: 'Settings', icon: Settings },
];

interface AppShellProps {
  mode: AppMode;
  userEmail?: string;
  onSignOut?: () => void;
  children: ReactNode;
}

export function AppShell({ mode, userEmail, onSignOut, children }: AppShellProps) {
  const location = useLocation();
  const pageName = links.find((link) => link.to === location.pathname)?.label ?? 'Dashboard';

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top,_rgba(45,226,230,0.15),_transparent_32%),linear-gradient(180deg,_#080b11_0%,_#04060a_100%)] text-slate-100">
      <div className="mx-auto grid min-h-screen max-w-[1600px] gap-6 px-4 py-4 lg:grid-cols-[280px_minmax(0,1fr)] lg:px-6">
        <aside className="rounded-[32px] border border-white/10 bg-slate-950/85 p-5 backdrop-blur-xl">
          <div className="flex items-center gap-3">
            <div className="grid h-12 w-12 place-items-center rounded-2xl border border-cyan-400/30 bg-cyan-400/10 font-display text-xl text-cyan-300">
              GA
            </div>
            <div>
              <p className="font-display text-lg uppercase tracking-[0.24em] text-white">GEN AUTOCARE</p>
              <p className="text-sm text-slate-400">Cashier control room</p>
            </div>
          </div>

          <div className="mt-6 rounded-3xl border border-lime-300/20 bg-lime-300/10 p-4">
            <p className="text-xs uppercase tracking-[0.25em] text-lime-200">{mode === 'live' ? 'Supabase live' : 'Demo mode'}</p>
            <p className="mt-2 text-sm text-slate-200">
              {mode === 'live'
                ? 'Authenticated users operate on real Supabase data.'
                : 'Local demo data is active until Supabase env values are added.'}
            </p>
          </div>

          <nav className="mt-6 space-y-2">
            {links.map((link) => {
              const Icon = link.icon;
              return (
                <NavLink
                  key={link.to}
                  to={link.to}
                  className={({ isActive }) =>
                    cn(
                      'flex items-center gap-3 rounded-2xl px-4 py-3 text-sm transition hover:bg-white/5',
                      isActive
                        ? 'border border-cyan-400/25 bg-cyan-400/10 text-cyan-200'
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
            <p className="font-medium text-white">{userEmail ?? 'Demo operator'}</p>
            <p className="mt-1 text-slate-400">Use Settings to prepare Vercel and GitHub deployment.</p>
          </div>

          {onSignOut && mode === 'live' && (
            <button
              type="button"
              onClick={onSignOut}
              className="mt-4 flex w-full items-center justify-center gap-2 rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-slate-200 transition hover:bg-white/10"
            >
              <LogOut className="h-4 w-4" />
              Sign out
            </button>
          )}
        </aside>

        <div className="space-y-6">
          <header className="rounded-[32px] border border-white/10 bg-slate-950/70 p-5 backdrop-blur-xl">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
              <div>
                <p className="text-xs uppercase tracking-[0.3em] text-slate-500">Operational view</p>
                <h1 className="mt-2 font-display text-4xl uppercase tracking-[0.16em] text-white">{pageName}</h1>
              </div>
              <div className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-slate-300">
                <Bell className="h-4 w-4 text-cyan-300" />
                <span>Counter-ready interface for fast service turnover.</span>
              </div>
            </div>
          </header>

          <main>{children}</main>
        </div>
      </div>
    </div>
  );
}
