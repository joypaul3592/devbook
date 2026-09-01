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
      bn: "ভুল ইমেইলে ৫০০ সার্ভার এরর",
      en: "A bad email, a 500 error page",
    },
  },
  {
    id: "architecture",
    label: {
      bn: "Validation error ফ্লো",
      en: "The validation error flow",
    },
  },
  {
    id: "mechanisms",
    label: { bn: "৩টি আর্কিটেকচারাল কনসেপ্ট", en: "Three architectural concepts" },
  },
  {
    id: "implementation",
    label: {
      bn: "safeParse ও inline field এরর",
      en: "safeParse & inline field errors",
    },
  },
  {
    id: "matrix",
    label: { bn: "parse vs safeParse", en: "parse vs safeParse" },
  },
  {
    id: "takeaway",
    label: { bn: "Production Takeaways", en: "Production takeaways" },
  },
];

export default function ValidationErrors() {
  return (
    <article className="doc-prose">
      {/* ── The problem ───────────────────────────────────────────────── */}
      <H2 id="the-problem" anchorOnly>
        ভুল ইমেইলে ৫০০ সার্ভার এরর
      </H2>

      <p>
        বিকাল ৫:৩০। ভুলু ভাই রেজিস্ট্রেশন ফর্মে কাজ করছিলেন। ইউজার ভুল পাসওয়ার্ড বা ভুল ফরম্যাটের
        ইমেইল দিয়ে সাবমিট করলে ব্যাকএন্ড থেকে আনহ্যান্ডেলড <code>ZodError</code> থ্রো হয়ে ৫০০ সার্ভার
        এরর পেজ চলে আসছে! আবার কখনো পুরো ফর্মের ওপরে একটি জেনেরিক বার্তা &quot;Validation
        failed&quot; ভেসে উঠছে — কিন্তু ঠিক কোন ফিল্ডে কী ভুল হয়েছে, তা ইউজার বুঝতে পারছে না।
      </p>

      <Line name="ভুলু ভাই">
        ফাহিম! ইনপুট ভুল দিলে ব্যাকএন্ড থেকে এক্সসেপশন থ্রো হয়ে ৫০০ পেজ চলে যাচ্ছে কেন? আর কোন ইনপুট
        ফিল্ডটা লাল হবে বা নিচে এরর মেসেজ দেখাবে — সেটা কীভাবে হ্যান্ডেল করব?
      </Line>

      <Line name="ফাহিম">
        ভুলু ভাই! ইনপুট ভ্যালিডেশন এরর কোনো সিস্টেম বা সার্ভার ক্র্যাশ নয়, এটি একটি{" "}
        <strong>expected user error</strong>! তাই এখানে <code>throw new Error()</code> করা যাবে না।
        ভ্যালিডেশন ফেল করলে সার্ভার থেকে ফিল্ড-বাই-ফিল্ড স্ট্রাকচার্ড এরর অবজেক্ট রিটার্ন করতে হবে।
      </Line>

      <Line name="নেক্সট-ভাই">
        একদম! Zod-এর <code>safeParse()</code> দিয়ে Server Action-এ ইনপুট ভ্যালিডেট করতে হবে এবং
        ফিল্ড-লেভেল এরর অবজেক্ট ক্লায়েন্টে পাঠিয়ে ফর্মের নিচে ইনলাইন এরর রেন্ডার করতে হবে!
      </Line>

      {/* ── Architecture ──────────────────────────────────────────────── */}
      <H2 id="architecture">১. Validation Error Handling Architecture</H2>

      <Diagram>{`┌─────────────────────────────────────────────────────────────────────────────┐
│                 SERVER-SIDE VALIDATION ERROR FLOW                           │
└─────────────────────────────────────────────────────────────────────────────┘

 Client form submission: <form action={formAction}>
                        │
                        ▼
 Server Action: actions/register.ts
                        │
                        ▼
 Zod validation: schema.safeParse(formData)
                        │
          ┌─────────────┴─────────────┐
    [valid data]              [invalid data]
      │                           │
      ▼                           ▼
 database save            return structured field errors
      │                   { success: false,
      ▼                     errors: { email: [...], password: [...] } }
 redirect / success UI            │
                                  ▼
                        🟢 the form renders inline errors, per field`}</Diagram>

      {/* ── Mechanisms ────────────────────────────────────────────────── */}
      <H2 id="mechanisms">২. কোর আর্কিটেকচারাল কনসেপ্ট</H2>

      <p>
        <strong>Expected vs unexpected errors:</strong> ইউজার ইমেইল ফরম্যাট ভুল লিখলে বা পাসওয়ার্ড ৮
        ক্যারেক্টারের কম দিলে তা সার্ভারের অভ্যন্তরীণ সমস্যা নয়। তাই এগুলোতে throw না করে রেসপন্স
        অবজেক্টে ফ্ল্যাটেনড <code>fieldErrors</code> পাঠাতে হয়।
      </p>

      <p>
        <strong>Single source of truth with Zod:</strong> একবার স্কিমা ডিফাইন করে রাখলে ক্লায়েন্ট-সাইড
        ও সার্ভার-সাইড — দুই জায়গাতেই একই রুলস প্রয়োগ করা যায়, আর টাইপও সেখান থেকেই ইনফার হয়।
      </p>

      <p>
        <strong>Accessibility &amp; field-level binding:</strong> ইনপুট ফিল্ডের নিচে লাল রঙের এরর
        টেক্সট দেখানোর পাশাপাশি স্ক্রিন রিডারের জন্য <code>aria-invalid</code> এবং{" "}
        <code>aria-describedby</code> বাইন্ড করা একটি অ্যাক্সেসিবল প্রোডাকশন ফর্মে বাধ্যতামূলক — রঙই
        একমাত্র সিগন্যাল হতে পারে না।
      </p>

      {/* ── Implementation ────────────────────────────────────────────── */}
      <H2 id="implementation">৩. Production Code Implementation</H2>

      <H3>❌ Anti-pattern — throwing on validation failure</H3>

      <CodeBlock filename="actions/update-user.ts">{`// 🔴 POOR PRACTICE: .parse() turns a user typo into a server exception
'use server';

import { z } from 'zod';

const schema = z.object({ email: z.string().email() });

export async function updateUser(formData: FormData) {
  // ❌ .parse() throws — an unhandled ZodError becomes a 500 error page
  const data = schema.parse({ email: formData.get('email') });

  // database update…
}`}</CodeBlock>

      <H3>🟢 Production pattern — typed validation state with Server Actions</H3>

      <p>
        <strong>Step 1 — শেয়ার্ড স্কিমা ও state কনট্র্যাক্ট।</strong>
      </p>

      <CodeBlock filename="lib/schemas/auth.ts">{`// 🟢 PRODUCTION PATTERN: one schema, shared by server and client
import { z } from 'zod';

export const RegisterSchema = z.object({
  email: z.string().trim().email('সঠিক ইমেইল এড্রেস প্রদান করুন'),
  password: z.string().min(8, 'পাসওয়ার্ড অন্তত ৮ ক্যারেক্টারের হতে হবে'),
});

export type FormState = {
  success: boolean;
  message?: string;
  errors?: {
    email?: string[];
    password?: string[];
  };
};`}</CodeBlock>

      <p>
        <strong>Step 2 — স্ট্রাকচার্ড এরর রিটার্ন করা Server Action।</strong>
      </p>

      <CodeBlock filename="actions/register.ts">{`// 🟢 PRODUCTION PATTERN: safe validation, no exceptions
'use server';

import { RegisterSchema, type FormState } from '@/lib/schemas/auth';

export async function registerUserAction(
  prevState: FormState,
  formData: FormData
): Promise<FormState> {
  const rawData = {
    email: formData.get('email') as string,
    password: formData.get('password') as string,
  };

  // 🟢 1. validate without throwing
  const validation = RegisterSchema.safeParse(rawData);

  if (!validation.success) {
    // 🟢 2. flatten to a simple { field: string[] } map the UI can render
    return {
      success: false,
      message: 'ইনপুট ফর্মে ভুল রয়েছে। অনুগ্রহ করে সংশোধন করুন।',
      errors: validation.error.flatten().fieldErrors,
    };
  }

  // 🟢 3. only now touch the database
  try {
    // await db.user.create({ data: validation.data })
    return { success: true, message: 'অ্যাকাউন্ট সফলভাবে তৈরি হয়েছে!' };
  } catch (error) {
    console.error('Register action failed:', error);
    return { success: false, message: 'সার্ভারে অভ্যন্তরীণ সমস্যা হয়েছে।' };
  }
}`}</CodeBlock>

      <p>
        <strong>Step 3 — অ্যাক্সেসিবল ক্লায়েন্ট ফর্ম।</strong>
      </p>

      <CodeBlock filename="components/RegisterForm.tsx">{`// 🟢 PRODUCTION PATTERN: inline, accessible field errors
'use client';

import { useActionState } from 'react';
import { registerUserAction } from '@/actions/register';
import type { FormState } from '@/lib/schemas/auth';

const initialState: FormState = { success: false };

export function RegisterForm() {
  const [state, formAction, isPending] = useActionState(registerUserAction, initialState);

  return (
    <form action={formAction} className="space-y-4 max-w-md mx-auto p-6 bg-white border rounded-xl">
      <h2 className="text-xl font-bold">রেজিস্ট্রেশন করুন</h2>

      {state.message && (
        <div
          className={\`p-3 rounded-lg text-sm \${
            state.success ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
          }\`}
        >
          {state.message}
        </div>
      )}

      <div className="space-y-1">
        <label htmlFor="email" className="text-sm font-medium">
          ইমেইল এড্রেস
        </label>
        <input
          id="email"
          name="email"
          type="email"
          // 🟢 the error is announced, not just coloured
          aria-invalid={!!state.errors?.email}
          aria-describedby={state.errors?.email ? 'email-error' : undefined}
          className={\`w-full p-2.5 border rounded-lg \${
            state.errors?.email ? 'border-red-500 bg-red-50' : 'border-gray-300'
          }\`}
        />
        {state.errors?.email && (
          <p id="email-error" className="text-xs text-red-600">
            {state.errors.email[0]}
          </p>
        )}
      </div>

      <div className="space-y-1">
        <label htmlFor="password" className="text-sm font-medium">
          পাসওয়ার্ড
        </label>
        <input
          id="password"
          name="password"
          type="password"
          aria-invalid={!!state.errors?.password}
          aria-describedby={state.errors?.password ? 'password-error' : undefined}
          className={\`w-full p-2.5 border rounded-lg \${
            state.errors?.password ? 'border-red-500 bg-red-50' : 'border-gray-300'
          }\`}
        />
        {state.errors?.password && (
          <p id="password-error" className="text-xs text-red-600">
            {state.errors.password[0]}
          </p>
        )}
      </div>

      <button
        type="submit"
        disabled={isPending}
        className="w-full py-2.5 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 disabled:opacity-50"
      >
        {isPending ? 'প্রসেসিং হচ্ছে...' : 'রেজিস্টার করুন'}
      </button>
    </form>
  );
}`}</CodeBlock>

      {/* ── Matrix ────────────────────────────────────────────────────── */}
      <H2 id="matrix">৪. parse() vs safeParse() Comparison</H2>

      <Table
        head={["বিষয়", "schema.parse() (anti-pattern)", "schema.safeParse() (production)"]}
        rows={[
          [
            "Execution behaviour",
            "ভুল ইনপুটে exception থ্রো করে 🔴",
            "নিরাপদে { success, error } অবজেক্ট দেয় 🟢",
          ],
          [
            "HTTP impact",
            "আনহ্যান্ডেলড থাকলে 500 হয় 🔴",
            "প্রপার রেসপন্সসহ ফিল্ড এরর যায় 🟢",
          ],
          [
            "UI experience",
            "পুরো পেজ ক্র্যাশ বা ফাঁকা হয়ে যায় 🔴",
            "নির্দিষ্ট ফিল্ডের নিচে এরর মেসেজ 🟢",
          ],
          [
            "Accessibility",
            "কোনো সাপোর্ট নেই 🔴",
            "aria-invalid ও aria-describedby দিয়ে অ্যাক্সেসিবল 🟢",
          ],
        ]}
      />

      <Line name="ভুলু ভাই">
        একদম পরিষ্কার ফাহিম! <code>safeParse()</code> দিয়ে ফিল্ড-লেভেল এরর বের করে ইনপুট ফিল্ডের নিচে
        দেখানোই ভ্যালিডেশন এরর হ্যান্ডলিংয়ের সেরা প্র্যাকটিস!
      </Line>

      {/* ── Takeaways ─────────────────────────────────────────────────── */}
      <H2 id="takeaway">Production Takeaways</H2>

      <Note>
        <ul>
          <li>
            <strong>Never use parse() in Server Actions:</strong> সবসময় <code>safeParse()</code>{" "}
            ব্যবহার করুন, যেন ভ্যালিডেশন ফেইল করলেও সার্ভার এক্সসেপশন না ছুড়ে স্বাভাবিকভাবে রেসপন্স
            পাঠাতে পারে।
          </li>
          <li>
            <strong>Flatten the Zod error:</strong>{" "}
            <code>validation.error.flatten().fieldErrors</code> Zod-এর জটিল এরর অবজেক্টকে সহজ
            কি-ভ্যালু ম্যাপে রূপ দেয়, যা দিয়ে UI-তে টেক্সট দেখানো অনেক সহজ।
          </li>
          <li>
            <strong>Bind the accessibility attributes:</strong> ফিল্ড লাল করার সময় শুধু রঙে থামবেন না
            — <code>aria-invalid</code> ও <code>aria-describedby</code> সেট করুন, যেন স্ক্রিন রিডারও
            ভুলটা জানাতে পারে।
          </li>
        </ul>
      </Note>
    </article>
  );
}
