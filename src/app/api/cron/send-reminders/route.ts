import { NextRequest, NextResponse } from "next/server";
import { query } from "@/lib/db";
import { sendEventReminder } from "@/lib/email";

// GET /api/cron/send-reminders — called daily by Vercel Cron
// Sends reminder emails for events happening tomorrow
export async function GET(req: NextRequest) {
  // Verify cron secret to prevent unauthorized triggers
  const authHeader = req.headers.get("authorization");
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // Find RSVPs for events happening tomorrow
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const tomorrowStr = tomorrow.toISOString().split("T")[0]; // YYYY-MM-DD

  const rsvps = await query(
    `SELECT * FROM rsvps WHERE event_date_iso = $1 AND (reminder_sent IS NULL OR reminder_sent = FALSE)`,
    [tomorrowStr]
  );

  let sent = 0;
  let errors = 0;

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

      // Mark as sent so we don't double-send
      await query(
        `UPDATE rsvps SET reminder_sent = TRUE WHERE id = $1`,
        [rsvp.id]
      );

      sent++;
    } catch (err) {
      console.error(`Failed to send reminder to ${rsvp.email}:`, err);
      errors++;
    }
  }

  console.log(`Cron send-reminders: ${sent} sent, ${errors} errors, ${rsvps.length} total for ${tomorrowStr}`);

  return NextResponse.json({
    date: tomorrowStr,
    sent,
    errors,
    total: rsvps.length,
  });
}
