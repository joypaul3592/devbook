import { CodeBlock, Diagram, H2, H3, Line, Note } from "@/components/learn/DocParts";
import type { Bi } from "@/lib/curriculum";

/** Section anchors — consumed by the "on this page" rail. */
export const headings: { id: string; label: Bi }[] = [
  {
    id: "the-problem",
    label: { bn: "কনসোলে লাল কালি", en: "Red ink in the console" },
  },
  {
    id: "what-is-hydration",
    label: { bn: "হাইড্রেশন আসলে কী", en: "What hydration actually is" },
  },
  {
    id: "mismatch-causes",
    label: { bn: "মিসম্যাচ হয় কেন — ৩টা কারণ", en: "Three causes of a mismatch" },
  },
  {
    id: "solutions",
    label: { bn: "প্রোডাকশন সলিউশন", en: "The production fixes" },
  },
  {
    id: "takeaway",
    label: { bn: "Production Takeaways", en: "Production takeaways" },
  },
];

export default function HydrationMechanics() {
  return (
    <article className="doc-prose">
      {/* ── The problem ───────────────────────────────────────────────── */}
      <H2 id="the-problem" anchorOnly>
        কনসোলে লাল কালি
      </H2>

      <p>
        বিকেল বেলা। ভুলু ভাই ল্যাপটপের মনিটরের দিকে হাঁ করে তাকিয়ে আছেন। কনসোলে এক
        বিশাল লাল রঙের এরর টেক্সট!
      </p>

      <Line name="ভুলু ভাই">
        নেক্সট-ভাই! এই React আর Next.js আমার জীবনটা তেজপাতা বানিয়ে দিলো! কনসোলে লাল
        কালিতে লিখে বসে আছে:{" "}
        <em>&quot;Text content does not match server-rendered HTML&quot;</em> বা{" "}
        <em>&quot;Hydration failed because the initial UI does not match…&quot;</em>!
        আমি তো যা এইচটিএমএল সার্ভারে বানিয়েছি, ব্রাউজারেও তো সেটাই দেখাচ্ছি! পেজ
        রিফ্রেশ দিলে ২ সেকেন্ডের জন্য লাল এরর আসে, আবার গায়েব হয়ে যায়! এর রহস্য কী
        ভাই?!
      </Line>

      <Line name="নেক্সট-ভাই">
        (হেসে কফিতে চুমুক দিয়ে) হা হা! ভুলু, তুই তো ফ্রন্টএন্ড ইঞ্জিনিয়ারদের সবচেয়ে
        পরিচিত শত্রু <strong>Hydration Mismatch</strong>-এর মুখোমুখি হয়েছিস!
      </Line>

      {/* ── What is hydration ─────────────────────────────────────────── */}
      <H2 id="what-is-hydration">১. হাইড্রেশন আসলে কী?</H2>

      <Line name="ভুলু ভাই">
        এই &apos;হাইড্রেশন&apos; জিনিসটা আসলে কী ভাই? জীববিজ্ঞানের মতো শুনায় কেন?!
      </Line>

      <Line name="নেক্সট-ভাই">আইডিয়াটা কিন্তু বায়োলজির মতোই! শোন:</Line>

      <ul>
        <li>
          <strong>SSR (Server Step):</strong> সার্ভার তোকে কোনো ইন্টারঅ্যাক্টিভিটি বা
          জাভাস্ক্রিপ্ট ইভেন্ট ছাড়া একটা &apos;শুকনো&apos; বা{" "}
          <strong>ডিহাইড্রেটেড</strong> (Dehydrated) এইচটিএমএল স্কেলেটন পাঠায়। ইউজার
          চোখ দিয়ে পেজ দেখতে পায়, কিন্তু বাটনে ক্লিক করলে কিছু কাজ করে না।
        </li>
        <li>
          <strong>Hydration Step:</strong> ব্রাউজারে যখন মূল জাভাস্ক্রিপ্ট বান্ডেলটা
          ডাউনলোড হয়, React তখন ওই শুকনো এইচটিএমএল-এর ওপর রক্তের মতো জাভাস্ক্রিপ্ট
          ইভেন্ট লিসেনার (যেমন <code>onClick</code>, <code>useState</code>) স্প্রে করে
          তাকে &apos;জীবন্ত&apos; বা <strong>হাইড্রেটেড</strong> (Hydrated) করে তোলে!
        </li>
      </ul>

      <Diagram>{`[Server Pre-renders HTML] ---> Browser renders Static Markup (Dry HTML)
                                        │
                                        ▼
[Client JS Bundle Downloaded] ---> React compares Virtual DOM with Server HTML
                                        │
                          ├── IF MATCHES: Page becomes Interactive! ⚡
                          └── IF NOT: 💥 HYDRATION ERROR & Re-render Penalty!`}</Diagram>

      {/* ── Causes ────────────────────────────────────────────────────── */}
      <H2 id="mismatch-causes">২. মিসম্যাচ হয় কেন — ৩টা কারণ</H2>

      <Line name="ভুলু ভাই">
        বুঝলাম! কিন্তু সার্ভারের তৈরি করা এইচটিএমএল আর ব্রাউজারের এইচটিএমএল অমিল
        (Mismatch) হয় কীভাবে?
      </Line>

      <Line name="নেক্সট-ভাই">
        ৩টা প্রাইমারি ফ্রন্টএন্ড ভুলের কারণে এই হাইড্রেশন মিসম্যাচ হয়:
      </Line>

      <H3>ক. Dynamic Data or Time / Date Rendering</H3>

      <Line name="ভুলু ভাই">
        আমি তো ঘড়ির সময় দেখানোর জন্য <code>new Date().toLocaleTimeString()</code>{" "}
        লিখেছিলাম!
      </Line>

      <Line name="নেক্সট-ভাই">
        ধরাটা তো সেখানেই খাইছিস! সার্ভার যখন রাত ১২টা ০০ মিনিটে রেন্ডার করেছে, তখন
        এইচটিএমএল-এ সময় গেছে <code>12:00:00 AM</code>। আর ইউজারের ব্রাউজার যখন ১০
        সেকেন্ড পর সেটা হাইড্রেট করছে, তখন ক্লায়েন্টে সময়{" "}
        <code>12:00:10 AM</code>! React দেখে সার্ভারের টেক্সটের সাথে ক্লায়েন্টের টেক্সট
        মিলছে না — আর অমনি হাইড্রেশন এরর!
      </Line>

      <H3>খ. Direct Access to Browser-Only APIs</H3>

      <Line name="ভুলু ভাই">
        আমি আবার উইন্ডোর উইডথ অনুযায়ী ইউআই দেখানোর জন্য{" "}
        <code>window.innerWidth &gt; 768</code> লিখে একটা কন্ডিশন দিয়েছিলাম!
      </Line>

      <Line name="নেক্সট-ভাই">
        সার্ভারে তো <code>window</code> বা <code>localStorage</code> অবজেক্টের কোনো
        অস্তিত্বই নেই! তাই সার্ভারে রেন্ডার হয়েছে <code>undefined</code>, আর ব্রাউজারে
        এসেছে আসল উইডথ। অমিল হওয়া মাত্রই হাইড্রেশন কলাপ্স!
      </Line>

      <H3>গ. Invalid HTML Structure Nesting</H3>

      <Line name="নেক্সট-ভাই">
        তুই হয়তো ব্রাউজারের অটো-কারেক্ট সিস্টেম না বুঝে <code>&lt;p&gt;</code> ট্যাগের
        ভেতরে <code>&lt;div&gt;</code> ট্যাগ ঢুকিয়ে দিয়েছিস! সার্ভার থেকে ওটা গেলেও
        ব্রাউজার এইচটিএমএল পার্স করার সময় <code>&lt;p&gt;</code> ট্যাগ স্বয়ংক্রিয়ভাবে
        বন্ধ করে দেয়। ফলে React ক্লায়েন্ট-সাইড ট্রি মিলিয়ে দেখতে গিয়ে বিভ্রান্ত হয়ে
        যায়!
      </Line>

      {/* ── Solutions ─────────────────────────────────────────────────── */}
      <H2 id="solutions">৩. প্রোডাকশন-লেভেল সলিউশন</H2>

      <Line name="ভুলু ভাই">
        (কপালে হাত দিয়ে) ওরে বাবা! এত সূক্ষ্ম অমিল ধরে ফেলে?! কিন্তু নেক্সট-ভাই, এর
        প্রোডাকশন-লেভেল ফ্রন্টএন্ড সলিউশন কী? আমি কি শুধু সমস্যা এড়াতে{" "}
        <code>suppressHydrationWarning={"{true}"}</code> মেরে দেব?
      </Line>

      <Line name="নেক্সট-ভাই">
        খবরদার না! <code>suppressHydrationWarning</code> হলো শুধু একটা প্লাস্টার! এটা
        এরর লুকায়, কিন্তু পারফর্মেন্স ল্যাগ আর ক্লায়েন্ট-সাইড ফ্লিকারিং সমাধান করে না!
      </Line>

      <p>প্রোডাকশন-রেডি ২টা আর্কিটেকচারাল সমাধান মনে রাখবি:</p>

      <H3>সলিউশন ১: Mount-State Guard Pattern</H3>

      <p>
        তুই যদি এমন কোনো ইউআই দেখাস যা সম্পূর্ণ ব্রাউজারের ওপর নির্ভর করে (যেমন
        LocalStorage, Dynamic Time, Window Size), তবে তাকে মাউন্ট হওয়ার পর রেন্ডার
        করবি:
      </p>

      <CodeBlock filename="ClientOnlyTime.tsx">{`'use client'
import { useState, useEffect } from 'react';

export function ClientOnlyTime() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true); // ⚡ মাউন্ট হওয়ার পরই কেবল ক্লায়েন্ট স্টেট ট্রু হবে
  }, []);

  if (!mounted) {
    // 🔄 সার্ভার আর ফার্স্ট ক্লায়েন্ট রেন্ডারে সবসময় সেম স্কেলেটন দেখাবে
    return <p>Loading time...</p>;
  }

  return <p>Time: {new Date().toLocaleTimeString()}</p>;
}`}</CodeBlock>

      <Note>
        <p>
          মূল কথাটা হলো — সার্ভার আর ক্লায়েন্টের <strong>প্রথম</strong> রেন্ডার হুবহু এক
          হতে হবে। আসল সময়টা দ্বিতীয় রেন্ডারে আসছে, তখন হাইড্রেশন শেষ, তাই তুলনা করার
          কিছু নেই।
        </p>
      </Note>

      <H3>সলিউশন ২: Dynamic Import with SSR Disabled</H3>

      <p>
        যদি কোনো থার্ড-পার্টি ভারী ফ্রন্টএন্ড কম্পোনেন্ট থাকে (যেমন কোনো React চার্ট বা
        ম্যাপ লাইব্রেরি) যা সার্ভারে রেন্ডার হওয়াই উচিত না, তাকে সরাসরি{" "}
        <code>next/dynamic</code> দিয়ে লোড করবি:
      </p>

      <CodeBlock filename="Dashboard.tsx">{`import dynamic from 'next/dynamic';

// ❌ সার্ভার রেন্ডারিং একদম অফ করে শুধু ক্লায়েন্টে লোড করা
const HeavyChart = dynamic(() => import('@/components/Chart'), {
  ssr: false,
  loading: () => <p>Chart Loading...</p>
});`}</CodeBlock>

      <Line name="ভুলু ভাই">
        (ল্যাপটপের কোড ঠিক করতে করতে) আহারে! আমি এত দিন না বুঝে সব জায়গায়{" "}
        <code>window</code> অবজেক্ট ডিরেক্ট ডেকে বসে ছিলাম আর ভাবছিলাম Next.js কেন আমার
        ওপর রাগ করছে!
      </Line>

      <Line name="নেক্সট-ভাই">
        হা হা! সার্ভার আর ক্লায়েন্ট ফ্রন্টএন্ডের এই ফার্স্ট-রেন্ডার স্টেটের মিল রাখবি,
        দেখবি তোর কোনো হাইড্রেশন এরর আসবে না, আর পেজ লোড হবে মাখনের মতো স্মুথ!
      </Line>

      {/* ── Takeaway ──────────────────────────────────────────────────── */}
      <H2 id="takeaway">💡 Production Frontend Takeaways</H2>

      <ul>
        <li>
          <strong>Hydration Process:</strong> সার্ভারের ডিহাইড্রেটেড এইচটিএমএল-এর সাথে
          React-এর ক্লায়েন্ট ভার্চুয়াল DOM নিখুঁতভাবে মেলানোকেই হাইড্রেশন বলে।
        </li>
        <li>
          <strong>Avoid Suppress Warnings:</strong>{" "}
          <code>suppressHydrationWarning</code> না মেরে ফার্স্ট-রেন্ডারের ডেটা ও
          স্ট্রাকচার সার্ভার ও ক্লায়েন্টে ১০০% সমান রাখা ফ্রন্টএন্ড বেস্ট প্র্যাকটিস।
        </li>
        <li>
          <strong>Client-Only Isolation:</strong> ব্রাউজার এপিআই নির্ভর ইউআই-এর ক্ষেত্রে{" "}
          <code>mounted</code> স্টেট প্যাটার্ন বা <code>next/dynamic</code>-এর{" "}
          <code>ssr: false</code> ব্যবহার করা উচিত।
        </li>
      </ul>
    </article>
  );
}
