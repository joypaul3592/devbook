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
      bn: "লিংক পাঠালে ফিল্টার গায়েব",
      en: "Share the link, lose the filters",
    },
  },
  {
    id: "architecture",
    label: {
      bn: "URL as Single Source of Truth",
      en: "URL as single source of truth",
    },
  },
  {
    id: "why",
    label: { bn: "কেন useState নয়?", en: "Why not useState?" },
  },
  {
    id: "implementation",
    label: { bn: "প্রোডাকশন ফিল্টার সিস্টেম", en: "A production filter system" },
  },
  {
    id: "takeaway",
    label: { bn: "Production Takeaways", en: "Production takeaways" },
  },
];

export default function UrlStateArchitecture() {
  return (
    <article className="doc-prose">
      {/* ── The problem ───────────────────────────────────────────────── */}
      <H2 id="the-problem" anchorOnly>
        লিংক পাঠালে ফিল্টার গায়েব
      </H2>

      <p>
        রাত ৩:৪৫। ভুলু ভাই একটি অ্যাডভান্সড ই-কমার্স ক্যাটালগ পেজ বানাচ্ছেন। পেজে ক্যাটাগরি
        &quot;Electronics&quot;, প্রাইস রেঞ্জ &quot;5000–20000 BDT&quot; আর সর্টিং
        &quot;Price Low to High&quot; — সব ফিল্টার বেছে তিনি টিম লিডারকে লিংক পাঠালেন। টিম
        লিডার লিংক ওপেন করেই ফোন দিলেন!
      </p>

      <Line name="ভুলু ভাই">
        ফাহিম! এত ফিল্টার সিলেক্ট করে লিংকটা কপি করে পাঠালাম, কিন্তু উনি লিংক খুলে দেখেন কোনো
        ফিল্টারই অ্যাপ্লাই হয়নি — ডিফল্ট ফার্স্ট পেজ দেখাচ্ছে! এমনকি পেজটা রিফ্রেশ দিলেও সব
        ফিল্টার গায়েব! React <code>useState</code> দিয়ে ফিল্টার ম্যানেজ করছিলাম, কেন এমন হলো?
      </Line>

      <Line name="ফাহিম">
        ভুলু ভাই! কারণ <code>useState</code> মেমরিতে টিকে থাকে, কিন্তু URL বা ব্রাউজার
        হিস্ট্রিতে এর কোনো অস্তিত্ব থাকে না! বুকমার্কিং, শেয়ারিং, এমনকি Back/Forward বাটনের
        সুবিধার জন্য URL-কে <strong>Single Source of Truth</strong> হিসেবে আর্কিটেক্ট করতে হয়।
      </Line>

      <Line name="নেক্সট-ভাই">
        একদম! App Router-এর মূল দর্শন হলো — <strong>UI state follows the URL, not React
        state</strong>। ফিল্টার চেঞ্জ হলে আমরা React স্টেট নয়, URL-এর{" "}
        <code>searchParams</code> চেঞ্জ করব। সার্ভার কম্পোনেন্ট সেই <code>searchParams</code>{" "}
        পড়ে অটোমেটিক ডেটা রি-ফেচ করে আপডেটেড UI পাঠিয়ে দেবে।
      </Line>

      {/* ── Architecture ──────────────────────────────────────────────── */}
      <H2 id="architecture">১. URL State Architecture Flow</H2>

      <Diagram>{`┌─────────────────────────────────────────────────────────────────────────┐
│                    URL AS SINGLE SOURCE OF TRUTH FLOW                   │
└─────────────────────────────────────────────────────────────────────────┘
                                     │
   [1. User Interaction] ───▶ User changes a select filter / search input
                                     │
   [2. URL Sync]         ───▶ Client updates URL searchParams via router.replace()
                              e.g. /products?category=electronics&sort=asc
                                     │
   [3. Server Trigger]   ───▶ Next.js fires a Flight Request with the updated URL
                                     │
   [4. Server Execution] ───▶ Server Component reads searchParams & queries the DB
                                     │
   [5. UI Render]        ───▶ Server streams the updated product list to the client
                              (the URL is now shareable & bookmarkable)`}</Diagram>

      {/* ── Why ───────────────────────────────────────────────────────── */}
      <H2 id="why">২. কেন URL-কে Single Source of Truth বানাবেন?</H2>

      <Table
        head={[
          "ফিচার",
          <>
            React <code>useState</code>
          </>,
          <>
            URL <code>searchParams</code>
          </>,
        ]}
        rows={[
          [
            "Shareability",
            "লিংক কপি করলে ফিল্টার স্টেট শেয়ার হয় না",
            "যে কেউ ওই লিংকে হুবহু একই ফিল্টার দেখবে",
          ],
          [
            "Refresh persistence",
            "রিফ্রেশ দিলে স্টেট পুরোপুরি মুছে যায়",
            "রিফ্রেশ দিলেও ফিল্টার টিকে থাকে",
          ],
          [
            "Back / forward",
            "ব্রাউজার হিস্ট্রি ট্র্যাকিং হয় না",
            "ব্যাক/ফরওয়ার্ডে ফিল্টার অটো আপডেট হয়",
          ],
          [
            "Server fetching",
            "সার্ভার সরাসরি ক্লায়েন্ট স্টেট পড়তে পারে না",
            <>
              সার্ভার কম্পোনেন্ট <code>searchParams</code> প্রপ থেকে সরাসরি পড়ে
            </>,
          ],
        ]}
      />

      {/* ── Implementation ────────────────────────────────────────────── */}
      <H2 id="implementation">৩. প্রোডাকশন ফিল্টার সিস্টেম</H2>

      <H3>A — Server component reads searchParams</H3>

      <CodeBlock filename="app/products/page.tsx">{`import { ProductFilters } from './_components/product-filters';
import { ProductGrid } from './_components/product-grid';

interface PageProps {
  searchParams: Promise<{
    category?: string;
    sort?: string;
    page?: string;
  }>;
}

export default async function ProductsPage({ searchParams }: PageProps) {
  // Next.js 15+ hands searchParams over as a Promise
  const filters = await searchParams;

  const currentCategory = filters.category || 'all';
  const currentSort = filters.sort || 'newest';
  const currentPage = Number(filters.page) || 1;

  return (
    <main className="min-h-screen bg-slate-950 text-slate-100 p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        <header className="border-b border-slate-800 pb-4">
          <h1 className="text-2xl font-bold">Product Catalog</h1>
          <p className="text-sm text-slate-400">
            Active filter:{' '}
            <code className="text-emerald-400">
              category={currentCategory}&sort={currentSort}
            </code>
          </p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {/* Client filter controls */}
          <aside className="md:col-span-1">
            <ProductFilters
              currentCategory={currentCategory}
              currentSort={currentSort}
            />
          </aside>

          {/* Dynamic product grid rendered on the server */}
          <section className="md:col-span-3">
            <ProductGrid
              category={currentCategory}
              sort={currentSort}
              page={currentPage}
            />
          </section>
        </div>
      </div>
    </main>
  );
}`}</CodeBlock>

      <H3>B — Client filter writes to the URL, not to state</H3>

      <CodeBlock filename="app/products/_components/product-filters.tsx">{`'use client';

import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useTransition } from 'react';

interface ProductFiltersProps {
  currentCategory: string;
  currentSort: string;
}

export function ProductFilters({ currentCategory, currentSort }: ProductFiltersProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  const updateQueryParam = (key: string, value: string) => {
    // Clone the existing params so other active filters survive
    const params = new URLSearchParams(searchParams.toString());

    if (value && value !== 'all') {
      params.set(key, value);
    } else {
      params.delete(key); // keep the URL clean on a default value
    }

    // Reset pagination to page 1 whenever a filter changes
    params.delete('page');

    startTransition(() => {
      // replace() updates the URL without polluting the history stack
      router.replace(\`\${pathname}?\${params.toString()}\`, { scroll: false });
    });
  };

  return (
    <div className={\`p-4 bg-slate-900 border border-slate-800 rounded-xl space-y-4 \${isPending ? 'opacity-60' : ''}\`}>
      <h3 className="font-semibold text-slate-200">Filters</h3>

      <div>
        <label className="block text-xs font-medium text-slate-400 mb-1">Category</label>
        <select
          value={currentCategory}
          onChange={(e) => updateQueryParam('category', e.target.value)}
          className="w-full bg-slate-950 border border-slate-800 text-slate-200 text-sm p-2 rounded-lg outline-none focus:border-emerald-500"
        >
          <option value="all">All Categories</option>
          <option value="electronics">Electronics</option>
          <option value="clothing">Clothing</option>
          <option value="accessories">Accessories</option>
        </select>
      </div>

      <div>
        <label className="block text-xs font-medium text-slate-400 mb-1">Sort By</label>
        <select
          value={currentSort}
          onChange={(e) => updateQueryParam('sort', e.target.value)}
          className="w-full bg-slate-950 border border-slate-800 text-slate-200 text-sm p-2 rounded-lg outline-none focus:border-emerald-500"
        >
          <option value="newest">Newest Arrivals</option>
          <option value="price_asc">Price: Low to High</option>
          <option value="price_desc">Price: High to Low</option>
        </select>
      </div>

      {isPending && (
        <p className="text-xs text-amber-400 animate-pulse">Updating catalogue...</p>
      )}
    </div>
  );
}`}</CodeBlock>

      <Line name="ভুলু ভাই">
        ফাটাফাটি! এবার কোনো <code>useState</code> ছাড়াই পেজ ফিল্টার হচ্ছে, রিফ্রেশ দিলেও ফিল্টার
        সরছে না, আর লিংক কপি করে যার কাছেই পাঠাচ্ছি সে হুবহু একই লিস্ট দেখছে!
      </Line>

      {/* ── Takeaways ─────────────────────────────────────────────────── */}
      <H2 id="takeaway">Production Takeaways</H2>

      <Note>
        <ul>
          <li>
            <strong>URL-driven UI:</strong> ফিল্টার, সার্চ কোয়েরি, সর্টিং ও পেজিনেশন স্টেট কখনো{" "}
            <code>useState</code>-এ আটকে রাখবেন না — এগুলো সবসময় URL query parameter-এ রাখুন।
          </li>
          <li>
            <strong>Preserve existing parameters:</strong> আপডেটের সময় সবসময়{" "}
            <code>new URLSearchParams(searchParams.toString())</code> ক্লোন করে কাজ করুন, নাহলে
            এক ফিল্টার আপডেট করতে গিয়ে অন্য সক্রিয় ফিল্টার মুছে যাবে।
          </li>
          <li>
            <strong>replace vs push:</strong> ফিল্টার টগলে <code>router.push()</code> দিলে প্রতি
            চেঞ্জে নতুন হিস্ট্রি এন্ট্রি তৈরি হয় — ব্যাক বাটনে বারবার চাপতে হয়। তাই ফিল্টারিংয়ে{" "}
            <code>router.replace</code> ও <code>{"{ scroll: false }"}</code> ব্যবহার করুন।
          </li>
        </ul>
      </Note>
    </article>
  );
}
