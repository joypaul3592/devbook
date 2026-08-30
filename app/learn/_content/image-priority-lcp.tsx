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
    label: { bn: "LCP ৪.৮ সেকেন্ড", en: "A 4.8s LCP" },
  },
  {
    id: "architecture",
    label: { bn: "priority কীভাবে LCP ঠিক করে", en: "How priority fixes LCP" },
  },
  {
    id: "mechanisms",
    label: { bn: "Priority ব্যবহারের ৪টি নিয়ম", en: "Four rules for priority" },
  },
  {
    id: "implementation",
    label: { bn: "Hero banner ইমপ্লিমেন্টেশন", en: "Hero banner implementation" },
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

export default function ImagePriorityLcp() {
  return (
    <article className="doc-prose">
      {/* ── The problem ───────────────────────────────────────────────── */}
      <H2 id="the-problem" anchorOnly>
        LCP ৪.৮ সেকেন্ড
      </H2>

      <p>
        বিকেল ৪:১০। ভুলু ভাই তার স্পোর্টস সাইটের মোবাইল ভার্সন খুলে মুখ কালো করে বসে আছেন। Lighthouse
        রিপোর্ট দেখাচ্ছে — LCP (Largest Contentful Paint): ৪.৮ সেকেন্ড, পারফরম্যান্স স্কোর লালে লাল।
      </p>

      <Line name="ভুলু ভাই">
        ফাহিম! আমার হিরো সেকশনের বড় ব্যানার ইমেজটা অন-ডিমান্ড অপটিমাইজ করার পরও কেন LCP স্কোর এত খারাপ?
        ইউজার স্ক্রিনে ঢোকার পর পুরো পেজ ফাঁকা থাকে, আর ব্যানারটা সবার শেষে লোড হয়।
      </Line>

      <Line name="ফাহিম">
        ভুলু ভাই! Next.js বাই-ডিফল্ট সব ইমেজে <code>loading=&quot;lazy&quot;</code> অ্যাপ্লাই করে। এটি
        নিচের ইমেজের জন্য আশীর্বাদ হলেও হিরো ব্যানার বা LCP এলিমেন্টের জন্য অভিশাপ! ব্রাউজার আগে DOM
        পার্স করে, তারপর বুঝতে পারে ইমেজটি ভিউপোর্টে আছে, আর তখন দেরি করে ডাউনলোড শুরু করে।
      </Line>

      <Line name="নেক্সট-ভাই">
        একদম! <code>priority</code> প্রপার্টি হলো LCP প্রবলেমের এক নম্বর ওষুধ। হিরো ব্যানারে{" "}
        <code>priority</code> দিলে Next.js lazy loading ডিজেবল করে দেয় এবং HTML{" "}
        <code>&lt;head&gt;</code>-এ একটি <code>&lt;link rel=&quot;preload&quot;&gt;</code> ট্যাগ
        ইনজেক্ট করে ব্রাউজারকে বলে দেয় — অন্য সব ফাইল পরে, আগে এই ইমেজটি হাই-প্রায়োরিটিতে ডাউনলোড করো।
      </Line>

      {/* ── Architecture ──────────────────────────────────────────────── */}
      <H2 id="architecture">১. How priority Optimizes the LCP Pipeline</H2>

      <Diagram>{`┌─────────────────────────────────────────────────────────────────────────┐
│                      LCP IMAGE LOADING PIPELINE                         │
└─────────────────────────────────────────────────────────────────────────┘

 ❌ WITHOUT priority (default lazy loading) — HIGH LCP DELAY
 HTML download ──► CSS parsing ──► layout render ──► discover hero image
                                                  ──► download (LCP: 4.8s) 🔴

───────────────────────────────────────────────────────────────────────────

 🟢 WITH priority (a preload link is injected) — OPTIMAL LCP
 HTML download (head includes <link rel="preload">)
   │
   ├─► preload the hero image in parallel ─────────────────────┐
   │                                                           ▼
   └─► CSS parsing ──► layout render ──► immediate paint (LCP: 0.9s) 🟢`}</Diagram>

      {/* ── Mechanisms ────────────────────────────────────────────────── */}
      <H2 id="mechanisms">২. LCP ও Image Priority-এর ৪টি মূল নিয়ম</H2>

      <p>
        <strong>Only top-of-the-fold images:</strong> স্ক্রিনের প্রথম ভিউপোর্টে যেসব ছবি থাকে (হিরো
        ব্যানার, নিউজের কভার ফটো), কেবল সেগুলোতেই <code>priority</code> ব্যবহার করতে হবে।
      </p>

      <p>
        <strong>Never abuse priority:</strong> একই পেজের একাধিক ইমেজে (যেমন ৫টি কার্ড ইমেজে){" "}
        <code>priority</code> দেওয়া মারাত্মক ভুল — এতে ব্যান্ডউইথ কনফ্লিক্ট তৈরি হয়ে LCP আরও খারাপ হয়।
      </p>

      <p>
        <strong>Automatic preload header:</strong> <code>priority</code> দিলে Next.js সার্ভার-সাইড
        রেন্ডারিংয়ের সময়ই HTML <code>&lt;head&gt;</code>-এ{" "}
        <code>&lt;link rel=&quot;preload&quot; as=&quot;image&quot;&gt;</code> জেনারেট করে দেয়।
      </p>

      <p>
        <strong>Console warning audit:</strong> ডেভেলপমেন্ট মোডে Next.js নিজেই সতর্ক করে যদি কোনো LCP
        ইমেজে <code>priority</code> মিসিং থাকে, বা স্ক্রলের নিচের ছবিতে অপ্রয়োজনীয়{" "}
        <code>priority</code> বসানো থাকে।
      </p>

      {/* ── Implementation ────────────────────────────────────────────── */}
      <H2 id="implementation">৩. Production Code Implementation</H2>

      <H3>❌ Anti-pattern — the LCP image left on lazy loading</H3>

      <CodeBlock filename="components/UnoptimizedHeroBanner.tsx">{`// 🔴 POOR PRACTICE: the hero image uses the default lazy loading strategy
import Image from 'next/image';

export function UnoptimizedHeroBanner() {
  return (
    <div className="relative w-full h-[400px]">
      {/* 🔴 lazy loading delays the LCP paint significantly */}
      <Image
        src="/banner.jpg"
        alt="Match hero banner"
        fill
        className="object-cover"
      />
    </div>
  );
}`}</CodeBlock>

      <H3>🟢 Production pattern — priority preloading with responsive sizes</H3>

      <CodeBlock filename="app/hero/page.tsx">{`// 🟢 PRODUCTION PATTERN: an optimal LCP hero banner
import Image from 'next/image';

export default function OptimizedLCPHero() {
  return (
    <section className="relative w-full h-[450px] rounded-2xl overflow-hidden bg-slate-900">
      <Image
        src="https://my-bucket.s3.amazonaws.com/live-match-banner.jpg"
        alt="Live match final banner"
        fill
        // 🟢 STEP 1: priority disables lazy loading and injects the preload link
        priority
        // 🟢 STEP 2: quality tuned for visual clarity vs size
        quality={85}
        // 🟢 STEP 3: an accurate sizes attribute for precise responsive preloading
        sizes="(max-width: 640px) 100vw, (max-width: 1200px) 90vw, 1200px"
        // 🟢 STEP 4: an inline blur placeholder to prevent layout shift
        placeholder="blur"
        blurDataURL="data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9IiMwZTE3MmEiLz48L3N2Zz4="
        className="object-cover"
      />

      <div className="absolute bottom-6 left-6 z-10 bg-slate-950/80 p-4 rounded-xl backdrop-blur-md border border-slate-800">
        <span className="text-xs font-bold uppercase text-red-500 tracking-wider">
          LIVE MATCH
        </span>
        <h1 className="text-xl font-bold text-white">
          Bangladesh vs World XI — Championship Final
        </h1>
      </div>
    </section>
  );
}`}</CodeBlock>

      {/* ── Matrix ────────────────────────────────────────────────────── */}
      <H2 id="matrix">৪. Optimization Performance Matrix</H2>

      <Table
        head={["প্যারামিটার", "priority ছাড়া (ডিফল্ট)", "priority সহ"]}
        rows={[
          [
            "Loading strategy",
            <code key="c">loading=&quot;lazy&quot;</code>,
            <code key="d">loading=&quot;eager&quot;</code>,
          ],
          [
            "Preload injection",
            "কোনো preload link থাকে না 🔴",
            "head-এ preload link ইনজেক্ট হয় 🟢",
          ],
          ["LCP", "৩.৫s – ৫.০s 🔴", "০.৭s – ১.২s 🟢"],
          [
            "ইউজ কেস",
            "স্ক্রলের নিচের সব ছবি",
            "কেবল ভিউপোর্টের প্রধান ছবি/ব্যানার",
          ],
        ]}
      />

      <Line name="ভুলু ভাই">
        মারভেলাস ফাহিম! শুধু হিরো ইমেজে <code>priority</code> বসালাম, আর সাথে সাথে LCP ৪.৮ সেকেন্ড থেকে
        কমে ০.৮ সেকেন্ডে চলে এলো! পারফরম্যান্স স্কোর আবার সবুজ।
      </Line>

      {/* ── Takeaways ─────────────────────────────────────────────────── */}
      <H2 id="takeaway">Production Takeaways</H2>

      <Note>
        <ul>
          <li>
            <strong>Pair priority with sizes:</strong> <code>priority</code> দিলে Next.js দ্রুত লোড
            করতে চায়, কিন্তু সঠিক <code>sizes</code> না থাকলে ব্রাউজার মোবাইলেও অহেতুক বড় ডেস্কটপ
            সাইজের ছবি টেনে আনতে পারে।
          </li>
          <li>
            <strong>Limit it to one or two elements:</strong> একই পেজে সর্বোচ্চ ১-২টি LCP ইমেজে{" "}
            <code>priority</code> দিন।
          </li>
          <li>
            <strong>Keep AVIF/WebP enabled in config:</strong> <code>next.config.mjs</code>-এ মডার্ন
            ফরম্যাট চালু রাখলে <code>priority</code> ইমেজও সর্বনিম্ন সাইজে প্রি-লোড হবে।
          </li>
        </ul>
      </Note>
    </article>
  );
}
