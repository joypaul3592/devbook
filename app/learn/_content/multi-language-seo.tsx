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
    label: { bn: "ভুল ভাষার পেজ র‍্যাঙ্ক করছে", en: "The wrong language is ranking" },
  },
  {
    id: "architecture",
    label: { bn: "hreflang রাউটিং পাইপলাইন", en: "The hreflang routing pipeline" },
  },
  {
    id: "mechanisms",
    label: { bn: "৩টি আর্কিটেকচারাল কনসেপ্ট", en: "Three architectural concepts" },
  },
  {
    id: "implementation",
    label: { bn: "alternates.languages কনফিগ", en: "alternates.languages config" },
  },
  {
    id: "matrix",
    label: { bn: "i18n SEO Comparison", en: "i18n SEO comparison" },
  },
  {
    id: "takeaway",
    label: { bn: "Production Takeaways", en: "Production takeaways" },
  },
];

export default function MultiLanguageSeo() {
  return (
    <article className="doc-prose">
      {/* ── The problem ───────────────────────────────────────────────── */}
      <H2 id="the-problem" anchorOnly>
        ভুল ভাষার পেজ র‍্যাঙ্ক করছে
      </H2>

      <p>
        রাত ১:১৫। ভুলু ভাই বাংলা (<code>/bn</code>) ও ইংরেজি (<code>/en</code>) — দুই ভাষায় প্রোডাক্ট
        দেখানোর সুবিধা চালু করেছেন। কিন্তু বাংলাদেশের ইউজারের কাছে ইংরেজি পেজ আর যুক্তরাষ্ট্রের ইউজারের
        কাছে বাংলা পেজ র‍্যাঙ্ক করছে, আর Search Console বলছে দুটি URL নাকি duplicate content।
      </p>

      <Line name="ভুলু ভাই">
        ফাহিম! আমাদের সাইট তো এখন i18n! তাহলে গুগল কেন ইউজারের লোকেশন অনুযায়ী সঠিক ভাষার পেজ দেখাতে
        পারছে না? আর দুই ভাষার পেজকে কেন duplicate ধরছে?
      </Line>

      <Line name="ফাহিম">
        ভুলু ভাই! ক্রলার নিজে থেকে ধরে নিতে পারে না যে <code>/bn/...</code> আর <code>/en/...</code>{" "}
        একই পেজের দুটি ভাষার সংস্করণ। এটি বোঝাতে HTML-এ <code>hreflang</code> অ্যানোটেশন দিতে হয় — যা
        বলে দেয় কোন ভাষা ও অঞ্চলের ইউজারের জন্য কোন URL।
      </Line>

      <Line name="নেক্সট-ভাই">
        একদম! আর যে ইউজারের ভাষা আমাদের সাইটে নেই, তার জন্য একটি <code>x-default</code> ফলব্যাক ডিফাইন
        করতে হয়। App Router-এর <code>alternates.languages</code> API দিয়ে এই ট্যাগগুলো ডাইনামিকভাবে
        জেনারেট করা যায়।
      </Line>

      {/* ── Architecture ──────────────────────────────────────────────── */}
      <H2 id="architecture">১. Multi-Language hreflang Routing Pipeline</H2>

      <Diagram>{`┌─────────────────────────────────────────────────────────────────────────┐
│                    MULTI-LANGUAGE hreflang ARCHITECTURE                 │
└─────────────────────────────────────────────────────────────────────────┘

 crawler requests /bn/products/shoes
                                  │
                                  ▼
 reads the evaluated <head> output:
 ├── <link rel="alternate" hreflang="bn" href="https://site.com/bn/products/shoes" />
 ├── <link rel="alternate" hreflang="en" href="https://site.com/en/products/shoes" />
 └── <link rel="alternate" hreflang="x-default" href="https://site.com/en/products/shoes" />
                                  │
                                  ▼
 🟢 the crawler understands the language equivalence across locales
 🟢 shows /bn/ to Bangladeshi users and /en/ to everyone else — no duplicate penalty`}</Diagram>

      {/* ── Mechanisms ────────────────────────────────────────────────── */}
      <H2 id="mechanisms">২. কোর আর্কিটেকচারাল কনসেপ্ট</H2>

      <p>
        <strong>Bidirectional reciprocity:</strong> ইংরেজি পেজ যদি বলে &quot;আমার বাংলা সংস্করণ{" "}
        <code>/bn/</code>&quot;, তবে বাংলা পেজকেও উল্টো বলতে হবে &quot;আমার ইংরেজি সংস্করণ{" "}
        <code>/en/</code>&quot;। এই দ্বিমুখী সম্পর্ক না থাকলে গুগল <code>hreflang</code> উপেক্ষা করে।
      </p>

      <p>
        <strong>The x-default fallback:</strong> সাপোর্ট না করা ভাষার (যেমন <code>fr</code>,{" "}
        <code>de</code>) ইউজারকে গুগল <code>x-default</code> হিসেবে চিহ্নিত URL-এ পাঠায় — সাধারণত
        আন্তর্জাতিক ইংরেজি সংস্করণ।
      </p>

      <p>
        <strong>Locale-aware canonical:</strong> প্রতিটি লোকেল পেজের ক্যানোনিকাল হবে তার নিজের URL (
        <code>/bn/shoes</code>-এর ক্যানোনিকাল <code>/bn/shoes</code>), আর{" "}
        <code>alternates.languages</code>-এ বাকি সব ভার্সনের লিংক থাকবে।
      </p>

      {/* ── Implementation ────────────────────────────────────────────── */}
      <H2 id="implementation">৩. Production Code Implementation</H2>

      <H3>❌ Anti-pattern — language switching via query params</H3>

      <CodeBlock filename="components/BadLanguageSwitcher.tsx">{`// 🔴 POOR PRACTICE: query-parameter i18n with no hreflang annotations
// crawlers index duplicate content and cannot map localized search intent

export default function BadLanguageSwitcher() {
  return (
    <div>
      {/* ❌ query-parameter routing confuses search engine bots */}
      <a href="/products/shoes?lang=bn">বাংলা</a>
      <a href="/products/shoes?lang=en">English</a>
    </div>
  );
}`}</CodeBlock>

      <H3>🟢 Production pattern — locale sub-paths with generated hreflang</H3>

      <CodeBlock filename="lib/i18n/config.ts">{`// 🟢 centralized locale configuration
export const i18nConfig = {
  defaultLocale: 'en',
  locales: ['en', 'bn'],
  prefixDefault: true,
} as const;

export type Locale = (typeof i18nConfig)['locales'][number];`}</CodeBlock>

      <CodeBlock filename="app/[locale]/products/[slug]/page.tsx">{`import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getLocalizedProduct } from '@/lib/db/product';
import { i18nConfig, type Locale } from '@/lib/i18n/config';

interface PageProps {
  params: Promise<{ locale: Locale; slug: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale, slug } = await params;

  // reject unknown locales before doing any work
  if (!i18nConfig.locales.includes(locale)) {
    return {};
  }

  const product = await getLocalizedProduct(slug, locale);
  if (!product) return {};

  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://techstore.com';

  return {
    title: product.title,
    description: product.description,

    alternates: {
      // 1. a self-referential canonical for this locale
      canonical: \`\${baseUrl}/\${locale}/products/\${slug}\`,

      // 2. the hreflang map for crawlers
      languages: {
        en: \`\${baseUrl}/en/products/\${slug}\`,
        bn: \`\${baseUrl}/bn/products/\${slug}\`,
        // regional variants are optional: 'bn-BD': ...
        'x-default': \`\${baseUrl}/en/products/\${slug}\`,
      },
    },

    // 3. localized Open Graph tags
    openGraph: {
      title: product.title,
      description: product.description,
      locale: locale === 'bn' ? 'bn_BD' : 'en_US',
      url: \`\${baseUrl}/\${locale}/products/\${slug}\`,
    },
  };
}

export default async function LocalizedProductPage({ params }: PageProps) {
  const { locale, slug } = await params;
  const product = await getLocalizedProduct(slug, locale);

  if (!product) {
    notFound();
  }

  return (
    <main className="p-8 max-w-4xl mx-auto">
      <span className="text-sm font-semibold text-blue-600 uppercase">
        Locale: {locale}
      </span>
      <h1 className="text-3xl font-bold mt-2">{product.title}</h1>
      <p className="mt-4 text-gray-700">{product.description}</p>
    </main>
  );
}`}</CodeBlock>

      {/* ── Matrix ────────────────────────────────────────────────────── */}
      <H2 id="matrix">৪. Multi-Language SEO Architecture Comparison</H2>

      <Table
        head={["বৈশিষ্ট্য", "?lang= query routing", "Sub-path, no hreflang", "Sub-path + alternates.languages"]}
        rows={[
          [
            "Crawling",
            "ডুপ্লিকেট কনটেন্ট ঝুঁকি 🔴",
            "ইনডেক্স হয়, ভাষা চিনতে ভুল করে 🟡",
            "নিখুঁত লোকালাইজড কভারেজ 🟢",
          ],
          [
            "hreflang support",
            "অনুপস্থিত 🔴",
            "ম্যানুয়াল ইনজেকশন ঝামেলাপূর্ণ 🔴",
            "Metadata API দিয়ে অটোমেটেড 🟢",
          ],
          [
            "x-default fallback",
            "নেই 🔴",
            "নেই 🔴",
            "গ্লোবাল ইউজারের জন্য সেফ ফলব্যাক 🟢",
          ],
          [
            "URL quality",
            "ক্লিন নয় 🔴",
            "ক্লিন 🟢",
            "ক্লিন + পারফেক্ট লোকালাইজড SEO 🟢",
          ],
        ]}
      />

      <Line name="ভুলু ভাই">
        অসাম ফাহিম! <code>alternates.languages</code> ব্যবহার করার সাথে সাথে HTML-এ{" "}
        <code>hreflang</code> ও <code>x-default</code> সুন্দরভাবে জেনারেট হয়ে গেল — গুগল এখন
        বাংলাদেশের ইউজারদের সঠিক বাংলা পেজই দেখাবে।
      </Line>

      {/* ── Takeaways ─────────────────────────────────────────────────── */}
      <H2 id="takeaway">Production Takeaways</H2>

      <Note>
        <ul>
          <li>
            <strong>Always implement x-default:</strong> গ্লোবাল ইউজারের অভিজ্ঞতা ও বাউন্স রেট ঠিক
            রাখতে একটি ফলব্যাক URL দিন (সাধারণত ইংরেজি সংস্করণ)।
          </li>
          <li>
            <strong>Keep hreflang URLs absolute:</strong> রিলেটিভ URL এখানে চলে না — সবসময় ডোমেইনসহ
            পূর্ণাঙ্গ URL দিন।
          </li>
          <li>
            <strong>Localize the structured data too:</strong> শুধু মেটাডেটা নয়, JSON-LD-এর
            ডেসক্রিপশন ও কারেন্সিও পেজের চলতি ভাষা অনুযায়ী রেন্ডার করুন।
          </li>
        </ul>
      </Note>
    </article>
  );
}
