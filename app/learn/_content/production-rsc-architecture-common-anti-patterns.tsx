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
      bn: "রিলিজের আগের রাতের রিভিউ",
      en: "The review the night before release",
    },
  },
  {
    id: "layering",
    label: {
      bn: "প্রোডাকশন RSC লেয়ারিং",
      en: "Production RSC layering",
    },
  },
  {
    id: "anti-patterns",
    label: {
      bn: "৬টি কমন অ্যান্টি-প্যাটার্ন",
      en: "Six common anti-patterns",
    },
  },
  {
    id: "mutation-boundary",
    label: {
      bn: "মিউটেশন বাউন্ডারির নিরাপত্তা",
      en: "Securing the mutation boundary",
    },
  },
  {
    id: "checklist",
    label: { bn: "রিভিউ চেকলিস্ট", en: "Review checklist" },
  },
  {
    id: "takeaway",
    label: { bn: "Production Takeaways", en: "Production takeaways" },
  },
];

export default function ProductionRscArchitectureAntiPatterns() {
  return (
    <article className="doc-prose">
      {/* ── The problem ───────────────────────────────────────────────── */}
      <H2 id="the-problem" anchorOnly>
        রিলিজের আগের রাতের রিভিউ
      </H2>

      <p>
        রাত ৯:৫০। চ্যাপ্টারের শেষ রাত। ভুলু ভাইয়ের অ্যাপ রিলিজের আগে ফাহিম পুরো কোডবেসে
        একটা RSC অডিট চালাল — আর একে একে ছয়টি চেনা অ্যান্টি-প্যাটার্ন বেরিয়ে এলো।
      </p>

      <Line name="ফাহিম">
        ভুলু ভাই! আলাদা আলাদা লেসনে সব শিখেছ ঠিকই, কিন্তু একসাথে কোডবেসে বসাতে গিয়ে
        গড়বড় হয়ে গেছে — কোথাও লেআউটে <code>&apos;use client&apos;</code>, কোথাও
        সার্ভার-ওনলি ফাইল ক্লায়েন্টে, আবার কোথাও ফর্মের হিডেন ইনপুট থেকে সোজা{" "}
        <code>userId</code> নিয়ে DB আপডেট!
      </Line>

      <Line name="নেক্সট-ভাই">
        তাহলে আজ পুরো চ্যাপ্টারটা এক জায়গায় বাঁধি — একটা{" "}
        <strong>প্রোডাকশন RSC লেয়ারিং মডেল</strong>, আর তার পাশে যে ছয়টি অ্যান্টি-প্যাটার্ন
        রিভিউতে সবচেয়ে বেশি ধরা পড়ে সেগুলোর তালিকা।
      </Line>

      {/* ── Layering ──────────────────────────────────────────────────── */}
      <H2 id="layering">১. প্রোডাকশন RSC লেয়ারিং</H2>

      <Diagram>{`┌──────────────────────────────────────────────────────────────────────┐
│ LAYER 1 — DATA ACCESS (server only)                                  │
│   lib/db/*.ts, lib/auth/*.ts        import 'server-only'             │
│   Owns: queries, secrets, sessions, cache tags                       │
└─────────────────────────────┬────────────────────────────────────────┘
                              │ returns plain DTOs
                              v
┌──────────────────────────────────────────────────────────────────────┐
│ LAYER 2 — SERVER COMPONENTS (routes & sections)                      │
│   app/**/page.tsx, components/server/*.tsx                           │
│   Owns: composition, Suspense boundaries, DTO mapping                │
└─────────────────────────────┬────────────────────────────────────────┘
                              │ serializable props + children slots
                              v
┌──────────────────────────────────────────────────────────────────────┐
│ LAYER 3 — CLIENT LEAVES (interactivity only)                         │
│   components/ui/*.tsx with 'use client'                              │
│   Owns: local UI state, event handlers, third-party wrappers         │
└─────────────────────────────┬────────────────────────────────────────┘
                              │ form action / router.push
                              v
┌──────────────────────────────────────────────────────────────────────┐
│ LAYER 4 — MUTATIONS ('use server' actions)                           │
│   Auth check -> schema validation -> DB write -> revalidate          │
└──────────────────────────────────────────────────────────────────────┘`}</Diagram>

      <Note>
        <p>
          নিয়মটা এক লাইনে: <strong>ডেটা নিচ থেকে উপরে ওঠে না</strong>। Layer 1 কখনো Layer
          3 চেনে না, আর Layer 3 কখনো Layer 1 ইমপোর্ট করে না — মাঝখানে সবসময় Layer 2।
        </p>
      </Note>

      {/* ── Anti-patterns ─────────────────────────────────────────────── */}
      <H2 id="anti-patterns">২. ৬টি কমন অ্যান্টি-প্যাটার্ন</H2>

      <Table
        head={["#", "অ্যান্টি-প্যাটার্ন", "কেন খারাপ", "সমাধান"]}
        rows={[
          [
            "১",
            <>
              লেআউট/পেজের টপে <code>&apos;use client&apos;</code>
            </>,
            "পুরো সাবট্রি ক্লায়েন্ট বান্ডলে ঢুকে যায়",
            "ইন্টারঅ্যাক্টিভ লিফ আলাদা করো",
          ],
          [
            "২",
            "ক্লায়েন্ট ফাইলে সার্ভার কম্পোনেন্ট ইমপোর্ট",
            "সার্ভার ক্যাপাবিলিটি হারায়, Node API ভাঙে",
            <>
              <code>children</code> / slot দিয়ে পাস করো
            </>,
          ],
          [
            "৩",
            "প্যারেন্টে সব ডেটা ফেচ করে prop drilling",
            "sequential waterfall, ব্ল্যাঙ্ক স্ক্রিন",
            <>
              সেকশনে colocate + আলাদা <code>&lt;Suspense&gt;</code>
            </>,
          ],
          [
            "৪",
            "ক্লাস ইনস্ট্যান্স বা ফাংশন প্রপ্স পাঠানো",
            "সিরিয়ালাইজেশন এরর",
            "DTO ম্যাপিং, সার্ভারেই লজিক কম্পিউট",
          ],
          [
            "৫",
            <>
              সার্ভার প্রপ্স <code>useState</code>-এ কপি করা
            </>,
            "নতুন প্রপ্স এলে UI বাসি থেকে যায়",
            <>
              সরাসরি রেন্ডার, নয়তো <code>key</code> দিয়ে রিসেট
            </>,
          ],
          [
            "৬",
            "মিউটেশনে ক্লায়েন্ট-পাঠানো id বিশ্বাস করা",
            "অন্যের রেকর্ড এডিট করা যায়",
            "সেশন থেকে id, Zod দিয়ে ভ্যালিডেশন",
          ],
        ]}
      />

      {/* ── Mutation boundary ─────────────────────────────────────────── */}
      <H2 id="mutation-boundary">৩. মিউটেশন বাউন্ডারির নিরাপত্তা</H2>

      <p>
        ভুলু ভাই প্রোফাইল আপডেটের ফর্মে{" "}
        <code>&lt;input type=&quot;hidden&quot; name=&quot;userId&quot; /&gt;</code> বসিয়ে
        সেটি সোজা ডাটাবেসে পাঠাচ্ছিলেন।
      </p>

      <Line name="ফাহিম">
        ভুলু ভাই! DevTools দিয়ে ঐ হিডেন <code>userId</code> বদলে অন্য ইউজারের আইডি বসিয়ে
        দিলে তোমার অ্যাকশন কোনো প্রশ্ন না করেই ভিকটিমের প্রোফাইল আপডেট করে দেবে!
      </Line>

      <Line name="নেক্সট-ভাই">
        ঠিক। <code>&apos;use server&apos;</code> ফাংশন দেখতে সাধারণ ফাংশন মনে হলেও Next.js
        এর জন্য একটি <strong>পাবলিক HTTP POST endpoint (RPC)</strong> জেনারেট করে —
        cURL বা Postman থেকেও কল করা যায়। তাই API Route-এর সব গার্ড এখানেও লাগবে।
      </Line>

      <CodeBlock filename="app/actions/update-profile.ts">{`// 🟢 app/actions/update-profile.ts
'use server';

import { z } from 'zod';
import { revalidatePath } from 'next/cache';
import { getAuthenticatedSession } from '@/lib/auth/session'; // reads HTTP-only cookies

const updateProfileSchema = z.object({
  displayName: z.string().min(3, 'Display name must be at least 3 characters').max(50),
  bio: z.string().max(160, 'Bio cannot exceed 160 characters').optional(),
});

export type ActionState = {
  success: boolean;
  message?: string;
  errors?: { displayName?: string[]; bio?: string[] };
};

export async function updateProfileAction(
  prevState: ActionState,
  formData: FormData
): Promise<ActionState> {
  // 1. AUTHENTICATION — the real userId comes from the session, never the form
  const session = await getAuthenticatedSession();
  if (!session) {
    return { success: false, message: 'Unauthorized. Please log in first.' };
  }

  // 2. VALIDATION — client-side TypeScript guards do not exist at runtime
  const parsed = updateProfileSchema.safeParse({
    displayName: formData.get('displayName'),
    bio: formData.get('bio'),
  });

  if (!parsed.success) {
    return {
      success: false,
      errors: parsed.error.flatten().fieldErrors,
      message: 'Invalid input fields.',
    };
  }

  // 3. MUTATION — scoped to the verified session user
  await db.user.update({
    where: { id: session.userId },
    data: parsed.data,
  });

  // 4. CACHE — purge what the mutation invalidated
  revalidatePath('/profile');

  return { success: true, message: 'Profile updated successfully!' };
}`}</CodeBlock>

      <H3>ফর্ম সাইড — useActionState</H3>

      <CodeBlock filename="app/profile/profile-form-client.tsx">{`// 🟢 app/profile/profile-form-client.tsx
'use client';

import { useActionState } from 'react';
import { updateProfileAction, type ActionState } from '@/app/actions/update-profile';

const initialState: ActionState = { success: false, message: '' };

export function ProfileFormClient({ initialName }: { initialName: string }) {
  const [state, formAction, isPending] = useActionState(updateProfileAction, initialState);

  return (
    <form action={formAction} className="space-y-4 max-w-md">
      {state.message && (
        <p className={state.success ? 'text-emerald-400 text-xs' : 'text-red-400 text-xs'}>
          {state.message}
        </p>
      )}

      <input
        type="text"
        name="displayName"
        defaultValue={initialName}
        className="w-full bg-slate-950 border border-slate-800 rounded px-3 py-2 text-xs"
      />
      {state.errors?.displayName && (
        <p className="text-[10px] text-red-400 font-mono">{state.errors.displayName[0]}</p>
      )}

      <button
        type="submit"
        disabled={isPending}
        className="w-full bg-emerald-600 text-white py-2 rounded text-xs disabled:opacity-50"
      >
        {isPending ? 'Saving...' : 'Save profile'}
      </button>
    </form>
  );
}`}</CodeBlock>

      <Note>
        <p>
          Next.js সার্ভার অ্যাকশনে CSRF প্রোটেকশন বিল্ট-ইন, কিন্তু rate limiting নয় —
          পাবলিক মিউটেশনে <code>@upstash/ratelimit</code> ধরনের গার্ড যোগ করো। Server
          Action-এর পূর্ণ আর্কিটেকচার পরের চ্যাপ্টারগুলোতে বিস্তারিত আসছে।
        </p>
      </Note>

      {/* ── Checklist ─────────────────────────────────────────────────── */}
      <H2 id="checklist">৪. রিভিউ চেকলিস্ট</H2>

      <Note>
        <ul>
          <li>
            প্রতিটি <code>&apos;use client&apos;</code> ফাইল কি সত্যিই একটি লিফ? উপরে
            তুলতে পারলে তুলে ফেলো।
          </li>
          <li>
            <code>lib/</code>-এর সার্ভার ফাইলগুলোতে <code>import &apos;server-only&apos;</code>{" "}
            আছে কি?
          </li>
          <li>
            বাউন্ডারি-ক্রসিং প্রতিটি প্রপের কি একটি <code>*DTO</code> টাইপ আছে?
          </li>
          <li>
            ধীর সেকশনগুলো কি নিজস্ব <code>&lt;Suspense&gt;</code> বাউন্ডারিতে আছে?
          </li>
          <li>
            প্রতিটি <code>&apos;use server&apos;</code> ফাংশনের প্রথম দুই ধাপ কি auth ও
            validation?
          </li>
          <li>
            <code>@next/bundle-analyzer</code> রিপোর্টে কি অপ্রত্যাশিত কোনো ভারী প্যাকেজ
            ক্লায়েন্ট চাঙ্কে আছে?
          </li>
        </ul>
      </Note>

      <Line name="ভুলু ভাই">
        (হাঁফ ছেড়ে) এবার পুরো ছবিটা মাথায় বসল নেক্সট-ভাই! সার্ভার ডেটা আনবে, কম্পোজ করবে;
        ক্লায়েন্ট শুধু ইন্টারঅ্যাক্ট করবে; আর মিউটেশন সবসময় সেশন যাচাই করে তবেই ডাটাবেসে
        হাত দেবে।
      </Line>

      {/* ── Takeaways ─────────────────────────────────────────────────── */}
      <H2 id="takeaway">Production Takeaways</H2>

      <Note>
        <ul>
          <li>
            <strong>Boundaries are architecture:</strong> কোথায়{" "}
            <code>&apos;use client&apos;</code> বসছে সেটাই তোমার অ্যাপের বান্ডল সাইজ, ডেটা
            ফ্লো আর সিকিউরিটি মডেল ঠিক করে দেয়।
          </li>
          <li>
            <strong>Enforce, don&apos;t remember:</strong> <code>server-only</code>, DTO
            টাইপ আর lint রুল দিয়ে ভুলগুলো বিল্ড টাইমেই ধরা পড়ুক।
          </li>
          <li>
            <strong>Measure every release:</strong> bundle analyzer আর{" "}
            <code>_rsc</code> রেসপন্স সাইজ — দুটোই রিলিজ চেকলিস্টে রাখো।
          </li>
          <li>
            <strong>Every mutation is a public endpoint:</strong> auth → validate →
            mutate → revalidate, এই চার ধাপের কোনোটাই বাদ দিও না।
          </li>
        </ul>
      </Note>
    </article>
  );
}
