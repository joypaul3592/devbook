"use client";

import Link from "next/link";
import { cn } from "@/lib/utils";
import { useLanguage } from "@/components/providers";
import { categories } from "@/lib/data";
import Container from "@/components/layout/Container";
import type { Category } from "@/lib/types";

function CategoryCard({
  category,
  large = false,
}: {
  category: Category;
  large?: boolean;
}) {
  return (
    <Link
      href={`/categories/${category.slug}`}
      data-section-item
      className={cn(
        "group relative flex flex-col justify-between overflow-hidden rounded-2xl",
        "bg-card border border-border",
        "transition-all duration-300",
        "hover:-translate-y-1.5 hover:shadow-lg hover:border-primary/30",
        large ? "p-8 min-h-[260px]" : "p-6 min-h-[190px]",
      )}
    >
      {/* Watermark count */}
      <span
        className={cn(
          "absolute right-3 -top-2 font-ui font-bold leading-none",
          "text-foreground/6 select-none pointer-events-none",
          large ? "text-[9rem]" : "text-[6rem]",
        )}
      >
        {category.count}
      </span>

      {/* Top: English eyebrow */}
      <div className="relative z-10">
        <span className="font-ui text-[10px] tracking-[0.18em] uppercase text-muted-foreground">
          {category.nameEn}
        </span>
      </div>

      {/* Bottom: Bengali name + count pill + arrow */}
      <div className="relative z-10">
        <h3
          className={cn(
            "font-serif font-medium text-foreground leading-snug mb-4 group-hover:text-primary transition-colors duration-300",
            large ? "text-3xl" : "text-xl",
          )}
        >
          {category.name}
        </h3>

        <div className="flex items-center justify-between">
          <span className="font-ui text-[11px] text-muted-foreground bg-muted border border-border px-3 py-1 rounded-full">
            {category.count} টি লেখা
          </span>

          <span className="w-8 h-8 rounded-full bg-muted border border-border flex items-center justify-center group-hover:bg-primary/10 group-hover:border-primary/30 transition-all duration-200">
            <svg
              width="11"
              height="11"
              viewBox="0 0 11 11"
              fill="none"
              className="text-muted-foreground group-hover:text-primary group-hover:translate-x-0.5 transition-all duration-200"
            >
              <path
                d="M1.5 5.5h8M6 2L9.5 5.5 6 9"
                stroke="currentColor"
                strokeWidth="1.4"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </span>
        </div>
      </div>
    </Link>
  );
}

export function CategoriesSection() {
  const { t } = useLanguage();
  const featuredCats = categories.slice(0, 6);
  const [first, ...rest] = featuredCats;

  return (
    <section className="py-24 relative overflow-hidden" data-section>
      <Container>
        {/* Section header */}
        <div data-section-label className="mb-12 text-center relative z-10">
          <div className="flex items-center justify-center gap-3 mb-5">
            <span className="h-px w-8 bg-border" />
            <span className="font-ui text-xs text-muted-foreground tracking-[0.14em] uppercase">
              {t.home.categoriesLabel}
            </span>
            <span className="h-px w-8 bg-border" />
          </div>
          <h2 className="font-serif text-3xl md:text-4xl font-medium text-foreground leading-tight">
            বিষয় দিয়ে <em className="text-primary not-italic">খুঁজুন</em>
          </h2>
          <p className="font-bengali text-[15px] text-muted-foreground mt-4 max-w-sm mx-auto">
            যে বিষয়ে পড়তে চান সেটা বেছে নিন।
          </p>
        </div>

        {/* Bento grid — first card large */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 relative z-10">
          <div className="col-span-2 md:col-span-1">
            <CategoryCard category={first} large />
          </div>
          {rest.map((cat) => (
            <CategoryCard key={cat.slug} category={cat} />
          ))}
        </div>

        {/* See all */}
        <div className="mt-10 flex justify-center relative z-10">
          <Link
            href="/categories"
            className={cn(
              "group font-ui text-sm text-muted-foreground",
              "inline-flex items-center gap-2",
              "border border-border rounded-full px-5 py-2.5 bg-card",
              "hover:border-primary/40 hover:text-primary transition-all duration-200",
            )}
          >
            {t.home.seeAllCats}
            <svg
              width="11"
              height="11"
              viewBox="0 0 11 11"
              fill="none"
              className="group-hover:translate-x-0.5 transition-transform duration-200"
            >
              <path
                d="M1.5 5.5h8M6 2L9.5 5.5 6 9"
                stroke="currentColor"
                strokeWidth="1.4"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </Link>
        </div>
      </Container>
    </section>
  );
}
