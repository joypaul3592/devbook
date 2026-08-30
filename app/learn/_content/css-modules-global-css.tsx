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
    label: { bn: "দুই .button-এর মারামারি", en: "Two .button classes at war" },
  },
  {
    id: "architecture",
    label: { bn: "Global বনাম scoped hashing", en: "Global vs scoped hashing" },
  },
  {
    id: "mechanisms",
    label: { bn: "৩টি আর্কিটেকচারাল কনসেপ্ট", en: "Three architectural concepts" },
  },
  {
    id: "implementation",
    label: { bn: "Module, composes ও :global", en: "Modules, composes & :global" },
  },
  {
    id: "matrix",
    label: { bn: "Global CSS vs CSS Modules", en: "Global CSS vs CSS Modules" },
  },
  {
    id: "takeaway",
    label: { bn: "Production Takeaways", en: "Production takeaways" },
  },
];

export default function CssModulesGlobalCss() {
  return (
    <article className="doc-prose">
      {/* ── The problem ───────────────────────────────────────────────── */}
      <H2 id="the-problem" anchorOnly>
        দুই .button-এর মারামারি
      </H2>

      <p>
        সকাল ১০:৩০। টিম একটি থার্ড-পার্টি রিঅ্যাক্ট টেবিল লাইব্রেরি যুক্ত করার পর দেখা যাচ্ছে
        নেভিগেশন বার, ফর্ম বাটন এবং কার্ড সেকশনের স্টাইল ভেঙে চুরমার — একে অপরের CSS ওভাররাইড করে
        ফেলেছে।
      </p>

      <Line name="ভুলু ভাই">
        ফাহিম! আমার নেভিগেশন বারের <code>.button</code> ক্লাস আর থার্ড-পার্টি লাইব্রেরির{" "}
        <code>.button</code> ক্লাস ফাইট শুরু করেছে! একটা ক্লাস বদলালে সাইটের ১০ জায়গায় স্টাইল ভেঙে
        যাচ্ছে। গ্লোবাল CSS দিয়ে প্রজেক্ট চালানো তো মহা বিপদ।
      </Line>

      <Line name="ফাহিম">
        ভুলু ভাই! গ্লোবাল CSS-এর সবচেয়ে বড় সমস্যা হলো global scope, অর্থাৎ name collision। পুরো অ্যাপে
        একটি CSS ফাইল ইমপোর্ট করলে একই নামের ক্লাস সব এলিমেন্টে অ্যাপ্লাই হয়ে যায়।
      </Line>

      <Line name="নেক্সট-ভাই">
        একদম! এজন্যই Next.js-এ বিল্ট-ইন CSS Modules সাপোর্ট আছে। CSS Modules প্রতিটি ক্লাসের সাথে একটি
        ইউনিক হ্যাশ (যেমন <code>Button_btn__a1b2c</code>) যুক্ত করে স্কোপকে সম্পূর্ণ local করে দেয় —
        ফলে এক কম্পোনেন্টের স্টাইল আরেকটিকে স্পর্শই করতে পারে না।
      </Line>

      {/* ── Architecture ──────────────────────────────────────────────── */}
      <H2 id="architecture">১. Global CSS vs. CSS Modules Scope Architecture</H2>

      <Diagram>{`┌─────────────────────────────────────────────────────────────────────────┐
│                    GLOBAL CSS VS CSS MODULES SCOPING                    │
└─────────────────────────────────────────────────────────────────────────┘

 ❌ GLOBAL CSS ARCHITECTURE (high collision risk)
 globals.css
 ├── .button { background: blue; } ──► applies to EVERY .button element 💥
 └── .card   { padding: 20px; }    ──► overrides the third-party .card

───────────────────────────────────────────────────────────────────────────

 🟢 CSS MODULES ARCHITECTURE (isolated scoped hashing)
 Button.module.css
 └── .button { background: blue; } ──► compiles to .Button_button__k8X1q ⚡
 Card.module.css
 └── .button { background: red; }  ──► compiles to .Card_button__z9Y3m   ⚡`}</Diagram>

      {/* ── Mechanisms ────────────────────────────────────────────────── */}
      <H2 id="mechanisms">২. কোর আর্কিটেকচারাল কনসেপ্ট</H2>

      <p>
        <strong>Local scoping via unique class hashing:</strong> ফাইলের নাম{" "}
        <code>[name].module.css</code> দিলে কম্পাইলার সেটিকে মডিউল হিসেবে ধরে এবং{" "}
        <code>Button_button__k8X1q</code> ধরনের হ্যাশড ক্লাস তৈরি করে — ক্লাস ওভারল্যাপিং ১০০% বন্ধ।
      </p>

      <p>
        <strong>Global CSS rules in App Router:</strong> <code>globals.css</code> কেবল root layout-এ
        ইমপোর্ট করা যায় এবং এটি মূলত CSS reset, typography defaults, CSS variables ও থার্ড-পার্টি
        স্টাইলশিটের জন্য।
      </p>

      <p>
        <strong>Mixing scoped &amp; global selectors:</strong> CSS Module-এর ভেতর থেকে কোনো
        থার্ড-পার্টি বা চাইল্ড এলিমেন্টকে টার্গেট করতে <code>:global(.third-party-class)</code>{" "}
        সিলেক্টর ব্যবহার করতে হয়।
      </p>

      {/* ── Implementation ────────────────────────────────────────────── */}
      <H2 id="implementation">৩. Production Code Implementation</H2>

      <H3>❌ Anti-pattern — component styles dumped into globals.css</H3>

      <CodeBlock filename="app/globals.css">{`/* 🔴 POOR PRACTICE: component-specific styles in globals.css */
/* these collide with every other component using .card, .title or .button */
.card {
  background-color: #ffffff;
  border-radius: 8px;
  padding: 16px;
}

.title {
  font-size: 18px;
  color: #1e293b;
}

.button {
  background-color: #2563eb;
  color: white;
}`}</CodeBlock>

      <H3>🟢 Production pattern — scoped modules with composes and :global</H3>

      <CodeBlock filename="components/Card/Card.module.css">{`/* 🟢 a base class reused within this module */
.baseCard {
  border-radius: 0.75rem;
  padding: 1.5rem;
  transition: all 0.2s ease-in-out;
}

/* 🟢 the scoped primary card, composed from the base */
.cardPrimary {
  composes: baseCard;
  background-color: var(--surface-card, #0f172a);
  border: 1px solid var(--border-color, #1e293b);
  color: #f8fafc;
}

.cardPrimary:hover {
  border-color: #3b82f6;
  transform: translateY(-2px);
}

.title {
  font-size: 1.25rem;
  font-weight: 700;
  margin-bottom: 0.75rem;
}

/* 🟢 safely target a third-party element, scoped inside this module */
.cardPrimary :global(.react-select__control) {
  background-color: #1e293b;
  border-color: #334155;
}`}</CodeBlock>

      <CodeBlock filename="components/Card/Card.tsx">{`import React from 'react';
import styles from './Card.module.css';

interface CardProps {
  title: string;
  children: React.ReactNode;
}

export function Card({ title, children }: CardProps) {
  return (
    // the hashed class names come from the styles object
    <div className={styles.cardPrimary}>
      <h3 className={styles.title}>{title}</h3>
      <div>{children}</div>
    </div>
  );
}`}</CodeBlock>

      <CodeBlock filename="app/globals.css">{`/* 🟢 PRODUCTION PATTERN: resets, tokens and layering ONLY */
@layer base {
  :root {
    --bg-background: #020617;
    --text-primary: #f8fafc;
    --accent-color: #3b82f6;
  }

  *,
  *::before,
  *::after {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
  }

  body {
    background-color: var(--bg-background);
    color: var(--text-primary);
    font-family: system-ui, -apple-system, sans-serif;
  }
}`}</CodeBlock>

      <CodeBlock filename="app/layout.tsx">{`// 🟢 the global stylesheet is imported exactly once, at the root
import './globals.css';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}`}</CodeBlock>

      {/* ── Matrix ────────────────────────────────────────────────────── */}
      <H2 id="matrix">৪. Global CSS vs. CSS Modules Matrix</H2>

      <Table
        head={["ক্রাইটেরিয়া", "Global CSS", "CSS Modules"]}
        rows={[
          ["Scope range", "পুরো অ্যাপ্লিকেশনজুড়ে 🌐", "শুধু নির্দিষ্ট কম্পোনেন্টে 🔒"],
          [
            "Name collision risk",
            "অত্যন্ত বেশি 🔴",
            "প্রায় শূন্য (auto-hashed) 🟢",
          ],
          [
            "Import location",
            <span key="c">
              কেবল <code>app/layout.tsx</code> ⚠️
            </span>,
            "যেকোনো কম্পোনেন্টে 🟢",
          ],
          [
            "ইউজ কেস",
            "Reset, design token, global font",
            "UI component, card, modal, form",
          ],
        ]}
      />

      <Line name="ভুলু ভাই">
        দুর্দান্ত ফাহিম! কাস্টম কম্পোনেন্টগুলোকে <code>.module.css</code>-এ নেওয়ার সাথে সাথেই
        থার্ড-পার্টি ব্রোকেন স্টাইলের ঝামেলা দূর হয়ে গেছে! এখন ক্লাস নেম স্বয়ংক্রিয়ভাবে{" "}
        <code>Card_cardPrimary__z9Y3m</code> হয়ে যাচ্ছে।
      </Line>

      {/* ── Takeaways ─────────────────────────────────────────────────── */}
      <H2 id="takeaway">Production Takeaways</H2>

      <Note>
        <ul>
          <li>
            <strong>Use CSS Modules for component isolation:</strong> নতুন কম্পোনেন্ট লেখার সময় সবসময়{" "}
            <code>.module.css</code> ফাইল বানান, যাতে অন্য কারও CSS আপনার স্টাইল ওভাররাইড করতে না পারে।
          </li>
          <li>
            <strong>Restrict globals.css:</strong> সেখানে কখনো কম্পোনেন্ট-স্পেসিফিক স্টাইল (যেমন{" "}
            <code>.admin-sidebar</code>) লিখবেন না — শুধু ডিজাইন টোকেন ও সাইট-ওয়াইড রুল রাখুন।
          </li>
          <li>
            <strong>Master :global() for third-party overrides:</strong> লাইব্রেরির স্টাইল কাস্টমাইজ
            করতে গ্লোবাল ফাইলে না গিয়ে মডিউলের ভেতরে <code>:global(.class-name)</code> দিয়ে স্কোপড
            ওভাররাইড করুন।
          </li>
        </ul>
      </Note>
    </article>
  );
}
