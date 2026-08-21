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
      bn: "বিল্ড আউটপুটে ○ আর ƒ",
      en: "○ and ƒ in the build output",
    },
  },
  {
    id: "architecture",
    label: {
      bn: "Static বনাম Dynamic রেন্ডারিং",
      en: "Static vs dynamic rendering",
    },
  },
  {
    id: "dynamic-functions",
    label: {
      bn: "কোন জিনিস রুটকে Dynamic বানায়",
      en: "What turns a route dynamic",
    },
  },
  {
    id: "route-config",
    label: { bn: "Route Segment Config", en: "Route segment config" },
  },
  {
    id: "matrix",
    label: { bn: "সিদ্ধান্তের ছক", en: "The decision matrix" },
  },
  {
    id: "takeaway",
    label: { bn: "Production Takeaways", en: "Production takeaways" },
  },
];

export default function FullRouteCacheVsDynamic() {
  return (
    <article className="doc-prose">
      {/* ── The problem ───────────────────────────────────────────────── */}
      <H2 id="the-problem" anchorOnly>
        বিল্ড আউটপুটে ○ আর ƒ
      </H2>

      <p>
        সন্ধ্যা ৬টা। ভুলু ভাই ল্যাপটপে তাঁর ই-কমার্স অ্যাপ্লিকেশনের <code>npm run build</code>{" "}
        আউটপুট দেখছেন। বিল্ড টার্মিনালে কিছু রুটের পাশে ○ (Static) এবং কিছু রুটের পাশে ƒ
        (Dynamic) চিহ্ন উঠে আছে!
      </p>

      <CodeBlock label="Bash" filename="build-output.txt">{`Route (app)                              Size     First Load JS
┌ ○ /                                    180 B          85 kB
├ ○ /about                               150 B          82 kB
├ ƒ /dashboard                           2.1 kB        102 kB
└ ƒ /products/[id]                       1.5 kB         95 kB
+ First Load JS shared by all            81.8 kB
  ƒ Middleware                           28.5 kB

○  (Static)   prerendered as static content
ƒ  (Dynamic)  server-rendered on demand using Node.js`}</CodeBlock>

      <Line name="ভুলু ভাই">
        (ভ্রূ কুঁচকে) নেক্সট-ভাই! এই গোল আর ফানেল মার্কা চিহ্নগুলোর মানে কী? খেয়াল করলাম,
        যেসব পেজে ○ লেখা, সেগুলোতে ঢোকার সাথে সাথেই পেজ লোড হচ্ছে! কিন্তু ƒ লেখা পেজগুলো লোড
        হতে কিছুটা সময় নিচ্ছে। Next.js কীভাবে ডিসাইড করে কোনটা Static আর কোনটা Dynamic?!
      </Line>

      <Line name="নেক্সট-ভাই">
        (মুচকি হেসে) ভুলু, এখানেই লুকানো আছে Next.js-এর পারফর্মেন্সের সবচেয়ে বড় সিক্রেট —{" "}
        <strong>Full Route Cache and Rendering Behavior</strong>! Next.js ব্যাকগ্রাউন্ডে
        সিদ্ধান্ত নেয় কোন পেজকে আগেই রেন্ডার করে সার্ভারের ফাইল সিস্টেমে সেভ করে রাখবে, আর
        কোন পেজকে রিকোয়েস্ট আসার পর রানটাইমে রেন্ডার করবে।
      </Line>

      {/* ── Architecture ──────────────────────────────────────────────── */}
      <H2 id="architecture">১. Static বনাম Dynamic রেন্ডারিং</H2>

      <Diagram>{`1. Static Rendering (Full Route Cache)
   [Build Time]   ──► Render HTML + RSC Payload ──► Store on Server Disk
   [User Request] ──► Instantly serve pre-rendered HTML 🚀

2. Dynamic Rendering (On-Demand)
   [User Request] ──► Read Request Data (Cookies / Headers / SearchParams)
                  ──► Run Node.js Server Code ──► Stream HTML to Browser`}</Diagram>

      <H3>A — Static Rendering (Build-Time Generation)</H3>

      <p>
        প্রজেক্ট বিল্ডের সময় Next.js পেজটির RSC এক্সিকিউট করে HTML এবং RSC Payload তৈরি করে
        সার্ভার ডিস্কে Full Route Cache হিসেবে জমা রাখে। ফল — Zero Compute Overhead, আর CDN
        থেকে গ্লোবালি ক্যাশড সার্ভ করার সুবিধা। Next.js-এর যেকোনো পেজ বাই-ডিফল্ট Static
        হওয়ার চেষ্টা করে, যদি না সেখানে Dynamic Function বা uncached ডাটা ফেচিং থাকে।
      </p>

      <H3>B — Dynamic Rendering (Run-Time Generation)</H3>

      <p>
        প্রাক-রেন্ডার করা ক্যাশড HTML সার্ভ করা হয় না। প্রতিবার ইউজার URL-এ হিট করলে সার্ভার
        তখনই রেসপন্স তৈরি করে পাঠায়। যখন পেজ রেন্ডার করতে রিকোয়েস্ট-টাইম ডাটা (কুকি, হেডার,
        Search Parameters) লাগে — তখন এটাই দরকার।
      </p>

      {/* ── Dynamic functions ─────────────────────────────────────────── */}
      <H2 id="dynamic-functions">২. কোন জিনিস রুটকে Dynamic বানায়</H2>

      <Line name="ভুলু ভাই">
        নেক্সট-ভাই! আমি কীভাবে বুঝব কোনো পেজ অটোমেটিক Dynamic রেন্ডারিংয়ে সুইচ করে যাবে?
      </Line>

      <Line name="নেক্সট-ভাই">
        নিচের যেকোনো একটি Dynamic Function ব্যবহার করলেই Next.js পুরো রুটটিকে Dynamic
        Rendering-এ শিফট করিয়ে দেয় এবং Full Route Cache স্কিপ করে:
      </Line>

      <ul>
        <li>
          <code>cookies()</code> — রিকোয়েস্টের কুকি রিড করা।
        </li>
        <li>
          <code>headers()</code> — ইনকামিং রিকোয়েস্টের হেডার চেক করা।
        </li>
        <li>
          <code>searchParams</code> prop — URL Query String এক্সেস করা।
        </li>
        <li>
          uncached <code>fetch()</code> — <code>cache: &apos;no-store&apos;</code> বা{" "}
          <code>revalidate: 0</code> দিয়ে ডাটা ফেচ করা।
        </li>
      </ul>

      <CodeBlock filename="app/dashboard/page.tsx">{`// app/dashboard/page.tsx
import { cookies } from 'next/headers';

export default async function DashboardPage() {
  // ⚡ Dynamic function triggered!
  // This single line turns the entire route into dynamic rendering.
  const cookieStore = await cookies();
  const token = cookieStore.get('auth_token');

  return <div>Welcome to Dashboard. Token: {token?.value}</div>;
}`}</CodeBlock>

      {/* ── Route config ──────────────────────────────────────────────── */}
      <H2 id="route-config">৩. Route Segment Config</H2>

      <Line name="ভুলু ভাই">
        ভাই! আমি যদি ম্যানুয়ালি কোনো রুটকে জোর করে Static বা Dynamic বানাতে চাই, উপায় কী?
      </Line>

      <Line name="নেক্সট-ভাই">
        পেজের একদম ওপরে একটি ভেরিয়েবল এক্সপোর্ট করেই তুই রেন্ডারিং বিহেভিয়ার ওভাররাইড করতে
        পারবি:
      </Line>

      <CodeBlock filename="app/products/page.tsx">{`// app/products/page.tsx

// Option A: force the route to be completely dynamic (never cache HTML)
export const dynamic = 'force-dynamic';

// Option B: force the route to be completely static
//           (errors if dynamic functions are used)
// export const dynamic = 'force-static';

// Option C: time-based ISR
// export const revalidate = 60; // Revalidate static HTML every 60 seconds

export default async function ProductsPage() {
  const products = await fetch('https://api.com/products').then((r) => r.json());
  return <div>Products Count: {products.length}</div>;
}`}</CodeBlock>

      {/* ── Matrix ────────────────────────────────────────────────────── */}
      <H2 id="matrix">৪. সিদ্ধান্তের ছক</H2>

      <Table
        head={[
          "রেন্ডারিং টাইপ",
          "Full Route Cache?",
          "বিল্ড সিম্বল",
          "আদর্শ ইউজ কেস",
        ]}
        rows={[
          [
            "Static Rendering",
            "হ্যাঁ",
            "○ (Static)",
            "ব্লগ পোস্ট, ল্যান্ডিং পেজ, প্রাইসিং, ডক্স, অ্যাবাউট",
          ],
          [
            "Dynamic Rendering",
            "না",
            "ƒ (Dynamic)",
            "ড্যাশবোর্ড, ইউজার প্রোফাইল, শপিং কার্ট, সার্চ ফিল্টার",
          ],
          [
            "ISR (Revalidated Static)",
            "হ্যাঁ — মেয়াদ থাকা পর্যন্ত",
            "ISR",
            "ই-কমার্স প্রডাক্ট ডিটেইলস, নিউজ পোর্টাল, ট্রেন্ডিং লিস্ট",
          ],
        ]}
      />

      <Line name="ভুলু ভাই">
        (উচ্ছ্বসিত হয়ে) আহ! পানির মতো সোজা হিসেব! রিকোয়েস্ট-নির্দিষ্ট ডাটা না থাকলে পেজ ○
        Static, কুকি বা রিয়েল-টাইম ডাটা ব্যবহার করলে ƒ Dynamic, আর দরকার হলে{" "}
        <code>force-dynamic</code> দিয়ে ম্যানুয়ালি ওভাররাইড!
      </Line>

      {/* ── Takeaways ─────────────────────────────────────────────────── */}
      <H2 id="takeaway">Production Takeaways</H2>

      <Note>
        <ul>
          <li>
            <strong>Default Optimization:</strong> Next.js সবসময় পেজকে Static রাখার চেষ্টা
            করে — অপ্রয়োজনে টপ-লেভেল কম্পোনেন্টে Dynamic Function ব্যবহার এড়িয়ে চলুন।
          </li>
          <li>
            <strong>Partial Prerendering (PPR):</strong> সাম্প্রতিক ভার্সনে একই পেজের স্ট্যাটিক
            অংশ ক্যাশড রেখে ডাইনামিক অংশ Suspense দিয়ে স্ট্রিম করা যায়।
          </li>
          <li>
            <strong>Build-Time Verification:</strong> ডিপ্লয়ের আগে সবসময়{" "}
            <code>npm run build</code> চালিয়ে পেজগুলোর ○ বনাম ƒ রিভিউ করা উচিত।
          </li>
        </ul>
      </Note>
    </article>
  );
}
