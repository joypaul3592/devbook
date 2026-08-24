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
      bn: "সব জায়গায় router.push() বসিয়ে বিপদ",
      en: "router.push() everywhere breaks things",
    },
  },
  {
    id: "architecture",
    label: {
      bn: "Declarative বনাম Imperative",
      en: "Declarative vs imperative",
    },
  },
  {
    id: "analysis",
    label: { bn: "টেকনিক্যাল অ্যানালাইসিস", en: "Technical analysis" },
  },
  {
    id: "implementation",
    label: { bn: "কখন কোনটা ব্যবহার করবেন", en: "When to use which" },
  },
  {
    id: "matrix",
    label: { bn: "Comparison Matrix", en: "Comparison matrix" },
  },
  {
    id: "takeaway",
    label: { bn: "Production Takeaways", en: "Production takeaways" },
  },
];

export default function UseRouterVsLink() {
  return (
    <article className="doc-prose">
      {/* ── The problem ───────────────────────────────────────────────── */}
      <H2 id="the-problem" anchorOnly>
        সব জায়গায় router.push() বসিয়ে বিপদ
      </H2>

      <p>
        রাত ৩:১৫। ভুলু ভাই ড্যাশবোর্ডের সাইডবার আর নেভবারে থাকা সব বাটন/লিংকে{" "}
        <code>&lt;Link&gt;</code> বাদ দিয়ে{" "}
        <code>onClick={"{() => router.push('/dashboard')}"}</code> বসিয়ে দিয়েছেন। কোড চালিয়ে
        দেখলেন — রাইট ক্লিক করে &quot;Open in New Tab&quot; দিলে পেজ খোলে না, সার্চ ইঞ্জিন
        বটেরা লিংক খুঁজে পাচ্ছে না, আর প্রিফেচিং বন্ধ হয়ে ট্রানজিশন স্লো হয়ে গেছে!
      </p>

      <Line name="ভুলু ভাই">
        ফাহিম! নেভিগেট তো দুটো দিয়েই করা যায় — <code>&lt;Link&gt;</code> দিয়েও পেজ চেঞ্জ হয়,{" "}
        <code>router.push()</code> দিলেও হয়! কিন্তু সব জায়গায় <code>useRouter()</code> দেওয়ার
        পর রাইট ক্লিকে নিউ ট্যাব অপশন কেন আসছে না? অ্যাক্সেসিবিলিটি অডিটে স্কোর এত কমে গেল কেন?
      </Line>

      <Line name="ফাহিম">
        ভুলু ভাই! আপনি <strong>Declarative</strong> আর <strong>Imperative</strong> নেভিগেশনকে
        এক করে ফেলেছেন! <code>&lt;Link&gt;</code> ডিক্লারেটিভ — সত্যিকারের HTML{" "}
        <code>&lt;a&gt;</code> ট্যাগ তৈরি করে SEO ও অ্যাক্সেসিবিলিটি বজায় রাখে। আর{" "}
        <code>useRouter()</code> ইম্পারেটিভ — কেবল জাভাস্ক্রিপ্ট সাইড-ইফেক্ট (ফর্ম সাবমিট,
        পেমেন্ট) শেষে নেভিগেট করার জন্য।
      </Line>

      {/* ── Architecture ──────────────────────────────────────────────── */}
      <H2 id="architecture">১. Declarative বনাম Imperative আর্কিটেকচার</H2>

      <Diagram>{`┌─────────────────────────────────────────────────────────────────────────┐
│                    NAVIGATION APPROACHES IN NEXT.JS                     │
└─────────────────────────────────────────────────────────────────────────┘
                                     │
         ┌───────────────────────────┴───────────────────────────┐
         ▼                                                       ▼
【 DECLARATIVE: <Link> 】                             【 IMPERATIVE: useRouter() 】
 • Renders an HTML <a> tag                           • Pure JavaScript function call
 • Crawler / SEO friendly                            • Hidden from search engine crawlers
 • Automatic viewport prefetching                    • No automatic prefetching
 • Native browser behaviour (middle-click, new tab)  • Breaks middle-click & new tab
 • Best for: menus, buttons, cards, footers          • Best for: post-action redirects`}</Diagram>

      {/* ── Analysis ──────────────────────────────────────────────────── */}
      <H2 id="analysis">২. মূল বৈসাদৃশ্য ও টেকনিক্যাল অ্যানালাইসিস</H2>

      <Note>
        <ul>
          <li>
            <strong>SEO ও DOM Structure:</strong> <code>&lt;Link&gt;</code> ব্রাউজারে সিম্যান্টিক{" "}
            <code>&lt;a&gt;</code> ট্যাগ হিসেবে রেন্ডার হয়, ক্রলাররা <code>href</code> ধরে সাইট
            ইনডেক্স করে। <code>useRouter()</code> কোনো HTML ট্যাগ তৈরি করে না — ইভেন্ট হ্যান্ডলারের
            ভেতরে লুকানো থাকে, তাই ক্রলার দেখতে পায় না।
          </li>
          <li>
            <strong>Native Behaviour &amp; Accessibility:</strong> <code>&lt;Link&gt;</code>-এ
            রাইট-ক্লিক করে নিউ ট্যাব বা মিডল-ক্লিক কাজ করে। <code>button</code>/<code>div</code>-এ{" "}
            <code>useRouter()</code> বসালে স্ট্যান্ডার্ড ব্রাউজার বিহেভিয়ার ভাঙে এবং স্ক্রিন রিডার
            ফেইল করে।
          </li>
          <li>
            <strong>Prefetching:</strong> <code>&lt;Link&gt;</code> ভিউপোর্টে এলে বা হভারে
            অটোমেটিক প্রিফেচ চালায়। <code>useRouter()</code>-এ টার্গেট রুট রানটাইমের আগে জানা
            যায় না, তাই প্রিফেচিংয়ের সুবিধা মিস হয়।
          </li>
        </ul>
      </Note>

      {/* ── Implementation ────────────────────────────────────────────── */}
      <H2 id="implementation">৩. কখন কোনটা ব্যবহার করবেন</H2>

      <H3>A — Declarative navigation (SEO ও স্ট্যান্ডার্ড UI)</H3>

      <CodeBlock filename="components/navbar.tsx">{`import Link from 'next/link';

export function Navbar() {
  return (
    <nav className="flex gap-4 p-4 bg-slate-900 border-b border-slate-800">
      {/* ALWAYS use <Link> for accessible, SEO-friendly navigation */}
      <Link
        href="/dashboard"
        className="text-slate-200 hover:text-emerald-400 font-medium transition"
      >
        Dashboard
      </Link>

      <Link
        href="/products"
        className="text-slate-200 hover:text-emerald-400 font-medium transition"
      >
        Products
      </Link>
    </nav>
  );
}`}</CodeBlock>

      <H3>B — Imperative navigation (সাইড-ইফেক্টের পরে)</H3>

      <CodeBlock filename="components/checkout-button.tsx">{`'use client';

// Must import from next/navigation, NOT next/router
import { useRouter } from 'next/navigation';
import { useState, useTransition } from 'react';

export function CheckoutButton({ cartId }: { cartId: string }) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [isProcessing, setIsProcessing] = useState(false);

  const handleCheckout = async () => {
    setIsProcessing(true);

    try {
      // 1. Perform the async side effect (payment processing / API call)
      const res = await fetch('/api/checkout', {
        method: 'POST',
        body: JSON.stringify({ cartId }),
      });

      const data = await res.json();

      if (data.success) {
        // 2. Navigate only AFTER the async action finishes
        startTransition(() => {
          router.push(\`/checkout/success/\${data.orderId}\`);
        });
      }
    } catch (error) {
      console.error('Checkout failed', error);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <button
      onClick={handleCheckout}
      disabled={isProcessing || isPending}
      className="w-full bg-emerald-600 hover:bg-emerald-500 disabled:bg-slate-700 text-white font-medium py-2.5 px-4 rounded-lg transition flex items-center justify-center gap-2"
    >
      {isProcessing || isPending ? 'Processing Order...' : 'Pay Now'}
    </button>
  );
}`}</CodeBlock>

      {/* ── Matrix ────────────────────────────────────────────────────── */}
      <H2 id="matrix">৪. Comparison Matrix</H2>

      <Table
        head={[
          "ফিচার",
          <code key="l">&lt;Link&gt;</code>,
          <code key="r">useRouter()</code>,
        ]}
        rows={[
          [
            "Import source",
            <code key="nl">next/link</code>,
            <code key="nn">next/navigation</code>,
          ],
          [
            "HTML output",
            <>
              সিম্যান্টিক <code>&lt;a&gt;</code> ট্যাগ
            </>,
            "কোনো HTML ট্যাগ নেই (পিওর JS ফাংশন)",
          ],
          [
            "SEO indexability",
            "চমৎকার — ক্রলার লিংক ফলো করতে পারে",
            "ক্রলার পড়তে পারে না",
          ],
          ["Middle click / new tab", "সাপোর্ট করে", "সাপোর্ট করে না"],
          [
            "Automatic prefetching",
            "ভিউপোর্টে এলে অটোমেটিক",
            <>
              ম্যানুয়ালি <code>router.prefetch()</code> ডাকতে হয়
            </>,
          ],
          [
            "Primary use case",
            "UI navigation (menus, buttons, cards)",
            "Async actions (form submit, auth check)",
          ],
        ]}
      />

      <Line name="ভুলু ভাই">
        বুঝতে পেরেছি! সাইডবার, বার্গার মেনু আর কার্ডে অন্ধের মতো <code>router.push()</code> না
        বসিয়ে <code>&lt;Link&gt;</code> ব্যবহার করতে হবে। আর ফর্ম বা পেমেন্ট সাবমিটের API
        রেসপন্স পাওয়ার পর <code>router.push()</code> দিয়ে রিডাইরেক্ট করতে হবে!
      </Line>

      {/* ── Takeaways ─────────────────────────────────────────────────── */}
      <H2 id="takeaway">Production Takeaways</H2>

      <Note>
        <ul>
          <li>
            <strong>Default to &lt;Link&gt; first:</strong> UI-এর যেকোনো দৃশ্যমান লিংকের জন্য
            সবসময় <code>&lt;Link&gt;</code> — এতে SEO, অ্যাক্সেসিবিলিটি ও অটোমেটিক প্রিফেচিং
            নিশ্চিত হয়।
          </li>
          <li>
            <strong>Reserve useRouter() for side effects:</strong> ফর্ম ভ্যালিডেশন, পেমেন্ট
            গেটওয়ে বা লগইন রেসপন্স শেষ হওয়ার পর প্রোগ্রাম্যাটিক রিডাইরেক্টে ব্যবহার করুন।
          </li>
          <li>
            <strong>App Router import source:</strong> App Router-এ সবসময়{" "}
            <code>import {"{ useRouter }"} from &apos;next/navigation&apos;</code>। ভুলে{" "}
            <code>next/router</code> ইমপোর্ট করলে রানটাইম এরর।
          </li>
        </ul>
      </Note>
    </article>
  );
}
