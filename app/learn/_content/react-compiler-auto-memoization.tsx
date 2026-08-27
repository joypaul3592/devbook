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
      bn: "ডিপেন্ডেন্সি অ্যারের জালে আটকে যাওয়া",
      en: "Tangled in dependency arrays",
    },
  },
  {
    id: "architecture",
    label: {
      bn: "ম্যানুয়াল বনাম কম্পাইলার মেকানিজম",
      en: "Manual vs compiler mechanism",
    },
  },
  {
    id: "setup",
    label: {
      bn: "Next.js 15-এ এনাবল করা",
      en: "Enabling it in Next.js 15",
    },
  },
  {
    id: "implementation",
    label: { bn: "আগে বনাম পরে", en: "Before vs after" },
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

export default function ReactCompilerAutoMemoization() {
  return (
    <article className="doc-prose">
      {/* ── The problem ───────────────────────────────────────────────── */}
      <H2 id="the-problem" anchorOnly>
        ডিপেন্ডেন্সি অ্যারের জালে আটকে যাওয়া
      </H2>

      <p>
        রাত ১১:০০। ভুলু ভাই কোডের প্রতিটি ফাংশন ও ভ্যালুতে <code>useMemo</code>,{" "}
        <code>useCallback</code> আর <code>React.memo</code> বসিয়ে দিয়েছেন। ফল — কখনো ভুল
        ডিপেন্ডেন্সিতে stale ডেটা আটকে থাকছে, কখনো মেমোইজেশনের ভিড়ে কোড অপাঠ্য।
      </p>

      <Line name="ভুলু ভাই">
        ফাহিম! রি-রেন্ডার থামাতে গিয়ে কোড <code>useCallback</code> আর <code>useMemo</code>-র জালে
        আটকে গেল! dependency array সিঙ্ক রাখতে রাখতে জীবন শেষ। এর আধুনিক সমাধান কী?
      </Line>

      <Line name="ফাহিম">
        ভুলু ভাই! Next.js 15 আর React 19-এর সবচেয়ে বড় ফিচার — <strong>React Compiler</strong>{" "}
        (আগের নাম React Forget)। এখন ম্যানুয়ালি <code>useMemo</code>, <code>useCallback</code> বা{" "}
        <code>React.memo</code> লিখতে হয় না; কম্পাইলার বিল্ড-টাইমে কোড অ্যানালাইজ করে fine-grained
        auto-memoization বসিয়ে দেয়।
      </Line>

      <Line name="নেক্সট-ভাই">
        ডেভেলপার লিখবে প্লেইন, ক্লিন JavaScript — আর কম্পাইলার ব্যাকগ্রাউন্ডে অপটিমাইজ করবে। চলুন
        দেখি Next.js 15-এ এটি কীভাবে সেট আপ হয়।
      </Line>

      {/* ── Architecture ──────────────────────────────────────────────── */}
      <H2 id="architecture">১. Manual বনাম Compiler Mechanism</H2>

      <Diagram>{`┌─────────────────────────────────────────────────────────────────────────┐
│               MANUAL MEMOIZATION VS. REACT COMPILER AUTOMATION          │
└─────────────────────────────────────────────────────────────────────────┘

 ❌ TRADITIONAL MANUAL APPROACH (developer overhead)
 ┌───────────────────────────────────────────────────────────────────────┐
 │ you write: useMemo(() => calc(a, b), [a, b])                          │
 │ ├── boilerplate in every component                                    │
 │ ├── dependency drift → stale closure bugs                             │
 │ └── constant cognitive load                                           │
 └───────────────────────────────────────────────────────────────────────┘

───────────────────────────────────────────────────────────────────────────

 🟢 REACT COMPILER (build-time AST transformation)
 ┌───────────────────────────────────────────────────────────────────────┐
 │ you write: const val = calc(a, b);                                    │
 │                                                                       │
 │ the compiler (Babel / SWC plugin), at build time:                     │
 │ ├── tracks mutations and verifies the Rules of React                  │
 │ ├── caches values, callbacks and JSX element trees                    │
 │ └── inserts fine-grained memoization boundaries                       │
 └───────────────────────────────────────────────────────────────────────┘`}</Diagram>

      {/* ── Setup ─────────────────────────────────────────────────────── */}
      <H2 id="setup">২. Next.js 15-এ এনাবল করা</H2>

      <CodeBlock label="Bash" filename="install.sh">{`npm install babel-plugin-react-compiler eslint-plugin-react-compiler`}</CodeBlock>

      <CodeBlock filename="next.config.ts">{`import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  experimental: {
    reactCompiler: true, // turns on auto-memoization for the whole app
  },
};

export default nextConfig;`}</CodeBlock>

      <Note>
        <p>
          ESLint প্লাগইনটি আলাদা করে দরকারি — এটি এমন কোড ধরিয়ে দেয় যেখানে Rules of React ভাঙার
          কারণে কম্পাইলার bail-out করবে, অর্থাৎ ওই ফাইলটি অপটিমাইজ হবে না।
        </p>
      </Note>

      {/* ── Implementation ────────────────────────────────────────────── */}
      <H2 id="implementation">৩. আগে বনাম পরে</H2>

      <H3>❌ আগে — ম্যানুয়াল মেমোইজেশনের বয়লারপ্লেট</H3>

      <CodeBlock filename="app/shop/legacy-memoization.tsx">{`'use client';

import React, { useCallback, useMemo, useState } from 'react';

interface Product {
  id: number;
  name: string;
  price: number;
}

const ProductItem = React.memo(function ProductItem({
  product,
  onAddToCart,
}: {
  product: Product;
  onAddToCart: (id: number) => void;
}) {
  return (
    <div className="flex justify-between p-3 bg-slate-900 border border-slate-800 rounded-lg">
      <span>
        {product.name} — \${product.price}
      </span>
      <button
        onClick={() => onAddToCart(product.id)}
        className="px-3 py-1 bg-indigo-600 text-xs text-white rounded"
      >
        Add
      </button>
    </div>
  );
});

export function LegacyMemoizationDemo() {
  const [products] = useState<Product[]>([
    { id: 1, name: 'Mechanical keyboard', price: 120 },
    { id: 2, name: 'Gaming mouse', price: 60 },
  ]);
  const [count, setCount] = useState(0);

  // Manual memo for derived state
  const totalValue = useMemo(
    () => products.reduce((acc, item) => acc + item.price, 0),
    [products],
  );

  // Manual callback so ProductItem's memo can succeed
  const handleAddToCart = useCallback((id: number) => {
    console.log('Added product:', id);
  }, []);

  return (
    <div className="p-6 space-y-4 bg-slate-950 text-slate-100 min-h-screen">
      <button onClick={() => setCount((c) => c + 1)} className="px-3 py-1 bg-slate-800 rounded">
        Counter: {count}
      </button>
      <p>Total inventory value: \${totalValue}</p>
      {products.map((p) => (
        <ProductItem key={p.id} product={p} onAddToCart={handleAddToCart} />
      ))}
    </div>
  );
}`}</CodeBlock>

      <H3>🟢 পরে — কম্পাইলার চালু, কোড প্লেইন</H3>

      <CodeBlock filename="app/shop/page.tsx">{`'use client';

import { useState } from 'react';

interface Product {
  id: number;
  name: string;
  price: number;
}

// No React.memo — the compiler caches this JSX when the props have not changed
function ProductItem({
  product,
  onAddToCart,
}: {
  product: Product;
  onAddToCart: (id: number) => void;
}) {
  return (
    <div className="flex justify-between p-3 bg-slate-900 border border-slate-800 rounded-lg">
      <span>
        {product.name} — \${product.price}
      </span>
      <button
        onClick={() => onAddToCart(product.id)}
        className="px-3 py-1 bg-indigo-600 text-xs text-white rounded hover:bg-indigo-500 transition-colors"
      >
        Add
      </button>
    </div>
  );
}

export function AutoMemoizedShop() {
  const [products] = useState<Product[]>([
    { id: 1, name: 'Mechanical keyboard', price: 120 },
    { id: 2, name: 'Gaming mouse', price: 60 },
  ]);
  const [count, setCount] = useState(0);

  // A plain calculation — cached automatically
  const totalValue = products.reduce((acc, item) => acc + item.price, 0);

  // A plain inline function — its identity is preserved automatically
  const handleAddToCart = (id: number) => {
    console.log('Added product:', id);
  };

  return (
    <div className="p-6 space-y-4 bg-slate-950 text-slate-100 min-h-screen">
      <div className="flex items-center gap-4">
        <button
          onClick={() => setCount((c) => c + 1)}
          className="px-4 py-2 bg-indigo-600 font-medium rounded-lg text-sm"
        >
          Re-render parent (count: {count})
        </button>
        <span className="text-sm text-slate-400">Total value: \${totalValue}</span>
      </div>

      <div className="space-y-2">
        {products.map((p) => (
          <ProductItem key={p.id} product={p} onAddToCart={handleAddToCart} />
        ))}
      </div>
    </div>
  );
}`}</CodeBlock>

      {/* ── Matrix ────────────────────────────────────────────────────── */}
      <H2 id="matrix">৪. Feature Comparison Matrix</H2>

      <Table
        head={["বৈশিষ্ট্য", "ম্যানুয়াল মেমোইজেশন", "React Compiler"]}
        rows={[
          [
            "Developer experience",
            "জটিল 🔴 — প্রতিটি ডিপেন্ডেন্সি হাতে সামলাতে হয়",
            "সহজ 🟢 — বাড়তি হুক লেখার দরকার নেই",
          ],
          [
            "Bug surface",
            "উচ্চ 🔴 — stale closure ও missing dependency",
            "কম 🟢 — কম্পাইলার নিরাপদ না হলে অপটিমাইজই করে না",
          ],
          [
            "Granularity",
            "Coarse — পুরো কম্পোনেন্ট বা পুরো অবজেক্ট",
            "Fine — আলাদা ভ্যালু, callback ও JSX নোড",
          ],
          [
            "Source size",
            "বয়লারপ্লেটে সোর্স ভারী হয়",
            "সোর্স ক্লিন, মেমোইজেশন বিল্ড-টাইমে ইনজেক্ট হয়",
          ],
        ]}
      />

      <Line name="ভুলু ভাই">
        অসাধারণ! Next.js 15-এ কম্পাইলার অন থাকলে আর <code>useMemo</code> /{" "}
        <code>useCallback</code> দিয়ে কোড ভারী করার দরকারই নেই।
      </Line>

      {/* ── Takeaways ─────────────────────────────────────────────────── */}
      <H2 id="takeaway">Production Takeaways</H2>

      <Note>
        <ul>
          <li>
            <strong>Follow the Rules of React:</strong> pure component, রেন্ডারে মিউটেশন নয় —
            নিয়ম মানলেই কম্পাইলার অপটিমাইজ করবে; নইলে চুপচাপ ওই অংশ ছেড়ে দেবে।
          </li>
          <li>
            <strong>Opt out where needed:</strong> কোনো লিগ্যাসি বা থার্ড-পার্টি কোডে সমস্যা হলে
            ফাইল বা ফাংশনের শুরুতে <code>&quot;use no memo&quot;</code> দিন।
          </li>
          <li>
            <strong>Spend the time on architecture:</strong> মেমোইজেশন টিউন করার বদলে ডোমেন লজিক আর
            কম্পোনেন্ট স্ট্রাকচারে মনোযোগ দিন — সেটিই এখন আসল লিভার।
          </li>
        </ul>
      </Note>
    </article>
  );
}
