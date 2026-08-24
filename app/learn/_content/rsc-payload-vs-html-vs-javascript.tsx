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
      bn: "?_rsc= রিকোয়েস্টটা কী?",
      en: "What is that ?_rsc= request?",
    },
  },
  {
    id: "matrix",
    label: {
      bn: "তিনটি মিডিয়ামের তুলনা",
      en: "Three mediums compared",
    },
  },
  {
    id: "payload-demo",
    label: {
      bn: "Payload দেখতে কেমন",
      en: "What the payload looks like",
    },
  },
  {
    id: "execution-flow",
    label: {
      bn: "Initial Load বনাম Soft Navigation",
      en: "Initial load vs soft navigation",
    },
  },
  {
    id: "takeaway",
    label: { bn: "Production Takeaways", en: "Production takeaways" },
  },
];

export default function RscPayloadVsHtmlVsJavaScript() {
  return (
    <article className="doc-prose">
      {/* ── The problem ───────────────────────────────────────────────── */}
      <H2 id="the-problem" anchorOnly>
        ?_rsc= রিকোয়েস্টটা কী?
      </H2>

      <p>
        রাত ৮:৪৫। ভুলু ভাই DevTools-এর Network Tab খুলে চোখ বড় বড় করে তাকিয়ে আছেন। পেজ
        রিফ্রেশ না করে লিংকে ক্লিক করলে কোনো নতুন <code>.html</code> ফাইল আসছে না — তার
        বদলে <code>?_rsc=...</code> নামের একটি কল থেকে অদ্ভুত টেক্সট নামছে:{" "}
        <code>{`0:["$","$L1",null,{"children":[...]}]`}</code>
      </p>

      <Line name="ভুলু ভাই">
        ফাহিম! নেক্সট-জেস কি পাগল হয়ে গেল নাকি? ক্লায়েন্ট-সাইড নেভিগেশনে কোনো HTML
        পাঠাচ্ছে না! একটা অদ্ভুত টেক্সট রেসপন্স আসছে। এটা কি নতুন ক্যাশিং টেকনিক, নাকি
        JSON?
      </Line>

      <Line name="ফাহিম">
        ভুলু ভাই! ওই ফরম্যাটটিই <strong>RSC Payload</strong>! প্রথমবার সাইটে ঢুকলে Next.js
        HTML + RSC Payload + Client JS — তিনটিই পাঠায়। কিন্তু পরে লিংকে ক্লিক করে পেজ
        বদলালে ফুল HTML না পাঠিয়ে শুধু এই হালকা Payload টুকু পাঠায়!
      </Line>

      <Line name="নেক্সট-ভাই">
        নিখুঁত! App Router আর্কিটেকচারে React ব্রাউজারে UI ও ডেটা পাঠাতে ৩টি ভিন্ন মিডিয়াম
        ব্যবহার করে। এদের পার্থক্য না বুঝলে পারফরম্যান্স টিউনিং করা অসম্ভব।
      </Line>

      {/* ── Matrix ────────────────────────────────────────────────────── */}
      <H2 id="matrix">১. HTML বনাম RSC Payload বনাম Client JavaScript</H2>

      <Table
        head={["বৈশিষ্ট্য", "HTML", "RSC Payload", "Client JavaScript"]}
        rows={[
          [
            "আসল কাজ",
            "প্রথম পেইন্ট (FCP) ও SEO ইন্ডেক্সিং",
            "React vDOM ট্রি ও প্রপ্স স্ট্রাকচার ক্লায়েন্টে স্ট্রিম করা",
            "ইন্টারঅ্যাক্টিভিটি, ইভেন্ট লিসেনার ও ক্লায়েন্ট স্টেট",
          ],
          [
            "ফরম্যাট",
            <>
              স্ট্যান্ডার্ড markup (<code>&lt;div&gt;...&lt;/div&gt;</code>)
            </>,
            <>
              সিরিয়ালাইজড স্ট্রিম গ্রাফ (<code>0:[&quot;$&quot;,&quot;div&quot;,...]</code>)
            </>,
            <>
              মিনিফাইড বান্ডল (<code>.js</code>)
            </>,
          ],
          [
            "কখন পাঠানো হয়",
            "শুধু initial full page load / রিফ্রেশে",
            "Initial load-এ (স্ক্রিপ্ট ট্যাগে) এবং প্রতিটি client navigation-এ",
            "প্রথম লোডে একবার; পরে ক্যাশে থেকে",
          ],
          [
            "পারফরম্যান্স ইমপ্যাক্ট",
            "দ্রুত দৃশ্যমান UI, কিন্তু ইন্টারঅ্যাক্টিভিটি নেই",
            "অত্যন্ত হালকা, নেটওয়ার্কে চাপ কম",
            "সাইজ বাড়লে হাইড্রেশন ধীর ও TBT বাড়ে",
          ],
        ]}
      />

      {/* ── Payload demo ──────────────────────────────────────────────── */}
      <H2 id="payload-demo">২. Payload দেখতে কেমন</H2>

      <CodeBlock filename="components/ui/counter-client.tsx">{`// 🟢 components/ui/counter-client.tsx
'use client';

import { useState } from 'react';

export function CounterClient({ initialCount }: { initialCount: number }) {
  const [count, setCount] = useState(initialCount);

  return (
    <button
      onClick={() => setCount(count + 1)}
      className="px-3 py-1 bg-emerald-600 text-white rounded text-xs"
    >
      Clicked: {count}
    </button>
  );
}`}</CodeBlock>

      <CodeBlock filename="app/analytics/page.tsx">{`// 🟢 app/analytics/page.tsx (server component)
import { CounterClient } from '@/components/ui/counter-client';

async function getVisitorCount() {
  return 1250; // simulated DB query
}

export default async function AnalyticsPage() {
  const count = await getVisitorCount();

  return (
    <main className="p-6 bg-slate-950 text-slate-100 rounded-xl space-y-4">
      <h1 className="text-xl font-bold text-emerald-400">Analytics Dashboard</h1>
      <p className="text-xs text-slate-400">Server rendered metrics</p>

      {/* Server component passing props to a client component */}
      <CounterClient initialCount={count} />
    </main>
  );
}`}</CodeBlock>

      <H3>নেটওয়ার্কে যা যায় (সরলীকৃত)</H3>

      <CodeBlock label="Plaintext" filename="rsc-payload.txt">{`// 1. The HTML structure generated on the server
0:["$","main",null,{"className":"p-6 bg-slate-950 ...","children":[
  ["$","h1",null,{"className":"text-xl font-bold text-emerald-400","children":"Analytics Dashboard"}],
  ["$","p",null,{"className":"text-xs text-slate-400","children":"Server rendered metrics"}],

  // 2. Client component marker ($L1) plus the props it receives
  ["$","$L1",null,{"initialCount":1250}]
]}]

// 3. Module reference mapping for that client component
1:I["./components/ui/counter-client.tsx",["app/analytics/page","client-chunk"],"CounterClient"]`}</CodeBlock>

      <Note>
        <p>
          লক্ষ করো — সার্ভার কম্পোনেন্টের <em>কোড</em> কোথাও নেই, শুধু তার{" "}
          <em>আউটপুট</em> আছে। ক্লায়েন্ট কম্পোনেন্টের ক্ষেত্রে উল্টো: কোড আলাদা চাঙ্কে থাকে,
          Payload-এ শুধু তার রেফারেন্স আর প্রপ্স।
        </p>
      </Note>

      {/* ── Execution flow ────────────────────────────────────────────── */}
      <H2 id="execution-flow">৩. Initial Load বনাম Soft Navigation</H2>

      <Diagram>{`1) INITIAL PAGE LOAD (hard refresh / direct URL entry)
   ┌────────────────────────────────────────────────────────────────────┐
   │ SERVER: executes server components ──> HTML + RSC Payload          │
   └──────────────────────────────────┬─────────────────────────────────┘
                                      │ HTTP response
                                      v
   ┌────────────────────────────────────────────────────────────────────┐
   │ BROWSER:                                                           │
   │ 1. paints the HTML instantly      (fast first paint / SEO ready)   │
   │ 2. downloads the client JS bundles                                 │
   │ 3. uses the RSC Payload to hydrate clients & attach listeners      │
   └────────────────────────────────────────────────────────────────────┘

─────────────────────────────────────────────────────────────────────────

2) CLIENT NAVIGATION (user clicks <Link href="/analytics">)
   ┌────────────────────────────────────────────────────────────────────┐
   │ BROWSER: requests the next route with an RSC header                │
   └──────────────────────────────────┬─────────────────────────────────┘
                                      │ GET /analytics?_rsc=xyz
                                      v
   ┌────────────────────────────────────────────────────────────────────┐
   │ SERVER: runs server components only ──> streams the RSC Payload    │
   └──────────────────────────────────┬─────────────────────────────────┘
                                      │ text stream
                                      v
   ┌────────────────────────────────────────────────────────────────────┐
   │ BROWSER: React reconciles the DOM straight from the payload        │
   │ NO full HTML reload   |   NO re-fetching of existing client JS     │
   └────────────────────────────────────────────────────────────────────┘`}</Diagram>

      <Line name="ভুলু ভাই">
        ওহ্ ভাইরে ভাই! এবার ক্লিয়ার! প্রথমবার ফাস্ট স্ক্রিনের জন্য HTML, আর নেভিগেশনে পুরো
        HTML না এনে শুধু ছোট RSC Payload দিয়ে vDOM আপডেট — এজন্যই App Router-এ পেজ
        ট্রানজিশন এত ফাস্ট!
      </Line>

      {/* ── Takeaways ─────────────────────────────────────────────────── */}
      <H2 id="takeaway">Production Takeaways</H2>

      <Note>
        <ul>
          <li>
            <strong>Inspect the payload:</strong> Network ট্যাবে Fetch ফিল্টার দিয়ে{" "}
            <code>_rsc</code> প্যারামিটারযুক্ত রিকোয়েস্টের রেসপন্স দেখো — অপ্রয়োজনীয় বড়
            অবজেক্ট প্রপ্সে পাঠালে Payload ফুলে গিয়ে নেভিগেশন ধীর হয়।
          </li>
          <li>
            <strong>Pass serializable DTOs only:</strong> Payload শুধু সিরিয়ালাইজেবল ডেটা
            এনকোড করতে পারে — ফাংশন বা ক্লাস ইনস্ট্যান্স নয়।
          </li>
          <li>
            <strong>Leverage progressive streaming:</strong> ডেটা আসতে দেরি হলে{" "}
            <code>&lt;Suspense&gt;</code> দিয়ে Payload চাঙ্ক আকারে স্ট্রিম করাও — বাকি পেজ
            সঙ্গে সঙ্গে দেখা যাবে।
          </li>
          <li>
            <strong>HTML আর Payload প্রতিদ্বন্দ্বী নয়:</strong> প্রথম লোডে দুটোই দরকার — HTML
            চোখের জন্য, Payload React-এর জন্য।
          </li>
        </ul>
      </Note>
    </article>
  );
}
