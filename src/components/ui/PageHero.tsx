interface PageHeroProps {
  title: string;
  subtitle?: string;
  compact?: boolean;
}

export default function PageHero({ title, subtitle, compact }: PageHeroProps) {
  return (
    <section
      className={`relative ${compact ? "py-20" : "py-32"} bg-cover bg-center`}
      style={{
        backgroundImage: "url('/images/hero-bg.jpg')",
      }}
    >
      <div className="absolute inset-0 bg-black/70" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(0,0,0,0.3)_0%,rgba(0,0,0,0.7)_70%)]" />
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4 tracking-tight">
          {title}
        </h1>
        {subtitle && (
          <p className="text-lg md:text-xl text-slate-200 max-w-2xl mx-auto min-h-[3.5rem]">
            {subtitle}
          </p>
        )}
      </div>
    </section>
  );
}
