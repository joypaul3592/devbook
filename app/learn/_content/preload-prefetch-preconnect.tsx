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
    label: { bn: "৩০০ms discovery delay", en: "A 300ms discovery delay" },
  },
  {
    id: "architecture",
    label: {
      bn: "Hints ছাড়া বনাম hints সহ waterfall",
      en: "Waterfall with and without hints",
    },
  },
  {
    id: "mechanisms",
    label: { bn: "৪টি রিসোর্স হিন্ট", en: "The four resource hints" },
  },
  {
    id: "implementation",
    label: { bn: "App Router-এ resource hints", en: "Resource hints in App Router" },
  },
  {
    id: "matrix",
    label: { bn: "Resource Hints Comparison", en: "Resource hints comparison" },
  },
  {
    id: "takeaway",
    label: { bn: "Production Takeaways", en: "Production takeaways" },
  },
];

export default function PreloadPrefetchPreconnect() {
  return (
    <article className="doc-prose">
      {/* ── The problem ───────────────────────────────────────────────── */}
      <H2 id="the-problem" anchorOnly>
        ৩০০ms discovery delay
      </H2>

      <p>
        বিকেল ৬:১৫। ভুলু ভাই নেটওয়ার্ক ওয়াটারফল চার্ট দেখে চোখ কপালে তুলেছেন — পেজ ওপেন হওয়ার পর API
        সার্ভার থেকে লাইভ স্কোর ফেচ করতে ৩০০ মিলিসেকেন্ড অতিরিক্ত সময় নষ্ট হচ্ছে, কারণ ব্রাউজার আগে DNS
        খুঁজছে, তারপর TCP handshake করছে, তারপর TLS সার্টিফিকেট চেক করছে। সাথে হিরো ব্যানার রেন্ডার হতে
        ২ সেকেন্ড দেরি।
      </p>

      <Line name="ভুলু ভাই">
        ফাহিম! ব্রাউজার কেন আগেই বুঝতে পারে না যে তাকে API ডোমেইন থেকে ডেটা আনতে হবে আর হিরো ব্যানার
        ইমেজটি ডাউনলোড করতে হবে? পুরো CSS আর JS ডাউনলোড শেষ করার পর অলসভাবে একটার পর একটা রিকোয়েস্ট
        পাঠায়।
      </Line>

      <Line name="ফাহিম">
        ভুলু ভাই! এই সমস্যার নাম Discovery Delay। ব্রাউজার আগে HTML ও CSS পার্স করে, তারপর বুঝতে পারে
        কোন ফন্ট, ইমেজ বা API এন্ডপয়েন্টে রিকোয়েস্ট পাঠাতে হবে — ফলে ওয়াটারফলে বড় গ্যাপ তৈরি হয় এবং
        LCP স্লো হয়ে যায়।
      </Line>

      <Line name="নেক্সট-ভাই">
        একদম! সমাধান হলো ব্রাউজারকে Resource Hints দেওয়া — <code>dns-prefetch</code>,{" "}
        <code>preconnect</code>, <code>preload</code> এবং <code>prefetch</code>। এই চারটি ইনস্ট্রাকশন
        দিয়ে ক্রুশিয়াল অ্যাসেটগুলো আগেই রেডি রাখা যায়, ফলে কানেকশন লেটেন্সি প্রায় শূন্যে নেমে আসে।
      </Line>

      {/* ── Architecture ──────────────────────────────────────────────── */}
      <H2 id="architecture">১. Network Latency: Without Hints vs. With Hints</H2>

      <Diagram>{`┌─────────────────────────────────────────────────────────────────────────┐
│               RESOURCE HINTS NETWORK WATERFALL COMPARISON               │
└─────────────────────────────────────────────────────────────────────────┘

 ❌ WITHOUT RESOURCE HINTS (sequential connection delay)
 0ms        100ms       200ms       300ms       400ms       500ms
 ├──────────┼───────────┼───────────┼───────────┼───────────┤
 [parse HTML/CSS] ──► [DNS lookup] ──► [TCP/TLS handshake] ──► [fetch data / image]
                                                                  ▲
                                                       delayed by ~300 ms 🔴

───────────────────────────────────────────────────────────────────────────

 🟢 WITH PRECONNECT & PRELOAD (zero connection delay)
 0ms        100ms       200ms       300ms       400ms       500ms
 ├──────────┼───────────┼───────────┼───────────┼───────────┤
 [preconnect API domain] (DNS + TCP + TLS finish early, in the background) ⚡
 [preload hero image]    (high-priority download starts instantly)         ⚡
            │
            └──► [fetch API data] (reuses the already-open TLS connection) 🟢`}</Diagram>

      {/* ── Mechanisms ────────────────────────────────────────────────── */}
      <H2 id="mechanisms">২. ৪টি রিসোর্স হিন্টের কাজ ও পার্থক্য</H2>

      <p>
        <strong>dns-prefetch:</strong> কেবল এক্সটার্নাল ডোমেইনের IP অ্যাড্রেস আগেই রেজলভ করে রাখে।
        খরচে সবচেয়ে হালকা, তবে শুধু DNS lookup-এর সময়টুকু বাঁচায়।
      </p>

      <p>
        <strong>preconnect:</strong> DNS lookup + TCP handshake + TLS negotiation — তিনটিই আগে থেকে
        সম্পন্ন করে কানেকশন ওপেন রাখে। এক্সটার্নাল API ডোমেইন বা CDN-এর জন্য এটিই সেরা।
      </p>

      <p>
        <strong>preload:</strong> বর্তমান পেজের অত্যন্ত গুরুত্বপূর্ণ কোনো ফাইলকে (LCP hero image,
        critical CSS বা কাস্টম ফন্ট) হাই-প্রায়োরিটিতে এখনই ডাউনলোড করার নির্দেশ দেয়।
      </p>

      <p>
        <strong>prefetch:</strong> ইউজার পরবর্তীতে যে পেজে যেতে পারে, সেই পেজের JS/CSS ব্রাউজারের idle
        টাইমে ডাউনলোড করে ক্যাশে রাখে — Next.js-এর <code>&lt;Link&gt;</code> এটি অটোমেটিক করে।
      </p>

      {/* ── Implementation ────────────────────────────────────────────── */}
      <H2 id="implementation">৩. Production Code Implementation</H2>

      <H3>❌ Anti-pattern — late resource discovery</H3>

      <CodeBlock filename="components/LegacyHeroBanner.tsx">{`// 🔴 POOR PRACTICE: the browser discovers the API domain and hero image very late
export default function HeroBanner() {
  return (
    <div>
      {/* 🔴 fetching only starts once CSS/DOM is ready — the LCP image waits */}
      <img src="https://cdn.sportsnews.com/hero.jpg" alt="Match hero" />
    </div>
  );
}`}</CodeBlock>

      <H3>🟢 Production pattern — resource hints in the App Router</H3>

      <p>
        App Router-এ <code>react-dom</code> থেকে <code>preconnect</code>, <code>dnsPrefetch</code> ও{" "}
        <code>preload</code> সরাসরি সার্ভার রেন্ডারের সময় কল করা যায়:
      </p>

      <CodeBlock filename="app/layout.tsx">{`// 🟢 PATTERN 1: React DOM resource hints
import { preconnect, prefetchDNS, preload } from 'react-dom';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  // 🟢 STEP 1: open connections to critical API and CDN domains during SSR
  preconnect('https://api.sportsnews.com');
  preconnect('https://cdn.sportsnews.com', { crossOrigin: 'anonymous' });
  prefetchDNS('https://www.google-analytics.com');

  // 🟢 STEP 2: preload a critical external asset needed for this render
  preload('https://cdn.sportsnews.com/fonts/bengali-custom.woff2', {
    as: 'font',
    type: 'font/woff2',
    crossOrigin: 'anonymous',
  });

  return (
    <html lang="bn">
      <body className="bg-slate-950 text-slate-100 antialiased">{children}</body>
    </html>
  );
}`}</CodeBlock>

      <CodeBlock filename="app/page.tsx">{`// 🟢 PATTERN 2: preloading the LCP image through next/image priority
import Image from 'next/image';

export default function HomePage() {
  return (
    <section className="p-6">
      <h1 className="text-2xl font-bold mb-4">আজকের হাইলাইটস</h1>

      {/* 🟢 STEP 3: 'priority' automatically injects <link rel="preload"> into <head> */}
      <div className="relative w-full h-[400px] rounded-xl overflow-hidden">
        <Image
          src="https://cdn.sportsnews.com/hero-match.jpg"
          alt="Bangladesh vs India match"
          fill
          priority
          sizes="(max-width: 768px) 100vw, 1200px"
          className="object-cover"
        />
      </div>
    </section>
  );
}`}</CodeBlock>

      {/* ── Matrix ────────────────────────────────────────────────────── */}
      <H2 id="matrix">৪. Resource Hints Comparison Matrix</H2>

      <Table
        head={["Resource hint", "কী করে", "সেরা ব্যবহার", "নেটওয়ার্ক খরচ"]}
        rows={[
          [
            <code key="c">dns-prefetch</code>,
            "ডোমেইনের IP আগেই রেজলভ করে রাখে",
            "থার্ড-পার্টি সার্ভিস (analytics, chatbot)",
            "অতি নগণ্য 🟢",
          ],
          [
            <code key="c">preconnect</code>,
            "DNS + TCP + TLS কানেকশন ওপেন রাখে",
            "এক্সটার্নাল API সার্ভার, ইমেজ CDN",
            "মাঝারি (১-২টির বেশি নয়) 🟡",
          ],
          [
            <code key="c">preload</code>,
            "চলতি পেজের ফাইল হাই-প্রায়োরিটিতে নামায়",
            "LCP hero image, critical font",
            "উচ্চ (বর্তমান ব্যান্ডউইথ খরচ করে) 🟠",
          ],
          [
            <code key="c">prefetch</code>,
            "পরের পেজের অ্যাসেট idle টাইমে নামায়",
            "পরবর্তী রুটের JS/CSS",
            "কম (idle-time execution) 🟢",
          ],
        ]}
      />

      <Line name="ভুলু ভাই">
        মার্ভেলাস ফাহিম! API সার্ভারের ডোমেইনে <code>preconnect</code> করলাম আর হিরো ইমেজে{" "}
        <code>priority</code> দিলাম। এখন পেজ লোড হওয়া মাত্রই API কানেকশনের জন্য সময় নষ্ট হয় না — LCP
        ২.৪ সেকেন্ড থেকে কমে ০.৯ সেকেন্ডে চলে এসেছে।
      </Line>

      {/* ── Takeaways ─────────────────────────────────────────────────── */}
      <H2 id="takeaway">Production Takeaways</H2>

      <Note>
        <ul>
          <li>
            <strong>Do not overuse preload:</strong> একসাথে অনেক ফাইল preload করলে মূল JS/CSS
            ডাউনলোডে বাধা পড়ে এবং FCP স্লো হয় — কেবল LCP ইমেজ বা primary font preload করুন।
          </li>
          <li>
            <strong>Limit preconnect connections:</strong> <code>preconnect</code> সার্ভার রিসোর্স ধরে
            রাখে; ২টির বেশি ডোমেইনে ব্যবহার করবেন না — কম গুরুত্বপূর্ণ ডোমেইনে{" "}
            <code>dns-prefetch</code> যথেষ্ট।
          </li>
          <li>
            <strong>Leverage next/image priority:</strong> ম্যানুয়ালি preload লিংক লেখার দরকার নেই —{" "}
            <code>&lt;Image priority /&gt;</code> দিলেই Next.js নিরাপদে preload ট্যাগ ইনজেক্ট করে।
          </li>
        </ul>
      </Note>
    </article>
  );
}
