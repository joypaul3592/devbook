import { CodeBlock, Diagram, H2, Line, Note } from "@/components/learn/DocParts";
import type { Bi } from "@/lib/curriculum";

/** Section anchors — consumed by the "on this page" rail. */
export const headings: { id: string; label: Bi }[] = [
  {
    id: "the-problem",
    label: {
      bn: "লিংকে পুরনো, F5-এ নতুন",
      en: "Stale on link, fresh on F5",
    },
  },
  {
    id: "router-cache",
    label: { bn: "Router Cache আসলে কী", en: "What the Router Cache is" },
  },
  {
    id: "server-action",
    label: { bn: "১. Server Action দিয়ে ইনভ্যালিডেশন", en: "1. Invalidation via Server Actions" },
  },
  {
    id: "router-refresh",
    label: { bn: "২. router.refresh()", en: "2. router.refresh()" },
  },
  {
    id: "prefetch",
    label: { bn: "৩. Prefetch কন্ট্রোল", en: "3. Prefetch control" },
  },
  {
    id: "stale-times",
    label: { bn: "৪. staleTimes কাস্টমাইজেশন", en: "4. Customizing staleTimes" },
  },
  {
    id: "takeaway",
    label: { bn: "Production Takeaways", en: "Production takeaways" },
  },
];

export default function RouterCacheStaleness() {
  return (
    <article className="doc-prose">
      {/* ── The problem ───────────────────────────────────────────────── */}
      <H2 id="the-problem" anchorOnly>
        লিংকে পুরনো, F5-এ নতুন
      </H2>

      <p>
        রাত বাড়ছে। অফিসে এসি চলছে, চারপাশ শান্ত। ভুলু ভাই ল্যাপটপের ব্রাউজারে সাইট চেক
        করছেন, কিন্তু চেহারায় বিরক্তির ছাপ স্পষ্ট!
      </p>

      <Line name="ভুলু ভাই">
        নেক্সট-ভাই! এই ক্লায়েন্ট-সাইড Router Cache আমাকে পাগল বানিয়ে ছাড়বে! আমি সার্ভার
        সাইডে সার্জিক্যাল <code>revalidateTag(&apos;user-profile&apos;)</code> মেরে
        রেখেছি, ব্যাকএন্ড ডাটাবেজেও ইউজারের নাম চেঞ্জ করে ফেললাম। কিন্তু ব্রাউজারে লিংক
        ক্লিক করে (<code>&lt;Link href=&quot;/profile&quot;&gt;</code>) প্রোফাইল পেজে
        গেলেই পুরনো নাম ভেসে উঠছে! আবার ম্যানুয়ালি ব্রাউজারের রিফ্রেশ বাটন (F5) চাপলে
        টাটকা নাম চলে আসছে! ইউজারের ব্রাউজার মেমরি ব্যাকএন্ডের ডাটা ফ্রেশ হতে দিচ্ছে না
        কেন ভাই?!
      </Line>

      <Line name="নেক্সট-ভাই">
        (হেসে কফিতে শেষ চুমুক দিয়ে) হা হা! ভুলু, তুই তো এবার আঘাত করেছিস Next.js অ্যাপ
        রাউটারের সবচেয়ে ক্লাসিক ক্লায়েন্ট-সাইড বটলনেক —{" "}
        <strong>&quot;In-Memory Router Cache Stale-ness&quot;</strong>-এ!
      </Line>

      {/* ── Router cache ──────────────────────────────────────────────── */}
      <H2 id="router-cache">১. Router Cache আসলে কী</H2>

      <Line name="ভুলু ভাই">
        (হতাশ হয়ে) ক্লায়েন্ট রাউটার ক্যাশ আবার কী জ্বালা ভাই? সার্ভারে ক্যাশিং বুঝলাম,
        ব্রাউজার আবার নিজের মেমরিতে কী ধরে রেখে দিচ্ছে?
      </Line>

      <Line name="নেক্সট-ভাই">
        শোন! SPA-এর মতো স্মুথ নেভিগেশন দেওয়ার জন্য Next.js ব্রাউজারের মেমরিতে একটা ছোট
        ক্যাশ লেয়ার চালায়, যার নাম <strong>Router Cache</strong>। তুই যখন{" "}
        <code>&lt;Link&gt;</code> ট্যাগ দিয়ে এক পেজ থেকে অন্য পেজে যাস, Next.js আগে
        থেকেই ওই পেজের RSC Payload ব্রাউজারের মেমরিতে সেভ করে নেয়।
      </Line>

      <ul>
        <li>
          <strong>Static Routes:</strong> বাই-ডিফল্ট ব্রাউজার মেমরিতে ৫ মিনিট পর্যন্ত
          ক্যাশ থাকে।
        </li>
        <li>
          <strong>Dynamic Routes:</strong> বাই-ডিফল্ট ব্রাউজার মেমরিতে ৩০ সেকেন্ড পর্যন্ত
          ক্যাশ থাকে।
        </li>
      </ul>

      <Line name="নেক্সট-ভাই">
        তুই অ্যাপের ভেতরে নেভিগেট করছিস, আর Next.js ব্রাউজার মেমরি থেকে পুরনো RSC Payload
        টেনে এনে ইনস্ট্যান্ট ইউআই দেখাচ্ছে! সে সার্ভারে হিট-ই মারছে না, তাই তোর সার্ভারের{" "}
        <code>revalidateTag()</code> টের পাওয়ার সুযোগই পাচ্ছে না!
      </Line>

      <Diagram>{`[User Clicks <Link>] ──► Checks Client Router Cache (In-Memory)
                              │
                              ├─(Hit within 30s/5m)─► ⚡ Serves Stale Navigation UI (No Server Hit!)
                              │
                              └─(Miss / Invalidated)─► 🌐 Hits Server for Fresh RSC Payload`}</Diagram>

      <Line name="ভুলু ভাই">
        (কপালে হাত দিয়ে) ওরে বাপ্পরে! তারমানে সার্ভারে যত বড় ইভেন্ট বা ডাটা চেঞ্জই ঘটুক
        না কেন, ব্রাউজার মেমরিতে প্রি-ক্যাশড RSC Payload বসে থাকলে ইউজার পুরনো ডাটায়
        আটকে থাকবে?!
      </Line>

      <Line name="নেক্সট-ভাই">
        একদম তাই! কিন্তু প্রোডাকশনে এই ক্লায়েন্ট-সাইড স্টেলনেস ভাঙার ৪টা দারুণ টেকনিক
        রয়েছে।
      </Line>

      {/* ── Server action ─────────────────────────────────────────────── */}
      <H2 id="server-action">২. Server Action দিয়ে ইনভ্যালিডেশন</H2>

      <Line name="নেক্সট-ভাই">
        যদি কোনো ডাটা মিউটেশন (ফর্ম সাবমিট বা প্রোফাইল আপডেট) Server Action-এর মাধ্যমে
        ঘটে, তবে সেই Server Action-এর ভেতর থেকে ডাকা <code>revalidateTag()</code> বা{" "}
        <code>revalidatePath()</code> অটোমেটিক্যালি ক্লায়েন্ট-সাইডের Router Cache ফ্লাশ
        করে দেয়!
      </Line>

      <CodeBlock filename="app/actions.ts">{`'use server'

import { revalidateTag } from 'next/cache';

export async function updateProfile(formData: FormData) {
  await db.user.update(/* ... */);

  // ⚡ Flushes Server Data Cache AND clears Client Router Cache simultaneously!
  revalidateTag('user-profile');
}`}</CodeBlock>

      {/* ── router.refresh ────────────────────────────────────────────── */}
      <H2 id="router-refresh">৩. router.refresh()</H2>

      <Line name="ভুলু ভাই">
        কিন্তু নেক্সট-ভাই! যদি ডাটা মিউটেশন কোনো থার্ড-পার্টি ওয়েবহুক বা WebSocket দিয়ে
        ক্লায়েন্টে আসে, বা ক্লায়েন্ট সাইড ইভেন্ট থেকে হয়, তখন ব্রাউজার ক্যাশ ক্লিয়ার করব
        কীভাবে?
      </Line>

      <Line name="নেক্সট-ভাই">
        সেটার জন্য React কম্পোনেন্টে ডাকবি <code>router.refresh()</code>!
      </Line>

      <CodeBlock filename="app/components/ProfileForm.tsx">{`'use client'

import { useRouter } from 'next/navigation';

export function ProfileForm() {
  const router = useRouter();

  const handleUpdate = async () => {
    await updateViaApi();

    // ⚡ Forcefully purges Router Cache & fetches fresh RSC Payload from server
    router.refresh();
  };

  return <button onClick={handleUpdate}>Update</button>;
}`}</CodeBlock>

      {/* ── Prefetch ──────────────────────────────────────────────────── */}
      <H2 id="prefetch">৪. Prefetch কন্ট্রোল</H2>

      <Line name="ভুলু ভাই">
        নেক্সট-ভাই! <code>&lt;Link href=&quot;/dashboard&quot;&gt;</code> ট্যাগ কি মাউস
        নিয়ে গেলেই সাইড ইফেক্ট হিসেবে আগে থেকে সার্ভার ডাটা ক্যাশ করে ফেলে?
      </Line>

      <Line name="নেক্সট-ভাই">
        হ্যাঁ! Next.js বাই-ডিফল্ট ভিউপোর্টে থাকা সব লিংকের ডাটা prefetch করে ব্রাউজার
        ক্যাশে ভরে রাখে। যদি কোনো ক্রিটিক্যাল পেজে তুই প্রি-ফেচিং বন্ধ করতে চাস, তবে লিখে
        দিবি:
      </Line>

      <CodeBlock filename="app/components/Nav.tsx">{`// ⚡ Prefetching explicitly disabled to avoid stale data pre-caching
<Link href="/dashboard" prefetch={false}>
  Dashboard
</Link>`}</CodeBlock>

      {/* ── staleTimes ────────────────────────────────────────────────── */}
      <H2 id="stale-times">৫. staleTimes কাস্টমাইজেশন</H2>

      <Line name="ভুলু ভাই">
        ভাই, গ্লোবালি কি এই ৩০ সেকেন্ড বা ৫ মিনিটের ব্রাউজার রাউটার ক্যাশ কাস্টমাইজ বা
        কমিয়ে দেওয়া যায় না?
      </Line>

      <Line name="নেক্সট-ভাই">
        অবশ্যই যায়! <code>next.config.js</code>-এ তুই চাইলে ডায়নামিক বা স্ট্যাটিক রাউটের
        জন্য <code>staleTimes</code> টিউন করতে পারিস:
      </Line>

      <CodeBlock filename="next.config.js">{`module.exports = {
  experimental: {
    staleTimes: {
      dynamic: 0, // ⚡ Dynamic routes will never sit in the client Router Cache!
      static: 180,
    },
  },
};`}</CodeBlock>

      <Note>
        <p>
          <code>dynamic: 0</code> দিলে স্টেলনেস মরে, কিন্তু প্রতিটা নেভিগেশন সার্ভারে হিট
          করে — অর্থাৎ SPA-স্পিডটাও অনেকখানি মরে। গ্লোবালি শূন্য করার আগে দেখ, শুধু
          মিউটেশনের পর <code>router.refresh()</code> ডাকলেই কাজটা হয়ে যায় কিনা।
        </p>
      </Note>

      <Line name="ভুলু ভাই">
        (ল্যাপটপের কোডে <code>router.refresh()</code> আর Server Action বসাতে বসাতে) আহা!
        এবার বুঝতে পারলাম কেন রিফ্রেশ দিলে ডাটা চেঞ্জ হয় আর লিংকে ক্লিক করলে পুরনো থাকে!
        সার্ভার ক্যাশ ক্লিয়ার করার সাথে সাথে ক্লায়েন্ট রাউটার ক্যাশ ফ্লাশ করতে Server
        Action অথবা <code>router.refresh()</code> ব্যবহার করাই হলো আসল সমাধান!
      </Line>

      <Line name="নেক্সট-ভাই">
        সাবাশ! ব্রাউজার মেমরি বনাম সার্ভার ডাটার এই মেলবন্ধন জানা থাকলে ইউজার নেভিগেশন হবে
        রকেটের মতো ফাস্ট, কিন্তু ডাটা থাকবে শতভাগ টাটকা!
      </Line>

      {/* ── Takeaway ──────────────────────────────────────────────────── */}
      <H2 id="takeaway">💡 Production Engineering Takeaways</H2>

      <ul>
        <li>
          <strong>Router Cache Scope:</strong> ব্রাউজারের ইন-মেমরি রাউটার ক্যাশ ক্লায়েন্ট
          নেভিগেশন ফাস্ট করে, কিন্তু স্টেল ডাটা ধরে রাখার ঝুঁকি বাড়ায়।
        </li>
        <li>
          <strong>Server Action Invalidation:</strong> Server Action-এর ভেতর থেকে{" "}
          <code>revalidateTag()</code> বা <code>revalidatePath()</code> রান করলে তা
          সার্ভারের পাশাপাশি ক্লায়েন্ট রাউটার ক্যাশও অটো ক্লিয়ার করে।
        </li>
        <li>
          <strong>Manual Refresh:</strong> ক্লায়েন্ট-সাইড স্টেট বা ডায়নামিক আপডেটের পর{" "}
          <code>router.refresh()</code> কল করলে রাউটার ক্যাশ পার্জ হয়ে ফ্রেশ RSC Payload
          সার্ভার থেকে আসে।
        </li>
      </ul>
    </article>
  );
}
