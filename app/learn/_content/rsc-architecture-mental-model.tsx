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
      bn: "Network Tab-এ অদ্ভুত স্ট্রিম",
      en: "A strange stream in the Network tab",
    },
  },
  {
    id: "mental-model",
    label: {
      bn: "RSC আর্কিটেকচার ও মেন্টাল মডেল",
      en: "RSC architecture & mental model",
    },
  },
  {
    id: "implementation",
    label: {
      bn: "প্রোডাকশন ইমপ্লিমেন্টেশন",
      en: "Production implementation",
    },
  },
  {
    id: "rsc-vs-ssr",
    label: { bn: "RSC বনাম SSR", en: "RSC vs SSR" },
  },
  {
    id: "takeaway",
    label: { bn: "Production Takeaways", en: "Production takeaways" },
  },
];

export default function RscArchitectureMentalModel() {
  return (
    <article className="doc-prose">
      {/* ── The problem ───────────────────────────────────────────────── */}
      <H2 id="the-problem" anchorOnly>
        Network Tab-এ অদ্ভুত স্ট্রিম
      </H2>

      <p>
        দুপুর ৩:২০। ভুলু ভাই তার প্রোডাক্ট ডিটেইলস পেজ রিফ্যাক্টর করছিলেন। হঠাৎ ফাহিম
        ব্রাউজারের Network Tab-এ একটি অদ্ভুত রিকোয়েস্ট লগে আঙুল রাখল।
      </p>

      <Line name="ফাহিম">
        ভুলু ভাই! তুমি যে বললে Server Component মানেই ক্লাসিকাল SSR (Server-Side
        Rendering) — তাহলে পেজ নেভিগেট করার সময় ব্রাউজার কোনো HTML ডাউনলোড না করে{" "}
        <code>{`1:I["..."]`}</code> ধরনের JSON-সদৃশ একটা স্ট্রিম টেক্সট রেসপন্স নিয়ে আসছে
        কেন? আবার ক্লায়েন্ট সাইড বান্ডলে ঐ হেভি <code>marked</code> পার্সিং লাইব্রেরির ১৫০
        KB কোডও গায়েব!
      </Line>

      <Line name="ভুলু ভাই">
        (অবাক হয়ে) বলিস কি ফাহিম! সার্ভারে রেন্ডার হচ্ছে অথচ ক্লায়েন্টে কোনো JS বান্ডল
        পাঠাচ্ছে না? আবার ক্লাসিকাল HTML-ও না? তাহলে React আসলে ব্যাকগ্রাউন্ডে কী রেন্ডার
        করছে?
      </Line>

      <Line name="নেক্সট-ভাই">
        (হেসে) ভুলু, এখানেই অধিকাংশ ডেভেলপার ভুল করে! <strong>RSC</strong> (React Server
        Components) কোনো SSR-এর বিকল্প নয় — এটি React-এর একটি নতুন{" "}
        <strong>Execution Engine Architecture</strong>।
      </Line>

      <Line name="নেক্সট-ভাই">
        SSR শুধু ইনিশিয়াল রিকোয়েস্টে HTML স্ট্রিং বানিয়ে ব্রাউজারে পাঠায়। কিন্তু RSC
        Architecture হলো এমন এক মেন্টাল মডেল, যেখানে React Component Tree দুটি স্বতন্ত্র
        এনভায়রনমেন্টে ভাগ হয়ে যায় — <strong>Server Environment</strong> আর{" "}
        <strong>Client Environment</strong>। সার্ভার কম্পোনেন্টগুলো শুধুমাত্র সার্ভারেই
        এক্সিকিউট হয় এবং ক্লায়েন্টকে কোনো JS কোড না পাঠিয়ে একটি স্পেশাল{" "}
        <strong>RSC Payload</strong> (JSON-like virtual DOM tree representation) স্ট্রিমিং
        আকারে ব্রাউজারে পাঠায়।
      </Line>

      {/* ── Mental model ──────────────────────────────────────────────── */}
      <H2 id="mental-model">১. RSC Architecture &amp; Mental Model</H2>

      <Diagram>{`┌────────────────────────────────────────────────────────────────────────┐
│ SERVER ENVIRONMENT (Build Time / Request Time)                         │
│                                                                        │
│  ┌───────────────────────┐                                             │
│  │  <ProductOverview />  │ ──> Executes pure JS, accesses secrets/node │
│  └───────────┬───────────┘                                             │
│              │                                                         │
│              v                                                         │
│  ┌───────────────────────┐                                             │
│  │ Heavy Libs (marked)   │ ──> Executes ONLY on server, 0 KB to client │
│  └───────────┬───────────┘                                             │
│              │                                                         │
│              v                                                         │
│  ┌──────────────────────────────────────────────────────────────────┐  │
│  │ React Server Component Tree Engine                               │  │
│  │ Generates JSON-like data structure: "RSC Payload"                │  │
│  └───────────────────────────────┬──────────────────────────────────┘  │
└──────────────────────────────────┼─────────────────────────────────────┘
                                   │
                                   │  Streamed via HTTP (RSC Payload)
                                   v
┌────────────────────────────────────────────────────────────────────────┐
│ CLIENT ENVIRONMENT (Browser)                                           │
│                                                                        │
│  ┌──────────────────────────────────────────────────────────────────┐  │
│  │ React Client Reconciliation Engine                               │  │
│  │ Reads RSC Payload + reconstructs Fiber tree + preserves UI state │  │
│  └───────────────────────────────┬──────────────────────────────────┘  │
│                                  │                                     │
│                                  v                                     │
│                  ┌───────────────────────────────┐                     │
│                  │  Seamless DOM update (0 JS)   │                     │
│                  └───────────────────────────────┘                     │
└────────────────────────────────────────────────────────────────────────┘`}</Diagram>

      {/* ── Implementation ────────────────────────────────────────────── */}
      <H2 id="implementation">২. Production Engineering Implementation</H2>

      <p>
        নিচে একটি প্রোডাকশন-গ্রেড টাইপসেফ Server Component, যা সার্ভারে ভারী মার্কডাউন
        পার্সিং চালায় কিন্তু ক্লায়েন্টে <strong>০ বাইট</strong> জাভাস্ক্রিপ্ট পাঠায়।
      </p>

      <CodeBlock filename="app/products/[slug]/page.tsx">{`// app/products/[slug]/page.tsx
import { notFound } from 'next/navigation';
import { marked } from 'marked'; // 150KB heavy library — exclusively runs on the server!

interface ProductPageProps {
  params: Promise<{ slug: string }>;
}

interface ProductDetails {
  id: string;
  title: string;
  price: number;
  descriptionMarkdown: string;
  createdAt: string;
}

// Mock data fetcher (simulating the server data pipeline)
async function getProductDetails(slug: string): Promise<ProductDetails | null> {
  // Direct server-side operation or HTTPS call
  if (slug !== 'nextjs-masterclass') return null;

  return {
    id: 'prod_102',
    title: 'Next.js Advanced Frontend Masterclass',
    price: 199,
    descriptionMarkdown: [
      '### Key Architecture Highlights',
      '* **Zero client-side bundle** for markdown parsing.',
      '* Streaming **RSC Payload** directly over HTTP.',
      '* Native async component execution with top-level await.',
    ].join('\\n'),
    createdAt: new Date().toISOString(),
  };
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { slug } = await params;
  const product = await getProductDetails(slug);

  if (!product) {
    notFound();
  }

  // Heavy server computation: markdown -> HTML, on the server
  const parsedDescriptionHtml = await marked.parse(product.descriptionMarkdown);

  return (
    <main className="max-w-4xl mx-auto p-8 space-y-6">
      <header className="border-b border-slate-800 pb-4">
        <span className="text-xs text-emerald-400 font-mono uppercase tracking-wider">
          Server Component (0 KB client JS)
        </span>
        <h1 className="text-3xl font-bold text-white mt-1">{product.title}</h1>
        <p className="text-slate-400 text-sm mt-1">Price: {product.price} USD</p>
      </header>

      {/* Parsed HTML rendered without shipping the marked library to the browser */}
      <section className="bg-slate-900 border border-slate-800 rounded-xl p-6">
        <h2 className="text-lg font-semibold text-slate-200 mb-3">Product Specifications</h2>
        <div
          className="prose prose-invert max-w-none text-slate-300 text-sm leading-relaxed"
          dangerouslySetInnerHTML={{ __html: parsedDescriptionHtml }}
        />
      </section>
    </main>
  );
}`}</CodeBlock>

      <Line name="ভুলু ভাই">
        (উত্তেজিত হয়ে) আহা! তারমানে <code>marked</code> লাইব্রেরিটা পুরোপুরি সার্ভার
        এনভায়রনমেন্টেই রান হয়ে রেডিমেড HTML বানিয়ে দিল! ব্রাউজারে <code>marked</code>{" "}
        ডাউনলোড হওয়ার দরকারই পড়ল না!
      </Line>

      {/* ── RSC vs SSR ────────────────────────────────────────────────── */}
      <H2 id="rsc-vs-ssr">৩. RSC বনাম SSR</H2>

      <Table
        head={["দিক", "SSR", "RSC"]}
        rows={[
          [
            "আউটপুট",
            "HTML স্ট্রিং",
            <>
              RSC Payload (<code>1:I[&quot;...&quot;]</code> স্ট্রিম)
            </>,
          ],
          [
            "কখন চলে",
            "ইনিশিয়াল রিকোয়েস্টে একবার",
            "ইনিশিয়াল রিকোয়েস্ট ও প্রতিটি নেভিগেশনে",
          ],
          [
            "ক্লায়েন্ট বান্ডল",
            "কম্পোনেন্টের JS ক্লায়েন্টে যায় (hydration লাগে)",
            "সার্ভার কম্পোনেন্টের JS ক্লায়েন্টে যায় না (০ বাইট)",
          ],
          [
            "স্টেট",
            "হাইড্রেশনের পর ক্লায়েন্টে স্টেট তৈরি হয়",
            "রি-রেন্ডারে বিদ্যমান ক্লায়েন্ট স্টেট অক্ষত থাকে",
          ],
        ]}
      />

      <H3>RSC Payload আসলে কী?</H3>

      <p>
        এটি সাধারণ JSON নয়, বরং লাইন-বাই-লাইন স্ট্রিমেবল একটি ফরম্যাট — যেখানে রেন্ডার
        হয়ে যাওয়া সার্ভার আউটপুট, ক্লায়েন্ট কম্পোনেন্টের মডিউল রেফারেন্স, আর তাদের প্রপ্স
        আলাদা চাঙ্কে থাকে। ব্রাউজারের React সেটি পড়ে Fiber Tree পুনর্গঠন করে, DOM পুরো
        রিপ্লেস না করেই।
      </p>

      {/* ── Takeaways ─────────────────────────────────────────────────── */}
      <H2 id="takeaway">Production Takeaways</H2>

      <Note>
        <ul>
          <li>
            <strong>RSC is not SSR:</strong> SSR একটি রেন্ডারিং টেকনিক যা ইনিশিয়াল HTML
            পাঠায়। RSC একটি কম্পোনেন্ট আর্কিটেকচার, যা অ্যাপের পুরো লাইফসাইকেল জুড়ে সার্ভার
            ও ক্লায়েন্ট ট্রি-কে ইন্টারলিভড অবস্থায় ধরে রাখে।
          </li>
          <li>
            <strong>Async Server Components:</strong> Server Component-এ সরাসরি top-level{" "}
            <code>await</code> ব্যবহার করা যায় — <code>useEffect</code> বা{" "}
            <code>useState</code> লাগে না।
          </li>
          <li>
            <strong>Zero bundle overhead:</strong> যেকোনো ভারী কম্পিউটেশনাল লাইব্রেরি (HTML
            parser, date calculator, heavy math util) শুধু Server Component-এ ইমপোর্ট করলে
            ক্লায়েন্ট বান্ডলে তার প্রভাব ০ বাইট।
          </li>
          <li>
            <strong>Payload re-usability:</strong> SPA নেভিগেশনে Next.js নতুন RSC Payload
            এনে বিদ্যমান DOM স্টেট নষ্ট না করেই ট্রি reconcile করে।
          </li>
        </ul>
      </Note>
    </article>
  );
}
