import { CodeBlock, Diagram, H2, Line, Note } from "@/components/learn/DocParts";
import type { Bi } from "@/lib/curriculum";

/** Section anchors — consumed by the "on this page" rail. */
export const headings: { id: string; label: Bi }[] = [
  {
    id: "the-problem",
    label: { bn: "সিকিউরিটি অডিটে রেড অ্যালার্ট", en: "Red alert in the audit" },
  },
  {
    id: "dependency-tree",
    label: { bn: "একটা হেলপার, পুরো ফাইল ফাঁস", en: "One helper, whole file leaked" },
  },
  {
    id: "server-only",
    label: { bn: "server-only ও client-only গার্ড", en: "The server-only guard" },
  },
  {
    id: "separation",
    label: { bn: "সিক্রেট আর ইউটিলিটি আলাদা", en: "Separating secrets from utilities" },
  },
  {
    id: "takeaway",
    label: { bn: "Production Takeaways", en: "Production takeaways" },
  },
];

export default function ServerOnlyEnforcement() {
  return (
    <article className="doc-prose">
      {/* ── The problem ───────────────────────────────────────────────── */}
      <H2 id="the-problem" anchorOnly>
        সিকিউরিটি অডিটে রেড অ্যালার্ট
      </H2>

      <p>
        দুপুর গড়িয়ে বিকেল। ভুলু ভাই চা হাতে হঠাৎ চিৎকার করে উঠলেন! হাত থেকে চায়ের
        কাপ পড়ে যাওয়ার উপক্রম।
      </p>

      <Line name="ভুলু ভাই">
        নেক্সট-ভাই! ক্লায়েন্ট আমাকে ফায়ার করে দেবে! আমার প্রজেক্টের সিকিউরিটি অডিট
        রিপোর্ট এসেছে, আর সেখানে রেড অ্যালার্ট দেখাচ্ছে!
      </Line>

      <Line name="নেক্সট-ভাই">
        (ঠান্ডা মাথায় চায়ে চুমুক দিয়ে) কী হয়েছে ভুলু? তোর ডাটাবেজ হ্যাক হয়েছে নাকি?
      </Line>

      <Line name="ভুলু ভাই">
        আরে না! কিন্তু অডিটররা দেখাচ্ছে আমার ব্রাউজারের জাভাস্ক্রিপ্ট বান্ডেল ডিপ
        ইন্সপেক্ট করে নাকি আমাদের প্রাইভেট Stripe Secret Key আর Database Connection
        String দুইটাই তারা বের করে ফেলেছে! আমি তো কোনো ফাইল পাবলিক করিনি ভাই, সব তো{" "}
        <code>lib/db.ts</code> আর <code>services/stripe.ts</code> ফোল্ডারে
        রেখেছিলাম! ব্রাউজার এগুলো কীভাবে পেল?!
      </Line>

      <Line name="নেক্সট-ভাই">
        (মাথা নেড়ে) ভুলু, তুই তোর অজান্তেই{" "}
        <strong>Server-to-Client Boundary Leakage</strong> করে বসে আছিস! তুই নিশ্চিত
        কোনো একটা ক্লায়েন্ট কম্পোনেন্টে বা হেলপার ফাইলে ওই সার্ভার সাইডের কোড ইমপোর্ট
        মেরে দিয়েছিস!
      </Line>

      {/* ── Dependency tree ───────────────────────────────────────────── */}
      <H2 id="dependency-tree">১. একটা হেলপার ইমপোর্ট, পুরো ফাইল ফাঁস</H2>

      <Line name="ভুলু ভাই">
        মানে?! আমি তো শুধু একটা <code>formatCurrency()</code> টাইপের হেলপার ফাংশন
        ইমপোর্ট করেছিলাম <code>services/stripe.ts</code> ফাইল থেকে! অতোটুকু ইমপোর্ট
        করায় কি পুরো প্রাইভেট কী-সহ ব্রাউজারে চলে যাবে নাকি?!
      </Line>

      <Line name="নেক্সট-ভাই">
        এক্সাক্টলি! তুই যখন কোনো ক্লায়েন্ট কম্পোনেন্টে (<code>&apos;use client&apos;</code>)
        কোনো ইউটিলিটি ফাইলের একটা ছোট অংশও ইমপোর্ট করিস, বান্ডলার (Webpack বা
        Turbopack) ধরে নেয় ওই পুরো ফাইল এবং তার ডিপেন্ডেন্সি চেইন (Dependency Tree)
        ক্লায়েন্ট বান্ডেলের অংশ!
      </Line>

      <Diagram>{`[lib/stripe.ts]  <--- Contains STRIPE_SECRET_KEY & formatCurrency()
       │
       ▼ (Imported formatCurrency inside 'use client')
[CheckoutButton.tsx] ('use client')
       │
       ▼ (Bundler pushes EVERYTHING to client JS!)
[Browser Bundle] 🚨 STRIPE_SECRET_KEY LEAKED IN JS SOURCE MAP!`}</Diagram>

      <Line name="ভুলু ভাই">
        (কপালে হাত দিয়ে) ওরে বাবা! বান্ডলার কি এতই সোজা হিসাব করে?! সে সিক্রেট কী
        আলাদা আর নরমাল ফাংশন আলাদা চিনতে পারে না?
      </Line>

      <Line name="নেক্সট-ভাই">
        Next.js বা React ইমপোর্ট করা সোর্স কোডের লজিক তো বুঝতে পারবে না ভাই! কিন্তু
        এই ভুল যেন প্রোডাকশনে কোনোদিন না হয়, তার জন্য Next.js ২টা শক্ত সিকিউরিটি
        বাউন্ডারি প্যাকেজ দিয়েছে: <code>server-only</code> আর{" "}
        <code>client-only</code>।
      </Line>

      {/* ── server-only ───────────────────────────────────────────────── */}
      <H2 id="server-only">২. server-only ও client-only গার্ড</H2>

      <Line name="ভুলু ভাই">
        এই প্যাকেজগুলোর কাজ কী? এরা কীভাবে সিকিউরিটি গার্ডের মতো পাহারা দেয়?
      </Line>

      <Line name="নেক্সট-ভাই">
        শোন! তুই যখন কোনো ফাইলে সার্ভার সাইডের কাজ করবি (যেমন ডাটাবেজ কোয়েরি, পেমেন্ট
        গেটওয়ে কী, সিক্রেট এপিআই), সেই ফাইলের একদম টপে তোকে লিখে দিতে হবে:
      </Line>

      <CodeBlock filename="lib/db.ts">{`// lib/db.ts বা services/stripe.ts
import 'server-only';

export const dbConnection = new Database(process.env.DB_PASSWORD);`}</CodeBlock>

      <Line name="নেক্সট-ভাই">
        এখন যদি ভুলু ভাই ভুলে বা না বুঝে এই <code>stripe.ts</code> বা{" "}
        <code>db.ts</code>-কে কোনো <code>&apos;use client&apos;</code> ফাইল বা
        ক্লায়েন্ট কম্পোনেন্টে ইমপোর্ট করে ফেলে, তাহলে কী হবে জানিস?
      </Line>

      <Line name="ভুলু ভাই">কী হবে?</Line>

      <Line name="নেক্সট-ভাই">
        তোকে প্রজেক্ট বিল্ডই হতে দেবে না! <strong>Build-time Error</strong> মেরে পুরো
        বিল্ড প্রসেস থামিয়ে দেবে এবং স্পষ্ট বলে দেবে —{" "}
        <em>
          &quot;You&apos;re importing a module that uses &apos;server-only&apos; in a
          Client Component!&quot;
        </em>{" "}
        কোড প্রোডাকশনে গিয়ে হ্যাক হওয়ার আগেই বিল্ড স্টেজে ধরা পড়ে যাবে!
      </Line>

      <CodeBlock filename="PayButton.tsx">{`// ❌ ক্লায়েন্ট কম্পোনেন্টে ভুলু ভাইয়ের ভুল ইমপোর্ট
'use client'
import { formatCurrency } from '@/lib/stripe'; // 💥 BUILD ERROR! "server-only" triggered!

export default function PayButton() {
  return <button>Pay Now</button>;
}`}</CodeBlock>

      <Line name="ভুলু ভাই">
        (চোখ বড় বড় করে) জোস তো! তারমানে <code>import &apos;server-only&apos;</code>{" "}
        বসানো থাকলে কোড ভুল করে ক্লায়েন্ট বান্ডেলে যাওয়ার কোনো চান্সই নাই!
      </Line>

      <Line name="নেক্সট-ভাই">
        কোনো চান্স নেই! একইভাবে যদি তোর কোনো ইউটিলিটি ফাইল থাকে যা শুধু ব্রাউজারের
        উইন্ডো অবজেক্ট বা ব্রাউজার প্রপার্টি (<code>window.localStorage</code> বা{" "}
        <code>document</code>) ব্যবহার করে, সেটার ওপরে মেরে দিবি{" "}
        <code>import &apos;client-only&apos;</code>। যাতে ব্যাকএন্ড সার্ভার
        রেন্ডারিংয়ের সময় সেটা কোনো এরর না খায়।
      </Line>

      {/* ── Separation ────────────────────────────────────────────────── */}
      <H2 id="separation">৩. সিক্রেট আর ইউটিলিটি আলাদা রাখা</H2>

      <Line name="ভুলু ভাই">
        বুঝেছি! কিন্তু নেক্সট-ভাই, আমার তো ওই <code>formatCurrency()</code> ফাংশনটা
        ক্লায়েন্ট আর সার্ভার দুই জায়গায়ই দরকার। তাহলে আমি কীভাবে আর্কিটেকচার সাজাবো?
      </Line>

      <Line name="নেক্সট-ভাই">
        সিক্রেট আর সাধারণ লজিককে এক পাত্রে রাখবি না!
      </Line>

      <ul>
        <li>
          <code>lib/server/stripe.ts</code> — এখানে সিক্রেট কী আর পেমেন্ট লজিক থাকবে,
          যার ওপরে থাকবে <code>import &apos;server-only&apos;</code>।
        </li>
        <li>
          <code>lib/utils/format.ts</code> — এখানে প্লেইন কারেন্সি ফরম্যাটিং লজিক
          থাকবে, যা সার্ভার-ক্লায়েন্ট দুই জায়গাতেই নিরাপদে ইমপোর্ট করা যাবে।
        </li>
      </ul>

      <Diagram>{`lib/
├── server/
│   └── stripe.ts      import 'server-only'  ← secrets, payment logic
│                                              never reaches the browser
└── utils/
    └── format.ts      formatCurrency()      ← pure, no secrets
                                               safe on both sides`}</Diagram>

      <Note>
        <p>
          সিক্রেট আর পিওর লজিক একই ফাইলে থাকলে বান্ডলারের পক্ষে দুটো আলাদা করার কোনো
          উপায় নেই — সে ফাইল ধরে হিসাব করে, ফাংশন ধরে নয়।
        </p>
        <p>তাই বাউন্ডারিটা ফাইল লেভেলেই আঁকতে হয়।</p>
      </Note>

      <Line name="ভুলু ভাই">
        ধন্য ভাই নেক্সট-ভাই! আমি এখনই প্রজেক্টের সব ডাটাবেজ আর থার্ড-পার্টি সার্ভিস
        ফাইলের মাথায় <code>import &apos;server-only&apos;</code> লাগিয়ে সিকিউরিটি
        বাউন্ডারি সিল মারছি!
      </Line>

      {/* ── Takeaway ──────────────────────────────────────────────────── */}
      <H2 id="takeaway">💡 Production Engineering Takeaways</H2>

      <ul>
        <li>
          <strong>Dependency Tree Pollution:</strong> ক্লায়েন্ট কম্পোনেন্টে সার্ভার
          ফাইলের যেকোনো সামান্য হেলপার ইমপোর্ট করলেও পুরো ফাইলের এনভায়রনমেন্ট
          ভেরিয়েবল ক্লায়েন্ট বান্ডেলে লিক হতে পারে।
        </li>
        <li>
          <strong>server-only Guard:</strong> সার্ভার সাইড লজিক এবং ডাটাবেজ মডিউলের
          শীর্ষে <code>import &apos;server-only&apos;</code> ব্যবহার করলে ক্লায়েন্টে
          ভুল ইমপোর্ট হওয়া মাত্র Build-time Error খাবে।
        </li>
        <li>
          <strong>Separation of Concerns:</strong> বিজনেস লজিক/সিক্রেট ফাইল এবং পিওর
          ইউটিলিটি ফাংশনগুলোকে আলাদা ডিরেক্টরি বা ফাইলে আইসোলেট করে রাখা প্রোডাকশন
          স্ট্যান্ডার্ড।
        </li>
      </ul>
    </article>
  );
}
