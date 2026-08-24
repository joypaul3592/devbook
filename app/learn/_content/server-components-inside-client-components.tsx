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
      bn: "মোডালের ভেতরে সার্ভার কম্পোনেন্ট",
      en: "A server component inside a modal",
    },
  },
  {
    id: "mental-model",
    label: {
      bn: "Import বনাম Slot",
      en: "Import vs slot",
    },
  },
  {
    id: "client-wrapper",
    label: {
      bn: "ক্লায়েন্ট র‍্যাপার (children slot)",
      en: "The client wrapper",
    },
  },
  {
    id: "server-child",
    label: { bn: "Pure Async সার্ভার চাইল্ড", en: "The pure async server child" },
  },
  {
    id: "composition-root",
    label: { bn: "কম্পোজিশন প্যারেন্ট", en: "The composition parent" },
  },
  {
    id: "takeaway",
    label: { bn: "Production Takeaways", en: "Production takeaways" },
  },
];

export default function ServerComponentsInsideClientComponents() {
  return (
    <article className="doc-prose">
      {/* ── The problem ───────────────────────────────────────────────── */}
      <H2 id="the-problem" anchorOnly>
        মোডালের ভেতরে সার্ভার কম্পোনেন্ট
      </H2>

      <p>
        সন্ধ্যা ৭:১৫। ভুলু ভাই একটি অ্যানিমেটেড Modal বানাচ্ছিলেন। মোডালের ভেতরে ডাটাবেস
        থেকে ইউজারের অ্যাক্টিভিটি লগ দেখানোর জন্য তিনি সরাসরি{" "}
        <code>&apos;use client&apos;</code> লেখা <code>Modal.tsx</code>-এর ভেতরেই{" "}
        <code>UserActivityLogServer.tsx</code> ইমপোর্ট করে বসালেন — আর অমনি টার্মিনালে
        ওয়ার্নিং!
      </p>

      <Line name="ভুলু ভাই">
        ফাহিম! মাথা নষ্ট নাকি ভাই? <code>UserActivityLogServer</code> তো একটা pure async
        Server Component! সেটাকে <code>Modal.tsx</code>-এর ভেতরে ডিরেক্ট ইমপোর্ট করে
        রেন্ডার করলাম, তখন সেটা আর সার্ভার কম্পোনেন্ট থাকছে না কেন? এমনকি তার ভেতরের{" "}
        <code>node:crypto</code> আর ডাটাবেস কোড ব্রাউজারে এরর মারছে!
      </Line>

      <Line name="ফাহিম">
        (মডিউল ইমপোর্ট গ্রাফ দেখে) ভুলু ভাই! ক্লায়েন্ট বাউন্ডারির গোল্ডেন রুল ভুলে গেছ! কোনো
        ফাইলকে <code>&apos;use client&apos;</code> দিয়ে চিহ্নিত করলে সেই ফাইলে{" "}
        <code>import</code> করা সব ফাইলও ঐ ক্লায়েন্ট মডিউল গ্রাফের অংশ হয়ে যায়! তাই সার্ভার
        কম্পোনেন্ট ক্লায়েন্ট কম্পোনেন্টে ডিরেক্ট ইমপোর্ট করলে সেটি ক্লায়েন্ট কম্পোনেন্টে
        রূপান্তরিত হয়।
      </Line>

      <Line name="নেক্সট-ভাই">
        একদম ঠিক! ক্লায়েন্ট কম্পোনেন্টের ভেতরে সার্ভার কম্পোনেন্ট{" "}
        <strong>ইমপোর্ট</strong> করা যাবে না — তবে <strong>রেন্ডার</strong> করা পুরোপুরি
        সম্ভব। তার জন্য দরকার <strong>Children Slot Composition Pattern</strong>: সার্ভার
        কম্পোনেন্টটিকে কোনো প্যারেন্ট সার্ভার কম্পোনেন্ট থেকে ক্লায়েন্ট কম্পোনেন্টের{" "}
        <code>children</code> (বা যেকোনো slot প্রপ) হিসেবে পাস করে দাও।
      </Line>

      {/* ── Mental model ──────────────────────────────────────────────── */}
      <H2 id="mental-model">১. Import বনাম Slot</H2>

      <Diagram>{`❌ ANTI-PATTERN: DIRECT IMPORT (module boundary infection)
┌─────────────────────────────────────────────────────────┐
│  'use client'                                            │
│  InteractiveModal.tsx                                    │
│  │                                                       │
│  └── import { ServerComponent } from './server-comp'     │
│      └─> the server component becomes a CLIENT component │
│          (breaks on Node APIs, DB access, secrets)       │
└─────────────────────────────────────────────────────────┘

──────────────────────────────────────────────────────────

🟢 PRODUCTION PATTERN: SLOT / CHILDREN COMPOSITION
┌─────────────────────────────────────────────────────────┐
│  SERVER BOUNDARY                                         │
│  page.tsx (server component)                             │
│  │                                                       │
│  ├── renders <ServerUserAuditLog />  (runs on server)    │
│  └── passes it as 'children' to <InteractiveModal />     │
└───────────────────────────┬─────────────────────────────┘
                            │ passed as an RSC slot
                            v
┌─────────────────────────────────────────────────────────┐
│  'use client'                                            │
│  InteractiveModal.tsx                                    │
│  │                                                       │
│  └── renders {children} seamlessly                       │
│      (modal owns open/close state; the child stays       │
│       pure server-rendered, 0 KB of JS overhead)         │
└─────────────────────────────────────────────────────────┘`}</Diagram>

      {/* ── Client wrapper ────────────────────────────────────────────── */}
      <H2 id="client-wrapper">২. ক্লায়েন্ট র‍্যাপার (children slot)</H2>

      <CodeBlock filename="components/ui/interactive-modal.tsx">{`// 🟢 components/ui/interactive-modal.tsx
'use client'; // client boundary isolated strictly for UI state

import { useState } from 'react';

interface InteractiveModalProps {
  title: string;
  // The server component arrives safely through this slot
  children: React.ReactNode;
}

export function InteractiveModal({ title, children }: InteractiveModalProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="space-y-4">
      <button
        onClick={() => setIsOpen(true)}
        className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-medium text-xs rounded-lg transition shadow-lg"
      >
        Open audit logs (interactive)
      </button>

      {isOpen && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex justify-center items-center z-50 p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-lg w-full p-6 space-y-4 shadow-2xl">
            <div className="flex justify-between items-center border-b border-slate-800 pb-3">
              <h2 className="text-lg font-bold text-white">{title}</h2>
              <button
                onClick={() => setIsOpen(false)}
                className="text-slate-400 hover:text-white text-xs bg-slate-800 px-2 py-1 rounded"
              >
                Close
              </button>
            </div>

            {/* SLOT: the server component renders here */}
            <div className="max-h-96 overflow-y-auto">{children}</div>
          </div>
        </div>
      )}
    </div>
  );
}`}</CodeBlock>

      {/* ── Server child ──────────────────────────────────────────────── */}
      <H2 id="server-child">৩. Pure Async সার্ভার চাইল্ড</H2>

      <CodeBlock filename="components/server/server-user-audit-log.tsx">{`// 🟢 components/server/server-user-audit-log.tsx
// NO 'use client' directive — this runs exclusively on the server.
import 'server-only';

interface AuditLog {
  id: string;
  action: string;
  ipAddress: string;
  timestamp: string;
}

async function fetchAuditLogsFromDb(): Promise<AuditLog[]> {
  // Simulating a server DB call (0 KB client bundle overhead)
  await new Promise((resolve) => setTimeout(resolve, 800));

  return [
    { id: 'log_1', action: 'USER_LOGIN', ipAddress: '192.168.1.1', timestamp: '2 mins ago' },
    { id: 'log_2', action: 'PASSWORD_RESET', ipAddress: '10.0.0.42', timestamp: '1 hour ago' },
    { id: 'log_3', action: 'API_KEY_CREATED', ipAddress: '172.16.0.8', timestamp: '1 day ago' },
  ];
}

export async function ServerUserAuditLog() {
  const logs = await fetchAuditLogsFromDb();

  return (
    <div className="space-y-2">
      <span className="text-[10px] text-emerald-400 font-mono">
        Pure server component output (zero client JS)
      </span>
      <div className="divide-y divide-slate-800 border border-slate-800 rounded-lg overflow-hidden bg-slate-950">
        {logs.map((log) => (
          <div key={log.id} className="p-3 flex justify-between items-center text-xs">
            <div>
              <p className="font-semibold text-slate-200">{log.action}</p>
              <p className="text-[10px] text-slate-500 font-mono">IP: {log.ipAddress}</p>
            </div>
            <span className="text-slate-400 font-mono text-[10px]">{log.timestamp}</span>
          </div>
        ))}
      </div>
    </div>
  );
}`}</CodeBlock>

      {/* ── Composition root ──────────────────────────────────────────── */}
      <H2 id="composition-root">৪. কম্পোজিশন প্যারেন্ট (Server Page)</H2>

      <CodeBlock filename="app/security/page.tsx">{`// 🟢 app/security/page.tsx — pure composition root
import { Suspense } from 'react';
import { InteractiveModal } from '@/components/ui/interactive-modal';
import { ServerUserAuditLog } from '@/components/server/server-user-audit-log';

export default function SecurityPage() {
  return (
    <main className="min-h-screen bg-slate-950 p-8 text-slate-100 flex flex-col items-center justify-center space-y-4">
      <header className="text-center space-y-2">
        <h1 className="text-2xl font-bold">Security &amp; Audit Center</h1>
        <p className="text-xs text-slate-400 max-w-md">
          A server component rendered inside a client component through the children slot.
        </p>
      </header>

      {/* COMPOSITION: the server component travels as the 'children' slot */}
      <InteractiveModal title="System Audit Logs">
        <Suspense fallback={<div className="text-xs text-slate-500 p-4">Loading server logs...</div>}>
          <ServerUserAuditLog />
        </Suspense>
      </InteractiveModal>
    </main>
  );
}`}</CodeBlock>

      <Line name="ভুলু ভাই">
        (আনন্দে লাফিয়ে উঠে) মারহাবা নেক্সট-ভাই! মোডালের ওপেন/ক্লোজ স্টেট সামলাচ্ছে
        ক্লায়েন্ট কম্পোনেন্ট, আর ভেতরের <code>ServerUserAuditLog</code> ডাটাবেস থেকে ডেটা
        এনে পিওর সার্ভার-রেন্ডার্ড অবস্থাতেই মোডালের ভেতরে বসে গেল!
      </Line>

      <H3>নেমড স্লট — একাধিক জায়গার জন্য</H3>

      <CodeBlock filename="components/ui/data-drawer.tsx">{`'use client';

interface DataDrawerProps {
  headerSlot?: React.ReactNode; // server-rendered header
  children: React.ReactNode;    // server-rendered body
  footerSlot?: React.ReactNode; // server-rendered footer
}

export function DataDrawer({ headerSlot, children, footerSlot }: DataDrawerProps) {
  // ...open/close state lives here; every slot stays server-rendered
  return (
    <aside>
      <div>{headerSlot}</div>
      <div>{children}</div>
      <div>{footerSlot}</div>
    </aside>
  );
}`}</CodeBlock>

      {/* ── Takeaways ─────────────────────────────────────────────────── */}
      <H2 id="takeaway">Production Takeaways</H2>

      <Note>
        <ul>
          <li>
            <strong>Never import server components inside client files:</strong> ইমপোর্ট
            করলেই সেটি ক্লায়েন্ট মডিউল গ্রাফের অংশ হয়ে সার্ভার ক্যাপাবিলিটি হারায়।
          </li>
          <li>
            <strong>Leverage children &amp; named slots:</strong> মোডাল, ড্রয়ার, ট্যাব বা
            যেকোনো ইন্টারঅ্যাক্টিভ লেআউটে <code>children: React.ReactNode</code> বা নেমড
            স্লট (<code>headerSlot?: React.ReactNode</code>) রাখো।
          </li>
          <li>
            <strong>Slots are pre-rendered:</strong> স্লটের সার্ভার কম্পোনেন্ট আগেই রেন্ডার
            হয়ে RSC Payload-এ থাকে, তাই মোডাল খুললে নেটওয়ার্ক ডিলে ছাড়াই UI দেখা যায়।
          </li>
          <li>
            <strong>Zero bundle overhead:</strong> স্লট চাইল্ডের সব ডিপেন্ডেন্সি (ORM, ভারী
            ফরম্যাটার) ক্লায়েন্ট বান্ডলে ০ বাইট।
          </li>
        </ul>
      </Note>
    </article>
  );
}
