import { CodeBlock, Diagram, H2, Line, Note } from "@/components/learn/DocParts";
import type { Bi } from "@/lib/curriculum";

/** Section anchors — consumed by the "on this page" rail. */
export const headings: { id: string; label: Bi }[] = [
  {
    id: "four-caches",
    label: { bn: "একটা নয়, চারটা ক্যাশ", en: "Not one cache, but four" },
  },
  {
    id: "request-flow",
    label: { bn: "একটা রিকোয়েস্টের পুরো পথ", en: "The full path of a request" },
  },
  {
    id: "each-layer",
    label: { bn: "কোন ক্যাশ কী কাজ করে", en: "What each cache does" },
  },
  {
    id: "who-is-guilty",
    label: { bn: "পুরনো ডাটা — দোষী কে?", en: "Stale data — who is guilty?" },
  },
  {
    id: "cache-control",
    label: { bn: "ক্যাশ কন্ট্রোলের তিন উপায়", en: "Three ways to control cache" },
  },
  {
    id: "takeaway",
    label: { bn: "Production Takeaways", en: "Production takeaways" },
  },
];

export default function CachingHierarchy() {
  return (
    <article className="doc-prose">
      {/* ── The problem ───────────────────────────────────────────────── */}
      <H2 id="four-caches" anchorOnly>
        একটা নয়, চারটা ক্যাশ
      </H2>

      <p>
        পরদিন সকালে ভুলু ভাই নেক্সট-ভাইয়ের টেবিলের সামনে বসে খাতা-কলম নিয়ে একদম প্রস্তুত।
        তবে তাঁর চোখে-মুখে ব্যাপক কনফিউশন!
      </p>

      <Line name="ভুলু ভাই">
        নেক্সট-ভাই! আমি এতদিন ভাবতাম Next.js-এ ক্যাশিং মানে বোধহয় একটাই জায়গা — সার্ভার
        কোনোভাবে এপিআই রেসপন্স সেভ করে রাখে, ব্যস! কিন্তু কাল রাতে অফিশিয়াল ডকুমেন্টেশন
        পড়তে গিয়ে দেখি ৪-৪টা ক্যাশ লেয়ারের নাম লেখা: Request Memoization, Data Cache,
        Full Route Cache, আর Router Cache! এতগুলো ক্যাশ লেয়ার একসাথে কী করে ভাই?! কার পর
        কে কাজ করে, আর ডাটা আপডেট না হলে কোনটা দোষী — আমি কিছুই বুঝতে পারছি না!
      </Line>

      <Line name="নেক্সট-ভাই">
        (হেসে কফিতে চুমুক দিয়ে) হা হা! ভুলু, আর্কিটেকচারাল দিক থেকে Next.js-এর সবচেয়ে
        পাওয়ারফুল এবং একই সাথে সবচেয়ে ট্রিকি পার্টই হলো এই{" "}
        <strong>4-Tier Caching Hierarchy</strong>!
      </Line>

      {/* ── Request flow ──────────────────────────────────────────────── */}
      <H2 id="request-flow">১. একটা রিকোয়েস্টের পুরো পথ</H2>

      <Line name="নেক্সট-ভাই">
        প্রোডাকশনে যখন একটা রিকোয়েস্ট ক্লায়েন্ট ব্রাউজার থেকে বের হয়ে সার্ভার হয়ে
        থার্ড-পার্টি এপিআই পর্যন্ত যায়, তখন সে এই ৪টা লেয়ার পার করে। তোকে একটা ভিজ্যুয়াল
        ফ্লো দিয়ে বুঝাই:
      </Line>

      <Diagram>{`[1. Client Browser]
       │
       ▼ (Client-Side In-Memory Cache)
[Router Cache]  ──(Hit?)──> ⚡ Serves Instant Navigation UI
       │ (Miss)
       ▼
[2. Server Layer]
       │
       ▼ (Server Pre-rendered HTML + RSC Payload)
[Full Route Cache] ──(Hit?)──> ⚡ Serves Cached Static Route
       │ (Miss / Dynamic)
       ▼
[3. React Component Rendering]
       │
       ▼ (In-Memory Function Deduplication)
[Request Memoization] ──(Hit?)──> ⚡ Returns Duplicate Call Result
       │ (Miss)
       ▼
[4. Data Storage Cache]
       │
       ▼ (Persistent HTTP Data Cache)
[Data Cache] ──(Hit?)──> ⚡ Returns Cached API Response
       │ (Miss)
       ▼
[5. External API / Database] (Actual Network Hit! 🌐)`}</Diagram>

      <Line name="ভুলু ভাই">
        (চোখ কপালে তুলে) ওরে বাপ্পরে! একটা এপিআই ডাটার জন্য এতগুলো চেকপোস্ট পার হতে হয়?!
        ভাই, প্রতিটি ক্যাশের আলাদা কাজ কী, সহজ ভাষায় একটু বুঝিয়ে বলো তো!
      </Line>

      {/* ── Each layer ────────────────────────────────────────────────── */}
      <H2 id="each-layer">২. কোন ক্যাশ কী কাজ করে</H2>

      <Line name="নেক্সট-ভাই">একদম সহজ ৪টা পয়েন্টে বুঝে নে:</Line>

      <ul>
        <li>
          <strong>Router Cache (Client-Side In-Memory)</strong> — থাকে ইউজারের ব্রাউজার
          মেমরিতে, ওই SPA সেশনের ভেতরে। অ্যাপের এক রাউট থেকে আরেক রাউটে নেভিগেট করলে
          Next.js আগেই ওই পেজের RSC Payload ব্রাউজার মেমরিতে জমা রাখে। ফলে ব্যাক বাটন
          চাপলে বা আগের পেজে ফিরলে সার্ভারে হিট না করেই ইনস্ট্যান্ট ইউআই দেখায়।
        </li>
        <li>
          <strong>Full Route Cache (Server-Side)</strong> — থাকে সার্ভারের ফাইল সিস্টেমে
          বা এজ মেমরিতে, বিল্ড টাইম বা প্রি-রেন্ডার টাইমে তৈরি। যে পেজগুলো স্ট্যাটিক
          হিসেবে রেন্ডার হয়, তাদের পুরো HTML আর RSC Payload সার্ভার ধরে রাখে — ফলে নতুন
          ইউজার ঢুকলে পুরো React কম্পোনেন্ট ট্রি আবার এক্সিকিউট করতেই হয় না।
        </li>
        <li>
          <strong>Request Memoization (Server React Lifecycle)</strong> — বাঁচে
          শুধুমাত্র একটা সিঙ্গেল সার্ভার রিকোয়েস্ট লাইফসাইকেলের জন্য। ধর তোর একই পেজের
          Header, Sidebar আর Profile — তিনটা কম্পোনেন্টই একই{" "}
          <code>fetch(&apos;/api/user&apos;)</code> ডাকল। এটা ব্যাকএন্ডে ৩ বার হিট হতে দেয়
          না; প্রথমবার ফেচ করে বাকি দুই জায়গায় ইন-মেমরি একই রেজাল্ট রিটার্ন করে।
        </li>
        <li>
          <strong>Data Cache (Persistent HTTP Cache)</strong> — থাকে সার্ভারের
          পারসিস্টেন্ট স্টোরেজে বা সেন্ট্রাল ক্যাশে (Node/Edge লেয়ার)। এটা রিকোয়েস্ট
          লাইফসাইকেলের বাইরেও বেঁচে থাকে — অর্থাৎ আলাদা ইউজার, আলাদা রিকোয়েস্ট, পেজ
          রিফ্রেশ — সবের পরেও থার্ড-পার্টি এপিআই রেসপন্স ধরে রাখে, যাতে আসল এপিআই বা
          ডাটাবেজে ওভারহেড না পড়ে।
        </li>
      </ul>

      <Note>
        <p>
          দুটো ক্যাশের আয়ু গুলিয়ে ফেলা সবচেয়ে কমন ভুল।{" "}
          <strong>Request Memoization</strong> এক রেন্ডার পাসের জিনিস — রিকোয়েস্ট শেষ,
          মেমরিও ফ্লাশ। আর <strong>Data Cache</strong> ডিপ্লয়মেন্ট আর রিস্টার্টের পরেও
          টিকে থাকতে পারে।
        </p>
      </Note>

      {/* ── Who is guilty ─────────────────────────────────────────────── */}
      <H2 id="who-is-guilty">৩. পুরনো ডাটা — দোষী কে?</H2>

      <Line name="ভুলু ভাই">
        (চিন্তা করে) দাঁড়াও নেক্সট-ভাই! একটা মারাত্মক প্রশ্ন মাথায় এসেছে! ধরো আমি
        থার্ড-পার্টি এপিআইতে একটা প্রোডাক্টের দাম আপডেট করলাম। কিন্তু আমার ওয়েবসাইট তো
        এখনও পুরনো দাম দেখাচ্ছে! এর মানে কোন ক্যাশটা ডাটা ধরে রাখছে?
      </Line>

      <Line name="নেক্সট-ভাই">
        দারুণ পয়েন্ট ধরেছিস! এই ঝামেলাতেই প্রোডাকশনে ৮০% ডেভেলপার আটকায়! ভাগ করে দেখ —
        ইউজার ব্রাউজারে <strong>নেভিগেট করার সময়</strong> পুরনো ডাটা দেখলে দোষী{" "}
        <strong>Router Cache</strong> বা <strong>Full Route Cache</strong>। আর সার্ভার
        নিজেই এপিআই রেসপন্স ধরে বসে থাকলে দোষী <strong>Data Cache</strong>।
      </Line>

      <Line name="নেক্সট-ভাই">যেমন ধর, তুই একটা সার্ভার কম্পোনেন্টে ফেচ করছিস:</Line>

      <CodeBlock filename="app/products/[id]/page.tsx">{`// ❌ পুরনো প্যাটার্ন — অপটিমিস্টিক ক্যাশ প্রবলেম
export default async function ProductPage() {
  // যদি Data Cache-এ এই রেজাল্ট স্থায়ী থাকে,
  // ডাটাবেজে দাম বদলালেও এপিআই আর হিটই হবে না!
  const res = await fetch('https://api.example.com/products/1');
  const product = await res.json();

  return <h1>{product.price}</h1>;
}`}</CodeBlock>

      {/* ── Cache control ─────────────────────────────────────────────── */}
      <H2 id="cache-control">৪. ক্যাশ কন্ট্রোলের তিন উপায়</H2>

      <Line name="ভুলু ভাই">
        তাহলে এই ৪টা ক্যাশকে একসাথে রিভ্যালিডেট বা বাইপাস করার আর্কিটেকচার কোনটা?
      </Line>

      <Line name="নেক্সট-ভাই">ক্যাশ কন্ট্রোল করার ৩টা গোল্ডেন উপায়:</Line>

      <ul>
        <li>
          <strong>Request Level (Data Cache Bypass):</strong>{" "}
          <code>fetch(url, {`{ cache: 'no-store' }`})</code> — অথবা Next.js 16-এর
          uncached-by-default স্টাইল, যেখানে ক্যাশ করতে চাইলে সেটা তোকে এক্সপ্লিসিটলি
          বলতে হয়।
        </li>
        <li>
          <strong>On-demand Revalidation (Server-side wipe):</strong> Server Action বা
          রুট হ্যান্ডলারের ভেতর <code>revalidateTag(&apos;product-1&apos;)</code> বা{" "}
          <code>revalidatePath(&apos;/products&apos;)</code> চালানো। এটা চালানোর সাথে
          সাথে Data Cache আর Full Route Cache — দুটোই একসাথে ইনভ্যালিডেট হয়ে যায়!
        </li>
        <li>
          <strong>Client Refresh:</strong> ক্লায়েন্ট সাইডে <code>router.refresh()</code>{" "}
          কল করা, যা ব্রাউজারের Router Cache ক্লিয়ার করে সার্ভার থেকে ফ্রেশ RSC Payload
          নিয়ে আসে।
        </li>
      </ul>

      <Line name="ভুলু ভাই">
        (খাতায় চার্ট এঁকে) আহা! এবার পুরো পানির মতো পরিষ্কার! ক্লায়েন্ট লেভেলে দ্রুত
        নেভিগেট করায় ➔ Router Cache। সার্ভারে পুরো এইচটিএমএল ক্যাশ করে রাখে ➔ Full Route
        Cache। এক রেন্ডারে একই এপিআই ফেচ ডুপ্লিকেট হওয়া আটকায় ➔ Request Memoization। আর
        আসল এপিআই রেসপন্স সার্ভারে সেভ রাখে ➔ Data Cache!
      </Line>

      <Line name="নেক্সট-ভাই">
        পারফেক্ট! এই ক্যাশ হায়ারার্কি যে ইঞ্জিনিয়ারের মাথায় পরিষ্কার থাকবে, সে কখনো
        স্টেল ডাটা বা অনাকাঙ্ক্ষিত ক্যাশ বাগ নিয়ে প্রবলেমে পড়বে না!
      </Line>

      {/* ── Takeaway ──────────────────────────────────────────────────── */}
      <H2 id="takeaway">💡 Production Engineering Takeaways</H2>

      <ul>
        <li>
          <strong>Multi-tier Caching:</strong> Next.js ক্লায়েন্ট মেমরি (Router), সার্ভার
          এইচটিএমএল (Full Route), ফাংশন মেমোরাইজেশন (Request Memoization) আর ডাটা সেভিং
          (Data Cache) — এই ৪ ধাপে ক্যাশিং পরিচালনা করে।
        </li>
        <li>
          <strong>Request Memoization Scope:</strong> এটা শুধু একটা সিঙ্গেল রিকোয়েস্ট
          রেন্ডার লাইফসাইকেলেই বেঁচে থাকে; রিকোয়েস্ট শেষ হওয়া মাত্র সার্ভার ওই মেমরি
          ফ্লাশ করে দেয়।
        </li>
        <li>
          <strong>Surgical Invalidation:</strong> ডাটা মিউটেশনের পর{" "}
          <code>revalidateTag()</code> বা <code>revalidatePath()</code> ব্যবহার করলে Data
          Cache আর Full Route Cache — দুটো থেকেই পুরনো কন্টেন্ট একসাথে ফ্ল্যাশ হয়ে যায়।
        </li>
      </ul>
    </article>
  );
}
