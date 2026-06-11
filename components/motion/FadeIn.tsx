"use client";

import { useRef, type ReactNode } from "react";
import { useGSAP } from "@gsap/react";
import { gsap, ScrollTrigger, ease } from "@/lib/gsap";
import { cn } from "@/lib/utils";

gsap.registerPlugin(useGSAP, ScrollTrigger);

/* ── Single element fade-in on scroll ─────────────────────────────────── */
interface FadeInProps {
  children: ReactNode;
  delay?: number;
  duration?: number;
  direction?: "up" | "down" | "left" | "right" | "none";
  className?: string;
  distance?: number;
}

export function FadeIn({
  children,
  delay = 0,
  duration = 0.7,
  direction = "up",
  className,
  distance = 20,
}: FadeInProps) {
  const ref = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const el = ref.current;
      if (!el) return;

      const from: gsap.TweenVars = {
        autoAlpha: 0,
        duration,
        delay,
        ease: ease.out,
        scrollTrigger: {
          trigger: el,
          start: "top 88%",
          toggleActions: "play none none none",
        },
      };

      if (direction === "up")    from.y = distance;
      if (direction === "down")  from.y = -distance;
      if (direction === "left")  from.x = -distance;
      if (direction === "right") from.x = distance;

      gsap.from(el, from);
    },
    { scope: ref }
  );

  return (
    <div ref={ref} className={className} style={{ visibility: "hidden" }}>
      {children}
    </div>
  );
}

/* ── Stagger container: children animate in sequence ─────────────────── */
interface FadeInStaggerProps {
  children: ReactNode;
  stagger?: number;
  className?: string;
}

export function FadeInStagger({ children, stagger = 0.08, className }: FadeInStaggerProps) {
  const ref = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const container = ref.current;
      if (!container) return;

      const items = container.querySelectorAll<HTMLElement>("[data-stagger]");
      if (!items.length) return;

      gsap.from(items, {
        y: 20,
        autoAlpha: 0,
        duration: 0.65,
        stagger,
        ease: ease.out,
        scrollTrigger: {
          trigger: container,
          start: "top 85%",
          toggleActions: "play none none none",
        },
      });
    },
    { scope: ref }
  );

  return (
    <div ref={ref} className={cn(className)}>
      {children}
    </div>
  );
}

/* ── Individual stagger child ─────────────────────────────────────────── */
export function FadeInChild({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <div data-stagger className={cn(className)} style={{ visibility: "hidden" }}>
      {children}
    </div>
  );
}
