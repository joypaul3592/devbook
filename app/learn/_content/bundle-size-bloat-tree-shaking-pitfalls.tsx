import { CodeBlock, Diagram, H2, Line, Note } from "@/components/learn/DocParts";
import type { Bi } from "@/lib/curriculum";

/** Section anchors — consumed by the "on this page" rail. */
export const headings: { id: string; label: Bi }[] = [
  {
    id: "the-problem",
    label: { bn: "লাইটহাউজ স্কোর ৩৮", en: "A Lighthouse score of 38" },
  },
  {
    id: "tree-shaking",
    label: { bn: "Tree-Shaking ফেইলিওর", en: "Tree-shaking failure" },
  },
  {
    id: "modular-imports",
    label: { bn: "optimizePackageImports", en: "optimizePackageImports" },
  },
  {
    id: "code-splitting",
    label: { bn: "next/dynamic দিয়ে কোড-স্প্লিটিং", en: "Code-splitting with next/dynamic" },
  },
  {
    id: "third-parties",
    label: { bn: "@next/third-parties", en: "@next/third-parties" },
  },
  {
    id: "takeaway",
    label: { bn: "Production Takeaways", en: "Production takeaways" },
  },
];

export default function BundleSizeBloat() {
  return (
    <article className="doc-prose">
      {/* ── The problem ───────────────────────────────────────────────── */}
      <H2 id="the-problem" anchorOnly>
        লাইটহাউজ স্কোর ৩৮
      </H2>

      <p>
        পরদিন অফিসে এসে ভুলু ভাই হতাশ হয়ে চেয়ারে বসে পড়লেন। হাতে লাইটহাউজ
        (Lighthouse) রিপোর্টের প্রিন্টআউট।
      </p>

      <Line name="ভুলু ভাই">
        নেক্সট-ভাই! সাইট লাইভ হওয়ার পর পারফর্মেন্স স্কোর নেমে এসেছে ৩৮-এ! মোবাইল
        ইউজাররা সাইটে ঢুকলেই নাকি ৩-৪ সেকেন্ড সাদা স্ক্রিন দেখে বসে থাকে! অথচ আমি
        ফ্রন্টএন্ডে এমন কোনো জটিল অ্যানিমেশন বা বিশাল ভিডিও-ও দিইনি। তাহলে ক্লায়েন্ট
        বান্ডেল সাইজ এত ভারী হলো কীভাবে?!
      </Line>

      <Line name="নেক্সট-ভাই">
        (ল্যাপটপের DevTools খুলে Bundle Analyzer রান করে) হুম! ভুলু, তোর ফ্রন্টএন্ড
        বান্ডেল তো ৩ মেগাবাইটের এলিয়েন সাইজ হয়ে বসে আছে! আর এর পেছনের খলনায়ক হলো তোর{" "}
        <strong>Fake Tree-Shaking</strong> আর অগোছালো ইমপোর্ট!
      </Line>

      {/* ── Tree shaking ──────────────────────────────────────────────── */}
      <H2 id="tree-shaking">১. Tree-Shaking ফেইলিওর</H2>

      <Line name="ভুলু ভাই">
        &quot;ট্রি-শেকিং&quot;? গাছ ঝাঁকানো আবার কী জিনিস ভাই?! আর ইমপোর্ট তো
        ইমপোর্টই, আমি তো শুধু ২-৩টা আইকন আর তারিখ ফরম্যাট করার জন্য ছোট লাইব্রেরি
        ইমপোর্ট মারছিলাম!
      </Line>

      <Line name="নেক্সট-ভাই">
        সেটাই তো আসল প্যাঁচ! তোকে প্র্যাকটিক্যালি দেখাই। তুই তোর সাইটে Lucide Icons বা
        FontAwesome থেকে মাত্র ২টা আইকন দেখানোর জন্য এইভাবে ইমপোর্ট করছিস, তাই না?
      </Line>

      <CodeBlock filename="ProductCard.tsx">{`// ❌ ভুলু ভাইয়ের ভয়াবহ ইমপোর্ট (Fat Bundle Alert!)
import { Heart, Search } from 'lucide-react';
import { lodash } from 'lodash';`}</CodeBlock>

      <Line name="ভুলু ভাই">
        হ্যাঁ! কেন, এতে সমস্যা কী? আমি তো অবজেক্ট ডেস্ট্রাকচার করে শুধু{" "}
        <code>Heart</code> আর <code>Search</code> নামিয়ে এনেছি! বাকি ১০০০টা আইকন তো আর
        ইমপোর্ট করিনি!
      </Line>

      <Line name="নেক্সট-ভাই">
        তোর কাছে মনে হচ্ছে তুই শুধু ২টা আইকন এনেছিস, কিন্তু আধুনিক জাভাস্ক্রিপ্ট
        বান্ডলার (যেমন Turbopack বা Webpack) যদি দেখে লাইব্রেরিটা ঠিকমতো CommonJS/ESM
        এক্সপোর্ট সাপোর্ট করে না, সে পুরো ১০০০ আইকনের জাভাস্ক্রিপ্ট ফাইলই তোর ক্লায়েন্ট
        বান্ডেলে গুঁজে দেবে! একেই বলে <strong>Tree-Shaking Failure</strong>!
      </Line>

      <p>
        গাছ ঝাঁকালে শুধু শুকনো পাতা (অপ্রয়োজনীয় কোড) ঝরে যাওয়ার কথা ছিল, কিন্তু ভুল
        ইমপোর্টের কারণে পুরো গাছটাই তোর ফ্রন্টএন্ড বান্ডেলে এসে পড়েছে!
      </p>

      <Diagram>{`[Main Library: 1,000+ Icons / Heavy JS]
       │
       ├── ❌ Bad Import: Bundler imports ENTIRE package (300KB+)
       └── ✅ Direct/Modular Import: Bundler isolates only 2 Icons (2KB)`}</Diagram>

      <Line name="ভুলু ভাই">
        (চোখ কপালে তুলে) বলিস কী ভাই?! মাত্র ২টা আইকনের বদলে হাজারটা আইকনের কোড ইউজার
        ডাউনলোড করছে?!
      </Line>

      <Line name="নেক্সট-ভাই">
        শুধু তাই না! তুই <code>moment.js</code> বা ভারী কোনো ডেট লাইব্রেরি ইমপোর্ট করে
        বসে আছিস, যার সাথে সব দেশের ল্যাঙ্গুয়েজের বিশাল ফাইল ক্লায়েন্ট ফ্রন্টএন্ডে চলে
        এসেছে!
      </Line>

      <p>
        প্রোডাকশন-লেভেলে ফ্রন্টএন্ড বান্ডেল সাইজ ধুলোয় মিশিয়ে দেওয়ার ৩টা গোল্ডেন রুল
        মনে রাখবি।
      </p>

      {/* ── Modular imports ───────────────────────────────────────────── */}
      <H2 id="modular-imports">২. Direct Modular Imports ও optimizePackageImports</H2>

      <Line name="নেক্সট-ভাই">
        বড় আইকন বা ইউআই লাইব্রেরি ব্যবহারের সময় নির্দিষ্ট পাথে (Path) গিয়ে ডিরেক্ট
        ইমপোর্ট করবি, অথবা <code>next.config.js</code>-এ Next.js-এর ইন-বিল্ট অপটিমাইজার
        ব্যবহার করবি।
      </Line>

      <CodeBlock label="JavaScript" filename="next.config.js">{`// next.config.js (Next.js-এর ইন-বিল্ট স্মার্ট ট্রি-শেকিং)
module.exports = {
  experimental: {
    optimizePackageImports: ['lucide-react', 'lodash-es', 'date-fns'],
  },
};`}</CodeBlock>

      <Note>
        <p>
          এই ফ্ল্যাগটা ব্যারেল ফাইলের (<code>index.js</code> যেখান থেকে সব এক্সপোর্ট
          হয়) ইমপোর্টগুলোকে বিল্ড টাইমে ভেঙে সরাসরি সাব-পাথ ইমপোর্টে বদলে দেয় — অর্থাৎ
          হাতে হাতে <code>lucide-react/icons/heart</code> লেখার কাজটা Next.js নিজেই করে
          দেয়।
        </p>
      </Note>

      {/* ── Code splitting ────────────────────────────────────────────── */}
      <H2 id="code-splitting">৩. next/dynamic দিয়ে কোড-স্প্লিটিং</H2>

      <Line name="ভুলু ভাই">
        ভাই, আমার তো পেজের নিচে একটা ভারী React চার্ট (Chart.js) আর রিচ টেক্সট এডিটর
        (Editor) আছে। ইউজার স্ক্রোল না করা পর্যন্ত তো ওগুলোর দরকার নেই! কিন্তু ওগুলোও কি
        ফার্স্ট লোড বান্ডেল বাড়াচ্ছে?
      </Line>

      <Line name="নেক্সট-ভাই">
        অবশ্যই! যে ফ্রন্টএন্ড কম্পোনেন্ট ফার্স্ট পেজ লোডে (Above the fold) দরকার নেই,
        তাকে সরাসরি <code>next/dynamic</code> দিয়ে কোড-স্প্লিট (Code Splitting) করবি।
        এতে ফার্স্ট পেজ লোড হবে ঝড়ের বেগে, আর স্ক্রোল করার সময় ওই নির্দিষ্ট অংশ টুকরো
        জাভাস্ক্রিপ্ট ফাইল আকারে ডাউনলোড হবে!
      </Line>

      <CodeBlock filename="EditorPanel.tsx">{`// ✅ Lazy load heavy UI components
import dynamic from 'next/dynamic';

const HeavyEditor = dynamic(() => import('@/components/RichTextEditor'), {
  loading: () => <div className="h-40 bg-gray-100 animate-pulse" />,
  ssr: false, // Client-only component
});`}</CodeBlock>

      {/* ── Third parties ─────────────────────────────────────────────── */}
      <H2 id="third-parties">৪. @next/third-parties দিয়ে থার্ড-পার্টি স্ক্রিপ্ট</H2>

      <Line name="ভুলু ভাই">
        আর গুগল এনালিটিক্স (GTM) বা ইউটিউব এম্বেড ভিডিও থাকলে কী করব? ওগুলো তো ক্লায়েন্ট
        মেইন থ্রেডকে একদম ব্লক করে দেয়!
      </Line>

      <Line name="নেক্সট-ভাই">
        তার জন্য সাধারণ <code>&lt;script&gt;</code> বা আইফ্রেম না বসিয়ে অফিসিয়াল{" "}
        <code>@next/third-parties</code> প্যাকেজ ব্যবহার করবি। এটা ফ্রন্টএন্ডের মূল
        থ্রেড থামানো ছাড়াই ব্যাকগ্রাউন্ডে ভারী ট্র্যাকিং ও এম্বেড লোড করতে পারে!
      </Line>

      <CodeBlock filename="app/layout.tsx">{`// ✅ Web Vital Safe Analytics Loading
import { GoogleAnalytics } from '@next/third-parties/google';

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        {children}
        <GoogleAnalytics gaId="G-XYZ123" />
      </body>
    </html>
  );
}`}</CodeBlock>

      <Line name="ভুলু ভাই">
        (ল্যাপটপের বান্ডেল এনালাইজার চেক করতে করতে) ওয়াও! আমি শুধু{" "}
        <code>optimizePackageImports</code> আর <code>next/dynamic</code> মারাতে বান্ডেল
        সাইজ ৩ মেগাবাইট থেকে নেমে সোজা ৪৫০ কিলোবাইটে চলে আসলো! লাইটহাউজের স্কোর এখন
        ৯৫+!
      </Line>

      <Line name="নেক্সট-ভাই">
        বিঙ্গো! ফ্রন্টএন্ড ইঞ্জিনিয়ারিং মানেই হলো{" "}
        <strong>Ship Less JS to Browser</strong>। জাভাস্ক্রিপ্ট যত কম ব্রাউজারে পাঠাবি,
        সাইট তত রকেটের মতো স্পিডে চলবে!
      </Line>

      {/* ── Takeaway ──────────────────────────────────────────────────── */}
      <H2 id="takeaway">💡 Production Frontend Takeaways</H2>

      <ul>
        <li>
          <strong>Tree-Shaking Failures:</strong> ভুল ইমপোর্ট সিনট্যাক্স বা
          আন-অপটিমাইজড CommonJS লাইব্রেরির কারণে পুরো প্যাকেজ ফ্রন্টএন্ড বান্ডেলে চড়ে
          বসে।
        </li>
        <li>
          <strong>Package Optimization:</strong> <code>next.config.js</code>-এর{" "}
          <code>optimizePackageImports</code> ফ্ল্যাগ ব্যবহার করে ভারী আইকন ও হেল্পার
          লাইব্রেরির সাইজ প্রায় ৯০% পর্যন্ত কমানো সম্ভব।
        </li>
        <li>
          <strong>Deferred UI Loading:</strong> ফার্স্ট-স্ক্রিন ইউআই-এর বাইরে থাকা ভারী
          উইজেটগুলোকে <code>next/dynamic</code> দিয়ে লেজি-লোড (Lazy Load) করা ফ্রন্টএন্ড
          পারফর্মেন্সের প্রধান শর্ত।
        </li>
      </ul>
    </article>
  );
}
