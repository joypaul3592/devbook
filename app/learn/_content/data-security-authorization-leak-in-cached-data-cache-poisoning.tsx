import { CodeBlock, Diagram, H2, Line, Note } from "@/components/learn/DocParts";
import type { Bi } from "@/lib/curriculum";

/** Section anchors — consumed by the "on this page" rail. */
export const headings: { id: string; label: Bi }[] = [
  {
    id: "the-leak",
    label: { bn: "অন্যের ডাটা অন্যের স্ক্রিনে", en: "One user's data on another's screen" },
  },
  {
    id: "how-it-happens",
    label: { bn: "প্রাইভেট ডাটা গ্লোবাল ক্যাশে কীভাবে গেল", en: "How private data got cached" },
  },
  {
    id: "never-cache-auth",
    label: { bn: "১. অথেনটিকেটেড রেসপন্স ক্যাশ নয়", en: "1. Never cache authenticated responses" },
  },
  {
    id: "per-user-keys",
    label: { bn: "২. পার-ইউজার স্কোপড ক্যাশ কি", en: "2. Per-user scoped cache keys" },
  },
  {
    id: "cache-control",
    label: { bn: "৩. Cache-Control হেডার গার্ড", en: "3. Cache-Control header guarding" },
  },
  {
    id: "authorize-first",
    label: { bn: "৪. ক্যাশ পড়ার আগে অথরাইজেশন", en: "4. Authorize before reading cache" },
  },
  {
    id: "takeaway",
    label: { bn: "Production Takeaways", en: "Production takeaways" },
  },
];

export default function CachePoisoning() {
  return (
    <article className="doc-prose">
      {/* ── The leak ──────────────────────────────────────────────────── */}
      <H2 id="the-leak" anchorOnly>
        অন্যের ডাটা অন্যের স্ক্রিনে
      </H2>

      <p>
        গভীর রাত। চারপাশ নিস্তব্ধ। ভুলু ভাই চোখ-মুখ লাল করে ল্যাপটপের মনিটরে তাকিয়ে আছেন।
        তাঁর চেহারা ফ্যাকাসে, হাত সামান্য কাঁপছে!
      </p>

      <Line name="ভুলু ভাই">
        (থরথর করে কাঁপতে কাঁপতে) নেক্সট-ভাই... আমার জীবন তো শেষ! আমি কী মারাত্মক কাণ্ড
        ঘটিয়ে ফেলেছি ভাই! আমার অ্যাপের অ্যাডমিন প্যানেলে ঢুকে দেখি সাধারণ ইউজার
        &ldquo;রহিম&rdquo;-এর ড্যাশবোর্ডে সুপার-অ্যাডমিন &ldquo;করিম&rdquo;-এর সিক্রেট
        সেশন ডাটা, পেমেন্ট ইনফো আর অ্যাকাউন্ট ব্যালেন্স দেখাচ্ছে! আবার ইনকগনিটো মোডে নতুন
        কোনো ইউজার ঢুকলে সে রহিম বা করিমের ডাটা ক্যাশ থেকে টেনে দেখতে পাচ্ছে! ইউজারের
        প্রাইভেট সেশন ডাটা ক্যাশ হয়ে গ্লোবালি লিক হয়ে গেছে ভাই!
      </Line>

      <Line name="নেক্সট-ভাই">
        (একদম শান্ত গলায়, তবে টোন গম্ভীর) ভুলু, শান্ত হ! তুই তো ওয়েব ডেভেলপমেন্টের
        অন্যতম বিপজ্জনক সিকিউরিটি থ্রেট —{" "}
        <strong>&quot;Shared Multi-Tenant Cache Poisoning&quot;</strong> (বা
        Authorization Data Leak) ঘটিয়ে বসে আছিস!
      </Line>

      {/* ── How it happens ────────────────────────────────────────────── */}
      <H2 id="how-it-happens">১. প্রাইভেট ডাটা গ্লোবাল ক্যাশে কীভাবে গেল</H2>

      <Line name="ভুলু ভাই">
        (হাউমাউ করে) ক্যাশ পয়জনিং?! কিন্তু প্রাইভেট ইউজার ডাটা পাবলিক ক্যাশে গেল কীভাবে
        ভাই?!
      </Line>

      <Line name="নেক্সট-ভাই">
        তুই নিশ্চয়ই ইউজারের সেশন টোকেন বা আইডি দিয়ে ফেচ করা প্রাইভেট ডাটাকে সার্ভারের
        গ্লোবাল Data Cache-এ বা <code>&apos;use cache&apos;</code> দিয়ে স্ট্যাটিক ক্যাশ
        বানিয়ে সেভ করে রেখেছিস! Next.js-এর Data Cache বা CDN ক্যাশ লেয়ারগুলো হলো{" "}
        <strong>Global Shared Storage</strong> — ১ জন ইউজার সার্ভারে হিট মারলে যে ক্যাশ
        এন্ট্রি তৈরি হয়, তা পরবর্তী সব রিকোয়েস্টের জন্য জমা হয়ে যায়!
      </Line>

      <Line name="নেক্সট-ভাই">
        তুই যখন ইউজারের হেডার (<code>Authorization: Bearer …</code>) বা কুকি নিয়ে
        রিকোয়েস্ট ফেচ করেছিস, কিন্তু ক্যাশ অপশনে বলিসনি যে এটা &quot;পার-ইউজার প্রাইভেট
        ডাটা&quot; — Next.js ১ নম্বর ইউজারের প্রাইভেট রেসপন্সটাকে গ্লোবাল ক্যাশে রেখে
        দিয়েছিল! এরপর ২, ৩, ৪ নম্বর যত ইউজার এসেছে, সার্ভার কোনো সিকিউরিটি চেক ছাড়াই আগের
        গ্লোবাল ক্যাশড ডাটা টেনে তাদের স্ক্রিনে ডেলিভারি করে দিয়েছে!
      </Line>

      <Diagram>{`[User A (Super Admin)] ──► Requests /api/account ──► Fetches Private Data
                                                              │
                                                              ▼
                                               🚨 SAVED TO GLOBAL DATA CACHE!
                                                              │
[User B (General User)] ──► Requests /api/account ────────────┴─► 💥 SERVED USER A'S PRIVATE DATA!`}</Diagram>

      <Line name="ভুলু ভাই">
        (মাথায় হাত দিয়ে) ওরে বাপ্পরে! গ্লোবাল ক্যাশে সেভ হওয়ার কারণে অথরাইজেশন সম্পূর্ণ
        বাইপাস হয়ে অন্যের স্ক্রিনে গোপনীয় ডাটা চলে গেছে! এই মারাত্মক সিকিউরিটি লিক থেকে
        বাঁচতে এন্টারপ্রাইজ সিস্টেমে প্রাইভেট ডাটা ক্যাশ করার সঠিক আর্কিটেকচার কোনটা ভাই?!
      </Line>

      <Line name="নেক্সট-ভাই">
        শোন, প্রাইভেট পার্সোনালাইজড ডাটা সিকিউর করার ৪টা আয়রন-ক্ল্যাড গোল্ডেন রুল রয়েছে।
      </Line>

      {/* ── Rule 1 ────────────────────────────────────────────────────── */}
      <H2 id="never-cache-auth">২. অথেনটিকেটেড রেসপন্স গ্লোবালি ক্যাশ নয়</H2>

      <Line name="নেক্সট-ভাই">
        যেসব এপিআই রিকোয়েস্ট বা ডাটাবেজ কোয়েরি ইউজারের নিজস্ব সেশনের (Authorization,
        Cookies, User-ID) ওপর ভিত্তি করে কাজ করে, সেগুলোকে গ্লোবাল ক্যাশ থেকে কঠোরভাবে
        অপ্ট-আউট করাতে হবে!
      </Line>

      <CodeBlock filename="lib/data-access/dashboard.ts">{`// ❌ Dangerous: Multi-tenant Cache Poisoning Leak!
export async function getUserDashboard() {
  'use cache'; // 🚨 NEVER use global 'use cache' for authenticated user-specific data!
  return await db.user.findUnique(/* ... */);
}

// ✅ Secure: Explicit Dynamic Uncached Fetch
export async function getUserDashboard() {
  const session = await auth();
  if (!session) throw new Error('Unauthorized');

  // ⚡ Uncached fresh response specifically for this authenticated session
  const res = await fetch(\`https://api.com/users/\${session.user.id}\`, {
    cache: 'no-store', // Fully opt out of the Data Cache!
  });
  return res.json();
}`}</CodeBlock>

      {/* ── Rule 2 ────────────────────────────────────────────────────── */}
      <H2 id="per-user-keys">৩. পার-ইউজার স্কোপড ক্যাশ কি</H2>

      <Line name="ভুলু ভাই">
        কিন্তু ভাই, যদি ইউজারের ড্যাশবোর্ডের ভারী অ্যানালিটিক্স ডাটা আমরা সত্যি সত্যি ১০
        মিনিটের জন্য ক্যাশ করতে চাই? প্রতি সেকেন্ডে ডাটাবেজে হিট মারলে তো সার্ভার স্লো
        হয়ে যাবে! তখন কি ইউজারের জন্য ক্যাশিং একদমই অসম্ভব?
      </Line>

      <Line name="নেক্সট-ভাই">
        না, অসম্ভব নয়! সেটার জন্য তোকে <strong>Per-User Scoped Cache Key / Tagging</strong>{" "}
        ব্যবহার করতে হবে! ক্যাশ কি-এর ভেতরে অবশ্যই ইউজারের ইউনিক <code>userId</code>{" "}
        এম্বেড করে দিতে হবে, যাতে এক ইউজারের ক্যাশ দিয়ে অন্য ইউজারের ক্যাশ কখনো ওভাররাইট
        বা পয়জন না হয়!
      </Line>

      <CodeBlock filename="lib/data-access/analytics.ts">{`import { cacheLife, cacheTag } from 'next/cache';

// ✅ Secure Per-User Scoped Caching
export async function getPrivateUserAnalytics(userId: string) {
  'use cache';
  cacheLife('minutes');

  // ⚡ Scope the cache tag STRICTLY to this individual user ID!
  cacheTag(\`user-analytics-\${userId}\`);

  return await db.analytics.findMany({ where: { userId } });
}`}</CodeBlock>

      <Note>
        <p>
          খেয়াল কর, <code>userId</code> এখানে ফাংশনের আর্গুমেন্ট — ক্যাশড ফাংশনের ভেতরে{" "}
          <code>cookies()</code> বা <code>auth()</code> ডেকে আইডি বের করা যাবে না। ওটা
          করলেই আবার সেই একই পয়জনিং ফিরে আসে।
        </p>
      </Note>

      {/* ── Rule 3 ────────────────────────────────────────────────────── */}
      <H2 id="cache-control">৪. Cache-Control হেডার গার্ড</H2>

      <Line name="নেক্সট-ভাই">
        তুই যদি কাস্টম এপিআই রাউট হ্যান্ডলার (<code>route.ts</code>) থেকে প্রাইভেট রেসপন্স
        পাঠাস, তবে রেসপন্স হেডারে <code>Cache-Control: private, no-store</code> সেট করা
        বাধ্যতামূলক!
      </Line>

      <CodeBlock filename="app/api/user/profile/route.ts">{`export async function GET(request: Request) {
  const data = await getProfileData();

  return Response.json(data, {
    headers: {
      // ⚡ Explicitly instructs CDNs & shared caches NEVER to store this response!
      'Cache-Control': 'private, no-store, no-cache, must-revalidate',
    },
  });
}`}</CodeBlock>

      <Line name="নেক্সট-ভাই">
        <code>private</code> ফ্ল্যাগ দেখলে মিডলওয়্যার, Cloudflare বা Next.js ব্যাকএন্ড
        ক্যাশ ইঞ্জিন সঙ্গে সঙ্গে বুঝে যায় — &quot;এটা যৌথ ক্যাশে রাখার জিনিস না! এটা শুধু
        নির্দিষ্ট ইউজারের ব্রাউজারে থাকবে।&quot;
      </Line>

      {/* ── Rule 4 ────────────────────────────────────────────────────── */}
      <H2 id="authorize-first">৫. ক্যাশ পড়ার আগে অথরাইজেশন</H2>

      <Line name="ভুলু ভাই">
        ভাই, ক্যাশড ডাটা রিটার্ন করার আগে সার্ভার-সাইডে পারমিশন চেক করার উপায় কী?
      </Line>

      <Line name="নেক্সট-ভাই">
        ক্যাশড ফাংশনের বাইরে (Outside the Cache Boundary) সেশন ভ্যালিডেশন আর রোল-বেসড
        অথরাইজেশন (RBAC) সম্পন্ন করবি! পারমিশন ঠিক থাকলে তবেই ক্যাশড ফাংশন এক্সিকিউট বা
        রিড হবে।
      </Line>

      <CodeBlock filename="lib/data-access/admin.ts">{`// ✅ Secure Pattern: Authorize BEFORE reading cache
export async function getAdminReport() {
  // 1. Authorization check outside the cache boundary
  const session = await auth();
  if (session?.user?.role !== 'ADMIN') {
    throw new Error('Forbidden: Unauthorized Access!');
  }

  // 2. Safely read cache only AFTER authorization passes!
  return await getCachedAdminData();
}`}</CodeBlock>

      <Line name="ভুলু ভাই">
        (ল্যাপটপের স্ক্রিনে ক্যাশ অপ্ট-আউট আর <code>no-store</code> বসিয়ে একটা স্বস্তির
        নিশ্বাস ফেলে) ওফ! বাঁচালে নেক্সট-ভাই! আমি তো ইউজারের প্রাইভেট ড্যাশবোর্ড ডাটার
        ওপর চোখ বন্ধ করে ক্যাশিং মারতে গিয়েছিলাম!
      </Line>

      <ul>
        <li>পাবলিক বা জেনেরিক ডাটা (ব্লগ, প্রোডাক্ট, ক্যাটাগরি) ➔ গ্লোবাল ক্যাশ।</li>
        <li>
          প্রাইভেট সেশন ডাটা (ইউজার প্রোফাইল, ব্যালেন্স, অর্ডার) ➔ strictly{" "}
          <code>no-store</code> অথবা User-Scoped Cache Key!
        </li>
      </ul>

      <Line name="নেক্সট-ভাই">
        একদম বিঙ্গো! সিকিউরিটি ফার্স্ট, পারফরম্যান্স সেকেন্ড! এই ক্যাশ আইসোলেশন লেয়ার যার
        স্ট্রং, তার অ্যাপে হাজার কোটি রিকোয়েস্ট এলেও কোনো দিন ক্যাশ পয়জনিং বা ডাটা লিক
        হবে না!
      </Line>

      {/* ── Takeaway ──────────────────────────────────────────────────── */}
      <H2 id="takeaway">💡 Production Engineering Takeaways</H2>

      <ul>
        <li>
          <strong>Multi-Tenant Cache Poisoning:</strong> পাবলিক গ্লোবাল ক্যাশে প্রাইভেট
          সেশন ডাটা সেভ হয়ে যাওয়াকে ক্যাশ পয়জনিং বলে, যা মারাত্মক সিকিউরিটি লিক তৈরি করে।
        </li>
        <li>
          <strong>Per-User Scoped Keys:</strong> ইউজার-স্পেসিফিক ডাটা ক্যাশ করতে চাইলে
          ক্যাশ কি আর ট্যাগের ভেতরে এক্সপ্লিসিটলি <code>userId</code> অন্তর্ভুক্ত করা
          বাধ্যতামূলক।
        </li>
        <li>
          <strong>Cache-Control: private Guard:</strong> এপিআই রেসপন্সে{" "}
          <code>private, no-store</code> হেডার ব্যবহার নিশ্চিত করলে CDN বা শেয়ার্ড সার্ভার
          ক্যাশ পার্সোনাল ডাটা সেভ করে রাখা থেকে বিরত থাকে।
        </li>
      </ul>
    </article>
  );
}
