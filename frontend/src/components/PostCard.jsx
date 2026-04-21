import { AnimatePresence, motion } from 'framer-motion';
import { Edit3, Eye, Heart, MessageCircle, Share2, Trash2, Unlock, Lock } from 'lucide-react';
import { useState } from 'react';
import { compactNumber, shortDate } from '../lib/format.js';
import { useApp } from '../state/AppContext.jsx';
import { CommentBox } from './CommentBox.jsx';
import { CreatePostForm } from './CreatePostForm.jsx';
import { Card } from './ui.jsx';

export const PostCard = ({ post }) => {
  const {
    role,
    likedPosts,
    toggleLike,
    openPost,
    deletePost,
    updateVisibility,
    showToast,
  } = useApp();
  const [commentsOpen, setCommentsOpen] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const [editing, setEditing] = useState(false);
  const liked = likedPosts.has(post.id);
  const isAdmin = role === 'admin';

  const handleOpen = async () => {
    await openPost(post.id);
    setExpanded((current) => !current);
  };

  const share = async () => {
    const text = `${post.title} - PulsePress`;
    if (navigator.share) {
      await navigator.share({ title: post.title, text, url: window.location.href });
    } else {
      await navigator.clipboard.writeText(`${text} ${window.location.href}`);
      showToast('Share link copied.');
    }
  };

  if (editing) {
    return (
      <CreatePostForm
        compact
        post={post}
        onCancel={() => setEditing(false)}
        onSaved={() => setEditing(false)}
      />
    );
  }

  return (
    <Card className={`overflow-hidden p-4 hover:-translate-y-1 hover:shadow-xl ${post.hidden ? 'opacity-70' : ''}`}>
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between sm:gap-4">
        <div className="flex items-center gap-3">
          <img src={post.author.avatar} alt={post.author.name} className="h-12 w-12 rounded-full object-cover ring-4 ring-white" />
          <div>
            <p className="font-bold text-ink">{post.author.name}</p>
            <p className="text-xs font-bold text-moss">
              {shortDate(post.createdAt)} · {post.category}
            </p>
          </div>
        </div>
        {isAdmin ? (
          <div className="flex flex-wrap gap-2 sm:justify-end">
            <button
              onClick={() => setEditing(true)}
              className="rounded-full bg-white/80 p-2 text-moss transition hover:bg-ocean hover:text-white"
              title="Edit post"
            >
              <Edit3 size={17} />
            </button>
            <button
              onClick={() => updateVisibility(post.id, !post.hidden)}
              className="rounded-full bg-white/80 p-2 text-moss transition hover:bg-sun hover:text-ink"
              title={post.hidden ? 'Unhide post' : 'Hide post'}
            >
              {post.hidden ? <Unlock size={17} /> : <Lock size={17} />}
            </button>
            <button
              onClick={() => deletePost(post.id)}
              className="rounded-full bg-white/80 p-2 text-moss transition hover:bg-ember hover:text-white"
              title="Delete post"
            >
              <Trash2 size={17} />
            </button>
          </div>
        ) : null}
      </div>

      <button onClick={handleOpen} className="mt-4 block w-full text-left">
        <h2 className="font-display text-xl font-bold leading-tight text-ink sm:text-2xl md:text-3xl">{post.title}</h2>
        <div className="mt-4 overflow-hidden rounded-[1.6rem]">
          <img src={post.image} alt={post.title} className="h-56 w-full object-cover transition duration-500 hover:scale-105 sm:h-72 md:h-96" />
        </div>
      </button>

      <p className="mt-4 text-[15px] font-medium leading-7 text-ink/75">
        {expanded ? post.content : `${post.content.slice(0, 180)}${post.content.length > 180 ? '...' : ''}`}
      </p>
      <button onClick={handleOpen} className="mt-2 text-sm font-extrabold text-ocean hover:text-ember">
        {expanded ? 'Collapse story' : 'Open story'}
      </button>

      <div className="mt-4 grid grid-cols-2 gap-2 border-t border-ink/10 pt-4 sm:grid-cols-4">
        <motion.button
          whileTap={{ scale: 0.86 }}
          onClick={() => toggleLike(post.id)}
          className={`flex items-center justify-center gap-2 rounded-2xl px-3 py-3 text-sm font-extrabold transition ${
            liked ? 'bg-ember text-white shadow-glow' : 'bg-white/65 text-moss hover:bg-ember/10 hover:text-ember'
          }`}
        >
          <Heart size={18} fill={liked ? 'currentColor' : 'none'} />
          {compactNumber(post.likes)}
        </motion.button>
        <button
          onClick={() => setCommentsOpen((current) => !current)}
          className="flex items-center justify-center gap-2 rounded-2xl bg-white/65 px-3 py-3 text-sm font-extrabold text-moss transition hover:bg-ocean/10 hover:text-ocean"
        >
          <MessageCircle size={18} />
          {compactNumber(post.comments.length)}
        </button>
        <button
          onClick={share}
          className="flex items-center justify-center gap-2 rounded-2xl bg-white/65 px-3 py-3 text-sm font-extrabold text-moss transition hover:bg-sun/25 hover:text-ink"
        >
          <Share2 size={18} />
          Share
        </button>
        <button
          onClick={handleOpen}
          className="flex items-center justify-center gap-2 rounded-2xl bg-white/65 px-3 py-3 text-sm font-extrabold text-moss transition hover:bg-mist hover:text-ink"
        >
          <Eye size={18} />
          {compactNumber(post.views)}
        </button>
      </div>

      <AnimatePresence>
        {commentsOpen ? (
          <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}>
            <CommentBox post={post} />
          </motion.div>
        ) : null}
      </AnimatePresence>
    </Card>
  );
};
