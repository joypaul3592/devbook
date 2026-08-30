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
      bn: "রিডাররা এডিটরের কোড টানছে",
      en: "Readers downloading the editor",
    },
  },
  {
    id: "architecture",
    label: {
      bn: "Static bundle বনাম code-splitting",
      en: "Static bundle vs code splitting",
    },
  },
  {
    id: "mechanisms",
    label: { bn: "৩টি মূল ফিচার", en: "Three core features" },
  },
  {
    id: "implementation",
    label: { bn: "Skeleton সহ dynamic import", en: "Dynamic imports with skeletons" },
  },
  {
    id: "matrix",
    label: { bn: "Optimization Comparison", en: "Optimization comparison" },
  },
  {
    id: "takeaway",
    label: { bn: "Production Takeaways", en: "Production takeaways" },
  },
];

export default function DynamicImportsLazyLoading() {
  return (
    <article className="doc-prose">
      {/* ── The problem ───────────────────────────────────────────────── */}
      <H2 id="the-problem" anchorOnly>
        রিডাররা এডিটরের কোড টানছে
      </H2>

      <p>
        বিকেল ৪:৪৫। ভুলু ভাই তার স্পোর্টস পোর্টালে অ্যাডমিনদের জন্য একটি হেভি রিচ টেক্সট এডিটর এবং
        অ্যানালিটিক্স চার্ট যুক্ত করেছেন। কিন্তু সাধারণ ভিজিটরদের পেজ লোড টাইমের অবস্থা শোচনীয় —
        Lighthouse-এ First Load JS প্রায় এক মেগাবাইটের কাছাকাছি।
      </p>

      <Line name="ভুলু ভাই">
        ফাহিম! সাধারণ রিডারদের নিউজ পড়ার পেজ লোড হতে এত সময় নিচ্ছে কেন? তারা তো অ্যাডমিন এডিটর বা চার্ট
        ব্যবহার করছে না! সাধারণ পেজেও কেন এই ভারী ফাইল ডাউনলোড হচ্ছে?
      </Line>

      <Line name="ফাহিম">
        ভুলু ভাই! কারণ আপনি পেজের একদম ওপরে স্ট্যাটিকালি (<code>import HeavyEditor from ...</code>)
        ফাইলগুলো ইমপোর্ট করেছেন। ফলে কম্পাইলার পুরো লাইব্রেরির ৩-৪ শত কিলোবাইট কোড অ্যাপ্লিকেশনের
        ইনিশিয়াল JS বান্ডলে ইনক্লুড করে ফেলছে।
      </Line>

      <Line name="নেক্সট-ভাই">
        একদম! সাধারণ রিডারদের জন্য এডিটর বা চার্টের কোড প্রথম পেজ লোডে প্রয়োজনই নেই। এর পারফেক্ট সমাধান{" "}
        <code>next/dynamic</code> — কোড-স্প্লিটিং ও লেজি লোডিংয়ের মাধ্যমে ভারী কম্পোনেন্টগুলো আলাদা
        চ্যাঙ্কে থাকে এবং ইউজার ইন্টার‌অ্যাক্ট করলেই কেবল ডাউনলোড হয়।
      </Line>

      {/* ── Architecture ──────────────────────────────────────────────── */}
      <H2 id="architecture">১. Dynamic Import &amp; Code-Splitting Architecture</H2>

      <Diagram>{`┌─────────────────────────────────────────────────────────────────────────┐
│              STATIC BUNDLE VS DYNAMIC CODE-SPLITTING                    │
└─────────────────────────────────────────────────────────────────────────┘

 ❌ STATIC IMPORT (one massive initial bundle)
 ┌───────────────────────────────────────────────────────────────────────┐
 │ main bundle.js (550 KB)                                               │
 │  ├── core React app (40 KB)                                           │
 │  ├── heavy rich text editor (250 KB) ──► unused by normal readers     │
 │  └── heavy chart engine (260 KB)     ──► unused on initial load       │
 └──────────────────────────────────┬────────────────────────────────────┘
                                    │
                                    ▼
                 🔴 HIGH FIRST LOAD JS & SLOW TIME TO INTERACTIVE

───────────────────────────────────────────────────────────────────────────

 🟢 DYNAMIC IMPORT (lazy on-demand chunks)
 ┌───────────────────────────────────────────────────────────────────────┐
 │ main initial bundle.js (40 KB) ──► ultra-fast initial paint ⚡        │
 └───────────────────────────────────────────────────────────────────────┘
                                    │ user clicks "open editor" or scrolls
                                    ▼
 ┌──────────────────────────────────┐ ┌──────────────────────────────────┐
 │ async chunk 1: editor.js (250 KB)│ │ async chunk 2: chart.js (260 KB) │
 └──────────────────────────────────┘ └──────────────────────────────────┘`}</Diagram>

      {/* ── Mechanisms ────────────────────────────────────────────────── */}
      <H2 id="mechanisms">২. next/dynamic-এর ৩টি মূল অপটিমাইজেশন ফিচার</H2>

      <p>
        <strong>Automatic code splitting:</strong> ডাইনামিকালি ইমপোর্ট করা কম্পোনেন্টটিকে Next.js মেইন
        বান্ডল থেকে আলাদা করে ছোট একটি অ্যাসিনক্রোনাস JS চ্যাঙ্কে রূপান্তর করে।
      </p>

      <p>
        <strong>SSR opt-out (ssr: false):</strong> যেসব থার্ড-পার্টি লাইব্রেরি কেবল ব্রাউজার
        এনভায়রনমেন্টে (<code>window</code>, <code>document</code>) চলে, সেগুলোকে সার্ভার
        প্রি-রেন্ডারিং থেকে বাদ দিয়ে ব্রাউজারে আইসোলেটেড লোড করার ব্যবস্থা করে।
      </p>

      <p>
        <strong>Custom fallback UI (loading):</strong> ডাইনামিক মডিউলটি নেটওয়ার্ক থেকে আসতে যতক্ষণ
        লাগে, ইউজার যেন কোনো লেআউট শিফট ছাড়া একটি স্কেলিটন UI দেখতে পায় তা নিশ্চিত করে।
      </p>

      {/* ── Implementation ────────────────────────────────────────────── */}
      <H2 id="implementation">৩. Production Code Implementation</H2>

      <H3>❌ Anti-pattern — synchronous static imports of heavy libraries</H3>

      <CodeBlock filename="app/dashboard/legacy-page.tsx">{`// 🔴 POOR PRACTICE: static imports bake 300 KB+ of JS into the initial page bundle
import HeavyRichTextEditor from '@/components/HeavyRichTextEditor';
import HeavyAnalyticsChart from '@/components/HeavyAnalyticsChart';

export function UnoptimizedDashboard() {
  return (
    <div className="p-6 space-y-6">
      <h1 className="text-xl font-bold">Admin Panel</h1>
      {/* 🔴 both are parsed and loaded immediately, even while hidden */}
      <HeavyRichTextEditor />
      <HeavyAnalyticsChart />
    </div>
  );
}`}</CodeBlock>

      <H3>🟢 Production pattern — dynamic imports with skeleton fallbacks</H3>

      <CodeBlock filename="app/dashboard/page.tsx">{`// 🟢 PRODUCTION PATTERN: lazy loading heavy components with next/dynamic
'use client';

import dynamic from 'next/dynamic';
import { useState } from 'react';

// 🟢 STEP 1: the heavy editor, with a skeleton loading state
const DynamicRichTextEditor = dynamic(
  () => import('@/components/HeavyRichTextEditor'),
  {
    loading: () => (
      <div className="h-[250px] w-full bg-slate-900 border border-slate-800 rounded-xl animate-pulse flex items-center justify-center text-slate-500 text-sm">
        ⏳ Loading the rich text editor engine...
      </div>
    ),
    ssr: false, // 🟢 opt out of SSR if the editor touches window/canvas
  },
);

// 🟢 STEP 2: the heavy chart engine
const DynamicAnalyticsChart = dynamic(
  () => import('@/components/HeavyAnalyticsChart'),
  {
    loading: () => (
      <div className="h-[300px] w-full bg-slate-900 border border-slate-800 rounded-xl animate-pulse flex items-center justify-center text-slate-500 text-sm">
        📊 Loading the interactive charting engine...
      </div>
    ),
  },
);

export default function OptimizedDashboardPage() {
  const [showEditor, setShowEditor] = useState(false);

  return (
    <div className="p-8 max-w-4xl mx-auto space-y-6 bg-slate-950 text-slate-100 min-h-screen">
      <div className="space-y-1">
        <h1 className="text-2xl font-bold">Performance-optimized Dashboard</h1>
        <p className="text-sm text-slate-400">
          Heavy libraries load lazily on demand, without slowing the initial page.
        </p>
      </div>

      {/* 🟢 STEP 3: load the editor ONLY when the user asks for it */}
      <div className="space-y-4">
        {!showEditor ? (
          <button
            onClick={() => setShowEditor(true)}
            className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 rounded-lg text-sm font-semibold transition"
          >
            ✏️ Open the rich text editor
          </button>
        ) : (
          <DynamicRichTextEditor />
        )}
      </div>

      {/* 🟢 STEP 4: the lazily loaded chart component */}
      <div className="pt-6 border-t border-slate-900">
        <h2 className="text-lg font-semibold mb-3">Live Portal Analytics</h2>
        <DynamicAnalyticsChart />
      </div>
    </div>
  );
}`}</CodeBlock>

      {/* ── Matrix ────────────────────────────────────────────────────── */}
      <H2 id="matrix">৪. Optimization Comparison Matrix</H2>

      <Table
        head={["ক্রাইটেরিয়া", "স্ট্যাটিক ইমপোর্ট", "next/dynamic (lazy)"]}
        rows={[
          [
            "First Load JS",
            "অনেক বড় (300 KB – 1 MB+) 🔴",
            "অত্যন্ত হালকা 🟢",
          ],
          [
            "নেটওয়ার্ক রিকোয়েস্ট টাইমিং",
            "প্রথম পেজ লোডেই সব একসাথে",
            "ক্লিকে বা প্রয়োজন অনুযায়ী অন-ডিমান্ড 🟢",
          ],
          [
            "Server-side rendering",
            "সবসময় সার্ভারে এক্সিকিউট হয়",
            <span key="d">
              <code>{"{ ssr: false }"}</code> দিয়ে ডিসেবল করা যায় 🟢
            </span>,
          ],
          [
            "ইউজার এক্সপেরিয়েন্স",
            "স্লো FCP ও হাই TBT 🔴",
            "দ্রুত ফার্স্ট পেইন্ট, স্মুথ ইন্টার‌অ্যাকশন 🟢",
          ],
        ]}
      />

      <Line name="ভুলু ভাই">
        অসাম ফাহিম! ভারী এডিটর আর চার্ট লাইব্রেরিগুলোকে <code>next/dynamic</code>-এ নেওয়ার পর মেইন
        পেজের First Load JS এক ধাক্কায় ৫৫০ kB থেকে কমে মাত্র ৪৫ kB-তে চলে এসেছে!
      </Line>

      {/* ── Takeaways ─────────────────────────────────────────────────── */}
      <H2 id="takeaway">Production Takeaways</H2>

      <Note>
        <ul>
          <li>
            <strong>Defer modals, tabs, and drawers:</strong> যেসব মোডাল বা ড্রয়ার ইউজার ক্লিক করার
            আগে দৃশ্যমান হয় না, সেগুলো সবসময় <code>next/dynamic</code> দিয়ে লেজি-লোড করুন।
          </li>
          <li>
            <strong>Match skeleton height to avoid CLS:</strong> <code>loading</code> প্রপে এমন
            skeleton রিটার্ন করুন যার হাইট মূল কম্পোনেন্টের সমান, যাতে মাউন্টের পর পেজ না লাফায়।
          </li>
          <li>
            <strong>Use ssr: false for browser-only libraries:</strong> <code>window</code> বা canvas
            নির্ভর লাইব্রেরিতে <code>{"{ ssr: false }"}</code> দিয়ে{" "}
            <code>ReferenceError: window is not defined</code> চিরতরে দূর করুন।
          </li>
        </ul>
      </Note>
    </article>
  );
}
