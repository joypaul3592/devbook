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
      bn: "বাংলা পেজের ইংরেজি OG প্রিভিউ",
      en: "An English OG preview on a Bengali page",
    },
  },
  {
    id: "architecture",
    label: {
      bn: "Metadata ও slug রেজলিউশন ইঞ্জিন",
      en: "Metadata & slug resolution engine",
    },
  },
  {
    id: "mechanisms",
    label: { bn: "৩টি আর্কিটেকচারাল কনসেপ্ট", en: "Three architectural concepts" },
  },
  {
    id: "implementation",
    label: {
      bn: "generateMetadata ও localized slug",
      en: "generateMetadata & localized slugs",
    },
  },
  {
    id: "matrix",
    label: {
      bn: "Localized Metadata Comparison",
      en: "Localized metadata comparison",
    },
  },
  {
    id: "takeaway",
    label: { bn: "Production Takeaways", en: "Production takeaways" },
  },
];

export default function LocalizedMetadataUrls() {
  return (
    <article className="doc-prose">
      {/* ── The problem ───────────────────────────────────────────────── */}
      <H2 id="the-problem" anchorOnly>
        বাংলা পেজের ইংরেজি OG প্রিভিউ
      </H2>

      <p>
        রাত ৫:১৫। ভুলু ভাই ফেইসবুকে তার ওয়েবসাইটের একটি প্রোডাক্টের বাংলা পেজের লিংক (
        <code>/bn/products/shoes</code>) শেয়ার করে দেখেন — Open Graph প্রিভিউতে এখনও ইংরেজিতে শিরোনাম
        ও বিবরণ দেখাচ্ছে! শেয়ার করা কার্ডে লোকেল দেখাচ্ছে <code>en_US</code>। অন্যদিকে জার্মান ইউজাররা
        চাচ্ছে URL স্লাগটাও যেন জার্মান ভাষায় অনুবাদিত হয় — যেমন{" "}
        <code>/de/produkte/laufschuhe</code>।
      </p>

      <Line name="ভুলু ভাই">
        ফাহিম! আমার URL-এ <code>/bn/</code> বা <code>/de/</code> যোগ হলেও ফেসবুক/হোয়াটসঅ্যাপে সোশ্যাল
        প্রিভিউতে তো ইংরেজি মেটাডেটা দেখায়! আর <code>/bn/products/shoes</code>-এর বদলে আমি যদি
        পুরোপুরি বাংলায় স্লাগ ম্যাপিং করতে চাই, তবে SEO আর OpenGraph ট্যাগে কীভাবে লোকাল-স্পেসিফিক
        ডিটেইলস পাস করব?
      </Line>

      <Line name="ফাহিম">
        ভুলু ভাই! স্রেফ URL-এ লোকাল প্রিফিক্স যোগ করলেই লোকালাইজড SEO সম্পন্ন হয় না। প্রতিটি ভাষার
        জন্য পৃথক localized meta title, description, Open Graph locale (যেমন <code>bn_BD</code>,{" "}
        <code>de_DE</code>) এবং localized URL slug ডাইনামিকভাবে রেন্ডার করা জরুরি!
      </Line>

      <Line name="নেক্সট-ভাই">
        একদম! App Router-এর <code>generateMetadata</code> ফাংশনে <code>locale</code> প্যারামিটার পার্স
        করে ডাটাবেজ থেকে লোকাল-স্পেসিফিক SEO ডাটা তুলে আনতে হবে। আর{" "}
        <code>alternates.languages</code>-এ প্রতিটি ভাষার নিজস্ব অনুবাদকৃত স্লাগ লিংক করে দিলে গুগল ও
        সোশ্যাল বট নিখুঁত প্রিভিউ ও ইনডেক্সিং রেন্ডার করবে।
      </Line>

      {/* ── Architecture ──────────────────────────────────────────────── */}
      <H2 id="architecture">১. Localized Metadata &amp; Slug Mapping Architecture</H2>

      <Diagram>{`┌─────────────────────────────────────────────────────────────────────────────┐
│                 LOCALIZED METADATA & SLUG RESOLUTION ENGINE                 │
└─────────────────────────────────────────────────────────────────────────────┘

 Crawler / social bot: GET /bn/products/রানিং-জুতো
                                │
                                ▼
 app/[locale]/products/[slug]/page.tsx
                                │
                                ▼
 runs generateMetadata({ params })
                                │
                                ├── resolves the product via localized slug mapping (bn ──► product id)
                                ├── maps the OG locale: bn ──► bn_BD
                                └── fetches alternate slugs: { en: 'running-shoes', bn: 'রানিং-জুতো' }
                                │
                                ▼
 Emits localized head tags:
 ├── <title>রানিং শু — প্রিমিয়াম কালেকশন</title>
 ├── <meta property="og:locale" content="bn_BD" />
 └── <link rel="alternate" hreflang="en" href="https://site.com/en/products/running-shoes" />`}</Diagram>

      {/* ── Mechanisms ────────────────────────────────────────────────── */}
      <H2 id="mechanisms">২. কোর আর্কিটেকচারাল কনসেপ্ট</H2>

      <p>
        <strong>Locale-specific OpenGraph mapping:</strong> OpenGraph প্রোটোকলে ভাষা কেবল{" "}
        <code>en</code> বা <code>bn</code> হিসেবে থাকে না, বরং কান্ট্রি কোডসহ ফরম্যাট হয় (
        <code>en_US</code>, <code>bn_BD</code>, <code>ar_SA</code>, <code>de_DE</code>)। সঠিক সোশ্যাল
        কার্ড ডিসপ্লের জন্য এটি ডাইনামিকভাবে ম্যাপ করতে হয়।
      </p>

      <p>
        <strong>Localized slugs &amp; URL encoding:</strong> URL স্লাগ কেবল ইংরেজিতে না রেখে স্থানীয়
        ভাষায় রূপান্তর করলে লোকাল সার্চ রেজাল্টে CTR অনেক বেড়ে যায়। বাংলা বা নন-ল্যাটিন ক্যারেক্টার
        URL-এ পাঠানোর আগে <code>encodeURIComponent</code> দিয়ে নিরাপদ করা প্রয়োজন।
      </p>

      <p>
        <strong>Multi-slug reciprocal hreflang:</strong> ইংরেজি স্লাগ <code>running-shoes</code> আর
        বাংলা স্লাগ <code>রানিং-জুতো</code> হলে hreflang লিংকে দুটো ভিন্ন স্লাগসহ পূর্ণাঙ্গ URL ডিফাইন
        করতে হবে, যাতে গুগল দুটোকে একই কনটেন্টের দ্বিমুখী অনুবাদ হিসেবে চেনে।
      </p>

      {/* ── Implementation ────────────────────────────────────────────── */}
      <H2 id="implementation">৩. Production Code Implementation</H2>

      <H3>❌ Anti-pattern — hardcoded OG locale and static slugs</H3>

      <CodeBlock filename="app/[locale]/products/[slug]/page.tsx">{`// 🔴 POOR PRACTICE: hardcoded metadata that ignores localized slugs
export async function generateMetadata() {
  return {
    title: 'Buy Running Shoes Online', // ❌ one static English title for every locale
    openGraph: {
      locale: 'en_US', // ❌ always English — social previews break in BN/DE
    },
    alternates: {
      // ❌ reuses the English slug inside the Bengali hreflang URL
      languages: {
        bn: 'https://site.com/bn/products/running-shoes',
      },
    },
  };
}`}</CodeBlock>

      <H3>🟢 Production pattern — localized metadata with a slug engine</H3>

      <p>
        <strong>Step 1 — OG locale ম্যাপিং ডিকশনারি।</strong>
      </p>

      <CodeBlock filename="lib/i18n/og-locales.ts">{`// 🟢 PRODUCTION PATTERN: standardized OpenGraph locale mapper
export const ogLocaleMap: Record<string, string> = {
  en: 'en_US',
  bn: 'bn_BD',
  de: 'de_DE',
  ar: 'ar_SA',
};

export function getOgLocale(locale: string): string {
  return ogLocaleMap[locale] || 'en_US';
}`}</CodeBlock>

      <p>
        <strong>Step 2 — লোকালাইজড ডাটাবেজ রিজলভার।</strong>
      </p>

      <CodeBlock filename="lib/db/product-slugs.ts">{`// fetches localized content plus the cross-language slug table
export async function getLocalizedProductBySlug(slug: string, locale: string) {
  // simulating a DB lookup
  return {
    id: 'prod_101',
    title: locale === 'bn' ? 'প্রিমিয়াম রানিং শু' : 'Premium Running Shoes',
    description:
      locale === 'bn'
        ? 'সেরা মানের আরামদায়ক রানিং জুতো'
        : 'Best quality comfortable running shoes',
    currentSlug: slug,
    // cross-language slug translations used for hreflang links
    alternateSlugs: {
      en: 'running-shoes',
      bn: 'রানিং-জুতো',
      de: 'laufschuhe',
    },
  };
}`}</CodeBlock>

      <p>
        <strong>Step 3 — ডাইনামিক লোকালাইজড মেটাডেটা।</strong>
      </p>

      <CodeBlock filename="app/[locale]/products/[slug]/page.tsx">{`// 🟢 dynamic localized metadata engine
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getLocalizedProductBySlug } from '@/lib/db/product-slugs';
import { getOgLocale } from '@/lib/i18n/og-locales';
import type { Locale } from '@/lib/i18n/config';

interface PageProps {
  params: Promise<{ locale: Locale; slug: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale, slug } = await params;

  // safe decode for unicode slugs (e.g. Bengali characters in the URL)
  const decodedSlug = decodeURIComponent(slug);
  const product = await getLocalizedProductBySlug(decodedSlug, locale);

  if (!product) return {};

  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://techstore.com';
  const ogLocale = getOgLocale(locale);

  // build the hreflang map from the translated slugs
  const languageAlternates: Record<string, string> = {};

  Object.entries(product.alternateSlugs).forEach(([lang, altSlug]) => {
    // 🟢 encode unicode slugs before putting them in an alternate URL
    const safeSlug = encodeURIComponent(altSlug);
    languageAlternates[lang] = \`\${baseUrl}/\${lang}/products/\${safeSlug}\`;
  });

  // fallback for unsupported languages
  languageAlternates['x-default'] = \`\${baseUrl}/en/products/\${product.alternateSlugs.en}\`;

  return {
    title: product.title,
    description: product.description,

    // 1. self-referential canonical for this locale
    alternates: {
      canonical: \`\${baseUrl}/\${locale}/products/\${encodeURIComponent(decodedSlug)}\`,
      languages: languageAlternates, // 🟢 cross-language translated slug links
    },

    // 2. localized Open Graph metadata
    openGraph: {
      title: product.title,
      description: product.description,
      url: \`\${baseUrl}/\${locale}/products/\${encodeURIComponent(decodedSlug)}\`,
      siteName: 'TechStore Global',
      locale: ogLocale, // 🟢 renders "bn_BD", "de_DE", etc.
      type: 'website',
    },

    // 3. Twitter card
    twitter: {
      card: 'summary_large_image',
      title: product.title,
      description: product.description,
    },
  };
}

export default async function LocalizedProductPage({ params }: PageProps) {
  const { locale, slug } = await params;
  const decodedSlug = decodeURIComponent(slug);
  const product = await getLocalizedProductBySlug(decodedSlug, locale);

  if (!product) notFound();

  return (
    <main className="p-8 max-w-3xl mx-auto">
      <h1 className="text-3xl font-bold">{product.title}</h1>
      <p className="mt-4 text-gray-600">{product.description}</p>
    </main>
  );
}`}</CodeBlock>

      {/* ── Matrix ────────────────────────────────────────────────────── */}
      <H2 id="matrix">৪. Localized Metadata Strategy Comparison</H2>

      <Table
        head={[
          "বৈশিষ্ট্য",
          "Static English meta",
          "Localized meta, shared slug",
          "Localized meta + localized slug",
        ]}
        rows={[
          [
            "Social preview",
            "সবসময় ইংরেজি দেখায় 🔴",
            "সঠিক ভাষা ও og:locale 🟢",
            "সঠিক ভাষা ও og:locale 🟢",
          ],
          [
            "Local search CTR",
            "কম — স্থানীয় সার্চের সাথে মেলে না 🔴",
            "মাঝারি 🟡",
            "সর্বোচ্চ — লোকাল URL + লোকাল টাইটেল 🟢",
          ],
          [
            "hreflang precision",
            "ভুল বা অনুপস্থিত 🔴",
            "অপূর্ণাঙ্গ — একই স্লাগ রিপিট করে 🟡",
            "প্রতিটি ভাষার নিজস্ব স্লাগে পয়েন্ট করে 🟢",
          ],
          [
            "Unicode URL handling",
            "ক্র্যাশ করতে পারে 🔴",
            "আন-এনকোডেড স্লাগে সমস্যা 🟡",
            "encode/decodeURIComponent দিয়ে নিরাপদ 🟢",
          ],
        ]}
      />

      <Line name="ভুলু ভাই">
        জোস ফাহিম! <code>generateMetadata</code>-এ <code>ogLocaleMap</code> আর লোকাল-স্পেসিফিক স্লাগ
        ম্যাপিং সেট করার পর এখন সোশ্যাল মিডিয়ায় লিংক শেয়ার করলেই পারফেক্ট বাংলা টেক্সট আর{" "}
        <code>bn_BD</code> প্রিভিউ দেখাচ্ছে! গুগলও এখন বাংলা স্লাগ পারফেক্টলি ইনডেক্স করতে পারছে।
      </Line>

      {/* ── Takeaways ─────────────────────────────────────────────────── */}
      <H2 id="takeaway">Production Takeaways</H2>

      <Note>
        <ul>
          <li>
            <strong>Always decode slugs first:</strong> রুট প্যারামস থেকে আসা নন-ল্যাটিন ক্যারেক্টার
            সংবলিত ডাইনামিক স্লাগ <code>decodeURIComponent</code> দিয়ে ডিকোড করে ডাটাবেজে হিট করুন।
          </li>
          <li>
            <strong>Standardize OG locales:</strong> OpenGraph অনুযায়ী <code>en_US</code>,{" "}
            <code>bn_BD</code>, <code>ar_SA</code> — এই ম্যাপ টেবিল মেনে মেটাডেটায় পাস করুন; স্রেফ{" "}
            <code>en</code> বা <code>bn</code> দিলে সোশ্যাল স্ক্র্যাপার রিড করতে পারে না।
          </li>
          <li>
            <strong>Map translated slugs in hreflang:</strong> প্রতিটি ভাষার অনুবাদিত নিজস্ব স্লাগ{" "}
            <code>alternates.languages</code>-এ যোগ করুন — এটি গুগলকে দুটি ভিন্ন URL-কে একই কনটেন্টের
            রূপান্তর হিসেবে চিনতে সাহায্য করে।
          </li>
        </ul>
      </Note>
    </article>
  );
}
