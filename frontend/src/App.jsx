import { AnimatePresence, motion } from 'framer-motion';
import { Plus } from 'lucide-react';
import { AdminDashboard } from './components/AdminDashboard.jsx';
import { AdminLogin } from './components/AdminLogin.jsx';
import { CategoriesPage } from './components/CategoriesPage.jsx';
import { ContactPage } from './components/ContactPage.jsx';
import { CreatePostForm } from './components/CreatePostForm.jsx';
import { Feed } from './components/Feed.jsx';
import { LeftSidebar } from './components/LeftSidebar.jsx';
import { MobileDock } from './components/MobileDock.jsx';
import { Navbar } from './components/Navbar.jsx';
import { ProfilePage } from './components/ProfilePage.jsx';
import { PostModal } from './components/PostModal.jsx';
import { RightSidebar } from './components/RightSidebar.jsx';
import { SettingsPage } from './components/SettingsPage.jsx';
import { useApp } from './state/AppContext.jsx';

const views = {
  home: <Feed />,
  categories: <CategoriesPage />,
  contact: <ContactPage />,
  login: <AdminLogin />,
  profile: <ProfilePage />,
  dashboard: <AdminDashboard />,
  create: <CreatePostForm />,
  settings: <SettingsPage />,
};

function App() {
  const { activeView, toast, role, setActiveView } = useApp();
  const protectedViews = ['dashboard', 'create', 'settings'];
  const activePage = protectedViews.includes(activeView) && role !== 'admin' ? 'login' : activeView;
  const isAdmin = role === 'admin';

  return (
    <div className="min-h-screen bg-grid bg-[length:34px_34px]">
      <Navbar />
      {isAdmin ? (
        <div className="fixed inset-x-3 top-[4.6rem] z-30 md:hidden">
          <button
            onClick={() => setActiveView('create')}
            className={`flex h-12 w-full items-center justify-center gap-2 rounded-2xl text-sm font-extrabold shadow-glow transition ${
              activePage === 'create' ? 'bg-ink text-white' : 'bg-ember text-white active:scale-[0.98]'
            }`}
          >
            <Plus size={18} />
            Create Post
          </button>
        </div>
      ) : null}
      <main
        className={`mx-auto grid w-full max-w-[1500px] grid-cols-1 gap-5 px-3 pb-28 sm:px-4 md:pt-24 lg:grid-cols-[260px_minmax(0,1fr)] lg:pb-10 xl:grid-cols-[260px_minmax(0,1fr)_330px] xl:px-6 ${
          isAdmin ? 'pt-36' : 'pt-20'
        }`}
      >
        <LeftSidebar />
        <AnimatePresence mode="wait">
          <motion.section
            key={activePage}
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.28, ease: 'easeOut' }}
            className="min-w-0"
          >
            {views[activePage] || views.home}
          </motion.section>
        </AnimatePresence>
        <RightSidebar />
      </main>
      <MobileDock />
      <PostModal />
      <AnimatePresence>
        {toast ? (
          <motion.div
            initial={{ opacity: 0, y: 18, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 18, scale: 0.96 }}
            className="fixed bottom-6 left-1/2 z-50 -translate-x-1/2 rounded-full bg-ink px-5 py-3 text-sm font-bold text-white shadow-glow"
          >
            {toast}
          </motion.div>
        ) : null}
      </AnimatePresence>
    </div>
  );
}

export default App;
