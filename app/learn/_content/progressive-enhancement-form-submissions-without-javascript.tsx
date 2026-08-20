import { CodeBlock, Diagram, H2, Line, Note } from "@/components/learn/DocParts";
import type { Bi } from "@/lib/curriculum";

/** Section anchors — consumed by the "on this page" rail. */
export const headings: { id: string; label: Bi }[] = [
  {
    id: "the-magic",
    label: { bn: "JS অফ, তবু ফর্ম কাজ করছে", en: "JS off, form still works" },
  },
  {
    id: "two-levels",
    label: { bn: "দুই লেভেলের আর্কিটেকচার", en: "The two-level architecture" },
  },
  {
    id: "how-it-works",
    label: { bn: "Server Action কীভাবে এটা দেয়", en: "How Server Actions enable it" },
  },
  {
    id: "traps",
    label: { bn: "তিনটা ট্র্যাপ", en: "Three traps" },
  },
  {
    id: "takeaway",
    label: { bn: "Production Takeaways", en: "Production takeaways" },
  },
];

export default function ProgressiveEnhancement() {
  return (
    <article className="doc-prose">
      {/* ── The magic ─────────────────────────────────────────────────── */}
      <H2 id="the-magic" anchorOnly>
        JS অফ, তবু ফর্ম কাজ করছে
      </H2>

      <p>
        রাতের দিকে ভুলু ভাই ব্রাউজারের DevTools খুলে হঠাৎ JavaScript একদম ডিজেবল করে
        দিলেন! তারপর তাঁর বানানো একটা ফর্মে ডাটা টাইপ করে সাবমিট বাটন চাপলেন। কিছু মুহূর্ত
        চুপ থেকে তিনি চিৎকার দিয়ে উঠলেন!
      </p>

      <Line name="ভুলু ভাই">
        নেক্সট-ভাই! ম্যাজিক! পুরো ম্যাজিক! আমি ব্রাউজারের সম্পূর্ণ JavaScript অফ করে
        রেখেছি, অথচ আমার ফর্মে ডাটা লিখে সাবমিট মারতেই পেজ রিফ্রেশ হয়ে সার্ভার অ্যাকশন
        এক্সিকিউট হলো এবং ডাটাবেজে ডাটা সেভ হয়ে গেল! আগের দিনের নেটিভ HTML ফর্মের মতো পুরো
        পেজ সাবমিট হয়ে রেজাল্ট চলে আসলো! React বা ক্লায়েন্ট বান্ডেল লোড না হলেও আমার
        ব্যাকএন্ড কাজ করছে কীভাবে ভাই?!
      </Line>

      <Line name="নেক্সট-ভাই">
        (হেসে কফিতে চুমুক দিয়ে) হা হা! ভুলু, তুই তো মডার্ন ওয়েব ডেভেলপমেন্টের অন্যতম
        প্রাচীন কিন্তু শক্তিশালী আর্কিটেকচার — <strong>Progressive Enhancement</strong>-এর
        আসল ক্ষমতা দেখে ফেলেছিস!
      </Line>

      {/* ── Two levels ────────────────────────────────────────────────── */}
      <H2 id="two-levels">১. দুই লেভেলের আর্কিটেকচার</H2>

      <Line name="ভুলু ভাই">
        (কৌতূহলী হয়ে) প্রোগ্রেসিভ এনহ্যান্সমেন্ট কনসেপ্টটা আসলে কী ভাই?
      </Line>

      <Line name="নেক্সট-ভাই">কনসেপ্টটা খুব সিম্পল:</Line>

      <ul>
        <li>
          <strong>Baseline Level (No-JS / HTML Fallback):</strong> তোর অ্যাপ্লিকেশন যেন
          একদম বেসিক HTML আর HTTP POST পেজ-রিলোড দিয়ে ১০০% কাজ সম্পন্ন করতে পারে — দুর্বল
          নেটওয়ার্ক, স্লো মোবাইল ডিভাইস, বা অ্যাড-ব্লকারে JS ব্লক থাকলেও অ্যাপ কখনো
          ব্রোকেন হবে না!
        </li>
        <li>
          <strong>Enhanced Level (JS Hydrated):</strong> ক্লায়েন্টে JavaScript বান্ডেল
          সাকসেসফুলি লোড হলে (hydration complete) ওই একই ফর্ম আর পেজ রিলোড না করে
          ব্যাকগ্রাউন্ডে fetch আর React transitions দিয়ে SPA-এর মতো স্মুথলি ইন্টারঅ্যাক্ট
          করবে!
        </li>
      </ul>

      <Diagram>{`               [User Submits Form]
                        │
         ┌──────────────┴──────────────┐
         ▼                             ▼
[JS Available / Hydrated]     [JS Disabled / Slow Network]
         │                             │
         ▼                             ▼
Background fetch, no reload    Native HTML HTTP POST request
      (Enhanced)                  Full page reload (Baseline)
         │                             │
         └──────────────┬──────────────┘
                        ▼
            [Executes the SAME Server Action!]`}</Diagram>

      {/* ── How it works ──────────────────────────────────────────────── */}
      <H2 id="how-it-works">২. Server Action কীভাবে এটা দেয়</H2>

      <Line name="নেক্সট-ভাই">
        Next.js-এর <code>&lt;form action={`{serverAction}`}&gt;</code> নেটিভ HTML ফর্ম
        ট্রানজেকশন ফলো করে কাজ করে। তুই যখন কোনো অ্যাকশন ফর্মের <code>action</code>{" "}
        অ্যাট্রিবিউটে পাস করিস, Next.js প্রি-রেন্ডারিংয়ের সময় ওই ফর্মের ভেতরে একটা হিডেন
        ইনপুট ফিল্ড আর ইউনিক অ্যাকশন ইউআরএল জেনারেট করে রেখে দেয়। ফলে ব্রাউজারে JavaScript
        না থাকলেও ব্রাউজার নেটিভভাবে সেই ফর্মের ডাটা দিয়ে সার্ভারে POST রিকোয়েস্ট মারতে
        পারে!
      </Line>

      {/* ── Traps ─────────────────────────────────────────────────────── */}
      <H2 id="traps">৩. তিনটা ট্র্যাপ</H2>

      <Line name="ভুলু ভাই">
        (একটু চিন্তা করে) দাঁড়াও নেক্সট-ভাই! যদি JavaScript না থাকে, তবে তো আমার
        ক্লায়েন্ট-সাইড ইভেন্ট, <code>useState</code>, বা <code>onClick</code> হুক কাজ
        করবে না! তখন প্রোগ্রেসিভ এনহ্যান্সমেন্ট কোন কোন জায়গায় ভেঙে যেতে পারে?
      </Line>

      <Line name="নেক্সট-ভাই">৩টা কমন ট্র্যাপ রয়েছে যাতে ডেভেলপাররা ভুল করে বসে।</Line>

      <p>
        <strong>Trap A — onClick দিয়ে সাবমিট করা।</strong> যদি তুই ফর্মের বদলে একটা সাধারণ{" "}
        <code>&lt;button onClick=…&gt;</code> দিস, তবে JS অফ থাকলে বা লোড হতে দেরি হলে ওই
        বাটনে ক্লিক মারলে কিচ্ছু হবে না!
      </p>

      <CodeBlock filename="app/components/DeleteButton.tsx">{`// ❌ FAILS without JavaScript!
<button onClick={() => deleteItem(id)}>Delete</button>

// ✅ WORKS with or without JavaScript!
<form action={deleteItem.bind(null, id)}>
  <button type="submit">Delete</button>
</form>`}</CodeBlock>

      <p>
        <strong>Trap B — শুধু useActionState-এর ওপর নির্ভর করা।</strong>{" "}
        <code>useActionState</code> হুকটা React ক্লায়েন্ট হাইড্রেশনের ওপর নির্ভরশীল। তাই
        JavaScript ব্লকড থাকলে হুক থেকে আসা এরর মেসেজ ইউআই-তে রেন্ডার হবে না। সমাধান:
        গুরুত্বপূর্ণ রিডাইরেক্ট বা সাকসেস ফ্লো-র জন্য সার্ভার অ্যাকশনের ভেতরেই{" "}
        <code>redirect()</code> বা <code>revalidatePath()</code> ডেকে দেওয়া, যা No-JS
        মোডেও ক্লায়েন্টকে ফ্রেশ পেজে নিয়ে যায়!
      </p>

      <CodeBlock filename="app/actions.ts">{`'use server'

import { redirect } from 'next/navigation';
import { revalidatePath } from 'next/cache';

export async function createPost(formData: FormData) {
  const title = formData.get('title') as string;

  await db.post.create({ data: { title } });

  revalidatePath('/posts');

  // ⚡ Handles both no-JS navigation and JS-enhanced navigation gracefully!
  redirect('/posts');
}`}</CodeBlock>

      <p>
        <strong>Trap C — কাস্টম JSON পেলোড বনাম নেটিভ FormData।</strong> যদি তুই সার্ভার
        অ্যাকশনে প্লেইন অবজেক্ট <code>{`{ title: 'hello' }`}</code> পাঠাস, তবে তা কাজ
        করার জন্য JS লাগবে। কিন্তু নেটিভ <code>FormData</code> আর্গুমেন্ট রিসিভ করলে তা
        No-JS আর JS — দুই এনভায়রনমেন্টেই পারফেক্ট কাজ করবে!
      </p>

      <Note>
        <p>
          ভ্যালিডেশন এররও তাই দুই জায়গায় দেখাতে হয়: hydrated অবস্থায় হুকের স্টেট থেকে, আর
          no-JS অবস্থায় সার্ভার-রেন্ডার করা পেজে (redirect-এ query param বা সার্ভারে রাখা
          স্টেট থেকে)। শুধু ক্লায়েন্ট স্টেটে এরর দেখালে baseline লেভেলে ইউজার বুঝবেই না কী
          ভুল হয়েছে।
        </p>
      </Note>

      <Line name="ভুলু ভাই">(খাতায় চার্ট এঁকে) আহা! এবার কনসেপ্ট একদম ক্লিয়ার!</Line>

      <ul>
        <li>
          <code>&lt;form action={`{serverAction}`}&gt;</code> প্যাটার্ন ফলো করলে অ্যাপ হবে
          resilient আর accessible।
        </li>
        <li>
          JavaScript লোড না হওয়া পর্যন্ত সাইট ভাঙবে না, নেটিভ HTML ফর্ম সাবমিট দিয়ে বেসিক
          ব্যাকএন্ড চলতে থাকবে।
        </li>
        <li>
          আর JavaScript লোড হওয়া মাত্রই React পেজ রিলোড বন্ধ করে ব্যাকগ্রাউন্ডে রিকোয়েস্ট
          হ্যান্ডেল করবে!
        </li>
      </ul>

      <Line name="নেক্সট-ভাই">
        একদম বিঙ্গো! প্রোডাকশন গ্রেড আর্কিটেকচারে অ্যাপ্লিকেশনের কোর ক্রুশিয়াল ফিচারগুলো —
        লগইন, সাইনআপ, পেমেন্ট ফর্ম, ডাটা সাবমিট — সবসময় প্রোগ্রেসিভ এনহ্যান্সমেন্ট মাথায়
        রেখে ডিজাইন করা উচিত!
      </Line>

      {/* ── Takeaway ──────────────────────────────────────────────────── */}
      <H2 id="takeaway">💡 Production Engineering Takeaways</H2>

      <ul>
        <li>
          <strong>Baseline Accessibility:</strong> <code>&lt;form action&gt;</code> ব্যবহার
          করলে JavaScript বান্ডেল ক্র্যাশ করলেও বা নেটওয়ার্ক স্লো হলেও ব্যবহারকারী ফর্ম
          সাবমিট করতে পারে।
        </li>
        <li>
          <strong>Native FormData Standard:</strong> সার্ভার অ্যাকশনে সরাসরি{" "}
          <code>FormData</code> অবজেক্ট রিসিভ করা প্রোগ্রেসিভ এনহ্যান্সমেন্ট বজায় রাখার
          অন্যতম পূর্বশর্ত।
        </li>
        <li>
          <strong>Server-side Navigation:</strong> <code>redirect()</code> আর{" "}
          <code>revalidatePath()</code> অ্যাকশনের ভেতরে ব্যবহার করলে তা no-JS আর
          JS-enhanced — দুই এনভায়রনমেন্টেই রাউটিং সিঙ্ক রাখে।
        </li>
      </ul>
    </article>
  );
}
