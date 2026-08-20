import { CodeBlock, H2, Line, Note } from "@/components/learn/DocParts";
import type { Bi } from "@/lib/curriculum";

/** Section anchors — consumed by the "on this page" rail. */
export const headings: { id: string; label: Bi }[] = [
  {
    id: "waterfall",
    label: { bn: "১+১+১ = ৩ সেকেন্ড", en: "1+1+1 = 3 seconds" },
  },
  {
    id: "promise-all",
    label: { bn: "১. Promise.all() প্যাটার্ন", en: "1. The Promise.all() pattern" },
  },
  {
    id: "promise-all-flaws",
    label: { bn: "২. Promise.all()-এর দুই ফাঁদ", en: "2. Two traps in Promise.all()" },
  },
  {
    id: "production-patterns",
    label: { bn: "৩. প্রোডাকশন আর্কিটেকচার", en: "3. Production architecture" },
  },
  {
    id: "takeaway",
    label: { bn: "Production Takeaways", en: "Production takeaways" },
  },
];

export default function ParallelDataFetching() {
  return (
    <article className="doc-prose">
      {/* ── Waterfall ─────────────────────────────────────────────────── */}
      <H2 id="waterfall" anchorOnly>
        ১+১+১ = ৩ সেকেন্ড
      </H2>

      <p>
        রাত গভীর হচ্ছে। ভুলু ভাই এবার ব্রাউজারের DevTools-এর Network Tab খুলে ওয়াটারফল
        ডায়াগ্রামের দিকে চেয়ে আছেন। পেজ লোড হতে পুরো ৩ সেকেন্ড সময় লাগছে!
      </p>

      <Line name="ভুলু ভাই">
        নেক্সট-ভাই! আমি তো পুরো হতাশ! আমি ভেবেছিলাম সার্ভার কম্পোনেন্ট (RSC) ব্যবহার করলে
        সাইট এমনিতেই রকেটের স্পিডে লোড হবে। কিন্তু আমার ড্যাশবোর্ড পেজে ৩টা ডাটা ফেচিং
        আছে: ইউজার প্রোফাইল (1s), সাম্প্রতিক অর্ডার (1s), আর অ্যানালিটিক্স ডাটা (1s)। এই
        ৩টা সাধারণ ডাটা লোড হতে পুরো ১ + ১ + ১ = ৩ সেকেন্ড কেন ঝুলছে ভাই?! ড্যাশবোর্ডের
        স্পিনার তো ঘোরা বন্ধই হচ্ছে না!
      </Line>

      <Line name="নেক্সট-ভাই">
        (হেসে কফি কাপটা একপাশে সরিয়ে রেখে) ভুলু! তুই তো না জেনে তোর সার্ভার কম্পোনেন্টকে
        এক জঘন্য ট্র্যাপে ফেলেছিস — <strong>&quot;Sequential Waterfall Fetching&quot;</strong>!
      </Line>

      <Line name="ভুলু ভাই">(থতমতো খেয়ে) ওয়াটারফল ফেচিং?! ওটা আবার কী ভাই?!</Line>

      <Line name="নেক্সট-ভাই">
        তুই তোর কোডে নিশ্চয়ই একটার পর একটা <code>await</code> বসিয়ে রেখেছিস?
      </Line>

      <CodeBlock filename="app/dashboard/page.tsx">{`// ❌ Sequential Waterfall Bottleneck (Total Time: 1s + 1s + 1s = 3s! 🐢)
export default async function DashboardPage() {
  const user = await getUser();           // Wait 1s...
  const orders = await getOrders();       // Wait 1s...
  const analytics = await getAnalytics(); // Wait 1s...

  return <Dashboard user={user} orders={orders} analytics={analytics} />;
}`}</CodeBlock>

      <Line name="ভুলু ভাই">
        (ল্যাপটপের কোডের দিকে তাকিয়ে) হ্যাঁ ভাই! এভাবেই তো লিখেছি! একটা শেষ হলে আরেকটা
        শুরু হবে, ডাটা গুছিয়ে প্রপসে পাঠাব — এটাই তো স্বাভাবিক প্রসিডিউর!
      </Line>

      <Line name="নেক্সট-ভাই">
        আরে না! <code>await getUser()</code> শেষ না হওয়া পর্যন্ত ফাংশনটা ২ নম্বর লাইনে
        আটকে থাকে! ফলে তোর সার্ভার ৩টা স্বাধীন ফেচকে একের পর এক শিডিউল করে সময় ৩ গুণ
        বাড়িয়ে ফেলছে! অথচ এই ৩টা এপিআই তো কেউ কারো ওপর নির্ভর করছে না!
      </Line>

      {/* ── Promise.all ───────────────────────────────────────────────── */}
      <H2 id="promise-all">১. Promise.all() প্যাটার্ন</H2>

      <Line name="নেক্সট-ভাই">
        স্বাধীন রিকোয়েস্টগুলোকে একসাথে প্যারালালে রান করার জন্য তোর প্রথম অস্ত্র হলো
        JavaScript-এর নেটিভ <code>Promise.all()</code>!
      </Line>

      <CodeBlock filename="app/dashboard/page.tsx">{`// ⚡ Parallel Fetching (Total Time: ~1s max! 🚀)
export default async function DashboardPage() {
  // Initiate all fetches simultaneously without awaiting
  const userPromise = getUser();
  const ordersPromise = getOrders();
  const analyticsPromise = getAnalytics();

  // Wait for all promises to resolve in parallel!
  const [user, orders, analytics] = await Promise.all([
    userPromise,
    ordersPromise,
    analyticsPromise,
  ]);

  return <Dashboard user={user} orders={orders} analytics={analytics} />;
}`}</CodeBlock>

      <Line name="ভুলু ভাই">
        (চোখ বড় বড় করে) ওরে বাপ্পরে! ১+১+১ = ৩ সেকেন্ডের পেজ লোডিং টাইম কমে সোজা সবচেয়ে
        স্লো যে রিকোয়েস্টটা (১ সেকেন্ড) — সেই সময়সীমায় নেমে আসলো?! ৩ গুণ ফাস্ট?!
      </Line>

      <Line name="নেক্সট-ভাই">
        একদম! কিন্তু দাঁড়া, <code>Promise.all()</code>-এর ভেতরেও একটা মারাত্মক প্রোডাকশন
        বটলনেক লুকিয়ে আছে!
      </Line>

      {/* ── Flaws ─────────────────────────────────────────────────────── */}
      <H2 id="promise-all-flaws">২. Promise.all()-এর দুই ফাঁদ</H2>

      <Line name="ভুলু ভাই">(অবাক হয়ে) ফেচ ফাস্ট হওয়ার পরও ট্র্যাপ কিসের ভাই?!</Line>

      <Line name="নেক্সট-ভাই">২টা মারাত্মক প্রবলেম আছে:</Line>

      <ul>
        <li>
          <strong>The Single Failure Crash:</strong> ধর তোর ইউজার আর অর্ডার ডাটা ১
          সেকেন্ডে সাকসেসফুলি চলে আসলো, কিন্তু ৩ নম্বর থার্ড-পার্টি অ্যানালিটিক্স এপিআই
          ডাউন হয়ে এরর দিল! <code>Promise.all()</code> পুরো প্রমিজ রিজেক্ট করে দেবে, আর
          ইউজারের স্ক্রিনে পুরো ড্যাশবোর্ড ব্ল্যাঙ্ক হয়ে 500 Server Error ঝুলবে! ১টা
          আন-ইম্পর্ট্যান্ট উইজেট ফেইল করার মাশুল পুরো পেজ দেবে?!
        </li>
        <li>
          <strong>The Longest-Pole Bottleneck:</strong> ধর ইউজার আর অর্ডার আসলো ৫০০
          মিলিসেকেন্ডে, আর অ্যানালিটিক্স আসতে টাইম নিল ৭ সেকেন্ড! পুরো ড্যাশবোর্ড ৭
          সেকেন্ড ধরে ব্লক হয়ে থাকবে, ইউজার ১ সেকেন্ডেও তার প্রোফাইল দেখতে পারবে না!
        </li>
      </ul>

      <Line name="ভুলু ভাই">
        (কপালে হাত দিয়ে) ওরে ভাই! তাহলে তো <code>Promise.all()</code> দিলেও আমার
        প্রোডাকশন ক্র্যাশ বা স্লো হয়ে যাওয়ার ঝুঁকি থেকেই যায়! এর অল্টারনেটিভ আর্কিটেকচার
        কোনটা?
      </Line>

      {/* ── Production patterns ───────────────────────────────────────── */}
      <H2 id="production-patterns">৩. প্রোডাকশন আর্কিটেকচার</H2>

      <Line name="নেক্সট-ভাই">এন্টারপ্রাইজ লেভেলে ২টা প্যাটার্ন ফলো করা হয়।</Line>

      <p>
        <strong>Pattern A — Promise.allSettled() দিয়ে safe partial fetching.</strong> কোনো
        একটা ফেচ ক্র্যাশ করলেও পেজ ভেঙে পড়বে না, বাকি ডাটা লোড হয়ে যাবে:
      </p>

      <CodeBlock filename="app/dashboard/page.tsx">{`const [userRes, ordersRes, analyticsRes] = await Promise.allSettled([
  getUser(),
  getOrders(),
  getAnalytics(),
]);

const user = userRes.status === 'fulfilled' ? userRes.value : null;
const analytics =
  analyticsRes.status === 'fulfilled' ? analyticsRes.value : defaultAnalytics;`}</CodeBlock>

      <p>
        <strong>
          Pattern B — Granular component-level Suspense streaming (Best Approach 🏆).
        </strong>{" "}
        সবচেয়ে আলটিমেট সলিউশন হলো প্যারেন্ট পেজে কোনো <code>await</code> না রাখা! ডাটা
        ফেচিংকে কম্পোনেন্টের ভেতরেই আইসোলেট করে <code>&lt;Suspense&gt;</code> বাউন্ডারি
        দিয়ে রেন্ডার করানো:
      </p>

      <CodeBlock filename="app/dashboard/page.tsx">{`// ✅ Ultimate Architecture: Zero Page Blocking Parallel Streaming!
export default function DashboardPage() {
  return (
    <div className="grid grid-cols-3 gap-4">
      {/* Fast component loads instantly ⚡ */}
      <Suspense fallback={<UserSkeleton />}>
        <UserSection />
      </Suspense>

      {/* Independent component stream */}
      <Suspense fallback={<OrdersSkeleton />}>
        <OrdersSection />
      </Suspense>

      {/* Slow analytics won't block User or Orders! 🐢 */}
      <Suspense fallback={<AnalyticsSkeleton />}>
        <SlowAnalyticsSection />
      </Suspense>
    </div>
  );
}

// app/components/UserSection.tsx
async function UserSection() {
  const user = await getUser(); // Fetching isolated inside the component!
  return <UserProfile user={user} />;
}`}</CodeBlock>

      <Note>
        <p>
          Pattern B-তে ফেচগুলো প্যারালাল হয় কারণ React বাউন্ডারিগুলো একসাথে রেন্ডার করা
          শুরু করে — সিরিয়াল <code>await</code> ফিরে আসে তখনই, যখন প্যারেন্টে আবার একটা{" "}
          <code>await</code> বসিয়ে দিস।
        </p>
      </Note>

      <Line name="ভুলু ভাই">(ল্যাপটপের দিকে হা হয়ে তাকিয়ে) ওয়াও নেক্সট-ভাই!</Line>

      <ul>
        <li>
          প্যারেন্ট পেজে <code>await</code> না থাকায় TTFB হবে প্রায় ইনস্ট্যান্ট!
        </li>
        <li>যে কম্পোনেন্টের ডাটা ফাস্ট রেডি হবে, সে সাথে সাথে স্ক্রিনে স্ট্রিম হয়ে ভেসে উঠবে!</li>
        <li>আর স্লো উইজেটটার জন্য বাকি দুইটা কম্পোনেন্ট আটকে বসে থাকবে না!</li>
      </ul>

      <Line name="নেক্সট-ভাই">
        বিঙ্গো! এটাই হলো মডার্ন Next.js সার্ভার কম্পোনেন্টের আসল Parallel Async
        Architecture!
      </Line>

      {/* ── Takeaway ──────────────────────────────────────────────────── */}
      <H2 id="takeaway">💡 Production Engineering Takeaways</H2>

      <ul>
        <li>
          <strong>Avoid Sequential Waterfalls:</strong> একটার পর একটা <code>await</code>{" "}
          ডেকে স্বাধীন রিকোয়েস্টগুলোকে ব্লকিং ওয়াটারফলে ফেলা মারাত্মক অ্যান্টি-প্যাটার্ন।
        </li>
        <li>
          <strong>Promise.all Pitfalls:</strong> <code>Promise.all()</code> প্যারালাল
          ফেচিং করলেও এটা &quot;All-or-Nothing&quot; ফেইলিওর মডেল ফলো করে, যা রেজিলিয়েন্ট
          অ্যাপের জন্য বিপজ্জনক।
        </li>
        <li>
          <strong>Suspense Component Isolation:</strong> ডাটা ফেচিং কম্পোনেন্ট লেভেলে
          আইসোলেট করে <code>&lt;Suspense&gt;</code> দিয়ে ঘিরে দেওয়াই হলো হাই-পারফরম্যান্ট
          প্যারালাল স্ট্রিমিং আর্কিটেকচার।
        </li>
      </ul>
    </article>
  );
}
