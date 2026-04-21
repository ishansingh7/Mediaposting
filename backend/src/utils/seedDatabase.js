import { Post } from '../models/Post.js';
import { Profile } from '../models/Profile.js';
import { adminProfile, posts } from '../seed.js';

export const seedDatabase = async () => {
  const [profileCount, postCount] = await Promise.all([Profile.countDocuments(), Post.countDocuments()]);

  if (profileCount === 0) {
    await Profile.create(adminProfile);
  }

  if (postCount === 0) {
    await Post.insertMany(posts);
  }
};
