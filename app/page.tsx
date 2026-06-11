"use client";

import { useRef } from "react";
import Link from "next/link";
import { useGSAP } from "@gsap/react";
import { gsap, ScrollTrigger, ease } from "@/lib/gsap";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { ArticleCard } from "@/components/blog/ArticleCard";
import { CategoryCard } from "@/components/blog/CategoryCard";
import { JournalEntryCard } from "@/components/blog/JournalEntryCard";
import { FeaturedArticle } from "@/components/blog/FeaturedArticle";
import { NewsletterForm } from "@/components/blog/NewsletterForm";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { useLanguage } from "@/components/providers";
import {
  articles,
  categories,
  journalEntries,
  series,
  getFeaturedArticle,
  getLatestArticles,
} from "@/lib/data";

gsap.registerPlugin(useGSAP, ScrollTrigger);

export default function HomePage() {
  const mainRef = useRef<HTMLElement>(null);
  const { t } = useLanguage();

  const featured = getFeaturedArticle();
  const latest = getLatestArticles(5).filter((a) => !a.featured);
  const recentJournal = journalEntries.slice(0, 4);
  const featuredCats = categories.slice(0, 6);

  /* ── GSAP: Hero entrance + all ScrollTrigger reveals ─────────────────── */
  useGSAP(
    () => {
      /* Hero — staggered entrance */
      const heroTl = gsap.timeline({ defaults: { ease: ease.out } });
      heroTl
        .from("[data-hero-eyebrow]", { y: 16, autoAlpha: 0, duration: 0.6 })
        .from("[data-hero-avatar]", { scale: 0.85, autoAlpha: 0, duration: 0.55 }, "-=0.35")
        .from("[data-hero-title]", { y: 24, autoAlpha: 0, duration: 0.7 }, "-=0.4")
        .from("[data-hero-bio]", { y: 16, autoAlpha: 0, duration: 0.6 }, "-=0.45")
        .from("[data-hero-tags] span", {
          y: 8, autoAlpha: 0, duration: 0.45, stagger: 0.06,
        }, "-=0.4")
        .from("[data-hero-cta] > *", {
          y: 8, autoAlpha: 0, duration: 0.45, stagger: 0.08,
        }, "-=0.35");

      /* Scroll reveals — sections */
      const sections = document.querySelectorAll<HTMLElement>("[data-section]");
      sections.forEach((section) => {
        const label = section.querySelector("[data-section-label]");
        const items = section.querySelectorAll<HTMLElement>("[data-section-item]");

        const stTl = gsap.timeline({
          scrollTrigger: {
            trigger: section,
            start: "top 82%",
            toggleActions: "play none none none",
          },
        });

        if (label) {
          stTl.from(label, { y: 10, autoAlpha: 0, duration: 0.5, ease: ease.out });
        }
        if (items.length) {
          stTl.from(items, {
            y: 22,
            autoAlpha: 0,
            duration: 0.6,
            stagger: 0.07,
            ease: ease.out,
          }, "-=0.25");
        }
      });

      /* Series progress bars — animate width on scroll */
      const bars = document.querySelectorAll<HTMLElement>("[data-progress-bar]");
      bars.forEach((bar) => {
        const target = bar.dataset.progressBar ?? "0";
        gsap.fromTo(
          bar,
          { width: "0%" },
          {
            width: `${target}%`,
            duration: 1.2,
            ease: ease.inOut,
            scrollTrigger: {
              trigger: bar,
              start: "top 90%",
              toggleActions: "play none none none",
            },
          }
        );
      });
    },
    { scope: mainRef }
  );

  return (
    <>
      <Header />

      <main ref={mainRef} id="main-content" className="flex-1">

        {/* ══ HERO ════════════════════════════════════════════════════════ */}
        <section className="pt-32 pb-24 md:pt-40 md:pb-32">
          <div className="p-container">
            <div className="max-w-[680px]">

              {/* Eyebrow */}
              <div
                data-hero-eyebrow
                className="flex items-center gap-3 mb-9"
                style={{ visibility: "hidden" }}
              >
                <span className="p-marker" aria-hidden />
                <span className="font-ui text-[0.6875rem] text-p-ink-4 tracking-[0.14em] uppercase">
                  {t.home.eyebrow}
                </span>
              </div>

              {/* Avatar + headline row */}
              <div className="flex items-start gap-5 mb-7">
                <div
                  data-hero-avatar
                  className={[
                    "w-14 h-14 rounded-[10px] shrink-0 mt-0.5",
                    "bg-gradient-to-br from-p-green/25 via-p-surface-2 to-p-indigo/20",
                    "border border-p-rule flex items-center justify-center",
                  ].join(" ")}
                  style={{ visibility: "hidden" }}
                >
                  <span className="font-serif text-2xl text-p-green italic">জ</span>
                </div>

                <h1
                  data-hero-title
                  className="font-serif text-[2.25rem] md:text-[2.75rem] text-p-ink leading-[1.15] tracking-[-0.03em]"
                  style={{ visibility: "hidden" }}
                >
                  {t.home.headline1}
                  <br />
                  <em className="text-p-green not-italic">{t.home.headline2}</em>
                </h1>
              </div>

              {/* Bio */}
              <p
                data-hero-bio
                className="font-bengali text-[1.0625rem] text-p-ink-3 leading-[1.85] mb-7 max-w-[560px]"
                style={{ visibility: "hidden" }}
              >
                {t.home.bio}
              </p>

              {/* Current focus tags */}
              <div
                data-hero-tags
                className="flex flex-wrap items-center gap-2 mb-10"
                style={{ visibility: "hidden" }}
              >
                <span className="p-ts mr-1">{t.home.currentlyOn}</span>
                {["Next.js 16", "Design Systems", "TypeScript"].map((f) => (
                  <span
                    key={f}
                    className="font-ui text-[0.75rem] text-p-green bg-[var(--p-green-soft)] border border-[var(--p-green-mid)] px-2.5 py-0.5 rounded-full"
                  >
                    {f}
                  </span>
                ))}
              </div>

              {/* CTAs */}
              <div
                data-hero-cta
                className="flex flex-wrap gap-3"
                style={{ visibility: "hidden" }}
              >
                <Button href="/articles" variant="primary">{t.home.readArticles}</Button>
                <Button href="/about" variant="secondary">{t.home.aboutMe}</Button>
              </div>
            </div>
          </div>
        </section>

        {/* ══ FEATURED ARTICLE ════════════════════════════════════════════ */}
        {featured && (
          <section className="pb-24" data-section>
            <div className="p-container">
              <div data-section-label style={{ visibility: "hidden" }}>
                <div className="p-chapter mb-8">
                  <span>{t.home.featuredLabel}</span>
                </div>
              </div>
              <div data-section-item style={{ visibility: "hidden" }}>
                <FeaturedArticle article={featured} />
              </div>
            </div>
          </section>
        )}

        {/* ══ LATEST ARTICLES ═════════════════════════════════════════════ */}
        <section className="pb-24" data-section>
          <div className="p-container">
            {/* Section header */}
            <div
              data-section-label
              className="flex items-center justify-between mb-8"
              style={{ visibility: "hidden" }}
            >
              <div className="p-chapter flex-1"><span>{t.home.latestLabel}</span></div>
              <Link
                href="/articles"
                className="font-ui text-[0.75rem] text-p-ink-3 hover:text-p-green transition-colors duration-200 ml-5 shrink-0 flex items-center gap-1.5"
              >
                {t.home.seeAll}
                <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                  <path d="M2 5h6M5.5 2L9 5l-3.5 3" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </Link>
            </div>

            {/* Grid: 2 cards + sidebar */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-5">
                {latest.slice(0, 4).map((article) => (
                  <div key={article.slug} data-section-item style={{ visibility: "hidden" }}>
                    <ArticleCard article={article} />
                  </div>
                ))}
              </div>

              {/* Sidebar */}
              <div className="lg:col-span-1">
                <div className="sticky top-24 rounded-xl border border-p-rule bg-p-surface p-5" style={{ boxShadow: "var(--shadow-paper)" }}>
                  <h3 className="font-ui text-[0.6875rem] text-p-ink-4 uppercase tracking-[0.12em] mb-4 pb-3 border-b border-p-rule">
                    {t.home.moreArticles}
                  </h3>
                  {articles.slice(0, 5).map((article) => (
                    <ArticleCard key={article.slug} article={article} variant="compact" />
                  ))}
                  <div className="mt-5">
                    <Button href="/articles" variant="secondary" className="w-full justify-center text-[0.8125rem]">
                      {t.home.allArticles}
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ══ CATEGORIES ══════════════════════════════════════════════════ */}
        <section className="py-20 bg-p-surface/60 border-y border-p-rule" data-section>
          <div className="p-container">
            <div
              data-section-label
              className="flex items-center justify-between mb-8"
              style={{ visibility: "hidden" }}
            >
              <div className="p-chapter flex-1"><span>{t.home.categoriesLabel}</span></div>
              <Link
                href="/categories"
                className="font-ui text-[0.75rem] text-p-ink-3 hover:text-p-green transition-colors duration-200 ml-5 shrink-0"
              >
                {t.home.seeAllCats}
              </Link>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {featuredCats.map((cat) => (
                <div key={cat.slug} data-section-item style={{ visibility: "hidden" }}>
                  <CategoryCard category={cat} />
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ══ DEVELOPER JOURNAL ═══════════════════════════════════════════ */}
        <section className="py-24" data-section>
          <div className="p-container">
            <div
              data-section-label
              className="flex items-center justify-between mb-4"
              style={{ visibility: "hidden" }}
            >
              <div className="p-chapter flex-1"><span>{t.home.journalLabel}</span></div>
              <Link
                href="/journal"
                className="font-ui text-[0.75rem] text-p-ink-3 hover:text-p-green transition-colors duration-200 ml-5 shrink-0"
              >
                {t.home.seeAll} →
              </Link>
            </div>

            <p
              data-section-item
              className="font-bengali text-[0.9375rem] text-p-ink-3 mb-10 max-w-md leading-relaxed"
              style={{ visibility: "hidden" }}
            >
              {t.home.journalDesc}
            </p>

            <div className="max-w-xl" data-section-item style={{ visibility: "hidden" }}>
              {recentJournal.map((entry) => (
                <JournalEntryCard key={entry.id} entry={entry} />
              ))}
            </div>
          </div>
        </section>

        {/* ══ SERIES ══════════════════════════════════════════════════════ */}
        <section className="py-20 bg-p-surface/60 border-y border-p-rule" data-section>
          <div className="p-container">
            <div
              data-section-label
              className="mb-10"
              style={{ visibility: "hidden" }}
            >
              <div className="p-chapter"><span>{t.home.seriesLabel}</span></div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {series.map((s) => {
                const published = s.parts.filter((p) => p.published).length;
                const pct = Math.round((published / s.totalParts) * 100);

                return (
                  <div
                    key={s.slug}
                    data-section-item
                    className="rounded-xl border border-p-rule bg-p-surface overflow-hidden"
                    style={{ visibility: "hidden", boxShadow: "var(--shadow-paper)" }}
                  >
                    {/* Gradient header */}
                    <div className={`h-28 bg-gradient-to-br ${s.gradient} relative overflow-hidden`}>
                      <div className="absolute inset-0 flex flex-col justify-end p-5">
                        <h3 className="font-serif text-xl text-white font-normal leading-snug drop-shadow-sm">
                          {s.title}
                        </h3>
                        <p className="font-ui text-[0.6875rem] text-white/60 mt-0.5 tracking-wide">
                          {s.titleEn}
                        </p>
                      </div>
                    </div>

                    <div className="p-5">
                      <p className="font-bengali text-[0.875rem] text-p-ink-3 leading-relaxed mb-5">
                        {s.description}
                      </p>

                      {/* Progress */}
                      <div className="mb-5">
                        <div className="flex justify-between mb-2">
                          <span className="p-ts">{published}/{s.totalParts} {t.home.partLabel}</span>
                          <span className="p-ts text-p-green">{pct}%</span>
                        </div>
                        <div className="h-0.5 rounded-full bg-p-rule overflow-hidden">
                          <div
                            data-progress-bar={pct}
                            className="h-full bg-p-green rounded-full"
                            style={{ width: "0%" }}
                          />
                        </div>
                      </div>

                      {/* Parts */}
                      <div className="space-y-2">
                        {s.parts.map((part) => (
                          <div key={part.part} className="flex items-center gap-3">
                            <span className={[
                              "w-5 h-5 rounded-full flex items-center justify-center text-[9px] font-bold shrink-0",
                              part.published
                                ? "bg-p-green text-[var(--p-bg)]"
                                : "bg-p-surface-2 text-p-ink-4",
                            ].join(" ")}>
                              {part.part}
                            </span>
                            {part.published ? (
                              <Link href={`/articles/${part.slug}`}
                                className="font-bengali text-[0.8125rem] text-p-ink hover:text-p-green transition-colors">
                                {part.title}
                              </Link>
                            ) : (
                              <span className="font-bengali text-[0.8125rem] text-p-ink-4">
                                {part.title}
                                <span className="ml-2 font-ui text-[0.625rem] tracking-wide uppercase opacity-50">{t.home.soonLabel}</span>
                              </span>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* ══ NEWSLETTER ══════════════════════════════════════════════════ */}
        <section className="py-24" data-section>
          <div className="p-container">
            <div
              data-section-item
              className="max-w-[480px] mx-auto text-center"
              style={{ visibility: "hidden" }}
            >
              {/* Notebook icon */}
              <div className="w-11 h-11 rounded-xl bg-p-surface-2 border border-p-rule mx-auto mb-6 flex items-center justify-center" style={{ boxShadow: "var(--shadow-paper)" }}>
                <svg width="17" height="17" viewBox="0 0 17 17" fill="none">
                  <rect x="2.5" y="1.5" width="10" height="14" rx="1.5" stroke="var(--p-ink-3)" strokeWidth="1.2" />
                  <path d="M5.5 5h4M5.5 8h4M5.5 11h2" stroke="var(--p-ink-3)" strokeWidth="1.2" strokeLinecap="round" />
                  <path d="M13.5 4.5h1M13.5 7.5h1M13.5 10.5h1" stroke="var(--p-ink-4)" strokeWidth="1.2" strokeLinecap="round" />
                </svg>
              </div>

              <h2 className="font-serif text-[1.75rem] text-p-ink mb-2.5 tracking-[-0.02em]">
                {t.home.newsletter}
              </h2>
              <p className="font-bengali text-[0.9375rem] text-p-ink-3 leading-relaxed mb-8">
                {t.home.newsletterDesc}
              </p>

              <NewsletterForm />

              <p className="font-bengali text-[0.75rem] text-p-ink-4 mt-4">
                {t.home.unsubscribeNote}
              </p>
            </div>
          </div>
        </section>

      </main>

      <Footer />
    </>
  );
}
