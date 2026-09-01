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
      bn: "ব্যালেন্স কম, তাই অ্যাপ ক্র্যাশ",
      en: "Low balance, crashed app",
    },
  },
  {
    id: "architecture",
    label: {
      bn: "Error classification ফ্লো",
      en: "The error classification flow",
    },
  },
  {
    id: "mechanisms",
    label: { bn: "৩টি আর্কিটেকচারাল কনসেপ্ট", en: "Three architectural concepts" },
  },
  {
    id: "implementation",
    label: {
      bn: "Discriminated union কনট্র্যাক্ট",
      en: "The discriminated union contract",
    },
  },
  {
    id: "matrix",
    label: { bn: "Expected vs Unexpected", en: "Expected vs unexpected" },
  },
  {
    id: "takeaway",
    label: { bn: "Production Takeaways", en: "Production takeaways" },
  },
];

export default function ExpectedVsUnexpectedErrors() {
  return (
    <article className="doc-prose">
      {/* ── The problem ───────────────────────────────────────────────── */}
      <H2 id="the-problem" anchorOnly>
        ব্যালেন্স কম, তাই অ্যাপ ক্র্যাশ
      </H2>

      <p>
        সন্ধ্যা ৬:৪৫। ভুলু ভাই ডিজিটাল ওয়ালেটের একটি পেমেন্ট ফিচার ডেভেলপ করছিলেন। টেস্ট করার সময়
        ইউজার অ্যাকাউন্টে পর্যাপ্ত ব্যালেন্স না থাকায় অ্যাপটি সরাসরি ক্র্যাশ করে <code>error.tsx</code>{" "}
        পেজে চলে গেল এবং স্ক্রিনে একটি লাল ৫০০ সার্ভার এরর ভেসে উঠলো!
      </p>

      <Line name="ভুলু ভাই">
        ফাহিম! ইউজারের ওয়ালেটে টাকা কম থাকাটা তো খুব স্বাভাবিক একটা ঘটনা! এর জন্য পুরো অ্যাপ ক্র্যাশ
        করে <code>error.tsx</code> পেজে চলে গেল কেন? ইউজার তো ভয় পেয়ে অ্যাপ বন্ধ করে দেবে!
      </Line>

      <Line name="ফাহিম">
        ভুলু ভাই! কারণ আপনি পর্যাপ্ত টাকা না থাকাকে একটি unexpected system exception হিসেবে ধরে{" "}
        <code>throw new Error(&quot;Insufficient Funds&quot;)</code> করেছেন! ফলে Next.js এটাকে
        আনহ্যান্ডেলড সিস্টেম ক্র্যাশ ভেবে সেন্ট্রাল এরর বাউন্ডারিতে পাঠিয়ে দিয়েছে।
      </Line>

      <Line name="নেক্সট-ভাই">
        একদম! অ্যাপ্লিকেশনের এররগুলোকে দুটি ভাগে ভাগ করতে হয় — expected (operational/business) errors
        আর unexpected (bugs/crashes)। Expected error কখনো throw না করে নরমাল কন্ট্রোল ফ্লো দিয়ে
        UI-তে রিটার্ন করতে হয়, আর unexpected error ক্যাচ করতে হয় <code>error.tsx</code> ও monitoring
        টুল দিয়ে!
      </Line>

      {/* ── Architecture ──────────────────────────────────────────────── */}
      <H2 id="architecture">১. Error Classification &amp; Decision Flow</H2>

      <Diagram>{`┌─────────────────────────────────────────────────────────────────────────────┐
│                   EXPECTED VS UNEXPECTED ERROR FLOW                         │
└─────────────────────────────────────────────────────────────────────────────┘

                          an error occurs
                                    │
                  ┌─────────────────┴─────────────────┐
                  ▼                                   ▼
        expected (business/logic)           unexpected (system/bug)
        ─────────────────────────           ───────────────────────
        • insufficient balance              • TypeError: cannot read null
        • invalid password                  • database timeout / network down
        • item out of stock                 • memory leak / server crash
                  │                                   │
                  ▼                                   ▼
        DO NOT throw                        DO throw
        return a result object              caught by the error.tsx boundary
        { success: false, code: … }         reported to Sentry / telemetry
                  │                                   │
                  ▼                                   ▼
        🟢 friendly toast or inline         🟢 generic fallback UI
           message; the user stays             (stack trace never shown)
           on the page`}</Diagram>

      {/* ── Mechanisms ────────────────────────────────────────────────── */}
      <H2 id="mechanisms">২. কোর আর্কিটেকচারাল কনসেপ্ট</H2>

      <p>
        <strong>Expected errors (operational / domain):</strong> যেসব ত্রুটি ব্যবসার লজিক বা ইউজারের
        স্বাভাবিক ভুলের অংশ — ভুল পাসওয়ার্ড, ওয়ালেটে টাকা না থাকা, স্টক শেষ হয়ে যাওয়া। এগুলো কোনো কোড
        বাগ নয়, তাই throw করা যাবে না; টাইপ-সেফ অবজেক্ট হিসেবে ক্লায়েন্টে পাঠিয়ে ফ্রেন্ডলি মেসেজ
        দেখাতে হয়।
      </p>

      <p>
        <strong>Unexpected errors (runtime bugs / crashes):</strong> যেগুলো আগে থেকে অনুমান করা যায়
        না — <code>TypeError</code>, ডাটাবেস কানেকশন লস, মেমোরি ওভারফ্লো। এগুলো try-catch দিয়ে ধরে
        সেন্ট্রাল বাউন্ডারিতে ঠেলে দিতে হয় এবং Sentry-তে ইমার্জেন্সি রিপোর্ট পাঠাতে হয়।
      </p>

      <p>
        <strong>Discriminated union contract:</strong> Server Action বা API রেসপন্সে discriminated
        union (
        <code>
          &#123; success: true, data &#125; | &#123; success: false, error &#125;
        </code>
        ) ব্যবহার করলে TypeScript ক্লায়েন্টকে expected error হ্যান্ডেল করতে বাধ্য করে — ভুলে যাওয়ার
        সুযোগই থাকে না।
      </p>

      {/* ── Implementation ────────────────────────────────────────────── */}
      <H2 id="implementation">৩. Production Code Implementation</H2>

      <H3>❌ Anti-pattern — throwing for expected domain logic</H3>

      <CodeBlock filename="actions/payment.ts">{`// 🔴 POOR PRACTICE: an exception for a business validation failure
// this triggers error.tsx, unmounts the page, and frightens the user

'use server';

export async function processPaymentBad(amount: number) {
  const userBalance = 500;

  if (amount > userBalance) {
    // ❌ treats a completely normal situation as a system crash
    throw new Error('Insufficient balance in wallet');
  }

  // process the transaction…
}`}</CodeBlock>

      <H3>🟢 Production pattern — a discriminated union plus a catch-all guard</H3>

      <p>
        <strong>Step 1 — টাইপড পেমেন্ট অ্যাকশন।</strong>
      </p>

      <CodeBlock filename="actions/payment.ts">{`// 🟢 PRODUCTION PATTERN: expected and unexpected errors, cleanly separated
'use server';

export type PaymentResult =
  | { success: true; transactionId: string; newBalance: number }
  | {
      success: false;
      isExpected: true;
      code: 'INSUFFICIENT_FUNDS' | 'ACCOUNT_LOCKED';
      message: string;
    }
  | { success: false; isExpected: false; message: string };

export async function processPaymentAction(amount: number): Promise<PaymentResult> {
  try {
    const userBalance = 500;
    const isAccountActive = true;

    // 1. 🟢 expected error — a locked account
    if (!isAccountActive) {
      return {
        success: false,
        isExpected: true,
        code: 'ACCOUNT_LOCKED',
        message: 'আপনার অ্যাকাউন্টটি স্থগিত রয়েছে। সাপোর্ট টিমে যোগাযোগ করুন।',
      };
    }

    // 2. 🟢 expected error — not enough money
    if (amount > userBalance) {
      return {
        success: false,
        isExpected: true,
        code: 'INSUFFICIENT_FUNDS',
        message: 'আপনার ওয়ালেটে পর্যাপ্ত ব্যালেন্স নেই। রিচার্জ করুন।',
      };
    }

    return {
      success: true,
      transactionId: 'TXN-998123',
      newBalance: userBalance - amount,
    };
  } catch (error) {
    // 3. 🟢 unexpected — a real bug or an outage. Log it, then degrade politely.
    console.error('CRITICAL: payment system failure:', error);

    return {
      success: false,
      isExpected: false,
      message: 'পেমেন্ট গেটওয়েতে কারিগরি ত্রুটি ঘটেছে। অনুগ্রহ করে পরে চেষ্টা করুন।',
    };
  }
}`}</CodeBlock>

      <p>
        <strong>Step 2 — ক্লায়েন্টে গ্রেসফুল হ্যান্ডলিং।</strong>
      </p>

      <CodeBlock filename="components/PaymentButton.tsx">{`// 🟢 PRODUCTION PATTERN: expected errors handled inline, no page crash
'use client';

import { useState } from 'react';
import { processPaymentAction } from '@/actions/payment';

export function PaymentButton({ amount }: { amount: number }) {
  const [loading, setLoading] = useState(false);
  const [feedback, setFeedback] = useState<
    { type: 'success' | 'error'; message: string } | null
  >(null);

  const handlePayment = async () => {
    setLoading(true);
    setFeedback(null);

    const result = await processPaymentAction(amount);
    setLoading(false);

    // 🟢 the union makes both branches impossible to forget
    if (result.success) {
      setFeedback({
        type: 'success',
        message: \`পেমেন্ট সফল! ট্রানজেকশন আইডি: \${result.transactionId}\`,
      });
    } else {
      setFeedback({ type: 'error', message: result.message });
    }
  };

  return (
    <div className="space-y-4">
      <button
        onClick={handlePayment}
        disabled={loading}
        className="px-6 py-2.5 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50"
      >
        {loading ? 'প্রসেসিং...' : \`৳\${amount} পেমেন্ট করুন\`}
      </button>

      {feedback && (
        <div
          className={\`p-3 rounded-lg text-sm font-medium \${
            feedback.type === 'success'
              ? 'bg-green-100 text-green-800'
              : 'bg-amber-100 text-amber-800'
          }\`}
        >
          {feedback.message}
        </div>
      )}
    </div>
  );
}`}</CodeBlock>

      {/* ── Matrix ────────────────────────────────────────────────────── */}
      <H2 id="matrix">৪. Expected vs Unexpected Errors</H2>

      <Table
        head={["বৈশিষ্ট্য", "Expected errors", "Unexpected errors"]}
        rows={[
          [
            "প্রকৃতি",
            "বিজনেস লজিক বা ইউজারের ইনপুট ভুল",
            "কোডের বাগ, টাইপ এরর, ডাটাবেস ডাউন",
          ],
          [
            "হ্যান্ডলিং",
            "result object রিটার্ন (discriminated union)",
            "throw করে error.tsx-এ ক্যাচ",
          ],
          [
            "UI রেসপন্স",
            "ইনলাইন টেক্সট, টোস্ট বা ডায়ালগ 🟢",
            "সেন্ট্রাল ফলব্যাক এরর কম্পোনেন্ট 🟡",
          ],
          [
            "লগিং",
            "সাধারণ মেট্রিক হিসেবে ট্র্যাক",
            "high-priority alert (Sentry) 🔴",
          ],
          [
            "ইউজার এক্সপেরিয়েন্স",
            "পেজেই থাকে, ভুল শুধরে নিতে পারে 🟢",
            "একটা সেকশন হারায়, বাকিটা টিকে থাকে",
          ],
        ]}
      />

      <Line name="ভুলু ভাই">
        চমৎকার ফাহিম! এখন বুঝতে পেরেছি — ওয়ালেটে টাকা না থাকা কোনো বাগ নয়, ওটা expected error! তাই
        ওটাকে throw না করে রেসপন্স অবজেক্টে পাঠালে পেজ ক্র্যাশ না করে সহজেই ইউজারকে সুন্দর ওয়ার্নিং
        দেখানো যায়।
      </Line>

      {/* ── Takeaways ─────────────────────────────────────────────────── */}
      <H2 id="takeaway">Production Takeaways</H2>

      <Note>
        <ul>
          <li>
            <strong>Do not throw for flow control:</strong> ভ্যালিডেশন ফেল বা বিজনেস রুলের মতো পরিচিত
            ঘটনায় exception throw করবেন না — এটি ক্যাসকেডিং ক্র্যাশ ঘটায় এবং মনিটরিং অ্যালার্টকে
            অর্থহীন করে দেয়।
          </li>
          <li>
            <strong>Use discriminated unions:</strong> Server Action থেকে সবসময়{" "}
            <code>&#123; success: boolean &#125;</code> কনট্র্যাক্ট মেনে অবজেক্ট রিটার্ন করুন — টাইপ
            চেকারই ক্লায়েন্টকে দুই ব্রাঞ্চ হ্যান্ডেল করতে বাধ্য করবে।
          </li>
          <li>
            <strong>Alert only on unexpected failures:</strong> Sentry-তে শুধু unexpected crash-এর
            জন্য নোটিফিকেশন সেট করুন, নাহলে অ্যালার্ট স্প্যামে আসল সমস্যা চাপা পড়ে যায়।
          </li>
        </ul>
      </Note>
    </article>
  );
}
