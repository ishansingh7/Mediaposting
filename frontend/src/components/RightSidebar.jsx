import { Eye, Heart, Layers3, TrendingUp } from 'lucide-react';
import { compactNumber } from '../lib/format.js';
import { useApp } from '../state/AppContext.jsx';
import { Card } from './ui.jsx';

const MiniList = ({ title, icon: Icon, posts, accent, onOpen }) => (
  <Card className="p-4">
    <div className="mb-4 flex items-center gap-2">
      <span className={`grid h-9 w-9 place-items-center rounded-2xl ${accent}`}>
        <Icon size={18} />
      </span>
      <h3 className="font-display text-lg font-bold">{title}</h3>
    </div>
    <div className="space-y-3">
      {posts.map((post, index) => (
        <button
          key={post.id}
          onClick={() => onOpen(post)}
          className="flex w-full gap-3 rounded-2xl p-2 text-left transition hover:bg-white/70"
        >
          <img src={post.image} alt="" className="h-14 w-14 rounded-2xl object-cover" />
          <div className="min-w-0">
            <p className="line-clamp-2 text-sm font-extrabold leading-snug">{post.title}</p>
            <p className="mt-1 text-xs font-bold text-moss">
              #{index + 1} · {compactNumber(post.likes)} likes · {compactNumber(post.views)} views
            </p>
          </div>
        </button>
      ))}
    </div>
  </Card>
);

export const RightSidebar = () => {
  const {
    categories,
    selectedCategory,
    setSelectedCategory,
    setActiveView,
    mostLiked,
    mostViewed,
    trending,
    openPost,
    showToast,
  } = useApp();

  const openSidebarPost = async (post) => {
    setSelectedCategory('All');
    setActiveView('home');
    await openPost(post.id);
    showToast(`Opened "${post.title}" in the feed.`);
  };

  return (
    <aside className="hidden xl:block">
      <div className="sticky top-24 max-h-[calc(100vh-7rem)] space-y-4 overflow-auto pr-1 thin-scrollbar">
        <Card className="p-4">
          <div className="mb-4 flex items-center gap-2">
            <span className="grid h-9 w-9 place-items-center rounded-2xl bg-ocean/10 text-ocean">
              <Layers3 size={18} />
            </span>
            <h3 className="font-display text-lg font-bold">Categories</h3>
          </div>
          <div className="flex flex-wrap gap-2">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => {
                  setSelectedCategory(category);
                  setActiveView('home');
                }}
                className={`rounded-full px-3 py-2 text-xs font-extrabold transition ${
                  selectedCategory === category ? 'bg-ink text-white' : 'bg-white/70 text-moss hover:text-ink'
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </Card>
        <MiniList title="Most Liked" icon={Heart} posts={mostLiked} accent="bg-ember/15 text-ember" onOpen={openSidebarPost} />
        <MiniList title="Most Viewed" icon={Eye} posts={mostViewed} accent="bg-ocean/15 text-ocean" onOpen={openSidebarPost} />
        <MiniList title="Trending" icon={TrendingUp} posts={trending} accent="bg-sun/35 text-ink" onOpen={openSidebarPost} />
      </div>
    </aside>
  );
};
