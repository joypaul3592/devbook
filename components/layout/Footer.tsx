"use client";

import Link from "next/link";
import { useLanguage } from "@/components/providers";

export function Footer() {
  const { t } = useLanguage();
  const year = new Date().getFullYear();

  const footerLinks = [
    { href: "/articles", label: t.footer.articles },
    { href: "/journal", label: t.footer.journal },
    { href: "/series", label: t.footer.series },
    { href: "/projects", label: t.footer.projects },
    { href: "/about", label: t.footer.about },
    { href: "/uses", label: t.footer.uses },
    { href: "/contact", label: t.footer.contact },
  ];

  return (
    <footer className="border-t border-nb-border mt-24">
      <div className="nb-container py-12">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-8">
          {/* Brand */}
          <div className="space-y-2">
            <Link href="/" className="flex items-center gap-2 group w-fit">
              <span className="w-5 h-5 rounded bg-nb-text flex items-center justify-center group-hover:bg-nb-accent transition-colors duration-300">
                <span className="font-serif text-nb-bg text-[10px] font-normal italic leading-none">d</span>
              </span>
              <span className="font-bengali text-sm font-medium text-nb-text">DevBook</span>
            </Link>
            <p className="font-bengali text-nb-subtle text-xs max-w-60 leading-relaxed">
              {t.footer.tagline}
            </p>
          </div>

          {/* Links */}
          <nav className="flex flex-wrap gap-x-6 gap-y-2" aria-label="Footer navigation">
            {footerLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="font-bengali text-sm text-nb-muted hover:text-nb-text transition-colors duration-200"
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </div>

        {/* Bottom */}
        <div className="mt-10 pt-6 border-t border-nb-border-2 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <p className="font-bengali text-nb-subtle text-xs">
            © {year} DevBook — {t.footer.copyright}
          </p>
          <div className="flex items-center gap-4">
            <Link href="/rss" className="text-nb-subtle hover:text-nb-accent transition-colors duration-200" aria-label="RSS Feed">
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                <path d="M1 1a9 9 0 019 9" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                <path d="M1 5a5 5 0 015 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                <circle cx="2" cy="10" r="1" fill="currentColor" />
              </svg>
            </Link>
            <a href="https://github.com" target="_blank" rel="noopener noreferrer"
              className="text-nb-subtle hover:text-nb-text transition-colors duration-200" aria-label="GitHub">
              <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 0C5.374 0 0 5.373 0 12c0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0112 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z" />
              </svg>
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
