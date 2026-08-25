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
      bn: "লাইক বাটনে ক্লিক, দেড় সেকেন্ড নীরবতা",
      en: "A like button that does nothing for 1.5s",
    },
  },
  {
    id: "architecture",
    label: {
      bn: "Optimistic আপডেট ও Auto-rollback",
      en: "Optimistic updates and auto-rollback",
    },
  },
  {
    id: "foundations",
    label: {
      bn: "useOptimistic-এর ৪ মেকানিজম",
      en: "Four mechanisms of useOptimistic",
    },
  },
  {
    id: "implementation",
    label: {
      bn: "ম্যানুয়াল রোলব্যাক বনাম useOptimistic",
      en: "Manual rollback vs useOptimistic",
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

export default function UseOptimisticHook() {
  return (
    <article className="doc-prose">
      {/* ── The problem ───────────────────────────────────────────────── */}
      <H2 id="the-problem" anchorOnly>
        লাইক বাটনে ক্লিক, দেড় সেকেন্ড নীরবতা
      </H2>

      <p>
        রাত ৭:১৫। ভুলু ভাই একটি সোশ্যাল ফিডের &quot;Like&quot; বাটন আর কমেন্ট সেকশন বানাচ্ছেন। ক্লিক
        করার পর সার্ভার রেসপন্স আসতে ১.৫ সেকেন্ড লাগছে, আর পুরো সময়টা ইউজার কোনো ফিডব্যাকই পাচ্ছে না।
      </p>

      <Line name="ভুলু ভাই">
        ফাহিম! ইউজাররা বলছে লাইক বাটন কাজ করে না — কিছু হয় না দেখে তারা বারবার ক্লিক করে। ম্যানুয়ালি
        স্টেট আপডেট করলে সার্ভার ফেল করলে আবার আগের অবস্থায় ফেরানো (rollback) বিশাল ঝামেলা, আর
        নেটওয়ার্ক স্লো হলে স্টেট উল্টোপাল্টা হয়ে যাচ্ছে।
      </Line>

      <Line name="ফাহিম">
        ভুলু ভাই! ফেসবুক বা এক্স-এ খেয়াল করেছেন? লাইক দিলে এক মিলিসেকেন্ডও অপেক্ষা করায় না — কাউন্ট
        সাথে সাথে বাড়ে, নেটওয়ার্ক কল ব্যাকগ্রাউন্ডে চলে। একেই বলে{" "}
        <strong>optimistic UI update</strong>।
      </Line>

      <Line name="নেক্সট-ভাই">
        আর React 19-এর <code>useOptimistic</code> এই জটিল কাজটাকে সহজ করে দিয়েছে। মিউটেশন সফল হবে
        ধরে নিয়ে UI সাথে সাথেই আপডেট হয়; সার্ভার ফেল করলে React নিজেই কোনো ম্যানুয়াল কোড ছাড়া
        স্টেট আগের অবস্থায় রোলব্যাক করে।
      </Line>

      {/* ── Architecture ──────────────────────────────────────────────── */}
      <H2 id="architecture">১. Optimistic Update &amp; Rollback Flow</H2>

      <Diagram>{`┌─────────────────────────────────────────────────────────────────────────┐
│              REACT 19 useOptimistic EXECUTION & ROLLBACK                │
└─────────────────────────────────────────────────────────────────────────┘

 user action: [clicks like]
                     │
                     ├─▶ addOptimistic(optimisticValue)
                     │        │
                     │        └─▶ UI updates instantly (0ms latency)
                     │
            await serverAction()   (background mutation)
                     │
        ┌────────────┴────────────┐
        ▼                         ▼
   [SUCCESS]                 [FAILURE / REJECTED]
        │                         │
  server response          React drops the optimistic
  syncs the real state     value and restores the real
  into the UI              pre-mutation state`}</Diagram>

      {/* ── Foundations ───────────────────────────────────────────────── */}
      <H2 id="foundations">২. useOptimistic-এর ৪ মেকানিজম</H2>

      <Note>
        <ul>
          <li>
            <strong>Passthrough state:</strong>{" "}
            <code>useOptimistic(realState, updateFn)</code> প্রথম আর্গুমেন্ট হিসেবে আসল সার্ভার
            স্টেট নেয়। কোনো ট্রানজিশন পেন্ডিং না থাকলে এটি হুবহু সেই আসল স্টেটই রিটার্ন করে।
          </li>
          <li>
            <strong>Instant merge function:</strong> দ্বিতীয় আর্গুমেন্টের ফাংশনটি বর্তমান স্টেট আর
            পাস করা অপটিমিস্টিক ডেটা মার্জ করে একটি সাময়িক স্টেট বানিয়ে UI-তে দেখায়।
          </li>
          <li>
            <strong>Lifecycle-bound rollback:</strong> অপটিমিস্টিক স্টেটটি একটি transition বা server
            action-এর সাথে বাঁধা। ট্রানজিশন শেষ হলেই (সফল বা ব্যর্থ) সাময়িক স্টেট মুছে গিয়ে
            সার্ভারের আসল রেসপন্স দিয়ে UI আপডেট হয়।
          </li>
          <li>
            <strong>No state divergence:</strong> ম্যানুয়াল রোলব্যাকে দ্রুত পরপর কয়েকটি রিকোয়েস্ট
            ওভারল্যাপ করলে ডেটা করাপ্ট হতো; কনকারেন্ট ইঞ্জিন সেই race condition নিজেই রেজলভ করে।
          </li>
        </ul>
      </Note>

      {/* ── Implementation ────────────────────────────────────────────── */}
      <H2 id="implementation">৩. ম্যানুয়াল রোলব্যাক বনাম useOptimistic</H2>

      <H3>❌ Anti-pattern — হাতে লেখা rollback, ভঙ্গুর লজিক</H3>

      <CodeBlock filename="app/feed/_components/bad-like-button.tsx">{`'use client';

import { useState } from 'react';

export function BadLikeButton({ initialLikes }: { initialLikes: number }) {
  const [likes, setLikes] = useState(initialLikes);
  const [isLiking, setIsLiking] = useState(false);

  const handleLike = async () => {
    const previousLikes = likes;

    setLikes((prev) => prev + 1); // manual optimistic update
    setIsLiking(true);

    try {
      const res = await fetch('/api/like', { method: 'POST' });
      if (!res.ok) throw new Error('Failed');
    } catch (err) {
      // Manual rollback — breaks when the button is clicked rapidly
      setLikes(previousLikes);
      alert('Failed to like post.');
    } finally {
      setIsLiking(false);
    }
  };

  return (
    <button onClick={handleLike} className="px-4 py-2 bg-pink-600 text-white rounded">
      ❤️ {likes} {isLiking && '(syncing...)'}
    </button>
  );
}`}</CodeBlock>

      <H3>🟢 Fix — useOptimistic + server action</H3>

      <CodeBlock filename="app/feed/_components/optimistic-comments.tsx">{`'use client';

import { useOptimistic, useRef, useTransition } from 'react';

export type Comment = {
  id: string;
  text: string;
  sending?: boolean;
};

// Stand-in for a server action
async function addCommentAction(text: string): Promise<Comment> {
  await new Promise((resolve) => setTimeout(resolve, 1500));

  // Simulated failure, to show the automatic rollback
  if (Math.random() < 0.2) {
    throw new Error('Server database connection timeout');
  }

  return { id: crypto.randomUUID(), text };
}

export function OptimisticCommentFeed({ initialComments }: { initialComments: Comment[] }) {
  const formRef = useRef<HTMLFormElement>(null);
  const [isPending, startTransition] = useTransition();

  const [optimisticComments, addOptimisticComment] = useOptimistic(
    initialComments,
    (currentComments: Comment[], newCommentText: string) => [
      ...currentComments,
      { id: 'temp-' + Date.now(), text: newCommentText, sending: true },
    ],
  );

  const handleSubmit = (formData: FormData) => {
    const commentText = formData.get('comment') as string;
    if (!commentText.trim()) return;

    formRef.current?.reset();

    // The optimistic dispatch must run inside a transition or action
    startTransition(async () => {
      addOptimisticComment(commentText); // instant UI update

      try {
        await addCommentAction(commentText);
      } catch (error) {
        // React drops the optimistic entry when the transition settles
        alert('Could not post comment. Reverting.');
      }
    });
  };

  return (
    <div className="p-6 bg-slate-950 border border-slate-800 rounded-2xl max-w-lg mx-auto space-y-6">
      <h3 className="text-lg font-bold text-white">Discussion Feed</h3>

      <div className="space-y-3 max-h-80 overflow-y-auto">
        {optimisticComments.map((comment) => (
          <div
            key={comment.id}
            className={\`p-3.5 rounded-xl border text-sm transition-all \${
              comment.sending
                ? 'bg-slate-900/50 border-amber-500/40 text-slate-400 italic'
                : 'bg-slate-900 border-slate-800 text-slate-200'
            }\`}
          >
            <div className="flex justify-between items-center">
              <span>{comment.text}</span>
              {comment.sending && (
                <span className="text-[10px] bg-amber-500/10 text-amber-400 px-2 py-0.5 rounded-full font-mono">
                  Posting...
                </span>
              )}
            </div>
          </div>
        ))}
      </div>

      <form ref={formRef} action={handleSubmit} className="flex gap-2">
        <input
          name="comment"
          type="text"
          placeholder="Write a comment..."
          required
          className="flex-1 px-4 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-white text-sm focus:ring-2 focus:ring-emerald-500 outline-none"
        />
        <button
          type="submit"
          disabled={isPending}
          className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-medium text-sm rounded-xl transition-all disabled:opacity-50"
        >
          Post
        </button>
      </form>
    </div>
  );
}`}</CodeBlock>

      {/* ── Matrix ────────────────────────────────────────────────────── */}
      <H2 id="matrix">৪. ম্যানুয়াল হ্যান্ডলিং বনাম useOptimistic</H2>

      <Table
        head={[
          "বৈশিষ্ট্য",
          <>
            ম্যানুয়াল <code>useState</code> rollback
          </>,
          <>
            React 19 <code>useOptimistic</code>
          </>,
        ]}
        rows={[
          [
            "UI response time",
            "০ms (হাতে স্টেট সেট করলে)",
            "০ms — নেটিভ কনকারেন্ট আপডেট",
          ],
          [
            "Rollback complexity",
            "জটিল — race condition ও স্টেট করাপশনের ঝুঁকি",
            "অটোমেটিক — কোনো স্টেট ম্যানিপুলেশন লাগে না",
          ],
          [
            "Server action integration",
            "কষ্টসাধ্য, হাতে ওয়্যার করতে হয়",
            <>
              Server Actions ও <code>&lt;form action&gt;</code>-এর সাথে সরাসরি ইন্টিগ্রেটেড
            </>,
          ],
          [
            "Race conditions",
            "ডেভেলপারকে নিজে সামলাতে হয়",
            "কনকারেন্ট ইঞ্জিন নিজেই রেজলভ করে",
          ],
        ]}
      />

      <Line name="ভুলু ভাই">
        কমেন্ট সাবমিট করা মাত্রই &quot;Posting...&quot; ব্যাজসহ স্ক্রিনে ভেসে উঠলো, আর সার্ভার এরর
        খেতেই React কমেন্টটা সরিয়ে আগের অবস্থায় রোলব্যাক করে দিল — কোনো{" "}
        <code>setComments(prev =&gt; prev.filter(...))</code> ছাড়াই!
      </Line>

      {/* ── Takeaways ─────────────────────────────────────────────────── */}
      <H2 id="takeaway">Production Takeaways</H2>

      <Note>
        <ul>
          <li>
            <strong>Dispatch inside a transition:</strong> <code>addOptimistic</code> ফাংশনটি অবশ্যই{" "}
            <code>startTransition</code> বা কোনো server action-এর ভেতরে কল করতে হবে, নইলে React
            এরর দেবে।
          </li>
          <li>
            <strong>Give pending items a visual cue:</strong> অপটিমিস্টিক আইটেমে একটি সাময়িক ফ্ল্যাগ
            (যেমন <code>sending: true</code>) রেখে হালকা opacity বা &quot;Posting...&quot; ব্যাজ
            দেখান।
          </li>
          <li>
            <strong>Let rollback happen on its own:</strong> সার্ভার অ্যাকশনে এরর throw করলেই React
            অপটিমিস্টিক ডেটা বাদ দিয়ে দেয় — নিজে থেকে স্টেট রিভার্ট করার কোড লিখতে যাবেন না।
          </li>
        </ul>
      </Note>
    </article>
  );
}
