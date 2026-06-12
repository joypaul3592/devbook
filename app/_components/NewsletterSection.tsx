"use client";

import { NewsletterForm } from "@/components/blog/NewsletterForm";
import Container from "@/components/layout/Container";
import { useLanguage } from "@/components/providers";

export function NewsletterSection() {
  const { t } = useLanguage();

  return (
    <section data-section>
      <Container className="py-12">
        <div data-section-item className="max-w-120 mx-auto text-center">
          {/* Notebook icon */}
          <div
            className="w-11 h-11 rounded-xl bg-p-surface-2 border border-p-rule mx-auto mb-6 flex items-center justify-center"
            style={{ boxShadow: "var(--shadow-paper)" }}
          >
            <svg width="17" height="17" viewBox="0 0 17 17" fill="none">
              <rect
                x="2.5"
                y="1.5"
                width="10"
                height="14"
                rx="1.5"
                stroke="var(--primary)"
                strokeWidth="1.2"
              />
              <path
                d="M5.5 5h4M5.5 8h4M5.5 11h2"
                stroke="var(--primary)"
                strokeWidth="1.2"
                strokeLinecap="round"
              />
              <path
                d="M13.5 4.5h1M13.5 7.5h1M13.5 10.5h1"
                stroke="var(--primary)"
                strokeWidth="1.2"
                strokeLinecap="round"
              />
            </svg>
          </div>

          <h2 className="font-serif text-[1.75rem] text-p-ink mb-2.5 tracking-[-0.02em]">
            {t.home.newsletter}
          </h2>
          <p className="font-bengali text-[0.9375rem] text-p-ink-3 leading-relaxed mb-8">
            {t.home.newsletterDesc}
          </p>

          <NewsletterForm />

          <p className="font-bengali text-[0.75rem] text-p-ink-4 mt-4">
            {t.home.unsubscribeNote}
          </p>
        </div>
      </Container>
    </section>
  );
}
