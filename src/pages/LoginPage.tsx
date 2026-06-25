import { BrandLogo } from '@/components/branding/BrandLogo';
import { cn } from '@/lib/utils';
import { useCashierStore } from '@/store/useCashierStore';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function LoginPage() {
  const navigate = useNavigate();
  const { signIn } = useCashierStore();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    const ok = signIn(username, password);
    if (!ok) {
      setError('Username atau password salah.');
      return;
    }
    navigate('/', { replace: true });
  }

  return (
    <div className="grid min-h-screen place-items-center bg-[#eef0f5] px-4 py-10 text-slate-900">
      <div className="w-full max-w-xl">
        <div className="brand-panel rounded-[24px] p-6 md:p-8">
          <div className="flex flex-col items-center text-center">
            <BrandLogo variant="on-dark" className="mb-4" />
            <p className="font-display text-[28px] font-extrabold tracking-[-0.02em] text-slate-900">GEN AUTOCARE</p>
            <p className="mt-1 text-sm font-semibold text-[#1535D4]">SUNGAI PENUH</p>
          </div>

          <form onSubmit={handleSubmit} className="mt-8 space-y-4">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-500">Username</p>
              <input
                value={username}
                onChange={(event) => setUsername(event.target.value)}
                className="brand-input mt-2 w-full rounded-2xl px-4 py-3"
                placeholder="Masukkan username"
                autoComplete="username"
              />
            </div>
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-500">Password</p>
              <input
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                type="password"
                className="brand-input mt-2 w-full rounded-2xl px-4 py-3"
                placeholder="Masukkan password"
                autoComplete="current-password"
              />
            </div>

            {error && (
              <div className="rounded-[16px] border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                {error}
              </div>
            )}

            <button type="submit" className="brand-blue-btn w-full rounded-[16px] px-4 py-3 text-sm font-semibold">
              Masuk
            </button>
          </form>

          <div className="mt-6 rounded-[18px] border border-slate-200 bg-[#f7f8fb] p-4">
            <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-500">Akun Kasir</p>
            <p className={cn('mt-2 text-sm text-slate-700')}>
              username: <span className="font-semibold text-slate-900">genautocarekasir</span>
            </p>
            <p className="mt-1 text-sm text-slate-700">
              password: <span className="font-semibold text-slate-900">appgen123</span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
