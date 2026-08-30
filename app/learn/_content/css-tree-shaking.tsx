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
    label: { bn: "৪৫০ KB-এর CSS বান্ডল", en: "A 450 KB CSS bundle" },
  },
  {
    id: "architecture",
    label: { bn: "Tree shaking পাইপলাইন", en: "The tree-shaking pipeline" },
  },
  {
    id: "mechanisms",
    label: { bn: "৩টি আর্কিটেকচারাল কনসেপ্ট", en: "Three architectural concepts" },
  },
  {
    id: "implementation",
    label: { bn: "CVA ও PurgeCSS কনফিগ", en: "CVA & PurgeCSS config" },
  },
  {
    id: "matrix",
    label: { bn: "Techniques Comparison", en: "Techniques comparison" },
  },
  {
    id: "takeaway",
    label: { bn: "Production Takeaways", en: "Production takeaways" },
  },
];

export default function CssTreeShaking() {
  return (
    <article className="doc-prose">
      {/* ── The problem ───────────────────────────────────────────────── */}
      <H2 id="the-problem" anchorOnly>
        ৪৫০ KB-এর CSS বান্ডল
      </H2>

      <p>
        বিকেল ৪:১৫। প্রোডাকশন বিল্ড দেওয়ার পর ভুলু ভাই তাজ্জব — ৩টি পেজের সাধারণ একটা অ্যাপ, অথচ{" "}
        <code>main.css</code>-এর সাইজ প্রায় ৪৫০ KB, আর FCP হতে ২ সেকেন্ডের বেশি লাগছে।
      </p>

      <Line name="ভুলু ভাই">
        ফাহিম! আমার CSS বান্ডল এত ভারী কেন? আমি তো পুরো প্রজেক্টের সব স্টাইল ব্যবহারও করিনি! Tailwind
        বা কাস্টম CSS ব্যবহারের পরও কেন unused CSS প্রোডাকশন ফাইলে থেকে যাচ্ছে?
      </Line>

      <Line name="ফাহিম">
        ভুলু ভাই! JavaScript-এর মতো CSS মডিউল export/import ফলো করে না, তাই বান্ডলার AST ধরে unused
        কোড বাদ দিতে পারে না। CSS Tree Shaking (বা purging) হলো এমন প্রসেস যা আপনার HTML/JSX/TSX
        টেমপ্লেট স্ক্যান করে দেখে কোন সিলেক্টরগুলো বাস্তবে ব্যবহৃত হয়েছে, আর বাকিগুলো প্রোডাকশন বান্ডল
        থেকে ছেঁটে ফেলে।
      </Line>

      <Line name="নেক্সট-ভাই">
        একদম! Tailwind-এর JIT ইঞ্জিন কিংবা PostCSS-এর PurgeCSS প্লাগইন এই কাজটাই করে। তবে ডাইনামিক
        ক্লাস নেম কনক্যাটেনেশন (যেমন <code>{"bg-${color}-500"}</code>) করলে tree shaker সেই ক্লাস চিনতে
        পারে না এবং প্রোডাকশনে স্টাইল গায়েব হয়ে যায়।
      </Line>

      {/* ── Architecture ──────────────────────────────────────────────── */}
      <H2 id="architecture">১. CSS Tree Shaking Pipeline</H2>

      <Diagram>{`┌─────────────────────────────────────────────────────────────────────────┐
│                   CSS TREE SHAKING / PURGING PIPELINE                   │
└─────────────────────────────────────────────────────────────────────────┘

 source files (.tsx, .html)              raw global CSS / Tailwind library
 (contain the used class names)          (thousands of selectors)
              │                                       │
              └──────────────────┬────────────────────┘
                                 │
                                 ▼
                  🟢 PurgeCSS / Tailwind JIT scanner
                  ├── 1. regex-scans the source files for strings
                  ├── 2. cross-checks them against CSS selectors
                  └── 3. keeps explicitly safelisted classes
                                 │
                                 ▼
                  ✂️ dead CSS stripped (purged)
                                 │
                                 ▼
                  optimized production bundle (~10-15 KB) 🟢`}</Diagram>

      {/* ── Mechanisms ────────────────────────────────────────────────── */}
      <H2 id="mechanisms">২. কোর আর্কিটেকচারাল কনসেপ্ট</H2>

      <p>
        <strong>Static template scanning (regex, not AST):</strong> JavaScript tree shaking চলে
        import/export অ্যানালিসিসে; কিন্তু CSS tree shaker সোর্স ফাইলে থাকা স্ট্রিং টোকেন স্ক্যান করে —
        কোনো টোকেন সিলেক্টরের সাথে মিললে সেটি থাকে, নাহলে ছেঁটে ফেলা হয়।
      </p>

      <p>
        <strong>The dynamic class name pitfall:</strong>{" "}
        <code>{"className={`bg-${isDanger ? 'red' : 'green'}-500`}"}</code> লিখলে স্ক্যানার{" "}
        <code>bg-red-500</code> বা <code>bg-green-500</code> পুরো স্ট্রিং কোথাও খুঁজে পায় না — ফলে
        ক্লাসগুলো unused ধরে ডিলিট হয়ে যায়।
      </p>

      <p>
        <strong>Render-blocking CSS optimization:</strong> CSS একটি render-blocking রিসোর্স —
        অতিরিক্ত ৪০০ KB unused CSS পার্স না হওয়া পর্যন্ত পেইন্ট আটকে থাকে। সাইজ ১০ KB-তে নামালে FCP ও
        LCP উল্লেখযোগ্যভাবে ভালো হয়।
      </p>

      {/* ── Implementation ────────────────────────────────────────────── */}
      <H2 id="implementation">৩. Production Code Implementation</H2>

      <H3>❌ Anti-pattern — string interpolation breaking the scanner</H3>

      <CodeBlock filename="components/BrokenBadge.tsx">{`// 🔴 POOR PRACTICE: dynamic interpolation defeats the build-time scanner

interface BadgeProps {
  variant: 'success' | 'warning' | 'error';
}

export function BrokenBadge({ variant }: BadgeProps) {
  // ❌ the scanner only sees "bg-", "-100", "text-", "-800" as separate tokens,
  // so bg-green-100 / bg-red-100 get purged out of the production bundle
  const colorMap = {
    success: 'green',
    warning: 'yellow',
    error: 'red',
  };

  return (
    <span
      className={\`px-2 py-1 rounded bg-\${colorMap[variant]}-100 text-\${colorMap[variant]}-800\`}
    >
      Status
    </span>
  );
}`}</CodeBlock>

      <H3>🟢 Production pattern 1 — complete class names via CVA</H3>

      <CodeBlock filename="components/ui/Badge.tsx">{`// 🟢 CVA keeps whole, unbroken class strings the scanner can find
import React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

const badgeVariants = cva(
  'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium transition-colors',
  {
    variants: {
      intent: {
        success: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400',
        warning: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400',
        error: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400',
      },
    },
    defaultVariants: {
      intent: 'success',
    },
  },
);

interface BadgeProps extends VariantProps<typeof badgeVariants> {
  children: React.ReactNode;
  className?: string;
}

export function ProductionBadge({ intent, className, children }: BadgeProps) {
  return (
    <span className={twMerge(clsx(badgeVariants({ intent }), className))}>
      {children}
    </span>
  );
}`}</CodeBlock>

      <H3>🟢 Production pattern 2 — PurgeCSS for custom or legacy CSS</H3>

      <CodeBlock filename="postcss.config.js">{`// 🟢 a production-ready PostCSS configuration
module.exports = {
  plugins: [
    'tailwindcss',
    'autoprefixer',
    ...(process.env.NODE_ENV === 'production'
      ? [
          [
            '@fullhuman/postcss-purgecss',
            {
              // 🟢 the content paths scanned for used classes
              content: [
                './app/**/*.{js,jsx,ts,tsx}',
                './components/**/*.{js,jsx,ts,tsx}',
                './lib/**/*.{js,jsx,ts,tsx}',
              ],
              // 🟢 an extractor covering standard HTML/JSX tokens
              defaultExtractor: (content) => content.match(/[\\w-/:]+(?<!:)/g) || [],
              // 🟢 safelist classes generated by third-party tools at runtime
              safelist: {
                standard: [/^badge-/, /^modal-/],
                deep: [/react-select/],
              },
            },
          ],
        ]
      : []),
  ],
};`}</CodeBlock>

      {/* ── Matrix ────────────────────────────────────────────────────── */}
      <H2 id="matrix">৪. Tree Shaking Techniques Comparison</H2>

      <Table
        head={["টেকনিক", "কাজ করার প্রক্রিয়া", "ডাইনামিক ক্লাস হ্যান্ডলিং", "বান্ডল সাইজ"]}
        rows={[
          [
            "PurgeCSS (PostCSS)",
            "সোর্স ফাইল স্ক্যান করে ফাইনাল CSS থেকে সিলেক্টর ট্রিম করে",
            "safelist অ্যারে লাগে 🟡",
            "অত্যন্ত ছোট 🟢",
          ],
          [
            "Tailwind JIT engine",
            "অন-ডিমান্ড কেবল ব্যবহৃত ক্লাসের CSS জেনারেট করে",
            "ফুল স্ট্রিং লিখতে হয় 🟢",
            "সর্বনিম্ন (~১০ KB) 🟢",
          ],
          [
            "CSS Modules",
            "scoped ক্লাস তৈরি করে, তবে অকেজো ইমপোর্ট থেকে যায়",
            "JS tree shaking-এর ওপর নির্ভরশীল 🟡",
            "মাঝারি 🟡",
          ],
        ]}
      />

      <Line name="ভুলু ভাই">
        অসাধারণ ফাহিম! ডাইনামিক স্ট্রিং কনক্যাটেনেশন বাদ দিয়ে CVA ব্যবহার করার সাথে সাথেই প্রোডাকশন
        CSS বান্ডল ৪৫০ KB থেকে কমে মাত্র ১২ KB হয়ে গেল! FCP এখন এক পলকে।
      </Line>

      {/* ── Takeaways ─────────────────────────────────────────────────── */}
      <H2 id="takeaway">Production Takeaways</H2>

      <Note>
        <ul>
          <li>
            <strong>Never break class name strings:</strong> <code>{"`text-${color}`"}</code> ধরনের
            ডাইনামিক ক্লাস কখনো বানাবেন না — সবসময় ফুল স্ট্রিং ম্যাপিং ব্যবহার করুন।
          </li>
          <li>
            <strong>Leverage CVA:</strong> ভ্যারিয়েন্ট হ্যান্ডলিংয়ে CVA একদিকে ক্লিন কোড দেয়, অন্যদিকে
            tree shaker-এর কাছে সব ক্লাস দৃশ্যমান রাখে।
          </li>
          <li>
            <strong>Audit CSS in the production build:</strong> Chrome DevTools-এর Coverage ট্যাব বা
            bundle analyzer দিয়ে নিয়মিত দেখুন কত শতাংশ unused CSS লোড হচ্ছে।
          </li>
        </ul>
      </Note>
    </article>
  );
}
