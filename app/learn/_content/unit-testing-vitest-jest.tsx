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
      bn: "২ লাইনের চেঞ্জ, ভুল চার্জ",
      en: "Two lines changed, wrong charges",
    },
  },
  {
    id: "architecture",
    label: {
      bn: "Unit test-এর আইসোলেশন ফ্লো",
      en: "The unit test isolation flow",
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
      bn: "Vitest সেটআপ ও pricing test suite",
      en: "Vitest setup & a pricing test suite",
    },
  },
  {
    id: "matrix",
    label: { bn: "Vitest vs Jest", en: "Vitest vs Jest" },
  },
  {
    id: "takeaway",
    label: { bn: "Production Takeaways", en: "Production takeaways" },
  },
];

export default function UnitTestingVitestJest() {
  return (
    <article className="doc-prose">
      {/* ── The problem ───────────────────────────────────────────────── */}
      <H2 id="the-problem" anchorOnly>
        ২ লাইনের চেঞ্জ, ভুল চার্জ
      </H2>

      <p>
        রাত ১:১৫। ভুলু ভাই ল্যাপটপের সামনে হতাশ হয়ে বসে আছেন। পেমেন্ট গেটওয়ের ডিসকাউন্ট
        ক্যালকুলেশনের একটি ছোট ইউটিলিটি ফাংশনে তিনি ২ লাইনের কোড চেঞ্জ করেছিলেন। কিন্তু ওই ছোট
        পরিবর্তনের ফলে চেকআউটে টোটাল প্রাইস আর ট্যাক্স ভুল হিসেব দেখাচ্ছে — ইউজারদের কাছ থেকে ভুল
        অ্যামাউন্ট চার্জ হয়ে গেছে!
      </p>

      <Line name="ভুলু ভাই">
        ফাহিম! একটা ছোট প্রাইসিং আর ডিসকাউন্ট ক্যালকুলেশন ফাংশন টেস্ট করার জন্য কি আমাকে বারবার পুরো
        Next.js সাইট রান করে চেকআউট পেজে গিয়ে ফর্ম ফিলাপ করতে হবে? ১ লাইনের লজিক চেঞ্জ ঠিক আছে কি না
        তা ১ সেকেন্ডে জানার কোনো উপায় নেই?
      </Line>

      <Line name="ফাহিম">
        ভুলু ভাই! সাইট না চালিয়ে অ্যালগরিদম বা পিওর ফাংশন টেস্ট করাই হলো Unit Testing-এর কাজ!
        অ্যাপ্লিকেশনের কোর বিজনেস লজিক, ডাটা ফরম্যাটিং বা ক্যালকুলেশন ইউটিলিটিগুলোকে সম্পূর্ণ
        আইসোলেটেড রেখে মিলিসেকেন্ডের মধ্যে টেস্ট করাই ইউনিট টেস্টিংয়ের মূল লক্ষ্য।
      </Line>

      <Line name="নেক্সট-ভাই">
        একদম! আর Next.js এবং মডার্ন অ্যাপ্লিকেশনের জন্য <code>Vitest</code> হলো অতি দ্রুতগামী ইউনিট
        টেস্টিং ফ্রেমওয়ার্ক। Vite ও ESM-এর নেটিভ সাপোর্টের কারণে Vitest-এ টেস্ট রান হতে Jest-এর
        চেয়ে অনেক কম সময় লাগে, আর TypeScript আউট-অফ-দ্য-বক্স কাজ করে!
      </Line>

      {/* ── Architecture ──────────────────────────────────────────────── */}
      <H2 id="architecture">১. Unit Testing Execution &amp; Isolation Flow</H2>

      <Diagram>{`┌─────────────────────────────────────────────────────────────────────────────┐
│                          UNIT TESTING ISOLATION FLOW                        │
└─────────────────────────────────────────────────────────────────────────────┘

 [Pure Input Data]  ──►  ┌───────────────────────────────────────────────┐
                         │  Isolated Function / Utility (calculateTax)   │
                         └───────────────────────┬───────────────────────┘
                                                 │
                                                 ▼
 [Assertions / Expectation]  ───►  expect(result).toBe(expectedOutput)
                                                 │
                                                 ├── 🟢 PASS  (execution time: 3ms)
                                                 └── ❌ FAIL  (regression detected!)

 no database · no network · no browser DOM — only input in, output out`}</Diagram>

      {/* ── Mechanisms ────────────────────────────────────────────────── */}
      <H2 id="mechanisms">২. কোর আর্কিটেকচারাল কনসেপ্ট</H2>

      <p>
        <strong>Deterministic &amp; pure testing:</strong> ইউনিট টেস্টে কোনো ডাটাবেস, নেটওয়ার্ক বা
        ব্রাউজার DOM থাকে না। একটি নির্দিষ্ট ইনপুটের জন্য ফাংশনটি সর্বদা একই আউটপুট দিচ্ছে কি না
        (deterministic output) — সেটাই পরীক্ষা করা হয়।
      </p>

      <p>
        <strong>Vitest vs Jest:</strong> Jest ইন্ডাস্ট্রি স্ট্যান্ডার্ড হলেও ভারী ট্রান্সপাইলেশন
        (Babel/SWC) এবং ধীরগতির ওয়াচ মোডের কারণে কিছুটা স্লো। Vitest সরাসরি Vite ট্রান্সফরমার ব্যবহার
        করে — কোনো ট্রান্সপাইলেশন কনফিগ ছাড়াই TypeScript ও JSX হ্যান্ডেল করে, আর এর ওয়াচ মোড HMR-এর
        মতো ইনস্ট্যান্ট।
      </p>

      <p>
        <strong>Mocks, spies &amp; stubs:</strong> ফাংশনের ভেতরে কোনো এক্সটার্নাল ডিপেনডেন্সি (API
        call, <code>Date.now()</code>) থাকলে আসল কল না করে <code>vi.fn()</code> বা{" "}
        <code>vi.spyOn()</code> দিয়ে মক ডাটা দিয়ে রিপ্লেস করা হয় — তাহলেই টেস্ট deterministic থাকে।
      </p>

      <p>
        <strong>Parameterized testing:</strong> <code>it.each()</code> দিয়ে একই টেস্ট লজিক দিয়ে
        একাধিক ইনপুট ও এজ কেস (negative number, zero, null) একসাথে টেস্ট করা যায় — কপি-পেস্ট করা
        টেস্ট ব্লকের বদলে একটি টেবিল।
      </p>

      {/* ── Implementation ────────────────────────────────────────────── */}
      <H2 id="implementation">৩. Production Code Implementation</H2>

      <H3>❌ Anti-pattern — UI রেন্ডার করে console.log দিয়ে টেস্ট</H3>

      <CodeBlock filename="components/CheckoutComponent.tsx">{`// 🔴 POOR PRACTICE: testing pure business math inside a UI component
// Threat: extremely slow, not automated, and edge cases break unnoticed.

export function CheckoutComponent({ cartItems }: { cartItems: any[] }) {
  // ❌ business logic mixed into the UI — nothing here can be unit tested
  const discount = cartItems.reduce((acc, item) => acc + item.price, 0) * 0.1;
  console.log('Testing Discount:', discount); // ❌ a manual testing attempt

  return <div>Total Discount: {discount}</div>;
}`}</CodeBlock>

      <H3>🟢 Production pattern — Vitest দিয়ে edge-case কভারেজ</H3>

      <p>
        <strong>Step 1 — Vitest কনফিগারেশন।</strong>
      </p>

      <CodeBlock filename="vitest.config.ts">{`// 🟢 PRODUCTION PATTERN: a fast, clean Vitest setup
import { defineConfig } from 'vitest/config';
import tsconfigPaths from 'vite-tsconfig-paths';

export default defineConfig({
  plugins: [tsconfigPaths()], // respects the Next.js '@/' path aliases

  test: {
    environment: 'node', // ultra-fast node env — pure logic needs no DOM
    globals: true,       // describe / it / expect without explicit imports

    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
    },
  },
});`}</CodeBlock>

      <p>
        <strong>Step 2 — পিওর বিজনেস লজিক UI থেকে আলাদা করা।</strong>
      </p>

      <CodeBlock filename="lib/pricing.ts">{`// 🟢 PRODUCTION PATTERN: pure, decoupled, testable business logic

export interface CartItem {
  id: string;
  price: number;
  quantity: number;
}

export interface DiscountCoupon {
  code: string;
  percentage: number;
  minAmount: number;
}

export function calculateOrderTotal(
  items: CartItem[],
  coupon?: DiscountCoupon | null,
  taxRate: number = 0.05,
): { subtotal: number; discount: number; tax: number; total: number } {
  if (!items || items.length === 0) {
    return { subtotal: 0, discount: 0, tax: 0, total: 0 };
  }

  const subtotal = items.reduce((acc, item) => {
    if (item.price < 0 || item.quantity < 0) {
      throw new Error('Price and quantity must be non-negative');
    }
    return acc + item.price * item.quantity;
  }, 0);

  let discount = 0;
  if (coupon && subtotal >= coupon.minAmount) {
    discount = (subtotal * coupon.percentage) / 100;
  }

  const taxableAmount = Math.max(0, subtotal - discount);
  const tax = Number((taxableAmount * taxRate).toFixed(2));
  const total = Number((taxableAmount + tax).toFixed(2));

  return { subtotal, discount, tax, total };
}`}</CodeBlock>

      <p>
        <strong>Step 3 — high-coverage টেস্ট suite।</strong>
      </p>

      <CodeBlock filename="lib/__tests__/pricing.test.ts">{`// 🟢 PRODUCTION PATTERN: a comprehensive unit test suite with Vitest
import { describe, it, expect } from 'vitest';
import { calculateOrderTotal, type CartItem, type DiscountCoupon } from '../pricing';

describe('Pricing utility — calculateOrderTotal()', () => {
  const mockItems: CartItem[] = [
    { id: 'p1', price: 100, quantity: 2 }, // 200
    { id: 'p2', price: 50, quantity: 1 },  //  50
  ]; // subtotal = 250

  it('returns zeroed totals when the cart is empty', () => {
    const result = calculateOrderTotal([]);
    expect(result).toEqual({ subtotal: 0, discount: 0, tax: 0, total: 0 });
  });

  it('calculates subtotal and tax correctly without a coupon', () => {
    const result = calculateOrderTotal(mockItems, null, 0.1); // 10% tax

    expect(result.subtotal).toBe(250);
    expect(result.discount).toBe(0);
    expect(result.tax).toBe(25);
    expect(result.total).toBe(275);
  });

  it('applies the discount once the subtotal meets the coupon minimum', () => {
    const validCoupon: DiscountCoupon = { code: 'SAVE20', percentage: 20, minAmount: 200 };
    const result = calculateOrderTotal(mockItems, validCoupon, 0.05);

    expect(result.subtotal).toBe(250);
    expect(result.discount).toBe(50); // 20% of 250
    expect(result.tax).toBe(10);      //  5% of (250 - 50)
    expect(result.total).toBe(210);
  });

  // 🟢 parameterized boundary and edge-case coverage
  it.each([
    { price: -10, quantity: 1 },
    { price: 10, quantity: -2 },
  ])('throws on invalid numbers: price $price, qty $quantity', ({ price, quantity }) => {
    const invalidItems = [{ id: 'err', price, quantity }];

    expect(() => calculateOrderTotal(invalidItems)).toThrowError(
      'Price and quantity must be non-negative',
    );
  });
});`}</CodeBlock>

      {/* ── Matrix ────────────────────────────────────────────────────── */}
      <H2 id="matrix">৪. Vitest vs Jest Comparison Matrix</H2>

      <Table
        head={["বৈশিষ্ট্য", "Vitest", "Jest"]}
        rows={[
          [
            "এক্সিকিউশন স্পিড",
            "অত্যন্ত দ্রুত, Vite/ESM চালিত 🟢",
            "তুলনামূলক স্লো — transform overhead 🔴",
          ],
          [
            "TypeScript সাপোর্ট",
            "জিরো কনফিগে কাজ করে 🟢",
            "ts-jest বা babel-jest কনফিগ লাগে 🔴",
          ],
          [
            "Watch mode",
            "ইনস্ট্যান্ট, HMR-এর মতো ফিডব্যাক 🟢",
            "মাঝারি স্পিড",
          ],
          [
            "Next.js ইকোসিস্টেম",
            "আধুনিক Vite/Next প্রজেক্টে পপুলার 🟢",
            "ঐতিহ্যবাহী স্ট্যান্ডার্ড",
          ],
          [
            "API সারফেস",
            "Jest-compatible — মাইগ্রেশন সহজ",
            "ইন্ডাস্ট্রির রেফারেন্স API",
          ],
        ]}
      />

      <Line name="ভুলু ভাই">
        এখন পুরো বিষয় পানির মতো পরিষ্কার ফাহিম! ইউটিলিটি ফাংশনগুলোকে UI থেকে আলাদা করে Vitest দিয়ে
        টেস্ট করলে এক সেকেন্ডেই জানা যাবে আমার ২ লাইনের চেঞ্জ কিছু ভেঙেছে কি না!
      </Line>

      {/* ── Takeaways ─────────────────────────────────────────────────── */}
      <H2 id="takeaway">Production Takeaways</H2>

      <Note>
        <ul>
          <li>
            <strong>Isolate logic from UI:</strong> বিজনেসের মূল গাণিতিক লজিক ও স্টেট
            ট্রান্সফরমেশনগুলো UI কম্পোনেন্ট থেকে আলাদা ফাংশনে রাখুন — তবেই সেগুলো এক মিলিসেকেন্ডে
            ইউনিট টেস্ট করা যায়।
          </li>
          <li>
            <strong>Cover edge cases with it.each:</strong> শুধু happy path নয় — negative input,
            null আর boundary value টেস্টের আওতায় আনুন, একটি টেবিল-চালিত টেস্ট দিয়ে।
          </li>
          <li>
            <strong>Run unit tests in pre-commit hooks:</strong> <code>husky</code> বা{" "}
            <code>lint-staged</code> দিয়ে প্রতিটি git commit-এর আগে Vitest রান করে রিগ্রেশন
            সম্পূর্ণ বন্ধ করুন।
          </li>
        </ul>
      </Note>
    </article>
  );
}
