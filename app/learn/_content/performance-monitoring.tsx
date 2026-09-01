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
      bn: "CPU খালি, তবু পেজ ৫ সেকেন্ড",
      en: "CPU idle, page still 5 seconds",
    },
  },
  {
    id: "architecture",
    label: {
      bn: "APM ও distributed tracing",
      en: "APM & distributed tracing",
    },
  },
  {
    id: "mechanisms",
    label: { bn: "৪টি আর্কিটেকচারাল কনসেপ্ট", en: "Four architectural concepts" },
  },
  {
    id: "implementation",
    label: {
      bn: "OpenTelemetry ও কাস্টম span",
      en: "OpenTelemetry & custom spans",
    },
  },
  {
    id: "matrix",
    label: { bn: "Manual Logging vs APM", en: "Manual logging vs APM" },
  },
  {
    id: "takeaway",
    label: { bn: "Production Takeaways", en: "Production takeaways" },
  },
];

export default function PerformanceMonitoring() {
  return (
    <article className="doc-prose">
      {/* ── The problem ───────────────────────────────────────────────── */}
      <H2 id="the-problem" anchorOnly>
        CPU খালি, তবু পেজ ৫ সেকেন্ড
      </H2>

      <p>
        রাত ৮:৪৫। প্রমোশনাল ক্যাম্পেইনের পর ভুলু ভাইয়ের সাইটে হাজার হাজার ইউজার ঢুকছেন। কিন্তু CPU ও
        মেমরি ব্যবহার মাত্র ৪০% থাকা সত্ত্বেও প্রোডাক্ট ডিটেইলস পেজ লোড হতে ৪-৫ সেকেন্ড সময় নিচ্ছে!
        ভুলু ভাই বুঝতে পারছেন না সময়টা ডাটাবেস কোয়েরিতে নষ্ট হচ্ছে, নাকি এক্সটার্নাল API রেসপন্সে, নাকি
        রেন্ডারিংয়ে।
      </p>

      <Line name="ভুলু ভাই">
        ফাহিম! সার্ভারের CPU বা RAM তো খালিই পড়ে আছে, কিন্তু পেজ এত স্লো কেন? কোনো একটা API বা কোয়েরি
        হয়তো ব্লকিং তৈরি করছে, কিন্তু হাজার লাইন কোডের মধ্যে কোন ফাংশনটা সময় চুষে নিচ্ছে তা কীভাবে বের
        করব?
      </Line>

      <Line name="ফাহিম">
        ভুলু ভাই! শুধু সার্ভার CPU দেখা মানে অন্ধের মতো গাড়ি চালানো! আপনার প্রয়োজন Application
        Performance Monitoring এবং distributed tracing। এর মাধ্যমে একটি রিকোয়েস্ট ইনকামিং হওয়া থেকে
        শুরু করে ডাটাবেস কোয়েরি ও থার্ড-পার্টি API — প্রতিটি স্টেপ কত মিলিসেকেন্ড নিচ্ছে তা নিখুঁতভাবে
        ট্র্যাক করা যায়।
      </Line>

      <Line name="নেক্সট-ভাই">
        একদম! Next.js-এ পারফরম্যান্স মনিটরিংয়ের অফিশিয়াল স্ট্যান্ডার্ড হলো OpenTelemetry এবং{" "}
        <code>instrumentation.ts</code>। এটি ফ্রেমওয়ার্কের সাথে নেটিভলি বাইন্ড হয়ে সার্ভার রেন্ডারিং,
        route handler এবং ডাটাবেস কলের লাইফসাইকেল বিশ্লেষণ করে span জেনারেট করে!
      </Line>

      {/* ── Architecture ──────────────────────────────────────────────── */}
      <H2 id="architecture">১. Application Performance Monitoring</H2>

      <Diagram>{`┌─────────────────────────────────────────────────────────────────────────────┐
│                 APPLICATION PERFORMANCE MONITORING (APM)                    │
└─────────────────────────────────────────────────────────────────────────────┘

 GET /products/101
   │
   ▼
 ┌───────────────────────────────────────────────────────────────────────────┐
 │ trace  traceId: trn-9821          total: 420ms                            │
 │                                                                           │
 │ ├── span 1: auth middleware ─────────────────────────► 15ms   🟢          │
 │ ├── span 2: server component fetch ──────────────────► 380ms  🔴          │
 │ │    ├── span 2.1: postgres SELECT ──────────────────► 350ms  ⚠ the culprit│
 │ │    └── span 2.2: redis cache set ──────────────────► 12ms   🟢          │
 │ └── span 3: react HTML streaming ────────────────────► 25ms   🟢          │
 └────────────────────────────────────┬──────────────────────────────────────┘
                                      ▼ exported over OTLP
 ┌───────────────────────────────────────────────────────────────────────────┐
 │ APM dashboard (Datadog / New Relic / Axiom / OTel collector)              │
 │ └─ bottleneck: postgres is missing an index on product_id                 │
 └───────────────────────────────────────────────────────────────────────────┘`}</Diagram>

      {/* ── Mechanisms ────────────────────────────────────────────────── */}
      <H2 id="mechanisms">২. কোর আর্কিটেকচারাল কনসেপ্ট</H2>

      <p>
        <strong>Traces, spans &amp; context propagation:</strong> একটি <em>trace</em> হলো ইউজারের
        সম্পূর্ণ রিকোয়েস্টের যাত্রাপথ; একটি <em>span</em> হলো সেই পথের প্রতিটি একক কাজ (একটি SQL
        কোয়েরি, একটি Redis lookup, একটি external call)। প্রতিটি span টাইমস্ট্যাম্প, ডিউরেশন ও মেটাডাটা
        বহন করে।
      </p>

      <p>
        <strong>Native OpenTelemetry integration:</strong> Next.js-এ নেটিভ OTel ইনস্ট্রুমেন্টেশন
        সাপোর্ট রয়েছে। <code>instrumentation.ts</code> ফাইলটি সার্ভার বুট হওয়ার সময় একবার রান হয় এবং
        মেট্রিক্স Datadog, New Relic, Prometheus বা Axiom-এ পাঠায়।
      </p>

      <p>
        <strong>Percentiles, not averages:</strong> গড় latency দিয়ে সিস্টেমের আসল অবস্থা বোঝা যায় না।{" "}
        <code>p50</code> হলো মধ্যম ইউজারের অভিজ্ঞতা, আর <code>p99</code> হলো সবচেয়ে স্লো ১% ইউজারের
        — যাদের অভিজ্ঞতাই সাধারণত চার্ন তৈরি করে। অপটিমাইজ করতে হয় p95 ও p99 ধরে।
      </p>

      <p>
        <strong>Sampling &amp; overhead control:</strong> প্রোডাকশনে ১০০% রিকোয়েস্টের trace পাঠালে
        মনিটরিং খরচ ও CPU ওভারহেড দুটোই বেড়ে যায়। সাধারণত ৫-১০% sampling rate কনফিগার করা হয়।
      </p>

      {/* ── Implementation ────────────────────────────────────────────── */}
      <H2 id="implementation">৩. Production Code Implementation</H2>

      <H3>❌ Anti-pattern — manual console.time everywhere</H3>

      <CodeBlock filename="lib/products.ts">{`// 🔴 POOR PRACTICE: manual timing scattered through the codebase
export async function getProductData(id: string) {
  // ❌ clutters the code, and the number goes nowhere useful
  console.time('DB_FETCH');
  const start = Date.now();

  const product = await db.product.findUnique({ where: { id } });

  console.timeEnd('DB_FETCH');
  // ❌ no parent/child relationship — you cannot see this inside a request trace
  console.log(\`Execution took: \${Date.now() - start}ms\`);

  return product;
}`}</CodeBlock>

      <H3>🟢 Production pattern — OpenTelemetry instrumentation</H3>

      <p>
        <strong>Step 1 — রুট ইনস্ট্রুমেন্টেশন রেজিস্ট্রেশন।</strong>
      </p>

      <CodeBlock filename="instrumentation.ts">{`// 🟢 PRODUCTION PATTERN: Next.js runs this once, before anything else
// (in Next 15 the instrumentation hook is stable — no experimental flag needed)

export async function register() {
  // the OTel Node SDK cannot run in the edge runtime
  if (process.env.NEXT_RUNTIME === 'nodejs') {
    const { registerOTel } = await import('@vercel/otel');

    // auto-instruments Next.js fetch, route handlers and supported DB clients
    registerOTel({
      serviceName: 'nextjs-ecom-production',
    });
  }
}`}</CodeBlock>

      <p>
        <strong>Step 2 — কাস্টম span হেল্পার।</strong>
      </p>

      <CodeBlock filename="lib/telemetry.ts">{`// 🟢 PRODUCTION PATTERN: wrap critical business logic in its own span
import { trace, SpanStatusCode } from '@opentelemetry/api';

const tracer = trace.getTracer('ecom-custom-services');

export async function measurePerformance<T>(
  spanName: string,
  fn: () => Promise<T>
): Promise<T> {
  // startActiveSpan makes this the parent of any span created inside fn(),
  // which is what builds the nested tree in the dashboard
  return tracer.startActiveSpan(spanName, async (span) => {
    try {
      const result = await fn();
      span.setStatus({ code: SpanStatusCode.OK });
      return result;
    } catch (error) {
      span.setStatus({
        code: SpanStatusCode.ERROR,
        message: (error as Error).message,
      });
      span.recordException(error as Error);
      throw error;
    } finally {
      // 🟢 always end the span — an unended span reports as infinite duration
      span.end();
    }
  });
}`}</CodeBlock>

      <p>
        <strong>Step 3 — ভারী Server Action ইনস্ট্রুমেন্ট করা।</strong>
      </p>

      <CodeBlock filename="actions/checkout.ts">{`// 🟢 PRODUCTION PATTERN: a nested span tree you can actually read
'use server';

import { measurePerformance } from '@/lib/telemetry';

export async function processOrderAction(orderId: string) {
  return measurePerformance('processOrderAction', async () => {
    // each child span shows up indented under the parent in the dashboard
    await measurePerformance('stock-validation', async () => {
      // DB check
      return true;
    });

    await measurePerformance('stripe-charge', async () => {
      // external payment call
      return { status: 'success' };
    });

    return { success: true, orderId };
  });
}`}</CodeBlock>

      {/* ── Matrix ────────────────────────────────────────────────────── */}
      <H2 id="matrix">৪. Manual Logging vs Automated APM</H2>

      <Table
        head={["বৈশিষ্ট্য", "Manual (console.time)", "Automated APM (OpenTelemetry)"]}
        rows={[
          [
            "ট্র্যাকিং গভীরতা",
            "শুধু নির্দিষ্ট লোকাল ব্লক 🔴",
            "HTTP রিকোয়েস্ট থেকে DB কোয়েরি পর্যন্ত 🟢",
          ],
          [
            "Nested spans",
            "ম্যানুয়ালি হ্যান্ডেল করা প্রায় অসম্ভব 🔴",
            "প্যারেন্ট-চাইল্ড হায়ারার্কি 🟢",
          ],
          ["মেট্রিক্স", "নেই 🔴", "p50, p95, p99 latency চার্ট 🟢"],
          [
            "ওভারহেড",
            "সিঙ্ক্রোনাস কনসোল I/O ব্লক করে 🔴",
            "অ্যাসিঙ্ক্রোনাস, sampled 🟢",
          ],
          ["অ্যালার্ট", "নেই 🔴", "স্লো কোয়েরিতে অটো-অ্যালার্ট 🟢"],
        ]}
      />

      <Line name="ভুলু ভাই">
        এখন আর আন্দাজে কোনো কোড চেঞ্জ করব না ফাহিম! <code>instrumentation.ts</code> আর OpenTelemetry
        সেট করে রাখলে ড্যাশবোর্ডে স্পষ্ট দেখা যাবে কোন কোয়েরি বা API সার্ভারকে স্লো করে রাখছে।
      </Line>

      {/* ── Takeaways ─────────────────────────────────────────────────── */}
      <H2 id="takeaway">Production Takeaways</H2>

      <Note>
        <ul>
          <li>
            <strong>Optimize p95/p99, not the average:</strong> গাণিতিক গড় দিয়ে সিস্টেম মাপবেন না —
            গড় ভালো থাকা অবস্থাতেও ৫% ইউজার ভয়াবহ অভিজ্ঞতা পেতে পারে।
          </li>
          <li>
            <strong>Instrument the database and external calls:</strong> ৯০% বটলনেক তৈরি হয় এক্সটার্নাল
            HTTP কল ও ডাটাবেস কোয়েরিতে — এগুলোকেই span দিয়ে মুড়িয়ে রাখুন।
          </li>
          <li>
            <strong>Configure a sampling rate:</strong> প্রচুর ট্রাফিকে ১-১০% sampling ব্যবহার করুন —
            প্রায় শূন্য ওভারহেডেও পরিসংখ্যানগতভাবে নির্ভরযোগ্য ডাটা পাওয়া যায়।
          </li>
        </ul>
      </Note>
    </article>
  );
}
