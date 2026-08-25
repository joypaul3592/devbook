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
      bn: "একটা ফর্মের জন্য ২০ লাইন বয়লারপ্লেট",
      en: "Twenty lines of boilerplate for one form",
    },
  },
  {
    id: "architecture",
    label: {
      bn: "useActionState এক্সিকিউশন ফ্লো",
      en: "useActionState execution flow",
    },
  },
  {
    id: "foundations",
    label: { bn: "৪টি মূল মেকানিজম", en: "Four core mechanisms" },
  },
  {
    id: "implementation",
    label: {
      bn: "ম্যানুয়াল স্টেট বনাম useActionState",
      en: "Manual state vs useActionState",
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

export default function UseActionStateHook() {
  return (
    <article className="doc-prose">
      {/* ── The problem ───────────────────────────────────────────────── */}
      <H2 id="the-problem" anchorOnly>
        একটা ফর্মের জন্য ২০ লাইন বয়লারপ্লেট
      </H2>

      <p>
        রাত ৯:২০। ভুলু ভাই একটি প্রোফাইল এডিট ফর্ম বানাচ্ছেন — সাবমিটে স্পিনার, এরর হলে মেসেজ, সফল
        হলে আপডেটেড ডেটা। এই সাধারণ কাজটার জন্যই <code>useState</code>,{" "}
        <code>useTransition</code>, <code>isSubmitting</code>, <code>error</code>,{" "}
        <code>success</code> মিলিয়ে ২০ লাইনের বয়লারপ্লেট জমে গেছে।
      </p>

      <Line name="ভুলু ভাই">
        ফাহিম! একটা ফর্মের অ্যাকশন চালাতে গিয়ে লোডিং স্টেট আর সার্ভার রেসপন্স ম্যানেজ করতেই কি
        অর্ধেক দিন চলে যাবে? এতগুলো <code>useState</code> আর <code>try/catch</code> লিখতে লিখতে
        ক্লান্ত!
      </Line>

      <Line name="ফাহিম">
        ভুলু ভাই! React 19-এ এই কাজের জন্যই এসেছে <code>useActionState</code> — একটিমাত্র হুক
        অ্যাকশনের রিটার্ন করা <strong>state</strong>, <strong>action handler</strong> আর{" "}
        <strong>isPending</strong> — তিনটিই দেয়।
      </Line>

      <Line name="নেক্সট-ভাই">
        একদম! React 18-এর <code>useFormState</code>-কে শক্তিশালী করে React 19-এ{" "}
        <code>useActionState</code> নাম দেওয়া হয়েছে। এটি এখন ফর্মের বাইরেও কাজ করে, আর তৃতীয়
        রিটার্ন ভ্যালু হিসেবে নেটিভভাবে <code>isPending</code> দেয় — আলাদা{" "}
        <code>useTransition</code> লাগে না।
      </Line>

      {/* ── Architecture ──────────────────────────────────────────────── */}
      <H2 id="architecture">১. useActionState Flow</H2>

      <Diagram>{`┌─────────────────────────────────────────────────────────────────────────┐
│                      REACT 19 useActionState FLOW                       │
└─────────────────────────────────────────────────────────────────────────┘

 user submits the form (<form action={formAction}>)
        │
        ├─▶ [1] isPending becomes true automatically
        │       └── the UI shows its loading state immediately
        │
        ▼
 the async action runs (server action or client action)
        │
        ├─▶ receives: (previousState, formData)
        ├─▶ mutates the DB / calls the API
        │
        ▼
 the action returns the new state { success: true, message: 'Profile updated' }
        │
        ├─▶ [2] isPending flips back to false
        └─▶ [3] \`state\` holds the returned object → the UI re-renders`}</Diagram>

      {/* ── Foundations ───────────────────────────────────────────────── */}
      <H2 id="foundations">২. ৪টি মূল মেকানিজম</H2>

      <Note>
        <ul>
          <li>
            <strong>Unified action lifecycle:</strong> অ্যাকশন ফাংশনের রিটার্ন ভ্যালুই পরের{" "}
            <code>state</code> হয়ে যায় — আলাদা <code>setState</code> কল করতে হয় না।
          </li>
          <li>
            <strong>
              Built-in <code>isPending</code>:
            </strong>{" "}
            হুকের তৃতীয় রিটার্ন ভ্যালু একটি boolean। অ্যাকশন চলাকালীন React কনকারেন্ট মোডে সেটি{" "}
            <code>true</code> রাখে, ফলে বাটন ডিসেবল বা স্পিনার দেখানো হাতের কাজ।
          </li>
          <li>
            <strong>Form &amp; non-form দুটোতেই চলে:</strong> <code>&lt;form action&gt;</code>-এর
            সাথে সবচেয়ে ভালো মানায়, তবে যেকোনো ইভেন্ট বা প্রোগ্র্যাম্যাটিক কল থেকেও{" "}
            <code>formAction</code> ট্রিগার করা যায়।
          </li>
          <li>
            <strong>Progressive enhancement:</strong> Next.js Server Action-এর সাথে ব্যবহার করলে
            ক্লায়েন্ট JavaScript লোড হওয়ার আগেও ব্রাউজারের নেটিভ ফর্ম সাবমিশন কাজ করে।
          </li>
        </ul>
      </Note>

      {/* ── Implementation ────────────────────────────────────────────── */}
      <H2 id="implementation">৩. ম্যানুয়াল স্টেট বনাম useActionState</H2>

      <H3>❌ Anti-pattern — একাধিক স্টেট আর হাতে লেখা try/catch</H3>

      <CodeBlock filename="app/profile/_components/bad-profile-form.tsx">{`'use client';

import { useState } from 'react';
import { updateProfile } from './actions';

export function BadProfileForm() {
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const res = await updateProfile({ name });
      if (!res.ok) setError('Failed to update');
    } catch (err) {
      setError('Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input value={name} onChange={(e) => setName(e.target.value)} />
      <button disabled={loading}>{loading ? 'Saving...' : 'Save'}</button>
      {error && <p>{error}</p>}
    </form>
  );
}`}</CodeBlock>

      <H3>🟢 Fix — একটি অ্যাকশন, একটি হুক</H3>

      <CodeBlock filename="app/actions/user-actions.ts">{`'use server';

export type ProfileState = {
  success: boolean;
  message: string | null;
  errors?: Record<string, string[]>;
};

export async function updateProfileAction(
  previousState: ProfileState,
  formData: FormData,
): Promise<ProfileState> {
  const name = formData.get('name') as string;

  if (!name || name.length < 3) {
    return { success: false, message: 'Name must be at least 3 characters long.' };
  }

  // Simulated database write
  await new Promise((resolve) => setTimeout(resolve, 1500));

  return { success: true, message: \`Profile successfully updated to "\${name}"\` };
}`}</CodeBlock>

      <CodeBlock filename="app/profile/page.tsx">{`'use client';

import { useActionState } from 'react';
import { updateProfileAction, type ProfileState } from '../actions/user-actions';

const initialState: ProfileState = { success: false, message: null };

export default function ProfilePage() {
  // [currentState, actionTrigger, isPending]
  const [state, formAction, isPending] = useActionState(updateProfileAction, initialState);

  return (
    <div className="p-8 bg-slate-950 min-h-screen text-slate-100 max-w-md mx-auto">
      <div className="p-6 bg-slate-900 border border-slate-800 rounded-2xl space-y-6">
        <h1 className="text-xl font-bold text-white">Update Profile</h1>

        {/* The action binds straight to the form */}
        <form action={formAction} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold uppercase text-slate-400 mb-2">
              Full Name
            </label>
            <input
              type="text"
              name="name"
              placeholder="Zubayer Salehin"
              className="w-full px-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 text-slate-100 placeholder:text-slate-600"
            />
          </div>

          <button
            type="submit"
            disabled={isPending}
            className="w-full py-3 bg-indigo-600 hover:bg-indigo-500 disabled:bg-slate-800 disabled:text-slate-500 text-white font-medium rounded-xl transition-all flex items-center justify-center gap-2"
          >
            {isPending ? (
              <>
                <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Updating...
              </>
            ) : (
              'Save Changes'
            )}
          </button>
        </form>

        {/* The returned state drives the feedback */}
        {state.message && (
          <div
            className={\`p-3.5 rounded-xl text-sm font-medium border \${
              state.success
                ? 'bg-emerald-950/50 border-emerald-800/60 text-emerald-400'
                : 'bg-rose-950/50 border-rose-800/60 text-rose-400'
            }\`}
          >
            {state.message}
          </div>
        )}
      </div>
    </div>
  );
}`}</CodeBlock>

      {/* ── Matrix ────────────────────────────────────────────────────── */}
      <H2 id="matrix">৪. ম্যানুয়াল হ্যান্ডলিং বনাম useActionState</H2>

      <Table
        head={[
          "বৈশিষ্ট্য",
          <>
            ম্যানুয়াল <code>useState</code>
          </>,
          <>
            React 19 <code>useActionState</code>
          </>,
        ]}
        rows={[
          [
            "Boilerplate",
            <>
              ৩-৪টি স্টেট আর <code>try/catch</code> লাগে
            </>,
            "একটিমাত্র হুকেই সব",
          ],
          [
            "Pending state",
            <>
              হাতে <code>isSubmitting</code> true/false করতে হয়
            </>,
            <>
              বিল্ট-ইন <code>isPending</code>
            </>,
          ],
          [
            "Previous state",
            "আগের রেসপন্স ট্র্যাক করা জটিল",
            <>
              অ্যাকশনের ১ম আর্গুমেন্টেই <code>previousState</code> আসে
            </>,
          ],
          [
            "Form integration",
            <>
              <code>onSubmit</code> + <code>e.preventDefault()</code>
            </>,
            <>
              সরাসরি <code>&lt;form action=&#123;formAction&#125;&gt;</code>
            </>,
          ],
        ]}
      />

      <Line name="ভুলু ভাই">
        অসাধারণ! আর ৪টা স্টেট আর <code>try/catch</code> দিয়ে মেস বানাতে হবে না —{" "}
        <code>useActionState</code> একাই রেসপন্স আর <code>isPending</code> দিয়ে দিচ্ছে।
      </Line>

      {/* ── Takeaways ─────────────────────────────────────────────────── */}
      <H2 id="takeaway">Production Takeaways</H2>

      <Note>
        <ul>
          <li>
            <strong>
              First argument is <code>previousState</code>:
            </strong>{" "}
            অ্যাকশন ফাংশন সবসময় প্রথমে আগের স্টেট পায়, আর সাবমিট করা{" "}
            <code>FormData</code> থাকে দ্বিতীয় আর্গুমেন্টে।
          </li>
          <li>
            <strong>Updates run in a transition:</strong> হুকের ভেতরের আপডেটগুলো কনকারেন্ট
            ট্রানজিশনে চলে, তাই সাবমিশনের সময় UI ফ্রিজ হয় না।
          </li>
          <li>
            <strong>
              Pair it with <code>useOptimistic</code>:
            </strong>{" "}
            ইনস্ট্যান্ট ফিডব্যাক দরকার হলে <code>useActionState</code>-এর সাথে{" "}
            <code>useOptimistic</code> জুড়ে দিলে UI আপডেট আর সার্ভার সিঙ্ক একসাথে হয়।
          </li>
        </ul>
      </Note>
    </article>
  );
}
