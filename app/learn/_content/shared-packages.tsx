import {
  CodeBlock,
  Diagram,
  H2,
  H3,
  Line,
  Note,
  Table,
} from "@/components/learn/DocParts";
import type { Bi } from "@/lib/curriculum";

/** Section anchors — consumed by the "on this page" rail. */
export const headings: { id: string; label: Bi }[] = [
  {
    id: "the-problem",
    label: {
      bn: "formatDate ইমপোর্ট করে fs এরর",
      en: "Import formatDate, get an fs error",
    },
  },
  {
    id: "architecture",
    label: {
      bn: "এক-মুখী নির্ভরতার প্রবাহ",
      en: "The one-way dependency flow",
    },
  },
  {
    id: "mechanisms",
    label: {
      bn: "৪টি shared রুল",
      en: "Four rules for shared code",
    },
  },
  {
    id: "implementation",
    label: {
      bn: "Pure util, typed env ও generic hook",
      en: "Pure utils, typed env, generic hooks",
    },
  },
  {
    id: "matrix",
    label: { bn: "কোন ফোল্ডারে কী", en: "What belongs where" },
  },
  {
    id: "takeaway",
    label: { bn: "Production Takeaways", en: "Production takeaways" },
  },
];

export default function SharedPackages() {
  return (
    <article className="doc-prose">
      {/* ── The problem ───────────────────────────────────────────────── */}
      <H2 id="the-problem" anchorOnly>
        formatDate ইমপোর্ট করে fs এরর
      </H2>

      <p>
        বিকেল ৪:১৫। ভুলু ভাই কেবল <code>src/utils/index.ts</code> থেকে একটি তারিখ ফরম্যাট করার
        ফাংশন ইমপোর্ট করেছিলেন। ব্রাউজারে লাল এরর:{" "}
        <em>Module not found: Can&rsquo;t resolve &lsquo;fs&rsquo;</em>। আরও অদ্ভুত — স্পোর্টস
        ফিচারের জন্য <code>currencyFormatter</code>-এ ছোট একটা চেঞ্জ করতেই পে-আউট ফিচার ভেঙে
        গুঁড়িয়ে গেছে।
      </p>

      <Line name="ভুলু ভাই">
        ফাহিম! সাধারণ একটা <code>formatDate()</code> কল করতে গিয়ে ব্রাউজারে Node.js-এর{" "}
        <code>fs</code> এরর দিচ্ছে কেন? আর <code>shared/utils</code>-এর ফাইল বদলালে সম্পূর্ণ অজানা
        একটা ফিচার কেন ভাঙে?
      </Line>

      <Line name="ফাহিম">
        ভুলু ভাই! আপনি দুটো ফাঁদে একসাথে পড়েছেন — premature abstraction আর monolithic barrel file।
        একটি গ্লোবাল <code>utils/index.ts</code> বানিয়ে ফেলেছেন যেখানে সার্ভার কোড আর ক্লায়েন্ট
        হেলপার একসাথে খিচুড়ি। ক্লায়েন্ট ছোট একটা হেলপার চাইলেও বান্ডলার পুরো ফাইলটাই টেনে আনে।
      </Line>

      <Line name="নেক্সট-ভাই">
        একদম! Shared কোডের প্রথম ও প্রধান নিয়ম — এটি হতে হবে <strong>feature-agnostic</strong> (কোনো
        নির্দিষ্ট ফিচারের লজিক মুক্ত) আর <strong>strictly isolated</strong> (tree-shaking বান্ধব,
        বাউন্ডারি নিয়ন্ত্রিত)।
      </Line>

      {/* ── Architecture ──────────────────────────────────────────────── */}
      <H2 id="architecture">১. One-Way Dependency Flow</H2>

      <Diagram>{`┌─────────────────────────────────────────────────────────────────────────────┐
│                   STRICT ONE-WAY DEPENDENCY FLOW                            │
└─────────────────────────────────────────────────────────────────────────────┘

  [ ROUTES / PAGES ]   ──► src/app/
             │
             ▼
  [ FEATURE MODULES ]  ──► src/features/sports/, src/features/payouts/
             │              feature-specific logic and UI
             ▼
  [ SHARED LAYER ]     ──► src/shared/  (or internal monorepo packages)
  (feature-agnostic)       ├── ui/      pure primitives: Button, Dialog
                           ├── utils/   pure helpers: date, string, currency
                           ├── hooks/   generic hooks: useDebounce
                           └── config/  typed env, app constants

  ⚠️  shared/ may NEVER import from features/ or app/.
      if a shared file needs to name a feature, it does not belong in shared.`}</Diagram>

      {/* ── Mechanisms ────────────────────────────────────────────────── */}
      <H2 id="mechanisms">২. কোর shared রুল</H2>

      <p>
        <strong>Feature-agnostic principle:</strong> <code>shared/</code>-এর কোড এমন হতে হবে যা অন্য
        যেকোনো প্রজেক্টে তুলে নেওয়া যায়। <code>formatCurrency(100)</code> shared হতে পারে, কিন্তু{" "}
        <code>calculateSportsBettingOdds()</code> কখনোই নয় — সেটি{" "}
        <code>features/sports/</code>-এর জিনিস।
      </p>

      <p>
        <strong>Tree-shaking &amp; modular exports:</strong> একটি বিশাল <code>index.ts</code>-এ সব
        ইউটিলিটি এক্সপোর্ট করবেন না। প্রতিটি হেলপার আলাদা ফাইলে রাখুন, আর নির্দিষ্ট পথ থেকে ইমপোর্ট
        করুন — তাহলেই বান্ডলার অব্যবহৃত কোড বাদ দিতে পারে।
      </p>

      <p>
        <strong>No server pollution in client utilities:</strong> যেসব হেলপার ব্রাউজারে চলবে,
        সেগুলোতে কখনো Node প্যাকেজ, ORM বা সিক্রেট env ভ্যারিয়েবল ইমপোর্ট করা যাবে না। সার্ভার-only
        হেলপার হলে ফাইলের উপরে <code>import &lsquo;server-only&rsquo;</code> দিয়ে বিল্ডকেই পাহারায়
        বসিয়ে দিন।
      </p>

      <p>
        <strong>Strict one-way dependency:</strong> <code>shared/</code> কখনো{" "}
        <code>features/</code> বা <code>app/</code> থেকে ইমপোর্ট করবে না। এই নিয়ম ভাঙলেই circular
        dependency আর তারপর &ldquo;একটা ফাইল বদলে অজানা ফিচার ভাঙা&rdquo; শুরু হয়।
      </p>

      {/* ── Implementation ────────────────────────────────────────────── */}
      <H2 id="implementation">৩. Production Code Implementation</H2>

      <H3>❌ Anti-pattern — kitchen-sink utils/index.ts</H3>

      <CodeBlock filename="src/utils/index.ts">{`// 🔴 POOR PRACTICE: one file holding client helpers, feature logic and the DB
import { db } from '@/lib/db';                        // ❌ server code
import type { MatchStatus } from '@/features/sports/types'; // ❌ upward import

// a harmless client helper — but importing it drags in everything below
export function formatDate(date: Date): string {
  return new Intl.DateTimeFormat('bn-BD').format(date);
}

// ❌ feature logic leaked into a "generic" shared file
export function formatSportsStatus(status: MatchStatus) {
  return status === 'LIVE' ? 'সরাসরি' : 'সমাপ্ত';
}

// ❌ a database call in the same module a client component imports from
export async function getUserFromSharedDb(id: string) {
  return db.user.findUnique({ where: { id } });
}`}</CodeBlock>

      <H3>🟢 Production pattern — modular, pure, typed</H3>

      <p>
        <strong>Step 1 — একটি ফাইল, একটি দায়িত্ব।</strong>
      </p>

      <CodeBlock filename="src/shared/utils/currency.ts">{`// 🟢 PRODUCTION PATTERN: an isolated pure function with zero dependencies

export interface CurrencyFormatOptions {
  currency?: 'BDT' | 'USD' | 'EUR';
  locale?: string;
}

/**
 * Formats a raw number as a localized currency string.
 * Pure: the same input always produces the same output, so it needs no tests
 * beyond its own, and no mocks at all.
 */
export function formatCurrency(
  amount: number,
  options: CurrencyFormatOptions = {},
): string {
  const { currency = 'BDT', locale = 'bn-BD' } = options;

  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency,
    maximumFractionDigits: 2,
  }).format(amount);
}`}</CodeBlock>

      <p>
        <strong>Step 2 — টাইপ-সেফ, ভ্যালিডেটেড env।</strong>
      </p>

      <CodeBlock filename="src/shared/config/env.ts">{`// 🟢 PRODUCTION PATTERN: validate the environment once, at the boundary
import { z } from 'zod';

const envSchema = z.object({
  NEXT_PUBLIC_API_URL: z.string().url(),
  NEXT_PUBLIC_APP_NAME: z.string().default('Stadium Today'),
  DATABASE_URL: z.string().min(1).optional(),
});

// 🟢 a missing or malformed variable fails the build, not a user's request
export const env = envSchema.parse({
  NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL,
  NEXT_PUBLIC_APP_NAME: process.env.NEXT_PUBLIC_APP_NAME,
  DATABASE_URL: process.env.DATABASE_URL,
});`}</CodeBlock>

      <p>
        <strong>Step 3 — সার্ভার-only কোডে পাহারা।</strong>
      </p>

      <CodeBlock filename="src/shared/utils/hash.server.ts">{`// 🟢 PRODUCTION PATTERN: the build refuses to bundle this into client code
import 'server-only';

import { createHash } from 'node:crypto';

export function hashToken(token: string): string {
  return createHash('sha256').update(token).digest('hex');
}

// if a client component ever imports this, the build fails with a clear
// message — instead of shipping a confusing "can't resolve crypto" error`}</CodeBlock>

      <p>
        <strong>Step 4 — generic ক্লায়েন্ট hook।</strong>
      </p>

      <CodeBlock filename="src/shared/hooks/useDebounce.ts">{`// 🟢 PRODUCTION PATTERN: reusable and entirely feature-agnostic
'use client';

import { useEffect, useState } from 'react';

export function useDebounce<T>(value: T, delay: number = 500): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedValue(value), delay);
    return () => clearTimeout(timer);
  }, [value, delay]);

  return debouncedValue;
}`}</CodeBlock>

      {/* ── Matrix ────────────────────────────────────────────────────── */}
      <H2 id="matrix">৪. Shared Module Organisation</H2>

      <Table
        head={["ফোল্ডার", "দায়িত্ব", "কী থাকবে", "কী থাকবে না"]}
        rows={[
          [
            "shared/ui/",
            "ডিজাইন সিস্টেম প্রিমিটিভ",
            "Button, Input, Modal, Badge",
            "API কল, বিজনেস স্টেট 🔴",
          ],
          [
            "shared/utils/",
            "পিওর হেলপার ও ম্যাথ",
            "currency.ts, date.ts, string.ts",
            "fs, DB অ্যাক্সেস, ফিচার enum 🔴",
          ],
          [
            "shared/hooks/",
            "রিইউজেবল ক্লায়েন্ট hook",
            "useDebounce, useMediaQuery",
            "ফিচার-নির্ভর লজিক 🔴",
          ],
          [
            "shared/config/",
            "কনফিগ ও কনস্ট্যান্ট",
            "typed env, route constant",
            "রানটাইম ইউজার ডাটা 🔴",
          ],
        ]}
      />

      <Line name="ভুলু ভাই">
        দারুণ ফাহিম! ফাইল ভাগ করে দিতেই <code>fs</code> এররটা উধাও, আর{" "}
        <code>server-only</code> বসানোয় ভবিষ্যতে কেউ ভুল করলে বিল্ডই ধরে ফেলবে!
      </Line>

      {/* ── Takeaways ─────────────────────────────────────────────────── */}
      <H2 id="takeaway">Production Takeaways</H2>

      <Note>
        <ul>
          <li>
            <strong>Avoid the utils barrel:</strong> নির্দিষ্ট পথ থেকে ইমপোর্ট করুন (
            <code>@/shared/utils/currency</code>) — তবেই tree-shaking অব্যবহৃত কোড বাদ দিতে পারবে।
          </li>
          <li>
            <strong>The naming test:</strong> shared ফাইলের ভেতর যদি কোনো ফিচারের নাম টাইপ করতে হয়,
            তাহলে কোডটি shared-এর উপযুক্ত নয় — সেটিকে ফিচারে ফেরত পাঠান।
          </li>
          <li>
            <strong>Guard the server boundary:</strong> সার্ভার-only হেলপারে{" "}
            <code>import &lsquo;server-only&rsquo;</code> লিখুন, আর env সবসময়{" "}
            <code>shared/config/env.ts</code>-এর মাধ্যমে ভ্যালিডেট করে ব্যবহার করুন।
          </li>
        </ul>
      </Note>
    </article>
  );
}
