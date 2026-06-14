import Link from "next/link";
import { cn } from "@/lib/utils";
import { formatDate } from "@/lib/data";
import type { Article } from "@/lib/types";

export function FeaturedArticle({ article }: { article: Article }) {
  return (
    <Link
      href={`/articles/${article.slug}`}
      className="group block"
      aria-label={`ফিচার্ড লেখা: ${article.title}`}
    >
      <article
        className={cn(
          "relative grid grid-cols-1 md:grid-cols-2 overflow-hidden",
          "rounded-2xl border border-border bg-card",
          "transition-all duration-300",
          "hover:border-primary/40 hover:-translate-y-1 hover:shadow-lg",
        )}
      >
        {/* Cover */}
        <div
          className={cn(
            "relative h-56 md:h-full min-h-[18rem] bg-linear-to-br",
            article.coverGradient,
          )}
        >
          <div className="absolute inset-0 bg-linear-to-t from-black/55 via-black/10 to-transparent" />

          {/* Featured stamp */}
          <span className="absolute top-5 right-5 font-ui text-[10px] tracking-[0.14em] uppercase text-white/85 bg-black/30 backdrop-blur-sm px-2.5 py-1 rounded-full">
            ফিচার্ড
          </span>

          {article.series && (
            <span className="absolute top-5 left-5 font-ui text-xs text-white/90 bg-white/15 backdrop-blur-sm border border-white/20 px-3 py-1 rounded-full tracking-wide">
              {article.series} · পর্ব {article.seriesPart}
            </span>
          )}

          <div className="absolute bottom-5 left-5 flex items-center gap-3">
            <span className="font-ui text-xs text-white bg-primary px-2.5 py-1 rounded-full">
              {article.category}
            </span>
            <span className="font-ui text-xs text-white/80">
              {article.readingTime} মিনিট পড়া
            </span>
          </div>
        </div>

        {/* Content */}
        <div className="flex flex-col justify-center p-6 md:p-9">
          <h2 className="font-serif text-2xl md:text-[1.875rem] font-medium text-foreground leading-tight tracking-tight mb-4 group-hover:text-primary transition-colors duration-300">
            {article.title}
          </h2>

          <p className="font-bengali text-[15px] text-muted-foreground leading-relaxed line-clamp-3 mb-6">
            {article.excerpt}
          </p>

          {article.tags?.length ? (
            <div className="flex flex-wrap gap-2 mb-6">
              {article.tags.slice(0, 4).map((tag) => (
                <span
                  key={tag}
                  className="text-xs text-foreground bg-muted border border-border px-2.5 py-0.5 rounded-full"
                >
                  {tag}
                </span>
              ))}
            </div>
          ) : null}

          <div className="flex items-center justify-between pt-5 border-t border-border">
            <span className="font-ui text-xs text-muted-foreground tabular-nums">
              {formatDate(article.publishedAt)}
            </span>
            <span className="font-ui text-[13px] font-medium text-primary flex items-center gap-1.5 group-hover:gap-2.5 transition-all duration-200">
              পড়ুন
              <svg width="11" height="11" viewBox="0 0 11 11" fill="none">
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
      </article>
    </Link>
  );
}
