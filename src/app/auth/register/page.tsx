"use client";

import { useState } from "react";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";
import Link from "next/link";
import { Check } from "lucide-react";

export default function RegisterPage() {
  return (
    <Suspense>
      <RegisterContent />
    </Suspense>
  );
}

function RegisterContent() {
  const searchParams = useSearchParams();
  const returnTo = searchParams.get("returnTo");
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({
    name: "",
    email: "",
    organization: "",
    role: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Registration failed");
      }

      // Redirect — session cookie is set
      window.location.href = returnTo || "/member/dashboard";
      return;
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <div className="max-w-sm w-full text-center">
          <div className="w-14 h-14 rounded-full bg-green-500/10 flex items-center justify-center mx-auto mb-5">
            <Check className="w-7 h-7 text-green-400" />
          </div>
          <h1 className="text-xl font-bold text-white mb-3">Welcome to SPARK AI!</h1>
          <p className="text-slate-400 text-sm mb-6">
            Your account has been created.
          </p>
          <Link
            href="/"
            className="inline-flex items-center h-9 px-5 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors"
          >
            Go to Homepage
          </Link>
        </div>
      </div>
    );
  }

  const inputClass =
    "w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent";

  if (showForm) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4 py-20">
        <div className="max-w-sm w-full">
          <div className="text-center mb-6">
            <h1 className="text-xl font-bold text-white mb-1">Create your account</h1>
            <p className="text-slate-400 text-xs">Free Community membership</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-3">
            <div>
              <label htmlFor="name" className="block text-xs font-medium text-slate-400 mb-1">
                Full Name
              </label>
              <input
                id="name"
                type="text"
                required
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className={inputClass}
                placeholder="Jane Smith"
              />
            </div>

            <div>
              <label htmlFor="email" className="block text-xs font-medium text-slate-400 mb-1">
                Email
              </label>
              <input
                id="email"
                type="email"
                required
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                className={inputClass}
                placeholder="jane@company.com"
              />
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label htmlFor="organization" className="block text-xs font-medium text-slate-400 mb-1">
                  Organization
                </label>
                <input
                  id="organization"
                  type="text"
                  value={form.organization}
                  onChange={(e) => setForm({ ...form, organization: e.target.value })}
                  className={inputClass}
                  placeholder="Acme Corp"
                />
              </div>
              <div>
                <label htmlFor="role" className="block text-xs font-medium text-slate-400 mb-1">
                  Title
                </label>
                <input
                  id="role"
                  type="text"
                  value={form.role}
                  onChange={(e) => setForm({ ...form, role: e.target.value })}
                  className={inputClass}
                  placeholder="VP Engineering"
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-xs font-medium text-slate-400 mb-1">
                Password
              </label>
              <input
                id="password"
                type="password"
                required
                minLength={12}
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                className={inputClass}
                placeholder="Min. 12 chars, upper + lower + number + symbol"
              />
            </div>

            {error && (
              <div className="p-2 bg-red-500/10 border border-red-500/20 rounded-lg text-red-400 text-xs">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full h-9 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
            >
              {loading ? "Creating..." : "Sign Up Free"}
            </button>
          </form>

          <div className="flex items-center justify-between mt-4">
            <button
              onClick={() => setShowForm(false)}
              className="text-xs text-slate-500 hover:text-slate-300 transition-colors"
            >
              &larr; Back to tiers
            </button>
            <Link href="/auth/login" className="text-xs text-blue-400 hover:text-blue-300">
              Already have an account?
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-20 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-3xl font-bold text-white mb-3">Join SPARK AI</h1>
          <p className="text-slate-400 max-w-xl mx-auto">
            Choose the membership level that fits you or your organization
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Community */}
          <div className="bg-slate-900 rounded-xl border border-slate-800 p-6 flex flex-col">
            <div className="mb-5">
              <span className="inline-block text-xs font-medium px-2 py-0.5 rounded-full bg-green-500/10 text-green-400 mb-3">
                Free
              </span>
              <h2 className="text-lg font-bold text-white mb-1">Community</h2>
              <p className="text-slate-400 text-xs leading-relaxed">
                Open access to announcements, events, peer networking, and public research summaries.
              </p>
            </div>

            <ul className="space-y-2 mb-6 flex-1">
              {[
                "Announcements and event listings",
                "Community networking",
                "Public research summaries",
                "Monthly roundtable invitations",
                "Email digest of events",
              ].map((f) => (
                <li key={f} className="flex items-start gap-2 text-xs text-slate-400">
                  <Check className="w-3.5 h-3.5 text-green-400 mt-0.5 flex-shrink-0" />
                  {f}
                </li>
              ))}
            </ul>

            <button
              onClick={() => setShowForm(true)}
              className="w-full h-9 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors"
            >
              Sign Up Free
            </button>
            <p className="text-center text-xs text-slate-500 mt-2">
              No credit card required
            </p>
          </div>

          {/* Executive Forum */}
          <div className="bg-slate-900 rounded-xl border border-blue-500/30 p-6 flex flex-col ring-1 ring-blue-500/20">
            <div className="mb-5">
              <span className="inline-block text-xs font-medium px-2 py-0.5 rounded-full bg-blue-500/10 text-blue-400 mb-3">
                Paid
              </span>
              <h2 className="text-lg font-bold text-white mb-1">Executive Forum</h2>
              <p className="text-slate-400 text-xs leading-relaxed">
                For SMBs and .edu partners. Senior-level discussion forum with quarterly events,
                workshops, and full research access.
              </p>
            </div>

            <ul className="space-y-2 mb-6 flex-1">
              {[
                "All Community benefits",
                "Quarterly executive workshops",
                "Full research paper access",
                "Discussion forums with researchers",
                "Workforce development resources",
              ].map((f) => (
                <li key={f} className="flex items-start gap-2 text-xs text-slate-400">
                  <Check className="w-3.5 h-3.5 text-blue-400 mt-0.5 flex-shrink-0" />
                  {f}
                </li>
              ))}
            </ul>

            <button
              onClick={() => setShowForm(true)}
              className="w-full h-9 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors"
            >
              Join Forum
            </button>
            <p className="text-center text-xs text-slate-500 mt-2">
              Paid membership
            </p>
          </div>

          {/* ARC */}
          <div className="bg-slate-900 rounded-xl border border-slate-800 p-6 flex flex-col">
            <div className="mb-5">
              <span className="inline-block text-xs font-medium px-2 py-0.5 rounded-full bg-purple-500/10 text-purple-400 mb-3">
                Sponsored
              </span>
              <h2 className="text-lg font-bold text-white mb-1">Applied Research Center</h2>
              <p className="text-slate-400 text-xs leading-relaxed">
                Sponsored research with SDSC. Early-stage feasibility studies, proof of concept,
                and direct collaboration with researchers.
              </p>
            </div>

            <ul className="space-y-2 mb-6 flex-1">
              {[
                "All Forum benefits",
                "Sponsored research projects",
                "Proof-of-concept studies",
                "Direct SDSC collaboration",
                "Custom AI strategy consulting",
                "Early access to findings",
              ].map((f) => (
                <li key={f} className="flex items-start gap-2 text-xs text-slate-400">
                  <Check className="w-3.5 h-3.5 text-purple-400 mt-0.5 flex-shrink-0" />
                  {f}
                </li>
              ))}
            </ul>

            <a
              href="mailto:jshort@ucsd.edu?subject=ARC Sponsorship Inquiry"
              className="w-full h-9 border border-slate-600 text-white text-sm font-medium rounded-lg hover:border-slate-400 transition-colors flex items-center justify-center"
            >
              Contact James Short
            </a>
            <p className="text-center text-xs text-slate-500 mt-2">
              Custom sponsorship arrangement
            </p>
          </div>
        </div>

        <p className="text-center text-xs text-slate-500 mt-8">
          Already have an account?{" "}
          <Link href="/auth/login" className="text-blue-400 hover:text-blue-300">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}
