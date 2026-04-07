import Link from "next/link";
import Image from "next/image";
import { ChevronDown, Building2, FlaskConical, Heart, Landmark, Sparkles } from "lucide-react";

const THEMES = [
  {
    icon: Building2,
    label: "Business & Industry",
    title: "AI Means Business Opportunity",
    description:
      "The promise of AI is the digitalization of industry. What electrification, assembly lines, operations research and finance meant to labor, production and capital in the 1900s. The risks of AI are it cannot be avoided, you can't fall behind, and to get it right may take a decade.",
    color: "blue",
  },
  {
    icon: FlaskConical,
    label: "Innovation & Research",
    title: "AI Means Technology Leadership",
    description:
      "The full scope and impact of AI will evolve over time — through trial and error. The challenge lies in the fact that much of AI's progress will not be directly visible, taking place within competing nation states, national labs, science-driven industry, and embedded in complex organizational processes.",
    color: "purple",
  },
  {
    icon: Heart,
    label: "Health & Wellness",
    title: "AI Means Better Healthcare",
    description:
      "Arguably, the most critical AI use case is healthcare. From advancing biomedical research to improving access to healthcare professionals, AI's promise spans our understanding of diseases, drug development, clinical diagnosis, and the shift from prescriptive to preventative care.",
    color: "green",
  },
  {
    icon: Landmark,
    label: "Public Service",
    title: "AI Means More Responsive Government",
    description:
      "AI has the potential to make government more responsive by streamlining decision-making, improving citizen engagement and enhancing civic trust. By making data-driven, evidence-based policies, AI's promise is to reduce political biases, human error and administrative inefficiencies.",
    color: "cyan",
  },
  {
    icon: Sparkles,
    label: "Human Potential",
    title: "AI Means a Better Life",
    description:
      "AI holds the promise of expanding human potential — from enabling access to education, health, and economic opportunity, to supporting personal growth and meaningful engagement. The better life it offers depends on the values we embed in its design and the choices we make living with it.",
    color: "pink",
  },
];

const COLOR_MAP: Record<string, { card: string; icon: string }> = {
  blue: { card: "border-blue-500/20 hover:border-blue-500/40", icon: "bg-blue-500/10 text-blue-400" },
  purple: { card: "border-purple-500/20 hover:border-purple-500/40", icon: "bg-purple-500/10 text-purple-400" },
  green: { card: "border-green-500/20 hover:border-green-500/40", icon: "bg-green-500/10 text-green-400" },
  cyan: { card: "border-cyan-500/20 hover:border-cyan-500/40", icon: "bg-cyan-500/10 text-cyan-400" },
  pink: { card: "border-pink-500/20 hover:border-pink-500/40", icon: "bg-pink-500/10 text-pink-400" },
};

const PARTNER_LOGOS = [
  "Dell Technologies",
  "Intel Federal",
  "JP Morgan Chase",
  "IBM",
  "Citigroup",
  "Solix Technologies",
  "Thoughtworks",
  "Pillsbury LLP",
  "UC San Diego",
  "SDSC",
];

export default function HomePage() {
  return (
    <>
      {/* Hero */}
      <section className="relative w-full h-[90vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0">
          <Image
            src="/images/hero-bg.jpg"
            alt="Urban Pedestrian Crossing"
            fill
            className="object-cover brightness-75"
            priority
          />
        </div>
        <div className="absolute inset-0 bg-black/40" />
        <div className="absolute inset-0 bg-[length:60px_60px] bg-[image:linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] opacity-20" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(0,0,0,0.4)_0%,rgba(0,0,0,0.8)_65%)]" />

        <div className="container relative z-10 px-4 md:px-6">
          <div className="flex flex-col items-center text-center space-y-8">
            <h1 className="text-5xl md:text-7xl font-bold tracking-tighter text-white max-w-4xl">
              What Does AI Mean to You?
            </h1>
            <p className="text-xl md:text-2xl text-slate-300 max-w-2xl">
              AI is a journey you can&apos;t take alone. And you can&apos;t fall behind.
            </p>
            <div className="pt-4">
              <Link
                href="/auth/register"
                className="inline-flex items-center h-11 px-8 bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-sm font-medium rounded-full hover:from-blue-500 hover:to-indigo-500 transition-all shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40"
              >
                Join SPARK AI
              </Link>
            </div>
          </div>
        </div>

        <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-black to-transparent" />
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
          <ChevronDown className="w-6 h-6 text-white opacity-70" />
        </div>
      </section>

      {/* Partner credibility bar */}
      <section className="py-8 px-4 md:px-6 border-b border-slate-800/50">
        <div className="container mx-auto max-w-5xl">
          <div className="flex flex-wrap items-center justify-center gap-x-8 gap-y-3">
            <span className="text-[10px] text-slate-600 uppercase tracking-widest">Members from</span>
            {PARTNER_LOGOS.map((name) => (
              <span key={name} className="text-xs text-slate-500 font-medium">
                {name}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* Themes — expanded with descriptions */}
      <section className="py-24 px-4 md:px-6">
        <div className="container mx-auto max-w-4xl">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-white mb-4">
              What Does AI Mean To You?
            </h2>
            <div className="w-24 h-1 bg-gradient-to-r from-blue-400 to-purple-400 mx-auto mb-6" />
            <p className="text-lg text-slate-400 max-w-2xl mx-auto">
              Explore how AI is transforming every aspect of our world
            </p>
          </div>

          <div className="space-y-5">
            {THEMES.map((t) => {
              const colors = COLOR_MAP[t.color];
              return (
                <div
                  key={t.label}
                  className={`group relative p-6 md:p-8 rounded-2xl border bg-gradient-to-br from-slate-900/90 to-slate-800/50 transition-all duration-300 hover:scale-[1.01] ${colors.card}`}
                >
                  <div className="flex items-start gap-5">
                    <div className={`w-11 h-11 rounded-xl ${colors.icon} flex items-center justify-center flex-shrink-0 mt-1`}>
                      <t.icon className="w-5 h-5" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <span className="text-[10px] uppercase tracking-wider text-slate-500">{t.label}</span>
                      <h3 className="text-xl font-bold text-white mt-1 mb-3">{t.title}</h3>
                      <p className="text-sm text-slate-400 leading-relaxed">{t.description}</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="text-center mt-10">
            <Link href="/about" className="text-sm text-blue-400 hover:text-blue-300 transition-colors">
              Learn more about SPARK AI &rarr;
            </Link>
          </div>
        </div>
      </section>

      {/* Vision */}
      <section className="py-24 px-4 md:px-6 bg-slate-900">
        <div className="container mx-auto max-w-3xl text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-3 tracking-tight">Living With AI</h2>
          <div className="w-24 h-1 bg-gradient-to-r from-blue-400 to-purple-400 mx-auto mb-8" />
          <p className="text-lg text-slate-300 leading-relaxed mb-10 max-w-2xl mx-auto">
            SPARK AI&apos;s vision is to develop innovative and practical solutions for how
            people and organizations create, consume, and interact through the power of AI,
            amplifying their impact on how we live, work and connect with the world.
          </p>
          <Link
            href="/auth/register"
            className="inline-flex items-center h-11 px-8 bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-sm font-medium rounded-full hover:from-blue-500 hover:to-indigo-500 transition-all shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40"
          >
            Join SPARK AI
          </Link>
        </div>
      </section>
    </>
  );
}
