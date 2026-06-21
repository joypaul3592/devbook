"use client";

import Link from "next/link";
import { useRef } from "react";
import { useLanguage } from "@/components/providers";
import Container from "./Container";

export function Footer() {
  const { t } = useLanguage();
  const year = new Date().getFullYear();

  // Spotlight that recolors the wordmark stroke around the cursor
  const markRef = useRef<HTMLDivElement>(null);
  const handleMarkMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const el = markRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    el.style.setProperty("--mx", `${e.clientX - rect.left}px`);
    el.style.setProperty("--my", `${e.clientY - rect.top}px`);
  };

  const columns = [
    {
      title: t.footer.sectionContent,
      links: [
        { href: "/articles", label: t.footer.articles },
        { href: "/journal", label: t.footer.journal },
        { href: "/series", label: t.footer.series },
        { href: "/projects", label: t.footer.projects },
      ],
    },
    {
      title: t.footer.sectionMore,
      links: [
        { href: "/about", label: t.footer.about },
        { href: "/uses", label: t.footer.uses },
        { href: "/projects", label: t.footer.projects },
      ],
    },
    {
      title: t.footer.sectionConnect,
      links: [
        { href: "/contact", label: t.footer.contactUs },
        { href: "/privacy", label: t.footer.privacy },
        { href: "/terms", label: t.footer.terms },
        { href: "/sitemap", label: t.footer.sitemap },
      ],
    },
  ];

  const socials = [
    {
      href: "https://github.com",
      label: "GitHub",
      external: true,
      icon: (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 0C5.374 0 0 5.373 0 12c0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0112 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z" />
        </svg>
      ),
    },
    {
      href: "https://twitter.com",
      label: "X",
      external: true,
      icon: (
        <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
          <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
        </svg>
      ),
    },
    {
      href: "/rss",
      label: "RSS",
      external: false,
      icon: (
        <svg width="14" height="14" viewBox="0 0 12 12" fill="none">
          <path
            d="M1 1a9 9 0 019 9"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
          />
          <path
            d="M1 5a5 5 0 015 5"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
          />
          <circle cx="2" cy="10" r="1" fill="currentColor" />
        </svg>
      ),
    },
  ];

  return (
    <footer className="relative border-t border-border bg-background overflow-hidden">
      {/* top hairline glow */}
      <div className="absolute inset-x-0 top-0 h-px bg-linear-to-r from-transparent via-primary/50 to-transparent" />

      <Container className="relative z-10 pt-20 ">
        {/* ── Top: brand + nav ─────────────────────────────────────── */}
        <div className="grid grid-cols-1 gap-12 md:grid-cols-12 md:gap-8">
          {/* Brand */}
          <div className="md:col-span-12 lg:col-span-6 max-w-md">
            {/* availability status */}
            <span className="inline-flex items-center gap-2 rounded-full border border-border bg-secondary/50 px-3 py-1 text-[11px] font-ui tracking-wide text-muted-foreground">
              <span className="relative flex size-1.5">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-success opacity-75" />
                <span className="relative inline-flex size-1.5 rounded-full bg-success" />
              </span>
              {t.footer.available}
            </span>

            <Link
              href="/"
              className="mt-5 block w-fit"
              aria-label={`DevBook — ${t.nav.home}`}
            >
              <span className="font-semibold text-3xl tracking-tight text-transparent bg-clip-text bg-linear-to-tl from-primary to-foreground">
                Dev<span className="text-foreground">Book</span>
              </span>
            </Link>

            <p className="font-bengali text-muted-foreground  leading-relaxed mt-5">
              {t.footer.description}
            </p>

            {/* Socials */}
            <div className="flex items-center gap-2 mt-7">
              {socials.map((s) => {
                const cls =
                  "group/social size-8 rounded-xl border border-border flex items-center justify-center text-muted-foreground hover:text-foreground hover:border-foreground/30 hover:bg-secondary/60 hover:-translate-y-0.5 transition-all duration-200";
                return s.external ? (
                  <a
                    key={s.label}
                    href={s.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={s.label}
                    className={cls}
                  >
                    {s.icon}
                  </a>
                ) : (
                  <Link
                    key={s.label}
                    href={s.href}
                    aria-label={s.label}
                    className={cls}
                  >
                    {s.icon}
                  </Link>
                );
              })}
            </div>
          </div>

          {/* Link columns */}
          {columns.map((col) => (
            <nav
              key={col.title}
              className="md:col-span-4 lg:col-span-2 mt-3"
              aria-label={col.title}
            >
              <h3 className="font-ui text-sm font-semibold uppercase tracking-[0.14em] text-muted-foreground mb-5">
                {col.title}
              </h3>
              <ul className="space-y-3.5">
                {col.links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="group/link inline-flex items-center gap-2 font-bengali text-[15px] text-foreground/80 hover:text-foreground transition-colors duration-200"
                    >
                      <span className="h-px w-0 bg-primary transition-all duration-300 group-hover/link:w-4" />
                      <span className="transition-transform duration-300 group-hover/link:translate-x-0">
                        {link.label}
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          ))}
        </div>

        {/* ── Bottom bar ───────────────────────────────────────────── */}
        <div className="mt-10 pb-3 border-b border-border flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <p className="font-bengali text-muted-foreground text-xs">
            © {year} DevBook · {t.footer.copyright}
          </p>
          <a
            href="#top"
            className="group/top font-ui text-muted-foreground text-xs hover:text-foreground transition-colors duration-200 inline-flex items-center gap-2 w-fit"
          >
            {t.footer.backToTop}
            <span className="size-6 rounded-lg border border-border flex items-center justify-center group-hover/top:border-primary/50 group-hover/top:-translate-y-0.5 transition-all duration-200">
              <svg width="11" height="11" viewBox="0 0 12 12" fill="none">
                <path
                  d="M6 10V2M6 2L2.5 5.5M6 2l3.5 3.5"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </span>
          </a>
        </div>
      </Container>

      {/* ── Oversized signature wordmark ── */}
      <div
        aria-hidden
        ref={markRef}
        onMouseMove={handleMarkMove}
        className="group/mark select-none relative z-0 h-[20vw] flex items-center justify-center"
      >
        {/* Base stroke */}
        <span className="font-semibold leading-none tracking-tighter text-[20vw] whitespace-nowrap text-transparent [-webkit-text-stroke:1.5px_color-mix(in_srgb,var(--foreground)_13%,transparent)]">
          DevBook
        </span>
        {/* Brand stroke — revealed only inside the cursor spotlight */}
        <span
          className="absolute inset-0 flex items-center justify-center font-semibold leading-none tracking-tighter text-[20vw] whitespace-nowrap text-transparent opacity-0 transition-opacity duration-300 group-hover/mark:opacity-100 [-webkit-text-stroke:1.5px_var(--primary)]"
          style={{
            WebkitMaskImage:
              "radial-gradient(circle 120px at var(--mx, 50%) var(--my, 50%), #000 0%, #000 45%, transparent 80%)",
            maskImage:
              "radial-gradient(circle 120px at var(--mx, 50%) var(--my, 50%), #000 0%, #000 45%, transparent 80%)",
          }}
        >
          DevBook
        </span>
      </div>
    </footer>
  );
}
