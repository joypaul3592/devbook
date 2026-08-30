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
    label: { bn: "মোবাইলে 4K ছবি নামছে", en: "A 4K image on a phone" },
  },
  {
    id: "architecture",
    label: {
      bn: "Responsive image পাইপলাইন",
      en: "The responsive image pipeline",
    },
  },
  {
    id: "mechanisms",
    label: { bn: "৩টি প্রধান স্তম্ভ", en: "Three pillars" },
  },
  {
    id: "implementation",
    label: { bn: "AVIF/WebP ও sizes সেটআপ", en: "AVIF/WebP & sizes setup" },
  },
  {
    id: "matrix",
    label: { bn: "Format & Sizing Comparison", en: "Format & sizing comparison" },
  },
  {
    id: "takeaway",
    label: { bn: "Production Takeaways", en: "Production takeaways" },
  },
];

export default function ImageMediaOptimization() {
  return (
    <article className="doc-prose">
      {/* ── The problem ───────────────────────────────────────────────── */}
      <H2 id="the-problem" anchorOnly>
        মোবাইলে 4K ছবি নামছে
      </H2>

      <p>
        সন্ধ্যা ৭:১০। ভুলু ভাই তার স্পোর্টস সাইটে হাই-রেজোলিউশন ম্যাচ ফটো যুক্ত করেছেন। ডেস্কটপে সুন্দর
        দেখালেও মোবাইল ইউজাররা সাইট রিফ্রেশ করতেই ডাটা প্যাক শেষ হয়ে যাচ্ছে — ৩৯০ পিক্সেলের স্ক্রিনেও
        ৩৮৪০ পিক্সেলের 4K ছবি ডাউনলোড হচ্ছে।
      </p>

      <Line name="ভুলু ভাই">
        ফাহিম! ইউজার মোবাইল দিয়ে ঢুকেছে ৩৯০ পিক্সেলের স্ক্রিনে, অথচ ব্যাকগ্রাউন্ডে ব্রাউজার ৩৮৪০
        পিক্সেলের মেগা-সাইজ ছবি নামাচ্ছে! রেসপন্সিভ ইমেজের জন্য কি আমাকে ২০টা সাইজের ছবি ফটোশপে
        ম্যানুয়ালি ক্রপ করে আপলোড করতে হবে?
      </Line>

      <Line name="ফাহিম">
        ভুলু ভাই! একদমই না। আধুনিক ওয়েব আর্কিটেকচারে ম্যানুয়াল ক্রপিং বা রিসাইজিং অপ্রয়োজনীয় — দরকার
        Dynamic Responsive Image Architecture এবং next-gen ইমেজ ফরম্যাট (AVIF/WebP)।
      </Line>

      <Line name="নেক্সট-ভাই">
        একদম! <code>next/image</code> কেবল সাইজ ছোট করে না — এটি ইউজারের ডিভাইস ভিউপোর্ট বুঝে{" "}
        <code>srcset</code> ও <code>sizes</code> দিয়ে ডাইনামিক সাইজিং জেনারেট করে। ফলে মোবাইল পাবে ৩৯০
        পিক্সেলের ~৪০ kB ছবি, আর 4K মনিটর পাবে বড় ক্লিয়ার ছবি — সম্পূর্ণ অটোমেটিক।
      </Line>

      {/* ── Architecture ──────────────────────────────────────────────── */}
      <H2 id="architecture">১. Dynamic Responsive Image Pipeline &amp; Format Hierarchy</H2>

      <Diagram>{`┌─────────────────────────────────────────────────────────────────────────┐
│             RESPONSIVE IMAGE & FORMAT OPTIMIZATION PIPELINE             │
└─────────────────────────────────────────────────────────────────────────┘

 Original image (5 MB PNG / JPG)
                 │
                 ▼
 Next.js image optimization server (sharp engine)
 ┌───────────────────────────────────────────────────────────────────────┐
 │ 1. negotiates modern formats (AVIF > WebP > original JPG/PNG)         │
 │ 2. generates the responsive set (srcset: 640w, 750w, 1080w, 1920w)    │
 └──────────────────────────────────┬────────────────────────────────────┘
                                    │
           ┌────────────────────────┴────────────────────────┐
           │                                                 │
   Mobile device (390px)                            4K monitor (3840px)
   ┌──────────────────────────────┐                ┌──────────────────────────────┐
   │ downscaled & compressed      │                │ high-res scaled image        │
   │ format: AVIF                 │                │ format: WebP                 │
   │ payload: ~35 KB ⚡           │                │ payload: ~280 KB ⚡          │
   └──────────────────────────────┘                └──────────────────────────────┘`}</Diagram>

      {/* ── Mechanisms ────────────────────────────────────────────────── */}
      <H2 id="mechanisms">২. ইমেজিং আর্কিটেকচারের ৩টি প্রধান স্তম্ভ</H2>

      <p>
        <strong>Next-gen compression (AVIF vs WebP):</strong> AVIF ভিজ্যুয়াল কোয়ালিটি নষ্ট না করে
        JPEG-এর চেয়ে প্রায় ৭০% এবং WebP-এর চেয়ে ~২০% বেশি কম্প্রেশন দেয়; WebP হলো সর্বজনীন আধুনিক
        ফরম্যাট, যা প্রায় সব ব্রাউজারে সাপোর্টেড।
      </p>

      <p>
        <strong>Responsive dynamic sizing (srcset + sizes):</strong> <code>sizes</code> প্রপের মাধ্যমে
        ব্রাউজারকে জানানো হয় কোন ব্রেকপয়েন্টে ছবিটি স্ক্রিনের কত অংশ জুড়ে থাকবে (যেমন{" "}
        <code>(max-width: 768px) 100vw, 50vw</code>) — ব্রাউজার তখন সঠিক সাইজের ভ্যারিয়েন্ট বেছে নেয়।
      </p>

      <p>
        <strong>Aspect ratio preservation &amp; blur placeholders:</strong> <code>fill</code> বা
        নির্দিষ্ট aspect ratio দিয়ে জায়গা রিজার্ভ করে এবং <code>placeholder=&quot;blur&quot;</code>{" "}
        ব্যবহার করে লোডিংয়ের সময় CLS শূন্যে রাখা হয়।
      </p>

      {/* ── Implementation ────────────────────────────────────────────── */}
      <H2 id="implementation">৩. Production Code Implementation</H2>

      <H3>❌ Anti-pattern — one fixed, uncompressed asset for everyone</H3>

      <CodeBlock filename="components/UnoptimizedMediaCard.tsx">{`// 🔴 POOR PRACTICE: one large image with no responsive breakpoint logic
export function UnoptimizedMediaCard() {
  return (
    <div className="w-full">
      {/* 🔴 mobile browsers are forced to download the full 4K asset */}
      <img
        src="https://cdn.sportsnews.com/heavy-stadium-photo.jpg"
        alt="Stadium view"
        style={{ width: '100%', height: 'auto' }}
      />
    </div>
  );
}`}</CodeBlock>

      <H3>🟢 Production pattern — AVIF/WebP with a responsive media engine</H3>

      <CodeBlock filename="next.config.mjs">{`// 🟢 STEP 1: enable AVIF support and device breakpoints
/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    // 🟢 priority order: AVIF first, then WebP, then the original
    formats: ['image/avif', 'image/webp'],
    // 🟢 breakpoints Next.js uses to auto-generate the responsive srcset
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    minimumCacheTTL: 31536000, // one year of disk/CDN caching
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'cdn.sportsnews.com',
      },
    ],
  },
};

export default nextConfig;`}</CodeBlock>

      <CodeBlock filename="app/gallery/page.tsx">{`// 🟢 STEP 2: the optimized responsive media component
import Image from 'next/image';

export default function OptimizedGalleryCard() {
  return (
    <article className="max-w-4xl mx-auto space-y-4 p-4">
      <h2 className="text-xl font-bold text-slate-100">
        ম্যাচ ডে গ্যালারি — শের-ই-বাংলা স্টেডিয়াম
      </h2>

      {/* 🟢 the container locks the aspect ratio, preventing CLS */}
      <div className="relative aspect-[16/9] w-full rounded-2xl overflow-hidden bg-slate-900 border border-slate-800">
        <Image
          src="https://cdn.sportsnews.com/heavy-stadium-photo.jpg"
          alt="Packed stadium crowd"
          fill
          // 🟢 crucial: tells the browser how much space the image occupies per breakpoint
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 75vw, 1200px"
          quality={80} // 🟢 the clarity-vs-size sweet spot
          placeholder="blur"
          // 🟢 an inline base64 SVG shown instantly while the AVIF is fetched
          blurDataURL="data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9IiMwZjE3MmEiLz48L3N2Zz4="
          className="object-cover hover:scale-105 transition-transform duration-500"
        />
      </div>
    </article>
  );
}`}</CodeBlock>

      {/* ── Matrix ────────────────────────────────────────────────────── */}
      <H2 id="matrix">৪. Format &amp; Dynamic Sizing Comparison Matrix</H2>

      <Table
        head={["বৈশিষ্ট্য", "অরিজিনাল JPG / PNG", "WebP", "AVIF"]}
        rows={[
          ["ফাইল সাইজ", "৫.০ MB (100%) 🔴", "~৪৫০ kB 🟡", "~২৮০ kB 🟢"],
          [
            "ভিজ্যুয়াল কোয়ালিটি",
            "০% লস",
            "সামান্য (১-২%)",
            "চোখে না পড়ার মতো 🟢",
          ],
          [
            "রেসপন্সিভ হ্যান্ডলিং",
            <span key="c">
              ম্যানুয়াল <code>&lt;picture&gt;</code> ট্যাগ
            </span>,
            <span key="d">
              <code>next/image</code> auto-srcset
            </span>,
            <span key="e">
              <code>sizes</code>-ভিত্তিক ডাইনামিক ফেচ 🟢
            </span>,
          ],
          [
            "Layout shift",
            "উচ্চ CLS রিস্ক 🔴",
            <span key="d">
              <code>fill</code>/aspect-ratio দিয়ে ০.০০
            </span>,
            "blur placeholder সহ ০.০০ 🟢",
          ],
        ]}
      />

      <Line name="ভুলু ভাই">
        দুর্দান্ত ফাহিম! <code>next.config.mjs</code>-এ AVIF যুক্ত করে আর সঠিক <code>sizes</code>{" "}
        বসিয়ে দেওয়ার পর মোবাইলে এখন মাত্র ৩৫ কিলোবাইটের ছবি নামছে! কোয়ালিটি একটুও কমেনি, লোডিং হয়েছে
        রকেটের মতো।
      </Line>

      {/* ── Takeaways ─────────────────────────────────────────────────── */}
      <H2 id="takeaway">Production Takeaways</H2>

      <Note>
        <ul>
          <li>
            <strong>Always order AVIF first:</strong>{" "}
            <code>formats: [&apos;image/avif&apos;, &apos;image/webp&apos;]</code> লিখলে আধুনিক
            ব্রাউজার AVIF নেবে, পুরনোগুলো WebP-তে ফলব্যাক করবে।
          </li>
          <li>
            <strong>Never miss the sizes attribute:</strong> <code>fill</code> ব্যবহার করলে{" "}
            <code>sizes</code> বাধ্যতামূলক — না দিলে ব্রাউজার ধরে নেয় ছবিটি পুরো স্ক্রিন জুড়ে দেখাবে ও
            অহেতুক বড় ফাইল নামায়।
          </li>
          <li>
            <strong>Use inline SVG base64 placeholders:</strong> লাইটওয়েট base64 SVG প্লেসহোল্ডার কোনো
            এক্সটার্নাল রিকোয়েস্ট ছাড়াই ইনস্ট্যান্ট blur এফেক্ট দেয়।
          </li>
        </ul>
      </Note>
    </article>
  );
}
