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
      bn: "যে মোডাল কেউ খোলেনি, তার ৫০০ KB",
      en: "500 KB for a modal nobody opened",
    },
  },
  {
    id: "architecture",
    label: {
      bn: "Static import বনাম component-level splitting",
      en: "Static import vs component-level splitting",
    },
  },
  {
    id: "mechanisms",
    label: { bn: "৩টি মূল কৌশল", en: "Three core techniques" },
  },
  {
    id: "implementation",
    label: {
      bn: "Top-level import বনাম next/dynamic",
      en: "Top-level import vs next/dynamic",
    },
  },
  {
    id: "matrix",
    label: {
      bn: "Splitting Level Comparison",
      en: "Splitting level comparison",
    },
  },
  {
    id: "takeaway",
    label: { bn: "Production Takeaways", en: "Production takeaways" },
  },
];

export default function ComponentLevelCodeSplitting() {
  return (
    <article className="doc-prose">
      {/* ── The problem ───────────────────────────────────────────────── */}
      <H2 id="the-problem" anchorOnly>
        যে মোডাল কেউ খোলেনি, তার ৫০০ KB
      </H2>

      <p>
        সকাল ১১:০০। ভুলু ভাই তার অ্যাপের <code>/dashboard</code> পেজটি রুট-লেভেল স্প্লিটিং দিয়ে হালকা
        করার পরও দেখছেন ইনিশিয়াল জাভাস্ক্রিপ্ট বান্ডল সাইজ প্রায় ৫০০ KB। কারণ খুঁজতে গিয়ে দেখেন —
        ড্যাশবোর্ডের ভেতরে থাকা একটি &quot;Export Report Modal&quot;-এর রিচ-টেক্সট এডিটর এবং হেভি
        টেবিল ডাটাসেট মডিউল সোজাসুজি টপ-লেভেলে ইমপোর্ট করা রয়েছে।
      </p>

      <Line name="ভুলু ভাই">
        ফাহিম! পেজটি তো আলাদা রুটে চ্যাঙ্ক হয়েছে, কিন্তু ইউজার তো ড্যাশবোর্ডে ঢোকার পর &quot;Export
        Report&quot; বাটনে ক্লিক না করা পর্যন্ত ওই মোডালটি খোলেই না! তাহলেও কেন মোডালের ভেতরকার ৫০০ KB
        জাভাস্ক্রিপ্ট পেজ লোড হওয়ার সময়ই ডাউনলোড হবে?
      </Line>

      <Line name="ফাহিম">
        ভুলু ভাই! রুট-লেভেল স্প্লিটিং শুধু একটি পেজ থেকে আরেকটি পেজকে আলাদা করে। কিন্তু একটি পেজের
        ভেতরে এমন অনেক UI এলিমেন্ট থাকে (Modal, Drawer, Tab, Rich Text Editor, Chart) যেগুলো ইউজার
        ইন্টারঅ্যাকশনের আগে স্ক্রিনে দেখাই যায় না। এগুলোকে বলা হয় Off-screen বা Conditional UI।
      </Line>

      <Line name="নেক্সট-ভাই">
        একদম! এই সমস্যার সমাধান হলো Component-level Code Splitting। এর মাধ্যমে পেজের মূল শেল লোড হওয়ার
        সময় হেভি কম্পোনেন্টকে মেইন চ্যাঙ্ক থেকে পুরোপুরি আলাদা করে একটি স্বাধীন Sub-chunk বানিয়ে রাখা
        হয়। ইউজার যখন বাটনে ক্লিক করে বা মাউস হভার করে, ঠিক তখনই কেবল সেই কম্পোনেন্টের চ্যাঙ্কটি
        নেটওয়ার্ক দিয়ে ডাউনলোড হয়ে ব্রাউজারে লোড হয়।
      </Line>

      {/* ── Architecture ──────────────────────────────────────────────── */}
      <H2 id="architecture">
        ১. Static Component Import vs. Component-Level Code Splitting
      </H2>

      <Diagram>{`┌─────────────────────────────────────────────────────────────────────────┐
│        STATIC COMPONENT IMPORT VS. COMPONENT-LEVEL CODE SPLITTING       │
└─────────────────────────────────────────────────────────────────────────┘

 ❌ STATIC TOP-LEVEL IMPORT (initial bundle bloat)
 User visits: /dashboard (the modal button is hidden)
 ┌───────────────────────────────────────────────────────────────────────┐
 │ /dashboard main JS chunk (550 KB)                                     │
 │ ├── dashboard table UI (50 KB)                                        │
 │ └── heavy report modal + rich text editor (500 KB) ──► 🔴 always sent │
 └──────────────────────────────────┬────────────────────────────────────┘
                                    │ unused code downloaded on page load
                                    ▼
                 🔴 HEAVY INITIAL BUNDLE & SLOW TIME TO INTERACTIVE

───────────────────────────────────────────────────────────────────────────

 🟢 COMPONENT-LEVEL DYNAMIC SPLITTING (on-demand loading)
 User visits: /dashboard (the modal button is hidden)
 ┌───────────────────────────────────────────────────────────────────────┐
 │ /dashboard main JS chunk (50 KB)                                      │
 │ └── dashboard table UI only                                           │
 └──────────────────────────────────┬────────────────────────────────────┘
                                    │ user clicks "Export Report"
                                    ▼
 ┌───────────────────────────────────────────────────────────────────────┐
 │ sub-chunk downloaded on demand: report-modal.js (500 KB)              │
 └───────────────────────────────────────────────────────────────────────┘
                                    ▼
                 🟢 FAST INITIAL LOAD & OPTIMIZED MEMORY USAGE`}</Diagram>

      {/* ── Mechanisms ────────────────────────────────────────────────── */}
      <H2 id="mechanisms">২. Component-Level Code Splitting-এর ৩টি মূল কৌশল</H2>

      <p>
        <strong>Conditional chunk fetching:</strong> কম্পোনেন্টটি রেন্ডার করার ফ্ল্যাগ (যেমন{" "}
        <code>isOpen === true</code>) সত্য না হওয়া পর্যন্ত ব্রাউজার তার নেটওয়ার্ক রিকোয়েস্ট তৈরি করে
        না। এতে পেজ লোডের সময় অপ্রয়োজনীয় কোড বাইপাস করা যায়।
      </p>

      <p>
        <strong>Hover / intent prefetching:</strong> ইউজার যখন বাটনে ক্লিক করার ঠিক আগের মুহূর্তে
        মাউস কার্সার হভার করে (<code>onMouseEnter</code>), তখনই ব্যাকগ্রাউন্ডে ডাইনামিক ইমপোর্ট
        ট্রিগার করে দেওয়া যায়। ফলে ইউজার ক্লিকে কোনো দৃশ্যমান ডিলে অনুভব করেন না।
      </p>

      <p>
        <strong>Tab &amp; sub-tree isolation:</strong> কোনো ড্যাশবোর্ডে একাধিক ট্যাব থাকলে (Overview,
        Analytics, Settings), প্রতিটি ট্যাবের ভেতরের জটিল UI-কে কম্পোনেন্ট-লেভেলে স্প্লিট করে শুধু
        সক্রিয় ট্যাবের কোড রান করানো উচিত।
      </p>

      {/* ── Implementation ────────────────────────────────────────────── */}
      <H2 id="implementation">৩. Production Code Implementation</H2>

      <H3>❌ Anti-pattern — unconditional heavy component import</H3>

      <CodeBlock filename="app/dashboard/legacy-page.tsx">{`// 🔴 POOR PRACTICE: a top-level static import forces 500 KB of editor code into the main bundle
'use client';

import { useState } from 'react';
// 🔴 the heavy library is included immediately on page load
import { HeavyRichTextEditor } from '@/components/HeavyRichTextEditor';

export function DashboardPage() {
  const [isEditorOpen, setIsEditorOpen] = useState(false);

  return (
    <div className="p-8 space-y-4 bg-slate-950 text-slate-100 min-h-screen">
      <h1 className="text-2xl font-bold">Project Dashboard</h1>
      <button
        onClick={() => setIsEditorOpen(true)}
        className="px-4 py-2 bg-indigo-600 rounded-lg text-sm font-medium"
      >
        Open Rich Editor
      </button>

      {/* 🔴 the condition is false initially, but the editor JS is already downloaded */}
      {isEditorOpen && (
        <div className="p-4 border border-slate-800 rounded-xl bg-slate-900">
          <HeavyRichTextEditor />
        </div>
      )}
    </div>
  );
}`}</CodeBlock>

      <H3>🟢 Production pattern — dynamic splitting with hover intent and a skeleton</H3>

      <CodeBlock filename="components/HeavyRichTextEditor.tsx">{`'use client';

export default function HeavyRichTextEditor() {
  return (
    <div className="p-4 bg-slate-900 border border-slate-800 rounded-xl space-y-3">
      <div className="flex gap-2 border-b border-slate-800 pb-2">
        <span className="text-xs font-mono px-2 py-1 bg-slate-800 rounded">Bold</span>
        <span className="text-xs font-mono px-2 py-1 bg-slate-800 rounded">Italic</span>
        <span className="text-xs font-mono px-2 py-1 bg-slate-800 rounded">Heading</span>
      </div>
      <textarea
        className="w-full h-32 bg-slate-950 text-slate-200 border border-slate-800 rounded p-2 text-sm focus:outline-none focus:border-indigo-500"
        placeholder="Type report content..."
      />
    </div>
  );
}`}</CodeBlock>

      <CodeBlock filename="app/dashboard/page.tsx">{`'use client';

import { useState } from 'react';
import dynamic from 'next/dynamic';

// 🟢 component-level dynamic import with a skeleton fallback
const DynamicRichTextEditor = dynamic(
  () => import('@/components/HeavyRichTextEditor'),
  {
    loading: () => (
      <div className="p-4 bg-slate-900 border border-slate-800 rounded-xl space-y-3 animate-pulse">
        <div className="h-6 w-1/3 bg-slate-800 rounded" />
        <div className="h-32 w-full bg-slate-800 rounded" />
      </div>
    ),
    ssr: false, // 🟢 opt out of SSR when the editor depends on window / DOM APIs
  },
);

export default function OptimizedDashboardPage() {
  const [isEditorOpen, setIsEditorOpen] = useState(false);

  // 🟢 prefetch the module while the pointer is still on the button
  const prefetchEditor = () => {
    import('@/components/HeavyRichTextEditor');
  };

  return (
    <div className="p-8 max-w-2xl mx-auto space-y-6 bg-slate-950 text-slate-100 min-h-screen">
      <div className="space-y-1">
        <h1 className="text-2xl font-bold">Project Dashboard</h1>
        <p className="text-sm text-slate-400">
          The rich text editor bundle is split and loaded strictly on demand.
        </p>
      </div>

      <button
        onClick={() => setIsEditorOpen(true)}
        onMouseEnter={prefetchEditor} // 🟢 triggers the prefetch on hover intent
        className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-sm font-medium transition-colors"
      >
        {isEditorOpen ? 'Editor Ready' : 'Open Rich Editor'}
      </button>

      {/* 🟢 the chunk is loaded only once the condition is met */}
      {isEditorOpen && (
        <div className="pt-2">
          <DynamicRichTextEditor />
        </div>
      )}
    </div>
  );
}`}</CodeBlock>

      {/* ── Matrix ────────────────────────────────────────────────────── */}
      <H2 id="matrix">৪. Code Splitting Level Comparison Matrix</H2>

      <Table
        head={["বৈশিষ্ট্য", "Route-level splitting", "Component-level splitting"]}
        rows={[
          [
            "স্প্লিটিং স্কোপ",
            <span key="c">
              ইউআরএল রুট / পেজ লেভেল (<code>page.tsx</code>)
            </span>,
            "নির্দিষ্ট UI উপাদান বা বিজনেস লজিক কম্পোনেন্ট",
          ],
          [
            "ট্রিগার",
            "ইউআরএল রাউটিং বা লিংক নেভিগেশন",
            "স্টেট চেঞ্জ, ক্লিক, হভার বা in-view ইন্টারঅ্যাকশন",
          ],
          [
            "প্রাইমারি উদ্দেশ্য",
            "অন্য পেজের কোড বর্তমান পেজে আসা বন্ধ করা",
            "বর্তমান পেজের হিডেন/অফ-স্ক্রিন কোড ইনিশিয়াল লোড থেকে আলাদা করা",
          ],
          ["মেমরি ইমপ্যাক্ট", "মাঝারি 🟢", "উচ্চ পারফর্মিং ⚡ (মেমরি সাশ্রয়ী)"],
        ]}
      />

      <Line name="ভুলু ভাই">
        অসাধারণ! এখন আর অপ্রয়োজনীয় মোডাল বা এডিটরের ভারী কোড পেজ লোডের সময় অ্যাপকে স্লো করবে না। হভার
        ইন্টারঅ্যাকশন দিয়ে আগে থেকেই ব্যাকগ্রাউন্ডে রেডি রাখব, আর ইউজার ক্লিকেই চটপট লোড হয়ে যাবে।
      </Line>

      {/* ── Takeaways ─────────────────────────────────────────────────── */}
      <H2 id="takeaway">Production Takeaways</H2>

      <Note>
        <ul>
          <li>
            <strong>Audit heavy off-screen UI:</strong> মোডাল, ড্রয়ার, ট্যাব, রিচ এডিটর, চার্ট এবং
            কাস্টম ড্রপডাউনের মতো অফ-স্ক্রিন কম্পোনেন্টগুলো চিহ্নিত করুন এবং সেগুলোর টপ-লেভেল ইমপোর্ট
            বন্ধ করুন।
          </li>
          <li>
            <strong>Combine conditional rendering with next/dynamic:</strong> শুধু{" "}
            <code>next/dynamic</code> ব্যবহারই যথেষ্ট নয় — সেটিকে লজিক্যাল কন্ডিশনের (
            <code>{"isOpen && <Component />"}</code>) ভেতরে রাখুন, যেন আগে থেকে চ্যাঙ্ক রিকোয়েস্ট ফায়ার
            না হয়।
          </li>
          <li>
            <strong>Implement hover intent prefetching:</strong> গুরুত্বপূর্ণ কিন্তু ভারী কম্পোনেন্টের
            ক্ষেত্রে বাটনের <code>onMouseEnter</code> ইভেন্টে <code>import()</code> কল করে ক্লিকের
            আগেই চ্যাঙ্ক প্রিলোড করার অভ্যাস গড়ে তুলুন।
          </li>
        </ul>
      </Note>
    </article>
  );
}
