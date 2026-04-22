import { Feather, Home, Plus, Settings, UserRound } from 'lucide-react';
import { useApp } from '../state/AppContext.jsx';

export const MobileDock = () => {
  const { role, activeView, setActiveView, setSelectedCategory } = useApp();
  const isAdmin = role === 'admin';

  const items = [
    { label: 'Home', view: 'home', icon: Home },
    { label: 'Topics', view: 'categories', icon: Feather },
    ...(isAdmin ? [{ label: 'Create', view: 'create', icon: Plus }] : []),
    { label: 'Profile', view: 'profile', icon: UserRound },
    ...(isAdmin ? [{ label: 'Settings', view: 'settings', icon: Settings }] : []),
  ];

  return (
    <nav className="fixed inset-x-3 bottom-3 z-50 rounded-[1.4rem] border border-white/75 bg-white/85 p-2 shadow-glow backdrop-blur-2xl md:hidden">
      <div className={`grid gap-1 ${isAdmin ? 'grid-cols-5' : 'grid-cols-3'}`}>
        {items.map((item) => {
          const Icon = item.icon;
          const active = activeView === item.view;

          return (
            <button
              key={item.label}
              onClick={() => {
                if (item.view === 'home') setSelectedCategory('All');
                setActiveView(item.view);
              }}
              className={`flex flex-col items-center justify-center gap-1 rounded-2xl px-2 py-2 text-[11px] font-black transition ${
                active ? 'bg-ink text-white' : 'text-moss hover:bg-mist hover:text-ink'
              }`}
            >
              <Icon size={18} />
              {item.label}
            </button>
          );
        })}
      </div>
    </nav>
  );
};
