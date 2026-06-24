import { CheckCircle2, Cloud, Github, Shield } from 'lucide-react';
import { type FormEvent, useState } from 'react';
import { Panel } from '@/components/ui/Panel';
import { isSupabaseConfigured } from '@/lib/supabase';
import { useCashierStore } from '@/store/useCashierStore';

export default function SettingsPage() {
  const { settings, updateSettings, mode } = useCashierStore();
  const [form, setForm] = useState(settings);

  function saveSettings(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    updateSettings(form);
  }

  return (
    <div className="grid gap-6 xl:grid-cols-[0.95fr_1.05fr]">
      <Panel title="Business Defaults" subtitle="Store the configuration values used during checkout and receipt generation.">
        <form className="space-y-4" onSubmit={saveSettings}>
          <label className="block">
            <span className="mb-2 block text-sm text-slate-400">Business name</span>
            <input
              value={form.businessName}
              onChange={(event) => setForm((current) => ({ ...current, businessName: event.target.value }))}
              className="brand-input w-full rounded-2xl px-4 py-3"
            />
          </label>

          <label className="block">
            <span className="mb-2 block text-sm text-slate-400">Tax rate (%)</span>
            <input
              type="number"
              value={form.taxRate}
              onChange={(event) => setForm((current) => ({ ...current, taxRate: Number(event.target.value) }))}
              className="brand-input w-full rounded-2xl px-4 py-3"
            />
          </label>

          <label className="block">
            <span className="mb-2 block text-sm text-slate-400">Receipt footer</span>
            <textarea
              value={form.receiptFooter}
              onChange={(event) => setForm((current) => ({ ...current, receiptFooter: event.target.value }))}
              rows={4}
              className="brand-input w-full rounded-2xl px-4 py-3"
            />
          </label>

          <button type="submit" className="brand-primary-btn rounded-2xl px-4 py-3 font-medium">
            Save settings
          </button>
        </form>
      </Panel>

      <div className="space-y-6">
        <Panel title="Integration Status" subtitle="Track the services required for production deployment.">
          <div className="space-y-4">
            <div className="brand-soft-card flex items-start gap-4 rounded-3xl p-4">
              <Shield className="mt-1 h-5 w-5 text-[#C8F400]" />
              <div>
                <p className="font-medium text-white">Supabase</p>
                <p className="mt-1 text-sm text-slate-400">
                  {isSupabaseConfigured ? 'Frontend env values are ready for a live connection.' : 'Add env values to enable the live Supabase workspace.'}
                </p>
              </div>
            </div>
            <div className="brand-soft-card flex items-start gap-4 rounded-3xl p-4">
              <Github className="mt-1 h-5 w-5 text-[#C8F400]" />
              <div>
                <p className="font-medium text-white">GitHub</p>
                <p className="mt-1 text-sm text-slate-400">Push this local project to a GitHub repository, then connect that repository in Vercel.</p>
              </div>
            </div>
            <div className="brand-soft-card flex items-start gap-4 rounded-3xl p-4">
              <Cloud className="mt-1 h-5 w-5 text-[#C8F400]" />
              <div>
                <p className="font-medium text-white">Vercel</p>
                <p className="mt-1 text-sm text-slate-400">Use the repository import flow and define the same `VITE_` env values in Vercel Project Settings.</p>
              </div>
            </div>
          </div>
        </Panel>

        <Panel title="Launch Checklist" subtitle="Recommended sequence for going from local build to production.">
          <div className="space-y-3">
            {[
              mode === 'live' ? 'Supabase environment is connected.' : 'Add Supabase env values to switch out of demo mode.',
              'Run the migration against Supabase and confirm the starter records.',
              'Push the project to GitHub and connect the repository to Vercel.',
              'Add `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` in Vercel.',
            ].map((item) => (
              <div key={item} className="flex items-center gap-3 rounded-2xl border border-[#C8F400]/20 bg-[#C8F400]/10 px-4 py-3 text-sm text-slate-100">
                <CheckCircle2 className="h-4 w-4 text-[#C8F400]" />
                <span>{item}</span>
              </div>
            ))}
          </div>
        </Panel>
      </div>
    </div>
  );
}
