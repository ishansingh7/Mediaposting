/* eslint-disable react-refresh/only-export-components */
import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { api } from '../lib/api';

const AppContext = createContext(null);

const getLikedPosts = () => {
  try {
    return new Set(JSON.parse(localStorage.getItem('liked-posts') || '[]'));
  } catch {
    return new Set();
  }
};

export const AppProvider = ({ children }) => {
  const [adminToken, setAdminToken] = useState(() => localStorage.getItem('admin-token') || '');
  const [role, setRole] = useState(() => (localStorage.getItem('admin-token') ? 'admin' : 'visitor'));
  const [posts, setPosts] = useState([]);
  const [profile, setProfile] = useState(null);
  const [analytics, setAnalytics] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [activeView, setActiveView] = useState('home');
  const [loading, setLoading] = useState(true);
  const [likedPosts, setLikedPosts] = useState(getLikedPosts);
  const [toast, setToast] = useState('');
  const [selectedPost, setSelectedPost] = useState(null);
  const [notifications, setNotifications] = useState([]);
  const [unreadNotifications, setUnreadNotifications] = useState(0);
  const [lastNotificationId, setLastNotificationId] = useState('');

  const refresh = useCallback(async (token = adminToken) => {
    setLoading(true);
    const data = await api.bootstrap(token);
    setPosts(data.posts);
    setProfile(data.profile);
    setAnalytics(data.analytics);
    setLoading(false);
  }, [adminToken]);

  useEffect(() => {
    refresh(adminToken).catch((error) => {
      setToast(error.message);
      if (adminToken) {
        localStorage.removeItem('admin-token');
        setAdminToken('');
        setRole('visitor');
      }
      setLoading(false);
    });
  }, [adminToken, refresh]);

  useEffect(() => {
    localStorage.setItem('liked-posts', JSON.stringify([...likedPosts]));
  }, [likedPosts]);

  const refreshNotifications = useCallback(async () => {
    if (role !== 'admin' || !adminToken) return;
    const data = await api.getNotifications(adminToken);
    const nextNotifications = data.notifications || [];
    setNotifications(nextNotifications);
    setUnreadNotifications(data.unreadCount || 0);
    setLastNotificationId((current) => current || nextNotifications[0]?.id || '');
  }, [adminToken, role]);

  useEffect(() => {
    refreshNotifications().catch(() => {});
  }, [refreshNotifications]);

  useEffect(() => {
    if (role === 'admin' && adminToken) {
      api.getNotifications(adminToken)
        .then((data) => {
          const nextNotifications = data.notifications || [];
          setNotifications(nextNotifications);
          setUnreadNotifications(data.unreadCount || 0);
          setLastNotificationId(nextNotifications[0]?.id || '');
        })
        .catch(() => {});
    }
  }, [adminToken, role]);

  useEffect(() => {
    if (role !== 'admin' || !adminToken) return undefined;

    const pollNotifications = async () => {
      const data = await api.getNotifications(adminToken);
      const nextNotifications = data.notifications || [];
      const newestId = nextNotifications[0]?.id || '';

      setNotifications(nextNotifications);
      setUnreadNotifications(data.unreadCount || 0);
      setLastNotificationId((current) => {
        if (current && newestId && newestId !== current) {
          showToast('New like or comment received.');
        }
        return newestId || current;
      });
    };

    const intervalId = window.setInterval(() => {
      pollNotifications().catch(() => {});
    }, 4000);

    return () => window.clearInterval(intervalId);
  }, [adminToken, role]);

  const showToast = (message) => {
    setToast(message);
    window.setTimeout(() => setToast(''), 2800);
  };

  const loginAdmin = async (payload) => {
    const session = await api.login(payload);
    localStorage.setItem('admin-token', session.token);
    setAdminToken(session.token);
    setRole('admin');
    setProfile(session.profile);
    setActiveView('dashboard');
    showToast('Admin login successful.');
    return session;
  };

  const logoutAdmin = () => {
    localStorage.removeItem('admin-token');
    setAdminToken('');
    setRole('visitor');
    setNotifications([]);
    setUnreadNotifications(0);
    setLastNotificationId('');
    setActiveView('home');
    showToast('Logged out. Visitor mode is active.');
  };

  const requireAdminAction = () => {
    if (role !== 'admin' || !adminToken) {
      setActiveView('login');
      showToast('Please login as admin first.');
      return false;
    }
    return true;
  };

  const visiblePosts = useMemo(() => {
    const sorted = [...posts].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    if (selectedCategory === 'All') return sorted;
    return sorted.filter((post) => post.category === selectedCategory);
  }, [posts, selectedCategory]);

  const categories = useMemo(() => {
    return ['All', ...new Set(posts.map((post) => post.category))];
  }, [posts]);

  const mostLiked = useMemo(() => [...posts].sort((a, b) => b.likes - a.likes).slice(0, 4), [posts]);
  const mostViewed = useMemo(() => [...posts].sort((a, b) => b.views - a.views).slice(0, 4), [posts]);
  const trending = useMemo(() => {
    return [...posts]
      .sort((a, b) => b.likes * 2 + b.views / 25 + b.comments.length * 8 - (a.likes * 2 + a.views / 25 + a.comments.length * 8))
      .slice(0, 4);
  }, [posts]);

  const openPost = async (id) => {
    const post = await api.openPost(id, adminToken);
    setPosts((current) => current.map((item) => (item.id === id ? post : item)));
    setSelectedPost(post);
    return post;
  };

  const closePost = () => setSelectedPost(null);

  const toggleLike = async (id) => {
    const nextLiked = !likedPosts.has(id);
    setLikedPosts((current) => {
      const updated = new Set(current);
      if (nextLiked) updated.add(id);
      else updated.delete(id);
      return updated;
    });
    setPosts((current) =>
      current.map((post) =>
        post.id === id ? { ...post, likes: Math.max(0, post.likes + (nextLiked ? 1 : -1)) } : post,
      ),
    );
    const result = await api.likePost(id, nextLiked, role === 'admin' ? profile?.name : 'A visitor');
    setPosts((current) => current.map((post) => (post.id === id ? { ...post, likes: result.likes } : post)));
    setSelectedPost((current) => (current?.id === id ? { ...current, likes: result.likes } : current));
    refreshNotifications().catch(() => {});
  };

  const addComment = async (id, payload) => {
    const comment = await api.commentPost(id, payload);
    setPosts((current) =>
      current.map((post) => (post.id === id ? { ...post, comments: [comment, ...post.comments] } : post)),
    );
    setSelectedPost((current) =>
      current?.id === id ? { ...current, comments: [comment, ...current.comments] } : current,
    );
    refreshNotifications().catch(() => {});
  };

  const markNotificationsRead = async () => {
    if (!requireAdminAction()) return;
    await api.markNotificationsRead(adminToken);
    setUnreadNotifications(0);
    setNotifications((current) => current.map((notification) => ({ ...notification, read: true })));
  };

  const createPost = async (payload) => {
    if (!requireAdminAction()) return;
    const post = await api.createPost(adminToken, payload);
    setPosts((current) => [post, ...current]);
    showToast('Post published successfully.');
    setActiveView('home');
  };

  const updatePost = async (id, payload) => {
    if (!requireAdminAction()) return;
    const post = await api.updatePost(adminToken, id, payload);
    setPosts((current) => current.map((item) => (item.id === id ? post : item)));
    showToast('Post updated.');
  };

  const deletePost = async (id) => {
    if (!requireAdminAction()) return;
    await api.deletePost(adminToken, id);
    setPosts((current) => current.filter((post) => post.id !== id));
    showToast('Post deleted.');
  };

  const updateVisibility = async (id, hidden) => {
    if (!requireAdminAction()) return;
    const post = await api.updateVisibility(adminToken, id, hidden);
    setPosts((current) => current.map((item) => (item.id === id ? post : item)));
    showToast(hidden ? 'Post hidden from visitors.' : 'Post is visible again.');
  };

  const updateProfile = async (payload) => {
    if (!requireAdminAction()) return;
    const updated = await api.updateProfile(adminToken, payload);
    setProfile(updated);
    setPosts((current) => current.map((post) => ({ ...post, author: updated })));
    showToast('Profile updated.');
  };

  const getAdminAccount = async () => {
    if (!requireAdminAction()) return null;
    return api.getAdminAccount(adminToken);
  };

  const updateAdminAccount = async (payload) => {
    if (!requireAdminAction()) return null;
    const account = await api.updateAdminAccount(adminToken, payload);
    showToast('Admin login details updated.');
    return account;
  };

  const createAdminAccount = async (payload) => {
    if (!requireAdminAction()) return null;
    const account = await api.createAdminAccount(adminToken, payload);
    showToast('New admin login added.');
    return account;
  };

  const deleteAdminAccount = async (email, payload) => {
    if (!requireAdminAction()) return null;
    await api.deleteAdminAccount(adminToken, email, payload);
    showToast('Admin login removed.');
    return true;
  };

  const value = {
    role,
    adminToken,
    loginAdmin,
    logoutAdmin,
    posts,
    visiblePosts,
    profile,
    analytics,
    categories,
    selectedCategory,
    setSelectedCategory,
    activeView,
    setActiveView,
    loading,
    likedPosts,
    mostLiked,
    mostViewed,
    trending,
    toast,
    selectedPost,
    notifications,
    unreadNotifications,
    refreshNotifications,
    markNotificationsRead,
    openPost,
    closePost,
    toggleLike,
    addComment,
    createPost,
    updatePost,
    deletePost,
    updateVisibility,
    updateProfile,
    getAdminAccount,
    updateAdminAccount,
    createAdminAccount,
    deleteAdminAccount,
    showToast,
    refresh,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export const useApp = () => useContext(AppContext);
