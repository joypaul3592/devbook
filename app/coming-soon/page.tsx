import Link from "next/link";
import { ThemeToggle } from "@/components/ui";

export default function ComingSoon() {
  return (
    <section className="relative min-h-screen overflow-hidden antialiased ">
      <div className="absolute right-4 top-4 sm:right-5 sm:top-5 z-10">
        <ThemeToggle />
      </div>

      <div className="coming-bg" aria-hidden="true" />

      <main className="relative z-10 mx-auto flex min-h-screen w-full max-w-3xl flex-col items-center justify-center px-5 py-16 text-center sm:py-20">
        <span className="text-[10px] font-semibold uppercase tracking-[0.3em] mb-2 opacity-40">
          Launching soon
        </span>
        <h1 className="text-3xl font-semibold  sm:text-4xl mb-5">COMING SOON</h1>
        <p className="max-w-md text-sm leading-6 mb-6 opacity-70">
          We are building the next part of the marketplace. Check back soon for the full release.
        </p>

        <div className="flex flex-wrap items-center justify-center gap-2">
          <Link
            href="/"
            className="rounded-full px-4 py-2 text-xs font-semibold transition hover:-translate-y-0.5 hover:shadow-lg text-background bg-reverse"
          >
            Back to home
          </Link>
          <a
            href="/contact"
            className="rounded-full border px-4 py-2 text-xs font-semibold transition hover:-translate-y-0.5 text-reverse border-reverse/30 hover:border-reverse/60"
          >
            Contact us
          </a>
        </div>

        <div className="flex items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.35em] opacity-40 mt-5">
          <span className="h-1.5 w-1.5 rounded-full bg-reverse" aria-hidden="true" />
          Launch window: 2026
        </div>
      </main>
    </section>
  );
}
