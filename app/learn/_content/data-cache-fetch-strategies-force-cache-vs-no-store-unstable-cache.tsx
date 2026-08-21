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
      bn: "রিকোয়েস্ট শেষ, তবু পুরোনো ডাটা",
      en: "The request ended, the stale data didn't",
    },
  },
  {
    id: "strategies",
    label: { bn: "তিনটি Fetch Strategy", en: "The three fetch strategies" },
  },
  {
    id: "unstable-cache",
    label: {
      bn: "ORM কোয়েরির জন্য unstable_cache()",
      en: "unstable_cache() for ORM queries",
    },
  },
  {
    id: "matrix",
    label: { bn: "প্রিমিটিভগুলোর তুলনা", en: "Comparing the primitives" },
  },
  {
    id: "takeaway",
    label: { bn: "Production Takeaways", en: "Production takeaways" },
  },
];

export default function DataCacheFetchStrategies() {
  return (
    <article className="doc-prose">
      {/* ── The problem ───────────────────────────────────────────────── */}
      <H2 id="the-problem" anchorOnly>
        রিকোয়েস্ট শেষ, তবু পুরোনো ডাটা
      </H2>

      <p>
        বিকাল ৪টা। ভুলু ভাই তাঁর ল্যাপটপে প্রজেক্টের একটা ড্যাশবোর্ড দেখাচ্ছেন। ড্যাশবোর্ডে
        &quot;Total Revenue&quot; এবং &quot;Latest Orders&quot; উইজেট রয়েছে। সমস্যা হলো — নতুন
        অর্ডার হলেও রেভিনিউ আপডেট হচ্ছে না, আবার ইউজার প্রোফাইল পিকচার চেঞ্জ করার পরও পুরোনো
        পিকচার ক্যাশ হয়ে বসে থাকছে!
      </p>

      <Line name="ভুলু ভাই">
        নেক্সট-ভাই! একটু আগেই তো শিখলাম Request Memoization দিয়ে সিঙ্গেল রিকোয়েস্টের ভেতর
        ডুপ্লিকেট ফেচ ঠেকানো যায়। কিন্তু আমার সমস্যা তো রিকোয়েস্ট পার হয়ে যাওয়ার পর!
      </Line>

      <Line name="ভুলু ভাই">
        একজন ইউজার যখন ১ ঘণ্টা পর বা অন্য ব্রাউজার থেকে সাইটে আসছে, তখনও সে পুরোনো ক্যাশড
        ডাটা দেখতে পাচ্ছে! আবার কিছু ক্রুশিয়াল জায়গায় (পেমেন্ট স্ট্যাটাস, রিফান্ড হিস্ট্রি)
        আমি ১ সেকেন্ডের জন্যও ডাটা ক্যাশ রাখতে চাই না! এই Persistent Data Cache কন্ট্রোল
        করার স্ট্র্যাটেজিগুলো কী কী ভাই?!
      </Line>

      <Line name="নেক্সট-ভাই">
        (কফিতে চুমুক দিয়ে) আর্কিটেকচারের সবচেয়ে পাওয়ারফুল পার্টে চলে এসেছি ভুলু! Request
        Memoization ছিল শুধু একটিমাত্র রিকোয়েস্টের রেন্ডার সাইকেল পর্যন্ত। কিন্তু{" "}
        <strong>Data Cache</strong> হলো সার্ভারের ডিস্ক বা ফাইল-সিস্টেমে জমে থাকা Persistent
        Storage! ম্যানুয়ালি রিভ্যালিডেট বা টাইম-আউট না দিলে এটি একাধিক রিকোয়েস্ট ও একাধিক
        ইউজারের মধ্যে ক্যাশড ডাটা শেয়ার করতেই থাকবে।
      </Line>

      {/* ── Strategies ────────────────────────────────────────────────── */}
      <H2 id="strategies">১. তিনটি Fetch Strategy</H2>

      <Diagram>{`                      [fetch(url, options)]
                               │
            ┌──────────────────┴──────────────────┐
            ▼                                     ▼
 cache: 'force-cache'                     cache: 'no-store'
            │                                     │
            ▼                                     ▼
 [Data Cache-এ জমে থাকবে]              [ক্যাশ স্কিপ করে প্রতিবার হিট]
 (Static Page Rendering)               (Dynamic Page Rendering)`}</Diagram>

      <H3>Strategy A — Static Data (force-cache)</H3>

      <p>
        ফেচ করা ডাটা সার্ভারের Data Cache-এ স্থায়ীভাবে সেভ করে রাখে। ব্লগ পোস্ট, ল্যান্ডিং
        পেজের প্রাইসিং টেবিল, FAQ বা সাইট সেটিংসের মতো যে ডাটা ঘন ঘন বদলায় না — তার জন্য।
      </p>

      <CodeBlock filename="force-cache.ts">{`// Default behavior in static rendering
const res = await fetch('https://api.com/blog-posts', {
  cache: 'force-cache', // ⚡ Cached indefinitely until revalidated
});`}</CodeBlock>

      <H3>Strategy B — Real-time Data (no-store)</H3>

      <p>
        Data Cache সম্পূর্ণ বাইপাস করে। প্রতিটা নতুন রিকোয়েস্টে ব্যাকএন্ড API বা ডাটাবেজে
        রিয়েল-টাইম হিট পড়ে। স্টক মার্কেট প্রাইস, ইউজার-স্পেসিফিক ড্যাশবোর্ড, পেমেন্ট
        স্ট্যাটাস, কার্ট ডাটা — এসবের জন্য।
      </p>

      <CodeBlock filename="no-store.ts">{`// Opt out of the Data Cache completely
const res = await fetch('https://api.com/user/wallet-balance', {
  cache: 'no-store', // 🚀 Always fetches fresh real-time data
});`}</CodeBlock>

      <H3>Strategy C — Time-based Revalidation</H3>

      <p>
        নির্দিষ্ট সময় পর্যন্ত ডাটা ক্যাশ রাখে। সময় পার হওয়ার পর প্রথম রিকোয়েস্টে
        ব্যাকগ্রাউন্ডে ফ্রেশ ডাটা এনে ক্যাশ আপডেট করে দেয় — Stale-While-Revalidate।
      </p>

      <CodeBlock filename="revalidate.ts">{`// Cache data for 60 seconds
const res = await fetch('https://api.com/trending-products', {
  next: { revalidate: 60 }, // ⚡ Cache expires after 60 seconds
});`}</CodeBlock>

      {/* ── unstable_cache ────────────────────────────────────────────── */}
      <H2 id="unstable-cache">২. ORM কোয়েরির জন্য unstable_cache()</H2>

      <Line name="ভুলু ভাই">
        (থামিয়ে দিয়ে) দাঁড়াও নেক্সট-ভাই! আবার একই প্রশ্ন! এগুলো তো গেল{" "}
        <code>fetch()</code>-এর কথা। আমি যদি Prisma বা কাস্টম PostgreSQL কোয়েরি ব্যবহার
        করি, তবে সেটাকে স্থায়ীভাবে Data Cache-এ স্টোর করে রাখার উপায় কী? React-এর{" "}
        <code>cache()</code> তো রিকোয়েস্ট শেষ হলেই মুছে যায়!
      </Line>

      <Line name="নেক্সট-ভাই">
        চমৎকার অবজারভেশন! Non-fetch বা ORM কোয়েরিকে Data Cache লেয়ারে সেভ করে রাখার
        অফিশিয়াল সলিউশন হলো <code>unstable_cache()</code>! এটি কোয়েরির রেজাল্ট persistent
        Data Cache-এ রাখে, আর কাস্টম Cache Key ও Revalidation Tag অ্যাটাচ করার সুবিধা দেয়।
      </Line>

      <CodeBlock filename="lib/dal/products.ts">{`// lib/dal/products.ts
import { unstable_cache } from 'next/cache';
import { db } from '@/lib/db';

/**
 * ⚡ Caches Prisma/ORM query results inside the persistent Data Cache
 */
export const getCachedFeaturedProducts = unstable_cache(
  async (category: string) => {
    console.log(\`[DB QUERY EXECUTED] Category: \${category}\`);

    return await db.product.findMany({
      where: { category, isFeatured: true },
    });
  },
  ['featured-products-key'], // 1. Unique cache key array
  {
    revalidate: 3600,        // 2. Time-based expiry (1 hour)
    tags: ['products'],      // 3. On-demand revalidation tags
  }
);`}</CodeBlock>

      <CodeBlock filename="app/page.tsx">{`// app/page.tsx
import { getCachedFeaturedProducts } from '@/lib/dal/products';

export default async function HomePage() {
  // Served from Data Cache — the DB is hit only once an hour!
  const products = await getCachedFeaturedProducts('electronics');

  return (
    <div>
      {products.map((p) => (
        <div key={p.id}>{p.name}</div>
      ))}
    </div>
  );
}`}</CodeBlock>

      {/* ── Matrix ────────────────────────────────────────────────────── */}
      <H2 id="matrix">৩. প্রিমিটিভগুলোর তুলনা</H2>

      <Table
        head={[
          "বৈশিষ্ট্য",
          <>
            <code>fetch()</code> + force-cache
          </>,
          <>
            React <code>cache()</code>
          </>,
          <>
            <code>unstable_cache()</code>
          </>,
        ]}
        rows={[
          ["ক্যাশ লেয়ার", "Data Cache", "Request Memoization", "Data Cache"],
          [
            "ডাটা সোর্স",
            <>
              শুধু HTTP <code>fetch()</code>
            </>,
            "যেকোনো JS Function / ORM",
            "যেকোনো JS Function / ORM",
          ],
          [
            "স্থায়িত্ব",
            "Persistent",
            "Single Request Lifecycle",
            "Persistent",
          ],
          [
            "On-Demand Tag",
            <code key="fetch-tags">next: {"{ tags: [...] }"}</code>,
            "❌ প্রযোজ্য নয়",
            <code key="unstable-tags">tags: [...]</code>,
          ],
        ]}
      />

      <Line name="ভুলু ভাই">
        (আনন্দে তালি বাজিয়ে) অসাম নেক্সট-ভাই! রিয়েল-টাইম ডাটা লাগলে{" "}
        <code>no-store</code>, ব্লগ বা ক্যাটাগরি ডাটায় <code>force-cache</code> বা{" "}
        <code>revalidate: 60</code>, আর Prisma কোয়েরির আউটপুট স্থায়ীভাবে রাখতে{" "}
        <code>unstable_cache()</code> দিয়ে ট্যাগ বসিয়ে দেব!
      </Line>

      {/* ── Takeaways ─────────────────────────────────────────────────── */}
      <H2 id="takeaway">Production Takeaways</H2>

      <Note>
        <ul>
          <li>
            <strong>Default Behavior:</strong> Next.js 15 থেকে <code>fetch()</code>{" "}
            রিকোয়েস্ট ডিফল্টভাবে uncached, তাই ক্যাশ করতে চাইলে এক্সপ্লিসিটলি{" "}
            <code>force-cache</code> বা <code>revalidate</code> উল্লেখ করতে হয়।
          </li>
          <li>
            <strong>Combining with React cache:</strong> মেমোরি ও পারসিস্টেন্ট — দুটো সুবিধা
            একসাথে পেতে <code>cache(unstable_cache(...))</code> কম্বো ইন্ডাস্ট্রি প্র্যাকটিস।
          </li>
          <li>
            <strong>Invalidation Strategy:</strong> <code>unstable_cache</code>-এর ট্যাগকে{" "}
            <code>revalidateTag(&apos;products&apos;)</code> দিয়ে যেকোনো Server Action থেকে
            ইনস্ট্যান্ট রিভ্যালিডেট করা যায়।
          </li>
        </ul>
      </Note>
    </article>
  );
}
