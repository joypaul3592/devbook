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
    label: { bn: "৪০ মিনিটের বিল্ড, তাও ফেইল", en: "A 40-minute build that still fails" },
  },
  {
    id: "architecture",
    label: { bn: "স্কেলেবল SEO পাইপলাইন", en: "The scalable SEO pipeline" },
  },
  {
    id: "mechanisms",
    label: { bn: "৩টি আর্কিটেকচারাল কনসেপ্ট", en: "Three architectural concepts" },
  },
  {
    id: "implementation",
    label: { bn: "ISR, chunking ও tag purge", en: "ISR, chunking & tag purge" },
  },
  {
    id: "matrix",
    label: { bn: "Architecture Pattern Comparison", en: "Architecture pattern comparison" },
  },
  {
    id: "takeaway",
    label: { bn: "Production Takeaways", en: "Production takeaways" },
  },
];

export default function DynamicSeoArchitectureAtScale() {
  return (
    <article className="doc-prose">
      {/* ── The problem ───────────────────────────────────────────────── */}
      <H2 id="the-problem" anchorOnly>
        ৪০ মিনিটের বিল্ড, তাও ফেইল
      </H2>

      <p>
        রাত ১:৪৫। প্ল্যাটফর্মে প্রোডাক্টের সংখ্যা এখন ১,৫০,০০০। বিল্ড দিতে গেলে ৪০ মিনিট লাগছে এবং
        মেমরি আউট হয়ে ফেইল করছে; অন্যদিকে নতুন প্রোডাক্ট যোগ করার এক ঘণ্টা পরেও সাইটম্যাপে পুরনো ক্যাশড
        ডেটা থেকে যাচ্ছে।
      </p>

      <Line name="ভুলু ভাই">
        ফাহিম! সাইট ছোট থাকতে ডাইনামিক SEO মসৃণ ছিল, কিন্তু এখন দেড় লাখ পেজের জন্য বিল্ড দিতে গেলে
        সার্ভার ডাউন হয়ে যাচ্ছে! আবার সব পেজ SSR করলে ডাটাবেজ ক্র্যাশ করছে। স্কেলে SEO কীভাবে
        আর্কিটেক্ট করব?
      </Line>

      <Line name="ফাহিম">
        ভুলু ভাই! লাখ লাখ পেজে সব বিল্ড টাইমে জেনারেট করা বা সব রিকোয়েস্টে SSR করা — দুটিই ভুল। বড়
        স্কেলের চাবিকাঠি হলো ISR, dynamic sitemap chunking, আর on-demand revalidation-এর কম্বিনেশন।
      </Line>

      <Line name="নেক্সট-ভাই">
        একদম! সবচেয়ে পপুলার পেজগুলো বিল্ড টাইমে স্ট্যাটিক করব, বাকিগুলো প্রথম রিকোয়েস্টে জেনারেট হয়ে
        ক্যাশ হবে, আর ডাটাবেজে আপডেট হলে webhook দিয়ে <code>revalidateTag()</code> চালিয়ে সেই পেজটুকুই
        ফ্রেশ করে দেব।
      </Line>

      {/* ── Architecture ──────────────────────────────────────────────── */}
      <H2 id="architecture">১. Enterprise-Scale Dynamic SEO Pipeline</H2>

      <Diagram>{`┌─────────────────────────────────────────────────────────────────────────┐
│                 ENTERPRISE SCALE DYNAMIC SEO PIPELINE                   │
└─────────────────────────────────────────────────────────────────────────┘

 top ~1,000 high-traffic pages ──► pre-rendered at build time (static HTML)
                                                │
 the remaining ~149,000 pages  ──► on-demand ISR (built on first hit, then cached)
                                                │
                                                ▼
 CMS / DB update event ──────────► webhook triggers revalidateTag('product-<slug>')
                                                │
                                                ▼
 the cached entry is invalidated ──► the crawler gets a fresh SEO head immediately
                                                │
                                                ▼
 large sitemaps ─────────────────► chunked into /sitemap/0.xml, /sitemap/1.xml, …`}</Diagram>

      {/* ── Mechanisms ────────────────────────────────────────────────── */}
      <H2 id="mechanisms">২. কোর আর্কিটেকচারাল কনসেপ্ট</H2>

      <p>
        <strong>Incremental Static Regeneration:</strong> বিল্ড টাইমে লাখ লাখ পেজ না বানিয়ে প্রথম
        রিকোয়েস্টে HTML ও মেটাডেটা জেনারেট করে ক্যাশ করা হয় — পরের ইউজাররা পুরোপুরি স্ট্যাটিক স্পিড পান।
      </p>

      <p>
        <strong>Dynamic sitemap chunking:</strong> একটি সাইটম্যাপে সর্বোচ্চ ৫০,০০০ URL রাখার নিয়ম আছে;{" "}
        <code>generateSitemaps</code> দিয়ে সাইটম্যাপ ছোট ছোট খণ্ডে ভাগ করা হয়।
      </p>

      <p>
        <strong>On-demand revalidation via tags:</strong> নির্দিষ্ট সময় পরপর revalidate করার বদলে
        ডাটাবেজ CRUD অপারেশনের সময় <code>revalidateTag()</code> বা <code>revalidatePath()</code>{" "}
        ট্রিগার করা হয়।
      </p>

      {/* ── Implementation ────────────────────────────────────────────── */}
      <H2 id="implementation">৩. Production Code Implementation</H2>

      <H3>❌ Anti-pattern — pre-rendering every page at build time</H3>

      <CodeBlock filename="app/products/[slug]/legacy-params.ts">{`// 🔴 POOR PRACTICE: pre-rendering hundreds of thousands of pages at build time

export async function generateStaticParams() {
  const allProducts = await fetchAll150kProductsFromDB();
  // ❌ out-of-memory errors and hour-long builds
  return allProducts.map((p) => ({ slug: p.slug }));
}`}</CodeBlock>

      <H3>🟢 Production pattern — chunked sitemaps plus hybrid ISR</H3>

      <CodeBlock filename="app/sitemap/[id]/sitemap.ts">{`import type { MetadataRoute } from 'next';
import { getProductCount, getProductsPaginated } from '@/lib/db/products';

const ITEMS_PER_SITEMAP = 40000; // comfortably under Google's 50,000 limit

// 🟢 produces the sitemap ids: [{ id: 0 }, { id: 1 }, ...]
export async function generateSitemaps() {
  const totalProducts = await getProductCount();
  const numberOfSitemaps = Math.ceil(totalProducts / ITEMS_PER_SITEMAP);

  return Array.from({ length: numberOfSitemaps }, (_, index) => ({ id: index }));
}

export default async function sitemap({
  id,
}: {
  id: number;
}): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://techstore.com';

  // fetch only this chunk's slice of products
  const products = await getProductsPaginated(
    id * ITEMS_PER_SITEMAP,
    ITEMS_PER_SITEMAP,
  );

  return products.map((product) => ({
    url: \`\${baseUrl}/products/\${product.slug}\`,
    lastModified: new Date(product.updatedAt),
    changeFrequency: 'weekly',
    priority: 0.8,
  }));
}`}</CodeBlock>

      <CodeBlock filename="app/products/[slug]/page.tsx">{`import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getTop1000ProductSlugs } from '@/lib/db/products';

interface PageProps {
  params: Promise<{ slug: string }>;
}

// 🟢 pre-render ONLY the top ~1,000 SEO-critical pages
export async function generateStaticParams() {
  const topSlugs = await getTop1000ProductSlugs();
  return topSlugs.map((slug) => ({ slug }));
}

// 🟢 everything else renders on first request and is then cached (ISR)
export const dynamicParams = true;

async function fetchScalableProduct(slug: string) {
  const res = await fetch(\`https://api.techstore.com/products/\${slug}\`, {
    next: {
      tags: [\`product-\${slug}\`, 'products-global'], // cache tags for instant purge
      revalidate: 86400, // a 24-hour safety net
    },
  });
  if (!res.ok) return null;
  return res.json();
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const product = await fetchScalableProduct(slug);

  if (!product) return { title: 'Product not found' };

  return {
    title: product.name,
    description: product.description,
    alternates: { canonical: \`/products/\${slug}\` },
  };
}

export default async function ProductPage({ params }: PageProps) {
  const { slug } = await params;
  const product = await fetchScalableProduct(slug);

  if (!product) notFound();

  return (
    <main className="p-8">
      <h1 className="text-3xl font-bold">{product.name}</h1>
      <p className="text-lg text-gray-600">\${product.price}</p>
    </main>
  );
}`}</CodeBlock>

      <CodeBlock filename="app/api/revalidate/route.ts">{`// 🟢 an on-demand webhook handler for CMS/DB updates
import { NextRequest, NextResponse } from 'next/server';
import { revalidateTag } from 'next/cache';

export async function POST(request: NextRequest) {
  const secret = request.nextUrl.searchParams.get('secret');

  // validate the caller first
  if (secret !== process.env.MY_REVALIDATE_SECRET) {
    return NextResponse.json({ message: 'Invalid token' }, { status: 401 });
  }

  const { slug } = await request.json();

  if (!slug) {
    return NextResponse.json({ message: 'Missing slug' }, { status: 400 });
  }

  // 🟢 instantly invalidates both the page content and its metadata
  revalidateTag(\`product-\${slug}\`);

  return NextResponse.json({ revalidated: true, now: Date.now() });
}`}</CodeBlock>

      {/* ── Matrix ────────────────────────────────────────────────────── */}
      <H2 id="matrix">৪. Enterprise SEO Architecture Patterns</H2>

      <Table
        head={["স্ট্র্যাটেজি", "বিল্ড স্পিড", "TTFB", "ডাটাবেজ প্রেশার"]}
        rows={[
          [
            "Full static pre-rendering",
            "অত্যন্ত ধীর, বিল্ড ক্র্যাশ করে 🔴",
            "অতি দ্রুত (static HTML) 🟢",
            "বিল্ডের সময় বিশাল স্পাইক 🔴",
          ],
          [
            "Pure dynamic SSR",
            "দ্রুততম বিল্ড 🟢",
            "ধীর (প্রতি রিকোয়েস্টে ফেচ) 🔴",
            "সার্বক্ষণিক স্ট্রেইন 🔴",
          ],
          [
            "Hybrid ISR + tag purge",
            "দ্রুত (শুধু top pages) 🟢",
            "স্ট্যাটিক স্পিড 🟢",
            "ক্যাশের কারণে সর্বনিম্ন হিট 🟢",
          ],
        ]}
      />

      <Line name="ভুলু ভাই">
        ব্রিলিয়ান্ট ফাহিম! টপ ১,০০০ পেজ বিল্ডে রেখে বাকি সব on-demand ISR আর{" "}
        <code>generateSitemaps</code> চাঙ্কিং ব্যবহারের ফলে বিল্ড টাইম ৪০ মিনিট থেকে নেমে ৩০ সেকেন্ডে
        চলে এসেছে।
      </Line>

      {/* ── Takeaways ─────────────────────────────────────────────────── */}
      <H2 id="takeaway">Production Takeaways</H2>

      <Note>
        <ul>
          <li>
            <strong>Limit generateStaticParams to the top tier:</strong> সব পেজ বিল্ডে রেন্ডার করার ভুল
            করবেন না — টপ পেজগুলো বিল্ডে রাখুন, বাকিগুলো <code>dynamicParams</code> দিয়ে ISR-এ ফেলুন।
          </li>
          <li>
            <strong>Chunk sitemaps with generateSitemaps:</strong> প্রতি খণ্ডে ৪০-৫০ হাজারের নিচে URL
            রাখুন।
          </li>
          <li>
            <strong>Use tag-based invalidation:</strong> পেজ আপডেট হলে ফুল রি-বিল্ড না করে{" "}
            <code>revalidateTag()</code> দিয়ে ঠিক সেই পেজের কনটেন্ট ও মেটাডেটা রিফ্রেশ করুন।
          </li>
        </ul>
      </Note>
    </article>
  );
}
