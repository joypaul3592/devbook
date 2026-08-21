import {
  CodeBlock,
  Diagram,
  H2,
  H3,
  Line,
  Note,
} from "@/components/learn/DocParts";
import type { Bi } from "@/lib/curriculum";

/** Section anchors — consumed by the "on this page" rail. */
export const headings: { id: string; label: Bi }[] = [
  {
    id: "the-problem",
    label: {
      bn: "প্রতি সেকেন্ডে ৫০০ কল",
      en: "500 calls a second",
    },
  },
  {
    id: "mental-model",
    label: { bn: "Rate Limiting ফ্লো", en: "The rate-limiting flow" },
  },
  {
    id: "setup",
    label: { bn: "এনভায়রনমেন্ট সেটআপ", en: "Environment setup" },
  },
  {
    id: "limiter",
    label: { bn: "Step A — Limiter ইনস্ট্যান্স", en: "Step A — the limiter" },
  },
  {
    id: "action",
    label: { bn: "Step B — Rate Limited অ্যাকশন", en: "Step B — the limited action" },
  },
  {
    id: "form",
    label: { bn: "Step C — কমেন্ট ফর্ম", en: "Step C — the comment form" },
  },
  {
    id: "takeaway",
    label: { bn: "Production Takeaways", en: "Production takeaways" },
  },
];

export default function RateLimiting() {
  return (
    <article className="doc-prose">
      {/* ── The problem ───────────────────────────────────────────────── */}
      <H2 id="the-problem" anchorOnly>
        প্রতি সেকেন্ডে ৫০০ কল
      </H2>

      <p>
        সন্ধ্যা ৭:৪৫। ভুলু ভাই সিকিউরড সার্ভার অ্যাকশন ও ফাইল ভ্যালিডেশন বসিয়ে স্বস্তির
        নিশ্বাস ফেলছিলেন। হঠাৎ ফাহিম সার্ভার লগ দেখিয়ে বলল — &quot;এন্ডপয়েন্ট সিকিউরড ঠিকই,
        কিন্তু কোনো হ্যাকার যদি একটা Bot বানিয়ে প্রতি সেকেন্ডে ৫০০ বার এই অ্যাকশন কল করতে
        থাকে? ডাটাবেস আর সার্ভারের রিসোর্স নিমেষেই নিঃশেষ হয়ে যাবে!&quot;
      </p>

      <Line name="ভুলু ভাই">
        (চিন্তিত হয়ে) হায় হায়! এটাকে তো Brute Force / DDoS Attack বলে! কোনো ইউজার যেন
        নির্দিষ্ট সময়ের মধ্যে লিমিটের চেয়ে বেশি রিকোয়েস্ট না পাঠাতে পারে, সেটা কীভাবে ঠেকাব?
      </Line>

      <Line name="নেক্সট-ভাই">
        (হেসে) এর সমাধান <strong>Rate Limiting</strong>! সার্ভারলেস বা Edge এনভায়রনমেন্টে
        সার্ভার অ্যাকশন রেট-লিমিট করার সেরা উপায় হলো Upstash Redis আর{" "}
        <code>@upstash/ratelimit</code> প্যাকেজ। আজ শিখব Sliding Window Algorithm দিয়ে IP বা
        User ID-এর ভিত্তিতে রিকোয়েস্ট থ্রটল করা।
      </Line>

      {/* ── Mental model ──────────────────────────────────────────────── */}
      <H2 id="mental-model">১. Rate Limiting ফ্লো</H2>

      <Diagram>{`[ Incoming server action call ]
               │
               ▼
┌────────────────────────────────────────────────────────┐
│ 🌐 Extract client IP or user ID                        │
│    (x-forwarded-for, or the auth session token)        │
└────────────────────────────────────────────────────────┘
               │
               ▼
┌────────────────────────────────────────────────────────┐
│ 🔴 Upstash Redis check (sliding window)                │
│    "Has this identifier exceeded 5 requests / 10s?"    │
└────────────────────────────────────────────────────────┘
               │
       ┌───────┴───────┐
       ▼               ▼
 [ 🔴 Exceeded ]   [ 🟢 Allowed ]
       │               │
       │               ▼
       │      ┌──────────────────────────────────┐
       │      │ ⚡ Proceed to the action logic    │
       │      └──────────────────────────────────┘
       ▼
┌────────────────────────────────────────────────────────┐
│ ⛔ Return an error immediately, with a retry window    │
└────────────────────────────────────────────────────────┘`}</Diagram>

      {/* ── Setup ─────────────────────────────────────────────────────── */}
      <H2 id="setup">২. এনভায়রনমেন্ট সেটআপ</H2>

      <CodeBlock label="Bash" filename="install.sh">{`npm install @upstash/ratelimit @upstash/redis`}</CodeBlock>

      <CodeBlock label="dotenv" filename=".env.local">{`UPSTASH_REDIS_REST_URL="https://your-database-name.upstash.io"
UPSTASH_REDIS_REST_TOKEN="your_upstash_rest_token"`}</CodeBlock>

      {/* ── Limiter ───────────────────────────────────────────────────── */}
      <H2 id="limiter">৩. Step A — Limiter ইনস্ট্যান্স</H2>

      <CodeBlock filename="lib/ratelimit.ts">{`import { Redis } from '@upstash/redis';
import { Ratelimit } from '@upstash/ratelimit';

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL!,
  token: process.env.UPSTASH_REDIS_REST_TOKEN!,
});

/** At most 5 requests inside any 10-second window */
export const actionRateLimiter = new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(5, '10 s'),
  analytics: true,
  prefix: '@upstash/ratelimit/action',
});`}</CodeBlock>

      <H3>ক্লায়েন্ট IP এক্সট্র্যাক্টর</H3>

      <CodeBlock filename="lib/get-ip.ts">{`import { headers } from 'next/headers';

export async function getClientIp(): Promise<string> {
  const headersList = await headers();
  const forwardedFor = headersList.get('x-forwarded-for');

  if (forwardedFor) {
    // Behind a proxy or load balancer the first entry is the real client
    return forwardedFor.split(',')[0].trim();
  }

  const realIp = headersList.get('x-real-ip');
  if (realIp) return realIp.trim();

  return '127.0.0.1'; // Local fallback
}`}</CodeBlock>

      {/* ── Action ────────────────────────────────────────────────────── */}
      <H2 id="action">৪. Step B — Rate Limited অ্যাকশন</H2>

      <CodeBlock filename="app/actions/comment-actions.ts">{`'use server';

import { z } from 'zod';
import { actionRateLimiter } from '@/lib/ratelimit';
import { getClientIp } from '@/lib/get-ip';

const commentSchema = z.object({
  comment: z
    .string()
    .trim()
    .min(3, 'কমেন্ট অন্তত ৩ অক্ষরের হতে হবে।')
    .max(200, 'কমেন্ট সর্বোচ্চ ২০০ অক্ষরের হতে পারবে।'),
});

export interface ActionState {
  success: boolean;
  message: string;
  remainingRequests?: number;
}

export async function addCommentAction(
  prevState: ActionState,
  formData: FormData,
): Promise<ActionState> {
  try {
    // 🛡️ Step 1 — identify the caller
    const clientIp = await getClientIp();
    const identifier = \`comment_limit_\${clientIp}\`;

    // 🔴 Step 2 — check the limit in Redis
    const { success, remaining, reset } = await actionRateLimiter.limit(identifier);

    if (!success) {
      const retryAfterSeconds = Math.ceil((reset - Date.now()) / 1000);
      console.warn(\`[RATE LIMIT] \${clientIp} blocked for \${retryAfterSeconds}s\`);

      return {
        success: false,
        message: \`আপনি খুব দ্রুত রিকোয়েস্ট পাঠাচ্ছেন! \${retryAfterSeconds} সেকেন্ড পর চেষ্টা করুন।\`,
        remainingRequests: 0,
      };
    }

    // 🧪 Step 3 — validate
    const validated = commentSchema.safeParse({ comment: formData.get('comment') });
    if (!validated.success) {
      return {
        success: false,
        message: validated.error.issues[0].message,
        remainingRequests: remaining,
      };
    }

    // ⚡ Step 4 — write to the database
    console.log(\`[DB insert] "\${validated.data.comment}" from \${clientIp}\`);

    return {
      success: true,
      message: 'কমেন্ট সফলভাবে পোস্ট করা হয়েছে!',
      remainingRequests: remaining,
    };
  } catch (error) {
    console.error('[COMMENT ACTION ERROR]:', error);
    return { success: false, message: 'সার্ভারে অভ্যন্তরীণ সমস্যা হয়েছে!' };
  }
}`}</CodeBlock>

      {/* ── Form ──────────────────────────────────────────────────────── */}
      <H2 id="form">৫. Step C — কমেন্ট ফর্ম</H2>

      <CodeBlock filename="app/comments/comment-form.tsx">{`'use client';

import { useActionState } from 'react';
import { addCommentAction, type ActionState } from '../actions/comment-actions';

const initialState: ActionState = { success: false, message: '' };

export function CommentForm() {
  const [state, formAction, isPending] = useActionState(addCommentAction, initialState);

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold text-white">কমেন্ট সেকশন</h2>
        {state.remainingRequests !== undefined && (
          <span className="text-xs px-2.5 py-1 rounded-full bg-slate-800 text-blue-400 border border-slate-700">
            বাকি: {state.remainingRequests}টি
          </span>
        )}
      </div>

      <form action={formAction} className="space-y-4">
        <textarea
          name="comment"
          rows={3}
          placeholder="আপনার মতামত লিখুন…"
          className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm resize-none"
        />

        {state.message && (
          <div
            className={state.success
              ? 'p-3 rounded-xl text-xs border bg-emerald-950/40 border-emerald-500/30 text-emerald-300'
              : 'p-3 rounded-xl text-xs border bg-red-950/40 border-red-500/30 text-red-300'}
          >
            {state.message}
          </div>
        )}

        <button
          type="submit"
          disabled={isPending}
          className="w-full py-3 bg-blue-600 hover:bg-blue-500 disabled:bg-slate-800 text-white font-semibold rounded-xl text-sm"
        >
          {isPending ? 'পোস্ট হচ্ছে…' : 'কমেন্ট পোস্ট করুন'}
        </button>
      </form>
    </div>
  );
}`}</CodeBlock>

      <Line name="ভুলু ভাই">
        (স্বস্তির নিশ্বাস ফেলে) দারুণ! এবার কোনো বট ১০ সেকেন্ডে ৫ বারের বেশি কল করলেই Upstash
        Redis তাকে ব্লক করে দেবে, ডাটাবেসের ওপর কোনো বাড়তি চাপ পড়বে না!
      </Line>

      {/* ── Takeaways ─────────────────────────────────────────────────── */}
      <H2 id="takeaway">Production Takeaways</H2>

      <Note>
        <ul>
          <li>
            <strong>Sliding vs Fixed Window:</strong> সবসময়{" "}
            <code>Ratelimit.slidingWindow()</code> ব্যবহার করুন — Fixed Window-তে দুই
            উইন্ডোর সংযোগস্থলে একসাথে দ্বিগুণ রিকোয়েস্ট ঢুকে যেতে পারে।
          </li>
          <li>
            <strong>Identifier Strategy (User ID &gt; IP):</strong> অথেন্টিকেটেড ইউজারে User
            ID ব্যবহার করুন। শুধু পাবলিক অ্যাকশনে IP — কারণ shared IP (NAT/corporate
            network) থাকলে একাধিক প্রকৃত ইউজার একই IP-তে পড়ে যায়।
          </li>
          <li>
            <strong>Edge &amp; Serverless Compatibility:</strong> সার্ভারলেসে ইন-মেমোরি ক্যাশ
            কাজ করে না — Upstash-এর মতো HTTP-ভিত্তিক Redis পারফেক্ট ফিট।
          </li>
          <li>
            <strong>Informative Feedback:</strong> শুধু &quot;Blocked&quot; না বলে{" "}
            <code>reset</code> থেকে হিসাব করে কত সেকেন্ড পর আবার চেষ্টা করা যাবে তা জানিয়ে
            দিন।
          </li>
        </ul>
      </Note>
    </article>
  );
}
