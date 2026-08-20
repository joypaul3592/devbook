import { CodeBlock, Diagram, H2, Line, Note } from "@/components/learn/DocParts";
import type { Bi } from "@/lib/curriculum";

/** Section anchors — consumed by the "on this page" rail. */
export const headings: { id: string; label: Bi }[] = [
  {
    id: "the-confusion",
    label: { bn: "ডিরেক্টিভটা আসলে কী করে", en: "What the directive actually does" },
  },
  {
    id: "boundary-rules",
    label: { bn: "দুই বাউন্ডারি রুল", en: "The two boundary rules" },
  },
  {
    id: "closure-trap",
    label: { bn: "Closure ট্র্যাপ", en: "The closure trap" },
  },
  {
    id: "best-practice",
    label: { bn: "প্রোডাকশন প্যাটার্ন", en: "The production pattern" },
  },
  {
    id: "takeaway",
    label: { bn: "Production Takeaways", en: "Production takeaways" },
  },
];

export default function UseServerBoundary() {
  return (
    <article className="doc-prose">
      {/* ── The confusion ─────────────────────────────────────────────── */}
      <H2 id="the-confusion" anchorOnly>
        ডিরেক্টিভটা আসলে কী করে
      </H2>

      <p>
        পরদিন সকাল। ভুলু ভাই অফিসে এসেই ল্যাপটপে কোড করতে বসেছেন। হঠাৎ চিৎকার দিয়ে উঠে
        নেক্সট-ভাইয়ের দিকে ছুটলেন!
      </p>

      <Line name="ভুলু ভাই">
        নেক্সট-ভাই! বাঁচান! আমার মাথা একদম ঘুরছে! আমি একটা সার্ভার কম্পোনেন্টের ভেতরে
        একটা হেলপার ফাংশনে <code>&quot;use server&quot;</code> লিখে ফর্মের{" "}
        <code>action</code>-এ দিয়েছিলাম। ভেবেছিলাম এটা তো সার্ভারেই রেন্ডার হচ্ছে, তাই
        ফাংশনের বাইরের স্কোপ থেকে ডাটাবেজ ইনস্ট্যান্স বা আইডি এমনিতেই পেয়ে যাবে! কিন্তু
        রানটাইমে গিয়ে দেদারসে <code>TypeError: Cannot read properties of undefined</code>{" "}
        আর আজব সব ক্লোজার বিহেভিয়ার দেখাচ্ছে! আবার ক্লায়েন্ট কম্পোনেন্টের ফাইলে ক্লায়েন্ট
        ফাংশনের ভেতর <code>&quot;use server&quot;</code> লিখতে গিয়ে তো বিল্ডই ফেল মারলো!
        এই ডিরেক্টিভটা আসলে কোথায় বসবে আর এর বাউন্ডারিটা কীভাবে কাজ করে ভাই?!
      </Line>

      <Line name="নেক্সট-ভাই">
        (হেসে চেয়ার টেনে বসে) হা হা! ভুলু, শান্ত হ! তুই তো Next.js ডেভেলপারদের সবচেয়ে কমন
        প্রথম কনফিউশনে পা দিয়েছিস — <strong>&quot;use server&quot; Boundaries &amp;
        Closure Trap</strong>!
      </Line>

      <Line name="নেক্সট-ভাই">
        অধিকাংশ ডেভেলপার মনে করে <code>&quot;use server&quot;</code> মানে হলো &quot;এই
        কোডটা শুধু সার্ভারে এক্সিকিউট করো&quot;। এটা ভুল!{" "}
        <code>&quot;use server&quot;</code> কোনো ফাইলকে সার্ভার-ওনলি বানায় না — এটা একটা{" "}
        <strong>পাবলিক HTTP API এন্ডপয়েন্ট</strong> তৈরি করে!
      </Line>

      <Line name="ভুলু ভাই">(চোখ বড় বড় করে) পাবলিক এপিআই এন্ডপয়েন্ট মানে ভাই?!</Line>

      <Line name="নেক্সট-ভাই">
        শোন! তুই যখন কোনো ফাংশন বা ফাইলের শুরুতে <code>&quot;use server&quot;</code>{" "}
        লিখিস, Next.js ব্যাকগ্রাউন্ডে সেই ফাংশনের জন্য একটা হিডেন HTTP POST এন্ডপয়েন্ট
        তৈরি করে নেয়! তুই যখন ক্লায়েন্ট থেকে সেই ফাংশনকে ডাকিস, ব্রাউজার মূলত ব্যাকগ্রাউন্ডে
        সেই হিডেন এন্ডপয়েন্টে একটা POST রিকোয়েস্ট পাঠায়!
      </Line>

      <Diagram>{`[Client Component / Form] ──(Calls Server Action)──► HTTP POST /_next/action-id
                                                               │
                                                               ▼
                                                  [Executes Server Action Function]`}</Diagram>

      {/* ── Boundary rules ────────────────────────────────────────────── */}
      <H2 id="boundary-rules">১. দুই বাউন্ডারি রুল</H2>

      <Line name="নেক্সট-ভাই">আগে এর ২টা গোল্ডেন বাউন্ডারি রুল জেনে নে:</Line>

      <ul>
        <li>
          <strong>Top-of-File:</strong> ফাইলের একদম টপে <code>&quot;use server&quot;</code>{" "}
          লিখলে ওই ফাইলের এক্সপোর্ট করা সবকটা async ফাংশন Server Action হিসেবে
          রেজিস্টার্ড হবে। এই ফাইলটা তুই Server Component বা Client Component — যেকোনো
          জায়গায় ইমপোর্ট করে নির্দ্বিধায় ব্যবহার করতে পারবি!
        </li>
        <li>
          <strong>Inside-Function:</strong> ইনলাইন async ফাংশনের ভেতরে{" "}
          <code>&quot;use server&quot;</code> লেখা যায় শুধুমাত্র Server Component-এর
          ভেতরে! Client Component-এর ভেতরের কোনো ইনলাইন ফাংশনে লিখলে বিল্ড এরর খাবি!
        </li>
      </ul>

      <CodeBlock filename="app/components/MyClientForm.tsx">{`// ❌ BAD: Writing inline "use server" inside a Client Component
'use client'

export function MyClientForm() {
  async function handleSubmit() {
    'use server' // 🚨 BUILD ERROR! Not allowed inside Client Components!
  }
  return <form action={handleSubmit}>...</form>
}

// ✅ GOOD: Importing from a dedicated actions file
// app/actions.ts
'use server' // ⚡ File-level directive: all exported functions are Server Actions

export async function updateName(formData: FormData) {
  // DB logic
}`}</CodeBlock>

      {/* ── Closure trap ──────────────────────────────────────────────── */}
      <H2 id="closure-trap">২. Closure ট্র্যাপ</H2>

      <Line name="ভুলু ভাই">
        (কপালে হাত দিয়ে) বুঝেছি ভাই! কিন্তু আমি যে সার্ভার কম্পোনেন্টের ভেতরের ইনলাইন
        সার্ভার অ্যাকশনে বাইরের স্কোপ থেকে ভ্যারিয়েবল পাচ্ছিলাম না বা আজব বিহেভিয়ার করছিল —
        সেই Closure Trap-টা কেন হয়েছিল?
      </Line>

      <Line name="নেক্সট-ভাই">
        সেইটাই তো আসল ট্র্যাপ! তুই যখন কোনো Server Component-এর ভেতরের ইনলাইন ফাংশনে{" "}
        <code>&quot;use server&quot;</code> লিখিস, আর সেই ফাংশন যদি তার বাইরের প্যারেন্ট
        স্কোপের কোনো ভ্যারিয়েবল (যেমন <code>productId</code>) ব্যবহার করে, তখন Next.js
        সেই ভ্যারিয়েবলটাকে অটোমেটিক্যালি এনক্রিপ্ট করে সিরিয়ালাইজ করে ব্রাউজারে ক্লায়েন্ট
        সাইডে পাঠায়! এরপর ফর্ম সাবমিট হলে ক্লায়েন্ট সেই স্কোপ ভ্যারিয়েবল আবার সার্ভারে
        ফেরত পাঠায়!
      </Line>

      <CodeBlock filename="app/products/[id]/page.tsx">{`// 🚨 THE CLOSURE TRAP!
export default async function ProductPage({ params }: { params: { id: string } }) {
  const secretKey = "SERVER_SECRET_DO_NOT_LEAK"; // 🚨 Hidden scope variable!

  async function updateProduct(formData: FormData) {
    'use server'
    // 💥 Next.js serializes parent-scope variables (params.id, secretKey)
    // and embeds them into the hidden client form action payload!
    await db.product.update({ id: params.id, secretKey });
  }

  return <form action={updateProduct}>...</form>;
}`}</CodeBlock>

      <Line name="ভুলু ভাই">
        (ধাক্কা খেয়ে) তারমানে Next.js ব্যাকগ্রাউন্ডে ওই ইনলাইন ফাংশনের বাইন্ডিং ধরে রাখার
        জন্য বাইরের লেক্সিক্যাল স্কোপের ডাটা সিরিয়ালাইজ করে ব্রাউজারে হিডেন পেলোডে পাঠিয়ে
        দেয়?! এতে তো পেলোড সাইজ বেড়ে ভারী হতে পারে, এমনকি ক্লায়েন্টে সেনসিটিভ ডাটা লিক
        হওয়ার ঝুঁকিও তৈরি হয়!
      </Line>

      <Line name="নেক্সট-ভাই">
        একদম পারফেক্ট ধরেছিস! একেই বলে{" "}
        <strong>Server Action Closure Serialization Trap</strong>!
      </Line>

      <Note>
        <p>
          Next.js ক্লোজার ভ্যালুগুলো এনক্রিপ্ট করে পাঠায় বলে ব্রাউজারে খালি চোখে ওগুলো পড়া
          যায় না — কিন্তু ওগুলো তবু ক্লায়েন্টের কাছে যায়, পেলোডে জায়গা নেয়, এবং সার্ভারে
          ফেরত আসে। &quot;এনক্রিপ্টেড&quot; মানে &quot;পাঠানোই হয়নি&quot; নয়।
        </p>
      </Note>

      {/* ── Best practice ─────────────────────────────────────────────── */}
      <H2 id="best-practice">৩. প্রোডাকশন প্যাটার্ন</H2>

      <Line name="নেক্সট-ভাই">
        প্রোডাকশন লেভেলে কখনো Server Component-এর ভেতরে ইনলাইন{" "}
        <code>&quot;use server&quot;</code> ক্লোজার ফাংশন লিখবি না! সবসময় অ্যাকশনগুলোকে
        আলাদা <code>actions.ts</code> ফাইলে আইসোলেট করবি, আর প্রয়োজনীয় আইডি বা ভ্যারিয়েবল
        এক্সপ্লিসিট আর্গুমেন্ট হিসেবে বা <code>.bind()</code> করে পাস করবি:
      </Line>

      <CodeBlock filename="app/actions.ts">{`// 1. Separate dedicated actions file
'use server'

import { db } from '@/lib/db';

export async function updateProduct(productId: string, formData: FormData) {
  // ⚡ Explicit arguments! No hidden closure leakage.
  await db.product.update({
    where: { id: productId },
    data: { name: formData.get('name') as string }
  });
}`}</CodeBlock>

      <CodeBlock filename="app/products/[id]/page.tsx">{`// 2. Usage from a Server or Client Component
import { updateProduct } from '@/app/actions';

export default async function ProductPage({ params }: { params: { id: string } }) {
  // Bind the productId explicitly!
  const updateProductWithId = updateProduct.bind(null, params.id);

  return (
    <form action={updateProductWithId}>
      <input type="text" name="name" />
      <button type="submit">Update</button>
    </form>
  );
}`}</CodeBlock>

      <Line name="ভুলু ভাই">(স্বস্তির হাসি দিয়ে) আহা! এবার ক্রিস্টাল ক্লিয়ার!</Line>

      <ul>
        <li>
          <code>&quot;use server&quot;</code> মানে শুধু &quot;সার্ভার কোড&quot; না — এটা
          ব্যাকগ্রাউন্ডে একটা পাবলিক HTTP POST এন্ডপয়েন্ট তৈরি করে।
        </li>
        <li>
          আলাদা dedicated <code>actions.ts</code> ফাইল বানিয়ে ফাইল-লেভেল ডিরেক্টিভ ব্যবহার
          করা সবচেয়ে সেফ।
        </li>
        <li>
          ইনলাইন ফাংশনে স্কোপ লেভেলে সেনসিটিভ ডাটা থাকলে তা ক্লায়েন্ট পেলোডে সিরিয়ালাইজড
          হয়ে হিডেন লিকের ঝুঁকি বাড়ায় — <code>.bind()</code> দিয়ে এক্সপ্লিসিট আর্গুমেন্ট
          হিসেবে পাঠানো উচিত!
        </li>
      </ul>

      <Line name="নেক্সট-ভাই">
        সাবাশ! এই বাউন্ডারি কনসেপ্ট ক্লিয়ার থাকলে তোর Server Action হবে একশো ভাগ সিকিউর
        এবং লাইটওয়েট!
      </Line>

      {/* ── Takeaway ──────────────────────────────────────────────────── */}
      <H2 id="takeaway">💡 Production Engineering Takeaways</H2>

      <ul>
        <li>
          <strong>Public Endpoint Mental Model:</strong>{" "}
          <code>&quot;use server&quot;</code> দিয়ে চিহ্নিত প্রতিটা এক্সপোর্টেড ফাংশন
          ব্রাউজারের এক্সিকিউশনের জন্য একটা পাবলিকলি অ্যাক্সেসিবল HTTP POST এপিআই হিসেবে
          কাজ করে।
        </li>
        <li>
          <strong>Avoid Inline Closure Traps:</strong> সার্ভার কম্পোনেন্টের ভেতরে ইনলাইন
          অ্যাকশন লিখলে লেক্সিক্যাল স্কোপের ভ্যারিয়েবল অটো-সিরিয়ালাইজ হয়ে ক্লায়েন্টে চলে
          যায়, যা পারফরম্যান্স আর সিকিউরিটি — দুটোর জন্যই ঝুঁকিপূর্ণ।
        </li>
        <li>
          <strong>Dedicated Action File Standard:</strong> সবসময় আলাদা{" "}
          <code>actions.ts</code> ফাইলে ডিরেক্টিভ লিখে কাস্টম আর্গুমেন্ট পাসিং বা{" "}
          <code>.bind()</code> প্যাটার্ন ব্যবহার করাই স্ট্যান্ডার্ড আর্কিটেকচার।
        </li>
      </ul>
    </article>
  );
}
