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
      bn: "সব টেস্ট গ্রিন, বাটন চ্যাপ্টা",
      en: "All green, every button flattened",
    },
  },
  {
    id: "architecture",
    label: {
      bn: "Pixel diff ওয়ার্কফ্লো",
      en: "The pixel diff workflow",
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
      bn: "Playwright snapshot ও Chromatic",
      en: "Playwright snapshots & Chromatic",
    },
  },
  {
    id: "matrix",
    label: { bn: "VRT টুল তুলনা", en: "VRT tool comparison" },
  },
  {
    id: "takeaway",
    label: { bn: "Production Takeaways", en: "Production takeaways" },
  },
];

export default function VisualRegressionTesting() {
  return (
    <article className="doc-prose">
      {/* ── The problem ───────────────────────────────────────────────── */}
      <H2 id="the-problem" anchorOnly>
        সব টেস্ট গ্রিন, বাটন চ্যাপ্টা
      </H2>

      <p>
        সকাল ১০:০৫। ভুলু ভাই চা হাতে স্ক্রিনের দিকে হা করে তাকিয়ে আছেন। কাল রাতে{" "}
        <code>globals.css</code>-এ একটি মার্জিন ফাইন-টিউন করতে গিয়ে তিনি ভুল করে{" "}
        <code>.btn</code> ক্লাসের padding বদলে ফেলেছিলেন। ইউনিট টেস্ট ও E2E ফ্লো সম্পূর্ণ গ্রিন —
        কারণ কোনো ফাংশনাল লজিক ভাঙেনি। কিন্তু সকালে প্রোডাকশনে গিয়ে দেখা গেল, ৫০টি পেজের সব প্রাইমারি
        বাটন চ্যাপ্টা হয়ে ভেতরের টেক্সট কেটে গেছে।
      </p>

      <Line name="ভুলু ভাই">
        ফাহিম! আমার টেস্টে তো টেক্সট DOM-এ ছিল, তাই সব পাস করে গেছে! কিন্তু বাটন যে চ্যাপ্টা হয়ে
        ডিজাইন নষ্ট হয়ে গেছে, তা টেস্ট ফ্রেমওয়ার্ক ধরতে পারল না কেন? লজিক ঠিক রেখে UI ভাঙেনি — এটা
        অটোমেটিক কীভাবে টেস্ট করব?
      </Line>

      <Line name="ফাহিম">
        ভুলু ভাই! ফাংশনাল টেস্ট দেখে &ldquo;DOM-এ এলিমেন্টটি আছে কি না&rdquo;, কিন্তু দেখে না
        &ldquo;এলিমেন্টটি দেখতে কেমন&rdquo;। এর জন্যই দরকার Visual Regression Testing — যা পেজ বা
        কম্পোনেন্টের পিক্সেল-বাই-পিক্সেল স্ক্রিনশট তুলে বেসলাইনের সাথে তুলনা করে, ১ পিক্সেল বদলালেও
        ডিফ তুলে ধরে।
      </Line>

      <Line name="নেক্সট-ভাই">
        একদম! Playwright-এ বিল্ট-ইন <code>toHaveScreenshot()</code> আছে। আর বড় টিম বা ডিজাইন
        সিস্টেমের জন্য Percy বা Chromatic-এর মতো ক্লাউড VRT টুল ইন্ডাস্ট্রি স্ট্যান্ডার্ড।
      </Line>

      {/* ── Architecture ──────────────────────────────────────────────── */}
      <H2 id="architecture">১. Visual Regression Workflow</H2>

      <Diagram>{`┌─────────────────────────────────────────────────────────────────────────────┐
│                   VISUAL REGRESSION TESTING WORKFLOW                        │
└─────────────────────────────────────────────────────────────────────────────┘

 [code change pushed] ──► Playwright / Chromatic headless browser
                                │
                                ▼
                   [capture the new UI snapshot]
                                │
                                ▼
               [compare pixel by pixel against the baseline]
                                │
                      ┌─────────┴─────────┐
                      │                   │
               [0% difference]     [pixels mismatched]
                      │                   │
                      ▼                   ▼
                [pass] 🟢          [generate a diff image] 🔴
                                    changed pixels in magenta`}</Diagram>

      {/* ── Mechanisms ────────────────────────────────────────────────── */}
      <H2 id="mechanisms">২. কোর আর্কিটেকচারাল কনসেপ্ট</H2>

      <p>
        <strong>Baseline vs target snapshot:</strong> প্রথমবার টেস্ট চালালে একটি রেফারেন্স ছবি —
        baseline snapshot — সেভ হয়। পরে কোড পুশ করলে নতুন স্ক্রিনশটের সাথে সেই baseline-এর পিক্সেল
        তুলনা হয়। Baseline তাই রিভিউ করে কমিট করার জিনিস, যেমন কোড।
      </p>

      <p>
        <strong>Threshold management:</strong> ভিন্ন অপারেটিং সিস্টেম বা রেন্ডারিং ইঞ্জিনে সামান্য
        anti-aliasing পার্থক্য আসে। তাই <code>maxDiffPixelRatio</code> বা{" "}
        <code>threshold</code> কনফিগার করে flakiness কমানো হয় — কিন্তু এত ঢিলে নয় যে আসল রিগ্রেশন
        গলে যায়।
      </p>

      <p>
        <strong>Masking dynamic elements:</strong> পেজে ডায়নামিক ডাটা (বর্তমান সময়, র‍্যান্ডম
        অ্যাভাটার, অ্যানিমেশন) থাকলে স্ক্রিনশট প্রতিবারই ফেইল করবে। VRT চালানোর আগে সেগুলো{" "}
        <code>mask</code> করে নিতে হয়, নয়তো টিম টেস্টে বিশ্বাস করা ছেড়ে দেয়।
      </p>

      <p>
        <strong>Cross-platform consistency:</strong> লোকাল Mac-এ তোলা স্ক্রিনশট GitHub Actions-এর
        Linux রানারের সাথে মিলবে না — ফন্ট রেন্ডারিং আলাদা। তাই baseline সবসময় CI বা Docker
        এনভায়রনমেন্টে জেনারেট করা উচিত, সেটাই single source of truth।
      </p>

      {/* ── Implementation ────────────────────────────────────────────── */}
      <H2 id="implementation">৩. Production Code Implementation</H2>

      <H3>❌ Anti-pattern — mask ছাড়াই ডায়নামিক পেজের snapshot</H3>

      <CodeBlock filename="e2e/visual/dashboard.bad.spec.ts">{`// 🔴 POOR PRACTICE: snapshotting a page full of moving parts
import { test, expect } from '@playwright/test';

test('bad visual test', async ({ page }) => {
  await page.goto('/dashboard');

  // ❌ the live clock, today's date and the async avatar all differ every run
  await expect(page).toHaveScreenshot('dashboard.png');
});`}</CodeBlock>

      <H3>🟢 Production pattern 1 — Playwright native VRT with masking</H3>

      <CodeBlock filename="e2e/visual/homepage.spec.ts">{`// 🟢 PRODUCTION PATTERN: masked, tolerance-tuned, animation-free snapshots
import { test, expect } from '@playwright/test';

test.describe('Visual regression: critical pages', () => {
  test('the landing page matches its baseline', async ({ page }) => {
    await page.goto('/');

    // 🟢 wait for fonts and the network, so rendering is deterministic
    await page.evaluate(() => document.fonts.ready);
    await page.waitForLoadState('networkidle');

    await expect(page).toHaveScreenshot('homepage-baseline.png', {
      // cover everything that legitimately changes between runs
      mask: [
        page.getByTestId('live-clock'),
        page.getByRole('img', { name: /user avatar/i }),
      ],

      // allow 0.2% drift for cross-platform anti-aliasing — no more
      maxDiffPixelRatio: 0.002,

      // a stylesheet that hides carets and freezes transitions
      stylePath: './e2e/visual/vrt-override.css',

      fullPage: true,
    });
  });

  test('the primary button variant matches its baseline', async ({ page }) => {
    await page.goto('/design-system/buttons');

    const primaryBtn = page.getByTestId('primary-submit-btn');

    // 🟢 a component-level shot: a smaller surface means a clearer diff
    await expect(primaryBtn).toHaveScreenshot('primary-button-state.png', {
      animations: 'disabled',
    });
  });
});`}</CodeBlock>

      <CodeBlock label="CSS" filename="e2e/visual/vrt-override.css">{`/* 🟢 injected only during visual tests — never shipped to users */
*,
*::before,
*::after {
  animation: none !important;
  transition: none !important;
  caret-color: transparent !important;
}`}</CodeBlock>

      <H3>🟢 Production pattern 2 — Storybook + Chromatic</H3>

      <p>
        প্রজেক্টে কম্পোনেন্ট লাইব্রেরি বা ডিজাইন সিস্টেম থাকলে Chromatic সবচেয়ে কার্যকর — প্রতিটি
        story-ই একেকটি স্বতন্ত্র snapshot।
      </p>

      <CodeBlock filename="components/Button.stories.tsx">{`import type { Meta, StoryObj } from '@storybook/react';
import { Button } from './Button';

const meta: Meta<typeof Button> = {
  title: 'Design System/Button',
  component: Button,
};

export default meta;
type Story = StoryObj<typeof Button>;

export const Primary: Story = {
  args: { variant: 'primary', children: 'Confirm Payment' },
};

// 🟢 each state is its own story, so each gets its own baseline
export const Disabled: Story = {
  args: { variant: 'primary', disabled: true, children: 'Processing...' },
};`}</CodeBlock>

      <CodeBlock label="YAML" filename=".github/workflows/chromatic.yml">{`name: Visual regression via Chromatic

on: push

jobs:
  chromatic:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout code
        uses: actions/checkout@v4
        with:
          fetch-depth: 0 # 🟢 Chromatic needs full history to diff against the base

      - name: Install dependencies
        run: pnpm install --frozen-lockfile

      - name: Run Chromatic snapshot review
        uses: chromaui/action@v1
        with:
          projectToken: \${{ secrets.CHROMATIC_PROJECT_TOKEN }}`}</CodeBlock>

      {/* ── Matrix ────────────────────────────────────────────────────── */}
      <H2 id="matrix">৪. Visual Regression Tool Matrix</H2>

      <Table
        head={["বৈশিষ্ট্য", "Playwright built-in", "Chromatic", "Percy"]}
        rows={[
          [
            "Setup cost",
            "শূন্য — বিল্ট-ইন 🟢",
            "Storybook সেটআপ প্রয়োজন",
            "SDK ও অ্যাকাউন্ট লাগে",
          ],
          [
            "Best for",
            "Full-page ও রাউট লেভেল UI 🟢",
            "ডিজাইন সিস্টেম, আইসোলেটেড কম্পোনেন্ট 🟢",
            "Cross-browser visual E2E",
          ],
          [
            "Cross-platform",
            "Docker বা CI রানার নিজে সামলাতে হয়",
            "ক্লাউডে নিজস্ব রেন্ডারিং ইঞ্জিন 🟢",
            "ক্লাউডে রেন্ডারিং সামলায় 🟢",
          ],
          [
            "রিভিউ ওয়ার্কফ্লো",
            "CLI diff / HTML report",
            "ওয়েব ড্যাশবোর্ডে approve-reject 🟢",
            "ওয়েব ড্যাশবোর্ড 🟢",
          ],
          [
            "খরচ",
            "১০০% ফ্রি ও ওপেন সোর্স 🟢",
            "ফ্রি টায়ার আছে, পরে পেইড",
            "ফ্রি টায়ার আছে, পরে পেইড",
          ],
        ]}
      />

      <Line name="ভুলু ভাই">
        অসাধারণ ফাহিম! এখন বুঝলাম লজিক ঠিক থাকা সত্ত্বেও UI চ্যাপ্টা হয়ে গেলে{" "}
        <code>toHaveScreenshot()</code> পিক্সেল ডিফ ধরে ফেলবে — CSS চেঞ্জের পর আর ভয়ে ভয়ে থাকতে হবে
        না!
      </Line>

      {/* ── Takeaways ─────────────────────────────────────────────────── */}
      <H2 id="takeaway">Production Takeaways</H2>

      <Note>
        <ul>
          <li>
            <strong>Always mask dynamic data:</strong> সময়, তারিখ, কাউন্টার বা থার্ড-পার্টি ইমেজ{" "}
            <code>mask</code> দিয়ে ঢেকে রাখুন — একটি flaky VRT suite মানে টিম আর ডিফ পড়ে না।
          </li>
          <li>
            <strong>Disable animations and carets:</strong> CSS transition, animation আর input
            cursor blinking বন্ধ না করলে false positive আসবেই।
          </li>
          <li>
            <strong>Generate baselines in CI, not locally:</strong> OS-ভেদে ফন্ট রেন্ডারিং আলাদা —
            CI রানার বা Docker-কেই single source of truth ধরুন।
          </li>
        </ul>
      </Note>
    </article>
  );
}
