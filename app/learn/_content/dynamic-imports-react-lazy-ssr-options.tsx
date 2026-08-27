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
      bn: "window is not defined",
      en: "window is not defined",
    },
  },
  {
    id: "architecture",
    label: {
      bn: "React.lazy বনাম next/dynamic",
      en: "React.lazy vs next/dynamic",
    },
  },
  {
    id: "strategies",
    label: {
      bn: "SSR-এর ৩টি মূল কৌশল",
      en: "Three SSR strategies",
    },
  },
  {
    id: "implementation",
    label: {
      bn: "Crash বনাম SSR-controlled import",
      en: "Crash vs SSR-controlled import",
    },
  },
  {
    id: "matrix",
    label: { bn: "Loading Strategy Matrix", en: "Loading strategy matrix" },
  },
  {
    id: "takeaway",
    label: { bn: "Production Takeaways", en: "Production takeaways" },
  },
];

export default function DynamicImportsReactLazySsrOptions() {
  return (
    <article className="doc-prose">
      {/* ── The problem ───────────────────────────────────────────────── */}
      <H2 id="the-problem" anchorOnly>
        window is not defined
      </H2>

      <p>
        সন্ধ্যা ৬:০০। ভুলু ভাই তার অ্যাপ্লিকেশনে একটি Interactive Map (Leaflet.js) এবং Code Editor
        (Monaco Editor) যুক্ত করার পর রেন্ডার করতেই কনসোলে লাল লাল এরর মেসেজ ফুটে উঠেছে —{" "}
        <code>ReferenceError: window is not defined</code>! তাছাড়া standard <code>React.lazy</code>{" "}
        ব্যবহার করায় সার্ভার-সাইড রেন্ডারিং-এর সময় Hydration Mismatch ফেইলিয়র ঘটছে।
      </p>

      <Line name="ভুলু ভাই">
        ফাহিম! রিঅ্যাক্ট ডকুমেন্টেশনে তো লেখা আছে <code>React.lazy()</code> দিয়ে লাইব্রেরি অলসভাবে
        ইমপোর্ট করা যায়। কিন্তু নেক্সট.জেএস-এ <code>React.lazy</code> ব্যবহার করতেই সার্ভার থেকে
        রেন্ডার হওয়ার সময় <code>window is not defined</code> বা Hydration Error দিচ্ছে কেন? আর{" "}
        <code>next/dynamic</code>-এর বিশেষত্ব কী?
      </Line>

      <Line name="ফাহিম">
        ভুলু ভাই! কারণ vanilla <code>React.lazy()</code> তৈরি হয়েছিল বিশুদ্ধ ক্লায়েন্ট-সাইড (SPA)
        রিঅ্যাক্ট অ্যাপের জন্য, যেখানে সার্ভার রেন্ডারিংয়ের কোনো অস্তিত্ব ছিল না! কিন্তু Next.js-এ
        বাই-ডিফল্ট সবকিছু সার্ভারে ফার্স্ট-পাস রেন্ডার হতে চায়। যেসব লাইব্রেরি ব্রাউজারের{" "}
        <code>window</code> বা <code>document</code> অবজেক্টের ওপর নির্ভরশীল, সেগুলোকে সার্ভারে
        রেন্ডার করতে গেলেই Node.js ক্র্যাশ করে।
      </Line>

      <Line name="নেক্সট-ভাই">
        একদম! এজন্যই Next.js নিয়ে এসেছে <code>next/dynamic</code>! এটি <code>React.lazy</code> ও{" "}
        <code>Suspense</code>-এর ওপর তৈরি এমন একটি র‍্যাপার, যা <code>ssr: false</code> বা{" "}
        <code>ssr: true</code> অপশন টিউন করে সার্ভার ও ক্লায়েন্ট রেন্ডারিং বিহেভিয়ার পুরোপুরি
        কন্ট্রোল করতে দেয়। এটি শুধু জাভাস্ক্রিপ্ট চ্যাঙ্ক নয়, সাথে যুক্ত CSS ফাইলকেও আলাদা চ্যাঙ্কে
        স্প্লিট করে দেয়।
      </Line>

      {/* ── Architecture ──────────────────────────────────────────────── */}
      <H2 id="architecture">১. React.lazy vs. next/dynamic SSR Execution Pipeline</H2>

      <Diagram>{`┌─────────────────────────────────────────────────────────────────────────┐
│              VANILLA REACT.LAZY VS. NEXT/DYNAMIC PIPELINE               │
└─────────────────────────────────────────────────────────────────────────┘

 ❌ VANILLA REACT.LAZY (inside Next.js SSR)
 ┌───────────────────────────────────────────────────────────────────────┐
 │ Server attempts SSR ──► tries to evaluate window / document APIs      │
 │                                    │                                  │
 │                                    ▼                                  │
 │                     🔴 ReferenceError: window is not defined          │
 └───────────────────────────────────────────────────────────────────────┘

───────────────────────────────────────────────────────────────────────────

 🟢 NEXT/DYNAMIC WITH { ssr: false }
 ┌───────────────────────────────────────────────────────────────────────┐
 │ Server step:    emits the loading fallback / skeleton HTML            │
 │ Hydration step: downloads the async JS + CSS chunk                    │
 │ Mount step:     evaluates the window object safely, in the browser    │
 └───────────────────────────────────────────────────────────────────────┘`}</Diagram>

      {/* ── Strategies ────────────────────────────────────────────────── */}
      <H2 id="strategies">২. Dynamic Import ও SSR-এর ৩টি মূল কৌশল</H2>

      <p>
        <strong>
          <code>ssr: true</code> (default behavior):
        </strong>{" "}
        কম্পোনেন্টটি সার্ভার-সাইডে HTML হিসেবে রেন্ডার হবে (SEO friendly), কিন্তু এর ক্লায়েন্ট-সাইড
        হাইড্রেশন বান্ডলটি মূল পেজ লোডের সময় ডাউনলোড না হয়ে আলাদা async chunk হিসেবে অলসভাবে লোড
        হবে।
      </p>

      <p>
        <strong>
          <code>ssr: false</code> (client-side only isolation):
        </strong>{" "}
        কম্পোনেন্টটি সার্ভার রেন্ডারিং প্রসেস থেকে পুরোপুরি বাদ পড়ে যাবে। সার্ভার শুধু{" "}
        <code>loading</code> ফলব্যাক পাঠাবে; ব্রাউজারে জাভাস্ক্রিপ্ট এক্সিকিউট হলে তখনই কম্পোনেন্টটি
        মাউন্ট হবে। ব্রাউজার-DOM নির্ভর লাইব্রেরির জন্য এটি ১০০% নিরাপদ।
      </p>

      <p>
        <strong>Dynamic CSS ও sub-tree isolation:</strong> কোনো কম্পোনেন্ট{" "}
        <code>next/dynamic</code> দিয়ে ইমপোর্ট করলে সেই কম্পোনেন্টের নিজস্ব CSS (Module CSS বা
        CSS-in-JS) মূল ক্রিটিক্যাল CSS বান্ডল থেকে স্প্লিট হয়ে আলাদা হয়ে যায়। ফলে পেজের ফার্স্ট
        লোডে CSS-এর সাইজও নাটকীয়ভাবে কমে।
      </p>

      {/* ── Implementation ────────────────────────────────────────────── */}
      <H2 id="implementation">৩. Production Code Implementation</H2>

      <H3>❌ Anti-pattern — SSR-এর ভেতরে raw React.lazy</H3>

      <CodeBlock filename="app/dashboard/broken-map.tsx">{`// 🔴 POOR PRACTICE: raw React.lazy inside Next.js creates hydration & window errors
'use client';

import { lazy, Suspense, useState } from 'react';

// 🔴 Anti-pattern: React.lazy tries to evaluate window-dependent code during SSR
const MapComponent = lazy(() => import('@/components/InteractiveMap'));

export function BrokenDashboard() {
  const [showMap, setShowMap] = useState(false);

  return (
    <div className="p-6">
      <button onClick={() => setShowMap(true)}>Load map</button>

      {/* 🔴 May throw a hydration error, or "window is undefined" during build/SSR */}
      {showMap && (
        <Suspense fallback={<div>Loading map...</div>}>
          <MapComponent />
        </Suspense>
      )}
    </div>
  );
}`}</CodeBlock>

      <H3>🟢 Production pattern — next/dynamic + SSR control + named export</H3>

      <CodeBlock filename="components/InteractiveMap.tsx">{`'use client';

// Imagine Leaflet or Mapbox reaching for \`window\` / DOM elements internally
import 'leaflet/dist/leaflet.css'; // 🟢 The CSS is isolated into the same chunk

export function InteractiveMap({ location }: { location: string }) {
  if (typeof window !== 'undefined') {
    console.log('Accessing browser DOM width:', window.innerWidth);
  }

  return (
    <div className="h-72 w-full bg-slate-900 border border-slate-800 rounded-xl p-4 flex flex-col justify-between">
      <div className="flex justify-between items-center">
        <span className="text-xs font-mono text-emerald-400">● LIVE MAP ENGINE</span>
        <span className="text-xs text-slate-400">Target: {location}</span>
      </div>
      <div className="text-center text-slate-500 text-sm">
        [ Leaflet interactive canvas rendered safely on the client ]
      </div>
    </div>
  );
}`}</CodeBlock>

      <CodeBlock filename="app/dashboard/map/page.tsx">{`'use client';

import { useState } from 'react';
import dynamic from 'next/dynamic';

// 🟢 Dynamic import with an explicit SSR opt-out and a named export
const DynamicMap = dynamic(
  () => import('@/components/InteractiveMap').then((mod) => mod.InteractiveMap),
  {
    loading: () => (
      <div className="h-72 w-full bg-slate-900 border border-slate-800 rounded-xl animate-pulse flex items-center justify-center text-slate-500 text-sm">
        🗺️ Initializing GIS map assets...
      </div>
    ),
    ssr: false, // 🟢 Bypasses Node.js server evaluation completely
  },
);

export function OptimizedMapPage() {
  const [loadMap, setLoadMap] = useState(false);

  return (
    <div className="p-8 max-w-3xl mx-auto space-y-6 bg-slate-950 text-slate-100 min-h-screen">
      <div className="space-y-1">
        <h1 className="text-2xl font-bold">Location Analytics</h1>
        <p className="text-sm text-slate-400">
          Heavy map assets & CSS are lazy-loaded only when requested.
        </p>
      </div>

      {!loadMap ? (
        <button
          onClick={() => setLoadMap(true)}
          className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-medium rounded-lg transition-colors"
        >
          Load interactive map
        </button>
      ) : (
        <DynamicMap location="Dhaka, Bangladesh" />
      )}
    </div>
  );
}`}</CodeBlock>

      {/* ── Matrix ────────────────────────────────────────────────────── */}
      <H2 id="matrix">৪. Loading Strategy Feature Matrix</H2>

      <Table
        head={[
          "ফিচার / টুল",
          "React.lazy",
          "next/dynamic (ssr: true)",
          "next/dynamic (ssr: false)",
        ]}
        rows={[
          [
            "Server-side HTML rendering",
            "চেষ্টা করে — hydration risk 🔴",
            "হ্যাঁ 🟢 (SEO friendly)",
            "না — client-only isolation ⚡",
          ],
          [
            <span key="c">
              <code>window</code> / <code>document</code> safety
            </span>,
            "unsafe ❌",
            "unsafe ❌",
            "১০০% নিরাপদ 🟢",
          ],
          [
            "Suspense integration",
            <span key="c">
              <code>{"<Suspense>"}</code> আবশ্যক
            </span>,
            <span key="c">
              <code>loading</code> প্রপ দিয়ে অটো-হ্যান্ডেলড
            </span>,
            <span key="c">
              <code>loading</code> প্রপ দিয়ে অটো-হ্যান্ডেলড
            </span>,
          ],
          ["CSS chunk splitting", "সীমিত", "অটোমেটিক 🟢", "অটোমেটিক 🟢"],
          [
            "ব্যবহারের ক্ষেত্র",
            "Client component (SPA sub-tree)",
            "SEO দরকার এমন ভারী UI (chart, table)",
            "Browser canvas / editor / map",
          ],
        ]}
      />

      <Line name="ভুলু ভাই">
        এখন সব জলের মতো পরিষ্কার! <code>next/dynamic</code> দিয়ে{" "}
        <code>{"{ ssr: false }"}</code> দিলে আর কোনোদিন <code>window is not defined</code> এরর খাবে
        না, আর JS ও CSS বান্ডল সাইজও এক ধাক্কায় অর্ধেক হয়ে যাবে!
      </Line>

      {/* ── Takeaways ─────────────────────────────────────────────────── */}
      <H2 id="takeaway">Production Takeaways</H2>

      <Note>
        <ul>
          <li>
            <strong>Prefer next/dynamic in Next.js:</strong> সাধারণ <code>React.lazy</code>-র বদলে
            নেক্সট.জেএস প্রজেক্টে <code>next/dynamic</code> ব্যবহার করুন — এটি ফ্রেমওয়ার্কের
            বান্ডলিং সিস্টেমের সাথে খাপ খাইয়ে নেয়।
          </li>
          <li>
            <strong>Use ssr: false for DOM-centric libraries:</strong> যেসব লাইব্রেরি ইমপোর্ট করার
            সাথে সাথেই গ্লোবাল <code>window</code> বা <code>document</code> চেক করে, সেগুলোতে
            নির্দ্বিধায় <code>ssr: false</code> যোগ করুন।
          </li>
          <li>
            <strong>Combine fallbacks to prevent CLS:</strong> ডাইনামিক লোডিংয়ের সময় সবসময় সুন্দর
            skeleton বা spinner ফলব্যাক দিন, যাতে লেআউট শিফট না হয়।
          </li>
        </ul>
      </Note>
    </article>
  );
}
