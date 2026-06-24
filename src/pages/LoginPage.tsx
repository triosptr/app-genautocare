import { ArrowRight, BriefcaseBusiness, ShieldCheck, ShoppingBag } from 'lucide-react';
import { BrandLogo } from '@/components/branding/BrandLogo';
import { roleCards } from '@/lib/mock-data';
import { useCashierStore } from '@/store/useCashierStore';

export default function LoginPage() {
  const { setRole } = useCashierStore();

  const iconMap = {
    owner: ShieldCheck,
    manager_ops: BriefcaseBusiness,
    kasir: ShoppingBag,
  };

  return (
    <div className="grid min-h-screen place-items-center bg-[radial-gradient(circle_at_top_left,_rgba(200,244,0,0.18),_transparent_24%),radial-gradient(circle_at_bottom_right,_rgba(249,249,255,0.12),_transparent_30%),linear-gradient(180deg,_#1535D4_0%,_#2035A6_44%,_#373A4A_100%)] px-4 py-10 text-slate-100">
      <div className="grid w-full max-w-6xl overflow-hidden rounded-[36px] border border-white/10 bg-[linear-gradient(180deg,rgba(21,53,212,0.2)_0%,rgba(55,58,74,0.82)_100%)] shadow-[0_40px_140px_-48px_rgba(21,53,212,0.7)] backdrop-blur-xl lg:grid-cols-[0.95fr_1.05fr]">
        <section className="border-b border-white/10 p-8 lg:border-b-0 lg:border-r lg:p-12">
          <BrandLogo variant="on-dark" className="mb-6" />
          <p className="text-xs uppercase tracking-[0.28em] text-[#C8F400]">Demo role access</p>
          <h1 className="mt-4 font-display text-5xl uppercase tracking-[0.14em] text-white">
            Sistem kasir dan manajemen cuci motor
          </h1>
          <p className="mt-5 max-w-xl text-base text-slate-300">
            Pilih role untuk masuk ke aplikasi demo sesuai hak akses. Struktur modul, antrian, QC, gudang, absensi,
            laporan, dan pengaturan sudah menyesuaikan spesifikasi operasional terbaru GEN AUTO CARE.
          </p>

          <div className="mt-8 grid gap-4 md:grid-cols-2">
            <div className="rounded-3xl border border-[#1535D4]/45 bg-[#1535D4]/45 p-5">
              <ShieldCheck className="h-5 w-5 text-[#F9F9FF]" />
              <p className="mt-4 font-medium text-white">3 role operasional</p>
              <p className="mt-2 text-sm text-slate-300">Owner, Manager Ops, dan Kasir mendapatkan tampilan modul yang berbeda.</p>
            </div>
            <div className="rounded-3xl border border-[#C8F400]/20 bg-[#C8F400]/12 p-5">
              <ArrowRight className="h-5 w-5 text-[#C8F400]" />
              <p className="mt-4 font-medium text-white">Mode POS & antrian</p>
              <p className="mt-2 text-sm text-slate-300">Alur transaksi langsung terkoneksi ke status `Masuk`, `Dicuci`, `Selesai`, lalu QC.</p>
            </div>
          </div>
        </section>

        <section className="p-8 lg:p-12">
          <p className="text-xs uppercase tracking-[0.28em] text-slate-500">Pilih role</p>
          <div className="mt-6 grid gap-4">
            {roleCards.map((role) => {
              const Icon = iconMap[role.id];
              return (
                <button
                  key={role.id}
                  type="button"
                  onClick={() => setRole(role.id)}
                  className="brand-soft-card flex items-start justify-between gap-4 rounded-[28px] p-5 text-left transition hover:border-[#C8F400]/35 hover:bg-[#1535D4]/18"
                >
                  <div className="flex gap-4">
                    <div className="grid h-12 w-12 place-items-center rounded-2xl bg-[#1535D4] text-white">
                      <Icon className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="font-display text-2xl uppercase tracking-[0.08em] text-white">{role.label}</p>
                      <p className="mt-1 text-sm text-[#C8F400]">{role.short}</p>
                      <p className="mt-3 text-sm text-slate-300">{role.description}</p>
                    </div>
                  </div>
                  <ArrowRight className="mt-1 h-5 w-5 text-[#C8F400]" />
                </button>
              );
            })}
          </div>
        </section>
      </div>
    </div>
  );
}
