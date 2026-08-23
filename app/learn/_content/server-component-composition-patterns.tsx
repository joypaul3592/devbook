import {
  CodeBlock,
  Diagram,
  H2,
  H3,
  Line,
  Note,
} from "@/components/learn/DocParts";
import type { Bi } from "@/lib/curriculum";

/** Section anchors — consumed by the "on this page" rail. */
export const headings: { id: string; label: Bi }[] = [
  {
    id: "the-problem",
    label: {
      bn: "৫ সেকেন্ডের ব্ল্যাঙ্ক স্ক্রিন",
      en: "Five seconds of blank screen",
    },
  },
  {
    id: "mental-model",
    label: {
      bn: "Waterfall বনাম Parallel Streaming",
      en: "Waterfall vs parallel streaming",
    },
  },
  {
    id: "self-contained",
    label: {
      bn: "Self-contained সেকশন",
      en: "Self-contained sections",
    },
  },
  {
    id: "composition-root",
    label: {
      bn: "Suspense দিয়ে কম্পোজিশন",
      en: "Composing with Suspense",
    },
  },
  {
    id: "takeaway",
    label: { bn: "Production Takeaways", en: "Production takeaways" },
  },
];

export default function ServerComponentCompositionPatterns() {
  return (
    <article className="doc-prose">
      {/* ── The problem ───────────────────────────────────────────────── */}
      <H2 id="the-problem" anchorOnly>
        ৫ সেকেন্ডের ব্ল্যাঙ্ক স্ক্রিন
      </H2>

      <p>
        সন্ধ্যা ৬:০০। ভুলু ভাই তার নতুন ই-কমার্স অ্যানালিটিক্স ড্যাশবোর্ডে রিলোড দিয়ে কপালে
        হাত দিয়ে বসে আছেন। পুরো পেজটি সাদা হয়ে ৫ সেকেন্ড আটকে থাকার পর একসাথে ভেসে উঠছে।
      </p>

      <Line name="ভুলু ভাই">
        ফাহিম, আমি তো কোনো ক্লায়েন্ট-সাইড জাভাস্ক্রিপ্ট বান্ডলই পাঠাইনি! ৩টি সার্ভার
        কম্পোনেন্ট থেকে ডেটা ফেচ করেছি। তাও পেজটা লোড হতে ৫ সেকেন্ড ব্ল্যাঙ্ক থাকছে কেন?
      </Line>

      <Line name="ফাহিম">
        (নেটওয়ার্ক ট্যাবের ওয়াটারফল টাইমলাইনে আঙুল রেখে) ভুলু ভাই! তুমি রুট{" "}
        <code>page.tsx</code>-এর ভেতরে তিনটি ডেটা পরপর তিনটি sequential{" "}
        <code>await</code> দিয়ে ফেচ করেছ! প্রথম API ১ সেকেন্ড, দ্বিতীয়টি ২, তৃতীয়টি ২ —
        মোট ১+২+২ = ৫ সেকেন্ড সার্ভার রেন্ডারিং ব্লক হয়ে বসে আছে!
      </Line>

      <Line name="নেক্সট-ভাই">
        একদম সঠিক পয়েন্ট! পরপর <code>await</code> লিখলে ডেটা ফেচিং{" "}
        <strong>waterfall</strong> তৈরি হয়। এর সমাধান হলো{" "}
        <strong>Server Component Composition Pattern</strong> — রুটে ডেটা ফেচ করে প্রপ্স
        ড্রিলিং না করে প্রতিটি ফিচার সেকশনকে স্বাধীন async Server Component বানাও, আর
        আলাদা <code>&lt;Suspense&gt;</code> বাউন্ডারিতে কম্পোজ করো।
      </Line>

      {/* ── Mental model ──────────────────────────────────────────────── */}
      <H2 id="mental-model">১. Waterfall বনাম Parallel Streaming</H2>

      <Diagram>{`❌ SEQUENTIAL WATERFALL COMPOSITION
┌────────────────────────────────────────────────────────────────────────┐
│ app/dashboard/page.tsx                                                 │
│  ├─ const stats  = await getStats();    (takes 1s)                     │
│  ├─ const orders = await getOrders();   (takes 2s)                     │
│  └─ const charts = await getCharts();   (takes 2s)                     │
│                                                                        │
│  TOTAL SERVER BLOCKING TIME = 5 seconds (user sees a blank screen)     │
└────────────────────────────────────────────────────────────────────────┘

─────────────────────────────────────────────────────────────────────────

🟢 PARALLEL STREAMING COMPOSITION
┌────────────────────────────────────────────────────────────────────────┐
│ app/dashboard/page.tsx  (shell renders instantly)                      │
│                                                                        │
│  ├── <Suspense fallback={<StatsSkeleton />}>                           │
│  │     └── <UserStatsSection />     ────> streams in at ~1s            │
│  │                                                                     │
│  ├── <Suspense fallback={<OrdersSkeleton />}>                          │
│  │     └── <RecentOrdersSection />  ────> streams in at ~2s            │
│  │                                                                     │
│  └── <Suspense fallback={<ChartsSkeleton />}>                          │
│        └── <AnalyticsSection />     ────> streams in at ~2s            │
└────────────────────────────────────────────────────────────────────────┘`}</Diagram>

      {/* ── Self-contained sections ───────────────────────────────────── */}
      <H2 id="self-contained">২. Self-contained Async Server Components</H2>

      <H3>Step 1 — Stats সেকশন (নিজের ডেটা নিজেই ফেচ করে)</H3>

      <CodeBlock filename="app/dashboard/components/user-stats.tsx">{`// 🟢 app/dashboard/components/user-stats.tsx

// Simulated async server operation (1 second latency)
async function fetchUserStats() {
  await new Promise((resolve) => setTimeout(resolve, 1000));
  return { totalRevenue: 45200, activeUsers: 1240 };
}

export async function UserStatsSection() {
  // Data fetching colocated inside the component that needs it
  const stats = await fetchUserStats();

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-2">
      <span className="text-xs text-emerald-400 font-mono">Streamed in ~1.0s</span>
      <h3 className="text-slate-400 text-xs font-semibold uppercase">Total Revenue</h3>
      <p className="text-2xl font-bold text-white">
        {stats.totalRevenue.toLocaleString()} USD
      </p>
      <p className="text-xs text-slate-500">Active users: {stats.activeUsers}</p>
    </div>
  );
}`}</CodeBlock>

      <H3>Step 2 — Orders সেকশন</H3>

      <CodeBlock filename="app/dashboard/components/recent-orders.tsx">{`// 🟢 app/dashboard/components/recent-orders.tsx

// Simulated async server operation (2 seconds latency)
async function fetchRecentOrders() {
  await new Promise((resolve) => setTimeout(resolve, 2000));
  return [
    { id: 'ORD-101', amount: 250, status: 'COMPLETED' },
    { id: 'ORD-102', amount: 480, status: 'PROCESSING' },
  ];
}

export async function RecentOrdersSection() {
  const orders = await fetchRecentOrders();

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-3">
      <span className="text-xs text-blue-400 font-mono">Streamed in ~2.0s</span>
      <h3 className="text-slate-400 text-xs font-semibold uppercase">Recent Transactions</h3>
      <ul className="space-y-2">
        {orders.map((ord) => (
          <li key={ord.id} className="flex justify-between text-xs py-1 border-b border-slate-800">
            <span className="text-slate-300 font-mono">{ord.id}</span>
            <span className="text-emerald-400 font-bold">{ord.amount} USD</span>
          </li>
        ))}
      </ul>
    </div>
  );
}`}</CodeBlock>

      {/* ── Composition root ──────────────────────────────────────────── */}
      <H2 id="composition-root">৩. Granular Suspense দিয়ে কম্পোজিশন</H2>

      <CodeBlock filename="app/dashboard/page.tsx">{`// 🟢 app/dashboard/page.tsx — a pure composition root
import { Suspense } from 'react';
import { UserStatsSection } from './components/user-stats';
import { RecentOrdersSection } from './components/recent-orders';

function CardSkeleton({ title }: { title: string }) {
  return (
    <div className="bg-slate-900/50 border border-slate-800/80 rounded-xl p-5 animate-pulse space-y-3">
      <div className="h-3 w-24 bg-slate-800 rounded" />
      <div className="h-7 w-32 bg-slate-800 rounded" />
      <span className="text-[10px] text-slate-600 font-mono">Loading {title}...</span>
    </div>
  );
}

export default function DashboardPage() {
  // Note: the page itself is NOT async — the shell ships immediately
  return (
    <main className="max-w-5xl mx-auto p-8 space-y-6 bg-slate-950 min-h-screen">
      <header className="border-b border-slate-800 pb-4">
        <h1 className="text-2xl font-bold text-white">Advanced RSC Dashboard Shell</h1>
        <p className="text-xs text-slate-400">
          The layout shell loads instantly. Independent server components stream in parallel.
        </p>
      </header>

      <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Suspense fallback={<CardSkeleton title="User Stats" />}>
          <UserStatsSection />
        </Suspense>

        <Suspense fallback={<CardSkeleton title="Recent Orders" />}>
          <RecentOrdersSection />
        </Suspense>
      </section>
    </main>
  );
}`}</CodeBlock>

      <Note>
        <p>
          একই কম্পোনেন্টের ভেতরে দুটি স্বাধীন API লাগলে সেখানেও waterfall এড়াও —{" "}
          <code>const [a, b] = await Promise.all([fetchA(), fetchB()]);</code>
        </p>
      </Note>

      <Line name="ভুলু ভাই">
        অসাধারণ নেক্সট-ভাই! এবার রুট পেজের শেল সঙ্গে সঙ্গে দেখা গেল, আর ব্যাকগ্রাউন্ডে
        ইউজার স্ট্যাটস ও রিসেন্ট অর্ডার নিজ নিজ গতিতে ১ ও ২ সেকেন্ড পর স্ট্রিম হয়ে ভেসে
        উঠল!
      </Line>

      {/* ── Takeaways ─────────────────────────────────────────────────── */}
      <H2 id="takeaway">Production Takeaways</H2>

      <Note>
        <ul>
          <li>
            <strong>Colocate data fetching:</strong> প্যারেন্টে ফেচ করে প্রপ ড্রিলিং করো না
            — যে কম্পোনেন্টের ডেটা লাগে, ফেচটা তার ভেতরেই রাখো।
          </li>
          <li>
            <strong>Avoid sequential await:</strong> একে অপরের ওপর নির্ভরশীল না হলে সবসময়{" "}
            <code>Promise.all([...])</code> ব্যবহার করো।
          </li>
          <li>
            <strong>Granular Suspense:</strong> পুরো পেজকে একটিমাত্র{" "}
            <code>&lt;Suspense&gt;</code> দিয়ে না ঘিরে ছোট লজিক্যাল উইজেটগুলোকে আলাদা
            বাউন্ডারিতে মোড়ো।
          </li>
          <li>
            <strong>Automatic deduplication:</strong> একই রেন্ডার পাসে একাধিক কম্পোনেন্ট
            একই URL ফেচ করলে Next.js request memoization দিয়ে সেটি একবারই চালায়।
          </li>
        </ul>
      </Note>
    </article>
  );
}
