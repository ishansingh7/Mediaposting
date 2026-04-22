import { Eye, Heart, MessageCircle, Newspaper, ShieldAlert, UserCog } from 'lucide-react';
import { compactNumber, shortDate } from '../lib/format.js';
import { useApp } from '../state/AppContext.jsx';
import { Card, Stat } from './ui.jsx';

export const AdminDashboard = () => {
  const { analytics, posts, setActiveView, updateVisibility, deletePost, showToast } = useApp();

  const removePost = (post) => {
    const confirmed = window.confirm(`Delete "${post.title}"? This cannot be undone in the current session.`);
    if (confirmed) deletePost(post.id);
  };

  return (
    <div className="space-y-5">
      <Card className="overflow-hidden p-5">
        <div className="rounded-[1.6rem] bg-ink p-6 text-white">
          <p className="text-xs font-black uppercase tracking-[0.24em] text-sun">Admin Dashboard</p>
          <div className="mt-3 flex flex-col justify-between gap-4 md:flex-row md:items-end">
            <div>
              <h1 className="font-display text-4xl font-bold">Control every story, signal, and conversation.</h1>
              <p className="mt-3 max-w-2xl text-sm font-medium leading-7 text-white/70">
                Manage visibility, monitor engagement, and publishing controls.
              </p>
            </div>
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setActiveView('profile')}
                className="inline-flex items-center gap-2 rounded-full bg-white/10 px-5 py-3 text-sm font-black text-white transition hover:bg-white/20"
              >
                <UserCog size={17} />
                Manage Profile
              </button>
              <button
                onClick={() => setActiveView('create')}
                className="rounded-full bg-sun px-5 py-3 text-sm font-black text-ink transition hover:-translate-y-0.5"
              >
                Create New Post
              </button>
            </div>
          </div>
        </div>
      </Card>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <Stat label="Posts" value={posts.length} icon={Newspaper} />
        <Stat label="Likes" value={compactNumber(analytics?.totalLikes || 0)} icon={Heart} />
        <Stat label="Views" value={compactNumber(analytics?.totalViews || 0)} icon={Eye} />
        <Stat label="Comments" value={compactNumber(analytics?.totalComments || 0)} icon={MessageCircle} />
      </div>

      <Card className="p-5">
        <div className="mb-4 flex items-center gap-2">
          <ShieldAlert className="text-ember" size={20} />
          <h2 className="font-display text-2xl font-bold">Post Management</h2>
        </div>
        <div className="space-y-3">
          {posts.map((post) => (
            <div
              key={post.id}
              className="grid gap-3 rounded-3xl bg-white/65 p-3 md:grid-cols-[76px_1fr_auto] md:items-center"
            >
              <button
                onClick={() => {
                  setActiveView('home');
                  showToast(`Open "${post.title}" from the feed to edit content.`);
                }}
              >
                <img src={post.image} alt="" className="h-20 w-full rounded-2xl object-cover md:w-20" />
              </button>
              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <p className="font-display text-lg font-bold">{post.title}</p>
                  {post.hidden ? (
                    <span className="rounded-full bg-ember/15 px-2 py-1 text-xs font-black text-ember">Hidden</span>
                  ) : null}
                </div>
                <p className="mt-1 text-xs font-bold uppercase tracking-[0.16em] text-moss">
                  {post.category} · {shortDate(post.createdAt)} · {compactNumber(post.views)} views
                </p>
              </div>
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => {
                    setActiveView('home');
                    showToast('Use the pencil icon on the post card to edit this story.');
                  }}
                  className="rounded-full bg-white px-4 py-2 text-xs font-black text-ink transition hover:bg-mist"
                >
                  Edit
                </button>
                <button
                  onClick={() => updateVisibility(post.id, !post.hidden)}
                  className="rounded-full bg-ink px-4 py-2 text-xs font-black text-white transition hover:bg-ocean"
                >
                  {post.hidden ? 'Unhide' : 'Hide'}
                </button>
                <button
                  onClick={() => removePost(post)}
                  className="rounded-full bg-ember px-4 py-2 text-xs font-black text-white transition hover:brightness-95"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
};
