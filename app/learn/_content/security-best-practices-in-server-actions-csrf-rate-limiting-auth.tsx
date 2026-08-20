import { CodeBlock, Diagram, H2, Line, Note } from "@/components/learn/DocParts";
import type { Bi } from "@/lib/curriculum";

/** Section anchors — consumed by the "on this page" rail. */
export const headings: { id: string; label: Bi }[] = [
  {
    id: "postman-attack",
    label: { bn: "Postman থেকেই রোল বদল", en: "Changing roles from Postman" },
  },
  {
    id: "defense-in-depth",
    label: { bn: "তিন লেয়ারের ডিফেন্স", en: "Defense in depth" },
  },
  {
    id: "csrf",
    label: { bn: "লেয়ার ১ — CSRF ও Origin", en: "Layer 1 — CSRF and Origin" },
  },
  {
    id: "rate-limiting",
    label: { bn: "লেয়ার ২ — Rate Limiting", en: "Layer 2 — Rate limiting" },
  },
  {
    id: "authorization",
    label: { bn: "লেয়ার ৩ — Authorization", en: "Layer 3 — Authorization" },
  },
  {
    id: "takeaway",
    label: { bn: "Production Takeaways", en: "Production takeaways" },
  },
];

export default function ServerActionSecurityPractices() {
  return (
    <article className="doc-prose">
      {/* ── Postman attack ────────────────────────────────────────────── */}
      <H2 id="postman-attack" anchorOnly>
        Postman থেকেই রোল বদল
      </H2>

      <p>
        রাত ১২টা। ভুলু ভাই ল্যাপটপের মনিটরে বোকার মতো চেয়ে আছেন! তিনি হঠাৎ খেয়াল করলেন
        Postman অ্যাপ থেকে যে কেউ তাঁর সাইটের Server Action-এ একটা কাস্টম POST রিকোয়েস্ট
        মেরে ডাটাবেজের যেকোনো ইউজারের রোল পরিবর্তন করে ফেলতে পারছে!
      </p>

      <Line name="ভুলু ভাই">
        (ঘেমে-নেয়ে অস্থির হয়ে) নেক্সট-ভাই! সর্বনাশ হয়ে গেছে! আমি ভেবেছিলাম Server Action
        তো কোনো পাবলিক API রুট না, এটা তো একটা সাধারণ JavaScript ফাংশন! কিন্তু এখন দেখছি
        Postman বা cURL দিয়ে আমার Server Action এন্ডপয়েন্টে যে কেউ বাইরে থেকে রিকোয়েস্ট
        পাঠাতে পারছে! কোনো অথেনটিকেশন চেক নেই, কোনো রেট লিমিটিং নেই!
      </Line>

      <Line name="নেক্সট-ভাই">
        (গম্ভীর গলায়) ভুলু! এই ভুলটা ৯৯% নতুন Next.js ডেভেলপার করে! সর্বদা একটা গোল্ডেন
        রুল মনে রাখবি: Server Action হলো ব্যাকএন্ডে ঝুলে থাকা একটা{" "}
        <strong>Publicly Accessible HTTP POST Endpoint</strong>! তুই যখন কোনো অ্যাকশনের
        ওপরে <code>&apos;use server&apos;</code> লিখিস, Next.js ব্যাকগ্রাউন্ডে সেটার জন্য
        একটা ইউনিক Action ID জেনারেট করে দেয়। যে কেউ সেই ID পেলে cURL, Postman বা কাস্টম
        স্ক্রিপ্ট দিয়ে সরাসরি তোর সার্ভারে হিট মারতে পারে!
      </Line>

      {/* ── Defense in depth ──────────────────────────────────────────── */}
      <H2 id="defense-in-depth">১. তিন লেয়ারের ডিফেন্স</H2>

      <Diagram>{`[Incoming HTTP POST Request]
             │
             ▼
┌───────────────────────────┐
│  1. Built-in CSRF check   │  ◄── Next.js Origin & Host header matching
└────────────┬──────────────┘
             ▼
┌───────────────────────────┐
│    2. Rate limiting       │  ◄── IP / user-based throttle (Upstash, Redis)
└────────────┬──────────────┘
             ▼
┌───────────────────────────┐
│ 3. Strict authorization   │  ◄── Session & permission verification
└────────────┬──────────────┘
             ▼
   [Execute business logic]`}</Diagram>

      {/* ── CSRF ──────────────────────────────────────────────────────── */}
      <H2 id="csrf">২. লেয়ার ১ — CSRF ও Origin ভ্যালিডেশন</H2>

      <Line name="নেক্সট-ভাই">
        প্রথম সুসংবাদ হলো — Next.js স্বয়ংক্রিয়ভাবে Server Action-এর জন্য CSRF
        (Cross-Site Request Forgery) প্রোটেকশন হ্যান্ডেল করে। যখন কোনো Server Action
        এক্সিকিউট হয়, Next.js রিকোয়েস্টের <code>Origin</code> আর <code>Host</code> হেডার
        মিলিয়ে দেখে যে রিকোয়েস্টটা তোর নিজের ডোমেইন থেকেই এসেছে নাকি অন্য কোনো ক্ষতিকর
        ডোমেইন থেকে। না মিললে Next.js রিকোয়েস্টটা তৎক্ষণাৎ ব্লক করে দেয়।
      </Line>

      <Note>
        <p>
          কিন্তু এই গার্ডটা শুধু <em>ব্রাউজার</em> থেকে আসা ক্রস-সাইট রিকোয়েস্ট আটকায়।
          cURL বা Postman তো নিজেই যেকোনো <code>Origin</code> হেডার বসিয়ে দিতে পারে — তাই
          CSRF প্রোটেকশনকে কখনোই অথরাইজেশনের বিকল্প ভাবা যাবে না। লেয়ার ৩-ই আসল দেয়াল।
        </p>
      </Note>

      {/* ── Rate limiting ─────────────────────────────────────────────── */}
      <H2 id="rate-limiting">৩. লেয়ার ২ — Rate Limiting</H2>

      <Line name="ভুলু ভাই">
        ভাই, কিন্তু আমার পাবলিক ফর্মগুলোতে (লগইন বা পাসওয়ার্ড রিসেট অ্যাকশন) হ্যাকাররা
        স্ক্রিপ্ট চালিয়ে সেকেন্ডে ১০০০ বার হিট মেরে সার্ভার ডাউন বা brute force অ্যাটাক
        করতে পারে! সেটা কীভাবে ঠেকাব?
      </Line>

      <Line name="নেক্সট-ভাই">
        সেখানে প্রয়োগ করতে হবে <strong>Rate Limiting</strong>! প্রতিটা IP বা ইউজারের জন্য
        টাইম-উইন্ডো মেপে রিকোয়েস্ট লিমিট বসাতে হবে:
      </Line>

      <CodeBlock filename="app/actions/auth.ts">{`'use server'

import { headers } from 'next/headers';
import { Ratelimit } from '@upstash/ratelimit';
import { Redis } from '@upstash/redis';
import { ActionResult } from '@/types/action-result';

// 5 requests per 10 seconds, per IP
const ratelimit = new Ratelimit({
  redis: Redis.fromEnv(),
  limiter: Ratelimit.slidingWindow(5, '10 s'),
});

export async function loginAction(
  formData: FormData
): Promise<ActionResult<{ userId: string }>> {
  // ⚡ 1. Extract the client IP
  const headerList = await headers();
  const ip = headerList.get('x-forwarded-for') ?? '127.0.0.1';

  // ⚡ 2. Check the rate limit
  const { success } = await ratelimit.limit(\`login_limit_\${ip}\`);

  if (!success) {
    return {
      success: false,
      error: 'অনেক বেশি চেষ্টা করা হয়েছে! অনুগ্রহ করে ১০ সেকেন্ড পর আবার চেষ্টা করুন।',
      statusCode: 429,
    };
  }

  // Actual login logic below…
  return { success: true, data: { userId: 'usr_123' } };
}`}</CodeBlock>

      {/* ── Authorization ─────────────────────────────────────────────── */}
      <H2 id="authorization">৪. লেয়ার ৩ — Authorization ও Input Validation</H2>

      <Line name="ভুলু ভাই">
        আর তিন নম্বর লেয়ার — অথেনটিকেশন আর অথরাইজেশন কীভাবে হ্যান্ডেল করব?
      </Line>

      <Line name="নেক্সট-ভাই">
        কখনো ক্লায়েন্ট থেকে আসা <code>userId</code> বা <code>role</code>-কে অন্ধের মতো
        বিশ্বাস করবি না! ক্লায়েন্ট থেকে শুধু ইনপুট ফিল্ডের ডাটা নিবি, আর ইউজারের আইডেন্টিটি
        ও পারমিশন সবসময় Server Action-এর একদম প্রথম লাইনে সেশন থেকে ভেরিফাই করবি!
      </Line>

      <CodeBlock filename="app/actions/admin.ts">{`'use server'

import { auth } from '@/lib/auth';
import { z } from 'zod';
import { ActionResult } from '@/types/action-result';

const DeleteUserSchema = z.object({ targetUserId: z.string().min(1) });

export async function deleteUserAccount(
  formData: FormData
): Promise<ActionResult<{ deletedId: string }>> {
  // ⚡ 1. ALWAYS verify the session inside the action
  const session = await auth();

  if (!session?.user) {
    return {
      success: false,
      error: 'অননুমোদিত অ্যাক্সেস! অনুগ্রহ করে লগইন করুন।',
      statusCode: 401,
    };
  }

  // ⚡ 2. Role-based access control (RBAC)
  if (session.user.role !== 'ADMIN') {
    return {
      success: false,
      error: 'এই কাজটি করার জন্য আপনার অ্যাডমিন অনুমতি নেই!',
      statusCode: 403,
    };
  }

  // ⚡ 3. Strict input validation via Zod
  const validated = DeleteUserSchema.safeParse({
    targetUserId: formData.get('targetUserId'),
  });

  if (!validated.success) {
    return {
      success: false,
      error: 'ইনপুট ভ্যালিডেশন ব্যর্থ হয়েছে!',
      fieldErrors: validated.error.flatten().fieldErrors,
    };
  }

  // ⚡ 4. Safe execution
  await db.user.delete({ where: { id: validated.data.targetUserId } });

  return {
    success: true,
    data: { deletedId: validated.data.targetUserId },
    message: 'ইউজার অ্যাকাউন্ট সফলভাবে ডিলিট করা হয়েছে।',
  };
}`}</CodeBlock>

      <Line name="ভুলু ভাই">
        (নিঃশ্বাস ছেড়ে) আহ! এবার সিকিউরিটির ছবিটা একদম ক্লিয়ার নেক্সট-ভাই!
      </Line>

      <ul>
        <li>Next.js নেটিভভাবে Origin হেডার চেক করে ব্রাউজার-বেসড CSRF অ্যাটাক ব্লক করে।</li>
        <li>পাবলিক ফর্মে rate limiting বসালে brute force থামানো যায়।</li>
        <li>
          আর সার্ভার অ্যাকশনের প্রথম লাইনেই সেশন ভেরিফাই করে{" "}
          <code>role === &apos;ADMIN&apos;</code> চেক করলে হ্যাকাররা Postman দিয়ে হিট
          মারলেও কোনো ক্ষতি করতে পারবে না!
        </li>
      </ul>

      <Line name="নেক্সট-ভাই">
        সাবাশ ভুলু! মনে রাখবি — <strong>&quot;Never Trust the Client&quot;</strong>, এই
        একটা নীতি মেনে চললে তোর সার্ভার অ্যাকশন আর্কিটেকচার হবে বুলেটপ্রুফ!
      </Line>

      {/* ── Takeaway ──────────────────────────────────────────────────── */}
      <H2 id="takeaway">💡 Production Engineering Takeaways</H2>

      <ul>
        <li>
          <strong>Public Endpoint Mindset:</strong> প্রতিটা Server Action-কে একটা পাবলিক
          HTTP POST এন্ডপয়েন্ট হিসেবে গণ্য করতে হবে এবং সার্ভার-সাইড সিকিউরিটি বাউন্ডারি
          বজায় রাখতে হবে।
        </li>
        <li>
          <strong>Inline Authorization:</strong> ক্লায়েন্ট থেকে পাঠানো আইডি বা রোল বিশ্বাস
          না করে অ্যাকশনের ভেতরেই <code>auth()</code> ডেকে সেশন ও পারমিশন ভ্যালিডেশন করা
          বাধ্যতামূলক।
        </li>
        <li>
          <strong>Rate Limiting Protection:</strong> সেনসিটিভ বা পাবলিক অ্যাকশনে brute
          force ও DoS রোধে IP বা ইউজার-ভিত্তিক rate limiter ইন্টিগ্রেট করা ইন্ডাস্ট্রি
          স্ট্যান্ডার্ড।
        </li>
      </ul>
    </article>
  );
}
