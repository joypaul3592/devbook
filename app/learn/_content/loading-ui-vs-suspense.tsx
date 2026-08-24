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
      bn: "Inline Suspense দিলেও ফুল-পেজ স্কেলিটন",
      en: "Inline Suspense, yet a full-page skeleton",
    },
  },
  {
    id: "architecture",
    label: { bn: "loading.tsx কোথায় বসে?", en: "Where loading.tsx sits" },
  },
  {
    id: "differences",
    label: { bn: "৩টি মূল পার্থক্য", en: "Three key differences" },
  },
  {
    id: "implementation",
    label: { bn: "হাইব্রিড অ্যাপ্রোচ", en: "The hybrid approach" },
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

export default function LoadingUiVsSuspense() {
  return (
    <article className="doc-prose">
      {/* ── The problem ───────────────────────────────────────────────── */}
      <H2 id="the-problem" anchorOnly>
        Inline Suspense দিলেও ফুল-পেজ স্কেলিটন
      </H2>

      <p>
        রাত ৩:১০। ভুলু ভাই <code>app/dashboard/</code> ফোল্ডারে একটি <code>loading.tsx</code>{" "}
        তৈরি করেছেন। নেভিগেট করার সাথে সাথে পুরো ড্যাশবোর্ডের বডি হাওয়া হয়ে বিশাল ফুল-পেজ স্কেলিটন
        দেখায়। কিন্তু তিনি চান — স্ট্যাটিক হেডার আর ফিল্টার বার স্ক্রিনে থাকুক, কেবল নিচের ভারী
        টেবিলটা স্কেলিটন দেখাক!
      </p>

      <Line name="ভুলু ভাই">
        ফাহিম! আমি তো <code>page.tsx</code>-এর ভেতরে নির্দিষ্ট টেবিলের জন্য inline{" "}
        <code>&lt;Suspense&gt;</code> বসিয়েছি, তাও নেভিগেট করলে পুরো পেজজুড়ে{" "}
        <code>loading.tsx</code>-এর স্কেলিটন কেন চলে আসছে? ফাইলটা আসলে ট্রি-র কোথায় বসে?
      </Line>

      <Line name="ফাহিম">
        ভুলু ভাই! App Router-এর কনভেনশনে <code>loading.tsx</code> হলো একটি{" "}
        <strong>route-level Suspense wrapper</strong>! Next.js ব্যাকগ্রাউন্ডে আপনার{" "}
        <code>page.tsx</code>-কে স্বয়ংক্রিয়ভাবে ওই fallback-সহ একটি{" "}
        <code>&lt;Suspense&gt;</code> দিয়ে পেঁচিয়ে দেয়। ফলে page-এর ভেতরে একটাও ডেটা ফেচিং বাকি
        থাকলে পুরো পেজ লোডার দিয়ে রিপ্লেস হয়।
      </Line>

      <Line name="নেক্সট-ভাই">
        একদম! <code>loading.tsx</code> ব্যবহার হয় <strong>instant loading state</strong>-এর
        জন্য, যা নেভিগেশনের সময় shared layout অক্ষত রাখে। আর inline{" "}
        <code>&lt;Suspense&gt;</code> ব্যবহার হয় পেজের ভেতরের কনটেন্ট granular ভাবে স্ট্রিম
        করার জন্য।
      </Line>

      {/* ── Architecture ──────────────────────────────────────────────── */}
      <H2 id="architecture">১. loading.tsx কোথায় বসে?</H2>

      <Diagram>{`┌─────────────────────────────────────────────────────────────────────────┐
│              AUTOMATED ROUTE-LEVEL SUSPENSE WRAPPER FLOW                │
└─────────────────────────────────────────────────────────────────────────┘

 app/dashboard/
 ├── layout.tsx
 ├── loading.tsx
 └── page.tsx

                ▼ NEXT.JS AUTOMATIC COMPONENT TREE WRAPPING ▼

 <Layout>
   {/* the shared layout (sidebar / navbar) always stays visible & interactive */}

   <Suspense fallback={<Loading />}>   <-- generated automatically from loading.tsx
     <Page>
       {/* granular inline boundaries live inside page.tsx */}
       <Header />
       <Suspense fallback={<TableSkeleton />}>
         <SlowDataTable />
       </Suspense>
     </Page>
   </Suspense>

 </Layout>`}</Diagram>

      {/* ── Differences ───────────────────────────────────────────────── */}
      <H2 id="differences">২. ৩টি মূল পার্থক্য</H2>

      <Note>
        <ul>
          <li>
            <strong>Scope &amp; hierarchy:</strong> <code>loading.tsx</code> নির্দিষ্ট route
            segment-এর জন্য একটি বাউন্ডারি তৈরি করে — <code>layout.tsx</code>-এর নিচে ও{" "}
            <code>page.tsx</code>-এর উপরে। Inline <code>&lt;Suspense&gt;</code> কাজ করে{" "}
            <code>page.tsx</code>-এর ভেতরে নির্দিষ্ট কম্পোনেন্টের ওপর।
          </li>
          <li>
            <strong>Navigation experience:</strong> ইউজার এক রুট থেকে অন্য রুটে ক্লিক করলে ক্লায়েন্ট
            রাউটার সাথে সাথে <code>loading.tsx</code>-এর fallback দেখায় — একেই বলে instant
            navigation feedback।
          </li>
          <li>
            <strong>Layout persistence:</strong> <code>loading.tsx</code> ট্রিগার হলেও{" "}
            <code>layout.tsx</code> রি-রেন্ডার বা আনমাউন্ট হয় না — সাইডবার ও সার্চবার পুরোপুরি
            ইন্টার‌্যাক্টিভ থাকে। তবে পেজের পুরো কনটেন্ট এরিয়া স্কেলিটন হয়ে যায়।
          </li>
        </ul>
      </Note>

      {/* ── Implementation ────────────────────────────────────────────── */}
      <H2 id="implementation">৩. হাইব্রিড অ্যাপ্রোচ</H2>

      <H3>❌ Anti-pattern — সবকিছুর জন্য loading.tsx</H3>

      <CodeBlock filename="app/dashboard/loading.tsx">{`// An over-generalised full-page skeleton collapses the whole layout
export default function DashboardLoading() {
  return (
    <div className="p-8 space-y-4 animate-pulse">
      <div className="h-10 w-1/3 bg-slate-800 rounded" />  {/* replaces the header */}
      <div className="h-12 w-full bg-slate-800 rounded" /> {/* replaces the action bar */}
      <div className="h-64 w-full bg-slate-800 rounded" /> {/* replaces the table */}
    </div>
  );
}`}</CodeBlock>

      <CodeBlock filename="app/dashboard/page.tsx">{`export default async function DashboardPage() {
  // Top-level awaits keep the whole page inside loading.tsx's boundary
  const stats = await getStats();      // 100ms
  const table = await getTableData();  // 3000ms

  return (
    <div>
      <Header stats={stats} /> {/* hidden for 3s because of loading.tsx */}
      <Table data={table} />
    </div>
  );
}`}</CodeBlock>

      <H3>🟢 Fix — লাইট loading.tsx + granular inline boundaries</H3>

      <CodeBlock filename="app/dashboard/loading.tsx">{`// A minimal instant-navigation indicator — no layout collapse
export default function DashboardInstantLoading() {
  return (
    <div className="w-full h-1 bg-emerald-500/20 overflow-hidden">
      <div className="w-full h-full bg-emerald-500 animate-pulse" />
    </div>
  );
}`}</CodeBlock>

      <CodeBlock filename="app/dashboard/page.tsx">{`import { Suspense } from 'react';
import 'server-only';

async function DashboardHeader() {
  await new Promise((res) => setTimeout(res, 50)); // fast query
  return (
    <div className="flex justify-between items-center border-b border-slate-800 pb-4">
      <div>
        <h1 className="text-xl font-bold text-white">Metrics Dashboard</h1>
        <p className="text-xs text-slate-400">System status overview</p>
      </div>
      <span className="px-3 py-1 bg-emerald-500/10 text-emerald-400 text-xs rounded-full border border-emerald-500/20">
        System operational
      </span>
    </div>
  );
}

async function SlowDataTable() {
  await new Promise((res) => setTimeout(res, 2500)); // heavy query
  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden">
      <table className="w-full text-left text-xs text-slate-300">
        <thead className="bg-slate-800/50 text-slate-400 uppercase font-mono border-b border-slate-800">
          <tr>
            <th className="p-3">Transaction ID</th>
            <th className="p-3">Amount</th>
            <th className="p-3">Status</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-800">
          <tr>
            <td className="p-3 font-mono">TX-9021</td>
            <td className="p-3">$1,240.00</td>
            <td className="p-3 text-emerald-400">Completed</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}

export default function OptimizedDashboardPage() {
  return (
    <div className="space-y-6 max-w-4xl mx-auto py-8 px-6 text-slate-100">
      {/* Fast section — resolves in 50ms */}
      <Suspense
        fallback={<div className="h-16 bg-slate-900 rounded-xl animate-pulse" />}
      >
        <DashboardHeader />
      </Suspense>

      {/* Granular slow section — streams independently after 2.5s */}
      <Suspense
        fallback={
          <div className="p-4 bg-slate-900 border border-slate-800 rounded-xl animate-pulse space-y-3">
            <div className="h-4 w-1/4 bg-slate-800 rounded" />
            <div className="h-40 w-full bg-slate-800/40 rounded" />
          </div>
        }
      >
        <SlowDataTable />
      </Suspense>
    </div>
  );
}`}</CodeBlock>

      {/* ── Matrix ────────────────────────────────────────────────────── */}
      <H2 id="matrix">৪. Behavioural &amp; Structural Comparison</H2>

      <Table
        head={[
          "বৈশিষ্ট্য",
          <code key="l">loading.tsx</code>,
          <>
            Inline <code>&lt;Suspense&gt;</code>
          </>,
        ]}
        rows={[
          [
            "Placement",
            <>
              route ডিরেক্টরি লেভেলে (<code>app/route/loading.tsx</code>)
            </>,
            <>
              JSX-এর ভেতরে (<code>page.tsx</code> বা কম্পোনেন্ট)
            </>,
          ],
          [
            "Mechanism",
            <>
              পুরো <code>page.tsx</code> export-কে র‍্যাপ করে
            </>,
            "নির্দিষ্ট সাব-ট্রি র‍্যাপ করে",
          ],
          [
            "Trigger",
            "Link ক্লিকে সাথে সাথে ফায়ার হয়",
            "HTML রেডি হওয়ার সাথে চাঙ্ক স্ট্রিম করে",
          ],
          [
            "Layout impact",
            <>
              <code>layout.tsx</code> অক্ষত, <code>page.tsx</code> রিপ্লেস হয়
            </>,
            "layout ও পেজের বাকি UI দুটোই অক্ষত থাকে",
          ],
          [
            "Best use case",
            "top-level instant loading feedback",
            "selective granular streaming",
          ],
        ]}
      />

      <Line name="ভুলু ভাই">
        দারুণ! এখন <code>loading.tsx</code>-এ শুধু হালকা একটা টপ প্রোগ্রেস বার রাখব, আর পেজের
        ভেতরের হেডার ধরে রাখতে granular inline <code>&lt;Suspense&gt;</code> ব্যবহার করব!
      </Line>

      {/* ── Takeaways ─────────────────────────────────────────────────── */}
      <H2 id="takeaway">Production Takeaways</H2>

      <Note>
        <ul>
          <li>
            <strong>Avoid heavy loading.tsx skeletons:</strong> ওখানে বিশাল ফুল-পেজ স্কেলিটন না দিয়ে
            হালকা ইন্ডিকেটর দিন; আসল কনটেন্ট স্কেলিটনিং পেজের ভেতরে inline boundary দিয়ে করুন।
          </li>
          <li>
            <strong>Keep data fetching inside components:</strong> <code>page.tsx</code>-এর মেইন
            এন্ট্রিতে <code>await</code> না করে ফেচিং আলাদা চাইল্ড কম্পোনেন্টে সরান — নাহলে inline
            boundary কাজেই আসবে না।
          </li>
          <li>
            <strong>Use layout persistence:</strong> <code>loading.tsx</code> কখনোই{" "}
            <code>layout.tsx</code> ঢাকে না — এই সুবিধা কাজে লাগিয়ে নেভিগেশন সাইডবার ও গ্লোবাল
            সার্চ সবসময় অ্যাক্টিভ রাখুন।
          </li>
        </ul>
      </Note>
    </article>
  );
}
