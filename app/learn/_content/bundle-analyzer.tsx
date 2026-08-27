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
      bn: "মেগাবাইট কে গিলে খাচ্ছে?",
      en: "What is eating the megabytes?",
    },
  },
  {
    id: "architecture",
    label: {
      bn: "Analyzer-এর বিল্ড পাইপলাইন",
      en: "The analyzer build pipeline",
    },
  },
  {
    id: "setup",
    label: {
      bn: "Next.js 15 সেটআপ",
      en: "Next.js 15 setup",
    },
  },
  {
    id: "reading",
    label: {
      bn: "ট্রিম্যাপ চার্ট পড়া",
      en: "Reading the treemap chart",
    },
  },
  {
    id: "matrix",
    label: { bn: "Metrics ও Optimization Strategy", en: "Metrics & optimization strategy" },
  },
  {
    id: "takeaway",
    label: { bn: "Production Takeaways", en: "Production takeaways" },
  },
];

export default function BundleAnalyzer() {
  return (
    <article className="doc-prose">
      {/* ── The problem ───────────────────────────────────────────────── */}
      <H2 id="the-problem" anchorOnly>
        মেগাবাইট কে গিলে খাচ্ছে?
      </H2>

      <p>
        বিকাল ৫:১৫। ভুলু ভাই তার নেক্সট.জেএস প্রজেক্টের লাইভ ড্যাশবোর্ড টেস্ট করতে গিয়ে দেখলেন, পেজ
        লোড হওয়ার সময় ব্রাউজার নেটওয়ার্ক ট্যাবে <code>main-app.js</code> ফাইলের সাইজ দেখাচ্ছে ২.৪
        Megabytes! ইউজারদের স্লো ৩জি বা মোবাইল ডেটায় সাইট লোড হতে প্রচুর সময় লাগছে।
      </p>

      <Line name="ভুলু ভাই">
        ফাহিম! অনব্যবহৃত প্যাকেজ তো কেটে ফেললাম, কিন্তু এখনো আমাদের ক্লায়েন্ট-সাইড জাভাস্ক্রিপ্ট
        বান্ডল এত বড় কেন? কোন লাইব্রেরি বা কম্পোনেন্টটি গোপনে মেগাবাইট গিলে খাচ্ছে, সেটা ভিজ্যুয়ালি
        জানার কোনো উপায় আছে?
      </Line>

      <Line name="ফাহিম">
        অবশ্যই ভাই! এর জন্য নেক্সট.জেএস-এর অফিশিয়াল টুল <code>@next/bundle-analyzer</code> ব্যবহার
        করা হয়। এটি প্রজেক্ট বিল্ড করার সময় পুরো কোডবেস এবং <code>node_modules</code>-এর একটি
        ইন্টার‍্যাক্টিভ Treemap Chart বানিয়ে দেয়।
      </Line>

      <Line name="নেক্সট-ভাই">
        একদম! এই ট্রিম্যাপ চার্ট খুললেই একটি ভিজ্যুয়াল গ্রিড দেখতে পাবেন — যেখানে প্রতিটি
        জাভাস্ক্রিপ্ট ফাইলের সাইজ অনুযায়ী বক্সের আকার নির্ধারিত হয়। ফলে দৈত্যাকৃতির লাইব্রেরিগুলোকে
        (Heavy Charts, PDF Generator, Date Libraries) সেকেন্ডের মধ্যে চিহ্নিত করে{" "}
        <code>next/dynamic</code> দিয়ে কোড-স্প্লিট করা সহজ হয়ে যায়।
      </Line>

      {/* ── Architecture ──────────────────────────────────────────────── */}
      <H2 id="architecture">১. @next/bundle-analyzer যেভাবে কাজ করে</H2>

      <Diagram>{`┌─────────────────────────────────────────────────────────────────────────┐
│                 NEXT.JS BUNDLE ANALYZER BUILD PIPELINE                  │
└─────────────────────────────────────────────────────────────────────────┘

                        ANALYZE=true npm run build
                                    │
                                    ▼
        ┌────────────────────────────────────────────────────────┐
        │ Next.js compiler intercepts the JavaScript bundles     │
        └───────────────────────────┬────────────────────────────┘
                                    │
                                    ▼
        ┌────────────────────────────────────────────────────────┐
        │ @next/bundle-analyzer middleware processes the chunks  │
        └───────────────────────────┬────────────────────────────┘
                                    │
            ┌───────────────────────┴───────────────────────┐
            ▼                                               ▼
 ┌───────────────────────────┐              ┌───────────────────────────┐
 │ .next/analyze/client.html │              │ .next/analyze/server.html │
 │ (client-side treemap)     │              │ (server components map)   │
 └───────────────────────────┘              └───────────────────────────┘`}</Diagram>

      <p>
        বিল্ড শেষে অফলাইন ব্রাউজার উইন্ডোতে ট্রিম্যাপ চার্টটি ওপেন হয়। প্রতিটি বক্সের আয়তনই তার
        ফাইল সাইজ — অর্থাৎ যে বক্স যত বড়, সে তত বেশি জায়গা দখল করছে:
      </p>

      <Diagram>{`┌─────────────────────────── client.html (treemap) ───────────────────────┐
│ ┌───────────────────────────────────────┐ ┌───────────────────────────┐ │
│ │ node_modules/monaco-editor            │ │ node_modules/recharts     │ │
│ │                                       │ │                           │ │
│ │            920 KB  🔴                 │ │        280 KB  🟠         │ │
│ │                                       │ │                           │ │
│ └───────────────────────────────────────┘ └───────────────────────────┘ │
│ ┌─────────────────────┐ ┌──────────────┐ ┌────────────┐ ┌────────────┐  │
│ │ node_modules/moment │ │ react-dom    │ │ app/       │ │ components/│  │
│ │     230 KB  🟠      │ │  130 KB      │ │  60 KB 🟢  │ │  40 KB 🟢  │  │
│ └─────────────────────┘ └──────────────┘ └────────────┘ └────────────┘  │
└─────────────────────────────────────────────────────────────────────────┘
   Box area = file size. The giants are always the first thing to fix.`}</Diagram>

      {/* ── Setup ─────────────────────────────────────────────────────── */}
      <H2 id="setup">২. Production Setup (Next.js 15 + TypeScript)</H2>

      <H3>Step 1 — ইনস্টলেশন</H3>

      <CodeBlock label="Bash" filename="install.sh">{`npm install @next/bundle-analyzer

# or
pnpm add @next/bundle-analyzer`}</CodeBlock>

      <H3>Step 2 — next.config.ts কনফিগারেশন</H3>

      <CodeBlock filename="next.config.ts">{`import type { NextConfig } from 'next';
import withBundleAnalyzer from '@next/bundle-analyzer';

// The analysis only runs when ANALYZE=true is set
const bundleAnalyzer = withBundleAnalyzer({
  enabled: process.env.ANALYZE === 'true',
});

const nextConfig: NextConfig = {
  reactStrictMode: true,
  // ...the rest of your Next.js config
};

export default bundleAnalyzer(nextConfig);`}</CodeBlock>

      <H3>Step 3 — package.json-এ অ্যানালাইসিস স্ক্রিপ্ট</H3>

      <CodeBlock label="JSON" filename="package.json">{`{
  "name": "my-next-app",
  "version": "1.0.0",
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "analyze": "ANALYZE=true next build"
  },
  "devDependencies": {
    "@next/bundle-analyzer": "^15.0.0"
  }
}`}</CodeBlock>

      <Note>
        <p>
          <strong>Windows:</strong> PowerShell বা Command Prompt-এ এনভায়রনমেন্ট ভ্যারিয়েবল সহজে
          পরিচালনা করতে <code>cross-env</code> ব্যবহার করুন —{" "}
          <code>&quot;analyze&quot;: &quot;cross-env ANALYZE=true next build&quot;</code>।
        </p>
      </Note>

      {/* ── Reading ───────────────────────────────────────────────────── */}
      <H2 id="reading">৩. ট্রিম্যাপ চার্ট কীভাবে পড়বেন</H2>

      <p>
        <code>npm run analyze</code> চালালে দুটি ব্রাউজার ট্যাব নিজে থেকেই ওপেন হয় —{" "}
        <code>client.html</code> (ক্লায়েন্ট ব্রাউজারে ডাউনলোড হওয়া জাভাস্ক্রিপ্ট) এবং{" "}
        <code>server.html</code> (সার্ভার-সাইড এনভায়রনমেন্ট ও রেন্ডারিং কোড)। চার্টের ৩টি প্রধান
        মেট্রিক:
      </p>

      <Diagram>{`┌─────────────────────────────────────────────────────────────────────────┐
│ STAT SIZE ───► RAW source code size before Babel / Webpack processing   │
│ PARSED SIZE ─► Minified code actually executed by the browser  (KEY)    │
│ GZIPPED SIZE ► Network transfer size after HTTP compression             │
└─────────────────────────────────────────────────────────────────────────┘`}</Diagram>

      <p>
        <strong>Stat size:</strong> ফাইলটি কম্পাইল হওয়ার আগের কাঁচা সাইজ — এটি দেখে বিভ্রান্ত হবেন
        না। <strong>Parsed size (সবচেয়ে গুরুত্বপূর্ণ):</strong> মিনিফাই হওয়ার পর ব্রাউজার মেমরিতে
        যতটুকু কোড এক্সিকিউট করে; এটি সরাসরি TTI ও ইনপুট ডিলে-তে প্রভাব ফেলে।{" "}
        <strong>Gzipped size:</strong> নেটওয়ার্কের ওপর দিয়ে সার্ভার থেকে ব্রাউজারে ট্রান্সফার হওয়ার
        সময় সংকুচিত ফাইলের সাইজ।
      </p>

      {/* ── Matrix ────────────────────────────────────────────────────── */}
      <H2 id="matrix">৪. Bundle Analyzer Metrics ও Optimization Strategy</H2>

      <Table
        head={["মেট্রিক / লক্ষণ", "কী নির্দেশ করে", "সমাধান / অ্যাকশন প্ল্যান"]}
        rows={[
          [
            "Giant single box (node_modules)",
            "কোনো একটি ভারী থার্ড-পার্টি লাইব্রেরি (moment, monaco-editor) বিশাল জায়গা নিচ্ছে",
            <span key="c">
              হালকা বিকল্প (<code>date-fns</code> বা <code>dayjs</code>) দিয়ে রিপ্লেস করুন
            </span>,
          ],
          [
            "Duplicate packages in chunks",
            "একই লাইব্রেরির একাধিক ভার্সন আলাদা মডিউলে লোড হচ্ছে",
            <span key="c">
              <code>package.json</code>-এ ডিপেন্ডেন্সি রেজোলিউশন বা dedupe ফিক্স করুন
            </span>,
          ],
          [
            "Heavy client components",
            "ক্লায়েন্ট বান্ডলে বিশাল চার্ট বা রিচ টেক্সট এডিটর চলে এসেছে",
            <span key="c">
              <code>next/dynamic</code> দিয়ে <code>{"{ ssr: false }"}</code> অন-ডিমান্ড লোড করুন
            </span>,
          ],
        ]}
      />

      <Line name="ভুলু ভাই">
        অসাধারণ! <code>npm run analyze</code> রান করার পর দেখলাম আমাদের রিচ টেক্সট এডিটর এবং পিডিএফ
        জেনারেটর একাই ক্লায়েন্ট বান্ডলের ৬০% জায়গা দখল করে বসে ছিল! এগুলোকে lazy load করা দরকার।
      </Line>

      {/* ── Takeaways ─────────────────────────────────────────────────── */}
      <H2 id="takeaway">Production Takeaways</H2>

      <Note>
        <ul>
          <li>
            <strong>Always analyze before optimizing:</strong> অন্ধের মতো অনুমান করে কোড কমানোর চেষ্টা
            না করে আগে <code>npm run analyze</code> চালিয়ে মূল অপরাধী লাইব্রেরি চিহ্নিত করুন।
          </li>
          <li>
            <strong>Focus on client.html:</strong> ক্লায়েন্ট বান্ডল সাইজ সরাসরি পেজ লোড স্পিড ও Core
            Web Vitals প্রভাবিত করে — তাই <code>client.html</code>-এর বড় বক্সগুলো কমানোয় অগ্রাধিকার
            দিন।
          </li>
          <li>
            <strong>Watch for accidental tree-shaking breaks:</strong> ট্রিম্যাপে খেয়াল রাখুন সম্পূর্ণ
            ফাইল ইমপোর্টের কারণে পুরো লাইব্রেরি চলে আসছে কি না (যেমন{" "}
            <code>{"import { Share } from 'lucide-react'"}</code>-এর জায়গায় সব আইকন ইমপোর্ট হয়ে
            যাওয়া)।
          </li>
        </ul>
      </Note>
    </article>
  );
}
