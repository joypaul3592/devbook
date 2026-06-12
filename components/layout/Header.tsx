"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useRef, useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import { ThemeToggle } from "@/components/ui/ThemeToggle";
import { LanguageToggle } from "@/components/ui/LanguageToggle";
import { useLanguage } from "@/components/providers";
import Container from "./Container";
import { SearchIcon } from "../icons/Icons";
import { Button } from "../button/Button";

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

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileOpen]);

  return (
    <>
      <header
        ref={headerRef}
        className={cn(
          "sticky top-0 inset-x-0 z-40 border-b border-border/0 transition-all duration-500",
          scrolled
            ? [
                "border-border/70",
                "bg-background/50",
                "backdrop-blur-xl",
                "backdrop-saturate-150",
              ].join(" ")
            : "bg-transparent",
        )}
      >
        <Container>
          <div className="between h-15">
            {/* Logo */}
            <Link
              href="/"
              data-header-logo
              aria-label={`DevBook — ${t.nav.home}`}
            >
              <span className="font-semibold text-2xl tracking-tight text-transparent bg-clip-text bg-linear-to-tl from-primary to-foreground">
                <span className="">Dev</span>Book
              </span>
            </Link>

            {/* Desktop nav */}
            <nav
              data-header-nav
              className="hidden md:flex items-center gap-0.5"
              aria-label="Main navigation"
            >
              {navHrefs.map(({ href, key }) => {
                const active =
                  pathname === href || pathname.startsWith(href + "/");
                return (
                  <Link
                    key={href}
                    href={href}
                    className={cn(
                      "relative px-3 py-1.5 ani2 text-sm rounded",
                      "tracking-wide",
                      active
                        ? "text-primary"
                        : "text-foreground hover:text-primary",
                    )}
                  >
                    {t.nav[key]}
                    {active && (
                      <span
                        className="absolute inset-x-2 -bottom-px h-px bg-primary rounded-full"
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
              <LanguageToggle />
              <Link href="/search" aria-label={t.nav.search}>
                <Button
                  variant="secondary"
                  size="icon-sm"
                  className="rounded-[11px]"
                >
                  <SearchIcon className="size-4" />
                </Button>
              </Link>

              <ThemeToggle />

              <Button
                variant="secondary"
                size="icon-sm"
                className="rounded-[11px] sm:hidden"
                onClick={() => setMobileOpen(!mobileOpen)}
                aria-expanded={mobileOpen}
                aria-label={mobileOpen ? t.nav.menuClose : t.nav.menuOpen}
              >
                <div className="relative w-4 h-3">
                  <span
                    className={cn(
                      "absolute left-0 top-1/2 block h-px w-4 bg-current transition-all duration-300 origin-center",
                      mobileOpen ? "rotate-45" : "-translate-y-1",
                    )}
                  />
                  <span
                    className={cn(
                      "absolute left-0 top-1/2 block h-px bg-current transition-all duration-300",
                      mobileOpen ? "w-0 opacity-0" : "w-3",
                    )}
                  />
                  <span
                    className={cn(
                      "absolute left-0 top-1/2 block h-px w-4 bg-current transition-all duration-300 origin-center",
                      mobileOpen ? "-rotate-45" : "translate-y-1",
                    )}
                  />
                </div>
              </Button>
            </div>
          </div>
        </Container>
      </header>

      {/* Mobile drawer */}
      <div
        className={cn(
          "fixed inset-0 z-30 md:hidden transition-all duration-400",
          mobileOpen ? "pointer-events-auto" : "pointer-events-none",
        )}
      >
        {/* Backdrop */}
        <div
          className={cn(
            "absolute inset-0 bg-background/90 backdrop-blur-md transition-opacity duration-400",
            mobileOpen ? "opacity-100" : "opacity-0",
          )}
          onClick={() => setMobileOpen(false)}
        />
        {/* Panel */}
        <nav
          className={cn(
            "absolute top-15 inset-x-0 bottom-0 flex flex-col px-8 pt-10 pb-8",
            "transition-all duration-400",
            mobileOpen
              ? "opacity-100 translate-y-0"
              : "opacity-0 -translate-y-4",
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
                  "font-ui text-xl font-light py-3.5 border-b border-border",
                  "transition-colors duration-200 tracking-tight",
                  active
                    ? "text-primary"
                    : "text-foreground hover:text-primary",
                )}
                style={{ transitionDelay: `${i * 40}ms` }}
              >
                {t.nav[key]}
              </Link>
            );
          })}
        </nav>
      </div>
    </>
  );
}
