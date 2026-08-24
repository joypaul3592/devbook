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
      bn: "ক্লিকের পর ব্রাউজার থমকে থাকে কেন?",
      en: "Why the browser freezes after a click",
    },
  },
  {
    id: "mental-model",
    label: { bn: "loading.tsx আসলে কী করে", en: "What loading.tsx does" },
  },
  {
    id: "mechanics",
    label: { bn: "Streaming মেকানিক্স", en: "Streaming mechanics" },
  },
  {
    id: "implementation",
    label: { bn: "প্রোডাকশন কোড", en: "Production code" },
  },
  {
    id: "takeaway",
    label: { bn: "Production Checklist", en: "Production checklist" },
  },
];

export default function RouteLevelLoadingUi() {
  return (
    <article className="doc-prose">
      {/* ── The problem ───────────────────────────────────────────────── */}
      <H2 id="the-problem" anchorOnly>
        ক্লিকের পর ব্রাউজার থমকে থাকে কেন?
      </H2>

      <p>
        দুপুর ১২:০০। ভুলু ভাই তার এনালিটিক্স পেজে ভারী ৩টি ডাটাবেস কোয়েরি চালিয়েছেন। ইউজার
        যখন সাইডবার থেকে এনালিটিক্স ট্যাবে ক্লিক করছে, পেজটি ৩ সেকেন্ড ফ্রিজ হয়ে আটকে থাকছে —
        কোনো লোডিং স্পিনার বা ইন্ডিকেটর কিছুই দেখা যাচ্ছে না।
      </p>

      <Line name="ভুলু ভাই">
        ফাহিম! নেভিগেশন বাটনে ক্লিক করার পর ব্রাউজার ৩ সেকেন্ড থমকে থাকছে কেন? ইউজার তো ভাববে
        সাইট হ্যাং করেছে!
      </Line>

      <Line name="ফাহিম">
        ভুলু ভাই! সার্ভার কম্পোনেন্টের ডাটা ফেচিং শেষ না হওয়া পর্যন্ত Next.js নেভিগেশন
        কমপ্লিট করে না। আপনি কোনো লোডিং বাউন্ডারি বসাননি!
      </Line>

      <Line name="নেক্সট-ভাই">
        এর সমাধান হলো Route-Level <code>loading.tsx</code> ফাইল। রাউট ফোল্ডারে একটি{" "}
        <code>loading.tsx</code> রেখে দিলেই Next.js বিহাইন্ড-দ্য-সিন সেই রাউটের{" "}
        <code>page.tsx</code>-কে স্বয়ংক্রিয়ভাবে একটি <code>&lt;Suspense&gt;</code> বাউন্ডারি
        দিয়ে র‍্যাপ করে নেয়। ইউজার ক্লিক করার সাথে সাথেই লেআউট ও স্কেলেটন ব্রাউজারে ভেসে উঠবে,
        আর ব্যাকগ্রাউন্ডে ডাটা ফেচ শেষ হওয়া মাত্র অরিজিনাল কন্টেন্ট স্ট্রিম হয়ে রিপ্লেস হবে।
      </Line>

      {/* ── Mental model ──────────────────────────────────────────────── */}
      <H2 id="mental-model">১. loading.tsx আসলে কী করে</H2>

      <ul>
        <li>
          এটি কোনো স্পিনার লাইব্রেরি নয় — এটি একটি{" "}
          <strong>অটোমেটিক Suspense বাউন্ডারি</strong>।
        </li>
        <li>
          একই সেগমেন্টের <code>layout.tsx</code> এবং তার সব প্যারেন্ট শেল সাথে সাথেই
          স্ট্রিম হয়ে যায় — শুধু <code>page.tsx</code>-এর জায়গায় ফলব্যাক বসে।
        </li>
        <li>
          <code>loading.tsx</code> পুরো সেগমেন্টের জন্য একটাই ফলব্যাক দেয়। পেজের{" "}
          <em>আলাদা আলাদা</em> অংশ স্বাধীনভাবে লোড করাতে চাইলে পেজের ভেতরে ম্যানুয়াল{" "}
          <code>&lt;Suspense&gt;</code> লাগবে।
        </li>
      </ul>

      {/* ── Mechanics ─────────────────────────────────────────────────── */}
      <H2 id="mechanics">২. Streaming মেকানিক্স</H2>

      <Diagram>{`app/dashboard/analytics/loading.tsx  —  what Next.js builds for you
┌──────────────────────────────────────────────────────────────────────┐
│  <Layout>                                                            │
│    <Suspense fallback={<AnalyticsLoadingSkeleton />}>                │
│      <AnalyticsPage />   <── async data fetching happens here        │
│    </Suspense>                                                       │
│  </Layout>                                                           │
└──────────────────────────────────────────────────────────────────────┘

User click ──► Instant skeleton UI (0ms) ──► Streamed real page (300ms)`}</Diagram>

      {/* ── Implementation ────────────────────────────────────────────── */}
      <H2 id="implementation">৩. প্রোডাকশন কোড</H2>

      <H3>A — রাউট-লেভেল স্কেলেটন</H3>

      <CodeBlock filename="app/dashboard/analytics/loading.tsx">{`export default function AnalyticsLoading() {
  return (
    <div className="space-y-6 animate-pulse">
      {/* Header skeleton */}
      <div className="space-y-2">
        <div className="h-6 w-48 bg-slate-800 rounded" />
        <div className="h-3 w-72 bg-slate-800/60 rounded" />
      </div>

      {/* Metrics grid skeleton */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            className="bg-slate-900/60 border border-slate-800 rounded-xl p-5 space-y-3"
          >
            <div className="h-3 w-20 bg-slate-800 rounded" />
            <div className="h-8 w-32 bg-slate-800 rounded" />
          </div>
        ))}
      </div>
    </div>
  );
}`}</CodeBlock>

      <H3>B — ধীর সার্ভার কম্পোনেন্ট</H3>

      <CodeBlock filename="app/dashboard/analytics/page.tsx">{`async function fetchHeavyAnalytics() {
  // Simulating a 2.5s database delay
  await new Promise((resolve) => setTimeout(resolve, 2500));
  return { revenue: '$124,500', conversion: '4.2%' };
}

export default async function AnalyticsPage() {
  const data = await fetchHeavyAnalytics();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-bold text-white">Analytics Overview</h1>
        <p className="text-xs text-slate-400">Real-time performance metrics</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-slate-900 border border-slate-800 p-5 rounded-xl">
          <span className="text-xs text-slate-400">Total Revenue</span>
          <p className="text-2xl font-bold text-emerald-400">{data.revenue}</p>
        </div>
        <div className="bg-slate-900 border border-slate-800 p-5 rounded-xl">
          <span className="text-xs text-slate-400">Conversion Rate</span>
          <p className="text-2xl font-bold text-blue-400">{data.conversion}</p>
        </div>
      </div>
    </div>
  );
}`}</CodeBlock>

      <H3>C — সেকশন-ভিত্তিক granular Suspense</H3>

      <CodeBlock filename="app/dashboard/analytics/page.tsx">{`import { Suspense } from 'react';

export default function AnalyticsPage() {
  return (
    <div className="space-y-6">
      {/* Renders instantly — no awaiting here */}
      <h1 className="text-xl font-bold text-white">Analytics Overview</h1>

      {/* Each slow section streams in on its own */}
      <Suspense fallback={<RevenueSkeleton />}>
        <RevenueCard />
      </Suspense>

      <Suspense fallback={<TrafficSkeleton />}>
        <TrafficChart />
      </Suspense>
    </div>
  );
}`}</CodeBlock>

      <Line name="ভুলু ভাই">
        এক ফাইল যোগ করেই ৩ সেকেন্ডের সাদা স্ক্রিন সম্পূর্ণ উধাও — এখন ক্লিকের সাথে সাথেই
        স্কেলেটন দেখা যাচ্ছে!
      </Line>

      {/* ── Takeaways ─────────────────────────────────────────────────── */}
      <H2 id="takeaway">Production Checklist</H2>

      <Note>
        <ul>
          <li>
            <strong>স্কেলেটন ফাইনাল লেআউটের সাথে মেলান:</strong> লোডিং স্কেলেটনের লেআউট ও
            সাইজ অরিজিনাল পেজের সাথে হুবহু মিললে Cumulative Layout Shift (CLS) শূন্যের কোঠায়
            নেমে আসে।
          </li>
          <li>
            <strong>সেকশনাল লোডিংয়ে granular Suspense:</strong> পুরো পেজ আটকে না রেখে কিছু
            অংশ তাৎক্ষণিক দেখাতে চাইলে <code>loading.tsx</code>-এর ওপর নির্ভর না করে পেজের
            ভেতরে ইন্ডিভিজুয়াল <code>&lt;Suspense&gt;</code> ব্যবহার করুন।
          </li>
          <li>
            <strong>লেআউটে await করবেন না:</strong> প্যারেন্ট লেআউট নিজেই ডাটার জন্য অপেক্ষা
            করলে স্কেলেটনও দেরিতে আসে — শেল সবসময় সিঙ্ক্রোনাস রাখুন।
          </li>
        </ul>
      </Note>
    </article>
  );
}
