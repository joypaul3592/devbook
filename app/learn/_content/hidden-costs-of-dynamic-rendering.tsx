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
      bn: "$200 বিল আর 'too many connections'",
      en: "A $200 bill and 'too many connections'",
    },
  },
  {
    id: "architecture",
    label: { bn: "Uncached বনাম Pooled আর্কিটেকচার", en: "Uncached vs pooled" },
  },
  {
    id: "costs",
    label: { bn: "৩টি লুকানো বিপদ", en: "The three hidden costs" },
  },
  {
    id: "implementation",
    label: { bn: "Pooling ও ক্যাশিং প্যাটার্ন", en: "Pooling and caching patterns" },
  },
  {
    id: "matrix",
    label: { bn: "Pure Dynamic বনাম Pooled+Cached", en: "Pure dynamic vs pooled + cached" },
  },
  {
    id: "takeaway",
    label: { bn: "Production Takeaways", en: "Production takeaways" },
  },
];

export default function HiddenCostsOfDynamicRendering() {
  return (
    <article className="doc-prose">
      {/* ── The problem ───────────────────────────────────────────────── */}
      <H2 id="the-problem" anchorOnly>
        $200 বিল আর &quot;too many connections&quot;
      </H2>

      <p>
        রাত ১১:০০। ভুলু ভাই নোটিফিকেশন দেখে আঁতকে উঠলেন — অল্প সময়ের ট্রাফিক স্পাইকেই সার্ভারলেস
        এক্সিকিউশন বিল ২০০ ডলার ছাড়িয়ে গেছে! সাথে ডেটাবেস লগে রেড এরর:{" "}
        <code>FATAL: remaining connection slots are reserved...</code>। সাইট রিফ্রেশ দিলে ৫–১০
        সেকেন্ড পর 504 Gateway Timeout।
      </p>

      <Line name="ভুলু ভাই">
        ফাহিম! ড্যাশবোর্ড আর প্রোডাক্ট পেজে শুধু{" "}
        <code>export const dynamic = &apos;force-dynamic&apos;</code> লিখেছিলাম যেন সবসময় টাটকা
        ডেটা পায়। কিন্তু এখন বিলও লাফিয়ে বাড়ছে, আর ডেটাবেসও ক্র্যাশ করে বসে আছে কেন?
      </Line>

      <Line name="ফাহিম">
        ভুলু ভাই! আপনি ডাইনামিক রেন্ডারিংয়ের <strong>hidden cost</strong>-এর ফাঁদে পড়েছেন!
        সার্ভারলেস বা এজ এনভায়রনমেন্টে ডাইনামিক রেন্ডারিং মানে প্রতিটি রিকোয়েস্টে একটি করে
        ফাংশন ইনস্ট্যান্স তৈরি হওয়া — যা কেবল ক্লাউড বিলই বাড়ায় না, ডেটাবেসের কানেকশন স্লটও
        মুহূর্তে শেষ করে দেয়!
      </Line>

      {/* ── Architecture ──────────────────────────────────────────────── */}
      <H2 id="architecture">১. Uncached বনাম Pooled আর্কিটেকচার</H2>

      <Diagram>{`┌─────────────────────────────────────────────────────────────────────────┐
│              UNCACHED DYNAMIC vs POOLED ARCHITECTURE                    │
└─────────────────────────────────────────────────────────────────────────┘

 UNCACHED DYNAMIC (serverless disaster):
 1000 concurrent requests ──▶ 1000 lambdas spawning ──▶ 1000 direct DB connections
                                                                  │
                                                                  ▼
                                              DB crash: "too many connections"
                                              Huge serverless compute bill

 -------------------------------------------------------------------------

 POOLED & CACHED DYNAMIC (production ready):
 1000 concurrent requests ──▶ Serverless pool ──▶ Connection pooler (PgBouncer / Neon)
                                 │                            │
                                 ├── (cached query layer) ────┼──▶ Single DB connection reused
                                 ▼                            ▼
                         Fast response (<50ms)      Zero DB overload & low cost`}</Diagram>

      {/* ── Costs ─────────────────────────────────────────────────────── */}
      <H2 id="costs">২. ডাইনামিক রেন্ডারিংয়ের ৩টি লুকানো বিপদ</H2>

      <Note>
        <ul>
          <li>
            <strong>Compute cost &amp; high invocations:</strong> প্রতিটি ডাইনামিক পেজ রিকোয়েস্টে
            সার্ভারলেস ফাংশন নতুন করে এক্সিকিউট হয়। ১ লাখ হিট মানে ১ লাখ ফাংশন এক্সিকিউশন ও CPU
            টাইম — ক্যাশড পেজের তুলনায় বহুগুণ ব্যয়বহুল।
          </li>
          <li>
            <strong>Database connection exhaustion:</strong> ট্র্যাডিশনাল Node সার্ভারে একটি
            স্থায়ী কানেকশন পুল থাকে, কিন্তু সার্ভারলেসে প্রতি রিকোয়েস্টে আলাদা কন্টেইনার স্পন হয়।
            ১০০০ রিকোয়েস্ট মানে ডেটাবেসে ১০০০টি সরাসরি কানেকশন খোলার চেষ্টা — PostgreSQL বা MySQL
            নিমিষেই max connections হিট করে।
          </li>
          <li>
            <strong>Execution timeouts &amp; memory limits:</strong> জটিল ডেটা প্রসেসিংয়ে সময় বেশি
            লাগলে সার্ভারলেস ফাংশনের টাইমআউট হিট করে 504 Gateway Timeout থ্রো করে।
          </li>
        </ul>
      </Note>

      {/* ── Implementation ────────────────────────────────────────────── */}
      <H2 id="implementation">৩. Pooling ও ক্যাশিং প্যাটার্ন</H2>

      <H3>❌ Anti-pattern — force-dynamic রুটে সরাসরি DB কানেকশন</H3>

      <CodeBlock filename="app/orders/page.tsx">{`export const dynamic = 'force-dynamic'; // every request hits the DB fresh

import { Client } from 'pg'; // a direct client connection inside a serverless function

export default async function OrdersPage() {
  const client = new Client({ connectionString: process.env.DATABASE_URL });
  await client.connect(); // spawns ONE NEW DB CONNECTION PER REQUEST

  const result = await client.query(
    'SELECT * FROM orders ORDER BY created_at DESC LIMIT 10'
  );
  await client.end();

  return (
    <div className="p-6">
      <h2>Recent orders: {result.rows.length}</h2>
    </div>
  );
}`}</CodeBlock>

      <H3>🟢 Fix — pooled driver + cached query</H3>

      <CodeBlock filename="lib/db.ts">{`import { PrismaClient } from '@prisma/client';

const globalForPrisma = globalThis as unknown as { prisma: PrismaClient };

// Point at a POOLED connection string (PgBouncer / Neon / Supabase pooler)
export const db =
  globalForPrisma.prisma ||
  new PrismaClient({
    datasources: {
      db: {
        url: process.env.DATABASE_POOLED_URL,
      },
    },
  });

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = db;`}</CodeBlock>

      <CodeBlock filename="app/orders/page.tsx">{`import { db } from '@/lib/db';
import { unstable_cache } from 'next/cache';

// Cache the heavy query with a short revalidation window
const getCachedOrders = unstable_cache(
  async () => {
    return await db.order.findMany({
      take: 10,
      orderBy: { createdAt: 'desc' },
    });
  },
  ['recent-orders-key'], // cache key
  {
    revalidate: 10, // re-run the query at most once every 10 seconds
    tags: ['orders'],
  }
);

export default async function OrdersPage() {
  // Runs over pooled connections, inside a 10s cache window
  const orders = await getCachedOrders();

  return (
    <div className="max-w-3xl mx-auto py-8 px-6 bg-slate-950 text-slate-100 space-y-4">
      <div className="flex justify-between items-center border-b border-slate-800 pb-3">
        <h1 className="text-xl font-bold">Live Orders Overview</h1>
        <span className="text-xs font-mono text-emerald-400 bg-emerald-500/10 px-2 py-1 rounded">
          DB pooled + 10s cache
        </span>
      </div>

      <div className="space-y-2">
        {orders.map((order) => (
          <div
            key={order.id}
            className="bg-slate-900 border border-slate-800 p-3 rounded-lg flex justify-between"
          >
            <span className="text-sm font-mono text-slate-300">
              Order #{order.id}
            </span>
            <span className="text-sm font-semibold text-emerald-400">
              \${order.totalAmount}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}`}</CodeBlock>

      <Note>
        <p>
          <code>unstable_cache</code> হলো Next.js 15-এর API। Next.js 16-এ এর উত্তরসূরি{" "}
          <code>use cache</code> ডিরেক্টিভ — নীতিটা একই: ভারী কোয়েরির চারপাশে একটি ক্যাশ উইন্ডো
          বসিয়ে প্রতি রিকোয়েস্টে ডেটাবেস হিট করা বন্ধ করা।
        </p>
      </Note>

      {/* ── Matrix ────────────────────────────────────────────────────── */}
      <H2 id="matrix">৪. Pure Dynamic বনাম Pooled + Cached</H2>

      <Table
        head={["মেট্রিক", "Pure dynamic (no pooling/cache)", "Pooled + cached"]}
        rows={[
          [
            "Serverless compute cost",
            "মারাত্মক হাই — ১০০% invocation কাউন্ট হয়",
            "অনেক কম — cache hit এক্সিকিউশন বাইপাস করে",
          ],
          [
            "Database health",
            "উচ্চ concurrency-তে ক্র্যাশের ঝুঁকি",
            "pooler-প্রোটেক্টেড, নিরাপদ",
          ],
          [
            "Response latency",
            "স্লো (২০০ms – ২০০০ms DB execution)",
            "ইনস্ট্যান্ট (১০–৩০ms ক্যাশ থেকে)",
          ],
          [
            "Data freshness",
            "১০০% রিয়েল-টাইম",
            "near real-time (৫–৬০s কনফিগারেবল উইন্ডো)",
          ],
        ]}
      />

      <Line name="ভুলু ভাই">
        উফ বাঁচালেন! Connection pooler সেটআপ করে আর ১০ সেকেন্ডের ক্যাশিং যুক্ত করতেই ডেটাবেসের
        &quot;too many connections&quot; এরর গায়েব, আর সার্ভারলেস এক্সিকিউশন টাইম নাটকীয়ভাবে কমে
        এল!
      </Line>

      {/* ── Takeaways ─────────────────────────────────────────────────── */}
      <H2 id="takeaway">Production Takeaways</H2>

      <Note>
        <ul>
          <li>
            <strong>Use DB connection poolers:</strong> সার্ভারলেসে PostgreSQL/MySQL ব্যবহার করলে
            অবশ্যই PgBouncer, Prisma Accelerate, Neon pooled connection বা Supabase transaction
            pooler ব্যবহার করুন।
          </li>
          <li>
            <strong>Never force-dynamic everything:</strong> পেজের সব ডেটা প্রতি মিলিসেকেন্ডে
            বদলায় না। ১০–৩০ সেকেন্ডের ক্যাশ উইন্ডো রাখলেই কম্পিউট খরচ ও ডেটাবেস চাপ নাটকীয়ভাবে
            কমে।
          </li>
          <li>
            <strong>Move heavy work off the request path:</strong> ভারী রিপোর্ট জেনারেশন
            রেন্ডারিং ফাংশনে না করে background queue বা cron job-এ শিফট করুন।
          </li>
        </ul>
      </Note>
    </article>
  );
}
