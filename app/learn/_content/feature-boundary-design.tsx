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
      bn: "একটা রিনেম, দুই ফিচার ধস",
      en: "One rename, two features down",
    },
  },
  {
    id: "architecture",
    label: {
      bn: "বাউন্ডারি ও নির্ভরতার নিয়ম",
      en: "Boundaries and dependency rules",
    },
  },
  {
    id: "mechanisms",
    label: {
      bn: "৩টি বাউন্ডারি রুল",
      en: "Three boundary rules",
    },
  },
  {
    id: "implementation",
    label: {
      bn: "Public barrier ও ESLint guard",
      en: "Public barriers & an ESLint guard",
    },
  },
  {
    id: "matrix",
    label: { bn: "Tight vs loose coupling", en: "Tight vs loose coupling" },
  },
  {
    id: "takeaway",
    label: { bn: "Production Takeaways", en: "Production takeaways" },
  },
];

export default function FeatureBoundaryDesign() {
  return (
    <article className="doc-prose">
      {/* ── The problem ───────────────────────────────────────────────── */}
      <H2 id="the-problem" anchorOnly>
        একটা রিনেম, দুই ফিচার ধস
      </H2>

      <p>
        বিকেল ৫:১০। &ldquo;Payouts&rdquo; ফিচারের একটি ফাইলের নাম বদলাতে গিয়ে দেখা গেল
        &ldquo;Sports Betting&rdquo; আর &ldquo;User Profile&rdquo; — দুটোই ভেঙে পড়েছে। এক ফিচারের
        ফাইল অন্য ফিচারে ইমপোর্ট করতে করতে ভুলু ভাই এমন স্প্যাগেটি বানিয়ে ফেলেছেন যে একটি ফিচারও আর
        স্বাধীন নেই।
      </p>

      <Line name="ভুলু ভাই">
        ফাহিম! আমি তো ফিচার-বেজড ফোল্ডার স্ট্রাকচারই বানিয়েছিলাম! কিন্তু এক ফিচারের কোড আরেকটায়
        ইমপোর্ট করতে করতে এখন স্পোর্টস ডিলিট করলে ইউজার প্রেফারেন্সও ডিলিট হয়ে যায়!
      </Line>

      <Line name="ফাহিম">
        ভুলু ভাই! ফোল্ডার আলাদা করলেই বাউন্ডারি তৈরি হয় না — ফোল্ডার শুধু একটা সাজেশন। আসল বাউন্ডারি
        তৈরি হয় যখন এক ফিচার অন্য ফিচারের ইন্টারনাল ফাইল ছুঁতেও পারে না, কেবল public API দিয়ে
        যোগাযোগ করে।
      </Line>

      <Line name="নেক্সট-ভাই">
        একদম! আর্কিটেকচারের ভাষায় একে বলে <strong>explicit interface boundaries</strong>। আর
        সবচেয়ে গুরুত্বপূর্ণ কথাটা হলো — যে নিয়ম লিন্টার দিয়ে জোরদার করা হয় না, সেটি নিয়ম নয়, শুধু
        একটি ইচ্ছা।
      </Line>

      {/* ── Architecture ──────────────────────────────────────────────── */}
      <H2 id="architecture">১. Feature Boundary &amp; Dependency Rules</H2>

      <Diagram>{`┌─────────────────────────────────────────────────────────────────────────────┐
│                    FEATURE BOUNDARY & DEPENDENCY RULES                      │
└─────────────────────────────────────────────────────────────────────────────┘

  ❌ leaking across the boundary:
  features/sports/components/MatchCard.tsx
    └─► import { calculatePayout } from '@/features/payouts/utils/calc'   🔴

  🟢 crossing through the public API:
  features/sports/components/MatchCard.tsx
    └─► import { usePayoutSummary } from '@/features/payouts'             🟢

  ┌────────────────────────┐                    ┌────────────────────────┐
  │    FEATURE: SPORTS     │                    │    FEATURE: PAYOUTS    │
  │  ┌──────────────────┐  │                    │  ┌──────────────────┐  │
  │  │ internal code    │  │                    │  │ internal code    │  │
  │  │ (private)        │  │                    │  │ (private)        │  │
  │  └────────┬─────────┘  │                    │  └────────┬─────────┘  │
  │           ▼            │                    │           ▼            │
  │      [ index.ts ]      │ ──── public API ──►│      [ index.ts ]      │
  └────────────────────────┘                    └────────────────────────┘

  what is not exported from index.ts is free to change without warning`}</Diagram>

      {/* ── Mechanisms ────────────────────────────────────────────────── */}
      <H2 id="mechanisms">২. কোর বাউন্ডারি রুল</H2>

      <p>
        <strong>Strict public API:</strong> প্রতিটি ফিচারের মূলে একটি <code>index.ts</code> থাকবে,
        আর বাইরের কেউ শুধু সেখান থেকে এক্সপোর্ট করা জিনিসই ব্যবহার করতে পারবে। গভীরে ইমপোর্ট (
        <code>@/features/payouts/components/internal/Modal</code>) কঠোরভাবে নিষিদ্ধ।
      </p>

      <p>
        <strong>Loose coupling &amp; explicit contracts:</strong> এক ফিচার যেন অন্যের ইন্টারনাল
        ইমপ্লিমেন্টেশনের ওপর নির্ভর না করে। যোগাযোগ হবে hook, টাইপ বা ইন্টারফেসের মাধ্যমে — ফাইল
        লেআউটের মাধ্যমে নয়।
      </p>

      <p>
        <strong>Automated enforcement:</strong> মানুষ ভুল করে, লিন্টার করে না। ESLint-এর{" "}
        <code>no-restricted-imports</code> দিয়ে অবৈধ ইমপোর্ট বিল্ড টাইমেই ব্লক করুন — কোড রিভিউয়ের
        ওপর ভরসা করে বাউন্ডারি টিকিয়ে রাখা যায় না।
      </p>

      {/* ── Implementation ────────────────────────────────────────────── */}
      <H2 id="implementation">৩. Production Code Implementation</H2>

      <H3>❌ Anti-pattern — deep import দিয়ে coupling</H3>

      <CodeBlock filename="src/features/sports/components/LiveBetCard.tsx">{`// 🔴 POOR PRACTICE: reaching into another feature's private implementation
import { calculateUserFeeInternal } from '@/features/payouts/utils/payoutCalculators';
import { PayoutModalPrivate } from '@/features/payouts/components/modals/PayoutModalPrivate';

export function LiveBetCard() {
  // ❌ Sports is now coupled to Payouts' file layout. Rename a folder there,
  //    and this file breaks — with nothing to warn you until it does.
  const fee = calculateUserFeeInternal(100);

  return <PayoutModalPrivate fee={fee} />;
}`}</CodeBlock>

      <H3>🟢 Production pattern — barrier + enforcement</H3>

      <p>
        <strong>Step 1 — ফিচারের public barrier।</strong>
      </p>

      <CodeBlock filename="src/features/payouts/index.ts">{`// 🟢 PRODUCTION PATTERN: the only door into this feature
// Export stable contracts; keep helpers and sub-components private.

export { PayoutModal } from './components/PayoutModal';
export { usePayoutSummary } from './hooks/usePayoutSummary';
export type { PayoutRequestData, PayoutStatus } from './types';

// utils/payoutCalculators.ts and the internal modals are deliberately absent:
// they are implementation, and implementation is free to change.`}</CodeBlock>

      <p>
        <strong>Step 2 — barrier দিয়েই ব্যবহার।</strong>
      </p>

      <CodeBlock filename="src/features/sports/components/LiveBetCard.tsx">{`// 🟢 PRODUCTION PATTERN: Sports depends on a contract, not on a file path
'use client';

import { PayoutModal, usePayoutSummary } from '@/features/payouts';

export function LiveBetCard() {
  const { summary, isLoading } = usePayoutSummary();

  if (isLoading) return <div>Loading payout status…</div>;

  return (
    <div className="rounded-lg border p-4">
      <h3 className="font-semibold">Live Bet Card</h3>
      <PayoutModal totalAmount={summary?.totalPending ?? 0} />
    </div>
  );
}`}</CodeBlock>

      <p>
        <strong>Step 3 — লিন্টার দিয়ে বাউন্ডারি লক।</strong>
      </p>

      <CodeBlock filename="eslint.config.mjs">{`// 🟢 PRODUCTION PATTERN: the rule the whole architecture rests on
export default [
  {
    rules: {
      'no-restricted-imports': ['error', {
        patterns: [
          {
            group: ['@/features/*/*'],
            message:
              'Feature boundary violation: import from @/features/<name>, not from inside it.',
          },
        ],
      }],
    },
  },

  // a feature may of course reach into its own internals
  {
    files: ['src/features/*/**'],
    rules: { 'no-restricted-imports': 'off' },
  },

  // and shared code may never depend on a feature at all
  {
    files: ['src/shared/**'],
    rules: {
      'no-restricted-imports': ['error', {
        patterns: [{
          group: ['@/features/*', '@/app/*'],
          message: 'shared/ must not depend on features/ or app/.',
        }],
      }],
    },
  },
];`}</CodeBlock>

      <p>
        একই কাজ CI-তে <code>dependency-cruiser</code> দিয়েও করা যায় — সেটি circular dependency-ও
        ধরে ফেলে, যা <code>no-restricted-imports</code> পারে না।
      </p>

      {/* ── Matrix ────────────────────────────────────────────────────── */}
      <H2 id="matrix">৪. Boundary Architecture Matrix</H2>

      <Table
        head={["ক্রাইটেরিয়া", "Tight coupling", "Enforced boundaries"]}
        rows={[
          [
            "ইমপোর্ট প্যাটার্ন",
            "@/features/payouts/utils/calc 🔴",
            "@/features/payouts 🟢",
          ],
          [
            "রিফ্যাক্টর নিরাপত্তা",
            "শূন্য — ফাইল সরালেই অন্য ফিচার ভাঙে 🔴",
            "ইন্টারনাল যা খুশি বদলান, নিরাপদ 🟢",
          ],
          [
            "টিম আইসোলেশন",
            "দুই টিমের কাজে নিয়মিত সংঘাত",
            "স্বাধীন টিমে স্কেল করা যায় 🟢",
          ],
          [
            "নিয়ম রক্ষা",
            "কোড রিভিউয়ের ওপর নির্ভরশীল 🔴",
            "ESLint ও CI-তে অটোমেটেড 🟢",
          ],
        ]}
      />

      <Line name="ভুলু ভাই">
        ক্লিয়ার ফাহিম! লিন্ট রুল বসিয়ে দিতেই এডিটরেই লাল দাগ পড়ছে — এখন ভুল করে গভীরে ইমপোর্ট করতে
        চাইলেও পারব না!
      </Line>

      {/* ── Takeaways ─────────────────────────────────────────────────── */}
      <H2 id="takeaway">Production Takeaways</H2>

      <Note>
        <ul>
          <li>
            <strong>Build the barrier first:</strong> ফিচার তৈরির শুরুতেই <code>index.ts</code>{" "}
            বানান — পরে যোগ করা মানে ততদিনে সব deep import হয়ে যাওয়া।
          </li>
          <li>
            <strong>Automate, don&rsquo;t review:</strong> বাউন্ডারি ভাঙার চেষ্টা এডিটর বা CI-তেই
            আটকে দিন <code>no-restricted-imports</code> দিয়ে।
          </li>
          <li>
            <strong>Circular dependency মানে ভুল জায়গা:</strong> A যদি B-কে আর B যদি A-কে ডাকে,
            তাহলে কমন অংশটুকু <code>shared/</code>-এ বা একটি নতুন ফিচারে সরান।
          </li>
        </ul>
      </Note>
    </article>
  );
}
