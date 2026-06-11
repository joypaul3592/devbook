import Link from "next/link";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/Badge";
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
          "relative overflow-hidden rounded-2xl border border-p-rule",
          "bg-p-surface transition-all duration-300",
          "hover:border-p-green/35 hover:-translate-y-0.5"
        )}
        style={{ boxShadow: "var(--shadow-paper)" }}
      >
        {/* Cover gradient */}
        <div
          className={cn(
            "h-64 md:h-80 bg-linear-to-br relative",
            article.coverGradient
          )}
        >
          <div className="absolute inset-0 bg-linear-to-t from-black/50 via-transparent to-transparent" />

          {article.series && (
            <div className="absolute top-5 left-5">
              <span className="font-ui text-xs text-white/90 bg-white/15 backdrop-blur-sm border border-white/20 px-3 py-1 rounded-full tracking-wide">
                {article.series} · পর্ব {article.seriesPart}
              </span>
            </div>
          )}

          <div className="absolute top-5 right-5">
            <span className="font-ui text-[10px] tracking-[0.14em] uppercase text-white/75 bg-black/25 backdrop-blur-sm px-2.5 py-1 rounded-full">
              ফিচার্ড
            </span>
          </div>

          <div className="absolute bottom-5 left-5 flex items-center gap-3">
            <Badge variant="accent" className="border-transparent bg-p-green/90 text-white">
              {article.category}
            </Badge>
            <span className="font-ui text-[0.75rem] text-white/70">{article.readingTime} মিনিট পড়া</span>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 md:p-8">
          <h2 className="font-serif text-[1.5rem] md:text-[1.75rem] text-p-ink leading-tight tracking-tight group-hover:text-p-green transition-colors duration-300 mb-3">
            {article.title}
          </h2>

          <p className="font-bengali text-[0.9375rem] text-p-ink-3 leading-relaxed line-clamp-3 mb-5">
            {article.excerpt}
          </p>

          <div className="flex items-center justify-between">
            <span className="p-ts">{formatDate(article.publishedAt)}</span>
            <span className="font-ui text-[0.75rem] text-p-green flex items-center gap-1.5 group-hover:gap-2.5 transition-all duration-200">
              পড়ুন
              <svg width="11" height="11" viewBox="0 0 11 11" fill="none">
                <path d="M1.5 5.5h8M6 2L9.5 5.5 6 9" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </span>
          </div>
        </div>
      </article>
    </Link>
  );
}
