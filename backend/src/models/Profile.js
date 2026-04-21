import mongoose from 'mongoose';

const profileSchema = new mongoose.Schema(
  {
    id: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    role: { type: String, required: true },
    avatar: { type: String, required: true },
    cover: { type: String, required: true },
    bio: { type: String, required: true },
    location: { type: String, required: true },
    website: { type: String, required: true },
    joined: { type: Date, required: true },
  },
  {
    timestamps: true,
    versionKey: false,
  },
);

export const Profile = mongoose.model('Profile', profileSchema);
