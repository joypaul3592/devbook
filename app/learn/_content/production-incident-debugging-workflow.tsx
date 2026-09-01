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
      bn: "৫০০ এরর ৪৫%, প্যানিক মোড",
      en: "45% 500s, and panic",
    },
  },
  {
    id: "architecture",
    label: {
      bn: "Incident response ওয়ার্কফ্লো",
      en: "The incident response workflow",
    },
  },
  {
    id: "mechanisms",
    label: { bn: "৪টি আর্কিটেকচারাল কনসেপ্ট", en: "Four architectural concepts" },
  },
  {
    id: "implementation",
    label: {
      bn: "Kill-switch, breaker ও runbook",
      en: "Kill-switches, breakers & runbooks",
    },
  },
  {
    id: "matrix",
    label: { bn: "Panic vs Structured Response", en: "Panic vs structured response" },
  },
  {
    id: "takeaway",
    label: { bn: "Production Takeaways", en: "Production takeaways" },
  },
];

export default function ProductionIncidentDebuggingWorkflow() {
  return (
    <article className="doc-prose">
      {/* ── The problem ───────────────────────────────────────────────── */}
      <H2 id="the-problem" anchorOnly>
        ৫০০ এরর ৪৫%, প্যানিক মোড
      </H2>

      <p>
        রাত ১২:৩০। ফ্ল্যাশ সেল চলাকালীন হঠাৎ স্ল্যাক চ্যানেলে PagerDuty অ্যালার্টের বন্যা!{" "}
        <code>500 Internal Server Error</code> রেট ৩% থেকে একলাফে ৪৫%-এ উঠে গেছে! ডাটাবেসের CPU ১০০%
        হিট করে রিকোয়েস্ট ড্রপ করা শুরু করেছে, ইউজারদের পেমেন্ট ঝুলে গেছে। ভুলু ভাই চিৎকার করছেন —
        &quot;তাড়াতাড়ি সার্ভার রিস্টার্ট দাও! না হলে এখনই কোড চেঞ্জ করে পুশ করো!&quot;
      </p>

      <Line name="ভুলু ভাই">
        ফাহিম! সার্ভার তো ক্র্যাশ করার মুখে! এখন হাজার হাজার লগের মধ্যে সমস্যা খুঁজতে থাকলে লাখ টাকার
        লস হয়ে যাবে! প্যানিক না করে এখন আমাদের কী করা উচিত?
      </Line>

      <Line name="ফাহিম">
        ভুলু ভাই! ইনসিডেন্টের সময় অন্ধের মতো সার্ভার রিস্টার্ট বা তাড়াহুড়ো করে কোড পুশ করা আগুনে ঘি
        ঢালার মতো! প্রোডাকশন ইনসিডেন্টের প্রথম গোল্ডেন রুল — <strong>আগে সিস্টেম বাঁচান</strong>{" "}
        (mitigate first), তারপর ঠান্ডা মাথায় কারণ খুঁজুন (investigate later)।
      </Line>

      <Line name="নেক্সট-ভাই">
        একদম! emergency feature flag (kill-switch), circuit breaker pattern, এবং একটি সুনির্দিষ্ট
        incident response runbook থাকলে মূল কোড চেঞ্জ না করেই সার্ভিসকে ইমিডিয়েটলি স্থিতিশীল করা যায়!
      </Line>

      {/* ── Architecture ──────────────────────────────────────────────── */}
      <H2 id="architecture">১. Production Incident Response Workflow</H2>

      <Diagram>{`┌─────────────────────────────────────────────────────────────────────────────┐
│                   PRODUCTION INCIDENT RESPONSE WORKFLOW                     │
└─────────────────────────────────────────────────────────────────────────────┘

 [1] DETECTION
     PagerDuty / Slack fires — 5xx above 5%, or p95 latency above 2s
   │
   ▼
 [2] TRIAGE & MITIGATION  (first 5 minutes)  ──► DO NOT DEBUG CODE YET
 ├── option A: roll back to the last known-good release
 ├── option B: flip the emergency kill-switch on a non-critical feature
 └── option C: enable the circuit breaker / rate limiter to shield the database
   │
   ▼ 🟢 system stabilised — errors back under 1%
 [3] ROOT CAUSE ANALYSIS
 ├── filter traces by traceId and error status
 ├── inspect the golden signals: latency, traffic, errors, saturation
 └── reproduce in staging with the exact payload
   │
   ▼
 [4] PERMANENT FIX
     code fix ➔ CI tests ➔ canary deploy ➔ watch for 24h
   │
   ▼
 [5] BLAMELESS POST-MORTEM
     document the timeline, the cause, and the guardrail that prevents a repeat`}</Diagram>

      {/* ── Mechanisms ────────────────────────────────────────────────── */}
      <H2 id="mechanisms">২. কোর আর্কিটেকচারাল কনসেপ্ট</H2>

      <p>
        <strong>Mitigation before root cause:</strong> ইনসিডেন্ট চলাকালীন বাগ ফিক্স করা প্রথম কাজ নয়।
        প্রথম কাজ হলো এরর রেট নামানো — রোলব্যাক বা kill-switch দিয়ে। সিস্টেম স্টেবল হলে তারপর ঠান্ডা
        মাথায় ডিবাগিং।
      </p>

      <p>
        <strong>The four golden signals:</strong> ইনসিডেন্টের গভীরতা বুঝতে চারটি মেট্রিক —{" "}
        <em>latency</em> (রিকোয়েস্ট প্রসেসে কত সময়), <em>traffic</em> (ইনকামিং লোড),{" "}
        <em>errors</em> (কত শতাংশ ব্যর্থ), <em>saturation</em> (CPU, মেমরি বা কানেকশন পুল কতটা ফুল)।
      </p>

      <p>
        <strong>Circuit breaker:</strong> কোনো ডাউনস্ট্রিম সার্ভিস স্লো বা ডাউন হলে মেইন অ্যাপ যেন হ্যাং
        না হয়, সেজন্য সাথে সাথে সেটিকে আইসোলেট করে ফলব্যাক রেসপন্স দেওয়া।
      </p>

      <p>
        <strong>Blameless post-mortem:</strong> ইনসিডেন্ট শেষে কাউকে দোষারোপ না করে সিস্টেমের কোথায়
        ঘাটতি ছিল তা খুঁজে বের করা এবং ভবিষ্যতে রোধে অটোমেটেড গার্ডরেইল তৈরি করা। দোষারোপের সংস্কৃতিতে
        মানুষ ইনসিডেন্ট লুকায়, তাতে সিস্টেম আরও ভঙ্গুর হয়।
      </p>

      {/* ── Implementation ────────────────────────────────────────────── */}
      <H2 id="implementation">৩. Production Code Implementation</H2>

      <H3>❌ Anti-pattern — no isolation, no switch to flip</H3>

      <CodeBlock filename="app/api/products/route.ts">{`// 🔴 POOR PRACTICE: nothing between you and a failing dependency
export async function GET() {
  // ❌ if the ML API hangs for 30s or throws, this whole route 500s —
  // and during an incident there is no way to turn it off without a deploy
  const recommendations = await fetch('https://ml-api.internal/recommend');
  const data = await recommendations.json();

  return Response.json({ status: 'success', data });
}`}</CodeBlock>

      <H3>🟢 Production pattern — incident-ready architecture</H3>

      <p>
        <strong>Step 1 — emergency kill-switch।</strong>
      </p>

      <CodeBlock filename="lib/feature-flags.ts">{`// 🟢 PRODUCTION PATTERN: turn a feature off in seconds, with no redeploy
import { Redis } from '@upstash/redis';

const redis = Redis.fromEnv();

export async function isFeatureEnabled(featureKey: string): Promise<boolean> {
  try {
    const isDisabled = await redis.get<boolean>(\`killswitch:\${featureKey}\`);
    return !isDisabled;
  } catch {
    // 🟢 fail open: a flag store outage must not take the feature down too
    return true;
  }
}`}</CodeBlock>

      <p>
        <strong>Step 2 — circuit breaker ও safe fallback।</strong>
      </p>

      <CodeBlock filename="app/api/products/route.ts">{`// 🟢 PRODUCTION PATTERN: the core path survives its dependencies
import { NextResponse } from 'next/server';
import { isFeatureEnabled } from '@/lib/feature-flags';

interface Recommendation { id: number; title: string }

export async function GET() {
  // 1. can be switched off instantly from the flag store during an incident
  const allowRecommendations = await isFeatureEnabled('recommendation_engine');

  let recommendations: Recommendation[] = [];

  if (allowRecommendations) {
    try {
      // 2. 🟢 a hard timeout — a hanging dependency must never hold a thread
      const res = await fetch('https://ml-api.internal/recommend', {
        signal: AbortSignal.timeout(800),
      });

      if (res.ok) {
        recommendations = await res.json();
      }
    } catch {
      // 🟢 degrade, do not crash
      console.warn('Recommendation service unavailable; serving without it.');
    }
  }

  // the products — the part that makes money — always render
  return NextResponse.json({
    products: [{ id: 101, title: 'Smart Watch' }],
    recommendations,
  });
}`}</CodeBlock>

      <p>
        <strong>Step 3 — incident runbook।</strong>
      </p>

      <CodeBlock filename="INCIDENT_RUNBOOK.md">{`# 🚨 Incident response playbook

At 12:30am nobody invents a plan. Write it now, follow it then.

## 1. High CPU / database saturation
- Step 1: enable read-only mode — \`redis set killswitch:write_ops true\`
- Step 2: scale the connection pool or add a read replica
- Step 3: unresolved after 3 minutes? roll back to the previous deployment

## 2. High 5xx rate (> 5%)
- Step 1: filter logs by \`status:500\` in the log aggregator
- Step 2: identify the broken downstream dependency via \`traceId\`
- Step 3: disable the affected sub-feature with its kill-switch

## 3. After every incident
- Post the timeline in #incidents within 24h
- One action item must be a guardrail, not "be more careful"`}</CodeBlock>

      {/* ── Matrix ────────────────────────────────────────────────────── */}
      <H2 id="matrix">৪. Panic Hotfixing vs Structured Response</H2>

      <Table
        head={["বৈশিষ্ট্য", "Panic hotfixing", "Structured incident response"]}
        rows={[
          [
            "প্রথম পদক্ষেপ",
            "লাইভ কোড এডিট বা সার্ভার রিস্টার্ট 🔴",
            "kill-switch বা রোলব্যাক দিয়ে স্ট্যাবিলাইজ 🟢",
          ],
          [
            "ডাউনটাইম",
            "দীর্ঘ ও অনিশ্চিত 🔴",
            "১-৫ মিনিটে ক্ষতি নিয়ন্ত্রণ 🟢",
          ],
          [
            "সার্ভিস ডিফেন্স",
            "একটি সার্ভিস ভাঙলে পুরো অ্যাপ ডাউন 🔴",
            "circuit breaker-এ কোর ফাংশনালিটি টিকে থাকে 🟢",
          ],
          [
            "পরবর্তী কাজ",
            "ব্লেম গেম, কোনো রেকর্ড নেই 🔴",
            "blameless post-mortem ও runbook আপডেট 🟢",
          ],
        ]}
      />

      <Line name="ভুলু ভাই">
        এখন আর প্রোডাকশন ইনসিডেন্টে ভয় পাওয়ার কিছু নেই ফাহিম! সঠিক ওয়ার্কফ্লো, ফিচার kill-switch আর
        circuit breaker জানা থাকলে বড় ডাউনটাইম ছাড়াই যেকোনো ইনসিডেন্ট হ্যান্ডেল করা সম্ভব!
      </Line>

      {/* ── Takeaways ─────────────────────────────────────────────────── */}
      <H2 id="takeaway">Production Takeaways</H2>

      <Note>
        <ul>
          <li>
            <strong>Mitigate first, debug later:</strong> ইনসিডেন্টের সময় মূল কোড ফিক্স করতে যাবেন না —
            রোলব্যাক বা ফিচার ফ্ল্যাগ দিয়ে আগে ইউজারদের এরর-মুক্ত করুন।
          </li>
          <li>
            <strong>Build the switch before you need it:</strong> kill-switch, circuit breaker আর
            timeout — এগুলো ইনসিডেন্টের সময় বানানো যায় না, শান্ত সময়ে বানিয়ে রাখতে হয়।
          </li>
          <li>
            <strong>End every incident with a guardrail:</strong> post-mortem-এর অ্যাকশন আইটেম
            &quot;আরও সতর্ক থাকব&quot; হতে পারে না — একটি অ্যালার্ট, একটি টেস্ট বা একটি CI চেক হতে
            হবে।
          </li>
        </ul>
      </Note>
    </article>
  );
}
