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
      bn: "এক পেজ, তিনবার একই কোয়েরি",
      en: "One page, the same query three times",
    },
  },
  {
    id: "auto-memoization",
    label: {
      bn: "fetch()-এর অটোমেটিক মেমোইজেশন",
      en: "Automatic memoization in fetch()",
    },
  },
  {
    id: "non-fetch",
    label: { bn: "ORM আর ডাটাবেজ ড্রাইভারের সমস্যা", en: "The ORM problem" },
  },
  {
    id: "react-cache",
    label: { bn: "React cache() দিয়ে সমাধান", en: "Solving it with React cache()" },
  },
  {
    id: "vs-unstable-cache",
    label: {
      bn: "cache() বনাম unstable_cache()",
      en: "cache() vs unstable_cache()",
    },
  },
  {
    id: "takeaway",
    label: { bn: "Production Takeaways", en: "Production takeaways" },
  },
];

export default function RequestMemoizationReactCache() {
  return (
    <article className="doc-prose">
      {/* ── The problem ───────────────────────────────────────────────── */}
      <H2 id="the-problem" anchorOnly>
        এক পেজ, তিনবার একই কোয়েরি
      </H2>

      <p>
        দুপুর ২টো। ভুলু ভাই কোড এডিটর খুলে স্ক্রিনের দিকে চোখ সরু করে তাকিয়ে আছেন। তিনি একই
        পেজের ৩টি আলাদা সার্ভার কম্পোনেন্টে — Navbar, UserProfileCard এবং Sidebar-এ — একই
        ডাটাবেজ কোয়েরি <code>db.user.findUnique()</code> ডেকে ডাটা ফেচ করছেন!
      </p>

      <Line name="ভুলু ভাই">
        নেক্সট-ভাই! একটা চরম চিন্তায় পড়ে গেলাম! আমার এই সিঙ্গেল পেজটা রেন্ডার হতে গিয়ে
        ব্যাকএন্ড ডাটাবেজে ৩ বার একই SQL কোয়েরি মারছে! এর মানে একজন ইউজার পেজে হিট করলে
        ডাটাবেজে ৩টি ডুপ্লিকেট হিট পড়ে সার্ভার স্লো হয়ে যাচ্ছে।
      </Line>

      <Line name="ভুলু ভাই">
        আমি কি তবে প্যারেন্ট কম্পোনেন্টে একবার ডাটা ফেচ করে বাকি চাইল্ড কম্পোনেন্টে প্রোপস
        ড্রিলিং করে ডাটা পাস করব?! কিন্তু প্রোপস ড্রিলিং তো ক্লিন আর্কিটেকচার নষ্ট করে ফেলে!
      </Line>

      <Line name="নেক্সট-ভাই">
        (হেসে) একদম না ভুলু! প্রোপস ড্রিলিং করার কোনো প্রয়োজনই নেই! Next.js এবং React-এর
        আর্কিটেকচার তোকে স্বাধীনতা দেয় — <strong>&quot;Fetch data where you need it!&quot;</strong>{" "}
        যে কম্পোনেন্টে ডাটা লাগবে, সেখানেই সরাসরি ফেচ কর!
      </Line>

      <Line name="নেক্সট-ভাই">
        আর তোর ডাটাবেজ বা API-তে যেন ডুপ্লিকেট হিট না পড়ে, সেজন্যই সার্ভার সাইডে রিকোয়েস্ট
        লাইফসাইকেলে কাজ করে <strong>Request Memoization</strong> এবং React 19-এর পাওয়ারফুল{" "}
        <code>cache()</code> ফাংশন!
      </Line>

      {/* ── Automatic memoization ─────────────────────────────────────── */}
      <H2 id="auto-memoization">১. fetch()-এর অটোমেটিক মেমোইজেশন</H2>

      <Line name="নেক্সট-ভাই">
        যদি তুই নেটিভ <code>fetch()</code> ব্যবহার করিস, তবে Next.js অটোমেটিক্যালি একই HTTP
        Request Cycle-এর ভেতর ডুপ্লিকেট ফেচগুলোকে মেমোইজ করে ফেলে।
      </Line>

      <Diagram>{`[Incoming Single HTTP Request]
               │
               ├─────────────────────────────────────────┐
               ▼                                         ▼
   [Navbar Component Calls]                   [Sidebar Component Calls]
 fetch('https://api.com/user/1')            fetch('https://api.com/user/1')
               │                                         │
               ▼                                         ▼
     ⚡ 1st Call: Hits Network                🚀 2nd Call: Served Instantly
     & Stores in Memoization Memory              from Memoization Memory (0ms)`}</Diagram>

      <ul>
        <li>
          প্রথমবার যখন <code>fetch()</code> কল হয়, ডাটা নেটওয়ার্ক থেকে আসে এবং মেমোরিতে
          জমে।
        </li>
        <li>
          ওই একই পেজের অন্য যেকোনো চাইল্ড কম্পোনেন্ট যদি একই URL ও Options দিয়ে{" "}
          <code>fetch()</code> ডাকে, তবে Next.js ডুপ্লিকেট হিট না মেরে ইন-মেমোরি রেজাল্ট
          রিটার্ন করে দেয়।
        </li>
      </ul>

      {/* ── The ORM problem ───────────────────────────────────────────── */}
      <H2 id="non-fetch">২. ORM আর ডাটাবেজ ড্রাইভারের সমস্যা</H2>

      <Line name="ভুলু ভাই">
        (আগ্রহ নিয়ে) ভাই! <code>fetch()</code>-এর ক্ষেত্রে না হয় বুঝলাম অটোমেটিক কাজ করে।
        কিন্তু আমরা তো প্রজেক্টে Prisma, Drizzle, Kysely বা সরাসরি MongoDB/PostgreSQL
        ড্রাইভার দিয়ে ডাটা ফেচ করি (<code>db.user.findUnique()</code>)! এগুলো তো আর HTTP{" "}
        <code>fetch()</code> না! তাহলে ORM-এর ডুপ্লিকেট রিকোয়েস্ট কীভাবে থামাব?!
      </Line>

      <Line name="নেক্সট-ভাই">
        ব্রিলিয়্যান্ট পয়েন্ট ভুলু! Non-fetch বা ORM কোয়েরির ক্ষেত্রে নেটিভ অটোমেটিক
        মেমোইজেশন কাজ করে না। আর ঠিক এই জায়গাতেই তোকে ব্যবহার করতে হবে React-এর অফিশিয়াল{" "}
        <code>cache()</code> হেলপার ফাংশন!
      </Line>

      {/* ── React cache() ─────────────────────────────────────────────── */}
      <H2 id="react-cache">৩. React cache() দিয়ে সমাধান</H2>

      <p>
        <code>react</code> প্যাকেজ থেকে আসা <code>cache()</code> ফাংশন দিয়ে যেকোনো কাস্টম
        Async Function বা ORM Query-কে র‍্যাপ করে দিলে তা Request-Scoped Memoized
        Function-এ রূপান্তরিত হয়ে যায়।
      </p>

      <H3>Step 1 — Memoized Data Access Layer (DAL)</H3>

      <CodeBlock filename="lib/dal/user.ts">{`// lib/dal/user.ts
import { cache } from 'react';
import { db } from '@/lib/db';

/**
 * ⚡ React cache() wraps ORM queries to enable Request Memoization.
 * Scope: valid ONLY for the current server request lifecycle.
 */
export const getUserById = cache(async (userId: string) => {
  console.log(\`[DB HIT] Fetching user: \${userId}\`); // Executes ONLY ONCE per request!

  const user = await db.user.findUnique({
    where: { id: userId },
    select: { id: true, name: true, email: true, role: true },
  });

  return user;
});`}</CodeBlock>

      <H3>Step 2 — যেখানে দরকার, সেখানেই কল করো</H3>

      <CodeBlock filename="components/navbar.tsx">{`// app/components/navbar.tsx
import { getUserById } from '@/lib/dal/user';

export async function Navbar({ userId }: { userId: string }) {
  const user = await getUserById(userId); // ⚡ DB Hit 1 (Executes Query)
  return <nav>Welcome, {user?.name}</nav>;
}

// app/components/sidebar.tsx
import { getUserById } from '@/lib/dal/user';

export async function Sidebar({ userId }: { userId: string }) {
  const user = await getUserById(userId); // 🚀 Served from cache() memory (NO DB HIT!)
  return <aside>Role: {user?.role}</aside>;
}`}</CodeBlock>

      {/* ── cache() vs unstable_cache() ───────────────────────────────── */}
      <H2 id="vs-unstable-cache">৪. cache() বনাম unstable_cache()</H2>

      <Line name="ভুলু ভাই">
        (একটু কনফিউজড হয়ে) দাঁড়াও নেক্সট-ভাই! Next.js-এর ডকে নাকি{" "}
        <code>unstable_cache</code> নামেও আরেকটা জিনিস দেখা যায়! এই দুটোর মধ্যে পার্থক্য
        কী?!
      </Line>

      <Line name="নেক্সট-ভাই">
        একদম গুলিয়ে ফেলবি না! এ দুটি পুরো আলাদা স্তরের ক্যাশিং হ্যান্ডেল করে:
      </Line>

      <Table
        head={[
          "বৈশিষ্ট্য",
          <>
            React <code>cache()</code>
          </>,
          <>
            Next.js <code>unstable_cache()</code>
          </>,
        ]}
        rows={[
          ["ক্যাশ লেয়ার", "Request Memoization", "Data Cache"],
          [
            "লাইফসাইকেল",
            "একটি একক রিকোয়েস্ট শেষ হলেই ধ্বংস হয়",
            "একাধিক রিকোয়েস্ট ও ইউজারের জন্য স্থায়ী",
          ],
          [
            "ইউজ কেস",
            "একই রিকোয়েস্টে কম্পোনেন্ট ট্রিতে ডুপ্লিকেট হিট বন্ধ করতে",
            "ডাটাবেজ কোয়েরির রেজাল্ট দীর্ঘ সময় ক্যাশ করে রাখতে",
          ],
          [
            "আর্গুমেন্ট সাপোর্ট",
            "যেকোনো ধরনের আর্গুমেন্ট (Objects, Functions)",
            "শুধু Serializable (Strings, Numbers, JSON)",
          ],
        ]}
      />

      <Line name="ভুলু ভাই">
        (খাতায় নোট নিয়ে) আহ! এবার পানির মতো পরিষ্কার! একই রিকোয়েস্ট লাইফসাইকেলে একাধিক
        কম্পোনেন্ট থেকে ORM কল হলে <code>cache()</code> দিয়ে ফাংশন র‍্যাপ করে রাখব — আর
        প্রোপস ড্রিলিংয়ের ঝক্কি ছাড়াই ডুপ্লিকেট SQL কোয়েরি শূন্যে নেমে আসবে!
      </Line>

      {/* ── Takeaways ─────────────────────────────────────────────────── */}
      <H2 id="takeaway">Production Takeaways</H2>

      <Note>
        <ul>
          <li>
            <strong>Request-Scoped Lifetime:</strong> <code>cache()</code> দিয়ে মেমোইজ করা
            ডাটা শুধু ওই নির্দিষ্ট HTTP রিকোয়েস্টের রেন্ডারিং সাইকেল পর্যন্তই থাকে; অন্য
            রিকোয়েস্ট বা অন্য ইউজারের সাথে শেয়ার হয় না।
          </li>
          <li>
            <strong>Props Drilling Elimination:</strong> ডাটা দরকার এমন প্রতিটি সার্ভার
            কম্পোনেন্ট থেকে স্বাধীনভাবে ফেচ করো — মেমোইজেশন ব্যাকগ্রাউন্ডে ডুপ্লিকেট
            এক্সিকিউশন রোধ করবে।
          </li>
          <li>
            <strong>Combining Patterns:</strong> সর্বোচ্চ পারফর্মেন্সের জন্য{" "}
            <code>cache()</code> (Memoization) এবং <code>unstable_cache()</code> (Persistent
            Data Cache) একসাথে কম্বাইন করে প্রোডাকশন ডাটা লেয়ার তৈরি করা হয়।
          </li>
        </ul>
      </Note>
    </article>
  );
}
