"use client";

import { useState, useMemo } from "react";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { ArticleCard } from "@/components/blog/ArticleCard";
import { FadeIn } from "@/components/motion/FadeIn";
import { articles } from "@/lib/data";

export default function SearchPage() {
  const [query, setQuery] = useState("");

  const results = useMemo(() => {
    if (!query.trim()) return [];
    const q = query.toLowerCase();
    return articles.filter(
      (a) =>
        a.title.toLowerCase().includes(q) ||
        a.titleEn.toLowerCase().includes(q) ||
        a.excerpt.toLowerCase().includes(q) ||
        a.category.toLowerCase().includes(q) ||
        a.tags.some((t) => t.toLowerCase().includes(q))
    );
  }, [query]);

  return (
    <>
      <Header />

      <main id="main-content" className="pt-24 pb-24">
        <div className="nb-container">
          <FadeIn>
            <div className="py-12 mb-10">
              <h1 className="font-serif text-3xl md:text-4xl text-nb-text mb-8">সার্চ</h1>

              {/* Search input */}
              <div className="relative max-w-xl">
                <svg
                  width="16" height="16" viewBox="0 0 16 16" fill="none"
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-nb-muted pointer-events-none"
                >
                  <circle cx="7" cy="7" r="5" stroke="currentColor" strokeWidth="1.5" />
                  <path d="M11 11L14.5 14.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                </svg>
                <input
                  type="search"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="লেখা খুঁজুন..."
                  autoFocus
                  className="w-full font-bengali text-base bg-nb-surface border border-nb-border rounded-xl pl-11 pr-5 py-3.5 text-nb-text placeholder:text-nb-subtle focus:outline-none focus:ring-2 focus:ring-nb-accent focus:border-transparent transition-all"
                  aria-label="সার্চ কুয়েরি"
                />
              </div>
            </div>
          </FadeIn>

          {/* Results */}
          {query.trim() === "" && (
            <FadeIn delay={0.1}>
              <div className="py-12 text-center">
                <p className="font-bengali text-nb-muted">উপরে লিখুন...</p>
                <div className="mt-6 flex flex-wrap justify-center gap-2">
                  {["React", "Next.js", "TypeScript", "ক্যারিয়ার", "ওপেন সোর্স"].map((tag) => (
                    <button
                      key={tag}
                      onClick={() => setQuery(tag)}
                      className="font-bengali text-xs bg-nb-surface-2 border border-nb-border text-nb-muted hover:text-nb-text hover:border-nb-accent/40 transition-colors px-3 py-1.5 rounded-full"
                    >
                      {tag}
                    </button>
                  ))}
                </div>
              </div>
            </FadeIn>
          )}

          {query.trim() !== "" && results.length === 0 && (
            <FadeIn delay={0.1}>
              <div className="py-12 text-center">
                <p className="font-bengali text-nb-muted">
                  &ldquo;{query}&rdquo; — কোনো ফলাফল পাওয়া যায়নি।
                </p>
              </div>
            </FadeIn>
          )}

          {results.length > 0 && (
            <FadeIn delay={0.1}>
              <div className="mb-6">
                <p className="font-bengali text-sm text-nb-muted">
                  {results.length} টি ফলাফল পাওয়া গেছে
                </p>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {results.map((article) => (
                  <ArticleCard key={article.slug} article={article} />
                ))}
              </div>
            </FadeIn>
          )}
        </div>
      </main>

      <Footer />
    </>
  );
}
