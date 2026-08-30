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
      bn: "Element type is invalid এরর",
      en: "The 'element type is invalid' error",
    },
  },
  {
    id: "architecture",
    label: {
      bn: "next/dynamic lifecycle ও prefetch",
      en: "next/dynamic lifecycle & prefetch",
    },
  },
  {
    id: "mechanisms",
    label: { bn: "৪টি অ্যাডভান্সড কনসেপ্ট", en: "Four advanced concepts" },
  },
  {
    id: "implementation",
    label: {
      bn: "Named export ও intent prefetch",
      en: "Named exports & intent prefetch",
    },
  },
  {
    id: "matrix",
    label: {
      bn: "next/dynamic Configuration Matrix",
      en: "next/dynamic configuration matrix",
    },
  },
  {
    id: "takeaway",
    label: { bn: "Production Takeaways", en: "Production takeaways" },
  },
];

export default function NextDynamic() {
  return (
    <article className="doc-prose">
      {/* ── The problem ───────────────────────────────────────────────── */}
      <H2 id="the-problem" anchorOnly>
        Element type is invalid এরর
      </H2>

      <p>
        সকাল ১১:৪৫। ভুলু ভাই তার Next.js প্রজেক্টে <code>next/dynamic</code> ব্যবহার করতে গিয়ে বিপদে
        পড়েছেন। তিনি একটি থার্ড-পার্টি আইকন লাইব্রেরি এবং একটি UI কম্পোনেন্ট ইমপোর্ট করতে চাচ্ছেন যা{" "}
        <code>default export</code>-এর বদলে <code>named export</code> ব্যবহার করে। কনসোলে এরর দেখাচ্ছে
        — <code>Element type is invalid: expected a string or a class/function but got: undefined</code>।
      </p>

      <Line name="ভুলু ভাই">
        ফাহিম! <code>next/dynamic</code> তো কাজই করছে না! একটা ভারী ডায়ালগ কম্পোনেন্ট dynamic import
        দিয়ে লোড করতে চেয়েছিলাম, কিন্তু কেন <code>undefined</code> এরর দিচ্ছে? আর dynamic import করার
        পর ইউজার ক্লিকে ১ সেকেন্ড লোডিং স্পিনার দেখে বসে থাকে — এটাকে কি আগে থেকেই ব্যাকগ্রাউন্ডে
        প্রি-ফেচ করে রাখা যায় না?
      </Line>

      <Line name="ফাহিম">
        ভুলু ভাই! <code>next/dynamic</code> বাই-ডিফল্ট ধরে নেয় যে আপনি <code>export default</code> করা
        কোনো কম্পোনেন্ট ইমপোর্ট করছেন। যদি আপনার কম্পোনেন্টটি <code>export function MyDialog()</code>{" "}
        বা Named Export হয়, তবে <code>.then((mod) =&gt; mod.MyDialog)</code> দিয়ে প্রমিস রেজোলিউশন
        লিখে দিতে হয়।
      </Line>

      <Line name="নেক্সট-ভাই">
        একদম! আর ইউজার ক্লিকে লোডিং স্পিনার কমানোর গোপন রেসিপি হলো Manual Prefetching। ব্যবহারকারী
        কোনো বাটন বা মেনু আইটেমে হভার (<code>onMouseEnter</code>) বা ফোকাস করার সাথে সাথেই
        ব্যাকগ্রাউন্ডে <code>import()</code> প্রমিস ট্রিগার করে চ্যাঙ্কটি প্রিলোড করে রাখতে পারেন,
        যাতে ক্লিকে কোনো ল্যাগ ছাড়াই UI ফুটে ওঠে।
      </Line>

      {/* ── Architecture ──────────────────────────────────────────────── */}
      <H2 id="architecture">১. next/dynamic Lifecycle &amp; Prefetch Architecture</H2>

      <Diagram>{`┌─────────────────────────────────────────────────────────────────────────┐
│               NEXT/DYNAMIC PREFETCH & NAMED EXPORT FLOW                 │
└─────────────────────────────────────────────────────────────────────────┘

 ❌ DEFAULT IMPORT FAILURE (on named exports)
 dynamic(() => import('./NamedComponent')) ──► expects a default export
                                           │
                                           ▼
                            🔴 Error: element type is invalid (undefined)

───────────────────────────────────────────────────────────────────────────

 🟢 PROPER NAMED EXPORT & INTENT PREFETCHING

 1. Named export resolution:
    dynamic(() => import('./NamedComponent').then(m => m.NamedComponent))

 2. Hover / intent prefetching lifecycle:
 ┌─────────────────────────┐      user hovers button      ┌─────────────────────────┐
 │ user sees page shell    │ ───────────────────────────► │ trigger import() early  │
 └─────────────────────────┘                              └────────────┬────────────┘
                                                                       │
                                                                       ▼
 ┌─────────────────────────┐      user clicks button      ┌─────────────────────────┐
 │ render instant UI       │ ◄─────────────────────────── │ chunk already cached    │
 └─────────────────────────┘                              └─────────────────────────┘`}</Diagram>

      {/* ── Mechanisms ────────────────────────────────────────────────── */}
      <H2 id="mechanisms">২. next/dynamic-এর ৪টি অ্যাডভান্সড কনসেপ্ট</H2>

      <p>
        <strong>Named exports resolution:</strong> ইমপোর্ট করা ফাইলটি <code>export default</code>-এর
        বদলে <code>export const ComponentName</code> বা <code>export function ComponentName</code> হলে{" "}
        <code>.then((mod) =&gt; mod.ComponentName)</code> দিয়ে সঠিক ফাংশন পয়েন্টার রিটার্ন করতে হয়।
      </p>

      <p>
        <strong>ssr: false (client isolation):</strong> সার্ভার-সাইড রেন্ডারিং সম্পূর্ণ বাইপাস করে।
        সার্ভার কেবল <code>loading</code> ফলব্যাক রিটার্ন করবে এবং ব্রাউজারে মাউন্ট হওয়ার পর
        কম্পোনেন্ট লোড হবে।
      </p>

      <p>
        <strong>Intent-based manual prefetching:</strong> <code>dynamic()</code> ব্যাকগ্রাউন্ডে প্রমিস
        তৈরি করে। মাউস হভার বা ফোকাস ইভেন্টে ইমপোর্ট ফাংশনটি আগেভাগেই কল করে রাখলে ব্রাউজার ক্যাশড
        চ্যাঙ্ক ব্যবহার করে তাৎক্ষণিক রেন্ডারিং দেয়।
      </p>

      <p>
        <strong>Custom Suspense integration:</strong> <code>loading</code> প্রপ হিসেবে Skeleton UI বা
        লোডার ডিফাইন করে দিলে Layout Shift (CLS) শূন্যে নেমে আসে।
      </p>

      {/* ── Implementation ────────────────────────────────────────────── */}
      <H2 id="implementation">৩. Production Code Implementation</H2>

      <H3>❌ Anti-pattern — broken named export, no prefetch</H3>

      <CodeBlock filename="app/analytics/legacy-dashboard.tsx">{`// 🔴 POOR PRACTICE: a broken named-export dynamic import with no prefetching
'use client';

import { useState } from 'react';
import dynamic from 'next/dynamic';

// 🔴 anti-pattern: fails if 'DataChart' is a named export inside '@/components/DataChart'
const BrokenChart = dynamic(() => import('@/components/DataChart'), {
  ssr: false,
});

export function UnoptimizedDashboard() {
  const [showChart, setShowChart] = useState(false);

  return (
    <div className="p-6">
      <button onClick={() => setShowChart(true)}>Show Analytics</button>
      {/* 🔴 crashes, or renders late because nothing was prefetched */}
      {showChart && <BrokenChart />}
    </div>
  );
}`}</CodeBlock>

      <H3>🟢 Production pattern — named export, custom skeleton, hover prefetch</H3>

      <CodeBlock filename="components/DataAnalyticsChart.tsx">{`'use client';

import React from 'react';

// 🟢 a named export (NOT export default)
export function DataAnalyticsChart({ metric }: { metric: string }) {
  return (
    <div className="p-6 bg-slate-900 border border-slate-800 rounded-xl space-y-4">
      <div className="flex justify-between items-center border-b border-slate-800 pb-3">
        <h3 className="text-sm font-semibold text-indigo-400">📊 Realtime metric: {metric}</h3>
        <span className="text-xs bg-emerald-500/10 text-emerald-400 px-2 py-0.5 rounded border border-emerald-500/20">
          Live Stream
        </span>
      </div>
      <div className="h-40 bg-slate-950 rounded flex items-end p-4 gap-2">
        <div className="w-1/5 bg-indigo-600 h-1/2 rounded-t" />
        <div className="w-1/5 bg-indigo-600 h-3/4 rounded-t" />
        <div className="w-1/5 bg-indigo-600 h-2/3 rounded-t" />
        <div className="w-1/5 bg-indigo-600 h-full rounded-t" />
        <div className="w-1/5 bg-indigo-600 h-4/5 rounded-t" />
      </div>
    </div>
  );
}`}</CodeBlock>

      <CodeBlock filename="app/analytics/page.tsx">{`'use client';

import { useState } from 'react';
import dynamic from 'next/dynamic';

// 🟢 STEP 1: one factory function for the module import (a reusable pointer)
const chartImportFactory = () =>
  import('@/components/DataAnalyticsChart').then((mod) => mod.DataAnalyticsChart);

// 🟢 STEP 2: configure next/dynamic with a skeleton and named-export handling
const DynamicAnalyticsChart = dynamic(chartImportFactory, {
  loading: () => (
    <div className="p-6 bg-slate-900 border border-slate-800 rounded-xl space-y-4 animate-pulse">
      <div className="h-5 w-1/3 bg-slate-800 rounded" />
      <div className="h-40 bg-slate-800 rounded" />
    </div>
  ),
  ssr: false, // 🟢 bypasses server execution completely
});

export default function AdvancedAnalyticsPage() {
  const [isChartVisible, setIsChartVisible] = useState(false);

  // 🟢 STEP 3: manual prefetch on intent (hover or focus)
  const handlePrefetch = () => {
    chartImportFactory(); // fires the network request early
  };

  return (
    <div className="p-8 max-w-xl mx-auto space-y-6 bg-slate-950 text-slate-100 min-h-screen">
      <div className="space-y-1">
        <h1 className="text-2xl font-bold">Performance Analytics</h1>
        <p className="text-sm text-slate-400">
          Uses named export resolution and intent-based prefetching.
        </p>
      </div>

      <button
        onClick={() => setIsChartVisible(true)}
        onMouseEnter={handlePrefetch} // 🟢 prefetches 200-500ms before the actual click
        onFocus={handlePrefetch}      // 🟢 keyboard accessibility support
        className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-sm font-medium transition-colors"
      >
        {isChartVisible ? 'Reload Metric Chart' : 'Load Analytics Chart'}
      </button>

      {/* 🟢 renders instantly if prefetched, otherwise shows the skeleton */}
      {isChartVisible && <DynamicAnalyticsChart metric="User Conversions" />}
    </div>
  );
}`}</CodeBlock>

      {/* ── Matrix ────────────────────────────────────────────────────── */}
      <H2 id="matrix">৪. next/dynamic Configuration Matrix</H2>

      <Table
        head={["অপশন / প্যাটার্ন", "কনফিগারেশন সিনট্যাক্স", "সেরা ব্যবহারের ক্ষেত্র"]}
        rows={[
          [
            "Default export import",
            <code key="c">{"dynamic(() => import('./Comp'))"}</code>,
            "সাধারণ কম্পোনেন্ট বা পেজ লোডিং",
          ],
          [
            "Named export import",
            <code key="c">
              {"dynamic(() => import('./Comp').then(m => m.Comp))"}
            </code>,
            "ইউটিলিটি মডিউল বা প্যাকেজ থেকে নির্দিষ্ট এক্সপোর্ট",
          ],
          [
            "SSR opt-out",
            <code key="c">{"{ ssr: false }"}</code>,
            <span key="d">
              <code>window</code>, <code>document</code>, Canvas বা Map নির্ভর কম্পোনেন্ট
            </span>,
          ],
          [
            "loading fallback",
            <code key="c">{"{ loading: () => <Skeleton /> }"}</code>,
            "লোডিং চলাকালীন Layout Shift (CLS) প্রতিরোধ করা",
          ],
          [
            "Intent prefetching",
            <code key="c">{"onMouseEnter={() => import('./Comp')}"}</code>,
            "ক্লিক বাটনে লোডিং ডিলে পুরোপুরি শূন্য করে ফেলা",
          ],
        ]}
      />

      <Line name="ভুলু ভাই">
        এখন আর Named Export ইমপোর্ট করতে কোনো ঝামেলা নেই! আর <code>onMouseEnter</code>-এ প্রি-ফেচ
        ট্রিগার করায় বাটনে ক্লিক দেওয়ার সাথে সাথেই চ্যাঙ্ক মেমরি থেকে ভেসে উঠছে।
      </Line>

      {/* ── Takeaways ─────────────────────────────────────────────────── */}
      <H2 id="takeaway">Production Takeaways</H2>

      <Note>
        <ul>
          <li>
            <strong>Always handle named exports explicitly:</strong> <code>export function</code> দেওয়া
            ফাইলকে <code>next/dynamic</code> করার সময় সবসময়{" "}
            <code>.then((mod) =&gt; mod.Name)</code> ট্রান্সফর্ম ব্যবহার করুন।
          </li>
          <li>
            <strong>Implement intent prefetching:</strong> গুরুত্বপূর্ণ পপআপ বা ভারী ড্যাশবোর্ডের জন্য
            মাউস হভার (<code>onMouseEnter</code>) বা কিবোর্ড ফোকাস ইভেন্টে ইমপোর্ট ফ্যাক্টরি রান করে
            ইউজার পারসেপশন ফাস্ট রাখুন।
          </li>
          <li>
            <strong>Never omit the loading fallback:</strong> ভিজ্যুয়াল জাম্প প্রতিরোধ করতে সব
            ডাইনামিক কম্পোনেন্টের জন্য ম্যাচিং সাইজের Skeleton UI তৈরি করে দিন।
          </li>
        </ul>
      </Note>
    </article>
  );
}
