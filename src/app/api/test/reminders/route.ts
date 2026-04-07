import { NextRequest, NextResponse } from "next/server";
import { query } from "@/lib/db";
import { sendEventReminder } from "@/lib/email";

// GET /api/test/reminders?email=you@example.com — send a test reminder to yourself
// Optional params: event_id (send for a specific RSVP), preview (return HTML without sending)
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const email = searchParams.get("email");
  const eventId = searchParams.get("event_id");
  const preview = searchParams.get("preview") === "true";

  // If preview mode, return the email HTML for a sample event
  if (preview) {
    const sampleHtml = buildPreviewHtml({
      name: "Test User",
      eventTitle: "SPARK Community Roundtable — James Massa, JP Morgan Chase",
      eventDate: "Apr 10",
      eventTime: "2:00 PM CDT",
      meetingLink: "https://meet.google.com/spark-ai-massa",
    });
    return new Response(sampleHtml, {
      headers: { "Content-Type": "text/html" },
    });
  }

  if (!email) {
    return NextResponse.json({
      error: "Missing ?email= parameter",
      usage: {
        "send test": "GET /api/test/reminders?email=you@example.com",
        "for specific event": "GET /api/test/reminders?email=you@example.com&event_id=rt-massa-apr-2026",
        "preview HTML": "GET /api/test/reminders?preview=true",
      },
    }, { status: 400 });
  }

  // If event_id provided, look up real RSVP data
  if (eventId) {
    const rsvps = await query(
      `SELECT * FROM rsvps WHERE event_id = $1 LIMIT 1`,
      [eventId]
    );
    if (rsvps.length > 0) {
      const rsvp = rsvps[0];
      await sendEventReminder({
        email,
        name: rsvp.name,
        eventTitle: rsvp.event_title,
        eventDate: rsvp.event_date,
        eventTime: rsvp.event_time,
        meetingLink: rsvp.meeting_link || undefined,
      });
      return NextResponse.json({ sent: true, to: email, event: rsvp.event_title });
    }
  }

  // Default: send a sample reminder
  await sendEventReminder({
    email,
    name: "Test User",
    eventTitle: "SPARK Community Roundtable — Test Event",
    eventDate: "Apr 10",
    eventTime: "2:00 PM CDT",
    meetingLink: "https://meet.google.com/spark-ai-test",
  });

  return NextResponse.json({ sent: true, to: email, event: "Test Event" });
}

function buildPreviewHtml(params: {
  name: string;
  eventTitle: string;
  eventDate: string;
  eventTime: string;
  meetingLink?: string;
}) {
  return `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #000; color: #fff; padding: 40px;">
      <div style="text-align: center; margin-bottom: 32px;">
        <h1 style="color: #fff; font-size: 24px; margin: 0;">
          <span>SPARK</span> <span style="color: #3b82f6;">AI</span>
        </h1>
      </div>
      <div style="background: #111; border-radius: 8px; padding: 24px; border-left: 3px solid #3b82f6; margin-bottom: 24px;">
        <p style="color: #3b82f6; font-size: 13px; margin: 0 0 8px 0; font-weight: 600;">&#128276; EVENT REMINDER</p>
        <h2 style="color: #fff; margin: 0 0 8px 0; font-size: 20px;">${params.eventTitle}</h2>
        <p style="color: #a1a1aa; margin: 0; font-size: 14px;">${params.eventDate} &middot; ${params.eventTime}</p>
      </div>
      <p style="color: #a1a1aa; font-size: 14px; line-height: 1.6;">
        Hi ${params.name}, this is a friendly reminder that <strong style="color: #fff;">${params.eventTitle}</strong> is happening tomorrow.
      </p>
      ${params.meetingLink ? `
      <div style="margin: 24px 0; text-align: center;">
        <a href="${params.meetingLink}" style="display: inline-block; padding: 14px 32px; background: #3b82f6; color: #fff; text-decoration: none; border-radius: 8px; font-weight: 600; font-size: 15px;">Join Meeting</a>
      </div>
      ` : ""}
      <p style="color: #a1a1aa; font-size: 14px;">See you there!</p>
      <div style="margin-top: 32px; padding-top: 20px; border-top: 1px solid #27272a; text-align: center;">
        <p style="color: #666; font-size: 12px;">
          SPARK AI Network &mdash; SDSC, UC San Diego<br/>
          <a href="https://sparkai.network/events" style="color: #3b82f6;">View all events</a>
        </p>
      </div>
    </div>
  `;
}
