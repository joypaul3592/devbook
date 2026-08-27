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
      bn: "৩টি আইকনের জন্য ৬০০ KB",
      en: "600 KB for three icons",
    },
  },
  {
    id: "architecture",
    label: {
      bn: "Barrel file traversal বনাম SWC transform",
      en: "Barrel traversal vs SWC transform",
    },
  },
  {
    id: "mechanisms",
    label: {
      bn: "২টি কম্পাইলার মেকানিজম",
      en: "Two compiler mechanisms",
    },
  },
  {
    id: "implementation",
    label: {
      bn: "Deep path spaghetti বনাম config",
      en: "Deep-path spaghetti vs config",
    },
  },
  {
    id: "matrix",
    label: { bn: "Optimization Strategy Matrix", en: "Optimization strategy matrix" },
  },
  {
    id: "takeaway",
    label: { bn: "Production Takeaways", en: "Production takeaways" },
  },
];

export default function PackageOptimization() {
  return (
    <article className="doc-prose">
      {/* ── The problem ───────────────────────────────────────────────── */}
      <H2 id="the-problem" anchorOnly>
        ৩টি আইকনের জন্য ৬০০ KB
      </H2>

      <p>
        দুপুর ৩:১৫। ভুলু ভাই তার নেক্সট.জেএস প্রজেক্টের নেভবারে মাত্র ৩টি আইকন ব্যবহারের জন্য{" "}
        <code>{"import { Bell, User, Settings } from 'lucide-react'"}</code> লিখেছেন। বিল্ড
        অ্যানালাইজার চালিয়ে দেখেন — মাত্র ৩টি আইকনের জন্য পুরো <code>lucide-react</code> লাইব্রেরির
        ১,৫০০+ আইকন ফাইল পার্স হয়ে বান্ডল সাইজ প্রায় ৬০০ KB বাড়িয়ে দিয়েছে।
      </p>

      <Line name="ভুলু ভাই">
        ফাহিম! আমি তো ভেবেছিলাম Tree Shaking হয়ে শুধু ৩টি আইকন বান্ডলে ঢুকবে! কিন্তু রুট ফাইল থেকে
        ইমপোর্ট করায় এত বিশাল বান্ডল কেন হলো? এখন কি আমাকে ম্যানুয়ালি{" "}
        <code>{"import Bell from 'lucide-react/dist/esm/icons/bell'"}</code>-এর মতো বিচ্ছিরি ডিপ-পাথ
        টাইপ করতে হবে?
      </Line>

      <Line name="ফাহিম">
        ভুলু ভাই! ম্যানুয়ালি ডিপ-পাথ লিখলে Developer Experience নষ্ট হয়ে কোড স্প্যাগেটি হয়ে যায়!
        এই সমস্যার মূল কারণ হলো <strong>Barrel Files</strong> (<code>index.js</code>), যা একটি
        লাইব্রেরির ভেতরের শত শত ফাইলকে একসাথে পুনঃরপ্তানি (re-export) করে। বিল্ড টুলের জন্য হাজার
        হাজার ফাইল পার্স করা অত্যন্ত ধীরগতির।
      </Line>

      <Line name="নেক্সট-ভাই">
        একদম! Next.js 15-এ আমাদের দেওয়া হয়েছে <code>optimizePackageImports</code> (এবং এর আগের{" "}
        <code>modularizeImports</code>)। এটি ব্যবহার করলে ডেভেলপাররা রুট ইমপোর্ট সিনট্যাক্সেই কোড
        লিখবেন, অথচ Next.js-এর SWC কম্পাইলার বিল্ড-টাইমে সেটিকে স্বয়ংক্রিয়ভাবে দ্রুততম ডাইরেক্ট
        ইমপোর্ট পাথে রূপান্তরিত করে দেবে।
      </Line>

      {/* ── Architecture ──────────────────────────────────────────────── */}
      <H2 id="architecture">১. Barrel File Traversal vs. Direct Package Optimization</H2>

      <Diagram>{`┌─────────────────────────────────────────────────────────────────────────┐
│              BARREL FILE TRAVERSAL VS. SWC PACKAGE OPTIMIZATION         │
└─────────────────────────────────────────────────────────────────────────┘

 ❌ UNOPTIMIZED BARREL IMPORT (parses 1500+ files)
 Developer writes: import { Bell } from 'lucide-react';
 ┌───────────────────────────────────────────────────────────────────────┐
 │ lucide-react/index.js (barrel file)                                   │
 │ ├── export { default as Bell } from './icons/bell';                   │
 │ ├── export { default as User } from './icons/user';                   │
 │ └── [parses all 1500+ icon AST nodes at build time]                   │
 └──────────────────────────────────┬────────────────────────────────────┘
                                    │ Severe build delay & bundle bloat
                                    ▼
                     🔴 HIGH INITIAL BUILD & BUNDLE SIZE

───────────────────────────────────────────────────────────────────────────

 🟢 SWC TRANSFORMED IMPORT (Next.js 15 optimizePackageImports)
 Developer writes: import { Bell } from 'lucide-react';
 ┌───────────────────────────────────────────────────────────────────────┐
 │ The SWC compiler intercepts the import during compilation and         │
 │ rewrites it to ──► 'lucide-react/dist/esm/icons/bell'                 │
 └──────────────────────────────────┬────────────────────────────────────┘
                                    │ Direct path resolution
                                    ▼
                     🟢 ONLY THE BELL ICON INCLUDED (~1.2 KB)`}</Diagram>

      {/* ── Mechanisms ────────────────────────────────────────────────── */}
      <H2 id="mechanisms">২. Package Optimization-এর ২টি কম্পাইলার মেকানিজম</H2>

      <p>
        <strong>optimizePackageImports (modern Next.js 15 standard):</strong> এটি Next.js-এর একটি
        ফাস্ট SWC-বেসড কনফিগারেশন। Next.js 15 বাই-ডিফল্ট বেশ কিছু জনপ্রিয় প্যাকেজ (
        <code>lucide-react</code>, <code>date-fns</code>, <code>lodash-es</code>,{" "}
        <code>@mui/material</code>, <code>rxjs</code>, <code>@mantine/core</code>) স্বয়ংক্রিয়ভাবে
        অপটিমাইজ করে। অতিরিক্ত কোনো প্যাকেজ যুক্ত করতে চাইলে <code>next.config.ts</code>-এ তার নাম
        ডিক্লেয়ার করলেই এটি সরাসরি ফাইল রিজলভ করে।
      </p>

      <p>
        <strong>modularizeImports (legacy regex transformation):</strong> কিছুটা পুরোনো কিন্তু
        শক্তিশালী মেকানিজম, যেখানে regular expression বা টেমপ্লেট স্ট্রিং ব্যবহার করে ইমপোর্ট পাথ
        কাস্টম রুল দিয়ে ম্যানিপুলেট করা হয় (যেমন{" "}
        <code>@mui/icons-material/{"{{member}}"}</code>)। নতুন প্রজেক্টে{" "}
        <code>optimizePackageImports</code> ব্যবহার করাই অধিক বুদ্ধিমানের কাজ।
      </p>

      {/* ── Implementation ────────────────────────────────────────────── */}
      <H2 id="implementation">৩. Production Code Implementation</H2>

      <H3>❌ Anti-pattern — Deep path spaghetti বনাম unoptimized barrel import</H3>

      <CodeBlock filename="components/UnoptimizedNavbar.tsx">{`// 🔴 POOR PRACTICE: DX ruined by hand-written deep paths
'use client';

// 🔴 Anti-pattern 1: unoptimized root import (bloats the bundle without package optimization)
import { ChevronRight, Settings } from 'lucide-react';

// 🔴 Anti-pattern 2: ugly, brittle manual deep import paths used to fix bundle size
import BellIcon from 'lucide-react/dist/esm/icons/bell';
import UserIcon from 'lucide-react/dist/esm/icons/user';

export function UnoptimizedNavbar() {
  return (
    <nav className="flex items-center gap-4 p-4 bg-slate-900 text-slate-100 rounded-xl">
      <UserIcon className="w-5 h-5 text-indigo-400" />
      <BellIcon className="w-5 h-5 text-amber-400" />
      <Settings className="w-5 h-5 text-slate-400" />
      <ChevronRight className="w-4 h-4 text-slate-500" />
    </nav>
  );
}`}</CodeBlock>

      <H3>🟢 Production pattern — Next.js 15 SWC package optimization</H3>

      <CodeBlock filename="next.config.ts">{`// 🟢 PRODUCTION PATTERN: declare heavy barrel packages once, centrally
import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  // 🟢 Register custom or heavy third-party barrel packages explicitly
  experimental: {
    optimizePackageImports: [
      'lucide-react',
      'date-fns',
      'lodash-es',
      'ramda',
      'my-custom-internal-ui-library',
    ],
  },
};

export default nextConfig;`}</CodeBlock>

      <CodeBlock filename="components/Navbar.tsx">{`'use client';

// 🟢 Write clean, standard named imports.
// SWC transparently rewrites them to direct module paths under the hood.
import { User, Bell, Settings, ChevronRight } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

export function OptimizedNavbar() {
  const timeAgo = formatDistanceToNow(new Date(2026, 7, 27));

  return (
    <nav className="flex items-center justify-between p-4 bg-slate-900 border border-slate-800 rounded-xl text-slate-100">
      <div className="flex items-center gap-3">
        <User className="w-5 h-5 text-indigo-400" />
        <span className="text-sm font-medium">Zubayer Salehin</span>
      </div>

      <div className="flex items-center gap-4">
        <span className="text-xs text-slate-400">{timeAgo} ago</span>
        <button className="p-2 hover:bg-slate-800 rounded-lg transition-colors">
          <Bell className="w-5 h-5 text-amber-400" />
        </button>
        <button className="p-2 hover:bg-slate-800 rounded-lg transition-colors">
          <Settings className="w-5 h-5 text-slate-400" />
        </button>
        <ChevronRight className="w-4 h-4 text-slate-500" />
      </div>
    </nav>
  );
}`}</CodeBlock>

      {/* ── Matrix ────────────────────────────────────────────────────── */}
      <H2 id="matrix">৪. Package Optimization Strategy Matrix</H2>

      <Table
        head={["পদ্ধতি", "ডেভেলপার সিনট্যাক্স", "বিল্ড ট্রান্সফরমেশন", "বান্ডল সাইজ ইম্প্যাক্ট"]}
        rows={[
          [
            "Standard barrel import",
            <span key="c">
              ক্লিন 🟢 — <code>{"import { A }"}</code>
            </span>,
            "কোনো ট্রান্সফরমেশন নেই (traversal bottleneck)",
            "বিশাল 🔴 — অপ্রয়োজনীয় ফাইল পার্স হয়ে বান্ডল বড় হয়",
          ],
          [
            "Manual deep paths",
            <span key="c">
              কঠিন ও ভঙ্গুর 🔴 — <code>{"import A from 'pkg/dist/...'"}</code>
            </span>,
            "ম্যানুয়াল স্ট্যাটিক ফাইল নির্দেশ",
            "ক্ষুদ্র ⚡ — কম সাইজ, তবে মেইনটেনেন্স কষ্টকর",
          ],
          [
            <code key="c">optimizePackageImports</code>,
            <span key="c">
              ক্লিন ও পারফেক্ট 🟢 — <code>{"import { A }"}</code>
            </span>,
            "SWC দ্বারা অটোমেটিক বিল্ড-টাইম রিরাইট",
            "ক্ষুদ্র ⚡ — শূন্য ওভারহেড ও দ্রুততম বিল্ড স্পিড",
          ],
        ]}
      />

      <Line name="ভুলু ভাই">
        মারাত্মক ট্রিক! এখন আর ম্যানুয়ালি ডিপ-পাথ লেখার দরকার নেই। <code>next.config.ts</code>-এ
        লাইব্রেরির নাম লিখে দেব, আর ভেতরে ক্লিন <code>{"import { User }"}</code> সিনট্যাক্সেই কাজ
        চালাব — পারফরম্যান্স ও DX দুটোই ১০০/১০০!
      </Line>

      {/* ── Takeaways ─────────────────────────────────────────────────── */}
      <H2 id="takeaway">Production Takeaways</H2>

      <Note>
        <ul>
          <li>
            <strong>Leverage clean DX with compiler automation:</strong> ম্যানুয়ালি জটিল ফাইল পাথ না
            লিখে <code>next.config.ts</code>-এ <code>optimizePackageImports</code> ব্যবহার করে ক্লিন
            ইমপোর্ট সিনট্যাক্স বজায় রাখুন।
          </li>
          <li>
            <strong>Add custom internal UI libraries:</strong> প্রজেক্টের নিজস্ব monorepo বা কাস্টম
            কম্পোনেন্ট লাইব্রেরিতে বড় barrel file (<code>index.ts</code>) থাকলে সেগুলোকেও এই
            তালিকায় যোগ করুন।
          </li>
          <li>
            <strong>Verify with dev server speed:</strong> এতে কেবল প্রোডাকশন বান্ডল সাইজ ছোট হয় না
            — ডেভেলপমেন্ট সার্ভারের cold start ও Fast Refresh গতিও বহুগুণ বেড়ে যায়।
          </li>
        </ul>
      </Note>
    </article>
  );
}
