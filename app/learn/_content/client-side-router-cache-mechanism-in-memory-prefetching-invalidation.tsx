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
      bn: "ইনস্ট্যান্ট নেভিগেশন, বাসি ডাটা",
      en: "Instant navigation, stale data",
    },
  },
  {
    id: "how-it-works",
    label: { bn: "Router Cache কীভাবে কাজ করে", en: "How the router cache works" },
  },
  {
    id: "prefetching",
    label: { bn: "Link কম্পোনেন্টের Prefetching", en: "Prefetching in Link" },
  },
  {
    id: "invalidation",
    label: { bn: "মেয়াদ ও ইনভ্যালিডেশন", en: "Stale times and invalidation" },
  },
  {
    id: "cheatsheet",
    label: { bn: "এক নজরে", en: "Cheat sheet" },
  },
  {
    id: "takeaway",
    label: { bn: "Production Takeaways", en: "Production takeaways" },
  },
];

export default function ClientRouterCache() {
  return (
    <article className="doc-prose">
      {/* ── The problem ───────────────────────────────────────────────── */}
      <H2 id="the-problem" anchorOnly>
        ইনস্ট্যান্ট নেভিগেশন, বাসি ডাটা
      </H2>

      <p>
        রাত ৮টা। ভুলু ভাই নেভিগেশন বারে একটি লিংকে মাউস রাখতেই দেখলেন — ক্লিক করার আগেই পরের
        পেজটি ব্যাকগ্রাউন্ডে রেডি হয়ে যাচ্ছে! আর ক্লিক করা মাত্রই চোখের পলকে সম্পূর্ণ নতুন
        পেজ রেন্ডার হয়ে গেল!
      </p>

      <Line name="ভুলু ভাই">
        (উত্তেজিত হয়ে) নেক্সট-ভাই! এটা তো ম্যাজিক! নতুন পেজে ক্লিক করার সাথে সাথে কোনো
        লোডিং স্পিনার বা পেজ রিফ্রেশ ছাড়াই অ্যাপ ইনস্ট্যান্ট লোড হয়ে যাচ্ছে!
      </Line>

      <Line name="ভুলু ভাই">
        কিন্তু এক জায়গায় খটকা! আমি অন্য একটি ট্যাবে গিয়ে ডাটাবেজের ভ্যালু চেঞ্জ করে আবার
        যখন আগের ট্যাবে নেভিগেট করে ফিরে আসছি, তখন দেখছি স্ক্রিনে পুরোনো ডাটাই রয়ে গেছে!
        পুরো ট্যাব রিফ্রেশ না দেওয়া পর্যন্ত নতুন ডাটা দেখাচ্ছে না! এই ম্যাজিক আর ঝামেলা —
        দুটোই কীভাবে একসাথে ঘটছে?!
      </Line>

      <Line name="নেক্সট-ভাই">
        (হেসে) ভুলু! এই ম্যাজিক এবং ঝামেলা — দুটোর জন্যই দায়ী Next.js-এর ৪র্থ ক্যাশ লেয়ার:{" "}
        <strong>Client-Side Router Cache</strong> (বা Segment Cache)! সার্ভার সাইডের Data
        Cache বা Full Route Cache ছাড়াও Next.js ব্রাউজারের র‍্যামে প্রতিটি ইউজার সেশনের জন্য
        একটি পাওয়ারফুল ক্যাশ মেইনটেইন করে।
      </Line>

      {/* ── How it works ──────────────────────────────────────────────── */}
      <H2 id="how-it-works">১. Router Cache কীভাবে কাজ করে</H2>

      <p>
        ইউজার যখন সাইটে ব্রাউজ করে, Next.js ব্রাউজার মেমোরিতে ভিজিট করা এবং প্রি-ফেচ করা
        পেজগুলোর RSC Payload স্টোর করে রাখে।
      </p>

      <Diagram>{`[User Browser Memory (Router Cache)]
 ├── /dashboard (RSC Payload Cached)
 ├── /profile   (Prefetched & Cached)
 └── /settings  (RSC Payload Cached)

  When the user clicks <Link href="/profile">:
  [Router Cache Check] ──► Found in RAM! ──► Instantly render component (0ms)
                                            └─► Skip the server network hit!`}</Diagram>

      {/* ── Prefetching ───────────────────────────────────────────────── */}
      <H2 id="prefetching">২. Link কম্পোনেন্টের Prefetching</H2>

      <Line name="নেক্সট-ভাই">
        তুই যে খেয়াল করলি — লিংকে মাউস নেওয়ার আগেই ডাটা রেডি হয়ে যাচ্ছে, সেটা ঘটে{" "}
        <code>&lt;Link&gt;</code> কম্পোনেন্টের In-Memory Prefetching-এর কারণে! যখনই কোনো
        লিংক ভিউপোর্টে দৃশ্যমান হয়, Next.js ব্যাকগ্রাউন্ডে সেই রুটের RSC Payload ফেচ করে
        Router Cache-এ রেখে দেয়।
      </Line>

      <CodeBlock filename="components/navigation.tsx">{`import Link from 'next/link';

export default function Navigation() {
  return (
    <nav className="flex gap-4">
      {/* ⚡ 1. Default prefetching (prefetch={true} or omitted) */}
      {/*    Static routes: the full route is prefetched */}
      {/*    Dynamic routes: prefetches the loading.tsx boundary */}
      <Link href="/products">Products</Link>

      {/* 🚀 2. Explicit opt-out — heavy routes or long lists */}
      <Link href="/analytics" prefetch={false}>
        Analytics
      </Link>
    </nav>
  );
}`}</CodeBlock>

      {/* ── Invalidation ──────────────────────────────────────────────── */}
      <H2 id="invalidation">৩. মেয়াদ ও ইনভ্যালিডেশন</H2>

      <Line name="ভুলু ভাই">
        নেক্সট-ভাই! ব্রাউজার মেমোরিতে এই ক্যাশ কতক্ষণ স্থায়ী থাকে? আর পুরোনো ডাটা সরাতে
        ইনভ্যালিডেশন কীভাবে কাজ করে?
      </Line>

      <ul>
        <li>
          <strong>Static Routes:</strong> ডিফল্টভাবে ৫ মিনিট ব্রাউজার মেমোরিতে থাকে।
        </li>
        <li>
          <strong>Dynamic Routes:</strong> ডিফল্টভাবে ৩০ সেকেন্ড ব্রাউজার মেমোরিতে থাকে।
        </li>
      </ul>

      <H3>Method 1 — Server Action (অটোমেটিক)</H3>

      <p>
        যখনই কোনো Server Action এক্সিকিউট হয় এবং তার ভেতর <code>revalidatePath()</code> বা{" "}
        <code>revalidateTag()</code> কল করা হয়, Next.js স্বয়ংক্রিয়ভাবে ক্লায়েন্ট-সাইডের
        Router Cache ফ্লাশ করে দেয়।
      </p>

      <CodeBlock filename="app/actions/update-profile.ts">{`'use server';

import { revalidatePath } from 'next/cache';

export async function updateProfile(formData: FormData) {
  // Update the DB…

  // ⚡ Flushes the server Data Cache AND the client Router Cache instantly
  revalidatePath('/profile');
}`}</CodeBlock>

      <H3>Method 2 — useRouter().refresh()</H3>

      <CodeBlock filename="components/refresh-button.tsx">{`'use client';

import { useRouter } from 'next/navigation';

export function RefreshButton() {
  const router = useRouter();

  const handleRefresh = () => {
    // 🚀 Clears the Router Cache for this route and refetches the RSC payload
    router.refresh();
  };

  return <button onClick={handleRefresh}>Refetch Fresh Data</button>;
}`}</CodeBlock>

      <H3>Method 3 — Hard Reload</H3>

      <p>
        ইউজার যদি ব্রাউজারে F5 বা Ctrl + R মারে, তবে ইন-মেমোরি সব Router Cache এক মুহূর্তে
        ডিলিট হয়ে যায়।
      </p>

      {/* ── Cheat sheet ───────────────────────────────────────────────── */}
      <H2 id="cheatsheet">৪. এক নজরে</H2>

      <Table
        head={["বৈশিষ্ট্য", "বিবরণ"]}
        rows={[
          ["অবস্থান", "ইউজারের ব্রাউজার মেমোরিতে (In-Memory Browser Session)"],
          ["Stale Time", "Static Route: ৫ মিনিট | Dynamic Route: ৩০ সেকেন্ড"],
          [
            "মূল সুবিধা",
            "Instant SPA-like navigation ও দ্রুত back/forward ব্রাউজিং",
          ],
          [
            "ক্লিয়ার করার উপায়",
            <>
              <code>router.refresh()</code>, <code>revalidatePath()</code> সহ Server
              Action, Hard Reload
            </>,
          ],
        ]}
      />

      <Line name="ভুলু ভাই">
        (হাঁফ ছেড়ে) ডাউট একদম ক্লিয়ার! <code>&lt;Link&gt;</code> স্ক্রিনে দেখা গেলেই পরের
        পেজের RSC Payload মেমোরিতে চলে আসে, তাই ট্রানজিশন এত ফাস্ট। তবে এই মেমোরি ক্যাশের
        কারণে ডাইনামিক পেজে ৩০ সেকেন্ড পর্যন্ত পুরোনো ডাটা থাকতে পারে — আর সেটা তাজা করতে{" "}
        <code>revalidatePath()</code> বা <code>router.refresh()</code>!
      </Line>

      {/* ── Takeaways ─────────────────────────────────────────────────── */}
      <H2 id="takeaway">Production Takeaways</H2>

      <Note>
        <ul>
          <li>
            <strong>Selective Prefetching:</strong> বিশাল তালিকা বা টেবিল রো-তে অজস্র লিংক
            থাকলে ব্যান্ডউইথ বাঁচাতে <code>prefetch={"{false}"}</code> ব্যবহার করা বেস্ট
            প্র্যাকটিস।
          </li>
          <li>
            <strong>Soft Navigation:</strong> Next.js নেভিগেশনের সময় পুরো স্টেট নষ্ট না করে
            শুধু পরিবর্তিত লেআউট ও পেজ সেগমেন্টটুকু আপডেট করে।
          </li>
          <li>
            <strong>Stale-time Tuning:</strong> প্রয়োজনে Next.js কনফিগে{" "}
            <code>staleTimes</code> টিউন করে ক্লায়েন্ট ক্যাশিং ডিউরেশন কাস্টমাইজ করা যায়।
          </li>
        </ul>
      </Note>
    </article>
  );
}
