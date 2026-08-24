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
      bn: "সাইডবারের স্টেট গায়েব হয় কেন?",
      en: "Why the sidebar state disappears",
    },
  },
  {
    id: "mental-model",
    label: { bn: "Layout বনাম Template", en: "Layout vs Template" },
  },
  {
    id: "mechanics",
    label: { bn: "এক্সিকিউশন মেকানিক্স", en: "Execution mechanics" },
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

export default function NestedLayoutStatePreservation() {
  return (
    <article className="doc-prose">
      {/* ── The problem ───────────────────────────────────────────────── */}
      <H2 id="the-problem" anchorOnly>
        সাইডবারের স্টেট গায়েব হয় কেন?
      </H2>

      <p>
        সকাল ১০:৩০। ভুলু ভাই ড্যাশবোর্ডের সাইডবারে একটি ইন্টারঅ্যাক্টিভ ফিল্টার সাইডবার ও
        সার্চ বক্স বানিয়েছেন। কিন্তু চাইল্ড রাউট <code>/dashboard/settings</code> থেকে{" "}
        <code>/dashboard/analytics</code>-এ নেভিগেট করলেই সার্চ বক্সে টাইপ করা টেক্সট গায়েব
        হয়ে যাচ্ছে, আর সাইডবারের স্ক্রল পজিশন একদম উপরে রিসেট হয়ে যাচ্ছে।
      </p>

      <Line name="ভুলু ভাই">
        ফাহিম! মাথা নষ্ট নাকি ভাই? আমি তো সাইডবার কম্পোনেন্টটি{" "}
        <code>app/dashboard/page.tsx</code>-এর ভেতরে রেন্ডার করেছি। চাইল্ড পেজ চেঞ্জ হলে
        সাইডবারের ইনপুট স্টেট আর স্ক্রল পজিশন রিসেট হয়ে যাচ্ছে কেন?
      </Line>

      <Line name="ফাহিম">
        ভুলু ভাই! তুমি সাইডবারকে <code>page.tsx</code>-এর ভেতরে রেখেছ! অ্যাপ রাউটারে পেজ
        চেঞ্জ হলে পুরোনো <code>page.tsx</code> আনমাউন্ট হয়ে নতুন <code>page.tsx</code> মাউন্ট
        হয় — ফলে পেজের ভেতর থাকা সব স্টেটের মৃত্যু ঘটে! এর সমাধান হলো{" "}
        <strong>Nested Layout Architecture</strong>।
      </Line>

      <Line name="নেক্সট-ভাই">
        একদম ঠিক পয়েন্ট ফাহিম! App Router-এ <code>layout.tsx</code> হলো একটি{" "}
        <strong>Persistent Boundary</strong>। প্যারেন্ট লেআউটের ভেতরে যা রাখা হয়, চাইল্ড রাউট
        পরিবর্তনের সময় সেটি আনমাউন্ট না হয়ে মেমরিতে থেকে যায় (Preserved)। ফলে সাইডবারের UI
        স্টেট, ইউজারের টাইপ করা ইনপুট, এমনকি ভিডিও প্লেয়ারের পজিশন পর্যন্ত অটুট থাকে।
      </Line>

      <Line name="নেক্সট-ভাই">
        কিন্তু আপনার যদি এমন কেস দরকার হয় যেখানে পেজ নেভিগেশনে স্টেট intentionally রিসেট হতে
        হবে (যেমন পেজ অ্যানিমেশন বা এনালিটিক্স ট্র্যাকিং), তবে Layout-এর বদলে{" "}
        <strong>Template</strong> (<code>template.tsx</code>) ব্যবহার করতে হয়।
      </Line>

      {/* ── Mental model ──────────────────────────────────────────────── */}
      <H2 id="mental-model">১. Layout বনাম Template</H2>

      <ul>
        <li>
          <strong>layout.tsx:</strong> একবার মাউন্ট হয়, চাইল্ড রাউট বদলালেও আনমাউন্ট হয় না।
          ভেতরের ক্লায়েন্ট স্টেট, স্ক্রল পজিশন, <code>useEffect</code> — সব বেঁচে থাকে।
        </li>
        <li>
          <strong>template.tsx:</strong> প্রতিটি নেভিগেশনে নতুন করে মাউন্ট হয়। স্টেট রিসেট
          হয়, <code>useEffect</code> আবার চলে — এন্ট্রি অ্যানিমেশন বা পেজভিউ লগিংয়ের জন্য
          আদর্শ।
        </li>
        <li>
          দুটো একসাথে থাকলে হায়ারার্কি দাঁড়ায়:{" "}
          <code>Layout &gt; Template &gt; Page</code>।
        </li>
      </ul>

      {/* ── Mechanics ─────────────────────────────────────────────────── */}
      <H2 id="mechanics">২. এক্সিকিউশন মেকানিক্স</H2>

      <Diagram>{`NESTED LAYOUT (State preserved across navigation)
┌──────────────────────────────────────────────────────────────────────┐
│ app/dashboard/layout.tsx   (Renders ONCE, NEVER unmounts)            │
│  ├── <Sidebar />  ──► [ Input state & scroll position stay intact ]  │
│  └── {children}                                                      │
│        ├── Renders /dashboard/analytics  (Page A)                    │
│        └── Swaps to /dashboard/settings  (Page B)  <── ONLY THIS!    │
└──────────────────────────────────────────────────────────────────────┘

TEMPLATE (State resets on every route change)
┌──────────────────────────────────────────────────────────────────────┐
│ app/dashboard/template.tsx (UNMOUNTS & REMOUNTS on every route)      │
│  ├── <AnimationWrapper> ──► Re-triggers entrance animation           │
│  └── {children}         ──► Fresh DOM mounted on every navigation    │
└──────────────────────────────────────────────────────────────────────┘`}</Diagram>

      {/* ── Implementation ────────────────────────────────────────────── */}
      <H2 id="implementation">৩. প্রোডাকশন কোড</H2>

      <H3>A — Nested layout লেয়ার</H3>

      <CodeBlock filename="app/dashboard/layout.tsx">{`import { ReactNode } from 'react';
import { DashboardSidebar } from './components/dashboard-sidebar';

interface DashboardLayoutProps {
  children: ReactNode;
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  return (
    <div className="flex min-h-screen bg-slate-950 text-slate-100">
      {/* Persistent sidebar: state & scroll survive child navigation */}
      <aside className="w-64 border-r border-slate-800 bg-slate-900/50 p-4 shrink-0">
        <DashboardSidebar />
      </aside>

      {/* Dynamic child page shell */}
      <main className="flex-1 p-8 overflow-y-auto">{children}</main>
    </div>
  );
}`}</CodeBlock>

      <H3>B — স্টেটফুল সাইডবার</H3>

      <CodeBlock filename="app/dashboard/components/dashboard-sidebar.tsx">{`'use client';

import { useState } from 'react';
import Link from 'next/link';

export function DashboardSidebar() {
  const [filterQuery, setFilterQuery] = useState('');

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h2 className="text-xs font-mono font-bold text-slate-400 uppercase">
          Dashboard Filter
        </h2>

        {/* State in this input survives navigation */}
        <input
          type="text"
          value={filterQuery}
          onChange={(e) => setFilterQuery(e.target.value)}
          placeholder="Preserved state query..."
          className="w-full bg-slate-950 border border-slate-800 rounded px-3 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-emerald-500"
        />
      </div>

      <nav className="flex flex-col space-y-1 text-xs">
        <Link href="/dashboard/analytics" className="p-2 hover:bg-slate-800 rounded transition">
          Analytics
        </Link>
        <Link href="/dashboard/settings" className="p-2 hover:bg-slate-800 rounded transition">
          Settings
        </Link>
      </nav>
    </div>
  );
}`}</CodeBlock>

      <H3>C — ইচ্ছাকৃত রিসেটের জন্য template</H3>

      <CodeBlock filename="app/dashboard/template.tsx">{`'use client';

import { ReactNode, useEffect } from 'react';

export default function DashboardTemplate({ children }: { children: ReactNode }) {
  useEffect(() => {
    // Runs again on EVERY navigation — pageview logging, entry animation, etc.
    console.log('New route segment mounted');
  }, []);

  return <div className="animate-in fade-in duration-300">{children}</div>;
}`}</CodeBlock>

      <Line name="ভুলু ভাই">
        সাইডবারকে <code>layout.tsx</code>-এ তুলে দিলাম — এখন ট্যাব বদলালেও সার্চ বক্সের
        টেক্সট আর স্ক্রল পজিশন হুবহু আগের জায়গায় থাকছে!
      </Line>

      {/* ── Takeaways ─────────────────────────────────────────────────── */}
      <H2 id="takeaway">Production Checklist</H2>

      <Note>
        <ul>
          <li>
            <strong>টপ-লেভেল লেআউটে পেজ-স্পেসিফিক ডাটা ফেচ করবেন না:</strong> প্যারেন্ট
            লেআউটে ডাটা ফেচ করলে সব চাইল্ড রাউটের রেসপন্স ব্লক হতে পারে। লেআউটকে সবসময়
            ভিজ্যুয়াল শেল হিসেবে রাখুন।
          </li>
          <li>
            <strong>template.tsx শুধু তখনই, যখন রিসেট ইচ্ছাকৃত:</strong> প্রতিটি পেজ
            ট্রানজিশনে অ্যানিমেশন ট্রিগার বা <code>useEffect</code> রি-রান দরকার হলেই কেবল
            টেমপ্লেট ব্যবহার করুন।
          </li>
          <li>
            <strong>স্টেট কোন লেভেলে থাকবে ঠিক করুন:</strong> যে স্টেট একাধিক রাউটে টিকে থাকা
            দরকার, সেটি সবচেয়ে কাছের কমন লেআউটে তুলুন — রুট লেআউটে নয়।
          </li>
        </ul>
      </Note>
    </article>
  );
}
