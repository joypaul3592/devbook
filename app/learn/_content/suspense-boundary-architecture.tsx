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
      bn: "একটি স্লো উইজেট, পুরো পেজ জিম্মি",
      en: "One slow widget holds the page hostage",
    },
  },
  {
    id: "architecture",
    label: { bn: "Page-level বনাম Granular", en: "Page-level vs granular" },
  },
  {
    id: "placement",
    label: { bn: "২ ধরনের Placement", en: "Two placement styles" },
  },
  {
    id: "implementation",
    label: { bn: "Bottleneck ও সঠিক প্লেসমেন্ট", en: "Bottleneck vs correct placement" },
  },
  {
    id: "matrix",
    label: { bn: "Trade-offs Matrix", en: "Trade-offs matrix" },
  },
  {
    id: "takeaway",
    label: { bn: "Production Takeaways", en: "Production takeaways" },
  },
];

export default function SuspenseBoundaryArchitecture() {
  return (
    <article className="doc-prose">
      {/* ── The problem ───────────────────────────────────────────────── */}
      <H2 id="the-problem" anchorOnly>
        একটি স্লো উইজেট, পুরো পেজ জিম্মি
      </H2>

      <p>
        রাত ১:১৫। ভুলু ভাইয়ের ড্যাশবোর্ডে ইউজার প্রোফাইল, কুইক অ্যাকশন আর একটি ৪-সেকেন্ড স্লো
        অ্যানালিটিক্স উইজেট আছে। তিনি পুরো <code>DashboardPage</code>-কে একটিমাত্র{" "}
        <code>&lt;Suspense&gt;</code> দিয়ে র‍্যাপ করে দিয়েছেন। রিফ্রেশ দিতেই ফাহিম দেখল — ইউজারের
        সাধারণ নাম-ছবি দেখতেও পুরো ৪ সেকেন্ড স্কেলিটন হয়ে পেজ আটকে থাকছে!
      </p>

      <Line name="ভুলু ভাই">
        ফাহিম! আমি তো <code>&lt;Suspense&gt;</code> বসিয়েছি! কিন্তু ছোট একটা অ্যানালিটিক্স গ্রাফের
        স্লো API-এর জন্য পুরো ড্যাশবোর্ড ৪ সেকেন্ড লোডিং কেন দেখাচ্ছে?
      </Line>

      <Line name="ফাহিম">
        ভুলু ভাই! আপনি করেছেন <strong>coarse-grained (page-level)</strong> boundary! পুরো পেজকে
        একটিমাত্র Suspense দিয়ে ঢেকে দেওয়ায় দ্রুত রেন্ডার হওয়া কুইক-অ্যাকশন আর প্রোফাইল কার্ডও
        ধীরগতির উইজেটের কাছে জিম্মি হয়ে গেছে!
      </Line>

      <Line name="নেক্সট-ভাই">
        মূল কৌশল হলো — ইন্ডিপেন্ডেন্ট ও স্লো async ব্লকগুলোকে আলাদা{" "}
        <strong>granular</strong> বাউন্ডারিতে ভাগ করা। তাহলে static shell আর দ্রুতগতির কনটেন্ট
        মিলিসেকেন্ডে ফ্লাশ হয়ে যায়, আর ভারী উইজেট ব্যাকগ্রাউন্ডে স্ট্রিম হতে থাকে।
      </Line>

      {/* ── Architecture ──────────────────────────────────────────────── */}
      <H2 id="architecture">১. Boundary Architecture Comparison</H2>

      <Diagram>{`┌─────────────────────────────────────────────────────────────────────────┐
│                  PAGE-LEVEL VS GRANULAR BOUNDARY                        │
└─────────────────────────────────────────────────────────────────────────┘

 PAGE-LEVEL (coarse-grained) BOUNDARY:
 <Suspense fallback={<FullPageSkeleton />}>
    ├── <UserProfile />    (fast: 50ms)   ──┐
    ├── <QuickActions />   (fast: 20ms)   ──┼──▶ all blocked for 4000ms
    └── <SlowAnalytics />  (slow: 4000ms) ──┘
 </Suspense>

 -------------------------------------------------------------------------

 GRANULAR (fine-grained) BOUNDARIES:
 <div>
    ├── <UserProfile />    (instant shell — 0ms)
    ├── <QuickActions />   (instant shell — 0ms)
    └── <Suspense fallback={<AnalyticsSkeleton />}>
           └── <SlowAnalytics />  (streams in at 4000ms without blocking)
        </Suspense>
 </div>`}</Diagram>

      {/* ── Placement ─────────────────────────────────────────────────── */}
      <H2 id="placement">২. ২ ধরনের Boundary Placement</H2>

      <Note>
        <ul>
          <li>
            <strong>Page-level / coarse-grained:</strong> ব্যবহার করুন যখন পেজের সব ডেটা একে
            অপরের ওপর শতভাগ নির্ভরশীল এবং আংশিক দেখানোর চেয়ে পুরোটা একসাথে আসা UX-এর জন্য ভালো।
            সমস্যা — একটি ছোট API স্লো হলেই পুরো পেজ আটকে যায়।
          </li>
          <li>
            <strong>Granular / fine-grained:</strong> ড্যাশবোর্ড, প্রোডাক্ট পেজ বা অ্যানালিটিক্স
            প্যানেলে, যেখানে বেশিরভাগ UI স্বাধীন ডেটা সোর্স থেকে আসে। সুবিধা — header, navigation
            ও static layout প্রথম ফ্রেমেই রেন্ডার হয়, অ্যাপ ফাস্ট মনে হয়।
          </li>
        </ul>
      </Note>

      {/* ── Implementation ────────────────────────────────────────────── */}
      <H2 id="implementation">৩. Bottleneck ও সঠিক প্লেসমেন্ট</H2>

      <H3>❌ Anti-pattern — page-level bottleneck</H3>

      <CodeBlock filename="app/dashboard/page.tsx">{`import { Suspense } from 'react';

export default function BadDashboard() {
  return (
    // A single boundary traps fast and slow components together
    <Suspense fallback={<div className="p-8 text-center">Loading dashboard...</div>}>
      <FastHeader />
      <FastUserStats />
      <SlowAnalyticsChart /> {/* takes 4 seconds */}
    </Suspense>
  );
}`}</CodeBlock>

      <H3>🟢 Fix — granular placement</H3>

      <CodeBlock filename="app/dashboard/page.tsx">{`import { Suspense } from 'react';
import 'server-only';

// 1. Fast component — renders instantly
async function FastHeader() {
  return (
    <header className="border-b border-slate-800 pb-4 flex justify-between items-center">
      <h1 className="text-xl font-bold text-white">System Dashboard</h1>
      <span className="text-xs bg-emerald-500/10 text-emerald-400 px-2 py-1 rounded">
        Live
      </span>
    </header>
  );
}

// 2. Independent slow component
async function SlowAnalyticsChart() {
  await new Promise((resolve) => setTimeout(resolve, 3500));
  return (
    <div className="p-6 bg-slate-900 border border-slate-800 rounded-2xl">
      <h3 className="text-sm font-semibold text-slate-300">Real-Time Traffic Stream</h3>
      <div className="h-40 bg-slate-800/50 rounded-lg mt-4 flex items-center justify-center text-emerald-400 font-mono">
        +244.5% conversion spike
      </div>
    </div>
  );
}

// A skeleton dedicated ONLY to the chart
function ChartSkeleton() {
  return (
    <div className="p-6 bg-slate-900 border border-slate-800 rounded-2xl animate-pulse">
      <div className="h-4 w-1/4 bg-slate-800 rounded mb-4" />
      <div className="h-40 bg-slate-800/40 rounded-lg" />
    </div>
  );
}

export default function OptimizedDashboard() {
  return (
    <main className="max-w-4xl mx-auto py-10 px-6 space-y-6">
      {/* Static / fast shell renders instantly — nothing waits on it */}
      <FastHeader />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="p-6 bg-slate-900 border border-slate-800 rounded-2xl">
          <h3 className="text-sm font-semibold text-slate-300">Quick Summary</h3>
          <p className="text-xs text-slate-400 mt-2">
            All services operating normally.
          </p>
        </div>

        {/* Isolated boundary: only the slow chart streams in later */}
        <Suspense fallback={<ChartSkeleton />}>
          <SlowAnalyticsChart />
        </Suspense>
      </div>
    </main>
  );
}`}</CodeBlock>

      {/* ── Matrix ────────────────────────────────────────────────────── */}
      <H2 id="matrix">৪. Placement Strategy Trade-offs</H2>

      <Table
        head={["কৌশল", "Initial response", "Skeleton UX", "Complexity"]}
        rows={[
          [
            "Coarse-grained (page-level)",
            "ধীরতম API-এর সমান",
            "পুরো পেজ স্কেলিটন ঝিকমিক করে",
            "খুবই সহজ",
          ],
          [
            "Granular (component-level)",
            "ইনস্ট্যান্ট UI shell",
            "নিখুঁত ও মসৃণ",
            "পরিমিত — স্কেলিটন ডিজাইন করতে হয়",
          ],
          [
            "Over-granular",
            "দ্রুত, তবে UI বিক্ষিপ্ত",
            "skeleton waterfall — অসংখ্য ছোট লোডার",
            "কোড বিশৃঙ্খল হয়",
          ],
        ]}
      />

      <Line name="ভুলু ভাই">
        দুর্দান্ত! এবার ড্যাশবোর্ডের লেআউট আর কুইক সামারি সাথে সাথে স্ক্রিনে চলে আসছে, আর স্লো
        অ্যানালিটিক্স উইজেটটা সুন্দরভাবে ব্যাকগ্রাউন্ডে স্ট্রিম হচ্ছে!
      </Line>

      {/* ── Takeaways ─────────────────────────────────────────────────── */}
      <H2 id="takeaway">Production Takeaways</H2>

      <Note>
        <ul>
          <li>
            <strong>Isolate heavy data fetchers:</strong> কোনো কম্পোনেন্ট ১ সেকেন্ডের বেশি নিলে
            সেটিকে মূল লেআউট থেকে আলাদা করে নিজস্ব <code>&lt;Suspense&gt;</code> বাউন্ডারিতে রাখুন।
          </li>
          <li>
            <strong>Avoid skeleton flashing:</strong> প্রতিটি ছোট বাটন বা লাইনের জন্য আলাদা
            Suspense না বসিয়ে যৌক্তিক UI block (widget level)-এ বাউন্ডারি বসান।
          </li>
          <li>
            <strong>Keep the layout shell pure:</strong> navigation, layout grid আর static
            element সবসময় বাউন্ডারির বাইরে রাখুন যাতে ব্রাউজার সাথে সাথে HTML shell আঁকতে পারে।
          </li>
        </ul>
      </Note>
    </article>
  );
}
