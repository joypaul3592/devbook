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
      bn: "আমার ওয়াইফাইতে তো দ্রুতই চলে",
      en: "It's fast on my wifi",
    },
  },
  {
    id: "architecture",
    label: {
      bn: "RUM বনাম synthetic আর্কিটেকচার",
      en: "RUM vs synthetic architecture",
    },
  },
  {
    id: "mechanisms",
    label: { bn: "৩টি আর্কিটেকচারাল কনসেপ্ট", en: "Three architectural concepts" },
  },
  {
    id: "implementation",
    label: {
      bn: "Deep health check, RUM ও E2E বট",
      en: "Health checks, RUM & an E2E bot",
    },
  },
  {
    id: "matrix",
    label: { bn: "RUM vs Synthetic", en: "RUM vs synthetic" },
  },
  {
    id: "takeaway",
    label: { bn: "Production Takeaways", en: "Production takeaways" },
  },
];

export default function RealUserMonitoring() {
  return (
    <article className="doc-prose">
      {/* ── The problem ───────────────────────────────────────────────── */}
      <H2 id="the-problem" anchorOnly>
        আমার ওয়াইফাইতে তো দ্রুতই চলে
      </H2>

      <p>
        দুপুর ২:১০। মার্কেটিং টিম অভিযোগ করছে — &quot;ঢাকার বাইরে থেকে মোবাইল নেটওয়ার্কে ঢুকলে সাইট
        অনেক স্লো হয়ে যাচ্ছে, চেকআউট বাটন লোড হতে ৫ সেকেন্ডের বেশি লাগছে!&quot; কিন্তু ভুলু ভাই তার
        হাই-স্পিড ওয়াইফাইতে বসে টেস্ট করে দেখছেন সাইট ১ সেকেন্ডেই ওপেন হচ্ছে।
      </p>

      <Line name="ভুলু ভাই">
        ফাহিম! আমার কম্পিউটারে তো সাইট রকেট স্পিডে চলছে! কিন্তু রিয়েল ইউজাররা স্লো অভিজ্ঞতা কেন
        পাচ্ছেন? আর ইউজাররা কমপ্লেন করার আগেই আমরা কীভাবে অটোমেটিক টেস্ট করে বের করব সাইট ঠিকমতো কাজ
        করছে কি না?
      </Line>

      <Line name="ফাহিম">
        ভুলু ভাই! আপনি ল্যাবের আদর্শ কন্ডিশনে টেস্ট করছেন, যেখানে আসল ইউজাররা স্লো নেটওয়ার্ক ও পুরোনো
        মোবাইল ব্যবহার করছেন। দুটো প্র্যাকটিস দরকার — <strong>RUM</strong> (রিয়েল ইউজারদের ব্রাউজার
        থেকে সরাসরি মেট্রিক্স সংগ্রহ) এবং <strong>synthetic monitoring</strong> (বট দিয়ে ২৪/৭ ক্রিটিক্যাল
        ফ্লো টেস্ট)।
      </Line>

      <Line name="নেক্সট-ভাই">
        একদম! RUM দিয়ে জানবেন আসল ইউজারদের ঠিক কী সমস্যা হচ্ছে, আর synthetic monitoring দিয়ে জানবেন
        ইউজাররা সাইটে ঢোকার আগেই চেকআউট ফ্লো ডাউন হয়েছে কি না — রাত ৩টাতেও।
      </Line>

      {/* ── Architecture ──────────────────────────────────────────────── */}
      <H2 id="architecture">১. RUM vs Synthetic Monitoring</H2>

      <Diagram>{`┌─────────────────────────────────────────────────────────────────────────────┐
│                 RUM vs SYNTHETIC MONITORING                                 │
└─────────────────────────────────────────────────────────────────────────────┘

 [REAL USER MONITORING]
 real users worldwide — 4G mobile, desktop, weak wifi
   │
   ▼ a client script / useReportWebVitals
 sends telemetry: LCP, INP, TTFB, long tasks, errors
   │
   ▼
 ┌───────────────────────────────────────────────────────────────────────────┐
 │ RUM dashboard (Axiom / Datadog / Vercel Speed Insights)                   │
 │ └─ "60% of Android users in Bangladesh see INP > 300ms"                   │
 └───────────────────────────────────────────────────────────────────────────┘

 [SYNTHETIC MONITORING]
 bot runners in Tokyo, Frankfurt, Singapore, us-east
   │
   ▼ every 5 minutes, a headless Playwright script
 emulates the journey: home ➔ login ➔ add to cart ➔ verify API
   │
   ├─► 🟢 all green — health check passed
   └─► ❌ payment API failed — page PagerDuty 🚨`}</Diagram>

      {/* ── Mechanisms ────────────────────────────────────────────────── */}
      <H2 id="mechanisms">২. কোর আর্কিটেকচারাল কনসেপ্ট</H2>

      <p>
        <strong>Real User Monitoring:</strong> ক্লায়েন্টে চলা একটি লাইটওয়েট SDK ব্রাউজারের নেটিভ{" "}
        <code>PerformanceObserver</code> API দিয়ে রিয়েল-টাইম অভিজ্ঞতা পরিমাপ করে। এতে ডিভাইসের ধরন,
        জিওগ্রাফিক লোকেশন বা নেটওয়ার্ক অনুযায়ী পারফরম্যান্সের পার্থক্য জানা যায় — যা ল্যাব টেস্টে কখনোই
        ধরা পড়ে না।
      </p>

      <p>
        <strong>Synthetic monitoring:</strong> মানুষের হস্তক্ষেপ ছাড়াই বট দিয়ে নির্দিষ্ট সময় পরপর মূল
        ফ্লো টেস্ট করা। এর সবচেয়ে বড় সুবিধা — কোনো ইউজার এরর ফেস করার আগেই ডাউনটাইম ধরা পড়ে, এমনকি
        ট্রাফিক শূন্য থাকা রাতের বেলাতেও।
      </p>

      <p>
        <strong>Deep health check endpoint:</strong> একটি হেলথ-চেক যা শুধু &quot;সার্ভার আপ&quot; বলে
        না, বরং ডাটাবেস, ক্যাশ ও এক্সটার্নাল ডিপেনডেন্সি সচল কিনা যাচাই করে সঠিক স্ট্যাটাস কোড দেয় —
        নাহলে লোড ব্যালেন্সার একটি ভাঙা ইনস্ট্যান্সে ট্রাফিক পাঠাতেই থাকবে।
      </p>

      {/* ── Implementation ────────────────────────────────────────────── */}
      <H2 id="implementation">৩. Production Code Implementation</H2>

      <H3>❌ Anti-pattern — a health check that always says OK</H3>

      <CodeBlock filename="app/api/health/route.ts">{`// 🔴 POOR PRACTICE: a shallow check that proves nothing
export async function GET() {
  // ❌ returns 200 even when the database is dead and nobody can buy anything —
  // the load balancer will happily keep routing traffic here
  return Response.json({ status: 'ok' });
}`}</CodeBlock>

      <H3>🟢 Production pattern — deep checks, real telemetry, an E2E bot</H3>

      <p>
        <strong>Step 1 — deep dependency health check।</strong>
      </p>

      <CodeBlock filename="app/api/health/route.ts">{`// 🟢 PRODUCTION PATTERN: prove the dependencies, not just the process
import { NextResponse } from 'next/server';

// never cache a health check — a stale 200 is worse than no check
export const dynamic = 'force-dynamic';

export async function GET() {
  const checks: Record<string, string> = {};

  try {
    // 1. database connectivity, with its latency recorded
    const dbStart = performance.now();
    await db.$queryRaw\`SELECT 1\`;
    checks.database = \`UP (\${(performance.now() - dbStart).toFixed(2)}ms)\`;

    // 2. cache connectivity
    const redisStart = performance.now();
    await redis.ping();
    checks.redis = \`UP (\${(performance.now() - redisStart).toFixed(2)}ms)\`;

    return NextResponse.json(
      {
        status: 'HEALTHY',
        uptime: process.uptime(),
        timestamp: new Date().toISOString(),
        checks,
      },
      { status: 200 }
    );
  } catch (error) {
    // 🟢 a non-2xx status is what makes the load balancer pull this instance
    return NextResponse.json(
      {
        status: 'UNHEALTHY',
        checks,
        error: (error as Error).message,
      },
      { status: 503 }
    );
  }
}`}</CodeBlock>

      <p>
        <strong>Step 2 — RUM টেলিমেট্রি কালেক্টর।</strong>
      </p>

      <CodeBlock filename="components/rum-collector.tsx">{`// 🟢 PRODUCTION PATTERN: measure the devices you cannot hold in your hand
'use client';

import { useEffect } from 'react';

export function RUMCollector() {
  useEffect(() => {
    if (!('PerformanceObserver' in window)) return;

    // long tasks block the main thread — they are what wrecks INP
    const observer = new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) {
        if (entry.duration <= 100) continue;

        const payload = JSON.stringify({
          metric: 'LONG_TASK',
          duration: entry.duration,
          startTime: entry.startTime,
          url: window.location.pathname,
          // connection type explains a lot that a device name cannot
          connection: (navigator as { connection?: { effectiveType?: string } })
            .connection?.effectiveType,
        });

        // 🟢 sendBeacon survives navigation; a fetch here would be cancelled
        navigator.sendBeacon?.('/api/telemetry/rum', payload);
      }
    });

    // some browsers do not support the longtask entry type at all
    try {
      observer.observe({ entryTypes: ['longtask'] });
    } catch {
      return;
    }

    return () => observer.disconnect();
  }, []);

  return null;
}`}</CodeBlock>

      <p>
        <strong>Step 3 — synthetic E2E মনিটরিং স্ক্রিপ্ট।</strong>
      </p>

      <CodeBlock filename="synthetic/checkout.spec.ts">{`// 🟢 PRODUCTION PATTERN: a bot that walks the critical path every 5 minutes
import { test, expect } from '@playwright/test';

test('synthetic: critical checkout flow is available', async ({ page }) => {
  const BASE_URL = process.env.TARGET_URL || 'https://my-ecom-store.com';

  // 1. the home page responds
  const response = await page.goto(BASE_URL);
  expect(response?.status()).toBe(200);

  // 2. the dependencies behind it are alive
  const healthRes = await page.request.get(\`\${BASE_URL}/api/health\`);
  expect(healthRes.status()).toBe(200);
  expect((await healthRes.json()).status).toBe('HEALTHY');

  // 3. the money path actually works — this is the check that matters
  await page.getByRole('link', { name: 'View Product' }).click();
  await page.getByRole('button', { name: 'Add to Cart' }).click();

  await expect(page.locator('#cart-badge')).toHaveText('1');
});`}</CodeBlock>

      {/* ── Matrix ────────────────────────────────────────────────────── */}
      <H2 id="matrix">৪. RUM vs Synthetic Monitoring</H2>

      <Table
        head={["ক্রাইটেরিয়া", "Real User Monitoring", "Synthetic Monitoring"]}
        rows={[
          [
            "ডাটার উৎস",
            "আসল কাস্টমারদের ব্রাউজার",
            "অটোমেটেড হেডলেস ব্রাউজার বট",
          ],
          [
            "ট্রাফিক নির্ভরতা",
            "ইউজার না এলে ডাটা নেই 🔴",
            "ট্রাফিক ছাড়াও ক্রন জব হিসেবে চলে 🟢",
          ],
          [
            "মূল উদ্দেশ্য",
            "আসল পারফরম্যান্স বোঝা 🟢",
            "ডাউনটাইম আগেভাগে ধরা 🟢",
          ],
          [
            "এনভায়রনমেন্ট",
            "বিভিন্ন ডিভাইস ও স্লো নেটওয়ার্ক 🟢",
            "নিয়ন্ত্রিত ও স্ট্যান্ডার্ড ব্রাউজার",
          ],
        ]}
      />

      <Line name="ভুলু ভাই">
        এখন পুরো লজিক পানির মতো পরিষ্কার ফাহিম! RUM দিয়ে রিয়েল ইউজারদের পারফরম্যান্স ট্র্যাক করব, আর
        synthetic monitoring দিয়ে ২৪/৭ অটোমেটিক চেকআউট ফ্লো টেস্ট করে নিশ্চিন্তে ঘুমাব!
      </Line>

      {/* ── Takeaways ─────────────────────────────────────────────────── */}
      <H2 id="takeaway">Production Takeaways</H2>

      <Note>
        <ul>
          <li>
            <strong>Build deep health checks:</strong> রেসপন্স দেওয়ার আগে ডাটাবেস ও ক্যাশ পিং করে
            নিশ্চিত হন, এবং ব্যর্থ হলে অবশ্যই non-2xx স্ট্যাটাস দিন — নাহলে লোড ব্যালেন্সার ডেড
            ইনস্ট্যান্সে ট্রাফিক পাঠাতেই থাকবে।
          </li>
          <li>
            <strong>Use both, for different questions:</strong> নতুন ফিচারের আসল পারফরম্যান্স দেখতে
            RUM, আর সিস্টেম বা পেমেন্ট গেটওয়ে আপ আছে কিনা দেখতে synthetic monitoring।
          </li>
          <li>
            <strong>Send RUM data with sendBeacon:</strong> ক্লায়েন্ট থ্রেড ব্লক না করে এবং পেজ আনলোড
            হওয়ার মুহূর্তেও ডাটা পাঠাতে <code>navigator.sendBeacon</code> ব্যবহার করুন।
          </li>
        </ul>
      </Note>
    </article>
  );
}
