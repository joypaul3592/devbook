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
      bn: "সাইডবারে 'use client', ডেটাবেস ড্রাইভারে এরর",
      en: "'use client' on the sidebar, DB driver breaks",
    },
  },
  {
    id: "architecture",
    label: { bn: "Boundary ও children প্যাটার্ন", en: "Boundary and children pattern" },
  },
  {
    id: "rules",
    label: { bn: "৩টি গোল্ডেন রুল", en: "Three golden rules" },
  },
  {
    id: "implementation",
    label: { bn: "Anti-pattern ও সঠিক প্যাটার্ন", en: "Anti-pattern vs the fix" },
  },
  {
    id: "matrix",
    label: { bn: "Boundary Patterns Comparison", en: "Boundary patterns comparison" },
  },
  {
    id: "takeaway",
    label: { bn: "Production Takeaways", en: "Production takeaways" },
  },
];

export default function RenderingBoundaries() {
  return (
    <article className="doc-prose">
      {/* ── The problem ───────────────────────────────────────────────── */}
      <H2 id="the-problem" anchorOnly>
        সাইডবারে &apos;use client&apos;, ডেটাবেস ড্রাইভারে এরর
      </H2>

      <p>
        রাত ১০:১৫। ভুলু ভাই একটি অ্যাডমিন ড্যাশবোর্ডের সাইডবার বানাচ্ছেন। ড্রয়ার ওপেন/ক্লোজ করতে{" "}
        <code>useState</code> আর <code>onClick</code> দরকার, তাই কম্পোনেন্টের উপরে{" "}
        <code>&apos;use client&apos;</code> লিখে দিয়েছেন। কিন্তু ওই সাইডবারের ভেতরে তিনি সরাসরি
        ডেটাবেস ফেচ করা <code>UserProfileCard</code> আর <code>SystemStatus</code> নামে দুটো সার্ভার
        কম্পোনেন্ট ইমপোর্ট করে বসিয়েছেন! টার্মিনালে এরর —{" "}
        <code>Module not found: Can&apos;t resolve &apos;fs&apos;</code>।
      </p>

      <Line name="ভুলু ভাই">
        ফাহিম! আমি তো শুধু সাইডবারটা ওপেন-ক্লোজ করার জন্য <code>&apos;use client&apos;</code>{" "}
        দিয়েছিলাম। কিন্তু ভেতরে ইমপোর্ট করা সার্ভার কম্পোনেন্টগুলো কেন ক্লায়েন্ট বান্ডলে ঢুকে এরর
        দিচ্ছে? ক্লায়েন্ট কম্পোনেন্টের পেটে কি সার্ভার কম্পোনেন্ট রাখা যাবে না?
      </Line>

      <Line name="ফাহিম">
        ভুলু ভাই! আপনি <strong>Rendering Boundary</strong>-র একটি মারাত্মক নিয়ম ভেঙে ফেলেছেন!
        ক্লায়েন্ট কম্পোনেন্টের ভেতরে কোনো সার্ভার কম্পোনেন্ট সরাসরি import করলে Next.js সেই
        কম্পোনেন্টকেও বাধ্য হয়ে Client Component বানিয়ে ফেলে — client boundary একবার শুরু হলে তার
        ভেতরের সব সরাসরি ইমপোর্ট ক্লায়েন্ট ট্রি-র অংশ হয়ে যায়।
      </Line>

      <Line name="নেক্সট-ভাই">
        তবে সুন্দর সমাধান আছে! ক্লায়েন্ট কম্পোনেন্টকে একটি <strong>wrapper</strong> বানিয়ে তার
        ভেতরে <code>children</code> প্রপ হিসেবে সার্ভার কম্পোনেন্ট পাস করলে বাউন্ডারি অক্ষুণ্ণ থাকে!
      </Line>

      {/* ── Architecture ──────────────────────────────────────────────── */}
      <H2 id="architecture">১. Boundary ও children প্যাটার্ন</H2>

      <Diagram>{`┌─────────────────────────────────────────────────────────────────────────┐
│              SERVER VS CLIENT COMPONENT RENDERING BOUNDARY              │
└─────────────────────────────────────────────────────────────────────────┘

 DIRECT IMPORT (boundary leak):
 [ Client Component ('use client') ]
        └── direct import ──▶ [ Server Component ] ──▶ converted to a client component!
                                                       (DB / fs access breaks)

 CHILDREN PROP PATTERN (boundary preserved):
 [ Server Component (parent route / layout) ]
        │
        ├── passes server components as \`children\`
        ▼
 [ Client Wrapper ('use client') ] ──▶ hosts {children} without pulling them into the bundle`}</Diagram>

      {/* ── Rules ─────────────────────────────────────────────────────── */}
      <H2 id="rules">২. রেন্ডারিং বাউন্ডারির ৩টি গোল্ডেন রুল</H2>

      <Note>
        <ul>
          <li>
            <strong>The boundary waterfall:</strong> কোনো ফাইলে{" "}
            <code>&apos;use client&apos;</code> দিলে সেটি কেবল ওই ফাইলের সীমানা নয় — ওই ফাইল থেকে
            সরাসরি ইমপোর্ট করা সবকিছুই ক্লায়েন্ট বাউন্ডারিতে কনভার্ট হয়ে যায়।
          </li>
          <li>
            <strong>The composition pattern:</strong> ক্লায়েন্ট কম্পোনেন্টকে কনটেইনার বা শেল
            বানানোর সময় ভেতরের কনটেন্ট ইমপোর্ট না করে{" "}
            <code>children: React.ReactNode</code> প্রপ দিয়ে গ্রহণ করুন। সার্ভার কম্পোনেন্ট আগে
            সার্ভারেই রেন্ডার হয়ে প্রস্তুত থাকে, ক্লায়েন্ট র‍্যাপার কেবল সেই আউটপুট বসায়।
          </li>
          <li>
            <strong>Serialization boundary:</strong> সার্ভার থেকে ক্লায়েন্টে পাঠানো প্রপস অবশ্যই
            serializable হতে হবে — function, class বা DB connection instance পাঠানো যাবে না।
          </li>
        </ul>
      </Note>

      {/* ── Implementation ────────────────────────────────────────────── */}
      <H2 id="implementation">৩. Anti-pattern ও সঠিক প্যাটার্ন</H2>

      <H3>❌ Anti-pattern — ক্লায়েন্টে সরাসরি RSC ইমপোর্ট</H3>

      <CodeBlock filename="components/sidebar-drawer.tsx">{`'use client';

import { useState } from 'react';
// DIRECT IMPORT: a server component imported straight into a client component
import { ServerUserProfile } from './server-user-profile';

export function SidebarDrawer() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <aside className={isOpen ? 'w-64' : 'w-16'}>
      <button onClick={() => setIsOpen(!isOpen)}>Toggle</button>

      {/* This either fails the build or bundles ServerUserProfile to the client */}
      <ServerUserProfile />
    </aside>
  );
}`}</CodeBlock>

      <H3>🟢 Fix — children প্রপ দিয়ে বাউন্ডারি রক্ষা</H3>

      <CodeBlock filename="components/client-sidebar-wrapper.tsx">{`'use client';

import { useState, ReactNode } from 'react';

interface SidebarWrapperProps {
  children: ReactNode; // accepts pre-rendered server components as children
}

export function ClientSidebarWrapper({ children }: SidebarWrapperProps) {
  const [isOpen, setIsOpen] = useState(true);

  return (
    <div className="flex min-h-screen bg-slate-950 text-slate-100">
      <aside
        className={\`transition-all duration-300 border-r border-slate-800 bg-slate-900 p-4 \${
          isOpen ? 'w-64' : 'w-20'
        }\`}
      >
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="w-full text-xs font-mono bg-slate-800 hover:bg-slate-700 py-2 rounded-lg text-emerald-400 mb-6"
        >
          {isOpen ? 'Collapse sidebar' : 'Expand'}
        </button>

        {/* Renders pre-computed server output without touching the client tree */}
        <div className="space-y-4">{children}</div>
      </aside>
    </div>
  );
}`}</CodeBlock>

      <CodeBlock filename="app/dashboard/layout.tsx">{`import { ClientSidebarWrapper } from '@/components/client-sidebar-wrapper';
import { db } from '@/lib/db';

// Server component querying the database directly
async function ServerUserProfile() {
  const user = await db.user.findFirst();

  return (
    <div className="bg-slate-800/50 p-3 rounded-xl border border-slate-700 space-y-1">
      <p className="text-xs text-slate-400">Logged in as:</p>
      <p className="text-sm font-semibold text-emerald-400">
        {user?.name ?? 'Developer'}
      </p>
    </div>
  );
}

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    // The server parent wires the client wrapper and server children together
    <ClientSidebarWrapper>
      <ServerUserProfile />
      <main className="p-6">{children}</main>
    </ClientSidebarWrapper>
  );
}`}</CodeBlock>

      {/* ── Matrix ────────────────────────────────────────────────────── */}
      <H2 id="matrix">৪. Boundary Patterns Comparison</H2>

      <Table
        head={[
          "প্যাটার্ন",
          "Server component execution",
          "Client bundle footprint",
          "DB / Node API access",
        ]}
        rows={[
          [
            "ক্লায়েন্টের ভেতরে direct import",
            "ক্লায়েন্টে কনভার্ট হয়ে যায়",
            "ভারী — পুরো সাব-ট্রি বান্ডলে যায়",
            "ব্রোকেন",
          ],
          [
            <>
              <code>children</code> prop pattern
            </>,
            "১০০% সার্ভারে এক্সিকিউট হয়",
            "মিনিমাল — শুধু র‍্যাপারের JS",
            "পূর্ণ সিকিউর অ্যাক্সেস",
          ],
          [
            "Slot / layout pattern",
            "১০০% সার্ভারে এক্সিকিউট হয়",
            "অতিরিক্ত বান্ডল নেই",
            "পূর্ণ সিকিউর অ্যাক্সেস",
          ],
        ]}
      />

      <Line name="ভুলু ভাই">
        অসাধারণ! আজ থেকে আর কখনো ক্লায়েন্ট কম্পোনেন্টের ভেতরে সার্ভার কম্পোনেন্ট ডিরেক্ট ইমপোর্ট
        করব না। <code>children</code> প্যাটার্নে সাইডবারও ইন্টার‌্যাক্টিভ হলো, ডেটাবেস কোয়েরিও
        সার্ভারেই থাকল!
      </Line>

      {/* ── Takeaways ─────────────────────────────────────────────────── */}
      <H2 id="takeaway">Production Takeaways</H2>

      <Note>
        <ul>
          <li>
            <strong>Never import an RSC into a client component:</strong> ক্লায়েন্ট ফাইলে কখনো
            সার্ভার কম্পোনেন্ট ইমপোর্ট করবেন না — বাউন্ডারি ওখানেই ভাঙে।
          </li>
          <li>
            <strong>Use client components as containers:</strong> ইন্টার‌্যাক্টিভিটি দরকার হলে
            কম্পোনেন্টকে শেল হিসেবে বানান আর ভেতরের কনটেন্ট <code>children</code> /{" "}
            <code>ReactNode</code> প্রপ দিয়ে নিন।
          </li>
          <li>
            <strong>Keep boundaries leaf-level:</strong> ইউজার ইন্টার‌্যাকশন যত নিচে রাখা সম্ভব
            রাখুন, যাতে অ্যাপের বেশিরভাগ অংশ Server Component-এর পারফরম্যান্স পায়।
          </li>
        </ul>
      </Note>
    </article>
  );
}
