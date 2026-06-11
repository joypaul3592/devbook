"use client";

import { useLanguage } from "@/components/providers";
import { cn } from "@/lib/utils";

export function LanguageToggle({ className }: { className?: string }) {
  const { locale, setLocale, t } = useLanguage();

  function toggle() {
    setLocale(locale === "bn" ? "en" : "bn");
  }

  return (
    <button
      onClick={toggle}
      className={cn(
        "h-7 flex items-center gap-px rounded-full overflow-hidden",
        "border border-p-rule hover:border-p-ink-3",
        "transition-all duration-200",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-p-green",
        className
      )}
      aria-label={`Switch to ${locale === "bn" ? "English" : "Bangla"}`}
      title={t.lang.toggle}
    >
      <span
        className={cn(
          "px-2 py-0.5 text-[10px] font-medium transition-all duration-200",
          locale === "bn"
            ? "bg-p-ink text-(--p-bg)"
            : "text-p-ink-3 hover:text-p-ink-2"
        )}
      >
        বাং
      </span>
      <span
        className={cn(
          "px-2 py-0.5 text-[10px] font-medium transition-all duration-200",
          locale === "en"
            ? "bg-p-ink text-(--p-bg)"
            : "text-p-ink-3 hover:text-p-ink-2"
        )}
      >
        EN
      </span>
    </button>
  );
}
