import type { DashboardMetric } from '@/types/app';

export function StatCard({ label, value, hint }: DashboardMetric) {
  return (
    <article className="rounded-3xl border border-[#C8F400]/20 bg-[linear-gradient(180deg,rgba(21,53,212,0.92)_0%,rgba(32,53,166,0.92)_100%)] p-5 shadow-[0_20px_48px_-28px_rgba(200,244,0,0.45)]">
      <p className="text-xs uppercase tracking-[0.25em] text-[#C8F400]">{label}</p>
      <p className="mt-3 font-display text-3xl text-white">{value}</p>
      <p className="mt-2 text-sm text-slate-200">{hint}</p>
    </article>
  );
}
