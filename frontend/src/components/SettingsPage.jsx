import { KeyRound, Settings, ShieldCheck } from 'lucide-react';
import { AdminAccountSettings } from './AdminAccountSettings.jsx';
import { Card } from './ui.jsx';

export const SettingsPage = () => {
  return (
    <div className="space-y-5">
      <Card className="overflow-hidden p-5">
        <div className="relative overflow-hidden rounded-[1.6rem] bg-ink p-6 text-white">
          <div className="absolute -right-10 -top-16 h-56 w-56 rounded-full bg-sun/25 blur-3xl" />
          <div className="absolute bottom-0 left-1/3 h-48 w-48 rounded-full bg-ember/25 blur-3xl" />
          <div className="relative">
            <div className="mb-4 flex items-center gap-3">
              <div className="grid h-12 w-12 place-items-center rounded-2xl bg-sun text-ink">
                <Settings size={23} />
              </div>
              <span className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-2 text-xs font-black uppercase tracking-[0.2em] text-sun">
                <ShieldCheck size={15} />
                Admin Security
              </span>
            </div>
            <h1 className="font-display text-3xl font-bold sm:text-5xl">Your portal, your login keys.</h1>
            <p className="mt-3 max-w-2xl text-sm font-medium leading-7 text-white/70">
              Add your own admin email, manage active login accounts, and update primary credentials from one protected console.
            </p>
          </div>
        </div>
      </Card>

      <Card className="p-4">
        <div className="flex items-start gap-3 rounded-3xl bg-sun/20 p-4 text-ink">
          <KeyRound className="mt-1 text-ember" size={20} />
          <div>
            <p className="font-display text-lg font-bold">Password changes require your current password</p>
            <p className="mt-1 text-sm font-semibold leading-6 text-ink/70">
              After saving, use the updated email/password the next time you log in.
            </p>
          </div>
        </div>
      </Card>

      <AdminAccountSettings />
    </div>
  );
};
