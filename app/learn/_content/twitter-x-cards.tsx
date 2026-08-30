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
    label: { bn: "পিচ্চি থাম্বনেইল কার্ড", en: "A tiny thumbnail card" },
  },
  {
    id: "architecture",
    label: { bn: "Card parsing আর্কিটেকচার", en: "Card parsing architecture" },
  },
  {
    id: "mechanisms",
    label: { bn: "৩টি আর্কিটেকচারাল কনসেপ্ট", en: "Three architectural concepts" },
  },
  {
    id: "implementation",
    label: { bn: "Global ও dynamic twitter config", en: "Global & dynamic twitter config" },
  },
  {
    id: "matrix",
    label: { bn: "Card Types Matrix", en: "Card types matrix" },
  },
  {
    id: "takeaway",
    label: { bn: "Production Takeaways", en: "Production takeaways" },
  },
];

export default function TwitterXCards() {
  return (
    <article className="doc-prose">
      {/* ── The problem ───────────────────────────────────────────────── */}
      <H2 id="the-problem" anchorOnly>
        পিচ্চি থাম্বনেইল কার্ড
      </H2>

      <p>
        রাত ১১:১৫। ভুলু ভাই তার টেক ব্লগের আর্টিকেল লিংক X-এ পোস্ট করেছেন — কিন্তু পোস্টে শুধু টেক্সট
        লিংক আর পাশে একটা ১:১ সাইজের পিচ্চি আইকন। অন্যদের ফিডে যেমন বিশাল ব্যানারসহ কার্ড আসে, তার
        ক্ষেত্রে হচ্ছে না।
      </p>

      <Line name="ভুলু ভাই">
        ফাহিম! আমরা তো Open Graph ট্যাগ আর ডাইনামিক OG ইমেজ বানিয়ে ফেলেছি! তাও X-এ শেয়ার করলে বড় ব্যানার
        আসছে না কেন? পোস্টটা একদম আনপ্রফেশনাল দেখাচ্ছে।
      </Line>

      <Line name="ফাহিম">
        ভুলু ভাই! Facebook বা LinkedIn পুরোপুরি OG স্ট্যান্ডার্ড মেনে চললেও X-এর নিজস্ব Twitter Cards
        markup protocol আছে। আপনি স্পষ্টভাবে <code>twitter:card</code> = {" "}
        <code>summary_large_image</code> না বললে X ডিফল্ট হিসেবে সবচেয়ে ছোট <code>summary</code>{" "}
        ফরম্যাটে রেন্ডার করে।
      </Line>

      <Line name="নেক্সট-ভাই">
        একদম! আনন্দের কথা হলো Next.js Metadata API-তে আলাদা করে{" "}
        <code>&lt;meta name=&quot;twitter:...&quot;&gt;</code> লিখতে হয় না — <code>metadata</code>{" "}
        অবজেক্টের <code>twitter</code> প্রপার্টি কনফিগার করলেই টাইপ-সেফভাবে সঠিক ট্যাগ ইনজেক্ট হয়ে যায়।
      </Line>

      {/* ── Architecture ──────────────────────────────────────────────── */}
      <H2 id="architecture">১. Twitter/X Card Parsing Architecture</H2>

      <Diagram>{`┌─────────────────────────────────────────────────────────────────────────┐
│                    TWITTER/X CARD GENERATION PIPELINE                   │
└─────────────────────────────────────────────────────────────────────────┘

 link shared on X ──► Twitterbot crawls the page HTML
                                    │
                                    ▼
                  ┌──────────────────────────────────────┐
                  │ checks <meta name="twitter:card">    │
                  └──────────────────┬───────────────────┘
                                     │
             ┌───────────────────────┴───────────────────────┐
             ▼                                               ▼
  found: 'summary_large_image'                    found: 'summary' or missing
             │                                               │
             ▼                                               ▼
 🟢 full-width rich banner card                  🔴 small thumbnail card (1:1)
 ┌──────────────────────────────────┐           ┌──────────────────────────────────┐
 │ [ 1200x630 dynamic OG banner ]   │           │ [thumb]  page title              │
 │                                  │           │          domain.com              │
 │ page title                       │           └──────────────────────────────────┘
 │ description text...              │
 └──────────────────────────────────┘`}</Diagram>

      {/* ── Mechanisms ────────────────────────────────────────────────── */}
      <H2 id="mechanisms">২. কোর আর্কিটেকচারাল কনসেপ্ট</H2>

      <p>
        <strong>Card types:</strong> <code>summary</code> ছোট ১:১ থাম্বনেইল দেখায় (প্রোফাইল বা
        সাধারণ পেজের জন্য), আর <code>summary_large_image</code> ১২০০×৬৩০ ফুল-উইডথ ব্যানার দেখায় (ব্লগ,
        নিউজ, প্রোডাক্ট পেজের জন্য)।
      </p>

      <p>
        <strong>Attribution &amp; handle mapping:</strong> <code>site</code> দিয়ে ব্র্যান্ডের অফিশিয়াল
        হ্যান্ডেল আর <code>creator</code> দিয়ে কনটেন্ট অথরের হ্যান্ডেল কানেক্ট করলে কার্ডের নিচে সেই
        অ্যাকাউন্ট অ্যাট্রিবিউশন দেখায়।
      </p>

      <p>
        <strong>Open Graph fallback:</strong> <code>twitter:title</code> বা{" "}
        <code>twitter:image</code> না থাকলে Twitterbot <code>og:*</code> থেকে ডেটা নেয় — কিন্তু{" "}
        <code>twitter:card</code>-এর মান ডিক্লেয়ার না করলে বড় ছবি কখনোই দেখাবে না।
      </p>

      {/* ── Implementation ────────────────────────────────────────────── */}
      <H2 id="implementation">৩. Production Code Implementation</H2>

      <H3>❌ Anti-pattern — Open Graph only, no card type</H3>

      <CodeBlock filename="app/blog/legacy-metadata.ts">{`// 🔴 POOR PRACTICE: no explicit twitter metadata
export const metadata = {
  title: 'My Enterprise Article',
  openGraph: {
    title: 'My Enterprise Article',
    images: ['https://example.com/og-image.png'],
  },
  // ❌ no 'twitter' object — Twitterbot falls back to the small summary card
};`}</CodeBlock>

      <H3>🟢 Production pattern — global defaults plus per-route cards</H3>

      <CodeBlock filename="app/layout.tsx">{`import type { Metadata } from 'next';

export const metadata: Metadata = {
  metadataBase: new URL('https://techstore.com'),
  title: {
    default: 'TechStore — Enterprise Platform',
    template: '%s | TechStore',
  },
  // 🟢 app-wide Twitter defaults
  twitter: {
    card: 'summary_large_image', // the default card format everywhere
    site: '@techstore_official',
    creator: '@zubayersalehin',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="bn">
      <body>{children}</body>
    </html>
  );
}`}</CodeBlock>

      <CodeBlock filename="app/blog/[slug]/page.tsx">{`import type { Metadata } from 'next';
import { getBlogPostBySlug } from '@/lib/db/blog';

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = await getBlogPostBySlug(slug);

  if (!post) {
    return { title: 'Post not found' };
  }

  // reuse the automatically generated edge OG image for this route
  const imageUrl = \`https://techstore.com/blog/\${slug}/opengraph-image\`;

  return {
    title: post.title,
    description: post.excerpt,
    // 🟢 fully typed Twitter metadata
    twitter: {
      card: 'summary_large_image',
      title: post.title,
      description: post.excerpt,
      site: '@techstore_official',
      creator: post.authorTwitterHandle || '@zubayersalehin',
      images: [{ url: imageUrl, alt: post.title }],
    },
  };
}

export default async function BlogPostPage({ params }: PageProps) {
  const { slug } = await params;
  const post = await getBlogPostBySlug(slug);

  return (
    <article className="max-w-3xl mx-auto p-8">
      <h1 className="text-4xl font-extrabold">{post?.title}</h1>
      <p className="mt-4 text-gray-600">{post?.content}</p>
    </article>
  );
}`}</CodeBlock>

      {/* ── Matrix ────────────────────────────────────────────────────── */}
      <H2 id="matrix">৪. Twitter Card Types Matrix</H2>

      <Table
        head={["কার্ড টাইপ", "ভিজ্যুয়াল লেআউট", "সেরা ইউজ কেস", "ইমেজ সাইজ"]}
        rows={[
          [
            <code key="c">summary_large_image</code>,
            "ফুল-উইডথ লার্জ ব্যানার 🟢",
            "ব্লগ, প্রোডাক্ট, নিউজ, ফিচারড আর্টিকেল",
            "১২০০×৬৩০ (১.৯১:১)",
          ],
          [
            <code key="c">summary</code>,
            "ছোট স্কোয়ার থাম্বনেইল 🟡",
            "প্রোফাইল, কন্ট্যাক্ট, সাধারণ পেজ",
            "১৪৪×১৪৪ (১:১)",
          ],
          [
            <code key="c">app</code>,
            "অ্যাপ ডাউনলোড বাটন 🟢",
            "মোবাইল অ্যাপ প্রমোশন",
            "অ্যাপ স্টোর আইকন ও রেটিং",
          ],
          [
            <code key="c">player</code>,
            "ইন-লাইন ভিডিও/অডিও প্লেয়ার 🟢",
            "ভিডিও লিংক, পডকাস্ট, মিউজিক স্ট্রিম",
            "কাস্টমাইজেবল",
          ],
        ]}
      />

      <Line name="ভুলু ভাই">
        মারাত্মক ফাহিম! <code>card: &apos;summary_large_image&apos;</code> সেট করে টুইট করতেই বিশাল
        সুন্দর HD ব্যানার প্রিভিউ চলে এসেছে — ব্লগের CTR এক ধাক্কায় বেড়ে যাবে।
      </Line>

      {/* ── Takeaways ─────────────────────────────────────────────────── */}
      <H2 id="takeaway">Production Takeaways</H2>

      <Note>
        <ul>
          <li>
            <strong>Set summary_large_image as the default:</strong> সোশ্যাল ট্রাফিকের CTR বাড়াতে রুট
            লেআউটেই এটি ডিফল্ট করে দিন।
          </li>
          <li>
            <strong>Reuse the OG image:</strong> X-এর জন্য আলাদা ফাইল না বানিয়ে{" "}
            <code>opengraph-image.tsx</code>-এর একই URL <code>twitter.images</code>-এ পাস করুন।
          </li>
          <li>
            <strong>Validate after deploy:</strong> প্রোডাকশনে যাওয়ার পর X-এর card validator টুল দিয়ে
            প্রিভিউ যাচাই করে নিন — ক্যাশ থাকলে সেখান থেকেই রিফ্রেশ করা যায়।
          </li>
        </ul>
      </Note>
    </article>
  );
}
