import PageHero from "@/components/ui/PageHero";

export const metadata = {
  title: "Terms of Service — SPARK AI Network",
  description: "SPARK AI Network terms of service.",
};

export default function TermsPage() {
  return (
    <>
      <PageHero title="Terms of Service" subtitle="Terms and conditions for using the SPARK AI Network" compact />

      <section className="py-16 px-4 md:px-6">
        <div className="container mx-auto max-w-3xl prose prose-invert prose-sm prose-slate">
          <p className="text-slate-400 text-sm">Last updated: March 2026</p>

          <h2 className="text-lg font-bold text-white mt-8 mb-3">1. Acceptance of Terms</h2>
          <p className="text-slate-400 text-sm leading-relaxed">
            By accessing or using the SPARK AI Network website and services, you agree to be bound
            by these Terms of Service. If you do not agree, please do not use our services.
          </p>

          <h2 className="text-lg font-bold text-white mt-8 mb-3">2. Membership</h2>
          <p className="text-slate-400 text-sm leading-relaxed">
            SPARK AI offers multiple membership tiers (Community, Executive Forum, Applied Research
            Center). Each tier provides different levels of access to research, events, and
            collaboration opportunities. Paid memberships are subject to the pricing and terms
            presented at the time of purchase.
          </p>

          <h2 className="text-lg font-bold text-white mt-8 mb-3">3. Intellectual Property</h2>
          <p className="text-slate-400 text-sm leading-relaxed">
            All content on the SPARK AI Network, including research papers, presentations, and
            materials, is the property of SPARK AI, SDSC, UC San Diego, or their respective
            authors. You may not reproduce, distribute, or create derivative works without
            explicit permission.
          </p>

          <h2 className="text-lg font-bold text-white mt-8 mb-3">4. User Conduct</h2>
          <p className="text-slate-400 text-sm leading-relaxed">
            You agree to use the platform responsibly and not engage in any activity that could
            harm the network, its members, or its infrastructure. This includes respecting the
            confidentiality of members-only content and discussions.
          </p>

          <h2 className="text-lg font-bold text-white mt-8 mb-3">5. Limitation of Liability</h2>
          <p className="text-slate-400 text-sm leading-relaxed">
            SPARK AI Network and its affiliates shall not be liable for any indirect, incidental,
            or consequential damages arising from your use of the platform or reliance on any
            content provided.
          </p>

          <h2 className="text-lg font-bold text-white mt-8 mb-3">6. Changes to Terms</h2>
          <p className="text-slate-400 text-sm leading-relaxed">
            We reserve the right to modify these terms at any time. Continued use of the platform
            after changes constitutes acceptance of the updated terms.
          </p>

          <h2 className="text-lg font-bold text-white mt-8 mb-3">7. Contact</h2>
          <p className="text-slate-400 text-sm leading-relaxed">
            For questions about these terms, contact SPARK AI Network at{" "}
            <a href="mailto:jshort@ucsd.edu" className="text-blue-400 hover:text-blue-300">
              jshort@ucsd.edu
            </a>.
          </p>
        </div>
      </section>
    </>
  );
}
