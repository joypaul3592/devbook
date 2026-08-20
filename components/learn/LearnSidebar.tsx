"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useMemo, useState } from "react";
import { cn } from "@/lib/utils";
import { useLanguage } from "@/components/providers";
import { bi, curriculum, lessonCounts } from "@/lib/curriculum";
import { SearchIcon } from "@/components/icons/Icons";
import { lessonId, useLearnProgress } from "@/lib/learn-progress";

function CheckIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="3"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden
    >
      <path d="m5 13 4 4L19 7" />
    </svg>
  );
}

function ChevronIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden
    >
      <path d="m9 18 6-6-6-6" />
    </svg>
  );
}

export function LearnSidebar({ onNavigate }: { onNavigate?: () => void }) {
  const pathname = usePathname();
  const { t, locale } = useLanguage();
  const [query, setQuery] = useState("");
  /** Chapters the user has explicitly toggled — overrides the default open state. */
  const [toggled, setToggled] = useState<Record<string, boolean>>({});
  const { done, isDone } = useLearnProgress();
  const doneCount = done.length;

  const [, , activeChapter = "", activeTopic = ""] = pathname.split("/");
  const searching = query.trim().length > 0;

  const chapters = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return curriculum;

    return curriculum
      .map((c) => {
        const chapterHit = `${c.no} ${c.title.bn} ${c.title.en}`
          .toLowerCase()
          .includes(q);
        // Show only the matching lessons, unless the chapter title itself matched.
        const topics = chapterHit
          ? c.topics
          : c.topics.filter((tp) =>
              `${tp.title.bn} ${tp.title.en}`.toLowerCase().includes(q),
            );
        return { ...c, topics };
      })
      .filter((c) => c.topics.length > 0);
  }, [query]);

  return (
    <div className="flex flex-col h-full">
      {/* ── Sidebar head ───────────────────────────────────────────────── */}
      <div className="px-4 pt-4 pb-3.5 border-b border-border">
        <Link href="/learn" onClick={onNavigate} className="block group">
          <span className="font-ui text-[10.5px] tracking-[0.2em] uppercase text-muted-foreground">
            {t.learn.eyebrow}
          </span>
          <h2 className="font-serif text-[19px] leading-tight text-foreground mt-0.5 group-hover:text-primary ani2">
            {t.learn.title}
          </h2>
        </Link>

        <div className="mt-2.5 flex items-center gap-2">
          <div className="h-[3px] flex-1 rounded-full bg-muted overflow-hidden">
            <div
              className="h-full rounded-full bg-primary"
              style={{
                width: `${(doneCount / lessonCounts.total) * 100}%`,
              }}
            />
          </div>
          <span className="font-mono text-[11px] text-muted-foreground shrink-0 tabular-nums">
            {doneCount}/{lessonCounts.total}
          </span>
        </div>
      </div>

      {/* ── Search ─────────────────────────────────────────────────────── */}
      <div className="px-4 py-2.5 border-b border-border">
        <div className="relative">
          <SearchIcon className="size-4 absolute left-2.5 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none" />
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={t.learn.searchTopics}
            aria-label={t.learn.searchTopics}
            className={cn(
              "w-full h-9 pl-8 pr-2.5 rounded-lg text-[13.5px]",
              "bg-muted/60 border border-border text-foreground",
              "placeholder:text-muted-foreground",
              "focus:outline-none focus:border-primary/50 ani2",
            )}
          />
        </div>
      </div>

      {/* ── Chapters ───────────────────────────────────────────────────── */}
      <nav
        className="flex-1 overflow-y-auto px-2 py-2.5"
        aria-label={t.learn.menu}
      >
        {chapters.length === 0 && (
          <p className="px-2 py-6 text-[13.5px] text-muted-foreground">
            {t.learn.noResults}
          </p>
        )}

        <ul>
          {chapters.map((c) => {
            const isCurrent = c.slug === activeChapter;
            // Default: the chapter holding the open lesson is expanded.
            // While searching everything expands so matches are visible.
            const open = toggled[c.slug] ?? (searching || isCurrent);
            const finished = c.topics.filter((tp) =>
              isDone(lessonId(c.slug, tp.slug)),
            ).length;
            const chapterDone = finished === c.topics.length;

            return (
              <li key={c.slug}>
                {/* Chapter row — expands, never navigates */}
                <button
                  type="button"
                  onClick={() =>
                    setToggled((prev) => ({ ...prev, [c.slug]: !open }))
                  }
                  aria-expanded={open}
                  className={cn(
                    "group relative w-full flex items-start gap-2.5 rounded-lg py-2 pl-2.5 pr-1.5 text-left ani2",
                    isCurrent
                      ? "text-foreground bg-muted/70"
                      : "text-foreground hover:bg-muted",
                  )}
                >
                  {isCurrent && (
                    <span
                      className="absolute left-0 top-1.5 bottom-1.5 w-[2.5px] rounded-full bg-primary"
                      aria-hidden
                    />
                  )}

                  <span
                    className={cn(
                      "font-mono text-[11.5px] leading-[19px] shrink-0 tabular-nums",
                      isCurrent ? "text-primary" : "text-muted-foreground",
                    )}
                  >
                    {c.no}
                  </span>

                  <span className="min-w-0 flex-1 text-[13.5px] leading-[19px] font-medium text-pretty">
                    {bi(c.title, locale)}
                  </span>

                  {/* How much of this chapter the reader has finished */}
                  {chapterDone ? (
                    <span className="mt-[3px] shrink-0 size-3.5 center rounded-full bg-primary text-primary-foreground">
                      <CheckIcon className="size-2" />
                    </span>
                  ) : (
                    finished > 0 && (
                      <span className="mt-[2px] shrink-0 font-mono text-[10px] leading-4 text-muted-foreground tabular-nums">
                        {finished}/{c.topics.length}
                      </span>
                    )
                  )}

                  <ChevronIcon
                    className={cn(
                      "size-3.5 mt-[3px] shrink-0 text-muted-foreground/60 transition-transform duration-300 ease-out",
                      open && "rotate-90",
                    )}
                  />
                </button>

                {/* Lessons — grid trick gives a smooth auto-height collapse */}
                <div
                  className={cn(
                    "grid transition-[grid-template-rows,opacity] duration-300 ease-out",
                    open
                      ? "grid-rows-[1fr] opacity-100"
                      : "grid-rows-[0fr] opacity-0",
                  )}
                >
                  <div className="overflow-hidden">
                    <ul className="ml-[22px] my-1 border-l border-border">
                      {c.topics.map((tp) => {
                        const isOpenLesson =
                          isCurrent && tp.slug === activeTopic;
                        const read = isDone(lessonId(c.slug, tp.slug));
                        return (
                          <li key={tp.slug}>
                            <Link
                              href={`/learn/${c.slug}/${tp.slug}`}
                              onClick={onNavigate}
                              aria-current={isOpenLesson ? "page" : undefined}
                              className={cn(
                                "relative block -ml-px pl-3 pr-2 py-[6px] border-l",
                                "text-[12.5px] leading-[18px] ani2",
                                isOpenLesson
                                  ? "border-primary text-primary font-medium bg-primary/6 rounded-r-md"
                                  : "border-transparent text-muted-foreground hover:border-border hover:text-foreground",
                              )}
                            >
                              {read && (
                                <CheckIcon className="inline-block size-2.5 mr-1 -mt-px text-primary align-middle" />
                              )}
                              {bi(tp.title, locale)}
                              {tp.published && !read && !isOpenLesson && (
                                <span
                                  className="ml-1.5 inline-block size-1 rounded-full bg-primary/60 align-middle"
                                  aria-hidden
                                />
                              )}
                            </Link>
                          </li>
                        );
                      })}
                    </ul>
                  </div>
                </div>
              </li>
            );
          })}
        </ul>
      </nav>
    </div>
  );
}
