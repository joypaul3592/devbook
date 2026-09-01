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
      bn: "ইউজার এরর দেখছে, লগ চুপ",
      en: "Users see errors, the logs say nothing",
    },
  },
  {
    id: "architecture",
    label: {
      bn: "Observability-র তিন স্তম্ভ",
      en: "The three pillars",
    },
  },
  {
    id: "mechanisms",
    label: {
      bn: "৩টি কোর রুল",
      en: "Three core rules",
    },
  },
  {
    id: "implementation",
    label: {
      bn: "instrumentation.ts, logger ও trace context",
      en: "Instrumentation, logger, trace context",
    },
  },
  {
    id: "matrix",
    label: { bn: "কোন টুল কী দেয়", en: "What each tool gives you" },
  },
  {
    id: "takeaway",
    label: { bn: "Production Takeaways", en: "Production takeaways" },
  },
];

export default function MonitoringTracingLogging() {
  return (
    <article className="doc-prose">
      {/* ── The problem ───────────────────────────────────────────────── */}
      <H2 id="the-problem" anchorOnly>
        ইউজার এরর দেখছে, লগ চুপ
      </H2>

      <p>
        বিকেল ৫:৪৫। প্রোডাকশনে কিছু ইউজারের ৫০০ এরর এসেছে, সাইট স্লো হয়ে গিয়েছিল। কিন্তু ড্যাশবোর্ডে
        গিয়ে বোঝাই যাচ্ছে না সমস্যাটা কোন API বা কোন ডাটাবেস কোয়েরির কারণে। কনসোলে শুধু বিক্ষিপ্ত{" "}
        <code>console.log(&quot;something went wrong&quot;)</code>।
      </p>

      <Line name="ভুলু ভাই">
        ফাহিম! লাইভ ইউজারের স্ক্রিনে এরর, অথচ সার্ভার লগ দেখলে মনে হয় কোনো সমস্যাই নেই! কোন ইউজারের
        রিকোয়েস্টে সমস্যা হলো, কোথায় আটকে ছিল — কিছুই বের করতে পারছি না।
      </Line>

      <Line name="ফাহিম">
        ভুলু ভাই! <code>console.log</code> দিয়ে এন্টারপ্রাইজ অ্যাপ চালানো অন্ধের মতো গাড়ি চালানোর
        শামিল। দরকার observability-র তিন স্তম্ভ — structured logging, distributed tracing, আর
        metrics। একটি রিকোয়েস্ট middleware থেকে server action হয়ে ডাটাবেস পর্যন্ত যে পথ পাড়ি দেয়,
        একটিমাত্র trace ID দিয়ে সেই পুরো যাত্রা দেখা যেতে হবে।
      </Line>

      <Line name="নেক্সট-ভাই">
        একদম! আর Next.js-এ এর জন্য নেটিভ সাপোর্ট আছে —{" "}
        <code>instrumentation.ts</code> আর OpenTelemetry। মনে রাখবেন, লগ বলে <em>কী</em> ঘটেছে, আর
        trace বলে <em>কোথায়</em> সময় গেছে। দুটোকে একই ID দিয়ে বাঁধতে পারলেই ডিবাগিং সহজ হয়ে যায়।
      </Line>

      {/* ── Architecture ──────────────────────────────────────────────── */}
      <H2 id="architecture">১. The Three Pillars</H2>

      <Diagram>{`┌─────────────────────────────────────────────────────────────────────────────┐
│                    THE THREE PILLARS OF OBSERVABILITY                       │
└─────────────────────────────────────────────────────────────────────────────┘

                          [ USER BROWSER ]
                                 │  x-trace-id: 9a8b7c
                                 ▼
                      [ NEXT.JS MIDDLEWARE ]
                                 │
         ┌───────────────────────┼───────────────────────┐
         ▼                       ▼                       ▼
┌──────────────────┐   ┌──────────────────┐   ┌──────────────────┐
│  LOGS            │   │  TRACES          │   │  METRICS         │
│  what happened   │   │  where time went │   │  how much, how   │
│                  │   │                  │   │  often           │
│  pino → JSON     │   │  OpenTelemetry   │   │  RUM, Web Vitals │
│  level, traceId  │   │  spans, waterfall│   │  CPU, error rate │
└──────────────────┘   └──────────────────┘   └──────────────────┘
         └───────────────────────┬───────────────────────┘
                                 ▼
                    [ one dashboard, joined by traceId ]

  a log without a trace id answers 'what' but never 'which request'`}</Diagram>

      {/* ── Mechanisms ────────────────────────────────────────────────── */}
      <H2 id="mechanisms">২. কোর রুল</H2>

      <p>
        <strong>Structured over stringly:</strong> প্রোডাকশনে প্লেইন টেক্সট লগ ইনডেক্স করা যায় না।
        JSON ফরম্যাটে লগ করুন — level, timestamp, traceId, userId আলাদা ফিল্ড হিসেবে। তখন
        &ldquo;এই ইউজারের গত এক ঘণ্টার সব এরর&rdquo; একটি কোয়েরি মাত্র।
      </p>

      <p>
        <strong>Propagate the context:</strong> প্রতিটি ইনকামিং রিকোয়েস্টে একটি trace ID তৈরি বা
        গ্রহণ করুন, আর প্রতিটি ডাউনস্ট্রিম কলে সেটি পাস করুন। এটিই সেই সুতো যা তিনটি সার্ভিসের
        বিচ্ছিন্ন লগকে একটি গল্পে পরিণত করে।
      </p>

      <p>
        <strong>Use the native instrumentation hook:</strong> Next.js-এর{" "}
        <code>instrumentation.ts</code> সার্ভার বুট হওয়ার একদম শুরুতে চলে — tracing SDK রেজিস্টার
        করার এটিই সঠিক জায়গা। অ্যাপ কোডে SDK ইনিশিয়ালাইজ করলে ততক্ষণে কিছু span হারিয়ে যায়।
      </p>

      {/* ── Implementation ────────────────────────────────────────────── */}
      <H2 id="implementation">৩. Production Code Implementation</H2>

      <H3>🟢 Step 1 — instrumentation hook</H3>

      <CodeBlock filename="src/instrumentation.ts">{`// 🟢 PRODUCTION PATTERN: register tracing before any request is served
export async function register() {
  // the edge runtime cannot load the Node SDK — guard the import
  if (process.env.NEXT_RUNTIME === 'nodejs') {
    const { registerOTel } = await import('@vercel/otel');

    registerOTel({ serviceName: 'sports-platform-web' });
  }
}

// 🟢 Next.js also calls this for every uncaught server error, with the
//    request context attached — one place to forward them all
export async function onRequestError(
  err: unknown,
  request: { path: string; method: string },
) {
  const { logError } = await import('@/lib/logger');
  logError('Unhandled server error', err, { path: request.path, method: request.method });
}`}</CodeBlock>

      <H3>🟢 Step 2 — structured logger</H3>

      <CodeBlock filename="src/lib/logger.ts">{`// 🟢 PRODUCTION PATTERN: JSON logs an aggregator can actually index
import pino from 'pino';

export const logger = pino({
  level: process.env.LOG_LEVEL ?? 'info',

  formatters: {
    level: (label) => ({ level: label.toUpperCase() }),
  },

  timestamp: pino.stdTimeFunctions.isoTime,

  // every line carries these, so you can filter one service out of a fleet
  base: {
    env: process.env.NODE_ENV,
    service: 'sports-platform-web',
  },

  // 🟢 secrets must never reach the log retention window
  redact: {
    paths: ['password', 'token', 'authorization', '*.password'],
    censor: '[REDACTED]',
  },
});

export function logError(
  message: string,
  error: unknown,
  context?: Record<string, unknown>,
) {
  logger.error({
    msg: message,
    // pass the error under 'err' so pino serialises the stack properly
    err: error instanceof Error ? { message: error.message, stack: error.stack } : error,
    ...context,
  });
}`}</CodeBlock>

      <H3>🟢 Step 3 — trace-aware route handler</H3>

      <CodeBlock filename="src/app/api/matches/route.ts">{`// 🟢 PRODUCTION PATTERN: one trace id, in the logs and back to the caller
import { NextResponse, type NextRequest } from 'next/server';
import { logger, logError } from '@/lib/logger';
import { db } from '@/lib/db';

export async function GET(req: NextRequest) {
  const startedAt = Date.now();

  // reuse the caller's trace id when there is one — that is what joins
  // this service's logs to the ones upstream of it
  const traceId = req.headers.get('x-trace-id') ?? crypto.randomUUID();

  // 🟢 a child logger binds the context once, instead of at every call site
  const log = logger.child({ traceId, path: '/api/matches' });

  log.info('Fetching live matches');

  try {
    const matches = await db.match.findMany({ where: { status: 'LIVE' } });

    log.info({ latencyMs: Date.now() - startedAt, count: matches.length }, 'Fetched matches');

    return NextResponse.json(
      { success: true, data: matches },
      { headers: { 'x-trace-id': traceId } },
    );
  } catch (error) {
    logError('Failed to fetch matches', error, {
      traceId,
      latencyMs: Date.now() - startedAt,
    });

    // 🟢 return the trace id to the user: a support ticket that quotes it
    //    takes seconds to investigate instead of hours
    return NextResponse.json(
      { success: false, message: 'Internal Server Error', traceId },
      { status: 500 },
    );
  }
}`}</CodeBlock>

      {/* ── Matrix ────────────────────────────────────────────────────── */}
      <H2 id="matrix">৪. Observability Tooling</H2>

      <Table
        head={["ক্যাটাগরি", "কী প্রশ্নের উত্তর দেয়", "টুল", "আউটপুট"]}
        rows={[
          [
            "Structured logging",
            "ঠিক কী ঘটেছিল, কোন কনটেক্সটে",
            "Pino, Winston",
            "JSON লগ লাইন 🟢",
          ],
          [
            "Distributed tracing",
            "সময়টা কোথায় গেল",
            "OpenTelemetry, Jaeger",
            "Span waterfall 🟢",
          ],
          [
            "Error tracking",
            "কোন এরর, কতজনকে, কোন রিলিজে",
            "Sentry, Bugsnag",
            "Stack trace ও session replay",
          ],
          [
            "Metrics ও RUM",
            "কত ঘন ঘন, কত খারাপ",
            "Prometheus, Grafana, Speed Insights",
            "সময়ভিত্তিক গ্রাফ",
          ],
        ]}
      />

      <Line name="ভুলু ভাই">
        দারুণ ফাহিম! এখন প্রতিটি রিকোয়েস্টের trace ID দিয়ে নির্দিষ্ট বাগ আর স্লো কোয়েরি চোখের পলকে
        খুঁজে বের করতে পারছি — আর ইউজার সাপোর্ট টিকিটে ID-টা পাঠালেই কাজ হয়ে যাচ্ছে!
      </Line>

      {/* ── Takeaways ─────────────────────────────────────────────────── */}
      <H2 id="takeaway">Production Takeaways</H2>

      <Note>
        <ul>
          <li>
            <strong>Bind context once, with a child logger:</strong> প্রতিটি লগ কলে ম্যানুয়ালি
            traceId লেখার বদলে <code>logger.child()</code> ব্যবহার করুন।
          </li>
          <li>
            <strong>Return the trace id to the client:</strong> এরর রেসপন্সে trace ID ফেরত দিন —
            সাপোর্ট টিকিটে সেটি থাকলে তদন্তে ঘণ্টার বদলে সেকেন্ড লাগে।
          </li>
          <li>
            <strong>Register tracing in instrumentation.ts:</strong> অ্যাপ কোডে SDK ইনিশিয়ালাইজ
            করলে বুট-টাইমের span হারিয়ে যায় — নেটিভ hook-ই সঠিক জায়গা।
          </li>
        </ul>
      </Note>
    </article>
  );
}
