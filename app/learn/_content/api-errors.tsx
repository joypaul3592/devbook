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
      bn: "200 OK-এর ভেতরে এরর অবজেক্ট",
      en: "An error object inside a 200 OK",
    },
  },
  {
    id: "architecture",
    label: {
      bn: "Route handler এরর ফ্লো",
      en: "The route handler error flow",
    },
  },
  {
    id: "mechanisms",
    label: { bn: "৩টি আর্কিটেকচারাল কনসেপ্ট", en: "Three architectural concepts" },
  },
  {
    id: "implementation",
    label: {
      bn: "Error envelope ও টাইপ-সেফ fetcher",
      en: "Error envelopes & a typed fetcher",
    },
  },
  {
    id: "matrix",
    label: { bn: "API Error Comparison", en: "API error comparison" },
  },
  {
    id: "takeaway",
    label: { bn: "Production Takeaways", en: "Production takeaways" },
  },
];

export default function ApiErrors() {
  return (
    <article className="doc-prose">
      {/* ── The problem ───────────────────────────────────────────────── */}
      <H2 id="the-problem" anchorOnly>
        200 OK-এর ভেতরে এরর অবজেক্ট
      </H2>

      <p>
        বিকাল ৪:১৫। ভুলু ভাই চেকআউট পেজের জন্য একটি API রুট তৈরি করেছেন — <code>/api/checkout</code>।
        ফ্রন্টএন্ড থেকে ইউজার অসম্পূর্ণ ফর্ম পাঠালে ব্যাকএন্ড আনহ্যান্ডেলড এররের কারণে ক্র্যাশ করছে,
        আবার কখনো <code>200 OK</code> রেসপন্সের ভেতরে{" "}
        <code>&#123; error: &quot;Invalid Data&quot; &#125;</code> পাঠাচ্ছে! ক্লায়েন্ট সাইডে এই
        অনিশ্চিত এরর হ্যান্ডেল করতে গিয়ে ফ্রন্টএন্ড কোড স্প্যাগেটি হয়ে যাচ্ছে।
      </p>

      <Line name="ভুলু ভাই">
        ফাহিম! ডাটাবেসে কানেকশন ব্যর্থ হলে বা ইনপুট ভুল হলে ক্লায়েন্টে র স্ট্যাকট্রেস চলে যাচ্ছে! আবার
        কখনো <code>200 OK</code> দেখায় কিন্তু ডেটা থাকে না। ফ্রন্টএন্ড আর ব্যাকএন্ডের মধ্যে স্ট্যান্ডার্ড
        এরর হ্যান্ডলিং কীভাবে করব?
      </Line>

      <Line name="ফাহিম">
        ভুলু ভাই! API হ্যান্ডলিংয়ে দুটি বড় ভুল হয় — HTTP status code সঠিক না রাখা (soft error), আর
        প্রপার envelope স্ট্রাকচার ছাড়া অগোছালো এরর মেসেজ রিটার্ন করা।
      </Line>

      <Line name="নেক্সট-ভাই">
        একদম! প্রফেশনাল অ্যাপে API এরর হ্যান্ডলিংয়ের মূল ভিত্তি তিনটি — standardized error envelope
        contract, সঠিক HTTP status code mapping, এবং টাইপ-সেফ ক্লায়েন্ট-সাইড এরর অ্যাবস্ট্রাকশন।
      </Line>

      {/* ── Architecture ──────────────────────────────────────────────── */}
      <H2 id="architecture">১. API Error Handling Architecture Flow</H2>

      <Diagram>{`┌─────────────────────────────────────────────────────────────────────────────┐
│                   NEXT.JS ROUTE HANDLER ERROR FLOW                          │
└─────────────────────────────────────────────────────────────────────────────┘

 Client request ───► app/api/checkout/route.ts
                            │
                            ▼
                   Zod payload validation
                            │
              ┌─────────────┴─────────────┐
        [valid payload]            [invalid payload]
              │                           │
              ▼                           ▼
        database query            structured field errors
              │                           │
        ┌─────┴─────┐                     ▼
     [success]   [db error]        error envelope builder
        │           │                     │
        ▼           ▼                     ▼
     200 OK      500 Server         422 Unprocessable Entity
   {success:    {success:false,     {success:false,
    true, data}  generic message}    error:{code,message,details}}`}</Diagram>

      {/* ── Mechanisms ────────────────────────────────────────────────── */}
      <H2 id="mechanisms">২. কোর আর্কিটেকচারাল কনসেপ্ট</H2>

      <p>
        <strong>Standardized error envelope:</strong> সফল বা ব্যর্থ — সব API রেসপন্স একটি নির্দিষ্ট
        স্ট্রাকচার মেনে চলা উচিত, যেমন{" "}
        <code>
          &#123; success: false, error: &#123; code, message, details &#125; &#125;
        </code>
        । এতে ক্লায়েন্টে একটিমাত্র হ্যান্ডলার লিখলেই চলে।
      </p>

      <p>
        <strong>HTTP status code alignment:</strong> <code>400</code> ইনপুট ডাটা ভুল হলে,{" "}
        <code>401</code> অথেনটিকেটেড না হলে, <code>403</code> অনুমতি না থাকলে, <code>404</code>{" "}
        রিসোর্স না পাওয়া গেলে, <code>422</code> ভ্যালিডেশন ব্যর্থ হলে, আর <code>500</code> সার্ভার
        বা ডাটাবেস ক্র্যাশ করলে — শেষেরটিতে ভেতরের স্ট্যাকট্রেস লুকিয়ে জেনেরিক মেসেজ দিতে হবে।
      </p>

      <p>
        <strong>Client-side abstraction:</strong> <code>fetch</code> কল করার পর{" "}
        <code>res.ok</code> চেক করা আবশ্যক — কারণ native fetch <code>400</code> বা <code>500</code>{" "}
        স্ট্যাটাসে কোনো এরর throw করে না, প্রমিসটি সফলভাবেই রিজলভ হয়।
      </p>

      {/* ── Implementation ────────────────────────────────────────────── */}
      <H2 id="implementation">৩. Production Code Implementation</H2>

      <H3>❌ Anti-pattern — soft errors and leaked stack traces</H3>

      <CodeBlock filename="app/api/checkout/route.ts">{`// 🔴 POOR PRACTICE: inconsistent error shape, leaked internals
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const body = await req.json();

    if (!body.email) {
      // ❌ soft error: an error payload wrapped in a 200 OK
      return NextResponse.json({ error: 'Email required' });
    }

    throw new Error('Database connection failed credentials@localhost:5432');
  } catch (err) {
    // ❌ leaks the internal database error, credentials and all, to the client
    return NextResponse.json({ message: (err as Error).message }, { status: 500 });
  }
}`}</CodeBlock>

      <H3>🟢 Production pattern — a standardized envelope end to end</H3>

      <p>
        <strong>Step 1 — API টাইপ ও রেসপন্স হেল্পার।</strong>
      </p>

      <CodeBlock filename="lib/api-response.ts">{`// 🟢 PRODUCTION PATTERN: a strongly typed API envelope
import { NextResponse } from 'next/server';

export type ApiErrorResponse = {
  success: false;
  error: {
    code: string;
    message: string;
    details?: unknown;
  };
};

export type ApiResponse<T> = { success: true; data: T } | ApiErrorResponse;

export function createErrorResponse(
  message: string,
  statusCode: number,
  code: string = 'BAD_REQUEST',
  details?: unknown
) {
  return NextResponse.json<ApiErrorResponse>(
    { success: false, error: { code, message, details } },
    { status: statusCode }
  );
}`}</CodeBlock>

      <p>
        <strong>Step 2 — নিরাপদ route handler।</strong>
      </p>

      <CodeBlock filename="app/api/checkout/route.ts">{`// 🟢 PRODUCTION PATTERN: graceful handling with Zod validation
import { NextResponse } from 'next/server';
import { z } from 'zod';
import { createErrorResponse } from '@/lib/api-response';

const checkoutSchema = z.object({
  amount: z.number().positive('পরিমাণ অবশ্যই ধনাত্মক সংখ্যা হতে হবে'),
  paymentMethod: z.enum(['BKASH', 'NAGAD', 'CARD']),
});

export async function POST(req: Request) {
  try {
    const body = await req.json();

    // 1. validate the payload before touching anything expensive
    const validation = checkoutSchema.safeParse(body);
    if (!validation.success) {
      return createErrorResponse(
        'ইনপুট ডেটা সঠিক নয়',
        422,
        'VALIDATION_ERROR',
        validation.error.flatten().fieldErrors
      );
    }

    const { amount, paymentMethod } = validation.data;

    // 2. business logic
    // … order processing …

    return NextResponse.json({
      success: true,
      data: { orderId: 'ORD-9821', amount, paymentMethod },
    });
  } catch (error) {
    // 3. catch every crash; log the detail, return a generic message
    console.error('Checkout API error:', error);

    return createErrorResponse(
      'সার্ভারে অভ্যন্তরীণ সমস্যা দেখা দিয়েছে। কিছুক্ষণ পর আবার চেষ্টা করুন।',
      500,
      'INTERNAL_SERVER_ERROR'
    );
  }
}`}</CodeBlock>

      <p>
        <strong>Step 3 — টাইপ-সেফ ক্লায়েন্ট fetcher।</strong>
      </p>

      <CodeBlock filename="lib/fetcher.ts">{`// 🟢 PRODUCTION PATTERN: one fetcher, one error type
export class ApiError extends Error {
  code: string;
  statusCode: number;
  details?: unknown;

  constructor(message: string, statusCode: number, code: string, details?: unknown) {
    super(message);
    this.name = 'ApiError';
    this.statusCode = statusCode;
    this.code = code;
    this.details = details;
  }
}

export async function apiFetch<T>(url: string, options?: RequestInit): Promise<T> {
  const res = await fetch(url, {
    headers: { 'Content-Type': 'application/json', ...options?.headers },
    ...options,
  });

  const payload = await res.json();

  // 🟢 fetch does NOT throw on 4xx/5xx — check res.ok yourself
  if (!res.ok || !payload.success) {
    throw new ApiError(
      payload.error?.message || 'একটি অজানা এরর ঘটেছে',
      res.status,
      payload.error?.code || 'UNKNOWN_ERROR',
      payload.error?.details
    );
  }

  return payload.data as T;
}`}</CodeBlock>

      {/* ── Matrix ────────────────────────────────────────────────────── */}
      <H2 id="matrix">৪. API Error Handling Comparison</H2>

      <Table
        head={["বৈশিষ্ট্য", "Anti-pattern", "Production pattern"]}
        rows={[
          [
            "Response contract",
            "আন-প্রেডিক্টেবল — কখনো string, কখনো object 🔴",
            "স্ট্যান্ডার্ড envelope ({ success, data | error }) 🟢",
          ],
          [
            "HTTP status",
            "সব রেসপন্সে 200 বা এলোমেলো স্ট্যাটাস 🔴",
            "সঠিক ম্যাপিং (400, 422, 500) 🟢",
          ],
          [
            "Security",
            "DB connection string ও stack trace ফাঁস হয় 🔴",
            "সেনসিটিভ ডিটেইল লগে, ইউজারে জেনেরিক টেক্সট 🟢",
          ],
          [
            "Client handling",
            "প্রতিটি fetch-এ আলাদা if-else 🔴",
            "সেন্ট্রালাইজড apiFetch ও টাইপ-সেফ ApiError 🟢",
          ],
        ]}
      />

      <Line name="ভুলু ভাই">
        অসাধারণ! <code>ApiError</code> ক্লাস আর <code>createErrorResponse</code> হেল্পার দিয়ে ব্যাকএন্ড
        আর ফ্রন্টএন্ড — দুটোকেই একদম ক্লিন আর টাইপ-সেফ বানিয়ে ফেললাম!
      </Line>

      {/* ── Takeaways ─────────────────────────────────────────────────── */}
      <H2 id="takeaway">Production Takeaways</H2>

      <Note>
        <ul>
          <li>
            <strong>Never return 200 for errors:</strong> রেসপন্সের স্ট্যাটাস কোড দেখেই যেন ক্লায়েন্ট,
            ব্রাউজার বা মনিটরিং টুল বুঝতে পারে রিকোয়েস্ট সফল হয়েছে নাকি ব্যর্থ।
          </li>
          <li>
            <strong>Sanitize what reaches the client:</strong> সেনসিটিভ ইন্টারনাল এরর (PostgreSQL
            error, missing key) কখনোই ক্লায়েন্টে পাঠাবেন না — এগুলো সার্ভার-সাইড লগারে রেকর্ড করুন।
          </li>
          <li>
            <strong>Validate first with safeParse:</strong> API এরর কমানোর সবচেয়ে বড় হাতিয়ার হলো
            রিকোয়েস্টের একদম শুরুতে কঠোর ইনপুট ভ্যালিডেশন।
          </li>
        </ul>
      </Note>
    </article>
  );
}
