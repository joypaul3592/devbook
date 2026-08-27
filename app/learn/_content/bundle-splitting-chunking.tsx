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
      bn: "৯৫% ইউজার যা কখনো খোলেই না",
      en: "What 95% of users never open",
    },
  },
  {
    id: "architecture",
    label: {
      bn: "Monolithic bundle বনাম granular chunk",
      en: "Monolithic bundle vs granular chunks",
    },
  },
  {
    id: "mechanisms",
    label: {
      bn: "Splitting-এর ৩টি মেকানিজম",
      en: "Three splitting mechanisms",
    },
  },
  {
    id: "implementation",
    label: {
      bn: "Static import বনাম next/dynamic",
      en: "Static import vs next/dynamic",
    },
  },
  {
    id: "matrix",
    label: { bn: "Chunking Decision Matrix", en: "Chunking decision matrix" },
  },
  {
    id: "takeaway",
    label: { bn: "Production Takeaways", en: "Production takeaways" },
  },
];

export default function BundleSplittingChunking() {
  return (
    <article className="doc-prose">
      {/* ── The problem ───────────────────────────────────────────────── */}
      <H2 id="the-problem" anchorOnly>
        ৯৫% ইউজার যা কখনো খোলেই না
      </H2>

      <p>
        দুপুর ১:৪৫। ভুলু ভাই তার অ্যাপের অ্যাডমিন ড্যাশবোর্ডে একটি ভারী Recharts গ্রাফ এবং
        React-Quill এডিটর যোগ করার পর দেখলেন — প্রথমবার পেজ লোড হতেই প্রায় ৩ সেকেন্ড সময় লাগছে!
        অথচ চার্ট ও এডিটরটি পেজের একদম নিচে একটি গোপন &quot;Report Modal&quot;-এর ভেতরে থাকে, যা ৯৫%
        ইউজার কখনো খোলেই না।
      </p>

      <Line name="ভুলু ভাই">
        ফাহিম! ইউজার তো মডালে ক্লিক করার আগে চার্ট বা এডিটর দেখতেই পাবে না! তাও কেন পেজে ঢোকার সাথে
        সাথে পুরো ৩ MB-র JavaScript ফাইল ডাউনলোড হয়ে পেজ স্লো করে দিচ্ছে?
      </Line>

      <Line name="ফাহিম">
        ভুলু ভাই! কারণ আপনি টপ-লেভেলে স্ট্যাটিক ইমপোর্ট (<code>import</code>) করে রেখেছেন! Next.js
        বান্ডলার ধরে নিয়েছে এই ভারী লাইব্রেরিগুলো পেজের ফার্স্ট রেন্ডারেই লাগবে। ফলে এগুলোকে মেইন
        পেজ বান্ডলের ভেতরে ঢুকিয়ে একটি দানবীয় <strong>Monolithic Chunk</strong> বানিয়ে ফেলেছে।
      </Line>

      <Line name="নেক্সট-ভাই">
        একদম! <strong>Bundle Splitting &amp; Granular Chunking</strong>-এর মূল উদ্দেশ্য হলো
        জাভাস্ক্রিপ্ট বান্ডলকে ছোট ছোট স্বাধীন chunk-এ ভেঙে ফেলা — যাতে পেজ লোডের সময় শুধু
        প্রয়োজনীয় ফাস্ট-ভিউ চ্যাঙ্ক ডাউনলোড হয়, আর ভারী মডিউলগুলো কেবল তখনই লোড হয় যখন ইউজার
        সেগুলোতে ইন্টার‍্যাক্ট করে।
      </Line>

      {/* ── Architecture ──────────────────────────────────────────────── */}
      <H2 id="architecture">১. Monolithic Bundle vs. Granular Chunking Architecture</H2>

      <Diagram>{`┌─────────────────────────────────────────────────────────────────────────┐
│               MONOLITHIC BUNDLE VS. GRANULAR CHUNKING                   │
└─────────────────────────────────────────────────────────────────────────┘

 ❌ MONOLITHIC BUNDLE (Static Top-Level Imports)
 ┌───────────────────────────────────────────────────────────────────────┐
 │ page.js (Core UI + Recharts + RichTextEditor + PDF Export)            │
 └──────────────────────────────────┬────────────────────────────────────┘
                                    │ Single massive download (3.2 MB)
                                    ▼
                 🔴 High TBT (Total Blocking Time) & slow LCP

───────────────────────────────────────────────────────────────────────────

 🟢 OPTIMIZED GRANULAR CHUNKS (Next.js 15 split boundaries)
 ┌───────────────────────────────────────────────────────────────────────┐
 │ Initial route chunk: page.js (core minimal UI) ──► 🟢 45 KB, fast     │
 └──────────────────────────────────┬────────────────────────────────────┘
                                    │
        ├── Dynamic async chunk #1 (recharts.js) ──► downloaded on demand
        └── Dynamic async chunk #2 (editor.js)   ──► downloaded on modal open`}</Diagram>

      {/* ── Mechanisms ────────────────────────────────────────────────── */}
      <H2 id="mechanisms">২. Bundle Splitting-এর ৩টি গুরুত্বপূর্ণ মেকানিজম</H2>

      <p>
        <strong>Automatic route-based splitting:</strong> Next.js 15 App Router বাই-ডিফল্ট প্রতিটি
        রুট (<code>/dashboard</code>, <code>/settings</code>) এবং Server / Client boundary আলাদা
        আলাদা চ্যাঙ্কে ভাগ করে ফেলে। ফলে এক পেজের জাভাস্ক্রিপ্ট অন্য পেজের লোড সাইজ বড় করে না।
      </p>

      <p>
        <strong>Granular chunks strategy:</strong> Next.js-এর ইন্টার্নাল Bundler (Turbopack /
        Webpack) থার্ড-পার্টি ডিপেন্ডেন্সিগুলোকে অটোমেটিক্যালি ছোট ছোট রি-ইউজেবল শেয়ার্ড চ্যাঙ্কে
        (Framework chunk, Commons chunk, Shared node_modules chunk) ভাগ করে — যাতে ব্রাউজার ক্যাশিং
        সর্বোচ্চ কার্যকর হয়।
      </p>

      <p>
        <strong>Dynamic code-split boundaries:</strong> অ্যাপ্লিকেশনের কোনো ভারী ভিজ্যুয়াল এলিমেন্ট
        (Complex Charts, PDF Exporter, Rich Text Editor) যদি পেজের প্রাথমিক ভিউতে (above-the-fold) না
        লাগে, তবে সেগুলোকে <code>next/dynamic</code> বা <code>React.lazy</code> দিয়ে আলাদা async
        chunk হিসেবে স্প্লিট করে দেওয়া হয়।
      </p>

      {/* ── Implementation ────────────────────────────────────────────── */}
      <H2 id="implementation">৩. Production Code Implementation</H2>

      <H3>❌ Anti-pattern — Static heavy import যা initial chunk ফুলিয়ে দেয়</H3>

      <CodeBlock filename="app/dashboard/heavy-page.tsx">{`// 🔴 POOR PRACTICE: top-level static imports of heavy third-party packages
'use client';

import { useState } from 'react';
// 🔴 The chart library is statically bundled into the page load (~280 KB)
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

const dummyData = [
  { name: 'Jan', val: 400 },
  { name: 'Feb', val: 300 },
  { name: 'Mar', val: 600 },
];

export function HeavyDashboardPage() {
  const [showChart, setShowChart] = useState(false);

  return (
    <div className="p-6 space-y-4 bg-slate-950 text-slate-100 min-h-screen">
      <h1 className="text-2xl font-bold">Analytics Overview</h1>

      <button
        onClick={() => setShowChart(!showChart)}
        className="px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm font-medium"
      >
        Toggle detailed analytics modal
      </button>

      {/* 🔴 Even while hidden, the Recharts JS was downloaded on initial page load */}
      {showChart && (
        <div className="h-64 w-full p-4 bg-slate-900 border border-slate-800 rounded-xl">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={dummyData}>
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Area type="monotone" dataKey="val" stroke="#6366f1" fill="#6366f1" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
}`}</CodeBlock>

      <H3>🟢 Production pattern — next/dynamic দিয়ে split boundary</H3>

      <CodeBlock filename="components/AnalyticsChartModal.tsx">{`// 🟢 PRODUCTION PATTERN: heavy UI isolated into its own dynamic chunk
'use client';

import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

interface ChartProps {
  data: Array<{ name: string; val: number }>;
}

export default function AnalyticsChartModal({ data }: ChartProps) {
  return (
    <div className="h-64 w-full p-4 bg-slate-900 border border-slate-800 rounded-xl">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data}>
          <XAxis dataKey="name" stroke="#94a3b8" />
          <YAxis stroke="#94a3b8" />
          <Tooltip />
          <Area type="monotone" dataKey="val" stroke="#6366f1" fill="#4f46e5" fillOpacity={0.2} />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}`}</CodeBlock>

      <CodeBlock filename="app/dashboard/page.tsx">{`'use client';

import { useState } from 'react';
import dynamic from 'next/dynamic';

// 🟢 The heavy chart is code-split into a standalone JS chunk.
// It is fetched over the network ONLY when it is actually rendered.
const AnalyticsChartModal = dynamic(
  () => import('@/components/AnalyticsChartModal'),
  {
    loading: () => (
      <div className="h-64 w-full animate-pulse bg-slate-900 border border-slate-800 rounded-xl flex items-center justify-center text-slate-500 text-sm">
        Loading analytics engine...
      </div>
    ),
    ssr: false, // 🟢 Skip SSR for browser-only canvas / SVG code
  },
);

const dummyData = [
  { name: 'Jan', val: 400 },
  { name: 'Feb', val: 300 },
  { name: 'Mar', val: 600 },
];

export function OptimizedDashboardPage() {
  const [showChart, setShowChart] = useState(false);

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-6 bg-slate-950 text-slate-100 min-h-screen">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">Optimized Dashboard</h1>
          <p className="text-sm text-slate-400">Initial JS bundle reduced by ~280 KB.</p>
        </div>

        <button
          onClick={() => setShowChart((prev) => !prev)}
          className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white font-medium text-sm rounded-lg transition-colors"
        >
          {showChart ? 'Close analytics' : 'Load analytics chart'}
        </button>
      </div>

      {/* 🟢 The chunk is downloaded ONLY when showChart becomes true */}
      {showChart && <AnalyticsChartModal data={dummyData} />}
    </div>
  );
}`}</CodeBlock>

      {/* ── Matrix ────────────────────────────────────────────────────── */}
      <H2 id="matrix">৪. Chunking Strategy Decision Matrix</H2>

      <Table
        head={["উপাদান", "স্ট্র্যাটেজি", "বান্ডল সুবিধা"]}
        rows={[
          [
            "Header, Navigation, Core Layout",
            "Static import",
            "প্রাথমিক ফাস্ট রেন্ডারের জন্য প্রয়োজনীয়",
          ],
          [
            "Modal, Drawer, Tab content",
            <span key="c">
              <code>next/dynamic</code> (code-split)
            </span>,
            "উচ্চ 🟢 — ইউজার ইন্টার‍্যাক্ট না করা পর্যন্ত 0 KB",
          ],
          [
            "Heavy libraries (PDF, Excel, Charts)",
            <span key="c">
              Dynamic async chunk (<code>ssr: false</code>)
            </span>,
            "বিশাল ⚡ — মেইন বান্ডল ৫০০ KB+ হালকা হয়",
          ],
          [
            "Client utility functions (lodash)",
            "Named modular import",
            "শুধু নির্দিষ্ট ফাংশনটিই চ্যাঙ্কে যুক্ত হয়",
          ],
        ]}
      />

      <Line name="ভুলু ভাই">
        একদম পরিষ্কার! অন-ডিমান্ড ভিজ্যুয়াল এলিমেন্ট বা ভারী মডালগুলোকে টপ-লেভেলে স্ট্যাটিকালি
        ইমপোর্ট না করে <code>next/dynamic</code> দিয়ে আলাদা চ্যাঙ্কে স্প্লিট করে দেব — যাতে পেজের
        ফার্স্ট লোড রকেটের মতো ফাস্ট হয়!
      </Line>

      {/* ── Takeaways ─────────────────────────────────────────────────── */}
      <H2 id="takeaway">Production Takeaways</H2>

      <Note>
        <ul>
          <li>
            <strong>Identify below-the-fold heavy features:</strong> স্ক্রিনের প্রাথমিক ভিউতে নেই এমন
            বড় ইন্টার‍্যাক্টিভ মডিউল বা মডালগুলো চিহ্নিত করে চ্যাঙ্কে স্প্লিট করুন।
          </li>
          <li>
            <strong>Use ssr: false for browser-only libraries:</strong> যেসব ভারী লাইব্রেরি (Rich
            Text Editor, Canvas) ব্রাউজারের DOM-এর ওপর নির্ভর করে, সেগুলোতে <code>ssr: false</code>{" "}
            সেট করে async chunk তৈরি করুন।
          </li>
          <li>
            <strong>Keep chunk sizes balanced:</strong> অতিরিক্ত ফ্র্যাগমেন্টেশন (হাজার হাজার tiny
            chunk) নেটওয়ার্ক ও HTTP/2 ওভারহেড বাড়ায় — বড় থার্ড-পার্টি প্যাকেজেই dynamic splitting
            সীমাবদ্ধ রাখা বুদ্ধিমানের কাজ।
          </li>
        </ul>
      </Note>
    </article>
  );
}
