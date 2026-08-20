import { CodeBlock, Diagram, H2, Line, Note } from "@/components/learn/DocParts";
import type { Bi } from "@/lib/curriculum";

/** Section anchors — consumed by the "on this page" rail. */
export const headings: { id: string; label: Bi }[] = [
  {
    id: "the-escalation",
    label: { bn: "এক কুকিতে পুরো ক্যাশ উধাও", en: "One cookie, cache gone" },
  },
  {
    id: "why-escalates",
    label: { bn: "কেন এসকেলেট করে", en: "Why it escalates" },
  },
  {
    id: "suspense-isolation",
    label: { bn: "১. Suspense দিয়ে স্কোপ আইসোলেশন", en: "1. Scope isolation with Suspense" },
  },
  {
    id: "searchparams",
    label: { bn: "২. searchParams আইসোলেশন", en: "2. Isolating searchParams" },
  },
  {
    id: "component-cache",
    label: { bn: "৩. কম্পোনেন্ট-লেভেল 'use cache'", en: "3. Component-level 'use cache'" },
  },
  {
    id: "takeaway",
    label: { bn: "Production Takeaways", en: "Production takeaways" },
  },
];

export default function DynamicEscalation() {
  return (
    <article className="doc-prose">
      {/* ── The escalation ────────────────────────────────────────────── */}
      <H2 id="the-escalation" anchorOnly>
        এক কুকিতে পুরো ক্যাশ উধাও
      </H2>

      <p>
        বিকেলের শেষ ভাগ। ভুলু ভাই হঠাৎ ল্যাপটপের টার্মিনালে বিল্ড আউটপুট (
        <code>next build</code>) দেখে মাথায় হাত দিয়ে বসে আছেন!
      </p>

      <Line name="ভুলু ভাই">
        নেক্সট-ভাই! মেজাজটা একবারে খারাপ হয়ে গেল! আমি এত কষ্ট করে আমার ল্যান্ডিং পেজ আর
        প্রোডাক্ট পেজগুলোকে <code>&apos;use cache&apos;</code> আর{" "}
        <code>cacheLife()</code> দিয়ে একদম রকেট স্পিডে ক্যাশ করলাম। কিন্তু যেই না হেডার
        কম্পোনেন্টের ভেতরে ইউজারের কারেন্ট কান্ট্রি চেক করার জন্য <code>headers()</code>{" "}
        বা কুকি থেকে সেশন নেওয়ার জন্য <code>cookies()</code> ডাকলাম — আমার পুরো পেজ
        স্ট্যাটিক/ক্যাশড থেকে রাতারাতি Dynamic (ƒ)-এ এসকেলেট করে গেল! বিল্ড লগে দেখাচ্ছে
        ক্যাশ বাইপাস হয়ে প্রতি রিকোয়েস্টে পেজ নতুন করে রেন্ডার হচ্ছে! একটা সামান্য কুকি
        রিড করার জন্য পুরো পেজের ক্যাশ উধাও হয়ে যাবে?!
      </Line>

      <Line name="নেক্সট-ভাই">
        (হেসে কফিতে চুমুক দিয়ে) হা হা! ভুলু, তুই তো Next.js-এর সবচেয়ে বড় ক্যাশিং ট্র্যাপ
        — <strong>&quot;Dynamic Functions Escalation&quot;</strong>-এ পা দিয়েছিস!
      </Line>

      {/* ── Why escalates ─────────────────────────────────────────────── */}
      <H2 id="why-escalates">১. কেন এসকেলেট করে</H2>

      <Line name="ভুলু ভাই">
        (হতাশ হয়ে) ট্র্যাপ মানে ভাই?! <code>cookies()</code>, <code>headers()</code>, বা{" "}
        <code>searchParams</code> — এগুলো তো আমাদের হরহামেশাই লাগে! এগুলো ডাকলেই কি পুরো
        পেজ ক্যাশ অপ্ট-আউট করে ফেলবে?
      </Line>

      <Line name="নেক্সট-ভাই">
        ব্যাকগ্রাউন্ডের মেকানিজমটা শোন! Next.js যখন দেখে তুই পেজের ভেতরে কোনো Dynamic
        Function ডেকেছিস, তখন সার্ভার ধরে নেয়: &quot;আরে! এই পেজের কন্টেন্ট তো
        রিকোয়েস্ট-টাইম ডাটার ওপর নির্ভর করছে, যা প্রতি ইউজারের জন্য আলাদা হতে পারে।&quot;
        ফলে সার্ভার কোনো ঝুঁকি না নিয়ে পুরো পেজ লেয়ারের স্ট্যাটিক রেন্ডারিং বন্ধ করে দেয়
        এবং রিকোয়েস্টটাকে Dynamic Server-side Rendering-এ এসকেলেট করে দেয়!
      </Line>

      <Diagram>{`[Static / Cached Route] ──(Calls cookies() or headers())──► 🚨 Escalates to Dynamic Route!
                                                                      │
                                                                      ▼
                                                       Full Page Cache Opt-Out 💥`}</Diagram>

      <Line name="ভুলু ভাই">
        (চিন্তিত হয়ে) কিন্তু ভাই, আমার প্রোডাক্টের ডেসক্রিপশন, ইমেজ, প্রাইস — এগুলো তো
        সবার জন্যই সেম! শুধু হেডারের ছোট একটা কোণায় ইউজারের সেশন নাম বা কারেন্সি দেখানোর
        জন্য <code>cookies()</code> ডেকেছি! এটার জন্য পুরো পেজের ক্যাশিং বাদ দিয়ে
        ডাটাবেজে হিট মারা তো চরম বোকামি!
      </Line>

      <Line name="নেক্সট-ভাই">
        একদম খাঁটি কথা! এই আর্কিটেকচারাল বটলনেক সলভ করার জন্য তোকে{" "}
        <strong>Dynamic Scope Isolation</strong> শিখতে হবে।
      </Line>

      {/* ── Suspense isolation ────────────────────────────────────────── */}
      <H2 id="suspense-isolation">২. Suspense দিয়ে স্কোপ আইসোলেশন</H2>

      <Line name="নেক্সট-ভাই">
        কখনো পুরো পেজ বা প্যারেন্ট সার্ভার কম্পোনেন্টের টপ-লেভেলে <code>cookies()</code>,{" "}
        <code>headers()</code>, বা <code>searchParams</code> ডাকবি না! যে ছোট
        কম্পোনেন্টটুকুর সত্যি সত্যি রিকোয়েস্ট ডাটা লাগে, ডায়নামিক ফাংশনগুলোকে ঠিক সেই
        কম্পোনেন্টের ভেতরে আইসোলেট করে রাখবি এবং তাকে <code>&lt;Suspense&gt;</code> দিয়ে
        মুড়িয়ে দিবি!
      </Line>

      <CodeBlock filename="app/products/[slug]/page.tsx">{`// ❌ BAD: Top-level Dynamic Function Call (Breaks Page Cache)
export default async function ProductPage() {
  const userCookie = await cookies(); // 🚨 Whole Page Escalates to Dynamic!
  const product = await getProductData();

  return (
    <div>
      <Header user={userCookie} />
      <ProductDetails product={product} />
    </div>
  );
}

// ✅ GOOD: Isolated Dynamic Component Boundary
export default async function ProductPage() {
  // ⚡ Page remains Cached & Static!
  const product = await getProductData();

  return (
    <div>
      {/* Dynamic Function inside Suspense Boundary */}
      <Suspense fallback={<HeaderSkeleton />}>
        <DynamicUserHeader />
      </Suspense>
      <ProductDetails product={product} />
    </div>
  );
}

// app/components/DynamicUserHeader.tsx
async function DynamicUserHeader() {
  const cookieStore = await cookies(); // ⚡ Dynamic Scope Isolated Here Only!
  const user = cookieStore.get('session');
  return <UserAvatar user={user} />;
}`}</CodeBlock>

      <Line name="ভুলু ভাই">
        (চোখ বড় বড় করে) ওরে জোস! তারমানে <code>ProductDetails</code> আর পুরো পেজটা ক্যাশড
        আর স্ট্যাটিকই থেকে গেল, আর শুধু <code>DynamicUserHeader</code> টুকু স্ট্রিম হয়ে
        রিকোয়েস্ট টাইমে আলাদা লোড হলো?!
      </Line>

      <Line name="নেক্সট-ভাই">একদম বিঙ্গো!</Line>

      {/* ── searchParams ──────────────────────────────────────────────── */}
      <H2 id="searchparams">৩. searchParams আইসোলেশন</H2>

      <Line name="ভুলু ভাই">
        নেক্সট-ভাই! আরেকটা ঝামেলা হয় <code>searchParams</code> নিয়ে! পেজে ফিল্টারিং বা
        পেজিনেশনের জন্য <code>?page=2&amp;sort=asc</code> ধরলেই তো পুরো পেজ ডায়নামিক হয়ে
        যায়! সেটার উপায় কী?
      </Line>

      <Line name="নেক্সট-ভাই">
        সেটার জন্য পেজের প্রপস থেকে সরাসরি <code>searchParams</code> রিড না করে ক্লায়েন্ট
        সাইডে <code>useSearchParams()</code> হুক ব্যবহার করবি, এবং সেই কম্পোনেন্টকে{" "}
        <code>&lt;Suspense&gt;</code> দিয়ে র‍্যাপ করবি! এতে সার্ভারের মূল ক্যাশড রেন্ডারে
        কোনো ধাক্কা লাগবে না।
      </Line>

      {/* ── Component-level cache ─────────────────────────────────────── */}
      <H2 id="component-cache">৪. কম্পোনেন্ট-লেভেল &apos;use cache&apos;</H2>

      <Line name="ভুলু ভাই">
        আর Next.js 16-এর Dynamic I/O আর্কিটেকচারে এটাকে কীভাবে হ্যান্ডেল করে ভাই?
      </Line>

      <Line name="নেক্সট-ভাই">
        Next.js 16-এ আর্কিটেকচার আরও স্মার্ট! তুই কোনো ডায়নামিক ফাংশনের সাথে{" "}
        <code>&apos;use cache&apos;</code> মেশাতে পারবি না। কিন্তু তুই চাইলে কোনো একটা
        নির্দিষ্ট Async Component-এর ওপর <code>&apos;use cache&apos;</code> বসিয়ে ওই
        কম্পোনেন্ট ট্রি-র ভেতরের ডাটা ফেচ ক্যাশ করে ফেলতে পারিস — এমনকি তার প্যারেন্টে
        ডায়নামিক ফাংশন থাকলেও!
      </Line>

      <CodeBlock filename="app/components/CachedProductInfo.tsx">{`// Next.js 16 Component-Level Cache Isolation
async function CachedProductInfo({ id }: { id: string }) {
  'use cache'; // ⚡ Component-level Caching Boundary
  cacheTag(\`product-\${id}\`);

  const data = await db.product.findUnique({ where: { id } });
  return <section>{data.description}</section>;
}`}</CodeBlock>

      <Note>
        <p>
          মনে রাখার নিয়মটা সহজ: ডায়নামিক জিনিস যত <strong>নিচে</strong> নামানো যায়, আর
          ক্যাশড জিনিস যত <strong>ভেতরে</strong> মোড়া যায় — স্ট্যাটিক অংশ তত বড় থাকে।
        </p>
      </Note>

      <Line name="ভুলু ভাই">
        (ল্যাপটপের কোড রিফ্যাক্টর করতে করতে) আহা! এবার শান্তিতে নিশ্বাস নিলাম! আমি না
        বুঝে পেজের টপ-লেভেলেই <code>cookies()</code> ডেকে বসে ছিলাম, আর ভাবছিলাম আমার
        ক্যাশ কাজ করছে না কেন! এখন থেকে ডায়নামিক অংশগুলোকে আলাদা কম্পোনেন্টে আইসোলেট করে{" "}
        <code>&lt;Suspense&gt;</code> বাউন্ডারি ব্যবহার করব!
      </Line>

      <Line name="নেক্সট-ভাই">
        সাবাশ! এই আইসোলেশন আর্কিটেকচার জানা থাকলে তোর সাইটের ৯৫% অংশ স্ট্যাটিক ক্যাশড
        থাকবে, আর বাকি ৫% ডায়নামিক পার্ট স্মুথলি স্ট্রিম হবে!
      </Line>

      {/* ── Takeaway ──────────────────────────────────────────────────── */}
      <H2 id="takeaway">💡 Production Engineering Takeaways</H2>

      <ul>
        <li>
          <strong>Dynamic Functions:</strong> <code>cookies()</code>,{" "}
          <code>headers()</code>, আর <code>searchParams</code> হলো Dynamic Functions, যা
          টপ-লেভেলে ডাকলে পুরো পেজের ক্যাশ অপ্ট-আউট করে দেয়।
        </li>
        <li>
          <strong>Scope Isolation:</strong> ডায়নামিক ফাংশনগুলোকে সবসময় লিফ কম্পোনেন্টে
          আটকে রাখতে হয় এবং <code>&lt;Suspense&gt;</code> দিয়ে আইসোলেট করতে হয়।
        </li>
        <li>
          <strong>Granular Streaming:</strong> পারফেক্ট আইসোলেশন করলে সার্ভার স্ট্যাটিক
          কন্টেন্ট ইনস্ট্যান্ট সার্ভ করবে এবং ডায়নামিক পার্টটুকু স্ট্রিম করে ইউজারের
          ব্রাউজারে পাঠাবে।
        </li>
      </ul>
    </article>
  );
}
