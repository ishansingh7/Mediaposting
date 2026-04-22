import { Post } from '../models/Post.js';
import { Profile } from '../models/Profile.js';
import { AdminAccount } from '../models/AdminAccount.js';
import { adminProfile, posts } from '../seed.js';

export const seedDatabase = async () => {
  const [profileCount, postCount, adminCount] = await Promise.all([
    Profile.countDocuments(),
    Post.countDocuments(),
    AdminAccount.countDocuments(),
  ]);

  if (adminCount === 0) {
    await AdminAccount.create({
      email: process.env.ADMIN_EMAIL || 'admin@pulsepress.com',
      password: process.env.ADMIN_PASSWORD || 'admin123',
    });
  }

  if (profileCount === 0) {
    await Profile.create(adminProfile);
  }

  if (postCount === 0) {
    await Post.insertMany(posts);
  }
};
