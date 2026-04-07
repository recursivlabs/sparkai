import PageHero from "@/components/ui/PageHero";
import Link from "next/link";

export const metadata = {
  title: "About — SPARK AI Network",
  description: "SDSC's industry-focused AI Consortium driving innovation, strategy, and trustworthy AI governance.",
};

export default function AboutPage() {
  return (
    <>
      <PageHero
        title="About SPARK AI"
        subtitle="SDSC's industry-focused AI Consortium driving innovation, strategy, and trustworthy AI governance"
        compact
      />

      {/* Mission + Program */}
      <section className="py-16 px-4 md:px-6">
        <div className="container mx-auto max-w-4xl grid grid-cols-1 md:grid-cols-2 gap-12">
          <div>
            <h2 className="text-2xl font-bold text-white mb-2">Our Mission</h2>
            <div className="w-16 h-0.5 bg-blue-600 mb-4" />
            <p className="text-sm text-slate-400 leading-relaxed">
              Interdisciplinary AI research draws inspiration from many fields of science and
              management. SPARK&apos;s mission is to advance AI knowledge, strategy and practice to
              achieve business success and competitive advantage, and to influence the development
              of modern, transparent and trustworthy regulatory policy, implementation and
              corporate governance.
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-bold text-white mb-2">Our Program</h2>
            <div className="w-16 h-0.5 bg-blue-600 mb-4" />
            <div className="space-y-4">
              <div>
                <h3 className="text-sm font-semibold text-blue-400 mb-1">Executive Forum</h3>
                <p className="text-sm text-slate-400 leading-relaxed">
                  Workshops and discussion forums on critical AI topic areas, AI-focused events,
                  and connections between Consortium members in areas of common interest.
                </p>
              </div>
              <div>
                <h3 className="text-sm font-semibold text-blue-400 mb-1">Applied Research Center (ARC)</h3>
                <p className="text-sm text-slate-400 leading-relaxed">
                  Future-oriented research, project development, and educational initiatives with
                  industry and academic partners. Work begins with early-stage, proof-of-concept
                  studies that evolve into formal, scalable research designs.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Our Story */}
      <section className="py-16 px-4 md:px-6 bg-slate-900">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-2xl font-bold text-white mb-2">Our Story</h2>
          <div className="w-16 h-0.5 bg-blue-600 mx-auto mb-6" />
          <div className="space-y-4 text-sm text-slate-400 leading-relaxed">
            <p>
              SPARK AI was founded in 2024 to address the complex challenges of AI
              implementation through interdisciplinary collaboration.
            </p>
            <p>
              Hosted at the San Diego Supercomputer Center (SDSC), SPARK AI unites AI
              researchers and industry leaders to create a unique ecosystem for innovation and
              thought leadership.
            </p>
            <p>
              Our consortium brings together AI experts, data professionals, managers, and
              academic researchers, united by a common goal: ensuring AI creates sustainable
              value for businesses while benefiting society.
            </p>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 px-4 md:px-6">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-2xl font-bold text-white mb-3">Get Involved</h2>
          <p className="text-slate-400 text-sm mb-6">
            Join SPARK AI to collaborate on research, attend events, and connect with AI leaders.
          </p>
          <Link
            href="/auth"
            className="inline-flex items-center h-10 px-8 bg-blue-600 text-white text-sm font-medium rounded-full hover:bg-blue-700 transition-colors"
          >
            Join SPARK AI
          </Link>
        </div>
      </section>
    </>
  );
}
