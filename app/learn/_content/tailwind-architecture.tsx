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
    label: { bn: "className-এর জঙ্গল", en: "A jungle of classNames" },
  },
  {
    id: "architecture",
    label: { bn: "JIT scanner ও build pipeline", en: "The JIT scanner & build pipeline" },
  },
  {
    id: "mechanisms",
    label: { bn: "৩টি আর্কিটেকচারাল কনসেপ্ট", en: "Three architectural concepts" },
  },
  {
    id: "implementation",
    label: { bn: "CVA, cn() ও lookup map", en: "CVA, cn() & lookup maps" },
  },
  {
    id: "matrix",
    label: { bn: "Strategies Comparison", en: "Strategies comparison" },
  },
  {
    id: "takeaway",
    label: { bn: "Production Takeaways", en: "Production takeaways" },
  },
];

export default function TailwindArchitecture() {
  return (
    <article className="doc-prose">
      {/* ── The problem ───────────────────────────────────────────────── */}
      <H2 id="the-problem" anchorOnly>
        className-এর জঙ্গল
      </H2>

      <p>
        ভুলু ভাই চশমাটা টেবিলের ওপর রেখে মাথায় হাত দিয়ে বসে আছেন। পুরো প্রজেক্টে Tailwind CSS ব্যবহার
        করা সত্ত্বেও কোডবেসে বিশাল বিশৃঙ্খলা তৈরি হয়েছে।
      </p>

      <Line name="ভুলু ভাই">
        ফাহিম! Tailwind তো স্পিড বাড়ানোর কথা ছিল, কিন্তু এখন JSX ফাইলে <code>className</code> দেখতে
        এক একটা পাহাড়ের মতো লাগছে — শত শত ক্লাসের জঙ্গল! তার ওপর ডাইনামিকভাবে তৈরি করা ক্লাস{" "}
        <code>{"bg-${color}-500"}</code> বিল্ডের পর প্রোডাকশনে কাজই করছে না। Tailwind-কে স্কেলেবল ও
        ক্লিন আর্কিটেকচারে আনার উপায় কী?
      </Line>

      <Line name="ফাহিম">
        ভুলু ভাই, সমস্যাটা Tailwind-এর নয় — সমস্যা হলো আমরা এটিকে কেবল inline-style-এর বিকল্প হিসেবে
        র‍্যান্ডমলি ব্যবহার করছি। বড় প্রজেক্টে মেইনটেইন করতে হলে Design Tokens, JIT scanner rules এবং
        Class Abstraction (CVA + tailwind-merge) — এই তিনটির সঠিক আর্কিটেকচার দাঁড় করাতে হয়।
      </Line>

      <Line name="নেক্সট-ভাই">
        একদম! Tailwind-এর JIT ইঞ্জিন স্ট্যাটিকভাবে সোর্স ফাইল স্ক্যান করে CSS জেনারেট করে, তাই ডাইনামিক
        স্ট্রিং ইন্টারপোলেশন কাজ করে না। আজ আমরা শিখব কীভাবে Next.js-এ একটি enterprise-grade Tailwind
        architecture তৈরি করতে হয়।
      </Line>

      {/* ── Architecture ──────────────────────────────────────────────── */}
      <H2 id="architecture">১. Tailwind Architecture &amp; JIT Engine Pipeline</H2>

      <Diagram>{`┌─────────────────────────────────────────────────────────────────────────┐
│                  TAILWIND JIT SCANNER & BUILD PIPELINE                  │
└─────────────────────────────────────────────────────────────────────────┘

 [ source files: .tsx, .jsx ] ──► [ Tailwind content scanner ]
                                            │
                                            ▼ (extract full class strings)
 [ tailwind.config.ts ] ─────────► [ design tokens & theme engine ]
                                            │
                                            ▼ (match & generate minimal CSS)
 [ atomic CSS output ]   ─────────► [ purged final bundle (~10-15 KB) ]`}</Diagram>

      {/* ── Mechanisms ────────────────────────────────────────────────── */}
      <H2 id="mechanisms">২. কোর আর্কিটেকচারাল কনসেপ্ট</H2>

      <p>
        <strong>JIT engine &amp; static class extraction:</strong> স্ক্যানার কোডে পুরো ক্লাস নেমটি
        স্ট্যাটিকভাবে খোঁজে (যেমন <code>bg-red-500</code>)। <code>{"bg-${color}-500"}</code> লিখলে
        স্ক্যানার জানে না কোন রঙ হবে, তাই সেটি বান্ডলে যুক্তই হয় না — এর জন্য safelist বা lookup
        mapping object দরকার।
      </p>

      <p>
        <strong>Design token centralization:</strong> অ্যাবিট্রারি ভ্যালু (<code>w-[342px]</code>,{" "}
        <code>bg-[#1a202c]</code>) কোডজুড়ে ছড়িয়ে না রেখে সমস্ত কালার, স্পেসিং ও টাইপোগ্রাফি{" "}
        <code>tailwind.config.ts</code>-এর <code>theme.extend</code>-এ ডিফাইন রাখতে হবে।
      </p>

      <p>
        <strong>CVA &amp; tailwind-merge strategy:</strong> কম্পোনেন্ট ভ্যারিয়েন্ট (primary,
        secondary, ghost, danger) হ্যান্ডেল করতে <code>@apply</code> দিয়ে গ্লোবাল CSS না ভরে CVA এবং{" "}
        <code>clsx</code> + <code>tailwind-merge</code> (<code>cn</code> helper) প্যাটার্ন ব্যবহার করাই
        আর্কিটেকচারালি সবচেয়ে ক্লিন।
      </p>

      {/* ── Implementation ────────────────────────────────────────────── */}
      <H2 id="implementation">৩. Production Code Implementation</H2>

      <H3>❌ Anti-pattern — utility dumping and dynamic string hacks</H3>

      <CodeBlock filename="components/legacy-ui.tsx">{`// 🔴 POOR PRACTICE: dynamic interpolation breaks in JIT, and concatenation
// produces conflicting Tailwind classes (p-4 vs p-6 vs p-2).

// 1. a dynamic class the JIT scanner cannot see:
export function DynamicBadge({ color }: { color: string }) {
  // ❌ the scanner never sees the final class name
  return <span className={\`px-2 py-1 bg-\${color}-500 text-white\`}>Badge</span>;
}

// 2. class conflicts and unreadable markup:
export function MessyButton({
  className,
  isPrimary,
}: {
  className?: string;
  isPrimary: boolean;
}) {
  return (
    <button
      className={\`px-4 py-2 rounded bg-blue-500 text-white hover:bg-blue-600 \${
        isPrimary ? 'bg-indigo-600 p-6' : 'bg-gray-500 p-2'
      } \${className}\`} // ❌ p-4, p-6 and p-2 collide unpredictably
    >
      Click me
    </button>
  );
}`}</CodeBlock>

      <H3>🟢 Production pattern — a scalable Tailwind system</H3>

      <CodeBlock filename="tailwind.config.ts">{`import type { Config } from 'tailwindcss';

const config: Config = {
  // 1. precise content scanning paths
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './lib/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      // 2. centralized design tokens
      colors: {
        brand: {
          50: '#f0fdf4',
          500: '#22c55e',
          900: '#14532d',
          DEFAULT: '#22c55e',
        },
        surface: {
          light: '#ffffff',
          dark: '#0f172a',
        },
      },
      spacing: {
        'header-height': '4rem',
      },
    },
  },
  plugins: [],
};

export default config;`}</CodeBlock>

      <CodeBlock filename="lib/utils/cn.ts">{`import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

/**
 * Merges Tailwind classes without conflicts.
 * cn('p-4 bg-red-500', 'p-6 bg-blue-500') => 'p-6 bg-blue-500'
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}`}</CodeBlock>

      <CodeBlock filename="components/ui/Button.tsx">{`import React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils/cn';

// 🟢 variants and semantic token mapping in one place
const buttonVariants = cva(
  // base classes, applied to every button
  'inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none',
  {
    variants: {
      variant: {
        primary: 'bg-brand text-white hover:bg-brand-900',
        secondary:
          'bg-slate-100 text-slate-900 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-100',
        danger: 'bg-red-600 text-white hover:bg-red-700',
        outline:
          'border border-slate-300 bg-transparent hover:bg-slate-100 dark:border-slate-700',
      },
      size: {
        sm: 'h-8 px-3 text-xs',
        md: 'h-10 px-4 py-2',
        lg: 'h-12 px-6 text-lg',
      },
    },
    defaultVariants: {
      variant: 'primary',
      size: 'md',
    },
  },
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, ...props }, ref) => {
    return (
      <button
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  },
);

Button.displayName = 'Button';`}</CodeBlock>

      <CodeBlock filename="components/ui/StatusBadge.tsx">{`import { cn } from '@/lib/utils/cn';

type Status = 'success' | 'warning' | 'error';

// 🟢 complete class strings in a lookup map — the JIT scanner sees every one
const statusStyles: Record<Status, string> = {
  success: 'bg-emerald-100 text-emerald-800 border-emerald-300',
  warning: 'bg-amber-100 text-amber-800 border-amber-300',
  error: 'bg-rose-100 text-rose-800 border-rose-300',
};

export function StatusBadge({ status, label }: { status: Status; label: string }) {
  return (
    <span
      className={cn(
        'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold border',
        statusStyles[status], // safe static resolution
      )}
    >
      {label}
    </span>
  );
}`}</CodeBlock>

      {/* ── Matrix ────────────────────────────────────────────────────── */}
      <H2 id="matrix">৪. Tailwind Architecture Strategies Comparison</H2>

      <Table
        head={["প্যাটার্ন", "সুবিধা", "অসুবিধা", "ব্যবহারের ক্ষেত্র"]}
        rows={[
          [
            "Inline utility classes",
            "দ্রুত প্রোটোটাইপিং, জিরো CSS ওভারহেড",
            "JSX রিডেবিলিটি কমে, রিইউজ কঠিন",
            "ছোট পেজ বা ইউনিক এলিমেন্ট",
          ],
          [
            <span key="c">
              <code>@apply</code> in CSS files
            </span>,
            "HTML পরিষ্কার দেখায়",
            "CSS ফাইল বড় হয়, ডুপ্লিকেশন বাড়ে",
            "থার্ড-পার্টি প্লাগইন ওভাররাইড",
          ],
          [
            <span key="c">
              CVA + <code>cn()</code> helper
            </span>,
            "টাইপ-সেফ, স্কেলেবল, কনফ্লিক্ট সলভ করে",
            "প্রাথমিক সেটআপে কয়েক মিনিট",
            "Enterprise / reusable UI library",
          ],
        ]}
      />

      <Line name="ভুলু ভাই">
        মারাত্মক ফাহিম! <code>cn()</code> হেল্পার আর CVA দিয়ে বাটনের ভ্যারিয়েন্ট ম্যানেজ করায় JSX থেকে
        ক্লাসের জঙ্গল গায়েব হয়ে গেছে! আর স্ট্যাটাস ব্যাজে lookup object ব্যবহার করায় JIT ইঞ্জিনও এখন
        পারফেক্ট CSS জেনারেট করছে।
      </Line>

      {/* ── Takeaways ─────────────────────────────────────────────────── */}
      <H2 id="takeaway">Production Takeaways</H2>

      <Note>
        <ul>
          <li>
            <strong>Never concatenate dynamic classes:</strong> <code>{"bg-${color}-500"}</code>{" "}
            টাইপের কোড JIT ট্র্যাকার পড়তে পারে না — সবসময় ফুল-স্ট্রিং lookup object (
            <code>statusStyles[status]</code>) ব্যবহার করুন।
          </li>
          <li>
            <strong>Stop @apply abuse:</strong> প্রতিটি ক্লাস CSS ফাইলে নিয়ে <code>@apply</code> দেওয়া
            মানে Tailwind-কে আবার প্রথাগত CSS-এ ফিরিয়ে নেওয়া; ভ্যারিয়েন্ট ম্যানেজমেন্টে CVA ব্যবহার
            করুন।
          </li>
          <li>
            <strong>Always merge via cn():</strong> বাইরে থেকে <code>className</code> প্রপ এলে স্টাইল
            কনফ্লিক্ট (p-4 বনাম p-6) সমাধানে <code>tailwind-merge</code> বাধ্যতামূলক।
          </li>
        </ul>
      </Note>
    </article>
  );
}
