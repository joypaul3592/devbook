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
    label: { bn: "রিফ্রেশে সাদা ফ্ল্যাশ", en: "A white flash on refresh" },
  },
  {
    id: "architecture",
    label: { bn: "Zero-FOUC theme pipeline", en: "The zero-FOUC theme pipeline" },
  },
  {
    id: "mechanisms",
    label: { bn: "৩টি আর্কিটেকচারাল কনসেপ্ট", en: "Three architectural concepts" },
  },
  {
    id: "implementation",
    label: { bn: "Inline script ও ThemeProvider", en: "Inline script & ThemeProvider" },
  },
  {
    id: "matrix",
    label: { bn: "Theme Methods Comparison", en: "Theme methods comparison" },
  },
  {
    id: "takeaway",
    label: { bn: "Production Takeaways", en: "Production takeaways" },
  },
];

export default function ThemeArchitectureDarkMode() {
  return (
    <article className="doc-prose">
      {/* ── The problem ───────────────────────────────────────────────── */}
      <H2 id="the-problem" anchorOnly>
        রিফ্রেশে সাদা ফ্ল্যাশ
      </H2>

      <p>
        বিকেল ৩:৪৫। ডার্ক মোডে থাকা ওয়েবসাইটটি পেজ রিফ্রেশ করলেই ১ সেকেন্ডের জন্য ধবধবে সাদা হয়ে চমকে
        উঠছে — একে বলা হয় FOUC (Flash of Unstyled Content)। তার ওপর ইউজারের OS-এর সিস্টেম থিমের সাথে
        সাইটের থিম অ্যাডাপ্ট হচ্ছে না।
      </p>

      <Line name="ভুলু ভাই">
        ফাহিম! ইউজার ডার্ক মোড সিলেক্ট করে রিফ্রেশ মারলে কেন ১ সেকেন্ডের জন্য সাদা স্ক্রিন দেখা যায়? আর
        কাস্টম স্টেট ম্যানেজমেন্ট ব্যবহার করার পরও কেন hydration mismatch ওয়ার্নিং আসছে?
      </Line>

      <Line name="ফাহিম">
        ভুলু ভাই! কারণ সার্ভার-সাইড রেন্ডারিং। সার্ভার HTML পাঠানোর সময় ইউজারের{" "}
        <code>localStorage</code>-এ থাকা থিম প্রেফারেন্স জানে না। ফলে সার্ভার ডিফল্ট লাইট HTML পাঠায়,
        আর ক্লায়েন্টে React লোড হওয়ার পর থিম অ্যাপ্লাই হয় — এতেই সাদা ফ্লিকার ঘটে।
      </Line>

      <Line name="নেক্সট-ভাই">
        একদম ঠিক! প্রফেশনাল সমাধান হলো Zero-FOUC Theme Architecture — HTML{" "}
        <code>&lt;head&gt;</code>-এর ভেতর একটি ব্লকিং ইনলাইন স্ক্রিপ্ট, যা React hydration-এর আগেই{" "}
        <code>localStorage</code> বা <code>prefers-color-scheme</code> চেক করে{" "}
        <code>&lt;html data-theme=&quot;...&quot;&gt;</code> সেট করে ফেলে।
      </Line>

      {/* ── Architecture ──────────────────────────────────────────────── */}
      <H2 id="architecture">১. Zero-FOUC Theme Execution Flow</H2>

      <Diagram>{`┌─────────────────────────────────────────────────────────────────────────┐
│                     ZERO-FOUC THEME EXECUTION FLOW                      │
└─────────────────────────────────────────────────────────────────────────┘

 server sends HTML (no theme class yet)
        │
        ▼
 browser parses <head>
        │
        ▼
 🟢 the blocking inline script runs BEFORE the first paint ⚡
 ├── 1. reads localStorage.getItem('theme')
 └── 2. falls back to window.matchMedia('(prefers-color-scheme: dark)')
        │
        ▼
 sets <html data-theme="dark"> instantly
        │
        ▼
 browser paints the first frame in the correct theme — no flash 🟢
        │
        ▼
 React hydrates smoothly (zero mismatch warnings)`}</Diagram>

      {/* ── Mechanisms ────────────────────────────────────────────────── */}
      <H2 id="mechanisms">২. কোর আর্কিটেকচারাল কনসেপ্ট</H2>

      <p>
        <strong>FOUC prevention:</strong> React hydrate হওয়ার অপেক্ষা না করে ব্রাউজারের first
        paint-এর আগেই স্ক্রিপ্ট চালিয়ে <code>&lt;html&gt;</code> ট্যাগে থিম ডেটা-অ্যাট্রিবিউট বসিয়ে দিতে
        হয়।
      </p>

      <p>
        <strong>System preference listening:</strong> ইউজার ম্যানুয়ালি থিম না বাছলে{" "}
        <code>window.matchMedia(&apos;(prefers-color-scheme: dark)&apos;)</code> দিয়ে OS-এর থিম পড়তে
        হয়, এবং OS থিম বদলালে ইভেন্ট লিসেনার দিয়ে রিয়েল-টাইমে আপডেট করতে হয়।
      </p>

      <p>
        <strong>Hydration sync:</strong> <code>&lt;html&gt;</code> ট্যাগে{" "}
        <code>suppressHydrationWarning</code> দিতে হয়, যাতে সার্ভার-জেনারেটেড DOM আর ইনলাইন স্ক্রিপ্ট
        দিয়ে মডিফাই করা ক্লায়েন্ট DOM-এর পার্থক্যে React ওয়ার্নিং না দেয়।
      </p>

      {/* ── Implementation ────────────────────────────────────────────── */}
      <H2 id="implementation">৩. Production Code Implementation</H2>

      <H3>❌ Anti-pattern — theme applied inside useEffect</H3>

      <CodeBlock filename="components/FlashingThemeToggle.tsx">{`// 🔴 POOR PRACTICE: setting the theme in useEffect flashes on every reload
'use client';

import { useEffect, useState } from 'react';

export function FlashingThemeToggle() {
  const [theme, setTheme] = useState('light');

  useEffect(() => {
    // ❌ runs AFTER React mounts and paints the light DOM → FOUC
    const saved = localStorage.getItem('theme') || 'light';
    setTheme(saved);
    document.documentElement.setAttribute('data-theme', saved);
  }, []);

  return (
    <button onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}>
      Toggle
    </button>
  );
}`}</CodeBlock>

      <H3>🟢 Production pattern — a zero-FOUC theme architecture</H3>

      <CodeBlock filename="lib/theme/script.ts">{`// 🟢 STEP 1: a blocking script that runs before the browser paints
export const themeInitScript = \`
  (function() {
    try {
      var storedTheme = localStorage.getItem('app_theme');
      var prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

      var finalTheme = 'light';
      if (storedTheme === 'dark' || storedTheme === 'light') {
        finalTheme = storedTheme;
      } else if (prefersDark) {
        finalTheme = 'dark';
      }

      document.documentElement.setAttribute('data-theme', finalTheme);
      document.documentElement.style.colorScheme = finalTheme;
    } catch (e) {}
  })();
\`;`}</CodeBlock>

      <CodeBlock filename="app/layout.tsx">{`// 🟢 STEP 2: inject the script in the App Router layout
import '@/app/globals.css';
import { themeInitScript } from '@/lib/theme/script';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    // 🟢 suppressHydrationWarning: the inline script mutates this element
    <html lang="bn" suppressHydrationWarning>
      <head>
        {/* 🟢 executes before the first paint */}
        <script dangerouslySetInnerHTML={{ __html: themeInitScript }} />
      </head>
      <body className="bg-surface-body text-text-main transition-colors duration-200">
        {children}
      </body>
    </html>
  );
}`}</CodeBlock>

      <CodeBlock filename="components/theme/ThemeProvider.tsx">{`// 🟢 STEP 3: the React theme provider and hook
'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';

type Theme = 'light' | 'dark' | 'system';

interface ThemeContextType {
  theme: Theme;
  setTheme: (theme: Theme) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setThemeState] = useState<Theme>('system');

  useEffect(() => {
    const saved = (localStorage.getItem('app_theme') as Theme) || 'system';
    setThemeState(saved);

    // react to OS-level theme changes in real time
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleSystemChange = () => {
      const stored = localStorage.getItem('app_theme');
      if (!stored || stored === 'system') {
        document.documentElement.setAttribute(
          'data-theme',
          mediaQuery.matches ? 'dark' : 'light',
        );
      }
    };

    mediaQuery.addEventListener('change', handleSystemChange);
    return () => mediaQuery.removeEventListener('change', handleSystemChange);
  }, []);

  const setTheme = (newTheme: Theme) => {
    setThemeState(newTheme);
    localStorage.setItem('app_theme', newTheme);

    const resolved =
      newTheme === 'system'
        ? window.matchMedia('(prefers-color-scheme: dark)').matches
          ? 'dark'
          : 'light'
        : newTheme;

    document.documentElement.setAttribute('data-theme', resolved);
    document.documentElement.style.colorScheme = resolved;
  };

  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) throw new Error('useTheme must be used within ThemeProvider');
  return context;
};`}</CodeBlock>

      <CodeBlock filename="components/theme/ThemeToggle.tsx">{`// 🟢 STEP 4: the switcher UI
'use client';

import { useTheme } from './ThemeProvider';

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();

  return (
    <div className="flex gap-2 p-2 rounded-lg bg-surface-card border border-surface-border">
      {(['light', 'dark', 'system'] as const).map((mode) => (
        <button
          key={mode}
          onClick={() => setTheme(mode)}
          className={\`px-3 py-1.5 rounded-md text-xs font-medium transition-all \${
            theme === mode
              ? 'bg-brand-primary text-white shadow-sm'
              : 'text-text-muted hover:text-text-main'
          }\`}
        >
          {mode.toUpperCase()}
        </button>
      ))}
    </div>
  );
}`}</CodeBlock>

      {/* ── Matrix ────────────────────────────────────────────────────── */}
      <H2 id="matrix">৪. Theme Architecture Methods Comparison</H2>

      <Table
        head={["প্যাটার্ন", "FOUC ঝুঁকি", "Hydration mismatch", "OS theme support"]}
        rows={[
          [
            <span key="c">
              <code>useEffect</code> client state
            </span>,
            "অত্যন্ত বেশি 🔴",
            "থাকে 🔴",
            "ম্যানুয়ালি হ্যান্ডেল করতে হয় 🟡",
          ],
          [
            <span key="c">
              Pure CSS <code>@media prefers-color-scheme</code>
            </span>,
            "জিরো 🟢",
            "থাকে না 🟢",
            "ম্যানুয়াল টগল সাপোর্ট করে না 🔴",
          ],
          [
            "Blocking inline script architecture",
            "জিরো 🟢",
            <span key="d">
              <code>suppressHydrationWarning</code> দিয়ে সেফ 🟢
            </span>,
            "ফুল সিস্টেম সিঙ্ক্রোনাইজড 🟢",
          ],
        ]}
      />

      <Line name="ভুলু ভাই">
        ফাটাফাটি ফাহিম! হেডারে ইনলাইন ব্লকিং স্ক্রিপ্ট দেওয়ার পর ডার্ক মোডে হার্ড রিফ্রেশ দিলেও একটুও
        সাদা ফ্ল্যাশ মারছে না — সাইট এক পলকেই পারফেক্ট ডার্ক থিমে লোড হচ্ছে।
      </Line>

      {/* ── Takeaways ─────────────────────────────────────────────────── */}
      <H2 id="takeaway">Production Takeaways</H2>

      <Note>
        <ul>
          <li>
            <strong>Read the theme in a blocking head script:</strong> <code>useEffect</code>-এর ওপর
            ভরসা করবেন না — থিম পড়ার কাজ পেইন্টের আগেই শেষ করতে হয়।
          </li>
          <li>
            <strong>Use suppressHydrationWarning on &lt;html&gt;:</strong> ইনলাইন স্ক্রিপ্ট DOM
            পরিবর্তন করায় React hydration ওয়ার্নিং এড়াতে এই ফ্ল্যাগটি বাধ্যতামূলক।
          </li>
          <li>
            <strong>Always sync the CSS color-scheme property:</strong>{" "}
            <code>document.documentElement.style.colorScheme = &apos;dark&apos;</code> সেট করলে নেটিভ
            স্ক্রলবার, রেডিও বাটন ও চেকবক্সও স্বয়ংক্রিয়ভাবে ডার্ক হয়ে যায়।
          </li>
        </ul>
      </Note>
    </article>
  );
}
