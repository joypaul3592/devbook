import { notFound } from "next/navigation";
import Link from "next/link";
import type { Metadata } from "next";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { ReadingProgress } from "@/components/blog/ReadingProgress";
import { ArticleCard } from "@/components/blog/ArticleCard";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { FadeIn } from "@/components/motion/FadeIn";
import { getArticleBySlug, articles, formatDate } from "@/lib/data";
import { cn } from "@/lib/utils";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return articles.map((a) => ({ slug: a.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const article = getArticleBySlug(slug);
  if (!article) return {};
  return {
    title: article.title,
    description: article.excerpt,
    openGraph: {
      title: article.title,
      description: article.excerpt,
      type: "article",
      publishedTime: article.publishedAt,
      tags: article.tags,
    },
  };
}

/* Mock article body — in production this comes from MDX */
const MOCK_BODY = `
App Router শুধু একটা রাউটিং সিস্টেম নয়। এটা React-এর সার্ভার কম্পোনেন্ট আর্কিটেকচারের উপর নির্মিত একটা সম্পূর্ণ নতুন চিন্তার ধরন।

## কেন App Router?

Next.js 13-এ App Router প্রথম আসে, এবং 14-তে stable হয়। মূল লক্ষ্য ছিল React Server Components (RSC)-কে প্রথম-শ্রেণীর নাগরিক হিসেবে treat করা।

Pages Router-এ আমরা \`getServerSideProps\` বা \`getStaticProps\` দিয়ে data fetch করতাম। App Router-এ সরাসরি async component-এর ভেতরে করা যায়:

\`\`\`typescript
// pages router (আগে)
export async function getServerSideProps() {
  const data = await fetchData();
  return { props: { data } };
}

// app router (এখন)
export default async function Page() {
  const data = await fetchData(); // সরাসরি!
  return <div>{data.title}</div>;
}
\`\`\`

## Server vs Client Components

এই বিভাজনটাই App Router-এর সবচেয়ে গুরুত্বপূর্ণ ধারণা।

**Server Components (ডিফল্ট):**
- Server-এ render হয়
- Browser-এ JavaScript পাঠায় না
- Database, filesystem সরাসরি access করতে পারে
- useState, useEffect ব্যবহার করতে পারে না

**Client Components (\`"use client"\`):**
- Browser-এ render হয়
- Interactivity দেয়
- Hooks ব্যবহার করতে পারে

> **মূল নিয়ম:** Client কম রাখুন, Server বেশি রাখুন।

## Streaming এবং Suspense

App Router-এর আরেকটি superpower হলো streaming।

\`\`\`tsx
import { Suspense } from 'react';

export default function Page() {
  return (
    <div>
      <h1>আমার পাতা</h1>
      <Suspense fallback={<p>লোড হচ্ছে...</p>}>
        <SlowComponent />
      </Suspense>
    </div>
  );
}
\`\`\`

## উপসংহার

App Router শিখতে সময় লাগে, কিন্তু একবার mental model ঠিক হলে এটা অসাধারণ শক্তিশালী। মূল কথা: **Server-first চিন্তা করুন।**
`;

const TOC_HEADINGS = [
  "কেন App Router?",
  "Server vs Client Components",
  "Streaming এবং Suspense",
  "উপসংহার",
];

export default async function ArticlePage({ params }: Props) {
  const { slug } = await params;
  const article = getArticleBySlug(slug);

  if (!article) notFound();

  const related = articles
    .filter((a) => a.categorySlug === article.categorySlug && a.slug !== article.slug)
    .slice(0, 2);

  const seriesArticles = article.seriesSlug
    ? articles.filter((a) => a.seriesSlug === article.seriesSlug)
    : [];

  return (
    <>
      <ReadingProgress />
      <Header />

      <main id="main-content">

        {/* ── Cover ──────────────────────────────────────────────────── */}
        <div
          className={cn(
            "h-52 md:h-64 bg-linear-to-br mt-[3.75rem] relative overflow-hidden",
            article.coverGradient
          )}
        >
          <div className="absolute inset-0 bg-linear-to-t from-[var(--p-bg)] via-transparent to-transparent" />
        </div>

        {/* ── Content layout ─────────────────────────────────────────── */}
        <div className="p-container pb-28 -mt-10 relative z-10">
          <div className="grid grid-cols-1 xl:grid-cols-[1fr_228px] gap-14 items-start">

            {/* ── Main column ─────────────────────────────────────────── */}
            <article className="min-w-0">

              {/* Article header */}
              <FadeIn>
                <header className="mb-8">
                  {/* Breadcrumb + badges */}
                  <div className="flex flex-wrap items-center gap-2.5 mb-5">
                    <Link href={`/categories/${article.categorySlug}`}>
                      <Badge variant="accent">{article.category}</Badge>
                    </Link>
                    {article.series && (
                      <span className="font-ui text-[0.6875rem] text-p-ink-3 bg-p-surface border border-p-rule px-2.5 py-0.5 rounded-full tracking-wide">
                        {article.series} · পর্ব {article.seriesPart}
                      </span>
                    )}
                  </div>

                  {/* Title */}
                  <h1 className="font-serif text-[2rem] md:text-[2.5rem] text-p-ink leading-tight tracking-tight mb-4">
                    {article.title}
                  </h1>

                  {/* Excerpt */}
                  <p className="font-bengali text-[1.0625rem] text-p-ink-3 leading-relaxed mb-6">
                    {article.excerpt}
                  </p>

                  {/* Meta row */}
                  <div className="flex flex-wrap items-center gap-4 pb-6 border-b border-p-rule">
                    <div className="flex items-center gap-2.5">
                      <div className="w-7 h-7 rounded-[5px] bg-linear-to-br from-p-green/30 to-p-indigo/20 border border-p-rule flex items-center justify-center">
                        <span className="font-serif text-xs text-p-green italic">জ</span>
                      </div>
                      <span className="font-ui text-[0.8125rem] text-p-ink-2">DevBook</span>
                    </div>
                    <span className="w-px h-3.5 bg-p-rule" aria-hidden />
                    <span className="p-ts">{formatDate(article.publishedAt)}</span>
                    <span className="w-px h-3.5 bg-p-rule" aria-hidden />
                    <span className="p-ts">{article.readingTime} মিনিট পড়া</span>
                  </div>
                </header>
              </FadeIn>

              {/* Body */}
              <FadeIn delay={0.1}>
                <div
                  className="p-prose"
                  dangerouslySetInnerHTML={{ __html: mdToHtml(MOCK_BODY) }}
                />
              </FadeIn>

              {/* Tags */}
              <FadeIn delay={0.15}>
                <div className="flex flex-wrap gap-2 mt-10 pt-8 border-t border-p-rule">
                  {article.tags.map((tag) => (
                    <span
                      key={tag}
                      className="font-ui text-[0.75rem] text-p-ink-3 bg-p-surface-2 border border-p-rule-2 px-2.5 py-1 rounded-full hover:text-p-ink transition-colors"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              </FadeIn>

              {/* Series navigation */}
              {seriesArticles.length > 1 && (
                <FadeIn delay={0.2}>
                  <div
                    className="mt-10 rounded-xl border border-p-rule bg-p-surface p-5"
                    style={{ boxShadow: "var(--shadow-paper)" }}
                  >
                    <h3 className="font-ui text-[0.6875rem] text-p-ink-4 uppercase tracking-[0.12em] mb-4 pb-3 border-b border-p-rule">
                      {article.series} — সিরিজের সব পর্ব
                    </h3>
                    <div className="space-y-1.5">
                      {seriesArticles.map((s) => (
                        <Link
                          key={s.slug}
                          href={`/articles/${s.slug}`}
                          className={cn(
                            "flex items-center gap-3 py-2 px-3 rounded-lg text-[0.8125rem] transition-colors duration-200",
                            s.slug === article.slug
                              ? "bg-p-green/10 text-p-green"
                              : "text-p-ink-3 hover:text-p-ink hover:bg-p-surface-2"
                          )}
                        >
                          <span className={cn(
                            "w-5 h-5 rounded-full flex items-center justify-center text-[9px] font-bold shrink-0",
                            s.slug === article.slug
                              ? "bg-p-green text-[var(--p-bg)]"
                              : "bg-p-surface-2 text-p-ink-4"
                          )}>
                            {s.seriesPart}
                          </span>
                          <span className="font-bengali">{s.title}</span>
                        </Link>
                      ))}
                    </div>
                  </div>
                </FadeIn>
              )}

              {/* Author block */}
              <FadeIn delay={0.25}>
                <div
                  className="mt-12 rounded-2xl border border-p-rule bg-p-surface p-6 flex gap-5"
                  style={{ boxShadow: "var(--shadow-paper)" }}
                >
                  <div className="w-11 h-11 rounded-[8px] bg-linear-to-br from-p-green/25 to-p-indigo/20 border border-p-rule flex items-center justify-center shrink-0">
                    <span className="font-serif text-lg text-p-green italic">জ</span>
                  </div>
                  <div>
                    <h3 className="font-ui text-[0.875rem] font-semibold text-p-ink mb-1">DevBook</h3>
                    <p className="font-bengali text-[0.8125rem] text-p-ink-3 leading-relaxed mb-3">
                      একজন বাংলাদেশী ওয়েব ডেভেলপার যিনি React, Next.js, এবং TypeScript নিয়ে কাজ করেন।
                      কোড লেখার পাশাপাশি বাংলায় শেখার অভিজ্ঞতা শেয়ার করতে ভালোবাসেন।
                    </p>
                    <div className="flex gap-4">
                      <a href="https://github.com" target="_blank" rel="noopener noreferrer"
                        className="font-ui text-[0.75rem] text-p-ink-3 hover:text-p-ink transition-colors">GitHub</a>
                      <a href="https://twitter.com" target="_blank" rel="noopener noreferrer"
                        className="font-ui text-[0.75rem] text-p-ink-3 hover:text-p-ink transition-colors">Twitter</a>
                    </div>
                  </div>
                </div>
              </FadeIn>

              {/* Related articles */}
              {related.length > 0 && (
                <FadeIn delay={0.3}>
                  <div className="mt-16">
                    <div className="p-chapter mb-8"><span>সম্পর্কিত লেখা</span></div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                      {related.map((a) => (
                        <ArticleCard key={a.slug} article={a} />
                      ))}
                    </div>
                  </div>
                </FadeIn>
              )}
            </article>

            {/* ── Sidebar TOC ─────────────────────────────────────────── */}
            <aside className="hidden xl:block">
              <div className="sticky top-24 space-y-3">

                {/* TOC */}
                <div
                  className="rounded-xl border border-p-rule bg-p-surface p-4"
                  style={{ boxShadow: "var(--shadow-paper)" }}
                >
                  <h3 className="font-ui text-[0.6875rem] text-p-ink-4 uppercase tracking-[0.12em] mb-4 pb-3 border-b border-p-rule">
                    বিষয়সূচি
                  </h3>
                  <nav className="space-y-0.5" aria-label="বিষয়সূচি">
                    {TOC_HEADINGS.map((heading) => (
                      <a
                        key={heading}
                        href={`#${heading.toLowerCase().replace(/\s+/g, "-")}`}
                        className="block font-bengali text-[0.8125rem] text-p-ink-3 hover:text-p-green transition-colors duration-200 py-1.5 pl-3 border-l border-p-rule hover:border-p-green"
                      >
                        {heading}
                      </a>
                    ))}
                  </nav>

                  <div className="mt-5 pt-4 border-t border-p-rule space-y-1.5">
                    <div className="p-ts">{article.readingTime} মিনিট পড়া</div>
                    <div className="p-ts">{formatDate(article.publishedAt)}</div>
                  </div>
                </div>

                {/* Back link */}
                <div
                  className="rounded-xl border border-p-rule bg-p-surface p-3"
                  style={{ boxShadow: "var(--shadow-paper)" }}
                >
                  <Button href="/articles" variant="ghost" className="w-full justify-center text-[0.8125rem]">
                    ← সব লেখা
                  </Button>
                </div>
              </div>
            </aside>
          </div>
        </div>
      </main>

      <Footer />
    </>
  );
}

/* Minimal markdown → HTML for mock content */
function mdToHtml(md: string): string {
  return md
    .trim()
    .replace(/```(\w+)?\n([\s\S]*?)```/g, '<pre><code>$2</code></pre>')
    .replace(/^## (.+)$/gm, '<h2>$1</h2>')
    .replace(/^### (.+)$/gm, '<h3>$1</h3>')
    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
    .replace(/`([^`]+)`/g, '<code>$1</code>')
    .replace(/^> (.+)$/gm, '<blockquote>$1</blockquote>')
    .replace(/\n\n/g, '</p><p>')
    .replace(/^([^<])/, '<p>$1')
    .replace(/([^>])$/, '$1</p>');
}
