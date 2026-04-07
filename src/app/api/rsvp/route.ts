import { NextRequest, NextResponse } from "next/server";
import { sendRsvpConfirmation } from "@/lib/email";
import { query } from "@/lib/db";

// POST /api/rsvp — RSVP for an event or roundtable
export async function POST(req: NextRequest) {
  try {
    const { eventId, eventTitle, eventDate, eventTime, isoDate, meetingLink, name, email } =
      await req.json();

    if (!eventId || !eventTitle || !email) {
      return NextResponse.json(
        { error: "eventId, eventTitle, and email are required" },
        { status: 400 }
      );
    }

    // Store RSVP in Recursiv database (upsert — ignore duplicate)
    try {
      await query(
        `INSERT INTO rsvps (event_id, event_title, event_date, event_time, event_date_iso, meeting_link, name, email)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
         ON CONFLICT (event_id, email) DO UPDATE SET
           meeting_link = COALESCE(EXCLUDED.meeting_link, rsvps.meeting_link),
           event_date_iso = COALESCE(EXCLUDED.event_date_iso, rsvps.event_date_iso)`,
        [eventId, eventTitle, eventDate || null, eventTime || null, isoDate || null, meetingLink || null, name || null, email]
      );
    } catch (dbErr) {
      // Log but don't fail the RSVP — email confirmation is still valuable
      console.error("RSVP database write failed:", dbErr);
    }

    // Send RSVP confirmation — don't fail the RSVP if email fails
    let emailSent = false;
    try {
      await sendRsvpConfirmation({ email, name, eventTitle, eventDate, eventTime, isoDate, meetingLink });
      emailSent = true;
    } catch (emailErr) {
      console.error("RSVP email failed for", email, "—", emailErr);
    }

    console.log(`RSVP recorded: ${name} (${email}) → ${eventTitle} [email: ${emailSent ? "sent" : "FAILED"}]`);

    return NextResponse.json({
      success: true,
      emailSent,
    });
  } catch (error) {
    console.error("RSVP error:", error);
    return NextResponse.json(
      { error: "Failed to process RSVP" },
      { status: 500 }
    );
  }
}
