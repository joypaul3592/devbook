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
      bn: "PageSpeed স্কোর ৩৮ / ১০০",
      en: "A PageSpeed score of 38",
    },
  },
  {
    id: "architecture",
    label: { bn: "Optimization ফ্লো", en: "Optimisation flow" },
  },
  {
    id: "metrics",
    label: { bn: "৩টি Core Web Vitals মেট্রিক", en: "The three metrics" },
  },
  {
    id: "implementation",
    label: { bn: "Anti-pattern ও অপটিমাইজড রুট", en: "Anti-pattern vs optimised route" },
  },
  {
    id: "matrix",
    label: { bn: "Optimization Matrix", en: "Optimisation matrix" },
  },
  {
    id: "takeaway",
    label: { bn: "Production Takeaways", en: "Production takeaways" },
  },
];

export default function PerformanceAuditingCoreWebVitals() {
  return (
    <article className="doc-prose">
      {/* ── The problem ───────────────────────────────────────────────── */}
      <H2 id="the-problem" anchorOnly>
        PageSpeed স্কোর ৩৮ / ১০০
      </H2>

      <p>
        রাত ১২:১৫। ভুলু ভাই Google PageSpeed Insights-এ নতুন ড্যাশবোর্ড ও ল্যান্ডিং পেজের URL দিয়ে
        রান করতেই লাল স্কোর — <strong>38 / 100</strong>! মোবাইলে LCP 4.8s, CLS 0.35, আর ড্রপডাউন
        বা বাটনে ক্লিকে রেসপন্স দেরি হওয়ায় INP 350ms। সার্চ কনসোলে রেড ওয়ার্নিং:{" "}
        <em>Core Web Vitals Failed</em>।
      </p>

      <Line name="ভুলু ভাই">
        ফাহিম! App Router আর Server Component তো ব্যবহার করলাম, তাও পারফরম্যান্স স্কোর লাল বাতি
        জ্বালাচ্ছে কেন?
      </Line>

      <Line name="ফাহিম">
        ভুলু ভাই! শুধু Server Component ব্যবহার করলেই পেজ অপটিমাইজড হয়ে যায় না। হিরো ইমেজ
        অপটিমাইজ না করা, ফন্ট রেন্ডারিংয়ে লেআউট শিফট, আর ক্লায়েন্ট বান্ডলে main thread ব্লক হয়ে
        থাকার কারণেই LCP, CLS আর INP রেড জোনে চলে গেছে!
      </Line>

      <Line name="নেক্সট-ভাই">
        মূল কৌশল তিনটি — LCP-র জন্য <code>next/image</code>-এ <code>priority</code> ও স্ট্রিমিং,
        CLS-র জন্য <code>next/font</code> ও নির্দিষ্ট মাপের স্কেলিটন, আর INP-র জন্য ভারী JS কমিয়ে
        main thread ফ্রি রাখা।
      </Line>

      {/* ── Architecture ──────────────────────────────────────────────── */}
      <H2 id="architecture">১. Core Web Vitals Optimization Flow</H2>

      <Diagram>{`┌─────────────────────────────────────────────────────────────────────────┐
│                  CORE WEB VITALS OPTIMIZATION FLOW                      │
└─────────────────────────────────────────────────────────────────────────┘

 AUDIT ISSUES (unoptimised route):
 • Unoptimised, unsized hero image  ──▶ High LCP (>4.0s)
 • Dynamic content / font injection ──▶ High CLS (>0.25)
 • Main-thread hydration blockage   ──▶ High INP (>300ms)

 -------------------------------------------------------------------------

 RSC & NEXT.JS OPTIMISED ROUTE:
 • <Image priority sizes="..." />       ──▶ Low LCP (<1.5s)
 • next/font + aspect-sized skeletons   ──▶ Near-zero CLS
 • Zero-JS RSC + light hydration        ──▶ Low INP (<50ms)`}</Diagram>

      {/* ── Metrics ───────────────────────────────────────────────────── */}
      <H2 id="metrics">২. ৩টি Core Web Vitals মেট্রিক</H2>

      <H3>LCP — Largest Contentful Paint (লক্ষ্য &lt; ২.৫s)</H3>
      <p>
        পেজের সবচেয়ে বড় দৃশ্যমান এলিমেন্ট (hero image বা H1 banner) স্ক্রিনে আসতে কত সময় লাগছে।
        সমস্যা সাধারণত প্লেইন <code>&lt;img&gt;</code> বা CSS ব্যাকগ্রাউন্ড দিয়ে স্লো ইমেজ লোড।
        সমাধান — <code>next/image</code>-এ <code>priority</code> প্রপ।
      </p>

      <H3>CLS — Cumulative Layout Shift (লক্ষ্য &lt; ০.১)</H3>
      <p>
        লোড হওয়ার সময় হুট করে টেক্সট বা বাটন সরে যাচ্ছে কি না। কারণ — ইমেজের নির্দিষ্ট
        width/height না থাকা, ফন্ট লোডে দেরি (FOUT), বা ডাইনামিক কনটেন্ট এসে লেআউট ধাক্কা দেওয়া।
        সমাধান — <code>next/font</code> ও নির্দিষ্ট ডাইমেনশনের স্কেলিটন।
      </p>

      <H3>INP — Interaction to Next Paint (লক্ষ্য &lt; ২০০ms)</H3>
      <p>
        ক্লিক বা ইনপুটের পর ব্রাউজার কত দ্রুত পরের ফ্রেম আঁকতে পারছে। কারণ — বিশাল JS parse/execute
        করতে গিয়ে main thread ব্লক হয়ে থাকা। সমাধান — Server Component দিয়ে বান্ডল সাইজ কমানো ও
        ভারী ক্লায়েন্ট স্টেট অপটিমাইজ করা।
      </p>

      {/* ── Implementation ────────────────────────────────────────────── */}
      <H2 id="implementation">৩. Anti-pattern ও অপটিমাইজড রুট</H2>

      <H3>❌ Anti-pattern — তিনটি মেট্রিকই ফেল</H3>

      <CodeBlock filename="app/landing/page.tsx">{`'use client';

import { useState, useEffect } from 'react';

export default function BadLandingPage() {
  const [data, setData] = useState<{ title: string } | null>(null);

  useEffect(() => {
    fetch('/api/hero-banner')
      .then((res) => res.json())
      .then(setData);
  }, []);

  return (
    <div>
      {/* CLS: an external font stylesheet injected at render time shifts the layout */}
      <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Inter" />

      {/* LCP: a plain <img> with no priority, sizing or optimisation */}
      <img src="/hero-banner.jpg" alt="Hero" className="w-full" />

      {/* CLS + INP: content pops in after the client fetch resolves */}
      {data && <div>{data.title}</div>}
    </div>
  );
}`}</CodeBlock>

      <H3>🟢 Fix — font, image ও skeleton অপটিমাইজেশন</H3>

      <CodeBlock filename="app/layout.tsx">{`import { Inter } from 'next/font/google';

// next/font self-hosts the font files and eliminates layout shift
const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
});

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={inter.variable}>
      <body className="font-sans bg-slate-950 text-slate-100 antialiased">
        {children}
      </body>
    </html>
  );
}`}</CodeBlock>

      <CodeBlock filename="app/landing/page.tsx">{`import Image from 'next/image';
import { Suspense } from 'react';

// 1. Hero optimised for LCP
function HeroSection() {
  return (
    <div className="relative w-full h-[400px] rounded-2xl overflow-hidden border border-slate-800">
      <Image
        src="/hero-banner.jpg"
        alt="Production hero banner"
        fill
        priority // preloads the image from the HTML head — fixes LCP
        sizes="(max-width: 768px) 100vw, 1200px"
        className="object-cover"
        quality={85}
      />
      <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent p-8 flex flex-col justify-end">
        <h1 className="text-3xl font-extrabold text-white">
          Next-Gen Analytics Platform
        </h1>
      </div>
    </div>
  );
}

// 2. Zero-CLS skeleton — matches the streamed content's height exactly
function DynamicDataSkeleton() {
  return (
    <div className="h-32 bg-slate-900 border border-slate-800 rounded-xl animate-pulse p-4 space-y-3">
      <div className="h-5 w-1/3 bg-slate-800 rounded" />
      <div className="h-4 w-2/3 bg-slate-800 rounded" />
    </div>
  );
}

async function StreamedStats() {
  await new Promise((res) => setTimeout(res, 1500)); // simulated API delay

  return (
    <div className="h-32 bg-slate-900 border border-slate-800 p-6 rounded-xl flex items-center justify-between">
      <div>
        <p className="text-xs text-slate-400">Total active revenue</p>
        <p className="text-2xl font-bold text-emerald-400">$4,850,000.00</p>
      </div>
      <span className="text-xs bg-emerald-500/10 text-emerald-400 px-3 py-1.5 rounded-lg border border-emerald-500/20">
        Live updated
      </span>
    </div>
  );
}

export default function OptimizedLandingPage() {
  return (
    <main className="max-w-4xl mx-auto py-10 px-6 space-y-8">
      {/* LCP-optimised hero */}
      <HeroSection />

      {/* 3. CLS- and INP-protected streaming region */}
      <Suspense fallback={<DynamicDataSkeleton />}>
        <StreamedStats />
      </Suspense>
    </main>
  );
}`}</CodeBlock>

      {/* ── Matrix ────────────────────────────────────────────────────── */}
      <H2 id="matrix">৪. Core Web Vitals Optimization Matrix</H2>

      <Table
        head={["মেট্রিক", "লক্ষ্য", "মূল কারণ", "Next.js সমাধান"]}
        rows={[
          [
            "LCP",
            "< ২.৫s",
            "unsized, un-prioritised hero image; blocking JS",
            <>
              <code>&lt;Image fill priority sizes&gt;</code> ও streaming SSR
            </>,
          ],
          [
            "CLS",
            "< ০.১",
            "fixed height ছাড়া কনটেন্ট pop-in, web font swap",
            <>
              <code>next/font</code> ও fixed-height skeleton
            </>,
          ],
          [
            "INP",
            "< ২০০ms",
            "ভারী JS parsing, hydration main thread ব্লক করা",
            <>
              Server Components ও <code>useTransition</code>
            </>,
          ],
        ]}
      />

      <Line name="ভুলু ভাই">
        আহা শান্তি! <code>next/image</code>-এ <code>priority</code> দিয়ে,{" "}
        <code>next/font</code> বসিয়ে আর পারফেক্ট সাইজের স্কেলিটন দিতেই PageSpeed স্কোর ৩৮ থেকে
        লাফিয়ে ৯৮-এ! LCP, CLS আর INP তিনটাই এখন সবুজ।
      </Line>

      {/* ── Takeaways ─────────────────────────────────────────────────── */}
      <H2 id="takeaway">Production Takeaways</H2>

      <Note>
        <ul>
          <li>
            <strong>priority on above-the-fold images:</strong> স্ক্রিনে প্রথম যে ইমেজটি দেখা যায়
            (hero banner, logo), তাতে অবশ্যই <code>next/image</code>-এর <code>priority</code> প্রপ
            দিন।
          </li>
          <li>
            <strong>Zero-CLS with next/font:</strong> কখনো ম্যানুয়াল <code>&lt;link&gt;</code> বা
            CSS <code>@import</code> দিয়ে ফন্ট লোড করবেন না — <code>next/font</code> ফন্ট
            সেল্ফ-হোস্ট করে লেআউট শিফট শূন্যে নামায়।
          </li>
          <li>
            <strong>Match skeleton dimensions:</strong> <code>Suspense</code> fallback-এর স্কেলিটনের
            height/width আসল কম্পোনেন্টের সমান রাখুন — এটিই CLS শূন্যে নামানোর সবচেয়ে সহজ উপায়।
          </li>
        </ul>
      </Note>
    </article>
  );
}
