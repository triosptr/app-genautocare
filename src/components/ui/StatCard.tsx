import type { DashboardMetric } from '@/types/app';

export function StatCard({ label, value, hint }: DashboardMetric) {
  return (
    <article className="rounded-3xl border border-cyan-400/15 bg-slate-900/70 p-5">
      <p className="text-xs uppercase tracking-[0.25em] text-slate-400">{label}</p>
      <p className="mt-3 font-display text-3xl text-white">{value}</p>
      <p className="mt-2 text-sm text-slate-400">{hint}</p>
    </article>
  );
}
