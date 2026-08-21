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
      bn: "টাইমার, নাকি Publish বাটন?",
      en: "A timer, or the publish button?",
    },
  },
  {
    id: "flow",
    label: { bn: "দুই প্যাটার্নের মেকানিজম", en: "The two patterns" },
  },
  {
    id: "time-based",
    label: { bn: "Time-based Revalidation (ISR)", en: "Time-based revalidation" },
  },
  {
    id: "on-demand",
    label: {
      bn: "On-demand: revalidatePath বনাম revalidateTag",
      en: "On-demand: revalidatePath vs revalidateTag",
    },
  },
  {
    id: "matrix",
    label: { bn: "দুটোর তুলনা", en: "Comparing the two" },
  },
  {
    id: "takeaway",
    label: { bn: "Production Takeaways", en: "Production takeaways" },
  },
];

export default function RevalidationStrategies() {
  return (
    <article className="doc-prose">
      {/* ── The problem ───────────────────────────────────────────────── */}
      <H2 id="the-problem" anchorOnly>
        টাইমার, নাকি Publish বাটন?
      </H2>

      <p>
        রাত ৯টা। ভুলু ভাই একটি সংবাদ ওয়েবসাইটের প্রজেক্ট বানাচ্ছেন। তিনি দ্বিধায় পড়ে গেছেন
        — খবরের মতো সেনসিটিভ সাইটে ডাটা কীভাবে রিভ্যালিডেট করবেন? খবর প্রতি ১ মিনিট পরপর
        নতুন করে রেন্ডার হবে? নাকি সম্পাদক ব্যাকঅফিসে &quot;Publish&quot; বাটনে ক্লিক করার
        সাথে সাথে রিয়েল-টাইমে ডাটা রিভ্যালিডেট হবে?!
      </p>

      <Line name="ভুলু ভাই">
        নেক্সট-ভাই! আমরা শিখেছি Next.js ডাটা স্থায়ীভাবে Data Cache আর Full Route Cache-এ
        স্টোর করে ফেলে। কিন্তু ওয়েবসাইটে যখন কোনো তথ্য বদলায়, তখন পুরোনো ক্যাশ ফেলে দিয়ে
        কীভাবে ফ্রেশ ডাটা ইউজারের স্ক্রিনে ফায়ার করব? এর কি নির্দিষ্ট কোনো স্ট্র্যাটেজি আছে,
        নাকি আন্দাজে যা ইচ্ছে ব্যবহার করলেই হবে?!
      </Line>

      <Line name="নেক্সট-ভাই">
        (কফির কাপটা রেখে) একদম আন্দাজে করা যাবে না ভুলু! এখানেই আসে Next.js-এর অন্যতম
        মাস্টারপিস স্থাপত্য — <strong>Revalidation Strategies</strong>! ক্যাশড ডাটাকে
        ইনভ্যালিডেট করে তাজা করার জন্য Next.js প্রধানত ২টি মেকানিজম অফার করে: Time-based
        (Periodic / ISR) আর On-demand (Event-driven)।
      </Line>

      {/* ── Flow ──────────────────────────────────────────────────────── */}
      <H2 id="flow">১. দুই প্যাটার্নের মেকানিজম</H2>

      <Diagram>{`Pattern A: Time-based ISR (Stale-While-Revalidate)
[Request] ──► [Is Cache Expired? (> 60s)]
                     ├── NO  ──► Serve stale cached data instantly (0ms)
                     └── YES ──► Serve stale data NOW + trigger background re-fetch
                                 └── The NEXT request gets the fresh data!

Pattern B: On-Demand Revalidation (Event Driven)
[CMS / Database Action] ──► Call revalidateTag('news')
                        ──► Instantly purge Data Cache & Route Cache
                        ──► The NEXT incoming user gets fresh data immediately!`}</Diagram>

      {/* ── Time-based ───────────────────────────────────────────────── */}
      <H2 id="time-based">২. Time-based Revalidation (ISR)</H2>

      <Line name="নেক্সট-ভাই">
        যখন তোর ডাটা কিছুটা বিরতি দিয়ে বদলায় (ব্লগ পোস্ট, শেয়ার মার্কেট সামারি, আবহাওয়ার
        আপডেট), কিন্তু সেকেন্ডের ওপর নির্ভর করতে হয় না — তখন Time-based Revalidation!
      </Line>

      <p>
        এটি Stale-While-Revalidate নীতিতে কাজ করে। নির্দিষ্ট সময় পার হওয়ার পর প্রথম হিট করা
        ইউজার সে মুহূর্তে পুরোনো ক্যাশটাই দেখবে, তবে ব্যাকগ্রাউন্ডে Next.js নিঃশব্দে ফ্রেশ
        ডাটা এনে নতুন ক্যাশ রেডি করে ফেলবে।
      </p>

      <H3>Option 1 — Fetch level</H3>

      <CodeBlock filename="app/news/page.tsx">{`// app/news/page.tsx
export default async function NewsPage() {
  // ⚡ Revalidate this fetch request every 60 seconds
  const res = await fetch('https://api.example.com/top-news', {
    next: { revalidate: 60 },
  });
  const articles = await res.json();

  return <div>Articles count: {articles.length}</div>;
}`}</CodeBlock>

      <H3>Option 2 — Route segment level</H3>

      <CodeBlock filename="app/products/page.tsx">{`// app/products/page.tsx

// 🚀 Revalidate every fetch in this route segment every 5 minutes
export const revalidate = 300;

export default async function ProductsPage() {
  const products = await getProducts(); // Implicitly inherits the 300s window
  return <div>Products Page</div>;
}`}</CodeBlock>

      {/* ── On-demand ─────────────────────────────────────────────────── */}
      <H2 id="on-demand">৩. On-demand: revalidatePath বনাম revalidateTag</H2>

      <Line name="ভুলু ভাই">
        (আগ্রহী হয়ে) নেক্সট-ভাই! আমার ই-কমার্স সাইটে প্রডাক্টের দাম বা স্টক বদলালে তো আমি ১
        বা ৫ মিনিট অপেক্ষা করতে পারব না! অ্যাডমিন প্যানেলে চেঞ্জ হওয়ার সাথে সাথেই যেন
        ইউজারের ক্যাশ আপডেট হয়ে যায় — সেটা কীভাবে করব?!
      </Line>

      <Line name="নেক্সট-ভাই">
        সেখানে On-demand Revalidation! ইভেন্ট ঘটার সাথে সাথেই Server Action বা Route
        Handler থেকে নির্দিষ্ট পেজ বা ট্যাগের ক্যাশ ফ্লাশ করে দিবি।
      </Line>

      <H3>Option A — revalidatePath() (Path-based)</H3>

      <p>
        একটি নির্দিষ্ট URL রাউট এবং তার লেআউটের পুরো Full Route Cache সাফ করে দেয়।
      </p>

      <CodeBlock filename="app/actions/product.ts">{`'use server';

import { revalidatePath } from 'next/cache';

export async function updateProductPrice(productId: string, newPrice: number) {
  await db.product.update({ where: { id: productId }, data: { price: newPrice } });

  // ⚡ Purges the cache for the /products/[id] page instantly
  revalidatePath(\`/products/\${productId}\`);

  // 🚀 Optional: purge every sub-route beneath the /products layout
  // revalidatePath('/products', 'layout');
}`}</CodeBlock>

      <H3>Option B — revalidateTag() (Fine-grained, industry best practice)</H3>

      <p>
        একটি পেজ পুরো পুরোনো না করে, একাধিক জায়গায় ছড়ানো একই ডাটার ক্যাশ এক ক্লিকে সাফ করতে
        চাইলে — যেমন হোমপেজের Featured List, সাইডবারের Category List আর Product Detail Page
        একসাথে — ব্যবহার করতে হবে Cache Tags।
      </p>

      <CodeBlock filename="lib/dal/products.ts">{`// lib/dal/products.ts
import { unstable_cache } from 'next/cache';

export const getFeaturedProducts = unstable_cache(
  async () => await db.product.findMany({ where: { featured: true } }),
  ['featured-products-key'],
  {
    // ⚡ Attach semantic tags to this cached data
    tags: ['products-tag', 'featured-tag'],
  }
);`}</CodeBlock>

      <CodeBlock filename="app/actions/admin.ts">{`'use server';

import { revalidateTag } from 'next/cache';

export async function updateFeaturedProduct() {
  // Update the database…

  // 🚀 Instantly purges every cached query/page tagged 'featured-tag',
  //    no matter where it is used across the whole site.
  revalidateTag('featured-tag');
}`}</CodeBlock>

      {/* ── Matrix ────────────────────────────────────────────────────── */}
      <H2 id="matrix">৪. দুটোর তুলনা</H2>

      <Table
        head={[
          "বৈশিষ্ট্য",
          "Time-based (ISR)",
          "On-demand (revalidatePath / revalidateTag)",
        ]}
        rows={[
          [
            "ট্রিগার",
            "টাইমারভিত্তিক (Background Periodic Timer)",
            "ইভেন্টভিত্তিক (Server Action, Webhook, API)",
          ],
          [
            "রিয়েল-টাইমনেস",
            "এপ্রোক্সিমেট — নির্দিষ্ট সময় পর রিফ্রেশ",
            "ইনস্ট্যান্ট — সাথে সাথেই ফ্রেশ",
          ],
          [
            "সার্ভার লোড",
            "কম — predictable background re-fetch",
            "অ্যাকশন সাপেক্ষে প্রয়োজনীয় ফেচ",
          ],
          [
            "সেরা প্রয়োগক্ষেত্র",
            "ব্লগ পোস্ট, নিউজ সাইট, ট্রেন্ডিং টপিক, আবহাওয়া",
            "শপিং কার্ট, ইউজার প্রোফাইল, প্রাইসিং, ফর্ম সাবমিশন",
          ],
        ]}
      />

      <Line name="ভুলু ভাই">
        (হাততালি দিয়ে) ওয়াও নেক্সট-ভাই! ডাটা ঘন ঘন না বদলালে{" "}
        <code>revalidate = 300</code> ওয়ালা Time-based ISR, আর ডাটাবেজে চেঞ্জ হলে Server
        Action থেকে <code>revalidateTag(&apos;products&apos;)</code> ডেকে পুরো সাইটের ওই
        ট্যাগযুক্ত ক্যাশ সেকেন্ডের মধ্যে তাজা!
      </Line>

      {/* ── Takeaways ─────────────────────────────────────────────────── */}
      <H2 id="takeaway">Production Takeaways</H2>

      <Note>
        <ul>
          <li>
            <strong>Prefer revalidateTag over revalidatePath:</strong> পুরো পেজ রিভ্যালিডেট
            না করে নির্দিষ্ট ডাটা ফেচ রিভ্যালিডেট করা আর্কিটেকচারালি উন্নত ও সাশ্রয়ী।
          </li>
          <li>
            <strong>Webhook Integration:</strong> হেডলেস CMS (Contentful, Strapi, Sanity)
            থেকে ডাটা আপডেট হলে Route Handler (<code>/api/revalidate</code>)-এ Webhook
            পাঠিয়ে <code>revalidateTag()</code> চালানো জনপ্রিয় প্রোডাকশন প্র্যাকটিস।
          </li>
          <li>
            <strong>Background Stale Window:</strong> Time-based ISR-এ ট্রাফিক না এলে
            ব্যাকগ্রাউন্ডে অহেতুক রি-ফেচ হয় না, ফলে ব্যাকএন্ড API ও মেমোরির অপচয় রোধ হয়।
          </li>
        </ul>
      </Note>
    </article>
  );
}
