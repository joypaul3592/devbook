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
      bn: "বিল্ড ফোল্ডারে লুকানো ১২ মেগাবাইট",
      en: "12 MB hiding in the build folder",
    },
  },
  {
    id: "analyzer",
    label: {
      bn: "@next/bundle-analyzer সেটআপ",
      en: "Setting up @next/bundle-analyzer",
    },
  },
  {
    id: "audit",
    label: { bn: "ভারী ডিপেন্ডেন্সি শিকার", en: "Hunting heavy dependencies" },
  },
  {
    id: "vitals",
    label: { bn: "Core Web Vitals অডিট", en: "Auditing Core Web Vitals" },
  },
  {
    id: "matrix",
    label: { bn: "টুলগুলোর তুলনা", en: "Comparing the tools" },
  },
  {
    id: "takeaway",
    label: { bn: "Production Takeaways", en: "Production takeaways" },
  },
];

export default function BundleAnalysisAuditing() {
  return (
    <article className="doc-prose">
      {/* ── The problem ───────────────────────────────────────────────── */}
      <H2 id="the-problem" anchorOnly>
        বিল্ড ফোল্ডারে লুকানো ১২ মেগাবাইট
      </H2>

      <p>
        রাত ১২টা। ভুলু ভাই সব অপটিমাইজেশন শেষ করার পরও বিল্ড ফোল্ডারের সাইজ চেক করে দেখলেন{" "}
        <code>.next/static/chunks</code> ফোল্ডারের ভেতর বিশাল আকৃতির কিছু জাভাস্ক্রিপ্ট ফাইল
        লুকিয়ে আছে!
      </p>

      <Line name="ভুলু ভাই">
        (পেরেশান হয়ে) নেক্সট-ভাই! আমি ইমেজ, ফন্ট, স্ক্রিপ্ট অপটিমাইজ করলাম, এমনকি{" "}
        <code>next/dynamic</code> দিয়ে কোড স্প্লিটিংও করলাম! কিন্তু বিল্ড সাইজে এখনও ১২
        মেগাবাইটের হেভি জাভাস্ক্রিপ্ট লুকিয়ে বসে আছে! কোন লাইব্রেরিটা এত জায়গা দখল করছে, তা
        অন্ধের মতো আন্দাজ না করে বের করার কোনো সায়েন্টিফিক ওয়ে আছে কি?!
      </Line>

      <Line name="নেক্সট-ভাই">
        (কিবোর্ডে হাত রেখে) অন্ধের মতো আন্দাজ করবি কেন ভুলু?! ইঞ্জিনিয়াররা আন্দাজে কাজ করে
        না, ডাটা দেখে অডিট করে! বান্ডেল ভিজ্যুয়ালি এক্স-রে করার জন্য আছে{" "}
        <code>@next/bundle-analyzer</code>, আর সার্বিক পারফর্মেন্স মাপার জন্য গুগলের
        Lighthouse ও Core Web Vitals!
      </Line>

      {/* ── Analyzer ──────────────────────────────────────────────────── */}
      <H2 id="analyzer">১. @next/bundle-analyzer সেটআপ</H2>

      <p>
        এটি তোর প্রতিটি ক্লায়েন্ট ও সার্ভার চাঙ্ককে ইন্টারঅ্যাক্টিভ ব্লকে রূপান্তর করে দেখায়
        — কোন প্যাকেজ কত কিলোবাইট জায়গা খাচ্ছে।
      </p>

      <H3>Step 1 — ইনস্টল</H3>

      <CodeBlock label="Bash" filename="install.sh">{`npm install @next/bundle-analyzer`}</CodeBlock>

      <H3>Step 2 — next.config.ts কনফিগার</H3>

      <CodeBlock filename="next.config.ts">{`import type { NextConfig } from 'next';
import withBundleAnalyzer from '@next/bundle-analyzer';

const nextConfig: NextConfig = {
  /* Your standard Next.js config options here */
  reactStrictMode: true,
};

// ⚡ Wrap the config with the analyzer, triggered via the ANALYZE env variable
export default withBundleAnalyzer({
  enabled: process.env.ANALYZE === 'true',
})(nextConfig);`}</CodeBlock>

      <H3>Step 3 — npm script</H3>

      <CodeBlock label="JSON" filename="package.json">{`{
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "analyze": "ANALYZE=true next build"
  }
}`}</CodeBlock>

      {/* ── Audit ─────────────────────────────────────────────────────── */}
      <H2 id="audit">২. ভারী ডিপেন্ডেন্সি শিকার</H2>

      <p>
        <code>npm run analyze</code> রান করার সাথে সাথেই ব্রাউজারে একটি রঙ-বেরঙের ভিজ্যুয়াল
        ট্রিম্যাপ খুলে যায়:
      </p>

      <Diagram>{`[ Interactive HTML Treemap Generated in Browser ]
┌───────────────────────────────────────────────────────────┐
│ node_modules/lodash (400 KB)                              │
│ ┌───────────────────────────────────────────────────────┐ │
│ │ node_modules/moment/min/moment-with-locales.js (320KB)│ │
│ └───────────────────────────────────────────────────────┘ │
├───────────────────────────────────────────────────────────┤
│ app/components/Chart.js (850 KB)                          │
└───────────────────────────────────────────────────────────┘`}</Diagram>

      <Line name="ভুলু ভাই">
        (চোখ কপালে তুলে) ইয়া মাবুদ! আমি জাস্ট তারিখ ফরম্যাট করার জন্য{" "}
        <code>moment.js</code> ইনস্টল করেছিলাম, আর ও একা ৩০০+ কিলোবাইট নিয়ে বসে আছে! আর ২-৩টি
        হেল্পার ফাংশনের জন্য পুরো <code>lodash</code> ৪০০ কিলোবাইট আটকে রাখছে!
      </Line>

      <Line name="নেক্সট-ভাই">
        হাহা! ধরা পড়েছে চোর! প্রোডাকশন ইঞ্জিনিয়ারিংয়ের মূলমন্ত্র হলো ভারী ও প্রাচীন
        লাইব্রেরি বাদ দিয়ে হালকা মডার্ন বিকল্প ব্যবহার করা:
      </Line>

      <ul>
        <li>
          <code>moment.js</code> (320 KB) ➜ <code>date-fns</code> / <code>dayjs</code> (~2
          KB, tree-shakable)
        </li>
        <li>
          ❌ <code>import _ from &apos;lodash&apos;</code> — পুরো ৪০০ KB টেনে আনে
        </li>
        <li>
          ✅ <code>import debounce from &apos;lodash/debounce&apos;</code> — মাত্র ~২ KB
        </li>
        <li>
          ভারী আইকন প্যাক (FontAwesome All) ➜ <code>lucide-react</code> /{" "}
          <code>react-icons</code>
        </li>
      </ul>

      {/* ── Vitals ────────────────────────────────────────────────────── */}
      <H2 id="vitals">৩. Core Web Vitals অডিট</H2>

      <Diagram>{`───────────────────────────────────────────────────────────────────────────
1. LCP (Largest Contentful Paint)  ── Target: < 2.5s   (main content speed)
2. INP (Interaction to Next Paint) ── Target: < 200ms  (UI response to clicks)
3. CLS (Cumulative Layout Shift)   ── Target: < 0.1    (visual stability)
───────────────────────────────────────────────────────────────────────────`}</Diagram>

      <p>
        শুধু নিজের কম্পিউটারের লাইটহাউসে টেস্ট করলেই হবে না — আসল ইউজাররা কী পারফর্মেন্স
        পাচ্ছে, তা অ্যানালিটিক্সে পাঠাতে Next.js-এ ইনবিল্ট মেকানিজম আছে:
      </p>

      <CodeBlock filename="app/vitals.tsx">{`'use client';

import { useReportWebVitals } from 'next/web-vitals';

export function WebVitalsReporter() {
  useReportWebVitals((metric) => {
    // Send the metrics to Google Analytics, Vercel Analytics or a custom endpoint
    console.log(metric.name, metric.value);
    // Example output: LCP 1200, INP 80, CLS 0.01
  });

  return null;
}`}</CodeBlock>

      {/* ── Matrix ────────────────────────────────────────────────────── */}
      <H2 id="matrix">৪. টুলগুলোর তুলনা</H2>

      <Table
        head={["টুল", "উদ্দেশ্য", "কখন ব্যবহার করবেন"]}
        rows={[
          [
            <code key="analyzer">@next/bundle-analyzer</code>,
            "JavaScript chunk size ও dependency treemap",
            "ডিপ্লয়ের আগে অপ্রয়োজনীয় প্যাকেজ চিহ্নিত করতে",
          ],
          [
            "Google Lighthouse",
            "Synthetic performance, SEO ও accessibility অডিট",
            "লোকাল ডেভেলপমেন্টে বা বেঞ্চমার্ক টেস্টে",
          ],
          [
            <code key="vitals">useReportWebVitals</code>,
            "রিয়েল ইউজারের ব্রাউজার ফিডব্যাক (RUM)",
            "প্রোডাকশন মনিটরিং ও ফিল্ড ডাটা মেজারমেন্টে",
          ],
        ]}
      />

      <Line name="ভুলু ভাই">
        (তৃপ্তির হাসি দিয়ে) আহ্! <code>ANALYZE=true npm run build</code> চালিয়ে চোর
        লাইব্রেরি দুটো বদলে সাইট থেকে ১ মেগাবাইট ঝেড়ে ফেললাম! তারপর অডিটে দেখলাম LCP &lt;
        1.2s, INP &lt; 50ms, আর CLS = 0.00!
      </Line>

      {/* ── Takeaways ─────────────────────────────────────────────────── */}
      <H2 id="takeaway">Production Takeaways</H2>

      <Note>
        <ul>
          <li>
            <strong>CI/CD Bundle Budgeting:</strong> পাইপলাইনে <code>bundlesize</code> বা
            GitHub Actions যুক্ত করে প্রতিটি PR-এ বান্ডেল নির্দিষ্ট লিমিট (যেমন initial load
            &gt; 200 KB) পার করলে বিল্ড ফেল করানোর কালচার সেট করা উচিত।
          </li>
          <li>
            <strong>INP Priority:</strong> ভারী হাইড্রেশনে মেইন থ্রেড ব্লক হওয়া ঠেকাতে
            অপ্রয়োজনীয় <code>useEffect</code> ও রি-রেন্ডার কমানো আবশ্যক।
          </li>
          <li>
            <strong>Tree-shaking Awareness:</strong> থার্ড-পার্টি প্যাকেজ বেছে নেওয়ার আগে
            bundlephobia-তে চেক করে নিন সেটি ESM tree-shakable কি না।
          </li>
        </ul>
      </Note>
    </article>
  );
}
