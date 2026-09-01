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
      bn: "পাঁচ সেকেন্ডের waterfall",
      en: "A five-second waterfall",
    },
  },
  {
    id: "architecture",
    label: {
      bn: "ডাটা ফেচিং পাইপলাইন",
      en: "The data fetching pipeline",
    },
  },
  {
    id: "mechanisms",
    label: {
      bn: "৩টি আর্কিটেকচারাল স্তম্ভ",
      en: "Three architectural pillars",
    },
  },
  {
    id: "implementation",
    label: {
      bn: "Parallel fetch ও tag revalidation",
      en: "Parallel fetching & tag revalidation",
    },
  },
  {
    id: "matrix",
    label: { bn: "কৌশল বাছাইয়ের ম্যাট্রিক্স", en: "Choosing a strategy" },
  },
  {
    id: "takeaway",
    label: { bn: "Production Takeaways", en: "Production takeaways" },
  },
];

export default function DataFetchingStrategy() {
  return (
    <article className="doc-prose">
      {/* ── The problem ───────────────────────────────────────────────── */}
      <H2 id="the-problem" anchorOnly>
        পাঁচ সেকেন্ডের waterfall
      </H2>

      <p>
        দুপুর ২:১৫। লাইভ ড্যাশবোর্ড পেজ লোড হতে প্রায় ৫ সেকেন্ড লাগছে। নেটওয়ার্ক ট্যাবে তাকিয়ে দেখা
        গেল একটি API-র ডাটা আসার পর পরেরটির রিকোয়েস্ট যাচ্ছে, তারপর আরেকটির — তৈরি হয়েছে এক বিশাল
        network waterfall। এর ওপর ইউজারের ক্লিকে ডাটা আপডেট হলেও স্ক্রিনে পুরোনো ডাটা ক্যাশ হয়ে আটকে
        থাকছে।
      </p>

      <Line name="ভুলু ভাই">
        ফাহিম! সার্ভার কম্পোনেন্টে ডাটা ফেচিং তো সহজ ভেবেছিলাম। এক পেজে পাঁচটা কম্পোনেন্টের ডাটা আনতে
        গিয়ে সাইট স্লো হলো কেন? আর আপডেট করার পরও ইউজার পুরোনো ডাটা দেখছে কেন?
      </Line>

      <Line name="ফাহিম">
        ভুলু ভাই! ডাটা ফেচিং শুধু <code>fetch()</code> লেখার বিষয় নয়। কোথায় ফেচ হচ্ছে, একাধিক
        রিকোয়েস্ট প্যারালাল না সিকুয়েন্সিয়াল, আর mutation-এর পর ক্যাশ কীভাবে invalidate হচ্ছে —
        এগুলো আগে থেকে ডিজাইন না করলে ডাটা ফেচিংই পারফরম্যান্স খেয়ে ফেলে।
      </Line>

      <Line name="নেক্সট-ভাই">
        একদম! App Router-এ ডাটা ফেচিং স্ট্র্যাটেজির তিনটি স্তম্ভ — request deduplication, parallel
        fetching, আর tag-based revalidation।
      </Line>

      {/* ── Architecture ──────────────────────────────────────────────── */}
      <H2 id="architecture">১. Data Fetching Pipeline</H2>

      <Diagram>{`┌─────────────────────────────────────────────────────────────────────────────┐
│                    DATA FETCHING ARCHITECTURE PIPELINE                      │
└─────────────────────────────────────────────────────────────────────────────┘

  [ BROWSER / CLIENT ]
           │  navigation, or a server action
           ▼
  [ NEXT.JS SERVER BOUNDARY ]
           │
           ├─ 1. request memoization — identical calls in one render pass dedupe
           │
           ├─ 2. parallel fetching — Promise.all for independent sources
           │       ┌──────────────────┬──────────────────┬──────────────────┐
           │       ▼                  ▼                  ▼
           │   user profile       live odds          team stats
           │       └──────────────────┴──────────────────┘
           │              all three start at the same moment
           │
           ├─ 3. data cache — fetch(url, { next: { tags: ['matches'] } })
           │
           └─ 4. revalidation — revalidateTag('matches') from a server action`}</Diagram>

      {/* ── Mechanisms ────────────────────────────────────────────────── */}
      <H2 id="mechanisms">২. তিনটি আর্কিটেকচারাল স্তম্ভ</H2>

      <p>
        <strong>Request deduplication:</strong> একটি রেন্ডার পাসে একই URL একাধিক কম্পোনেন্ট থেকে ফেচ
        করা হলে React স্বয়ংক্রিয়ভাবে একটিই রিকোয়েস্ট পাঠায়, বাকিগুলো memoized ডাটা পায়। ফলে prop
        drilling না করে প্রতিটি কম্পোনেন্ট নিজের ডাটা নিজে চাইতে পারে — কোনো বাড়তি খরচ ছাড়াই।
      </p>

      <p>
        <strong>Parallel over waterfall:</strong> একাধিক স্বাধীন promise থাকলে{" "}
        <code>await</code> দিয়ে একটার পর একটা না চালিয়ে <code>Promise.all()</code> ব্যবহার করুন। মোট
        সময় তখন যোগফল নয়, সবচেয়ে ধীর কলটির সমান হয়। পরস্পর-নির্ভর হলে বরং{" "}
        <code>Suspense</code> দিয়ে স্ট্রিম করুন।
      </p>

      <p>
        <strong>Granular revalidation:</strong> গ্লোবাল রি-রেন্ডার না করে নির্দিষ্ট tag বা path
        চিহ্নিত করে অন-ডিমান্ড ক্যাশ ইনভ্যালিডেশন। প্রতিটি fetch-এ অর্থবহ tag দিলে mutation-এর পর ঠিক
        যতটুকু দরকার, ততটুকুই বাসি হয়।
      </p>

      {/* ── Implementation ────────────────────────────────────────────── */}
      <H2 id="implementation">৩. Production Code Implementation</H2>

      <H3>❌ Anti-pattern — ক্লায়েন্ট-সাইড waterfall</H3>

      <CodeBlock filename="src/features/sports/PoorMatchDashboard.tsx">{`// 🔴 POOR PRACTICE: a two-step client waterfall, on top of a round trip
'use client';

import { useState, useEffect } from 'react';

export function PoorMatchDashboard() {
  const [matches, setMatches] = useState<any[]>([]);

  useEffect(() => {
    // ❌ STEP 1: fetch the user first
    fetch('/api/user')
      .then((res) => res.json())
      .then((userData) => {
        // ❌ STEP 2: matches only start AFTER the user response lands
        fetch(\`/api/matches?country=\${userData.country}\`)
          .then((res) => res.json())
          .then(setMatches);
      });
  }, []);

  return <div>{/* the user stares at a spinner for both round trips */}</div>;
}`}</CodeBlock>

      <H3>🟢 Production pattern — parallel fetch + tagged cache</H3>

      <p>
        <strong>Step 1 — ট্যাগসহ কেন্দ্রীয় ডাটা লেয়ার।</strong>
      </p>

      <CodeBlock filename="src/services/sports.ts">{`// 🟢 PRODUCTION PATTERN: every fetch declares its own cache identity
import { db } from '@/lib/db';

export async function getLiveOdds(matchId: string) {
  const res = await fetch(\`https://api.sportsdata.com/v1/odds/\${matchId}\`, {
    headers: { Authorization: \`Bearer \${process.env.SPORTS_API_KEY}\` },
    next: {
      revalidate: 60,                                  // background refresh
      tags: [\`odds-\${matchId}\`, 'sports-global'],       // 🟢 one narrow, one broad
    },
  });

  if (!res.ok) throw new Error('Failed to fetch odds');
  return res.json();
}

export async function getMatchDetails(matchId: string) {
  // a direct query — memoized within a single render pass
  return db.match.findUnique({ where: { id: matchId } });
}`}</CodeBlock>

      <p>
        <strong>Step 2 — সার্ভার কম্পোনেন্টে প্যারালাল ফেচ।</strong>
      </p>

      <CodeBlock filename="src/app/matches/[id]/page.tsx">{`// 🟢 PRODUCTION PATTERN: independent sources start together, not in sequence
import { getLiveOdds, getMatchDetails } from '@/services/sports';
import { RevalidateOddsButton } from './RevalidateOddsButton';

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function MatchDetailPage({ params }: PageProps) {
  const { id } = await params;

  // 🟢 both requests fire at once — total time is the slower of the two
  const [match, odds] = await Promise.all([
    getMatchDetails(id),
    getLiveOdds(id),
  ]);

  if (!match) return <div>Match not found</div>;

  return (
    <main className="space-y-6 p-6">
      <h1 className="text-2xl font-bold">{match.title}</h1>

      <div className="rounded-lg bg-slate-900 p-4 text-white">
        <h2 className="text-lg font-semibold">Live Odds</h2>
        <p>Current odds: {odds.currentOdds}</p>
      </div>

      <RevalidateOddsButton matchId={id} />
    </main>
  );
}`}</CodeBlock>

      <p>
        <strong>Step 3 — server action থেকে টার্গেটেড ইনভ্যালিডেশন।</strong>
      </p>

      <CodeBlock filename="src/app/actions/sports.ts">{`// 🟢 PRODUCTION PATTERN: on-demand invalidation, scoped to one match
'use server';

import { revalidateTag } from 'next/cache';

export async function refreshMatchOdds(matchId: string) {
  try {
    // 🟢 only this match's odds go stale — every other page keeps its cache
    revalidateTag(\`odds-\${matchId}\`);
    return { success: true, message: 'Odds updated successfully' };
  } catch {
    return { success: false, message: 'Failed to revalidate' };
  }
}`}</CodeBlock>

      <p>
        যদি দুটি সোর্সের একটি ধীর হয়, তবে <code>Promise.all</code>-এর বদলে ধীর অংশটিকে{" "}
        <code>Suspense</code>-এ মুড়ে দিন — দ্রুত অংশটি সাথে সাথেই স্ট্রিম হয়ে যাবে, ইউজারকে ধীরতমটির
        জন্য অপেক্ষা করতে হবে না।
      </p>

      {/* ── Matrix ────────────────────────────────────────────────────── */}
      <H2 id="matrix">৪. Data Fetching Strategy Matrix</H2>

      <Table
        head={["কৌশল", "উপযুক্ত ক্ষেত্র", "ক্যাশিং", "ইনভ্যালিডেশন"]}
        rows={[
          [
            "Static / pre-rendered",
            "ব্লগ, ল্যান্ডিং পেজ, ডকুমেন্টেশন",
            "স্থায়ী ক্যাশ",
            "বিল্ড টাইম বা ডিপ্লয়",
          ],
          [
            "ISR (timed)",
            "নিউজ, ই-কমার্স প্রোডাক্ট",
            "revalidate: 60",
            "ব্যাকগ্রাউন্ড stale-while-revalidate",
          ],
          [
            "On-demand tag",
            "লাইভ স্কোর, স্টক প্রাইস, কার্ট",
            "ট্যাগসহ ডাটা ক্যাশ",
            "revalidateTag('tag') 🟢",
          ],
          [
            "Dynamic / no-store",
            "ইউজার ড্যাশবোর্ড, রিয়েল-টাইম প্রেফারেন্স",
            "ক্যাশ নেই",
            "প্রতি রিকোয়েস্টে ফ্রেশ",
          ],
          [
            "Client SWR / RTK Query",
            "ইনফিনিট স্ক্রল, সার্চ ফিল্টার",
            "ক্লায়েন্ট মেমোরি ক্যাশ",
            "mutation বা refetch-on-focus",
          ],
        ]}
      />

      <Line name="ভুলু ভাই">
        ফাটাফাটি ফাহিম! <code>Promise.all</code> দিয়ে waterfall ভেঙে দিতেই পেজ ৫ সেকেন্ড থেকে ১
        সেকেন্ডের নিচে নেমে এসেছে, আর <code>revalidateTag</code> দিয়ে শুধু ওই ম্যাচের ক্যাশটাই রিফ্রেশ
        হচ্ছে!
      </Line>

      {/* ── Takeaways ─────────────────────────────────────────────────── */}
      <H2 id="takeaway">Production Takeaways</H2>

      <Note>
        <ul>
          <li>
            <strong>Never await in sequence:</strong> স্বাধীন promise থাকলে{" "}
            <code>await a(); await b();</code> নয় — <code>Promise.all([a(), b()])</code>। এটি
            একটিমাত্র লাইনের পরিবর্তন, কিন্তু প্রভাব সবচেয়ে বড়।
          </li>
          <li>
            <strong>Tag every cached fetch:</strong> প্রতিটি <code>fetch</code>-এ অর্থবহ{" "}
            <code>next: {"{"} tags {"}"}</code> দিন — নইলে mutation-এর পর হয় সব বাসি হবে, নয় কিছুই
            হবে না।
          </li>
          <li>
            <strong>Mutate through server actions:</strong> ক্লায়েন্ট থেকে API কল না করে server
            action ব্যবহার করুন, আর কাজ শেষে <code>revalidateTag()</code> বা{" "}
            <code>revalidatePath()</code> ট্রিগার করুন — mutation ও cache তখন এক জায়গায় থাকে।
          </li>
        </ul>
      </Note>
    </article>
  );
}
