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
      bn: "একটাই বড় স্পিনার, চার সেকেন্ড",
      en: "One big spinner, four seconds",
    },
  },
  {
    id: "architecture",
    label: {
      bn: "Out-of-order স্ট্রিমিং পাইপলাইন",
      en: "The out-of-order streaming pipeline",
    },
  },
  {
    id: "foundations",
    label: { bn: "স্ট্রিমিংয়ের ৪টি স্তম্ভ", en: "Four pillars of streaming" },
  },
  {
    id: "implementation",
    label: {
      bn: "Monolithic বনাম Granular বাউন্ডারি",
      en: "Monolithic vs granular boundaries",
    },
  },
  {
    id: "matrix",
    label: { bn: "Diagnostic Matrix", en: "Diagnostic matrix" },
  },
  {
    id: "takeaway",
    label: { bn: "Production Takeaways", en: "Production takeaways" },
  },
];

export default function SuspenseAndStreaming() {
  return (
    <article className="doc-prose">
      {/* ── The problem ───────────────────────────────────────────────── */}
      <H2 id="the-problem" anchorOnly>
        একটাই বড় স্পিনার, চার সেকেন্ড
      </H2>

      <p>
        রাত ৫:৪০। ভুলু ভাইয়ের ই-কমার্স ড্যাশবোর্ড লোড হতেই পুরো স্ক্রিন ৪ সেকেন্ড ধরে একটি বড়
        স্পিনার নিয়ে সাদা হয়ে আটকে থাকছে, তারপর হঠাৎ পুরো পেজ একসাথে ফুটে উঠছে।
      </p>

      <Line name="ভুলু ভাই">
        ফাহিম! আমি তো <code>&lt;Suspense&gt;</code> ব্যবহার করেছি! কিন্তু পেজ তো টুকরো টুকরো হয়ে
        স্ট্রিম হচ্ছে না — ইউজার ৩-৪ সেকেন্ড শুধু একটা স্পিনার দেখে বসে থাকছে, ঠিক পুরোনো SSR-এর
        মতো।
      </Line>

      <Line name="ফাহিম">
        ভুলু ভাই! আপনি পুরো পেজকে একটিমাত্র বড় <strong>monolithic Suspense</strong> বাউন্ডারি দিয়ে
        ঘিরে রেখেছেন। হেডার, সাইডবার আর ব্যানার ৫ মিলিসেকেন্ডেই তৈরি ছিল, কিন্তু নিচের ভারী
        &quot;Analytics&quot; আর &quot;Recommended Products&quot; কোয়েরির জন্য পুরো পেজ আটকে ছিল।
      </Line>

      <Line name="নেক্সট-ভাই">
        একদম! async boundary আর্কিটেকচারের মূল মন্ত্র হলো <strong>granular isolation</strong> — দ্রুত
        রেন্ডার হওয়া অংশ instant HTML হিসেবে পাঠিয়ে দিন, আর ধীরগতির অংশগুলো আলাদা আলাদা{" "}
        <code>&lt;Suspense&gt;</code>-এ আইসোলেট করে out-of-order স্ট্রিম করান।
      </Line>

      {/* ── Architecture ──────────────────────────────────────────────── */}
      <H2 id="architecture">১. Concurrent Streaming Flow</H2>

      <Diagram>{`┌─────────────────────────────────────────────────────────────────────────┐
│              GRANULAR SUSPENSE STREAMING EXECUTION FLOW                 │
└─────────────────────────────────────────────────────────────────────────┘

 [CLIENT BROWSER]                          [SERVER PROCESS]
        │                                         │
 0ms    ├────────────── request page ────────────▶│
        │                                         │ 1. renders shell + fast RSCs
 50ms   │◀── stream shell + fallback skeletons ───┤    (header, sidebar, skeletons)
        │    (instant first contentful paint)     │
        │                                         │ 2. slow component A finishes
 400ms  │◀── stream <template> + swap script ─────┤    (skeleton A → product list)
        │                                         │
        │                                         │ 3. slow component B finishes
 1200ms │◀── stream <template> + swap script ─────┤    (skeleton B → analytics)
        │                                         │`}</Diagram>

      {/* ── Foundations ───────────────────────────────────────────────── */}
      <H2 id="foundations">২. স্ট্রিমিংয়ের ৪টি স্তম্ভ</H2>

      <Note>
        <ul>
          <li>
            <strong>Granular async boundaries:</strong> পুরো পেজ বা লেআউটকে একটিমাত্র বাউন্ডারিতে
            না আটকে স্বাধীন কম্পোনেন্টগুলোকে আলাদা <code>&lt;Suspense&gt;</code>-এ মুড়ে দিন — তাহলে
            লাইটওয়েট UI ফার্স্ট ফ্রেমেই দেখা যায়।
          </li>
          <li>
            <strong>Out-of-order HTML swap:</strong> প্রাথমিক HTML-এ Suspense পয়েন্টে একটি{" "}
            <code>&lt;template&gt;</code> প্লেসহোল্ডার বসে। স্লো কম্পোনেন্টের ডেটা রেডি হলে সার্ভার
            একটি ছোট HTML chunk আর একটি ইনলাইন <code>&lt;script&gt;</code> পাঠায়, যা রি-রেন্ডার
            ছাড়াই প্লেসহোল্ডারকে আসল কনটেন্ট দিয়ে রিপ্লেস করে।
          </li>
          <li>
            <strong>Selective hydration &amp; user priority:</strong> একাধিক বাউন্ডারি হাইড্রেট হওয়ার
            সময় ইউজার যদি কোনো আন-হাইড্রেটেড অংশে ক্লিক বা হভার করে, React সেই বাউন্ডারির
            হাইড্রেশন প্রায়োরিটি বাড়িয়ে সেটিকে আগে ইন্টারঅ্যাক্টিভ করে।
          </li>
          <li>
            <strong>Dimensional skeletons:</strong> <code>fallback</code>-এ জেনেরিক স্পিনার নয় —
            আসল কনটেন্টের সমান উচ্চতা-প্রস্থের skeleton (<code>min-h-[200px]</code>,{" "}
            <code>animate-pulse</code>) ব্যবহার করলে CLS প্রায় শূন্যে নামে।
          </li>
        </ul>
      </Note>

      {/* ── Implementation ────────────────────────────────────────────── */}
      <H2 id="implementation">৩. Monolithic বনাম Granular বাউন্ডারি</H2>

      <H3>❌ Anti-pattern — একটিমাত্র বাউন্ডারি সবকিছু ব্লক করে</H3>

      <CodeBlock filename="app/dashboard/blocked-page.tsx">{`import { Suspense } from 'react';

export default function BlockedDashboardPage() {
  return (
    <div className="p-6">
      <Header />

      {/* One boundary bundles a fast and a slow child together */}
      <Suspense fallback={<div>Loading entire dashboard...</div>}>
        <AsyncFastAnalytics /> {/* ready in 100ms  */}
        <AsyncSlowReviews />   {/* ready in 2500ms — blocks the fast one */}
      </Suspense>
    </div>
  );
}`}</CodeBlock>

      <H3>🟢 Fix — আলাদা বাউন্ডারি, প্যারালাল স্ট্রিম</H3>

      <CodeBlock filename="app/dashboard/_components/analytics.tsx">{`import 'server-only';

export async function FastAnalytics() {
  // Fast query — around 80ms
  await new Promise((resolve) => setTimeout(resolve, 80));

  return (
    <div className="p-4 bg-slate-900 border border-slate-800 rounded-xl space-y-2">
      <h3 className="text-sm font-semibold text-slate-300">Total Revenue</h3>
      <p className="text-2xl font-bold text-emerald-400">$45,230.00</p>
    </div>
  );
}`}</CodeBlock>

      <CodeBlock filename="app/dashboard/_components/slow-reviews.tsx">{`import 'server-only';

export async function SlowReviews() {
  // Slow third-party API / heavy aggregation — around 1500ms
  await new Promise((resolve) => setTimeout(resolve, 1500));

  return (
    <div className="p-4 bg-slate-900 border border-slate-800 rounded-xl space-y-2">
      <h3 className="text-sm font-semibold text-slate-300">Recent Feedback</h3>
      <p className="text-xs text-slate-400">"Excellent service and fast delivery!"</p>
    </div>
  );
}`}</CodeBlock>

      <CodeBlock filename="app/dashboard/page.tsx">{`import { Suspense } from 'react';
import { FastAnalytics } from './_components/analytics';
import { SlowReviews } from './_components/slow-reviews';

// A dimensional skeleton keeps CLS at zero
function SkeletonCard({ height = 'h-24' }: { height?: string }) {
  return (
    <div
      className={\`\${height} w-full bg-slate-900/60 border border-slate-800/80 rounded-xl animate-pulse p-4\`}
    />
  );
}

export default function StreamingDashboard() {
  return (
    <main className="max-w-4xl mx-auto p-6 space-y-6">
      {/* The shell renders at 0ms */}
      <header className="border-b border-slate-800 pb-4">
        <h1 className="text-xl font-bold text-white">Streaming Analytics Board</h1>
        <p className="text-xs text-slate-400">Live operational metrics</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Boundary 1 — streams in at ~80ms */}
        <Suspense fallback={<SkeletonCard height="h-28" />}>
          <FastAnalytics />
        </Suspense>

        {/* Boundary 2 — streams in at ~1500ms without blocking boundary 1 */}
        <Suspense fallback={<SkeletonCard height="h-28" />}>
          <SlowReviews />
        </Suspense>
      </div>
    </main>
  );
}`}</CodeBlock>

      {/* ── Matrix ────────────────────────────────────────────────────── */}
      <H2 id="matrix">৪. তিন আর্কিটেকচারের তুলনা</H2>

      <Table
        head={["আর্কিটেকচার", "TTFB", "FCP", "UX ও CLS"]}
        rows={[
          [
            "Traditional SSR",
            "ধীর — সব ডেটা ফেচ না হওয়া পর্যন্ত রিকোয়েস্ট আটকে থাকে",
            "ধীর — পুরো পেজ একসাথে আসে",
            "হোয়াইট স্ক্রিনে অপেক্ষা, তবে CLS কম",
          ],
          [
            "Monolithic Suspense",
            <>
              দ্রুত (<code>&lt;50ms</code>)
            </>,
            "দ্রুত, কিন্তু একটাই বড় স্পিনার ঝুলে থাকে",
            "ইউজার ভাবে সাইট আটকে আছে — প্রোগ্রেসিভ ফিলিং নেই",
          ],
          [
            "Granular Suspense (optimal)",
            <>
              দ্রুত (<code>&lt;50ms</code>)
            </>,
            "তাৎক্ষণিক — shell + skeleton",
            "ডেটা রেডি হওয়ার সাথে সাথে chunk স্ট্রিম, CLS শূন্যের কাছে",
          ],
        ]}
      />

      <Line name="ভুলু ভাই">
        ক্রিস্টাল ক্লিয়ার! পেজ লেভেলে <code>await</code> না করে প্রতিটি স্লো উইজেটকে নিজস্ব{" "}
        <code>&lt;Suspense&gt;</code> দিয়ে ঘিরে দিলে ফার্স্ট ফ্রেমেই সাইট দেখা যায়, আর ব্যাকগ্রাউন্ডে
        chunk-গুলো স্মুথলি স্ট্রিম হয়।
      </Line>

      {/* ── Takeaways ─────────────────────────────────────────────────── */}
      <H2 id="takeaway">Production Takeaways</H2>

      <Note>
        <ul>
          <li>
            <strong>Push boundaries to leaf nodes:</strong> Suspense বাউন্ডারি পেজের টপে না রেখে
            ধীরগতির নির্দিষ্ট চাইল্ডের ঠিক উপরে বসান।
          </li>
          <li>
            <strong>Never await in the parent:</strong> প্যারেন্ট লেআউট বা পেজে promise{" "}
            <code>await</code> করলে পুরো সাবট্রি ব্লক হয়ে যায় — ডেটা ফেচিং চাইল্ড async server
            component-এর ভেতরে নিয়ে যান।
          </li>
          <li>
            <strong>Design accurate fallbacks:</strong> fallback-এর আকৃতি ও উচ্চতা আসল কম্পোনেন্টের
            সমান রাখুন, যাতে chunk আসার সময় পেজ না লাফায়।
          </li>
        </ul>
      </Note>
    </article>
  );
}
