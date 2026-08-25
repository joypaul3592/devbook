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
      bn: "৫০টি কম্পোনেন্টে memo, তবু স্লো",
      en: "memo on 50 components, still slow",
    },
  },
  {
    id: "architecture",
    label: {
      bn: "Shallow comparison ডিসিশন ট্রি",
      en: "The shallow comparison decision tree",
    },
  },
  {
    id: "foundations",
    label: { bn: "memo দেওয়ার ৩ শর্ত", en: "Three conditions for memo" },
  },
  {
    id: "implementation",
    label: {
      bn: "Over-memoization বনাম টার্গেটেড memo",
      en: "Over-memoization vs targeted memo",
    },
  },
  {
    id: "matrix",
    label: { bn: "memo Decision Matrix", en: "memo decision matrix" },
  },
  {
    id: "takeaway",
    label: { bn: "Production Takeaways", en: "Production takeaways" },
  },
];

export default function WhenToUseMemo() {
  return (
    <article className="doc-prose">
      {/* ── The problem ───────────────────────────────────────────────── */}
      <H2 id="the-problem" anchorOnly>
        ৫০টি কম্পোনেন্টে memo, তবু স্লো
      </H2>

      <p>
        বিকেল ৪:০০। ভুলু ভাই আনন্দে প্রজেক্টের ছোট-বড় ৫০টি কম্পোনেন্টকে <code>React.memo</code>{" "}
        দিয়ে মুড়ে দিয়েছেন। কিন্তু বেঞ্চমার্কে দেখা গেল — পারফরম্যান্স বাড়েনি, উল্টো মেমোরি
        কনজাম্পশন বেড়েছে আর রেন্ডার টাইম সামান্য স্লো হয়েছে।
      </p>

      <Line name="ভুলু ভাই">
        ফাহিম! ডকে তো লেখা <code>memo</code> দিলে প্যারেন্ট রি-রেন্ডার হলেও চাইল্ড আটকানো যায়। সব
        জায়গায় বসালাম, তাও অ্যাপ স্লো হলো কেন?
      </Line>

      <Line name="ফাহিম">
        ভুলু ভাই! <code>memo</code> ফ্রি নয়। প্রতিবার প্রপস মেলাতে React-কে{" "}
        <strong>shallow comparison</strong> করতে হয়, তার নিজস্ব খরচ আছে। আর প্রপসে ইনলাইন অবজেক্ট বা
        অ্যারো ফাংশন পাঠালে তুলনা প্রতিবারই ফেল করবে — খরচ দেবেন, লাভ পাবেন না।
      </Line>

      <Line name="নেক্সট-ভাই">
        সহজ নিয়ম — প্রপস তুলনার খরচ যদি কম্পোনেন্ট রেন্ডারের খরচের চেয়ে বেশি হয়, তবে{" "}
        <code>memo</code> নিজেই একটি অ্যান্টি-প্যাটার্ন।
      </Line>

      {/* ── Architecture ──────────────────────────────────────────────── */}
      <H2 id="architecture">১. React.memo Decision Tree</H2>

      <Diagram>{`┌─────────────────────────────────────────────────────────────────────────┐
│                    REACT.MEMO SHALLOW COMPARISON TREE                   │
└─────────────────────────────────────────────────────────────────────────┘

                     the parent component re-renders
                                │
                                ▼
                   is the child wrapped in React.memo?
                                │
                  ┌─────────────┴─────────────┐
                  │ yes                       │ no
                  ▼                           ▼
      shallow-compare every prop      🔴 always re-renders
      (Object.is per prop key)           (React's default)
                  │
        ┌─────────┴──────────┐
        ▼                    ▼
  [props equal]        [props differ]
  same primitive /     a new inline object or
  same reference       function was created
        │                    │
        ▼                    ▼
  🟢 bailed out       🔴 re-renders anyway
  (render skipped)    (compare cost + render cost, both wasted)`}</Diagram>

      {/* ── Foundations ───────────────────────────────────────────────── */}
      <H2 id="foundations">২. memo দেওয়ার ৩ শর্ত</H2>

      <Note>
        <p>
          <code>memo</code> বসানোর আগে নিশ্চিত করুন কম্পোনেন্টটি নিচের{" "}
          <strong>তিনটি শর্তই</strong> পূরণ করে:
        </p>
        <ul>
          <li>
            <strong>Pure component:</strong> একই প্রপসের জন্য সবসময় একই UI রিটার্ন করে।
          </li>
          <li>
            <strong>High-frequency parent updates:</strong> প্যারেন্ট ঘন ঘন রি-রেন্ডার হয়
            (অ্যানিমেশন, টাইপিং, টাইমার), কিন্তু এই চাইল্ডের প্রপস বেশিরভাগ সময় অপরিবর্তিত থাকে।
          </li>
          <li>
            <strong>High render cost:</strong> চাইল্ডে অনেক DOM নোড বা জটিল হিসাব আছে — অর্থাৎ
            তুলনার কয়েক মাইক্রোসেকেন্ড খরচ করে রেন্ডারের কয়েক মিলিসেকেন্ড বাঁচছে।
          </li>
        </ul>
      </Note>

      {/* ── Implementation ────────────────────────────────────────────── */}
      <H2 id="implementation">৩. Over-memoization বনাম টার্গেটেড memo</H2>

      <H3>❌ Anti-pattern — ছোট কম্পোনেন্টে memo, প্রপস অস্থির</H3>

      <CodeBlock filename="app/_components/premature-memo.tsx">{`'use client';

import { memo, useState } from 'react';

// A button is far too cheap to memoize — and the prop below breaks it anyway
const BadButton = memo(function BadButton({
  onClick,
  label,
}: {
  onClick: () => void;
  label: string;
}) {
  console.log('BadButton re-rendered');
  return (
    <button onClick={onClick} className="px-4 py-2 bg-indigo-600 text-white rounded-lg">
      {label}
    </button>
  );
});

export function PrematureMemoPage() {
  const [count, setCount] = useState(0);

  return (
    <div className="p-6 space-y-4 bg-slate-950 text-slate-100">
      <h2>Count: {count}</h2>
      <button onClick={() => setCount((c) => c + 1)} className="px-3 py-1 bg-slate-800 rounded">
        Increment
      </button>

      {/* A new arrow function on every render — the comparison fails 100% of the time */}
      <BadButton label="Click me" onClick={() => console.log('Clicked')} />
    </div>
  );
}`}</CodeBlock>

      <H3>🟢 Fix — ভারী সাবট্রিতে memo + স্থিতিশীল প্রপস</H3>

      <CodeBlock filename="app/analytics/page.tsx">{`'use client';

import { memo, useCallback, useState } from 'react';

interface ChartProps {
  title: string;
  onExport: () => void;
}

// Worth memoizing: hundreds of nodes, and props rarely change
const HeavyAnalyticsChart = memo(function HeavyAnalyticsChart({ title, onExport }: ChartProps) {
  console.log('HeavyAnalyticsChart rendered — only when props actually change');

  return (
    <div className="p-6 bg-slate-900 border border-slate-800 rounded-2xl space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="font-bold text-indigo-400">{title}</h3>
        <button
          onClick={onExport}
          className="px-3 py-1 bg-slate-800 text-xs text-slate-300 rounded-lg"
        >
          Export report
        </button>
      </div>
      <div className="h-48 bg-slate-950 rounded-xl flex items-center justify-center text-slate-500">
        [500+ chart data points]
      </div>
    </div>
  );
});

export function OptimizedMemoPage() {
  const [ticker, setTicker] = useState(0);

  // Stable reference, so the memo comparison can actually succeed
  const handleExport = useCallback(() => {
    console.log('Exporting analytics data...');
  }, []);

  return (
    <div className="p-6 space-y-6 bg-slate-950 text-slate-100 min-h-screen">
      <div className="flex items-center gap-4">
        <h1 className="text-xl font-bold">Dashboard ticker: {ticker}</h1>
        <button
          onClick={() => setTicker((t) => t + 1)}
          className="px-4 py-2 bg-indigo-600 rounded-xl font-medium text-sm"
        >
          Tick counter
        </button>
      </div>

      {/* The chart does not re-render when the ticker updates */}
      <HeavyAnalyticsChart title="Monthly revenue metrics" onExport={handleExport} />
    </div>
  );
}`}</CodeBlock>

      {/* ── Matrix ────────────────────────────────────────────────────── */}
      <H2 id="matrix">৪. memo Decision Matrix</H2>

      <Table
        head={["কম্পোনেন্টের ধরন", "memo দেবেন?", "কারণ"]}
        rows={[
          [
            "ভারী চার্ট / বড় ডেটা টেবিল",
            "হ্যাঁ 🟢",
            "রেন্ডার কস্ট অনেক বেশি — প্রপস এক থাকলে স্কিপ করাই বড় লাভ",
          ],
          [
            "ছোট বাটন, লেবেল, টেক্সট",
            "না ❌",
            "রেন্ডার কস্ট প্রপস-চেকের খরচের চেয়েও কম",
          ],
          [
            "প্রপসে ইনলাইন অবজেক্ট / ফাংশন",
            "না ❌",
            <>
              রেফারেন্স প্রতিবার বদলায় — <code>memo</code> ১০০% ফেল করে
            </>,
          ],
          [
            "প্রপস প্রতি রেন্ডারেই বদলায়",
            "না ❌",
            "তুলনা ফেল করবে, উল্টো comparison ওভারহেড যোগ হবে",
          ],
        ]}
      />

      <Line name="ভুলু ভাই">
        বুঝেছি! সাধারণ টেক্সট আর বাটন থেকে <code>memo</code> তুলে দিয়ে শুধু ভারী গ্রাফ আর প্রোডাক্ট
        গ্রিডে <code>memo</code> + <code>useCallback</code> রাখব।
      </Line>

      {/* ── Takeaways ─────────────────────────────────────────────────── */}
      <H2 id="takeaway">Production Takeaways</H2>

      <Note>
        <ul>
          <li>
            <strong>Don&apos;t memoize everything:</strong> সর্বত্র <code>memo</code> বসালে
            প্রপস-চেকিং ওভারহেড আর মেমোরি খরচ মিলে অ্যাপ উল্টো ধীর হয়।
          </li>
          <li>
            <strong>Stabilize the props first:</strong> ফাংশন বা অবজেক্ট প্রপ পাঠালে সেগুলো{" "}
            <code>useCallback</code> / <code>useMemo</code> দিয়ে স্থির করুন, নইলে{" "}
            <code>memo</code> অর্থহীন।
          </li>
          <li>
            <strong>Profile before and after:</strong> Profiler-এ আগে-পরে রেন্ডার টাইম মিলিয়ে দেখুন
            — পার্থক্য উল্লেখযোগ্য না হলে <code>memo</code> তুলে দিন। (React Compiler চালু থাকলে
            বেশিরভাগ ক্ষেত্রেই এটি নিজে থেকেই হয়ে যায়।)
          </li>
        </ul>
      </Note>
    </article>
  );
}
