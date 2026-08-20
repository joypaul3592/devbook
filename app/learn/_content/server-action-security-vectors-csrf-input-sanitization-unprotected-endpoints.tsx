import { CodeBlock, H2, Line, Note } from "@/components/learn/DocParts";
import type { Bi } from "@/lib/curriculum";

/** Section anchors — consumed by the "on this page" rail. */
export const headings: { id: string; label: Bi }[] = [
  {
    id: "the-realization",
    label: { bn: "Postman দিয়েই হিট করা যায়", en: "Anyone can hit it with Postman" },
  },
  {
    id: "unprotected",
    label: { bn: "১. আনপ্রোটেক্টেড এন্ডপয়েন্ট", en: "1. Unprotected endpoints" },
  },
  {
    id: "csrf",
    label: { bn: "২. Origin ও CSRF প্রোটেকশন", en: "2. Origin and CSRF protection" },
  },
  {
    id: "sanitization",
    label: { bn: "৩. ইনপুট স্যানিটাইজেশন", en: "3. Input sanitization" },
  },
  {
    id: "four-guards",
    label: { bn: "চারটা গার্ড", en: "The four guards" },
  },
  {
    id: "takeaway",
    label: { bn: "Production Takeaways", en: "Production takeaways" },
  },
];

export default function ServerActionSecurity() {
  return (
    <article className="doc-prose">
      {/* ── The realization ───────────────────────────────────────────── */}
      <H2 id="the-realization" anchorOnly>
        Postman দিয়েই হিট করা যায়
      </H2>

      <p>
        পরদিন দুপুর। ভুলু ভাই ল্যাপটপে কফি ছিটকে ফেলে প্রায় লাফিয়ে উঠলেন! DevTools-এর
        Network ট্যাবে একটা Server Action রিকোয়েস্টের{" "}
        <code>POST /_next/action-id</code> পেলোড দেখে তাঁর চোখ চড়কগাছ!
      </p>

      <Line name="ভুলু ভাই">
        নেক্সট-ভাই! এ তো চরম বিপদের কথা! আপনি কালকে বললেন না যে{" "}
        <code>&quot;use server&quot;</code> মানে ব্যাকগ্রাউন্ডে একটা পাবলিক HTTP POST API
        এন্ডপয়েন্ট তৈরি হওয়া?! আমি তো ভেবেছিলাম এগুলা বুঝি Next.js-এর ভেতরের গোপন ব্ল্যাক
        ম্যাজিক, বাইরের কেউ টের পাবে না! কিন্তু Postman বা cURL দিয়ে তো যে কেউ এই
        এন্ডপয়েন্টে হিট মেরে আমার ডাটাবেজে ভুয়া ডাটা ঢুকিয়ে দিতে পারে! আমার ব্যাকএন্ডের
        সিকিউরিটি কী হবে ভাই?!
      </Line>

      <Line name="নেক্সট-ভাই">
        (কফির কাপে চুমুক দিয়ে হেসেই ফেললেন) হা হা! ভুলু, তুই তো সার্ভার অ্যাকশনের সবচেয়ে
        ভয়ংকর সিকিউরিটি থ্রেটগুলো ধরে ফেলেছিস! অনেকেই মনে করে Server Action যেহেতু দেখতে
        সাধারণ JavaScript ফাংশনের মতো, তাই এতে আর আলাদা সিকিউরিটি লাগে না। এটা মারাত্মক
        ভুল ধারণা! প্রতিটা Server Action মূলত একটা প্রকাশ্যে ঝুলতে থাকা{" "}
        <strong>Public Unprotected Endpoint</strong>!
      </Line>

      {/* ── Unprotected ───────────────────────────────────────────────── */}
      <H2 id="unprotected">১. আনপ্রোটেক্টেড এন্ডপয়েন্ট (Missing Authorization)</H2>

      <Line name="নেক্সট-ভাই">
        ধর তোর একটা Server Action আছে <code>deleteProduct(id)</code>। তুই মনে করলি পেজে
        যেহেতু <code>isAdmin</code> চেক করা আছে, তাই সাধারণ ইউজার তো আর ডিলিট বাটন
        দেখতেই পাবে না! কিন্তু হ্যাকার কি পেজের বাটন দিয়ে হিট মারে?! সে সরাসরি তোর Server
        Action-এর Action ID খুঁজে বের করে Postman দিয়ে হিট মারবে! তুই যদি অ্যাকশনের ভেতরে
        অথরাইজেশন চেক না করিস, যেকোনো সাধারণ ইউজার অ্যাডমিন ডাটা ডিলিট করে দিতে পারবে!
      </Line>

      <CodeBlock filename="app/actions.ts">{`// ❌ DANGEROUS: Missing action-level authorization!
'use server'

export async function deleteProduct(productId: string) {
  // 🚨 No session or role check! Anyone who finds this Action ID
  // can delete products via a plain HTTP POST!
  await db.product.delete({ where: { id: productId } });
}

// ✅ SECURE: Strict session & role guard inside the action
export async function deleteProduct(productId: string) {
  const session = await auth();

  // ⚡ Explicit authorization guard inside the Server Action boundary
  if (!session || session.user.role !== 'ADMIN') {
    throw new Error('Unauthorized: You do not have permission to delete this product.');
  }

  await db.product.delete({ where: { id: productId } });
}`}</CodeBlock>

      <Note>
        <p>
          UI-তে বাটন না দেখানো একটা UX সিদ্ধান্ত, সিকিউরিটি কন্ট্রোল নয়। অ্যাকশনের ভেতরের
          গার্ডটাই একমাত্র জায়গা যেটা আক্রমণকারী এড়াতে পারে না।
        </p>
      </Note>

      {/* ── CSRF ──────────────────────────────────────────────────────── */}
      <H2 id="csrf">২. Origin ও CSRF প্রোটেকশন</H2>

      <Line name="ভুলু ভাই">
        (চিন্তিত হয়ে) ভাই! অন্য কোনো ক্ষতিকারক ওয়েবসাইট (যেমন{" "}
        <code>evil-site.com</code>) থেকে যদি ইউজারের অজান্তে ব্যাকগ্রাউন্ডে আমার এই Server
        Action-এ CSRF (Cross-Site Request Forgery) অ্যাটাক করে?
      </Line>

      <Line name="নেক্সট-ভাই">
        দারুণ পয়েন্ট! Next.js এখানে ডিফল্ট একটা সিকিউরিটি লেয়ার দেয়। Server Action যখন
        সাবমিট হয়, Next.js অটোমেটিক্যালি রিকোয়েস্টের <code>Origin</code> হেডার চেক করে
        দেখে যে সেটা তোর নিজের ডোমেইন থেকে এসেছে নাকি বাইরের ডোমেইন থেকে!
      </Line>

      <Line name="নেক্সট-ভাই">
        তবে সমস্যা বাঁধবে যদি তুই প্রক্সি, Nginx, বা কাস্টম রিভার্স প্রক্সির পেছনে ডিপ্লয়
        করিস আর <code>Host</code> বা <code>X-Forwarded-Host</code> হেডার মিসম্যাচ হয়। তখন
        বৈধ রিকোয়েস্টও ব্লক হতে পারে। এজন্য <code>next.config.js</code>-এ প্রপার allowed
        origins ডিফাইন করে দিতে হয়:
      </Line>

      <CodeBlock filename="next.config.js">{`module.exports = {
  experimental: {
    serverActions: {
      // ⚡ Only trust requests originating from these domains
      allowedOrigins: ['my-app.com', 'admin.my-app.com'],
    },
  },
};`}</CodeBlock>

      {/* ── Sanitization ──────────────────────────────────────────────── */}
      <H2 id="sanitization">৩. ইনপুট স্যানিটাইজেশন ও Over-Posting</H2>

      <Line name="ভুলু ভাই">
        নেক্সট-ভাই! আমরা যখন সরাসরি <code>formData</code> বা অবজেক্ট আর্গুমেন্ট হিসেবে
        রিসিভ করি, তখন যদি ইউজার ম্যালিশিয়াস পেলোড ঢুকিয়ে দেয়?
      </Line>

      <Line name="নেক্সট-ভাই">
        সেজন্যই কোনো অবস্থাতেই ক্লায়েন্ট থেকে আসা ডাটাকে অন্ধের মতো ডাটাবেজে পাঠানো যাবে
        না! ক্লায়েন্টের পাঠানো সব ডাটা <strong>Untrusted Input</strong>! তোকে সবসময়
        অ্যাকশনের ভেতরে strict schema validation (Zod) ব্যবহার করে ডাটা স্যানিটাইজ করতে
        হবে:
      </Line>

      <CodeBlock filename="app/actions.ts">{`'use server'

import { z } from 'zod';

// ⚡ 1. Define a strict input schema
const UpdateProfileSchema = z.object({
  username: z.string().min(3).max(20).regex(/^[a-zA-Z0-9_]+$/), // No HTML/script tags!
  age: z.number().min(18).max(100),
});

export async function updateProfile(unsafeData: unknown) {
  // ⚡ 2. Verify session
  const session = await auth();
  if (!session) throw new Error('Unauthorized');

  // ⚡ 3. Parse & sanitize input (throws on a malicious payload)
  const validatedData = UpdateProfileSchema.parse(unsafeData);

  // ⚡ 4. Safe mutation using validated input only
  await db.user.update({
    where: { id: session.user.id },
    data: validatedData,
  });
}`}</CodeBlock>

      <Note>
        <p>
          খেয়াল কর, আপডেটে <code>session.user.id</code> ব্যবহার হচ্ছে — ক্লায়েন্টের পাঠানো
          কোনো <code>userId</code> নয়। ক্লায়েন্ট থেকে আসা আইডি দিয়ে{" "}
          <code>where</code> ক্লজ বানানো মানেই যে কেউ অন্যের রেকর্ড এডিট করতে পারবে।
        </p>
      </Note>

      {/* ── Four guards ───────────────────────────────────────────────── */}
      <H2 id="four-guards">৪. চারটা গার্ড</H2>

      <Line name="ভুলু ভাই">
        (ল্যাপটপে হাত দিয়ে) ওরে বাপ্পরে! তারমানে Server Action লেখার সাথে সাথেই ৪টা
        সিকিউরিটি গার্ড মাথার ভেতর সেট করে ফেলতে হবে:
      </Line>

      <ul>
        <li>
          <strong>Authentication Check:</strong> <code>auth()</code> দিয়ে ইউজার লগইনড কিনা
          যাচাই করা।
        </li>
        <li>
          <strong>Authorization Guard:</strong> ইউজার ওই নির্দিষ্ট ডাটা এডিট করার পারমিশন
          (Role/Ownership) রাখে কিনা চেক করা।
        </li>
        <li>
          <strong>Input Sanitization:</strong> Zod দিয়ে ইনপুট ট্রিম ও কাস্ট করে ক্ষতিকারক
          পেলোড আটকানো।
        </li>
        <li>
          <strong>Allowed Origins Configuration:</strong> কাস্টম ডোমেইনে Origin হেডার
          মিসম্যাচ থেকে CSRF প্রোটেকশন নিশ্চিত করা।
        </li>
      </ul>

      <Line name="নেক্সট-ভাই">
        একদম পারফেক্ট! এই ৪টা লেয়ার যার অ্যাকশনে থাকবে, তার Server Action হবে আয়রন
        ডোমের মতো সুরক্ষিত!
      </Line>

      {/* ── Takeaway ──────────────────────────────────────────────────── */}
      <H2 id="takeaway">💡 Production Engineering Takeaways</H2>

      <ul>
        <li>
          <strong>Zero Trust Policy:</strong> Server Action-কে সবসময় পাবলিকলি এক্সপোজড
          এপিআই এন্ডপয়েন্ট মনে করতে হবে; কখনো ক্লায়েন্ট-সাইড ফিল্টারিংয়ের ওপর ভরসা করা
          যাবে না।
        </li>
        <li>
          <strong>Action-Level Auth Guard:</strong> পেজ লেভেলে অথরাইজেশন চেক থাকলেও প্রতিটা
          অ্যাকশনের ভেতরে আলাদাভাবে session validation ও role checking করতে হবে।
        </li>
        <li>
          <strong>Zod Sanitization:</strong> ক্লায়েন্ট থেকে আসা যেকোনো input data-কে Zod বা
          অনুরূপ ভ্যালিডেটর দিয়ে স্যানিটাইজ না করে ডাটাবেজে পাঠানো যাবে না।
        </li>
      </ul>
    </article>
  );
}
