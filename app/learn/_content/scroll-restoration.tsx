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
      bn: "ফিল্টার বদলালেই পেজ টপে লাফ দেয়",
      en: "Every filter change jumps to the top",
    },
  },
  {
    id: "architecture",
    label: { bn: "Scroll Behavior Lifecycle", en: "Scroll behaviour lifecycle" },
  },
  {
    id: "implementation",
    label: { bn: "স্ক্রল জাম্প বন্ধ করা", en: "Stopping the scroll jump" },
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

export default function ScrollRestoration() {
  return (
    <article className="doc-prose">
      {/* ── The problem ───────────────────────────────────────────────── */}
      <H2 id="the-problem" anchorOnly>
        ফিল্টার বদলালেই পেজ টপে লাফ দেয়
      </H2>

      <p>
        রাত ৪:১০। ভুলু ভাই একটি ফিড পেজ ও ড্যাশবোর্ড ট্যাব আর্কিটেক্ট করেছেন। ফিডের মাঝামাঝি
        স্ক্রল করে ইউজার যখন একটি ফিল্টার ড্রপডাউনে ক্লিক করছেন বা সাব-ট্যাবে সুইচ করছেন,
        অমনি পুরো পেজ লাফ দিয়ে টপে (<code>scrollTop: 0</code>) চলে যাচ্ছে!
      </p>

      <Line name="ভুলু ভাই">
        ফাহিম! পেজ তো দারুণ ফিল্টার হচ্ছে, কিন্তু ইউজার অভিজ্ঞতা পুরো ছারখার! মিডল পেজে ফিল্টার
        চেঞ্জ করলে স্ক্রল টপে চলে যাচ্ছে কেন? আর ব্রাউজার ব্যাক বাটনে আগের স্ক্রল পজিশনে ফেরত
        যাচ্ছে না কেন?
      </Line>

      <Line name="ফাহিম">
        ভুলু ভাই! Next.js ডাইনামিক রাউটিংয়ের সময় ডিফল্টভাবেই ধরে নেয় আপনি নতুন একটি পেজে গেছেন,
        তাই স্ক্রল পজিশন রিসেট করে ওপরে নিয়ে যায়। কিন্তু ট্যাব চেঞ্জ বা সাইলেন্ট ফিল্টারিংয়ে
        আমাদের বলে দিতে হয় — &quot;URL চেঞ্জ হবে, কিন্তু স্ক্রল যেখানে আছে সেখানেই থাকবে&quot;।
      </Line>

      <Line name="নেক্সট-ভাই">
        App Router-এ স্ক্রল রেস্টোরেশন ৩টি নিয়মে কাজ করে — (১) নতুন রুটে গেলে স্ক্রল ওপরে যাবে
        এবং অ্যাক্সেসিবিলিটির জন্য ভিউপোর্টে ফোকাস বসবে; (২) Back/Forward-এ Next.js আগের স্ক্রল
        পজিশন মনে রেখে রিস্টোর করবে; (৩) ফিল্টার বা ট্যাবে <code>{"{ scroll: false }"}</code>{" "}
        দিয়ে রিসেট বন্ধ করা যাবে।
      </Line>

      {/* ── Architecture ──────────────────────────────────────────────── */}
      <H2 id="architecture">১. Scroll Behavior Lifecycle</H2>

      <Diagram>{`┌─────────────────────────────────────────────────────────────────────────┐
│                    APP ROUTER SCROLL MANAGEMENT                         │
└─────────────────────────────────────────────────────────────────────────┘
                                     │
         ┌───────────────────────────┴───────────────────────────┐
         ▼                                                       ▼
【 NEW ROUTE NAVIGATION 】                              【 BACK / FORWARD NAV 】
 <Link href="/blog">                                    Browser back / forward click
         │                                                       │
         ▼                                                       ▼
 Reset scroll to top (scrollTop: 0)                     Restore previous scroll position
 [Override: scroll={false}]                             (saved in the history state)`}</Diagram>

      {/* ── Implementation ────────────────────────────────────────────── */}
      <H2 id="implementation">২. স্ক্রল জাম্প বন্ধ করা</H2>

      <H3>A — ট্যাব ও ফিল্টারে scroll={"{false}"}</H3>

      <CodeBlock filename="components/dashboard-tabs.tsx">{`import Link from 'next/link';

interface TabsProps {
  currentTab: string;
}

export function DashboardTabs({ currentTab }: TabsProps) {
  return (
    <div className="flex gap-2 border-b border-slate-800 pb-2">
      {/* scroll={false} stops the page from jumping to the top on a tab click */}
      <Link
        href="/dashboard?tab=overview"
        scroll={false}
        className={\`px-4 py-2 text-sm font-medium rounded-lg transition \${
          currentTab === 'overview'
            ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
            : 'text-slate-400 hover:text-slate-200'
        }\`}
      >
        Overview
      </Link>

      <Link
        href="/dashboard?tab=analytics"
        scroll={false}
        className={\`px-4 py-2 text-sm font-medium rounded-lg transition \${
          currentTab === 'analytics'
            ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
            : 'text-slate-400 hover:text-slate-200'
        }\`}
      >
        Analytics
      </Link>
    </div>
  );
}`}</CodeBlock>

      <H3>B — useRouter-এ ইম্পারেটিভ স্ক্রল কন্ট্রোল</H3>

      <CodeBlock filename="components/silent-filter.tsx">{`'use client';

import { usePathname, useRouter, useSearchParams } from 'next/navigation';

export function SilentFilter() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const handleFilterChange = (value: string) => {
    const params = new URLSearchParams(searchParams.toString());

    if (value) {
      params.set('filter', value);
    } else {
      params.delete('filter');
    }

    // Pass { scroll: false } as the second options argument
    router.replace(\`\${pathname}?\${params.toString()}\`, { scroll: false });
  };

  return (
    <select
      onChange={(e) => handleFilterChange(e.target.value)}
      className="bg-slate-900 border border-slate-800 text-slate-200 text-sm p-2 rounded-lg outline-none"
    >
      <option value="">All Status</option>
      <option value="active">Active</option>
      <option value="archived">Archived</option>
    </select>
  );
}`}</CodeBlock>

      <H3>C — হ্যাশ অ্যাংকরে সরাসরি স্ক্রল</H3>

      <CodeBlock filename="components/footer-links.tsx">{`import Link from 'next/link';

export function FooterLinks() {
  return (
    <Link
      href="/terms#privacy-policy"
      scroll={true} // default: navigates and scrolls to the #privacy-policy element
      className="text-xs text-slate-400 hover:underline"
    >
      Privacy Policy
    </Link>
  );
}`}</CodeBlock>

      {/* ── Matrix ────────────────────────────────────────────────────── */}
      <H2 id="matrix">৩. Scroll Behavior Decision Matrix</H2>

      <Table
        head={["ইউজ কেস", "প্রস্তাবিত কনফিগারেশন", "কারণ"]}
        rows={[
          [
            "নতুন পেজে নেভিগেশন (Home → Details)",
            <>
              <code>scroll={"{true}"}</code> (ডিফল্ট)
            </>,
            "নতুন পেজে ওপরে স্ক্রল করাই স্বাভাবিক প্রত্যাশা",
          ],
          [
            "Filter / sort ড্রপডাউন",
            <>
              <code>router.replace(..., {"{ scroll: false }"})</code>
            </>,
            "স্ক্রল জাম্প করলে ইউজারের কনটেক্সট হারিয়ে যায়",
          ],
          [
            "Tab switching (Profile → Settings)",
            <code key="sf">scroll={"{false}"}</code>,
            "ট্যাব পরিবর্তন কেবল কনটেন্ট সুইচ করে, পেজ পজিশন নয়",
          ],
          [
            "ব্রাউজার Back বাটন",
            "Native restoration",
            "Next.js অটোমেটিক আগের এক্স্যাক্ট পজিশনে ফিরিয়ে নেয়",
          ],
        ]}
      />

      <Line name="ভুলু ভাই">
        অসাধারণ! ফিল্টার ড্রপডাউনে <code>{"{ scroll: false }"}</code> বসাতেই লাফানোর ঝামেলা শেষ!
        আর নতুন পেজে গেলে অটো ওপরে যাচ্ছে, কিন্তু ব্যাক বাটন চাপলে ঠিক আগের পজিশনেই ল্যান্ড করছে!
      </Line>

      {/* ── Takeaways ─────────────────────────────────────────────────── */}
      <H2 id="takeaway">Production Takeaways</H2>

      <Note>
        <ul>
          <li>
            <strong>Keep context intact:</strong> পেজের ভেতরের সাব-স্টেট (ড্রপডাউন, ট্যাব, মোডাল
            কোয়েরি প্যারাম) পাল্টানোর সময় <code>{"{ scroll: false }"}</code> ছাড়া নেভিগেট করবেন
            না।
          </li>
          <li>
            <strong>Back/forward is free:</strong> Next.js-এর বিল্ট-ইন scroll restoration
            ব্রাউজার হিস্ট্রি স্ট্যাকের সাথে যুক্ত — অতিরিক্ত কোড ছাড়াই সঠিক পজিশনে রিস্টোর হয়।
          </li>
          <li>
            <strong>Accessibility:</strong> পুরো পেজ নেভিগেশনে <code>scroll={"{true}"}</code>{" "}
            রাখা জরুরি, কারণ স্ক্রিন রিডার ব্যবহারকারীদের জন্য নতুন পেজের শুরুতে ফোকাস যাওয়া
            দরকার।
          </li>
        </ul>
      </Note>
    </article>
  );
}
