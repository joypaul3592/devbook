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
      bn: "এক বাগ, পাঁচ ফোল্ডার",
      en: "One bug, five folders",
    },
  },
  {
    id: "architecture",
    label: {
      bn: "Layered vs feature-based",
      en: "Layered vs feature-based",
    },
  },
  {
    id: "mechanisms",
    label: {
      bn: "৪টি আর্কিটেকচারাল কনসেপ্ট",
      en: "Four architectural concepts",
    },
  },
  {
    id: "implementation",
    label: {
      bn: "Feature module ও public API",
      en: "A feature module & its public API",
    },
  },
  {
    id: "matrix",
    label: { bn: "দুই কাঠামোর তুলনা", en: "The two structures compared" },
  },
  {
    id: "takeaway",
    label: { bn: "Production Takeaways", en: "Production takeaways" },
  },
];

export default function FeatureBasedArchitecture() {
  return (
    <article className="doc-prose">
      {/* ── The problem ───────────────────────────────────────────────── */}
      <H2 id="the-problem" anchorOnly>
        এক বাগ, পাঁচ ফোল্ডার
      </H2>

      <p>
        সকাল ১০:৩০। ভুলু ভাই হেডফোন খুলে বসে আছেন। তিনি &ldquo;Sports Match Live Odds&rdquo; ফিচারে
        একটি ছোট বাগ ঠিক করতে গিয়েছেন। কিন্তু ফাইল খুঁজতে গিয়ে তাকে{" "}
        <code>src/components/</code>, <code>src/hooks/</code>, <code>src/services/</code>,{" "}
        <code>src/types/</code> আর <code>src/utils/</code> — পাঁচটি আলাদা ফোল্ডারের দশটি ফাইল একসাথে
        খুলতে হয়েছে। আরও বিপদ: ফিচারটি ডিলিট করার সিদ্ধান্তের পর অর্ধেক ফাইল থেকে গেছে, কারণ কোনটা কোন
        ফিচারের তা চেনার উপায় নেই।
      </p>

      <Line name="ভুলু ভাই">
        ফাহিম! ফাইল খোঁজাখুঁজি করতেই অর্ধেকের বেশি কোডিং টাইম শেষ! অ্যাপ বড় হওয়ার সাথে সাথে{" "}
        <code>components</code>, <code>hooks</code>, <code>types</code> ফোল্ডারগুলো এত বিশাল হয়ে গেছে
        যে স্ট্রাকচার এখন পুরো মেস।
      </Line>

      <Line name="ফাহিম">
        ভুলু ভাই! আপনি <strong>layered architecture</strong> — অর্থাৎ ফাইলের <em>ধরন</em> দিয়ে
        ফোল্ডার ভাগ করার ট্র্যাপে পড়েছেন। ছোট অ্যাপে এটা চলে, কিন্তু এন্টারপ্রাইজ স্কেলে স্কেল করে না।
        সমাধান হলো feature-based architecture, বা co-location principle।
      </Line>

      <Line name="নেক্সট-ভাই">
        একদম! ফাইলের ধরন নয় — <strong>বিজনেস ফিচার</strong> অনুযায়ী গ্রুপ করাই ফিচার-বেজড
        আর্কিটেকচার। App Router-এ <code>app/</code> শুধু রাউটিং সামলাবে, আর সব বিজনেস লজিক থাকবে{" "}
        <code>src/features/</code>-এ।
      </Line>

      {/* ── Architecture ──────────────────────────────────────────────── */}
      <H2 id="architecture">১. Layered vs Feature-based</H2>

      <Diagram>{`┌─────────────────────────────────────────────────────────────────────────────┐
│                   LAYERED vs FEATURE-BASED ARCHITECTURE                     │
└─────────────────────────────────────────────────────────────────────────────┘

  ❌ LAYERED (by file type)               🟢 FEATURE-BASED (by domain)
  src/                                    src/
  ├── components/                         ├── features/
  │   ├── MatchCard.tsx                   │   ├── live-sports/
  │   └── PayoutModal.tsx                 │   │   ├── components/
  ├── hooks/                              │   │   │   └── MatchCard.tsx
  │   ├── useSports.ts                    │   │   ├── hooks/
  │   └── usePayout.ts                    │   │   │   └── useSports.ts
  ├── api/                                │   │   ├── api/
  │   ├── sportsApi.ts                    │   │   │   └── sportsApi.ts
  │   └── payoutApi.ts                    │   │   ├── types/
  └── types/                              │   │   │   └── index.ts
      ├── sports.ts                       │   │   └── index.ts  ◄─ public API barrier
      └── payout.ts                       │   └── payouts/
                                          └── app/  ◄─ routes and layouts only

  one feature = five folders              one feature = one folder`}</Diagram>

      {/* ── Mechanisms ────────────────────────────────────────────────── */}
      <H2 id="mechanisms">২. কোর আর্কিটেকচারাল কনসেপ্ট</H2>

      <p>
        <strong>Co-location principle:</strong> যে কোডগুলো একসাথে পরিবর্তন হয়, ফাইল সিস্টেমেও
        সেগুলোর একসাথে থাকা উচিত। একটি ফিচারের কম্পোনেন্ট, হুক, টাইপ, API কল আর টেস্ট এক ফোল্ডারে
        থাকলে নেভিগেশন ও রিফ্যাক্টরিং নাটকীয়ভাবে সহজ হয়।
      </p>

      <p>
        <strong>App Router-এর দায়িত্ব:</strong> <code>app/</code> ফোল্ডারের কাজ শুধু URL routing,
        layout, server component wrapper আর page assembly। বিজনেস লজিক সেখানে না রেখে{" "}
        <code>src/features/</code> থেকে ইমপোর্ট করা উচিত — <code>app/</code> হালকা থাকলে রাউট
        স্ট্রাকচার পড়েই অ্যাপের ম্যাপ বোঝা যায়।
      </p>

      <p>
        <strong>Public API barrier:</strong> প্রতিটি ফিচার ফোল্ডারের মূলে একটি{" "}
        <code>index.ts</code> থাকে, যা ঠিক করে দেয় বাইরের কোড এই ফিচারের কোন কোন জিনিস ব্যবহার করতে
        পারবে। ইন্টারনাল হেল্পার প্রাইভেটই থাকে — এটিই আসল বাউন্ডারি।
      </p>

      <p>
        <strong>Self-contained &amp; deletable:</strong> ফিচার বন্ধ হলে শুধু সেই ফোল্ডারটি ডিলিট
        করলেই হয়। কোথাও অনাথ কোড পড়ে থাকার ভয় নেই — একটি আর্কিটেকচার কতটা ভালো, তার সবচেয়ে সৎ
        পরীক্ষাই হলো &ldquo;মুছে ফেলা কতটা সহজ&rdquo;।
      </p>

      {/* ── Implementation ────────────────────────────────────────────── */}
      <H2 id="implementation">৩. Production Code Implementation</H2>

      <H3>❌ Anti-pattern — চার ডিরেক্টরির scavenger hunt</H3>

      <CodeBlock filename="src/components/PayoutCard.tsx">{`// 🔴 POOR PRACTICE: one feature scattered across four directory roots
import { usePayout } from '../hooks/usePayout';
import type { Payout } from '../types/payout';

export function PayoutCard({ id }: { id: string }) {
  const { data } = usePayout(id);

  // ❌ changing payout logic means hunting through components/, hooks/,
  //    api/ and types/ — and nothing tells you which files belong together
  return <div>{data?.amount}</div>;
}`}</CodeBlock>

      <H3>🟢 Production pattern — feature module enclosure</H3>

      <p>
        <strong>Step 1 — ফিচার মডিউলের কাঠামো।</strong>
      </p>

      <Diagram>{`src/features/payouts/
├── api/
│   └── getPayoutDetails.ts
├── components/
│   ├── PayoutCard.tsx
│   └── PayoutStatusBadge.tsx   ◄─ internal, never exported
├── hooks/
│   └── usePayout.ts
├── types/
│   └── index.ts
└── index.ts                    ◄─ the only public entry point`}</Diagram>

      <p>
        <strong>Step 2 — ফিচারের public API ঘোষণা।</strong>
      </p>

      <CodeBlock filename="src/features/payouts/index.ts">{`// 🟢 PRODUCTION PATTERN: an explicit public API barrier
// Export only what other features or pages genuinely need.

export { PayoutCard } from './components/PayoutCard';
export { usePayout } from './hooks/usePayout';
export type { PayoutRequest, PayoutStatus } from './types';

// PayoutStatusBadge and the api/ helpers stay private — they are free to
// change shape without breaking a single consumer outside this folder.`}</CodeBlock>

      <p>
        <strong>Step 3 — App Router শুধু assembly করে।</strong>
      </p>

      <CodeBlock filename="src/app/(dashboard)/payouts/page.tsx">{`// 🟢 PRODUCTION PATTERN: the page is a shell, not a home for logic
import { PayoutCard } from '@/features/payouts'; // 🟢 through the barrel, never deeper

export default function PayoutsPage() {
  return (
    <main className="container mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">Payout Dashboard</h1>
      <PayoutCard />
    </main>
  );
}`}</CodeBlock>

      <p>
        চাইলে এই নিয়মটি লিন্ট রুল দিয়েই জোরদার করা যায় — গভীরে ইমপোর্ট করা তখন আর মতামতের বিষয় থাকে
        না, বিল্ডই আটকে দেয়।
      </p>

      <CodeBlock filename="eslint.config.mjs">{`// 🟢 PRODUCTION PATTERN: make deep imports impossible to commit
export default [
  {
    rules: {
      'no-restricted-imports': ['error', {
        patterns: [{
          group: ['@/features/*/*'],
          message: 'Import a feature through its index.ts, not from inside it.',
        }],
      }],
    },
  },
];`}</CodeBlock>

      {/* ── Matrix ────────────────────────────────────────────────────── */}
      <H2 id="matrix">৪. Layered vs Feature-based Matrix</H2>

      <Table
        head={["ক্রাইটেরিয়া", "Layered (file-type)", "Feature-based"]}
        rows={[
          [
            "Cognitive load",
            "বেশি — এক ফিচারে বহু ফোল্ডার জাম্প 🔴",
            "কম — সব ফাইল এক জায়গায় 🟢",
          ],
          ["রিফ্যাক্টরিং", "জটিল ও ঝুঁকিপূর্ণ", "সহজ ও নিরাপদ 🟢"],
          [
            "ফিচার ডিলিট",
            "প্রায় অসম্ভব — অনাথ কোড রয়ে যায় 🔴",
            "একটি ফোল্ডার মুছলেই শেষ 🟢",
          ],
          [
            "Onboarding",
            "পুরো প্রজেক্ট না বুঝে কাজ করা কঠিন",
            "একটি ফিচার বুঝলেই কাজ শুরু 🟢",
          ],
          [
            "স্কেল সীমা",
            "ছোট টিম পর্যন্ত ঠিক আছে",
            "বড় টিমেও কাজ করে 🟢",
          ],
        ]}
      />

      <Line name="ভুলু ভাই">
        অসাধারণ ফাহিম! ফিচার-বেজড আর্কিটেকচারে গুছিয়ে ফেলতেই মেইনটেনেবিলিটি অনেক গুণ সহজ মনে হচ্ছে —
        এখন আর একটা ফাইলের জন্য দশটা ফোল্ডারে খুঁড়তে হবে না।
      </Line>

      {/* ── Takeaways ─────────────────────────────────────────────────── */}
      <H2 id="takeaway">Production Takeaways</H2>

      <Note>
        <ul>
          <li>
            <strong>Keep app/ light:</strong> <code>src/app/</code> শুধু রাউটিং ও পেজ assembly-র
            জন্য রাখুন; বিজনেস লজিক, স্টেট আর UI <code>src/features/</code>-এ সরান।
          </li>
          <li>
            <strong>Import through the barrel:</strong> কখনো{" "}
            <code>@/features/payouts/components/PayoutCard</code> লিখবেন না — সবসময়{" "}
            <code>@/features/payouts</code>। লিন্ট রুল দিয়ে এটি বাধ্যতামূলক করুন।
          </li>
          <li>
            <strong>Share only at the second use:</strong> কোনো কোড দুইটি সম্পূর্ণ ভিন্ন ফিচারে
            লাগলে তবেই <code>src/shared/</code>-এ সরান। অকালে shared বানানো মানে অকালে ভুল
            অ্যাবস্ট্রাকশন।
          </li>
        </ul>
      </Note>
    </article>
  );
}
