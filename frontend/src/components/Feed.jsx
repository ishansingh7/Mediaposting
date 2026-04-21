import { motion } from 'framer-motion';
import { Sparkles } from 'lucide-react';
import { useApp } from '../state/AppContext.jsx';
import { PostCard } from './PostCard.jsx';
import { Card, SkeletonFeed } from './ui.jsx';

export const Feed = () => {
  const { visiblePosts, selectedCategory, loading, role } = useApp();

  if (loading) return <SkeletonFeed />;

  return (
    <div className="space-y-5">
      <Card className="overflow-hidden p-5">
        <div className="relative overflow-hidden rounded-[1.6rem] bg-ink p-6 text-white">
          <div className="absolute right-0 top-0 h-44 w-44 rounded-full bg-sun/30 blur-3xl" />
          <div className="absolute bottom-0 left-1/3 h-40 w-40 rounded-full bg-ember/30 blur-3xl" />
          <div className="relative">
            <p className="mb-3 inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-xs font-black uppercase tracking-[0.22em] text-sun">
              <Sparkles size={14} />
              {role === 'admin' ? 'Creator command center' : 'Today on PulsePress'}
            </p>
            <h1 className="max-w-2xl font-display text-2xl font-bold leading-tight sm:text-3xl md:text-5xl">
              Social articles with the polish of a product-led media brand.
            </h1>
            <p className="mt-4 max-w-2xl text-sm font-medium leading-7 text-white/72 md:text-base">
              Browse premium stories, join conversations, and watch role-based controls transform the interface when
              admin mode is active.
            </p>
          </div>
        </div>
      </Card>

      <div className="flex flex-col gap-3 px-1 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-xs font-black uppercase tracking-[0.24em] text-moss">Latest Feed</p>
          <h2 className="font-display text-2xl font-bold text-ink">
            {selectedCategory === 'All' ? 'All Stories' : `${selectedCategory} Stories`}
          </h2>
        </div>
        <span className="rounded-full bg-white/70 px-3 py-2 text-xs font-black text-moss">
          {visiblePosts.length} posts
        </span>
      </div>

      {visiblePosts.length ? (
        <motion.div initial="hidden" animate="show" className="space-y-5">
          {visiblePosts.map((post, index) => (
            <motion.div
              key={post.id}
              variants={{
                hidden: { opacity: 0, y: 22 },
                show: { opacity: 1, y: 0 },
              }}
              transition={{ delay: index * 0.05 }}
            >
              <PostCard post={post} />
            </motion.div>
          ))}
        </motion.div>
      ) : (
        <Card className="p-10 text-center">
          <p className="font-display text-2xl font-bold">No posts in this category yet.</p>
          <p className="mt-2 text-sm font-semibold text-moss">Try another category or create a new admin post.</p>
        </Card>
      )}
    </div>
  );
};
