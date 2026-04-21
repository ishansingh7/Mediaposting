export const Card = ({ children, className = '' }) => (
  <div className={`glass rounded-3xl shadow-card transition-all duration-300 ${className}`}>{children}</div>
);

export const PillButton = ({ children, active = false, className = '', ...props }) => (
  <button
    className={`rounded-full px-4 py-2 text-sm font-bold transition-all duration-300 ${
      active ? 'bg-ink text-white shadow-glow' : 'bg-white/75 text-ink hover:bg-ink hover:text-white'
    } ${className}`}
    {...props}
  >
    {children}
  </button>
);

export const Stat = ({ label, value, icon: Icon }) => (
  <div className="rounded-3xl border border-white/70 bg-white/65 p-4 shadow-sm">
    <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-2xl bg-mist text-ocean">
      <Icon size={19} />
    </div>
    <p className="font-display text-2xl font-bold text-ink">{value}</p>
    <p className="text-xs font-bold uppercase tracking-[0.2em] text-moss">{label}</p>
  </div>
);

export const SkeletonFeed = () => (
  <div className="space-y-5">
    {[1, 2, 3].map((item) => (
      <Card key={item} className="overflow-hidden p-4">
        <div className="animate-pulse space-y-4">
          <div className="flex items-center gap-3">
            <div className="h-12 w-12 rounded-full bg-mist" />
            <div className="space-y-2">
              <div className="h-3 w-32 rounded bg-mist" />
              <div className="h-3 w-20 rounded bg-mist" />
            </div>
          </div>
          <div className="h-64 rounded-3xl bg-mist" />
          <div className="h-5 w-3/4 rounded bg-mist" />
          <div className="h-4 w-full rounded bg-mist" />
        </div>
      </Card>
    ))}
  </div>
);
