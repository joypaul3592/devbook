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
    <section className="pb-24" data-section>
      <Container>
        <FeaturedArticle article={featured} />
      </Container>
    </section>
  );
}
