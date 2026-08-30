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
    label: { bn: "ক্লাস নামের খিচুড়ি?", en: "Just a soup of class names?" },
  },
  {
    id: "architecture",
    label: { bn: "BEM বনাম utility-first", en: "BEM vs utility-first" },
  },
  {
    id: "mechanisms",
    label: { bn: "৩টি আর্কিটেকচারাল কনসেপ্ট", en: "Three architectural concepts" },
  },
  {
    id: "implementation",
    label: { bn: "cn(), CVA ও token mapping", en: "cn(), CVA & token mapping" },
  },
  {
    id: "matrix",
    label: { bn: "Traditional vs Utility-First", en: "Traditional vs utility-first" },
  },
  {
    id: "takeaway",
    label: { bn: "Production Takeaways", en: "Production takeaways" },
  },
];

export default function UtilityFirstCssArchitecture() {
  return (
    <article className="doc-prose">
      {/* ── The problem ───────────────────────────────────────────────── */}
      <H2 id="the-problem" anchorOnly>
        ক্লাস নামের খিচুড়ি?
      </H2>

      <p>
        রাত ৮:১৫। ল্যাপটপ বন্ধ করতে গিয়েও থামলেন ভুলু ভাই — চ্যাপ্টারের শেষ প্রশ্নটা মাথায় ঘুরছে।
      </p>

      <Line name="ভুলু ভাই">
        ফাহিম! চ্যাপ্টারজুড়ে CSS Modules, <code>@layer</code>, design token, critical CSS নিয়ে কত
        লড়াই-ই না করলাম! ইন্ডাস্ট্রিতে সবাই বলে Tailwind নাকি ডেভেলপমেন্টের গতি ৫ গুণ বাড়ায়। কিন্তু
        HTML-এ <code>className</code>-এর দীর্ঘ লাইন দেখলে মাথা ঝিমঝিম করে — এটা কোড নাকি ক্লাস নামের
        খিচুড়ি?
      </Line>

      <Line name="ফাহিম">
        ভুলু ভাই! শুরুতে সবারই এমন মনে হয়। কিন্তু Tailwind শুধু কিছু বিচ্ছিন্ন ক্লাসের সমাহার নয় — এটি
        একটি constraint-based design system engine। HTML থেকে CSS ফাইলে ঘন ঘন সুইচ করার মানসিক ক্লান্তি
        (context switching) দূর করাই এর মূল জাদু।
      </Line>

      <Line name="নেক্সট-ভাই">
        একদম! আর প্রজেক্ট বড় হলে <code>tailwind-merge</code>, <code>clsx</code> এবং CVA ব্যবহার করে
        একদম ক্লিন ও স্কেলেবল আর্কিটেকচার দাঁড় করানো যায়। আজ দেখব কীভাবে utility-first আর্কিটেকচারকে
        এন্টারপ্রাইজ লেভেলে প্রোডাকশন-রেডি করা যায়।
      </Line>

      {/* ── Architecture ──────────────────────────────────────────────── */}
      <H2 id="architecture">১. Traditional BEM vs. Utility-First Architecture</H2>

      <Diagram>{`┌─────────────────────────────────────────────────────────────────────────┐
│                   TRADITIONAL BEM VS UTILITY-FIRST FLOW                 │
└─────────────────────────────────────────────────────────────────────────┘

 ❌ TRADITIONAL BEM (high context switching, specificity debt)
 [HTML] <div className="card-item card-item--featured">
          <h2 className="card-item__title">Title</h2>
        </div>
 [CSS]  .card-item { padding: 20px; border-radius: 8px; }
        .card-item--featured { background: #0f172a; }
        .card-item__title { font-size: 1.5rem; color: #fff; }

───────────────────────────────────────────────────────────────────────────

 🟢 UTILITY-FIRST (co-located constraints, zero context switching)
 [HTML] <div className="p-5 rounded-lg bg-slate-900 shadow-md">
          <h2 className="text-xl font-bold text-white">Title</h2>
        </div>

 ⚡ no custom CSS files to maintain
 ⚡ the build engine purges unused styles into a tiny atomic bundle (~10 KB)`}</Diagram>

      {/* ── Mechanisms ────────────────────────────────────────────────── */}
      <H2 id="mechanisms">২. কোর আর্কিটেকচারাল কনসেপ্ট</H2>

      <p>
        <strong>Constraint-based design system:</strong> পিক্সেল পারফেকশনের নামে র‍্যান্ডম ভ্যালু (১৩px,
        ১৭px) ব্যবহারের বদলে Tailwind নির্দিষ্ট টোকেনে সীমাবদ্ধ রাখে (<code>p-4</code> = 1rem,{" "}
        <code>p-6</code> = 1.5rem) — ফলে পুরো টিম একই ডিজাইন নিয়ম মেনে চলে।
      </p>

      <p>
        <strong>Zero context switching &amp; co-location:</strong> স্টাইল বদলাতে আলাদা CSS ফাইল খুঁজতে
        হয় না; মার্কআপ ও স্টাইল একই জায়গায় থাকায় UI পরিবর্তনের ফিডব্যাক লুপ অনেক দ্রুত হয়।
      </p>

      <p>
        <strong>Atomic composition via helpers:</strong> কন্ডিশনাল রেন্ডারিংয়ে ইউটিলিটি ক্লাস মার্জ
        করতে <code>clsx</code> + <code>tailwind-merge</code> ব্যবহার করতে হয়, যা কাস্টম ওভাররাইডের সময়
        ক্যাসকেড কনফ্লিক্ট এড়ায়।
      </p>

      {/* ── Implementation ────────────────────────────────────────────── */}
      <H2 id="implementation">৩. Production Code Implementation</H2>

      <H3>❌ Anti-pattern — spaghetti utilities and unhandled conflicts</H3>

      <CodeBlock filename="components/UnoptimizedCard.tsx">{`// 🔴 POOR PRACTICE: unreadable strings and unresolved class conflicts

export function UnoptimizedCard({
  isFeatured,
  className,
}: {
  isFeatured: boolean;
  className?: string;
}) {
  return (
    // ❌ 'p-4' from the component and a possible 'p-8' from props conflict unpredictably
    <div
      className={\`p-4 bg-white rounded-lg shadow-md \${
        isFeatured ? 'bg-slate-900 text-white p-6' : 'text-slate-800'
      } \${className}\`}
    >
      <h3 className="text-lg font-bold">Unoptimized component</h3>
    </div>
  );
}`}</CodeBlock>

      <H3>🟢 Production pattern — cn(), CVA and token mapping</H3>

      <CodeBlock filename="lib/utils/cn.ts">{`import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

/**
 * Merges Tailwind classes without collisions.
 * cn('p-4 bg-red-500', 'p-6') -> 'bg-red-500 p-6'
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}`}</CodeBlock>

      <CodeBlock filename="components/ui/Card.tsx">{`import React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils/cn';

// 🟢 structured variants via CVA
const cardVariants = cva(
  'rounded-xl transition-all duration-200 border text-slate-900 dark:text-slate-100',
  {
    variants: {
      intent: {
        default:
          'bg-white border-slate-200 dark:bg-slate-900 dark:border-slate-800 shadow-sm',
        featured:
          'bg-slate-950 border-slate-800 text-white shadow-xl ring-1 ring-slate-700',
        outline:
          'bg-transparent border-slate-300 dark:border-slate-700 hover:border-blue-500',
        danger:
          'bg-red-50/50 border-red-200 dark:bg-red-950/20 dark:border-red-900/50',
      },
      padding: {
        none: 'p-0',
        sm: 'p-4',
        md: 'p-6',
        lg: 'p-8',
      },
    },
    defaultVariants: {
      intent: 'default',
      padding: 'md',
    },
  },
);

export interface CardProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof cardVariants> {}

export const Card = React.forwardRef<HTMLDivElement, CardProps>(
  ({ className, intent, padding, children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(cardVariants({ intent, padding }), className)}
        {...props}
      >
        {children}
      </div>
    );
  },
);

Card.displayName = 'Card';`}</CodeBlock>

      <CodeBlock filename="tailwind.config.ts">{`import type { Config } from 'tailwindcss';

const config: Config = {
  darkMode: ['class', '[data-theme="dark"]'],
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // 🟢 map CSS variables onto Tailwind utility tokens, so theming stays fluid
        brand: {
          50: 'var(--brand-50, #eff6ff)',
          500: 'var(--brand-primary, #3b82f6)',
          600: 'var(--brand-primary-hover, #2563eb)',
        },
        surface: {
          body: 'var(--surface-body)',
          card: 'var(--surface-card)',
          border: 'var(--surface-border)',
        },
      },
    },
  },
  plugins: [],
};

export default config;`}</CodeBlock>

      {/* ── Matrix ────────────────────────────────────────────────────── */}
      <H2 id="matrix">৪. Traditional CSS vs. Utility-First Matrix</H2>

      <Table
        head={["বৈশিষ্ট্য", "Traditional BEM / Sass", "Utility-first (Tailwind)"]}
        rows={[
          [
            "Development speed",
            "ফাইল তৈরি ও সিলেক্টর ডিফাইনে সময় বেশি 🔴",
            "মার্কআপ ছাড়াই না গিয়ে দ্রুত UI 🟢",
          ],
          [
            "Context switching",
            "HTML ও CSS ফাইলে ঘন ঘন লাফাতে হয় 🔴",
            "জিরো কনটেক্সট সুইচ 🟢",
          ],
          [
            "Production bundle size",
            "কোড বাড়লে CSS ফাইলও বাড়তেই থাকে 🔴",
            "purge/JIT-এর কারণে প্রায় ফিক্সড (~১০-১৫ KB) 🟢",
          ],
          [
            "Naming fatigue",
            "প্রতিটি ক্লাসের নাম ভাবতে হয় 🔴",
            "নেমিং নিয়ে দুশ্চিন্তা নেই 🟢",
          ],
        ]}
      />

      <Line name="ভুলু ভাই">
        ফাহিম! চ্যাপ্টার ১৪-এর সব টপিক আজ যে গভীরতায় কাভার করলাম, CSS আর্কিটেকচার নিয়ে আমার সব
        কনফিউশন মুছে গেছে — গ্লোবাল CSS, মডিউল, <code>@layer</code>, ডিজাইন টোকেন, critical CSS থেকে
        আজকের utility-first — সবকিছুর কারণ ও প্রোডাকশন প্যাটার্ন এখন ক্রিস্টাল ক্লিয়ার।
      </Line>

      <Line name="ফাহিম">
        একদম ভুলু ভাই! CSS এখন আর আন্দাজের খেলা নয় — এটি একটি সলিড সফটওয়্যার ইঞ্জিনিয়ারিং আর্কিটেকচার।
      </Line>

      {/* ── Takeaways ─────────────────────────────────────────────────── */}
      <H2 id="takeaway">Production Takeaways</H2>

      <Note>
        <ul>
          <li>
            <strong>Always use twMerge for prop overrides:</strong> কম্পোনেন্টে বাইরে থেকে{" "}
            <code>className</code> এলে <code>cn()</code> হেল্পার ব্যবহার করুন, যেন প্রপসের ক্লাসই
            জেতে।
          </li>
          <li>
            <strong>Abstract complex utilities with CVA:</strong> একই ইউটিলিটি স্ট্রিং বারবার
            কপি-পেস্ট না করে CVA দিয়ে রিইউজেবল ভ্যারিয়েন্ট বানান।
          </li>
          <li>
            <strong>Map tokens to CSS variables:</strong> Tailwind কালার ডিফাইন করার সময় CSS ভেরিয়েবল
            রি-ম্যাপ করুন, যাতে থিমিং ও ডার্ক মোড সাপোর্ট সম্পূর্ণ ফ্লুইড থাকে।
          </li>
        </ul>
      </Note>
    </article>
  );
}
