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
    label: { bn: "ল্যাবে সবুজ, ফিল্ডে লাল", en: "Green in the lab, red in the field" },
  },
  {
    id: "architecture",
    label: { bn: "Core Web Vitals বেঞ্চমার্ক", en: "The Core Web Vitals benchmark" },
  },
  {
    id: "mechanisms",
    label: { bn: "ডিবাগিং মেকানিক্স", en: "Debugging mechanics" },
  },
  {
    id: "implementation",
    label: { bn: "RUM ও INP অপটিমাইজেশন", en: "RUM & INP optimization" },
  },
  {
    id: "matrix",
    label: { bn: "Debugging Toolkit", en: "Debugging toolkit" },
  },
  {
    id: "takeaway",
    label: { bn: "Production Takeaways", en: "Production takeaways" },
  },
];

export default function CoreWebVitalsPerformanceDebugging() {
  return (
    <article className="doc-prose">
      {/* ── The problem ───────────────────────────────────────────────── */}
      <H2 id="the-problem" anchorOnly>
        ল্যাবে সবুজ, ফিল্ডে লাল
      </H2>

      <p>
        রাত ৮:১৫। চ্যাপ্টারের শেষ ক্লাসে ভুলু ভাই ও ফাহিম গম্ভীর হয়ে বসে আছেন — গুগল FID বাদ দিয়ে চালু
        করেছে নতুন মেট্রিক INP (Interaction to Next Paint)। ভুলু ভাই দেখছেন, লোকাল কম্পিউটারে সাইট
        ফাস্ট দেখালেও রিয়েল ইউজারের মোবাইল ডিভাইসে ইনপুট রেসপন্সে ৩-৪ সেকেন্ড লেটেন্সি।
      </p>

      <Line name="ভুলু ভাই">
        ফাহিম! আমার নিজের কম্পিউটারে Lighthouse স্কোর ৯৫ দেখাচ্ছে! কিন্তু Search Console-এর রিয়েল
        ইউজার ডেটায় (CrUX) কেন INP আর LCP রেড অ্যালার্ট দিচ্ছে? লোকাল টেস্ট বনাম রিয়েল ইউজারের এই অমিল
        কীভাবে ট্র্যাক ও ডিবাগ করব?
      </Line>

      <Line name="ফাহিম">
        ভুলু ভাই! আপনার হাই-এন্ড ল্যাপটপের প্রসেসিং পাওয়ার আর 3G নেটওয়ার্কে কমদামি স্মার্টফোন ব্যবহার
        করা রিয়েল ইউজারের অভিজ্ঞতা এক নয়। Core Web Vitals মূলত ৩টি ফিল্ড মেট্রিক দিয়ে আপনার সাইটকে
        বিচার করে — LCP (loading), INP (interactivity), CLS (visual stability)।
      </Line>

      <Line name="নেক্সট-ভাই">
        একদম! আর Next.js-এ এই সমস্যাগুলো রিয়েল-টাইমে মনিটর (Real User Monitoring — RUM) করার জন্য আছে
        ইন-বিল্ট <code>useReportWebVitals</code> হুক। এটি দিয়ে আসল ইউজারদের প্রতিটি মেজারমেন্ট সরাসরি
        আপনার অ্যানালিটিক্স ড্যাশবোর্ডে পাঠাতে পারবেন এবং চিহ্নিত করতে পারবেন ঠিক কোন এলিমেন্ট বা
        ফাংশন সাইটকে স্লো করছে।
      </Line>

      {/* ── Architecture ──────────────────────────────────────────────── */}
      <H2 id="architecture">১. Core Web Vitals Standard &amp; Debugging Architecture</H2>

      <Diagram>{`┌─────────────────────────────────────────────────────────────────────────┐
│                    CORE WEB VITALS BENCHMARK MATRIX                     │
└─────────────────────────────────────────────────────────────────────────┘

 1. LCP (Largest Contentful Paint) — loading performance
 ├── good: ≤ 2.5s 🟢  ├── needs improvement: 2.5s – 4.0s 🟡  └── poor: > 4.0s 🔴
 └── main causes: heavy unoptimized hero images, render-blocking JS/CSS

 2. INP (Interaction to Next Paint) — interactivity / responsiveness
 ├── good: ≤ 200ms 🟢 ├── needs improvement: 200 – 500ms 🟡  └── poor: > 500ms 🔴
 └── main causes: long tasks (>50ms) blocking the main thread on clicks/taps

 3. CLS (Cumulative Layout Shift) — visual stability
 ├── good: ≤ 0.1 🟢   ├── needs improvement: 0.1 – 0.25 🟡   └── poor: > 0.25 🔴
 └── main causes: images without dimensions, unoptimized custom fonts`}</Diagram>

      {/* ── Mechanisms ────────────────────────────────────────────────── */}
      <H2 id="mechanisms">২. Core Web Vitals ডিবাগিং ও মেজারমেন্ট মেকানিক্স</H2>

      <p>
        <strong>Synthetic testing vs real user monitoring:</strong> Lighthouse ও PageSpeed Insights
        হলো ল্যাব সিমুলেশন; আর CrUX এবং <code>useReportWebVitals</code> দিয়ে আসল ইউজারের ফিল্ড ডেটা
        সংগ্রহ করা হয়। র‍্যাঙ্কিং নির্ধারিত হয় ফিল্ড ডেটা দিয়ে।
      </p>

      <p>
        <strong>Long tasks &amp; INP debugging:</strong> মেইন থ্রেডে ৫০ মিলিসেকেন্ডের বেশি সময় নেওয়া
        যেকোনো কাজকে long task বলে। <code>PerformanceObserver</code> API দিয়ে ডিবাগ করা যায় কোন
        হ্যান্ডলার (যেমন সার্চ ফিল্টারিং) মেইন থ্রেড ব্লক করছে।
      </p>

      <p>
        <strong>Attribution &amp; element identification:</strong> মেট্রিকের মান জানাই যথেষ্ট নয় — ঠিক
        কোন DOM নোডটি LCP বা CLS-এর জন্য দায়ী, তা শনাক্ত করতে attribution ডেটা প্রসেস করতে হয়।
      </p>

      {/* ── Implementation ────────────────────────────────────────────── */}
      <H2 id="implementation">৩. Production Code Implementation</H2>

      <H3>❌ Anti-pattern — trusting only the local Lighthouse run</H3>

      <CodeBlock filename="app/_components/UnoptimizedMonitoring.tsx">{`// 🔴 POOR PRACTICE: ignoring field data and real user metrics
// A green Lighthouse score on localhost says nothing about a 3G phone in the field.
export function UnoptimizedMonitoring() {
  // no web-vitals tracking, no RUM endpoint, no attribution data
  return <p>Site seems fast on my laptop!</p>;
}`}</CodeBlock>

      <H3>🟢 Production pattern — real-user tracking and INP debugging</H3>

      <CodeBlock filename="app/_components/WebVitalsReporter.tsx">{`// 🟢 STEP 1: a centralized web vitals reporter
'use client';

import { useReportWebVitals } from 'next/web-vitals';

export function WebVitalsReporter() {
  useReportWebVitals((metric) => {
    // 🟢 log the core metrics while developing
    if (process.env.NODE_ENV === 'development') {
      console.log(\`[web vitals] \${metric.name}\`, {
        value: metric.value,
        rating: metric.rating, // 'good' | 'needs-improvement' | 'poor'
        delta: metric.delta,
        id: metric.id,
      });
    }

    // 🟢 STEP 2: send the RUM payload to your analytics backend
    const body = JSON.stringify({
      href: window.location.href,
      name: metric.name,   // 'LCP' | 'INP' | 'CLS' | 'FCP' | 'TTFB'
      value: metric.value, // e.g. 180.4 (ms)
      rating: metric.rating,
      id: metric.id,
    });

    // sendBeacon delivers without blocking, even if the user closes the tab
    if (navigator.sendBeacon) {
      navigator.sendBeacon('/api/analytics/vitals', body);
    } else {
      fetch('/api/analytics/vitals', {
        body,
        method: 'POST',
        keepalive: true,
        headers: { 'Content-Type': 'application/json' },
      });
    }
  });

  return null;
}`}</CodeBlock>

      <CodeBlock filename="app/layout.tsx">{`// 🟢 STEP 3: attach the reporter to the root layout
import { WebVitalsReporter } from './_components/WebVitalsReporter';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="bn">
      <body>
        {/* 🟢 real-user web vitals monitoring, running in the background */}
        <WebVitalsReporter />
        {children}
      </body>
    </html>
  );
}`}</CodeBlock>

      <CodeBlock filename="lib/utils/performance.ts">{`// 🟢 STEP 4: keep INP ≤ 200ms by breaking long tasks apart

interface SchedulerWithYield {
  yield?: () => Promise<void>;
}

export async function yieldToMainThread(): Promise<void> {
  const scheduler = (globalThis as { scheduler?: SchedulerWithYield }).scheduler;

  if (scheduler?.yield) {
    return scheduler.yield();
  }

  return new Promise((resolve) => setTimeout(resolve, 0));
}

// 🟢 usage inside a heavy click handler
export async function handleHeavyFilterOperation<T>(largeDataSet: T[]): Promise<T[]> {
  // portion 1: immediate UI feedback (e.g. show a spinner)
  console.log('processing started...');

  // 🟢 hand control back to the browser so the paint happens right away
  await yieldToMainThread();

  // portion 2: the heavy computation, split safely
  return largeDataSet.map((item) => item);
}`}</CodeBlock>

      <p>
        <strong>নোট:</strong> <code>useReportWebVitals</code> হুকটি <code>next/web-vitals</code>{" "}
        থেকে আসে (<code>next/navigation</code> থেকে নয়) — App Router-এ এটি অবশ্যই একটি{" "}
        <code>&apos;use client&apos;</code> কম্পোনেন্টে ব্যবহার করতে হয়।
      </p>

      {/* ── Matrix ────────────────────────────────────────────────────── */}
      <H2 id="matrix">৪. Core Web Vitals Debugging Toolkit &amp; Actions</H2>

      <Table
        head={["মেট্রিক", "লক্ষ্যমাত্রা", "ডিবাগিং টুল", "সমাধান"]}
        rows={[
          [
            "LCP",
            "≤ ২.৫s",
            "Performance panel (timings), WebPageTest",
            <span key="d">
              <code>&lt;Image priority /&gt;</code>, <code>preconnect</code>, ফাস্ট CDN
            </span>,
          ],
          [
            "INP",
            "≤ ২০০ms",
            "DevTools long tasks, Web Vitals extension",
            <span key="d">
              code splitting, debouncing, <code>scheduler.yield()</code>
            </span>,
          ],
          [
            "CLS",
            "≤ ০.১",
            "Layout shift regions overlay (DevTools)",
            <span key="d">
              aspect ratio দিয়ে জায়গা রিজার্ভ, <code>next/font</code> +{" "}
              <code>display: &apos;swap&apos;</code>
            </span>,
          ],
        ]}
      />

      <Line name="ভুলু ভাই">
        অসাধারণ ফাহিম! <code>useReportWebVitals</code> সেটআপ করে আর <code>sendBeacon</code> দিয়ে রিয়েল
        ইউজারদের ডেটা ট্র্যাক করে আমরা দেখতে পেলাম ঠিক কোথায় ফিল্টার বাটনে ইনপুট ল্যাগ হচ্ছিল!{" "}
        <code>yieldToMainThread</code> অ্যাপ্লাই করার পর INP ৪০০ms থেকে কমে ৮০ms-এ চলে এসেছে।
      </Line>

      {/* ── Takeaways ─────────────────────────────────────────────────── */}
      <H2 id="takeaway">Production Takeaways</H2>

      <Note>
        <ul>
          <li>
            <strong>Focus on INP, not FID:</strong> ২০২৪ সালের মার্চ থেকে INP-ই অফিশিয়াল Core Web
            Vitals মেট্রিক। ক্লিক বা টাইপিংয়ে ২০০ মিলিসেকেন্ডের বেশি ফ্রিজ হলে র‍্যাঙ্কিংয়ে প্রভাব পড়ে।
          </li>
          <li>
            <strong>Leverage navigator.sendBeacon for RUM:</strong> মেট্রিক পাঠাতে সাধারণ{" "}
            <code>fetch</code>-এর বদলে <code>sendBeacon</code> ব্যবহার করুন — ইউজার হঠাৎ পেজ ক্লোজ
            করলেও ডেটা হারায় না, মেইন থ্রেডেও ল্যাগ হয় না।
          </li>
          <li>
            <strong>Use the DevTools Performance panel:</strong> রেকর্ড চালিয়ে &quot;long
            tasks&quot; (লাল ট্রায়াঙ্গেল) খুঁজে বের করে ভারী JavaScript রিফ্যাক্টর বা চ্যাঙ্ক করুন।
          </li>
        </ul>
      </Note>
    </article>
  );
}
