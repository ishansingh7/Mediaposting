export const adminProfile = {
  id: 'admin-1',
  name: 'Aarav Mehta',
  role: 'Founder & Editor',
  avatar:
    'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=400&q=80',
  cover:
    'https://images.unsplash.com/photo-1497366754035-f200968a6e72?auto=format&fit=crop&w=1800&q=80',
  bio: 'I curate human stories at the edge of technology, travel, design, and culture. PulsePress is where fast ideas become thoughtful conversations.',
  location: 'Mumbai, India',
  website: 'pulsepress.studio',
  joined: '2023-04-12T10:00:00.000Z',
};

export const posts = [
  {
    id: 'post-aurora',
    title: 'Designing Calm Social Feeds for a Noisy Internet',
    category: 'Design',
    image:
      'https://images.unsplash.com/photo-1497366811353-6870744d04b2?auto=format&fit=crop&w=1400&q=80',
    content:
      'The next wave of social platforms will not compete on volume alone. They will win by making attention feel respected, conversations feel intentional, and discovery feel cinematic rather than chaotic.',
    createdAt: '2026-04-18T09:45:00.000Z',
    likes: 128,
    views: 1940,
    hidden: false,
    author: adminProfile,
    comments: [
      {
        id: 'comment-1',
        name: 'Mira',
        text: 'This feels like the social product brief every team needs right now.',
        createdAt: '2026-04-18T12:14:00.000Z',
      },
    ],
  },
  {
    id: 'post-neon',
    title: 'AI Workflows That Make Small Teams Feel Enterprise-Scale',
    category: 'Tech',
    image:
      'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=1400&q=80',
    content:
      'Small teams are combining automation, prompt systems, and crisp operating rituals to move with the coordination of much larger organizations without inheriting their complexity.',
    createdAt: '2026-04-17T15:20:00.000Z',
    likes: 214,
    views: 3312,
    hidden: false,
    author: adminProfile,
    comments: [
      {
        id: 'comment-2',
        name: 'Jay',
        text: 'The part about rituals over tools is spot on.',
        createdAt: '2026-04-17T16:42:00.000Z',
      },
      {
        id: 'comment-3',
        name: 'Naina',
        text: 'Would love a follow-up with example workflows.',
        createdAt: '2026-04-17T18:08:00.000Z',
      },
    ],
  },
  {
    id: 'post-monsoon',
    title: 'A Slow Travel Guide to Rain-Washed Coastal Towns',
    category: 'Travel',
    image:
      'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1400&q=80',
    content:
      'The best coastal journeys happen when the itinerary has room to breathe: street-side chai, old bookshops, quiet ferries, and beaches that look better beneath a silver sky.',
    createdAt: '2026-04-16T07:10:00.000Z',
    likes: 89,
    views: 1218,
    hidden: false,
    author: adminProfile,
    comments: [],
  },
  {
    id: 'post-market',
    title: 'What Creators Can Learn From SaaS Dashboards',
    category: 'Business',
    image:
      'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=1400&q=80',
    content:
      'The most durable creator businesses now measure audience trust the way SaaS teams measure retention: with cohorts, feedback loops, and a product mindset.',
    createdAt: '2026-04-14T11:30:00.000Z',
    likes: 167,
    views: 2765,
    hidden: false,
    author: adminProfile,
    comments: [],
  },
  {
    id: 'post-civic',
    title: 'The New Local Newsroom Is Community-Led',
    category: 'News',
    image:
      'https://images.unsplash.com/photo-1504711434969-e33886168f5c?auto=format&fit=crop&w=1400&q=80',
    content:
      'Modern local news can be participatory without becoming messy. The secret is strong editorial framing paired with lightweight social mechanics.',
    createdAt: '2026-04-12T13:00:00.000Z',
    likes: 74,
    views: 982,
    hidden: false,
    author: adminProfile,
    comments: [],
  },
];
