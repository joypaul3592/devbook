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
      bn: "HTML-এর পাশে .rsc ফাইলটা কী?",
      en: "What is that .rsc response?",
    },
  },
  {
    id: "architecture",
    label: { bn: "SSR Lifecycle আর্কিটেকচার", en: "SSR lifecycle architecture" },
  },
  {
    id: "phases",
    label: { bn: "৪টি ফেজের ব্রেকডাউন", en: "The four phases" },
  },
  {
    id: "implementation",
    label: { bn: "সার্ভার ও ক্লায়েন্টের হ্যান্ডঅফ", en: "The server/client handoff" },
  },
  {
    id: "matrix",
    label: { bn: "Phase Matrix", en: "Phase matrix" },
  },
  {
    id: "takeaway",
    label: { bn: "Production Takeaways", en: "Production takeaways" },
  },
];

export default function ServerSideRenderingLifecycle() {
  return (
    <article className="doc-prose">
      {/* ── The problem ───────────────────────────────────────────────── */}
      <H2 id="the-problem" anchorOnly>
        HTML-এর পাশে .rsc ফাইলটা কী?
      </H2>

      <p>
        সন্ধ্যা ৬:০০। ভুলু ভাই DevTools-এর Network Tab খুলে গভীরভাবে পর্যবেক্ষণ করছেন। তিনি
        দেখলেন একটি পেজ রিকোয়েস্টে কেবল HTML নামছে না — ব্যাকগ্রাউন্ডে <code>?_rsc=...</code>{" "}
        নামের একটি স্পেশাল রেসপন্সও নামছে। পেজ লোড হওয়ার সাথে সাথে বাটনে ক্লিক করলে কোনো রিফ্রেশ
        ছাড়াই সাথে সাথে রেসপন্ড করছে!
      </p>

      <Line name="ভুলু ভাই">
        ফাহিম! আমি তো জানতাম সার্ভার-সাইড রেন্ডারিং মানে সার্ভার শুধু HTML পাঠিয়ে দেয়। কিন্তু App
        Router-এ সার্ভার থেকে RSC Payload নামে কী আসছে? আর ব্রাউজারে এসে স্ট্যাটিক HTML নিমিষে
        ইন্টার‌্যাক্টিভ React অ্যাপে রূপ নিচ্ছে কীভাবে?
      </Line>

      <Line name="ফাহিম">
        ভুলু ভাই! App Router-এর SSR ট্র্যাডিশনাল SSR-এর মতো নয়। এটি ৪ ধাপের একটি লাইফসাইকেল মেনে
        চলে — সার্ভারে <strong>RSC Payload Generation</strong>, তারপর{" "}
        <strong>Pre-rendered HTML Streaming</strong>, ব্রাউজারে <strong>Hydration</strong>, এবং
        শেষে <strong>Client-Side SPA Takeover</strong>।
      </Line>

      {/* ── Architecture ──────────────────────────────────────────────── */}
      <H2 id="architecture">১. SSR Lifecycle আর্কিটেকচার</H2>

      <Diagram>{`┌─────────────────────────────────────────────────────────────────────────┐
│                    SERVER-SIDE RENDERING LIFECYCLE                      │
└─────────────────────────────────────────────────────────────────────────┘

  【 PHASE 1: SERVER EXECUTION 】
  • Server executes React Server Components (RSC)
  • Fetches database / API data
  • Generates the RSC payload (JSON-like representation of the UI tree & props)
                                     │
                                     ▼
  【 PHASE 2: HTML PRE-RENDERING & STREAMING 】
  • Next.js converts the RSC payload into the initial HTML structure
  • Streams HTML instantly to the browser ──▶ user sees static UI (FCP)
                                     │
                                     ▼
  【 PHASE 3: CLIENT HYDRATION 】
  • Browser downloads the client JS bundles ('use client' components)
  • React walks the DOM, matches RSC payload references, attaches event listeners
  • Static HTML becomes fully interactive ──▶ user can click & interact (TTI)
                                     │
                                     ▼
  【 PHASE 4: CLIENT SPA TAKEOVER 】
  • Subsequent navigations (<Link href="...">) never request full HTML
  • Browser fetches ONLY a fresh RSC payload & updates the client router cache`}</Diagram>

      {/* ── Phases ────────────────────────────────────────────────────── */}
      <H2 id="phases">২. লাইফসাইকেলের ৪টি ফেজ</H2>

      <H3>Phase 1 — RSC Payload Generation (server-side)</H3>

      <p>
        সার্ভারে রিকোয়েস্ট এলে Next.js সার্ভার কম্পোনেন্টগুলো এক্সিকিউট করে, স্ট্যাটিক ডেটা ও HTML
        নোড সরাসরি প্রসেস করে। <code>&apos;use client&apos;</code> চিহ্নিত কম্পোনেন্টগুলোর কোড
        সার্ভারে এক্সিকিউট করে না — সেখানে একটি{" "}
        <strong>client module reference placeholder</strong> এবং তার সিরিয়ালাইজেবল প্রপস বসিয়ে
        দেয়। এই পুরো স্ট্রাকচারটিই RSC Payload।
      </p>

      <H3>Phase 2 — HTML Generation &amp; Streaming</H3>

      <p>
        RSC Payload তৈরি হওয়ার পর Next.js সেটিকে নন-ইন্টার‌্যাক্টিভ HTML-এ কনভার্ট করে ব্রাউজারে
        স্ট্রিম করে। ফলে ইউজার সাথে সাথে পেজের ফার্স্ট ভিউ দেখতে পায় (FCP)।
      </p>

      <H3>Phase 3 — Client Hydration</H3>

      <p>
        ব্রাউজারে HTML আসার পর ব্যাকগ্রাউন্ডে ক্লায়েন্ট JS বান্ডল নামতে থাকে। React ব্রাউজারের
        DOM-এর সাথে RSC Payload মিলিয়ে দেখে এবং <code>&apos;use client&apos;</code> কম্পোনেন্টে
        event listener ও state কানেক্ট করে দেয়।
      </p>

      <Note>
        <p>
          <strong>⚠️ Hydration mismatch:</strong> সার্ভারের জেনারেট করা HTML আর ক্লায়েন্টের ফার্স্ট
          রেন্ডারড DOM হুবহু এক না হলে (যেমন <code>new Date()</code> বা <code>window</code>{" "}
          অবজেক্টের কারণে) React hydration error থ্রো করে।
        </p>
      </Note>

      <H3>Phase 4 — Client SPA Takeover</H3>

      <p>
        Hydration শেষ হলে Next.js ক্লায়েন্ট রাউটার অ্যাপের পূর্ণ নিয়ন্ত্রণ নেয়। এরপর ইউজার লিংকে
        ক্লিক করলে অ্যাপ আর সম্পূর্ণ নতুন HTML আনে না — কেবল নতুন পেজের RSC Payload ফেচ করে
        ক্লায়েন্ট-সাইডে রেন্ডার করে।
      </p>

      {/* ── Implementation ────────────────────────────────────────────── */}
      <H2 id="implementation">৩. সার্ভার ও ক্লায়েন্টের হ্যান্ডঅফ</H2>

      <H3>A — Server component (Phase 1 &amp; 2)</H3>

      <CodeBlock filename="app/products/[id]/page.tsx">{`import { notFound } from 'next/navigation';
import { AddToCartButton } from './_components/add-to-cart-button';

interface ProductPageProps {
  params: Promise<{ id: string }>;
}

async function getProduct(id: string) {
  // DB call running ONLY on the server
  return {
    id,
    title: 'Mechanical Gaming Keyboard',
    price: 120,
    stock: 15,
  };
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { id } = await params;
  const product = await getProduct(id);

  if (!product) notFound();

  return (
    <div className="max-w-xl mx-auto py-10 px-6 bg-slate-900 border border-slate-800 rounded-2xl text-slate-100 space-y-6">
      <div>
        <span className="text-xs font-mono text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded">
          Server Component (RSC)
        </span>
        <h1 className="text-2xl font-bold mt-2">{product.title}</h1>
        <p className="text-lg font-semibold text-emerald-400 mt-1">
          \${product.price}
        </p>
      </div>

      {/* Client component placeholder inside the RSC payload.
          The server passes serializable props across the boundary. */}
      <AddToCartButton productId={product.id} stock={product.stock} />
    </div>
  );
}`}</CodeBlock>

      <H3>B — Client component (Phase 3 hydration)</H3>

      <CodeBlock filename="app/products/[id]/_components/add-to-cart-button.tsx">{`'use client';

import { useState } from 'react';

interface AddToCartProps {
  productId: string;
  stock: number;
}

export function AddToCartButton({ productId, stock }: AddToCartProps) {
  // State & event listeners attach ONLY during phase 3 (hydration)
  const [count, setCount] = useState(1);
  const [isAdded, setIsAdded] = useState(false);

  const handleAddToCart = () => {
    setIsAdded(true);
    setTimeout(() => setIsAdded(false), 2000);
  };

  return (
    <div className="space-y-4 pt-4 border-t border-slate-800">
      <div className="flex items-center space-x-3">
        <button
          onClick={() => setCount((prev) => Math.max(1, prev - 1))}
          className="w-8 h-8 bg-slate-800 hover:bg-slate-700 rounded-lg flex items-center justify-center font-bold"
        >
          -
        </button>
        <span className="font-mono text-sm px-2">{count}</span>
        <button
          onClick={() => setCount((prev) => Math.min(stock, prev + 1))}
          className="w-8 h-8 bg-slate-800 hover:bg-slate-700 rounded-lg flex items-center justify-center font-bold"
        >
          +
        </button>
      </div>

      <button
        onClick={handleAddToCart}
        className={\`w-full py-2.5 rounded-xl font-semibold text-sm transition \${
          isAdded
            ? 'bg-emerald-500 text-slate-950'
            : 'bg-emerald-600 hover:bg-emerald-500 text-white'
        }\`}
      >
        {isAdded ? 'Added to cart!' : \`Add \${count} to cart\`}
      </button>
    </div>
  );
}`}</CodeBlock>

      {/* ── Matrix ────────────────────────────────────────────────────── */}
      <H2 id="matrix">৪. Lifecycle Phase Matrix</H2>

      <Table
        head={["ফেজ", "এক্সিকিউশন লোকেশন", "আউটপুট", "ইউজার অভিজ্ঞতা"]}
        rows={[
          [
            "১. RSC payload generation",
            "Server",
            "JSON-ish component tree representation",
            "ব্যাকগ্রাউন্ড প্রসেসিং (দৃশ্যমান নয়)",
          ],
          [
            "২. Initial HTML streaming",
            "Server → network",
            "Raw non-interactive HTML",
            "FCP — দ্রুত ভিজ্যুয়াল",
          ],
          [
            "৩. Hydration",
            "Browser",
            "Interactivity attached via JS",
            "TTI — পূর্ণ ইন্টার‌্যাক্টিভ অ্যাপ",
          ],
          [
            "৪. Client router takeover",
            "Browser",
            "Soft navigation ও sub-tree re-render",
            "SPA-এর মতো ইনস্ট্যান্ট নেভিগেশন",
          ],
        ]}
      />

      <Line name="ভুলু ভাই">
        লাইফসাইকেলটা এখন একদম পরিষ্কার! সার্ভার প্রথমে RSC Payload আর HTML বানিয়ে পাঠিয়ে fast
        visual নিশ্চিত করে, আর ব্রাউজারে JS এসে hydration শেষ করে অ্যাপকে SPA-এর মতো টেকওভার করে!
      </Line>

      {/* ── Takeaways ─────────────────────────────────────────────────── */}
      <H2 id="takeaway">Production Takeaways</H2>

      <Note>
        <ul>
          <li>
            <strong>RSC payload is the source of truth:</strong> সার্ভার শুধু HTML নয়, RSC Payload
            পাঠায় বলেই ক্লায়েন্ট-সাইড hydration ও React state reconciliation এত স্মুথ হয়।
          </li>
          <li>
            <strong>Avoid hydration mismatch:</strong> সার্ভারে তৈরি HTML আর ক্লায়েন্টের প্রথম
            রেন্ডার হুবহু এক হতে হবে। <code>Date.now()</code>, <code>Math.random()</code> বা{" "}
            <code>window.innerWidth</code> সরাসরি রেন্ডার ট্রি-তে ব্যবহার করবেন না।
          </li>
          <li>
            <strong>Keep props serializable:</strong> সার্ভার থেকে ক্লায়েন্ট কম্পোনেন্টে শুধু
            serializable ডেটা (object, string, number, array) পাঠানো যায় — ফাংশন প্রপ হিসেবে
            পাঠানো যাবে না (Server Actions ব্যতীত)।
          </li>
        </ul>
      </Note>
    </article>
  );
}
