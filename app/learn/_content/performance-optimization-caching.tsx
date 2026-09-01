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
      bn: "সাত সেকেন্ডের পেজ",
      en: "A seven-second page",
    },
  },
  {
    id: "architecture",
    label: {
      bn: "অপ্টিমাইজেশনের চার লেয়ার",
      en: "Four layers of optimisation",
    },
  },
  {
    id: "mechanisms",
    label: {
      bn: "৩টি পারফরম্যান্স রুল",
      en: "Three performance rules",
    },
  },
  {
    id: "implementation",
    label: {
      bn: "Code splitting, dedup ও tagged cache",
      en: "Splitting, dedup, tagged cache",
    },
  },
  {
    id: "matrix",
    label: { bn: "কোন কৌশল কী দেয়", en: "What each technique buys" },
  },
  {
    id: "takeaway",
    label: { bn: "Production Takeaways", en: "Production takeaways" },
  },
];

export default function PerformanceOptimizationCaching() {
  return (
    <article className="doc-prose">
      {/* ── The problem ───────────────────────────────────────────────── */}
      <H2 id="the-problem" anchorOnly>
        সাত সেকেন্ডের পেজ
      </H2>

      <p>
        বিকেল ৩:৩০। ভুলু ভাই ভাবছিলেন তার স্পোর্টস পেজটি সুন্দর কাজ করছে। কিন্তু ফাহিম লোড টাইম আর
        বান্ডেল সাইজ চেক করতেই লাল সংখ্যা — পেজ লোড হতে প্রায় ৭ সেকেন্ড। কনসোলে সতর্কতা:{" "}
        <em>large JavaScript bundle detected</em>, <em>render-blocking fetch requests</em>, আর
        নেটওয়ার্ক ট্যাবে একই API বারবার ফেচ হচ্ছে।
      </p>

      <Line name="ভুলু ভাই">
        ফাহিম! Next.js ব্যবহার করলেই তো অ্যাপ ফাস্ট হওয়ার কথা! আমার পেজ এত সময় নিচ্ছে কেন? আর একই
        ডাটা তিনটা কম্পোনেন্টে লাগায় সাইট স্লো হয়ে গেল কেন?
      </Line>

      <Line name="ফাহিম">
        ভুলু ভাই! আপনি কোড লিখেছেন, অপ্টিমাইজ করেননি। তিনটি ট্র্যাপে পড়েছেন — অকারণে ভারী JavaScript
        ক্লায়েন্টে পাঠানো, network waterfall তৈরি করা, আর একই ডাটা বারবার ফেচ করা। App Router-এ
        অপ্টিমাইজেশনের চারটি আলাদা লেয়ার আছে।
      </Line>

      <Line name="নেক্সট-ভাই">
        একদম! ভুলটা হয় যখন আমরা client bundle, request deduplication, data cache আর server
        computation-কে একই সমস্যা ভেবে ফেলি। আসলে এগুলো চারটি আলাদা লেয়ার, আর প্রতিটির নিজস্ব
        সমাধান আছে।
      </Line>

      {/* ── Architecture ──────────────────────────────────────────────── */}
      <H2 id="architecture">১. Optimisation Layers</H2>

      <Diagram>{`┌─────────────────────────────────────────────────────────────────────────────┐
│                    NEXT.JS PERFORMANCE OPTIMISATION LAYERS                  │
└─────────────────────────────────────────────────────────────────────────────┘

  [ 1. CLIENT ]      ──► optimise what reaches the user
                         code splitting via dynamic(), lazy loading, bundle analysis
                         → less JavaScript, faster FCP and TTI

  [ 2. NETWORK ]     ──► optimise how data travels
                         request memoization, Promise.all, no waterfalls
                         → one request instead of five, in one render pass ⭐

  [ 3. CACHE ]       ──► store data close to where it is read
                         data cache with tags, full route cache at the edge
                         → near-instant loads for cached routes

  [ 4. SERVER ]      ──► optimise the computation itself
                         server components, streaming HTML, edge runtime
                         → smaller payloads, progressive rendering

  a fix at the wrong layer changes nothing — find the layer first`}</Diagram>

      {/* ── Mechanisms ────────────────────────────────────────────────── */}
      <H2 id="mechanisms">২. কোর পারফরম্যান্স রুল</H2>

      <p>
        <strong>Deduplicate, don&rsquo;t prop-drill:</strong> একাধিক কম্পোনেন্টে একই ডাটা লাগলে
        উপর থেকে prop পাঠানোর দরকার নেই। <code>fetch</code> একই render pass-এ স্বয়ংক্রিয়ভাবে dedupe
        হয়, আর DB কলের জন্য React-এর <code>cache()</code> একই কাজ করে। ফলে প্রতিটি কম্পোনেন্ট নিজের
        ডাটা নিজেই চাইতে পারে।
      </p>

      <p>
        <strong>Push logic to the server:</strong> যতটা সম্ভব সার্ভারে এক্সিকিউট করুন। সার্ভার
        কম্পোনেন্ট ক্লায়েন্টে কোনো JavaScript পাঠায় না। ইন্টারঅ্যাক্টিভিটি বা স্টেট লাগলেই কেবল
        ক্লায়েন্ট বাউন্ডারি টানুন।
      </p>

      <p>
        <strong>Split what is heavy and rare:</strong> চার্ট, ম্যাপ, PDF ভিউয়ার বা রিচ-টেক্সট
        এডিটরের মতো ভারী লাইব্রেরি স্ট্যাটিক ইমপোর্ট করলে সেটি প্রথম লোডেই চলে আসে —{" "}
        <code>dynamic()</code> দিয়ে সেটিকে দরকারের সময়ে সরিয়ে দিন।
      </p>

      {/* ── Implementation ────────────────────────────────────────────── */}
      <H2 id="implementation">৩. Production Code Implementation</H2>

      <H3>❌ Anti-pattern — ভারী বান্ডেল আর waterfall একসাথে</H3>

      <CodeBlock filename="src/app/dashboard/poor-page.tsx">{`// 🔴 POOR PRACTICE: a static heavy import plus a two-step client waterfall
'use client';

import { useState, useEffect } from 'react';
// ❌ this chart library lands in the first-load bundle, seen or not
import HeavyChartComponent from '@/components/HeavyChart';

export default function PoorPerformancePage() {
  const [data1, setData1] = useState<any>(null);
  const [data2, setData2] = useState<any>(null);

  useEffect(() => {
    // ❌ data2 cannot even start until data1 has fully arrived
    fetch('/api/data1')
      .then((res) => res.json())
      .then((d) => {
        setData1(d);
        fetch(\`/api/data2?param=\${d.id}\`)
          .then((res) => res.json())
          .then(setData2);
      });
  }, []);

  // ❌ the whole page is blank until both requests finish
  if (!data1 || !data2) return <div>Loading...</div>;

  return <HeavyChartComponent data={data2} />;
}`}</CodeBlock>

      <H3>🟢 Production pattern — split, stream, dedupe</H3>

      <p>
        <strong>Step 1 — ভারী অংশ dynamic, বাকিটা স্ট্রিমড।</strong>
      </p>

      <CodeBlock filename="src/app/dashboard/page.tsx">{`// 🟢 PRODUCTION PATTERN: a server page that streams its heavy parts in
import dynamic from 'next/dynamic';
import { Suspense } from 'react';
import { getLiveMatch } from '@/services/matches';
import { ChartSkeleton, WidgetSkeleton } from '@/components/ui/Skeletons';

// 🟢 the chart library leaves the first-load bundle entirely
const DynamicHeavyChart = dynamic(() => import('@/components/HeavyChart'), {
  loading: () => <ChartSkeleton />,
});

const DynamicInteractionWidget = dynamic(
  () => import('@/features/sports/InteractionWidget'),
  { loading: () => <WidgetSkeleton /> },
);

export default async function DashboardPage() {
  const liveMatch = await getLiveMatch();
  if (!liveMatch) return <div>No live match</div>;

  return (
    <main className="space-y-6 p-8">
      <h1 className="text-2xl font-bold">Live Match Dashboard</h1>

      {/* 🟢 server-rendered markup: 0 KB of JavaScript for this block */}
      <div className="rounded bg-slate-100 p-4 shadow">
        <h2 className="text-lg font-semibold">{liveMatch.title}</h2>
        <p className="text-sm">{liveMatch.status}</p>
      </div>

      {/* 🟢 the shell paints immediately; each panel streams in when ready */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <Suspense fallback={<ChartSkeleton />}>
          <DynamicHeavyChart matchId={liveMatch.id} />
        </Suspense>

        <Suspense fallback={<WidgetSkeleton />}>
          <DynamicInteractionWidget matchId={liveMatch.id} />
        </Suspense>
      </div>
    </main>
  );
}`}</CodeBlock>

      <p>
        <strong>Step 2 — dedupe করা ডাটা লেয়ার।</strong>
      </p>

      <CodeBlock filename="src/services/matches.ts">{`// 🟢 PRODUCTION PATTERN: one query per render pass, however many callers
import { cache } from 'react';
import { db } from '@/lib/db';

// 🟢 cache() memoizes the call for one render pass — ten components,
//    one database round trip, and no prop drilling to arrange it
export const getLiveMatch = cache(async () => {
  return db.match.findFirst({ where: { status: 'LIVE' } });
});

export async function getLiveOdds(matchId: string) {
  const res = await fetch(\`https://api.sportsdata.com/v1/odds/\${matchId}\`, {
    headers: { Authorization: \`Bearer \${process.env.SPORTS_API_KEY}\` },
    next: {
      revalidate: 60,              // refreshed in the background
      tags: [\`odds-\${matchId}\`],   // 🟢 invalidated precisely, on demand
    },
  });

  if (!res.ok) throw new Error('Failed to fetch odds');
  return res.json();
}`}</CodeBlock>

      <p>
        লক্ষ করুন <code>dynamic()</code> আর <code>Suspense</code>-এর পার্থক্য —{" "}
        <code>dynamic()</code> ঠিক করে কোডটি <em>কখন ডাউনলোড</em> হবে, আর <code>Suspense</code> ঠিক
        করে বাকি পেজ <em>কখন দেখানো</em> হবে। দুটো একসাথে ব্যবহার করলেই ভারী উইজেট আর প্রথম পেইন্ট
        আটকে রাখে না।
      </p>

      {/* ── Matrix ────────────────────────────────────────────────────── */}
      <H2 id="matrix">৪. Optimisation Technique Matrix</H2>

      <Table
        head={["কৌশল", "উপযুক্ত ক্ষেত্র", "মেকানিজম", "সুবিধা"]}
        rows={[
          [
            "Request dedup",
            "একই ডাটা একাধিক কম্পোনেন্টে",
            "fetch memoization, react cache()",
            "৫-১০টি কল ১টিতে নামে 🟢",
          ],
          [
            "Tagged data cache",
            "লাইভ স্কোর, স্টক, কার্ট",
            "next: { tags }",
            "revalidateTag দিয়ে সুনির্দিষ্ট রিফ্রেশ 🟢",
          ],
          [
            "Code splitting",
            "চার্ট, ম্যাপ, এডিটর",
            "dynamic() / import()",
            "প্রথম লোডের JS নাটকীয়ভাবে কমে 🟢",
          ],
          [
            "Streaming",
            "একটি ধীর প্যানেল, বাকিটা দ্রুত",
            "Suspense boundary",
            "শেল সাথে সাথে পেইন্ট হয় 🟢",
          ],
          [
            "ISR",
            "নিউজ, প্রোডাক্ট পেজ",
            "revalidate: 60",
            "ব্যাকগ্রাউন্ড রিজেনারেশন",
          ],
        ]}
      />

      <Line name="ভুলু ভাই">
        মারাত্মক ফাহিম! চার্টটা <code>dynamic()</code> করে দিতেই প্রথম লোডের JS অর্ধেকে নেমে এসেছে,
        আর <code>cache()</code> বসানোয় একই কোয়েরি তিনবারের বদলে একবারই চলছে। ৭ সেকেন্ডের পেজ এখন এক
        সেকেন্ডেই শেল দেখাচ্ছে!
      </Line>

      {/* ── Takeaways ─────────────────────────────────────────────────── */}
      <H2 id="takeaway">Production Takeaways</H2>

      <Note>
        <ul>
          <li>
            <strong>Never await in sequence:</strong> স্বাধীন promise থাকলে{" "}
            <code>Promise.all()</code> ব্যবহার করুন; পরস্পর-নির্ভর হলে ধীর অংশটিকে{" "}
            <code>Suspense</code>-এ মুড়ে স্ট্রিম করুন।
          </li>
          <li>
            <strong>Default to server components:</strong> যতটা সম্ভব কোড সার্ভারে রাখুন —
            ইন্টারঅ্যাক্টিভিটি বা browser API লাগলেই কেবল ক্লায়েন্ট বাউন্ডারি টানুন।
          </li>
          <li>
            <strong>Measure before optimising:</strong> অনুমানে নয় — bundle analyzer আর Lighthouse
            দিয়ে দেখুন সমস্যাটা কোন লেয়ারে, তারপর সেই লেয়ারেই হাত দিন।
          </li>
        </ul>
      </Note>
    </article>
  );
}
