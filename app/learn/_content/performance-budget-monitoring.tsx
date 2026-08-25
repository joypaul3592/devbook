import {
  CodeBlock,
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
      bn: "\"মনে হচ্ছে ফাস্ট\" কোনো মেট্রিক নয়",
      en: "\"Feels fast\" is not a metric",
    },
  },
  {
    id: "budget",
    label: { bn: "পারফরম্যান্স বাজেট", en: "The performance budget" },
  },
  {
    id: "profiler",
    label: { bn: "React Profiler ইন্টিগ্রেশন", en: "React Profiler integration" },
  },
  {
    id: "rum",
    label: { bn: "Real-user monitoring", en: "Real-user monitoring" },
  },
  {
    id: "matrix",
    label: { bn: "Tools & Metrics Matrix", en: "Tools and metrics matrix" },
  },
  {
    id: "takeaway",
    label: { bn: "Production Takeaways", en: "Production takeaways" },
  },
];

export default function PerformanceBudgetMonitoring() {
  return (
    <article className="doc-prose">
      {/* ── The problem ───────────────────────────────────────────────── */}
      <H2 id="the-problem" anchorOnly>
        &quot;মনে হচ্ছে ফাস্ট&quot; কোনো মেট্রিক নয়
      </H2>

      <p>
        রাত ১১:৩০। কোড অপটিমাইজ করার পর ভুলু ভাই স্ক্রিনের দিকে তাকিয়ে বললেন — সাইট এখন অনেক ফাস্ট
        মনে হচ্ছে। কিন্তু প্রোডাকশনে আসল ইউজাররা কী পাচ্ছে?
      </p>

      <Line name="ভুলু ভাই">
        ফাহিম! আমার মনে হচ্ছে সাইট ফাস্ট হয়েছে। কিন্তু সত্যিই কি রিয়েল ইউজাররা স্মুথ পারফরম্যান্স
        পাচ্ছে, নাকি আমি অনুমানের ওপর দাঁড়িয়ে আছি?
      </Line>

      <Line name="ফাহিম">
        ভুলু ভাই! ইঞ্জিনিয়ারিংয়ে &quot;মনে হচ্ছে&quot; বলে কিছু নেই। দরকার একটি{" "}
        <strong>performance budget</strong> আর মাপা যায় এমন{" "}
        <strong>Core Web Vitals</strong>।
      </Line>

      <Line name="নেক্সট-ভাই">
        Next.js-এ রেন্ডার টাইম আর রি-রেন্ডার ক্যাসকেড ধরতে <code>&lt;Profiler&gt;</code>, আর রিয়েল
        ইউজারের মেট্রিক নিতে <code>useReportWebVitals</code> — দুটো একসাথে ব্যবহার করাই স্ট্যান্ডার্ড।
      </Line>

      {/* ── Budget ────────────────────────────────────────────────────── */}
      <H2 id="budget">১. পারফরম্যান্স বাজেট</H2>

      <Note>
        <ul>
          <li>
            <strong>LCP (Largest Contentful Paint) ≤ 2.5s</strong> — প্রধান ভিজ্যুয়াল কনটেন্ট
            দৃশ্যমান হওয়ার সময়।
          </li>
          <li>
            <strong>INP (Interaction to Next Paint) ≤ 200ms</strong> — ইউজারের ইন্টারঅ্যাকশনের পর UI
            আপডেট হওয়ার গতি; FID-এর আধুনিক উত্তরসূরি।
          </li>
          <li>
            <strong>CLS (Cumulative Layout Shift) ≤ 0.1</strong> — লোড হওয়ার সময় লেআউট কতটা
            নড়াচড়া করে।
          </li>
          <li>
            <strong>Initial JS bundle ≤ 100 KB (gzipped)</strong> — first load-এ যাওয়া
            JavaScript-এর সীমা।
          </li>
        </ul>
      </Note>

      {/* ── Profiler ──────────────────────────────────────────────────── */}
      <H2 id="profiler">২. React Profiler ইন্টিগ্রেশন</H2>

      <p>
        নির্দিষ্ট কম্পোনেন্ট ট্রি-র রেন্ডার সাইকেল ও স্লো আপডেট ধরতে React-এর{" "}
        <code>&lt;Profiler&gt;</code> API ব্যবহার করা হয়। ৬০ FPS ধরে রাখতে হলে প্রতিটি ফ্রেমের বাজেট
        ~১৬.৬ মিলিসেকেন্ড।
      </p>

      <CodeBlock filename="app/_components/tracked-analytics-widget.tsx">{`'use client';

import { Profiler, useState, type ProfilerOnRenderCallback } from 'react';

const onRenderCallback: ProfilerOnRenderCallback = (
  id,             // the profiler tree id
  phase,          // "mount" or "update"
  actualDuration, // time spent rendering this committed update
  baseDuration,   // estimated cost of rendering the subtree without memoization
) => {
  // Anything above one frame budget (~16.6ms) drops the app below 60fps
  if (actualDuration > 16.6) {
    console.warn(
      \`[perf] "\${id}" (\${phase}) took \${actualDuration.toFixed(2)}ms — base \${baseDuration.toFixed(2)}ms\`,
    );
  }
};

export function TrackedAnalyticsWidget() {
  const [count, setCount] = useState(0);

  return (
    <Profiler id="AnalyticsWidget" onRender={onRenderCallback}>
      <div className="p-6 bg-slate-900 border border-slate-800 rounded-xl space-y-4 text-slate-100">
        <h3 className="text-lg font-bold">Monitored component tree</h3>
        <button
          onClick={() => setCount((c) => c + 1)}
          className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 rounded-lg text-sm font-medium transition-colors"
        >
          Trigger state update (count: {count})
        </button>
      </div>
    </Profiler>
  );
}`}</CodeBlock>

      <H3>মনে রাখবেন</H3>

      <Note>
        <p>
          <code>&lt;Profiler&gt;</code> প্রোডাকশন বিল্ডে ডিফল্টভাবে no-op — মাপার জন্য development
          বিল্ড বা profiling-enabled বিল্ড দরকার। রিয়েল ইউজারের সংখ্যা নিতে হলে নিচের Web Vitals
          পথটাই ব্যবহার করুন।
        </p>
      </Note>

      {/* ── RUM ───────────────────────────────────────────────────────── */}
      <H2 id="rum">৩. Real-user monitoring (RUM)</H2>

      <CodeBlock filename="app/_components/web-vitals-reporter.tsx">{`'use client';

import { useReportWebVitals } from 'next/web-vitals';

export function WebVitalsReporter() {
  useReportWebVitals((metric) => {
    // Send to your analytics endpoint — Vercel Analytics, GA, or a custom collector
    if (process.env.NODE_ENV !== 'production') return;

    const { id, name, value, rating } = metric;

    console.log(\`[web-vitals] \${name}\`, {
      id,
      value: \`\${Math.round(value)}ms\`,
      rating, // 'good' | 'needs-improvement' | 'poor'
    });
  });

  return null;
}`}</CodeBlock>

      <CodeBlock filename="app/layout.tsx">{`import { WebVitalsReporter } from './_components/web-vitals-reporter';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="bn">
      <body>
        {/* Mounted once — it renders nothing and only reports metrics */}
        <WebVitalsReporter />
        {children}
      </body>
    </html>
  );
}`}</CodeBlock>

      {/* ── Matrix ────────────────────────────────────────────────────── */}
      <H2 id="matrix">৪. Tools &amp; Metrics Matrix</H2>

      <Table
        head={["টুল", "কী মাপে", "এনভায়রনমেন্ট"]}
        rows={[
          [
            "React DevTools Profiler",
            "Render duration, re-render cause, flamegraph",
            "Development 🛠️",
          ],
          [
            <>
              <code>useReportWebVitals</code>
            </>,
            "LCP, INP, CLS, TTFB — রিয়েল ইউজারের ডেটা",
            "Production (RUM) 🌐",
          ],
          [
            <>
              <code>@next/bundle-analyzer</code>
            </>,
            "First-load JS bundle সাইজ ও ডিস্ট্রিবিউশন",
            "Build pipeline 📦",
          ],
        ]}
      />

      <Line name="ভুলু ভাই">
        অসাধারণ! আর অনুমানে নয় — Profiler আর রিয়েল-ইউজার ডেটা দিয়ে মেপে তবেই বলব সাইট ফাস্ট।
      </Line>

      {/* ── Takeaways ─────────────────────────────────────────────────── */}
      <H2 id="takeaway">Production Takeaways</H2>

      <Note>
        <ul>
          <li>
            <strong>Don&apos;t guess, measure:</strong> Profiler চালিয়ে রেন্ডার ডিউরেশন ১৬.৬ms-এর
            নিচে রাখা নিশ্চিত করুন — সেটাই ৬০ FPS-এর সীমা।
          </li>
          <li>
            <strong>Prioritise INP:</strong> ইন্টারঅ্যাকশনের পর UI কত দ্রুত আপডেট হচ্ছে — আধুনিক
            অ্যাপে এটিই সবচেয়ে বেশি টের পাওয়া মেট্রিক।
          </li>
          <li>
            <strong>Automate the budget:</strong> CI/CD-তে বান্ডেল সাইজ বাজেট অতিক্রম করলে বিল্ড
            ফেল করানোর ব্যবস্থা রাখুন — নইলে বাজেট ধীরে ধীরে ফাঁস হয়ে যাবে।
          </li>
        </ul>
      </Note>
    </article>
  );
}
