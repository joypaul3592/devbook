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
      bn: "Core Web Vitals failed",
      en: "Core Web Vitals failed",
    },
  },
  {
    id: "architecture",
    label: {
      bn: "বাজেট থেকে মেট্রিক পর্যন্ত",
      en: "From budget to metric",
    },
  },
  {
    id: "mechanisms",
    label: {
      bn: "৪টি বাজেটিং রুল",
      en: "Four budgeting rules",
    },
  },
  {
    id: "implementation",
    label: {
      bn: "CI বাজেট, LCP, INP ও CLS",
      en: "CI budgets, LCP, INP, CLS",
    },
  },
  {
    id: "matrix",
    label: { bn: "মেট্রিক, অপরাধী, সমাধান", en: "Metric, culprit, fix" },
  },
  {
    id: "takeaway",
    label: { bn: "Production Takeaways", en: "Production takeaways" },
  },
];

export default function PerformanceBudgetingCoreWebVitals() {
  return (
    <article className="doc-prose">
      {/* ── The problem ───────────────────────────────────────────────── */}
      <H2 id="the-problem" anchorOnly>
        Core Web Vitals failed
      </H2>

      <p>
        সন্ধ্যা ৭:৪৫। Search Console থেকে মেইল এসেছে — <em>Core Web Vitals failed</em>। মোবাইলে
        পারফরম্যান্স স্কোর নেমে ৩৮। অর্গানিক ট্রাফিক কমছে, আর ক্লায়েন্ট বলছে মোবাইল ডাটায় বোতামে ক্লিক
        করার ২ সেকেন্ড পর স্ক্রিন সাড়া দেয়।
      </p>

      <Line name="ভুলু ভাই">
        ফাহিম! ফার্স্ট লোডেই ৪ মেগাবাইট JavaScript নামছে! ভারী চার্টটা লোড হওয়ার সময় পুরো লেআউট লাফ
        দিয়ে নিচে নেমে যায়। এই Core Web Vitals ফিক্স করব কীভাবে?
      </Line>

      <Line name="ফাহিম">
        ভুলু ভাই! আসল সমস্যা হলো আমরা এতদিন স্পিড না মেপেই ফিচার বানিয়ে গেছি। দরকার{" "}
        <strong>performance budget</strong> — একটি কঠোর সীমা, যেমন &ldquo;প্রথম লোডে ১০০ KB-র বেশি
        JS নয়&rdquo; — আর সেই সীমা CI-তে জোরদার করা। একবার অপ্টিমাইজ করে ফেললেই শেষ নয়; পরের স্প্রিন্টে
        আবার ফিরে আসবে।
      </Line>

      <Line name="নেক্সট-ভাই">
        একদম! মেট্রিকগুলো কী মাপে সেটা জানা এক জিনিস, আর সেগুলো খারাপ হতে <em>না দেওয়া</em> আরেক
        জিনিস। আজকের বিষয় দ্বিতীয়টা — বাজেট, এনফোর্সমেন্ট, আর রিগ্রেশন ঠেকানো।
      </Line>

      {/* ── Architecture ──────────────────────────────────────────────── */}
      <H2 id="architecture">১. From Budget to Metric</H2>

      <Diagram>{`┌─────────────────────────────────────────────────────────────────────────────┐
│                   PERFORMANCE BUDGET → WEB VITALS                           │
└─────────────────────────────────────────────────────────────────────────────┘

  [ PR opened ]
        │
        ▼
  [ CI budget check ] ──► first-load JS over 100 KB?  → fail the build 🔴
        │                  a budget nobody enforces is a wish, not a budget
        ▼
  [ LCP ≤ 2.5s ]      ──► server-rendered HTML, <Image priority>, next/font
        │
        ▼
  [ INP ≤ 200ms ]     ──► main thread free: dynamic imports, useTransition
        │
        ▼
  [ CLS ≤ 0.1 ]       ──► reserved space: aspect ratios, sized images
        │
        ▼
  [ RUM in production ] ──► real devices, real networks — the only real score`}</Diagram>

      {/* ── Mechanisms ────────────────────────────────────────────────── */}
      <H2 id="mechanisms">২. কোর বাজেটিং রুল</H2>

      <p>
        <strong>Enforce the budget in CI:</strong> প্রতিটি PR-এ বান্ডেল সাইজ চেক করুন। সীমা
        ছাড়ালে বিল্ড ফেল করুক। রিভিউয়ে &ldquo;এটা একটু ভারী হয়ে গেল না?&rdquo; বলার ওপর ভরসা করলে
        ছয় মাসে বান্ডেল দ্বিগুণ হবেই।
      </p>

      <p>
        <strong>LCP is mostly the hero:</strong> ভিউপোর্টের সবচেয়ে বড় এলিমেন্ট সার্ভার থেকেই আসুক।
        হিরো ইমেজে <code>priority</code> দিন — এতে Next.js preload হিন্ট যোগ করে আর lazy loading
        বন্ধ করে। ফন্ট <code>next/font</code> দিয়ে সেলফ-হোস্ট করুন, তাহলে আলাদা ডোমেইনে DNS lookup
        লাগে না।
      </p>

      <p>
        <strong>INP is main-thread time:</strong> ক্লিকের পর ব্রাউজারকে সাড়া দিতে হলে মেইন থ্রেড
        ফাঁকা লাগবে। ভারী কম্পোনেন্ট <code>next/dynamic</code> দিয়ে সরান, আর অ-জরুরি স্টেট আপডেট{" "}
        <code>useTransition</code>-এ মুড়ে দিন — তাহলে ইনপুট আগে, রেন্ডার পরে।
      </p>

      <p>
        <strong>CLS is unreserved space:</strong> যা পরে লোড হবে, তার জায়গা আগে থেকে ধরে রাখুন —
        ইমেজে <code>width</code>/<code>height</code> বা <code>aspect-*</code>, আর লেজি উইজেটে{" "}
        <code>min-h-*</code>। স্কেলিটনের উচ্চতা আসল কনটেন্টের সমান হওয়া চাই, নইলে স্কেলিটন নিজেই
        শিফট ঘটায়।
      </p>

      {/* ── Implementation ────────────────────────────────────────────── */}
      <H2 id="implementation">৩. Production Code Implementation</H2>

      <H3>🟢 Step 1 — বিল্ড কনফিগ ও অ্যানালাইজার</H3>

      <CodeBlock filename="next.config.ts">{`// 🟢 PRODUCTION PATTERN: measurable builds, modern image formats
import bundleAnalyzer from '@next/bundle-analyzer';
import type { NextConfig } from 'next';

const withBundleAnalyzer = bundleAnalyzer({
  enabled: process.env.ANALYZE === 'true',
});

const nextConfig: NextConfig = {
  experimental: {
    // 🟢 rewrites barrel imports to deep ones, so one icon does not
    //    pull an entire icon library into the bundle
    optimizePackageImports: ['lucide-react', 'date-fns'],
  },

  images: {
    formats: ['image/avif', 'image/webp'],
    minimumCacheTTL: 31_536_000,
  },
};

export default withBundleAnalyzer(nextConfig);`}</CodeBlock>

      <CodeBlock label="YAML" filename=".github/workflows/perf-budget.yml">{`# 🟢 PRODUCTION PATTERN: the budget fails the build, not the code review
name: Performance budget

on: pull_request

jobs:
  budget:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: 'pnpm'

      - run: pnpm install --frozen-lockfile
      - run: pnpm run build

      # fails when any route's first-load JS exceeds the configured budget
      - name: Check bundle budgets
        run: pnpm dlx bundlesize

      # and a Lighthouse run against the real built app
      - name: Lighthouse CI
        uses: treosh/lighthouse-ci-action@v11
        with:
          urls: |
            http://localhost:3000/
            http://localhost:3000/matches
          budgetPath: ./lighthouse-budget.json`}</CodeBlock>

      <H3>🟢 Step 2 — LCP আর CLS ঠিক রাখা পেজ</H3>

      <CodeBlock filename="src/app/matches/page.tsx">{`// 🟢 PRODUCTION PATTERN: a server page — the hero ships as HTML, not JS
import Image from 'next/image';
import { AnalyticsChartLoader } from './_components/AnalyticsChartLoader';

export default function MatchDetailPage() {
  return (
    <div className="mx-auto max-w-4xl space-y-6 p-6">
      {/* 🟢 LCP: aspect-video reserves the box before the pixels arrive,
          and priority preloads the image instead of lazy-loading it */}
      <div className="relative aspect-video w-full overflow-hidden rounded-2xl bg-slate-900">
        <Image
          src="/images/hero-stadium.jpg"
          alt="Live stadium match"
          fill
          priority
          sizes="(max-width: 768px) 100vw, 1200px"
          className="object-cover"
        />
      </div>

      <h1 className="text-3xl font-extrabold tracking-tight">
        Finals: Red Dragons vs Blue Wings
      </h1>

      {/* 🟢 CLS: the container is as tall as the chart will be, so nothing
          below it moves when the chart finally renders */}
      <div className="min-h-[260px] rounded-xl border p-4">
        <AnalyticsChartLoader />
      </div>
    </div>
  );
}`}</CodeBlock>

      <CodeBlock filename="src/app/matches/_components/AnalyticsChartLoader.tsx">{`// 🟢 PRODUCTION PATTERN: dynamic() with ssr:false is only allowed inside a
//    client component — hence this thin wrapper around the heavy chart
'use client';

import dynamic from 'next/dynamic';

const HeavyAnalyticsChart = dynamic(
  () => import('@/components/charts/HeavyAnalyticsChart'),
  {
    ssr: false,
    // the skeleton matches the chart's height exactly — otherwise the
    // loading state itself becomes a layout shift
    loading: () => <div className="h-[228px] animate-pulse rounded-lg bg-slate-200" />,
  },
);

export function AnalyticsChartLoader() {
  return <HeavyAnalyticsChart />;
}`}</CodeBlock>

      <H3>🟢 Step 3 — মাঠের আসল সংখ্যা</H3>

      <CodeBlock filename="src/components/WebVitalsReporter.tsx">{`// 🟢 PRODUCTION PATTERN: lab scores are a proxy; field data is the truth
'use client';

import { useReportWebVitals } from 'next/web-vitals';

export function WebVitalsReporter() {
  useReportWebVitals((metric) => {
    if (process.env.NODE_ENV !== 'production') return;

    const body = JSON.stringify({
      name: metric.name,
      value: Number(metric.value.toFixed(2)),
      rating: metric.rating, // 'good' | 'needs-improvement' | 'poor'
      id: metric.id,
      path: window.location.pathname,
    });

    // 🟢 sendBeacon survives the page unload and never blocks the main thread
    if (navigator.sendBeacon) {
      navigator.sendBeacon('/api/analytics/vitals', body);
    }
  });

  return null;
}`}</CodeBlock>

      {/* ── Matrix ────────────────────────────────────────────────────── */}
      <H2 id="matrix">৪. Metric, Culprit, Fix</H2>

      <Table
        head={["মেট্রিক", "লক্ষ্য", "প্রধান অপরাধী", "Next.js সমাধান"]}
        rows={[
          [
            "LCP",
            "≤ ২.৫s",
            "আন-অপটিমাইজড হিরো ইমেজ, দেরিতে ডাটা",
            "<Image priority> + সার্ভার রেন্ডার 🟢",
          ],
          [
            "INP",
            "≤ ২০০ms",
            "মেইন থ্রেডে ভারী JS",
            "next/dynamic + useTransition 🟢",
          ],
          [
            "CLS",
            "≤ ০.১",
            "জায়গা রিজার্ভ না করা ইমেজ ও উইজেট",
            "aspect ratio + next/font 🟢",
          ],
          [
            "TTFB",
            "≤ ৮০০ms",
            "ধীর DB কোয়েরি, আনক্যাশড SSR",
            "edge caching + distributed cache 🟢",
          ],
        ]}
      />

      <Line name="ভুলু ভাই">
        ফাহিম! অ্যানালাইজার চালিয়ে দেখি চার্টিং লাইব্রেরি একাই ১.২ মেগাবাইট খেয়ে বসে ছিল! সেটাকে
        lazy-load করে আর হিরো ইমেজে <code>priority</code> দিতেই স্কোর ৩৮ থেকে ৯৬-এ উঠে গেছে — আর CI
        বাজেট বসানোয় আর কখনো নামবেও না!
      </Line>

      {/* ── Takeaways ─────────────────────────────────────────────────── */}
      <H2 id="takeaway">Production Takeaways</H2>

      <Note>
        <ul>
          <li>
            <strong>A budget must fail the build:</strong> CI-তে bundle size ও Lighthouse চেক বসান
            — নইলে প্রতিটি স্প্রিন্টে সাইজ একটু একটু করে বাড়বে, আর কেউ টের পাবে না।
          </li>
          <li>
            <strong>Size the skeleton like the content:</strong> স্কেলিটনের উচ্চতা আসল কম্পোনেন্টের
            সমান না হলে লোডিং স্টেট নিজেই CLS তৈরি করে।
          </li>
          <li>
            <strong>Trust field data over lab scores:</strong> Lighthouse একটি দ্রুত মেশিনে চলে;
            আসল ইউজারের ফোনে নয়। RUM ছাড়া আপনি কখনো জানবেন না স্কোরটা সত্যি কত।
          </li>
        </ul>
      </Note>
    </article>
  );
}
