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
      bn: "১.২ GB node_modules-এর জম্বি প্যাকেজ",
      en: "Zombie packages in a 1.2 GB node_modules",
    },
  },
  {
    id: "architecture",
    label: {
      bn: "Analysis engine যেভাবে স্ক্যান করে",
      en: "How the analysis engine scans",
    },
  },
  {
    id: "tools",
    label: {
      bn: "depcheck বনাম knip",
      en: "depcheck vs knip",
    },
  },
  {
    id: "implementation",
    label: {
      bn: "Knip কনফিগ ও অডিট ওয়ার্কফ্লো",
      en: "Knip config & audit workflow",
    },
  },
  {
    id: "matrix",
    label: { bn: "Analysis Tools Matrix", en: "Analysis tools matrix" },
  },
  {
    id: "takeaway",
    label: { bn: "Production Takeaways", en: "Production takeaways" },
  },
];

export default function DependencyAnalysis() {
  return (
    <article className="doc-prose">
      {/* ── The problem ───────────────────────────────────────────────── */}
      <H2 id="the-problem" anchorOnly>
        ১.২ GB node_modules-এর জম্বি প্যাকেজ
      </H2>

      <p>
        বিকাল ৪:৩০। ভুলু ভাই তার নতুন প্রজেক্টের Docker কনটেইনার বিল্ড করতে গিয়ে দেখলেন —{" "}
        <code>npm install</code> হতেই সাড়ে তিন মিনিট পার হয়ে গেছে এবং <code>node_modules</code>{" "}
        ফোল্ডারের সাইজ প্রায় ১.২ Gigabytes! অথচ তিনি আগে ব্যবহৃত <code>moment</code>,{" "}
        <code>axios</code> ও <code>chart.js</code> ড্রপ করে নেটিভ <code>fetch</code> ও{" "}
        <code>recharts</code>-এ মাইগ্রেট করেছিলেন — কিন্তু পুরনো প্যাকেজগুলো{" "}
        <code>package.json</code>-এ রয়েই গেছে।
      </p>

      <Line name="ভুলু ভাই">
        ফাহিম! কোড রিফ্যাক্টর করার পর প্রজেক্টের কোন কোন NPM প্যাকেজ বা ফাইল এখন সত্যি সত্যি ব্যবহার
        হচ্ছে আর কোনগুলো ডেড কোড (Zombie Dependencies) হিসেবে পড়ে আছে — তা ১,০০০ ফাইলে ম্যানুয়ালি
        খুঁজে বের করব কীভাবে?
      </Line>

      <Line name="ফাহিম">
        ভুলু ভাই! ম্যানুয়ালি সার্চ করা তো খড়ের গাদায় সুই খোঁজার মতো! অ্যাপ বড় হলে এমন শত শত
        অনব্যবহৃত প্যাকেজ, ফাইল এবং <code>export</code> জমতে থাকে, যা CI/CD বিল্ড টাইম বাড়ায় এবং
        সিকিউরিটি অডিট ঝুঁকি তৈরি করে।
      </Line>

      <Line name="নেক্সট-ভাই">
        একদম! এর সমাধান হলো <strong>Automated Dependency Analysis</strong>! <code>depcheck</code> ও
        আধুনিক <code>knip</code>-এর মতো স্ট্যাটিক অ্যানালাইসিস টুল আপনার পুরো AST (Abstract Syntax
        Tree) স্ক্যান করে অব্যবহৃত package, টাইপ, ডুপ্লিকেট ডিপেন্ডেন্সি এবং অনব্যবহৃত ফাইল নিমেষেই
        চিহ্নিত করে ফেলে।
      </Line>

      {/* ── Architecture ──────────────────────────────────────────────── */}
      <H2 id="architecture">১. How the Dependency Analysis Engine Scans Dead Packages</H2>

      <Diagram>{`┌─────────────────────────────────────────────────────────────────────────┐
│               DEPENDENCY AST ANALYSIS & ZOMBIE PRUNING                  │
└─────────────────────────────────────────────────────────────────────────┘

 ❌ UNCLEANED PROJECT (zombie dependencies accumulated)
 package.json: { moment, axios, lodash, recharts, date-fns }
 ┌───────────────────────────────────────────────────────────────────────┐
 │ Codebase references:                                                  │
 │ ├── Uses:   recharts, date-fns                                        │
 │ └── Unused: moment (200KB), axios (50KB), lodash (70KB)               │
 └──────────────────────────────────┬────────────────────────────────────┘
                                    │ Unused packages inflate node_modules
                                    ▼
                 🔴 1.2 GB node_modules & slow CI/CD installs

───────────────────────────────────────────────────────────────────────────

 🟢 AUTOMATED ANALYSIS PIPELINE (knip / depcheck engine)
 ┌───────────────────────────────────────────────────────────────────────┐
 │ npx knip / npx depcheck runs AST import-graph scanning:               │
 │ ├── Entry points: app/**/page.tsx, app/**/layout.tsx                  │
 │ ├── Unused dependency detected ──► moment, axios, lodash              │
 │ └── Unused export detected     ──► formatLegacyDate() in utils.ts     │
 └──────────────────────────────────┬────────────────────────────────────┘
                                    │ Automated cleanup (npm uninstall)
                                    ▼
                 🟢 CLEAN DEPENDENCY TREE (fast CI, smaller audits)`}</Diagram>

      {/* ── Tools ─────────────────────────────────────────────────────── */}
      <H2 id="tools">২. depcheck বনাম knip (টুল নির্বাচন)</H2>

      <H3>depcheck — basic dependency auditor</H3>

      <p>
        এটি শুধুমাত্র <code>package.json</code>-এর <code>dependencies</code> ও{" "}
        <code>devDependencies</code> ফিল্ডের সাথে প্রজেক্টের <code>import</code> / <code>require</code>{" "}
        স্টেটমেন্টগুলো তুলনা করে অব্যবহৃত প্যাকেজের তালিকা তৈরি করে।{" "}
        <strong>সীমাবদ্ধতা:</strong> এটি Next.js App Router-এর বিশেষ এন্ট্রি পয়েন্ট (
        <code>page.tsx</code>, <code>layout.tsx</code>, <code>loading.tsx</code>) এবং ইন্টার্নাল
        অনব্যবহৃত ফাইল বা <code>export</code> চিহ্নিত করতে পারে না।
      </p>

      <H3>knip — advanced Next.js ও TypeScript specialist</H3>

      <p>
        আধুনিক ফ্রন্টএন্ডের জন্য সবচেয়ে শক্তিশালী টুল। এটি শুধু unused package ধরে না, বরং —{" "}
        <strong>Unused files:</strong> প্রজেক্টের যেসব ফাইল কোথাও ইমপোর্ট করা হয়নি।{" "}
        <strong>Unused exports / types:</strong> কোনো ফাইলের যেসব ফাংশন বা TypeScript interface
        অব্যবহৃত। <strong>Plugin architecture:</strong> Next.js, Tailwind, ESLint, PostCSS ইত্যাদির
        ডাইনামিক এন্ট্রি পয়েন্টগুলো স্বয়ংক্রিয়ভাবে ডিটেক্ট করে।
      </p>

      {/* ── Implementation ────────────────────────────────────────────── */}
      <H2 id="implementation">৩. Production Code Implementation</H2>

      <H3>❌ Anti-pattern — জম্বি প্যাকেজ ও জমে থাকা ডেড export</H3>

      <CodeBlock label="JSON" filename="package.json">{`// 🔴 POOR PRACTICE: package.json cluttered with forgotten dependencies
{
  "name": "my-next-app",
  "dependencies": {
    "next": "15.0.0",
    "react": "^19.0.0",
    "react-dom": "^19.0.0",
    "axios": "^1.7.0",       // 🔴 Zombie: replaced by native fetch()
    "moment": "^2.30.0",     // 🔴 Zombie: replaced by date-fns
    "lodash": "^4.17.21"     // 🔴 Zombie: replaced by plain JS utilities
  }
}`}</CodeBlock>

      <CodeBlock filename="utils/formatting.ts">{`// 🔴 POOR PRACTICE: dead exports accumulating in the codebase

export function activeDateFormatter(date: Date) {
  return date.toISOString();
}

// 🔴 Dead code: no component imports this function any more
export function legacyMomentConverter(dateStr: string) {
  return new Date(dateStr).getTime();
}`}</CodeBlock>

      <H3>🟢 Production pattern — Knip কনফিগ ও অটোমেটেড অডিট</H3>

      <CodeBlock label="JSON" filename="knip.json">{`// 🟢 STEP 1: configure knip.json at the project root
{
  "$schema": "https://unpkg.com/knip@5/schemas/jsonconfig.json",
  "entry": [
    "app/**/page.{js,jsx,ts,tsx}",
    "app/**/layout.{js,jsx,ts,tsx}",
    "app/**/loading.{js,jsx,ts,tsx}",
    "app/**/error.{js,jsx,ts,tsx}",
    "app/api/**/route.{js,jsx,ts,tsx}",
    "next.config.ts"
  ],
  "project": [
    "app/**/*.{js,jsx,ts,tsx}",
    "components/**/*.{js,jsx,ts,tsx}",
    "utils/**/*.{js,jsx,ts,tsx}"
  ],
  "ignoreDependencies": [
    "sharp"
  ]
}`}</CodeBlock>

      <CodeBlock label="JSON" filename="package.json">{`// 🟢 STEP 2: add the audit scripts
{
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "lint:deps": "knip",
    "lint:deps:quick": "depcheck"
  },
  "devDependencies": {
    "knip": "^5.40.0",
    "depcheck": "^1.4.7"
  }
}`}</CodeBlock>

      <CodeBlock label="Bash" filename="audit.sh">{`# 🟢 STEP 3: run the automated audit
npm run lint:deps

# Output:
# Unused dependencies (3)
#  - axios
#  - moment
#  - lodash
#
# Unused exports (1)
#  - legacyMomentConverter (utils/formatting.ts)`}</CodeBlock>

      {/* ── Matrix ────────────────────────────────────────────────────── */}
      <H2 id="matrix">৪. Dependency Analysis Tools Matrix</H2>

      <Table
        head={["ফিচার", "Manual searching", "depcheck", "knip (recommended)"]}
        rows={[
          ["Unused NPM packages", "ধীর ও ভুলের ঝুঁকি 🔴", "হ্যাঁ 🟢", "হ্যাঁ 🟢"],
          ["Unused project files", "না ❌", "না ❌", "হ্যাঁ 🟢"],
          ["Unused exports ও types", "না ❌", "না ❌", "হ্যাঁ 🟢"],
          [
            "Next.js App Router support",
            "না ❌",
            "সীমিত ⚠️",
            "সম্পূর্ণ ফার্স্ট-ক্লাস ⚡",
          ],
          ["CI/CD integration", "অসম্ভব ❌", "খুব দ্রুত ⚡", "সূক্ষ্ম ও দ্রুত ⚡"],
        ]}
      />

      <Line name="ভুলু ভাই">
        ফাটাফাটি! <code>knip</code> ইনস্টল করে এক কমান্ডেই ৩টি ডেড প্যাকেজ এবং ২টি অব্যবহৃত ফাইল ধরে
        ফেললাম! <code>npm uninstall</code> মেরে মুহূর্তে <code>node_modules</code>-এর ৫০০ MB ঝরিয়ে
        ফেলেছি।
      </Line>

      {/* ── Takeaways ─────────────────────────────────────────────────── */}
      <H2 id="takeaway">Production Takeaways</H2>

      <Note>
        <ul>
          <li>
            <strong>Run knip before a major release:</strong> প্রোডাকশন রিলিজের আগে প্রজেক্ট থেকে ডেড
            কোড ও অনব্যবহৃত প্যাকেজ সাফ করতে <code>knip</code> চালান।
          </li>
          <li>
            <strong>Integrate with CI/CD gateways:</strong> GitHub Actions বা GitLab CI-তে{" "}
            <code>npx knip</code> যুক্ত করুন, যেন কেউ অনব্যবহৃত প্যাকেজ নিয়ে PR ওপেন করতে না পারে।
          </li>
          <li>
            <strong>Clean up before bundle optimization:</strong> বান্ডল অপটিমাইজেশনের প্রথম শর্ত হলো
            ডিপেন্ডেন্সি ট্রি পরিষ্কার করা — যে কোড অ্যাপে ব্যবহারই হচ্ছে না, তার সাইজ কমানোর কোনো
            অর্থ নেই।
          </li>
        </ul>
      </Note>
    </article>
  );
}
