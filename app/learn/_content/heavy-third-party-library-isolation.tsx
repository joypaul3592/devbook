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
      bn: "একটি অপশনাল বাটনের ৬০০ KB",
      en: "600 KB for one optional button",
    },
  },
  {
    id: "architecture",
    label: {
      bn: "Top-level import বনাম function-level",
      en: "Top-level import vs function-level",
    },
  },
  {
    id: "mechanisms",
    label: { bn: "আইসোলেশনের ৩টি কৌশল", en: "Three isolation techniques" },
  },
  {
    id: "implementation",
    label: {
      bn: "await import() ও native Intl",
      en: "await import() & native Intl",
    },
  },
  {
    id: "matrix",
    label: {
      bn: "Heavy Package Replacement Matrix",
      en: "Heavy package replacement matrix",
    },
  },
  {
    id: "takeaway",
    label: { bn: "Production Takeaways", en: "Production takeaways" },
  },
];

export default function HeavyThirdPartyLibraryIsolation() {
  return (
    <article className="doc-prose">
      {/* ── The problem ───────────────────────────────────────────────── */}
      <H2 id="the-problem" anchorOnly>
        একটি অপশনাল বাটনের ৬০০ KB
      </H2>

      <p>
        দুপুর ১২:৪৫। ভুলু ভাই তার অ্যাপে ইউজার ইনভয়েস ডাউনলোড করার জন্য একটি PDF জেনারেটর এবং তারিখ
        ফরম্যাটিংয়ের জন্য <code>moment.js</code> যুক্ত করেছেন। বিল্ড দেওয়ার পর bundle analyzer-এ দেখা
        গেল অ্যাপের মূল চ্যাঙ্কের সাইজ ৬০০ KB বেড়ে গেছে। এমনকি যে ইউজার কোনোদিন &quot;Download
        PDF&quot; বাটনে ক্লিকই করবে না, তার ব্রাউজারেও পুরো লাইব্রেরিটি লোড হচ্ছে।
      </p>

      <Line name="ভুলু ভাই">
        ফাহিম! তারিখ ফরম্যাটের মতো ছোট কাজের জন্য আর একটা অপশনাল PDF ডাউনলোডার বাটনের জন্য আমার
        অ্যাপের ক্লায়েন্ট বান্ডল এত ভারী হবে কেন? এই থার্ড-পার্টি লাইব্রেরিগুলোকে কি মূল বান্ডল থেকে
        সম্পূর্ণ আলাদা বা আইসোলেট করা যায় না?
      </Line>

      <Line name="ফাহিম">
        ভুলু ভাই! সমস্যা হলো আপনি থার্ড-পার্টি লাইব্রেরিগুলোকে ফাইলের একদম ওপরে সোজাসুজি{" "}
        <code>import</code> করে রেখেছেন। <code>moment.js</code>-এর সাথে শত শত দেশের locale ফাইল
        বাই-ডিফল্ট বান্ডলে ঢুকে পড়ে, আর <code>@react-pdf/renderer</code> বা <code>Chart.js</code>-এর
        মতো ভারী ইঞ্জিনগুলোকে সোজাসুজি ইমপোর্ট করলে Next.js সেগুলোকে মূল বান্ডলে এমবেড করে নেয়।
      </Line>

      <Line name="নেক্সট-ভাই">
        একদম! ভারী লাইব্রেরি আইসোলেশনের প্রধান কৌশল তিনটি — ১. পুরোনো ভারী লাইব্রেরির বদলে মডার্ন
        হালকা অল্টারনেটিভ ব্যবহার করা (Moment → Day.js / native Intl), ২. ভিজ্যুয়াল চার্ট বা ক্যানভাস
        ইঞ্জিনকে <code>next/dynamic</code> দিয়ে আলাদা চ্যাঙ্কে আইসোলেট করা, এবং ৩. PDF জেনারেটর বা
        Excel এক্সপোর্টারের মতো on-click ইউটিলিটিগুলোকে ফাংশনের ভেতরে{" "}
        <code>await import(...)</code> দিয়ে হ্যান্ডেল করা।
      </Line>

      {/* ── Architecture ──────────────────────────────────────────────── */}
      <H2 id="architecture">
        ১. Direct Top-Level Import vs. Function-Level Library Isolation
      </H2>

      <Diagram>{`┌─────────────────────────────────────────────────────────────────────────┐
│     TOP-LEVEL HEAVY IMPORT VS. FUNCTION-LEVEL DYNAMIC ISOLATION         │
└─────────────────────────────────────────────────────────────────────────┘

 ❌ TOP-LEVEL HEAVY IMPORT (main bundle contamination)
 Page hydration starts
 ┌───────────────────────────────────────────────────────────────────────┐
 │ app/page.js includes:                                                 │
 │ ├── Moment.js + all locales (300 KB) ──► 🔴 pollutes the main bundle  │
 │ └── PDF engine (600 KB)              ──► 🔴 downloaded even if unused │
 └──────────────────────────────────┬────────────────────────────────────┘
                                    │ total overhead: ~900 KB
                                    ▼
                      🔴 EXTREMELY SLOW FIRST LOAD

───────────────────────────────────────────────────────────────────────────

 🟢 ISOLATED DYNAMIC FUNCTION IMPORT (on-demand execution)
 Page hydration starts
 ┌───────────────────────────────────────────────────────────────────────┐
 │ app/page.js includes:                                                 │
 │ └── native date formatter / Day.js (2 KB)                             │
 └──────────────────────────────────┬────────────────────────────────────┘
                                    │ user clicks "Download Invoice PDF"
                                    ▼
 ┌───────────────────────────────────────────────────────────────────────┐
 │ execute: const { jsPDF } = await import('jspdf')                      │
 │ (downloads the PDF chunk ONLY on click)                               │
 └───────────────────────────────────────────────────────────────────────┘
                                    ▼
                     🟢 ~900 KB SAVED FROM THE INITIAL BUNDLE`}</Diagram>

      {/* ── Mechanisms ────────────────────────────────────────────────── */}
      <H2 id="mechanisms">২. ভারী লাইব্রেরি আইসোলেশনের ৩টি মূল কৌশল</H2>

      <p>
        <strong>Modern lightweight alternatives:</strong> <code>moment.js</code> (৩০০ KB+)-এর মতো
        মনোলিথিক প্যাকেজ সরিয়ে <code>dayjs</code> (~২ KB), <code>date-fns</code> অথবা ব্রাউজারের নেটিভ{" "}
        <code>Intl.DateTimeFormat</code> ব্যবহার করা।
      </p>

      <p>
        <strong>Function-level async dynamic import:</strong> যেসব থার্ড-পার্টি প্যাকেজ কোনো নির্দিষ্ট
        অ্যাকশনে ব্যবহৃত হয় (PDF জেনারেট, Excel/CSV এক্সপোর্ট), সেগুলোকে কম্পোনেন্টের টপ-লেভেলে ইমপোর্ট
        না করে সরাসরি ইভেন্ট হ্যান্ডলার ফাংশনের ভেতরে <code>await import(...)</code> দিয়ে ডাইনামিকালি
        লোড করা।
      </p>

      <p>
        <strong>Dynamic UI component wrapper boundary:</strong> <code>Chart.js</code>,{" "}
        <code>recharts</code> বা Monaco Editor-এর মতো ভিজ্যুয়াল ইঞ্জিনগুলোকে একটি স্বাধীন ফাইল
        র‍্যাপারে নিয়ে <code>next/dynamic</code> ও <code>{"{ ssr: false }"}</code> দিয়ে আইসোলেট করা।
      </p>

      {/* ── Implementation ────────────────────────────────────────────── */}
      <H2 id="implementation">৩. Production Code Implementation</H2>

      <H3>❌ Anti-pattern — top-level PDF and Moment imports</H3>

      <CodeBlock filename="app/billing/legacy-invoice.tsx">{`// 🔴 POOR PRACTICE: top-level heavy imports pollute the initial bundle for ALL users
'use client';

import moment from 'moment'; // 🔴 bundles ~300 KB including every language locale
import { jsPDF } from 'jspdf'; // 🔴 bundles the heavy PDF library immediately

export function UnisolatedInvoicePage({ invoiceData }: { invoiceData: { id: string } }) {
  const formattedDate = moment().format('MMMM Do YYYY, h:mm:ss a');

  const handleDownloadPDF = () => {
    const doc = new jsPDF();
    doc.text(\`Invoice ID: \${invoiceData.id}\`, 10, 10);
    doc.save('invoice.pdf');
  };

  return (
    <div className="p-6 space-y-4">
      <p>Issued on: {formattedDate}</p>
      <button onClick={handleDownloadPDF} className="px-4 py-2 bg-blue-600 text-white rounded">
        Download PDF invoice
      </button>
    </div>
  );
}`}</CodeBlock>

      <H3>🟢 Production pattern — function-level async import and native date formatting</H3>

      <CodeBlock filename="app/billing/page.tsx">{`// 🟢 PRODUCTION PATTERN: zero bundle leak via function-level import + native Intl
'use client';

import { useState } from 'react';

interface InvoiceProps {
  id: string;
  amount: number;
}

export default function IsolatedInvoicePage({ invoice }: { invoice: InvoiceProps }) {
  const [isGenerating, setIsGenerating] = useState(false);

  // 🟢 STEP 1: replace Moment.js with the zero-weight native Intl API
  const formattedDate = new Intl.DateTimeFormat('en-US', {
    dateStyle: 'full',
    timeStyle: 'short',
  }).format(new Date());

  // 🟢 STEP 2: function-level dynamic import — PDF code is downloaded ONLY on click
  const handleDownloadPDF = async () => {
    try {
      setIsGenerating(true);

      // 🟢 on-demand asynchronous import (an isolated chunk)
      const { jsPDF } = await import('jspdf');

      const doc = new jsPDF();
      doc.setFontSize(16);
      doc.text(\`INVOICE STATEMENT #\${invoice.id}\`, 20, 20);
      doc.setFontSize(12);
      doc.text(\`Total payable: $\${invoice.amount}\`, 20, 35);
      doc.text(\`Generated date: \${formattedDate}\`, 20, 45);

      doc.save(\`Invoice_\${invoice.id}.pdf\`);
    } catch (error) {
      console.error('PDF generation error:', error);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="p-8 max-w-xl mx-auto space-y-6 bg-slate-950 text-slate-100 border border-slate-800 rounded-xl">
      <div className="space-y-1">
        <h2 className="text-xl font-bold">Billing Statement</h2>
        <p className="text-sm text-slate-400">Date: {formattedDate}</p>
      </div>

      <div className="p-4 bg-slate-900 rounded-lg flex justify-between items-center border border-slate-800">
        <div>
          <p className="text-xs text-slate-500 font-mono">PAYABLE AMOUNT</p>
          <p className="text-lg font-bold text-emerald-400">\${invoice.amount}</p>
        </div>

        {/* 🟢 the heavy jsPDF chunk is requested ONLY when this button is clicked */}
        <button
          onClick={handleDownloadPDF}
          disabled={isGenerating}
          className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 disabled:bg-slate-800 text-white text-sm font-medium rounded-lg transition-colors flex items-center gap-2"
        >
          {isGenerating ? '⌛ Compiling PDF...' : '📄 Download PDF'}
        </button>
      </div>
    </div>
  );
}`}</CodeBlock>

      {/* ── Matrix ────────────────────────────────────────────────────── */}
      <H2 id="matrix">৪. Heavy Package Isolation &amp; Replacement Matrix</H2>

      <Table
        head={["ভারী প্যাকেজ", "আনুমানিক সাইজ", "বিকল্প / আইসোলেশন কৌশল", "সাশ্রয়"]}
        rows={[
          [
            <code key="c">moment.js</code>,
            "~৩২০ KB",
            <span key="d">
              <code>dayjs</code> (~২ KB) অথবা native <code>Intl.DateTimeFormat</code>
            </span>,
            "~৩১৮ KB ⚡",
          ],
          [
            <code key="c">lodash</code>,
            "~৭০ KB",
            <span key="d">
              <code>lodash-es</code> (tree-shakable) অথবা ES6 native array methods
            </span>,
            "~৬৫ KB ⚡",
          ],
          [
            <span key="c">
              <code>jsPDF</code> / PDF.js
            </span>,
            "~৪০০–৬০০ KB",
            <span key="d">
              function-level <code>await import(&apos;jspdf&apos;)</code>
            </span>,
            "ইনিশিয়াল লোডে ০ KB",
          ],
          [
            <span key="c">
              <code>Chart.js</code> / recharts
            </span>,
            "~৩০০ KB",
            <span key="d">
              <code>next/dynamic</code> wrapper + <code>{"{ ssr: false }"}</code>
            </span>,
            "মূল চ্যাঙ্ক থেকে বিচ্ছিন্ন",
          ],
          [
            "Monaco Editor",
            "~২ MB",
            "Web Worker isolation + on-demand modal load",
            "~১.৮ MB ⚡",
          ],
        ]}
      />

      <Line name="ভুলু ভাই">
        অসাধারণ আইডিয়া! <code>await import(&apos;jspdf&apos;)</code> ফাংশনের ভেতরে ঢুকিয়ে দেওয়াতে এখন
        আর অ্যাপ খোলার সময় ৬০০ KB ফাইল ডাউনলোড হয় না! ইউজার বাটনে ক্লিক করলে তবেই কেবল PDF প্যাকেজ লোড
        হয়ে সুন্দরভাবে ফাইল ডাউনলোড হয়ে যাচ্ছে।
      </Line>

      {/* ── Takeaways ─────────────────────────────────────────────────── */}
      <H2 id="takeaway">Production Takeaways</H2>

      <Note>
        <ul>
          <li>
            <strong>Never import action-specific utilities at the file top:</strong> ডাউনলোডার,
            এক্সপোর্টার বা প্রিন্ট জেনারেটর প্যাকেজগুলোকে কখনো ফাইলের টপ-লেভেলে ইমপোর্ট করবেন না —
            সবসময় ইভেন্ট হ্যান্ডলারের ভেতরে <code>await import(...)</code> দিয়ে কল করুন।
          </li>
          <li>
            <strong>Purge Moment.js from legacy codebases:</strong> প্রজেক্টে <code>moment.js</code>{" "}
            থাকলে তা সরিয়ে <code>dayjs</code> বা নেটিভ <code>Intl</code> অবজেক্ট ব্যবহার করুন।
          </li>
          <li>
            <strong>Use tree-shakable imports:</strong> <code>{"import { map } from 'lodash'"}</code>{" "}
            না লিখে <code>{"import map from 'lodash/map'"}</code> অথবা <code>lodash-es</code> ব্যবহার
            করুন, যেন অব্যবহৃত মেথডগুলো বান্ডলে না ঢোকে।
          </li>
        </ul>
      </Note>
    </article>
  );
}
