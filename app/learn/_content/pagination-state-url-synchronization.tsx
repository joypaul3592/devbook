import {
  CodeBlock,
  Diagram,
  H2,
  H3,
  Line,
  Note,
} from "@/components/learn/DocParts";
import type { Bi } from "@/lib/curriculum";

/** Section anchors — consumed by the "on this page" rail. */
export const headings: { id: string; label: Bi }[] = [
  {
    id: "the-problem",
    label: {
      bn: "ডেটা আছে, তবু No Products Found",
      en: "Data exists, yet the page is empty",
    },
  },
  {
    id: "architecture",
    label: { bn: "Boundary Reset আর্কিটেকচার", en: "Boundary reset architecture" },
  },
  {
    id: "server",
    label: { bn: "সার্ভার সাইড: Safe Parsing", en: "Server side: safe parsing" },
  },
  {
    id: "client",
    label: { bn: "ক্লায়েন্ট সাইড: Boundary Guard", en: "Client side: boundary guard" },
  },
  {
    id: "takeaway",
    label: { bn: "Production Takeaways", en: "Production takeaways" },
  },
];

export default function PaginationStateUrlSync() {
  return (
    <article className="doc-prose">
      {/* ── The problem ───────────────────────────────────────────────── */}
      <H2 id="the-problem" anchorOnly>
        ডেটা আছে, তবু No Products Found
      </H2>

      <p>
        বিকেল ৪:২০। ভুলু ভাই প্রোডাক্ট ক্যাটালগের ১০ নম্বর পেজে (<code>/products?page=10</code>)।
        হঠাৎ ড্রপডাউন থেকে ক্যাটাগরি সিলেক্ট করলেন &quot;Laptops&quot;। সাথে সাথে UI-তে ভেসে
        উঠল &quot;No Products Found!&quot; — অথচ ব্যাকএন্ডে ল্যাপটপ ক্যাটাগরিতে ৫টি প্রোডাক্ট
        আছে!
      </p>

      <Line name="ভুলু ভাই">
        ফাহিম! এ কেমন ভুতুড়ে কাণ্ড? ডেটাবেসে ৫টা ল্যাপটপ আছে, কিন্তু ক্যাটাগরি সিলেক্ট করলে ফাঁকা
        পেজ কেন দেখায়? ডেটাবেস কি ক্র্যাশ করল?
      </Line>

      <Line name="ফাহিম">
        ডেটাবেস ঠিকই আছে! সমস্যা হলো URL-এ এখনও <code>page=10</code> লেগে আছে। মোট ল্যাপটপ ৫টি,
        অর্থাৎ পেজ সংখ্যা ১টি। কিন্তু আপনার কোয়েরি <code>skip: (10 - 1) * 10 = 90</code> করে ৯০
        নম্বর আইটেমের পর থেকে ডেটা খুঁজছে — ফলে ফাঁকা অ্যারে রিটার্ন করছে।
      </Line>

      <Line name="নেক্সট-ভাই">
        প্রোডাকশন-গ্রেডে URL-driven pagination ইমপ্লিমেন্ট করতে ৩টি বিষয় বাধ্যতামূলক —{" "}
        <strong>State Preservation</strong> (পেজ বদলালেও ফিল্টার অক্ষুণ্ণ),{" "}
        <strong>Boundary Reset</strong> (ফিল্টার বদলালেই <code>page=1</code>), আর{" "}
        <strong>Out-of-Bounds Validation</strong> (কেউ <code>?page=9999</code> বসালে সেফলি
        হ্যান্ডেল)।
      </Line>

      {/* ── Architecture ──────────────────────────────────────────────── */}
      <H2 id="architecture">১. Boundary Reset আর্কিটেকচার</H2>

      <Diagram>{`┌─────────────────────────────────────────────────────────────────────────┐
│                    URL-DRIVEN PAGINATION LIFECYCLE                      │
└─────────────────────────────────────────────────────────────────────────┘
                                     │
    ┌────────────────────────────────┴────────────────────────────────┐
    ▼                                                                 ▼
【 USER CHANGES FILTER 】                                  【 USER CHANGES PAGE 】
 (e.g. search / category)                                 (e.g. click next / prev)
    │                                                                 │
    ▼                                                                 ▼
 Reset the page param!                                  Preserve the current filters!
 Set ?page=1 & update category                          Set ?page=N & keep category
    │                                                                 │
    └────────────────────────────────┬────────────────────────────────┘
                                     ▼
                  [Server Component Query Execution]
           Calculate: skip = (page - 1) * pageSize, take = pageSize
                                     │
                                     ▼
                      Render UI with page boundary controls`}</Diagram>

      {/* ── Server ────────────────────────────────────────────────────── */}
      <H2 id="server">২. সার্ভার সাইড — Safe Parsing ও Total Count</H2>

      <CodeBlock filename="app/products/page.tsx">{`import { ProductGrid } from './_components/product-grid';
import { PaginationControls } from './_components/pagination-controls';

interface PageProps {
  searchParams: Promise<{
    category?: string;
    search?: string;
    page?: string;
  }>;
}

const PAGE_SIZE = 6;

export default async function ProductsPage({ searchParams }: PageProps) {
  const params = await searchParams;

  // 1. Boundary-safe page parsing
  const rawPage = Number(params.page);
  const currentPage = !isNaN(rawPage) && rawPage > 0 ? rawPage : 1;

  const currentCategory = params.category || 'all';
  const currentSearch = params.search || '';

  // 2. Fetch the total count and the paginated slice together
  const { products, totalCount } = await fetchProductsFromDB({
    category: currentCategory,
    search: currentSearch,
    page: currentPage,
    pageSize: PAGE_SIZE,
  });

  const totalPages = Math.ceil(totalCount / PAGE_SIZE);

  return (
    <main className="min-h-screen bg-slate-950 text-slate-100 p-8">
      <div className="max-w-6xl mx-auto space-y-8">
        <header className="flex justify-between items-center border-b border-slate-800 pb-4">
          <h1 className="text-2xl font-bold">Catalog Management</h1>
          <p className="text-sm text-slate-400">
            Showing page{' '}
            <span className="text-emerald-400 font-semibold">{currentPage}</span> of{' '}
            {totalPages || 1}
          </p>
        </header>

        <ProductGrid products={products} />

        {/* URL-synced client pagination controls */}
        <PaginationControls
          currentPage={currentPage}
          totalPages={totalPages}
          totalCount={totalCount}
        />
      </div>
    </main>
  );
}

// Stand-in for the real query:
// prisma.product.findMany({ skip: (page - 1) * pageSize, take: pageSize })
async function fetchProductsFromDB({ page, pageSize }: {
  category: string;
  search: string;
  page: number;
  pageSize: number;
}) {
  return {
    products: Array.from({ length: pageSize }, (_, i) => ({
      id: (page - 1) * pageSize + i + 1,
      name: \`Product Item #\${(page - 1) * pageSize + i + 1}\`,
    })),
    totalCount: 42,
  };
}`}</CodeBlock>

      {/* ── Client ────────────────────────────────────────────────────── */}
      <H2 id="client">৩. ক্লায়েন্ট সাইড — Boundary Guard সহ কন্ট্রোল</H2>

      <H3>ফিল্টার না হারিয়ে পেজ বদলানো</H3>

      <CodeBlock filename="app/products/_components/pagination-controls.tsx">{`'use client';

import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useTransition } from 'react';

interface PaginationControlsProps {
  currentPage: number;
  totalPages: number;
  totalCount: number;
}

export function PaginationControls({
  currentPage,
  totalPages,
  totalCount,
}: PaginationControlsProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  const handlePageChange = (newPage: number) => {
    // Boundary check: never navigate outside the valid range
    if (newPage < 1 || newPage > totalPages || newPage === currentPage) return;

    const params = new URLSearchParams(searchParams.toString());

    if (newPage === 1) {
      params.delete('page'); // clean URL for page 1
    } else {
      params.set('page', newPage.toString());
    }

    startTransition(() => {
      router.push(\`\${pathname}?\${params.toString()}\`);
    });
  };

  if (totalPages <= 1) return null;

  return (
    <div className="flex items-center justify-between bg-slate-900 border border-slate-800 p-4 rounded-xl">
      <span className="text-xs text-slate-400">
        Total items: <strong className="text-slate-200">{totalCount}</strong>
      </span>

      <div className="flex items-center gap-2">
        <button
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage <= 1 || isPending}
          className="px-3 py-1.5 text-xs font-medium rounded-lg bg-slate-800 text-slate-200 hover:bg-slate-700 disabled:opacity-40 disabled:cursor-not-allowed transition"
        >
          Previous
        </button>

        <span className="px-3 py-1 text-xs text-slate-300 font-mono">
          {currentPage} / {totalPages}
        </span>

        <button
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage >= totalPages || isPending}
          className="px-3 py-1.5 text-xs font-medium rounded-lg bg-emerald-600 text-white hover:bg-emerald-500 disabled:opacity-40 disabled:cursor-not-allowed transition"
        >
          {isPending ? 'Loading...' : 'Next'}
        </button>
      </div>
    </div>
  );
}`}</CodeBlock>

      <Line name="ভুলু ভাই">
        অসাধারণ! এখন যেকোনো ফিল্টার সিলেক্ট করলেই পেজ অটোমেটিক ১-এ রিসেট হয়ে যাচ্ছে, কোনো ডেটা
        মিস হচ্ছে না। আর পেজ ৩ বা ৪-এর লিংক কপি করে পাঠালে ওরাও ঠিক ওই পেজের ডেটাই দেখছে!
      </Line>

      {/* ── Takeaways ─────────────────────────────────────────────────── */}
      <H2 id="takeaway">Production Takeaways</H2>

      <Note>
        <ul>
          <li>
            <strong>Boundary reset rule:</strong> যেকোনো ফিল্টারিং, সার্চিং বা ক্যাটাগরি চেঞ্জে{" "}
            <code>params.delete(&apos;page&apos;)</code> করতে হবে। পেজিনেশন ফিল্টারের সাপেক্ষে
            রিসেট না হলে ইউজার ফাঁকা রেজাল্ট দেখবে।
          </li>
          <li>
            <strong>URL cleanup on page 1:</strong> ইউজার পেজ ১-এ থাকলে <code>?page=1</code>{" "}
            প্যারামিটারটি মুছে দেওয়াই ক্লিন URL কনভেনশন।
          </li>
          <li>
            <strong>Safe parsing on the server:</strong> <code>params.page</code> সবসময় string।{" "}
            <code>Number()</code>-এ কাস্ট করার পর <code>isNaN()</code> ও{" "}
            <code>page &lt; 1</code> চেক না করলে ডেটাবেস <code>NaN</code> বা negative skip-এ
            এরর থ্রো করবে।
          </li>
        </ul>
      </Note>
    </article>
  );
}
