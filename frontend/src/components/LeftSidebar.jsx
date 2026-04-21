import { BarChart3, Compass, Home, Layers3, LogIn, MessageSquare, PlusCircle, UserRound } from 'lucide-react';
import { useApp } from '../state/AppContext.jsx';
import { Card } from './ui.jsx';

export const LeftSidebar = () => {
  const { role, activeView, setActiveView, categories, selectedCategory, setSelectedCategory } = useApp();
  const isAdmin = role === 'admin';

  const items = [
    { label: 'Home', view: 'home', icon: Home },
    { label: 'Categories', view: 'categories', icon: Layers3 },
    { label: 'Contact', view: 'contact', icon: MessageSquare },
    { label: 'Profile', view: 'profile', icon: UserRound },
    ...(isAdmin
      ? [
          { label: 'Dashboard', view: 'dashboard', icon: BarChart3 },
          { label: 'Create Post', view: 'create', icon: PlusCircle },
        ]
      : [{ label: 'Admin Login', view: 'login', icon: LogIn }]),
  ];

  return (
    <aside className="hidden lg:block">
      <div className="sticky top-24 space-y-4">
        <Card className="p-3">
          <div className="mb-3 flex items-center gap-3 px-2">
            <div className="grid h-10 w-10 place-items-center rounded-2xl bg-sun/40 text-ink">
              <Compass size={20} />
            </div>
            <div>
              <p className="font-display font-bold">Navigate</p>
              <p className="text-xs font-semibold text-moss">{isAdmin ? 'Admin workspace' : 'Visitor mode'}</p>
            </div>
          </div>
          <div className="space-y-1">
            {items.map((item) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.label}
                  onClick={() => {
                    if (item.view === 'home') setSelectedCategory('All');
                    setActiveView(item.view);
                  }}
                  className={`flex w-full items-center gap-3 rounded-2xl px-3 py-3 text-left text-sm font-bold transition-all ${
                    activeView === item.view ? 'bg-ink text-white shadow-glow' : 'text-moss hover:bg-white hover:text-ink'
                  }`}
                >
                  <Icon size={18} />
                  {item.label}
                </button>
              );
            })}
          </div>
        </Card>

        <Card className="p-4">
          <p className="mb-3 text-xs font-black uppercase tracking-[0.24em] text-moss">Quick Filters</p>
          <div className="flex flex-wrap gap-2">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => {
                  setSelectedCategory(category);
                  setActiveView('home');
                }}
                className={`rounded-full px-3 py-2 text-xs font-extrabold transition ${
                  selectedCategory === category ? 'bg-ember text-white' : 'bg-white/75 text-moss hover:text-ink'
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </Card>
      </div>
    </aside>
  );
};
