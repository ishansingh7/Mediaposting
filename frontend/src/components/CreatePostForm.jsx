import { ImagePlus, Save, X } from 'lucide-react';
import { useState } from 'react';
import { useApp } from '../state/AppContext.jsx';
import { Card } from './ui.jsx';

const readFile = (file) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });

const emptyPost = {
  title: '',
  category: 'Tech',
  content: '',
  image: '',
};

export const CreatePostForm = ({ compact = false, post, onCancel, onSaved }) => {
  const { createPost, updatePost, categories, showToast } = useApp();
  const [form, setForm] = useState(post || emptyPost);
  const [saving, setSaving] = useState(false);
  const editableCategories = categories.filter((category) => category !== 'All');

  const update = (field, value) => setForm((current) => ({ ...current, [field]: value }));

  const handleFile = async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;
    const image = await readFile(file);
    update('image', image);
  };

  const submit = async (event) => {
    event.preventDefault();
    if (!form.title || !form.category || !form.content || !form.image) {
      showToast('Please complete title, category, content, and image.');
      return;
    }

    setSaving(true);
    if (post) {
      await updatePost(post.id, form);
      onSaved?.();
    } else {
      await createPost(form);
    }
    setSaving(false);
  };

  return (
    <Card className="overflow-hidden p-5">
      <div className="mb-5 flex items-start justify-between gap-4">
        <div>
          <p className="text-xs font-black uppercase tracking-[0.24em] text-moss">
            {post ? 'Edit Story' : 'Admin Publishing'}
          </p>
          <h1 className="font-display text-2xl font-bold text-ink sm:text-3xl">
            {post ? 'Refine your post' : 'Create a premium social post'}
          </h1>
          {!compact ? (
            <p className="mt-2 max-w-2xl text-sm font-semibold leading-6 text-moss">
              Upload an image, write the story, and publish directly into the live feed.
            </p>
          ) : null}
        </div>
        {onCancel ? (
          <button onClick={onCancel} className="rounded-full bg-white/80 p-2 text-moss transition hover:bg-ink hover:text-white">
            <X size={18} />
          </button>
        ) : null}
      </div>

      <form onSubmit={submit} className="grid gap-4">
        <div className="grid gap-4 md:grid-cols-[1fr_220px]">
          <label className="grid gap-2 text-sm font-extrabold text-ink">
            Title
            <input
              value={form.title}
              onChange={(event) => update('title', event.target.value)}
              placeholder="A headline people want to open"
              className="rounded-2xl border border-white bg-white/75 px-4 py-3 font-semibold outline-none focus:border-ocean"
            />
          </label>
          <label className="grid gap-2 text-sm font-extrabold text-ink">
            Category
            <input
              list="category-options"
              value={form.category}
              onChange={(event) => update('category', event.target.value)}
              className="rounded-2xl border border-white bg-white/75 px-4 py-3 font-semibold outline-none focus:border-ocean"
            />
            <datalist id="category-options">
              {editableCategories.map((category) => (
                <option key={category} value={category} />
              ))}
            </datalist>
          </label>
        </div>

        <label className="grid gap-2 text-sm font-extrabold text-ink">
          Cover Image
          <div className="relative overflow-hidden rounded-[1.5rem] border border-dashed border-moss/40 bg-white/60">
            {form.image ? (
              <img src={form.image} alt="Post preview" className="h-52 w-full object-cover sm:h-72" />
            ) : (
              <div className="grid h-52 place-items-center text-center sm:h-72">
                <div>
                  <ImagePlus className="mx-auto mb-3 text-ocean" size={34} />
                  <p className="font-display text-xl font-bold">Upload a cinematic cover</p>
                  <p className="mt-1 text-sm font-semibold text-moss">PNG, JPG, or WEBP</p>
                </div>
              </div>
            )}
            <input
              type="file"
              accept="image/*"
              onChange={handleFile}
              className="absolute inset-0 cursor-pointer opacity-0"
            />
          </div>
        </label>

        <label className="grid gap-2 text-sm font-extrabold text-ink">
          Article Content
          <textarea
            value={form.content}
            onChange={(event) => update('content', event.target.value)}
            rows={compact ? 5 : 8}
            placeholder="Write a crisp article preview or full short-form story..."
            className="resize-none rounded-2xl border border-white bg-white/75 px-4 py-3 font-semibold leading-7 outline-none focus:border-ocean"
          />
        </label>

        <button
          disabled={saving}
          className="inline-flex items-center justify-center gap-2 rounded-2xl bg-ember px-5 py-4 font-extrabold text-white shadow-glow transition hover:-translate-y-0.5 disabled:opacity-60"
        >
          <Save size={18} />
          {saving ? 'Saving...' : post ? 'Save Changes' : 'Publish Post'}
        </button>
      </form>
    </Card>
  );
};
