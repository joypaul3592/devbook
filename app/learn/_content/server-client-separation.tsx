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
      bn: "সব ফাইলে 'use client'",
      en: "'use client' on everything",
    },
  },
  {
    id: "architecture",
    label: {
      bn: "দুই বাউন্ডারির মানচিত্র",
      en: "Mapping the two boundaries",
    },
  },
  {
    id: "mechanisms",
    label: {
      bn: "৩টি সেপারেশন রুল",
      en: "Three separation rules",
    },
  },
  {
    id: "implementation",
    label: {
      bn: "Leaf boundary ও children pattern",
      en: "Leaf boundaries & the children pattern",
    },
  },
  {
    id: "matrix",
    label: { bn: "Server vs client ম্যাট্রিক্স", en: "Server vs client matrix" },
  },
  {
    id: "takeaway",
    label: { bn: "Production Takeaways", en: "Production takeaways" },
  },
];

export default function ServerClientSeparation() {
  return (
    <article className="doc-prose">
      {/* ── The problem ───────────────────────────────────────────────── */}
      <H2 id="the-problem" anchorOnly>
        সব ফাইলে &lsquo;use client&rsquo;
      </H2>

      <p>
        দুপুর ১:৩০। কনসোলে লাল অক্ষরে এরর:{" "}
        <em>You&rsquo;re importing a component that needs useState. It only works in a Client
        Component…</em>। ভুলু ভাই তাড়াহুড়ো করে ফাইলের একদম উপরে <code>&apos;use client&apos;</code>{" "}
        লিখে দিলেন। এরর গায়েব! কিন্তু রিফ্রেশ দিতেই দেখলেন পারফরম্যান্স স্কোর ৭০ থেকে নেমে ৩৫, আর
        সার্ভার ডাটা ব্রাউজারের নেটওয়ার্ক ট্যাবে দেখা যাচ্ছে।
      </p>

      <Line name="ভুলু ভাই">
        ফাহিম! সব ফাইলে <code>&apos;use client&apos;</code> বসিয়ে দিলে তো সব কাজ করে! তাহলে App
        Router-এ এই server আর client-এর আলাদা প্যাঁচাল কেন? আর বান্ডেল সাইজ এত বাড়ল কেন?
      </Line>

      <Line name="ফাহিম">
        ভুলু ভাই! <code>&apos;use client&apos;</code> কোনো জাদুকরী সমাধান নয় — এটি একটি{" "}
        <strong>boundary marker</strong>। চোখ বন্ধ করে প্রতিটি ফাইলে বসিয়ে দিলে আপনি RSC-র সবচেয়ে
        বড় দুই শক্তিই নষ্ট করছেন: জিরো-বান্ডেল রেন্ডারিং আর সরাসরি ব্যাকএন্ড অ্যাক্সেস।
      </Line>

      <Line name="নেক্সট-ভাই">
        একদম! বাউন্ডারি ঠিক রাখা শুধু সিকিউরিটির জন্য নয় — এটি সরাসরি LCP আর
        time-to-interactive-এর ওপর প্রভাব ফেলে। মূল কথাটা সহজ:{" "}
        <strong>বাউন্ডারিকে যত নিচে নামানো যায়, তত ভালো।</strong>
      </Line>

      {/* ── Architecture ──────────────────────────────────────────────── */}
      <H2 id="architecture">১. Server vs Client Mental Model</H2>

      <Diagram>{`┌─────────────────────────────────────────────────────────────────────────────┐
│                     SERVER VS CLIENT BOUNDARY MAPPING                       │
└─────────────────────────────────────────────────────────────────────────────┘

  [ SERVER BOUNDARY ]  (the default in App Router)
  ├── direct data access (Prisma / Drizzle / SQL)
  ├── zero JavaScript shipped to the browser
  ├── secrets and private environment variables
  └── file system and backend access
         │
         │  props (serializable only), or children
         ▼
  [ CLIENT BOUNDARY ]  (explicit 'use client')
  ├── interactivity — onClick, onChange, onSubmit
  ├── React state and lifecycle — useState, useEffect
  ├── browser APIs — window, localStorage, navigator
  └── refs and custom hooks

  the boundary is a one-way door: everything imported below it becomes client code`}</Diagram>

      {/* ── Mechanisms ────────────────────────────────────────────────── */}
      <H2 id="mechanisms">২. কোর সেপারেশন রুল</H2>

      <p>
        <strong>Move boundaries to the leaves:</strong> পুরো পেজ বা বড় কন্টেইনারকে ক্লায়েন্ট না
        বানিয়ে শুধু যে ছোট উইজেটে স্টেট বা ইভেন্ট লাগে (বাটন, ইনপুট, ড্রপডাউন) সেটিকেই{" "}
        <code>&apos;use client&apos;</code> দিন। একটি পেজে দশটি ছোট ক্লায়েন্ট leaf থাকা, একটি বড়
        ক্লায়েন্ট ট্রি থাকার চেয়ে অনেক সস্তা।
      </p>

      <p>
        <strong>Composition via children:</strong> ক্লায়েন্ট কন্টেইনারের ভেতরে ভারী সার্ভার কন্টেন্ট
        রাখতে হলে সেটিকে <code>children</code> prop হিসেবে পাস করুন। তখন সার্ভার কম্পোনেন্ট সার্ভারেই
        রেন্ডার হয় — ক্লায়েন্ট র‍্যাপার থাকা সত্ত্বেও তার জন্য এক বাইট JS-ও যায় না।
      </p>

      <p>
        <strong>Serialization boundary:</strong> সার্ভার থেকে ক্লায়েন্টে props অবশ্যই serializable
        হতে হবে — string, number, plain object, array। ফাংশন, ক্লাস ইনস্ট্যান্স বা ডাটাবেস কানেকশন
        পাস করা যাবে না। তাই ডোমেইন entity পাঠানোর আগে plain DTO-তে রূপান্তর করতে হয়।
      </p>

      {/* ── Implementation ────────────────────────────────────────────── */}
      <H2 id="implementation">৩. Production Code Implementation</H2>

      <H3>❌ Anti-pattern — পুরো পেজ ক্লায়েন্ট</H3>

      <CodeBlock filename="src/app/sports/page.tsx">{`// 🔴 POOR PRACTICE: the whole route becomes a client component
'use client';

import { useState, useEffect } from 'react';
import { db } from '@/lib/db'; // ❌ a database client in the browser bundle

export default function SportsDashboardPage() {
  const [matches, setMatches] = useState([]);

  useEffect(() => {
    // ❌ a client-side waterfall, plus an internal API you now must secure
    fetch('/api/matches')
      .then((res) => res.json())
      .then(setMatches);
  }, []);

  return (
    <div>
      <h1>Live Sports Dashboard</h1>
      {/* every row's markup now ships as JavaScript, for no benefit */}
      <MatchList data={matches} />
    </div>
  );
}`}</CodeBlock>

      <H3>🟢 Production pattern — leaf boundary + children</H3>

      <p>
        <strong>Step 1 — ইন্টারঅ্যাক্টিভ অংশটুকুই ক্লায়েন্ট।</strong>
      </p>

      <CodeBlock filename="src/components/ui/InteractiveMatchCard.tsx">{`// 🟢 PRODUCTION PATTERN: an isolated client leaf that accepts server children
'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';

interface MatchCardProps {
  matchId: string;
  initialLikes: number;
  // 🟢 the heavy content arrives already rendered — this file never sees it
  children: React.ReactNode;
}

export function InteractiveMatchCard({ matchId, initialLikes, children }: MatchCardProps) {
  const [likes, setLikes] = useState(initialLikes);

  return (
    <div className="rounded-lg border p-4 shadow-sm transition hover:shadow-md">
      {children}

      <div className="mt-4 flex items-center justify-between border-t pt-3">
        <span className="text-sm text-slate-500">{likes} Reactions</span>
        <Button size="sm" onClick={() => setLikes((n) => n + 1)}>
          Like Match
        </Button>
      </div>
    </div>
  );
}`}</CodeBlock>

      <p>
        <strong>Step 2 — পেজ সার্ভার কম্পোনেন্টই থাকে।</strong>
      </p>

      <CodeBlock filename="src/app/sports/page.tsx">{`// 🟢 PRODUCTION PATTERN: a server page that hands server markup to a client shell
import { db } from '@/lib/db'; // 🟢 safe — this never reaches the browser
import { InteractiveMatchCard } from '@/components/ui/InteractiveMatchCard';

export const revalidate = 60;

export default async function SportsDashboardPage() {
  // 🟢 a direct query: no extra API route, no client waterfall
  const matches = await db.match.findMany({
    take: 10,
    orderBy: { createdAt: 'desc' },
  });

  return (
    <main className="container mx-auto py-8">
      <h1 className="mb-6 text-2xl font-bold">Live Sports Dashboard</h1>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        {matches.map((match) => (
          <InteractiveMatchCard
            key={match.id}
            matchId={match.id}
            initialLikes={match.likesCount}
          >
            {/* 🟢 server-rendered: 0 KB of JavaScript for this whole block */}
            <div className="space-y-2">
              <h2 className="text-lg font-semibold">{match.title}</h2>
              <p className="text-sm text-slate-600">{match.description}</p>
              <div className="rounded bg-slate-100 p-2 font-mono text-xs">
                Venue: {match.venue} | Status: {match.status}
              </div>
            </div>
          </InteractiveMatchCard>
        ))}
      </div>
    </main>
  );
}`}</CodeBlock>

      <p>
        লক্ষ করুন — <code>InteractiveMatchCard</code> একটি ক্লায়েন্ট কম্পোনেন্ট, তবু ম্যাচের বিবরণ,
        ভেন্যু আর স্ট্যাটাসের markup ক্লায়েন্ট বান্ডেলে যায় না। <code>children</code> হিসেবে আসা JSX
        সার্ভারেই রেন্ডার হয়ে গেছে, ক্লায়েন্ট শুধু ফলাফলটি বসায়।
      </p>

      {/* ── Matrix ────────────────────────────────────────────────────── */}
      <H2 id="matrix">৪. Server / Client Capability Matrix</H2>

      <Table
        head={["দিক", "Server Component", "Client Component"]}
        rows={[
          ["JS bundle", "০ KB — শুধু সার্ভারে চলে 🟢", "ব্রাউজারে ডাউনলোড হয়"],
          [
            "সরাসরি DB অ্যাক্সেস",
            "হ্যাঁ — Prisma, Drizzle, SQL 🟢",
            "সম্পূর্ণ নিষিদ্ধ 🔴",
          ],
          [
            "Secrets ও env",
            "নিরাপদ — process.env.API_SECRET 🟢",
            "শুধু NEXT_PUBLIC_ ভ্যারিয়েবল",
          ],
          ["State ও lifecycle", "নেই — useState, useEffect ❌", "সাপোর্ট করে 🟢"],
          ["Event handler", "নেই — onClick, onSubmit ❌", "সাপোর্ট করে 🟢"],
          ["Browser API", "নেই — window, localStorage ❌", "সাপোর্ট করে 🟢"],
        ]}
      />

      <Line name="ভুলু ভাই">
        দারুণ ফাহিম! এখন বুঝলাম <code>&apos;use client&apos;</code> মানে &ldquo;এররটা চলে যাক&rdquo;
        নয় — এটা একটা সিদ্ধান্ত। বাউন্ডারিটা নিচে নামিয়ে দিতেই বান্ডেল সাইজ আবার আগের জায়গায়!
      </Line>

      {/* ── Takeaways ─────────────────────────────────────────────────── */}
      <H2 id="takeaway">Production Takeaways</H2>

      <Note>
        <ul>
          <li>
            <strong>Default to server:</strong> সব ফাইল বাই-ডিফল্ট সার্ভার কম্পোনেন্ট হিসেবে লিখুন;
            শুধু event handler, hook বা browser API লাগলে তবেই{" "}
            <code>&apos;use client&apos;</code> যোগ করুন।
          </li>
          <li>
            <strong>Push boundaries down:</strong> পেজ বা কন্টেইনার লেভেলে নয় — UI ট্রির সবচেয়ে নিচে
            (leaf) বাউন্ডারি নামান।
          </li>
          <li>
            <strong>Use the children strategy:</strong> ক্লায়েন্ট র‍্যাপারের ভেতরে সার্ভার কন্টেন্ট
            রাখতে <code>children</code> প্রপ ব্যবহার করুন — এটিই বান্ডেল ছোট রাখার সবচেয়ে কার্যকর
            একক কৌশল।
          </li>
        </ul>
      </Note>
    </article>
  );
}
