import type { Locale } from "./translations";

/** Bilingual string — every label in the curriculum has a bn and en form. */
export interface Bi {
  bn: string;
  en: string;
}

export function bi(value: Bi, locale: Locale): string {
  return locale === "bn" ? value.bn : value.en;
}

/** A single lesson — this is what actually has a page and a body. */
export interface Topic {
  slug: string;
  title: Bi;
  /** true → the lesson is written; false → its page renders the "coming soon" state. */
  published: boolean;
}

/** A chapter groups lessons. It is a sidebar section, not a page. */
export interface Chapter {
  no: string;
  slug: string;
  title: Bi;
  summary: Bi;
  topics: Topic[];
  /** true when at least one lesson inside is written. */
  published: boolean;
}

interface RawChapter {
  no: string;
  slug: string;
  title: Bi;
  summary: Bi;
  topics: Bi[];
}

/**
 * Lessons that have a written body, as "chapterSlug/topicSlug".
 * Keep this in sync with the registry in `app/learn/_content/index.ts` —
 * it lives here so the sidebar can show progress without pulling article
 * components into the client bundle.
 */
const WRITTEN = new Set<string>([
  "nextjs-architecture-rendering/rsc-payload-mechanics-network-overhead",
  "nextjs-architecture-rendering/server-to-client-boundary-leakage-server-only-enforcement",
  "nextjs-architecture-rendering/hydration-bottlenecks-mismatch-debugging-ssr-mechanics",
  "nextjs-architecture-rendering/bundle-size-bloat-tree-shaking-pitfalls",
  "nextjs-architecture-rendering/image-asset-optimization-mechanics-next-image-internals",
  "nextjs-architecture-rendering/nested-layouts-vs-templates-client-state-retention",
  "nextjs-architecture-rendering/streaming-ssr-with-suspense-architecture",
  "nextjs-architecture-rendering/parallel-intercepting-routes-for-production-modal-architecture",
  "nextjs-architecture-rendering/next-js-font-script-optimization-next-font-next-script-strategy",
  "nextjs-architecture-rendering/client-memory-leaks-edge-cases-in-spa-navigation",
  "data-fetching-architecture/next-js-caching-hierarchy-request-flow",
  "data-fetching-architecture/next-js-16-uncached-by-default-shift-explicit-caching-with-use-cache",
  "data-fetching-architecture/request-memoization-mechanics-deduplication-scope",
  "data-fetching-architecture/time-based-vs-on-demand-revalidation-race-conditions",
  "data-fetching-architecture/tag-based-cache-invalidation-architecture-revalidatetag-cachetag",
  "data-fetching-architecture/dynamic-functions-escalation-cache-opt-out-bottlenecks",
  "data-fetching-architecture/stale-while-revalidate-behavior-at-the-node-edge-server-layer",
  "data-fetching-architecture/router-cache-invalidation-client-side-navigation-stale-data",
  "data-fetching-architecture/server-component-parallel-data-fetching-promise-all-bottlenecks",
  "data-fetching-architecture/data-security-authorization-leak-in-cached-data-cache-poisoning",
  "caching-performance/the-4-tier-caching-architecture-revalidation-lifecycles",
  "caching-performance/request-memoization-react-cache-function",
  "caching-performance/data-cache-fetch-strategies-force-cache-vs-no-store-unstable-cache",
  "caching-performance/full-route-cache-vs-dynamic-rendering-static-vs-dynamic-routes",
  "caching-performance/client-side-router-cache-mechanism-in-memory-prefetching-invalidation",
  "caching-performance/revalidation-strategies-time-based-isr-vs-on-demand-revalidatepath-revalidatetag",
  "caching-performance/core-web-vitals-asset-optimization-next-image-next-font-next-script",
  "caching-performance/dynamic-imports-code-splitting-next-dynamic-vs-react-lazy-suspense",
  "caching-performance/bundle-analysis-performance-auditing-next-bundle-analyzer-lighthouse-core-web-vitals",
  "caching-performance/partial-prerendering-ppr-hybrid-rendering-architecture",
  "routing-architecture/route-groups-folder-layout-isolation",
  "routing-architecture/dynamic-routes-catch-all-optional-catch-all-segments",
  "routing-architecture/parallel-routes-slot-conditional-rendering",
  "routing-architecture/intercepting-routes",
  "routing-architecture/parallel-intercepting-routes-the-photo-modal-pattern",
]);

/** Stable url slug derived from the English title. */
function slugify(input: string): string {
  return input
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

const raw: RawChapter[] = [
  {
    no: "01",
    slug: "nextjs-architecture-rendering",
    title: {
      bn: "Next.js ফ্রন্টএন্ড আর্কিটেকচার",
      en: "Next.js Frontend Architecture",
    },
    summary: {
      bn: "RSC payload, boundary, hydration আর bundle — production frontend-এর ভেতরের মেকানিক্স।",
      en: "RSC payload, boundaries, hydration, and bundles — the mechanics behind a production frontend.",
    },
    topics: [
      {
        bn: "RSC Payload মেকানিক্স ও নেটওয়ার্ক ওভারহেড",
        en: "RSC Payload Mechanics & Network Overhead",
      },
      {
        bn: "Server-to-Client বাউন্ডারি লিকেজ ও server-only এনফোর্সমেন্ট",
        en: "Server-to-Client Boundary Leakage & server-only Enforcement",
      },
      {
        bn: "Hydration বটলনেক, Mismatch ডিবাগিং ও SSR মেকানিক্স",
        en: "Hydration Bottlenecks, Mismatch Debugging & SSR Mechanics",
      },
      {
        bn: "Bundle Size ব্লোট ও Tree-Shaking পিটফল",
        en: "Bundle Size Bloat & Tree-Shaking Pitfalls",
      },
      {
        bn: "Image ও Asset অপটিমাইজেশন মেকানিক্স (next/image ইন্টার্নাল)",
        en: "Image & Asset Optimization Mechanics (next/image Internals)",
      },
      {
        bn: "Nested Layouts বনাম Templates ও ক্লায়েন্ট স্টেট রিটেনশন",
        en: "Nested Layouts vs Templates & Client State Retention",
      },
      {
        bn: "Suspense আর্কিটেকচার দিয়ে Streaming SSR",
        en: "Streaming SSR with Suspense Architecture",
      },
      {
        bn: "প্রোডাকশন Modal আর্কিটেকচারে Parallel ও Intercepting Routes",
        en: "Parallel & Intercepting Routes for Production Modal Architecture",
      },
      {
        bn: "Next.js Font ও Script অপটিমাইজেশন (next/font ও next/script স্ট্র্যাটেজি)",
        en: "Next.js Font & Script Optimization (next/font & next/script Strategy)",
      },
      {
        bn: "ক্লায়েন্ট মেমরি লিক ও SPA নেভিগেশনের এজ কেস",
        en: "Client Memory Leaks & Edge Cases in SPA Navigation",
      },
    ],
  },
  {
    no: "02",
    slug: "data-fetching-architecture",
    title: {
      bn: "ডেটা ফেচিং আর্কিটেকচার",
      en: "Data Fetching Architecture",
    },
    summary: {
      bn: "চার লেয়ারের cache, Next.js 16-এর uncached-by-default, আর কখন কীভাবে invalidate হয়।",
      en: "Four cache layers, Next.js 16's uncached-by-default shift, and when invalidation actually fires.",
    },
    topics: [
      {
        bn: "Next.js ক্যাশ হায়ারার্কি ও রিকোয়েস্ট ফ্লো",
        en: "Next.js Caching Hierarchy & Request Flow",
      },
      {
        bn: "Next.js 16-এর Uncached-by-Default শিফট ও 'use cache' দিয়ে এক্সপ্লিসিট ক্যাশিং",
        en: "Next.js 16 Uncached-by-Default Shift & Explicit Caching with 'use cache'",
      },
      {
        bn: "Request Memoization মেকানিক্স ও ডিডুপ্লিকেশন স্কোপ",
        en: "Request Memoization Mechanics & Deduplication Scope",
      },
      {
        bn: "Time-based বনাম On-demand রিভ্যালিডেশন ও রেস কন্ডিশন",
        en: "Time-based vs On-demand Revalidation Race Conditions",
      },
      {
        bn: "Tag-based ক্যাশ ইনভ্যালিডেশন আর্কিটেকচার (revalidateTag ও cacheTag)",
        en: "Tag-based Cache Invalidation Architecture (revalidateTag & cacheTag)",
      },
      {
        bn: "Dynamic Function এসকেলেশন ও ক্যাশ Opt-out বটলনেক",
        en: "Dynamic Functions Escalation & Cache Opt-out Bottlenecks",
      },
      {
        bn: "Node/Edge সার্ভার লেয়ারে Stale-While-Revalidate বিহেভিয়ার",
        en: "Stale-While-Revalidate Behavior at the Node/Edge Server Layer",
      },
      {
        bn: "Router Cache ইনভ্যালিডেশন ও ক্লায়েন্ট নেভিগেশনে স্টেল ডেটা",
        en: "Router Cache Invalidation & Client-Side Navigation Stale Data",
      },
      {
        bn: "Server Component-এ Parallel ডেটা ফেচিং ও Promise.all বটলনেক",
        en: "Server Component Parallel Data Fetching & Promise.all Bottlenecks",
      },
      {
        bn: "ক্যাশড ডেটায় সিকিউরিটি ও অথরাইজেশন লিক (Cache Poisoning)",
        en: "Data Security & Authorization Leak in Cached Data (Cache Poisoning)",
      },
    ],
  },
  {
    no: "03",
    slug: "react-server-components",
    title: {
      bn: "React Server Components ডিপ ডাইভ",
      en: "React Server Components Deep Dive",
    },
    summary: {
      bn: "Server আর Client-এর বাউন্ডারি কোথায় টানবে — আর সেই সিদ্ধান্ত bundle-এ কী করে।",
      en: "Where to draw the server/client boundary — and what that decision does to your bundle.",
    },
    topics: [
      {
        bn: "RSC আর্কিটেকচার ও মেন্টাল মডেল",
        en: "RSC Architecture & Mental Model",
      },
      {
        bn: "Server Component বনাম Client Component — ডিসিশন মেকিং",
        en: "Server Component vs Client Component Decision Making",
      },
      {
        bn: '"use client" বাউন্ডারি ও বান্ডল ইমপ্যাক্ট',
        en: '"use client" Boundary & Bundle Impact',
      },
      {
        bn: "Serializable Props ও RSC ডেটা ট্রান্সফার",
        en: "Serializable Props & RSC Data Transfer",
      },
      {
        bn: "Server Component কম্পোজিশন প্যাটার্ন",
        en: "Server Component Composition Patterns",
      },
      {
        bn: "Client Component-এর ভিতরে Server Component প্যাটার্ন",
        en: "Server Components Inside Client Components",
      },
      {
        bn: "Server Component থেকে Client Component-এ ডেটা ফ্লো",
        en: "Data Flow from Server Components to Client Components",
      },
      {
        bn: "RSC Payload বনাম HTML বনাম JavaScript",
        en: "RSC Payload vs HTML vs JavaScript",
      },
      {
        bn: "থার্ড-পার্টি কম্পোনেন্টের RSC কম্প্যাটিবিলিটি",
        en: "RSC Compatibility of Third-party Components",
      },
      {
        bn: "প্রোডাকশন RSC আর্কিটেকচার ও কমন অ্যান্টি-প্যাটার্ন",
        en: "Production RSC Architecture & Common Anti-patterns",
      },
    ],
  },
  {
    no: "04",
    slug: "caching-performance",
    title: {
      bn: "ক্যাশিং ও পারফরম্যান্স ডিপ ডাইভ",
      en: "Caching & Performance Deep Dive",
    },
    summary: {
      bn: "চারটি ক্যাশ লেয়ার হাতে-কলমে — memoization থেকে router cache পর্যন্ত।",
      en: "The four cache layers hands-on — from memoization to the router cache.",
    },
    topics: [
      {
        bn: "৪-স্তরের ক্যাশিং আর্কিটেকচার ও রিভ্যালিডেশন লাইফসাইকেল",
        en: "The 4-Tier Caching Architecture & Revalidation Lifecycles",
      },
      {
        bn: "Request Memoization ও React cache() ফাংশন",
        en: "Request Memoization & React cache() Function",
      },
      {
        bn: "Data Cache ও Fetch Strategy (force-cache বনাম no-store, unstable_cache)",
        en: "Data Cache & Fetch Strategies (force-cache vs no-store, unstable_cache)",
      },
      {
        bn: "Full Route Cache বনাম Dynamic Rendering (Static বনাম Dynamic Routes)",
        en: "Full Route Cache vs Dynamic Rendering (Static vs Dynamic Routes)",
      },
      {
        bn: "Client-Side Router Cache মেকানিজম (In-Memory Prefetching ও ইনভ্যালিডেশন)",
        en: "Client-Side Router Cache Mechanism (In-Memory Prefetching & Invalidation)",
      },
      {
        bn: "রিভ্যালিডেশন স্ট্র্যাটেজি (Time-based ISR বনাম On-demand revalidatePath ও revalidateTag)",
        en: "Revalidation Strategies (Time-based ISR vs On-demand revalidatePath & revalidateTag)",
      },
      {
        bn: "Core Web Vitals ও Asset অপটিমাইজেশন (next/image, next/font, next/script)",
        en: "Core Web Vitals & Asset Optimization (next/image, next/font, next/script)",
      },
      {
        bn: "Dynamic Imports ও Code Splitting (next/dynamic বনাম React.lazy / Suspense)",
        en: "Dynamic Imports & Code Splitting (next/dynamic vs React.lazy / Suspense)",
      },
      {
        bn: "Bundle Analysis ও পারফরম্যান্স অডিটিং (bundle-analyzer, Lighthouse ও Core Web Vitals)",
        en: "Bundle Analysis & Performance Auditing (@next/bundle-analyzer, Lighthouse & Core Web Vitals)",
      },
      {
        bn: "Partial Prerendering (PPR) ও হাইব্রিড রেন্ডারিং আর্কিটেকচার",
        en: "Partial Prerendering (PPR) & Hybrid Rendering Architecture",
      },
    ],
  },
  {
    no: "05",
    slug: "routing-architecture",
    title: {
      bn: "অ্যাডভান্সড App Router আর্কিটেকচার",
      en: "Advanced App Router Architecture",
    },
    summary: {
      bn: "Route Group থেকে Parallel Dashboard — App Router-এর পুরো রাউটিং আর্সেনাল।",
      en: "From route groups to parallel dashboards — the App Router's full routing arsenal.",
    },
    topics: [
      {
        bn: "Route Groups ও লেআউট আইসোলেশন",
        en: "Route Groups (folder) & Layout Isolation",
      },
      {
        bn: "Dynamic Routes ও Catch-All / Optional Catch-All সেগমেন্ট",
        en: "Dynamic Routes & Catch-All / Optional Catch-All Segments",
      },
      {
        bn: "Parallel Routes (@slot) ও কন্ডিশনাল রেন্ডারিং",
        en: "Parallel Routes (@slot) & Conditional Rendering",
      },
      {
        bn: "Intercepting Routes — (.), (..) ও (...)",
        en: "Intercepting Routes",
      },
      {
        bn: "Parallel ও Intercepting একসাথে — Photo Modal প্যাটার্ন",
        en: "Parallel + Intercepting Routes: The Photo Modal Pattern",
      },
      {
        bn: "Nested Layout আর্কিটেকচার ও স্টেট প্রিজার্ভেশন",
        en: "Nested Layout Architecture & State Preservation",
      },
      {
        bn: "Route-লেভেল Loading UI আর্কিটেকচার",
        en: "Route-level Loading UI Architecture",
      },
      {
        bn: "Route-লেভেল Error UI আর্কিটেকচার",
        en: "Route-level Error UI Architecture",
      },
      {
        bn: "Route Segment কনফিগারেশন ও রেন্ডারিং কন্ট্রোল",
        en: "Route Segment Configuration & Rendering Control",
      },
      {
        bn: "Parallel Routes দিয়ে কমপ্লেক্স ড্যাশবোর্ড আর্কিটেকচার",
        en: "Complex Dashboard Architecture with Parallel Routes",
      },
    ],
  },
  {
    no: "06",
    slug: "navigation-url-architecture",
    title: {
      bn: "অ্যাডভান্সড নেভিগেশন ও URL আর্কিটেকচার",
      en: "Advanced Navigation & URL Architecture",
    },
    summary: {
      bn: "URL-ই আসল state container — prefetch, filter আর pagination সব এখানেই।",
      en: "The URL is the real state container — prefetching, filters, and pagination all live here.",
    },
    topics: [
      {
        bn: "Next.js ক্লায়েন্ট নেভিগেশন লাইফসাইকেল",
        en: "Next.js Client Navigation Lifecycle",
      },
      { bn: "<Link> Prefetching মেকানিক্স", en: "<Link> Prefetching Mechanics" },
      { bn: "নেভিগেশন Prefetching স্ট্র্যাটেজি", en: "Navigation Prefetching Strategy" },
      { bn: "useRouter() বনাম <Link>", en: "useRouter() vs <Link>" },
      { bn: "URL স্টেট আর্কিটেকচার", en: "URL State Architecture" },
      { bn: "URL-এ Search ও Filter স্টেট", en: "Search & Filter State in the URL" },
      {
        bn: "Pagination স্টেট ও URL সিঙ্ক্রোনাইজেশন",
        en: "Pagination State & URL Synchronization",
      },
      { bn: "Scroll Restoration", en: "Scroll Restoration" },
      { bn: "Back/Forward নেভিগেশন স্টেট", en: "Back/Forward Navigation State" },
      { bn: "নেভিগেশন পারফরম্যান্স ডিবাগিং", en: "Navigation Performance Debugging" },
    ],
  },
  {
    no: "07",
    slug: "rendering-strategies",
    title: { bn: "রেন্ডারিং স্ট্র্যাটেজি", en: "Rendering Strategies" },
    summary: {
      bn: "Static, dynamic নাকি streaming — কোন পেজে কোনটা, আর কেন।",
      en: "Static, dynamic, or streaming — which page gets which, and why.",
    },
    topics: [
      { bn: "Static রেন্ডারিং আর্কিটেকচার", en: "Static Rendering Architecture" },
      { bn: "Dynamic রেন্ডারিং আর্কিটেকচার", en: "Dynamic Rendering Architecture" },
      { bn: "Streaming রেন্ডারিং", en: "Streaming Rendering" },
      {
        bn: "Server-side রেন্ডারিং লাইফসাইকেল",
        en: "Server-side Rendering Lifecycle",
      },
      {
        bn: "Client-side রেন্ডারিং ট্রেড-অফ",
        en: "Client-side Rendering Trade-offs",
      },
      { bn: "হাইব্রিড রেন্ডারিং আর্কিটেকচার", en: "Hybrid Rendering Architecture" },
      { bn: "রেন্ডারিং বাউন্ডারি", en: "Rendering Boundaries" },
      {
        bn: "Dynamic রেন্ডারিং-এর লুকানো খরচ",
        en: "Hidden Costs of Dynamic Rendering",
      },
      {
        bn: "সঠিক রেন্ডারিং স্ট্র্যাটেজি বেছে নেওয়া",
        en: "Choosing the Right Rendering Strategy",
      },
      {
        bn: "প্রোডাকশন রেন্ডারিং আর্কিটেকচার",
        en: "Production Rendering Architecture",
      },
    ],
  },
  {
    no: "08",
    slug: "suspense-streaming",
    title: {
      bn: "Suspense, Streaming ও প্রোগ্রেসিভ UI",
      en: "Suspense, Streaming & Progressive UI",
    },
    summary: {
      bn: "পুরো পেজ লোড হওয়ার আগেই সেটাকে ব্যবহারযোগ্য করে তোলা।",
      en: "Making a page usable before it has finished loading.",
    },
    topics: [
      { bn: "React Suspense মেন্টাল মডেল", en: "React Suspense Mental Model" },
      { bn: "Suspense বাউন্ডারি আর্কিটেকচার", en: "Suspense Boundary Architecture" },
      { bn: "Streaming HTML", en: "Streaming HTML" },
      { bn: "প্রোগ্রেসিভ রেন্ডারিং", en: "Progressive Rendering" },
      { bn: "Nested Suspense বাউন্ডারি", en: "Nested Suspense Boundaries" },
      { bn: "Loading UI বনাম Suspense", en: "Loading UI vs Suspense" },
      { bn: "Suspense Waterfall সমস্যা", en: "Suspense Waterfall Problems" },
      {
        bn: "Suspense দিয়ে Parallel রেন্ডারিং",
        en: "Parallel Rendering with Suspense",
      },
      { bn: "Streaming-এর UX ডিজাইন", en: "UX Design for Streaming" },
      { bn: "Streaming পারফরম্যান্স ডিবাগিং", en: "Debugging Streaming Performance" },
    ],
  },
  {
    no: "09",
    slug: "advanced-react",
    title: {
      bn: "Next.js-এর জন্য অ্যাডভান্সড রিঅ্যাক্ট",
      en: "Advanced React for Next.js",
    },
    summary: {
      bn: "Next.js-এর নিচে যে React টা চলছে।",
      en: "The React that runs underneath Next.js.",
    },
    topics: [
      { bn: "React Server Components", en: "React Server Components" },
      { bn: "Suspense ও Streaming", en: "Suspense & Streaming" },
      { bn: "Concurrent Rendering", en: "Concurrent Rendering" },
      { bn: "Transitions ও useTransition", en: "Transitions & useTransition" },
      { bn: "useOptimistic", en: "useOptimistic" },
      { bn: "useActionState", en: "useActionState" },
      { bn: "React Compiler", en: "React Compiler" },
      { bn: "Hydration", en: "Hydration" },
      { bn: "State architecture", en: "State Architecture" },
      { bn: "Context performance", en: "Context Performance" },
    ],
  },
  {
    no: "10",
    slug: "react-rendering-performance",
    title: {
      bn: "রিঅ্যাক্ট রেন্ডারিং ও স্টেট পারফরম্যান্স",
      en: "React Rendering & State Performance",
    },
    summary: {
      bn: "কেন re-render হচ্ছে — অনুমান নয়, প্রমাণ দিয়ে বের করা।",
      en: "Why it re-renders — found with evidence, not guesswork.",
    },
    topics: [
      { bn: "Re-render-এর রুট কজ অ্যানালাইসিস", en: "Re-render Root Cause Analysis" },
      {
        bn: "কম্পোনেন্ট গ্র্যানুলারিটি ও রেন্ডার কস্ট",
        en: "Component Granularity & Render Cost",
      },
      { bn: "memo কখন ব্যবহার করা উচিত", en: "When to Use memo" },
      { bn: "useMemo — খরচ বনাম লাভ", en: "useMemo Cost vs Benefit" },
      { bn: "useCallback — খরচ বনাম লাভ", en: "useCallback Cost vs Benefit" },
      { bn: "Context থেকে আসা Re-render", en: "Context-induced Re-renders" },
      { bn: "State Colocation", en: "State Colocation" },
      { bn: "Derived State অ্যান্টি-প্যাটার্ন", en: "Derived State Anti-patterns" },
      { bn: "External Store পারফরম্যান্স", en: "External Store Performance" },
      {
        bn: "React Profiler দিয়ে প্রোডাকশন পারফরম্যান্স অ্যানালাইসিস",
        en: "Production Performance Analysis with React Profiler",
      },
    ],
  },
  {
    no: "11",
    slug: "bundle-optimization",
    title: {
      bn: "বান্ডল ও জাভাস্ক্রিপ্ট পারফরম্যান্স",
      en: "Bundle & JavaScript Performance",
    },
    summary: {
      bn: "Library author-দের জন্য সবচেয়ে গুরুত্বপূর্ণ অধ্যায়।",
      en: "The most important chapter if you ship a library.",
    },
    topics: [
      {
        bn: "Tree shaking ও dead code elimination",
        en: "Tree Shaking & Dead Code Elimination",
      },
      { bn: "ESM বনাম CJS", en: "ESM vs CJS" },
      { bn: "Bundle splitting ও chunking", en: "Bundle Splitting & Chunking" },
      { bn: "Dynamic imports", en: "Dynamic Imports" },
      { bn: "Package exports ও sideEffects", en: "Package exports & sideEffects" },
      { bn: "package.json অপটিমাইজেশন", en: "package.json Optimization" },
      { bn: "Dependency analysis", en: "Dependency Analysis" },
      { bn: "Bundle analyzer", en: "Bundle Analyzer" },
      { bn: "JavaScript ও CSS bundle size", en: "JavaScript & CSS Bundle Size" },
      { bn: "Duplicate dependencies", en: "Duplicate Dependencies" },
    ],
  },
  {
    no: "12",
    slug: "code-splitting-loading",
    title: {
      bn: "অ্যাডভান্সড কোড স্প্লিটিং ও লোডিং",
      en: "Advanced Code Splitting & Loading",
    },
    summary: {
      bn: "যতটুকু JavaScript দরকার ঠিক ততটুকুই — আর ঠিক সময়ে।",
      en: "Only the JavaScript you need, exactly when you need it.",
    },
    topics: [
      { bn: "Route-লেভেল কোড স্প্লিটিং", en: "Route-level Code Splitting" },
      { bn: "Component-লেভেল কোড স্প্লিটিং", en: "Component-level Code Splitting" },
      { bn: "next/dynamic", en: "next/dynamic" },
      { bn: "Lazy Loading স্ট্র্যাটেজি", en: "Lazy Loading Strategy" },
      {
        bn: "ভারী থার্ড-পার্টি লাইব্রেরি আইসোলেশন",
        en: "Heavy Third-party Library Isolation",
      },
      { bn: "Client-only প্যাকেজ লোডিং", en: "Client-only Package Loading" },
      {
        bn: "Above-the-fold বনাম Below-the-fold লোডিং",
        en: "Above-the-fold vs Below-the-fold Loading",
      },
      { bn: "JavaScript এক্সিকিউশন কস্ট", en: "JavaScript Execution Cost" },
      { bn: "Chunk ডুপ্লিকেশন অ্যানালাইসিস", en: "Chunk Duplication Analysis" },
      { bn: "প্রোডাকশন বান্ডল বাজেট", en: "Production Bundle Budget" },
    ],
  },
  {
    no: "13",
    slug: "asset-performance",
    title: {
      bn: "Next.js অ্যাসেট ও ব্রাউজার পারফরম্যান্স",
      en: "Next.js Asset & Browser Performance",
    },
    summary: {
      bn: "Image, font আর script — ব্রাউজারে যেগুলো আসলে সময় খায়।",
      en: "Images, fonts, and scripts — what actually costs time in the browser.",
    },
    topics: [
      {
        bn: "next/image অপটিমাইজেশন মেকানিক্স",
        en: "next/image Optimization Mechanics",
      },
      { bn: "next/font অপটিমাইজেশন", en: "next/font Optimization" },
      { bn: "next/script লোডিং স্ট্র্যাটেজি", en: "next/script Loading Strategy" },
      { bn: "Image Priority ও LCP", en: "Image Priority & LCP" },
      { bn: "রেসপন্সিভ ইমেজ আর্কিটেকচার", en: "Responsive Image Architecture" },
      { bn: "Font লোডিং ও Layout Shift", en: "Font Loading & Layout Shift" },
      {
        bn: "থার্ড-পার্টি স্ক্রিপ্ট পারফরম্যান্স",
        en: "Third-party Script Performance",
      },
      { bn: "Preload / Prefetch / Preconnect", en: "Preload / Prefetch / Preconnect" },
      { bn: "Resource Hints", en: "Resource Hints" },
      {
        bn: "Core Web Vitals পারফরম্যান্স ডিবাগিং",
        en: "Core Web Vitals Performance Debugging",
      },
    ],
  },
  {
    no: "14",
    slug: "css-architecture",
    title: {
      bn: "সিএসএস ও ডিজাইন সিস্টেম আর্কিটেকচার",
      en: "CSS & Design System Architecture",
    },
    summary: {
      bn: "Production-level styling ও design token architecture।",
      en: "Production-level styling and design token architecture.",
    },
    topics: [
      { bn: "Tailwind architecture", en: "Tailwind Architecture" },
      { bn: "CSS Modules ও Global CSS", en: "CSS Modules & Global CSS" },
      { bn: "CSS Layers", en: "CSS Layers" },
      { bn: "CSS variables ও design tokens", en: "CSS Variables & Design Tokens" },
      { bn: "Theme architecture ও dark mode", en: "Theme Architecture & Dark Mode" },
      { bn: "CSS tree shaking", en: "CSS Tree Shaking" },
      { bn: "Critical CSS", en: "Critical CSS" },
      {
        bn: "CSS ordering ও style duplication",
        en: "CSS Ordering & Style Duplication",
      },
      { bn: "Component-level CSS", en: "Component-level CSS" },
      {
        bn: "স্কেলেবল ডিজাইন টোকেন আর্কিটেকচার",
        en: "Scalable Design Token Architecture",
      },
    ],
  },
  {
    no: "15",
    slug: "seo",
    title: {
      bn: "অ্যাডভান্সড এসইও ও ওয়েব ডিসকভারেবিলিটি",
      en: "Advanced SEO & Web Discoverability",
    },
    summary: {
      bn: "Metadata API থেকে structured data পর্যন্ত।",
      en: "From the Metadata API to structured data.",
    },
    topics: [
      { bn: "Metadata API", en: "Metadata API" },
      {
        bn: "generateMetadata() ও dynamic metadata",
        en: "generateMetadata() & Dynamic Metadata",
      },
      { bn: "Open Graph", en: "Open Graph" },
      { bn: "Twitter/X cards", en: "Twitter/X Cards" },
      { bn: "Canonical URL", en: "Canonical URL" },
      { bn: "Robots ও Sitemap", en: "Robots & Sitemap" },
      { bn: "Structured data / JSON-LD", en: "Structured Data / JSON-LD" },
      { bn: "Multi-language SEO", en: "Multi-language SEO" },
      {
        bn: "স্কেলে ডায়নামিক SEO আর্কিটেকচার",
        en: "Dynamic SEO Architecture at Scale",
      },
      {
        bn: "SEO পারফরম্যান্স ও রেন্ডারিং স্ট্র্যাটেজি",
        en: "SEO Performance & Rendering Strategy",
      },
    ],
  },
  {
    no: "16",
    slug: "internationalization",
    title: {
      bn: "ইন্টারন্যাশনালাইজেশন ও লোকালাইজেশন",
      en: "Internationalization & Localization",
    },
    summary: {
      bn: "একাধিক ভাষা, একাধিক locale — একই codebase-এ।",
      en: "Many languages, many locales — one codebase.",
    },
    topics: [
      { bn: "i18n architecture", en: "i18n Architecture" },
      { bn: "Locale routing", en: "Locale Routing" },
      { bn: "Language detection", en: "Language Detection" },
      { bn: "Translation architecture", en: "Translation Architecture" },
      { bn: "RTL আর্কিটেকচার", en: "RTL Architecture" },
      { bn: "Localized metadata ও URLs", en: "Localized Metadata & URLs" },
      { bn: "Currency ও date formatting", en: "Currency & Date Formatting" },
      { bn: "Locale-aware Static Generation", en: "Locale-aware Static Generation" },
      { bn: "ট্রান্সলেশন লোডিং পারফরম্যান্স", en: "Translation Loading Performance" },
      {
        bn: "মাল্টি-রিজিয়ন লোকালাইজেশন আর্কিটেকচার",
        en: "Multi-region Localization Architecture",
      },
    ],
  },
  {
    no: "17",
    slug: "security",
    title: {
      bn: "ফ্রন্টএন্ড ইঞ্জিনিয়ারদের জন্য Next.js সিকিউরিটি",
      en: "Next.js Security for Frontend Engineers",
    },
    summary: {
      bn: "ব্যাকএন্ড বানানো নয় — Next.js অ্যাপ্লিকেশনটাকেই secure করা।",
      en: "Not building a backend — hardening the Next.js application itself.",
    },
    topics: [
      { bn: "XSS প্রোটেকশন", en: "XSS Protection" },
      { bn: "CSRF প্রোটেকশন", en: "CSRF Protection" },
      {
        bn: "Authentication ও authorization security",
        en: "Authentication & Authorization Security",
      },
      { bn: "Cookie security", en: "Cookie Security" },
      {
        bn: "Environment variables ও secret management",
        en: "Environment Variables & Secret Management",
      },
      { bn: "Server-only secrets", en: "Server-only Secrets" },
      { bn: "CORS", en: "CORS" },
      { bn: "Input validation", en: "Input Validation" },
      { bn: "Dependency vulnerabilities", en: "Dependency Vulnerabilities" },
      { bn: "Security headers ও CSP", en: "Security Headers & CSP" },
    ],
  },
  {
    no: "18",
    slug: "error-handling",
    title: {
      bn: "এরর হ্যান্ডলিং ও রেজিলিয়েন্ট UI",
      en: "Error Handling & Resilient UI",
    },
    summary: {
      bn: "একটা route-এর problem যেন পুরো application ধ্বংস না করে।",
      en: "One broken route should never take the whole app down.",
    },
    topics: [
      { bn: "Error Boundaries", en: "Error Boundaries" },
      { bn: "error.tsx ও global error", en: "error.tsx & Global Error" },
      { bn: "not-found.tsx", en: "not-found.tsx" },
      { bn: "API errors", en: "API Errors" },
      { bn: "Validation errors", en: "Validation Errors" },
      { bn: "Expected বনাম unexpected errors", en: "Expected vs Unexpected Errors" },
      { bn: "Logging ও error monitoring", en: "Logging & Error Monitoring" },
      { bn: "Graceful degradation", en: "Graceful Degradation" },
      { bn: "Error Recovery ও Retry UX", en: "Error Recovery & Retry UX" },
      { bn: "প্রোডাকশন Failure আইসোলেশন", en: "Production Failure Isolation" },
    ],
  },
  {
    no: "19",
    slug: "environment-deployment",
    title: {
      bn: "প্রোডাকশন ডেপ্লয়মেন্ট ও রানটাইম",
      en: "Production Deployment & Runtime",
    },
    summary: {
      bn: "Build থেকে production runtime পর্যন্ত।",
      en: "From build to production runtime.",
    },
    topics: [
      {
        bn: ".env / .env.local / .env.production",
        en: ".env / .env.local / .env.production",
      },
      {
        bn: "Build-time বনাম runtime variables",
        en: "Build-time vs Runtime Variables",
      },
      { bn: "Production build", en: "Production Build" },
      { bn: "Static export", en: "Static Export" },
      { bn: "Server deployment", en: "Server Deployment" },
      {
        bn: "Edge runtime বনাম Node.js runtime",
        en: "Edge Runtime vs Node.js Runtime",
      },
      { bn: "Serverless functions", en: "Serverless Functions" },
      { bn: "CDN ও caching", en: "CDN & Caching" },
      { bn: "Deployment previews", en: "Deployment Previews" },
      {
        bn: "Build failures ও runtime errors",
        en: "Build Failures & Runtime Errors",
      },
    ],
  },
  {
    no: "20",
    slug: "observability",
    title: {
      bn: "অবজারভেবিলিটি ও প্রোডাকশন ডিবাগিং",
      en: "Observability & Production Debugging",
    },
    summary: {
      bn: "Production-এ কী ঘটছে সেটা আসলে দেখতে পাওয়া।",
      en: "Actually seeing what happens in production.",
    },
    topics: [
      { bn: "Structured logging", en: "Structured Logging" },
      { bn: "Error tracking", en: "Error Tracking" },
      { bn: "Performance monitoring", en: "Performance Monitoring" },
      { bn: "Web Vitals — LCP, CLS, INP", en: "Web Vitals — LCP, CLS, INP" },
      { bn: "Server timing", en: "Server Timing" },
      { bn: "Request tracing", en: "Request Tracing" },
      { bn: "Production debugging", en: "Production Debugging" },
      { bn: "Real User Monitoring (RUM)", en: "Real User Monitoring" },
      {
        bn: "পারফরম্যান্স রিগ্রেশন ডিটেকশন",
        en: "Performance Regression Detection",
      },
      {
        bn: "প্রোডাকশন ইনসিডেন্ট ডিবাগিং ওয়ার্কফ্লো",
        en: "Production Incident Debugging Workflow",
      },
    ],
  },
  {
    no: "21",
    slug: "testing",
    title: {
      bn: "Next.js অ্যাপ্লিকেশন টেস্টিং",
      en: "Testing Next.js Applications",
    },
    summary: {
      bn: "Unit থেকে visual regression পর্যন্ত।",
      en: "From unit tests to visual regression.",
    },
    topics: [
      { bn: "Unit — Vitest / Jest", en: "Unit Testing — Vitest / Jest" },
      {
        bn: "Component — React Testing Library",
        en: "Component Testing — React Testing Library",
      },
      { bn: "E2E — Playwright", en: "E2E Testing — Playwright" },
      { bn: "Server Component testing", en: "Server Component Testing" },
      { bn: "API testing", en: "API Testing" },
      { bn: "Authentication flow testing", en: "Authentication Flow Testing" },
      { bn: "Visual regression testing", en: "Visual Regression Testing" },
      { bn: "Loading ও Error State টেস্টিং", en: "Loading & Error State Testing" },
      { bn: "নেভিগেশন ও URL State টেস্টিং", en: "Navigation & URL State Testing" },
      { bn: "পারফরম্যান্স টেস্টিং", en: "Performance Testing" },
    ],
  },
  {
    no: "22",
    slug: "scalable-architecture",
    title: {
      bn: "স্কেলেবল Next.js আর্কিটেকচার",
      en: "Scalable Next.js Architecture",
    },
    summary: {
      bn: "Feature boundary, dependency rule আর monorepo — বড় codebase-এর কাঠামো।",
      en: "Feature boundaries, dependency rules, and monorepos — the shape of a big codebase.",
    },
    topics: [
      { bn: "Feature-based architecture", en: "Feature-based Architecture" },
      { bn: "Domain-driven structure", en: "Domain-driven Structure" },
      { bn: "Component architecture", en: "Component Architecture" },
      { bn: "Server / client separation", en: "Server / Client Separation" },
      { bn: "Shared utilities", en: "Shared Utilities" },
      { bn: "Dependency boundaries", en: "Dependency Boundaries" },
      { bn: "Monorepo ও Turborepo", en: "Monorepo & Turborepo" },
      { bn: "Shared packages", en: "Shared Packages" },
      { bn: "ফিচার বাউন্ডারি ডিজাইন", en: "Feature Boundary Design" },
      {
        bn: "বড় অ্যাপ্লিকেশনের আর্কিটেকচার ডিসিশন মেকিং",
        en: "Large Application Architecture Decision Making",
      },
    ],
  },
  {
    no: "23",
    slug: "large-scale-nextjs",
    title: {
      bn: "লার্জ-স্কেল Next.js অ্যাপ্লিকেশন",
      en: "Large-Scale Next.js Applications",
    },
    summary: {
      bn: "Multi-tenant, real-time আর distributed system-এর দিকে।",
      en: "Toward multi-tenant, real-time, and distributed systems.",
    },
    topics: [
      { bn: "Monorepo ও Turborepo", en: "Monorepo & Turborepo" },
      { bn: "Micro-frontends", en: "Micro-frontends" },
      { bn: "Multi-tenant architecture", en: "Multi-tenant Architecture" },
      { bn: "Feature flags ও A/B testing", en: "Feature Flags & A/B Testing" },
      { bn: "Real-time applications", en: "Real-time Applications" },
      {
        bn: "WebSockets ও Server-Sent Events",
        en: "WebSockets & Server-Sent Events",
      },
      { bn: "Distributed caching", en: "Distributed Caching" },
      {
        bn: "মাল্টি-রিজিয়ন ফ্রন্টএন্ড আর্কিটেকচার",
        en: "Multi-region Frontend Architecture",
      },
      { bn: "লার্জ-স্কেল রাউট আর্কিটেকচার", en: "Large-scale Route Architecture" },
      {
        bn: "Next.js ফ্রন্টএন্ড টিম ও কোডবেস স্কেলিং",
        en: "Scaling Next.js Frontend Teams & Codebases",
      },
    ],
  },
];



export const curriculum: Chapter[] = raw.map((chapter) => {
  const seen = new Map<string, number>();

  const topics: Topic[] = chapter.topics.map((title) => {
    const base = slugify(title.en);
    // Guard against two lessons in one chapter slugifying to the same string.
    const count = seen.get(base) ?? 0;
    seen.set(base, count + 1);
    const slug = count === 0 ? base : `${base}-${count + 1}`;

    return {
      slug,
      title,
      published: WRITTEN.has(`${chapter.slug}/${slug}`),
    };
  });

  return {
    ...chapter,
    topics,
    published: topics.some((t) => t.published),
  };
});

/** Every lesson in reading order, with the chapter it belongs to. */
export const lessons = curriculum.flatMap((chapter) =>
  chapter.topics.map((topic) => ({ chapter, topic })),
);

export function getChapter(slug: string): Chapter | undefined {
  return curriculum.find((c) => c.slug === slug);
}

export function getLesson(chapterSlug: string, topicSlug: string) {
  return lessons.find(
    (l) => l.chapter.slug === chapterSlug && l.topic.slug === topicSlug,
  );
}

export function getLessonNeighbours(chapterSlug: string, topicSlug: string) {
  const i = lessons.findIndex(
    (l) => l.chapter.slug === chapterSlug && l.topic.slug === topicSlug,
  );
  return {
    prev: i > 0 ? lessons[i - 1] : undefined,
    next: i >= 0 && i < lessons.length - 1 ? lessons[i + 1] : undefined,
  };
}

export const lessonCounts = {
  total: lessons.length,
  published: lessons.filter((l) => l.topic.published).length,
};
