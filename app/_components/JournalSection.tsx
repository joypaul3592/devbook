"use client";

import Link from "next/link";
import { JournalEntryCard } from "@/components/blog/JournalEntryCard";
import { useLanguage } from "@/components/providers";
import { journalEntries } from "@/lib/data";
import Container from "@/components/layout/Container";

export function JournalSection() {
  const { t } = useLanguage();
  const recentJournal = journalEntries.slice(0, 4);

  return (
    <section data-section>
      <Container>
        <div
          data-section-label
          className="flex items-center justify-between mb-4"
        >
          <div className="p-chapter flex-1">
            <span>{t.home.journalLabel}</span>
          </div>
          <Link
            href="/journal"
            className="font-ui text-[0.75rem] text-p-ink-3 hover:text-p-green transition-colors duration-200 ml-5 shrink-0"
          >
            {t.home.seeAll} →
          </Link>
        </div>

        <p
          data-section-item
          className="font-bengali text-[0.9375rem] text-p-ink-3 mb-10 max-w-md leading-relaxed"
        >
          {t.home.journalDesc}
        </p>

        <div className="max-w-xl" data-section-item>
          {recentJournal.map((entry) => (
            <JournalEntryCard key={entry.id} entry={entry} />
          ))}
        </div>
      </Container>
    </section>
  );
}
