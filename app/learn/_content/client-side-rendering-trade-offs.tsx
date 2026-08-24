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
      bn: "সব জায়গায় 'use client' লিখে ৩.৫MB বান্ডল",
      en: "'use client' everywhere, a 3.5MB bundle",
    },
  },
  {
    id: "architecture",
    label: { bn: "CSR ট্রেড-অফ আর্কিটেকচার", en: "CSR trade-off architecture" },
  },
  {
    id: "tradeoffs",
    label: { bn: "৩টি প্রধান ট্রেড-অফ", en: "The three trade-offs" },
  },
  {
    id: "implementation",
    label: { bn: "Anti-pattern ও সঠিক প্যাটার্ন", en: "Anti-pattern vs the fix" },
  },
  {
    id: "matrix",
    label: { bn: "RSC বনাম Overused CSR", en: "RSC vs overused CSR" },
  },
  {
    id: "takeaway",
    label: { bn: "Production Takeaways", en: "Production takeaways" },
  },
];

export default function ClientSideRenderingTradeOffs() {
  return (
    <article className="doc-prose">
      {/* ── The problem ───────────────────────────────────────────────── */}
      <H2 id="the-problem" anchorOnly>
        সব জায়গায় &apos;use client&apos; লিখে ৩.৫MB বান্ডল
      </H2>

      <p>
        রাত ৮:৩০। ভুলু ভাই একটি নতুন পেজ তৈরি করেছেন। <code>useState</code> আর{" "}
        <code>onClick</code> সহজে ব্যবহারের জন্য তিনি রুটের লেআউট থেকে শুরু করে সমস্ত কম্পোনেন্টের
        একদম উপরে চোখ বন্ধ করে <code>&apos;use client&apos;</code> লিখে দিয়েছেন! প্রোডাকশন বিল্ড
        দিতেই টার্মিনালে ওয়ার্নিং — JS bundle ৩.৫ মেগাবাইট ছাড়িয়ে গেছে। স্লো 3G-তে ৪ সেকেন্ড ধরে
        সাদা স্ক্রিন, আর সার্চ ইঞ্জিন বট পেজের মেটাডেটা পড়তে পারছে না!
      </p>

      <Line name="ভুলু ভাই">
        ফাহিম! React পেজ তো React পেজই! পেজের শুরুতে <code>&apos;use client&apos;</code> লিখে
        দিলে সমস্যা কোথায়? ব্রাউজারে পেজ রেন্ডার হতে এত দেরি হচ্ছে কেন, আর গুগল আমার প্রোডাক্ট পেজ
        ইনডেক্স করছে না কেন?
      </Line>

      <Line name="ফাহিম">
        ভুলু ভাই! আপনি App Router-এর মূল শক্তিকেই নষ্ট করে ফেলেছেন! App Router-এ বাই-ডিফল্ট সব
        কম্পোনেন্ট React Server Component। কিন্তু সব জায়গায়{" "}
        <code>&apos;use client&apos;</code> দেওয়ায় পুরো পেজটি ট্র্যাডিশনাল Client-Side Rendering-এ
        বাধ্য হয়েছে!
      </Line>

      <Line name="নেক্সট-ভাই">
        একদম! অপ্রয়োজনে Client Component ব্যবহার করলে ৩টি মারাত্মক ট্রেড-অফ ফেস করতে হয় — বিশাল
        bundle overhead, SEO degradation, আর স্লো ডিভাইসে hydration latency।
      </Line>

      {/* ── Architecture ──────────────────────────────────────────────── */}
      <H2 id="architecture">১. CSR ট্রেড-অফ আর্কিটেকচার</H2>

      <Diagram>{`┌─────────────────────────────────────────────────────────────────────────┐
│                 CLIENT-SIDE RENDERING (CSR) TRADE-OFFS                  │
└─────────────────────────────────────────────────────────────────────────┘

  [Overuse of 'use client' everywhere] ───▶ Heavy JS bundle (3MB+) sent to browser
                                                    │
        ┌───────────────────────────────────────────┼───────────────────────────────────────────┐
        ▼                                           ▼                                           ▼
【 1. BUNDLE SIZE OVERHEAD 】          【 2. SEO & BOTS IMPACT 】             【 3. CORE WEB VITALS 】
 • Browser downloads React, animation   • Crawlers see an empty shell          • Slow LCP
   libs, chart libs & UI components       <div id="root"></div>                • High TBT
 • CPU-heavy parsing & execution        • Social shares miss OG images         • Laggy on mobile`}</Diagram>

      {/* ── Trade-offs ────────────────────────────────────────────────── */}
      <H2 id="tradeoffs">২. ৩টি প্রধান ট্রেড-অফ</H2>

      <Note>
        <ul>
          <li>
            <strong>Bundle size overhead:</strong> কোনো কম্পোনেন্টে{" "}
            <code>&apos;use client&apos;</code> দেওয়া মাত্র সেই কম্পোনেন্ট ও তার ইমপোর্ট করা সমস্ত
            থার্ড-পার্টি প্যাকেজ (chart, icon, animation লাইব্রেরি) ক্লায়েন্ট বান্ডলে যুক্ত হয়ে
            যায়।
          </li>
          <li>
            <strong>SEO ও social shareability:</strong> CSR-এ কনটেন্ট জাভাস্ক্রিপ্ট রান হওয়ার পর
            তৈরি হয়। যেসব ক্রলার বা সোশ্যাল স্ক্র্যাপার JS এক্সিকিউট করে না, তারা কনটেন্ট ও মেটা
            ট্যাগ না পেয়ে খালি HTML শেল দেখে চলে যায়।
          </li>
          <li>
            <strong>Hydration penalty:</strong> মোবাইল বা স্লো ডিভাইসে ভারী JS parse ও execute
            করতে প্রচুর CPU খরচ হয় — LCP আর TBT মারাত্মকভাবে খারাপ হয়।
          </li>
        </ul>
      </Note>

      {/* ── Implementation ────────────────────────────────────────────── */}
      <H2 id="implementation">৩. Anti-pattern ও সঠিক প্যাটার্ন</H2>

      <H3>❌ Anti-pattern — পুরো পেজই Client Component</H3>

      <CodeBlock filename="app/analytics/page.tsx">{`'use client'; // turns the entire page and its layout into CSR

import { useState } from 'react';
import HeavyChart from 'heavy-chart-library'; // the whole 1.5MB library ships to the client

export default function AnalyticsPage() {
  const [filter, setFilter] = useState('monthly');

  return (
    <div>
      {/* Even this static heading now travels inside the JS bundle */}
      <h1>Analytics Report</h1>
      <HeavyChart filter={filter} />
    </div>
  );
}`}</CodeBlock>

      <H3>🟢 Fix — client boundary পাতায় নামিয়ে আনা</H3>

      <p>
        পেজটি Server Component থাকে, ডেটা ফেচিং সার্ভারেই হয়, আর ইন্টার‌্যাক্টিভ উইজেটটুকু আলাদা
        ক্লায়েন্ট বাউন্ডারিতে থাকে।
      </p>

      <CodeBlock filename="app/analytics/page.tsx">{`import { Suspense } from 'react';
import { ChartLoader } from './_components/chart-loader';

export default async function AnalyticsPage() {
  // DB fetching happens purely on the server — zero client JS footprint
  const reportSummary = await getReportSummaryFromDB();

  return (
    <div className="max-w-4xl mx-auto py-8 px-6 text-slate-100 space-y-6">
      {/* Static server content */}
      <div className="border-b border-slate-800 pb-4">
        <span className="text-xs font-mono text-emerald-400 bg-emerald-500/10 px-2 py-1 rounded">
          Server Component (RSC)
        </span>
        <h1 className="text-2xl font-bold mt-2">{reportSummary.title}</h1>
      </div>

      {/* The client boundary is pushed down to the interactive widget only */}
      <Suspense fallback={<div className="h-64 bg-slate-900 animate-pulse rounded-xl" />}>
        <ChartLoader initialData={reportSummary.chartData} />
      </Suspense>
    </div>
  );
}`}</CodeBlock>

      <p>
        ভারী চার্ট লাইব্রেরিটি lazy-load করতে <code>next/dynamic</code> ব্যবহার হয়। খেয়াল রাখুন —{" "}
        <code>ssr: false</code> শুধু Client Component-এর ভেতরেই দেওয়া যায়, তাই{" "}
        <code>dynamic()</code> কলটি একটি ছোট ক্লায়েন্ট র‍্যাপারে রাখা হয়েছে:
      </p>

      <CodeBlock filename="app/analytics/_components/chart-loader.tsx">{`'use client';

import dynamic from 'next/dynamic';

// Lazily load the heavy chart bundle only when this widget actually mounts
const ChartWidget = dynamic(
  () => import('./chart-widget').then((mod) => mod.ChartWidget),
  {
    ssr: false, // allowed here because this file is a client component
    loading: () => <div className="h-64 bg-slate-900 animate-pulse rounded-xl" />,
  }
);

export function ChartLoader({ initialData }: { initialData: unknown }) {
  return <ChartWidget initialData={initialData} />;
}`}</CodeBlock>

      <Note>
        <p>
          <strong>⚠️ মনে রাখবেন:</strong> Server Component-এর ভেতরে{" "}
          <code>dynamic(..., {"{ ssr: false }"})</code> লিখলে Next.js বিল্ড এরর থ্রো করে — কারণ
          সার্ভারে রেন্ডারিং বন্ধ করার সিদ্ধান্ত ক্লায়েন্টেই নিতে হয়। <code>ssr: false</code>{" "}
          দরকার না হলে সরাসরি ইমপোর্ট করলেই চলে; ক্লায়েন্ট বাউন্ডারিতে Next.js এমনিতেই
          কোড-স্প্লিট করে।
        </p>
      </Note>

      <CodeBlock filename="app/analytics/_components/chart-widget.tsx">{`'use client';

import { useState } from 'react';

export function ChartWidget({ initialData }: { initialData: unknown }) {
  // Client state stays contained in this small leaf component
  const [view, setView] = useState('monthly');

  return (
    <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-sm font-semibold text-slate-300">Data Visualization</h3>
        <button
          onClick={() => setView(view === 'monthly' ? 'yearly' : 'monthly')}
          className="text-xs bg-slate-800 hover:bg-slate-700 px-3 py-1.5 rounded-lg text-emerald-400 font-mono"
        >
          View: {view}
        </button>
      </div>
      <div className="h-48 flex items-center justify-center text-slate-500 text-xs border border-dashed border-slate-800 rounded-xl">
        [Rendered interactive chart for {view}]
      </div>
    </div>
  );
}`}</CodeBlock>

      {/* ── Matrix ────────────────────────────────────────────────────── */}
      <H2 id="matrix">৪. RSC বনাম Overused CSR</H2>

      <Table
        head={[
          "ডাইমেনশন",
          "Server Components (RSC)",
          <>
            Overused CSR (<code>&apos;use client&apos;</code>)
          </>,
        ]}
        rows={[
          [
            "JS bundle impact",
            "০ KB — ক্লায়েন্ট বান্ডলে কিছুই যোগ হয় না",
            "মেগাবাইট মাপের জাভাস্ক্রিপ্ট যুক্ত হয়",
          ],
          [
            "SEO & crawlers",
            "প্রি-রেন্ডার্ড HTML, সম্পূর্ণ SEO-friendly",
            "ক্রলার খালি shell দেখে",
          ],
          [
            "Initial load (FCP)",
            "ইনস্ট্যান্ট ভিজ্যুয়াল রেন্ডার",
            "JS ডাউনলোড ও parse শেষ হওয়া পর্যন্ত অপেক্ষা",
          ],
          [
            "Best use cases",
            "Data fetching, static UI, layout, content",
            "Form input, modal, state-driven interactive UI",
          ],
        ]}
      />

      <Line name="ভুলু ভাই">
        অসাধারণ শিক্ষা! পেজকে Server Component রেখে শুধু চার্ট আর বাটনের মতো ছোট অংশে{" "}
        <code>&apos;use client&apos;</code> রাখাতে বান্ডল সাইজ ৩.৫ মেগাবাইট থেকে কমে মাত্র ৪৫
        কিলোবাইটে চলে এসেছে!
      </Line>

      {/* ── Takeaways ─────────────────────────────────────────────────── */}
      <H2 id="takeaway">Production Takeaways</H2>

      <Note>
        <ul>
          <li>
            <strong>Push client components to the leaves:</strong> কখনো পুরো পেজ বা লেআউটে{" "}
            <code>&apos;use client&apos;</code> দেবেন না — পেজ Server Component রেখে শুধু
            ইন্টার‌্যাক্টিভ বাটন বা উইজেটে বাউন্ডারি টানুন।
          </li>
          <li>
            <strong>next/dynamic for heavy libraries:</strong> rich text editor বা charting
            লাইব্রেরির মতো ভারী প্যাকেজ lazy-load করুন — মনে রাখবেন <code>ssr: false</code> শুধু
            ক্লায়েন্ট কম্পোনেন্টের ভেতরে বৈধ।
          </li>
          <li>
            <strong>Protect SEO content on the server:</strong> যে লেখা, প্রোডাক্ট বিবরণ বা
            মেটাডেটা সার্চ ইঞ্জিনে আসা জরুরি, সেগুলো সবসময় Server Component-এর ভেতরে রাখুন।
          </li>
        </ul>
      </Note>
    </article>
  );
}
