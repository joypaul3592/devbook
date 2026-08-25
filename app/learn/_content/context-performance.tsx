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
      bn: "থিম টগলে পুরো ড্যাশবোর্ড ফ্রিজ",
      en: "A theme toggle that freezes the dashboard",
    },
  },
  {
    id: "architecture",
    label: {
      bn: "Monolithic বনাম Split Context",
      en: "Monolithic vs split context",
    },
  },
  {
    id: "foundations",
    label: { bn: "৪টি মূল মেকানিজম", en: "Four core mechanisms" },
  },
  {
    id: "implementation",
    label: {
      bn: "এক কনটেক্সট বনাম ভাগ করা কনটেক্সট",
      en: "One context vs split contexts",
    },
  },
  {
    id: "matrix",
    label: { bn: "Optimization Matrix", en: "Optimization matrix" },
  },
  {
    id: "takeaway",
    label: { bn: "Production Takeaways", en: "Production takeaways" },
  },
];

export default function ContextPerformance() {
  return (
    <article className="doc-prose">
      {/* ── The problem ───────────────────────────────────────────────── */}
      <H2 id="the-problem" anchorOnly>
        থিম টগলে পুরো ড্যাশবোর্ড ফ্রিজ
      </H2>

      <p>
        রাত ১১:০০। ভুলু ভাই ডার্ক/লাইট থিম টগল বাটন যোগ করেছেন। কিন্তু ক্লিক করলেই পুরো পেজ প্রায়
        ৫০০ মিলিসেকেন্ড ফ্রিজ হয়ে যাচ্ছে। React Profiler চালিয়ে দেখা গেল — থিম বদলালে হেডার,
        সাইডবার, নোটিফিকেশন কার্ড, এমনকি নিচের বিশাল ডেটা টেবিলও রি-রেন্ডার হচ্ছে।
      </p>

      <Line name="ভুলু ভাই">
        ফাহিম! আমি তো শুধু থিম কালার বদলাচ্ছি! ডেটা টেবিলের সাথে থিমের কোনো সম্পর্কই নেই, তাও টেবিল
        নতুন করে রেন্ডার হচ্ছে কেন?
      </Line>

      <Line name="ফাহিম">
        ভুলু ভাই! আপনি থিম, ইউজার প্রোফাইল, ফর্মের স্টেট — সব একটাই বিশাল{" "}
        <code>AppContext</code>-এ রেখেছেন। কনটেক্সটের মেকানিজম হলো: value-র রেফারেন্স বদলালেই ওই
        কনটেক্সট কনজিউম করা <em>প্রতিটি</em> কম্পোনেন্ট রি-রেন্ডার হয়।
      </Line>

      <Line name="নেক্সট-ভাই">
        কনটেক্সট পারফরম্যান্ট রাখতে তিনটি টেকনিক — <strong>context splitting</strong> (state আর
        dispatch আলাদা), <strong>value memoization</strong> (<code>useMemo</code>), আর{" "}
        <strong>bail-out</strong> (<code>React.memo</code> বা children pass-through)। React 19-এ
        তো এখন <code>&lt;Context.Provider&gt;</code>-এর বদলে সরাসরি <code>&lt;Context&gt;</code>{" "}
        ট্যাগও লেখা যায়।
      </Line>

      {/* ── Architecture ──────────────────────────────────────────────── */}
      <H2 id="architecture">১. Context Re-render Propagation</H2>

      <Diagram>{`┌─────────────────────────────────────────────────────────────────────────┐
│                      MONOLITHIC VS SPLIT CONTEXT                        │
└─────────────────────────────────────────────────────────────────────────┘

 ❌ MONOLITHIC CONTEXT (cascading re-renders)
 ┌───────────────────────────────────────────────────────────────────────┐
 │ AppContext value: { theme: 'dark', user: {...}, cart: [...] }         │
 └───────────────────────────────────┬───────────────────────────────────┘
                                     │ (theme changes)
              ┌──────────────────────┼──────────────────────┐
              ▼                      ▼                      ▼
      [header]                [profile card]          [heavy table]
      (uses: theme)           (uses: user)            (uses: cart)
      🔴 re-renders           🔴 re-renders           🔴 re-renders (wasted)

───────────────────────────────────────────────────────────────────────────

 🟢 SPLIT CONTEXT + BAIL-OUT (optimized)
 ┌──────────────────────────────┐     ┌──────────────────────────────┐
 │ ThemeStateContext            │     │ UserStateContext             │
 └──────────────┬───────────────┘     └──────────────┬───────────────┘
                │ (theme changes)                    │ (no change)
                ▼                                    ▼
        [header]                             [heavy table]
        🟢 re-renders                        🟢 bailed out — zero renders`}</Diagram>

      {/* ── Foundations ───────────────────────────────────────────────── */}
      <H2 id="foundations">২. ৪টি মূল মেকানিজম</H2>

      <Note>
        <ul>
          <li>
            <strong>Propagation rule:</strong> <code>useContext(MyContext)</code> যেখানেই আছে, সেই
            কম্পোনেন্ট ওই কনটেক্সটের <em>যেকোনো</em> পরিবর্তনে সাবস্ক্রাইব করে ফেলে — ভ্যালুর
            রেফারেন্স বদলালেই রেন্ডার ট্রিগার হয়।
          </li>
          <li>
            <strong>Context splitting (state vs dispatch):</strong> রিড-অনলি ডেটা আর মিউটেশন
            ফাংশন দুটি আলাদা কনটেক্সটে রাখলে যারা শুধু ফাংশন ডাকে (যেমন টগল বাটন) তারা ডেটা
            বদলালেও রি-রেন্ডার হয় না।
          </li>
          <li>
            <strong>Value memoization:</strong> প্রোভাইডারে সরাসরি অবজেক্ট লিটেরাল দিলে প্রতি
            রেন্ডারে নতুন রেফারেন্স তৈরি হয়। <code>useMemo</code> দিয়ে ভ্যালু মেমোইজ করা বাধ্যতামূলক।
          </li>
          <li>
            <strong>Bail-out patterns:</strong> React Context-এ নেটিভ selector নেই। তবে{" "}
            <code>React.memo</code> করা ইন্টারমিডিয়েট কম্পোনেন্ট বা <code>children</code>{" "}
            pass-through দিয়ে অপ্রয়োজনীয় সাবট্রি রি-রেন্ডার থামানো যায়।
          </li>
        </ul>
      </Note>

      {/* ── Implementation ────────────────────────────────────────────── */}
      <H2 id="implementation">৩. এক কনটেক্সট বনাম ভাগ করা কনটেক্সট</H2>

      <H3>❌ Anti-pattern — সব এক কনটেক্সটে, ভ্যালু আন-মেমোইজড</H3>

      <CodeBlock filename="app/context/bad-app-context.tsx">{`'use client';

import { createContext, useContext, useState, type ReactNode } from 'react';

const BadAppContext = createContext<any>(null);

export function BadAppProvider({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useState('dark');
  const [user, setUser] = useState({ name: 'Zubayer', role: 'Dev' });

  // A brand-new object reference on every parent render
  return (
    <BadAppContext.Provider value={{ theme, setTheme, user, setUser }}>
      {children}
    </BadAppContext.Provider>
  );
}

export function BadTable() {
  // Re-renders whenever theme or setUser changes — even though user did not
  const { user } = useContext(BadAppContext);
  return <div>User: {user.name}</div>;
}`}</CodeBlock>

      <H3>🟢 Fix — split contexts + React 19 provider syntax</H3>

      <CodeBlock filename="app/context/theme-context.tsx">{`'use client';

import { createContext, useCallback, useContext, useState, type ReactNode } from 'react';

type Theme = 'light' | 'dark';

// Split 1 — state only
const ThemeStateContext = createContext<Theme | undefined>(undefined);

// Split 2 — dispatch only, and its identity never changes
const ThemeDispatchContext = createContext<(() => void) | undefined>(undefined);

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useState<Theme>('dark');

  const toggleTheme = useCallback(() => {
    setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'));
  }, []);

  // React 19: <Context> works directly, no .Provider needed
  return (
    <ThemeStateContext value={theme}>
      <ThemeDispatchContext value={toggleTheme}>{children}</ThemeDispatchContext>
    </ThemeStateContext>
  );
}

export function useThemeState() {
  const context = useContext(ThemeStateContext);
  if (!context) throw new Error('useThemeState must be used within ThemeProvider');
  return context;
}

export function useThemeDispatch() {
  const context = useContext(ThemeDispatchContext);
  if (!context) throw new Error('useThemeDispatch must be used within ThemeProvider');
  return context;
}`}</CodeBlock>

      <CodeBlock filename="app/_components/theme-controls.tsx">{`'use client';

import React from 'react';
import { useThemeDispatch, useThemeState } from '../context/theme-context';

// Consumes dispatch only — never re-renders when the theme flips
export const ThemeToggleButton = React.memo(function ThemeToggleButton() {
  const toggleTheme = useThemeDispatch();

  return (
    <button
      onClick={toggleTheme}
      className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white font-medium rounded-xl transition-all"
    >
      Toggle theme
    </button>
  );
});

// Consumes state only — re-renders exactly when the theme changes
export function ThemeDisplay() {
  const theme = useThemeState();

  return (
    <div className="p-4 bg-slate-900 border border-slate-800 rounded-xl text-slate-200">
      Active theme: <span className="font-bold text-indigo-400">{theme}</span>
    </div>
  );
}`}</CodeBlock>

      {/* ── Matrix ────────────────────────────────────────────────────── */}
      <H2 id="matrix">৪. Context Optimization Matrix</H2>

      <Table
        head={["আর্কিটেকচার", "রি-রেন্ডার ইমপ্যাক্ট", "জটিলতা", "উপযুক্ত ক্ষেত্র"]}
        rows={[
          [
            "Monolithic context",
            "সবচেয়ে খারাপ — যেকোনো ফিল্ড বদলালে সব কনজিউমার রি-রেন্ডার",
            "খুব সহজ",
            "ছোট প্রজেক্ট, ৩-৪টি স্থির ভ্যালু",
          ],
          [
            "Memoized single context",
            "মাঝারি — প্যারেন্ট রি-রেন্ডারের প্রভাব আটকায়, স্টেট চেঞ্জের নয়",
            "সহজ",
            "লো-ফ্রিকোয়েন্সি আপডেটের ডেটা",
          ],
          [
            "Split state & dispatch",
            "ভালো — অ্যাকশন কনজিউমাররা ডেটা রি-রেন্ডার থেকে মুক্ত",
            "মাঝারি",
            "থিম, অথেনটিকেশন, মোডাল ম্যানেজার",
          ],
          [
            "Atomic store (Zustand / Jotai)",
            "সর্বোত্তম — ফিল্ড-লেভেল সিলেক্টরে প্রায় শূন্য অপ্রয়োজনীয় রেন্ডার",
            "সহজ-মাঝারি",
            "হাই-ফ্রিকোয়েন্সি চেঞ্জ — ফর্ম ইনপুট, কার্সর, রিয়েল-টাইম চার্ট",
          ],
        ]}
      />

      <Line name="ভুলু ভাই">
        এখন বুঝলাম কেন বাটন ক্লিকে পুরো টেবিল রি-রেন্ডার হতো! স্টেট আর ডিসপ্যাচ আলাদা কনটেক্সটে
        ভাগ করার পর ড্যাশবোর্ড আবার মাখনের মতো স্মুথ।
      </Line>

      {/* ── Takeaways ─────────────────────────────────────────────────── */}
      <H2 id="takeaway">Production Takeaways</H2>

      <Note>
        <ul>
          <li>
            <strong>Split state and actions:</strong> স্টেট আর তার সেটার/ডিসপ্যাচ কখনো এক
            কনটেক্সটে রাখবেন না — আলাদা করলেই UI-এর বড় অংশ অনর্থক রেন্ডার থেকে বেঁচে যায়।
          </li>
          <li>
            <strong>Never pass raw object literals:</strong> প্রোভাইডারে{" "}
            <code>value=&#123;&#123; a, b &#125;&#125;</code> সরাসরি দেবেন না — হয়{" "}
            <code>useMemo</code> করুন, নয়তো primitive ভ্যালু আলাদা কনটেক্সটে দিন।
          </li>
          <li>
            <strong>Know the limits of context:</strong> কনটেক্সট একটি dependency injection টুল,
            পূর্ণাঙ্গ state manager নয়। সেকেন্ডে বহুবার বদলানো ডেটার (রিয়েল-টাইম সার্চ, মাউস
            ট্র্যাকিং) জন্য Zustand বা atomic store ব্যবহার করুন।
          </li>
        </ul>
      </Note>
    </article>
  );
}
