"use client";

import { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { FileText, Calendar, Users, Crown, Check, Loader2 } from "lucide-react";

interface SessionUser {
  id: string;
  name: string;
  email: string;
  tier: string;
}

const TIER_LABELS: Record<string, { label: string; color: string }> = {
  community: { label: "Community", color: "text-emerald-400" },
  forum: { label: "Executive Forum", color: "text-blue-400" },
  arc: { label: "Applied Research Center", color: "text-purple-400" },
};

const LINKS = [
  { href: "/research", icon: FileText, color: "bg-blue-500/10 text-blue-400", label: "Research", sub: "Papers and publications" },
  { href: "/events", icon: Calendar, color: "bg-green-500/10 text-green-400", label: "Events", sub: "Conferences and roundtables" },
  { href: "/people", icon: Users, color: "bg-purple-500/10 text-purple-400", label: "People", sub: "Researchers and advisors" },
];

export default function DashboardPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center"><Loader2 className="w-6 h-6 text-blue-400 animate-spin" /></div>}>
      <DashboardContent />
    </Suspense>
  );
}

function DashboardContent() {
  const [user, setUser] = useState<SessionUser | null | undefined>(undefined);
  const [upgrading, setUpgrading] = useState(false);
  const searchParams = useSearchParams();
  const upgraded = searchParams.get("upgraded");

  useEffect(() => {
    fetch("/api/auth/session")
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => setUser(data?.user || null))
      .catch(() => setUser(null));
  }, []);

  async function handleUpgrade() {
    setUpgrading(true);
    try {
      const res = await fetch("/api/billing/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ tier: "forum" }),
      });
      const data = await res.json();
      if (data.url) {
        window.location.href = data.url;
      } else {
        alert(data.error || "Failed to start checkout");
        setUpgrading(false);
      }
    } catch {
      alert("Failed to start checkout");
      setUpgrading(false);
    }
  }

  // Loading
  if (user === undefined) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-6 h-6 text-blue-400 animate-spin" />
      </div>
    );
  }

  // Not logged in
  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-white mb-3">Sign In Required</h1>
          <p className="text-slate-400 text-sm mb-6">Sign in to access your dashboard.</p>
          <div className="flex items-center justify-center gap-3">
            <Link
              href="/auth"
              className="h-10 px-6 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors flex items-center"
            >
              Sign In
            </Link>
            <Link
              href="/auth"
              className="h-10 px-6 border border-slate-700 text-slate-300 text-sm font-medium rounded-lg hover:border-slate-500 transition-colors flex items-center"
            >
              Create Account
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const tierInfo = TIER_LABELS[user.tier] || TIER_LABELS.community;

  return (
    <div className="min-h-screen py-20 px-4">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-2xl font-bold text-white mb-1">Dashboard</h1>
        <p className="text-slate-400 text-sm mb-8">Welcome back, {user.name.split(" ")[0]}.</p>

        {/* Upgrade success banner */}
        {upgraded && (
          <div className="p-4 bg-green-500/10 border border-green-500/30 rounded-lg flex items-center gap-3 mb-6">
            <Check className="w-5 h-5 text-green-400 flex-shrink-0" />
            <p className="text-green-400 text-sm">
              Your membership has been upgraded to {TIER_LABELS[upgraded]?.label || upgraded}!
            </p>
          </div>
        )}

        {/* Membership */}
        <div className="p-5 bg-slate-900 border border-slate-800 rounded-xl mb-8">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-slate-500 mb-1">Membership</p>
              <p className={`text-lg font-bold ${tierInfo.color}`}>{tierInfo.label}</p>
              <p className="text-xs text-slate-500 mt-1">{user.email}</p>
            </div>
            {user.tier === "community" && (
              <button
                onClick={handleUpgrade}
                disabled={upgrading}
                className="inline-flex items-center gap-2 h-9 px-5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-sm font-medium rounded-lg hover:from-blue-500 hover:to-indigo-500 transition-all disabled:opacity-50"
              >
                {upgrading ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Crown className="w-4 h-4" />
                )}
                Upgrade to Forum
              </button>
            )}
          </div>

          {user.tier === "community" && (
            <div className="mt-4 pt-4 border-t border-slate-800">
              <p className="text-xs text-slate-500 mb-2">Forum members get:</p>
              <ul className="grid grid-cols-2 gap-1">
                {[
                  "Full research paper access",
                  "Quarterly executive workshops",
                  "Discussion forums",
                  "Workforce development resources",
                ].map((item) => (
                  <li key={item} className="flex items-center gap-1.5 text-xs text-slate-400">
                    <Check className="w-3 h-3 text-blue-400 flex-shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        {/* Quick links */}
        <div className="space-y-2 mb-8">
          {LINKS.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className="flex items-center gap-3 p-3 bg-slate-900 border border-slate-800 rounded-lg hover:border-blue-500/30 transition-colors group"
            >
              <div className={`w-9 h-9 rounded-lg ${l.color} flex items-center justify-center flex-shrink-0`}>
                <l.icon className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-sm font-semibold text-white">{l.label}</h3>
                <p className="text-xs text-slate-500">{l.sub}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
