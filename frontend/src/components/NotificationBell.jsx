import { Bell, Heart, MessageCircle } from 'lucide-react';
import { useState } from 'react';
import { timeAgo } from '../lib/format.js';
import { useApp } from '../state/AppContext.jsx';

export const NotificationBell = () => {
  const {
    notifications,
    unreadNotifications,
    markNotificationsRead,
    refreshNotifications,
    setActiveView,
    openPost,
  } = useApp();
  const [open, setOpen] = useState(false);

  const toggleOpen = async () => {
    const nextOpen = !open;
    setOpen(nextOpen);
    if (nextOpen) {
      await refreshNotifications();
      if (unreadNotifications > 0) await markNotificationsRead();
    }
  };

  const openNotificationPost = async (notification) => {
    setOpen(false);
    setActiveView('home');
    await openPost(notification.postId);
  };

  return (
    <div className="relative">
      <button
        onClick={toggleOpen}
        className="relative grid h-10 w-10 place-items-center rounded-full border border-white/80 bg-white/75 text-ink shadow-sm transition hover:bg-ink hover:text-white"
        title="Admin notifications"
      >
        <Bell size={18} />
        {unreadNotifications > 0 ? (
          <span className="absolute -right-1 -top-1 grid h-5 min-w-5 place-items-center rounded-full bg-ember px-1 text-[10px] font-black text-white">
            {unreadNotifications > 9 ? '9+' : unreadNotifications}
          </span>
        ) : null}
      </button>

      {open ? (
        <div className="absolute right-0 top-12 z-50 w-[min(22rem,calc(100vw-1.5rem))] overflow-hidden rounded-3xl border border-white/80 bg-[#f8fbf7]/95 shadow-glow backdrop-blur-2xl">
          <div className="border-b border-ink/10 p-4">
            <p className="font-display text-lg font-bold text-ink">Notifications</p>
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-moss">Likes and comments</p>
          </div>

          <div className="max-h-96 overflow-auto p-2 thin-scrollbar">
            {notifications.length ? (
              notifications.map((notification) => {
                const Icon = notification.type === 'comment' ? MessageCircle : Heart;
                return (
                  <button
                    key={notification.id}
                    onClick={() => openNotificationPost(notification)}
                    className={`flex w-full gap-3 rounded-2xl p-3 text-left transition hover:bg-white ${
                      notification.read ? 'bg-transparent' : 'bg-sun/20'
                    }`}
                  >
                    <span className={`mt-1 grid h-9 w-9 shrink-0 place-items-center rounded-2xl ${
                      notification.type === 'comment' ? 'bg-ocean/10 text-ocean' : 'bg-ember/10 text-ember'
                    }`}
                    >
                      <Icon size={17} />
                    </span>
                    <span className="min-w-0">
                      <span className="block text-sm font-extrabold leading-5 text-ink">{notification.message}</span>
                      <span className="mt-1 block truncate text-xs font-bold text-moss">
                        {timeAgo(notification.createdAt)}
                      </span>
                    </span>
                  </button>
                );
              })
            ) : (
              <div className="p-6 text-center">
                <p className="font-display text-lg font-bold text-ink">No notifications yet</p>
                <p className="mt-1 text-sm font-semibold text-moss">Likes and comments will appear here.</p>
              </div>
            )}
          </div>
        </div>
      ) : null}
    </div>
  );
};
