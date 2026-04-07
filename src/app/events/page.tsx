import { Suspense } from "react";
import PageHero from "@/components/ui/PageHero";
import RsvpButton from "@/components/ui/RsvpButton";
import { Calendar, MapPin, ExternalLink } from "lucide-react";
import Link from "next/link";

export const metadata = {
  title: "Events — SPARK AI Network",
  description: "Conferences, workshops, roundtables, and community gatherings from SPARK AI.",
};

const UPCOMING = [
  {
    id: "rt-massa-apr-2026",
    date: "Apr 10",
    isoDate: "2026-04-10",
    title: "SPARK Community Roundtable — James Massa, JP Morgan Chase",
    location: "Virtual — 2:00 PM CDT",
    time: "2:00 PM CDT",
    type: "Roundtable",
    meetingLink: "https://meet.google.com/spark-ai-massa",
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
    meetingLink: "https://meet.google.com/spark-ai-williams",
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

const PAST = [
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

const TYPE_COLORS: Record<string, string> = {
  Conference: "text-blue-400",
  Roundtable: "text-purple-400",
  Summit: "text-cyan-400",
  Presentation: "text-emerald-400",
  Board: "text-amber-400",
};

export default function EventsPage() {
  return (
    <>
      <PageHero
        title="Events"
        subtitle="Conferences, workshops, roundtables, and community gatherings hosted by SPARK AI and our partners"
        compact
      />

      {/* Upcoming */}
      <section className="py-16 px-4 md:px-6">
        <div className="container mx-auto max-w-4xl">
          <h2 className="text-2xl font-bold text-white mb-2">Upcoming — 2026</h2>
          <p className="text-slate-400 text-sm mb-8">RSVP to receive reminders and join links</p>

          <div className="space-y-2">
            {UPCOMING.map((evt) => (
              <div
                key={evt.id}
                className="flex flex-col md:flex-row md:items-center gap-3 p-4 rounded-lg border bg-slate-900 border-slate-800"
              >
                <div className="flex-shrink-0 w-20 text-xs font-bold text-blue-400">
                  {evt.date}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className={`text-[10px] uppercase tracking-wider ${TYPE_COLORS[evt.type] || "text-slate-400"}`}>
                      {evt.type}
                    </span>
                  </div>
                  <h3 className="text-sm font-semibold text-white">{evt.title}</h3>
                  <p className="text-xs text-slate-500 flex items-center gap-1 mt-0.5">
                    <MapPin className="w-3 h-3" />
                    {evt.location}
                  </p>
                </div>
                <div className="flex items-center gap-2 flex-shrink-0 w-[160px] justify-end">
                  <Suspense>
                    <RsvpButton
                      eventId={evt.id}
                      eventTitle={evt.title}
                      eventDate={evt.date}
                      eventTime={evt.time}
                      isoDate={evt.isoDate}
                      meetingLink={evt.meetingLink}
                    />
                  </Suspense>
                  {evt.url ? (
                    <a
                      href={evt.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center justify-center w-5 text-xs text-slate-500 hover:text-blue-400 transition-colors"
                    >
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  ) : (
                    <span className="w-5" />
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Past */}
      <section className="py-16 px-4 md:px-6 bg-slate-900">
        <div className="container mx-auto max-w-4xl">
          <h2 className="text-2xl font-bold text-white mb-2">Past Events</h2>
          <p className="text-slate-400 text-sm mb-6">Previous conferences and gatherings</p>

          <div className="space-y-2">
            {PAST.map((evt) => (
              <div
                key={evt.title}
                className="flex items-center gap-4 p-3 bg-slate-800 border border-slate-700 rounded-lg"
              >
                <div className="flex-shrink-0 w-16 text-xs text-slate-500">{evt.date}</div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-sm font-semibold text-white">{evt.title}</h3>
                  <p className="text-xs text-slate-500">{evt.location}</p>
                </div>
                {evt.url && (
                  <a
                    href={evt.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs text-blue-400 hover:text-blue-300 flex-shrink-0"
                  >
                    Details &rarr;
                  </a>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 px-4 md:px-6">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-2xl font-bold text-white mb-3">Stay Updated</h2>
          <p className="text-slate-400 text-sm mb-6">
            Get event notifications and community news in your inbox.
          </p>
          <Link
            href="/auth"
            className="inline-flex items-center h-10 px-8 bg-blue-600 text-white text-sm font-medium rounded-full hover:bg-blue-700 transition-colors"
          >
            Join SPARK AI
          </Link>
        </div>
      </section>
    </>
  );
}
