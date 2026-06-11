import Link from "next/link";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/Button";

export default function NotFound() {
  return (
    <>
      <Header />

      <main className="flex-1 flex flex-col items-center justify-center py-24 relative overflow-hidden min-h-[60vh]">
        {/* Giant Bengali 404 — purely decorative */}
        <div
          className="error-404 absolute inset-0 flex items-center justify-center"
          aria-hidden="true"
        >
          <span>৪</span>
          <span>০</span>
          <span>৪</span>
        </div>

        {/* Content */}
        <div className="relative z-10 text-center px-6 max-w-sm">
          <div className="flex justify-center mb-6">
            <div className="nb-reading-marker" />
          </div>
          <h1 className="font-serif text-3xl md:text-4xl text-nb-text mb-3">
            পাতা পাওয়া যায়নি
          </h1>
          <p className="font-bengali text-nb-muted mb-8 leading-relaxed">
            এই পাতাটি সরানো হয়েছে, অথবা এটি কখনো ছিলই না।
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Button href="/" variant="primary">হোমে ফিরুন</Button>
            <Button href="/articles" variant="secondary">লেখা দেখুন</Button>
          </div>
        </div>
      </main>

      <Footer />
    </>
  );
}
