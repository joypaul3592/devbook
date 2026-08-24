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
      bn: "স্ট্রিমিং চালু, পেজ কাঁপছে",
      en: "Streaming on, the page is shaking",
    },
  },
  {
    id: "architecture",
    label: { bn: "Layout Shift বনাম Space Budgeting", en: "Layout shift vs space budgeting" },
  },
  {
    id: "pillars",
    label: { bn: "UX ডিজাইনের ৪টি স্তম্ভ", en: "Four pillars of streaming UX" },
  },
  {
    id: "implementation",
    label: { bn: "Dimension-matched স্কেলিটন", en: "Dimension-matched skeletons" },
  },
  {
    id: "matrix",
    label: { bn: "Best Practices Matrix", en: "Best practices matrix" },
  },
  {
    id: "takeaway",
    label: { bn: "Production Takeaways", en: "Production takeaways" },
  },
];

export default function UxDesignForStreaming() {
  return (
    <article className="doc-prose">
      {/* ── The problem ───────────────────────────────────────────────── */}
      <H2 id="the-problem" anchorOnly>
        স্ট্রিমিং চালু, পেজ কাঁপছে
      </H2>

      <p>
        রাত ৪:১৫। ভুলু ভাই ড্যাশবোর্ডে granular Suspense বসিয়ে খুশি। কিন্তু রিফ্রেশ দিতেই অদ্ভুত
        দৃশ্য — ৫০ms-এ নোটিফিকেশন জায়গা দখল করল, ১.৫ সেকেন্ডে পোস্ট পেজকে নিচে ঠেলে দিল, আর ৩
        সেকেন্ডে চার্ট এসে পুরো লেআউটের উচ্চতা বাড়িয়ে স্ক্রলবারে ঝাঁকুনি দিল! DevTools-এ CLS লাল।
      </p>

      <Line name="ভুলু ভাই">
        ফাহিম! কনটেন্ট তো টুকরো টুকরো স্ট্রিম হচ্ছে ঠিকই, কিন্তু পেজটা ভূমিকম্পের মতো কাঁপছে! নিচের
        এলিমেন্টগুলো লাফালাফি করছে কেন?
      </Line>

      <Line name="ফাহিম">
        ভুলু ভাই! স্ট্রিমিং পারফরম্যান্সের জন্য যতটা ভালো, UX ডিজাইন ঠিক না থাকলে ততটাই বিরক্তিকর!{" "}
        <code>fallback</code> স্কেলিটনের উচ্চতা আর আসল কম্পোনেন্টের উচ্চতা সমান না হলে কনটেন্ট
        স্ট্রিম হওয়ার সাথে সাথে ব্রাউজার DOM পুনর্গঠন করে — এটাই CLS।
      </Line>

      <Line name="নেক্সট-ভাই">
        Streaming UX-এর গোল্ডেন রুল তিনটি — <strong>space budgeting</strong>,{" "}
        <strong>content shape mirroring</strong>, আর <strong>loading flash প্রতিরোধ</strong>।
      </Line>

      {/* ── Architecture ──────────────────────────────────────────────── */}
      <H2 id="architecture">১. Layout Shift বনাম Space Budgeting</H2>

      <Diagram>{`┌─────────────────────────────────────────────────────────────────────────┐
│              BAD STREAMING UX (CLS) VS SPACE-BUDGETED UX                │
└─────────────────────────────────────────────────────────────────────────┘

 BAD UX — an unsized skeleton causes a layout jump:
 ┌────────────────────────┐
 │ Fallback (height 20px) │ ──▶ streamed component arrives (height 300px)
 └────────────────────────┘
 ┌────────────────────────┐
 │ Footer content below   │ ──▶ kicked down by 280px instantly — high CLS
 └────────────────────────┘

 -------------------------------------------------------------------------

 GOOD UX — reserved space budget & skeleton mirroring:
 ┌────────────────────────┐
 │ Fallback (height 300px)│ ──▶ streamed component arrives (height 300px)
 │ [skeleton card & lines]│     replaces the skeleton smoothly, in place
 └────────────────────────┘
 ┌────────────────────────┐
 │ Footer content below   │ ──▶ zero movement, zero layout shift
 └────────────────────────┘`}</Diagram>

      {/* ── Pillars ───────────────────────────────────────────────────── */}
      <H2 id="pillars">২. Streaming UX ডিজাইনের ৪টি স্তম্ভ</H2>

      <Note>
        <ul>
          <li>
            <strong>Space budgeting:</strong> fallback স্কেলিটনের উচ্চতা, প্রস্থ ও কার্ড স্ট্রাকচার
            যেন অবিকল আসল কনটেন্টের সমান হয় — তাহলে ইনজেকশনের সময় নিচের DOM নড়বে না।
          </li>
          <li>
            <strong>Skeleton বনাম spinner:</strong> spinner ভালো ছোট ইনলাইন অ্যাকশনে (বাটনের ভেতর)।
            পুরো সেকশন, কার্ড বা টেবিলের জন্য skeleton screen — এটি ইউজারকে আগাম ধারণা দেয় কী আকারের
            কনটেন্ট আসছে।
          </li>
          <li>
            <strong>Preventing skeleton flash:</strong> কোনো API ২০–৫০ms-এ রেজলভ হলে স্কেলিটন এক
            পলকের জন্য ঝিকমিক করে গায়েব হয় — চোখের জন্য অস্বস্তিকর। অতি-দ্রুত ডেটার জন্য আলাদা
            বাউন্ডারি না রেখে প্যারেন্টের সাথে গুটিয়ে ফেলা ভালো।
          </li>
          <li>
            <strong>Progressive disclosure:</strong> গুরুত্বপূর্ণ কনটেন্ট (F-pattern অনুযায়ী উপরের
            বাঁ দিক) আগে স্ট্রিম হোক; পেরিফেরাল সাইডবার বা উইজেট পরে এলেও সমস্যা নেই।
          </li>
        </ul>
      </Note>

      {/* ── Implementation ────────────────────────────────────────────── */}
      <H2 id="implementation">৩. Dimension-matched স্কেলিটন</H2>

      <H3>❌ Anti-pattern — unsized fallback</H3>

      <CodeBlock filename="app/dashboard/page.tsx">{`import { Suspense } from 'react';

// The skeleton is ~40px tall while the real content is 360px
function BadSkeleton() {
  return (
    <div className="p-2 bg-slate-900 border border-slate-800 rounded animate-pulse">
      <p className="text-xs text-slate-500">Loading chart...</p>
    </div>
  );
}

export default function BadUXStreamingPage() {
  return (
    <div className="p-6 space-y-6">
      <h1 className="text-xl font-bold">Analytics Panel</h1>

      {/* When the chart streams in, it shoves the footer down violently */}
      <Suspense fallback={<BadSkeleton />}>
        <SlowAnalyticsChart />
      </Suspense>

      <footer className="p-4 bg-slate-800 text-xs">Footer content</footer>
    </div>
  );
}`}</CodeBlock>

      <H3>🟢 Fix — স্কেলিটন আসল কনটেন্টের আকৃতি মিরর করে</H3>

      <CodeBlock filename="app/dashboard/_components/analytics-skeleton.tsx">{`// Dimensions match the real component exactly
export function AnalyticsSkeleton() {
  return (
    <div className="h-[360px] w-full p-6 bg-slate-900 border border-slate-800 rounded-2xl animate-pulse space-y-4 flex flex-col justify-between">
      {/* header mirroring */}
      <div className="flex justify-between items-center">
        <div className="h-5 w-1/3 bg-slate-800 rounded-md" />
        <div className="h-4 w-16 bg-slate-800/60 rounded-full" />
      </div>

      {/* reserved space for the graph body */}
      <div className="h-48 w-full bg-slate-800/30 rounded-xl flex items-end p-4 space-x-3">
        <div className="h-1/3 w-1/6 bg-slate-800/80 rounded" />
        <div className="h-2/3 w-1/6 bg-slate-800/80 rounded" />
        <div className="h-full w-1/6 bg-slate-800/80 rounded" />
        <div className="h-1/2 w-1/6 bg-slate-800/80 rounded" />
        <div className="h-4/5 w-1/6 bg-slate-800/80 rounded" />
        <div className="h-3/5 w-1/6 bg-slate-800/80 rounded" />
      </div>

      {/* footer metrics mirroring */}
      <div className="flex space-x-4 pt-2 border-t border-slate-800/50">
        <div className="h-4 w-1/4 bg-slate-800 rounded" />
        <div className="h-4 w-1/4 bg-slate-800 rounded" />
      </div>
    </div>
  );
}`}</CodeBlock>

      <CodeBlock filename="app/dashboard/page.tsx">{`import { Suspense } from 'react';
import 'server-only';
import { AnalyticsSkeleton } from './_components/analytics-skeleton';

async function SlowAnalyticsChart() {
  await new Promise((res) => setTimeout(res, 2500));
  return (
    // The same h-[360px] the skeleton reserved
    <div className="h-[360px] w-full p-6 bg-slate-900 border border-slate-800 rounded-2xl flex flex-col justify-between text-slate-100">
      <div className="flex justify-between items-center">
        <h3 className="text-base font-bold">Revenue Dynamics</h3>
        <span className="text-xs bg-emerald-500/10 text-emerald-400 px-2 py-0.5 rounded-full">
          Q3 active
        </span>
      </div>
      <div className="h-48 w-full bg-slate-800/20 border border-slate-800 rounded-xl flex items-center justify-center font-mono text-emerald-400 text-lg">
        [Interactive chart canvas]
      </div>
      <div className="flex justify-between text-xs text-slate-400 pt-2 border-t border-slate-800">
        <span>Target: $50,000</span>
        <span>Achieved: 84%</span>
      </div>
    </div>
  );
}

export default function PixelPerfectStreamingPage() {
  return (
    <main className="max-w-2xl mx-auto py-10 px-6 space-y-6">
      <h1 className="text-xl font-bold text-white">System Dashboard</h1>

      {/* Zero-CLS boundary: the skeleton reserves the space precisely */}
      <Suspense fallback={<AnalyticsSkeleton />}>
        <SlowAnalyticsChart />
      </Suspense>

      {/* The footer below never moves a single pixel */}
      <footer className="p-4 bg-slate-900/50 border border-slate-800/60 rounded-xl text-xs text-slate-500 text-center">
        System monitor 4.2.0 - zero layout shift active
      </footer>
    </main>
  );
}`}</CodeBlock>

      {/* ── Matrix ────────────────────────────────────────────────────── */}
      <H2 id="matrix">৪. Streaming UX Best Practices</H2>

      <Table
        head={["UX দিক", "খারাপ ডিজাইন", "সঠিক প্রোডাকশন ডিজাইন"]}
        rows={[
          [
            "Dimensioning",
            <>
              unsized fallback (<code>h-auto</code> বা ছোট টেক্সট)
            </>,
            <>
              নির্দিষ্ট reserved height (<code>h-[360px]</code>, aspect-ratio)
            </>,
          ],
          [
            "Loader choice",
            "সব জায়গায় গোল স্পিনার",
            "কনটেন্টের আকৃতি অনুসরণ করা structural skeleton",
          ],
          ["CLS", "> 0.25 — পেজ লাফায়", "0.00 — সম্পূর্ণ স্থির পেজ"],
          [
            "Animation",
            "কড়া ব্লিঙ্ক বা লাফালাফি",
            <>
              সাবলীল <code>animate-pulse</code> opacity transition
            </>,
          ],
        ]}
      />

      <Line name="ভুলু ভাই">
        মারাত্মক ট্রিক! স্কেলিটনের হাইট আর আসল কনটেন্টের হাইট <code>h-[360px]</code> সেম রাখায় এখন
        স্কেলিটনটা নিঃশব্দে রিপ্লেস হয়ে যাচ্ছে, পেজের কোনো এলিমেন্ট এক পিক্সেলও নড়ছে না!
      </Line>

      {/* ── Takeaways ─────────────────────────────────────────────────── */}
      <H2 id="takeaway">Production Takeaways</H2>

      <Note>
        <ul>
          <li>
            <strong>Reserve the space budget first:</strong> বাউন্ডারি তৈরির সময় আসল কম্পোনেন্টের
            উচ্চতা মেপে স্কেলিটনে সেই <code>min-height</code> বা নির্দিষ্ট height বসান।
          </li>
          <li>
            <strong>No unsized spinners for structural layouts:</strong> পুরো সেকশনে স্পিনার দিলে
            ইউজার বোঝে না কী আসছে — কনটেন্টের শেপ ফলো করা স্কেলিটন ব্যবহার করুন।
          </li>
          <li>
            <strong>Audit with Lighthouse:</strong> Chrome DevTools-এর Performance বা Lighthouse
            চালিয়ে নেভিগেশনের সময় CLS স্কোর যাচাই করে নিন।
          </li>
        </ul>
      </Note>
    </article>
  );
}
