import { Send } from 'lucide-react';
import { useState } from 'react';
import { timeAgo } from '../lib/format.js';
import { useApp } from '../state/AppContext.jsx';

export const CommentBox = ({ post }) => {
  const { addComment, showToast } = useApp();
  const [name, setName] = useState('');
  const [text, setText] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const submit = async (event) => {
    event.preventDefault();
    if (!name.trim() || !text.trim()) {
      showToast('Please add your name and comment.');
      return;
    }

    setSubmitting(true);
    await addComment(post.id, { name: name.trim(), text: text.trim() });
    setText('');
    setSubmitting(false);
  };

  return (
    <div className="mt-4 border-t border-ink/10 pt-4">
      <form onSubmit={submit} className="grid gap-3 sm:grid-cols-[180px_1fr_auto]">
        <input
          value={name}
          onChange={(event) => setName(event.target.value)}
          placeholder="Your name"
          className="rounded-2xl border border-white bg-white/75 px-4 py-3 text-sm font-semibold outline-none transition focus:border-ocean"
        />
        <input
          value={text}
          onChange={(event) => setText(event.target.value)}
          placeholder="Write a thoughtful comment..."
          className="rounded-2xl border border-white bg-white/75 px-4 py-3 text-sm font-semibold outline-none transition focus:border-ocean"
        />
        <button
          disabled={submitting}
          className="inline-flex items-center justify-center gap-2 rounded-2xl bg-ink px-5 py-3 text-sm font-extrabold text-white transition hover:-translate-y-0.5 disabled:opacity-60"
        >
          <Send size={16} />
          Post
        </button>
      </form>
      <div className="mt-4 space-y-3">
        {post.comments.length ? (
          post.comments.map((comment) => (
            <div key={comment.id} className="rounded-2xl bg-white/65 p-3">
              <div className="flex items-center justify-between gap-3">
                <p className="font-bold text-ink">{comment.name}</p>
                <span className="text-xs font-bold text-moss">{timeAgo(comment.createdAt)}</span>
              </div>
              <p className="mt-1 text-sm leading-6 text-ink/78">{comment.text}</p>
            </div>
          ))
        ) : (
          <p className="rounded-2xl bg-white/55 p-4 text-sm font-semibold text-moss">
            Be the first to start the conversation.
          </p>
        )}
      </div>
    </div>
  );
};
