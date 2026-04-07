import PageHero from "@/components/ui/PageHero";

export const metadata = {
  title: "Privacy Policy — SPARK AI Network",
  description: "SPARK AI Network privacy policy.",
};

export default function PrivacyPage() {
  return (
    <>
      <PageHero title="Privacy Policy" subtitle="How we collect, use, and protect your information" compact />

      <section className="py-16 px-4 md:px-6">
        <div className="container mx-auto max-w-3xl prose prose-invert prose-sm prose-slate">
          <p className="text-slate-400 text-sm">Last updated: March 2026</p>

          <h2 className="text-lg font-bold text-white mt-8 mb-3">1. Information We Collect</h2>
          <p className="text-slate-400 text-sm leading-relaxed">
            When you create an account or interact with SPARK AI Network, we may collect your name,
            email address, organization, job title, and other information you voluntarily provide.
            We also collect usage data such as pages visited and interactions with the platform.
          </p>

          <h2 className="text-lg font-bold text-white mt-8 mb-3">2. How We Use Your Information</h2>
          <p className="text-slate-400 text-sm leading-relaxed">
            We use your information to provide and improve our services, communicate with you about
            events and research, manage your membership, and send relevant updates. We do not sell
            your personal information to third parties.
          </p>

          <h2 className="text-lg font-bold text-white mt-8 mb-3">3. Data Security</h2>
          <p className="text-slate-400 text-sm leading-relaxed">
            We implement appropriate technical and organizational measures to protect your personal
            information against unauthorized access, alteration, disclosure, or destruction.
          </p>

          <h2 className="text-lg font-bold text-white mt-8 mb-3">4. Cookies</h2>
          <p className="text-slate-400 text-sm leading-relaxed">
            We use essential cookies to maintain your session and preferences. We do not use
            third-party tracking cookies for advertising purposes.
          </p>

          <h2 className="text-lg font-bold text-white mt-8 mb-3">5. Your Rights</h2>
          <p className="text-slate-400 text-sm leading-relaxed">
            You may request access to, correction of, or deletion of your personal information at
            any time by contacting us at{" "}
            <a href="mailto:jshort@ucsd.edu" className="text-blue-400 hover:text-blue-300">
              jshort@ucsd.edu
            </a>.
          </p>

          <h2 className="text-lg font-bold text-white mt-8 mb-3">6. Contact</h2>
          <p className="text-slate-400 text-sm leading-relaxed">
            For questions about this privacy policy, contact SPARK AI Network at{" "}
            <a href="mailto:jshort@ucsd.edu" className="text-blue-400 hover:text-blue-300">
              jshort@ucsd.edu
            </a>.
          </p>
        </div>
      </section>
    </>
  );
}
