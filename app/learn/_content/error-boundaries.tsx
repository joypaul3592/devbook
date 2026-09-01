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
      bn: "এক উইজেটের জন্য সাদা স্ক্রিন",
      en: "One widget, a white screen",
    },
  },
  {
    id: "architecture",
    label: {
      bn: "Component isolation আর্কিটেকচার",
      en: "The component isolation architecture",
    },
  },
  {
    id: "mechanisms",
    label: { bn: "৩টি আর্কিটেকচারাল কনসেপ্ট", en: "Three architectural concepts" },
  },
  {
    id: "implementation",
    label: {
      bn: "Granular boundary ইমপ্লিমেন্টেশন",
      en: "Implementing a granular boundary",
    },
  },
  {
    id: "matrix",
    label: { bn: "Error Boundary Comparison", en: "Error boundary comparison" },
  },
  {
    id: "takeaway",
    label: { bn: "Production Takeaways", en: "Production takeaways" },
  },
];

export default function ErrorBoundaries() {
  return (
    <article className="doc-prose">
      {/* ── The problem ───────────────────────────────────────────────── */}
      <H2 id="the-problem" anchorOnly>
        এক উইজেটের জন্য সাদা স্ক্রিন
      </H2>

      <p>
        সকাল ১০:৩০। ভুলু ভাই ক্লায়েন্টকে লাইভ ড্যাশবোর্ড দেখাচ্ছিলেন। হঠাৎ ড্যাশবোর্ডের কোণায় থাকা এক
        ছোট ওয়েদার উইজেটের ডেটাতে <code>undefined</code> জেনারেট হলো — আর চোখের সামনে পুরো ড্যাশবোর্ড
        উধাও হয়ে স্ক্রিন একদম সাদা (white screen of death) হয়ে গেল!
      </p>

      <Line name="ভুলু ভাই">
        ফাহিম! এ কী হলো! একটা পুচকে উইজেটের ডেটা মিসিং হওয়ার কারণে পুরো ড্যাশবোর্ড ক্র্যাশ করে সাদা
        হয়ে গেল কেন? নেভিগেশন বার, টেবিল, সাইডবার — সব উধাও!
      </Line>

      <Line name="ফাহিম">
        ভুলু ভাই! React-এর ডিফল্ট আচরণই এমন! কম্পোনেন্ট ট্রির কোনো একটা চাইল্ডে আনহ্যান্ডেলড রেন্ডারিং
        এরর হলে React পুরো UI unmount করে ফেলে — কারণ একটা ভাঙা ট্রি রেন্ডার করার চেয়ে কিছুই না
        দেখানো নিরাপদ বলে ধরে নেয়।
      </Line>

      <Line name="নেক্সট-ভাই">
        একদম! অ্যাপের একটা ছোট সাইড-উইজেট ক্র্যাশ করলেও বাকি পুরো অ্যাপ যেন সচল থাকে — তার জন্য
        আমাদের error boundary ব্যবহার করে granular failure isolation নিশ্চিত করতে হবে!
      </Line>

      {/* ── Architecture ──────────────────────────────────────────────── */}
      <H2 id="architecture">১. Error Boundary &amp; Component Isolation Architecture</H2>

      <Diagram>{`┌─────────────────────────────────────────────────────────────────────────────┐
│                  ERROR BOUNDARY COMPONENT ISOLATION                         │
└─────────────────────────────────────────────────────────────────────────────┘

 Dashboard page component tree
          │
          ├── Header  🟢 working
          ├── Sidebar 🟢 working
          │
          └── Main content grid
               ├── SalesChart 🟢 working
               │
               └── WeatherWidget
                    │
                    ├── ❌ runtime exception
                    │      (cannot read properties of undefined)
                    ▼
           ┌───────────────────────────────────────────────┐
           │ <ErrorBoundary> wrapper                       │
           └───────────────────────────────────────────────┘
                    │
                    ▼
           🟢 local fallback UI — "Widget failed to load  [Retry]"
              the rest of the dashboard stays visible and interactive`}</Diagram>

      {/* ── Mechanisms ────────────────────────────────────────────────── */}
      <H2 id="mechanisms">২. কোর আর্কিটেকচারাল কনসেপ্ট</H2>

      <p>
        <strong>White-screen prevention:</strong> React অ্যাপে যেকোনো আনহ্যান্ডেলড রেন্ডারিং এরর ক্যাসকেড
        করে পুরো কম্পোনেন্ট ট্রি ধ্বংস করে দেয়। Error boundary এই এররকে উপরে উঠতে না দিয়ে নির্দিষ্ট
        বাউন্ডারির ভেতরে আটকে ফেলে।
      </p>

      <p>
        <strong>Class lifecycle vs declarative wrappers:</strong> React-এর ক্যাচিং মেকানিজম (
        <code>componentDidCatch</code> ও <code>getDerivedStateFromError</code>) মূলত class
        component-এ কাজ করে। আধুনিক কোডবেসে <code>react-error-boundary</code> লাইব্রেরি দিয়ে
        ডিক্লেয়ারেটিভভাবে ফাংশনাল কম্পোনেন্ট র‍্যাপ করা অনেক সুবিধাজনক।
      </p>

      <p>
        <strong>Granular isolation:</strong> পেজের ক্রুশিয়াল অংশ (নেভিগেশন, মেইন ফর্ম) থেকে
        নন-ক্রুশিয়াল অংশকে (অ্যানালিটিক্স উইজেট, রেকমেন্ডেশন কার্ড) আলাদা boundary-তে র‍্যাপ করলে একটি
        অংশ ফেইল করলেও সম্পূর্ণ ইউজার এক্সপেরিয়েন্স অটুট থাকে।
      </p>

      {/* ── Implementation ────────────────────────────────────────────── */}
      <H2 id="implementation">৩. Production Code Implementation</H2>

      <H3>❌ Anti-pattern — an unprotected component that takes the page down</H3>

      <CodeBlock filename="components/WeatherWidget.tsx">{`// 🔴 POOR PRACTICE: an unprotected widget
// any null/undefined in 'data' crashes the ENTIRE dashboard screen

interface WeatherData {
  weather: { temperature: number };
}

export function WeatherWidget({ data }: { data: WeatherData | null }) {
  // ❌ if data or data.weather is null, this throws and unmounts the whole tree
  return (
    <div className="p-4 border rounded">
      <h3>Current weather</h3>
      <p>Temp: {data!.weather.temperature}°C</p>
    </div>
  );
}`}</CodeBlock>

      <H3>🟢 Production pattern — an isolated component behind a boundary</H3>

      <p>
        <strong>Step 1 — রিইউজেবল উইজেট boundary।</strong>
      </p>

      <CodeBlock filename="components/WidgetErrorBoundary.tsx">{`// 🟢 PRODUCTION PATTERN: a granular boundary via 'react-error-boundary'
'use client';

import React from 'react';
import { ErrorBoundary, type FallbackProps } from 'react-error-boundary';

// a minimal fallback, sized to fit where the widget sat
function WidgetErrorFallback({ error, resetErrorBoundary }: FallbackProps) {
  return (
    <div className="p-4 border border-red-200 bg-red-50 rounded-lg text-sm text-red-700 space-y-2">
      <p className="font-semibold">উইজেট লোড হতে সমস্যা হয়েছে!</p>
      <p className="text-xs text-red-500 font-mono truncate">{error.message}</p>
      <button
        onClick={resetErrorBoundary}
        className="px-3 py-1 bg-red-600 text-white rounded text-xs hover:bg-red-700"
      >
        পুনরায় চেষ্টা করুন
      </button>
    </div>
  );
}

interface Props {
  children: React.ReactNode;
  onReset?: () => void;
}

export function WidgetErrorBoundary({ children, onReset }: Props) {
  return (
    <ErrorBoundary
      FallbackComponent={WidgetErrorFallback}
      onReset={onReset}
      onError={(error, info) => {
        // 🟢 an isolated failure is still a failure — report it
        console.error('Widget error isolated:', error, info.componentStack);
      }}
    >
      {children}
    </ErrorBoundary>
  );
}`}</CodeBlock>

      <p>
        <strong>Step 2 — ড্যাশবোর্ডে নিরাপদ ব্যবহার।</strong>
      </p>

      <CodeBlock filename="app/dashboard/page.tsx">{`// 🟢 PRODUCTION PATTERN: isolating independent dashboard widgets
import { WidgetErrorBoundary } from '@/components/WidgetErrorBoundary';
import { WeatherWidget } from '@/components/WeatherWidget';
import { SalesChart } from '@/components/SalesChart';

export default function DashboardPage() {
  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold">অ্যাডমিন ড্যাশবোর্ড</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* the chart survives even when the weather widget throws */}
        <div className="border p-4 rounded-lg">
          <SalesChart />
        </div>

        {/* 🟢 wrapped in its own boundary */}
        <WidgetErrorBoundary>
          <WeatherWidget data={null} />
        </WidgetErrorBoundary>
      </div>
    </div>
  );
}`}</CodeBlock>

      {/* ── Matrix ────────────────────────────────────────────────────── */}
      <H2 id="matrix">৪. Error Boundary Strategy Comparison</H2>

      <Table
        head={["স্ট্র্যাটেজি", "Blast radius", "ইউজার এক্সপেরিয়েন্স", "অ্যাপ ব্যবহারের সুযোগ"]}
        rows={[
          [
            "No error boundary",
            "সম্পূর্ণ অ্যাপ 🔴",
            "White screen of death 🔴",
            "শূন্য — ইউজার ব্লকড 🔴",
          ],
          [
            "Global page boundary only",
            "পুরো পেজ লেআউট 🟡",
            "একটি জেনেরিক এরর বার্তা 🟡",
            "আংশিক নেভিগেশন 🟡",
          ],
          [
            "Granular widget boundaries",
            "কেবল ক্ষতিগ্রস্ত উইজেট 🟢",
            "বাকি পেজ নিখুঁত কাজ করে 🟢",
            "সর্বোচ্চ — resilient UI 🟢",
          ],
        ]}
      />

      <Line name="ভুলু ভাই">
        দুর্দান্ত সমাধান ফাহিম! ড্যাশবোর্ডের প্রতিটি উইজেটকে আলাদা error boundary-তে র‍্যাপ করার পর
        এখন ওয়েদার উইজেট ফেইল করলেও বাকি পুরো ড্যাশবোর্ড একদম স্মুথলি চলতে থাকে!
      </Line>

      {/* ── Takeaways ─────────────────────────────────────────────────── */}
      <H2 id="takeaway">Production Takeaways</H2>

      <Note>
        <ul>
          <li>
            <strong>Protect independent widgets:</strong> থার্ড-পার্টি বা আনস্টেবল ডেটা সোর্স নির্ভর
            উইজেটগুলোকে একক <code>WidgetErrorBoundary</code>-তে মুড়িয়ে ফেলুন।
          </li>
          <li>
            <strong>Give the user a way out:</strong> কেবল এরর মেসেজ না দেখিয়ে{" "}
            <code>resetErrorBoundary</code> বাটনের সাহায্যে ডাটা রি-ফেচ বা স্টেট রিকভার করার সুযোগ
            দিন।
          </li>
          <li>
            <strong>Log isolated failures:</strong> <code>onError</code> কলব্যাকে নিরবে সাইডলাইনড হয়ে
            যাওয়া এররগুলো Sentry বা পছন্দের মনিটরিং টুলে পাঠান — নাহলে ভাঙা উইজেট বছরখানেক ভাঙাই থেকে
            যায়।
          </li>
        </ul>
      </Note>
    </article>
  );
}
