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
      bn: "একই লিংক, দুই জায়গায় দুই ভাষা",
      en: "One link, two different languages",
    },
  },
  {
    id: "architecture",
    label: {
      bn: "Locale routing ও middleware পাইপলাইন",
      en: "Locale routing & middleware pipeline",
    },
  },
  {
    id: "mechanisms",
    label: { bn: "৩টি আর্কিটেকচারাল কনসেপ্ট", en: "Three architectural concepts" },
  },
  {
    id: "implementation",
    label: {
      bn: "[locale] সেগমেন্ট ও middleware",
      en: "The [locale] segment & middleware",
    },
  },
  {
    id: "matrix",
    label: {
      bn: "Locale Routing Comparison",
      en: "Locale routing comparison",
    },
  },
  {
    id: "takeaway",
    label: { bn: "Production Takeaways", en: "Production takeaways" },
  },
];

export default function LocaleRouting() {
  return (
    <article className="doc-prose">
      {/* ── The problem ───────────────────────────────────────────────── */}
      <H2 id="the-problem" anchorOnly>
        একই লিংক, দুই জায়গায় দুই ভাষা
      </H2>

      <p>
        রাত ৩:১৫। ভুলু ভাই তার গ্লোবাল ই-কমার্স পোর্টালে লোকাল রাউটিং মেলাতে গিয়ে জট পাকিয়ে ফেলেছেন!
        ইউজাররা লিংক শেয়ার করলে এক বন্ধুর কাছে পেজ খোলে বাংলায়, আর অন্যজনের কাছে একই URL-এ খোলে
        ইংরেজিতে! কারণ ভুলু ভাই লোকাল স্টেট ব্রাউজারের <code>localStorage</code>-এ রেখে পেজ রেন্ডার
        করছিলেন।
      </p>

      <Line name="ভুলু ভাই">
        ফাহিম! একই URL <code>techstore.com/products/shoes</code> দিয়ে দুই জায়গায় দুই ভাষা দেখাচ্ছে
        কেন? আর সার্চ ইঞ্জিন ক্রলারই বা কোন ভাষায় পেজ ইনডেক্স করবে? <code>localStorage</code>-এ লোকাল
        রাখা কি ভুল সিদ্ধান্ত ছিল?
      </Line>

      <Line name="ফাহিম">
        ভুলু ভাই! ক্লায়েন্ট-সাইড <code>localStorage</code> বা কুকির ওপর ভিত্তি করে ভাষা পরিবর্তন করলে
        সার্চ ইঞ্জিন কখনো আলাদা ভাষার পেজ ইনডেক্স করতে পারে না এবং ইউজারদের লিংক শেয়ারিং একদম ভেঙে
        পড়ে। প্রফেশনাল i18n অ্যাপ্লিকেশনের মূল ভিত্তি হলো URL-first locale routing!
      </Line>

      <Line name="নেক্সট-ভাই">
        একদম! App Router-এর <code>app/[locale]/...</code> ডাইনামিক রুট সেগমেন্টের মাধ্যমে লোকালকে
        সবসময় URL-এর অংশ (যেমন <code>/bn/products/shoes</code>) হিসেবে ডিক্লেয়ার করতে হয়। সাথে Next.js
        Middleware ব্যবহার করে রুটের লোকাল রিডাইরেকশন স্বয়ংক্রিয়ভাবে হ্যান্ডেল করতে হয়!
      </Line>

      {/* ── Architecture ──────────────────────────────────────────────── */}
      <H2 id="architecture">১. Locale Routing &amp; Middleware Redirect Architecture</H2>

      <Diagram>{`┌─────────────────────────────────────────────────────────────────────────────┐
│                    LOCALE ROUTING & MIDDLEWARE PIPELINE                     │
└─────────────────────────────────────────────────────────────────────────────┘

 User requests raw URL: https://techstore.com/dashboard
                               │
                               ▼
 Next.js Edge Middleware intercepts the request
                               │
                               ├── checks the URL for a supported prefix (/en, /bn, /de)
                               │
                               ├── ❌ missing prefix
                               │    ├── resolves the preferred locale (cookie / Accept-Language)
                               │    └── issues a 307 redirect ──► /bn/dashboard
                               │
                               └── 🟢 valid prefix present (/bn/dashboard)
                                    └── passes through to app/[locale]/dashboard/page.tsx`}</Diagram>

      {/* ── Mechanisms ────────────────────────────────────────────────── */}
      <H2 id="mechanisms">২. কোর আর্কিটেকচারাল কনসেপ্ট</H2>

      <p>
        <strong>URL-first single source of truth:</strong> URL নিজেই ডিক্লেয়ার করবে পেজটি কোন ভাষার।
        এর ফলে সার্চ ইঞ্জিন প্রতিটি ভাষার জন্য নির্দিষ্ট URL ইনডেক্স করতে পারে এবং ইউজার নিখুঁত লিংক
        শেয়ার করতে পারে।
      </p>

      <p>
        <strong>Middleware matcher &amp; prefix resolution:</strong> মিডলওয়্যার নিশ্চিত করে যে অ্যাপের
        কোনো পাবলিক রুটে লোকাল প্রিফিক্স ছাড়া কেউ না পৌঁছায়। প্রিফিক্স না থাকলে মিডলওয়্যার ইউজারকে
        সঠিক রুটে রিডাইরেক্ট করে।
      </p>

      <p>
        <strong>Sub-path routing vs domain routing:</strong> সবচেয়ে পপুলার ও স্কেলেবল অ্যাপ্রোচ হলো
        সাব-পাথ রাউটিং (<code>domain.com/en</code>, <code>domain.com/bn</code>), যা Next.js dynamic
        segment <code>[locale]</code> দিয়ে অত্যন্ত সহজে আর্কিটেক্ট করা যায়।
      </p>

      {/* ── Implementation ────────────────────────────────────────────── */}
      <H2 id="implementation">৩. Production Code Implementation</H2>

      <H3>❌ Anti-pattern — locale state in localStorage</H3>

      <CodeBlock filename="app/BadLocaleLayout.tsx">{`// 🔴 POOR PRACTICE: storing the locale in localStorage without touching the URL
'use client';

import { useEffect, useState } from 'react';

export default function BadLocaleLayout({ children }: { children: React.ReactNode }) {
  const [locale, setLocale] = useState('en');

  useEffect(() => {
    // ❌ crawlers never execute this — zero SEO indexing for secondary languages
    const saved = localStorage.getItem('user_locale') || 'en';
    setLocale(saved);
  }, []);

  return <div data-locale={locale}>{children}</div>;
}`}</CodeBlock>

      <H3>🟢 Production pattern — URL-first dynamic segment routing</H3>

      <p>
        <strong>Step 1 — সেন্ট্রাল লোকাল কনফিগারেশন।</strong>
      </p>

      <CodeBlock filename="lib/i18n/config.ts">{`// 🟢 centralized locale config
export const i18n = {
  defaultLocale: 'en',
  locales: ['en', 'bn', 'de'],
} as const;

export type Locale = (typeof i18n)['locales'][number];`}</CodeBlock>

      <p>
        <strong>Step 2 — এজ মিডলওয়্যারে প্রিফিক্স ইন্টারসেপশন।</strong>
      </p>

      <CodeBlock filename="middleware.ts">{`// 🟢 PRODUCTION PATTERN: edge middleware locale matcher
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { i18n } from '@/lib/i18n/config';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // 1. is the pathname missing a supported locale prefix?
  const pathnameIsMissingLocale = i18n.locales.every(
    (locale) => !pathname.startsWith(\`/\${locale}/\`) && pathname !== \`/\${locale}\`
  );

  // 2. redirect when there is no locale in the URL
  if (pathnameIsMissingLocale) {
    const locale = i18n.defaultLocale; // fallback, or negotiate via headers

    // /products/shoes -> /en/products/shoes
    return NextResponse.redirect(
      new URL(\`/\${locale}\${pathname.startsWith('/') ? '' : '/'}\${pathname}\`, request.url)
    );
  }

  return NextResponse.next();
}

export const config = {
  // 🟢 skip internal Next.js assets, static files, and API routes
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico|.*\\\\..*).*)'],
};`}</CodeBlock>

      <p>
        <strong>Step 3 — ডাইনামিক সেগমেন্ট লেআউট।</strong>
      </p>

      <CodeBlock filename="app/[locale]/layout.tsx">{`// 🟢 App Router segment root
import { notFound } from 'next/navigation';
import { i18n, type Locale } from '@/lib/i18n/config';

interface LayoutProps {
  children: React.ReactNode;
  params: Promise<{ locale: Locale }>;
}

export default async function LocaleLayout({ children, params }: LayoutProps) {
  const { locale } = await params;

  // 🟢 validate the incoming segment against the supported locales
  if (!i18n.locales.includes(locale)) {
    notFound();
  }

  return (
    <html lang={locale}>
      <body>
        <div className="min-h-screen flex flex-col">
          <header className="p-4 bg-slate-100 border-b">
            <span className="font-bold uppercase">Active locale: {locale}</span>
          </header>
          <main className="flex-1">{children}</main>
        </div>
      </body>
    </html>
  );
}`}</CodeBlock>

      {/* ── Matrix ────────────────────────────────────────────────────── */}
      <H2 id="matrix">৪. Locale Routing Strategy Comparison</H2>

      <Table
        head={["বৈশিষ্ট্য", "Client localStorage / state", "Sub-path routing (/[locale]/...)"]}
        rows={[
          [
            "SEO indexability",
            "জিরো সাপোর্ট — শুধু ১টি ভাষা ইনডেক্স হয় 🔴",
            "প্রতিটি ভাষার পৃথক ইনডেক্স কভারেজ 🟢",
          ],
          [
            "Link sharing UX",
            "ব্রোকেন — লিংক পাঠালে ভুল ভাষায় খোলে 🔴",
            "URL নিজেই ভাষার স্টেট বহন করে 🟢",
          ],
          ["Middleware control", "কাজ করে না 🔴", "সার্ভার লেভেলে তাৎক্ষণিক রিডাইরেক্ট 🟢"],
          ["Edge caching", "ক্যাশিং কনফ্লিক্ট তৈরি করে 🔴", "URL ধরে এজ-ক্যাশিং সহজ 🟢"],
        ]}
      />

      <Line name="ভুলু ভাই">
        জোস ফাহিম! <code>app/[locale]</code> আর <code>middleware.ts</code> সেট করার পর এখন সাইট
        ন্যাচারালি সাব-পাথ রাউটিং ফলো করছে! যেকোনো ইউজারকে নির্দিষ্ট লিংক পাঠালে সে সেই ভাষাতেই পেজ
        ওপেন হতে দেখছে!
      </Line>

      {/* ── Takeaways ─────────────────────────────────────────────────── */}
      <H2 id="takeaway">Production Takeaways</H2>

      <Note>
        <ul>
          <li>
            <strong>Exclude static assets in the matcher:</strong> <code>middleware.ts</code>-এর
            matcher কনফিগ থেকে অবশ্যই <code>_next/static</code>, <code>_next/image</code>,{" "}
            <code>favicon.ico</code> এবং ইমেজ/মিডিয়া ফাইল বাদ দিতে হবে, অন্যথায় পারফরম্যান্স ড্রপ
            করবে।
          </li>
          <li>
            <strong>Validate the segment with notFound():</strong>{" "}
            <code>app/[locale]/layout.tsx</code>-এ প্রবেশ করা URL সাপোর্টেড লোকাল কিনা চেক করুন। অজানা
            লোকাল (যেমন <code>/xyz/...</code>) এলে সাথে সাথে <code>notFound()</code> রেসপন্স দিন।
          </li>
          <li>
            <strong>Prefix every internal link:</strong> লিংক তৈরির সময় সবসময় লোকাল প্রিফিক্স যুক্ত
            করুন (<code>/$&#123;locale&#125;/products</code>), যাতে নেভিগেট করার সময় ইউজার তার বর্তমান
            ভাষা না হারিয়ে ফেলে।
          </li>
        </ul>
      </Note>
    </article>
  );
}
