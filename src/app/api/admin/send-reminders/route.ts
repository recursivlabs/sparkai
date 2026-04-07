import { NextRequest, NextResponse } from "next/server";
import { query } from "@/lib/db";
import { sendEventReminder } from "@/lib/email";

// GET /api/admin/send-reminders?event_id=xxx — manual trigger for demo
// Sends reminders to all RSVPs for a specific event (or all events if no event_id)
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const eventId = searchParams.get("event_id");

  let rsvps;
  if (eventId) {
    rsvps = await query(
      `SELECT * FROM rsvps WHERE event_id = $1`,
      [eventId]
    );
  } else {
    rsvps = await query(`SELECT * FROM rsvps`);
  }

  if (rsvps.length === 0) {
    return NextResponse.json({
      message: eventId
        ? `No RSVPs found for event: ${eventId}`
        : "No RSVPs found",
      sent: 0,
    });
  }

  let sent = 0;
  let errors = 0;
  const results: { email: string; status: string }[] = [];

  for (const rsvp of rsvps) {
    try {
      await sendEventReminder({
        email: rsvp.email,
        name: rsvp.name,
        eventTitle: rsvp.event_title,
        eventDate: rsvp.event_date,
        eventTime: rsvp.event_time,
        meetingLink: rsvp.meeting_link || undefined,
      });
      sent++;
      results.push({ email: rsvp.email, status: "sent" });
    } catch (err) {
      console.error(`Failed to send reminder to ${rsvp.email}:`, err);
      errors++;
      results.push({ email: rsvp.email, status: `error: ${err}` });
    }
  }

  return NextResponse.json({
    eventId: eventId || "all",
    sent,
    errors,
    total: rsvps.length,
    results,
  });
}
