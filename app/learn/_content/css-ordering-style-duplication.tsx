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
    label: { bn: "রুট ভেদে ভিন্ন স্টাইল", en: "Different styles per entry route" },
  },
  {
    id: "architecture",
    label: { bn: "Ordering ও duplication ফ্লো", en: "Ordering & duplication flow" },
  },
  {
    id: "mechanisms",
    label: { bn: "৩টি আর্কিটেকচারাল কনসেপ্ট", en: "Three architectural concepts" },
  },
  {
    id: "implementation",
    label: { bn: "Deterministic import pipeline", en: "A deterministic import pipeline" },
  },
  {
    id: "matrix",
    label: { bn: "Ordering Strategies Matrix", en: "Ordering strategies matrix" },
  },
  {
    id: "takeaway",
    label: { bn: "Production Takeaways", en: "Production takeaways" },
  },
];

export default function CssOrderingStyleDuplication() {
  return (
    <article className="doc-prose">
      {/* ── The problem ───────────────────────────────────────────────── */}
      <H2 id="the-problem" anchorOnly>
        রুট ভেদে ভিন্ন স্টাইল
      </H2>

      <p>
        সন্ধ্যা ৬:৩০। হোমপেজ থেকে প্রোডাক্ট ডিটেইলস পেজে গেলে নেভবারের ফন্ট কালার নীল থাকে, কিন্তু
        সরাসরি লিংক পেস্ট করে সেই পেজে ঢুকলে কালার কালো হয়ে যায় — অথচ দুই ক্ষেত্রেই একই নেভবার
        কম্পোনেন্ট রেন্ডার হচ্ছে।
      </p>

      <Line name="ভুলু ভাই">
        ফাহিম! এ কেমন ভুতুড়ে কাণ্ড? ডাইরেক্ট ভিজিটে স্টাইল একরকম, ক্লায়েন্ট-সাইড নেভিগেশনে আরেকরকম! আর
        বিল্ড অ্যানালাইজারে দেখছি বাটনের একই স্টাইল ১০টি আলাদা CSS চ্যাঙ্কে ডুপ্লিকেট হয়ে আছে।
      </Line>

      <Line name="ফাহিম">
        ভুলু ভাই! এর নাম CSS specificity ও import ordering conflict। ক্যাসকেড রুল অনুযায়ী দুটি
        সিলেক্টরের specificity সমান হলে যেটি পরে লোড হয় সেটিই জেতে। রুট ভেদে CSS চ্যাঙ্ক ভিন্ন অর্ডারে
        লোড হলে এই কনফ্লিক্ট ঘটে।
      </Line>

      <Line name="নেক্সট-ভাই">
        একদম! সাথে আছে style duplication — একাধিক মডিউলে <code>@import</code> করলে বান্ডলার প্রতিটি
        চ্যাঙ্কে সেই কোড কপি করে দেয়। আজ দেখব কীভাবে deterministic CSS ordering নিশ্চিত করা যায় এবং
        ডুপ্লিকেশন বন্ধ করা যায়।
      </Line>

      {/* ── Architecture ──────────────────────────────────────────────── */}
      <H2 id="architecture">১. CSS Import Ordering &amp; Duplication Flow</H2>

      <Diagram>{`┌─────────────────────────────────────────────────────────────────────────┐
│                  CSS IMPORT ORDERING & DUPLICATION FLOW                 │
└─────────────────────────────────────────────────────────────────────────┘

 ❌ UNPREDICTABLE ORDERING (route A vs route B)
 route A load: [globals.css] ──► [Button.css] ──► [Nav.css]    (Nav wins 🔵)
 route B load: [globals.css] ──► [Nav.css]    ──► [Button.css] (Button wins 🔴)
 result: the UI changes depending on which route the visitor entered from

───────────────────────────────────────────────────────────────────────────

 🟢 DETERMINISTIC ORDERING & A DEDUPLICATED BUNDLE
 single entry dependency graph:
 ┌───────────────┐   ┌───────────────┐   ┌───────────────┐
 │ 1. base/reset │──►│ 2. layout CSS │──►│ 3. components │──► purged & deduplicated
 └───────────────┘   └───────────────┘   └───────────────┘     single output (zero dupes)`}</Diagram>

      {/* ── Mechanisms ────────────────────────────────────────────────── */}
      <H2 id="mechanisms">২. কোর আর্কিটেকচারাল কনসেপ্ট</H2>

      <p>
        <strong>Deterministic cascade ordering:</strong> specificity সমান হলে ব্রাউজার ডিক্লেয়ারেশন
        অর্ডার দেখে সিদ্ধান্ত নেয়। বিভিন্ন পেজে ইমপোর্টের ধারাবাহিকতা ভিন্ন হলে ফাইনাল CSS-এর ক্রমও
        বদলে যায় — তাই global ও layout CSS সবসময় আগে, component CSS পরে ইমপোর্ট হওয়া নিশ্চিত করতে হয়।
      </p>

      <p>
        <strong>Duplication via @import:</strong> প্রতিটি মডিউলে{" "}
        <code>@import &quot;variables.css&quot;</code> করলে বিল্ড টুল অনেক সময় প্রতিটি চ্যাঙ্কেই সেই
        কোড কপি করে দেয়। এর বদলে CSS variables বা design token ব্যবহার করা উচিত।
      </p>

      <p>
        <strong>Runtime override merging:</strong> একই কম্পোনেন্টে সমমর্যাদার দুটি ক্লাস (
        <code>p-4</code> ও <code>p-6</code>) থাকলে ডিক্লেয়ারেশন অর্ডারই ঠিক করে কে জিতবে। ডাইনামিক
        ক্লাসে <code>tailwind-merge</code> এবং বিল্ডে <code>cssnano</code>-এর duplicate discard এটি
        সামলায়।
      </p>

      {/* ── Implementation ────────────────────────────────────────────── */}
      <H2 id="implementation">৩. Production Code Implementation</H2>

      <H3>❌ Anti-pattern — repeated @import and inconsistent order</H3>

      <CodeBlock filename="components/Button.module.css">{`/* 🔴 POOR PRACTICE: importing a heavy base stylesheet inside a CSS Module */
/* ❌ base-styles.css ends up duplicated in every component chunk */
@import '../styles/base-styles.css';

.button {
  padding: 10px 20px;
  background-color: var(--primary-color);
}`}</CodeBlock>

      <CodeBlock filename="app/(routes)/inconsistent-imports.tsx">{`// 🔴 POOR PRACTICE: the import order differs between routes

// Page A — app/dashboard/page.tsx
import '@/styles/widget.css'; // ❌ imported BEFORE the Button component
import { Button } from '@/components/Button';

// Page B — app/settings/page.tsx
import { Button } from '@/components/Button';
import '@/styles/widget.css'; // ❌ imported AFTER it → the cascade flips`}</CodeBlock>

      <H3>🟢 Production pattern — one deterministic entry point</H3>

      <CodeBlock filename="app/layout.tsx">{`// 🟢 PRODUCTION PATTERN: a deterministic import pipeline.
// Always import global CSS at the root entry, in strict priority order.

// 1. reset / base (lowest priority)
import '@/styles/reset.css';

// 2. global tokens and utilities
import '@/styles/globals.css';

// 3. third-party library CSS
import 'react-toastify/dist/ReactToastify.css';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}`}</CodeBlock>

      <CodeBlock filename="lib/utils/cn.ts">{`// 🟢 resolves ordering conflicts at runtime for atomic/utility CSS
import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

/**
 * Conflicts such as 'px-2 py-1' vs 'p-4' resolve predictably,
 * regardless of the order the classes were declared in.
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}`}</CodeBlock>

      <CodeBlock filename="postcss.config.js">{`// 🟢 deduplicating build pipeline
module.exports = {
  plugins: [
    'tailwindcss',
    'autoprefixer',
    // 🟢 removes duplicated rules across selector chunks in production
    ...(process.env.NODE_ENV === 'production'
      ? [
          [
            'cssnano',
            {
              preset: [
                'default',
                {
                  discardDuplicates: true, // merge duplicate rules
                  uniqueSelectors: true,   // drop duplicate selectors
                },
              ],
            },
          ],
        ]
      : []),
  ],
};`}</CodeBlock>

      {/* ── Matrix ────────────────────────────────────────────────────── */}
      <H2 id="matrix">৪. CSS Ordering Strategies Matrix</H2>

      <Table
        head={["ক্রাইটেরিয়া", "Scattered @import", "Unstructured component CSS", "Deterministic pipeline"]}
        rows={[
          [
            "Cascade predictability",
            "রুট ভেদে UI বদলায় 🔴",
            "পেজ অনুযায়ী পরিবর্তনশীল 🔴",
            "১০০% ফিক্সড ইমপোর্ট অর্ডার 🟢",
          ],
          [
            "Duplication risk",
            "প্রচণ্ড বেশি 🔴",
            "মাঝারি 🟡",
            "জিরো (cssnano/purge) 🟢",
          ],
          [
            "Conflict handling",
            <span key="c">
              <code>!important</code> লিখে সমাধান 🔴
            </span>,
            "ফাইল এডিট করতে হয় 🔴",
            <span key="d">
              <code>twMerge</code> / <code>@layer</code> দিয়ে অটোমেটেড 🟢
            </span>,
          ],
        ]}
      />

      <Line name="ভুলু ভাই">
        মাথা নষ্ট ফাহিম! রুট লেআউটে ইমপোর্ট অর্ডার ফিক্স করে দেওয়া আর cssnano-র duplicate discard অন
        করার পর পেজ ভেদে বাটনের কালার বদলানোর ভুতুড়ে সমস্যা এক চান্সেই ফিক্সড — বান্ডল সাইজও কমেছে।
      </Line>

      {/* ── Takeaways ─────────────────────────────────────────────────── */}
      <H2 id="takeaway">Production Takeaways</H2>

      <Note>
        <ul>
          <li>
            <strong>Centralize CSS entry imports:</strong> প্রতিটি পেজে আলাদা করে গ্লোবাল বা ইউটিলিটি
            CSS ইমপোর্ট করবেন না — সব গ্লোবাল ডিপেন্ডেন্সি root layout-এ দিন।
          </li>
          <li>
            <strong>Stop importing CSS files inside CSS Modules:</strong> মডিউলের ভেতরে{" "}
            <code>@import</code> নয় — শেয়ারড ভ্যালুর জন্য CSS custom properties ব্যবহার করুন।
          </li>
          <li>
            <strong>Use deduplicating PostCSS plugins:</strong> প্রোডাকশন বিল্ডে{" "}
            <code>cssnano</code>-এর <code>discardDuplicates</code> চালু রাখুন।
          </li>
        </ul>
      </Note>
    </article>
  );
}
