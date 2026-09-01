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
      bn: "রিফ্রেশ দিলেই স্টেট গায়েব",
      en: "Refresh, and the state is gone",
    },
  },
  {
    id: "architecture",
    label: {
      bn: "স্টেটের চারটি স্তর",
      en: "The four layers of state",
    },
  },
  {
    id: "mechanisms",
    label: {
      bn: "৩টি সেপারেশন রুল",
      en: "Three separation rules",
    },
  },
  {
    id: "implementation",
    label: {
      bn: "URL state ও SSR-safe store",
      en: "URL state & an SSR-safe store",
    },
  },
  {
    id: "matrix",
    label: { bn: "কোন স্টেট কোথায়", en: "Which state lives where" },
  },
  {
    id: "takeaway",
    label: { bn: "Production Takeaways", en: "Production takeaways" },
  },
];

export default function StateManagementArchitecture() {
  return (
    <article className="doc-prose">
      {/* ── The problem ───────────────────────────────────────────────── */}
      <H2 id="the-problem" anchorOnly>
        রিফ্রেশ দিলেই স্টেট গায়েব
      </H2>

      <p>
        দুপুর ২:৪৫। সার্চ ফিল্টার উইজেট নিয়ে কাজ করতে গিয়ে ভুলু ভাই আবার বিপদে। ক্যাটাগরি আর প্রাইস
        রেঞ্জ সিলেক্ট করার পর পেজ রিফ্রেশ দিলেই সব স্টেট গায়েব। এর ওপর লাল অক্ষরে hydration error:{" "}
        <em>Text content does not match server-rendered HTML</em>। রেগে গিয়ে তিনি পুরো অ্যাপটাকেই
        একটা গ্লোবাল স্টোরে র‍্যাপ করে ফেলার সিদ্ধান্ত নিলেন।
      </p>

      <Line name="ভুলু ভাই">
        ফাহিম! App Router-এ এসে স্টেট ম্যানেজমেন্ট এত প্যাঁচালো কেন? রিফ্রেশ দিলে বা লিংক শেয়ার করলে
        স্টেট চলে যায় কেন? আর Zustand ব্যবহার করতে গেলেই hydration error কেন আসে?
      </Line>

      <Line name="ফাহিম">
        ভুলু ভাই! ক্লায়েন্ট-সাইড SPA-তে আমরা যেভাবে ভাবতাম, App Router-এর আর্কিটেকচার সম্পূর্ণ ভিন্ন।
        এখানে সব স্টেট গ্লোবাল স্টোরে রাখা একটা অ্যান্টি-প্যাটার্ন। স্টেটকে চারটি লেয়ারে ভাগ করে
        ভাবতে হয় — আর তার মধ্যে সবচেয়ে অবহেলিত অথচ গুরুত্বপূর্ণটি হলো <strong>URL state</strong>।
      </Line>

      <Line name="নেক্সট-ভাই">
        একদম! আর্কিটেকচারাল ভুলটা তখনই হয় যখন আমরা server state, URL state আর client state-এর
        মধ্যে পার্থক্য করতে পারি না। সঠিক স্টেটকে সঠিক লেয়ারে রাখাই আসল কাজ।
      </Line>

      {/* ── Architecture ──────────────────────────────────────────────── */}
      <H2 id="architecture">১. Next.js State Hierarchy</H2>

      <Diagram>{`┌─────────────────────────────────────────────────────────────────────────────┐
│                    NEXT.JS STATE ARCHITECTURE LAYERS                        │
└─────────────────────────────────────────────────────────────────────────────┘

  [ 1. SERVER STATE ]   ──► database / API data
                            handled by: RSC, server actions
                            cached by:  data cache, react cache()

  [ 2. URL STATE ]      ──► filters, search, active tab, pagination
                            handled by: useSearchParams, useRouter, nuqs
                            free wins:  bookmarkable, shareable, SSR-safe ⭐

  [ 3. LOCAL STATE ]    ──► modals, dropdowns, unsaved form input
                            handled by: useState, useReducer
                            scope:      one leaf client component

  [ 4. GLOBAL CLIENT ]  ──► theme, cart, audio player, multi-step wizard
                            handled by: Zustand / Redux Toolkit / Context
                            caution:    must be hydration-safe

  most "state management problems" are really a state placed one layer too high`}</Diagram>

      {/* ── Mechanisms ────────────────────────────────────────────────── */}
      <H2 id="mechanisms">২. কোর সেপারেশন রুল</H2>

      <p>
        <strong>URL as the source of truth for UI filters:</strong> সার্চ, পেজিনেশন বা ট্যাব
        কখনো <code>useState</code> বা গ্লোবাল স্টোরে রাখবেন না — এগুলো query parameter-এ রাখুন।
        তখন ইউজার লিংক শেয়ার করলে অন্য যে কেউ হুবহু একই ভিউ দেখে, আর সার্ভার কম্পোনেন্ট নিজেই সেই
        প্যারামিটার পড়ে ডাটা আনতে পারে।
      </p>

      <p>
        <strong>Server state belongs on the server:</strong> ডাটাবেস থেকে পাওয়া ডাটা গ্লোবাল
        ক্লায়েন্ট স্টোরে কপি করে রাখবেন না। RSC থেকে সরাসরি ফেচ করুন, আর রিফ্রেশের জন্য server
        action ও <code>revalidateTag</code> ব্যবহার করুন — নইলে দুই জায়গায় দুই রকম সত্য তৈরি হয়।
      </p>

      <p>
        <strong>Hydration-safe client store:</strong> কার্টের মতো গ্লোবাল ক্লায়েন্ট স্টেট রাখতেই হলে
        মনে রাখুন — সার্ভার <code>localStorage</code> দেখতে পায় না। তাই প্রথম রেন্ডারে স্টোরের ডাটা
        ব্যবহার করলে সার্ভার আর ক্লায়েন্টের HTML মিলবে না, আর ওটাই hydration error-এর উৎস।
      </p>

      {/* ── Implementation ────────────────────────────────────────────── */}
      <H2 id="implementation">৩. Production Code Implementation</H2>

      <H3>❌ Anti-pattern — ফিল্টার স্টেট useState-এ</H3>

      <CodeBlock filename="src/features/products/PoorProductFilter.tsx">{`// 🔴 POOR PRACTICE: state lost on reload, and the link shares nothing
'use client';

import { useState } from 'react';

export function PoorProductFilter() {
  // ❌ refresh, or paste the URL to a colleague, and the filter is gone
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('all');

  const handleSearch = () => {
    // ❌ a manual client fetch, when the server could have done this already
    fetch(\`/api/products?search=\${search}&category=\${category}\`);
  };

  return (
    <div>
      <input value={search} onChange={(e) => setSearch(e.target.value)} />
      <button onClick={handleSearch}>Filter</button>
    </div>
  );
}`}</CodeBlock>

      <H3>🟢 Production pattern 1 — URL-driven filter</H3>

      <CodeBlock filename="src/features/products/components/ProductFilter.tsx">{`// 🟢 PRODUCTION PATTERN: the URL holds the state; the server reacts to it
'use client';

import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useTransition } from 'react';

export function ProductFilter() {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const { replace } = useRouter();
  const [isPending, startTransition] = useTransition();

  const handleSearch = (term: string) => {
    const params = new URLSearchParams(searchParams);

    if (term) params.set('q', term);
    else params.delete('q');

    params.set('page', '1'); // a new search always starts at page one

    // 🟢 replace(), not push() — typing should not fill the back button
    // 🟢 the transition keeps the old results visible while the new ones load
    startTransition(() => {
      replace(\`\${pathname}?\${params.toString()}\`);
    });
  };

  return (
    <div className="flex items-center gap-4">
      <input
        type="text"
        placeholder="Search products..."
        // defaultValue, not value — the URL is the source of truth
        defaultValue={searchParams.get('q') ?? ''}
        onChange={(e) => handleSearch(e.target.value)}
        className="w-full max-w-sm rounded border p-2"
      />
      {isPending && <span className="text-xs text-slate-500">Updating…</span>}
    </div>
  );
}`}</CodeBlock>

      <CodeBlock filename="src/app/products/page.tsx">{`// 🟢 PRODUCTION PATTERN: a server component that reads the URL directly
import { db } from '@/lib/db';
import { ProductFilter } from '@/features/products';

interface PageProps {
  searchParams: Promise<{ q?: string; page?: string }>;
}

export default async function ProductsPage({ searchParams }: PageProps) {
  const { q = '', page } = await searchParams;
  const currentPage = Number(page) || 1;

  // 🟢 no client fetch, no loading flash, no state to synchronise
  const products = await db.product.findMany({
    where: { name: { contains: q, mode: 'insensitive' } },
    take: 10,
    skip: (currentPage - 1) * 10,
  });

  return (
    <main className="space-y-6 p-8">
      <h1 className="text-2xl font-bold">Product Catalog</h1>
      <ProductFilter />

      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        {products.map((product) => (
          <div key={product.id} className="rounded border p-4 shadow-sm">
            <h3>{product.name}</h3>
            <p>{product.price}</p>
          </div>
        ))}
      </div>
    </main>
  );
}`}</CodeBlock>

      <H3>🟢 Production pattern 2 — hydration-safe global store</H3>

      <CodeBlock filename="src/shared/store/useCartStore.ts">{`// 🟢 PRODUCTION PATTERN: genuine client state — a cart the server never owns
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface CartItem {
  id: string;
  name: string;
  quantity: number;
}

interface CartState {
  items: CartItem[];
  addItem: (item: CartItem) => void;
  clearCart: () => void;
}

export const useCartStore = create<CartState>()(
  persist(
    (set) => ({
      items: [],
      addItem: (item) => set((state) => ({ items: [...state.items, item] })),
      clearCart: () => set({ items: [] }),
    }),
    { name: 'shopping-cart-storage' },
  ),
);`}</CodeBlock>

      <CodeBlock filename="src/shared/hooks/useCart.ts">{`// 🟢 PRODUCTION PATTERN: a hydration guard — the server has no localStorage
'use client';

import { useState, useEffect } from 'react';
import { useCartStore } from '../store/useCartStore';

export function useCart() {
  const [isHydrated, setIsHydrated] = useState(false);
  const store = useCartStore();

  useEffect(() => {
    setIsHydrated(true);
  }, []);

  // 🟢 the first client render matches the server's empty HTML exactly;
  //    the persisted items appear on the render right after hydration
  return {
    ...store,
    items: isHydrated ? store.items : [],
    isHydrated,
  };
}`}</CodeBlock>

      {/* ── Matrix ────────────────────────────────────────────────────── */}
      <H2 id="matrix">৪. State Placement Decision Matrix</H2>

      <Table
        head={["স্টেটের ধরন", "কোথায় রাখবেন", "টুল", "সুবিধা"]}
        rows={[
          [
            "সার্চ, ফিল্টার, পেজ",
            "URL parameter 🟢",
            "useSearchParams, nuqs",
            "শেয়ারেবল লিংক, বুকমার্কযোগ্য",
          ],
          [
            "DB, auth, session",
            "সার্ভার সাইড 🟢",
            "RSC, server action, headers()",
            "০ KB বান্ডেল, সিক্রেট নিরাপদ",
          ],
          [
            "Modal, ফর্ম ইনপুট",
            "লোকাল React state 🟢",
            "useState, useReducer",
            "সরল, leaf-এ আইসোলেটেড",
          ],
          [
            "কার্ট, থিম, প্লেয়ার",
            "গ্লোবাল ক্লায়েন্ট স্টোর 🟢",
            "Zustand, Redux Toolkit",
            "নেভিগেশনের মধ্যেও টিকে থাকে",
          ],
        ]}
      />

      <Line name="ভুলু ভাই">
        দারুণ ফাহিম! ফিল্টার URL-এ সরানোর পর শুধু রিফ্রেশের সমস্যাই যায়নি — লিংক শেয়ার করলেও এখন
        হুবহু একই ভিউ আসছে, আর গ্লোবাল স্টোরের অর্ধেক কোডই আর লাগছে না!
      </Line>

      {/* ── Takeaways ─────────────────────────────────────────────────── */}
      <H2 id="takeaway">Production Takeaways</H2>

      <Note>
        <ul>
          <li>
            <strong>URL first:</strong> ইউজার যা শেয়ার করতে বা বুকমার্ক করতে চাইতে পারে, তার সবই
            URL parameter-এ রাখুন — এটি বিনামূল্যের persistence।
          </li>
          <li>
            <strong>Never mirror server data in a client store:</strong> RSC ব্যবহার করার মূল
            সুবিধাই হলো ব্যাকএন্ডের ডাটা ম্যানুয়ালি সিঙ্ক করতে হয় না।
          </li>
          <li>
            <strong>Guard localStorage hydration:</strong> persisted স্টোর ব্যবহার করলে প্রথম
            রেন্ডারে ডিফল্ট মান ফেরত দিন — নইলে hydration mismatch অনিবার্য।
          </li>
        </ul>
      </Note>
    </article>
  );
}
