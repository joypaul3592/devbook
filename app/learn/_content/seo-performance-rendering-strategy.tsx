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
    label: { bn: "মোবাইল স্কোর ৪২", en: "A mobile score of 42" },
  },
  {
    id: "architecture",
    label: { bn: "RSC streaming ও Web Vitals", en: "RSC streaming & Web Vitals" },
  },
  {
    id: "mechanisms",
    label: { bn: "৩টি আর্কিটেকচারাল কনসেপ্ট", en: "Three architectural concepts" },
  },
  {
    id: "implementation",
    label: { bn: "Font, image ও Suspense", en: "Fonts, images & Suspense" },
  },
  {
    id: "matrix",
    label: { bn: "Rendering Strategy Matrix", en: "Rendering strategy matrix" },
  },
  {
    id: "takeaway",
    label: { bn: "Production Takeaways", en: "Production takeaways" },
  },
];

export default function SeoPerformanceRenderingStrategy() {
  return (
    <article className="doc-prose">
      {/* ── The problem ───────────────────────────────────────────────── */}
      <H2 id="the-problem" anchorOnly>
        মোবাইল স্কোর ৪২
      </H2>

      <p>
        রাত ২:১৫। PageSpeed Insights-এ মোবাইল পারফরম্যান্স স্কোর ৪২, LCP প্রায় ৪.৮ সেকেন্ড, আর
        প্রোডাক্টের ছবি লোড হওয়ার সাথে সাথে টেক্সট নিচে নেমে যাওয়ায় CLS ফেইল করেছে।
      </p>

      <Line name="ভুলু ভাই">
        ফাহিম! মেটাডেটা, ক্যানোনিকাল, সাইটম্যাপ, JSON-LD — সব তো প্রফেশনালি সেট করলাম! তাও পেজস্পিড
        টেস্টে লাল বাতি জ্বলছে কেন?
      </Line>

      <Line name="ফাহিম">
        ভুলু ভাই! মেটাডেটা হলো SEO-র কাঠামো, আর Core Web Vitals তার প্রাণ। গুগল এখন শুধু মেটা ট্যাগ পড়ে
        না — ইউজার কত দ্রুত প্রথম কনটেন্ট দেখছে (LCP), লেআউট লাফায় কিনা (CLS), আর ইন্টার‌অ্যাকশনে কত
        দ্রুত সাড়া দিচ্ছে (INP) — এই তিনটির ওপরেও র‍্যাঙ্কিং নির্ভর করে।
      </Line>

      <Line name="নেক্সট-ভাই">
        একদম! আর এই তিন মেট্রিককে গ্রিন জোনে নেওয়ার হাতিয়ার হলো Server Components, Suspense-ভিত্তিক
        স্ট্রিমিং, এবং <code>next/font</code> ও <code>next/image</code> অপটিমাইজেশন।
      </Line>

      {/* ── Architecture ──────────────────────────────────────────────── */}
      <H2 id="architecture">১. RSC Streaming &amp; Core Web Vitals Pipeline</H2>

      <Diagram>{`┌─────────────────────────────────────────────────────────────────────────┐
│              RSC STREAMING & CORE WEB VITALS OPTIMIZATION               │
└─────────────────────────────────────────────────────────────────────────┘

 browser / crawler request
            │
            ▼
 the server streams <head> + critical metadata immediately (fast TTFB)
            │
            ├──► the hero UI and image render server-side ──► fast LCP 🟢
            │
            └──► slow DB/API components sit behind <Suspense>
                 └── their HTML streams in later — no layout shift, low CLS 🟢`}</Diagram>

      {/* ── Mechanisms ────────────────────────────────────────────────── */}
      <H2 id="mechanisms">২. কোর আর্কিটেকচারাল কনসেপ্ট</H2>

      <p>
        <strong>Core Web Vitals targets:</strong> LCP — প্রধান কনটেন্ট ২.৫ সেকেন্ডের নিচে রেন্ডার হওয়া
        চাই; CLS — ইমেজ বা ফন্ট লোডে এলিমেন্ট স্থানচ্যুত না হওয়া (০.১-এর নিচে); INP — ইন্টার‌অ্যাকশনে
        রেসপন্স ২০০ মিলিসেকেন্ডের কম।
      </p>

      <p>
        <strong>Zero client-side JS from RSC:</strong> সার্ভার কম্পোনেন্টের কোনো JS বান্ডল ব্রাউজারে
        যায় না — ফলে মেইন থ্রেড ফাঁকা থাকে এবং INP ভালো হয়।
      </p>

      <p>
        <strong>Head streaming with Suspense:</strong> স্লো ডেটা ফেচিং পুরো পেজকে আটকে না রেখে{" "}
        <code>&lt;Suspense&gt;</code>-এ মুড়ে দিলে Next.js মেটাডেটাসহ <code>&lt;head&gt;</code>{" "}
        সঙ্গে সঙ্গে ক্রলারের কাছে স্ট্রিম করে দেয়।
      </p>

      {/* ── Implementation ────────────────────────────────────────────── */}
      <H2 id="implementation">৩. Production Code Implementation</H2>

      <H3>❌ Anti-pattern — client-side fetching and unsized images</H3>

      <CodeBlock filename="app/products/[slug]/legacy-client-page.tsx">{`// 🔴 POOR PRACTICE: heavy hydration, layout shift and a delayed LCP
'use client';

import { useState, useEffect } from 'react';

export default function BadProductPage({ slug }: { slug: string }) {
  const [product, setProduct] = useState<{ name: string; imageUrl: string } | null>(null);

  useEffect(() => {
    // ❌ the client-side fetch delays LCP and shifts the layout
    fetch(\`/api/products/\${slug}\`)
      .then((res) => res.json())
      .then(setProduct);
  }, [slug]);

  if (!product) return <div>Loading...</div>; // ❌ the DOM jumps when data arrives

  return (
    <div>
      <h1>{product.name}</h1>
      {/* ❌ a plain img with no dimensions — a large CLS contributor */}
      <img src={product.imageUrl} alt={product.name} />
    </div>
  );
}`}</CodeBlock>

      <H3>🟢 Production pattern — streamed RSC with optimized assets</H3>

      <CodeBlock filename="app/layout.tsx">{`// 🟢 zero-CLS font setup
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';

// 🟢 self-hosted at build time, with metric overrides that prevent layout shift
const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
});

export const metadata: Metadata = {
  metadataBase: new URL('https://techstore.com'),
  title: 'TechStore Enterprise',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="bn" className={inter.variable}>
      <body className="font-sans antialiased">{children}</body>
    </html>
  );
}`}</CodeBlock>

      <CodeBlock filename="app/products/[slug]/page.tsx">{`import { Suspense } from 'react';
import Image from 'next/image';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getProductBySlug, getRelatedProducts } from '@/lib/db/product';

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProductBySlug(slug);

  return {
    title: product?.name || 'Product details',
    description: product?.description,
  };
}

// a slower, non-critical section
async function RelatedProductsSection({ slug }: { slug: string }) {
  const related = await getRelatedProducts(slug);

  return (
    <div className="grid grid-cols-3 gap-4 mt-8">
      {related.map((item) => (
        <div key={item.id} className="p-4 border rounded">
          <p className="font-semibold">{item.name}</p>
        </div>
      ))}
    </div>
  );
}

export default async function ProductPage({ params }: PageProps) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);

  if (!product) notFound();

  return (
    <main className="max-w-4xl mx-auto p-8">
      <h1 className="text-4xl font-extrabold">{product.name}</h1>

      {/* 🟢 LCP: a priority image inside a fixed-height box */}
      <div className="relative w-full h-[400px] my-6">
        <Image
          src={product.imageUrl}
          alt={product.name}
          fill
          priority // preloads the LCP image
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          className="object-cover rounded-lg"
        />
      </div>

      <p className="text-xl text-gray-700">{product.description}</p>

      {/* 🟢 the slow query streams in behind a fixed-height fallback */}
      <Suspense
        fallback={<div className="h-40 bg-gray-100 animate-pulse my-8 rounded" />}
      >
        <RelatedProductsSection slug={slug} />
      </Suspense>
    </main>
  );
}`}</CodeBlock>

      {/* ── Matrix ────────────────────────────────────────────────────── */}
      <H2 id="matrix">৪. Rendering Strategy SEO Matrix</H2>

      <Table
        head={["রেন্ডারিং টাইপ", "TTFB", "LCP", "Client JS", "Crawler readability"]}
        rows={[
          [
            "Client CSR (useEffect)",
            "ধীর 🔴",
            "খারাপ (> ৪s) 🔴",
            "ভারী 🔴",
            "দুর্বল / অসম্পূর্ণ 🔴",
          ],
          [
            "SSG / SSR",
            "মাঝারি থেকে দ্রুত 🟡",
            "ভালো (১-২s) 🟢",
            "মাঝারি 🟡",
            "সম্পূর্ণ 🟢",
          ],
          [
            "RSC + streaming",
            "ইনস্ট্যান্ট 🟢",
            "সর্বোত্তম (< ১.২s) 🟢",
            "জিরো বান্ডল 🟢",
            "নিখুঁত 🟢",
          ],
        ]}
      />

      <Line name="ভুলু ভাই">
        অসাম ফাহিম! <code>priority</code> ইমেজ, <code>next/font</code> আর{" "}
        <code>&lt;Suspense&gt;</code> স্ট্রিমিংয়ের পর মোবাইল পারফরম্যান্স স্কোর ৪২ থেকে ৯৮-এ উঠে গেছে —
        LCP ১.১ সেকেন্ড, CLS প্রায় জিরো।
      </Line>

      <Line name="ফাহিম">
        অভিনন্দন ভুলু ভাই! এর মাধ্যমে SEO ও মেটাডেটা আর্কিটেকচারের অধ্যায়টি সফলভাবে শেষ হলো — আপনার
        প্ল্যাটফর্ম এখন সার্চ ইঞ্জিনে প্রতিদ্বন্দ্বিতা করার জন্য প্রস্তুত।
      </Line>

      {/* ── Takeaways ─────────────────────────────────────────────────── */}
      <H2 id="takeaway">Production Takeaways</H2>

      <Note>
        <ul>
          <li>
            <strong>Use priority for above-the-fold images:</strong> হিরো বা প্রোডাক্ট ব্যানারে{" "}
            <code>priority</code> দিলে Next.js preload ট্যাগ ইনজেক্ট করে LCP কমিয়ে দেয়।
          </li>
          <li>
            <strong>Eliminate layout shift with next/font:</strong> ফন্ট সেলফ-হোস্ট ও metric override
            হওয়ায় CLS প্রায় শূন্যে নামে।
          </li>
          <li>
            <strong>Isolate slow logic with Suspense:</strong> স্লো ডেটা ফেচিং আলাদা করে{" "}
            <code>&lt;Suspense&gt;</code>-এ রাখুন, যেন ব্রাউজার ও ক্রলার ইনস্ট্যান্ট মেটাডেটা ও প্রাথমিক
            HTML পেয়ে যায়।
          </li>
        </ul>
      </Note>
    </article>
  );
}
