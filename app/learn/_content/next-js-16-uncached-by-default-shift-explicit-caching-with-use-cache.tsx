import { CodeBlock, Diagram, H2, Line, Note } from "@/components/learn/DocParts";
import type { Bi } from "@/lib/curriculum";

/** Section anchors — consumed by the "on this page" rail. */
export const headings: { id: string; label: Bi }[] = [
  {
    id: "the-shock",
    label: { bn: "ক্যাশ কি উঠে গেল?", en: "Did caching just disappear?" },
  },
  {
    id: "why-uncached",
    label: {
      bn: "কেন Uncached-by-Default",
      en: "Why uncached-by-default",
    },
  },
  {
    id: "use-cache",
    label: { bn: "'use cache' ডিরেক্টিভ", en: "The 'use cache' directive" },
  },
  {
    id: "cachelife-cachetag",
    label: { bn: "cacheLife() ও cacheTag()", en: "cacheLife() and cacheTag()" },
  },
  {
    id: "takeaway",
    label: { bn: "Production Takeaways", en: "Production takeaways" },
  },
];

export default function UncachedByDefault() {
  return (
    <article className="doc-prose">
      {/* ── The shock ─────────────────────────────────────────────────── */}
      <H2 id="the-shock" anchorOnly>
        ক্যাশ কি উঠে গেল?
      </H2>

      <p>
        দুপুর বেলা। ভুলু ভাই ল্যাপটপের টার্মিনালে একটা ব্যাকএন্ড এপিআইয়ের লগ মনিটর
        করছেন। হঠাৎ তিনি সিট থেকে লাফিয়ে উঠলেন!
      </p>

      <Line name="ভুলু ভাই">
        নেক্সট-ভাই! Next.js 16-এ তো তুলকালাম কান্ড ঘটে গেছে! আমি একটা সাধারণ ফেচ কল
        বসিয়েছি: <code>fetch(&apos;https://api.example.com/products&apos;)</code>! আগে
        Next.js-এ এটা লিখলেই সে স্বয়ংক্রিয়ভাবে রেসপন্স ক্যাশ করে রেখে দিত। আর এখন আমি
        পেজে যতবার রিফ্রেশ মারছি, প্রতিবার আমার ব্যাকএন্ড এপিআই-তে ধুপধাপ রিকোয়েস্ট হিট
        করছে! আমার ডাটাবেজ তো ডাটা ফেচিংয়ের মাশুল দিতে দিতে ক্র্যাশ করবে! ক্যাশিং
        অপটিমাইজেশন কি Next.js 16 থেকে উঠিয়ে দেওয়া হয়েছে নাকি ভাই?!
      </Line>

      <Line name="নেক্সট-ভাই">
        (হেসে কফির মগে চুমুক দিয়ে) হা হা! ভুলু, অপটিমাইজেশন উঠে যায়নি, বরং ফ্রন্টএন্ড
        ইঞ্জিনিয়ারদের ক্যাশিং ট্র্যাপ থেকে বাঁচাতে Next.js 16-এ আনা হয়েছে সবচেয়ে বড়
        আর্কিটেকচারাল রিভলিউশন — <strong>&quot;Uncached-by-Default&quot;</strong>!
      </Line>

      {/* ── Why uncached ──────────────────────────────────────────────── */}
      <H2 id="why-uncached">১. কেন বাই-ডিফল্ট আনক্যাশড</H2>

      <Line name="ভুলু ভাই">
        (অবাক হয়ে) বাই-ডিফল্ট আনক্যাশড রাখাটা ক্যাশিং ট্র্যাপ থেকে বাঁচানো হলো কীভাবে
        ভাই?! আগে তো অটোমেটিক ক্যাশ হয়ে অ্যাপ ফাস্ট থাকতো!
      </Line>

      <Line name="নেক্সট-ভাই">
        ফাস্ট থাকতো, কিন্তু মারাত্মক সিকিউরিটি আর ডাটা স্টেলনেস বাগ তৈরি হতো! আগে
        ডেভেলপাররা না জেনে <code>fetch()</code> লিখতো, আর Next.js ওটাকে পার্মানেন্টলি
        ক্যাশ করে রাখতো। ফলে ই-কমার্সে স্টকের সংখ্যা বা ড্যাশবোর্ডে প্রাইভেট ইউজারের
        ইনফো পুরনো হয়ে ঝুলতো, বা ভুলবশত ক্যাশ হয়ে অন্য ইউজার দেখে ফেলতো!
      </Line>

      <Line name="নেক্সট-ভাই">
        তাই Next.js 16-এ সিদ্ধান্ত নেওয়া হয়েছে:{" "}
        <strong>
          &quot;অদেখা কোনো ক্যাশিং হবে না! তুই যদি ক্যাশ করতে চাস, তোকে নিজের মুখে
          এক্সপ্লিসিটলি বলে দিতে হবে!&quot;
        </strong>{" "}
        এখন থেকে Next.js 16-এ সকল <code>fetch()</code> রিকোয়েস্ট বাই-ডিফল্ট Dynamic
        (Uncached)।
      </Line>

      <Diagram>{`[Next.js 14/15 Architecture]
fetch(url)  ───► Automatically Cached by Default (Implicit Caching ⚠️ Stale Risk)

[Next.js 16 Architecture]
fetch(url)  ───► Uncached Dynamic Request by Default (Safe & Fresh ⚡)
                     │
                     ▼ (Opt-in Explicit Caching Needed)
'use cache' ───► Explicit Opt-in Caching Layer`}</Diagram>

      {/* ── use cache ─────────────────────────────────────────────────── */}
      <H2 id="use-cache">২. &apos;use cache&apos; ডিরেক্টিভ</H2>

      <Line name="ভুলু ভাই">
        (কপালে হাত দিয়ে) ওরে বাপ্পরে! তারমানে এখন ক্যাশ করতে হলে আমাকে নতুন কী জাদুটোনা
        করতে হবে?
      </Line>

      <Line name="নেক্সট-ভাই">
        এখন তোকে ব্যবহার করতে হবে নতুন <code>&apos;use cache&apos;</code> ডিরেক্টিভ!
        এটা React আর Next.js 16-এর নতুন <strong>Dynamic I/O</strong> আর্কিটেকচারের অংশ।
        তুই শুধু কোনো ফাংশন, কম্পোনেন্ট বা ফাইলের একদম টপে লিখে দিবি{" "}
        <code>&apos;use cache&apos;</code>, ব্যস! Next.js বুঝে নেবে এই অংশটুকু ক্যাশ করা
        নিরাপদ।
      </Line>

      <CodeBlock filename="lib/data-access/products.ts">{`// ✅ Next.js 16 Explicit Function-Level Caching
async function getProducts() {
  'use cache'; // ⚡ Explicit Opt-In Caching Trigger!

  const res = await fetch('https://api.example.com/products');
  return res.json();
}`}</CodeBlock>

      <Line name="ভুলু ভাই">
        (চোখ বড় বড় করে) আরে জোস তো! আগে তো শুধু ফেচ লেভেলে ক্যাশ কন্ট্রোল করা যেত, এখন
        তারমানে আমি একটা সাধারণ ডাটাবেজ কোয়েরি (
        <code>prisma.product.findMany()</code>) বা ভারী ক্যালকুলেশন ফাংশনের ওপরেও{" "}
        <code>&apos;use cache&apos;</code> বসিয়ে ক্যাশ করে ফেলতে পারব?!
      </Line>

      <Line name="নেক্সট-ভাই">
        একদম বিঙ্গো! এটাই <code>&apos;use cache&apos;</code>-এর সবচেয়ে বড় পাওয়ার! এটা
        শুধু HTTP <code>fetch()</code>-এ সীমাবদ্ধ নয়; এটা যে কোনো Async Function বা
        Server Component-এর আউটপুট ক্যাশ করতে পারে।
      </Line>

      {/* ── cacheLife & cacheTag ──────────────────────────────────────── */}
      <H2 id="cachelife-cachetag">৩. cacheLife() ও cacheTag()</H2>

      <Line name="ভুলু ভাই">
        কিন্তু নেক্সট-ভাই, ক্যাশড ডাটাটা কতক্ষণ তাজা থাকবে, বা কখন ইনভ্যালিডেট হবে — সেটা
        বলব কীভাবে?
      </Line>

      <Line name="নেক্সট-ভাই">
        সেটার জন্য Next.js 16 তোকে দিয়েছে দুটো শক্তিশালী হেলপার ফাংশন:{" "}
        <code>cacheLife()</code> আর <code>cacheTag()</code>!
      </Line>

      <CodeBlock filename="lib/data-access/categories.ts">{`import { cacheLife, cacheTag } from 'next/cache';

async function getCategoryProducts(category: string) {
  'use cache';

  // ১. ক্যাশ লাইফটাইম বা স্টেলনেস টাইম সেট করা
  cacheLife('hours'); // Options: 'seconds', 'minutes', 'hours', 'days', 'weeks'

  // ২. অন-ডিমান্ড ইনভ্যালিডেশনের জন্য সার্জিক্যাল ট্যাগ লাগানো
  cacheTag('products', \`category-\${category}\`);

  const data = await db.product.findMany({ where: { category } });
  return data;
}`}</CodeBlock>

      <Line name="ভুলু ভাই">(ল্যাপটপের স্ক্রিনে কোড দেখতে দেখতে) ওরে বাপ্পরে!</Line>

      <ul>
        <li>
          <code>&apos;use cache&apos;</code>: কন্টেন্ট বা ডাটা ক্যাশ করার নির্দেশ দেয়।
        </li>
        <li>
          <code>cacheLife(&apos;hours&apos;)</code>: কতক্ষণ পর রিভ্যালিডেট হবে তা বলে
          দেয়।
        </li>
        <li>
          <code>cacheTag(...)</code>: অন-ডিমান্ডে Server Action বা এপিআই থেকে{" "}
          <code>revalidateTag(&apos;products&apos;)</code> মারলে মুহূর্তের মধ্যে ওই
          নির্দিষ্ট ক্যাশ ফ্লাশ করে দেয়!
        </li>
      </ul>

      <Line name="নেক্সট-ভাই">
        পারফেক্ট! আর সবচেয়ে মজার বিষয় হলো, Next.js 16-এর Dynamic I/O ইঞ্জিন ব্যাকগ্রাউন্ডে
        ট্র্যাক করে দেখে এই <code>&apos;use cache&apos;</code> ফাংশনের ভেতরে তুই কোনো
        কুকি (<code>cookies()</code>) বা হেডার (<code>headers()</code>) রিড করছিস কিনা।
        যদি রিড করিস, তবে সে তোকে ওয়ার্নিং দেবে — যাতে পার-ইউজার ক্যাশ সিকিউর থাকে!
      </Line>

      <Note>
        <p>
          এই ওয়ার্নিংটাই আসলে Next.js 16-এর মূল দর্শন: রিকোয়েস্ট-নির্ভর ডাটা আর ক্যাশড
          ডাটা এক বাক্সে ঢোকানো যাবে না। কেন সেটা ভয়ংকর, তার পুরোটা টপিক ১০-এ (Cache
          Poisoning)।
        </p>
      </Note>

      <Line name="ভুলু ভাই">
        (ল্যাপটপে কোড চেঞ্জ করতে করতে) থ্যাংকস নেক্সট-ভাই! আমি এতদিন ধরে ভাবছিলাম
        Next.js 16-এ আমার ফেচ ক্যাশ হচ্ছে না কেন! এখন বুঝেছি, হিডেন ক্যাশিং বাদ দিয়ে
        এক্সপ্লিসিটলি <code>&apos;use cache&apos;</code>, <code>cacheLife()</code>, আর{" "}
        <code>cacheTag()</code> ব্যবহার করাই হলো Next.js 16-এর আসল প্রোডাকশন স্ট্যান্ডার্ড!
      </Line>

      {/* ── Takeaway ──────────────────────────────────────────────────── */}
      <H2 id="takeaway">💡 Production Engineering Takeaways</H2>

      <ul>
        <li>
          <strong>Uncached-by-Default:</strong> Next.js 16-এ বাই-ডিফল্ট সব ফেচ রিকোয়েস্ট
          অন-ডিমান্ড ডায়নামিক। কোনো ইমপ্লিসিট বা অটোমেটিক ক্যাশিং থাকে না।
        </li>
        <li>
          <strong>&apos;use cache&apos; Directive:</strong> ডাটাবেজ কোয়েরি, থার্ড-পার্টি
          সার্ভিস বা ফেচ রিকোয়েস্ট ক্যাশ করতে ফাংশন বা কম্পোনেন্ট স্কোপে এক্সপ্লিসিটলি{" "}
          <code>&apos;use cache&apos;</code> ব্যবহার করতে হয়।
        </li>
        <li>
          <strong>Granular Controls (cacheLife &amp; cacheTag):</strong> TTL বা ক্যাশ
          লাইফটাইম কন্ট্রোলের জন্য <code>cacheLife()</code> এবং অন-ডিমান্ড ক্যাশ ওয়াইপের
          জন্য <code>cacheTag()</code> ব্যবহার করা প্রোডাকশন আর্কিটেকচারের প্রধান শর্ত।
        </li>
      </ul>
    </article>
  );
}
