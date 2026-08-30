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
    label: { bn: "TBT ৮৫০ মিলিসেকেন্ড", en: "850 ms of blocking time" },
  },
  {
    id: "architecture",
    label: {
      bn: "Main thread blocking বনাম optimized",
      en: "Main-thread blocking vs optimized",
    },
  },
  {
    id: "mechanisms",
    label: { bn: "৩টি মূল টেকনিক", en: "Three core techniques" },
  },
  {
    id: "implementation",
    label: { bn: "@next/third-parties সেটআপ", en: "@next/third-parties setup" },
  },
  {
    id: "matrix",
    label: { bn: "Strategy Comparison", en: "Strategy comparison" },
  },
  {
    id: "takeaway",
    label: { bn: "Production Takeaways", en: "Production takeaways" },
  },
];

export default function ThirdPartyScriptPerformance() {
  return (
    <article className="doc-prose">
      {/* ── The problem ───────────────────────────────────────────────── */}
      <H2 id="the-problem" anchorOnly>
        TBT ৮৫০ মিলিসেকেন্ড
      </H2>

      <p>
        বিকেল ৫:৪৫। মার্কেটিং টিম পেজে Google Analytics (GA4), Meta Pixel, Google AdSense এবং Hotjar
        ট্র্যাকিং স্ক্রিপ্ট যুক্ত করার পর ব্রাউজারের Total Blocking Time (TBT) এক লাফে ৮৫০ মিলিসেকেন্ডে
        উঠে গেছে।
      </p>

      <Line name="ভুলু ভাই">
        ফাহিম! এই অ্যানালিটিক্স আর অ্যাডের স্ক্রিপ্টগুলো ক্লায়েন্ট-সাইড মেইন থ্রেডকে সম্পূর্ণ ফ্রিজ করে
        দিচ্ছে! ইউজাররা ক্লিকে কোনো রেসপন্স পাচ্ছে না, আর PageSpeed Insights-এ INP ও TBT স্কোর লালে
        লাল।
      </Line>

      <Line name="ফাহিম">
        ভুলু ভাই! থার্ড-পার্টি অ্যাড ও ট্র্যাকিং স্ক্রিপ্টগুলো বিশাল ভারী JavaScript রান করায়। প্রোপার
        স্ট্র্যাটেজি ছাড়া লোড করলে ব্রাউজারের CPU মেইন থ্রেড ব্লক হয়ে যায়, ফলে ইউজার ইন্টার‌অ্যাকশন
        (বাটন ক্লিক, ইনপুট টাইপ) করতে গেলে অ্যাপ আটকে থাকে।
      </Line>

      <Line name="নেক্সট-ভাই">
        একদম! সমাধান তিনটি — ১. <code>@next/third-parties</code> প্যাকেজের অফিশিয়াল বিল্ট-ইন কম্পোনেন্ট
        ব্যবহার করা, ২. <code>next/script</code>-এর <code>lazyOnload</code> ও worker এক্সিকিউশন
        নিশ্চিত করা, এবং ৩. ভারী অ্যাডসেন্স ও ভিডিও এমবেডে Facade Pattern অ্যাপ্লাই করা — যাতে ক্লিক
        করার আগে ভারী স্ক্রিপ্ট ফেচই না হয়।
      </Line>

      {/* ── Architecture ──────────────────────────────────────────────── */}
      <H2 id="architecture">১. Main Thread Blocking vs. Optimized Script Architecture</H2>

      <Diagram>{`┌─────────────────────────────────────────────────────────────────────────┐
│           THIRD-PARTY SCRIPT EXECUTION & MAIN THREAD IMPACT             │
└─────────────────────────────────────────────────────────────────────────┘

 ❌ UNOPTIMIZED THIRD-PARTY SCRIPTS (main thread blocked)
 HTML download ──► parse HTML ──► exec GA4 JS (200 ms) ──► exec AdSense JS (400 ms)
                                                                 │
                                                                 ▼
                              🔴 MAIN THREAD FREEZES (TBT: 850 ms, INP: poor)

───────────────────────────────────────────────────────────────────────────

 🟢 OPTIMIZED WITH @next/third-parties & A LAZY STRATEGY
 HTML download ──► parse HTML & hydrate the React app (main thread free) ⚡
                                       │
                                       ▼
                     [ browser idle / post-hydration ]
                     ├── GA4 / GTM via @next/third-parties (non-blocking)
                     └── AdSense / chatbot via the lazyOnload strategy 🟢`}</Diagram>

      {/* ── Mechanisms ────────────────────────────────────────────────── */}
      <H2 id="mechanisms">২. থার্ড-পার্টি স্ক্রিপ্ট অপটিমাইজেশনের ৩টি মূল টেকনিক</H2>

      <p>
        <strong>The official @next/third-parties library:</strong> এই প্যাকেজে Google Tag Manager,
        Google Analytics, YouTube Embed এবং Google Maps-এর জন্য আগে থেকেই অপটিমাইজড রিঅ্যাক্ট
        কম্পোনেন্ট আছে, যেগুলো পারফরম্যান্স বেস্ট-প্র্যাকটিস মেনে স্ক্রিপ্ট লোড করে।
      </p>

      <p>
        <strong>Facade pattern for heavy embeds:</strong> ভিডিও বা অ্যাডের ভারী এমবেড সাথে সাথে না এনে
        কেবল একটি পোস্টার ইমেজ বা স্কেলিটন দেখানো; ইউজার ক্লিক করলে তবেই মূল ভারী প্লেয়ার স্ক্রিপ্ট
        লোড হয়।
      </p>

      <p>
        <strong>Offloading to web workers:</strong> ভারী মার্কেটিং ট্র্যাকারগুলোকে{" "}
        <code>strategy=&quot;worker&quot;</code> (Partytown) দিয়ে মেইন UI থ্রেড থেকে সম্পূর্ণ বিচ্ছিন্ন
        করে আলাদা worker থ্রেডে এক্সিকিউট করানো।
      </p>

      {/* ── Implementation ────────────────────────────────────────────── */}
      <H2 id="implementation">৩. Production Code Implementation</H2>

      <H3>❌ Anti-pattern — heavy scripts injected straight into head</H3>

      <CodeBlock filename="app/legacy-third-parties.tsx">{`// 🔴 POOR PRACTICE: raw script injection blocks the parser and the main thread
export function UnoptimizedThirdParties() {
  return (
    <head>
      {/* 🔴 heavy downloads block FCP and freeze the UI thread */}
      <script src="https://www.googletagmanager.com/gtag/js?id=G-XYZ123456" async />
      <script src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js" async />
    </head>
  );
}`}</CodeBlock>

      <H3>🟢 Production pattern — @next/third-parties and a lazy script architecture</H3>

      <CodeBlock filename="terminal">{`# 🟢 STEP 1: install the official Next.js third-parties package
npm install @next/third-parties@latest`}</CodeBlock>

      <CodeBlock filename="app/layout.tsx">{`// 🟢 STEP 2: integrate Analytics and Tag Manager in the root layout
import { GoogleAnalytics, GoogleTagManager } from '@next/third-parties/google';
import Script from 'next/script';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="bg-slate-950 text-slate-100 antialiased min-h-screen">
        {children}

        {/* 🟢 STEP 3: optimized GA4 — zero main-thread blocking, auto-deferred */}
        <GoogleAnalytics gaId="G-XYZ123456" />

        {/* 🟢 STEP 4: the optimized Google Tag Manager wrapper */}
        <GoogleTagManager gtmId="GTM-ABC1234" />

        {/* 🟢 STEP 5: lazily load the AdSense / ad script */}
        <Script
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-123456789"
          strategy="lazyOnload" // 🟢 loads strictly during browser idle time
          crossOrigin="anonymous"
        />
      </body>
    </html>
  );
}`}</CodeBlock>

      <CodeBlock filename="app/sports/video/page.tsx">{`// 🟢 STEP 6: the facade pattern for heavy YouTube embeds
import { YouTubeEmbed } from '@next/third-parties/google';

export default function VideoArticlePage() {
  return (
    <div className="p-6 max-w-3xl mx-auto space-y-4">
      <h1 className="text-2xl font-bold">Match Highlights — Final Over</h1>

      {/* 🟢 a facade embed: the 1 MB+ player JS loads only on the play click */}
      <div className="rounded-xl overflow-hidden border border-slate-800 aspect-video">
        <YouTubeEmbed videoid="dQw4w9WgXcQ" height={400} params="controls=1" />
      </div>
    </div>
  );
}`}</CodeBlock>

      {/* ── Matrix ────────────────────────────────────────────────────── */}
      <H2 id="matrix">৪. Third-Party Script Strategy Comparison Matrix</H2>

      <Table
        head={["স্ট্র্যাটেজি", "TBT", "INP / responsiveness", "বাস্তবায়ন"]}
        rows={[
          [
            "Standard raw <script>",
            "৪০০–১০০০+ ms 🔴",
            "স্লো ও আনরেসপন্সিভ 🔴",
            <code key="d">{'<script src="..." />'}</code>,
          ],
          [
            <code key="c">@next/third-parties</code>,
            "১০–৩০ ms 🟢",
            "ইনস্ট্যান্ট 🟢",
            <code key="d">@next/third-parties/google</code>,
          ],
          [
            <code key="c">strategy=&quot;lazyOnload&quot;</code>,
            "~০ ms (idle-time execution) 🟢",
            "স্মুথ 🟢",
            <code key="d">next/script</code>,
          ],
          [
            "Facade embed",
            "~০ ms (post-click execution) 🟢",
            "পারফেক্ট ⚡",
            <code key="d">YouTubeEmbed</code>,
          ],
        ]}
      />

      <Line name="ভুলু ভাই">
        আমেজিং ফাহিম! <code>@next/third-parties</code> আর <code>lazyOnload</code> ব্যবহারের পর GA4 আর
        অ্যাডসেন্স চালু থাকা সত্ত্বেও TBT ৮৫০ মিলিসেকেন্ড থেকে কমে মাত্র ১৫ মিলিসেকেন্ডে নেমে এসেছে।
      </Line>

      {/* ── Takeaways ─────────────────────────────────────────────────── */}
      <H2 id="takeaway">Production Takeaways</H2>

      <Note>
        <ul>
          <li>
            <strong>Reach for @next/third-parties first:</strong> GTM, GA4, YouTube বা Google Maps
            যুক্ত করতে ম্যানুয়াল স্ক্রিপ্ট না লিখে Next.js-এর ইন-বিল্ট কম্পোনেন্ট ব্যবহার করুন।
          </li>
          <li>
            <strong>Apply the facade pattern to embeds:</strong> ভারী iframe বা ইউটিউব প্লেয়ার পেজ
            লোডেই রেন্ডার না করে ইন্টার‌অ্যাক্টিভ পোস্টার দেখান।
          </li>
          <li>
            <strong>Defer non-critical trackers via lazyOnload:</strong> Hotjar, Clarity বা চ্যাট
            উইজেটের মতো ট্র্যাকারগুলোকে হাইড্রেশন শেষ হওয়া পর্যন্ত আটকে রাখুন।
          </li>
        </ul>
      </Note>
    </article>
  );
}
