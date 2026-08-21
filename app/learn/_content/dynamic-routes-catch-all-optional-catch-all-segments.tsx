import {
  CodeBlock,
  Diagram,
  H2,
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
      bn: "কত গভীর হতে পারে একটা URL?",
      en: "How deep can a URL go?",
    },
  },
  {
    id: "three-patterns",
    label: { bn: "তিনটি ডাইনামিক প্যাটার্ন", en: "The three patterns" },
  },
  {
    id: "single",
    label: { bn: "Single Dynamic Segment", en: "Single dynamic segment" },
  },
  {
    id: "catch-all",
    label: { bn: "Catch-All Segment", en: "Catch-all segment" },
  },
  {
    id: "optional",
    label: { bn: "Optional Catch-All", en: "Optional catch-all" },
  },
  {
    id: "matrix",
    label: { bn: "সিদ্ধান্তের ছক", en: "The decision matrix" },
  },
  {
    id: "takeaway",
    label: { bn: "Production Takeaways", en: "Production takeaways" },
  },
];

export default function DynamicAndCatchAllRoutes() {
  return (
    <article className="doc-prose">
      {/* ── The problem ───────────────────────────────────────────────── */}
      <H2 id="the-problem" anchorOnly>
        কত গভীর হতে পারে একটা URL?
      </H2>

      <p>
        রাত ২:০৫। ভুলু ভাই একটি ই-কমার্স ও ব্লগ প্ল্যাটফর্মের URL স্ট্রাকচার নিয়ে মাথায় হাত
        দিয়ে বসে আছেন। প্রোডাক্ট পেজ, ক্যাটাগরি পেজ, ফিল্টারিং আর ব্লগ পোস্টের জন্য কত রকম URL
        আসতে পারে তার হিসেব মেলাতে গিয়ে ফোল্ডার স্ট্রাকচার হজবরল হয়ে গেছে!
      </p>

      <Line name="ভুলু ভাই">
        (হতাশ কণ্ঠে) নেক্সট-ভাই! সিঙ্গেল প্রোডাক্টের জন্য লাগবে{" "}
        <code>/products/iphone-15</code> — একটা আইডি বা স্লাগ দিয়ে। কিন্তু ডকুমেন্টেশনের URL
        তো আনলিমিটেড গভীর হতে পারে: <code>/docs/nextjs/routing/dynamic-routes</code> (৩
        লেভেল), আবার <code>/docs/react</code> (১ লেভেল)। এমনকি ইউজার যদি শুধু{" "}
        <code>/docs</code>-এ যায়, সেখানেও আমি একই ফাইল দিয়ে হ্যান্ডেল করতে চাই!
      </Line>

      <Line name="ভুলু ভাই">
        প্রতিটি গভীরতার জন্য কি আলাদা আলাদা ফোল্ডার বানাতে হবে? নাকি একটা সিঙ্গেল স্ট্রাকচার
        দিয়ে যেকোনো গভীরতার URL হ্যান্ডেল করার স্মার্ট টেকনিক আছে?
      </Line>

      <Line name="নেক্সট-ভাই">
        (হেসে) ভুলু, এখানেই App Router-এর ৩টি স্কয়ার-ব্র্যাকেট প্যাটার্ন তোর জীবন একশো গুণ
        সহজ করে দেবে — Single Dynamic Segment, Catch-All, আর Optional Catch-All!
      </Line>

      {/* ── Three patterns ────────────────────────────────────────────── */}
      <H2 id="three-patterns">১. তিনটি ডাইনামিক প্যাটার্ন</H2>

      <Diagram>{`                          DYNAMIC ROUTE PATTERNS
                                     │
        ┌────────────────────────────┼────────────────────────────┐
        ▼                            ▼                            ▼
┌───────────────┐            ┌───────────────┐            ┌───────────────┐
│Dynamic Segment│            │   Catch-All   │            │Opt. Catch-All │
│    [slug]     │            │  [...slug]    │            │  [[...slug]]  │
└───────┬───────┘            └───────┬───────┘            └───────┬───────┘
        │                            │                            │
 EXACTLY 1 segment            1 OR MORE segments          0 OR MORE segments
 Ex: /blog/hello              Ex: /docs/a/b/c             Ex: /docs OR /docs/a/b
 (404 on /blog)               (404 on /docs)              (matches everything)`}</Diagram>

      <Note>
        <p>
          Next.js 15+ থেকে <code>params</code> একটি Promise, তাই এটিকে <code>await</code>{" "}
          করে (বা ক্লায়েন্টে React-এর <code>use()</code> দিয়ে) অ্যাক্সেস করতে হয়।
        </p>
      </Note>

      {/* ── Single ────────────────────────────────────────────────────── */}
      <H2 id="single">২. Single Dynamic Segment — [slug]</H2>

      <p>
        একদম নির্দিষ্ট ১টি প্যারামিটার ক্যাচ করার জন্য। ফোল্ডার:{" "}
        <code>app/products/[id]/page.tsx</code>
      </p>

      <CodeBlock filename="app/products/[id]/page.tsx">{`interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function ProductDetailPage({ params }: PageProps) {
  // ⚡ Next.js 15+: await the params promise
  const { id } = await params;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold">Product Details</h1>
      <p className="text-gray-600">
        Product ID / Slug: <span className="font-mono text-blue-600">{id}</span>
      </p>
    </div>
  );
}`}</CodeBlock>

      <ul>
        <li>
          <code>/products/iphone-16</code> ➔ <code>{'{ id: "iphone-16" }'}</code>
        </li>
        <li>
          <code>/products</code> ➔ ❌ 404 — রুট পেজ ম্যাচ করে না
        </li>
      </ul>

      {/* ── Catch-all ─────────────────────────────────────────────────── */}
      <H2 id="catch-all">৩. Catch-All Segment — [...slug]</H2>

      <p>
        ফোল্ডার নামের আগে তিনটি ডট দিলে এটি ১ বা একাধিক গভীরতার যেকোনো URL ট্রেইলকে একটি
        Array হিসেবে তুলে নেয়। ফোল্ডার: <code>app/docs/[...slug]/page.tsx</code>
      </p>

      <CodeBlock filename="app/docs/[...slug]/page.tsx">{`interface PageProps {
  params: Promise<{ slug: string[] }>;
}

export default async function DocsPage({ params }: PageProps) {
  const { slug } = await params;

  return (
    <div className="p-6 space-y-4">
      <h1 className="text-2xl font-bold">Documentation Reader</h1>

      {/* Breadcrumb built straight from the array */}
      <div className="flex gap-2 text-sm text-slate-500">
        <span>docs</span>
        {slug.map((segment, idx) => (
          <span key={idx}> / <span className="text-blue-500 font-semibold">{segment}</span></span>
        ))}
      </div>

      <p className="text-sm">
        Current path segments:{' '}
        <code className="bg-slate-100 p-1 rounded">{JSON.stringify(slug)}</code>
      </p>
    </div>
  );
}`}</CodeBlock>

      <ul>
        <li>
          <code>/docs/nextjs</code> ➔ <code>{'{ slug: ["nextjs"] }'}</code>
        </li>
        <li>
          <code>/docs/nextjs/routing/catch-all</code> ➔{" "}
          <code>{'{ slug: ["nextjs", "routing", "catch-all"] }'}</code>
        </li>
        <li>
          <code>/docs</code> ➔ ❌ 404 — কোনো ট্রেইলিং স্লাগ নেই
        </li>
      </ul>

      {/* ── Optional catch-all ────────────────────────────────────────── */}
      <H2 id="optional">৪. Optional Catch-All — [[...slug]]</H2>

      <p>
        দুই জোড়া ব্র্যাকেটের ভেতরে তিন ডট — একদম জাদুকরী! এটি ০ বা যেকোনো সংখ্যক স্লাগ সামলায়।
        ইউজার স্লাগ ছাড়া মূল ডিরেক্টরিতে ঢুকলেও ৪০৪ না দিয়ে ফ্যালব্যাক হিসেবে কাজ করে।
      </p>

      <CodeBlock filename="app/shop/[[...categories]]/page.tsx">{`interface PageProps {
  params: Promise<{ categories?: string[] }>;
}

export default async function ShopCategoryPage({ params }: PageProps) {
  const { categories } = await params;

  // Handle the zero-segment root URL (/shop)
  if (!categories || categories.length === 0) {
    return (
      <div className="p-6">
        <h1 className="text-2xl font-bold">All Products Catalog</h1>
        <p className="text-gray-500">Showing the main shop landing page.</p>
      </div>
    );
  }

  // Handle multi-segment URLs, e.g. /shop/electronics/laptops/macbook
  const [mainCat, subCat, brand] = categories;

  return (
    <div className="p-6 space-y-2">
      <h1 className="text-2xl font-bold capitalize">Category: {mainCat}</h1>
      {subCat && <p className="text-slate-600">Sub category: {subCat}</p>}
      {brand && <p className="text-slate-600">Brand filter: {brand}</p>}
    </div>
  );
}`}</CodeBlock>

      <ul>
        <li>
          <code>/shop</code> ➔ <code>{"{}"}</code> — ৪০৪ ছাড়াই রেসপন্ড করে
        </li>
        <li>
          <code>/shop/electronics</code> ➔ <code>{'{ categories: ["electronics"] }'}</code>
        </li>
        <li>
          <code>/shop/electronics/laptops</code> ➔{" "}
          <code>{'{ categories: ["electronics", "laptops"] }'}</code>
        </li>
      </ul>

      {/* ── Matrix ────────────────────────────────────────────────────── */}
      <H2 id="matrix">৫. সিদ্ধান্তের ছক</H2>

      <Table
        head={[
          "রুট টাইপ",
          "সিনট্যাক্স",
          "ম্যাচ করার উদাহরণ",
          <>
            <code>params</code> টাইপ
          </>,
          "৪০৪ কখন",
        ]}
        rows={[
          [
            "Dynamic",
            <code key="d">[id]</code>,
            "/products/123",
            <code key="dt">{"{ id: string }"}</code>,
            "একাধিক লেভেল হলে বা একদম না থাকলে",
          ],
          [
            "Catch-All",
            <code key="c">[...slug]</code>,
            "/docs/a, /docs/a/b/c",
            <code key="ct">{"{ slug: string[] }"}</code>,
            "রুট রুটে (/docs) স্লাগ না থাকলে",
          ],
          [
            "Optional Catch-All",
            <code key="o">[[...slug]]</code>,
            "/shop, /shop/a, /shop/a/b",
            <code key="ot">{"{ slug?: string[] }"}</code>,
            "কখনোই না — সব ক্যাচ করে",
          ],
        ]}
      />

      <Line name="ভুলু ভাই">
        (পরিষ্কার হয়ে) আহাহা! শুধু প্রডাক্ট আইডি চাইলে <code>[id]</code>, নেস্টেড
        ডকুমেন্টেশন যেখানে ডিরেক্টরি অবশ্যই থাকবে সেখানে <code>[...slug]</code>, আর শপের
        মেইন পেজ সহ নেস্টেড ফিল্টার একসাথে এক ফাইলে চাইলে <code>[[...categories]]</code>!
      </Line>

      {/* ── Takeaways ─────────────────────────────────────────────────── */}
      <H2 id="takeaway">Production Takeaways</H2>

      <Note>
        <ul>
          <li>
            <strong>generateStaticParams:</strong> ডাইনামিক বা Catch-All রুটে বিল্ড টাইমে
            পেজ প্রাক-রেন্ডার (SSG) করতে <code>generateStaticParams()</code> ব্যবহার করতে
            হয়।
          </li>
          <li>
            <strong>Type Safety:</strong> Optional Catch-All-এর ক্ষেত্রে টাইপ দিন{" "}
            <code>categories?: string[]</code> — অপশনাল অ্যারে, নাহলে টাইপচেক এরর দেবে।
          </li>
        </ul>
      </Note>
    </article>
  );
}
