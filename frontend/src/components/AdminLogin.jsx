import { LockKeyhole, LogIn } from 'lucide-react';
import { useState } from 'react';
import { useApp } from '../state/AppContext.jsx';
import { Card } from './ui.jsx';

export const AdminLogin = () => {
  const { loginAdmin, showToast } = useApp();
  const [email, setEmail] = useState('admin@pulsepress.com');
  const [password, setPassword] = useState('admin123');
  const [loading, setLoading] = useState(false);

  const submit = async (event) => {
    event.preventDefault();
    setLoading(true);
    try {
      await loginAdmin({ email, password });
    } catch (error) {
      showToast(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="mx-auto max-w-2xl overflow-hidden p-5">
      <div className="rounded-[1.6rem] bg-ink p-7 text-white">
        <div className="mb-5 grid h-14 w-14 place-items-center rounded-2xl bg-sun text-ink">
          <LockKeyhole size={26} />
        </div>
        <p className="text-xs font-black uppercase tracking-[0.24em] text-sun">Admin Login</p>
        <h1 className="mt-2 font-display text-4xl font-bold">Login to unlock publishing tools.</h1>
        <p className="mt-3 text-sm font-medium leading-7 text-white/70">
          Admin dashboard, post management, profile editing, and media uploads are protected until login.
        </p>
      </div>

      <form onSubmit={submit} className="mt-5 grid gap-4">
        <label className="grid gap-2 text-sm font-extrabold text-ink">
          Admin Email
          <input
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            className="rounded-2xl border border-white bg-white/75 px-4 py-3 font-semibold outline-none focus:border-ocean"
          />
        </label>
        <label className="grid gap-2 text-sm font-extrabold text-ink">
          Password
          <input
            type="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            className="rounded-2xl border border-white bg-white/75 px-4 py-3 font-semibold outline-none focus:border-ocean"
          />
        </label>
        <button
          disabled={loading}
          className="inline-flex items-center justify-center gap-2 rounded-2xl bg-ember px-5 py-4 font-extrabold text-white shadow-glow transition hover:-translate-y-0.5 disabled:opacity-60"
        >
          <LogIn size={18} />
          {loading ? 'Logging in...' : 'Login as Admin'}
        </button>
      </form>
    </Card>
  );
};
