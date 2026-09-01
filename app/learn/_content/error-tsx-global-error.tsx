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
      bn: "error.tsx থাকা সত্ত্বেও ব্রোকেন পেজ",
      en: "error.tsx present, page still broken",
    },
  },
  {
    id: "architecture",
    label: {
      bn: "App Router এরর হায়ারার্কি",
      en: "The App Router error hierarchy",
    },
  },
  {
    id: "mechanisms",
    label: { bn: "৩টি আর্কিটেকচারাল কনসেপ্ট", en: "Three architectural concepts" },
  },
  {
    id: "implementation",
    label: {
      bn: "Segment ও global boundary",
      en: "Segment & global boundaries",
    },
  },
  {
    id: "matrix",
    label: {
      bn: "error.tsx vs global-error.tsx",
      en: "error.tsx vs global-error.tsx",
    },
  },
  {
    id: "takeaway",
    label: { bn: "Production Takeaways", en: "Production takeaways" },
  },
];

export default function ErrorTsxGlobalError() {
  return (
    <article className="doc-prose">
      {/* ── The problem ───────────────────────────────────────────────── */}
      <H2 id="the-problem" anchorOnly>
        error.tsx থাকা সত্ত্বেও ব্রোকেন পেজ
      </H2>

      <p>
        দুপুর ১২:১৫। ভুলু ভাই আত্মবিশ্বাসের সাথে <code>app/dashboard/error.tsx</code> ফাইল তৈরি করে
        ভেবেছিলেন অ্যাপের সব এরর ধরা পড়ে গেছে। কিন্তু হঠাৎ সাইটের হেডারে থাকা একটি থার্ড-পার্টি
        অ্যানালিটিক্স স্ক্রিপ্ট <code>app/layout.tsx</code>-এ ক্র্যাশ করে বসলো! ফলে{" "}
        <code>dashboard/error.tsx</code> কোনো কাজই করতে পারলো না এবং ইউজারের সামনে ভেসে উঠলো এক
        কুৎসিত ডিফল্ট এরর পেজ।
      </p>

      <Line name="ভুলু ভাই">
        ফাহিম! আমি তো ড্যাশবোর্ডের ফোল্ডারে <code>error.tsx</code> বানিয়ে রেখেছিলাম! তাও রুটের লেআউট
        ক্র্যাশ করার পর সেই এরর বাউন্ডারি কাজ করলো না কেন?
      </Line>

      <Line name="ফাহিম">
        ভুলু ভাই! App Router-এর এরর হায়ারার্কির গোল্ডেন রুল হলো — যেকোনো ফোল্ডারের{" "}
        <code>error.tsx</code> কেবল তার চাইল্ড বা পরবর্তী লেভেলের ফাইলগুলোর এরর ক্যাচ করতে পারে, কিন্তু
        নিজের ফোল্ডারের <code>layout.tsx</code>-এর এরর ধরতে পারে না!
      </Line>

      <Line name="নেক্সট-ভাই">
        একদম! তাই root layout (<code>app/layout.tsx</code>)-এ কোনো বিপর্যয় ঘটলে তা হ্যান্ডেল করার জন্য
        রুটে প্রয়োজন <code>global-error.tsx</code>! এটি পুরো root layout রিপ্লেস করে সম্পূর্ণ অ্যাপকে
        ক্র্যাশের হাত থেকে বাঁচায়।
      </Line>

      {/* ── Architecture ──────────────────────────────────────────────── */}
      <H2 id="architecture">১. App Router Error Boundary Hierarchy</H2>

      <Diagram>{`┌─────────────────────────────────────────────────────────────────────────────┐
│                   NEXT.JS APP ROUTER ERROR HIERARCHY                        │
└─────────────────────────────────────────────────────────────────────────────┘

 app/
  ├── layout.tsx  ──────────┐  (if the root layout throws)
  │                         ▼
  │               ┌───────────────────┐
  │               │ global-error.tsx  │ 🟢 catches root layout errors
  │               └───────────────────┘    must render its own <html> and <body>
  │
  └── app/dashboard/
       ├── layout.tsx ──────┐
       ├── page.tsx ────────┼──► caught by ┌───────────────────┐
       └── widget.tsx ──────┘              │ dashboard/        │
                                           │   error.tsx       │ 🟢 catches segment
                                           └───────────────────┘    children errors

 ⚠ dashboard/error.tsx does NOT catch dashboard/layout.tsx —
   that error bubbles up to the parent segment's boundary.`}</Diagram>

      {/* ── Mechanisms ────────────────────────────────────────────────── */}
      <H2 id="mechanisms">২. কোর আর্কিটেকচারাল কনসেপ্ট</H2>

      <p>
        <strong>Route segment boundary (error.tsx):</strong> এটি একটি React client component (
        <code>&apos;use client&apos;</code>), যা নির্দিষ্ট রাউট সেগমেন্ট ও তার সাব-রাউটগুলোকে এরর
        বাউন্ডারিতে ঢেকে ফেলে। ইউজারকে পুরো পেজ রিফ্রেশ না করে <code>reset()</code> দিয়ে সেগমেন্ট
        রি-রেন্ডার করার সুযোগ দেয়।
      </p>

      <p>
        <strong>Root layout protection (global-error.tsx):</strong> যেহেতু <code>app/error.tsx</code>{" "}
        ফাইলটি root <code>layout.tsx</code>-এর ভেতরে রেন্ডার হয়, তাই root layout-এ এরর হলে সেটি ট্র্যাপ
        করতে পারে না। একমাত্র <code>app/global-error.tsx</code>-ই root layout-এর ফেইলিওর হ্যান্ডেল করতে
        পারে।
      </p>

      <p>
        <strong>The HTML replacement rule:</strong> <code>global-error.tsx</code> অ্যাক্টিভ হলে তা পুরো
        root layout (<code>&lt;html&gt;</code> ও <code>&lt;body&gt;</code> সহ) সরিয়ে দেয়। তাই এর
        ভেতরে নিজস্ব <code>&lt;html&gt;</code> এবং <code>&lt;body&gt;</code> ট্যাগ থাকা বাধ্যতামূলক।
      </p>

      {/* ── Implementation ────────────────────────────────────────────── */}
      <H2 id="implementation">৩. Production Code Implementation</H2>

      <H3>❌ Anti-pattern — expecting error.tsx to catch a root layout crash</H3>

      <CodeBlock filename="app/error.tsx">{`// 🔴 POOR PRACTICE: relying on app/error.tsx for root layout failures
// if app/layout.tsx throws, this component never renders at all

'use client';

export default function Error({ reset }: { error: Error; reset: () => void }) {
  // ❌ no telemetry, no digest, and structurally unable to catch root layout errors
  return (
    <div>
      <h2>Something went wrong!</h2>
      <button onClick={() => reset()}>Try again</button>
    </div>
  );
}`}</CodeBlock>

      <H3>🟢 Production pattern — a segment boundary plus a global one</H3>

      <p>
        <strong>Step 1 — সেগমেন্ট-লেভেল boundary।</strong>
      </p>

      <CodeBlock filename="app/dashboard/error.tsx">{`// 🟢 PRODUCTION PATTERN: route segment boundary with telemetry
'use client';

import { useEffect } from 'react';

interface ErrorBoundaryProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function DashboardError({ error, reset }: ErrorBoundaryProps) {
  useEffect(() => {
    // 🟢 send to monitoring (Sentry, LogRocket, …)
    console.error('Dashboard segment exception:', error);
  }, [error]);

  return (
    <div className="p-8 my-6 bg-red-50 border border-red-200 rounded-xl text-center space-y-4">
      <h2 className="text-xl font-bold text-gray-900">ড্যাশবোর্ড লোড করতে ত্রুটি ঘটেছে!</h2>

      <p className="text-sm text-gray-600 max-w-md mx-auto">
        {error.message || 'সাময়িক কারিগরি ত্রুটির কারণে এই সেকশনটি লোড করা যাচ্ছে না।'}
      </p>

      {/* 🟢 the digest is the only safe way to correlate a production error with its log */}
      {error.digest && (
        <p className="text-xs font-mono text-gray-400">Error digest: {error.digest}</p>
      )}

      <button
        onClick={() => reset()}
        className="px-5 py-2.5 bg-red-600 text-white font-medium rounded-lg hover:bg-red-700"
      >
        পুনরায় চেষ্টা করুন
      </button>
    </div>
  );
}`}</CodeBlock>

      <p>
        <strong>Step 2 — root global boundary।</strong>
      </p>

      <CodeBlock filename="app/global-error.tsx">{`// 🟢 PRODUCTION PATTERN: the last line of defence
'use client';

import { useEffect } from 'react';

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('CRITICAL: global root failure:', error);
  }, [error]);

  // 🟢 this replaces the root layout entirely, so it must supply <html> and <body>
  return (
    <html lang="bn">
      <body className="min-h-screen bg-gray-900 text-white flex items-center justify-center p-4">
        <div className="max-w-lg w-full bg-gray-800 border border-gray-700 rounded-2xl p-8 text-center space-y-6">
          <div className="text-red-500 font-mono text-6xl font-extrabold">500</div>

          <h1 className="text-2xl font-bold">অ্যাপ্লিকেশনে মারাত্মক সমস্যা ঘটেছে!</h1>

          <p className="text-gray-400 text-sm">
            আমাদের মূল সিস্টেমে সাময়িক সমস্যা দেখা দিয়েছে। আমরা দ্রুত তা ঠিক করার কাজ করছি।
          </p>

          <div className="flex justify-center gap-4">
            <button
              onClick={() => reset()}
              className="px-6 py-3 bg-blue-600 font-semibold rounded-xl hover:bg-blue-500"
            >
              সিস্টেম রিকভার করুন
            </button>
            <button
              onClick={() => window.location.reload()}
              className="px-6 py-3 bg-gray-700 font-semibold rounded-xl hover:bg-gray-600"
            >
              পেজ রিফ্রেশ দিন
            </button>
          </div>
        </div>
      </body>
    </html>
  );
}`}</CodeBlock>

      {/* ── Matrix ────────────────────────────────────────────────────── */}
      <H2 id="matrix">৪. error.tsx vs global-error.tsx</H2>

      <Table
        head={["বৈশিষ্ট্য", "error.tsx", "global-error.tsx"]}
        rows={[
          [
            "লোকেশন",
            "যেকোনো রাউট সেগমেন্টে (app/dashboard/)",
            "কেবল রুটে (app/global-error.tsx)",
          ],
          [
            "ক্যাচিং স্কোপ",
            "সেগমেন্টের চাইল্ড পেজ ও কম্পোনেন্ট",
            "পুরো অ্যাপ, root layout সহ",
          ],
          [
            "<html> ও <body>",
            "প্রয়োজন নেই — root layout-এর ভেতরে রেন্ডার হয়",
            "অবশ্যই থাকতে হবে — root layout রিপ্লেস করে",
          ],
          [
            "নিজের layout.tsx-এর এরর",
            "ধরতে পারে না — উপরে বাবল করে",
            "রুটের layout.tsx-এর এরর সরাসরি ক্যাচ করে",
          ],
          [
            "ব্যবহারের সময়",
            "সাধারণ পেজ বা ফিচার ক্র্যাশ",
            "সিস্টেম-লেভেল লেআউট কলাপ্স",
          ],
        ]}
      />

      <Line name="ভুলু ভাই">
        ক্লিয়ার ফাহিম! এখন বুঝতে পারলাম রুটের জন্য <code>global-error.tsx</code> কতটা জরুরি! এবার রুট
        লেআউটে সমস্যা হলেও ইউজার আর কুৎসিত ফাঁকা স্ক্রিন দেখবে না, বরং সুন্দর রিকভারি UI পাবে।
      </Line>

      {/* ── Takeaways ─────────────────────────────────────────────────── */}
      <H2 id="takeaway">Production Takeaways</H2>

      <Note>
        <ul>
          <li>
            <strong>Always mark them &apos;use client&apos;:</strong> <code>error.tsx</code> এবং{" "}
            <code>global-error.tsx</code> — দুটোই ক্লায়েন্ট কম্পোনেন্ট হতে হবে, কারণ তারা React-এর
            error boundary লজিক ব্যবহার করে।
          </li>
          <li>
            <strong>Never omit the document tree in global-error.tsx:</strong>{" "}
            <code>&lt;html&gt;</code> ও <code>&lt;body&gt;</code> না দিলে এরর অ্যাক্টিভ হওয়ার সময়
            ব্রাউজার রেন্ডারিং ব্রোকেন হয়ে যাবে।
          </li>
          <li>
            <strong>Show the digest, not the stack:</strong> প্রোডাকশনে Next.js এরর মেসেজ ছেঁটে দেয়
            আর একটি <code>digest</code> হ্যাশ দেয় — এটিই সার্ভার লগের সাথে মেলানোর একমাত্র নিরাপদ
            উপায়, তাই UI-তে সেটি দেখান।
          </li>
        </ul>
      </Note>
    </article>
  );
}
