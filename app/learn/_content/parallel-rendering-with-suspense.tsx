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
      bn: "Promise.all দিয়েও ৫০ms-এর ডেটা ৩ সেকেন্ড আটকে",
      en: "Promise.all, yet 50ms data waits 3 seconds",
    },
  },
  {
    id: "architecture",
    label: { bn: "Data-level বনাম Component-level", en: "Data-level vs component-level" },
  },
  {
    id: "mechanisms",
    label: { bn: "আন্ডার-দ্য-হুড মেকানিজম", en: "Under-the-hood mechanisms" },
  },
  {
    id: "implementation",
    label: { bn: "দুই ধরনের প্যারালালিজম", en: "The two parallelisms in code" },
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

export default function ParallelRenderingWithSuspense() {
  return (
    <article className="doc-prose">
      {/* ── The problem ───────────────────────────────────────────────── */}
      <H2 id="the-problem" anchorOnly>
        Promise.all দিয়েও ৫০ms-এর ডেটা ৩ সেকেন্ড আটকে
      </H2>

      <p>
        রাত ৩:৫৫। ভুলু ভাই আগের টপিকে ওয়াটারফল দূর করার কৌশল শিখে <code>Promise.all()</code> দিয়ে{" "}
        <code>getUser()</code>, <code>getNotifications()</code> আর <code>getAnalytics()</code>{" "}
        প্যারালালে ইনভোক করেছেন। ওয়াটারফল নেই — কিন্তু নোটিফিকেশন ডেটা আসতে লাগে ৫০ms আর
        অ্যানালিটিক্স ৩ সেকেন্ড, তবু ৫০ms-এর ডেটাটা ৩ সেকেন্ড আটকে থেকে একসাথে দেখাচ্ছে!
      </p>

      <Line name="ভুলু ভাই">
        আমি তো ডেটা প্যারালালে ফেচ করছি, তাও ব্রাউজার ৫০ms-এর ফার্স্ট চাঙ্ক আগে রেন্ডার করছে না
        কেন?
      </Line>

      <Line name="ফাহিম">
        ভুলু ভাই! আপনি করেছেন <strong>data-level parallelism</strong>, কিন্তু{" "}
        <strong>component-level parallelism</strong> করেননি! <code>Promise.all()</code> ফেচিং
        প্যারালাল করে ঠিকই, কিন্তু কম্পোনেন্টের রেন্ডারিং ব্লক করে রাখে যতক্ষণ না ধীরতম promise-টি
        রেজলভ হয়।
      </Line>

      <Line name="নেক্সট-ভাই">
        একদম! <code>Promise.all</code> হলো all-or-nothing — সব ডেটা না আসা পর্যন্ত কোনো UI স্ট্রিম
        হবে না। ফেচিংকে আলাদা async কম্পোনেন্টে ভাগ করে নিজস্ব <code>&lt;Suspense&gt;</code>-এ
        বসালে ৫০ms-এর ডেটা ৫০ms-এই ফ্লাশ হয়ে যায়।
      </Line>

      {/* ── Architecture ──────────────────────────────────────────────── */}
      <H2 id="architecture">১. Data-level বনাম Component-level</H2>

      <Diagram>{`┌─────────────────────────────────────────────────────────────────────────┐
│               DATA-LEVEL VS COMPONENT-LEVEL PARALLELISM                 │
└─────────────────────────────────────────────────────────────────────────┘

 DATA-LEVEL PARALLELISM (Promise.all inside one component):

 0ms                         50ms                     3000ms
 ├────────────────────────────┤ fast data ready          │
 ├──────────────────────────────────────────────────────┤ slow data ready
                                                        └──▶ flushes EVERYTHING at 3000ms
                                                             (the user waits 3s for the fast part)

 -------------------------------------------------------------------------

 COMPONENT-LEVEL PARALLELISM (independent RSCs + their own boundaries):

 <Suspense fallback={<FastSkeleton />}> <FastComponent /> </Suspense>  ──▶ chunk flushed at 50ms
 <Suspense fallback={<SlowSkeleton />}> <SlowComponent /> </Suspense>  ──▶ chunk flushed at 3000ms`}</Diagram>

      {/* ── Mechanisms ────────────────────────────────────────────────── */}
      <H2 id="mechanisms">২. আন্ডার-দ্য-হুড মেকানিজম</H2>

      <Note>
        <ul>
          <li>
            <strong>Promise.all is all-or-nothing:</strong> একটি একক async কম্পোনেন্টে{" "}
            <code>await Promise.all(...)</code> লিখলে রিকোয়েস্টগুলো একসাথে শুরু হয় বটে, কিন্তু
            execution thread ওই লাইনেই থমকে থাকে। দ্রুততম API ৫০ms-এ রেডি হলেও কম্পোনেন্ট তার JSX
            রেন্ডার করতে পারে না।
          </li>
          <li>
            <strong>Out-of-order chunk streaming:</strong> ফেচিং লজিক আলাদা async কম্পোনেন্টে ভাগ
            করলে React প্রতিটি রেন্ডারিং টাস্ককে স্বাধীন ধরে — যার promise আগে রেজলভ হয়, তার HTML
            চাঙ্ক আগেই ফ্লাশ হয়ে যায়।
          </li>
          <li>
            <strong>Co-located data dependencies:</strong> ফেচিং কোড পেজের টপ-লেভেলে না রেখে যে
            কম্পোনেন্টে ডেটা লাগবে ঠিক সেখানে রাখাই component-level parallelism-এর মূল ভিত্তি।
          </li>
        </ul>
      </Note>

      {/* ── Implementation ────────────────────────────────────────────── */}
      <H2 id="implementation">৩. দুই ধরনের প্যারালালিজম</H2>

      <H3>❌ Anti-pattern — Promise.all ফাস্ট UI আটকে রাখে</H3>

      <CodeBlock filename="app/dashboard/page.tsx">{`async function getNotifications() {
  await new Promise((res) => setTimeout(res, 50)); // fast
  return { unread: 3 };
}

async function getAnalytics() {
  await new Promise((res) => setTimeout(res, 3000)); // slow
  return { revenue: '$12,450' };
}

export default async function BadParallelPage() {
  // Data-level parallelism: both start together, but the page awaits BOTH
  const [notifs, analytics] = await Promise.all([
    getNotifications(),
    getAnalytics(),
  ]);

  return (
    <div className="p-6 space-y-4">
      {/* The user stares at a blank screen for 3s before seeing 3 notifications */}
      <div className="bg-emerald-500/10 p-3 text-emerald-400">
        Notifications: {notifs.unread}
      </div>
      <div className="bg-slate-900 p-4">Revenue: {analytics.revenue}</div>
    </div>
  );
}`}</CodeBlock>

      <H3>🟢 Fix — independent components, independent boundaries</H3>

      <CodeBlock filename="app/dashboard/page.tsx">{`import { Suspense } from 'react';
import 'server-only';

// 1. Fast independent component (50ms)
async function NotificationWidget() {
  await new Promise((res) => setTimeout(res, 50));
  return (
    <div className="p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-xl text-emerald-400">
      <p className="text-xs font-mono">Unread alerts</p>
      <p className="text-xl font-bold">3 new notifications</p>
    </div>
  );
}

// 2. Slow independent component (3000ms)
async function AnalyticsWidget() {
  await new Promise((res) => setTimeout(res, 3000));
  return (
    <div className="p-4 bg-slate-900 border border-slate-800 rounded-xl text-slate-100">
      <p className="text-xs text-slate-400 font-mono">Monthly revenue</p>
      <p className="text-xl font-bold text-white">$12,450.00</p>
    </div>
  );
}

export default function OptimizedParallelPage() {
  return (
    <main className="max-w-xl mx-auto py-10 px-6 space-y-6 bg-slate-950">
      <h1 className="text-xl font-bold text-white border-b border-slate-800 pb-3">
        Executive Dashboard
      </h1>

      {/* Boundary 1: flushes immediately at 50ms */}
      <Suspense
        fallback={<div className="h-16 bg-slate-900 animate-pulse rounded-xl" />}
      >
        <NotificationWidget />
      </Suspense>

      {/* Boundary 2: streams independently after 3000ms */}
      <Suspense
        fallback={<div className="h-20 bg-slate-900 animate-pulse rounded-xl" />}
      >
        <AnalyticsWidget />
      </Suspense>
    </main>
  );
}`}</CodeBlock>

      {/* ── Matrix ────────────────────────────────────────────────────── */}
      <H2 id="matrix">৪. Comparison Matrix</H2>

      <Table
        head={[
          "বৈশিষ্ট্য",
          <>
            Data-level (<code>Promise.all</code>)
          </>,
          "Component-level (Suspense)",
        ]}
        rows={[
          [
            "Fetch start time",
            "একসাথে শুরু হয়",
            "একসাথে শুরু হয়",
          ],
          [
            "HTML chunk flush",
            "সবচেয়ে ধীরগতির ডেটা শেষ হওয়ার পর",
            "যার ডেটা আগে রেডি, তার চাঙ্ক আগেই ফ্লাশ হয়",
          ],
          [
            "User experience",
            "খারাপ — ফাস্ট কনটেন্টও দেখায় না",
            "ইনস্ট্যান্ট ফিডব্যাক ও selective injection",
          ],
          [
            "Best use case",
            "১টি কম্পোনেন্টেই ২–৩টি API-র ডেটা যৌথভাবে লাগলে",
            "পেজের UI সেকশনগুলো একে অপরের থেকে স্বাধীন হলে",
          ],
        ]}
      />

      <Line name="ভুলু ভাই">
        জোস! <code>Promise.all()</code> দিলে ডেটা প্যারালালে লোড হলেও রেন্ডারিং একে অপরের জন্য আটকে
        থাকে। আর আলাদা async কম্পোনেন্টে ভাগ করে নিজস্ব <code>&lt;Suspense&gt;</code> দিলে ৫০ms-এর
        নোটিফিকেশন ৫০ms-এই রেন্ডার হয়ে যায়!
      </Line>

      {/* ── Takeaways ─────────────────────────────────────────────────── */}
      <H2 id="takeaway">Production Takeaways</H2>

      <Note>
        <ul>
          <li>
            <strong>Promise.all only for tight coupling:</strong> একটি না পেলে অন্যটি দিয়ে UI আঁকা
            সম্ভব না হলে (যেমন user data ও permissions একই প্রপে লাগবে) — কেবল তখনই{" "}
            <code>Promise.all()</code>।
          </li>
          <li>
            <strong>Decompose independent UI:</strong> স্বাধীন উইজেট বা ব্লকগুলোকে আলাদা async
            কম্পোনেন্টে রূপান্তর করে স্বতন্ত্র বাউন্ডারিতে রাখুন।
          </li>
          <li>
            <strong>Co-locate data fetching:</strong> পেজ বা প্যারেন্ট লেভেলে ফেচ না করে ফেচিং কোডটি
            সংশ্লিষ্ট চাইল্ড কম্পোনেন্টের ভেতরে নিয়ে যান।
          </li>
        </ul>
      </Note>
    </article>
  );
}
