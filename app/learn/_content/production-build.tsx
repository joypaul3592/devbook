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
      bn: "১.২ জিবির ডকার ইমেজ",
      en: "A 1.2 GB Docker image",
    },
  },
  {
    id: "architecture",
    label: {
      bn: "Build পাইপলাইন আর্কিটেকচার",
      en: "The build pipeline architecture",
    },
  },
  {
    id: "mechanisms",
    label: { bn: "৩টি আর্কিটেকচারাল কনসেপ্ট", en: "Three architectural concepts" },
  },
  {
    id: "implementation",
    label: {
      bn: "Standalone কনফিগ ও static রাখা",
      en: "Standalone config & staying static",
    },
  },
  {
    id: "matrix",
    label: { bn: "Build Route Indicators", en: "Build route indicators" },
  },
  {
    id: "takeaway",
    label: { bn: "Production Takeaways", en: "Production takeaways" },
  },
];

export default function ProductionBuild() {
  return (
    <article className="doc-prose">
      {/* ── The problem ───────────────────────────────────────────────── */}
      <H2 id="the-problem" anchorOnly>
        ১.২ জিবির ডকার ইমেজ
      </H2>

      <p>
        দুপুর ১২:০০। ভুলু ভাই তার প্রজেক্ট প্রোডাকশনের জন্য <code>npm run build</code> চালালেন। বিল্ড
        শেষ হতে প্রায় ১৫ মিনিট লেগে গেল! এরপর GitHub Actions-এ ডকার ইমেজ তৈরি করতে গিয়ে দেখলেন ইমেজের
        সাইজ ১.২ গিগাবাইট ছাড়িয়ে গেছে। তাছাড়া টার্মিনালে বিল্ড আউটপুটের সিম্বল ○, ●, ƒ দেখে তার মাথা
        ঘুরছে।
      </p>

      <Line name="ভুলু ভাই">
        ফাহিম! আমার অ্যাপের ডকার ইমেজের সাইজ ১ জিবির বেশি কেন হলো? আর টার্মিনালে বিল্ড শেষে গোল গোল ○
        আর ƒ সিম্বল দেখাচ্ছে, এসবের অর্থ কী?
      </Line>

      <Line name="ফাহিম">
        ভুলু ভাই! আপনি <code>next.config</code>-এ <code>output: &apos;standalone&apos;</code> অন
        করেননি! তাই পুরো <code>node_modules</code> ডিরেক্টরি আর অপ্রয়োজনীয় বিল্ড ট্র্যাশ ইমেজের ভেতর
        চলে গেছে। আর ওই সিম্বলগুলো দিয়ে Next.js বুঝিয়ে দিচ্ছে কোন পেজগুলো static আর কোনগুলো dynamic
        server-rendered।
      </Line>

      <Line name="নেক্সট-ভাই">
        একদম! প্রোডাকশন বিল্ড হলো ডেভেলপমেন্ট আর্কিটেকচারকে দ্রুত ও লাইটওয়েট প্রোডাকশন আর্টিফ্যাক্টে
        রূপান্তরের প্রক্রিয়া। টাইপ-চেকিং, লিন্টিং, মিনিফিকেশন, রুট অপটিমাইজেশন এবং অটোমেটিক স্ট্যাটিক
        অ্যানালাইসিস — সবকিছু এই স্টেপেই ঘটে!
      </Line>

      {/* ── Architecture ──────────────────────────────────────────────── */}
      <H2 id="architecture">১. Next.js Production Build Pipeline</H2>

      <Diagram>{`┌─────────────────────────────────────────────────────────────────────────────┐
│                       NEXT.JS PRODUCTION BUILD PIPELINE                     │
└─────────────────────────────────────────────────────────────────────────────┘

                        npm run build
                               │
                               ▼
 ┌───────────────────────────────────────────────────────────┐
 │ 1. linting & type checking (ESLint + TypeScript)          │
 └─────────────────────────────┬─────────────────────────────┘
                               ▼
 ┌───────────────────────────────────────────────────────────┐
 │ 2. SWC compilation, minification & tree shaking           │
 └─────────────────────────────┬─────────────────────────────┘
                               ▼
 ┌───────────────────────────────────────────────────────────┐
 │ 3. route static analysis — which routes are dynamic?      │
 └─────────────────────────────┬─────────────────────────────┘
                               ▼
 ┌───────────────────────────────────────────────────────────┐
 │ 4. prerendering static pages (SSG / HTML generation)      │
 └─────────────────────────────┬─────────────────────────────┘
                               ▼
 ┌───────────────────────────────────────────────────────────┐
 │ 5. standalone tracing → .next/standalone                  │
 └───────────────────────────────────────────────────────────┘`}</Diagram>

      {/* ── Mechanisms ────────────────────────────────────────────────── */}
      <H2 id="mechanisms">২. কোর আর্কিটেকচারাল কনসেপ্ট</H2>

      <p>
        <strong>Standalone output tracing:</strong> সাধারণ প্রজেক্টের <code>node_modules</code>{" "}
        কয়েকশো মেগাবাইট হতে পারে। <code>output: &apos;standalone&apos;</code> এনাবল করলে Next.js
        Node File Trace ব্যবহার করে শুধুমাত্র সেই ফাইলগুলো আলাদা করে যা অ্যাপটি চালাতে সত্যিই প্রয়োজন।
        ফলাফল — ১.২ জিবির ইমেজ নেমে আসে ৮০–১০০ মেগাবাইটে।
      </p>

      <p>
        <strong>Build output route indicators:</strong> <code>○</code> বিশুদ্ধ স্ট্যাটিক পেজ, CDN থেকে
        পরিবেশন করা হয়। <code>●</code> SSG/ISR — <code>generateStaticParams</code> বা{" "}
        <code>revalidate</code> ব্যবহার করে প্রাক-রেন্ডার করা। <code>ƒ</code> dynamic —{" "}
        <code>cookies()</code>, <code>headers()</code> বা আন-ক্যাশড fetch ব্যবহারের কারণে প্রতি
        রিকোয়েস্টে রেন্ডার হয়।
      </p>

      <p>
        <strong>Bundle optimization:</strong> ভারী থার্ড-পার্টি লাইব্রেরি ভুলভাবে ইমপোর্ট করলে ক্লায়েন্ট
        বান্ডেল স্ফীত হয়ে ফার্স্ট লোড টাইম বাড়িয়ে দেয়। <code>@next/bundle-analyzer</code> দিয়ে ঠিক কোন
        প্যাকেজ কতটুকু জায়গা নিচ্ছে তা দেখা যায়।
      </p>

      {/* ── Implementation ────────────────────────────────────────────── */}
      <H2 id="implementation">৩. Production Code Implementation</H2>

      <H3>❌ Anti-pattern — a bloated config and an accidental dynamic route</H3>

      <CodeBlock filename="next.config.js">{`// 🔴 POOR PRACTICE: no standalone output, and errors silenced

/** @type {import('next').NextConfig} */
const nextConfig = {
  // ❌ without output: 'standalone' the Docker image carries all of node_modules
  // ❌ silencing build errors just moves the crash to production
  typescript: { ignoreBuildErrors: true },
  eslint: { ignoreDuringBuilds: true },
};

module.exports = nextConfig;`}</CodeBlock>

      <CodeBlock filename="app/about/page.tsx">{`// 🔴 POOR PRACTICE: an accidental dynamic route
import { cookies } from 'next/headers';

export default async function AboutPage() {
  // ❌ one cookies() call turns this whole static marketing page into 'ƒ',
  // costing server CPU on every single visit
  const cookieStore = await cookies();
  const theme = cookieStore.get('theme');

  return <div>About us (theme: {theme?.value})</div>;
}`}</CodeBlock>

      <H3>🟢 Production pattern — a lean, analysable build</H3>

      <p>
        <strong>Step 1 — প্রোডাকশন কনফিগ।</strong>
      </p>

      <CodeBlock filename="next.config.js">{`// 🟢 PRODUCTION PATTERN: standalone output + bundle analyzer
const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
});

/** @type {import('next').NextConfig} */
const nextConfig = {
  // 🟢 dramatically reduces the production image for Docker / self-hosting
  output: 'standalone',

  poweredByHeader: false, // don't advertise the framework
  reactStrictMode: true,
  compress: true,

  compiler: {
    // strip console.log in production, but keep console.error
    removeConsole:
      process.env.NODE_ENV === 'production' ? { exclude: ['error'] } : false,
  },
};

module.exports = withBundleAnalyzer(nextConfig);`}</CodeBlock>

      <p>
        <strong>Step 2 — স্ট্যাটিক পেজ স্ট্যাটিকই রাখা।</strong>
      </p>

      <CodeBlock filename="app/about/page.tsx">{`// 🟢 PRODUCTION PATTERN: keeping a static page marked '○'

// makes the intent explicit — the build fails loudly if something
// accidentally introduces a dynamic API here
export const dynamic = 'force-static';

export default function AboutPage() {
  return (
    <main className="container mx-auto p-6">
      <h1 className="text-3xl font-bold">About our platform</h1>
      <p className="mt-2 text-gray-600">
        This page is prerendered at build time and served from the CDN.
      </p>
    </main>
  );
}`}</CodeBlock>

      <p>
        <strong>Step 3 — অ্যানালাইসিস স্ক্রিপ্ট।</strong>
      </p>

      <CodeBlock filename="package.json">{`{
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "build:analyze": "ANALYZE=true next build"
  }
}`}</CodeBlock>

      {/* ── Matrix ────────────────────────────────────────────────────── */}
      <H2 id="matrix">৪. Build Route Indicators</H2>

      <Table
        head={["প্রতীক", "রুট প্রকার", "রেন্ডারিং সময়", "পারফরম্যান্স ও খরচ"]}
        rows={[
          [
            "○ Static",
            "Static prerendered",
            "npm run build চলার সময়",
            "অতি দ্রুত, সর্বনিম্ন সার্ভার খরচ 🟢",
          ],
          [
            "● SSG / ISR",
            "Static + revalidation",
            "build time + ব্যাকগ্রাউন্ড ISR",
            "স্কেলেবল ও তাজা ডেটা 🟢",
          ],
          [
            "ƒ Dynamic",
            "Server-rendered",
            "প্রতিটি রিকোয়েস্টে",
            "সার্ভার CPU ও মেমরি খরচ বেশি 🟡",
          ],
        ]}
      />

      <Line name="ভুলু ভাই">
        অসাধারণ ফাহিম! <code>output: &apos;standalone&apos;</code> অন করতেই ডকার ইমেজ সাইজ ১ জিবি থেকে
        কমে মাত্র ৯০ এমবি হয়ে গেল! এখন বিল্ড আউটপুটের গোল চিহ্নগুলোর অর্থও বুঝতে পারছি।
      </Line>

      {/* ── Takeaways ─────────────────────────────────────────────────── */}
      <H2 id="takeaway">Production Takeaways</H2>

      <Note>
        <ul>
          <li>
            <strong>Set standalone for self-hosting:</strong> Vercel ছাড়া অন্য কোথাও (Docker, VPS,
            EC2) ডেপ্লয় করলে <code>output: &apos;standalone&apos;</code> ব্যবহার করা কার্যত
            বাধ্যতামূলক।
          </li>
          <li>
            <strong>Audit the build symbols:</strong> <code>next build</code>-এর আউটপুট মনোযোগ দিয়ে
            দেখুন — যে পেজগুলো স্ট্যাটিক থাকার কথা ছিল সেগুলো ভুলবশত <code>ƒ</code> হয়ে গেছে কিনা।
          </li>
          <li>
            <strong>Never ignore build errors:</strong> <code>ignoreBuildErrors</code> অন করে ডেপ্লয়
            করা আত্মঘাতী — এটি কম্পাইল-টাইম এররকে প্রোডাকশন রানটাইম ক্র্যাশে রূপান্তরিত করে মাত্র।
          </li>
        </ul>
      </Note>
    </article>
  );
}
