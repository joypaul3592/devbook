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
      bn: "লাখ লাইন লগ, খুঁজে পাওয়া যায় না",
      en: "A million log lines, unsearchable",
    },
  },
  {
    id: "architecture",
    label: {
      bn: "Structured logging পাইপলাইন",
      en: "The structured logging pipeline",
    },
  },
  {
    id: "mechanisms",
    label: { bn: "৪টি আর্কিটেকচারাল কনসেপ্ট", en: "Four architectural concepts" },
  },
  {
    id: "implementation",
    label: {
      bn: "Pino logger ও child logger",
      en: "A Pino logger & child loggers",
    },
  },
  {
    id: "matrix",
    label: {
      bn: "Unstructured vs Structured",
      en: "Unstructured vs structured",
    },
  },
  {
    id: "takeaway",
    label: { bn: "Production Takeaways", en: "Production takeaways" },
  },
];

export default function StructuredLogging() {
  return (
    <article className="doc-prose">
      {/* ── The problem ───────────────────────────────────────────────── */}
      <H2 id="the-problem" anchorOnly>
        লাখ লাইন লগ, খুঁজে পাওয়া যায় না
      </H2>

      <p>
        সকাল ১০:০০। ভুলু ভাই প্রোডাকশনে একটি বাগ ডিবাগ করার জন্য ব্যাকএন্ডে{" "}
        <code>console.log(&quot;data error:&quot;, err)</code> দিয়ে পিনপয়েন্ট করার চেষ্টা করছেন।
        কিন্তু লগ মনিটরিং ড্যাশবোর্ডে হাজার হাজার অনিয়ন্ত্রিত প্লেইন টেক্সট স্ট্রিংয়ের ভিড়ে কোন ইউজার
        কোন রিকোয়েস্টে এরর খেয়েছেন তা ফিল্টার করে বের করা অসম্ভব হয়ে পড়েছে।
      </p>

      <Line name="ভুলু ভাই">
        ফাহিম! সার্ভার লগে তো লাখ লাখ লাইন টেক্সট জমা হচ্ছে! কিন্তু <code>console.log</code> দিয়ে সার্চ
        করে নির্দিষ্ট ইউজার আইডি বা নির্দিষ্ট API রিকোয়েস্টের লগ খুঁজে পাচ্ছি না কেন?
      </Line>

      <Line name="ফাহিম">
        ভুলু ভাই! কারণ আপনি প্রোডাকশনে প্লেইন টেক্সট স্ট্রিং লগ করছেন! প্রোডাকশন লেভেলে লগিং হতে হয়
        structured JSON format-এ — যেখানে প্রতিটি লগে <code>level</code>, <code>timestamp</code>,{" "}
        <code>traceId</code>, <code>userId</code> আলাদা ফিল্ড হিসেবে থাকে। তখন Datadog, Axiom বা
        Better Stack-এ মুহূর্তের মধ্যে ফিল্টার করা যায়।
      </Line>

      <Line name="নেক্সট-ভাই">
        একদম! Structured logging হলো observability-র প্রথম স্তম্ভ। এটি ফ্রি-ফর্ম টেক্সট মেসেজকে
        মেশিন-রিডেবল JSON অবজেক্টে রূপান্তর করে — ফলে গিগাবাইট সাইজের লগের ভেতর থেকেও মিলিসেকেন্ডে
        এররের root cause পিনপয়েন্ট করা যায়!
      </Line>

      {/* ── Architecture ──────────────────────────────────────────────── */}
      <H2 id="architecture">১. Structured Logging Pipeline</H2>

      <Diagram>{`┌─────────────────────────────────────────────────────────────────────────────┐
│                    STRUCTURED LOGGING PIPELINE                              │
└─────────────────────────────────────────────────────────────────────────────┘

 [1] UNSTRUCTURED  ❌
 console.log("User 123 failed to update profile: Invalid token")
   └─► an unindexed string — searching means a full-text regex scan

 [2] STRUCTURED  🟢
 logger.error({ userId, traceId, err }, 'Profile update failed')
   │
   ▼ serialised to a JSON stream
 {
   "level":     "error",
   "timestamp": "2026-09-01T15:45:00.120Z",
   "traceId":   "req-abc-99",
   "userId":    "123",
   "route":     "/api/user/profile",
   "msg":       "Profile update failed",
   "err":       { "message": "Invalid token", "stack": "…" }
 }
   │
   ▼ ingested by the aggregator (Datadog / Axiom / Better Stack)
 ┌───────────────────────────────────────────────────────────┐
 │ query: level == "error" AND userId == "123"               │ 🟢 exact match, instantly
 └───────────────────────────────────────────────────────────┘`}</Diagram>

      {/* ── Mechanisms ────────────────────────────────────────────────── */}
      <H2 id="mechanisms">২. কোর আর্কিটেকচারাল কনসেপ্ট</H2>

      <p>
        <strong>Machine-readable schema:</strong> প্লেইন টেক্সট লগে মেশিন বোঝে না কোনটা ইউজার আইডি আর
        কোনটা এরর মেসেজ। স্ট্রাকচার্ড লগে ডাটা সবসময় নির্দিষ্ট JSON স্কিমায় সাজানো থাকে —{" "}
        <code>level</code>, <code>time</code>, <code>service</code>, <code>traceId</code>, payload।
      </p>

      <p>
        <strong>Log levels:</strong> <code>fatal</code>/<code>error</code> সিস্টেম ক্র্যাশ বা API
        ব্যর্থতা, <code>warn</code> সম্ভাব্য সমস্যা (স্লো কোয়েরি, deprecated API),{" "}
        <code>info</code> সাধারণ ইভেন্ট (লগইন, পেমেন্ট সাফল্য), <code>debug</code>/<code>trace</code>{" "}
        ডেভেলপমেন্টের বিস্তারিত ডাটা।
      </p>

      <p>
        <strong>Trace ID propagation:</strong> একটি রিকোয়েস্ট মিডলওয়্যার → route handler → ডাটাবেস
        পর্যন্ত যাওয়ার সময় প্রতিটি লগে একই <code>traceId</code> পাস করা হয়। ফলে পুরো লাইফসাইকেলের লগ
        এক সূত্রে গেঁথে ফেলা যায়।
      </p>

      <p>
        <strong>Zero-blocking performance:</strong> সিঙ্ক্রোনাস <code>console.log()</code> I/O ব্লক
        করে সার্ভার স্লো করে দেয়। <code>pino</code>-র মতো লাইটওয়েট লগার অ্যাসিঙ্ক্রোনাসলি স্ট্রিম করে,
        তাই থ্রুপুটে প্রায় কোনো প্রভাব ফেলে না।
      </p>

      {/* ── Implementation ────────────────────────────────────────────── */}
      <H2 id="implementation">৩. Production Code Implementation</H2>

      <H3>❌ Anti-pattern — unstructured logs that leak credentials</H3>

      <CodeBlock filename="app/api/auth/login/route.ts">{`// 🔴 POOR PRACTICE: string concatenation, and the password lands in the log
export async function POST(req: Request) {
  try {
    const body = await req.json();
    // ❌ the raw body carries the password straight into your log retention window
    console.log('User login attempt with data: ' + JSON.stringify(body));

    const user = await authenticateUser(body.email, body.password);
    return Response.json(user);
  } catch (err) {
    // ❌ concatenation throws away the stack trace and every piece of context
    console.log('Login failed: ' + (err as Error).message);
    return Response.json({ error: 'Failed' }, { status: 500 });
  }
}`}</CodeBlock>

      <H3>🟢 Production pattern — a Pino logger with redaction</H3>

      <p>
        <strong>Step 1 — প্রোডাকশন লগার ইউটিলিটি।</strong>
      </p>

      <CodeBlock filename="lib/logger.ts">{`// 🟢 PRODUCTION PATTERN: structured JSON logging with automatic redaction
import pino from 'pino';

export const logger = pino({
  level: process.env.LOG_LEVEL || 'info',

  // 🟢 sensitive fields are masked before they reach any transport
  redact: {
    paths: ['password', 'token', 'creditCard', 'authorization', '*.password'],
    censor: '[REDACTED]',
  },

  // every line carries these, so you can filter by service across a fleet
  base: {
    env: process.env.NODE_ENV,
    service: 'nextjs-web-app',
  },

  timestamp: pino.stdTimeFunctions.isoTime,
});`}</CodeBlock>

      <p>
        <strong>Step 2 — child logger দিয়ে কনটেক্সট বাঁধা।</strong>
      </p>

      <CodeBlock filename="app/api/user/profile/route.ts">{`// 🟢 PRODUCTION PATTERN: one traceId bound to every log in this request
import { NextResponse } from 'next/server';
import { logger } from '@/lib/logger';

export async function PUT(request: Request) {
  // reuse an upstream trace id if there is one, otherwise start a new trace
  const traceId = request.headers.get('x-trace-id') || crypto.randomUUID();

  // 🟢 a child logger auto-attaches traceId and route to every line below
  const reqLogger = logger.child({ traceId, route: '/api/user/profile' });

  try {
    const body = await request.json();
    const { userId } = body;

    reqLogger.info({ userId }, 'Updating user profile');

    if (!userId) {
      reqLogger.warn({ payload: body }, 'Validation failed: missing user id');
      return NextResponse.json({ error: 'User ID is required' }, { status: 400 });
    }

    // … update …

    reqLogger.info({ userId, updatedFields: ['name', 'email'] }, 'Profile updated');

    return NextResponse.json({ success: true });
  } catch (error) {
    // 🟢 pass the error under the 'err' key — pino serialises the full stack
    reqLogger.error({ err: error }, 'Unhandled exception during profile update');

    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}`}</CodeBlock>

      <p>
        <strong>Step 3 — লিন্ট রুল দিয়ে console.log ব্লক করা।</strong>
      </p>

      <CodeBlock filename="eslint.config.mjs">{`// 🟢 PRODUCTION PATTERN: make the wrong thing impossible to commit
export default [
  {
    rules: {
      // console.error stays allowed as a last-resort escape hatch
      'no-console': ['error', { allow: ['error'] }],
    },
  },
];`}</CodeBlock>

      {/* ── Matrix ────────────────────────────────────────────────────── */}
      <H2 id="matrix">৪. Unstructured vs Structured Logging</H2>

      <Table
        head={["বৈশিষ্ট্য", "console.log()", "Structured JSON (pino)"]}
        rows={[
          ["আউটপুট ফরম্যাট", "প্লেইন টেক্সট স্ট্রিং 🔴", "স্ট্যান্ডার্ড JSON অবজেক্ট 🟢"],
          [
            "সার্চ ও ফিল্টার",
            "স্লো regex টেক্সট ম্যাচ 🔴",
            "level, traceId দিয়ে ইনস্ট্যান্ট ফিল্টার 🟢",
          ],
          ["পারফরম্যান্স", "সিঙ্ক্রোনাস I/O ব্লক করে 🔴", "অ্যাসিঙ্ক্রোনাস স্ট্রিমিং 🟢"],
          [
            "সিকিউরিটি",
            "ম্যানুয়ালি না মুছলে পাসওয়ার্ড লিক 🔴",
            "redact দিয়ে অটোমেটিক মাস্কিং 🟢",
          ],
          [
            "ট্রেসেবিলিটি",
            "রিকোয়েস্টের সাথে লিংক করা যায় না 🔴",
            "child logger দিয়ে traceId বাইন্ডিং 🟢",
          ],
        ]}
      />

      <Line name="ভুলু ভাই">
        এখন পুরো লজিক ক্লিয়ার ফাহিম! প্লেইন টেক্সটের বদলে স্ট্রাকচার্ড JSON লগ ব্যবহার করলে মনিটরিং
        টুলে সেকেন্ডের মধ্যে যেকোনো এরর ও trace ID দিয়ে ফিল্টার করা সম্ভব!
      </Line>

      {/* ── Takeaways ─────────────────────────────────────────────────── */}
      <H2 id="takeaway">Production Takeaways</H2>

      <Note>
        <ul>
          <li>
            <strong>Ban plain console.log:</strong> প্রোডাকশনে ডাইরেক্ট কনসোল লগ পারফরম্যান্সে প্রভাব
            ফেলে এবং অনুসন্ধানের অযোগ্য টেক্সট তৈরি করে — লিন্ট রুল দিয়েই আটকে দিন।
          </li>
          <li>
            <strong>Always propagate a traceId:</strong> প্রতিটি ইনকামিং রিকোয়েস্টে একটি ইউনিক trace
            ID জেনারেট করে child logger দিয়ে সব লগে যুক্ত করুন।
          </li>
          <li>
            <strong>Redact before you log:</strong> পাসওয়ার্ড, কার্ড নম্বর বা bearer token যেন লগে
            প্রকাশ না পায় — লগার কনফিগেই redaction চালু রাখুন, কল সাইটে ভরসা করবেন না।
          </li>
        </ul>
      </Note>
    </article>
  );
}
