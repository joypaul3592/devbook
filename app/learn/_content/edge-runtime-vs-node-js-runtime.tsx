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
      bn: "runtime = 'edge' দিতেই Prisma ক্র্যাশ",
      en: "Set runtime = 'edge', Prisma died",
    },
  },
  {
    id: "architecture",
    label: {
      bn: "Runtime এক্সিকিউশন আর্কিটেকচার",
      en: "Runtime execution architecture",
    },
  },
  {
    id: "mechanisms",
    label: { bn: "৩টি আর্কিটেকচারাল কনসেপ্ট", en: "Three architectural concepts" },
  },
  {
    id: "implementation",
    label: {
      bn: "সঠিক কাজে সঠিক রানটাইম",
      en: "The right runtime per job",
    },
  },
  {
    id: "matrix",
    label: { bn: "Edge vs Node.js Comparison", en: "Edge vs Node.js comparison" },
  },
  {
    id: "takeaway",
    label: { bn: "Production Takeaways", en: "Production takeaways" },
  },
];

export default function EdgeRuntimeVsNodeJsRuntime() {
  return (
    <article className="doc-prose">
      {/* ── The problem ───────────────────────────────────────────────── */}
      <H2 id="the-problem" anchorOnly>
        runtime = &apos;edge&apos; দিতেই Prisma ক্র্যাশ
      </H2>

      <p>
        বিকাল ৪:৩০। ভুলু ভাই গ্লোবাল ইউজারের জন্য API রেসপন্স ফাস্ট করতে একটি রাউট হ্যান্ডলারে{" "}
        <code>export const runtime = &apos;edge&apos;</code> সেট করে দিলেন। কিন্তু বিল্ড হতেই
        টার্মিনালে বড় বড় লাল অক্ষরের এরর:{" "}
        <code>Module not found: Can&apos;t resolve &apos;fs&apos;</code> এবং{" "}
        <code>PrismaClientInitializationError</code>!
      </p>

      <Line name="ভুলু ভাই">
        ফাহিম! লেটেন্সি কমানোর জন্য <code>runtime = &apos;edge&apos;</code> দিলাম, আর সাথে সাথে
        Prisma ডাটাবেস ড্রাইভার এবং নোডের <code>fs</code> মডিউল এরর দিয়ে পুরো অ্যাপ ক্র্যাশ করল কেন?
      </Line>

      <Line name="ফাহিম">
        ভুলু ভাই! কারণ Edge Runtime কোনো ফুল Node.js পরিবেশ নয়! এটি CDN-এর মতো গ্লোবালি
        ডিস্ট্রিবিউটেড সার্ভারে চলা একটি অত্যন্ত হালকা V8 isolate রানটাইম। সেখানে Node.js-এর নেটিভ
        মডিউল (<code>fs</code>, <code>path</code>, <code>child_process</code>) বা ট্র্যাডিশনাল TCP
        ডাটাবেস ড্রাইভার সাপোর্ট করে না।
      </Line>

      <Line name="নেক্সট-ভাই">
        একদম! Node.js runtime হলো ফুল-ফিচার্ড সার্ভার যেখানে সব নোড প্যাকেজ কাজ করে, আর Edge runtime
        হলো অতি-দ্রুত জিরো-কোল্ড-স্টার্ট রানটাইম — যা মিডলওয়্যার, জিও-রিডাইরেকশন ও লাইটওয়েট
        হ্যান্ডলিংয়ের জন্য পারফেক্ট!
      </Line>

      {/* ── Architecture ──────────────────────────────────────────────── */}
      <H2 id="architecture">১. Runtime Execution Architecture</H2>

      <Diagram>{`┌─────────────────────────────────────────────────────────────────────────────┐
│                 NODE.JS RUNTIME vs EDGE RUNTIME                             │
└─────────────────────────────────────────────────────────────────────────────┘

 [1] EDGE RUNTIME   (export const runtime = 'edge')
 user in Tokyo / London / Dhaka
       │
       ▼ hits the nearest CDN edge node  (latency < 10ms)
 ┌───────────────────────────────────────────────────────────┐
 │ lightweight V8 isolate — web standard APIs only           │
 │ ✓ fetch, Request, Response, URL, Web Crypto               │
 │ ✗ fs, net, tls, TCP sockets, native modules               │
 └───────────────────────────────────────────────────────────┘

 [2] NODE.JS RUNTIME   (the default)
 user in Tokyo / London / Dhaka
       │
       ▼ hits one centralised region (e.g. aws us-east-1)
 ┌───────────────────────────────────────────────────────────┐
 │ full Node.js environment — the whole ecosystem            │
 │ ✓ native modules, Prisma over TCP, fs, path, sharp        │
 │ ✗ higher cold start, and distance costs latency           │
 └───────────────────────────────────────────────────────────┘`}</Diagram>

      {/* ── Mechanisms ────────────────────────────────────────────────── */}
      <H2 id="mechanisms">২. কোর আর্কিটেকচারাল কনসেপ্ট</H2>

      <p>
        <strong>Node.js runtime — the default powerhouse:</strong> পুরো Node.js ইকোসিস্টেমের ক্ষমতা
        বহন করে — যেকোনো npm প্যাকেজ, ইমেজ প্রসেসিং (<code>sharp</code>), PDF জেনারেটর এবং নেটিভ
        ডাটাবেস ড্রাইভার। সীমা হলো ক্লায়েন্ট সার্ভার থেকে দূরে থাকলে লেটেন্সি বাড়ে, আর cold start
        তুলনামূলক বেশি।
      </p>

      <p>
        <strong>Edge runtime — ultra low latency:</strong> গ্লোবালি ছড়িয়ে থাকা এজ নোডে চলে, cold
        start প্রায় শূন্য, এবং ইউজারের কাছাকাছি থাকায় অতি-দ্রুত রেসপন্স দেয়। সীমা হলো এখানে শুধু web
        standard API কাজ করে — <code>fs</code>, <code>net</code>, <code>tls</code>-নির্ভর প্যাকেজ
        অচল।
      </p>

      <p>
        <strong>Database connectivity on edge:</strong> এজ রানটাইমে সরাসরি TCP প্রোটোকলে ডাটাবেস
        কানেক্ট করা যায় না। এর জন্য HTTP-based ড্রাইভার (Neon Serverless, PlanetScale HTTP, Prisma
        Accelerate, Upstash Redis) ব্যবহার করতে হয়।
      </p>

      {/* ── Implementation ────────────────────────────────────────────── */}
      <H2 id="implementation">৩. Production Code Implementation</H2>

      <H3>❌ Anti-pattern — Node.js modules inside the edge runtime</H3>

      <CodeBlock filename="app/api/report/route.ts">{`// 🔴 POOR PRACTICE: filesystem access in an edge route
// this fails at build time, not at runtime — the bundler cannot resolve 'fs'

import fs from 'fs'; // ❌ 'fs' does not exist in the edge runtime

export const runtime = 'edge'; // ❌ the wrong runtime for this work

export async function GET() {
  // ❌ synchronous Node file reading has no equivalent on the edge
  const rawData = fs.readFileSync('/tmp/data.json', 'utf-8');
  return new Response(rawData);
}`}</CodeBlock>

      <H3>🟢 Production pattern — the right runtime for the job</H3>

      <p>
        <strong>Pattern A — ভারী ডাটাবেস ও ফাইল অপারেশন (Node.js)।</strong>
      </p>

      <CodeBlock filename="app/api/pdf/route.ts">{`// 🟢 PRODUCTION PATTERN: a standard Node.js route handler
import { NextResponse } from 'next/server';

// the default anyway — stating it makes the requirement explicit to reviewers
export const runtime = 'nodejs';

export async function POST(request: Request) {
  const body = await request.json();

  // 🟢 full Node.js capabilities: complex ORM queries, sharp, PDF generation
  // … heavy processing …

  return NextResponse.json({
    status: 'Success',
    processedAt: new Date().toISOString(),
  });
}`}</CodeBlock>

      <p>
        <strong>Pattern B — লো-লেটেন্সি জিও রাউট (Edge)।</strong>
      </p>

      <CodeBlock filename="app/api/geo/route.ts">{`// 🟢 PRODUCTION PATTERN: an ultra-fast edge route
import { NextResponse } from 'next/server';

export const runtime = 'edge';

export async function GET(request: Request) {
  // 🟢 header reading and regex are web-standard — perfectly at home on the edge
  const country = request.headers.get('x-vercel-ip-country') || 'BD';
  const userAgent = request.headers.get('user-agent') || '';

  return NextResponse.json({
    country,
    isMobile: /mobile/i.test(userAgent),
    edgeTimestamp: Date.now(),
  });
}`}</CodeBlock>

      <p>
        <strong>Pattern C — এজ থেকে ডাটাবেস পড়তে হলে।</strong>
      </p>

      <CodeBlock filename="app/api/edge-stats/route.ts">{`// 🟢 PRODUCTION PATTERN: HTTP-based database access from the edge
import { NextResponse } from 'next/server';

export const runtime = 'edge';

export async function GET() {
  // 🟢 an HTTP driver speaks plain fetch — no TCP socket required
  const res = await fetch(\`\${process.env.NEON_HTTP_URL}/query\`, {
    method: 'POST',
    headers: {
      Authorization: \`Bearer \${process.env.NEON_API_KEY}\`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ query: 'SELECT count(*) FROM visits' }),
  });

  return NextResponse.json(await res.json());
}`}</CodeBlock>

      {/* ── Matrix ────────────────────────────────────────────────────── */}
      <H2 id="matrix">৪. Edge Runtime vs Node.js Runtime</H2>

      <Table
        head={["বিষয়", "Node.js runtime", "Edge runtime"]}
        rows={[
          [
            "API সাপোর্ট",
            "Full Node.js APIs (fs, path, net)",
            "Web standard APIs (fetch, crypto, URL)",
          ],
          ["Cold start", "৫০ms – ৫০০ms 🟡", "প্রায় ইনস্ট্যান্ট 🟢"],
          [
            "ডাটাবেস কানেকশন",
            "যেকোনো TCP / native ORM 🟢",
            "শুধু HTTP / serverless ড্রাইভার 🟡",
          ],
          [
            "এক্সিকিউশন লিমিট",
            "বেশি — দশ সেকেন্ড থেকে মিনিট 🟢",
            "কড়া সীমা 🔴",
          ],
          [
            "সঠিক ব্যবহার",
            "Heavy API, SSR, file ও DB অপারেশন",
            "Middleware, geo-routing, A/B test, auth check 🟢",
          ],
        ]}
      />

      <Line name="ভুলু ভাই">
        কনসেপ্ট একদম ক্লিয়ার ফাহিম! এখন বুঝেছি যে মিডলওয়্যার বা হালকা জিও-চেকের জন্য এজ রানটাইম সেরা,
        কিন্তু Prisma দিয়ে জটিল ডাটাবেস কোয়েরি চালানোর জন্য Node.js রানটাইমই ব্যবহার করতে হবে।
      </Line>

      {/* ── Takeaways ─────────────────────────────────────────────────── */}
      <H2 id="takeaway">Production Takeaways</H2>

      <Note>
        <ul>
          <li>
            <strong>Keep middleware light:</strong> <code>middleware.ts</code> ডিফল্টভাবেই এজ
            রানটাইমে চলে — তাই সেখানে কোনো ভারী নোড প্যাকেজ ইমপোর্ট করবেন না, বিল্ডই ভেঙে যাবে।
          </li>
          <li>
            <strong>Default to Node.js for data-heavy work:</strong> অ্যাপের মূল কাজ যদি হয় জটিল
            কোয়েরি ও ফাইল হ্যান্ডলিং, তবে ডিফল্ট রানটাইমই সেরা পছন্দ — এজ-এ সরানোর তাড়া নেই।
          </li>
          <li>
            <strong>Use HTTP drivers on the edge:</strong> এজ রাউট থেকে ডাটাবেস অ্যাক্সেস করতেই হলে
            Neon, Supabase HTTP বা Upstash-এর মতো serverless-friendly HTTP API ব্যবহার করুন।
          </li>
        </ul>
      </Note>
    </article>
  );
}
