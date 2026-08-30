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
      bn: "হোমপেজে অন্য রুটের মেগাবাইট",
      en: "Other routes' megabytes on the home page",
    },
  },
  {
    id: "architecture",
    label: {
      bn: "Monolithic bundle বনাম route-segment chunk",
      en: "Monolithic bundle vs route-segment chunk",
    },
  },
  {
    id: "mechanisms",
    label: { bn: "৩টি মূল মেকানিজম", en: "Three core mechanisms" },
  },
  {
    id: "implementation",
    label: {
      bn: "Central index বনাম isolated route",
      en: "Central index vs isolated routes",
    },
  },
  {
    id: "matrix",
    label: {
      bn: "Route Splitting Architecture Matrix",
      en: "Route splitting architecture matrix",
    },
  },
  {
    id: "takeaway",
    label: { bn: "Production Takeaways", en: "Production takeaways" },
  },
];

export default function RouteLevelCodeSplitting() {
  return (
    <article className="doc-prose">
      {/* ── The problem ───────────────────────────────────────────────── */}
      <H2 id="the-problem" anchorOnly>
        হোমপেজে অন্য রুটের মেগাবাইট
      </H2>

      <p>
        সকাল ১০:১৫। ভুলু ভাই তার নতুন ই-কমার্স অ্যাডমিন প্যানেলের ল্যান্ডিং পেজ <code>/</code> টেস্ট
        করতে গিয়ে ট্রিম্যাপ চার্টে দেখলেন — একজন সাধারণ ইউজার যখন শুধু হোমপেজে প্রবেশ করছে, তখনও তার
        ব্রাউজারে <code>/admin/analytics</code> পেজের ভারী <code>recharts</code> এবং{" "}
        <code>/admin/billing</code> পেজের PDF জেনারেটর লাইব্রেরির জাভাস্ক্রিপ্ট চ্যাঙ্ক ডাউনলোড হচ্ছে।
      </p>

      <Line name="ভুলু ভাই">
        ফাহিম! ইউজার তো এখনও শুধু হোমপেজে এসেছে, সে তো অ্যানালিটিক্স বা বিলিং পেজে যায়ইনি! তবুও
        অ্যাপের হোমপেজে অন্যান্য পেজের মেগাবাইট সাইজের জাভাস্ক্রিপ্ট কোড কেন ডাউনলোড হয়ে মেমরি জাম্প
        করছে?
      </Line>

      <Line name="ফাহিম">
        ভুলু ভাই! আপনি Shared Layout অথবা একটি কেন্দ্রীয় Export Index ফাইলের ভেতরে সব পেজের
        কম্পোনেন্ট একসাথে ইমপোর্ট করে রেখেছেন! ফলে Next.js-এর স্বয়ংক্রিয় Route-level Code Splitting
        বাউন্ডারি ভেঙে গিয়ে পুরো অ্যাপের কোড একটি সিঙ্গেল মনোলিথিক জাভাস্ক্রিপ্ট চ্যাঙ্কে মিশে গেছে।
      </Line>

      <Line name="নেক্সট-ভাই">
        একদম! Next.js 15 App Router বাই-ডিফল্ট প্রতিটি রুট ডিরেক্টরিকে (যেমন{" "}
        <code>app/dashboard/page.tsx</code>, <code>app/analytics/page.tsx</code>) স্বয়ংক্রিয়ভাবে একটি
        আইসোলেটেড Async JS Chunk হিসেবে স্প্লিট করে ফেলে। ইউজার যে রুটে ভিজিট করবে, ব্রাউজার শুধুমাত্র
        সেই রুটের প্রয়োজনীয় মিনিমাল HTML/JS এবং তার সাথে শেয়ার করা লেআউটের চ্যাঙ্ক ডাউনলোড করবে।
      </Line>

      {/* ── Architecture ──────────────────────────────────────────────── */}
      <H2 id="architecture">
        ১. Monolithic Bundle vs. Route-Segment Chunk Execution Pipeline
      </H2>

      <Diagram>{`┌─────────────────────────────────────────────────────────────────────────┐
│           MONOLITHIC BUNDLE VS. ROUTE-LEVEL CODE SPLITTING              │
└─────────────────────────────────────────────────────────────────────────┘

 ❌ MONOLITHIC ROUTE BUNDLING (shared import bleeding)
 Visitor lands on: / (Home)
 ┌───────────────────────────────────────────────────────────────────────┐
 │ Single JS bundle loaded:                                              │
 │ ├── Home page code (20 KB)                                            │
 │ ├── /analytics chart engine (450 KB)    ──► 🔴 unnecessary download   │
 │ └── /billing PDF export engine (800 KB) ──► 🔴 unnecessary download   │
 └──────────────────────────────────┬────────────────────────────────────┘
                                    │ total transfer: ~1.3 MB
                                    ▼
                     🔴 SLOW FIRST CONTENTFUL PAINT (FCP)

───────────────────────────────────────────────────────────────────────────

 🟢 NEXT.JS 15 AUTOMATIC ROUTE-LEVEL CHUNKING
 Visitor lands on: / (Home)
 ┌───────────────────────────────────────────────────────────────────────┐
 │ Next.js router downloads ONLY:                                        │
 │ ├── app/layout.js (shared shell — 15 KB)                              │
 │ └── app/page.js (home segment — 10 KB)                                │
 └──────────────────────────────────┬────────────────────────────────────┘
                                    │ total transfer: ~25 KB
                                    ▼
                     🟢 INSTANT PAGE LOAD & ZERO EXECUTION WASTE`}</Diagram>

      {/* ── Mechanisms ────────────────────────────────────────────────── */}
      <H2 id="mechanisms">২. Route-Level Code Splitting-এর ৩টি মূল মেকানিজম</H2>

      <p>
        <strong>Automatic file-system chunking:</strong> App Router-এর প্রতিটি <code>page.tsx</code>{" "}
        এবং <code>layout.tsx</code> ফাইলকে Next.js-এর বিল্ডার (Turbopack/Webpack) আলাদা আইডিযুক্ত
        জাভাস্ক্রিপ্ট ফাইল চ্যাঙ্কে রূপান্তর করে।
      </p>

      <p>
        <strong>Viewport-based prefetching:</strong> যখন কোনো পেজে{" "}
        <code>&lt;Link href=&quot;/analytics&quot;&gt;</code> থাকে, তখন Next.js ইউজার ভিউপোর্টে থাকা
        উক্ত লিঙ্কের রুট-চ্যাঙ্কটি ব্যাকগ্রাউন্ডে low-priority রিকোয়েস্ট দিয়ে প্রি-ফেচ করে নেয়। এতে
        ক্লিক করার সাথে সাথে ইনস্ট্যান্ট পেজ ট্রানজিশন ঘটে।
      </p>

      <p>
        <strong>Boundary isolation via loading.tsx:</strong> রুটের ভেতর <code>loading.tsx</code> বা
        React Suspense Boundary বসালে চ্যাঙ্ক স্প্লিটিং আরও সুনির্দিষ্ট হয়, যা পেজ ট্রানজিশনের সময়
        সার্ভার ডেটা ফেচিং ও UI চ্যাঙ্ক রেন্ডারিংকে আইসোলেট করে ফেলে।
      </p>

      {/* ── Implementation ────────────────────────────────────────────── */}
      <H2 id="implementation">৩. Production Code Implementation</H2>

      <H3>❌ Anti-pattern — central index import bleeding</H3>

      <CodeBlock filename="lib/components-index.ts">{`// 🔴 POOR PRACTICE: re-exporting all pages from a central index file
export { HomePage } from '@/components/pages/HomePage';
export { AnalyticsChart } from '@/components/pages/AnalyticsChart'; // heavy recharts
export { BillingPdfEngine } from '@/components/pages/BillingPdfEngine'; // heavy PDF`}</CodeBlock>

      <CodeBlock filename="app/layout.tsx">{`// 🔴 POOR PRACTICE: the root layout imports from a central index
import { AnalyticsChart } from '@/lib/components-index'; // 🔴 pollutes the root bundle for ALL routes

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="bg-slate-950 text-slate-100">
        {/* the analytics engine is parsed on every single route */}
        <div className="hidden"><AnalyticsChart /></div>
        {children}
      </body>
    </html>
  );
}`}</CodeBlock>

      <H3>🟢 Production pattern — isolated route hierarchy with a Suspense boundary</H3>

      <CodeBlock filename="app/page.tsx">{`// 🟢 CLEAN ROUTE 1: the home route segment
import Link from 'next/link';

export default function HomePage() {
  return (
    <main className="p-8 max-w-xl mx-auto space-y-6">
      <h1 className="text-3xl font-bold">Welcome to Dashboard Portal</h1>
      <p className="text-slate-400 text-sm">
        This route segment bundle is ultra-lean (~10 KB). No heavy chart code is loaded here.
      </p>

      <div className="flex gap-4">
        {/* Next.js prefetches the /analytics chunk when this link enters the viewport */}
        <Link
          href="/analytics"
          className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 rounded-lg text-sm font-medium transition-colors"
        >
          Go to Analytics
        </Link>
      </div>
    </main>
  );
}`}</CodeBlock>

      <CodeBlock filename="app/analytics/loading.tsx">{`// 🟢 CLEAN ROUTE 2: the route-level loading skeleton
export default function AnalyticsLoading() {
  return (
    <div className="p-8 max-w-4xl mx-auto space-y-4 animate-pulse">
      <div className="h-8 w-48 bg-slate-800 rounded" />
      <div className="h-64 w-full bg-slate-900 border border-slate-800 rounded-xl" />
    </div>
  );
}`}</CodeBlock>

      <CodeBlock filename="app/analytics/page.tsx">{`// 🟢 CLEAN ROUTE 2: the heavy route segment, isolated in its own chunk
import React from 'react';

// Heavy dependencies stay strictly scoped inside this route page
export default async function AnalyticsPage() {
  return (
    <div className="p-8 max-w-4xl mx-auto space-y-6">
      <h1 className="text-2xl font-bold">Analytics & Metrics</h1>
      <div className="p-6 bg-slate-900 border border-slate-800 rounded-xl">
        <p className="text-emerald-400 font-mono text-sm">
          ⚡ The heavy chart chunk was downloaded dynamically ONLY for this route.
        </p>
      </div>
    </div>
  );
}`}</CodeBlock>

      {/* ── Matrix ────────────────────────────────────────────────────── */}
      <H2 id="matrix">৪. Route Splitting Architecture Matrix</H2>

      <Table
        head={["বৈশিষ্ট্য", "Traditional SPA route", "Next.js 15 App Router"]}
        rows={[
          [
            "Initial bundle size",
            "বিশাল 🔴 (সব রুটের কোড একসাথে)",
            "মিনিমাল 🟢 (শুধু কারেন্ট রুট + শেয়ার্ড শেল)",
          ],
          [
            "Route JS isolation",
            <span key="c">
              ম্যানুয়াল <code>React.lazy</code> কনফিগারেশন দরকার
            </span>,
            "১০০% স্বয়ংক্রিয় (out of the box)",
          ],
          [
            "Prefetching strategy",
            "কাস্টম সার্ভিস ওয়ার্কার দরকার",
            <span key="c">
              ভিউপোর্টে <code>&lt;Link&gt;</code> প্রি-ফেচিং ⚡
            </span>,
          ],
          [
            "Layout contamination risk",
            "উচ্চ (রুটগুলো গ্লোবাল মডিউল শেয়ার করলে)",
            "নিম্ন (লেআউটে পেজ-স্পেসিফিক ফাইল না থাকলে)",
          ],
        ]}
      />

      <Line name="ভুলু ভাই">
        আরে দারুণ তো! তারমানে সেন্ট্রাল <code>index.ts</code> ফাইল থেকে সব ইমপোর্ট করাই ছিল আমার ভুল!
        এখন থেকে প্রতিটি রুটের ফাইল আইসোলেটেড রাখব, আর Next.js নিজে থেকেই প্রতিটি রুটের কোড স্প্লিট
        করে হালকা চ্যাঙ্ক বানিয়ে দেবে।
      </Line>

      {/* ── Takeaways ─────────────────────────────────────────────────── */}
      <H2 id="takeaway">Production Takeaways</H2>

      <Note>
        <ul>
          <li>
            <strong>Avoid central re-export files for routes:</strong> কোনো একক <code>index.ts</code>{" "}
            ফাইল থেকে একাধিক পেজ বা ভারী কম্পোনেন্ট একত্রে ইমপোর্ট/এক্সপোর্ট করবেন না — এতে Tree
            Shaking এবং Route Splitting দুটোই ভেঙে যায়।
          </li>
          <li>
            <strong>Keep root layouts ultra-lean:</strong> <code>app/layout.tsx</code>-এ কোনো
            পেজ-স্পেসিফিক বা ভারী থার্ড-পার্টি উইজেট ইমপোর্ট করবেন না; গ্লোবাল লেআউটে শুধু সবার জন্য
            প্রয়োজনীয় থিম বা auth provider রাখুন।
          </li>
          <li>
            <strong>Leverage &lt;Link&gt; prefetching:</strong> পেজ ট্রানজিশন ফাস্ট রাখতে Next.js-এর
            অন্তর্নির্মিত <code>&lt;Link&gt;</code> কম্পোনেন্ট ব্যবহার করুন, যা ব্যাকগ্রাউন্ডে নির্দিষ্ট
            রুটের স্প্লিট চ্যাঙ্ক ডাউনলোড করে প্রস্তুত রাখে।
          </li>
        </ul>
      </Note>
    </article>
  );
}
