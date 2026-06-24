import type { DashboardMetric } from '@/types/app';

export function StatCard({ label, value, hint }: DashboardMetric) {
  return (
    <article className="rounded-[28px] border border-slate-200 bg-white p-5 shadow-[0_16px_38px_-28px_rgba(21,53,212,0.22)]">
      <p className="text-[11px] uppercase tracking-[0.2em] text-slate-500">{label}</p>
      <p className="mt-3 font-display text-[30px] leading-none text-[#1535D4]">{value}</p>
      <p className="mt-2 text-sm text-slate-500">{hint}</p>
    </article>
  );
}
