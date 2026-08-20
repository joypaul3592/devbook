import { CodeBlock, Diagram, H2, Line, Note } from "@/components/learn/DocParts";
import type { Bi } from "@/lib/curriculum";

/** Section anchors — consumed by the "on this page" rail. */
export const headings: { id: string; label: Bi }[] = [
  {
    id: "the-flicker",
    label: { bn: "রিফ্রেশে ডাটার লুকোচুরি", en: "Data flickering on refresh" },
  },
  {
    id: "race-condition",
    label: { bn: "রেস কন্ডিশনটা কোথায়", en: "Where the race condition is" },
  },
  {
    id: "separation",
    label: { bn: "১. স্ট্র্যাটেজি আলাদা রাখা", en: "1. Separate the strategies" },
  },
  {
    id: "surgical-tagging",
    label: { bn: "২. সার্জিক্যাল ট্যাগিং", en: "2. Surgical tagging" },
  },
  {
    id: "router-sync",
    label: { bn: "৩. ক্লায়েন্ট সিঙ্ক্রোনাইজেশন", en: "3. Client synchronization" },
  },
  {
    id: "takeaway",
    label: { bn: "Production Takeaways", en: "Production takeaways" },
  },
];

export default function RevalidationRaceConditions() {
  return (
    <article className="doc-prose">
      {/* ── The flicker ───────────────────────────────────────────────── */}
      <H2 id="the-flicker" anchorOnly>
        রিফ্রেশে ডাটার লুকোচুরি
      </H2>

      <p>
        পরদিন অফিসে এসে ভুলু ভাই ল্যাপটপের মনিটরে চুল ছিঁড়ছেন! স্ক্রিনে ই-কমার্সের একটা
        প্রোডাক্ট পেজ খোলা, যার স্টক কাউন্ট একেকবার একেকটা দেখাচ্ছে!
      </p>

      <Line name="ভুলু ভাই">
        নেক্সট-ভাই! এই ক্যাশ রিভ্যালিডেশন নিয়ে আমি তো মহাবিপদে পড়েছি! আমি ড্যাশবোর্ড থেকে
        প্রোডাক্টের স্টক কমালাম, ব্যাকএন্ডে{" "}
        <code>revalidateTag(&apos;products&apos;)</code> বা{" "}
        <code>revalidatePath()</code> ডেকে ক্যাশ ফ্ল্যাশ করে দিলাম। সাথে সাথে পেজ রিফ্রেশ
        করে দেখি স্টক আপডেট হয়ে গেছে! কিন্তু ঠিক ২ সেকেন্ড পর আরেকবার রিফ্রেশ দিতেই আগের
        পুরনো ক্যাশড স্টক ফিরে আসলো! আবার রিফ্রেশ দিলে নতুনটা দেখাচ্ছে! ক্যাশড ডাটা আর
        নিউ ডাটা নিয়ে ব্রাউজারে লুকোচুরি খেলা শুরু হয়ে গেছে কেন ভাই?!
      </Line>

      <Line name="নেক্সট-ভাই">
        (হেসে কফিতে চুমুক দিয়ে) হা হা! ভুলু, তুই তো ফ্রন্টএন্ড ইঞ্জিনিয়ারিংয়ের সবচেয়ে
        ডেঞ্জারাস বটলনেক — <strong>&quot;Revalidation Race Condition&quot;</strong>-এর
        মধ্যে পড়েছিস!
      </Line>

      {/* ── Race condition ────────────────────────────────────────────── */}
      <H2 id="race-condition">১. রেস কন্ডিশনটা কোথায়</H2>

      <Line name="ভুলু ভাই">
        (থতমতো খেয়ে) রেস কন্ডিশন?! মানে ক্যাশ ক্লিয়ার হওয়ার দৌড়ে কে আগে জিতবে সেটার
        মারামারি?!
      </Line>

      <Line name="নেক্সট-ভাই">
        একদম তাই! শোন, তুই নিশ্চয়ই তোর ওই প্রোডাক্ট পেজের ফেচে বা ক্যাশ অপশনে একই সাথে
        Time-based Revalidation (যেমন: <code>next: {`{ revalidate: 60 }`}</code> বা{" "}
        <code>cacheLife(&apos;hours&apos;)</code>) আর On-demand Revalidation (
        <code>revalidateTag()</code>) — দুটোই একসাথে মিশিয়ে রেখেছিস?
      </Line>

      <Line name="ভুলু ভাই">
        হ্যাঁ! আমি ভাবছিলাম — টাইম-বেসড দিলে প্রতি ৬০ সেকেন্ড পর পর ব্যাকগ্রাউন্ডে অটো
        ডাটা রিফ্রেশ হবে, আর অ্যাডমিন প্যানেল থেকে কোনো চেঞ্জ হলে অন-ডিমান্ড{" "}
        <code>revalidateTag()</code> দিয়ে ম্যানুয়ালি ইনস্ট্যান্ট ফ্ল্যাশ মেরে দেব! দুটোই
        থাকলো, ডাবল সেফটি!
      </Line>

      <Line name="নেক্সট-ভাই">
        ডাবল সেফটি করতে গিয়েই তো তুই ভূত ডেকে এনেছিস! Next.js আর CDN ব্যাকগ্রাউন্ডে
        Stale-While-Revalidate (SWR) মডেল ফলো করে। তুই যখন অন-ডিমান্ডে{" "}
        <code>revalidateTag()</code> মারিস, সার্ভারের পুরনো stale cache পার্জ হয়ে যায়।
        কিন্তু ঠিক সেই মুহূর্তেই যদি ব্যাকগ্রাউন্ডে টাইম-বেসড রিভ্যালিডেশনের ৬০ সেকেন্ডের
        টাইমার ট্রিগার হয় — সার্ভার ব্যাকগ্রাউন্ডে নতুন রেন্ডার শেষ করার আগেই পুরনো বা
        আংশিক প্রসেস হওয়া রেসপন্স আবার ক্যাশে পুশ করে দিতে পারে! একেই বলে{" "}
        <strong>Race Condition Between On-Demand &amp; Stale Background Workers</strong>!
      </Line>

      <Diagram>{`[Admin Update Event] ──► Triggers revalidateTag('products') ──► Cache Purged! ⚡
                                      │
            ┌─────────────────────────┴─────────────────────────┐
            ▼                                                   ▼
[User Request 1]                                     [Time-based Timer Fires]
Receives Fresh Data from DB!                        Background Worker renders Stale Data!
            │                                                   │
            └─────────────────────────┬─────────────────────────┘
                                      ▼
                      🚨 Stale Cache Overwrites Fresh Data!`}</Diagram>

      <Line name="ভুলু ভাই">
        (চোখ কপালে তুলে) ওরে বাবা! তারমানে ব্যাকগ্রাউন্ডের টাইম-বেসড ওয়ার্কার আমার
        অন-ডিমান্ডে ক্লিয়ার করা টাটকা ডাটার ওপর পুরনো ক্যাশ এনে বসিয়ে দিচ্ছে?!
      </Line>

      <Line name="নেক্সট-ভাই">
        একদম বিঙ্গো! এই রেস কন্ডিশন এড়াতে হাই-ট্রাফিক প্রোডাকশন অ্যাপ্লিকেশনে ৩টা
        গোল্ডেন রুল মেনে চলতে হয়।
      </Line>

      {/* ── Separation ────────────────────────────────────────────────── */}
      <H2 id="separation">২. স্ট্র্যাটেজি আলাদা রাখা</H2>

      <Line name="নেক্সট-ভাই">
        একই ডাটা সোর্সের ওপর কখনো টাইম-বেসড আর অন-ডিমান্ড রিভ্যালিডেশন একসাথে মেলাবি না!
      </Line>

      <ul>
        <li>
          <strong>Time-based (revalidate: 3600) কখন:</strong> যে ডাটাগুলো ঘনঘন বদলায় না
          এবং কোনো অ্যাডমিন অ্যাকশন বা ইউজার মিউটেশনের ওপর নির্ভর করে না — ব্লগ পোস্ট,
          নিউজ আর্টিকেল, ওয়েদার ডাটা।
        </li>
        <li>
          <strong>On-demand (revalidateTag) কখন:</strong> যে ডাটাগুলো ইউজার বা
          অ্যাডমিনের অ্যাকশনে সরাসরি চেঞ্জ হয় — ই-কমার্স স্টক, ইউজার প্রোফাইল, শপিং
          কার্ট, প্রাইস লিস্ট।
        </li>
      </ul>

      {/* ── Surgical tagging ──────────────────────────────────────────── */}
      <H2 id="surgical-tagging">৩. সার্জিক্যাল ট্যাগিং</H2>

      <Line name="ভুলু ভাই">
        ভাই, অন-ডিমান্ড রিভ্যালিডেশন করার সময় পুরো পেজ প্যাথ{" "}
        <code>revalidatePath(&apos;/products&apos;)</code> ক্লিয়ার করা ভালো, নাকি
        নির্দিষ্ট ট্যাগ <code>revalidateTag(&apos;product-123&apos;)</code> ক্লিয়ার করা
        ভালো?
      </Line>

      <Line name="নেক্সট-ভাই">
        সবসময় নির্দিষ্ট ট্যাগ! তুই যদি পুরো পেজ প্যাথ ক্লিয়ার মারিস, তবে ওই পেজের ওপর
        থাকা অন্যান্য ভারী অসম্পর্কিত কম্পোনেন্টের ক্যাশও উধাও হয়ে যাবে, ফলে সার্ভারে
        অপ্রয়োজনীয় লোড পড়ার ঝুঁকি থাকে।
      </Line>

      <CodeBlock filename="app/actions/product-actions.ts">{`// ❌ Broad Path Invalidation (Heavy Overhead)
revalidatePath('/products');

// ✅ Surgical Tag Invalidation (Atomic & Race-Condition Safe)
import { revalidateTag } from 'next/cache';

export async function updateProductStock(productId: string, newStock: number) {
  'use server'
  await db.product.update({ where: { id: productId }, data: { stock: newStock } });

  // ⚡ Purges ONLY the specific product's cached payload
  revalidateTag(\`product-\${productId}\`);
}`}</CodeBlock>

      <Note>
        <p>
          ট্যাগ ডিজাইনের পুরো আর্কিটেকচার — primary, relational আর global ট্যাগ কীভাবে
          স্তরে স্তরে সাজাতে হয় — পরের টপিকে।
        </p>
      </Note>

      {/* ── Router sync ───────────────────────────────────────────────── */}
      <H2 id="router-sync">৪. ক্লায়েন্ট সিঙ্ক্রোনাইজেশন</H2>

      <Line name="ভুলু ভাই">
        নেক্সট-ভাই, আমি সার্ভারের ক্যাশ <code>revalidateTag()</code> দিয়ে তো ক্লিয়ার
        করলাম, কিন্তু ইউজারের ব্রাউজার যদি তার ইন-মেমরি Router Cache থেকে আগের পেজ টেনে
        নিয়ে বসে থাকে?
      </Line>

      <Line name="নেক্সট-ভাই">
        তখন সার্ভার অ্যাকশন বা ক্যাশ রিভ্যালিডেট করার সাথে সাথেই ক্লায়েন্ট সাইডে{" "}
        <code>router.refresh()</code> কল করবি! এটা ব্রাউজারের ইন-মেমরি রাউটার ক্যাশ
        ক্লিয়ার করে সার্ভার থেকে ফ্রেশ RSC Payload টেনে আনবে।
      </Line>

      <Line name="ভুলু ভাই">
        (ল্যাপটপের কোড থেকে টাইম-বেসড রিভ্যালিডেশন তুলে দিতে দিতে) আহা! এবার বুঝতে
        পেরেছি ভাই! আমি সব জায়গায় টাইম-বেসড আর অন-ডিমান্ড খিচুড়ি বানিয়ে রেখেছিলাম! এখন
        থেকে যে ডাটা মিউটেশন হয়, সেখানে শুধু সার্জিক্যাল <code>revalidateTag</code>{" "}
        ব্যবহার করব!
      </Line>

      <Line name="নেক্সট-ভাই">
        সাবাশ! এই রিভ্যালিডেশন স্ট্র্যাটেজি নিখুঁত রাখতে পারলে কোনো রেস কন্ডিশন বা স্টেল
        ডাটা বাগ তোর সাইট ছুঁতেও পারবে না!
      </Line>

      {/* ── Takeaway ──────────────────────────────────────────────────── */}
      <H2 id="takeaway">💡 Production Engineering Takeaways</H2>

      <ul>
        <li>
          <strong>Avoid Hybrid Revalidation:</strong> একই ক্যাশড এপিআই বা ডাটার ওপর
          একসাথে টাইম-বেসড আর অন-ডিমান্ড স্ট্র্যাটেজি প্রয়োগ করলে CDN ও সার্ভার লেয়ারে
          রেস কন্ডিশন তৈরি হয়।
        </li>
        <li>
          <strong>Surgical Invalidation:</strong> <code>revalidatePath()</code>-এর চেয়ে
          granular <code>revalidateTag()</code> ব্যবহার করা বেশি নিরাপদ ও লাইটওয়েট —
          এটা শুধু নির্দিষ্ট অবজেক্টের ক্যাশ পার্জ করে।
        </li>
        <li>
          <strong>Client Synchronization:</strong> সার্ভারে অন-ডিমান্ড ক্যাশ পার্জের
          পাশাপাশি ক্লায়েন্টে <code>router.refresh()</code> নিশ্চিত করলে ব্রাউজার রাউটার
          ক্যাশের সাথে সার্ভার সিঙ্ক থাকে।
        </li>
      </ul>
    </article>
  );
}
