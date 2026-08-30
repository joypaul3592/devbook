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
    label: { bn: "First Load JS ৩৮৫ kB", en: "385 kB of First Load JS" },
  },
  {
    id: "architecture",
    label: {
      bn: "Duplicate chunk ভিজ্যুয়ালাইজেশন",
      en: "Duplicate chunk visualization",
    },
  },
  {
    id: "mechanisms",
    label: { bn: "৩টি মূল মেকানিজম", en: "Three core mechanisms" },
  },
  {
    id: "implementation",
    label: {
      bn: "Analyzer সেটআপ ও bundle budget",
      en: "Analyzer setup & bundle budget",
    },
  },
  {
    id: "matrix",
    label: { bn: "Bundle Optimization Metrics", en: "Bundle optimization metrics" },
  },
  {
    id: "takeaway",
    label: { bn: "Production Takeaways", en: "Production takeaways" },
  },
];

export default function ChunkDuplicationProductionBundleBudget() {
  return (
    <article className="doc-prose">
      {/* ── The problem ───────────────────────────────────────────────── */}
      <H2 id="the-problem" anchorOnly>
        First Load JS ৩৮৫ kB
      </H2>

      <p>
        বিকাল ৩:১৫। ভুলু ভাই Vercel-এ অ্যাপ ডেপ্লয় দেওয়ার পর বিল্ড লগে একটি লাল সতর্কবার্তা দেখতে
        পেলেন — <code>First Load JS shared by all: 385 kB</code>। মোবাইলে স্লো 3G-তে টেস্ট করতেই ফার্স্ট
        পেজ ইন্টার‌অ্যাক্টিভ হতে ৪ সেকেন্ডের বেশি সময় লেগে গেল।
      </p>

      <Line name="ভুলু ভাই">
        ফাহিম! আমার তো সিম্পল ড্যাশবোর্ড আর নিউজ অ্যাপ। ক্লায়েন্ট-সাইড First Load JS ৩৮৫ কিলোবাইট
        কীভাবে হলো? ব্যাকগ্রাউন্ডে অতিরিক্ত কোন কোড ঢুকে বসে আছে, কীভাবে বুঝব?
      </Line>

      <Line name="ফাহিম">
        ভুলু ভাই! অনেক সময় আমরা না জেনেই এমন কিছু লাইব্রেরি ইমপোর্ট করে ফেলি যা একই ভারী ডিপেন্ডেন্সির
        একাধিক ভার্সন আলাদা চ্যাঙ্কে ডুপ্লিকেট করে ফেলে (যেমন <code>lodash</code> বনাম{" "}
        <code>lodash-es</code>, অথবা একইসাথে <code>moment</code> ও <code>date-fns</code>)। ফলে বান্ডল
        সাইজ বেলুনের মতো ফুলে ওঠে।
      </Line>

      <Line name="নেক্সট-ভাই">
        একদম! এর প্রাতিষ্ঠানিক সমাধান হলো <code>@next/bundle-analyzer</code> এবং CI/CD পাইপলাইনে
        performance budget constraint সেট করা। অ্যানালাইজার প্রতিটি রুটের ভেতরের চ্যাঙ্ক ভিজ্যুয়ালি
        ম্যাপ করে ডুপ্লিকেট ডিপেন্ডেন্সি দেখিয়ে দেয়। আর বান্ডল বাজেট সেট থাকলে কেউ ভুল করে বড় কোড
        ইমপোর্ট করলে বিল্ড সাথে সাথে ফেল করবে।
      </Line>

      {/* ── Architecture ──────────────────────────────────────────────── */}
      <H2 id="architecture">১. Bundle Bloat &amp; Duplicate Chunks Visualization</H2>

      <Diagram>{`┌─────────────────────────────────────────────────────────────────────────┐
│           BUNDLE BLOAT & DUPLICATE CHUNKS VISUALIZATION                 │
└─────────────────────────────────────────────────────────────────────────┘

 ❌ UNMANAGED PRODUCTION BUNDLE (385 kB First Load JS)
 ┌───────────────────────────────────────────────────────────────────────┐
 │ main chunk (150 kB)  │ route A (120 kB)      │ route B (115 kB)       │
 │  ├── moment.js (70k) │  ├── lodash.js (70k)  │  ├── moment.js (70k)   │
 │  └── icon library    │  └── heavy chart UI   │  └── lodash-es (65k)   │
 └───────────────────────────────────────────────────────────────────────┘
  * result: duplicate moment & lodash modules bundled into client assets

───────────────────────────────────────────────────────────────────────────

 🟢 OPTIMIZED BUNDLE WITH A CI BUDGET (128 kB First Load JS)
 ┌───────────────────────────────────────────────────────────────────────┐
 │ shared commons (65 kB) │ route A (32 kB)     │ route B (31 kB)        │
 │  └── date-fns (tree-shaken)                  │ dynamic chart import   │
 └───────────────────────────────────────────────────────────────────────┘
  * budget enforced: max First Load JS < 150 kB in CI`}</Diagram>

      {/* ── Mechanisms ────────────────────────────────────────────────── */}
      <H2 id="mechanisms">২. Bundle Optimization-এর ৩টি মূল মেকানিজম</H2>

      <p>
        <strong>Visual inspection with @next/bundle-analyzer:</strong> ইন্টার‌অ্যাক্টিভ HTML ট্রিম্যাপের
        সাহায্যে কোন লাইব্রেরিটি বান্ডলের কত শতাংশ জায়গা দখল করছে তা চিহ্নিত করা।
      </p>

      <p>
        <strong>Duplicate dependency elimination:</strong> <code>lodash</code> বা{" "}
        <code>moment</code>-এর মতো মনোলিথিক লাইব্রেরি বাদ দিয়ে tree-shakable ইমপোর্ট বা আধুনিক হালকা
        বিকল্প (<code>date-fns</code>, নেটিভ <code>Intl</code> API) দিয়ে প্রতিস্থাপন করা।
      </p>

      <p>
        <strong>Automated bundle budget guards:</strong> বিল্ড স্টেপে সাইজ লিমিট বা CI অডিটিং সেট করা,
        যাতে First Load JS নির্দিষ্ট লিমিট (যেমন ১৫০ kB) অতিক্রম করলে বিল্ড অটোমেটিক আটকে যায়।
      </p>

      {/* ── Implementation ────────────────────────────────────────────── */}
      <H2 id="implementation">৩. Production Code &amp; Setup Implementation</H2>

      <H3>❌ Anti-pattern — full heavy libraries in a client component</H3>

      <CodeBlock filename="app/dashboard/legacy-card.tsx">{`// 🔴 POOR PRACTICE: pulls huge un-treeshaken libraries into the client bundle
'use client';

// 🔴 anti-pattern: importing all of lodash and moment adds >100 kB to the client chunk
import lodash from 'lodash';
import moment from 'moment';

interface User {
  id: string;
  createdAt: string;
}

export function UnoptimizedDashboardCard({ users }: { users: User[] }) {
  const sortedUsers = lodash.sortBy(users, 'createdAt');
  const formattedDate = moment().format('MMMM Do YYYY');

  return (
    <div className="p-4 bg-slate-900 border rounded">
      <h3>Active users: {sortedUsers.length}</h3>
      <p>Report date: {formattedDate}</p>
    </div>
  );
}`}</CodeBlock>

      <H3>🟢 Production pattern — analyzer config, modular imports, and a budget</H3>

      <CodeBlock filename="next.config.mjs">{`// 🟢 STEP 1: configure the bundle analyzer
import withBundleAnalyzer from '@next/bundle-analyzer';

const bundleAnalyzer = withBundleAnalyzer({
  enabled: process.env.ANALYZE === 'true',
  openAnalyzer: true,
});

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // 🟢 automatically optimize imports for heavy third-party packages
  experimental: {
    optimizePackageImports: ['lucide-react', 'date-fns', 'lodash-es'],
  },
};

export default bundleAnalyzer(nextConfig);`}</CodeBlock>

      <CodeBlock filename="package.json">{`// 🟢 STEP 2: add the analyze script
{
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "analyze": "ANALYZE=true next build"
  }
}`}</CodeBlock>

      <CodeBlock filename="app/dashboard/card.tsx">{`// 🟢 STEP 3: the optimized client component using lightweight alternatives
'use client';

// 🟢 a tree-shaken modular import replacing moment.js
import { format } from 'date-fns';

interface User {
  id: string;
  name: string;
  createdAt: string;
}

export function OptimizedDashboardCard({ users }: { users: User[] }) {
  // 🟢 native array sorting replaces the heavy lodash module
  const sortedUsers = [...users].sort(
    (a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime(),
  );

  // 🟢 a modern date-fns function (~2 kB vs moment's ~70 kB)
  const formattedDate = format(new Date(), 'MMMM do, yyyy');

  return (
    <div className="p-4 bg-slate-900 border border-slate-800 rounded-xl space-y-2">
      <h3 className="text-sm font-semibold text-slate-200">
        Active users: <span className="text-emerald-400">{sortedUsers.length}</span>
      </h3>
      <p className="text-xs font-mono text-slate-400">Report date: {formattedDate}</p>
    </div>
  );
}`}</CodeBlock>

      <CodeBlock filename=".lighthouserc.json">{`// 🟢 STEP 4: a production bundle budget enforced in CI
{
  "ci": {
    "assert": {
      "assertions": {
        "resource-summary:script:size": ["error", { "maxNumericValue": 150000 }],
        "first-contentful-paint": ["error", { "maxNumericValue": 1800 }],
        "interactive": ["error", { "maxNumericValue": 3500 }]
      }
    }
  }
}`}</CodeBlock>

      {/* ── Matrix ────────────────────────────────────────────────────── */}
      <H2 id="matrix">৪. Bundle Optimization Metric Comparison</H2>

      <Table
        head={["প্যাকেজ / মেকানিজম", "পূর্বের সাইজ", "আধুনিক বিকল্প", "ফলাফল"]}
        rows={[
          [
            "তারিখ ফরম্যাটিং",
            <span key="c">
              <code>moment</code> (~৭২ kB gzipped)
            </span>,
            <span key="d">
              <code>date-fns</code> বা <code>Intl.DateTimeFormat</code>
            </span>,
            "৯৫%+ ছোট 🟢",
          ],
          [
            "ইউটিলিটি হেল্পার",
            <span key="c">
              <code>lodash</code> (~৭০ kB gzipped)
            </span>,
            "নেটিভ ES6+ array methods",
            "০ kB 🟢",
          ],
          [
            "আইকন লাইব্রেরি",
            "পুরো প্যাকেজ ইমপোর্ট",
            <code key="d">optimizePackageImports</code>,
            "~৮৫% ছোট 🟢",
          ],
          [
            "First Load JS target",
            "> ৩৫০ kB (ফ্ল্যাগড 🔴)",
            "< ১৫০ kB (বাজেট এনফোর্সড)",
            "ইউজার রিটেনশন বৃদ্ধি ⚡",
          ],
        ]}
      />

      <Line name="ভুলু ভাই">
        দুর্দান্ত ফাহিম! <code>@next/bundle-analyzer</code> রান করার পরই স্পট করতে পারলাম যে{" "}
        <code>moment.js</code> আর পুরো <code>lodash</code> লাইব্রেরি ঢুকে বসেছিল! এগুলো সরিয়ে নেটিভ
        প্র্যাকটিস ফলো করায় First Load JS ৩৮৫ kB থেকে কমে ১০৫ kB-তে নেমে এসেছে।
      </Line>

      {/* ── Takeaways ─────────────────────────────────────────────────── */}
      <H2 id="takeaway">Production Takeaways</H2>

      <Note>
        <ul>
          <li>
            <strong>Run the analyzer before big releases:</strong> প্রোডাকশন ডেপ্লয়ের আগে{" "}
            <code>ANALYZE=true npm run build</code> চালিয়ে ভিজ্যুয়াল ট্রিম্যাপটি পর্যবেক্ষণ করুন।
          </li>
          <li>
            <strong>Prefer native JS APIs first:</strong> ছোট কাজের জন্য এক্সটার্নাল লাইব্রেরি ইমপোর্ট
            করার অভ্যাস বাদ দিন — আধুনিক ব্রাউজারের নেটিভ <code>Intl</code>, <code>fetch</code> ও array
            মেথডগুলো ফাস্ট এবং জিরো বান্ডল কস্টের।
          </li>
          <li>
            <strong>Set up CI/CD performance budgets:</strong> PR মার্জ করার সময় অটোমেটেড বান্ডল সাইজ
            চেকার যুক্ত রাখুন, যাতে টিমের কেউ দুর্ঘটনাবশত বিশাল ফাইল ইমপোর্ট করলে বিল্ড আটকে যায়।
          </li>
        </ul>
      </Note>
    </article>
  );
}
