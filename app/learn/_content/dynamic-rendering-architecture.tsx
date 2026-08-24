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
      bn: "এক ইউজারের ব্যালেন্স অন্য ইউজার দেখছে",
      en: "One user's balance shown to another",
    },
  },
  {
    id: "architecture",
    label: { bn: "Dynamic Rendering Runtime Flow", en: "Dynamic rendering runtime flow" },
  },
  {
    id: "triggers",
    label: { bn: "কী কী পেজকে Dynamic করে?", en: "What flips a page to dynamic" },
  },
  {
    id: "implementation",
    label: { bn: "প্রোডাকশন ড্যাশবোর্ড রুট", en: "A production dashboard route" },
  },
  {
    id: "matrix",
    label: { bn: "Static বনাম Dynamic", en: "Static vs dynamic" },
  },
  {
    id: "takeaway",
    label: { bn: "Production Takeaways", en: "Production takeaways" },
  },
];

export default function DynamicRenderingArchitecture() {
  return (
    <article className="doc-prose">
      {/* ── The problem ───────────────────────────────────────────────── */}
      <H2 id="the-problem" anchorOnly>
        এক ইউজারের ব্যালেন্স অন্য ইউজার দেখছে
      </H2>

      <p>
        দুপুর ২:৩০। ভুলু ভাই ইউজার ড্যাশবোর্ড পেজ (<code>/dashboard</code>) বানিয়ে প্রোডাকশনে
        টেস্ট করছেন। ইউজার &quot;আরিফ&quot; লগইন করার পর ড্যাশবোর্ডে তার ব্যালেন্স $1,000
        দেখাচ্ছে। কিন্তু ইউজার &quot;সাব্বির&quot; নিজের অ্যাকাউন্ট দিয়ে লগইন করে ড্যাশবোর্ডে
        গিয়ে আঁতকে উঠলেন — স্ক্রিনে এখনও আরিফের নাম আর ব্যালেন্স $1,000!
      </p>

      <Line name="ভুলু ভাই">
        ফাহিম! মারাত্মক বিপদে পড়েছি! ড্যাশবোর্ড পেজ ক্যাশ হয়ে গেছে! এক ইউজারের পার্সোনাল ডেটা
        অন্য ইউজার দেখে ফেলছে! রিকোয়েস্টের সাথে সাথে সার্ভার নতুন ডেটা রেন্ডার করছে না কেন?
      </Line>

      <Line name="ফাহিম">
        ভুলু ভাই! আপনি ড্যাশবোর্ড পেজটিকে Static রেন্ডার করে রেখে দিয়েছেন! যে পেজে ইউজারের কুকি
        (auth session), হেডার বা ইউজার-স্পেসিফিক ডেটা থাকে, সেই পেজ কখনো build time-এ রেন্ডার হতে
        পারে না। এদের জন্য দরকার <strong>Dynamic Rendering</strong> — অন-ডিমান্ড সার্ভার
        এক্সিকিউশন।
      </Line>

      <Line name="নেক্সট-ভাই">
        একদম! Dynamic Rendering-এ প্রতিটি ইনকামিং HTTP রিকোয়েস্টের সময় সার্ভার স্ক্র্যাচ থেকে রুট
        কম্পোনেন্ট এক্সিকিউট করে, ডেটাবেস থেকে তাজা ডেটা এনে অন-ডিমান্ড HTML ও RSC Payload তৈরি
        করে রেসপন্স পাঠায়।
      </Line>

      {/* ── Architecture ──────────────────────────────────────────────── */}
      <H2 id="architecture">১. Dynamic Rendering Runtime Flow</H2>

      <Diagram>{`┌─────────────────────────────────────────────────────────────────────────┐
│                    DYNAMIC RENDERING RUNTIME FLOW                       │
└─────────────────────────────────────────────────────────────────────────┘
                                     │
  【 STEP 1: USER REQUEST 】
  • User hits GET /dashboard (with a session cookie / authorization header)
                                     │
                                     ▼
  【 STEP 2: ON-DEMAND SERVER EXECUTION 】
  • Node.js / Edge server receives the request at RUNTIME
  • Server detects dynamic APIs (e.g. await cookies())
  • Executes server components on the fly
                                     │
                                     ▼
  【 STEP 3: FRESH DATABASE FETCHING 】
  • Queries the DB for the user id extracted from the request session
                                     │
                                     ▼
  【 STEP 4: HTML & RSC PAYLOAD STREAMING 】
  • Generates customised HTML + RSC payload per user
  • Returns the response to the browser (zero cross-user data leak)`}</Diagram>

      {/* ── Triggers ──────────────────────────────────────────────────── */}
      <H2 id="triggers">২. কী কী একটি পেজকে Dynamic-এ সুইচ করায়?</H2>

      <p>
        নিচের যেকোনো একটি ট্রিপওয়্যার পেজে ব্যবহৃত হলেই Next.js পেজটিকে Static থেকে Dynamic
        Rendering-এ শিফট করে দেয়:
      </p>

      <Note>
        <ul>
          <li>
            <strong>Dynamic APIs:</strong> <code>await cookies()</code> (ইউজারের কুকি পড়া),{" "}
            <code>await headers()</code> (ইনকামিং হেডার পড়া), বা <code>searchParams</code> প্রপ
            (URL কোয়েরি প্যারাম পড়া)।
          </li>
          <li>
            <strong>Uncached data fetching:</strong> <code>fetch()</code> রিকোয়েস্টে{" "}
            <code>{"{ cache: 'no-store' }"}</code> বা <code>revalidate: 0</code> ব্যবহার করলে।
          </li>
          <li>
            <strong>Route segment config:</strong> ফাইলের উপরে ম্যানুয়ালি{" "}
            <code>export const dynamic = &apos;force-dynamic&apos;</code> লিখে দিলে।
          </li>
        </ul>
      </Note>

      {/* ── Implementation ────────────────────────────────────────────── */}
      <H2 id="implementation">৩. প্রোডাকশন ড্যাশবোর্ড রুট</H2>

      <H3>cookies() ও searchParams দিয়ে অন-ডিমান্ড রেন্ডারিং</H3>

      <CodeBlock filename="app/dashboard/page.tsx">{`import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

interface DashboardProps {
  searchParams: Promise<{ tab?: string }>;
}

// Optional: force dynamic rendering explicitly when no dynamic API is used directly
export const dynamic = 'force-dynamic';

async function getUserProfileFromDB(token: string) {
  // Simulating an on-demand uncached database call
  return {
    id: 'usr_8921',
    name: 'Zubayer Salehin',
    role: 'Administrator',
    balance: 4500.0,
  };
}

export default async function DashboardPage({ searchParams }: DashboardProps) {
  // 1. Reading a dynamic API (cookies) switches this route to dynamic rendering
  const cookieStore = await cookies();
  const authToken = cookieStore.get('auth_token')?.value;

  if (!authToken) {
    redirect('/login');
  }

  // 2. Reading dynamic URL search parameters
  const { tab = 'overview' } = await searchParams;

  // 3. Fetch fresh user data on EVERY request
  const user = await getUserProfileFromDB(authToken);

  return (
    <div className="max-w-4xl mx-auto py-10 px-6 text-slate-100 space-y-6">
      <div className="flex items-center justify-between border-b border-slate-800 pb-4">
        <div>
          <span className="text-xs font-mono text-amber-400 bg-amber-500/10 px-2 py-1 rounded">
            Dynamic (on-demand)
          </span>
          <h1 className="text-2xl font-bold mt-2">Welcome back, {user.name}</h1>
          <p className="text-sm text-slate-400">Role: {user.role}</p>
        </div>

        <div className="text-right">
          <p className="text-xs text-slate-400">Available balance</p>
          <p className="text-xl font-bold text-emerald-400">
            \${user.balance.toFixed(2)}
          </p>
        </div>
      </div>

      <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
        <p className="text-xs text-slate-400">Current active tab:</p>
        <p className="text-sm font-semibold text-slate-200 capitalize">{tab}</p>
      </div>
    </div>
  );
}`}</CodeBlock>

      {/* ── Matrix ────────────────────────────────────────────────────── */}
      <H2 id="matrix">৪. Static বনাম Dynamic Rendering</H2>

      <Table
        head={["ডাইমেনশন", "Static Rendering (○)", "Dynamic Rendering (λ)"]}
        rows={[
          [
            "Execution time",
            <>
              Build time (<code>next build</code>)
            </>,
            "Request time (প্রতিটি ইউজার রিকোয়েস্টে)",
          ],
          [
            "Data freshness",
            "ফিক্সড — রিভ্যালিডেশন ছাড়া বদলায় না",
            "১০০% রিয়েল-টাইম লাইভ ডেটা",
          ],
          [
            "TTFB",
            "অতি দ্রুত (~১–১০ms, CDN servable)",
            "স্লোয়ার (~১০০–৫০০ms, সার্ভার কম্পিউটের ওপর নির্ভর)",
          ],
          [
            "Server CPU & DB cost",
            "শূন্য",
            "উচ্চ — প্রতি রিকোয়েস্টে সার্ভার কোড ও DB রান হয়",
          ],
          [
            "Primary use cases",
            "ব্লগ, ল্যান্ডিং পেজ, ডকুমেন্টেশন",
            "ড্যাশবোর্ড, ফিড, কার্ট, চেকআউট, প্রোফাইল",
          ],
        ]}
      />

      <Line name="ভুলু ভাই">
        এখন পুরো মেকানিজম পানির মতো পরিষ্কার! <code>cookies()</code> বা{" "}
        <code>searchParams</code> ব্যবহার করার সাথে সাথেই Next.js ড্যাশবোর্ড পেজটিকে λ Dynamic
        হিসেবে রেন্ডার করছে, আর এক ইউজারের ডেটা অন্যের কাছে লিক হওয়ার ঝুঁকি নেই!
      </Line>

      {/* ── Takeaways ─────────────────────────────────────────────────── */}
      <H2 id="takeaway">Production Takeaways</H2>

      <Note>
        <ul>
          <li>
            <strong>Protect personalised data:</strong> auth state, ইউজার প্রোফাইল বা transaction
            data যেসব পেজে আছে সেগুলো নিশ্চিতভাবে Dynamic Rendering-এ রাখুন — ইউজার-স্পেসিফিক ডেটা
            কখনোই স্ট্যাটিকালি ক্যাশ হতে দেবেন না।
          </li>
          <li>
            <strong>Mind the TTFB penalty:</strong> অন-ডিমান্ড সার্ভার রান করায় TTFB বাড়ে। স্লো
            ডেটাবেস কোয়েরি থাকলে পেজ লোড ল্যাগ করবে।
          </li>
          <li>
            <strong>Combine with streaming:</strong> ডাইনামিক রেন্ডারিংয়ের স্লোনেস দূর করার সেরা
            উপায় হলো Streaming HTML + React Suspense — পরের টপিকেই বিস্তারিত।
          </li>
        </ul>
      </Note>
    </article>
  );
}
