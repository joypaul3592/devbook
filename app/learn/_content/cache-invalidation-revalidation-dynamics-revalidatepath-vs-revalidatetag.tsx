import { CodeBlock, Diagram, H2, Line, Note } from "@/components/learn/DocParts";
import type { Bi } from "@/lib/curriculum";

/** Section anchors — consumed by the "on this page" rail. */
export const headings: { id: string; label: Bi }[] = [
  {
    id: "the-stale-screen",
    label: { bn: "ডিলিট হলো, স্ক্রিনে রয়ে গেল", en: "Deleted, but still on screen" },
  },
  {
    id: "revalidate-path",
    label: { bn: "১. revalidatePath", en: "1. revalidatePath" },
  },
  {
    id: "revalidate-tag",
    label: { bn: "২. revalidateTag", en: "2. revalidateTag" },
  },
  {
    id: "comparison",
    label: { bn: "৩. তুলনা ম্যাট্রিক্স", en: "3. Comparison matrix" },
  },
  {
    id: "takeaway",
    label: { bn: "Production Takeaways", en: "Production takeaways" },
  },
];

export default function RevalidationDynamics() {
  return (
    <article className="doc-prose">
      {/* ── Stale screen ──────────────────────────────────────────────── */}
      <H2 id="the-stale-screen" anchorOnly>
        ডিলিট হলো, স্ক্রিনে রয়ে গেল
      </H2>

      <p>
        রাত ৯টা। ভুলু ভাই হঠাৎ ল্যাপটপের ডিসপ্লেতে হাত দিয়ে ঘষতে লাগলেন! তিনি ড্যাশবোর্ডে
        &quot;Delete Product&quot; বাটনে ক্লিক করেছেন। সার্ভার অ্যাকশনে ডাটাবেজ থেকে ডাটা
        ডিলিটও হয়ে গেছে, কিন্তু স্ক্রিনে প্রোডাক্টটা এখনো জ্বলজ্বল করছে! ব্রাউজার রিফ্রেশ
        দিলে তবেই সেটা গায়েব হচ্ছে!
      </p>

      <Line name="ভুলু ভাই">
        (হতাশ হয়ে) নেক্সট-ভাই! ডাটাবেজে ডাটা আপডেট বা ডিলিট হচ্ছে ঠিকই, কিন্তু স্ক্রিনে
        পুরনো ক্যাশড ডাটা আটকে বসে থাকে কেন?! আমি অ্যাকশনের ভেতরে ডাটা মিউটেশন করার পর
        ইউজারকে ফ্রেশ আপডেট ডাটা দেখাব কীভাবে?
      </Line>

      <Line name="নেক্সট-ভাই">
        (মুচকি হেসে) ভুলু, কারণ তুই ডাটা মিউটেশন করেছিস, কিন্তু Next.js-এর Data Cache আর
        Full Route Cache-কে বলিসনি যে — &quot;হ্যালো ক্যাশ ইঞ্জিন, ডাটা চেঞ্জ হয়ে গেছে!
        জমে থাকা পুরনো ক্যাশ ফেলে দিয়ে নতুন ডাটা ফেচ করো!&quot; আর ক্যাশ সাফ করে সাথে
        সাথে নতুন ডাটা ইউআই-তে ইনজেক্ট করার ২টা প্রধান অস্ত্র রয়েছে:{" "}
        <code>revalidatePath</code> আর <code>revalidateTag</code>!
      </Line>

      {/* ── revalidatePath ────────────────────────────────────────────── */}
      <H2 id="revalidate-path">১. revalidatePath — টার্গেটেড রাউট ইনভ্যালিডেশন</H2>

      <Line name="নেক্সট-ভাই">
        <code>revalidatePath</code> হলো কোনো নির্দিষ্ট URL বা রাউট পাথের ক্যাশ এক ধাক্কায়
        ইনভ্যালিডেট করার উপায়! তুই যখন{" "}
        <code>revalidatePath(&apos;/dashboard/products&apos;)</code> ডাকবি, তখন Next.js ওই
        রাউটের ক্যাশড HTML আর ডাটা ফেচ ক্যাশ সঙ্গে সঙ্গে মুছে দেয়। ফলে পরবর্তী রিকোয়েস্টে
        পেজটা নতুন ডাটা দিয়ে রি-ক্রিয়েট হয়!
      </Line>

      <CodeBlock filename="app/actions.ts">{`'use server'

import { revalidatePath } from 'next/cache';

export async function deleteProduct(productId: string) {
  await db.product.delete({ where: { id: productId } });

  // ⚡ 1. Specific path revalidation
  revalidatePath('/dashboard/products');

  // ⚡ 2. Page-type revalidation (every dynamic product page: /products/1, /products/2 …)
  revalidatePath('/products/[id]', 'page');

  // ⚡ 3. Layout-type revalidation (the whole dashboard subtree)
  revalidatePath('/dashboard', 'layout');
}`}</CodeBlock>

      <ul>
        <li>
          <code>revalidatePath(&apos;/products&apos;)</code> — শুধু ওই একক পাথের ক্যাশ
          ক্লিয়ার করবে।
        </li>
        <li>
          <code>revalidatePath(&apos;/products/[id]&apos;, &apos;page&apos;)</code> —
          ডায়নামিক রাউট স্লাগের সবকটা পেজের ক্যাশ ইনভ্যালিডেট করবে।
        </li>
        <li>
          <code>revalidatePath(&apos;/dashboard&apos;, &apos;layout&apos;)</code> — ওই
          লেআউট আর তার নিচের সব চাইল্ড পেজের ক্যাশ একসাথে সাফ করবে!
        </li>
      </ul>

      {/* ── revalidateTag ─────────────────────────────────────────────── */}
      <H2 id="revalidate-tag">২. revalidateTag — ডিকাপল্ড অন-ডিমান্ড ইনভ্যালিডেশন</H2>

      <Line name="ভুলু ভাই">
        কিন্তু নেক্সট-ভাই! ধরুন আমার ওয়েবসাইটে একটা &quot;Trending Products&quot; উইজেট
        আছে। এটা হোমপেজ (<code>/</code>), প্রোডাক্ট পেজ (<code>/products</code>), আবার
        ক্যাটাগরি পেজ (<code>/categories/electronics</code>) — সব জায়গায় দেখা যায়! এখন
        একটা প্রোডাক্ট আপডেট হলে কি আমি বসে বসে ১০টা রাউট পাথে{" "}
        <code>revalidatePath</code> কল করব?! পাথের নাম বদলে গেলে তো কোড ভেঙে যাবে!
      </Line>

      <Line name="নেক্সট-ভাই">
        একদম বিঙ্গো! এইখানেই আসে এন্টারপ্রাইজ গ্রেড প্যাটার্ন — <code>revalidateTag</code>!
        তুই যখন ডাটা ফেচ করবি, তখন পেজ পাথের ওপর নির্ভর না করে ডাটাটার গায়ে একটা tag
        লাগিয়ে দিবি! আর সার্ভার অ্যাকশনের ভেতরে শুধু সেই ট্যাগটাকে রিভ্যালিডেট করবি — তখন
        ওই ট্যাগ দিয়ে যেখানে যেখানে ডাটা ফেচ করা হয়েছিল, পুরো অ্যাপের সব জায়গার ক্যাশ
        একসাথে ইনভ্যালিডেট হয়ে যাবে!
      </Line>

      <CodeBlock filename="lib/data.ts">{`// 1. Data fetching with a cache tag
export async function getTrendingProducts() {
  const res = await fetch('https://api.com/products/trending', {
    next: { tags: ['trending-products'] }, // ⚡ Tag attached!
  });
  return res.json();
}`}</CodeBlock>

      <CodeBlock filename="app/actions.ts">{`// 2. Server Action
'use server'

import { revalidateTag } from 'next/cache';

export async function updateTrendingProduct(id: string, data: any) {
  await db.product.update({ where: { id }, data });

  // ⚡ Revalidates EVERY page/component fetching with the 'trending-products' tag!
  revalidateTag('trending-products');
}`}</CodeBlock>

      {/* ── Comparison ────────────────────────────────────────────────── */}
      <H2 id="comparison">৩. তুলনা ম্যাট্রিক্স</H2>

      <Diagram>{`                  revalidatePath                  revalidateTag
────────────────  ──────────────────────────────  ──────────────────────────────
Scope             URL path / layout sub-tree      Data cache entry (route-free)
Coupling          Tightly coupled to URL shape    Decoupled — lives with the data
Use case          Page-specific submit / delete   Global data: cart, wishlist, trending
Cost              Revalidates whole page tree     Only the tagged fetch entries`}</Diagram>

      <Line name="ভুলু ভাই">
        (ল্যাপটপের কোডে <code>revalidateTag(&apos;products&apos;)</code> বসিয়ে রান করে
        উল্লাস করে) অসাম নেক্সট-ভাই! ডিলিট বাটন চাপার সাথে সাথে ডাটাবেজ আপডেট হলো আর{" "}
        <code>revalidateTag</code> কল হতেই স্ক্রিনের ক্যাশড লিস্ট থেকে প্রোডাক্ট গায়েব হয়ে
        ফ্রেশ ডাটা চলে আসলো! কোনো ম্যানুয়াল পেজ রিলোড মারতেই হলো না!
      </Line>

      <Note>
        <p>
          Server Action-এর ভেতর থেকে ডাকলে দুটোই ক্লায়েন্টের Router Cache-ও ফ্লাশ করে —
          এজন্যই রিলোড ছাড়া ইউআই আপডেট হলো। কিন্তু ওয়েবহুক বা রুট হ্যান্ডলার থেকে ডাকলে
          সার্ভারের ক্যাশ পরিষ্কার হয় ঠিকই, খোলা থাকা ট্যাবের Router Cache পরিষ্কার হয় না।
        </p>
      </Note>

      <Line name="নেক্সট-ভাই">
        একদম বিঙ্গো! Next.js-এর ডাটা ফেচিং আর সার্ভার অ্যাকশন স্টেট সিঙ্কিংয়ের আসল
        চাবিকাঠিই হলো এই ক্যাশ রিভ্যালিডেশন ডায়নামিক্স!
      </Line>

      {/* ── Takeaway ──────────────────────────────────────────────────── */}
      <H2 id="takeaway">💡 Production Engineering Takeaways</H2>

      <ul>
        <li>
          <strong>Purge, then re-fetch:</strong> <code>revalidatePath</code> আর{" "}
          <code>revalidateTag</code> পুরনো এন্ট্রি বাতিল করে দেয়, ফলে পরের রিকোয়েস্টে
          ফ্রেশ ডাটা ফেচ হয়।
        </li>
        <li>
          <strong>Decoupled Architecture:</strong> বড় অ্যাপ্লিকেশনে পাথের নাম পরিবর্তনের
          ঝুঁকি এড়াতে সবসময় <code>revalidateTag</code> ব্যবহার করা বেস্ট প্র্যাকটিস।
        </li>
        <li>
          <strong>Action Consistency:</strong> ডাটাবেজে mutation (create/update/delete)
          সফল হওয়ার ঠিক পরেই ক্যাশ ইনভ্যালিডেশন ফাংশন জোড়া দেওয়া আবশ্যক।
        </li>
      </ul>
    </article>
  );
}
