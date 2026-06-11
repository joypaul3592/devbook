import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

/* Register plugins once — safe to call multiple times */
if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

export { gsap, ScrollTrigger };

/* ── Shared eases ───────────────────────────────────────────────────────── */
export const ease = {
  out:    "power2.out",
  inOut:  "power2.inOut",
  expo:   "expo.out",
  smooth: "power1.inOut",
  back:   "back.out(1.2)",
} as const;

/* ── Default vars for reveal animations ────────────────────────────────── */
export const revealDefaults = {
  duration: 0.75,
  ease:     ease.out,
  autoAlpha: 0,
} as const;
