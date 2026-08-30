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
      bn: "Below-the-fold চার্টের ২ MB",
      en: "2 MB for a below-the-fold chart",
    },
  },
  {
    id: "architecture",
    label: {
      bn: "Immediate import বনাম scroll-based",
      en: "Immediate import vs scroll-based",
    },
  },
  {
    id: "mechanisms",
    label: { bn: "৩টি মূল মেকানিজম", en: "Three core mechanisms" },
  },
  {
    id: "implementation",
    label: {
      bn: "Intersection Observer wrapper",
      en: "The Intersection Observer wrapper",
    },
  },
  {
    id: "matrix",
    label: {
      bn: "Lazy Loading Trigger Strategy",
      en: "Lazy loading trigger strategy",
    },
  },
  {
    id: "takeaway",
    label: { bn: "Production Takeaways", en: "Production takeaways" },
  },
];

export default function LazyLoadingStrategy() {
  return (
    <article className="doc-prose">
      {/* ── The problem ───────────────────────────────────────────────── */}
      <H2 id="the-problem" anchorOnly>
        Below-the-fold চার্টের ২ MB
      </H2>

      <p>
        দুপুর ১২:১৫। ভুলু ভাই তার নিউজ অ্যান্ড অ্যানালিটিক্স পোর্টালের হোমপেজ টেস্ট করছেন। পেজের
        সবচেয়ে ওপরে সিম্পল টেক্সট আর্টিকেলের লিস্ট, আর একদম নিচে (below the fold) স্ক্রল করলে ২
        মেগাবাইটের একটি ইন্টার‌অ্যাক্টিভ ট্রেডিং চার্ট ও কমেন্ট সেকশন। কিন্তু Lighthouse রিপোর্টে
        Performance Score মাত্র ৪৫।
      </p>

      <Line name="ভুলু ভাই">
        ফাহিম! পেজ লোড হওয়ার সাথে সাথে ইউজার তো স্ক্রিনের নিচের ট্রেডিং চার্ট বা কমেন্ট সেকশন দেখতেই
        পাচ্ছে না। কিন্তু কেন নেটওয়ার্ক ট্যাব পেজ খোলার প্রথম সেকেন্ডেই নিচের ২ মেগাবাইটের চার্ট এবং
        হেভি কমেন্ট উইজেটের চ্যাঙ্ক লোড করে FCP ঝুলিয়ে রাখছে?
      </Line>

      <Line name="ফাহিম">
        ভুলু ভাই! কারণ আপনি বাটন ক্লিক বা স্টেট পরিবর্তন ছাড়াই টপ-লেভেলে শর্তহীনভাবে ডাইনামিক ইমপোর্ট
        লিখে রেখেছেন! পেজ মাউন্ট হওয়ার সাথে সাথে Next.js সব চ্যাঙ্ক একসাথে চাওয়া শুরু করে। এর আসল
        সমাধান হলো Scroll-based Dynamic Lazy Loading।
      </Line>

      <Line name="নেক্সট-ভাই">
        একদম! Intersection Observer API ব্যবহার করে এমন একটি স্মার্ট বাউন্ডারি তৈরি করা যায়, যেখানে
        নিচে থাকা ভারী কম্পোনেন্টটির চ্যাঙ্ক নেটওয়ার্কে রিকোয়েস্টই পাঠাবে না যতক্ষণ না ইউজার স্ক্রল
        করে ওই সেকশনের ৩০০-৪০০ পিক্সেল কাছাকাছি চলে আসছে। এতে ইনিশিয়াল জাভাস্ক্রিপ্ট পেলোড ৮০% পর্যন্ত
        কমে যায়।
      </Line>

      {/* ── Architecture ──────────────────────────────────────────────── */}
      <H2 id="architecture">
        ১. Immediate Dynamic Import vs. Intersection Observer Pipeline
      </H2>

      <Diagram>{`┌─────────────────────────────────────────────────────────────────────────┐
│        IMMEDIATE LOAD VS. SCROLL-BASED INTERSECTION OBSERVER            │
└─────────────────────────────────────────────────────────────────────────┘

 ❌ IMMEDIATE DYNAMIC IMPORT (fetches code even if never scrolled to)
 Page load starts
 ┌───────────────────────────────────────────────────────────────────────┐
 │ fetch /page.js (shell)                                                │
 │ fetch /trading-chart.js (2 MB — below the fold) ──► 🔴 wasted bandwidth│
 └──────────────────────────────────┬────────────────────────────────────┘
                                    │ blocks main-thread execution
                                    ▼
                     🔴 SLOW FCP / LCP & POOR LIGHTHOUSE SCORE

───────────────────────────────────────────────────────────────────────────

 🟢 SCROLL-BASED INTERSECTION OBSERVER LAZY LOADING
 Page load starts
 ┌───────────────────────────────────────────────────────────────────────┐
 │ fetch /page.js ONLY (lean shell — 15 KB)                              │
 └──────────────────────────────────┬────────────────────────────────────┘
                                    │ user scrolls down the page
                                    ▼
              Intersection Observer triggers (rootMargin: "300px")
                                    │
                                    ▼
 ┌───────────────────────────────────────────────────────────────────────┐
 │ fetch /trading-chart.js on demand                                     │
 └───────────────────────────────────────────────────────────────────────┘
                                    ▼
                     🟢 HIGH LIGHTHOUSE SCORE & LEAN INITIAL BUNDLE`}</Diagram>

      {/* ── Mechanisms ────────────────────────────────────────────────── */}
      <H2 id="mechanisms">২. Scroll-based Lazy Loading-এর ৩টি মূল মেকানিজম</H2>

      <p>
        <strong>Intersection Observer API boundary:</strong> ব্রাউজারের এই নেটিভ ফিচারটি নির্দেশ করে
        একটি DOM এলিমেন্ট স্ক্রিনের ভিউপোর্টে প্রবেশ করছে নাকি বের হয়ে যাচ্ছে — কোনো স্ক্রল ইভেন্ট
        লিসেনার বা layout thrashing ছাড়াই।
      </p>

      <p>
        <strong>rootMargin threshold buffer:</strong> ইউজার কোনো সেকশনে পৌঁছানোর আগেই চ্যাঙ্ক লোড
        সম্পন্ন করতে <code>rootMargin: &quot;300px&quot;</code> দেওয়া হয়। এতে ইউজার স্ক্রল করে ওই
        এলিমেন্টে পৌঁছানোর ৩০০ পিক্সেল আগেই ব্যাকগ্রাউন্ডে নেটওয়ার্ক রিকোয়েস্ট ফায়ার হয়ে যায়।
      </p>

      <p>
        <strong>Skeleton layout anchor:</strong> কম্পোনেন্টটি লোড হওয়ার আগ পর্যন্ত লেআউট হাইট স্থির
        রাখতে একটি ম্যাচিং স্কেলিটন বা ফলব্যাক প্লেসহোল্ডার ধরে রাখতে হয়, যাতে লোড হওয়ার পর পেজে কোনো
        Cumulative Layout Shift (CLS) না ঘটে।
      </p>

      {/* ── Implementation ────────────────────────────────────────────── */}
      <H2 id="implementation">৩. Production Code Implementation</H2>

      <H3>❌ Anti-pattern — eager dynamic import for below-the-fold content</H3>

      <CodeBlock filename="app/market/eager-page.tsx">{`// 🔴 POOR PRACTICE: triggers an immediate network request for below-the-fold code
'use client';

import dynamic from 'next/dynamic';

// 🔴 anti-pattern: a dynamic import with no scroll trigger downloads on page load anyway
const HeavyTradingChart = dynamic(
  () => import('@/components/HeavyTradingChart'),
  {
    loading: () => <p>Loading chart...</p>,
    ssr: false,
  },
);

export function EagerPage() {
  return (
    <div className="p-8 space-y-96">
      <h1 className="text-xl">Top Article Content</h1>

      {/* 🔴 below the fold, but its 2 MB of JS is fetched in the first second */}
      <div>
        <HeavyTradingChart />
      </div>
    </div>
  );
}`}</CodeBlock>

      <H3>🟢 Production pattern — a reusable Intersection Observer wrapper</H3>

      <CodeBlock filename="components/LazyScrollContainer.tsx">{`'use client';

import React, { useState, useEffect, useRef } from 'react';

interface LazyScrollContainerProps {
  children: React.ReactNode;
  fallback: React.ReactNode;
  rootMargin?: string;
}

export function LazyScrollContainer({
  children,
  fallback,
  rootMargin = '300px', // 🟢 starts loading 300px before the element is reached
}: LazyScrollContainerProps) {
  const [isVisible, setIsVisible] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const node = containerRef.current;
    if (!node) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          // 🟢 unobserve as soon as it fires, so nothing keeps observing a mounted chunk
          observer.unobserve(node);
        }
      },
      { rootMargin, threshold: 0.01 },
    );

    observer.observe(node);

    return () => {
      observer.disconnect();
    };
  }, [rootMargin]);

  return (
    <div ref={containerRef} className="min-h-[250px] w-full">
      {isVisible ? children : fallback}
    </div>
  );
}`}</CodeBlock>

      <CodeBlock filename="components/HeavyTradingChart.tsx">{`'use client';

export default function HeavyTradingChart() {
  return (
    <div className="p-6 bg-slate-900 border border-slate-800 rounded-xl space-y-4">
      <div className="flex justify-between items-center border-b border-slate-800 pb-2">
        <span className="text-sm font-semibold text-emerald-400">📈 Live Crypto Feed</span>
        <span className="text-xs bg-slate-800 text-slate-300 px-2 py-1 rounded">2.1 MB engine</span>
      </div>
      <div className="h-48 bg-slate-950 rounded flex items-center justify-center text-slate-500 text-sm font-mono">
        [ complex canvas chart engine, rendered after scroll ]
      </div>
    </div>
  );
}`}</CodeBlock>

      <CodeBlock filename="app/market/page.tsx">{`'use client';

import dynamic from 'next/dynamic';
import { LazyScrollContainer } from '@/components/LazyScrollContainer';

// 🟢 dynamic import without server-side execution
const HeavyTradingChart = dynamic(() => import('@/components/HeavyTradingChart'), {
  ssr: false,
});

export default function MarketNewsPage() {
  return (
    <div className="p-8 max-w-2xl mx-auto space-y-12 bg-slate-950 text-slate-100 min-h-[1800px]">
      {/* above the fold: lean and immediate */}
      <section className="space-y-4 border-b border-slate-800 pb-8">
        <span className="text-xs font-mono text-indigo-400">ABOVE THE FOLD</span>
        <h1 className="text-3xl font-bold">Today's Market Breakdown</h1>
        <p className="text-slate-400 text-sm leading-relaxed">
          This top section renders in milliseconds. Scroll down to see the trading chart
          load strictly on demand.
        </p>
      </section>

      {/* spacer pushing the content below the fold */}
      <div className="h-96 bg-slate-900/30 border border-dashed border-slate-800 rounded-xl flex items-center justify-center text-slate-600 text-sm">
        ↓ scroll down to trigger chart loading ↓
      </div>

      {/* below the fold, behind an observer guard */}
      <section className="space-y-4">
        <h2 className="text-xl font-semibold text-slate-200">Interactive Analytics</h2>

        {/* 🟢 the wrapper ensures the 2 MB chunk is fetched ONLY when the user scrolls near */}
        <LazyScrollContainer
          rootMargin="200px"
          fallback={
            <div className="h-64 w-full bg-slate-900 border border-slate-800 rounded-xl animate-pulse flex items-center justify-center text-slate-500 text-sm">
              ⏳ Near viewport: fetching the trading chart chunk...
            </div>
          }
        >
          <HeavyTradingChart />
        </LazyScrollContainer>
      </section>
    </div>
  );
}`}</CodeBlock>

      {/* ── Matrix ────────────────────────────────────────────────────── */}
      <H2 id="matrix">৪. Lazy Loading Trigger Strategy Matrix</H2>

      <Table
        head={["লোডিং ট্রিগার", "মেকানিজম", "সেরা ব্যবহারের ক্ষেত্র"]}
        rows={[
          [
            "Immediate dynamic import",
            "পেজ মাউন্টের সাথে সাথে প্রমিস রান",
            "পেজের ওপরের বড় ভিজ্যুয়াল (যেমন hero video)",
          ],
          [
            "User interaction",
            <span key="c">
              <code>onClick</code> / <code>onMouseEnter</code>
            </span>,
            "Modal, drawer, dropdown, custom dialog",
          ],
          [
            "Scroll / Intersection Observer",
            <span key="c">
              ভিউপোর্ট + <code>rootMargin</code>
            </span>,
            "Below-the-fold UI: কমেন্ট, চার্ট, ফুটার উইজেট",
          ],
          [
            "Network idle",
            <code key="c">requestIdleCallback</code>,
            "অ্যানালিটিক্স পিক্সেল, চ্যাট উইজেট বা হিটম্যাপ ট্র্যাকার",
          ],
        ]}
      />

      <Line name="ভুলু ভাই">
        মারাত্মক ট্রিক! Intersection Observer দিয়ে স্ক্রল করার ২০০ পিক্সেল আগে চার্ট লোড করিয়ে দেওয়ার
        পর Lighthouse স্কোর ৪৫ থেকে সোজা ৯৮-এ উঠে গেল! এখন ইনিশিয়াল পেজ লোডে বাড়তি এক কিলোবাইট
        জাভাস্ক্রিপ্টও ডাউনলোড হয় না।
      </Line>

      {/* ── Takeaways ─────────────────────────────────────────────────── */}
      <H2 id="takeaway">Production Takeaways</H2>

      <Note>
        <ul>
          <li>
            <strong>Never load below-the-fold code eagerly:</strong> পেজের স্ক্রিনের নিচে থাকা যেকোনো
            থার্ড-পার্টি ভারী উইজেট বা কম্পোনেন্টকে Intersection Observer-এর পেছনে রাখুন।
          </li>
          <li>
            <strong>Set an optimal rootMargin:</strong> <code>200px</code> থেকে <code>400px</code>{" "}
            পর্যন্ত মার্জিন ব্যবহার করুন — এতে ইউজার পৌঁছানোর আগেই নেটওয়ার্ক রিকোয়েস্ট তৈরি ও হ্যান্ডেল
            হয়ে যায়, ফলে কোনো লোডিং ল্যাগ টের পাওয়া যায় না।
          </li>
          <li>
            <strong>Prevent CLS with skeleton heights:</strong> lazy container-এর ভেতরে ফিক্সড হাইটের
            প্লেসহোল্ডার রাখুন, যেন কম্পোনেন্টটি মাউন্ট হলে পেজ লাফিয়ে না ওঠে।
          </li>
        </ul>
      </Note>
    </article>
  );
}
