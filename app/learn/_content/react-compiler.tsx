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
      bn: "memo, useMemo, useCallback-এর জঙ্গল",
      en: "A jungle of memo, useMemo and useCallback",
    },
  },
  {
    id: "architecture",
    label: { bn: "কম্পাইলার পাইপলাইন", en: "The compiler pipeline" },
  },
  {
    id: "foundations",
    label: { bn: "৪টি মূল মেকানিজম", en: "Four core mechanisms" },
  },
  {
    id: "implementation",
    label: {
      bn: "ম্যানুয়াল মেমোইজেশন বনাম কম্পাইলার",
      en: "Manual memoization vs the compiler",
    },
  },
  {
    id: "matrix",
    label: { bn: "Comparison Matrix", en: "Comparison matrix" },
  },
  {
    id: "takeaway",
    label: { bn: "Production Takeaways", en: "Production takeaways" },
  },
];

export default function ReactCompiler() {
  return (
    <article className="doc-prose">
      {/* ── The problem ───────────────────────────────────────────────── */}
      <H2 id="the-problem" anchorOnly>
        memo, useMemo, useCallback-এর জঙ্গল
      </H2>

      <p>
        রাত ৯:৩০। ভুলু ভাইয়ের ড্যাশবোর্ডে ফিল্টার ইনপুট বদলালেই ২০টি চাইল্ড কম্পোনেন্ট অপ্রয়োজনে
        রি-রেন্ডার হচ্ছে। থামাতে গিয়ে তিনি প্রতিটি কম্পোনেন্টে <code>React.memo</code>,{" "}
        <code>useMemo</code> আর <code>useCallback</code> বসিয়ে কোডকে জঙ্গল বানিয়ে ফেলেছেন।
      </p>

      <Line name="ভুলু ভাই">
        ফাহিম! একটু পারফরম্যান্স অপটিমাইজ করতে গেলেই কেন কোড এত অগোছালো হয়ে যায়? কোথায়{" "}
        <code>useMemo</code>, কোথায় <code>useCallback</code>, কোন ডিপেন্ডেন্সি মিস হলো — ভাবতে
        ভাবতেই ডেভেলপমেন্ট স্পিড অর্ধেক!
      </Line>

      <Line name="ফাহিম">
        ভুলু ভাই! ম্যানুয়াল মেমোইজেশনের এই যুগ শেষ করতেই এসেছে <strong>React Compiler</strong>।
        React 19-এ হাতে <code>useMemo</code>, <code>useCallback</code> বা <code>React.memo</code>{" "}
        লেখার দরকার নেই।
      </Line>

      <Line name="নেক্সট-ভাই">
        React Compiler হলো একটি বিল্ড-টাইম অপটিমাইজার (Babel / SWC প্লাগইন)। এটি আপনার প্লেইন
        React কোড অ্যানালাইজ করে অবজেক্ট, ফাংশন রেফারেন্স আর রেন্ডার ট্রি অটোমেটিক মেমোইজ করে দেয় —
        জিরো বয়লারপ্লেটে অপটিমাইজড পারফরম্যান্স।
      </Line>

      {/* ── Architecture ──────────────────────────────────────────────── */}
      <H2 id="architecture">১. React Compiler Pipeline</H2>

      <Diagram>{`┌─────────────────────────────────────────────────────────────────────────┐
│                    REACT COMPILER PIPELINE (BUILD-TIME)                 │
└─────────────────────────────────────────────────────────────────────────┘

 plain component code (no useMemo, useCallback or React.memo)
        │
        ▼
 ┌───────────────────────────────────────────────────────────────────────┐
 │ React Compiler — AST analysis                                         │
 │ ├── checks the Rules of React and the rules of hooks                  │
 │ ├── builds a dependency graph for every value in the render           │
 │ └── identifies where a memoization cache is safe to insert            │
 └───────────────────────────────────────────────────────────────────────┘
        │
        ▼
 auto-memoized output
 (internal cache slots inserted around values, handlers and JSX subtrees)`}</Diagram>

      {/* ── Foundations ───────────────────────────────────────────────── */}
      <H2 id="foundations">২. ৪টি মূল মেকানিজম</H2>

      <Note>
        <ul>
          <li>
            <strong>Auto-memoization of values &amp; functions:</strong> কম্পাইল টাইমে AST
            অ্যানালাইজ করে যেসব ভ্যালু বা ইভেন্ট হ্যান্ডলার আবার হিসাব করার দরকার নেই, সেগুলোকে
            ইন্টারনাল ক্যাশে মুড়ে দেয়।
          </li>
          <li>
            <strong>Fine-grained subtree caching:</strong> কোনো কম্পোনেন্টের প্রপস বা স্টেট না
            বদলালে কম্পাইলার তার পুরো সাবট্রি-র রি-রেন্ডার স্কিপ করে।
          </li>
          <li>
            <strong>Rules of React enforcement:</strong> কোড immutability ও pure function রুল
            মানলেই কম্পাইলার অপটিমাইজ করে; কোথাও মিউটেশন বা সাইড-ইফেক্ট দেখলে সেই অংশটিকে নিরাপদে{" "}
            bail-out করে ছেড়ে দেয়।
          </li>
          <li>
            <strong>Zero developer overhead:</strong> ডিপেন্ডেন্সি অ্যারে (<code>[deps]</code>)
            মেইনটেইন করার ঝামেলা নেই, তাই কোড ক্লিন ও রিডেবল থাকে আর stale-closure বাগ কমে যায়।
          </li>
        </ul>
      </Note>

      {/* ── Implementation ────────────────────────────────────────────── */}
      <H2 id="implementation">৩. ম্যানুয়াল মেমোইজেশন বনাম কম্পাইলার</H2>

      <H3>❌ Anti-pattern — হাতে বসানো মেমোইজেশনের নয়েজ</H3>

      <CodeBlock filename="app/dashboard/_components/bad-memo-dashboard.tsx">{`'use client';

import React, { useState, useMemo, useCallback } from 'react';

// Manual memoization wrapper
const ExpensiveChild = React.memo(function ExpensiveChild({
  onClick,
  data,
}: {
  onClick: () => void;
  data: number[];
}) {
  return <button onClick={onClick}>Items count: {data.length}</button>;
});

export function BadMemoDashboard() {
  const [count, setCount] = useState(0);
  const [items] = useState([1, 2, 3, 4, 5]);

  // Manual callback memoization
  const handleClick = useCallback(() => {
    console.log('Clicked');
  }, []);

  // Manual value memoization + hand-maintained dependency array
  const filteredData = useMemo(() => items.filter((x) => x > 2), [items]);

  return (
    <div>
      <button onClick={() => setCount(count + 1)}>Count: {count}</button>
      <ExpensiveChild onClick={handleClick} data={filteredData} />
    </div>
  );
}`}</CodeBlock>

      <H3>🟢 Fix — প্লেইন কোড, কম্পাইলার বাকিটা করবে</H3>

      <CodeBlock filename="app/dashboard/_components/analytics.tsx">{`'use client';

import { useState } from 'react';

// A plain component — the compiler memoizes it automatically
function ExpensiveChild({ onClick, data }: { onClick: () => void; data: number[] }) {
  return (
    <button
      onClick={onClick}
      className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white font-medium rounded-xl transition-all"
    >
      Filtered items: {data.length}
    </button>
  );
}

export function OptimizedDashboard() {
  const [count, setCount] = useState(0);
  const [items] = useState([10, 25, 30, 42, 50, 61]);

  // A plain function — the compiler keeps its identity stable across renders
  const handleClick = () => {
    console.log('Analytics action triggered');
  };

  // A plain calculation — cached while \`items\` has not changed
  const filteredData = items.filter((x) => x > 20);

  return (
    <div className="p-8 bg-slate-950 min-h-screen text-slate-100 space-y-6 max-w-md mx-auto">
      <div className="p-6 bg-slate-900 border border-slate-800 rounded-2xl space-y-4">
        <h2 className="text-lg font-bold text-white">Auto-optimized dashboard</h2>

        <p className="text-sm text-slate-400">
          Unrelated state (count): <span className="font-mono text-emerald-400">{count}</span>
        </p>

        <button
          onClick={() => setCount(count + 1)}
          className="w-full py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-sm font-semibold rounded-xl"
        >
          Increment unrelated state
        </button>

        <div className="pt-2">
          {/* ExpensiveChild does not re-render when \`count\` changes */}
          <ExpensiveChild onClick={handleClick} data={filteredData} />
        </div>
      </div>
    </div>
  );
}`}</CodeBlock>

      <CodeBlock filename="next.config.ts">{`import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  // Enables the React Compiler for the whole app
  experimental: {
    reactCompiler: true,
  },
};

export default nextConfig;`}</CodeBlock>

      {/* ── Matrix ────────────────────────────────────────────────────── */}
      <H2 id="matrix">৪. ম্যানুয়াল মেমোইজেশন বনাম React Compiler</H2>

      <Table
        head={["বৈশিষ্ট্য", "Manual memoization", "React Compiler"]}
        rows={[
          [
            "Code cleanliness",
            <>
              <code>useMemo</code> / <code>useCallback</code>-এ কোড ভারী হয়
            </>,
            "প্লেইন JavaScript ও JSX",
          ],
          [
            "Dependency bugs",
            "মিসিং ডিপেন্ডেন্সি থেকে stale-value বাগ",
            "কম্পাইল-টাইমে ডিপেন্ডেন্সি নিজেই ট্র্যাক হয়",
          ],
          [
            "Overhead",
            "ভুল জায়গায় মেমো বসালে পারফরম্যান্স উল্টো কমে",
            "যেখানে লাভ আছে সেখানেই ক্যাশ বসে",
          ],
          [
            "Refactoring",
            "ঝুঁকিপূর্ণ — মেমো চেইন ভেঙে যায়",
            "সাধারণ কোডের মতোই রিফ্যাক্টর করা যায়",
          ],
        ]}
      />

      <Line name="ভুলু ভাই">
        আহা! এখন আর ভেবে ভেবে <code>useMemo</code> বসাতে হবে না — কম্পাইলার নিজেই ব্যাকগ্রাউন্ডে
        ক্যাশ করে অপ্রয়োজনীয় রি-রেন্ডার আটকে দিচ্ছে।
      </Line>

      {/* ── Takeaways ─────────────────────────────────────────────────── */}
      <H2 id="takeaway">Production Takeaways</H2>

      <Note>
        <ul>
          <li>
            <strong>Write pure React:</strong> কম্পোনেন্ট ও কাস্টম হুক অবশ্যই pure হতে হবে —
            রেন্ডারের সময় props/state মিউটেট করা বা সরাসরি DOM ছোঁয়া চলবে না, নইলে কম্পাইলার
            অপটিমাইজ করবে না।
          </li>
          <li>
            <strong>Know the escape hatch:</strong> কোনো ট্রিকি লজিক বা থার্ড-পার্টি ইন্টিগ্রেশনে
            কম্পাইলার স্কিপ করাতে চাইলে ফাংশনের শুরুতে{" "}
            <code>&quot;use no memo&quot;</code> ডিরেক্টিভ দিন।
          </li>
          <li>
            <strong>Adopt progressively:</strong> চালু করতে{" "}
            <code>experimental.reactCompiler: true</code> — তারপর React DevTools-এ কম্পোনেন্টের
            পাশে &quot;Memo ✨&quot; ব্যাজ দেখে যাচাই করুন কোনগুলো আসলে কম্পাইল হয়েছে।
          </li>
        </ul>
      </Note>
    </article>
  );
}
