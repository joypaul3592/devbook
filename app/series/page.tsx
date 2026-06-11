import type { Metadata } from "next";
import Link from "next/link";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { FadeIn, FadeInStagger, FadeInChild } from "@/components/motion/FadeIn";
import { series, articles } from "@/lib/data";

export const metadata: Metadata = {
  title: "সিরিজ",
  description: "ধারাবাহিক শিক্ষার সংগ্রহ।",
};

export default function SeriesPage() {
  return (
    <>
      <Header />

      <main id="main-content" className="pt-24 pb-24">
        <div className="nb-container">
          <FadeIn>
            <div className="py-12 border-b border-nb-border mb-12">
              <div className="flex items-center gap-3 mb-4">
                <div className="nb-reading-marker" />
                <span className="font-bengali text-xs text-nb-subtle tracking-widest uppercase">ধারাবাহিক</span>
              </div>
              <h1 className="font-serif text-3xl md:text-4xl text-nb-text mb-3">শেখার সিরিজ</h1>
              <p className="font-bengali text-nb-muted leading-relaxed">
                বিষয়গুলো গভীরভাবে জানতে — ধাপে ধাপে।
              </p>
            </div>
          </FadeIn>

          <FadeInStagger className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {series.map((s) => {
              const publishedCount = s.parts.filter((p) => p.published).length;
              const progressPct = Math.round((publishedCount / s.totalParts) * 100);

              return (
                <FadeInChild key={s.slug}>
                  <div className="rounded-xl border border-nb-border bg-nb-surface overflow-hidden hover:border-nb-accent/30 hover:shadow-[var(--nb-shadow)] transition-all duration-300">
                    <div className={`h-36 bg-gradient-to-br ${s.gradient} p-6 flex flex-col justify-end`}>
                      <h2 className="font-serif text-2xl text-white font-normal">{s.title}</h2>
                      <p className="font-sans text-xs text-white/60 mt-1">{s.titleEn}</p>
                    </div>

                    <div className="p-5">
                      <p className="font-bengali text-sm text-nb-muted mb-5 leading-relaxed">{s.description}</p>

                      <div className="mb-5">
                        <div className="flex justify-between items-center mb-1.5">
                          <span className="font-bengali text-xs text-nb-subtle">{publishedCount}/{s.totalParts} পর্ব</span>
                          <span className="font-bengali text-xs text-nb-accent">{progressPct}%</span>
                        </div>
                        <div className="h-1 rounded-full bg-nb-border-2 overflow-hidden">
                          <div
                            className="h-full rounded-full bg-nb-accent transition-all duration-700"
                            style={{ width: `${progressPct}%` }}
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        {s.parts.map((part) => (
                          <div key={part.part} className="flex items-center gap-3">
                            <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[9px] font-bold shrink-0 ${part.published ? "bg-nb-accent text-nb-accent-fg" : "bg-nb-border-2 text-nb-subtle"
                              }`}>
                              {part.part}
                            </span>
                            {part.published ? (
                              <Link
                                href={`/articles/${part.slug}`}
                                className="font-bengali text-xs text-nb-text hover:text-nb-accent transition-colors"
                              >
                                {part.title}
                              </Link>
                            ) : (
                              <span className="font-bengali text-xs text-nb-subtle">
                                {part.title}
                                <span className="ml-1.5 text-[10px] opacity-50">শীঘ্রই</span>
                              </span>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </FadeInChild>
              );
            })}
          </FadeInStagger>
        </div>
      </main>

      <Footer />
    </>
  );
}
