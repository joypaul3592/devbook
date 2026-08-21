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
      bn: "একই URL, দুই রকম UI",
      en: "One URL, two different UIs",
    },
  },
  {
    id: "convention",
    label: { bn: "রিলেটিভ পাথ কনভেনশন", en: "The relative path convention" },
  },
  {
    id: "mental-model",
    label: { bn: "Soft বনাম Hard নেভিগেশন", en: "Soft vs hard navigation" },
  },
  {
    id: "implementation",
    label: { bn: "মোডাল ইন্টারসেপশনের কোড", en: "Implementing modal interception" },
  },
  {
    id: "matrix",
    label: { bn: "কোন ফাইল কখন রেন্ডার হয়", en: "Which file renders when" },
  },
  {
    id: "takeaway",
    label: { bn: "Production Takeaways", en: "Production takeaways" },
  },
];

export default function InterceptingRoutes() {
  return (
    <article className="doc-prose">
      {/* ── The problem ───────────────────────────────────────────────── */}
      <H2 id="the-problem" anchorOnly>
        একই URL, দুই রকম UI
      </H2>

      <p>
        রাত ৩:১৫। ভুলু ভাই একটি ফটো গ্যালারি অ্যাপ বানাচ্ছেন। তিনি ফেসবুকে একটা জিনিস খেয়াল
        করলেন: নিউজফিডে স্ক্রোল করার সময় কোনো ফটোতে ক্লিক করলে পেজ রিফ্রেশ হয় না, ফিডের
        ওপরেই একটি মোডাল পপ-আপ ভেসে ওঠে! কিন্তু সেই একই ফটোর লিংক কপি করে নতুন ট্যাবে খুললে
        কোনো মোডাল নয় — সরাসরি ফুল ফটো পেজ লোড হয়!
      </p>

      <Line name="ভুলু ভাই">
        (বিস্মিত হয়ে) নেক্সট-ভাই! এটা কীভাবে সম্ভব?! সাইটের ভেতরে অ্যাপ-লাইক নেভিগেশন করলে
        দেখাচ্ছে হালকা একটা মোডাল, কিন্তু একই URL-এ ডাইরেক্ট হিট করলে দেখাচ্ছে ফুল ডিটেইলস
        পেজ! URL-কে এভাবে &quot;ছিনতাই&quot; করার ম্যাজিকটা কীভাবে কাজ করে?!
      </Line>

      <Line name="নেক্সট-ভাই">
        (হেসে) ভুলু! এই কনসেপ্টটির নামই <strong>Intercepting Routes</strong>! এটি তোকে অন্য
        একটি রুটের URL লোড হওয়ার সময় মাঝপথে আটকিয়ে কাস্টম UI (মোডাল বা স্লাইড-ওভার ড্রয়ার)
        রেন্ডার করার ক্ষমতা দেয় — ইউজারের কনটেক্সট আর স্ক্রোল পজিশন অক্ষত রেখে।
      </Line>

      {/* ── Convention ────────────────────────────────────────────────── */}
      <H2 id="convention">১. রিলেটিভ পাথ কনভেনশন</H2>

      <ul>
        <li>
          <code>(.)</code> — একই ডিরেক্টরি লেভেলের রুট ইন্টারসেপ্ট করে।
        </li>
        <li>
          <code>(..)</code> — এক লেভেল ওপরের প্যারেন্ট রুট ইন্টারসেপ্ট করে।
        </li>
        <li>
          <code>(..)(..)</code> — দুই লেভেল ওপরের রুট ইন্টারসেপ্ট করে।
        </li>
        <li>
          <code>(...)</code> — একদম রুট <code>app/</code> ডিরেক্টরির যেকোনো রুট ইন্টারসেপ্ট
          করে।
        </li>
      </ul>

      {/* ── Mental model ──────────────────────────────────────────────── */}
      <H2 id="mental-model">২. Soft বনাম Hard নেভিগেশন</H2>

      <Diagram>{`[ Soft Navigation: user clicks a photo in the feed ]
  /feed ──(click photo #101)──► intercepted by app/(.)photos/[id]
                                └──► renders a MODAL over /feed

[ Hard Navigation: user enters /photos/101 directly, or reloads ]
  Direct request to /photos/101 ──► interception bypassed
                                └──► renders the FULL PAGE app/photos/[id]`}</Diagram>

      {/* ── Implementation ────────────────────────────────────────────── */}
      <H2 id="implementation">৩. মোডাল ইন্টারসেপশনের কোড</H2>

      <Diagram>{`app/
 ├── page.tsx              <-- Feed page with the photo grid
 ├── photos/
 │    └── [id]/page.tsx    <-- Full standalone photo page
 └── (.)photos/            <-- ⚡ Intercepts /photos/[id] on soft navigation
      └── [id]/page.tsx    <-- Modal representation`}</Diagram>

      <H3>A — মূল ফুল পেজ</H3>

      <CodeBlock filename="app/photos/[id]/page.tsx">{`interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function FullPhotoPage({ params }: PageProps) {
  const { id } = await params;

  return (
    <div className="p-12 max-w-4xl mx-auto space-y-6">
      <h1 className="text-3xl font-bold">Photo #{id} (Full standalone page)</h1>
      <div className="h-96 w-full bg-slate-800 rounded-2xl flex items-center justify-center text-slate-400 text-2xl font-bold">
        📷 High-res image {id}
      </div>
      <p className="text-slate-600">
        Rendered during hard navigation or when the link is shared directly.
      </p>
    </div>
  );
}`}</CodeBlock>

      <H3>B — ইন্টারসেপ্টেড মোডাল</H3>

      <p>
        এখানে <code>(.)</code> ব্যবহার করছি, কারণ ইন্টারসেপ্টিং ফোল্ডারটি{" "}
        <code>photos</code> ফোল্ডারের সাথে একই লেভেলে আছে।
      </p>

      <CodeBlock filename="app/(.)photos/[id]/page.tsx">{`'use client';

import { use } from 'react';
import { useRouter } from 'next/navigation';

interface InterceptedProps {
  params: Promise<{ id: string }>;
}

export default function InterceptedPhotoModal({ params }: InterceptedProps) {
  const router = useRouter();
  // React 19 / Next.js 15: unwrap the params promise with use()
  const { id } = use(params);

  return (
    <div
      className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4"
      onClick={() => router.back()} // Close on backdrop click
    >
      <div
        className="bg-slate-900 border border-slate-800 text-white rounded-2xl p-6 max-w-lg w-full space-y-4 shadow-2xl"
        onClick={(e) => e.stopPropagation()} // Don't close when clicking inside
      >
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-bold">Intercepted modal — Photo #{id}</h2>
          <button onClick={() => router.back()} className="text-slate-400 hover:text-white p-1">
            ✕
          </button>
        </div>

        <div className="h-64 w-full bg-slate-800 rounded-xl flex items-center justify-center text-slate-300 text-lg">
          📸 Fast modal preview {id}
        </div>

        <p className="text-xs text-slate-400">
          ⚡ The URL bar updated to /photos/{id} without replacing your background state.
        </p>
      </div>
    </div>
  );
}`}</CodeBlock>

      <H3>C — ফিড পেজ</H3>

      <CodeBlock filename="app/page.tsx">{`import Link from 'next/link';

export default function GalleryPage() {
  const photoIds = ['101', '102', '103'];

  return (
    <main className="p-8 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Interactive Photo Feed</h1>

      <div className="grid grid-cols-3 gap-4">
        {photoIds.map((id) => (
          <Link
            key={id}
            href={\`/photos/\${id}\`}
            className="h-40 bg-slate-800 hover:bg-slate-700 rounded-xl flex flex-col items-center justify-center text-white font-bold border border-slate-700 transition"
          >
            <span>View photo #{id}</span>
            <span className="text-xs font-normal text-slate-400 mt-1">(opens a modal)</span>
          </Link>
        ))}
      </div>
    </main>
  );
}`}</CodeBlock>

      {/* ── Matrix ────────────────────────────────────────────────────── */}
      <H2 id="matrix">৪. কোন ফাইল কখন রেন্ডার হয়</H2>

      <Table
        head={["নেভিগেশন টাইপ", "ইউজার যা দেখবে", "রেন্ডার হওয়া ফাইল"]}
        rows={[
          [
            <>
              Soft — <code>&lt;Link&gt;</code> ক্লিক বা <code>router.push</code>
            </>,
            "ব্যাকগ্রাউন্ড ঠিক থাকবে, ওপরে মোডাল ভেসে উঠবে",
            <code key="soft">app/(.)photos/[id]/page.tsx</code>,
          ],
          [
            "Hard — রিফ্রেশ বা ডাইরেক্ট URL",
            "সম্পূর্ণ আলাদা ফুল স্ট্যান্ডঅ্যালোন পেজ",
            <code key="hard">app/photos/[id]/page.tsx</code>,
          ],
        ]}
      />

      <Line name="ভুলু ভাই">
        (অবাক হয়ে) অসাম! ফটোতে ক্লিক করা মাত্র URL বার বদলে <code>/photos/101</code> হয়ে
        যাচ্ছে, কিন্তু পেজ রিফ্রেশ না হয়ে আলতো করে মোডাল খুলছে! আবার বন্ধুকে ওই URL পাঠালে সে
        ফুল পেজ দেখছে!
      </Line>

      {/* ── Takeaways ─────────────────────────────────────────────────── */}
      <H2 id="takeaway">Production Takeaways</H2>

      <Note>
        <ul>
          <li>
            <strong>Level Placement Math:</strong> <code>(..)</code> ব্যবহারের সময় খেয়াল
            রাখুন এটি ইন্টারসেপ্টিং ফোল্ডারের ফাইল হায়ারার্কির ওপর নির্ভর করে, আসল URL-এর
            ওপর নয়।
          </li>
          <li>
            <strong>Backdrop Dismiss:</strong> মোডাল বন্ধ করতে <code>router.back()</code>{" "}
            কল করুন — এটি ইউজারকে আগের রাউটিং হিস্ট্রি ও স্ক্রোল পজিশনে ফেরত নেয়।
          </li>
        </ul>
      </Note>
    </article>
  );
}
