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
      bn: "Hydration error আর ভুল কারেন্সি",
      en: "Hydration errors and the wrong currency",
    },
  },
  {
    id: "architecture",
    label: {
      bn: "Formatting ও hydration boundary",
      en: "Formatting & the hydration boundary",
    },
  },
  {
    id: "mechanisms",
    label: { bn: "৩টি আর্কিটেকচারাল কনসেপ্ট", en: "Three architectural concepts" },
  },
  {
    id: "implementation",
    label: {
      bn: "Intl ইউটিলিটি ও safe date কম্পোনেন্ট",
      en: "Intl utilities & a safe date component",
    },
  },
  {
    id: "matrix",
    label: { bn: "Formatting Approach Comparison", en: "Formatting approach comparison" },
  },
  {
    id: "takeaway",
    label: { bn: "Production Takeaways", en: "Production takeaways" },
  },
];

export default function CurrencyDateFormatting() {
  return (
    <article className="doc-prose">
      {/* ── The problem ───────────────────────────────────────────────── */}
      <H2 id="the-problem" anchorOnly>
        Hydration error আর ভুল কারেন্সি
      </H2>

      <p>
        সন্ধ্যা ৭:৩০। ভুলু ভাই তার ই-কমার্স প্ল্যাটফর্মের চেকআউট পেজ টেস্ট করতে গিয়ে মাথায় হাত দিয়ে
        বসে আছেন! পেজ রিফ্রেশ দিলেই কনসোলে লাল সতর্কবার্তা —{" "}
        <em>Hydration failed because the server rendered HTML didn&apos;t match the client</em>।
        অন্যদিকে ইউজার BDT প্রাইস সিলেক্ট করলেও বাংলা ভার্সনে মূল্য দেখাচ্ছে <code>$1,500.00</code>!
      </p>

      <Line name="ভুলু ভাই">
        ফাহিম! মারাত্মক বিপদে পড়েছি! ডাইনামিক ডেট ফ্রন্টএন্ডে রেন্ডার করতেই কেন সার্ভার আর ক্লায়েন্টের
        টাইম ভিন্ন হওয়ার কারণে React hydration এরর দিচ্ছে? আর আমার প্রোডাক্টের দাম <code>bn</code>{" "}
        লোকেলে ৳১,৫০০ দেখানোর বদলে সবসময় ইংরেজি ডলার সাইনসহ দেখাচ্ছে কেন?
      </Line>

      <Line name="ফাহিম">
        ভুলু ভাই! জাভাস্ক্রিপ্টের বিল্ট-ইন <code>Intl.NumberFormat</code> এবং{" "}
        <code>Intl.DateTimeFormat</code> API ব্যবহার না করে ম্যানুয়াল স্ট্রিং ম্যানিপুলেশন করলে এই
        সমস্যাগুলো হয়। আর সার্ভার-সাইড টাইমজোন এবং ক্লায়েন্ট-সাইড ব্রাউজার টাইমজোনের পার্থক্যের কারণে
        ডাইনামিক ডেটে hydration mismatch দেখা দেয়!
      </Line>

      <Line name="নেক্সট-ভাই">
        একদম! App Router-এ সঠিক locale-aware formatting utility এবং একটি hydration-safe date
        component ব্যবহার করলে কোনো হেভি লাইব্রেরি (যেমন Moment.js) ছাড়াই নেটিভ পারফরম্যান্সে বাংলা
        নিউমেরিকসহ ডেট ও কারেন্সি হ্যান্ডেল করা সম্ভব!
      </Line>

      {/* ── Architecture ──────────────────────────────────────────────── */}
      <H2 id="architecture">১. Locale Formatting &amp; Hydration Safety Architecture</H2>

      <Diagram>{`┌─────────────────────────────────────────────────────────────────────────────┐
│                 I18N FORMATTING & HYDRATION BOUNDARY ENGINE                 │
└─────────────────────────────────────────────────────────────────────────────┘

 Locale: 'bn' · Amount: 1500 · Date: Date.now()
                                │
                                ▼
                       formatting pipeline
                                │
        ┌───────────────────────┴───────────────────────┐
        ▼                                               ▼
 currency formatter                              date formatter
 (Intl.NumberFormat)                          (Intl.DateTimeFormat)
        │                                               │
        ├── locale:   'bn-BD'                           ├── locale:   'bn-BD'
        ├── style:    'currency'                        ├── timeZone: 'Asia/Dhaka' (fixed)
        └── currency: 'BDT'                             └── options:  day, month, year
        │                                               │
        ▼                                               ▼
 out: "১,৫০০.০০ ৳"                            hydration boundary component
                                                        │
                                                        ▼
                                             server ↔ client sync check
                                                        │
                                                        ▼
                                             out: "১ সেপ্টেম্বর, ২০২৬"`}</Diagram>

      {/* ── Mechanisms ────────────────────────────────────────────────── */}
      <H2 id="mechanisms">২. কোর আর্কিটেকচারাল কনসেপ্ট</H2>

      <p>
        <strong>Native Intl.NumberFormat:</strong> কোনো বাহ্যিক লাইব্রেরি ছাড়াই যেকোনো সংখ্যাকে লোকেল
        অনুযায়ী স্থানীয় অংকে (<code>1500</code> → <code>১,৫০০</code>) এবং নিজস্ব কারেন্সি সিম্বলসহ
        (BDT, USD, EUR) ফরম্যাট করে।
      </p>

      <p>
        <strong>Native Intl.DateTimeFormat:</strong> তারিখ ও সময়কে নির্দিষ্ট টাইমজোন (যেমন{" "}
        <code>Asia/Dhaka</code>) এবং লোকেল অনুযায়ী অনুবাদ করে দেয় —{" "}
        <em>September 1, 2026</em> → <em>১ সেপ্টেম্বর, ২০২৬</em>।
      </p>

      <p>
        <strong>The hydration mismatch problem:</strong> Node.js সার্ভারের টাইমজোন (সাধারণত UTC) এবং
        ক্লায়েন্ট ব্রাউজারের স্থানীয় টাইমজোন (যেমন GMT+6) ভিন্ন হওয়ায় দুই পাশে তৈরি HTML আলাদা হয়ে
        যায়। সমাধানের জন্য ক্লায়েন্ট মাউন্ট হওয়ার পর রেন্ডার নিশ্চিত করা, অথবা স্থির টাইমজোন কনফিগার
        করা আবশ্যক।
      </p>

      {/* ── Implementation ────────────────────────────────────────────── */}
      <H2 id="implementation">৩. Production Code Implementation</H2>

      <H3>❌ Anti-pattern — manual currency strings and raw toLocaleDateString</H3>

      <CodeBlock filename="components/BadOrderSummary.tsx">{`// 🔴 POOR PRACTICE: manual currency plus a raw toLocaleDateString that crashes hydration
export default function OrderSummary({ price, createdAt }: { price: number; createdAt: Date }) {
  return (
    <div>
      {/* ❌ hardcoded dollar sign and English format regardless of locale */}
      <p>Price: \${price.toFixed(2)}</p>

      {/* ❌ hydration error — server time !== user browser time */}
      <p>Date: {createdAt.toLocaleDateString()}</p>
    </div>
  );
}`}</CodeBlock>

      <H3>🟢 Production pattern — Intl utilities with a hydration-safe wrapper</H3>

      <p>
        <strong>Step 1 — ইউনিভার্সাল ফরম্যাটিং ইউটিলিটি।</strong>
      </p>

      <CodeBlock filename="lib/i18n/formatters.ts">{`// 🟢 PRODUCTION PATTERN: standardized Intl formatters for the App Router

// map short locales to standard BCP 47 language tags
const localeMap: Record<string, string> = {
  bn: 'bn-BD',
  en: 'en-US',
  de: 'de-DE',
};

/** Formats numbers and currencies through the native Intl API. */
export function formatCurrency(
  amount: number,
  locale: string = 'bn',
  currency: string = 'BDT'
): string {
  const targetLocale = localeMap[locale] || 'en-US';

  return new Intl.NumberFormat(targetLocale, {
    style: 'currency',
    currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
}

/** Formats dates safely with an explicit time zone. */
export function formatDate(
  date: Date | string | number,
  locale: string = 'bn',
  timeZone: string = 'Asia/Dhaka'
): string {
  const targetLocale = localeMap[locale] || 'en-US';

  return new Intl.DateTimeFormat(targetLocale, {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    timeZone, // 🟢 keeps the server and client representation identical
  }).format(new Date(date));
}`}</CodeBlock>

      <p>
        <strong>Step 2 — hydration-safe date কম্পোনেন্ট।</strong>
      </p>

      <CodeBlock filename="components/ui/formatted-date.tsx">{`'use client';

// 🟢 hydration-safe client component that prevents SSR/CSR date mismatches
import { useEffect, useState } from 'react';
import { formatDate } from '@/lib/i18n/formatters';

interface FormattedDateProps {
  date: Date | string | number;
  locale: string;
  timeZone?: string;
  className?: string;
}

export function FormattedDate({
  date,
  locale,
  timeZone = 'Asia/Dhaka',
  className = '',
}: FormattedDateProps) {
  const [mounted, setMounted] = useState(false);

  // 🟢 the first SSR pass renders a placeholder; the real value lands after mount
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    // 🟢 skeleton during SSR, so there is nothing to mismatch
    return (
      <span
        className={\`inline-block animate-pulse bg-gray-200 rounded h-4 w-24 \${className}\`}
      />
    );
  }

  return <span className={className}>{formatDate(date, locale, timeZone)}</span>;
}`}</CodeBlock>

      <p>
        <strong>Step 3 — পেজ কম্পোনেন্টে ব্যবহার।</strong>
      </p>

      <CodeBlock filename="app/[locale]/checkout/page.tsx">{`// 🟢 order summary page using localized formatting
import { formatCurrency } from '@/lib/i18n/formatters';
import { FormattedDate } from '@/components/ui/formatted-date';

interface PageProps {
  params: Promise<{ locale: string }>;
}

export default async function CheckoutPage({ params }: PageProps) {
  const { locale } = await params;

  const orderData = {
    subtotal: 1500,
    shippingFee: 60,
    orderDate: '2026-09-01T10:30:00Z',
  };

  const total = orderData.subtotal + orderData.shippingFee;

  return (
    <main className="p-8 max-w-md mx-auto border rounded-lg shadow-sm">
      <h2 className="text-2xl font-bold mb-4">
        {locale === 'bn' ? 'অর্ডার সামারি' : 'Order Summary'}
      </h2>

      <div className="space-y-3">
        <div className="flex justify-between">
          <span className="text-gray-600">{locale === 'bn' ? 'তারিখ:' : 'Date:'}</span>
          {/* 🟢 hydration-safe date rendering */}
          <FormattedDate date={orderData.orderDate} locale={locale} className="font-medium" />
        </div>

        <div className="flex justify-between">
          <span className="text-gray-600">{locale === 'bn' ? 'সাবটোটাল:' : 'Subtotal:'}</span>
          {/* 🟢 renders "১,৫০০.০০ ৳" or "$1,500.00" automatically */}
          <span>{formatCurrency(orderData.subtotal, locale, 'BDT')}</span>
        </div>

        <div className="flex justify-between">
          <span className="text-gray-600">{locale === 'bn' ? 'ডেলিভারি চার্জ:' : 'Shipping:'}</span>
          <span>{formatCurrency(orderData.shippingFee, locale, 'BDT')}</span>
        </div>

        <hr className="my-2" />

        <div className="flex justify-between text-lg font-bold">
          <span>{locale === 'bn' ? 'সর্বমোট:' : 'Total:'}</span>
          <span className="text-green-600">{formatCurrency(total, locale, 'BDT')}</span>
        </div>
      </div>
    </main>
  );
}`}</CodeBlock>

      {/* ── Matrix ────────────────────────────────────────────────────── */}
      <H2 id="matrix">৪. Formatting Approach Comparison</H2>

      <Table
        head={[
          "বৈশিষ্ট্য",
          "Manual string manipulation",
          "Moment.js / heavy libraries",
          "Native Intl + safe wrapper",
        ]}
        rows={[
          [
            "Bundle size impact",
            "~০ KB 🟢",
            "~৭০ KB+ ওভারহেড 🔴",
            "০ KB — নেটিভ ব্রাউজার API 🟢",
          ],
          [
            "Bengali numerals",
            "ম্যানুয়াল ম্যাপ লাগে 🔴",
            "অতিরিক্ত প্লাগইন নির্ভর 🟡",
            "bn-BD দিয়ে নেটিভ সাপোর্ট 🟢",
          ],
          ["Hydration safe", "না 🔴", "না 🔴", "mounted guard দিয়ে নিরাপদ 🟢"],
          [
            "Currency precision",
            "ভুল হওয়ার ঝুঁকি 🔴",
            "সাধারণ 🟡",
            "আন্তর্জাতিক স্ট্যান্ডার্ড অনুযায়ী নিখুঁত 🟢",
          ],
        ]}
      />

      <Line name="ভুলু ভাই">
        ওয়াও ফাহিম! <code>Intl</code> API এত পাওয়ারফুল! এখন বাংলা ভার্সনে একদম নিখুঁতভাবে ১,৫০০.০০ ৳
        আর ১ সেপ্টেম্বর, ২০২৬ চলে আসছে, আর কোনো hydration এররও দিচ্ছে না।
      </Line>

      {/* ── Takeaways ─────────────────────────────────────────────────── */}
      <H2 id="takeaway">Production Takeaways</H2>

      <Note>
        <ul>
          <li>
            <strong>Avoid heavyweight date libraries:</strong> নেটিভ <code>Intl.NumberFormat</code> ও{" "}
            <code>Intl.DateTimeFormat</code> ব্যবহার করুন — শূন্য বান্ডেল সাইজে নিখুঁত
            আন্তর্জাতিকীকরণ পাওয়া যায়।
          </li>
          <li>
            <strong>Prevent hydration mismatches:</strong> ডাইনামিক ডেট দেখানোর সময় সার্ভার ও
            ক্লায়েন্টের টাইমজোন অসামঞ্জস্য এড়াতে <code>useState</code>/<code>useEffect</code>{" "}
            প্যাটার্ন অথবা নির্দিষ্ট <code>timeZone</code> সেটিং ব্যবহার করুন।
          </li>
          <li>
            <strong>Use full locale tags:</strong> বাংলা ফরম্যাটিংয়ে সবসময় <code>bn-BD</code> ট্যাগ
            ব্যবহার করুন — এটি স্বয়ংক্রিয়ভাবে সংখ্যাকে বাংলা ডিজিটে এবং সঠিক মুদ্রা প্রতীকে রূপান্তর
            করে।
          </li>
        </ul>
      </Note>
    </article>
  );
}
