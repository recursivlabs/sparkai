import { NextRequest, NextResponse } from "next/server";
import { getSessionUser } from "@/lib/session";
import { getRecursiv } from "@/lib/recursiv";
import { PROJECT_ID, STORAGE_BUCKET } from "@/lib/constants";
import type { MembershipTier } from "@/lib/tiers";
import { readFile } from "fs/promises";
import { join } from "path";

const TIER_ORDER: Record<MembershipTier, number> = {
  community: 0,
  forum: 1,
  arc: 2,
};

// Map slug -> PDF metadata with access tier
const PDF_ACCESS: Record<string, { filename: string; access: MembershipTier }> = {
  "enterprise-ai-hype-to-value": { filename: "enterprise-ai-hype-to-value.pdf", access: "community" },
  "storage-architecture-revolution": { filename: "storage-architecture-revolution.pdf", access: "community" },
  "ai-governance-frameworks": { filename: "ai-governance-frameworks.pdf", access: "community" },
  "zero-trust-data-quality": { filename: "zero-trust-data-quality.pdf", access: "forum" },
  "project-chainwatch": { filename: "project-chainwatch.pdf", access: "forum" },
};

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;
  const paper = PDF_ACCESS[slug];

  if (!paper) {
    return NextResponse.json({ error: "Paper not found" }, { status: 404 });
  }

  // Check access
  if (paper.access !== "community") {
    const user = await getSessionUser();
    if (!user) {
      return NextResponse.json(
        { error: "Sign in required", requireAuth: true },
        { status: 401 }
      );
    }
    if (TIER_ORDER[user.tier] < TIER_ORDER[paper.access]) {
      return NextResponse.json(
        { error: "Upgrade required", requiredTier: paper.access, currentTier: user.tier },
        { status: 403 }
      );
    }
  }

  // Try Recursiv storage first (presigned download URL)
  try {
    const r = getRecursiv();
    const { data } = await r.storage.getDownloadUrl({
      project_id: PROJECT_ID,
      bucket_name: STORAGE_BUCKET,
      key: paper.filename,
    });

    if (data.url) {
      // Redirect to the presigned S3/R2 URL
      return NextResponse.redirect(data.url);
    }
  } catch {
    // Storage not configured or file not uploaded yet — fall through to local
  }

  // Fallback: serve from local public/pdfs/ directory
  try {
    const pdfPath = join(process.cwd(), "public", "pdfs", paper.filename);
    const buffer = await readFile(pdfPath);
    return new NextResponse(buffer, {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `inline; filename="${paper.filename}"`,
        "Cache-Control": "private, max-age=3600",
      },
    });
  } catch {
    return NextResponse.json(
      { error: "PDF file not available yet" },
      { status: 404 }
    );
  }
}
