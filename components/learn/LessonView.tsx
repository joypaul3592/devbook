"use client";

import Image from "next/image";
import Link from "next/link";
import { type ReactNode } from "react";
import { cn } from "@/lib/utils";
import { useLanguage } from "@/components/providers";
import { bi, getLesson, getLessonNeighbours } from "@/lib/curriculum";
import type { ChapterHeading, LessonCover } from "@/app/learn/_content";
import { LineNav } from "@/components/ui/LineNav";
import {
  lessonId,
  useLearnProgress,
  useVisitLesson,
} from "@/lib/learn-progress";

/**
 * One horizontal band of the article column.
 *
 * The gutter lives here rather than on the column so that a rule drawn on the
 * column runs edge to edge, while the text it separates stays centred at
 * reading width.
 */
function Band({ children }: { children: ReactNode }) {
  return (
    <div className="px-5 sm:px-10 xl:px-14">
      <div className="max-w-3xl mx-auto">{children}</div>
    </div>
  );
}

export function LessonView({
  chapterSlug,
  topicSlug,
  headings,
  cover,
  children,
}: {
  chapterSlug: string;
  topicSlug: string;
  headings: ChapterHeading[];
  cover?: LessonCover;
  children: ReactNode;
}) {
  const { t, locale } = useLanguage();
  const lesson = getLesson(chapterSlug, topicSlug);
  const { prev, next } = getLessonNeighbours(chapterSlug, topicSlug);
  const id = lessonId(chapterSlug, topicSlug);
  const { ready, isDone, toggleDone } = useLearnProgress();
  const read = ready && isDone(id);

  useVisitLesson(id);

  if (!lesson) return null;

  const { chapter, topic } = lesson;

  return (
    <div className="flex">
      {/* ── Article column ───────────────────────────────────────────── */}
      <div className="min-w-0 flex-1 pt-10 pb-16 lg:pb-10">
        {/* The rule spans the whole column; only the content inside is centred */}
        <div className="pb-7 mb-9 border-b border-border">
          <Band>
            <header>
              {/* Which chapter this lesson sits in */}
              <p className="flex items-center gap-2 text-[12.5px] text-muted-foreground">
                <span className="font-mono text-[11px] px-1.5 py-0.5 rounded bg-muted tabular-nums">
                  {chapter.no}
                </span>
                {bi(chapter.title, locale)}
              </p>

              <h1 className="mt-3 font-serif text-3xl md:text-[2.5rem] leading-[1.15] text-foreground font-medium">
                {bi(topic.title, locale)}
              </h1>

              {!topic.published && (
                <span className="mt-4 inline-block text-[11px] px-2 py-0.5 rounded-full border border-border text-muted-foreground">
                  {t.learn.soon}
                </span>
              )}
            </header>
          </Band>
        </div>

        <Band>
          {/* Cover image, when the lesson ships one */}
          {cover && (
            <figure className="-mt-3 mb-9 overflow-hidden rounded-2xl border border-border bg-muted">
              {/* Statically imported, so width, height and the blur
                  placeholder all come from the file itself */}
              <Image
                src={cover.src}
                alt={bi(cover.alt, locale)}
                placeholder="blur"
                priority
                sizes="(min-width: 1024px) 48rem, 100vw"
                className="w-full h-auto"
              />
            </figure>
          )}

          {children}

          {/* Mark the lesson finished — this is what drives the atlas progress */}
          <div className="mt-14 flex justify-center">
            <button
              type="button"
              onClick={() => toggleDone(id)}
              aria-pressed={read}
              className={cn(
                "group inline-flex items-center gap-2.5 h-11 pl-3.5 pr-5 rounded-full border text-[13.5px] font-medium ani2",
                read
                  ? "border-primary/45 bg-primary/8 text-primary"
                  : "border-border text-muted-foreground hover:border-primary/45 hover:text-foreground",
              )}
            >
              <span
                className={cn(
                  "size-5 center rounded-full border ani2",
                  read
                    ? "bg-primary border-primary text-primary-foreground"
                    : "border-muted-foreground/45 group-hover:border-primary",
                )}
              >
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="3"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className={cn("size-3 ani2", read ? "opacity-100" : "opacity-25")}
                  aria-hidden
                >
                  <path d="m5 13 4 4L19 7" />
                </svg>
              </span>
              {read ? t.learn.markUndone : t.learn.markDone}
            </button>
          </div>
        </Band>

        {/* Prev / next lesson — same full-width rule as the header */}
        <div className="mt-10 pt-8 border-t border-border">
          <Band>
            <nav className="grid gap-3 sm:grid-cols-2">
              {prev ? (
                <Link
                  href={`/learn/${prev.chapter.slug}/${prev.topic.slug}`}
                  className="group rounded-xl border border-border p-4 hover:border-primary/40 hover:bg-muted/40 ani2"
                >
                  <span className="block font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
                    ← {t.learn.prev}
                  </span>
                  <span className="mt-1.5 block text-sm text-foreground group-hover:text-primary ani2">
                    {bi(prev.topic.title, locale)}
                  </span>
                </Link>
              ) : (
                <span />
              )}

              {next && (
                <Link
                  href={`/learn/${next.chapter.slug}/${next.topic.slug}`}
                  className="group rounded-xl border border-border p-4 text-right hover:border-primary/40 hover:bg-muted/40 ani2 sm:col-start-2"
                >
                  <span className="block font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
                    {t.learn.next} →
                  </span>
                  <span className="mt-1.5 block text-sm text-foreground group-hover:text-primary ani2">
                    {bi(next.topic.title, locale)}
                  </span>
                </Link>
              )}
            </nav>
          </Band>
        </div>
      </div>

      {/* ── On this page ─────────────────────────────────────────────── */}
      {headings.length > 0 && (
        <aside className="hidden xl:block w-76 shrink-0 border-l border-border">
          <div className="sticky top-[var(--learn-top,0px)] max-h-[calc(100dvh-var(--learn-top,0px))] overflow-y-auto noBar px-7 py-10">
            <LineNav
              title={t.learn.onThisPage}
              icon={null}
              indicator="segment"
              rowHeight={44}
              items={headings.map((h) => ({
                id: h.id,
                label: bi(h.label, locale),
              }))}
            />
          </div>
        </aside>
      )}
    </div>
  );
}

/** Rendered in place of the article when a lesson has no body yet. */
export function LessonComingSoon({
  chapterSlug,
  topicSlug,
}: {
  chapterSlug: string;
  topicSlug: string;
}) {
  const { t, locale } = useLanguage();
  const lesson = getLesson(chapterSlug, topicSlug);
  if (!lesson) return null;

  const siblings = lesson.chapter.topics.filter(
    (tp) => tp.slug !== topicSlug,
  );

  return (
    <div className="doc-prose">
      <div className="rounded-xl border border-dashed border-border p-6 bg-muted/30">
        <h2 className="font-serif text-xl text-foreground m-0">
          {t.learn.comingTitle}
        </h2>
        <p className="mt-2 text-sm text-muted-foreground">
          {t.learn.comingDesc}
        </p>
      </div>

      <h3>{t.learn.inThisChapter}</h3>
      <ul className="grid sm:grid-cols-2 gap-x-6">
        {siblings.map((tp) => (
          <li key={tp.slug} className="text-[15px]">
            <Link href={`/learn/${lesson.chapter.slug}/${tp.slug}`}>
              {bi(tp.title, locale)}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
