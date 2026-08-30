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
    label: { bn: "স্কোর ৯০ থেকে ৩০", en: "From 90 down to 30" },
  },
  {
    id: "architecture",
    label: {
      bn: "Script execution lifecycle",
      en: "The script execution lifecycle",
    },
  },
  {
    id: "strategies",
    label: { bn: "৪টি loading strategy", en: "The four loading strategies" },
  },
  {
    id: "implementation",
    label: { bn: "Multi-strategy আর্কিটেকচার", en: "A multi-strategy architecture" },
  },
  {
    id: "matrix",
    label: { bn: "Performance Matrix", en: "Performance matrix" },
  },
  {
    id: "takeaway",
    label: { bn: "Production Takeaways", en: "Production takeaways" },
  },
];

export default function NextScriptLoadingStrategy() {
  return (
    <article className="doc-prose">
      {/* ── The problem ───────────────────────────────────────────────── */}
      <H2 id="the-problem" anchorOnly>
        স্কোর ৯০ থেকে ৩০
      </H2>

      <p>
        দুপুর ৩:৪৫। স্পোর্টস পোর্টালে Google Tag Manager, Meta Pixel, আর একটি লাইভ চ্যাটবট উইজেট যোগ
        করার পর পেজ স্পিড স্কোর ৯০ থেকে এক লাফে নেমে ৩০-এ ঠেকেছে।
      </p>

      <Line name="ভুলু ভাই">
        ফাহিম! মার্কেটিং টিম থেকে অ্যানালিটিক্স আর লাইভ চ্যাট যোগ করতে বলল, আর সেটা করতেই সাইট একদম
        স্লো হয়ে গেল! পেজ খুললে মেইন থ্রেড থমকে থাকে, ইউজার ক্লিকেও কোনো রেসপন্স পায় না।
      </Line>

      <Line name="ফাহিম">
        ভুলু ভাই! ট্র্যাডিশনাল <code>&lt;script&gt;</code> ট্যাগ ব্রাউজারে render-blocking তৈরি করে।
        ব্রাউজার স্ক্রিপ্ট পেলেই HTML পার্সিং বন্ধ রেখে সেটি ডাউনলোড ও এক্সিকিউট করে — ফলে Total
        Blocking Time (TBT) এবং First Contentful Paint (FCP) মারাত্মকভাবে ক্ষতিগ্রস্ত হয়।
      </Line>

      <Line name="নেক্সট-ভাই">
        ঠিক এখানেই সমাধান নিয়ে আসে <code>next/script</code>! এটি সাধারণ স্ক্রিপ্ট ট্যাগ নয় — এটি একটি
        Script Execution &amp; Priority Manager। <code>strategy</code> প্রপসের মাধ্যমে আপনি বলে দিতে
        পারেন কোন স্ক্রিপ্ট হাইড্রেশনের আগে চলবে, কোনটা পেজ লোডের পরে, আর কোনটা ব্রাউজার আইডল থাকলে।
      </Line>

      {/* ── Architecture ──────────────────────────────────────────────── */}
      <H2 id="architecture">১. Script Execution Lifecycle Pipeline</H2>

      <Diagram>{`┌─────────────────────────────────────────────────────────────────────────┐
│                 NEXT/SCRIPT STRATEGY EXECUTION TIMELINE                 │
└─────────────────────────────────────────────────────────────────────────┘

 HTML parsing / DOM ready
 ───► [1. beforeInteractive]
            │
            ▼
 Hydration complete (page interactive)
 ───► [2. afterInteractive]  (default)
            │
            ▼
 Browser idle / network free
 ───► [3. lazyOnload]
            │
            ▼
 Offloaded off the main thread (web worker)
 ───► [4. worker] (Partytown engine)`}</Diagram>

      {/* ── Strategies ────────────────────────────────────────────────── */}
      <H2 id="strategies">২. next/script-এর ৪টি মূল Loading Strategy</H2>

      <Table
        head={["Strategy", "কখন এক্সিকিউট হয়", "আদর্শ ইউজ কেস"]}
        rows={[
          [
            <code key="c">beforeInteractive</code>,
            "পেজ হাইড্রেশনের আগে, HTML head-এ ইনজেক্ট হয়",
            "বট ডিটেকশন (reCAPTCHA), কুকি কনসেন্ট, ক্রিটিক্যাল পলিফিল",
          ],
          [
            <code key="c">afterInteractive</code>,
            "(ডিফল্ট) পেজ হাইড্রেট হওয়ার পরপরই",
            "Google Analytics (GA4), Meta Pixel, GTM",
          ],
          [
            <code key="c">lazyOnload</code>,
            "সব অ্যাসেট লোড শেষে, ব্রাউজার আইডল হলে",
            "লাইভ চ্যাট উইজেট, সোশ্যাল এমবেড, ফিডব্যাক পপআপ",
          ],
          [
            <code key="c">worker</code>,
            "(experimental) মেইন থ্রেডের বাইরে web worker-এ",
            "প্রসেসর-ইনটেনসিভ অ্যানালিটিক্স ও ট্র্যাকিং স্ক্রিপ্ট",
          ],
        ]}
      />

      {/* ── Implementation ────────────────────────────────────────────── */}
      <H2 id="implementation">৩. Production Code Implementation</H2>

      <H3>❌ Anti-pattern — a blocking native script</H3>

      <CodeBlock filename="pages/_legacy-head.tsx">{`// 🔴 POOR PRACTICE: a native script in head freezes the HTML parser and main thread
import Head from 'next/head';

export function UnoptimizedScripts() {
  return (
    <Head>
      {/* 🔴 blocks rendering, delays FCP and TTI */}
      <script src="https://example.com/heavy-analytics.js" />
      <script
        dangerouslySetInnerHTML={{ __html: "console.log('blocking execution');" }}
      />
    </Head>
  );
}`}</CodeBlock>

      <H3>🟢 Production pattern — a multi-strategy script architecture</H3>

      <CodeBlock filename="app/layout.tsx">{`// 🟢 PRODUCTION PATTERN: strategic third-party script management
import Script from 'next/script';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        {children}

        {/* 🟢 STRATEGY 1: beforeInteractive — critical cookie consent / bot check */}
        <Script
          src="https://example.com/cookie-consent.js"
          strategy="beforeInteractive"
          id="cookie-consent-script"
        />

        {/* 🟢 STRATEGY 2: afterInteractive — standard analytics (GA4) */}
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-XYZ123456"
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {\`
            window.dataLayer = window.dataLayer || [];
            function gtag(){ dataLayer.push(arguments); }
            gtag('js', new Date());
            gtag('config', 'G-XYZ123456', {
              page_path: window.location.pathname,
            });
          \`}
        </Script>

        {/* 🟢 STRATEGY 3: lazyOnload — the non-critical live chat widget */}
        <Script
          src="https://embed.tawk.to/xyz/default"
          strategy="lazyOnload"
          onLoad={() => {
            console.log('✅ live chat widget loaded during browser idle time');
          }}
          onError={(e) => {
            console.error('❌ failed to load the live chat script', e);
          }}
        />
      </body>
    </html>
  );
}`}</CodeBlock>

      {/* ── Matrix ────────────────────────────────────────────────────── */}
      <H2 id="matrix">৪. Optimization Performance Matrix</H2>

      <Table
        head={["ক্যাটাগরি", "সাধারণ <script>", "next/script (strategy সহ)"]}
        rows={[
          ["Main thread blocking (TBT)", "২০০-৬০০ ms 🔴", "০-২০ ms 🟢"],
          ["First Contentful Paint", "ডিলে হয় 🔴", "ইনস্ট্যান্ট 🟢"],
          [
            "Event handling",
            "ম্যানুয়ালি সামলাতে হয় 🔴",
            <span key="d">
              <code>onLoad</code>, <code>onReady</code>, <code>onError</code> সাপোর্ট 🟢
            </span>,
          ],
          [
            "Execution ordering",
            "নিয়ন্ত্রণ প্রায় অসম্ভব 🔴",
            "স্ট্র্যাটেজি দিয়ে নিখুঁত নিয়ন্ত্রণ 🟢",
          ],
        ]}
      />

      <Line name="ভুলু ভাই">
        অসাধারণ ফাহিম! লাইভ চ্যাট উইজেটটাকে <code>lazyOnload</code>-এ নিয়ে গেলাম আর Google
        Analytics-কে <code>afterInteractive</code>-এ দিলাম! এখন পেজ ওপেন হতে বিন্দুমাত্র দেরি হচ্ছে
        না, Lighthouse স্কোর আবার ৯৫+।
      </Line>

      {/* ── Takeaways ─────────────────────────────────────────────────── */}
      <H2 id="takeaway">Production Takeaways</H2>

      <Note>
        <ul>
          <li>
            <strong>Never use beforeInteractive unless necessary:</strong> এটি পেজ লোড ব্লক করে — কেবল
            সিকিউরিটি বা কনসেন্ট-জাতীয় ক্রিটিক্যাল স্ক্রিপ্টেই ব্যবহার করুন।
          </li>
          <li>
            <strong>Move chat &amp; marketing embeds to lazyOnload:</strong> ইউজারের পেজ ওপেন করার
            সাথে সাথেই লাইভ চ্যাট দরকার হয় না — ব্রাউজার ফ্রি হলে লোড হওয়াই শ্রেয়।
          </li>
          <li>
            <strong>Handle re-navigation with onReady:</strong> পেজ নেভিগেশনের পর স্ক্রিপ্ট প্রতিবার
            রি-ইনিশিয়ালাইজ করতে হলে <code>onLoad</code>-এর বদলে <code>onReady</code> ব্যবহার করুন।
          </li>
        </ul>
      </Note>
    </article>
  );
}
