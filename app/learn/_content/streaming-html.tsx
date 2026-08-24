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
      bn: "রিকোয়েস্ট পেন্ডিং, তবু পেজ রেন্ডার হচ্ছে",
      en: "Request still pending, page already painting",
    },
  },
  {
    id: "architecture",
    label: { bn: "Streaming Engine আর্কিটেকচার", en: "Streaming engine architecture" },
  },
  {
    id: "mechanics",
    label: { bn: "৩টি আন্ডার-দ্য-হুড মেকানিজম", en: "Three under-the-hood mechanisms" },
  },
  {
    id: "implementation",
    label: { bn: "Blocking বনাম Streaming রুট", en: "Blocking vs streaming route" },
  },
  {
    id: "wire",
    label: { bn: "নেটওয়ার্কে আসল পেলোড", en: "The actual wire payload" },
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

export default function StreamingHtml() {
  return (
    <article className="doc-prose">
      {/* ── The problem ───────────────────────────────────────────────── */}
      <H2 id="the-problem" anchorOnly>
        রিকোয়েস্ট পেন্ডিং, তবু পেজ রেন্ডার হচ্ছে
      </H2>

      <p>
        রাত ১:৪৫। ভুলু ভাই DevTools-এর Network Tab খুলে হা করে তাকিয়ে আছেন। সাধারণত SSR
        রিকোয়েস্টে পুরো HTML একবারে ডাউনলোড হয়। কিন্তু এখানে রিকোয়েস্ট Status এখনও{" "}
        <code>200 OK</code> হয়ে পেন্ডিং ঝুলে আছে, অথচ ব্রাউজার অলরেডি অর্ধেক পেজ রেন্ডার করে
        ফেলেছে! Response Header-এ লেখা: <code>Transfer-Encoding: chunked</code>।
      </p>

      <Line name="ভুলু ভাই">
        ফাহিম! HTTP রিকোয়েস্ট এখনও শেষই হলো না, অথচ ব্রাউজার অর্ধেক HTML কীভাবে রেন্ডার করল? আর
        রেসপন্সের নিচে এসব অদ্ভুত ইনলাইন <code>&lt;script&gt;</code> আর{" "}
        <code>&lt;template&gt;</code> ট্যাগ কী করছে?
      </Line>

      <Line name="ফাহিম">
        ভুলু ভাই! এটাই <strong>Streaming HTML</strong>-এর আসল ম্যাজিক! ট্র্যাডিশনাল SSR-এ সার্ভার
        পুরো পেজের ডেটা তৈরি না হওয়া পর্যন্ত ১ বাইটও পাঠাত না। App Router-এ সার্ভার HTML-কে ছোট
        ছোট chunk-এ ভাগ করে স্ট্রিম করতে থাকে।
      </Line>

      <Line name="নেক্সট-ভাই">
        একদম! এটি <strong>out-of-order HTML delivery</strong> নামের একটি ট্রিক ব্যবহার করে। সার্ভার
        প্রথমে fast content-এর chunk পাঠায়; পরে স্লো async ডেটা রেজলভ হলে একটি লুকানো{" "}
        <code>&lt;template&gt;</code> আর ছোট্ট ইনলাইন স্ক্রিপ্ট পাঠায়, যা আগের স্কেলিটনকে রিয়েল
        কনটেন্ট দিয়ে রিপ্লেস করে দেয়।
      </Line>

      {/* ── Architecture ──────────────────────────────────────────────── */}
      <H2 id="architecture">১. Streaming Engine আর্কিটেকচার</H2>

      <Diagram>{`┌─────────────────────────────────────────────────────────────────────────┐
│                    UNDER-THE-HOOD HTML STREAMING FLOW                   │
└─────────────────────────────────────────────────────────────────────────┘

 SERVER (Node.js / Edge runtime)                 BROWSER (DOM engine)
         │                                               │
 1. Flushes the initial HTML shell chunk ────────────────┼──▶ parses & paints navigation
    (header, CSS, Suspense fallbacks)                    │    plus skeletons — instant FCP
         │                                               │
 2. Async DB query resolves (e.g. after 2s)              │
         │                                               │
 3. Streams the payload chunk:                           │
    - hidden HTML content (<template id="B:0">)          │
    - inline script call  ($RC("B:0", "S:0")) ───────────┼──▶ executes the inline script:
                                                         │    swaps the skeleton for real HTML`}</Diagram>

      {/* ── Mechanics ─────────────────────────────────────────────────── */}
      <H2 id="mechanics">২. ৩টি আন্ডার-দ্য-হুড মেকানিজম</H2>

      <Note>
        <ul>
          <li>
            <strong>Transfer-Encoding: chunked:</strong> ট্র্যাডিশনাল রেসপন্সে{" "}
            <code>Content-Length</code> আগেই নির্দিষ্ট করতে হয়। স্ট্রিমিংয়ে হেডার যায়{" "}
            <code>Transfer-Encoding: chunked</code> হিসেবে — সংযোগ খোলা থাকে, আর সার্ভার পুরো পেজ
            মেমরিতে ধরে না রেখে ডেটা প্রস্তুত হওয়ামাত্র chunk আকারে ফ্লাশ করে।
          </li>
          <li>
            <strong>Out-of-order delivery:</strong> ডকুমেন্টে যা নিচে আছে তা পরে রেন্ডার হতেই হবে
            — এমন বাধ্যবাধকতা নেই। React স্লো কম্পোনেন্টের HTML তৈরি করে একটি লুকানো{" "}
            <code>&lt;template&gt;</code>-এর ভেতর পুরে পাঠিয়ে দেয়।
          </li>
          <li>
            <strong>Automated DOM replacement:</strong> লুকানো চাঙ্কের সাথেই এক লাইনের মিনিফাইড
            ইনলাইন স্ক্রিপ্ট যায় (<code>$RC(&quot;B:0&quot;, &quot;S:0&quot;)</code>)। পার্সার ওই
            লাইনে পৌঁছানো মাত্র স্ক্রিপ্টটি চলে এবং স্কেলিটন নোডটি আসল কনটেন্ট দিয়ে রিপ্লেস হয়ে যায়
            — কোনো re-hydration ছাড়াই।
          </li>
        </ul>
      </Note>

      {/* ── Implementation ────────────────────────────────────────────── */}
      <H2 id="implementation">৩. Blocking বনাম Streaming রুট</H2>

      <H3>❌ Anti-pattern — monolithic blocking SSR</H3>

      <CodeBlock filename="app/dashboard/page.tsx">{`// The app waits for ALL data before sending ANY byte.
// TTFB is badly degraded — 3000ms before the first pixel.

export default async function MonolithicPage() {
  // The server blocks right here for 3 seconds
  const heavyData = await fetch('https://api.example.com/analytics', {
    cache: 'no-store',
  }).then((r) => r.json());

  return (
    <div>
      {/* The user stares at a blank screen for those 3 seconds */}
      <h1>Dashboard Header</h1>
      <div>{heavyData.stats}</div>
    </div>
  );
}`}</CodeBlock>

      <H3>🟢 Fix — native Suspense streaming</H3>

      <CodeBlock filename="app/analytics/page.tsx">{`import { Suspense } from 'react';

async function SlowAnalytics() {
  const data = await new Promise<{ totalUsers: number }>((resolve) =>
    setTimeout(() => resolve({ totalUsers: 8420 }), 2500)
  );

  return (
    <div className="p-4 bg-emerald-500/10 border border-emerald-500/30 rounded-xl">
      <p className="text-xs text-emerald-400 font-mono">Realtime users</p>
      <p className="text-2xl font-bold text-emerald-300">{data.totalUsers}</p>
    </div>
  );
}

export default function StreamingPage() {
  return (
    <div className="max-w-xl mx-auto py-10 px-6 space-y-6 bg-slate-950 text-slate-100">
      {/* CHUNK 1: instant streamed HTML shell (TTFB ~15ms) */}
      <div className="border-b border-slate-800 pb-3">
        <h1 className="text-xl font-bold">Performance Analytics</h1>
        <p className="text-xs text-slate-400">
          Streaming HTML chunks directly from the server
        </p>
      </div>

      {/* CHUNK 2: the streamed fallback skeleton */}
      <Suspense
        fallback={
          <div className="p-4 bg-slate-900 border border-slate-800 rounded-xl animate-pulse space-y-2">
            <div className="h-3 w-1/4 bg-slate-800 rounded" />
            <div className="h-7 w-1/2 bg-slate-800 rounded" />
          </div>
        }
      >
        {/* CHUNK 3: out-of-order deferred HTML */}
        <SlowAnalytics />
      </Suspense>
    </div>
  );
}`}</CodeBlock>

      {/* ── Wire ──────────────────────────────────────────────────────── */}
      <H2 id="wire">৪. নেটওয়ার্কে আসল পেলোড</H2>

      <p>রেসপন্স স্ট্রিম হওয়ার সময় ব্রাউজারে যে মার্কআপ পৌঁছায়:</p>

      <CodeBlock label="HTML" filename="response-stream.html">{`<!-- Initial flush (immediate chunk) -->
<div class="max-w-xl mx-auto py-10...">
  <h1>Performance Analytics</h1>

  <!-- Suspense boundary placeholder slot -->
  <!--$?-->
  <template id="B:0"></template>
  <div class="animate-pulse...">Loading...</div>
  <!--/$-->
</div>

<!-- Deferred chunk, flushed 2.5s later over the SAME open HTTP stream -->
<div hidden id="S:0">
  <div class="p-4 bg-emerald-500/10...">Realtime users: 8420</div>
</div>
<script>
  // React helper: replaces placeholder B:0 with the content of S:0
  $RC("B:0", "S:0");
</script>`}</CodeBlock>

      {/* ── Matrix ────────────────────────────────────────────────────── */}
      <H2 id="matrix">৫. Traditional SSR বনাম Streaming HTML</H2>

      <Table
        head={["মেট্রিক", "Traditional monolithic SSR", "Next.js streaming HTML"]}
        rows={[
          [
            "TTFB",
            "অত্যন্ত ধীর — সব ডেটা ফেচ হওয়া পর্যন্ত অপেক্ষা",
            "আল্ট্রা-ফাস্ট — ১৫–৫০ms-এর মধ্যে ফ্লাশ",
          ],
          [
            "FCP",
            "স্লো — ইউজার ৩–৫ সেকেন্ড ফাঁকা স্ক্রিন দেখে",
            "ইনস্ট্যান্ট — static shell সাথে সাথে দেখায়",
          ],
          [
            "Server memory",
            "বেশি — পুরো পেজ মেমরিতে জমে থাকে",
            "কম — তৈরি হওয়া মাত্র স্ট্রিম হয়ে যায়",
          ],
          [
            "Hydration",
            "পুরো পেজ একত্রে হাইড্রেট করতে হয়",
            "progressive ও selective hydration",
          ],
        ]}
      />

      <Line name="ভুলু ভাই">
        অসাধারণ! এখন পানির মতো পরিষ্কার! <code>Transfer-Encoding: chunked</code> দিয়ে সার্ভার
        কানেকশন খোলা রাখে আর টুকরো টুকরো HTML পাঠায়, আর ইনলাইন স্ক্রিপ্ট দিয়ে স্কেলিটন সরিয়ে আসল
        ডেটা বসিয়ে দেয়!
      </Line>

      {/* ── Takeaways ─────────────────────────────────────────────────── */}
      <H2 id="takeaway">Production Takeaways</H2>

      <Note>
        <ul>
          <li>
            <strong>Leverage HTTP/2 &amp; edge:</strong> স্ট্রিমিং সবচেয়ে ভালো পারফর্ম করে HTTP/2
            বা HTTP/3 এনভায়রনমেন্টে, যেখানে সকেট রি-ইউজ ও মাল্টিপ্লেক্সিং আছে।
          </li>
          <li>
            <strong>TTFB is no longer tied to data speed:</strong> স্ট্রিমিং ব্যবহার করলে ধীরগতির
            ডেটাবেস কোয়েরি পেজের TTFB নষ্ট করতে পারে না।
          </li>
          <li>
            <strong>Replacement is nearly free:</strong> DOM রিপ্লেসমেন্টের ইনলাইন{" "}
            <code>$RC</code> কলটি মাত্র কয়েক বাইটের এবং কোনো ভারী hydration কস্ট তৈরি করে না।
          </li>
        </ul>
      </Note>
    </article>
  );
}
