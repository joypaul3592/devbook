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
      bn: "fullName-এর জন্যও useMemo?",
      en: "useMemo for a full name?",
    },
  },
  {
    id: "architecture",
    label: { bn: "খরচ বনাম লাভের হিসাব", en: "The cost/benefit balance" },
  },
  {
    id: "foundations",
    label: { bn: "৩টি মূল মেকানিজম", en: "Three core mechanisms" },
  },
  {
    id: "implementation",
    label: {
      bn: "তুচ্ছ হিসাব বনাম আসল ভারী কাজ",
      en: "Trivial math vs real work",
    },
  },
  {
    id: "matrix",
    label: { bn: "Decision Matrix", en: "Decision matrix" },
  },
  {
    id: "takeaway",
    label: { bn: "Production Takeaways", en: "Production takeaways" },
  },
];

export default function UseMemoCostVsBenefit() {
  return (
    <article className="doc-prose">
      {/* ── The problem ───────────────────────────────────────────────── */}
      <H2 id="the-problem" anchorOnly>
        fullName-এর জন্যও useMemo?
      </H2>

      <p>
        বিকেল ৫:১৫। ভুলু ভাইয়ের নতুন কোডে লাইনগুলো এমন —{" "}
        <code>
          const fullName = useMemo(() =&gt; firstName + &apos; &apos; + lastName, [firstName,
          lastName])
        </code>
        । এমনকি ৫ উপাদানের একটি অ্যারে সর্ট করতেও <code>useMemo</code> বসানো।
      </p>

      <Line name="ভুলু ভাই">
        ফাহিম! <code>useMemo</code> তো ভ্যালু ক্যাশ করে রাখে — প্রতিবার হিসাব করার চেয়ে জমিয়ে রাখা
        ভালো, তাই না? আমি সব derived ভ্যালুতেই বসিয়ে দিয়েছি।
      </Line>

      <Line name="ফাহিম">
        ভুলু ভাই! দুটো নাম জোড়া লাগাতে CPU-র লাগে প্রায় শূন্য সময়। কিন্তু হুক কল করা, ক্লোজার আর
        ডিপেন্ডেন্সি অ্যারে মেমোরিতে রাখা, আর প্রতি রেন্ডারে সেগুলো তুলনা করা — এসবের খরচ ওই হিসাবের
        চেয়ে অনেক বেশি।
      </Line>

      <Line name="নেক্সট-ভাই">
        <code>useMemo</code> কখনোই ফ্রি নয়, এর নিজস্ব overhead আছে। তাই সিদ্ধান্তটা গাণিতিক — কখন
        ইনভেস্ট করলে লাভ, আর কখন নিট লোকসান।
      </Line>

      {/* ── Architecture ──────────────────────────────────────────────── */}
      <H2 id="architecture">১. Cost vs Benefit Balance</H2>

      <Diagram>{`┌─────────────────────────────────────────────────────────────────────────┐
│                     useMemo COST VS BENEFIT BALANCE                     │
└─────────────────────────────────────────────────────────────────────────┘

 ❌ NET LOSS (trivial calculations)
 ┌───────────────────────────────────────────────────────────────────────┐
 │ calculation cost:   ~0.001ms   (string format, a + b)                 │
 │ useMemo overhead:   ~0.02ms    (hook slot + memory + deps compare)    │
 │ ───────────────────────────────────────────────────────────────────── │
 │ result: 🔴 the memo costs more than the work it caches                │
 └───────────────────────────────────────────────────────────────────────┘

───────────────────────────────────────────────────────────────────────────

 🟢 NET PROFIT (expensive work, or referential stability)
 ┌───────────────────────────────────────────────────────────────────────┐
 │ calculation cost:  ~85.00ms    (filtering 10k rows, complex regex)    │
 │ useMemo overhead:   ~0.02ms    (hook slot + memory + deps compare)    │
 │ ───────────────────────────────────────────────────────────────────── │
 │ result: 🟢 every skipped recompute saves an entire frame budget        │
 └───────────────────────────────────────────────────────────────────────┘`}</Diagram>

      {/* ── Foundations ───────────────────────────────────────────────── */}
      <H2 id="foundations">২. ৩টি মূল মেকানিজম</H2>

      <Note>
        <ul>
          <li>
            <strong>The overhead budget:</strong> প্রতিটি <code>useMemo</code>-র জন্য React একটি হুক
            স্লট রাখে, ভ্যালু ও ডিপেন্ডেন্সি অ্যারে মেমোরিতে ধরে রাখে, আর প্রতি রেন্ডারে{" "}
            <code>Object.is</code> দিয়ে প্রতিটি ডিপেন্ডেন্সি মেলায়। ছোট হিসাবের ক্ষেত্রে এই খরচই
            বড় হয়ে দাঁড়ায়।
          </li>
          <li>
            <strong>Referential stability:</strong> হিসাব ভারী না হলেও, কোনো object/array যদি{" "}
            <code>React.memo</code>-করা চাইল্ডে প্রপ হিসেবে যায় বা <code>useEffect</code>-এর
            ডিপেন্ডেন্সিতে থাকে, তবে রেফারেন্স স্থির রাখতে <code>useMemo</code> দরকার।
          </li>
          <li>
            <strong>GC pressure:</strong> অপ্রয়োজনীয় মেমোইজেশন মানে জীবিত রেফারেন্স — garbage
            collector মেমোরি ছাড়তে পারে না, ফলে মেমোরি ফুটপ্রিন্ট বাড়ে।
          </li>
        </ul>
      </Note>

      {/* ── Implementation ────────────────────────────────────────────── */}
      <H2 id="implementation">৩. তুচ্ছ হিসাব বনাম আসল ভারী কাজ</H2>

      <H3>❌ Anti-pattern — তুচ্ছ লজিকে useMemo</H3>

      <CodeBlock filename="app/_components/bad-usememo.tsx">{`'use client';

import { useMemo, useState } from 'react';

export function BadUseMemoUsage() {
  const [firstName] = useState('Zubayer');
  const [lastName] = useState('Salehin');
  const [items] = useState([1, 2, 3, 4, 5]);

  // String concatenation costs ~0.0001ms — the hook costs more
  const fullName = useMemo(() => \`\${firstName} \${lastName}\`, [firstName, lastName]);

  // Sorting five numbers is free; memoizing it is not
  const sortedItems = useMemo(() => [...items].sort((a, b) => b - a), [items]);

  return (
    <div className="p-6 bg-slate-950 text-slate-100 space-y-4">
      <h2 className="text-lg font-bold">User: {fullName}</h2>
      <p className="text-sm text-slate-400">Sorted: {sortedItems.join(', ')}</p>
    </div>
  );
}`}</CodeBlock>

      <H3>🟢 Fix — ভারী হিসাব ও রেফারেন্স স্থিরতা</H3>

      <CodeBlock filename="app/catalog/page.tsx">{`'use client';

import { memo, useMemo, useState } from 'react';

interface Product {
  id: number;
  name: string;
  category: string;
  price: number;
}

const ALL_PRODUCTS: Product[] = Array.from({ length: 10000 }, (_, i) => ({
  id: i + 1,
  name: \`Product \${i + 1}\`,
  category: i % 2 === 0 ? 'Electronics' : 'Fashion',
  price: (i * 37) % 1000,
}));

// A memoized child — it needs a stable object reference to bail out
const AnalyticsSummary = memo(function AnalyticsSummary({
  config,
}: {
  config: { total: number; avgPrice: string };
}) {
  console.log('AnalyticsSummary rendered');
  return (
    <div className="p-4 bg-slate-900 border border-slate-800 rounded-xl space-y-1">
      <p className="text-sm font-semibold text-indigo-400">Total matched: {config.total}</p>
      <p className="text-xs text-slate-400">Average price: \${config.avgPrice}</p>
    </div>
  );
});

export function OptimizedCatalogPage() {
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('All');
  const [themeColor, setThemeColor] = useState('indigo');

  // 1. Real work: filtering 10,000 rows costs actual CPU time.
  //    It re-runs only when search or category changes — never on a theme toggle.
  const filteredProducts = useMemo(() => {
    return ALL_PRODUCTS.filter((product) => {
      const matchesSearch = product.name.toLowerCase().includes(search.toLowerCase());
      const matchesCategory = category === 'All' || product.category === category;
      return matchesSearch && matchesCategory;
    });
  }, [search, category]);

  // 2. Referential stability: keeps AnalyticsSummary from re-rendering on theme changes
  const analyticsConfig = useMemo(() => {
    const total = filteredProducts.length;
    const avg =
      total > 0
        ? (filteredProducts.reduce((acc, p) => acc + p.price, 0) / total).toFixed(2)
        : '0';
    return { total, avgPrice: avg };
  }, [filteredProducts]);

  return (
    <div className="p-6 space-y-6 bg-slate-950 text-slate-100 min-h-screen">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Catalog optimizer</h1>
        <button
          onClick={() => setThemeColor((t) => (t === 'indigo' ? 'emerald' : 'indigo'))}
          className="px-3 py-1 bg-slate-800 rounded-lg text-xs"
        >
          Toggle theme ({themeColor})
        </button>
      </div>

      <div className="flex gap-4">
        <input
          type="text"
          placeholder="Search products..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="p-3 bg-slate-900 border border-slate-800 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 flex-1"
        />
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="p-3 bg-slate-900 border border-slate-800 rounded-xl text-sm"
        >
          <option value="All">All categories</option>
          <option value="Electronics">Electronics</option>
          <option value="Fashion">Fashion</option>
        </select>
      </div>

      <AnalyticsSummary config={analyticsConfig} />

      <div className="p-4 bg-slate-900 border border-slate-800 rounded-xl text-xs text-slate-400">
        {filteredProducts.length} items matched.
      </div>
    </div>
  );
}`}</CodeBlock>

      {/* ── Matrix ────────────────────────────────────────────────────── */}
      <H2 id="matrix">৪. useMemo Decision Matrix</H2>

      <Table
        head={["সিনারিও", "হিসাবের খরচ", "useMemo দেবেন?", "কারণ"]}
        rows={[
          [
            <>
              String concat / <code>a + b</code>
            </>,
            "~০.০০০১ ms",
            "না ❌",
            "হুকের ওভারহেড হিসাবের চেয়ে বড় — নিট লোকসান",
          ],
          [
            "১০০০+ আইটেম filter / sort",
            "~৫০-২০০ ms",
            "হ্যাঁ 🟢",
            "প্রতিবার স্কিপ মানে একটি পুরো ফ্রেম বাজেট বাঁচা",
          ],
          [
            <>
              <code>React.memo</code> চাইল্ডে object প্রপ
            </>,
            "নগণ্য",
            "হ্যাঁ 🟢",
            "রেফারেন্স স্থির না হলে চাইল্ডের memo ফেল করে",
          ],
          [
            "Primitive থেকে সরাসরি derived ভ্যালু",
            "~০.০০১ ms",
            "না ❌",
            "সাধারণ ভেরিয়েবলে অ্যাসাইন করুন",
          ],
        ]}
      />

      <Line name="ভুলু ভাই">
        বুঝেছি! ১ মিলিসেকেন্ডের নিচের কাজের জন্য আর মেমোরি নষ্ট করব না — শুধু ১০০০+ ডেটার ফিল্টারিং
        আর মেমোইজড চাইল্ডের প্রপ অবজেক্টেই <code>useMemo</code> রাখব।
      </Line>

      {/* ── Takeaways ─────────────────────────────────────────────────── */}
      <H2 id="takeaway">Production Takeaways</H2>

      <Note>
        <ul>
          <li>
            <strong>
              Measure with <code>console.time</code>:
            </strong>{" "}
            হিসাবটা আসলেই ভারী কি না মেপে নিন। ১ms-এর কম হলে <code>useMemo</code> দেবেন না।
          </li>
          <li>
            <strong>Default to a plain variable:</strong> সাধারণ derived ভ্যালু সরাসরি রেন্ডার
            বডিতে লিখুন — <code>const value = compute()</code>।
          </li>
          <li>
            <strong>Memoize for reference integrity:</strong> ভারী না হলেও object/array যদি{" "}
            <code>React.memo</code>, <code>useEffect</code> বা <code>useCallback</code>-এর
            ডিপেন্ডেন্সিতে যায়, তখন <code>useMemo</code> যুক্তিসঙ্গত।
          </li>
        </ul>
      </Note>
    </article>
  );
}
