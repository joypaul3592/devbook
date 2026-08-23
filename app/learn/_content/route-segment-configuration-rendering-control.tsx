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
      bn: "লাইভ API বিল্ড-টাইমের ডাটা দিচ্ছে কেন?",
      en: "Why a live API serves build-time data",
    },
  },
  {
    id: "mental-model",
    label: { bn: "Static Optimization কীভাবে হয়", en: "How static optimization happens" },
  },
  {
    id: "cheatsheet",
    label: { bn: "Segment Options চিট-শিট", en: "Segment options cheat-sheet" },
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

export default function RouteSegmentConfiguration() {
  return (
    <article className="doc-prose">
      {/* ── The problem ───────────────────────────────────────────────── */}
      <H2 id="the-problem" anchorOnly>
        লাইভ API বিল্ড-টাইমের ডাটা দিচ্ছে কেন?
      </H2>

      <p>
        সন্ধ্যা ৫:০০। ভুলু ভাই একটি লাইভ স্টক মার্কেট প্রাইস API রাউট বানিয়েছেন। কিন্তু
        প্রোডাকশন বিল্ড দেওয়ার পর দেখছেন দাম আর আপডেট হচ্ছে না — Next.js সেটাকে বিল্ড টাইমে
        Static HTML হিসেবে ক্যাশ করে রেখে দিয়েছে।
      </p>

      <Line name="ভুলু ভাই">
        ফাহিম! আমার API রাউট লাইভ ডাটা না দিয়ে বিল্ড টাইমের পুরোনো ডাটা কেন ডেলিভারি দিচ্ছে
        ভাই?
      </Line>

      <Line name="ফাহিম">
        ভুলু ভাই! আপনি রাউটে কোনো <strong>Route Segment Config</strong> সেট করেননি। Next.js
        বিল্ডের সময় দেখেছে এই রাউটে কোনো ডাইনামিক ফাংশন (যেমন <code>cookies()</code> বা{" "}
        <code>headers()</code>) নেই, তাই সে স্বয়ংক্রিয়ভাবে এটাকে Static Optimization করে
        ক্যাশ করে ফেলেছে!
      </Line>

      <Line name="নেক্সট-ভাই">
        একদম সঠিক ডায়াগনোসিস! App Router-এ নির্দিষ্ট কোনো পেজ বা API রাউটের ক্যাশিং ও
        রেন্ডারিং বিহেভিয়ার জোরপূর্বক কন্ট্রোল করতে <strong>Route Segment Options</strong>{" "}
        ব্যবহার করা হয়। <code>export const dynamic = &apos;force-dynamic&apos;</code> দিলে
        পেজটি সবসময় লাইভ রেন্ডার (SSR) হবে, আর{" "}
        <code>export const revalidate = 60</code> দিলে ISR স্টাইলে প্রতি ৬০ সেকেন্ডে ক্যাশ
        আপডেট হবে।
      </Line>

      {/* ── Mental model ──────────────────────────────────────────────── */}
      <H2 id="mental-model">১. Static Optimization কীভাবে হয়</H2>

      <Diagram>{`Build time ──► Next.js scans the segment
                 │
                 ├── Found cookies() / headers() / searchParams / no-store?
                 │        └── YES ──► Dynamic (SSR on every request)
                 │
                 └── Nothing dynamic found
                          └── Static HTML baked at build time  <-- Bhulu's bug

Route segment config overrides that decision explicitly:
  export const dynamic = 'force-dynamic'   ──► always SSR
  export const revalidate = 60             ──► ISR, refreshed every 60s
  export const dynamic = 'force-static'    ──► always static`}</Diagram>

      {/* ── Cheat-sheet ───────────────────────────────────────────────── */}
      <H2 id="cheatsheet">২. Segment Options চিট-শিট</H2>

      <Table
        head={["অপশন", "ভ্যালু", "কাজ ও ব্যবহারের ক্ষেত্র"]}
        rows={[
          [
            <code key="d1">dynamic</code>,
            <code key="d2">&apos;auto&apos;</code>,
            "ডিফল্ট — Next.js ডাটা ফেচিং দেখে অটো ডিসিশন নেয়।",
          ],
          [
            <code key="d3">dynamic</code>,
            <code key="d4">&apos;force-dynamic&apos;</code>,
            "ক্যাশ সম্পূর্ণ বাইপাস করে প্রতি রিকোয়েস্টে অন-দ্য-ফ্লাই SSR করে।",
          ],
          [
            <code key="d5">dynamic</code>,
            <code key="d6">&apos;force-static&apos;</code>,
            "জোরপূর্বক বিল্ড টাইমে Static HTML বানিয়ে ফেলে।",
          ],
          [
            <code key="r1">revalidate</code>,
            <code key="r2">false | 0 | number</code>,
            "ISR-এর জন্য সেকেন্ড-ভিত্তিক ক্যাশ TTL সেট করে।",
          ],
          [
            <code key="f1">fetchCache</code>,
            <code key="f2">&apos;force-no-store&apos;</code>,
            "রাউটের ভেতরের সব fetch()-এর ক্যাশ অপশন no-store দিয়ে ওভাররাইড করে।",
          ],
          [
            <code key="ru1">runtime</code>,
            <code key="ru2">&apos;nodejs&apos; | &apos;edge&apos;</code>,
            "সেগমেন্টটি কোন রানটাইমে এক্সিকিউট হবে তা ঠিক করে।",
          ],
        ]}
      />

      {/* ── Implementation ────────────────────────────────────────────── */}
      <H2 id="implementation">৩. প্রোডাকশন কোড</H2>

      <H3>A — পিওর ডাইনামিক API রাউট</H3>

      <CodeBlock filename="app/api/live-ticker/route.ts">{`import { NextResponse } from 'next/server';

// Route segment config: force on-demand dynamic SSR execution
export const dynamic = 'force-dynamic';
export const fetchCache = 'force-no-store';

export async function GET() {
  const stockPrice = {
    symbol: 'NVDA',
    price: (Math.random() * 1000).toFixed(2),
    timestamp: new Date().toISOString(),
  };

  return NextResponse.json(stockPrice, {
    headers: {
      'Cache-Control': 'no-store, max-age=0',
    },
  });
}`}</CodeBlock>

      <H3>B — ISR দিয়ে সার্ভার বাঁচানো</H3>

      <CodeBlock filename="app/pricing/page.tsx">{`// Rebuilt in the background at most once every 60 seconds
export const revalidate = 60;

export default async function PricingPage() {
  const plans = await fetch('https://api.example.com/plans').then((r) => r.json());

  return (
    <ul className="space-y-2">
      {plans.map((plan: { id: string; name: string }) => (
        <li key={plan.id}>{plan.name}</li>
      ))}
    </ul>
  );
}`}</CodeBlock>

      <Line name="ভুলু ভাই">
        দুই লাইন এক্সপোর্ট যোগ করতেই টিকার লাইভ! আর প্রাইসিং পেজে{" "}
        <code>revalidate = 60</code> দিয়ে সার্ভারের চাপও কমল।
      </Line>

      {/* ── Takeaways ─────────────────────────────────────────────────── */}
      <H2 id="takeaway">Production Checklist</H2>

      <Note>
        <ul>
          <li>
            <strong>force-dynamic অতিরিক্ত ব্যবহার এড়ান:</strong> কথায় কথায়{" "}
            <code>force-dynamic</code> সেট করলে সার্ভারের ওপর প্রচণ্ড চাপ পড়ে এবং CDN Edge
            Caching-এর সুবিধা পাওয়া যায় না।
          </li>
          <li>
            <strong>Segment config + revalidation মেলান:</strong> যেসব ডাটা মিনিটে একবার
            বদলায়, সেগুলোতে <code>export const revalidate = 60</code> ব্যবহার করুন — সার্ভার
            সেভ হবে, ব্যাকগ্রাউন্ডে ISR ক্যাশ রিনিউ হতে থাকবে।
          </li>
          <li>
            <strong>কনফিগ স্ট্যাটিকভাবে অ্যানালাইজেবল হতে হবে:</strong> এই এক্সপোর্টগুলো
            বিল্ড টাইমে পড়া হয় — ভেরিয়েবল বা কন্ডিশনাল ভ্যালু দেওয়া যাবে না, লিটারাল দিতে
            হবে।
          </li>
        </ul>
      </Note>
    </article>
  );
}
