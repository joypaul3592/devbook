import {
  CodeBlock,
  Diagram,
  H2,
  Line,
  Note,
} from "@/components/learn/DocParts";
import type { Bi } from "@/lib/curriculum";

/** Section anchors — consumed by the "on this page" rail. */
export const headings: { id: string; label: Bi }[] = [
  {
    id: "the-problem",
    label: {
      bn: "গেটম্যান ছাড়া দরজা",
      en: "A door with no gatekeeper",
    },
  },
  {
    id: "mental-model",
    label: { bn: "Middleware সিকিউরিটি লেয়ার", en: "The middleware layer" },
  },
  {
    id: "bot-config",
    label: { bn: "Step A — Bot প্যাটার্ন", en: "Step A — bot patterns" },
  },
  {
    id: "middleware",
    label: { bn: "Step B — Edge সিকিউরিটি গার্ড", en: "Step B — the edge guard" },
  },
  {
    id: "nonce",
    label: { bn: "Step C — Layout-এ Nonce", en: "Step C — nonce in the layout" },
  },
  {
    id: "takeaway",
    label: { bn: "Production Takeaways", en: "Production takeaways" },
  },
];

export default function MiddlewareSecurityGuards() {
  return (
    <article className="doc-prose">
      {/* ── The problem ───────────────────────────────────────────────── */}
      <H2 id="the-problem" anchorOnly>
        গেটম্যান ছাড়া দরজা
      </H2>

      <p>
        রাত ১:২০। ভুলু ভাই সিকিউরড সার্ভার অ্যাকশন, ফাইল ভ্যালিডেশন আর Rate Limiting বসিয়ে
        নিশ্চিন্তে ঘুমানোর প্রস্তুতি নিচ্ছিলেন। এমন সময় ফাহিম লাইভ ট্রাফিক লগ দেখিয়ে বলল —
        &quot;অ্যাকশনগুলো সিকিউরড ঠিকই, কিন্তু হ্যাকাররা সরাসরি তোমার রুটে অ্যাটাক করছে! বট
        দিয়ে স্ক্র্যাপার চালাচ্ছে, ক্লিকজ্যাকিং আর XSS ট্রাই করছে!&quot;
      </p>

      <Line name="ভুলু ভাই">
        (চোখ বড় বড় করে) নেক্সট-ভাই! কোনো রিকোয়েস্ট পেজ বা সার্ভার অ্যাকশনে পৌঁছানোর আগেই কি
        গেটম্যানের মতো Edge লেভেলে ফিল্টার করে আটকে দেওয়া সম্ভব?
      </Line>

      <Line name="নেক্সট-ভাই">
        (হেসে) অবশ্যই! <strong>Next.js Middleware</strong> হলো অ্যাপের প্রথম সিকিউরিটি লেয়ার।
        রিকোয়েস্ট ঢোকার সাথে সাথেই Edge-এ তিনটি কাজ করা যায় — Security Headers ইনজেক্ট করা,
        Bad User-Agent ও স্ক্র্যাপার ড্রপ করা, আর Nonce-ভিত্তিক CSP দিয়ে স্ক্রিপ্ট ইনজেকশন
        ঠেকানো।
      </Line>

      {/* ── Mental model ──────────────────────────────────────────────── */}
      <H2 id="mental-model">১. Middleware সিকিউরিটি লেয়ার</H2>

      <Diagram>{`[ Incoming user / bot request ]
               │
               ▼
┌────────────────────────────────────────────────────────┐
│ 🛡️  Edge layer: Next.js middleware guard               │
└────────────────────────────────────────────────────────┘
               │
               ├── 🤖 Bot / scraper detected ──────► ⛔ 403 Forbidden
               │
               ├── 🛑 Bad header / invalid nonce ──► ⛔ Drop the request
               │
               ▼ 🟢 Clean request verified
┌────────────────────────────────────────────────────────┐
│ 🔑  Inject nonce + production security headers         │
│     (CSP, HSTS, X-Frame-Options, X-Content-Type)       │
└────────────────────────────────────────────────────────┘
               │
               ▼
┌────────────────────────────────────────────────────────┐
│ 🚀  Forward to the route / server action               │
└────────────────────────────────────────────────────────┘`}</Diagram>

      {/* ── Bot config ────────────────────────────────────────────────── */}
      <H2 id="bot-config">২. Step A — Bot প্যাটার্ন</H2>

      <CodeBlock filename="lib/security-config.ts">{`// Known scraper / scanner user agents
export const BLOCKED_USER_AGENTS = [
  'python-requests',
  'curl',
  'wget',
  'go-http-client',
  'scrapy',
  'nikto',
  'sqlmap',
  'httpx',
  'zgrab',
];

export function isBadBot(userAgent: string | null): boolean {
  if (!userAgent) return true; // No user agent at all is suspicious

  const lowerUA = userAgent.toLowerCase();
  return BLOCKED_USER_AGENTS.some((bot) => lowerUA.includes(bot));
}`}</CodeBlock>

      {/* ── Middleware ────────────────────────────────────────────────── */}
      <H2 id="middleware">৩. Step B — Edge সিকিউরিটি গার্ড</H2>

      <CodeBlock filename="middleware.ts">{`import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { isBadBot } from '@/lib/security-config';

export function middleware(request: NextRequest) {
  const userAgent = request.headers.get('user-agent');
  const nonce = Buffer.from(crypto.randomUUID()).toString('base64');

  // 🤖 1. Shielding — bot and malicious user-agent detection
  if (isBadBot(userAgent)) {
    const ip = request.headers.get('x-forwarded-for')?.split(',')[0] ?? 'unknown';
    console.warn(\`[SECURITY BLOCK] bot blocked — ip: \${ip}, ua: \${userAgent}\`);

    return new NextResponse(
      JSON.stringify({ error: 'Access denied: automated request detected.' }),
      { status: 403, headers: { 'Content-Type': 'application/json' } },
    );
  }

  // 🔐 2. Content Security Policy with a per-request nonce
  const cspHeader = \`
    default-src 'self';
    script-src 'self' 'nonce-\${nonce}' 'strict-dynamic' \${
      process.env.NODE_ENV === 'development' ? "'unsafe-eval'" : ''
    };
    style-src 'self' 'unsafe-inline';
    img-src 'self' blob: data: https:;
    font-src 'self' data:;
    object-src 'none';
    base-uri 'self';
    form-action 'self';
    frame-ancestors 'none';
    upgrade-insecure-requests;
  \`
    .replace(/\\s{2,}/g, ' ')
    .trim();

  // 🛡️ 3. Pass the nonce down so server components can read it
  const requestHeaders = new Headers(request.headers);
  requestHeaders.set('x-nonce', nonce);
  requestHeaders.set('Content-Security-Policy', cspHeader);

  // 🚀 4. Inject the production security headers on the response
  const response = NextResponse.next({ request: { headers: requestHeaders } });

  response.headers.set(
    'Strict-Transport-Security',
    'max-age=63072000; includeSubDomains; preload',
  );
  response.headers.set('X-Frame-Options', 'DENY');            // Clickjacking
  response.headers.set('X-Content-Type-Options', 'nosniff');  // MIME sniffing
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
  response.headers.set(
    'Permissions-Policy',
    'camera=(), microphone=(), geolocation=(), browsing-topics=()',
  );
  response.headers.set('Content-Security-Policy', cspHeader);

  return response;
}

// 🎯 Runs everywhere except static assets, images and internal files
export const config = {
  matcher: [
    {
      source: '/((?!_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)',
      missing: [
        { type: 'header', key: 'next-router-prefetch' },
        { type: 'header', key: 'purpose', value: 'prefetch' },
      ],
    },
  ],
};`}</CodeBlock>

      {/* ── Nonce ─────────────────────────────────────────────────────── */}
      <H2 id="nonce">৪. Step C — Layout-এ Nonce</H2>

      <CodeBlock filename="app/layout.tsx">{`import { headers } from 'next/headers';
import Script from 'next/script';
import './globals.css';

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // 🔑 Read the nonce the middleware attached
  const headersList = await headers();
  const nonce = headersList.get('x-nonce') || undefined;

  return (
    <html lang="bn">
      <body className="bg-slate-950 text-slate-100 antialiased">
        {children}

        {/* 🛡️ CSP-compliant external script */}
        <Script
          src="https://example.com/analytics.js"
          strategy="afterInteractive"
          nonce={nonce}
        />
      </body>
    </html>
  );
}`}</CodeBlock>

      <Line name="ভুলু ভাই">
        (উৎফুল্ল হয়ে) চমৎকার! এবার কেউ curl বা python দিয়ে স্ক্র্যাপার চালালে মিডলওয়্যার
        লেয়ারেই ৪০৩ পেয়ে ব্লক হবে, আর ব্রাউজারেও শক্তিশালী সিকিউরিটি হেডার ইনজেক্ট হয়ে গেল!
      </Line>

      {/* ── Takeaways ─────────────────────────────────────────────────── */}
      <H2 id="takeaway">Production Takeaways</H2>

      <Note>
        <ul>
          <li>
            <strong>Edge-Level Early Dropping:</strong> বট ফিল্টারিং অ্যাপ লেভেলে না করে
            Middleware-এ করুন — RSC রেন্ডার বা DB কানেকশনের আগেই CPU cycle বেঁচে যায়।
          </li>
          <li>
            <strong>Dynamic Nonce with CSP:</strong> শুধু <code>unsafe-inline</code> বন্ধ
            করলেই CSP সম্পূর্ণ হয় না — ইনলাইন স্ক্রিপ্টের জন্য প্রতি রিকোয়েস্টে nonce তৈরি
            করে layout-এ পাঠাতে হবে।
          </li>
          <li>
            <strong>Exclude Prefetch in Matcher:</strong> Next.js-এর প্রি-ফেচ রিকোয়েস্টে যেন
            অহেতুক মিডলওয়্যার না চলে, সেজন্য matcher-এ{" "}
            <code>next-router-prefetch</code> বাদ রাখুন।
          </li>
          <li>
            <strong>HSTS Preload:</strong> প্রোডাকশনে{" "}
            <code>Strict-Transport-Security</code> এনফোর্স করলে সাইট কখনো প্লেইন HTTP-তে
            কমিউনিকেট করবে না।
          </li>
        </ul>
      </Note>
    </article>
  );
}
