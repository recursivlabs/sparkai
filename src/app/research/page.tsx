import PageHero from "@/components/ui/PageHero";
import Link from "next/link";
import { FileText, Lock, ArrowRight, FlaskConical, BookOpen, Link2 } from "lucide-react";

export const metadata = {
  title: "Research — SPARK AI Network",
  description: "Research focus areas, projects, publications, and blockchain research from SPARK AI.",
};

const PUBLICATIONS = [
  {
    type: "Point of View",
    title: "Architecting Enterprise AI for Scale, Control, and Competitive Advantage",
    authors: "John Ottman and Suresh Mani, Solix",
    pdfSlug: "enterprise-ai-hype-to-value",
    access: "community" as const,
  },
  {
    type: "Point of View",
    title: "Rethinking Enterprise Storage Architecture for AI-Driven Systems",
    authors: "Barry Rudolph (Spectra) and Christine Telford Teale (IBM)",
    pdfSlug: "storage-architecture-revolution",
    access: "community" as const,
  },
  {
    type: "Working Paper",
    title: "Is AI Governable?",
    authors: "SPARK AI Research Team",
    pdfSlug: "ai-governance-frameworks",
    access: "community" as const,
  },
  {
    type: "Working Paper",
    title: "Agentic AI Data Quality and Zero Trust",
    authors: "SPARK AI Research Team",
    pdfSlug: "zero-trust-data-quality",
    access: "community" as const,
  },
  {
    type: "Working Paper",
    title: "Project ChainWatch: A User-Configurable Blockchain Anomaly Detection System",
    authors: "Samson Qian, Steve Orrin (Intel), Matt Clanton, James Short",
    pdfSlug: "project-chainwatch",
    access: "community" as const,
  },
];

const PROJECTS = [
  { title: "Is AI Governable?", status: "active" as const, access: "community" as const },
  { title: "Project ChainWatch: Blockchain Anomaly Detection", status: "active" as const, access: "community" as const },
  { title: "Agentic AI Data Quality and Zero Trust", status: "active" as const, access: "community" as const },
  { title: "Automating Data Quality Decisions with AI Explainability Weights", status: "active" as const, access: "forum" as const },
  { title: "Revolutionizing Drug Discovery with AI-Driven Semantic Data Engineering", status: "active" as const, access: "forum" as const },
  { title: "Building Intelligent Foundations: Rethinking Data Storage Strategies in the Age of AI", status: "active" as const, access: "forum" as const },
  { title: "Micro-Gains, Macro-Patience: Assessing Agentic AI Productivity", status: "upcoming" as const, access: "community" as const },
  { title: "Will Automation Replace Your Workforce?", status: "upcoming" as const, access: "community" as const },
  { title: "When Expectations Count: Prediction Markets, Expertise, and Forecasting AI Trajectories", status: "upcoming" as const, access: "community" as const },
];

const BLOCKLAB_PAPERS = [
  { title: "A Framework Proposal for Blockchain-Based Scientific Publishing Using Shared Governance", journal: "Frontiers in Blockchain (2019)", url: "https://doi.org/10.3389/fbloc.2019.00019" },
  { title: "Examining the Potential of Blockchain Technology to Meet the Needs of 21st-Century Japanese Health Care", journal: "J. Medical Internet Research (2020)", url: "https://doi.org/10.2196/13649" },
  { title: "Combating Healthcare Fraud and Abuse: A Technology Framework Leveraging Blockchain", journal: "J. Medical Internet Research (2020)", url: "https://doi.org/10.2196/18623" },
  { title: "hOCBS: A privacy-preserving blockchain framework for healthcare data", journal: "Information Processing & Management (2021)", url: "https://doi.org/10.1016/j.ipm.2021.102535" },
  { title: "Establishing a blockchain-enabled Indigenous data sovereignty framework for genomic data", journal: "Cell 185 (2022)" },
  { title: "A Field Test of a Federated Learning/Federated Analytics Blockchain Network in an HPC Environment", journal: "Frontiers in Blockchain (2022)", url: "https://doi.org/10.3389/fbloc.2022.893747" },
];

const FOCUS_AREAS = [
  "AI Technologies",
  "Enterprise AI",
  "Gov AI",
  "Personal AI",
  "Economic Productivity & Workforce",
  "Legal & Regulatory AI",
];

const STATS = [
  { value: "9", label: "Active Projects" },
  { value: "5", label: "Publications" },
  { value: "6", label: "Focus Areas" },
  { value: "6", label: "Peer-Reviewed Papers" },
];

export default function ResearchPage() {
  return (
    <>
      <PageHero
        title="Research"
        subtitle="Interdisciplinary AI research at the San Diego Supercomputer Center"
        compact
      />

      {/* Publications */}
      <section className="py-20 px-4 md:px-6">
        <div className="container mx-auto max-w-4xl">
          <div className="flex items-center gap-3 mb-2">
            <BookOpen className="w-6 h-6 text-blue-400" />
            <h2 className="text-2xl md:text-3xl font-bold text-white">Publications</h2>
          </div>
          <p className="text-slate-400 mb-10">
            Points of view and working papers from our researchers, advisors, and industry partners
          </p>

          <div className="space-y-4">
            {PUBLICATIONS.map((pub) => (
              <Link
                key={pub.pdfSlug}
                href={`/insights/${pub.pdfSlug}`}
                className="flex items-center gap-5 p-5 bg-gradient-to-br from-slate-900/90 to-slate-800/50 border border-slate-800 rounded-xl hover:border-blue-500/50 transition-all group"
              >
                <div className="w-12 h-12 rounded-xl bg-blue-500/10 flex items-center justify-center flex-shrink-0">
                  <FileText className="w-6 h-6 text-blue-400" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-[10px] uppercase tracking-wider text-slate-500">{pub.type}</span>
                    {pub.access !== "community" && (
                      <span className="text-[10px] uppercase tracking-wider px-1.5 py-0.5 rounded bg-amber-500/10 text-amber-400">
                        Forum
                      </span>
                    )}
                  </div>
                  <h3 className="text-base font-semibold text-white mb-1">{pub.title}</h3>
                  <p className="text-sm text-slate-500">{pub.authors}</p>
                </div>
                <ArrowRight className="w-5 h-5 text-slate-600 group-hover:text-blue-400 transition-colors flex-shrink-0" />
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Projects */}
      <section className="py-20 px-4 md:px-6 bg-slate-900">
        <div className="container mx-auto max-w-4xl">
          <div className="flex items-center gap-3 mb-2">
            <FlaskConical className="w-6 h-6 text-purple-400" />
            <h2 className="text-2xl md:text-3xl font-bold text-white">Research Projects</h2>
          </div>
          <p className="text-slate-400 mb-10">Active and upcoming research initiatives</p>

          <div className="space-y-3">
            {PROJECTS.map((project) => (
              <div
                key={project.title}
                className={`flex items-center gap-4 p-5 rounded-xl border ${
                  project.access === "forum"
                    ? "bg-slate-800/50 border-slate-700/50"
                    : "bg-slate-800 border-slate-700"
                }`}
              >
                <div className="flex-1 min-w-0">
                  <h3 className={`text-base font-semibold ${project.access === "forum" ? "text-slate-400" : "text-white"}`}>
                    {project.title}
                  </h3>
                </div>
                <div className="flex items-center gap-2 flex-shrink-0">
                  {project.access === "forum" ? (
                    <Link
                      href="/auth"
                      className="flex items-center gap-1.5 text-[10px] uppercase tracking-wider px-2.5 py-1 rounded-full bg-amber-500/10 text-amber-400 hover:bg-amber-500/20 transition-colors"
                    >
                      <Lock className="w-3 h-3" />
                      Forum
                    </Link>
                  ) : (
                    <span
                      className={`text-[10px] uppercase tracking-wider px-2.5 py-1 rounded-full ${
                        project.status === "active"
                          ? "bg-emerald-500/10 text-emerald-400"
                          : "bg-slate-700 text-slate-400"
                      }`}
                    >
                      {project.status === "active" ? "Active" : "Upcoming"}
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* BlockLAB */}
      <section className="py-20 px-4 md:px-6">
        <div className="container mx-auto max-w-4xl">
          <div className="flex items-center gap-3 mb-2">
            <Link2 className="w-6 h-6 text-cyan-400" />
            <h2 className="text-2xl md:text-3xl font-bold text-white">BlockLAB</h2>
          </div>
          <p className="text-slate-400 mb-10">
            SDSC&apos;s blockchain research group — consensus algorithms, smart contracts,
            security, and governance frameworks for enterprise IT
          </p>

          <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-5">
            Peer-Reviewed Publications
          </h3>
          <div className="space-y-3">
            {BLOCKLAB_PAPERS.map((pub) => (
              <div
                key={pub.title}
                className="flex items-start gap-4 p-4 bg-slate-900 border border-slate-800 rounded-xl"
              >
                <FileText className="w-5 h-5 text-slate-600 mt-0.5 flex-shrink-0" />
                <div className="min-w-0">
                  <p className="text-sm text-white leading-snug">{pub.title}</p>
                  <p className="text-xs text-slate-500 mt-1">
                    {pub.journal}
                    {pub.url && (
                      <>
                        {" — "}
                        <a href={pub.url} target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:text-blue-300">
                          View &rarr;
                        </a>
                      </>
                    )}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-4 md:px-6 bg-slate-900">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-2xl md:text-3xl font-bold text-white mb-3">Collaborate With Us</h2>
          <p className="text-slate-400 mb-8 max-w-xl mx-auto">
            Partner on research or access our full publication library by joining the consortium.
          </p>
          <Link
            href="/auth"
            className="inline-flex items-center h-11 px-8 bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-sm font-medium rounded-full hover:from-blue-500 hover:to-indigo-500 transition-all shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40"
          >
            Join SPARK AI
          </Link>
        </div>
      </section>
    </>
  );
}
