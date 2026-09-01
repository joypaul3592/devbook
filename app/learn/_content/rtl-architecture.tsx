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
      bn: "টেক্সট আরবি, লেআউট উল্টো",
      en: "Arabic text, mirrored layout broken",
    },
  },
  {
    id: "architecture",
    label: {
      bn: "ডাইনামিক RTL রেন্ডারিং পাইপলাইন",
      en: "Dynamic RTL rendering pipeline",
    },
  },
  {
    id: "mechanisms",
    label: { bn: "৩টি আর্কিটেকচারাল কনসেপ্ট", en: "Three architectural concepts" },
  },
  {
    id: "implementation",
    label: {
      bn: "dir অ্যাট্রিবিউট ও logical properties",
      en: "The dir attribute & logical properties",
    },
  },
  {
    id: "matrix",
    label: { bn: "RTL Layout Comparison", en: "RTL layout comparison" },
  },
  {
    id: "takeaway",
    label: { bn: "Production Takeaways", en: "Production takeaways" },
  },
];

export default function RtlArchitecture() {
  return (
    <article className="doc-prose">
      {/* ── The problem ───────────────────────────────────────────────── */}
      <H2 id="the-problem" anchorOnly>
        টেক্সট আরবি, লেআউট উল্টো
      </H2>

      <p>
        রাত ৪:৪৫। ভুলু ভাই মধ্যপ্রাচ্যের মার্কেটে এক্সপ্যানশনের জন্য সাইটে আরবি ভাষা (<code>/ar</code>)
        যুক্ত করেছেন! কিন্তু পেজ ওপেন করতেই তিনি বাকরুদ্ধ! টেক্সট তো ডানদিক থেকে পড়া যাচ্ছে, কিন্তু
        সাইডবার, বাটন, ইনপুট বক্স এবং নেভিগেশনের সব মার্জিন-প্যাডিং উল্টোদিকে লেগে আছে! ব্যাক বাটনের
        তীর বামদিকে মুখ করে আছে, অথচ আরবি লেআউটে ব্যাক করার কথা ডানদিকে।
      </p>

      <Line name="ভুলু ভাই">
        ফাহিম! টেক্সট আরবি হলো, কিন্তু ডিজাইনের তো বারোটা বেজে গেছে! বামের মার্জিন আরবিতে ডানে যাওয়ার
        কথা না? পুরো সাইটের হাজার হাজার লাইনের CSS ম্যানুয়ালি ধরে ধরে <code>margin-left</code> কেটে{" "}
        <code>margin-right</code> করতে গেলে তো এক মাস লেগে যাবে!
      </Line>

      <Line name="ফাহিম">
        ভুলু ভাই! LTR আর RTL অ্যাপ্লিকেশনের জন্য আলাদা আলাদা CSS লেখা জঘন্য প্র্যাকটিস! সমস্যা হলো
        আপনি কোডে physical CSS properties (<code>margin-left</code>, <code>padding-right</code>,{" "}
        <code>left</code>, <code>right</code>) ব্যবহার করেছেন। আধুনিক আর্কিটেকচারে ব্যবহার করতে হয় CSS
        logical properties এবং HTML <code>dir</code> অ্যাট্রিবিউট।
      </Line>

      <Line name="নেক্সট-ভাই">
        একদম! App Router-এর <code>app/[locale]/layout.tsx</code>-এ ডাইনামিকভাবে{" "}
        <code>&lt;html dir=&quot;rtl&quot;&gt;</code> সেট করে দিতে হবে। আর Tailwind CSS-এর logical
        utilities (<code>ms-*</code> ফর margin-start, <code>me-*</code> ফর margin-end) ব্যবহার করলে
        কোনো বাড়তি CSS ছাড়াই পুরো সাইটের লেআউট মিরর হয়ে যাবে!
      </Line>

      {/* ── Architecture ──────────────────────────────────────────────── */}
      <H2 id="architecture">১. Dynamic RTL Layout &amp; Rendering Pipeline</H2>

      <Diagram>{`┌─────────────────────────────────────────────────────────────────────────────┐
│                   DYNAMIC RTL ARCHITECTURE PIPELINE                         │
└─────────────────────────────────────────────────────────────────────────────┘

 Incoming request: GET /ar/dashboard
                          │
                          ▼
 App Router segment layout: app/[locale]/layout.tsx
                          │
                          ├── isRtlLocale('ar') ──► true
                          │
                          ▼
 Renders the root HTML shell:
 <html lang="ar" dir="rtl" class="font-arabic">
                          │
                          ▼
 Tailwind logical utilities resolve to:
 ├── ms-4 (margin start)  ──► margin-right: 1rem;  🟢
 ├── me-4 (margin end)    ──► margin-left: 1rem;   🟢
 └── rtl:rotate-180       ──► arrow icons flipped  🟢`}</Diagram>

      {/* ── Mechanisms ────────────────────────────────────────────────── */}
      <H2 id="mechanisms">২. কোর আর্কিটেকচারাল কনসেপ্ট</H2>

      <p>
        <strong>Native HTML dir attribute:</strong> ব্রাউজারের ডিফল্ট রেন্ডারিং ইঞ্জিনকে বলে দেয় টেক্সট
        ফ্লো, স্ক্রলবার, টেবিল কলাম এবং ইনপুট ফিল্ডের ডিরেকশন ডান থেকে বামে শুরু করতে হবে।
      </p>

      <p>
        <strong>Logical vs physical properties:</strong> physical প্রপার্টি (<code>left</code>,{" "}
        <code>margin-left</code>, <code>padding-right</code>) ভাষা বদলালেও অবস্থান বদলায় না। logical
        প্রপার্টি (<code>margin-inline-start</code> → <code>ms-*</code>,{" "}
        <code>padding-inline-end</code> → <code>pe-*</code>) <code>dir</code> অনুযায়ী স্বয়ংক্রিয়ভাবে
        দিক পরিবর্তন করে।
      </p>

      <p>
        <strong>Directional icon mirroring:</strong> কিছু আইকন (নেভিগেশন এরো, শেভরন, প্রোগ্রেস বার) RTL
        লেআউটে ১৮০ ডিগ্রি ঘুরে যাওয়া উচিত। Tailwind-এর <code>rtl:</code> ভ্যারিয়েন্ট দিয়ে এটি এক
        লাইনে হ্যান্ডেল করা যায়।
      </p>

      {/* ── Implementation ────────────────────────────────────────────── */}
      <H2 id="implementation">৩. Production Code Implementation</H2>

      <H3>❌ Anti-pattern — hardcoded physical CSS properties</H3>

      <CodeBlock filename="components/BadSidebar.tsx">{`// 🔴 POOR PRACTICE: physical layout classes and hardcoded LTR styles
// breaks completely in Arabic, Persian, or Hebrew

export default function BadSidebar() {
  return (
    // ❌ physical margin-left and fixed text-left alignment
    <aside className="w-64 border-r pl-4 ml-6 text-left">
      <button className="flex items-center gap-2">
        {/* ❌ the arrow points left regardless of locale */}
        <span>←</span>
        <span>Back to Home</span>
      </button>
    </aside>
  );
}`}</CodeBlock>

      <H3>🟢 Production pattern — dynamic dir with logical utilities</H3>

      <p>
        <strong>Step 1 — সেন্ট্রালাইজড RTL ডিটেকশন।</strong>
      </p>

      <CodeBlock filename="lib/i18n/rtl.ts">{`// 🟢 PRODUCTION PATTERN: centralized RTL detection logic
export const rtlLocales = ['ar', 'fa', 'he', 'ur'] as const;
export type RtlLocale = (typeof rtlLocales)[number];

export function isRtlLocale(locale: string): boolean {
  return rtlLocales.includes(locale as RtlLocale);
}

export function getScriptDirection(locale: string): 'rtl' | 'ltr' {
  return isRtlLocale(locale) ? 'rtl' : 'ltr';
}`}</CodeBlock>

      <p>
        <strong>Step 2 — ডাইনামিক root layout ও ফন্ট।</strong>
      </p>

      <CodeBlock filename="app/[locale]/layout.tsx">{`// 🟢 dynamic HTML direction & script-aware fonts
import { Noto_Sans_Arabic, Inter } from 'next/font/google';
import { isRtlLocale, getScriptDirection } from '@/lib/i18n/rtl';
import type { Locale } from '@/lib/i18n/config';

const inter = Inter({ subsets: ['latin'], variable: '--font-sans' });
const notoArabic = Noto_Sans_Arabic({
  subsets: ['arabic'],
  variable: '--font-arabic',
});

interface LayoutProps {
  children: React.ReactNode;
  params: Promise<{ locale: Locale }>;
}

export default async function RootLocaleLayout({ children, params }: LayoutProps) {
  const { locale } = await params;
  const isRtl = isRtlLocale(locale);
  const direction = getScriptDirection(locale);

  return (
    <html
      lang={locale}
      dir={direction} // 🟢 resolves to "rtl" or "ltr" per request
      className={\`\${inter.variable} \${notoArabic.variable}\`}
    >
      <body className={isRtl ? 'font-arabic' : 'font-sans'}>
        <div className="min-h-screen bg-background text-foreground">{children}</div>
      </body>
    </html>
  );
}`}</CodeBlock>

      <p>
        <strong>Step 3 — logical utility দিয়ে কম্পোনেন্ট।</strong>
      </p>

      <CodeBlock filename="components/ui/Sidebar.tsx">{`// 🟢 zero-CSS layout flipping using logical properties
import { ArrowLeft } from 'lucide-react';

export function ResponsiveSidebar({ dict }: { dict: Record<string, string> }) {
  return (
    <aside className="w-64 border-e ps-4 ms-6 text-start">
      {/*
        🟢 logical property breakdown:
        - border-e : border end   (right in LTR, left in RTL)
        - ps-4     : padding start (left in LTR, right in RTL)
        - ms-6     : margin start
        - text-start: aligns to the start of the reading direction
      */}
      <button className="flex items-center gap-2 px-3 py-2 bg-slate-100 rounded">
        {/* 🟢 flips 180 degrees automatically in RTL mode */}
        <ArrowLeft className="w-4 h-4 rtl:rotate-180 transition-transform" />
        <span>{dict.backButton}</span>
      </button>
    </aside>
  );
}`}</CodeBlock>

      {/* ── Matrix ────────────────────────────────────────────────────── */}
      <H2 id="matrix">৪. RTL Layout Strategy Comparison</H2>

      <Table
        head={[
          "বৈশিষ্ট্য",
          "Physical CSS (ml-*, pl-*, left-*)",
          "Logical CSS + dynamic dir (ms-*, ps-*, start-*)",
        ]}
        rows={[
          [
            "Room for error",
            "আরবি বা পার্সিয়ানের জন্য আলাদা CSS লিখতে হয় 🔴",
            "অটোমেটিক লেআউট ফ্লিপিং 🟢",
          ],
          [
            "Maintainability",
            "ডুপ্লিকেট স্টাইল ও if(isRtl) জটলা 🔴",
            "একক স্টাইলেই LTR ও RTL সাপোর্ট 🟢",
          ],
          [
            "Icon mirroring",
            "ম্যানুয়াল transform rotation লাগে 🔴",
            "rtl:rotate-180 দিয়ে নিখুঁত সমাধান 🟢",
          ],
          [
            "Font integration",
            "ফন্ট ফ্যামিলি ভেঙে যাওয়ার ঝুঁকি 🔴",
            "ডাইনামিক font-arabic প্রয়োগ সহজ 🟢",
          ],
        ]}
      />

      <Line name="ভুলু ভাই">
        অসাম ফাহিম! <code>&lt;html dir=&quot;rtl&quot;&gt;</code> আর Tailwind-এর{" "}
        <code>ms-*</code>/<code>ps-*</code> লজিক্যাল ক্লাসে কনভার্ট করার পর মাত্র ৫ মিনিটে পুরো
        ই-কমার্স ড্যাশবোর্ড আরবি ভাষায় সুন্দরভাবে অ্যালাইন হয়ে গেল! ব্যাক বাটনটাও এখন পারফেক্টলি ঘুরে
        গেছে।
      </Line>

      {/* ── Takeaways ─────────────────────────────────────────────────── */}
      <H2 id="takeaway">Production Takeaways</H2>

      <Note>
        <ul>
          <li>
            <strong>Adopt logical classes from day one:</strong> প্রজেক্টের শুরু থেকেই{" "}
            <code>ml-*</code>, <code>mr-*</code>, <code>pl-*</code>, <code>pr-*</code>-এর বদলে{" "}
            <code>ms-*</code>, <code>me-*</code>, <code>ps-*</code>, <code>pe-*</code> ব্যবহারের অভ্যাস
            গড়ে তুলুন।
          </li>
          <li>
            <strong>Flip only directional icons:</strong> সব আইকন ঘোরাতে যাবেন না! দিকনির্দেশক আইকন
            (arrow, chevron) <code>rtl:rotate-180</code> দিয়ে ঘোরান, কিন্তু সার্চ আইকন বা ব্র্যান্ড
            লোগো কখনো রিভার্স করবেন না।
          </li>
          <li>
            <strong>Use a proper Arabic font:</strong> আরবি টেক্সটকে ডিফল্ট সিস্টেম ফন্টে না রেখে{" "}
            <code>Noto_Sans_Arabic</code> বা <code>Cairo</code> ফন্ট <code>next/font</code> দিয়ে
            ইন্টিগ্রেট করুন — ভিজ্যুয়াল রিডাবিলিটি অনেক বাড়ে।
          </li>
        </ul>
      </Note>
    </article>
  );
}
