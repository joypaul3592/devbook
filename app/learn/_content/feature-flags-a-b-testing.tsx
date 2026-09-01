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
      bn: "এক বাগ, পুরো ভার্সন রোলব্যাক",
      en: "One bug, a whole rollback",
    },
  },
  {
    id: "architecture",
    label: {
      bn: "Edge-এ ভ্যারিয়েন্ট নির্ধারণ",
      en: "Deciding the variant at the edge",
    },
  },
  {
    id: "mechanisms",
    label: {
      bn: "৪টি কোর রুল",
      en: "Four core rules",
    },
  },
  {
    id: "implementation",
    label: {
      bn: "Middleware bucketing ও server render",
      en: "Middleware bucketing & server render",
    },
  },
  {
    id: "matrix",
    label: { bn: "Flag, canary, A/B, kill switch", en: "Flags, canaries, A/B" },
  },
  {
    id: "takeaway",
    label: { bn: "Production Takeaways", en: "Production takeaways" },
  },
];

export default function FeatureFlagsAbTesting() {
  return (
    <article className="doc-prose">
      {/* ── The problem ───────────────────────────────────────────────── */}
      <H2 id="the-problem" anchorOnly>
        এক বাগ, পুরো ভার্সন রোলব্যাক
      </H2>

      <p>
        দুপুর ২:১৫। নতুন &ldquo;লাইভ ম্যাচ উইজেট&rdquo; প্রোডাকশনে দেওয়ার ১৫ মিনিটের মাথায় দেখা গেল
        কিছু ব্রাউজারে পুরো পেজ ক্র্যাশ করছে। তাড়াহুড়ো করে রোলব্যাক করতে গিয়ে পাইপলাইন আটকে গেছে।
        ওদিকে মার্কেটিং টিম চিৎকার করছে — তাদের A/B টেস্ট চালু হওয়ার পর ইউজারের চোখের সামনে লেআউট লাফ
        দিয়ে বদলে যাচ্ছে।
      </p>

      <Line name="ভুলু ভাই">
        ফাহিম! নতুন ফিচার সব ইউজারের জন্য একসাথে লাইভ করা যে এত বড় ঝুঁকি, আজ হাড়ে হাড়ে টের পাচ্ছি!
        আর <code>useEffect</code>-এ A/B টেস্টের কন্ডিশন চেক করায় পেজ লোডের সময় ভ্যারিয়েন্ট হুট করে
        বদলে যাচ্ছে — ইউজাররা বিরক্ত হয়ে চলে যাচ্ছেন।
      </Line>

      <Line name="ফাহিম">
        ভুলু ভাই! আপনি একটি মৌলিক নীতি ভেঙেছেন — <strong>deployment আর release আলাদা না
        করা</strong>। প্রোডাকশনে কোড পুশ করা আর ইউজারের কাছে ফিচার দৃশ্যমান করা দুটি ভিন্ন ঘটনা।
        প্রফেশনাল সিস্টেমে কোড প্রোডাকশনেই থাকে, কিন্তু flag দিয়ে লুকানো।
      </Line>

      <Line name="নেক্সট-ভাই">
        একদম! আর A/B টেস্ট ব্রাউজারে নয় — edge middleware বা সার্ভারে করতে হয়, যাতে ইউজার প্রথম
        পেইন্টেই চূড়ান্ত ভ্যারিয়েন্ট দেখে, ফ্লিকার শূন্য।
      </Line>

      {/* ── Architecture ──────────────────────────────────────────────── */}
      <H2 id="architecture">১. Edge-Evaluated Flags &amp; Experiments</H2>

      <Diagram>{`┌─────────────────────────────────────────────────────────────────────────────┐
│                 EDGE-EVALUATED FEATURE FLAGS & A/B TESTING                  │
└─────────────────────────────────────────────────────────────────────────────┘

                               [ USER REQUEST ]
                                      ▼
                        [ NEXT.JS EDGE MIDDLEWARE ]
                          • read the user id / bucket cookie
                          • evaluate the flag rules
                          • assign: control (50%) or treatment (50%)
                                      │
            ┌─────────────────────────┴─────────────────────────┐
            ▼                                                   ▼
┌───────────────────────────┐                       ┌───────────────────────────┐
│        CONTROL            │                       │        TREATMENT          │
│  rendered on the server   │                       │  rendered on the server   │
│  zero layout shift        │                       │  zero layout shift        │
└───────────────────────────┘                       └───────────────────────────┘

  the browser receives one final HTML — it never sees the other variant`}</Diagram>

      {/* ── Mechanisms ────────────────────────────────────────────────── */}
      <H2 id="mechanisms">২. কোর রুল</H2>

      <p>
        <strong>Decouple deployment from release:</strong> কোড মার্জ ও ডেপ্লয় হয়ে যাবে, কিন্তু flag{" "}
        <code>false</code> থাকলে ইউজার কিছুই দেখবে না। ফিচার কখন লাইভ হবে সেটি ড্যাশবোর্ড থেকে flag
        বদলে ঠিক হবে — নতুন ডেপ্লয়মেন্ট ছাড়াই।
      </p>

      <p>
        <strong>Evaluate on the server, never on load:</strong> ক্লায়েন্টে{" "}
        <code>useEffect</code>-এ flag মূল্যায়ন মানে নিশ্চিত layout shift। সবসময় middleware বা server
        component-এ মূল্যায়ন করুন — HTML যখন ব্রাউজারে পৌঁছায়, সিদ্ধান্ত ততক্ষণে নেওয়া হয়ে গেছে।
      </p>

      <p>
        <strong>Deterministic bucketing:</strong> <code>Math.random()</code> দিয়ে বাকেট করলে একই
        ইউজার ডিভাইস বদলালেই অন্য ভ্যারিয়েন্ট পাবে, আর আপনার এক্সপেরিমেন্ট ডাটা অর্থহীন হয়ে যাবে।
        ইউজার আইডি হ্যাশ করে বাকেট করুন — একই ইউজার সবসময় একই বালতিতে পড়বে।
      </p>

      <p>
        <strong>Flag lifecycle:</strong> যে flag ১০০% ইউজারের জন্য স্থায়ী হয়ে গেছে, সেটির কোড
        অবিলম্বে মুছুন। নইলে ছয় মাস পর কোডবেজে এমন কন্ডিশনালের স্তূপ জমবে, যার কোনটি এখনো জীবিত তা
        কেউ জানে না।
      </p>

      {/* ── Implementation ────────────────────────────────────────────── */}
      <H2 id="implementation">৩. Production Code Implementation</H2>

      <H3>❌ Anti-pattern — ক্লায়েন্টে মূল্যায়ন</H3>

      <CodeBlock filename="src/app/checkout/poor-page.tsx">{`// 🔴 POOR PRACTICE: the flag arrives after the page has already painted
'use client';

import { useState, useEffect } from 'react';
import { OldCheckout } from '@/components/checkout/OldCheckout';
import { NewCheckout } from '@/components/checkout/NewCheckout';

export default function PoorCheckoutPage() {
  const [showNew, setShowNew] = useState<boolean | null>(null);

  useEffect(() => {
    // ❌ a round trip after hydration — the user sees one layout, then another
    fetch('/api/flags/new-checkout')
      .then((res) => res.json())
      .then((data) => setShowNew(data.enabled));
  }, []);

  // ❌ and a spinner in front of a page the server could have rendered fully
  if (showNew === null) return <div>Loading...</div>;

  return showNew ? <NewCheckout /> : <OldCheckout />;
}`}</CodeBlock>

      <H3>🟢 Production pattern — edge bucketing, server render</H3>

      <p>
        <strong>Step 1 — middleware-এ deterministic বাকেটিং।</strong>
      </p>

      <CodeBlock filename="src/middleware.ts">{`// 🟢 PRODUCTION PATTERN: decide before a single byte of HTML is produced
import { NextResponse, type NextRequest } from 'next/server';

const EXPERIMENT_COOKIE = 'ab-checkout-variant';

/** A stable hash, so one user always lands in the same bucket. */
async function bucketOf(seed: string): Promise<'control' | 'treatment'> {
  const digest = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(seed));
  const firstByte = new Uint8Array(digest)[0];
  return firstByte % 2 === 0 ? 'control' : 'treatment';
}

export async function middleware(req: NextRequest) {
  const res = NextResponse.next();

  let variant = req.cookies.get(EXPERIMENT_COOKIE)?.value;

  if (!variant) {
    // 🟢 hash the user id when there is one, so the bucket survives devices
    const userId = req.cookies.get('uid')?.value ?? crypto.randomUUID();
    variant = await bucketOf(\`checkout-experiment:\${userId}\`);

    res.cookies.set(EXPERIMENT_COOKIE, variant, {
      path: '/',
      maxAge: 60 * 60 * 24 * 30,
      httpOnly: true,
      sameSite: 'lax',
    });
  }

  // 🟢 hand the decision downstream — the page only has to read it
  res.headers.set('x-experiment-variant', variant);
  return res;
}

export const config = {
  matcher: ['/checkout'],
};`}</CodeBlock>

      <p>
        <strong>Step 2 — সার্ভার কম্পোনেন্ট শুধু পড়ে।</strong>
      </p>

      <CodeBlock filename="src/app/checkout/page.tsx">{`// 🟢 PRODUCTION PATTERN: one final HTML, zero flicker
import { headers } from 'next/headers';
import { OldCheckout } from '@/components/checkout/OldCheckout';
import { NewCheckout } from '@/components/checkout/NewCheckout';

export default async function CheckoutPage() {
  const headerList = await headers();
  const variant = headerList.get('x-experiment-variant') ?? 'control';

  return (
    <main className="mx-auto max-w-4xl p-6">
      <h1 className="mb-6 text-2xl font-bold">Complete your purchase</h1>

      {variant === 'treatment' ? (
        <NewCheckout experimentGroup="treatment" />
      ) : (
        <OldCheckout experimentGroup="control" />
      )}
    </main>
  );
}`}</CodeBlock>

      <p>
        <strong>Step 3 — kill switch।</strong> একটি বুলিয়ান flag আর একটি সার্ভার-সাইড পাঠ — এই দুটোই
        রোলব্যাকের জায়গা নেয়। ফিচার বন্ধ করতে ডেপ্লয় লাগে না, একটি ভ্যালু বদলালেই হয়।
      </p>

      <CodeBlock filename="src/lib/flags.ts">{`// 🟢 PRODUCTION PATTERN: a cached read, so the kill switch costs nothing
import { unstable_cache } from 'next/cache';

export const isEnabled = unstable_cache(
  async (key: string): Promise<boolean> => {
    const res = await fetch(\`\${process.env.FLAGS_API}/\${key}\`, {
      headers: { Authorization: \`Bearer \${process.env.FLAGS_TOKEN}\` },
    });

    // 🟢 fail closed: if the flag service is down, the new feature stays off
    if (!res.ok) return false;

    const data = (await res.json()) as { enabled: boolean };
    return data.enabled;
  },
  ['feature-flag'],
  { revalidate: 30, tags: ['feature-flags'] },
);`}</CodeBlock>

      {/* ── Matrix ────────────────────────────────────────────────────── */}
      <H2 id="matrix">৪. Flag, Canary, A/B, Kill Switch</H2>

      <Table
        head={["প্যাটার্ন", "উদ্দেশ্য", "টার্গেট", "আয়ুষ্কাল"]}
        rows={[
          [
            "Feature flag",
            "trunk-based ডেভেলপমেন্ট ও নিরাপদ রোলআউট",
            "ইন্টারনাল টিম, তারপর ধাপে ধাপে সবাই",
            "ফিচার স্থায়ী হলে মুছে ফেলা হয় 🟢",
          ],
          [
            "Canary release",
            "প্রোডাকশনে স্থিতিশীলতা যাচাই",
            "১% → ১০% → ৫০% → ১০০%",
            "কয়েক ঘণ্টা থেকে কয়েক দিন",
          ],
          [
            "A/B test",
            "কোন ডিজাইনে কনভার্সন বেশি",
            "deterministic ৫০/৫০ ভাগ",
            "পরিসংখ্যানগত তাৎপর্য না আসা পর্যন্ত",
          ],
          [
            "Kill switch",
            "জরুরি অবস্থায় এক ক্লিকে বন্ধ",
            "সব ইউজার",
            "স্থায়ীভাবে কোডে থাকে 🟢",
          ],
        ]}
      />

      <Line name="ভুলু ভাই">
        অসাধারণ ফাহিম! আমি ভাবতাম A/B টেস্ট মানেই ক্লায়েন্টে <code>if-else</code>। অথচ edge
        middleware দিয়ে কোনো ফ্লিকার ছাড়াই পুরো এক্সপেরিমেন্ট চলছে, আর বাগ পেলে রোলব্যাক না করে flag
        বন্ধ করলেই হচ্ছে!
      </Line>

      {/* ── Takeaways ─────────────────────────────────────────────────── */}
      <H2 id="takeaway">Production Takeaways</H2>

      <Note>
        <ul>
          <li>
            <strong>Never evaluate on client load:</strong> A/B কন্ডিশন ব্রাউজারে চালাবেন না —
            middleware বা server component-এ মূল্যায়ন করুন।
          </li>
          <li>
            <strong>Hash, don&rsquo;t randomise:</strong> ইউজার আইডি হ্যাশ করে বাকেট করুন, নইলে একই
            ইউজার বারবার ভিন্ন অভিজ্ঞতা পাবে আর ডাটা অর্থহীন হবে।
          </li>
          <li>
            <strong>Fail closed, then clean up:</strong> flag সার্ভিস ডাউন হলে নতুন ফিচার বন্ধ
            থাকুক; আর ফিচার স্থায়ী হলে flag-এর কোড স্প্রিন্টেই মুছে ফেলুন।
          </li>
        </ul>
      </Note>
    </article>
  );
}
