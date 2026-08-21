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
      bn: "লগইন পেজে ১.৮ মেগাবাইট",
      en: "1.8 MB on the login page",
    },
  },
  {
    id: "mental-model",
    label: { bn: "Code Splitting-এর মানচিত্র", en: "The code-splitting model" },
  },
  {
    id: "vs-react-lazy",
    label: {
      bn: "next/dynamic বনাম React.lazy",
      en: "next/dynamic vs React.lazy",
    },
  },
  {
    id: "implementation",
    label: { bn: "প্রোডাকশন ইমপ্লিমেন্টেশন", en: "Production implementation" },
  },
  {
    id: "matrix",
    label: { bn: "ফিচার ম্যাট্রিক্স", en: "Feature matrix" },
  },
  {
    id: "takeaway",
    label: { bn: "Production Takeaways", en: "Production takeaways" },
  },
];

export default function DynamicImportsCodeSplitting() {
  return (
    <article className="doc-prose">
      {/* ── The problem ───────────────────────────────────────────────── */}
      <H2 id="the-problem" anchorOnly>
        লগইন পেজে ১.৮ মেগাবাইট
      </H2>

      <p>
        রাত ১১টা। ভুলু ভাই একটি ইন্টারঅ্যাক্টিভ অ্যানালিটিক্স ড্যাশবোর্ড তৈরি করছেন।
        ড্যাশবোর্ডে হেভি চার্ট লাইব্রেরি Chart.js, PDF জেনারেটর, আর একটি Rich Text Editor
        যুক্ত করার পরেই বিপত্তি! ইউজাররা কেবল লগইন পেজে ঢোকার চেষ্টা করলেই ১.৮ মেগাবাইটের
        বিশাল জাভাস্ক্রিপ্ট বান্ডেল ডাউনলোড হওয়া শুরু হচ্ছে।
      </p>

      <Line name="ভুলু ভাই">
        (মাথায় হাত দিয়ে) নেক্সট-ভাই! ক্লায়েন্ট আমাকে সাইটের প্রথম লোড টাইমের জন্য বকা
        দিচ্ছে! ইউজার তো এখনো PDF Export বাটনে ক্লিকই করেনি! তাহলে এখনই কেন পুরো চার্ট আর
        PDF লাইব্রেরির কোড ডাউনলোড হচ্ছে?!
      </Line>

      <Line name="নেক্সট-ভাই">
        (কফিতে চুমুক দিয়ে) ভুলু, কারণ তুই সব ভারী কম্পোনেন্টকে পেজের টপে Static Import করে
        রেখেছিস!
      </Line>

      <CodeBlock filename="static-import.ts">{`// ❌ Static import: loads ALL of this code upfront, in the initial bundle
import HeavyChart from '@/components/HeavyChart';
import RichTextEditor from '@/components/RichTextEditor';`}</CodeBlock>

      <Line name="নেক্সট-ভাই">
        এভাবে ইমপোর্ট করলে ব্রাউজার প্রথমবার পেজে ঢোকার মুহূর্তেই অপ্রয়োজনীয় সব ভারী
        থার্ড-পার্টি লাইব্রেরির কোড ডাউনলোড করতে বাধ্য হয়! আর এখানেই উদ্ধার করতে আসে{" "}
        <strong>Code Splitting</strong> এবং <strong>Dynamic Imports</strong>।
      </Line>

      {/* ── Mental model ──────────────────────────────────────────────── */}
      <H2 id="mental-model">১. Code Splitting-এর মানচিত্র</H2>

      <Diagram>{`[ Static Bundle ]  ──► [ Initial Load: 1.8 MB (Heavy & slow LCP/INP) ]

[ Code Splitting ] ──► [ Initial Page Load: 200 KB (Fast) ]
                           ├── User scrolls to chart ──► load chart-chunk.js (500 KB)
                           └── User clicks Export ────► load pdf-chunk.js  (800 KB)`}</Diagram>

      {/* ── vs React.lazy ─────────────────────────────────────────────── */}
      <H2 id="vs-react-lazy">২. next/dynamic বনাম React.lazy</H2>

      <Line name="ভুলু ভাই">
        ভাই! রিয়েক্টের তো নিজস্ব <code>React.lazy()</code> এবং{" "}
        <code>&lt;Suspense&gt;</code> আছেই। তাহলে Next.js-এ কেন <code>next/dynamic</code>{" "}
        ব্যবহার করতে হবে?
      </Line>

      <Line name="নেক্সট-ভাই">
        চমৎকার প্রশ্ন! <code>React.lazy()</code> শুধুমাত্র ক্লায়েন্ট-সাইড CSR-এর জন্য কাজ
        করে — সার্ভার-সাইড রেন্ডারিংয়ে ফেল মারে। অন্যদিকে <code>next/dynamic</code> হলো{" "}
        <code>React.lazy()</code> ও Suspense-এর ওপর তৈরি একটি অ্যাডভান্সড র‍্যাপার, যা SSR
        সাপোর্ট করে এবং সার্ভার ও ক্লায়েন্ট দুই স্তরেই অটোমেটিক কোড স্প্লিটিং করে।
      </Line>

      {/* ── Implementation ────────────────────────────────────────────── */}
      <H2 id="implementation">৩. প্রোডাকশন ইমপ্লিমেন্টেশন</H2>

      <H3>Scenario 1 — Loading UI সহ হেভি কম্পোনেন্ট</H3>

      <CodeBlock filename="app/dashboard/page.tsx">{`'use client';

import { useState } from 'react';
import dynamic from 'next/dynamic';

// ⚡ Dynamic import with a fallback UI while the chunk downloads
const DynamicHeavyChart = dynamic(() => import('@/components/HeavyChart'), {
  loading: () => <div className="h-64 w-full animate-pulse bg-gray-200 rounded-lg" />,
});

export default function DashboardPage() {
  const [showChart, setShowChart] = useState(false);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold">Analytics Dashboard</h1>

      <button
        onClick={() => setShowChart(true)}
        className="px-4 py-2 bg-blue-600 text-white rounded mt-4"
      >
        Show Heavy Analytics Chart
      </button>

      {/* The chunk downloads ONLY once showChart flips to true */}
      {showChart && <DynamicHeavyChart />}
    </div>
  );
}`}</CodeBlock>

      <H3>Scenario 2 — Browser-only লাইব্রেরিতে ssr: false</H3>

      <Line name="ভুলু ভাই">
        ভাই! কিছু প্লাগইন (Leaflet Maps, Canvas, বা <code>window</code> ডিপেন্ডেন্ট
        লাইব্রেরি) সার্ভারে রেন্ডার হতে গেলেই <code>window is not defined</code> এরর দেয়!
        সেটার কী উপায়?
      </Line>

      <CodeBlock filename="app/map/page.tsx">{`import dynamic from 'next/dynamic';

// 🚀 Completely disables SSR for browser-only libraries (Leaflet / Canvas)
const InteractiveMap = dynamic(() => import('@/components/InteractiveMap'), {
  ssr: false,
  loading: () => <p>Loading Interactive Map…</p>,
});

export default function MapPage() {
  return (
    <main>
      <h1>Store Locator</h1>
      <InteractiveMap />
    </main>
  );
}`}</CodeBlock>

      <H3>Scenario 3 — অন-ডিমান্ড ফাংশন ইমপোর্ট</H3>

      <CodeBlock filename="app/reports/page.tsx">{`'use client';

export default function ReportPage() {
  const handleExportPDF = async () => {
    // ⚡ Heavy library imported ONLY when the button is actually clicked
    const { generatePdfReport } = await import('@/lib/pdfGenerator');
    await generatePdfReport();
  };

  return (
    <button onClick={handleExportPDF} className="btn-primary">
      Export PDF Report
    </button>
  );
}`}</CodeBlock>

      {/* ── Matrix ────────────────────────────────────────────────────── */}
      <H2 id="matrix">৪. ফিচার ম্যাট্রিক্স</H2>

      <Table
        head={[
          "ফিচার",
          <code key="react-lazy">React.lazy()</code>,
          <code key="next-dynamic">next/dynamic</code>,
        ]}
        rows={[
          [
            "Server-Side Rendering",
            "❌ কাজ করে না (CSR only)",
            "✅ ফুললি সমর্থিত",
          ],
          ["SSR Bypass", "❌ অসম্ভব", <code key="ssr-false">{"{ ssr: false }"}</code>],
          [
            "Fallback Skeleton",
            "Suspense Boundary নিজে দিতে হয়",
            <>
              ✅ ইনবিল্ট <code>loading</code> অপশন
            </>,
          ],
          [
            "Named Export",
            <>
              ম্যানুয়াল <code>.then()</code> চেইনিং
            </>,
            <>
              ✅ <code>.then(mod =&gt; mod.Named)</code> সাপোর্ট
            </>,
          ],
        ]}
      />

      <Line name="ভুলু ভাই">
        (উচ্ছ্বসিত হয়ে) দারুণ! Chart.js আর Rich Text Editor-কে <code>next/dynamic</code>{" "}
        দিয়ে র‍্যাপ করলাম, Leaflet Map-এ <code>{"{ ssr: false }"}</code> বসাতেই{" "}
        <code>window is not defined</code> এরর গায়েব! ইনিশিয়াল জাভাস্ক্রিপ্ট ১.৮ মেগাবাইট
        থেকে নেমে ১৮০ কিলোবাইট! 🔥
      </Line>

      {/* ── Takeaways ─────────────────────────────────────────────────── */}
      <H2 id="takeaway">Production Takeaways</H2>

      <Note>
        <ul>
          <li>
            <strong>Don&apos;t Over-Split:</strong> ছোট ৩-৪ লাইনের কম্পোনেন্ট ডাইনামিক
            ইমপোর্ট করার দরকার নেই — অতিরিক্ত স্প্লিটিং অনেকগুলো HTTP রিকোয়েস্ট তৈরি করে
            নেটওয়ার্ক ওভারহেড বাড়ায়।
          </li>
          <li>
            <strong>Above vs Below the Fold:</strong> ভিউপোর্টের ওপরের হিরো কন্টেন্ট কখনো
            dynamic import করবেন না; নিচের ভারী মোডাল, চার্ট ও উইজেটের জন্য এটি অনিবার্য।
          </li>
          <li>
            <strong>Combine with Suspense:</strong> React-এর স্ট্রিমড সার্ভার রেন্ডারিংয়ের
            সাথে <code>next/dynamic</code> চমৎকার সমন্বয়ে কাজ করে।
          </li>
        </ul>
      </Note>
    </article>
  );
}
