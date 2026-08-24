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
      bn: "ক্লিক না করেই ডজন ডজন রিকোয়েস্ট",
      en: "Requests fire before any click",
    },
  },
  {
    id: "architecture",
    label: {
      bn: "Prefetching Engine আর্কিটেকচার",
      en: "Prefetching engine architecture",
    },
  },
  {
    id: "mechanics",
    label: { bn: "৪টি মৌলিক মেকানিক্স", en: "The four mechanics" },
  },
  {
    id: "implementation",
    label: { bn: "prefetch প্রপ কনফিগারেশন", en: "Configuring the prefetch prop" },
  },
  {
    id: "matrix",
    label: { bn: "Prefetch Behavior Matrix", en: "Prefetch behaviour matrix" },
  },
  {
    id: "takeaway",
    label: { bn: "Production Takeaways", en: "Production takeaways" },
  },
];

export default function LinkPrefetchingMechanics() {
  return (
    <article className="doc-prose">
      {/* ── The problem ───────────────────────────────────────────────── */}
      <H2 id="the-problem" anchorOnly>
        ক্লিক না করেই ডজন ডজন রিকোয়েস্ট
      </H2>

      <p>
        রাত ২:০০। ভুলু ভাই ই-কমার্স অ্যাপের All Products Grid পেজে কাজ করছেন। পেজে একসাথে
        ৫০টি প্রোডাক্টের কার্ড দেখাচ্ছে, আর প্রতিটি প্রোডাক্টের ক্যাটাগরি, ব্র্যান্ড ও
        ডিটেইলসের জন্য আলাদা আলাদা <code>&lt;Link&gt;</code> বসানো আছে। DevTools-এর Network
        Tab খুলে ভুলু ভাই আঁতকে উঠলেন!
      </p>

      <Line name="ভুলু ভাই">
        ফাহিম! সর্বনাশ হয়ে গেছে! আমি তো পেজে একটা লিংকেও ক্লিক করিনি, খালি মাউস নিয়ে স্ক্রোল
        করতেছি! অথচ ব্যাকগ্রাউন্ডে ধুমসে ডজন ডজন নেটওয়ার্ক রিকোয়েস্ট ফায়ার হচ্ছে! Next.js
        কি আমার না-ক্লিক-করা পেজগুলোও ব্যাকগ্রাউন্ডে ডাউনলোড করে সার্ভার ক্র্যাশ করাবে?
      </Line>

      <Line name="ফাহিম">
        ভুলু ভাই, ভয় পাওয়ার কিছু নেই! এটাকে বলে <strong>Automatic Prefetching</strong>।
        ইউজার যখন কোনো <code>&lt;Link&gt;</code> স্ক্রিনে (viewport) দেখতে পায়, Next.js আগেই
        ধরে নেয় ইউজার সেখানে ক্লিক করতে পারে। তাই ব্যাকগ্রাউন্ডে হালকা ওজনে ডেটা এনে Client
        Router Cache-এ জমিয়ে রাখে।
      </Line>

      <Line name="নেক্সট-ভাই">
        একদম! এই প্রি-ম্যাচিউর ডেটা ফেচিংয়ের কারণেই Next.js অ্যাপে পেজ ট্রানজিশন ইনস্ট্যান্ট
        (0ms feeling) মনে হয়। কিন্তু কোন রুটে ফুল ডেটা প্রিফেচ হবে আর কোন রুটে পার্শিয়াল
        লেআউট প্রিফেচ হবে — সেই সূক্ষ্ম মেকানিক্স বুঝতে হবে।
      </Line>

      {/* ── Architecture ──────────────────────────────────────────────── */}
      <H2 id="architecture">১. Prefetching Engine আর্কিটেকচার</H2>

      <Diagram>{`┌─────────────────────────────────────────────────────────────────────────┐
│                     <LINK> PREFETCHING ENGINE ARCHITECTURE              │
└─────────────────────────────────────────────────────────────────────────┘
                                     │
                    [<Link href="/products/123">]
                                     │
                         (Enters Viewport / Hover)
                                     │
                     ┌───────────────┴───────────────┐
                     ▼                               ▼
            [IntersectionObserver]          [Mouse Hover Event]
                     │                               │
                     └───────────────┬───────────────┘
                                     ▼
                    [Triggers Flight Request in BG]
                                     │
          ┌──────────────────────────┴──────────────────────────┐
          ▼                                                     ▼
  【 Static Route 】                                   【 Dynamic Route 】
  • Fetches FULL RSC Payload                           • Fetches PARTIAL RSC Payload
  • Cached in Router Cache                             • Shared Layout + loading.tsx only`}</Diagram>

      {/* ── Mechanics ─────────────────────────────────────────────────── */}
      <H2 id="mechanics">২. Prefetching-এর ৪টি মৌলিক মেকানিক্স</H2>

      <Note>
        <ul>
          <li>
            <strong>Viewport Detection:</strong> ব্রাউজারের ভিউপোর্টে যখনই কোনো{" "}
            <code>&lt;Link&gt;</code> এসে পৌঁছায়, Next.js-এর IntersectionObserver
            অটোমেটিক্যালি ব্যাকগ্রাউন্ডে রিকোয়েস্ট ট্রিগার করে।
          </li>
          <li>
            <strong>Static Route Prefetching:</strong> রুটটি স্ট্যাটিক হলে Next.js পুরো পেজের
            Full RSC Payload প্রিফেচ করে ক্লায়েন্ট রাউটার ক্যাশে রেখে দেয়।
          </li>
          <li>
            <strong>Dynamic Route Prefetching:</strong> রুটটি ডাইনামিক হলে সার্ভারে হেভি
            ডেটাবেস কোয়েরি এক্সিকিউট না করে শুধু শেয়ার্ড <code>layout</code> এবং{" "}
            <code>loading.tsx</code> বাউন্ডারিটুকু প্রিফেচ করা হয় — সার্ভারে চাপ পড়ে না।
          </li>
          <li>
            <strong>Router Cache Hydration:</strong> ইউজার যখন সত্যিকারের ক্লিক করে, তখন নতুন
            নেটওয়ার্ক রিকোয়েস্ট লাগে না — মেমরিতে থাকা প্রিফেচ করা ডেটা দিয়েই ইনস্ট্যান্ট পেজ
            রেন্ডার হয়।
          </li>
        </ul>
      </Note>

      {/* ── Implementation ────────────────────────────────────────────── */}
      <H2 id="implementation">৩. prefetch প্রপ কনফিগারেশন</H2>

      <H3>একই কার্ডে তিন রকম প্রিফেচ পলিসি</H3>

      <CodeBlock filename="components/product-card.tsx">{`import Link from 'next/link';

interface Product {
  id: string;
  title: string;
  price: number;
}

export function ProductCard({ product }: { product: Product }) {
  return (
    <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl flex flex-col justify-between">
      <div>
        <h3 className="font-semibold text-slate-100">{product.title}</h3>
        <p className="text-emerald-400 font-bold mt-1">\${product.price}</p>
      </div>

      <div className="mt-4 flex gap-2">
        {/* 1. Default (prefetch omitted): smart partial/full prefetching */}
        <Link
          href={\`/products/\${product.id}\`}
          className="text-xs bg-emerald-600 hover:bg-emerald-500 text-white px-3 py-1.5 rounded-md font-medium transition"
        >
          View Details
        </Link>

        {/* 2. Explicit opt-out: disables viewport prefetching.
            Useful for long lists (100+ items) to save bandwidth */}
        <Link
          href={\`/products/\${product.id}/reviews\`}
          prefetch={false}
          className="text-xs bg-slate-800 hover:bg-slate-700 text-slate-300 px-3 py-1.5 rounded-md transition"
        >
          Reviews
        </Link>

        {/* 3. Force full prefetch even for a dynamic route */}
        <Link
          href="/checkout"
          prefetch={true}
          className="text-xs bg-amber-600 hover:bg-amber-500 text-white px-3 py-1.5 rounded-md transition"
        >
          Buy Now
        </Link>
      </div>
    </div>
  );
}`}</CodeBlock>

      {/* ── Matrix ────────────────────────────────────────────────────── */}
      <H2 id="matrix">৪. Prefetch Behavior Matrix</H2>

      <Table
        head={["Props Option", "Static Route", "Dynamic Route", "সেরা ইউজ কেস"]}
        rows={[
          [
            <code key="null">prefetch={"{null}"}</code>,
            "Full Route (RSC Payload + data) প্রিফেচ হয়",
            <>
              শেয়ার্ড layout + <code>loading.tsx</code> প্রিফেচ হয়
            </>,
            "সাধারণ ওয়েবসাইট ও ড্যাশবোর্ড নেভিগেশন",
          ],
          [
            <code key="true">prefetch={"{true}"}</code>,
            "Full Route প্রিফেচ হয়",
            "Full Route (RSC Payload সহ) প্রিফেচ হয়",
            "পেমেন্ট, চেকআউট বা অতি-গুরুত্বপূর্ণ প্রাইমারি বোতাম",
          ],
          [
            <code key="false">prefetch={"{false}"}</code>,
            "ভিউপোর্টে এলে প্রিফেচ হয় না (হভার/ক্লিকে হয়)",
            "ভিউপোর্টে এলে প্রিফেচ হয় না (হভার/ক্লিকে হয়)",
            "বিশাল টেবিল, ৫০+ প্রোডাক্ট কার্ড বা ফুটারের অসংখ্য লিংক",
          ],
        ]}
      />

      <Line name="ভুলু ভাই">
        ওহ! তার মানে ৫০টা প্রোডাক্টের লিস্টে সবগুলোতে অন্ধের মতো প্রিফেচিং চালানোর দরকার নাই।
        প্রাইমারি বাটনে প্রিফেচ ডিফল্ট রাখব, আর সেকেন্ডারি লিংকে{" "}
        <code>prefetch={"{false}"}</code> মেরে দেব!
      </Line>

      {/* ── Takeaways ─────────────────────────────────────────────────── */}
      <H2 id="takeaway">Production Takeaways</H2>

      <Note>
        <ul>
          <li>
            <strong>Bandwidth vs UX Balance:</strong> ডাইনামিক রুটে Next.js শুধু{" "}
            <code>loading.tsx</code> ও শেয়ার্ড লেআউট প্রিফেচ করে বলে সার্ভারে অনর্থক ডেটাবেস
            হিট পড়ে না — স্কেলেবিলিটি বজায় থাকে।
          </li>
          <li>
            <strong>Prevent Network Flooding:</strong> একই পেজে শতাধিক লিংকের গ্রিড থাকলে{" "}
            <code>prefetch={"{false}"}</code> ব্যবহার করুন, নাহলে ইউজারের ডেটা ব্যাকগ্রাউন্ডে
            অপচয় হবে।
          </li>
          <li>
            <strong>Instant Feel with loading.tsx:</strong> ডাইনামিক পেজে ডিফল্ট প্রিফেচ থাকলে
            ক্লিকের সাথে সাথেই <code>loading.tsx</code>-এর স্কেলিটন UI ভেসে ওঠে, কারণ সেই
            অংশটুকু আগেই ক্লায়েন্ট ক্যাশে চলে এসেছে।
          </li>
        </ul>
      </Note>
    </article>
  );
}
