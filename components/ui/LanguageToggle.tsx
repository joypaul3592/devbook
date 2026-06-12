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
        "relative grid grid-cols-2 items-center h-8 p-0.5 rounded-xl overflow-hidden",
        "border border-border hover:border-border",
        "transition-all duration-200",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-p-green",
        className,
      )}
      aria-label={`Switch to ${locale === "bn" ? "English" : "Bangla"}`}
      title={t.lang.toggle}
    >
      {/* Sliding active background */}
      <span
        aria-hidden
        className={cn(
          "absolute inset-y-0.5 left-0.5 w-[calc(50%-2px)] rounded-[10px] bg-primary",
          "transition-transform duration-300 ease-out",
          locale === "en" ? "translate-x-full" : "translate-x-0",
        )}
      />
      <span
        className={cn(
          "relative z-10 text-center px-2 py-0.5 text-[10px] font-medium transition-colors duration-300 cursor-pointer",
          locale === "bn" ? "text-white" : "text-foreground hover:text-reverse",
        )}
      >
        বাং
      </span>
      <span
        className={cn(
          "relative z-10 text-center px-2 py-0.5 text-[10px] font-medium transition-colors duration-300 cursor-pointer",
          locale === "en" ? "text-white" : "text-foreground hover:text-reverse",
        )}
      >
        EN
      </span>
    </button>
  );
}
