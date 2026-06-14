"use client";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import { gsap, ScrollTrigger, ease } from "@/lib/gsap";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import {
  HeroSection,
  FeaturedSection,
  LatestArticlesSection,
  CategoriesSection,
  JournalSection,
  SeriesSection,
  NewsletterSection,
} from "./_components";

gsap.registerPlugin(useGSAP, ScrollTrigger);

export default function HomePage() {
  const mainRef = useRef<HTMLElement>(null);

  /* ── GSAP: Hero entrance + all ScrollTrigger reveals ─────────────────── */
  useGSAP(
    () => {
      /* Hero — staggered entrance */
      const heroTl = gsap.timeline({
        defaults: { ease: ease.out, clearProps: "all" },
      });
      heroTl
        .from("[data-hero-eyebrow]", { y: 16, autoAlpha: 0, duration: 0.6 })
        .from(
          "[data-hero-title]",
          { y: 24, autoAlpha: 0, duration: 0.7 },
          "-=0.4",
        )
        .from(
          "[data-hero-bio]",
          { y: 16, autoAlpha: 0, duration: 0.6 },
          "-=0.45",
        )
        .from(
          "[data-hero-tags] span",
          {
            y: 8,
            autoAlpha: 0,
            duration: 0.45,
            stagger: 0.06,
          },
          "-=0.4",
        )
        .from(
          "[data-hero-cta] > *",
          {
            y: 8,
            autoAlpha: 0,
            duration: 0.45,
            stagger: 0.08,
          },
          "-=0.5",
        );

      /* Scroll reveals — sections */
      const sections = document.querySelectorAll<HTMLElement>("[data-section]");
      sections.forEach((section) => {
        const label = section.querySelector("[data-section-label]");
        const items = section.querySelectorAll<HTMLElement>(
          "[data-section-item]",
        );

        const stTl = gsap.timeline({
          scrollTrigger: {
            trigger: section,
            start: "top 82%",
            toggleActions: "play none none none",
          },
        });

        if (label) {
          stTl.from(label, {
            y: 10,
            autoAlpha: 0,
            duration: 0.5,
            ease: ease.out,
          });
        }
        if (items.length) {
          stTl.from(
            items,
            {
              y: 22,
              autoAlpha: 0,
              duration: 0.6,
              stagger: 0.07,
              ease: ease.out,
            },
            "-=0.25",
          );
        }
      });

      /* Series progress bars — animate width on scroll */
      const bars = document.querySelectorAll<HTMLElement>(
        "[data-progress-bar]",
      );
      bars.forEach((bar) => {
        const target = bar.dataset.progressBar ?? "0";
        gsap.fromTo(
          bar,
          { width: "0%" },
          {
            width: `${target}%`,
            duration: 1.2,
            ease: ease.inOut,
            scrollTrigger: {
              trigger: bar,
              start: "top 90%",
              toggleActions: "play none none none",
            },
          },
        );
      });
    },
    { scope: mainRef },
  );

  return (
    <>
      <Header />
      <main ref={mainRef} id="main-content" className="flex-1">
        <HeroSection />
        <FeaturedSection />
        <LatestArticlesSection />
        <CategoriesSection />
        <JournalSection />
        <SeriesSection />
        <NewsletterSection />
      </main>
      <Footer />
    </>
  );
}
