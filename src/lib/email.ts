import { getRecursiv } from "./recursiv";

export async function sendWelcomeEmail(email: string, name: string) {
  return getRecursiv().email.send({
    to: email,
    subject: "Welcome to SPARK AI Network",
    from: "SPARK AI <welcome@sparkai.network>",
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
}: {
  email: string;
  name?: string;
  eventTitle: string;
  eventDate?: string;
  eventTime?: string;
  meetingLink?: string;
}) {
  return getRecursiv().email.send({
    to: email,
    subject: `Reminder: ${eventTitle} is tomorrow`,
    from: "SPARK AI <events@sparkai.network>",
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
}: {
  email: string;
  name?: string;
  eventTitle: string;
  eventDate?: string;
  eventTime?: string;
}) {
  return getRecursiv().email.send({
    to: email,
    subject: `RSVP Confirmed: ${eventTitle}`,
    from: "SPARK AI <events@sparkai.network>",
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
