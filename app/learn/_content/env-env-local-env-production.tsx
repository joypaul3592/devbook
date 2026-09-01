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
      bn: "কোন .env ফাইল কখন কাজ করে?",
      en: "Which .env file wins, and when?",
    },
  },
  {
    id: "architecture",
    label: {
      bn: "Variable precedence অর্ডার",
      en: "The variable precedence order",
    },
  },
  {
    id: "mechanisms",
    label: { bn: "৩টি আর্কিটেকচারাল কনসেপ্ট", en: "Three architectural concepts" },
  },
  {
    id: "implementation",
    label: {
      bn: "Server/client আইসোলেশন",
      en: "Server/client isolation",
    },
  },
  {
    id: "matrix",
    label: { bn: ".env Files Comparison", en: ".env files comparison" },
  },
  {
    id: "takeaway",
    label: { bn: "Production Takeaways", en: "Production takeaways" },
  },
];

export default function EnvEnvLocalEnvProduction() {
  return (
    <article className="doc-prose">
      {/* ── The problem ───────────────────────────────────────────────── */}
      <H2 id="the-problem" anchorOnly>
        কোন .env ফাইল কখন কাজ করে?
      </H2>

      <p>
        সকাল ১০:১৫। ভুলু ভাই প্রজেক্ট প্রোডাকশনে ডেপ্লয় করার জন্য গিটহাবে পুশ করলেন। কিন্তু ডেপ্লয়
        হওয়ার পরপরই ডাটাবেস কানেকশন ফেল করলো, এবং লোকাল এনভায়রনমেন্টের সিক্রেট API কী স্ট্যাটিক JS
        বান্ডেলের মাধ্যমে ক্লায়েন্ট সাইডে লিক হয়ে গেল! ভুলু ভাই চিন্তায় পড়ে গেছেন — কোন{" "}
        <code>.env</code> ফাইল কখন কাজ করে আর লোকাল ও প্রোডাকশন ক্রেডেনশিয়াল কীভাবে আলাদা রাখতে হয়?
      </p>

      <Line name="ভুলু ভাই">
        ফাহিম! আমার <code>.env.local</code>-এর ডাটাবেস পাসওয়ার্ড গিটহাবে কেন পুশ হলো না? আর{" "}
        <code>.env</code> ও <code>.env.production</code>-এর মধ্যে আসল পার্থক্যটাই বা কী?
      </Line>

      <Line name="ফাহিম">
        ভুলু ভাই! <code>.env.local</code> ফাইলটি কেবল আপনার লোকাল মেশিনের ডেভেলপমেন্টের জন্য, এবং
        এটি <code>.gitignore</code>-এ থাকা বাধ্যতামূলক (Next.js নিজেই এটি ইগনোর করে)। প্রোডাকশন
        সার্ভারে কখনো <code>.env.local</code> পুশ করতে হয় না — সেখানে হোস্টিং প্ল্যাটফর্মের ড্যাশবোর্ডে
        এনভায়রনমেন্ট ভ্যারিয়েবল সেট করতে হয়।
      </Line>

      <Line name="নেক্সট-ভাই">
        একদম! সিক্রেট নিরাপদ রাখা এবং এনভায়রনমেন্ট অনুযায়ী সঠিক কনফিগ লোড করার জন্য নির্দিষ্ট variable
        precedence order এবং <code>NEXT_PUBLIC_</code> prefix rule বোঝা অত্যন্ত জরুরি!
      </Line>

      {/* ── Architecture ──────────────────────────────────────────────── */}
      <H2 id="architecture">১. Environment Variable Loading Precedence</H2>

      <Diagram>{`┌─────────────────────────────────────────────────────────────────────────────┐
│                 NEXT.JS ENVIRONMENT VARIABLE PRECEDENCE                     │
└─────────────────────────────────────────────────────────────────────────────┘

 Mode: npm run build / npm run start  (NODE_ENV=production)
                               │
                               ▼
 0. process.env from the platform ──► always wins (Vercel, Docker -e, systemd)
               │
               ▼
 1. .env.production.local        ──► highest file priority, git-ignored
               │
               ▼
 2. .env.local                   ──► SKIPPED when NODE_ENV=production ⚠
               │
               ▼
 3. .env.production              ──► production defaults, committed
               │
               ▼
 4. .env                         ──► generic fallback defaults, committed`}</Diagram>

      {/* ── Mechanisms ────────────────────────────────────────────────── */}
      <H2 id="mechanisms">২. কোর আর্কিটেকচারাল কনসেপ্ট</H2>

      <p>
        <strong>Precedence hierarchy:</strong> একই নামের ভ্যারিয়েবল একাধিক ফাইলে থাকলে Next.js নির্দিষ্ট
        সিকোয়েন্সে ভ্যালু ওভাররাইড করে। সর্বোচ্চ অগ্রাধিকার পায় প্ল্যাটফর্মের process environment,
        তারপর <code>.env.production.local</code> → <code>.env.production</code> → <code>.env</code>।
        একটি গুরুত্বপূর্ণ ব্যতিক্রম: <code>.env.local</code> প্রোডাকশন মোডে সম্পূর্ণ উপেক্ষা করা হয়।
      </p>

      <p>
        <strong>The NEXT_PUBLIC_ safety rule:</strong> প্রিফিক্স থাকলে (
        <code>NEXT_PUBLIC_ANALYTICS_ID</code>) Next.js বিল্ড টাইমে এর ভ্যালু ক্লায়েন্ট বান্ডেলে
        ইনলাইন করে দেয়। প্রিফিক্স ছাড়া ভ্যারিয়েবল (<code>DATABASE_URL</code>) ১০০% server-only —
        ক্লায়েন্ট কম্পোনেন্টে এটি <code>undefined</code> আসবে।
      </p>

      <p>
        <strong>Git hygiene:</strong> যেসব ফাইলে সিক্রেট থাকে (<code>.env.local</code>,{" "}
        <code>.env.production.local</code>) সেগুলো কখনোই কমিট করা যাবে না। কেবল নন-সেনসিটিভ ডিফল্ট
        ভ্যালুসহ <code>.env</code> বা <code>.env.production</code> রিপোতে রাখা নিরাপদ।
      </p>

      {/* ── Implementation ────────────────────────────────────────────── */}
      <H2 id="implementation">৩. Production Code Implementation</H2>

      <H3>❌ Anti-pattern — a database secret behind a public prefix</H3>

      <CodeBlock filename=".env.local">{`# 🔴 POOR PRACTICE: the prefix ships this straight into the browser bundle
NEXT_PUBLIC_DATABASE_URL="postgresql://user:secretpassword@db.example.com:5432/mydb"`}</CodeBlock>

      <CodeBlock filename="app/products/page.tsx">{`// 🔴 POOR PRACTICE: anyone can read this from the JS sources
export default function ProductsPage() {
  // ❌ inlined at build time and visible in the browser console
  console.log(process.env.NEXT_PUBLIC_DATABASE_URL);
  return <div>Products</div>;
}`}</CodeBlock>

      <H3>🟢 Production pattern — validated, isolated variables</H3>

      <p>
        <strong>Step 1 — বুট-টাইম স্কিমা ভ্যালিডেশন।</strong>
      </p>

      <CodeBlock filename="lib/env.ts">{`// 🟢 PRODUCTION PATTERN: fail at startup, not at 3am in production
import { z } from 'zod';

const envSchema = z.object({
  // server-only secrets — no prefix, never leaves the server
  DATABASE_URL: z.string().url('DATABASE_URL must be a valid connection URL'),
  STRIPE_SECRET_KEY: z.string().min(1, 'Stripe secret key is required'),

  // client-accessible — the prefix is a deliberate, reviewed decision
  NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY: z.string().min(1),
  NEXT_PUBLIC_APP_URL: z.string().url(),
});

// each key must be referenced literally — Next.js only inlines static references
const parsed = envSchema.safeParse({
  DATABASE_URL: process.env.DATABASE_URL,
  STRIPE_SECRET_KEY: process.env.STRIPE_SECRET_KEY,
  NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY: process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY,
  NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL,
});

if (!parsed.success) {
  console.error('❌ Invalid environment variables:', parsed.error.format());
  throw new Error('Environment variable validation failed. Check the server logs.');
}

export const env = parsed.data;`}</CodeBlock>

      <p>
        <strong>Step 2 — সার্ভারে নিরাপদ ব্যবহার।</strong>
      </p>

      <CodeBlock filename="app/api/checkout/route.ts">{`// 🟢 PRODUCTION PATTERN: secrets read only where they are safe
import { NextResponse } from 'next/server';
import { env } from '@/lib/env';

export async function POST() {
  // 🟢 server-only: these never reach any bundle
  const stripeKey = env.STRIPE_SECRET_KEY;
  const dbUrl = env.DATABASE_URL;

  // … checkout logic …

  // only the public value crosses back to the client
  return NextResponse.json({ success: true, appUrl: env.NEXT_PUBLIC_APP_URL });
}`}</CodeBlock>

      <p>
        <strong>Step 3 — গিট থেকে সিক্রেট দূরে রাখা।</strong>
      </p>

      <CodeBlock filename=".gitignore">{`# 🟢 every local and secret-bearing env file stays out of the repo
.env*.local
.env.production.local

# a committed template documents WHICH keys are needed, without their values
!.env.example`}</CodeBlock>

      {/* ── Matrix ────────────────────────────────────────────────────── */}
      <H2 id="matrix">৪. .env Files Comparison Matrix</H2>

      <Table
        head={["ফাইল", "Git status", "রানটাইম পরিবেশ", "ব্যবহারের নিয়ম"]}
        rows={[
          [
            ".env",
            "committed 🟢",
            "সব মোডে (dev, test, prod)",
            "জেনেরিক ও নন-সেনসিটিভ ফলব্যাক ভ্যালু",
          ],
          [
            ".env.local",
            "ignored 🔴",
            "শুধু local development",
            "লোকাল মেশিনের নিজস্ব সিক্রেট ও API কী",
          ],
          [
            ".env.production",
            "committed 🟢",
            "production build/start",
            "প্রোডাকশনের নন-সেনসিটিভ ডিফল্ট কনফিগ",
          ],
          [
            ".env.production.local",
            "ignored 🔴",
            "লোকাল production test",
            "প্রাক-ডেপ্লয়মেন্ট টেস্টের সিক্রেট",
          ],
        ]}
      />

      <Line name="ভুলু ভাই">
        ওয়াও ফাহিম! এখন বুঝেছি — <code>.env.local</code>-এ আমাদের লোকাল সিক্রেট থাকবে যা গিটে যাবে না,
        আর ক্লায়েন্টে সিক্রেট লিক আটকানোর একমাত্র উপায় হলো <code>NEXT_PUBLIC_</code> ভেবেচিন্তে
        ব্যবহার করা!
      </Line>

      {/* ── Takeaways ─────────────────────────────────────────────────── */}
      <H2 id="takeaway">Production Takeaways</H2>

      <Note>
        <ul>
          <li>
            <strong>Never prefix a secret:</strong> ডাটাবেস কী, এনক্রিপশন কী বা API সিক্রেটে ভুলেও{" "}
            <code>NEXT_PUBLIC_</code> যোগ করবেন না — একবার বিল্ড হলে সেটি পাবলিক, চিরতরে।
          </li>
          <li>
            <strong>Validate at boot:</strong> Zod দিয়ে সব ভ্যারিয়েবল ভ্যালিডেট করুন, যেন মিসিং কী-এর
            কারণে রানটাইমে অ্যাপ ক্র্যাশ না করে বরং স্টার্টআপেই ধরা পড়ে।
          </li>
          <li>
            <strong>Use platform secret managers:</strong> Vercel, AWS বা Docker-এ ডেপ্লয় করার সময়
            সিক্রেটগুলো প্ল্যাটফর্মের নিজস্ব environment settings-এ সেট করুন — ফাইল আপলোড করে নয়।
          </li>
        </ul>
      </Note>
    </article>
  );
}
