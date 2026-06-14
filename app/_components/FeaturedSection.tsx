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
    <section className="py-20 md:py-10" data-section>
      <Container>
        <div data-section-item className="px-20">
          <FeaturedArticle article={featured} />
        </div>
      </Container>
    </section>
  );
}
