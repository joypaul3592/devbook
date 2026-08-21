"use client";

import { useEffect, useState, type ReactNode } from "react";
import { cn } from "@/lib/utils";
import { useLanguage } from "@/components/providers";
import { LearnSidebar } from "./LearnSidebar";
import { ThemeToggle } from "@/components/ui/ThemeToggle";

export function LearnShell({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false);
  const { t } = useLanguage();

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <div className="relative mx-auto max-w-400 w-full flex-1 flex">
      {/* ── Desktop sidebar ────────────────────────────────────────────── */}
      <aside
        className={cn(
          "hidden lg:block w-76 shrink-0",
          "border-r border-border",
        )}
      >
        <div className="sticky top-(--learn-top,0px) h-[calc(100dvh-var(--learn-top,0))] noBar overflow-y-auto">
          <LearnSidebar />
        </div>
      </aside>

      {/* ── Content ────────────────────────────────────────────────────── */}
      <div className="min-w-0 flex-1">{children}</div>

      <div className="absolute top-4 right-4 xl:right-6 z-40">
        <ThemeToggle />
      </div>

      {/* ── Mobile trigger ─────────────────────────────────────────────── */}
      <button
        type="button"
        onClick={() => setOpen(true)}
        className={cn(
          "lg:hidden fixed bottom-4 left-1/2 -translate-x-1/2 z-40",
          "flex items-center gap-2 h-11 px-5 rounded-full",
          "bg-foreground text-background shadow-lg ani2",
          "text-sm font-medium",
        )}
        aria-expanded={open}
      >
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          className="size-4"
          aria-hidden
        >
          <path d="M4 6h16M4 12h16M4 18h10" />
        </svg>
        {t.learn.menu}
      </button>

      {/* ── Mobile drawer ──────────────────────────────────────────────── */}
      <div
        className={cn(
          "lg:hidden fixed inset-0 z-50 transition-opacity duration-300",
          open ? "opacity-100" : "opacity-0 pointer-events-none",
        )}
      >
        <div
          className="absolute inset-0 bg-background/80 backdrop-blur-sm"
          onClick={() => setOpen(false)}
        />
        <div
          className={cn(
            "absolute inset-y-0 left-0 w-[86%] max-w-[20rem]",
            "bg-background border-r border-border shadow-2xl",
            "transition-transform duration-300",
            open ? "translate-x-0" : "-translate-x-full",
          )}
        >
          <button
            type="button"
            onClick={() => setOpen(false)}
            aria-label={t.nav.menuClose}
            className="absolute top-4 right-3 z-10 size-8 center rounded-lg text-muted-foreground hover:bg-muted ani2"
          >
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              className="size-4"
              aria-hidden
            >
              <path d="M18 6 6 18M6 6l12 12" />
            </svg>
          </button>
          <div className="h-full overflow-hidden">
            <LearnSidebar onNavigate={() => setOpen(false)} />
          </div>
        </div>
      </div>
    </div>
  );
}
