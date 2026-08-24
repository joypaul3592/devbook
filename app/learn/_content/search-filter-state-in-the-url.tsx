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
      bn: "৭টি অক্ষর, ৭টি ডেটাবেস কোয়েরি",
      en: "Seven keystrokes, seven queries",
    },
  },
  {
    id: "architecture",
    label: {
      bn: "Debounced Search & URL Sync Flow",
      en: "Debounced search & URL sync flow",
    },
  },
  {
    id: "mechanics",
    label: { bn: "মূল মেকানিক্স", en: "Core mechanics" },
  },
  {
    id: "native",
    label: { bn: "Approach 1 — Native Hooks", en: "Approach 1: native hooks" },
  },
  {
    id: "nuqs",
    label: { bn: "Approach 2 — nuqs", en: "Approach 2: nuqs" },
  },
  {
    id: "matrix",
    label: { bn: "Technique Comparison", en: "Technique comparison" },
  },
  {
    id: "takeaway",
    label: { bn: "Production Takeaways", en: "Production takeaways" },
  },
];

export default function SearchFilterStateInTheUrl() {
  return (
    <article className="doc-prose">
      {/* ── The problem ───────────────────────────────────────────────── */}
      <H2 id="the-problem" anchorOnly>
        ৭টি অক্ষর, ৭টি ডেটাবেস কোয়েরি
      </H2>

      <p>
        রাত ৪:০০। ভুলু ভাই একটি লাইভ প্রোডাক্ট সার্চ বার তৈরি করেছেন। ইউজার ইনপুট বক্সে
        &quot;MacBook&quot; টাইপ করছে, আর ভুলু ভাই প্রতিবার <code>onChange</code>-এ URL আপডেট
        মারছেন। Network Tab খুলে ফাহিম দেখল — &quot;M-a-c-B-o-o-k&quot; টাইপ করতে করতে ৭টি
        অক্ষরে ৭টি আলাদা নেটওয়ার্ক রিকোয়েস্ট ব্যাকএন্ডে ফায়ার হয়েছে! ডেটাবেস কোয়েরি রেট বেড়ে
        গিয়ে UI ল্যাগ করা শুরু করেছে।
      </p>

      <Line name="ভুলু ভাই">
        ফাহিম! ইউজার খালি ১টা শব্দ টাইপ করল, আর আমার ব্যাকএন্ডে ডেটাবেসের ওপর ৭টা হেভি কোয়েরি
        পড়ে সার্ভার হ্যাং করে ফেলল! ইনপুট ফিল্ডে টাইপ করার সাথে সাথে URL আপডেট করতে গেলে টাইপিং
        ল্যাগ করে কেন?
      </Line>

      <Line name="ফাহিম">
        ভুলু ভাই! প্রতিটা keypress-এ সঙ্গে সঙ্গে URL আপডেট আর সার্ভার রিকোয়েস্ট পাঠানো মারাত্মক
        ব্যাড প্র্যাকটিস। এর সমাধান হলো <strong>Debouncing</strong> — ইউজার টাইপ করা থামানোর
        ৩০০–৫০০ মিলিসেকেন্ড পর কেবল একবার URL আপডেট হবে এবং সার্ভারে রিকোয়েস্ট যাবে।
      </Line>

      <Line name="নেক্সট-ভাই">
        একদম! আর টাইপ-সেফ উপায়ে URL <code>searchParams</code> হ্যান্ডেল করার জন্য ইকোসিস্টেমে{" "}
        <strong>nuqs</strong> (Next.js URL Query State) লাইব্রেরি, অথবা নেটিভ{" "}
        <code>useSearchParams</code> + <code>useTransition</code> প্যাটার্ন ব্যবহার করা হয়।
      </Line>

      {/* ── Architecture ──────────────────────────────────────────────── */}
      <H2 id="architecture">১. Debounced Search &amp; URL Sync Architecture</H2>

      <Diagram>{`┌─────────────────────────────────────────────────────────────────────────┐
│                 DEBOUNCED SEARCH & URL SYNC FLOW                        │
└─────────────────────────────────────────────────────────────────────────┘
                                     │
   [User Types "MacBook"] ────▶ Keystrokes: 'M', 'a', 'c', 'B', 'o', 'o', 'k'
                                     │
   [Debounce Timer (300ms)]──▶ Resets the timer on every keystroke
                               Waits 300ms after the last keypress...
                                     │
   [URL Update Trigger]   ────▶ router.replace('/products?search=MacBook')
                                     │
   [useTransition Pending]────▶ UI shows a subtle loading indicator (no focus loss)
                                     │
   [Server Component]     ────▶ Reads searchParams.search & queries the DB ONCE`}</Diagram>

      {/* ── Mechanics ─────────────────────────────────────────────────── */}
      <H2 id="mechanics">২. মূল মেকানিক্স ও কনসেপ্ট</H2>

      <Note>
        <ul>
          <li>
            <strong>Debouncing Mechanics:</strong> ইউজারের ইনপুট স্ট্রোক ধরে রেখে নির্দিষ্ট
            টাইমআউট (যেমন 300ms) পার হওয়ার পর URL আপডেট করা। এতে ব্যাকএন্ড রিকোয়েস্ট ৮০–৯০%
            কমে যায়।
          </li>
          <li>
            <strong>Focus Preservation:</strong> ইনপুট ফোকাস যেন হারিয়ে না যায়, সে জন্য ইনপুটের
            লোকাল স্টেট (তাৎক্ষণিক আপডেট) আর URL স্টেট (ডিবাউন্সড আপডেট) আলাদা রাখতে হয়।
          </li>
          <li>
            <strong>Non-Blocking UI:</strong> URL আপডেটের সময় সার্ভার রেন্ডারিং চলাকালীন পুরো
            স্ক্রিন যাতে ফ্রিজ না হয়, সে জন্য <code>startTransition</code> ব্যবহার করা হয়।
          </li>
        </ul>
      </Note>

      {/* ── Native ────────────────────────────────────────────────────── */}
      <H2 id="native">৩. Approach 1 — Native Next.js Hooks</H2>

      <H3>useSearchParams + setTimeout + useTransition</H3>

      <CodeBlock filename="components/search-bar.tsx">{`'use client';

import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useState, useEffect, useTransition } from 'react';

export function SearchBar() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  // Local state updates instantly on keypress to keep typing smooth
  const [searchTerm, setSearchTerm] = useState(searchParams.get('search') || '');

  // Debounce effect: sync to the URL only after 300ms of typing inactivity
  useEffect(() => {
    const timer = setTimeout(() => {
      const currentUrlSearch = searchParams.get('search') || '';

      // Only touch the URL if the local term actually changed
      if (searchTerm !== currentUrlSearch) {
        const params = new URLSearchParams(searchParams.toString());

        if (searchTerm.trim()) {
          params.set('search', searchTerm.trim());
        } else {
          params.delete('search');
        }

        // Reset to page 1 on a new search
        params.delete('page');

        startTransition(() => {
          router.replace(\`\${pathname}?\${params.toString()}\`, { scroll: false });
        });
      }
    }, 300);

    return () => clearTimeout(timer); // clear the timer if another key is pressed
  }, [searchTerm, pathname, router, searchParams]);

  return (
    <div className="relative w-full max-w-md">
      <input
        type="text"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        placeholder="Search products..."
        className="w-full bg-slate-900 border border-slate-800 text-slate-100 placeholder-slate-500 text-sm px-4 py-2.5 rounded-xl outline-none focus:border-emerald-500 transition"
      />

      {/* Loading indicator during the server component transition */}
      {isPending && (
        <div className="absolute right-3 top-3">
          <div className="w-4 h-4 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin" />
        </div>
      )}
    </div>
  );
}`}</CodeBlock>

      {/* ── nuqs ──────────────────────────────────────────────────────── */}
      <H2 id="nuqs">৪. Approach 2 — nuqs দিয়ে Type-Safe URL State</H2>

      <CodeBlock label="Bash" filename="install.sh">{`npm install nuqs`}</CodeBlock>

      <CodeBlock filename="components/modern-search-bar.tsx">{`'use client';

import { useQueryState, parseAsString } from 'nuqs';

export function ModernSearchBar() {
  // Works like useState, but syncs with the URL searchParams automatically
  const [search, setSearch] = useQueryState(
    'search',
    parseAsString.withDefault('').withOptions({
      throttleMs: 300, // built-in throttling / debouncing
      shallow: false,  // trigger a server component re-render
      scroll: false,   // don't jump to the top
    })
  );

  return (
    <input
      type="text"
      value={search}
      onChange={(e) => setSearch(e.target.value)}
      placeholder="Search with nuqs..."
      className="w-full bg-slate-900 border border-slate-800 text-slate-100 text-sm px-4 py-2.5 rounded-xl outline-none focus:border-emerald-500"
    />
  );
}`}</CodeBlock>

      {/* ── Matrix ────────────────────────────────────────────────────── */}
      <H2 id="matrix">৫. Technique Comparison Matrix</H2>

      <Table
        head={[
          "ক্রাইটেরিয়া",
          <>
            Native <code>useSearchParams</code>
          </>,
          <code key="n">nuqs</code>,
        ]}
        rows={[
          [
            "Boilerplate",
            "কিছুটা বেশি (কাস্টম timeout/debounce লিখতে হয়)",
            <>
              প্রায় শূন্য — <code>useState</code>-এর মতো API
            </>,
          ],
          [
            "Type safety",
            "ম্যানুয়ালি string থেকে number/boolean কাস্ট করতে হয়",
            "বিল্ট-ইন parser (int, float, boolean, array, JSON)",
          ],
          [
            "Debounce support",
            <>
              ম্যানুয়ালি <code>setTimeout</code> দিয়ে হ্যান্ডেল করতে হয়
            </>,
            <>
              বিল্ট-ইন <code>throttleMs</code> অপশন
            </>,
          ],
          [
            "External dependency",
            "কোনো ডিপেন্ডেন্সি নেই (pure Next.js)",
            "লাইটওয়েট প্যাকেজ যোগ হয়",
          ],
        ]}
      />

      <Line name="ভুলু ভাই">
        দুর্দান্ত সমাধান! ৩০০ms ডিবাউন্স দেওয়াতে এখন ইউজার পুরো শব্দ টাইপ শেষ করার পর মাত্র ১টা
        রিকোয়েস্ট সার্ভারে যাচ্ছে! আর টাইপিংও একদম মাখনের মতো স্মুথ!
      </Line>

      {/* ── Takeaways ─────────────────────────────────────────────────── */}
      <H2 id="takeaway">Production Takeaways</H2>

      <Note>
        <ul>
          <li>
            <strong>Always debounce text inputs:</strong> keypress-এর সাথে সাথে সরাসরি URL স্টেট
            চেঞ্জ করবেন না — ৩০০–৫০০ms ডিবাউন্স নিশ্চিত করুন, নাহলে সার্ভারে কোয়েরি ফ্লাডিং হবে।
          </li>
          <li>
            <strong>Local state vs URL state:</strong> টাইপিং রেসপন্সিভ রাখতে ইভেন্ট হ্যান্ডলারে
            লোকাল <code>useState</code> আপডেট করুন, আর ডিবাউন্সড ইফেক্টের ভেতরে URL{" "}
            <code>searchParams</code> আপডেট করুন।
          </li>
          <li>
            <strong>Use useTransition:</strong> <code>searchParams</code> আপডেটের সাথে{" "}
            <code>startTransition</code> জুড়ে দিলে অ্যাপ ব্যাকগ্রাউন্ডে রেসপন্স ফেচ করে এবং UI
            ল্যাগ না করে স্মুথ লোডার ফিডব্যাক দেখায়।
          </li>
        </ul>
      </Note>
    </article>
  );
}
