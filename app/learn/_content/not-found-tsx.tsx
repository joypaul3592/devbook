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
      bn: "প্রোডাক্ট নেই, তবু 200 OK",
      en: "No product, still 200 OK",
    },
  },
  {
    id: "architecture",
    label: {
      bn: "notFound() এক্সিকিউশন ফ্লো",
      en: "The notFound() execution flow",
    },
  },
  {
    id: "mechanisms",
    label: { bn: "৩টি আর্কিটেকচারাল কনসেপ্ট", en: "Three architectural concepts" },
  },
  {
    id: "implementation",
    label: {
      bn: "Programmatic 404 ও কাস্টম UI",
      en: "Programmatic 404s & custom UI",
    },
  },
  {
    id: "matrix",
    label: { bn: "Soft 404 vs notFound()", en: "Soft 404 vs notFound()" },
  },
  {
    id: "takeaway",
    label: { bn: "Production Takeaways", en: "Production takeaways" },
  },
];

export default function NotFoundTsx() {
  return (
    <article className="doc-prose">
      {/* ── The problem ───────────────────────────────────────────────── */}
      <H2 id="the-problem" anchorOnly>
        প্রোডাক্ট নেই, তবু 200 OK
      </H2>

      <p>
        দুপুর ২:১০। ভুলু ভাই ই-কমার্স ওয়েবসাইটের ড্যাশবোর্ডে কাজ করছেন। এক ক্লায়েন্ট লিংক পাঠালো:{" "}
        <code>myshop.com/products/invalid-slug-123</code>। ভুলু ভাই খেয়াল করলেন, প্রোডাক্ট না পেয়ে
        ডাটাবেস থেকে <code>null</code> আসছে — কিন্তু পেজ ক্র্যাশ না করলেও ব্রাউজারের স্ট্যাটাসে{" "}
        <code>200 OK</code> দেখাচ্ছে এবং স্ক্রিনে খালি সাদা একটি ডিভ ঝুলছে।
      </p>

      <Line name="ভুলু ভাই">
        ফাহিম! ডাটাবেসে প্রোডাক্ট নেই, তাও ব্রাউজারে ২০০ OK দেখায় কেন? সার্চ ইঞ্জিন তো এটাকে ভ্যালিড
        পেজ ভেবে ইনডেক্স করে ফেলবে!
      </Line>

      <Line name="ফাহিম">
        ভুলু ভাই! ডেটা না থাকলে আমরা যদি শুধু{" "}
        <code>if (!product) return &lt;div&gt;Not Found&lt;/div&gt;</code> লিখে দিই, তবে HTTP response
        status code কিন্তু ২০০-ই থেকে যায়। এটাকে বলে <strong>soft 404</strong> — যা SEO-এর জন্য
        মারাত্মক ক্ষতিকর!
      </Line>

      <Line name="নেক্সট-ভাই">
        একদম! App Router-এ ডেটা মিসিং হলে ব্যবহার করতে হবে <code>next/navigation</code>-এর{" "}
        <code>notFound()</code> ফাংশন। এটি সাথে সাথেই প্রপার ৪০৪ status code পাঠায় এবং সবচেয়ে কাছের{" "}
        <code>not-found.tsx</code> পেজটি রেন্ডার করে!
      </Line>

      {/* ── Architecture ──────────────────────────────────────────────── */}
      <H2 id="architecture">১. not-found.tsx Execution Flow</H2>

      <Diagram>{`┌─────────────────────────────────────────────────────────────────────────────┐
│                 NEXT.JS 404 ROUTING & NOT-FOUND FLOW                        │
└─────────────────────────────────────────────────────────────────────────────┘

 User requests: /products/invalid-id-999
                       │
                       ▼
            app/products/[id]/page.tsx  (Server Component)
                       │
                       ▼
            the database query returns null
                       │
                       ▼
            calls notFound() from 'next/navigation'
                       │
       ┌───────────────┴──────────────────────────┐
       ▼                                          ▼
 [response header]                     [component tree lookup]
 Status: 404 Not Found                 nearest not-found.tsx wins:
 (no more soft 404)                    1. app/products/[id]/not-found.tsx
                                       2. app/products/not-found.tsx
                                       3. app/not-found.tsx  (fallback)`}</Diagram>

      {/* ── Mechanisms ────────────────────────────────────────────────── */}
      <H2 id="mechanisms">২. কোর আর্কিটেকচারাল কনসেপ্ট</H2>

      <p>
        <strong>Automatic vs programmatic triggering:</strong> ইউজার এমন কোনো রাউটে হিট করলে যা রাউটার
        ট্রিতে নেই (<code>/random-unknown-url</code>), Next.js স্বয়ংক্রিয়ভাবে{" "}
        <code>app/not-found.tsx</code> লোড করে। আর রাউট ভ্যালিড কিন্তু ডাইনামিক আইডি ডাটাবেসে না
        পাওয়া গেলে <code>notFound()</code> কল করে সেই একই UI ও ৪০৪ স্ট্যাটাস ট্রিগার করতে হয়।
      </p>

      <p>
        <strong>Soft 404 prevention:</strong> Googlebot যখন কোনো URL ক্রল করে সেখানে &quot;Product not
        found&quot; টেক্সট পায় কিন্তু status <code>200 OK</code> পায়, তখন সে পেজটিকে ইনডেক্স করে ফেলে।{" "}
        <code>notFound()</code> ট্রিগার করলে Next.js নিশ্চিতভাবে <code>404</code> হেডার পাঠায়।
      </p>

      <p>
        <strong>Server component &amp; granular scope:</strong> <code>error.tsx</code>-এর মতো{" "}
        <code>not-found.tsx</code>-কে <code>&apos;use client&apos;</code> হতে হয় না — এটি ডিফল্টভাবেই
        একটি Server Component। এছাড়া প্রতিটি সেগমেন্টের জন্য আলাদা ভিজ্যুয়াল থিমসহ নিজস্ব ৪০৪ পেজ
        তৈরি করা যায়।
      </p>

      {/* ── Implementation ────────────────────────────────────────────── */}
      <H2 id="implementation">৩. Production Code Implementation</H2>

      <H3>❌ Anti-pattern — the soft 404</H3>

      <CodeBlock filename="app/products/[id]/page.tsx">{`// 🔴 POOR PRACTICE: rendering a "not found" UI without the status code
// generates a soft 404 — hurts SEO and skips the shared 404 layout

import { db } from '@/lib/db';

export default async function ProductPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const product = await db.product.findUnique({ where: { id } });

  // ❌ returns HTTP 200 OK instead of 404
  if (!product) {
    return (
      <div className="p-10 text-center">
        <h2>প্রোডাক্ট পাওয়া যায়নি!</h2>
      </div>
    );
  }

  return <div>{product.name}</div>;
}`}</CodeBlock>

      <H3>🟢 Production pattern — a programmatic 404 with custom UI</H3>

      <p>
        <strong>Step 1 — সেগমেন্ট-স্পেসিফিক ৪০৪ পেজ।</strong>
      </p>

      <CodeBlock filename="app/products/[id]/not-found.tsx">{`// 🟢 PRODUCTION PATTERN: a Server Component 404 for this segment only
import Link from 'next/link';

export default function ProductNotFound() {
  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center text-center p-6 space-y-6">
      <div className="w-20 h-20 bg-orange-100 text-orange-600 rounded-full flex items-center justify-center font-bold text-3xl">
        404
      </div>

      <div className="space-y-2">
        <h1 className="text-2xl font-bold text-gray-900">প্রোডাক্টটি খুঁজে পাওয়া যায়নি!</h1>
        <p className="text-gray-500 max-w-md text-sm">
          আপনি যে প্রোডাক্টটি খুঁজছেন তা হয়তো মুছে ফেলা হয়েছে, অথবা লিংকটি সঠিক নয়।
        </p>
      </div>

      {/* 🟢 a dead end is bad UX — always offer the way back */}
      <div className="flex gap-4">
        <Link
          href="/products"
          className="px-5 py-2.5 bg-orange-600 text-white font-medium rounded-lg hover:bg-orange-700"
        >
          সব প্রোডাক্ট দেখুন
        </Link>
        <Link
          href="/"
          className="px-5 py-2.5 border border-gray-300 font-medium rounded-lg hover:bg-gray-50"
        >
          হোমপেজে যান
        </Link>
      </div>
    </div>
  );
}`}</CodeBlock>

      <p>
        <strong>Step 2 — সার্ভার কম্পোনেন্টে notFound() কল।</strong>
      </p>

      <CodeBlock filename="app/products/[id]/page.tsx">{`// 🟢 PRODUCTION PATTERN: proper notFound() invocation
import { notFound } from 'next/navigation';
import { db } from '@/lib/db';

interface Props {
  params: Promise<{ id: string }>;
}

export default async function ProductDetailPage({ params }: Props) {
  const { id } = await params;
  const product = await db.product.findUnique({ where: { id } });

  // 🟢 sends HTTP 404 and renders the nearest not-found.tsx
  // notFound() throws, so TypeScript narrows product to non-null after this
  if (!product) {
    notFound();
  }

  return (
    <main className="p-6">
      <h1 className="text-3xl font-bold">{product.name}</h1>
      <p className="text-lg text-gray-700">মূল্য: ৳{product.price}</p>
    </main>
  );
}`}</CodeBlock>

      {/* ── Matrix ────────────────────────────────────────────────────── */}
      <H2 id="matrix">৪. Soft 404 vs Proper notFound()</H2>

      <Table
        head={["বিষয়", "Soft 404 (anti-pattern)", "notFound() (production)"]}
        rows={[
          ["HTTP status", "200 OK 🔴", "404 Not Found 🟢"],
          [
            "SEO",
            "সার্চ ইঞ্জিন কনটেন্ট ইনডেক্স করে ফেলে 🔴",
            "পেজটি ইনডেক্স থেকে বাদ যায় 🟢",
          ],
          [
            "UI rendering",
            "লোকাল ইনলাইন <div> 🔴",
            "সেন্ট্রালাইজড বা নেস্টেড not-found.tsx 🟢",
          ],
          ["ট্রিগার", "if (!data) return <UI/> 🔴", "if (!data) notFound() 🟢"],
        ]}
      />

      <Line name="ভুলু ভাই">
        ওয়াও! <code>notFound()</code> ট্রিগার করলে যে অরিজিনাল HTTP 404 হেডার যায় আর নেস্টেড{" "}
        <code>not-found.tsx</code> লোড হয় — এটা জানা খুব দরকার ছিল! এখন আমার সাইটের SEO একদম সেফ।
      </Line>

      {/* ── Takeaways ─────────────────────────────────────────────────── */}
      <H2 id="takeaway">Production Takeaways</H2>

      <Note>
        <ul>
          <li>
            <strong>Avoid soft 404s:</strong> কোনো রিসোর্স না থাকলে শুধু fallback JSX রেন্ডার করবেন না
            — অবশ্যই <code>next/navigation</code> থেকে <code>notFound()</code> কল করুন।
          </li>
          <li>
            <strong>not-found.tsx is a Server Component:</strong> <code>error.tsx</code>-এর মতো এতে{" "}
            <code>&apos;use client&apos;</code> দেওয়ার প্রয়োজন নেই — এটি সার্ভারে রেন্ডার হয়ে সরাসরি
            ৪০৪ রেসপন্স পাঠায়।
          </li>
          <li>
            <strong>Use granular 404 boundaries:</strong> বড় প্ল্যাটফর্মে <code>/dashboard</code> এবং{" "}
            <code>/products</code>-এর জন্য আলাদা ডিজাইনের <code>not-found.tsx</code> রাখা
            আর্কিটেকচারালি উত্তম।
          </li>
        </ul>
      </Note>
    </article>
  );
}
