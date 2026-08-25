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
      bn: "setLoading(true) আর try/catch-এর জঞ্জাল",
      en: "The setLoading and try/catch clutter",
    },
  },
  {
    id: "architecture",
    label: {
      bn: "Async Transition এক্সিকিউশন ফ্লো",
      en: "Async transition execution flow",
    },
  },
  {
    id: "foundations",
    label: { bn: "ট্রানজিশনের ৪টি স্তম্ভ", en: "Four pillars of transitions" },
  },
  {
    id: "implementation",
    label: {
      bn: "ম্যানুয়াল লোডিং বনাম useTransition",
      en: "Manual loading vs useTransition",
    },
  },
  {
    id: "matrix",
    label: { bn: "Comparison Matrix", en: "Comparison matrix" },
  },
  {
    id: "takeaway",
    label: { bn: "Production Takeaways", en: "Production takeaways" },
  },
];

export default function TransitionsAndUseTransition() {
  return (
    <article className="doc-prose">
      {/* ── The problem ───────────────────────────────────────────────── */}
      <H2 id="the-problem" anchorOnly>
        setLoading(true) আর try/catch-এর জঞ্জাল
      </H2>

      <p>
        রাত ৬:৩৫। ভুলু ভাই একটি সেটিংস পেজ বানাচ্ছেন, যেখানে &quot;Save Profile&quot; বাটনে চাপ দিলে
        সার্ভারে ডেটা আপডেট হয় আর পাশে একটি ট্যাবও বদলায়।
      </p>

      <Line name="ভুলু ভাই">
        ফাহিম! সেভ বাটনে চাপ দিলে API রেসপন্স না আসা পর্যন্ত পুরো স্ক্রিন জমে থাকছে! আর{" "}
        <code>useState(false)</code> দিয়ে ম্যানুয়ালি লোডিং সেট করে{" "}
        <code>try/catch/finally</code>-তে <code>setLoading(true)</code>,{" "}
        <code>setLoading(false)</code> লিখতে লিখতে কোড জঞ্জাল হয়ে গেছে।
      </Line>

      <Line name="ফাহিম">
        ভুলু ভাই! ম্যানুয়াল স্ট্যাটাস ফ্ল্যাগ স্টেট আপডেটকে sync lane-এ ফেলে মেইন থ্রেড ব্লক করে
        রাখে। React বুঝতেই পারছে না কোনটা জরুরি আর কোনটা ব্যাকগ্রাউন্ড আপডেট।
      </Line>

      <Line name="নেক্সট-ভাই">
        React 19-এর <code>useTransition</code> এখন <strong>async transition</strong> সাপোর্ট করে —{" "}
        <code>startTransition</code>-এর ভেতরে সরাসরি <code>async/await</code> চালাতে পারবেন, আর{" "}
        <code>isPending</code> স্বয়ংক্রিয়ভাবে ট্র্যাক হবে, কোনো ম্যানুয়াল <code>setLoading</code>{" "}
        ছাড়াই।
      </Line>

      {/* ── Architecture ──────────────────────────────────────────────── */}
      <H2 id="architecture">১. Async Transition Flow</H2>

      <Diagram>{`┌─────────────────────────────────────────────────────────────────────────┐
│                    REACT 19 ASYNC TRANSITION FLOW                       │
└─────────────────────────────────────────────────────────────────────────┘

 user trigger (click)  ──▶ startTransition(async () => { ... })
                                        │
                                        ├─▶ isPending = true (instant, non-blocking)
                                        │   the rest of the UI stays responsive
                                        │
                                  await updateProfileData()   (background request)
                                        │
                                        └─▶ state commits & isPending = false`}</Diagram>

      {/* ── Foundations ───────────────────────────────────────────────── */}
      <H2 id="foundations">২. ট্রানজিশনের ৪টি স্তম্ভ</H2>

      <Note>
        <ul>
          <li>
            <strong>Native async callbacks:</strong> React 18-এ{" "}
            <code>startTransition</code> শুধু synchronous আপডেট নিত। React 19-এ{" "}
            <code>startTransition(async () =&gt; &#123; await action(); &#125;)</code> নেটিভভাবেই
            কাজ করে।
          </li>
          <li>
            <strong>Automatic pending state:</strong> আলাদা{" "}
            <code>const [isLoading, setIsLoading] = useState(false)</code> লাগে না —{" "}
            <code>const [isPending, startTransition] = useTransition()</code>-এর{" "}
            <code>isPending</code> রিকোয়েস্ট শুরু থেকে শেষ পর্যন্ত নিজেই ম্যানেজ হয়।
          </li>
          <li>
            <strong>Non-blocking updates:</strong> ট্রানজিশন চলাকালীন ইউজার অন্য ট্যাব, ইনপুট বা
            নেভিগেশনে নির্বিঘ্নে কাজ করতে পারে — UI ফ্রিজ হয় না।
          </li>
          <li>
            <strong>Interruption &amp; batching:</strong> একটি ট্রানজিশন পেন্ডিং থাকা অবস্থায় নতুন
            অ্যাকশন এলে React পুরোনোটি বাতিল করে নতুনটিকে আগে প্রসেস করে।
          </li>
        </ul>
      </Note>

      {/* ── Implementation ────────────────────────────────────────────── */}
      <H2 id="implementation">৩. ম্যানুয়াল লোডিং বনাম useTransition</H2>

      <H3>❌ Anti-pattern — ম্যানুয়াল ফ্ল্যাগ ও ব্লকড UI</H3>

      <CodeBlock filename="app/settings/_components/bad-profile-form.tsx">{`'use client';

import { useState } from 'react';

export function BadProfileForm() {
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false); // manual loading flag

  const handleSave = async () => {
    setLoading(true);                             // manual update #1
    try {
      await new Promise((resolve) => setTimeout(resolve, 1500));
      alert('Saved!');
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);                          // manual update #2 — easy to forget
    }
  };

  return (
    <div className="p-4 space-y-3">
      <input
        value={name}
        onChange={(e) => setName(e.target.value)}
        className="px-3 py-2 bg-slate-900 border border-slate-700 rounded text-white"
      />
      <button
        onClick={handleSave}
        disabled={loading}
        className="px-4 py-2 bg-blue-600 text-white rounded disabled:opacity-50"
      >
        {loading ? 'Saving...' : 'Save Profile'}
      </button>
    </div>
  );
}`}</CodeBlock>

      <H3>🟢 Fix — async transition + অটোমেটিক pending state</H3>

      <CodeBlock filename="app/settings/_components/profile-form.tsx">{`'use client';

import { useState, useTransition } from 'react';

// Stand-in for a server action
async function updateProfileApi(newName: string) {
  await new Promise((resolve) => setTimeout(resolve, 1500));
  return { success: true, name: newName };
}

export function ProfileForm() {
  const [name, setName] = useState('Zubayer');
  const [status, setStatus] = useState('Idle');

  const [isPending, startTransition] = useTransition();

  const handleSave = () => {
    // React 19 accepts an async callback directly
    startTransition(async () => {
      setStatus('Saving to database...');

      const response = await updateProfileApi(name);

      if (response.success) {
        setStatus(\`Profile updated to "\${response.name}"\`);
      }
    });
  };

  return (
    <div className="p-6 bg-slate-950 border border-slate-800 rounded-xl space-y-4 max-w-md mx-auto">
      <div>
        <label className="text-xs font-semibold text-slate-400">Display Name</label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="mt-1 px-4 py-2 bg-slate-900 border border-slate-700 rounded-lg w-full text-white focus:ring-2 focus:ring-emerald-500 outline-none"
        />
      </div>

      <div className="flex items-center justify-between pt-2">
        <button
          onClick={handleSave}
          disabled={isPending}
          className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-medium text-sm rounded-lg transition-all disabled:opacity-50 flex items-center gap-2"
        >
          {isPending && (
            <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
          )}
          {isPending ? 'Updating...' : 'Save Changes'}
        </button>

        {/* Status bound to the transition, not to a hand-rolled flag */}
        <span className={\`text-xs \${isPending ? 'text-amber-400 animate-pulse' : 'text-emerald-400'}\`}>
          {status}
        </span>
      </div>
    </div>
  );
}`}</CodeBlock>

      {/* ── Matrix ────────────────────────────────────────────────────── */}
      <H2 id="matrix">৪. ম্যানুয়াল লোডিং স্টেট বনাম useTransition</H2>

      <Table
        head={[
          "বৈশিষ্ট্য",
          <>
            <code>useState(loading)</code>
          </>,
          <>
            React 19 <code>useTransition</code>
          </>,
        ]}
        rows={[
          [
            "Boilerplate",
            <>
              বেশি — <code>try / catch / finally</code>-এর সাথে স্টেট টাইটলি কাপল্ড
            </>,
            <>
              কম — React নিজেই <code>isPending</code> দেয়
            </>,
          ],
          [
            "Async support",
            "ম্যানুয়ালি হ্যান্ডেল করতে হয়",
            <>
              নেটিভ <code>async / await</code> কলব্যাক
            </>,
          ],
          [
            "UI interactivity",
            "অনেক সময় ইন্টারঅ্যাকশন ব্লক করে",
            "নন-ব্লকিং — ইউজার অন্য কাজ চালিয়ে যেতে পারে",
          ],
          [
            "Priority",
            "Sync — মেইন থ্রেড আটকে রাখে",
            "Transition lane — ব্যাকগ্রাউন্ড প্রসেসিং",
          ],
        ]}
      />

      <Line name="ভুলু ভাই">
        দারুণ! আর <code>finally</code>-তে ম্যানুয়ালি <code>setLoading(false)</code> লেখা লাগছে না —{" "}
        <code>startTransition</code>-এর ভেতরে async ফাংশন দিলাম, আর <code>isPending</code> দিয়েই
        স্পিনার আর স্ট্যাটাস হ্যান্ডেল হয়ে গেল।
      </Line>

      {/* ── Takeaways ─────────────────────────────────────────────────── */}
      <H2 id="takeaway">Production Takeaways</H2>

      <Note>
        <ul>
          <li>
            <strong>Delete manual loading flags:</strong> ফর্ম সাবমিশন, ট্যাব সুইচ বা ফিল্টারিংয়ের
            জন্য আলাদা লোডিং স্টেট নয় — <code>useTransition</code> ব্যবহার করুন।
          </li>
          <li>
            <strong>Wrap server actions:</strong> ক্লায়েন্ট কম্পোনেন্ট থেকে Server Action কল করার
            সময় <code>startTransition</code> বা <code>useActionState</code> ব্যবহার করাই বেস্ট
            প্র্যাকটিস।
          </li>
          <li>
            <strong>Keep critical inputs immediate:</strong> সরাসরি টাইপিং (<code>onChange</code>)
            কখনো <code>startTransition</code>-এর ভেতরে রাখবেন না — শুধু তার ডাউনস্ট্রিম রেজাল্ট বা
            ফেচিং অংশটুকু ট্রানজিশনে মুড়ুন।
          </li>
        </ul>
      </Note>
    </article>
  );
}
