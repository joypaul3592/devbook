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
      bn: "কোনটা Server, কোনটা Client?",
      en: "Which one is server, which one is client?",
    },
  },
  {
    id: "decision-tree",
    label: { bn: "ডিসিশন ট্রি", en: "The decision tree" },
  },
  {
    id: "implementation",
    label: {
      bn: "প্রোডাকশন ইমপ্লিমেন্টেশন",
      en: "Production implementation",
    },
  },
  {
    id: "matrix",
    label: { bn: "ক্যাপাবিলিটি ম্যাট্রিক্স", en: "Capability matrix" },
  },
  {
    id: "takeaway",
    label: { bn: "Production Takeaways", en: "Production takeaways" },
  },
];

export default function ServerVsClientDecisionMaking() {
  return (
    <article className="doc-prose">
      {/* ── The problem ───────────────────────────────────────────────── */}
      <H2 id="the-problem" anchorOnly>
        কোনটা Server, কোনটা Client?
      </H2>

      <p>
        বিকাল ৩:৫০। আগের লেসনে RSC-র মেন্টাল মডেল বোঝার পর ভুলু ভাই নতুন সমস্যায় পড়লেন —
        কোন কম্পোনেন্টে <code>&apos;use client&apos;</code> লিখবেন আর কোনটাতে লিখবেন না,
        সেই সিদ্ধান্তই নিতে পারছেন না।
      </p>

      <Line name="ভুলু ভাই">
        নেক্সট-ভাই, আমি তো নিরাপদ থাকার জন্য প্রতিটি কম্পোনেন্টের মাথায়{" "}
        <code>&apos;use client&apos;</code> লিখে দিচ্ছি — অন্তত কিছু ভাঙবে না! এতে সমস্যা
        কী?
      </Line>

      <Line name="ফাহিম">
        সমস্যা আছে ভুলু ভাই! তাহলে পুরো অ্যাপটাই আবার পুরনো দিনের CSR অ্যাপ হয়ে গেল —
        RSC-র সব সুবিধা তুমি নিজের হাতে ফেলে দিলে!
      </Line>

      <Line name="নেক্সট-ভাই">
        ঠিক। App Router-এ ডিফল্ট হলো <strong>Server Component</strong>। তাই প্রশ্নটা
        উল্টো করে করতে হয় — &ldquo;এই কম্পোনেন্টে কি ব্রাউজার-only কিছু লাগছে?&rdquo; যদি
        উত্তর &ldquo;না&rdquo; হয়, তবে সেটি Server Component-ই থাকবে।
      </Line>

      {/* ── Decision tree ─────────────────────────────────────────────── */}
      <H2 id="decision-tree">১. ডিসিশন ট্রি</H2>

      <Diagram>{`                   একটি নতুন কম্পোনেন্ট লিখছ
                              │
                              v
        ┌─────────────────────────────────────────────┐
        │ এতে কি onClick / onChange / onSubmit আছে?   │
        │ useState / useReducer / useEffect আছে?      │
        │ window / document / localStorage লাগছে?     │
        │ browser-only lib (chart, map, editor) আছে?  │
        │ Context provider / custom hook দরকার?       │
        └───────────────┬─────────────────┬───────────┘
                        │ YES             │ NO
                        v                 v
              ┌──────────────────┐  ┌──────────────────────────┐
              │  'use client'    │  │  Server Component (default)
              │  leaf component  │  │  - async / await data
              │  as SMALL as     │  │  - DB, secrets, fs access
              │  possible        │  │  - heavy libs, 0 KB to client
              └──────────────────┘  └──────────────────────────┘`}</Diagram>

      <Note>
        <p>
          মনে রাখো: <code>&apos;use client&apos;</code> মানে &ldquo;শুধু ব্রাউজারে
          চলবে&rdquo; নয়। ক্লায়েন্ট কম্পোনেন্টও সার্ভারে প্রি-রেন্ডার হয়ে HTML দেয়; পার্থক্য
          হলো এর JS ব্রাউজারে হাইড্রেশনের জন্য পাঠাতে হয়।
        </p>
      </Note>

      {/* ── Implementation ────────────────────────────────────────────── */}
      <H2 id="implementation">২. Production Engineering Implementation</H2>

      <H3>A — একটি প্রোডাক্ট কার্ড: ভুল ভাগ</H3>

      <CodeBlock filename="components/product-card.tsx">{`// ❌ ANTI-PATTERN: whole card becomes a client component for one button
'use client';

import { useState } from 'react';
import { formatPrice } from '@/lib/format-price'; // heavy Intl wrapper
import { calculateDiscount } from '@/lib/pricing-engine'; // 80KB pricing rules

export function ProductCard({ product }: { product: Product }) {
  const [inCart, setInCart] = useState(false);

  // pricing-engine + format-price now travel to the browser as well
  const price = formatPrice(calculateDiscount(product));

  return (
    <div className="rounded-xl border border-slate-800 p-5">
      <h3 className="font-semibold text-white">{product.title}</h3>
      <p className="text-slate-400 text-sm">{price}</p>
      <button onClick={() => setInCart(true)}>
        {inCart ? 'Added' : 'Add to cart'}
      </button>
    </div>
  );
}`}</CodeBlock>

      <H3>B — সঠিক ভাগ: ইন্টারঅ্যাকশনটুকুই ক্লায়েন্টে</H3>

      <CodeBlock filename="components/add-to-cart-button.tsx">{`// 🟢 Only the interactive leaf is a client component
'use client';

import { useState } from 'react';

export function AddToCartButton({ productId }: { productId: string }) {
  const [inCart, setInCart] = useState(false);

  return (
    <button
      onClick={() => setInCart(true)}
      className="mt-3 px-3 py-1.5 rounded bg-emerald-600 text-xs text-white"
      data-product={productId}
    >
      {inCart ? 'Added to cart' : 'Add to cart'}
    </button>
  );
}`}</CodeBlock>

      <CodeBlock filename="components/product-card.tsx">{`// 🟢 The card itself stays a server component — 0 KB of pricing logic shipped
import { formatPrice } from '@/lib/format-price';
import { calculateDiscount } from '@/lib/pricing-engine';
import { AddToCartButton } from './add-to-cart-button';

export function ProductCard({ product }: { product: Product }) {
  // Runs on the server only
  const price = formatPrice(calculateDiscount(product));

  return (
    <div className="rounded-xl border border-slate-800 p-5">
      <h3 className="font-semibold text-white">{product.title}</h3>
      <p className="text-slate-400 text-sm">{price}</p>
      <AddToCartButton productId={product.id} />
    </div>
  );
}`}</CodeBlock>

      <Line name="ভুলু ভাই">
        (মাথা নেড়ে) তারমানে প্রশ্নটা &ldquo;পুরো কার্ডটা কি ইন্টারঅ্যাক্টিভ?&rdquo; নয় —
        প্রশ্নটা &ldquo;কার্ডের ঠিক কোন অংশটুকু ইন্টারঅ্যাক্টিভ?&rdquo;
      </Line>

      {/* ── Matrix ────────────────────────────────────────────────────── */}
      <H2 id="matrix">৩. ক্যাপাবিলিটি ম্যাট্রিক্স</H2>

      <Table
        head={["কী দরকার", "Server Component", "Client Component"]}
        rows={[
          ["DB / ORM সরাসরি কল", "✅ পারে", "❌ পারে না"],
          ["Secret / env key ব্যবহার", "✅ নিরাপদ", "❌ লিক হয়ে যাবে"],
          [
            <>
              <code>async</code> / top-level <code>await</code>
            </>,
            "✅ পারে",
            "❌ পারে না (hook দিয়ে করতে হয়)",
          ],
          [
            <>
              <code>useState</code> / <code>useEffect</code>
            </>,
            "❌ পারে না",
            "✅ পারে",
          ],
          ["ইভেন্ট হ্যান্ডলার (onClick)", "❌ পারে না", "✅ পারে"],
          [
            <>
              <code>window</code> / <code>localStorage</code>
            </>,
            "❌ পারে না",
            "✅ পারে",
          ],
          ["ভারী লাইব্রেরি ইমপোর্ট", "✅ ০ KB ক্লায়েন্ট খরচ", "❌ বান্ডলে যোগ হয়"],
        ]}
      />

      {/* ── Takeaways ─────────────────────────────────────────────────── */}
      <H2 id="takeaway">Production Takeaways</H2>

      <Note>
        <ul>
          <li>
            <strong>Server by default:</strong> কম্পোনেন্ট Server Component হিসেবেই শুরু
            করো; ব্রাউজার-only কিছু দরকার হলে তবেই ক্লায়েন্টে নামাও।
          </li>
          <li>
            <strong>Split, don&apos;t promote:</strong> একটি বাটনের জন্য পুরো কম্পোনেন্টকে
            ক্লায়েন্ট বানিয়ো না — বাটনটাকে আলাদা লিফ কম্পোনেন্টে বের করে আনো।
          </li>
          <li>
            <strong>Data down, interactivity in:</strong> ডেটা সার্ভারে ফেচ করে
            সিরিয়ালাইজেবল প্রপ্স হিসেবে নামাও, আর ইন্টারঅ্যাকশন ক্লায়েন্ট লিফের ভেতরেই রাখো।
          </li>
          <li>
            <strong>Third-party libs:</strong> যেসব প্যাকেজ এখনো RSC-সচেতন নয়, সেগুলোকে
            নিজের একটি ছোট <code>&apos;use client&apos;</code> র‍্যাপারে মুড়ে নাও — তাতে
            বাউন্ডারি তোমার নিয়ন্ত্রণে থাকে।
          </li>
        </ul>
      </Note>
    </article>
  );
}
