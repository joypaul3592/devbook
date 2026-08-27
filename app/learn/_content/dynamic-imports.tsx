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
      bn: "ক্লিকের পর ১.৫ সেকেন্ডের গ্যাপ",
      en: "A 1.5s gap after the click",
    },
  },
  {
    id: "architecture",
    label: {
      bn: "Lazy loading বনাম intent-based preloading",
      en: "Lazy loading vs intent-based preloading",
    },
  },
  {
    id: "mechanisms",
    label: {
      bn: "৩টি অ্যাডভান্সড মেকানিজম",
      en: "Three advanced mechanisms",
    },
  },
  {
    id: "implementation",
    label: {
      bn: "Naive dynamic import বনাম preloaded",
      en: "Naive vs preloaded dynamic import",
    },
  },
  {
    id: "matrix",
    label: { bn: "Loading Strategy Matrix", en: "Loading strategy matrix" },
  },
  {
    id: "takeaway",
    label: { bn: "Production Takeaways", en: "Production takeaways" },
  },
];

export default function DynamicImports() {
  return (
    <article className="doc-prose">
      {/* ── The problem ───────────────────────────────────────────────── */}
      <H2 id="the-problem" anchorOnly>
        ক্লিকের পর ১.৫ সেকেন্ডের গ্যাপ
      </H2>

      <p>
        দুপুর ২:১৫। ভুলু ভাই তার অ্যাডমিন প্যানেলে ইউজার রিপোর্ট জেনারেট করার জন্য{" "}
        <code>jspdf</code> ও <code>html2canvas</code> লাইব্রেরিওয়ালা একটি বিশাল PDF Generator
        কম্পোনেন্ট <code>next/dynamic</code> দিয়ে লোড করেছেন। কিন্তু ইউজার যখন &quot;Download
        PDF&quot; বাটনে ক্লিক করছে, তখন নেটওয়ার্ক রিকোয়েস্ট শুরু হয়ে জাভাস্ক্রিপ্ট চ্যাঙ্ক লোড হতে
        এবং মডাল রেন্ডার হতে ১.৫ সেকেন্ডের একটা ভিজ্যুয়াল গ্যাপ তৈরি হচ্ছে।
      </p>

      <Line name="ভুলু ভাই">
        ফাহিম! <code>next/dynamic</code> দিয়ে তো মেইন বান্ডল সাইজ ২ MB কমিয়ে ফেললাম! কিন্তু ইউজার
        বাটনে ক্লিক করার পরই কেন চ্যাঙ্ক ডাউনলোডের জন্য এতটুকু ল্যাগ হচ্ছে? আর কোনো Named Export ফাইল
        dynamic import করতে গেলে কেন TypeScript টাইপ এরর দিচ্ছে?
      </Line>

      <Line name="ফাহিম">
        ভুলু ভাই! আপনি Lazy Loading করেছেন ঠিকই, কিন্তু{" "}
        <strong>Intent-Based Preloading</strong> করেননি! ইউজার যখন বাটনের ওপর মাউস হভার করবে বা ফোকাস
        করবে, তখনই যদি চ্যাঙ্কটি প্রি-লোড করা যায়, তবে ক্লিক করার সাথে সাথে ইন্টারফেস ইনস্ট্যান্ট
        রেন্ডার হয়ে যাবে।
      </Line>

      <Line name="নেক্সট-ভাই">
        একদম! Next.js 15 (App Router)-এ <code>next/dynamic</code> আসলে React-এর{" "}
        <code>React.lazy()</code> ও <code>Suspense</code>-এর ওপর তৈরি একটি হাই-লেভেল অ্যাবস্ট্রাকশন।
        এটি SSR হাইড্রেশন বাউন্ডারি ম্যানেজ করতে এবং Named Export হ্যান্ডেল করতে বাড়তি সুবিধা দেয়।
      </Line>

      {/* ── Architecture ──────────────────────────────────────────────── */}
      <H2 id="architecture">১. Lazy Loading vs. Intent-Based Preloading Timeline</H2>

      <Diagram>{`┌─────────────────────────────────────────────────────────────────────────┐
│              DYNAMIC IMPORT & PRELOAD EXECUTION TIMELINE                │
└─────────────────────────────────────────────────────────────────────────┘

 ❌ NAIVE LAZY LOADING (fetch on click)
 ┌───────────────────────────────────────────────────────────────────────┐
 │ User clicks button ──► trigger state ──► fetch JS chunk (network wait)│
 │                                                  │                    │
 │                                                  ▼                    │
 │                                      🔴 1.5s lag / spinner delay      │
 └───────────────────────────────────────────────────────────────────────┘

───────────────────────────────────────────────────────────────────────────

 🟢 INTENT-BASED PRELOADING (fetch on hover / focus)
 ┌───────────────────────────────────────────────────────────────────────┐
 │ User hovers mouse ──► preload JS chunk in the background              │
 │                            │                                          │
 │                            ▼                                          │
 │ User clicks button ──► chunk already cached ──► 🟢 instant UI render  │
 └───────────────────────────────────────────────────────────────────────┘`}</Diagram>

      {/* ── Mechanisms ────────────────────────────────────────────────── */}
      <H2 id="mechanisms">২. Dynamic Import-এর ৩টি অ্যাডভান্সড মেকানিজম</H2>

      <p>
        <strong>Named export handling:</strong> <code>next/dynamic</code> বাই-ডিফল্ট মডিউলের{" "}
        <code>default</code> এক্সপোর্ট প্রত্যাশা করে। কোনো ফাইল থেকে Named Export (যেমন{" "}
        <code>export function PdfReport()</code>) ইমপোর্ট করতে{" "}
        <code>.then((mod) =&gt; mod.PdfReport)</code> এক্সপ্লিসিটলি রিটার্ন করতে হয়।
      </p>

      <p>
        <strong>SSR opt-out boundary (ssr: false):</strong> ব্রাউজার-স্পেসিফিক API (<code>window</code>,{" "}
        <code>document</code>, HTML5 Canvas) নির্ভর ভারী কম্পোনেন্টগুলোকে Server-Side Rendering থেকে
        পুরোপুরি বাদ দিয়ে শুধু ক্লায়েন্ট-সাইডে রেন্ডার করতে <code>ssr: false</code> ব্যবহার করা হয়।
      </p>

      <p>
        <strong>Intent-based preloading strategy:</strong> ইউজার কোনো অ্যাকশন নেওয়ার আগ মুহূর্তেই
        (মাউস হভার বা ইনপুট ফোকাসে) প্রোগ্র্যাম্যাটিক্যালি <code>import()</code> কল চালিয়ে চ্যাঙ্ক
        ক্যাশ করাকে Preloading বলে।
      </p>

      {/* ── Implementation ────────────────────────────────────────────── */}
      <H2 id="implementation">৩. Production Code Implementation</H2>

      <H3>❌ Anti-pattern — Preload ছাড়া naive dynamic import</H3>

      <CodeBlock filename="app/reports/legacy-export.tsx">{`// 🔴 POOR PRACTICE: a naive dynamic import with no preloading or fallback state
'use client';

import { useState } from 'react';
import dynamic from 'next/dynamic';

// 🔴 Anti-pattern 1: no skeleton loader, so the swap causes layout shift (CLS)
// 🔴 Anti-pattern 2: an unhandled named export blows up at the type level
const PdfGenerator = dynamic(() => import('@/components/PdfReportGenerator'));

export function LegacyExportButton() {
  const [open, setOpen] = useState(false);

  return (
    <div>
      {/* 🔴 The network request only fires after the click — a noticeable delay */}
      <button
        onClick={() => setOpen(true)}
        className="px-4 py-2 bg-red-600 text-white rounded"
      >
        Export PDF
      </button>

      {open && <PdfGenerator />}
    </div>
  );
}`}</CodeBlock>

      <H3>🟢 Production pattern — Named export, skeleton ও hover preload</H3>

      <CodeBlock filename="components/PdfReportGenerator.tsx">{`'use client';

// A heavy component exported by name
export function PdfReportGenerator({ reportId }: { reportId: string }) {
  return (
    <div className="p-6 bg-slate-900 border border-slate-800 rounded-xl space-y-3">
      <h3 className="text-lg font-bold text-slate-100">PDF Report Engine</h3>
      <p className="text-sm text-slate-400">Processing ID: {reportId}</p>
      <div className="p-4 bg-slate-950 rounded border border-slate-800 font-mono text-xs text-indigo-400">
        [Heavy canvas & vector graphics rendered]
      </div>
    </div>
  );
}`}</CodeBlock>

      <CodeBlock filename="app/reports/page.tsx">{`'use client';

import { useState } from 'react';
import dynamic from 'next/dynamic';

// 🟢 The loader lives outside the component scope so it can be called to preload
const loadPdfGenerator = () => import('@/components/PdfReportGenerator');

// 🟢 Named export + custom skeleton fallback + client-only execution
const DynamicPdfReport = dynamic(
  () => loadPdfGenerator().then((mod) => mod.PdfReportGenerator),
  {
    loading: () => (
      <div className="p-6 bg-slate-900 border border-slate-800 rounded-xl animate-pulse text-slate-500 text-sm">
        ⚡ Preparing PDF generation engine...
      </div>
    ),
    ssr: false, // 🟢 Bypass server-side evaluation for browser-only canvas code
  },
);

export function OptimizedReportPage() {
  const [isOpen, setIsOpen] = useState(false);

  // 🟢 Preload the chunk as soon as the pointer reaches the trigger
  const handleMouseEnter = () => {
    loadPdfGenerator();
  };

  return (
    <div className="p-8 max-w-2xl mx-auto space-y-6 bg-slate-950 text-slate-100 min-h-screen">
      <div className="space-y-2">
        <h1 className="text-2xl font-bold">Report Analytics</h1>
        <p className="text-sm text-slate-400">
          Heavy JS chunks are code-split and preloaded on hover.
        </p>
      </div>

      <div className="flex gap-4">
        <button
          onClick={() => setIsOpen(true)}
          onMouseEnter={handleMouseEnter} // 🟢 Intent-based preloading
          onFocus={handleMouseEnter}      // 🟢 Same preload for keyboard users
          className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white font-medium text-sm rounded-lg transition-colors focus:ring-2 focus:ring-indigo-400 outline-none"
        >
          Download PDF report
        </button>
      </div>

      {/* 🟢 By the time this renders, the chunk is usually already cached */}
      {isOpen && <DynamicPdfReport reportId="REP-2026-9901" />}
    </div>
  );
}`}</CodeBlock>

      {/* ── Matrix ────────────────────────────────────────────────────── */}
      <H2 id="matrix">৪. Dynamic Loading Strategy Matrix</H2>

      <Table
        head={["ব্যবহার", "স্ট্র্যাটেজি", "SSR", "সুবিধা"]}
        rows={[
          [
            "Heavy modal / drawer",
            <span key="c">
              <code>next/dynamic</code> + preload
            </span>,
            <code key="c">false</code>,
            "মেইন বান্ডল হালকা হয়, আর ক্লিকেই ইনস্ট্যান্ট লোড",
          ],
          [
            "Rich text / code editor",
            <span key="c">
              <code>next/dynamic</code> + loading skeleton
            </span>,
            <code key="c">false</code>,
            "ব্রাউজার-DOM এরর রোধ করে ও layout shift আটকায়",
          ],
          [
            "Named export components",
            <code key="c">{".then((mod) => mod.Named)"}</code>,
            "true (optional)",
            "ফাইল স্ট্রাকচার রিফ্যাক্টর না করেই কোড-স্প্লিট করা যায়",
          ],
          [
            "Critical viewport features",
            "Standard static import",
            <code key="c">true</code>,
            "LCP (Largest Contentful Paint) পারফরম্যান্স বজায় থাকে",
          ],
        ]}
      />

      <Line name="ভুলু ভাই">
        অসাধারণ! এখন থেকে যেকোনো ভারী ইন্টার‍্যাক্টিভ মডাল বা উইজেটে <code>next/dynamic</code>-এর
        পাশাপাশি <code>onMouseEnter</code>-এ চ্যাঙ্ক প্রি-লোড করে দেব! বান্ডল সাইজও ছোট থাকবে, আবার
        ইউজারের অভিজ্ঞতাও হবে মাখনের মতো স্মুথ।
      </Line>

      {/* ── Takeaways ─────────────────────────────────────────────────── */}
      <H2 id="takeaway">Production Takeaways</H2>

      <Note>
        <ul>
          <li>
            <strong>Always provide skeleton fallbacks:</strong>{" "}
            <code>{"loading: () => <Skeleton />"}</code> দিয়ে Cumulative Layout Shift রোধ করুন।
          </li>
          <li>
            <strong>Combine preloading with dynamic imports:</strong> অন-ক্লিক ল্যাগ দূর করতে{" "}
            <code>onMouseEnter</code> ও <code>onFocus</code> ইভেন্টে <code>import()</code> প্রমিস কল
            দিয়ে ফাইল প্রি-লোড করুন।
          </li>
          <li>
            <strong>Opt out of SSR for DOM-specific libraries:</strong> যেসব লাইব্রেরির{" "}
            <code>window</code> বা <code>document</code> অবজেক্টের ওপর কড়া নির্ভরতা রয়েছে, সেখানে{" "}
            <code>ssr: false</code> বাধ্যতামূলক।
          </li>
        </ul>
      </Note>
    </article>
  );
}
