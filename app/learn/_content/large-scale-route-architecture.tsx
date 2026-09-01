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
      bn: "app/ ফোল্ডারে ১০০ ফাইলের জঙ্গল",
      en: "A hundred files in app/",
    },
  },
  {
    id: "architecture",
    label: {
      bn: "ডোমেইন-ভিত্তিক রাউট কাঠামো",
      en: "A domain-shaped route tree",
    },
  },
  {
    id: "mechanisms",
    label: {
      bn: "৩টি রাউটিং রুল",
      en: "Three routing rules",
    },
  },
  {
    id: "implementation",
    label: {
      bn: "Parallel slot ও intercepting modal",
      en: "Parallel slots & intercepted modals",
    },
  },
  {
    id: "matrix",
    label: { bn: "চারটি রাউট প্যাটার্ন", en: "Four routing patterns" },
  },
  {
    id: "takeaway",
    label: { bn: "Production Takeaways", en: "Production takeaways" },
  },
];

export default function LargeScaleRouteArchitecture() {
  return (
    <article className="doc-prose">
      {/* ── The problem ───────────────────────────────────────────────── */}
      <H2 id="the-problem" anchorOnly>
        app/ ফোল্ডারে ১০০ ফাইলের জঙ্গল
      </H2>

      <p>
        সন্ধ্যা ৬:২০। প্রজেক্ট বড় হতে হতে <code>src/app</code>-এ এখন একশোর বেশি ফাইল ও ফোল্ডার —
        কোনটা পেজ, কোনটা ইউটিলিটি, কোনটা মোডাল, বোঝার উপায় নেই। সবচেয়ে বড় সমস্যা: &ldquo;ম্যাচ
        ডিটেইলস&rdquo; মোডালটি URL সহ খোলার কাস্টম লজিক লিখতে গিয়ে রাউটিং ফ্লো পেঁচিয়ে গেছে, আর
        রিফ্রেশ দিলে ইউজার ৪০৪ দেখছেন।
      </p>

      <Line name="ভুলু ভাই">
        ফাহিম! <code>app/</code> ফোল্ডার একদম কুরুক্ষেত্র হয়ে গেছে! আর ফেসবুকের মতো URL ঠিক রেখে UI-এর
        ওপর মোডাল ভাসানো — সেটা <code>useState</code> দিয়ে করতে গিয়ে অবস্থা আরও খারাপ।
      </Line>

      <Line name="ফাহিম">
        ভুলু ভাই! লার্জ-স্কেল রাউটিংয়ের মূল হাতিয়ার চারটি — route group{" "}
        <code>(group)</code>, private folder <code>_folder</code>, parallel route{" "}
        <code>@slot</code>, আর intercepting route <code>(.)</code>। মোডালের জন্য{" "}
        <code>useState</code> নয়, শেষ দুটোই আসল সমাধান।
      </Line>

      <Line name="নেক্সট-ভাই">
        একদম! Intercepting route-এর সৌন্দর্যটা হলো — অ্যাপের ভেতর থেকে ক্লিক করলে মোডাল ভাসে,
        কিন্তু সেই একই লিংক নতুন ট্যাবে খুললে বা রিফ্রেশ দিলে পুরো পেজ লোড হয়। একটাই URL, দুই রকম
        উপস্থাপন।
      </Line>

      {/* ── Architecture ──────────────────────────────────────────────── */}
      <H2 id="architecture">১. Domain-Driven Route Tree</H2>

      <Diagram>{`src/app/
├── (auth)/                    ──► route group — invisible in the URL
│   ├── layout.tsx             ──► a bare, centred auth shell
│   └── login/page.tsx         ──► /login
│
├── (dashboard)/               ──► a different layout, same URL space
│   ├── layout.tsx             ──► sidebar + nav shell, receives the slot
│   ├── @modal/                ──► parallel route slot
│   │   ├── default.tsx        ──► renders null when no modal is active
│   │   └── (.)match/[id]/     ──► intercepts /match/:id on soft navigation
│   │       └── page.tsx
│   ├── _components/           ──► private folder — never a route
│   │   └── DashboardCard.tsx
│   └── match/[id]/page.tsx    ──► /match/101 — the full page on hard load
│
└── api/                       ──► route handlers

  URLs stay clean; the layout tree does the organising`}</Diagram>

      {/* ── Mechanisms ────────────────────────────────────────────────── */}
      <H2 id="mechanisms">২. কোর রাউটিং রুল</H2>

      <p>
        <strong>Route groups isolate layouts, not URLs:</strong> প্যারেন্থেসিসে মোড়া ফোল্ডার URL-এ
        দেখা যায় না। <code>(marketing)</code> আর <code>(dashboard)</code> সম্পূর্ণ আলাদা লেআউট পাবে,
        অথচ পথ থাকবে পরিষ্কার — <code>/about</code>, <code>/stats</code>। অ্যাক্সেস কন্ট্রোলের জন্যও
        এটি সুবিধাজনক: পাবলিক আর প্রোটেক্টেড রাউট আলাদা গ্রুপে থাকলে middleware-এর matcher সহজ হয়।
      </p>

      <p>
        <strong>Private folders keep app/ honest:</strong> <code>app/</code>-এর ভেতরে পেজ ছাড়া অন্য
        কিছু রাখতে হলে ফোল্ডারের নাম আন্ডারস্কোর দিয়ে শুরু করুন (<code>_components</code>)। তাহলে
        Next.js সেটিকে রাউট ভাববে না, আর কো-লোকেশনের সুবিধাও পাওয়া যাবে।
      </p>

      <p>
        <strong>Parallel + intercepting = contextual modals:</strong> <code>@modal</code> স্লট
        লেআউটে একটি আলাদা prop হিসেবে আসে, আর <code>(.)</code> প্রিফিক্স বলে দেয়
        &ldquo;এই লেভেলের রাউটটি ধরে ফেলো&rdquo;। ফলে ব্যাকগ্রাউন্ড পেজ অক্ষত থাকে, URL বদলায়, আর
        ব্যাক বাটন যা করার কথা তাই করে।
      </p>

      {/* ── Implementation ────────────────────────────────────────────── */}
      <H2 id="implementation">৩. Production Code Implementation</H2>

      <H3>🟢 Step 1 — লেআউট স্লট গ্রহণ করে</H3>

      <CodeBlock filename="src/app/(dashboard)/layout.tsx">{`// 🟢 PRODUCTION PATTERN: the @modal folder arrives as a named prop
import type { ReactNode } from 'react';

interface DashboardLayoutProps {
  children: ReactNode;
  modal: ReactNode; // 🟢 matches the folder name: @modal
}

export default function DashboardLayout({ children, modal }: DashboardLayoutProps) {
  return (
    <div className="relative flex min-h-screen flex-col">
      <nav className="border-b bg-slate-900 p-4 font-bold text-white">
        Sports Analytics Dashboard
      </nav>

      <main className="flex-1 p-6">{children}</main>

      {/* the slot renders above the page, without unmounting it */}
      {modal}
    </div>
  );
}`}</CodeBlock>

      <H3>🟢 Step 2 — স্লটের ডিফল্ট</H3>

      <CodeBlock filename="src/app/(dashboard)/@modal/default.tsx">{`// 🟢 PRODUCTION PATTERN: without this file a hard refresh 404s the whole page.
//    Next.js needs to know what the slot renders when nothing has matched it.
export default function ModalDefault() {
  return null;
}`}</CodeBlock>

      <H3>🟢 Step 3 — intercepted modal</H3>

      <CodeBlock filename="src/app/(dashboard)/@modal/(.)match/[id]/page.tsx">{`// 🟢 PRODUCTION PATTERN: shown only on soft navigation from inside the app
import { getMatch } from '@/features/matches';
import { ModalShell } from '../../../_components/ModalShell';

interface MatchModalProps {
  params: Promise<{ id: string }>;
}

export default async function MatchModalPage({ params }: MatchModalProps) {
  const { id } = await params;
  const match = await getMatch(id);

  return (
    <ModalShell title="Match quick details">
      <p className="mb-4 text-sm text-slate-500">Match #{id}</p>
      <p className="text-center font-semibold">
        {match.home} vs {match.away}
      </p>
    </ModalShell>
  );
}`}</CodeBlock>

      <CodeBlock filename="src/app/(dashboard)/_components/ModalShell.tsx">{`// 🟢 PRODUCTION PATTERN: a private component — this folder is never routable
'use client';

import type { ReactNode } from 'react';
import { useRouter } from 'next/navigation';

export function ModalShell({ title, children }: { title: string; children: ReactNode }) {
  const router = useRouter();

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm"
      // 🟢 back(), not push(): dismissing a modal should undo the navigation
      //    that opened it, so the back button stays truthful
      onClick={() => router.back()}
    >
      <div
        className="w-full max-w-lg rounded-xl bg-white p-6 shadow-2xl dark:bg-slate-800"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="mb-2 text-xl font-bold">{title}</h2>
        {children}
      </div>
    </div>
  );
}`}</CodeBlock>

      <p>
        একই <code>getMatch(id)</code> ফাংশন <code>match/[id]/page.tsx</code>-ও ব্যবহার করবে। ফলে
        একই URL দুই রকম উপস্থাপন পায় — মোডাল আর পুরো পেজ — কিন্তু ডাটা লজিক একটাই থাকে।
      </p>

      {/* ── Matrix ────────────────────────────────────────────────────── */}
      <H2 id="matrix">৪. Routing Pattern Matrix</H2>

      <Table
        head={["প্যাটার্ন", "সিনট্যাক্স", "URL-এ প্রভাব", "ব্যবহার"]}
        rows={[
          [
            "Route group",
            "(folder)",
            "কোনো প্রভাব নেই 🟢",
            "লেআউট আইসোলেশন, অ্যাক্সেস কন্ট্রোল",
          ],
          [
            "Private folder",
            "_folder",
            "রাউটেবল নয় 🟢",
            "কো-লোকেটেড কম্পোনেন্ট ও হেল্পার",
          ],
          [
            "Parallel route",
            "@slot",
            "URL-এ দেখা যায় না",
            "একই লেআউটে একাধিক স্বাধীন অংশ",
          ],
          [
            "Intercepting route",
            "(.)folder",
            "URL বদলায়, পেজ স্টেট থাকে 🟢",
            "শেয়ারযোগ্য লিংকসহ মোডাল",
          ],
        ]}
      />

      <Line name="ভুলু ভাই">
        অসাধারণ ফাহিম! আগে মোডালের জন্য URL স্টেট আর কাস্টম hook মিলিয়ে খিচুড়ি বানিয়েছিলাম। এখন
        route group, slot আর intercepting route দিয়ে সব পরিষ্কার — লিংক শেয়ারও করা যাচ্ছে, রিফ্রেশেও
        ৪০৪ নেই!
      </Line>

      {/* ── Takeaways ─────────────────────────────────────────────────── */}
      <H2 id="takeaway">Production Takeaways</H2>

      <Note>
        <ul>
          <li>
            <strong>Keep app/ routing-only:</strong> <code>page.tsx</code>,{" "}
            <code>layout.tsx</code>, <code>error.tsx</code> আর প্রাইভেট ফোল্ডার — এর বাইরে সব{" "}
            <code>src/features/</code>-এ।
          </li>
          <li>
            <strong>Every slot needs a default.tsx:</strong> parallel route ব্যবহার করলে প্রতিটি
            স্লটে <code>default.tsx</code> রাখুন, নইলে হার্ড রিফ্রেশে পুরো পেজ ৪০৪ হবে।
          </li>
          <li>
            <strong>Dismiss modals with router.back():</strong> intercepted মোডাল বন্ধ করতে{" "}
            <code>back()</code> ব্যবহার করুন — <code>push()</code> করলে ব্রাউজার হিস্ট্রি মিথ্যা
            বলতে শুরু করে।
          </li>
        </ul>
      </Note>
    </article>
  );
}
