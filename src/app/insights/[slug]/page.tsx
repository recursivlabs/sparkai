"use client";

import { useParams } from "next/navigation";
import { useState, useEffect } from "react";
import Link from "next/link";
import { ArrowLeft, Download, FileText, Users, Tag, Lock, Loader2 } from "lucide-react";

const PDF_MAP: Record<
  string,
  {
    title: string;
    authors: string;
    type: string;
    description: string;
    access: "community" | "forum" | "arc";
  }
> = {
  "enterprise-ai-hype-to-value": {
    title: "Architecting Enterprise AI for Scale, Control, and Competitive Advantage",
    authors: "John Ottman & Suresh Mani, Solix",
    type: "Point of View",
    description:
      "This paper examines how enterprises can move beyond AI hype to deliver measurable value at scale. It covers architecture patterns for control, governance, and competitive advantage in production AI systems.",
    access: "community",
  },
  "storage-architecture-revolution": {
    title: "Rethinking Enterprise Storage Architecture for AI-Driven Systems",
    authors: "Barry Rudolph (Spectra) & Christine Telford Teale (IBM)",
    type: "Point of View",
    description:
      "An analysis of how AI workloads are fundamentally reshaping enterprise storage requirements — from data ingestion pipelines to model training infrastructure and inference serving.",
    access: "community",
  },
  "ai-governance-frameworks": {
    title: "Is AI Governable?",
    authors: "SPARK AI Research Team",
    type: "Working Paper",
    description:
      "This working paper explores the feasibility and frameworks for governing AI systems across regulatory, organizational, and technical dimensions.",
    access: "community",
  },
  "zero-trust-data-quality": {
    title: "Agentic AI Data Quality and Zero Trust",
    authors: "SPARK AI Research Team",
    type: "Working Paper",
    description:
      "Investigates the intersection of agentic AI systems and data quality assurance through a zero-trust lens.",
    access: "forum",
  },
  "project-chainwatch": {
    title: "Project ChainWatch: A User-Configurable Blockchain Anomaly Detection System",
    authors: "Samson Qian, Steve Orrin, Matt Clanton, James Short",
    type: "Working Paper",
    description:
      "ChainWatch is a user-configurable system for detecting anomalous activity on blockchain networks.",
    access: "forum",
  },
};

interface SessionUser {
  id: string;
  name: string;
  email: string;
  tier: string;
}

const TIER_ORDER: Record<string, number> = { community: 0, forum: 1, arc: 2 };

export default function PaperDetailPage() {
  const params = useParams();
  const slug = params.slug as string;
  const paper = PDF_MAP[slug];

  const [user, setUser] = useState<SessionUser | null | undefined>(undefined);
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);
  const [pdfError, setPdfError] = useState<string | null>(null);
  const [loadingPdf, setLoadingPdf] = useState(false);

  useEffect(() => {
    fetch("/api/auth/session")
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => setUser(data?.user || null))
      .catch(() => setUser(null));
  }, []);

  useEffect(() => {
    if (!paper || user === undefined) return;

    const hasAccess =
      paper.access === "community" ||
      (user && TIER_ORDER[user.tier] >= TIER_ORDER[paper.access]);

    if (hasAccess) {
      setLoadingPdf(true);
      fetch(`/api/pdf/${slug}`)
        .then((res) => {
          if (res.ok) return res.blob();
          throw new Error("not-available");
        })
        .then((blob) => {
          setPdfUrl(URL.createObjectURL(blob));
        })
        .catch(() => {
          setPdfError("not-available");
        })
        .finally(() => setLoadingPdf(false));
    }
  }, [paper, user, slug]);

  if (!paper) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-white mb-4">Paper Not Found</h1>
          <Link href="/research" className="text-blue-400 hover:text-blue-300">
            &larr; Back to Research
          </Link>
        </div>
      </div>
    );
  }

  const hasAccess =
    paper.access === "community" ||
    (user && TIER_ORDER[user.tier] >= TIER_ORDER[paper.access]);

  const accessLabel =
    paper.access === "community" ? "Open Access" : paper.access === "forum" ? "Forum Members" : "ARC Members";
  const accessColor =
    paper.access === "community"
      ? "text-emerald-400 bg-emerald-500/10"
      : paper.access === "forum"
        ? "text-blue-400 bg-blue-500/10"
        : "text-purple-400 bg-purple-500/10";

  return (
    <div className="min-h-screen">
      {/* Header bar */}
      <div className="border-b border-slate-800 px-4 py-4">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link
              href="/research"
              className="inline-flex items-center gap-1.5 text-sm text-slate-400 hover:text-white transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Research
            </Link>
            <div className="hidden sm:block">
              <h1 className="text-sm font-semibold text-white">{paper.title}</h1>
              <p className="text-xs text-slate-500">{paper.authors}</p>
            </div>
          </div>
          {hasAccess && pdfUrl && (
            <a
              href={pdfUrl}
              download={`${slug}.pdf`}
              className="flex items-center gap-2 px-3 py-1.5 text-sm text-slate-400 hover:text-white border border-slate-700 rounded-lg hover:border-slate-500 transition-colors"
            >
              <Download className="w-4 h-4" />
              Download PDF
            </a>
          )}
        </div>
      </div>

      {/* Paper detail + viewer */}
      <section className="py-8 px-4 md:px-6">
        <div className="max-w-6xl mx-auto">
          {/* Meta */}
          <div className="flex items-center gap-3 mb-4">
            <span className="text-[11px] uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
              <Tag className="w-3 h-3" />
              {paper.type}
            </span>
            <span className={`text-[11px] uppercase tracking-wider px-2 py-0.5 rounded-full ${accessColor}`}>
              {accessLabel}
            </span>
          </div>

          <h1 className="text-2xl md:text-3xl font-bold text-white leading-tight mb-3">
            {paper.title}
          </h1>
          <p className="text-slate-400 flex items-center gap-2 mb-6">
            <Users className="w-4 h-4 text-slate-500" />
            {paper.authors}
          </p>

          {/* PDF Viewer or Access Gate */}
          {hasAccess ? (
            loadingPdf ? (
              <div className="bg-slate-900 border border-slate-800 rounded-xl p-16 flex flex-col items-center justify-center">
                <Loader2 className="w-8 h-8 text-blue-400 animate-spin mb-4" />
                <p className="text-slate-400 text-sm">Loading paper...</p>
              </div>
            ) : pdfUrl ? (
              <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden">
                <iframe
                  src={pdfUrl}
                  className="w-full"
                  style={{ height: "calc(100vh - 250px)" }}
                  title={paper.title}
                />
              </div>
            ) : (
              <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-8 text-center">
                <div className="w-16 h-16 rounded-2xl bg-blue-500/10 flex items-center justify-center mx-auto mb-4">
                  <FileText className="w-8 h-8 text-blue-400" />
                </div>
                <h3 className="text-lg font-semibold text-white mb-2">Full Paper Coming Soon</h3>
                <p className="text-slate-400 text-sm max-w-md mx-auto">
                  The full PDF will be available for download shortly.
                </p>
              </div>
            )
          ) : (
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-10 text-center">
              <div className="w-16 h-16 rounded-2xl bg-amber-500/10 flex items-center justify-center mx-auto mb-4">
                <Lock className="w-8 h-8 text-amber-400" />
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">
                {!user ? "Sign In Required" : "Upgrade Required"}
              </h3>
              <p className="text-slate-400 text-sm mb-6 max-w-md mx-auto">
                {!user
                  ? "Sign in or create an account to access this paper."
                  : `This paper requires ${accessLabel} access. Upgrade your membership to read the full paper.`}
              </p>
              <div className="flex items-center justify-center gap-3">
                {!user ? (
                  <>
                    <Link
                      href="/auth/register"
                      className="inline-flex items-center h-10 px-6 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      Join SPARK AI
                    </Link>
                    <Link
                      href="/auth/login"
                      className="inline-flex items-center h-10 px-6 border border-slate-700 text-slate-300 text-sm font-medium rounded-lg hover:border-slate-500 transition-colors"
                    >
                      Sign In
                    </Link>
                  </>
                ) : (
                  <Link
                    href="/sponsorship"
                    className="inline-flex items-center h-10 px-6 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    Upgrade Membership
                  </Link>
                )}
              </div>

              {/* Blurred preview of abstract */}
              <div className="mt-8 p-6 bg-slate-800/50 rounded-lg text-left relative overflow-hidden">
                <div className="absolute inset-0 backdrop-blur-md z-10" />
                <h4 className="text-sm font-semibold text-white mb-2">Abstract</h4>
                <p className="text-slate-400 text-sm leading-relaxed">{paper.description}</p>
              </div>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
