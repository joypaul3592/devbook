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
      bn: "মিনিফাইড স্ট্যাক ট্রেস, শূন্য সূত্র",
      en: "A minified trace, zero clues",
    },
  },
  {
    id: "architecture",
    label: {
      bn: "Production debugging ওয়ার্কফ্লো",
      en: "The production debugging workflow",
    },
  },
  {
    id: "mechanisms",
    label: { bn: "৩টি আর্কিটেকচারাল কনসেপ্ট", en: "Three architectural concepts" },
  },
  {
    id: "implementation",
    label: {
      bn: "Hidden source map ও dynamic debug",
      en: "Hidden source maps & dynamic debug",
    },
  },
  {
    id: "matrix",
    label: { bn: "Local vs Production Debugging", en: "Local vs production debugging" },
  },
  {
    id: "takeaway",
    label: { bn: "Production Takeaways", en: "Production takeaways" },
  },
];

export default function ProductionDebugging() {
  return (
    <article className="doc-prose">
      {/* ── The problem ───────────────────────────────────────────────── */}
      <H2 id="the-problem" anchorOnly>
        মিনিফাইড স্ট্যাক ট্রেস, শূন্য সূত্র
      </H2>

      <p>
        রাত ১২:০৫। প্রোডাকশনে ইমার্জেন্সি! ইউজারের চেকআউট পেজে এরর ফুটছে, কিন্তু লগে যা পাওয়া যাচ্ছে
        তা হলো —{" "}
        <code>
          TypeError: Cannot read properties of undefined (reading &apos;id&apos;) at
          _app-7b9a12c.js:1:4302
        </code>
        । কোডের সব লাইন নম্বর, ভ্যারিয়েবলের নাম আর ফাংশন মিনিফাইড ও obfuscated।
      </p>

      <Line name="ভুলু ভাই">
        ফাহিম! লোকালে সব স্মুথ চলে, কিন্তু প্রোডাকশনে বাগ হ্যান্ডেল করা এত কঠিন কেন? মিনিফাইড কোডের এই{" "}
        <code>1:4302</code> লাইন নম্বর দেখে কোথায় ভুল হয়েছে কীভাবে খুঁজব? আমি কি প্রোডাকশন সার্ভারে{" "}
        <code>console.log</code> বসিয়ে রি-বিল্ড মারব?
      </Line>

      <Line name="ফাহিম">
        ভুলু ভাই, ভুলেও প্রোডাকশনে কোড বদলে <code>console.log</code> বসিয়ে ডিবাগ করবেন না! প্রোডাকশন
        ডিবাগিংয়ের চাবিকাঠি তিনটি — hidden source maps (মিনিফাইড কোডকে মূল লাইনে ফেরানো), dynamic
        debug headers (রিস্টার্ট ছাড়াই নির্দিষ্ট রিকোয়েস্টের জন্য verbose log অন করা), এবং contextual
        error capture।
      </Line>

      <Line name="নেক্সট-ভাই">
        একদম! Source map পাবলিক থেকে লুকিয়ে রেখে কেবল আপনার APM-এ আপলোড করলে সার্ভার ডাউন না করেই এক
        সেকেন্ডে দেখা যাবে বাগটি সোর্স কোডের কোন লাইনে ঘটেছে।
      </Line>

      {/* ── Architecture ──────────────────────────────────────────────── */}
      <H2 id="architecture">১. Production Debugging Workflow</H2>

      <Diagram>{`┌─────────────────────────────────────────────────────────────────────────────┐
│                     PRODUCTION DEBUGGING WORKFLOW                           │
└─────────────────────────────────────────────────────────────────────────────┘

 a user hits an error in production
    │
    ├─── minified stack trace: _app-7b9a12c.js:1:4302
    ▼
 ┌───────────────────────────────────────────────────────────────────────────┐
 │ APM server, holding the privately uploaded source maps                    │
 │ ├─ symbolicates minified JS ➔ original TypeScript                         │
 │ └─ decodes to: app/services/cart.ts:42  →  cart.items.id                  │
 └────────────────────────────────────┬──────────────────────────────────────┘
                                      ▼
 ┌───────────────────────────────────────────────────────────────────────────┐
 │ dynamic debugging via a secret request header                             │
 │ └─ x-debug-key: <token> turns on verbose tracing for THAT request only,   │
 │    with no restart and no impact on other live users                      │
 └───────────────────────────────────────────────────────────────────────────┘`}</Diagram>

      {/* ── Mechanisms ────────────────────────────────────────────────── */}
      <H2 id="mechanisms">২. কোর আর্কিটেকচারাল কনসেপ্ট</H2>

      <p>
        <strong>Hidden source maps (symbolication):</strong> বিল্ড টাইমে তৈরি <code>.map</code> ফাইল
        মিনিফাইড কোডকে মূল TypeScript সোর্সে রূপান্তর করে। কিন্তু নিরাপত্তার জন্য এগুলো ব্রাউজারে না
        পাঠিয়ে কেবল সিকিউরড মনিটরিং টুলে আপলোড করা হয় — পাবলিক ম্যাপ মানে আপনার পুরো বিজনেস লজিক
        উন্মুক্ত।
      </p>

      <p>
        <strong>Dynamic debug logging:</strong> প্রোডাকশনে সচরাচর কেবল <code>warn</code>/
        <code>error</code> লেভেল অন থাকে। কোনো নির্দিষ্ট ইউজারের সমস্যা ডিবাগ করতে রিকোয়েস্ট হেডারে
        একটি গোপন টোকেন পাঠিয়ে সাময়িকভাবে কেবল ওই রিকোয়েস্টের জন্য <code>debug</code> লেভেল সক্রিয়
        করা হয়।
      </p>

      <p>
        <strong>Context-rich capture:</strong> শুধু এরর মেসেজ নয় — ওই মুহূর্তের HTTP method, query
        params, trace ID এবং redacted user metadata একসাথে ক্যাপচার করা। এগুলো ছাড়া বাগ রিপ্রোডিউস করা
        প্রায় অসম্ভব।
      </p>

      {/* ── Implementation ────────────────────────────────────────────── */}
      <H2 id="implementation">৩. Production Code Implementation</H2>

      <H3>❌ Anti-pattern — console.log in production, stack traces to the client</H3>

      <CodeBlock filename="app/api/payment/route.ts">{`// 🔴 POOR PRACTICE: log spam plus a leaked stack trace
export async function POST(req: Request) {
  try {
    const data = await req.json();
    // ❌ floods the log at high traffic, and may contain card details
    console.log('DEBUG DATA:', data);
    return processPayment(data);
  } catch (err) {
    // ❌ hands the attacker your file paths, ORM and internal structure
    const e = err as Error;
    return Response.json({ error: e.message, stack: e.stack }, { status: 500 });
  }
}`}</CodeBlock>

      <H3>🟢 Production pattern — private maps and on-demand verbosity</H3>

      <p>
        <strong>Step 1 — hidden source map কনফিগ।</strong>
      </p>

      <CodeBlock filename="next.config.mjs">{`// 🟢 PRODUCTION PATTERN: generate maps for the APM, hide them from the browser
/** @type {import('next').NextConfig} */
const nextConfig = {
  // emit browser source maps so the APM has something to upload
  productionBrowserSourceMaps: true,

  webpack: (config, { isServer }) => {
    if (!isServer) {
      // 🟢 'hidden-source-map' emits the .map file but omits the
      // //# sourceMappingURL comment, so DevTools will not fetch it
      config.devtool = 'hidden-source-map';
    }
    return config;
  },
};

export default nextConfig;

// note: @sentry/nextjs does all of this for you and deletes the maps after
// upload — prefer withSentryConfig if you already use it.`}</CodeBlock>

      <p>
        <strong>Step 2 — dynamic debug logger।</strong>
      </p>

      <CodeBlock filename="lib/production-logger.ts">{`// 🟢 PRODUCTION PATTERN: verbose logging for one request, on demand
import { headers } from 'next/headers';

export class ProductionLogger {
  private isDebugRequested = false;

  private constructor(private context: string) {}

  static async create(context: string): Promise<ProductionLogger> {
    const instance = new ProductionLogger(context);
    const reqHeaders = await headers();

    const debugSecret = reqHeaders.get('x-debug-key');
    // 🟢 verbose mode unlocks only for a caller who knows the secret;
    // everyone else's requests stay quiet and fast
    if (debugSecret && debugSecret === process.env.DEBUG_SECRET_TOKEN) {
      instance.isDebugRequested = true;
    }
    return instance;
  }

  debug(message: string, meta?: Record<string, unknown>) {
    if (!this.isDebugRequested) return;
    console.log(\`[DEBUG] [\${this.context}] \${message}\`, meta ?? '');
  }

  error(message: string, error?: Error, meta?: Record<string, unknown>) {
    console.error(\`[ERROR] [\${this.context}] \${message}\`, {
      errorMessage: error?.message,
      stack: error?.stack, // symbolicated later by the APM
      ...meta,
    });
  }
}`}</CodeBlock>

      <p>
        <strong>Step 3 — route handler-এ নিরাপদ ব্যবহার।</strong>
      </p>

      <CodeBlock filename="app/api/orders/route.ts">{`// 🟢 PRODUCTION PATTERN: rich internal logs, clean external errors
import { NextResponse } from 'next/server';
import { ProductionLogger } from '@/lib/production-logger';

export async function POST(req: Request) {
  const logger = await ProductionLogger.create('OrdersAPI');

  // silent in production unless the request carries x-debug-key
  logger.debug('Attempting order parsing', { timestamp: Date.now() });

  try {
    const body = await req.json();
    logger.debug('Order payload parsed', { itemId: body.itemId });

    if (!body.itemId) {
      throw new Error('Item ID is missing from payload');
    }

    return NextResponse.json({ success: true, orderId: 'ord_999' });
  } catch (error) {
    // full detail stays on the server
    logger.error('Order processing failed', error as Error, { url: req.url });

    // 🟢 the user gets something safe and actionable — no stack, no paths
    return NextResponse.json(
      { error: 'Failed to process order. Please contact support.' },
      { status: 400 }
    );
  }
}`}</CodeBlock>

      {/* ── Matrix ────────────────────────────────────────────────────── */}
      <H2 id="matrix">৪. Local vs Production Debugging</H2>

      <Table
        head={["বিষয়", "Local debugging", "Production debugging"]}
        rows={[
          [
            "Source maps",
            "ইন-মেমোরি, ওপেন",
            "hidden source map + APM symbolication 🟢",
          ],
          [
            "Log level",
            "সর্বত্র verbose",
            "on-demand, secret header দিয়ে 🟢",
          ],
          [
            "Error exposure",
            "পেজে ফুল স্ট্যাক ট্রেস",
            "ইউজারে জেনেরিক মেসেজ, ডিটেইল লগে 🟢",
          ],
          [
            "Reproduction",
            "লোকাল মক ডাটা",
            "trace ID + আসল payload দিয়ে স্টেজিংয়ে 🟢",
          ],
        ]}
      />

      <Line name="ভুলু ভাই">
        মারাত্মক ট্রিকস তো ফাহিম! সিক্রেট হেডার পাস করে শুধু ওই রিকোয়েস্টের জন্য ফুল লগ দেখা আর hidden
        source map দিয়ে লাইভ এরর ক্যাচ করা — এটাই তো আসল site reliability engineering!
      </Line>

      {/* ── Takeaways ─────────────────────────────────────────────────── */}
      <H2 id="takeaway">Production Takeaways</H2>

      <Note>
        <ul>
          <li>
            <strong>Never ship public source maps:</strong> ব্রাউজারে source map খুললে আপনার পুরো
            বিজনেস লজিক পড়া যায় — সবসময় <code>hidden-source-map</code> ব্যবহার করে কেবল APM-এ আপলোড
            করুন।
          </li>
          <li>
            <strong>Use a secret header for live triage:</strong> নির্দিষ্ট কাস্টমারের ইস্যুতে হেডার
            পাস করে লাইভ ট্রাফিকে প্রভাব না ফেলেই ডিবাগিং চালান — এবং টোকেনটি নিয়মিত রোটেট করুন।
          </li>
          <li>
            <strong>Redact PII in production errors:</strong> লগে পাসওয়ার্ড, কার্ড নম্বর বা প্রাইভেট
            ডাটা যেন ভুলেও প্রিন্ট না হয় — এবং ক্লায়েন্ট রেসপন্সে কখনো স্ট্যাক ট্রেস পাঠাবেন না।
          </li>
        </ul>
      </Note>
    </article>
  );
}
