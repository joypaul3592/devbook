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
      bn: "window is not defined — বিল্ড ক্র্যাশ",
      en: "window is not defined — a build crash",
    },
  },
  {
    id: "architecture",
    label: {
      bn: "'use client' SSR ভ্রান্তি বনাম আইসোলেশন",
      en: "The 'use client' fallacy vs isolation",
    },
  },
  {
    id: "mechanisms",
    label: { bn: "৩টি প্রধান টেকনিক", en: "Three core techniques" },
  },
  {
    id: "implementation",
    label: {
      bn: "client-only ও ssr: false",
      en: "client-only & ssr: false",
    },
  },
  {
    id: "matrix",
    label: {
      bn: "Client vs Server Protection",
      en: "Client vs server protection",
    },
  },
  {
    id: "takeaway",
    label: { bn: "Production Takeaways", en: "Production takeaways" },
  },
];

export default function ClientOnlyPackageLoading() {
  return (
    <article className="doc-prose">
      {/* ── The problem ───────────────────────────────────────────────── */}
      <H2 id="the-problem" anchorOnly>
        window is not defined — বিল্ড ক্র্যাশ
      </H2>

      <p>
        দুপুর ১:১৫। ভুলু ভাই তার অ্যাপে ইউজার ইন্টারঅ্যাকশনের জন্য একটি কাস্টম অ্যানিমেশন ও
        localStorage অ্যানালিটিক্স প্লাগইন যুক্ত করেছেন। কিন্তু প্রোডাকশন বিল্ড দিতেই টার্মিনালে বড়
        লাল মেসেজে বিল্ড ফেল করেছে — <code>ReferenceError: window is not defined</code> অথবা{" "}
        <code>HTMLCanvasElement is not defined</code>।
      </p>

      <Line name="ভুলু ভাই">
        ফাহিম! আমি তো কম্পোনেন্টের একদম ওপরে <code>&apos;use client&apos;</code> নির্দেশিকা দিয়েই
        দিয়েছিলাম! রিঅ্যাক্ট ক্লায়েন্ট কম্পোনেন্ট হওয়া সত্ত্বেও কেন Next.js সার্ভার প্রি-রেন্ডারিংয়ের
        (SSR) সময় <code>window</code> বা <code>document</code> অবজেক্ট খুঁজে না পেয়ে পুরো বিল্ড ক্র্যাশ
        করাচ্ছে?
      </Line>

      <Line name="ফাহিম">
        ভুলু ভাই! <code>&apos;use client&apos;</code> মানে &quot;SSR ছাড়া শুধু ক্লায়েন্ট&quot; — এমন
        নয়! <code>&apos;use client&apos;</code> দেওয়া কম্পোনেন্টও ফার্স্ট-পাসে Node.js সার্ভারে
        প্রি-রেন্ডার হয়। তাই কোনো থার্ড-পার্টি প্যাকেজ ইমপোর্ট করার সাথে সাথেই যদি সেটি টপ-লেভেলে{" "}
        <code>window.localStorage</code> বা <code>document.querySelector</code> এক্সেস করার চেষ্টা
        করে, তবে Node.js সঙ্গে সঙ্গে ক্র্যাশ করে।
      </Line>

      <Line name="নেক্সট-ভাই">
        একদম! সমাধান দুটি — ১. <code>client-only</code> প্যাকেজ ব্যবহার করে কোডকে এক্সপ্লিসিটলি
        প্রোটেক্ট করা, যাতে ভুল করেও কোনো সার্ভার মডিউল তা ইমপোর্ট না করতে পারে, এবং ২.{" "}
        <code>useEffect</code> guard অথবা <code>next/dynamic</code> with{" "}
        <code>{"{ ssr: false }"}</code> দিয়ে ব্রাউজার-স্পেসিফিক মডিউলগুলোকে সম্পূর্ণ আইসোলেট করে ফেলা।
      </Line>

      {/* ── Architecture ──────────────────────────────────────────────── */}
      <H2 id="architecture">
        ১. Client Component SSR Fallacy vs. Client-Only Isolation Pipeline
      </H2>

      <Diagram>{`┌─────────────────────────────────────────────────────────────────────────┐
│     CLIENT COMPONENT SSR FALLACY VS. CLIENT-ONLY MODULE ISOLATION       │
└─────────────────────────────────────────────────────────────────────────┘

 ❌ THE 'use client' SSR FALLACY
 Component has the 'use client' directive
 ┌───────────────────────────────────────────────────────────────────────┐
 │ Next.js server (Node.js) evaluates the file during SSR                │
 │ └── imports a browser-only lib (canvas / localStorage)                │
 │     └── tries to access window.localStorage                           │
 └──────────────────────────────────┬────────────────────────────────────┘
                                    │
                                    ▼
                 🔴 ReferenceError: window is not defined (build crash)

───────────────────────────────────────────────────────────────────────────

 🟢 CLIENT-ONLY ISOLATED EXECUTION PIPELINE
 Component protected with isolation guards
 ┌───────────────────────────────────────────────────────────────────────┐
 │ Next.js server (Node.js) step:                                        │
 │ └── skips browser evaluation / emits a static skeleton                │
 └──────────────────────────────────┬────────────────────────────────────┘
                                    │ hydrates in the browser
                                    ▼
 ┌───────────────────────────────────────────────────────────────────────┐
 │ Client browser step:                                                  │
 │ └── safely evaluates window & document APIs                           │
 └───────────────────────────────────────────────────────────────────────┘
                                    ▼
                      🟢 BUILD SAFETY & ZERO CRASHES`}</Diagram>

      {/* ── Mechanisms ────────────────────────────────────────────────── */}
      <H2 id="mechanisms">২. Client-Only লোডিং ও আইসোলেশনের ৩টি প্রধান টেকনিক</H2>

      <p>
        <strong>The client-only package guard:</strong> প্রজেক্টের কাস্টম ক্লায়েন্ট হেল্পার বা ব্রাউজার
        ইউটিলিটিতে <code>import &apos;client-only&apos;</code> যুক্ত করে দিলে, ভুলবশত কোনো সার্ভার
        কম্পোনেন্ট তা ইমপোর্ট করলে রানটাইম এররের বদলে বিল্ড-টাইমেই ফাস্ট ফিডব্যাক এরর পাওয়া যায়।
      </p>

      <p>
        <strong>useEffect / typeof window guards:</strong> ব্রাউজার নেটিভ API (<code>window</code>,{" "}
        <code>localStorage</code>, <code>navigator</code>) এক্সেস করার কোডগুলোকে বাধ্যতামূলকভাবে{" "}
        <code>useEffect</code> হুক বা <code>typeof window !== &apos;undefined&apos;</code> কন্ডিশনের
        ভেতরে এনক্যাপসুলেট করা।
      </p>

      <p>
        <strong>Dynamic import wrapper with ssr: false:</strong> যেসব থার্ড-পার্টি প্যাকেজ ফাইল
        ইমপোর্ট হওয়ার সময়ই (module initialization phase) টপ-লেভেলে <code>window</code> এক্সেস করে,
        সেগুলোকে <code>next/dynamic</code> দিয়ে <code>{"{ ssr: false }"}</code> অপশনে আইসোলেট করা।
      </p>

      {/* ── Implementation ────────────────────────────────────────────── */}
      <H2 id="implementation">৩. Production Code Implementation</H2>

      <H3>❌ Anti-pattern — unsafe top-level access in a client component</H3>

      <CodeBlock filename="components/UnsafeThemeWidget.tsx">{`// 🔴 POOR PRACTICE: 'use client' does NOT protect top-level SSR window access
'use client';

// 🔴 anti-pattern: this runs during Node.js SSR evaluation → crash
const savedTheme = window.localStorage.getItem('theme') || 'dark';

export function UnsafeThemeWidget() {
  return (
    <div className="p-4 bg-slate-900 border border-slate-800 rounded-lg">
      <p className="text-sm">Current theme: {savedTheme}</p>
    </div>
  );
}`}</CodeBlock>

      <H3>🟢 Production pattern — a guarded client-only module and wrapper</H3>

      <CodeBlock filename="lib/client-analytics.ts">{`// 🟢 STEP 1: a browser-only utility module
import 'client-only'; // 🟢 guarantees this file CANNOT be imported by a Server Component

export function trackClientSession(eventName: string) {
  // safe to touch window, because client-only enforces the execution environment
  if (typeof window !== 'undefined') {
    const userAgent = window.navigator.userAgent;
    console.log(\`[client analytics] event: \${eventName} | UA: \${userAgent}\`);
  }
}`}</CodeBlock>

      <CodeBlock filename="components/CanvasAnimation.tsx">{`// 🟢 STEP 2: the browser-only heavy component
'use client';

import { useEffect, useState } from 'react';
import { trackClientSession } from '@/lib/client-analytics';

export default function CanvasAnimation() {
  const [dimensions, setDimensions] = useState<{ width: number; height: number } | null>(null);

  useEffect(() => {
    // 🟢 safe execution area: guaranteed to run ONLY in the browser
    trackClientSession('Canvas Rendered');

    setDimensions({
      width: window.innerWidth,
      height: 300,
    });
  }, []);

  if (!dimensions) {
    return (
      <div className="h-[300px] w-full bg-slate-900 animate-pulse rounded-xl flex items-center justify-center text-slate-500 text-sm">
        Initializing browser canvas...
      </div>
    );
  }

  return (
    <div className="p-6 bg-slate-900 border border-slate-800 rounded-xl space-y-2">
      <span className="text-xs font-mono text-emerald-400">● BROWSER CANVAS ACTIVE</span>
      <p className="text-sm text-slate-300">
        Viewport dimensions: {dimensions.width}px x {dimensions.height}px
      </p>
    </div>
  );
}`}</CodeBlock>

      <CodeBlock filename="app/interactive/page.tsx">{`// 🟢 STEP 3: safe integration in the page
'use client';

import dynamic from 'next/dynamic';

// 🟢 STEP 4: the dynamic import bypasses Node.js SSR evaluation completely
const SafeCanvasAnimation = dynamic(
  () => import('@/components/CanvasAnimation'),
  {
    ssr: false, // 🟢 complete server-evaluation opt-out
    loading: () => (
      <div className="h-[300px] w-full bg-slate-900 rounded-xl border border-slate-800 animate-pulse flex items-center justify-center text-slate-500 text-sm">
        ⏳ Loading isolated client module...
      </div>
    ),
  },
);

export default function InteractivePage() {
  return (
    <div className="p-8 max-w-xl mx-auto space-y-6 bg-slate-950 text-slate-100 min-h-screen">
      <div className="space-y-1">
        <h1 className="text-2xl font-bold">Client-Only Module Isolation</h1>
        <p className="text-sm text-slate-400">
          Prevents SSR window/document errors using client-only and ssr: false.
        </p>
      </div>

      <SafeCanvasAnimation />
    </div>
  );
}`}</CodeBlock>

      {/* ── Matrix ────────────────────────────────────────────────────── */}
      <H2 id="matrix">৪. Client vs. Server Protection Package Comparison</H2>

      <Table
        head={["প্যাকেজ / কনসেপ্ট", "সিনট্যাক্স", "কাজ ও নিরাপত্তা স্তর"]}
        rows={[
          [
            <code key="c">client-only</code>,
            <code key="s">{"import 'client-only'"}</code>,
            "সার্ভার কম্পোনেন্ট ভুল করে ব্রাউজার ইউটিলিটি ইমপোর্ট করলে বিল্ড-টাইমে ব্লক করে 🟢",
          ],
          [
            <code key="c">server-only</code>,
            <code key="s">{"import 'server-only'"}</code>,
            "ক্লায়েন্ট কম্পোনেন্ট ভুল করে API/DB সিক্রেট ইমপোর্ট করলে বিল্ড-টাইমে ব্লক করে 🟢",
          ],
          [
            "typeof window check",
            <code key="s">
              {"if (typeof window !== 'undefined')"}
            </code>,
            "রানটাইমে অবজেক্টের অস্তিত্ব পরীক্ষা করে এরর প্রতিরোধ করে",
          ],
          [
            <span key="c">
              <code>next/dynamic</code> opt-out
            </span>,
            <code key="s">{"{ ssr: false }"}</code>,
            "মডিউলটির সার্ভার প্রি-রেন্ডারিং সম্পূর্ণ বন্ধ করে দেয়",
          ],
        ]}
      />

      <Line name="ভুলু ভাই">
        কনসেপ্টটা এখন একদম ক্লিয়ার! <code>&apos;use client&apos;</code> দিলেও যে সার্ভারে কোড
        প্রি-রেন্ডার হয়, এই জায়গাটাই মিস করছিলাম। এখন <code>client-only</code> আর{" "}
        <code>ssr: false</code> ব্যবহার করার পর প্রোডাকশন বিল্ডে কোনো window এরর আসছে না।
      </Line>

      {/* ── Takeaways ─────────────────────────────────────────────────── */}
      <H2 id="takeaway">Production Takeaways</H2>

      <Note>
        <ul>
          <li>
            <strong>&apos;use client&apos; is not an SSR opt-out:</strong> মনে রাখবেন,{" "}
            <code>&apos;use client&apos;</code> দিলেও প্রথমবার কোডটি Node.js সার্ভারে এক্সিকিউট হয় —
            তাই ইমপোর্ট ফাইলের টপ-লেভেলে কখনো <code>window</code> বা <code>document</code> লিখবেন না।
          </li>
          <li>
            <strong>Use the client-only guard package:</strong> ব্রাউজার-স্পেসিফিক হেল্পার ফাংশনগুলোতে{" "}
            <code>npm i client-only</code> করে ইমপোর্ট যুক্ত করে দিন, যাতে ভুলবশত সার্ভার ফাইলে
            এনভায়রনমেন্ট লিক না হয়।
          </li>
          <li>
            <strong>Defer browser access to useEffect:</strong> সমস্ত localStorage, cookie এক্সেস এবং
            কাস্টম DOM রিডকে <code>useEffect</code>-এর ভেতরে নিয়ে যান।
          </li>
        </ul>
      </Note>
    </article>
  );
}
