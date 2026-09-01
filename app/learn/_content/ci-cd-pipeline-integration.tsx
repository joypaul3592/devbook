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
      bn: "লোকালে ২ মিনিট, CI-তে ২৫",
      en: "Two minutes locally, 25 in CI",
    },
  },
  {
    id: "architecture",
    label: {
      bn: "অপ্টিমাইজড পাইপলাইন আর্কিটেকচার",
      en: "An optimised pipeline architecture",
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
      bn: "Cached, parallel, sharded workflow",
      en: "A cached, parallel, sharded workflow",
    },
  },
  {
    id: "matrix",
    label: {
      bn: "কোন কৌশলে কত সময় বাঁচে",
      en: "What each technique buys you",
    },
  },
  {
    id: "takeaway",
    label: { bn: "Production Takeaways", en: "Production takeaways" },
  },
];

export default function CiCdPipelineIntegration() {
  return (
    <article className="doc-prose">
      {/* ── The problem ───────────────────────────────────────────────── */}
      <H2 id="the-problem" anchorOnly>
        লোকালে ২ মিনিট, CI-তে ২৫
      </H2>

      <p>
        দুপুর ২:৩০। ভুলু ভাই মাথায় হাত দিয়ে বসে আছেন। তিনি দাবি করেছিলেন &ldquo;আমার লোকাল মেশিনে সব
        টেস্ট পাস করেছে&rdquo; — অথচ প্রোডাকশনে পুশ করার পর বিল্ড ফেইল করে পুরো সাইট ডাউন। উপরন্তু
        তার বানানো GitHub Actions ওয়ার্কফ্লোতে প্রতিটি PR রান হতে ২৫ মিনিট লাগছে, আর ফ্রি Actions
        মিনিট শেষ হয়ে যাচ্ছে।
      </p>

      <Line name="ভুলু ভাই">
        ফাহিম! লোকালে <code>pnpm test</code> দিলে ২ মিনিটে সব গ্রিন, কিন্তু GitHub Actions-এ ২৫ মিনিট
        ঝুলিয়ে রাখে কেন? আর ম্যানুয়ালি টেস্ট না চালিয়ে PR করার সাথে সাথেই অটোমেটিক ভ্যালিডেশন কীভাবে
        করাবো?
      </Line>

      <Line name="ফাহিম">
        ভুলু ভাই! লোকালে <code>node_modules</code> আর <code>.next/cache</code> আগে থেকেই থাকে,
        কিন্তু GitHub Actions প্রতিবার একেবারে ফ্রেশ ভার্চুয়াল মেশিনে রান হয়। ক্যাশিং, জব
        parallelization আর Playwright sharding ব্যবহার না করলে সময় আর খরচ — দুটোই নষ্ট হয়।
      </Line>

      <Line name="নেক্সট-ভাই">
        একদম! একটি আদর্শ পাইপলাইনের কাজ শুধু টেস্ট চালানো নয় — এটি একটি{" "}
        <strong>quality gate</strong>: টেস্ট পাস না করা পর্যন্ত কোড কখনো <code>main</code>-এ মার্জ
        হতে দেবে না।
      </Line>

      {/* ── Architecture ──────────────────────────────────────────────── */}
      <H2 id="architecture">১. Optimised CI/CD Pipeline Architecture</H2>

      <Diagram>{`┌─────────────────────────────────────────────────────────────────────────────┐
│                 OPTIMISED GITHUB ACTIONS CI/CD PIPELINE                     │
└─────────────────────────────────────────────────────────────────────────────┘

 [developer pushes a PR] ──► GitHub Actions trigger
                                │
               ┌────────────────┴────────────────┐
               ▼                                 ▼
       [job 1: lint & typecheck]         [job 2: vitest unit/component]
       (pnpm store cache)                (pnpm store cache)
               │                                 │
               └────────────────┬────────────────┘
                                │ only if both pass
                                ▼
                     [job 3: playwright e2e]
             ┌──────────────────┴──────────────────┐
             ▼                                     ▼
     [shard 1/2 matrix]                    [shard 2/2 matrix]
             │                                     │
             └──────────────────┬──────────────────┘
                                ▼
                    [upload the playwright report]
                                │
                                ▼
                       🟢 ready to merge`}</Diagram>

      {/* ── Mechanisms ────────────────────────────────────────────────── */}
      <H2 id="mechanisms">২. কোর আর্কিটেকচারাল কনসেপ্ট</H2>

      <p>
        <strong>Dependency &amp; Next.js caching:</strong> <code>actions/setup-node</code>-এর{" "}
        <code>cache: &lsquo;pnpm&rsquo;</code> দিয়ে প্যাকেজ স্টোর, আর{" "}
        <code>actions/cache</code> দিয়ে <code>.next/cache</code> সংরক্ষণ করলে ইনস্টলেশন ও রিপিটেড
        বিল্ড টাইম নাটকীয়ভাবে কমে।
      </p>

      <p>
        <strong>Job parallelization:</strong> lint, typecheck, unit test আর E2E একটি জবে পর পর না
        চালিয়ে আলাদা জবে ভাগ করুন। দ্রুত চেকগুলো আগে ফেইল করলে ধীর E2E কখনো শুরুই হবে না — এটাই
        সবচেয়ে সস্তা অপ্টিমাইজেশন।
      </p>

      <p>
        <strong>Playwright sharding:</strong> ৩০-৪০টি E2E টেস্ট একটি মেশিনে চালালে অনেক সময় লাগে।{" "}
        <code>--shard=1/2</code> ফ্ল্যাগ দিয়ে টেস্টগুলো একাধিক প্যারালাল রানারে ভাগ করে ফেলা যায়।
      </p>

      <p>
        <strong>Concurrency control:</strong> একই PR-এ পর পর তিনটি কমিট দিলে আগের চলমান জবগুলো{" "}
        <code>cancel-in-progress: true</code> দিয়ে স্বয়ংক্রিয়ভাবে বাতিল হয় — রানার মিনিট আর
        অপচয় হয় না।
      </p>

      {/* ── Implementation ────────────────────────────────────────────── */}
      <H2 id="implementation">৩. Production Code Implementation</H2>

      <H3>❌ Anti-pattern — ক্যাশ ছাড়া মনোলিথিক পাইপলাইন</H3>

      <CodeBlock label="YAML" filename=".github/workflows/slow-ci.yml">{`# 🔴 POOR PRACTICE: one job, sequential steps, zero caching
name: Slow CI

on: [push]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 20

      # ❌ re-downloads every dependency on every run (5+ minutes)
      - run: npm install
      - run: npm run lint
      - run: npm run test:unit
      - run: npx playwright install --with-deps

      # ❌ the whole E2E suite on one runner (15+ minutes)
      - run: npx playwright test`}</CodeBlock>

      <H3>🟢 Production pattern — parallel, cached, sharded</H3>

      <CodeBlock label="YAML" filename=".github/workflows/ci.yml">{`# 🟢 PRODUCTION PATTERN: a quality gate that finishes in minutes
name: Next.js quality assurance pipeline

on:
  push:
    branches: [main]
  pull_request:
    types: [opened, synchronize, reopened]

# 🟢 a new commit on the same PR cancels the previous, now-pointless run
concurrency:
  group: \${{ github.workflow }}-\${{ github.ref }}
  cancel-in-progress: true

jobs:
  # ── job 1: the cheap checks ────────────────────────────────────────
  lint-and-typecheck:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: pnpm/action-setup@v3
        with:
          version: 9
      - uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: 'pnpm' # 🟢 restores the pnpm store between runs

      - run: pnpm install --frozen-lockfile

      - name: Typecheck and lint
        run: |
          pnpm run typecheck
          pnpm run lint

  # ── job 2: unit and component tests, in parallel with job 1 ────────
  unit-tests:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: pnpm/action-setup@v3
        with:
          version: 9
      - uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: 'pnpm'

      - run: pnpm install --frozen-lockfile
      - run: pnpm test:unit --run --coverage

  # ── job 3: E2E, only once the cheap checks are green ───────────────
  e2e-tests:
    timeout-minutes: 15
    runs-on: ubuntu-latest
    needs: [lint-and-typecheck, unit-tests]

    strategy:
      fail-fast: false
      matrix:
        shard: [1/2, 2/2] # 🟢 two runners split the suite between them

    steps:
      - uses: actions/checkout@v4
      - uses: pnpm/action-setup@v3
        with:
          version: 9
      - uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: 'pnpm'

      - run: pnpm install --frozen-lockfile

      - name: Resolve the Playwright version
        id: playwright-version
        run: echo "version=$(pnpm list --depth 0 | grep @playwright/test | awk '{print $2}')" >> $GITHUB_OUTPUT

      # 🟢 browser binaries are large — cache them, keyed by version
      - name: Cache Playwright browsers
        uses: actions/cache@v4
        id: playwright-cache
        with:
          path: ~/.cache/ms-playwright
          key: \${{ runner.os }}-playwright-\${{ steps.playwright-version.outputs.version }}

      - name: Install Playwright browsers
        if: steps.playwright-cache.outputs.cache-hit != 'true'
        run: pnpm exec playwright install --with-deps

      # 🟢 the Next.js build cache makes the E2E build far cheaper
      - name: Cache the Next.js build
        uses: actions/cache@v4
        with:
          path: \${{ github.workspace }}/.next/cache
          key: \${{ runner.os }}-nextjs-\${{ hashFiles('**/pnpm-lock.yaml') }}-\${{ hashFiles('**.[jt]s', '**.[jt]sx') }}
          restore-keys: |
            \${{ runner.os }}-nextjs-\${{ hashFiles('**/pnpm-lock.yaml') }}-

      - run: pnpm run build

      - name: Run Playwright tests (shard \${{ matrix.shard }})
        run: pnpm exec playwright test --shard=\${{ matrix.shard }}

      # 🟢 a failed CI run you cannot debug is a failed CI run twice
      - name: Upload the Playwright report
        uses: actions/upload-artifact@v4
        if: failure()
        with:
          name: playwright-report-\${{ strategy.job-index }}
          path: playwright-report/
          retention-days: 7`}</CodeBlock>

      {/* ── Matrix ────────────────────────────────────────────────────── */}
      <H2 id="matrix">৪. Pipeline Optimisation Techniques</H2>

      <Table
        head={["টেকনিক", "কীভাবে কাজ করে", "প্রভাব"]}
        rows={[
          [
            "Dependency caching",
            "lockfile না বদলালে স্টোর ক্যাশ থেকে প্যাকেজ লোড করে",
            "৩-৫ মিনিট বাঁচায় 🟢",
          ],
          [
            "Next.js build cache",
            "আগের বিল্ডের কম্পাইলেশন আংশিক রিইউজ করে",
            "৫০-৭০% বিল্ড টাইম কমায় 🟢",
          ],
          [
            "Playwright sharding",
            "E2E টেস্ট সমভাবে একাধিক রানারে ভাগ করে",
            "৫০-৮০% E2E সময় কমায় 🟢",
          ],
          [
            "Concurrency cancel",
            "নতুন কমিট এলে পুরোনো পেন্ডিং রান বাতিল করে",
            "অহেতুক রানার দখল আটকায় 🟢",
          ],
          [
            "Failure artifacts",
            "ফেইল করলে ট্রেস ও রিপোর্ট আপলোড করে রাখে",
            "ডিবাগিং লোকাল রিপ্রোডাকশন ছাড়াই সম্ভব 🟢",
          ],
        ]}
      />

      <Line name="ভুলু ভাই">
        মারাত্মক ফাহিম! আগে প্লেরাইট টেস্ট ২৫ মিনিট ঝুলত, এখন pnpm ক্যাশ আর sharded matrix ব্যবহার
        করায় পুরো CI মাত্র কয়েক মিনিটে গ্রিন টিক দিয়ে দিচ্ছে!
      </Line>

      {/* ── Takeaways ─────────────────────────────────────────────────── */}
      <H2 id="takeaway">Production Takeaways</H2>

      <Note>
        <ul>
          <li>
            <strong>Parallelize, then gate:</strong> lint, unit test আর E2E আলাদা জবে চালান, আর E2E
            কে <code>needs</code> দিয়ে সস্তা চেকগুলোর পেছনে রাখুন।
          </li>
          <li>
            <strong>Shard beyond ~20 E2E tests:</strong> টেস্ট সংখ্যা বাড়লে{" "}
            <code>--shard</code> ম্যাট্রিক্স ছাড়া CI অনিবার্যভাবে ধীর হয়ে যাবে।
          </li>
          <li>
            <strong>Upload artifacts on failure:</strong> ট্রেস বা HTML রিপোর্ট{" "}
            <code>actions/upload-artifact</code> দিয়ে সেভ করুন — CI-only ফেইলিওর ডিবাগ করার এটাই
            একমাত্র উপায়।
          </li>
        </ul>
      </Note>
    </article>
  );
}
