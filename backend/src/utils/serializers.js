const toPlain = (document) => document?.toObject?.() || document;

export const serializeProfile = (profile) => {
  if (!profile) return null;
  const plain = toPlain(profile);
  return {
    id: plain.id,
    name: plain.name,
    role: plain.role,
    avatar: plain.avatar,
    cover: plain.cover,
    bio: plain.bio,
    location: plain.location,
    website: plain.website,
    joined: plain.joined,
  };
};

export const serializePost = (post) => {
  if (!post) return null;
  const plain = toPlain(post);
  return {
    id: plain.id,
    title: plain.title,
    category: plain.category,
    image: plain.image,
    content: plain.content,
    createdAt: plain.createdAt,
    likes: plain.likes,
    views: plain.views,
    hidden: plain.hidden,
    author: serializeProfile(plain.author),
    comments: [...(plain.comments || [])].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)),
  };
};
