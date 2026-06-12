"use client";

import Link from "next/link";
import { useLanguage } from "@/components/providers";
import { series } from "@/lib/data";
import Container from "@/components/layout/Container";

export function SeriesSection() {
  const { t } = useLanguage();

  return (
    <section data-section>
      <Container>
        <div data-section-label className="mb-10">
          <div className="p-chapter">
            <span>{t.home.seriesLabel}</span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {series.map((s) => {
            const published = s.parts.filter((p) => p.published).length;
            const pct = Math.round((published / s.totalParts) * 100);

            return (
              <div
                key={s.slug}
                data-section-item
                className="rounded-xl border border-p-rule bg-p-surface overflow-hidden"
                style={{
                  boxShadow: "var(--shadow-paper)",
                }}
              >
                {/* Gradient header */}
                <div
                  className={`h-28 bg-gradient-to-br ${s.gradient} relative overflow-hidden`}
                >
                  <div className="absolute inset-0 flex flex-col justify-end p-5">
                    <h3 className="font-serif text-xl text-white font-normal leading-snug drop-shadow-sm">
                      {s.title}
                    </h3>
                    <p className="font-ui text-[0.6875rem] text-white/60 mt-0.5 tracking-wide">
                      {s.titleEn}
                    </p>
                  </div>
                </div>

                <div className="p-5">
                  <p className="font-bengali text-[0.875rem] text-p-ink-3 leading-relaxed mb-5">
                    {s.description}
                  </p>

                  {/* Progress */}
                  <div className="mb-5">
                    <div className="flex justify-between mb-2">
                      <span className="p-ts">
                        {published}/{s.totalParts} {t.home.partLabel}
                      </span>
                      <span className="p-ts text-p-green">{pct}%</span>
                    </div>
                    <div className="h-0.5 rounded-full bg-p-rule overflow-hidden">
                      <div
                        data-progress-bar={pct}
                        className="h-full bg-p-green rounded-full"
                        style={{ width: "0%" }}
                      />
                    </div>
                  </div>

                  {/* Parts */}
                  <div className="space-y-2">
                    {s.parts.map((part) => (
                      <div key={part.part} className="flex items-center gap-3">
                        <span
                          className={[
                            "w-5 h-5 rounded-full flex items-center justify-center text-[9px] font-bold shrink-0",
                            part.published
                              ? "bg-p-green text-[var(--p-bg)]"
                              : "bg-p-surface-2 text-p-ink-4",
                          ].join(" ")}
                        >
                          {part.part}
                        </span>
                        {part.published ? (
                          <Link
                            href={`/articles/${part.slug}`}
                            className="font-bengali text-[0.8125rem] text-p-ink hover:text-p-green transition-colors"
                          >
                            {part.title}
                          </Link>
                        ) : (
                          <span className="font-bengali text-[0.8125rem] text-p-ink-4">
                            {part.title}
                            <span className="ml-2 font-ui text-[0.625rem] tracking-wide uppercase opacity-50">
                              {t.home.soonLabel}
                            </span>
                          </span>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </Container>
    </section>
  );
}
