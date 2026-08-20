import { CodeBlock, Diagram, H2, Line, Note } from "@/components/learn/DocParts";
import type { Bi } from "@/lib/curriculum";

/** Section anchors — consumed by the "on this page" rail. */
export const headings: { id: string; label: Bi }[] = [
  {
    id: "the-problem",
    label: {
      bn: "তিন কম্পোনেন্ট, এক এপিআই",
      en: "Three components, one API",
    },
  },
  {
    id: "deduplication",
    label: { bn: "Fetch Deduplication কীভাবে কাজ করে", en: "How deduplication works" },
  },
  {
    id: "react-cache",
    label: { bn: "fetch() ছাড়া — React.cache()", en: "Beyond fetch() — React.cache()" },
  },
  {
    id: "scope",
    label: { bn: "মেমোরাইজেশনের আয়ু", en: "The lifetime of memoization" },
  },
  {
    id: "takeaway",
    label: { bn: "Production Takeaways", en: "Production takeaways" },
  },
];

export default function RequestMemoization() {
  return (
    <article className="doc-prose">
      {/* ── The problem ───────────────────────────────────────────────── */}
      <H2 id="the-problem" anchorOnly>
        তিন কম্পোনেন্ট, এক এপিআই
      </H2>

      <p>
        বিকেলের কফির বিরতি। ভুলু ভাই ল্যাপটপে তাঁর নতুন বানানো একটা নেস্টেড রেন্ডারিং পেজ
        দেখাচ্ছেন। মুখে হালকা দুশ্চিন্তা!
      </p>

      <Line name="ভুলু ভাই">
        নেক্সট-ভাই! আমি একটা ঝামেলার মুখোমুখি হয়েছি। আমার লেআউট পেজের একদম ওপরের Header
        Nav-এ কারেন্ট ইউজারের প্রোফাইল পিকচার আর নাম দেখানোর জন্য <code>getUser()</code>{" "}
        ডাটা ফেচ করছি। আবার একই পেজের Sidebar-এ ইউজারের রোল ও পারমিশন চেক করার জন্য আবার{" "}
        <code>getUser()</code> কল করছি। এমনকি নিচে মূল Profile Form কম্পোনেন্টেও সেই একই{" "}
        <code>getUser()</code> এপিআই ফেচ করতে হচ্ছে!
      </Line>

      <Line name="ভুলু ভাই">
        তিনটা আলাদা কম্পোনেন্ট থেকে একই এপিআই ফেচ করছি বলে কি আমার ব্যাকএন্ড এপিআই-তে
        একসাথে ৩টা ডুপ্লিকেট এইচটিটিপি রিকোয়েস্ট স্প্যাম হবে?! এটা তো নেটওয়ার্কের বারোটা
        বাজিয়ে দেবে!
      </Line>

      <Line name="নেক্সট-ভাই">
        (কফিতে চুমুক দিয়ে মুচকি হেসে) একদমই না ভুলু! এখানেই Next.js আর React Server
        Component-এর (RSC) চমৎকার আর্কিটেকচার কাজ করে, যার নাম{" "}
        <strong>Request Memoization</strong> বা <strong>Fetch Deduplication</strong>!
      </Line>

      {/* ── Deduplication ─────────────────────────────────────────────── */}
      <H2 id="deduplication">১. Fetch Deduplication কীভাবে কাজ করে</H2>

      <Line name="ভুলু ভাই">(অবাক হয়ে) ফেচ ডিডুপ্লিকেশন মানে কী ভাই?!</Line>

      <Line name="নেক্সট-ভাই">
        সহজ ভাষায়, একটা সিঙ্গেল সার্ভার রিকোয়েস্ট সাইকেলের মধ্যে তোর গাছের মতো ছড়ানো ১০টা
        আলাদা React কম্পোনেন্ট যদি হুবহু একই ইউআরএল আর অপশন দিয়ে <code>fetch()</code> কল
        করে — Next.js সার্ভারে প্রথমবার ফেচ করার পর বাকি ৯টা রিকোয়েস্টকে মেমরি থেকেই
        রিটার্ন করে দেবে! বাইরের নেটওয়ার্কে বা ব্যাকএন্ড এপিআই-তে রিকোয়েস্ট হিট হবে ঠিক ১
        বার!
      </Line>

      <Diagram>{`[Server Navigation Request Starts]
             │
   ┌─────────┼─────────┐
   ▼         ▼         ▼
[Header]  [Sidebar]  [ProfileForm]
   │         │         │
   │  fetch('/api/user')
   └─────────┬─────────┘
             ▼
┌─────────────────────────────────┐
│ React Request Memoization Cache │
├─────────────────────────────────┤
│  1st Call: Executed & Saved ⚡   │
│  2nd Call: Deduplicated (Memory)│
│  3rd Call: Deduplicated (Memory)│
└─────────────────────────────────┘
             │
             ▼ (Only 1 Actual HTTP Request sent to Backend! 🌐)`}</Diagram>

      <Line name="ভুলু ভাই">
        (চোখ বড় বড় করে) বলিস কী ভাই! তারমানে আমাকে প্যারেন্ট কম্পোনেন্ট থেকে প্রপস
        ড্রিলিং (Prop Drilling) করে চাইল্ড কম্পোনেন্টে ডাটা পাঠাতে হবে না?!
      </Line>

      <Line name="নেক্সট-ভাই">
        প্রপস ড্রিলিং করার কোনো দরকারই নেই! এটাই React Server Component-এর বিউটি। তুই যে
        কম্পোনেন্টে ডাটা দরকার, ঠিক সেই কম্পোনেন্টেই স্বাধীনভাবে <code>fetch()</code>{" "}
        ডাকবি। Next.js ইন-মেমরিতে রিকোয়েস্ট মেমোরাইজ করে নেবে।
      </Line>

      {/* ── React.cache ───────────────────────────────────────────────── */}
      <H2 id="react-cache">২. fetch() ছাড়া — React.cache()</H2>

      <Line name="ভুলু ভাই">
        (একটু চিন্তা করে) দাঁড়াও নেক্সট-ভাই! একটা মারাত্মক খটকা আছে! আমি যদি{" "}
        <code>fetch()</code> না লিখে সরাসরি ORM বা ডাটাবেজ কোয়েরি (
        <code>prisma.user.findUnique()</code>) করি? অথবা কোনো থার্ড-পার্টি SDK (যেমন:{" "}
        <code>stripe.customers.retrieve()</code>) ব্যবহার করি? ওগুলোকেও কি Next.js
        অটোমেটিক মেমোরাইজ বা ডিডুপ্লিকেট করবে?
      </Line>

      <Line name="নেক্সট-ভাই">
        অসাধারণ প্রশ্ন ভুলু! এখানেই ৯০% ফ্রন্টএন্ড ইঞ্জিনিয়ার ধরা খায়! Next.js
        শুধুমাত্র নেটিভ <code>fetch()</code> ফাংশনকেই অটোমেটিক মেমোরাইজ বা ডিডুপ্লিকেট
        করতে পারে। কিন্তু তুই যদি <code>prisma</code>, <code>drizzle</code>,{" "}
        <code>axios</code>, বা কোনো কাস্টম ডাটাবেজ হেলপার বা SDK ব্যবহার করিস — Next.js
        সেগুলোকে মেমোরাইজ করতে পারে না! তখন কিন্তু সত্যি সত্যি ৩টা আলাদা ডাটাবেজ কোয়েরি
        হিট করবে!
      </Line>

      <Line name="ভুলু ভাই">
        (চিন্তিত হয়ে) ওরে বাপ্পরে! তাহলে ডাটাবেজ কোয়েরি বা কাস্টম ফাংশনগুলোকে
        ডিডুপ্লিকেট করার উপায় কী?
      </Line>

      <Line name="নেক্সট-ভাই">
        সেটার জন্য React তোকে দিয়েছে <code>React.cache()</code> র‍্যাপার ফাংশন!
      </Line>

      <CodeBlock filename="lib/data-access/user.ts">{`import { cache } from 'react';
import db from '@/lib/db';

// ✅ Custom Database Query Deduplication using React.cache
export const getUser = cache(async (userId: string) => {
  console.log('Fetching user from DB...'); // ⚡ Runs ONCE per request render!
  const user = await db.user.findUnique({ where: { id: userId } });
  return user;
});`}</CodeBlock>

      <Line name="ভুলু ভাই">
        (ল্যাপটপের স্ক্রিনে চোখ রেখে) আচ্ছা! তারমানে আমি যদি{" "}
        <code>getUser(&apos;123&apos;)</code>-কে <code>React.cache()</code> দিয়ে
        মুড়িয়ে দিই, তবে একটা রিকোয়েস্টের ভেতর একাধিক কম্পোনেন্ট থেকে ওটা ডাকলেও ডাটাবেজে
        কোয়েরি যাবে মাত্র ১ বার?!
      </Line>

      <Line name="নেক্সট-ভাই">একদম বিঙ্গো!</Line>

      <Note>
        <p>
          আর্গুমেন্টই এখানে ক্যাশ-কি। <code>getUser(&apos;123&apos;)</code> আর{" "}
          <code>getUser(&apos;124&apos;)</code> দুটো আলাদা এন্ট্রি — একই আর্গুমেন্টে ডাকলে
          তবেই ডিডুপ্লিকেশন হয়।
        </p>
      </Note>

      {/* ── Scope ─────────────────────────────────────────────────────── */}
      <H2 id="scope">৩. মেমোরাইজেশনের আয়ু</H2>

      <Line name="ভুলু ভাই">
        আর একটা কথা ভাই! এই রিকোয়েস্ট মেমোরাইজেশনের লাইফটাইম বা আয়ু কতক্ষণ?
      </Line>

      <Line name="নেক্সট-ভাই">
        এর স্কোপ বা আয়ু হলো একদম ক্ষণস্থায়ী (<strong>Transient Scope</strong>)!
      </Line>

      <ul>
        <li>
          যখন সার্ভার পেজটা রেন্ডার করা শুরু করে, তখন ইন-মেমরি মেমোরাইজেশন ক্যাশ তৈরি হয়।
        </li>
        <li>
          রেন্ডারিং শেষ হয়ে ক্লায়েন্টের কাছে HTML বা RSC Payload চলে যাওয়া মাত্রই এই মেমরি
          ফ্লাশ হয়ে যায়!
        </li>
        <li>
          অর্থাৎ ইউজারের পরবর্তী কোনো রিফ্রেশ বা অন্য ইউজারের রিকোয়েস্টে এই ক্যাশের কোনো
          প্রভাব থাকে না।
        </li>
      </ul>

      <Line name="ভুলু ভাই">(হাসিমুখে খাতায় নোট নিতে নিতে) দারুণ!</Line>

      <ul>
        <li>
          <code>fetch()</code> ➔ অটোমেটিক মেমোরাইজড।
        </li>
        <li>
          DB Query / SDK ➔ <code>React.cache()</code> দিয়ে ম্যানুয়ালি মেমোরাইজড।
        </li>
        <li>
          Scope ➔ শুধু ১টা রিকোয়েস্টের রেন্ডারিং লাইফসাইকেলের জন্য বেঁচে থাকে, তাই প্রপস
          ড্রিলিংয়ের কোনো ঝামেলাই নেই!
        </li>
      </ul>

      {/* ── Takeaway ──────────────────────────────────────────────────── */}
      <H2 id="takeaway">💡 Production Engineering Takeaways</H2>

      <ul>
        <li>
          <strong>Fetch Deduplication:</strong> একই পেজের একাধিক কম্পোনেন্ট থেকে হুবহু
          একই <code>fetch()</code> কল দিলে Next.js নেটওয়ার্ক ডুপ্লিকেশন আটকায়।
        </li>
        <li>
          <strong>React.cache() for Non-Fetch:</strong> Prisma, Drizzle, Axios বা ডিরেক্ট
          ডাটাবেজ কোয়েরির ডিডুপ্লিকেশনের জন্য <code>React.cache()</code> মোড়ানো
          বাধ্যতামূলক।
        </li>
        <li>
          <strong>No Prop Drilling in RSC:</strong> রিকোয়েস্ট মেমোরাইজেশনের কারণে সার্ভার
          কম্পোনেন্টে প্রপস দিয়ে ডাটা নিচে না পাঠিয়ে সরাসরি কনজিউমার কম্পোনেন্টে ডাটা ফেচ
          করা ক্লিন আর্কিটেকচারের বৈশিষ্ট্য।
        </li>
      </ul>
    </article>
  );
}
