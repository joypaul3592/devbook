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
      bn: "৬৫০ KB বান্ডেল আর ৪টি ঝুলন্ত রিকোয়েস্ট",
      en: "A 650 KB bundle and four hanging requests",
    },
  },
  {
    id: "architecture",
    label: { bn: "RSC এক্সিকিউশন পাইপলাইন", en: "The RSC execution pipeline" },
  },
  {
    id: "foundations",
    label: { bn: "RSC-এর ৪টি স্তম্ভ", en: "Four pillars of RSC" },
  },
  {
    id: "implementation",
    label: {
      bn: "Client-heavy বনাম Pure RSC",
      en: "Client-heavy vs pure RSC",
    },
  },
  {
    id: "matrix",
    label: { bn: "Comparison Matrix", en: "Comparison matrix" },
  },
  {
    id: "takeaway",
    label: { bn: "Production Takeaways", en: "Production takeaways" },
  },
];

export default function ReactServerComponents() {
  return (
    <article className="doc-prose">
      {/* ── The problem ───────────────────────────────────────────────── */}
      <H2 id="the-problem" anchorOnly>
        ৬৫০ KB বান্ডেল আর ৪টি ঝুলন্ত রিকোয়েস্ট
      </H2>

      <p>
        রাত ৫:১৫। ভুলু ভাই একটি ডেটা ড্যাশবোর্ড বানাতে গিয়ে পুরো পেজে{" "}
        <code>&apos;use client&apos;</code> বসিয়ে দিয়েছেন। ব্রাউজার খুলতেই দেখা গেল JavaScript
        বান্ডেল সাইজ প্রায় <strong>৬৫০ KB</strong>! তার ওপর <code>moment</code> আর{" "}
        <code>marked</code> লাইব্রেরি ব্রাউজারে ডাউনলোড হচ্ছে, আর নেটওয়ার্ক ট্যাবে ৪টি আলাদা API
        রিকোয়েস্ট ঝুলে আছে।
      </p>

      <Line name="ভুলু ভাই">
        ফাহিম! Next.js 15 ব্যবহার করছি, তাও ব্রাউজারে এত ভারী JavaScript কেন যাচ্ছে? আর ডেটা ফেচ
        করতে গিয়ে ক্লায়েন্ট-সাইড <code>useEffect</code>-এর waterfall তৈরি হয়ে পেজ লোড হতে ৩ সেকেন্ড
        দেরি হচ্ছে কেন?
      </Line>

      <Line name="ফাহিম">
        ভুলু ভাই! আপনি পুরো পেজকে Client Component বানিয়ে ব্রাউজারে রান করাচ্ছেন, অথচ এই পেজের ৮০%
        অংশই ছিল স্ট্যাটিক বা রিড-অনলি ডেটা — যা সার্ভারেই রেন্ডার হওয়া উচিত ছিল।{" "}
        <strong>React Server Components (RSC)</strong>-এর মেন্টাল মডেলটাই এখানে মিস হয়ে গেছে।
      </Line>

      <Line name="নেক্সট-ভাই">
        একদম! RSC কোনো সাধারণ SSR নয়। এটি কম্পোনেন্টকে সার্ভারে এক্সিকিউট করে, ক্লায়েন্ট বান্ডেলে
        শূন্য বাইট যোগ করে, আর ব্রাউজারে JavaScript পাঠানোর বদলে <strong>RSC Payload</strong>{" "}
        (Flight protocol) দিয়ে UI স্ট্রিম করে।
      </Line>

      {/* ── Architecture ──────────────────────────────────────────────── */}
      <H2 id="architecture">১. RSC Execution Pipeline</H2>

      <Diagram>{`┌─────────────────────────────────────────────────────────────────────────┐
│              REACT SERVER COMPONENT (RSC) EXECUTION PIPELINE            │
└─────────────────────────────────────────────────────────────────────────┘

 [SERVER SIDE]
 ├── 1. Async Server Component executes (direct DB / file access)
 ├── 2. Heavy node modules (moment, marked) stay ONLY on the server
 └── 3. React renders the UI tree into the "RSC Payload" (Flight format)
        │
        ▼ (streams the Flight payload over the wire)
 [NETWORK] ──▶ zero component JS transferred for the server components
        │
        ▼
 [CLIENT SIDE (browser)]
 ├── 1. React receives the Flight payload stream
 ├── 2. Reconstructs the DOM tree without a full page reload
 └── 3. Hydrates ONLY the interactive islands ('use client' components)`}</Diagram>

      {/* ── Foundations ───────────────────────────────────────────────── */}
      <H2 id="foundations">২. RSC-এর ৪টি স্তম্ভ</H2>

      <Note>
        <ul>
          <li>
            <strong>Zero bundle size impact:</strong> সার্ভার কম্পোনেন্টের কোড, তার ডিপেন্ডেন্সি আর
            সিক্রেট এনভায়রনমেন্ট ভেরিয়েবল কখনোই ব্রাউজারে পৌঁছায় না। সার্ভারে ১০ MB-র পার্সিং
            লাইব্রেরি ব্যবহার করলেও ক্লায়েন্ট বান্ডেলে তার সাইজ ০ বাইট।
          </li>
          <li>
            <strong>Direct backend access:</strong> ডেটার জন্য আলাদা <code>/api/users</code> রুট
            বানিয়ে ক্লায়েন্ট থেকে <code>fetch</code> করার দরকার নেই। সার্ভার কম্পোনেন্ট নিজেই একটি{" "}
            <code>async</code> ফাংশন, যা সরাসরি PostgreSQL, MongoDB বা ORM (Prisma / Drizzle) থেকে
            কোয়েরি করতে পারে।
          </li>
          <li>
            <strong>Flight protocol (RSC payload):</strong> RSC সার্ভারে প্লেন HTML-ও বানায় না,
            ক্লায়েন্ট JavaScript-ও বানায় না — এটি তৈরি করে একটি স্পেশালাইজড স্ট্রিমেবল ফরম্যাট,
            যাতে DOM ট্রি-র নির্দেশনা আর Client Component-এর রেফারেন্স প্লেসহোল্ডার থাকে।
          </li>
          <li>
            <strong>The client/server boundary:</strong> <code>&apos;use client&apos;</code> মানে
            &quot;এই কম্পোনেন্টটি শুধু ক্লায়েন্টে চলবে&quot; নয় — এটি একটি{" "}
            <strong>import boundary</strong>। এর নিচের সব কম্পোনেন্ট ক্লায়েন্ট বান্ডেলে যুক্ত হবে,
            তাই বাউন্ডারি যত গভীরে (leaf node) রাখা যায় তত ভালো।
          </li>
        </ul>
      </Note>

      {/* ── Implementation ────────────────────────────────────────────── */}
      <H2 id="implementation">৩. Client-heavy বনাম Pure RSC</H2>

      <H3>❌ Anti-pattern — পুরো পেজ ক্লায়েন্ট কম্পোনেন্ট</H3>

      <CodeBlock filename="app/dashboard/bad-page.tsx">{`'use client';

import { useState, useEffect } from 'react';
import moment from 'moment';    // ~300 KB shipped to the browser
import { marked } from 'marked'; // heavy parser shipped to the browser

export default function BadDashboard() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Network waterfall: parse the JS bundle first, only then fetch
    fetch('/api/analytics')
      .then((res) => res.json())
      .then((d) => {
        setData(d);
        setLoading(false);
      });
  }, []);

  if (loading) return <div>Loading...</div>;

  return (
    <div className="p-6">
      <h1>{data.title}</h1>
      {/* Formatting on the client using a heavy library */}
      <p>Date: {moment(data.createdAt).format('LLLL')}</p>
      <div dangerouslySetInnerHTML={{ __html: marked.parse(data.content) }} />
    </div>
  );
}`}</CodeBlock>

      <H3>🟢 Fix — pure RSC + একটি ছোট client island</H3>

      <CodeBlock filename="app/dashboard/_components/like-button.tsx">{`'use client';

import { useState } from 'react';

// Only the interactive logic lives in the client bundle
export function LikeButton({ initialLikes }: { initialLikes: number }) {
  const [likes, setLikes] = useState(initialLikes);

  return (
    <button
      onClick={() => setLikes((prev) => prev + 1)}
      className="px-3 py-1.5 bg-emerald-600 text-white rounded-lg text-sm font-medium hover:bg-emerald-500 transition"
    >
      👍 {likes} Likes
    </button>
  );
}`}</CodeBlock>

      <CodeBlock filename="app/dashboard/page.tsx">{`import 'server-only';          // this module can never leak to the client
import moment from 'moment';    // executes only on the server — 0 KB client cost
import { marked } from 'marked';
import { db } from '@/lib/db';  // direct database access
import { LikeButton } from './_components/like-button';

async function getArticle() {
  // Direct query — no intermediate API route
  return db.article.findFirst({ where: { status: 'PUBLISHED' } });
}

export default async function PureRscPage() {
  const data = await getArticle();
  if (!data) return <div>No data found</div>;

  // Formatting and markdown parsing happen server-side
  const formattedDate = moment(data.createdAt).format('LLLL');
  const htmlContent = marked.parse(data.content);

  return (
    <main className="max-w-2xl mx-auto p-6 space-y-6 text-slate-100">
      <div className="border border-slate-800 p-6 rounded-2xl bg-slate-900 space-y-4">
        <h1 className="text-2xl font-bold">{data.title}</h1>
        <p className="text-xs text-slate-400 font-mono">Published: {formattedDate}</p>

        <article
          className="prose prose-invert max-w-none text-slate-300"
          dangerouslySetInnerHTML={{ __html: htmlContent }}
        />

        {/* A client boundary nested inside the server component */}
        <div className="pt-4 border-t border-slate-800">
          <LikeButton initialLikes={data.likesCount} />
        </div>
      </div>
    </main>
  );
}`}</CodeBlock>

      {/* ── Matrix ────────────────────────────────────────────────────── */}
      <H2 id="matrix">৪. CSR বনাম SSR বনাম RSC</H2>

      <Table
        head={[
          "বৈশিষ্ট্য",
          <>
            CSR (<code>&apos;use client&apos;</code>)
          </>,
          "Traditional SSR",
          "React Server Component",
        ]}
        rows={[
          [
            "JS bundle impact",
            "হাই — পুরো কোড ব্রাউজারে যায়",
            "হাই — হাইড্রেশনের জন্য কোড ব্রাউজারে যায়",
            <>
              শূন্য — শুধু <code>&apos;use client&apos;</code> অংশটুকু যায়
            </>,
          ],
          [
            "Data access",
            "Client fetch / SWR / React Query",
            <>
              <code>getServerSideProps</code>
            </>,
            "সরাসরি DB / ORM / server-only মডিউল",
          ],
          [
            "Interactivity",
            <>
              <code>useState</code>, ইভেন্ট হ্যান্ডলার — সব চলে
            </>,
            "চলে (হাইড্রেশনের পর)",
            "চলে না — pure data/UI কম্পোনেন্ট",
          ],
          [
            "Streaming output",
            "প্রযোজ্য নয়",
            "পুরো পেজের HTML একসাথে",
            "RSC payload chunk by chunk",
          ],
        ]}
      />

      <Line name="ভুলু ভাই">
        অসাধারণ! ভারী লাইব্রেরিগুলো সার্ভারেই এক্সিকিউট হয়ে যাচ্ছে আর ব্রাউজারে শুধু লাইটওয়েট UI আর
        দরকারি বাটনটুকু যাচ্ছে — বান্ডেল ৬৫০ KB থেকে নেমে ২০ KB!
      </Line>

      {/* ── Takeaways ─────────────────────────────────────────────────── */}
      <H2 id="takeaway">Production Takeaways</H2>

      <Note>
        <ul>
          <li>
            <strong>Default to RSC:</strong> <code>app/</code> ডিরেক্টরির প্রতিটি ফাইল
            ডিফল্টভাবেই Server Component। স্টেট বা ইভেন্ট লিসেনার না লাগলে{" "}
            <code>&apos;use client&apos;</code> লিখবেন না।
          </li>
          <li>
            <strong>Push the boundary to leaf nodes:</strong> পেজের টপ লেভেলে{" "}
            <code>&apos;use client&apos;</code> না বসিয়ে ইন্টারঅ্যাক্টিভ ছোট অংশগুলো আলাদা ফাইলে
            নিয়ে সেখানে ডিরেক্টিভ দিন।
          </li>
          <li>
            <strong>
              Guard with <code>server-only</code>:
            </strong>{" "}
            যেসব ইউটিলে ডেটাবেস সিক্রেট বা ভারী সার্ভার কোড আছে সেখানে{" "}
            <code>import &apos;server-only&apos;</code> রাখুন — ভুলে ক্লায়েন্টে ইম্পোর্ট হলে
            বিল্ড-টাইমেই এরর দেবে।
          </li>
        </ul>
      </Note>
    </article>
  );
}
