import {
  CodeBlock,
  Diagram,
  H2,
  H3,
  Line,
  Note,
} from "@/components/learn/DocParts";
import type { Bi } from "@/lib/curriculum";

/** Section anchors — consumed by the "on this page" rail. */
export const headings: { id: string; label: Bi }[] = [
  {
    id: "the-problem",
    label: {
      bn: "Only plain objects can be passed",
      en: "Only plain objects can be passed",
    },
  },
  {
    id: "mental-model",
    label: {
      bn: "সিরিয়ালাইজেশন ফানেল",
      en: "The serialization funnel",
    },
  },
  {
    id: "anti-pattern",
    label: { bn: "অ্যান্টি-প্যাটার্ন", en: "The anti-pattern" },
  },
  {
    id: "dto-pattern",
    label: { bn: "DTO প্যাটার্ন", en: "The DTO pattern" },
  },
  {
    id: "takeaway",
    label: { bn: "Production Takeaways", en: "Production takeaways" },
  },
];

export default function SerializablePropsRscDataTransfer() {
  return (
    <article className="doc-prose">
      {/* ── The problem ───────────────────────────────────────────────── */}
      <H2 id="the-problem" anchorOnly>
        Only plain objects can be passed
      </H2>

      <p>
        বিকাল ৫:১০। ভুলু ভাই নতুন ইউজার অ্যাকাউন্ট সিকিউরিটি কার্ড বানাতে গিয়ে বড় বিপদে
        পড়েছেন। ব্রাউজার কনসোলে রক্তবর্ণের একটি এরর ঝিলিক মারছে:
      </p>

      <CodeBlock label="Console" filename="error.txt">{`Error: Only plain objects, and a few built-ins, can be passed to Client
Components from Server Components. Classes or null prototypes are not supported.`}</CodeBlock>

      <Line name="ভুলু ভাই">
        (বিরক্ত হয়ে) আরে ভাই! সার্ভার কম্পোনেন্টে একটা ক্লাস ইনস্ট্যান্স{" "}
        <code>new UserSession()</code> আর একটা JavaScript <code>Date</code> অবজেক্ট
        বানিয়ে প্রপ্স হিসেবে চাইল্ড Client Component-এ পাঠালাম। TypeScript টাইপিং তো সব
        ঠিকই দেখাচ্ছে — রানটাইমে ক্ষেপে গেল কেন?
      </Line>

      <Line name="ফাহিম">
        ভুলু ভাই, TypeScript তো শুধু বিল্ড-টাইমে কোডের শেপ চেক করে। কিন্তু সার্ভার
        কম্পোনেন্ট থেকে ক্লায়েন্ট কম্পোনেন্টে প্রপ্স পাঠানো মানে সেই ডেটাকে নেটওয়ার্ক ওয়্যার
        দিয়ে পাঠানোর জন্য সিরিয়ালাইজ করা! ফাংশন বা ক্লাস মেথড পাঠালে React সেটাকে
        স্ট্রিমিং ফরম্যাটে কনভার্ট করবে কীভাবে?
      </Line>

      <Line name="নেক্সট-ভাই">
        একদম সঠিক ধরেছ ফাহিম! এটাই <strong>RSC Serialization Boundary Rules</strong>।
        সার্ভার আর ক্লায়েন্ট এনভায়রনমেন্ট সম্পূর্ণ আলাদা প্রসেসে চলে; এদের মধ্যে ডেটা পার
        করার সময় শুধুমাত্র <strong>Serializable Props</strong> সাপোর্ট করে।
      </Line>

      {/* ── Mental model ──────────────────────────────────────────────── */}
      <H2 id="mental-model">১. RSC Data Serialization Mechanics</H2>

      <Diagram>{`┌────────────────────────────────────────────────────────────────────────┐
│ SERVER BOUNDARY                                                        │
│  Raw data: class instances, functions, Dates, Symbols, Promises        │
└──────────────────────────────────┬─────────────────────────────────────┘
                                   │
                                   v   SERIALIZATION FUNNEL
┌────────────────────────────────────────────────────────────────────────┐
│ HTTP NETWORK BOUNDARY (RSC Payload stream)                             │
│                                                                        │
│  ✅ ALLOWED (serializable)                                             │
│     • Primitives: string, number, boolean, null, undefined, bigint     │
│     • Plain objects: { key: "value" }   • Arrays: [1, 2, 3]            │
│     • Map / Set / Date / TypedArray (React-supported built-ins)        │
│     • Promises (streamed) and React JSX elements                       │
│     • Server Action references ('use server' functions)                │
│                                                                        │
│  ❌ BLOCKED (non-serializable)                                         │
│     • Plain functions & class methods (user.getPermissions())          │
│     • Class instances (new UserSession())                              │
│     • Symbols (non-registered), DOM elements, streams, sockets         │
└──────────────────────────────────┬─────────────────────────────────────┘
                                   │
                                   v
┌────────────────────────────────────────────────────────────────────────┐
│ CLIENT BOUNDARY — reconstructs props & hydrates UI state               │
└────────────────────────────────────────────────────────────────────────┘`}</Diagram>

      <Note>
        <p>
          <code>Date</code> React-এর সাপোর্টেড বিল্ট-ইন — এটি পাঠানো যায়। তবু প্রোডাকশনে
          ISO স্ট্রিং বা টাইমস্ট্যাম্প পাঠানোই নিরাপদ: টাইমজোন-নির্ভর ফরম্যাটিং সার্ভার আর
          ব্রাউজারে আলাদা আউটপুট দিলে hydration mismatch হয়।
        </p>
      </Note>

      {/* ── Anti-pattern ──────────────────────────────────────────────── */}
      <H2 id="anti-pattern">২. অ্যান্টি-প্যাটার্ন</H2>

      <CodeBlock filename="app/profile/page.tsx">{`// ❌ ANTI-PATTERN: app/profile/page.tsx (server component)
import { UserCard } from './user-card';

// A non-plain class instance with methods
class UserPermissions {
  constructor(public role: string) {}

  canEdit() {
    return this.role === 'ADMIN';
  }
}

export default async function ProfilePage() {
  const userData = {
    id: 'usr_882',
    name: 'Bhulu Bhai',
    registeredAt: new Date(),
    permissions: new UserPermissions('ADMIN'), // ❌ class instance with methods
    onRefresh: () => console.log('Refreshed!'), // ❌ plain function across the boundary
  };

  // 💥 Runtime serialization exception
  return <UserCard user={userData} />;
}`}</CodeBlock>

      {/* ── DTO ───────────────────────────────────────────────────────── */}
      <H2 id="dto-pattern">৩. প্রোডাকশন রিফ্যাক্টর — DTO Pattern</H2>

      <H3>Step 1 — সিরিয়ালাইজেবল কন্ট্রাক্ট</H3>

      <CodeBlock filename="types/user-dto.ts">{`// 🟢 types/user-dto.ts — serializable DTO contract
export interface UserProfileDTO {
  id: string;
  name: string;
  registeredAtIso: string; // native Date -> ISO-8601 string
  role: 'ADMIN' | 'MEMBER' | 'GUEST';
  canEdit: boolean; // a method result, computed on the server
}`}</CodeBlock>

      <H3>Step 2 — ক্লায়েন্ট কম্পোনেন্ট শুধু প্লেইন ভ্যালু পড়ে</H3>

      <CodeBlock filename="app/profile/user-card.tsx">{`// 🟢 app/profile/user-card.tsx
'use client';

import { UserProfileDTO } from '@/types/user-dto';

interface UserCardProps {
  user: UserProfileDTO;
}

export function UserCard({ user }: UserCardProps) {
  return (
    <div className="max-w-md mx-auto bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4 shadow-xl">
      <div className="flex justify-between items-center border-b border-slate-800 pb-3">
        <div>
          <h2 className="text-xl font-bold text-white">{user.name}</h2>
          <p className="text-xs text-slate-400 font-mono">ID: {user.id}</p>
        </div>
        <span className="px-2.5 py-1 text-xs rounded-full font-mono bg-blue-950 text-blue-400 border border-blue-800">
          {user.role}
        </span>
      </div>

      <div className="space-y-2 text-xs text-slate-300">
        <p>
          <span className="text-slate-500">Registered: </span>
          {/* The client layer parses the ISO string itself */}
          {new Date(user.registeredAtIso).toLocaleDateString('bn-BD', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
          })}
        </p>
        <p>
          <span className="text-slate-500">Permission: </span>
          {user.canEdit ? (
            <span className="text-emerald-400">Edit access granted</span>
          ) : (
            <span className="text-rose-400">Read-only</span>
          )}
        </p>
      </div>
    </div>
  );
}`}</CodeBlock>

      <H3>Step 3 — সার্ভারে ম্যাপিং</H3>

      <CodeBlock filename="app/profile/page.tsx">{`// 🟢 app/profile/page.tsx (server component)
import { UserCard } from './user-card';
import { UserProfileDTO } from '@/types/user-dto';

async function getUserProfileDTO(userId: string): Promise<UserProfileDTO> {
  // Simulating a server DB / microservice call
  const rawUser = {
    id: userId,
    name: 'Bhulu Bhai',
    createdAt: new Date('2025-06-15T10:30:00Z'),
    role: 'ADMIN' as const,
  };

  // DTO mapping: drop non-serializable fields, ship a plain payload
  return {
    id: rawUser.id,
    name: rawUser.name,
    registeredAtIso: rawUser.createdAt.toISOString(), // Date -> ISO string
    role: rawUser.role,
    canEdit: rawUser.role === 'ADMIN', // business logic computed on the server
  };
}

export default async function ProfilePage() {
  const userDto = await getUserProfileDTO('usr_882');

  // 🟢 A plain object travels safely across the RSC boundary
  return (
    <main className="min-h-screen bg-slate-950 p-8 flex justify-center items-center">
      <UserCard user={userDto} />
    </main>
  );
}`}</CodeBlock>

      <Line name="ভুলু ভাই">
        (স্বস্তির নিশ্বাস ফেলে) আহা! এবার বিষয়টা পানির মতো পরিষ্কার! সার্ভারে জটিল মেথড ও
        ক্যালকুলেশন সেরে প্লেইন ভ্যালু (<code>canEdit: boolean</code>,{" "}
        <code>registeredAtIso: string</code>) পাঠিয়ে দিলেই সিরিয়ালাইজেশন এরর বন্ধ!
      </Line>

      <Note>
        <p>
          <strong>ব্যতিক্রম:</strong> ইন্টারঅ্যাকশন দরকার হলে ফাংশন পাঠানোর একমাত্র বৈধ পথ
          হলো <strong>Server Action</strong> — <code>&apos;use server&apos;</code> দিয়ে
          ডিক্লেয়ার করা ফাংশন প্রপ হিসেবে পাঠালে React ওয়্যারে শুধু তার রেফারেন্স আইডি
          পাঠায়, কোড নয়।
        </p>
      </Note>

      {/* ── Takeaways ─────────────────────────────────────────────────── */}
      <H2 id="takeaway">Production Takeaways</H2>

      <Note>
        <ul>
          <li>
            <strong>Dates → ISO string বা timestamp:</strong> সার্ভার লেয়ারেই{" "}
            <code>.toISOString()</code> বা <code>Date.now()</code> করে পাঠাও; ফরম্যাটিং
            ক্লায়েন্টে হোক।
          </li>
          <li>
            <strong>Compute business logic on the server:</strong> ক্লাস ইনস্ট্যান্স বা
            মেথড না পাঠিয়ে তার আউটপুট (<code>true</code>/<code>false</code>) DTO-তে
            পাঠাও।
          </li>
          <li>
            <strong>No plain function props:</strong> সাধারণ ইভেন্ট হ্যান্ডলার সার্ভার থেকে
            পাঠানো যায় না — হয় হ্যান্ডলারটি ক্লায়েন্ট কম্পোনেন্টের ভেতরেই লেখো, নয়তো Server
            Action ব্যবহার করো।
          </li>
          <li>
            <strong>Use TypeScript DTO contracts:</strong> প্রতিটি বাউন্ডারি-ক্রসিং প্রপের
            জন্য ডেডিকেটেড <code>*DTO</code> টাইপ রাখলে অ-সিরিয়ালাইজেবল ফিল্ড ভুল করে ঢোকা
            বন্ধ হয়।
          </li>
        </ul>
      </Note>
    </article>
  );
}
