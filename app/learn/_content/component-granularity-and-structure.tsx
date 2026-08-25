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
      bn: "১ সেকেন্ডের টাইমার, পুরো ড্যাশবোর্ড ল্যাগ",
      en: "A one-second timer lags the whole dashboard",
    },
  },
  {
    id: "architecture",
    label: {
      bn: "Monolithic বনাম Granular স্ট্রাকচার",
      en: "Monolithic vs granular structure",
    },
  },
  {
    id: "foundations",
    label: { bn: "স্ট্রাকচারের ৩ নীতি", en: "Three structural principles" },
  },
  {
    id: "implementation",
    label: {
      bn: "Top-level স্টেট বনাম আইসোলেশন",
      en: "Top-level state vs isolation",
    },
  },
  {
    id: "matrix",
    label: { bn: "Structure Matrix", en: "Structure matrix" },
  },
  {
    id: "takeaway",
    label: { bn: "Production Takeaways", en: "Production takeaways" },
  },
];

export default function ComponentGranularityAndStructure() {
  return (
    <article className="doc-prose">
      {/* ── The problem ───────────────────────────────────────────────── */}
      <H2 id="the-problem" anchorOnly>
        ১ সেকেন্ডের টাইমার, পুরো ড্যাশবোর্ড ল্যাগ
      </H2>

      <p>
        রাত ৯:৪৫। ভুলু ভাইয়ের বিশাল <code>&lt;DashboardFeed /&gt;</code>-এর টপে একটি লাইভ ক্লক
        প্রতি সেকেন্ডে আপডেট হচ্ছে। ক্লকের স্টেট টপ-লেভেলে থাকায় প্রতি সেকেন্ডে ভেতরের ভারী টেবিল,
        চার্ট আর ফিল্টার লিস্ট রি-রেন্ডার হচ্ছে।
      </p>

      <Line name="ভুলু ভাই">
        ফাহিম! কম্পিউটারের ফ্যান ফুল স্পিডে ঘুরছে! মাত্র একটা ১ সেকেন্ডের টাইমার, তাতেই পুরো
        ড্যাশবোর্ড ল্যাগ করছে কেন? চাইল্ডে তো <code>React.memo</code> দিয়েছি।
      </Line>

      <Line name="ফাহিম">
        ভুলু ভাই! মূল সূত্রটা মনে রাখুন — একটি কম্পোনেন্ট রেন্ডার হলে তার সব চাইল্ড রিকার্সিভলি
        রেন্ডার হয়। টাইমারের স্টেট প্যারেন্টের পেটে রাখলে React ধরেই নেয় পুরো সাবট্রি বদলেছে।{" "}
        <code>memo</code>-র আগে দরকার সঠিক <strong>component granularity</strong>।
      </Line>

      <Line name="নেক্সট-ভাই">
        নিয়মটা সহজ — স্টেট আপডেট যেখানে হবে, কম্পোনেন্টের সীমানা ঠিক সেখানেই শেষ হবে। আর ভারী UI
        বাঁচাতে ব্যবহার করুন <strong>children prop pattern</strong>।
      </Line>

      {/* ── Architecture ──────────────────────────────────────────────── */}
      <H2 id="architecture">১. Monolithic বনাম Granular</H2>

      <Diagram>{`┌─────────────────────────────────────────────────────────────────────────┐
│               MONOLITHIC VS. GRANULAR COMPONENT RENDER                  │
└─────────────────────────────────────────────────────────────────────────┘

 ❌ MONOLITHIC (state high up)
 ┌───────────────────────────────────────────────────────────────────────┐
 │ <DashboardFeed>   state: [time, setTime]  — updates every 1s          │
 │   ├── <LiveClock />                                                   │
 │   ├── <HeavyChart />      🔴 re-renders every second                   │
 │   └── <ComplexTable />    🔴 re-renders every second                   │
 └───────────────────────────────────────────────────────────────────────┘

───────────────────────────────────────────────────────────────────────────

 🟢 GRANULAR (state isolated at the leaf)
 ┌───────────────────────────────────────────────────────────────────────┐
 │ <DashboardFeed>   a static container — no state at all                │
 │   ├── <IsolatedLiveClock />  ──▶ 🔴 only this re-renders each second   │
 │   ├── <HeavyChart />         ──▶ 🟢 dormant, zero re-renders           │
 │   └── <ComplexTable />       ──▶ 🟢 dormant, zero re-renders           │
 └───────────────────────────────────────────────────────────────────────┘`}</Diagram>

      {/* ── Foundations ───────────────────────────────────────────────── */}
      <H2 id="foundations">২. স্ট্রাকচারের ৩ নীতি</H2>

      <Note>
        <ul>
          <li>
            <strong>State isolation:</strong> হাই-ফ্রিকোয়েন্সি স্টেট (টাইমার, মাউস পজিশন, টাইপিং)
            যে এলিমেন্টে দরকার, ঠিক সেই ছোট কম্পোনেন্টের ভেতরেই এনক্যাপসুলেট করুন।
          </li>
          <li>
            <strong>Children prop pattern:</strong> প্যারেন্টে স্টেট রাখতেই হলে ভারী চাইল্ডদের
            ভেতরে ইমপোর্ট না করে <code>children</code> প্রপ হিসেবে পাস করুন। প্যারেন্ট রি-রেন্ডার
            হলেও <code>children</code> এলিমেন্টের রেফারেন্স একই থাকে, তাই React ওই সাবট্রি
            পুনরায় রেন্ডার করে না।
          </li>
          <li>
            <strong>Fine-grained leaf nodes:</strong> বিশাল লেআউট কম্পোনেন্টের বদলে UI-কে ছোট ছোট
            দায়িত্বসম্পন্ন leaf node-এ ভাগ করুন — প্রতিটি নিজের স্টেট নিজে সামলাবে।
          </li>
        </ul>
      </Note>

      {/* ── Implementation ────────────────────────────────────────────── */}
      <H2 id="implementation">৩. Top-level স্টেট বনাম আইসোলেশন</H2>

      <H3>❌ Anti-pattern — টাইমার প্যারেন্টে</H3>

      <CodeBlock filename="app/dashboard/monolithic-dashboard.tsx">{`'use client';

import { useEffect, useState } from 'react';

function HeavyAnalyticsChart() {
  console.log('HeavyAnalyticsChart re-rendered');
  return (
    <div className="p-6 bg-slate-900 rounded-xl border border-slate-800">
      <h3 className="text-lg font-bold text-slate-200">System analytics</h3>
      <p className="text-sm text-slate-400">Complex SVG and data calculations...</p>
    </div>
  );
}

export function MonolithicDashboard() {
  const [seconds, setSeconds] = useState(0);

  // Top-level state ticking once per second
  useEffect(() => {
    const timer = setInterval(() => setSeconds((s) => s + 1), 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="p-6 space-y-6 bg-slate-950 text-slate-100 min-h-screen">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Monolithic dashboard</h1>
        <span className="px-3 py-1 bg-indigo-500/20 text-indigo-400 rounded-lg text-sm font-mono">
          Uptime: {seconds}s
        </span>
      </div>

      {/* Re-renders every second, purely because the parent's state changed */}
      <HeavyAnalyticsChart />
    </div>
  );
}`}</CodeBlock>

      <H3>🟢 Fix — leaf isolation + children প্যাটার্ন</H3>

      <CodeBlock filename="app/dashboard/granular-dashboard.tsx">{`'use client';

import { useEffect, useState, type ReactNode } from 'react';

// 1. The high-frequency state now lives in its own leaf component
export function IsolatedLiveClock() {
  const [seconds, setSeconds] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => setSeconds((s) => s + 1), 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <span className="px-3 py-1 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 rounded-lg text-sm font-mono">
      Uptime: {seconds}s
    </span>
  );
}

// 2. The expensive component — untouched by the clock
export function HeavyAnalyticsChart() {
  console.log('HeavyAnalyticsChart rendered once');
  return (
    <div className="p-6 bg-slate-900 rounded-xl border border-slate-800 space-y-2">
      <h3 className="text-lg font-bold text-slate-200">System analytics</h3>
      <p className="text-sm text-slate-400">Rendering high-precision SVG data charts...</p>
    </div>
  );
}

// 3. When the parent MUST hold state, take the heavy tree as children
export function ExpandableCardLayout({ children }: { children: ReactNode }) {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className="p-4 bg-slate-900 border border-slate-800 rounded-xl space-y-4">
      <button
        onClick={() => setIsExpanded((v) => !v)}
        className="px-3 py-1 text-xs bg-indigo-600 text-white rounded-md font-medium"
      >
        Toggle details ({isExpanded ? 'expanded' : 'collapsed'})
      </button>

      {/* children was created by the parent's parent — its reference does not change here */}
      <div>{children}</div>
    </div>
  );
}

export function GranularDashboardPage() {
  return (
    <div className="p-6 space-y-6 bg-slate-950 text-slate-100 min-h-screen">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Granular dashboard</h1>
        <IsolatedLiveClock />
      </div>

      <ExpandableCardLayout>
        <HeavyAnalyticsChart />
      </ExpandableCardLayout>
    </div>
  );
}`}</CodeBlock>

      {/* ── Matrix ────────────────────────────────────────────────────── */}
      <H2 id="matrix">৪. Structure Decision Matrix</H2>

      <Table
        head={["প্যাটার্ন", "ব্যবহারের ক্ষেত্র", "পারফরম্যান্স প্রভাব"]}
        rows={[
          [
            "Monolithic component",
            "খুব ছোট স্ট্যাটিক পেজ বা ফর্ম",
            "ঝুঁকিপূর্ণ 🔴 — স্টেট বাড়লেই পুরো পেজ ল্যাগ করবে",
          ],
          [
            "State isolation (leaf node)",
            "টাইমার, কাউন্টার, লাইভ ব্যাজ, ইনপুট",
            "সেরা 🟢 — রেন্ডার ক্যাসকেড লোকাল কম্পোনেন্টেই থেমে যায়",
          ],
          [
            <>
              <code>children</code> prop pattern
            </>,
            "মোডাল, কার্ড লেআউট, ড্রয়ার, কোলাপসিবল সাইডবার",
            "চমৎকার ⚡ — প্যারেন্ট রেন্ডার হলেও চাইল্ড সাবট্রি স্কিপ হয়",
          ],
        ]}
      />

      <Line name="ভুলু ভাই">
        পরিষ্কার! হাই-ফ্রিকোয়েন্সি স্টেটগুলো leaf কম্পোনেন্টে পাঠাব, আর ভারী লেআউটে{" "}
        <code>children</code> প্রপ দিয়ে রি-রেন্ডার আটকাব।
      </Line>

      {/* ── Takeaways ─────────────────────────────────────────────────── */}
      <H2 id="takeaway">Production Takeaways</H2>

      <Note>
        <ul>
          <li>
            <strong>Push state to the leaves:</strong> স্টেটকে যতদূর সম্ভব ট্রি-র নিচে নামিয়ে দিন —
            এটিই সবচেয়ে সস্তা অপটিমাইজেশন।
          </li>
          <li>
            <strong>
              Leverage <code>children</code>:
            </strong>{" "}
            প্যারেন্টে স্টেট বাধ্যতামূলক হলে ভারী চাইল্ডকে <code>children</code> হিসেবে পাস করুন।
          </li>
          <li>
            <strong>Avoid monster components:</strong> ৩০০+ লাইনের সিঙ্গেল-ফাইল কম্পোনেন্টকে ছোট,
            একক-দায়িত্বের অংশে ভাগ করুন।
          </li>
        </ul>
      </Note>
    </article>
  );
}
