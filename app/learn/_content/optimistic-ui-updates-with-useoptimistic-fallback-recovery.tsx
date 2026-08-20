import { CodeBlock, Diagram, H2, Line, Note } from "@/components/learn/DocParts";
import type { Bi } from "@/lib/curriculum";

/** Section anchors — consumed by the "on this page" rail. */
export const headings: { id: string; label: Bi }[] = [
  {
    id: "the-lag",
    label: { bn: "৮০০ মিলিসেকেন্ডের অপেক্ষা", en: "The 800ms wait" },
  },
  {
    id: "how-it-works",
    label: { bn: "useOptimistic ভেতরে কী করে", en: "How useOptimistic works" },
  },
  {
    id: "server-action",
    label: { bn: "১. Server Action", en: "1. The Server Action" },
  },
  {
    id: "client-component",
    label: { bn: "২. ক্লায়েন্ট কম্পোনেন্ট", en: "2. The client component" },
  },
  {
    id: "takeaway",
    label: { bn: "Production Takeaways", en: "Production takeaways" },
  },
];

export default function OptimisticUi() {
  return (
    <article className="doc-prose">
      {/* ── The lag ───────────────────────────────────────────────────── */}
      <H2 id="the-lag" anchorOnly>
        ৮০০ মিলিসেকেন্ডের অপেক্ষা
      </H2>

      <p>
        পরদিন সন্ধ্যা। ভুলু ভাই ল্যাপটপে তাঁর তৈরি ড্যাশবোর্ডে &quot;Like&quot; বাটনে
        বারবার ক্লিক করছেন আর বিরক্তি নিয়ে ঘড়ি দেখছেন!
      </p>

      <Line name="ভুলু ভাই">
        নেক্সট-ভাই! নেটওয়ার্ক স্লো হলে আমার অ্যাপের ইউজার এক্সপেরিয়েন্স একদম থমকে যায়! আমি
        ফেসবুক বা টুইটারের মতো একটা ইনস্ট্যান্ট &quot;Like&quot; সিস্টেম বানাতে চাচ্ছি।
        কিন্তু বর্তমানে ইউজার যখন লাইক বাটনে ক্লিক করে, সার্ভার অ্যাকশন ঘুরে ডাটাবেজ আপডেট
        হয়ে রেসপন্স আসতে অন্তত ৫০০ থেকে ৮০০ মিলিসেকেন্ড সময় লাগে! এই পুরো সময়টা বাটন
        ডিজেবল হয়ে বসে থাকে। কিন্তু ফেসবুকে ক্লিক মারার সাথে সাথেই হার্ট আইকন লাল হয়ে
        যায়, আবার নেটওয়ার্ক ফেল মারলে সাইলেন্টলি আগের অবস্থায় রোলব্যাক করে! এই ইনস্ট্যান্ট
        রেসপন্সিভ ইউআই-এর ম্যাজিক কীভাবে বানাব ভাই?!
      </Line>

      <Line name="নেক্সট-ভাই">
        (হেসে) ভুলু, একেই তো বলে <strong>Optimistic UI Updates</strong>! অর্থাৎ, &quot;আমি
        আশাবাদী যে সার্ভার রিকোয়েস্ট সফল হবেই, তাই সার্ভার রেসপন্স আসার অপেক্ষা না করে
        ক্লায়েন্ট ইউআই আগেই আপডেট করে দাও!&quot; আর React 19 ও Next.js 15-এ এই রোলব্যাক আর
        ইনস্ট্যান্ট স্টেট সিঙ্ক সামলানোর জন্য এসেছে অফিশিয়াল হুক — <code>useOptimistic</code>!
      </Line>

      {/* ── How it works ──────────────────────────────────────────────── */}
      <H2 id="how-it-works">১. useOptimistic ভেতরে কী করে</H2>

      <Line name="নেক্সট-ভাই">কনসেপ্টটা একদম সিম্পল!</Line>

      <Diagram>{`[User Clicks Like]
        │
        ├─────────────────────────────────────────────────┐
        ▼                                                 ▼
[1. useOptimistic instantly updates UI (0ms)]   [2. Server Action executed via HTTP]
        │                                                 │
        │                                                 ▼
        │                                      ┌──────────────────────┐
        │                                      │  Database Mutation   │
        │                                      └──────────┬───────────┘
        │                                                 │
        ▼                                                 ▼
[3. UI stays updated] ◄──(Success)── [Check Status] ──(Failure)──► [4. Automatic rollback!]`}</Diagram>

      <ul>
        <li>
          ইউজার ইন্টারঅ্যাক্ট করার সাথে সাথেই <code>useOptimistic</code> লোকাল টেম্পোরারি
          স্টেট আপডেট করে দেয়।
        </li>
        <li>ব্যাকগ্রাউন্ডে আসল Server Action ডাটাবেজে হিট মারে।</li>
        <li>
          অ্যাকশন সফল হলে <code>revalidatePath</code> থেকে আসা আসল সার্ভার স্টেট অপটিমিস্টিক
          স্টেটকে টেক-ওভার করে নেয়।
        </li>
        <li>
          আর ব্যাকএন্ডে এরর বা নেটওয়ার্ক ফেল হলে React এক্সট্রা কোড ছাড়াই ইউআই-কে
          অরিজিনাল সার্ভার স্টেটে ফিরিয়ে নিয়ে যায়!
        </li>
      </ul>

      {/* ── Server action ─────────────────────────────────────────────── */}
      <H2 id="server-action">২. Server Action</H2>

      <CodeBlock filename="app/actions.ts">{`'use server'

import { revalidatePath } from 'next/cache';

export async function toggleLikeAction(postId: string, currentLikeStatus: boolean) {
  try {
    await db.post.update({
      where: { id: postId },
      data: {
        likes: currentLikeStatus ? { decrement: 1 } : { increment: 1 },
      },
    });

    revalidatePath('/posts'); // Sync the real server state back to the client
    return { success: true };
  } catch (error) {
    // Throwing lets the client catch it and lets the optimistic overlay fall away
    throw new Error('Failed to update like status');
  }
}`}</CodeBlock>

      {/* ── Client component ──────────────────────────────────────────── */}
      <H2 id="client-component">৩. ক্লায়েন্ট কম্পোনেন্ট</H2>

      <CodeBlock filename="app/like-button.tsx">{`'use client'

import { useOptimistic, startTransition } from 'react';
import { toggleLikeAction } from '@/app/actions';

type PostProps = {
  id: string;
  likesCount: number;
  isLiked: boolean;
};

export function LikeButton({ id, likesCount, isLiked }: PostProps) {
  // ⚡ 1. Set up the hook — useOptimistic(passthroughState, updateFn)
  const [optimisticState, setOptimisticState] = useOptimistic(
    { likesCount, isLiked },
    (currentState, optimisticValue: boolean) => ({
      ...currentState,
      isLiked: optimisticValue,
      likesCount: optimisticValue
        ? currentState.likesCount + 1
        : currentState.likesCount - 1,
    })
  );

  async function handleLikeClick() {
    const nextLikedState = !optimisticState.isLiked;

    startTransition(async () => {
      // ⚡ 2. Instantly update the UI before the server call
      setOptimisticState(nextLikedState);

      try {
        // ⚡ 3. Run the real Server Action in the background
        await toggleLikeAction(id, optimisticState.isLiked);
      } catch (error) {
        // ⚡ 4. On failure the optimistic value falls away and the real
        // props-driven state renders again. Tell the user why.
        alert('নেটওয়ার্ক সমস্যার কারণে লাইক কাউন্ট আপডেট হয়নি!');
      }
    });
  }

  return (
    <button onClick={handleLikeClick}>
      <span>{optimisticState.isLiked ? '❤️' : '🤍'}</span>
      <span>{optimisticState.likesCount} Likes</span>
    </button>
  );
}`}</CodeBlock>

      <Note>
        <p>
          খেয়াল কর, <code>setOptimisticState</code> আর <code>await</code> — দুটোই একই{" "}
          <code>startTransition</code> ব্লকের ভেতরে। অপটিমিস্টিক ভ্যালু বেঁচে থাকে ঠিক
          ততক্ষণ, যতক্ষণ ট্রানজিশনটা চলছে; অ্যাকশন শেষ হলেই ইউআই আবার আসল props-এর ওপর
          ফিরে যায়। সেট-স্টেটকে ট্রানজিশনের বাইরে রাখলে অপটিমিস্টিক ভ্যালু সাথে সাথেই উবে
          যাবে।
        </p>
      </Note>

      <Line name="ভুলু ভাই">(চোখ বড় বড় করে) অসাম নেক্সট-ভাই!</Line>

      <ul>
        <li>
          বাটন ক্লিক করতেই লাইক কাউন্ট বেড়ে ইউআই লাল হয়ে গেল — ইউজার কোনো ডিলে দেখতেই পেল
          না!
        </li>
        <li>ব্যাকগ্রাউন্ডে সার্ভার অ্যাকশন শেষ করে অরিজিনাল ডাটা দিয়ে পেজ রিভ্যালিডেট করল!</li>
        <li>
          আর সার্ভার অ্যাকশনে <code>throw</code> ঘটলে আগের আসল স্টেট (
          <code>likesCount</code>, <code>isLiked</code>) ফিরে আসল!
        </li>
      </ul>

      <Line name="নেক্সট-ভাই">
        ক্রিস্টাল ক্লিয়ার! ইউজার ইন্টারঅ্যাকশনে ইনস্ট্যান্ট রেসপন্স দেওয়া আর সার্ভার
        ট্রানজেকশন ফেল করলে ইউআই রিকভার করা — এই দুয়ের ব্যালেন্সই হলো Optimistic
        Architecture!
      </Line>

      {/* ── Takeaway ──────────────────────────────────────────────────── */}
      <H2 id="takeaway">💡 Production Engineering Takeaways</H2>

      <ul>
        <li>
          <strong>Instant Feedback Layer:</strong> <code>useOptimistic</code> ব্যবহার করলে
          সার্ভার অ্যাকশন চলাকালীন ইউজারকে শূন্য-ডিলেতে ইউআই ফিডব্যাক দেওয়া যায়।
        </li>
        <li>
          <strong>Automatic Rollback:</strong> অ্যাকশন ফেল করলে React অপটিমিস্টিক
          ভ্যালুটা ফেলে দিয়ে props থেকে পাওয়া অরিজিনাল সার্ভার স্টেটে ফিরে যায় — তাই ফেল
          করা মিউটেশন যেন সার্ভারে আংশিক পরিবর্তন রেখে না যায়, সেটা নিশ্চিত করতে হবে।
        </li>
        <li>
          <strong>Transitions Integration:</strong> অপটিমিস্টিক সেট-স্টেট ফাংশন সবসময়{" "}
          <code>startTransition</code> বা ফর্ম সাবমিশন ট্রানজিশন ব্লকের ভেতরে কল করতে হয়।
        </li>
      </ul>
    </article>
  );
}
