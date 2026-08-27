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
      bn: "কাউন্টার বাড়ালে ফুটারও রি-রেন্ডার",
      en: "The footer re-renders with the counter",
    },
  },
  {
    id: "architecture",
    label: { bn: "Re-render ট্রিগার ট্রি", en: "The re-render trigger tree" },
  },
  {
    id: "foundations",
    label: { bn: "৪টি প্রধান রুট কজ", en: "Four root causes" },
  },
  {
    id: "implementation",
    label: {
      bn: "State lifting বনাম State isolation",
      en: "State lifting vs state isolation",
    },
  },
  {
    id: "matrix",
    label: { bn: "Diagnostics Matrix", en: "Diagnostics matrix" },
  },
  {
    id: "takeaway",
    label: { bn: "Production Takeaways", en: "Production takeaways" },
  },
];

export default function ReRenderRootCauseAnalysis() {
  return (
    <article className="doc-prose">
      {/* ── The problem ───────────────────────────────────────────────── */}
      <H2 id="the-problem" anchorOnly>
        কাউন্টার বাড়ালে ফুটারও রি-রেন্ডার
      </H2>

      <p>
        রাত ১১:৩০। কাউন্টার বাটনে ক্লিক করলেই নিচের পুরো প্রোডাক্ট গ্রিড, ফুটার আর সাইডবার রি-রেন্ডার
        হচ্ছে। React DevTools-এ &quot;Highlight updates when components render&quot; অন করতেই পুরো
        স্ক্রিন সবুজ-হলুদ ফ্ল্যাশে ভরে গেল।
      </p>

      <Line name="ভুলু ভাই">
        ফাহিম! আমি তো শুধু <code>count</code> স্টেট বাড়াচ্ছি, ফুটার আর গ্রিডে তো{" "}
        <code>count</code> প্রপ পাঠাইনি — তাহলে ওগুলো রি-রেন্ডার হচ্ছে কেন?
      </Line>

      <Line name="ফাহিম">
        ভুলু ভাই! React-এর মৌলিক নিয়ম — প্যারেন্ট রি-রেন্ডার হলে ডিফল্টভাবে তার সব চাইল্ডও
        রি-রেন্ডার হয়, প্রপ বদলাক বা না বদলাক। আপনি <code>count</code> স্টেটটি পুরো পেজের রুট
        প্যারেন্টে রেখে দিয়েছেন।
      </Line>

      <Line name="নেক্সট-ভাই">
        রি-রেন্ডার কমানোর আগে <strong>root cause analysis</strong> শিখতে হবে। একটি কম্পোনেন্ট মূলত
        চার কারণে রি-রেন্ডার হয় — local state update, parent re-render, context change, আর
        subscribed external store change। কারণ না জেনে আন্দাজে <code>memo</code> বসালে পারফরম্যান্স
        বাড়ে না, উল্টো খরচ বাড়ে।
      </Line>

      {/* ── Architecture ──────────────────────────────────────────────── */}
      <H2 id="architecture">১. Re-render Trigger Tree</H2>

      <Diagram>{`┌─────────────────────────────────────────────────────────────────────────┐
│                      REACT RE-RENDER TRIGGER TREE                       │
└─────────────────────────────────────────────────────────────────────────┘

                     ┌───────────────────────────┐
                     │   state update triggered  │
                     │   e.g. setCount(c => c+1) │
                     └─────────────┬─────────────┘
                                   ▼
                   ┌───────────────────────────────┐
                   │   the parent component renders │
                   └───────────────┬───────────────┘
                                   │
         ┌─────────────────────────┴─────────────────────────┐
         ▼                                                   ▼
 [un-memoized children]                            [memoized child (React.memo)]
 🔴 forced re-render                               compares old props vs new props
    the function body re-runs                                │
    whether props changed or not               ┌─────────────┴─────────────┐
                                               ▼                           ▼
                                       [props unchanged]           [props changed]
                                       🟢 bailed out               🔴 re-renders`}</Diagram>

      {/* ── Foundations ───────────────────────────────────────────────── */}
      <H2 id="foundations">২. ৪টি প্রধান রুট কজ</H2>

      <Note>
        <ul>
          <li>
            <strong>Local state mutation:</strong> কম্পোনেন্টে <code>useState</code> বা{" "}
            <code>useReducer</code>-এর ডিসপ্যাচ কল হলে ওই কম্পোনেন্ট রি-রেন্ডার হতে বাধ্য।
          </li>
          <li>
            <strong>Cascading parent re-renders:</strong> প্যারেন্ট রেন্ডার হলেই পুরো চাইল্ড ট্রি
            আবার এক্সিকিউট হয় — চাইল্ডের প্রপ না বদলালেও।
          </li>
          <li>
            <strong>Referential instability:</strong> ইনলাইন অবজেক্ট{" "}
            <code>style=&#123;&#123; color: &apos;red&apos; &#125;&#125;</code> বা ইনলাইন ফাংশন{" "}
            <code>onClick=&#123;() =&gt; doSomething()&#125;</code> প্রতি রেন্ডারে নতুন রেফারেন্স
            বানায়, ফলে চাইল্ডে <code>React.memo</code> থাকলেও তুলনা ফেল করে।
          </li>
          <li>
            <strong>Context / external store update:</strong> উপরের কোনো কনটেক্সটের একটিমাত্র ফিল্ড
            বদলালেও ওই কনটেক্সটের সব কনজিউমার রি-রেন্ডার হয়।
          </li>
        </ul>
      </Note>

      {/* ── Implementation ────────────────────────────────────────────── */}
      <H2 id="implementation">৩. State lifting বনাম State isolation</H2>

      <H3>❌ Anti-pattern — স্টেট পেজের টপে</H3>

      <CodeBlock filename="app/dashboard/bad-dashboard-page.tsx">{`'use client';

import { useState } from 'react';

export function BadDashboardPage() {
  const [searchTerm, setSearchTerm] = useState('');

  return (
    <div className="p-6 space-y-6 bg-slate-950 text-slate-100">
      {/* This state changes on every keystroke — and it lives at the top */}
      <input
        type="text"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        placeholder="Type to search..."
        className="px-4 py-2 bg-slate-900 border border-slate-800 rounded-xl"
      />

      {/* Re-renders on every keystroke, though it never reads searchTerm */}
      <HeavyAnalyticsTable />
    </div>
  );
}

function HeavyAnalyticsTable() {
  console.log('HeavyAnalyticsTable re-rendered'); // fires on every keystroke
  return (
    <div className="p-4 bg-slate-900 border border-slate-800 rounded-xl">
      <h3 className="font-bold">Analytics data</h3>
      <p className="text-sm text-slate-400">Complex charts and data rows here...</p>
    </div>
  );
}`}</CodeBlock>

      <H3>🟢 Fix — স্টেট নিচে নামিয়ে আইসোলেট করা</H3>

      <CodeBlock filename="app/dashboard/page.tsx">{`'use client';

import { useState } from 'react';

// The search state is fully encapsulated here
function SearchBox({ onSearch }: { onSearch?: (term: string) => void }) {
  const [searchTerm, setSearchTerm] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    onSearch?.(e.target.value);
  };

  return (
    <input
      type="text"
      value={searchTerm}
      onChange={handleChange}
      placeholder="Type to search..."
      className="px-4 py-2 bg-slate-900 border border-slate-800 rounded-xl text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
    />
  );
}

function HeavyAnalyticsTable() {
  console.log('HeavyAnalyticsTable rendered'); // fires once, on mount
  return (
    <div className="p-6 bg-slate-900 border border-slate-800 rounded-2xl space-y-3">
      <h3 className="font-semibold text-indigo-400">Analytics data</h3>
      <div className="h-40 bg-slate-950/50 rounded-xl border border-slate-800/80 flex items-center justify-center text-slate-500">
        [heavy chart component]
      </div>
    </div>
  );
}

export function OptimizedDashboardPage() {
  console.log('OptimizedDashboardPage rendered'); // fires once, on mount

  return (
    <div className="p-6 space-y-6 bg-slate-950 text-slate-100 min-h-screen">
      <div className="flex justify-between items-center">
        <h1 className="text-xl font-bold">Dashboard</h1>
        <SearchBox />
      </div>

      {/* Typing in SearchBox never reaches this subtree */}
      <HeavyAnalyticsTable />
    </div>
  );
}`}</CodeBlock>

      {/* ── Matrix ────────────────────────────────────────────────────── */}
      <H2 id="matrix">৪. Re-render Diagnostics Matrix</H2>

      <Table
        head={["রুট কজ", "লক্ষণ", "সমাধান"]}
        rows={[
          [
            "High state placement",
            "ইনপুটে টাইপ করলে অসংশ্লিষ্ট হেডার / সাইডবার ফ্ল্যাশ করে",
            "State push-down — স্টেট কম্পোনেন্ট ট্রি-র নিচে সরানো",
          ],
          [
            "Referential instability",
            <>
              <code>React.memo</code> দেওয়ার পরও চাইল্ড রি-রেন্ডার হয়
            </>,
            <>
              <code>useMemo</code> / <code>useCallback</code> দিয়ে রেফারেন্স স্থির করা
            </>,
          ],
          [
            "Monolithic context",
            "কনটেক্সটের এক ভ্যালু বদলালেই সব কনজিউমার রেন্ডার",
            "Context splitting — state ও dispatch আলাদা করা",
          ],
          [
            "Children cascading",
            "প্যারেন্টের ইন্টারনাল স্টেট বদলালে চাইল্ড অযথা রেন্ডার",
            <>
              <code>children</code> প্রপ প্যাটার্নে চাইল্ড পাস করা
            </>,
          ],
        ]}
      />

      <Line name="ভুলু ভাই">
        ক্রিস্টাল ক্লিয়ার! সার্চ ইনপুটের স্টেট পেজের টপে ছিল বলেই টাইপ করলে পুরো পেজ কাঁপত।{" "}
        <code>SearchBox</code>-এর ভেতর আইসোলেট করার পর টেবিলের অপ্রয়োজনীয় রি-রেন্ডার শূন্য।
      </Line>

      {/* ── Takeaways ─────────────────────────────────────────────────── */}
      <H2 id="takeaway">Production Takeaways</H2>

      <Note>
        <ul>
          <li>
            <strong>State isolation first:</strong> <code>memo</code> / <code>useMemo</code>-এর
            পেছনে ছোটার আগে স্টেটকে যতটা সম্ভব ট্রি-র নিচে নামান — এটি বিনামূল্যের অপটিমাইজেশন।
          </li>
          <li>
            <strong>
              Use the <code>children</code> pattern:
            </strong>{" "}
            প্যারেন্টের স্টেট যদি চাইল্ডের কাজে না লাগে, চাইল্ডকে{" "}
            <code>&lt;Parent&gt;&lt;Child /&gt;&lt;/Parent&gt;</code> হিসেবে পাস করুন — তখন{" "}
            <code>children</code> এলিমেন্টটি একই রেফারেন্স থাকে, চাইল্ড রেন্ডার হয় না।
          </li>
          <li>
            <strong>Profile, don&apos;t guess:</strong> React DevTools Profiler-এ &quot;Why did
            this render?&quot; অন করে আসল কারণটা দেখে নিন, তারপর ফিক্স করুন।
          </li>
        </ul>
      </Note>
    </article>
  );
}
