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
    label: { bn: "Duplicate content পেনাল্টি", en: "A duplicate-content penalty" },
  },
  {
    id: "architecture",
    label: { bn: "Link equity consolidation", en: "Link equity consolidation" },
  },
  {
    id: "mechanisms",
    label: { bn: "৩টি আর্কিটেকচারাল কনসেপ্ট", en: "Three architectural concepts" },
  },
  {
    id: "implementation",
    label: { bn: "Clean canonical resolution", en: "Clean canonical resolution" },
  },
  {
    id: "matrix",
    label: { bn: "Canonical Strategy Matrix", en: "Canonical strategy matrix" },
  },
  {
    id: "takeaway",
    label: { bn: "Production Takeaways", en: "Production takeaways" },
  },
];

export default function CanonicalUrl() {
  return (
    <article className="doc-prose">
      {/* ── The problem ───────────────────────────────────────────────── */}
      <H2 id="the-problem" anchorOnly>
        Duplicate content পেনাল্টি
      </H2>

      <p>
        রাত ১১:৫০। Google Search Console-এর কভারেজ রিপোর্টে লাল অক্ষরে লেখা &quot;Duplicate without
        user-selected canonical&quot;। একই প্রোডাক্ট পেজ একাধিক URL-এ খোলার কারণে সাইটের র‍্যাঙ্কিং
        অনেক নিচে নেমে গেছে।
      </p>

      <Line name="ভুলু ভাই">
        ফাহিম! ই-কমার্স সাইটে ইউজাররা নানাভাবে ঢোকে — ফেসবুক থেকে{" "}
        <code>/products/shoes?utm_source=facebook</code>, ফিল্টার করলে{" "}
        <code>/products/shoes?color=black&amp;sort=price</code>, আবার সাধারণ{" "}
        <code>/products/shoes</code>। কনটেন্ট তো সবগুলোতেই এক! তাহলে গুগল কেন duplicate content
        পেনাল্টি দিচ্ছে?
      </Line>

      <Line name="ফাহিম">
        ভুলু ভাই! সার্চ ইঞ্জিনের কাছে কোয়েরি স্ট্রিং সহ প্রতিটি URL একেকটি আলাদা পেজ। একই কনটেন্ট ৫টি
        ভিন্ন URL-এ দেখলে সে ঠিক করতে পারে না কোনটি ইনডেক্স করবে — ফলে পেজের link equity ৫ ভাগে ভাগ হয়ে
        দুর্বল হয়ে যায়।
      </Line>

      <Line name="নেক্সট-ভাই">
        একদম! এর স্ট্যান্ডার্ড সমাধান হলো Canonical URL। এটি ক্রলারকে স্পষ্ট জানিয়ে দেয় — কোয়েরি
        প্যারামিটার যাই থাকুক, এই পেজের মাস্টার কপি হলো এটি। App Router-এ{" "}
        <code>alternates.canonical</code> দিয়ে কাজটি করা যায়।
      </Line>

      {/* ── Architecture ──────────────────────────────────────────────── */}
      <H2 id="architecture">১. Canonical URL &amp; PageRank Consolidation</H2>

      <Diagram>{`┌─────────────────────────────────────────────────────────────────────────┐
│                   CANONICAL LINK EQUITY CONSOLIDATION                   │
└─────────────────────────────────────────────────────────────────────────┘

 ❌ WITHOUT A CANONICAL TAG (equity dilution)
 ├── /products/shoes?utm_source=fb    ──► ~20% of the equity
 ├── /products/shoes?color=black      ──► ~20%   ──► duplicate-content penalty 🔴
 └── /products/shoes?sort=low_to_high ──► ~20%        (rank diluted)

───────────────────────────────────────────────────────────────────────────

 🟢 WITH <link rel="canonical" href="https://site.com/products/shoes" />
 ├── /products/shoes?utm_source=fb    ──┐
 ├── /products/shoes?color=black      ──┼──► all point at the master URL
 └── /products/shoes?sort=low_to_high ──┘            │
                                                     ▼
 🟢 master URL: https://site.com/products/shoes (100% consolidated equity)`}</Diagram>

      {/* ── Mechanisms ────────────────────────────────────────────────── */}
      <H2 id="mechanisms">২. কোর আর্কিটেকচারাল কনসেপ্ট</H2>

      <p>
        <strong>Link equity consolidation:</strong> ক্যানোনিকাল ট্যাগ ট্র্যাকিং প্যারামস (
        <code>?utm_*</code>, <code>?ref=</code>, <code>?fbclid=</code>), সেশন আইডি ও ফিল্টার প্যারামস
        যুক্ত সব URL-এর SEO authority আসল URL-এ স্থানান্তর করে।
      </p>

      <p>
        <strong>Self-referential canonical:</strong> কোয়েরি প্যারাম না থাকলেও প্রতিটি পেজের নিজের URL-কে
        নিজের ক্যানোনিকাল হিসেবে ডিক্লেয়ার করা বেস্ট প্র্যাকটিস।
      </p>

      <p>
        <strong>metadataBase &amp; relative resolution:</strong> <code>metadataBase</code> সেট থাকলে{" "}
        <code>alternates: {"{ canonical: '/products/shoes' }"}</code> সার্ভার-সাইডেই পূর্ণাঙ্গ absolute
        URL-এ রূপান্তরিত হয়ে যায়।
      </p>

      {/* ── Implementation ────────────────────────────────────────────── */}
      <H2 id="implementation">৩. Production Code Implementation</H2>

      <H3>❌ Anti-pattern — query params inside the canonical</H3>

      <CodeBlock filename="app/products/[slug]/legacy-metadata.ts">{`// 🔴 POOR PRACTICE: keeping dirty query parameters in the canonical URL
import type { Metadata } from 'next';

export async function generateMetadata({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | undefined }>;
}): Promise<Metadata> {
  const sParams = await searchParams;

  return {
    title: 'Product details',
    alternates: {
      // ❌ this tells Google that ?ref=facebook is its own canonical page
      canonical: \`/products/shoes?ref=\${sParams.ref}\`,
    },
  };
}`}</CodeBlock>

      <H3>🟢 Production pattern — clean absolute canonicals</H3>

      <CodeBlock filename="app/layout.tsx">{`import type { Metadata } from 'next';

export const metadata: Metadata = {
  // 🟢 turns relative canonical paths into absolute URLs automatically
  metadataBase: new URL('https://techstore.com'),
  title: {
    default: 'TechStore Enterprise',
    template: '%s | TechStore',
  },
  alternates: {
    // 🟢 a root-level fallback canonical
    canonical: '/',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="bn">
      <body>{children}</body>
    </html>
  );
}`}</CodeBlock>

      <CodeBlock filename="app/products/[slug]/page.tsx">{`import type { Metadata } from 'next';
import { getProductBySlug } from '@/lib/db/product';

interface PageProps {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProductBySlug(slug);

  if (!product) {
    return { title: 'Product not found' };
  }

  // 🟢 always build a clean path, stripped of every search/filter param
  const cleanCanonicalPath = \`/products/\${slug}\`;

  return {
    title: product.name,
    description: product.description,
    alternates: {
      canonical: cleanCanonicalPath, // → https://techstore.com/products/<slug>
    },
  };
}

export default async function ProductDetailsPage({ params, searchParams }: PageProps) {
  const { slug } = await params;
  const sParams = await searchParams; // filters drive the UI only, never the canonical

  return (
    <main className="p-8">
      <h1 className="text-3xl font-bold">Product: {slug}</h1>
      <p className="text-gray-500">Selected filter: {sParams.color || 'default'}</p>
    </main>
  );
}`}</CodeBlock>

      {/* ── Matrix ────────────────────────────────────────────────────── */}
      <H2 id="matrix">৪. Canonical Strategy Matrix</H2>

      <Table
        head={["স্ট্র্যাটেজি", "Equity ধরে রাখা", "Duplicate ঝুঁকি", "SEO আউটপুট"]}
        rows={[
          [
            "No canonical tag",
            "ভাগ হয়ে নষ্ট হয় 🔴",
            "অত্যন্ত বেশি 🔴",
            "কভারেজ রিপোর্টে ফেইল 🔴",
          ],
          [
            "Canonical with query params",
            "প্যারাম ভেদে আলাদা থাকে 🔴",
            "মাঝারি (গুগল উপেক্ষা করে) 🟡",
            "র‍্যাঙ্কিং বিভ্রান্তি 🟡",
          ],
          [
            "Clean absolute canonical",
            "১০০% মাস্টার পেজে যায় 🟢",
            "প্রায় শূন্য 🟢",
            "সর্বোচ্চ র‍্যাঙ্কিং 🟢",
          ],
        ]}
      />

      <Line name="ভুলু ভাই">
        অসাধারণ ফাহিম! <code>alternates: {"{ canonical }"}</code> ব্যবহারের পর ট্র্যাকিং কোয়েরি দিয়ে URL
        খুললেও <code>&lt;head&gt;</code>-এ পারফেক্ট ক্লিন মাস্টার URL দেখাচ্ছে — Search Console-এর
        duplicate ওয়ার্নিং সল্‌ভড।
      </Line>

      {/* ── Takeaways ─────────────────────────────────────────────────── */}
      <H2 id="takeaway">Production Takeaways</H2>

      <Note>
        <ul>
          <li>
            <strong>Strip query parameters:</strong> ক্যানোনিকাল URL-এ কোনো অবস্থাতেই{" "}
            <code>searchParams</code> বা ট্র্যাকিং কোয়েরি (<code>utm_source</code>, <code>ref</code>)
            যুক্ত করবেন না।
          </li>
          <li>
            <strong>Always use absolute URLs:</strong> ক্যানোনিকাল সবসময় ডোমেইনসহ absolute হতে হবে —{" "}
            <code>metadataBase</code> ব্যবহার করলে এটি স্বয়ংক্রিয়ভাবেই হয়।
          </li>
          <li>
            <strong>Stay consistent across http/https and www:</strong> মূল ডোমেইন{" "}
            <code>https://techstore.com</code> হলে ক্যানোনিকালে কখনো <code>http://</code> বা{" "}
            <code>www.</code> মেশাবেন না।
          </li>
        </ul>
      </Note>
    </article>
  );
}
