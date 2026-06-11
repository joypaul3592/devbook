import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { ArticleCard } from "@/components/blog/ArticleCard";
import { FadeIn, FadeInStagger, FadeInChild } from "@/components/motion/FadeIn";
import { categories, getArticlesByCategory, getCategoryBySlug } from "@/lib/data";
import { cn } from "@/lib/utils";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return categories.map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const cat = getCategoryBySlug(slug);
  if (!cat) return {};
  return { title: cat.name, description: cat.description };
}

export default async function CategoryPage({ params }: Props) {
  const { slug } = await params;
  const category = getCategoryBySlug(slug);
  if (!category) notFound();

  const catArticles = getArticlesByCategory(slug);

  return (
    <>
      <Header />
      <main id="main-content" className="pt-24 pb-24">
        <div className="nb-container">
          <FadeIn>
            <div className={cn("rounded-2xl h-40 bg-gradient-to-br mb-10 relative overflow-hidden", category.gradient)}>
              <div className="absolute inset-0 flex flex-col justify-end p-8">
                <h1 className="font-bengali text-2xl font-bold text-nb-text mb-1">{category.name}</h1>
                <p className="font-bengali text-sm text-nb-muted">{category.count} টি লেখা</p>
              </div>
            </div>
          </FadeIn>

          <FadeIn delay={0.1}>
            <p className="font-bengali text-nb-muted leading-relaxed mb-10 max-w-lg">
              {category.description}
            </p>
          </FadeIn>

          {catArticles.length > 0 ? (
            <FadeInStagger className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {catArticles.map((article) => (
                <FadeInChild key={article.slug}>
                  <ArticleCard article={article} />
                </FadeInChild>
              ))}
            </FadeInStagger>
          ) : (
            <FadeIn delay={0.15}>
              <div className="py-16 text-center">
                <p className="font-bengali text-nb-muted">এই বিষয়ে এখনো কোনো লেখা নেই।</p>
              </div>
            </FadeIn>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}
