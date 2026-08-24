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
      bn: "এক উইজেটের দেরিতে পুরো ড্যাশবোর্ড আটকে",
      en: "One slow widget blocks the whole dashboard",
    },
  },
  {
    id: "mental-model",
    label: { bn: "Named Slot কীভাবে কাজ করে", en: "How named slots work" },
  },
  {
    id: "structure",
    label: { bn: "ডিরেক্টরি স্ট্রাকচার", en: "Directory structure" },
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

export default function ComplexDashboardParallelRoutes() {
  return (
    <article className="doc-prose">
      {/* ── The problem ───────────────────────────────────────────────── */}
      <H2 id="the-problem" anchorOnly>
        এক উইজেটের দেরিতে পুরো ড্যাশবোর্ড আটকে
      </H2>

      <p>
        রাত ৮:০০। ভুলু ভাই একটি হাই-এন্ড অ্যাডমিন ড্যাশবোর্ড বানাচ্ছেন যেখানে তিনটি আলাদা
        সেকশন আছে: <code>AnalyticsChart</code>, <code>RecentUsers</code> এবং{" "}
        <code>ServerStatus</code>। তিনি একটি পেজের ভেতর তিনটিই রেন্ডার করেছেন। সমস্যা হলো,{" "}
        <code>ServerStatus</code> লোড হতে ৪ সেকেন্ড দেরি হলে পুরো পেজ আটকে থাকে, আর কোনো একটি
        উইজেটে এরর হলে পুরো ড্যাশবোর্ড পেজটি ক্র্যাশ করে।
      </p>

      <Line name="ভুলু ভাই">
        ফাহিম! আমার ড্যাশবোর্ডের ৩টি উইজেটকে কি স্বাধীনভাবে আলাদা আলাদা লোডিং স্কেলেটন ও এরর
        বাউন্ডারি দিয়ে রেন্ডার করার কোনো উপায় অ্যাপ রাউটারে আছে?
      </Line>

      <Line name="ফাহিম">
        অবশ্যই আছে ভুলু ভাই! এর উত্তর হলো <strong>Parallel Routes (Named Slots)</strong>!
      </Line>

      <Line name="নেক্সট-ভাই">
        একদম চমৎকার পয়েন্ট ফাহিম! Parallel Routes ব্যবহার করতে ফোল্ডারের নামের সামনে{" "}
        <code>@</code> সিম্বল দিতে হয় (যেমন <code>@analytics</code>, <code>@team</code>)। এই
        স্লটগুলো আলাদা কোনো URL তৈরি করে না — বরং একই লেআউটে props হিসেবে রিসিভ হয়। এর সবচেয়ে
        বড় পাওয়ার হলো, প্রতিটি স্লটের নিজস্ব স্বাধীন <code>loading.tsx</code> ও{" "}
        <code>error.tsx</code> থাকতে পারে। ফলে একটি উইজেট ক্র্যাশ করলেও বাকি উইজেটগুলো
        নিখুঁতভাবে রেন্ডার হতে থাকে।
      </Line>

      {/* ── Mental model ──────────────────────────────────────────────── */}
      <H2 id="mental-model">১. Named Slot কীভাবে কাজ করে</H2>

      <ul>
        <li>
          <code>@analytics</code> ফোল্ডারটি URL সেগমেন্ট নয় — এটি প্যারেন্ট{" "}
          <code>layout.tsx</code>-এ <code>analytics</code> নামের prop হয়ে ঢোকে।
        </li>
        <li>
          প্রতিটি স্লট আলাদা সাব-ট্রি, তাই প্রত্যেকের নিজস্ব Suspense ও Error Boundary —
          একটির ব্যর্থতা অন্যটিকে ছোঁয় না।
        </li>
        <li>
          স্লটগুলো সমান্তরালে রেন্ডার হয়, তাই ধীর উইজেট শুধু নিজের স্কেলেটন দেখায়, বাকিরা
          সাথে সাথে দৃশ্যমান হয়।
        </li>
        <li>
          কোনো নেভিগেশনে স্লটের ম্যাচিং রাউট না থাকলে <code>default.tsx</code> রেন্ডার হয় —
          না থাকলে 404।
        </li>
      </ul>

      {/* ── Structure ─────────────────────────────────────────────────── */}
      <H2 id="structure">২. ডিরেক্টরি স্ট্রাকচার</H2>

      <Diagram>{`app/dashboard/
├── layout.tsx        <-- Receives { children, analytics, team } props
├── page.tsx          <-- Default children slot
├── @analytics/       <-- Named slot 1
│   ├── page.tsx      <-- Independent analytics UI
│   ├── loading.tsx   <-- Isolated loading skeleton
│   ├── error.tsx     <-- Isolated error boundary
│   └── default.tsx   <-- Fallback for unmatched navigations
└── @team/            <-- Named slot 2
    ├── page.tsx      <-- Independent team activity UI
    ├── loading.tsx   <-- Isolated loading skeleton
    └── default.tsx   <-- Fallback for unmatched navigations`}</Diagram>

      {/* ── Implementation ────────────────────────────────────────────── */}
      <H2 id="implementation">৩. প্রোডাকশন কোড</H2>

      <H3>A — @analytics স্লট</H3>

      <CodeBlock filename="app/dashboard/@analytics/page.tsx">{`async function fetchAnalytics() {
  await new Promise((res) => setTimeout(res, 1000));
  return { revenue: '$84,200' };
}

export default async function AnalyticsSlot() {
  const data = await fetchAnalytics();

  return (
    <div className="bg-slate-900 border border-slate-800 p-5 rounded-xl space-y-2">
      <h3 className="text-xs font-mono text-emerald-400">@analytics Slot</h3>
      <p className="text-xl font-bold text-white">{data.revenue}</p>
    </div>
  );
}`}</CodeBlock>

      <H3>B — @team স্লট</H3>

      <CodeBlock filename="app/dashboard/@team/page.tsx">{`async function fetchTeamActivity() {
  await new Promise((res) => setTimeout(res, 2000));
  return ['Zubayer active now', 'Fahim pushed code'];
}

export default async function TeamSlot() {
  const team = await fetchTeamActivity();

  return (
    <div className="bg-slate-900 border border-slate-800 p-5 rounded-xl space-y-2">
      <h3 className="text-xs font-mono text-blue-400">@team Slot</h3>
      <ul className="text-xs space-y-1 text-slate-300">
        {team.map((act, i) => (
          <li key={i}>{act}</li>
        ))}
      </ul>
    </div>
  );
}`}</CodeBlock>

      <H3>C — স্লট ইনজেক্টর লেআউট</H3>

      <CodeBlock filename="app/dashboard/layout.tsx">{`import { ReactNode } from 'react';

interface ParallelDashboardLayoutProps {
  children: ReactNode;
  analytics: ReactNode; // Injected from the @analytics folder
  team: ReactNode;      // Injected from the @team folder
}

export default function ParallelDashboardLayout({
  children,
  analytics,
  team,
}: ParallelDashboardLayoutProps) {
  return (
    <main className="p-8 bg-slate-950 min-h-screen space-y-6 text-slate-100 max-w-6xl mx-auto">
      <header className="border-b border-slate-800 pb-4">
        <h1 className="text-2xl font-bold">Parallel Architecture Dashboard</h1>
      </header>

      {/* Main page children */}
      <div>{children}</div>

      {/* Parallel grid slots */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>{analytics}</div>
        <div>{team}</div>
      </section>
    </main>
  );
}`}</CodeBlock>

      <H3>D — স্লটের নিজস্ব loading, error ও default</H3>

      <CodeBlock filename="app/dashboard/@analytics/loading.tsx">{`export default function AnalyticsSlotLoading() {
  return (
    <div className="bg-slate-900/60 border border-slate-800 p-5 rounded-xl space-y-3 animate-pulse">
      <div className="h-3 w-24 bg-slate-800 rounded" />
      <div className="h-7 w-32 bg-slate-800 rounded" />
    </div>
  );
}`}</CodeBlock>

      <CodeBlock filename="app/dashboard/@analytics/error.tsx">{`'use client';

export default function AnalyticsSlotError({ reset }: { reset: () => void }) {
  return (
    <div className="bg-red-950/40 border border-red-800/80 p-5 rounded-xl space-y-3">
      <p className="text-xs text-red-300">Analytics widget failed to load.</p>
      <button onClick={() => reset()} className="text-xs underline text-red-200">
        Retry this widget
      </button>
    </div>
  );
}`}</CodeBlock>

      <CodeBlock filename="app/dashboard/@analytics/default.tsx">{`export default function AnalyticsSlotDefault() {
  // Rendered when a navigation does not match this slot
  return null;
}`}</CodeBlock>

      <Line name="ভুলু ভাই">
        দারুণ! এখন <code>@team</code> ২ সেকেন্ড দেরি করলেও <code>@analytics</code> এক
        সেকেন্ডেই দেখা যাচ্ছে, আর একটি উইজেট ক্র্যাশ করলেও বাকি ড্যাশবোর্ড দিব্যি চলছে।
      </Line>

      {/* ── Takeaways ─────────────────────────────────────────────────── */}
      <H2 id="takeaway">Production Checklist</H2>

      <Note>
        <ul>
          <li>
            <strong>প্রতিটি স্লটে default.tsx রাখুন:</strong> চাইল্ড রাউট নেভিগেশনের সময় কোনো
            স্লটের ম্যাচিং UI না থাকলে Next.js 404 থ্রো করতে পারে। তাই প্রতিটি স্লট ফোল্ডারে
            একটি <code>default.tsx</code> রাখা বাধ্যতামূলক।
          </li>
          <li>
            <strong>Modal ও Split View-এ Parallel Routes:</strong> জটিল কন্ডিশনাল UI বা মোডাল
            রাউটিং (Intercepting Routes-এর সাথে মিলিয়ে) বানানোর জন্য এটিই সবচেয়ে ক্লিন
            আর্কিটেকচারাল প্যাটার্ন।
          </li>
          <li>
            <strong>স্লট মানেই আলাদা বাউন্ডারি:</strong> প্রতিটি স্লটে নিজস্ব{" "}
            <code>loading.tsx</code> ও <code>error.tsx</code> দিন — এটাই এই প্যাটার্নের
            আসল লাভ।
          </li>
        </ul>
      </Note>
    </article>
  );
}
