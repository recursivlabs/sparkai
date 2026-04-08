import { NextRequest, NextResponse } from "next/server";
import { getRecursiv } from "@/lib/recursiv";
import { getUpcomingEvents, buildDigestHtml, buildDigestText } from "@/lib/events";

// POST /api/admin/import-members
// Body: { emails: string[] }
// Imports members and sends them a welcome digest with upcoming events.
// Uses the Recursiv campaign system — creates a "Welcome" campaign, imports
// the emails as recipients, and starts sending.
export async function POST(req: NextRequest) {
  const authHeader = req.headers.get("authorization");
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { emails } = await req.json();

  if (!Array.isArray(emails) || emails.length === 0) {
    return NextResponse.json({
      error: "Body must have emails: string[]",
    }, { status: 400 });
  }

  const r = getRecursiv();
  const events = getUpcomingEvents();
  const now = new Date();
  const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
  const monthLabel = `${monthNames[now.getMonth()]} ${now.getFullYear()}`;

  try {
    // Create a welcome campaign
    const { data: campaign } = await r.email.createCampaign({
      name: `Welcome to SPARK AI — ${monthLabel}`,
      subject: `Welcome to SPARK AI Network — Here's What's Coming Up`,
      from_email: "events@recursiv.io", // TODO: switch to events@sparkai.network once verified
      from_name: "SPARK AI Network",
      html_content: buildWelcomeDigestHtml(events, monthLabel),
      text_content: buildDigestText(events, monthLabel),
    });

    // Import all emails as recipients
    const { data: imported } = await r.email.importRecipients(campaign.id, {
      emails: emails.map((e: string) => e.trim().toLowerCase()),
    });

    // Start sending
    await r.email.startCampaign(campaign.id);

    return NextResponse.json({
      success: true,
      campaign_id: campaign.id,
      recipients: {
        total: emails.length,
        imported: imported.imported,
        suppressed: imported.suppressed,
        duplicates: imported.duplicates,
      },
      events_included: events.length,
      status: "sending",
    });
  } catch (err) {
    console.error("Import members failed:", err);
    return NextResponse.json({
      error: err instanceof Error ? err.message : "Import failed",
    }, { status: 500 });
  }
}

function emailSafe(str: string): string {
  return str.replace(/—/g, "&mdash;").replace(/–/g, "&ndash;");
}

function buildWelcomeDigestHtml(events: { id: string; date: string; title: string; location: string; type: string; url?: string }[], monthLabel: string): string {
  const siteUrl = "https://sparkai.on.recursiv.io";

  const eventRows = events.map((evt) => {
    const rsvpUrl = `${siteUrl}/events?rsvp=${encodeURIComponent(evt.id)}`;
    return `
      <div style="background: #111; border-radius: 8px; padding: 20px; margin-bottom: 12px; border-left: 3px solid #3b82f6;">
        <p style="color: #3b82f6; font-size: 11px; margin: 0 0 4px 0; font-weight: 600; text-transform: uppercase; letter-spacing: 0.05em;">${emailSafe(evt.type)} &middot; ${emailSafe(evt.date)}</p>
        <h3 style="color: #fff; margin: 0 0 6px 0; font-size: 16px; font-weight: 600;">${emailSafe(evt.title)}</h3>
        <p style="color: #a1a1aa; margin: 0 0 12px 0; font-size: 13px;">${emailSafe(evt.location)}</p>
        <a href="${rsvpUrl}" style="display: inline-block; padding: 8px 20px; background: #3b82f6; color: #fff; text-decoration: none; border-radius: 6px; font-weight: 600; font-size: 13px;">RSVP</a>
      </div>`;
  }).join("");

  return `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #000; color: #fff; padding: 40px;">
      <div style="text-align: center; margin-bottom: 32px;">
        <h1 style="color: #fff; font-size: 28px; margin: 0;">
          <span>SPARK</span> <span style="color: #3b82f6;">AI</span>
        </h1>
      </div>
      <div style="margin-bottom: 24px;">
        <h2 style="color: #fff; font-size: 22px; margin: 0 0 8px 0;">Welcome to the SPARK AI Network</h2>
        <p style="color: #a1a1aa; font-size: 14px; line-height: 1.6; margin: 0;">
          You're now part of a community of researchers, executives, and practitioners exploring how AI transforms business, government, and society. Based at the San Diego Supercomputer Center, SPARK AI brings together the people and ideas shaping the future of AI.
        </p>
      </div>
      <div style="margin-bottom: 24px;">
        <h3 style="color: #fff; font-size: 18px; margin: 0 0 12px 0;">What's Coming Up</h3>
        ${eventRows}
      </div>
      <div style="margin-top: 24px; text-align: center;">
        <a href="${siteUrl}/auth" style="display: inline-block; padding: 14px 32px; background: #3b82f6; color: #fff; text-decoration: none; border-radius: 8px; font-weight: 600; font-size: 15px;">Visit SPARK AI</a>
      </div>
      <div style="margin-top: 32px; padding-top: 20px; border-top: 1px solid #27272a; text-align: center;">
        <p style="color: #666; font-size: 12px;">
          SPARK AI Network &mdash; SDSC, UC San Diego<br/>
          <a href="${siteUrl}" style="color: #3b82f6;">sparkai.on.recursiv.io</a>
        </p>
      </div>
    </div>`;
}
