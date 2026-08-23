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
      bn: "১২০ KB থেকে ৪৫০ KB!",
      en: "From 120 KB to 450 KB",
    },
  },
  {
    id: "mental-model",
    label: {
      bn: "বাউন্ডারি ও বান্ডল ইমপ্যাক্ট",
      en: "Boundary & bundle impact",
    },
  },
  {
    id: "anti-pattern",
    label: { bn: "অ্যান্টি-প্যাটার্ন", en: "The anti-pattern" },
  },
  {
    id: "refactor",
    label: {
      bn: "Children Slot Composition",
      en: "Children slot composition",
    },
  },
  {
    id: "server-only",
    label: { bn: "server-only গার্ডরেল", en: "The server-only guardrail" },
  },
  {
    id: "takeaway",
    label: { bn: "Production Takeaways", en: "Production takeaways" },
  },
];

export default function UseClientBoundaryBundleImpact() {
  return (
    <article className="doc-prose">
      {/* ── The problem ───────────────────────────────────────────────── */}
      <H2 id="the-problem" anchorOnly>
        ১২০ KB থেকে ৪৫০ KB!
      </H2>

      <p>
        বিকাল ৪:১৫। ফাহিম টার্মিনালে <code>next build</code> দেওয়ার পর চশমা ঠিক করতে করতে
        আঁতকে উঠল। মনিটরে লাল রঙের ফাইল সাইজ দেখিয়ে বলল —
      </p>

      <Line name="ফাহিম">
        ভুলু ভাই! আমাদের ড্যাশবোর্ড পেজের ক্লায়েন্ট জাভাস্ক্রিপ্ট বান্ডেল সাইজ হঠাৎ করে ১২০
        KB থেকে লাফ দিয়ে ৪৫০ KB হয়ে গেল কীভাবে? তুমি কি পুরো ড্যাশবোর্ডে ভারী কোনো
        থার্ড-পার্টি লাইব্রেরি ক্লায়েন্টে নিয়ে এসেছ?
      </Line>

      <Line name="ভুলু ভাই">
        (মাথা চুলকে) দূর ফাহিম! আমি জাস্ট ড্যাশবোর্ডের উপরে একটা ছোট্ট Sidebar Toggle
        বাটন বানাতে চেয়েছিলাম। তার জন্য <code>useState</code> লাগছিল, তাই ড্যাশবোর্ডের মূল{" "}
        <code>layout.tsx</code> ফাইলের একদম মাথায় <code>&apos;use client&apos;</code> লিখে
        দিয়েছি! এতে সমস্যা কী?
      </Line>

      <Line name="নেক্সট-ভাই">
        (গম্ভীর হয়ে) হায় হায় ভুলু! তুমি আসলে{" "}
        <strong>Client Module Boundary Infection</strong> তৈরি করে ফেলেছ!{" "}
        <code>&apos;use client&apos;</code> কোনো সাধারণ React ডিরেক্টিভ নয় — এটি একটি{" "}
        <strong>Module Graph Boundary Flag</strong>। কোনো প্যারেন্ট ফাইলের টপে এটি বসালে
        সেই ফাইল এবং তার নিচে ইমপোর্ট করা সমস্ত চাইল্ড কম্পোনেন্ট, হেলপার ফাংশন ও
        থার্ড-পার্টি লাইব্রেরি স্বয়ংক্রিয়ভাবে ক্লায়েন্ট বান্ডলের অংশ হয়ে যায়!
      </Line>

      {/* ── Mental model ──────────────────────────────────────────────── */}
      <H2 id="mental-model">১. Boundary &amp; Bundle Impact</H2>

      <Diagram>{`❌ BAD ARCHITECTURE (top-level boundary infection)
┌────────────────────────────────────────────────────────┐
│  'use client'   <-- infects the entire tree downstream  │
│  DashboardLayout.tsx                                    │
│  ├─ imports HeavyChart.tsx      (200 KB)                │
│  ├─ imports DataFormatter.ts    (50 KB)                 │
│  └─ imports UserProfile.tsx     (10 KB)                 │
└────────────────────────────────────────────────────────┘
  RESULT: 260 KB of JavaScript shipped to the browser!

──────────────────────────────────────────────────────────

🟢 GOOD ARCHITECTURE (leaf isolation + slot composition)
┌────────────────────────────────────────────────────────┐
│  SERVER BOUNDARY (0 KB client JS)                       │
│  DashboardPage.tsx (server component)                   │
│  ├─ renders HeavyChart.tsx   (pure server rendered)     │
│  └─ wraps them inside <SidebarToggleContainer />        │
└───────────────────────────┬────────────────────────────┘
                            │ passed as the 'children' slot
                            v
┌────────────────────────────────────────────────────────┐
│  'use client' (isolated boundary)                       │
│  SidebarToggleContainer.tsx  (only 2 KB of JS!)         │
│  └─ manages local UI state for the sidebar toggle       │
└────────────────────────────────────────────────────────┘
  RESULT: 2 KB of JavaScript shipped to the browser!`}</Diagram>

      {/* ── Anti-pattern ──────────────────────────────────────────────── */}
      <H2 id="anti-pattern">২. অ্যান্টি-প্যাটার্ন — বান্ডল কীভাবে ফুলে যায়</H2>

      <CodeBlock filename="app/dashboard/layout.tsx">{`// ❌ ANTI-PATTERN: app/dashboard/layout.tsx
'use client'; // BAD: 'use client' at the top-level layout!

import { useState } from 'react';
import { HeavyAnalyticsChart } from '@/components/heavy-analytics-chart'; // 200KB
import { HeavyDataGrid } from '@/components/heavy-data-grid'; // 150KB

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const [isOpen, setIsOpen] = useState(true);

  // Because the layout is a client module, both heavy components are
  // pulled into the client bundle and downloaded by the browser.
  return (
    <div className="flex h-screen bg-slate-950 text-slate-100">
      <aside className={isOpen ? 'w-64 bg-slate-900' : 'w-16 bg-slate-900'}>
        <button onClick={() => setIsOpen(!isOpen)} className="p-4 text-xs font-mono">
          Toggle
        </button>
      </aside>
      <main className="flex-1 p-6 overflow-y-auto">
        <HeavyAnalyticsChart />
        <HeavyDataGrid />
        {children}
      </main>
    </div>
  );
}`}</CodeBlock>

      {/* ── Refactor ──────────────────────────────────────────────────── */}
      <H2 id="refactor">৩. রিফ্যাক্টর — Isolated Leaf + Children Slot</H2>

      <H3>Step 1 — ইন্টারঅ্যাক্টিভ কন্টেইনারটুকু আলাদা করা</H3>

      <CodeBlock filename="app/dashboard/components/sidebar-toggle.tsx">{`// 🟢 app/dashboard/components/sidebar-toggle.tsx
'use client'; // isolated on the interactive container only

import { useState } from 'react';

interface SidebarToggleProps {
  children: React.ReactNode;
}

export function SidebarToggleContainer({ children }: SidebarToggleProps) {
  const [isOpen, setIsOpen] = useState(true);

  return (
    <div className="flex h-screen bg-slate-950 text-slate-100">
      <aside
        className={
          (isOpen ? 'w-64' : 'w-16') +
          ' transition-all bg-slate-900 border-r border-slate-800'
        }
      >
        <div className="p-4 flex justify-between items-center border-b border-slate-800">
          <span className="text-xs text-slate-400 font-mono">{isOpen && 'DASHBOARD'}</span>
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="px-2 py-1 bg-slate-800 hover:bg-slate-700 rounded text-xs transition"
          >
            {isOpen ? 'Collapse' : 'Expand'}
          </button>
        </div>
      </aside>

      <main className="flex-1 p-6 overflow-y-auto space-y-6">
        {/* Server components render here without joining the client bundle */}
        {children}
      </main>
    </div>
  );
}`}</CodeBlock>

      <H3>Step 2 — পেজটি বিশুদ্ধ Server Component হিসেবেই থাকল</H3>

      <CodeBlock filename="app/dashboard/page.tsx">{`// 🟢 app/dashboard/page.tsx — NO 'use client' directive here!
import { SidebarToggleContainer } from './components/sidebar-toggle';
import { HeavyAnalyticsChart } from '@/components/heavy-analytics-chart'; // 0 KB to client
import { HeavyDataGrid } from '@/components/heavy-data-grid'; // 0 KB to client

export default async function DashboardPage() {
  const data = await fetch('https://api.example.com/analytics', {
    cache: 'no-store',
  }).then((res) => res.json());

  return (
    <SidebarToggleContainer>
      <header className="border-b border-slate-800 pb-4">
        <h1 className="text-2xl font-bold text-white">Production Analytics Dashboard</h1>
        <p className="text-xs text-emerald-400 font-mono mt-1">
          Server component tree — heavy parsing executed exclusively on the server
        </p>
      </header>

      {/* Heavy components travel through the 'children' slot */}
      <section className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <HeavyAnalyticsChart data={data.charts} />
        <HeavyDataGrid records={data.grid} />
      </section>
    </SidebarToggleContainer>
  );
}`}</CodeBlock>

      <Note>
        <p>
          কেন কাজ করে? কারণ <code>children</code> প্রপ হিসেবে যাওয়া এলিমেন্টগুলো{" "}
          <em>প্যারেন্টের</em> মডিউল গ্রাফে থাকে, ক্লায়েন্ট কন্টেইনারের নয়। ক্লায়েন্ট
          কম্পোনেন্ট শুধু একটি রেন্ডার-হয়ে-যাওয়া স্লট বসায় — সে ঐ চাইল্ডগুলো ইমপোর্ট করে না।
        </p>
      </Note>

      {/* ── server-only ───────────────────────────────────────────────── */}
      <H2 id="server-only">৪. Accidental Import Guardrail — server-only</H2>

      <CodeBlock label="Bash" filename="install.sh">{`npm install server-only`}</CodeBlock>

      <CodeBlock filename="lib/server-db.ts">{`// lib/server-db.ts
import 'server-only'; // 🛡️ build-time guardrail

export async function fetchSensitiveMetrics() {
  // database logic with private API keys
  return { secretMetric: 9940 };
}`}</CodeBlock>

      <p>
        এই ফাইলটি ভুলবশত কোনো <code>&apos;use client&apos;</code> কম্পোনেন্টে ইমপোর্ট হলে
        Next.js বিল্ড টাইমেই ক্র্যাশ করবে এবং ডেভেলপমেন্টে লাল এরর দেখাবে।
      </p>

      <Line name="ভুলু ভাই">
        (চমকে উঠে) অসাধারণ! সাইডবার টগল অংশটুকু আলাদা কন্টেইনারে সরানোয় ভারী চার্ট আর ডেটা
        গ্রিডের সাড়ে তিনশ কিলোবাইট ক্লায়েন্ট বান্ডল থেকে বাদ পড়ল — অথচ ইন্টারঅ্যাক্টিভিটি
        অক্ষুণ্ণ রইল!
      </Line>

      {/* ── Takeaways ─────────────────────────────────────────────────── */}
      <H2 id="takeaway">Production Takeaways</H2>

      <Note>
        <ul>
          <li>
            <strong>Push &apos;use client&apos; to the leaves:</strong> রুট বা মিডল-লেভেল
            লেআউটে কখনো <code>&apos;use client&apos;</code> লিখো না — যে নির্দিষ্ট বাটন বা
            ইনপুটে ইভেন্ট লিসেনার বা স্টেট লাগছে, শুধু সেখানেই।
          </li>
          <li>
            <strong>Client components still SSR:</strong>{" "}
            <code>&apos;use client&apos;</code> মানে &ldquo;only client&rdquo; নয় — এর অর্থ
            এই মডিউলের JS হাইড্রেশনের জন্য ব্রাউজারে পাঠাতে হবে।
          </li>
          <li>
            <strong>Use the children slot pattern:</strong> ক্লায়েন্ট কন্টেইনারের ভেতরে
            সার্ভার কম্পোনেন্ট রাখার সঠিক উপায় হলো <code>children</code> বা slot prop।
          </li>
          <li>
            <strong>Audit with @next/bundle-analyzer:</strong> বড় ফিচার নামানোর পর চেক করো
            কোনো ক্লায়েন্ট বাউন্ডারি ভুল করে বিশাল লাইব্রেরি টেনে আনছে কি না।
          </li>
        </ul>
      </Note>
    </article>
  );
}
