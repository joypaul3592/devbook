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
      bn: "নতুন প্রপ্স এলো, UI আপডেট হলো না",
      en: "New props arrived, the UI did not",
    },
  },
  {
    id: "mental-model",
    label: {
      bn: "Producer → Consumer ফ্লো",
      en: "Producer to consumer flow",
    },
  },
  {
    id: "client-consumer",
    label: {
      bn: "ক্লায়েন্ট কনজিউমার",
      en: "The client consumer",
    },
  },
  {
    id: "server-producer",
    label: {
      bn: "সার্ভার প্রোডিউসার ও key reset",
      en: "The server producer & key reset",
    },
  },
  {
    id: "takeaway",
    label: { bn: "Production Takeaways", en: "Production takeaways" },
  },
];

export default function DataFlowServerToClient() {
  return (
    <article className="doc-prose">
      {/* ── The problem ───────────────────────────────────────────────── */}
      <H2 id="the-problem" anchorOnly>
        নতুন প্রপ্স এলো, UI আপডেট হলো না
      </H2>

      <p>
        রাত ৮:১৫। ভুলু ভাই একটি ইন্টারঅ্যাক্টিভ প্রোডাক্ট সার্চ পেজ বানাচ্ছিলেন। সার্ভার
        কম্পোনেন্টে ডাটাবেস থেকে প্রোডাক্ট লিস্ট ফেচ করে সেটি ক্লায়েন্ট কম্পোনেন্টে প্রপ্স
        হিসেবে পাঠালেন। কিন্তু ফিল্টার বদলালে UI আর আপডেটই হচ্ছে না।
      </p>

      <Line name="ভুলু ভাই">
        ফাহিম! সার্ভার থেকে ডেটা তো সুন্দর প্রপ্স হিসেবে চলে গেল। কিন্তু ক্লায়েন্টে{" "}
        <code>const [products, setProducts] = useState(initialProductsFromServer)</code>{" "}
        দিলাম — এখন URL চেঞ্জ হয়ে সার্ভার থেকে নতুন প্রপ্স আসার পরেও আমার UI আপডেট হচ্ছে না
        কেন?
      </Line>

      <Line name="ফাহিম">
        (React DevTools দেখে) ভুলু ভাই! <code>useState</code> শুধু{" "}
        <strong>initial render</strong>-এ ইনপুট ভ্যালু নেয়! পরে প্রপ্স চেঞ্জ হয়ে নতুন ডেটা
        এলেও <code>useState</code> পুরোনো স্টেটই ধরে রাখে। তুমি সঠিক Data Flow Pattern
        ফলো করোনি!
      </Line>

      <Line name="নেক্সট-ভাই">
        চমৎকার প্রবলেম ধরেছ ফাহিম! Server Component হলো{" "}
        <strong>Data Producer</strong> — ডেটার Source of Truth। আর Client Component হলো{" "}
        <strong>Data Consumer</strong> ও ইন্টারঅ্যাকশন হ্যান্ডলার। সার্ভার থেকে ক্লায়েন্টে
        ডেটা ফ্লো করানোর ৩টি প্রফেশনাল প্যাটার্ন আছে:
      </Line>

      <Note>
        <ol>
          <li>
            <strong>Pure Unidirectional Props Flow</strong> — সার্ভার ডেটা পাঠাবে, ক্লায়েন্ট
            শুধু ডিসপ্লে ও URL ফিল্টারিং করবে।
          </li>
          <li>
            <strong>Key-based Reset Pattern</strong> — সার্ভার প্রপ্স বদলালে ক্লায়েন্ট স্টেট
            অটো রিসেট করতে <code>key</code> প্রপ।
          </li>
          <li>
            <strong>Context Provider Encapsulation</strong> — সার্ভার থেকে
            কনফিগারেশন/সেশন ডেটা ক্লায়েন্ট গ্লোবাল কনটেক্সটে ইনজেক্ট করা।
          </li>
        </ol>
      </Note>

      {/* ── Mental model ──────────────────────────────────────────────── */}
      <H2 id="mental-model">১. Server-to-Client Data Flow Mechanics</H2>

      <Diagram>{`┌────────────────────────────────────────────────────────────────────────┐
│ SERVER BOUNDARY (data producer)                                        │
│                                                                        │
│  1. Fetches raw data from the DB / microservice                        │
│  2. Transforms it into a plain DTO                                     │
│  3. Passes the DTO down as props                                       │
└──────────────────────────────────┬─────────────────────────────────────┘
                                   │
                                   v   unidirectional flow
┌────────────────────────────────────────────────────────────────────────┐
│ CLIENT BOUNDARY (data consumer & UI driver)                            │
│                                                                        │
│  Option A: read-only display (pure props driven)                       │
│  Option B: local interactive state, reset via the 'key' prop           │
│  Option C: drives URL state change ──> triggers a server refetch       │
└────────────────────────────────────────────────────────────────────────┘`}</Diagram>

      {/* ── Client consumer ───────────────────────────────────────────── */}
      <H2 id="client-consumer">২. ক্লায়েন্ট কনজিউমার (URL-driven)</H2>

      <CodeBlock filename="app/products/components/product-catalog-client.tsx">{`// 🟢 app/products/components/product-catalog-client.tsx
'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useTransition } from 'react';

export interface ProductDTO {
  id: string;
  name: string;
  category: string;
  price: number;
}

interface ProductCatalogClientProps {
  initialProducts: ProductDTO[];
  currentCategory: string;
}

export function ProductCatalogClient({
  initialProducts,
  currentCategory,
}: ProductCatalogClientProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  // URL state update — drives the server refetch
  const handleCategoryChange = (category: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (category) {
      params.set('category', category);
    } else {
      params.delete('category');
    }

    startTransition(() => {
      // Re-evaluates the server component with new searchParams
      router.push(\`/products?\${params.toString()}\`);
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3 bg-slate-900 p-4 border border-slate-800 rounded-xl">
        <span className="text-xs font-mono text-slate-400">Filter category:</span>
        {['All', 'Electronics', 'Clothing', 'Books'].map((cat) => {
          const value = cat === 'All' ? '' : cat;
          const isActive = currentCategory === value;

          return (
            <button
              key={cat}
              onClick={() => handleCategoryChange(value)}
              disabled={isPending}
              className={[
                'px-3 py-1.5 text-xs rounded-lg font-medium transition',
                isActive ? 'bg-emerald-600 text-white shadow-lg' : 'bg-slate-800 text-slate-300',
                isPending ? 'opacity-50 cursor-not-allowed' : '',
              ].join(' ')}
            >
              {cat}
            </button>
          );
        })}
        {isPending && (
          <span className="text-xs text-emerald-400 animate-pulse font-mono">Syncing server...</span>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {initialProducts.map((product) => (
          <div key={product.id} className="bg-slate-900 border border-slate-800 rounded-xl p-4 space-y-2">
            <span className="text-[10px] bg-slate-800 text-slate-400 px-2 py-0.5 rounded font-mono">
              {product.category}
            </span>
            <h3 className="text-sm font-semibold text-white">{product.name}</h3>
            <p className="text-emerald-400 text-xs font-bold">{product.price} USD</p>
          </div>
        ))}
      </div>
    </div>
  );
}`}</CodeBlock>

      {/* ── Server producer ───────────────────────────────────────────── */}
      <H2 id="server-producer">৩. সার্ভার প্রোডিউসার ও key reset</H2>

      <CodeBlock filename="app/products/page.tsx">{`// 🟢 app/products/page.tsx (pure server component)
import { ProductCatalogClient, ProductDTO } from './components/product-catalog-client';

interface PageProps {
  searchParams: Promise<{ category?: string }>;
}

async function fetchProductsFromDb(category?: string): Promise<ProductDTO[]> {
  await new Promise((resolve) => setTimeout(resolve, 400)); // DB latency

  const allProducts: ProductDTO[] = [
    { id: 'p1', name: 'MacBook Pro M3', category: 'Electronics', price: 1999 },
    { id: 'p2', name: 'Wireless Headphones', category: 'Electronics', price: 299 },
    { id: 'p3', name: 'Developer Hoodie', category: 'Clothing', price: 59 },
    { id: 'p4', name: 'Clean Code Handbook', category: 'Books', price: 45 },
  ];

  if (!category) return allProducts;
  return allProducts.filter((p) => p.category.toLowerCase() === category.toLowerCase());
}

export default async function ProductsPage({ searchParams }: PageProps) {
  const { category = '' } = await searchParams;

  // Data producer: fresh server data derived from the URL
  const products = await fetchProductsFromDb(category);

  return (
    <main className="min-h-screen bg-slate-950 p-8 text-slate-100 max-w-5xl mx-auto space-y-6">
      <header className="border-b border-slate-800 pb-4">
        <h1 className="text-2xl font-bold">Catalog Data Flow Architecture</h1>
        <p className="text-xs text-slate-400">
          The server component fetches fresh data and flows it downstream.
        </p>
      </header>

      {/* KEY RESET PATTERN: a changing key makes the client component
          drop its local state and re-mount with the new props */}
      <ProductCatalogClient
        key={category}
        initialProducts={products}
        currentCategory={category}
      />
    </main>
  );
}`}</CodeBlock>

      <Line name="ভুলু ভাই">
        ফাটাফাটি নেক্সট-ভাই! ক্লায়েন্ট URL চেঞ্জ করছে, Next.js সার্ভার কম্পোনেন্টকে নতুন
        ডেটা সহ রি-ইভালুয়েট করছে, আর <code>key=&#123;category&#125;</code> থাকায় ক্লায়েন্ট
        কম্পোনেন্ট পুরোনো স্টেট না ধরে রেখে সঙ্গে সঙ্গে সিঙ্ক হয়ে যাচ্ছে!
      </Line>

      <H3>Context Provider Encapsulation (তৃতীয় প্যাটার্ন)</H3>

      <CodeBlock filename="components/providers/session-provider.tsx">{`'use client';

import { createContext, useContext } from 'react';

interface SessionDTO {
  userId: string;
  role: 'ADMIN' | 'MEMBER';
}

const SessionContext = createContext<SessionDTO | null>(null);

export function SessionProvider({
  session,
  children,
}: {
  session: SessionDTO; // injected by a server component
  children: React.ReactNode;
}) {
  return <SessionContext.Provider value={session}>{children}</SessionContext.Provider>;
}

export function useSession() {
  const ctx = useContext(SessionContext);
  if (!ctx) throw new Error('useSession must be used inside SessionProvider');
  return ctx;
}`}</CodeBlock>

      {/* ── Takeaways ─────────────────────────────────────────────────── */}
      <H2 id="takeaway">Production Takeaways</H2>

      <Note>
        <ul>
          <li>
            <strong>Prefer URL searchParams as state:</strong> ফিল্টার/সার্চ স্টেট{" "}
            <code>useState</code>-এর বদলে URL-এ রাখলে সার্ভার-ক্লায়েন্ট ১০০% সিঙ্কে থাকে,
            আর পেজ শেয়ারযোগ্য ও বুকমার্কযোগ্য হয়।
          </li>
          <li>
            <strong>Use the key prop to reset local state:</strong>{" "}
            <code>useState(initialData)</code> রাখতেই হলে প্যারেন্টে{" "}
            <code>key=&#123;categoryId&#125;</code> বসাও — আইডি বদলালে React স্টেট রিসেট
            করবে।
          </li>
          <li>
            <strong>Wrap transitions:</strong> ক্লায়েন্ট থেকে সার্ভার রি-ফেচ ট্রিগার করলে{" "}
            <code>useTransition()</code> ব্যবহার করো — পেজ ফ্রিজ না করে স্মুথ ফিডব্যাক
            পাওয়া যায়।
          </li>
          <li>
            <strong>Avoid derived state:</strong> সরাসরি রেন্ডার করা গেলে সার্ভার প্রপ্সকে
            অহেতুক <code>useState</code>-এ কপি করো না — এটাই ক্লাসিক &ldquo;derived state
            anti-pattern&rdquo;।
          </li>
        </ul>
      </Note>
    </article>
  );
}
