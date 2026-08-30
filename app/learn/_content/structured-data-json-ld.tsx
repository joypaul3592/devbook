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
    label: { bn: "প্রতিযোগীর স্টার রেটিং", en: "The competitor's star rating" },
  },
  {
    id: "architecture",
    label: { bn: "JSON-LD ও rich snippet পাইপলাইন", en: "JSON-LD & rich snippet pipeline" },
  },
  {
    id: "mechanisms",
    label: { bn: "৩টি আর্কিটেকচারাল কনসেপ্ট", en: "Three architectural concepts" },
  },
  {
    id: "implementation",
    label: { bn: "Type-safe ও XSS-safe ইনজেকশন", en: "Type-safe & XSS-safe injection" },
  },
  {
    id: "matrix",
    label: { bn: "Structured Data Comparison", en: "Structured data comparison" },
  },
  {
    id: "takeaway",
    label: { bn: "Production Takeaways", en: "Production takeaways" },
  },
];

export default function StructuredDataJsonLd() {
  return (
    <article className="doc-prose">
      {/* ── The problem ───────────────────────────────────────────────── */}
      <H2 id="the-problem" anchorOnly>
        প্রতিযোগীর স্টার রেটিং
      </H2>

      <p>
        রাত ১২:৪০। প্রতিদ্বন্দ্বী সাইটের লিংকের নিচে ৫-স্টার রেটিং, ২২০টি রিভিউ, &quot;In
        Stock&quot; ব্যাজ ও প্রাইস ভেসে উঠছে — কিন্তু ভুলু ভাইয়ের লিংকে কেবল সাধারণ নীল টেক্সট।
      </p>

      <Line name="ভুলু ভাই">
        ফাহিম! গুগল ওদের স্টার রেটিং আর দাম সার্চ রেজাল্টে এভাবে দেখাচ্ছে কীভাবে? আমার প্রোডাক্ট পেজেও
        তো দাম আর রিভিউ লেখা আছে — তাহলে আমি Rich Snippet পাচ্ছি না কেন?
      </Line>

      <Line name="ফাহিম">
        ভুলু ভাই! ক্রলার মানুষ নয় যে HTML ডিজাইন দেখে বুঝে নেবে কোনটা দাম আর কোনটা রিভিউ। সার্চ
        ইঞ্জিনকে বোঝাতে হলে তাদের ভাষায় ডেটা স্ট্রাকচার করে দিতে হয় — একেই বলে Structured Data বা
        JSON-LD।
      </Line>

      <Line name="নেক্সট-ভাই">
        একদম! HTML-এ এলোমেলো ট্যাগ না বসিয়ে{" "}
        <code>&lt;script type=&quot;application/ld+json&quot;&gt;</code> ফরম্যাটে Schema.org কনভেনশন
        অনুযায়ী ডেটা ইনজেক্ট করলে গুগল ও বিং Rich Snippet দেয়। চলুন App Router-এ টাইপ-সেফ ও XSS-সেফ
        উপায়ে সেটি রেন্ডার করি।
      </Line>

      {/* ── Architecture ──────────────────────────────────────────────── */}
      <H2 id="architecture">১. JSON-LD Structured Data Pipeline</H2>

      <Diagram>{`┌─────────────────────────────────────────────────────────────────────────┐
│                    JSON-LD STRUCTURED DATA PIPELINE                     │
└─────────────────────────────────────────────────────────────────────────┘

 server component ──► builds a type-safe Schema.org object
                                     │
                                     ▼
 HTML output: <script type="application/ld+json">...</script>
                                     │
                                     ▼
 crawler (Googlebot) parses the linked data
                                     │
                                     ▼
 🟢 RICH RESULT ON THE SEARCH PAGE
 ┌───────────────────────────────────────────────────────────────────────┐
 │ TechStore — Wireless Headphones                                       │
 │ https://techstore.com/products/headphones                             │
 │ ★★★★★ 4.9 — 128 reviews — $199.00 — in stock                          │
 └───────────────────────────────────────────────────────────────────────┘`}</Diagram>

      {/* ── Mechanisms ────────────────────────────────────────────────── */}
      <H2 id="mechanisms">২. কোর আর্কিটেকচারাল কনসেপ্ট</H2>

      <p>
        <strong>Semantic machine readability:</strong> Schema.org ভোকাবুলারি সার্চ ইঞ্জিনকে পেজের
        সুনির্দিষ্ট এনটিটি — <code>Product</code>, <code>Article</code>, <code>FAQPage</code>,{" "}
        <code>Organization</code> — স্পষ্টভাবে বোঝায়।
      </p>

      <p>
        <strong>Rich snippets &amp; CTR:</strong> রিভিউ স্টার, প্রাইসিং, স্টক স্ট্যাটাস ও ব্রেডক্রাম্ব
        সরাসরি সার্চ ফলাফলে দেখানোর ফলে ইউজার ট্রাস্ট ও click-through rate অনেক বেড়ে যায়।
      </p>

      <p>
        <strong>XSS-safe RSC injection:</strong> সার্ভার কম্পোনেন্টে JSON-LD ইনজেক্ট করলে ক্লায়েন্ট
        রানটাইম ওভারহেড ছাড়াই ক্রলার সম্পূর্ণ স্ট্রাকচার্ড ডেটা পায় — তবে স্ট্রিংটি অবশ্যই sanitize
        করতে হয়।
      </p>

      {/* ── Implementation ────────────────────────────────────────────── */}
      <H2 id="implementation">৩. Production Code Implementation</H2>

      <H3>❌ Anti-pattern — unescaped inline JSON string</H3>

      <CodeBlock filename="app/products/[slug]/legacy-page.tsx">{`// 🔴 POOR PRACTICE: unsanitized JSON injection with no schema typing

export default function BadProductPage({ product }: { product: { name: string } }) {
  const jsonLd = \`{
    "@context": "https://schema.org",
    "@type": "Product",
    "name": "\${product.name}"
  }\`;

  return (
    <div>
      {/* ❌ an unescaped string can break out of the script tag (XSS) */}
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLd }} />
      <h1>{product.name}</h1>
    </div>
  );
}`}</CodeBlock>

      <H3>🟢 Production pattern — a type-safe, sanitized JSON-LD engine</H3>

      <CodeBlock filename="terminal">{`# 🟢 type definitions for the whole Schema.org vocabulary
npm install schema-dts`}</CodeBlock>

      <CodeBlock filename="components/seo/JsonLd.tsx">{`// 🟢 a reusable, XSS-safe JSON-LD injector
import type { Thing, WithContext } from 'schema-dts';

interface JsonLdProps<T extends Thing> {
  data: WithContext<T>;
}

export function JsonLd<T extends Thing>({ data }: JsonLdProps<T>) {
  // 🟢 escape '<' so the payload can never close the script tag
  const sanitizedJson = JSON.stringify(data).replace(/</g, '\\\\u003c');

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: sanitizedJson }}
    />
  );
}`}</CodeBlock>

      <CodeBlock filename="app/products/[slug]/page.tsx">{`import { notFound } from 'next/navigation';
import type { Product as SchemaProduct, WithContext } from 'schema-dts';
import { getProductBySlug } from '@/lib/db/product';
import { JsonLd } from '@/components/seo/JsonLd';

interface PageProps {
  params: Promise<{ slug: string }>;
}

export default async function ProductPage({ params }: PageProps) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);

  if (!product) {
    notFound();
  }

  // 🟢 the payload is fully typed, with autocompletion on every Schema.org field
  const productSchema: WithContext<SchemaProduct> = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.name,
    image: [product.imageUrl],
    description: product.description,
    sku: product.sku || product.id,
    brand: {
      '@type': 'Brand',
      name: product.brandName || 'TechStore',
    },
    offers: {
      '@type': 'Offer',
      url: \`https://techstore.com/products/\${slug}\`,
      priceCurrency: 'USD',
      price: product.price,
      itemCondition: 'https://schema.org/NewCondition',
      availability: product.inStock
        ? 'https://schema.org/InStock'
        : 'https://schema.org/OutOfStock',
    },
    aggregateRating:
      product.reviewCount > 0
        ? {
            '@type': 'AggregateRating',
            ratingValue: product.ratingAverage,
            reviewCount: product.reviewCount,
          }
        : undefined,
  };

  return (
    <main className="p-8 max-w-4xl mx-auto">
      {/* 🟢 injected safely from the server component */}
      <JsonLd data={productSchema} />

      <h1 className="text-3xl font-bold">{product.name}</h1>
      <p className="text-xl text-green-600 font-bold my-2">\${product.price}</p>
      <p className="text-gray-700">{product.description}</p>
    </main>
  );
}`}</CodeBlock>

      {/* ── Matrix ────────────────────────────────────────────────────── */}
      <H2 id="matrix">৪. Structured Data Architecture Comparison</H2>

      <Table
        head={["বৈশিষ্ট্য", "Plain meta / HTML", "Microdata (inline)", "JSON-LD"]}
        rows={[
          [
            "ডেটা ফরম্যাট",
            "প্লেইন টেক্সট ও মেটা ট্যাগ",
            "HTML ট্যাগের ভেতরে অ্যাট্রিবিউট",
            "স্বতন্ত্র schema-compliant JSON 🟢",
          ],
          [
            "মেইনটেনেবিলিটি",
            "সার্চ ইঞ্জিনের কাছে অস্পষ্ট 🔴",
            "মার্কআপ ও ডেটা জড়িয়ে যায় 🔴",
            "মার্কআপ থেকে সম্পূর্ণ আলাদা 🟢",
          ],
          [
            "গুগল রেকমেন্ডেশন",
            "বেসিক 🟡",
            "পুরনো স্ট্যান্ডার্ড 🟡",
            "সর্বোচ্চ রেকমেন্ডেড 🟢",
          ],
          [
            "টাইপ সেফটি",
            "সীমিত 🔴",
            "নেই 🔴",
            <span key="d">
              <code>schema-dts</code> দিয়ে ১০০% 🟢
            </span>,
          ],
        ]}
      />

      <Line name="ভুলু ভাই">
        জোস ফাহিম! <code>schema-dts</code> আর <code>JsonLd</code> হেল্পার ব্যবহারের পর প্রোডাক্ট পেজের
        সোর্সে প্রাইসিং, রেটিং আর স্টক নিখুঁতভাবে ইনজেক্ট হয়ে গেছে — Rich Results Test-এও গ্রিন টিক।
      </Line>

      {/* ── Takeaways ─────────────────────────────────────────────────── */}
      <H2 id="takeaway">Production Takeaways</H2>

      <Note>
        <ul>
          <li>
            <strong>Sanitize the JSON string:</strong> <code>JSON.stringify()</code>-এর আউটপুটে{" "}
            <code>&lt;</code> ক্যারেক্টার escape করে তবেই ইনজেক্ট করুন — নাহলে XSS বা ভাঙা স্ক্রিপ্টের
            ঝুঁকি থাকে।
          </li>
          <li>
            <strong>Use schema-dts:</strong> TypeScript প্রজেক্টে স্কিমা কী ও ভ্যালু ভ্যালিডেশনের জন্য
            এই প্যাকেজটি ব্যবহার করুন।
          </li>
          <li>
            <strong>Verify with the Rich Results Test:</strong> ডিপ্লয়ের পর গুগলের টুলে জেনারেট হওয়া
            HTML ফেলে এরর-মুক্ত কিনা যাচাই করে নিন।
          </li>
        </ul>
      </Note>
    </article>
  );
}
