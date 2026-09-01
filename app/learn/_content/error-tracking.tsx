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
      bn: "ব্রাউজারে সাদা পেজ, লগে কিছু নেই",
      en: "White screen, empty server log",
    },
  },
  {
    id: "architecture",
    label: {
      bn: "Error tracking পাইপলাইন",
      en: "The error tracking pipeline",
    },
  },
  {
    id: "mechanisms",
    label: { bn: "৪টি আর্কিটেকচারাল কনসেপ্ট", en: "Four architectural concepts" },
  },
  {
    id: "implementation",
    label: {
      bn: "SDK সেটআপ ও কনটেক্সট ক্যাপচার",
      en: "SDK setup & context capture",
    },
  },
  {
    id: "matrix",
    label: { bn: "Manual vs Automated Tracking", en: "Manual vs automated tracking" },
  },
  {
    id: "takeaway",
    label: { bn: "Production Takeaways", en: "Production takeaways" },
  },
];

export default function ErrorTracking() {
  return (
    <article className="doc-prose">
      {/* ── The problem ───────────────────────────────────────────────── */}
      <H2 id="the-problem" anchorOnly>
        ব্রাউজারে সাদা পেজ, লগে কিছু নেই
      </H2>

      <p>
        সন্ধ্যা ৭:৩০। প্রোডাকশনে ইউজাররা সাপোর্ট টিকেটে কমপ্লেন করছেন — &quot;Checkout বাটনে ক্লিক
        করলে পেজ সাদা হয়ে যাচ্ছে!&quot; কিন্তু ব্যাকএন্ড লগে কোনো এরর নেই। ভুলু ভাই ক্লায়েন্টের
        ব্রাউজারে কী সমস্যা হচ্ছে তা বুঝতে না পেরে সব জায়গায় <code>try...catch</code> বসিয়ে ম্যানুয়ালি
        হ্যান্ডেল করার চিন্তা করছেন।
      </p>

      <Line name="ভুলু ভাই">
        ফাহিম! ইউজারদের ব্রাউজারে ঠিক কী এরর হচ্ছে, কোন লাইনে ক্র্যাশ করছে আর কোন ব্রাউজারে সমস্যা
        হচ্ছে — তা সার্ভার লগে কেন দেখা যাচ্ছে না? আমি কি সব জায়গায় try/catch লিখে ইমেইল অ্যালার্ট সেট
        করব?
      </Line>

      <Line name="ফাহিম">
        ভুলু ভাই, ম্যানুয়ালি সব জায়গায় try/catch লিখে ইমেইল পাঠানো অসম্ভব! প্রোডাকশনে অটোমেটেড error
        tracking system (Sentry বা ওপেন-সোর্স GlitchTip) প্রয়োজন। এটি ব্রাউজার ও সার্ভারের আনহ্যান্ডেলড
        এক্সসেপশন, স্ট্যাক ট্রেস, ইউজার সেশন, ব্রাউজার ভার্সন এবং source map ব্যবহার করে এররের আসল
        উৎস অটোমেটিক ট্র্যাক করে।
      </Line>

      <Line name="নেক্সট-ভাই">
        ঠিক ধরেছো! Error tracking হলো observability-র দ্বিতীয় স্তম্ভ। এটি মিনিফাইড কোডকে source map
        দিয়ে ভেঙে অরিজিনাল TypeScript লাইনে রূপান্তর করে, এবং ১০,০০০ একই ক্যাটাগরির ক্র্যাশকে একটি
        issue fingerprint-এ গ্রুপ করে অ্যালার্ট পাঠায়!
      </Line>

      {/* ── Architecture ──────────────────────────────────────────────── */}
      <H2 id="architecture">১. Error Tracking &amp; Aggregation Pipeline</H2>

      <Diagram>{`┌─────────────────────────────────────────────────────────────────────────────┐
│                    ERROR TRACKING & AGGREGATION PIPELINE                    │
└─────────────────────────────────────────────────────────────────────────────┘

 [1] a runtime error happens
     client browser or server route — unhandled rejection, React crash
   │
   ▼
 [2] the SDK captures context and breadcrumbs
     stack trace (minified): at e.onClick (app-4a2.js:1:304)
     breadcrumbs: clicked "Checkout" ➔ fetched /api/cart (200) ➔ crashed
     user context: { id: "usr_99", browser: "Chrome 128", os: "macOS" }
   │
   ▼ asynchronous transmission — never blocks the page
 [3] Sentry / GlitchTip ingestion
   │
   ├─► source map parser  : app-4a2.js ➔ components/Checkout.tsx:42
   ├─► fingerprinting     : 10,000 identical crashes ➔ one issue
   └─► alerting           : Slack / Discord / PagerDuty 🟢`}</Diagram>

      {/* ── Mechanisms ────────────────────────────────────────────────── */}
      <H2 id="mechanisms">২. কোর আর্কিটেকচারাল কনসেপ্ট</H2>

      <p>
        <strong>Source map resolution:</strong> প্রোডাকশনে কোড মিনিফাইড থাকে (
        <code>bundle.min.js</code>)। বিল্ড টাইমে source map আপলোড করা থাকলে ট্র্যাকার মিনিফাইড কোডকে
        অরিজিনাল ফাইল ও লাইন নম্বরে (<code>components/Cart.tsx:84</code>) পয়েন্ট করে দেয়।
      </p>

      <p>
        <strong>Breadcrumbs:</strong> ক্র্যাশ হওয়ার ঠিক আগে ইউজার কী কী করেছেন — কোন বাটনে ক্লিক, কোন
        রাউটে ভিজিট, কোন API কল ব্যর্থ — তার টাইমলাইন রেকর্ড। বাগ রিপ্রোডিউস করার সবচেয়ে দ্রুত পথ
        এটাই।
      </p>

      <p>
        <strong>Issue fingerprinting:</strong> একই এরর ১ লাখ ইউজার ফেস করলেও সিস্টেম ১ লাখ নোটিফিকেশন
        পাঠাবে না — স্ট্যাক ট্রেস ও মেসেজের হ্যাশ মিলিয়ে সবগুলোকে একটি issue হিসেবে গ্রুপ করবে।
      </p>

      <p>
        <strong>GlitchTip vs Sentry:</strong> Sentry ইন্ডাস্ট্রি স্ট্যান্ডার্ড ও ফিচার-রিচ (session
        replay, profiling), তবে ক্লাউড খরচ বেশি। GlitchTip হলো ওপেন-সোর্স বিকল্প — Sentry-র অফিশিয়াল
        SDK-এর সাথেই API-compatible, ডকারে সহজে সেলফ-হোস্ট করা যায়। শুধু DSN বদলালেই চলে।
      </p>

      {/* ── Implementation ────────────────────────────────────────────── */}
      <H2 id="implementation">৩. Production Code Implementation</H2>

      <H3>❌ Anti-pattern — swallowing the error</H3>

      <CodeBlock filename="lib/payment.ts">{`// 🔴 POOR PRACTICE: the error dies here, with all its context
export async function processPayment(paymentData: PaymentInput) {
  try {
    return await stripe.charges.create(paymentData);
  } catch (error) {
    // ❌ stack trace, user context and breadcrumbs all destroyed;
    // nobody is alerted, and the caller silently gets null
    console.error('Payment failed', error);
    return null;
  }
}`}</CodeBlock>

      <H3>🟢 Production pattern — SDK setup with rich context</H3>

      <p>
        <strong>Step 1 — SDK ইনিশিয়ালাইজেশন।</strong>
      </p>

      <CodeBlock filename="sentry.client.config.ts">{`// 🟢 PRODUCTION PATTERN: works for Sentry and GlitchTip alike — only the DSN differs
import * as Sentry from '@sentry/nextjs';

Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,

  // 🟢 release tagging tells you WHICH deploy introduced a bug
  environment: process.env.NODE_ENV,
  release: process.env.NEXT_PUBLIC_VERCEL_GIT_COMMIT_SHA || '1.0.0',

  // sample in production so the bill and the overhead stay bounded
  tracesSampleRate: process.env.NODE_ENV === 'production' ? 0.1 : 1.0,

  // noisy, non-actionable browser errors that would drown the real signal
  ignoreErrors: [
    'ResizeObserver loop limit exceeded',
    'Network request failed',
    'Load failed',
  ],

  // 🟢 strip PII before the event ever leaves the browser
  beforeSend(event) {
    if (event.request?.headers) {
      delete event.request.headers['authorization'];
      delete event.request.headers['cookie'];
    }
    return event;
  },
});`}</CodeBlock>

      <p>
        <strong>Step 2 — কনটেক্সটসহ ম্যানুয়াল ক্যাপচার।</strong>
      </p>

      <CodeBlock filename="app/api/checkout/route.ts">{`// 🟢 PRODUCTION PATTERN: capture with the context that makes it debuggable
import { NextResponse } from 'next/server';
import * as Sentry from '@sentry/nextjs';

export async function POST(request: Request) {
  try {
    const { userId, amount } = await request.json();

    // who was affected — turns "12 errors" into "12 users, these ones"
    Sentry.setUser({ id: userId });

    Sentry.addBreadcrumb({
      category: 'checkout',
      message: \`Initiating payment for amount: \${amount}\`,
      level: 'info',
    });

    if (amount <= 0) {
      throw new Error('Invalid checkout amount: must be greater than zero');
    }

    // … process …
    return NextResponse.json({ success: true });
  } catch (error) {
    // 🟢 tags are indexed and filterable; extra is free-form detail
    Sentry.captureException(error, {
      tags: { feature: 'checkout', gateway: 'stripe' },
      extra: { timestamp: new Date().toISOString() },
    });

    return NextResponse.json({ error: 'Payment processing failed' }, { status: 500 });
  }
}`}</CodeBlock>

      <p>
        <strong>Step 3 — CI-তে source map আপলোড।</strong>
      </p>

      <CodeBlock filename="next.config.js">{`// 🟢 PRODUCTION PATTERN: without this the stack traces stay minified
const { withSentryConfig } = require('@sentry/nextjs');

/** @type {import('next').NextConfig} */
const nextConfig = {
  // … your config …
};

module.exports = withSentryConfig(nextConfig, {
  org: 'my-org',
  project: 'nextjs-web-app',

  // for a self-hosted GlitchTip instance, point the upload here
  url: process.env.SENTRY_URL,
  authToken: process.env.SENTRY_AUTH_TOKEN,

  // 🟢 upload the maps, then delete them so they are never publicly served
  sourcemaps: { deleteSourcemapsAfterUpload: true },
  silent: true,
});`}</CodeBlock>

      {/* ── Matrix ────────────────────────────────────────────────────── */}
      <H2 id="matrix">৪. Manual Handling vs Automated Tracking</H2>

      <Table
        head={["বৈশিষ্ট্য", "Manual logging / try-catch", "Sentry / GlitchTip"]}
        rows={[
          [
            "স্ট্যাক ট্রেস",
            "মিনিফাইড ফাইল ও অস্পষ্ট লাইন 🔴",
            "source map দিয়ে আসল TSX লাইন 🟢",
          ],
          [
            "ইউজার কনটেক্সট",
            "পাওয়া যায় না 🔴",
            "ইউজার আইডি, ব্রাউজার, OS, ডিভাইস 🟢",
          ],
          [
            "Breadcrumbs",
            "পাওয়া যায় না 🔴",
            "ক্র্যাশের আগের অ্যাকশন ট্রেইল 🟢",
          ],
          [
            "Aggregation",
            "প্রতিটি লগের জন্য আলাদা নয়েজ 🔴",
            "হাজার ক্র্যাশ এক issue-তে গ্রুপ 🟢",
          ],
          ["অ্যালার্ট", "ম্যানুয়াল 🔴", "Slack / Discord / PagerDuty 🟢"],
        ]}
      />

      <Line name="ভুলু ভাই">
        অসাধারণ ফাহিম! তারমানে source map আর GlitchTip/Sentry সেটআপ করলে প্রোডাকশনে কার ব্রাউজারে ঠিক
        কোন লাইনে বাগ হয়েছে আর ক্র্যাশের আগে ইউজার কী কী করেছিল, সেটা এক ক্লিকেই দেখতে পারব!
      </Line>

      {/* ── Takeaways ─────────────────────────────────────────────────── */}
      <H2 id="takeaway">Production Takeaways</H2>

      <Note>
        <ul>
          <li>
            <strong>Upload source maps in CI/CD:</strong> বিল্ড টাইমে source map ট্র্যাকিং সার্ভারে
            আপলোড না করলে স্ট্যাক ট্রেস মিনিফাইডই থেকে যাবে — এবং আপলোডের পর ফাইলগুলো ডিলিট করুন যেন
            পাবলিকলি সার্ভ না হয়।
          </li>
          <li>
            <strong>Never store PII:</strong> কার্ড নম্বর, কুকি বা authorization টোকেন যেন ইভেন্টে
            আপলোড না হয় — <code>beforeSend</code> হুকে সেনিটাইজ করুন।
          </li>
          <li>
            <strong>Set up release tracking:</strong> প্রতিটি ডেপ্লয়মেন্টে commit SHA ট্যাগ করুন, যাতে
            জানা যায় ঠিক কোন রিলিজ থেকে বাগটি শুরু হয়েছে।
          </li>
        </ul>
      </Note>
    </article>
  );
}
