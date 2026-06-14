import Link from "next/link";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/Badge";
import { formatDate } from "@/lib/data";
import type { Article } from "@/lib/types";

import blogImg from "@/public/blogs-images/personal-blog-3.png";
import Image from "next/image";

interface ArticleCardProps {
  article: Article;
  variant?: "default" | "compact" | "horizontal";
  className?: string;
}

export function ArticleCard({
  article,
  variant = "default",
  className,
}: ArticleCardProps) {
  /* ── Compact: sidebar list item ──────────────────────────────────────── */
  if (variant === "compact") {
    return (
      <Link
        href={`/articles/${article.slug}`}
        className={cn(
          "group flex items-start gap-3 py-3.5 border-b border-p-rule-2 last:border-0",
          "hover:border-p-rule transition-colors duration-200",
          className,
        )}
      >
        <div className="flex-1 min-w-0">
          <h3 className="font-bengali text-[0.8125rem] text-p-ink leading-snug group-hover:text-p-green transition-colors duration-200 line-clamp-2">
            {article.title}
          </h3>
          <div className="flex items-center gap-2 mt-1">
            <span className="p-ts">{formatDate(article.publishedAt)}</span>
            <span className="p-ts opacity-50">·</span>
            <span className="p-ts">{article.readingTime} মিনিট</span>
          </div>
        </div>
        <Badge variant="default" className="shrink-0 mt-0.5">
          {article.category}
        </Badge>
      </Link>
    );
  }

  /* ── Horizontal: wide list item ──────────────────────────────────────── */
  if (variant === "horizontal") {
    return (
      <Link
        href={`/articles/${article.slug}`}
        className={cn("group flex gap-5 items-start", className)}
      >
        <div
          className={cn(
            "w-20 h-20 sm:w-24 sm:h-24 rounded-lg bg-linear-to-br shrink-0",
            article.coverGradient,
          )}
        />
        <div className="flex-1 min-w-0">
          <Badge variant="accent" className="mb-2">
            {article.category}
          </Badge>
          <h3 className="font-bengali text-[0.875rem] text-p-ink leading-snug group-hover:text-p-green transition-colors duration-200 line-clamp-2">
            {article.title}
          </h3>
          <p className="font-bengali text-[0.8125rem] text-p-ink-3 mt-1.5 line-clamp-2 leading-relaxed">
            {article.excerpt}
          </p>
          <div className="flex items-center gap-2 mt-2">
            <span className="p-ts">{formatDate(article.publishedAt)}</span>
            <span className="p-ts opacity-50">·</span>
            <span className="p-ts">{article.readingTime} মিনিট পড়া</span>
          </div>
        </div>
      </Link>
    );
  }

  /* ── Default: grid card ───────────────────────────────────────────────── */
  return (
    <Link
      href={`/articles/${article.slug}`}
      className={cn(
        "group flex flex-col overflow-hidden rounded-xl border border-border",
        "bg-muted transition-all duration-300",
        "hover:border-p-green/40 hover:-translate-y-0.5",
        className,
      )}
      style={{ boxShadow: "var(--shadow-paper)" }}
    >
      {/* Cover */}
      <div
        className={cn(
          "h-56 bg-linear-to-br relative overflow-hidden",
          article.coverGradient,
        )}
      >
        {article.series && (
          <div className="absolute top-3 left-3">
            <span className="font-ui text-[10px] text-white/85 bg-black/25 backdrop-blur-sm px-2.5 py-0.5 rounded-full tracking-wide">
              {article.series} · পর্ব {article.seriesPart}
            </span>
          </div>
        )}
        <Image src={blogImg} alt="blogImg" className="h-full" />
      </div>

      {/* Body */}
      <div className="flex flex-col flex-1 p-5">
        <Badge variant="accent" className="w-fit mb-3">
          {article.category}
        </Badge>

        <h3 className="font-bengali text-[0.9375rem] text-p-ink leading-snug group-hover:text-p-green transition-colors duration-200 line-clamp-2 mb-2.5">
          {article.title}
        </h3>

        <p className="font-bengali text-[0.8125rem] text-p-ink-3 leading-relaxed line-clamp-2 flex-1">
          {article.excerpt}
        </p>

        <div className="flex items-center gap-2 mt-4 pt-4 border-t border-border">
          <span className="p-ts">{formatDate(article.publishedAt)}</span>
          <span className="p-ts opacity-40">·</span>
          <span className="p-ts">{article.readingTime} মিনিট পড়া</span>
        </div>
      </div>
    </Link>
  );
}
