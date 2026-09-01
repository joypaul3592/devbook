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
      bn: "“1 আইটেম সমূহ” বাগ",
      en: "The “1 items” bug",
    },
  },
  {
    id: "architecture",
    label: {
      bn: "Translation ইঞ্জিন পাইপলাইন",
      en: "The translation engine pipeline",
    },
  },
  {
    id: "mechanisms",
    label: { bn: "৩টি আর্কিটেকচারাল কনসেপ্ট", en: "Three architectural concepts" },
  },
  {
    id: "implementation",
    label: {
      bn: "Interpolation ও pluralization",
      en: "Interpolation & pluralization",
    },
  },
  {
    id: "matrix",
    label: {
      bn: "Translation Architecture Comparison",
      en: "Translation architecture comparison",
    },
  },
  {
    id: "takeaway",
    label: { bn: "Production Takeaways", en: "Production takeaways" },
  },
];

export default function TranslationArchitecture() {
  return (
    <article className="doc-prose">
      {/* ── The problem ───────────────────────────────────────────────── */}
      <H2 id="the-problem" anchorOnly>
        “1 আইটেম সমূহ” বাগ
      </H2>

      <p>
        রাত ৪:১৫। ভুলু ভাই কার্ট পেজের একটা বাগ মেলাতে গিয়ে পুরো গুলিয়ে ফেলেছেন! কার্টে ৩টি প্রোডাক্ট
        যোগ করার পর স্ক্রিনে দেখাচ্ছে <em>3 items added to cart</em> — কিন্তু বাংলায় সুইচ করলে দেখাচ্ছে{" "}
        <em>3 আইটেম সমূহ কার্টে যোগ করা হয়েছে</em>। সমস্যা হলো, ১টি প্রোডাক্ট যোগ করলে দেখাচ্ছে{" "}
        <em>1 আইটেম সমূহ</em>! এছাড়া ইউজারকে ওয়েলকাম জানাতে গিয়ে ভুলু ভাই কোডে লিখেছেন{" "}
        <code>dict.welcome + &quot; &quot; + userName</code> — যার ফলে জাপানিজ ভাষায় গ্রামার উল্টে
        গিয়ে সেন্টেন্সের মানে নষ্ট হয়ে গেছে।
      </p>

      <Line name="ভুলু ভাই">
        ফাহিম! বহুবচন (pluralization) আর ডাইনামিক নাম বা প্রাইস বসাতে গিয়ে তো কোডের বারোটা বেজে যাচ্ছে!
        ১টি আইটেম হলে <em>1 item</em> আর একাধিক হলে <em>3 items</em> — এর জন্য কি আমাকে কোডের ভেতর
        বারবার if/else লিখে টেক্সট জোড়া লাগাতে হবে?
      </Line>

      <Line name="ফাহিম">
        ভুলু ভাই! প্লেইন স্ট্রিং কনক্যাটেনেশন (<code>+</code>) দিয়ে কখনো স্কেলেবল i18n অ্যাপ বানানো যায়
        না! একেক দেশের ভাষায় বাক্যের স্ট্রাকচার ও প্লুরালাইজেশন রুল একেক রকম — আরবি ভাষায় প্লুরালের
        ৬টি নিয়ম রয়েছে! প্রফেশনাল আর্কিটেকচারে interpolation (<code>&#123;name&#125;</code>),
        pluralization rules এবং namespaced dictionary loader ব্যবহার করা হয়।
      </Line>

      <Line name="নেক্সট-ভাই">
        একদম! পুরো ৫০ কিলোবাইটের JSON ডিকশনারি এক জায়গায় না রেখে আমরা অ্যাপকে ছোট ছোট namespace-এ
        (<code>common.json</code>, <code>cart.json</code>, <code>checkout.json</code>) ভাগ করব। আর
        একটি লাইটওয়েট টাইপ-সেফ translation engine (<code>t()</code> helper) তৈরি করব যা ভ্যারিয়েবল
        ইন্টারপোলেট ও প্লুরাল রেজলভ করবে।
      </Line>

      {/* ── Architecture ──────────────────────────────────────────────── */}
      <H2 id="architecture">১. Scalable Translation Architecture Pipeline</H2>

      <Diagram>{`┌─────────────────────────────────────────────────────────────────────────────┐
│                   SCALABLE TRANSLATION ARCHITECTURE                         │
└─────────────────────────────────────────────────────────────────────────────┘

 Server Component (RSC) ──► loads a namespace dictionary (e.g. 'cart')
                                       │
                                       ▼
                  passes it to the lightweight translator engine
                                       │
                ┌──────────────────────┴──────────────────────┐
                ▼                                             ▼
  1. dynamic interpolation                      2. pluralization rules
  in:  t('welcome', { name: 'Rahat' })           in:  t('cartItems', { count: 1 })
  out: "Welcome, Rahat!"                         out: "1 item in cart"
                │                                             │
                └──────────────────────┬──────────────────────┘
                                       │
                                       ▼
                     🟢 renders HTML / scoped client props`}</Diagram>

      {/* ── Mechanisms ────────────────────────────────────────────────── */}
      <H2 id="mechanisms">২. কোর আর্কিটেকচারাল কনসেপ্ট</H2>

      <p>
        <strong>Dynamic parameter interpolation:</strong> কখনোই টেক্সট জোড়া দিতে <code>+</code> ব্যবহার
        করা যাবে না। অনুবাদ ফাইলে প্লেসহোল্ডার (<code>&#123;name&#125;</code>,{" "}
        <code>&#123;count&#125;</code>) ডিফাইন করতে হবে, যাতে যেকোনো ভাষায় শব্দের ব্যাকরণগত অবস্থান
        স্বাধীনভাবে বদলাতে পারে।
      </p>

      <p>
        <strong>Locale-aware pluralization engine:</strong> শুধু <em>item</em> আর <em>items</em> নয় —
        বিভিন্ন ভাষার কাউন্টিং রুল হ্যান্ডেল করতে <code>count</code> প্যারামিটারের ওপর ভিত্তি করে
        ট্রান্সলেশন কী (<code>cartItems_one</code>, <code>cartItems_other</code>) স্বয়ংক্রিয়ভাবে পিক
        করতে হয়।
      </p>

      <p>
        <strong>Namespaced dictionary modularization:</strong> পুরো অ্যাপের সব অনুবাদ এক ফাইলে না রেখে
        ফিচার অনুযায়ী (<code>auth</code>, <code>dashboard</code>, <code>cart</code>) namespace-এ ভাগ
        করে লোড করলে সার্ভার মেমোরি ও পারফরম্যান্স সর্বোচ্চ থাকে।
      </p>

      {/* ── Implementation ────────────────────────────────────────────── */}
      <H2 id="implementation">৩. Production Code Implementation</H2>

      <H3>❌ Anti-pattern — string concatenation in a monolithic dictionary</H3>

      <CodeBlock filename="components/BadCartSummary.tsx">{`// 🔴 POOR PRACTICE: hardcoded concatenation with no pluralization logic
// breaks grammar in languages like Japanese or Arabic

export default function BadCartSummary({ userName, count }: { userName: string; count: number }) {
  return (
    <div>
      {/* ❌ assumes English word order for every language */}
      <h2>Welcome {userName}!</h2>
      <p>{count} {count === 1 ? 'item' : 'items'} added to cart</p>
    </div>
  );
}`}</CodeBlock>

      <H3>🟢 Production pattern — namespaced, interpolated, pluralized</H3>

      <p>
        <strong>Step 1 — namespaced ডিকশনারি।</strong>
      </p>

      <CodeBlock filename="dictionaries/en/cart.json">{`{
  "welcome": "Welcome back, {name}!",
  "cartItems_one": "You have {count} item in your cart",
  "cartItems_other": "You have {count} items in your cart"
}`}</CodeBlock>

      <CodeBlock filename="dictionaries/bn/cart.json">{`{
  "welcome": "স্বাগতম, {name}!",
  "cartItems_one": "আপনার কার্টে {count}টি পণ্য আছে",
  "cartItems_other": "আপনার কার্টে {count}টি পণ্য আছে"
}`}</CodeBlock>

      <p>
        <strong>Step 2 — ইউনিভার্সাল translator helper।</strong>
      </p>

      <CodeBlock filename="lib/i18n/translator.ts">{`// 🟢 PRODUCTION PATTERN: lightweight interpolation & pluralization helper
import 'server-only';

export type TranslationParams = Record<string, string | number>;

export function createTranslator(dictionary: Record<string, string>) {
  return function t(key: string, params?: TranslationParams): string {
    let templateKey = key;

    // 1. pluralization resolution
    if (params && typeof params.count === 'number') {
      const suffix = params.count === 1 ? '_one' : '_other';
      if (\`\${key}\${suffix}\` in dictionary) {
        templateKey = \`\${key}\${suffix}\`;
      }
    }

    // 2. fall back to the raw key so a missing translation never crashes the page
    let text = dictionary[templateKey] || key;

    // 3. dynamic variable interpolation
    if (params) {
      Object.entries(params).forEach(([paramKey, value]) => {
        text = text.replace(new RegExp(\`\\\\{\${paramKey}\\\\}\`, 'g'), String(value));
      });
    }

    return text;
  };
}`}</CodeBlock>

      <p>
        <strong>Step 3 — সার্ভার কম্পোনেন্টে ব্যবহার।</strong>
      </p>

      <CodeBlock filename="app/[locale]/cart/page.tsx">{`// 🟢 dynamic server component with a scoped namespace
import { createTranslator } from '@/lib/i18n/translator';
import type { Locale } from '@/lib/i18n/config';

// namespace dictionary loader
async function getCartNamespace(locale: Locale) {
  try {
    return (await import(\`@/dictionaries/\${locale}/cart.json\`)).default;
  } catch {
    return (await import('@/dictionaries/en/cart.json')).default;
  }
}

interface PageProps {
  params: Promise<{ locale: Locale }>;
}

export default async function CartPage({ params }: PageProps) {
  const { locale } = await params;

  // 🟢 load ONLY the 'cart' namespace for this page
  const cartDict = await getCartNamespace(locale);
  const t = createTranslator(cartDict);

  const user = { name: 'রাহাত' };
  const itemCount = 5;

  return (
    <main className="p-8 max-w-2xl mx-auto border rounded-lg shadow-sm">
      {/* 🟢 dynamic interpolation */}
      <h1 className="text-2xl font-bold">{t('welcome', { name: user.name })}</h1>

      {/* 🟢 locale-aware pluralization */}
      <p className="mt-2 text-gray-600">{t('cartItems', { count: itemCount })}</p>
    </main>
  );
}`}</CodeBlock>

      {/* ── Matrix ────────────────────────────────────────────────────── */}
      <H2 id="matrix">৪. Translation Architecture Comparison</H2>

      <Table
        head={[
          "বৈশিষ্ট্য",
          "String concatenation (+)",
          "Single monolithic JSON",
          "Namespaced + interpolated engine",
        ]}
        rows={[
          [
            "গ্রামার ও word order",
            "ভেঙে যায় 🔴",
            "ফিক্সড টেক্সট 🟡",
            "সম্পূর্ণ ডাইনামিক ও ফ্লেক্সিবল 🟢",
          ],
          [
            "Pluralization",
            "ম্যানুয়াল if/else জটলা 🔴",
            "কঠিন 🔴",
            "count প্যারাম ধরে অটোমেটিক 🟢",
          ],
          [
            "মেমোরি ও ফাইল সাইজ",
            "কম 🟢",
            "পুরো ফাইল মেমোরিতে থাকে 🔴",
            "মডিউলার ও স্কেলেবল 🟢",
          ],
          ["Developer experience", "বাগ-প্রোন 🔴", "মাঝারি 🟡", "টাইপ-সেফ ও পরিচ্ছন্ন 🟢"],
        ]}
      />

      <Line name="ভুলু ভাই">
        মারাত্মক কাজের জিনিস ফাহিম! <code>createTranslator</code> হেল্পার ব্যবহার করার পর এখন কার্টে
        ১টি পণ্য থাকলে একরকম আর একাধিক থাকলে অন্যরকম টেক্সট অটোমেটিক্যালি দেখাচ্ছে! ব্যাকরণগত কোনো ভুল
        ছাড়াই নাম আর প্রাইস সুন্দরভাবে ডাইনামিকালি বসে যাচ্ছে।
      </Line>

      {/* ── Takeaways ─────────────────────────────────────────────────── */}
      <H2 id="takeaway">Production Takeaways</H2>

      <Note>
        <ul>
          <li>
            <strong>Never concatenate localized strings:</strong> বাক্যের অংশ জোড়া দেওয়ার চেষ্টা করবেন
            না — সবসময় পুরো বাক্য লিখে ভেতরে <code>&#123;placeholder&#125;</code> ব্যবহার করুন।
          </li>
          <li>
            <strong>Modularize via namespaces:</strong> পেজের সাইজ অনুযায়ী ডিকশনারিকে ছোট namespace-এ
            ভাগ করুন — বিল্ড টাইম মেমোরি খরচ অনেক কমে যায়।
          </li>
          <li>
            <strong>Handle missing keys gracefully:</strong> ট্রান্সলেশন ইঞ্জিনে সবসময় ফলব্যাক রাখুন,
            যেন কোনো কী পাওয়া না গেলে অ্যাপ ক্র্যাশ না করে মূল কী-এর নাম স্ক্রিনে শো করে।
          </li>
        </ul>
      </Note>
    </article>
  );
}
