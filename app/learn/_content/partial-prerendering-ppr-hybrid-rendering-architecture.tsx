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
      bn: "৯০% স্ট্যাটিক, ১০% ডাইনামিক",
      en: "90% static, 10% dynamic",
    },
  },
  {
    id: "how-it-works",
    label: { bn: "PPR কীভাবে কাজ করে", en: "How PPR works" },
  },
  {
    id: "implementation",
    label: { bn: "PPR-এর কোড", en: "Writing PPR code" },
  },
  {
    id: "matrix",
    label: { bn: "Static, Dynamic ও PPR", en: "Static, dynamic and PPR" },
  },
  {
    id: "takeaway",
    label: { bn: "Production Takeaways", en: "Production takeaways" },
  },
];

export default function PartialPrerendering() {
  return (
    <article className="doc-prose">
      {/* ── The problem ───────────────────────────────────────────────── */}
      <H2 id="the-problem" anchorOnly>
        ৯০% স্ট্যাটিক, ১০% ডাইনামিক
      </H2>

      <p>
        রাত ১টা। ভুলু ভাই একটি ই-কমার্স প্রডাক্ট ডিটেইলস পেজ বানাচ্ছেন। প্রডাক্টের নাম,
        ডেসক্রিপশন, ইমেজ আর স্পেসিফিকেশন পুরো স্ট্যাটিক — যা সবার জন্য সমান। কিন্তু একই পেজের
        ভেতরে থাকা স্টক কাউন্ট, প্রাইসিং এবং &quot;Add to Cart&quot; বাটন পুরোপুরি ইউজারের
        জন্য ডাইনামিক!
      </p>

      <Line name="ভুলু ভাই">
        (হতাশ হয়ে) নেক্সট-ভাই! আমার প্রডাক্ট পেজের ৯০% কন্টেন্ট স্ট্যাটিক। কিন্তু ভেতরের ওই
        ৫-১০% ডাটা (রিয়েল-টাইম স্টক আর কার্ট স্ট্যাটাস) ডাইনামিক হওয়ার কারণে পুরো পেজটিকেই{" "}
        <code>force-dynamic</code> বানিয়ে রানটাইমে রেন্ডার করতে হচ্ছে! পুরো পেজের স্ট্যাটিক
        ক্যাশিং সুবিধা নষ্ট হয়ে যাচ্ছে!
      </Line>

      <Line name="ভুলু ভাই">
        আবার পুরো পেজকে স্ট্যাটিক বানালে রিয়েল-টাইম স্টক দেখানো যাচ্ছে না! একই পেজের কিছু
        অংশ Static আর কিছু অংশ Dynamic বানিয়ে ক্যাশ করার কোনো হাইব্রিড উপায় কি Next.js-এ
        নেই?!
      </Line>

      <Line name="নেক্সট-ভাই">
        (উত্তেজিত হয়ে) ভুলু! তুই ঠিক যে সমস্যার কথা বলছিস, সেটাই মডার্ন ওয়েব
        ডেভেলপমেন্টের হোলি গ্রেইল সমস্যা! আর Next.js এর পারফেক্ট সমাধান হিসেবে নিয়ে এসেছে{" "}
        <strong>Partial Prerendering (PPR)</strong> — এমন এক হাইব্রিড রেন্ডারিং মডেল, যা একই
        রুটের ভেতর Static এবং Dynamic দুটোকে একসাথে কম্বাইন করে!
      </Line>

      {/* ── How it works ──────────────────────────────────────────────── */}
      <H2 id="how-it-works">১. PPR কীভাবে কাজ করে</H2>

      <p>
        PPR-এর মূল মন্ত্র হলো: <strong>&quot;Static Shell + Streamed Dynamic Holes&quot;</strong>।
      </p>

      <Diagram>{`[ Build Time ] ──► Prerender the static shell (header, product info, footer)
                   └── Leave "holes" (Suspense boundaries) for the dynamic parts

[ User Request ]
 ├── 1. Instantly serve the static shell from the edge CDN 🚀
 └── 2. Stream the dynamic components (stock / cart) into the holes

┌─────────────────────────────────────────────────────────┐
│ [Static Shell] Product title & images (loaded instantly)│
├─────────────────────────────────────────────────────────┤
│ 🌀 [Dynamic Hole] Real-time price & stock (streaming…)  │
├─────────────────────────────────────────────────────────┤
│ [Static Shell] Reviews & description (instant)          │
└─────────────────────────────────────────────────────────┘`}</Diagram>

      {/* ── Implementation ────────────────────────────────────────────── */}
      <H2 id="implementation">২. PPR-এর কোড</H2>

      <Line name="ভুলু ভাই">
        নেক্সট-ভাই! এর জন্য কি আমাকে কোনো জটিল কনফিগারেশন বা এক্সট্রা কোড লিখতে হবে?
      </Line>

      <Line name="নেক্সট-ভাই">
        একদম না! PPR-এর সৌন্দর্য হলো — আলাদা কোনো জটিল API শিখতে হবে না! তুই শুধু রিয়েক্টের{" "}
        <code>&lt;Suspense&gt;</code> বাউন্ডারি ব্যবহার করবি, আর Next.js ব্যাকগ্রাউন্ডে বুঝে
        নেবে কোনটা স্ট্যাটিক শেল আর কোনটা ডাইনামিক হোল!
      </Line>

      <H3>Step 1 — কনফিগে PPR চালু করা</H3>

      <CodeBlock filename="next.config.ts">{`import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  experimental: {
    ppr: 'incremental', // Enables PPR per-route (or globally)
  },
};

export default nextConfig;`}</CodeBlock>

      <H3>Step 2 — স্ট্যাটিক কন্টেন্টের সাথে Suspense বাউন্ডারি</H3>

      <CodeBlock filename="app/products/[id]/page.tsx">{`import { Suspense } from 'react';
import { StaticProductDetails } from '@/components/ProductDetails';
import { DynamicStockAndPrice, StockSkeleton } from '@/components/DynamicStock';

// ⚡ Explicitly opt this route segment in to PPR
export const experimental_ppr = true;

export default async function ProductPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  return (
    <main className="p-8 max-w-4xl mx-auto space-y-6">
      {/* 🚀 1. STATIC SHELL — prerendered at build time, served instantly */}
      <StaticProductDetails productId={id} />

      {/* ⚡ 2. DYNAMIC HOLE — Next.js prerenders the fallback into the static
              HTML shell, then streams the real component over the response. */}
      <Suspense fallback={<StockSkeleton />}>
        <DynamicStockAndPrice productId={id} />
      </Suspense>
    </main>
  );
}`}</CodeBlock>

      <CodeBlock filename="components/DynamicStock.tsx">{`import { cookies } from 'next/headers';

export async function DynamicStockAndPrice({ productId }: { productId: string }) {
  // ⚡ Dynamic function read at runtime
  const cookieStore = await cookies();
  const userRegion = cookieStore.get('region')?.value ?? 'BD';

  // Fetch real-time price & inventory
  const data = await fetch(
    \`https://api.example.com/stock/\${productId}?region=\${userRegion}\`,
    { cache: 'no-store' },
  ).then((r) => r.json());

  return (
    <div className="p-4 border rounded-lg bg-blue-50">
      <p className="text-xl font-bold">Price: ৳{data.price}</p>
      <p className="text-sm text-green-600">In Stock: {data.stockCount} items left</p>
    </div>
  );
}

export function StockSkeleton() {
  return <div className="h-16 w-full animate-pulse bg-gray-200 rounded-lg" />;
}`}</CodeBlock>

      {/* ── Matrix ────────────────────────────────────────────────────── */}
      <H2 id="matrix">৩. Static, Dynamic ও PPR</H2>

      <Table
        head={["বৈশিষ্ট্য", "Static", "Dynamic", "PPR"]}
        rows={[
          [
            "Initial TTFB",
            "🚀 প্রায় শূন্য (Edge CDN)",
            "🐢 ধীর (Server compute)",
            "🚀 প্রায় শূন্য (Static shell)",
          ],
          [
            "Personalized / Real-time",
            "❌ সম্ভব নয়",
            "✅ পুরোপুরি সমর্থিত",
            "✅ স্ট্রিমিংয়ের মাধ্যমে",
          ],
          [
            "Server Compute",
            "🟢 জিরো",
            "🔴 প্রতি রিকোয়েস্টে হাই",
            "🟡 কেবল ডাইনামিক হোলের জন্য",
          ],
          [
            "টেকনিক",
            "Build-time HTML",
            "Run-time server rendering",
            "Static shell + Suspense streaming",
          ],
        ]}
      />

      <Line name="ভুলু ভাই">
        (আনন্দে নাচতে বাকি!) অসাম! পেজের বড় অংশ স্ট্যাটিক শেল হিসেবে ক্যাশড হয়ে ইনস্ট্যান্ট
        ভেসে উঠল, আর ভেতরের ডাইনামিক অংশে স্কেলেটন দেখিয়ে ব্যাকগ্রাউন্ডে আসল ডাটা স্ট্রিম
        হয়ে গর্তটা পূরণ করে ফেলল! Perceived Performance ১০০ গুণ বেড়ে গেল!
      </Line>

      <Line name="নেক্সট-ভাই">
        একদম পারফেক্ট ভুলু! Caching, Static/Dynamic Rendering, Router Cache, Revalidation
        Strategies, Asset Optimization, Code Splitting থেকে Bundle Audit — এই চ্যাপ্টারের
        প্রতিটি আর্কিটেকচারাল লেয়ারে এখন তোর সুদৃঢ় দখল চলে এসেছে!
      </Line>

      {/* ── Takeaways ─────────────────────────────────────────────────── */}
      <H2 id="takeaway">Production Takeaways</H2>

      <Note>
        <ul>
          <li>
            <strong>Suspense Granularity:</strong> PPR-এর পূর্ণ সুবিধা পেতে ডাইনামিক অংশগুলোকে
            যতটা সম্ভব ছোট ও নির্দিষ্ট <code>&lt;Suspense&gt;</code> সীমানার মধ্যে রাখুন, যাতে
            পেজের বড় অংশ স্ট্যাটিক শেল হিসেবে প্রাক-রেন্ডার হতে পারে।
          </li>
          <li>
            <strong>No Waterfall Streams:</strong> একাধিক ডাইনামিক কম্পোনেন্ট থাকলে সেগুলোকে
            স্বাধীন <code>&lt;Suspense&gt;</code> ব্লকে রাখুন, যাতে একটি ধীরগতির API পুরো
            পেজের স্ট্রিমিং আটকে না রাখে।
          </li>
          <li>
            <strong>Future of Web Standards:</strong> PPR মূলত SSG আর SSR-এর মধ্যকার বৈষম্য
            দূর করে দেয় — এটিই Next.js ও React ইকোসিস্টেমের ভবিষ্যৎ।
          </li>
        </ul>
      </Note>
    </article>
  );
}
