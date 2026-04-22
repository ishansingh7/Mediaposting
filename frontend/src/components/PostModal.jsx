import { AnimatePresence, motion } from 'framer-motion';
import { Eye, Heart, MessageCircle, Share2, X } from 'lucide-react';
import { compactNumber, shortDate } from '../lib/format.js';
import { useApp } from '../state/AppContext.jsx';
import { CommentBox } from './CommentBox.jsx';

export const PostModal = () => {
  const { selectedPost, closePost, likedPosts, toggleLike, showToast } = useApp();

  const share = async () => {
    if (!selectedPost) return;
    const text = `${selectedPost.title} - PulsePress`;
    if (navigator.share) {
      await navigator.share({ title: selectedPost.title, text, url: window.location.href });
    } else {
      await navigator.clipboard.writeText(`${text} ${window.location.href}`);
      showToast('Share link copied.');
    }
  };

  return (
    <AnimatePresence>
      {selectedPost ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[70] overflow-y-auto bg-ink/70 px-3 py-5 backdrop-blur-xl sm:px-5"
          onClick={closePost}
        >
          <motion.article
            initial={{ opacity: 0, y: 24, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 18, scale: 0.98 }}
            transition={{ duration: 0.25 }}
            onClick={(event) => event.stopPropagation()}
            className="mx-auto max-w-5xl overflow-hidden rounded-[2rem] bg-[#f7fbf6] shadow-glow"
          >
            <div className="sticky top-0 z-10 flex items-center justify-between border-b border-ink/10 bg-[#f7fbf6]/88 p-4 backdrop-blur-2xl">
              <div className="flex items-center gap-3">
                <img
                  src={selectedPost.author.avatar}
                  alt={selectedPost.author.name}
                  className="h-11 w-11 rounded-full object-cover ring-4 ring-white"
                />
                <div>
                  <p className="font-bold text-ink">{selectedPost.author.name}</p>
                  <p className="text-xs font-bold text-moss">
                    {shortDate(selectedPost.createdAt)} · {selectedPost.category}
                  </p>
                </div>
              </div>
              <button
                onClick={closePost}
                className="grid h-10 w-10 place-items-center rounded-full bg-white text-moss transition hover:bg-ink hover:text-white"
              >
                <X size={19} />
              </button>
            </div>

            <div className="p-4 sm:p-6 md:p-8">
              <p className="mb-3 inline-flex rounded-full bg-sun/30 px-3 py-1 text-xs font-black uppercase tracking-[0.22em] text-ink">
                Full Story
              </p>
              <h1 className="font-display text-3xl font-bold leading-tight text-ink sm:text-5xl">
                {selectedPost.title}
              </h1>
              <p className="mt-4 max-w-3xl text-base font-semibold leading-8 text-ink/72">
                {selectedPost.content}
              </p>

              <figure className="mt-6 overflow-hidden rounded-[1.8rem] border border-white/80 bg-white p-2 shadow-card">
                <div className="grid min-h-[260px] place-items-center overflow-hidden rounded-[1.35rem] bg-mist sm:min-h-[420px]">
                  <img
                    src={selectedPost.image}
                    alt={selectedPost.title}
                    className="max-h-[72vh] w-full object-contain"
                  />
                </div>
                <figcaption className="px-3 py-3 text-sm font-bold text-moss">
                  {selectedPost.title}
                </figcaption>
              </figure>

              <div className="mt-5 grid grid-cols-2 gap-2 sm:grid-cols-4">
                <motion.button
                  whileTap={{ scale: 0.9 }}
                  onClick={() => toggleLike(selectedPost.id)}
                  className={`flex items-center justify-center gap-2 rounded-2xl px-4 py-3 text-sm font-extrabold transition ${
                    likedPosts.has(selectedPost.id)
                      ? 'bg-ember text-white shadow-glow'
                      : 'bg-white text-moss hover:bg-ember/10 hover:text-ember'
                  }`}
                >
                  <Heart size={18} fill={likedPosts.has(selectedPost.id) ? 'currentColor' : 'none'} />
                  {compactNumber(selectedPost.likes)}
                </motion.button>
                <div className="flex items-center justify-center gap-2 rounded-2xl bg-white px-4 py-3 text-sm font-extrabold text-moss">
                  <MessageCircle size={18} />
                  {compactNumber(selectedPost.comments.length)}
                </div>
                <button
                  onClick={share}
                  className="flex items-center justify-center gap-2 rounded-2xl bg-white px-4 py-3 text-sm font-extrabold text-moss transition hover:bg-sun/30 hover:text-ink"
                >
                  <Share2 size={18} />
                  Share
                </button>
                <div className="flex items-center justify-center gap-2 rounded-2xl bg-white px-4 py-3 text-sm font-extrabold text-moss">
                  <Eye size={18} />
                  {compactNumber(selectedPost.views)}
                </div>
              </div>

              <CommentBox post={selectedPost} />
            </div>
          </motion.article>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
};
