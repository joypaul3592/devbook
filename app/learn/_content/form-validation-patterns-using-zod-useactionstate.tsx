import { CodeBlock, Diagram, H2, Line, Note } from "@/components/learn/DocParts";
import type { Bi } from "@/lib/curriculum";

/** Section anchors — consumed by the "on this page" rail. */
export const headings: { id: string; label: Bi }[] = [
  {
    id: "the-problem",
    label: { bn: "এরর কোথায় ধরব, লোডিং কোথায়", en: "Where do errors and loading live?" },
  },
  {
    id: "useactionstate",
    label: { bn: "useActionState কী করে", en: "What useActionState does" },
  },
  {
    id: "server-side",
    label: { bn: "১. Zod স্কিমা ও টাইপড স্টেট", en: "1. Zod schema and typed state" },
  },
  {
    id: "client-side",
    label: { bn: "২. ক্লায়েন্ট ফর্ম", en: "2. The client form" },
  },
  {
    id: "takeaway",
    label: { bn: "Production Takeaways", en: "Production takeaways" },
  },
];

export default function ZodUseActionState() {
  return (
    <article className="doc-prose">
      {/* ── The problem ───────────────────────────────────────────────── */}
      <H2 id="the-problem" anchorOnly>
        এরর কোথায় ধরব, লোডিং কোথায়
      </H2>

      <p>
        বিকেলের মিষ্টি রোদ জানলা দিয়ে এসে পড়ছে। ভুলু ভাই ল্যাপটপে কপাল কুঁচকে কোড করছেন।
        স্ক্রিনে একটা লম্বা রেজিস্ট্রেশন ফর্ম, কিন্তু সাবমিট বাটন চাপলেই পেজ রিলোড হয়ে সব
        ইনপুট ফিল্ড খালি হয়ে যাচ্ছে আর এরর মেসেজ গায়েব হয়ে যাচ্ছে!
      </p>

      <Line name="ভুলু ভাই">
        নেক্সট-ভাই! এই ফর্ম ফিল্ডের প্রবলেম আমাকে পাগল বানিয়ে ছাড়বে! আমি React 19 /
        Next.js 15-এর নিয়ম অনুযায়ী <code>actions.ts</code>-এ Zod দিয়ে ভ্যালিডেশন বসালাম।
        কিন্তু ইউজার যখন ভুল ইমেইল বা ছোট পাসওয়ার্ড দেয়, তখন সার্ভার অ্যাকশন থেকে রিটার্ন
        করা এরর অবজেক্ট ক্লায়েন্ট কম্পোনেন্টে ধরব কীভাবে? আর সাবমিট মারলে ইউজারকে যে
        &quot;Loading...&quot; বা স্পিনার দেখাব — সেটার স্টেটটাই বা কীভাবে সামলাব? আগে তো{" "}
        <code>useFormStatus</code> বা কাস্টম <code>useState</code> দিয়ে প্যাঁচ লেগে যেত!
      </Line>

      <Line name="নেক্সট-ভাই">
        (কফির মগ হাতে দাঁড়িয়ে হেসে) হা হা! ভুলু, তুই তো React 19 আর Next.js 15-এর ফর্ম
        স্টেট ম্যানেজমেন্টের সবচেয়ে ইম্পর্ট্যান্ট হুক — <code>useActionState</code> (যা
        React 18-এ <code>useFormState</code> নামে পরিচিত ছিল) — এর দরজায় এসে দাঁড়িয়েছিস!
      </Line>

      {/* ── useActionState ────────────────────────────────────────────── */}
      <H2 id="useactionstate">১. useActionState কী করে</H2>

      <Line name="ভুলু ভাই">(উৎসাহিত হয়ে) এটা কী কাজ করে ভাই?</Line>

      <Line name="নেক্সট-ভাই">
        শোন! React 19-এ ফর্মের টাইপ-সেফ ভ্যালিডেশন আর স্টেট হ্যান্ডলিং পানির মতো সহজ
        করার জন্য এই হুক আনা হয়েছে। এটা ৩টা কাজ একসাথে করে:
      </Line>

      <ul>
        <li>
          <strong>Previous vs New State:</strong> সার্ভার অ্যাকশন থেকে রিটার্ন হওয়া এরর
          বা সাকসেস রেসপন্সকে ক্লায়েন্ট ইউআই-তে সিঙ্ক করে।
        </li>
        <li>
          <strong>Pending State:</strong> ফর্ম সাবমিট হওয়ার সময় বাই-ডিফল্ট{" "}
          <code>isPending</code> ফ্ল্যাগ দেয়।
        </li>
        <li>
          <strong>Progressive Enhancement:</strong> JavaScript ডিজেবল থাকলেও ফর্ম সাবমিশন
          আর স্টেট রিটেনশন স্মুথলি ধরে রাখে।
        </li>
      </ul>

      <Diagram>{`[User Submits Form]
         │
         ▼
[Client Component with useActionState] ──(Sends FormData)──► [Server Action with Zod]
         ▲                                                              │
         │                                                              ▼
  [Renders UI with Errors / Pending] ◄──(Returns ActionState Object)────┘`}</Diagram>

      {/* ── Server side ───────────────────────────────────────────────── */}
      <H2 id="server-side">২. Zod স্কিমা ও টাইপড স্টেট</H2>

      <Line name="নেক্সট-ভাই">
        প্রথমে সার্ভার অ্যাকশনের জন্য একটা সুনির্দিষ্ট <code>ActionState</code> টাইপ আর
        Zod স্কিমা বানিয়ে নে:
      </Line>

      <CodeBlock filename="app/actions.ts">{`'use server'

import { z } from 'zod';

// 1. Zod validation schema
const RegisterSchema = z.object({
  email: z.string().email('ভুল ইমেইল ফরম্যাট!'),
  password: z.string().min(6, 'পাসওয়ার্ড অন্তত ৬ অক্ষরের হতে হবে!'),
});

// 2. Strongly typed state interface
export type ActionState = {
  success?: boolean;
  errors?: {
    email?: string[];
    password?: string[];
  };
  message?: string;
};

export async function registerUser(
  prevState: ActionState, // ⚡ First argument MUST be prevState for useActionState!
  formData: FormData
): Promise<ActionState> {
  const rawData = {
    email: formData.get('email') as string,
    password: formData.get('password') as string,
  };

  const validated = RegisterSchema.safeParse(rawData);

  if (!validated.success) {
    // Return structured Zod field errors
    return {
      success: false,
      errors: validated.error.flatten().fieldErrors,
      message: 'ফর্মে কিছু ভুল রয়েছে। অনুগ্রহ করে ঠিক করুন।',
    };
  }

  try {
    await db.user.create({ data: validated.data });
    return { success: true, message: 'রেজিস্ট্রেশন সফল হয়েছে!' };
  } catch (error) {
    return { success: false, message: 'ডাটাবেজ এরর! পরে চেষ্টা করুন।' };
  }
}`}</CodeBlock>

      {/* ── Client side ───────────────────────────────────────────────── */}
      <H2 id="client-side">৩. ক্লায়েন্ট ফর্ম</H2>

      <Line name="নেক্সট-ভাই">
        এবার ক্লায়েন্ট কম্পোনেন্টে <code>useActionState</code> হুক কানেক্ট কর:
      </Line>

      <CodeBlock filename="app/register-form.tsx">{`'use client'

import { useActionState } from 'react';
import { registerUser, ActionState } from '@/app/actions';

const initialState: ActionState = {
  success: false,
  errors: {},
  message: '',
};

export function RegisterForm() {
  // ⚡ Tuple: [state, formAction, isPending]
  const [state, formAction, isPending] = useActionState(registerUser, initialState);

  return (
    <form action={formAction} className="space-y-4 max-w-md">
      {/* Global message */}
      {state.message && (
        <p className={state.success ? 'text-green-700' : 'text-red-700'}>
          {state.message}
        </p>
      )}

      <div>
        <label className="block text-sm font-medium">ইমেইল:</label>
        <input type="email" name="email" disabled={isPending} />
        {/* Field-specific Zod error */}
        {state.errors?.email && (
          <p className="text-red-500 text-xs mt-1">{state.errors.email[0]}</p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium">পাসওয়ার্ড:</label>
        <input type="password" name="password" disabled={isPending} />
        {state.errors?.password && (
          <p className="text-red-500 text-xs mt-1">{state.errors.password[0]}</p>
        )}
      </div>

      {/* Submit button with built-in pending state */}
      <button type="submit" disabled={isPending}>
        {isPending ? 'প্রসেসিং হচ্ছে...' : 'রেজিস্টার করুন'}
      </button>
    </form>
  );
}`}</CodeBlock>

      <Line name="ভুলু ভাই">(ল্যাপটপের কোডের দিকে তাকিয়ে অবাক হয়ে) ওয়াও নেক্সট-ভাই!</Line>

      <ul>
        <li>
          <code>useActionState(registerUser, initialState)</code> দেওয়ার সাথে সাথে এটা
          আমাকে <code>[state, formAction, isPending]</code> তিনটাই দিয়ে দিল!
        </li>
        <li>
          আলাদা করে <code>const [loading, setLoading] = useState(false)</code> রাখা লাগলো
          না, কারণ <code>isPending</code> অটোমেটিক লোডিং ম্যানেজ করছে!
        </li>
        <li>
          আর Zod-এর <code>flatten().fieldErrors</code> দিয়ে রিটার্ন করা এররগুলো সোজা{" "}
          <code>state.errors.email[0]</code> হিসেবে ফিল্ডের নিচে বসে গেল!
        </li>
      </ul>

      <Line name="নেক্সট-ভাই">
        একদম পারফেক্ট! আরেকটা জিনিস মনে রাখ:{" "}
        <code>registerUser(prevState, formData)</code>-এর প্রথম আর্গুমেন্ট হিসেবে
        বাধ্যতামূলক <code>prevState</code> দিতে হবে, কারণ হুকটা আগের স্টেট ট্র্যাক করে কাজ
        করে।
      </Line>

      <Note>
        <p>
          এরর অবজেক্ট <em>রিটার্ন</em> করা আর <em>throw</em> করা এক জিনিস নয়। ভ্যালিডেশন
          এরর রিটার্ন করলে ইউজার ফিল্ডের নিচে মেসেজ দেখে; throw করলে সেটা error boundary
          পর্যন্ত উঠে গিয়ে পুরো পেজ ভেঙে দেখায়।
        </p>
      </Note>

      {/* ── Takeaway ──────────────────────────────────────────────────── */}
      <H2 id="takeaway">💡 Production Engineering Takeaways</H2>

      <ul>
        <li>
          <strong>React 19 Standard:</strong> React 19 আর Next.js 15-এ ফর্মের ব্যাকএন্ড
          ইন্টারঅ্যাকশনের জন্য <code>useFormState</code>-এর বদলে{" "}
          <code>useActionState</code> ব্যবহার করাই অফিশিয়াল স্ট্যান্ডার্ড।
        </li>
        <li>
          <strong>Zod Flattening:</strong> এরর হ্যান্ডলিংয়ের সময়{" "}
          <code>error.flatten().fieldErrors</code> ব্যবহার করলে তা সহজে টাইপ-সেফ অবজেক্ট
          হিসেবে ক্লায়েন্টে রিটার্ন করা যায়।
        </li>
        <li>
          <strong>Built-in Pending State:</strong> <code>useActionState</code>-এর ৩ নম্বর
          রিটার্ন ভ্যালু <code>isPending</code> ব্যবহার করলে আলাদা স্পিনার স্টেট ডিক্লেয়ার
          করার দরকার পড়ে না।
        </li>
      </ul>
    </article>
  );
}
