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
      bn: "UI-তে নেই, RSC Payload-এ আছে",
      en: "Not on screen, but in the payload",
    },
  },
  {
    id: "architecture",
    label: { bn: "RSC Data Leak ফ্লো", en: "RSC data leak flow" },
  },
  {
    id: "risks",
    label: { bn: "২টি প্রধান ঝুঁকি", en: "The two main risks" },
  },
  {
    id: "implementation",
    label: { bn: "server-only ও DTO প্যাটার্ন", en: "server-only and the DTO pattern" },
  },
  {
    id: "matrix",
    label: { bn: "Security Practices Comparison", en: "Security practices comparison" },
  },
  {
    id: "takeaway",
    label: { bn: "Production Takeaways", en: "Production takeaways" },
  },
];

export default function ServerComponentSecurityDataLeaks() {
  return (
    <article className="doc-prose">
      {/* ── The problem ───────────────────────────────────────────────── */}
      <H2 id="the-problem" anchorOnly>
        UI-তে নেই, RSC Payload-এ আছে
      </H2>

      <p>
        রাত ১১:৪৫। ভুলু ভাই ইউজারের প্রোফাইল সেটিংস পেজ বানাচ্ছিলেন। ডেটাবেস থেকে User অবজেক্ট ফেচ
        করে তিনি পুরো অবজেক্টটি প্রপ হিসেবে <code>&lt;UserProfileForm user={"{user}"} /&gt;</code>{" "}
        ক্লায়েন্ট কম্পোনেন্টে পাঠিয়ে দিয়েছেন। UI-তে শুধু নাম আর ইমেইল দেখাচ্ছে — সব ঠিকই ছিল। কিন্তু
        ফাহিম DevTools-এ <code>?_rsc=...</code> পেলোড খুলতেই চোখ কপালে!{" "}
        <code>hashedPassword</code>, <code>stripeCustomerId</code>,{" "}
        <code>twoFactorSecret</code> — সব প্লেইন টেক্সটে ব্রাউজারে লিক হয়ে গেছে!
      </p>

      <Line name="ভুলু ভাই">
        ফাহিম! এ কী সর্বনাশ! আমি তো UI-তে পাসওয়ার্ড বা টু-ফ্যাক্টর সিক্রেট রেন্ডার করিনি! তাহলে
        এগুলো ব্রাউজারে নামল কীভাবে?
      </Line>

      <Line name="ফাহিম">
        ভুলু ভাই! এটাই <strong>RSC Payload Data Leakage</strong>! সার্ভার কম্পোনেন্ট থেকে
        ক্লায়েন্ট কম্পোনেন্টে যা-ই প্রপ হিসেবে পাঠাবেন, React সেটিকে JSON RSC Payload হিসেবে
        ব্রাউজারে পাঠিয়ে দেয়। আপনি UI-তে দেখান আর না দেখান — ডেটা নেটওয়ার্কে চলে যায়!
      </Line>

      <Line name="নেক্সট-ভাই">
        App Router-এ সিকিউরিটির দুটি প্রধান নিয়ম: প্রথমত <code>server-only</code> প্যাকেজ দিয়ে
        সার্ভার কোড ক্লায়েন্ট বান্ডলে ঢোকা আটকানো, আর দ্বিতীয়ত DTO বা প্রপ ফিল্টারিং দিয়ে শুধু
        প্রয়োজনীয় ডেটাই বাউন্ডারি অতিক্রম করতে দেওয়া।
      </Line>

      {/* ── Architecture ──────────────────────────────────────────────── */}
      <H2 id="architecture">১. RSC Data Leakage Flow</H2>

      <Diagram>{`┌─────────────────────────────────────────────────────────────────────────┐
│              RSC PROPS SERIALIZATION & DATA LEAK FLOW                   │
└─────────────────────────────────────────────────────────────────────────┘

 UNSANITIZED PROPS (security risk):
 Server component ──▶ fetches { id, name, email, hashedPassword, apiSecret }
                            │
                            ▼ (passes the raw user object as a prop)
 Client component ('use client')
                            │
                            ▼
 Browser network tab ──▶ RSC payload contains hashedPassword & apiSecret — LEAKED

 -------------------------------------------------------------------------

 SANITIZED DTO PATTERN (production safe):
 Server component ──▶ fetches the full user record from the DB
                            │
                            ▼ (picks ONLY public fields)
 Client component ──▶ receives { id, name, email } only
                            │
                            ▼
 Browser network tab ──▶ RSC payload contains only public UI data — SECURE`}</Diagram>

      {/* ── Risks ─────────────────────────────────────────────────────── */}
      <H2 id="risks">২. সার্ভার কম্পোনেন্ট সিকিউরিটির ২টি ঝুঁকি</H2>

      <Note>
        <ul>
          <li>
            <strong>RSC payload serialization leak:</strong> সার্ভার থেকে ক্লায়েন্টে পাঠানো প্রতিটি
            প্রপ JSON serialize হয়ে ব্রাউজারে যায়। ডেটাবেস অবজেক্ট হুবহু পাঠালে hashed password,
            internal key বা reset token আক্রমণকারী Network Tab থেকেই পড়ে নিতে পারে।
          </li>
          <li>
            <strong>Accidental server code import:</strong> ডেটাবেস হেলপার বা সিক্রেট key-যুক্ত
            ইউটিলিটি ফাইল ভুলবশত কোনো <code>&apos;use client&apos;</code> ফাইলে ইমপোর্ট হলে Next.js
            সেটিকে ক্লায়েন্ট বান্ডলে যুক্ত করে দেয় — সিক্রেট ইউজারের ডিভাইসে ডাউনলোড হয়ে যায়।
          </li>
        </ul>
      </Note>

      {/* ── Implementation ────────────────────────────────────────────── */}
      <H2 id="implementation">৩. server-only ও DTO প্যাটার্ন</H2>

      <H3>❌ Anti-pattern — raw DB object সরাসরি ক্লায়েন্টে</H3>

      <CodeBlock filename="app/settings/page.tsx">{`import { db } from '@/lib/db';
import { UserProfileForm } from './_components/user-profile-form';

export default async function SettingsPage() {
  const rawUser = await db.user.findUnique({ where: { id: 'usr_123' } });
  // rawUser holds: { id, name, email, hashedPassword, stripeSecretKey, internalNotes }

  return (
    <div>
      {/* DANGER: the entire raw DB record is serialized into the RSC payload */}
      <UserProfileForm user={rawUser} />
    </div>
  );
}`}</CodeBlock>

      <H3>🟢 Fix — server-only + sanitised DTO</H3>

      <CodeBlock filename="lib/db/user.ts">{`import 'server-only'; // 1. this module can never be pulled into the client bundle
import { db } from '@/lib/db';

// DTO describing ONLY the properties that are safe for client components
export interface SafeUserDTO {
  id: string;
  name: string;
  email: string;
}

export async function getSanitizedUser(userId: string): Promise<SafeUserDTO | null> {
  const user = await db.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      name: true,
      email: true,
      // hashedPassword, stripeSecretKey etc. are explicitly excluded
    },
  });

  return user;
}`}</CodeBlock>

      <CodeBlock filename="app/settings/page.tsx">{`import { getSanitizedUser } from '@/lib/db/user';
import { UserProfileForm } from './_components/user-profile-form';

export default async function SettingsPage() {
  // Fetch the sanitised DTO containing only safe fields
  const safeUser = await getSanitizedUser('usr_123');

  if (!safeUser) return <div>User not found</div>;

  return (
    <div className="max-w-xl mx-auto py-8 px-6 bg-slate-950 text-slate-100 space-y-4">
      <div className="border-b border-slate-800 pb-3">
        <span className="text-xs font-mono text-emerald-400 bg-emerald-500/10 px-2 py-1 rounded">
          Secure boundary applied
        </span>
        <h1 className="text-xl font-bold mt-2">Account Settings</h1>
      </div>

      {/* Only id, name and email ever reach the RSC payload */}
      <UserProfileForm user={safeUser} />
    </div>
  );
}`}</CodeBlock>

      <CodeBlock filename="app/settings/_components/user-profile-form.tsx">{`'use client';

import type { SafeUserDTO } from '@/lib/db/user';

export function UserProfileForm({ user }: { user: SafeUserDTO }) {
  return (
    <form className="space-y-4 bg-slate-900 border border-slate-800 p-4 rounded-xl">
      <div>
        <label className="text-xs text-slate-400">Name</label>
        <input
          defaultValue={user.name}
          className="w-full bg-slate-800 border border-slate-700 p-2 rounded text-sm text-slate-100 mt-1"
        />
      </div>
      <div>
        <label className="text-xs text-slate-400">Email</label>
        <input
          defaultValue={user.email}
          className="w-full bg-slate-800 border border-slate-700 p-2 rounded text-sm text-slate-100 mt-1"
        />
      </div>
      <button className="bg-emerald-600 hover:bg-emerald-500 px-4 py-2 rounded-lg text-sm font-semibold">
        Save Changes
      </button>
    </form>
  );
}`}</CodeBlock>

      <Note>
        <p>
          খেয়াল করুন, ক্লায়েন্ট ফাইলে টাইপটি <code>import type</code> দিয়ে আনা হয়েছে। সাধারণ{" "}
          <code>import</code> দিলে <code>server-only</code> মডিউলটি ক্লায়েন্ট গ্রাফে চলে আসত এবং
          বিল্ড ফেল করত — <code>import type</code> কম্পাইলের সময়ই মুছে যায়, তাই নিরাপদ।
        </p>
      </Note>

      {/* ── Matrix ────────────────────────────────────────────────────── */}
      <H2 id="matrix">৪. Security Practices Comparison</H2>

      <Table
        head={[
          "সিকিউরিটি মেজার",
          "Unsafe direct passing",
          <code key="so">server-only</code>,
          "Sanitised DTO",
        ]}
        rows={[
          [
            "RSC payload protection",
            "শূন্য — সব ডেটা ব্রাউজারে যায়",
            "পরোক্ষ — শুধু import আটকায়",
            "সম্পূর্ণ — কেবল UI ডেটা যায়",
          ],
          [
            "Build-time protection",
            "কোনো ওয়ার্নিং নেই",
            "নিশ্চিত — ক্লায়েন্ট import-এ কম্পাইল এরর",
            "টাইপ সেফটি নিশ্চিত করে",
          ],
          [
            "Secret key protection",
            "API key লিক হওয়ার ঝুঁকি",
            "সুরক্ষিত",
            "সুরক্ষিত",
          ],
        ]}
      />

      <Line name="ভুলু ভাই">
        দারুণ! <code>server-only</code> বসাতেই দুর্ঘটনাবশত ক্লায়েন্টে ইমপোর্ট হওয়া ব্যাকএন্ড ফাইল
        কম্পাইল টাইমে ধরা পড়ল, আর DTO ফিল্টারিং দিয়ে পাসওয়ার্ড লিক চিরতরে বন্ধ হলো!
      </Line>

      {/* ── Takeaways ─────────────────────────────────────────────────── */}
      <H2 id="takeaway">Production Takeaways</H2>

      <Note>
        <ul>
          <li>
            <strong>Install the server-only package:</strong> <code>npm i server-only</code> চালিয়ে
            আপনার DB, auth বা API-secret ফাইলগুলোর প্রথম লাইনে{" "}
            <code>import &apos;server-only&apos;</code> যুক্ত করুন।
          </li>
          <li>
            <strong>Never pass raw DB entities:</strong> Prisma/Drizzle বা SQL থেকে আসা পুরো row
            কখনো সরাসরি ক্লায়েন্ট কম্পোনেন্টের প্রপে পাঠাবেন না।
          </li>
          <li>
            <strong>Use select or DTO mappers:</strong> ফেচিংয়ের সময়ই{" "}
            <code>select: {"{ id: true, name: true }"}</code> দিয়ে শুধু প্রয়োজনীয় কলাম তুলুন —
            মেমরি ও সিকিউরিটি দুটোই রক্ষা পায়।
          </li>
        </ul>
      </Note>
    </article>
  );
}
