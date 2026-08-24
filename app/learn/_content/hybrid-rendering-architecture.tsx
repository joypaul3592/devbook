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
      bn: "এক পেজেই তিন রকম ডেটা",
      en: "Three kinds of data, one page",
    },
  },
  {
    id: "architecture",
    label: { bn: "Hybrid Rendering ফ্লো", en: "Hybrid rendering flow" },
  },
  {
    id: "pillars",
    label: { bn: "হাইব্রিডের ৩টি স্তম্ভ", en: "The three pillars" },
  },
  {
    id: "implementation",
    label: { bn: "একটি রুটে তিনটি স্ট্র্যাটেজি", en: "Three strategies in one route" },
  },
  {
    id: "matrix",
    label: { bn: "Single-strategy বনাম Hybrid", en: "Single strategy vs hybrid" },
  },
  {
    id: "takeaway",
    label: { bn: "Production Takeaways", en: "Production takeaways" },
  },
];

export default function HybridRenderingArchitecture() {
  return (
    <article className="doc-prose">
      {/* ── The problem ───────────────────────────────────────────────── */}
      <H2 id="the-problem" anchorOnly>
        এক পেজেই তিন রকম ডেটা
      </H2>

      <p>
        রাত ৯:৪৫। ভুলু ভাই একটি ই-কমার্স প্রোডাক্ট ডিটেইলস পেজ (<code>/products/[id]</code>)
        ডিজাইন করছেন এবং চরম দ্বিধায় পড়েছেন। নেভবার, প্রোডাক্ট টাইটেল, ইমেজ ও স্পেসিফিকেশন
        সবসময় একই থাকে (Static দরকার)। ইউজারের পার্সোনালাইজড ডিসকাউন্ট ও লাইভ স্টক অন-ডিমান্ড
        ফেচ হওয়া দরকার (Dynamic)। আর নিচের হাজার হাজার রিভিউ লোড হতে ২ সেকেন্ড লাগে (Streaming
        দরকার)!
      </p>

      <Line name="ভুলু ভাই">
        ফাহিম! Next.js-এ পেজ কি হয় ১০০% Static, না হয় ১০০% Dynamic বানাতে হবে? একটা সিঙ্গেল
        রুটের অর্ধেক Static, কিছুটা Dynamic আর স্লো অংশটুকু Streaming — এই তিনটা একসাথে একই পেজে
        কম্বাইন করা কি সম্ভব?
      </Line>

      <Line name="ফাহিম">
        ভুলু ভাই! App Router-এর সবচেয়ে শক্তিশালী আর্কিটেকচারাল ম্যাজিকই হলো{" "}
        <strong>Hybrid Rendering</strong> — আধুনিক Next.js-এ যেটি Partial Prerendering (PPR)-এর
        ভিত্তি।
      </Line>

      <Line name="নেক্সট-ভাই">
        একদম! Next.js পেজের স্ট্যাটিক অংশগুলোকে (static shell) বিল্ড টাইমে ক্যাশ করে রাখে, আর
        ডাইনামিক অংশগুলোকে অন-ডিমান্ড সার্ভারে রান করিয়ে <code>&lt;Suspense&gt;</code> দিয়ে
        রিয়েল-টাইম স্ট্রিম করে। ইউজার ইনস্ট্যান্ট শেল দেখে, আর ডাইনামিক ডেটা ব্যাকগ্রাউন্ডে
        ইনজেক্ট হয়!
      </Line>

      {/* ── Architecture ──────────────────────────────────────────────── */}
      <H2 id="architecture">১. Hybrid Rendering Architecture Flow</H2>

      <Diagram>{`┌─────────────────────────────────────────────────────────────────────────┐
│                  HYBRID RENDERING ARCHITECTURE FLOW                     │
└─────────────────────────────────────────────────────────────────────────┘
                                     │
                 [ User requests /products/mechanical-keyboard ]
                                     │
        ┌────────────────────────────┴────────────────────────────┐
        ▼ (served instantly from CDN, <5ms)      (streamed on demand from server) ▼
┌─────────────────────────────────────────┐   ┌─────────────────────────────────────────┐
│  STATIC SHELL (build-time cached)       │   │  DYNAMIC HOLES (Suspense streamed)      │
│  • Navbar & page layout                 │   │  • Personalised coupon (dynamic auth)   │
│  • Product title, image & specs         │   │  • Live inventory stock (uncached fetch)│
│  • Footer                               │   │  • User reviews list (slow DB fetch)    │
└─────────────────────────────────────────┘   └─────────────────────────────────────────┘`}</Diagram>

      {/* ── Pillars ───────────────────────────────────────────────────── */}
      <H2 id="pillars">২. হাইব্রিড রেন্ডারিংয়ের ৩টি স্তম্ভ</H2>

      <Note>
        <ul>
          <li>
            <strong>Static Shell:</strong> লেআউট, নেভবার, প্রোডাক্টের নাম ও ডেসক্রিপশনের মতো
            ফিক্সড কনটেন্ট বিল্ড টাইমে প্রিপেয়ার হয়ে Edge CDN-এ বসে থাকে — রিকোয়েস্টের
            মিলিসেকেন্ডের মধ্যেই পেজের ফ্রেম রেন্ডার হয়ে যায়।
          </li>
          <li>
            <strong>Dynamic Holes:</strong> যেখানে ইউজার সেশন (<code>cookies()</code>), কোয়েরি
            প্যারাম বা রিয়েল-টাইম প্রাইস লাগে, সেই স্লটগুলো সার্ভারে অন-ডিমান্ড এক্সিকিউট হয়।
          </li>
          <li>
            <strong>Suspense-backed Streaming:</strong> ধীরগতির ডেটা সোর্স (রিভিউ,
            রিকমেন্ডেশন) <code>&lt;Suspense&gt;</code> বাউন্ডারিতে আইসোলেট থাকে — শেল দেখার
            কয়েক সেকেন্ড পর সেই অংশ স্ট্রিম হয়ে সাইলেন্টলি UI-তে বসে যায়।
          </li>
        </ul>
      </Note>

      {/* ── Implementation ────────────────────────────────────────────── */}
      <H2 id="implementation">৩. একটি রুটে তিনটি স্ট্র্যাটেজি</H2>

      <H3>Static shell + dynamic price + streamed reviews</H3>

      <CodeBlock filename="app/products/[slug]/page.tsx">{`import { cookies } from 'next/headers';
import { Suspense } from 'react';
import { notFound } from 'next/navigation';

interface ProductPageProps {
  params: Promise<{ slug: string }>;
}

// 1. STATIC: pre-render these paths at build time
export async function generateStaticParams() {
  return [{ slug: 'mechanical-keyboard' }, { slug: 'ergonomic-mouse' }];
}

// Static product specs — cached at build time
async function getStaticProductSpecs(slug: string) {
  return {
    title: 'Custom RGB Mechanical Keyboard',
    price: 150,
    image: '/keyboard.png',
    description: 'Ultra-responsive mechanical switches with full RGB backlighting.',
  };
}

// 2. DYNAMIC: on-demand personalised data, per user
async function UserPersonalizedPrice({ basePrice }: { basePrice: number }) {
  const cookieStore = await cookies(); // dynamic API invocation
  const isVipUser = cookieStore.get('vip_token')?.value;

  const finalPrice = isVipUser ? basePrice * 0.85 : basePrice; // 15% VIP discount

  return (
    <div className="flex items-center space-x-3">
      <span className="text-2xl font-bold text-emerald-400">
        \${finalPrice.toFixed(2)}
      </span>
      {isVipUser && (
        <span className="text-xs bg-emerald-500/10 text-emerald-400 px-2 py-0.5 rounded border border-emerald-500/20">
          VIP 15% OFF applied
        </span>
      )}
    </div>
  );
}

// 3. STREAMING: slow 2-second customer reviews component
async function SlowProductReviews({ slug }: { slug: string }) {
  await new Promise((resolve) => setTimeout(resolve, 2000));

  return (
    <div className="space-y-3 pt-6 border-t border-slate-800">
      <h3 className="text-lg font-semibold text-slate-200">Customer Reviews (4.9/5)</h3>
      <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl space-y-2">
        <p className="text-sm font-medium text-slate-300">
          Best mechanical keyboard I have ever used.
        </p>
        <p className="text-xs text-slate-500">- Tanvir Ahmed</p>
      </div>
    </div>
  );
}

export default async function ProductDetailPage({ params }: ProductPageProps) {
  const { slug } = await params;
  const product = await getStaticProductSpecs(slug);

  if (!product) notFound();

  return (
    <div className="max-w-4xl mx-auto py-10 px-6 space-y-8 text-slate-100">
      {/* STATIC SHELL: renders instantly */}
      <header className="border-b border-slate-800 pb-4">
        <span className="text-xs font-mono text-cyan-400 bg-cyan-500/10 px-2.5 py-1 rounded">
          Hybrid rendering route
        </span>
        <h1 className="text-3xl font-extrabold mt-3">{product.title}</h1>
        <p className="text-slate-400 text-sm mt-1">{product.description}</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bg-slate-900 border border-slate-800 rounded-2xl h-64 flex items-center justify-center text-slate-600">
          [Product image: {product.image}]
        </div>

        <div className="space-y-6">
          {/* DYNAMIC PART: renders on demand from the user cookie */}
          <div>
            <p className="text-xs text-slate-400 mb-1">Your price:</p>
            <UserPersonalizedPrice basePrice={product.price} />
          </div>

          <button className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-semibold py-3 rounded-xl transition">
            Buy Now
          </button>
        </div>
      </div>

      {/* STREAMED PART: arrives over the HTTP stream */}
      <Suspense
        fallback={
          <div className="h-32 bg-slate-900/60 border border-slate-800 rounded-xl animate-pulse p-4 space-y-2">
            <div className="h-4 w-40 bg-slate-800 rounded" />
            <div className="h-3 w-full bg-slate-800 rounded" />
          </div>
        }
      >
        <SlowProductReviews slug={slug} />
      </Suspense>
    </div>
  );
}`}</CodeBlock>

      <Note>
        <p>
          <strong>মনে রাখবেন:</strong> PPR ছাড়া একটি রুটে ডাইনামিক API ব্যবহার করলে পুরো রুটটিই
          ডাইনামিক হয়ে যায় — স্ট্যাটিক শেল আর CDN থেকে সার্ভ হয় না। সত্যিকারের &quot;static
          shell + dynamic holes&quot; পেতে হলে Partial Prerendering চালু করতে হয়; না হলে হাইব্রিড
          বলতে বোঝায় ডাইনামিক রুটে <code>&lt;Suspense&gt;</code> দিয়ে স্লো অংশ আইসোলেট করা।
        </p>
      </Note>

      {/* ── Matrix ────────────────────────────────────────────────────── */}
      <H2 id="matrix">৪. Single-Strategy বনাম Hybrid</H2>

      <Table
        head={[
          "স্ট্র্যাটেজি",
          "UI shell speed",
          "Data freshness",
          "Personalisation",
          "Streaming",
        ]}
        rows={[
          [
            "Pure static (SSG)",
            "ইনস্ট্যান্ট (<10ms)",
            "স্টেল — build time",
            "অসম্ভব",
            "প্রযোজ্য নয়",
          ],
          [
            "Pure dynamic (SSR)",
            "স্লো (100–500ms)",
            "১০০% লাইভ",
            "পারফেক্ট",
            "Suspense ছাড়া blocking",
          ],
          [
            "Hybrid",
            "ইনস্ট্যান্ট শেল",
            "১০০% লাইভ (ডাইনামিক হোলে)",
            "পারফেক্ট",
            "বিল্ট-ইন, সিমলেস",
          ],
        ]}
      />

      <Line name="ভুলু ভাই">
        ব্রিলিয়ান্ট! একই রুটে স্ট্যাটিক শেল ইনস্ট্যান্ট লোড হচ্ছে, ডাইনামিক প্রাইসিং অন-ডিমান্ড
        চেক হচ্ছে, আর স্লো রিভিউ সেকশনটা স্ট্রিম হয়ে স্মুথলি ভেসে উঠছে!
      </Line>

      {/* ── Takeaways ─────────────────────────────────────────────────── */}
      <H2 id="takeaway">Production Takeaways</H2>

      <Note>
        <ul>
          <li>
            <strong>Design static shells first:</strong> পেজ আর্কিটেক্ট করার সময় প্রথমেই ভাবুন —
            কোন অংশগুলো সব ইউজারের জন্য একই? সেগুলোকে স্ট্যাটিক শেল হিসেবে রাখুন।
          </li>
          <li>
            <strong>Isolate dynamic holes:</strong> কুকি বা রিয়েল-টাইম ডেটার জন্য পুরো পেজ
            ডাইনামিক না বানিয়ে শুধু ওই অংশটুকু আলাদা কম্পোনেন্টে রেখে{" "}
            <code>&lt;Suspense&gt;</code> দিয়ে মুড়ে দিন।
          </li>
          <li>
            <strong>Best of all worlds:</strong> হাইব্রিড আর্কিটেকচারে স্ট্যাটিকের স্পিড,
            ডাইনামিকের পার্সোনালাইজেশন আর স্ট্রিমিংয়ের স্মুথ UX একসাথে পাওয়া যায়।
          </li>
        </ul>
      </Note>
    </article>
  );
}
