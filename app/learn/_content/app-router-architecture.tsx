import { Code, H2, Line, Note } from "@/components/learn/DocParts";
import type { Bi } from "@/lib/curriculum";

/** Section anchors — consumed by the "on this page" rail. */
export const headings: { id: string; label: Bi }[] = [
  { id: "the-problem", label: { bn: "☕ The Problem", en: "☕ The Problem" } },
  { id: "what-is-app-router", label: { bn: "🧠 App Router আসলে কী?", en: "🧠 What is the App Router?" } },
  { id: "app-folder", label: { bn: "📁 app/ folder কী?", en: "📁 What is the app/ folder?" } },
  { id: "page-tsx", label: { bn: "🧩 প্রথম রহস্য — page.tsx", en: "🧩 First mystery — page.tsx" } },
  { id: "layout-tsx", label: { bn: "🏠 layout.tsx কী?", en: "🏠 What is layout.tsx?" } },
  { id: "architecture", label: { bn: "🧠 আসল Architecture", en: "🧠 The real architecture" } },
  { id: "tree", label: { bn: "🌳 Tree-এর মতো ভাবো", en: "🌳 Think of it as a tree" } },
  { id: "server-component", label: { bn: "🖥️ Server Component", en: "🖥️ Server Component" } },
  { id: "client-component", label: { bn: "🧱 Client Component", en: "🧱 Client Component" } },
  { id: "boundary", label: { bn: "🚧 Server / Client Boundary", en: "🚧 Server / Client Boundary" } },
  { id: "production-rule", label: { bn: "🎯 Production Rule", en: "🎯 Production Rule" } },
  { id: "loading", label: { bn: "⏳ Loading Problem", en: "⏳ The loading problem" } },
  { id: "error", label: { bn: "💥 Error!", en: "💥 Error!" } },
  { id: "not-found", label: { bn: "🚫 Product পাওয়া গেল না?", en: "🚫 Product not found?" } },
  { id: "complete-route", label: { bn: "🧩 Complete route", en: "🧩 A complete route" } },
  { id: "navigation", label: { bn: "🚀 Navigation", en: "🚀 Navigation" } },
  { id: "mental-model", label: { bn: "🧠 Final Mental Model", en: "🧠 Final mental model" } },
  { id: "takeaway", label: { bn: "🎯 Production Takeaway", en: "🎯 Production takeaway" } },
];

export default function AppRouterArchitecture() {
  return (
    <article className="doc-prose">
      {/* ── The Problem ───────────────────────────────────────────────── */}
      <H2 id="the-problem">☕ Chapter 01 — The Problem</H2>

      <p>সকাল ১১টা।</p>
      <p>Joy তার নতুন SaaS application-এর dashboard নিয়ে বসে আছে।</p>
      <p>Project structure এখন এমন:</p>

      <Code>{`app/
├── page.tsx
├── dashboard/
│   ├── page.tsx
│   ├── users/
│   │   └── page.tsx
│   └── settings/
│       └── page.tsx
└── products/
    └── page.tsx`}</Code>

      <p>Joy বেশ খুশি।</p>

      <Line name="Joy">
        “ভাই, routing তো easy! Folder বানালাম, <code>page.tsx</code> দিলাম, route
        তৈরি হয়ে গেল।”
      </Line>

      <p>Rony ভাই পাশ থেকে laptop-এর দিকে তাকিয়ে বলল—</p>

      <Line name="Rony">
        “হুম... এখন dashboard-এ একটা sidebar, loading state, error handling,
        server-side data fetching আর একটা interactive button যোগ করো।”
      </Line>

      <p>Joy একটু থেমে গেল।</p>

      <Line name="Joy">“একটা button-এর জন্য এত কিছু কেন?”</Line>
      <Line name="Rony">“Button-এর জন্য না। Application architecture-এর জন্য।”</Line>

      <p>
        Joy আবার <code>app/</code> folder-এর দিকে তাকাল।
      </p>

      <Line name="Joy">
        “তাহলে <code>app/</code> আসলে শুধু routing-এর জন্য না?”
      </Line>

      <p>Rony ভাই হাসল।</p>

      <Line name="Rony">“এখন তুমি আসল প্রশ্নটা করেছ।”</Line>

      {/* ── What is App Router ────────────────────────────────────────── */}
      <H2 id="what-is-app-router">🧠 App Router আসলে কী?</H2>

      <p>অনেকেই ভাবে:</p>

      <blockquote>App Router = নতুন routing system</blockquote>

      <p>এটা পুরোপুরি ভুল না, কিন্তু অসম্পূর্ণ।</p>

      <Note>
        <p>
          Next.js-এর App Router হলো এমন একটি <strong>application architecture</strong>,
          যেখানে routing-এর সাথে layouts, rendering, Server Components, loading UI,
          error boundaries এবং server/client separation — সবকিছু একই route
          structure-এর সাথে যুক্ত থাকে।
        </p>
      </Note>

      <p>
        Next.js-এর official documentation-ও App Router-কে Pages Router-এর newer
        router হিসেবে বর্ণনা করে, যা নতুন React features যেমন Server Components
        support করে।
      </p>

      <p>মানে:</p>

      <Code>{`App Router
    │
    ├── Routing
    ├── Layout
    ├── Rendering
    ├── Server Components
    ├── Client Components
    ├── Loading
    ├── Error Handling
    └── Streaming`}</Code>

      <p>
        তাই App Router-কে শুধু “folder-based routing” হিসেবে ভাবলে তুমি এর বড় অংশ
        miss করবে।
      </p>

      {/* ── app folder ────────────────────────────────────────────────── */}
      <H2 id="app-folder">
        📁 তাহলে <code>app/</code> folder কী?
      </H2>

      <p>ধরো Joy-এর application:</p>

      <Code>{`app/
├── layout.tsx
├── page.tsx
│
├── dashboard/
│   ├── layout.tsx
│   ├── page.tsx
│   ├── loading.tsx
│   └── error.tsx
│
├── products/
│   ├── page.tsx
│   └── [id]/
│       └── page.tsx
│
└── settings/
    └── page.tsx`}</Code>

      <p>
        এখানে folder এবং special files মিলে application-এর architecture তৈরি করছে।
      </p>

      <p>
        Next.js file-system routing ব্যবহার করে — folder route segment তৈরি করে, আর{" "}
        <code>page.tsx</code> সেই segment-কে publicly accessible route বানায়।
      </p>

      {/* ── page.tsx ──────────────────────────────────────────────────── */}
      <H2 id="page-tsx">
        🧩 প্রথম রহস্য: <code>page.tsx</code>
      </H2>

      <p>Joy জিজ্ঞেস করল:</p>

      <Line name="Joy">
        “তাহলে <code>page.tsx</code> কী?”
      </Line>

      <p>Rony ভাই বলল:</p>

      <blockquote>“একটা route-এর actual UI।”</blockquote>

      <p>যেমন:</p>

      <Code>{`app/
└── dashboard/
    └── page.tsx        →  /dashboard

app/
└── products/
    └── page.tsx        →  /products

app/
└── products/
    └── [id]/
        └── page.tsx    →  /products/:id`}</Code>

      <p>অর্থাৎ:</p>

      <Code>{`Folder        → Route Segment
page.tsx      → UI for that route`}</Code>

      <p>এটাই App Router-এর প্রথম building block।</p>

      {/* ── layout.tsx ────────────────────────────────────────────────── */}
      <H2 id="layout-tsx">
        🏠 কিন্তু <code>layout.tsx</code> কী?
      </H2>

      <p>Joy এবার একটু excited।</p>

      <Line name="Joy">
        “ঠিক আছে। <code>page.tsx</code> বুঝলাম। কিন্তু <code>layout.tsx</code> কেন?”
      </Line>

      <p>Rony ভাই একটা example দিল। ধরো:</p>

      <Code>{`/dashboard
/dashboard/users
/dashboard/settings`}</Code>

      <p>তিনটা page-এরই একই Sidebar, Header, Navigation দরকার।</p>

      <p>তাহলে কি প্রতিটা page-এ আবার লিখবে?</p>

      <Code>{`<Sidebar />
<Header />`}</Code>

      <p>না। এখানে আসে:</p>

      <Code>{`dashboard/
├── layout.tsx
├── page.tsx
├── users/
│   └── page.tsx
└── settings/
    └── page.tsx`}</Code>

      <p>
        <code>dashboard/layout.tsx</code> shared UI-এর একটা wrapper হিসেবে কাজ করবে।
      </p>

      <p>Conceptually:</p>

      <Code>{`Dashboard Layout
│
├── Sidebar
├── Header
│
└── children
      │
      ├── Dashboard Page
      ├── Users Page
      └── Settings Page`}</Code>

      <p>
        Next.js-এর nested layouts parent layout-এর মধ্যে child page/layout-কে nest
        করে। Navigation-এর সময় layout সাধারণত preserved থাকে, ফলে page অংশ update
        হলেও shared layout-এর state preserve করা যায় — এটাকে partial rendering-এর
        অংশ হিসেবে ব্যাখ্যা করা হয়।
      </p>

      {/* ── Architecture ──────────────────────────────────────────────── */}
      <H2 id="architecture">🧠 এবার আসল Architecture</H2>

      <p>এখন Joy-এর project একটু বড় করি:</p>

      <Code>{`app/
│
├── layout.tsx
│
├── dashboard/
│   ├── layout.tsx
│   ├── page.tsx
│   │
│   ├── users/
│   │   └── page.tsx
│   │
│   └── settings/
│       └── page.tsx
│
└── products/
    └── page.tsx`}</Code>

      <p>এখন structure-টা এমন:</p>

      <Code>{`Root Layout
│
├── Dashboard Layout
│   │
│   ├── Dashboard Page
│   ├── Users Page
│   └── Settings Page
│
└── Products Page`}</Code>

      <p>এটাই nested layout architecture।</p>

      {/* ── Tree ──────────────────────────────────────────────────────── */}
      <H2 id="tree">🌳 Tree-এর মতো ভাবো</H2>

      <p>App Router-কে একটা গাছের মতো ভাবতে পারো।</p>

      <Code>{`                    Root Layout
                        │
             ┌──────────┴──────────┐
             │                     │
        Dashboard              Products
             │
       Dashboard Layout
             │
       ┌─────┼──────┐
       │     │      │
     Home   Users  Settings`}</Code>

      <p>প্রতিটি folder একটা route segment।</p>
      <p>আর প্রতিটি layout সেই segment-এর নিচের UI-কে wrap করে।</p>
      <p>এই mental model-টা খুব গুরুত্বপূর্ণ।</p>

      {/* ── Server Component ──────────────────────────────────────────── */}
      <H2 id="server-component">⚡ App Router-এর সবচেয়ে বড় পরিবর্তন</H2>

      <p>Joy ভাবছিল: “ঠিক আছে, layout আর routing বুঝলাম।”</p>

      <Line name="Rony">
        “না, এখনো App Router-এর সবচেয়ে important জিনিসটা দেখোনি।”
      </Line>

      <p>
        সে <code>dashboard/page.tsx</code> খুলে লিখল:
      </p>

      <Code>{`export default async function DashboardPage() {
  const data = await getDashboardData();

  return (
    <div>
      <h1>Dashboard</h1>
      {/* render data */}
    </div>
  );
}`}</Code>

      <p>Joy অবাক।</p>

      <Line name="Joy">
        “এখানে তো <code>useEffect()</code> নেই!”
      </Line>
      <Line name="Rony">“থাকার দরকারও নেই।”</Line>
      <Line name="Joy">“API call কোথায়?”</Line>
      <Line name="Rony">“Server-এ।”</Line>

      <h3>🖥️ Server Component</h3>

      <p>
        App Router-এ components default হিসেবে <strong>Server Components</strong>।
        অর্থাৎ component-এর code server environment-এ render হতে পারে, এবং
        server-side data fetching-এর সুবিধা পাওয়া যায়।
      </p>

      <p>তাই এটা করতে পারো:</p>

      <Code>{`export default async function Page() {
  const products = await getProducts();

  return <ProductList products={products} />;
}`}</Code>

      <p>তোমাকে সবসময় এটা করতে হবে না:</p>

      <Code>{`"use client";

useEffect(() => {
  fetch(...)
}, []);`}</Code>

      {/* ── Client Component ──────────────────────────────────────────── */}
      <H2 id="client-component">🧱 তাহলে Client Component কোথায়?</H2>

      <Line name="Joy">
        “কিন্তু button click? Modal? <code>useState()</code>?”
      </Line>
      <Line name="Rony">“ওগুলো browser-এর কাজ।”</Line>

      <p>ধরো:</p>

      <Code>{`"use client";

import { useState } from "react";

export function LikeButton() {
  const [liked, setLiked] = useState(false);

  return (
    <button onClick={() => setLiked(!liked)}>
      {liked ? "Liked" : "Like"}
    </button>
  );
}`}</Code>

      <p>এখানে:</p>

      <Code>{`"use client"
      ↓
Client Boundary
      ↓
Browser-side interactivity`}</Code>

      <p>
        <code>useState</code>, event handlers-এর মতো client-side interactivity দরকার
        হলে Client Component ব্যবহার করতে হয়।
      </p>

      {/* ── Boundary ──────────────────────────────────────────────────── */}
      <H2 id="boundary">🚧 Server / Client Boundary</H2>

      <p>
        এটাই App Router architecture-এর সবচেয়ে important mental model-গুলোর একটা।
      </p>

      <p>ধরো:</p>

      <Code>{`Dashboard Page
│
├── ProductList        ← Server
│
├── ProductCard        ← Server
│
└── LikeButton         ← Client`}</Code>

      <p>এখানে পুরো page-কে Client Component বানানোর দরকার নেই।</p>

      <p>
        শুধু যেটার interactivity দরকার — <code>LikeButton</code> — সেটাকে client
        boundary করা যায়।
      </p>

      <p>
        React/Next.js এই server এবং client অংশকে আলাদা module graphs হিসেবে process
        করে। Server Components-এর rendered result এবং Client Components-এর প্রয়োজনীয়
        references-সহ <strong>RSC Payload</strong> browser-এ পাঠানো হয়।
      </p>

      {/* ── Production rule ───────────────────────────────────────────── */}
      <H2 id="production-rule">🎯 Production Rule</H2>

      <p>এখানে Joy একটা ভুল করল। সে লিখল:</p>

      <Code>{`"use client";

export default function Dashboard() {
  // 500 lines...
}`}</Code>

      <Line name="Rony">“কেন?”</Line>
      <Line name="Joy">“আমার একটা button আছে।”</Line>
      <Line name="Rony">
        “তাহলে button-টা client করো। পুরো dashboard-কে কেন browser-এর দায়িত্ব দিচ্ছ?”
      </Line>

      <Note>
        <p>
          <strong>
            Client Component যতটুকু দরকার, boundary ততটুকুই রাখো।
          </strong>
        </p>
        <p>
          কারণ Client Component-এর সাথে client-side JavaScript bundle এবং hydration-এর
          প্রয়োজন আসে। Server-side rendering/data fetching ব্যবহার করে client-এ পাঠানো
          code কমানোর সুযোগ থাকে।
        </p>
      </Note>

      {/* ── Loading ───────────────────────────────────────────────────── */}
      <H2 id="loading">⏳ এবার Loading Problem</H2>

      <p>Joy-এর dashboard API একটু slow। User /dashboard খুলল।</p>
      <p>কিন্তু data আসতে ২ second লাগছে।</p>

      <Line name="Joy">“ভাই, পুরো screen blank হয়ে আছে!”</Line>
      <Line name="Rony">
        “তোমার <code>loading.tsx</code> কোথায়?”
      </Line>

      <Code>{`dashboard/
├── page.tsx
└── loading.tsx`}</Code>

      <p>
        <code>loading.tsx</code> হলো সেই route segment-এর loading UI।
      </p>

      <Code>{`export default function Loading() {
  return <DashboardSkeleton />;
}`}</Code>

      <p>
        Next.js-এর <code>loading.tsx</code> React Suspense-এর উপর ভিত্তি করে
        streaming-এর জন্য fallback UI তৈরি করে। চাইলে আরও granular control-এর জন্য
        নিজে <code>&lt;Suspense&gt;</code> ব্যবহার করা যায়।
      </p>

      <p>Flow:</p>

      <Code>{`User requests /dashboard
          ↓
Dashboard starts rendering
          ↓
Data এখনও আসেনি
          ↓
Loading UI
          ↓
Data ready
          ↓
Dashboard UI`}</Code>

      <p>এটাই Streaming-এর entry point।</p>

      {/* ── Error ─────────────────────────────────────────────────────── */}
      <H2 id="error">💥 এবার Error!</H2>

      <p>Database down। Joy-এর dashboard crash করল।</p>

      <Line name="Joy">“ভাই! পুরো application শেষ!”</Line>
      <Line name="Rony">“না। Error boundary আছে।”</Line>

      <Code>{`dashboard/
├── page.tsx
└── error.tsx`}</Code>

      <p>
        <code>error.tsx</code> route segment-এর error boundary হিসেবে fallback UI
        দেখাতে পারে। Next.js documentation অনুযায়ী <code>error.tsx</code> নিজেই
        Client Component হতে হয় এবং <code>reset()</code> দিয়ে failed segment আবার
        render করার চেষ্টা করা যায়।
      </p>

      <Code>{`Dashboard
   │
   ├── Page
   │
   └── Error
        ↓
   Something went wrong
        ↓
      Retry`}</Code>

      <p>
        একটা route-এর problem যেন পুরো application ধ্বংস না করে — এটাই architectural
        benefit।
      </p>

      {/* ── notFound ──────────────────────────────────────────────────── */}
      <H2 id="not-found">🚫 Product পাওয়া গেল না?</H2>

      <p>
        এবার <code>/products/123</code> — কিন্তু database-এ product 123 নেই।
      </p>

      <p>এখানে সাধারণ error আর 404 এক জিনিস না। তুমি করতে পারো:</p>

      <Code>{`import { notFound } from "next/navigation";

export default async function ProductPage() {
  const product = await getProduct();

  if (!product) {
    notFound();
  }

  return <Product product={product} />;
}`}</Code>

      <p>আর:</p>

      <Code>{`products/
└── [id]/
    ├── page.tsx
    └── not-found.tsx`}</Code>

      <p>
        <code>notFound()</code> resource না পাওয়া গেলে 404 UI দেখানোর জন্য ব্যবহার করা
        যায়।
      </p>

      {/* ── Complete route ────────────────────────────────────────────── */}
      <H2 id="complete-route">🧩 একটা complete route কী নিয়ে তৈরি?</H2>

      <p>এখন Joy-এর মাথায় পুরো picture আসতে শুরু করেছে।</p>

      <p>একটা production route হতে পারে:</p>

      <Code>{`dashboard/
│
├── layout.tsx
│
├── page.tsx
│
├── loading.tsx
│
├── error.tsx
│
└── not-found.tsx`}</Code>

      <p>এগুলো আলাদা আলাদা random file না।</p>

      <p>
        এগুলো মিলে route-এর <strong>UI + state + error architecture</strong> তৈরি করে।
      </p>

      {/* ── Navigation ────────────────────────────────────────────────── */}
      <H2 id="navigation">🚀 আর navigation?</H2>

      <p>
        Joy <code>/dashboard</code> থেকে <code>/dashboard/users</code>-এ গেল। Browser
        কি পুরো page reload করবে?
      </p>

      <p>
        না, App Router client-side navigation এবং route-level code splitting ব্যবহার
        করতে পারে। Production-এ viewport-এ থাকা <code>Link</code> destination-এর code
        prefetch-ও করতে পারে, ফলে navigation দ্রুত অনুভূত হতে পারে।
      </p>

      <Code>{`/dashboard
     │
     │ navigation
     ↓
/dashboard/users`}</Code>

      <p>পুরো application নতুন করে শুরু না করে প্রয়োজনীয় route অংশ update হতে পারে।</p>

      {/* ── Mental model ──────────────────────────────────────────────── */}
      <H2 id="mental-model">🧠 এখন পুরো App Router-কে একবার দেখো</H2>

      <Code>{`                         App Router
                             │
       ┌─────────────────────┼─────────────────────┐
       ↓                     ↓                     ↓
    Routing               Layouts              Rendering
       │                     │                     │
   page.tsx             layout.tsx          Server Components
   dynamic routes       nested layouts      Client Components
   route groups                                   RSC
       │
       ├──────────────┐
       ↓              ↓
   Loading          Errors
 loading.tsx       error.tsx
       │              │
       ↓              ↓
   Streaming       Error Boundary`}</Code>

      <Note>
        <p>
          <strong>
            App Router শুধু URL manage করে না; এটা application-এর rendering এবং UI
            architecture-এর foundation।
          </strong>
        </p>
      </Note>

      <p>Rony ভাই whiteboard-এ লিখল:</p>

      <Code>{`                APP ROUTER
                     │
              ┌──────┴──────┐
              │             │
           ROUTES         UI TREE
              │             │
          folders        layouts
          page.tsx       pages
              │             │
              └──────┬──────┘
                     │
              Server / Client
                  Boundary
                     │
             ┌───────┴───────┐
             ↓               ↓
          Server           Browser
        Components       Client Components
             │               │
             └───────┬───────┘
                     ↓
              Streaming / RSC
                     │
                     ↓
                  User`}</Code>

      <Line name="Joy">
        “আচ্ছা... এখন বুঝতে পারছি। App Router আসলে routing system না — এটা পুরো
        application-এর structure।”
      </Line>
      <Line name="Rony">“Exactly.”</Line>

      {/* ── Takeaway ──────────────────────────────────────────────────── */}
      <H2 id="takeaway">🎯 Production Takeaway</H2>

      <p>
        একজন production-level Next.js developer হিসেবে তোমার মাথায় এই decision tree
        থাকা উচিত:
      </p>

      <Code>{`এই UI কি route?
       ↓
    page.tsx

এই UI কি multiple route-এ shared?
       ↓
    layout.tsx

এই UI কি interactive?
       ↓
    Client Component

এই UI কি server-side data নিয়ে কাজ করতে পারে?
       ↓
    Server Component

এই route load হতে সময় লাগে?
       ↓
    loading.tsx / Suspense

এই route segment crash করতে পারে?
       ↓
    error.tsx

এই resource পাওয়া যায়নি?
       ↓
    notFound()`}</Code>

      <p>এটাই App Router-এর practical architecture।</p>
    </article>
  );
}
