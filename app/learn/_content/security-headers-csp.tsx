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
      bn: "Clickjacking-এর জন্য উন্মুক্ত সাইট",
      en: "A site wide open to clickjacking",
    },
  },
  {
    id: "architecture",
    label: {
      bn: "Security headers ও CSP পাইপলাইন",
      en: "Security headers & CSP pipeline",
    },
  },
  {
    id: "mechanisms",
    label: { bn: "৩টি আর্কিটেকচারাল কনসেপ্ট", en: "Three architectural concepts" },
  },
  {
    id: "implementation",
    label: {
      bn: "Static হেডার ও nonce-ভিত্তিক CSP",
      en: "Static headers & a nonce-based CSP",
    },
  },
  {
    id: "matrix",
    label: { bn: "Security Headers Matrix", en: "Security headers matrix" },
  },
  {
    id: "takeaway",
    label: { bn: "Production Takeaways", en: "Production takeaways" },
  },
];

export default function SecurityHeadersCsp() {
  return (
    <article className="doc-prose">
      {/* ── The problem ───────────────────────────────────────────────── */}
      <H2 id="the-problem" anchorOnly>
        Clickjacking-এর জন্য উন্মুক্ত সাইট
      </H2>

      <p>
        রাত ১০:০০। ভুলু ভাই একটি থার্ড-পার্টি পেনিট্রেশন টেস্ট রিপোর্ট দেখে কপালে হাত দিয়ে বসে আছেন!
        অডিট রিপোর্টে দেখা যাচ্ছে, অ্যাপ্লিকেশনে কোনো HTTP security header না থাকায় সাইটটি
        clickjacking (অনাকাঙ্ক্ষিত <code>&lt;iframe&gt;</code>-এ সাইট ওপেন করে ইউজারকে দিয়ে বাটন
        ক্লিক করানো) এবং MIME-sniffing অ্যাটাকের জন্য উন্মুক্ত। এছাড়া ব্রাউজার যেকোনো অজানা ডোমেইন
        থেকে ম্যালিশিয়াস ইনলাইন জাভাস্ক্রিপ্ট নির্বিচারে এক্সিকিউট করছে।
      </p>

      <Line name="ভুলু ভাই">
        ফাহিম! আমি তো সার্ভার-সাইড ভ্যালিডেশন, কুকি সিকিউরিটি সব ঠিক করলাম! কিন্তু ব্রাউজারকে কীভাবে
        বলব যে সে যেন আমার সাইটকে অন্য কারো আইফ্রেমে লোড হতে না দেয় এবং কোনো অননুমোদিত ইনলাইন স্ক্রিপ্ট
        রান না করে?
      </Line>

      <Line name="ফাহিম">
        ভুলু ভাই! ব্রাউজারকে এই কঠোর নিয়ম বোঝানোর একমাত্র উপায় হলো HTTP response header! বিশেষ করে
        Content Security Policy (CSP) ব্যবহার করে আপনি ব্রাউজারকে একটি ট্রাস্টেড হোয়াইটলিস্ট দিয়ে
        দিতে পারেন, যার বাইরে কোনো সোর্স থেকে আসা স্ক্রিপ্ট বা আইফ্রেম ব্রাউজার তৎক্ষণাৎ ব্লক করে দেবে।
      </Line>

      <Line name="নেক্সট-ভাই">
        একদম! App Router-এ <code>next.config.ts</code>-এর মাধ্যমে স্ট্যাটিক হেডার এবং{" "}
        <code>middleware.ts</code>-এ dynamic cryptographic nonce generator দিয়ে strict CSP আর্কিটেকচার
        সেটআপ করা যায়! এতে XSS ও clickjacking অ্যাটাক ব্রাউজারে পৌঁছানো মাত্রই ব্লক হয়ে যায়।
      </Line>

      {/* ── Architecture ──────────────────────────────────────────────── */}
      <H2 id="architecture">১. Security Headers &amp; CSP Defense Architecture</H2>

      <Diagram>{`┌─────────────────────────────────────────────────────────────────────────────┐
│                 HTTP SECURITY HEADERS & CSP DEFENSE PIPELINE                │
└─────────────────────────────────────────────────────────────────────────────┘

 Server response (Next.js middleware / config)
                         │
                         ├── 1. Content-Security-Policy: script-src 'nonce-xyz123'
                         ├── 2. X-Frame-Options: DENY
                         ├── 3. X-Content-Type-Options: nosniff
                         └── 4. Strict-Transport-Security: max-age=63072000
                         │
                         ▼
 ┌───────────────────────────────────────────────────────────────────────────┐
 │ Browser enforcement layer                                                 │
 └───────────────────────────────────────────────────────────────────────────┘
                         │
        ┌────────────────┼────────────────────────┐
        ▼                ▼                        ▼
 ❌ clickjacking      ❌ untrusted script      🟢 trusted nonce script
 blocked from an     blocked by CSP           executed safely
 external <iframe>   (no nonce match)`}</Diagram>

      {/* ── Mechanisms ────────────────────────────────────────────────── */}
      <H2 id="mechanisms">২. কোর আর্কিটেকচারাল কনসেপ্ট</H2>

      <p>
        <strong>CSP &amp; the cryptographic nonce:</strong> CSP ব্রাউজারকে নির্দেশ দেয় কোন ডোমেইন থেকে
        স্ক্রিপ্ট, স্টাইল বা ইমেজ লোড হওয়া নিরাপদ। প্রতিটি রিকোয়েস্টে সার্ভার একটি ইউনিক র‍্যান্ডম
        টোকেন (nonce) জেনারেট করে স্ক্রিপ্ট ট্যাগে যুক্ত করে — যা হ্যাকারের ইনজেক্ট করা ইনলাইন
        স্ক্রিপ্ট এক্সিকিউশন ব্লক করে দেয়।
      </p>

      <p>
        <strong>Clickjacking protection:</strong> <code>X-Frame-Options: DENY</code> বা CSP-এর{" "}
        <code>frame-ancestors &apos;none&apos;</code> নিশ্চিত করে যে অন্য কোনো ক্ষতিকর সাইট আপনার
        ওয়েবসাইটকে <code>&lt;iframe&gt;</code>-এর ভেতরে লুকিয়ে ইউজারকে দিয়ে কোনো অ্যাকশন ঘটাতে পারবে
        না।
      </p>

      <p>
        <strong>MIME-sniffing defense:</strong> ব্রাউজার যেন কোনো আপলোড করা ইমেজ বা টেক্সট ফাইলকে
        ভুলবশত জাভাস্ক্রিপ্ট হিসেবে ধরে এক্সিকিউট না করে, সেজন্য <code>nosniff</code> হেডার ফাইল টাইপ
        কঠোরভাবে এনফোর্স করে।
      </p>

      {/* ── Implementation ────────────────────────────────────────────── */}
      <H2 id="implementation">৩. Production Code Implementation</H2>

      <H3>❌ Anti-pattern — permissive or missing headers</H3>

      <CodeBlock filename="lib/security/bad-csp.ts">{`// 🔴 POOR PRACTICE: a CSP with wildcards and unsafe directives
// this lets an attacker inject and run inline XSS payloads freely

const BAD_CSP = \`
  default-src *;
  script-src 'unsafe-inline' 'unsafe-eval' *;
\`;`}</CodeBlock>

      <H3>🟢 Production pattern — static headers plus a dynamic nonce CSP</H3>

      <p>
        <strong>Step 1 — স্ট্যাটিক সিকিউরিটি হেডার।</strong>
      </p>

      <CodeBlock filename="next.config.ts">{`// 🟢 PRODUCTION PATTERN: static security headers
import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          // 1. 🟢 prevent clickjacking
          { key: 'X-Frame-Options', value: 'DENY' },

          // 2. 🟢 block MIME-type sniffing
          { key: 'X-Content-Type-Options', value: 'nosniff' },

          // 3. 🟢 control referrer leakage
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },

          // 4. 🟢 enforce HTTPS for two years (HSTS)
          {
            key: 'Strict-Transport-Security',
            value: 'max-age=63072000; includeSubDomains; preload',
          },

          // 5. 🟢 switch off browser features the app never uses
          {
            key: 'Permissions-Policy',
            value: 'camera=(), microphone=(), geolocation=(), payment=()',
          },
        ],
      },
    ];
  },
};

export default nextConfig;`}</CodeBlock>

      <p>
        <strong>Step 2 — ডাইনামিক nonce-ভিত্তিক CSP।</strong>
      </p>

      <CodeBlock filename="middleware.ts">{`// 🟢 PRODUCTION PATTERN: per-request nonce CSP generator
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  // 1. 🟢 a cryptographically random nonce for every single request
  const nonce = Buffer.from(crypto.randomUUID()).toString('base64');

  // 2. 🟢 the strict policy itself
  const cspHeader = \`
    default-src 'self';
    script-src 'self' 'nonce-\${nonce}' 'strict-dynamic';
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

  // 3. forward the nonce so Server Components can read it via headers()
  const requestHeaders = new Headers(request.headers);
  requestHeaders.set('x-nonce', nonce);
  requestHeaders.set('Content-Security-Policy', cspHeader);

  // 4. attach the policy to the outgoing response too
  const response = NextResponse.next({
    request: { headers: requestHeaders },
  });

  response.headers.set('Content-Security-Policy', cspHeader);

  return response;
}

export const config = {
  matcher: [
    // skip static files, _next internals, and prefetch requests
    {
      source: '/((?!api|_next/static|_next/image|favicon.ico).*)',
      missing: [
        { type: 'header', key: 'next-router-prefetch' },
        { type: 'header', key: 'purpose', value: 'prefetch' },
      ],
    },
  ],
};`}</CodeBlock>

      {/* ── Matrix ────────────────────────────────────────────────────── */}
      <H2 id="matrix">৪. Security Headers Comparison Matrix</H2>

      <Table
        head={["হেডার", "উদ্দেশ্য", "প্রোডাকশন ভ্যালু", "মিস করলে ঝুঁকি"]}
        rows={[
          [
            "Content-Security-Policy",
            "ট্রাস্টেড স্ক্রিপ্ট ও রিসোর্স অরিজিন ফিল্টার করে",
            "script-src 'nonce-…' 'strict-dynamic'",
            "XSS ও ডাটা ইনজেকশন 🔴",
          ],
          [
            "X-Frame-Options",
            "আইফ্রেমের ভেতরে সাইট লোড হওয়া থামায়",
            "DENY বা SAMEORIGIN",
            "Clickjacking 🔴",
          ],
          [
            "X-Content-Type-Options",
            "ব্রাউজারের অটো ফাইল-টাইপ অনুমান বন্ধ করে",
            "nosniff",
            "MIME-sniffing execution 🔴",
          ],
          [
            "Strict-Transport-Security",
            "কেবল এনক্রিপ্টেড HTTPS কানেকশন বাধ্য করে",
            "max-age=63072000; includeSubDomains",
            "Man-in-the-middle 🔴",
          ],
          [
            "Referrer-Policy",
            "নেভিগেশনের সময় URL লিক নিয়ন্ত্রণ করে",
            "strict-origin-when-cross-origin",
            "URL-এ থাকা টোকেন লিক 🔴",
          ],
        ]}
      />

      <Line name="ভুলু ভাই">
        অসাধারণ ফাহিম! <code>next.config.ts</code>-এ স্ট্যাটিক সিকিউরিটি হেডার আর{" "}
        <code>middleware.ts</code>-এ dynamic nonce-based CSP বসানোর পর এখন আমাদের সিকিউরিটি অডিট স্কোর
        ১০০-তে ১০০! ব্রাউজারে ইনলাইন XSS বা clickjacking-এর সব রাস্তা বন্ধ।
      </Line>

      {/* ── Takeaways ─────────────────────────────────────────────────── */}
      <H2 id="takeaway">Production Takeaways</H2>

      <Note>
        <ul>
          <li>
            <strong>Avoid &apos;unsafe-inline&apos; and &apos;unsafe-eval&apos;:</strong> CSP-এর{" "}
            <code>script-src</code>-এ কখনোই এগুলো রাখা উচিত নয় — এর পরিবর্তে সবসময় dynamic nonce
            ব্যবহার করুন।
          </li>
          <li>
            <strong>Combine static and dynamic headers:</strong> <code>next.config.ts</code>-এ স্থির
            হেডারগুলো (HSTS, X-Frame-Options) আর <code>middleware.ts</code>-এ পরিবর্তনশীল
            nonce-ভিত্তিক CSP কনফিগার করুন।
          </li>
          <li>
            <strong>Audit via report-only mode:</strong> প্রোডাকশনে কঠোর CSP চালু করার আগে{" "}
            <code>Content-Security-Policy-Report-Only</code> হেডার দিয়ে অ্যাপের কোনো ভ্যালিড রিসোর্স
            ব্লক হচ্ছে কিনা স্ক্যান করে নিন।
          </li>
        </ul>
      </Note>
    </article>
  );
}
