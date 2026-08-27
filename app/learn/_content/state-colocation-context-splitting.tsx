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
      bn: "এক কনটেক্সটে সব, তাই সবাই রি-রেন্ডার",
      en: "One context, so everything re-renders",
    },
  },
  {
    id: "architecture",
    label: {
      bn: "Context cascade বনাম split আর্কিটেকচার",
      en: "Context cascade vs split architecture",
    },
  },
  {
    id: "foundations",
    label: { bn: "২টি মূল স্তম্ভ", en: "Two pillars" },
  },
  {
    id: "implementation",
    label: {
      bn: "Monolithic বনাম Colocated + Split",
      en: "Monolithic vs colocated and split",
    },
  },
  {
    id: "matrix",
    label: { bn: "Decision Matrix", en: "Decision matrix" },
  },
  {
    id: "takeaway",
    label: { bn: "Production Takeaways", en: "Production takeaways" },
  },
];

export default function StateColocationContextSplitting() {
  return (
    <article className="doc-prose">
      {/* ── The problem ───────────────────────────────────────────────── */}
      <H2 id="the-problem" anchorOnly>
        এক কনটেক্সটে সব, তাই সবাই রি-রেন্ডার
      </H2>

      <p>
        রাত ৮:৩০। ভুলু ভাই পুরো অ্যাপের স্টেট সামলাতে একটি বিশাল <code>GlobalContext</code>{" "}
        বানিয়েছেন — <code>user</code>, <code>theme</code>, <code>cart</code>,{" "}
        <code>searchQuery</code> সব একসাথে। এখন সার্চ বক্সে একটি অক্ষর টাইপ করলেই ড্যাশবোর্ডের ৫০টি
        কম্পোনেন্ট একযোগে রি-রেন্ডার হচ্ছে।
      </p>

      <Line name="ভুলু ভাই">
        ফাহিম! প্রপ ড্রিলিং থেকে বাঁচতে গ্লোবাল কনটেক্সট ব্যবহার করলাম। কিন্তু টাইপ করলেই পুরো পেজ
        লাফাচ্ছে কেন? <code>React.memo</code> দিয়েও তো লাভ হচ্ছে না!
      </Line>

      <Line name="ফাহিম">
        ভুলু ভাই! কনটেক্সটের ভ্যালু বদলালে তার সব <code>useContext</code> কনজিউমার বাধ্যতামূলকভাবে
        রি-রেন্ডার হয়। <code>React.memo</code> এখানে কাজে আসে না — কারণ{" "}
        <code>useContext</code> প্রপস তুলনার পথ ধরে আসে না, সরাসরি সাবস্ক্রিপশন থেকে রেন্ডার ট্রিগার
        করে।
      </Line>

      <Line name="নেক্সট-ভাই">
        একে বলে <strong>context re-render cascade</strong>। সমাধান দুটি আর্কিটেকচারাল প্যাটার্ন —{" "}
        <strong>state colocation</strong> (স্টেটকে ব্যবহারের সবচেয়ে কাছে রাখা) আর{" "}
        <strong>context splitting</strong> (state আর dispatch আলাদা কনটেক্সটে ভাগ করা)।
      </Line>

      {/* ── Architecture ──────────────────────────────────────────────── */}
      <H2 id="architecture">১. Cascade বনাম Split Architecture</H2>

      <Diagram>{`┌─────────────────────────────────────────────────────────────────────────┐
│                    CONTEXT RE-RENDER CASCADE PROBLEM                    │
└─────────────────────────────────────────────────────────────────────────┘

 ❌ MONOLITHIC CONTEXT
 ┌───────────────────────────────────────────────────────────────────────┐
 │ provider value: { user, theme, searchQuery }                          │
 └──────────────────────────────────┬────────────────────────────────────┘
                                    │ (searchQuery changes)
          ┌─────────────────────────┼─────────────────────────┐
          ▼                         ▼                         ▼
   <SearchInput />           <UserProfile />            <ThemeToggle />
   🔴 re-renders             🔴 wasted render           🔴 wasted render
   (needs searchQuery)       (only needs user)          (only needs theme)

───────────────────────────────────────────────────────────────────────────

 🟢 COLOCATED STATE + SPLIT CONTEXT
 ┌───────────────────────────────────────────────────────────────────────┐
 │ SearchInput keeps searchQuery local          (state colocation)       │
 │ ThemeProvider splits into state + dispatch   (context splitting)      │
 └──────────────────────────────────┬────────────────────────────────────┘
                                    │ (theme toggled)
          ┌─────────────────────────┴─────────────────────────┐
          ▼                                                   ▼
   <ThemeToggle />                                     <ThemedCard />
   🟢 consumes dispatch only — never re-renders        🔴 consumes state — re-renders`}</Diagram>

      {/* ── Foundations ───────────────────────────────────────────────── */}
      <H2 id="foundations">২. ২টি মূল স্তম্ভ</H2>

      <Note>
        <ul>
          <li>
            <strong>State colocation (push state down):</strong> যে স্টেট পুরো অ্যাপের জানার দরকার
            নেই — ড্রপডাউন খোলা/বন্ধ, ইনপুটের টেক্সট, মোডাল স্টেট — সেটিকে গ্লোবাল কনটেক্সটে না তুলে
            ব্যবহারের নিকটতম কম্পোনেন্টে রাখুন। এটি বিনামূল্যের অপটিমাইজেশন।
          </li>
          <li>
            <strong>Context splitting (data vs dispatch):</strong> গ্লোবাল কনটেক্সট লাগলেই{" "}
            <em>state context</em> আর <em>dispatch context</em> আলাদা করুন।{" "}
            <code>setState</code> বা <code>useCallback</code>-করা dispatch-এর রেফারেন্স স্থির
            থাকে, তাই যেসব কম্পোনেন্ট শুধু অ্যাকশন ডাকে (বাটন) তারা স্টেট বদলালেও রি-রেন্ডার হয় না।
          </li>
        </ul>
      </Note>

      {/* ── Implementation ────────────────────────────────────────────── */}
      <H2 id="implementation">৩. Monolithic বনাম Colocated + Split</H2>

      <H3>❌ Anti-pattern — সব এক কনটেক্সটে</H3>

      <CodeBlock filename="app/context/bad-global-context.tsx">{`'use client';

import { createContext, useContext, useState, type ReactNode } from 'react';

interface GlobalContextType {
  user: { name: string } | null;
  theme: 'light' | 'dark';
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  toggleTheme: () => void;
}

const GlobalContext = createContext<GlobalContextType | null>(null);

export function BadGlobalProvider({ children }: { children: ReactNode }) {
  const [user] = useState({ name: 'Zubayer' });
  const [theme, setTheme] = useState<'light' | 'dark'>('dark');
  const [searchQuery, setSearchQuery] = useState('');

  const toggleTheme = () => setTheme((t) => (t === 'light' ? 'dark' : 'light'));

  // A new value object on every keystroke and every theme flip
  return (
    <GlobalContext.Provider
      value={{ user, theme, searchQuery, setSearchQuery, toggleTheme }}
    >
      {children}
    </GlobalContext.Provider>
  );
}

// Only changes the theme, yet re-renders while the user types in the search box
export function BadThemeToggleButton() {
  const context = useContext(GlobalContext);
  console.log('BadThemeToggleButton re-rendered');

  return (
    <button onClick={context?.toggleTheme} className="px-3 py-1 bg-slate-800 text-xs rounded">
      Toggle theme ({context?.theme})
    </button>
  );
}`}</CodeBlock>

      <H3>🟢 Fix — লোকাল স্টেট + ভাগ করা কনটেক্সট</H3>

      <CodeBlock filename="app/context/theme-context.tsx">{`'use client';

import { createContext, useCallback, useContext, useState, type ReactNode } from 'react';

// Split 1 — the value
const ThemeStateContext = createContext<'light' | 'dark'>('dark');
// Split 2 — the action, whose reference never changes
const ThemeDispatchContext = createContext<(() => void) | null>(null);

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useState<'light' | 'dark'>('dark');

  const toggleTheme = useCallback(() => {
    setTheme((prev) => (prev === 'light' ? 'dark' : 'light'));
  }, []);

  return (
    <ThemeStateContext.Provider value={theme}>
      <ThemeDispatchContext.Provider value={toggleTheme}>
        {children}
      </ThemeDispatchContext.Provider>
    </ThemeStateContext.Provider>
  );
}

export const useThemeState = () => useContext(ThemeStateContext);

export const useThemeDispatch = () => {
  const dispatch = useContext(ThemeDispatchContext);
  if (!dispatch) throw new Error('useThemeDispatch must be used within ThemeProvider');
  return dispatch;
};`}</CodeBlock>

      <CodeBlock filename="app/_components/theme-consumers.tsx">{`'use client';

import { useState } from 'react';
import { useThemeDispatch, useThemeState } from '../context/theme-context';

// Consumes dispatch only — never re-renders when the theme changes
export function OptimizedThemeButton() {
  const toggleTheme = useThemeDispatch();
  console.log('OptimizedThemeButton rendered once');

  return (
    <button
      onClick={toggleTheme}
      className="px-3 py-1 bg-indigo-600 text-white font-medium rounded-lg text-sm"
    >
      Toggle theme
    </button>
  );
}

// Consumes state only — re-renders exactly when the theme changes
export function ThemedCard() {
  const theme = useThemeState();

  return (
    <div
      className={\`p-4 rounded-xl border \${
        theme === 'dark'
          ? 'bg-slate-900 border-slate-800 text-slate-100'
          : 'bg-white border-slate-200 text-slate-900'
      }\`}
    >
      Active theme: <strong className="capitalize">{theme}</strong>
    </div>
  );
}

// Colocated: the search query belongs here, not in a global context
export function ColocatedSearchInput() {
  const [query, setQuery] = useState('');

  return (
    <div className="space-y-2">
      <input
        type="text"
        placeholder="Search (colocated state)..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        className="w-full p-3 bg-slate-900 border border-slate-800 rounded-xl text-sm text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
      />
      <p className="text-xs text-slate-500">
        Typing here reaches no other component in the tree.
      </p>
    </div>
  );
}`}</CodeBlock>

      {/* ── Matrix ────────────────────────────────────────────────────── */}
      <H2 id="matrix">৪. State Management Decision Matrix</H2>

      <Table
        head={["স্টেটের স্কোপ", "প্রস্তাবিত আর্কিটেকচার", "পারফরম্যান্স প্রভাব"]}
        rows={[
          [
            "ফর্ম ইনপুট, ড্রপডাউন, ট্যাব",
            <>
              Colocated local state (<code>useState</code>)
            </>,
            "সেরা 🟢 — বাইরের কোনো কম্পোনেন্ট রেন্ডার হয় না",
          ],
          [
            "থিম, auth ডেটা, locale",
            "Split context (state + dispatch)",
            "নিয়ন্ত্রিত 🟢 — শুধু data consumer রেন্ডার হয়, dispatcher নয়",
          ],
          [
            "জটিল অ্যাপ-ওয়াইড ডেটা (cart, realtime feed)",
            "External store (Zustand / Redux)",
            "সর্বোত্তম ⚡ — selector দিয়ে ফিল্ড-লেভেল সাবস্ক্রিপশন",
          ],
        ]}
      />

      <Line name="ভুলু ভাই">
        চমৎকার! ইনপুট ফিল্ডের মতো জিনিস কনটেক্সট থেকে সরিয়ে কম্পোনেন্টেই কলোকেট করব, আর কনটেক্সট
        লাগলে state আর dispatch দুটো ভাগে রাখব।
      </Line>

      {/* ── Takeaways ─────────────────────────────────────────────────── */}
      <H2 id="takeaway">Production Takeaways</H2>

      <Note>
        <ul>
          <li>
            <strong>Colocate first:</strong> কোনো স্টেট যদি একটি কম্পোনেন্ট বা তার সাবট্রি ছাড়া কারো
            না লাগে, সেটি কনটেক্সটে তুলবেন না।
          </li>
          <li>
            <strong>Split context for dispatchers:</strong> state আর setter দুটি আলাদা প্রোভাইডারে
            রাখলে অ্যাকশন-কনজিউমাররা সম্পূর্ণ রেন্ডার-মুক্ত থাকে।
          </li>
          <li>
            <strong>Avoid raw object values:</strong>{" "}
            <code>value=&#123;&#123; a, b &#125;&#125;</code> সরাসরি না দিয়ে primitive পাস করুন বা{" "}
            <code>useMemo</code> দিয়ে ভ্যালু মেমোইজ করুন।
          </li>
        </ul>
      </Note>
    </article>
  );
}
