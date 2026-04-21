import { Activity, CalendarDays, Edit3, Globe2, MapPin, Save, X } from 'lucide-react';
import { useEffect, useState } from 'react';
import { shortDate } from '../lib/format.js';
import { useApp } from '../state/AppContext.jsx';
import { PostCard } from './PostCard.jsx';
import { Card } from './ui.jsx';

const readFile = (file) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });

export const ProfilePage = () => {
  const { role, profile, posts, updateProfile } = useApp();
  const [tab, setTab] = useState('posts');
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState(profile || {});
  const isAdmin = role === 'admin';

  useEffect(() => {
    if (profile && !editing) setForm(profile);
  }, [profile, editing]);

  if (!profile) return null;

  const save = async () => {
    await updateProfile(form);
    setEditing(false);
  };

  const uploadImage = async (field, file) => {
    if (!file) return;
    const image = await readFile(file);
    setForm((current) => ({ ...current, [field]: image }));
  };

  return (
    <div className="space-y-5">
      <Card className="overflow-hidden">
        <div className="relative h-44 sm:h-64">
          <img src={profile.cover} alt="" className="h-full w-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-ink/70 via-transparent to-transparent" />
        </div>
        <div className="relative px-5 pb-5">
          <img
            src={profile.avatar}
            alt={profile.name}
            className="-mt-12 h-24 w-24 rounded-full border-8 border-[#f7fbf6] object-cover shadow-card sm:-mt-16 sm:h-32 sm:w-32"
          />
          <div className="mt-4 flex flex-col justify-between gap-4 md:flex-row md:items-start">
            <div>
              <h1 className="font-display text-3xl font-bold text-ink sm:text-4xl">{profile.name}</h1>
              <p className="mt-1 font-bold text-ocean">{profile.role}</p>
              <p className="mt-3 max-w-2xl text-sm font-semibold leading-7 text-ink/72">{profile.bio}</p>
            </div>
            {isAdmin ? (
              <button
                onClick={() => {
                  setForm(profile);
                  setEditing(true);
                }}
                className="inline-flex items-center gap-2 rounded-full bg-ink px-5 py-3 text-sm font-black text-white transition hover:-translate-y-0.5"
              >
                <Edit3 size={17} />
                Edit Profile
              </button>
            ) : null}
          </div>
          <div className="mt-5 flex flex-wrap gap-3 text-sm font-bold text-moss">
            <span className="inline-flex items-center gap-2 rounded-full bg-white/65 px-3 py-2">
              <MapPin size={16} />
              {profile.location}
            </span>
            <span className="inline-flex items-center gap-2 rounded-full bg-white/65 px-3 py-2">
              <Globe2 size={16} />
              {profile.website}
            </span>
            <span className="inline-flex items-center gap-2 rounded-full bg-white/65 px-3 py-2">
              <CalendarDays size={16} />
              Joined {shortDate(profile.joined)}
            </span>
          </div>
        </div>
      </Card>

      {editing ? (
        <Card className="p-5">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="font-display text-2xl font-bold">Edit Profile</h2>
            <button onClick={() => setEditing(false)} className="rounded-full bg-white p-2 text-moss hover:bg-ink hover:text-white">
              <X size={18} />
            </button>
          </div>

          <div className="mb-4 grid gap-4 md:grid-cols-2">
            <label className="grid gap-2 text-sm font-extrabold text-ink">
              Profile Picture Upload
              <div className="flex items-center gap-3 rounded-2xl bg-white/70 p-3">
                <img src={form.avatar} alt="" className="h-16 w-16 rounded-full object-cover" />
                <input
                  type="file"
                  accept="image/*"
                  onChange={(event) => uploadImage('avatar', event.target.files?.[0])}
                  className="min-w-0 text-xs font-bold text-moss sm:text-sm"
                />
              </div>
            </label>
            <label className="grid gap-2 text-sm font-extrabold text-ink">
              Cover Photo Upload
              <div className="rounded-2xl bg-white/70 p-3">
                <img src={form.cover} alt="" className="mb-3 h-28 w-full rounded-xl object-cover" />
                <input
                  type="file"
                  accept="image/*"
                  onChange={(event) => uploadImage('cover', event.target.files?.[0])}
                  className="min-w-0 text-xs font-bold text-moss sm:text-sm"
                />
              </div>
            </label>
          </div>

          <div className="grid gap-3 md:grid-cols-2">
            {['name', 'role', 'avatar', 'cover', 'location', 'website'].map((field) => (
              <input
                key={field}
                value={form[field] || ''}
                onChange={(event) => setForm((current) => ({ ...current, [field]: event.target.value }))}
                placeholder={field}
                className="rounded-2xl border border-white bg-white/75 px-4 py-3 text-sm font-semibold outline-none focus:border-ocean"
              />
            ))}
            <textarea
              value={form.bio || ''}
              onChange={(event) => setForm((current) => ({ ...current, bio: event.target.value }))}
              rows={4}
              placeholder="Bio"
              className="resize-none rounded-2xl border border-white bg-white/75 px-4 py-3 text-sm font-semibold outline-none focus:border-ocean md:col-span-2"
            />
          </div>
          <button onClick={save} className="mt-4 inline-flex items-center gap-2 rounded-full bg-ember px-5 py-3 text-sm font-black text-white">
            <Save size={17} />
            Save Profile
          </button>
        </Card>
      ) : null}

      <Card className="p-2">
        <div className="grid grid-cols-3 gap-2">
          {['posts', 'about', 'activity'].map((item) => (
            <button
              key={item}
              onClick={() => setTab(item)}
              className={`rounded-2xl px-4 py-3 text-sm font-black capitalize transition ${
                tab === item ? 'bg-ink text-white' : 'text-moss hover:bg-white/70 hover:text-ink'
              }`}
            >
              {item}
            </button>
          ))}
        </div>
      </Card>

      {tab === 'posts' ? (
        <div className="space-y-5">{posts.map((post) => <PostCard key={post.id} post={post} />)}</div>
      ) : null}

      {tab === 'about' ? (
        <Card className="p-6">
          <h2 className="font-display text-2xl font-bold">About {profile.name}</h2>
          <p className="mt-3 leading-7 text-ink/75">{profile.bio}</p>
          <div className="mt-5 grid gap-3 sm:grid-cols-3">
            <div className="rounded-2xl bg-white/65 p-4">
              <p className="text-xs font-black uppercase tracking-[0.2em] text-moss">Focus</p>
              <p className="mt-2 font-bold">Editorial strategy</p>
            </div>
            <div className="rounded-2xl bg-white/65 p-4">
              <p className="text-xs font-black uppercase tracking-[0.2em] text-moss">Community</p>
              <p className="mt-2 font-bold">{posts.length} published stories</p>
            </div>
            <div className="rounded-2xl bg-white/65 p-4">
              <p className="text-xs font-black uppercase tracking-[0.2em] text-moss">Website</p>
              <p className="mt-2 font-bold">{profile.website}</p>
            </div>
          </div>
        </Card>
      ) : null}

      {tab === 'activity' ? (
        <Card className="p-6">
          <h2 className="mb-4 flex items-center gap-2 font-display text-2xl font-bold">
            <Activity className="text-ocean" size={22} />
            Recent Activity
          </h2>
          <div className="space-y-3">
            {posts.slice(0, 5).map((post) => (
              <div key={post.id} className="rounded-2xl bg-white/65 p-4">
                <p className="font-bold">
                  {profile.name} published "{post.title}"
                </p>
                <p className="mt-1 text-xs font-bold uppercase tracking-[0.16em] text-moss">{shortDate(post.createdAt)}</p>
              </div>
            ))}
          </div>
        </Card>
      ) : null}
    </div>
  );
};
