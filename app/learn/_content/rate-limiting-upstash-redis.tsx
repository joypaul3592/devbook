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
      bn: "৫ মিনিটে হাজার ডলারের বিল",
      en: "A thousand-dollar bill in five minutes",
    },
  },
  {
    id: "architecture",
    label: {
      bn: "Upstash Redis rate limiting আর্কিটেকচার",
      en: "The Upstash Redis rate limiting architecture",
    },
  },
  {
    id: "mechanisms",
    label: { bn: "৩টি আর্কিটেকচারাল কনসেপ্ট", en: "Three architectural concepts" },
  },
  {
    id: "implementation",
    label: {
      bn: "Sliding window limiter সেটআপ",
      en: "Setting up a sliding-window limiter",
    },
  },
  {
    id: "matrix",
    label: { bn: "Rate Limiting Comparison", en: "Rate limiting comparison" },
  },
  {
    id: "takeaway",
    label: { bn: "Production Takeaways", en: "Production takeaways" },
  },
];

export default function RateLimitingUpstashRedis() {
  return (
    <article className="doc-prose">
      {/* ── The problem ───────────────────────────────────────────────── */}
      <H2 id="the-problem" anchorOnly>
        ৫ মিনিটে হাজার ডলারের বিল
      </H2>

      <p>
        রাত ৮:৩০। ভুলু ভাই হঠাৎ প্যানিক মোডে সাপোর্ট গ্রুপে মেসেজ দিলেন! তার নতুন AI-ভিত্তিক সার্ভিস আর
        OTP ভ্যালিডেশন API রুটে এক ক্ষতিকর বট আক্রমণ করেছে। এক সেকেন্ডে ১০,০০০ ভুয়া রিকোয়েস্ট আসার
        কারণে ডাটাবেজ ক্র্যাশ করেছে এবং থার্ড-পার্টি সার্ভিসগুলোর ইউসেজ বিল আকাশে উঠে গেছে!
      </p>

      <Line name="ভুলু ভাই">
        ফাহিম! শেষ হয়ে গেলাম! বটের পাল্লায় পড়ে ৫ মিনিটে আমার OTP প্রোভাইডার সার্ভিস আর AI API-এর সব
        ক্রেডিট শেষ হয়ে বিল হাজার ডলারে পৌঁছে গেছে! কোনো সিঙ্গেল IP বা ইউজার যেন মিনিটে নির্দিষ্ট
        সংখ্যার বেশি রিকোয়েস্ট মারতে না পারে, তা থামাব কীভাবে?
      </Line>

      <Line name="ফাহিম">
        ভুলু ভাই! স্রেফ কন্ডিশন দিয়ে ব্যাকএন্ডে রিকোয়েস্ট সামলানো যায় না! সার্ভারলেস ও এজ
        এনভায়রনমেন্টে স্কেল করার জন্য আপনার প্রয়োজন একটি rate limiting engine। কোনো ইউজার বা বট
        ফেয়ার-ইউসেজ লিমিট ক্রস করলেই তাকে HTTP <code>429 Too Many Requests</code> দিয়ে এজের শুরুতেই
        ব্লক করে দিতে হবে!
      </Line>

      <Line name="নেক্সট-ভাই">
        একদম! কিন্তু সার্ভারলেস আর্কিটেকচারে ইন-মেমোরি ভেরিয়েবল বা <code>Map</code> দিয়ে রেট লিমিট কাজ
        করে না — কারণ ফাংশন ইনস্ট্যান্স যেকোনো সময় রি-স্টার্ট হয় এবং স্টেট মনে রাখে না। তাই ব্যবহার
        করতে হবে Upstash Redis (HTTP-based) ও <code>@upstash/ratelimit</code>! এটি sliding window
        অ্যালগরিদমে মিডলওয়্যার বা API লেভেলেই স্প্যামারকে থামিয়ে দেবে।
      </Line>

      {/* ── Architecture ──────────────────────────────────────────────── */}
      <H2 id="architecture">১. Rate Limiting Architecture with Upstash Redis</H2>

      <Diagram>{`┌─────────────────────────────────────────────────────────────────────────────┐
│                 UPSTASH REDIS RATE LIMITING ARCHITECTURE                    │
└─────────────────────────────────────────────────────────────────────────────┘

 Client / bot request ──► Next.js edge middleware or route handler
                                      │
                                      ▼
             queries Upstash Redis over HTTP (@upstash/ratelimit)
                                      │
               ┌──────────────────────┴──────────────────────┐
               ▼                                             ▼
 ❌ limit exceeded (> 5 req / 10s)              🟢 within the limit
 ├── HTTP 429 Too Many Requests                 ├── decrements the remaining quota
 ├── returns a Retry-After header               └── passes through to the handler
 └── blocks execution — DB and LLM safe 🟢          which runs the real work`}</Diagram>

      {/* ── Mechanisms ────────────────────────────────────────────────── */}
      <H2 id="mechanisms">২. কোর আর্কিটেকচারাল কনসেপ্ট</H2>

      <p>
        <strong>Serverless-friendly HTTP Redis:</strong> ট্রেডিশনাল Redis (TCP connection)
        সার্ভারলেস ফাংশনে কানেকশন পুল লিক করে বা পারফরম্যান্স স্লো করে দেয়। Upstash HTTP REST API
        ব্যবহার করায় এই সমস্যা হয় না এবং এটি Edge Runtime-এ শতভাগ কম্প্যাটিবল।
      </p>

      <p>
        <strong>Sliding window algorithm:</strong> fixed window অ্যালগরিদমে উইন্ডোর বর্ডার টাইমে (১ম
        মিনিটের শেষে ৫টি আর ২য় মিনিটের শুরুতে ৫টি) বার্স্ট অ্যাটাক ঠেকানো যায় না। sliding window
        সময়ের প্রতিটি মুহূর্ত ট্র্যাক করে মসৃণভাবে ট্রাফিক লিমিট বজায় রাখে।
      </p>

      <p>
        <strong>Identifier resolution — IP vs user ID:</strong> unauthenticated রুটে (OTP, login,
        public API) ক্লায়েন্টের IP (<code>x-forwarded-for</code>) দিয়ে লিমিট করুন; authenticated রুটে
        (dashboard, AI generation) ইউজারের ইউনিক <code>userId</code> দিয়ে — যাতে একটি শেয়ার্ড NAT
        IP-র পেছনের সব ইউজার একসাথে ব্লক না হয়।
      </p>

      {/* ── Implementation ────────────────────────────────────────────── */}
      <H2 id="implementation">৩. Production Code Implementation</H2>

      <H3>❌ Anti-pattern — in-memory rate limiting in a serverless app</H3>

      <CodeBlock filename="app/api/auth/send-otp/route.ts">{`// 🔴 POOR PRACTICE: an in-memory Map as the rate-limit store
// serverless instances scale out and lose state on cold starts — the limit is bypassed

const memoryStore = new Map<string, number>();

export async function POST(request: Request) {
  const ip = request.headers.get('x-forwarded-for') || 'anonymous';
  const count = memoryStore.get(ip) || 0;

  if (count > 5) {
    // ❌ fails silently across multi-region deployments
    return new Response('Too many requests', { status: 429 });
  }

  memoryStore.set(ip, count + 1);
  return new Response('Success');
}`}</CodeBlock>

      <H3>🟢 Production pattern — an Upstash Redis sliding-window limiter</H3>

      <p>
        <strong>Step 1 — ডিপেনডেন্সি ইনস্টল।</strong>
      </p>

      <CodeBlock filename="terminal">{`npm install @upstash/ratelimit @upstash/redis`}</CodeBlock>

      <p>
        <strong>Step 2 — limiter সেটআপ।</strong>
      </p>

      <CodeBlock filename="lib/ratelimit.ts">{`// 🟢 PRODUCTION PATTERN: sliding-window rate limiters
import { Ratelimit } from '@upstash/ratelimit';
import { Redis } from '@upstash/redis';

// HTTP-based Redis client — safe in serverless and edge runtimes
export const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL!,
  token: process.env.UPSTASH_REDIS_REST_TOKEN!,
});

/** 🟢 strict limiter: 5 requests per 10 seconds — for OTP and auth */
export const strictRateLimiter = new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(5, '10 s'),
  analytics: true,
  prefix: '@ratelimit/strict',
});

/** 🟢 API limiter: 20 requests per minute — for general endpoints */
export const apiRateLimiter = new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(20, '1 m'),
  analytics: true,
  prefix: '@ratelimit/api',
});`}</CodeBlock>

      <p>
        <strong>Step 3 — এজ মিডলওয়্যারে গ্লোবাল প্রোটেকশন।</strong>
      </p>

      <CodeBlock filename="middleware.ts">{`// 🟢 PRODUCTION PATTERN: protecting sensitive routes at the edge
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { strictRateLimiter } from '@/lib/ratelimit';

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (pathname.startsWith('/api/auth/send-otp')) {
    // the first entry in x-forwarded-for is the real client
    const ip =
      request.headers.get('x-forwarded-for')?.split(',')[0].trim() ||
      request.headers.get('x-real-ip') ||
      '127.0.0.1';

    // 🟢 evaluate the limit
    const { success, limit, remaining, reset } = await strictRateLimiter.limit(\`otp_\${ip}\`);

    if (!success) {
      return NextResponse.json(
        {
          error: 'Too Many Requests',
          message: 'You have exceeded the OTP request limit. Try again shortly.',
        },
        {
          status: 429,
          headers: {
            'X-RateLimit-Limit': limit.toString(),
            'X-RateLimit-Remaining': remaining.toString(),
            'X-RateLimit-Reset': reset.toString(),
            'Retry-After': Math.ceil((reset - Date.now()) / 1000).toString(),
          },
        }
      );
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: '/api/:path*',
};`}</CodeBlock>

      <p>
        <strong>Step 4 — authenticated রুটে user-ID ভিত্তিক লিমিট।</strong>
      </p>

      <CodeBlock filename="app/api/ai/generate/route.ts">{`// 🟢 PRODUCTION PATTERN: per-user rate limiting in a route handler
import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { apiRateLimiter } from '@/lib/ratelimit';
import { verifySessionToken } from '@/lib/auth/session';

export async function POST() {
  const cookieStore = await cookies();
  const sessionToken = cookieStore.get('session_token')?.value;
  const session = await verifySessionToken(sessionToken);

  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  // 🟢 keyed on the authenticated user id, not the IP
  const { success, remaining } = await apiRateLimiter.limit(\`user_ai_\${session.user.id}\`);

  if (!success) {
    return NextResponse.json(
      { error: 'Rate limit exceeded for AI generation. Please wait a minute.' },
      { status: 429 }
    );
  }

  // the expensive LLM / DB work now runs behind a quota
  return NextResponse.json({
    result: 'Generated content safely',
    quotaRemaining: remaining,
  });
}`}</CodeBlock>

      {/* ── Matrix ────────────────────────────────────────────────────── */}
      <H2 id="matrix">৪. Rate Limiting Strategy Comparison</H2>

      <Table
        head={[
          "বৈশিষ্ট্য",
          "In-memory Map",
          "Upstash Redis (@upstash/ratelimit)",
          "Cloudflare / Vercel WAF",
        ]}
        rows={[
          [
            "Serverless / edge fit",
            "অনুপযোগী — state হারায় 🔴",
            "নিখুঁত (HTTP REST) 🟢",
            "সর্বোচ্চ — edge network লেভেল 🟢",
          ],
          [
            "Algorithm precision",
            "অনির্ভরযোগ্য 🔴",
            "Sliding window, একুরেট 🟢",
            "সংবেদনশীল রুলস 🟢",
          ],
          [
            "Per-user limiting",
            "সম্ভব নয় 🔴",
            "IP বা user id — সহজে টিউনযোগ্য 🟢",
            "সীমিত, প্রধানত IP-ভিত্তিক 🟡",
          ],
          [
            "Setup cost",
            "শূন্য, কিন্তু অকার্যকর 🔴",
            "সহজ, ফ্রি টিয়ার যথেষ্ট 🟢",
            "প্রিমিয়াম প্ল্যান লাগতে পারে 🟡",
          ],
        ]}
      />

      <Line name="ভুলু ভাই">
        অসাধারণ ফাহিম! Upstash Redis দিয়ে sliding window rate limiting বসানোর পর এখন স্প্যামারদের আর
        কোনো সুযোগ নেই! ৫ বার ট্রাই করার পরেই রিকোয়েস্টগুলো ৪২৯ স্ট্যাটাস নিয়ে মিডলওয়্যারেই ব্লক হয়ে
        যাচ্ছে।
      </Line>

      {/* ── Takeaways ─────────────────────────────────────────────────── */}
      <H2 id="takeaway">Production Takeaways</H2>

      <Note>
        <ul>
          <li>
            <strong>Avoid in-memory stores:</strong> সার্ভারলেস এনভায়রনমেন্টে রিকোয়েস্ট গণনার জন্য
            কখনো মডিউল-লেভেল ভেরিয়েবল বা <code>Map</code> ব্যবহার করবেন না — ইনস্ট্যান্ট স্কেল আউট
            হলেই লিমিট বাইপাস হয়ে যায়।
          </li>
          <li>
            <strong>Prefer sliding over fixed windows:</strong> বর্ডার-টাইম বার্স্ট ঠেকাতে{" "}
            <code>Ratelimit.slidingWindow()</code> ব্যবহার করাই বেস্ট প্র্যাকটিস।
          </li>
          <li>
            <strong>Always return standard headers:</strong> ব্লক করার সময় <code>429</code>{" "}
            স্ট্যাটাসের পাশাপাশি <code>Retry-After</code> ও <code>X-RateLimit-Remaining</code> হেডার
            দিন — ক্লায়েন্ট তখন বুদ্ধিমানভাবে ব্যাক-অফ করতে পারে।
          </li>
        </ul>
      </Note>
    </article>
  );
}
