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
    label: { bn: "এক .card, পঞ্চাশ জায়গায় ভাঙা", en: "One .card, fifty broken places" },
  },
  {
    id: "architecture",
    label: { bn: "Component scope আর্কিটেকচার", en: "Component scope architecture" },
  },
  {
    id: "mechanisms",
    label: { bn: "৩টি আর্কিটেকচারাল কনসেপ্ট", en: "Three architectural concepts" },
  },
  {
    id: "implementation",
    label: { bn: "CSS Modules ও CVA প্যাটার্ন", en: "CSS Modules & the CVA pattern" },
  },
  {
    id: "matrix",
    label: { bn: "Approach Matrix", en: "Approach matrix" },
  },
  {
    id: "takeaway",
    label: { bn: "Production Takeaways", en: "Production takeaways" },
  },
];

export default function ComponentLevelCss() {
  return (
    <article className="doc-prose">
      {/* ── The problem ───────────────────────────────────────────────── */}
      <H2 id="the-problem" anchorOnly>
        এক .card, পঞ্চাশ জায়গায় ভাঙা
      </H2>

      <p>
        রাতের নিস্তব্ধতা চিরে ভুলু ভাইয়ের চিৎকার — প্রোডাক্ট কার্ডের শ্যাডো আর ফন্ট সাইজ সম্পূর্ণ ভেঙে
        গেছে।
      </p>

      <Line name="ভুলু ভাই">
        ফাহিম! আমি শুধু পেমেন্ট পেজে একটা নতুন <code>.card</code> ডিভ স্টাইল করেছিলাম, আর পুরো সাইটের
        ৫০টি জায়গার <code>.card</code> কম্পোনেন্টের ডিজাইন তালগোল পাকিয়ে গেছে! CSS কি ভূতের মতো এক জায়গা
        থেকে আরেক জায়গায় লাফ মারছে?
      </Line>

      <Line name="ফাহিম">
        ভুলু ভাই! আপনি আবারও global CSS namespace collision-এর শিকার। সাধারণ CSS ফাইলে{" "}
        <code>.card</code> লিখলে সেটি গ্লোবাল স্কোপে চলে যায়, আর specificity ও লোডিং অর্ডারের ওপর ভিত্তি
        করে পুরো সাইটের <code>.card</code> এলিমেন্টকে ওভাররাইড করে দেয়।
      </Line>

      <Line name="নেক্সট-ভাই">
        একদম! বড় প্রজেক্টে এর একমাত্র উপায় Component-level CSS Architecture — প্রতিটি কম্পোনেন্টের
        স্টাইল সেই কম্পোনেন্টের ভেতরেই এনক্যাপসুলেটেড থাকবে, বাইরে এক ফোঁটাও লিক করবে না। CSS Modules,
        utility-first CSS এবং CVA — তিনটিই এই কাজ করে।
      </Line>

      {/* ── Architecture ──────────────────────────────────────────────── */}
      <H2 id="architecture">১. Component-level CSS Scope Architecture</H2>

      <Diagram>{`┌─────────────────────────────────────────────────────────────────────────┐
│                 COMPONENT-LEVEL CSS SCOPING ARCHITECTURE                │
└─────────────────────────────────────────────────────────────────────────┘

 ❌ GLOBAL SCOPE COLLISION (leaky CSS)
 [global.css]   ──► .card { padding: 20px; color: black; }
 [checkout.css] ──► .card { padding: 5px; color: red; } ──► overrides everywhere 💥

───────────────────────────────────────────────────────────────────────────

 🟢 COMPONENT-LEVEL SCOPED CSS (build-time unique hashing)

 ┌──────────────────────────────────┐   ┌──────────────────────────────────┐
 │ ProductCard.tsx                  │   │ PaymentCard.tsx                  │
 │ import styles from Card.module   │   │ import styles from Pay.module    │
 └────────────────┬─────────────────┘   └────────────────┬─────────────────┘
                  │ (build step: unique hash)             │ (build step: unique hash)
                  ▼                                       ▼
 ┌──────────────────────────────────┐   ┌──────────────────────────────────┐
 │ compiled: .Card_card__x89z1      │   │ compiled: .Pay_card__m27y3       │
 │ scoped to ProductCard only       │   │ scoped to PaymentCard only       │
 └──────────────────────────────────┘   └──────────────────────────────────┘`}</Diagram>

      {/* ── Mechanisms ────────────────────────────────────────────────── */}
      <H2 id="mechanisms">২. কোর আর্কিটেকচারাল কনসেপ্ট</H2>

      <p>
        <strong>Strict scoped encapsulation:</strong> গ্লোবাল নেমস্পেস দূষিত না করে প্রতিটি কম্পোনেন্টের
        স্টাইল আলাদা হ্যাশ (<code>.Button_btn__a3x8z</code>) দিয়ে আইসোলেট হয় — নাম এক হলেও কোনো
        সংঘাত ঘটে না।
      </p>

      <p>
        <strong>Zero-runtime vs runtime CSS-in-JS:</strong> styled-components বা emotion ব্রাউজারে
        রানটাইমে CSS জেনারেট করে পারফরম্যান্স খরচ বাড়ায়; CSS Modules বা Tailwind বিল্ড-টাইমে প্লেইন
        CSS-এ কম্পাইল হয়, ফলে রানটাইমে জিরো ওভারহেড।
      </p>

      <p>
        <strong>Variant-driven styling:</strong> ডাইনামিক প্রপস (<code>variant=&quot;primary&quot;</code>,{" "}
        <code>size=&quot;lg&quot;</code>) হ্যান্ডেল করতে জটিল কন্ডিশনাল CSS না লিখে টাইপ-সেফ CVA
        প্যাটার্ন ব্যবহার করাই আধুনিক স্ট্যান্ডার্ড।
      </p>

      {/* ── Implementation ────────────────────────────────────────────── */}
      <H2 id="implementation">৩. Production Code Implementation</H2>

      <H3>❌ Anti-pattern — a plain stylesheet imported into a component</H3>

      <CodeBlock filename="components/LeakyCard.tsx">{`// 🔴 POOR PRACTICE: importing a non-scoped stylesheet from a component
import './Card.css'; // ❌ global file — it pollutes the whole app

export const Card = ({ title }: { title: string }) => {
  // ❌ .card and .title can collide with any other component
  return (
    <div className="card">
      <h2 className="title">{title}</h2>
    </div>
  );
};`}</CodeBlock>

      <H3>🟢 Production pattern 1 — scoped CSS Modules</H3>

      <CodeBlock filename="components/Card/Card.module.css">{`.cardContainer {
  padding: 1.5rem;
  border-radius: 0.75rem;
  background-color: #ffffff;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
  transition: transform 0.2s ease-in-out;
}

.cardContainer:hover {
  transform: translateY(-2px);
}

.title {
  font-size: 1.25rem;
  font-weight: 700;
  color: #1a202c;
}`}</CodeBlock>

      <CodeBlock filename="components/Card/Card.tsx">{`import React from 'react';
import styles from './Card.module.css'; // 🟢 a fully scoped styles object

interface CardProps {
  title: string;
  children: React.ReactNode;
}

export const Card: React.FC<CardProps> = ({ title, children }) => {
  return (
    // 🟢 compiles to a unique hash, e.g. "Card_cardContainer__x89z1"
    <div className={styles.cardContainer}>
      <h2 className={styles.title}>{title}</h2>
      <div>{children}</div>
    </div>
  );
};`}</CodeBlock>

      <H3>🟢 Production pattern 2 — a scoped design system with CVA</H3>

      <CodeBlock filename="components/Button/Button.variants.ts">{`import { cva, type VariantProps } from 'class-variance-authority';

/** Type-safe variant management for component-level styling. */
export const buttonVariants = cva(
  'inline-flex items-center justify-center rounded-lg font-medium transition-colors focus:outline-none focus:ring-2 disabled:pointer-events-none disabled:opacity-50',
  {
    variants: {
      variant: {
        primary: 'bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500',
        secondary: 'bg-gray-100 text-gray-900 hover:bg-gray-200 focus:ring-gray-500',
        danger: 'bg-red-600 text-white hover:bg-red-700 focus:ring-red-500',
        outline: 'border border-gray-300 bg-transparent hover:bg-gray-50',
      },
      size: {
        sm: 'h-8 px-3 text-xs',
        md: 'h-10 px-4 text-sm',
        lg: 'h-12 px-6 text-base',
      },
    },
    defaultVariants: {
      variant: 'primary',
      size: 'md',
    },
  },
);

export type ButtonVariantProps = VariantProps<typeof buttonVariants>;`}</CodeBlock>

      <CodeBlock filename="components/Button/Button.tsx">{`import React from 'react';
import { cn } from '@/lib/utils/cn';
import { buttonVariants, type ButtonVariantProps } from './Button.variants';

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    ButtonVariantProps {}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(buttonVariants({ variant, size }), className)}
        {...props}
      />
    );
  },
);

Button.displayName = 'Button';`}</CodeBlock>

      {/* ── Matrix ────────────────────────────────────────────────────── */}
      <H2 id="matrix">৪. Component-level CSS Approach Matrix</H2>

      <Table
        head={["ক্রাইটেরিয়া", "Global CSS", "Runtime CSS-in-JS", "CSS Modules", "Utility + CVA"]}
        rows={[
          [
            "Namespace safety",
            "শূন্য 🔴",
            "১০০% সেফ 🟢",
            "১০০% সেফ (hashed) 🟢",
            "১০০% সেফ (atomic) 🟢",
          ],
          [
            "Runtime performance",
            "ফাস্ট 🟢",
            "স্লো (JS execution) 🔴",
            "ফাস্ট (build-time) 🟢",
            "সর্বোত্তম (purged) 🟢",
          ],
          [
            "Dynamic props scoping",
            "অত্যন্ত কঠিন 🔴",
            "খুব সহজ 🟢",
            "মাঝারি (class toggling) 🟡",
            "সহজ (CVA variants) 🟢",
          ],
          [
            "Maintainability",
            "স্প্যাগেটি 🔴",
            "বড় বান্ডল 🟡",
            "ক্লিন ও কো-লোকেটেড 🟢",
            "হাইলি স্কেলেবল 🟢",
          ],
        ]}
      />

      <Line name="ভুলু ভাই">
        অসাধারণ ফাহিম! CSS Modules-এর ইউনিক হ্যাশ আর CVA দিয়ে টাইপ-সেফ বাটন ভ্যারিয়েন্ট বানানোর পর আর
        কোনো পেজে স্টাইল কনফ্লিক্ট হচ্ছে না — সাইটের লুক অ্যান্ড ফিল এখন সলিড।
      </Line>

      {/* ── Takeaways ─────────────────────────────────────────────────── */}
      <H2 id="takeaway">Production Takeaways</H2>

      <Note>
        <ul>
          <li>
            <strong>Never import plain CSS in components:</strong> সাধারণ <code>.css</code> ফাইল
            কম্পোনেন্টে ইমপোর্ট করবেন না — <code>.module.css</code> বা utility architecture ব্যবহার
            করুন।
          </li>
          <li>
            <strong>Co-locate styles with components:</strong> কম্পোনেন্ট ও তার স্টাইল একই ডিরেক্টরিতে
            রাখুন (<code>Button/Button.tsx</code> ও <code>Button/Button.module.css</code>)।
          </li>
          <li>
            <strong>Prefer zero-runtime scoping:</strong> স্কেলেবল প্রোডাকশন অ্যাপে রানটাইম
            CSS-in-JS পরিহার করে CSS Modules বা Tailwind + CVA বেছে নিন।
          </li>
        </ul>
      </Note>
    </article>
  );
}
