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
      bn: "৮ মেগাবাইটের ট্রান্সলেশন বান্ডেল",
      en: "An 8 MB translation bundle",
    },
  },
  {
    id: "architecture",
    label: {
      bn: "Server-First Dictionary আর্কিটেকচার",
      en: "Server-first dictionary architecture",
    },
  },
  {
    id: "mechanisms",
    label: { bn: "৩টি আর্কিটেকচারাল কনসেপ্ট", en: "Three architectural concepts" },
  },
  {
    id: "implementation",
    label: {
      bn: "getDictionary ইমপ্লিমেন্টেশন",
      en: "The getDictionary implementation",
    },
  },
  {
    id: "matrix",
    label: {
      bn: "i18n Architecture Comparison",
      en: "i18n architecture comparison",
    },
  },
  {
    id: "takeaway",
    label: { bn: "Production Takeaways", en: "Production takeaways" },
  },
];

export default function I18nArchitecture() {
  return (
    <article className="doc-prose">
      {/* ── The problem ───────────────────────────────────────────────── */}
      <H2 id="the-problem" anchorOnly>
        ৮ মেগাবাইটের ট্রান্সলেশন বান্ডেল
      </H2>

      <p>
        রাত ২:৪৫। ভুলু ভাই নতুন গ্লোবাল এক্সপ্যানশন প্ল্যান নিয়ে কম্পিউটারের সামনে বসে আছেন! তার
        ই-কমার্স সাইটে জার্মানি ও জাপান থেকে অর্ডার আসছে। ভুলু ভাই ক্লায়েন্ট সাইডে একটি বিশাল React
        Context দিয়ে ৫০,০০০ লাইনের সব ভাষার ট্রান্সলেশন JSON ফাইল একসাথে ক্লায়েন্টে পাঠাচ্ছেন! ফলে
        ওয়েবসাইট লোড হতেই ৮ মেগাবাইট ক্লায়েন্ট JS ডাউনলোড হচ্ছে এবং সাইট ফ্রিজ হয়ে যাচ্ছে!
      </p>

      <Line name="ভুলু ভাই">
        ফাহিম! মাল্টি-ল্যাঙ্গুয়েজ ফিচার চালু করতে গিয়ে আমার সাইটের ক্লায়েন্ট বান্ডেল সাইজ ৮ মেগাবাইট
        হয়ে গেছে! জাপানিজ ইউজারের কাছে কেন বাংলা আর জার্মান ডিকশনারির ডাটা ক্লায়েন্ট বান্ডেলে ডাউনলোড
        হবে? React-i18next বা Context দিয়ে তো সাইটের স্পিড একদম ধ্বংস হয়ে গেল!
      </Line>

      <Line name="ফাহিম">
        ভুলু ভাই! SPA (Single Page Application) যুগের ক্লায়েন্ট-সাইড i18next লাইব্রেরি পুরো
        ট্রান্সলেশন অবজেক্ট ব্রাউজারে ইনজেক্ট করে ক্লায়েন্ট বান্ডেল ভারী করে ফেলে। Next.js App
        Router-এ Server-First Dictionary Architecture ব্যবহার করতে হয়। এখানে অনুবাদ প্রসেস পুরোপুরি
        সার্ভারে (RSC) সম্পন্ন হয়, ফলে ক্লায়েন্টে জিরো বাইট অতিরিক্ত জাভাস্ক্রিপ্ট যায়!
      </Line>

      <Line name="নেক্সট-ভাই">
        একদম! App Router-এ আমরা Dictionary Pattern এবং Dynamic Import ব্যবহার করব। সার্ভার
        কম্পোনেন্টে শুধুমাত্র নির্দিষ্ট ভাষার প্রয়োজনীয় অনুবাদের টুকরোটুকু (Dictionary Chunk) লোড হবে,
        এবং রেন্ডার হওয়া খাঁটি HTML ব্রাউজারে স্ট্রিম হবে!
      </Line>

      {/* ── Architecture ──────────────────────────────────────────────── */}
      <H2 id="architecture">১. Server-First i18n Dictionary Architecture</H2>

      <Diagram>{`┌─────────────────────────────────────────────────────────────────────────────┐
│             SERVER-FIRST i18N DICTIONARY ARCHITECTURE                       │
└─────────────────────────────────────────────────────────────────────────────┘

 Browser Request: GET /jp/products/headphones
                                │
                                ▼
 Next.js App Router ([locale] Dynamic Segment)
                                │
                                ▼
 Server Component (RSC): getDictionary('jp')
                                │
                                ├── Async dynamic import: import('./dictionaries/jp.json')
                                ├── Matches keys: { "title": "ヘッドフォン" }
                                └── Renders zero-JS HTML
                                │
                                ▼
 🟢 Browser receives lightweight HTML — zero translation JS in the bundle`}</Diagram>

      {/* ── Mechanisms ────────────────────────────────────────────────── */}
      <H2 id="mechanisms">২. কোর আর্কিটেকচারাল কনসেপ্ট</H2>

      <p>
        <strong>Server-first dictionary resolution:</strong> অনুবাদের কী-ভ্যালু জোড়াগুলো সার্ভার
        কম্পোনেন্টে (RSC) রেজলভ হয়। ব্রাউজার কোনো ভারী ট্রান্সলেশন ইঞ্জিন বা মেগা JSON ফাইল পায় না,
        সরাসরি অনুবাদকৃত HTML গ্রহণ করে।
      </p>

      <p>
        <strong>Dynamic dictionary chunks:</strong> প্রতিটি ভাষার অনুবাদের জন্য আলাদা JSON ফাইল থাকে।{" "}
        <code>getDictionary(locale)</code> কল করার মাধ্যমে কেবল বর্তমান রিকোয়েস্টের ভাষার ফাইলটি
        অন-ডিমান্ড সার্ভার মেমোরিতে লোড হয়।
      </p>

      <p>
        <strong>Type-safe dictionaries:</strong> একটি ডিফল্ট অনুবাদের ফাইল (যেমন{" "}
        <code>en.json</code>) থেকে টাইপ এক্সট্র্যাক্ট করে নেওয়া হয়, যেন যেকোনো ভাষায় কোনো ডিকশনারি কী
        বাদ পড়লে টাইপ-চেকার বিল্ড টাইমেই বাগ ধরে ফেলে।
      </p>

      {/* ── Implementation ────────────────────────────────────────────── */}
      <H2 id="implementation">৩. Production Code Implementation</H2>

      <H3>❌ Anti-pattern — monolithic client-side context translation</H3>

      <CodeBlock filename="components/BadTranslationProvider.tsx">{`// 🔴 POOR PRACTICE: shipping all dictionaries to the browser via React Context
'use client';

import en from './dictionaries/en.json';
import bn from './dictionaries/bn.json';
import jp from './dictionaries/jp.json'; // ❌ ships megabytes of unused JSON to EVERY client

import { createContext } from 'react';

const LanguageContext = createContext({ en, bn, jp });

export function BadTranslationProvider({ children }: { children: React.ReactNode }) {
  return (
    // ❌ heavy client hydration overhead
    <LanguageContext.Provider value={{ en, bn, jp }}>
      {children}
    </LanguageContext.Provider>
  );
}`}</CodeBlock>

      <H3>🟢 Production pattern — type-safe server-first dictionaries</H3>

      <p>
        <strong>Step 1 — ডিকশনারি ফাইল ও TypeScript কনট্র্যাক্ট।</strong>
      </p>

      <CodeBlock filename="dictionaries/en.json">{`{
  "navigation": {
    "home": "Home",
    "cart": "Cart"
  },
  "product": {
    "addToCart": "Add to Cart",
    "inStock": "In Stock"
  }
}`}</CodeBlock>

      <CodeBlock filename="dictionaries/bn.json">{`{
  "navigation": {
    "home": "হোম",
    "cart": "কার্ট"
  },
  "product": {
    "addToCart": "কার্টে যোগ করুন",
    "inStock": "স্টকে আছে"
  }
}`}</CodeBlock>

      <p>
        <strong>Step 2 — সার্ভার ডিকশনারি লোডার।</strong>
      </p>

      <CodeBlock filename="lib/i18n/dictionaries.ts">{`// 🟢 PRODUCTION PATTERN: type-safe dynamic imports
import 'server-only'; // ensures dictionary logic NEVER leaks to the client

const dictionaries = {
  en: () => import('@/dictionaries/en.json').then((module) => module.default),
  bn: () => import('@/dictionaries/bn.json').then((module) => module.default),
};

export type Locale = keyof typeof dictionaries;

// 🟢 extract the exact type shape from the default English dictionary
export type Dictionary = Awaited<ReturnType<(typeof dictionaries)['en']>>;

export const getDictionary = async (locale: Locale): Promise<Dictionary> => {
  // fall back to 'en' if the requested locale dictionary is missing
  const loader = dictionaries[locale] || dictionaries.en;
  return loader();
};`}</CodeBlock>

      <p>
        <strong>Step 3 — সার্ভার কম্পোনেন্টে ব্যবহার।</strong>
      </p>

      <CodeBlock filename="app/[locale]/products/page.tsx">{`// 🟢 zero-JS translation rendering
import { getDictionary, type Locale } from '@/lib/i18n/dictionaries';

interface PageProps {
  params: Promise<{ locale: Locale }>;
}

export default async function ProductsPage({ params }: PageProps) {
  const { locale } = await params;

  // 🟢 load ONLY the required language dictionary, on the server
  const dict = await getDictionary(locale);

  return (
    <main className="p-8">
      <nav className="flex gap-4 mb-6">
        <span>{dict.navigation.home}</span>
        <span>{dict.navigation.cart}</span>
      </nav>

      <button className="bg-blue-600 text-white px-4 py-2 rounded">
        {dict.product.addToCart}
      </button>
      <span className="ml-2 text-green-600">{dict.product.inStock}</span>
    </main>
  );
}`}</CodeBlock>

      {/* ── Matrix ────────────────────────────────────────────────────── */}
      <H2 id="matrix">৪. i18n Architecture Comparison</H2>

      <Table
        head={[
          "বৈশিষ্ট্য",
          "SPA client-side i18n (Context/i18next)",
          "Server-first dictionary",
        ]}
        rows={[
          [
            "JS bundle impact",
            "অত্যন্ত ভারী — সব JSON ব্রাউজারে যায় 🔴",
            "০ বাইট অতিরিক্ত JS 🟢",
          ],
          ["Initial load speed", "ধীরগতির hydration 🔴", "ইনস্ট্যান্ট HTML streaming 🟢"],
          [
            "Security & privacy",
            "সব খসড়া অনুবাদ ব্রাউজারে দৃশ্যমান 🔴",
            "শুধু প্রয়োজনীয় ডাটা রেন্ডার হয় 🟢",
          ],
          ["Type safety", "ম্যানুয়াল 🟡", "server-only + ইনফার্ড টাইপ 🟢"],
        ]}
      />

      <Line name="ভুলু ভাই">
        দুর্দান্ত ফাহিম! Server-First Dictionary Architecture সেট করার পর ক্লায়েন্ট বান্ডেল সাইজ ৮
        মেগাবাইট থেকে সোজা শূন্যে নেমে আসলো! জাপানিজ ইউজার এখন স্রেফ জাপানিজ টেক্সটসহ হালকা HTML
        পাচ্ছে!
      </Line>

      {/* ── Takeaways ─────────────────────────────────────────────────── */}
      <H2 id="takeaway">Production Takeaways</H2>

      <Note>
        <ul>
          <li>
            <strong>Mark the loader with server-only:</strong> অনুবাদের ডাটা লোডার ফাইলে{" "}
            <code>import &quot;server-only&quot;</code> ব্যবহার করুন, যেন ভুলবশত কোনো ক্লায়েন্ট
            কম্পোনেন্টে ডিকশনারি ফাইল ইমপোর্ট না হয়ে যায়।
          </li>
          <li>
            <strong>Namespace large dictionaries:</strong> অ্যাপ্লিকেশন বড় হলে একক বিশাল{" "}
            <code>en.json</code> না বানিয়ে <code>common.json</code>, <code>dashboard.json</code>,{" "}
            <code>checkout.json</code> — এভাবে ফাইল স্প্লিট করে লোড করুন।
          </li>
          <li>
            <strong>Infer strict types:</strong> <code>Awaited&lt;ReturnType&lt;...&gt;&gt;</code>{" "}
            দিয়ে ডিকশনারির টাইপ এক্সট্র্যাক্ট করে নিন — কোনো অনুবাদ কী-তে টাইপো থাকলে কোড কম্পাইলই হবে
            না।
          </li>
        </ul>
      </Note>
    </article>
  );
}
