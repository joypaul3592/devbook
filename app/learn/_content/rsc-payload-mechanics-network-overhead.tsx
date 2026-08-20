import {
  CodeBlock,
  Diagram,
  H2,
  Line,
  Note,
} from "@/components/learn/DocParts";
import type { Bi } from "@/lib/curriculum";

/** Section anchors — consumed by the "on this page" rail. */
export const headings: { id: string; label: Bi }[] = [
  {
    id: "the-problem",
    label: { bn: "অদ্ভুত .rsc রেসপন্স", en: "The strange .rsc response" },
  },
  {
    id: "why-not-html",
    label: { bn: "HTML পাঠালেই তো হতো", en: "Why not just HTML?" },
  },
  {
    id: "whats-inside",
    label: { bn: "পে-লোডের ভেতরে কী", en: "What is inside the payload" },
  },
  { id: "payload-bloat", label: { bn: "পে-লোড ব্লোট", en: "Payload bloat" } },
  {
    id: "the-fix",
    label: {
      bn: "সমাধান — Boundary-তে ডাটা ছাঁটাই",
      en: "The fix — prune at the boundary",
    },
  },
  {
    id: "takeaway",
    label: { bn: "Production Takeaways", en: "Production takeaways" },
  },
];

export default function RscPayloadMechanics() {
  return (
    <article className="doc-prose">
      {/* ── The problem ───────────────────────────────────────────────── */}
      <H2 id="the-problem" anchorOnly>
        অদ্ভুত .rsc রেসপন্স — সার্ভার পাঠাচ্ছেটা কী?
      </H2>

      <p>
        দুপুর বেলা। ভুলু ভাই কপালে হাত দিয়ে ল্যাপটপের দিকে তাকিয়ে আছেন।
        নেটওয়ার্ক ট্যাবে ওয়াটারফল চার্ট দেখে তাঁর মাথা ঘুরছে!
      </p>

      <Line name="ভুলু ভাই">
        নেক্সট-ভাই, Next.js কী জাদুটোনা করছে আমি কিছুই বুঝতে পারছি না! আমি তো
        জানি সার্ভার রেন্ডারিং (SSR) করলে সার্ভার থেকে প্লেইন HTML ব্রাউজারে
        আসে। কিন্তু DevTools-এর Network Tab খুলে দেখি পেজ নেভিগেট করার সময়{" "}
        <code>.rsc</code> টাইপের কী একটা অদ্ভুত রেসপন্স আসছে! ভেতরে ঢুকে দেখি
        হিজিবিজি কিছু কোড — কোথাও <code>1:I[...]</code>, কোথাও{" "}
        <code>$Sreact.element</code>! এগুলা কী ভাই? ব্রাউজার কি এখন HTML বাদ
        দিয়ে বাংলা-লিংক ভাষায় কথা বলা শুরু করলো?!
      </Line>

      <Line name="নেক্সট-ভাই">
        (হেসে কফিতে চুমুক দিয়ে) হা হা! ভুলু, তুই তো Next.js App Router-এর
        সবচেয়ে বড় সিক্রেট ইঞ্জিন <strong>RSC Payload</strong> (React Server
        Component Payload) আবিষ্কার করে ফেলেছিস!
      </Line>

      {/* ── Why not HTML ──────────────────────────────────────────────── */}
      <H2 id="why-not-html">১. HTML পাঠালেই তো হতো, তাই না?</H2>

      <Line name="ভুলু ভাই">
        ইঞ্জিন মানে? পেজ লোড করার জন্য তো HTML পাঠালেই হতো, এই এলিয়েন ফর্মেটের
        অবজেক্ট পে-লোড পাঠাইয়া ব্যাকএন্ড আর ফ্রন্টএন্ডের ব্যান্ডউইথ নষ্ট করার
        কী দরকার ছিল?
      </Line>

      <Line name="নেক্সট-ভাই">
        এখানেই তো আসল ম্যাজিক! তুই যখন প্রথমবার সাইটে ঢুকিস (Initial Page Load),
        তখন Next.js ঠিকই সার্ভার থেকে ফুল HTML + JS পাঠায় যাতে ইউজার সাথে সাথে
        পেজ দেখতে পায়। কিন্তু যখন তুই ক্লায়েন্ট সাইডে পেজ এক জায়গা থেকে অন্য
        জায়গায় নেভিগেট করিস, তখন পুরো HTML পেজ আবার ডাউনলোড করা মানে
        নেটওয়ার্ক আর প্রসেসিং পাওয়ারের অপচয়!
      </Line>

      <p>
        তখন App Router পুরো পেজ রিলোড না করে শুধু ব্যাকএন্ড থেকে একটা RSC
        Payload ডাউনলোড করে।
      </p>

      <Diagram>{`[Server Engine]
       │
       ├── 1. Pre-renders Server Components
       ├── 2. Serializes UI Tree to Binary/Text Format (.rsc)
       └── 3. Passes Client Component Props & Bundle References
       │
       ▼
[Network Stream: Fast .rsc Payload]
       │
       ▼
[Client Reconciliation]
       └── React uses Payload to seamlessly update DOM without losing state!`}</Diagram>

      {/* ── What's inside ─────────────────────────────────────────────── */}
      <H2 id="whats-inside">২. RSC Payload-এর ভেতরে আসলে কী থাকে</H2>

      <Line name="ভুলু ভাই">ওয়েট! এই RSC Payload-এর ভেতরে আসলে কী থাকে?</Line>

      <Line name="নেক্সট-ভাই">একদম সহজ ৪টা জিনিস থাকে:</Line>

      <ul>
        <li>
          <strong>Rendered output of Server Components</strong> — সার্ভার
          কম্পোনেন্টের রেন্ডার করা ফলাফল (যেখানে কোনো ভারী JS ক্লায়েন্টে যায়
          না)।
        </li>
        <li>
          <strong>Placeholders for Client Components</strong> — ক্লায়েন্ট
          কম্পোনেন্টগুলো কোথায় বসবে তার নির্দেশিকা এবং তাদের ক্যাশ আইডি।
        </li>
        <li>
          <strong>Props passed to Client Components</strong> — তুই সার্ভার থেকে
          ক্লায়েন্ট কম্পোনেন্টে যেসব প্রপ্স পাস করেছিস।
        </li>
        <li>
          <strong>JS bundle references</strong> — ক্লায়েন্ট কম্পোনেন্ট চালানোর
          জন্য যেসব ব্রাউজার স্ক্রিপ্ট ফাইল লাগবে তাদের লিঙ্ক।
        </li>
      </ul>

      {/* ── Payload bloat ─────────────────────────────────────────────── */}
      <H2 id="payload-bloat">৩. Payload Bloat — যেখানে ভুলু ভাই মারা খায়</H2>

      <Line name="ভুলু ভাই">
        (একটু চিন্তা করে) আচ্ছা নেক্সট-ভাই, এই পে-লোড নিয়ে প্রোডাকশনে সমস্যা কী
        হতে পারে? আমার তো মনে হচ্ছে এটা বেশ লাইটওয়েট!
      </Line>

      <Line name="নেক্সট-ভাই">
        পে-লোড নিজে লাইটওয়েট, কিন্তু ভুলু ভাইয়ের মতো ইঞ্জিনিয়াররা যখন ভুল কোড
        লেখে, তখন এই পে-লোড এক একটা বিশাল সাইজের বোমা হয়ে যায়!
      </Line>

      <p>
        যেমন ধর, তুই একটা সার্ভার কম্পোনেন্টে পুরো ২০ মেগাবাইটের ডাটাবেজ রেসপন্স
        (Large JSON Tree) ব্যাকএন্ড থেকে ফেচ করলি। সেখান থেকে মাত্র ২টা ফিল্ড (
        <code>id</code> আর <code>title</code>) নিয়ে একটা Client Component-কে
        প্রপ্স হিসেবে পাঠিয়ে দিলি:
      </p>

      <CodeBlock filename="product-page-bad.tsx">{`// ❌ ভুলু ভাইয়ের প্রোডাকশন কিলিং কোড
export default async function ProductPage() {
  const hugeDatabaseObj = await get10000ProductsWithAllDetails();

  return (
    // ⚠️ মারাত্মক ভুল! পুরো hugeDatabaseObj টাই
    // RSC Payload-এ সিরিয়ালাইজ হয়ে ক্লায়েন্টে চলে যাবে!
    <ClientProductCard data={hugeDatabaseObj} />
  );
}`}</CodeBlock>

      <Line name="ভুলু ভাই">
        (চোখ বড় বড় করে) হায় হায়! আমি তো ভেবেছিলাম{" "}
        <code>ClientProductCard</code> শুধু ২টা ফিল্ড দেখাচ্ছে, তারমানে
        ক্লায়েন্টে শুধু ২টা ফিল্ডই যাবে!
      </Line>

      <Line name="নেক্সট-ভাই">
        একদম না! তুই প্রপ্স হিসেবে পুরো অবজেক্ট পাঠাচ্ছিস মানে React-কে ওই বিশাল
        অবজেক্টটাকেই RSC Payload-এ Serialize করতে হচ্ছে।
      </Line>

      <p>এর ফলে:</p>

      <ul>
        <li>
          তোর <code>.rsc</code> সাইজ কয়েক কিলোবাইট থেকে বেড়ে কয়েক মেগাবাইট
          হয়ে যাবে।
        </li>
        <li>সার্ভার CPU সিরিয়ালাইজ করতে গিয়ে হাই ল্যাটেন্সিতে পড়বে।</li>
        <li>
          ইউজারের মোবাইল ব্রাউজার এই বিশাল পে-লোড ডিসিরিয়ালাইজ (Parse) করতে
          গিয়ে হ্যাং করবে!
        </li>
      </ul>

      {/* ── The fix ───────────────────────────────────────────────────── */}
      <H2 id="the-fix">৪. সমাধান: Data Sanitization at the Boundary</H2>

      <Line name="ভুলু ভাই">
        ওরে বাবা! তাহলে প্রোডাকশনে RSC Payload হালকা রাখার সঠিক আর্কিটেকচার
        কোনটা?
      </Line>

      <Line name="নেক্সট-ভাই">
        সমাধান একদম সিম্পল — <strong>Data Sanitization at the Boundary</strong>!
        ক্লায়েন্ট কম্পোনেন্টে শুধু ততটুকুই প্রপ্স পাঠাবি, যতটুকু স্ক্রিনে
        দরকার!
      </Line>

      <CodeBlock filename="product-page-good.tsx">{`// ✅ প্রোডাকশন লেভেল অপটিমাইজড কোড
export default async function ProductPage() {
  const hugeDatabaseObj = await get10000ProductsWithAllDetails();

  // শুধুমাত্র প্রয়োজনীয় ডাটা এক্সট্র্যাক্ট করে প্রপ্স পাস করা
  const minimalData = {
    id: hugeDatabaseObj.id,
    title: hugeDatabaseObj.title,
  };

  return <ClientProductCard data={minimalData} />;
}`}</CodeBlock>

      <Line name="ভুলু ভাই">
        (ল্যাপটপের স্ক্রিনে নেটওয়ার্ক ট্যাবটা আবার চেক করে) আহারে! আমি তো
        ড্যাশবোর্ডের সব ইউজারের লিস্ট সার্ভার থেকে ক্লায়েন্ট টেবিলে প্রপ্স
        হিসেবে পাঠিয়ে পে-লোডের সাইজ ৫ এমবি বানিয়ে বসে ছিলাম! তাই বলি নেভিগেট
        করতে গেলে এত স্লো লাগে কেন!
      </Line>

      <Line name="নেক্সট-ভাই">হা হা! এই জন্যই RSC Payload বুঝতে হয়।</Line>

      <Note>
        <p>পে-লোড হলো সাইটের নেটওয়ার্ক ব্যাকবোন।</p>
        <p>প্রপ্স পাঠানোর সময় ডাটা ফিল্টার করে ছোট রাখতে হবে।</p>
        <p>
          তাহলেই ক্লায়েন্ট সাইড নেভিগেশন হবে একদম স্ন্যাপি (Snappy) আর
          ইনস্ট্যান্ট!
        </p>
      </Note>

      <Line name="ভুলু ভাই">
        থ্যাংকস নেক্সট-ভাই! আমি এখনই আমার প্রপ্স ড্রিলিং আর হেভি অবজেক্ট পাসিং
        বন্ধ করে পে-লোড সাইজ ব্যাক টু লাইটওয়েট করছি!
      </Line>

      {/* ── Takeaway ──────────────────────────────────────────────────── */}
      <H2 id="takeaway">💡 Production Engineering Takeaways</H2>

      <ul>
        <li>
          <strong>RSC Payload Content:</strong> এতে রেন্ডার করা সার্ভার ট্রি,
          ক্লায়েন্ট কম্পোনেন্টের রেফারেন্স এবং ক্লায়েন্টে পাঠানো প্রপ্স থাকে —
          কোনো রি-এক্সিকিউটেবল JS ওভারহেড থাকে না।
        </li>
        <li>
          <strong>Payload Bloat:</strong> সার্ভার থেকে ক্লায়েন্ট কম্পোনেন্টে
          বড় অবজেক্ট প্রপ্স হিসেবে পাঠালে RSC Payload সাইজ অনর্থক বেড়ে যায়
          (Massive Overhead)।
        </li>
        <li>
          <strong>Data Pruning:</strong> সবসময় Server Boundary-তেই ডাটা
          ফিল্টার/ম্যাপ করে শুধুমাত্র প্রয়োজনীয় প্রিমিটিভ বা মিনিমাল অবজেক্ট
          প্রপ্স হিসেবে পাস করা উচিত।
        </li>
      </ul>
    </article>
  );
}
