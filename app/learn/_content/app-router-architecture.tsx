import { Code, H2, Line, Note } from "@/components/learn/DocParts";
import type { Bi } from "@/lib/curriculum";

/** Section anchors — consumed by the "on this page" rail. */
export const headings: { id: string; label: Bi }[] = [
  { id: "the-problem", label: { bn: "সমস্যাটা", en: "The problem" } },
  { id: "folder-architecture", label: { bn: "Folder-ই architecture", en: "The folder is the architecture" } },
  { id: "layout", label: { bn: "layout.tsx", en: "layout.tsx" } },
  { id: "server-client", label: { bn: "Server না Client?", en: "Server or Client?" } },
  { id: "loading-error", label: { bn: "Loading আর Error", en: "Loading and errors" } },
  { id: "full-route", label: { bn: "পুরো route একসাথে", en: "The whole route" } },
  { id: "takeaway", label: { bn: "মনে রাখার মতো", en: "Worth remembering" } },
];

export default function AppRouterArchitecture() {
  return (
    <article className="doc-prose">
      {/* ── The problem ───────────────────────────────────────────────── */}
      <H2 id="the-problem">☕ সমস্যাটা</H2>

      <p>
        সকাল ১১টা। Joy তার নতুন SaaS-এর dashboard বানাচ্ছে। Folder বানিয়ে,{" "}
        <code>page.tsx</code> দিয়ে route তৈরি করে সে বেশ খুশি।
      </p>

      <Line name="Joy">“ভাই, routing তো easy!”</Line>

      <p>Rony ভাই পাশ থেকে বলল—</p>

      <Line name="Rony">
        “এখন dashboard-এ sidebar, loading state, error handling, server-side data
        fetching আর একটা interactive button যোগ করো।”
      </Line>

      <Line name="Joy">“একটা button-এর জন্য এত কিছু কেন?”</Line>
      <Line name="Rony">“Button-এর জন্য না। Architecture-এর জন্য।”</Line>

      <Note>
        <p>
          App Router শুধু routing system না। এটা এমন একটা{" "}
          <strong>application architecture</strong>, যেখানে routing, layout,
          rendering, loading UI, error boundary — সবকিছু একই folder structure-এর
          সাথে বাঁধা।
        </p>
      </Note>

      {/* ── Folder is architecture ────────────────────────────────────── */}
      <H2 id="folder-architecture">📁 Folder-ই architecture</H2>

      <p>
        নিয়ম মাত্র দুটো — প্রতিটা folder একটা route segment, আর ভেতরের{" "}
        <code>page.tsx</code> সেই segment-এর UI। তাই structure-টা নিজেই URL গুলো
        বলে দেয়:
      </p>

      <Code>{`app/
├── page.tsx                 →  /
├── dashboard/
│   └── page.tsx             →  /dashboard
└── products/
    └── [id]/
        └── page.tsx         →  /products/:id`}</Code>

      <p>এটাই App Router-এর প্রথম building block।</p>

      {/* ── Layout ────────────────────────────────────────────────────── */}
      <H2 id="layout">🏠 layout.tsx — যেটা বারবার লিখতে হয় না</H2>

      <p>
        Joy-এর <code>/dashboard</code>, <code>/dashboard/users</code> আর{" "}
        <code>/dashboard/settings</code> — তিনটারই একই Sidebar আর Header দরকার।
      </p>

      <Line name="Joy">“তিন জায়গায় তিনবার লিখব?”</Line>
      <Line name="Rony">“না। একবার layout-এ লিখবে।”</Line>

      <p>
        <code>dashboard/</code> folder-এ একটা <code>layout.tsx</code> রাখলেই সেটা
        ভেতরের সব page-কে wrap করে — Sidebar আর Header একবার লেখা হয়, তিন জায়গায়
        কাজ করে।
      </p>

      <p>Layout গুলো একটার ভেতর আরেকটা বসে — গাছের মতো:</p>

      <Code>{`Root Layout
│
├── Dashboard Layout        ← Sidebar এখানে
│   ├── Dashboard Page
│   ├── Users Page
│   └── Settings Page
│
└── Products Page`}</Code>

      <p>
        Navigation-এর সময় layout সাধারণত preserved থাকে — শুধু ভেতরের page অংশটা
        বদলায়। তাই sidebar-এর scroll বা open/close state হারায় না।
      </p>

      {/* ── Server / Client ───────────────────────────────────────────── */}
      <H2 id="server-client">⚡ Server না Client?</H2>

      <p>
        Rony ভাই <code>dashboard/page.tsx</code> খুলে লিখল:
      </p>

      <Code>{`export default async function DashboardPage() {
  const data = await getDashboardData();
  return <Dashboard data={data} />;
}`}</Code>

      <Line name="Joy">
        “এখানে তো <code>useEffect()</code> নেই! API call কোথায়?”
      </Line>
      <Line name="Rony">“Server-এ।”</Line>

      <p>
        App Router-এ প্রতিটা component default হিসেবে{" "}
        <strong>Server Component</strong> — সরাসরি <code>await</code> করে data আনতে
        পারে, আর তার code browser-এ যায় না।
      </p>

      <p>
        কিন্তু <code>useState</code> বা <code>onClick</code> browser-এর কাজ। সেটার
        জন্য দরকার Client Component:
      </p>

      <Code>{`"use client";

export function LikeButton() {
  const [liked, setLiked] = useState(false);
  return <button onClick={() => setLiked(!liked)}>Like</button>;
}`}</Code>

      <p>এখানেই Joy একটা ভুল করল — পুরো dashboard-এ সে লিখে দিল:</p>

      <Code>{`"use client";

export default function Dashboard() {
  // 500 lines...
}`}</Code>

      <Line name="Rony">“কেন?”</Line>
      <Line name="Joy">“আমার একটা button আছে।”</Line>
      <Line name="Rony">“তাহলে button-টাই client করো।”</Line>

      <p>
        একই page-এ <code>ProductList</code> আর <code>ProductCard</code> server-এই
        থাকতে পারে, শুধু <code>LikeButton</code>-এর মাথায় বসবে{" "}
        <code>&quot;use client&quot;</code>।
      </p>

      <Note>
        <p>
          <strong>Client boundary যতটুকু দরকার, ঠিক ততটুকুই রাখো।</strong>
        </p>
        <p>
          প্রতিটা Client Component-এর সাথে JavaScript bundle আর hydration-এর খরচ
          আসে। বাকিটা server-এ রাখলে browser-এ কম code পাঠাতে হয়।
        </p>
      </Note>

      {/* ── Loading & error ───────────────────────────────────────────── */}
      <H2 id="loading-error">⏳ Loading আর 💥 Error</H2>

      <p>Joy-এর API একটু slow। User /dashboard খুলল, screen ২ second blank।</p>

      <Line name="Rony">
        “তোমার <code>loading.tsx</code> কোথায়?”
      </Line>

      <p>
        ওই segment-এ একটা <code>loading.tsx</code> রাখলেই data আসা পর্যন্ত Next.js
        সেটা দেখায় — request আসে, loading UI দেখা যায়, data ready হলে আসল
        dashboard বসে যায়। পুরোটাই React Suspense-এর উপরে দাঁড়ানো streaming।
      </p>

      <p>পরদিন database down। পুরো app crash?</p>

      <Line name="Rony">
        “না। <code>error.tsx</code> ওই segment-টুকুই ধরে ফেলে।”
      </Line>

      <p>
        <code>error.tsx</code> সেই route segment-এর error boundary — নিজে Client
        Component হতে হয়, আর <code>reset()</code> দিয়ে আবার চেষ্টা করা যায়। আর
        resource-ই না থাকলে <code>notFound()</code> ডেকে <code>not-found.tsx</code>{" "}
        দেখানো যায়।
      </p>

      <p>একটা route-এর সমস্যা যেন পুরো application না নামায় — এটাই আসল লাভ।</p>

      {/* ── Full route ────────────────────────────────────────────────── */}
      <H2 id="full-route">🧩 পুরো route একসাথে</H2>

      <p>সব মিলিয়ে একটা production route পাঁচটা file নিয়ে দাঁড়ায়:</p>

      <ul>
        <li>
          <code>layout.tsx</code> — shared UI
        </li>
        <li>
          <code>page.tsx</code> — route-এর নিজের UI
        </li>
        <li>
          <code>loading.tsx</code> — data আসার আগ পর্যন্ত
        </li>
        <li>
          <code>error.tsx</code> — কিছু ভাঙলে
        </li>
        <li>
          <code>not-found.tsx</code> — resource নেই
        </li>
      </ul>

      <p>
        এগুলো আলাদা random file না — এগুলো মিলেই route-এর{" "}
        <strong>UI + loading + error architecture</strong>। আর এক route থেকে আরেক
        route-এ যাওয়ার সময় পুরো page reload হয় না; App Router শুধু প্রয়োজনীয় অংশটা
        client-side-এ বদলে দেয়।
      </p>

      <Line name="Joy">
        “আচ্ছা... App Router আসলে routing system না — এটা পুরো application-এর
        structure।”
      </Line>
      <Line name="Rony">“Exactly.”</Line>

      {/* ── Takeaway ──────────────────────────────────────────────────── */}
      <H2 id="takeaway">🎯 মনে রাখার মতো</H2>

      <ul>
        <li>
          UI কি একটা route? → <code>page.tsx</code>
        </li>
        <li>
          একাধিক route-এ shared? → <code>layout.tsx</code>
        </li>
        <li>
          Interactive (state / onClick)? → <code>&quot;use client&quot;</code>
        </li>
        <li>শুধু data দেখাচ্ছে? → Server Component, অর্থাৎ default</li>
        <li>
          Load হতে সময় লাগে? → <code>loading.tsx</code> বা{" "}
          <code>Suspense</code>
        </li>
        <li>
          Crash করতে পারে? → <code>error.tsx</code>
        </li>
        <li>
          Resource নেই? → <code>notFound()</code>
        </li>
      </ul>

      <p>
        এই সাতটা প্রশ্নের উত্তর জানা থাকলে App Router-এর architecture তোমার হাতে।
      </p>
    </article>
  );
}
