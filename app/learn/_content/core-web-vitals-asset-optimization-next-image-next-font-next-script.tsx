import {
  CodeBlock,
  Diagram,
  H2,
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
      bn: "লাইটহাউস স্কোর ৪২",
      en: "A Lighthouse score of 42",
    },
  },
  {
    id: "next-image",
    label: { bn: "next/image — LCP ও CLS কিলার", en: "next/image" },
  },
  {
    id: "next-font",
    label: { bn: "next/font — জিরো লেআউট শিফট", en: "next/font" },
  },
  {
    id: "next-script",
    label: { bn: "next/script — লোডিং স্ট্র্যাটেজি", en: "next/script" },
  },
  {
    id: "matrix",
    label: { bn: "Strategy Quick Reference", en: "Strategy quick reference" },
  },
  {
    id: "takeaway",
    label: { bn: "Production Takeaways", en: "Production takeaways" },
  },
];

export default function CoreWebVitalsAssets() {
  return (
    <article className="doc-prose">
      {/* ── The problem ───────────────────────────────────────────────── */}
      <H2 id="the-problem" anchorOnly>
        লাইটহাউস স্কোর ৪২
      </H2>

      <p>
        রাত ১০টা। ভুলু ভাই Google Lighthouse দিয়ে তাঁর নতুন ই-কমার্স প্রজেক্টের পারফর্মেন্স
        টেস্ট চালাচ্ছেন। রেজাল্ট আসতেই তিনি চ্যাঁচামেচি জুড়ে দিলেন!
      </p>

      <Diagram>{`Google Lighthouse Audit Report
────────────────────────────────────────────────────────
🔴 Performance Score: 42/100
🔴 Largest Contentful Paint (LCP): 4.8s  (Unoptimized banner image)
🔴 Cumulative Layout Shift (CLS): 0.38   (Font flash & unsized images)
🟡 First Contentful Paint (FCP): 2.2s
────────────────────────────────────────────────────────`}</Diagram>

      <Line name="ভুলু ভাই">
        (হতাশ হয়ে) নেক্সট-ভাই! আমি তো পুরো প্রজেক্টে ডাটা ক্যাশিং আর মেমোইজেশন ঠিকঠাকই সেট
        করেছিলাম! তবু লাইটহাউসে স্কোর ৪২ কেন?! ল্যান্ডিং পেজে ইমেজের সাইজ ৩ মেগাবাইট হয়ে
        ঝুলছে, আর কাস্টম ফন্ট লোড হওয়ার সময় পুরো পেজের বাটন-টেক্সট ১ সেকেন্ড ধরে লাফালাফি
        করে নিচে নেমে যাচ্ছে!
      </Line>

      <Line name="নেক্সট-ভাই">
        (হেসে) ভুলু! শুধু ব্যাকএন্ড ডাটা ফেচিং ক্যাশ করলেই ওয়েবসাইট ফাস্ট হয় না! গুগলের
        Core Web Vitals (LCP, CLS, INP) ভালো করতে হলে ফ্রন্টএন্ডের অ্যাসেট — Images, Fonts,
        Scripts — অপটিমাইজ করতে হবে। আর সুখবর হলো, Next.js-এর ভেতরেই ৩টি পাওয়ারফুল
        অপটিমাইজার ইনবিল্ট আছে: <code>next/image</code>, <code>next/font</code>, এবং{" "}
        <code>next/script</code>!
      </Line>

      {/* ── next/image ────────────────────────────────────────────────── */}
      <H2 id="next-image">১. next/image — LCP ও CLS কিলার</H2>

      <Line name="নেক্সট-ভাই">
        প্লেইন HTML <code>&lt;img&gt;</code> ট্যাগ ব্যবহার করা মানে নিজের পারফর্মেন্সে নিজেই
        কুড়াল মারা! সাধারণ ট্যাগ অন-দ্য-ফ্লাই কম্প্রেস করে না, AVIF বা WebP-তে কনভার্ট করে
        না, আর width/height না দিলে Layout Shift ঘটায়।
      </Line>

      <ul>
        <li>
          <strong>Auto WebP/AVIF:</strong> ডিভাইস অনুযায়ী সেরা আধুনিক ফরম্যাট সার্ভ করে।
        </li>
        <li>
          <strong>On-Demand Resizing:</strong> মোবাইলে ছোট, ডেস্কটপে বড় ইমেজ পাঠায়।
        </li>
        <li>
          <strong>CLS Prevention:</strong> আগেই স্পেস রিজার্ভ করে রাখে, লেআউট লাফায় না।
        </li>
        <li>
          <strong>Native Lazy Loading:</strong> ভিউপোর্টে না আসা পর্যন্ত লোড হয় না।
        </li>
      </ul>

      <CodeBlock filename="components/banner.tsx">{`import Image from 'next/image';
import heroBanner from '@/public/hero.jpg'; // ⚡ Static import gives width & height for free

export function HeroBanner() {
  return (
    <div className="relative w-full h-[400px]">
      {/* 🚀 1. Local / static image */}
      <Image
        src={heroBanner}
        alt="Hero Banner"
        placeholder="blur" // Instantly shows a blurred low-res image while downloading
        priority          // ⚡ CRITICAL for above-the-fold LCP images — disables lazy loading
        className="object-cover"
      />

      {/* 🚀 2. Remote image (Cloudinary / S3 / external URL) */}
      <Image
        src="https://images.unsplash.com/photo-1505740420928-5e560c06d30e"
        alt="Product"
        width={500}  // Required for layout stability
        height={500}
        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
      />
    </div>
  );
}`}</CodeBlock>

      <Note>
        <p>
          <strong>Remote Image Config Rule:</strong> থার্ড-পার্টি URL দিয়ে{" "}
          <code>Image</code> ব্যবহার করতে হলে অবশ্যই <code>next.config.ts</code>-এ{" "}
          <code>images.remotePatterns</code> ডিফাইন করতে হবে, না হলে Next.js সিকিউরিটির
          জন্য ইমেজ ব্লক করে দেবে।
        </p>
      </Note>

      <CodeBlock filename="next.config.ts">{`import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'images.unsplash.com' },
      { protocol: 'https', hostname: '*.s3.amazonaws.com' },
    ],
  },
};

export default nextConfig;`}</CodeBlock>

      {/* ── next/font ─────────────────────────────────────────────────── */}
      <H2 id="next-font">২. next/font — জিরো লেআউট শিফট</H2>

      <Line name="ভুলু ভাই">
        নেক্সট-ভাই! ফন্ট লোড হওয়ার সময় টেক্সট লাফায় কেন? আর গুগল ফন্ট ব্যবহার করলে তো
        বাইরের নেটওয়ার্কে রিকোয়েস্ট গিয়ে পেজ স্লো হয়ে যায়!
      </Line>

      <ul>
        <li>
          <strong>FOIT</strong> (Flash of Invisible Text): ফন্ট ডাউনলোড না হওয়া পর্যন্ত
          টেক্সট গায়েব থাকে।
        </li>
        <li>
          <strong>FOUT</strong> (Flash of Unstyled Text): প্রথমে সিস্টেম ফন্ট দেখায়, ফাইল
          নামার পর স্টাইল বদলে সব টেক্সট লাফ দেয়।
        </li>
      </ul>

      <p>
        <code>next/font</code> বিল্ড টাইমে ফন্ট ফাইলটি ডাউনলোড করে তোর নিজের সাইটের স্ট্যাটিক
        অ্যাসেট হিসেবে সেলফ-হোস্ট করিয়ে দেয়! ব্রাউজারকে Google Fonts সার্ভারে বাড়তি কানেকশন
        তৈরি করতে হয় না।
      </p>

      <CodeBlock filename="app/layout.tsx">{`import { Inter, Hind_Siliguri } from 'next/font/google';
import localFont from 'next/font/local';

// ⚡ 1. Google font — self-hosted automatically at build time
const inter = Inter({
  subsets: ['latin'],
  display: 'swap', // Prevents FOIT
  variable: '--font-inter',
});

const banglaFont = Hind_Siliguri({
  weight: ['400', '600', '700'],
  subsets: ['bengali'],
  variable: '--font-bangla',
});

// ⚡ 2. Custom local font (.woff2 / .ttf)
const customSans = localFont({
  src: './fonts/MyCustomFont.woff2',
  display: 'swap',
  variable: '--font-custom-sans',
});

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="bn"
      className={\`\${inter.variable} \${banglaFont.variable} \${customSans.variable}\`}
    >
      <body className="font-sans antialiased">{children}</body>
    </html>
  );
}`}</CodeBlock>

      {/* ── next/script ───────────────────────────────────────────────── */}
      <H2 id="next-script">৩. next/script — লোডিং স্ট্র্যাটেজি</H2>

      <Line name="ভুলু ভাই">
        ভাই! আমাদের সাইটে Google Analytics, Facebook Pixel, Google Tag Manager-এর মতো
        থার্ড-পার্টি স্ক্রিপ্ট লাগে। এগুলো তো রেন্ডারিং আটকে দিয়ে পেজ স্লো করে দেয়!
      </Line>

      <Line name="নেক্সট-ভাই">
        সমাধান <code>next/script</code>-এর <code>strategy</code> প্রোপার্টি! স্ক্রিপ্ট লোড
        হওয়ার সময় নির্ধারণ করে মূল রেন্ডারিং থ্রেডকে ফ্রি রাখা যায়।
      </Line>

      <CodeBlock filename="app/layout.tsx">{`import Script from 'next/script';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html>
      <body>
        {children}

        {/* 🚀 lazyOnload — loads during idle time AFTER the page is interactive */}
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-XYZ123"
          strategy="lazyOnload"
        />

        {/* 🚀 afterInteractive (default) — right after the page becomes interactive */}
        <Script id="facebook-pixel" strategy="afterInteractive">
          {\`fbq('init', '123456789');\`}
        </Script>

        {/* 🚀 worker — offloads execution to a Web Worker via Partytown */}
        {/* <Script src="..." strategy="worker" /> */}
      </body>
    </html>
  );
}`}</CodeBlock>

      {/* ── Matrix ────────────────────────────────────────────────────── */}
      <H2 id="matrix">৪. Strategy Quick Reference</H2>

      <Table
        head={["Strategy", "কখন এক্সিকিউট হয়", "সেরা ইউজ কেস"]}
        rows={[
          [
            <code key="before">beforeInteractive</code>,
            "পেজের হাইড্রেশন ও সার্ভার কোড চলার পূর্বে",
            "বট ডিটেকশন, কুকি কনসেন্ট ব্যানার",
          ],
          [
            <code key="after">afterInteractive</code>,
            "পেজ ইন্টারঅ্যাক্টিভ হওয়ার পরই (ডিফল্ট)",
            "Analytics, Tag Manager, Ads, Social Widgets",
          ],
          [
            <code key="lazy">lazyOnload</code>,
            "সব রিসোর্স লোড হওয়ার পর অবসর সময়ে",
            "লাইভ চ্যাট উইজেট, হেল্পডেস্ক পপ-আপ",
          ],
        ]}
      />

      <Line name="ভুলু ভাই">
        (আনন্দিত হয়ে) ভাই রে ভাই! মেইন ব্যানারে <code>priority</code> বসাতেই LCP ৫ সেকেন্ড
        থেকে ০.৮ সেকেন্ডে নেমে এসেছে, <code>next/font</code>-এ CLS এখন ০.০০, আর Facebook
        Pixel-এ <code>lazyOnload</code> দেওয়ায় মেইন থ্রেড মাখনের মতো ফ্রি! লাইটহাউস স্কোর
        এখন ৯৮/১০০! 🔥
      </Line>

      {/* ── Takeaways ─────────────────────────────────────────────────── */}
      <H2 id="takeaway">Production Takeaways</H2>

      <Note>
        <ul>
          <li>
            <strong>Above-the-Fold LCP:</strong> ভিউপোর্টে প্রথমেই দেখা যাওয়া মূল ব্যানারে
            অবশ্যই <code>priority</code> প্রোপ দিতে হবে, যাতে Next.js সেটির lazy loading
            বন্ধ করে দ্রুততম সময়ে লোড করে।
          </li>
          <li>
            <strong>Self-Hosted Fonts:</strong> <code>next/font</code> ফন্ট ফাইল বিল্ড
            ফোল্ডারে প্যাক করে দেয় — জিরো এক্সটার্নাল রিকোয়েস্ট, ফলে GDPR ঝামেলাও এড়ানো
            যায়।
          </li>
          <li>
            <strong>Offload Third-Party Scripts:</strong> অপ্রয়োজনীয় ট্র্যাকার বা চ্যাট
            উইজেটে সবসময় <code>lazyOnload</code> ব্যবহার করা ইন্ডাস্ট্রি স্ট্যান্ডার্ড।
          </li>
        </ul>
      </Note>
    </article>
  );
}
