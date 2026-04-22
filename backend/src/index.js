import cors from 'cors';
import dotenv from 'dotenv';
import express from 'express';
import { v4 as uuid } from 'uuid';
import { connectDB } from './config/db.js';
import { AdminAccount } from './models/AdminAccount.js';
import { Notification } from './models/Notification.js';
import { Post } from './models/Post.js';
import { Profile } from './models/Profile.js';
import { seedDatabase } from './utils/seedDatabase.js';
import { serializePost, serializeProfile } from './utils/serializers.js';

dotenv.config();

const app = express();
const port = process.env.PORT || 4000;

const adminToken = process.env.ADMIN_TOKEN || 'pulsepress-local-admin-token';

app.use(cors());
app.use(express.json({ limit: '12mb' }));

const isAdmin = (req) => req.header('x-admin-token') === adminToken;

const requireAdmin = (req, res, next) => {
  if (!isAdmin(req)) {
    return res.status(403).json({ message: 'Admin access required.' });
  }
  return next();
};

const getProfile = async () => {
  const profile = await Profile.findOne().lean();
  return serializeProfile(profile);
};

const getPostQuery = (role) => (role === 'admin' ? {} : { hidden: false });

const verifyAdminPassword = async (password) => {
  if (!password) return null;
  return AdminAccount.findOne({ password });
};

const createNotification = async ({ type, post, actorName, message }) => {
  await Notification.create({
    id: uuid(),
    type,
    postId: post.id,
    postTitle: post.title,
    actorName,
    message,
    read: false,
  });
};

app.get('/api/health', (_req, res) => {
  res.json({
    status: 'ok',
    service: 'PulsePress MERN API',
    version: 'multi-admin-accounts',
    routes: [
      'POST /api/auth/login',
      'GET /api/admin/account',
      'PUT /api/admin/account',
      'POST /api/admin/accounts',
      'DELETE /api/admin/accounts/:email',
      'GET /api/admin/notifications',
      'PATCH /api/admin/notifications/read',
    ],
  });
});

app.post('/api/auth/login', async (req, res) => {
  const email = req.body.email?.trim().toLowerCase();
  const { password } = req.body;
  const adminAccount = await AdminAccount.findOne({ email }).lean();

  if (!adminAccount || password !== adminAccount.password) {
    return res.status(401).json({ message: 'Invalid admin email or password.' });
  }

  return res.json({
    token: adminToken,
    role: 'admin',
    profile: await getProfile(),
  });
});

app.get('/api/admin/account', requireAdmin, async (_req, res) => {
  const adminAccounts = await AdminAccount.find().sort({ createdAt: 1 }).lean();
  res.json({
    email: adminAccounts[0]?.email || '',
    accounts: adminAccounts.map((account) => ({
      email: account.email,
      createdAt: account.createdAt,
    })),
  });
});

app.put('/api/admin/account', requireAdmin, async (req, res) => {
  const email = req.body.email?.trim().toLowerCase();
  const { currentPassword, newPassword } = req.body;
  const adminAccount = await AdminAccount.findOne();

  if (!adminAccount) {
    return res.status(404).json({ message: 'Admin account not found.' });
  }

  if (!email) {
    return res.status(400).json({ message: 'Admin email is required.' });
  }

  if (currentPassword !== adminAccount.password) {
    return res.status(401).json({ message: 'Current password is incorrect.' });
  }

  if (email !== adminAccount.email) {
    const existingAccount = await AdminAccount.findOne({ email }).lean();
    if (existingAccount) {
      return res.status(409).json({ message: 'That admin email already exists.' });
    }
  }

  adminAccount.email = email;
  if (newPassword) {
    if (newPassword.length < 6) {
      return res.status(400).json({ message: 'New password must be at least 6 characters.' });
    }
    adminAccount.password = newPassword;
  }

  await adminAccount.save();
  res.json({ email: adminAccount.email });
});

app.post('/api/admin/accounts', requireAdmin, async (req, res) => {
  const email = req.body.email?.trim().toLowerCase();
  const { password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: 'New admin email and password are required.' });
  }

  if (password.length < 6) {
    return res.status(400).json({ message: 'New admin password must be at least 6 characters.' });
  }

  const existingAccount = await AdminAccount.findOne({ email }).lean();
  if (existingAccount) {
    return res.status(409).json({ message: 'That admin email already exists.' });
  }

  const account = await AdminAccount.create({ email, password });
  res.status(201).json({ email: account.email, createdAt: account.createdAt });
});

app.delete('/api/admin/accounts/:email', requireAdmin, async (req, res) => {
  const email = req.params.email?.trim().toLowerCase();
  const { currentPassword } = req.body;

  const authorizedAdmin = await verifyAdminPassword(currentPassword);
  if (!authorizedAdmin) {
    return res.status(401).json({ message: 'Current admin password is incorrect.' });
  }

  const accountCount = await AdminAccount.countDocuments();
  if (accountCount <= 1) {
    return res.status(400).json({ message: 'At least one admin login must remain.' });
  }

  const result = await AdminAccount.deleteOne({ email });
  if (result.deletedCount === 0) {
    return res.status(404).json({ message: 'Admin account not found.' });
  }

  res.status(204).send();
});

app.get('/api/admin/notifications', requireAdmin, async (_req, res) => {
  const notifications = await Notification.find().sort({ createdAt: -1 }).limit(30).lean();
  const unreadCount = await Notification.countDocuments({ read: false });

  res.json({
    unreadCount,
    notifications: notifications.map((notification) => ({
      id: notification.id,
      type: notification.type,
      postId: notification.postId,
      postTitle: notification.postTitle,
      actorName: notification.actorName,
      message: notification.message,
      read: notification.read,
      createdAt: notification.createdAt,
    })),
  });
});

app.patch('/api/admin/notifications/read', requireAdmin, async (_req, res) => {
  await Notification.updateMany({ read: false }, { read: true });
  res.json({ success: true });
});

app.get('/api/bootstrap', async (req, res) => {
  const role = isAdmin(req) ? 'admin' : 'visitor';
  const [profile, rawPosts] = await Promise.all([
    getProfile(),
    Post.find(getPostQuery(role)).sort({ createdAt: -1 }).lean(),
  ]);
  const posts = rawPosts.map(serializePost);
  const categories = [...new Set(posts.map((post) => post.category))].sort();

  res.json({
    profile,
    posts,
    categories,
    analytics: {
      totalLikes: posts.reduce((total, post) => total + post.likes, 0),
      totalViews: posts.reduce((total, post) => total + post.views, 0),
      totalComments: posts.reduce((total, post) => total + post.comments.length, 0),
      hiddenPosts: await Post.countDocuments({ hidden: true }),
    },
  });
});

app.get('/api/posts/:id', async (req, res) => {
  const role = isAdmin(req) ? 'admin' : 'visitor';
  const post = await Post.findOne({ id: req.params.id, ...getPostQuery(role) });

  if (!post) {
    return res.status(404).json({ message: 'Post not found.' });
  }

  post.views += 1;
  await post.save();
  return res.json(serializePost(post));
});

app.post('/api/posts', requireAdmin, async (req, res) => {
  const { title, category, content, image } = req.body;

  if (!title || !category || !content || !image) {
    return res.status(400).json({ message: 'Title, category, content, and image are required.' });
  }

  const post = await Post.create({
    id: uuid(),
    title,
    category,
    content,
    image,
    createdAt: new Date(),
    likes: 0,
    views: 0,
    hidden: false,
    author: await getProfile(),
    comments: [],
  });

  return res.status(201).json(serializePost(post));
});

app.put('/api/posts/:id', requireAdmin, async (req, res) => {
  const { title, category, content, image } = req.body;
  const post = await Post.findOneAndUpdate(
    { id: req.params.id },
    {
      ...(title !== undefined ? { title } : {}),
      ...(category !== undefined ? { category } : {}),
      ...(content !== undefined ? { content } : {}),
      ...(image !== undefined ? { image } : {}),
    },
    { new: true },
  );

  if (!post) return res.status(404).json({ message: 'Post not found.' });
  return res.json(serializePost(post));
});

app.patch('/api/posts/:id/visibility', requireAdmin, async (req, res) => {
  const post = await Post.findOneAndUpdate(
    { id: req.params.id },
    { hidden: Boolean(req.body.hidden) },
    { new: true },
  );

  if (!post) return res.status(404).json({ message: 'Post not found.' });
  return res.json(serializePost(post));
});

app.delete('/api/posts/:id', requireAdmin, async (req, res) => {
  const result = await Post.deleteOne({ id: req.params.id });

  if (result.deletedCount === 0) {
    return res.status(404).json({ message: 'Post not found.' });
  }

  return res.status(204).send();
});

app.post('/api/posts/:id/like', async (req, res) => {
  const liked = Boolean(req.body.liked);
  const actorName = req.body.actorName?.trim() || 'A visitor';
  const post = await Post.findOneAndUpdate(
    { id: req.params.id },
    { $inc: { likes: liked ? 1 : -1 } },
    { new: true },
  );

  if (!post) return res.status(404).json({ message: 'Post not found.' });

  if (post.likes < 0) {
    post.likes = 0;
    await post.save();
  }

  if (liked) {
    await createNotification({
      type: 'like',
      post,
      actorName,
      message: `${actorName} liked "${post.title}".`,
    });
  }

  return res.json({ id: post.id, likes: post.likes, liked });
});

app.post('/api/posts/:id/comments', async (req, res) => {
  const { name, text } = req.body;
  if (!name || !text) {
    return res.status(400).json({ message: 'Name and comment are required.' });
  }

  const comment = {
    id: uuid(),
    name,
    text,
    createdAt: new Date(),
  };
  const post = await Post.findOneAndUpdate(
    { id: req.params.id },
    { $push: { comments: { $each: [comment], $position: 0 } } },
    { new: true },
  );

  if (!post) return res.status(404).json({ message: 'Post not found.' });
  await createNotification({
    type: 'comment',
    post,
    actorName: name,
    message: `${name} commented on "${post.title}".`,
  });
  return res.status(201).json(comment);
});

app.put('/api/profile', requireAdmin, async (req, res) => {
  const profile = await Profile.findOneAndUpdate({}, req.body, {
    new: true,
    upsert: true,
    setDefaultsOnInsert: true,
  });
  const serializedProfile = serializeProfile(profile);

  await Post.updateMany({}, { author: serializedProfile });
  return res.json(serializedProfile);
});

const startServer = async () => {
  await connectDB();
  await seedDatabase();
  app.listen(port, () => {
    console.log(`PulsePress MERN API running on http://localhost:${port}`);
  });
};

startServer();
