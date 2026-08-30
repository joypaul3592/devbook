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
    label: { bn: "Render-blocking সাদা স্ক্রিন", en: "A render-blocking blank screen" },
  },
  {
    id: "architecture",
    label: { bn: "Critical CSS লোডিং আর্কিটেকচার", en: "Critical CSS loading architecture" },
  },
  {
    id: "mechanisms",
    label: { bn: "৩টি আর্কিটেকচারাল কনসেপ্ট", en: "Three architectural concepts" },
  },
  {
    id: "implementation",
    label: { bn: "Inline ও deferred CSS", en: "Inline & deferred CSS" },
  },
  {
    id: "matrix",
    label: { bn: "Optimization Matrix", en: "Optimization matrix" },
  },
  {
    id: "takeaway",
    label: { bn: "Production Takeaways", en: "Production takeaways" },
  },
];

export default function CriticalCss() {
  return (
    <article className="doc-prose">
      {/* ── The problem ───────────────────────────────────────────────── */}
      <H2 id="the-problem" anchorOnly>
        Render-blocking সাদা স্ক্রিন
      </H2>

      <p>
        সন্ধ্যা ৫:১০। PageSpeed Insights রিপোর্টে সাইটের সাইজ ছোট হওয়া সত্ত্বেও &quot;Eliminate
        render-blocking resources&quot; লাল ওয়ার্নিং দেখাচ্ছে। স্লো 4G-তে প্রথম ১-২ সেকেন্ড পেজ
        সম্পূর্ণ ফাঁকা ও সাদা থাকছে।
      </p>

      <Line name="ভুলু ভাই">
        ফাহিম! আমার CSS ফাইল তো মাত্র ৩০ KB! তাহলেও কেন PageSpeed এটিকে render-blocking resource
        বলছে? ইউজাররা প্রথম ২ সেকেন্ড খালি স্ক্রিন দেখে সাইট ছেড়ে চলে যাবে কেন?
      </Line>

      <Line name="ফাহিম">
        ভুলু ভাই! ব্রাউজার <code>&lt;link rel=&quot;stylesheet&quot;&gt;</code> পেলেই পুরো CSS ফাইল
        নামানো ও পার্স না হওয়া পর্যন্ত রেন্ডার আটকে রাখে। আপনার ৩০ KB-এর ৯০% স্টাইলই হয়তো নিচের অংশের
        (below the fold) জন্য, কিন্তু ব্রাউজার সেগুলোর জন্য উপরের অংশকেও আটকে রাখছে।
      </Line>

      <Line name="নেক্সট-ভাই">
        একদম! আর্কিটেকচারাল সমাধান হলো Critical CSS Optimization — প্রথম স্ক্রিন রেন্ডার করতে যতটুকু
        CSS লাগে, সেটিকে <code>&lt;head&gt;</code>-এ <code>&lt;style&gt;</code> ট্যাগে ইনলাইন করে দিন,
        আর বাকিটা ব্যাকগ্রাউন্ডে অ্যাসিঙ্ক লোড করান।
      </Line>

      {/* ── Architecture ──────────────────────────────────────────────── */}
      <H2 id="architecture">১. Critical vs. Non-Critical CSS Loading Architecture</H2>

      <Diagram>{`┌─────────────────────────────────────────────────────────────────────────┐
│                    CRITICAL CSS LOADING ARCHITECTURE                    │
└─────────────────────────────────────────────────────────────────────────┘

 ❌ TRADITIONAL LOADING (render-blocking)
 HTML downloaded ──► download all CSS (30 KB) ──► parse ──► first paint (2.5s) 🔴
                                                 (DOM painting blocked)

───────────────────────────────────────────────────────────────────────────

 🟢 CRITICAL CSS PATTERN (zero render-blocking)
 HTML downloaded ──► inline critical CSS in <head> ──► first paint (0.3s) 🟢
                    (header + hero only)
                         │
                         ▼
                    async non-critical CSS download (footer, modals, forms)
                    — does NOT block the initial viewport render`}</Diagram>

      {/* ── Mechanisms ────────────────────────────────────────────────── */}
      <H2 id="mechanisms">২. কোর আর্কিটেকচারাল কনসেপ্ট</H2>

      <p>
        <strong>Above-the-fold vs below-the-fold:</strong> স্ক্রল ছাড়াই যে অংশ দেখা যায় (navbar, hero
        banner) তার স্টাইলই Critical CSS; স্ক্রল করার পর আসা অংশ (footer, comments, related cards)
        হলো non-critical।
      </p>

      <p>
        <strong>Inline critical, defer the rest:</strong> Critical CSS HTML-এর সাথে ইনলাইন থাকলে
        ব্রাউজার অতিরিক্ত HTTP রিকোয়েস্ট ছাড়াই প্রথম ফ্রেম রেন্ডার করতে পারে; বাকিটা{" "}
        <code>rel=&quot;preload&quot;</code> বা media-swap ট্রিক দিয়ে অ্যাসিঙ্ক লোড হয়।
      </p>

      <p>
        <strong>App Router-এর বিল্ট-ইন অপটিমাইজেশন:</strong> Next.js App Router SSR-এর সময় প্রতিটি
        রুটের ব্যবহৃত CSS Modules বা Tailwind ক্লাসের critical অংশ আলাদা করে HTML রেসপন্সে চ্যাঙ্ক আকারে
        ইনজেক্ট করে দেয়।
      </p>

      {/* ── Implementation ────────────────────────────────────────────── */}
      <H2 id="implementation">৩. Production Code Implementation</H2>

      <H3>❌ Anti-pattern — one external render-blocking stylesheet</H3>

      <CodeBlock filename="legacy/index.html">{`<!-- 🔴 POOR PRACTICE: an external stylesheet blocks the first contentful paint -->
<head>
  <title>My E-Commerce Site</title>
  <!-- the browser stops painting until this entire file arrives -->
  <link rel="stylesheet" href="/styles/main.css" />
</head>`}</CodeBlock>

      <H3>🟢 Production pattern — inline critical, async the rest</H3>

      <CodeBlock filename="app/head-architecture.html">{`<!-- 🟢 PRODUCTION PATTERN: zero render-blocking architecture -->
<head>
  <title>Optimized Enterprise App</title>

  <!-- 1. 🟢 critical CSS inlined: only the navbar and hero -->
  <style>
    :root{--bg-main:#0f172a;--text-main:#f8fafc;--brand:#3b82f6}
    body{margin:0;font-family:system-ui,sans-serif;background:var(--bg-main);color:var(--text-main)}
    .navbar{display:flex;justify-content:space-between;align-items:center;padding:1rem 2rem;background:#1e293b}
    .hero{min-height:60vh;display:flex;flex-direction:column;justify-content:center;align-items:center;text-align:center}
    .hero-title{font-size:2.5rem;font-weight:800;color:var(--brand)}
  </style>

  <!-- 2. 🟢 non-critical CSS loaded asynchronously via preload + rel swap -->
  <link
    rel="preload"
    href="/styles/non-critical.css"
    as="style"
    onload="this.onload=null;this.rel='stylesheet'"
  />
  <!-- a fallback for visitors with JavaScript disabled -->
  <noscript>
    <link rel="stylesheet" href="/styles/non-critical.css" />
  </noscript>
</head>`}</CodeBlock>

      <CodeBlock filename="app/page.tsx">{`// 🟢 the App Router splits critical CSS per route automatically
import styles from './Hero.module.css';

export default function HomePage() {
  return (
    <main>
      {/*
        Next.js extracts and inlines the CSS Module rules for this
        above-the-fold hero into the initial HTML response.
      */}
      <section className={styles.heroSection}>
        <h1 className={styles.title}>Blazing-fast Next.js architecture</h1>
        <p className={styles.subtitle}>Zero render-blocking critical CSS</p>
      </section>

      <BelowTheFoldSection />
    </main>
  );
}

function BelowTheFoldSection() {
  return (
    <footer className="mt-20 p-8 bg-slate-900 border-t border-slate-800 text-center">
      <p className="text-slate-400">© 2026 Enterprise System. All rights reserved.</p>
    </footer>
  );
}`}</CodeBlock>

      <p>
        কাস্টম বিল্ড পাইপলাইন বা Pages Router ব্যবহার করলে <code>optimizeCss</code> চালু করে নেটিভ
        critters-ভিত্তিক ইনলাইনিং পাওয়া যায়:
      </p>

      <CodeBlock filename="next.config.js">{`/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    // 🟢 uses critters under the hood: inlines critical CSS, defers the rest
    optimizeCss: true,
  },
};

module.exports = nextConfig;`}</CodeBlock>

      {/* ── Matrix ────────────────────────────────────────────────────── */}
      <H2 id="matrix">৪. Critical CSS Optimization Matrix</H2>

      <Table
        head={["লোডিং মেথড", "FCP", "Render-blocking ঝুঁকি", "সেটআপ জটিলতা"]}
        rows={[
          [
            "Standard link tag",
            "ধীর (~১.৫–২.৫s) 🔴",
            "সম্পূর্ণ ব্লক 🔴",
            "কোনো জটিলতা নেই 🟢",
          ],
          [
            "Manual inline critical CSS",
            "অতি দ্রুত (~০.৩s) 🟢",
            "জিরো 🟢",
            "ম্যানুয়াল মেইনটেন্যান্স কঠিন 🔴",
          ],
          [
            <span key="c">
              App Router + <code>optimizeCss</code>
            </span>,
            "দ্রুত ও অটোমেটেড 🟢",
            "প্রায় বিলুপ্ত 🟢",
            "জিরো কনফিগারেশন 🟢",
          ],
        ]}
      />

      <Line name="ভুলু ভাই">
        মারাত্মক ফাহিম! Critical CSS ইনলাইন আর <code>optimizeCss</code> অন করার পর PageSpeed-এর সেই
        লাল ওয়ার্নিং গায়েব — FCP এখন মাত্র ০.৪ সেকেন্ডে।
      </Line>

      {/* ── Takeaways ─────────────────────────────────────────────────── */}
      <H2 id="takeaway">Production Takeaways</H2>

      <Note>
        <ul>
          <li>
            <strong>Keep inline critical CSS under ~10 KB:</strong> খুব বড় হয়ে গেলে HTML রেসপন্স
            সাইজ বেড়ে TTFB স্লো হয়ে যায়।
          </li>
          <li>
            <strong>Preload non-critical styles:</strong> নিচের অংশের বা ভারী থার্ড-পার্টি স্টাইলে{" "}
            <code>&lt;link rel=&quot;preload&quot; as=&quot;style&quot;&gt;</code> ট্রিক ব্যবহার করুন,
            যাতে প্রাথমিক পেইন্ট না আটকায়।
          </li>
          <li>
            <strong>Audit with Lighthouse:</strong> নিয়মিত &quot;Eliminate render-blocking
            resources&quot; সেকশনটি চেক করুন — নতুন কোনো স্টাইলশিট যুক্ত হলেই এটি ধরা পড়বে।
          </li>
        </ul>
      </Note>
    </article>
  );
}
