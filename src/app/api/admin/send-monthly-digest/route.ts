import { NextRequest, NextResponse } from "next/server";
import { getRecursiv } from "@/lib/recursiv";
import { getUpcomingEvents, getEventsForMonth, buildDigestHtml, buildDigestText } from "@/lib/events";

// POST /api/admin/send-monthly-digest
// Body: { emails: string[], month?: number, year?: number }
// Sends each recipient the monthly digest via transactional email.
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
      error: "emails[] required",
    }, { status: 400 });
  }

  const events = month
    ? getEventsForMonth(month, year)
    : getUpcomingEvents();

  const now = new Date();
  const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
  const targetMonth = month ?? now.getMonth() + 1;
  const targetYear = year ?? now.getFullYear();
  const monthLabel = `${monthNames[targetMonth - 1]} ${targetYear}`;

  const r = getRecursiv();
  const html = buildDigestHtml(events, monthLabel);

  let sent = 0;
  let errors = 0;
  const failed: string[] = [];

  for (const email of emails) {
    const to = email.trim().toLowerCase();
    if (!to) continue;

    try {
      await r.email.send({
        to,
        subject: `What's Coming Up at SPARK AI &mdash; ${monthLabel}`,
        from: "SPARK AI Network <events@recursiv.io>",
        html,
      });
      sent++;
    } catch (err) {
      console.error(`Digest email failed for ${to}:`, err);
      errors++;
      failed.push(to);
    }
  }

  return NextResponse.json({
    success: true,
    month: monthLabel,
    events_count: events.length,
    sent,
    errors,
    failed: failed.length > 0 ? failed : undefined,
  });
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
      headers: { "Content-Type": "text/html; charset=utf-8" },
    });
  }

  return NextResponse.json({
    month: monthLabel,
    events_count: events.length,
    events: events.map(e => ({ id: e.id, title: e.title, date: e.date })),
    preview_url: `/api/admin/send-monthly-digest?preview=true${month ? `&month=${month}` : ""}${year ? `&year=${year}` : ""}`,
  });
}
