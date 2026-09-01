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
      bn: "Lighthouse স্কোর ৯০ থেকে ৪৫",
      en: "Lighthouse dropped from 90 to 45",
    },
  },
  {
    id: "architecture",
    label: {
      bn: "অপটিমাইজড লোডিং পাইপলাইন",
      en: "The optimized loading pipeline",
    },
  },
  {
    id: "mechanisms",
    label: { bn: "৩টি আর্কিটেকচারাল কনসেপ্ট", en: "Three architectural concepts" },
  },
  {
    id: "implementation",
    label: {
      bn: "Namespace splitting ও React.cache()",
      en: "Namespace splitting & React.cache()",
    },
  },
  {
    id: "matrix",
    label: {
      bn: "Loading Performance Comparison",
      en: "Loading performance comparison",
    },
  },
  {
    id: "takeaway",
    label: { bn: "Production Takeaways", en: "Production takeaways" },
  },
];

export default function TranslationLoadingPerformance() {
  return (
    <article className="doc-prose">
      {/* ── The problem ───────────────────────────────────────────────── */}
      <H2 id="the-problem" anchorOnly>
        Lighthouse স্কোর ৯০ থেকে ৪৫
      </H2>

      <p>
        রাত ৯:৪৫। ভুলু ভাই তার সাইটের Lighthouse পারফরম্যান্স স্কোর দেখে চোখ কপালে তুলেছেন! স্কোর ৯০
        থেকে নেমে সোজা ৪৫-এ চলে এসেছে। বিশ্লেষণ করতে গিয়ে দেখলেন, ট্রান্সলেশন JSON ফাইলগুলোর সাইজ বড়
        হতে হতে প্রায় ৩ মেগাবাইট হয়ে গেছে। পেজের মূল কনটেন্ট লোড হতে না হতেই ব্রাউজার মেগাবাইট
        মেগাবাইট আন-ইউজড ট্রান্সলেশন ডাটা ফেচ করে নেটওয়ার্ক ওয়াটারফল তৈরি করছে!
      </p>

      <Line name="ভুলু ভাই">
        ফাহিম! ডিকশনারিগুলো যত বড় হচ্ছে, নেটওয়ার্ক লেটেন্সি আর ক্লায়েন্ট-সাইড মেমোরি কনজাম্পশন তত
        বাড়ছে! ল্যান্ডিং পেজে ঢুকল ইউজার, আর তার ব্রাউজারে চেকআউট, পেমেন্ট, ড্যাশবোর্ডের সব ভাষার
        ট্রান্সলেশন ফাইল একসাথে ডাউনলোড হচ্ছে! Performance আর TBT (Total Blocking Time) রেড হয়ে গেছে।
        অপটিমাইজ করব কীভাবে?
      </Line>

      <Line name="ফাহিম">
        ভুলু ভাই! আপনি ট্রান্সলেশন ফাইলগুলোকে পুরো অ্যাপের জন্য মনোলিথিক এক বিশাল JSON ফাইলে রেখে
        দিয়েছেন। প্রফেশনাল লেভেলে route-based code splitting, lazy dynamic import, server-side caching
        এবং ছোট payload — এই আর্কিটেকচার প্রয়োগ করতে হয়!
      </Line>

      <Line name="নেক্সট-ভাই">
        একদম! সার্ভার কম্পোনেন্টে আমরা <code>React.cache()</code> এবং <code>import()</code> দিয়ে
        অন-ডিমান্ড scoped ডিকশনারি স্প্লিটিং করব। ইউজার যে রুটে ঢুকবে (যেমন <code>/cart</code>), শুধু
        সেই পেজের ৫–১০ কিলোবাইটের ট্রান্সলেশন চাঙ্ক ইন-মেমোরি ক্যাশ থেকে লোড হবে — ব্রাউজার
        জিরো-ওয়েস্টেড ডেটা পাবে!
      </Line>

      {/* ── Architecture ──────────────────────────────────────────────── */}
      <H2 id="architecture">১. Optimized Translation Loading Pipeline</H2>

      <Diagram>{`┌─────────────────────────────────────────────────────────────────────────────┐
│              OPTIMIZED TRANSLATION PERFORMANCE PIPELINE                     │
└─────────────────────────────────────────────────────────────────────────────┘

 Browser requests: GET /bn/cart
                        │
                        ▼
 Server Component execution (RSC)
                        │
                        ▼
 cache()-wrapped loader: getNamespacedDictionary('bn', 'cart')
                        │
                        ├── 1. memory cache hit? ──────► 🟢 return instantly
                        │
                        └── 2. cache miss
                             │
                             ├── dynamic import: '@/dictionaries/bn/cart.json'
                             ├── payload: ~4 KB  (vs a 3 MB monolith)
                             └── stores the result in the request-scoped cache
                        │
                        ▼
 🟢 streams pure rendered HTML — zero translation JS transferred to the client`}</Diagram>

      {/* ── Mechanisms ────────────────────────────────────────────────── */}
      <H2 id="mechanisms">২. কোর আর্কিটেকচারাল কনসেপ্ট</H2>

      <p>
        <strong>Route-based translation splitting:</strong> সমগ্র অ্যাপ্লিকেশনের সব টেক্সট এক{" "}
        <code>en.json</code> বা <code>bn.json</code> ফাইলে না রেখে ফিচার অনুযায়ী ছোট ছোট ফাইলে ভাগ করা
        (<code>home.json</code>, <code>cart.json</code>, <code>settings.json</code>)।
      </p>

      <p>
        <strong>Request deduplication with React.cache:</strong> একটি রিকোয়েস্টে একাধিক সার্ভার
        কম্পোনেন্ট একই ডিকশনারি রিড করলে যেন বারবার ডিস্ক রিড বা ডাইনামিক ইমপোর্ট না হয়, তাই{" "}
        <code>React.cache()</code> দিয়ে একই রিকোয়েস্ট লাইফসাইকেলের ভেতর লোডার মেমোইজ করা হয়।
      </p>

      <p>
        <strong>Zero client bundle leakage:</strong> অনুবাদের ভারী ফাইল বা পার্সিং লজিক যেন ভুলবশত
        Client Component-এর বান্ডেলে ইনজেক্ট না হয়, তা নিশ্চিত করতে <code>server-only</code> ব্যারিয়ার
        ব্যবহার করা।
      </p>

      {/* ── Implementation ────────────────────────────────────────────── */}
      <H2 id="implementation">৩. Production Code Implementation</H2>

      <H3>❌ Anti-pattern — a monolithic bundle with uncached imports</H3>

      <CodeBlock filename="lib/i18n/bad-dictionary.ts">{`// 🔴 POOR PRACTICE: monolithic dictionary imports with no scoping or caching
// pulls a 3 MB JSON into memory for every request

import en from '@/dictionaries/monolith-en.json'; // ❌ loads huge unused key trees
import bn from '@/dictionaries/monolith-bn.json';

export async function getBadDictionary(locale: string) {
  // ❌ re-runs the heavy parsing path every time, with no memoization
  return locale === 'bn' ? bn : en;
}`}</CodeBlock>

      <H3>🟢 Production pattern — namespaced, cached dictionary engine</H3>

      <p>
        <strong>Step 1 — মডিউলার ডিরেক্টরি স্ট্রাকচার।</strong>
      </p>

      <CodeBlock filename="dictionaries/">{`src/
└── dictionaries/
    ├── en/
    │   ├── common.json
    │   ├── cart.json
    │   └── checkout.json
    └── bn/
        ├── common.json
        ├── cart.json
        └── checkout.json`}</CodeBlock>

      <p>
        <strong>Step 2 — cached ও splitted লোডার।</strong>
      </p>

      <CodeBlock filename="lib/i18n/cached-dictionary.ts">{`// 🟢 PRODUCTION PATTERN: high-performance split & cached loader
import 'server-only';
import { cache } from 'react';
import type { Locale } from '@/lib/i18n/config';

export type Namespace = 'common' | 'cart' | 'checkout' | 'dashboard';

/**
 * 🟢 React.cache memoizes the call within one request lifecycle.
 * The dynamic import ensures only the required 4–5 KB namespace is loaded.
 */
export const getNamespacedDictionary = cache(
  async (locale: Locale, namespace: Namespace) => {
    try {
      const dictionary = await import(\`@/dictionaries/\${locale}/\${namespace}.json\`);
      return dictionary.default;
    } catch {
      console.warn(\`[i18n] missing dictionary: \${locale}/\${namespace}; falling back to 'en'\`);

      // safe fallback to the English namespace
      const fallback = await import(\`@/dictionaries/en/\${namespace}.json\`);
      return fallback.default;
    }
  }
);`}</CodeBlock>

      <p>
        <strong>Step 3 — অপটিমাইজড সার্ভার কম্পোনেন্ট।</strong>
      </p>

      <CodeBlock filename="app/[locale]/cart/page.tsx">{`// 🟢 zero-overhead page rendering
import { getNamespacedDictionary } from '@/lib/i18n/cached-dictionary';
import type { Locale } from '@/lib/i18n/config';

interface PageProps {
  params: Promise<{ locale: Locale }>;
}

export default async function CartPage({ params }: PageProps) {
  const { locale } = await params;

  // 🟢 load only 'common' and 'cart', in parallel (~8 KB total vs a 3 MB monolith)
  const [commonDict, cartDict] = await Promise.all([
    getNamespacedDictionary(locale, 'common'),
    getNamespacedDictionary(locale, 'cart'),
  ]);

  return (
    <main className="p-8 max-w-xl mx-auto">
      <h1 className="text-2xl font-bold">{cartDict.title}</h1>

      <div className="mt-4 p-4 border rounded">
        <p>{cartDict.itemCount}: 3</p>
        <button className="mt-4 bg-blue-600 text-white px-4 py-2 rounded">
          {commonDict.continueButton}
        </button>
      </div>
    </main>
  );
}`}</CodeBlock>

      {/* ── Matrix ────────────────────────────────────────────────────── */}
      <H2 id="matrix">৪. Loading Performance Strategy Comparison</H2>

      <Table
        head={[
          "বৈশিষ্ট্য",
          "Monolithic all-in-one JSON",
          "Client context hybrid",
          "Namespaced + React.cache()",
        ]}
        rows={[
          [
            "Initial payload",
            "অত্যন্ত বড় (~৩ MB) 🔴",
            "মাঝারি — ব্রাউজার ওয়াটারফল 🔴",
            "মাইক্রো-সাইজ (~৪–১০ KB) 🟢",
          ],
          [
            "Lighthouse impact",
            "TBT ও LCP ড্রপ করে (স্কোর ৪৫) 🔴",
            "Hydration স্লো করে 🔴",
            "সর্বোচ্চ পারফরম্যান্স (৯৫+) 🟢",
          ],
          [
            "Memory consumption",
            "অপ্রয়োজনীয় ডাটা ব্রাউজারে থাকে 🔴",
            "ক্লায়েন্ট মেমোরি খরচ করে 🔴",
            "জিরো ক্লায়েন্ট মেমোরি 🟢",
          ],
          [
            "Server IO & parsing",
            "প্রতিবার অন-দ্য-ফ্লাই পার্সিং 🔴",
            "ক্লায়েন্টে প্রসেসিং 🟡",
            "React.cache() দিয়ে একবারই পার্স 🟢",
          ],
        ]}
      />

      <Line name="ভুলু ভাই">
        মারাত্মক অপটিমাইজেশন ফাহিম! ডিকশনারি ফাইলগুলোকে namespace-ওয়াইজ স্প্লিট করে{" "}
        <code>React.cache()</code> দিয়ে লোড করার পর মেগাবাইটের ডাটা সোজা ৪ কিলোবাইটে নেমে এসেছে!
        Lighthouse স্কোর এখন একলাফে ৯৮-এ উঠে গেছে।
      </Line>

      {/* ── Takeaways ─────────────────────────────────────────────────── */}
      <H2 id="takeaway">Production Takeaways</H2>

      <Note>
        <ul>
          <li>
            <strong>Split dictionaries by namespace:</strong> অ্যাপের ফিচার অনুযায়ী ডিকশনারি ফাইল
            আলাদা করে নিন — <code>cart.json</code>, <code>auth.json</code> ইত্যাদি।
          </li>
          <li>
            <strong>Wrap the loader in React.cache():</strong> একই রিকোয়েস্টে পেজ, লেআউট বা চাইল্ড
            কম্পোনেন্ট যেন বারবার একই ফাইল ডাবল-লোড না করে।
          </li>
          <li>
            <strong>Load multiple namespaces with Promise.all:</strong> একটি পেজে ২–৩টি namespace
            লাগলে প্যারালালে লোড করুন, যাতে কোনো waterfall তৈরি না হয়।
          </li>
        </ul>
      </Note>
    </article>
  );
}
