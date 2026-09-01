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
      bn: "Core Web Vitals Failed",
      en: "Core Web Vitals failed",
    },
  },
  {
    id: "architecture",
    label: {
      bn: "তিনটি মেট্রিক ও তাদের থ্রেশহোল্ড",
      en: "Three metrics and their thresholds",
    },
  },
  {
    id: "mechanisms",
    label: { bn: "৩টি আর্কিটেকচারাল কনসেপ্ট", en: "Three architectural concepts" },
  },
  {
    id: "implementation",
    label: {
      bn: "LCP, CLS ও INP অপটিমাইজেশন",
      en: "Optimizing LCP, CLS and INP",
    },
  },
  {
    id: "matrix",
    label: { bn: "Web Vitals Benchmark", en: "Web Vitals benchmark" },
  },
  {
    id: "takeaway",
    label: { bn: "Production Takeaways", en: "Production takeaways" },
  },
];

export default function WebVitalsLcpClsInp() {
  return (
    <article className="doc-prose">
      {/* ── The problem ───────────────────────────────────────────────── */}
      <H2 id="the-problem" anchorOnly>
        Core Web Vitals Failed
      </H2>

      <p>
        রাত ১০:১৫। গুগল সার্চ কনসোলে মেসেজ এসেছে — <em>Core Web Vitals failed</em>! PageSpeed
        Insights-এ সাইটের স্কোর মাত্র ৩৮। লোডিংয়ে ৪ সেকেন্ড লাগছে, পেজ ওপেন হওয়ার পর ব্যানার লোড হয়ে
        নিচের কনটেন্ট লাফিয়ে নেমে যাচ্ছে, আর প্রোডাক্ট ফিল্টারে ক্লিক করলে ব্রাউজার প্রায় আধা সেকেন্ড
        হ্যাং হয়ে থাকছে।
      </p>

      <Line name="ভুলু ভাই">
        ফাহিম! আমার সাইটের ডিজাইন তো সুন্দর, সার্ভার রেসপন্সও দ্রুত। কিন্তু গুগল কেন র‍্যাংকিং ডাউন করে
        দিল? এই LCP, CLS আর INP জিনিসগুলো আসলে কী?
      </Line>

      <Line name="ফাহিম">
        ভুলু ভাই! Core Web Vitals ইউজারের রিয়েল-ওয়ার্ল্ড অভিজ্ঞতা পরিমাপ করে — <strong>LCP</strong>{" "}
        (পেজের প্রধান কনটেন্ট কত দ্রুত লোড হলো), <strong>CLS</strong> (লোড হওয়ার সময় এলিমেন্ট লাফিয়ে
        লেআউট নষ্ট করছে কিনা), আর <strong>INP</strong> (ইউজার ক্লিক করলে ব্রাউজার কত মিলিসেকেন্ডে
        ফিডব্যাক দিচ্ছে)।
      </Line>

      <Line name="নেক্সট-ভাই">
        একদম! <code>next/image</code>, <code>next/font</code>, <code>next/dynamic</code> এবং React-এর{" "}
        <code>useTransition</code> সঠিকভাবে ব্যবহার করলে এই তিনটি মেট্রিককেই গ্রিন রেঞ্জে আনা সম্ভব!
      </Line>

      {/* ── Architecture ──────────────────────────────────────────────── */}
      <H2 id="architecture">১. Core Web Vitals Measurement Flow</H2>

      <Diagram>{`┌─────────────────────────────────────────────────────────────────────────────┐
│                       CORE WEB VITALS                                       │
└─────────────────────────────────────────────────────────────────────────────┘

 [1] LCP — Largest Contentful Paint   target ≤ 2.5s  🟢
 │   how fast the main content paints (hero image / main heading)
 │   └─ fix: next/image with priority, preload critical assets
 │
 [2] CLS — Cumulative Layout Shift    target ≤ 0.1   🟢
 │   visual stability — does content jump while loading?
 │   └─ fix: reserve width/height, next/font for zero font shift
 │
 [3] INP — Interaction to Next Paint  target ≤ 200ms 🟢
 │   responsiveness — the delay between a click and the visual update
 └── fix: keep long tasks off the main thread, useTransition()`}</Diagram>

      {/* ── Mechanisms ────────────────────────────────────────────────── */}
      <H2 id="mechanisms">২. কোর আর্কিটেকচারাল কনসেপ্ট</H2>

      <p>
        <strong>LCP — loading performance:</strong> ভিউপোর্টের সবচেয়ে বড় দৃশ্যমান উপাদানটি রেন্ডার হতে
        কত সময় নিচ্ছে। মূল কারণ আন-অপটিমাইজড ভারী ইমেজ এবং render-blocking JavaScript।{" "}
        <code>next/image</code>-এ <code>priority</code> দিলে ইমেজটি lazy-load না হয়ে সবার আগে প্রি-লোড
        হয়।
      </p>

      <p>
        <strong>CLS — visual stability:</strong> পেজ লোড হওয়ার সময় কনটেন্ট হুট করে জায়গা বদলাচ্ছে কিনা
        — যেমন ইমেজ লোড হওয়ার পর টেক্সট নিচে নেমে যাওয়া। মূল কারণ ইমেজের নির্দিষ্ট মাপ না থাকা বা
        ডাইনামিক ফন্ট লোডিং; <code>next/font</code> ফন্ট লোডে কোনো শিফট ঘটায় না।
      </p>

      <p>
        <strong>INP — responsiveness:</strong> ইউজার ক্লিক বা টাইপ করার পর ব্রাউজার পরবর্তী ফ্রেম
        রেন্ডার করতে কত সময় নিচ্ছে (এটি পুরোনো FID-কে রিপ্লেস করেছে)। মূল কারণ main thread ব্লক হয়ে
        থাকা; <code>startTransition</code> দিয়ে ভারী কাজ non-blocking করলে INP ভালো হয়।
      </p>

      {/* ── Implementation ────────────────────────────────────────────── */}
      <H2 id="implementation">৩. Production Code Implementation</H2>

      <H3>❌ Anti-pattern — violating all three at once</H3>

      <CodeBlock filename="app/products/page.tsx">{`// 🔴 POOR PRACTICE: bad LCP, bad CLS and bad INP in fifteen lines
'use client';

export default function BadProductPage() {
  const handleFilter = () => {
    // ❌ INP: a synchronous 400ms block — the browser cannot paint anything
    const start = performance.now();
    while (performance.now() - start < 400) {
      // blocking loop
    }
  };

  return (
    <div>
      {/* ❌ CLS: no dimensions, so everything below jumps when it loads */}
      {/* ❌ LCP: a raw uncompressed image with no preload hint */}
      <img src="/heavy-hero.png" alt="Hero banner" />

      <button onClick={handleFilter}>Filter products</button>
    </div>
  );
}`}</CodeBlock>

      <H3>🟢 Production pattern — the Next.js primitives, used properly</H3>

      <p>
        <strong>Step 1 — রিয়েল-ইউজার মেট্রিক রিপোর্টিং।</strong>
      </p>

      <CodeBlock filename="components/web-vitals-reporter.tsx">{`// 🟢 PRODUCTION PATTERN: lab scores are a proxy — measure real users
'use client';

import { useReportWebVitals } from 'next/web-vitals';

export function WebVitalsReporter() {
  useReportWebVitals((metric) => {
    const body = JSON.stringify({
      id: metric.id,
      name: metric.name, // LCP | CLS | INP | FCP | TTFB
      value: metric.value,
      rating: metric.rating, // 'good' | 'needs-improvement' | 'poor'
      page: window.location.pathname,
    });

    // 🟢 sendBeacon survives page unload — a plain fetch would be cancelled
    if (navigator.sendBeacon) {
      navigator.sendBeacon('/api/analytics/vitals', body);
    }
  });

  return null;
}`}</CodeBlock>

      <p>
        <strong>Step 2 — LCP ও CLS অপটিমাইজড হিরো।</strong>
      </p>

      <CodeBlock filename="components/hero-banner.tsx">{`// 🟢 PRODUCTION PATTERN: fast LCP, zero CLS
import Image from 'next/image';
import { Inter } from 'next/font/google';

// 🟢 next/font self-hosts the file and reserves metrics — no font-swap shift
const inter = Inter({ subsets: ['latin'], display: 'swap' });

export default function HeroBanner() {
  return (
    <section className={\`relative w-full h-[400px] \${inter.className}\`}>
      {/* 🟢 LCP: priority preloads the image instead of lazy-loading it */}
      {/* 🟢 CLS: fill inside a sized parent reserves the space up front */}
      <Image
        src="/optimized-hero.webp"
        alt="Main promotional banner"
        fill
        priority
        sizes="(max-width: 768px) 100vw, 1200px"
        className="object-cover"
      />
      <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
        <h1 className="text-white text-4xl font-bold">Great deals today</h1>
      </div>
    </section>
  );
}`}</CodeBlock>

      <p>
        <strong>Step 3 — INP-ফ্রেন্ডলি ইন্টারঅ্যাকশন।</strong>
      </p>

      <CodeBlock filename="components/filter-list.tsx">{`// 🟢 PRODUCTION PATTERN: yield the main thread so typing stays instant
'use client';

import { useState, useTransition } from 'react';

export default function FilterList({ items }: { items: string[] }) {
  const [isPending, startTransition] = useTransition();
  const [query, setQuery] = useState('');
  const [filteredItems, setFilteredItems] = useState(items);

  const handleSearch = (value: string) => {
    // the input value is urgent — it updates immediately
    setQuery(value);

    // 🟢 the expensive list rebuild is not urgent; React can interrupt it,
    // so keystrokes never wait behind the filter
    startTransition(() => {
      setFilteredItems(
        items.filter((item) => item.toLowerCase().includes(value.toLowerCase()))
      );
    });
  };

  return (
    <div className="p-4 space-y-4">
      <input
        type="text"
        value={query}
        placeholder="Search items…"
        onChange={(e) => handleSearch(e.target.value)}
        className="border p-2 rounded w-full"
      />
      {isPending && <p className="text-sm text-gray-400">Updating list…</p>}
      <ul className="divide-y">
        {filteredItems.map((item) => (
          <li key={item} className="py-1">
            {item}
          </li>
        ))}
      </ul>
    </div>
  );
}`}</CodeBlock>

      {/* ── Matrix ────────────────────────────────────────────────────── */}
      <H2 id="matrix">৪. Core Web Vitals Benchmark</H2>

      <Table
        head={["মেট্রিক", "Good", "Poor", "মূল বটলনেক", "Next.js সমাধান"]}
        rows={[
          [
            "LCP",
            "≤ ২.৫s 🟢",
            "> ৪.০s 🔴",
            "বড় আন-অপটিমাইজড ইমেজ, স্লো TTFB",
            "next/image + priority",
          ],
          [
            "CLS",
            "≤ ০.১ 🟢",
            "> ০.২৫ 🔴",
            "সাইজ ছাড়া ইমেজ, ডাইনামিক ফন্ট",
            "next/font + reserved space",
          ],
          [
            "INP",
            "≤ ২০০ms 🟢",
            "> ৫০০ms 🔴",
            "main thread-এ ভারী সিঙ্ক্রোনাস JS",
            "useTransition + code splitting",
          ],
        ]}
      />

      <Line name="ভুলু ভাই">
        কনসেপ্ট পানির মতো পরিষ্কার ফাহিম! LCP হলো লোডিং স্পিড, CLS হলো ভিজ্যুয়াল লাফালাফি আটকানো, আর
        INP হলো ক্লিকের সাথে সাথে সাড়া দেওয়া। Next.js-এর বেস্ট প্র্যাকটিস মানলে গ্রিন স্কোর পাওয়া
        কঠিন কিছু না!
      </Line>

      {/* ── Takeaways ─────────────────────────────────────────────────── */}
      <H2 id="takeaway">Production Takeaways</H2>

      <Note>
        <ul>
          <li>
            <strong>Set priority on the LCP image:</strong> পেজ খুলতেই ভিউপোর্টে যে ইমেজটি দেখা যায়
            সেটিতে <code>priority</code> দিন — নাহলে ব্রাউজার সেটিকে lazy-load করে LCP পিছিয়ে দেবে।
            তবে একটি পেজে একটিই যথেষ্ট; সব ইমেজে দিলে উল্টো ফল হয়।
          </li>
          <li>
            <strong>Never render an image without dimensions:</strong> জায়গা সংরক্ষিত না থাকলে কনটেন্ট
            লাফিয়ে ওঠে — <code>width</code>/<code>height</code> অথবা sized parent-এর ভেতর{" "}
            <code>fill</code> ব্যবহার করুন।
          </li>
          <li>
            <strong>Measure real users, not just the lab:</strong> PageSpeed Insights একটি সিমুলেটেড
            ডিভাইসের স্কোর — <code>useReportWebVitals</code> দিয়ে আসল ইউজারের ডাটা সংগ্রহ করুন, কারণ
            গুগল র‍্যাংকিংয়ে ওটাই গোনে।
          </li>
        </ul>
      </Note>
    </article>
  );
}
