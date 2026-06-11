import type { Metadata } from "next";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { ArticleCard } from "@/components/blog/ArticleCard";
import { Badge } from "@/components/ui/Badge";
import { FadeIn, FadeInStagger, FadeInChild } from "@/components/motion/FadeIn";
import { articles, categories } from "@/lib/data";
import Link from "next/link";

export const metadata: Metadata = {
  title: "সব লেখা",
  description: "ওয়েব ডেভেলপমেন্ট, React, Next.js, TypeScript নিয়ে সব লেখা।",
};

export default function ArticlesPage() {
  return (
    <>
      <Header />

      <main id="main-content" className="pt-24 pb-24">
        <div className="nb-container">
          {/* Page header */}
          <FadeIn>
            <div className="py-12 border-b border-nb-border mb-12">
              <div className="flex items-center gap-3 mb-4">
                <div className="nb-reading-marker" />
                <span className="font-bengali text-xs text-nb-subtle tracking-widest uppercase">সংগ্রহশালা</span>
              </div>
              <h1 className="font-serif text-3xl md:text-4xl text-nb-text mb-3">সব লেখা</h1>
              <p className="font-bengali text-nb-muted leading-relaxed max-w-lg">
                {articles.length} টি লেখা এখন পর্যন্ত। ওয়েব ডেভেলপমেন্ট থেকে ক্যারিয়ার পর্যন্ত।
              </p>
            </div>
          </FadeIn>

          {/* Category filter */}
          <FadeIn delay={0.1}>
            <div className="flex flex-wrap gap-2 mb-10">
              <Link href="/articles">
                <Badge variant="solid">সব</Badge>
              </Link>
              {categories.map((cat) => (
                <Link key={cat.slug} href={`/categories/${cat.slug}`}>
                  <Badge variant="default" className="cursor-pointer hover:bg-nb-surface transition-colors">
                    {cat.name}
                  </Badge>
                </Link>
              ))}
            </div>
          </FadeIn>

          {/* Articles grid */}
          <FadeInStagger className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {articles.map((article) => (
              <FadeInChild key={article.slug}>
                <ArticleCard article={article} />
              </FadeInChild>
            ))}
          </FadeInStagger>
        </div>
      </main>

      <Footer />
    </>
  );
}
