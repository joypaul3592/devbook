"use client";

import { Button } from "@/components/button/Button";
import { useLanguage } from "@/components/providers";

export function HeroSection() {
  const { t } = useLanguage();

  return (
    <section className="py-12 md:py-24 max-w-6xl mx-auto text-center relative">
      {/* Eyebrow */}
      <div
        data-hero-eyebrow
        className="flex items-center justify-center gap-3 mb-7 z-10 relative"
      >
        <span className="font-ui text-xs text-muted-foreground tracking-tight uppercase">
          {t.home.eyebrow}
        </span>
      </div>

      {/* headline row */}
      <h1
        data-hero-title
        className="font-serif text-3xl md:text-5xl text-foreground leading-tight mb-2 font-medium z-10 relative "
      >
        {t.home.headline1}
        <br />
        <em className="text-primary not-italic">{t.home.headline2}</em>
      </h1>

      {/* Bio */}
      <p
        data-hero-bio
        className="font-bengali text-[17px] text-muted-foreground mb-7 max-w-xl mx-auto z-10 relative "
      >
        {t.home.bio}
      </p>

      {/* Current focus tags */}
      <div
        data-hero-tags
        className="flex flex-wrap items-center justify-center gap-2 mb-10 z-10 relative "
      >
        {["React.js", "Next.js", "Design Systems", "TypeScript"].map((f) => (
          <span
            key={f}
            className="text-xs text-foreground bg-muted border border-border px-2.5 py-0.5 rounded-full"
          >
            {f}
          </span>
        ))}
      </div>

      {/* CTAs */}
      <div data-hero-cta className="center z-10 relative  ">
        <Button className="rounded-full">{t.home.readArticles}</Button>
      </div>

      <div
        className="
          absolute inset-0
          bg-[repeating-linear-gradient(0deg,var(--foreground)_0,var(--foreground)_1px,transparent_0,transparent_50%)]
          bg-size-[50px_50px]
          bg-fixed
          opacity-10
          z-0
          mask-b-from-80%
          mask-t-from-50%
          mask-l-from-70%
          mask-r-from-70%
        "
      />
    </section>
  );
}
