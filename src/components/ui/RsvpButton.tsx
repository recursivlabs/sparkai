"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { CalendarCheck, CalendarPlus, Check, Loader2 } from "lucide-react";
import Link from "next/link";

interface RsvpButtonProps {
  eventId: string;
  eventTitle: string;
  eventDate: string;
  eventTime?: string;
  isoDate?: string;
  meetingLink?: string;
}

interface SessionUser {
  id: string;
  name: string;
  email: string;
  tier: string;
}

export default function RsvpButton({
  eventId,
  eventTitle,
  eventDate,
  eventTime,
  isoDate,
  meetingLink,
}: RsvpButtonProps) {
  const storageKey = `rsvp_${eventId}`;
  const [state, setState] = useState<"idle" | "loading" | "done">(() => {
    if (typeof window !== "undefined" && localStorage.getItem(storageKey)) return "done";
    return "idle";
  });
  const [user, setUser] = useState<SessionUser | null | undefined>(undefined);
  const [error, setError] = useState("");
  const searchParams = useSearchParams();

  useEffect(() => {
    fetch("/api/auth/session")
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => setUser(data?.user || null))
      .catch(() => setUser(null));
  }, []);

  // Auto-RSVP if redirected back from signup with ?rsvp=thisEventId
  useEffect(() => {
    if (user && state === "idle" && searchParams.get("rsvp") === eventId) {
      handleRsvp();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  async function handleRsvp() {
    if (!user) return;
    setState("loading");
    setError("");

    try {
      const res = await fetch("/api/rsvp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          eventId,
          eventTitle,
          eventDate,
          eventTime,
          isoDate,
          meetingLink,
          name: user.name,
          email: user.email,
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "RSVP failed");
      }

      localStorage.setItem(storageKey, Date.now().toString());
      setState("done");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
      setState("idle");
    }
  }

  // Loading session
  if (user === undefined) {
    return (
      <button
        disabled
        className="inline-flex items-center gap-2 px-4 py-2 bg-slate-800 text-slate-500 text-sm font-medium rounded-lg"
      >
        <CalendarCheck className="w-4 h-4" />
        RSVP
      </button>
    );
  }

  if (state === "done") {
    return (
      <div className="flex items-center gap-2">
        <span className="inline-flex items-center gap-1.5 text-green-400 text-sm font-medium">
          <Check className="w-4 h-4" />
          RSVP&apos;d
        </span>
        {isoDate && (
          <AddToCalendarMenu
            eventTitle={eventTitle}
            eventDate={eventDate}
            eventTime={eventTime}
            isoDate={isoDate}
            meetingLink={meetingLink}
          />
        )}
      </div>
    );
  }

  // Not logged in — prompt to join, pass event info so we can auto-RSVP after signup
  if (!user) {
    const returnUrl = `/events?rsvp=${encodeURIComponent(eventId)}`;
    return (
      <Link
        href={`/auth/register?returnTo=${encodeURIComponent(returnUrl)}`}
        className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors"
      >
        <CalendarCheck className="w-4 h-4" />
        RSVP
      </Link>
    );
  }

  // Logged in — one-click RSVP
  return (
    <div>
      <button
        onClick={handleRsvp}
        disabled={state === "loading"}
        className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
      >
        {state === "loading" ? (
          <>
            <Loader2 className="w-4 h-4 animate-spin" />
            Confirming...
          </>
        ) : (
          <>
            <CalendarCheck className="w-4 h-4" />
            RSVP
          </>
        )}
      </button>
      {error && <p className="text-red-400 text-xs mt-1">{error}</p>}
    </div>
  );
}

// --- Add to Calendar ---

function AddToCalendarMenu({
  eventTitle,
  eventDate,
  eventTime,
  isoDate,
  meetingLink,
}: {
  eventTitle: string;
  eventDate: string;
  eventTime?: string;
  isoDate: string;
  meetingLink?: string;
}) {
  const [open, setOpen] = useState(false);

  // Parse time like "2:00 PM CDT" into hours for the calendar event
  // Default to 14:00-15:00 if no time provided
  const startHour = eventTime ? parseTimeToHour(eventTime) : 14;
  const endHour = startHour + 1;

  // Format: 20260410T140000
  const dtStart = `${isoDate.replace(/-/g, "")}T${pad(startHour)}0000`;
  const dtEnd = `${isoDate.replace(/-/g, "")}T${pad(endHour)}0000`;

  const googleUrl = buildGoogleCalendarUrl({
    title: eventTitle,
    startDate: dtStart,
    endDate: dtEnd,
    description: meetingLink ? `Join: ${meetingLink}` : `SPARK AI Network event`,
    location: meetingLink || "",
  });

  function downloadIcs() {
    const ics = [
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

    const blob = new Blob([ics], { type: "text/calendar;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${eventTitle.replace(/[^a-zA-Z0-9]/g, "_").substring(0, 40)}.ics`;
    a.click();
    URL.revokeObjectURL(url);
    setOpen(false);
  }

  return (
    <div className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="inline-flex items-center justify-center w-7 h-7 rounded-md text-slate-400 hover:text-blue-400 hover:bg-slate-800 transition-colors"
        title="Add to calendar"
      >
        <CalendarPlus className="w-3.5 h-3.5" />
      </button>
      {open && (
        <>
          <div className="fixed inset-0 z-10" onClick={() => setOpen(false)} />
          <div className="absolute right-0 top-8 z-20 bg-slate-800 border border-slate-700 rounded-lg shadow-xl py-1 w-44">
            <a
              href={googleUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="block px-3 py-2 text-xs text-slate-300 hover:bg-slate-700 hover:text-white transition-colors"
              onClick={() => setOpen(false)}
            >
              Google Calendar
            </a>
            <button
              onClick={downloadIcs}
              className="block w-full text-left px-3 py-2 text-xs text-slate-300 hover:bg-slate-700 hover:text-white transition-colors"
            >
              Apple / Outlook (.ics)
            </button>
          </div>
        </>
      )}
    </div>
  );
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

function buildGoogleCalendarUrl(params: {
  title: string;
  startDate: string;
  endDate: string;
  description: string;
  location: string;
}) {
  const base = "https://calendar.google.com/calendar/render";
  const qs = new URLSearchParams({
    action: "TEMPLATE",
    text: params.title,
    dates: `${params.startDate}/${params.endDate}`,
    details: params.description,
    location: params.location,
  });
  return `${base}?${qs.toString()}`;
}
