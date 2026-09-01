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
      bn: "dev-এ চলে, build-এ ভাঙে",
      en: "Works in dev, breaks in build",
    },
  },
  {
    id: "architecture",
    label: {
      bn: "Build failure বনাম runtime error",
      en: "Build failure vs runtime error",
    },
  },
  {
    id: "mechanisms",
    label: { bn: "৪টি আর্কিটেকচারাল কনসেপ্ট", en: "Four architectural concepts" },
  },
  {
    id: "implementation",
    label: {
      bn: "Hydration-safe ও Suspense আইসোলেশন",
      en: "Hydration-safe code & Suspense",
    },
  },
  {
    id: "matrix",
    label: { bn: "Common Failures Reference", en: "Common failures reference" },
  },
  {
    id: "takeaway",
    label: { bn: "Production Takeaways", en: "Production takeaways" },
  },
];

export default function BuildFailuresRuntimeErrors() {
  return (
    <article className="doc-prose">
      {/* ── The problem ───────────────────────────────────────────────── */}
      <H2 id="the-problem" anchorOnly>
        dev-এ চলে, build-এ ভাঙে
      </H2>

      <p>
        রাত ৯:০০। প্রজেক্ট ডেপ্লয় দেওয়ার সময় ভুলু ভাই দুটি বিপদে পড়লেন। প্রথমত,{" "}
        <code>npm run build</code> চালানোর সাথে সাথেই টাইপস্ক্রিপ্ট ও Suspense বাউন্ডারির এরর এসে বিল্ড
        ফেইল করলো। দ্বিতীয়ত, কোনোমতে টাইপ-চেক স্কিপ করে ডেপ্লয় দেওয়ার পর ইউজারের ব্রাউজারে ফুটে
        উঠলো: <em>Hydration failed because the initial UI does not match what was rendered on the
        server</em>।
      </p>

      <Line name="ভুলু ভাই">
        ফাহিম! আমার কম্পিউটারে <code>npm run dev</code>-এ তো সব ঠিকঠাকই চলছিল! কিন্তু{" "}
        <code>npm run build</code>-এ টাইপস্ক্রিপ্ট এরর কেন দিচ্ছে? আর প্রোডাকশনে যাওয়ার পর এই ভয়ানক
        hydration error কোত্থেকে আসলো?
      </Line>

      <Line name="ফাহিম">
        ভুলু ভাই! ডেভেলপমেন্ট মোডে Next.js অনেক বেশি ফ্লেক্সিবল থাকে, কিন্তু বিল্ডের সময় পুরো কোডবেস
        কঠোরভাবে অ্যানালাইজ করে। টাইপ না মেলা, স্ট্যাটিক রেন্ডারিংয়ে ডাইনামিক ডেটা কল করা, বা Suspense
        বাউন্ডারি না থাকা — এসব কারণে বিল্ড ফেইল হয়। আর hydration error ঘটে যখন সার্ভারের HTML আর
        ব্রাউজারের প্রথম রেন্ডারের মধ্যে এক শব্দও অমিল থাকে।
      </Line>

      <Line name="নেক্সট-ভাই">
        একদম! প্রোডাকশন অ্যাপের স্থিতিশীলতার জন্য build errors (type mismatch, missing Suspense,
        dynamic server usage) এবং runtime errors (hydration mismatch, unhandled rejection) — এই দুই
        ক্যাটাগরির কারণ বোঝা ও সঠিক ডিবাগিং জানা অত্যন্ত জরুরি!
      </Line>

      {/* ── Architecture ──────────────────────────────────────────────── */}
      <H2 id="architecture">১. Build Failure vs Runtime Error Lifecycle</H2>

      <Diagram>{`┌─────────────────────────────────────────────────────────────────────────────┐
│                   BUILD FAILURE vs RUNTIME ERROR                            │
└─────────────────────────────────────────────────────────────────────────────┘

 [1] BUILD TIME  (npm run build)
 ├─ TypeScript strict check  (tsc --noEmit)
 ├─ ESLint rule validation
 └─ prerender engine — missing Suspense? dynamic API in a static route?
       │
       ├─► ❌ build fails — the deployment is blocked, safely 🛡
       └─► 🟢 build passes — a deployable bundle

 [2] RUNTIME  (a real user, in production)
 server HTML rendered ──► sent to the browser ──► client React hydration
                                                    │
                 ┌──────────────────────────────────┴──────────────────────┐
                 ▼                                                          ▼
   ❌ hydration mismatch                                    ❌ unhandled server exception
   server HTML ≠ client DOM                                 no boundary / API failure
   → React re-renders the tree (a real perf cost)           → blank screen without error.tsx`}</Diagram>

      {/* ── Mechanisms ────────────────────────────────────────────────── */}
      <H2 id="mechanisms">২. কোর আর্কিটেকচারাল কনসেপ্ট</H2>

      <p>
        <strong>Hydration mismatch:</strong> সার্ভারে যে HTML ট্রি তৈরি হয়, ক্লায়েন্টে React সেই DOM-এর
        ওপর হ্যান্ডলার বসাতে গিয়ে যদি দেখে দুই UI এক নয় — <code>window.innerWidth</code>,{" "}
        <code>localStorage</code> বা <code>new Date()</code> ব্যবহারের কারণে — তখনই এই এরর। সমাধান
        হলো ব্রাউজার-নির্ভর ডেটা কেবল <code>useEffect</code>-এর ভেতরে পড়া।
      </p>

      <p>
        <strong>Prerender build failure:</strong> কোনো পেজ স্ট্যাটিক রেন্ডার করার সময় যদি রিকোয়েস্ট-নির্ভর
        API (<code>cookies()</code>, <code>headers()</code>, <code>useSearchParams()</code>) কল করা
        হয় এবং তা Suspense বা <code>force-dynamic</code> দিয়ে র‍্যাপ করা না থাকে, তবে বিল্ড থেমে যায়।
      </p>

      <p>
        <strong>Missing Suspense with useSearchParams():</strong> ক্লায়েন্ট কম্পোনেন্টে{" "}
        <code>useSearchParams()</code> ব্যবহার করলে সেই কম্পোনেন্টকে অবশ্যই{" "}
        <code>&lt;Suspense&gt;</code> দিয়ে ঘিরতে হয় — নাহলে পুরো পেজ ডাইনামিক হয়ে যায় বা বিল্ড ফেল
        করে।
      </p>

      <p>
        <strong>Crash isolation:</strong> রানটাইমে API ডাউন হলে যেন পুরো অ্যাপ ব্ল্যাঙ্ক না হয়, সেজন্য
        ফাইল-বেসড এরর বাউন্ডারি (<code>app/error.tsx</code>) প্রজেক্টে থাকা বাধ্যতামূলক।
      </p>

      {/* ── Implementation ────────────────────────────────────────────── */}
      <H2 id="implementation">৩. Production Code Implementation</H2>

      <H3>❌ Anti-pattern — reading browser state during render</H3>

      <CodeBlock filename="app/dashboard/page.tsx">{`// 🔴 POOR PRACTICE: values that differ between server and client
'use client';

export default function DashboardPage() {
  // ❌ the server renders UTC at build/request time, the client renders local time —
  // the two HTML strings will never match
  const currentTime = new Date().toLocaleTimeString();

  // ❌ window is undefined on the server, defined on the client
  const screenWidth = typeof window !== 'undefined' ? window.innerWidth : 0;

  return (
    <div>
      <p>Time: {currentTime}</p>
      <p>Width: {screenWidth}</p>
    </div>
  );
}`}</CodeBlock>

      <H3>🟢 Production pattern — safe SSR/client sync and error isolation</H3>

      <p>
        <strong>Step 1 — hydration-safe ক্লায়েন্ট কম্পোনেন্ট।</strong>
      </p>

      <CodeBlock filename="app/dashboard/page.tsx">{`// 🟢 PRODUCTION PATTERN: browser values only after hydration completes
'use client';

import { useState, useEffect } from 'react';

export default function DashboardPage() {
  const [mounted, setMounted] = useState(false);
  const [currentTime, setCurrentTime] = useState('');
  const [screenWidth, setScreenWidth] = useState(0);

  // 🟢 runs only on the client, after the first render has matched the server
  useEffect(() => {
    setMounted(true);
    setCurrentTime(new Date().toLocaleTimeString());
    setScreenWidth(window.innerWidth);
  }, []);

  // the server and the first client render produce identical HTML
  if (!mounted) {
    return (
      <div className="p-6 space-y-2">
        <div className="h-4 bg-gray-200 rounded w-1/4 animate-pulse" />
        <div className="h-4 bg-gray-200 rounded w-1/3 animate-pulse" />
      </div>
    );
  }

  return (
    <div className="p-6 space-y-2">
      <p className="text-lg font-semibold">Time: {currentTime}</p>
      <p className="text-sm text-gray-600">Screen width: {screenWidth}px</p>
    </div>
  );
}`}</CodeBlock>

      <p>
        <strong>Step 2 — গ্রেসফুল এরর বাউন্ডারি।</strong>
      </p>

      <CodeBlock filename="app/error.tsx">{`// 🟢 PRODUCTION PATTERN: recover instead of showing a blank page
'use client';

import { useEffect } from 'react';

export default function ErrorBoundary({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // report to Sentry / Datadog — a caught error is still an error
    console.error('Production runtime exception:', error);
  }, [error]);

  return (
    <div className="flex flex-col items-center justify-center min-h-[400px] space-y-4 text-center">
      <h2 className="text-2xl font-bold text-red-600">কিছু একটা সমস্যা হয়েছে!</h2>
      <p className="text-gray-600 max-w-md">
        আমরা সমস্যাটি ট্রেস করেছি। অনুগ্রহ করে আবার চেষ্টা করুন।
      </p>
      {error.digest && (
        <p className="text-xs font-mono text-gray-400">Error digest: {error.digest}</p>
      )}
      <button
        onClick={() => reset()} // 🟢 re-renders the segment, no full page reload
        className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
      >
        পুনরায় চেষ্টা করুন
      </button>
    </div>
  );
}`}</CodeBlock>

      <p>
        <strong>Step 3 — useSearchParams()-এর Suspense আইসোলেশন।</strong>
      </p>

      <CodeBlock filename="app/search/page.tsx">{`// 🟢 PRODUCTION PATTERN: a boundary keeps the rest of the page static
import { Suspense } from 'react';
import SearchBar from './search-bar';

export default function SearchPage() {
  return (
    <main className="p-8">
      <h1 className="text-2xl font-bold mb-4">Product search</h1>

      {/* 🟢 mandatory around any component calling useSearchParams():
          without it the whole page is forced dynamic, or the build fails */}
      <Suspense fallback={<p className="text-gray-500">Search controls loading…</p>}>
        <SearchBar />
      </Suspense>
    </main>
  );
}`}</CodeBlock>

      {/* ── Matrix ────────────────────────────────────────────────────── */}
      <H2 id="matrix">৪. Common Failures Reference</H2>

      <Table
        head={["এরর বার্তা", "ধরন", "মূল কারণ", "সমাধান"]}
        rows={[
          [
            "Hydration failed…",
            "Runtime",
            "server HTML ≠ client DOM",
            "useEffect-এ স্টেট সেট করুন বা skeleton দেখান 🟢",
          ],
          [
            "useSearchParams() should be wrapped in a suspense boundary",
            "Build",
            "স্ট্যাটিক পেজে Suspense ছাড়া hook",
            "কম্পোনেন্টটি <Suspense> দিয়ে র‍্যাপ করুন 🟢",
          ],
          [
            "Dynamic server usage: cookies",
            "Build",
            "স্ট্যাটিক রুট থেকে cookies() অ্যাক্সেস",
            "export const dynamic = 'force-dynamic' 🟢",
          ],
          [
            "Module not found: Can't resolve 'fs'",
            "Build",
            "edge runtime-এ Node.js মডিউল ইমপোর্ট",
            "runtime = 'nodejs' সেট করুন বা ইমপোর্ট সরান 🟢",
          ],
        ]}
      />

      <Line name="ভুলু ভাই">
        আমার চোখ খুলে গেল ফাহিম! এখন বুঝতে পারছি ডেভেলপমেন্টে যা চোখ এড়িয়ে যায়, তা{" "}
        <code>npm run build</code> স্টেপেই ধরা পড়ে। hydration error দূর করার কায়দা আর{" "}
        <code>error.tsx</code> দিয়ে এরর সামলানোর বুদ্ধি পেয়ে ডেপ্লয়মেন্ট ভয় কেটে গেল!
      </Line>

      {/* ── Takeaways ─────────────────────────────────────────────────── */}
      <H2 id="takeaway">Production Takeaways</H2>

      <Note>
        <ul>
          <li>
            <strong>Run the production build locally first:</strong> পুশ করার আগে লোকালে{" "}
            <code>npm run build</code> চালিয়ে নিশ্চিত হয়ে নিন — dev সার্ভার prerendering চেক করে না,
            তাই অনেক এরর সেখানে ধরাই পড়ে না।
          </li>
          <li>
            <strong>Never ignore hydration warnings:</strong> এটি অ্যাপ ক্র্যাশ না করালেও পুরো ট্রি
            রি-রেন্ডার করায়, যা পারফরম্যান্স ও ইন্টারঅ্যাকশন লেটেন্সি দুটোই খারাপ করে।
          </li>
          <li>
            <strong>Show the digest, capture the stack:</strong> প্রোডাকশনে এরর মেসেজ ছেঁটে দেওয়া হয় —
            UI-তে <code>digest</code> দেখান আর <code>error.tsx</code>-এর ভেতর থেকে Sentry-তে পূর্ণ
            স্ট্যাক ট্রেস পাঠান।
          </li>
        </ul>
      </Note>
    </article>
  );
}
