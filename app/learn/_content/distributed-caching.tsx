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
      bn: "এক রিফ্রেশে নতুন, পরেরটায় পুরনো",
      en: "New data, then old data, then new",
    },
  },
  {
    id: "architecture",
    label: {
      bn: "Local vs distributed cache",
      en: "Local vs distributed cache",
    },
  },
  {
    id: "mechanisms",
    label: {
      bn: "৩টি ক্যাশিং রুল",
      en: "Three caching rules",
    },
  },
  {
    id: "implementation",
    label: {
      bn: "Cache-aside, lock ও invalidation",
      en: "Cache-aside, locks, invalidation",
    },
  },
  {
    id: "matrix",
    label: { bn: "দুই ক্যাশের তুলনা", en: "The two caches compared" },
  },
  {
    id: "takeaway",
    label: { bn: "Production Takeaways", en: "Production takeaways" },
  },
];

export default function DistributedCaching() {
  return (
    <article className="doc-prose">
      {/* ── The problem ───────────────────────────────────────────────── */}
      <H2 id="the-problem" anchorOnly>
        এক রিফ্রেশে নতুন, পরেরটায় পুরনো
      </H2>

      <p>
        বিকেল ৫:১৫। ট্রাফিক সামলাতে টিম সম্প্রতি তিনটি আলাদা কন্টেইনার চালু করেছে। এখন অদ্ভুত অভিযোগ
        আসছে — ইউজার প্রোফাইল আপডেট করার পর একবার রিফ্রেশ দিলে নতুন ডাটা দেখছেন, পরের রিফ্রেশেই পুরনো
        ডাটা ফিরে আসছে।
      </p>

      <Line name="ভুলু ভাই">
        ফাহিম! এ কেমন ভুতুড়ে কাণ্ড? ডাটাবেসে হিট কমাতে <code>node-cache</code> দিয়ে ইন-মেমোরি ক্যাশ
        বসিয়েছিলাম। এখন এক সার্ভারে ডাটা আপডেট হচ্ছে, কিন্তু অন্য সার্ভারের ক্যাশে আগের ডাটা বসে আছে!
      </Line>

      <Line name="ফাহিম">
        ভুলু ভাই! মাল্টি-নোড এনভায়রনমেন্টে নোডের নিজের র‍্যামে ক্যাশ রাখলে এটা হবেই — Pod-1 ক্যাশ
        আপডেট করলেও Pod-2 আর Pod-3 সেটা জানেই না। উপরন্তু সার্ভার রিস্টার্ট হলে পুরো ক্যাশ উবে যায়,
        আর ডাটাবেসের ওপর একসাথে হাজার রিকোয়েস্ট পড়ে।
      </Line>

      <Line name="নেক্সট-ভাই">
        একদম! দরকার একটি <strong>centralized distributed cache</strong> — যেখানে সব নোড একই শেয়ার্ড
        লেয়ার থেকে পড়বে আর লিখবে। কিন্তু শুধু Redis বসালেই শেষ নয়; cache stampede-এর সমাধানটাও
        একই সাথে করতে হয়।
      </Line>

      {/* ── Architecture ──────────────────────────────────────────────── */}
      <H2 id="architecture">১. Local vs Distributed Cache</H2>

      <Diagram>{`┌─────────────────────────────────────────────────────────────────────────────┐
│                 LOCAL CACHE vs DISTRIBUTED CACHE                            │
└─────────────────────────────────────────────────────────────────────────────┘

  1. LOCAL IN-MEMORY — three nodes, three different truths
     [ client ] ──► load balancer ──┬──► [ node 1 · cache A ]  ◄── stale
                                    ├──► [ node 2 · cache B ]  ◄── fresh
                                    └──► [ node 3 · cache C ]  ◄── stale
     the answer depends on which node you happen to hit

  2. CENTRALISED — one cache, one truth
     [ client ] ──► load balancer ──┬──► [ node 1 ] ──┐
                                    ├──► [ node 2 ] ──┼──► [ REDIS ]
                                    └──► [ node 3 ] ──┘        │
                                                               ▼
                                                       [ PRIMARY DB ]`}</Diagram>

      {/* ── Mechanisms ────────────────────────────────────────────────── */}
      <H2 id="mechanisms">২. কোর ক্যাশিং রুল</H2>

      <p>
        <strong>Cache-aside (lazy loading):</strong> অ্যাপ প্রথমে ক্যাশ দেখবে। না পেলে ডাটাবেস থেকে
        এনে নির্দিষ্ট TTL সহ ক্যাশে বসাবে, তারপর রেসপন্স দেবে। এর সুবিধা — ক্যাশ ডাউন থাকলেও অ্যাপ
        চলতে থাকে, শুধু ধীর হয়।
      </p>

      <p>
        <strong>Prevent the stampede:</strong> কোনো হাই-ট্রাফিক কী এক্সপায়ার হওয়ার মুহূর্তে যদি একশো
        রিকোয়েস্ট একসাথে ডাটাবেসে যায়, DB পড়ে যাবে। distributed lock দিয়ে মাত্র একটি রিকোয়েস্টকে DB
        পর্যন্ত যেতে দিন, বাকিরা অপেক্ষা করে ক্যাশ থেকেই পাবে।
      </p>

      <p>
        <strong>Always set a TTL and an eviction policy:</strong> TTL ছাড়া কী জমতে জমতে Redis-এর
        মেমোরি ফুরিয়ে যাবে। সাথে <code>maxmemory-policy</code> (সাধারণত{" "}
        <code>allkeys-lru</code>) সেট করুন, যাতে মেমোরি ফুরালে Redis লিখতে অস্বীকার না করে বরং পুরনো
        কী ছেড়ে দেয়।
      </p>

      {/* ── Implementation ────────────────────────────────────────────── */}
      <H2 id="implementation">৩. Production Code Implementation</H2>

      <H3>🟢 Step 1 — stampede-safe cache-aside হেল্পার</H3>

      <CodeBlock filename="src/lib/cache/distributedCache.ts">{`// 🟢 PRODUCTION PATTERN: cache-aside with a distributed lock
import Redis from 'ioredis';

const redis = new Redis(process.env.REDIS_URL ?? 'redis://localhost:6379');

interface CacheOptions {
  ttlSeconds: number;
  lockTimeoutMs?: number;
  maxWaitAttempts?: number;
}

export async function getOrSetCache<T>(
  key: string,
  fetchFn: () => Promise<T>,
  { ttlSeconds, lockTimeoutMs = 5000, maxWaitAttempts = 20 }: CacheOptions,
): Promise<T> {
  const cached = await redis.get(key);
  if (cached) return JSON.parse(cached) as T;

  const lockKey = \`lock:\${key}\`;

  // SET ... NX PX is atomic: exactly one caller can win this
  const gotLock = await redis.set(lockKey, '1', 'PX', lockTimeoutMs, 'NX');

  if (!gotLock) {
    // someone else is loading it — wait for them rather than piling onto the DB
    for (let attempt = 0; attempt < maxWaitAttempts; attempt++) {
      await new Promise((r) => setTimeout(r, 150));

      const filled = await redis.get(key);
      if (filled) return JSON.parse(filled) as T;
    }

    // 🟢 the lock holder crashed or is too slow — degrade to a direct read
    //    rather than waiting forever or throwing
    return fetchFn();
  }

  try {
    const fresh = await fetchFn();
    await redis.set(key, JSON.stringify(fresh), 'EX', ttlSeconds);
    return fresh;
  } finally {
    // always release, even if fetchFn threw
    await redis.del(lockKey);
  }
}

export async function invalidateCache(key: string) {
  // 🟢 one DEL clears the value for every node at once
  await redis.del(key);
}`}</CodeBlock>

      <H3>🟢 Step 2 — route handler যা এটি ব্যবহার করে</H3>

      <CodeBlock filename="src/app/api/products/[id]/route.ts">{`// 🟢 PRODUCTION PATTERN: the handler knows nothing about locks or TTLs
import { NextResponse } from 'next/server';
import { getOrSetCache } from '@/lib/cache/distributedCache';
import { db } from '@/lib/db';

interface RouteContext {
  params: Promise<{ id: string }>;
}

export async function GET(_req: Request, { params }: RouteContext) {
  const { id } = await params;

  const product = await getOrSetCache(
    \`product:\${id}\`,
    async () => db.product.findUnique({ where: { id } }),
    { ttlSeconds: 3600 },
  );

  if (!product) {
    return NextResponse.json({ success: false }, { status: 404 });
  }

  return NextResponse.json({ success: true, data: product });
}`}</CodeBlock>

      <p>
        খেয়াল রাখবেন — invalidation ফাংশনটি <code>route.ts</code>-এ রাখা যাবে না। Next.js একটি রুট
        ফাইল থেকে শুধু HTTP মেথড আর কয়েকটি কনফিগ এক্সপোর্ট মেনে নেয়; অন্য কিছু এক্সপোর্ট করলে বিল্ড
        ব্যর্থ হয়। সেটি লাইব্রেরি ফাইলেই থাকুক, আর server action সেখান থেকে ডাকুক।
      </p>

      <CodeBlock filename="src/app/actions/product.ts">{`'use server';

import { revalidateTag } from 'next/cache';
import { db } from '@/lib/db';
import { invalidateCache } from '@/lib/cache/distributedCache';

export async function updateProduct(id: string, data: { price: number }) {
  await db.product.update({ where: { id }, data });

  // 🟢 two caches, two invalidations — forgetting either one serves stale data
  await invalidateCache(\`product:\${id}\`);  // the shared Redis layer
  revalidateTag(\`product-\${id}\`);          // Next.js's own data cache
}`}</CodeBlock>

      {/* ── Matrix ────────────────────────────────────────────────────── */}
      <H2 id="matrix">৪. Local vs Distributed Cache</H2>

      <Table
        head={["দিক", "Local in-memory", "Distributed (Redis)"]}
        rows={[
          [
            "নোডের মধ্যে সামঞ্জস্য",
            "প্রতিটি নোডে আলাদা সত্য 🔴",
            "একটিই সোর্স অফ ট্রুথ 🟢",
          ],
          [
            "স্থায়িত্ব",
            "রিস্টার্টেই উবে যায় 🔴",
            "snapshot / AOF দিয়ে টিকে থাকে 🟢",
          ],
          ["Latency", "সরাসরি RAM, প্রায় শূন্য 🟢", "নেটওয়ার্কে ~১ms"],
          [
            "স্কেলিং",
            "নোডের RAM-এর সীমায় আটকা",
            "আলাদাভাবে ক্লাস্টার করা যায় 🟢",
          ],
          [
            "ডাটা স্ট্রাকচার",
            "সাধারণ Map / object",
            "string, hash, list, set, pub/sub 🟢",
          ],
        ]}
      />

      <Line name="ভুলু ভাই">
        দুর্দান্ত ফাহিম! সব সার্ভিস এখন একই Redis ব্যবহার করছে — এক জায়গায় ইনভ্যালিডেট করলেই তিনটি
        কন্টেইনারেই সাথে সাথে সিঙ্ক হয়ে যাচ্ছে। ইনকনসিস্টেন্সির ঝামেলা শেষ!
      </Line>

      {/* ── Takeaways ─────────────────────────────────────────────────── */}
      <H2 id="takeaway">Production Takeaways</H2>

      <Note>
        <ul>
          <li>
            <strong>Never cache in node memory across replicas:</strong> একাধিক ইনস্ট্যান্স থাকলে
            ইন-মেমোরি ক্যাশ মানেই অসামঞ্জস্য — শেয়ার্ড লেয়ার ব্যবহার করুন।
          </li>
          <li>
            <strong>Lock the stampede, but degrade gracefully:</strong> lock ব্যবহার করুন, তবে
            অপেক্ষার একটা সীমা রাখুন — lock ধরে রাখা প্রসেস মরে গেলে বাকিরা যেন আটকে না থাকে।
          </li>
          <li>
            <strong>Invalidate both layers:</strong> Redis আর Next.js-এর নিজস্ব data cache — দুটোই
            আলাদা। mutation-এর পর একটি ভুলে গেলেই ইউজার পুরনো ডাটা দেখবে।
          </li>
        </ul>
      </Note>
    </article>
  );
}
