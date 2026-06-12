"use client";

import Link from "next/link";
import { ArticleCard } from "@/components/blog/ArticleCard";
import { Button } from "@/components/ui/Button";
import { useLanguage } from "@/components/providers";
import { articles, getLatestArticles } from "@/lib/data";
import Container from "@/components/layout/Container";

export function LatestArticlesSection() {
  const { t } = useLanguage();
  const latest = getLatestArticles(5).filter((a) => !a.featured);

  return (
    <section className="pb-24" data-section>
      <Container>
        {/* Section header */}
        <div
          data-section-label
          className="flex items-center justify-between mb-8"
        >
          <div className="p-chapter flex-1">
            <span>{t.home.latestLabel}</span>
          </div>
          <Link
            href="/articles"
            className="font-ui text-[0.75rem] text-p-ink-3 hover:text-p-green transition-colors duration-200 ml-5 shrink-0 flex items-center gap-1.5"
          >
            {t.home.seeAll}
            <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
              <path
                d="M2 5h6M5.5 2L9 5l-3.5 3"
                stroke="currentColor"
                strokeWidth="1.4"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </Link>
        </div>

        {/* Grid: 2 cards + sidebar */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-5">
            {latest.slice(0, 4).map((article) => (
              <div key={article.slug} data-section-item>
                <ArticleCard article={article} />
              </div>
            ))}
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div
              className="sticky top-24 rounded-xl border border-p-rule bg-p-surface p-5"
              style={{ boxShadow: "var(--shadow-paper)" }}
            >
              <h3 className="font-ui text-[0.6875rem] text-p-ink-4 uppercase tracking-[0.12em] mb-4 pb-3 border-b border-p-rule">
                {t.home.moreArticles}
              </h3>
              {articles.slice(0, 5).map((article) => (
                <ArticleCard
                  key={article.slug}
                  article={article}
                  variant="compact"
                />
              ))}
              <div className="mt-5">
                <Button
                  href="/articles"
                  variant="secondary"
                  className="w-full justify-center text-[0.8125rem]"
                >
                  {t.home.allArticles}
                </Button>
              </div>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
