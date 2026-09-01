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
      bn: "হাজার console.log, শূন্য উত্তর",
      en: "A thousand console.logs, no answers",
    },
  },
  {
    id: "architecture",
    label: {
      bn: "Observability পাইপলাইন",
      en: "The observability pipeline",
    },
  },
  {
    id: "mechanisms",
    label: { bn: "৩টি আর্কিটেকচারাল কনসেপ্ট", en: "Three architectural concepts" },
  },
  {
    id: "implementation",
    label: {
      bn: "Pino logger ও Sentry ইন্টিগ্রেশন",
      en: "A Pino logger & Sentry integration",
    },
  },
  {
    id: "matrix",
    label: { bn: "Observability Tools Comparison", en: "Observability tools comparison" },
  },
  {
    id: "takeaway",
    label: { bn: "Production Takeaways", en: "Production takeaways" },
  },
];

export default function LoggingErrorMonitoring() {
  return (
    <article className="doc-prose">
      {/* ── The problem ───────────────────────────────────────────────── */}
      <H2 id="the-problem" anchorOnly>
        হাজার console.log, শূন্য উত্তর
      </H2>

      <p>
        রাত ৮:৪৫। প্রোডাকশনে এক ইউজার পেমেন্ট ফেইল করার অভিযোগ জানালেন। ভুলু ভাই তড়িঘড়ি করে সার্ভার লগ
        ফিল্টার করতে গিয়ে দেখলেন সেখানে হাজার হাজার অগোছালো{" "}
        <code>console.log(&quot;Error happened&quot;)</code> ছড়িয়ে আছে! কিন্তু ঠিক কোন ইউজার, কোন
        ট্রানজেকশন আইডি, আর কোন স্ট্যাক-ট্রেসের কারণে এররটি ঘটেছিল — তার কোনো সুনির্দিষ্ট রেকর্ড নেই।
      </p>

      <Line name="ভুলু ভাই">
        ফাহিম! প্রোডাকশনে কোনো বাগ দেখা দিলে আমরা সম্পূর্ণ অন্ধ হয়ে যাই কেন? লগে শুধু{" "}
        <code>console.log</code> ভরা, কিন্তু কোন ইউজার কোন পেজে কী ডেটা ইনপুট দেওয়ার কারণে ক্র্যাশটা
        হলো, সেটা বোঝার কি কোনো উপায় নেই?
      </Line>

      <Line name="ফাহিম">
        ভুলু ভাই! প্রোডাকশনে র <code>console.log</code> ব্যবহার করা মানে অন্ধকারে ঢিল মারা! ক্লায়েন্ট ও
        সার্ভার — উভয় পাশ থেকে রিয়েল-টাইমে এরর ট্র্যাক করতে প্রয়োজন সেন্ট্রালাইজড error aggregator
        (Sentry) এবং structured JSON logger (Pino)।
      </Line>

      <Line name="নেক্সট-ভাই">
        একদম! App Router-এর <code>instrumentation.ts</code> এবং Sentry SDK দিয়ে পুরো অ্যাপ্লিকেশনের
        ক্র্যাশ রিপোর্ট, source map (un-minified stack trace) এবং ইউজার কনটেক্সট ক্যাপচার করে ফেললেই
        বাগ আসার সাথে সাথেই সেন্ট্রাল ড্যাশবোর্ডে অ্যালার্ট চলে আসবে!
      </Line>

      {/* ── Architecture ──────────────────────────────────────────────── */}
      <H2 id="architecture">১. Centralized Error Observability Architecture</H2>

      <Diagram>{`┌─────────────────────────────────────────────────────────────────────────────┐
│                 CENTRALIZED ERROR & LOGGING PIPELINE                        │
└─────────────────────────────────────────────────────────────────────────────┘

 Browser client / Server Action exception
                   │
                   ▼
  ┌─────────────────────────────────┐
  │  PII sanitizer & masking layer  │ 🟢 strips passwords, cards, tokens
  └─────────────────────────────────┘
                   │
                   ├──► server logs (Pino → Datadog / CloudWatch)
                   │    └─ structured JSON: { timestamp, level, traceId, context }
                   │
                   └──► error monitoring (Sentry)
                        ├─ un-minified stack trace via source maps
                        ├─ user context & route breadcrumbs
                        └─ instant alerting to Slack / email 🟢`}</Diagram>

      {/* ── Mechanisms ────────────────────────────────────────────────── */}
      <H2 id="mechanisms">২. কোর আর্কিটেকচারাল কনসেপ্ট</H2>

      <p>
        <strong>Structured JSON logging:</strong> প্রোডাকশনে স্ট্রিং মেসেজ না লিখে JSON ফরম্যাটে লগ
        করতে হয়। Pino বা Winston-এর মতো লগার ব্যবহারে টাইমস্ট্যাম্প, লগ-লেভেল, রাউট ও trace-id যুক্ত
        থাকে — যা Datadog বা CloudWatch-এ সার্চ ও অ্যাগ্রিগেট করা সহজ।
      </p>

      <p>
        <strong>Error aggregators &amp; source maps:</strong> প্রোডাকশন JavaScript minified থাকে।
        Build time-এ Sentry-তে source map আপলোড করা হলে প্রোডাকশন ক্র্যাশের অরিজিনাল ফাইল ও লাইন নম্বর
        (<code>app/checkout/page.tsx:42</code>) হুবহু দেখা যায়।
      </p>

      <p>
        <strong>PII protection:</strong> লগ বা মনিটরিং টুলে পাঠানোর আগে ইমেইল, পাসওয়ার্ড, ফোন নম্বর বা
        টোকেনের মতো ব্যক্তিগত তথ্য মাস্ক করা বাধ্যতামূলক — একবার লগে গেলে তা রিটেনশন পিরিয়ড জুড়ে
        সেখানেই থেকে যায়।
      </p>

      {/* ── Implementation ────────────────────────────────────────────── */}
      <H2 id="implementation">৩. Production Code Implementation</H2>

      <H3>❌ Anti-pattern — unstructured logs that leak PII</H3>

      <CodeBlock filename="actions/login.ts">{`// 🔴 POOR PRACTICE: raw string logs carrying user credentials
// leaks passwords into cloud logs, has no stack trace, impossible to search

'use server';

export async function loginUserBad(formData: FormData) {
  try {
    // … logic
  } catch (err) {
    // ❌ the password now lives in your log retention window, forever
    console.log('Error logging in user:', formData.get('email'), formData.get('password'));
    console.error(err);
  }
}`}</CodeBlock>

      <H3>🟢 Production pattern — Pino logging with Sentry telemetry</H3>

      <p>
        <strong>Step 1 — প্রোডাকশন লগার।</strong>
      </p>

      <CodeBlock filename="lib/logger.ts">{`// 🟢 PRODUCTION PATTERN: structured JSON logger with automatic redaction
import pino from 'pino';

export const logger = pino({
  level: process.env.LOG_LEVEL || 'info',
  redact: {
    // 🟢 mask sensitive fields before they ever reach the transport
    paths: ['password', 'creditCard', 'token', 'authorization', '*.password'],
    censor: '[REDACTED]',
  },
  base: { env: process.env.NODE_ENV },
  timestamp: pino.stdTimeFunctions.isoTime,
});`}</CodeBlock>

      <p>
        <strong>Step 2 — কনটেক্সটসহ এরর রিপোর্টিং।</strong>
      </p>

      <CodeBlock filename="actions/checkout.ts">{`// 🟢 PRODUCTION PATTERN: capture with Pino context and Sentry scope
'use server';

import * as Sentry from '@sentry/nextjs';
import { logger } from '@/lib/logger';

interface CheckoutInput {
  userId: string;
  cartId: string;
  amount: number;
}

export async function processCheckoutAction(input: CheckoutInput) {
  // a breadcrumb tells you what happened just BEFORE the crash
  Sentry.addBreadcrumb({
    category: 'checkout',
    message: \`Initiating checkout for cart: \${input.cartId}\`,
    level: 'info',
  });

  try {
    logger.info({ userId: input.userId, cartId: input.cartId }, 'Processing checkout');

    if (input.amount <= 0) {
      throw new Error('Invalid checkout amount');
    }

    // … transaction …
    return { success: true };
  } catch (error) {
    // 1. 🟢 structured server-side log with the full context
    logger.error(
      { err: error, userId: input.userId, cartId: input.cartId, amount: input.amount },
      'Checkout processing failed'
    );

    // 2. 🟢 telemetry with the user attached, so you can see who was affected
    Sentry.withScope((scope) => {
      scope.setUser({ id: input.userId });
      scope.setExtra('cartId', input.cartId);
      scope.setTag('feature', 'checkout');
      Sentry.captureException(error);
    });

    return {
      success: false,
      message: 'পেমেন্ট প্রসেস করতে ব্যর্থ হয়েছে। টিমকে জানানো হয়েছে।',
    };
  }
}`}</CodeBlock>

      <p>
        <strong>Step 3 — রানটাইম initialization hook।</strong>
      </p>

      <CodeBlock filename="instrumentation.ts">{`// 🟢 PRODUCTION PATTERN: Next.js runs this once per runtime, before anything else
export async function register() {
  if (process.env.NEXT_RUNTIME === 'nodejs') {
    await import('./sentry.server.config');
  }

  if (process.env.NEXT_RUNTIME === 'edge') {
    await import('./sentry.edge.config');
  }
}`}</CodeBlock>

      {/* ── Matrix ────────────────────────────────────────────────────── */}
      <H2 id="matrix">৪. Observability Tools Comparison</H2>

      <Table
        head={["বৈশিষ্ট্য", "console.log", "Structured logger (Pino)", "Telemetry (Sentry)"]}
        rows={[
          [
            "আউটপুট",
            "র টেক্সট 🔴",
            "স্ট্রাকচার্ড JSON 🟢",
            "ভিজ্যুয়াল ক্র্যাশ ড্যাশবোর্ড 🟢",
          ],
          [
            "Source map",
            "নেই 🔴",
            "নেই 🔴",
            "অরিজিনাল ফাইল ও লাইন দেখায় 🟢",
          ],
          [
            "Instant alert",
            "কোনো সুযোগ নেই 🔴",
            "আলাদা লগ অ্যানালাইজার লাগে 🟡",
            "সরাসরি Slack / email 🟢",
          ],
          [
            "PII masking",
            "ম্যানুয়াল 🔴",
            "redact রুল সাপোর্ট 🟢",
            "স্বয়ংক্রিয় ডাটা স্ক্রাবিং 🟢",
          ],
          [
            "ব্যবহারের স্থান",
            "কেবল লোকাল ডেভেলপমেন্ট",
            "সার্ভার সাইড লগিং",
            "ক্লায়েন্ট ও সার্ভার — দুই পাশেই",
          ],
        ]}
      />

      <Line name="ভুলু ভাই">
        মারাত্মক কাজের জিনিস ফাহিম! এখন Pino আর Sentry সেটআপ করার পর প্রোডাকশনে কোন ইউজারের কী ক্র্যাশ
        হচ্ছে, তা সাথে সাথে সোর্স ফাইল ও লাইন নম্বরসহ স্ল্যাকে নোটিফিকেশন চলে আসছে!
      </Line>

      {/* ── Takeaways ─────────────────────────────────────────────────── */}
      <H2 id="takeaway">Production Takeaways</H2>

      <Note>
        <ul>
          <li>
            <strong>Ban raw console.log in production:</strong> লিন্ট রুল (<code>no-console</code>)
            দিয়ে কোডবেসে সাধারণ <code>console.log</code> ব্লক করুন এবং সেন্ট্রালাইজড লগার এনফোর্স করুন।
          </li>
          <li>
            <strong>Always sanitize log data:</strong> পাসওয়ার্ড, টোকেন বা কার্ড সম্পর্কিত ডেটা কখনোই
            লগার সিস্টেমে পাঠানো যাবে না — Pino-র <code>redact</code> কনফিগ ব্যবহার করুন।
          </li>
          <li>
            <strong>Upload source maps in CI/CD:</strong> বিল্ড টাইমে source map আপলোড নিশ্চিত করুন,
            নাহলে প্রোডাকশন স্ট্যাক ট্রেস minified থাকবে আর ডিবাগিং প্রায় অসম্ভব হয়ে যাবে।
          </li>
        </ul>
      </Note>
    </article>
  );
}
