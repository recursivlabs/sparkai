// Shared event data — used by events page, digest emails, and RSVP flow

export interface SparkEvent {
  id: string;
  date: string;
  isoDate?: string;
  title: string;
  location: string;
  time?: string;
  type: string;
  url?: string;
  meetingLink?: string;
}

export const UPCOMING_EVENTS: SparkEvent[] = [
  {
    id: "rt-massa-apr-2026",
    date: "Apr 10",
    isoDate: "2026-04-10",
    title: "SPARK Community Roundtable — James Massa, JP Morgan Chase",
    location: "Virtual — 2:00 PM CDT",
    time: "2:00 PM CDT",
    type: "Roundtable",
    // meetingLink: TODO — Jim to provide Zoom link
  },
  {
    id: "evt-reuters-apr-2026",
    date: "Apr 21–22",
    isoDate: "2026-04-21",
    title: "Reuters Customer Service & Experience West 2026",
    location: "San Diego, CA",
    type: "Conference",
    url: "https://events.reutersevents.com/customer-service/cswest",
  },
  {
    id: "rt-williams-apr-2026",
    date: "Apr 24",
    isoDate: "2026-04-24",
    title: "SPARK Community Roundtable — Spencer Williams, CWSL",
    location: "Virtual — 2:00 PM CDT",
    time: "2:00 PM CDT",
    type: "Roundtable",
    // meetingLink: TODO — Jim to provide Zoom link
  },
  {
    id: "evt-dataversity-may-2026",
    date: "May 4–8",
    isoDate: "2026-05-04",
    title: "Dataversity DGIQ + Enterprise Data World",
    location: "San Diego, CA",
    type: "Conference",
    url: "https://dataversity.net/dgiq-edw-west/",
  },
  {
    id: "evt-minds-sponsor-2026",
    date: "May TBD",
    title: "Minds.com Sponsor Presentation",
    location: "Virtual",
    type: "Presentation",
  },
  {
    id: "evt-sd-digital-gov-2026",
    date: "June 9",
    isoDate: "2026-06-09",
    title: "San Diego Digital Government Summit 2026",
    location: "San Diego, CA",
    type: "Summit",
    url: "https://events.govtech.com/san-diego-digital-government-summit.html",
  },
];

export const PAST_EVENTS = [
  { title: "SPARK Community Roundtable", date: "Mar 13, 2026", location: "Virtual — 12:00 PM PT" },
  { title: "SPARK Advisory Board & ARC Quarterly Meetings", date: "Mar 2026", location: "Virtual (invitation only)" },
  { title: "Micro Gains, Macro Patience: Early Evidence on Agentic AI Productivity", date: "Feb 12, 2026", location: "MIT Harvard DC Alumni Club (virtual)" },
  { title: "Artificial Intelligence: The Race for Regulation", date: "Jan 22–23, 2026", location: "California Western School of Law, San Diego" },
  { title: "GovAI Coalition Summit", date: "Nov 2025", location: "San Jose, CA", url: "https://events.govtech.com/GovAI-Coalition-Summit.html" },
  { title: "Solix Empower Annual Symposium", date: "Oct 2025", location: "San Diego, CA", url: "https://empower.solix.com/" },
  { title: "San Diego Startup Week", date: "Oct 2025", location: "San Diego, CA", url: "https://www.sandiegostartupweek.com/" },
  { title: "CDOIQ 2025", date: "Jul 2025", location: "Boston, MA", url: "https://cdoiqsymposium.com/" },
  { title: "CDOIQ/Solix Mini-Symposium", date: "Jul 2025", location: "Boston, MA", url: "https://cdoiqsymposium.com/" },
  { title: "SD Digital Government Summit", date: "2024", location: "San Diego, CA" },
];

/**
 * Get events happening in a specific month.
 * If no month/year specified, returns events for the current month.
 */
export function getEventsForMonth(month?: number, year?: number): SparkEvent[] {
  const targetMonth = month ?? new Date().getMonth() + 1; // 1-indexed
  const targetYear = year ?? new Date().getFullYear();

  return UPCOMING_EVENTS.filter((evt) => {
    if (!evt.isoDate) return false;
    const [y, m] = evt.isoDate.split("-").map(Number);
    return y === targetYear && m === targetMonth;
  });
}

/**
 * Get all upcoming events from today onward.
 */
export function getUpcomingEvents(): SparkEvent[] {
  const today = new Date().toISOString().split("T")[0];
  return UPCOMING_EVENTS.filter((evt) => {
    if (!evt.isoDate) return true; // Include TBD events
    return evt.isoDate >= today;
  });
}

const SITE_URL = "https://sparkai.on.recursiv.io";

/** Replace raw em dashes with HTML entity for email compatibility */
function emailSafe(str: string): string {
  return str.replace(/—/g, "&mdash;").replace(/–/g, "&ndash;");
}

/**
 * Build the monthly digest email HTML.
 */
export function buildDigestHtml(events: SparkEvent[], monthLabel: string): string {
  const eventRows = events.map((evt) => {
    const eventsUrl = `${SITE_URL}/events?rsvp=${encodeURIComponent(evt.id)}`;
    const rsvpUrl = `${SITE_URL}/auth?returnTo=${encodeURIComponent(`/events?rsvp=${evt.id}`)}`;
    return `
      <div style="background: #111; border-radius: 8px; padding: 20px; margin-bottom: 12px; border-left: 3px solid #3b82f6;">
        <div style="display: flex; justify-content: space-between; align-items: flex-start;">
          <div>
            <p style="color: #3b82f6; font-size: 11px; margin: 0 0 4px 0; font-weight: 600; text-transform: uppercase; letter-spacing: 0.05em;">${emailSafe(evt.type)} &middot; ${emailSafe(evt.date)}</p>
            <h3 style="color: #fff; margin: 0 0 6px 0; font-size: 16px; font-weight: 600;">${emailSafe(evt.title)}</h3>
            <p style="color: #a1a1aa; margin: 0; font-size: 13px;">${emailSafe(evt.location)}</p>
          </div>
        </div>
        <div style="margin-top: 12px;">
          <a href="${rsvpUrl}" style="display: inline-block; padding: 8px 20px; background: #3b82f6; color: #fff; text-decoration: none; border-radius: 6px; font-weight: 600; font-size: 13px;">RSVP</a>
          ${evt.url ? `<a href="${evt.url}" style="display: inline-block; padding: 8px 20px; color: #3b82f6; text-decoration: none; font-size: 13px; margin-left: 8px;">Event Details &rarr;</a>` : ""}
        </div>
      </div>`;
  }).join("");

  return `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #000; color: #fff; padding: 40px;">
      <div style="text-align: center; margin-bottom: 32px;">
        <h1 style="color: #fff; font-size: 24px; margin: 0;">
          <span>SPARK</span> <span style="color: #3b82f6;">AI</span>
        </h1>
      </div>
      <div style="margin-bottom: 24px;">
        <h2 style="color: #fff; font-size: 20px; margin: 0 0 4px 0;">What's Coming Up</h2>
        <p style="color: #a1a1aa; font-size: 14px; margin: 0;">${monthLabel} &mdash; SPARK AI Network Events</p>
      </div>
      ${eventRows}
      ${events.length === 0 ? `<p style="color: #a1a1aa; font-size: 14px;">No events scheduled for ${monthLabel} yet. Stay tuned!</p>` : ""}
      <div style="margin-top: 24px; text-align: center;">
        <a href="${SITE_URL}/events" style="display: inline-block; padding: 12px 28px; background: #27272a; color: #fff; text-decoration: none; border-radius: 8px; font-weight: 600; font-size: 14px; border: 1px solid #3f3f46;">View All Events</a>
      </div>
      <div style="margin-top: 32px; padding-top: 20px; border-top: 1px solid #27272a; text-align: center;">
        <p style="color: #666; font-size: 12px;">
          SPARK AI Network &mdash; SDSC, UC San Diego<br/>
          <a href="${SITE_URL}" style="color: #3b82f6;">sparkai.on.recursiv.io</a>
        </p>
      </div>
    </div>`;
}

/**
 * Build plain text version of the digest.
 */
export function buildDigestText(events: SparkEvent[], monthLabel: string): string {
  const lines = [`SPARK AI — What's Coming Up\n${monthLabel}\n`];
  for (const evt of events) {
    lines.push(`${evt.date} — ${evt.title}`);
    lines.push(`  ${evt.location}`);
    lines.push(`  RSVP: ${SITE_URL}/events?rsvp=${encodeURIComponent(evt.id)}`);
    lines.push("");
  }
  if (events.length === 0) {
    lines.push(`No events scheduled for ${monthLabel} yet.`);
  }
  lines.push(`View all events: ${SITE_URL}/events`);
  lines.push(`\n---\nSPARK AI Network — SDSC, UC San Diego`);
  return lines.join("\n");
}
