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
      bn: "একটি স্লো API পুরো পেজ আটকে রাখে",
      en: "One slow API blocks the whole page",
    },
  },
  {
    id: "architecture",
    label: { bn: "Traditional বনাম Streaming SSR", en: "Traditional vs streaming SSR" },
  },
  {
    id: "mechanics",
    label: { bn: "স্ট্রিমিংয়ের মূল মেকানিক্স", en: "Core streaming mechanics" },
  },
  {
    id: "implementation",
    label: { bn: "Suspense দিয়ে আইসোলেশন", en: "Isolating with Suspense" },
  },
  {
    id: "matrix",
    label: { bn: "Performance Comparison", en: "Performance comparison" },
  },
  {
    id: "takeaway",
    label: { bn: "Production Takeaways", en: "Production takeaways" },
  },
];

export default function StreamingRendering() {
  return (
    <article className="doc-prose">
      {/* ── The problem ───────────────────────────────────────────────── */}
      <H2 id="the-problem" anchorOnly>
        একটি স্লো API পুরো পেজ আটকে রাখে
      </H2>

      <p>
        বিকেল ৪:১৫। ভুলু ভাই ড্যাশবোর্ডে নতুন একটি &quot;Analytics Overview&quot; সেকশন যুক্ত
        করলেন, যেখানে থার্ড-পার্টি অ্যানালিটিক্স API থেকে ডেটা আসতে ৩ সেকেন্ড লাগে। বিপত্তি অন্য
        জায়গায় — ইউজার ড্যাশবোর্ডে ক্লিক করলে নেভবার, সাইডবার, প্রোফাইল সবকিছু ৩ সেকেন্ড ধরে
        সাদা স্ক্রিনে আটকে থাকছে!
      </p>

      <Line name="ভুলু ভাই">
        ফাহিম! অ্যানালিটিক্স ডেটা স্লো হতে পারে, তাই বলে আমার সাইডবার আর নেভবারও ৩ সেকেন্ড
        ব্ল্যাঙ্ক হয়ে আটকে থাকবে? ইউজার ভাববে সাইট ক্র্যাশ করেছে!
      </Line>

      <Line name="ফাহিম">
        ভুলু ভাই! ট্র্যাডিশনাল ডাইনামিক রেন্ডারিংয়ে পেজের সবচেয়ে ধীরগতির ডেটা ফেচিংটি পুরো HTTP
        রেসপন্সের TTFB ব্লক করে রাখে। এর সমাধান হলো <strong>Streaming Rendering</strong>।
      </Line>

      <Line name="নেক্সট-ভাই">
        একদম! Streaming Rendering HTTP chunked transfer encoding ব্যবহার করে পেজের ফাস্ট
        পার্টগুলো (UI shell, layout, sidebar) তাৎক্ষণিকভাবে ব্রাউজারে স্ট্রিম করে দেয়। আর ধীরগতির
        অংশকে <code>&lt;Suspense&gt;</code> বাউন্ডারি দিয়ে ঘিরে রাখা হয় — ডেটা রেডি হওয়ামাত্র
        সেই চাঙ্ক স্ট্রিম হয়ে এসে UI-তে অটো-ইনজেক্ট হয়ে যায়!
      </Line>

      {/* ── Architecture ──────────────────────────────────────────────── */}
      <H2 id="architecture">১. Traditional SSR বনাম Streaming SSR</H2>

      <Diagram>{`┌─────────────────────────────────────────────────────────────────────────┐
│                    TRADITIONAL vs STREAMING SSR FLOW                    │
└─────────────────────────────────────────────────────────────────────────┘

 TRADITIONAL SSR (blocking):
 Server fetch (3s) ───▶ Build full HTML ───▶ Send to browser (TTFB = 3000ms)
 [User sees NOTHING for 3 seconds]

 -------------------------------------------------------------------------

 STREAMING SSR (progressive & non-blocking):
 Server exec ───▶ Send layout & UI shell instantly ──▶ (TTFB = ~20ms)
                  [User instantly sees the navbar & skeleton loader]
                               │
               (after 3s the analytics API finishes)
                               │
                               ▼
                  Stream the chunk into the HTML stream ──▶ Analytics UI swapped in`}</Diagram>

      {/* ── Mechanics ─────────────────────────────────────────────────── */}
      <H2 id="mechanics">২. স্ট্রিমিং রেন্ডারিংয়ের মূল মেকানিক্স</H2>

      <Note>
        <ul>
          <li>
            <strong>HTTP chunked transfer:</strong> Next.js সার্ভার পুরো HTML একবারে না পাঠিয়ে
            রিয়েল-টাইম স্ট্রিম হিসেবে ছোট ছোট চাঙ্কে ভাগ করে ব্রাউজারে পাঠাতে থাকে।
          </li>
          <li>
            <strong>Instant TTFB:</strong> পেজের মোট ফেচিং টাইম যত স্লোই হোক, নেভবার, সাইডবার ও
            স্ট্যাটিক অংশগুলো মিলিসেকেন্ডের মধ্যেই রেন্ডার হয়।
          </li>
          <li>
            <strong>Selective hydration:</strong> ব্রাউজার পুরো পেজ ডাউনলোড শেষ হওয়ার অপেক্ষা না
            করে আগে আসা চাঙ্কগুলোর ইন্টার‌্যাক্টিভিটি আগেই চালু করে দেয়।
          </li>
        </ul>
      </Note>

      {/* ── Implementation ────────────────────────────────────────────── */}
      <H2 id="implementation">৩. Suspense দিয়ে স্লো উইজেট আইসোলেশন</H2>

      <H3>পেজের বাকি অংশ ইনস্ট্যান্ট, স্লো অংশ স্ট্রিমড</H3>

      <CodeBlock filename="app/dashboard/page.tsx">{`import { Suspense } from 'react';

// Slow async component (takes 3 seconds)
async function SlowAnalyticsWidget() {
  // Simulating a heavy analytics API / DB calculation
  await new Promise((resolve) => setTimeout(resolve, 3000));

  return (
    <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl space-y-3">
      <h3 className="text-lg font-semibold text-emerald-400">
        Monthly Revenue Analytics
      </h3>
      <div className="text-3xl font-extrabold text-slate-100">$124,500.00</div>
      <p className="text-xs text-slate-400">+18.4% growth compared to last month</p>
    </div>
  );
}

// Skeleton loader — shown instantly while the chunk streams
function AnalyticsSkeleton() {
  return (
    <div className="bg-slate-900/60 border border-slate-800 p-6 rounded-2xl animate-pulse space-y-3">
      <div className="h-4 w-48 bg-slate-800 rounded" />
      <div className="h-8 w-32 bg-slate-800 rounded" />
      <div className="h-3 w-64 bg-slate-800 rounded" />
    </div>
  );
}

export default function DashboardPage() {
  return (
    <div className="max-w-5xl mx-auto py-8 px-6 space-y-6 text-slate-100">
      {/* 1. Header and navigation shell render INSTANTLY */}
      <header className="flex justify-between items-center border-b border-slate-800 pb-4">
        <div>
          <span className="text-xs font-mono text-cyan-400 bg-cyan-500/10 px-2 py-1 rounded">
            Streaming SSR active
          </span>
          <h1 className="text-2xl font-bold mt-2">Executive Dashboard</h1>
        </div>
        <div className="w-10 h-10 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center font-bold text-sm">
          ZS
        </div>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl">
          <h3 className="text-sm text-slate-400">Quick Stats</h3>
          <p className="text-2xl font-bold mt-2">1,240 Active Users</p>
        </div>

        {/* 2. Wrap only the slow async component in a Suspense boundary */}
        <Suspense fallback={<AnalyticsSkeleton />}>
          <SlowAnalyticsWidget />
        </Suspense>
      </div>
    </div>
  );
}`}</CodeBlock>

      {/* ── Matrix ────────────────────────────────────────────────────── */}
      <H2 id="matrix">৪. Performance Comparison</H2>

      <Table
        head={["মেট্রিক", "Traditional Dynamic SSR", "Streaming SSR (Suspense)"]}
        rows={[
          [
            "TTFB",
            "স্লো — সবচেয়ে ধীরগতির DB ফেচের ওপর নির্ভর করে",
            "অতি দ্রুত (~১০–২০ms)",
          ],
          [
            "FCP",
            "৩–৫ সেকেন্ড পর্যন্ত লেট হতে পারে",
            "ইনস্ট্যান্ট — UI shell সাথে সাথে দৃশ্যমান",
          ],
          [
            "User experience",
            "ব্ল্যাঙ্ক হোয়াইট স্ক্রিন, উচ্চ bounce rate",
            "ইনস্ট্যান্ট লোডার ফিডব্যাক, ফ্লুইড UX",
          ],
          [
            "Fault isolation",
            "১টি API ফেইল করলে পুরো পেজ ক্র্যাশ",
            "শুধু ওই বাউন্ডারিতে error boundary হ্যান্ডেল হয়",
          ],
        ]}
      />

      <Line name="ভুলু ভাই">
        মারাত্মক কাজের জিনিস! এখন অ্যানালিটিক্স ডেটা আসতে ৩ সেকেন্ড লাগলেও ইউজার ক্লিক করার
        সাথে সাথেই নেভবার, প্রোফাইল আর স্কেলিটন লোডার দেখতে পাচ্ছে!
      </Line>

      {/* ── Takeaways ─────────────────────────────────────────────────── */}
      <H2 id="takeaway">Production Takeaways</H2>

      <Note>
        <ul>
          <li>
            <strong>Granular Suspense boundaries:</strong> পেজের প্রধান UI (navbar, layout,
            critical content) কখনোই ধীরগতির ডেটার জন্য আটকে রাখবেন না — স্লো API বা ভারী কোয়েরি
            আলাদা <code>&lt;Suspense&gt;</code> বাউন্ডারিতে মুড়ে দিন।
          </li>
          <li>
            <strong>loading.tsx for route-level streaming:</strong> পুরো রুটের জন্য ফাইল-বেসড{" "}
            <code>loading.tsx</code> ব্যবহার করে অটোমেটিক রুট-লেভেল স্ট্রিম তৈরি করা যায়।
          </li>
          <li>
            <strong>Use skeleton loaders:</strong> layout shift (CLS) এড়াতে fallback-এ আসল
            কম্পোনেন্টের সমান মাপের স্কেলিটন ব্যবহার করুন।
          </li>
        </ul>
      </Note>
    </article>
  );
}
