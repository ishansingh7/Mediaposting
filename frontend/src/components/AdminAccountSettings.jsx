import { KeyRound, Mail, Plus, Save, ShieldCheck, Trash2, UsersRound } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useApp } from '../state/AppContext.jsx';
import { Card } from './ui.jsx';

const emptyPrimaryForm = {
  email: '',
  currentPassword: '',
  newPassword: '',
  confirmPassword: '',
};

const emptyNewAdminForm = {
  email: '',
  password: '',
  confirmPassword: '',
};

export const AdminAccountSettings = () => {
  const {
    getAdminAccount,
    updateAdminAccount,
    createAdminAccount,
    deleteAdminAccount,
    showToast,
  } = useApp();
  const [accounts, setAccounts] = useState([]);
  const [form, setForm] = useState(emptyPrimaryForm);
  const [newAdmin, setNewAdmin] = useState(emptyNewAdminForm);
  const [saving, setSaving] = useState(false);
  const [adding, setAdding] = useState(false);

  const refreshAccounts = async () => {
    const account = await getAdminAccount();
    if (account) {
      setAccounts(account.accounts || []);
      setForm((current) => ({ ...current, email: account.email || '' }));
    }
  };

  useEffect(() => {
    refreshAccounts();
    // Context function is intentionally read once for this settings mount.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const update = (field, value) => setForm((current) => ({ ...current, [field]: value }));
  const updateNewAdmin = (field, value) => setNewAdmin((current) => ({ ...current, [field]: value }));

  const submitNewAdmin = async (event) => {
    event.preventDefault();

    if (!newAdmin.email || !newAdmin.password) {
      showToast('New admin email and password are required.');
      return;
    }

    if (newAdmin.password.length < 6) {
      showToast('New admin password must be at least 6 characters.');
      return;
    }

    if (newAdmin.password !== newAdmin.confirmPassword) {
      showToast('New admin passwords do not match.');
      return;
    }

    setAdding(true);
    try {
      await createAdminAccount({
        email: newAdmin.email,
        password: newAdmin.password,
      });
      setNewAdmin(emptyNewAdminForm);
      await refreshAccounts();
    } catch (error) {
      showToast(error.message);
    } finally {
      setAdding(false);
    }
  };

  const submitPrimaryUpdate = async (event) => {
    event.preventDefault();

    if (!form.email || !form.currentPassword) {
      showToast('Email and current password are required.');
      return;
    }

    if (form.newPassword && form.newPassword !== form.confirmPassword) {
      showToast('New passwords do not match.');
      return;
    }

    setSaving(true);
    try {
      const account = await updateAdminAccount({
        email: form.email,
        currentPassword: form.currentPassword,
        newPassword: form.newPassword,
      });
      setForm({
        ...emptyPrimaryForm,
        email: account.email,
      });
      await refreshAccounts();
    } catch (error) {
      showToast(error.message);
    } finally {
      setSaving(false);
    }
  };

  const removeAdmin = async (email) => {
    const currentPassword = window.prompt(`Enter current admin password to remove ${email}`);
    if (!currentPassword) return;

    try {
      await deleteAdminAccount(email, { currentPassword });
      await refreshAccounts();
    } catch (error) {
      showToast(error.message);
    }
  };

  return (
    <div className="space-y-5">
      <div className="grid gap-5 xl:grid-cols-[1.05fr_0.95fr]">
        <Card className="relative overflow-hidden p-5">
          <div className="absolute -right-16 -top-20 h-56 w-56 rounded-full bg-ember/20 blur-3xl" />
          <div className="absolute bottom-0 left-10 h-40 w-40 rounded-full bg-sun/30 blur-3xl" />
          <div className="relative rounded-[1.6rem] bg-ink p-6 text-white">
            <div className="mb-5 flex items-center gap-3">
              <span className="grid h-12 w-12 place-items-center rounded-2xl bg-sun text-ink">
                <Plus size={23} />
              </span>
              <div>
                <p className="text-xs font-black uppercase tracking-[0.24em] text-sun">Add Your Own Login</p>
                <h2 className="font-display text-3xl font-bold">Create another admin email</h2>
              </div>
            </div>
            <p className="mb-5 max-w-xl text-sm font-medium leading-7 text-white/70">
              Because this page is already admin-protected, adding a new admin only needs the new email and password.
              After saving, that email can log in to the admin portal.
            </p>

            <form onSubmit={submitNewAdmin} className="grid gap-3">
              <input
                type="email"
                value={newAdmin.email}
                onChange={(event) => updateNewAdmin('email', event.target.value)}
                placeholder="your-email@example.com"
                className="rounded-2xl border border-white/10 bg-white/10 px-4 py-4 font-semibold text-white outline-none placeholder:text-white/45 focus:border-sun"
              />
              <div className="grid gap-3 sm:grid-cols-2">
                <input
                  type="password"
                  value={newAdmin.password}
                  onChange={(event) => updateNewAdmin('password', event.target.value)}
                  placeholder="New admin password"
                  className="rounded-2xl border border-white/10 bg-white/10 px-4 py-4 font-semibold text-white outline-none placeholder:text-white/45 focus:border-sun"
                />
                <input
                  type="password"
                  value={newAdmin.confirmPassword}
                  onChange={(event) => updateNewAdmin('confirmPassword', event.target.value)}
                  placeholder="Confirm password"
                  className="rounded-2xl border border-white/10 bg-white/10 px-4 py-4 font-semibold text-white outline-none placeholder:text-white/45 focus:border-sun"
                />
              </div>
              <button
                disabled={adding}
                className="inline-flex items-center justify-center gap-2 rounded-2xl bg-sun px-5 py-4 font-extrabold text-ink shadow-glow transition hover:-translate-y-0.5 disabled:opacity-60"
              >
                <ShieldCheck size={18} />
                {adding ? 'Adding Admin...' : 'Add Admin Login'}
              </button>
            </form>
          </div>
        </Card>

        <Card className="p-5">
          <div className="mb-4 flex items-center gap-2">
            <span className="grid h-10 w-10 place-items-center rounded-2xl bg-ocean/10 text-ocean">
              <UsersRound size={19} />
            </span>
            <div>
              <p className="text-xs font-black uppercase tracking-[0.22em] text-moss">Admin Access</p>
              <h2 className="font-display text-2xl font-bold">Active Login Emails</h2>
            </div>
          </div>

          <div className="space-y-2">
            {accounts.map((account, index) => (
              <div
                key={account.email}
                className="flex flex-col gap-3 rounded-2xl border border-white/75 bg-white/70 p-3 transition hover:bg-white sm:flex-row sm:items-center sm:justify-between"
              >
                <div>
                  <p className="break-all font-bold text-ink">{account.email}</p>
                  <p className="text-xs font-bold uppercase tracking-[0.16em] text-moss">
                    {index === 0 ? 'Primary admin login' : 'Additional admin login'}
                  </p>
                </div>
                <button
                  onClick={() => removeAdmin(account.email)}
                  disabled={accounts.length <= 1}
                  className="inline-flex items-center justify-center gap-2 rounded-full bg-ember px-4 py-2 text-xs font-black text-white transition hover:brightness-95 disabled:cursor-not-allowed disabled:opacity-45"
                >
                  <Trash2 size={15} />
                  Remove
                </button>
              </div>
            ))}
          </div>
        </Card>
      </div>

      <Card className="p-5">
        <div className="mb-4 flex items-center gap-2">
          <span className="grid h-10 w-10 place-items-center rounded-2xl bg-sun/35 text-ink">
            <KeyRound size={19} />
          </span>
          <div>
            <p className="text-xs font-black uppercase tracking-[0.22em] text-moss">Primary Security</p>
            <h2 className="font-display text-2xl font-bold">Update Primary Login</h2>
          </div>
        </div>

        <form onSubmit={submitPrimaryUpdate} className="grid gap-3 md:grid-cols-2">
          <label className="grid gap-2 text-sm font-extrabold text-ink md:col-span-2">
            Primary Login Email
            <div className="flex items-center gap-2 rounded-2xl border border-white bg-white/75 px-4 py-3">
              <Mail size={17} className="text-moss" />
              <input
                type="email"
                value={form.email}
                onChange={(event) => update('email', event.target.value)}
                className="min-w-0 flex-1 bg-transparent font-semibold outline-none"
              />
            </div>
          </label>

          <label className="grid gap-2 text-sm font-extrabold text-ink">
            Current Password
            <input
              type="password"
              value={form.currentPassword}
              onChange={(event) => update('currentPassword', event.target.value)}
              className="rounded-2xl border border-white bg-white/75 px-4 py-3 font-semibold outline-none focus:border-ocean"
            />
          </label>
          <label className="grid gap-2 text-sm font-extrabold text-ink">
            New Password
            <input
              type="password"
              value={form.newPassword}
              onChange={(event) => update('newPassword', event.target.value)}
              placeholder="Leave blank to keep current"
              className="rounded-2xl border border-white bg-white/75 px-4 py-3 font-semibold outline-none focus:border-ocean"
            />
          </label>
          <label className="grid gap-2 text-sm font-extrabold text-ink md:col-span-2">
            Confirm New Password
            <input
              type="password"
              value={form.confirmPassword}
              onChange={(event) => update('confirmPassword', event.target.value)}
              placeholder="Repeat new password"
              className="rounded-2xl border border-white bg-white/75 px-4 py-3 font-semibold outline-none focus:border-ocean"
            />
          </label>
          <button
            disabled={saving}
            className="inline-flex items-center justify-center gap-2 rounded-2xl bg-ink px-5 py-4 font-extrabold text-white transition hover:-translate-y-0.5 disabled:opacity-60 md:col-span-2"
          >
            <Save size={18} />
            {saving ? 'Saving...' : 'Update Primary Login'}
          </button>
        </form>
      </Card>
    </div>
  );
};
