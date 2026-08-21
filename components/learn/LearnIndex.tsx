"use client";

import Link from "next/link";
import type { ReactNode } from "react";
import { useLanguage } from "@/components/providers";
import { cn } from "@/lib/utils";
import { bi, curriculum, lessonCounts, lessons } from "@/lib/curriculum";
import { ChapterIcon } from "./ChapterIcons";
import {
  lessonId,
  nextUnfinished,
  rankFor,
  useLearnProgress,
} from "@/lib/learn-progress";

/**
 * One horizontal band of the article column — the same measure the lesson
 * pages use, so the atlas and a lesson line up when you move between them.
 * The gutter lives here rather than on the column so a rule drawn on the
 * column runs edge to edge while the text stays centred at reading width.
 */
function Band({ children }: { children: ReactNode }) {
  return (
    <div className="px-5 sm:px-10 xl:px-14">
      <div className="max-w-3xl mx-auto">{children}</div>
    </div>
  );
}

function ArrowIcon({ className }: { className?: string }) {
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
      <path d="M5 12h14M13 6l6 6-6 6" />
    </svg>
  );
}

/**
 * A section label in the right rail.
 *
 * Latin type carries the small-caps, wide-tracked treatment well. Bangla does
 * not — letter-spacing pulls the conjuncts apart and the label stops reading as
 * a single word — so the spacing is picked per script instead of baked in.
 */
function RailLabel({
  children,
  latin,
}: {
  children: ReactNode;
  latin: boolean;
}) {
  return (
    <p
      className={cn(
        "mb-3 text-muted-foreground",
        latin
          ? "font-ui text-[10.5px] font-semibold uppercase tracking-[0.16em]"
          : "text-[12.5px] font-medium",
      )}
    >
      {children}
    </p>
  );
}

export function LearnIndex() {
  const { t, locale } = useLanguage();
  const { done, ready, isDone } = useLearnProgress();
  const latin = locale === "en";

  const doneCount = ready ? done.length : 0;
  const percent = Math.round((doneCount / lessonCounts.total) * 100);
  const rank = rankFor(percent);

  const chaptersDone = ready
    ? curriculum.filter((c) =>
        c.topics.every((tp) => isDone(lessonId(c.slug, tp.slug))),
      ).length
    : 0;

  const resume = nextUnfinished(ready ? done : []);
  const resumeHref = `/learn/${resume.chapter.slug}/${resume.topic.slug}`;
  const recent = lessons
    .filter((l) => l.topic.published)
    .slice(-4)
    .reverse();

  return (
    <div className="flex">
      {/* ── Article column ───────────────────────────────────────────── */}
      <div className="min-w-0 flex-1 pt-10 pb-28 lg:pb-10">
        {/* The rule spans the whole column; only the content inside is centred */}
        <div className="pb-6.5 mb-7 border-b border-border">
          <Band>
            <header>
              <span className="font-ui text-[11px] tracking-[0.18em] uppercase text-muted-foreground">
                {t.learn.eyebrow}
              </span>

              <h1 className="mt-3 font-serif text-3xl md:text-[2.5rem] leading-[1.15] text-foreground font-medium">
                {t.learn.title}
              </h1>

              <p className="mt-4 text-[15.5px] text-muted-foreground leading-relaxed">
                {t.learn.desc}
              </p>

              <p className="mt-5 font-mono text-[11px] text-muted-foreground/80 tabular-nums">
                {curriculum.length} {t.learn.chapters} · {lessonCounts.total}{" "}
                {t.learn.topics}
              </p>
            </header>
          </Band>
        </div>

        {/* ── Chapters — main menu only, no topics ───────────────────── */}
        <Band>
          <ul className="grid gap-4 sm:grid-cols-2">
            {curriculum.map((c) => {
              const written = c.topics.filter((tp) => tp.published).length;

              return (
                <li key={c.slug}>
                  <Link
                    href={`/learn/${c.slug}`}
                    className="group relative h-full flex flex-col rounded-xl border border-border p-5 sm:p-6 hover:border-primary/40 hover:bg-muted/25 ani2"
                  >
                    {/* Icon + chapter number — topic count sits at the far right */}
                    <div className="flex items-center gap-2.5">
                      <span className="size-9 center rounded-xl border border-border text-muted-foreground group-hover:border-primary/40 group-hover:text-primary ani2">
                        <ChapterIcon slug={c.slug} className="size-4.5" />
                      </span>
                      <span className="font-mono text-[10.5px] text-muted-foreground/80 tabular-nums">
                        {c.no}
                      </span>
                      {written > 0 && (
                        <span
                          className="size-1 rounded-full bg-primary"
                          title={t.learn.written}
                          aria-hidden
                        />
                      )}

                      <span className="ml-auto font-mono text-[11px] text-muted-foreground/80 tabular-nums">
                        {c.topics.length} {t.learn.topics}
                      </span>
                    </div>

                    {/* Title */}
                    <h2 className="mt-4 font-serif text-[20px] leading-snug text-foreground group-hover:text-primary text-pretty ani2">
                      {bi(c.title, locale)}
                    </h2>

                    {/* One or two lines of description */}
                    <p className="mt-2 text-[13.5px] leading-relaxed text-muted-foreground line-clamp-2">
                      {bi(c.summary, locale)}
                    </p>
                  </Link>
                </li>
              );
            })}
          </ul>
        </Band>
      </div>

      {/* ── Your journey — sits where a lesson keeps "on this page" ───── */}
      <aside className="hidden xl:block w-76 shrink-0 border-l border-border">
        <div className="sticky top-(--learn-top,0px) max-h-[calc(100dvh-var(--learn-top,0))] overflow-y-auto noBar px-5 py-5">
          <RailLabel latin={latin}>{t.learn.yourJourney}</RailLabel>

          {/* How far through the atlas the reader is */}
          <div className="flex items-baseline gap-1.5">
            <span className="font-serif text-4xl text-foreground tabular-nums">
              {percent}
            </span>
            <span className="font-mono text-[12px] text-muted-foreground">
              % {t.learn.complete}
            </span>
          </div>

          {/* The slider the sidebar used to carry — bar plus the raw count */}
          <div className="mt-4 flex items-center gap-2">
            <div className="h-1 flex-1 rounded-full bg-muted overflow-hidden">
              <div
                className="h-full rounded-full bg-primary transition-[width] duration-500"
                style={{ width: `${percent}%` }}
              />
            </div>
            <span className="shrink-0 font-mono text-[11px] text-muted-foreground tabular-nums">
              {doneCount}/{lessonCounts.total}
            </span>
          </div>

          <dl className="mt-6 space-y-2.5 text-[12.5px]">
            <div className="flex items-center justify-between">
              <dt className="text-muted-foreground">{t.learn.rank}</dt>
              <dd className="text-foreground">{bi(rank, locale)}</dd>
            </div>
            <div className="flex items-center justify-between">
              <dt className="text-muted-foreground">{t.learn.chaptersDone}</dt>
              <dd className="font-mono text-foreground tabular-nums">
                {chaptersDone}/{curriculum.length}
              </dd>
            </div>
          </dl>

          {/* Where to pick back up — the first lesson not yet finished */}
          <div className="mt-7 pt-6 -mx-5 px-5 border-t border-border">
            <RailLabel latin={latin}>
              {doneCount > 0 ? t.learn.upNext : t.learn.startJourney}
            </RailLabel>
            <Link
              href={resumeHref}
              className="group block text-[13.5px] leading-snug text-foreground hover:text-primary ani2"
            >
              {bi(resume.topic.title, locale)}
              <span className="mt-2 flex items-center gap-1.5 text-[12px] text-muted-foreground group-hover:text-primary ani2">
                {t.learn.continueRead}
                <ArrowIcon className="size-3 group-hover:translate-x-0.5 ani2" />
              </span>
            </Link>
          </div>

          {/* ── Chapter map — the whole atlas as one glance ───────────── */}
          <div className="mt-7 pt-6 -mx-5 px-5 border-t border-border">
            <RailLabel latin={latin}>{t.learn.chapterMap}</RailLabel>

            <ul className="grid grid-cols-6 gap-1.5">
              {curriculum.map((c) => {
                const finished = ready
                  ? c.topics.filter((tp) => isDone(lessonId(c.slug, tp.slug)))
                      .length
                  : 0;
                const fill = Math.round((finished / c.topics.length) * 100);
                const complete = fill === 100;

                return (
                  <li key={c.slug}>
                    <Link
                      href={`/learn/${c.slug}`}
                      title={`${c.no} · ${bi(c.title, locale)} — ${finished}/${c.topics.length}`}
                      className={cn(
                        "relative center aspect-square rounded-md border overflow-hidden ani2",
                        complete
                          ? "border-primary/50"
                          : "border-border hover:border-primary/50",
                      )}
                    >
                      {/* Fills from the bottom as the chapter gets read */}
                      <span
                        aria-hidden
                        className="absolute inset-x-0 bottom-0 bg-primary/20"
                        style={{ height: `${fill}%` }}
                      />
                      <span
                        className={cn(
                          "relative font-mono text-[10px] tabular-nums",
                          complete ? "text-primary" : "text-muted-foreground",
                        )}
                      >
                        {c.no}
                      </span>
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>

          {/* ── The lessons written most recently ────────────────────── */}
          {recent.length > 0 && (
            <div className="mt-7 pt-6 -mx-5 px-5 border-t border-border">
              <RailLabel latin={latin}>{t.learn.recentlyAdded}</RailLabel>

              <ul className="space-y-4">
                {recent.map((l) => (
                  <li key={`${l.chapter.slug}/${l.topic.slug}`}>
                    <Link
                      href={`/learn/${l.chapter.slug}/${l.topic.slug}`}
                      className="group block"
                    >
                      {/* Which chapter it belongs to, on one quiet line */}
                      <span className="flex items-center gap-1.5 text-[11px] text-muted-foreground/70">
                        <span className="font-mono tabular-nums">
                          {l.chapter.no}
                        </span>
                        <span className="truncate">
                          {bi(l.chapter.title, locale)}
                        </span>
                      </span>
                      <span className="mt-1 block text-[13px] leading-snug text-foreground group-hover:text-primary ani2">
                        {bi(l.topic.title, locale)}
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </aside>
    </div>
  );
}
