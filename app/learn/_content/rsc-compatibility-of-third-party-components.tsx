import {
  CodeBlock,
  Diagram,
  H2,
  H3,
  Line,
  Note,
} from "@/components/learn/DocParts";
import type { Bi } from "@/lib/curriculum";

/** Section anchors — consumed by the "on this page" rail. */
export const headings: { id: string; label: Bi }[] = [
  {
    id: "the-problem",
    label: {
      bn: "React Context is not available",
      en: "React Context is not available",
    },
  },
  {
    id: "mental-model",
    label: {
      bn: "কেন প্যাকেজগুলো ভাঙে",
      en: "Why these packages break",
    },
  },
  {
    id: "motion-wrapper",
    label: {
      bn: "Framer Motion র‍্যাপার",
      en: "The Framer Motion wrapper",
    },
  },
  {
    id: "provider-wrapper",
    label: {
      bn: "থার্ড-পার্টি Provider র‍্যাপার",
      en: "Third-party provider wrapper",
    },
  },
  {
    id: "dynamic-import",
    label: { bn: "ভারী লাইব্রেরি lazy load", en: "Lazy-loading heavy libraries" },
  },
  {
    id: "takeaway",
    label: { bn: "Production Takeaways", en: "Production takeaways" },
  },
];

export default function RscCompatibilityOfThirdPartyComponents() {
  return (
    <article className="doc-prose">
      {/* ── The problem ───────────────────────────────────────────────── */}
      <H2 id="the-problem" anchorOnly>
        React Context is not available
      </H2>

      <p>
        রাত ৯:২০। ভুলু ভাই ল্যান্ডিং পেজে স্মুথ অ্যানিমেশন বসাতে <code>framer-motion</code>
        -এর <code>motion.div</code> সরাসরি সার্ভার কম্পোনেন্ট <code>app/page.tsx</code>-এ
        ইমপোর্ট করলেন। অমনি কনসোলে লাল এরর:
      </p>

      <CodeBlock label="Console" filename="error.txt">{`Uncaught Error: React Context is not available in Server Components.
You're importing a component that needs React Context. It only works in a
Client Component but none of its parents are marked with "use client".`}</CodeBlock>

      <Line name="ভুলু ভাই">
        ফাহিম! Framer Motion তো অফিশিয়াল npm প্যাকেজ! আমি তো কোনো custom hook লিখিনি,
        শুধু একটা <code>&lt;motion.div&gt;</code> রেন্ডার করেছি। তাও সার্ভার কম্পোনেন্টে
        এরর দিয়ে পেজ ফাটল কেন?
      </Line>

      <Line name="ফাহিম">
        ভুলু ভাই! <code>framer-motion</code>, MUI বা Recharts-এর মতো প্যাকেজ ইন্টারনালি{" "}
        <code>useState</code>, <code>useEffect</code> বা React Context ব্যবহার করে। কিন্তু
        তাদের পাবলিশ করা dist ফাইলে <code>&apos;use client&apos;</code> ব্যানার লেখা থাকে
        না! ফলে Next.js ধরে নেয় এগুলো সার্ভার কম্পোনেন্ট — আর সার্ভারে Context পেলেই
        ক্র্যাশ।
      </Line>

      <Line name="নেক্সট-ভাই">
        নিখুঁত ডায়াগনোসিস! সমাধান হলো <strong>Client Wrapper Pattern</strong> (explicit
        re-exporting): থার্ড-পার্টি উপাদানগুলোকে নিজের একটি{" "}
        <code>&apos;use client&apos;</code> ফাইলে মুড়ে নাও, তারপর যেকোনো সার্ভার
        কম্পোনেন্টে নিশ্চিন্তে ব্যবহার করো।
      </Line>

      {/* ── Mental model ──────────────────────────────────────────────── */}
      <H2 id="mental-model">১. কেন ভাঙে — এবং সমাধানের আকৃতি</H2>

      <Diagram>{`❌ DIRECT IMPORT FROM A THIRD-PARTY PACKAGE (no 'use client' banner)
┌──────────────────────────────────────────────────────────────┐
│ app/page.tsx (server component)                              │
│  │                                                           │
│  └── import { motion } from 'framer-motion';                 │
│      └─> CRASHES — the package ships no client directive     │
└──────────────────────────────────────────────────────────────┘

───────────────────────────────────────────────────────────────

🟢 PRODUCTION PATTERN: CLIENT WRAPPER BOUNDARY
┌──────────────────────────────────────────────────────────────┐
│ components/ui/motion.tsx                                     │
│  ├── 'use client'   <-- explicit client boundary             │
│  └── export { motion, AnimatePresence } from 'framer-motion';│
└───────────────────────────┬──────────────────────────────────┘
                            │ safe to import anywhere
                            v
┌──────────────────────────────────────────────────────────────┐
│ app/page.tsx (still a pure server component)                 │
│  └── import { motion } from '@/components/ui/motion';        │
│      └─> works; the page keeps its server capabilities       │
└──────────────────────────────────────────────────────────────┘`}</Diagram>

      {/* ── Motion wrapper ────────────────────────────────────────────── */}
      <H2 id="motion-wrapper">২. Framer Motion র‍্যাপার</H2>

      <CodeBlock filename="components/ui/motion.tsx">{`// 🟢 components/ui/motion.tsx — client boundary wrapper
'use client';

// Re-export the pieces we use, now behind a 'use client' boundary
import { motion, AnimatePresence } from 'framer-motion';

export { motion, AnimatePresence };`}</CodeBlock>

      <CodeBlock filename="app/about/page.tsx">{`// 🟢 app/about/page.tsx (pure server component)
// Import from our wrapper, never from 'framer-motion' directly
import { motion } from '@/components/ui/motion';

export default async function AboutPage() {
  const data = { title: 'About Our Architecture', year: 2026 };

  return (
    <main className="min-h-screen bg-slate-950 p-8 text-slate-100 flex items-center justify-center">
      {/* motion.div runs as a client component while page.tsx stays server-side */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-slate-900 border border-slate-800 p-6 rounded-2xl max-w-md space-y-3"
      >
        <span className="text-xs font-mono text-emerald-400">RSC-compatible motion</span>
        <h1 className="text-xl font-bold">{data.title}</h1>
        <p className="text-xs text-slate-400">
          The page runs on the server; Framer Motion animates on the client.
        </p>
      </motion.div>
    </main>
  );
}`}</CodeBlock>

      {/* ── Provider wrapper ──────────────────────────────────────────── */}
      <H2 id="provider-wrapper">৩. থার্ড-পার্টি Provider (MUI / Theme / React Query)</H2>

      <CodeBlock filename="components/providers/theme-provider.tsx">{`// 🟢 components/providers/theme-provider.tsx
'use client';

import { ThemeProvider as MuiThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';

const darkTheme = createTheme({
  palette: { mode: 'dark' },
});

interface AppThemeProviderProps {
  children: React.ReactNode;
}

// The third-party provider lives inside our own client component
export function AppThemeProvider({ children }: AppThemeProviderProps) {
  return (
    <MuiThemeProvider theme={darkTheme}>
      <CssBaseline />
      {children}
    </MuiThemeProvider>
  );
}`}</CodeBlock>

      <CodeBlock filename="app/layout.tsx">{`// 🟢 app/layout.tsx (server root layout)
import { AppThemeProvider } from '@/components/providers/theme-provider';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="bg-slate-950">
        {/* children stay server components — they arrive through the slot */}
        <AppThemeProvider>{children}</AppThemeProvider>
      </body>
    </html>
  );
}`}</CodeBlock>

      <Line name="ভুলু ভাই">
        আরে চমৎকার! পুরো পেজকে <code>&apos;use client&apos;</code> না বানিয়ে শুধু ছোট{" "}
        <code>motion.tsx</code> আর <code>theme-provider.tsx</code> দিয়ে থার্ড-পার্টি
        মেটেরিয়াল র‍্যাপ করলাম — পেজ লেভেলের সব সার্ভার ডেটা ফেচিং আগের মতোই অক্ষত!
      </Line>

      {/* ── Dynamic import ────────────────────────────────────────────── */}
      <H2 id="dynamic-import">৪. ভারী ক্লায়েন্ট লাইব্রেরি lazy load</H2>

      <CodeBlock filename="app/reports/page.tsx">{`import dynamic from 'next/dynamic';

const HeavyChart = dynamic(() => import('@/components/ui/heavy-chart'), {
  ssr: false, // skip server rendering entirely for a browser-only widget
  loading: () => <p className="text-xs text-slate-500">Loading chart...</p>,
});`}</CodeBlock>

      <Note>
        <p>
          <code>ssr: false</code> শুধু ক্লায়েন্ট কম্পোনেন্ট ফাইলেই ব্যবহার করা যায় — সার্ভার
          কম্পোনেন্টে দিলে Next.js এরর দেবে। তাই ভারী উইজেটটির জন্য একটি ছোট{" "}
          <code>&apos;use client&apos;</code> লোডার ফাইল রাখো।
        </p>
      </Note>

      <H3>র‍্যাপার লাগবে কি না — দ্রুত চেক</H3>

      <p>
        প্যাকেজের <code>dist</code> ফাইলে <code>&apos;use client&apos;</code> ব্যানার আছে
        কি না দেখো:
      </p>

      <CodeBlock label="Bash" filename="check.sh">{`grep -rl "use client" node_modules/framer-motion/dist | head`}</CodeBlock>

      {/* ── Takeaways ─────────────────────────────────────────────────── */}
      <H2 id="takeaway">Production Takeaways</H2>

      <Note>
        <ul>
          <li>
            <strong>একটি উপাদানের জন্য পুরো পেজ ক্লায়েন্ট বানিয়ো না:</strong> শুধু ঐ
            থার্ড-পার্টি অংশটুকুর র‍্যাপার বানিয়ে আইসোলেট করো।
          </li>
          <li>
            <strong>Centralize wrappers:</strong> সব র‍্যাপার এক জায়গায় (
            <code>@/components/ui/motion.tsx</code>,{" "}
            <code>@/components/ui/chart.tsx</code>) রাখো — তাতে টিম ভুল করে অরিজিনাল
            প্যাকেজ থেকে ইমপোর্ট করবে না।
          </li>
          <li>
            <strong>Dynamic import for heavy client libs:</strong> Chart.js, Monaco
            Editor, Three.js প্রথম লোডে দরকার না হলে <code>dynamic()</code> দিয়ে lazy
            load করো।
          </li>
          <li>
            <strong>Providers wrap children, not pages:</strong> প্রোভাইডার র‍্যাপারে{" "}
            <code>children</code> স্লট রাখলে ভেতরের পেজগুলো সার্ভার কম্পোনেন্টই থেকে যায়।
          </li>
        </ul>
      </Note>
    </article>
  );
}
