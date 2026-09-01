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
      bn: "৩০০ লাইনের God Component",
      en: "A 300-line god component",
    },
  },
  {
    id: "architecture",
    label: {
      bn: "তিন স্তরের দায়িত্ব",
      en: "Three layers of responsibility",
    },
  },
  {
    id: "mechanisms",
    label: {
      bn: "৩টি আর্কিটেকচারাল কনসেপ্ট",
      en: "Three architectural concepts",
    },
  },
  {
    id: "implementation",
    label: {
      bn: "CVA base UI ও compound component",
      en: "A CVA base UI & compound components",
    },
  },
  {
    id: "matrix",
    label: { bn: "প্যাটার্ন তুলনা", en: "The patterns compared" },
  },
  {
    id: "takeaway",
    label: { bn: "Production Takeaways", en: "Production takeaways" },
  },
];

export default function ComponentArchitecture() {
  return (
    <article className="doc-prose">
      {/* ── The problem ───────────────────────────────────────────────── */}
      <H2 id="the-problem" anchorOnly>
        ৩০০ লাইনের God Component
      </H2>

      <p>
        দুপুর ১২:০০। ডিজাইনার বললেন, &ldquo;সব প্রাইমারি বাটনে একটা লোডিং স্পিনার আর আইকন সাপোর্ট
        দাও।&rdquo; ভুলু ভাই <code>src/components/ui/Button.tsx</code> খুলতেই চোখ ছানাবড়া — ৩০০
        লাইনের কোড, যেখানে অ্যাকাউন্ট টাইপ অনুযায়ী props চেকিং, onClick হ্যান্ডলারের কাস্টম পার্সিং,
        অ্যানিমেশন লজিক আর ডাটাবেস API কলও ঢুকে গেছে।
      </p>

      <Line name="ভুলু ভাই">
        ফাহিম! একটা সিম্পল <code>Button</code> মডিফাই করতে গিয়ে অ্যাপের তিনটা পেজ ভেঙে গেল কেন? সামান্য
        আইকন বসাতে গিয়ে দেখি বাটনের ভেতরেই কার্ট লজিক লেখা!
      </Line>

      <Line name="ফাহিম">
        ভুলু ভাই! আপনি single responsibility ভেঙে একটি <em>god component</em> বানিয়ে ফেলেছেন। UI
        কম্পোনেন্টকে দায়িত্ব অনুযায়ী ভাগ করতে হয় — presentational আর container/smart-এর বাউন্ডারি
        আলাদা না রাখলে অ্যাপ বড় হওয়ার সাথে সাথে UI অচল হয়ে যায়।
      </Line>

      <Line name="নেক্সট-ভাই">
        একদম! স্কেলেবল component architecture-এর ভিত্তি চারটি জিনিস — composition over
        configuration, compound component pattern, atomic layering, আর CVA-ভিত্তিক টাইপ-সেফ ভ্যারিয়েন্ট।
      </Line>

      {/* ── Architecture ──────────────────────────────────────────────── */}
      <H2 id="architecture">১. Component Hierarchy &amp; Responsibilities</H2>

      <Diagram>{`┌─────────────────────────────────────────────────────────────────────────────┐
│                       COMPONENT ARCHITECTURE LAYERS                         │
└─────────────────────────────────────────────────────────────────────────────┘

  [ PAGE / ROUTE SHELL ]   ──► app/dashboard/page.tsx
           │                   data fetching, layout assembly, nothing else
           ▼
  [ CONTAINER / FEATURE ]  ──► features/sports/MatchContainer.tsx
           │                   state, hooks, business orchestration
           ▼
  [ DESIGN SYSTEM UI ]     ──► components/ui/button.tsx
                               pure Tailwind + Radix primitives
                               zero business logic, zero data access

  each layer may import downward, never upward`}</Diagram>

      {/* ── Mechanisms ────────────────────────────────────────────────── */}
      <H2 id="mechanisms">২. কোর আর্কিটেকচারাল কনসেপ্ট</H2>

      <p>
        <strong>Design system UI (dumb):</strong> <code>Button</code>, <code>Input</code>,{" "}
        <code>Dialog</code>, <code>Badge</code> — এরা শুধু props নিয়ে UI রেন্ডার করে। কোনো বিজনেস
        লজিক, API কল বা ফ্রেমওয়ার্ক স্টেট নেই। ফলে এগুলো যেকোনো ফিচারে বসিয়ে দেওয়া যায়।
      </p>

      <p>
        <strong>Feature containers (smart):</strong> <code>LiveBettingPanel</code>,{" "}
        <code>CheckoutCard</code> — এরা custom hook, server action আর base UI কম্পোনেন্টকে একত্রিত
        করে। বিজনেসের সব সিদ্ধান্ত এখানেই থাকে।
      </p>

      <p>
        <strong>Compound components:</strong> Modal, Accordion, Select, Tabs-এর মতো জটিল UI-কে
        একাধিক সাব-কম্পোনেন্টে ভাগ করা। শত শত boolean prop পাস করার বদলে ব্যবহারকারী নিজেই কাঠামো
        রচনা করে — এতে prop drilling শূন্যে নামে আর নমনীয়তা সর্বোচ্চ হয়।
      </p>

      {/* ── Implementation ────────────────────────────────────────────── */}
      <H2 id="implementation">৩. Production Code Implementation</H2>

      <H3>❌ Anti-pattern — মনোলিথিক god component</H3>

      <CodeBlock filename="src/components/ui/MonolithicButton.tsx">{`// 🔴 POOR PRACTICE: hardcoded variants and business logic inside base UI
import { useState } from 'react';

export function MonolithicButton({ type, onClick, text }: any) {
  const [loading, setLoading] = useState(false);

  // ❌ a checkout call inside a Button — every page that uses it now depends on it
  const handleClick = async () => {
    setLoading(true);
    if (type === 'checkout') {
      await fetch('/api/checkout', { method: 'POST' });
    }
    onClick?.();
    setLoading(false);
  };

  return (
    <button
      onClick={handleClick}
      // ❌ variants as ternaries: unreadable at three, unmaintainable at six
      className={\`px-4 py-2 \${type === 'primary' ? 'bg-blue-600' : 'bg-gray-200'}\`}
    >
      {loading ? 'Processing...' : text}
    </button>
  );
}`}</CodeBlock>

      <H3>🟢 Production pattern — CVA base UI + composition</H3>

      <p>
        <strong>Step 1 — টাইপ-সেফ ভ্যারিয়েন্ট সহ base UI।</strong>
      </p>

      <CodeBlock filename="src/components/ui/button.tsx">{`// 🟢 PRODUCTION PATTERN: polymorphic, variant-driven, entirely presentational
import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { Slot } from '@radix-ui/react-slot';
import { cn } from '@/lib/utils';

const buttonVariants = cva(
  'inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 disabled:pointer-events-none disabled:opacity-50',
  {
    variants: {
      variant: {
        default: 'bg-blue-600 text-white hover:bg-blue-700',
        destructive: 'bg-red-600 text-white hover:bg-red-700',
        outline: 'border border-slate-300 bg-transparent hover:bg-slate-100',
        ghost: 'hover:bg-slate-100 hover:text-slate-900',
      },
      size: {
        default: 'h-10 px-4 py-2',
        sm: 'h-8 px-3 text-xs',
        lg: 'h-12 px-8 text-base',
        icon: 'h-10 w-10',
      },
    },
    defaultVariants: { variant: 'default', size: 'default' },
  },
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  // 🟢 asChild lets a Link render with button styling — no duplicate component
  asChild?: boolean;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : 'button';

    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  },
);
Button.displayName = 'Button';`}</CodeBlock>

      <p>
        <strong>Step 2 — compound component দিয়ে কাঠামো।</strong>
      </p>

      <CodeBlock filename="src/components/ui/card.tsx">{`// 🟢 PRODUCTION PATTERN: composition instead of a dozen boolean props
import * as React from 'react';
import { cn } from '@/lib/utils';

export function Card({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn('rounded-xl border bg-card p-6 shadow-sm', className)} {...props} />;
}

export function CardHeader({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn('flex flex-col space-y-1.5 pb-4', className)} {...props} />;
}

export function CardTitle({ className, ...props }: React.HTMLAttributes<HTMLHeadingElement>) {
  return (
    <h3
      className={cn('text-xl font-semibold leading-none tracking-tight', className)}
      {...props}
    />
  );
}

export function CardContent({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn('pt-0', className)} {...props} />;
}`}</CodeBlock>

      <p>
        <strong>Step 3 — feature container সেগুলোকে একত্র করে।</strong>
      </p>

      <CodeBlock filename="src/features/checkout/components/CheckoutCard.tsx">{`// 🟢 PRODUCTION PATTERN: the smart layer — all the decisions live here
'use client';

import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useCheckout } from '../hooks/useCheckout';

export function CheckoutCard() {
  const { isPending, handleCheckout } = useCheckout();

  return (
    <Card className="max-w-md">
      <CardHeader>
        <CardTitle>Complete Payment</CardTitle>
      </CardHeader>

      <CardContent className="space-y-4">
        <p className="text-slate-600">Total BDT 1,500</p>

        <Button
          variant="default"
          size="lg"
          className="w-full"
          disabled={isPending}
          onClick={handleCheckout}
        >
          {isPending ? 'Processing...' : 'Pay Now'}
        </Button>
      </CardContent>
    </Card>
  );
}`}</CodeBlock>

      {/* ── Matrix ────────────────────────────────────────────────────── */}
      <H2 id="matrix">৪. Component Design Patterns</H2>

      <Table
        head={["ক্রাইটেরিয়া", "Monolithic (god)", "Compound", "Polymorphic (asChild)"]}
        rows={[
          ["নমনীয়তা", "অত্যন্ত কম 🔴", "অত্যন্ত বেশি 🟢", "সর্বোচ্চ — ট্যাগ ওভাররাইড 🟢"],
          ["Prop drilling", "অনেক বেশি 🔴", "শূন্য — children চালিত 🟢", "প্রযোজ্য নয়"],
          ["রক্ষণাবেক্ষণ", "খুব কঠিন 🔴", "সহজ 🟢", "সহজ 🟢"],
          [
            "উপযুক্ত ক্ষেত্র",
            "দ্রুত প্রোটোটাইপ",
            "Modal, dropdown, card, tabs",
            "Link-as-button, dynamic markup",
          ],
        ]}
      />

      <Line name="ভুলু ভাই">
        ক্লিয়ার ফাহিম! এখন <code>Button</code> শুধু বাটনই — কার্ট লজিক ফিচার কন্টেইনারে সরে গেছে।
        ডিজাইনারের নতুন ভ্যারিয়েন্ট চাইলেও এখন CVA-তে এক লাইন যোগ করলেই হয়ে যায়।
      </Line>

      {/* ── Takeaways ─────────────────────────────────────────────────── */}
      <H2 id="takeaway">Production Takeaways</H2>

      <Note>
        <ul>
          <li>
            <strong>Prefer composition over configuration:</strong> শত শত boolean prop (
            <code>hasHeader</code>, <code>isRed</code>) না দিয়ে compound component (
            <code>CardHeader</code>, <code>CardFooter</code>) ব্যবহার করুন।
          </li>
          <li>
            <strong>Use CVA for variants:</strong> Tailwind ক্লাস ternary দিয়ে না জোড়া লাগিয়ে{" "}
            <code>class-variance-authority</code> ব্যবহার করুন — ভ্যারিয়েন্ট তখন টাইপ-সেফ হয়।
          </li>
          <li>
            <strong>Keep components/ui/ pure:</strong> বেস UI কম্পোনেন্টে কখনো API কল, router logic
            বা business state ইমপোর্ট করবেন না — একবার ঢুকলে সেটি আর ডিজাইন সিস্টেম থাকে না।
          </li>
        </ul>
      </Note>
    </article>
  );
}
