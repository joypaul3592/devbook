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
      bn: "ডেটাবেসে $350, স্ক্রিনে $500",
      en: "$350 in the DB, $500 on screen",
    },
  },
  {
    id: "architecture",
    label: {
      bn: "Client Router Cache আর্কিটেকচার",
      en: "Client router cache architecture",
    },
  },
  {
    id: "mechanics",
    label: { bn: "ক্যাশ মেকানিক্স ও Stale Time", en: "Cache mechanics & stale time" },
  },
  {
    id: "implementation",
    label: { bn: "ইনভ্যালিডেশনের ২টি প্যাটার্ন", en: "Two invalidation patterns" },
  },
  {
    id: "matrix",
    label: { bn: "Invalidation Methods", en: "Invalidation methods" },
  },
  {
    id: "takeaway",
    label: { bn: "Production Takeaways", en: "Production takeaways" },
  },
];

export default function ClientRouterCacheMechanics() {
  return (
    <article className="doc-prose">
      {/* ── The problem ───────────────────────────────────────────────── */}
      <H2 id="the-problem" anchorOnly>
        ডেটাবেসে $350, স্ক্রিনে $500
      </H2>

      <p>
        রাত ৫:১৫। ভুলু ভাই অ্যাডমিন প্যানেল থেকে একটি প্রোডাক্টের দাম $500 থেকে কমিয়ে $350
        আপডেট করলেন। এরপর নেভবারের <code>&lt;Link href=&quot;/products&quot;&gt;</code>-এ ক্লিক
        করে লিস্ট পেজে এলেন — কিন্তু দাম এখনও $500! ড্যাশবোর্ডে গিয়ে আবার ফিরে এলেন, তাও একই।
        অথচ ব্রাউজারে Hard Reload (Ctrl + Shift + R) দিতেই সঠিক দাম $350 ভেসে উঠল!
      </p>

      <Line name="ভুলু ভাই">
        ফাহিম! ব্যাকএন্ড ডেটাবেসে তো প্রাইস $350 হয়ে গেছে! কিন্তু অ্যাপের ভেতরে{" "}
        <code>&lt;Link&gt;</code> দিয়ে নেভিগেট করলে পুরোনো $500 কেন দেখাচ্ছে? রিফ্রেশ দিলে ডেটা
        ঠিকই আসছে, কিন্তু ক্লায়েন্ট সাইড নেভিগেশনে সার্ভারের লেটেস্ট ডেটা রেন্ডার হচ্ছে না কেন?
      </Line>

      <Line name="ফাহিম">
        ভুলু ভাই! আপনি Next.js-এর ইন-মেমরি ফিচার <strong>Client Router Cache</strong>-এর
        মেকানিজমে পড়েছেন! নেভিগেশন ইনস্ট্যান্ট রাখার জন্য App Router সার্ভার থেকে পাওয়া RSC
        Payload ব্রাউজারের মেমরিতে ক্যাশ করে রাখে।
      </Line>

      <Line name="নেক্সট-ভাই">
        একদম! ইউজার এক পেজ থেকে অন্য পেজে গেলে Next.js প্রতিবার সার্ভারে রিকোয়েস্ট পাঠায় না —
        Client Router Cache থেকেই RSC Payload এনে রেন্ডার করে। কিন্তু সার্ভারে ডেটা বদলালে এই
        ক্যাশ কীভাবে ইনভ্যালিডেট করতে হয় (<code>router.refresh()</code> ও{" "}
        <code>revalidatePath</code>), সেটা জানা জরুরি।
      </Line>

      {/* ── Architecture ──────────────────────────────────────────────── */}
      <H2 id="architecture">১. Client Router Cache আর্কিটেকচার</H2>

      <Diagram>{`┌─────────────────────────────────────────────────────────────────────────┐
│                   CLIENT ROUTER CACHE NAVIGATION FLOW                   │
└─────────────────────────────────────────────────────────────────────────┘
                                     │
   [1. User clicks <Link>]  ───▶ Target: /products
                                     │
   [2. Check router cache]  ───▶ Is the RSC payload already in browser memory?
                                     │
         ┌───────────────────────────┴───────────────────────────┐
         ▼ (YES: cache hit)                        (NO / stale / invalidated) ▼
┌──────────────────────────────────┐        ┌──────────────────────────────────┐
│ Instant UI render from memory    │        │ Fetch a fresh RSC payload from   │
│ (zero server round-trip)         │        │ the server & update the cache    │
└──────────────────────────────────┘        └──────────────────────────────────┘`}</Diagram>

      {/* ── Mechanics ─────────────────────────────────────────────────── */}
      <H2 id="mechanics">২. ক্যাশ মেকানিক্স ও Stale Time</H2>

      <Note>
        <ul>
          <li>
            <strong>In-Memory Session Scope:</strong> Client Router Cache ব্রাউজারের RAM-এ পেজ
            সেশন চলাকালীন টিকে থাকে। পেজ রিফ্রেশ না হওয়া পর্যন্ত সেশনজুড়ে RSC Payload ক্যাশ করে
            রাখে।
          </li>
          <li>
            <strong>Static routes:</strong> Next.js অটোমেটিক্যালি ৫ মিনিট পর্যন্ত ক্যাশ ধরে রাখে।
          </li>
          <li>
            <strong>Dynamic routes:</strong> Next.js 14-এ ডিফল্ট stale time ছিল ৩০ সেকেন্ড।
            Next.js 15+ এ এটি <code>0</code> করা হয়েছে — অর্থাৎ ডাইনামিক রুটে নেভিগেট করলে
            (প্রিফেচ না থাকলে) সবসময় ফ্রেশ ডেটার জন্য সার্ভারে হিট হয়।
          </li>
          <li>
            <strong>Data Cache-এর সাথে পার্থক্য:</strong> সার্ভারের Data Cache (যেমন{" "}
            <code>fetch()</code> ক্যাশ) ডেটাবেস রিকোয়েস্ট কমায়। আর Client Router Cache হলো
            ব্রাউজার মেমরিতে থাকা UI structure + data-র রেন্ডার্ড ফ্র্যাগমেন্ট।
          </li>
        </ul>
      </Note>

      {/* ── Implementation ────────────────────────────────────────────── */}
      <H2 id="implementation">৩. ইনভ্যালিডেশনের ২টি প্যাটার্ন</H2>

      <H3>A — router.refresh() দিয়ে প্রোগ্রাম্যাটিক রিফ্রেশ</H3>

      <p>
        <code>router.refresh()</code> ডাকলে ক্লায়েন্ট কম্পোনেন্টের লোকাল স্টেট (ইনপুট টেক্সট বা
        ফর্ম স্টেট) অক্ষুণ্ণ রেখেই Next.js ব্যাকগ্রাউন্ডে নতুন RSC Payload এনে সার্ভার
        কম্পোনেন্টগুলোকে রি-রেন্ডার করায়।
      </p>

      <CodeBlock filename="app/products/_components/edit-modal.tsx">{`'use client';

import { useRouter } from 'next/navigation';
import { useState, useTransition } from 'react';

export function QuickEditModal({ productId }: { productId: string }) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [price, setPrice] = useState('350');

  const handleUpdatePrice = async () => {
    // 1. Perform the client-side mutation / API call
    const res = await fetch(\`/api/products/\${productId}\`, {
      method: 'PATCH',
      body: JSON.stringify({ price: Number(price) }),
    });

    if (res.ok) {
      startTransition(() => {
        // 2. Invalidate the router cache & re-fetch server components
        router.refresh();
      });
    }
  };

  return (
    <div className="p-4 bg-slate-900 border border-slate-800 rounded-xl space-y-3">
      <h4 className="text-sm font-semibold text-slate-200">Update Product Price</h4>
      <input
        type="number"
        value={price}
        onChange={(e) => setPrice(e.target.value)}
        className="w-full bg-slate-950 border border-slate-800 p-2 text-sm rounded text-slate-200"
      />
      <button
        onClick={handleUpdatePrice}
        disabled={isPending}
        className="bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold px-4 py-2 rounded-lg transition"
      >
        {isPending ? 'Updating...' : 'Save & Refresh UI'}
      </button>
    </div>
  );
}`}</CodeBlock>

      <H3>B — Server Action থেকে অটোমেটিক ইনভ্যালিডেশন</H3>

      <p>
        সার্ভার অ্যাকশনের ভেতরে <code>revalidatePath()</code> বা <code>revalidateTag()</code>{" "}
        চালালে Next.js নিজেই ক্লায়েন্টের Router Cache ইনভ্যালিডেট করে দেয় — ম্যানুয়ালি{" "}
        <code>router.refresh()</code> ডাকতে হয় না।
      </p>

      <CodeBlock filename="app/actions/product.ts">{`'use server';

import { revalidatePath } from 'next/cache';

export async function updateProductAction(formData: FormData) {
  const productId = formData.get('id') as string;
  const newPrice = Number(formData.get('price'));

  // 1. Update the database
  // await db.product.update({ where: { id: productId }, data: { price: newPrice } });

  // 2. Purges the server Data Cache AND the client Router Cache for this path
  revalidatePath('/products');
}`}</CodeBlock>

      <Note>
        <p>
          পুরো ফাইলটিকে সার্ভার অ্যাকশন মডিউল বানাতে <code>&apos;use server&apos;</code>{" "}
          ফাইলের একদম উপরে বসে — প্রতিটি ফাংশনের ভেতরে নয়। আর <code>server-only</code> একটি
          আলাদা প্যাকেজ (<code>import &apos;server-only&apos;</code>), ডিরেক্টিভ নয়; সেটি
          ব্যবহার হয় সার্ভার মডিউল ভুলবশত ক্লায়েন্ট বান্ডলে ঢুকে পড়া আটকাতে।
        </p>
      </Note>

      {/* ── Matrix ────────────────────────────────────────────────────── */}
      <H2 id="matrix">৪. Router Cache Invalidation Methods</H2>

      <Table
        head={["মেথড", "কোথায় ব্যবহার হয়", "লোকাল React State", "বিহেভিয়ার"]}
        rows={[
          [
            <code key="rr">router.refresh()</code>,
            "Client Component",
            "ধরে রাখে (preserved)",
            "বর্তমান রুটের ফ্রেশ RSC Payload এনে UI আপডেট করে",
          ],
          [
            <code key="rp">revalidatePath()</code>,
            "Server Action / Route Handler",
            "ধরে রাখে (preserved)",
            "সার্ভার থেকে Router Cache ও Data Cache দুটোই ক্লিয়ার করে",
          ],
          [
            <code key="hr">location.reload()</code>,
            "Browser native",
            "নষ্ট হয়ে যায় (wiped out)",
            "পুরো জাভাস্ক্রিপ্ট বান্ডল নতুন করে লোড করে — স্লো UX",
          ],
        ]}
      />

      <Line name="ভুলু ভাই">
        ইউরেকা! এবার পুরো মেকানিজম ক্রিস্টাল ক্লিয়ার! সার্ভার অ্যাকশনে{" "}
        <code>revalidatePath(&apos;/products&apos;)</code> বসানোয় বা ক্লায়েন্ট থেকে{" "}
        <code>router.refresh()</code> মারায় ব্রাউজার ক্যাশে থাকা পুরোনো RSC Payload মুছে যাচ্ছে,
        আর ইউজার সাথে সাথে আপডেটেড ডেটা দেখছে!
      </Line>

      {/* ── Takeaways ─────────────────────────────────────────────────── */}
      <H2 id="takeaway">Production Takeaways</H2>

      <Note>
        <ul>
          <li>
            <strong>Router Cache is UI-level memory:</strong> এটি ব্রাউজার মেমরিতে RSC Payload
            জমিয়ে ক্লায়েন্ট-সাইড নেভিগেশন ফাস্ট করে — সার্ভারের Data Cache-এর সাথে গুলিয়ে
            ফেলবেন না।
          </li>
          <li>
            <strong>Prefer Server Actions for auto-invalidation:</strong> মিউটেশন Server Action-এ
            করে ভেতরে <code>revalidatePath()</code> বা <code>revalidateTag()</code> দিলে Next.js
            নিজ দায়িত্বে ক্লায়েন্ট রাউটার ক্যাশ ফ্লাশ করে দেয়।
          </li>
          <li>
            <strong>router.refresh() for custom client mutators:</strong> থার্ড-পার্টি API কল বা{" "}
            <code>fetch</code>/<code>axios</code> দিয়ে ক্লায়েন্ট মিউটেশন করলে শেষে অবশ্যই{" "}
            <code>router.refresh()</code> কল করুন, নাহলে সার্ভার কম্পোনেন্ট পুরোনো ডেটাই দেখাবে।
          </li>
        </ul>
      </Note>
    </article>
  );
}
