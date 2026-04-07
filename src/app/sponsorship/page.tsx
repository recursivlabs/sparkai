import PageHero from "@/components/ui/PageHero";
import Link from "next/link";
import {
  Lightbulb,
  FlaskConical,
  GraduationCap,
  Briefcase,
  ArrowRight,
  Building2,
  Users,
  BookOpen,
  Handshake,
} from "lucide-react";

export const metadata = {
  title: "Sponsorship — SPARK AI Network",
  description: "Partner with SDSC's AI consortium to shape the future of enterprise AI.",
};

const SPONSORS = [
  { name: "AEEC", url: "https://americanconsultants.com" },
  { name: "Back Bay Group", url: "https://backbaygroup.com" },
  { name: "Dell Technologies", url: "https://dell.com" },
  { name: "Intel Federal", url: "https://intel.com/government/federal" },
  { name: "LifeVoxel.AI", url: "https://lifevoxel.ai" },
  { name: "Minds", url: "https://minds.com" },
  { name: "Pillsbury LLP", url: "https://pillsburylaw.com" },
  { name: "Solix Technologies", url: "https://solix.com" },
  { name: "1upHealth", url: "https://1up.health" },
];

const BENEFITS = [
  {
    icon: Lightbulb,
    title: "Thought Leadership",
    description:
      "Shape the direction of AI research and policy. Sponsors sit at the table where the future of enterprise AI is defined — contributing to working papers, keynotes, and advisory discussions.",
    color: "text-amber-400",
    bg: "bg-amber-500/10",
  },
  {
    icon: FlaskConical,
    title: "Research & Innovation",
    description:
      "Get early exposure to high-potential research directions before they are published or commercialized. Sponsor-funded studies through the Applied Research Center (ARC) deliver targeted proof-of-concept work.",
    color: "text-blue-400",
    bg: "bg-blue-500/10",
  },
  {
    icon: GraduationCap,
    title: "Access to Talent",
    description:
      "Tap into UCSD and SDSC's interdisciplinary talent pipeline. Mentorship programs, student projects, and recruiting events connect sponsors directly with the next generation of AI practitioners.",
    color: "text-emerald-400",
    bg: "bg-emerald-500/10",
  },
  {
    icon: Briefcase,
    title: "Workforce Development",
    description:
      "Targeted upskilling programs in frontier technical domains — from generative AI to data governance — aligned to real industry needs and delivered by SDSC researchers.",
    color: "text-purple-400",
    bg: "bg-purple-500/10",
  },
];

const STATS = [
  { value: "30+", label: "Member Organizations" },
  { value: "6", label: "Active Research Projects" },
  { value: "50+", label: "Researchers & Advisors" },
  { value: "15+", label: "Events Per Year" },
];

export default function SponsorshipPage() {
  return (
    <>
      <PageHero
        title="Partner With SPARK AI"
        subtitle="Join SDSC's AI consortium — where industry leaders, researchers, and policymakers collaborate to solve the hardest problems in enterprise AI"
        compact
      />

      {/* Impact stats */}
      <section className="py-12 px-4 md:px-6 border-b border-slate-800">
        <div className="container mx-auto max-w-4xl">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {STATS.map((stat) => (
              <div key={stat.label} className="text-center">
                <div className="text-3xl font-bold text-white mb-1">{stat.value}</div>
                <div className="text-xs text-slate-500 uppercase tracking-wider">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Sponsor */}
      <section className="py-20 px-4 md:px-6">
        <div className="container mx-auto max-w-4xl">
          <div className="text-center mb-12">
            <h2 className="text-2xl md:text-3xl font-bold text-white mb-3">
              Why Organizations Partner With Us
            </h2>
            <p className="text-slate-400 max-w-2xl mx-auto">
              SPARK AI bridges the gap between academic research and industry application.
              Sponsors get direct access to SDSC&apos;s world-class research infrastructure and talent.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {BENEFITS.map((b) => (
              <div
                key={b.title}
                className="group p-6 bg-gradient-to-br from-slate-900/90 to-slate-800/50 border border-slate-800 rounded-2xl hover:border-slate-700 transition-all hover:scale-[1.02]"
              >
                <div className={`w-10 h-10 rounded-xl ${b.bg} flex items-center justify-center mb-4`}>
                  <b.icon className={`w-5 h-5 ${b.color}`} />
                </div>
                <h3 className="text-base font-semibold text-white mb-2">{b.title}</h3>
                <p className="text-sm text-slate-400 leading-relaxed">{b.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Membership tiers preview */}
      <section className="py-20 px-4 md:px-6 bg-slate-900">
        <div className="container mx-auto max-w-4xl">
          <div className="text-center mb-12">
            <h2 className="text-2xl md:text-3xl font-bold text-white mb-3">
              Sponsorship Tiers
            </h2>
            <p className="text-slate-400 max-w-2xl mx-auto">
              Two paths to deeper engagement — both include full Community access
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Forum */}
            <div className="relative p-6 bg-slate-800 border border-slate-700 rounded-2xl">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center">
                  <Users className="w-5 h-5 text-blue-400" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white">Executive Forum</h3>
                  <p className="text-xs text-slate-500">For SMBs & .edu partners</p>
                </div>
              </div>
              <ul className="space-y-2.5 mb-6">
                {[
                  "Quarterly executive workshops",
                  "Full research paper access",
                  "Discussion forums with researchers",
                  "Workforce development resources",
                  "Early event registration",
                ].map((item) => (
                  <li key={item} className="flex items-start gap-2 text-sm text-slate-300">
                    <ArrowRight className="w-3.5 h-3.5 text-blue-400 mt-0.5 flex-shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
              <a
                href="mailto:jshort@ucsd.edu?subject=SPARK AI Forum Membership"
                className="inline-flex items-center text-sm text-blue-400 hover:text-blue-300 font-medium transition-colors"
              >
                Learn more <ArrowRight className="w-4 h-4 ml-1" />
              </a>
            </div>

            {/* ARC */}
            <div className="relative p-6 bg-slate-800 border border-purple-500/30 rounded-2xl ring-1 ring-purple-500/10">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl bg-purple-500/10 flex items-center justify-center">
                  <FlaskConical className="w-5 h-5 text-purple-400" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white">Applied Research Center</h3>
                  <p className="text-xs text-slate-500">Sponsored research with SDSC</p>
                </div>
              </div>
              <ul className="space-y-2.5 mb-6">
                {[
                  "All Forum benefits included",
                  "Sponsored research projects",
                  "Proof-of-concept studies",
                  "Direct SDSC researcher collaboration",
                  "Custom AI strategy consulting",
                  "Early access to findings & IP",
                ].map((item) => (
                  <li key={item} className="flex items-start gap-2 text-sm text-slate-300">
                    <ArrowRight className="w-3.5 h-3.5 text-purple-400 mt-0.5 flex-shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
              <a
                href="mailto:jshort@ucsd.edu?subject=ARC Sponsorship Inquiry"
                className="inline-flex items-center text-sm text-purple-400 hover:text-purple-300 font-medium transition-colors"
              >
                Learn more <ArrowRight className="w-4 h-4 ml-1" />
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Current Sponsors */}
      <section className="py-20 px-4 md:px-6">
        <div className="container mx-auto max-w-4xl">
          <div className="text-center mb-10">
            <h2 className="text-2xl md:text-3xl font-bold text-white mb-3">
              Our Sponsors
            </h2>
            <p className="text-slate-400">
              Industry leaders advancing AI research and practice
            </p>
          </div>

          <div className="grid grid-cols-3 md:grid-cols-5 gap-4">
            {SPONSORS.map((s) => (
              <a
                key={s.name}
                href={s.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center h-20 px-4 bg-slate-900 border border-slate-800 rounded-xl text-sm font-medium text-slate-300 hover:text-white hover:border-blue-500/40 hover:bg-slate-800 transition-all"
              >
                {s.name}
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-4 md:px-6">
        <div className="max-w-3xl mx-auto">
          <div className="relative bg-gradient-to-br from-blue-600/20 via-slate-900 to-purple-600/20 border border-slate-700 rounded-2xl p-10 md:p-14 text-center">
            <div className="w-14 h-14 rounded-2xl bg-blue-500/10 flex items-center justify-center mx-auto mb-6">
              <Handshake className="w-7 h-7 text-blue-400" />
            </div>
            <h2 className="text-2xl md:text-3xl font-bold text-white mb-3">
              Ready to Shape the Future of AI?
            </h2>
            <p className="text-slate-400 mb-8 max-w-xl mx-auto">
              Contact SPARK Director James Short to discuss sponsorship opportunities
              and find the right partnership level for your organization.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
              <a
                href="mailto:jshort@ucsd.edu?subject=SPARK AI Sponsorship"
                className="inline-flex items-center h-11 px-8 bg-blue-600 text-white text-sm font-medium rounded-full hover:bg-blue-700 transition-colors"
              >
                Contact James Short
              </a>
              <Link
                href="/auth/register"
                className="inline-flex items-center h-11 px-8 border border-slate-600 text-white text-sm font-medium rounded-full hover:border-slate-400 transition-colors"
              >
                Join SPARK AI Free
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
