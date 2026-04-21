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
    return post;
  };

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
    const result = await api.likePost(id, nextLiked);
    setPosts((current) => current.map((post) => (post.id === id ? { ...post, likes: result.likes } : post)));
  };

  const addComment = async (id, payload) => {
    const comment = await api.commentPost(id, payload);
    setPosts((current) =>
      current.map((post) => (post.id === id ? { ...post, comments: [comment, ...post.comments] } : post)),
    );
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
    openPost,
    toggleLike,
    addComment,
    createPost,
    updatePost,
    deletePost,
    updateVisibility,
    updateProfile,
    showToast,
    refresh,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export const useApp = () => useContext(AppContext);
