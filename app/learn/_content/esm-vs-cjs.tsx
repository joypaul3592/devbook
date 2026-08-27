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
      bn: "একটি require(), ১৫০ KB বাড়তি",
      en: "One require(), 150 KB heavier",
    },
  },
  {
    id: "architecture",
    label: {
      bn: "Module loading ও bundler এক্সিকিউশন",
      en: "Module loading & bundler execution",
    },
  },
  {
    id: "differences",
    label: {
      bn: "৩টি মৌলিক পার্থক্য",
      en: "Three fundamental differences",
    },
  },
  {
    id: "implementation",
    label: {
      bn: "Anti-pattern বনাম Strict ESM",
      en: "Anti-pattern vs strict ESM",
    },
  },
  {
    id: "matrix",
    label: { bn: "Feature Matrix", en: "Feature matrix" },
  },
  {
    id: "takeaway",
    label: { bn: "Production Takeaways", en: "Production takeaways" },
  },
];

export default function EsmVsCjs() {
  return (
    <article className="doc-prose">
      {/* ── The problem ───────────────────────────────────────────────── */}
      <H2 id="the-problem" anchorOnly>
        একটি require(), ১৫০ KB বাড়তি
      </H2>

      <p>
        দুপুর ১২:১৫। ভুলু ভাই তার প্রজেক্টে একটি পুরনো পেমেন্ট গেটওয়ে SDK ইমপোর্ট করেছেন{" "}
        <code>const gateway = require(&apos;legacy-payment-sdk&apos;)</code> দিয়ে। সব কোড ঠিকঠাক কাজ
        করলেও বিল্ড পারফরম্যান্স চেক করে দেখলেন — অ্যাপ্লিকেশনের জাভাস্ক্রিপ্ট বান্ডলে প্রচুর{" "}
        <code>__webpack_require__</code> ও <code>module.exports</code> র‍্যাপার তৈরি হয়েছে এবং
        বান্ডল সাইজ অন্তত ১৫০ KB বেড়ে গেছে।
      </p>

      <Line name="ভুলু ভাই">
        ফাহিম! <code>import</code> দিয়ে কোড লিখলেও কাজ করে, আবার <code>require()</code> দিয়ে
        ইমপোর্ট করলেও তো কাজ একই হচ্ছে। কিন্তু <code>require()</code> ব্যবহার করতেই বান্ডল সাইজ
        এতটা ফুলে-ফেঁপে উঠল কেন? বান্ডলার পেছনে কী এমন করছে?
      </Line>

      <Line name="ফাহিম">
        ভুলু ভাই! <strong>CommonJS (CJS)</strong> এবং <strong>ECMAScript Modules (ESM)</strong> — এই
        দুটো মডিউল সিস্টেমের কাজ এক হলেও ব্যাকগ্রাউন্ড আর্কিটেকচার সম্পূর্ণ বিপরীত! CJS ডিজাইন করা
        হয়েছিল ২০০৯ সালে Node.js সার্ভার-সাইডের জন্য, যেখানে ফাইল সিস্টেম থেকে সিঙ্ক্রোনাসভাবে{" "}
        <code>require()</code> কল হতো। আর ESM হলো আধুনিক ব্রাউজার ও জাভাস্ক্রিপ্টের অফিসিয়াল
        স্ট্যান্ডার্ড, যা বিল্ড-টাইমে স্ট্যাটিকভাবে বিশ্লেষণ করা যায়।
      </Line>

      <Line name="নেক্সট-ভাই">
        একদম! CJS মডিউল রান-টাইমে এক্সিকিউট হয়, তাই Bundler (Turbopack বা Webpack) বাধ্য হয়ে পুরো
        ফাইলকে একটি অতিরিক্ত ফাংশন র‍্যাপার দিয়ে মুড়ে দেয়। এতে <strong>Scope Hoisting</strong> ফেইল
        করে এবং বান্ডলের সাইজ অনেক বেড়ে যায়। এর সাথে যোগ হয়{" "}
        <strong>Dual Package Hazard</strong>।
      </Line>

      {/* ── Architecture ──────────────────────────────────────────────── */}
      <H2 id="architecture">১. Module Loading ও Bundler Execution Pipeline</H2>

      <Diagram>{`┌─────────────────────────────────────────────────────────────────────────┐
│                     CJS VS. ESM BUNDLE EXECUTION                        │
└─────────────────────────────────────────────────────────────────────────┘

 ❌ COMMONJS (CJS) PIPELINE — Dynamic & Runtime Encapsulated
 ┌───────────────────────────────────────────────────────────────────────┐
 │ require('./math') ──► Runtime Function Call                           │
 │                           │                                           │
 │                           ▼                                           │
 │ Bundler output: wrapped in a __webpack_require__ wrapper function     │
 │ 🔴 Scope Hoisting blocked!                                            │
 │ 🔴 Tree Shaking impossible!                                           │
 └───────────────────────────────────────────────────────────────────────┘

───────────────────────────────────────────────────────────────────────────

 🟢 ESM PIPELINE — Static Analysis & Scope Hoisting
 ┌───────────────────────────────────────────────────────────────────────┐
 │ import { add } from './math' ──► Static AST parsing at build time     │
 │                           │                                           │
 │                           ▼                                           │
 │ Bundler output: flattened directly into the shared scope              │
 │ 🟢 Scope hoisted (zero wrapper functions)                             │
 │ 🟢 Only the add() function remains in the output                      │
 └───────────────────────────────────────────────────────────────────────┘`}</Diagram>

      {/* ── Differences ───────────────────────────────────────────────── */}
      <H2 id="differences">২. ESM ও CJS-এর ৩টি মৌলিক পার্থক্য</H2>

      <p>
        <strong>Static vs dynamic parsing (বিল্ড-টাইম বনাম রান-টাইম):</strong> ESM-এর{" "}
        <code>import</code> ও <code>export</code> স্টেটমেন্ট ফাইলের একদম টপ-লেভেলে থাকতে হয় —
        রান-টাইম কন্ডিশনের ভেতরে রাখা যায় না। এই সীমাবদ্ধতার কারণেই Bundler ফাইল না চালিয়েই
        স্ট্যাটিকভাবে পুরো ডিপেন্ডেন্সি গ্রাফ তৈরি করতে পারে। অপরদিকে CJS-এর <code>require()</code>{" "}
        কোডের যেকোনো স্থানে ডাইনামিক্যালি কল করা যায়।
      </p>

      <p>
        <strong>Scope hoisting (ফাংশন র‍্যাপার দূর করা):</strong> ESM ব্যবহার করলে Bundler সব
        মডিউলের কোডকে একটিমাত্র স্কোপে ইনলাইন করে ফেলে। কিন্তু CJS-এর ক্ষেত্রে প্রতিটি মডিউলকে একটি
        আলাদা ক্লোজার/ফাংশনের ভেতরে রাখতে হয়, যা boilerplate overhead বাড়িয়ে দেয়।
      </p>

      <p>
        <strong>Dual package hazard (দ্বৈত ইনস্ট্যান্স সমস্যা):</strong> প্রজেক্টে একই লাইব্রেরির ESM
        ভার্সন (<code>import</code>) এবং CJS ভার্সন (<code>require</code>) ভুলবশত মিশিয়ে ফেললে
        Bundler সেটিকে দুটি আলাদা মডিউল ভেবে দুবার বান্ডলে ইনক্লুড করবে। এতে বান্ডল সাইজ দ্বিগুণ
        হওয়ার পাশাপাশি মেমোরিতে মডিউল স্টেটও ডুপ্লিকেট হয়ে যায়।
      </p>

      {/* ── Implementation ────────────────────────────────────────────── */}
      <H2 id="implementation">৩. Production Code Implementation</H2>

      <H3>❌ Anti-pattern — আধুনিক Next.js কোডে CJS require মেশানো</H3>

      <CodeBlock filename="utils/paymentProcessor.ts">{`// 🔴 POOR PRACTICE: injecting a CJS require inside a modern ESM file

// 🔴 Anti-pattern 1: a synchronous runtime require breaks static AST optimization
const legacyCrypto = require('crypto-js');

export function encryptPayload(data: object) {
  // 🔴 Anti-pattern 2: CJS forces the bundler to include the ENTIRE crypto-js library
  const jsonString = JSON.stringify(data);
  return legacyCrypto.AES.encrypt(jsonString, 'secret-key-123').toString();
}`}</CodeBlock>

      <CodeBlock filename="components/LegacyPaymentForm.tsx">{`'use client';

// 🔴 Mixing a CJS require into a client component creates heavy runtime wrappers
const { encryptPayload } = require('@/utils/paymentProcessor');

export function LegacyPaymentForm() {
  const handlePay = () => {
    const hash = encryptPayload({ amount: 500 });
    console.log('Encrypted:', hash);
  };

  return (
    <button onClick={handlePay} className="px-4 py-2 bg-red-600 text-white rounded">
      Pay Now (CJS bloated)
    </button>
  );
}`}</CodeBlock>

      <H3>🟢 Production pattern — ১০০% strict ESM ও modular import</H3>

      <CodeBlock filename="utils/paymentProcessor.ts">{`// 🟢 PRODUCTION PATTERN: clean ESM exports and modular imports

// 🟢 Standard ESM imports (allow scope hoisting and tree shaking)
import AES from 'crypto-js/aes';
import Utf8 from 'crypto-js/enc-utf8';

export function encryptPayload(data: object): string {
  const jsonString = JSON.stringify(data);
  return AES.encrypt(jsonString, 'secret-key-123').toString();
}

export function decryptPayload(ciphertext: string): object {
  const bytes = AES.decrypt(ciphertext, 'secret-key-123');
  const decryptedData = bytes.toString(Utf8);
  return JSON.parse(decryptedData);
}`}</CodeBlock>

      <CodeBlock filename="components/OptimizedPaymentForm.tsx">{`'use client';

// 🟢 Native ESM static import
import { encryptPayload } from '@/utils/paymentProcessor';

export function OptimizedPaymentForm() {
  const handlePay = () => {
    const hash = encryptPayload({ amount: 500 });
    console.log('Encrypted payload cleanly:', hash);
  };

  return (
    <div className="p-4 bg-slate-900 border border-slate-800 rounded-xl space-y-3">
      <h3 className="text-sm font-semibold text-slate-200">ESM Payment Gateway</h3>
      <button
        onClick={handlePay}
        className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white font-medium text-sm rounded-lg transition-colors"
      >
        Pay Now (ESM optimized)
      </button>
      <p className="text-xs text-slate-400">
        Scope hoisted, with 0% runtime CJS wrapper overhead.
      </p>
    </div>
  );
}`}</CodeBlock>

      {/* ── Matrix ────────────────────────────────────────────────────── */}
      <H2 id="matrix">৪. ESM vs CommonJS Feature Matrix</H2>

      <Table
        head={["ফিচার", "ESM (import / export)", "CommonJS (require / exports)"]}
        rows={[
          ["Parsing time", "Static — বিল্ড-টাইম", "Dynamic — রান-টাইম"],
          ["Tree shaking", "সম্ভব 🟢", "অসম্ভব ❌"],
          ["Scope hoisting", "সম্ভব 🟢", "অসম্ভব — wrapper function আবশ্যক ❌"],
          ["Top-level await", "সাপোর্টেড 🟢", "সাপোর্টেড নয় ❌"],
          [
            "Next.js 15 support",
            "ফার্স্ট-ক্লাস স্ট্যান্ডার্ড ⚡",
            "শুধু legacy compatibility mode",
          ],
          [
            "আধুনিক ব্রাউজারে ডিফল্ট",
            <span key="c">
              হ্যাঁ — <code>{'<script type="module">'}</code>
            </span>,
            "না — Browserify / Webpack polyfill দরকার",
          ],
        ]}
      />

      <Line name="ভুলু ভাই">
        ক্লিয়ার! তার মানে <code>require()</code> ব্যবহার করলে বান্ডলার ফাংশন র‍্যাপার তৈরি করে সাইজ
        বাড়ায় এবং Scope Hoisting নষ্ট করে। তাই ফ্রন্টএন্ড কোডে সবসময় বিশুদ্ধ ESM{" "}
        <code>import</code> / <code>export</code> ব্যবহার করাই বেস্ট প্র্যাকটিস!
      </Line>

      {/* ── Takeaways ─────────────────────────────────────────────────── */}
      <H2 id="takeaway">Production Takeaways</H2>

      <Note>
        <ul>
          <li>
            <strong>Avoid require() in front-end code:</strong> Next.js বা React প্রজেক্টে{" "}
            <code>require()</code> ব্যবহার করবেন না — এটি বান্ডলারের Scope Hoisting পুরোপুরি অকেজো
            করে দেয়।
          </li>
          <li>
            <strong>Check package exports in package.json:</strong> থার্ড-পার্টি প্যাকেজ ব্যবহারের
            আগে দেখে নিন তার <code>package.json</code>-এ <code>&quot;module&quot;</code> বা{" "}
            <code>&quot;exports&quot;</code> ফিল্ডে ESM সাপোর্ট আছে কি না।
          </li>
          <li>
            <strong>Prefer ESM-first dual builds:</strong> নিজে প্যাকেজ তৈরি করলে{" "}
            <code>tsup</code> বা <code>rollup</code> দিয়ে ইমিট করার সময় ESM-কে ফার্স্ট-প্রায়োরিটি
            ফরম্যাট হিসেবে আউটপুট দিন।
          </li>
        </ul>
      </Note>
    </article>
  );
}
