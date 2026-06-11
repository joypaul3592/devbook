import type { Metadata } from "next";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { JournalEntryCard } from "@/components/blog/JournalEntryCard";
import { FadeIn } from "@/components/motion/FadeIn";
import { journalEntries } from "@/lib/data";

export const metadata: Metadata = {
  title: "ডেভেলপার জার্নাল",
  description: "ছোট চিন্তা, আবিষ্কার, এবং শেখার মুহূর্ত।",
};

export default function JournalPage() {
  return (
    <>
      <Header />

      <main id="main-content" className="pt-24 pb-24">
        <div className="nb-container">
          <FadeIn>
            <div className="py-12 border-b border-nb-border mb-14">
              <div className="flex items-center gap-3 mb-4">
                <div className="nb-reading-marker" />
                <span className="font-bengali text-xs text-nb-subtle tracking-widest uppercase">দৈনিক নোটস</span>
              </div>
              <h1 className="font-serif text-3xl md:text-4xl text-nb-text mb-3">ডেভেলপার জার্নাল</h1>
              <p className="font-bengali text-nb-muted leading-relaxed max-w-lg">
                দীর্ঘ লেখার বাইরে — ছোট চিন্তা, দ্রুত আবিষ্কার, এবং দৈনন্দিন
                শেখার মুহূর্তগুলো।
              </p>
            </div>
          </FadeIn>

          <div className="max-w-2xl">
            <FadeIn delay={0.1}>
              <div>
                {journalEntries.map((entry) => (
                  <JournalEntryCard key={entry.id} entry={entry} />
                ))}
              </div>
            </FadeIn>
          </div>
        </div>
      </main>

      <Footer />
    </>
  );
}
