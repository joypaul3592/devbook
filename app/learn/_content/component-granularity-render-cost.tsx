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
      bn: "৮০০ লাইনের এক কম্পোনেন্ট",
      en: "One 800-line component",
    },
  },
  {
    id: "architecture",
    label: {
      bn: "Monolithic বনাম Granular ট্রি",
      en: "Monolithic vs granular tree",
    },
  },
  {
    id: "foundations",
    label: { bn: "রেন্ডার কস্টের ৩ মেকানিজম", en: "Three cost mechanisms" },
  },
  {
    id: "implementation",
    label: {
      bn: "মনোলিথ বনাম আইসোলেটেড কম্পোনেন্ট",
      en: "Monolith vs isolated components",
    },
  },
  {
    id: "matrix",
    label: { bn: "Granularity Matrix", en: "Granularity matrix" },
  },
  {
    id: "takeaway",
    label: { bn: "Production Takeaways", en: "Production takeaways" },
  },
];

export default function ComponentGranularityRenderCost() {
  return (
    <article className="doc-prose">
      {/* ── The problem ───────────────────────────────────────────────── */}
      <H2 id="the-problem" anchorOnly>
        ৮০০ লাইনের এক কম্পোনেন্ট
      </H2>

      <p>
        দুপুর ২:৩০। ভুলু ভাইয়ের <code>&lt;UserProfilePage /&gt;</code> প্রায় ৮০০ লাইনের। ভেতরের
        &quot;Bio&quot; ফিল্ডে একটি ক্যারেক্টার টাইপ করলেই Profiler দেখাচ্ছে ৫০টি সাব-কম্পোনেন্ট আর
        হাজারখানেক DOM নোড আবার diff হচ্ছে — রেন্ডারে ১৮০ মিলিসেকেন্ড।
      </p>

      <Line name="ভুলু ভাই">
        ফাহিম! আমি শুধু বায়ো এডিট করছি, কিন্তু সব স্ট্যাটাস কার্ড, নোটিফিকেশন ফিড আর অ্যাক্টিভিটি
        হিস্ট্রি একসাথে স্লো হয়ে যাচ্ছে কেন?
      </Line>

      <Line name="ফাহিম">
        ভুলু ভাই! আপনার <strong>component granularity</strong> খারাপ। পুরো প্রোফাইল পেজ একটিমাত্র
        মনোলিথিক কম্পোনেন্টে আটকে আছে, তাই ছোট্ট একটা ইনপুট স্টেটের জন্য পুরো পেজের রেন্ডার কস্ট
        দিতে হচ্ছে।
      </Line>

      <Line name="নেক্সট-ভাই">
        রেন্ডার কস্ট দুই জায়গায় জমে — <strong>JS execution cost</strong> (ফাংশন বডির লজিক আবার
        চলা) আর <strong>reconciliation cost</strong> (V-DOM ট্রি diff করা)। স্টেট আইসোলেট করে
        সঠিক গ্র্যানুলারিটি ধরলে এই খরচ নাটকীয়ভাবে কমে।
      </Line>

      {/* ── Architecture ──────────────────────────────────────────────── */}
      <H2 id="architecture">১. Granularity vs Render Cost</H2>

      <Diagram>{`┌─────────────────────────────────────────────────────────────────────────┐
│                    MONOLITHIC VS GRANULAR TREE                          │
└─────────────────────────────────────────────────────────────────────────┘

 ❌ COARSE-GRAINED MONOLITH (high render cost)
 ┌───────────────────────────────────────────────────────────────────────┐
 │ <UserProfilePage />   state: bioInput                                 │
 │  ├── <Header />                                                       │
 │  ├── <BioEditor />                                                    │
 │  ├── <ActivityFeed />  (100+ nodes) ──▶ 🔴 re-executes and diffs all   │
 │  └── <SecurityLogs />  (50+ nodes)  ──▶ 🔴 heavy logic runs again      │
 └───────────────────────────────────────────────────────────────────────┘

───────────────────────────────────────────────────────────────────────────

 🟢 FINE-GRAINED ISOLATED TREE (low render cost)
 ┌───────────────────────────────────────────────────────────────────────┐
 │ <UserProfilePage />   no high-frequency state at this level           │
 │  ├── <Header />                     ──▶ 🟢 bailed out                 │
 │  ├── <BioEditor />  (state inside)  ──▶ 🔴 only this renders (fast)   │
 │  ├── <ActivityFeed />               ──▶ 🟢 bailed out                 │
 │  └── <SecurityLogs />               ──▶ 🟢 bailed out                 │
 └───────────────────────────────────────────────────────────────────────┘`}</Diagram>

      {/* ── Foundations ───────────────────────────────────────────────── */}
      <H2 id="foundations">২. রেন্ডার কস্টের ৩ মেকানিজম</H2>

      <Note>
        <ul>
          <li>
            <strong>Reconciliation cost:</strong> রেন্ডারের সময় React রিটার্ন করা JSX ট্রি-কে আগের
            ট্রি-র সাথে মেলায়। কম্পোনেন্ট যত coarse-grained, তার নোড সংখ্যা তত বেশি, diff-এর খরচও
            তত বেশি।
          </li>
          <li>
            <strong>Execution boundary isolation:</strong> হাই-ফ্রিকোয়েন্সি স্টেট (টেক্সট ইনপুট,
            স্ক্রোল, কার্সর) বড় কম্পোনেন্টের রুটে থাকলে প্রতিটি কি-স্ট্রোকে ভারী{" "}
            <code>.map()</code> / <code>.filter()</code> আবার চলে — স্টেটকে ছোট বাউন্ডারিতে আটকে
            ফেলাই সমাধান।
          </li>
          <li>
            <strong>Over-granularity trap:</strong> অতি-ক্ষুদ্র কম্পোনেন্ট আর অপ্রয়োজনীয় wrapper
            বানালে ফাইবার নোড ও মেমোরি অ্যালোকেশনের mount-cost বাড়ে — ভারসাম্যই লক্ষ্য।
          </li>
        </ul>
      </Note>

      {/* ── Implementation ────────────────────────────────────────────── */}
      <H2 id="implementation">৩. মনোলিথ বনাম আইসোলেটেড কম্পোনেন্ট</H2>

      <H3>❌ Anti-pattern — এক কম্পোনেন্টে ভারী কাজ আর ইনপুট স্টেট</H3>

      <CodeBlock filename="app/profile/monolithic-profile-page.tsx">{`'use client';

import { useState } from 'react';

export function MonolithicProfilePage() {
  const [bio, setBio] = useState('');

  // This 5,000-item build-up re-runs on every single keystroke
  const heavyLogs = Array.from({ length: 5000 }, (_, i) => ({
    id: i,
    action: \`User action log trace #\${i}\`,
    timestamp: new Date().toISOString(),
  }));

  return (
    <div className="p-6 space-y-6 bg-slate-950 text-slate-100">
      <h1 className="text-2xl font-bold">User profile</h1>

      <div className="space-y-2">
        <label className="text-sm font-medium">Bio</label>
        <textarea
          value={bio}
          onChange={(e) => setBio(e.target.value)}
          className="w-full p-3 bg-slate-900 border border-slate-800 rounded-xl"
        />
      </div>

      {/* The whole heavy subtree diffs on every keystroke */}
      <div className="p-4 bg-slate-900 rounded-xl space-y-2">
        <h3 className="font-semibold text-amber-400">Activity logs (heavy)</h3>
        {heavyLogs.slice(0, 5).map((log) => (
          <div key={log.id} className="p-2 bg-slate-950 rounded border border-slate-800 text-xs">
            {log.action} — {log.timestamp}
          </div>
        ))}
      </div>
    </div>
  );
}`}</CodeBlock>

      <H3>🟢 Fix — fine-grained, স্টেট নিজের বাউন্ডারিতে</H3>

      <CodeBlock filename="app/profile/page.tsx">{`'use client';

import { memo, useState } from 'react';

// Granular component 1 — owns the high-frequency input state
function BioEditor() {
  const [bio, setBio] = useState('');

  return (
    <div className="space-y-2">
      <label className="text-sm font-medium text-slate-300">Bio</label>
      <textarea
        value={bio}
        onChange={(e) => setBio(e.target.value)}
        placeholder="Write something about yourself..."
        className="w-full p-3 bg-slate-900 border border-slate-800 rounded-xl text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
      />
    </div>
  );
}

// Granular component 2 — the expensive subtree, isolated and memoized
const HeavyActivityLogs = memo(function HeavyActivityLogs() {
  console.log('HeavyActivityLogs rendered'); // runs once, on mount

  const heavyLogs = Array.from({ length: 5000 }, (_, i) => ({
    id: i,
    action: \`User action log trace #\${i}\`,
    timestamp: '2026-08-25',
  }));

  return (
    <div className="p-4 bg-slate-900 rounded-xl border border-slate-800 space-y-2">
      <h3 className="font-semibold text-indigo-400">Activity logs</h3>
      {heavyLogs.slice(0, 5).map((log) => (
        <div
          key={log.id}
          className="p-2 bg-slate-950 rounded border border-slate-800/80 text-xs text-slate-400"
        >
          {log.action} — {log.timestamp}
        </div>
      ))}
    </div>
  );
});

// The container holds no high-frequency state at all
export function OptimizedProfilePage() {
  return (
    <div className="p-6 space-y-6 bg-slate-950 text-slate-100 min-h-screen">
      <h1 className="text-2xl font-bold">User profile</h1>

      {/* Typing here never reaches HeavyActivityLogs */}
      <BioEditor />
      <HeavyActivityLogs />
    </div>
  );
}`}</CodeBlock>

      {/* ── Matrix ────────────────────────────────────────────────────── */}
      <H2 id="matrix">৪. Granularity &amp; Cost Matrix</H2>

      <Table
        head={["গ্র্যানুলারিটি", "Reconciliation cost", "Maintenance", "রেন্ডার আইসোলেশন"]}
        rows={[
          [
            "Monolithic",
            "খুব বেশি — ছোট চেঞ্জেও বিশাল ট্রি diff হয়",
            "শুরুতে সহজ, পরে দুঃস্বপ্ন",
            "প্রায় শূন্য",
          ],
          [
            "Optimal granular",
            "কম — শুধু পরিবর্তিত অংশ",
            "সবচেয়ে মেইনটেইনেবল ও রি-ইউজেবল",
            "উচ্চ",
          ],
          [
            "Hyper-grained",
            "মাঝারি — নোড সংখ্যা বেশি হওয়ায় mount cost বাড়ে",
            "ফাইল ও ইনডিরেকশন ওভারহেড",
            "সর্বোচ্চ, কিন্তু খরচসহ",
          ],
        ]}
      />

      <Line name="ভুলু ভাই">
        দারুণ! বায়ো ইনপুট আলাদা <code>BioEditor</code>-এ নেওয়ার পর টাইপ করার রেন্ডার টাইম ১৮০ms
        থেকে নেমে কয়েক মিলিসেকেন্ডে চলে এসেছে।
      </Line>

      {/* ── Takeaways ─────────────────────────────────────────────────── */}
      <H2 id="takeaway">Production Takeaways</H2>

      <Note>
        <ul>
          <li>
            <strong>Locality of state:</strong> স্টেট ঠিক ততটুকুই উপরে রাখুন যতটুকু প্রপস ডাউন
            করার জন্য দরকার — যত নিচে, রেন্ডার কস্ট তত কম।
          </li>
          <li>
            <strong>Separate heavy renderers:</strong> ভারী লুপ, রিচ-টেক্সট এডিটর বা চার্টওয়ালা
            কম্পোনেন্ট কখনো হাই-ফ্রিকোয়েন্সি ইনপুটের সাথে একই কম্পোনেন্টে রাখবেন না।
          </li>
          <li>
            <strong>Use node count as a smell test:</strong> একটি কম্পোনেন্টে ৫০+ DOM নোড জমলে
            সেটিকে স্টেট-বাউন্ডারি ধরে ভাগ করার সময় হয়েছে।
          </li>
        </ul>
      </Note>
    </article>
  );
}
