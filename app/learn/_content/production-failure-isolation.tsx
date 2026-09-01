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
      bn: "এক উইজেটের টাইমআউট, পুরো ড্যাশবোর্ড স্তব্ধ",
      en: "One timeout froze the whole dashboard",
    },
  },
  {
    id: "architecture",
    label: {
      bn: "Bulkhead isolation আর্কিটেকচার",
      en: "The bulkhead isolation architecture",
    },
  },
  {
    id: "mechanisms",
    label: { bn: "৩টি আর্কিটেকচারাল কনসেপ্ট", en: "Three architectural concepts" },
  },
  {
    id: "implementation",
    label: {
      bn: "Circuit breaker ও bulkhead লেআউট",
      en: "A circuit breaker & bulkhead layout",
    },
  },
  {
    id: "matrix",
    label: { bn: "Monolithic vs Isolated", en: "Monolithic vs isolated" },
  },
  {
    id: "takeaway",
    label: { bn: "Production Takeaways", en: "Production takeaways" },
  },
];

export default function ProductionFailureIsolation() {
  return (
    <article className="doc-prose">
      {/* ── The problem ───────────────────────────────────────────────── */}
      <H2 id="the-problem" anchorOnly>
        এক উইজেটের টাইমআউট, পুরো ড্যাশবোর্ড স্তব্ধ
      </H2>

      <p>
        রাত ১১:১৫। প্রোডাকশনে ড্যাশবোর্ড লোড করার সময় নোটিফিকেশন সার্ভারের API স্লো হওয়ায় পুরো
        ড্যাশবোর্ডের সব প্রধান ফিচার লোড হওয়া বন্ধ হয়ে গেছে! ভুলু ভাই খেয়াল করলেন, একটি ক্ষুদ্র
        টাইমআউটের কারণে সাইডের রেভিনিউ চার্ট এবং মেইন ইউজার স্ট্যাটস — সবকিছু সাদা স্ক্রিন হয়ে আটকে
        গেছে।
      </p>

      <Line name="ভুলু ভাই">
        ফাহিম! একটা থার্ড-পার্টি নোটিফিকেশন বা কমেন্ট উইজেট ডাউন হলে আমার পুরো ড্যাশবোর্ডের মেইন
        বিজনেস সেলস চার্ট কেন বন্ধ হয়ে যাবে? এগুলোকে কি একে অপরের থেকে আলাদা রাখা যায় না?
      </Line>

      <Line name="ফাহিম">
        ভুলু ভাই! একেই বলে cascading failure! একটি নন-ক্রিটিক্যাল সার্ভিসের ক্র্যাশ পুরো অ্যাপকে টেনে
        নিচে নামিয়েছে। জাহাজ যেভাবে ওয়াটারটাইট কম্পার্টমেন্ট (bulkhead) ব্যবহার করে যাতে একটি অংশ ফুটো
        হলে পানি পুরো জাহাজে না ছড়ায়, সফটওয়্যারেও প্রতিটি উইজেটকে আইসোলেট করে রাখতে হয়!
      </Line>

      <Line name="নেক্সট-ভাই">
        একদম! App Router-এ failure isolation-এর মূল হাতিয়ার তিনটি — granular error boundaries,
        Suspense bulkheads, এবং circuit breakers!
      </Line>

      {/* ── Architecture ──────────────────────────────────────────────── */}
      <H2 id="architecture">১. Failure Isolation (Bulkhead) Architecture</H2>

      <Diagram>{`┌─────────────────────────────────────────────────────────────────────────────┐
│                 BULKHEAD FAILURE ISOLATION ARCHITECTURE                     │
└─────────────────────────────────────────────────────────────────────────────┘

                  Request app/dashboard/page.tsx
                                     │
         ┌───────────────────────────┼───────────────────────────┐
         ▼                           ▼                           ▼
┌───────────────────┐       ┌───────────────────┐       ┌───────────────────┐
│ Revenue chart     │       │ User stats        │       │ External widget   │
│ (core service)    │       │ (core service)    │       │ (unstable API)    │
└───────────────────┘       └───────────────────┘       └───────────────────┘
         │                           │                           │
    status: 200                 status: 200                 status: 500 ❌
         │                           │                           │
         ▼                           ▼                           ▼
 🟢 renders normally        🟢 renders normally        🔴 caught by its own boundary
                                                          fallback UI rendered;
                                                          the rest of the page stays live`}</Diagram>

      {/* ── Mechanisms ────────────────────────────────────────────────── */}
      <H2 id="mechanisms">২. কোর আর্কিটেকচারাল কনসেপ্ট</H2>

      <p>
        <strong>Bulkhead pattern:</strong> একটি কম্পোনেন্ট বা থার্ড-পার্টি সার্ভিসের ব্যর্থতা যেন
        আশেপাশের স্বাধীন ফিচারগুলোকে প্রভাবিত করতে না পারে, সেজন্য সেগুলোকে আলাদা আইসোলেটেড বাউন্ডারির
        ভেতরে রাখা।
      </p>

      <p>
        <strong>Granular error boundaries:</strong> পুরো পেজের জন্য একটিমাত্র <code>error.tsx</code>{" "}
        ব্যবহার না করে আলাদা সেকশন বা উইজেটের চারপাশে ক্লায়েন্ট-সাইড বাউন্ডারি র‍্যাপ করা — এতে একটি
        উইজেট ক্র্যাশ করলেও বাকি অংশ পুরোপুরি সচল থাকে।
      </p>

      <p>
        <strong>Circuit breaker pattern:</strong> কোনো ডাউনস্ট্রিম API একের পর এক ফেল করতে থাকলে
        বারবার রিকোয়েস্ট না পাঠিয়ে কিছুক্ষণের জন্য &quot;সার্কিট ওপেন&quot; রাখা হয়। এতে ফেল করা সার্ভার
        রিকভার করার সময় পায় এবং আপনার সার্ভারের থ্রেড ও মেমোরি রিসোর্স অপচয় হয় না।
      </p>

      {/* ── Implementation ────────────────────────────────────────────── */}
      <H2 id="implementation">৩. Production Code Implementation</H2>

      <H3>❌ Anti-pattern — an unisolated single point of failure</H3>

      <CodeBlock filename="app/dashboard/page.tsx">{`// 🔴 POOR PRACTICE: one unstable API crashes the entire dashboard
// worse, the awaits are sequential — the revenue fetch never even starts

export default async function DashboardPage() {
  const revenue = await fetchRevenue();
  const analytics = await fetchAnalytics(); // ❌ unstable third-party API

  return (
    <div>
      <RevenueChart data={revenue} />
      <AnalyticsWidget data={analytics} />
    </div>
  );
}`}</CodeBlock>

      <H3>🟢 Production pattern — bulkheads with a circuit breaker</H3>

      <p>
        <strong>Step 1 — circuit breaker ইউটিলিটি।</strong>
      </p>

      <CodeBlock filename="lib/circuit-breaker.ts">{`// 🟢 PRODUCTION PATTERN: an in-memory circuit breaker guard
type CircuitState = 'CLOSED' | 'OPEN' | 'HALF_OPEN';

class CircuitBreaker {
  private state: CircuitState = 'CLOSED';
  private failureCount = 0;
  private lastFailureTime = 0;

  constructor(
    private failureThreshold = 3,
    private cooldownTimeMs = 30_000
  ) {}

  async exec<T>(fn: () => Promise<T>, fallbackData: T): Promise<T> {
    const now = Date.now();

    // should the circuit move from OPEN to HALF_OPEN?
    if (this.state === 'OPEN') {
      if (now - this.lastFailureTime > this.cooldownTimeMs) {
        this.state = 'HALF_OPEN';
      } else {
        // 🟢 fast-fail without ever touching the downstream server
        console.warn('Circuit breaker OPEN — returning fallback instantly.');
        return fallbackData;
      }
    }

    try {
      const result = await fn();
      if (this.state === 'HALF_OPEN') {
        this.state = 'CLOSED';
        this.failureCount = 0;
      }
      return result;
    } catch {
      this.failureCount++;
      this.lastFailureTime = Date.now();

      if (this.failureCount >= this.failureThreshold) {
        this.state = 'OPEN';
        console.error(\`Circuit breaker tripped after \${this.failureCount} failures.\`);
      }

      return fallbackData;
    }
  }
}

// note: this state lives per server instance. On serverless it resets on cold
// starts — for a shared breaker, back it with Redis instead.
export const analyticsCircuitBreaker = new CircuitBreaker();`}</CodeBlock>

      <p>
        <strong>Step 2 — granular widget boundary।</strong>
      </p>

      <CodeBlock filename="components/WidgetBoundary.tsx">{`// 🟢 PRODUCTION PATTERN: a minimal class boundary — React needs a class here
'use client';

import React, { Component, type ReactNode } from 'react';

interface Props {
  children: ReactNode;
  fallbackText?: string;
}

interface State {
  hasError: boolean;
}

export class WidgetBoundary extends Component<Props, State> {
  public state: State = { hasError: false };

  public static getDerivedStateFromError(): State {
    return { hasError: true };
  }

  public componentDidCatch(error: Error) {
    console.error('Widget isolation captured an exception:', error);
  }

  public render() {
    if (this.state.hasError) {
      return (
        <div className="p-4 border border-dashed border-gray-300 bg-gray-50 rounded-xl text-center text-xs text-gray-500">
          {this.props.fallbackText ?? 'এই অংশটি সাময়িকভাবে অনুপলব্ধ।'}
        </div>
      );
    }

    return this.props.children;
  }
}`}</CodeBlock>

      <p>
        <strong>Step 3 — আইসোলেটেড ড্যাশবোর্ড লেআউট।</strong>
      </p>

      <CodeBlock filename="app/dashboard/page.tsx">{`// 🟢 PRODUCTION PATTERN: Suspense bulkheads + boundaries + circuit breaker
import { Suspense } from 'react';
import { WidgetBoundary } from '@/components/WidgetBoundary';
import { analyticsCircuitBreaker } from '@/lib/circuit-breaker';

async function RevenueSection() {
  const data = await fetch('https://api.store.com/revenue', { cache: 'no-store' }).then((r) =>
    r.json()
  );
  return <div className="p-6 bg-blue-50 border rounded-xl font-bold">রেভিনিউ: ৳{data.total}</div>;
}

async function UnstableAnalyticsSection() {
  // 🟢 the breaker stops a dead service from tying up render threads
  const data = await analyticsCircuitBreaker.exec(
    async () => {
      const res = await fetch('https://unstable-analytics.com/data', {
        signal: AbortSignal.timeout(2000),
      });
      if (!res.ok) throw new Error('ANALYTICS_DOWN');
      return res.json();
    },
    { visits: 'অপ্রাপ্য' } // fast fallback
  );

  return <div className="p-6 bg-purple-50 border rounded-xl font-bold">ভিজিটর: {data.visits}</div>;
}

export default function ResilientDashboardPage() {
  return (
    <main className="p-6 max-w-4xl mx-auto space-y-6">
      <h1 className="text-2xl font-bold">রেজিলিয়েন্ট ড্যাশবোর্ড</h1>

      <div className="grid grid-cols-2 gap-4">
        {/* each Suspense boundary streams independently — one slow fetch
            no longer blocks its neighbour from painting */}
        <Suspense fallback={<div className="p-6 bg-gray-100 animate-pulse rounded-xl">লোডিং...</div>}>
          <RevenueSection />
        </Suspense>

        {/* the unstable one gets both a boundary AND a breaker */}
        <WidgetBoundary fallbackText="অ্যানালিটিক্স সার্ভিস সাময়িকভাবে বন্ধ রয়েছে।">
          <Suspense
            fallback={<div className="p-6 bg-gray-100 animate-pulse rounded-xl">লোডিং...</div>}
          >
            <UnstableAnalyticsSection />
          </Suspense>
        </WidgetBoundary>
      </div>
    </main>
  );
}`}</CodeBlock>

      {/* ── Matrix ────────────────────────────────────────────────────── */}
      <H2 id="matrix">৪. Monolithic vs Failure Isolation</H2>

      <Table
        head={["বৈশিষ্ট্য", "Unisolated monolithic", "Failure isolation"]}
        rows={[
          [
            "ক্যাসকেডিং ইমপ্যাক্ট",
            "একটি API ফেল করলে পুরো পেজ সাদা 🔴",
            "ফেইল করা উইজেট বাদে সব সচল 🟢",
          ],
          [
            "রেসপন্স টাইম",
            "সবচেয়ে স্লো API রেন্ডারিং আটকে রাখে 🔴",
            "circuit breaker ফাস্ট-ফেইল নিশ্চিত করে 🟢",
          ],
          [
            "ইউজার এক্সপেরিয়েন্স",
            "\"সাইট কাজ করছে না\" 🔴",
            "কেবল একটি সেকশনে ফলব্যাক নোটিশ 🟢",
          ],
          [
            "থার্ড-পার্টি সেফটি",
            "জিরো প্রোটেকশন 🔴",
            "bulkhead isolation-এ সুরক্ষিত 🟢",
          ],
        ]}
      />

      <Line name="ভুলু ভাই">
        আহা ফাহিম! এখন বুঝতে পারলাম প্রোডাকশনে bulkhead স্ট্রাকচার কতটা জরুরি! এখন থার্ড-পার্টি কোনো
        সাইডবার বা উইজেট ডাউন হয়ে গেলেও আমার মূল ড্যাশবোর্ডের সেলস সার্ভিস আর পেমেন্ট সিস্টেম
        বিন্দুমাত্র ডিস্টার্বড হবে না।
      </Line>

      {/* ── Takeaways ─────────────────────────────────────────────────── */}
      <H2 id="takeaway">Production Takeaways</H2>

      <Note>
        <ul>
          <li>
            <strong>Always isolate third-party widgets:</strong> অনিয়ন্ত্রিত যেকোনো API বা ক্লায়েন্ট
            উইজেটকে স্বতন্ত্র <code>&lt;WidgetBoundary&gt;</code> এবং{" "}
            <code>&lt;Suspense&gt;</code> দিয়ে ঘিরে রাখুন।
          </li>
          <li>
            <strong>Implement circuit breakers:</strong> যে সার্ভিসগুলো নিয়মিত ডাউন হওয়ার সম্ভাবনা
            রয়েছে সেগুলোতে breaker ব্যবহার করে সার্ভারকে হ্যাং হওয়া থেকে রক্ষা করুন — সার্ভারলেসে
            শেয়ার্ড স্টেটের জন্য Redis-এ ব্যাক করুন।
          </li>
          <li>
            <strong>Fail fast with abort signals:</strong> স্লো নেটওয়ার্ক যেন সার্ভার রেন্ডারিংকে
            কয়েক সেকেন্ডের বেশি ঝুলিয়ে রাখতে না পারে, তার জন্য{" "}
            <code>AbortSignal.timeout()</code> ব্যবহার নিশ্চিত করুন।
          </li>
        </ul>
      </Note>
    </article>
  );
}
