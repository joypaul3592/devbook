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
      bn: "২০টি লগ, কোনটা কার রিকোয়েস্ট?",
      en: "Twenty logs, whose request?",
    },
  },
  {
    id: "architecture",
    label: {
      bn: "Context propagation আর্কিটেকচার",
      en: "Context propagation architecture",
    },
  },
  {
    id: "mechanisms",
    label: { bn: "৩টি আর্কিটেকচারাল কনসেপ্ট", en: "Three architectural concepts" },
  },
  {
    id: "implementation",
    label: {
      bn: "Middleware ও traced fetch",
      en: "Middleware & a traced fetch",
    },
  },
  {
    id: "matrix",
    label: {
      bn: "Isolated Logs vs Tracing",
      en: "Isolated logs vs tracing",
    },
  },
  {
    id: "takeaway",
    label: { bn: "Production Takeaways", en: "Production takeaways" },
  },
];

export default function RequestTracing() {
  return (
    <article className="doc-prose">
      {/* ── The problem ───────────────────────────────────────────────── */}
      <H2 id="the-problem" anchorOnly>
        ২০টি লগ, কোনটা কার রিকোয়েস্ট?
      </H2>

      <p>
        রাত ১১:১৫। ভুলু ভাইয়ের টিম একটি জটিল বাগ ডিবাগ করতে গিয়ে পাগলপ্রায়! ইউজার পেমেন্ট বাটনে ক্লিক
        করার পর অর্ডার প্রসেসিং ফেল করেছে। ব্যাকএন্ডে একাধিক সার্ভিস — API route, auth service,
        payment gateway, inventory DB। কিন্তু সার্ভার লগে কোনটা কার রিকোয়েস্ট, কোন ইউজার থেকে শুরু
        হয়েছিল আর কোথায় গিয়ে ফেইল করল — তা খোঁজা যেন খড়ের গাদায় সুই খোঁজা।
      </p>

      <Line name="ভুলু ভাই">
        ফাহিম! একটা ইউজার বাটন ক্লিক করার পর সার্ভারে একসাথে ২০টা আলাদা লগ জেনারেট হচ্ছে! কোন সার্ভিস
        কার সাথে কথা বলছে আর কোথায় রিকোয়েস্ট আটকে যাচ্ছে, সেটা বুঝব কীভাবে?
      </Line>

      <Line name="ফাহিম">
        ভুলু ভাই! এর সমাধান হলো request tracing! ফ্রন্টএন্ড থেকে রিকোয়েস্ট বের হওয়ার সাথে সাথেই একটি
        ইউনিক trace ID জেনারেট করা হয়। তারপর ওই রিকোয়েস্ট যেখানেই যাক — একই <code>x-trace-id</code>{" "}
        হেডার দিয়ে পাস করানো হয়। ফলে মাত্র ১টি আইডি ফিল্টার করলেই পুরো লাইফসাইকেল চোখের সামনে চলে
        আসে।
      </Line>

      <Line name="নেক্সট-ভাই">
        একদম! W3C Trace Context স্ট্যান্ডার্ড (<code>traceparent</code> হেডার) মেনে চললে Next.js
        Middleware ও OpenTelemetry মিলিয়ে ক্লায়েন্ট-টু-সার্ভার রিকোয়েস্টের পুরো মানচিত্র সেকেন্ডেই
        ট্রেস করা সম্ভব!
      </Line>

      {/* ── Architecture ──────────────────────────────────────────────── */}
      <H2 id="architecture">১. Distributed Request Tracing Architecture</H2>

      <Diagram>{`┌─────────────────────────────────────────────────────────────────────────────┐
│                   DISTRIBUTED REQUEST TRACING                               │
└─────────────────────────────────────────────────────────────────────────────┘

 [browser]
    │
    ├─── 1. request — generates or carries x-trace-id: trace-abc-123
    ▼
 ┌───────────────────────────────────────────────────────────────────────────┐
 │ Next.js middleware                                                        │
 │ └─ injects x-trace-id into the forwarded request headers                   │
 └────────────────────────────────────┬──────────────────────────────────────┘
                                      ▼
 ┌───────────────────────────────────────────────────────────────────────────┐
 │ route handler / server component                                          │
 │ ├─ the logger binds traceId: "trace-abc-123" to every line                 │
 │ └─ forwards the same header to every downstream call                       │
 └────────────────────────────────────┬──────────────────────────────────────┘
                                      ▼
 ┌───────────────────────────────────────────────────────────────────────────┐
 │ auth service · payment gateway · inventory DB                             │
 │ └─ every log everywhere carries traceId: "trace-abc-123"  🟢               │
 └───────────────────────────────────────────────────────────────────────────┘`}</Diagram>

      {/* ── Mechanisms ────────────────────────────────────────────────── */}
      <H2 id="mechanisms">২. কোর আর্কিটেকচারাল কনসেপ্ট</H2>

      <p>
        <strong>Correlation ID:</strong> একটি নির্দিষ্ট ইনকামিং রিকোয়েস্টকে ইউনিকভাবে শনাক্ত করার জন্য
        ব্যবহৃত UUID। এটি পুরো সার্ভিস চেইনের মাধ্যমে propagate হয়, তাই যেকোনো সার্ভিসের লগ থেকে পুরো
        যাত্রাপথে ফিরে যাওয়া যায়।
      </p>

      <p>
        <strong>W3C Trace Context:</strong> আধুনিক ডিস্ট্রিবিউটেড সিস্টেম <code>traceparent</code>{" "}
        স্ট্যান্ডার্ড হেডার ব্যবহার করে —{" "}
        <code>00-4bf92f3577b34da6a3ce929d0e0e4736-00f067aa0ba902b7-01</code>। এখানে ৩২ ক্যারেক্টার
        অংশটি পুরো রিকোয়েস্টের <code>trace_id</code>, আর ১৬ ক্যারেক্টার অংশটি সেই সার্ভিসের{" "}
        <code>span_id</code>।
      </p>

      <p>
        <strong>Propagation in Next.js:</strong> Server Actions ও route handler-এ{" "}
        <code>headers()</code> দিয়ে ইনকামিং trace ID পড়ে, এক্সটার্নাল <code>fetch</code> কল করার সময়
        সেটি আবার হেডারে পাঠিয়ে দিতে হয় — এক জায়গাতেও বাদ পড়লে চেইন ভেঙে যায়।
      </p>

      {/* ── Implementation ────────────────────────────────────────────── */}
      <H2 id="implementation">৩. Production Code Implementation</H2>

      <H3>❌ Anti-pattern — unlinked logs across services</H3>

      <CodeBlock filename="app/api/checkout/route.ts">{`// 🔴 POOR PRACTICE: downstream calls carry no request context
export async function POST() {
  // ❌ neither service can tell which user request this belonged to
  const authResponse = await fetch('https://auth.internal/verify');
  const paymentResponse = await fetch('https://payment.internal/charge');

  return Response.json({ success: true });
}`}</CodeBlock>

      <H3>🟢 Production pattern — an unbroken trace chain</H3>

      <p>
        <strong>Step 1 — মিডলওয়্যারে trace ID তৈরি ও ইনজেক্ট।</strong>
      </p>

      <CodeBlock filename="middleware.ts">{`// 🟢 PRODUCTION PATTERN: mint the trace id at the very edge of the system
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  // 1. respect an upstream id if a proxy or client already set one
  const traceId =
    request.headers.get('x-trace-id') ||
    request.headers.get('x-request-id') ||
    \`trace-\${crypto.randomUUID()}\`;

  // 2. clone and inject — request headers are immutable otherwise
  const requestHeaders = new Headers(request.headers);
  requestHeaders.set('x-trace-id', traceId);

  const response = NextResponse.next({
    request: { headers: requestHeaders },
  });

  // 3. 🟢 echo it back, so a user reporting a bug can quote the id
  response.headers.set('x-trace-id', traceId);

  return response;
}

export const config = {
  matcher: '/api/:path*',
};`}</CodeBlock>

      <p>
        <strong>Step 2 — context-aware fetch wrapper।</strong>
      </p>

      <CodeBlock filename="lib/traced-fetch.ts">{`// 🟢 PRODUCTION PATTERN: one wrapper keeps the chain unbroken everywhere
import { headers } from 'next/headers';

export async function tracedFetch(url: string, options: RequestInit = {}) {
  const reqHeaders = await headers();
  const traceId = reqHeaders.get('x-trace-id') || crypto.randomUUID();

  return fetch(url, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
      // 🟢 set last so a caller cannot accidentally override the trace id
      'x-trace-id': traceId,
    },
  });
}`}</CodeBlock>

      <p>
        <strong>Step 3 — correlated লগিংসহ route handler।</strong>
      </p>

      <CodeBlock filename="app/api/checkout/route.ts">{`// 🟢 PRODUCTION PATTERN: logs and downstream calls share one id
import { NextResponse } from 'next/server';
import { headers } from 'next/headers';
import { tracedFetch } from '@/lib/traced-fetch';
import { logger } from '@/lib/logger';

export async function POST() {
  const reqHeaders = await headers();
  const traceId = reqHeaders.get('x-trace-id') || 'unknown-trace';

  // the child logger stamps traceId on every line below
  const reqLogger = logger.child({ traceId, action: 'checkout' });

  reqLogger.info('Starting checkout workflow');

  try {
    // 🟢 the payment service logs the SAME traceId on its side
    const paymentRes = await tracedFetch('https://api.payment-gateway.com/charge', {
      method: 'POST',
      body: JSON.stringify({ amount: 100 }),
    });

    if (!paymentRes.ok) {
      reqLogger.error({ status: paymentRes.status }, 'Payment microservice failed');
      return NextResponse.json({ error: 'Payment failed' }, { status: 500 });
    }

    reqLogger.info('Checkout workflow completed');
    return NextResponse.json({ success: true });
  } catch (error) {
    reqLogger.error({ err: error }, 'Unexpected error in checkout');
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}`}</CodeBlock>

      {/* ── Matrix ────────────────────────────────────────────────────── */}
      <H2 id="matrix">৪. Isolated Logs vs Distributed Tracing</H2>

      <Table
        head={["বৈশিষ্ট্য", "Traditional isolated logs", "Distributed tracing"]}
        rows={[
          [
            "আইডেন্টিফিকেশন",
            "প্রতি লগে আলাদা বা আইডিহীন 🔴",
            "পুরো চেইনে একই trace ID 🟢",
          ],
          [
            "সার্ভিস-টু-সার্ভিস",
            "কোনো লিংক থাকে না 🔴",
            "হেডার দিয়ে context পাস হয় 🟢",
          ],
          [
            "ডিবাগিং স্পিড",
            "ঘণ্টা লাগে সুই খুঁজতে 🔴",
            "একটি আইডি ফিল্টারেই ফুল ফ্লো 🟢",
          ],
          [
            "সাপোর্ট ওয়ার্কফ্লো",
            "ইউজারের কাছে কিছু জিজ্ঞেস করার নেই 🔴",
            "ইউজার trace ID কোট করতে পারে 🟢",
          ],
        ]}
      />

      <Line name="ভুলু ভাই">
        এখন কনসেপ্ট স্ফটিকের মতো পরিষ্কার ফাহিম! মিডলওয়্যারে একটা ইউনিক trace ID তৈরি করে সব API আর
        লগে পাস করে দিলে হাজার হাজার লগের মধ্য থেকেও এক সেকেন্ডে নির্দিষ্ট ইউজারের রিকোয়েস্ট ডিবাগ করা
        যাবে!
      </Line>

      {/* ── Takeaways ─────────────────────────────────────────────────── */}
      <H2 id="takeaway">Production Takeaways</H2>

      <Note>
        <ul>
          <li>
            <strong>Inject the trace ID at the edge:</strong> রিকোয়েস্ট অ্যাপে ঢোকার সাথে সাথেই
            মিডলওয়্যারে <code>x-trace-id</code> জেনারেট করে নিন — এবং আপস্ট্রিম প্রক্সি ইতিমধ্যে একটি
            দিয়ে থাকলে সেটিকেই সম্মান করুন।
          </li>
          <li>
            <strong>Never break the chain:</strong> এক্সটার্নাল API বা মাইক্রোসার্ভিস কল করার সময়
            বর্তমান trace ID ফরোয়ার্ড করুন — একটি কল বাদ পড়লেই ট্রেসের বাকি অংশ অনাথ হয়ে যায়।
          </li>
          <li>
            <strong>Expose it to the client:</strong> রেসপন্স হেডারে trace ID ফেরত পাঠান — এরর
            স্ক্রিনে সেটি দেখালে সাপোর্ট টিকেট থেকেই সরাসরি ডিবাগ শুরু করা যায়।
          </li>
        </ul>
      </Note>
    </article>
  );
}
