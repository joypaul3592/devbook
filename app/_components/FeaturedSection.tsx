"use client";

import { FeaturedArticle } from "@/components/blog/FeaturedArticle";
import Container from "@/components/layout/Container";
import { useLanguage } from "@/components/providers";
import { getFeaturedArticle } from "@/lib/data";

export function FeaturedSection() {
  const { t } = useLanguage();
  const featured = getFeaturedArticle();

  if (!featured) return null;

  return (
    <section className="pb-20 md:pb-28" data-section>
      <Container>
        {/* Section header — mirrors the hero's centered eyebrow */}
        <div
          data-section-label
          className="flex flex-col items-center text-center mb-8 md:mb-10"
        >
          <span className="font-ui text-xs text-muted-foreground tracking-[0.14em] uppercase mb-3">
            {t.home.featuredLabel}
          </span>
          <span className="h-px w-10 bg-primary/60" />
        </div>

        <div data-section-item>
          <FeaturedArticle article={featured} />
        </div>
      </Container>
    </section>
  );
}
