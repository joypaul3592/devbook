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
    label: { bn: "হাজার প্রোডাক্ট, এক টাইটেল", en: "A thousand products, one title" },
  },
  {
    id: "architecture",
    label: { bn: "Generation ও deduplication", en: "Generation & deduplication" },
  },
  {
    id: "mechanisms",
    label: { bn: "৩টি আর্কিটেকচারাল কনসেপ্ট", en: "Three architectural concepts" },
  },
  {
    id: "implementation",
    label: { bn: "Cached fetcher ও generateMetadata", en: "Cached fetcher & generateMetadata" },
  },
  {
    id: "matrix",
    label: { bn: "Static vs Dynamic Metadata", en: "Static vs dynamic metadata" },
  },
  {
    id: "takeaway",
    label: { bn: "Production Takeaways", en: "Production takeaways" },
  },
];

export default function GenerateMetadataDynamicMetadata() {
  return (
    <article className="doc-prose">
      {/* ── The problem ───────────────────────────────────────────────── */}
      <H2 id="the-problem" anchorOnly>
        হাজার প্রোডাক্ট, এক টাইটেল
      </H2>

      <p>
        রাত ১০:০৫। ভুলু ভাই <code>/products/iphone-15</code> পেজ টেস্ট করছেন। ফেসবুকে যেকোনো প্রোডাক্টের
        লিংক শেয়ার করলেই টাইটেলে দেখাচ্ছে জেনেরিক &quot;Product Details&quot; আর ডেসক্রিপশন খালি —
        ইউজার যে প্রোডাক্ট দেখছে, মেটাডেটা সে অনুযায়ী বদলাচ্ছে না।
      </p>

      <Line name="ভুলু ভাই">
        ফাহিম! স্ট্যাটিক পেজে <code>export const metadata</code> দিয়ে ফিক্সড করে দিলাম, কিন্তু ডাটাবেজে
        তো হাজার হাজার প্রোডাক্ট! ডাইনামিক রুট <code>/products/[slug]</code>-এ ডাটাবেজ থেকে ডেটা এনে
        প্রতিটি প্রোডাক্টের আলাদা মেটাডেটা ও OG ইমেজ কীভাবে সেট করব?
      </Line>

      <Line name="ফাহিম">
        ভুলু ভাই! এজন্যই আছে <code>generateMetadata()</code> অ্যাসিঙ্ক ফাংশন। এটি পেজ রেন্ডার হওয়ার
        আগেই <code>params</code> ও <code>searchParams</code> পেয়ে API বা ডাটাবেজ থেকে ডেটা তুলে
        অন-দ্য-ফ্লাই মেটাডেটা জেনারেট করে।
      </Line>

      <Line name="নেক্সট-ভাই">
        একদম! আর পারফরম্যান্স নিয়ে চিন্তা নেই — <code>generateMetadata()</code> ও পেজ কম্পোনেন্ট দুই
        জায়গায় ডেটা ফেচ করলেও Next.js-এর <code>fetch()</code> ও <code>React.cache()</code>{" "}
        ডুপ্লিকেশন সামলায়, ফলে ব্যাকএন্ডে রিকোয়েস্ট যায় একবারই।
      </Line>

      {/* ── Architecture ──────────────────────────────────────────────── */}
      <H2 id="architecture">১. Dynamic Metadata Generation &amp; Deduplication</H2>

      <Diagram>{`┌─────────────────────────────────────────────────────────────────────────┐
│                DYNAMIC METADATA EXECUTION & CACHE PIPELINE              │
└─────────────────────────────────────────────────────────────────────────┘

 request to /products/iphone-15
        │
        ├──► 1. generateMetadata({ params }) runs
        │    └── fetch product from DB/API ────────┐
        │                                          │  🟢 React.cache() / fetch memoization
        ├──► 2. ProductPage({ params }) runs       │  (zero duplicate DB or API hits)
        │    └── fetch product from DB/API ────────┘
        │
        ▼
 head streamed to the browser:
 <title>iPhone 15 Pro Max — $999 | TechStore</title>
 <meta property="og:image" content="https://cdn.../iphone-15.jpg" />`}</Diagram>

      {/* ── Mechanisms ────────────────────────────────────────────────── */}
      <H2 id="mechanisms">২. কোর আর্কিটেকচারাল কনসেপ্ট</H2>

      <p>
        <strong>Async param resolution:</strong> আধুনিক Next.js-এ <code>params</code> ও{" "}
        <code>searchParams</code> হলো Promise — তাই স্লাগ বা আইডি এক্সেস করতে শুরুতেই{" "}
        <code>await params</code> করতে হয়।
      </p>

      <p>
        <strong>Automatic request deduplication:</strong> <code>generateMetadata()</code> ও পেজ
        কম্পোনেন্টে একই <code>fetch()</code> URL কল করলেও নেটওয়ার্কে যায় একটিই রিকোয়েস্ট; ORM (Prisma
        বা Drizzle) ব্যবহার করলে <code>React.cache()</code> দিয়ে ফাংশন মেমোয়াইজ করে নিতে হয়।
      </p>

      <p>
        <strong>Parent metadata resolution:</strong> চাইল্ড পেজের মেটাডেটা তৈরির সময় প্যারেন্ট লেআউটের
        OG ইমেজ বা ট্যাগ এক্সেস করতে <code>parent: ResolvingMetadata</code> প্যারামিটার ব্যবহার করা যায়।
      </p>

      {/* ── Implementation ────────────────────────────────────────────── */}
      <H2 id="implementation">৩. Production Code Implementation</H2>

      <H3>❌ Anti-pattern — uncached double fetches and sync params</H3>

      <CodeBlock filename="app/products/[id]/legacy-metadata.ts">{`// 🔴 POOR PRACTICE: no memoization, and params read synchronously

export async function generateMetadata({ params }: { params: { id: string } }) {
  // ❌ in modern Next.js, params is a Promise — this throws at runtime
  const res = await fetch(\`https://api.example.com/products/\${params.id}\`);
  const product = await res.json();

  return {
    title: product.name,
  };
}`}</CodeBlock>

      <H3>🟢 Production pattern — a cached data layer plus generateMetadata</H3>

      <CodeBlock filename="lib/db/product.ts">{`// 🟢 a deduplicated data-access layer
import { cache } from 'react';

export interface Product {
  id: string;
  slug: string;
  name: string;
  description: string;
  price: number;
  imageUrl: string;
}

// 🟢 React.cache guarantees this query runs exactly once per render pass
export const getProductBySlug = cache(
  async (slug: string): Promise<Product | null> => {
    const res = await fetch(\`https://api.store.com/products/\${slug}\`, {
      next: { revalidate: 3600 }, // revalidate hourly
    });

    if (!res.ok) return null;
    return res.json();
  },
);`}</CodeBlock>

      <CodeBlock filename="app/products/[slug]/page.tsx">{`import type { Metadata, ResolvingMetadata } from 'next';
import { notFound } from 'next/navigation';
import { getProductBySlug } from '@/lib/db/product';

interface PageProps {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

// 🟢 the dynamic metadata generator
export async function generateMetadata(
  { params }: PageProps,
  parent: ResolvingMetadata,
): Promise<Metadata> {
  // 1. await the dynamic route params
  const { slug } = await params;

  // 2. fetch the data (deduplicated with the page below)
  const product = await getProductBySlug(slug);

  if (!product) {
    return {
      title: 'Product not found',
      description: 'The requested product could not be located.',
    };
  }

  // 3. resolve parent metadata, e.g. the layout's OpenGraph images
  const parentMetadata = await parent();
  const previousImages = parentMetadata.openGraph?.images || [];

  return {
    title: product.name,
    description: product.description,
    openGraph: {
      title: \`\${product.name} | TechStore\`,
      description: product.description,
      url: \`https://techstore.com/products/\${slug}\`,
      images: [product.imageUrl, ...previousImages],
    },
    twitter: {
      card: 'summary_large_image',
      title: product.name,
      description: product.description,
      images: [product.imageUrl],
    },
  };
}

// 🟢 the page shares the exact same cached call
export default async function ProductPage({ params }: PageProps) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);

  if (!product) {
    notFound();
  }

  return (
    <main className="p-8 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold">{product.name}</h1>
      <p className="text-xl text-green-600 font-semibold my-4">\${product.price}</p>
      <p className="text-gray-700">{product.description}</p>
    </main>
  );
}`}</CodeBlock>

      {/* ── Matrix ────────────────────────────────────────────────────── */}
      <H2 id="matrix">৪. Static vs. Dynamic Metadata</H2>

      <Table
        head={["বৈশিষ্ট্য", "Static metadata", "generateMetadata()"]}
        rows={[
          [
            "ইউজ কেস",
            "হোমপেজ, অ্যাবাউট, কন্ট্যাক্ট 🟢",
            "প্রোডাক্ট, ব্লগ পোস্ট, ডাইনামিক প্রোফাইল 🟢",
          ],
          [
            "Data source",
            "হার্ডকোডেড / এনভায়রনমেন্ট ভ্যারিয়েবল 🟡",
            "ডাটাবেজ বা REST/GraphQL API 🟢",
          ],
          [
            "Execution time",
            "বিল্ড টাইমে পার্স হয় ⚡",
            "রিকোয়েস্ট বা ISR রানটাইমে চলে ⚡",
          ],
          [
            "Performance overhead",
            "জিরো 🟢",
            "ডেটা ফেচ ক্যাশড থাকলে কার্যত জিরো 🟢",
          ],
        ]}
      />

      <Line name="ভুলু ভাই">
        ফাটাফাটি ফাহিম! <code>generateMetadata()</code> দিয়ে ডাটাবেজ কানেক্ট করার পর যেকোনো প্রোডাক্টের
        লিংক ফেসবুকে শেয়ার করতেই তার ছবি, নাম আর প্রাইস চলে আসছে — আর <code>React.cache()</code>-এর
        কারণে ব্যাকএন্ডেও ডুপ্লিকেট রিকোয়েস্ট যাচ্ছে না।
      </Line>

      {/* ── Takeaways ─────────────────────────────────────────────────── */}
      <H2 id="takeaway">Production Takeaways</H2>

      <Note>
        <ul>
          <li>
            <strong>Always await params:</strong> <code>generateMetadata({"{ params }"})</code>-এর ভেতর{" "}
            <code>await params</code> করতে ভুলবেন না।
          </li>
          <li>
            <strong>Use React.cache() for non-fetch queries:</strong> Prisma, Drizzle বা সরাসরি{" "}
            <code>pg</code> দিয়ে ডেটা আনলে ডুপ্লিকেট DB হিট বন্ধ করতে <code>cache()</code> দিয়ে
            র‍্যাপ করুন।
          </li>
          <li>
            <strong>Handle fallbacks gracefully:</strong> ডেটা না পাওয়া গেলে সুন্দর ফলব্যাক টাইটেল
            রিটার্ন করুন, যেন ক্রলার ৪০৪ পেজের জন্য বাজে মেটাডেটা ক্যাশ না করে।
          </li>
        </ul>
      </Note>
    </article>
  );
}
