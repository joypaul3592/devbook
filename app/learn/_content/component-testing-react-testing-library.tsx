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
      bn: "ইন্টারনাল state ধরে টেস্ট করা যাচ্ছে না",
      en: "Internal state is not testable",
    },
  },
  {
    id: "architecture",
    label: {
      bn: "RTL-এর user event ফ্লো",
      en: "The RTL user-event flow",
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
      bn: "RTL সেটআপ ও AddToCart test suite",
      en: "RTL setup & an AddToCart suite",
    },
  },
  {
    id: "matrix",
    label: {
      bn: "Query প্রায়োরিটি ম্যাট্রিক্স",
      en: "The query priority matrix",
    },
  },
  {
    id: "takeaway",
    label: { bn: "Production Takeaways", en: "Production takeaways" },
  },
];

export default function ComponentTestingReactTestingLibrary() {
  return (
    <article className="doc-prose">
      {/* ── The problem ───────────────────────────────────────────────── */}
      <H2 id="the-problem" anchorOnly>
        ইন্টারনাল state ধরে টেস্ট করা যাচ্ছে না
      </H2>

      <p>
        বিকেল ৪:১৫। ভুলু ভাই একটি ইন্টারঅ্যাক্টিভ Add-to-Cart উইজেটের কম্পোনেন্ট টেস্ট লিখছেন। কিন্তু
        তিনি বারবার কম্পোনেন্টের ভেতরের প্রাইভেট স্টেট <code>isSubmitting</code> বা{" "}
        <code>quantity</code> সরাসরি চেক করার চেষ্টা করছেন — আর টেস্ট ফেইল হলে হতাশ হয়ে মাথা
        চুলকাচ্ছেন।
      </p>

      <Line name="ভুলু ভাই">
        ফাহিম! আমি তো কম্পোনেন্টের ভেতর <code>const [quantity, setQuantity] = useState(1)</code>{" "}
        লিখেছি। কিন্তু টেস্টে এই <code>quantity</code> স্টেটের ভ্যালু খুঁজে পাচ্ছি না কেন? ইন্টারনাল
        স্টেট আর মেথডগুলো ধরে টেস্ট করা যাচ্ছে না কেন?
      </Line>

      <Line name="ফাহিম">
        ভুলু ভাই! আপনি Enzyme-এর যুগের &ldquo;implementation detail testing&rdquo; চিন্তাধারা নিয়ে
        পড়ে আছেন! React Testing Library-র মূল ফিলোসফি হলো — <em>the more your tests resemble the
        way your software is used, the more confidence they can give you</em>।
      </Line>

      <Line name="নেক্সট-ভাই">
        একদম! একজন রিয়েল ইউজার কখনো আপনার <code>useState</code> বা props-এর নাম দেখে না। ইউজার দেখে
        ব্রাউজারে একটা &ldquo;Add to Cart&rdquo; বাটন আছে কি না, সংখ্যা বাড়ানো যায় কি না, আর ক্লিক
        করলে স্ক্রিনে &ldquo;Item Added!&rdquo; ভেসে ওঠে কি না। RTL দিয়ে আমরা ইউজারের দৃষ্টিতেই টেস্ট
        করি।
      </Line>

      {/* ── Architecture ──────────────────────────────────────────────── */}
      <H2 id="architecture">১. Component Testing &amp; User Event Flow</H2>

      <Diagram>{`┌─────────────────────────────────────────────────────────────────────────────┐
│                      COMPONENT TESTING EXECUTION FLOW                       │
└─────────────────────────────────────────────────────────────────────────────┘

 [React Component]  ──►  ┌───────────────────────────────────────────────┐
                         │   Render in a virtual DOM (jsdom via Vitest)  │
                         └───────────────────────┬───────────────────────┘
                                                 │
                                                 ▼
 [Accessibility query] ─►  screen.getByRole('button', { name: /add/i })
                                                 │
                                                 ▼
 [Simulate a real user] ─►  await user.click(addToCartButton)
                                                 │
                                                 ▼
 [DOM assertion]       ─►  expect(screen.getByText(/item added/i)).toBeInTheDocument()

 nothing here touches useState, props, or a CSS class name`}</Diagram>

      {/* ── Mechanisms ────────────────────────────────────────────────── */}
      <H2 id="mechanisms">২. কোর আর্কিটেকচারাল কনসেপ্ট</H2>

      <p>
        <strong>Avoid implementation details:</strong> কম্পোনেন্টের ভেতরে স্টেটের নাম বদলালে বা
        রিফ্যাক্টর করলে ইউজার এক্সপেরিয়েন্স একই থাকা সত্ত্বেও যদি টেস্ট ফেইল করে, তবে সেটা খারাপ
        টেস্ট। RTL ইচ্ছে করেই ইন্টারনাল state-এ পৌঁছানোর কোনো API দেয় না।
      </p>

      <p>
        <strong>Accessibility-first queries:</strong> এলিমেন্ট খোঁজার একটি সুনির্দিষ্ট প্রায়োরিটি
        আছে — প্রথমে <code>getByRole</code>, তারপর <code>getByLabelText</code>, তারপর{" "}
        <code>getByText</code>, আর একেবারে শেষ উপায় <code>getByTestId</code>।
      </p>

      <p>
        <strong>userEvent vs fireEvent:</strong> <code>fireEvent</code> সরাসরি সিন্থেটিক ইভেন্ট ফায়ার
        করে, যা বাস্তবসম্মত নয়। <code>@testing-library/user-event</code> রিয়েল ব্রাউজার ইউজারের মতো
        pointer movement, focus, keyboard press ও টাইপিং হুবহু সিমুলেট করে — তাই এটি async।
      </p>

      <p>
        <strong>Mocking Next.js navigation:</strong> ক্লায়েন্ট কম্পোনেন্টে <code>useRouter</code> বা{" "}
        <code>useSearchParams</code> থাকলে jsdom-এ সেগুলো রান করবে না — Vitest দিয়ে{" "}
        <code>next/navigation</code> মক করে নিতে হয়।
      </p>

      {/* ── Implementation ────────────────────────────────────────────── */}
      <H2 id="implementation">৩. Production Code Implementation</H2>

      <H3>❌ Anti-pattern — CSS class ধরে query, internal state assert</H3>

      <CodeBlock filename="components/__tests__/AddToCart.bad.test.tsx">{`// 🔴 POOR PRACTICE: testing CSS classes and implementation details
// Threat: renaming a class breaks the test even though the UI works perfectly.

import { render, fireEvent } from '@testing-library/react';
import { AddToCart } from '../AddToCart';

test('bad component test', () => {
  const { container } = render(<AddToCart productId="123" />);

  // ❌ a fragile CSS class selector — invisible to the user, brittle to refactors
  const button = container.querySelector('.btn-primary-v2');

  // ❌ synthetic fireEvent skips real focus and keydown behaviour
  fireEvent.click(button!);

  // ❌ asserting on class names, not on what the user actually sees
  expect(button?.classList.contains('active')).toBe(true);
});`}</CodeBlock>

      <H3>🟢 Production pattern — accessible queries + userEvent</H3>

      <p>
        <strong>Step 1 — গ্লোবাল টেস্ট সেটআপ।</strong>
      </p>

      <CodeBlock filename="vitest.setup.ts">{`// 🟢 PRODUCTION PATTERN: global setup for DOM matchers and router mocks
import '@testing-library/jest-dom/vitest';
import { cleanup } from '@testing-library/react';
import { afterEach, vi } from 'vitest';

// unmount and clean the DOM after every test, so state never leaks across tests
afterEach(() => {
  cleanup();
});

// mock Next.js navigation once, globally, for every component that uses it
vi.mock('next/navigation', () => ({
  useRouter: () => ({
    push: vi.fn(),
    replace: vi.fn(),
    prefetch: vi.fn(),
  }),
  useSearchParams: () => new URLSearchParams(),
  usePathname: () => '/',
}));`}</CodeBlock>

      <p>
        <strong>Step 2 — অ্যাক্সেসিবল ক্লায়েন্ট কম্পোনেন্ট।</strong>
      </p>

      <CodeBlock filename="components/AddToCartForm.tsx">{`// 🟢 PRODUCTION PATTERN: an accessible client component with real states
'use client';

import React, { useState } from 'react';

interface AddToCartProps {
  productName: string;
  maxStock: number;
  onAddToCart: (quantity: number) => Promise<void>;
}

export function AddToCartForm({ productName, maxStock, onAddToCart }: AddToCartProps) {
  const [quantity, setQuantity] = useState(1);
  const [isAdding, setIsAdding] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  const handleIncrement = () => {
    if (quantity < maxStock) setQuantity((prev) => prev + 1);
  };

  const handleDecrement = () => {
    if (quantity > 1) setQuantity((prev) => prev - 1);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsAdding(true);
    setSuccessMessage('');

    try {
      await onAddToCart(quantity);
      setSuccessMessage(\`Successfully added \${quantity} \${productName} to cart!\`);
    } finally {
      setIsAdding(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} aria-label="Add to cart form">
      <h3>{productName}</h3>

      <div role="group" aria-label="Quantity selector">
        <button
          type="button"
          onClick={handleDecrement}
          aria-label="Decrease quantity"
          disabled={quantity <= 1 || isAdding}
        >
          -
        </button>

        {/* 🟢 an accessible name makes this readable to both users and tests */}
        <span aria-live="polite" aria-label="Current quantity">{quantity}</span>

        <button
          type="button"
          onClick={handleIncrement}
          aria-label="Increase quantity"
          disabled={quantity >= maxStock || isAdding}
        >
          +
        </button>
      </div>

      <button type="submit" disabled={isAdding}>
        {isAdding ? 'Adding...' : 'Add to Cart'}
      </button>

      {successMessage && <p role="status">{successMessage}</p>}
    </form>
  );
}`}</CodeBlock>

      <p>
        <strong>Step 3 — রোবাস্ট RTL টেস্ট suite।</strong>
      </p>

      <CodeBlock filename="components/__tests__/AddToCartForm.test.tsx">{`// 🟢 PRODUCTION PATTERN: a robust, accessibility-driven component suite
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi } from 'vitest';
import { AddToCartForm } from '../AddToCartForm';

describe('Component: AddToCartForm', () => {
  const defaultProps = {
    productName: 'Wireless Headphones',
    maxStock: 3,
    onAddToCart: vi.fn().mockResolvedValue(undefined),
  };

  it('renders correctly in its default state', () => {
    render(<AddToCartForm {...defaultProps} />);

    expect(screen.getByRole('heading', { name: /wireless headphones/i })).toBeInTheDocument();
    expect(screen.getByLabelText('Current quantity')).toHaveTextContent('1');
    expect(screen.getByRole('button', { name: /add to cart/i })).toBeEnabled();
  });

  it('increments and decrements quantity within the stock limit', async () => {
    const user = userEvent.setup();
    render(<AddToCartForm {...defaultProps} />);

    const incrementBtn = screen.getByRole('button', { name: /increase quantity/i });
    const decrementBtn = screen.getByRole('button', { name: /decrease quantity/i });
    const qtyDisplay = screen.getByLabelText('Current quantity');

    await user.click(incrementBtn);
    expect(qtyDisplay).toHaveTextContent('2');

    await user.click(incrementBtn);
    expect(qtyDisplay).toHaveTextContent('3');

    // 🟢 the boundary itself is part of the contract
    expect(incrementBtn).toBeDisabled();

    await user.click(decrementBtn);
    expect(qtyDisplay).toHaveTextContent('2');
  });

  it('submits the selected quantity and announces success', async () => {
    const user = userEvent.setup();
    const mockOnAddToCart = vi.fn().mockResolvedValue(undefined);

    render(<AddToCartForm {...defaultProps} onAddToCart={mockOnAddToCart} />);

    await user.click(screen.getByRole('button', { name: /increase quantity/i }));
    await user.click(screen.getByRole('button', { name: /add to cart/i }));

    expect(mockOnAddToCart).toHaveBeenCalledWith(2);

    // findByRole waits for the async state update — no arbitrary timeout needed
    const statusMsg = await screen.findByRole('status');
    expect(statusMsg).toHaveTextContent('Successfully added 2 Wireless Headphones to cart!');
  });
});`}</CodeBlock>

      {/* ── Matrix ────────────────────────────────────────────────────── */}
      <H2 id="matrix">৪. Query Selection Priority Matrix</H2>

      <Table
        head={["প্রায়োরিটি", "RTL query", "উপযুক্ত ক্ষেত্র"]}
        rows={[
          [
            "১ম পছন্দ",
            <code key="role">getByRole</code>,
            "বাটন, হেডিং, লিংক, ডায়ালগ — যেকোনো সিমান্টিক এলিমেন্ট 🟢",
          ],
          [
            "২য় পছন্দ",
            <code key="label">getByLabelText</code>,
            "ফর্ম ইনপুট ফিল্ড ও চেকবক্স 🟢",
          ],
          [
            "৩য় পছন্দ",
            <code key="ph">getByPlaceholderText</code>,
            "লেবেল ছাড়া ইনপুট ফিল্ড থাকলে",
          ],
          [
            "৪র্থ পছন্দ",
            <code key="text">getByText</code>,
            "সাধারণ টেক্সট ও প্যারাগ্রাফ ভ্যালিডেশন",
          ],
          [
            "সর্বশেষ বিকল্প",
            <code key="tid">getByTestId</code>,
            "কোনো রোল বা টেক্সট না থাকলে — data-testid 🔴",
          ],
        ]}
      />

      <Line name="ভুলু ভাই">
        এখন একদম ক্লিয়ার ফাহিম! <code>getByRole</code> আর <code>userEvent</code> দিয়ে টেস্ট লিখলে কোড
        রিফ্যাক্টর করলেও টেস্ট ভাঙবে না, আর আসল ইউজারের অভিজ্ঞতাটাই পরীক্ষা হবে!
      </Line>

      {/* ── Takeaways ─────────────────────────────────────────────────── */}
      <H2 id="takeaway">Production Takeaways</H2>

      <Note>
        <ul>
          <li>
            <strong>Think like a user:</strong> টেস্টে কখনো ইন্টারনাল স্টেট বা ক্লাসের নাম চেক করবেন
            না — ইউজার স্ক্রিনে কী দেখছে ও কিসে ক্লিক করছে, সেটাই টেস্ট করুন।
          </li>
          <li>
            <strong>Use userEvent over fireEvent:</strong> সবসময় <code>userEvent.setup()</code>{" "}
            দিয়ে ইন্টারঅ্যাকশন সিমুলেট করুন — এটি typing, focus আর ব্রাউজার ইভেন্ট নিখুঁতভাবে হ্যান্ডেল
            করে।
          </li>
          <li>
            <strong>Assert accessibility roles:</strong> <code>getByRole</code> ব্যবহার করলে
            কম্পোনেন্ট স্ক্রিন রিডারের জন্য কতটা উপযোগী, সেটাও টেস্টের মাধ্যমেই নিশ্চিত হয়ে যায়।
          </li>
        </ul>
      </Note>
    </article>
  );
}
