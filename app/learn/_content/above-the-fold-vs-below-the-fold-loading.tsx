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
    label: { bn: "LCP ৪.২ সেকেন্ড", en: "A 4.2s LCP" },
  },
  {
    id: "architecture",
    label: {
      bn: "ATF বনাম BTF এক্সিকিউশন পাইপলাইন",
      en: "ATF vs BTF execution pipeline",
    },
  },
  {
    id: "mechanisms",
    label: { bn: "৩টি মূল কৌশল", en: "Three core techniques" },
  },
  {
    id: "implementation",
    label: {
      bn: "Priority asset ও deferred hydration",
      en: "Priority assets & deferred hydration",
    },
  },
  {
    id: "matrix",
    label: { bn: "ATF vs BTF Strategy Matrix", en: "ATF vs BTF strategy matrix" },
  },
  {
    id: "takeaway",
    label: { bn: "Production Takeaways", en: "Production takeaways" },
  },
];

export default function AboveTheFoldVsBelowTheFoldLoading() {
  return (
    <article className="doc-prose">
      {/* ── The problem ───────────────────────────────────────────────── */}
      <H2 id="the-problem" anchorOnly>
        LCP ৪.২ সেকেন্ড
      </H2>

      <p>
        দুপুর ১:৪৫। ভুলু ভাই একটি ই-কমার্স ল্যান্ডিং পেজ তৈরি করেছেন — হিরো ব্যানার, প্রোডাক্টের
        বিস্তারিত বিবরণ, ইউজার রিভিউ, র‍্যাঙ্কিং চার্ট এবং ফুটার। কিন্তু Lighthouse রান করার পর দেখা
        গেল LCP (Largest Contentful Paint) স্কোর আসছে ৪.২ সেকেন্ড।
      </p>

      <Line name="ভুলু ভাই">
        ফাহিম! ইউজার তো পেজে ঢুকেই উপরের হিরো সেকশনটা দেখে। কিন্তু পেজ লোড হতে এত সময় লাগছে কেন?
        স্ক্রিন ওপেন হতেই কেন ইউজার ৩-৪ সেকেন্ড সাদা ডিসপ্লে দেখে বসে থাকবে?
      </Line>

      <Line name="ফাহিম">
        ভুলু ভাই! কারণ আপনার পেজে প্রথম দৃশ্যমান হিরো সেকশন (above the fold) এবং স্ক্রল না করা পর্যন্ত
        অদৃশ্য থাকা রিভিউ, চার্ট ও ফুটার সেকশন (below the fold) — সবকিছুই একসাথে প্রথম চ্যাঙ্কেই
        ডাউনলোড ও হাইড্রেট হচ্ছে! নিচের অপ্রয়োজনীয় ভারী UI এলিমেন্টগুলো উপরের ক্রিটিক্যাল এলিমেন্টের
        লোডিংকে ব্লক করে রাখছে।
      </Line>

      <Line name="নেক্সট-ভাই">
        একদম! পারফরম্যান্ট অ্যাপ্লিকেশনের মূল সূত্র — above-the-fold কনটেন্টকে সর্বোচ্চ অগ্রাধিকার দিয়ে
        সবচেয়ে দ্রুত রেন্ডার করা, আর below-the-fold কনটেন্টকে ইউজার স্ক্রল করার আগ পর্যন্ত স্থগিত
        রাখা।
      </Line>

      {/* ── Architecture ──────────────────────────────────────────────── */}
      <H2 id="architecture">১. Above-the-Fold vs. Below-the-Fold Execution Pipeline</H2>

      <Diagram>{`┌─────────────────────────────────────────────────────────────────────────┐
│       ABOVE-THE-FOLD (ATF) VS. BELOW-THE-FOLD (BTF) PIPELINE            │
└─────────────────────────────────────────────────────────────────────────┘

 📺 VIEWPORT BOUNDARY (above the fold: the critical initial viewport)
 ┌───────────────────────────────────────────────────────────────────────┐
 │  [ navigation bar & brand logo ]                                      │
 │  [ hero banner image (priority) ]  ──► 🟢 instant LCP render          │
 │  [ main headline & CTA button ]                                       │
 └───────────────────────────────────────────────────────────────────────┘
                                   ▼
 📜 SCROLL BOUNDARY (Intersection Observer / dynamic boundary)
                                   ▼
 👇 HIDDEN INITIALLY (below the fold: non-critical deferred UI)
 ┌───────────────────────────────────────────────────────────────────────┐
 │  [ customer reviews carousel ]   ──► ⏳ lazy loaded via next/dynamic  │
 │  [ interactive analytics chart ] ──► ⏳ hydrated on scroll            │
 │  [ complex footer ]                                                   │
 └───────────────────────────────────────────────────────────────────────┘
                                   ▼
              🟢 REDUCED TBT & LIGHTNING-FAST INITIAL LCP`}</Diagram>

      {/* ── Mechanisms ────────────────────────────────────────────────── */}
      <H2 id="mechanisms">২. ATF Priority ও BTF Lazy Loading-এর ৩টি মূল কৌশল</H2>

      <p>
        <strong>ATF asset prioritization:</strong> ভিউকে প্রথম ফ্রেমেই ফুটিয়ে তুলতে above-the-fold-এর
        প্রধান ইমেজগুলোকে <code>&lt;Image priority /&gt;</code> দিয়ে ট্যাগ করতে হয়, যেন ব্রাউজার
        ইমপ্লিসিটলি <code>fetchpriority=&quot;high&quot;</code> দিয়ে রিসোর্সটি দ্রুত টেনে আনে।
      </p>

      <p>
        <strong>Below-the-fold viewport-based lazy loading:</strong> পেজের নিচের দিকে থাকা ভারী
        উইজেটগুলোকে (লাইভ ম্যাপ, হেভি কমেন্ট বক্স, ইন্টার‌অ্যাক্টিভ চার্ট) <code>next/dynamic</code> বা{" "}
        <code>IntersectionObserver</code>-এর মাধ্যমে ভিউপোর্টে আসা মাত্র লোড করা।
      </p>

      <p>
        <strong>Fixed layout boundaries (CLS prevention):</strong> below-the-fold কম্পোনেন্টগুলো লোড
        হওয়ার সময় পেজের লেআউট যেন লাফিয়ে না ওঠে, সেজন্য স্কেলিটন বাউন্ডারি তৈরি করে নির্দিষ্ট ফিক্সড
        হাইট বজায় রাখা।
      </p>

      {/* ── Implementation ────────────────────────────────────────────── */}
      <H2 id="implementation">৩. Production Code Implementation</H2>

      <H3>❌ Anti-pattern — every section loaded synchronously</H3>

      <CodeBlock filename="app/landing/legacy-page.tsx">{`// 🔴 POOR PRACTICE: heavy below-the-fold charts block the initial critical path
'use client';

import Image from 'next/image';
import HeavyAnalyticsChart from '@/components/HeavyAnalyticsChart'; // 🔴 300 KB JS
import HeavyCustomerReviews from '@/components/HeavyCustomerReviews'; // 🔴 150 KB JS

export function UnoptimizedLandingPage() {
  return (
    <div>
      {/* above the fold */}
      <section className="h-screen bg-slate-950 p-8">
        <h1>Welcome to the Next.js Platform</h1>
        {/* 🔴 missing priority — delays LCP */}
        <Image src="/hero-banner.jpg" width={1200} height={600} alt="Hero banner" />
      </section>

      {/* below the fold */}
      <section className="p-8">
        {/* 🔴 loaded synchronously on initial page load, slowing the first paint */}
        <HeavyAnalyticsChart />
        <HeavyCustomerReviews />
      </section>
    </div>
  );
}`}</CodeBlock>

      <H3>🟢 Production pattern — prioritized ATF, deferred BTF hydration</H3>

      <CodeBlock filename="app/landing/page.tsx">{`// 🟢 PRODUCTION PATTERN: ATF asset priority + viewport-triggered BTF lazy loading
'use client';

import Image from 'next/image';
import dynamic from 'next/dynamic';
import { useState, useEffect, useRef } from 'react';

// 🟢 STEP 1: below-the-fold heavy components are imported dynamically
const HeavyAnalyticsChart = dynamic(
  () => import('@/components/HeavyAnalyticsChart'),
  {
    loading: () => (
      <div className="h-[400px] w-full bg-slate-900 animate-pulse rounded-xl flex items-center justify-center text-slate-500 text-sm">
        ⏳ Hydrating the analytics engine...
      </div>
    ),
  },
);

export default function OptimizedLandingPage() {
  const [showBTFContent, setShowBTFContent] = useState(false);
  const btfRef = useRef<HTMLDivElement | null>(null);

  // 🟢 STEP 2: the observer triggers the BTF download only when the user scrolls near
  useEffect(() => {
    const node = btfRef.current;
    if (!node) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setShowBTFContent(true);
          observer.disconnect(); // stop observing once it has fired
        }
      },
      { rootMargin: '200px' }, // pre-trigger 200px before the section is reached
    );

    observer.observe(node);

    return () => observer.disconnect();
  }, []);

  return (
    <div className="bg-slate-950 text-slate-100 min-h-screen">
      {/* 🟢 ABOVE THE FOLD: instant server render and a priority asset */}
      <section className="min-h-screen p-8 max-w-5xl mx-auto flex flex-col justify-center space-y-6">
        <div className="space-y-2">
          <span className="text-xs font-mono px-3 py-1 bg-indigo-950 text-indigo-400 rounded-full border border-indigo-800">
            OPTIMIZED ATF PATH
          </span>
          <h1 className="text-4xl font-extrabold tracking-tight">Ultra-fast First Contentful Paint</h1>
          <p className="text-slate-400">Critical resources are prioritized for zero initial latency.</p>
        </div>

        {/* 🟢 priority forces a high-priority fetch and prevents LCP delays */}
        <div className="relative h-[350px] w-full rounded-2xl overflow-hidden border border-slate-800">
          <Image
            src="/hero-banner.jpg"
            alt="Optimized hero visual"
            fill
            priority
            sizes="(max-width: 1200px) 100vw, 1200px"
            className="object-cover"
          />
        </div>
      </section>

      {/* 🟢 BELOW THE FOLD: a deferred Intersection Observer boundary */}
      <section ref={btfRef} className="p-8 max-w-5xl mx-auto space-y-8 border-t border-slate-900">
        <h2 className="text-2xl font-bold">Performance Metrics & Insights</h2>

        {/* render the chart ONLY once it is scrolled into view */}
        {showBTFContent ? (
          <HeavyAnalyticsChart />
        ) : (
          <div className="h-[400px] w-full bg-slate-900/50 border border-dashed border-slate-800 rounded-xl flex items-center justify-center text-slate-600 text-sm">
            📜 Scroll down to load the analytics module...
          </div>
        )}
      </section>
    </div>
  );
}`}</CodeBlock>

      {/* ── Matrix ────────────────────────────────────────────────────── */}
      <H2 id="matrix">৪. Above-the-fold vs. Below-the-fold Strategy Matrix</H2>

      <Table
        head={["স্ট্র্যাটেজি ক্যাটাগরি", "Above the fold (ATF)", "Below the fold (BTF)"]}
        rows={[
          [
            "ইমেজ লোডিং",
            <span key="c">
              <code>priority</code> + <code>fetchpriority=&quot;high&quot;</code>
            </span>,
            <span key="d">
              <code>loading=&quot;lazy&quot;</code> (ডিফল্ট)
            </span>,
          ],
          [
            "কম্পোনেন্ট লোডিং",
            "সরাসরি server component / immediate hydration",
            <span key="d">
              <code>next/dynamic</code> + viewport intersection
            </span>,
          ],
          [
            "CSS ও ফন্ট প্রসেসিং",
            "critical font preload + essential CSS inline",
            "non-critical stylesheet defer",
          ],
          ["মেট্রিকে প্রভাব", "LCP ও FCP সরাসরি উন্নত করে ⚡", "TBT ও TTI উন্নত করে ⚡"],
        ]}
      />

      <Line name="ভুলু ভাই">
        মারাত্মক টেকনিক! হিরো ছবিতে <code>priority</code> দেওয়াতে LCP নিমেষেই ১.১ সেকেন্ডে নেমে এসেছে!
        আর নিচের চার্ট ও কমেন্ট সেকশন স্ক্রলের পর লোড হওয়ায় ফার্স্ট পেজ চ্যাঙ্ক সাইজ অর্ধেক হয়ে গেছে।
      </Line>

      {/* ── Takeaways ─────────────────────────────────────────────────── */}
      <H2 id="takeaway">Production Takeaways</H2>

      <Note>
        <ul>
          <li>
            <strong>Always set priority on hero images:</strong> ভিউপোর্টের প্রধান ব্যানার বা LCP
            ইমেজে অবশ্যই <code>priority</code> প্রপার্টি ব্যবহার করুন — Next.js ইমেজটিকে ব্রাউজারের
            হাই-প্রায়োরিটি কিউতে পাঠিয়ে দেয়।
          </li>
          <li>
            <strong>Defer heavy widgets below the scroll boundary:</strong> রিভিউ সেকশন, কমেন্ট ট্রি,
            সোশ্যাল শেয়ার বা চার্টের মতো উইজেটগুলোকে <code>IntersectionObserver</code> দিয়ে ভিউপোর্টে
            আসা পর্যন্ত স্থগিত রাখুন।
          </li>
          <li>
            <strong>Reserve height boundaries:</strong> below-the-fold কনটেন্ট ডাইনামিকালি লোড হওয়ার
            সময় লেআউট যেন বদলে না যায়, সেজন্য সবসময় ফিক্সড হাইটের skeleton container ব্যবহার করুন।
          </li>
        </ul>
      </Note>
    </article>
  );
}
