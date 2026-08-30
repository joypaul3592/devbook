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
    label: { bn: "ফন্ট এলেই লেখা কেঁপে ওঠে", en: "The text jumps when the font lands" },
  },
  {
    id: "architecture",
    label: {
      bn: "next/font সেলফ-হোস্টিং আর্কিটেকচার",
      en: "The next/font self-hosting architecture",
    },
  },
  {
    id: "mechanisms",
    label: { bn: "৩টি মূল মেকানিক্স", en: "Three core mechanics" },
  },
  {
    id: "implementation",
    label: { bn: "Google ও local font সেটআপ", en: "Google & local font setup" },
  },
  {
    id: "matrix",
    label: { bn: "Optimization Metric Comparison", en: "Optimization metric comparison" },
  },
  {
    id: "takeaway",
    label: { bn: "Production Takeaways", en: "Production takeaways" },
  },
];

export default function NextFontOptimization() {
  return (
    <article className="doc-prose">
      {/* ── The problem ───────────────────────────────────────────────── */}
      <H2 id="the-problem" anchorOnly>
        ফন্ট এলেই লেখা কেঁপে ওঠে
      </H2>

      <p>
        দুপুর ২:১০। ভুলু ভাই তার স্পোর্টস নিউজ সাইটে Google Fonts থেকে একটি কাস্টম ফন্ট যুক্ত করেছেন।
        কিন্তু সাইট রিফ্রেশ করতেই দেখলেন — টেক্সট প্রথমে একটি বেসিক ফলব্যাক ফন্টে দেখা যায়, আর ১ সেকেন্ড
        পর হঠাৎ নতুন ফন্টটি লোড হয়ে পুরো পেজের লেআউট কেঁপে ওঠে।
      </p>

      <Line name="ভুলু ভাই">
        ফাহিম! এই অদ্ভুত আচরণ কী? পেজ ওপেন করার পর ফন্ট লোড হতে এত সময় নিচ্ছে কেন? আর ফন্ট লোড হওয়ার
        সাথে সাথে লেখাগুলো কেন নিচে নেমে ঝাঁকুনি দিচ্ছে?
      </Line>

      <Line name="ফাহিম">
        ভুলু ভাই! এটাকে বলা হয় FOUT (Flash of Unstyled Text) এবং FOIT (Flash of Invisible Text)। আর এর
        কারণে যে লেআউট ঝাঁকুনি হয় তার নাম CLS (Cumulative Layout Shift) — Core Web Vitals-এর জন্য
        মারাত্মক ক্ষতিকর।
      </Line>

      <Line name="নেক্সট-ভাই">
        একদম! ট্র্যাডিশনাল পদ্ধতিতে ব্রাউজার এক্সটার্নাল ফন্ট ফাইল (Google Fonts CDN) ডাউনলোড করতে
        অতিরিক্ত নেটওয়ার্ক রিকোয়েস্ট পাঠায়। কিন্তু <code>next/font</code>-এর ম্যাজিক হলো — এটি
        বিল্ড-টাইমে ফন্ট ফাইলটি ডাউনলোড করে আপনার স্ট্যাটিক অ্যাসেটের সাথে সেলফ-হোস্ট করে নেয়। ফলে
        ব্রাউজারকে ফন্টের জন্য কোনো এক্সটার্নাল রিকোয়েস্টই পাঠাতে হয় না।
      </Line>

      {/* ── Architecture ──────────────────────────────────────────────── */}
      <H2 id="architecture">১. next/font Internal Architecture &amp; Self-Hosting</H2>

      <Diagram>{`┌─────────────────────────────────────────────────────────────────────────┐
│                 NEXT/FONT SELF-HOSTING ARCHITECTURE                     │
└─────────────────────────────────────────────────────────────────────────┘

 ❌ TRADITIONAL GOOGLE FONTS (extra external requests & CLS)
 browser ──► HTML request ──► request fonts.googleapis.com ──► FOUT / CLS 🔴

───────────────────────────────────────────────────────────────────────────

 🟢 NEXT/FONT INLINING & SELF-HOSTING (zero network waterfall)
 Next.js build time (npm run build)
 ┌───────────────────────────────────────────────────────────────────────┐
 │ 1. downloads the font binary (.woff2) from Google / a custom source   │
 │ 2. stores the binary locally in .next/static/media/                   │
 │ 3. generates @font-face CSS with font-metric overrides                │
 └───────────────────────────────────────────────────────────────────────┘
                                   │
                                   ▼
 Browser load time
 ┌───────────────────────────────────────────────────────────────────────┐
 │ HTML ships inlined CSS + zero external domain calls + zero CLS        │
 └───────────────────────────────────────────────────────────────────────┘`}</Diagram>

      {/* ── Mechanisms ────────────────────────────────────────────────── */}
      <H2 id="mechanisms">২. next/font-এর ৩টি মূল অপটিমাইজেশন মেকানিক্স</H2>

      <p>
        <strong>Zero external network waterfall:</strong> <code>next/font/google</code> ব্যবহার করলে
        বিল্ড-টাইমে ফন্টটি ডাউনলোড হয়ে স্থানীয়ভাবে সংরক্ষিত হয়। ব্রাউজারকে{" "}
        <code>fonts.gstatic.com</code>-এ কোনো DNS lookup বা TLS handshake করতে হয় না।
      </p>

      <p>
        <strong>Automatic font subsetting:</strong> পুরো ফন্ট ফাইলের সব ভাষা লোড না করে কেবল প্রয়োজনীয়
        সাবসেট (যেমন <code>latin</code>) লোড করা হয় — এতে ফাইল সাইজ ৫০-৭০% কমে যায়।
      </p>

      <p>
        <strong>Automatic size-adjust &amp; metric overrides:</strong> কাস্টম ফন্ট লোড হওয়ার আগে
        ফলব্যাক ফন্টের সাইজ ও স্পেসিং এমনভাবে অ্যাডজাস্ট করা হয় যাতে ফন্ট সুইচে কোনো পিক্সেল শিফট না
        হয়।
      </p>

      {/* ── Implementation ────────────────────────────────────────────── */}
      <H2 id="implementation">৩. Production Code Implementation</H2>

      <H3>❌ Anti-pattern — fonts via an HTML link tag</H3>

      <CodeBlock filename="app/legacy-head.tsx">{`// 🔴 POOR PRACTICE: an external CSS link causes blocking network calls
export function UnoptimizedHead() {
  return (
    <head>
      {/* 🔴 external network call: slows FCP and causes layout shifts */}
      <link
        href="https://fonts.googleapis.com/css2?family=Inter:wght@400;700&display=swap"
        rel="stylesheet"
      />
    </head>
  );
}`}</CodeBlock>

      <H3>🟢 Production pattern — Google and local fonts via next/font</H3>

      <CodeBlock filename="app/fonts/index.ts">{`// 🟢 STEP 1: centralized font definitions
import { Inter, JetBrains_Mono } from 'next/font/google';
import localFont from 'next/font/local';

// 🟢 a Google variable font
export const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
});

// 🟢 a fixed-weight monospace font
export const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  weight: ['400', '700'],
  display: 'swap',
  variable: '--font-mono',
});

// 🟢 a custom local font (.woff2)
export const banglaCustomFont = localFont({
  src: [
    { path: './BanglaFont-Regular.woff2', weight: '400', style: 'normal' },
    { path: './BanglaFont-Bold.woff2', weight: '700', style: 'normal' },
  ],
  display: 'swap',
  variable: '--font-bangla',
});`}</CodeBlock>

      <CodeBlock filename="app/layout.tsx">{`// 🟢 STEP 2: inject the font CSS variables in the root layout
import { inter, jetbrainsMono, banglaCustomFont } from './fonts';
import './globals.css';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={\`\${inter.variable} \${jetbrainsMono.variable} \${banglaCustomFont.variable}\`}
    >
      <body className="font-sans bg-slate-950 text-slate-100 antialiased">
        {children}
      </body>
    </html>
  );
}`}</CodeBlock>

      <CodeBlock filename="app/globals.css">{`/* 🟢 STEP 3: wire the font variables into your CSS layer */
@layer base {
  body {
    font-family: var(--font-inter), system-ui, sans-serif;
  }
}

.font-mono {
  font-family: var(--font-mono), monospace;
}

.font-bangla {
  font-family: var(--font-bangla), sans-serif;
}`}</CodeBlock>

      {/* ── Matrix ────────────────────────────────────────────────────── */}
      <H2 id="matrix">৪. Optimization Metric Comparison</H2>

      <Table
        head={["মেট্রিক / বৈশিষ্ট্য", "এক্সটার্নাল <link>", "next/font"]}
        rows={[
          [
            "এক্সটার্নাল রিকোয়েস্ট",
            "২+ ডোমেইন (googleapis / gstatic) 🔴",
            "০ (জিরো ওয়াটারফল) 🟢",
          ],
          [
            "ফন্ট লোডিং লেটেন্সি",
            "নেটওয়ার্ক স্পিডের ওপর নির্ভরশীল 🔴",
            "লোকাল অ্যাসেট, জিরো ব্লকড টাইম 🟢",
          ],
          [
            "Cumulative Layout Shift",
            "দৃশ্যমান ঝাঁকুনি (high) 🔴",
            "metric matching-এর কারণে ~০.০০ 🟢",
          ],
          [
            "প্রাইভেসি (GDPR)",
            "ইউজারের IP Google-এ যায় 🔴",
            "সম্পূর্ণ সেলফ-হোস্টেড 🟢",
          ],
        ]}
      />

      <Line name="ভুলু ভাই">
        দারুণ ফাহিম! <code>next/font/google</code> সেট করার সাথে সাথে পেজ রিলোডে টেক্সটের সেই নাচানাচি
        একেবারে ভ্যানিশ হয়ে গেছে! নেটওয়ার্ক ট্যাবেও আর কোনো এক্সটার্নাল ফন্ট CDN রিকোয়েস্ট নেই।
      </Line>

      {/* ── Takeaways ─────────────────────────────────────────────────── */}
      <H2 id="takeaway">Production Takeaways</H2>

      <Note>
        <ul>
          <li>
            <strong>Always use .woff2 for local fonts:</strong> কাস্টম লোকাল ফন্ট ব্যবহারের সময় আধুনিক
            ব্রাউজারের জন্য সবচেয়ে কম্প্রেসড ফরম্যাট <code>.woff2</code> বেছে নিন।
          </li>
          <li>
            <strong>Utilize CSS variables:</strong> <code>next/font</code>-এর <code>variable</code>{" "}
            প্রপার্টি ব্যবহার করে Tailwind বা আপনার ডিজাইন টোকেনের সাথে সহজে সামঞ্জস্য রাখুন।
          </li>
          <li>
            <strong>Prefer variable fonts:</strong> প্রতিটি ওয়েটের আলাদা ফাইলের বদলে variable font
            ব্যবহার করুন — একাধিক ফাইল ডাউনলোডের ঝামেলা দূর হয়।
          </li>
        </ul>
      </Note>
    </article>
  );
}
