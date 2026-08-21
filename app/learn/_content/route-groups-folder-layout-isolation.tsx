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
      bn: "ফোল্ডার সাজালেই URL বদলে যায়",
      en: "Organise the folders, break the URLs",
    },
  },
  {
    id: "mental-model",
    label: { bn: "ব্র্যাকেট ফোল্ডারের ম্যাজিক", en: "The bracket folder" },
  },
  {
    id: "layout-isolation",
    label: { bn: "লেআউট আইসোলেশন", en: "Layout isolation" },
  },
  {
    id: "multiple-roots",
    label: { bn: "Multiple Root Layouts", en: "Multiple root layouts" },
  },
  {
    id: "matrix",
    label: { bn: "প্লেইন ফোল্ডার বনাম Route Group", en: "Plain folder vs group" },
  },
  {
    id: "takeaway",
    label: { bn: "Production Takeaways", en: "Production takeaways" },
  },
];

export default function RouteGroups() {
  return (
    <article className="doc-prose">
      {/* ── The problem ───────────────────────────────────────────────── */}
      <H2 id="the-problem" anchorOnly>
        ফোল্ডার সাজালেই URL বদলে যায়
      </H2>

      <p>
        রাত ১:৪৫। ভুলু ভাই একটি বড় অ্যাপ্লিকেশনের ফোল্ডার স্ট্রাকচার সাজাতে গিয়ে বিপাকে
        পড়েছেন। অ্যাপে ৩টি ভিন্ন পার্ট — পাবলিক ওয়েবসাইট, ইউজার ড্যাশবোর্ড, আর অ্যাডমিন
        প্যানেল। কিন্তু ড্যাশবোর্ডের ফোল্ডার বানাতে গেলেই URL হয়ে যাচ্ছে{" "}
        <code>/dashboard/settings</code>, আর অ্যাডমিনেরটা <code>/admin/settings</code>!
      </p>

      <Line name="ভুলু ভাই">
        নেক্সট-ভাই! আমি চাই ইউজার লগইন পেজে গেলে URL যেন সুন্দরভাবে <code>/login</code>{" "}
        দেখায়, <code>/auth/login</code> না আসে! আবার চাই <code>/login</code> আর{" "}
        <code>/register</code>-এর লেআউট সম্পূর্ণ আলাদা হোক (কোনো হেডার/ফুটার থাকবে না),
        কিন্তু ড্যাশবোর্ডের পেজগুলোতে বাঁ পাশে সাইডবার মেইনটেইন হবে!
      </Line>

      <Line name="ভুলু ভাই">
        ফোল্ডার দিয়ে কোড আলাদা করতে গেলেই URL বদলে যাচ্ছে, আর URL ঠিক রাখতে গেলে লেআউট
        জগাখিচুড়ি হয়ে যাচ্ছে! URL না বদলে কীভাবে কোড আর লেআউট আলাদা করব ভাই?!
      </Line>

      <Line name="নেক্সট-ভাই">
        (হেসে) ভুলু, এখানেই App Router-এর সবচেয়ে ক্লিন আর্কিটেকচারাল প্যাটার্ন কাজ করে —{" "}
        <strong>Route Groups</strong>! ফোল্ডারের নামের চারপাশে ফার্স্ট ব্র্যাকেট{" "}
        <code>(folderName)</code> দিলে Next.js সেই ফোল্ডারটিকে URL path হিসেবে পুরোপুরি
        স্কিপ করে! এটি তৈরিই হয়েছে কোড অর্গানাইজেশন আর Layout Isolation-এর জন্য।
      </Line>

      {/* ── Mental model ──────────────────────────────────────────────── */}
      <H2 id="mental-model">১. ব্র্যাকেট ফোল্ডারের ম্যাজিক</H2>

      <Diagram>{`app/
 ├── (marketing)/            <-- Route group for the public site (skipped in URL)
 │    ├── layout.tsx         <-- Header + public navigation
 │    ├── page.tsx           <-- URL: /
 │    └── about/page.tsx     <-- URL: /about
 │
 ├── (auth)/                 <-- Route group for authentication (skipped in URL)
 │    ├── layout.tsx         <-- Centered minimal card, no header/footer
 │    ├── login/page.tsx     <-- URL: /login       (NOT /auth/login!)
 │    └── register/page.tsx  <-- URL: /register
 │
 └── (dashboard)/            <-- Route group for logged-in users (skipped in URL)
      ├── layout.tsx         <-- Sidebar + topbar
      ├── user-dashboard/page.tsx  <-- URL: /user-dashboard
      └── settings/page.tsx        <-- URL: /settings`}</Diagram>

      <Note>
        <p>
          ব্র্যাকেটের ভেতরের নামগুলো (<code>marketing</code>, <code>auth</code>,{" "}
          <code>dashboard</code>) শুধু ডেভেলপারের বোঝার সুবিধার্থে প্রজেক্ট অর্গানাইজ করে —
          ব্রাউজারের URL-এ এদের কোনো নামই প্রকাশ পায় না।
        </p>
      </Note>

      {/* ── Layout isolation ──────────────────────────────────────────── */}
      <H2 id="layout-isolation">২. লেআউট আইসোলেশন</H2>

      <H3>A — Auth layout (minimal centered design)</H3>

      <CodeBlock filename="app/(auth)/layout.tsx">{`export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-900 text-white">
      <div className="w-full max-w-md p-8 bg-slate-800 rounded-xl shadow-2xl border border-slate-700">
        <div className="mb-6 text-center">
          <h1 className="text-2xl font-bold text-blue-400">Security Portal</h1>
          <p className="text-sm text-slate-400">Please authenticate to continue</p>
        </div>
        {/* Login or register page content renders here */}
        {children}
      </div>
    </div>
  );
}`}</CodeBlock>

      <H3>B — Dashboard layout (sidebar + main area)</H3>

      <CodeBlock filename="app/(dashboard)/layout.tsx">{`import Link from 'next/link';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-screen bg-gray-100">
      {/* Isolated dashboard sidebar */}
      <aside className="w-64 bg-slate-900 text-slate-200 flex flex-col p-4 border-r border-slate-800">
        <div className="text-xl font-bold mb-8 text-blue-400">App Dashboard</div>
        <nav className="flex flex-col gap-2">
          <Link href="/user-dashboard" className="p-2 hover:bg-slate-800 rounded">Overview</Link>
          <Link href="/settings" className="p-2 hover:bg-slate-800 rounded">Settings</Link>
        </nav>
      </aside>

      <main className="flex-1 overflow-y-auto p-8">{children}</main>
    </div>
  );
}`}</CodeBlock>

      {/* ── Multiple roots ────────────────────────────────────────────── */}
      <H2 id="multiple-roots">৩. Multiple Root Layouts</H2>

      <Line name="ভুলু ভাই">
        নেক্সট-ভাই! আমি যদি একদম রুট লেভেলের <code>app/layout.tsx</code> ফাইলটাই তুলে দিই,
        আর প্রতিটি Route Group-এর ভেতর নিজস্ব <code>&lt;html&gt;</code> ও{" "}
        <code>&lt;body&gt;</code> সহ আলাদা Root Layout বানাতে চাই — সম্ভব?
      </Line>

      <Line name="নেক্সট-ভাই">
        চমৎকার চিন্তা! পুরোপুরি সম্ভব। মার্কেটিং পেজ আর ড্যাশবোর্ডের ফন্ট/CSS একদম আলাদা হলে
        টপ-লেভেল <code>app/layout.tsx</code> মুছে দিয়ে প্রতিটি গ্রুপে আলাদা Root Layout রাখতে
        পারবি:
      </Line>

      <CodeBlock filename="app/(marketing)/layout.tsx">{`// app/(marketing)/layout.tsx
export default function MarketingRootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="bn">
      <body className="marketing-theme">{children}</body>
    </html>
  );
}

// app/(auth)/layout.tsx
export default function AuthRootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="auth-theme flex items-center justify-center">{children}</body>
    </html>
  );
}`}</CodeBlock>

      <Note>
        <p>
          <strong>⚠️ সতর্কতা:</strong> টপ-লেভেল <code>app/layout.tsx</code> না থাকলে এক রুট
          গ্রুপ থেকে অন্য গ্রুপে নেভিগেট করার সময় (যেমন <code>/about</code> →{" "}
          <code>/login</code>) Next.js Full Page Reload ঘটায়, কারণ পুরো DOM নতুন করে সিঙ্ক
          করতে হয়।
        </p>
      </Note>

      {/* ── Matrix ────────────────────────────────────────────────────── */}
      <H2 id="matrix">৪. প্লেইন ফোল্ডার বনাম Route Group</H2>

      <Table
        head={[
          "ফিচার",
          <code key="plain">app/auth</code>,
          <code key="group">app/(auth)</code>,
        ]}
        rows={[
          [
            "URL Impact",
            <>
              URL-এ যুক্ত হয় (<code>/auth/login</code>)
            </>,
            <>
              URL-এ স্কিপ হয় (<code>/login</code>)
            </>,
          ],
          [
            "Layout Isolation",
            "সন্তান রুটগুলো প্যারেন্টের লেআউট বাধ্যতামূলক পায়",
            "সম্পূর্ণ স্বাধীন কাস্টম লেআউট সাপোর্ট করে",
          ],
          [
            "মূল উদ্দেশ্য",
            "URL পেজ হায়ারার্কি তৈরি করা",
            "কোড অর্গানাইজেশন ও UI আইসোলেশন",
          ],
        ]}
      />

      <Line name="ভুলু ভাই">
        (আনন্দিত হয়ে) আহ্! ব্র্যাকেটের ভেতরে <code>(auth)</code> বা{" "}
        <code>(dashboard)</code> দিলে URL ক্লায়েন্টের স্ক্রিনে সুন্দর ও সংক্ষিপ্ত থাকে, কিন্তু
        কোড ও লেআউট একদম নিট, ক্লিন আর আইসোলেটেড থাকে!
      </Line>

      {/* ── Takeaways ─────────────────────────────────────────────────── */}
      <H2 id="takeaway">Production Takeaways</H2>

      <Note>
        <ul>
          <li>
            <strong>Avoid Naming Clashes:</strong> দুটি ভিন্ন রুট গ্রুপে একই নামের পেজ রাখলে
            (<code>(marketing)/about</code> আর <code>(dashboard)/about</code>) Next.js বিল্ড
            টাইমে Duplicate Route Conflict Error থ্রো করবে।
          </li>
          <li>
            <strong>Clean Code Structure:</strong> স্কেলেবল প্রজেক্টে ফাইল স্প্লিট করে
            পড়ার সুবিধা তৈরি করতে Route Groups অপরিহার্য।
          </li>
        </ul>
      </Note>
    </article>
  );
}
