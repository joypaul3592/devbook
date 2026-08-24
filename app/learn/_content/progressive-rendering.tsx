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
      bn: "HTML এসে গেছে, তবু বাটন ডেড",
      en: "HTML has arrived, the button is dead",
    },
  },
  {
    id: "architecture",
    label: { bn: "Selective Hydration মেকানিক্স", en: "Selective hydration mechanics" },
  },
  {
    id: "mechanisms",
    label: { bn: "৩টি আন্ডার-দ্য-হুড মেকানিজম", en: "Three under-the-hood mechanisms" },
  },
  {
    id: "implementation",
    label: { bn: "Monolithic বনাম বাউন্ডারি-চালিত", en: "Monolithic vs boundary-driven" },
  },
  {
    id: "matrix",
    label: { bn: "Hydration Comparison", en: "Hydration comparison" },
  },
  {
    id: "takeaway",
    label: { bn: "Production Takeaways", en: "Production takeaways" },
  },
];

export default function ProgressiveRendering() {
  return (
    <article className="doc-prose">
      {/* ── The problem ───────────────────────────────────────────────── */}
      <H2 id="the-problem" anchorOnly>
        HTML এসে গেছে, তবু বাটন ডেড
      </H2>

      <p>
        রাত ২:১৫। ভুলু ভাই একটি ই-কমার্স প্রোডাক্ট পেজ টেস্ট করছিলেন। HTML স্ট্রিম হয়ে ব্রাউজারে
        সুন্দরভাবে দেখাচ্ছে। কিন্তু ওপরের ভারী <code>ImageGallery</code> কম্পোনেন্টটি হাইড্রেট
        হওয়ার সময় নিচের &quot;Add to Cart&quot; বাটনে ক্লিক করলে কোনো সাড়া নেই! প্রায় ২ সেকেন্ড
        পর বাটন কাজ করা শুরু করেছে।
      </p>

      <Line name="ভুলু ভাই">
        ফাহিম! HTML তো আগেই স্ক্রিনে চলে এলো, তাও ক্লিক করলে পেজ ২ সেকেন্ড দেরি করছে কেন? আর একটি
        কম্পোনেন্ট হাইড্রেট হওয়ার সময় বাকি বাটনগুলো ডেড হয়ে থাকে কেন?
      </Line>

      <Line name="ফাহিম">
        ভুলু ভাই! ট্র্যাডিশনাল React-এ হাইড্রেশন হতো <strong>all-or-nothing waterfall</strong>{" "}
        মডেলে — পুরো পেজের JS ডাউনলোড ও ওপর থেকে নিচে সব কম্পোনেন্ট হাইড্রেট না হওয়া পর্যন্ত main
        thread ব্লক থাকত। React 18+ এ Selective Hydration আসার পর আর বসে থাকতে হয় না!
      </Line>

      <Line name="নেক্সট-ভাই">
        একদম! React পেজকে ছোট ছোট <code>&lt;Suspense&gt;</code> চাঙ্কে ভাগ করে দেয়। শুধু তাই নয় —
        হাইড্রেশন চলাকালীন ইউজার যে কম্পোনেন্টে ক্লিক করে, React মুহূর্তে তার hydration priority
        বদলে সেটিকে আগে হাইড্রেট করে ক্লিক ইভেন্টটি replay করে দেয়!
      </Line>

      {/* ── Architecture ──────────────────────────────────────────────── */}
      <H2 id="architecture">১. Selective Hydration ও Priority</H2>

      <Diagram>{`┌─────────────────────────────────────────────────────────────────────────┐
│              SELECTIVE HYDRATION & INTERACTION RE-PRIORITISATION        │
└─────────────────────────────────────────────────────────────────────────┘

 TRADITIONAL ALL-OR-NOTHING HYDRATION:
 Download heavy JS ──▶ hydrate component A ──▶ hydrate component B ──▶ thread unblocked
 (user clicks B here) ──▶ IGNORED / frozen until A finishes

 -------------------------------------------------------------------------

 REACT 18+ SELECTIVE HYDRATION (with interaction re-priority):
 [ Component A (heavy gallery) ] ──▶ currently hydrating (normal priority)
                                          │
                                          ▼   USER CLICKS HERE
 [ Component B (add to cart)   ] ──▶ React intercepts the click event
                                          │
                                          ▼
                                 pause component A's hydration
                                 hydrate component B immediately
                                 replay the captured click event`}</Diagram>

      {/* ── Mechanisms ────────────────────────────────────────────────── */}
      <H2 id="mechanisms">২. ৩টি আন্ডার-দ্য-হুড মেকানিজম</H2>

      <Note>
        <ul>
          <li>
            <strong>Splitting hydration via Suspense:</strong> কোনো ক্লায়েন্ট কম্পোনেন্টকে{" "}
            <code>&lt;Suspense&gt;</code> দিয়ে মোড়ালে React সেটির হাইড্রেশনকে মূল ট্রি থেকে আলাদা
            করে ফেলে — একটি ভারী কম্পোনেন্টের জন্য অন্য স্বাধীন কম্পোনেন্টের হাইড্রেশন আটকে থাকে
            না।
          </li>
          <li>
            <strong>Progressive hydration:</strong> HTML স্ট্রিম হওয়ার পর যে অংশের JS আগে
            ডাউনলোড হয়, শুধু সেটুকুই হাইড্রেট হয়ে ইন্টার‌্যাক্টিভ হয়ে যায়। বাকি পেজ লোড হতে থাকলেও
            তৈরি হওয়া বাটনগুলো কাজ শুরু করে দেয়।
          </li>
          <li>
            <strong>Event capture &amp; replay:</strong> হাইড্রেট হয়নি এমন কম্পোনেন্টে ক্লিক করলে
            React ইভেন্ট ক্যাপচার ফেজেই সেটি ধরে ফেলে, চলমান হাইড্রেশন টাস্ক পজ করে ওই কম্পোনেন্টকে
            top priority-তে হাইড্রেট করে, তারপর ইভেন্টটি replay করে।
          </li>
        </ul>
      </Note>

      {/* ── Implementation ────────────────────────────────────────────── */}
      <H2 id="implementation">৩. Monolithic বনাম বাউন্ডারি-চালিত</H2>

      <H3>❌ Anti-pattern — পুরো পেজ একটাই ক্লায়েন্ট কম্পোনেন্ট</H3>

      <CodeBlock filename="app/product/[id]/page.tsx">{`'use client';

import { ImageGallery } from './heavy-gallery';
import { ProductSpecs } from './heavy-specs';

export default function BadProductPage() {
  // Monolithic hydration: "Buy Now" is dead until the gallery's JS is parsed
  return (
    <div className="space-y-6">
      <ImageGallery /> {/* 1.5MB JS bundle */}
      <ProductSpecs />
      <button onClick={() => alert('Added!')} className="btn-primary">
        Buy Now
      </button>
    </div>
  );
}`}</CodeBlock>

      <H3>🟢 Fix — Suspense-driven hydration boundaries</H3>

      <CodeBlock filename="app/product/[id]/page.tsx">{`import { Suspense } from 'react';
import 'server-only';
import { BuyButton } from './_components/buy-button';
import { HeavyGalleryClient } from './_components/heavy-gallery-client';

export default function OptimizedProductPage() {
  return (
    <main className="max-w-4xl mx-auto py-10 px-6 space-y-8 bg-slate-950 text-slate-100">
      <h1 className="text-2xl font-bold">Next-Gen Mechanical Keyboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* 1. The heavy client component gets its own hydration chunk */}
        <Suspense
          fallback={
            <div className="h-72 bg-slate-900 border border-slate-800 rounded-xl animate-pulse flex items-center justify-center text-xs text-slate-500">
              Loading gallery bundle...
            </div>
          }
        >
          <HeavyGalleryClient />
        </Suspense>

        <div className="space-y-6">
          <p className="text-slate-400 text-sm">
            Hot-swappable RGB mechanical keyboard with ultra-low latency.
          </p>

          {/* 2. A small independent client component — hydrates on its own */}
          <Suspense
            fallback={<div className="h-12 bg-slate-800 rounded-lg animate-pulse" />}
          >
            <BuyButton productId="kb-900" />
          </Suspense>
        </div>
      </div>
    </main>
  );
}`}</CodeBlock>

      <CodeBlock filename="app/product/[id]/_components/buy-button.tsx">{`'use client';

import { useState } from 'react';

export function BuyButton({ productId }: { productId: string }) {
  const [isAdding, setIsAdding] = useState(false);

  const handleAddToCart = () => {
    setIsAdding(true);
    setTimeout(() => setIsAdding(false), 1000);
  };

  return (
    <button
      onClick={handleAddToCart}
      disabled={isAdding}
      className="w-full py-3 px-6 bg-emerald-600 hover:bg-emerald-500 text-white font-semibold rounded-xl transition-colors shadow-lg shadow-emerald-950/50 disabled:opacity-50"
    >
      {isAdding ? 'Adding to cart...' : 'Add to cart'}
    </button>
  );
}`}</CodeBlock>

      <Note>
        <p>
          এখানে <code>BuyButton</code>-এর চারপাশের বাউন্ডারিটির কাজ fallback দেখানো নয় — কম্পোনেন্টটি
          কোনো promise throw করে না, তাই স্কেলিটনটি সাধারণত দেখাই যায় না। এর আসল উদ্দেশ্য হলো
          React-কে একটি আলাদা <strong>hydration chunk</strong> সীমানা দেওয়া, যাতে ভারী গ্যালারির
          হাইড্রেশন এই বাটনের ইন্টার‌্যাক্টিভিটি আটকে রাখতে না পারে।
        </p>
      </Note>

      {/* ── Matrix ────────────────────────────────────────────────────── */}
      <H2 id="matrix">৪. Hydration Architecture Comparison</H2>

      <Table
        head={[
          "বৈশিষ্ট্য",
          "Monolithic hydration",
          "Selective hydration",
          "Selective + user click",
        ]}
        rows={[
          [
            "Hydration sequence",
            "কঠোর top-to-bottom waterfall",
            "স্বাধীন চাঙ্ক, যেটির কোড রেডি",
            "ডাইনামিক প্রায়োরিটি — ইউজার আগে",
          ],
          [
            "Main thread blocking",
            "মারাত্মক — সব JS parse হওয়া পর্যন্ত",
            "মিনিমাল — ছোট চাঙ্কে বিভক্ত",
            "প্রায় শূন্য — ইনস্ট্যান্ট click replay",
          ],
          [
            "INP",
            "হাই — বাটন ল্যাগি",
            "লো",
            "আল্ট্রা-লো",
          ],
          [
            "Bundle",
            "একটাই মেগা বান্ডল",
            "অটোমেটিক কোড-স্প্লিটিং",
            "অটোমেটিক কোড-স্প্লিটিং",
          ],
        ]}
      />

      <Line name="ভুলু ভাই">
        ওয়াও! Suspense ব্যবহার করলে React হাইড্রেশন চাঙ্কগুলো আলাদা করে দেয়। ফলে গ্যালারির ভারী JS
        লোড হওয়ার আগেই ইউজার &quot;Add to Cart&quot;-এ ক্লিক করলে React আগে ওই বাটনের হাইড্রেশন শেষ
        করে ইভেন্ট replay করে দেয়!
      </Line>

      {/* ── Takeaways ─────────────────────────────────────────────────── */}
      <H2 id="takeaway">Production Takeaways</H2>

      <Note>
        <ul>
          <li>
            <strong>Wrap heavy client components:</strong> chart, 3D canvas বা rich text editor-এর
            মতো ভারী লাইব্রেরি-নির্ভর কম্পোনেন্ট সবসময় আলাদা <code>&lt;Suspense&gt;</code>{" "}
            বাউন্ডারিতে রাখুন।
          </li>
          <li>
            <strong>Maximise the server component ratio:</strong> পেজে ক্লায়েন্ট কম্পোনেন্ট যত কম,
            ব্রাউজারকে তত কম JS হাইড্রেট করতে হয় — INP তত ভালো থাকে।
          </li>
          <li>
            <strong>Trust React&apos;s event replay:</strong> হাইড্রেশনের আগে ক্লিক করলেও ইভেন্ট
            হারায় না — আপনার কাজ শুধু বাউন্ডারি দিয়ে React-কে চাঙ্ক আলাদা করার সুযোগ দেওয়া।
          </li>
        </ul>
      </Note>
    </article>
  );
}
