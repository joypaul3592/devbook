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
      bn: "document ঝুলছে, কনসোলে hydration এরর",
      en: "Document hanging, hydration errors in console",
    },
  },
  {
    id: "architecture",
    label: { bn: "Diagnostic Pipeline", en: "Diagnostic pipeline" },
  },
  {
    id: "steps",
    label: { bn: "ডিবাগিংয়ের ৪টি ধাপ", en: "Four debugging steps" },
  },
  {
    id: "implementation",
    label: { bn: "Hydration-safe প্যাটার্ন", en: "Hydration-safe patterns" },
  },
  {
    id: "matrix",
    label: { bn: "উপসর্গ ও সমাধান", en: "Symptoms and fixes" },
  },
  {
    id: "takeaway",
    label: { bn: "Production Takeaways", en: "Production takeaways" },
  },
];

export default function DebuggingStreamingPerformance() {
  return (
    <article className="doc-prose">
      {/* ── The problem ───────────────────────────────────────────────── */}
      <H2 id="the-problem" anchorOnly>
        document ঝুলছে, কনসোলে hydration এরর
      </H2>

      <p>
        রাত ৪:৪৫। প্রোডাকশন বিল্ডের আগে ভুলু ভাই পুরো পেজ টেস্ট করতে গিয়ে ভ্যাবাচেকা খেয়ে গেলেন।
        নেটওয়ার্ক ট্যাবে HTML রেসপন্স শুরু হয়েছে সাথে সাথেই, কিন্তু কনটেন্ট স্ট্রিম হতে গিয়ে কোথাও
        আটকে থাকছে। আর কনসোলে লাল অক্ষরে:{" "}
        <em>Hydration failed because the initial UI does not match what was rendered on the
        server</em>।
      </p>

      <Line name="ভুলু ভাই">
        ফাহিম! কোনটা সার্ভার থেকে আসতে দেরি করছে আর কোনটা ক্লায়েন্টে হাইড্রেশনে আটকাচ্ছে — বুঝতে
        মাথা ঘুরছে! নেটওয়ার্ক ট্যাবে শুধু <code>document</code> ঝুলছে, আর কনসোলে এররের বন্যা!
      </Line>

      <Line name="ফাহিম">
        ভুলু ভাই! async server components আর Suspense streaming ডিবাগ করার মানসিকতা ক্লাসিক
        client-side অ্যাপের মতো নয়! সার্ভার সাইডের bottleneck ধরতে দরকার network timing waterfall,
        আর ক্লায়েন্ট সাইডের mismatch ট্রেস করতে React DevTools Profiler।
      </Line>

      <Line name="নেক্সট-ভাই">
        ডিবাগিংয়ের ৩টি পিলার — <strong>server timing verification</strong>,{" "}
        <strong>stream chunk inspection</strong>, আর{" "}
        <strong>hydration boundary diagnostics</strong>। অনুমান ছাড়াই পিনপয়েন্ট করা যায়।
      </Line>

      {/* ── Architecture ──────────────────────────────────────────────── */}
      <H2 id="architecture">১. Streaming Debugging Workflow</H2>

      <Diagram>{`┌─────────────────────────────────────────────────────────────────────────┐
│               STREAMING PERFORMANCE DIAGNOSTIC PIPELINE                 │
└─────────────────────────────────────────────────────────────────────────┘

 [Chrome DevTools — Network tab]
 ├── 1. Response headers ──▶ check Transfer-Encoding: chunked & Content-Type: text/html
 ├── 2. Timing tab        ──▶ verify TTFB < 100ms
 └── 3. Response body     ──▶ inspect the raw HTML injection order (<template id="B:0">)

 [React DevTools — Profiler tab]
 ├── 1. Flamegraph        ──▶ identify suspended components (greyed-out boundaries)
 └── 2. Component tree    ──▶ locate the hydration error source & unmatched props`}</Diagram>

      {/* ── Steps ─────────────────────────────────────────────────────── */}
      <H2 id="steps">২. ডিবাগিংয়ের ৪টি ধাপ</H2>

      <Note>
        <ul>
          <li>
            <strong>Verify chunked transfer:</strong> Network tab-এ মূল HTML রিকোয়েস্টে (doc)
            ক্লিক করে Headers-এ <code>Transfer-Encoding: chunked</code> চেক করুন। কোনো
            proxy/CDN ডেটা বাফার করলে স্ট্রিমিং কাজ করবে না, পুরো পেজ একসাথে আটকে থাকবে।
          </li>
          <li>
            <strong>Inspect the raw payload:</strong> Network → Response ট্যাবে কাঁচা HTML দেখুন।
            প্রথম চাঙ্কে শেলের সাথে <code>&lt;template id=&quot;B:0&quot;&gt;</code> আর শেষে{" "}
            <code>&lt;script&gt;</code> ইনজেকশন দেখা গেলে বুঝবেন চাঙ্ক ফ্লাশ হচ্ছে।
          </li>
          <li>
            <strong>Track slow async components:</strong> কোন Suspense boundary কোন কোয়েরির জন্য
            আটকে আছে, তা সার্ভার কনসোল লগ আর Profiler-এর suspended state দেখে বের করুন।
          </li>
          <li>
            <strong>Fix hydration mismatches:</strong> সার্ভারের HTML আর ক্লায়েন্টের প্রথম রেন্ডারে
            পার্থক্য থাকলে (<code>Date.now()</code>, <code>Math.random()</code>,{" "}
            <code>window</code>) React পুরো বাউন্ডারি ফেলে দিয়ে ক্লায়েন্টে re-render করে — স্ট্রিমিংয়ের
            পুরো সুবিধাই নষ্ট হয়।
          </li>
        </ul>
      </Note>

      {/* ── Implementation ────────────────────────────────────────────── */}
      <H2 id="implementation">৩. Hydration-safe প্যাটার্ন</H2>

      <H3>❌ Anti-pattern — non-deterministic server markup</H3>

      <CodeBlock filename="app/dashboard/_components/bad-widget.tsx">{`export default async function BadStreamingWidget() {
  await new Promise((res) => setTimeout(res, 200));

  return (
    <div className="p-4 bg-slate-900 border border-slate-800 rounded-xl">
      <h3 className="text-white font-semibold">User Session Data</h3>

      {/* Mismatch: the server's timestamp differs from the client's on hydration */}
      <p className="text-xs text-rose-400">
        Rendered at: {new Date().toLocaleTimeString()}
      </p>

      {/* Mismatch: window is undefined on the server, so this renders 0,
          then the client renders the real width */}
      <p className="text-xs text-slate-400">
        Screen width: {typeof window !== 'undefined' ? window.innerWidth : 0}
      </p>
    </div>
  );
}`}</CodeBlock>

      <H3>🟢 Fix — browser-only values behind a client boundary</H3>

      <p>
        যে মানটি কেবল ব্রাউজারেই জানা সম্ভব, সেটি প্রথম রেন্ডারে না এঁকে{" "}
        <code>useEffect</code>-এর পরে আঁকুন। প্রথম রেন্ডার সার্ভারের HTML-এর সাথে মিলে যায়, তাই
        mismatch হয় না।
      </p>

      <CodeBlock filename="app/dashboard/_components/client-time-display.tsx">{`'use client';

import { useEffect, useState } from 'react';

export function ClientTimeDisplay() {
  // The first render matches the server exactly: null
  const [renderedAt, setRenderedAt] = useState<string | null>(null);

  // Runs only after hydration, so it can never cause a mismatch
  useEffect(() => {
    setRenderedAt(new Date().toLocaleTimeString());
  }, []);

  return (
    <span className="text-xs font-mono text-slate-400">
      {renderedAt ? \`Rendered at \${renderedAt}\` : 'Loading time...'}
    </span>
  );
}`}</CodeBlock>

      <CodeBlock filename="app/dashboard/page.tsx">{`import 'server-only';
import { Suspense } from 'react';
import { ClientTimeDisplay } from './_components/client-time-display';

// Server-side timing instrumentation for the slow resolver
async function ProfiledServerData() {
  const startTime = performance.now();

  // Simulated slow DB query
  await new Promise((res) => setTimeout(res, 1200));

  const duration = (performance.now() - startTime).toFixed(2);
  console.log(\`[RSC telemetry] ProfiledServerData resolved in \${duration}ms\`);

  return (
    <div className="p-4 bg-slate-900 border border-slate-800 rounded-xl space-y-2">
      <p className="text-sm font-semibold text-emerald-400">Server data loaded</p>
      <p className="text-xs text-slate-400 font-mono">Status: stream processed</p>
    </div>
  );
}

export default function PerformanceDebugPage() {
  return (
    <div className="max-w-xl mx-auto p-6 space-y-4">
      <h2 className="text-lg font-bold text-white">
        Hydration &amp; performance safe stream
      </h2>

      <Suspense
        fallback={<div className="h-20 bg-slate-900/50 animate-pulse rounded-xl" />}
      >
        <ProfiledServerData />
      </Suspense>

      <div className="p-3 bg-slate-950 border border-slate-800 rounded-lg">
        <ClientTimeDisplay />
      </div>
    </div>
  );
}`}</CodeBlock>

      <Note>
        <p>
          <code>suppressHydrationWarning</code> এই সমস্যার সমাধান নয় — এটি কেবল ওয়ার্নিংটি চাপা
          দেয়, mismatch-টি থেকেই যায়, আর React তখনও ওই সাব-ট্রি ক্লায়েন্টে re-render করে। এটি শুধু
          তখনই যুক্তিসঙ্গত যখন পার্থক্যটি অনিবার্য এবং এক লেভেল টেক্সটেই সীমাবদ্ধ (যেমন সার্ভার-রেন্ডার
          করা timestamp যেটি অবশ্যই দেখাতেই হবে)।
        </p>
      </Note>

      {/* ── Matrix ────────────────────────────────────────────────────── */}
      <H2 id="matrix">৪. উপসর্গ, কারণ ও সমাধান</H2>

      <Table
        head={["উপসর্গ", "সম্ভাব্য কারণ", "টুল ও সমাধান"]}
        rows={[
          [
            "সব Suspense একসাথে আটকে থাকে",
            "reverse-proxy বাফারিং, বা টপ-লেভেলে ব্লকিং await",
            <>
              Headers-এ <code>Transfer-Encoding: chunked</code> চেক করুন; Nginx-এ{" "}
              <code>proxy_buffering off;</code> সেট করুন
            </>,
          ],
          [
            "Hydration failure warning",
            "সার্ভার HTML আর ক্লায়েন্ট রেন্ডারের অমিল (date, random, window)",
            <>
              ব্রাউজার-নির্ভর মান <code>useEffect</code>-এর পরে রেন্ডার করুন
            </>,
          ],
          [
            "TTFB অনেক বেশি",
            "root layout বা un-suspended page level-এ ভারী await",
            <>
              টপ-লেভেলের <code>await</code> সরিয়ে চাইল্ড কম্পোনেন্টে নিয়ে{" "}
              <code>&lt;Suspense&gt;</code> বসান
            </>,
          ],
          [
            "Visual jitter / flicker",
            "fallback আর আসল কনটেন্টের মাপ আলাদা",
            <>
              CSS-এ reserved dimension (<code>min-h-*</code>) নিশ্চিত করুন
            </>,
          ],
        ]}
      />

      <Line name="ভুলু ভাই">
        এখন আর বিভ্রান্তি নেই! Network ট্যাবে <code>Transfer-Encoding: chunked</code> দেখে সার্ভার
        স্ট্রিমিং কনফার্ম করব, আর টাইমস্ট্যাম্পের মতো ডাইনামিক জিনিস ক্লায়েন্ট বাউন্ডারিতে রেখে
        hydration এরর সলভ করব!
      </Line>

      {/* ── Takeaways ─────────────────────────────────────────────────── */}
      <H2 id="takeaway">Production Takeaways</H2>

      <Note>
        <ul>
          <li>
            <strong>Inspect chunked headers first:</strong> স্ট্রিমিং কাজ না করলে কোড দেখার আগে
            নিশ্চিত হন রেসপন্স বডি বাফার না হয়ে chunked হিসেবে স্ট্রিম হচ্ছে।
          </li>
          <li>
            <strong>Eliminate non-deterministic server markup:</strong> সার্ভার কম্পোনেন্টে এমন
            কিছু জেনারেট করবেন না যা হাইড্রেশনের সময় বদলে যায় — timestamp, random id, বা
            ব্রাউজার-নির্ভর মাপ।
          </li>
          <li>
            <strong>Profile resolvers with performance.now():</strong> ব্যাকএন্ড স্লোনেস ধরতে সার্ভার
            কম্পোনেন্টের ফেচিং টাইমিং কনসোলে বা OpenTelemetry ট্রেসে মেজার করুন।
          </li>
        </ul>
      </Note>
    </article>
  );
}
