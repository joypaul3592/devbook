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
      bn: "সবাইকে জোর করে ইংরেজিতে পাঠানো",
      en: "Everyone forced into English",
    },
  },
  {
    id: "architecture",
    label: {
      bn: "Detection ও resolution পাইপলাইন",
      en: "Detection & resolution pipeline",
    },
  },
  {
    id: "mechanisms",
    label: { bn: "৩টি আর্কিটেকচারাল কনসেপ্ট", en: "Three architectural concepts" },
  },
  {
    id: "implementation",
    label: {
      bn: "Negotiator ও intl-localematcher",
      en: "Negotiator & intl-localematcher",
    },
  },
  {
    id: "matrix",
    label: {
      bn: "Language Detection Comparison",
      en: "Language detection comparison",
    },
  },
  {
    id: "takeaway",
    label: { bn: "Production Takeaways", en: "Production takeaways" },
  },
];

export default function LanguageDetection() {
  return (
    <article className="doc-prose">
      {/* ── The problem ───────────────────────────────────────────────── */}
      <H2 id="the-problem" anchorOnly>
        সবাইকে জোর করে ইংরেজিতে পাঠানো
      </H2>

      <p>
        রাত ৩:৪৫। ভুলু ভাই তার নতুন আন্তর্জাতিক ইউজারদের ফিডব্যাক দেখে চিন্তিত! জাপান এবং জার্মানির
        ইউজাররা অভিযোগ করছে — তাদের ব্রাউজারের প্রাইমারি ল্যাঙ্গুয়েজ জাপানিজ বা জার্মান হওয়া সত্ত্বেও
        সাইটে প্রথমবার ঢুকলেই জোর করে ইংরেজি ভার্সনে (<code>/en</code>) রিডাইরেক্ট করে দিচ্ছে!
      </p>

      <Line name="ভুলু ভাই">
        ফাহিম! ইউজারদের ব্রাউজার সেটিংসে অলরেডি বলা আছে তারা কোন ভাষায় ওয়েবসাইট দেখতে চায়। তাহলে আমার
        সাইট অটোমেটিক্যালি ব্রাউজারের ভাষা ডিটেক্ট করে সেই ভাষার সাব-পাথে (<code>/jp</code> বা{" "}
        <code>/de</code>) রিডাইরেক্ট করছে না কেন? আমাদের কি ক্লায়েন্ট-সাইডে{" "}
        <code>navigator.language</code> চেক করতে হবে?
      </Line>

      <Line name="ফাহিম">
        ভুলু ভাই! ক্লায়েন্ট-সাইডে JS দিয়ে ভাষা ডিটেক্ট করলে পেজ প্রথমে এক ভাষায় লোড হয়ে পরে অন্য ভাষায়
        ফ্লিকার (layout flash) করবে! এর পারফেক্ট সমাধান হলো server-edge language detection। ব্রাউজার
        প্রতিটি HTTP রিকোয়েস্টের সাথে <code>Accept-Language</code> হেডার পাঠায়। আর ইউজার ম্যানুয়ালি
        ভাষা বদলালে তা কুকিতে (<code>NEXT_LOCALE</code>) সেভ থাকে!
      </Line>

      <Line name="নেক্সট-ভাই">
        একদম! Next.js Middleware-এ আমরা প্রথমে কুকি চেক করব, কুকি না থাকলে <code>negotiator</code> এবং{" "}
        <code>@formatjs/intl-localematcher</code> দিয়ে ব্রাউজারের <code>Accept-Language</code> হেডার
        পার্স করে মিলিয়ে নেব সাইটের সাপোর্ট করা ভাষার সাথে! এরপর কোনো ফ্লিকার ছাড়াই একুরেট রুটে
        রিডাইরেক্ট হয়ে যাবে।
      </Line>

      {/* ── Architecture ──────────────────────────────────────────────── */}
      <H2 id="architecture">১. Language Detection &amp; Resolution Pipeline</H2>

      <Diagram>{`┌─────────────────────────────────────────────────────────────────────────────┐
│                 LANGUAGE DETECTION & RESOLUTION PIPELINE                    │
└─────────────────────────────────────────────────────────────────────────────┘

 Incoming request: GET https://techstore.com/
                          │
                          ▼
                 Next.js Edge Middleware
                          │
         ┌────────────────┴────────────────┐
         ▼                                 ▼
 1. NEXT_LOCALE cookie             2. Accept-Language header
    (explicit user choice)            (browser preference)
         │                                 │
         ├── found ──────────────────────► redirect to /[cookie-locale]      🟢
         │                                 │
         └── not found ──────────────────► match via intl-localematcher
                                           │
                                           ├── matched ──► /[matched-locale] 🟢
                                           └── no match ─► /[defaultLocale]  🟡`}</Diagram>

      {/* ── Mechanisms ────────────────────────────────────────────────── */}
      <H2 id="mechanisms">২. কোর আর্কিটেকচারাল কনসেপ্ট</H2>

      <p>
        <strong>Explicit preference via cookies:</strong> ইউজার যখন সাইটের ল্যাঙ্গুয়েজ ড্রপডাউন থেকে
        ম্যানুয়ালি কোনো ভাষা সিলেক্ট করে, তখন সেই চয়েস <code>NEXT_LOCALE</code> কুকিতে সেভ করে রাখতে
        হয়। পরবর্তী প্রতি রিকোয়েস্টে এই কুকি ব্রাউজার হেডারের চেয়েও বেশি প্রাধান্য পাবে।
      </p>

      <p>
        <strong>Accept-Language negotiation:</strong> ব্রাউজার প্রতি রিকোয়েস্টে তার প্রেফারেন্স
        সিকোয়েন্স (যেমন <code>bn-BD,bn;q=0.9,en-US;q=0.8</code>) হেডার হিসেবে পাঠায়। Negotiator
        লাইব্রেরি এই q-factor পার্স করে সবচেয়ে পছন্দের ভাষাটি বের করে।
      </p>

      <p>
        <strong>Locale matching engine:</strong> ব্রাউজারের ডিটেক্ট করা ভাষা (যেমন <code>bn-BD</code>)
        যদি হুবহু অ্যাপ্লিকেশনের লিস্টে না থাকে, তবে ম্যাচিং ইঞ্জিন সেটিকে মূল সাপোর্টেড লোকালে (যেমন{" "}
        <code>bn</code>) ম্যাপ বা ফলব্যাক করে।
      </p>

      {/* ── Implementation ────────────────────────────────────────────── */}
      <H2 id="implementation">৩. Production Code Implementation</H2>

      <H3>❌ Anti-pattern — client-side navigator.language detection</H3>

      <CodeBlock filename="components/BadLanguageDetector.tsx">{`// 🔴 POOR PRACTICE: client-side detection causes layout flashing and breaks SSR
'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function BadLanguageDetector() {
  const router = useRouter();

  useEffect(() => {
    // ❌ runs ONLY after JS hydration
    // the user sees an English page for 1–2 seconds, then gets yanked elsewhere
    const userLang = navigator.language.startsWith('bn') ? 'bn' : 'en';
    router.push(\`/\${userLang}/dashboard\`);
  }, [router]);

  return <div>Detecting language...</div>;
}`}</CodeBlock>

      <H3>🟢 Production pattern — edge middleware negotiation</H3>

      <p>
        <strong>Step 1 — রেজলিউশন ইউটিলিটি ইনস্টল।</strong>
      </p>

      <CodeBlock filename="terminal">{`npm install @formatjs/intl-localematcher negotiator
npm install --save-dev @types/negotiator`}</CodeBlock>

      <p>
        <strong>Step 2 — ল্যাঙ্গুয়েজ ডিটেকশন হেল্পার।</strong>
      </p>

      <CodeBlock filename="lib/i18n/get-locale.ts">{`// 🟢 PRODUCTION PATTERN: server-side locale negotiator
import { match } from '@formatjs/intl-localematcher';
import Negotiator from 'negotiator';
import type { NextRequest } from 'next/server';
import { i18n } from './config';

export function getPreferredLocale(request: NextRequest): string {
  // 1. an explicit user choice in the cookie always wins
  const cookieLocale = request.cookies.get('NEXT_LOCALE')?.value;
  if (cookieLocale && i18n.locales.includes(cookieLocale as never)) {
    return cookieLocale;
  }

  // 2. collect the incoming headers for Negotiator
  const negotiatorHeaders: Record<string, string> = {};
  request.headers.forEach((value, key) => (negotiatorHeaders[key] = value));

  // 3. parse the browser's language preference list
  const languages = new Negotiator({ headers: negotiatorHeaders }).languages();
  const supportedLocales = [...i18n.locales];
  const defaultLocale = i18n.defaultLocale;

  try {
    // 4. match the browser preference against the supported app locales
    return match(languages, supportedLocales, defaultLocale);
  } catch {
    return defaultLocale;
  }
}`}</CodeBlock>

      <p>
        <strong>Step 3 — মিডলওয়্যার ইন্টিগ্রেশন।</strong>
      </p>

      <CodeBlock filename="middleware.ts">{`// 🟢 PRODUCTION PATTERN: middleware interception & redirection
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { i18n } from '@/lib/i18n/config';
import { getPreferredLocale } from '@/lib/i18n/get-locale';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // is the URL missing a locale prefix?
  const pathnameIsMissingLocale = i18n.locales.every(
    (locale) => !pathname.startsWith(\`/\${locale}/\`) && pathname !== \`/\${locale}\`
  );

  if (pathnameIsMissingLocale) {
    // 🟢 detect the best-fit locale from the cookie, then Accept-Language
    const locale = getPreferredLocale(request);

    // a Japanese browser hitting "/" lands on "/jp" instantly
    return NextResponse.redirect(
      new URL(\`/\${locale}\${pathname.startsWith('/') ? '' : '/'}\${pathname}\`, request.url)
    );
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico|.*\\\\..*).*)'],
};`}</CodeBlock>

      {/* ── Matrix ────────────────────────────────────────────────────── */}
      <H2 id="matrix">৪. Language Detection Strategy Comparison</H2>

      <Table
        head={[
          "বৈশিষ্ট্য",
          "Client-side (navigator.language)",
          "Hardcoded fallback",
          "Edge middleware negotiation",
        ]}
        rows={[
          [
            "User experience",
            "পেজ ফ্লিকার করে 🔴",
            "নতুন ইউজারকে ভুল ভাষায় পাঠায় 🔴",
            "জিরো-ফ্লিকার স্মার্ট রিডাইরেক্ট 🟢",
          ],
          [
            "Cookie support",
            "ম্যানুয়াল সিনক্রোনাইজেশন কঠিন 🔴",
            "অনুপস্থিত 🔴",
            "ম্যানুয়াল পছন্দ সর্বোচ্চ প্রাধান্য পায় 🟢",
          ],
          [
            "Header parsing",
            "ক্লায়েন্টে অনুপস্থিত 🔴",
            "ইগনোর করে 🔴",
            "Accept-Language সঠিকভাবে পার্স করে 🟢",
          ],
          [
            "SEO & crawlers",
            "বট পেজ মিস করতে পারে 🔴",
            "রোবোটিক রিডাইরেক্ট 🟡",
            "গুগলবট সঠিক লোকালে অ্যাক্সেস পায় 🟢",
          ],
        ]}
      />

      <Line name="ভুলু ভাই">
        দুর্দান্ত ফাহিম! <code>negotiator</code> আর <code>intl-localematcher</code> দিয়ে মিডলওয়্যারে
        ল্যাঙ্গুয়েজ ডিটেকশন সেট করার পর এখন জার্মানির ইউজার রুট URL-এ হিট করলেই চোখের পলকে সোজা{" "}
        <code>/de</code> রুটে চলে যাচ্ছে! কোনো পেজ ফ্লিকারই হচ্ছে না।
      </Line>

      {/* ── Takeaways ─────────────────────────────────────────────────── */}
      <H2 id="takeaway">Production Takeaways</H2>

      <Note>
        <ul>
          <li>
            <strong>Always prioritize the cookie:</strong> ইউজার যখনই ওয়েবসাইট থেকে ম্যানুয়ালি ভাষা
            পরিবর্তন করবে, সাথে সাথে <code>NEXT_LOCALE</code> কুকি সেট করুন (Max-Age ১ বছর)। এটি
            ব্রাউজারের ডিফল্ট ল্যাঙ্গুয়েজের ওপর প্রাধান্য পাবে।
          </li>
          <li>
            <strong>Respect edge runtime constraints:</strong> Negotiator ব্যবহার করার সময় এটি যেন এজ
            রানটাইম কম্প্যাটিবল হয় সেদিকে খেয়াল রাখুন।
          </li>
          <li>
            <strong>Set Vary: Accept-Language:</strong> যদি কখনো সাব-পাথ ছাড়া মূল URL-এ কনটেন্ট
            ডাইনামিকভাবে সার্ভ করেন, তবে রেসপন্স হেডারে <code>Vary: Accept-Language</code> সেট করা
            বাধ্যতামূলক — অন্যথায় এজ-ক্যাশ ভুল পেজ ক্যাশ করে ফেলবে।
          </li>
        </ul>
      </Note>
    </article>
  );
}
