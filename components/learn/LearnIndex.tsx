"use client";

import Link from "next/link";
import { useLanguage } from "@/components/providers";
import { bi, curriculum, lessonCounts } from "@/lib/curriculum";

export function LearnIndex() {
  const { t, locale } = useLanguage();

  return (
    <div className="px-5 sm:px-10 xl:px-14 py-10 pb-28 lg:pb-20">
      <header className="max-w-3xl pb-8 mb-10 border-b border-border">
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
          {t.learn.topics} · {lessonCounts.published} {t.learn.progress}
        </p>
      </header>

      <div className="grid gap-x-10 gap-y-9 md:grid-cols-2 xl:grid-cols-3 max-w-6xl">
        {curriculum.map((c) => (
          <section key={c.slug}>
            <div className="flex items-baseline gap-2.5 pb-2 mb-2.5 border-b border-border">
              <span className="font-mono text-xs text-muted-foreground tabular-nums">
                {c.no}
              </span>
              <h2 className="font-serif text-[17px] leading-snug text-foreground text-pretty">
                {bi(c.title, locale)}
              </h2>
            </div>

            <ul>
              {c.topics.map((tp) => (
                <li key={tp.slug}>
                  <Link
                    href={`/learn/${c.slug}/${tp.slug}`}
                    className="group flex items-center gap-2 py-[3px] text-[13.5px] leading-5 text-muted-foreground hover:text-primary ani2"
                  >
                    <span
                      className={
                        tp.published
                          ? "size-1 rounded-full bg-primary shrink-0"
                          : "size-1 rounded-full bg-border shrink-0"
                      }
                      aria-hidden
                    />
                    <span className="min-w-0">{bi(tp.title, locale)}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        ))}
      </div>
    </div>
  );
}
