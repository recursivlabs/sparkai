import { NextRequest, NextResponse } from "next/server";
import { getRecursiv } from "@/lib/recursiv";
import { getUpcomingEvents, getEventsForMonth, buildDigestHtml, buildDigestText } from "@/lib/events";

// POST /api/admin/send-monthly-digest
// Body: { emails: string[], month?: number, year?: number }
// If no emails provided, sends to all community members (TODO: fetch from platform)
// If no month/year, uses current month
//
// This creates a Recursiv campaign, imports recipients, and starts sending.
export async function POST(req: NextRequest) {
  const authHeader = req.headers.get("authorization");
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json();
  const emails: string[] = body.emails;
  const month: number | undefined = body.month;
  const year: number | undefined = body.year;

  if (!emails || !Array.isArray(emails) || emails.length === 0) {
    return NextResponse.json({
      error: "emails[] required — list of recipient email addresses",
      usage: {
        method: "POST",
        headers: { Authorization: "Bearer <CRON_SECRET>" },
        body: { emails: ["user@example.com"], month: 4, year: 2026 },
      },
    }, { status: 400 });
  }

  // Get events — specific month or all upcoming
  const events = month
    ? getEventsForMonth(month, year)
    : getUpcomingEvents();

  const now = new Date();
  const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
  const targetMonth = month ?? now.getMonth() + 1;
  const targetYear = year ?? now.getFullYear();
  const monthLabel = `${monthNames[targetMonth - 1]} ${targetYear}`;

  const r = getRecursiv();

  try {
    // 1. Create campaign
    const { data: campaign } = await r.email.createCampaign({
      name: `SPARK AI Digest — ${monthLabel}`,
      subject: `What's Coming Up at SPARK AI — ${monthLabel}`,
      from_email: "events@recursiv.io", // TODO: switch to events@sparkai.network once verified
      from_name: "SPARK AI Network",
      html_content: buildDigestHtml(events, monthLabel),
      text_content: buildDigestText(events, monthLabel),
    });

    // 2. Import recipients
    const { data: imported } = await r.email.importRecipients(campaign.id, {
      emails,
    });

    // 3. Start sending
    await r.email.startCampaign(campaign.id);

    return NextResponse.json({
      success: true,
      campaign_id: campaign.id,
      month: monthLabel,
      events_count: events.length,
      recipients: {
        imported: imported.imported,
        suppressed: imported.suppressed,
        duplicates: imported.duplicates,
      },
      status: "sending",
    });
  } catch (err) {
    console.error("Monthly digest send failed:", err);
    return NextResponse.json({
      error: err instanceof Error ? err.message : "Failed to send digest",
    }, { status: 500 });
  }
}

// GET /api/admin/send-monthly-digest?preview=true
// Preview the digest email HTML without sending
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const month = searchParams.get("month") ? parseInt(searchParams.get("month")!) : undefined;
  const year = searchParams.get("year") ? parseInt(searchParams.get("year")!) : undefined;

  const events = month
    ? getEventsForMonth(month, year)
    : getUpcomingEvents();

  const now = new Date();
  const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
  const targetMonth = month ?? now.getMonth() + 1;
  const targetYear = year ?? now.getFullYear();
  const monthLabel = `${monthNames[targetMonth - 1]} ${targetYear}`;

  const preview = searchParams.get("preview") === "true";

  if (preview) {
    return new Response(buildDigestHtml(events, monthLabel), {
      headers: { "Content-Type": "text/html" },
    });
  }

  return NextResponse.json({
    month: monthLabel,
    events_count: events.length,
    events: events.map(e => ({ id: e.id, title: e.title, date: e.date })),
    preview_url: `/api/admin/send-monthly-digest?preview=true${month ? `&month=${month}` : ""}${year ? `&year=${year}` : ""}`,
  });
}
