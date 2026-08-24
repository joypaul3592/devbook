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
      bn: "চাইল্ডের স্লো ডেটায় প্যারেন্টও গায়েব",
      en: "A slow child hides the parent too",
    },
  },
  {
    id: "architecture",
    label: { bn: "Bubble-Up আর্কিটেকচার", en: "Bubble-up architecture" },
  },
  {
    id: "mechanisms",
    label: { bn: "৩টি মূল মেকানিজম", en: "Three core mechanisms" },
  },
  {
    id: "implementation",
    label: { bn: "Flat বনাম Nested", en: "Flat vs nested" },
  },
  {
    id: "matrix",
    label: { bn: "Nesting Architecture Matrix", en: "Nesting architecture matrix" },
  },
  {
    id: "takeaway",
    label: { bn: "Production Takeaways", en: "Production takeaways" },
  },
];

export default function NestedSuspenseBoundaries() {
  return (
    <article className="doc-prose">
      {/* ── The problem ───────────────────────────────────────────────── */}
      <H2 id="the-problem" anchorOnly>
        চাইল্ডের স্লো ডেটায় প্যারেন্টও গায়েব
      </H2>

      <p>
        রাত ২:৪৫। ভুলু ভাইয়ের প্রোফাইল পেজে ওপরে নাম-ছবিসহ <code>UserProfileHeader</code> আর তার
        নিচে স্লো <code>ActivityFeed</code>। তিনি পুরো সেকশনকে একটি বাইরের{" "}
        <code>&lt;Suspense&gt;</code> দিয়ে পেঁচিয়ে দিয়েছিলেন। কিন্তু <code>ActivityFeed</code> ৩
        সেকেন্ড স্লো হওয়ায় নাম-ছবিসহ পুরো প্রোফাইল কার্ড গায়েব হয়ে বড় একটা স্কেলিটন ঝুলছিল!
      </p>

      <Line name="ভুলু ভাই">
        ফাহিম! প্যারেন্টেও <code>&lt;Suspense&gt;</code> রাখি আর ভেতরের চাইল্ডেও আলাদা{" "}
        <code>&lt;Suspense&gt;</code> দিই — তখন কোনটা আগে রেন্ডার হবে? চাইল্ডের স্লো ডেটার জন্য কি
        প্যারেন্টের লোডার দেখাবে, নাকি চাইল্ডেরটা?
      </Line>

      <Line name="ফাহিম">
        ভুলু ভাই! এটাই <strong>nested boundary fallback resolution</strong>! React কোনো পেন্ডিং
        promise পেলে ট্রি-র ওপরের দিকে গিয়ে <strong>সবচেয়ে কাছের</strong>{" "}
        <code>&lt;Suspense&gt;</code> বাউন্ডারিটি খুঁজে বের করে। চাইল্ডের চারপাশে আলাদা Suspense
        থাকলে promise প্যারেন্ট পর্যন্ত bubble up না করে চাইল্ডের লোডারই ট্রিগার করে।
      </Line>

      <Line name="নেক্সট-ভাই">
        একদম! Nested Suspense-এর মূল উদ্দেশ্য <strong>progressive UI unlocking</strong> — প্যারেন্টের
        ফাস্ট ডেটা আসামাত্র প্যারেন্ট UI আনলক হয়ে যাবে, আর চাইল্ডের জন্য নিচু স্তরের inner
        fallback দেখাবে।
      </Line>

      {/* ── Architecture ──────────────────────────────────────────────── */}
      <H2 id="architecture">১. Nested Suspense Bubble-Up</H2>

      <Diagram>{`┌─────────────────────────────────────────────────────────────────────────┐
│               NESTED SUSPENSE FALLBACK RESOLUTION FLOW                  │
└─────────────────────────────────────────────────────────────────────────┘

 Outer Suspense boundary (parent)
 ┌───────────────────────────────────────────────────────────────────────┐
 │ <UserProfileHeader />  (fast: 50ms)  ──▶ renders instantly            │
 │                                                                       │
 │ Inner Suspense boundary (child)                                       │
 │ ┌───────────────────────────────────────────────────────────────────┐ │
 │ │ <ActivityFeed />  (slow: 3000ms) ──▶ throws a promise             │ │
 │ └───────────────────────────────────────────────────────────────────┘ │
 │   ▲                                                                   │
 │   └── the promise is caught by the NEAREST inner boundary,            │
 │       so only the activity skeleton shows and the header stays        │
 └───────────────────────────────────────────────────────────────────────┘`}</Diagram>

      {/* ── Mechanisms ────────────────────────────────────────────────── */}
      <H2 id="mechanisms">২. ৩টি মূল মেকানিজম</H2>

      <Note>
        <ul>
          <li>
            <strong>Nearest boundary catch:</strong> যেকোনো async কম্পোনেন্ট থেকে throw হওয়া
            promise তার নিকটতম প্যারেন্ট <code>&lt;Suspense&gt;</code>-এ গিয়ে থামে। চাইল্ডে নিজস্ব
            বাউন্ডারি থাকলে promise আর উপরে ওঠে না — প্যারেন্টের HTML স্ক্রিনে থেকে যায়।
          </li>
          <li>
            <strong>Progressive structural unlocking:</strong> লেয়ার-বাই-লেয়ার UI আনলক করা যায় —
            Level 1: static layout (0ms) → Level 2: parent data (100ms) → Level 3: inner heavy
            data (2500ms)।
          </li>
          <li>
            <strong>Layout thrashing avoidance:</strong> সঠিক নেস্টিং না থাকলে ছোট একটা চাইল্ডের
            ডেটার জন্য পুরো লেআউট বারবার স্কেলিটন আর কনটেন্টের মধ্যে ফ্লিপ-ফ্লপ করে।
          </li>
        </ul>
      </Note>

      {/* ── Implementation ────────────────────────────────────────────── */}
      <H2 id="implementation">৩. Flat বনাম Nested</H2>

      <H3>❌ Anti-pattern — একটিই প্যারেন্ট বাউন্ডারি</H3>

      <CodeBlock filename="app/profile/page.tsx">{`import { Suspense } from 'react';

export default function BadProfilePage() {
  return (
    // The slow activity feed hides the fast profile header for 3 seconds
    <Suspense
      fallback={<div className="p-8 animate-pulse">Loading entire profile...</div>}
    >
      <UserProfileHeader />
      <UserActivityFeed /> {/* 3s delay */}
    </Suspense>
  );
}`}</CodeBlock>

      <H3>🟢 Fix — hierarchical nested boundaries</H3>

      <CodeBlock filename="app/profile/page.tsx">{`import { Suspense } from 'react';
import 'server-only';

// 1. Fast parent component (50ms)
async function UserProfileHeader() {
  await new Promise((res) => setTimeout(res, 50));
  return (
    <div className="p-6 bg-slate-900 border border-slate-800 rounded-2xl flex items-center space-x-4">
      <div className="w-12 h-12 bg-emerald-600 rounded-full flex items-center justify-center font-bold text-white">
        ZS
      </div>
      <div>
        <h2 className="text-lg font-bold text-white">Zubayer Salehin</h2>
        <p className="text-xs text-slate-400">Senior Frontend Developer</p>
      </div>
    </div>
  );
}

// 2. Slow child component (2500ms)
async function UserActivityFeed() {
  await new Promise((res) => setTimeout(res, 2500));
  return (
    <div className="p-4 bg-slate-900/60 border border-slate-800/80 rounded-xl space-y-3">
      <h3 className="text-sm font-semibold text-emerald-400">Recent Activity Log</h3>
      <ul className="text-xs text-slate-300 space-y-2 font-mono">
        <li className="p-2 bg-slate-800/40 rounded">Merged PR #402 to main</li>
        <li className="p-2 bg-slate-800/40 rounded">Deployed RSC boundary fix</li>
      </ul>
    </div>
  );
}

// Inner skeleton for the child ONLY
function ActivitySkeleton() {
  return (
    <div className="p-4 bg-slate-900/40 border border-slate-800/50 rounded-xl animate-pulse space-y-2">
      <div className="h-4 w-1/3 bg-slate-800 rounded" />
      <div className="h-10 w-full bg-slate-800/50 rounded" />
    </div>
  );
}

export default function OptimizedNestedProfile() {
  return (
    <main className="max-w-xl mx-auto py-10 px-6 space-y-6 bg-slate-950 text-slate-100">
      <h1 className="text-xl font-bold border-b border-slate-800 pb-3">
        User Overview
      </h1>

      {/* OUTER boundary — unlocks the profile header quickly */}
      <Suspense
        fallback={<div className="h-24 bg-slate-900 rounded-2xl animate-pulse" />}
      >
        <div className="space-y-6">
          <UserProfileHeader />

          {/* INNER boundary — isolates the slow activity feed */}
          <Suspense fallback={<ActivitySkeleton />}>
            <UserActivityFeed />
          </Suspense>
        </div>
      </Suspense>
    </main>
  );
}`}</CodeBlock>

      {/* ── Matrix ────────────────────────────────────────────────────── */}
      <H2 id="matrix">৪. Boundary Nesting Architecture</H2>

      <Table
        head={["আর্কিটেকচার", "Initial rendering", "UI instability", "Developer control"]}
        rows={[
          [
            "Flat single boundary",
            "সবচেয়ে স্লো চাইল্ডের জন্য আটকে থাকে",
            "শিফট হয় না — সব একসাথে আসে",
            "granular UX দেওয়া অসম্ভব",
          ],
          [
            "Nested boundaries",
            "প্যারেন্ট ৫০ms-এ রেডি, চাইল্ড পরে স্ট্রিম হয়",
            "শূন্য — inner skeleton জায়গা ধরে রাখে",
            "সুনির্দিষ্ট ও আধুনিক UX",
          ],
          [
            "Over-nested",
            "UI ছোট ছোট লোডারে ভরে যায়",
            "skeleton flicker তৈরি হয়",
            "কোড মেইনটেইন করা জটিল",
          ],
        ]}
      />

      <Line name="ভুলু ভাই">
        মারাত্মক ট্রিক! এবার প্রোফাইল কার্ডের নাম-ছবি ৫০ মিলিসেকেন্ডেই দৃশ্যমান, আর ভেতরের
        অ্যাক্টিভিটি ফিড নিজস্ব স্কেলিটন দেখিয়ে ২.৫ সেকেন্ড পর স্মুথলি লোড হচ্ছে!
      </Line>

      {/* ── Takeaways ─────────────────────────────────────────────────── */}
      <H2 id="takeaway">Production Takeaways</H2>

      <Note>
        <ul>
          <li>
            <strong>Nest for progressive loading:</strong> কোনো কম্পোনেন্টের ভেতরে আরেকটি স্বাধীন
            async কনটেন্ট থাকলে (profile card-এর ভেতর comments list) চাইল্ডের চারপাশে অবশ্যই একটি
            inner boundary বসান।
          </li>
          <li>
            <strong>Match inner skeleton dimensions:</strong> inner fallback-এর উচ্চতা চাইল্ডের আসল
            কনটেন্টের সমান রাখুন — এটিই layout jitter ঠেকায়।
          </li>
          <li>
            <strong>Don&apos;t over-nest:</strong> শুধু ধীরগতির বা স্বাধীন ডাইনামিক উইজেটের জন্যই
            inner boundary ব্যবহার করুন; পাশাপাশি থাকা স্ট্যাটিক মার্কআপে নেস্টিং লাগে না।
          </li>
        </ul>
      </Note>
    </article>
  );
}
