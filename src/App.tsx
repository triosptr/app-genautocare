import { useEffect } from 'react';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import { BrandLogo } from '@/components/branding/BrandLogo';
import { AppShell } from '@/components/layout/AppShell';
import CashierDetailPage from '@/pages/CashierDetailPage';
import CustomersPage from '@/pages/CustomersPage';
import DashboardPage from '@/pages/DashboardPage';
import ReportsPage from '@/pages/ReportsPage';
import LoginPage from '@/pages/LoginPage';
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
  const { initialize, clearRole, mode, currentRole, ready } = useCashierStore();

  useEffect(() => {
    initialize();
  }, [initialize]);

  if (!ready) {
    return <LoadingScreen />;
  }

  if (!currentRole) {
    return <LoginPage />;
  }

  return (
    <BrowserRouter>
      <AppShell mode={mode} role={currentRole} onSignOut={clearRole}>
        <Routes>
          <Route path="/" element={<DashboardPage />} />
          <Route path="/cashier" element={<CashierDetailPage />} />
          <Route path="/customers" element={<CustomersPage />} />
          <Route path="/reports" element={<ReportsPage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </AppShell>
    </BrowserRouter>
  );
}
