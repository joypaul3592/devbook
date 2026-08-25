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
      bn: "সব হ্যান্ডলারে useCallback, তবু বাগ",
      en: "useCallback everywhere, and a stale bug",
    },
  },
  {
    id: "architecture",
    label: {
      bn: "ফাংশন রেফারেন্স পাইপলাইন",
      en: "The function reference pipeline",
    },
  },
  {
    id: "foundations",
    label: { bn: "৩টি মূল মেকানিজম", en: "Three core mechanisms" },
  },
  {
    id: "implementation",
    label: {
      bn: "Stale closure বনাম স্থিতিশীল হ্যান্ডলার",
      en: "Stale closure vs stable handlers",
    },
  },
  {
    id: "matrix",
    label: { bn: "Handler Strategy Matrix", en: "Handler strategy matrix" },
  },
  {
    id: "takeaway",
    label: { bn: "Production Takeaways", en: "Production takeaways" },
  },
];

export default function UseCallbackCostVsBenefit() {
  return (
    <article className="doc-prose">
      {/* ── The problem ───────────────────────────────────────────────── */}
      <H2 id="the-problem" anchorOnly>
        সব হ্যান্ডলারে useCallback, তবু বাগ
      </H2>

      <p>
        সন্ধ্যা ৬:০০। ভুলু ভাই ফর্মের সব <code>onClick</code> আর <code>onChange</code> হ্যান্ডলারকে{" "}
        <code>useCallback</code> দিয়ে মুড়ে ফেলেছেন। ফল — কিছু বাটনে ক্লিক করলে পুরোনো স্টেট আটকে
        থাকছে (stale state), আর প্লেইন HTML বাটনে পারফরম্যান্সের কোনো পার্থক্যই নেই।
      </p>

      <Line name="ভুলু ভাই">
        ফাহিম! সব ইভেন্ট হ্যান্ডলারে <code>useCallback</code> দিলাম যাতে নতুন ফাংশন তৈরি না হয়।
        কিন্তু এখন কিছু বাটনে স্টেটের আগের ভ্যালু আটকে থাকছে কেন? পেজও ফাস্ট মনে হচ্ছে না।
      </Line>

      <Line name="ফাহিম">
        ভুলু ভাই! সাধারণ <code>&lt;button&gt;</code> বা <code>&lt;div&gt;</code>-এর মতো নেটিভ DOM
        এলিমেন্ট প্রপ রেফারেন্সের ভিত্তিতে রেন্ডার স্কিপ করে না — সেখানে <code>useCallback</code>{" "}
        সম্পূর্ণ অপচয়। আর ডিপেন্ডেন্সি ঠিক না দিলে <strong>stale closure</strong> ট্র্যাপে পড়বেন।
      </Line>

      <Line name="নেক্সট-ভাই">
        মনে রাখবেন — <code>useCallback(fn, deps)</code> আসলে{" "}
        <code>useMemo(() =&gt; fn, deps)</code>-এর সিনট্যাক্টিক সুগার। এটি ফাংশন তৈরি হওয়া বন্ধ করে
        না, আগের রেফারেন্সটি ধরে রাখে। চাইল্ডে <code>React.memo</code> না থাকলে এর কোনো মানে নেই।
      </Line>

      {/* ── Architecture ──────────────────────────────────────────────── */}
      <H2 id="architecture">১. Function Reference Pipeline</H2>

      <Diagram>{`┌─────────────────────────────────────────────────────────────────────────┐
│              FUNCTION REFERENCE & useCallback PIPELINE                  │
└─────────────────────────────────────────────────────────────────────────┘

 ❌ WITHOUT useCallback (child is memoized)
 ┌───────────────────────────────────────────────────────────────────────┐
 │ parent renders ──▶ creates function #A01 (a brand-new reference)      │
 │                         │                                             │
 │                         ▼                                             │
 │ <MemoChild onClick={#A01} /> ──▶ 🔴 re-renders every time              │
 └───────────────────────────────────────────────────────────────────────┘

───────────────────────────────────────────────────────────────────────────

 🟢 WITH useCallback + React.memo
 ┌───────────────────────────────────────────────────────────────────────┐
 │ parent renders ──▶ useCallback checks [deps]                          │
 │           ┌─────────────┴─────────────┐                               │
 │           │ deps unchanged            │ deps changed                  │
 │           ▼                           ▼                               │
 │   returns #A01 (same ref)     creates #A02 (new ref)                  │
 │           ▼                           ▼                               │
 │   <MemoChild /> 🟢 skips      <MemoChild /> 🔴 re-renders              │
 └───────────────────────────────────────────────────────────────────────┘`}</Diagram>

      {/* ── Foundations ───────────────────────────────────────────────── */}
      <H2 id="foundations">২. ৩টি মূল মেকানিজম</H2>

      <Note>
        <ul>
          <li>
            <strong>Memory cost vs reconciliation savings:</strong> একটি অ্যারো ফাংশন তৈরি হতে
            মাইক্রোসেকেন্ডের ভগ্নাংশ লাগে — ফাংশন তৈরি ঠেকানো লক্ষ্য নয়। লক্ষ্য হলো{" "}
            <strong>referential equality</strong> রক্ষা করা, যাতে <code>React.memo</code> চাইল্ড
            রেন্ডার বাইপাস করতে পারে।
          </li>
          <li>
            <strong>The stale closure trap:</strong> ডিপেন্ডেন্সি অ্যারেতে কোনো স্টেট বাদ পড়লে
            ফাংশনটি তৈরির সময়ের ভ্যালু ক্লোজারে লক করে রাখে — পরে কল করলে সবসময় পুরোনো ভ্যালুই
            পড়ে।
          </li>
          <li>
            <strong>Functional updates fix it:</strong> <code>setCount(prev =&gt; prev + 1)</code>{" "}
            স্টাইলে আপডেট করলে স্টেটকে ডিপেন্ডেন্সিতে রাখতে হয় না — অ্যারে খালি{" "}
            <code>[]</code> রেখেই শতভাগ স্থিতিশীল রেফারেন্স পাওয়া যায়।
          </li>
        </ul>
      </Note>

      {/* ── Implementation ────────────────────────────────────────────── */}
      <H2 id="implementation">৩. Stale closure বনাম স্থিতিশীল হ্যান্ডলার</H2>

      <H3>❌ Anti-pattern — অপ্রয়োজনীয় useCallback ও stale closure</H3>

      <CodeBlock filename="app/_components/bad-callback-usage.tsx">{`'use client';

import { useCallback, useState } from 'react';

export function BadCallbackUsage() {
  const [count, setCount] = useState(0);

  // 1. Pointless: a native <button> does not compare prop references
  const handleNativeClick = useCallback(() => {
    console.log('Native button clicked');
  }, []);

  // 2. Stale closure: \`count\` is missing from the deps, so it is frozen at 0
  const handleStaleIncrement = useCallback(() => {
    setCount(count + 1); // always reads the initial count
  }, []); // ❌ missing [count]

  return (
    <div className="p-6 space-y-4 bg-slate-950 text-slate-100">
      <h2>Count: {count}</h2>

      <button onClick={handleNativeClick} className="px-3 py-1 bg-slate-800 rounded">
        Native click
      </button>

      <button onClick={handleStaleIncrement} className="px-3 py-1 bg-rose-600 rounded">
        Broken increment (stale)
      </button>
    </div>
  );
}`}</CodeBlock>

      <H3>🟢 Fix — functional update + memoized চাইল্ড</H3>

      <CodeBlock filename="app/tasks/page.tsx">{`'use client';

import { memo, useCallback, useState } from 'react';

interface TaskItemProps {
  id: number;
  title: string;
  completed: boolean;
  onToggle: (id: number) => void;
  onDelete: (id: number) => void;
}

// Memoized child — it only bails out if the function props stay stable
const TaskItem = memo(function TaskItem({
  id,
  title,
  completed,
  onToggle,
  onDelete,
}: TaskItemProps) {
  console.log(\`TaskItem #\${id} rendered\`);

  return (
    <div className="flex items-center justify-between p-3 bg-slate-900 border border-slate-800 rounded-xl">
      <div className="flex items-center gap-3">
        <input
          type="checkbox"
          checked={completed}
          onChange={() => onToggle(id)}
          className="h-4 w-4 rounded accent-indigo-500"
        />
        <span className={completed ? 'line-through text-slate-500' : 'text-slate-200'}>
          {title}
        </span>
      </div>
      <button
        onClick={() => onDelete(id)}
        className="px-2 py-1 text-xs bg-rose-500/10 text-rose-400 hover:bg-rose-500/20 rounded-md transition"
      >
        Delete
      </button>
    </div>
  );
});

export function OptimizedTaskList() {
  const [tasks, setTasks] = useState([
    { id: 1, title: 'Master component granularity', completed: true },
    { id: 2, title: 'Learn useCallback vs React.memo', completed: false },
    { id: 3, title: 'Optimize Next.js re-renders', completed: false },
  ]);
  const [filterText, setFilterText] = useState('');

  // Functional updates let the dependency array stay empty — the reference never changes
  const handleToggle = useCallback((id: number) => {
    setTasks((prev) =>
      prev.map((task) => (task.id === id ? { ...task, completed: !task.completed } : task)),
    );
  }, []);

  const handleDelete = useCallback((id: number) => {
    setTasks((prev) => prev.filter((task) => task.id !== id));
  }, []);

  return (
    <div className="p-6 space-y-6 bg-slate-950 text-slate-100 min-h-screen">
      <h1 className="text-2xl font-bold">Task manager</h1>

      {/* Typing here updates the parent, but no TaskItem re-renders */}
      <input
        type="text"
        placeholder="Filter view (parent state)..."
        value={filterText}
        onChange={(e) => setFilterText(e.target.value)}
        className="w-full p-3 bg-slate-900 border border-slate-800 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
      />

      <div className="space-y-3">
        {tasks.map((task) => (
          <TaskItem
            key={task.id}
            id={task.id}
            title={task.title}
            completed={task.completed}
            onToggle={handleToggle}
            onDelete={handleDelete}
          />
        ))}
      </div>
    </div>
  );
}`}</CodeBlock>

      {/* ── Matrix ────────────────────────────────────────────────────── */}
      <H2 id="matrix">৪. Handler Strategy Matrix</H2>

      <Table
        head={["ব্যবহারের ক্ষেত্র", "useCallback দেবেন?", "কারণ"]}
        rows={[
          [
            <>
              নেটিভ DOM এলিমেন্ট (<code>&lt;button onClick&gt;</code>)
            </>,
            "না ❌",
            "HTML এলিমেন্ট প্রপ রেফারেন্স ট্র্যাক করে না — পুরোটাই অপচয়",
          ],
          [
            <>
              <code>React.memo</code>-করা চাইল্ড কম্পোনেন্ট
            </>,
            "হ্যাঁ 🟢",
            "স্থিতিশীল রেফারেন্স না পেলে চাইল্ডের memo ফেল করে",
          ],
          [
            <>
              <code>useEffect</code>-এর ডিপেন্ডেন্সিতে থাকা ফাংশন
            </>,
            "হ্যাঁ 🟢",
            "নইলে প্রতি রেন্ডারে এফেক্ট আবার চলবে",
          ],
          [
            "কাস্টম হুক থেকে রিটার্ন করা মেথড",
            "হ্যাঁ 🟢",
            "কনজিউমার কম্পোনেন্ট যেন অনাকাঙ্ক্ষিত রেন্ডারে না পড়ে",
          ],
        ]}
      />

      <Line name="ভুলু ভাই">
        ক্লিয়ার! প্লেইন HTML বাটনে <code>useCallback</code> বাদ, আর <code>React.memo</code>{" "}
        চাইল্ডের হ্যান্ডলারে <code>useCallback</code> + functional update — তাহলে stale closure বাগও
        আসবে না।
      </Line>

      {/* ── Takeaways ─────────────────────────────────────────────────── */}
      <H2 id="takeaway">Production Takeaways</H2>

      <Note>
        <ul>
          <li>
            <strong>Rule of pair:</strong> <code>useCallback</code> আর <code>React.memo</code>{" "}
            জোড়ায় কাজ করে — চাইল্ডে <code>memo</code> না থাকলে হ্যান্ডলারে{" "}
            <code>useCallback</code> অর্থহীন।
          </li>
          <li>
            <strong>Prefer functional updates:</strong> <code>setItems(prev =&gt; ...)</code>{" "}
            প্যাটার্নে ডিপেন্ডেন্সি খালি রাখা যায় আর stale closure এড়ানো যায়।
          </li>
          <li>
            <strong>Don&apos;t wrap native handlers:</strong> প্লেইন বাটন বা ইনপুটে সরাসরি ইনলাইন
            অ্যারো ফাংশনই সবচেয়ে ক্লিন ও পারফরম্যান্ট।
          </li>
        </ul>
      </Note>
    </article>
  );
}
