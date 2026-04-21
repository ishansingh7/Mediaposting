import { Mail, MapPin, MessageSquare, Phone, Send } from 'lucide-react';
import { useState } from 'react';
import { useApp } from '../state/AppContext.jsx';
import { Card } from './ui.jsx';

export const ContactPage = () => {
  const { showToast } = useApp();
  const [form, setForm] = useState({ name: '', email: '', message: '' });

  const update = (field, value) => setForm((current) => ({ ...current, [field]: value }));

  const submit = (event) => {
    event.preventDefault();
    if (!form.name || !form.email || !form.message) {
      showToast('Please complete all contact fields.');
      return;
    }
    setForm({ name: '', email: '', message: '' });
    showToast('Message sent. The editorial team will respond soon.');
  };

  return (
    <div className="space-y-5">
      <Card className="overflow-hidden p-5">
        <div className="rounded-[1.6rem] bg-ink p-7 text-white">
          <p className="text-xs font-black uppercase tracking-[0.24em] text-sun">Contact</p>
          <h1 className="mt-2 font-display text-4xl font-bold">Talk to the PulsePress editorial team.</h1>
          <p className="mt-3 max-w-2xl text-sm font-medium leading-7 text-white/70">
            Send feedback, partnership ideas, story tips, or support questions directly from this page.
          </p>
        </div>
      </Card>

      <div className="grid gap-5 lg:grid-cols-[1fr_320px]">
        <Card className="p-5">
          <form onSubmit={submit} className="grid gap-4">
            <label className="grid gap-2 text-sm font-extrabold text-ink">
              Name
              <input
                value={form.name}
                onChange={(event) => update('name', event.target.value)}
                className="rounded-2xl border border-white bg-white/75 px-4 py-3 font-semibold outline-none focus:border-ocean"
              />
            </label>
            <label className="grid gap-2 text-sm font-extrabold text-ink">
              Email
              <input
                type="email"
                value={form.email}
                onChange={(event) => update('email', event.target.value)}
                className="rounded-2xl border border-white bg-white/75 px-4 py-3 font-semibold outline-none focus:border-ocean"
              />
            </label>
            <label className="grid gap-2 text-sm font-extrabold text-ink">
              Message
              <textarea
                rows={6}
                value={form.message}
                onChange={(event) => update('message', event.target.value)}
                className="resize-none rounded-2xl border border-white bg-white/75 px-4 py-3 font-semibold leading-7 outline-none focus:border-ocean"
              />
            </label>
            <button className="inline-flex items-center justify-center gap-2 rounded-2xl bg-ember px-5 py-4 font-extrabold text-white shadow-glow transition hover:-translate-y-0.5">
              <Send size={18} />
              Send Message
            </button>
          </form>
        </Card>

        <div className="space-y-4">
          {[
            { icon: Mail, title: 'Email', value: 'hello@sony.com' },
            { icon: Phone, title: 'Phone', value: '+91 98765 43210' },
            { icon: MapPin, title: 'Studio', value: 'kathmandu, Nepal' },
            { icon: MessageSquare, title: 'Response', value: 'Usually within 24 hours' },
          ].map((item) => {
            const Icon = item.icon;
            return (
              <Card key={item.title} className="p-4">
                <div className="flex items-center gap-3">
                  <span className="grid h-11 w-11 place-items-center rounded-2xl bg-mist text-ocean">
                    <Icon size={19} />
                  </span>
                  <div>
                    <p className="text-xs font-black uppercase tracking-[0.2em] text-moss">{item.title}</p>
                    <p className="font-bold text-ink">{item.value}</p>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      </div>
    </div>
  );
};
