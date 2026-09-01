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
      bn: "১০০% কভারেজ, তবু বাগ",
      en: "100% coverage, still a bug",
    },
  },
  {
    id: "architecture",
    label: {
      bn: "Testing Trophy — ROI-র বিন্যাস",
      en: "The testing trophy",
    },
  },
  {
    id: "mechanisms",
    label: {
      bn: "কভারেজ, snapshot আর behaviour",
      en: "Coverage, snapshots, behaviour",
    },
  },
  {
    id: "implementation",
    label: {
      bn: "Threshold ও behavioural টেস্ট",
      en: "Thresholds & a behavioural test",
    },
  },
  {
    id: "matrix",
    label: {
      bn: "Snapshot vs functional vs E2E",
      en: "Snapshot vs functional vs E2E",
    },
  },
  {
    id: "takeaway",
    label: { bn: "Production Takeaways", en: "Production takeaways" },
  },
];

export default function TestCoverageBestPractices() {
  return (
    <article className="doc-prose">
      {/* ── The problem ───────────────────────────────────────────────── */}
      <H2 id="the-problem" anchorOnly>
        ১০০% কভারেজ, তবু বাগ
      </H2>

      <p>
        সন্ধ্যা ৫:৪৫। ভুলু ভাই উৎসাহ নিয়ে স্ক্রিন দেখাচ্ছেন — Vitest-এর কভারেজ রিপোর্টে বড় অক্ষরে
        লেখা <strong>100% Code Coverage</strong>! কিন্তু ফাহিম যখন নেভিগেশনবারের একটি বোতামের নাম
        &ldquo;Submit&rdquo; থেকে &ldquo;Save &amp; Continue&rdquo; করল, সাথে সাথে ৩০টি স্ন্যাপশট
        টেস্ট ফেইল মেরে পুরো CI ব্লক হয়ে গেল — অথচ পেমেন্ট বা ফর্ম ভ্যালিডেশনে কোনো সমস্যাই হয়নি।
      </p>

      <Line name="ভুলু ভাই">
        ফাহিম! ১০০% কভারেজ থাকার পরও একটা বাটনের টেক্সট চেঞ্জ করতেই ৩০টা টেস্ট ফেইল মারল কেন? আর
        কভারেজ ১০০% হওয়া সত্ত্বেও ইউজার কালকে ফর্ম জমা দেওয়ার সময় বাগ পেল কীভাবে?
      </Line>

      <Line name="ফাহিম">
        ভুলু ভাই! ১০০% কোড কভারেজ অনেক সময় <em>false sense of security</em> তৈরি করে। আপনি যদি শুধু
        কম্পোনেন্টের ইন্টারনাল স্ট্রাকচারের snapshot নিয়ে রাখেন, সামান্য HTML/CSS পরিবর্তনেই টেস্ট
        ভাঙবে — একে বলে brittle test। টেস্টের কাজ কোড কীভাবে লেখা হয়েছে তা দেখা নয়, ইউজারের দৃষ্টিতে
        ফিচারটি কাজ করছে কি না তা নিশ্চিত করা।
      </Line>

      <Line name="নেক্সট-ভাই">
        একদম! Kent C. Dodds-এর বিখ্যাত testing trophy কনসেপ্ট বলে —{" "}
        <em>write tests, not too many, mostly integration</em>। কনফিডেন্স আসে সঠিক স্তরে টেস্ট লেখা
        থেকে, সংখ্যা থেকে নয়।
      </Line>

      {/* ── Architecture ──────────────────────────────────────────────── */}
      <H2 id="architecture">১. The Modern Testing Trophy</H2>

      <Diagram>{`┌─────────────────────────────────────────────────────────────────────────────┐
│                      THE MODERN TESTING TROPHY (ROI)                        │
└─────────────────────────────────────────────────────────────────────────────┘

                                 /  E2E  \\           ◄─ highest confidence,
                                /  tests  \\             slow and costly
                               /───────────\\
                              / integration \\        ◄─ MAXIMUM ROI  ⭐
                             /  & functional \\          tests behaviour + DOM
                            /─────────────────\\
                           /    unit tests     \\     ◄─ cheap; pure logic, utils
                          /─────────────────────\\
                         /     static checks     \\   ◄─ TypeScript & ESLint
                        └───────────────────────────┘

 coverage measures which lines ran — not whether the feature works`}</Diagram>

      {/* ── Mechanisms ────────────────────────────────────────────────── */}
      <H2 id="mechanisms">২. কোর কনসেপ্ট</H2>

      <p>
        <strong>Coverage vs confidence:</strong> <em>statement/line coverage</em> বলে কত শতাংশ লাইন
        এক্সিকিউট হয়েছে; <em>branch coverage</em> বলে <code>if/else</code>-এর সব পথ ছোঁয়া হয়েছে কি
        না। কিন্তু একটি লাইন এক্সিকিউট হওয়া আর তার আউটপুট assert করা — এক জিনিস নয়। ৮০% অর্থবহ
        কভারেজ ১০০% ফাঁপা কভারেজের চেয়ে অনেক ভালো।
      </p>

      <p>
        <strong>Snapshot testing — কখন:</strong> ছোট, স্থিতিশীল ডাটা অবজেক্ট — API response schema,
        design token, SVG path — এসব স্থির রাখতে snapshot চমৎকার।
      </p>

      <p>
        <strong>Snapshot testing — কখন নয়:</strong> ডায়নামিক React UI কম্পোনেন্টে। ডেভেলপাররা না
        দেখেই <code>vitest -u</code> মেরে snapshot আপডেট করে ফেলে — ফলে আসল বাগ ঢাকা পড়ে যায়, আর
        টেস্ট সুইট নিছক আনুষ্ঠানিকতা হয়ে দাঁড়ায়।
      </p>

      <p>
        <strong>Functional / behavioural testing:</strong> <code>state.isOpen === true</code> বা
        নির্দিষ্ট <code>div</code> ট্যাগ নয় — <code>userEvent.click</code> আর{" "}
        <code>screen.getByRole</code> দিয়ে দৃশ্যমান ইন্টারঅ্যাকশন টেস্ট করুন। ইন্টারনাল রিফ্যাক্টরে
        এমন টেস্ট ভাঙে না।
      </p>

      {/* ── Implementation ────────────────────────────────────────────── */}
      <H2 id="implementation">৩. Production Code Implementation</H2>

      <H3>❌ Anti-pattern — brittle snapshot ও implementation-bound assert</H3>

      <CodeBlock filename="components/__tests__/Accordion.bad.test.tsx">{`// 🔴 POOR PRACTICE: snapshotting the DOM and asserting on internals
import { render } from '@testing-library/react';
import { expect, test } from 'vitest';
import { Accordion } from '../Accordion';

test('renders accordion correctly (brittle snapshot)', () => {
  const { container } = render(<Accordion title="Details">Hidden Content</Accordion>);

  // ❌ any class rename or extra wrapper div breaks this — with no bug involved
  expect(container).toMatchSnapshot();
});

test('checks internal state directly', () => {
  const { container } = render(<Accordion title="Details">Hidden Content</Accordion>);

  // ❌ an implementation detail the user can neither see nor care about
  const titleDiv = container.querySelector('.accordion-header-title-v2');
  expect(titleDiv?.classList.contains('active')).toBe(false);
});`}</CodeBlock>

      <H3>🟢 Production pattern — meaningful gates + behavioural tests</H3>

      <p>
        <strong>Step 1 — বাস্তবসম্মত কভারেজ threshold।</strong>
      </p>

      <CodeBlock filename="vitest.config.ts">{`// 🟢 PRODUCTION PATTERN: coverage gates that mean something
import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],

  test: {
    environment: 'jsdom',
    setupFiles: ['./vitest.setup.ts'],

    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],

      // 🟢 mocks and generated output are not code under test
      exclude: ['node_modules/', '.next/', 'src/mocks/'],

      // 🟢 achievable numbers a team will actually keep green
      thresholds: {
        lines: 80,
        functions: 80,
        branches: 75,
        statements: 80,
      },
    },
  },
});`}</CodeBlock>

      <p>
        <strong>Step 2 — একই কম্পোনেন্ট, behaviour দিয়ে টেস্ট।</strong>
      </p>

      <CodeBlock filename="components/__tests__/Accordion.test.tsx">{`// 🟢 PRODUCTION PATTERN: user-centric functional testing
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { expect, test } from 'vitest';
import { Accordion } from '../Accordion';

test('toggles content visibility when the user clicks the header', async () => {
  const user = userEvent.setup();

  render(<Accordion title="Server Specs">Intel Xeon 16-Core</Accordion>);

  // 1. the initial state, as the user perceives it
  const headerButton = screen.getByRole('button', { name: /server specs/i });
  expect(screen.queryByText('Intel Xeon 16-Core')).not.toBeInTheDocument();

  // 2. expand
  await user.click(headerButton);
  expect(screen.getByText('Intel Xeon 16-Core')).toBeVisible();

  // 3. collapse again — the round trip is part of the contract
  await user.click(headerButton);
  expect(screen.queryByText('Intel Xeon 16-Core')).not.toBeInTheDocument();
});`}</CodeBlock>

      <p>
        এই টেস্টটি ক্লাসের নাম, wrapper div বা internal state — কিছুই জানে না। কম্পোনেন্টটি সম্পূর্ণ
        রিরাইট করলেও, আচরণ একই থাকলে টেস্ট গ্রিন থাকবে। সেটাই একটি টেস্টের আসল মূল্য।
      </p>

      {/* ── Matrix ────────────────────────────────────────────────────── */}
      <H2 id="matrix">৪. Snapshot vs Functional vs E2E</H2>

      <Table
        head={["ক্রাইটেরিয়া", "Snapshot", "Functional / Integration", "E2E"]}
        rows={[
          [
            "কী টেস্ট করে",
            "DOM স্ট্রাকচার / markup",
            "ইউজার আচরণ ও DOM আউটকাম",
            "সম্পূর্ণ ওয়ার্কফ্লো ও নেটওয়ার্ক",
          ],
          [
            "রিফ্যাক্টর সহনশীলতা",
            "অত্যন্ত কম — brittle 🔴",
            "অত্যন্ত বেশি 🟢",
            "অত্যন্ত বেশি 🟢",
          ],
          ["গতি", "সুপার ফাস্ট (<১০ms)", "দ্রুত (~১০০ms)", "মাঝারি-ধীর (১-৫s)"],
          [
            "রক্ষণাবেক্ষণ খরচ",
            "বেশি — ঘন ঘন -u দিতে হয় 🔴",
            "খুব কম 🟢",
            "মাঝারি",
          ],
          [
            "উপযুক্ত ক্ষেত্র",
            "Design token, config, schema",
            "ফর্ম, modal, পেজ ফিচার 🟢",
            "Checkout, auth, critical flow",
          ],
        ]}
      />

      <Line name="ভুলু ভাই">
        দারুণ ফাহিম! এখন বুঝলাম কেন স্ন্যাপশট টেস্টগুলো বারবার ফেইল করছিল। DOM স্ন্যাপশট বাদ দিয়ে{" "}
        <code>userEvent</code> দিয়ে বিহেভিয়ার টেস্ট লেখা শুরু করেছি, আর V8 কভারেজ threshold সেট করে
        বানিয়ে ফেলেছি এক রক-সলিড টেস্টিং suite!
      </Line>

      <Line name="নেক্সট-ভাই">
        অভিনন্দন ভুলু ভাই! এর সাথেই Next.js অ্যাপ্লিকেশন টেস্টিং অধ্যায়ের সবগুলো টপিক সম্পন্ন হলো।
      </Line>

      {/* ── Takeaways ─────────────────────────────────────────────────── */}
      <H2 id="takeaway">Production Takeaways</H2>

      <Note>
        <ul>
          <li>
            <strong>Test use cases, not code lines:</strong> কোন লাইন এক্সিকিউট হলো তা না দেখে
            বিজনেস লজিকের edge case — error, loading, empty state — কভার করা নিশ্চিত করুন।
          </li>
          <li>
            <strong>Don&rsquo;t test third-party libraries:</strong> framer-motion বা shadcn/ui-এর
            ইন্টারনাল আচরণ টেস্ট করার দরকার নেই — শুধু নিজের বিজনেস লজিক কভার করুন।
          </li>
          <li>
            <strong>Never run vitest -u blindly:</strong> স্ন্যাপশট ফেইল করলে ডিফ না পড়ে আপডেট
            কমান্ড চালাবেন না — এটি বাগ ঢেকে ফেলার সবচেয়ে সহজ উপায়।
          </li>
          <li>
            <strong>Use accessibility queries:</strong> <code>getByRole</code>,{" "}
            <code>getByLabelText</code> ব্যবহার করলে টেস্টের পাশাপাশি অ্যাপের accessibility-ও
            যাচাই হয়ে যায়।
          </li>
        </ul>
      </Note>
    </article>
  );
}
