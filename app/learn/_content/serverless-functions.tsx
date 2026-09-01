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
      bn: "too many clients already",
      en: "too many clients already",
    },
  },
  {
    id: "architecture",
    label: {
      bn: "Serverless lifecycle ও pooling",
      en: "Serverless lifecycle & pooling",
    },
  },
  {
    id: "mechanisms",
    label: { bn: "৪টি আর্কিটেকচারাল কনসেপ্ট", en: "Four architectural concepts" },
  },
  {
    id: "implementation",
    label: {
      bn: "Singleton client ও fast response",
      en: "A singleton client & fast responses",
    },
  },
  {
    id: "matrix",
    label: { bn: "Serverless vs Monolith", en: "Serverless vs monolith" },
  },
  {
    id: "takeaway",
    label: { bn: "Production Takeaways", en: "Production takeaways" },
  },
];

export default function ServerlessFunctions() {
  return (
    <article className="doc-prose">
      {/* ── The problem ───────────────────────────────────────────────── */}
      <H2 id="the-problem" anchorOnly>
        too many clients already
      </H2>

      <p>
        বিকাল ৫:১৫। ভুলু ভাই তার API রাউটগুলো সার্ভারলেস হিসেবে ডেপ্লয় করলেন। কিন্তু মার্কেটিং
        ক্যাম্পেইন চালু হতেই ট্রাফিক বাড়ল, আর সাথে সাথেই ডাটাবেস এরর:{" "}
        <code>FATAL: sorry, too many clients already</code>! উপরন্তু একটি বড় CSV রিপোর্ট জেনারেট করার
        API ডাকতেই ১০ সেকেন্ড পর <code>504 Gateway Timeout</code> এরর দিল।
      </p>

      <Line name="ভুলু ভাই">
        ফাহিম! সার্ভারলেস ডেপ্লয়মেন্ট মানে তো অটো-স্কেল হওয়ার কথা! কিন্তু ট্রাফিক বাড়তেই ডাটাবেস ডাউন
        হয়ে যাচ্ছে কেন? আর বড় ব্যাকগ্রাউন্ড প্রসেসের ক্ষেত্রে কেন রিকোয়েস্ট টাইমআউট হয়ে ড্রপ করছে?
      </Line>

      <Line name="ফাহিম">
        ভুলু ভাই! সার্ভারলেস ফাংশন stateless ও ephemeral। প্রতিবার নতুন রিকোয়েস্টে এটি একটি নতুন
        ইনস্ট্যান্স স্পিন-আপ করে। ১০০ জন ইউজার একই সময়ে হিট করলে ১০০টি আলাদা ইনস্ট্যান্স ডাটাবেসে ১০০টি
        নতুন সকেট কানেকশন তৈরির চেষ্টা করে — কানেকশন পুলার ছাড়া ডাটাবেস ক্র্যাশ করে!
      </Line>

      <Line name="নেক্সট-ভাই">
        একদম! এছাড়া সার্ভারলেস ফাংশনের নির্দিষ্ট execution time limit থাকে। তাই কানেকশন পুলিং ব্যবহার
        করা এবং ভারী বা দীর্ঘ প্রসেসগুলোকে ব্যাকগ্রাউন্ড কিউ বা ক্রন জবে সরানো বাধ্যতামূলক!
      </Line>

      {/* ── Architecture ──────────────────────────────────────────────── */}
      <H2 id="architecture">১. Serverless Lifecycle &amp; DB Pooling</H2>

      <Diagram>{`┌─────────────────────────────────────────────────────────────────────────────┐
│                 SERVERLESS EXECUTION & DB POOLING ARCHITECTURE              │
└─────────────────────────────────────────────────────────────────────────────┘

 100+ concurrent requests hit the API routes
     │            │            │
     ▼            ▼            ▼
 ┌──────────┐ ┌──────────┐ ┌──────────┐
 │instance 1│ │instance 2│ │instance N│   ephemeral, cold-started, stateless
 └────┬─────┘ └────┬─────┘ └────┬─────┘
      │            │            │
      └────────────┼────────────┘
                   │
                   ├─── without pooling ──► 100 direct sockets ──► ❌ DB refuses
                   │
                   ▼ with a pooler
 ┌───────────────────────────────────────────────────┐
 │ connection pooler (PgBouncer / Prisma Accelerate) │ 🟢 holds a fixed socket set
 └─────────────────────────┬─────────────────────────┘
                           ▼
 ┌───────────────────────────────────────────────────┐
 │ database (PostgreSQL / MySQL)                     │ 🟢 stable, e.g. 20 connections
 └───────────────────────────────────────────────────┘`}</Diagram>

      {/* ── Mechanisms ────────────────────────────────────────────────── */}
      <H2 id="mechanisms">২. কোর আর্কিটেকচারাল কনসেপ্ট</H2>

      <p>
        <strong>Cold start vs warm execution:</strong> সার্ভারলেস ফাংশন অলস অবস্থায় মেমরি থেকে রিমুভ হয়ে
        যায় (scale to zero)। নতুন রিকোয়েস্টে ফাংশন বুট হতে যে সময় লাগে তাকে cold start বলে। একবার
        warm হলে পরবর্তী রিকোয়েস্টগুলো দ্রুত এক্সিকিউট হয়।
      </p>

      <p>
        <strong>Stateless nature &amp; global state traps:</strong> ইন-মেমরি গ্লোবাল ভেরিয়েবল (
        <code>let cache = &#123;&#125;</code>) ভরসাযোগ্য নয়, কারণ দুটি রিকোয়েস্ট দুটি আলাদা
        ইনস্ট্যান্সে যেতে পারে। শেয়ার্ড স্টেট লাগলে Redis-এর মতো এক্সটার্নাল স্টোর দরকার।
      </p>

      <p>
        <strong>Connection starvation:</strong> ট্র্যাডিশনাল Express অ্যাপে একটিই প্রসেস একটি কানেকশন
        রি-ইউজ করে। সার্ভারলেসে ১০০ ইনস্ট্যান্স মানে ১০০ সকেট। সমাধান হলো PgBouncer, Prisma
        Accelerate বা Neon pooling-এর মতো একটি pooler।
      </p>

      <p>
        <strong>Execution limits:</strong> সার্ভারলেস ফাংশন দীর্ঘ সময় চলতে পারে না। ইমেইল সেন্ডিং,
        ভিডিও প্রসেসিং বা ভারী ফাইল জেনারেশনের জন্য ব্যাকগ্রাউন্ড ওয়ার্কার বা asynchronous task runner
        (QStash, Trigger.dev, Inngest) ব্যবহার করাই বেস্ট প্র্যাকটিস।
      </p>

      {/* ── Implementation ────────────────────────────────────────────── */}
      <H2 id="implementation">৩. Production Code Implementation</H2>

      <H3>❌ Anti-pattern — an unpooled connection and a long-running loop</H3>

      <CodeBlock filename="app/api/orders/route.ts">{`// 🔴 POOR PRACTICE: a fresh TCP connection per invocation, plus a blocking loop
import { Client } from 'pg';

export async function POST() {
  // ❌ a brand new direct socket on every single invocation — sockets exhaust fast
  const client = new Client({ connectionString: process.env.DATABASE_URL });
  await client.connect();

  // ❌ a synchronous block that will blow past the execution limit
  for (let i = 0; i < 1_000_000; i++) {
    // heavy computation
  }

  const result = await client.query('SELECT * FROM large_orders');
  await client.end(); // never runs if anything above throws — the socket leaks

  return Response.json(result.rows);
}`}</CodeBlock>

      <H3>🟢 Production pattern — a pooled singleton and a fast handler</H3>

      <p>
        <strong>Step 1 — singleton ডাটাবেস ক্লায়েন্ট।</strong>
      </p>

      <CodeBlock filename="lib/db.ts">{`// 🟢 PRODUCTION PATTERN: reuse the client across warm invocations
import { PrismaClient } from '@prisma/client';

// a global slot survives hot reloads in dev and warm instances in production
const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

// 🟢 DATABASE_URL must point at the POOLED endpoint (e.g. PgBouncer on 6543),
// not the direct database port
export const db =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: process.env.NODE_ENV === 'development' ? ['query', 'error'] : ['error'],
  });

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = db;`}</CodeBlock>

      <p>
        <strong>Step 2 — অপটিমাইজড রাউট হ্যান্ডলার।</strong>
      </p>

      <CodeBlock filename="app/api/orders/route.ts">{`// 🟢 PRODUCTION PATTERN: bounded work, pooled connection
import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

// 🟢 an explicit ceiling — fail predictably instead of hitting the platform default
export const maxDuration = 15;

export async function GET() {
  try {
    // 🟢 bounded query through the shared, pooled client
    const orders = await db.order.findMany({
      take: 20,
      select: { id: true, amount: true, status: true },
    });

    return NextResponse.json({ success: true, data: orders });
  } catch (error) {
    console.error('Serverless DB fetch error:', error);
    return NextResponse.json(
      { success: false, error: 'Database operational failure' },
      { status: 500 }
    );
  }
}`}</CodeBlock>

      <p>
        <strong>Step 3 — ভারী কাজ কিউতে সরানো।</strong>
      </p>

      <CodeBlock filename="app/api/reports/route.ts">{`// 🟢 PRODUCTION PATTERN: hand long work to a queue, respond immediately
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  const { userId } = await request.json();

  // 🟢 enqueue the job and return in milliseconds — the worker has no time limit
  await fetch('https://qstash.upstash.io/v2/publish/https://worker.example.com/csv', {
    method: 'POST',
    headers: { Authorization: \`Bearer \${process.env.QSTASH_TOKEN}\` },
    body: JSON.stringify({ userId }),
  });

  // 202 Accepted: the work is queued, not finished
  return NextResponse.json(
    { status: 'queued', message: 'রিপোর্ট তৈরি হলে ইমেইলে পাঠানো হবে।' },
    { status: 202 }
  );
}`}</CodeBlock>

      {/* ── Matrix ────────────────────────────────────────────────────── */}
      <H2 id="matrix">৪. Serverless vs Traditional Monolith</H2>

      <Table
        head={["বিষয়", "Serverless functions", "Traditional monolith (VPS)"]}
        rows={[
          [
            "স্কেলিং",
            "স্বয়ংক্রিয় — শূন্য থেকে হাজার 🟢",
            "ম্যানুয়াল বা load balancer নির্ভর 🟡",
          ],
          [
            "কস্ট মডেল",
            "শুধু এক্সিকিউশন টাইমের জন্য 🟢",
            "২৪/৭ সার্ভার রানিং কস্ট 🟡",
          ],
          [
            "ডাটাবেস কানেকশন",
            "pooler আবশ্যক 🟡",
            "একটি সকেট রি-ইউজ করা যায় 🟢",
          ],
          [
            "দীর্ঘ ব্যাকগ্রাউন্ড টাস্ক",
            "টাইমআউট হয় 🔴",
            "অনায়াসে চালানো যায় 🟢",
          ],
          ["Cold start", "আছে 🟡", "নেই 🟢"],
        ]}
      />

      <Line name="ভুলু ভাই">
        এখন একদম পরিষ্কার ফাহিম! সার্ভারলেসে কেন ডাটাবেস পুলার ব্যবহার করতে হয় আর বড় ফাইল প্রসেসিং কেন
        API-এর মধ্যে ঝুলিয়ে রাখা যাবে না — পুরোপুরি বুঝতে পারলাম।
      </Line>

      {/* ── Takeaways ─────────────────────────────────────────────────── */}
      <H2 id="takeaway">Production Takeaways</H2>

      <Note>
        <ul>
          <li>
            <strong>Always use connection pooling:</strong> সার্ভারলেসে সরাসরি পোর্ট 5432-এ কানেক্ট না
            করে PgBouncer বা Prisma Accelerate-এর pooled endpoint ব্যবহার করুন।
          </li>
          <li>
            <strong>Reuse the client singleton:</strong> ফাইল লেভেলে ক্লায়েন্ট গ্লোবালি ডিক্লেয়ার করুন,
            যেন warm ইনস্ট্যান্সগুলো আগের কানেকশন রি-ইউজ করতে পারে।
          </li>
          <li>
            <strong>Offload heavy jobs:</strong> ১০-১৫ সেকেন্ডের বেশি সময় নেওয়া কাজ API-এর ভেতরে
            সিঙ্ক্রোনাসলি না চালিয়ে কিউ বা ওয়ার্কারের কাছে হ্যান্ডওভার করে <code>202</code> রিটার্ন
            করুন।
          </li>
        </ul>
      </Note>
    </article>
  );
}
