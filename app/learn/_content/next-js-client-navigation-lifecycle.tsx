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
      bn: "রিলোড ছাড়াই পেজ বদলায় কীভাবে?",
      en: "Pages swap without a reload",
    },
  },
  {
    id: "architecture",
    label: {
      bn: "Navigation Lifecycle আর্কিটেকচার",
      en: "Navigation lifecycle architecture",
    },
  },
  {
    id: "six-steps",
    label: { bn: "লাইফসাইকেলের ৬টি ধাপ", en: "The six steps" },
  },
  {
    id: "implementation",
    label: { bn: "Pending State ট্র্যাকিং", en: "Tracking pending state" },
  },
  {
    id: "matrix",
    label: { bn: "Soft বনাম Hard Navigation", en: "Soft vs hard navigation" },
  },
  {
    id: "takeaway",
    label: { bn: "Production Takeaways", en: "Production takeaways" },
  },
];

export default function NextJsClientNavigationLifecycle() {
  return (
    <article className="doc-prose">
      {/* ── The problem ───────────────────────────────────────────────── */}
      <H2 id="the-problem" anchorOnly>
        রিলোড ছাড়াই পেজ বদলায় কীভাবে?
      </H2>

      <p>
        রাত ১:৩০। ভুলু ভাই একটি মাল্টি-স্টেপ ই-কমার্স ড্যাশবোর্ড বানাচ্ছেন। ইউজার যখন
        সাইডবার লিংকে ক্লিক করে অন্য পেজে যাচ্ছে, তখন ব্রাউজার রিলোড হচ্ছে না ঠিকই — কিন্তু
        ভুলু ভাই কিছুতেই মেলাতে পারছেন না, কেন প্যারেন্ট লেআউটের ইনপুট স্টেট টিকে থাকছে, আর
        Next.js সার্ভার ও ক্লায়েন্টের মধ্যে ঠিক কীভাবে ডেটা আদান-প্রদান করে পেজ সোয়াপ করছে!
      </p>

      <Line name="ভুলু ভাই">
        ফাহিম! Next.js-এর এই ক্লায়েন্ট নেভিগেশন আসলে কাজ করে কীভাবে? আমি{" "}
        <code>&lt;Link&gt;</code>-এ ক্লিক করার সাথে সাথে চোখের পলকে পেজ চেঞ্জ হয়ে যায় —
        কোনো ট্র্যাডিশনাল HTML পেজ রিলোড ছাড়াই! ব্রাউজার আর সার্ভারের মধ্যে এই অল্প সময়ে কী
        মেকানিজম চলে?
      </Line>

      <Line name="ফাহিম">
        ভুলু ভাই, এটাকে বলে <strong>SPA-style Soft Navigation</strong>। App Router-এ যখন
        ইউজার এক পেজ থেকে অন্য পেজে যায়, তখন Next.js পুরো HTML ফাইল নতুন করে লোড না করে
        ব্যাকগ্রাউন্ডে শুধু <strong>RSC Payload</strong> (React Server Component Payload)
        নিয়ে এসে React-এর vDOM ট্রি আপডেট করে।
      </Line>

      <Line name="নেক্সট-ভাই">
        একদম সঠিক! এই পুরো প্রসেসটিকে বলে <strong>Client Navigation Lifecycle</strong>।
        ব্রাউজারে লিংকে ক্লিক করা থেকে শুরু করে নতুন UI স্ক্রিনে ভেসে ওঠা পর্যন্ত ৬টি নির্দিষ্ট
        ধাপে এই সাইকেলটি এক্সিকিউট হয়।
      </Line>

      {/* ── Architecture ──────────────────────────────────────────────── */}
      <H2 id="architecture">১. Navigation Lifecycle আর্কিটেকচার</H2>

      <Diagram>{`┌─────────────────────────────────────────────────────────────────────────┐
│                     NEXT.JS CLIENT NAVIGATION LIFECYCLE                 │
└─────────────────────────────────────────────────────────────────────────┘
                                     │
   [Step 1: User Click / Push]  ───▶ User triggers <Link> or router.push()
                                     │
   [Step 2: Router Cache Check] ───▶ Checks in-memory Client Router Cache
                                     │
   [Step 3: Flight Request]     ───▶ Sends HTTP request with "RSC: 1" header
                                     │
   [Step 4: RSC Streaming]      ───▶ Server returns React Server Component Payload
                                     │
   [Step 5: React Reconciliation]──▶ React updates DOM sub-tree (preserves client state)
                                     │
   [Step 6: Focus & Scroll]     ───▶ Restores scroll position & handles viewport focus`}</Diagram>

      {/* ── Six steps ─────────────────────────────────────────────────── */}
      <H2 id="six-steps">২. লাইফসাইকেলের ৬টি ধাপ</H2>

      <Note>
        <ul>
          <li>
            <strong>Trigger Phase:</strong> ইউজার <code>&lt;Link&gt;</code>-এ ক্লিক করে বা
            কোড থেকে <code>router.push()</code> চালানো হয়।
          </li>
          <li>
            <strong>Router Cache Lookup:</strong> ব্রাউজার তার লোকাল মেমরিতে থাকা Client
            Router Cache চেক করে দেখে টার্গেট রুটের RSC Payload ইতিমধ্যে ক্যাশ করা আছে কিনা।
          </li>
          <li>
            <strong>Flight Request:</strong> ক্যাশে ডেটা না থাকলে বা মেয়াদ শেষ হলে
            ব্যাকগ্রাউন্ডে সার্ভারে একটি Flight Request পাঠানো হয় (যার সাথে{" "}
            <code>RSC: 1</code> হেডার বা <code>_rsc</code> কোয়েরি যুক্ত থাকে)।
          </li>
          <li>
            <strong>Server Execution &amp; Streaming:</strong> সার্ভার নতুন কোনো Full HTML
            পাঠায় না; শুধু টার্গেট পেজের সার্ভার কম্পোনেন্ট এক্সিকিউট করে লাইটওয়েট RSC
            Payload ব্রাউজারে স্ট্রিম করে।
          </li>
          <li>
            <strong>DOM Reconciliation:</strong> React ক্লায়েন্ট ইঞ্জিন পুরোনো DOM-এর সাথে
            নতুন RSC Payload মিলিয়ে শুধু পরিবর্তিত সেগমেন্টটুকু আপডেট করে। লেআউট আনমাউন্ট হয়
            না বলে লেআউটের ক্লায়েন্ট স্টেট টিকে থাকে।
          </li>
          <li>
            <strong>Focus &amp; Scroll Restoration:</strong> নেভিগেশন শেষে অ্যাক্সেসিবিলিটি
            ঠিক রাখতে ভিউপোর্টে স্ক্রল পজিশন ও ফোকাস অ্যাডজাস্ট করা হয়।
          </li>
        </ul>
      </Note>

      {/* ── Implementation ────────────────────────────────────────────── */}
      <H2 id="implementation">৩. Navigation Pending State ট্র্যাকিং</H2>

      <H3>useTransition দিয়ে ট্রানজিশন স্টেট ধরা</H3>

      <CodeBlock filename="components/nav-item.tsx">{`'use client';

import { useTransition } from 'react';
import { useRouter } from 'next/navigation';

interface NavItemProps {
  href: string;
  label: string;
}

export function NavItem({ href, label }: NavItemProps) {
  const router = useRouter();
  // useTransition tracks the client navigation lifecycle state
  const [isPending, startTransition] = useTransition();

  const handleNavigation = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();

    startTransition(() => {
      // Initiates the Flight Request & soft navigation lifecycle
      router.push(href);
    });
  };

  return (
    <a
      href={href}
      onClick={handleNavigation}
      className={\`px-4 py-2 rounded-lg text-sm font-medium transition duration-150 flex items-center gap-2 \${
        isPending
          ? 'bg-slate-800 text-slate-400 opacity-70 cursor-wait'
          : 'bg-slate-900 text-slate-200 hover:bg-slate-800'
      }\`}
    >
      {label}
      {isPending && (
        <span className="w-3 h-3 border-2 border-slate-400 border-t-transparent rounded-full animate-spin" />
      )}
    </a>
  );
}`}</CodeBlock>

      {/* ── Matrix ────────────────────────────────────────────────────── */}
      <H2 id="matrix">৪. Soft Navigation বনাম Hard Navigation</H2>

      <Table
        head={[
          "ফিচার",
          "Soft Navigation (Link / Router)",
          "Hard Navigation (প্লেইন a ট্যাগ / Reload)",
        ]}
        rows={[
          [
            "Payload Type",
            "RSC Payload (JSON-like data stream)",
            "Full HTML document + CSS + client JS assets",
          ],
          [
            "React State",
            "অপরিবর্তিত লেআউটের ক্লায়েন্ট স্টেট মেমরিতে বজায় থাকে",
            "পেজের সব ক্লায়েন্ট স্টেট পুরোপুরি রিসেট হয়",
          ],
          [
            "Performance",
            "দ্রুত — শুধু পরিবর্তিত অংশটুকু লোড হয়",
            "ধীর — পুরো DOM রি-বিল্ড ও রিলোড হয়",
          ],
          [
            "Network Overhead",
            "কম (KB মাপের ডেটা স্ট্রিম)",
            "বেশি (MB মাপের ফাইল রিকোয়েস্ট)",
          ],
        ]}
      />

      {/* ── Takeaways ─────────────────────────────────────────────────── */}
      <H2 id="takeaway">Production Takeaways</H2>

      <Note>
        <ul>
          <li>
            <strong>RSC Payload Streaming:</strong> ক্লায়েন্ট নেভিগেশনে Next.js নতুন HTML
            রিলোড করে না — ব্যাকগ্রাউন্ডে শুধু RSC Payload এনে DOM reconcile করে। ফলে সাইডবার
            বা শেয়ার্ড লেআউটের ক্লায়েন্ট স্টেট অক্ষত থাকে।
          </li>
          <li>
            <strong>Track Lifecycle via useTransition:</strong> প্রোগ্রাম্যাটিক নেভিগেশনে (
            <code>router.push</code>) ইউজার ফিডব্যাকের জন্য <code>useTransition</code>{" "}
            ব্যবহার করুন — <code>isPending</code> ফ্ল্যাগ দিয়ে স্পিনার বা ইন্ডিকেটর দেখানো
            যায়।
          </li>
          <li>
            <strong>Router Cache Invalidation:</strong> ইন-মেমরি রাউটার ক্যাশ নেভিগেশন ফাস্ট
            করে, কিন্তু সার্ভারে ডেটা আপডেট হলে সেটি সাথে সাথে দেখাতে Server Action-এ{" "}
            <code>revalidatePath()</code> বা <code>revalidateTag()</code> চালানো জরুরি।
          </li>
        </ul>
      </Note>
    </article>
  );
}
