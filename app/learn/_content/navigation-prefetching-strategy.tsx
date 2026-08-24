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
      bn: "সব লিংকে প্রিফেচ = ডেটা আর CPU দুটোই শেষ",
      en: "Prefetch everything, burn data and CPU",
    },
  },
  {
    id: "architecture",
    label: {
      bn: "Strategic Prefetching Decision Tree",
      en: "Strategic prefetching decision tree",
    },
  },
  {
    id: "strategies",
    label: { bn: "৩টি প্রধান স্ট্র্যাটেজি", en: "The three strategies" },
  },
  {
    id: "implementation",
    label: { bn: "IntentLink ও Warm-Up", en: "IntentLink and warm-up" },
  },
  {
    id: "matrix",
    label: { bn: "Strategy Decision Matrix", en: "Strategy decision matrix" },
  },
  {
    id: "takeaway",
    label: { bn: "Production Takeaways", en: "Production takeaways" },
  },
];

export default function NavigationPrefetchingStrategy() {
  return (
    <article className="doc-prose">
      {/* ── The problem ───────────────────────────────────────────────── */}
      <H2 id="the-problem" anchorOnly>
        সব লিংকে প্রিফেচ = ডেটা আর CPU দুটোই শেষ
      </H2>

      <p>
        রাত ২:৩০। ভুলু ভাই একটি এন্টারপ্রাইজ ড্যাশবোর্ড বানিয়েছেন যেখানে Analytics,
        Financial Reports এবং Audit Logs নামে ৩টি বিশাল ডেটা-হেভি রুট আছে। মোবাইলে 4G ডেটা
        দিয়ে ড্যাশবোর্ডে ঢুকতেই ইউজারের ডেটা শেষ! আর সার্ভারে একের পর এক ব্যাকগ্রাউন্ড কোয়েরি
        পড়ে CPU ইউজেজ ৮০%-এ গিয়ে ঠেকেছে।
      </p>

      <Line name="ভুলু ভাই">
        ফাহিম! বিপদে পড়েছি! ড্যাশবোর্ডের সব মেনু লিংকে প্রিফেচ অন রাখলে ইউজারের মোবাইল ডেটা আর
        আমার ব্যাকএন্ড সার্ভার — দুটোরই ১২টা বাজে! আবার প্রিফেচ পুরোপুরি বন্ধ করে দিলে
        অ্যানালিটিক্স পেজে ক্লিক করলে ইউজারকে ২ সেকেন্ড বসে থাকতে হয়! কোনো মিডল-গ্রাউন্ড নেই?
      </Line>

      <Line name="ফাহিম">
        ভুলু ভাই, এখানেই আসে <strong>Strategic Prefetching</strong>। অ্যাপের সব লিংকে চোখ বন্ধ
        করে প্রিফেচিং অন রাখা বা বন্ধ করা — দুটোই খারাপ প্র্যাকটিস। ইউজারের intent বুঝে এবং
        রুটের ডেটা লোড অনুযায়ী প্রিফেচিং টিউন করতে হবে।
      </Line>

      <Line name="নেক্সট-ভাই">
        একদম! আমরা তিন ধরনের স্ট্র্যাটেজি ব্যবহার করব — Aggressive Viewport Prefetching,
        Intent-based Hover Prefetching, আর Programmatic Flow Warm-up (
        <code>router.prefetch()</code>)।
      </Line>

      {/* ── Architecture ──────────────────────────────────────────────── */}
      <H2 id="architecture">১. Strategic Prefetching Decision Tree</H2>

      <Diagram>{`┌─────────────────────────────────────────────────────────────────────────┐
│                    STRATEGIC PREFETCHING DECISION TREE                  │
└─────────────────────────────────────────────────────────────────────────┘
                                     │
                             [Route Criticality]
                                     │
         ┌───────────────────────────┼───────────────────────────┐
         ▼                           ▼                           ▼
 ┌───────────────┐           ┌───────────────┐          ┌────────────────┐
 │ High Priority │           │ Medium/Heavy  │          │ Next-Step Flow │
 │ Core Navigation           │ Analytics/Reports        │ Wizard/Checkout │
 └───────────────┘           └───────────────┘          └────────────────┘
         │                           │                           │
         ▼                           ▼                           ▼
 [Default Viewport]         [Intent / On-Hover]        [router.prefetch()]
 Automatic prefetch         Prefetch only when user    Warm up the cache in
 when in viewport           hovers or focuses          the background on step 1`}</Diagram>

      {/* ── Strategies ────────────────────────────────────────────────── */}
      <H2 id="strategies">২. ৩টি প্রধান প্রিফেচিং স্ট্র্যাটেজি</H2>

      <Note>
        <ul>
          <li>
            <strong>Viewport Auto-Prefetch (critical routes):</strong> অ্যাপের প্রাইমারি
            নেভিগেশন — Dashboard Home, Products, Inbox। এগুলো ভিউপোর্টে আসামাত্রই Next.js
            অটোমেটিক্যালি ক্যাশ করে রাখবে।
          </li>
          <li>
            <strong>Intent-Based / Hover Prefetching (heavy dynamic routes):</strong> ভারী
            রিপোর্ট বা অ্যানালিটিক্স পেজের লিংক ভিউপোর্টে এলেই ডাউনলোড করার দরকার নেই। ইউজার
            হভার বা ফোকাস করলে কেবল তখনই অন-ডিমান্ড প্রিফেচ ট্রিগার হবে।
          </li>
          <li>
            <strong>Programmatic Warm-Up:</strong> মাল্টি-স্টেপ ফর্ম বা চেকআউট ফ্লোতে ইউজার
            স্টেপ ১-এ থাকা অবস্থাতেই <code>router.prefetch(&apos;/checkout/step-2&apos;)</code>{" "}
            দিয়ে পরের রুট ওয়ার্ম-আপ করে রাখা।
          </li>
        </ul>
      </Note>

      {/* ── Implementation ────────────────────────────────────────────── */}
      <H2 id="implementation">৩. প্রোডাকশন ইমপ্লিমেন্টেশন</H2>

      <H3>A — Intent-based prefetch link</H3>

      <CodeBlock filename="components/intent-link.tsx">{`'use client';

import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useState, ComponentProps } from 'react';

type IntentLinkProps = ComponentProps<typeof Link>;

export function IntentLink({ href, children, ...props }: IntentLinkProps) {
  const router = useRouter();
  const [isPrefetched, setIsPrefetched] = useState(false);

  // Prefetch ONLY when the user shows intent (mouse enter or focus)
  const handleMouseEnterOrFocus = () => {
    if (!isPrefetched && typeof href === 'string') {
      router.prefetch(href);
      setIsPrefetched(true);
    }
  };

  return (
    <Link
      href={href}
      prefetch={false} // disable automatic viewport prefetching
      onMouseEnter={handleMouseEnterOrFocus}
      onFocus={handleMouseEnterOrFocus}
      {...props}
    >
      {children}
    </Link>
  );
}`}</CodeBlock>

      <H3>B — Programmatic flow warm-up</H3>

      <CodeBlock filename="components/onboarding-wizard.tsx">{`'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export function OnboardingStepOne() {
  const router = useRouter();

  useEffect(() => {
    // Warm up the next step in the background as soon as step 1 mounts
    router.prefetch('/onboarding/step-2');
  }, [router]);

  return (
    <div className="p-6 bg-slate-900 rounded-xl border border-slate-800">
      <h2 className="text-xl font-bold text-slate-100">Step 1: Profile Info</h2>
      <p className="text-sm text-slate-400 mt-1">Fill out your basic details below.</p>

      {/* Form fields go here */}

      <button
        onClick={() => router.push('/onboarding/step-2')}
        className="mt-4 bg-emerald-600 hover:bg-emerald-500 text-white px-4 py-2 rounded-lg font-medium transition"
      >
        Continue to Step 2
      </button>
    </div>
  );
}`}</CodeBlock>

      {/* ── Matrix ────────────────────────────────────────────────────── */}
      <H2 id="matrix">৪. Prefetching Strategy Decision Matrix</H2>

      <Table
        head={["রুটের ধরন", "স্ট্র্যাটেজি", "মেকানিজম", "প্রভাব"]}
        rows={[
          [
            "Primary navbar / footer",
            "Viewport prefetch",
            <>
              ডিফল্ট <code>&lt;Link&gt;</code>
            </>,
            "ইনস্ট্যান্ট ক্লিক, মিডিয়াম ব্যান্ডউইথ",
          ],
          [
            "Heavy analytics / reports",
            "Intent-based hover",
            <code key="il">&lt;IntentLink&gt;</code>,
            "১০০–৩০০ms সেভ, শূন্য অনর্থক ব্যান্ডউইথ",
          ],
          [
            "Large data tables (100+ links)",
            "Disabled",
            <code key="pf">prefetch={"{false}"}</code>,
            "নেটওয়ার্ক ফ্লাডিং পুরোপুরি বন্ধ",
          ],
          [
            "Multi-step form / wizard",
            "Programmatic warm-up",
            <>
              <code>router.prefetch()</code> in <code>useEffect</code>
            </>,
            "পরের স্টেপে প্রায় 0ms ট্রানজিশন",
          ],
        ]}
      />

      <Line name="ভুলু ভাই">
        দারুণ আইডিয়া! অ্যানালিটিক্স আর রিপোর্টস লিংকে <code>IntentLink</code> ব্যবহার করলাম,
        আর মাল্টি-স্টেপ ফর্মে <code>router.prefetch()</code> মেরে দেওয়াতে ইউজার Next বাটনে
        ক্লিক করার আগেই পরের পেজ রেডি হয়ে থাকে!
      </Line>

      {/* ── Takeaways ─────────────────────────────────────────────────── */}
      <H2 id="takeaway">Production Takeaways</H2>

      <Note>
        <ul>
          <li>
            <strong>Control Bandwidth with Intent:</strong> ডেটা-হেভি রুটে{" "}
            <code>prefetch={"{false}"}</code> সেট করে <code>onMouseEnter</code>-এ{" "}
            <code>router.prefetch()</code> চালান — ব্যান্ডউইথ অপচয় ছাড়াই দ্রুত ট্রানজিশন।
          </li>
          <li>
            <strong>Predict User Flow:</strong> সাইনআপ, অনবোর্ডিং বা চেকআউটের মতো নির্দিষ্ট
            সিকোয়েন্সে কারেন্ট স্টেপ রেন্ডার হওয়ার সাথে সাথেই পরের স্টেপ ওয়ার্ম-আপ করুন।
          </li>
          <li>
            <strong>Avoid Network Flooding on Mobile:</strong> প্রচুর লিংকযুক্ত পেজে অন্ধভাবে
            প্রিফেচিং চালালে লো-এন্ড ডিভাইসে CPU throttle হয়ে অ্যাপ ল্যাগ করে।
          </li>
        </ul>
      </Note>
    </article>
  );
}
