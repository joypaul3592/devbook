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
      bn: "৩টি Suspense, তবু ৪.৫ সেকেন্ড",
      en: "Three boundaries, still 4.5 seconds",
    },
  },
  {
    id: "architecture",
    label: { bn: "Waterfall বনাম Parallel", en: "Waterfall vs parallel" },
  },
  {
    id: "mechanisms",
    label: { bn: "৩টি মূল মেকানিজম", en: "Three core mechanisms" },
  },
  {
    id: "implementation",
    label: { bn: "Nested বনাম Hoisted", en: "Nested vs hoisted" },
  },
  {
    id: "matrix",
    label: { bn: "Execution Matrix", en: "Execution matrix" },
  },
  {
    id: "takeaway",
    label: { bn: "Production Takeaways", en: "Production takeaways" },
  },
];

export default function SuspenseWaterfallProblems() {
  return (
    <article className="doc-prose">
      {/* ── The problem ───────────────────────────────────────────────── */}
      <H2 id="the-problem" anchorOnly>
        ৩টি Suspense, তবু ৪.৫ সেকেন্ড
      </H2>

      <p>
        রাত ৩:৩৫। ভুলু ভাই ভেবেছিলেন — App Router-এ প্রতিটি কম্পোনেন্ট স্বাধীনভাবে{" "}
        <code>async/await</code> করতে পারে, তাই <code>UserProfile</code>-এর ভেতর{" "}
        <code>UserPosts</code>, আর তার ভেতর <code>PostComments</code> রাখলেই সুন্দর মডিউলার হবে।
        কিন্তু নেটওয়ার্ক প্রোফাইলে দেখা গেল — ইউজার ২s, পোস্ট ১.৫s, কমেন্ট ১s, আর পুরো পেজ শেষ
        হতে মোট ৪.৫ সেকেন্ড!
      </p>

      <Line name="ভুলু ভাই">
        ফাহিম! আমি তো প্রতিটি কম্পোনেন্টের চারপাশে আলাদা <code>&lt;Suspense&gt;</code> বসিয়েছি!
        তাও একটা শেষ হওয়ার পর আরেকটা কেন শুরু হচ্ছে? স্ট্রিমিং সত্ত্বেও মোট সময় তিনটির যোগফলের
        সমান কেন?
      </Line>

      <Line name="ফাহিম">
        ভুলু ভাই! আপনি <strong>async waterfall</strong>-এর ফাঁদে পড়েছেন! কোনো async প্যারেন্টের
        JSX-এর ভেতরে আরেকটি async চাইল্ড রাখলে, প্যারেন্টের <code>await</code> শেষ না হওয়া
        পর্যন্ত সার্ভার চাইল্ডের কোড এক্সিকিউটই শুরু করতে পারে না!
      </Line>

      <Line name="নেক্সট-ভাই">
        একদম! HTML streaming আপনার নেটওয়ার্ক পাইপলাইন ফাস্ট করে, কিন্তু JavaScript রানটাইমের
        execution dependency মেটাতে পারে না। চাইল্ড সার্ভারে শুরুই হতে না পারলে স্ট্রিম চাঙ্কও আটকে
        থাকে।
      </Line>

      {/* ── Architecture ──────────────────────────────────────────────── */}
      <H2 id="architecture">১. Waterfall বনাম Parallel</H2>

      <Diagram>{`┌─────────────────────────────────────────────────────────────────────────┐
│              SUSPENSE ASYNC WATERFALL BOTTLENECK (SEQUENTIAL)           │
└─────────────────────────────────────────────────────────────────────────┘

 SEQUENTIAL WATERFALL — total = 2.0s + 1.5s + 1.0s = 4.5s

 0s                  2.0s                   3.5s                4.5s
 ├────────────────────┤
 │ UserProfile (2.0s) │
 └────────────────────┘
                      ├──────────────────────┤
                      │ UserPosts (1.5s)     │
                      └──────────────────────┘
                                             ├───────────────────┤
                                             │ Comments (1.0s)   │
                                             └───────────────────┘

 -------------------------------------------------------------------------

 PARALLEL STREAMING — total = max(2.0s, 1.5s, 1.0s) = 2.0s

 0s               1.0s          1.5s        2.0s
 ├────────────────────────────────────────────┤  finishes at 2.0s
 │ UserProfile (2.0s)                         │
 ├─────────────────────────────┤                 flushes chunk at 1.5s
 │ UserPosts (1.5s)            │
 ├────────────────┤                              flushes chunk at 1.0s
 │ Comments (1.0s)│
 └────────────────┘`}</Diagram>

      {/* ── Mechanisms ────────────────────────────────────────────────── */}
      <H2 id="mechanisms">২. ৩টি মূল মেকানিজম</H2>

      <Note>
        <ul>
          <li>
            <strong>JSX execution dependency trap:</strong> প্যারেন্ট ফাংশনে{" "}
            <code>await getUserData()</code> দেখলে React ওই লাইনেই আটকে থাকে। প্যারেন্ট{" "}
            <code>return (&lt;Child /&gt;)</code> পর্যন্ত না পৌঁছানো পর্যন্ত সার্ভার জানতেই পারে না
            যে <code>Child</code> নামে কিছু রেন্ডার করতে হবে — তাই চাইল্ডের রিকোয়েস্ট তৈরিই হয় না।
          </li>
          <li>
            <strong>Cascading stream stall:</strong> প্রতিটি চাইল্ডের নিজস্ব বাউন্ডারি থাকা সত্ত্বেও
            structural nesting-এর কারণে পাইপলাইন একসাথে নয়, একের পর এক বিরতি দিয়ে চাঙ্ক পাঠায়।
          </li>
          <li>
            <strong>Data vs architectural dependency:</strong> ইউজার আইডি না পেলে পোস্ট আনা সম্ভব
            না — এটি <em>অনিবার্য</em> waterfall। কিন্তু ৩টি স্বাধীন উইজেট শুধু কোড নেস্টিংয়ের কারণে
            একে অপরের জন্য অপেক্ষা করলে সেটি <em>architectural</em> dependency, যা এড়ানো যায়।
          </li>
        </ul>
      </Note>

      {/* ── Implementation ────────────────────────────────────────────── */}
      <H2 id="implementation">৩. Nested বনাম Hoisted</H2>

      <H3>❌ Anti-pattern — structural nesting</H3>

      <CodeBlock filename="app/profile/page.tsx">{`import { Suspense } from 'react';

async function PostComments() {
  // 3. Runs THIRD (1.0s) — cannot start until UserPosts finishes
  const comments = await fetch('https://api.example.com/comments').then((r) => r.json());
  return <div className="p-2 bg-slate-800 text-xs">Comments ({comments.length})</div>;
}

async function UserPosts() {
  // 2. Runs SECOND (1.5s) — cannot start until the page finishes its await
  const posts = await fetch('https://api.example.com/posts').then((r) => r.json());
  return (
    <div className="space-y-2">
      <h3 className="text-sm font-semibold">User Posts</h3>
      {/* the nested child creates the next step of the waterfall */}
      <Suspense fallback={<div>Loading comments...</div>}>
        <PostComments />
      </Suspense>
    </div>
  );
}

export default async function BadProfilePage() {
  // 1. Runs FIRST (2.0s)
  const user = await fetch('https://api.example.com/user').then((r) => r.json());

  return (
    <div className="p-6 space-y-4">
      <h1>{user.name}</h1>
      {/* UserPosts cannot even START fetching until this page's await resolves */}
      <Suspense fallback={<div>Loading posts...</div>}>
        <UserPosts />
      </Suspense>
    </div>
  );
}`}</CodeBlock>

      <H3>🟢 Fix — hoisted sibling components</H3>

      <CodeBlock filename="app/profile/page.tsx">{`import { Suspense } from 'react';
import 'server-only';

// 1. Independent async component (2.0s)
async function UserProfile() {
  const user = await new Promise<{ name: string }>((res) =>
    setTimeout(() => res({ name: 'Zubayer Salehin' }), 2000)
  );
  return (
    <div className="p-4 bg-slate-900 border border-slate-800 rounded-xl">
      <h1 className="text-xl font-bold text-white">{user.name}</h1>
      <p className="text-xs text-slate-400">Senior Frontend Developer</p>
    </div>
  );
}

// 2. Independent async component (1.5s)
async function UserPosts() {
  const posts = await new Promise<string[]>((res) =>
    setTimeout(
      () => res(['Next.js RSC Architecture', 'Suspense Waterfall Mitigation']),
      1500
    )
  );
  return (
    <div className="p-4 bg-slate-900 border border-slate-800 rounded-xl space-y-2">
      <h3 className="text-sm font-semibold text-emerald-400">Recent Posts</h3>
      <ul className="text-xs text-slate-300 space-y-1">
        {posts.map((p) => (
          <li key={p} className="bg-slate-800/50 p-2 rounded">
            {p}
          </li>
        ))}
      </ul>
    </div>
  );
}

// 3. Independent async component (1.0s)
async function PostComments() {
  const comments = await new Promise<number>((res) => setTimeout(() => res(42), 1000));
  return (
    <div className="p-4 bg-slate-900 border border-slate-800 rounded-xl">
      <p className="text-xs text-slate-400">
        Total system comments:{' '}
        <span className="text-white font-mono">{comments}</span>
      </p>
    </div>
  );
}

export default function OptimizedParallelProfile() {
  // All three async tasks start IN PARALLEL at this level.
  // Total completion is max(2.0, 1.5, 1.0) = 2.0s instead of 4.5s.
  return (
    <main className="max-w-xl mx-auto py-10 px-6 space-y-6 text-slate-100">
      <h2 className="text-lg font-bold border-b border-slate-800 pb-2">
        User Performance Dashboard
      </h2>

      {/* Boundary 1: resolves at 2.0s */}
      <Suspense
        fallback={<div className="h-20 bg-slate-900 rounded-xl animate-pulse" />}
      >
        <UserProfile />
      </Suspense>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Boundary 2: resolves at 1.5s — flushes BEFORE UserProfile */}
        <Suspense
          fallback={<div className="h-32 bg-slate-900 rounded-xl animate-pulse" />}
        >
          <UserPosts />
        </Suspense>

        {/* Boundary 3: resolves at 1.0s — flushes first */}
        <Suspense
          fallback={<div className="h-32 bg-slate-900 rounded-xl animate-pulse" />}
        >
          <PostComments />
        </Suspense>
      </div>
    </main>
  );
}`}</CodeBlock>

      {/* ── Matrix ────────────────────────────────────────────────────── */}
      <H2 id="matrix">৪. Performance &amp; Execution Matrix</H2>

      <Table
        head={["সূচক", "Sequential waterfall", "Parallel streaming"]}
        rows={[
          [
            "Execution pattern",
            "top-to-bottom component waterfall",
            "একসাথে সবগুলো ট্রিগার হয়",
          ],
          [
            "Total response time",
            "T₁ + T₂ + T₃ (৪.৫ সেকেন্ড)",
            "max(T₁, T₂, T₃) (২.০ সেকেন্ড)",
          ],
          [
            "First chunk arrival",
            "১ নম্বর ফেচ শেষ না হওয়া পর্যন্ত আটকে",
            "১ সেকেন্ডেই দ্রুততম চাঙ্ক স্ট্রিম হয়",
          ],
          [
            "Out-of-order injection",
            "অকার্যকর — নিচের ডেটা ফেচই হয় না",
            "দ্রুততম কম্পোনেন্ট আগে ইনজেক্ট হয়",
          ],
        ]}
      />

      <Line name="ভুলু ভাই">
        ধুর! আমি ভেবেছিলাম কম্পোনেন্ট নেস্ট করলেই React নিজে নিজে প্যারালাল করে নেবে! এখন বুঝলাম —
        চাইল্ডকে প্যারেন্টের ভেতর না রেখে পাশাপাশি বসালে ১ সেকেন্ডের কমেন্ট আগে স্ট্রিম হবে!
      </Line>

      {/* ── Takeaways ─────────────────────────────────────────────────── */}
      <H2 id="takeaway">Production Takeaways</H2>

      <Note>
        <ul>
          <li>
            <strong>Avoid async component nesting:</strong> চাইল্ডের ডেটা প্যারেন্টের ডেটার ওপর
            সরাসরি নির্ভরশীল না হলে চাইল্ডকে প্যারেন্টের async JSX-এর ভেতরে না রেখে সিবলিং হিসেবে
            বসান।
          </li>
          <li>
            <strong>Promote parallel initiation:</strong> ডেটা ফেচিং যত ফ্ল্যাট লেভেলে শুরু হবে,
            out-of-order HTML delivery তত ভালো কাজ করবে।
          </li>
          <li>
            <strong>Promise.all for coupled data:</strong> একই কম্পোনেন্টে একাধিক রিকোয়েস্ট লাগলে
            পরপর দুটি <code>await</code> না লিখে <code>Promise.all()</code> ব্যবহার করুন।
          </li>
        </ul>
      </Note>
    </article>
  );
}
