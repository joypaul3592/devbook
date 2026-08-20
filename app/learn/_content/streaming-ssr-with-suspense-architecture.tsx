import { CodeBlock, Diagram, H2, Line, Note } from "@/components/learn/DocParts";
import type { Bi } from "@/lib/curriculum";

/** Section anchors — consumed by the "on this page" rail. */
export const headings: { id: string; label: Bi }[] = [
  {
    id: "the-problem",
    label: { bn: "এক উইজেটে পুরো পেজ আটকা", en: "One widget blocks the page" },
  },
  {
    id: "how-streaming-works",
    label: { bn: "Streaming SSR কীভাবে কাজ করে", en: "How streaming SSR works" },
  },
  {
    id: "loading-vs-suspense",
    label: { bn: "loading.tsx বনাম Suspense", en: "loading.tsx vs Suspense" },
  },
  {
    id: "gains",
    label: { bn: "তিনটা পারফরম্যান্স লাভ", en: "Three performance wins" },
  },
  {
    id: "takeaway",
    label: { bn: "Production Takeaways", en: "Production takeaways" },
  },
];

export default function StreamingSuspense() {
  return (
    <article className="doc-prose">
      {/* ── The problem ───────────────────────────────────────────────── */}
      <H2 id="the-problem" anchorOnly>
        এক উইজেটে পুরো পেজ আটকা
      </H2>

      <p>
        বিকেল গড়িয়ে সন্ধ্যা। ভুলু ভাই মনিটরের ওপর মুখ গুঁজে আছেন। পেজের স্পিনার ঘুরছে তো
        ঘুরছেই!
      </p>

      <Line name="ভুলু ভাই">
        নেক্সট-ভাই! আমি একটা ড্যাশবোর্ড বানিয়েছি। সেখানে ইউজারের প্রোফাইল, রিসেন্ট
        ট্রানজেকশন আর একটা থার্ড-পার্টি অ্যানালিটিক্স উইজেট আছে। এখন অ্যানালিটিক্স এপিআই
        স্লো হওয়ায় রেসপন্স পেতে ৪ সেকেন্ড সময় লাগছে। আর এই ৪ সেকেন্ড পুরো ওয়েবসাইট সাদা
        স্ক্রিন হয়ে থমকে থাকে! কোনো এইচটিএমএল-ই ব্রাউজারে আসছে না! ১টা স্লো ফ্রন্টএন্ড
        উইজেটের জন্য বাকি পুরো ড্যাশবোর্ড ব্লকড হয়ে বসে থাকবে ভাই?!
      </Line>

      <Line name="নেক্সট-ভাই">
        (হেসে) ভুলু, তুই তো তোর অজান্তেই{" "}
        <strong>Monolithic SSR Blocking Problem</strong>-এর শিকার হয়েছিস! তুই পুরো
        পেজটাকে একসাথে ব্যাকএন্ড থেকে রেন্ডার করানোর চেষ্টা করছিস, ফলে সবচেয়ে স্লো
        সার্ভিসটা তোর পুরো ওয়েবসাইটের <strong>Time to First Byte (TTFB)</strong> বাড়িয়ে
        দিচ্ছে!
      </Line>

      {/* ── How streaming works ───────────────────────────────────────── */}
      <H2 id="how-streaming-works">১. Streaming SSR কীভাবে কাজ করে</H2>

      <Line name="ভুলু ভাই">
        কিন্তু উপায় কী? ব্যাকএন্ড থেকে তো ডাটা না এলে ক্লায়েন্ট পেজ দেখতে পারবে না!
      </Line>

      <Line name="নেক্সট-ভাই">
        আগে পারত না, কিন্তু আধুনিক ফ্রন্টএন্ড আর্কিটেকচারে এর সমাধান হলো{" "}
        <strong>Streaming SSR with Suspense</strong>! Next.js এখন আর পুরো পেজের জন্য
        অপেক্ষা করে না। যে অংশগুলো রেডি (যেমন নেভবার, সাইডবার, ইউজার প্রোফাইল) —
        সেগুলোর HTML বানিয়ে সাথে সাথে ব্রাউজারে stream (চাঙ্ক আকারে) করে পাঠিয়ে দেয়! আর
        স্লো অংশটির জায়গায় একটা সুন্দর লোডিং স্কেলেটন ঝুলিয়ে রাখে।
      </Line>

      <Diagram>{`[Server Engine]
       │
       ├── 1. Sends Fast Static Shell + Fast Data (Navbar, Sidebar) ⚡ (Instant TTFB!)
       └── 2. Encapsulates Slow Component in <Suspense>
              │
              ▼ (Streams HTML chunk over open HTTP connection when ready!)
       └── 3. Replaces Fallback Skeleton with Final UI Component!`}</Diagram>

      <Line name="ভুলু ভাই">
        (চোখ বড় বড় করে) তারমানে পুরো পেজ রেন্ডার হওয়ার জন্য চার সেকেন্ড আটকে থাকতে হবে
        না?! ইউজার ঢুকেই নেভবার আর বাকি ইউআই দেখে ফেলবে?!
      </Line>

      <Line name="নেক্সট-ভাই">
        একদম! আর ডাটা আসার সাথে সাথে একই এইচটিএমএল স্ট্রিম লাইভ কানেকশনে এসে লোডিং
        স্কেলেটন সরিয়ে আসল উইজেট বসিয়ে দেবে!
      </Line>

      <Note>
        <p>
          মূল ট্রিকটা হলো HTTP কানেকশনটা <strong>খোলা</strong> থাকে। সার্ভার প্রথম চাঙ্কে
          শেল পাঠিয়েই রেসপন্স শেষ করে দেয় না — বাকি চাঙ্কগুলো তৈরি হওয়ার সাথে সাথে একই
          কানেকশন দিয়ে পাঠাতে থাকে।
        </p>
      </Note>

      {/* ── loading.tsx vs Suspense ───────────────────────────────────── */}
      <H2 id="loading-vs-suspense">২. loading.tsx বনাম granular Suspense</H2>

      <Line name="ভুলু ভাই">
        কিন্তু ভাই, আমি তো <code>app/dashboard/loading.tsx</code> বানিয়ে রেখেছিলাম! ওটা
        কি এই কাজটাই করে না?
      </Line>

      <Line name="নেক্সট-ভাই">
        <code>loading.tsx</code> হলো পুরো পেজের জন্য একটা{" "}
        <strong>coarse-grained</strong> (মোটা দাগের) সলিউশন। তুই যখন{" "}
        <code>loading.tsx</code> দিবি, তখন পুরো ড্যাশবোর্ড পেজটাই গায়েব হয়ে একটাই লোডিং
        স্পিনার দেখাবে। কিন্তু প্রোডাকশন-লেভেলে তোকে ব্যবহার করতে হবে{" "}
        <strong>Granular Suspense Boundaries</strong>!
      </Line>

      <CodeBlock filename="app/dashboard/page.tsx">{`// ❌ coarse-grained: পুরো পেজ ব্লকড
export default function DashboardPage() {
  return <SlowAnalyticsWidget />; // পুরো পেজ স্লো!
}

// ✅ Granular Streaming Architecture
import { Suspense } from 'react';

export default function DashboardPage() {
  return (
    <div className="grid grid-cols-2 gap-4">
      {/* ⚡ Instant Render */}
      <UserProfileCard />

      {/* 🔄 Isolated Streaming Component */}
      <Suspense fallback={<AnalyticsSkeleton />}>
        <SlowAnalyticsWidget />
      </Suspense>
    </div>
  );
}`}</CodeBlock>

      <Line name="ভুলু ভাই">
        (মাথা চুলকে) ওয়াও! তারমানে <code>&lt;Suspense&gt;</code> দিয়ে ঘিরে দিলে ওই স্লো
        উইজেটটা নিজের মতো আলাদা আইসোলেটেড বাউন্ডারিতে চলে গেল! ও ব্যাকএন্ড থেকে ৪ সেকেন্ড
        পর আসুক আর ১০ সেকেন্ড পর আসুক, আমার বাকি ড্যাশবোর্ডের ১ মিলি-সেকেন্ড
        পারফর্মেন্সও ড্রপ করবে না!
      </Line>

      <Note>
        <p>
          <code>loading.tsx</code> আসলে ভেতরে ভেতরে পুরো <code>page.tsx</code>-কে একটা{" "}
          <code>&lt;Suspense&gt;</code> দিয়েই মুড়ে দেয় — অর্থাৎ দুটো আলাদা প্রযুক্তি নয়,
          একই জিনিসের দুই মাপ। পার্থক্যটা শুধু বাউন্ডারিটা কত বড়।
        </p>
      </Note>

      {/* ── Gains ─────────────────────────────────────────────────────── */}
      <H2 id="gains">৩. তিনটা পারফরম্যান্স লাভ</H2>

      <Line name="নেক্সট-ভাই">
        বিঙ্গো! এতে তোর ফ্রন্টএন্ড পারফর্মেন্সের ৩টা বড় লাভ:
      </Line>

      <ul>
        <li>
          <strong>Low TTFB:</strong> ইউজার সাথে সাথে রেসপন্স পায়।
        </li>
        <li>
          <strong>First Contentful Paint (FCP) সুপারফাস্ট:</strong> স্ক্রিন ফাঁকা থাকে
          না, স্কেলেটন দেখায়।
        </li>
        <li>
          <strong>Progressive Hydration:</strong> স্ট্রিম হওয়া এইচটিএমএল চাঙ্কগুলো আসার
          সাথে সাথেই React সেগুলোকে আলাদা আলাদাভাবে হাইড্রেট (interactive) করে ফেলে!
        </li>
      </ul>

      <Line name="ভুলু ভাই">
        ধন্য ভাই নেক্সট-ভাই! আমি এখনই স্লো এপিআই আর ভারী চার্ট উইজেটগুলোকে আলাদা আলাদা{" "}
        <code>&lt;Suspense&gt;</code> বাউন্ডারিতে লক করে ব্লকিং মেকানিজম মুক্ত করছি!
      </Line>

      {/* ── Takeaway ──────────────────────────────────────────────────── */}
      <H2 id="takeaway">💡 Production Frontend Takeaways</H2>

      <ul>
        <li>
          <strong>Streaming Advantage:</strong> স্ট্রিমিং SSR ফ্রন্টএন্ডে চাঙ্ক আকারে
          এইচটিএমএল পাঠায়, ফলে একটি স্লো এপিআই ডাটার জন্য পুরো পেজের TTFB আর FCP নষ্ট হয়
          না।
        </li>
        <li>
          <strong>Granular Suspense Over loading.tsx:</strong> পুরো পেজ স্কেলেটনে ঢেকে না
          রেখে শুধুমাত্র স্লো ফ্রন্টএন্ড উইজেটগুলোকে ইন্ডিভিজুয়াল{" "}
          <code>&lt;Suspense&gt;</code> দিয়ে আইসোলেট করা বেস্ট প্র্যাকটিস।
        </li>
        <li>
          <strong>Progressive Hydration:</strong> সার্ভার থেকে আসা স্ট্রিমড চাঙ্কগুলো
          ব্রাউজারে নামার সাথে সাথে React সেগুলোকে আংশিকভাবে হাইড্রেট করে ফেলে, ফলে ইউজার
          অভিজ্ঞতা হয় আল্ট্রা-স্মুথ।
        </li>
      </ul>
    </article>
  );
}
