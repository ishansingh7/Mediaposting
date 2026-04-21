import { Layers3 } from 'lucide-react';
import { useApp } from '../state/AppContext.jsx';
import { Card } from './ui.jsx';

export const CategoriesPage = () => {
  const { categories, posts, selectedCategory, setSelectedCategory, setActiveView } = useApp();

  const categoryCards = categories.map((category) => {
    const matchingPosts = category === 'All' ? posts : posts.filter((post) => post.category === category);
    const hero = matchingPosts[0];

    return {
      category,
      count: matchingPosts.length,
      image: hero?.image,
      likes: matchingPosts.reduce((total, post) => total + post.likes, 0),
    };
  });

  return (
    <div className="space-y-5">
      <Card className="p-6">
        <div className="flex items-center gap-3">
          <span className="grid h-12 w-12 place-items-center rounded-2xl bg-ocean/10 text-ocean">
            <Layers3 size={23} />
          </span>
          <div>
            <p className="text-xs font-black uppercase tracking-[0.24em] text-moss">Browse By Topic</p>
            <h1 className="font-display text-4xl font-bold">Categories</h1>
          </div>
        </div>
      </Card>

      <div className="grid gap-4 md:grid-cols-2">
        {categoryCards.map((item) => (
          <button
            key={item.category}
            onClick={() => {
              setSelectedCategory(item.category);
              setActiveView('home');
            }}
            className={`group overflow-hidden rounded-3xl border text-left shadow-card transition-all duration-300 hover:-translate-y-1 hover:shadow-xl ${
              selectedCategory === item.category ? 'border-ink bg-ink text-white' : 'border-white/70 bg-white/72 text-ink'
            }`}
          >
            {item.image ? (
              <img src={item.image} alt="" className="h-44 w-full object-cover transition duration-500 group-hover:scale-105" />
            ) : null}
            <div className="p-5">
              <p className="text-xs font-black uppercase tracking-[0.22em] opacity-70">{item.count} posts</p>
              <h2 className="mt-1 font-display text-3xl font-bold">{item.category}</h2>
              <p className="mt-3 text-sm font-bold opacity-75">{item.likes} total likes across this topic</p>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};
