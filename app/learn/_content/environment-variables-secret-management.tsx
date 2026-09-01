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
      bn: "GitHub-এ লিক হওয়া সিক্রেট কী",
      en: "A secret key leaked to GitHub",
    },
  },
  {
    id: "architecture",
    label: {
      bn: "Secret isolation আর্কিটেকচার",
      en: "The secret isolation architecture",
    },
  },
  {
    id: "mechanisms",
    label: { bn: "৩টি আর্কিটেকচারাল কনসেপ্ট", en: "Three architectural concepts" },
  },
  {
    id: "implementation",
    label: {
      bn: "Zod env গার্ড ও নিরাপদ অ্যাক্সেস",
      en: "A Zod env guard & safe access",
    },
  },
  {
    id: "matrix",
    label: { bn: "Env Exposure Comparison", en: "Env exposure comparison" },
  },
  {
    id: "takeaway",
    label: { bn: "Production Takeaways", en: "Production takeaways" },
  },
];

export default function EnvironmentVariablesSecretManagement() {
  return (
    <article className="doc-prose">
      {/* ── The problem ───────────────────────────────────────────────── */}
      <H2 id="the-problem" anchorOnly>
        GitHub-এ লিক হওয়া সিক্রেট কী
      </H2>

      <p>
        সন্ধ্যা ৬:১৫। ভুলু ভাই হঠাৎ GitHub থেকে একটি ইমেইল পেয়ে চমকে উঠলেন —{" "}
        <em>Security Alert: Secret exposed in your public repository!</em> তাড়াহুড়ো করে রিপোজিটরি চেক
        করে দেখলেন, Stripe-এর প্রাইভেট সিক্রেট কী আর ডাটাবেজ পাসওয়ার্ড ভুলে <code>.env.local</code>{" "}
        থেকে প্লেইন কোডে কপি হয়ে পাবলিক কমিটে চলে গেছে! ৫ মিনিটের মাথায় হ্যাকাররা সেই টেস্ট ডাটাবেজ
        লিক করে ফেলেছিল।
      </p>

      <Line name="ভুলু ভাই">
        ফাহিম! এ কী মারাত্মক কাণ্ড! আমি তো স্রেফ ফ্রন্টএন্ডে পেমেন্ট গেটওয়ে কনফিগার করার জন্য টেস্ট
        সিক্রেট কী বসিয়েছিলাম! কিন্তু ক্লায়েন্ট বান্ডেলে পাসওয়ার্ড এক্সপোজ হয়ে গেল কীভাবে? আর
        Next.js-এ <code>NEXT_PUBLIC_</code> কেন বান্ডেলে চলে যায়?
      </Line>

      <Line name="ফাহিম">
        ভুলু ভাই! Next.js-এ সিক্রেট এনভায়রনমেন্ট ভেরিয়েবল আর ক্লায়েন্ট ভেরিয়েবলের স্পষ্ট সীমানা আছে!
        কোনো ভেরিয়েবলের নামের আগে <code>NEXT_PUBLIC_</code> বসালে Next.js সেটাকে ক্লায়েন্ট-সাইড
        জাভাস্ক্রিপ্ট বান্ডেলে ইনজেক্ট করে দেয়! আর গোপন পাসওয়ার্ড <code>.env.local</code>-এ রেখে{" "}
        <code>.gitignore</code>-এ না দিলে GitHub-এ পুশ হয়ে যাওয়ার চরম ঝুঁকি থাকে।
      </Line>

      <Line name="নেক্সট-ভাই">
        একদম! ক্লায়েন্ট বান্ডেলে ভুলবশত কোনো সার্ভার সিক্রেট লিক হওয়া বন্ধ করতে type-safe env
        validation (Zod) এবং zero-client-exposure আর্কিটেকচার ব্যবহার করতে হবে! এতে সার্ভার স্টার্ট
        হওয়ার আগেই ভুল কনফিগ ধরা পড়ে অ্যাপ ক্র্যাশ করবে, কিন্তু সিক্রেট ব্রাউজারে লিক হতে দেবে না।
      </Line>

      {/* ── Architecture ──────────────────────────────────────────────── */}
      <H2 id="architecture">১. Secret Management &amp; Isolation Architecture</H2>

      <Diagram>{`┌─────────────────────────────────────────────────────────────────────────────┐
│                 NEXT.JS ENV VAR & SECRET ISOLATION ENGINE                   │
└─────────────────────────────────────────────────────────────────────────────┘

 .env.local
         │
         ├────── 1. DATABASE_URL="postgres://…"        (no prefix = SERVER ONLY)
         └────── 2. NEXT_PUBLIC_ANALYTICS_ID="123"     (NEXT_PUBLIC_ = CLIENT BUNDLE)
                         │
                         ▼
   ┌───────────────────────────────────────────────────────────┐
   │ Build & runtime validation layer (Zod env guard)          │
   └───────────────────────────────────────────────────────────┘
                         │
        ┌────────────────┴────────────────┐
        ▼                                 ▼
 server context (RSC / action)     client bundle (browser JS)
 ├── reads DATABASE_URL       🟢    ├── reads NEXT_PUBLIC_ANALYTICS_ID 🟢
 └── reads STRIPE_SECRET_KEY  🟢    └── ❌ DATABASE_URL is undefined (leak shield)`}</Diagram>

      {/* ── Mechanisms ────────────────────────────────────────────────── */}
      <H2 id="mechanisms">২. কোর আর্কিটেকচারাল কনসেপ্ট</H2>

      <p>
        <strong>The NEXT_PUBLIC_ boundary rule:</strong> <code>NEXT_PUBLIC_</code> প্রিফিক্সযুক্ত
        ভেরিয়েবল ক্লায়েন্ট-সাইড ব্রাউজার বান্ডেলে স্ট্যাটিকভাবে ইনজেক্ট হয়ে যায়। প্রিফিক্সহীন
        ভেরিয়েবল কেবল সার্ভার রানটাইমে (Node.js/Edge) অ্যাক্সেস করা যায় — ক্লায়েন্ট কম্পোনেন্টে এটি{" "}
        <code>undefined</code> দেখাবে।
      </p>

      <p>
        <strong>Type-safe env validation with Zod:</strong> অ্যাপ রান করার আগেই এনভায়রনমেন্ট
        ভেরিয়েবলগুলোর উপস্থিতি ও ফরম্যাট (URL, minimum length) যাচাই করা। সিক্রেট মিসিং থাকলে বুট
        টাইমেই এরর ছুড়ে প্রসেস থামিয়ে দেওয়া।
      </p>

      <p>
        <strong>Git hygiene:</strong> <code>.env</code>, <code>.env.local</code>,{" "}
        <code>.env.production</code> ফাইলগুলো সবসময় <code>.gitignore</code>-এ রাখা এবং রিপোতে শুধু
        একটি ডামি টেমপ্লেট (<code>.env.example</code>) উন্মুক্ত রাখা।
      </p>

      {/* ── Implementation ────────────────────────────────────────────── */}
      <H2 id="implementation">৩. Production Code Implementation</H2>

      <H3>❌ Anti-pattern — a secret behind NEXT_PUBLIC_</H3>

      <CodeBlock filename="components/LeakyClientComponent.tsx">{`// 🔴 POOR PRACTICE: exposing credentials to the browser
// any visitor can read this straight out of the JS sources

'use client';

// ❌ the NEXT_PUBLIC_ prefix inlines this value into the client bundle
const DB_PASS = process.env.NEXT_PUBLIC_DATABASE_PASSWORD;

export default function LeakyClientComponent() {
  console.log('Database password leaked to the browser console:', DB_PASS);

  return <div>Vulnerable page</div>;
}`}</CodeBlock>

      <H3>🟢 Production pattern — a type-safe env guard</H3>

      <p>
        <strong>Step 1 — Zod ইনস্টল।</strong>
      </p>

      <CodeBlock filename="terminal">{`npm install zod`}</CodeBlock>

      <p>
        <strong>Step 2 — type-safe env স্কিমা।</strong>
      </p>

      <CodeBlock filename="env.ts">{`// 🟢 PRODUCTION PATTERN: type-safe environment variable validator
import { z } from 'zod';

const envSchema = z.object({
  // 🟢 server-only secrets — never exposed to the browser
  DATABASE_URL: z.string().url('Invalid Postgres connection URL'),
  STRIPE_SECRET_KEY: z.string().min(1, 'Stripe secret key is required'),
  JWT_SECRET: z.string().min(32, 'JWT secret must be at least 32 characters'),

  // 🟢 client-accessible values — must carry the NEXT_PUBLIC_ prefix
  NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY: z.string().min(1),
  NEXT_PUBLIC_APP_URL: z.string().url(),
});

// referencing each key explicitly is required — process.env is not enumerable
// in the client bundle, and Next.js only inlines statically referenced keys
const parsed = envSchema.safeParse({
  DATABASE_URL: process.env.DATABASE_URL,
  STRIPE_SECRET_KEY: process.env.STRIPE_SECRET_KEY,
  JWT_SECRET: process.env.JWT_SECRET,
  NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY: process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY,
  NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL,
});

if (!parsed.success) {
  console.error('❌ Invalid or missing environment variables:', parsed.error.format());
  throw new Error('Environment variable validation failed. Check the server logs.');
}

export const env = parsed.data;`}</CodeBlock>

      <p>
        <strong>Step 3 — Server Action-এ নিরাপদ সিক্রেট অ্যাক্সেস।</strong>
      </p>

      <CodeBlock filename="actions/payment.ts">{`// 🟢 PRODUCTION PATTERN: safe secret access on the server
'use server';

import { env } from '@/env'; // the validated schema

export async function createStripePaymentIntent(amount: number) {
  // 🟢 a server-only secret, read on the server
  const secretKey = env.STRIPE_SECRET_KEY;

  const response = await fetch('https://api.stripe.com/v1/payment_intents', {
    method: 'POST',
    headers: {
      Authorization: \`Bearer \${secretKey}\`,
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: new URLSearchParams({
      amount: (amount * 100).toString(),
      currency: 'usd',
    }),
  });

  const data = await response.json();

  // 🟢 return only the non-sensitive client secret to the browser
  return { clientSecret: data.client_secret };
}`}</CodeBlock>

      {/* ── Matrix ────────────────────────────────────────────────────── */}
      <H2 id="matrix">৪. Environment Variable Exposure Comparison</H2>

      <Table
        head={[
          "ভেরিয়েবল টাইপ",
          "ক্লায়েন্ট বান্ডেলে দৃশ্যমান?",
          "সার্ভার সাইডে ব্যবহারযোগ্য?",
          "আদর্শ ব্যবহার",
        ]}
        rows={[
          [
            "NEXT_PUBLIC_*",
            "হ্যাঁ — সবাই দেখতে পাবে 🔴",
            "হ্যাঁ 🟢",
            "Analytics ID, publishable key",
          ],
          [
            "Plain (no prefix)",
            "না — সম্পূর্ণ নিরাপদ 🟢",
            "হ্যাঁ (server only) 🟢",
            "Database URL, Stripe secret, JWT secret",
          ],
          [
            "Unchecked process.env",
            "ভুলবশত লিক হতে পারে 🔴",
            "চেক ছাড়াই রান করে 🔴",
            "সুপারিশকৃত নয়",
          ],
          [
            "Zod-validated env",
            "ভুল করলে বুট টাইমেই থামে 🟢",
            "টাইপ-সেফ ও ভ্যালিডেটেড 🟢",
            "প্রোডাকশন স্ট্যান্ডার্ড",
          ],
        ]}
      />

      <Line name="ভুলু ভাই">
        মারাত্মক কাজের জিনিস ফাহিম! Zod ভ্যালিডেশন আর <code>NEXT_PUBLIC_</code> ফিল্টার বসানোর পর এখন
        আর কোনো সিক্রেট ভুলে ফ্রন্টএন্ড ক্লায়েন্ট বান্ডেলে যেতে পারবে না! GitHub সিকিউরিটি অ্যালার্টের
        ঝামেলা থেকেও বাঁচা গেল।
      </Line>

      {/* ── Takeaways ─────────────────────────────────────────────────── */}
      <H2 id="takeaway">Production Takeaways</H2>

      <Note>
        <ul>
          <li>
            <strong>Audit every NEXT_PUBLIC_ prefix:</strong> ভুলেও কোনো সিক্রেট কী, ডাটাবেজ
            ক্রেডেনশিয়াল বা প্রাইভেট টোকেনের আগে <code>NEXT_PUBLIC_</code> যোগ করবেন না।
          </li>
          <li>
            <strong>Validate the schema at boot:</strong> একটি <code>env.ts</code> বানিয়ে সব ভেরিয়েবল
            ভ্যালিডেট করে নিন, যেন এনভায়রনমেন্ট মিসিং থাকলে সার্ভার ভুল কনফিগ নিয়ে স্টার্ট না নেয়।
          </li>
          <li>
            <strong>Keep git clean:</strong> সিক্রেট পুশ হওয়া প্রতিরোধ করতে <code>.gitignore</code>{" "}
            ফাইলে <code>.env*</code> যুক্ত রয়েছে কিনা ডেভেলপমেন্টের শুরুতেই নিশ্চিত করুন।
          </li>
        </ul>
      </Note>
    </article>
  );
}
