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
      bn: "সিকিউরিটি বসাতেই টেস্ট ভাঙল",
      en: "Auth landed, the tests broke",
    },
  },
  {
    id: "architecture",
    label: {
      bn: "Session injection ফ্লো",
      en: "The session injection flow",
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
      bn: "storageState ও useSession মক",
      en: "storageState & mocking useSession",
    },
  },
  {
    id: "matrix",
    label: {
      bn: "কোন লেয়ারে কোন কৌশল",
      en: "Which strategy, which layer",
    },
  },
  {
    id: "takeaway",
    label: { bn: "Production Takeaways", en: "Production takeaways" },
  },
];

export default function AuthenticationFlowTesting() {
  return (
    <article className="doc-prose">
      {/* ── The problem ───────────────────────────────────────────────── */}
      <H2 id="the-problem" anchorOnly>
        সিকিউরিটি বসাতেই টেস্ট ভাঙল
      </H2>

      <p>
        বিকেল ৫:১০। ভুলু ভাই রাগে গিজগিজ করছেন। তিনি ড্যাশবোর্ড রাউটটি NextAuth (Auth.js) দিয়ে
        প্রটেক্ট করেছেন। কিন্তু এখন তার আগের লেখা সব Playwright আর RTL টেস্ট ফেইল করছে — প্রতিটা
        টেস্ট গিয়ে <code>/login</code> পেজে রিডাইরেক্ট হয়ে আটকে যাচ্ছে।
      </p>

      <Line name="ভুলু ভাই">
        ফাহিম! সিকিউরিটি বসাতে গিয়ে তো টেস্টিংয়ের বারোটা বেজে গেছে! এখন কি প্রতিটি টেস্টের আগে
        Playwright দিয়ে ইমেইল-পাসওয়ার্ড টাইপ করে লগইন করাতে হবে? টেস্ট রান হতে ৫ গুণ বেশি সময় লাগছে,
        আর বারবার থার্ড-পার্টি API রেট-লিমিট খেয়ে যাচ্ছি!
      </Line>

      <Line name="ফাহিম">
        ভুলু ভাই! প্রতিটি টেস্টের আগে UI দিয়ে ম্যানুয়ালি লগইন করানোটাই E2E টেস্টিংয়ের সবচেয়ে বড়
        অ্যান্টি-প্যাটার্ন! প্রফেশনাল অ্যাপ্রোচ হলো — <strong>লগইন টেস্ট করুন মাত্র একবার, আর বাকি সব
        টেস্টে সরাসরি অথেনটিকেটেড সেশন ইনজেক্ট করে দিন।</strong>
      </Line>

      <Line name="নেক্সট-ভাই">
        একদম! অথেনটিকেশন টেস্টিংয়ের দুটি স্তর আছে — <strong>(১)</strong> Unit/Component লেভেলে{" "}
        <code>useSession</code> বা <code>getServerSession</code> সরাসরি মক করে দেওয়া, আর{" "}
        <strong>(২)</strong> E2E লেভেলে একবার লগইন করে সেশন কুকি <code>storageState</code>-এ সেভ করে
        সব টেস্টে পুনরায় ব্যবহার করা।
      </Line>

      {/* ── Architecture ──────────────────────────────────────────────── */}
      <H2 id="architecture">১. Authentication &amp; Session Injection Flow</H2>

      <Diagram>{`┌─────────────────────────────────────────────────────────────────────────────┐
│                       PLAYWRIGHT GLOBAL AUTH FLOW                           │
└─────────────────────────────────────────────────────────────────────────────┘

 [global setup — runs once] ──► automate the UI login (type user & pass)
                                              │
                                              ▼
                             [save cookies + localStorage to JSON]
                                playwright/.auth/user.json
                                              │
 ┌────────────────────────────────────────────┴───────────────────────────────┐
 │                                                                            │
 ▼                                                                            ▼
[test 1: dashboard flow]                                  [test 2: settings flow]
 reads user.json                                           reads user.json
 the browser context starts authenticated                  the browser context starts authenticated
 goes straight to /dashboard  🟢                           goes straight to /settings  🟢`}</Diagram>

      {/* ── Mechanisms ────────────────────────────────────────────────── */}
      <H2 id="mechanisms">২. কোর আর্কিটেকচারাল কনসেপ্ট</H2>

      <p>
        <strong>Bypass the UI for auth:</strong> লগইন পেজের ফাংশনালিটির জন্য একটিমাত্র ডেডিকেটেড E2E
        টেস্ট রাখুন। প্রোফাইল এডিট বা পেমেন্টের মতো যেসব টেস্ট শুধু <em>অথেনটিকেটেড থাকা</em> দাবি
        করে, সেখানে লগইন স্টেপ বাইপাস করে সরাসরি কুকি ইনজেক্ট করুন।
      </p>

      <p>
        <strong>Playwright storageState:</strong> ব্রাউজারের কুকি ও লোকাল স্টোরেজ একটি JSON ফাইলে
        সেভ করে রাখা যায়। প্রতিটি টেস্ট রান হওয়ার সময় Playwright ফাইলটি লোড করে ব্রাউজারকে
        &ldquo;already logged in&rdquo; অবস্থায় খোলে।
      </p>

      <p>
        <strong>Mocking client hooks:</strong> RTL-এ টেস্ট করার সময় NextAuth-এর{" "}
        <code>SessionProvider</code> ও <code>useSession</code> hook Vitest দিয়ে মক করতে হয় — তাহলে
        কম্পোনেন্ট মনে করে ইউজার লগড-ইন আছে, আর logged-out স্টেটও এক লাইনে টেস্ট করা যায়।
      </p>

      <p>
        <strong>Testing route guards:</strong> আন-অথরাইজড ইউজার প্রটেক্টেড রাউটে (যেমন{" "}
        <code>/admin</code>) হিট করলে সঠিকভাবে <code>/login</code>-এ রিডাইরেক্ট হচ্ছে কি না — এটি
        আলাদা টেস্ট, আর এটিই আপনার সিকিউরিটি বাউন্ডারির একমাত্র প্রমাণ।
      </p>

      {/* ── Implementation ────────────────────────────────────────────── */}
      <H2 id="implementation">৩. Production Code Implementation</H2>

      <H3>❌ Anti-pattern — প্রতিটি টেস্টের আগে UI লগইন</H3>

      <CodeBlock filename="e2e/dashboard.bad.spec.ts">{`// 🔴 POOR PRACTICE: logging in through the UI before EVERY test
// Threat: painfully slow, and rate-limiters start returning 429.

import { test, expect } from '@playwright/test';

test.beforeEach(async ({ page }) => {
  // ❌ this slow UI automation repeats for all 50+ tests
  await page.goto('/login');
  await page.fill('input[name="email"]', 'admin@example.com');
  await page.fill('input[name="password"]', 'secret123');
  await page.click('button[type="submit"]');
  await expect(page).toHaveURL('/dashboard');
});

test('check dashboard metrics', async ({ page }) => {
  // finally, the thing we actually wanted to test
  await expect(page.getByText('Revenue')).toBeVisible();
});`}</CodeBlock>

      <H3>🟢 Production pattern 1 — একবার লগইন, storageState সেভ</H3>

      <p>
        <strong>Step 1 — setup স্ক্রিপ্ট যা একবারই চলে।</strong>
      </p>

      <CodeBlock filename="e2e/auth.setup.ts">{`// 🟢 PRODUCTION PATTERN: log in once, then save the session state
import { test as setup, expect } from '@playwright/test';
import path from 'path';

const authFile = path.join(__dirname, '../playwright/.auth/user.json');

setup('authenticate the user globally', async ({ page }) => {
  await page.goto('/login');
  await page.getByLabel('Email').fill('admin@example.com');
  await page.getByLabel('Password').fill('password123');
  await page.getByRole('button', { name: 'Sign in' }).click();

  // wait until the app itself confirms the login succeeded
  await expect(page).toHaveURL('/dashboard');

  // 🟢 persist cookies + localStorage for every later test to reuse
  await page.context().storageState({ path: authFile });
});`}</CodeBlock>

      <p>
        <strong>Step 2 — সেভ করা স্টেট সব টেস্টে প্রয়োগ।</strong>
      </p>

      <CodeBlock filename="playwright.config.ts">{`// 🟢 PRODUCTION PATTERN: a setup project that every other project depends on
import { defineConfig } from '@playwright/test';

export default defineConfig({
  projects: [
    // this project runs first and produces the auth file
    { name: 'setup', testMatch: /.*\\.setup\\.ts/ },

    {
      name: 'chromium',
      use: {
        browserName: 'chromium',
        // 🟢 every test in this project starts already authenticated
        storageState: 'playwright/.auth/user.json',
      },
      dependencies: ['setup'],
    },

    {
      // 🟢 a deliberately empty state, for testing the guards themselves
      name: 'chromium-anonymous',
      use: {
        browserName: 'chromium',
        storageState: { cookies: [], origins: [] },
      },
      testMatch: /.*\\.guard\\.spec\\.ts/,
    },
  ],
});`}</CodeBlock>

      <p>
        <strong>Step 3 — লগইন ধরে নেওয়া টেস্ট, আর guard-এর আলাদা টেস্ট।</strong>
      </p>

      <CodeBlock filename="e2e/dashboard.spec.ts">{`import { test, expect } from '@playwright/test';

// 🟢 no beforeEach login — the context is already authenticated
test('an admin can view the revenue metrics', async ({ page }) => {
  await page.goto('/dashboard');
  await expect(page.getByRole('heading', { name: 'Revenue Metrics' })).toBeVisible();
});`}</CodeBlock>

      <CodeBlock filename="e2e/admin.guard.spec.ts">{`// 🟢 runs in the anonymous project — proves the middleware actually blocks
import { test, expect } from '@playwright/test';

test('an anonymous visitor is redirected away from /admin', async ({ page }) => {
  await page.goto('/admin');

  await expect(page).toHaveURL(/\\/login/);
  await expect(page.getByRole('heading', { name: /sign in/i })).toBeVisible();
});`}</CodeBlock>

      <H3>🟢 Production pattern 2 — useSession মক করে কম্পোনেন্ট টেস্ট</H3>

      <CodeBlock filename="components/__tests__/Navbar.test.tsx">{`// 🟢 PRODUCTION PATTERN: mocking useSession for React Testing Library
import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { useSession } from 'next-auth/react';
import Navbar from '../Navbar';

vi.mock('next-auth/react');

describe('Navbar authentication states', () => {
  it('renders a Login button when unauthenticated', () => {
    vi.mocked(useSession).mockReturnValue({
      data: null,
      status: 'unauthenticated',
      update: vi.fn(),
    });

    render(<Navbar />);
    expect(screen.getByRole('button', { name: /login/i })).toBeInTheDocument();
  });

  it('renders the profile and a Logout button when authenticated', () => {
    vi.mocked(useSession).mockReturnValue({
      data: {
        user: { name: 'Zubayer Salehin', email: 'zubayer@example.com' },
        expires: '9999-12-31T23:59:59.999Z',
      },
      status: 'authenticated',
      update: vi.fn(),
    });

    render(<Navbar />);
    expect(screen.getByText('Welcome, Zubayer Salehin')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /logout/i })).toBeInTheDocument();
  });
});`}</CodeBlock>

      {/* ── Matrix ────────────────────────────────────────────────────── */}
      <H2 id="matrix">৪. Authentication Testing Strategy Matrix</H2>

      <Table
        head={["অ্যাপ্রোচ", "কখন ব্যবহার করবেন", "কার্যকারিতা"]}
        rows={[
          [
            "Component mocking (Vitest)",
            "Navbar, protected widget — useSession-নির্ভর কম্পোনেন্ট",
            "অত্যন্ত দ্রুত, কোনো নেটওয়ার্ক কল লাগে না 🟢",
          ],
          [
            "storageState injection",
            "ড্যাশবোর্ড, পেমেন্ট — প্রটেক্টেড রাউটের E2E ফ্লো",
            "বারবার UI লগইনের সময় বাঁচায়, রেট-লিমিট এড়ায় 🟢",
          ],
          [
            "Full UI login test",
            "লগইন ফর্ম ভ্যালিডেশন, ভুল পাসওয়ার্ড, OAuth রিডাইরেক্ট",
            "একটিমাত্র ফাইলে মূল লগইন ফ্লো নিশ্চিত করে",
          ],
          [
            "Route guard test",
            "আন-অথরাইজড ইউজার প্রটেক্টেড লিংকে গেলে কী হয়",
            "সিকিউরিটি বাউন্ডারির একমাত্র সরাসরি প্রমাণ 🟢",
          ],
        ]}
      />

      <Line name="ভুলু ভাই">
        ক্লিয়ার ফাহিম! <code>storageState</code> সেভ করে রাখায় টেস্টগুলো এখন চোখের পলকে এক্সিকিউট
        হচ্ছে, আর Vitest-এ <code>vi.mock()</code> দিয়ে ফেক সেশন ইনজেক্ট করায় কম্পোনেন্ট টেস্টও আগের
        মতো ফাটাফাট!
      </Line>

      {/* ── Takeaways ─────────────────────────────────────────────────── */}
      <H2 id="takeaway">Production Takeaways</H2>

      <Note>
        <ul>
          <li>
            <strong>Never log in via UI in every E2E test:</strong> একবার লগইন করে{" "}
            <code>storageState</code>-এ কুকি সেভ করুন, বাকি সব টেস্টে সেটিই রিইউজ করুন।
          </li>
          <li>
            <strong>Mock the auth context in Vitest:</strong> কম্পোনেন্ট টেস্টে{" "}
            <code>next-auth/react</code> মক করে authenticated ও unauthenticated — দুই স্টেটই কভার
            করুন।
          </li>
          <li>
            <strong>Test the guards separately:</strong> খালি কুকি (
            <code>storageState: {"{"} cookies: [], origins: [] {"}"}</code>) দিয়ে আলাদা প্রজেক্ট
            চালিয়ে প্রমাণ করুন middleware সত্যিই ব্লক করছে — নইলে সিকিউরিটি অনুমানমাত্র।
          </li>
        </ul>
      </Note>
    </article>
  );
}
