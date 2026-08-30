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
    label: { bn: "CLS ০.৩৮ — বাটন লাফাচ্ছে", en: "CLS 0.38 — the button jumps" },
  },
  {
    id: "architecture",
    label: {
      bn: "FOUT বনাম metric matching",
      en: "FOUT vs metric matching",
    },
  },
  {
    id: "mechanisms",
    label: { bn: "৪টি মূল ফিচার", en: "Four core features" },
  },
  {
    id: "implementation",
    label: { bn: "Zero-CLS ফন্ট সিস্টেম", en: "A zero-CLS font system" },
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

export default function FontLoadingLayoutShift() {
  return (
    <article className="doc-prose">
      {/* ── The problem ───────────────────────────────────────────────── */}
      <H2 id="the-problem" anchorOnly>
        CLS ০.৩৮ — বাটন লাফাচ্ছে
      </H2>

      <p>
        বিকেল ৫:১৫। ভুলু ভাই তার স্পোর্টস নিউজ পোর্টালের মোবাইল স্ক্রিন কাঁপতে দেখে মাথায় হাত দিয়ে
        বসে আছেন। পেজটি ওপেন হওয়ার ১ সেকেন্ড পর কাস্টম ফন্ট লোড হতেই টেক্সট বড় হয়ে নিচে নেমে গেল এবং
        লাইভ ম্যাচের বাটনটি লাফ দিয়ে সরে গেল।
      </p>

      <Line name="ভুলু ভাই">
        ফাহিম! ইউজাররা একটা নিউজ লিংকে ক্লিক করতে গেলে ঠিক সেই মুহূর্তে ফন্ট লোড হয়ে বাটন নিচে নেমে
        যাচ্ছে, আর তারা ভুল করে অন্য জায়গায় ক্লিক করে ফেলছে! Lighthouse-এ CLS স্কোর ০.৩৮ — লাল বাতি
        জ্বলছে।
      </Line>

      <Line name="ফাহিম">
        ভুলু ভাই! একে বলা হয় FOUT (Flash of Unstyled Text) এবং FOIT (Flash of Invisible Text)। আপনি
        সরাসরি CDN থেকে ফন্ট লোড করছেন। ব্রাউজার প্রথমে ফলব্যাক সিস্টেম ফন্ট দিয়ে টেক্সট রেন্ডার করে,
        এরপর ফন্ট ফাইল ডাউনলোড শেষ হলে টেক্সটের সাইজ বদলে যায় এবং পুরো লেআউট লাফ দিয়ে নিচে নেমে যায়।
      </Line>

      <Line name="নেক্সট-ভাই">
        একদম! <code>next/font</code> বিল্ড-টাইমে ফন্টটি ডাউনলোড করে প্রোডাকশন বান্ডলে সেলফ-হোস্ট করে
        নেয়। শুধু তাই নয় — এটি সিস্টেম ফলব্যাক ফন্টের মেট্রিক (<code>size-adjust</code>,{" "}
        <code>ascent-override</code>) গাণিতিকভাবে অ্যাডজাস্ট করে, যাতে কাস্টম ফন্ট লোড হওয়ার আগের ও
        পরের টেক্সট ঠিক একই জায়গা দখল করে। ফলে CLS ০.০০-এ নেমে আসে।
      </Line>

      {/* ── Architecture ──────────────────────────────────────────────── */}
      <H2 id="architecture">১. Traditional Font Shift vs. next/font Metric Matching</H2>

      <Diagram>{`┌─────────────────────────────────────────────────────────────────────────┐
│                 FOUT / CLS VS NEXT/FONT METRIC MATCHING                 │
└─────────────────────────────────────────────────────────────────────────┘

 ❌ TRADITIONAL GOOGLE FONTS CDN (FOUT & high CLS)
 1. page loads ──► system font renders ("Hello World" width: 120px)
 2. font downloads (500 ms later)
 3. custom font swaps in ──► same text now 150px wide
 4. result: the layout jumps downwards 💥 (CLS: 0.38 — poor) 🔴

───────────────────────────────────────────────────────────────────────────

 🟢 NEXT/FONT AUTOMATIC METRIC MATCHING (zero CLS)
 1. page loads ──► the fallback is adjusted with a size-adjust override
                   ("Hello World" width: 150px — an exact match)
 2. the pre-hosted local font loads
 3. the custom font swaps into exactly the same space
 4. result: zero layout shift ⚡ (CLS: 0.00) 🟢`}</Diagram>

      {/* ── Mechanisms ────────────────────────────────────────────────── */}
      <H2 id="mechanisms">২. next/font-এর ৪টি মূল শক্তিশালী ফিচার</H2>

      <p>
        <strong>Zero external network requests:</strong> গুগল বা কোনো থার্ড-পার্টি সার্ভারে ফন্টের জন্য
        HTTP রিকোয়েস্ট যায় না — ফন্ট ফাইল আপনার নিজের স্ট্যাটিক অ্যাসেট ডোমেইন থেকেই লোড হয় (privacy
        ও GDPR compliant)।
      </p>

      <p>
        <strong>Automatic fallback metric override:</strong> Next.js ব্যাকগ্রাউন্ডে এমন CSS রুল তৈরি
        করে যাতে সিস্টেমের <code>sans-serif</code> বা <code>serif</code> ফন্টটি কাস্টম ফন্টের সমান হাইট
        ও উইডথ দখল করে।
      </p>

      <p>
        <strong>Variable fonts optimization:</strong> ভ্যারিয়েবল ফন্ট ব্যবহার করলে একটিমাত্র লাইটওয়েট
        ফাইলেই ১০০ থেকে ৯০০ পর্যন্ত সব ওয়েট কভার হয়ে যায়।
      </p>

      <p>
        <strong>Built-in subsetting:</strong> <code>subsets: [&apos;latin&apos;]</code> বা প্রয়োজনীয়
        ক্যারেক্টার সেট উল্লেখ করে দিলে অপ্রয়োজনীয় গ্লিফ বাদ দিয়ে ফাইল সাইজ ৮০% পর্যন্ত কমে আসে।
      </p>

      {/* ── Implementation ────────────────────────────────────────────── */}
      <H2 id="implementation">৩. Production Code Implementation</H2>

      <H3>❌ Anti-pattern — CDN link or CSS @import</H3>

      <CodeBlock filename="app/layout.tsx">{`<!-- 🔴 POOR PRACTICE: an external CDN call means a late download and layout shift -->
<head>
  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link
    href="https://fonts.googleapis.com/css2?family=Inter:wght@400;700&display=swap"
    rel="stylesheet"
  />
</head>`}</CodeBlock>

      <H3>🟢 Production pattern — next/font/google for zero-CLS typography</H3>

      <CodeBlock filename="app/layout.tsx">{`// 🟢 PRODUCTION PATTERN: a zero-CLS font system with next/font
import { Inter, Hind_Siliguri } from 'next/font/google';
import './globals.css';

// 🟢 STEP 1: the English font (variable weight + subset)
const inter = Inter({
  subsets: ['latin'],
  display: 'swap', // 🟢 keeps text visible while the font downloads
  variable: '--font-inter',
});

// 🟢 STEP 2: the Bengali font
const hindSiliguri = Hind_Siliguri({
  weight: ['400', '600', '700'],
  subsets: ['bengali'],
  display: 'swap',
  variable: '--font-hind-siliguri',
});

export const metadata = {
  title: 'Sports News Portal',
  description: 'Fastest live sports updates',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="bn"
      // 🟢 STEP 3: attach the font CSS variables to the document root
      className={\`\${inter.variable} \${hindSiliguri.variable} font-sans\`}
    >
      <body
        className={\`\${hindSiliguri.className} bg-slate-950 text-slate-100 antialiased min-h-screen\`}
      >
        <header className="p-4 border-b border-slate-800 bg-slate-900">
          <h1 className="text-xl font-bold text-red-500">স্পোর্টস আপডেট লাইভ ⚽</h1>
        </header>

        <main className="p-6 max-w-4xl mx-auto">{children}</main>
      </body>
    </html>
  );
}`}</CodeBlock>

      <p>
        নিজের কেনা বা কাস্টম <code>.woff2</code> ফন্ট থাকলে <code>next/font/local</code> একই মেট্রিক
        ম্যাচিং সুবিধা দেয়:
      </p>

      <CodeBlock filename="lib/fonts.ts">{`// 🟢 PRODUCTION PATTERN: a custom local font
import localFont from 'next/font/local';

export const myCustomFont = localFont({
  src: [
    {
      path: '../public/fonts/CustomFont-Regular.woff2',
      weight: '400',
      style: 'normal',
    },
    {
      path: '../public/fonts/CustomFont-Bold.woff2',
      weight: '700',
      style: 'normal',
    },
  ],
  display: 'swap',
  variable: '--font-custom',
});`}</CodeBlock>

      {/* ── Matrix ────────────────────────────────────────────────────── */}
      <H2 id="matrix">৪. Optimization Comparison Matrix</H2>

      <Table
        head={["পারফরম্যান্স ইন্ডিকেটর", "CDN / @import Google Fonts", "next/font"]}
        rows={[
          [
            "Network requests",
            "গুগল সার্ভারে ২-৩টি অতিরিক্ত HTTP রিকোয়েস্ট 🔴",
            "জিরো থার্ড-পার্টি রিকোয়েস্ট (self-hosted) 🟢",
          ],
          [
            "Cumulative Layout Shift",
            "০.১৫ – ০.৪৫ (দৃশ্যমান লাফানো) 🔴",
            "০.০০ (মেট্রিক অ্যাডজাস্টমেন্ট) 🟢",
          ],
          [
            "Font display strategy",
            "ব্রাউজার ডিফল্ট (FOIT blocking) 🔴",
            <span key="d">
              <code>display: &apos;swap&apos;</code> বিল্ট-ইন টিউনড 🟢
            </span>,
          ],
          [
            "Privacy compliance",
            "ইউজারের IP গুগলে যায় 🔴",
            "১০০% সেলফ-হোস্টেড 🟢",
          ],
        ]}
      />

      <Line name="ভুলু ভাই">
        অসাধারণ ফাহিম! <code>next/font/google</code> দিয়ে বাংলা Hind Siliguri ও ইংরেজি Inter কনফিগার
        করলাম। এখন মোবাইল স্ক্রিনে পেজ ওপেন করার পর কোনো বাটন বা টেক্সট এক চুলও নড়ে না — CLS এখন ০.০০।
      </Line>

      {/* ── Takeaways ─────────────────────────────────────────────────── */}
      <H2 id="takeaway">Production Takeaways</H2>

      <Note>
        <ul>
          <li>
            <strong>Ship .woff2 for local fonts:</strong> <code>next/font</code> নিজে সবচেয়ে লাইটওয়েট{" "}
            <code>.woff2</code> ব্যবহার করে; ম্যানুয়াল কাস্টম ফন্টেও সবসময় <code>.woff2</code> ফাইল দিন।
          </li>
          <li>
            <strong>Utilize display: &apos;swap&apos;:</strong> নেটওয়ার্ক স্লো থাকলেও টেক্সট অদৃশ্য
            (FOIT) থাকবে না — ফলব্যাক দেখিয়ে পরে নিঃশব্দে সোয়াপ হবে, কোনো লেআউট শিফট ছাড়াই।
          </li>
          <li>
            <strong>Use variable fonts whenever possible:</strong> একটিমাত্র ফাইলেই একাধিক ওয়েট
            (১০০-৯০০) কভার হয়, ফলে নেটওয়ার্ক পেলোড অনেক কমে যায়।
          </li>
        </ul>
      </Note>
    </article>
  );
}
