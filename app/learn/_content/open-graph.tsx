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
    label: { bn: "ভাঙা প্রিভিউ কার্ড", en: "A broken preview card" },
  },
  {
    id: "architecture",
    label: { bn: "OG image generation পাইপলাইন", en: "The OG image pipeline" },
  },
  {
    id: "mechanisms",
    label: { bn: "৩টি আর্কিটেকচারাল কনসেপ্ট", en: "Three architectural concepts" },
  },
  {
    id: "implementation",
    label: { bn: "opengraph-image.tsx কনভেনশন", en: "The opengraph-image.tsx convention" },
  },
  {
    id: "matrix",
    label: { bn: "Generation Strategies", en: "Generation strategies" },
  },
  {
    id: "takeaway",
    label: { bn: "Production Takeaways", en: "Production takeaways" },
  },
];

export default function OpenGraph() {
  return (
    <article className="doc-prose">
      {/* ── The problem ───────────────────────────────────────────────── */}
      <H2 id="the-problem" anchorOnly>
        ভাঙা প্রিভিউ কার্ড
      </H2>

      <p>
        রাত ১০:৪৫। ভুলু ভাই একটি প্রিমিয়াম হেডফোনের লিংক লিংকডইন ও হোয়াটসঅ্যাপে পাঠালেন — কিন্তু
        প্রিভিউ কার্ডে কোনো ছবি নেই, শুধু ভাঙা আইকন আর স্ট্যাটিক সাইট লোগো।
      </p>

      <Line name="ভুলু ভাই">
        ফাহিম! সার্চ ইঞ্জিনে মেটাডেটা ঠিকই কাজ করছে, কিন্তু সোশ্যাল মিডিয়ায় শেয়ার করলে সুন্দর প্রোডাক্ট
        কার্ড বানায় না কেন? ডাটাবেজে ১০,০০০ প্রোডাক্ট — প্রতিটির জন্য ফটোশপে ১২০০×৬৩০ ছবি বানানো তো
        অসম্ভব!
      </Line>

      <Line name="ফাহিম">
        ভুলু ভাই! সোশ্যাল প্ল্যাটফর্মগুলো লিংক পার্স করার সময় Open Graph (OG) মেটা ট্যাগ খোঁজে। প্রতিটি
        ব্যানার ম্যানুয়ালি না বানিয়ে আমরা <code>next/og</code> ও Satori ইঞ্জিন দিয়ে dynamic OG image
        generation করব — যা রিয়েল-টাইমে JSX কোডকে PNG-তে রেন্ডার করে।
      </Line>

      <Line name="নেক্সট-ভাই">
        একদম! App Router-এর <code>opengraph-image.tsx</code> ফোল্ডার কনভেনশন ব্যবহার করলে আলাদা মেটা
        ট্যাগ URL হ্যান্ডেল করারও দরকার নেই — Edge runtime-এ কয়েক মিলিসেকেন্ডেই ব্র্যান্ডেড ব্যানার
        জেনারেট হয়ে যাবে।
      </Line>

      {/* ── Architecture ──────────────────────────────────────────────── */}
      <H2 id="architecture">১. Dynamic OG Image Generation Pipeline</H2>

      <Diagram>{`┌─────────────────────────────────────────────────────────────────────────┐
│                  DYNAMIC OG IMAGE ENGINE (EDGE RUNTIME)                 │
└─────────────────────────────────────────────────────────────────────────┘

 social crawler request (Facebook / WhatsApp / LinkedIn)
        │
        ▼
 reads: <meta property="og:image" content="/products/iphone/opengraph-image" />
        │
        ▼
 edge route: app/products/[slug]/opengraph-image.tsx
        │
        ├── 1. fetches the product data (title, price, image)
        ├── 2. renders a React JSX layout (flexbox subset)
        ├── 3. Satori converts the JSX ──► vector SVG
        └── 4. resvg converts the SVG ──► 1200x630 PNG
        │
        ▼
 returns an optimized preview card in well under a second 🟢`}</Diagram>

      {/* ── Mechanisms ────────────────────────────────────────────────── */}
      <H2 id="mechanisms">২. কোর আর্কিটেকচারাল কনসেপ্ট</H2>

      <p>
        <strong>Open Graph protocol structure:</strong> সোশ্যাল বটের জন্য{" "}
        <code>og:title</code>, <code>og:description</code>, <code>og:image</code> এবং{" "}
        <code>og:url</code> সেট করতে হয় — Next.js Metadata API-তে এগুলো <code>openGraph</code>{" "}
        অবজেক্টে লেখা যায়।
      </p>

      <p>
        <strong>ImageResponse &amp; the Satori engine:</strong> Satori HTML/CSS-এর একটি flexbox subset
        সমর্থন করে এবং JSX-কে SVG হয়ে PNG বাইনারিতে রূপান্তর করে — ভারী headless browser-এর তুলনায় বহু
        গুণ দ্রুত।
      </p>

      <p>
        <strong>Convention-based route segment:</strong> ডাইনামিক রুট ফোল্ডারে একটি{" "}
        <code>opengraph-image.tsx</code> রাখলে Next.js নিজেই ঐ রুটের <code>&lt;head&gt;</code>-এ সঠিক{" "}
        <code>og:image</code> ট্যাগ ইনজেক্ট করে দেয়।
      </p>

      {/* ── Implementation ────────────────────────────────────────────── */}
      <H2 id="implementation">৩. Production Code Implementation</H2>

      <H3>❌ Anti-pattern — one static logo for every page</H3>

      <CodeBlock filename="app/products/[slug]/legacy-metadata.ts">{`// 🔴 POOR PRACTICE: the same static logo for every dynamic product page
export const metadata = {
  openGraph: {
    title: 'My Store',
    // ❌ every shared link shows the company logo instead of the product
    images: ['https://mysite.com/static-logo.png'],
  },
};`}</CodeBlock>

      <H3>🟢 Production pattern — an edge-generated OG image</H3>

      <CodeBlock filename="app/products/[slug]/opengraph-image.tsx">{`import { ImageResponse } from 'next/og';
import { getProductBySlug } from '@/lib/db/product';

// 🟢 the edge runtime keeps generation latency very low
export const runtime = 'edge';

// image metadata, read by Next.js
export const alt = 'Product details banner';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default async function OgImage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);

  const title = product?.name || 'Product details';
  const price = product?.price ? \`$\${product.price}\` : '';
  const imageUrl = product?.imageUrl || 'https://techstore.com/fallback.png';

  return new ImageResponse(
    (
      // 🟢 a flexbox-only layout, which is what Satori supports
      <div
        style={{
          height: '100%',
          width: '100%',
          display: 'flex',
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
          backgroundColor: '#0f172a',
          padding: '60px',
          fontFamily: 'sans-serif',
        }}
      >
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            width: '60%',
          }}
        >
          <div
            style={{
              fontSize: 24,
              color: '#3b82f6',
              fontWeight: 700,
              marginBottom: 16,
              textTransform: 'uppercase',
              letterSpacing: '2px',
            }}
          >
            TechStore Exclusive
          </div>
          <div
            style={{
              fontSize: 52,
              fontWeight: 800,
              color: '#ffffff',
              lineHeight: 1.2,
              marginBottom: 24,
            }}
          >
            {title}
          </div>
          {price && (
            <div
              style={{
                fontSize: 36,
                fontWeight: 700,
                color: '#22c55e',
                backgroundColor: '#1e293b',
                padding: '12px 24px',
                borderRadius: '12px',
              }}
            >
              {price}
            </div>
          )}
        </div>

        <div
          style={{
            display: 'flex',
            width: '35%',
            height: '80%',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={imageUrl}
            alt={title}
            style={{ width: '100%', height: '100%', objectFit: 'contain' }}
          />
        </div>
      </div>
    ),
    { ...size },
  );
}`}</CodeBlock>

      <CodeBlock filename="app/products/[slug]/page.tsx">{`import type { Metadata } from 'next';
import { getProductBySlug } from '@/lib/db/product';

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProductBySlug(slug);

  return {
    title: product?.name,
    description: product?.description,
    openGraph: {
      title: \`\${product?.name} | TechStore\`,
      description: product?.description,
      url: \`https://techstore.com/products/\${slug}\`,
      siteName: 'TechStore Enterprise',
      locale: 'bn_BD',
      type: 'website',
      // 🟢 Next.js wires opengraph-image.tsx up automatically,
      // so listing openGraph.images by hand is optional here.
    },
  };
}

export default async function Page({ params }: PageProps) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);

  return (
    <main className="p-8">
      <h1 className="text-3xl font-bold">{product?.name}</h1>
    </main>
  );
}`}</CodeBlock>

      {/* ── Matrix ────────────────────────────────────────────────────── */}
      <H2 id="matrix">৪. OG Image Generation Strategies</H2>

      <Table
        head={["মেথড", "রেসপন্স টাইম", "কনফিগারেশন", "ডাইনামিক কন্ট্রোল"]}
        rows={[
          [
            "Static PNG file",
            "ইনস্ট্যান্ট 🟢",
            "১০,০০০ ইমেজ ম্যানুয়ালি বানানো অসম্ভব 🔴",
            "কোনো ডাইনামিক ডেটা নেই 🔴",
          ],
          [
            "Puppeteer / headless Chrome",
            "স্লো (২-৫ সেকেন্ড) 🔴",
            "সার্ভার সেটআপ ভারী 🔴",
            "ফুল CSS সাপোর্ট 🟢",
          ],
          [
            <span key="c">
              <code>ImageResponse</code> (Satori)
            </span>,
            "অতি দ্রুত (edge) 🟢",
            <span key="d">
              জিরো কনফিগ (<code>opengraph-image.tsx</code>) 🟢
            </span>,
            "পিক্সেল-পারফেক্ট ডাইনামিক JSX 🟢",
          ],
        ]}
      />

      <Line name="ভুলু ভাই">
        ওয়াও ফাহিম! <code>opengraph-image.tsx</code> কনভেনশন ব্যবহার করার সাথে সাথেই ফেসবুকে প্রোডাক্ট
        লিংক পোস্ট করলেই ছবি, টাইটেল ও প্রাইস সহ সুন্দর ব্যানার অটো-জেনারেট হয়ে যাচ্ছে।
      </Line>

      {/* ── Takeaways ─────────────────────────────────────────────────── */}
      <H2 id="takeaway">Production Takeaways</H2>

      <Note>
        <ul>
          <li>
            <strong>Stick to 1200×630:</strong> সোশ্যাল মিডিয়ায় ক্রপ না হয়ে পারফেক্ট দেখাতে ১.৯১:১
            অ্যাসপেক্ট রেশিও বজায় রাখুন।
          </li>
          <li>
            <strong>Use the edge runtime:</strong> <code>export const runtime = &apos;edge&apos;</code>{" "}
            দিলে ছবিটি কাছের এজ নোড থেকেই দ্রুত জেনারেট ও সার্ভ হয়।
          </li>
          <li>
            <strong>Stay inside Satori&apos;s CSS subset:</strong> Satori সব CSS সাপোর্ট করে না — কেবল
            flexbox লেআউট, padding, margin, border, color ও inline font ব্যবহার করুন (
            <code>display: grid</code> এড়িয়ে চলুন)।
          </li>
        </ul>
      </Note>
    </article>
  );
}
