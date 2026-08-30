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
    label: { bn: "৮০টি প্রি-ফেচ রিকোয়েস্ট", en: "80 prefetch requests" },
  },
  {
    id: "architecture",
    label: {
      bn: "Uncontrolled বনাম intent-based prefetch",
      en: "Uncontrolled vs intent-based prefetch",
    },
  },
  {
    id: "mechanisms",
    label: { bn: "৩টি গোল্ডেন রুল", en: "Three golden rules" },
  },
  {
    id: "implementation",
    label: { bn: "SmartLink কম্পোনেন্ট", en: "The SmartLink component" },
  },
  {
    id: "matrix",
    label: { bn: "Prefetch Modes Comparison", en: "Prefetch modes comparison" },
  },
  {
    id: "takeaway",
    label: { bn: "Production Takeaways", en: "Production takeaways" },
  },
];

export default function RoutePreFetchingOptimization() {
  return (
    <article className="doc-prose">
      {/* ── The problem ───────────────────────────────────────────────── */}
      <H2 id="the-problem" anchorOnly>
        ৮০টি প্রি-ফেচ রিকোয়েস্ট
      </H2>

      <p>
        দুপুর ২:১৫। ভুলু ভাই তার ই-কমার্স অ্যাপের ৫০টি প্রোডাক্ট গ্রিড ও ফুটার সমন্বিত ক্যাটাগরি পেজ
        প্রোডাকশনে ডেপ্লয় করেছেন। কিন্তু মোবাইলে স্লো 4G দিয়ে পেজ রিফ্রেশ করে Chrome DevTools-এর
        Network ট্যাব ওপেন করতেই চোখ কপালে ওঠার জোগাড়।
      </p>

      <Line name="ভুলু ভাই">
        ফাহিম! ইউজার এখনও কোনো প্রোডাক্টে ক্লিকই করেনি, কিন্তু পেজ লোড হতেই ব্যাকগ্রাউন্ডে ৮০টির বেশি
        JS ও RSC প্যাকেট ডাউনলোডের রিকোয়েস্ট ফায়ার হয়ে পুরো নেটওয়ার্ক ব্যান্ডউইথ চোক হয়ে যাচ্ছে!
        মোবাইল ডাটা যেন পানির মতো খরচ হচ্ছে।
      </Line>

      <Line name="ফাহিম">
        ভুলু ভাই! এর কারণ Next.js-এর <code>&lt;Link&gt;</code> কম্পোনেন্টের ডিফল্ট automatic
        prefetching। ভিউপোর্টে কোনো লিঙ্ক আসার সাথে সাথেই Next.js ধরে নেয় ইউজার সেখানে ক্লিক করতে
        পারে, তাই ব্যাকগ্রাউন্ডে সেই রুটের চ্যাঙ্ক ডাউনলোড করে ফেলে। ৫০টি প্রোডাক্ট কার্ড + ৩০টি ফুটার
        লিঙ্ক = ৮০টি অনাবশ্যক প্রি-ফেচ রিকোয়েস্ট।
      </Line>

      <Line name="নেক্সট-ভাই">
        একদম! অতিরিক্ত প্রি-ফেচিংকে বলা হয় Bandwidth Bloat। সমাধান — ১. লিস্ট/গ্রিড ও ফুটারে{" "}
        <code>prefetch={"{false}"}</code> ব্যবহার করা, ২. intent-based (hover বা focus-এ) অন-ডিমান্ড
        প্রি-ফেচিং চালু করা, এবং ৩. ইউজারের Data Saver মোড বা স্লো কানেকশনে প্রি-ফেচিং সম্পূর্ণ ডিসেবল
        রাখা।
      </Line>

      {/* ── Architecture ──────────────────────────────────────────────── */}
      <H2 id="architecture">
        ১. Uncontrolled Prefetching vs. Intent-Based Smart Prefetching
      </H2>

      <Diagram>{`┌─────────────────────────────────────────────────────────────────────────┐
│     UNCONTROLLED PREFETCHING VS. INTENT-BASED SMART PREFETCHING         │
└─────────────────────────────────────────────────────────────────────────┘

 ❌ UNCONTROLLED DEFAULT PREFETCHING (bandwidth bloat)
 User enters a page with 50 product cards + 30 footer links in the viewport
 ┌───────────────────────────────────────────────────────────────────────┐
 │ the viewport observer triggers auto-prefetch for ALL 80 links         │
 └──────────────────────────────────┬────────────────────────────────────┘
                                    │
                                    ▼
 🔴 80+ concurrent requests | high server load | drained mobile data

───────────────────────────────────────────────────────────────────────────

 🟢 INTENT-BASED SMART PREFETCHING (zero bandwidth bloat)
 Page renders with prefetch={false} plus hover guards
 ┌───────────────────────────────────────────────────────────────────────┐
 │ initial load: ZERO prefetch requests — bandwidth stays free           │
 └──────────────────────────────────┬────────────────────────────────────┘
                                    │ user hovers over product #12
                                    ▼
 ┌───────────────────────────────────────────────────────────────────────┐
 │ router.prefetch('/products/12') fires for the intended route ONLY     │
 └───────────────────────────────────────────────────────────────────────┘
                                    ▼
                 🟢 ~98% REDUCTION IN PREFETCH NETWORK CALLS`}</Diagram>

      {/* ── Mechanisms ────────────────────────────────────────────────── */}
      <H2 id="mechanisms">২. Route Pre-fetching অপটিমাইজেশনের ৩টি গোল্ডেন রুল</H2>

      <p>
        <strong>App Router-এর prefetch behaviour বোঝা:</strong> <code>prefetch={"{true}"}</code> রুটের
        স্ট্যাটিক লেআউট এবং ডাইনামিক RSC ডাটা — সবকিছুই ফুল প্রি-ফেচ করে;{" "}
        <code>prefetch={"{null}"}</code> (ডিফল্ট) শুধুমাত্র স্ট্যাটিক শেল চ্যাঙ্ক প্রি-ফেচ করে (ডাইনামিক
        রুটের ক্ষেত্রে ৩০ সেকেন্ড পর্যন্ত ক্যাশে থাকে); আর <code>prefetch={"{false}"}</code> ভিউপোর্টে
        আসার পরও কোনো স্বয়ংক্রিয় প্রি-ফেচিং করে না।
      </p>

      <p>
        <strong>Intent-driven / on-hover prefetching:</strong> ইউজার যখন কার্ডের ওপর মাউস হভার করবে (
        <code>onMouseEnter</code>) বা কিবোর্ড ফোকাস আনবে (<code>onFocus</code>), কেবল তখনই ডাইনামিকালি{" "}
        <code>router.prefetch(href)</code> কল করে ইনস্ট্যান্ট নেভিগেশন নিশ্চিত করা।
      </p>

      <p>
        <strong>Network-aware conditional prefetching:</strong> ইউজার যদি মোবাইলের Data Saver মোড চালু
        রাখে (<code>navigator.connection.saveData</code>) অথবা 2G/3G স্লো কানেকশনে থাকে, তবে সব
        প্রি-ফেচিং অটোমেটিক বন্ধ রাখা।
      </p>

      {/* ── Implementation ────────────────────────────────────────────── */}
      <H2 id="implementation">৩. Production Code Implementation</H2>

      <H3>❌ Anti-pattern — uncontrolled prefetching in dense lists</H3>

      <CodeBlock filename="app/products/legacy-grid.tsx">{`// 🔴 POOR PRACTICE: auto-prefetching across hundreds of product links
import Link from 'next/link';

export function UnoptimizedProductGrid({
  products,
}: {
  products: Array<{ id: string; title: string }>;
}) {
  return (
    <div className="grid grid-cols-4 gap-4">
      {products.map((product) => (
        // 🔴 anti-pattern: the default prefetch fires 50+ requests as the user scrolls
        <Link
          key={product.id}
          href={\`/products/\${product.id}\`}
          className="p-4 bg-slate-900 border rounded"
        >
          <h3>{product.title}</h3>
        </Link>
      ))}
    </div>
  );
}`}</CodeBlock>

      <H3>🟢 Production pattern — an intent-based SmartLink</H3>

      <CodeBlock filename="components/SmartLink.tsx">{`// 🟢 STEP 1: a reusable smart link with hover intent and a data-saver check
'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState, type ComponentProps, type ReactNode } from 'react';

interface SmartLinkProps extends ComponentProps<typeof Link> {
  children: ReactNode;
  enableHoverPrefetch?: boolean;
}

export function SmartLink({
  href,
  children,
  enableHoverPrefetch = true,
  ...props
}: SmartLinkProps) {
  const router = useRouter();
  const [isPrefetched, setIsPrefetched] = useState(false);

  const handleIntent = () => {
    if (!enableHoverPrefetch || isPrefetched) return;

    // 🟢 STEP 2: skip prefetching on a slow network or in Data Saver mode
    if (typeof window !== 'undefined' && 'connection' in navigator) {
      const conn = (
        navigator as unknown as {
          connection?: { saveData?: boolean; effectiveType?: string };
        }
      ).connection;

      if (conn?.saveData || conn?.effectiveType === '2g' || conn?.effectiveType === 'slow-2g') {
        return;
      }
    }

    // 🟢 STEP 3: trigger the on-demand prefetch ONLY when the user shows intent
    if (typeof href === 'string') {
      router.prefetch(href);
      setIsPrefetched(true);
    }
  };

  return (
    <Link
      href={href}
      prefetch={false} // 🟢 disable automatic viewport prefetching to save bandwidth
      onMouseEnter={handleIntent}
      onFocus={handleIntent}
      {...props}
    >
      {children}
    </Link>
  );
}`}</CodeBlock>

      <CodeBlock filename="app/products/page.tsx">{`// 🟢 STEP 4: safe integration in dense lists and footers
import { SmartLink } from '@/components/SmartLink';

interface Product {
  id: string;
  name: string;
  price: string;
}

export default async function ProductCatalogPage() {
  const products: Product[] = Array.from({ length: 40 }, (_, i) => ({
    id: \`\${i + 1}\`,
    name: \`Enterprise Server Rack Part #\${i + 1}\`,
    price: \`$\${(i + 1) * 49}\`,
  }));

  return (
    <div className="p-8 max-w-6xl mx-auto space-y-8 bg-slate-950 text-slate-100 min-h-screen">
      <div className="space-y-1">
        <h1 className="text-2xl font-bold">Bandwidth-optimized Product Catalog</h1>
        <p className="text-sm text-slate-400">
          Smart hover-intent prefetching eliminates network bloat.
        </p>
      </div>

      {/* 🟢 40 links rendered with zero initial prefetch overhead */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
        {products.map((product) => (
          <div
            key={product.id}
            className="p-4 bg-slate-900 border border-slate-800 rounded-xl flex flex-col justify-between hover:border-slate-700 transition"
          >
            <div>
              <span className="text-xs font-mono text-indigo-400">ID: {product.id}</span>
              <h3 className="font-semibold text-sm text-slate-200 mt-1">{product.name}</h3>
            </div>

            <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between">
              <span className="text-xs font-bold text-emerald-400">{product.price}</span>

              {/* 🟢 intent-based prefetch active */}
              <SmartLink
                href={\`/products/\${product.id}\`}
                className="text-xs font-medium bg-slate-800 hover:bg-slate-700 px-3 py-1.5 rounded-lg text-slate-200 transition"
              >
                View details
              </SmartLink>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}`}</CodeBlock>

      {/* ── Matrix ────────────────────────────────────────────────────── */}
      <H2 id="matrix">৪. Prefetch Modes Comparison Matrix</H2>

      <Table
        head={["প্রি-ফেচ অপশন", "ব্যবহারের ক্ষেত্র", "নেটওয়ার্ক ওভারহেড", "নেভিগেশন স্পিড"]}
        rows={[
          [
            <code key="c">prefetch={"{false}"}</code>,
            "বড় টেবিল, প্রোডাক্ট গ্রিড, ফুটার লিঙ্ক, মেগা-মেনু",
            "সবচেয়ে কম (zero overhead) 🟢",
            "ক্লিকে সামান্য পেন্ডিং (হভার ছাড়া)",
          ],
          [
            <span key="c">
              Hover intent (<code>router.prefetch()</code>)
            </span>,
            "ই-কমার্স কার্ড, সার্চ রেজাল্ট, আর্টিকেল লিস্ট",
            "অত্যন্ত নিয়ন্ত্রিত 🟢",
            "প্রায় তাৎক্ষণিক (~৫০-১০০ms) ⚡",
          ],
          [
            <code key="c">prefetch={"{null}"}</code>,
            "স্বাভাবিক ৩-৫টি প্রাইমারি নেভিগেশন লিঙ্ক",
            "মাঝারি",
            "চমৎকার ⚡",
          ],
          [
            <code key="c">prefetch={"{true}"}</code>,
            "ক্রিটিক্যাল Checkout বা Dashboard CTA",
            "উচ্চ",
            "তাৎক্ষণিক ⚡",
          ],
        ]}
      />

      <Line name="ভুলু ভাই">
        অসাধারণ ফাহিম! <code>SmartLink</code> উইজেট বানানোর পর পেজ লোডের সময় ব্যাকগ্রাউন্ডের ৮০টি
        রিকোয়েস্ট একঝটকায় ০-তে নেমে এলো! এখন কেবল ইউজার কার্সার নিলে তখনই স্পেসিফিক পেজ প্রি-ফেচ হচ্ছে।
      </Line>

      {/* ── Takeaways ─────────────────────────────────────────────────── */}
      <H2 id="takeaway">Production Takeaways</H2>

      <Note>
        <ul>
          <li>
            <strong>Never use the default &lt;Link&gt; in big loops:</strong> ৫০টির বেশি লিঙ্ক আছে এমন
            কোনো ম্যাপিং লিস্টে (সার্চ রেজাল্ট বা ফুটার) ডিফল্ট প্রি-ফেচ চালু রাখবেন না — সবসময়{" "}
            <code>prefetch={"{false}"}</code> সেট করুন।
          </li>
          <li>
            <strong>Leverage the hover-intent pattern:</strong> মাউস কার্সার কোনো বাটনে ক্লিক করার আগে
            গড়ে ৫০-২০০ মিলিসেকেন্ড হভার করে — এই সময়টুকু <code>router.prefetch()</code> ফায়ার করার
            জন্য যথেষ্ট।
          </li>
          <li>
            <strong>Respect navigator.connection.saveData:</strong> ইউজারের ডাটা সেভিং প্রেফারেন্স ও
            নেটওয়ার্ক স্পিড রেসপেক্ট করা সিনিয়র ডেভেলপারের অন্যতম বড় চিহ্ন।
          </li>
        </ul>
      </Note>
    </article>
  );
}
