import type { Metadata } from "next";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { CategoryCard } from "@/components/blog/CategoryCard";
import { FadeIn, FadeInStagger, FadeInChild } from "@/components/motion/FadeIn";
import { categories } from "@/lib/data";

export const metadata: Metadata = {
  title: "বিষয়ভিত্তিক",
  description: "বিষয়ভিত্তিক লেখার সংগ্রহ।",
};

export default function CategoriesPage() {
  const totalArticles = categories.reduce((sum, cat) => sum + cat.count, 0);

  return (
    <>
      <Header />

      <main id="main-content" className="pt-24 pb-24">
        <div className="nb-container">
          <FadeIn>
            <div className="py-12 border-b border-nb-border mb-12">
              <div className="flex items-center gap-3 mb-4">
                <div className="nb-reading-marker" />
                <span className="font-bengali text-xs text-nb-subtle tracking-widest uppercase">বিষয়সমূহ</span>
              </div>
              <h1 className="font-serif text-3xl md:text-4xl text-nb-text mb-3">বিষয়ভিত্তিক</h1>
              <p className="font-bengali text-nb-muted leading-relaxed">
                {categories.length} টি বিষয়ে মোট {totalArticles} টি লেখা।
              </p>
            </div>
          </FadeIn>

          <FadeInStagger className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {categories.map((cat) => (
              <FadeInChild key={cat.slug}>
                <CategoryCard category={cat} />
              </FadeInChild>
            ))}
          </FadeInStagger>
        </div>
      </main>

      <Footer />
    </>
  );
}
