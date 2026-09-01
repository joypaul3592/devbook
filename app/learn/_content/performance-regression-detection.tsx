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
      bn: "২ দিন পর জানা গেল সাইট স্লো",
      en: "Two days late to a slowdown",
    },
  },
  {
    id: "architecture",
    label: {
      bn: "Regression detection পাইপলাইন",
      en: "The regression detection pipeline",
    },
  },
  {
    id: "mechanisms",
    label: { bn: "৪টি আর্কিটেকচারাল কনসেপ্ট", en: "Four architectural concepts" },
  },
  {
    id: "implementation",
    label: {
      bn: "Performance budget ও CI গার্ড",
      en: "Performance budgets & a CI guard",
    },
  },
  {
    id: "matrix",
    label: { bn: "Shift-Left vs Post-Deployment", en: "Shift-left vs post-deployment" },
  },
  {
    id: "takeaway",
    label: { bn: "Production Takeaways", en: "Production takeaways" },
  },
];

export default function PerformanceRegressionDetection() {
  return (
    <article className="doc-prose">
      {/* ── The problem ───────────────────────────────────────────────── */}
      <H2 id="the-problem" anchorOnly>
        ২ দিন পর জানা গেল সাইট স্লো
      </H2>

      <p>
        বিকাল ৪:২০। নতুন ফিচার ডেপ্লয় করার পর টিম খুব খুশি! কিন্তু ২ দিন পর দেখা গেল ইউজার রিটেনশন ১০%
        ড্রপ করেছে। সার্চ কনসোলে দেখা যাচ্ছে অর্গানিক ট্রাফিক কমেছে, কারণ পেজের LCP ২.১ সেকেন্ড থেকে
        বেড়ে হঠাৎ ৪.৫ সেকেন্ড হয়ে গেছে! ভুলু ভাই বুঝতে পারছেন না কোন কমিটের কারণে এটা হলো।
      </p>

      <Line name="ভুলু ভাই">
        ফাহিম! নতুন কোড ডেপ্লয় করার পর অ্যাপ যে স্লো হয়ে গেছে, সেটা আমরা ২ দিন পর কেন টের পেলাম? কোড
        মার্জ করার সময়ই কি অটোমেটিক ধরা সম্ভব ছিল না?
      </Line>

      <Line name="ফাহিম">
        ভুলু ভাই! কোডের কোনো চেঞ্জের কারণে স্পিড স্লো হয়ে যাওয়াকে বলে performance regression। আর
        আগেভাগে আটকানোর সিস্টেমকে বলা হয় performance regression detection! CI/CD পাইপলাইনে Lighthouse
        CI বা bundle size guard বসিয়ে দিলে PR মার্জ করার আগেই ধরা পড়ে যাবে।
      </Line>

      <Line name="নেক্সট-ভাই">
        একদম! এটি দুই ভাবে কাজ করে — <strong>shift-left</strong> (PR-এ ব্লকিং চেক) এবং{" "}
        <strong>post-deployment monitoring</strong> (রিলিজের পর baseline বনাম নতুন রিলিজ তুলনা)।
        দুটোই দরকার, কারণ ল্যাব চেক সব রিগ্রেশন ধরতে পারে না।
      </Line>

      {/* ── Architecture ──────────────────────────────────────────────── */}
      <H2 id="architecture">১. Performance Regression Detection Pipeline</H2>

      <Diagram>{`┌─────────────────────────────────────────────────────────────────────────────┐
│               PERFORMANCE REGRESSION DETECTION PIPELINE                     │
└─────────────────────────────────────────────────────────────────────────────┘

 [1] developer opens a pull request
   │
   ▼
 [2] CI pipeline runs
 ┌───────────────────────────────────────────────────────────────────────────┐
 │ step A: build + bundle size analysis                                      │
 │   └─ JS bundle grew by more than 50 KB?      ❌ fail the PR                │
 │ step B: Lighthouse CI against the preview URL                             │
 │   └─ LCP > 2.5s, or performance score < 90?  ❌ fail the PR                │
 └────────────────────────────────────┬──────────────────────────────────────┘
                                      ▼ 🟢 every budget met
 [3] merged and deployed
   │
   ▼
 [4] post-deployment monitoring (RUM / APM)
   ├─ compare release v1.1 against v1.2
   └─ p95 latency up more than 20%? ──► rollback alert 🚨`}</Diagram>

      {/* ── Mechanisms ────────────────────────────────────────────────── */}
      <H2 id="mechanisms">২. কোর আর্কিটেকচারাল কনসেপ্ট</H2>

      <p>
        <strong>Performance budgets:</strong> টিমের জন্য কিছু কঠোর সীমা সেট করে দেওয়া — &quot;প্রথম
        পেজের JS বান্ডেল ১৭০ KB-র বেশি হতে পারবে না&quot;, &quot;Lighthouse score ৯০-এর নিচে নামবে
        না&quot;, &quot;LCP ২.৫ সেকেন্ডের বেশি হবে না&quot;। বাজেট না থাকলে রিগ্রেশন মাপার কোনো
        রেফারেন্সই থাকে না।
      </p>

      <p>
        <strong>Shift-left testing:</strong> স্লো-ডাউন প্রোডাকশনে যাওয়ার পর না ধরে, বিল্ড বা PR
        স্টেজেই আটকে দেওয়া — যখন ঠিক করার খরচ সবচেয়ে কম এবং কোনো ইউজার ক্ষতিগ্রস্ত হয়নি।
      </p>

      <p>
        <strong>Bundle size regression:</strong> ভুলবশত কোনো বড় লাইব্রেরি (পুরো <code>lodash</code>{" "}
        বা <code>moment</code>) ক্লায়েন্ট বান্ডেলে ইমপোর্ট করলে লোডিং স্লো হয়ে যায়। bundle guard এই
        নীরব বৃদ্ধি ধরে ফেলে।
      </p>

      <p>
        <strong>Statistical baseline comparison:</strong> নতুন ভার্সন আপ করার পর আগের ৭ দিনের ডাটার
        (p95 latency, Core Web Vitals) সাথে নতুন রিলিজের পার্সেন্টাইল তুলনা করে রিগ্রেশন শনাক্ত করা।
      </p>

      {/* ── Implementation ────────────────────────────────────────────── */}
      <H2 id="implementation">৩. Production Code Implementation</H2>

      <H3>❌ Anti-pattern — monolithic imports in the client bundle</H3>

      <CodeBlock filename="components/dashboard.tsx">{`// 🔴 POOR PRACTICE: importing whole libraries into the browser bundle
'use client';

// ❌ these two alone can add 300 KB+ to the first load,
// silently wrecking LCP and INP with nobody noticing
import lodash from 'lodash';
import moment from 'moment';

interface Row { date: string }

export default function UnoptimizedDashboard({ data }: { data: Row[] }) {
  const sorted = lodash.sortBy(data, 'date');
  const formattedDate = moment().format('MMMM Do YYYY');

  return <div>{formattedDate} — items: {sorted.length}</div>;
}`}</CodeBlock>

      <H3>🟢 Production pattern — budgets enforced in CI</H3>

      <p>
        <strong>Step 1 — bundle analyzer ও import অপটিমাইজেশন।</strong>
      </p>

      <CodeBlock filename="next.config.mjs">{`// 🟢 PRODUCTION PATTERN: make bundle growth visible and bounded
import nextBundleAnalyzer from '@next/bundle-analyzer';

const withBundleAnalyzer = nextBundleAnalyzer({
  enabled: process.env.ANALYZE === 'true',
});

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,

  // 🟢 rewrites barrel imports into deep imports, so only what you use ships
  experimental: {
    optimizePackageImports: ['lucide-react', 'lodash-es'],
  },
};

export default withBundleAnalyzer(nextConfig);`}</CodeBlock>

      <p>
        <strong>Step 2 — Lighthouse বাজেট কনফিগ।</strong>
      </p>

      <CodeBlock filename=".lighthouserc.json">{`{
  "ci": {
    "collect": {
      "numberOfRuns": 3,
      "startServerCommand": "npm run start",
      "url": ["http://localhost:3000/", "http://localhost:3000/products"]
    },
    "assert": {
      "assertions": {
        "categories:performance": ["error", { "minScore": 0.9 }],
        "first-contentful-paint": ["error", { "maxNumericValue": 1800 }],
        "largest-contentful-paint": ["error", { "maxNumericValue": 2500 }],
        "cumulative-layout-shift": ["error", { "maxNumericValue": 0.1 }],
        "resource-summary:script:size": ["error", { "maxNumericValue": 170000 }]
      }
    },
    "upload": { "target": "temporary-public-storage" }
  }
}`}</CodeBlock>

      <p>
        <strong>Step 3 — CI regression গার্ড।</strong>
      </p>

      <CodeBlock filename=".github/workflows/perf-guard.yml">{`name: Performance Regression Guard

on:
  pull_request:
    branches: [main]

jobs:
  performance-check:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: 'npm'

      - run: npm ci
      - run: npm run build

      # lhci exits non-zero when an assertion fails, which fails the job
      # (pair this with a required status check to actually block the merge)
      - name: Run Lighthouse CI budget assertions
        env:
          LHCI_GITHUB_APP_TOKEN: \${{ secrets.LHCI_GITHUB_APP_TOKEN }}
        run: |
          npm install -g @lhci/cli
          lhci autorun`}</CodeBlock>

      <p>
        <strong>Step 4 — tree-shakable ও lazy কোড।</strong>
      </p>

      <CodeBlock filename="components/dashboard.tsx">{`// 🟢 PRODUCTION PATTERN: small imports, deferred heavy components
'use client';

import dynamic from 'next/dynamic';
import { format } from 'date-fns'; // 🟢 tree-shakable, a fraction of moment's size

// the chart library never enters the initial bundle
const HeavyChart = dynamic(() => import('@/components/heavy-chart'), {
  loading: () => <div className="h-64 bg-gray-100 animate-pulse rounded" />,
  ssr: false,
});

interface Row { date: string }

export default function OptimizedDashboard({ data }: { data: Row[] }) {
  return (
    <div className="space-y-4">
      <h2>Dashboard date: {format(new Date(), 'PP')}</h2>
      <HeavyChart data={data} />
    </div>
  );
}`}</CodeBlock>

      {/* ── Matrix ────────────────────────────────────────────────────── */}
      <H2 id="matrix">৪. Shift-Left vs Post-Deployment</H2>

      <Table
        head={["বৈশিষ্ট্য", "Shift-left CI checking", "Post-deployment monitoring"]}
        rows={[
          ["কখন", "PR মার্জ ও ডেপ্লয়ের আগে 🟢", "কোড ইউজারের কাছে যাওয়ার পর"],
          [
            "টুল",
            "Lighthouse CI, bundle analyzer, Playwright",
            "RUM, OpenTelemetry APM, Datadog",
          ],
          [
            "ক্যাচ করার ধরন",
            "ল্যাব কন্ডিশনে বাজেট ফেল করলে PR ব্লক",
            "আসল ডিভাইসে স্লো-ডাউন মেট্রিক",
          ],
          [
            "ব্যবসায়িক প্রভাব",
            "শূন্য — কোনো ইউজার ক্ষতিগ্রস্ত হয় না 🟢",
            "সাময়িক ইউজার ড্রপ, তারপর অ্যালার্ট 🟡",
          ],
        ]}
      />

      <Line name="ভুলু ভাই">
        কনসেপ্ট পুরোপুরি পরিষ্কার ফাহিম! Lighthouse CI আর bundle analyzer সেট করা থাকলে এখন থেকে কেউ
        স্লো কোড বা ভারী লাইব্রেরি পুশ করলে PR মার্জই হবে না — রিগ্রেশন প্রোডাকশনে যাওয়ার আগেই ব্লক!
      </Line>

      {/* ── Takeaways ─────────────────────────────────────────────────── */}
      <H2 id="takeaway">Production Takeaways</H2>

      <Note>
        <ul>
          <li>
            <strong>Set hard budgets early:</strong> প্রজেক্টের শুরুতেই Lighthouse score ও maximum
            bundle size ফিক্স করে CI-তে এনফোর্স করুন — পরে যোগ করতে গেলে সব PR-ই ফেল করবে।
          </li>
          <li>
            <strong>Never import monolithic libraries on the client:</strong> <code>moment</code>-এর
            জায়গায় <code>date-fns</code>, আর ভারী মডিউল <code>next/dynamic</code> দিয়ে lazy load
            করান।
          </li>
          <li>
            <strong>Make the check required:</strong> ওয়ার্কফ্লো ফেল করা যথেষ্ট নয় — GitHub-এ required
            status check হিসেবে সেট না করলে মার্জ আটকাবে না।
          </li>
        </ul>
      </Note>
    </article>
  );
}
