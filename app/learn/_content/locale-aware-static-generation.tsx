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
      bn: "৩,০০০ পেজ প্রতি রিকোয়েস্টে রেন্ডার",
      en: "3,000 pages rendered per request",
    },
  },
  {
    id: "architecture",
    label: {
      bn: "Locale-aware SSG/ISR পাইপলাইন",
      en: "Locale-aware SSG/ISR pipeline",
    },
  },
  {
    id: "mechanisms",
    label: { bn: "৩টি আর্কিটেকচারাল কনসেপ্ট", en: "Three architectural concepts" },
  },
  {
    id: "implementation",
    label: {
      bn: "generateStaticParams ও ISR",
      en: "generateStaticParams & ISR",
    },
  },
  {
    id: "matrix",
    label: {
      bn: "Static Generation Comparison",
      en: "Static generation comparison",
    },
  },
  {
    id: "takeaway",
    label: { bn: "Production Takeaways", en: "Production takeaways" },
  },
];

export default function LocaleAwareStaticGeneration() {
  return (
    <article className="doc-prose">
      {/* ── The problem ───────────────────────────────────────────────── */}
      <H2 id="the-problem" anchorOnly>
        ৩,০০০ পেজ প্রতি রিকোয়েস্টে রেন্ডার
      </H2>

      <p>
        রাত ৮:১৫। ভুলু ভাই তার গ্লোবাল ই-কমার্স পোর্টালে ১,০০০টি প্রোডাক্ট ৩টি ভাষায় রেন্ডার করতে
        গেছেন! কিন্তু ইউজার পেজে ঢুকলেই সার্ভার রেসপন্স টাইম (TTFB) ২ সেকেন্ড ছাড়িয়ে যাচ্ছে — কারণ
        প্রতি রিকোয়েস্টে সার্ভার ডাটাবেজ থেকে ডাটা তুলে অন-দ্য-ফ্লাই ৩টি ভাষার জন্য রেন্ডার করছে।
        এমনকি <code>next build</code> দেওয়ার পরও ড্যাশবোর্ডে দেখাচ্ছে সব পেজ ডাইনামিক!
      </p>

      <Line name="ভুলু ভাই">
        ফাহিম! আমার সাইটে তো ৩টি ভাষা — <code>en</code>, <code>bn</code>, <code>de</code>! ১,০০০
        প্রোডাক্টের ৩,০০০টি পেজ কি প্রতি রিকোয়েস্টে অন-দ্য-ফ্লাই রেন্ডার হবে? এতে সার্ভারের বিল আর CPU
        লোড তো আকাশচুম্বী হয়ে যাচ্ছে! বিল্ড টাইমে কি সব ভাষার পেজ স্ট্যাটিক্যালি জেনারেট করা সম্ভব না?
      </Line>

      <Line name="ফাহিম">
        ভুলু ভাই! App Router-এ <code>[locale]</code> একটি ডাইনামিক রুট সেগমেন্ট। তাই বাই-ডিফল্ট Next.js
        একে অন-ডিমান্ড সার্ভার-রেন্ডারড পেজ হিসেবে ধরে নেয়! মাল্টি-ল্যাঙ্গুয়েজ সাইটের স্পিড রকেট গতি
        করার গোপন অস্ত্র হলো locale-aware static generation —{" "}
        <code>generateStaticParams()</code>।
      </Line>

      <Line name="নেক্সট-ভাই">
        একদম! <code>app/[locale]/layout.tsx</code> এবং{" "}
        <code>app/[locale]/products/[slug]/page.tsx</code>-এ <code>generateStaticParams()</code>{" "}
        বসালে Next.js বিল্ড টাইমে সব সাপোর্টেড লোকেল এবং তাদের প্রোডাক্ট স্লাগের জন্য খাঁটি HTML তৈরি
        করে এজ CDN-এ ক্যাশ করে রাখবে!
      </Line>

      {/* ── Architecture ──────────────────────────────────────────────── */}
      <H2 id="architecture">১. Locale-Aware Static Generation Pipeline</H2>

      <Diagram>{`┌─────────────────────────────────────────────────────────────────────────────┐
│             LOCALE-AWARE STATIC GENERATION (SSG/ISR) ENGINE                 │
└─────────────────────────────────────────────────────────────────────────────┘

 Build time: generateStaticParams()
                                │
 ┌──────────────────────────────┼──────────────────────────────┐
 ▼                              ▼                              ▼
 locale: 'en'                   locale: 'bn'                   locale: 'de'
 slug:   'running-shoes'        slug:   'রানিং-জুতো'            slug:   'laufschuhe'
 │                              │                              │
 ▼                              ▼                              ▼
 /en/products/…  .html          /bn/products/…  .html          /de/products/…  .html
                                │
                                ▼
                 pushed to the edge CDN (global)
                                │
 Incoming request ──────────────┴───────────────► 🟢 zero-latency HTML response`}</Diagram>

      {/* ── Mechanisms ────────────────────────────────────────────────── */}
      <H2 id="mechanisms">২. কোর আর্কিটেকচারাল কনসেপ্ট</H2>

      <p>
        <strong>Global segment pre-rendering:</strong> <code>app/[locale]/layout.tsx</code>-এ{" "}
        <code>generateStaticParams</code> ডিফাইন করলে অ্যাপ্লিকেশনের সব সাপোর্টেড ল্যাঙ্গুয়েজের রুট
        বিল্ড ইঞ্জিনের কাছে আগেই চলে যায়, ফলে রুট সেগমেন্ট স্ট্যাটিক হিসেবে মার্ক হয়।
      </p>

      <p>
        <strong>Nested dynamic parameter matrix:</strong> নেস্টেড রুট (
        <code>app/[locale]/products/[slug]</code>)-এ লোকেল এবং প্রোডাক্ট স্লাগের ম্যাট্রিক্স রিটার্ন
        করতে হয়, যা বিল্ড টাইমে প্রতিটি ভাষার আলাদা HTML ফাইল আউটপুট দেয়।
      </p>

      <p>
        <strong>Hybrid ISR strategy:</strong> লাখ লাখ পেজ থাকলে সবগুলো বিল্ড টাইমে জেনারেট না করে
        পপুলার ২০% প্রোডাক্ট বিল্ড টাইমে বানিয়ে বাকি ৮০%-এর জন্য <code>dynamicParams = true</code>{" "}
        এবং <code>revalidate</code> ব্যবহার করা সর্বোত্তম আর্কিটেকচার।
      </p>

      {/* ── Implementation ────────────────────────────────────────────── */}
      <H2 id="implementation">৩. Production Code Implementation</H2>

      <H3>❌ Anti-pattern — no generateStaticParams, forced dynamic SSR</H3>

      <CodeBlock filename="app/[locale]/products/[slug]/page.tsx">{`// 🔴 POOR PRACTICE: a dynamic segment with no generateStaticParams
// every request pays for a DB query and a full render

export default async function BadProductPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;

  // ❌ hits the database on every single user request, in every language
  const product = await fetchProductFromDB(slug, locale);

  return <div>{product.name}</div>;
}`}</CodeBlock>

      <H3>🟢 Production pattern — locale-aware SSG with ISR</H3>

      <p>
        <strong>Step 1 — root layout-এ static params।</strong>
      </p>

      <CodeBlock filename="app/[locale]/layout.tsx">{`// 🟢 PRODUCTION PATTERN: pre-render every supported locale
import { i18n } from '@/lib/i18n/config';

// 🟢 tells the build engine which locale paths exist
export async function generateStaticParams() {
  return i18n.locales.map((locale) => ({ locale }));
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  return (
    <html lang={locale}>
      <body>{children}</body>
    </html>
  );
}`}</CodeBlock>

      <p>
        <strong>Step 2 — নেস্টেড পেজের pre-render ম্যাট্রিক্স।</strong>
      </p>

      <CodeBlock filename="app/[locale]/products/[slug]/page.tsx">{`// 🟢 PRODUCTION PATTERN: multi-locale nested pre-rendering with ISR
import { notFound } from 'next/navigation';
import { i18n } from '@/lib/i18n/config';

// 🟢 incremental static regeneration — refresh static pages hourly
export const revalidate = 3600;

// 🟢 allow on-demand static generation for products not built at build time
export const dynamicParams = true;

// pre-render the top products across every supported locale
export async function generateStaticParams() {
  // mock DB call: fetch the featured products with their localized slugs
  const topProducts = [
    { slugs: { en: 'running-shoes', bn: 'রানিং-জুতো', de: 'laufschuhe' } },
  ];

  const params: Array<{ locale: string; slug: string }> = [];

  topProducts.forEach((product) => {
    i18n.locales.forEach((locale) => {
      params.push({
        locale,
        slug: product.slugs[locale as keyof typeof product.slugs] || product.slugs.en,
      });
    });
  });

  // returns:
  // [
  //   { locale: 'en', slug: 'running-shoes' },
  //   { locale: 'bn', slug: 'রানিং-জুতো' },
  //   { locale: 'de', slug: 'laufschuhe' },
  // ]
  return params;
}

interface PageProps {
  params: Promise<{ locale: string; slug: string }>;
}

export default async function LocalizedProductPage({ params }: PageProps) {
  const { locale, slug } = await params;

  // 🟢 served straight from the edge CDN when the static HTML exists
  const product = await getProductData(decodeURIComponent(slug), locale);

  if (!product) notFound();

  return (
    <main className="p-8 max-w-2xl mx-auto">
      <h1 className="text-3xl font-bold">{product.title}</h1>
      <p className="mt-2 text-green-600">{product.price}</p>
    </main>
  );
}

async function getProductData(slug: string, locale: string) {
  return {
    title: locale === 'bn' ? 'প্রিমিয়াম শু' : 'Premium Shoes',
    price: '$120',
  };
}`}</CodeBlock>

      {/* ── Matrix ────────────────────────────────────────────────────── */}
      <H2 id="matrix">৪. Static Generation Strategy Comparison</H2>

      <Table
        head={[
          "বৈশিষ্ট্য",
          "On-demand SSR (no static params)",
          "Full SSG (build everything)",
          "Hybrid SSG + ISR",
        ]}
        rows={[
          [
            "TTFB / latency",
            "ধীর (~৫০০ms – ২s) 🔴",
            "ইনস্ট্যান্ট edge CDN (১০–৩০ms) 🟢",
            "ইনস্ট্যান্ট edge CDN (১০–৩০ms) 🟢",
          ],
          [
            "Build time",
            "দ্রুততম (০ সেকেন্ড) 🟢",
            "অত্যন্ত ধীর — ঘণ্টাও লাগতে পারে 🔴",
            "ভারসাম্যপূর্ণ ও দ্রুত 🟢",
          ],
          [
            "Server cost",
            "চড়া — প্রতি রিকোয়েস্টে CPU 🔴",
            "সর্বনিম্ন 🟢",
            "সর্বনিম্ন 🟢",
          ],
          [
            "New content updates",
            "তাৎক্ষণিক 🟢",
            "রি-বিল্ড ছাড়া অসম্ভব 🔴",
            "ISR দিয়ে ব্যাকগ্রাউন্ড আপডেট 🟢",
          ],
        ]}
      />

      <Line name="ভুলু ভাই">
        দুর্দান্ত ফাহিম! <code>generateStaticParams</code> আর ISR সেট করার পর বিল্ড টাইমে সব ভাষার
        প্রোডাক্ট পেজ স্ট্যাটিক্যালি রেন্ডার হয়ে গেছে! এখন পেজ লোড টাইম সোজা ২ সেকেন্ড থেকে ১০
        মিলিসেকেন্ডে নেমে এসেছে।
      </Line>

      {/* ── Takeaways ─────────────────────────────────────────────────── */}
      <H2 id="takeaway">Production Takeaways</H2>

      <Note>
        <ul>
          <li>
            <strong>Prerender the primary locales:</strong> রুট লেআউটে সবসময়{" "}
            <code>generateStaticParams()</code> লিখুন, যাতে Next.js নিশ্চিত হতে পারে কোন কোন লোকেল রুট
            স্থায়ী।
          </li>
          <li>
            <strong>Use hybrid ISR for massive catalogs:</strong> ১০,০০০ প্রোডাক্ট থাকলে বিল্ড টাইমে
            শুধু সেরা ১০০টির সব ভাষার পেজ বানান — বাকিগুলো ইউজার প্রথমবার হিট করলে অন-দ্য-ফ্লাই তৈরি
            হয়ে এজে স্ট্যাটিকভাবে সেভ হয়ে যাবে।
          </li>
          <li>
            <strong>Set dynamicParams = true:</strong> নতুন প্রোডাক্ট অ্যাড হলে যেন ৪০৪ না দিয়ে প্রথম
            রিকোয়েস্টেই অন-ডিমান্ড স্ট্যাটিক পেজ তৈরি করে নেয়।
          </li>
        </ul>
      </Note>
    </article>
  );
}
