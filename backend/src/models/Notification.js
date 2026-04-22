import mongoose from 'mongoose';

const notificationSchema = new mongoose.Schema(
  {
    id: { type: String, required: true, unique: true },
    type: { type: String, enum: ['like', 'comment'], required: true },
    postId: { type: String, required: true },
    postTitle: { type: String, required: true },
    actorName: { type: String, default: 'A visitor' },
    message: { type: String, required: true },
    read: { type: Boolean, default: false },
  },
  {
    timestamps: true,
    versionKey: false,
  },
);

export const Notification = mongoose.model('Notification', notificationSchema);
