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
      bn: "মোডাল খুললে ব্যাকগ্রাউন্ড বাঁচে কীভাবে?",
      en: "Keeping the background alive",
    },
  },
  {
    id: "mental-model",
    label: { bn: "প্যাটার্নটি কীভাবে কাজ করে", en: "How the pattern works" },
  },
  {
    id: "structure",
    label: { bn: "ডিরেক্টরি স্ট্রাকচার", en: "Directory structure" },
  },
  {
    id: "implementation",
    label: { bn: "প্রোডাকশন কোড", en: "Production code" },
  },
  {
    id: "flow",
    label: { bn: "আর্কিটেকচারাল ফ্লো", en: "Architectural flow" },
  },
  {
    id: "takeaway",
    label: { bn: "Production Checklist", en: "Production checklist" },
  },
];

export default function PhotoModalPattern() {
  return (
    <article className="doc-prose">
      {/* ── The problem ───────────────────────────────────────────────── */}
      <H2 id="the-problem" anchorOnly>
        মোডাল খুললে ব্যাকগ্রাউন্ড বাঁচে কীভাবে?
      </H2>

      <p>
        রাত ৩:৪৫। ভুলু ভাই আগের টপিক থেকে Intercepting Routes বুঝতে পেরেছেন, কিন্তু একটা
        বাস্তব সমস্যার মুখোমুখি হয়েছেন।
      </p>

      <Line name="ভুলু ভাই">
        নেক্সট-ভাই! আগের টপিকে <code>(.)photos/[id]</code> দিয়ে সুন্দর মোডাল দেখালাম ঠিকই,
        কিন্তু মোডাল চলাকালীন ব্যাকগ্রাউন্ডের ফিড পেজটা কীভাবে অক্ষত রাখা যায় — আর URL বদলালেও
        পেজ লেআউট যেন পুরো ধরে রাখে?
      </Line>

      <Line name="ভুলু ভাই">
        সাধারণ Intercepting Route দিয়ে ব্যাকগ্রাউন্ড লেআউটকে স্লটের মাধ্যমে সাজানো কঠিন হয়ে
        যাচ্ছে। ইনস্টাগ্রাম কীভাবে ইন্টারসেপ্টেড রুট আর প্যারালাল রুট মিলিয়ে পারফেক্ট Photo
        Modal Pattern তৈরি করে?
      </Line>

      <Line name="নেক্সট-ভাই">
        (উৎসাহের সাথে) দুর্দান্ত প্রশ্ন! এখানেই আসে App Router-এর সবচেয়ে অ্যাডভান্সড
        প্যাটার্ন — <strong>Parallel Routes (@modal) আর Intercepting Routes একসাথে</strong>।
        একদিকে প্যারালাল স্লট একাধিক অংশকে পাশাপাশি রেন্ডার করে, অন্যদিকে ইন্টারসেপ্টর URL
        ছিনতাই করে — দুটো মিলিয়ে ওয়ার্ল্ড-ক্লাস অ্যাপ-লাইক নেভিগেশন।
      </Line>

      {/* ── Mental model ──────────────────────────────────────────────── */}
      <H2 id="mental-model">১. প্যাটার্নটি কীভাবে কাজ করে</H2>

      <ul>
        <li>
          <strong>স্বাভাবিক অবস্থায়:</strong> ইউজার মূল পেজে থাকলে <code>@modal</code> স্লট
          খালি — <code>default.tsx</code> সেখানে <code>null</code> রিটার্ন করে।
        </li>
        <li>
          <strong>Soft Navigation:</strong> ফটোতে ক্লিক করলে Next.js URL ছিনতাই করে{" "}
          <code>@modal/(.)photos/[id]/page.tsx</code>-এ পাঠায়। মূল ব্যাকগ্রাউন্ড স্লট অক্ষত
          থাকে, ওপরে ওভারলে রেন্ডার হয়।
        </li>
        <li>
          <strong>Hard Navigation:</strong> সরাসরি URL বা রিফ্রেশে ইন্টারসেপ্টর বাইপাস হয়ে
          মূল স্ট্যান্ডঅ্যালোন <code>app/photos/[id]/page.tsx</code> রেন্ডার হয়।
        </li>
      </ul>

      {/* ── Structure ─────────────────────────────────────────────────── */}
      <H2 id="structure">২. ডিরেক্টরি স্ট্রাকচার</H2>

      <Diagram>{`app/
 ├── layout.tsx              <-- Root layout (accepts children & modal slots)
 ├── page.tsx                <-- Main feed / gallery page
 ├── default.tsx             <-- Default for the root children slot
 ├── @modal/                 <-- Parallel route slot
 │    ├── default.tsx        <-- Unmatched state (returns null)
 │    └── (.)photos/         <-- Intercepting route INSIDE the parallel slot
 │         └── [id]/page.tsx <-- Modal rendered inside the slot
 └── photos/
      └── [id]/page.tsx      <-- Standalone full page (hard navigation)`}</Diagram>

      {/* ── Implementation ────────────────────────────────────────────── */}
      <H2 id="implementation">৩. প্রোডাকশন কোড</H2>

      <H3>A — Root layout</H3>

      <CodeBlock filename="app/layout.tsx">{`export default function RootLayout({
  children,
  modal,
}: {
  children: React.ReactNode;
  modal: React.ReactNode;
}) {
  return (
    <html lang="bn">
      <body className="bg-slate-950 text-slate-100 min-h-screen">
        {/* Main content area */}
        <div className="container mx-auto p-6">{children}</div>

        {/* Parallel slot — renders the modal overlay when active */}
        <div>{modal}</div>
      </body>
    </html>
  );
}`}</CodeBlock>

      <H3>B — Slot fallback</H3>

      <CodeBlock filename="app/@modal/default.tsx">{`export default function DefaultModal() {
  // Return null so nothing renders in the @modal slot by default
  return null;
}`}</CodeBlock>

      <H3>C — Feed page</H3>

      <CodeBlock filename="app/page.tsx">{`import Link from 'next/link';

export default function GalleryPage() {
  const photos = [
    { id: '1', title: "Sunset at Cox's Bazar", color: 'from-amber-500 to-red-600' },
    { id: '2', title: 'Sreemangal Tea Garden', color: 'from-emerald-500 to-teal-700' },
    { id: '3', title: 'Sundarbans Mangrove', color: 'from-green-600 to-emerald-900' },
  ];

  return (
    <main className="space-y-6">
      <h1 className="text-3xl font-extrabold tracking-tight">Photo Gallery Feed</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {photos.map((photo) => (
          <Link
            key={photo.id}
            href={\`/photos/\${photo.id}\`}
            className={\`h-48 rounded-2xl bg-gradient-to-br \${photo.color} p-4 flex flex-col justify-end shadow-lg hover:scale-[1.02] transition-transform border border-white/10\`}
          >
            <span className="text-xs uppercase font-semibold text-white/80">
              Photo #{photo.id}
            </span>
            <span className="text-lg font-bold text-white">{photo.title}</span>
          </Link>
        ))}
      </div>
    </main>
  );
}`}</CodeBlock>

      <H3>D — স্লটের ভেতর ইন্টারসেপ্টেড মোডাল</H3>

      <CodeBlock filename="app/@modal/(.)photos/[id]/page.tsx">{`'use client';

import { use, useEffect } from 'react';
import { useRouter } from 'next/navigation';

interface ModalProps {
  params: Promise<{ id: string }>;
}

export default function PhotoModal({ params }: ModalProps) {
  const router = useRouter();
  const { id } = use(params);

  // Close the modal on Escape
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') router.back();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [router]);

  return (
    <div
      className="fixed inset-0 bg-black/80 backdrop-blur-md z-50 flex items-center justify-center p-4"
      onClick={() => router.back()}
    >
      <div
        className="bg-slate-900 border border-slate-800 rounded-3xl max-w-xl w-full p-6 space-y-4 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between">
          <span className="text-xs font-mono bg-blue-500/10 text-blue-400 px-2.5 py-1 rounded-full border border-blue-500/20">
            Intercepted modal slot
          </span>
          <button onClick={() => router.back()} className="text-slate-400 hover:text-white p-1">
            ✕
          </button>
        </div>

        <div className="h-64 w-full bg-gradient-to-tr from-indigo-600 to-purple-600 rounded-2xl flex flex-col items-center justify-center text-white p-4 text-center">
          <span className="text-4xl mb-2">📸</span>
          <h2 className="text-2xl font-bold">Interactive photo view #{id}</h2>
        </div>

        <p className="text-sm text-slate-300">
          URL বদলে /photos/{id} হয়েছে, কিন্তু পেছনের ফিড পেজ একই স্ক্রোল পজিশনে রয়ে গেছে!
        </p>
      </div>
    </div>
  );
}`}</CodeBlock>

      <H3>E — স্ট্যান্ডঅ্যালোন ফুল পেজ</H3>

      <CodeBlock filename="app/photos/[id]/page.tsx">{`interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function StandalonePhotoPage({ params }: PageProps) {
  const { id } = await params;

  return (
    <div className="max-w-2xl mx-auto py-12 space-y-6">
      <div className="border-b border-slate-800 pb-4">
        <span className="text-xs font-mono text-purple-400 uppercase tracking-widest">
          Standalone full route page
        </span>
        <h1 className="text-3xl font-bold mt-1">Photo detailed view #{id}</h1>
      </div>

      <div className="h-80 w-full bg-slate-800 rounded-3xl flex items-center justify-center text-slate-500 text-xl border border-slate-700">
        Full screen high-resolution image #{id}
      </div>
    </div>
  );
}`}</CodeBlock>

      {/* ── Flow ──────────────────────────────────────────────────────── */}
      <H2 id="flow">৪. আর্কিটেকচারাল ফ্লো</H2>

      <Diagram>{`               [ Link clicked: /photos/1 ]
                          │
            ┌─────────────┴─────────────┐
            ▼                           ▼
  [ Soft Navigation ]           [ Hard Navigation ]
 (inside app via <Link>)      (page reload / direct URL)
            │                           │
            ▼                           ▼
 Parallel slot active:         Interception bypassed:
 renders @modal/(.)photos      renders app/photos/[id]/page
            │                           │
            ▼                           ▼
 [ Modal over main feed ]      [ Full standalone page ]`}</Diagram>

      <Line name="ভুলু ভাই">
        (অত্যন্ত আনন্দিত হয়ে) জাস্ট মাইন্ড-ব্লোয়িং! <code>@modal</code> স্লটের কারণে মূল
        ফিড ব্যাকগ্রাউন্ডে অক্ষত থাকে, ইন্টারসেপ্টিং রুটের কারণে URL বদলে ইনস্টাগ্রামের মতো
        মোডাল খোলে, আর <code>default.tsx</code> স্লট খালি রেখে স্বাভাবিক সময়ে ঝামেলা এড়ায়!
      </Line>

      <Line name="নেক্সট-ভাই">
        চমৎকার! টুইটার/এক্স, ফেসবুক, ইনস্টাগ্রাম — সবাই এই Combining Pattern দিয়েই তাদের
        পপ-আপ ও ইন্টারঅ্যাক্টিভ লেআউট বানায়।
      </Line>

      {/* ── Takeaways ─────────────────────────────────────────────────── */}
      <H2 id="takeaway">Production Checklist</H2>

      <Note>
        <ul>
          <li>
            <strong>default.tsx মিস করবেন না:</strong> প্যারালাল স্লটের ফোল্ডারে (যেমন{" "}
            <code>@modal</code>) সবসময় একটি <code>default.tsx</code> রাখুন যা{" "}
            <code>null</code> রিটার্ন করে — নাহলে হার্ড নেভিগেশনে ৪০৪ আসতে পারে।
          </li>
          <li>
            <strong>Keyboard Accessibility:</strong> মোডালে Escape কি-প্রেস হ্যান্ডেল করে{" "}
            <code>router.back()</code> কল করুন।
          </li>
        </ul>
      </Note>
    </article>
  );
}
