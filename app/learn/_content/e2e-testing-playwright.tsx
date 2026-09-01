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
      bn: "তিন ব্রাউজারে ম্যানুয়াল রিগ্রেশন",
      en: "Manual regression in three browsers",
    },
  },
  {
    id: "architecture",
    label: {
      bn: "Playwright-এর এক্সিকিউশন ফ্লো",
      en: "The Playwright execution flow",
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
      bn: "Page Object Model ও checkout spec",
      en: "Page Object Model & a checkout spec",
    },
  },
  {
    id: "matrix",
    label: { bn: "Playwright vs Cypress", en: "Playwright vs Cypress" },
  },
  {
    id: "takeaway",
    label: { bn: "Production Takeaways", en: "Production takeaways" },
  },
];

export default function E2eTestingPlaywright() {
  return (
    <article className="doc-prose">
      {/* ── The problem ───────────────────────────────────────────────── */}
      <H2 id="the-problem" anchorOnly>
        তিন ব্রাউজারে ম্যানুয়াল রিগ্রেশন
      </H2>

      <p>
        রাত ১১:৪৫। ভুলু ভাই ল্যাপটপে তিনটি ভিন্ন ব্রাউজার — Chrome, Firefox আর Safari খুলে ম্যানুয়ালি
        সাইন আপ করছেন, প্রোডাক্ট কার্টে যোগ করছেন, তারপর পেমেন্ট পেজে গিয়ে বোতামে ক্লিক করছেন। চোখ
        লাল হয়ে গেছে, মুখ ক্লান্ত।
      </p>

      <Line name="ভুলু ভাই">
        ফাহিম! প্রতিবার প্রোডাকশনে ডিপ্লয়ের আগে পুরো ওয়েবসাইট ঘুরে সব বাটন, ফর্ম আর রাউটিং চেক করতে
        করতে আমার ২ ঘণ্টা নষ্ট হয়! ইউনিট আর কম্পোনেন্ট টেস্ট তো চলল — কিন্তু আসল ব্রাউজারে লগইন থেকে
        পেমেন্ট পর্যন্ত পুরো ফ্লো অটোমেট করার কোনো উপায় নেই?
      </Line>

      <Line name="ফাহিম">
        ভুলু ভাই! এই বিরক্তিকর ম্যানুয়াল কাজটাকে ১০০% অটোমেট করতেই তৈরি হয়েছে{" "}
        <code>Playwright</code> — মাইক্রোসফটের End-to-End টেস্টিং ফ্রেমওয়ার্ক, যা আসল ব্রাউজার চালিয়ে
        ইউজারের সম্পূর্ণ জার্নি পরীক্ষা করে।
      </Line>

      <Line name="নেক্সট-ভাই">
        একদম! Playwright-এর সবচেয়ে বড় সুবিধা — এটি জেনুইন Chromium, Firefox আর WebKit (Safari)
        ইঞ্জিন সমান্তরালে রান করতে পারে। Auto-waiting থাকায় কোনো কৃত্রিম{" "}
        <code>sleep(5000)</code> লাগে না, আর Trace Viewer দিয়ে ফেইল হওয়া টেস্টের ভিডিও, নেটওয়ার্ক
        কল ও DOM স্টেট স্টেপ-বাই-স্টেপ রিওয়াইন্ড করে দেখা যায়!
      </Line>

      {/* ── Architecture ──────────────────────────────────────────────── */}
      <H2 id="architecture">১. Playwright E2E Execution Flow</H2>

      <Diagram>{`┌─────────────────────────────────────────────────────────────────────────────┐
│                       PLAYWRIGHT E2E EXECUTION FLOW                         │
└─────────────────────────────────────────────────────────────────────────────┘

 [Playwright runner] ────► starts the local Next.js server (http://localhost:3000)
                                      │
                                      ▼
                   ┌──────────────────────────────────────┐
                   │ multi-browser parallel test execution │
                   ├──────────────┬───────────────┬───────┤
                   │  Chromium    │   Firefox     │WebKit │
                   └──────┬───────┴───────┬───────┴───┬───┘
                          │               │           │
                          ▼               ▼           ▼
                   [real user interactions: type, click, navigate]
                                      │
                                      ▼
                   [real API calls + database mutations]
                                      │
                                      ▼
                   [web-first assertions: expect(page).toHaveURL()]`}</Diagram>

      {/* ── Mechanisms ────────────────────────────────────────────────── */}
      <H2 id="mechanisms">২. কোর আর্কিটেকচারাল কনসেপ্ট</H2>

      <p>
        <strong>Full-stack validation:</strong> ইউনিট বা কম্পোনেন্ট টেস্ট mock-এর ওপর চলে, কিন্তু E2E
        টেস্ট একটি সত্যিকারের রানিং Next.js অ্যাপ্লিকেশন, আসল ডাটাবেস আর ব্যাকএন্ড API-এর ওপর ভিত্তি
        করে ব্রাউজারে চালিত হয়।
      </p>

      <p>
        <strong>Web-first auto-waiting:</strong> Playwright বাটনে ক্লিক করার আগে এলিমেন্টটি ভিজিবল,
        enabled এবং অ্যানিমেশন শেষ হয়েছে কি না — স্বয়ংক্রিয়ভাবে অপেক্ষা করে। ফলে টেস্ট flaky হয় না,
        আর <code>waitForTimeout</code> লেখার দরকারই পড়ে না।
      </p>

      <p>
        <strong>Page Object Model:</strong> E2E টেস্ট কোড পরিচ্ছন্ন ও রক্ষণাবেক্ষণযোগ্য রাখতে প্রতিটি
        পেজের locator ও ইন্টারঅ্যাকশন একটি আলাদা ক্লাসে সাজিয়ে রাখা হয়। সিলেক্টর বদলালে একটিমাত্র
        ফাইল বদলাতে হয়, ৫০টা spec নয়।
      </p>

      <p>
        <strong>Next.js webServer integration:</strong> কনফিগে <code>webServer</code> সেট করলে
        Playwright নিজেই Next.js dev বা production সার্ভার চালু করে, টেস্ট চালায়, তারপর সার্ভার বন্ধ
        করে দেয় — CI-তে আলাদা কোনো orchestration লাগে না।
      </p>

      {/* ── Implementation ────────────────────────────────────────────── */}
      <H2 id="implementation">৩. Production Code Implementation</H2>

      <H3>❌ Anti-pattern — fragile XPath আর hardcoded sleep</H3>

      <CodeBlock filename="e2e/checkout.bad.spec.ts">{`// 🔴 POOR PRACTICE: brittle XPaths and hardcoded timeouts
// Threat: slow, and fails at random even when the app is perfectly healthy.

import { test } from '@playwright/test';

test('bad checkout test', async ({ page }) => {
  await page.goto('http://localhost:3000/checkout');

  // ❌ a hardcoded pause: too short and it flakes, too long and CI crawls
  await page.waitForTimeout(5000);

  // ❌ a positional XPath breaks the moment a wrapper div is added
  await page.click('/html/body/div[2]/form/div[1]/button[2]');

  // ❌ a one-shot visibility read, with none of the auto-waiting
  const isVisible = await page.isVisible('.success-banner');
  if (!isVisible) throw new Error('Failed!');
});`}</CodeBlock>

      <H3>🟢 Production pattern — POM + auto-waiting + webServer</H3>

      <p>
        <strong>Step 1 — Playwright কনফিগারেশন।</strong>
      </p>

      <CodeBlock filename="playwright.config.ts">{`// 🟢 PRODUCTION PATTERN: a fully automated Playwright setup for Next.js
import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './e2e',
  fullyParallel: true,             // run specs in parallel across workers
  forbidOnly: !!process.env.CI,    // a stray test.only must fail the build
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: [['html', { open: 'never' }]],

  use: {
    baseURL: 'http://localhost:3000',
    trace: 'on-first-retry',       // record a trace file when a test fails
    screenshot: 'only-on-failure',
  },

  // the cross-browser matrix
  projects: [
    { name: 'chromium', use: { ...devices['Desktop Chrome'] } },
    { name: 'firefox',  use: { ...devices['Desktop Firefox'] } },
    { name: 'webkit',   use: { ...devices['Desktop Safari'] } },
  ],

  // 🟢 Playwright starts (and stops) the Next.js app itself
  webServer: {
    command: 'npm run build && npm run start',
    url: 'http://localhost:3000',
    reuseExistingServer: !process.env.CI,
    timeout: 120 * 1000,
  },
});`}</CodeBlock>

      <p>
        <strong>Step 2 — Page Object Model।</strong>
      </p>

      <CodeBlock filename="e2e/pages/CheckoutPage.ts">{`// 🟢 PRODUCTION PATTERN: every selector for this page lives in one class
import { type Page, type Locator, expect } from '@playwright/test';

export class CheckoutPage {
  readonly page: Page;
  readonly nameInput: Locator;
  readonly emailInput: Locator;
  readonly submitButton: Locator;
  readonly successHeading: Locator;

  constructor(page: Page) {
    this.page = page;

    // accessible, user-centric locators — the same priority order as RTL
    this.nameInput = page.getByLabel(/full name/i);
    this.emailInput = page.getByLabel(/email address/i);
    this.submitButton = page.getByRole('button', { name: /complete purchase/i });
    this.successHeading = page.getByRole('heading', { name: /order confirmed/i });
  }

  async goto() {
    await this.page.goto('/checkout');
  }

  async fillShippingDetails(name: string, email: string) {
    await this.nameInput.fill(name);
    await this.emailInput.fill(email);
  }

  async submitOrder() {
    await this.submitButton.click();
  }

  async verifyOrderSuccess() {
    // 🟢 a web-first assertion: it retries until it passes or times out
    await expect(this.successHeading).toBeVisible({ timeout: 10_000 });
    await expect(this.page).toHaveURL(/\\/checkout\\/success/);
  }
}`}</CodeBlock>

      <p>
        <strong>Step 3 — declarative E2E spec।</strong>
      </p>

      <CodeBlock filename="e2e/specs/checkout.spec.ts">{`// 🟢 PRODUCTION PATTERN: the spec reads as the user journey, not as selectors
import { test, expect } from '@playwright/test';
import { CheckoutPage } from '../pages/CheckoutPage';

test.describe('E2E: checkout & order flow', () => {
  test('completes an order end to end', async ({ page }) => {
    const checkoutPage = new CheckoutPage(page);

    await checkoutPage.goto();
    await checkoutPage.fillShippingDetails('Zubayer Salehin', 'zubayer@example.com');
    await checkoutPage.submitOrder();
    await checkoutPage.verifyOrderSuccess();
  });

  test('sends the correct payload to the checkout API', async ({ page }) => {
    const checkoutPage = new CheckoutPage(page);
    await checkoutPage.goto();

    // 🟢 start listening BEFORE the action that triggers the request
    const apiPromise = page.waitForRequest(
      (request) => request.url().includes('/api/checkout') && request.method() === 'POST',
    );

    await checkoutPage.fillShippingDetails('Arafat Rahman', 'arafat@example.com');
    await checkoutPage.submitOrder();

    const request = await apiPromise;
    const postData = JSON.parse(request.postData() || '{}');

    expect(postData.email).toBe('arafat@example.com');
  });
});`}</CodeBlock>

      {/* ── Matrix ────────────────────────────────────────────────────── */}
      <H2 id="matrix">৪. Playwright vs Cypress Architecture Matrix</H2>

      <Table
        head={["বৈশিষ্ট্য", "Playwright", "Cypress"]}
        rows={[
          [
            "ব্রাউজার ইঞ্জিন",
            "Chromium, Firefox, WebKit (Safari) 🟢",
            "Chrome, Edge, Firefox — WebKit সীমিত",
          ],
          [
            "Multi-tab ও multi-domain",
            "সম্পূর্ণ সাপোর্ট, একাধিক context 🟢",
            "অত্যন্ত সীমিত ও জটিল 🔴",
          ],
          [
            "এক্সিকিউশন আর্কিটেকচার",
            "Out-of-process, WebSocket প্রোটোকল 🟢",
            "In-browser JavaScript runner",
          ],
          [
            "Next.js ইন্টিগ্রেশন",
            "webServer অটোমেশন বিল্ট-ইন 🟢",
            "অতিরিক্ত কনফিগ প্রয়োজন",
          ],
          [
            "ডিবাগিং",
            "Trace Viewer — time-travel GUI 🟢",
            "Cypress time-travel dashboard",
          ],
        ]}
      />

      <Line name="ভুলু ভাই">
        অসাধারণ ফাহিম! এখন আর তিনটা ব্রাউজার ম্যানুয়ালি খুলতে হবে না — একটা কমান্ডেই সাইট বিল্ড হয়ে
        Chrome, Firefox আর Safari-তে একা একাই টেস্ট রান হয়ে রিপোর্ট চলে আসবে!
      </Line>

      {/* ── Takeaways ─────────────────────────────────────────────────── */}
      <H2 id="takeaway">Production Takeaways</H2>

      <Note>
        <ul>
          <li>
            <strong>Adopt the Page Object Model:</strong> নেভিগেশন ও সিলেক্টর লজিক আলাদা ক্লাসে রাখুন
            — spec ফাইল তখন ইউজার জার্নির গল্প হয়ে যায়, সিলেক্টরের স্তূপ নয়।
          </li>
          <li>
            <strong>Never use page.waitForTimeout():</strong> auto-waiting-এর ওপর ভরসা করুন এবং{" "}
            <code>getByRole</code> বা <code>getByLabel</code>-এর মতো অ্যাক্সেসিবল locator ব্যবহার
            করুন — XPath কখনো নয়।
          </li>
          <li>
            <strong>Keep traces in CI:</strong> GitHub Actions বা যেকোনো পাইপলাইনে টেস্ট ফেইল করলে
            Playwright trace artifact সেভ করে রাখুন — লোকালে রিপ্রোডিউস না করেই ডিবাগ করা যাবে।
          </li>
        </ul>
      </Note>
    </article>
  );
}
