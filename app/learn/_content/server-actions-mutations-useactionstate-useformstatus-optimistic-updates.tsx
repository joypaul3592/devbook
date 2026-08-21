import {
  CodeBlock,
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
      bn: "একটা ফর্মের জন্য এত কোড?",
      en: "All that code for one form?",
    },
  },
  {
    id: "mental-model",
    label: { bn: "Server Action কী", en: "What a server action is" },
  },
  {
    id: "action",
    label: { bn: "Step A — Server Action", en: "Step A — the server action" },
  },
  {
    id: "form-status",
    label: { bn: "Step B — useFormStatus", en: "Step B — useFormStatus" },
  },
  {
    id: "optimistic",
    label: {
      bn: "Step C — useActionState ও useOptimistic",
      en: "Step C — useActionState and useOptimistic",
    },
  },
  {
    id: "matrix",
    label: { bn: "তিন হুকের ভূমিকা", en: "The three hooks compared" },
  },
  {
    id: "takeaway",
    label: { bn: "Production Takeaways", en: "Production takeaways" },
  },
];

export default function ServerActionsAndMutations() {
  return (
    <article className="doc-prose">
      {/* ── The problem ───────────────────────────────────────────────── */}
      <H2 id="the-problem" anchorOnly>
        একটা ফর্মের জন্য এত কোড?
      </H2>

      <p>
        রাত ৪:২০। ভুলু ভাই একটি ইন্টারঅ্যাক্টিভ টাস্ক ম্যানেজমেন্ট অ্যাপ তৈরি করছেন। তিনি API
        রুট, <code>fetch()</code>, আর <code>useState</code> দিয়ে ডেটা সাবমিট করছিলেন — কিন্তু
        স্টেট হ্যান্ডলিং, লোডিং ফ্ল্যাগ, এরর মেসেজ আর রিয়েল-টাইম UI আপডেট মেলাতে গিয়ে কোড
        অগোছালো হয়ে গেছে!
      </p>

      <Line name="ভুলু ভাই">
        নেক্সট-ভাই! একটা সাধারণ ফর্ম সাবমিট করতেই <code>onSubmit</code>,{" "}
        <code>preventDefault()</code>, <code>isLoading</code>, <code>error</code> স্টেট, আলাদা
        API এন্ডপয়েন্ট — এত ঝামেলার কি শেষ নেই? কোনো ক্লায়েন্ট-সাইড API কোড না লিখে সরাসরি
        সার্ভার ফাংশন কল করে ফর্ম সাবমিশন ও রিয়েল-টাইম UI আপডেট করা যায় না?
      </Line>

      <Line name="নেক্সট-ভাই">
        (উৎসাহের সাথে) ওয়েলকাম টু <strong>Server Actions</strong> ভুলু! আলাদা কোনো API
        Route তৈরি না করেই সরাসরি সার্ভার-সাইড async ফাংশন কল করে ডেটা মিউটেশন করা যায়। আর
        এটাকে মসৃণ করতে আছে তিনটি হুক: <code>useActionState</code>,{" "}
        <code>useFormStatus</code>, আর <code>useOptimistic</code>!
      </Line>

      {/* ── Mental model ──────────────────────────────────────────────── */}
      <H2 id="mental-model">১. Server Action কী</H2>

      <p>
        Server Action এমন একটি ফাংশন যা সার্ভারে এক্সিকিউট হয়, কিন্তু ক্লায়েন্ট কম্পোনেন্ট
        থেকে নির্বিঘ্নে কল করা যায়।
      </p>

      <ul>
        <li>
          <strong>ফাইল লেভেল:</strong> ফাইলের একদম ওপরে <code>&apos;use server&apos;</code>{" "}
          লিখলে ওই ফাইলের সব ফাংশন সার্ভার অ্যাকশনে রূপান্তরিত হয়।
        </li>
        <li>
          <strong>ফাংশন লেভেল:</strong> নির্দিষ্ট async ফাংশনের প্রথম লাইনে{" "}
          <code>&apos;use server&apos;</code> লিখে তাকে সার্ভার অ্যাকশন বানানো যায়।
        </li>
      </ul>

      {/* ── Step A ────────────────────────────────────────────────────── */}
      <H2 id="action">২. Step A — Server Action</H2>

      <CodeBlock filename="app/actions/task-actions.ts">{`'use server';

import { revalidatePath } from 'next/cache';

export interface Task {
  id: string;
  title: string;
}

export interface ActionState {
  success: boolean;
  message?: string;
  errors?: { title?: string };
}

// In-memory fake database (tutorial only)
const taskDatabase: Task[] = [
  { id: '1', title: 'Chapter 5 Routing শেখা' },
  { id: '2', title: 'Server Actions প্র্যাকটিস করা' },
];

export async function getTasks(): Promise<Task[]> {
  return taskDatabase;
}

export async function addTaskAction(
  previousState: ActionState,
  formData: FormData,
): Promise<ActionState> {
  // 1. Simulate network delay
  await new Promise((resolve) => setTimeout(resolve, 1500));

  const title = formData.get('title') as string;

  // 2. Server-side validation
  if (!title || title.trim().length < 3) {
    return {
      success: false,
      message: 'ভ্যালিডেশন ব্যর্থ হয়েছে!',
      errors: { title: 'টাস্ক টাইটেল অন্তত ৩ অক্ষরের হতে হবে।' },
    };
  }

  // 3. Persist
  taskDatabase.push({ id: Date.now().toString(), title: title.trim() });

  // 4. Invalidate the cached page
  revalidatePath('/tasks');

  return { success: true, message: 'টাস্ক সফলভাবে যুক্ত করা হয়েছে!' };
}`}</CodeBlock>

      {/* ── Step B ────────────────────────────────────────────────────── */}
      <H2 id="form-status">৩. Step B — useFormStatus</H2>

      <p>
        <code>useFormStatus</code> প্যারেন্ট <code>&lt;form&gt;</code>-এ সাবমিশন হচ্ছে কি না
        স্বয়ংক্রিয়ভাবে ট্র্যাক করে। মনে রাখুন — কম্পোনেন্টটি অবশ্যই ফর্মের{" "}
        <strong>ভেতরের চাইল্ড</strong> হতে হবে।
      </p>

      <CodeBlock filename="app/tasks/submit-button.tsx">{`'use client';

import { useFormStatus } from 'react-dom';

export function SubmitButton() {
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      disabled={pending}
      className="px-5 py-2.5 bg-blue-600 hover:bg-blue-500 disabled:bg-slate-700 text-white font-semibold rounded-xl shadow-lg transition-all flex items-center gap-2 disabled:cursor-not-allowed"
    >
      {pending ? (
        <>
          <span className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
          <span>সংরক্ষণ হচ্ছে…</span>
        </>
      ) : (
        <span>+ টাস্ক যোগ করুন</span>
      )}
    </button>
  );
}`}</CodeBlock>

      {/* ── Step C ────────────────────────────────────────────────────── */}
      <H2 id="optimistic">৪. Step C — useActionState ও useOptimistic</H2>

      <p>
        এখানেই আসল ম্যাজিক — ফর্ম হ্যান্ডলিং ও এরর রেসপন্সের জন্য{" "}
        <code>useActionState</code>, আর ইনস্ট্যান্ট ফিডব্যাকের জন্য{" "}
        <code>useOptimistic</code>।
      </p>

      <CodeBlock filename="app/tasks/task-manager.tsx">{`'use client';

import { useActionState, useOptimistic, useRef } from 'react';
import { addTaskAction, type ActionState, type Task } from '../actions/task-actions';
import { SubmitButton } from './submit-button';

export function TaskManager({ initialTasks }: { initialTasks: Task[] }) {
  const formRef = useRef<HTMLFormElement>(null);

  // 1. Connect the server action
  const initialState: ActionState = { success: false };
  const [state, formAction] = useActionState(addTaskAction, initialState);

  // 2. Configure the instant UI update
  const [optimisticTasks, addOptimisticTask] = useOptimistic(
    initialTasks,
    (currentTasks: Task[], newTitle: string) => [
      ...currentTasks,
      { id: 'optimistic-' + Date.now(), title: newTitle + ' (সেভ হচ্ছে…)' },
    ],
  );

  // 3. Dispatch
  const handleClientAction = async (formData: FormData) => {
    const title = formData.get('title') as string;

    if (title && title.trim().length >= 3) {
      // Update the UI before the network answers
      addOptimisticTask(title);
      formRef.current?.reset();
    }

    await formAction(formData);
  };

  return (
    <div className="space-y-8 max-w-xl mx-auto">
      <form ref={formRef} action={handleClientAction} className="space-y-4">
        <input
          type="text"
          name="title"
          placeholder="যেমন: Next.js 15 রিলিজ নোটস পড়া…"
          className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3"
        />
        {state.errors?.title && (
          <p className="text-xs text-red-400 font-medium">{state.errors.title}</p>
        )}

        <div className="flex items-center justify-between pt-2">
          <SubmitButton />
          {state.message && (
            <span className={state.success ? 'text-emerald-400' : 'text-red-400'}>
              {state.message}
            </span>
          )}
        </div>
      </form>

      <ul className="space-y-2">
        {optimisticTasks.map((task) => {
          const isOptimistic = task.id.startsWith('optimistic-');
          return (
            <li
              key={task.id}
              className={isOptimistic
                ? 'p-4 rounded-xl border bg-blue-950/30 border-blue-500/40 text-blue-300 animate-pulse'
                : 'p-4 rounded-xl border bg-slate-900 border-slate-800 text-slate-100'}
            >
              {task.title}
            </li>
          );
        })}
      </ul>
    </div>
  );
}`}</CodeBlock>

      <H3>Server page</H3>

      <CodeBlock filename="app/tasks/page.tsx">{`import { getTasks } from '../actions/task-actions';
import { TaskManager } from './task-manager';

export default async function TasksPage() {
  // Direct database call on the server
  const tasks = await getTasks();

  return (
    <main className="p-8">
      <h1 className="text-3xl font-extrabold text-white">Server Actions & Mutations</h1>
      <TaskManager initialTasks={tasks} />
    </main>
  );
}`}</CodeBlock>

      {/* ── Matrix ────────────────────────────────────────────────────── */}
      <H2 id="matrix">৫. তিন হুকের ভূমিকা</H2>

      <Table
        head={["Hook", "উদ্দেশ্য", "কোথায় ব্যবহার করবেন"]}
        rows={[
          [
            <code key="uas">useActionState</code>,
            "সার্ভার অ্যাকশনের রিটার্ন করা ফলাফল (success / error) ধরে রাখা",
            "যে কম্পোনেন্টে ফর্ম বা ইনপুট ফিল্ড আছে",
          ],
          [
            <code key="ufs">useFormStatus</code>,
            "ফর্মের সাবমিশন pending অবস্থা ট্র্যাক করা",
            "ফর্মের ভেতরের সাবমিট বাটন চাইল্ড কম্পোনেন্টে",
          ],
          [
            <code key="uo">useOptimistic</code>,
            "সার্ভার রেসপন্সের আগেই স্ক্রিনে ইনস্ট্যান্ট ডেটা রেন্ডার করা",
            "ডেটা লিস্ট বা কার্ড, যেখানে দ্রুত ফিডব্যাক দরকার",
          ],
        ]}
      />

      <Line name="ভুলু ভাই">
        (বিস্মিত হয়ে) অসাধারণ! টাইটেল লিখে এন্টার চাপার সাথে সাথেই{" "}
        <code>useOptimistic</code>-এর কারণে লিস্টে টাস্ক যোগ হয়ে যাচ্ছে, ব্যাকগ্রাউন্ডে দেড়
        সেকেন্ড ডিলে থাকলেও <code>useFormStatus</code> বাটনে স্পিনার দেখাচ্ছে, আর সেভ শেষে{" "}
        <code>revalidatePath()</code> ফাইনাল স্টেট সিঙ্ক করে দিচ্ছে — কোনো আলাদা API
        endpoint লিখতে হলো না!
      </Line>

      {/* ── Takeaways ─────────────────────────────────────────────────── */}
      <H2 id="takeaway">Production Takeaways</H2>

      <Note>
        <ul>
          <li>
            <strong>Security &amp; Input Validation:</strong> সার্ভার অ্যাকশনের ইনপুট
            অন্ধভাবে বিশ্বাস করবেন না — সবসময় Zod বা কাস্টম ভ্যালিডেটর দিয়ে{" "}
            <code>formData</code> যাচাই করুন।
          </li>
          <li>
            <strong>revalidatePath / revalidateTag:</strong> মিউটেশন সফল হওয়ার পর ক্যাশ করা
            ডেটা রিফ্রেশ করতে সবসময় <code>revalidatePath()</code> বা{" "}
            <code>revalidateTag()</code> কল করুন।
          </li>
        </ul>
      </Note>
    </article>
  );
}
