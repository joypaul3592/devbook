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
      bn: "ডুপ্লিকেট React ও ফুলে ওঠা ইনস্টল",
      en: "Duplicate React and a bloated install",
    },
  },
  {
    id: "architecture",
    label: {
      bn: "sideEffects: false যা আনলক করে",
      en: "What sideEffects: false unlocks",
    },
  },
  {
    id: "pillars",
    label: {
      bn: "অপটিমাইজেশনের ৩টি স্তম্ভ",
      en: "Three pillars of optimization",
    },
  },
  {
    id: "implementation",
    label: {
      bn: "Anti-pattern বনাম optimized package.json",
      en: "Anti-pattern vs optimized package.json",
    },
  },
  {
    id: "matrix",
    label: { bn: "Dependency Type Matrix", en: "Dependency type matrix" },
  },
  {
    id: "takeaway",
    label: { bn: "Production Takeaways", en: "Production takeaways" },
  },
];

export default function PackageJsonOptimization() {
  return (
    <article className="doc-prose">
      {/* ── The problem ───────────────────────────────────────────────── */}
      <H2 id="the-problem" anchorOnly>
        ডুপ্লিকেট React ও ফুলে ওঠা ইনস্টল
      </H2>

      <p>
        বিকাল ৩:৪৫। ভুলু ভাই তার প্রজেক্টে একটি নতুন UI ইউটিলিটি প্যাকেজ বিল্ড করে NPM-এ পাবলিশ
        করেছেন। কিন্তু ইউজাররা কমপ্লেন করছে — প্যাকেজটি ইনস্টল করলেই প্রজেক্টে <code>react</code> ও{" "}
        <code>react-dom</code>-এর ডুপ্লিকেট ইনস্ট্যান্স তৈরি হয়ে অ্যাপ ক্র্যাশ করছে! তাছাড়া{" "}
        <code>package.json</code>-এ <code>typescript</code>, <code>eslint</code>,{" "}
        <code>@types/react</code> সব কিছু <code>dependencies</code>-এর ভেতরে রাখা থাকায় প্রোডাকশন
        সার্ভারের ইনস্টল টাইম বহুগুণ বেড়ে গেছে।
      </p>

      <Line name="ভুলু ভাই">
        ফাহিম! <code>package.json</code>-এর ভেতরে কোনটা <code>dependencies</code> আর কোনটা{" "}
        <code>devDependencies</code>-এ আছে, তাতে বান্ডলার বা প্যাকেজ ম্যানেজারের কী যায় আসে? আর{" "}
        <code>&quot;sideEffects&quot;: false</code> ফিল্ডটাই বা কেন লাইব্রেরি ফাইলগুলোতে ব্যবহার করতে
        বলা হয়?
      </Line>

      <Line name="ফাহিম">
        ভুলু ভাই! <code>package.json</code> হলো আপনার প্রজেক্টের কন্ট্রোল সেন্টার! বিল্ড-টাইম টুল
        (TypeScript বা ESLint)-কে <code>dependencies</code>-এ রেখে দিলে প্রোডাকশন সার্ভারে
        অপ্রয়োজনীয় শত শত MB প্যাকেজ ডাউনলোড হবে। আর লাইব্রেরি পাবলিশ করার সময়{" "}
        <code>peerDependencies</code> ব্যবহার না করলে গ্রাহকের প্রজেক্টে একই লাইব্রেরির ডুপ্লিকেট কপি
        ঢুকে ফ্রেমওয়ার্ক ক্র্যাশ করবে।
      </Line>

      <Line name="নেক্সট-ভাই">
        একদম! এর সাথে সবচেয়ে গুরুত্বপূর্ণ ফিল্ড হলো <code>&quot;sideEffects&quot;: false</code>! এটি
        বান্ডলারকে (Webpack / Turbopack) মেসেজ দেয় — &quot;এই প্যাকেজের কোনো ফাইল ইমপোর্ট করলে গ্লোবাল
        স্কোপের কোনো ক্ষতি হবে না, তাই অনব্যবহৃত ফাইল নির্দ্বিধায় Tree Shake করে ডিলিট করে দাও।&quot;
      </Line>

      {/* ── Architecture ──────────────────────────────────────────────── */}
      <H2 id="architecture">১. How sideEffects: false Empowers Tree-Shaking</H2>

      <Diagram>{`┌─────────────────────────────────────────────────────────────────────────┐
│              TREE-SHAKING BEHAVIOR WITH AND WITHOUT sideEffects         │
└─────────────────────────────────────────────────────────────────────────┘

 ❌ MISSING "sideEffects" FLAG (safe / conservative mode)
 Developer imports: import { Button } from 'my-ui-lib';
 ┌───────────────────────────────────────────────────────────────────────┐
 │ my-ui-lib/src/Card.js (unused)                                        │
 │ ├── Bundler thinks: "What if Card.js touches global CSS or window?"   │
 │ └── Cannot safely drop Card.js from the final bundle!                 │
 └──────────────────────────────────┬────────────────────────────────────┘
                                    │ Unnecessary module included
                                    ▼
                     🔴 BUNDLE BLOAT (unused code shipped)

───────────────────────────────────────────────────────────────────────────

 🟢 WITH "sideEffects": false (aggressive tree-shaking enabled)
 Developer imports: import { Button } from 'my-ui-lib';
 ┌───────────────────────────────────────────────────────────────────────┐
 │ Package declares: "sideEffects": false                                │
 │ ├── Bundler confirms: "No global side effects exist."                 │
 │ └── Prunes Card.js, Modal.js and Table.js completely!                 │
 └──────────────────────────────────┬────────────────────────────────────┘
                                    │ Pure tree-shaken resolution
                                    ▼
                     🟢 LEAN BUNDLE (only Button included)`}</Diagram>

      {/* ── Pillars ───────────────────────────────────────────────────── */}
      <H2 id="pillars">২. package.json অপটিমাইজেশনের ৩টি মূল স্তম্ভ</H2>

      <H3>Dependency categorization</H3>

      <p>
        <code>dependencies</code> — প্রোডাকশন অ্যাপ রান-টাইমে যা সরাসরি প্রয়োজন (<code>next</code>,{" "}
        <code>react</code>, <code>clsx</code>, <code>lucide-react</code>)।{" "}
        <code>devDependencies</code> — শুধুমাত্র ডেভেলপমেন্ট ও বিল্ড-টাইমে প্রয়োজন (
        <code>typescript</code>, <code>@types/node</code>, <code>eslint</code>,{" "}
        <code>tailwindcss</code>, <code>prettier</code>)। <code>peerDependencies</code> — কাস্টম
        লাইব্রেরি তৈরির সময় ব্যবহৃত হয়; এটি নির্দেশ করে &quot;হোস্ট প্রজেক্টে এই লাইব্রেরিটি (যেমন{" "}
        <code>react &gt;= 18</code>) আগে থেকেই ইনস্টল থাকতে হবে, আমি নিজে নতুন কপি ডাউনলোড করব
        না&quot;।
      </p>

      <H3>Side-effects management</H3>

      <p>
        <code>&quot;sideEffects&quot;: false</code> বোঝালে বান্ডলার ধরে নেয় সব ফাইল সাইড-ইফেক্ট ফ্রি
        (pure)। আর <code>{'"sideEffects": ["*.css", "*.scss"]'}</code> ব্যবহার করলে শুধু CSS
        ফাইলগুলোকে সাইড-ইফেক্ট বিশিষ্ট হিসেবে ধরে রাখা হয় (যাতে গ্লোবাল স্টাইল ড্রপ না হয়) এবং বাকি
        সব JS / TS ফাইল Tree Shake হয়।
      </p>

      <H3>Module resolution fields</H3>

      <p>
        আধুনিক প্যাকেজে <code>&quot;main&quot;</code> (CJS)-এর পাশাপাশি <code>&quot;module&quot;</code>{" "}
        (ESM) এবং <code>&quot;exports&quot;</code> ফিল্ড সঠিকভাবে কনফিগার করা থাকলে Bundler সরাসরি ESM
        এন্ট্রি পয়েন্ট খুঁজে পায়।
      </p>

      {/* ── Implementation ────────────────────────────────────────────── */}
      <H2 id="implementation">৩. Production Code Implementation</H2>

      <H3>❌ Anti-pattern — একটি অ্যাপের unoptimized package.json</H3>

      <CodeBlock label="JSON" filename="package.json">{`{
  "name": "my-next-app",
  "version": "1.0.0",
  "scripts": {
    "build": "next build"
  },
  "dependencies": {
    "next": "15.0.0",
    "react": "^19.0.0",
    "react-dom": "^19.0.0",
    "typescript": "^5.0.0",
    "@types/react": "^19.0.0",
    "eslint": "^9.0.0",
    "tailwindcss": "^4.0.0"
  }
}`}</CodeBlock>

      <p>
        সমস্যা: build tools এবং TypeScript types-কে <code>dependencies</code>-এ রাখায় Docker / CI-CD
        কনটেইনারের প্রোডাকশন ইনস্টলেশন সাইজ বিশাল হয়ে যায়।
      </p>

      <H3>🟢 Production pattern — সম্পূর্ণ অপটিমাইজড package.json আর্কিটেকচার</H3>

      <CodeBlock label="JSON" filename="package.json">{`{
  "name": "@my-company/ui-components",
  "version": "1.0.0",
  "description": "High-performance tree-shakeable UI component library",
  "type": "module",
  "main": "./dist/index.cjs",
  "module": "./dist/index.js",
  "types": "./dist/index.d.ts",
  "exports": {
    ".": {
      "types": "./dist/index.d.ts",
      "import": "./dist/index.js",
      "require": "./dist/index.cjs"
    },
    "./styles.css": "./dist/styles.css"
  },
  "sideEffects": [
    "**/*.css"
  ],
  "scripts": {
    "build": "tsup src/index.ts --format cjs,esm --dts",
    "lint": "eslint ."
  },
  "dependencies": {
    "clsx": "^2.1.1",
    "tailwind-merge": "^3.0.0"
  },
  "devDependencies": {
    "@types/node": "^22.0.0",
    "@types/react": "^19.0.0",
    "eslint": "^9.0.0",
    "tailwindcss": "^4.0.0",
    "typescript": "^5.7.0"
  },
  "peerDependencies": {
    "react": "^18.0.0 || ^19.0.0",
    "react-dom": "^18.0.0 || ^19.0.0"
  }
}`}</CodeBlock>

      {/* ── Matrix ────────────────────────────────────────────────────── */}
      <H2 id="matrix">৪. Dependency Type Comparison Matrix</H2>

      <Table
        head={["ডিপেন্ডেন্সি টাইপ", "কোথায় ইনস্টল হয়?", "বান্ডল / রান-টাইম ইম্প্যাক্ট", "সেরা ব্যবহার"]}
        rows={[
          [
            <code key="c">dependencies</code>,
            "Local ও production server",
            "সরাসরি বান্ডলে ঢোকে বা সার্ভারে রান হয়",
            "next, axios, clsx, zustand",
          ],
          [
            <code key="c">devDependencies</code>,
            "শুধু build / dev system",
            <span key="c">
              প্রোডাকশন ইনস্টলেশনে স্কিপ হয় (<code>--omit=dev</code> দিলে)
            </span>,
            "typescript, eslint, vitest, tailwindcss",
          ],
          [
            <code key="c">peerDependencies</code>,
            "Host application level",
            "ডুপ্লিকেট প্যাকেজ তৈরি হওয়া প্রতিরোধ করে",
            "Reusable UI component library (react)",
          ],
          [
            <code key="c">sideEffects</code>,
            "Bundler AST parsing rule",
            "সর্বোচ্চ 🟢 — অনব্যবহৃত ফাইল রিমুভ করতে সাহায্য করে",
            "NPM package ও internal monorepo package",
          ],
        ]}
      />

      <Line name="ভুলু ভাই">
        কনসেপ্ট একদম ক্রিস্টাল ক্লিয়ার! <code>devDependencies</code>-এ টাইপস্ক্রিপ্ট আর বিল্ড টুলস
        পাঠাব, প্যাকেজে <code>{'"sideEffects": ["**/*.css"]'}</code> ব্যবহার করব আর{" "}
        <code>peerDependencies</code> দিয়ে ডুপ্লিকেট রিঅ্যাক্ট এরর বন্ধ করব!
      </Line>

      {/* ── Takeaways ─────────────────────────────────────────────────── */}
      <H2 id="takeaway">Production Takeaways</H2>

      <Note>
        <ul>
          <li>
            <strong>Keep dependencies lean:</strong> প্রোডাকশন রান-টাইমে যেগুলোর বাস্তব অস্তিত্ব
            দরকার শুধু সেগুলোকেই <code>dependencies</code>-এ রাখুন; সব dev tool{" "}
            <code>devDependencies</code>-এ সরান।
          </li>
          <li>
            <strong>Always declare sideEffects in packages:</strong> ইন্টার্নাল monorepo বা NPM
            প্যাকেজ বানানোর সময় <code>&quot;sideEffects&quot;: false</code> (বা নির্দিষ্ট CSS মাস্ক)
            ব্যবহার করা বাধ্যতামূলক — নইলে Tree Shaking কাজ করবে না।
          </li>
          <li>
            <strong>Use peerDependencies for UI libraries:</strong> React কম্পোনেন্ট প্যাকেজ বিল্ড
            করার সময় <code>react</code> ও <code>react-dom</code>-কে <code>peerDependencies</code>-এ
            রাখুন, যাতে ভোক্তা অ্যাপে দুবার React লোড না হয়।
          </li>
        </ul>
      </Note>
    </article>
  );
}
