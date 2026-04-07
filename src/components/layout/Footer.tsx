import Link from "next/link";
import Image from "next/image";

export default function Footer() {
  return (
    <footer className="bg-black border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Connect */}
          <div>
            <h3 className="text-sm font-semibold text-white mb-4">Connect</h3>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/about"
                  className="text-sm text-slate-400 hover:text-white transition-colors"
                >
                  Contact
                </Link>
              </li>
              <li>
                <a
                  href="mailto:jshort@ucsd.edu"
                  className="text-sm text-slate-400 hover:text-white transition-colors"
                >
                  jshort@ucsd.edu
                </a>
              </li>
              <li>
                <Link
                  href="/auth/login"
                  className="text-sm text-slate-400 hover:text-white transition-colors"
                >
                  Join Discussion
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h3 className="text-sm font-semibold text-white mb-4">Legal</h3>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/privacy"
                  className="text-sm text-slate-400 hover:text-white transition-colors"
                >
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link
                  href="/terms"
                  className="text-sm text-slate-400 hover:text-white transition-colors"
                >
                  Terms of Service
                </Link>
              </li>
            </ul>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-sm font-semibold text-white mb-4">Explore</h3>
            <ul className="space-y-2">
              {[
                { href: "/research", label: "Research" },
                { href: "/events", label: "Events" },
                { href: "/people", label: "People" },
                { href: "/sponsorship", label: "Sponsorship" },
              ].map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-slate-400 hover:text-white transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-12 pt-8 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <Image
              src="/images/spark-ai-logo.png"
              alt="SPARK AI Consortium"
              width={180}
              height={45}
              className="h-10 w-auto"
            />
            <p className="text-xs text-slate-500">
              &copy; {new Date().getFullYear()} SPARK AI Consortium. All rights reserved.
            </p>
          </div>
          <div className="flex items-center gap-8">
            <a
              href="https://www.sdsc.edu/"
              target="_blank"
              rel="noopener noreferrer"
              className="opacity-60 hover:opacity-100 transition-opacity"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/images/logos/sdsc-logo.svg"
                alt="San Diego Supercomputer Center"
                className="h-8 w-auto"
              />
            </a>
            <a
              href="https://ucsd.edu/"
              target="_blank"
              rel="noopener noreferrer"
              className="opacity-60 hover:opacity-100 transition-opacity"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/images/logos/ucsd-logo.png"
                alt="UC San Diego"
                className="h-8 w-auto brightness-0 invert"
              />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
