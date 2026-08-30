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
    label: { bn: "CLS ০.৪৫ — লেআউট লাফাচ্ছে", en: "CLS 0.45 — the layout jumps" },
  },
  {
    id: "architecture",
    label: {
      bn: "Traditional asset বনাম Next.js পাইপলাইন",
      en: "Traditional assets vs the Next.js pipeline",
    },
  },
  {
    id: "mechanisms",
    label: { bn: "৩টি মূল মেকানিজম", en: "Three core mechanisms" },
  },
  {
    id: "implementation",
    label: { bn: "next/font ও next/image সেটআপ", en: "next/font & next/image setup" },
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

export default function ImageFontOptimization() {
  return (
    <article className="doc-prose">
      {/* ── The problem ───────────────────────────────────────────────── */}
      <H2 id="the-problem" anchorOnly>
        CLS ০.৪৫ — লেআউট লাফাচ্ছে
      </H2>

      <p>
        দুপুর ২:৪৫। ভুলু ভাই তার নতুন নিউজ পোর্টালে Lighthouse অডিট রান করেছেন। রিপোর্টে দেখা গেল
        Cumulative Layout Shift (CLS) স্কোর ০.৪৫ — অর্থাৎ পেজ লোড হওয়ার পর যখন ফন্ট আর ইমেজগুলো রেন্ডার
        হয়, তখন টেক্সট ও লেআউট ১০০ পিক্সেল নিচে লাফিয়ে ওঠে।
      </p>

      <Line name="ভুলু ভাই">
        ফাহিম! পেজটা ওপেন করার সাথে সাথে একরকম দেখায়, আর গুগল ফন্ট ও ব্যানার ইমেজ লোড হওয়া মাত্র পুরো
        লেআউট নিচে লাফিয়ে ওঠে! ইউজার কোনো বাটনে ক্লিক করতে গেলে ভুল করে অন্য জায়গায় ক্লিক লেগে যাচ্ছে।
        এই ফ্লিকারিং ও লেআউট জাম্প বন্ধ করার উপায় কী?
      </Line>

      <Line name="ফাহিম">
        ভুলু ভাই! কারণ আপনি ট্র্যাডিশনাল <code>&lt;img&gt;</code> ট্যাগ এবং গুগল ফন্টের জন্য বাইরের{" "}
        <code>&lt;link&gt;</code> ব্যবহার করেছেন। ট্র্যাডিশনাল ইমেজ ডাউনলোড হওয়ার আগ পর্যন্ত ব্রাউজার
        তার জন্য কোনো জায়গা রিজার্ভ করে না, আর এক্সটার্নাল ফন্ট ডাইনামিকালি লোড হওয়ার সময় FOUT (Flash
        of Unstyled Text) তৈরি করে টেক্সটের সাইজ বদলে দেয়।
      </Line>

      <Line name="নেক্সট-ভাই">
        একদম! সমাধান হলো <code>next/image</code> এবং <code>next/font</code>।{" "}
        <code>next/font</code> বিল্ড-টাইমে ফন্ট ডাউনলোড করে স্থানীয়ভাবে হোস্ট করে এবং font metric
        adjustment-এর মাধ্যমে শূন্য লেআউট শিফট নিশ্চিত করে। আর <code>next/image</code> ইমেজের সঠিক
        ডাইমেনশন ও aspect ratio লক করে দিয়ে এবং অটোমেটিক WebP/AVIF ফরম্যাটে কনভার্ট করে CLS শূন্যে
        নামিয়ে আনে।
      </Line>

      {/* ── Architecture ──────────────────────────────────────────────── */}
      <H2 id="architecture">
        ১. Traditional Assets vs. Next.js Optimized Image &amp; Font Pipeline
      </H2>

      <Diagram>{`┌─────────────────────────────────────────────────────────────────────────┐
│     TRADITIONAL ASSETS VS. NEXT.JS OPTIMIZED IMAGE & FONT PIPELINE      │
└─────────────────────────────────────────────────────────────────────────┘

 ❌ TRADITIONAL UNSIZED ASSETS (causes heavy CLS)
 Page hydration starts
 ┌───────────────────────────────────────────────────────────────────────┐
 │ 1. text renders in a fallback font (height: 20px)                     │
 │ 2. the banner <img> is fetched with unknown height (0px reserved)     │
 └──────────────────────────────────┬────────────────────────────────────┘
                                    │ assets arrive a second later
                                    ▼
 ┌───────────────────────────────────────────────────────────────────────┐
 │ 1. external font arrives ──► text height becomes 28px (text shifts)   │
 │ 2. image arrives ──► suddenly takes 400px (content pushed down)       │
 └───────────────────────────────────────────────────────────────────────┘
                                    ▼
                     🔴 HIGH CLS (0.45) & BAD USER EXPERIENCE

───────────────────────────────────────────────────────────────────────────

 🟢 NEXT.JS OPTIMIZED PIPELINE (zero layout shift)
 Build time & hydration
 ┌───────────────────────────────────────────────────────────────────────┐
 │ 1. next/font self-hosts the font and aligns fallback metrics          │
 │ 2. next/image reserves the exact aspect ratio in CSS BEFORE load      │
 └──────────────────────────────────┬────────────────────────────────────┘
                                    │ the asset arrives smoothly
                                    ▼
 ┌───────────────────────────────────────────────────────────────────────┐
 │ content fades in without shifting a single pixel                      │
 └───────────────────────────────────────────────────────────────────────┘
                                    ▼
                     🟢 ZERO CLS (0.00) & A CLEAN LIGHTHOUSE RUN`}</Diagram>

      {/* ── Mechanisms ────────────────────────────────────────────────── */}
      <H2 id="mechanisms">২. Image &amp; Font Optimization-এর ৩টি মূল মেকানিজম</H2>

      <p>
        <strong>Build-time font inlining &amp; metric overrides:</strong>{" "}
        <code>next/font/google</code> ব্যবহার করলে বিল্ডের সময় Next.js গুগল থেকে ফন্ট ফাইলগুলো নিজেই
        ডাউনলোড করে আপনার সার্ভারে সেভ করে নেয় (জিরো এক্সটার্নাল CDN রাউন্ড-ট্রিপ)। এছাড়া ফলব্যাক ফন্টের
        সাথে আসল ফন্টের সাইজ মেলাতে <code>size-adjust</code> প্রপার্টি অটো-ইনজেক্ট করে, ফলে FOUT বন্ধ
        হয়ে যায়।
      </p>

      <p>
        <strong>Automatic aspect-ratio reserving:</strong> <code>next/image</code>-এ{" "}
        <code>width</code> ও <code>height</code> অথবা <code>fill</code> প্রপার্টি ব্যবহার করলে সঠিক
        অনুপাতে CSS aspect ratio লক হয়ে যায়। ইমেজটি ব্যাকগ্রাউন্ডে লোড হতে থাকলেও লেআউট নড়ে না।
      </p>

      <p>
        <strong>On-the-fly modern format conversion &amp; responsive sizing:</strong> Next.js
        স্বয়ংক্রিয়ভাবে ইমপোর্ট করা PNG/JPG-কে AVIF বা WebP ফরম্যাটে কম্প্রেস করে, আর{" "}
        <code>sizes</code> অ্যাট্রিবিউটের মাধ্যমে মোবাইলে ছোট ও ডেস্কটপে বড় সাইজের ইমেজ সার্ভ করে।
      </p>

      {/* ── Implementation ────────────────────────────────────────────── */}
      <H2 id="implementation">৩. Production Code Implementation</H2>

      <H3>❌ Anti-pattern — external font link and an unsized image</H3>

      <CodeBlock filename="app/article/legacy-page.tsx">{`// 🔴 POOR PRACTICE: external network calls, layout shifts, and heavy payloads
export function UnoptimizedArticle() {
  return (
    <div>
      {/* 🔴 anti-pattern 1: an external CSS font dependency */}
      <link
        href="https://fonts.googleapis.com/css2?family=Inter:wght@400;700&display=swap"
        rel="stylesheet"
      />

      {/* 🔴 anti-pattern 2: a plain img with no aspect-ratio reservation causes high CLS */}
      <img src="/heavy-banner.png" alt="Unoptimized banner" className="w-full" />

      <p style={{ fontFamily: 'Inter, sans-serif' }}>
        This text jumps when the Google font finally arrives over the network.
      </p>
    </div>
  );
}`}</CodeBlock>

      <H3>🟢 Production pattern — next/font setup and an optimized next/image</H3>

      <CodeBlock filename="lib/fonts.ts">{`// 🟢 STEP 1: centralized font configuration
import { Inter, Fira_Code } from 'next/font/google';

// 🟢 self-hosted at build time, zero runtime requests to Google
export const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter', // a CSS variable for Tailwind
});

export const firaCode = Fira_Code({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-fira-code',
});`}</CodeBlock>

      <CodeBlock filename="app/layout.tsx">{`// 🟢 STEP 2: root layout integration
import { inter, firaCode } from '@/lib/fonts';
import './globals.css';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={\`\${inter.variable} \${firaCode.variable}\`}>
      <body className="font-sans bg-slate-950 text-slate-100 antialiased">
        {children}
      </body>
    </html>
  );
}`}</CodeBlock>

      <CodeBlock filename="app/article/page.tsx">{`// 🟢 STEP 3: the optimized page component
import Image from 'next/image';

export default function OptimizedArticlePage() {
  return (
    <div className="p-8 max-w-2xl mx-auto space-y-6">
      <div className="space-y-2">
        <span className="text-xs font-mono text-indigo-400">
          FONT: FIRA CODE INJECTED VIA NEXT/FONT
        </span>
        <h1 className="text-3xl font-bold tracking-tight">
          Zero Cumulative Layout Shift
        </h1>
        <p className="text-slate-400 text-sm">
          Images and fonts are fully isolated from causing layout flicker.
        </p>
      </div>

      {/* 🟢 STEP 4: fill + an aspect-ratio wrapper + responsive sizes */}
      <div className="relative aspect-[16/9] w-full rounded-xl overflow-hidden bg-slate-900 border border-slate-800">
        <Image
          src="/article-hero.jpg"
          alt="Abstract digital art"
          fill
          priority // 🟢 priority fetch for the above-the-fold hero image
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 800px"
          placeholder="blur"
          blurDataURL="data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9IiMxZTFiMjYiLz48L3N2Zz4="
          className="object-cover"
        />
      </div>

      <p className="text-slate-300 text-sm leading-relaxed">
        The layout above stays perfectly stationary while the image hydrates behind a
        CSS blur placeholder.
      </p>
    </div>
  );
}`}</CodeBlock>

      {/* ── Matrix ────────────────────────────────────────────────────── */}
      <H2 id="matrix">৪. Optimization Comparison Matrix</H2>

      <Table
        head={[
          "বৈশিষ্ট্য",
          "Traditional <img> / external font",
          "next/image ও next/font",
        ]}
        rows={[
          [
            "ফন্ট ফেচিং",
            "এক্সটার্নাল CDN থেকে রানটাইমে ডাউনলোড 🔴",
            "বিল্ড-টাইমে ডাউনলোড হয়ে প্রজেক্টে সেল্ফ-হোস্টেড 🟢",
          ],
          [
            "ফন্ট ফ্লিকারিং (FOUT/FOIT)",
            "দৃশ্যমান লেআউট জাম্প ও টেক্সট ফ্লিকার 🔴",
            "size-adjust মেট্রিকের মাধ্যমে জিরো ফ্লিকারিং ⚡",
          ],
          [
            "ইমেজ ফরম্যাট",
            "ম্যানুয়ালি ক্রপ বা কনভার্ট করতে হয় (JPG/PNG)",
            "স্বয়ংক্রিয়ভাবে AVIF/WebP-তে রূপান্তর ⚡",
          ],
          [
            "CLS প্রভাব",
            "উচ্চ (0.3 – 0.6)",
            "প্রায় শূন্য (0.00) 🟢",
          ],
        ]}
      />

      <Line name="ভুলু ভাই">
        ফ্যান্টাস্টিক! <code>next/font</code> আর <code>next/image</code>-এর aspect ratio প্লেসহোল্ডার
        দেওয়ার পর আমার পেজের CLS ০.৪৫ থেকে সোজা ০.০০ হয়ে গেছে! কোনো ফন্ট বা ইমেজ লোড হওয়ার সময় পেজ আর
        এক পিক্সেলও নড়ছে না।
      </Line>

      {/* ── Takeaways ─────────────────────────────────────────────────── */}
      <H2 id="takeaway">Production Takeaways</H2>

      <Note>
        <ul>
          <li>
            <strong>Always use next/font for web fonts:</strong> কখনো <code>&lt;link&gt;</code> ট্যাগ
            দিয়ে Google Fonts আনবেন না — <code>next/font</code> ব্যবহার করলে থার্ড-পার্টি ট্র্যাকিং
            থাকে না এবং জিরো CDN লেটেন্সিতে ফন্ট লোড হয়।
          </li>
          <li>
            <strong>Never omit image sizing constraints:</strong> <code>next/image</code>-এ ফিক্সড{" "}
            <code>width</code>/<code>height</code> দিন, অথবা রেসপন্সিভ ক্ষেত্রে প্যারেন্ট ডিভে{" "}
            <code>aspect-[ratio]</code> সেট করে <code>fill</code> ব্যবহার করুন।
          </li>
          <li>
            <strong>Always define responsive sizes:</strong> <code>fill</code> দেওয়া ইমেজে অবশ্যই{" "}
            <code>sizes</code> প্রপ উল্লেখ করুন, যেন মোবাইল ডিভাইসে 4K রেজোলিউশনের ছবি ডাউনলোড না হয়।
          </li>
        </ul>
      </Note>
    </article>
  );
}
