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
    label: { bn: "৪৫টি ফাইলে hex খোঁজাখুঁজি", en: "Hunting hex codes in 45 files" },
  },
  {
    id: "architecture",
    label: { bn: "Design token hierarchy", en: "The design token hierarchy" },
  },
  {
    id: "mechanisms",
    label: { bn: "৩টি আর্কিটেকচারাল কনসেপ্ট", en: "Three architectural concepts" },
  },
  {
    id: "implementation",
    label: { bn: "Primitive ও semantic token", en: "Primitive & semantic tokens" },
  },
  {
    id: "matrix",
    label: { bn: "Hardcoded vs tokenized", en: "Hardcoded vs tokenized" },
  },
  {
    id: "takeaway",
    label: { bn: "Production Takeaways", en: "Production takeaways" },
  },
];

export default function CssVariablesDesignTokens() {
  return (
    <article className="doc-prose">
      {/* ── The problem ───────────────────────────────────────────────── */}
      <H2 id="the-problem" anchorOnly>
        ৪৫টি ফাইলে hex খোঁজাখুঁজি
      </H2>

      <p>
        দুপুর ২:৩০। ক্লায়েন্ট বলেছে ব্র্যান্ডের প্রাইমারি কালার <code>#3b82f6</code> বদলে{" "}
        <code>#2563eb</code> করতে হবে, আর ডার্ক মোডের ব্যাকগ্রাউন্ড <code>#0f172a</code>-এর বদলে{" "}
        <code>#1e293b</code>। ভুলু ভাই এখন ৪৫টা CSS ফাইলে Ctrl+F মেরে হ্যাশ কোড রিপ্লেস করছেন।
      </p>

      <Line name="ভুলু ভাই">
        ফাহিম, খাতায় হিসাব করছি কোন কোন ফাইলে কালার বদলাতে হবে! এত সময় তো অন্য প্রজেক্টে দেওয়া যেত।
      </Line>

      <Line name="নেক্সট-ভাই">
        ভুলু ভাই! হার্ডকোডেড কালার বা সাইজ CSS-এ ছড়িয়ে রাখা ডেভেলপমেন্টের সবচেয়ে বড় অ্যান্টি-প্যাটার্ন।
        আধুনিক ওয়েবে আমরা CSS Custom Properties ও Design Token আর্কিটেকচার ব্যবহার করি — এক জায়গায়
        ভ্যালু বদলালেই পুরো অ্যাপের লাইট ও ডার্ক মোড আপডেট হয়ে যায়।
      </Line>

      {/* ── Architecture ──────────────────────────────────────────────── */}
      <H2 id="architecture">১. Design Token Architecture Hierarchy</H2>

      <Diagram>{`┌─────────────────────────────────────────────────────────────────────────┐
│                     DESIGN TOKEN ARCHITECTURE SYSTEM                    │
└─────────────────────────────────────────────────────────────────────────┘

 LAYER 1: PRIMITIVE TOKENS (raw colors, font sizes, spacing)
 ┌──────────────────────┐ ┌──────────────────────┐ ┌──────────────────────┐
 │ --blue-500: #3b82f6; │ │ --slate-900: #0f172a │ │ --space-4: 1rem;     │
 └──────────┬───────────┘ └──────────┬───────────┘ └──────────┬───────────┘
            │                        │                        │
            ▼                        ▼                        ▼
 LAYER 2: SEMANTIC TOKENS (meaning-based aliases per theme)
 ┌───────────────────────────────────────────────────────────────────────┐
 │ :root (light)        ► --bg-primary: var(--slate-100);                │
 │                      ► --text-main:  var(--slate-900);                │
 │                      ► --accent:     var(--blue-500);                 │
 │                                                                       │
 │ [data-theme="dark"]  ► --bg-primary: var(--slate-900);                │
 │                      ► --text-main:  var(--slate-100);                │
 └──────────────────────────────────┬────────────────────────────────────┘
                                    │
                                    ▼
 LAYER 3: COMPONENT USAGE
 ┌───────────────────────────────────────────────────────────────────────┐
 │ .card { background: var(--bg-primary); color: var(--text-main); }     │
 └───────────────────────────────────────────────────────────────────────┘`}</Diagram>

      {/* ── Mechanisms ────────────────────────────────────────────────── */}
      <H2 id="mechanisms">২. কোর আর্কিটেকচারাল কনসেপ্ট</H2>

      <p>
        <strong>Primitive tokens:</strong> যেসব ভ্যালু র কোড রিপ্রেজেন্ট করে — নির্দিষ্ট কালার প্যালেট
        (<code>--slate-500</code>, <code>--blue-600</code>) বা ফন্ট সাইজ। এগুলো সরাসরি কম্পোনেন্টে
        ব্যবহার করা উচিত নয়।
      </p>

      <p>
        <strong>Semantic tokens:</strong> অর্থবোধক টোকেন যা অ্যাপের কনটেক্সট প্রকাশ করে —{" "}
        <code>--surface-card</code>, <code>--text-main</code>, <code>--brand-danger</code>। থিম
        বদলানোর সময় কেবল এই লেভেলের পয়েন্টারগুলো রি-ম্যাপ হয়।
      </p>

      <p>
        <strong>Runtime dynamic changing:</strong> <code>var(--name, fallback)</code> ব্রাউজারের
        রানটাইমে কাজ করে — React রি-রেন্ডার ছাড়াই <code>:root</code> বা কোনো এলিমেন্টের ডেটা-অ্যাট্রিবিউট
        বদলে পুরো থিম মুহূর্তেই সুইচ করা যায়।
      </p>

      {/* ── Implementation ────────────────────────────────────────────── */}
      <H2 id="implementation">৩. Production Code Implementation</H2>

      <H3>❌ Anti-pattern — hardcoded hex values everywhere</H3>

      <CodeBlock filename="styles/legacy.css">{`/* 🔴 POOR PRACTICE: hardcoding hex values across the codebase */
.card {
  background-color: #ffffff;
  color: #0f172a;
  border: 1px solid #e2e8f0;
}

/* scattered dark-mode duplicates */
html.dark .card {
  background-color: #0f172a;
  color: #f8fafc;
  border: 1px solid #334155;
}

.button {
  background-color: #3b82f6; /* the same hex, repeated everywhere */
  color: #ffffff;
}`}</CodeBlock>

      <H3>🟢 Production pattern — a two-layer token system</H3>

      <CodeBlock filename="app/tokens.css">{`/* -------------------------------------------------- */
/* 1. PRIMITIVE TOKENS — raw values, never used directly in components */
/* -------------------------------------------------- */
:root {
  --pr-blue-500: #3b82f6;
  --pr-blue-600: #2563eb;

  --pr-slate-50: #f8fafc;
  --pr-slate-100: #f1f5f9;
  --pr-slate-800: #1e293b;
  --pr-slate-900: #0f172a;

  --pr-red-500: #ef4444;

  --font-family-base: 'Inter', system-ui, sans-serif;
  --space-2: 0.5rem;
  --space-4: 1rem;
  --space-6: 1.5rem;

  --radius-md: 0.375rem;
  --transition-theme: background-color 0.2s ease, color 0.2s ease;
}

/* -------------------------------------------------- */
/* 2. SEMANTIC TOKENS — the contextual layer            */
/* -------------------------------------------------- */
:root,
[data-theme='light'] {
  --surface-body: var(--pr-slate-50);
  --surface-card: #ffffff;
  --surface-border: #e2e8f0;

  --text-main: var(--pr-slate-900);
  --text-muted: #64748b;

  --brand-primary: var(--pr-blue-500);
  --brand-primary-hover: var(--pr-blue-600);
  --brand-danger: var(--pr-red-500);
}

/* dark theme: only the semantic tokens are re-mapped */
[data-theme='dark'] {
  --surface-body: var(--pr-slate-900);
  --surface-card: var(--pr-slate-800);
  --surface-border: #334155;

  --text-main: var(--pr-slate-50);
  --text-muted: #94a3b8;
}

/* -------------------------------------------------- */
/* 3. STYLES USING SEMANTIC TOKENS ONLY                */
/* -------------------------------------------------- */
body {
  font-family: var(--font-family-base);
  background-color: var(--surface-body);
  color: var(--text-main);
  transition: var(--transition-theme);
}

.card {
  background-color: var(--surface-card);
  border: 1px solid var(--surface-border);
  border-radius: var(--radius-md);
  padding: var(--space-6);
  transition: var(--transition-theme);
}

.btn-primary {
  background-color: var(--brand-primary);
  color: #ffffff;
  padding: var(--space-2) var(--space-4);
  border-radius: var(--radius-md);
  border: none;
  cursor: pointer;
}

.btn-primary:hover {
  background-color: var(--brand-primary-hover);
}`}</CodeBlock>

      <CodeBlock filename="app/components/ThemeToggle.tsx">{`'use client';

import { useState, useEffect } from 'react';

export default function ThemeToggle() {
  const [theme, setTheme] = useState<'light' | 'dark'>('light');

  useEffect(() => {
    // keep the root data-theme attribute in sync
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  return (
    <div className="card space-y-4">
      <h2 style={{ color: 'var(--text-main)' }}>Design token theme demo</h2>
      <p style={{ color: 'var(--text-muted)' }}>
        Current theme: <strong>{theme.toUpperCase()}</strong>
      </p>

      <button
        className="btn-primary"
        onClick={() => setTheme((prev) => (prev === 'light' ? 'dark' : 'light'))}
      >
        Switch to {theme === 'light' ? 'dark' : 'light'} mode
      </button>
    </div>
  );
}`}</CodeBlock>

      {/* ── Matrix ────────────────────────────────────────────────────── */}
      <H2 id="matrix">৪. Hardcoded CSS vs. Tokenized System</H2>

      <Table
        head={["বৈশিষ্ট্য", "Hardcoded CSS", "Design-tokenized architecture"]}
        rows={[
          [
            "Maintainability",
            "একাধিক ফাইলে Ctrl+F মেরে ভ্যালু পাল্টাতে হয় 🔴",
            "টোকেন ফাইলে একটাই ভ্যালু বদলালেই হয় 🟢",
          ],
          [
            "Dark mode",
            <span key="c">
              প্রজেক্টজুড়ে <code>html.dark .class</code> কপি-পেস্ট 🔴
            </span>,
            <span key="d">
              কেবল <code>data-theme</code> দিয়ে টোকেন রি-ম্যাপ 🟢
            </span>,
          ],
          [
            "UI consistency",
            "এলোমেলো প্যাডিং/কালার ছড়ায় 🔴",
            "ডিজাইন সিস্টেমের নির্দিষ্ট ভ্যালু মেনে চলে 🟢",
          ],
          [
            "Performance",
            "ডার্ক মোডের ডুপ্লিকেট রুলে CSS সাইজ বাড়ে 🔴",
            "নেটিভ CSS ভেরিয়েবল রেন্ডারিং, হালকা 🟢",
          ],
        ]}
      />

      <Line name="ভুলু ভাই">
        দুর্দান্ত! এখন দেখছি থিম চেঞ্জ বা ব্র্যান্ড কালার আপডেট করা স্রেফ একটা ভেরিয়েবলের মান বদলানোর
        ব্যাপার! ডার্ক মোডের জন্য আলাদা ডুপ্লিকেট রুলও লিখতে হচ্ছে না।
      </Line>

      {/* ── Takeaways ─────────────────────────────────────────────────── */}
      <H2 id="takeaway">Production Takeaways</H2>

      <Note>
        <ul>
          <li>
            <strong>Two-layer token rule:</strong> primitive টোকেন (<code>--pr-slate-900</code>) আলাদা
            ডিফাইন রাখুন, আর কম্পোনেন্টে শুধু semantic টোকেন (<code>--surface-body</code>) রেফার করুন।
          </li>
          <li>
            <strong>Never use hex codes in components:</strong> কম্পোনেন্ট স্টাইলে সরাসরি{" "}
            <code>#ffffff</code> বা <code>rgb()</code> ব্যবহার নিষিদ্ধ করুন।
          </li>
          <li>
            <strong>Use CSS math functions:</strong> <code>calc(var(--space-4) * 1.5)</code> বা{" "}
            <code>clamp()</code>-এর সাথে CSS ভেরিয়েবল অত্যন্ত পাওয়ারফুল — ডাইনামিক স্পেসিং ও
            টাইপোগ্রাফি স্কেলে দারুণ কাজে দেয়।
          </li>
        </ul>
      </Note>
    </article>
  );
}
