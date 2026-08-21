import {
  CodeBlock,
  Diagram,
  H2,
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
      bn: "সার্ভার অ্যাকশন আসলে খোলা এন্ডপয়েন্ট",
      en: "A server action is a public endpoint",
    },
  },
  {
    id: "layers",
    label: { bn: "চার লেয়ারের ডিফেন্স", en: "Four layers of defence" },
  },
  {
    id: "helpers",
    label: { bn: "Step A — সিকিউরিটি হেল্পার", en: "Step A — security helpers" },
  },
  {
    id: "action",
    label: { bn: "Step B — সিকিউরড অ্যাকশন", en: "Step B — the secured action" },
  },
  {
    id: "form",
    label: { bn: "Step C — ক্লায়েন্ট ফর্ম", en: "Step C — the client form" },
  },
  {
    id: "matrix",
    label: {
      bn: "revalidatePath বনাম revalidateTag",
      en: "revalidatePath vs revalidateTag",
    },
  },
  {
    id: "takeaway",
    label: { bn: "Production Takeaways", en: "Production takeaways" },
  },
];

export default function ServerActionSecurity() {
  return (
    <article className="doc-prose">
      {/* ── The problem ───────────────────────────────────────────────── */}
      <H2 id="the-problem" anchorOnly>
        সার্ভার অ্যাকশন আসলে খোলা এন্ডপয়েন্ট
      </H2>

      <p>
        রাত ৩:১৫। ভুলু ভাই আগের টপিকে <code>useActionState</code> আর{" "}
        <code>useOptimistic</code> দিয়ে ফর্মের কাজ শেষ করে বেশ খুশি! কিন্তু হঠাৎ তাঁর বন্ধু
        সিকিউরিটি ইঞ্জিনিয়ার ফাহিম অ্যাপটা টেস্ট করে বলল — &quot;তোমার সার্ভার অ্যাকশন তো
        খোলা ময়দান! ক্লায়েন্ট সাইড থেকে টাইপ বাইপাস করে ম্যালিশিয়াস পেলোড পাঠালে পুরো
        ডাটাবেস ক্র্যাশ করবে।&quot;
      </p>

      <Line name="ভুলু ভাই">
        (ঘেমে গিয়ে) নেক্সট-ভাই! সার্ভার অ্যাকশন মূলত পাবলিক HTTP POST এন্ডপয়েন্ট তৈরি করে —
        এটা তো জানা ছিল না! ক্লায়েন্ট সাইডের ফর্ম ভ্যালিডেশন যে কেউ ব্রাউজার দেব-টুলস দিয়ে
        বাইপাস করে দিতে পারে। সার্ভার অ্যাকশনকে ১০০% প্রোডাকশন-রেডি ও সিকিউর করব কীভাবে?
      </Line>

      <Line name="নেক্সট-ভাই">
        (গম্ভীর হয়ে) একদম সঠিক জায়গায় হাত দিয়েছ ভুলু! এন্টারপ্রাইজ অ্যাপে একটি Server
        Action ডিফেন্ড করতে <strong>৪-লেয়ার সিকিউরিটি আর্কিটেকচার</strong> (Defense-in-Depth)
        মেনে চলতে হয়।
      </Line>

      {/* ── Layers ────────────────────────────────────────────────────── */}
      <H2 id="layers">১. চার লেয়ারের ডিফেন্স</H2>

      <ul>
        <li>
          <strong>Origin Check &amp; CSRF Protection:</strong> রিকোয়েস্টটি আপনার আসল সাইট
          থেকে এসেছে, নাকি কোনো থার্ড-পার্টি সাইট থেকে — তা নিশ্চিত করা।
        </li>
        <li>
          <strong>Schema &amp; Boundary Validation (Zod):</strong> স্ট্রিক্ট টাইপ চেকিং, যাতে
          Mass Assignment Vulnerability না ঘটে।
        </li>
        <li>
          <strong>Input Sanitization (XSS Defense):</strong> ইউজার ইনপুট থেকে ক্ষতিকর
          HTML/Script ছেঁকে ফেলা।
        </li>
        <li>
          <strong>Sanitized Error Boundaries:</strong> সার্ভারের সেনসিটিভ স্ট্যাক ট্রেস
          ক্লায়েন্টে লিক হতে না দেওয়া, আর মিউটেশনের পর ক্যাশ ফ্ল্যাশ করা।
        </li>
      </ul>

      <Diagram>{`[ Incoming Action Request ]
           │
           ▼
┌────────────────────────────────────────────────────────┐
│ 🛡️  Layer 1: CSRF & Origin Guard                       │
│     (compare the host and origin headers)              │
└────────────────────────────────────────────────────────┘
           │ Pass
           ▼
┌────────────────────────────────────────────────────────┐
│ 🔑  Layer 2: Authentication & Authorization            │
│     (session token & role verification)                │
└────────────────────────────────────────────────────────┘
           │ Pass
           ▼
┌────────────────────────────────────────────────────────┐
│ 🧪  Layer 3: Zod Schema Validation & XSS Sanitization  │
└────────────────────────────────────────────────────────┘
           │ Pass
           ▼
┌────────────────────────────────────────────────────────┐
│ ⚡  Layer 4: DB Mutation (try/catch) & Revalidation     │
│     (sanitized public error response on failure)       │
└────────────────────────────────────────────────────────┘`}</Diagram>

      {/* ── Helpers ───────────────────────────────────────────────────── */}
      <H2 id="helpers">২. Step A — সিকিউরিটি হেল্পার</H2>

      <CodeBlock filename="lib/security.ts">{`import { headers } from 'next/headers';

/** CSRF and origin validation guard */
export async function verifyRequestOrigin() {
  const headersList = await headers();
  const origin = headersList.get('origin');
  const host = headersList.get('host');

  if (process.env.NODE_ENV === 'production') {
    if (!origin || !host || !origin.includes(host)) {
      throw new Error('CSRF_VIOLATION: Invalid request origin.');
    }
  }
}

/** Strips the characters an XSS payload needs */
export function sanitizeInput(input: string): string {
  return input
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/script/gi, '')
    .trim();
}`}</CodeBlock>

      {/* ── Action ────────────────────────────────────────────────────── */}
      <H2 id="action">৩. Step B — সিকিউরড অ্যাকশন</H2>

      <CodeBlock filename="app/actions/user-actions.ts">{`'use server';

import { z } from 'zod';
import { revalidateTag, revalidatePath } from 'next/cache';
import { verifyRequestOrigin, sanitizeInput } from '@/lib/security';

// 1. Strict input structure via Zod
const profileUpdateSchema = z
  .object({
    username: z
      .string()
      .trim()
      .min(3, { message: 'ইউজারনেম অন্তত ৩ অক্ষরের হতে হবে।' })
      .max(20, { message: 'ইউজারনেম সর্বোচ্চ ২০ অক্ষরের হতে পারবে।' })
      .regex(/^[a-zA-Z0-9_]+$/, { message: 'স্পেশাল ক্যারেক্টার থাকা যাবে না।' }),
    bio: z
      .string()
      .max(100, { message: 'বায়ো সর্বোচ্চ ১০০ অক্ষরের হতে পারবে।' })
      .optional()
      .transform((val) => (val ? sanitizeInput(val) : '')),
  })
  .strict(); // No extra fields may sneak in

export interface FormResponse {
  success: boolean;
  message: string;
  fieldErrors?: { username?: string[]; bio?: string[] };
}

async function getAuthenticatedUser() {
  return { id: 'usr_9988', role: 'ADMIN' };
}

export async function updateProfileAction(
  prevState: FormResponse,
  formData: FormData,
): Promise<FormResponse> {
  try {
    // 🛡️ Layer 1 — CSRF & origin verification
    await verifyRequestOrigin();

    // 🔑 Layer 2 — authentication & authorization
    const user = await getAuthenticatedUser();
    if (!user) {
      return { success: false, message: 'অননুমোদিত অ্যাক্সেস! পুনরায় লগইন করুন।' };
    }

    // 🧪 Layer 3 — schema parsing & boundary check
    const validatedFields = profileUpdateSchema.safeParse({
      username: formData.get('username'),
      bio: formData.get('bio'),
    });

    if (!validatedFields.success) {
      return {
        success: false,
        message: 'ইনপুট ভ্যালিডেশন ব্যর্থ হয়েছে!',
        fieldErrors: validatedFields.error.flatten().fieldErrors,
      };
    }

    const { username, bio } = validatedFields.data;

    // ⚡ Layer 4 — DB operation inside try/catch
    await new Promise((resolve) => setTimeout(resolve, 800));
    console.log(\`[DB mutation success] user: \${user.id}\`, { username, bio });

    // 🔄 On-demand cache revalidation
    revalidateTag(\`user-profile-\${user.id}\`);
    revalidatePath('/profile');

    return { success: true, message: 'প্রোফাইল সফলভাবে আপডেট হয়েছে!' };
  } catch (error) {
    // 🚨 Never leak the internal error to the client
    console.error('[CRITICAL SERVER ACTION ERROR]:', error);

    if (error instanceof Error && error.message.startsWith('CSRF_VIOLATION')) {
      return { success: false, message: 'অবৈধ রিকোয়েস্ট উৎস — অ্যাকশন বাতিল।' };
    }

    return { success: false, message: 'সার্ভারে অভ্যন্তরীণ সমস্যা হয়েছে!' };
  }
}`}</CodeBlock>

      {/* ── Form ──────────────────────────────────────────────────────── */}
      <H2 id="form">৪. Step C — ক্লায়েন্ট ফর্ম</H2>

      <CodeBlock filename="app/profile/profile-form.tsx">{`'use client';

import { useActionState } from 'react';
import { updateProfileAction, type FormResponse } from '../actions/user-actions';

const initialState: FormResponse = { success: false, message: '' };

export function ProfileForm() {
  const [state, formAction, isPending] = useActionState(updateProfileAction, initialState);

  return (
    <form action={formAction} className="space-y-4">
      <div className="space-y-1">
        <label className="text-sm font-semibold text-slate-300">ইউজারনেম</label>
        <input
          type="text"
          name="username"
          defaultValue="zubayer_dev"
          className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5"
        />
        {state.fieldErrors?.username && (
          <p className="text-xs text-red-400 mt-1">{state.fieldErrors.username[0]}</p>
        )}
      </div>

      <div className="space-y-1">
        <label className="text-sm font-semibold text-slate-300">বায়ো</label>
        <textarea
          name="bio"
          rows={3}
          className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 resize-none"
        />
        {state.fieldErrors?.bio && (
          <p className="text-xs text-red-400 mt-1">{state.fieldErrors.bio[0]}</p>
        )}
      </div>

      {state.message && (
        <div
          className={state.success
            ? 'p-3 rounded-xl text-xs border bg-emerald-950/40 border-emerald-500/30 text-emerald-300'
            : 'p-3 rounded-xl text-xs border bg-red-950/40 border-red-500/30 text-red-300'}
        >
          {state.message}
        </div>
      )}

      <button
        type="submit"
        disabled={isPending}
        className="w-full py-3 bg-blue-600 hover:bg-blue-500 disabled:bg-slate-800 text-white font-semibold rounded-xl"
      >
        {isPending ? 'প্রসেসিং হচ্ছে…' : 'সেভ করুন'}
      </button>
    </form>
  );
}`}</CodeBlock>

      {/* ── Matrix ────────────────────────────────────────────────────── */}
      <H2 id="matrix">৫. revalidatePath বনাম revalidateTag</H2>

      <Table
        head={[
          "বৈশিষ্ট্য",
          <code key="p">revalidatePath</code>,
          <code key="t">revalidateTag</code>,
        ]}
        rows={[
          [
            "ক্যাশিং পদ্ধতি",
            "নির্দিষ্ট রুট/URL প্যাথের সমস্ত স্ট্যাটিক কন্টেন্ট ফ্ল্যাশ করে",
            "নির্দিষ্ট ট্যাগের সাথে যুক্ত ফেচ বা কোয়েরি ফ্ল্যাশ করে",
          ],
          [
            "কখন ব্যবহার",
            "পেজের লেআউট বা বড় অংশ বদলালে",
            "একই ডেটা একাধিক পেজে ব্যবহৃত হলে",
          ],
          [
            "পারফরম্যান্স",
            "কিছুটা ব্রড — পুরো রুটের ক্যাশ পরিষ্কার হয়",
            "প্রিসাইজ ও ফাইন-গ্রেইনড — শুধু ওই ডেটা",
          ],
        ]}
      />

      <Line name="ভুলু ভাই">
        (আশ্বস্ত হয়ে) চমৎকার! CSRF চেকে বাইরে থেকে ফেক পেলোড আসতে পারবে না, Zod-এর{" "}
        <code>.strict()</code> ইনপুটের বাউন্ডারি শক্ত করছে, আর এরর স্যানিটাইজেশনের ফলে
        ইন্টারনাল সার্ভার কোড লিক হওয়ার চান্স নেই!
      </Line>

      {/* ── Takeaways ─────────────────────────────────────────────────── */}
      <H2 id="takeaway">Production Takeaways</H2>

      <Note>
        <ul>
          <li>
            <strong>Public POST Endpoint Mental Model:</strong> Server Action ব্যাকএন্ডে
            একটি POST এন্ডপয়েন্ট তৈরি করে — Postman বা cURL দিয়ে যে কেউ হিট করতে পারে। তাই সব
            ভ্যালিডেশন সার্ভারেই শেষ করতে হবে।
          </li>
          <li>
            <strong>Strict Boundary via Zod:</strong> Mass Assignment ঝুঁকি এড়াতে schema-তে{" "}
            <code>.strict()</code> ব্যবহার করুন।
          </li>
          <li>
            <strong>Internal Error Masking:</strong> SQL exception, database URL, table
            name — কিছুই ক্লায়েন্টে রিটার্ন করবেন না; জেনেরিক মেসেজ পাঠিয়ে আসল এররটা Sentry
            বা Datadog-এ লগ করুন।
          </li>
          <li>
            <strong>On-Demand Cache Strategy:</strong> মিউটেশন শেষে পেজ রিলোড না দিয়ে{" "}
            <code>revalidateTag()</code> ও <code>revalidatePath()</code> দিয়ে ফাইন-গ্রেইনড
            আপডেট করুন।
          </li>
        </ul>
      </Note>
    </article>
  );
}
