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
      bn: "একটা উইজেট আটকালে পুরো পেজ আটকে যায়",
      en: "One slow widget blocks the page",
    },
  },
  {
    id: "structure",
    label: { bn: "@slot ফোল্ডার স্ট্রাকচার", en: "The @slot folder structure" },
  },
  {
    id: "implementation",
    label: { bn: "স্লট লেখা ও লেআউটে বসানো", en: "Writing and wiring slots" },
  },
  {
    id: "default",
    label: { bn: "default.tsx কেন আবশ্যক", en: "Why default.tsx matters" },
  },
  {
    id: "matrix",
    label: { bn: "কী সুবিধা মেলে", en: "What it buys you" },
  },
  {
    id: "takeaway",
    label: { bn: "Production Takeaways", en: "Production takeaways" },
  },
];

export default function ParallelRoutes() {
  return (
    <article className="doc-prose">
      {/* ── The problem ───────────────────────────────────────────────── */}
      <H2 id="the-problem" anchorOnly>
        একটা উইজেট আটকালে পুরো পেজ আটকে যায়
      </H2>

      <p>
        রাত ২:৪৫। ভুলু ভাই একটি জটিল অ্যাডমিন ড্যাশবোর্ড বানাচ্ছেন। একই স্ক্রিনে ৩টি সেকশন:
        Analytics Chart, Team Activity Stream, আর System Notifications। Analytics-এর ভারী
        API লোড হতে ৩ সেকেন্ড লাগে — আর তাতেই পুরো ড্যাশবোর্ড ব্লক হয়ে আটকে থাকছে!
      </p>

      <Line name="ভুলু ভাই">
        (কপালে হাত দিয়ে) নেক্সট-ভাই! একটি উইজেটের ডাটা লোড হতে দেরি হলে বা ফেল করলে পুরো
        পেজটি কেন ওয়েটিংয়ে থাকবে?!
      </Line>

      <Line name="ভুলু ভাই">
        আমি চাই ৩টি উইজেট যেন সম্পূর্ণ স্বাধীনভাবে সমান্তরালে লোড হয়! একটার ৫ সেকেন্ড লাগলেও
        বাকিগুলো যেন সাথে সাথেই স্ক্রিনে আসে — এমনকি তাদের নিজস্ব <code>&lt;Suspense&gt;</code>{" "}
        লোডার আর <code>error.tsx</code> হ্যান্ডলার থাকবে! আর কোনো ইউজারের পারমিশন না থাকলে
        পুরো পেজ ব্লক না করে শুধু ওই উইজেটে Access Denied দেখাতে চাই।
      </Line>

      <Line name="নেক্সট-ভাই">
        (কিবোর্ডে ক্লিক করে) ভুলু! তুই ঠিক যে প্যাটার্নের কথা বলছিস, সেটাই{" "}
        <strong>Parallel Routes (@slot)</strong>! একই লেআউটের ভেতরে একাধিক স্বাধীন
        পেজ/উইজেট সমান্তরালে রেন্ডার হয় — প্রতিটির নিজস্ব স্টেট, লোডিং স্কেলেটন আর এরর
        হ্যান্ডলিং থাকে, কেউ কাউকে ব্লক করে না।
      </Line>

      {/* ── Structure ─────────────────────────────────────────────────── */}
      <H2 id="structure">১. @slot ফোল্ডার স্ট্রাকচার</H2>

      <p>
        Parallel Route তৈরির নিয়ম — ফোল্ডারের নামের আগে একটি <code>@</code> সিম্বল। এগুলোকে
        বলে <strong>Named Slots</strong>।
      </p>

      <Note>
        <p>
          <code>@slot</code> ফোল্ডার URL path-এ কোনো প্রভাব ফেলে না। অর্থাৎ{" "}
          <code>/dashboard/@analytics</code> বলে কোনো URL তৈরি হয় না — এটি সরাসরি প্যারেন্ট{" "}
          <code>layout.tsx</code>-এ একটি React prop হিসেবে পাস হয়ে যায়।
        </p>
      </Note>

      <Diagram>{`app/dashboard/
 ├── layout.tsx           <-- Receives @analytics, @team & children as props
 ├── page.tsx             <-- Default main content (the children prop)
 ├── @analytics/
 │    ├── page.tsx        <-- Analytics widget
 │    ├── loading.tsx     <-- Independent skeleton for analytics
 │    └── error.tsx       <-- Independent error boundary for analytics
 ├── @team/
 │    ├── page.tsx        <-- Team activity stream
 │    └── default.tsx     <-- Fallback for hard navigation
 └── @notifications/
      └── page.tsx        <-- Notifications panel`}</Diagram>

      {/* ── Implementation ────────────────────────────────────────────── */}
      <H2 id="implementation">২. স্লট লেখা ও লেআউটে বসানো</H2>

      <H3>Slot 1 — Analytics (slow)</H3>

      <CodeBlock filename="app/dashboard/@analytics/page.tsx">{`export default async function AnalyticsSlot() {
  // Simulate a slow 2.5s API call
  await new Promise((resolve) => setTimeout(resolve, 2500));

  return (
    <div className="p-6 bg-slate-900 text-white rounded-xl border border-slate-800 shadow-md">
      <h3 className="text-lg font-bold text-blue-400 mb-2">📈 Real-time Analytics</h3>
      <p className="text-3xl font-extrabold text-emerald-400">$48,290.00</p>
      <p className="text-xs text-slate-400 mt-1">+14% growth compared to last week</p>
    </div>
  );
}`}</CodeBlock>

      <H3>Slot 2 — Team activity (fast)</H3>

      <CodeBlock filename="app/dashboard/@team/page.tsx">{`export default async function TeamSlot() {
  // Simulate a fast 500ms API call
  await new Promise((resolve) => setTimeout(resolve, 500));

  return (
    <div className="p-6 bg-slate-900 text-white rounded-xl border border-slate-800 shadow-md">
      <h3 className="text-lg font-bold text-purple-400 mb-2">👥 Active Team Members</h3>
      <ul className="text-sm space-y-2 text-slate-300">
        <li>• Sarah J. (DevOps) — Online</li>
        <li>• Zubayer S. (Lead Frontend) — Code reviewing</li>
      </ul>
    </div>
  );
}`}</CodeBlock>

      <H3>লেআউটে ইনজেকশন ও কন্ডিশনাল রেন্ডারিং</H3>

      <p>
        প্যারেন্ট <code>layout.tsx</code> স্বয়ংক্রিয়ভাবে <code>@slot</code> নাম অনুযায়ী props
        গ্রহণ করে:
      </p>

      <CodeBlock filename="app/dashboard/layout.tsx">{`interface DashboardLayoutProps {
  children: React.ReactNode;   // app/dashboard/page.tsx
  analytics: React.ReactNode;  // from the @analytics slot
  team: React.ReactNode;       // from the @team slot
}

export default async function DashboardLayout({
  children,
  analytics,
  team,
}: DashboardLayoutProps) {
  // Authorization status, e.g. from the session
  const userRole: 'ADMIN' | 'USER' = 'USER';

  return (
    <div className="p-8 bg-slate-950 min-h-screen space-y-6">
      <header className="border-b border-slate-800 pb-4">{children}</header>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Slot 1 — always visible */}
        <div>{analytics}</div>

        {/* Slot 2 — gated on the user's role */}
        <div>
          {userRole === 'ADMIN' ? (
            team
          ) : (
            <div className="p-6 bg-red-950/40 border border-red-800 rounded-xl text-red-300">
              <h3 className="font-bold">🔒 Access Restricted</h3>
              <p className="text-sm">You need admin privileges to view live team activity.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}`}</CodeBlock>

      {/* ── default.tsx ───────────────────────────────────────────────── */}
      <H2 id="default">৩. default.tsx কেন আবশ্যক</H2>

      <Line name="ভুলু ভাই">
        (ভ্রূ কুঁচকে) নেক্সট-ভাই! ড্যাশবোর্ডে হার্ড রিলোড বা ডাইরেক্ট নেভিগেশন করলে ৪০৪ মারছে
        কেন?!
      </Line>

      <Line name="নেক্সট-ভাই">
        ক্যাচটা সেখানেই! সফট নেভিগেশনে Next.js আগের স্লটগুলোর স্টেট মেমোরিতে ধরে রাখে। কিন্তু
        ব্রাউজার রিফ্রেশে যদি সে বুঝতে না পারে ওই URL-এ স্লটের ফ্যালব্যাক কী হবে, তখন ৪০৪
        দেয়! তাই প্রতিটি <code>@slot</code>-এর ভেতর একটি <code>default.tsx</code> থাকা
        আবশ্যক।
      </Line>

      <CodeBlock filename="app/dashboard/@analytics/default.tsx">{`export default function AnalyticsDefault() {
  return null; // Or a default fallback UI
}`}</CodeBlock>

      {/* ── Matrix ────────────────────────────────────────────────────── */}
      <H2 id="matrix">৪. কী সুবিধা মেলে</H2>

      <Table
        head={["সাধারণ রাউটিং", "Parallel Routes (@slot)"]}
        rows={[
          [
            "একটি ভারী API পুরো পেজ রেন্ডার আটকে দেয় (waterfall block)",
            "প্রতিটি উইজেট স্বাধীনভাবে স্ট্রিম হয়ে সমান্তরালে লোড হয়",
          ],
          [
            <>
              পুরো পেজের জন্য একটি <code>loading.tsx</code> ও <code>error.tsx</code>
            </>,
            <>
              প্রতিটি স্লটের নিজস্ব <code>loading.tsx</code> ও <code>error.tsx</code>
            </>,
          ],
          [
            "রোল-বেসড এক্সেসে পুরো পেজ হাইড করে রিডাইরেক্ট করতে হয়",
            "শুধু নির্দিষ্ট উইজেটে কন্ডিশনালি Access Denied দেখানো যায়",
          ],
        ]}
      />

      <Line name="ভুলু ভাই">
        (উচ্ছ্বসিত হয়ে) জাস্ট মাইন্ড-ব্লোয়িং! Analytics-এর ভারী ডাটা লোড হওয়ার সময় ওই
        সেকশনে নিজস্ব স্কেলেটন ভাসছে, আর পাশে Team Activity আধা সেকেন্ডেই ডিসপ্লে হয়ে গেছে!
      </Line>

      {/* ── Takeaways ─────────────────────────────────────────────────── */}
      <H2 id="takeaway">Production Takeaways</H2>

      <Note>
        <ul>
          <li>
            <strong>Independent Error Boundaries:</strong> প্রতিটি স্লটে নিজস্ব{" "}
            <code>error.tsx</code> রাখলে একটি উইজেটে এরর হলেও বাকিগুলো সচল থাকে।
          </li>
          <li>
            <strong>Always Provide default.tsx:</strong> হার্ড রিফ্রেশ বা ডাইরেক্ট URL
            নেভিগেশনে ৪০৪ এড়াতে প্রতিটি স্লট ফোল্ডারে <code>default.tsx</code> যোগ করা
            আবশ্যক।
          </li>
        </ul>
      </Note>
    </article>
  );
}
