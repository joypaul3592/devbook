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
      bn: "টাইপ করলেই ইনপুট বক্স জমে যাচ্ছে",
      en: "The input freezes on every keystroke",
    },
  },
  {
    id: "architecture",
    label: {
      bn: "Interruptible রেন্ডারিং ও Lane Scheduler",
      en: "Interruptible rendering and the lane scheduler",
    },
  },
  {
    id: "foundations",
    label: { bn: "কনকারেন্ট ইঞ্জিনের ৩ ভিত্তি", en: "Three foundations" },
  },
  {
    id: "implementation",
    label: {
      bn: "Blocking বনাম Non-blocking সার্চ",
      en: "Blocking vs non-blocking search",
    },
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

export default function ConcurrentRendering() {
  return (
    <article className="doc-prose">
      {/* ── The problem ───────────────────────────────────────────────── */}
      <H2 id="the-problem" anchorOnly>
        টাইপ করলেই ইনপুট বক্স জমে যাচ্ছে
      </H2>

      <p>
        রাত ৬:১০। ভুলু ভাই একটি লাইভ সার্চ ফিল্টার বানাচ্ছেন, যেখানে ২০,০০০ প্রোডাক্টের লিস্ট ফিল্টার
        হচ্ছে। কিন্তু কিবোর্ডে প্রতিটা অক্ষর টাইপ করলেই ইনপুট বক্স জমে যাচ্ছে — অক্ষর স্ক্রিনে উঠতে
        প্রায় ১ সেকেন্ড দেরি হচ্ছে।
      </p>

      <Line name="ভুলু ভাই">
        ফাহিম! টাইপ করার সাথে সাথে টেক্সট স্মুথলি উঠছে না, ব্রাউজার ফ্রেমে ফ্রেমে ল্যাগ করছে। আমি তো
        Suspense-ও বসিয়েছি, তাও ইনপুট ফ্রিজ হচ্ছে কেন?
      </Line>

      <Line name="ফাহিম">
        ভুলু ভাই! পুরোনো React-এর রেন্ডারিং ছিল <strong>blocking (synchronous)</strong> — একবার
        রেন্ডার শুরু হলে ২০,০০০ কম্পোনেন্ট শেষ না করা পর্যন্ত React মেইন থ্রেড ছাড়ত না। তাই আপনার
        টাইপিং ইভেন্ট ব্যাকলগে জমে থাকত।
      </Line>

      <Line name="নেক্সট-ভাই">
        কিন্তু React 19-এর concurrent engine রেন্ডারিংকে <strong>interruptible</strong> করে
        দিয়েছে। ইউজার কি চাপার সাথে সাথে React ভারী রেন্ডারিং মাঝপথে থামিয়ে আগে ইনপুটকে
        প্রায়োরিটি দেয়।
      </Line>

      {/* ── Architecture ──────────────────────────────────────────────── */}
      <H2 id="architecture">১. Lane Scheduler Flow</H2>

      <Diagram>{`┌─────────────────────────────────────────────────────────────────────────┐
│              REACT 19 CONCURRENT ENGINE & LANE SCHEDULER                │
└─────────────────────────────────────────────────────────────────────────┘

 User actions:    [user types 'A']                     [user types 'B']
                       │                                    │
 Priority:        (high priority)                      (high priority)
                       │                                    │
 Main thread: ────┬────┴───────────────────────────────┬────┴───────────────▶
                  │                                    │
 React lanes:     │  SyncLane / InputContinuousLane    │  SyncLane
                  │                                    │
 Low priority:    │  [render heavy list] ───(paused)───┤  [aborted & restarted]
                  │  (TransitionLane)                  │  (TransitionLane)`}</Diagram>

      {/* ── Foundations ───────────────────────────────────────────────── */}
      <H2 id="foundations">২. কনকারেন্ট ইঞ্জিনের ৩ ভিত্তি</H2>

      <Note>
        <ul>
          <li>
            <strong>Interruptible rendering:</strong> React কাজটিকে ছোট ছোট work unit-এ ভাগ করে,
            আর প্রতিটি ইউনিটের পর মেইন থ্রেড চেক করে — নতুন কোনো ইউজার ইভেন্ট (ক্লিক, টাইপ, স্ক্রোল)
            এসেছে কি না। এলে রেন্ডার pause করে আগে ইউজার রেসপন্স সেরে নেয়, পরে আবার শুরু করে।
          </li>
          <li>
            <strong>Lane model (bitmask priority):</strong> ভেতরে প্রতিটি আপডেট একটি lane পায় —{" "}
            <code>SyncLane</code> / <code>InputContinuousLane</code> (টাইপিং, ক্লিক, ফোকাস),{" "}
            <code>DefaultLane</code> (নেটওয়ার্ক রেসপন্স), <code>TransitionLane</code> (বড় লিস্ট
            ফিল্টার, ট্যাব সুইচ), <code>IdleLane</code> (ব্যাকগ্রাউন্ড কাজ)।
          </li>
          <li>
            <strong>Time slicing &amp; the fiber scheduler:</strong> React ব্রাউজারের ~৫ মিলিসেকেন্ড
            ফ্রেম উইন্ডোতে কাজ ভাগ করে ফাইবার ট্রি ধরে এগোয়, ফলে ফ্রেম ড্রপ না হয়ে UI ৬০ FPS-এ
            স্মুথ থাকে।
          </li>
        </ul>
      </Note>

      {/* ── Implementation ────────────────────────────────────────────── */}
      <H2 id="implementation">৩. Blocking বনাম Non-blocking সার্চ</H2>

      <H3>❌ Anti-pattern — synchronous ফিল্টার মেইন থ্রেড আটকে রাখে</H3>

      <CodeBlock filename="app/search/_components/bad-search.tsx">{`'use client';

import { useState } from 'react';

export default function BadBlockingSearch({ items }: { items: string[] }) {
  const [query, setQuery] = useState('');

  // Runs synchronously on every keystroke
  const filteredItems = items.filter((item) =>
    item.toLowerCase().includes(query.toLowerCase()),
  );

  return (
    <div className="p-6 space-y-4">
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)} // sync update blocks the UI
        placeholder="Search 20,000 items..."
        className="px-4 py-2 bg-slate-900 border border-slate-700 rounded-lg w-full text-white"
      />

      {/* The browser freezes until every row has rendered */}
      <ul className="divide-y divide-slate-800">
        {filteredItems.slice(0, 5000).map((item, idx) => (
          <li key={idx} className="py-2 text-slate-300">{item}</li>
        ))}
      </ul>
    </div>
  );
}`}</CodeBlock>

      <H3>
        🟢 Fix — <code>useDeferredValue</code> দিয়ে প্রায়োরিটি আলাদা করা
      </H3>

      <CodeBlock filename="app/search/_components/concurrent-search.tsx">{`'use client';

import { useDeferredValue, useState } from 'react';

export function ConcurrentSearch({ items }: { items: string[] }) {
  const [query, setQuery] = useState('');

  // The input updates in the sync lane; the list update is deferred
  const deferredQuery = useDeferredValue(query);

  const filteredItems = items.filter((item) =>
    item.toLowerCase().includes(deferredQuery.toLowerCase()),
  );

  // True while the concurrent engine is still working on the low-priority render
  const isStale = query !== deferredQuery;

  return (
    <div className="p-6 space-y-4 max-w-xl mx-auto">
      <div className="relative">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)} // sync priority — instant feedback
          placeholder="Search 20,000 items concurrently..."
          className="px-4 py-2.5 bg-slate-900 border border-slate-700 rounded-xl w-full text-white focus:ring-2 focus:ring-emerald-500 outline-none"
        />
        {isStale && (
          <span className="absolute right-3 top-3 text-xs text-amber-400 animate-pulse font-mono">
            Updating list...
          </span>
        )}
      </div>

      {/* Low-priority, interruptible list render */}
      <div className={\`transition-opacity duration-150 \${isStale ? 'opacity-50' : 'opacity-100'}\`}>
        <p className="text-xs text-slate-400 mb-2">Showing {filteredItems.length} results</p>

        <ul className="max-h-96 overflow-y-auto divide-y divide-slate-800 border border-slate-800 rounded-xl bg-slate-950 p-2">
          {filteredItems.slice(0, 200).map((item, idx) => (
            <li key={idx} className="py-2 px-3 text-sm text-slate-300 hover:bg-slate-900 rounded-lg">
              {item}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}`}</CodeBlock>

      {/* ── Matrix ────────────────────────────────────────────────────── */}
      <H2 id="matrix">৪. Synchronous বনাম Concurrent</H2>

      <Table
        head={["বৈশিষ্ট্য", "Synchronous rendering", "Concurrent rendering (React 19)"]}
        rows={[
          [
            "Execution style",
            "Blocking — একবার শুরু হলে শেষ না করে থামে না",
            "Interruptible — মাঝপথে থামানো ও রিস্টার্ট করা যায়",
          ],
          [
            "User input",
            "টাইপ ও ক্লিকে ল্যাগ বা ফ্রিজ",
            "তাৎক্ষণিক রেসপন্স",
          ],
          [
            "Internal engine",
            "Linear call stack",
            "Fiber tree + bitmask lane scheduler",
          ],
          [
            "Priority handling",
            "সব আপডেট সমান — first in, first out",
            <>
              Lanes — <code>Sync</code>, <code>InputContinuous</code>,{" "}
              <code>Transition</code>, <code>Idle</code>
            </>,
          ],
        ]}
      />

      <Line name="ভুলু ভাই">
        টাইপ করছি আর ইনপুট বক্স এক মিলিসেকেন্ডও আটকাচ্ছে না! React ব্যাকগ্রাউন্ডে লিস্টটা লো-প্রায়োরিটি
        লেনে ফিল্টার করছে, আর নতুন কি চাপলেই আগের রেন্ডার বাতিল করে নতুন করে শুরু করছে।
      </Line>

      {/* ── Takeaways ─────────────────────────────────────────────────── */}
      <H2 id="takeaway">Production Takeaways</H2>

      <Note>
        <ul>
          <li>
            <strong>User feedback comes first:</strong> ইনপুট বক্স বা টগলের মতো সরাসরি ইন্টারঅ্যাকশন
            সবসময় sync lane-এ তাৎক্ষণিক আপডেট হতে দিন।
          </li>
          <li>
            <strong>Defer expensive downstream work:</strong> ভারী ফিল্টার বা জটিল ক্যালকুলেশন{" "}
            <code>useDeferredValue</code> বা <code>useTransition</code> দিয়ে transition lane-এ
            পাঠান।
          </li>
          <li>
            <strong>Measure the stale window:</strong> deferred রেন্ডার চলাকালীন{" "}
            <code>isStale</code> ফ্ল্যাগ দিয়ে হালকা ভিজ্যুয়াল ইঙ্গিত দিন, যাতে ইউজার বুঝতে পারে
            রেজাল্ট আপডেট হচ্ছে।
          </li>
        </ul>
      </Note>
    </article>
  );
}
