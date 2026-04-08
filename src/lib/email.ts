import { getRecursiv } from "./recursiv";

export async function sendWelcomeEmail(email: string, name: string) {
  return getRecursiv().email.send({
    to: email,
    subject: "Welcome to SPARK AI Network",
    from: "SPARK AI <welcome@recursiv.io>",
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #000; color: #fff; padding: 40px;">
        <h1 style="color: #3b82f6;">Welcome to SPARK AI, ${name}!</h1>
        <p style="color: #a1a1aa; line-height: 1.6;">
          Thank you for joining the SPARK AI Network. You now have access to our community resources,
          event announcements, and insights from leading researchers and industry experts.
        </p>
        <p style="color: #a1a1aa; line-height: 1.6;">
          Stay tuned for upcoming events and research updates delivered directly to your inbox.
        </p>
        <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #27272a;">
          <p style="color: #666; font-size: 12px;">SPARK AI Network — SDSC, UC San Diego</p>
        </div>
      </div>
    `,
  });
}

export async function sendEventReminder({
  email,
  name,
  eventTitle,
  eventDate,
  eventTime,
  meetingLink,
  isoDate,
}: {
  email: string;
  name?: string;
  eventTitle: string;
  eventDate?: string;
  eventTime?: string;
  meetingLink?: string;
  isoDate?: string;
}) {
  return getRecursiv().email.send({
    to: email,
    subject: `Reminder: ${eventTitle} is tomorrow`,
    from: "SPARK AI Events <events@recursiv.io>",
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #000; color: #fff; padding: 40px;">
        <div style="text-align: center; margin-bottom: 32px;">
          <h1 style="color: #fff; font-size: 24px; margin: 0;">
            <span>SPARK</span> <span style="color: #3b82f6;">AI</span>
          </h1>
        </div>
        <div style="background: #111; border-radius: 8px; padding: 24px; border-left: 3px solid #3b82f6; margin-bottom: 24px;">
          <p style="color: #3b82f6; font-size: 13px; margin: 0 0 8px 0; font-weight: 600;">&#128276; EVENT REMINDER</p>
          <h2 style="color: #fff; margin: 0 0 8px 0; font-size: 20px;">${eventTitle}</h2>
          ${eventDate ? `<p style="color: #a1a1aa; margin: 0; font-size: 14px;">${eventDate}${eventTime ? ` &middot; ${eventTime}` : ""}</p>` : ""}
        </div>
        <p style="color: #a1a1aa; font-size: 14px; line-height: 1.6;">
          ${name ? `Hi ${name}, this` : "This"} is a friendly reminder that <strong style="color: #fff;">${eventTitle}</strong> is happening tomorrow.
        </p>
        ${meetingLink ? `
        <div style="margin: 24px 0; text-align: center;">
          <a href="${meetingLink}" style="display: inline-block; padding: 14px 32px; background: #3b82f6; color: #fff; text-decoration: none; border-radius: 8px; font-weight: 600; font-size: 15px;">Join Meeting</a>
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
    `,
  });
}

export async function sendRsvpConfirmation({
  email,
  name,
  eventTitle,
  eventDate,
  eventTime,
  isoDate,
  meetingLink,
}: {
  email: string;
  name?: string;
  eventTitle: string;
  eventDate?: string;
  eventTime?: string;
  isoDate?: string;
  meetingLink?: string;
}) {
  // Build calendar links if we have a date
  let calendarHtml = "";
  if (isoDate) {
    const startHour = eventTime ? parseTimeToHour(eventTime) : 14;
    const endHour = startHour + 1;
    const dtStart = `${isoDate.replace(/-/g, "")}T${pad(startHour)}0000`;
    const dtEnd = `${isoDate.replace(/-/g, "")}T${pad(endHour)}0000`;

    const googleUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(eventTitle)}&dates=${dtStart}/${dtEnd}&details=${encodeURIComponent(meetingLink ? `Join: ${meetingLink}` : "SPARK AI Network event")}&location=${encodeURIComponent(meetingLink || "")}`;

    // Generate .ics content as a data URI for direct download
    const icsContent = [
      "BEGIN:VCALENDAR",
      "VERSION:2.0",
      "PRODID:-//SPARK AI//Events//EN",
      "BEGIN:VEVENT",
      `DTSTART:${dtStart}`,
      `DTEND:${dtEnd}`,
      `SUMMARY:${eventTitle}`,
      `DESCRIPTION:${meetingLink ? `Join: ${meetingLink}` : "SPARK AI Network event"}`,
      meetingLink ? `URL:${meetingLink}` : "",
      "END:VEVENT",
      "END:VCALENDAR",
    ].filter(Boolean).join("\r\n");
    const icsBase64 = Buffer.from(icsContent).toString("base64");
    const icsDataUri = `data:text/calendar;base64,${icsBase64}`;

    calendarHtml = `
        <div style="margin: 24px 0; text-align: center;">
          <a href="${googleUrl}" target="_blank" style="display: inline-block; padding: 12px 24px; background: #3b82f6; color: #fff; text-decoration: none; border-radius: 8px; font-weight: 600; font-size: 14px; margin-right: 8px;">Add to Google Calendar</a>
          <a href="${icsDataUri}" download="${eventTitle.replace(/[^a-zA-Z0-9]/g, "_").substring(0, 30)}.ics" style="display: inline-block; padding: 12px 24px; background: #27272a; color: #fff; text-decoration: none; border-radius: 8px; font-weight: 600; font-size: 14px; border: 1px solid #3f3f46;">Download .ics</a>
        </div>`;
  }

  return getRecursiv().email.send({
    to: email,
    subject: `RSVP Confirmed: ${eventTitle}`,
    from: "SPARK AI Events <events@recursiv.io>",
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #000; color: #fff; padding: 40px;">
        <div style="text-align: center; margin-bottom: 32px;">
          <h1 style="color: #fff; font-size: 24px; margin: 0;">
            <span>SPARK</span> <span style="color: #3b82f6;">AI</span>
          </h1>
        </div>
        <div style="background: #111; border-radius: 8px; padding: 24px; border-left: 3px solid #22c55e; margin-bottom: 24px;">
          <p style="color: #22c55e; font-size: 13px; margin: 0 0 8px 0; font-weight: 600;">&#10003; RSVP CONFIRMED</p>
          <h2 style="color: #fff; margin: 0 0 8px 0; font-size: 20px;">${eventTitle}</h2>
          ${eventDate ? `<p style="color: #3b82f6; margin: 0; font-size: 14px;">${eventDate}${eventTime ? ` &middot; ${eventTime}` : ""}</p>` : ""}
        </div>
        <p style="color: #a1a1aa; font-size: 14px; line-height: 1.6;">
          ${name ? `Hi ${name}, t` : "T"}hanks for registering! You'll receive a reminder
          email with the join link before the event starts.
        </p>
        ${meetingLink ? `
        <div style="margin: 16px 0; text-align: center;">
          <a href="${meetingLink}" style="display: inline-block; padding: 14px 32px; background: #22c55e; color: #fff; text-decoration: none; border-radius: 8px; font-weight: 600; font-size: 15px;">Join Meeting</a>
        </div>
        ` : ""}
        ${calendarHtml}
        <div style="margin-top: 32px; padding-top: 20px; border-top: 1px solid #27272a; text-align: center;">
          <p style="color: #666; font-size: 12px;">
            SPARK AI Network &mdash; SDSC, UC San Diego<br/>
            <a href="https://sparkai.on.recursiv.io/events" style="color: #3b82f6;">View all events</a>
          </p>
        </div>
      </div>
    `,
  });
}

function parseTimeToHour(time: string): number {
  const match = time.match(/(\d{1,2}):(\d{2})\s*(AM|PM)/i);
  if (!match) return 14;
  let hour = parseInt(match[1], 10);
  if (match[3].toUpperCase() === "PM" && hour !== 12) hour += 12;
  if (match[3].toUpperCase() === "AM" && hour === 12) hour = 0;
  return hour;
}

function pad(n: number): string {
  return n.toString().padStart(2, "0");
}
