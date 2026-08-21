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
      bn: "পুরোনো দাম, নতুন ডাটাবেজ",
      en: "Old price, new database",
    },
  },
  {
    id: "overview",
    label: {
      bn: "৪-স্তরের ক্যাশিং আর্কিটেকচার",
      en: "The 4-tier caching architecture",
    },
  },
  {
    id: "layers",
    label: { bn: "চারটি লেয়ার গভীরে", en: "The four layers up close" },
  },
  {
    id: "matrix",
    label: { bn: "এক নজরে তুলনা", en: "The matrix at a glance" },
  },
  {
    id: "takeaway",
    label: { bn: "Production Takeaways", en: "Production takeaways" },
  },
];

export default function FourTierCaching() {
  return (
    <article className="doc-prose">
      {/* ── The problem ───────────────────────────────────────────────── */}
      <H2 id="the-problem" anchorOnly>
        পুরোনো দাম, নতুন ডাটাবেজ
      </H2>

      <p>
        পরদিন সকাল ১০টা। ভুলু ভাই দুশ্চিন্তাগ্রস্ত মুখে ল্যাপটপের দিকে চেয়ে আছেন। তিনি একটা
        বড় ই-কমার্স প্রজেক্ট প্রোডাকশনে তুলেছেন। ডাটাবেজে একটি প্রোডাক্টের দাম আপডেট করা
        হলেও হোমপেজে পুরোনো দামই থেকে যাচ্ছে! আবার কখনো কোনো নির্দিষ্ট ইউজারের ড্যাশবোর্ডে
        অন্য ইউজারের ডাটা ক্যাশ হয়ে বসে থাকছে!
      </p>

      <Line name="ভুলু ভাই">
        (মাথায় হাত দিয়ে) নেক্সট-ভাই! Next.js-এর ক্যাশিং সিস্টেম তো আমাকে পাগল বানিয়ে দেবে!
        আমি ডাটাবেজে ডাটা চেঞ্জ করছি, কিন্তু ইউজাররা দেখছে পুরোনো ডাটা! আবার পেজ রিফ্রেশ
        দিলে কখনো চেঞ্জ হয়, কখনো হয় না! Next.js-এ ব্যাকগ্রাউন্ডে আসলে কয় জায়গায় আর কীভাবে
        ডাটা ক্যাশ হয়ে থাকে ভাই?!
      </Line>

      <Line name="নেক্সট-ভাই">
        (হেসে) ভুলু, শান্ত হ! Next.js-এর ক্যাশিং অ্যালগরিদমকে যদি তুই একবারে মাস্টার করতে
        চাস, তবে তোকে আগে বুঝতে হবে যে Next.js কোনো একক ক্যাশ ব্যবহার করে না। বরং এটি{" "}
        <strong>৪-স্তরের একটি ক্যাশিং আর্কিটেকচার</strong> দিয়ে পুরো অ্যাপ্লিকেশনকে রকেট
        স্পিড দেয়!
      </Line>

      <Line name="নেক্সট-ভাই">
        তুই যদি এই ৪টা লেয়ার আর তাদের লাইফসাইকেল একবার বুঝে যাস, তবে ক্যাশিং তোর শত্রু না
        হয়ে সবচেয়ে বড় বন্ধু হয়ে উঠবে!
      </Line>

      {/* ── Overview ──────────────────────────────────────────────────── */}
      <H2 id="overview">১. ৪-স্তরের ক্যাশিং আর্কিটেকচার</H2>

      <Line name="নেক্সট-ভাই">
        আগে মানচিত্রটা মাথার মধ্যে গেঁথে নে। রিকোয়েস্ট ব্রাউজার থেকে শুরু হয়ে ডাটাবেজ
        পর্যন্ত যাওয়ার পথে ৪টি আলাদা স্তরে ক্যাশিং ঘটে:
      </Line>

      <Diagram>{`[Browser / Client]
       │
       ▼
┌────────────────────────────────────────────────────────┐
│ 1. Router Cache (Client-side In-Memory)                │
└──────────────────────────┬─────────────────────────────┘
                           │ (Network Request)
                           ▼
┌────────────────────────────────────────────────────────┐
│ 2. Full Route Cache (Server Rendered HTML & RSC Payload)│
└──────────────────────────┬─────────────────────────────┘
                           │
                           ▼
┌────────────────────────────────────────────────────────┐
│ 3. Request Memoization (In-Memory React Component Tree)│
└──────────────────────────┬─────────────────────────────┘
                           │
                           ▼
┌────────────────────────────────────────────────────────┐
│ 4. Data Cache (Persistent Fetch Response Cache)        │
└──────────────────────────┬─────────────────────────────┘
                           │
                           ▼
                  [Database / Origin API]`}</Diagram>

      {/* ── The four layers ───────────────────────────────────────────── */}
      <H2 id="layers">২. চারটি লেয়ার গভীরে</H2>

      <H3>Layer 1 — Request Memoization (Server-Side Component Tree)</H3>

      <ul>
        <li>
          <strong>কোথায় থাকে:</strong> সার্ভার মেমোরিতে (Server In-Memory)।
        </li>
        <li>
          <strong>লাইফসাইকেল:</strong> একটি একক HTTP Request সম্পন্ন হওয়া পর্যন্ত।
        </li>
        <li>
          <strong>কী কাজ করে:</strong> ধর, তোর একটি পেজের ৩টি আলাদা সার্ভার কম্পোনেন্টে একই
          API থেকে <code>fetch(&apos;/api/user&apos;)</code> মারা হয়েছে। Request
          Memoization একই রিকোয়েস্ট সাইকেলের ভেতর বারবার API হিট না মেরে প্রথম ফেচ থেকে
          ডাটা রিইউজ করে! রিকোয়েস্ট শেষ হলেই এই ক্যাশ মুছে যায়।
        </li>
      </ul>

      <CodeBlock filename="memoization.ts">{`// Server Component A
const user = await fetch('https://api.com/user'); // ⚡ Actual Fetch

// Server Component B (Same Page Render Cycle)
const user = await fetch('https://api.com/user'); // 🚀 Cached via Request Memoization!`}</CodeBlock>

      <H3>Layer 2 — Data Cache (Persistent Server Cache)</H3>

      <ul>
        <li>
          <strong>কোথায় থাকে:</strong> সার্ভার ফাইল-সিস্টেম বা ডিস্ট্রিবিউটেড মেমোরিতে।
        </li>
        <li>
          <strong>লাইফসাইকেল:</strong> ম্যানুয়ালি ইনভ্যালিডেট না করা পর্যন্ত, বা Revalidate
          Time শেষ না হওয়া পর্যন্ত স্থায়ী।
        </li>
        <li>
          <strong>কী কাজ করে:</strong> <code>fetch()</code> বা কাস্টম ডাটা ফেচের আউটপুট
          ব্যাকএন্ডে জমা রাখে, যাতে পরবর্তীতে অন্য কোনো ইউজারের রিকোয়েস্ট আসলেও অরিজিনাল
          ডাটাবেজ বা থার্ড-পার্টি API-তে হিট না মারতে হয়।
        </li>
      </ul>

      <CodeBlock filename="data-cache.ts">{`// Time-based Revalidation
fetch('https://api.com/products', { next: { revalidate: 3600 } }); // 1 Hour

// On-Demand Revalidation via Tag
fetch('https://api.com/products', { next: { tags: ['products'] } });`}</CodeBlock>

      <H3>Layer 3 — Full Route Cache (Server HTML & RSC Payload)</H3>

      <ul>
        <li>
          <strong>কোথায় থাকে:</strong> সার্ভার ফাইল সিস্টেমে।
        </li>
        <li>
          <strong>লাইফসাইকেল:</strong> বিল্ড টাইম থেকে শুরু করে ডাটা ইনভ্যালিডেশন হওয়া
          পর্যন্ত।
        </li>
        <li>
          <strong>কী কাজ করে:</strong> স্ট্যাটিকালি রেন্ডার হওয়া পুরো পেজের HTML এবং React
          Server Component (RSC) Payload আগে থেকেই সার্ভারে বানিয়ে রেখে দেয়। ফলে ইউজার হিট
          করার সাথে সাথেই রেসপন্স ডেলিভারি হয়।
        </li>
      </ul>

      <H3>Layer 4 — Router Cache (Client-Side In-Memory)</H3>

      <ul>
        <li>
          <strong>কোথায় থাকে:</strong> ইউজারের ব্রাউজার মেমোরিতে (In-Memory Session)।
        </li>
        <li>
          <strong>লাইফসাইকেল:</strong> ব্রাউজার ট্যাব রিফ্রেশ না হওয়া পর্যন্ত, বা নির্দিষ্ট
          সময় (Dynamic Routes: ~৩০ সেকেন্ড, Static Routes: ~৫ মিনিট) পর্যন্ত।
        </li>
        <li>
          <strong>কী কাজ করে:</strong> ইউজার যখন অ্যাপ্লিকেশনের ভেতরে এক পেজ থেকে অন্য পেজে
          নেভিগেট করে, তখন ব্রাউজার আগে ভিজিট করা পেজের RSC Payload মেমোরিতে জমা রাখে, যাতে
          ব্যাক-বাটন চাপলে ইনস্ট্যান্ট পেজ লোড হয়।
        </li>
      </ul>

      {/* ── Summary matrix ────────────────────────────────────────────── */}
      <H2 id="matrix">৩. এক নজরে তুলনা</H2>

      <Table
        head={[
          "ক্যাশ লেয়ার",
          "অবস্থান",
          "স্কোপ",
          "স্থায়িত্ব",
          "কীভাবে ইনভ্যালিডেট হয়",
        ]}
        rows={[
          [
            "Request Memoization",
            "Server",
            "Single Request",
            "Instant (Request End)",
            "অটোমেটিক — রিকোয়েস্ট শেষে ধ্বংস হয়",
          ],
          [
            "Data Cache",
            "Server",
            "Across Requests & Users",
            "Persistent",
            <>
              <code>revalidatePath()</code>, <code>revalidateTag()</code>
            </>,
          ],
          [
            "Full Route Cache",
            "Server",
            "Across Users",
            "Persistent",
            "Data Cache রিভ্যালিডেট হলে অটোমেটিক",
          ],
          [
            "Router Cache",
            "Browser",
            "Single User Session",
            "Temporary (30s – 5m)",
            <>
              <code>router.refresh()</code>, Server Action call
            </>,
          ],
        ]}
      />

      <Line name="ভুলু ভাই">
        (চোখ বড় বড় করে) ওহ! এবার মাথার জট ছেড়েছে নেক্সট-ভাই! আমি ভাবতাম শুধু একটাই ক্যাশ
        আছে, কিন্তু আসলে ৪টা লেয়ার পরপর কাজ করে। সার্ভার অ্যাকশনে{" "}
        <code>revalidateTag()</code> মারলে তা Data Cache ও Full Route Cache সাফ করে দেয়। আর
        ক্লায়েন্টে ইনস্ট্যান্ট পেজ চেঞ্জ হওয়ার জন্য Router Cache দায়িত্ব পালন করে!
      </Line>

      <Line name="নেক্সট-ভাই">
        একদম পারফেক্ট! এই ৪টি ক্যাশ লেয়ারের মেকানিক্স জানা থাকলে পারফর্মেন্স টিউনিং এবং ক্যাশ
        বাগ দূর করা তোর জন্য পানির মতো সহজ হয়ে যাবে!
      </Line>

      {/* ── Takeaways ─────────────────────────────────────────────────── */}
      <H2 id="takeaway">Production Takeaways</H2>

      <Note>
        <ul>
          <li>
            <strong>Opt-out Capabilities:</strong> নির্দিষ্ট কোনো ডাটা ক্যাশ না করতে চাইলে{" "}
            <code>fetch(url, {"{ cache: 'no-store' }"})</code> বা পেজ লেভেলে{" "}
            <code>export const dynamic = &apos;force-dynamic&apos;</code> ব্যবহার করতে হয়।
          </li>
          <li>
            <strong>Layer Synchronization:</strong> Data Cache ইনভ্যালিডেট হলে Next.js
            স্বয়ংক্রিয়ভাবে সংশ্লিষ্ট Full Route Cache-কেও আপডেট বা সাফ করে দেয়।
          </li>
          <li>
            <strong>Client Freshness:</strong> Server Action সম্পন্ন হওয়ার পর Next.js
            অটোমেটিক ক্লায়েন্টের Router Cache ক্লিয়ার করে ফ্রেশ ডাটা স্ক্রিনে রেন্ডার করে।
          </li>
        </ul>
      </Note>
    </article>
  );
}
