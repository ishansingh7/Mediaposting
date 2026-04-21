import mongoose from 'mongoose';

const authorSchema = new mongoose.Schema(
  {
    id: String,
    name: String,
    role: String,
    avatar: String,
    cover: String,
    bio: String,
    location: String,
    website: String,
    joined: Date,
  },
  { _id: false },
);

const commentSchema = new mongoose.Schema(
  {
    id: { type: String, required: true },
    name: { type: String, required: true },
    text: { type: String, required: true },
    createdAt: { type: Date, default: Date.now },
  },
  { _id: false },
);

const postSchema = new mongoose.Schema(
  {
    id: { type: String, required: true, unique: true },
    title: { type: String, required: true },
    category: { type: String, required: true },
    image: { type: String, required: true },
    content: { type: String, required: true },
    createdAt: { type: Date, default: Date.now },
    likes: { type: Number, default: 0 },
    views: { type: Number, default: 0 },
    hidden: { type: Boolean, default: false },
    author: { type: authorSchema, required: true },
    comments: { type: [commentSchema], default: [] },
  },
  {
    timestamps: true,
    versionKey: false,
  },
);

export const Post = mongoose.model('Post', postSchema);
