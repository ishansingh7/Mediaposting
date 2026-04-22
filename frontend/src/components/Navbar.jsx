import { motion } from 'framer-motion';
import { Contact, Feather, LayoutGrid, LogIn, LogOut, Plus, Settings, ShieldCheck, UserRound } from 'lucide-react';
import { useApp } from '../state/AppContext.jsx';
import { NotificationBell } from './NotificationBell.jsx';

export const Navbar = () => {
  const { role, logoutAdmin, profile, setActiveView, activeView, setSelectedCategory } = useApp();
  const isAdmin = role === 'admin';

  const navItems = [
    { label: 'Home', view: 'home', icon: LayoutGrid },
    { label: 'Categories', view: 'categories', icon: Feather },
    { label: 'Contact', view: 'contact', icon: Contact },
    { label: 'Profile', view: 'profile', icon: UserRound },
    ...(isAdmin ? [{ label: 'Settings', view: 'settings', icon: Settings }] : []),
  ];

  return (
    <header className="fixed inset-x-0 top-0 z-40 border-b border-white/70 bg-[#f8fbf7]/80 backdrop-blur-2xl">
      <div className="mx-auto flex max-w-[1500px] items-center justify-between gap-2 px-3 py-3 sm:gap-4 sm:px-4 xl:px-6">
        <button
          onClick={() => {
            setSelectedCategory('All');
            setActiveView('home');
          }}
          className="flex items-center gap-3"
        >
          <motion.span
            whileHover={{ rotate: -8, scale: 1.05 }}
            className="grid h-10 w-10 place-items-center rounded-2xl bg-ink text-sun shadow-glow sm:h-12 sm:w-12"
          >
            <Feather fill="currentColor" size={22} />
          </motion.span>
          <span className="text-left">
            <span className="block font-display text-lg font-bold leading-5 text-ink sm:text-xl">Sony Thoughts</span>
            <span className="hidden text-xs font-bold uppercase tracking-[0.22em] text-moss sm:block">Social Articles</span>
          </span>
        </button>

        <nav className="hidden items-center gap-1 rounded-full border border-white/80 bg-white/65 p-1 shadow-sm md:flex">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.label}
                onClick={() => {
                  if (item.view === 'home') setSelectedCategory('All');
                  setActiveView(item.view);
                }}
                className={`flex items-center gap-2 rounded-full px-4 py-2 text-sm font-bold transition-all ${
                  activeView === item.view ? 'bg-ink text-white' : 'text-moss hover:bg-mist hover:text-ink'
                }`}
              >
                <Icon size={16} />
                {item.label}
              </button>
            );
          })}
        </nav>

        <div className="flex items-center gap-2">
          {isAdmin ? (
            <button
              onClick={() => setActiveView('create')}
              className="hidden items-center gap-2 rounded-full bg-ember px-4 py-2 text-sm font-extrabold text-white shadow-glow transition hover:-translate-y-0.5 lg:flex"
            >
              <Plus size={17} />
              Create Post
            </button>
          ) : null}
          {isAdmin ? <NotificationBell /> : null}
          <button
            onClick={() => (isAdmin ? logoutAdmin() : setActiveView('login'))}
            className="flex items-center gap-2 rounded-full border border-white/80 bg-white/75 px-3 py-2 text-xs font-extrabold text-ink shadow-sm transition hover:bg-ink hover:text-white sm:text-sm"
          >
            {isAdmin && profile?.avatar ? (
              <img src={profile.avatar} alt={profile.name} className="h-7 w-7 rounded-full object-cover" />
            ) : (
              <>{isAdmin ? <ShieldCheck size={18} /> : <LogIn size={18} />}</>
            )}
            <span className="hidden sm:inline">{isAdmin ? 'Logout' : 'Admin Login'}</span>
            {isAdmin ? <LogOut className="hidden lg:block" size={16} /> : null}
          </button>
        </div>
      </div>
    </header>
  );
};
