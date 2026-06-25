import { useEffect } from 'react';
import { BrowserRouter, Navigate, Outlet, Route, Routes } from 'react-router-dom';
import { BrandLogo } from '@/components/branding/BrandLogo';
import { AppShell } from '@/components/layout/AppShell';
import CashierDetailPage from '@/pages/CashierDetailPage';
import CustomersPage from '@/pages/CustomersPage';
import DashboardPage from '@/pages/DashboardPage';
import LoginPage from '@/pages/LoginPage';
import ReportsPage from '@/pages/ReportsPage';
import SettingsPage from '@/pages/SettingsPage';
import { useCashierStore } from '@/store/useCashierStore';

function LoadingScreen() {
  return (
    <div className="grid min-h-screen place-items-center bg-[linear-gradient(180deg,_#f9fbff_0%,_#f3f6fb_100%)] text-slate-900">
      <div className="text-center">
        <BrandLogo variant="on-light" />
        <p className="mt-4 font-display text-3xl uppercase tracking-[0.12em] text-slate-900">Menyiapkan Kasir</p>
      </div>
    </div>
  );
}

export default function App() {
  const { initialize, mode, ready, currentRole, clearRole } = useCashierStore();

  useEffect(() => {
    initialize();
  }, [initialize]);

  if (!ready) {
    return <LoadingScreen />;
  }

  function ProtectedLayout() {
    if (!currentRole) {
      return <Navigate to="/login" replace />;
    }

    return (
      <AppShell mode={mode} role="kasir" onSignOut={clearRole}>
        <Outlet />
      </AppShell>
    );
  }

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={currentRole ? <Navigate to="/" replace /> : <LoginPage />} />
        <Route element={<ProtectedLayout />}>
          <Route path="/" element={<DashboardPage />} />
          <Route path="/cashier" element={<CashierDetailPage />} />
          <Route path="/customers" element={<CustomersPage />} />
          <Route path="/reports" element={<ReportsPage />} />
          <Route path="/settings" element={<SettingsPage />} />
        </Route>
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
