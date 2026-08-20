"use client";

import Link from "next/link";
import { useLanguage } from "@/components/providers";
import { bi, curriculum, lessonCounts } from "@/lib/curriculum";
import { ChapterIcon } from "./ChapterIcons";

export function LearnIndex() {
  const { t, locale } = useLanguage();

  return (
    <div className="px-5 sm:px-10 xl:px-14 py-10 pb-28 lg:pb-20">
      {/* ── Title ──────────────────────────────────────────────────────── */}
      <header className="max-w-3xl pb-8 mb-8 border-b border-border">
        <span className="font-ui text-[11px] tracking-[0.18em] uppercase text-muted-foreground">
          {t.learn.eyebrow}
        </span>
        <h1 className="font-serif text-4xl md:text-5xl text-foreground font-medium mt-3 leading-tight">
          {t.learn.title}
        </h1>
        <p className="mt-4 text-[16px] text-muted-foreground leading-relaxed">
          {t.learn.desc}
        </p>
        <p className="mt-5 font-mono text-[11px] text-muted-foreground/80 tabular-nums">
          {curriculum.length} {t.learn.chapters} · {lessonCounts.total}{" "}
          {t.learn.topics}
        </p>
      </header>

      {/* ── Chapters — main menu only, no topics ───────────────────────── */}
      <ul className="grid gap-4 sm:grid-cols-2 max-w-5xl">
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
    </div>
  );
}
