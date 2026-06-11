import Link from "next/link";
import { cn } from "@/lib/utils";
import type { Category } from "@/lib/types";

export function CategoryCard({ category }: { category: Category }) {
  return (
    <Link
      href={`/categories/${category.slug}`}
      className={cn(
        "group flex flex-col p-5 rounded-xl border border-p-rule relative overflow-hidden",
        "bg-p-surface transition-all duration-300",
        "hover:border-p-green/40 hover:-translate-y-0.5"
      )}
      style={{ boxShadow: "var(--shadow-paper)" }}
    >
      {/* Corner gradient accent */}
      <div
        className={cn(
          "absolute top-0 right-0 w-20 h-20 rounded-bl-full opacity-20 bg-linear-to-br",
          category.gradient
        )}
      />

      <div className="relative">
        <h3 className="font-bengali text-[0.9375rem] text-p-ink leading-snug group-hover:text-p-green transition-colors duration-200 mb-1.5">
          {category.name}
        </h3>

        <p className="font-bengali text-[0.8125rem] text-p-ink-3 leading-relaxed line-clamp-2 mb-4">
          {category.description}
        </p>

        <div className="flex items-center justify-between">
          <span className="p-ts">{category.count} টি লেখা</span>
          <svg
            width="11" height="11" viewBox="0 0 11 11" fill="none"
            className="text-p-ink-4 group-hover:text-p-green group-hover:translate-x-1 transition-all duration-200"
          >
            <path d="M1.5 5.5h8M6 2L9.5 5.5 6 9" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
      </div>
    </Link>
  );
}
