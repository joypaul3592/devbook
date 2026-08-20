import { CodeBlock, Diagram, H2, Line, Note } from "@/components/learn/DocParts";
import type { Bi } from "@/lib/curriculum";

/** Section anchors — consumed by the "on this page" rail. */
export const headings: { id: string; label: Bi }[] = [
  {
    id: "digest-error",
    label: { bn: "এরর মেসেজ গায়েব কেন", en: "Why the error message vanishes" },
  },
  {
    id: "mental-model",
    label: { bn: "Discriminated Union মডেল", en: "The discriminated union model" },
  },
  {
    id: "result-types",
    label: { bn: "১. রেজাল্ট টাইপ", en: "1. The result types" },
  },
  {
    id: "typed-action",
    label: { bn: "২. টাইপড Server Action", en: "2. The typed Server Action" },
  },
  {
    id: "client-narrowing",
    label: { bn: "৩. ক্লায়েন্টে টাইপ ন্যারোয়িং", en: "3. Narrowing on the client" },
  },
  {
    id: "takeaway",
    label: { bn: "Production Takeaways", en: "Production takeaways" },
  },
];

export default function TypedActionResults() {
  return (
    <article className="doc-prose">
      {/* ── Digest error ──────────────────────────────────────────────── */}
      <H2 id="digest-error" anchorOnly>
        এরর মেসেজ গায়েব কেন
      </H2>

      <p>
        রাত ১১টা। ভুলু ভাই চোখ টিপে মনিটরের দিকে তাকিয়ে আছেন। তাঁর অ্যাপের একটা বিশাল
        ফর্মের সাবমিট অ্যাকশনে ডাটাবেজ ডাউন হলে অন-স্ক্রিন কোনো মেসেজ না দেখিয়ে সোজা
        Unhandled Runtime Error স্ক্রিন ভেসে উঠছে!
      </p>

      <Line name="ভুলু ভাই">
        নেক্সট-ভাই! আবার মহা বিপদে পড়েছি! আমি তো Server Action-এর ভেতরে{" "}
        <code>try...catch</code> বসিয়ে{" "}
        <code>throw new Error(&quot;Database Crash&quot;)</code> মারছিলাম। ভেবেছিলাম React
        হয়তো সুন্দর করে ইউজারকে একটা লাল নোটিফিকেশন দেখাবে। কিন্তু ক্লায়েন্ট স্ক্রিনে তো
        সোজা <code>An error occurred in the Server Components render</code> আর প্রোডাকশনে
        শুধু একটা অস্পষ্ট Digest Error ID দেখাচ্ছে! আসল এরর মেসেজ গায়েব হয়ে যাচ্ছে কেন
        ভাই?!
      </Line>

      <Line name="নেক্সট-ভাই">
        (হতাশার ভঙ্গিতে হেসে) ভুলু! Next.js-এর Server Action-এর ভেতর থেকে যদি তুই{" "}
        <code>throw new Error(...)</code> করিস, তবে Next.js সিকিউরিটি প্রোটোকল মেনে
        সার্ভারের অভ্যন্তরীণ সিক্রেট বা সেনসিটিভ ডাটা লিক হওয়া ঠেকাতে সেই এরর মেসেজ মাস্ক
        করে দেয়! প্রোডাকশনে ক্লায়েন্ট শুধু একটা জেনেরিক digest code দেখতে পায়, অরিজিনাল
        মেসেজ পায় না!
      </Line>

      <Line name="ভুলু ভাই">
        (ধাক্কা খেয়ে) বলেন কী ভাই! তাহলে ইউজারের ভুল ইনপুট, ডাটাবেজ এরর, বা বিজনেস লজিক
        এররগুলোকে সুন্দরভাবে ক্লায়েন্টে টাইপ-সেফ উপায়ে পাস করব কীভাবে?!
      </Line>

      <Line name="নেক্সট-ভাই">
        সেজন্যই তোকে <strong>Never Throw Errors for Business Logic</strong> রুল ফলো করতে
        হবে! Server Action থেকে কখনো এক্সপেক্টেড বিজনেস এরর (পাসওয়ার্ড মেলেনি, ইউজার
        পাওয়া যায়নি) throw করতে হয় না — বরং সবসময় একটা{" "}
        <strong>Typed Result Object</strong> রিটার্ন করতে হয়! আর এই প্যাটার্নকে সবচেয়ে
        ক্লিন বানানোর জন্য ব্যবহার করা হয় TypeScript-এর{" "}
        <strong>Discriminated Unions</strong> প্যাটার্ন!
      </Line>

      {/* ── Mental model ──────────────────────────────────────────────── */}
      <H2 id="mental-model">১. Discriminated Union মডেল</H2>

      <Line name="নেক্সট-ভাই">
        কনসেপ্টটা ক্রিস্টাল ক্লিয়ার! তোর Server Action সবসময় একটা অবজেক্ট রিটার্ন করবে যার
        ভেতরে একটা কমন ডিসক্রিমিনেটর ফিল্ড (<code>success: true</code> বা{" "}
        <code>success: false</code>) থাকবে। TypeScript ওটার ওপর ভিত্তি করে অটোমেটিক ন্যারো
        করে বলে দেবে কখন এরর অবজেক্ট আছে আর কখন ডাটা।
      </Line>

      <Diagram>{`                    [Server Action Execution]
                               │
               ┌───────────────┴───────────────┐
               ▼                               ▼
       { success: true }              { success: false }
               │                               │
               ▼                               ▼
    Returns payload data            Returns typed error object
 (e.g. { data: UserProfile })    (e.g. { error: "Invalid OTP" })`}</Diagram>

      {/* ── Result types ──────────────────────────────────────────────── */}
      <H2 id="result-types">২. রেজাল্ট টাইপ</H2>

      <Line name="নেক্সট-ভাই">
        প্রথমে পুরো প্রজেক্টের জন্য একটা ইউনিভার্সাল অ্যাকশন রেজাল্ট টাইপ ডিফাইন করে নে:
      </Line>

      <CodeBlock filename="types/action-result.ts">{`// 1. Success variant
export type ActionSuccess<T> = {
  success: true;
  data: T;
  message?: string;
};

// 2. Failure variant (supports both a global error and field-specific Zod errors)
export type ActionError<E = Record<string, string[]>> = {
  success: false;
  error: string;   // Global error message (e.g. "Unauthorized")
  fieldErrors?: E; // Zod validation errors (e.g. { email: ["Invalid email"] })
  statusCode?: number;
};

// 3. The discriminated union
export type ActionResult<T, E = Record<string, string[]>> =
  | ActionSuccess<T>
  | ActionError<E>;`}</CodeBlock>

      {/* ── Typed action ──────────────────────────────────────────────── */}
      <H2 id="typed-action">৩. টাইপড Server Action</H2>

      <Line name="নেক্সট-ভাই">
        এবার অ্যাকশনের ভেতরে <code>try...catch</code>-এর ভেতর কখনোই throw করবি না, বরং
        কাস্টম <code>ActionError</code> অবজেক্ট রিটার্ন করবি:
      </Line>

      <CodeBlock filename="app/actions.ts">{`'use server'

import { z } from 'zod';
import { ActionResult } from '@/types/action-result';

const TransferSchema = z.object({
  recipientId: z.string().min(1, 'প্রাপকের আইডি দিন!'),
  amount: z.number().positive('পরিমাণ অবশ্যই ০-এর বেশি হতে হবে!'),
});

type TransferData = {
  transactionId: string;
  newBalance: number;
};

export async function transferMoney(
  formData: FormData
): Promise<ActionResult<TransferData>> {
  // 1. Validate input with Zod
  const validated = TransferSchema.safeParse({
    recipientId: formData.get('recipientId'),
    amount: Number(formData.get('amount')),
  });

  if (!validated.success) {
    // Return structured field errors — no throwing!
    return {
      success: false,
      error: 'ইনপুট ভ্যালিডেশন ব্যর্থ হয়েছে!',
      fieldErrors: validated.error.flatten().fieldErrors,
      statusCode: 400,
    };
  }

  try {
    const { recipientId, amount } = validated.data;

    // 2. Business logic checks
    const balance = await getBalanceForCurrentUser();
    if (amount > balance) {
      return {
        success: false,
        error: 'আপনার অ্যাকাউন্টে পর্যাপ্ত ব্যালেন্স নেই!',
        statusCode: 422,
      };
    }

    const result = await db.transaction.create({ recipientId, amount });

    // ⚡ Typed success result
    return {
      success: true,
      data: { transactionId: result.id, newBalance: balance - amount },
      message: 'টাকা সফলভাবে পাঠানো হয়েছে!',
    };
  } catch (err) {
    // 3. Catch unexpected infrastructure crashes (e.g. DB down)
    console.error('Database Error:', err);
    return {
      success: false,
      error: 'সার্ভারে অভ্যন্তরীণ সমস্যা হয়েছে! একটু পর আবার চেষ্টা করুন।',
      statusCode: 500,
    };
  }
}`}</CodeBlock>

      <Note>
        <p>
          একটা ব্যতিক্রম মনে রাখ: <code>redirect()</code> আর <code>notFound()</code>{" "}
          ভেতরে ভেতরে একটা স্পেশাল এরর throw করে কাজ করে। ওগুলো{" "}
          <code>try...catch</code>-এর ভেতরে রাখলে তোর নিজের catch ব্লক ওটা ধরে ফেলে
          নেভিগেশন ভেঙে দেবে — তাই সবসময় <code>try</code> ব্লকের বাইরে ডাক।
        </p>
      </Note>

      {/* ── Client narrowing ──────────────────────────────────────────── */}
      <H2 id="client-narrowing">৪. ক্লায়েন্টে টাইপ ন্যারোয়িং</H2>

      <Line name="নেক্সট-ভাই">
        এবার দেখ TypeScript কীভাবে ক্লায়েন্ট সাইডে অটোমেটিক টাইপ ন্যারো করে:
      </Line>

      <CodeBlock filename="app/transfer-form.tsx">{`'use client'

import { useState } from 'react';
import { transferMoney } from '@/app/actions';

export function TransferForm() {
  const [loading, setLoading] = useState(false);
  const [feedback, setFeedback] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setFeedback(null);

    const formData = new FormData(e.currentTarget);
    const result = await transferMoney(formData);

    setLoading(false);

    // ⚡ Type narrowing with discriminated unions!
    if (result.success) {
      // TypeScript knows result.data exists here
      setFeedback('সফল! ট্রানজেকশন আইডি: ' + result.data.transactionId);
    } else {
      // TypeScript knows result.error and result.fieldErrors exist here
      setFeedback('এরর: ' + result.error);
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      {feedback && <div>{feedback}</div>}

      <input type="text" name="recipientId" placeholder="User ID" />
      <input type="number" name="amount" placeholder="Amount" />

      <button type="submit" disabled={loading}>
        {loading ? 'প্রসেসিং...' : 'পাঠান'}
      </button>
    </form>
  );
}`}</CodeBlock>

      <Line name="ভুলু ভাই">(এক দীর্ঘ স্বস্তির নিশ্বাস ফেললেন) আহা নেক্সট-ভাই!</Line>

      <ul>
        <li>
          <code>throw new Error()</code> মারা বন্ধ করায় প্রোডাকশনের বিশ্রী digest error
          স্ক্রিন আর আসছে না!
        </li>
        <li>
          <code>success: true | false</code> দিয়ে discriminated union বানানোয় TypeScript
          নিজেই ক্লায়েন্ট সাইডে <code>result.data</code> আর <code>result.error</code>{" "}
          আলাদা করে চিনতে পারছে!
        </li>
        <li>
          Zod-এর ইনপুট এরর, বিজনেস লজিকের ব্যালেন্স এরর, আর ডাটাবেজ ক্র্যাশ — তিনটাই একই
          টাইপ-সেফ স্ট্রাকচারে হ্যান্ডেল হচ্ছে!
        </li>
      </ul>

      <Line name="নেক্সট-ভাই">
        একদম বিঙ্গো! প্রোডাকশন-গ্রেড এন্টারপ্রাইজ সিস্টেমে এটাই একমাত্র রেকমেন্ডেড
        Predictable Action Result Pattern!
      </Line>

      {/* ── Takeaway ──────────────────────────────────────────────────── */}
      <H2 id="takeaway">💡 Production Engineering Takeaways</H2>

      <ul>
        <li>
          <strong>No Thrown Errors for Business Logic:</strong> Server Action-এর ভেতর থেকে
          এক্সপেক্টেড বিজনেস সমস্যার জন্য <code>throw</code> ব্যবহার করা যাবে না; কারণ তা
          প্রোডাকশনে মাস্কিংয়ের দরুন অস্পষ্ট digest ID-তে রূপান্তরিত হয়।
        </li>
        <li>
          <strong>Discriminated Union Standard:</strong> <code>ActionResult&lt;T&gt;</code>{" "}
          টাইপে <code>success</code> বুলিয়ান ডিসক্রিমিনেটর ব্যবহার করলে ক্লায়েন্টে শতভাগ
          টাইপ-সেফ ন্যারোয়িং পাওয়া যায়।
        </li>
        <li>
          <strong>Centralized Field &amp; Global Errors:</strong> নির্ভরযোগ্য অ্যাকশন
          প্যাটার্নে গ্লোবাল এরর মেসেজ (<code>error</code>) আর ইনপুট ফিল্ড এরর (
          <code>fieldErrors</code>) জোড়ায় জোড়ায় রিটার্ন করা আবশ্যক।
        </li>
      </ul>
    </article>
  );
}
