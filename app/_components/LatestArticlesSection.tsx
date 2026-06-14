"use client";

import { ArticleCard } from "@/components/blog/ArticleCard";
import { useLanguage } from "@/components/providers";
import { getLatestArticles } from "@/lib/data";
import Container from "@/components/layout/Container";

export function LatestArticlesSection() {
  const { t } = useLanguage();
  const latest = getLatestArticles(8).filter((a) => !a.featured);

  return (
    <section className="pb-24" data-section>
      <Container>
        {/* Grid: 2 cards + sidebar */}
        <div className=" gap-6">
          <div className=" grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5">
            {latest.slice(0, 6).map((article) => (
              <div key={article.slug} data-section-item>
                <ArticleCard article={article} />
              </div>
            ))}
          </div>

          {/* Sidebar */}
          {/* <div className="lg:col-span-1">
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
          </div> */}
        </div>
      </Container>
    </section>
  );
}
