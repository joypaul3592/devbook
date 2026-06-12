"use client";

import Link from "next/link";
import { CategoryCard } from "@/components/blog/CategoryCard";
import { useLanguage } from "@/components/providers";
import { categories } from "@/lib/data";
import Container from "@/components/layout/Container";

export function CategoriesSection() {
  const { t } = useLanguage();
  const featuredCats = categories.slice(0, 6);

  return (
    <section data-section>
      <Container>
        <div
          data-section-label
          className="flex items-center justify-between mb-8"
        >
          <div className="p-chapter flex-1">
            <span>{t.home.categoriesLabel}</span>
          </div>
          <Link
            href="/categories"
            className="font-ui text-[0.75rem] text-p-ink-3 hover:text-p-green transition-colors duration-200 ml-5 shrink-0"
          >
            {t.home.seeAllCats}
          </Link>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {featuredCats.map((cat) => (
            <div key={cat.slug} data-section-item>
              <CategoryCard category={cat} />
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}
