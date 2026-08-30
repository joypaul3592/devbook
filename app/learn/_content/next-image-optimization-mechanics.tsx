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
    label: { bn: "৫ MB PNG সরাসরি ব্রাউজারে", en: "A 5 MB PNG straight to the browser" },
  },
  {
    id: "architecture",
    label: {
      bn: "Image Optimization Pipeline",
      en: "The image optimization pipeline",
    },
  },
  {
    id: "mechanisms",
    label: { bn: "৩টি মূল মেকানিক্স", en: "Three core mechanics" },
  },
  {
    id: "implementation",
    label: { bn: "Config ও কম্পোনেন্ট সেটআপ", en: "Config & component setup" },
  },
  {
    id: "matrix",
    label: { bn: "Optimization Comparison", en: "Optimization comparison" },
  },
  {
    id: "takeaway",
    label: { bn: "Production Takeaways", en: "Production takeaways" },
  },
];

export default function NextImageOptimizationMechanics() {
  return (
    <article className="doc-prose">
      {/* ── The problem ───────────────────────────────────────────────── */}
      <H2 id="the-problem" anchorOnly>
        ৫ MB PNG সরাসরি ব্রাউজারে
      </H2>

      <p>
        সকাল ১০:৩০। ভুলু ভাই তার স্পোর্টস নিউজ পোর্টালে ৫ মেগাবাইটের একটি 4K রেজোলিউশনের PNG ব্যানার
        আপলোড করেছেন। মোবাইল ইউজাররা সাইটে প্রবেশ করার পর দেখা গেল কেবল ইমেজটি লোড হতেই ৪ সেকেন্ড সময়
        লাগছে এবং সার্ভারের ব্যান্ডউইথ হু-হু করে শেষ হয়ে যাচ্ছে।
      </p>

      <Line name="ভুলু ভাই">
        ফাহিম! আমি তো ভেবেছিলাম Next.js-এ ছবি আপলোড করলেই সেটা অটোমেটিক ছোট হয়ে যাবে! কিন্তু নেটওয়ার্ক
        ট্যাবে দেখি ইউজার সরাসরি ৫ মেগাবাইটের মূল PNG ফাইলটাই ডাউনলোড করছে। <code>next/image</code>{" "}
        ব্যাকগ্রাউন্ডে কীভাবে কাজ করে?
      </Line>

      <Line name="ফাহিম">
        ভুলু ভাই! আপনি <code>next/image</code> ব্যবহার করলেও হয়তো <code>unoptimized</code> প্রপার্টি
        দিয়ে রেখেছেন, অথবা ইন্টারনাল আর্কিটেকচার না বুঝে প্লেইন URL পাস করেছেন। ট্র্যাডিশনাল{" "}
        <code>&lt;img&gt;</code> ট্যাগ হুবহু অরিজিনাল ফাইলটাই ক্লায়েন্টে পাঠিয়ে দেয়, কোনো অন-দ্য-ফ্লাই
        প্রসেসিং করে না।
      </Line>

      <Line name="নেক্সট-ভাই">
        একদম! <code>next/image</code> কেবল একটি রিঅ্যাক্ট কম্পোনেন্ট নয় — এটি একটি পূর্ণাঙ্গ Image
        Optimization Pipeline ও সার্ভার। ব্রাউজার থেকে কোনো ছবির রিকোয়েস্ট এলে Next.js ইমেজ সার্ভার
        অন-ডিমান্ড ছবিটি রিসাইজ করে, AVIF/WebP ফরম্যাটে কনভার্ট করে এবং ক্যাশিং লেয়ারের মাধ্যমে
        ব্রাউজারে ডেলিভার করে।
      </Line>

      {/* ── Architecture ──────────────────────────────────────────────── */}
      <H2 id="architecture">১. next/image Optimization Pipeline Architecture</H2>

      <Diagram>{`┌─────────────────────────────────────────────────────────────────────────┐
│              NEXT.JS IMAGE OPTIMIZATION PIPELINE ENGINE                 │
└─────────────────────────────────────────────────────────────────────────┘

 Client browser request
 ┌───────────────────────────────────────────────────────────────────────┐
 │ GET /_next/image?url=%2Fhero.png&w=1080&q=75                          │
 └──────────────────────────────────┬────────────────────────────────────┘
                                    │
                                    ▼
 Next.js image optimization server layer
 ┌───────────────────────────────────────────────────────────────────────┐
 │ 1. check the image cache (.next/cache/images)                         │
 └──────────────────────────────────┬────────────────────────────────────┘
                   ┌────────────────┴────────────────┐
                   │                                 │
           [ cache HIT 🟢 ]                   [ cache MISS 🔴 ]
                   │                                 │
                   ▼                                 ▼
 ┌──────────────────────────────────┐ ┌──────────────────────────────────┐
 │ return the cached optimized asset│ │ 1. fetch source asset (5 MB PNG) │
 │ (AVIF/WebP — ~45 KB)             │ │ 2. resize to requested width     │
 │ Cache-Control: public, max-age   │ │ 3. compress to AVIF/WebP (q=75)  │
 └──────────────────────────────────┘ │ 4. save to the disk cache        │
                                      └──────────────────┬───────────────┘
                                                         │
                                                         ▼
                                      ┌──────────────────────────────────┐
                                      │ return the fresh optimized asset │
                                      └──────────────────────────────────┘`}</Diagram>

      {/* ── Mechanisms ────────────────────────────────────────────────── */}
      <H2 id="mechanisms">২. next/image-এর ৩টি মূল অপটিমাইজেশন মেকানিক্স</H2>

      <p>
        <strong>On-demand processing:</strong> বিল্ড টাইমে হাজার হাজার ছবি একসাথে প্রসেস না করে, যখনই
        কোনো ইউজার নির্দিষ্ট স্ক্রিন সাইজে সাইট ভিজিট করে, ঠিক তখনই Next.js সার্ভার ইন্টারনাল{" "}
        <code>sharp</code> ইঞ্জিন দিয়ে ছবিটি প্রসেস করে।
      </p>

      <p>
        <strong>Modern format negotiation (AVIF &amp; WebP):</strong> ব্রাউজারের <code>Accept</code>{" "}
        হেডার চেক করে Next.js সিদ্ধান্ত নেয় ব্রাউজারটি AVIF সাপোর্ট করে নাকি WebP। সাপোর্ট করলে
        অরিজিনাল JPG/PNG-কে স্বয়ংক্রিয়ভাবে কনভার্ট করে ৭০-৮০% সাইজ কমিয়ে ফেলে।
      </p>

      <p>
        <strong>Smart persistent caching:</strong> একবার একটি সাইজ ও ফরম্যাটের ছবি জেনারেট হয়ে গেলে তা
        সার্ভারের ফাইল সিস্টেম ক্যাশে সেভ হয়ে যায়। পরের রিকোয়েস্টগুলোতে পুনরায় প্রসেসিং না করে সরাসরি
        ক্যাশ থেকে রেসপন্স যায়।
      </p>

      {/* ── Implementation ────────────────────────────────────────────── */}
      <H2 id="implementation">৩. Production Code Implementation</H2>

      <H3>❌ Anti-pattern — bypassing the pipeline entirely</H3>

      <CodeBlock filename="components/UnoptimizedHero.tsx">{`// 🔴 POOR PRACTICE: bypasses the Next.js image pipeline
export function UnoptimizedHero() {
  return (
    <div className="w-full">
      {/* 🔴 a native img downloads the full 5 MB payload */}
      <img
        src="https://my-bucket.s3.amazonaws.com/heavy-banner.png"
        alt="Hero banner"
        className="w-full h-auto"
      />
    </div>
  );
}`}</CodeBlock>

      <H3>🟢 Production pattern — pipeline configuration and a tuned component</H3>

      <CodeBlock filename="next.config.mjs">{`// 🟢 STEP 1: configure the image optimization rules
/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    // 🟢 enable AVIF for the highest compression ratio (falls back to WebP)
    formats: ['image/avif', 'image/webp'],
    // 🟢 device breakpoints used to generate the responsive srcSet
    deviceSizes: [640, 750, 828, 1080, 1200, 1920],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    // 🟢 security: allow remote images only from a trusted bucket
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'my-bucket.s3.amazonaws.com',
        port: '',
        pathname: '/**',
      },
    ],
    // 🟢 how long an optimized image stays cached
    minimumCacheTTL: 31536000, // 1 year
  },
};

export default nextConfig;`}</CodeBlock>

      <CodeBlock filename="app/hero/page.tsx">{`// 🟢 STEP 2: the optimized image component
import Image from 'next/image';

export default function OptimizedHeroPage() {
  return (
    <section className="relative w-full max-w-5xl mx-auto p-4 space-y-4">
      <h1 className="text-2xl font-bold text-slate-100">
        Next.js Image Pipeline Demo
      </h1>

      <div className="relative aspect-[16/9] w-full rounded-2xl overflow-hidden bg-slate-900 border border-slate-800">
        <Image
          src="https://my-bucket.s3.amazonaws.com/heavy-banner.png"
          alt="High-performance hero banner"
          fill
          quality={80} // 🟢 the quality-to-size sweet spot (default is 75)
          sizes="(max-width: 640px) 100vw, (max-width: 1200px) 80vw, 1200px"
          placeholder="blur"
          blurDataURL="data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9IiMwZTE3MmEiLz48L3N2Zz4="
          className="object-cover"
        />
      </div>
    </section>
  );
}`}</CodeBlock>

      {/* ── Matrix ────────────────────────────────────────────────────── */}
      <H2 id="matrix">৪. Optimization Comparison Matrix</H2>

      <Table
        head={["বৈশিষ্ট্য", "HTML <img>", "next/image পাইপলাইন"]}
        rows={[
          [
            "ইমেজ ফরম্যাট",
            "অরিজিনাল PNG/JPG ডাউনলোড হয় 🔴",
            "AVIF / WebP স্বয়ংক্রিয় কনভার্সন 🟢",
          ],
          [
            "পেলোড সাইজ",
            "বিশাল (যেমন ৫ MB) 🔴",
            "~৪০-৬০ kB (৮০-৯০% হ্রাস) 🟢",
          ],
          [
            "রেসপন্সিভ সাইজিং",
            "নেই, ম্যানুয়ালি করতে হয় 🔴",
            <span key="d">
              <code>sizes</code> অনুযায়ী srcSet জেনারেট করে 🟢
            </span>,
          ],
          [
            "ক্যাশিং",
            "ব্রাউজার স্ট্যান্ডার্ড ক্যাশ",
            "সার্ভার-লেভেল ডিস্ক ক্যাশ + CDN TTL ⚡",
          ],
        ]}
      />

      <Line name="ভুলু ভাই">
        ওয়াও ফাহিম! <code>next.config.mjs</code>-এ AVIF এনাবল করার পর আর ইন্টারনাল পাইপলাইন চালু হওয়ার
        পর আমার ৫ মেগাবাইটের ছবিটি মাত্র ৪২ কিলোবাইটে নেমে এসেছে!
      </Line>

      {/* ── Takeaways ─────────────────────────────────────────────────── */}
      <H2 id="takeaway">Production Takeaways</H2>

      <Note>
        <ul>
          <li>
            <strong>Leverage formats: [&apos;image/avif&apos;, &apos;image/webp&apos;]:</strong>{" "}
            <code>next.config.mjs</code>-এ AVIF যুক্ত করলে সাধারণ WebP-এর চেয়ে আরও ~২০% ছোট ফাইল সাইজ
            পাওয়া যায়।
          </li>
          <li>
            <strong>Ship the sharp engine in production:</strong> প্রোডাকশন Node.js এনভায়রনমেন্টে
            প্রসেসিংয়ের জন্য <code>sharp</code> প্যাকেজটি ইনস্টল থাকা নিশ্চিত করুন।
          </li>
          <li>
            <strong>Configure remotePatterns strictly:</strong> কখনো সব ডোমেইন অ্যালাউ করবেন না — কেবল
            নিজের CDN বা S3 বাকেটের হোস্টনেম অ্যালাউ করুন।
          </li>
        </ul>
      </Note>
    </article>
  );
}
