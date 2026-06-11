"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useRef, useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import { ThemeToggle } from "@/components/ui/ThemeToggle";
import { LanguageToggle } from "@/components/ui/LanguageToggle";
import { useLanguage } from "@/components/providers";

const navHrefs = [
  { href: "/articles", key: "articles" },
  { href: "/journal", key: "journal" },
  { href: "/series", key: "series" },
  { href: "/projects", key: "projects" },
  { href: "/about", key: "about" },
] as const;

export function Header() {
  const pathname = usePathname();
  const { t } = useLanguage();
  const headerRef = useRef<HTMLElement>(null);
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => { setMobileOpen(false); }, [pathname]);

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [mobileOpen]);

  return (
    <>
      <header
        ref={headerRef}
        className={cn(
          "fixed top-0 inset-x-0 z-40 transition-all duration-500",
          scrolled
            ? [
              "border-b",
              "border-p-rule",
              "bg-[var(--p-overlay)]",
              "backdrop-blur-xl",
              "backdrop-saturate-150",
            ].join(" ")
            : "bg-transparent"
        )}
      >
        <div className="p-container">
          <div className="flex items-center justify-between h-[3.75rem]">

            {/* Logo */}
            <Link
              href="/"
              data-header-logo
              className="flex items-center gap-3 group"
              aria-label={`DevBook — ${t.nav.home}`}
            >
              {/* Mark — ink stamp aesthetic */}
              <span className={cn(
                "w-7 h-7 rounded-[5px] flex items-center justify-center shrink-0",
                "bg-p-ink group-hover:bg-p-green",
                "transition-colors duration-300"
              )}>
                <span className="font-serif text-[var(--p-bg)] text-sm font-normal italic leading-none">
                  d
                </span>
              </span>
              <span className="font-ui text-[0.8125rem] font-semibold text-p-ink tracking-[0.04em] uppercase">
                DevBook
              </span>
            </Link>

            {/* Desktop nav */}
            <nav
              data-header-nav
              className="hidden md:flex items-center gap-0.5"
              aria-label="Main navigation"
            >
              {navHrefs.map(({ href, key }) => {
                const active = pathname === href || pathname.startsWith(href + "/");
                return (
                  <Link
                    key={href}
                    href={href}
                    className={cn(
                      "relative px-3 py-1.5 text-[0.8125rem] transition-colors duration-200 rounded",
                      "font-ui tracking-wide",
                      active
                        ? "text-p-ink"
                        : "text-p-ink-3 hover:text-p-ink"
                    )}
                  >
                    {t.nav[key]}
                    {active && (
                      <span
                        className="absolute inset-x-2 -bottom-px h-px bg-p-green rounded-full"
                        aria-hidden
                      />
                    )}
                    {active && <span className="sr-only">(current)</span>}
                  </Link>
                );
              })}
            </nav>

            {/* Actions */}
            <div data-header-actions className="flex items-center gap-1.5">
              <Link
                href="/search"
                className="w-8 h-8 rounded-full flex items-center justify-center text-p-ink-3 hover:text-p-ink hover:bg-p-surface-2 transition-colors duration-200"
                aria-label={t.nav.search}
              >
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                  <circle cx="6" cy="6" r="4.5" stroke="currentColor" strokeWidth="1.4" />
                  <path d="M9.5 9.5L13 13" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
                </svg>
              </Link>

              <LanguageToggle />
              <ThemeToggle />

              {/* Mobile hamburger */}
              <button
                className="w-8 h-8 md:hidden rounded-full flex items-center justify-center text-p-ink-3 hover:text-p-ink hover:bg-p-surface-2 transition-colors duration-200"
                onClick={() => setMobileOpen(!mobileOpen)}
                aria-expanded={mobileOpen}
                aria-label={mobileOpen ? t.nav.menuClose : t.nav.menuOpen}
              >
                <div className="w-[18px] flex flex-col gap-[5px] items-end">
                  <span className={cn("block h-px bg-current transition-all duration-300 origin-right", mobileOpen ? "w-[18px] -rotate-45 translate-y-[6px]" : "w-[18px]")} />
                  <span className={cn("block h-px bg-current transition-all duration-300", mobileOpen ? "opacity-0 w-0" : "w-[12px]")} />
                  <span className={cn("block h-px bg-current transition-all duration-300 origin-right", mobileOpen ? "w-[18px] rotate-45 -translate-y-[6px]" : "w-[18px]")} />
                </div>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile drawer */}
      <div
        className={cn(
          "fixed inset-0 z-30 md:hidden transition-all duration-400",
          mobileOpen ? "pointer-events-auto" : "pointer-events-none"
        )}
      >
        {/* Backdrop */}
        <div
          className={cn(
            "absolute inset-0 bg-p-bg/90 backdrop-blur-md transition-opacity duration-400",
            mobileOpen ? "opacity-100" : "opacity-0"
          )}
          onClick={() => setMobileOpen(false)}
        />
        {/* Panel */}
        <nav
          className={cn(
            "absolute top-[3.75rem] inset-x-0 bottom-0 flex flex-col px-8 pt-10 pb-8",
            "transition-all duration-400",
            mobileOpen ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-4"
          )}
          aria-label="Mobile navigation"
        >
          {navHrefs.map(({ href, key }, i) => {
            const active = pathname === href || pathname.startsWith(href + "/");
            return (
              <Link
                key={href}
                href={href}
                className={cn(
                  "font-ui text-[1.75rem] font-light py-3.5 border-b border-p-rule-2",
                  "transition-colors duration-200 tracking-tight",
                  active ? "text-p-green" : "text-p-ink hover:text-p-green",
                )}
                style={{ transitionDelay: `${i * 40}ms` }}
              >
                {t.nav[key]}
              </Link>
            );
          })}

          <div className="mt-auto flex items-center gap-3 pt-8">
            <LanguageToggle />
            <ThemeToggle />
          </div>
        </nav>
      </div>
    </>
  );
}
