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
      bn: "একটি ফাংশন, ২.৪ MB বান্ডল",
      en: "One function, a 2.4 MB bundle",
    },
  },
  {
    id: "architecture",
    label: {
      bn: "Static Analysis পাইপলাইন",
      en: "The static analysis pipeline",
    },
  },
  {
    id: "failures",
    label: {
      bn: "Tree Shaking ফেইল করার ৩টি কারণ",
      en: "Three reasons tree shaking fails",
    },
  },
  {
    id: "implementation",
    label: {
      bn: "Anti-pattern বনাম Production প্যাটার্ন",
      en: "Anti-pattern vs production pattern",
    },
  },
  {
    id: "matrix",
    label: { bn: "Code Pattern Matrix", en: "Code pattern matrix" },
  },
  {
    id: "takeaway",
    label: { bn: "Production Takeaways", en: "Production takeaways" },
  },
];

export default function TreeShakingDeadCodeElimination() {
  return (
    <article className="doc-prose">
      {/* ── The problem ───────────────────────────────────────────────── */}
      <H2 id="the-problem" anchorOnly>
        একটি ফাংশন, ২.৪ MB বান্ডল
      </H2>

      <p>
        সকাল ১০:৩০। ভুলু ভাই তার নতুন Next.js প্রজেক্টের প্রোডাকশন বিল্ড দিয়েছেন। বিল্ড শেষ হতেই
        টার্মিনালে চোখ কপালে ওঠার জোগাড় — একটি সাধারণ ল্যান্ডিং পেজের JavaScript বান্ডল সাইজ
        দাঁড়িয়েছে ২.৪ Megabytes! অথচ তিনি পুরো প্রোজেক্টে একটি ২০০ লাইনের হেলপার লাইব্রেরি থেকে
        মাত্র ১টি ডেট-ফরম্যাটিং ফাংশন ইমপোর্ট করেছিলেন।
      </p>

      <Line name="ভুলু ভাই">
        ফাহিম! আমি তো বিশাল লাইব্রেরির ১টি মাত্র ফাংশন ইমপোর্ট করেছি, বাকি ১০০টি ফাংশন তো কোডে
        কল-ই করিনি! ব্যাকগ্রাউন্ডে বিল্ড টুল (Webpack / Turbopack) কি বাকি সব ফালতু কোড ফেলে দেয়নি?
        বান্ডল সাইজ এত বড় হলো কেন?
      </Line>

      <Line name="ফাহিম">
        ভুলু ভাই! বিল্ড টুল জাদুকর নয়! লাইব্রেরি থেকে কোড ইমপোর্ট করার সময় যদি{" "}
        <strong>Default Export Object</strong> ব্যবহার করেন বা <strong>CommonJS (CJS)</strong> মডিউল
        মেকানিজম রিড করেন, তবে Bundler নিশ্চিত হতে পারে না যে অনব্যবহৃত কোডটি আসলেই সাইড-ইফেক্ট ফ্রি
        কি না। ফলে Tree Shaking পুরোপুরি ফেইল করে এবং পুরো ৫০০ KB-র ফাইল বান্ডলে চলে আসে।
      </Line>

      <Line name="নেক্সট-ভাই">
        একদম! <strong>Tree Shaking</strong> হলো একটি Static Analysis প্রসেস, যা গাছের শুকনো মরা পাতা
        ঝরিয়ে ফেলার মতো সোর্স কোডের অনব্যবহৃত <code>export</code> গুলোকে ঝরিয়ে দেয়। আর{" "}
        <strong>Dead Code Elimination (DCE)</strong> হলো এমন কোড মুছে ফেলা যা কখনোই এক্সিকিউট হবে না
        (যেমন <code>if (false)</code> ব্লক)। আসুন শিখি কীভাবে কোড লিখলে Bundler ১০০% Tree Shaking
        করতে পারে।
      </Line>

      {/* ── Architecture ──────────────────────────────────────────────── */}
      <H2 id="architecture">১. How Tree Shaking Works (Static Analysis Pipeline)</H2>

      <Diagram>{`┌─────────────────────────────────────────────────────────────────────────┐
│                    TREE SHAKING & AST ANALYSIS PIPELINE                 │
└─────────────────────────────────────────────────────────────────────────┘

 ❌ NON-TREE-SHAKEABLE CODE (Default Export Object / CommonJS)
 ┌───────────────────────────────────────────────────────────────────────┐
 │ export default { add, subtract, multiply, divide };                   │
 └──────────────────────────────────┬────────────────────────────────────┘
                                    │ Bundler cannot statically analyze
                                    │ property access on a dynamic object!
                                    ▼
                     🔴 FULL LIBRARY INCLUDED IN BUNDLE (250 KB)

───────────────────────────────────────────────────────────────────────────

 🟢 TREE-SHAKEABLE CODE (Named ESM Exports)
 ┌───────────────────────────────────────────────────────────────────────┐
 │ export function add() { ... }                                         │
 │ export function subtract() { ... }  // Unused                         │
 └──────────────────────────────────┬────────────────────────────────────┘
                                    │ Static Analysis (AST Tree)
                                    ▼
       ┌────────────────────────────┴────────────────────────────┐
       │ Active Reference Found: add()                           │
       │ Unused Reference: subtract() ──► 💥 PRUNED / REMOVED!   │
       └────────────────────────────┬────────────────────────────┘
                                    ▼
                     🟢 ONLY add() INCLUDED IN BUNDLE (2 KB)`}</Diagram>

      {/* ── Failures ──────────────────────────────────────────────────── */}
      <H2 id="failures">২. Tree Shaking ফেইল করার ৩টি মূল কারণ</H2>

      <p>
        <strong>CommonJS (module.exports ও require):</strong> CommonJS ডাইনামিকভাবে রান-টাইমে
        ইমপোর্ট / এক্সপোর্ট ইভ্যালুয়েট করে। ফলে বিল্ড-টাইমে স্ট্যাটিক অ্যানালাইসিস সম্ভব হয় না।
        Tree Shaking-এর জন্য ESM (<code>import</code> / <code>export</code>) আবশ্যিক।
      </p>

      <p>
        <strong>Exporting single monolithic objects:</strong>{" "}
        <code>{"export default { funcA, funcB, funcC }"}</code> — এভাবে অবজেক্ট আকারে এক্সপোর্ট করলে
        Bundler বুঝতে পারে না অ্যাপের কোথাও অবজেক্টের কোনো প্রপার্টি ডাইনামিকভাবে ব্যবহৃত হচ্ছে কি
        না।
      </p>

      <p>
        <strong>Module side-effects:</strong> কোনো মডিউলের গ্লোবাল স্কোপে যদি এমন কোড থাকে যা
        ইমপোর্ট করার সাথে সাথেই এক্সিকিউট হয়ে গ্লোবাল অবজেক্ট (যেমন <code>window</code> বা{" "}
        <code>Array.prototype</code>) পরিবর্তন করে, তবে Bundler সেই মডিউলকে সেফ মনে করে না এবং
        বান্ডলে ধরে রাখে।
      </p>

      {/* ── Implementation ────────────────────────────────────────────── */}
      <H2 id="implementation">৩. Production Code Implementation</H2>

      <H3>❌ Anti-pattern — Monolithic default export ও dynamic property access</H3>

      <CodeBlock filename="utils/mathHelpers.ts">{`// 🔴 POOR PRACTICE: helper library with an object default export (tree shaking broken)

function add(a: number, b: number) {
  return a + b;
}

function heavyComplexCalculation(data: number[]) {
  // Imagine 50KB of heavy matrix transformations
  return data.reduce((acc, val) => acc + Math.pow(val, 3), 0);
}

function formatCurrency(amount: number) {
  return \`$\${amount.toFixed(2)}\`;
}

// 🔴 The bundler must include the ENTIRE object and every internal function
export default {
  add,
  heavyComplexCalculation,
  formatCurrency,
};`}</CodeBlock>

      <CodeBlock filename="components/SimpleCalculator.tsx">{`'use client';

import mathUtils from '@/utils/mathHelpers';

export function SimpleCalculator() {
  // 🔴 Only \`add\` is used, yet heavyComplexCalculation (50KB) is bundled too
  const sum = mathUtils.add(10, 20);

  return (
    <div className="p-4 bg-slate-900 text-slate-100 rounded-xl">
      <h2>Sum: {sum}</h2>
    </div>
  );
}`}</CodeBlock>

      <H3>🟢 Production pattern — Named ESM exports ও DCE-friendly কোড</H3>

      <CodeBlock filename="utils/mathHelpers.ts">{`// 🟢 PRODUCTION PATTERN: independent named exports (100% tree-shakeable)

// 🟢 Pure function with a named export
export function add(a: number, b: number) {
  return a + b;
}

// 🟢 Completely REMOVED from the production bundle when unused
export function heavyComplexCalculation(data: number[]) {
  return data.reduce((acc, val) => acc + Math.pow(val, 3), 0);
}

// 🟢 Pure helper
export function formatCurrency(amount: number) {
  return \`$\${amount.toFixed(2)}\`;
}`}</CodeBlock>

      <CodeBlock filename="components/OptimizedCalculator.tsx">{`'use client';

// 🟢 Named import: the bundler statically links ONLY \`add\` and shakes off the rest
import { add } from '@/utils/mathHelpers';

export function OptimizedCalculator() {
  const sum = add(10, 20);

  // 🟢 Dead code elimination:
  // the compiler strips this unreachable block entirely in a production build
  if (process.env.NODE_ENV === 'development' && false) {
    console.log('This code block will be dead-code eliminated');
  }

  return (
    <div className="p-4 bg-slate-900 border border-slate-800 text-slate-100 rounded-xl">
      <h2 className="text-lg font-bold">Optimized Sum: {sum}</h2>
      <p className="text-xs text-slate-400">
        heavyComplexCalculation was dropped during build-time tree shaking.
      </p>
    </div>
  );
}`}</CodeBlock>

      {/* ── Matrix ────────────────────────────────────────────────────── */}
      <H2 id="matrix">৪. Tree Shaking ও Code Pattern Matrix</H2>

      <Table
        head={["কোড লেখার ধরন", "মডিউল ফরম্যাট", "Tree-shakeable?", "বান্ডল সাইজ ইম্প্যাক্ট"]}
        rows={[
          [
            <code key="c">{"export default { fn1, fn2 }"}</code>,
            "ESM",
            "না ❌",
            "বিশাল 🔴 — পুরো অবজেক্ট ও সব মেথড বান্ডলে ঢুকে যাবে",
          ],
          [
            <code key="c">{"module.exports = { fn1 }"}</code>,
            "CommonJS",
            "না ❌",
            "বিশাল 🔴 — CJS স্ট্যাটিক অ্যানালাইসিস সাপোর্ট করে না",
          ],
          [
            <code key="c">{"export const fn1 = () => {}"}</code>,
            "ESM",
            "হ্যাঁ 🟢",
            "ক্ষুদ্র ⚡ — শুধু ব্যবহৃত ফাংশনটিই বান্ডলে থাকবে",
          ],
          [
            <code key="c">{"import lodash from 'lodash'"}</code>,
            "CJS / ESM mixed",
            "না ❌",
            "বিশাল 🔴 — পুরো Lodash (70KB+) ইনক্লুড হবে",
          ],
          [
            <code key="c">{"import add from 'lodash/add'"}</code>,
            "Deep import",
            "হ্যাঁ 🟢",
            "ক্ষুদ্র ⚡ — শুধু নির্দিষ্ট submodule ফাইলটি লোড হবে",
          ],
        ]}
      />

      <Line name="ভুলু ভাই">
        ক্লিয়ার! তার মানে ইউটিলিটি ফাইলে বড় কোনো অবজেক্ট এক্সপোর্ট না করে আলাদা আলাদা Named Export
        করব, আর ইমপোর্ট করার সময়ও নির্দিষ্ট নামের ইমপোর্ট ব্যবহার করব — যাতে Bundler অপ্রয়োজনীয়
        কোডগুলো ঝরিয়ে ফেলতে পারে!
      </Line>

      {/* ── Takeaways ─────────────────────────────────────────────────── */}
      <H2 id="takeaway">Production Takeaways</H2>

      <Note>
        <ul>
          <li>
            <strong>Always use named exports:</strong> লাইব্রেরি বা ইউটিলিটি ফাইল থেকে সবসময়{" "}
            <code>export const myFunc</code> বা <code>export function myFunc</code> টাইপের Named
            Export ব্যবহার করুন।
          </li>
          <li>
            <strong>Avoid CommonJS dependencies:</strong> ডিপেন্ডেন্সি যুক্ত করার আগে নিশ্চিত হন সেটি
            ESM সাপোর্ট করে কি না — যেমন <code>lodash</code>-এর বদলে <code>lodash-es</code>।
          </li>
          <li>
            <strong>Verify with production builds:</strong> <code>npm run build</code> চালিয়ে ফাইল
            সাইজ চেক করুন। ডেভেলপমেন্ট সার্ভারে (<code>npm run dev</code>) Tree Shaking কার্যকর হয়
            না।
          </li>
        </ul>
      </Note>
    </article>
  );
}
