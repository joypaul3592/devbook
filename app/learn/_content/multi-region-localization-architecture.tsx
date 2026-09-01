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
      bn: "এক en, তিন দেশ, ভুল কারেন্সি",
      en: "One en, three countries, wrong currency",
    },
  },
  {
    id: "architecture",
    label: {
      bn: "Multi-region ও geo পাইপলাইন",
      en: "Multi-region & geo pipeline",
    },
  },
  {
    id: "mechanisms",
    label: { bn: "৩টি আর্কিটেকচারাল কনসেপ্ট", en: "Three architectural concepts" },
  },
  {
    id: "implementation",
    label: {
      bn: "Region matrix ও geo middleware",
      en: "Region matrix & geo middleware",
    },
  },
  {
    id: "matrix",
    label: { bn: "Multi-Region Comparison", en: "Multi-region comparison" },
  },
  {
    id: "takeaway",
    label: { bn: "Production Takeaways", en: "Production takeaways" },
  },
];

export default function MultiRegionLocalizationArchitecture() {
  return (
    <article className="doc-prose">
      {/* ── The problem ───────────────────────────────────────────────── */}
      <H2 id="the-problem" anchorOnly>
        এক en, তিন দেশ, ভুল কারেন্সি
      </H2>

      <p>
        রাত ১০:৩০। ভুলু ভাই কানাডা ও ইউকে-র কাস্টমারদের ইমেইল পড়ে হতভম্ব! ইউকে-র ইউজার{" "}
        <code>/en/products</code>-এ ঢুকে ইউএস ডলার প্রাইসে চেকআউট করতে গিয়ে কার্ট অ্যাবান্ডন করছে, আর
        কানাডার ইউজার ইউএস শোরুমের শিপিং চার্জ ও ট্যাক্স দেখে সাইট ছেড়ে দিচ্ছে! কারণ ভুলু ভাই
        ভেবেছিলেন — তিন দেশের মানুষই যেহেতু ইংরেজিতে কথা বলে, তাই স্রেফ <code>en</code> লোকেল দিয়েই
        পুরো পৃথিবীর শপিং সামলানো যাবে।
      </p>

      <Line name="ভুলু ভাই">
        ফাহিম! ইউএস, ইউকে আর কানাডা — তিন জায়গাতেই তো ইংরেজি ভাষা! কিন্তু ইউকে-তে দাম দেখাতে হবে
        পাউন্ডে (£), কানাডায় CAD, আর ইউএস-এ USD! ট্যাক্স আর শিপিং নিয়মও আলাদা! স্রেফ <code>en</code>{" "}
        দিয়ে তো দেশ অনুযায়ী আলাদা প্রাইসিং আর ক্যাটালগ সামলানো সম্ভব হচ্ছে না।
      </Line>

      <Line name="ফাহিম">
        ভুলু ভাই! ভাষা (language) আর অঞ্চল (region) দুটি সম্পূর্ণ আলাদা ডাইমেনশন! <code>en</code> মানে
        শুধু ভাষা, কিন্তু গ্লোবাল ব্র্যান্ডগুলো আন্তর্জাতিক স্ট্যান্ডার্ড BCP 47 ট্যাগ ব্যবহার করে —{" "}
        <code>en-US</code>, <code>en-GB</code>, <code>en-CA</code>, <code>bn-BD</code>। একেই বলে
        multi-region localization architecture!
      </Line>

      <Line name="নেক্সট-ভাই">
        একদম! App Router-এ আমরা <code>[locale]</code>-কে স্রেফ ভাষার গণ্ডিতে না রেখে
        language-region টিউপল হিসেবে সাজাব। সাথে Edge Middleware-এ ব্রাউজারের Geo-IP হেডার (যেমন{" "}
        <code>x-vercel-ip-country</code>) পড়ে স্মার্টলি ইউজারকে তার নিজ দেশের রিজিওনাল শোরুমে নিয়ে
        যাব!
      </Line>

      {/* ── Architecture ──────────────────────────────────────────────── */}
      <H2 id="architecture">১. Multi-Region Localization &amp; Geo Pipeline</H2>

      <Diagram>{`┌─────────────────────────────────────────────────────────────────────────────┐
│               MULTI-REGION LOCALIZATION & GEO PIPELINE                      │
└─────────────────────────────────────────────────────────────────────────────┘

 Incoming request: GET https://techstore.com/products
                               │
                               ▼
             Next.js Edge Middleware (geo interceptor)
                               │
        ├── reads the edge IP header: x-vercel-ip-country: GB
        ├── resolves the best region-locale pair: en-GB
        │
        ▼
 Redirects to the regional segment: /en-gb/products
                               │
                ┌──────────────┴──────────────┐
                ▼                             ▼
       regional store config           regional data API
       ├── currency:  GBP (£)          ├── localized inventory (UK hub)
       ├── tax rules: VAT 20%          ├── localized pricing (£85.00)
       └── region:    UK               └── region shipping methods`}</Diagram>

      {/* ── Mechanisms ────────────────────────────────────────────────── */}
      <H2 id="mechanisms">২. কোর আর্কিটেকচারাল কনসেপ্ট</H2>

      <p>
        <strong>Language-region tuple (BCP 47):</strong> শুধু ল্যাঙ্গুয়েজ কোড (<code>en</code>) না
        লিখে language-REGION পেয়ার ব্যবহার করা (<code>en-US</code>, <code>en-GB</code>,{" "}
        <code>bn-BD</code>)। এটি টেক্সটের ভাষা ঠিক রাখার পাশাপাশি কারেন্সি, ট্যাক্স এবং আইনি শর্তাবলী
        আলাদা করে।
      </p>

      <p>
        <strong>Edge geo-location interception:</strong> Edge network-এ রিকোয়েস্ট আসার পর{" "}
        <code>x-vercel-ip-country</code> বা <code>cf-ipcountry</code> হেডার রিড করে ইউজারের অবস্থান
        সনাক্ত করা হয়, এবং তাকে ম্যানুয়াল সিলেক্টর ছাড়াই উপযুক্ত রিজিওনাল রুটে রিডাইরেক্ট করা হয়।
      </p>

      <p>
        <strong>Decoupled commerce localization:</strong> অনুবাদ এবং ই-কমার্স লজিক (pricing, inventory)
        আলাদা রাখা। একই ইংরেজি অনুবাদ ব্যবহার করলেও <code>en-US</code> রুট USD প্রাইস টানবে এবং{" "}
        <code>en-GB</code> রুট GBP প্রাইস ও VAT ক্যালকুলেট করবে।
      </p>

      {/* ── Implementation ────────────────────────────────────────────── */}
      <H2 id="implementation">৩. Production Code Implementation</H2>

      <H3>❌ Anti-pattern — language-only routing for a global store</H3>

      <CodeBlock filename="app/[locale]/products/page.tsx">{`// 🔴 POOR PRACTICE: only a language code for multi-country commerce
// produces wrong currencies and illegal tax calculations across regions

export default async function BadGlobalProduct({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  // ❌ hardcoded assumption: every English speaker uses USD and US shipping rules
  const currency = locale === 'en' ? 'USD' : 'BDT';
  return <div>Price in {currency}</div>;
}`}</CodeBlock>

      <H3>🟢 Production pattern — region-aware locale matrix with geo middleware</H3>

      <p>
        <strong>Step 1 — মাল্টি-রিজিয়ন কনফিগ।</strong>
      </p>

      <CodeBlock filename="lib/i18n/regions.ts">{`// 🟢 PRODUCTION PATTERN: centralized multi-region mapping
export interface RegionConfig {
  code: string; // country code (ISO 3166-1 alpha-2)
  locale: string; // full BCP 47 tag
  language: string; // UI language
  currency: string; // currency code
  label: string;
}

export const regions: Record<string, RegionConfig> = {
  'en-us': {
    code: 'US',
    locale: 'en-US',
    language: 'en',
    currency: 'USD',
    label: 'United States ($)',
  },
  'en-gb': {
    code: 'GB',
    locale: 'en-GB',
    language: 'en',
    currency: 'GBP',
    label: 'United Kingdom (£)',
  },
  'bn-bd': {
    code: 'BD',
    locale: 'bn-BD',
    language: 'bn',
    currency: 'BDT',
    label: 'বাংলাদেশ (৳)',
  },
};

export const defaultRegion = 'en-us';`}</CodeBlock>

      <p>
        <strong>Step 2 — Geo-IP এজ মিডলওয়্যার।</strong>
      </p>

      <CodeBlock filename="middleware.ts">{`// 🟢 PRODUCTION PATTERN: geo-location routing via edge headers
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { regions, defaultRegion } from '@/lib/i18n/regions';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // does the pathname already carry a valid region-locale?
  const hasValidRegion = Object.keys(regions).some(
    (key) => pathname.startsWith(\`/\${key}/\`) || pathname === \`/\${key}\`
  );

  if (!hasValidRegion) {
    // 1. detect the country from the edge geo-IP header
    const country = request.headers.get('x-vercel-ip-country')?.toLowerCase() || '';

    // 2. map the country to the right region-locale
    let targetRegion = defaultRegion;
    if (country === 'gb') targetRegion = 'en-gb';
    else if (country === 'bd') targetRegion = 'bn-bd';

    // 3. redirect to the region-aware URL
    return NextResponse.redirect(
      new URL(\`/\${targetRegion}\${pathname.startsWith('/') ? '' : '/'}\${pathname}\`, request.url)
    );
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico|.*\\\\..*).*)'],
};`}</CodeBlock>

      <p>
        <strong>Step 3 — region-aware প্রোডাক্ট পেজ।</strong>
      </p>

      <CodeBlock filename="app/[locale]/products/[slug]/page.tsx">{`// 🟢 PRODUCTION PATTERN: region-scoped data fetching
import { regions } from '@/lib/i18n/regions';
import { notFound } from 'next/navigation';

interface PageProps {
  params: Promise<{ locale: string; slug: string }>;
}

export default async function RegionalProductPage({ params }: PageProps) {
  const { locale, slug } = await params;
  const regionConfig = regions[locale];

  if (!regionConfig) notFound();

  // 🟢 fetch region-specific inventory, tax, and pricing
  const product = await getRegionalProductData(slug, regionConfig.code);

  return (
    <main className="p-8 max-w-xl mx-auto border rounded-lg">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">{product.title}</h1>
        <span className="text-xs bg-slate-200 px-2 py-1 rounded font-semibold">
          Region: {regionConfig.label}
        </span>
      </div>

      <p className="text-3xl font-extrabold text-blue-600">
        {product.formattedPrice} {regionConfig.currency}
      </p>
      <p className="text-xs text-gray-500 mt-1">
        * includes local regional tax ({regionConfig.code})
      </p>
    </main>
  );
}

async function getRegionalProductData(slug: string, countryCode: string) {
  // mock DB response adjusted for regional price rules
  const prices: Record<string, string> = { US: '100.00', GB: '85.00', BD: '12,000' };
  return {
    title: 'Wireless Headphones Pro',
    formattedPrice: prices[countryCode] || '100.00',
  };
}`}</CodeBlock>

      {/* ── Matrix ────────────────────────────────────────────────────── */}
      <H2 id="matrix">৪. Multi-Region Strategy Comparison</H2>

      <Table
        head={[
          "বৈশিষ্ট্য",
          "Language-only (/en)",
          "Sub-path multi-region (/en-us, /en-gb)",
          "Domain-based (.com, .co.uk)",
        ]}
        rows={[
          [
            "Regional pricing & tax",
            "কনফ্লিক্ট তৈরি করে 🔴",
            "সম্পূর্ণ আইসোলেটেড 🟢",
            "সম্পূর্ণ আইসোলেটেড 🟢",
          ],
          [
            "SEO & geo-targeting",
            "দুর্বল — গুগল রিজিয়ন বোঝে না 🔴",
            "উচ্চমানের geo-targeting 🟢",
            "সর্বোচ্চ — লোকাল ccTLD ট্রাস্ট 🟢",
          ],
          [
            "Infrastructure cost",
            "কম 🟢",
            "কম ও সিঙ্গেল কোডবেজে স্কেলেবল 🟢",
            "চড়া — মাল্টিপল ডোমেইন ও DNS 🔴",
          ],
          [
            "Edge geo-routing",
            "লিমিটেড 🔴",
            "মিডলওয়্যারে তাৎক্ষণিক অটো-রিডাইরেক্ট 🟢",
            "জটিল CNAME রিডাইরেকশন 🟡",
          ],
        ]}
      />

      <Line name="ভুলু ভাই">
        অসাধারণ ফাহিম! region-aware আর্কিটেকচার আর এজ মিডলওয়্যার সেট করার পর এখন ইউকে-র ইউজার সাইটে
        ঢুকলেই <code>/en-gb</code>-এ রিডাইরেক্ট হয়ে পাউন্ডে সঠিক ট্যাক্সসহ দাম দেখছে! কোনো জটলা ছাড়াই
        পুরো গ্লোবাল সেলস পাইপলাইন সেট হয়ে গেল।
      </Line>

      {/* ── Takeaways ─────────────────────────────────────────────────── */}
      <H2 id="takeaway">Production Takeaways</H2>

      <Note>
        <ul>
          <li>
            <strong>Adopt BCP 47 early:</strong> আন্তর্জাতিক প্ল্যাটফর্ম বানানোর সময় রুটে স্রেফ{" "}
            <code>en</code> না দিয়ে <code>en-us</code> বা <code>en-gb</code>-এর মতো language-REGION
            টিউপল ব্যবহার করুন।
          </li>
          <li>
            <strong>Isolate content from commerce:</strong> অনুবাদ ফাইলে শুধু টেক্সট রাখুন। মূল্য,
            মুদ্রা, ট্যাক্স রেট ও স্টক ডাটাবেজ বা CMS থেকে রিজিয়ন কোড দিয়ে ডাইনামিকভাবে তুলে আনুন।
          </li>
          <li>
            <strong>Always allow manual switching:</strong> Geo-IP রিডাইরেকশন স্বয়ংক্রিয় হলেও ফুটার বা
            হেডারে একটি language ও region সিলেক্টর রাখুন, যেন ইউজার নিজের পছন্দমতো রিজিয়নে সুইচ করতে
            পারে।
          </li>
        </ul>
      </Note>
    </article>
  );
}
