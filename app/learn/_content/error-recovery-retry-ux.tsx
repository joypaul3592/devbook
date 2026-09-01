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
      bn: "Retry মানেই পুরো পেজ রিফ্রেশ",
      en: "Retry meant a full page reload",
    },
  },
  {
    id: "architecture",
    label: {
      bn: "Exponential backoff ফ্লো",
      en: "The exponential backoff flow",
    },
  },
  {
    id: "mechanisms",
    label: { bn: "৩টি আর্কিটেকচারাল কনসেপ্ট", en: "Three architectural concepts" },
  },
  {
    id: "implementation",
    label: {
      bn: "Backoff ইউটিলিটি ও soft retry",
      en: "A backoff utility & soft retry",
    },
  },
  {
    id: "matrix",
    label: { bn: "Retry Mechanics Comparison", en: "Retry mechanics comparison" },
  },
  {
    id: "takeaway",
    label: { bn: "Production Takeaways", en: "Production takeaways" },
  },
];

export default function ErrorRecoveryRetryUx() {
  return (
    <article className="doc-prose">
      {/* ── The problem ───────────────────────────────────────────────── */}
      <H2 id="the-problem" anchorOnly>
        Retry মানেই পুরো পেজ রিফ্রেশ
      </H2>

      <p>
        রাত ১০:০৫। মোবাইল নেটওয়ার্কের ১ সেকেন্ডের ফ্লিকারের জন্য ভুলু ভাইয়ের অ্যাপে &quot;Failed to
        fetch&quot; এরর চলে আসে। ভুলু ভাই পেজে একটি &quot;Try again&quot; বাটন বসিয়েছেন, কিন্তু ইউজার
        সেখানে ক্লিক করলেই <code>window.location.reload()</code> হয়ে পুরো পেজ রিফ্রেশ নিচ্ছে! ফলে
        ফর্মের ফিল্ডগুলোতে ইউজারের আধাঘণ্টা ধরে লেখা সব ইনপুট মুছে একাকার।
      </p>

      <Line name="ভুলু ভাই">
        ফাহিম! ১ সেকেন্ডের নেটওয়ার্ক ড্রপের জন্য পুরো পেজ রিফ্রেশ দেওয়া ছাড়া কি কোনো উপায় নেই? আর
        ইউজার যদি দ্রুত &apos;Retry&apos; বাটনে ১০ বার স্প্যাম-ক্লিক করে, তবে তো সার্ভারে ট্রাফিকের
        বন্যা বয়ে যাবে!
      </Line>

      <Line name="ফাহিম">
        ভুলু ভাই! ক্ষণস্থায়ী এরর (transient errors) — স্লো নেটওয়ার্ক বা সার্ভারের ১ সেকেন্ডের ব্লিপ —
        এর জন্য পুরো পেজ রিফ্রেশ দেওয়া একটি মারাত্মক অ্যান্টি-প্যাটার্ন! এতে ইউজারের লোকাল ফর্ম স্টেট
        বা স্ক্রল পজিশন পুরোটাই নষ্ট হয়ে যায়।
      </Line>

      <Line name="নেক্সট-ভাই">
        একদম! রেজিলিয়েন্ট UI-এর জন্য প্রয়োজন smart retry mechanism! অটোমেটিক exponential backoff with
        jitter অ্যালগরিদম এবং React-এর <code>useTransition</code> ব্যবহার করে কোনো পেজ রিফ্রেশ ছাড়াই
        ব্যাকগ্রাউন্ডে স্টেট রিকভার করতে হবে।
      </Line>

      {/* ── Architecture ──────────────────────────────────────────────── */}
      <H2 id="architecture">১. Retry Architecture &amp; Exponential Backoff Flow</H2>

      <Diagram>{`┌─────────────────────────────────────────────────────────────────────────────┐
│                  SMOOTH ERROR RECOVERY & RETRY PIPELINE                     │
└─────────────────────────────────────────────────────────────────────────────┘

 Action / data fetch request
            │
            ▼
 ❌ transient error (503 Service Unavailable / network drop)
            │
            ├─► attempt 1: wait ~1s  ──► failed ❌
            ├─► attempt 2: wait ~2s  ──► failed ❌
            └─► attempt 3: wait ~4s  ──► 🟢 succeeded
                                              │
                                              ▼
                            the UI recovers with no page reload
                                              │
                    [if every auto-retry is exhausted]
                                              ▼
                            show a manual retry CTA
                            (useTransition keeps form inputs intact)`}</Diagram>

      {/* ── Mechanisms ────────────────────────────────────────────────── */}
      <H2 id="mechanisms">২. কোর আর্কিটেকচারাল কনসেপ্ট</H2>

      <p>
        <strong>Exponential backoff with jitter:</strong> কোনো API ফেল করলে সাথে সাথে ক্রমাগত রিকোয়েস্ট
        না পাঠিয়ে প্রতি চেষ্টার পর ওয়েটিং টাইম ডাবল করা (১s, ২s, ৪s) এবং হালকা র‍্যান্ডম ডিলে (jitter)
        যোগ করা। এটি সার্ভারকে thundering herd problem থেকে রক্ষা করে।
      </p>

      <p>
        <strong>Transient vs non-transient:</strong> retry করার যোগ্য — network disconnect,
        502/503/504, 429 rate limit। retry করার অযোগ্য — 400 Bad Request, 401 Unauthorized, 404 Not
        Found; এগুলোতে রিট্রাই করলে সার্ভার রিসোর্স অপচয় ছাড়া কিছুই হবে না।
      </p>

      <p>
        <strong>Soft recovery with useTransition:</strong> ম্যানুয়াল রিট্রাইয়ের সময় ব্রাউজার রিফ্রেশ না
        করে <code>startTransition</code> বা <code>router.refresh()</code> ব্যবহার করলে React ট্রি-র
        লোকাল ইনপুট স্টেট অটুট রেখে কেবল ডাটা লেয়ার আপডেট হয়।
      </p>

      {/* ── Implementation ────────────────────────────────────────────── */}
      <H2 id="implementation">৩. Production Code Implementation</H2>

      <H3>❌ Anti-pattern — hard reload and unthrottled retry</H3>

      <CodeBlock filename="components/DumbErrorFallback.tsx">{`// 🔴 POOR PRACTICE: wiping the whole application state to retry one fetch
'use client';

export function DumbErrorFallback({ error }: { error: Error }) {
  const handleRetry = () => {
    // ❌ a hard refresh destroys every in-memory React state, including the form
    window.location.reload();
  };

  return (
    <div className="p-4 border border-red-200">
      <p>Error: {error.message}</p>
      {/* ❌ no throttling — the user can spam-click straight into a rate limit */}
      <button onClick={handleRetry}>Retry</button>
    </div>
  );
}`}</CodeBlock>

      <H3>🟢 Production pattern — backoff plus non-destructive recovery</H3>

      <p>
        <strong>Step 1 — exponential backoff ফেচ ইউটিলিটি।</strong>
      </p>

      <CodeBlock filename="lib/retry-fetch.ts">{`// 🟢 PRODUCTION PATTERN: resilient fetcher with exponential backoff + jitter
interface RetryableError {
  status?: number;
}

export async function fetchWithRetry<T>(
  fn: () => Promise<T>,
  retries = 3,
  delay = 1000
): Promise<T> {
  try {
    return await fn();
  } catch (error) {
    const status = (error as RetryableError)?.status;

    // 🟢 never retry a client error — it will fail identically every time
    if (status !== undefined && status >= 400 && status < 500) {
      throw error;
    }

    if (retries <= 0) {
      throw error;
    }

    // 🟢 jitter stops every client from retrying on the same second
    const jitter = Math.random() * 200;
    const nextDelay = delay * 2 + jitter;

    console.warn(\`Fetch failed; retrying in \${Math.round(nextDelay)}ms (\${retries} left)\`);

    await new Promise((resolve) => setTimeout(resolve, nextDelay));

    return fetchWithRetry(fn, retries - 1, nextDelay);
  }
}`}</CodeBlock>

      <p>
        <strong>Step 2 — non-destructive রিকভারি কম্পোনেন্ট।</strong>
      </p>

      <CodeBlock filename="components/ResilientDataFeed.tsx">{`// 🟢 PRODUCTION PATTERN: soft state recovery with useTransition
'use client';

import { useState, useTransition } from 'react';

interface Props {
  onRefresh: () => Promise<void>;
  initialError?: string;
}

export function ResilientDataFeed({ onRefresh, initialError }: Props) {
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(initialError ?? null);
  const [retryCount, setRetryCount] = useState(0);

  const handleManualRetry = () => {
    setError(null);

    // 🟢 non-destructive: every local input state in the tree survives this
    startTransition(async () => {
      try {
        await onRefresh();
        setRetryCount(0);
      } catch (err) {
        setRetryCount((prev) => prev + 1);
        setError((err as Error).message || 'ডাটা রিকভার করা সম্ভব হয়নি।');
      }
    });
  };

  if (!error) {
    return (
      <div className="p-4 border rounded-xl bg-white">
        <p className="text-sm text-gray-700">🟢 লাইভ ডাটা সচল রয়েছে</p>
      </div>
    );
  }

  return (
    <div className="p-4 bg-amber-50 border border-amber-200 rounded-xl space-y-3">
      <p className="text-amber-800 font-medium">সংযোগ বিচ্ছিন্ন হয়েছে ({error})</p>

      <p className="text-xs text-amber-700">
        আপনার পূরণ করা ডাটা সুরক্ষিত রয়েছে। ব্রাউজার রিফ্রেশ না করেই পুনরায় চেষ্টা করুন।
      </p>

      <button
        onClick={handleManualRetry}
        disabled={isPending}
        className="px-4 py-2 bg-amber-600 text-white text-sm font-medium rounded-lg hover:bg-amber-700 disabled:opacity-50"
      >
        {isPending
          ? 'পুনরায় চেষ্টা করা হচ্ছে...'
          : \`পুনরায় চেষ্টা করুন\${retryCount > 0 ? \` (চেষ্টা: \${retryCount})\` : ''}\`}
      </button>
    </div>
  );
}`}</CodeBlock>

      {/* ── Matrix ────────────────────────────────────────────────────── */}
      <H2 id="matrix">৪. Retry Mechanics Comparison</H2>

      <Table
        head={[
          "বৈশিষ্ট্য",
          "Hard reload",
          "Immediate retry loop",
          "Backoff + soft retry",
        ]}
        rows={[
          [
            "ফর্ম স্টেট",
            "সম্পূর্ণ মুছে যায় 🔴",
            "থাকে, তবে ফ্রিজ হতে পারে 🟡",
            "১০০% সুরক্ষিত 🟢",
          ],
          [
            "সার্ভার ইমপ্যাক্ট",
            "পুরো পেজ অ্যাসেট রি-ডাউনলোড 🔴",
            "স্প্যামিং ও rate-limit ট্রিগার 🔴",
            "সার্ভারকে রিকভারির সময় দেয় 🟢",
          ],
          [
            "Transient এররে সাফল্য",
            "মাঝারি 🟡",
            "কম 🔴",
            "সর্বোচ্চ 🟢",
          ],
          [
            "UX ফিডব্যাক",
            "ব্রাউজার হোয়াইটআউট 🔴",
            "অগোছালো বোতাম 🔴",
            "স্মুথ প্রোগ্রেসিভ ইন্ডিকেটর 🟢",
          ],
        ]}
      />

      <Line name="ভুলু ভাই">
        ফাটাফাটি ফাহিম! এখন ১ সেকেন্ডের নেটওয়ার্ক ড্রপে পুরো পেজ রিফ্রেশ না হয়ে ব্যাকগ্রাউন্ডেই backoff
        অ্যালগরিদমে ডাটা রিকভার হয়ে যায়, আর ইউজারের টাইপ করা ফর্ম ডেটাও একদম সেফ থাকে।
      </Line>

      {/* ── Takeaways ─────────────────────────────────────────────────── */}
      <H2 id="takeaway">Production Takeaways</H2>

      <Note>
        <ul>
          <li>
            <strong>Never reload for a data retry:</strong> React বা Next.js অ্যাপে ডাটা রিট্রাইয়ের
            জন্য সবসময় <code>router.refresh()</code>, SWR/React Query-এর <code>refetch()</code>,
            অথবা <code>useTransition</code> ব্যবহার করুন।
          </li>
          <li>
            <strong>Filter 4xx out of retries:</strong> 401 বা 400/422-তে রিট্রাই লুপ চালাবেন না —
            এতে কখনোই সফলতা আসবে না, শুধু সার্ভারে বাড়তি লোড পড়বে।
          </li>
          <li>
            <strong>Always add jitter:</strong> হাজার হাজার ক্লায়েন্ট যেন সার্ভার ডাউনের পর একই
            সেকেন্ডে রিট্রাই হিট না করে, তার জন্য র‍্যান্ডম ডিলে যোগ করা জরুরি।
          </li>
        </ul>
      </Note>
    </article>
  );
}
