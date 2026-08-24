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
      bn: "ডেটাবেস বন্ধ, তবু পেজ লোড হয়",
      en: "The database is off, the page still loads",
    },
  },
  {
    id: "architecture",
    label: {
      bn: "Build & Serve ফ্লো",
      en: "Build and serve flow",
    },
  },
  {
    id: "detection",
    label: {
      bn: "কীভাবে একটি পেজ Static হয়?",
      en: "How a page becomes static",
    },
  },
  {
    id: "implementation",
    label: {
      bn: "generateStaticParams দিয়ে ব্লগ রুট",
      en: "A blog route with generateStaticParams",
    },
  },
  {
    id: "matrix",
    label: { bn: "Static Rendering Metrics", en: "Static rendering metrics" },
  },
  {
    id: "takeaway",
    label: { bn: "Production Takeaways", en: "Production takeaways" },
  },
];

export default function StaticRenderingArchitecture() {
  return (
    <article className="doc-prose">
      {/* ── The problem ───────────────────────────────────────────────── */}
      <H2 id="the-problem" anchorOnly>
        ডেটাবেস বন্ধ, তবু পেজ লোড হয়
      </H2>

      <p>
        সকাল ১০:১৫। ভুলু ভাই একটি পোর্টফোলিও ও প্রোডাক্ট ক্যাটালগ সাইট প্রোডাকশনে ডেপ্লয়
        করেছেন। ডেপ্লয়মেন্ট লগে দেখলেন বেশ কিছু রো-এর পাশে <code>○ (Static)</code> লেখা উঠে
        এসেছে। লাইভ সাইট ওপেন করে তিনি তাজ্জব — পেজে ক্লিক করতেই চোখের পলকে পুরো সাইট লোড হয়ে
        যাচ্ছে!
      </p>

      <Line name="ভুলু ভাই">
        ফাহিম! এ তো জাদুকরী স্পিড! আমি ব্রাউজার রিফ্রেশ দেওয়ার আগেই পেজ ওপেন হয়ে যাচ্ছে! কিন্তু
        ব্যাকএন্ড ডেটাবেস বন্ধ রেখেও চেক করলাম — পেজগুলো ঠিকই পারফেক্টলি লোড হচ্ছে! Next.js কি
        ডেটাবেস ছাড়াই জাদুবলে ডেটা এনে দেখাচ্ছে?
      </Line>

      <Line name="ফাহিম">
        ভুলু ভাই, এটা জাদু না — এটাকে বলে <strong>Static Rendering Architecture</strong>। আপনি
        যখন <code>next build</code> দেন, Next.js সার্ভার কম্পোনেন্টগুলো রান করে ডেটাবেস থেকে
        ডেটা এনে আগেই HTML ও RSC Payload ফাইল তৈরি করে ডিস্কে জমিয়ে রাখে। ইউজার হিট করলে সার্ভারে
        কোনো কোড বা ডেটাবেস কোয়েরি চলে না — সোজা ক্যাশ করা HTML ব্রাউজারে চলে যায়।
      </Line>

      <Line name="নেক্সট-ভাই">
        একদম! App Router-এর প্রধান পাওয়ার হাউস হলো এই Static Rendering, যাকে{" "}
        <strong>Build-Time Prerendering</strong>-ও বলা হয়।
      </Line>

      {/* ── Architecture ──────────────────────────────────────────────── */}
      <H2 id="architecture">১. Static Rendering Build &amp; Serve Flow</H2>

      <Diagram>{`┌─────────────────────────────────────────────────────────────────────────┐
│                    STATIC RENDERING BUILD & SERVE FLOW                  │
└─────────────────────────────────────────────────────────────────────────┘
                                     │
  【 STEP 1: BUILD TIME (next build) 】
  • Server components execute once
  • Database / API fetching completed
  • Generates static HTML + RSC payload (.rsc)
                                     │
                                     ▼
  【 STEP 2: CDN / EDGE DEPLOYMENT 】
  • Files stored in CDN edge storage / blob store
                                     │
                                     ▼
  【 STEP 3: USER RUNTIME REQUEST 】
  • User requests GET /blog/nextjs-architecture
  • CDN serves the pre-rendered HTML instantly (TTFB ~5ms)
  • ZERO database hit | ZERO server CPU execution`}</Diagram>

      {/* ── Detection ─────────────────────────────────────────────────── */}
      <H2 id="detection">২. Next.js কীভাবে একটি পেজকে Static ধরে?</H2>

      <p>
        Next.js-এর অটোমেটিক স্ট্যাটিক অপটিমাইজেশন ইঞ্জিন বুদ্ধিমান। একটি পেজ স্ট্যাটিক হতে হলে
        দুটি শর্ত পূরণ হতে হয়:
      </p>

      <Note>
        <ul>
          <li>
            <strong>No dynamic functions:</strong> পেজে কোনো রানটাইম ডাইনামিক ফাংশন —{" "}
            <code>cookies()</code>, <code>headers()</code> বা <code>searchParams</code> —
            ব্যবহার করা যাবে না, কারণ ইউজারভেদে এগুলো প্রতি রিকোয়েস্টে বদলায়।
          </li>
          <li>
            <strong>Deterministic params:</strong> রুটটি ডাইনামিক হলে (যেমন{" "}
            <code>app/blog/[slug]/page.tsx</code>) <code>generateStaticParams()</code> দিয়ে
            সবগুলো স্লাগ বিল্ড টাইমে আগেই জানিয়ে দিতে হবে।
          </li>
        </ul>
      </Note>

      {/* ── Implementation ────────────────────────────────────────────── */}
      <H2 id="implementation">৩. generateStaticParams দিয়ে স্ট্যাটিক ব্লগ রুট</H2>

      <H3>বিল্ড টাইমেই সব পেজের HTML তৈরি</H3>

      <CodeBlock filename="app/blog/[slug]/page.tsx">{`import { notFound } from 'next/navigation';

interface PageProps {
  params: Promise<{ slug: string }>;
}

// 1. Tell Next.js every dynamic path to pre-render at BUILD TIME
export async function generateStaticParams() {
  const posts = await fetchAllPostSlugsFromDB();

  return posts.map((post) => ({
    slug: post.slug,
  }));
}

// Simulated DB call — executes ONLY during \`next build\`
async function fetchAllPostSlugsFromDB() {
  return [
    { slug: 'nextjs-architecture' },
    { slug: 'static-rendering-guide' },
    { slug: 'server-components' },
  ];
}

async function getPostContent(slug: string) {
  const posts: Record<string, { title: string; content: string }> = {
    'nextjs-architecture': {
      title: 'Mastering Next.js Architecture',
      content: 'Static rendering brings near-zero TTFB and maximum security.',
    },
    'static-rendering-guide': {
      title: 'Complete Static Rendering Guide',
      content: 'Pre-rendering HTML at build time scales effortlessly.',
    },
  };

  return posts[slug] || null;
}

// 2. Server component rendered completely at build time
export default async function BlogPostPage({ params }: PageProps) {
  const { slug } = await params;
  const post = await getPostContent(slug);

  if (!post) {
    notFound();
  }

  return (
    <article className="max-w-3xl mx-auto py-12 px-4 text-slate-100">
      <div className="border-b border-slate-800 pb-4 mb-6">
        <span className="text-xs font-mono text-emerald-400 bg-emerald-500/10 px-2 py-1 rounded">
          Static Pre-rendered
        </span>
        <h1 className="text-3xl font-bold mt-2">{post.title}</h1>
      </div>

      <div className="prose prose-invert text-slate-300 leading-relaxed">
        <p>{post.content}</p>
      </div>
    </article>
  );
}`}</CodeBlock>

      {/* ── Matrix ────────────────────────────────────────────────────── */}
      <H2 id="matrix">৪. Static Rendering Metric Matrix</H2>

      <Table
        head={["ডাইমেনশন", "Static Rendering বিহেভিয়ার"]}
        rows={[
          [
            "Execution time",
            <>
              Build time — <code>next build</code> চলাকালীন একবার রান হয়
            </>,
          ],
          [
            "TTFB",
            "অত্যন্ত দ্রুত (~১–১০ms), কারণ CDN থেকে প্রি-বিল্ড ফাইল সার্ভ হয়",
          ],
          [
            "Server resource cost",
            "প্রায় শূন্য — কোনো Node.js সার্ভার এক্সিকিউশন লাগে না",
          ],
          ["Database load", "রানটাইমে ডেটাবেসের ওপর ০% চাপ"],
          [
            "Best use cases",
            "ল্যান্ডিং পেজ, ব্লগ, ক্যাটালগ, ডকুমেন্টেশন, মার্কেটিং পেজ",
          ],
        ]}
      />

      <Line name="ভুলু ভাই">
        অসাধারণ! এখন বুঝলাম কেন বিল্ড দেওয়ার সময় টার্মিনালে <code>○ (Static)</code> দেখায়। যেসব
        পেজের ডেটা ঘনঘন বদলায় না, সেগুলোকে বিল্ড টাইমে HTML বানিয়ে রাখার মতো পাওয়ারফুল আর কিছুই
        নেই!
      </Line>

      {/* ── Takeaways ─────────────────────────────────────────────────── */}
      <H2 id="takeaway">Production Takeaways</H2>

      <Note>
        <ul>
          <li>
            <strong>Default to static first:</strong> যেসব পেজ ইউজারের ব্যক্তিগত তথ্যের ওপর
            নির্ভরশীল নয় (ল্যান্ডিং পেজ, প্রাইভেসি পলিসি, ব্লগ), সেগুলো সবসময় স্ট্যাটিক রাখুন —
            সার্ভার কস্ট ও লেটেন্সি নাটকীয়ভাবে কমে।
          </li>
          <li>
            <strong>Combine with CDN caching:</strong> স্ট্যাটিক ফাইল সরাসরি Edge CDN থেকে
            ডেলিভারি হওয়ায় ট্রাফিক স্পাইকেও অরিজিন সার্ভারে চাপ পড়ে না।
          </li>
          <li>
            <strong>generateStaticParams for dynamic slugs:</strong> ডাইনামিক রুটে এটি ব্যবহার না
            করলে Next.js পেজটিকে বিল্ড টাইমে স্ট্যাটিক না বানিয়ে অন-ডিমান্ড ডাইনামিক বানিয়ে দেবে।
          </li>
        </ul>
      </Note>
    </article>
  );
}
