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
      bn: "Text content did not match",
      en: "Text content did not match",
    },
  },
  {
    id: "architecture",
    label: {
      bn: "Selective Hydration আর্কিটেকচার",
      en: "Selective hydration architecture",
    },
  },
  {
    id: "foundations",
    label: { bn: "হাইড্রেশনের ৪টি মেকানিজম", en: "Four hydration mechanisms" },
  },
  {
    id: "implementation",
    label: {
      bn: "Mismatch বনাম Mismatch-safe কোড",
      en: "Mismatch vs mismatch-safe code",
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

export default function Hydration() {
  return (
    <article className="doc-prose">
      {/* ── The problem ───────────────────────────────────────────────── */}
      <H2 id="the-problem" anchorOnly>
        Text content did not match
      </H2>

      <p>
        রাত ৯:৫০। ভুলু ভাই ব্রাউজার রিফ্রেশ করতেই কনসোলে লাল এরর —{" "}
        <code>
          Warning: Text content did not match. Server: &quot;10:50:00 PM&quot; Client:
          &quot;10:50:01 PM&quot;
        </code>{" "}
        এবং <code>Hydration failed because the initial UI does not match what was rendered on the
        server</code>।
      </p>

      <Line name="ভুলু ভাই">
        ফাহিম! পেজ তো সার্ভার থেকে সুন্দরভাবেই আসছে, কিন্তু ব্রাউজারে JavaScript লোড হওয়ামাত্র পুরো
        UI ঝাঁকুনি (flicker) দিয়ে লাল এরর দেখাচ্ছে কেন? এই hydration mismatch জিনিসটা কী?
      </Line>

      <Line name="ফাহিম">
        ভুলু ভাই! সার্ভার থেকে আসা শুকনো স্ট্যাটিক HTML-কে ব্রাউজারে ইভেন্ট লিসেনার জুড়ে
        ইন্টারঅ্যাক্টিভ করে তোলার প্রক্রিয়াই <strong>hydration</strong>। সার্ভার আর ক্লায়েন্টের
        প্রথম রেন্ডার এক চুল অমিল হলেই React এরর থ্রো করে।
      </Line>

      <Line name="নেক্সট-ভাই">
        আর React 18/19-এ এসেছে <strong>selective hydration</strong> — পুরো পেজের JavaScript পার্স
        হওয়ার অপেক্ষা না করে <code>&lt;Suspense&gt;</code> বাউন্ডারি ধরে ছোট ছোট অংশ আলাদাভাবে
        হাইড্রেট হয়। ইউজার যেখানে ক্লিক করে, React সেই অংশকে আগে হাইড্রেট করে।
      </Line>

      {/* ── Architecture ──────────────────────────────────────────────── */}
      <H2 id="architecture">১. Selective Hydration Flow</H2>

      <Diagram>{`┌─────────────────────────────────────────────────────────────────────────┐
│                    REACT 19 SELECTIVE HYDRATION FLOW                    │
└─────────────────────────────────────────────────────────────────────────┘

 [server] streams SSR HTML to the browser
    │
    ├─▶ the static shell is visible instantly (fast FCP)
    │
    ▼
 [browser] JS bundles arrive asynchronously
    │
    ├─▶ un-hydrated Suspense boundaries
    │     ├── [component A] heavy chart      (JS downloading...)
    │     └── [component B] comment box      (JS downloading...)
    │
    ├─▶ ⚡ the user clicks on [component B]
    │
    ▼
 [React 19 engine] priority interrupt
    │
    ├─▶ pauses background hydration of component A
    ├─▶ hydrates component B first and attaches its handlers
    └─▶ replays the recorded click — it fires with no extra delay`}</Diagram>

      {/* ── Foundations ───────────────────────────────────────────────── */}
      <H2 id="foundations">২. হাইড্রেশনের ৪টি মেকানিজম</H2>

      <Note>
        <ul>
          <li>
            <strong>Dry HTML → interactive DOM:</strong> SSR/SSG থেকে আসা DOM ট্রি আর ক্লায়েন্ট
            V-DOM মিলিয়ে React শুধু ইভেন্ট হ্যান্ডলারগুলো যুক্ত করে — DOM নতুন করে তৈরি হয় না।
          </li>
          <li>
            <strong>Mismatch detection:</strong> সার্ভারের HTML আর ক্লায়েন্টের প্রথম রেন্ডার
            স্ট্রাকচারালি হুবহু এক হতে হয়। <code>new Date()</code>, <code>Math.random()</code> বা{" "}
            <code>window</code>-নির্ভর ভ্যালু থাকলে অমিল হয়, React সতর্কবার্তা দিয়ে ওই সাবট্রি ক্লায়েন্টে
            আবার রেন্ডার করে — যা পারফরম্যান্স খায়।
          </li>
          <li>
            <strong>Selective hydration:</strong> <code>&lt;Suspense&gt;</code>-এ মোড়া ভারী
            কম্পোনেন্টের JS চাঙ্ক আলাদা করে আসে; হালকা অংশগুলো আগেই ইন্টারঅ্যাক্টিভ হয়ে যায়, পুরো
            পেজ আটকে থাকে না।
          </li>
          <li>
            <strong>Interaction-driven priority:</strong> ব্যাকগ্রাউন্ডে হাইড্রেশন চলাকালীন ইউজার
            কোনো আন-হাইড্রেটেড অংশে ক্লিক করলে React সেই কাজ থামিয়ে ওই বাউন্ডারিকে আগে হাইড্রেট
            করে।
          </li>
        </ul>
      </Note>

      {/* ── Implementation ────────────────────────────────────────────── */}
      <H2 id="implementation">৩. Mismatch বনাম Mismatch-safe কোড</H2>

      <H3>❌ Anti-pattern — রেন্ডারে সরাসরি ব্রাউজার API</H3>

      <CodeBlock filename="app/_components/bad-time-display.tsx">{`'use client';

export function BadTimeDisplay() {
  // Server renders the server clock, the client renders the browser clock
  // → the two HTML outputs differ → hydration mismatch
  const currentTime = new Date().toLocaleTimeString();
  const screenWidth = typeof window !== 'undefined' ? window.innerWidth : 0;

  return (
    <div className="p-4 bg-rose-950/40 border border-rose-800 rounded-xl text-rose-300">
      <p>Current time: {currentTime}</p>
      <p>Window width: {screenWidth}px</p>
    </div>
  );
}`}</CodeBlock>

      <H3>🟢 Fix — deterministic প্রথম রেন্ডার + Suspense বাউন্ডারি</H3>

      <CodeBlock filename="app/_components/safe-time-display.tsx">{`'use client';

import { useEffect, useState } from 'react';

export function SafeTimeDisplay() {
  const [mounted, setMounted] = useState(false);
  const [currentTime, setCurrentTime] = useState('');

  // Runs only on the client, after hydration has finished
  useEffect(() => {
    setMounted(true);
    setCurrentTime(new Date().toLocaleTimeString());

    const timer = setInterval(() => {
      setCurrentTime(new Date().toLocaleTimeString());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  // The server and the first client pass render exactly this
  if (!mounted) {
    return (
      <div className="p-4 bg-slate-900 border border-slate-800 rounded-xl animate-pulse text-slate-500 font-mono text-sm">
        Syncing system time...
      </div>
    );
  }

  return (
    <div className="p-4 bg-slate-900 border border-emerald-800/60 rounded-xl text-emerald-400 font-mono text-sm">
      Live time: <span className="font-bold text-white">{currentTime}</span>
    </div>
  );
}`}</CodeBlock>

      <CodeBlock filename="app/dashboard/page.tsx">{`import { Suspense } from 'react';
import { SafeTimeDisplay } from '../_components/safe-time-display';

async function HeavyAnalyticsChart() {
  await new Promise((resolve) => setTimeout(resolve, 3000));

  return (
    <div className="p-6 bg-slate-900 border border-slate-800 rounded-2xl text-slate-200">
      <h3 className="font-bold text-lg text-indigo-400 mb-2">Analytics chart</h3>
      <p className="text-sm text-slate-400">A heavy widget, hydrated on its own schedule.</p>
    </div>
  );
}

export default function DashboardPage() {
  return (
    <div className="p-8 bg-slate-950 min-h-screen text-slate-100 space-y-6 max-w-xl mx-auto">
      <h1 className="text-2xl font-bold">Selective hydration dashboard</h1>

      {/* Hydrates immediately — it never waits for the heavy chart */}
      <SafeTimeDisplay />

      {/* Its own hydration boundary */}
      <Suspense
        fallback={
          <div className="p-6 bg-slate-900/50 border border-slate-800/80 rounded-2xl animate-pulse text-slate-500">
            Streaming the heavy chart...
          </div>
        }
      >
        <HeavyAnalyticsChart />
      </Suspense>
    </div>
  );
}`}</CodeBlock>

      {/* ── Matrix ────────────────────────────────────────────────────── */}
      <H2 id="matrix">৪. Traditional বনাম Selective Hydration</H2>

      <Table
        head={["বৈশিষ্ট্য", "Traditional hydration (React 17 ও আগে)", "React 19 selective hydration"]}
        rows={[
          [
            "Strategy",
            "All-or-nothing — পুরো পেজের JS লোড না হলে কিছুই ইন্টারঅ্যাক্টিভ হতো না",
            <>
              <code>&lt;Suspense&gt;</code> ধরে অংশে অংশে হাইড্রেশন
            </>,
          ],
          [
            "User interaction",
            "হাইড্রেশনের আগে ক্লিক হারিয়ে যেত",
            "ক্লিক রেকর্ড হয়, ওই বাউন্ডারি আগে হাইড্রেট হয়ে ইভেন্ট রিপ্লে হয়",
          ],
          [
            "Time to Interactive",
            "ভারী অ্যাপে অনেক বেশি",
            "উল্লেখযোগ্যভাবে দ্রুত",
          ],
          [
            "Streaming",
            "স্ট্রিমিং চলাকালীন ইন্টারঅ্যাক্টিভিটি ব্লক",
            "স্ট্রিমিং ও হাইড্রেশন সমান্তরালে চলে",
          ],
        ]}
      />

      <Line name="ভুলু ভাই">
        এখন বুঝলাম সার্ভার টাইম আর ব্রাউজার টাইমের অমিলেই এরর আসত!{" "}
        <code>useEffect</code> আর <code>&lt;Suspense&gt;</code> দিয়ে পেজ এখন সিলেক্টিভলি হাইড্রেট
        হচ্ছে।
      </Line>

      {/* ── Takeaways ─────────────────────────────────────────────────── */}
      <H2 id="takeaway">Production Takeaways</H2>

      <Note>
        <ul>
          <li>
            <strong>Keep the first client render deterministic:</strong> ইনিশিয়াল ক্লায়েন্ট রেন্ডার
            আর সার্ভার HTML যেন হুবহু এক হয় — <code>localStorage</code>, <code>window</code>,
            টাইমস্ট্যাম্প বা র‍্যান্ডম ভ্যালু শুধু <code>useEffect</code>-এর ভেতরে সেট করুন।
          </li>
          <li>
            <strong>
              <code>suppressHydrationWarning</code> is a last resort:
            </strong>{" "}
            শুধুমাত্র টাইমস্ট্যাম্পের মতো অনিবার্য টেক্সট অমিলের ক্ষেত্রে নির্দিষ্ট ট্যাগে এটি
            ব্যবহার করুন — এটি অমিল লুকায়, ঠিক করে না।
          </li>
          <li>
            <strong>Wrap heavy widgets in Suspense:</strong> ভারী ইন্টারঅ্যাক্টিভ অংশ আলাদা
            বাউন্ডারিতে রাখলে React সেগুলো নন-ব্লকিংভাবে হাইড্রেট করতে পারে।
          </li>
        </ul>
      </Note>
    </article>
  );
}
