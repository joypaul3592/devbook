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
      bn: "ইউজার বদলালেও ফর্মে আগের ড্রাফট",
      en: "The draft survives the user switch",
    },
  },
  {
    id: "architecture",
    label: {
      bn: "Reuse বনাম Remount",
      en: "Reuse vs remount",
    },
  },
  {
    id: "foundations",
    label: { bn: "key-এর ২টি প্যাটার্ন", en: "Two patterns for key" },
  },
  {
    id: "implementation",
    label: {
      bn: "useEffect সিঙ্ক বনাম key রিসেট",
      en: "useEffect syncing vs key reset",
    },
  },
  {
    id: "matrix",
    label: { bn: "Key Usage Matrix", en: "Key usage matrix" },
  },
  {
    id: "takeaway",
    label: { bn: "Production Takeaways", en: "Production takeaways" },
  },
];

export default function KeyPropAsComponentIdentity() {
  return (
    <article className="doc-prose">
      {/* ── The problem ───────────────────────────────────────────────── */}
      <H2 id="the-problem" anchorOnly>
        ইউজার বদলালেও ফর্মে আগের ড্রাফট
      </H2>

      <p>
        রাত ১০:১৫। অ্যাডমিন ড্যাশবোর্ডে &quot;User A&quot; থেকে &quot;User B&quot;-তে সুইচ করলে
        ফর্মে আগের ইউজারের আন-সেভড ইনপুট আর এরর মেসেজ রয়ে যাচ্ছে।
      </p>

      <Line name="ভুলু ভাই">
        ফাহিম! এক ইউজার থেকে আরেক ইউজারে গেলে ফর্মের স্টেট খালি হচ্ছে না!{" "}
        <code>useEffect</code>-এ <code>userId</code> ডিপেন্ডেন্সি দিয়ে{" "}
        <code>setName(user.name)</code> করলাম, তাও ফ্লিকার করছে আর কিছু ড্রাফট আটকে থাকছে।
      </Line>

      <Line name="ফাহিম">
        ভুলু ভাই! এটি React-এর reconciliation-এর স্বাভাবিক আচরণ। একই পজিশনে একই টাইপের কম্পোনেন্ট
        দেখলে React আগের ইনস্ট্যান্স ও তার <code>useState</code> ধরে রাখে — শুধু নতুন প্রপস পাস
        করে। তাই স্টেট রয়ে যায়।
      </Line>

      <Line name="নেক্সট-ভাই">
        সবচেয়ে ক্লিন সমাধান — <strong>key as component identity</strong>।{" "}
        <code>key</code> শুধু <code>.map()</code>-এর জন্য নয়; এটি কম্পোনেন্টের পরিচয় বদলে তাকে
        সম্পূর্ণ remount (reset) করাতেও ব্যবহৃত হয়।
      </Line>

      {/* ── Architecture ──────────────────────────────────────────────── */}
      <H2 id="architecture">১. Reuse বনাম Remount</H2>

      <Diagram>{`┌─────────────────────────────────────────────────────────────────────────┐
│               COMPONENT REUSE VS. REMOUNT WITH THE KEY PROP             │
└─────────────────────────────────────────────────────────────────────────┘

 ❌ NO KEY — React reuses the existing instance
 selects user A (id 101)     ───▶     selects user B (id 102)
 ┌───────────────────────────┐        ┌───────────────────────────┐
 │ <UserProfileForm />       │        │ <UserProfileForm />       │
 │ └─ internal state: "draft"│  ───▶  │ └─ internal state: "draft"│  ⚠️ stale
 └───────────────────────────┘        └───────────────────────────┘

───────────────────────────────────────────────────────────────────────────

 🟢 WITH KEY — React tears down and mounts fresh
 selects user A (id 101)     ───▶     selects user B (id 102)
 ┌───────────────────────────┐        ┌───────────────────────────┐
 │ <UserProfileForm          │        │ <UserProfileForm          │
 │    key="101" />           │        │    key="102" />           │
 └─────────────┬─────────────┘        └─────────────┬─────────────┘
               ▼                                    ▼
      [instance #1 mounts]                 [instance #1 destroyed 💥]
                                          [instance #2 mounts clean 🟢]
                                          (state resets automatically)`}</Diagram>

      {/* ── Foundations ───────────────────────────────────────────────── */}
      <H2 id="foundations">২. key-এর ২টি প্যাটার্ন</H2>

      <Note>
        <ul>
          <li>
            <strong>Forcing a state reset:</strong> ফর্ম, রিচ-টেক্সট এডিটর বা মাল্টি-স্টেপ উইজার্ডে
            নতুন ডেটা এলে হাতে স্টেট খালি করার দরকার নেই — শুধু{" "}
            <code>key=&#123;uniqueId&#125;</code> বসান। key বদলালেই React পুরোনো ইনস্ট্যান্স unmount
            করে শূন্য স্টেট নিয়ে নতুনটি mount করে।
          </li>
          <li>
            <strong>Preserving identity in lists:</strong> লিস্ট রি-অর্ডার বা ডিলিটের সময়{" "}
            <code>key=&#123;index&#125;</code> দিলে ইনপুট স্টেট ভুল আইটেমে শিফট হয়ে যায় — সবসময়
            ডোমেন ডেটার ইউনিক আইডি (<code>key=&#123;item.id&#125;</code>) ব্যবহার করুন।
          </li>
        </ul>
      </Note>

      {/* ── Implementation ────────────────────────────────────────────── */}
      <H2 id="implementation">৩. useEffect সিঙ্ক বনাম key রিসেট</H2>

      <H3>❌ Anti-pattern — এফেক্ট দিয়ে স্টেট সিঙ্ক</H3>

      <CodeBlock filename="app/admin/_components/bad-user-editor.tsx">{`'use client';

import { useEffect, useState } from 'react';

interface User {
  id: string;
  name: string;
  email: string;
}

function BadUserEditor({ user }: { user: User }) {
  const [draftName, setDraftName] = useState(user.name);

  // Syncing props into state — an extra render pass, plus visible flicker
  useEffect(() => {
    setDraftName(user.name);
  }, [user]);

  return (
    <div className="p-4 bg-slate-900 border border-slate-800 rounded-xl space-y-3">
      <h3 className="font-semibold text-slate-200">Editing: {user.name}</h3>
      <input
        type="text"
        value={draftName}
        onChange={(e) => setDraftName(e.target.value)}
        className="w-full p-2 bg-slate-950 border border-slate-800 rounded-lg text-sm text-slate-100"
      />
    </div>
  );
}

export function BadKeyPatternDemo({ users }: { users: User[] }) {
  const [selectedId, setSelectedId] = useState(users[0].id);
  const currentUser = users.find((u) => u.id === selectedId)!;

  return (
    <div className="p-6 space-y-4 bg-slate-950 text-slate-100">
      <div className="flex gap-2">
        {users.map((u) => (
          <button
            key={u.id}
            onClick={() => setSelectedId(u.id)}
            className="px-3 py-1 bg-slate-800 rounded"
          >
            Select {u.name}
          </button>
        ))}
      </div>

      {/* No key: React keeps the same editor instance and its stale state */}
      <BadUserEditor user={currentUser} />
    </div>
  );
}`}</CodeBlock>

      <H3>🟢 Fix — key বদলেই ফ্রেশ ইনস্ট্যান্স</H3>

      <CodeBlock filename="app/admin/page.tsx">{`'use client';

import { useState } from 'react';

interface User {
  id: string;
  name: string;
  email: string;
}

interface UserEditorProps {
  user: User;
  onSave: (updatedName: string) => void;
}

// No syncing effect anywhere — the initial state is set once, on mount
function UserEditor({ user, onSave }: UserEditorProps) {
  const [draftName, setDraftName] = useState(user.name);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

  return (
    <div className="p-6 bg-slate-900 border border-slate-800 rounded-xl space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="font-semibold text-slate-100">Editing user #{user.id}</h3>
        {hasUnsavedChanges && (
          <span className="text-xs text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20">
            Unsaved changes
          </span>
        )}
      </div>

      <div className="space-y-1">
        <label className="text-xs text-slate-400">Name</label>
        <input
          type="text"
          value={draftName}
          onChange={(e) => {
            setDraftName(e.target.value);
            setHasUnsavedChanges(true);
          }}
          className="w-full p-3 bg-slate-950 border border-slate-800 rounded-lg text-sm text-slate-100 focus:ring-2 focus:ring-indigo-500 outline-none"
        />
      </div>

      <button
        onClick={() => {
          onSave(draftName);
          setHasUnsavedChanges(false);
        }}
        className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-sm font-medium transition-colors"
      >
        Save changes
      </button>
    </div>
  );
}

export function KeyIdentityPage() {
  const [users, setUsers] = useState<User[]>([
    { id: 'usr_101', name: 'Zubayer Salehin', email: 'zubayer@example.com' },
    { id: 'usr_102', name: 'Fahim Ahmed', email: 'fahim@example.com' },
    { id: 'usr_103', name: 'Bhulu Bhai', email: 'bhulu@example.com' },
  ]);

  const [selectedUserId, setSelectedUserId] = useState('usr_101');
  const selectedUser = users.find((u) => u.id === selectedUserId)!;

  const handleSave = (updatedName: string) => {
    setUsers((prev) =>
      prev.map((u) => (u.id === selectedUserId ? { ...u, name: updatedName } : u)),
    );
  };

  return (
    <div className="p-6 max-w-2xl mx-auto space-y-6 bg-slate-950 text-slate-100 min-h-screen">
      <h1 className="text-2xl font-bold">Key identity and component reset</h1>

      <div className="flex gap-2 p-1 bg-slate-900 border border-slate-800 rounded-xl">
        {users.map((u) => (
          <button
            key={u.id}
            onClick={() => setSelectedUserId(u.id)}
            className={\`flex-1 py-2 text-sm font-medium rounded-lg transition-all \${
              selectedUserId === u.id
                ? 'bg-indigo-600 text-white shadow-lg'
                : 'text-slate-400 hover:text-slate-200'
            }\`}
          >
            {u.name.split(' ')[0]}
          </button>
        ))}
      </div>

      {/*
        key={selectedUserId} makes React destroy the old editor and mount a
        fresh one whenever the selected user changes — no syncing effect needed.
      */}
      <UserEditor key={selectedUserId} user={selectedUser} onSave={handleSave} />
    </div>
  );
}`}</CodeBlock>

      {/* ── Matrix ────────────────────────────────────────────────────── */}
      <H2 id="matrix">৪. Key Usage Matrix</H2>

      <Table
        head={["সিনারিও", "key-এর নিয়ম", "লাভ"]}
        rows={[
          [
            "ফর্ম / উইজার্ড রিসেট",
            <>
              <code>key=&#123;entityId&#125;</code>
            </>,
            <>
              কোনো syncing <code>useEffect</code> ছাড়াই স্টেট রিক্রিয়েট হয়
            </>,
          ],
          [
            "ডাইনামিক লিস্ট",
            <>
              <code>key=&#123;item.id&#125;</code> — কখনো index নয়
            </>,
            "ফিল্টার / ডিলিট / রি-অর্ডারেও স্টেট মিক্স হয় না",
          ],
          [
            "অ্যানিমেশন ট্রিগার",
            <>
              <code>key=&#123;stepNumber&#125;</code>
            </>,
            "পুরোনো এলিমেন্ট আউট-অ্যানিমেট, নতুনটি ইন-অ্যানিমেট হয়",
          ],
        ]}
      />

      <Line name="ভুলু ভাই">
        ওয়াও! এতদিন <code>useEffect</code> দিয়ে কসরত করতাম, অথচ প্যারেন্টে{" "}
        <code>key=&#123;userId&#125;</code> বসাতেই পুরো ফর্মের স্টেট পরিষ্কার হয়ে গেল।
      </Line>

      {/* ── Takeaways ─────────────────────────────────────────────────── */}
      <H2 id="takeaway">Production Takeaways</H2>

      <Note>
        <ul>
          <li>
            <strong>
              <code>key</code> is identity, not decoration:
            </strong>{" "}
            এটি React-কে বলে এই সাবট্রি আগেরটাই, নাকি সম্পূর্ণ নতুন।
          </li>
          <li>
            <strong>Eliminate syncing effects:</strong> প্রপ বদলের সাথে লোকাল ফর্ম স্টেট মেলাতে{" "}
            <code>useEffect</code> না লিখে প্যারেন্টে <code>key</code> বদলান।
          </li>
          <li>
            <strong>Never use random keys:</strong> রেন্ডারের ভেতর{" "}
            <code>key=&#123;Math.random()&#125;</code> দিলে প্রতি রেন্ডারে DOM ধ্বংস হয়ে
            পারফরম্যান্স ধসে পড়বে।
          </li>
        </ul>
      </Note>
    </article>
  );
}
