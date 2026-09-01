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
      bn: "রিকমেন্ডেশন ডাউন, পুরো পেজ ডাউন",
      en: "Recommendations down, page down",
    },
  },
  {
    id: "architecture",
    label: {
      bn: "Graceful degradation পাইপলাইন",
      en: "The graceful degradation pipeline",
    },
  },
  {
    id: "mechanisms",
    label: { bn: "৩টি আর্কিটেকচারাল কনসেপ্ট", en: "Three architectural concepts" },
  },
  {
    id: "implementation",
    label: {
      bn: "Safe fetcher ও fallback UI",
      en: "A safe fetcher & fallback UI",
    },
  },
  {
    id: "matrix",
    label: { bn: "Hard Failure vs Degradation", en: "Hard failure vs degradation" },
  },
  {
    id: "takeaway",
    label: { bn: "Production Takeaways", en: "Production takeaways" },
  },
];

export default function GracefulDegradation() {
  return (
    <article className="doc-prose">
      {/* ── The problem ───────────────────────────────────────────────── */}
      <H2 id="the-problem" anchorOnly>
        রিকমেন্ডেশন ডাউন, পুরো পেজ ডাউন
      </H2>

      <p>
        রাত ৯:২০। বিগ সেল চলাকালীন ই-কমার্স সাইটের রিকমেন্ডেশন সিস্টেমের থার্ড-পার্টি API ডাউন হয়ে
        গেছে! ভুলু ভাই খেয়াল করলেন, প্রোডাক্ট সার্ভার ঠিক থাকা সত্ত্বেও রিকমেন্ডেশন API সাড়া না দেওয়ায়
        পুরো প্রোডাক্ট ডিটেইলস পেজ অনির্দিষ্টকালের জন্য লোড হতে থাকছে এবং শেষমেশ ক্র্যাশ করছে।
      </p>

      <Line name="ভুলু ভাই">
        ফাহিম! মেইন প্রোডাক্ট ডাটাবেস একদম সচল, অথচ পাশের এক পুচকে &quot;সাজেস্টেড প্রোডাক্টস&quot;
        API ডাউন হওয়ায় পুরো প্রোডাক্ট পেজ সাদা হয়ে আটকে থাকবে কেন?
      </Line>

      <Line name="ফাহিম">
        ভুলু ভাই! কোনো নন-ক্রিটিক্যাল মাইক্রোসার্ভিস বা থার্ড-পার্টি API ডাউন হলে পুরো পেজ ডাউন করা
        যাবে না! মূল ফিচার সচল রেখে ফেইল করা ফিচারটিকে ফলব্যাক UI বা ক্যাশড ডাটা দিয়ে অলটারনেট মোডে
        চালানোই হলো graceful degradation।
      </Line>

      <Line name="নেক্সট-ভাই">
        একদম! App Router-এ safe fetch wrapper, stale-while-revalidate cache এবং feature degradation
        banner ব্যবহার করে প্রাইমারি সার্ভিসকে ১০০% আইসোলেটেড ও রেজিলিয়েন্ট রাখা যায়!
      </Line>

      {/* ── Architecture ──────────────────────────────────────────────── */}
      <H2 id="architecture">১. Graceful Degradation Architecture</H2>

      <Diagram>{`┌─────────────────────────────────────────────────────────────────────────────┐
│                   GRACEFUL DEGRADATION PIPELINE                             │
└─────────────────────────────────────────────────────────────────────────────┘

 Request /products/123
                   │
                   ▼
  parallel data fetching, isolated per source
                   │
         ┌─────────┴────────────────────────┐
         ▼                                  ▼
[core product service]            [recommendations API]
   status: 200 OK                   status: 500 / timeout ❌
         │                                  │
         ▼                                  ▼
 render core product details       graceful fallback strategy
 (title, image, buy button)        ├─ read stale/local cache, or
         │                         └─ show a static default list
         │                                  │
         └─────────────────┬────────────────┘
                           ▼
             🟢 resilient UI
             - the product page is fully functional
             - the degraded section shows cached data + a quiet banner`}</Diagram>

      {/* ── Mechanisms ────────────────────────────────────────────────── */}
      <H2 id="mechanisms">২. কোর আর্কিটেকচারাল কনসেপ্ট</H2>

      <p>
        <strong>Non-blocking resilient fetching:</strong> একটি পেজে একাধিক ডাটা সোর্স থাকলে{" "}
        <code>Promise.all()</code> বিপজ্জনক — যেকোনো একটি প্রমিস রিজেক্ট হলে পুরো রিকোয়েস্ট ফেল করে।{" "}
        <code>Promise.allSettled()</code> বা প্রতি সোর্সে নিজস্ব try-catch wrapper ব্যবহার করলে ফেল
        করা অংশটুকু আলাদা করে হ্যান্ডেল করা যায়।
      </p>

      <p>
        <strong>Stale-while-revalidate fallbacks:</strong> লাইভ API ডাউন থাকলে সার্ভারে আগে থেকে সেভ
        থাকা পুরোনো ক্যাশড ডাটা অথবা স্ট্যাটিক ফলব্যাক দিয়ে ইউজারকে সার্ভিস দেওয়া চালু রাখা যায় —
        সামান্য পুরোনো ডাটা কোনো ডাটার চেয়ে অনেক ভালো।
      </p>

      <p>
        <strong>Feature isolation &amp; soft warnings:</strong> কোর বিজনেস লজিক (add to cart,
        payment) সচল রেখে নন-ক্রিটিক্যাল সার্ভিস (লাইভ চ্যাট, রিভিউ) ডাউন থাকলে কেবল ওই সেকশনে একটি
        হালকা নোটিশ দেখালেই চলে।
      </p>

      {/* ── Implementation ────────────────────────────────────────────── */}
      <H2 id="implementation">৩. Production Code Implementation</H2>

      <H3>❌ Anti-pattern — all-or-nothing blocking fetch</H3>

      <CodeBlock filename="app/products/[id]/page.tsx">{`// 🔴 POOR PRACTICE: Promise.all with no isolation
// if the recommendations API fails, the entire page throws

export default async function ProductPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  // ❌ one rejected promise collapses the core product view too
  const [product, recommendations] = await Promise.all([
    fetchProduct(id),
    fetchRecommendations(id), // if this is down, the page dies
  ]);

  return (
    <div>
      <h1>{product.name}</h1>
      <RecommendationsList items={recommendations} />
    </div>
  );
}`}</CodeBlock>

      <H3>🟢 Production pattern — isolated fetchers with fallbacks</H3>

      <p>
        <strong>Step 1 — রেজিলিয়েন্ট ডাটা ফেচার লেয়ার।</strong>
      </p>

      <CodeBlock filename="lib/data-fetchers.ts">{`// 🟢 PRODUCTION PATTERN: critical and non-critical fetches, kept apart
import { cache } from 'react';

export type Product = { id: string; name: string; price: number };
export type Recommendation = { id: string; name: string };

// core service — must succeed, or the page has nothing to show
export const getCoreProduct = cache(async (id: string): Promise<Product> => {
  const res = await fetch(\`https://api.store.com/products/\${id}\`, {
    next: { revalidate: 60 },
  });
  if (!res.ok) throw new Error('PRODUCT_NOT_FOUND');
  return res.json();
});

// non-critical service — never allowed to throw past this function
export async function safeGetRecommendations(id: string): Promise<{
  data: Recommendation[];
  isDegraded: boolean;
}> {
  try {
    const res = await fetch(\`https://api.recommendations.com/products/\${id}\`, {
      // 🟢 a short timeout keeps a slow service from hanging the render
      signal: AbortSignal.timeout(1500),
      next: { revalidate: 300 },
    });

    if (!res.ok) throw new Error('RECOMMENDATIONS_SERVICE_DOWN');

    return { data: await res.json(), isDegraded: false };
  } catch (error) {
    console.warn('Graceful degradation: recommendations service failed.', error);

    // 🟢 static popular products beat an empty section
    return {
      data: [
        { id: 'fallback-1', name: 'জনপ্রিয় প্রোডাক্ট ১' },
        { id: 'fallback-2', name: 'জনপ্রিয় প্রোডাক্ট ২' },
      ],
      isDegraded: true,
    };
  }
}`}</CodeBlock>

      <p>
        <strong>Step 2 — degraded UI সহ পেজ।</strong>
      </p>

      <CodeBlock filename="app/products/[id]/page.tsx">{`// 🟢 PRODUCTION PATTERN: rendering the degraded state honestly
import { getCoreProduct, safeGetRecommendations } from '@/lib/data-fetchers';
import { notFound } from 'next/navigation';

interface Props {
  params: Promise<{ id: string }>;
}

export default async function ProductDetailPage({ params }: Props) {
  const { id } = await params;

  // 1. the critical fetch — a failure here genuinely means 404
  let product;
  try {
    product = await getCoreProduct(id);
  } catch {
    notFound();
  }

  // 2. the non-critical fetch can only ever return, never throw
  const { data: recommendations, isDegraded } = await safeGetRecommendations(id);

  return (
    <main className="p-6 max-w-4xl mx-auto space-y-8">
      {/* core section — always works */}
      <section className="p-6 border rounded-2xl bg-white shadow-sm space-y-4">
        <h1 className="text-3xl font-bold text-gray-900">{product.name}</h1>
        <p className="text-2xl font-semibold text-green-600">৳{product.price}</p>
        <button className="px-6 py-3 bg-blue-600 text-white rounded-xl font-medium hover:bg-blue-700">
          কার্টে যোগ করুন
        </button>
      </section>

      {/* non-critical section */}
      <section className="space-y-4 pt-4 border-t">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold text-gray-800">আপনার জন্য রেকমেন্ডেশন</h2>

          {/* 🟢 tell the truth quietly, don't pretend the data is fresh */}
          {isDegraded && (
            <span className="text-xs px-2.5 py-1 bg-amber-100 text-amber-800 rounded-full font-medium">
              অফলাইন ক্যাশ থেকে দেখানো হচ্ছে
            </span>
          )}
        </div>

        <div className="grid grid-cols-2 gap-4">
          {recommendations.map((rec) => (
            <div key={rec.id} className="p-4 border rounded-xl bg-gray-50 text-sm font-medium">
              {rec.name}
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}`}</CodeBlock>

      {/* ── Matrix ────────────────────────────────────────────────────── */}
      <H2 id="matrix">৪. Hard Failure vs Graceful Degradation</H2>

      <Table
        head={["বিষয়", "Hard failure (anti-pattern)", "Graceful degradation (production)"]}
        rows={[
          [
            "থার্ড-পার্টি এররের প্রভাব",
            "পুরো পেজ ক্র্যাশ বা টাইমআউট 🔴",
            "এররটি সেই সেকশনেই আটকে থাকে 🟢",
          ],
          [
            "ফেচিং কৌশল",
            "strict Promise.all() 🔴",
            "safe wrapper / Promise.allSettled() 🟢",
          ],
          [
            "ইউজার পারসেপশন",
            "\"সাইট নষ্ট হয়ে গেছে\" 🔴",
            "\"সব ঠিক আছে, একটা ফিচার লাইভ নেই\" 🟢",
          ],
          [
            "রেভিনিউ ঝুঁকি",
            "বিক্রি পুরোপুরি বন্ধ 🔴",
            "পেমেন্ট ও মূল সেল সচল থাকে 🟢",
          ],
        ]}
      />

      <Line name="ভুলু ভাই">
        দুর্দান্ত কনসেপ্ট ফাহিম! এখন রিকমেন্ডেশন বা থার্ড-পার্টি সার্ভিস ডাউন থাকলেও আমাদের মেইন
        ই-কমার্স সেল একদম থমকে থাকবে না! কাস্টমার স্মুথলি অর্ডার কমপ্লিট করতে পারবে।
      </Line>

      {/* ── Takeaways ─────────────────────────────────────────────────── */}
      <H2 id="takeaway">Production Takeaways</H2>

      <Note>
        <ul>
          <li>
            <strong>Classify critical vs non-critical:</strong> কোন ডাটা সার্ভিস না থাকলে কেনাকাটা
            আটকে যাবে (প্রোডাক্ট প্রাইস) আর কোনটা না থাকলেও সাইট চলবে (রিভিউ, রেটিং) — শুরুতেই আলাদা
            ডিফাইন করুন।
          </li>
          <li>
            <strong>Use short abort timeouts:</strong> থার্ড-পার্টি সার্ভিস স্লো হলে তা যেন সার্ভার
            রেন্ডারিং ঝুলিয়ে না রাখে — <code>AbortSignal.timeout()</code> দিয়ে ১-২ সেকেন্ডের সীমা
            বেঁধে দিন।
          </li>
          <li>
            <strong>Always have an offline fallback:</strong> যেকোনো সেকেন্ডারি API-এর জন্য আগে থেকে
            ক্যাশড বা স্ট্যাটিক ফলব্যাক রেডি রাখুন, এবং degraded অবস্থাটা UI-তে সৎভাবে জানিয়ে দিন।
          </li>
        </ul>
      </Note>
    </article>
  );
}
