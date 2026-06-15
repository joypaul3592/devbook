import Link from "next/link";
import { cn } from "@/lib/utils";
import { formatDate } from "@/lib/data";
import type { Article } from "@/lib/types";

import blogImg from "@/public/blogs-images/personal-blog-1.png";
import Image from "next/image";
import { ArrowRightIcon } from "../icons/Icons";

export function FeaturedArticle({ article }: { article: Article }) {
  return (
    <Link
      href={`/articles/${article.slug}`}
      className="group block"
      aria-label={`ফিচার্ড লেখা: ${article.title}`}
    >
      <article
        className={cn(
          "relative grid grid-cols-1 md:grid-cols-7 overflow-hidden",
          "rounded-2xl border border-border bg-muted",
          "transition-all duration-300",
          "hover:border-reverse/15 hover:-translate-y-1 hover:shadow-lg",
        )}
      >
        {/* Cover */}
        <div
          className={cn(
            "relative h-58 md:h-full min-h-80 col-span-3 p-1",
            article.coverGradient,
          )}
        >
          {/* Featured stamp */}
          <span className="absolute top-5 right-5 font-ui text-[10px] tracking-[0.14em] uppercase text-white/85 bg-black/30 backdrop-blur-sm px-2.5 py-1 rounded-full">
            ফিচার্ড
          </span>

          {article.series && (
            <span className="absolute top-5 left-5 font-ui text-xs text-white/90 bg-white/15 backdrop-blur-sm border border-white/20 px-3 py-1 rounded-full tracking-wide">
              {article.series} · পর্ব {article.seriesPart}
            </span>
          )}

          <Image
            src={blogImg}
            alt="blogImg"
            className="h-full w-full rounded-[14px]"
          />

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
        <div className="flex flex-col justify-center p-3 md:p-5 col-span-4">
          <h2 className="font-serif text-xl md:text-3xl font-medium text-foreground leading-tight tracking-tight mb-4 group-hover:text-primary transition-colors duration-300">
            {article.title}
          </h2>

          <p className="font-bengali text-[15px] text-muted-foreground leading-relaxed line-clamp-3 mb-6">
            {article.excerpt}
          </p>

          {article.tags?.length ? (
            <div className="flex flex-wrap gap-2 mb-4">
              {article.tags.slice(0, 4).map((tag) => (
                <span
                  key={tag}
                  className="text-xs text-foreground bg-accent border border-border px-2.5 py-0.5 rounded-full"
                >
                  {tag}
                </span>
              ))}
            </div>
          ) : null}

          <div className="flex items-center justify-between pt-3 border-t border-border">
            <span className="font-ui text-xs text-muted-foreground tabular-nums">
              {formatDate(article.publishedAt)}
            </span>
            <span className="font-ui text-[13px] font-medium text-primary flex items-center gap-1.5 group-hover:gap-2.5 transition-all duration-200">
              পড়ুন
              <ArrowRightIcon className="size-3.5" />
            </span>
          </div>
        </div>
      </article>
    </Link>
  );
}
