import cors from 'cors';
import dotenv from 'dotenv';
import express from 'express';
import { v4 as uuid } from 'uuid';
import { connectDB } from './config/db.js';
import { Post } from './models/Post.js';
import { Profile } from './models/Profile.js';
import { seedDatabase } from './utils/seedDatabase.js';
import { serializePost, serializeProfile } from './utils/serializers.js';

dotenv.config();

const app = express();
const port = process.env.PORT || 4000;

const adminCredentials = {
  email: process.env.ADMIN_EMAIL || 'admin@pulsepress.com',
  password: process.env.ADMIN_PASSWORD || 'admin123',
};
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

app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', service: 'PulsePress MERN API' });
});

app.post('/api/auth/login', async (req, res) => {
  const { email, password } = req.body;

  if (email !== adminCredentials.email || password !== adminCredentials.password) {
    return res.status(401).json({ message: 'Invalid admin email or password.' });
  }

  return res.json({
    token: adminToken,
    role: 'admin',
    profile: await getProfile(),
  });
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
