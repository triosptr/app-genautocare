import { KeyRound, ShieldCheck } from 'lucide-react';
import { type FormEvent, useState } from 'react';
import { useCashierStore } from '@/store/useCashierStore';

export default function LoginPage() {
  const { signIn, authLoading, authError } = useCashierStore();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    await signIn(email, password);
  }

  return (
    <div className="grid min-h-screen place-items-center bg-[radial-gradient(circle_at_top,_rgba(183,255,60,0.18),_transparent_26%),radial-gradient(circle_at_bottom_right,_rgba(45,226,230,0.16),_transparent_30%),linear-gradient(180deg,_#080b11_0%,_#04060a_100%)] px-4 py-10 text-slate-100">
      <div className="grid w-full max-w-5xl overflow-hidden rounded-[36px] border border-white/10 bg-slate-950/80 shadow-[0_40px_140px_-48px_rgba(45,226,230,0.55)] backdrop-blur-xl lg:grid-cols-[1.1fr_0.9fr]">
        <section className="border-b border-white/10 p-8 lg:border-b-0 lg:border-r lg:p-12">
          <p className="text-xs uppercase tracking-[0.28em] text-cyan-300">Live operation</p>
          <h1 className="mt-4 font-display text-5xl uppercase tracking-[0.14em] text-white">
            Secure access for the cashier floor
          </h1>
          <p className="mt-5 max-w-xl text-base text-slate-300">
            Sign in with your Supabase account to load the real GEN AUTOCARE cashier workspace, product catalog,
            and transaction history.
          </p>

          <div className="mt-8 grid gap-4 md:grid-cols-2">
            <div className="rounded-3xl border border-cyan-400/15 bg-cyan-400/10 p-5">
              <ShieldCheck className="h-5 w-5 text-cyan-300" />
              <p className="mt-4 font-medium text-white">Authenticated-only access</p>
              <p className="mt-2 text-sm text-slate-300">The live workspace respects Supabase-authenticated policies.</p>
            </div>
            <div className="rounded-3xl border border-lime-300/15 bg-lime-300/10 p-5">
              <KeyRound className="h-5 w-5 text-lime-200" />
              <p className="mt-4 font-medium text-white">Ready for Vercel</p>
              <p className="mt-2 text-sm text-slate-300">Use the same env values locally and in the Vercel dashboard.</p>
            </div>
          </div>
        </section>

        <section className="p-8 lg:p-12">
          <p className="text-xs uppercase tracking-[0.28em] text-slate-500">Sign in</p>
          <form className="mt-6 space-y-5" onSubmit={handleSubmit}>
            <label className="block">
              <span className="mb-2 block text-sm text-slate-400">Email</span>
              <input
                type="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                required
                className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none transition focus:border-cyan-300/40"
                placeholder="owner@genautocare.com"
              />
            </label>

            <label className="block">
              <span className="mb-2 block text-sm text-slate-400">Password</span>
              <input
                type="password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                required
                className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none transition focus:border-cyan-300/40"
                placeholder="Your secure password"
              />
            </label>

            {authError && <p className="rounded-2xl border border-red-400/20 bg-red-500/10 px-4 py-3 text-sm text-red-200">{authError}</p>}

            <button
              type="submit"
              disabled={authLoading}
              className="w-full rounded-2xl bg-cyan-300 px-4 py-3 font-medium text-slate-950 transition hover:bg-cyan-200 disabled:cursor-not-allowed disabled:opacity-70"
            >
              {authLoading ? 'Signing in...' : 'Enter cashier workspace'}
            </button>
          </form>
        </section>
      </div>
    </div>
  );
}
