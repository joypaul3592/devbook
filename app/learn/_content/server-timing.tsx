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
      bn: "TTFB ১.৮s, কিন্তু কোথায়?",
      en: "TTFB 1.8s — but where?",
    },
  },
  {
    id: "architecture",
    label: {
      bn: "Server-Timing হেডার ফ্লো",
      en: "The Server-Timing header flow",
    },
  },
  {
    id: "mechanisms",
    label: { bn: "৩টি আর্কিটেকচারাল কনসেপ্ট", en: "Three architectural concepts" },
  },
  {
    id: "implementation",
    label: {
      bn: "Timing ইউটিলিটি ও route হ্যান্ডলার",
      en: "A timing utility & route handler",
    },
  },
  {
    id: "matrix",
    label: { bn: "Server Timing Breakdown", en: "Server timing breakdown" },
  },
  {
    id: "takeaway",
    label: { bn: "Production Takeaways", en: "Production takeaways" },
  },
];

export default function ServerTiming() {
  return (
    <article className="doc-prose">
      {/* ── The problem ───────────────────────────────────────────────── */}
      <H2 id="the-problem" anchorOnly>
        TTFB ১.৮s, কিন্তু কোথায়?
      </H2>

      <p>
        রাত ১০:৪৫। সাইটের পেজ লোড হতে সময় লাগছে প্রায় ২ সেকেন্ড! কিন্তু ব্রাউজার DevTools-এর Network
        ট্যাবে ভুলু ভাই শুধু একটি জিনিসই দেখতে পাচ্ছেন — <code>TTFB: 1.8s</code>। কিন্তু এই ১.৮
        সেকেন্ডের মধ্যে ঠিক কোন জায়গাটাতে সময় নষ্ট হচ্ছে? ডাটাবেস কোয়েরিতে? ক্যাশ মিসে? নাকি কোনো
        থার্ড-পার্টি API কলে?
      </p>

      <Line name="ভুলু ভাই">
        ফাহিম! ব্রাউজার তো শুধু বলছে সার্ভার রেসপন্স দিতে ১.৮ সেকেন্ড দেরি করেছে। কিন্তু সার্ভারের
        ভেতরে ঠিক কোথায় ঝামেলাটা হচ্ছে, সেটা ব্রাউজারে বসেই কীভাবে ডিবাগ করব?
      </Line>

      <Line name="ফাহিম">
        ভুলু ভাই! এর সমাধান হলো <code>Server-Timing</code> HTTP response header! এটি একটি স্ট্যান্ডার্ড
        হেডার, যার মাধ্যমে ব্যাকএন্ডের কোন কাজটি কত মিলিসেকেন্ড নিয়েছে তা ব্রাউজারে পাঠানো যায় —
        DevTools-এর Network → Timing ট্যাবে সেগুলো সরাসরি ভিজ্যুয়ালি দেখা যায়!
      </Line>

      <Line name="নেক্সট-ভাই">
        একদম! Middleware, route handler এবং Server Components-এ ছোট একটি মেজারিং ইউটিলিটি বসিয়ে দিলে
        সার্ভারের ভেতরের বটলনেক মুহূর্তেই ধরা পড়ে — কোনো APM সাবস্ক্রিপশন ছাড়াই।
      </Line>

      {/* ── Architecture ──────────────────────────────────────────────── */}
      <H2 id="architecture">১. Server-Timing Header Flow</H2>

      <Diagram>{`┌─────────────────────────────────────────────────────────────────────────────┐
│                          SERVER-TIMING HEADER FLOW                          │
└─────────────────────────────────────────────────────────────────────────────┘

 [browser]
    │
    ├─── 1. HTTP request ──────────────────────────────────────────────┐
    │                                                          [Next.js server]
    │                                     ┌─ auth validation   (15ms)  │
    │                                     ├─ database fetch    (350ms) │
    │                                     └─ external payment  (800ms) │
    │                                                                  │
    │─── 2. response + Server-Timing header ───────────────────────────┘
    │      Server-Timing: auth;dur=15, db;dur=350, payment;dur=800
    ▼
 [DevTools → Network → Timing]
 ┌─────────────────────────────────────────────────────────┐
 │ █              auth      :  15ms                        │
 │ ██████         database  : 350ms                        │
 │ ██████████████ payment   : 800ms   ← the real bottleneck │
 └─────────────────────────────────────────────────────────┘`}</Diagram>

      {/* ── Mechanisms ────────────────────────────────────────────────── */}
      <H2 id="mechanisms">২. কোর আর্কিটেকচারাল কনসেপ্ট</H2>

      <p>
        <strong>Server-Timing syntax:</strong> ফরম্যাটটি হলো{" "}
        <code>name;dur=milliseconds;desc=&quot;description&quot;</code> — <code>name</code> মেট্রিকের
        নাম (<code>db</code>, <code>cache</code>, <code>auth</code>), <code>dur</code> কত মিলিসেকেন্ড
        লেগেছে, আর <code>desc</code> ঐচ্ছিক বর্ণনা যা DevTools-এ দেখা যায়।
      </p>

      <p>
        <strong>Multiple metrics:</strong> কমা দিয়ে একাধিক মেট্রিক এক লাইনে পাঠানো যায় —{" "}
        <code>db;dur=120;desc=&quot;Prisma SQL&quot;, redis;dur=5;desc=&quot;Cache hit&quot;</code>।
      </p>

      <p>
        <strong>Performance vs privacy:</strong> ডেভেলপমেন্ট ও স্টেজিংয়ে বিস্তারিত তথ্য দেখানো উপকারী,
        কিন্তু প্রোডাকশনে এই হেডার সবাই দেখতে পায় — তাই টেবিলের নাম বা ইন্টারনাল সার্ভিসের গঠন ফাঁস
        করে এমন <code>desc</code> এড়িয়ে চলুন।
      </p>

      {/* ── Implementation ────────────────────────────────────────────── */}
      <H2 id="implementation">৩. Production Code Implementation</H2>

      <H3>❌ Anti-pattern — a black box response</H3>

      <CodeBlock filename="app/api/dashboard/route.ts">{`// 🔴 POOR PRACTICE: high TTFB with zero visibility into which step is slow

export async function GET() {
  const user = await checkAuth();            // how long did this take? no idea
  const data = await fetchFromDB();          // slow DB, or slow network?
  const externalData = await fetchThirdParty(); // the bottleneck? who knows

  return Response.json({ user, data, externalData });
}`}</CodeBlock>

      <H3>🟢 Production pattern — a reusable timing profiler</H3>

      <p>
        <strong>Step 1 — timing হেল্পার।</strong>
      </p>

      <CodeBlock filename="lib/server-timing.ts">{`// 🟢 PRODUCTION PATTERN: a tiny reusable measurement utility

export class ServerTiming {
  private metrics = new Map<string, { duration: number; description?: string }>();

  /** Measures any async operation and records it under \`name\`. */
  async measure<T>(name: string, description: string, fn: () => Promise<T>): Promise<T> {
    // 🟢 performance.now() is monotonic and sub-millisecond;
    // Date.now() can jump backwards when the clock syncs
    const start = performance.now();
    try {
      return await fn();
    } finally {
      // finally: a failing step is still a step worth timing
      const duration = Number((performance.now() - start).toFixed(2));
      this.metrics.set(name, { duration, description });
    }
  }

  /** Serialises everything measured into one header value. */
  getHeaderValue(): string {
    return Array.from(this.metrics.entries())
      .map(([name, { duration, description }]) => {
        const desc = description ? \`;desc="\${description}"\` : '';
        return \`\${name};dur=\${duration}\${desc}\`;
      })
      .join(', ');
  }
}`}</CodeBlock>

      <p>
        <strong>Step 2 — route handler-এ ইনস্ট্রুমেন্টেশন।</strong>
      </p>

      <CodeBlock filename="app/api/dashboard/route.ts">{`// 🟢 PRODUCTION PATTERN: every step measured, shipped to the browser
import { NextResponse } from 'next/server';
import { ServerTiming } from '@/lib/server-timing';

export async function GET() {
  const timer = new ServerTiming();

  const user = await timer.measure('auth', 'JWT verification', async () => {
    return getSessionUser();
  });

  const dbData = await timer.measure('db', 'PostgreSQL query', async () => {
    return getRecentOrders(user.id);
  });

  const apiData = await timer.measure('ext_api', 'Payment gateway status', async () => {
    return getGatewayStatus();
  });

  const response = NextResponse.json({ user, dbData, apiData });

  // 🟢 now visible in DevTools → Network → Timing, per request
  response.headers.set('Server-Timing', timer.getHeaderValue());

  return response;
}`}</CodeBlock>

      <p>
        <strong>Step 3 — মিডলওয়্যার ওভারহেড মাপা।</strong>
      </p>

      <CodeBlock filename="middleware.ts">{`// 🟢 PRODUCTION PATTERN: measure the middleware layer itself
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const startTime = performance.now();

  const response = NextResponse.next();

  const duration = (performance.now() - startTime).toFixed(2);

  // note: middleware runs before the route, so this measures the middleware
  // layer only — the route handler appends its own metrics separately
  response.headers.set(
    'Server-Timing',
    \`middleware;dur=\${duration};desc="Middleware execution"\`
  );

  return response;
}`}</CodeBlock>

      {/* ── Matrix ────────────────────────────────────────────────────── */}
      <H2 id="matrix">৪. Server Timing Breakdown</H2>

      <Table
        head={["মেট্রিক", "কী পরিমাপ করে", "হেডারে যেভাবে যায়", "আদর্শ থ্রেশহোল্ড"]}
        rows={[
          ["middleware", "Edge/Node middleware execution", "middleware;dur=12", "< ২০ms 🟢"],
          [
            "auth",
            "JWT verification / session check",
            'auth;dur=15;desc="Session check"',
            "< ৩০ms 🟢",
          ],
          ["cache", "Redis / memory cache lookup", 'cache;dur=3;desc="Redis hit"', "< ৫ms 🟢"],
          ["db", "database queries", 'db;dur=120;desc="Prisma SQL"', "< ১০০ms 🟢"],
          ["ext_api", "third-party services", "ext_api;dur=350", "< ৩০০ms 🟢"],
        ]}
      />

      <Line name="ভুলু ভাই">
        অসাধারণ ফাহিম! এখন আর অন্ধের মতো অনুমান করতে হবে না। DevTools-এর Network → Timing খুললেই স্পষ্ট
        দেখা যাবে ব্যাকএন্ডের কোন ফাংশনে কত সময় লাগছে!
      </Line>

      {/* ── Takeaways ─────────────────────────────────────────────────── */}
      <H2 id="takeaway">Production Takeaways</H2>

      <Note>
        <ul>
          <li>
            <strong>Stop guessing bottlenecks:</strong> সময় ডাটাবেসে নাকি এক্সটার্নাল API-তে নষ্ট
            হচ্ছে — অনুমানের বদলে <code>Server-Timing</code> দিয়ে মেপে চিহ্নিত করুন।
          </li>
          <li>
            <strong>Use performance.now():</strong> সঠিক সাব-মিলিসেকেন্ড পরিমাপের জন্য{" "}
            <code>Date.now()</code>-এর বদলে সবসময় <code>performance.now()</code> ব্যবহার করুন — এটি
            monotonic, ক্লক সিঙ্কে পিছিয়ে যায় না।
          </li>
          <li>
            <strong>Do not leak internals in production:</strong> এই হেডার ক্লায়েন্টে দৃশ্যমান — তাই{" "}
            <code>desc</code>-এ টেবিলের নাম বা ইন্টারনাল সার্ভিস টপোলজি লিখবেন না, অথবা প্রোডাকশনে
            শুধু <code>dur</code> পাঠান।
          </li>
        </ul>
      </Note>
    </article>
  );
}
