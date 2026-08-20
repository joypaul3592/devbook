import { CodeBlock, H2, Line, Note } from "@/components/learn/DocParts";
import type { Bi } from "@/lib/curriculum";

/** Section anchors — consumed by the "on this page" rail. */
export const headings: { id: string; label: Bi }[] = [
  {
    id: "no-form",
    label: { bn: "যেখানে কোনো ফর্মই নেই", en: "Where there is no form" },
  },
  {
    id: "event-handlers",
    label: { bn: "১. ইভেন্ট হ্যান্ডলার থেকে কল", en: "1. From event handlers" },
  },
  {
    id: "use-transition",
    label: { bn: "২. useTransition দিয়ে লোডিং", en: "2. Loading with useTransition" },
  },
  {
    id: "debounced",
    label: { bn: "৩. ডেবাউন্সড সার্চ", en: "3. Debounced search" },
  },
  {
    id: "takeaway",
    label: { bn: "Production Takeaways", en: "Production takeaways" },
  },
];

export default function ProgrammaticActions() {
  return (
    <article className="doc-prose">
      {/* ── No form ───────────────────────────────────────────────────── */}
      <H2 id="no-form" anchorOnly>
        যেখানে কোনো ফর্মই নেই
      </H2>

      <p>
        পরদিন সকালে ভুলু ভাই ল্যাপটপে কফি নিয়ে বসে স্ক্রিনের দিকে একদৃষ্টিতে চেয়ে আছেন।
        তিনি একটা কাস্টম ডাটা-টেবিল বানাচ্ছেন, যেখানে একটা সার্চ ড্রপডাউন, ডেবাউন্সড ইনপুট
        ফিল্ড আর ইনফিনিট স্ক্রোলিং কার্ড রয়েছে।
      </p>

      <Line name="ভুলু ভাই">
        নেক্সট-ভাই! এতক্ষণ তো ফর্ম সাবমিশনের সাথে{" "}
        <code>&lt;form action={`{...}`}&gt;</code> দিয়ে সার্ভার অ্যাকশন কল করা শিখলাম।
        কিন্তু আমার সাইটে এমন অনেক জায়গা আছে যেখানে কোনো <code>&lt;form&gt;</code>{" "}
        ট্যাগই নেই! যেমন — ইনফিনিট স্ক্রোলে পেজের নিচে গেলে নতুন ডাটা ফেচ করা, সার্চ বক্সে
        টাইপ করার সাথে সাথে ডেবাউন্সড ইভেন্টে অ্যাকশন চালানো, বা কোনো ফাইল ড্রপ করার সাথে
        সাথে অটো-আপলোড হওয়া। এসব জায়গায় কি প্রোগ্রাম্যাটিকভাবে <code>onClick</code>,{" "}
        <code>onChange</code>, বা <code>useEffect</code>-এর ভেতর থেকে সরাসরি Server Action
        কল করা যায়?!
      </Line>

      <Line name="নেক্সট-ভাই">
        (হেসে) অবশ্যই যায়, ভুলু! Server Action মানে কিন্তু শুধু ফর্মের{" "}
        <code>action</code> প্রপার্টিতে বসানোর জিনিস নয়! কালকে তোকে কী বলেছিলাম? Server
        Action হলো ব্যাকগ্রাউন্ডে ঝুলে থাকা একটা টাইপ-সেফ পাবলিক async JavaScript ফাংশন!
        তুই ব্রাউজারের যেকোনো ইভেন্ট হ্যান্ডলার (<code>onClick</code>,{" "}
        <code>onChange</code>, <code>onDrop</code>), <code>useEffect</code>, এমনকি কোনো
        থার্ড-পার্টি লাইব্রেরির কলব্যাক থেকেও ওটাকে এক্সিকিউট করতে পারবি!
      </Line>

      {/* ── Event handlers ────────────────────────────────────────────── */}
      <H2 id="event-handlers">১. ইভেন্ট হ্যান্ডলার থেকে কল</H2>

      <Line name="নেক্সট-ভাই">
        তোকে কোনো ফর্ম ট্যাগ ব্যবহার করতেই হবে না। যেকোনো বাটনের <code>onClick</code>-এ
        সরাসরি <code>async/await</code> দিয়ে অ্যাকশন কল করতে পারবি:
      </Line>

      <CodeBlock filename="app/actions.ts">{`'use server'

export async function archiveNotification(id: string) {
  await db.notification.update({
    where: { id },
    data: { archived: true },
  });
  return { success: true };
}`}</CodeBlock>

      <CodeBlock filename="app/notification-item.tsx">{`'use client'

import { archiveNotification } from '@/app/actions';

export function NotificationItem({ id }: { id: string }) {
  async function handleArchive() {
    // ⚡ Programmatic execution outside forms!
    const res = await archiveNotification(id);
    if (res.success) {
      toast.success('নোটিফিকেশন আর্কাইভ করা হয়েছে!');
    }
  }

  return <button onClick={handleArchive}>আর্কাইভ করুন</button>;
}`}</CodeBlock>

      <Note>
        <p>
          ফর্মের বাইরে ডাকলে progressive enhancement-টা হারায় — JS লোড না হওয়া পর্যন্ত{" "}
          <code>onClick</code> কিছুই করবে না। তাই ক্রিটিক্যাল ফ্লো (লগইন, পেমেন্ট, ডিলিট)
          ফর্মেই রাখ; প্রোগ্রাম্যাটিক কল রাখ সেসব ইন্টারঅ্যাকশনের জন্য যেগুলো এমনিতেই
          JavaScript ছাড়া সম্ভব নয় (ইনফিনিট স্ক্রোল, লাইভ সার্চ)।
        </p>
      </Note>

      {/* ── useTransition ─────────────────────────────────────────────── */}
      <H2 id="use-transition">২. useTransition দিয়ে লোডিং</H2>

      <Line name="ভুলু ভাই">
        ভাই! কিন্তু ফর্মের বাইরে তো আর <code>useActionState</code>-এর{" "}
        <code>isPending</code> অটোমেটিক কাজ করবে না! তখন বাটনে লোডিং স্পিনার কীভাবে দেখাব?
      </Line>

      <Line name="নেক্সট-ভাই">
        ব্রিলিয়ান্ট কোশ্চেন! ফর্মের বাইরে প্রোগ্রাম্যাটিক অ্যাকশন ডাকার সময় ইউআই ফ্রিজ
        হওয়া ঠেকাতে আর লোডিং স্টেট সামলাতে ব্যবহার করতে হবে React-এর{" "}
        <code>useTransition</code> হুক!
      </Line>

      <CodeBlock filename="app/bookmark-button.tsx">{`'use client'

import { useTransition } from 'react';
import { toggleBookmark } from '@/app/actions';

export function BookmarkButton({ postId }: { postId: string }) {
  // ⚡ Pending status managed by useTransition
  const [isPending, startTransition] = useTransition();

  const handleBookmark = () => {
    // Wrap the Server Action call inside startTransition
    startTransition(async () => {
      await toggleBookmark(postId);
      toast.success('বুকমার্ক আপডেট হয়েছে!');
    });
  };

  return (
    <button onClick={handleBookmark} disabled={isPending}>
      {isPending ? 'সেভ হচ্ছে...' : '🔖 বুকমার্ক করুন'}
    </button>
  );
}`}</CodeBlock>

      {/* ── Debounced ─────────────────────────────────────────────────── */}
      <H2 id="debounced">৩. ডেবাউন্সড সার্চ</H2>

      <Line name="ভুলু ভাই">
        আর যদি সার্চ বক্সে টাইপ করার সাথে সাথে প্রোগ্রাম্যাটিকভাবে অ্যাকশন ডেকে সার্ভার
        থেকে ফিল্টার ডাটা আনতে চাই?
      </Line>

      <Line name="নেক্সট-ভাই">
        সেখানেও তোকে ডেবাউন্সড হ্যান্ডলারের ভেতরে অ্যাকশন এক্সিকিউট করতে হবে:
      </Line>

      <CodeBlock filename="app/search-bar.tsx">{`'use client'

import { useState, useTransition } from 'react';
import { searchProducts } from '@/app/actions';

export function SearchBar() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [isPending, startTransition] = useTransition();

  const handleSearch = (text: string) => {
    setQuery(text);

    // Debounced programmatic Server Action execution
    startTransition(async () => {
      if (text.trim().length > 2) {
        const data = await searchProducts(text);
        setResults(data);
      }
    });
  };

  return (
    <div>
      <input
        type="text"
        value={query}
        onChange={(e) => handleSearch(e.target.value)}
        placeholder="পণ্য খুঁজুন..."
      />
      {isPending && <p>খোঁজা হচ্ছে...</p>}

      <ul>
        {results.map((item: any) => (
          <li key={item.id}>{item.name}</li>
        ))}
      </ul>
    </div>
  );
}`}</CodeBlock>

      <Note>
        <p>
          Server Action-এর কলগুলো সিরিয়ালি চলে — একটার পর একটা। তাই দ্রুত টাইপ করলে
          রেসপন্স আউট-অফ-অর্ডারে এসে পুরনো রেজাল্ট বসিয়ে দিতে পারে। প্রোডাকশনে হয় সত্যিকারের
          debounce টাইমার রাখ, নয়তো প্রতিটা কোয়েরির সাথে একটা request id মিলিয়ে দেখ —
          সর্বশেষটা ছাড়া বাকিগুলো ফেলে দে।
        </p>
      </Note>

      <Line name="ভুলু ভাই">
        (ল্যাপটপে কোড ইমপ্লিমেন্ট করে চিৎকার দিয়ে) অস্থির নেক্সট-ভাই!
      </Line>

      <ul>
        <li>
          সার্ভার অ্যাকশন ব্যবহার করার জন্য <code>&lt;form&gt;</code> থাকা বাধ্যতামূলক না!
        </li>
        <li>
          সাধারণ <code>onClick</code>, <code>onChange</code> হ্যান্ডলারের ভেতরে সরাসরি{" "}
          <code>async/await</code> দিয়ে অ্যাকশন এক্সিকিউট করা যায়।
        </li>
        <li>
          আর লোডিং বা ট্রানজিশন স্টেট ম্যানেজ করার জন্য <code>startTransition</code>{" "}
          ব্যবহার করলে ইউআই রেসপন্সিভ থাকে!
        </li>
      </ul>

      <Line name="নেক্সট-ভাই">
        একদম বিঙ্গো! ফর্মের বাউন্ডারি থেকে বের হয়ে প্রোগ্রাম্যাটিকভাবে সার্ভার অ্যাকশন কল
        করার এই ফ্লেক্সিবিলিটিই Next.js-এর ফুল-স্ট্যাক আর্কিটেকচারকে এত শক্তিশালী করেছে!
      </Line>

      {/* ── Takeaway ──────────────────────────────────────────────────── */}
      <H2 id="takeaway">💡 Production Engineering Takeaways</H2>

      <ul>
        <li>
          <strong>Form-Independent Execution:</strong> Server Action হলো প্লেইন async
          ফাংশন, যা ফর্মের বাইরে যেকোনো event handler বা lifecycle hook থেকে সরাসরি কল করা
          যায়।
        </li>
        <li>
          <strong>useTransition Integration:</strong> প্রোগ্রাম্যাটিক অ্যাকশন ডাকার সময়
          ইউআই রেসপন্সিভ রাখতে আর loading state ট্র্যাক করতে <code>useTransition</code>{" "}
          ব্যবহার করা স্ট্যান্ডার্ড প্র্যাকটিস।
        </li>
        <li>
          <strong>Type-Safety Advantage:</strong> API Route-এ{" "}
          <code>fetch(&apos;/api/search&apos;)</code> মারার বদলে প্রোগ্রাম্যাটিক Server
          Action কল করলে এন্ড-টু-এন্ড টাইপ সেফটি বজায় থাকে।
        </li>
      </ul>
    </article>
  );
}
