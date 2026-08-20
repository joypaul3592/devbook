import { CodeBlock, Diagram, H2, Line, Note } from "@/components/learn/DocParts";
import type { Bi } from "@/lib/curriculum";

/** Section anchors — consumed by the "on this page" rail. */
export const headings: { id: string; label: Bi }[] = [
  {
    id: "the-problem",
    label: { bn: "useState মডালের সীমা", en: "The limits of a useState modal" },
  },
  {
    id: "two-primitives",
    label: { bn: "দুটো প্রিমিটিভ — (.) আর @modal", en: "Two primitives — (.) and @modal" },
  },
  {
    id: "two-paths",
    label: { bn: "সফট নেভ বনাম ডিরেক্ট URL", en: "Soft nav vs direct URL" },
  },
  {
    id: "wiring",
    label: { bn: "লেআউটে স্লট ওয়্যারিং", en: "Wiring the slot in the layout" },
  },
  {
    id: "takeaway",
    label: { bn: "Production Takeaways", en: "Production takeaways" },
  },
];

export default function ParallelInterceptingRoutes() {
  return (
    <article className="doc-prose">
      {/* ── The problem ───────────────────────────────────────────────── */}
      <H2 id="the-problem" anchorOnly>
        useState মডালের সীমা
      </H2>

      <p>
        পরদিন সকালে। ভুলু ভাই ল্যাপটপে একটা ই-কমার্স প্রজেক্ট দেখাচ্ছেন। মুখে হালকা
        বিজয়ের হাসি, কিন্তু একই সাথে বেশ চিন্তিত!
      </p>

      <Line name="ভুলু ভাই">
        নেক্সট-ভাই! আমি ই-কমার্সের প্রোডাক্ট গ্রিড থেকে প্রোডাক্টে ক্লিক করলে একটা পপআপ
        মডাল (Modal) খোলার ফিচার বানিয়েছি। সাধারণ React স্টেট (<code>isOpen</code>)
        দিয়ে কাজ চমৎকার হচ্ছে! কিন্তু ক্লায়েন্ট এসে একটা অদ্ভুত দাবি করেছে — ইউজার নাকি
        মডাল খোলা অবস্থায় ইউআরএল কপি করে কাউকে পাঠালে বা পেজ রিফ্রেশ দিলে মডাল উধাও না
        হয়ে সোজা ওই প্রোডাক্টের ডেডিকেটেড পেজে যেতে হবে! আবার ব্রাউজারের ব্যাক বাটন
        চাপলে মডাল বন্ধ হয়ে পেজ আগের জায়গায় থাকতে হবে! সাধারণ React স্টেট দিয়ে কি এই
        ইউআরএল সিঙ্ক আর ব্যাক-বাটন হ্যান্ডেল করা সম্ভব ভাই?!
      </Line>

      <Line name="নেক্সট-ভাই">
        (হেসে কফিতে চুমুক দিয়ে) প্লেইন <code>useState</code> বা <code>isOpen</code>{" "}
        স্টেট তো শুধু ইউজারের ব্রাউজারের মেমরিতে থাকে, ওটার সাথে ইউআরএল আর ব্রাউজার
        হিস্ট্রির (Browser History) কোনো সম্পর্কই নেই! এই প্রবলেম সলভ করতেই Next.js
        ফ্রন্টএন্ডে এনেছে চমৎকার আর্কিটেকচার:{" "}
        <strong>Parallel (@modal) &amp; Intercepting Routes ((.))</strong>।
      </Line>

      {/* ── Two primitives ────────────────────────────────────────────── */}
      <H2 id="two-primitives">১. দুটো প্রিমিটিভ — (.) আর @modal</H2>

      <Line name="ভুলু ভাই">
        (অবাক হয়ে) এগুলা আবার ফোল্ডারের নামের ভেতর বিশেষ ব্র্যাকেট দেওয়া কী টেকনিক
        ভাই?! <code>@modal</code> আর <code>(.)</code> দিয়ে ব্রাউজারকে কীভাবে ট্রিক করা
        হয়?
      </Line>

      <Line name="নেক্সট-ভাই">আইডিয়াটা খুবই জিনিয়াস!</Line>

      <ul>
        <li>
          <strong>Intercepting Route — </strong>
          <code>(.)photo/[id]</code> — যখন ইউজার একই পেজের কোনো লিংকে ক্লিক করে নেভিগেট
          করে, Next.js তখন আসল পেজে না গিয়ে ইউআরএল ইন্টারসেপ্ট করে একটা{" "}
          <strong>Soft Navigation Modal</strong> হিসেবে স্ক্রিনের ওপর ভাসিয়ে দেয়!
        </li>
        <li>
          <strong>Parallel Route — </strong>
          <code>@modal</code> — এটি মূল পেজের পাশাপাশি একই ইউআই লেআউটে সমান্তরালে
          (parallel) অন্য একটি পেজ স্লট হিসেবে রেন্ডার করায়।
        </li>
      </ul>

      <Diagram>{`app/
└── feed/
    ├── layout.tsx                  -> Maps the @modal slot to a prop
    ├── page.tsx                    -> Product Feed Page
    │
    ├── @modal/
    │   ├── default.tsx             -> Null/empty fallback slot
    │   └── (.)photo/[id]/
    │       └── page.tsx            -> ⚡ Soft Nav: renders as a modal over the feed
    │
    └── photo/[id]/
        └── page.tsx                -> 🌐 Hard Nav / direct URL: full detailed page`}</Diagram>

      <Note>
        <p>
          <code>@modal/default.tsx</code> বাদ দেওয়া যাবে না। স্লটটা যখন খালি থাকা উচিত
          (মডাল বন্ধ), Next.js ওই ফাইলটাই রেন্ডার করে — সাধারণত{" "}
          <code>return null</code>। এটা না থাকলে রিফ্রেশে স্লটের জন্য 404 আসে।
        </p>
      </Note>

      {/* ── Two paths ─────────────────────────────────────────────────── */}
      <H2 id="two-paths">২. সফট নেভিগেশন বনাম ডিরেক্ট URL</H2>

      <Line name="ভুলু ভাই">
        (কপালে হাত দিয়ে) ওয়েট ওয়েট! তারমানে ইউজার যদি পেজের ভেতর থেকে প্রোডাক্টে ক্লিক
        করে?
      </Line>

      <Line name="নেক্সট-ভাই">
        DOM-এ প্রোডাক্ট ফিড ঠিকই ব্যাকগ্রাউন্ডে থাকবে, আর ইউআরএল চেঞ্জ হয়ে যাবে{" "}
        <code>/photo/123</code>-এ! কিন্তু স্ক্রিনে দেখাবে ইন্টারসেপ্ট করা{" "}
        <code>@modal</code> মডালটি!
      </Line>

      <Line name="ভুলু ভাই">
        আর ইউজার যদি ওই <code>/photo/123</code> ইউআরএলটা কপি করে নতুন ট্যাবে পেস্ট করে
        অথবা সরাসরি পেজ রিফ্রেশ মারে?
      </Line>

      <Line name="নেক্সট-ভাই">
        তখন Next.js ইন্টারসেপ্ট করবে না! সে সরাসরি{" "}
        <code>app/feed/photo/[id]/page.tsx</code> রাউট রান করে একটা{" "}
        <strong>Full Standalone Page</strong> হিসেবে সম্পূর্ণ প্রোডাক্ট পেজ লোড করিয়ে
        দেবে!
      </Line>

      <Line name="ভুলু ভাই">(চোখ বড় বড় করে) ওরে বাপ্পরে! তারমানে:</Line>

      <ul>
        <li>
          <strong>In-app click:</strong> সফট নেভিগেশনে ফাস্ট ও স্মুথ মডাল ইউআই খুলে যাবে!
        </li>
        <li>
          <strong>Direct link / Refresh:</strong> ডেডিকেটেড এসইও-ফ্রেন্ডলি ফুল পেজ হিসেবে
          ডিসপ্লে হবে!
        </li>
        <li>
          <strong>Back Button:</strong> ব্রাউজারের ব্যাক বাটন চাপলে কোনো স্টেট ঝামেলা
          ছাড়াই মডাল বন্ধ হয়ে ফিড পেজ আগের পজিশনে থাকবে!
        </li>
      </ul>

      <Line name="নেক্সট-ভাই">
        একদম! ইনস্টাগ্রাম, টুইটার/এক্স বা পিন্টারেস্টের মতো ওয়ার্ল্ড-ক্লাস অ্যাপগুলো
        কিন্তু এই আর্কিটেকচারেই চলে!
      </Line>

      {/* ── Wiring ────────────────────────────────────────────────────── */}
      <H2 id="wiring">৩. লেআউটে স্লট ওয়্যারিং</H2>

      <CodeBlock filename="app/feed/layout.tsx">{`// app/feed/layout.tsx (Parallel Route Slots Mapping)
export default function Layout({
  children,
  modal, // ⚡ \`@modal\` স্লট প্রপ হিসেবে আসবে
}: {
  children: React.ReactNode;
  modal: React.ReactNode;
}) {
  return (
    <div>
      {children} {/* Main Feed */}
      {modal}    {/* Parallel Intercepted Modal */}
    </div>
  );
}`}</CodeBlock>

      <Line name="ভুলু ভাই">
        (স্ক্রিনে কোড দেখতে দেখতে) আর মডাল বন্ধ করার জন্য কীভাবে রাউট হ্যান্ডেল করব ভাই?
      </Line>

      <Line name="নেক্সট-ভাই">
        শুধু <code>router.back()</code> কল করে দিলেই হবে! কারণ মডাল তো ব্রাউজারের
        হিস্ট্রি স্ট্যাকে রাউট হিসেবেই ঢুকেছে।
      </Line>

      <CodeBlock filename="app/feed/@modal/(.)photo/[id]/page.tsx">{`'use client';
import { useRouter } from 'next/navigation';

export default function PhotoModal() {
  const router = useRouter();

  // ⚡ হিস্ট্রি স্ট্যাক থেকে এক ধাপ পিছিয়ে গেলেই মডাল বন্ধ,
  //    আর ফিড পেজ ঠিক আগের স্ক্রোল পজিশনেই থাকে
  return <Dialog onClose={() => router.back()}>{/* ... */}</Dialog>;
}`}</CodeBlock>

      <Line name="ভুলু ভাই">
        জোস ভাই নেক্সট-ভাই! আমি এতদিন সাধারণ ডায়ালগ আর স্টেট সামলাতে গিয়ে ব্যাক-বাটন
        হ্যান্ডলিং আর ইউআরএল সিঙ্কিংয়ের বাগ নিয়ে কান্না করছিলাম! এবার একদম
        প্রোডাকশন-লেভেলের মডাল সিস্টেম বসিয়ে দিচ্ছি!
      </Line>

      {/* ── Takeaway ──────────────────────────────────────────────────── */}
      <H2 id="takeaway">💡 Production Frontend Takeaways</H2>

      <ul>
        <li>
          <strong>Intercepting Routes ((.)):</strong> ক্লায়েন্ট সাইড নেভিগেশনের সময় একই
          লেআউটের ভেতর ইউআরএল পরিবর্তন করে কনটেক্সচুয়াল ইউআই (যেমন মডাল) ইন্টারসেপ্ট করে
          দেখায়।
        </li>
        <li>
          <strong>Parallel Routes (@modal):</strong> একই রাউটে একাধিক স্বাধীন পেজ বা
          কন্টেন্ট স্লট সমান্তরালে রেন্ডার করার সুযোগ দেয়।
        </li>
        <li>
          <strong>SEO &amp; Deep-Linking Safety:</strong> শেয়ার করা লিঙ্ক বা রিফ্রেশে
          মডালের পরিবর্তে ফুল-সাইজ এসইও-ফ্রেন্ডলি পেজ সার্ভ হয়, যা প্রফেশনাল ই-কমার্স ও
          সোশ্যাল মিডিয়া অ্যাপের স্ট্যান্ডার্ড ইউএক্স।
        </li>
      </ul>
    </article>
  );
}
