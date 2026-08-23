import {
  CodeBlock,
  Diagram,
  H2,
  H3,
  Line,
  Note,
} from "@/components/learn/DocParts";
import type { Bi } from "@/lib/curriculum";

/** Section anchors — consumed by the "on this page" rail. */
export const headings: { id: string; label: Bi }[] = [
  {
    id: "the-problem",
    label: {
      bn: "এক রাউটের এররে পুরো অ্যাপ ক্র্যাশ",
      en: "One route's error crashes the whole app",
    },
  },
  {
    id: "mental-model",
    label: { bn: "error.tsx কী ধরে, কী ধরে না", en: "What error.tsx catches" },
  },
  {
    id: "mechanics",
    label: { bn: "আইসোলেশন হায়ারার্কি", en: "Isolation hierarchy" },
  },
  {
    id: "implementation",
    label: { bn: "প্রোডাকশন কোড", en: "Production code" },
  },
  {
    id: "takeaway",
    label: { bn: "Production Checklist", en: "Production checklist" },
  },
];

export default function RouteLevelErrorUi() {
  return (
    <article className="doc-prose">
      {/* ── The problem ───────────────────────────────────────────────── */}
      <H2 id="the-problem" anchorOnly>
        এক রাউটের এররে পুরো অ্যাপ ক্র্যাশ
      </H2>

      <p>
        বিকাল ৩:১৫। ভুলু ভাইয়ের ইউজার প্রোফাইল পেজে ডাটাবেস ডাউন হয়ে যাওয়ায় একটি সার্ভার এরর
        থ্রো হয়েছে। পুরো অ্যাপ ক্র্যাশ করে ক্লায়েন্টের স্ক্রিনে সাদা ব্ল্যাঙ্ক পেজ আর লাল রঙের
        Unhandled Server Error ভেসে উঠেছে।
      </p>

      <Line name="ভুলু ভাই">
        ফাহিম! আমার সাইডবার, নেভবার সব গায়েব হয়ে গেল কেন? একটা সাব-রাউটে এরর হলে কি পুরো
        ওয়েবসাইট ক্র্যাশ করবে?
      </Line>

      <Line name="ফাহিম">
        ভুলু ভাই! আপনি রাউটে কোনো <strong>Error Boundary</strong> ডিক্লেয়ার করেননি! তাই এরর
        বাবাজি বাবল-আপ হতে হতে রুট লেআউট পর্যন্ত ক্র্যাশ করে দিয়ে বের হয়ে গেছে!
      </Line>

      <Line name="নেক্সট-ভাই">
        এর সমাধান হলো <code>error.tsx</code> Route Segment Component। Next.js-এ{" "}
        <code>error.tsx</code> একটি ক্লায়েন্ট বাউন্ডারি (<code>&apos;use client&apos;</code>)
        যা বিহাইন্ড-দ্য-সিন React Error Boundary তৈরি করে। কোনো চাইল্ড পেজে ক্র্যাশ হলে
        প্যারেন্ট লেআউট বা সাইডবার অক্ষত থাকে, শুধু ক্র্যাশ হওয়া জায়গায় ফলব্যাক UI ভেসে ওঠে।
        আর রুট লেআউট নিজেই ক্র্যাশ করলে তার জন্য <code>global-error.tsx</code>।
      </Line>

      {/* ── Mental model ──────────────────────────────────────────────── */}
      <H2 id="mental-model">১. error.tsx কী ধরে, কী ধরে না</H2>

      <ul>
        <li>
          <strong>ধরে:</strong> একই সেগমেন্টের <code>page.tsx</code> এবং তার নিচের সব
          চাইল্ড সেগমেন্টে থ্রো হওয়া এরর — সার্ভার ও ক্লায়েন্ট দুই দিকেই।
        </li>
        <li>
          <strong>ধরে না:</strong> একই লেভেলের <code>layout.tsx</code> বা{" "}
          <code>template.tsx</code>-এর এরর — সেটি ধরতে হলে প্যারেন্ট ফোল্ডারের{" "}
          <code>error.tsx</code> লাগবে।
        </li>
        <li>
          <strong>reset():</strong> এই ফাংশনটি সেগমেন্টটিকে আবার রেন্ডার করার চেষ্টা করে —
          ট্রানজিয়েন্ট ফেইলিওরের জন্য &quot;Try Again&quot; বাটন।
        </li>
        <li>
          <strong>digest:</strong> প্রোডাকশনে আসল এরর মেসেজ ক্লায়েন্টে যায় না; বদলে একটি
          হ্যাশ (<code>error.digest</code>) আসে, যা সার্ভার লগের সাথে মিলিয়ে দেখা যায়।
        </li>
      </ul>

      {/* ── Mechanics ─────────────────────────────────────────────────── */}
      <H2 id="mechanics">২. আইসোলেশন হায়ারার্কি</H2>

      <Diagram>{`┌──────────────────────────────────────────────────────────────────────┐
│ app/dashboard/layout.tsx            (STAYS ALIVE & WORKING!)         │
│  ├── <Sidebar />                                                     │
│  └── app/dashboard/settings/error.tsx   (catches & shows fallback)   │
│        └── app/dashboard/settings/page.tsx   <-- crashes here        │
└──────────────────────────────────────────────────────────────────────┘

Root layout remains untouched — the user can safely click away elsewhere.

Bubbling order:  page → nearest error.tsx → parent error.tsx → global-error.tsx`}</Diagram>

      {/* ── Implementation ────────────────────────────────────────────── */}
      <H2 id="implementation">৩. প্রোডাকশন কোড</H2>

      <H3>A — রাউট এরর বাউন্ডারি</H3>

      <CodeBlock filename="app/dashboard/settings/error.tsx">{`'use client'; // Error boundaries MUST be client components

import { useEffect } from 'react';

interface ErrorProps {
  error: Error & { digest?: string };
  reset: () => void; // Re-renders the crashed segment
}

export default function SettingsError({ error, reset }: ErrorProps) {
  useEffect(() => {
    // Log to an observability service like Sentry or Datadog
    console.error('Settings Route Error:', error);
  }, [error]);

  return (
    <div className="bg-red-950/40 border border-red-800/80 rounded-xl p-6 space-y-4 max-w-lg">
      <div className="space-y-1">
        <h2 className="text-sm font-bold text-red-400">Failed to Load Settings</h2>
        <p className="text-xs text-slate-300">
          An error occurred while fetching your account settings.
        </p>
        {error.digest && (
          <p className="text-[10px] font-mono text-slate-500">Digest ID: {error.digest}</p>
        )}
      </div>

      <button
        onClick={() => reset()}
        className="px-3 py-1.5 bg-red-600 hover:bg-red-500 text-white rounded text-xs font-medium transition shadow"
      >
        Try Again
      </button>
    </div>
  );
}`}</CodeBlock>

      <H3>B — রুট লেআউট ক্র্যাশের জন্য global-error</H3>

      <CodeBlock filename="app/global-error.tsx">{`'use client';

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    // global-error replaces the root layout, so it must ship its own html/body
    <html lang="bn">
      <body className="bg-slate-950 text-slate-100 min-h-screen grid place-items-center">
        <div className="text-center space-y-4">
          <h1 className="text-lg font-bold text-red-400">Application Error</h1>
          <p className="text-xs text-slate-400">
            The application shell failed to render.
          </p>
          <button
            onClick={() => reset()}
            className="px-4 py-2 bg-slate-800 hover:bg-slate-700 rounded text-xs"
          >
            Reload application
          </button>
        </div>
      </body>
    </html>
  );
}`}</CodeBlock>

      <Line name="ভুলু ভাই">
        এখন সেটিংস পেজ ক্র্যাশ করলেও সাইডবার, নেভবার সব বহাল — ইউজার এক ক্লিকেই অন্য ট্যাবে
        চলে যেতে পারছে!
      </Line>

      {/* ── Takeaways ─────────────────────────────────────────────────── */}
      <H2 id="takeaway">Production Checklist</H2>

      <Note>
        <ul>
          <li>
            <strong>একই সেগমেন্টের layout-এর এরর error.tsx ধরে না:</strong> কোনো সেগমেন্টের{" "}
            <code>error.tsx</code> শুধু তার চাইল্ড পেজের এরর ক্যাচ করে। একই লেভেলের{" "}
            <code>layout.tsx</code>-এর এরর ধরতে প্যারেন্ট ফোল্ডারের <code>error.tsx</code>{" "}
            লাগবে।
          </li>
          <li>
            <strong>রুট ফেইলিওরে global-error.tsx:</strong> <code>app/layout.tsx</code>{" "}
            ক্র্যাশ করলে হ্যান্ডেল করতে <code>app/global-error.tsx</code> রাখুন — মনে রাখবেন,
            এর নিজস্ব <code>&lt;html&gt;</code> ও <code>&lt;body&gt;</code> ট্যাগ থাকতে হবে।
          </li>
          <li>
            <strong>Expected error-কে এরর বানাবেন না:</strong> &quot;ডাটা নেই&quot; টাইপ
            কেসে থ্রো না করে <code>notFound()</code> বা টাইপড রিটার্ন ভ্যালু ব্যবহার করুন —{" "}
            <code>error.tsx</code> কেবল unexpected ক্র্যাশের জন্য।
          </li>
        </ul>
      </Note>
    </article>
  );
}
