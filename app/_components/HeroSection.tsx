"use client";

import { Button } from "@/components/button/Button";
import { useLanguage } from "@/components/providers";
import Image from "next/image";
import Link from "next/link";

export function HeroSection() {
  const { t } = useLanguage();

  return (
    <section className="min-h-screen flex flex-col items-center justify-center py-12 md:py-24 max-w-6xl mx-auto text-center relative">
      {/* Logo */}
      <div
        data-hero-eyebrow
        className="flex items-center justify-center gap-3 mb-7 z-10 relative"
      >
        <Image
          src="/logo/logo-dark.png"
          alt="Logo"
          width={770}
          height={665}
          priority
          className="h-16 w-auto dark:hidden"
        />
        <Image
          src="/logo/logo-white.png"
          alt="Logo"
          width={1151}
          height={1086}
          priority
          className="h-16 w-auto hidden dark:block"
        />
      </div>

      {/* headline row */}
      <h1
        data-hero-title
        className="font-serif text-3xl md:text-5xl bg-linear-to-r from-black via-neutral-700 to-neutral-400 dark:from-white dark:via-neutral-200 dark:to-neutral-500 bg-clip-text text-transparent leading-tight mb-2 font-medium z-10 relative "
      >
        {t.home.headline1}
        <br />
        <em className="not-italic inline-block bg-linear-to-b from-black via-neutral-700 to-neutral-400 dark:from-white dark:via-neutral-200 dark:to-neutral-500 bg-clip-text text-transparent">
          {t.home.headline2}
        </em>
      </h1>

      {/* Bio */}
      <p
        data-hero-bio
        className="font-bengali text-[17px] text-muted-foreground mb-7 max-w-2xl mx-auto z-10 relative "
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
      <Link href="/learn" data-hero-cta className="center z-10 relative  ">
        <Button className="rounded-full bg-foreground border-foreground dark:text-black dark:hover:text-white">{t.home.readArticles}</Button>
      </Link>

      {/* <div
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
      /> */}
    </section>
  );
}
