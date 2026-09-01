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
      bn: "Export অন করতেই সব ভেঙে গেল",
      en: "Export on, everything broke",
    },
  },
  {
    id: "architecture",
    label: {
      bn: "Static export জেনারেশন ফ্লো",
      en: "The static export flow",
    },
  },
  {
    id: "mechanisms",
    label: { bn: "৩টি আর্কিটেকচারাল কনসেপ্ট", en: "Three architectural concepts" },
  },
  {
    id: "implementation",
    label: {
      bn: "Export কনফিগ ও static params",
      en: "Export config & static params",
    },
  },
  {
    id: "matrix",
    label: { bn: "Runtime vs Static Export", en: "Runtime vs static export" },
  },
  {
    id: "takeaway",
    label: { bn: "Production Takeaways", en: "Production takeaways" },
  },
];

export default function StaticExport() {
  return (
    <article className="doc-prose">
      {/* ── The problem ───────────────────────────────────────────────── */}
      <H2 id="the-problem" anchorOnly>
        Export অন করতেই সব ভেঙে গেল
      </H2>

      <p>
        দুপুর ১:১৫। ভুলু ভাই তার ল্যান্ডিং পেজ ও ব্লগ প্রজেক্টের হোস্টিং খরচ বাঁচানোর জন্য S3 এবং
        Cloudflare Pages-এ ডেপ্লয় করার সিদ্ধান্ত নিলেন। তিনি{" "}
        <code>output: &apos;export&apos;</code> সেট করে বিল্ড দিলেন। কিন্তু বিল্ড কমপ্লিট হতেই তার
        Server Actions, dynamic route <code>[id]</code>, এবং <code>next/image</code> অপটিমাইজেশন সব
        কাজ করা বন্ধ করে দিল!
      </p>

      <Line name="ভুলু ভাই">
        ফাহিম! Static export অন করার পর <code>out/</code> ডিরেক্টরি তো তৈরি হলো, কিন্তু Server Action
        আর ইমেজ অপটিমাইজেশন সব জায়গায় এরর দিচ্ছে কেন?
      </Line>

      <Line name="ফাহিম">
        ভুলু ভাই! কারণ static export মানে হলো আপনার পুরো অ্যাপকে একটি পিওর HTML, CSS ও JS বান্ডেলে
        কনভার্ট করা! এখানে কোনো Node.js সার্ভার রান করার সুযোগ নেই। তাই Node.js রানটাইম-নির্ভর কোনো
        ফিচার — Server Actions, ISR, <code>cookies()</code>, বা নেটিভ <code>next/image</code>{" "}
        অপটিমাইজার — এখানে চলবে না।
      </Line>

      <Line name="নেক্সট-ভাই">
        একদম! Static export হলো Jamstack আর্কিটেকচার। এটি আপনার প্রজেক্টকে স্ট্যাটিক HTML ফাইলে
        রূপান্তর করে অতি-দ্রুত ও জিরো-সার্ভার-কস্টে যেকোনো CDN হোস্টিংয়ে চালাতে সাহায্য করে!
      </Line>

      {/* ── Architecture ──────────────────────────────────────────────── */}
      <H2 id="architecture">১. Static Export Generation Flow</H2>

      <Diagram>{`┌─────────────────────────────────────────────────────────────────────────────┐
│                    NEXT.JS STATIC EXPORT PIPELINE                           │
└─────────────────────────────────────────────────────────────────────────────┘

                  next.config.js → output: 'export'
                               │
                               ▼
                        npm run build
                               │
                               ▼
   prerenders EVERY route into pure HTML/CSS/JS assets
                               │
         ┌─────────────────────┴─────────────────────┐
         ▼                                           ▼
 static routes (/about)                    dynamic routes (/blog/[slug])
 output: out/about.html                    requires generateStaticParams()
                                           output: out/blog/post-1.html
                               │
                               ▼
                  the out/ folder — a deployable bundle
                  (S3, NGINX, Cloudflare Pages, GitHub Pages)`}</Diagram>

      {/* ── Mechanisms ────────────────────────────────────────────────── */}
      <H2 id="mechanisms">২. কোর আর্কিটেকচারাল কনসেপ্ট</H2>

      <p>
        <strong>Pure client-side assets:</strong> <code>output: &apos;export&apos;</code> সেট করলে
        Next.js কোনো Node.js সার্ভার প্রসেস তৈরি করে না। বিল্ড শেষে সম্পূর্ণ প্রজেক্টটি একটি{" "}
        <code>out/</code> ফোল্ডারে জেনারেট হয়, যেখানে শুধুই <code>.html</code>, <code>.css</code>,{" "}
        <code>.js</code> এবং পাবলিক মিডিয়া ফাইল থাকে।
      </p>

      <p>
        <strong>Incompatible server features:</strong> <code>cookies()</code>,{" "}
        <code>headers()</code>, <code>draftMode()</code> — রিকোয়েস্ট ডাইনামিক্স নেই। Server Actions —
        প্রসেস করার মতো ব্যাকএন্ড নেই। ডিফল্ট <code>&lt;Image /&gt;</code> অপটিমাইজেশন — অন-ডিমান্ড
        ইমেজিং ইঞ্জিন অনুপস্থিত। ISR — ব্যাকগ্রাউন্ড রি-জেনারেটর নেই।
      </p>

      <p>
        <strong>generateStaticParams is mandatory:</strong> static export-এ যেকোনো ডাইনামিক রাউট
        থাকলে বিল্ড টাইমেই সমস্ত স্লাগ <code>generateStaticParams</code> দিয়ে রিটার্ন করতে হয়, যেন
        Next.js প্রতিটির জন্য আগাম HTML ফাইল তৈরি করতে পারে।
      </p>

      {/* ── Implementation ────────────────────────────────────────────── */}
      <H2 id="implementation">৩. Production Code Implementation</H2>

      <H3>❌ Anti-pattern — server-only features under export mode</H3>

      <CodeBlock filename="app/products/[id]/page.tsx">{`// 🔴 POOR PRACTICE: server-only dynamic APIs with output: 'export'
// the build will fail outright

import { cookies } from 'next/headers';
import Image from 'next/image';

export default async function ProductDetailPage() {
  // ❌ cookies() has no meaning without a request — the export build stops here
  const cookieStore = await cookies();
  const token = cookieStore.get('session');

  return (
    <div>
      {/* ❌ the default loader needs a Node.js optimizer that does not exist */}
      <Image src="/banner.png" alt="Banner" width={500} height={300} />
    </div>
  );
}`}</CodeBlock>

      <H3>🟢 Production pattern — a fully compatible export</H3>

      <p>
        <strong>Step 1 — export কনফিগ।</strong>
      </p>

      <CodeBlock filename="next.config.js">{`// 🟢 PRODUCTION PATTERN: static export configuration
/** @type {import('next').NextConfig} */
const nextConfig = {
  // 🟢 emits pure static HTML into out/
  output: 'export',

  // makes /about resolve to /about/index.html on plain NGINX or S3
  trailingSlash: true,

  images: {
    // 🟢 there is no Node.js optimizer to call — serve the originals
    unoptimized: true,
  },
};

module.exports = nextConfig;`}</CodeBlock>

      <p>
        <strong>Step 2 — ডাইনামিক রাউটে static params।</strong>
      </p>

      <CodeBlock filename="app/blog/[slug]/page.tsx">{`// 🟢 PRODUCTION PATTERN: every slug enumerated at build time

interface Props {
  params: Promise<{ slug: string }>;
}

// 🟢 mandatory under static export — a slug missing here has no HTML file,
// and the deployed site will 404 on it
export async function generateStaticParams() {
  const posts = [
    { slug: 'getting-started' },
    { slug: 'nextjs-guide' },
    { slug: 'static-export-tutorial' },
  ];

  return posts.map((post) => ({ slug: post.slug }));
}

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params;

  return (
    <article className="p-8 max-w-3xl mx-auto space-y-4">
      <h1 className="text-3xl font-bold capitalize">{slug.replaceAll('-', ' ')}</h1>
      <p className="text-gray-600">
        এই পোস্টটি বিল্ড টাইমে out/blog/{slug}/index.html হিসেবে জেনারেট হয়েছে।
      </p>
    </article>
  );
}`}</CodeBlock>

      <p>
        <strong>Step 3 — ডেপ্লয় স্ক্রিপ্ট।</strong>
      </p>

      <CodeBlock filename="package.json">{`{
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "export:deploy": "next build && npx wrangler pages deploy out"
  }
}`}</CodeBlock>

      {/* ── Matrix ────────────────────────────────────────────────────── */}
      <H2 id="matrix">৪. Node.js Runtime vs Static Export</H2>

      <Table
        head={["বৈশিষ্ট্য", "Node.js runtime (standalone)", "Static export"]}
        rows={[
          [
            "হোস্টিং খরচ",
            "মিডিয়াম — VPS, Docker বা serverless লাগে",
            "প্রায় শূন্য — S3, Cloudflare, GitHub Pages 🟢",
          ],
          [
            "বিল্ড আউটপুট",
            ".next/standalone (Node server assets)",
            "out/ — পিওর HTML/CSS/JS 🟢",
          ],
          ["Server Actions ও SSR", "১০০% সাপোর্টেড 🟢", "সম্পূর্ণ অনুপলব্ধ 🔴"],
          [
            "Image optimization",
            "অটোমেটিক অন-ডিমান্ড 🟢",
            "unoptimized: true বা থার্ড-পার্টি লোডার 🟡",
          ],
          [
            "ডাইনামিক রাউট",
            "রানটাইমে জেনারেট হতে পারে 🟢",
            "generateStaticParams() বাধ্যতামূলক 🟡",
          ],
        ]}
      />

      <Line name="ভুলু ভাই">
        এখন পুরো বিষয় পরিষ্কার ফাহিম! যেসব সাইটে নোড ব্যাকএন্ড লাগে না — ডকুমেন্টেশন বা ল্যান্ডিং পেজ —
        সেখানে static export ব্যবহার করে ফ্রিতে CDN-এ ডেপ্লয় করা যাবে!
      </Line>

      {/* ── Takeaways ─────────────────────────────────────────────────── */}
      <H2 id="takeaway">Production Takeaways</H2>

      <Note>
        <ul>
          <li>
            <strong>Use export for docs and marketing sites:</strong> পোর্টফোলিও, ডকস, ব্লগ বা
            ল্যান্ডিং পেজের জন্য static export করে CDN-এ হোস্ট করাই সেরা সমাধান।
          </li>
          <li>
            <strong>Turn on unoptimized images:</strong> ডিফল্ট ইমেজ প্রসেসর কাজ করে না, তাই{" "}
            <code>images.unoptimized: true</code> দিতে ভুলবেন না — অথবা Cloudinary-র মতো একটি কাস্টম
            লোডার কনফিগার করুন।
          </li>
          <li>
            <strong>Move dynamic work to the client:</strong> ফর্ম সাবমিশন বা ডাইনামিক ফিল্টারিং লাগলে
            ক্লায়েন্ট-সাইড <code>fetch()</code> দিয়ে সরাসরি এক্সটার্নাল REST/GraphQL ব্যাকএন্ডে হিট
            করুন।
          </li>
        </ul>
      </Note>
    </article>
  );
}
