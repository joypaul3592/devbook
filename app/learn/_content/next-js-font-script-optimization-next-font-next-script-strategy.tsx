import { CodeBlock, Diagram, H2, Line, Note } from "@/components/learn/DocParts";
import type { Bi } from "@/lib/curriculum";

/** Section anchors — consumed by the "on this page" rail. */
export const headings: { id: string; label: Bi }[] = [
  {
    id: "the-problem",
    label: { bn: "ফন্ট ঝিলিক আর থ্রেড জাম", en: "Font flash and a jammed thread" },
  },
  {
    id: "fonts",
    label: { bn: "next/font — Zero Layout Shift", en: "next/font — zero layout shift" },
  },
  {
    id: "scripts",
    label: { bn: "next/script — strategy", en: "next/script — strategy" },
  },
  {
    id: "takeaway",
    label: { bn: "Production Takeaways", en: "Production takeaways" },
  },
];

export default function FontScriptOptimization() {
  return (
    <article className="doc-prose">
      {/* ── The problem ───────────────────────────────────────────────── */}
      <H2 id="the-problem" anchorOnly>
        ফন্ট ঝিলিক আর থ্রেড জাম
      </H2>

      <p>
        বিকালের আড্ডা। ভুলু ভাই চায়ে চুমুক দিতে দিতে বিরক্ত হয়ে ল্যাপটপটা ঘোরালেন।
      </p>

      <Line name="ভুলু ভাই">
        নেক্সট-ভাই! পারফর্মেন্স অপটিমাইজেশনের পেছনে তো জীবন কাবার করে দিলাম, তাও সাইটে
        দুইটা ফাউল প্রবলেম পিছু ছাড়ছে না! এক, সাইট লোড হওয়ার সময় ফন্ট কয়েক
        মিলি-সেকেন্ডের জন্য একদম বদলে গিয়ে ঝিলিক মেরে ওঠে (FOUT Effect)। আর দুই,
        আমাদের মার্কেটার ভাই গুগলের Analytics, Tag Manager আর Facebook Pixel-এর ১০টা
        স্ক্রিপ্ট গুঁজে দিয়েছে। এগুলো লোড হতে গিয়ে মেইন ফ্রন্টএন্ড থ্রেড জাম করে দিচ্ছে!
        ইউজার বাটনে ক্লিক করলে ২ সেকেন্ড পর রেসপন্স করে!
      </Line>

      <Line name="নেক্সট-ভাই">
        (হেসে) ভুলু, তুই তো ফ্রন্টএন্ড পারফর্মেন্সের দুই বিষফোঁড়া —{" "}
        <strong>Layout Shift due to Fonts</strong> আর{" "}
        <strong>Main Thread Blocking due to Third-party Scripts</strong>-এর মুখোমুখি
        হয়েছিস!
      </Line>

      {/* ── Fonts ─────────────────────────────────────────────────────── */}
      <H2 id="fonts">১. next/font — Zero Layout Shift</H2>

      <Line name="ভুলু ভাই">
        ফন্টের আবার কী দোষ ভাই? আমি তো সাধারণ Google Fonts{" "}
        <code>&lt;link&gt;</code> দিয়ে HTML-এর হেডে বসিয়েছিলাম!
      </Line>

      <Line name="নেক্সট-ভাই">
        ওখানেই তো বড় ভুল! যখন তুই সাধারণ <code>&lt;link&gt;</code> দিয়ে বাইরের গুগল
        সার্ভার থেকে ফন্ট আনিস — ব্রাউজার নেটওয়ার্ক রিকোয়েস্ট পাঠায়, আর ততক্ষণ সিস্টেমে
        থাকা নরমাল ফন্ট (যেমন Times New Roman) দেখায়। তারপর ফন্ট ডাউনলোড শেষ হলে হঠাৎ
        নতুন ফন্ট অ্যাপ্লাই হয়, আর পুরো লেখার সাইজ বদলে গিয়ে ইউআই শিফটিং হয়!
      </Line>

      <p>
        এই ফন্ট জাম্পিং ও লেআউট শিফটিং বন্ধ করতে Next.js এনেছে{" "}
        <code>next/font</code>!
      </p>

      <Diagram>{`[Traditional <link> Fonts]
   └─> External Network Fetching ──> Font Flash (FOUT) & Layout Shift (CLS ❌)

[next/font Architecture]
   └─> Zero External Request (Self-hosted at build) ──> Zero CLS & Instant Loading ⚡`}</Diagram>

      <Line name="ভুলু ভাই">
        <code>next/font</code> কী আলাদা ম্যাজিক করে ভাই?
      </Line>

      <Line name="নেক্সট-ভাই">
        <code>next/font</code> বিল্ড-টাইমেই ফন্ট ফাইলগুলোকে ডাউনলোড করে তোর ফ্রন্টএন্ড
        অ্যাসেটের ভেতরে <strong>self-host</strong> করে নেয়! গুগল বা বাইরের কোনো সার্ভারে
        রিকোয়েস্টই যায় না! সাথে এটি স্বয়ংক্রিয়ভাবে একটা ম্যাচিং fallback ফন্ট বানায় —
        CSS-এর <code>size-adjust</code> দিয়ে সিস্টেম ফন্টটাকে আসল ফন্টের মাপে টিউন করে
        দেয়, তাই সোয়াপের সময় এক মিলি-সেকেন্ডের জন্যও লেখা লাফায় না!
      </Line>

      <CodeBlock filename="app/layout.tsx">{`// ✅ Zero-Layout-Shift Font Architecture
import { Inter } from 'next/font/google';

const inter = Inter({
  subsets: ['latin'],
  display: 'swap', // ⚡ Smooth font swap strategy
});

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={inter.className}>
      <body>{children}</body>
    </html>
  );
}`}</CodeBlock>

      <Note>
        <p>
          এই সাইটটাও ঠিক এই কৌশলেই চলে — Latin-এর জন্য Google Sans Flex আর বাংলার জন্য
          Anek Bangla, দুটোর x-height মিলিয়ে <code>size-adjust</code> বসানো। দুটো আলাদা
          স্ক্রিপ্ট এক লাইনে মেশালে ওই মাপ মেলানোটা নিজে হাতে করতে হয়।
        </p>
      </Note>

      {/* ── Scripts ───────────────────────────────────────────────────── */}
      <H2 id="scripts">২. next/script — strategy দিয়ে থ্রেড বাঁচানো</H2>

      <Line name="ভুলু ভাই">
        (চোখ বড় বড় করে) তারমানে ফন্ট সাইটে লোকাল ফাইলের মতো বিল্ট-ইন হয়ে যাবে?! জোস তো!
        কিন্তু নেক্সট-ভাই, থার্ড-পার্টি ট্র্যাকিং স্ক্রিপ্টগুলোর কী করব? ওগুলো তো মেইন
        জাভাস্ক্রিপ্ট থ্রেড পুরো হ্যাং করে রাখে!
      </Line>

      <Line name="নেক্সট-ভাই">
        সেটার জন্য সাধারণ <code>&lt;script&gt;</code> ব্যবহার বন্ধ করে ব্যবহার করবি{" "}
        <code>next/script</code>-এর স্ট্র্যাটেজি প্যাটার্ন!
      </Line>

      <ul>
        <li>
          <code>strategy=&quot;afterInteractive&quot;</code> <em>(default)</em> — পেজ
          ইন্টারঅ্যাক্টিভ হওয়ার সাথে সাথে ব্যাকগ্রাউন্ডে রান করবে (Google Analytics-এর
          জন্য পারফেক্ট)।
        </li>
        <li>
          <code>strategy=&quot;lazyOnload&quot;</code> — পেজের সব কন্টেন্ট ও ইমেজ লোড
          শেষ হওয়ার পর নিভৃতে ব্যাকগ্রাউন্ডে রান করবে (Chatbot, Customer Support
          Widget-এর জন্য)।
        </li>
        <li>
          <code>strategy=&quot;beforeInteractive&quot;</code> — হাইড্রেশনের আগেই চলবে।
          শুধু সত্যিকারের ক্রিটিক্যাল স্ক্রিপ্টে (যেমন bot detection, cookie consent),
          কারণ এটা পেজকে ব্লক করে।
        </li>
        <li>
          <code>strategy=&quot;worker&quot;</code> <em>(experimental)</em> — স্ক্রিপ্টটিকে
          ব্রাউজারের মূল ফ্রন্টএন্ড থ্রেড থেকে সরিয়ে সম্পূর্ণ আলাদা Web Worker থ্রেডে
          চালাবে! মেইন থ্রেডের ওপর কোনো চাপই পড়ে না।
        </li>
      </ul>

      <CodeBlock filename="components/Analytics.tsx">{`import Script from 'next/script';

export default function Analytics() {
  return (
    <>
      {/* ⚡ Loads lazily after the page is fully interactive */}
      <Script
        src="https://example.com/heavy-analytics.js"
        strategy="lazyOnload"
      />
    </>
  );
}`}</CodeBlock>

      <Note>
        <p>
          <code>strategy=&quot;worker&quot;</code> এখনো experimental — এটা Partytown-এর
          ওপর চলে, আর ব্যবহার করার আগে{" "}
          <code>next.config.js</code>-এ{" "}
          <code>experimental.nextScriptWorkers: true</code> অন করতে হয়। ফ্ল্যাগ ছাড়া
          স্ট্র্যাটেজিটা কাজ করবে না। সব স্ক্রিপ্ট worker-এ চলেও না — যেগুলোর সরাসরি DOM
          অ্যাক্সেস দরকার, সেগুলো ভাঙতে পারে। তাই ডিফল্ট হিসেবে{" "}
          <code>lazyOnload</code> ধরাই নিরাপদ।
        </p>
      </Note>

      <Line name="ভুলু ভাই">
        (ল্যাপটপে কোড চেঞ্জ করতে করতে) ওরে বাপ্পরে! আমি চ্যাটবটের ভারী স্ক্রিপ্ট হেডার
        ফাইলে দিয়ে রেখেছিলাম, তাই সাইটের INP আর TBT লালে লাল হয়ে ছিল! এখন{" "}
        <code>lazyOnload</code> মারতেই মেইন থ্রেড পুরো ফাঁকা!
      </Line>

      <Line name="নেক্সট-ভাই">
        বিঙ্গো! ব্রাউজারের মেইন থ্রেডকে যতটা সম্ভব থার্ড-পার্টি স্ক্রিপ্টের জঞ্জাল থেকে
        মুক্ত রাখবি, তোর ফ্রন্টএন্ড হবে লাইটনিং ফাস্ট!
      </Line>

      {/* ── Takeaway ──────────────────────────────────────────────────── */}
      <H2 id="takeaway">💡 Production Frontend Takeaways</H2>

      <ul>
        <li>
          <strong>Zero-Layout-Shift Fonts:</strong> <code>next/font</code> ফন্ট ফাইল
          স্বয়ংক্রিয়ভাবে বিল্ড টাইমে সেল্ফ-হোস্ট করে এবং মেট্রিক-ম্যাচড fallback বানায়,
          ফলে ফন্ট ডাউনলোডজনিত FOUT ও CLS জিরো হয়ে যায়।
        </li>
        <li>
          <strong>Main-Thread Protection:</strong> সাধারণ <code>&lt;script&gt;</code>{" "}
          ট্যাগের বদলে <code>next/script</code> ব্যবহার করে থার্ড-পার্টি স্ক্রিপ্টকে{" "}
          <code>lazyOnload</code> বা <code>afterInteractive</code> স্ট্র্যাটেজিতে চালানো
          বেস্ট প্র্যাকটিস।
        </li>
        <li>
          <strong>Web Worker Offloading:</strong> সর্বোচ্চ পারফর্মেন্সের জন্য ভারী
          অ্যানালিটিক্স বা ট্র্যাকারগুলোকে <code>strategy=&quot;worker&quot;</code> দিয়ে
          মূল ইউআই থ্রেড থেকে বিচ্ছিন্ন রাখা যায় — তবে সেটা এখনো experimental, তাই আগে
          যাচাই করে নিতে হবে।
        </li>
      </ul>
    </article>
  );
}
