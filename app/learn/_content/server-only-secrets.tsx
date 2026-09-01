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
      bn: "সার্ভার হেল্পার ক্লায়েন্ট বান্ডেলে",
      en: "A server helper in the client bundle",
    },
  },
  {
    id: "architecture",
    label: {
      bn: "Server-only মডিউল আইসোলেশন",
      en: "Server-only module isolation",
    },
  },
  {
    id: "mechanisms",
    label: { bn: "৩টি আর্কিটেকচারাল কনসেপ্ট", en: "Three architectural concepts" },
  },
  {
    id: "implementation",
    label: {
      bn: "Build-guard ও Server Action ব্রিজ",
      en: "The build guard & action bridge",
    },
  },
  {
    id: "matrix",
    label: { bn: "Server-Only Protection Matrix", en: "Server-only protection matrix" },
  },
  {
    id: "takeaway",
    label: { bn: "Production Takeaways", en: "Production takeaways" },
  },
];

export default function ServerOnlySecrets() {
  return (
    <article className="doc-prose">
      {/* ── The problem ───────────────────────────────────────────────── */}
      <H2 id="the-problem" anchorOnly>
        সার্ভার হেল্পার ক্লায়েন্ট বান্ডেলে
      </H2>

      <p>
        রাত ৭:০০। ভুলু ভাই একটি সার্ভার-সাইড ইউটিলিটি ফাইল তৈরি করেছিলেন — <code>lib/vault.ts</code>,
        যেখানে ডাটাবেজ কোয়েরি ও সার্ভার-সাইড সিক্রেট API কী প্রসেস করার কিছু হেল্পার ফাংশন ছিল। কিন্তু
        পরে ভুলে একটি ক্লায়েন্ট কম্পোনেন্টে (<code>&apos;use client&apos;</code>) সেই হেল্পার ইমপোর্ট
        করে ব্যবহার করে ফেলেছেন! ফলে কোনো ওয়ার্নিং ছাড়াই সার্ভারের গোপন লজিকের কিছু অংশ ক্লায়েন্ট-সাইড
        জাভাস্ক্রিপ্ট বান্ডেলে ঢুকে পড়েছে।
      </p>

      <Line name="ভুলু ভাই">
        ফাহিম! আমি তো কোনো <code>NEXT_PUBLIC_</code> ভেরিয়েবল ডিক্লেয়ার করিনি! তাও সার্ভার লজিকের
        ফাইল ক্লায়েন্ট কম্পোনেন্টে ইমপোর্ট করায় সেটা ব্রাউজার বান্ডেলে চলে গেল কীভাবে? কোনো উপায় নেই
        যেন ভুলেও কোনো সার্ভার ফাইল ক্লায়েন্ট-সাইড কোডে ইমপোর্ট করা না যায়?
      </Line>

      <Line name="ফাহিম">
        ভুলু ভাই! App Router-এ কোনো ফাইলে নির্দিষ্টভাবে বলে দেওয়া না থাকলে যে এটা server-only, ক্লায়েন্ট
        কম্পোনেন্ট ভুলবশত তা ইমপোর্ট করলে বান্ডলার (Turbopack/Webpack) সেই কোডকে ব্রাউজারে চালানোর
        উপযোগী করার চেষ্টা করে! এতে সার্ভার সিক্রেট লিক হওয়ার মারাত্মক ঝুঁকি থাকে।
      </Line>

      <Line name="নেক্সট-ভাই">
        একদম! এই অনাকাঙ্ক্ষিত মডিউল লিক বন্ধ করতে Next.js আমাদের দেয় <code>server-only</code>{" "}
        build-guard মডিউল। যেকোনো সার্ভার-স্পেসিফিক সিক্রেট ফাইলের একদম উপরে{" "}
        <code>import &apos;server-only&apos;</code> লিখে দিলে, কেউ ভুলবশত ফাইলটিকে ক্লায়েন্ট
        কম্পোনেন্টে ইমপোর্ট করলে বিল্ড টাইমেই Next.js এরর ছুড়ে কম্পাইলেশন আটকে দেবে!
      </Line>

      {/* ── Architecture ──────────────────────────────────────────────── */}
      <H2 id="architecture">১. Server-Only Module Protection Pipeline</H2>

      <Diagram>{`┌─────────────────────────────────────────────────────────────────────────────┐
│                 SERVER-ONLY MODULE ISOLATION PIPELINE                       │
└─────────────────────────────────────────────────────────────────────────────┘

 Server file: lib/vault.ts  (with import 'server-only')
                         │
                         ▼
        ┌────────────────────────────────────┐
        │ Next.js bundler (build-time guard)  │
        └────────────────────────────────────┘
                         │
        ┌────────────────┴────────────────┐
        ▼                                 ▼
 Server Component / Action         Client Component ('use client')
 ├── imports lib/vault.ts          └── imports lib/vault.ts
 └── 🟢 build succeeds                 └── ❌ BUILD ERROR
                                           "This module cannot be imported
                                            from a Client Component."`}</Diagram>

      {/* ── Mechanisms ────────────────────────────────────────────────── */}
      <H2 id="mechanisms">২. কোর আর্কিটেকচারাল কনসেপ্ট</H2>

      <p>
        <strong>Explicit module boundaries:</strong> Next.js-এ কোড ডিফল্টভাবে সার্ভারে রান করলেও
        ইউটিলিটি বা হেল্পার ফাইলগুলো ক্লায়েন্ট ও সার্ভার — উভয় এনভায়রনমেন্টেই ইমপোর্টযোগ্য থাকে। তাই
        সিক্রেট-সমৃদ্ধ হেল্পার ফাইলগুলোকে স্পষ্টভাবে server-only হিসেবে লক করতে হয়।
      </p>

      <p>
        <strong>The server-only package guard:</strong> React/Next.js ইকোসিস্টেমের অফিশিয়াল প্যাকেজ{" "}
        <code>server-only</code> ইমপোর্ট করা থাকলে বান্ডলার অ্যানালাইসিস করে নিশ্চিত করে যে মডিউলটি
        কখনো কোনো ক্লায়েন্ট গ্রাফে না যায়।
      </p>

      <p>
        <strong>Client-server bridge via Server Actions:</strong> ক্লায়েন্ট কম্পোনেন্ট সার্ভারের
        সিক্রেট ডাটা পেতে চাইলে সরাসরি সিক্রেট ফাইল ইমপোর্ট করতে পারবে না — তাকে একটি Server Action বা
        route handler-এর মাধ্যমে নিরাপদ, ফিল্টার করা ডাটা রিকোয়েস্ট করতে হবে।
      </p>

      {/* ── Implementation ────────────────────────────────────────────── */}
      <H2 id="implementation">৩. Production Code Implementation</H2>

      <H3>❌ Anti-pattern — an unprotected server module imported in a client</H3>

      <CodeBlock filename="lib/payment-vault.ts">{`// 🔴 POOR PRACTICE: an unprotected server module, no boundary guard

export async function fetchPrivateUserVault(userId: string) {
  // secret API key, only present in the Node.js runtime
  const secretKey = process.env.PAYMENT_VAULT_SECRET;

  const res = await fetch(\`https://api.vault.com/users/\${userId}\`, {
    headers: { Authorization: \`Bearer \${secretKey}\` },
  });
  return res.json();
}`}</CodeBlock>

      <CodeBlock filename="app/checkout/PaymentButton.tsx">{`// 🔴 POOR PRACTICE
'use client';

// ❌ importing an unprotected server module into a Client Component
// the bundler will try to ship this code to the browser
import { fetchPrivateUserVault } from '@/lib/payment-vault';

export default function PaymentButton({ userId }: { userId: string }) {
  const handlePay = async () => {
    // ❌ fails at runtime, or leaks server logic into the client bundle
    const vault = await fetchPrivateUserVault(userId);
    console.log(vault);
  };

  return <button onClick={handlePay}>Process payment</button>;
}`}</CodeBlock>

      <H3>🟢 Production pattern — build-time guarded server secrets</H3>

      <p>
        <strong>Step 1 — প্যাকেজ ইনস্টল।</strong>
      </p>

      <CodeBlock filename="terminal">{`npm install server-only`}</CodeBlock>

      <p>
        <strong>Step 2 — প্রোটেক্টেড সার্ভার মডিউল।</strong>
      </p>

      <CodeBlock filename="lib/payment-vault.ts">{`// 🟢 PRODUCTION PATTERN: enforced server-only isolation
import 'server-only'; // 🟢 build-time guard against Client Component imports
import { env } from '@/env';

export interface UserVaultData {
  vaultId: string;
  balance: number;
}

export async function fetchPrivateUserVault(userId: string): Promise<UserVaultData> {
  const secretKey = env.STRIPE_SECRET_KEY; // validated at boot

  const res = await fetch(\`https://api.vault.com/users/\${userId}\`, {
    headers: {
      Authorization: \`Bearer \${secretKey}\`,
      'Content-Type': 'application/json',
    },
    cache: 'no-store',
  });

  if (!res.ok) throw new Error('Failed to fetch vault data');

  return res.json();
}`}</CodeBlock>

      <p>
        <strong>Step 3 — Server Action হিসেবে নিরাপদ ব্রিজ।</strong>
      </p>

      <CodeBlock filename="actions/vault-actions.ts">{`// 🟢 PRODUCTION PATTERN: a Server Action as the secure bridge
'use server';

import { fetchPrivateUserVault } from '@/lib/payment-vault';

export async function getSafeVaultBalanceAction(userId: string) {
  // 🟢 runs exclusively on the server
  const fullVaultData = await fetchPrivateUserVault(userId);

  // return only the view-model field, never the raw API payload
  return { balance: fullVaultData.balance };
}`}</CodeBlock>

      <p>
        <strong>Step 4 — ক্লায়েন্ট কম্পোনেন্টে ব্যবহার।</strong>
      </p>

      <CodeBlock filename="app/checkout/PaymentButton.tsx">{`// 🟢 PRODUCTION PATTERN: a client component that calls the action, not the secret
'use client';

import { useState } from 'react';
import { getSafeVaultBalanceAction } from '@/actions/vault-actions';

export default function PaymentButton({ userId }: { userId: string }) {
  const [balance, setBalance] = useState<number | null>(null);

  const handleFetchBalance = async () => {
    // 🟢 crosses the boundary through the action — no server module in this bundle
    const data = await getSafeVaultBalanceAction(userId);
    setBalance(data.balance);
  };

  return (
    <div>
      {balance !== null && <p>Balance: {balance}</p>}
      <button onClick={handleFetchBalance}>Check vault balance</button>
    </div>
  );
}`}</CodeBlock>

      {/* ── Matrix ────────────────────────────────────────────────────── */}
      <H2 id="matrix">৪. Server-Only Protection Feature Matrix</H2>

      <Table
        head={[
          "স্ট্র্যাটেজি",
          "বিল্ড-টাইম গার্ড?",
          "ক্লায়েন্ট বান্ডেলে ফাইল যায়?",
          "সিক্রেট চুরির ঝুঁকি",
        ]}
        rows={[
          [
            "Unprotected utility (lib/*.ts)",
            "না — নীরবে ইমপোর্ট হতে দেয় 🔴",
            "ইমপোর্ট করলেই চলে যায় 🔴",
            "উচ্চ 🔴",
          ],
          [
            "import 'server-only' guard",
            "হ্যাঁ — ইমিডিয়েট বিল্ড এরর 🟢",
            "সম্পূর্ণ ব্লকড 🟢",
            "শূন্য 🟢",
          ],
          [
            "Server Action wrapper",
            "হ্যাঁ — স্পষ্ট API বাউন্ডারি 🟢",
            "শুধু অ্যাকশন ট্রিগার অংশ থাকে 🟢",
            "শূন্য 🟢",
          ],
        ]}
      />

      <Line name="ভুলু ভাই">
        দুর্দান্ত সমাধান ফাহিম! <code>import &apos;server-only&apos;</code> যোগ করার পর টেস্ট করতে গিয়ে
        ভুল করে ক্লায়েন্ট কম্পোনেন্টে ইমপোর্ট করতেই টার্মিনালে লাল অক্ষরের বিল্ড এরর চলে আসছে! এখন আর
        কেউ ভুলেও সার্ভার ফাইল ক্লায়েন্টে পুশ করতে পারবে না।
      </Line>

      {/* ── Takeaways ─────────────────────────────────────────────────── */}
      <H2 id="takeaway">Production Takeaways</H2>

      <Note>
        <ul>
          <li>
            <strong>Guard internal SDKs and utilities:</strong> ডাটাবেজ কানেকশন, প্রাইভেট API ক্লায়েন্ট
            (<code>stripe</code>, <code>firebase-admin</code>, <code>pg</code>) বা এনক্রিপশন হেল্পার
            ফাইলের শুরুতে সবসময় <code>import &apos;server-only&apos;</code> ব্যবহার করুন।
          </li>
          <li>
            <strong>Fail fast at build time:</strong> কোনো ডেভেলপার ভুলবশত সার্ভার হেল্পার ক্লায়েন্টে
            ইমপোর্ট করলে রানটাইমে এরর পাওয়ার আগেই যেন CI বিল্ড ফেল করে — এই প্যাকেজ সেটাই নিশ্চিত করে।
          </li>
          <li>
            <strong>Use Server Actions as bridges:</strong> ক্লায়েন্ট থেকে সার্ভার লজিক চালাতে হলে
            সরাসরি ইমপোর্ট না করে Server Action বা route handler দিয়ে কল করুন, এবং শুধু প্রয়োজনীয়
            ফিল্ডটুকু রিটার্ন করুন।
          </li>
        </ul>
      </Note>
    </article>
  );
}
