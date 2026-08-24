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
      bn: "isLoading ছাড়াই লোডার এলো কীভাবে?",
      en: "A loader with no isLoading flag",
    },
  },
  {
    id: "architecture",
    label: { bn: "Suspension মেকানিজম", en: "The suspension mechanism" },
  },
  {
    id: "foundations",
    label: { bn: "মেন্টাল মডেলের ৪টি ভিত্তি", en: "Four foundations" },
  },
  {
    id: "implementation",
    label: { bn: "Imperative বনাম Declarative", en: "Imperative vs declarative" },
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

export default function ReactSuspenseMentalModel() {
  return (
    <article className="doc-prose">
      {/* ── The problem ───────────────────────────────────────────────── */}
      <H2 id="the-problem" anchorOnly>
        isLoading ছাড়াই লোডার এলো কীভাবে?
      </H2>

      <p>
        রাত ১২:৪৫। ভুলু ভাই একটি Async Server Component বানাচ্ছিলেন। তিনি ভাবছিলেন{" "}
        <code>&lt;Suspense&gt;</code> হয়তো ভেতরে একটি <code>isLoading</code> স্টেট বা{" "}
        <code>useEffect</code> ট্র্যাক করে। কিন্তু সরাসরি <code>async/await</code> ব্যবহার করা
        সার্ভার কম্পোনেন্টকে <code>&lt;Suspense&gt;</code> দিয়ে র‍্যাপ করতেই — কোনো{" "}
        <code>useEffect</code> ছাড়াই মাঝপথে রেন্ডারিং থেমে লোডার এলো, আর ডেটা আসার পর নির্দিষ্ট
        অংশটুকু আপডেট হলো!
      </p>

      <Line name="ভুলু ভাই">
        ফাহিম! আমি তো কোনো <code>useState</code> বা <code>isLoading</code> ফ্ল্যাগ লিখিনি! সার্ভার
        কম্পোনেন্টে <code>await fetchUserData()</code> লেখার সাথে সাথে React কীভাবে বুঝল যে ডেটা
        পেন্ডিং, আর পুরো পেজ ব্লক না করে শুধু fallback লোডারটা বসিয়ে দিল?
      </Line>

      <Line name="ফাহিম">
        ভুলু ভাই! Suspense কোনো <code>isLoading</code> চেক করে না। এটি কাজ করে JavaScript-এর{" "}
        <strong>promise throwing &amp; catching</strong> মেকানিজমের ওপর। কোনো async কম্পোনেন্ট
        ডেটার জন্য ওয়েট করলে React রেন্ডার ফ্রেমে সেই পেন্ডিং promise-টি throw করে, আর প্যারেন্ট{" "}
        <code>&lt;Suspense&gt;</code> সেটিকে ক্যাচ করে তৎক্ষণাৎ fallback রেন্ডার করে দেয়।
      </Line>

      <Line name="নেক্সট-ভাই">
        একদম! সাধারণ JavaScript-এ <code>try/catch</code> যেমন error ক্যাচ করে, Suspense ঠিক তেমনি
        pending promise ক্যাচ করে। ডেটা রেজলভ হলে React ব্যাকগ্রাউন্ডে স্ট্রিম হওয়া HTML টুকরোটি
        UI-এর ওই নির্দিষ্ট স্লটে প্লাগ-ইন করে দেয়।
      </Line>

      {/* ── Architecture ──────────────────────────────────────────────── */}
      <H2 id="architecture">১. Suspension Mechanism Flow</H2>

      <Diagram>{`┌─────────────────────────────────────────────────────────────────────────┐
│                 REACT SUSPENSE UNDER-THE-HOOD FLOW                      │
└─────────────────────────────────────────────────────────────────────────┘

 Async Server Component        Suspense Boundary            Browser UI
         │                            │                          │
 1. Starts rendering                  │                          │
         │                            │                          │
 2. Hits \`await fetch()\`              │                          │
    ──▶ throws a pending promise ─────┼──▶ catches the promise    │
                                      │                          │
                                      │  3. renders the fallback │
                                      └─────────────────────────┼──▶ skeleton loader shows
                                                                 │
 4. Promise resolves (data ready)                                │
    ──▶ emits a chunk over the stream ───────────────────────────┼──▶ skeleton replaced by
                                                                 │    the real UI chunk`}</Diagram>

      {/* ── Foundations ───────────────────────────────────────────────── */}
      <H2 id="foundations">২. মেন্টাল মডেলের ৪টি ভিত্তি</H2>

      <Note>
        <ul>
          <li>
            <strong>A try/catch for promises:</strong> <code>try/catch</code> যেমন error থ্রো হলে
            এক্সিকিউশন থামিয়ে <code>catch</code>-এ পাঠায়, <code>&lt;Suspense&gt;</code> তেমনি
            কম্পোনেন্ট ট্রি থেকে আসা pending promise ধরে ফেলে এবং রেজলভ হওয়া পর্যন্ত{" "}
            <code>fallback</code> রেন্ডার করে রাখে।
          </li>
          <li>
            <strong>Zero client state:</strong> পুরোনো React-এ{" "}
            <code>const [loading, setLoading] = useState(true)</code> লাগত। Suspense-এ লোডিং স্টেট
            পুরোপুরি declarative — কম্পোনেন্ট শুধু ডেটা <code>await</code> করে, বাকিটা বাউন্ডারি
            সামলায়।
          </li>
          <li>
            <strong>Out-of-order HTML streaming:</strong> সার্ভার স্লো অংশের জন্য অপেক্ষা না করে
            ফাস্ট অংশগুলো আগেই পাঠায়; পরে ডেটা তৈরি হলে নতুন HTML chunk পাঠিয়ে আগের লোডারকে
            রিপ্লেস করে দেয়।
          </li>
          <li>
            <strong>Unblocking the main thread:</strong> একটি ধীরগতির API বা ডেটাবেস কোয়েরি পুরো
            অ্যাপের SSR আটকে রাখতে পারে না।
          </li>
        </ul>
      </Note>

      {/* ── Implementation ────────────────────────────────────────────── */}
      <H2 id="implementation">৩. Imperative বনাম Declarative</H2>

      <H3>❌ Anti-pattern — ম্যানুয়াল লোডিং স্টেট</H3>

      <CodeBlock filename="components/old-user-profile.tsx">{`'use client';

import { useEffect, useState } from 'react';

export default function OldUserProfile() {
  const [user, setUser] = useState<{ name: string } | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/user')
      .then((res) => res.json())
      .then((data) => {
        setUser(data);
        setLoading(false);
      });
  }, []);

  // Manual loading checks pollute the component and force a client bundle
  if (loading) return <div>Loading user details...</div>;

  return <div>Welcome, {user!.name}!</div>;
}`}</CodeBlock>

      <H3>🟢 Fix — async RSC + declarative boundary</H3>

      <CodeBlock filename="app/profile/_components/user-card.tsx">{`import 'server-only';

async function fetchUserData() {
  // Simulating a delayed database / API query
  await new Promise((resolve) => setTimeout(resolve, 2000));
  return { name: 'Zubayer Salehin', role: 'Senior Frontend Developer' };
}

export async function UserCard() {
  // Execution pauses here; React throws this promise to the nearest boundary
  const user = await fetchUserData();

  return (
    <div className="p-6 bg-slate-900 border border-slate-800 rounded-2xl text-slate-100">
      <h2 className="text-xl font-bold">{user.name}</h2>
      <p className="text-sm text-slate-400 mt-1">{user.role}</p>
    </div>
  );
}`}</CodeBlock>

      <CodeBlock filename="app/profile/page.tsx">{`import { Suspense } from 'react';
import { UserCard } from './_components/user-card';

// Fallback skeleton matching the real card's shape
function UserCardSkeleton() {
  return (
    <div className="p-6 bg-slate-900 border border-slate-800 rounded-2xl animate-pulse space-y-3">
      <div className="h-6 w-1/2 bg-slate-800 rounded" />
      <div className="h-4 w-1/3 bg-slate-800 rounded" />
    </div>
  );
}

export default function ProfilePage() {
  return (
    <main className="max-w-xl mx-auto py-12 px-6 space-y-6">
      <h1 className="text-2xl font-bold text-white">Developer Profile</h1>

      {/* The boundary catches the promise thrown by UserCard */}
      <Suspense fallback={<UserCardSkeleton />}>
        <UserCard />
      </Suspense>
    </main>
  );
}`}</CodeBlock>

      {/* ── Matrix ────────────────────────────────────────────────────── */}
      <H2 id="matrix">৪. Traditional Loading বনাম Suspense</H2>

      <Table
        head={[
          "বৈশিষ্ট্য",
          <>
            Traditional <code>useState(loading)</code>
          </>,
          "React Suspense",
        ]}
        rows={[
          [
            "স্টেট হ্যান্ডলিং",
            <>
              Imperative — <code>setLoading(false)</code>
            </>,
            "Declarative — অটোমেটিক promise catching",
          ],
          [
            "Main thread blockage",
            "ব্রাউজারে JS রান হওয়া পর্যন্ত অপেক্ষা",
            "শূন্য — HTML সাথে সাথে স্ট্রিম হয়",
          ],
          [
            "কোড মেইনটেইনেবিলিটি",
            "boilerplate-এ ভরা",
            "ক্লিন async কম্পোনেন্ট + সিম্পল র‍্যাপ",
          ],
          [
            "RSC compatibility",
            "ক্লায়েন্ট কম্পোনেন্ট ছাড়া সম্ভব নয়",
            "Server Components-এর মূল স্তম্ভ",
          ],
        ]}
      />

      <Line name="ভুলু ভাই">
        অসাধারণ! Suspense মানে কোনো ম্যাজিক না — এটা স্রেফ async কম্পোনেন্টের throw করা promise ধরে
        লোডার দেখায় আর ব্যাকগ্রাউন্ডে HTML স্ট্রিম করে ডেটা প্লাগ-ইন করে!
      </Line>

      {/* ── Takeaways ─────────────────────────────────────────────────── */}
      <H2 id="takeaway">Production Takeaways</H2>

      <Note>
        <ul>
          <li>
            <strong>Think of Suspense as a promise boundary:</strong> এটিকে লোডিং কনটেইনার না ভেবে{" "}
            <code>try/catch</code>-এর মতো একটি &quot;promise catcher&quot; হিসেবে কল্পনা করুন।
          </li>
          <li>
            <strong>Keep async components low in the tree:</strong> ডেটা ফেচিং ট্রি-র নিচের দিকের
            নির্দিষ্ট কম্পোনেন্টে রাখুন, যাতে পুরো পেজ সাসপেন্ড না হয়ে শুধু ওই অংশটুকু সাসপেন্ড হয়।
          </li>
          <li>
            <strong>Match skeleton layouts:</strong> fallback স্কেলিটনের মাপ আসল কম্পোনেন্টের সমান
            রাখলে CLS শূন্যের কাছে থাকে।
          </li>
        </ul>
      </Note>
    </article>
  );
}
