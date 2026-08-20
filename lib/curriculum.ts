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
      bn: "এই API data কতক্ষণ cache থাকবে আর কখন invalidate হবে — উত্তর দিতে পারা।",
      en: "Answering: how long is this data cached, and when does it invalidate?",
    },
    topics: [
      { bn: "Server-side data fetching", en: "Server-side data fetching" },
      { bn: "Client-side data fetching", en: "Client-side data fetching" },
      { bn: "Server Component-এ fetch()", en: "fetch() in Server Components" },
      { bn: "Request memoization", en: "Request memoization" },
      { bn: "Data Cache", en: "Data Cache" },
      { bn: "Full Route Cache", en: "Full Route Cache" },
      { bn: "Router Cache", en: "Router Cache" },
      { bn: "Cache hierarchy", en: "Cache hierarchy" },
      { bn: "Time-based revalidation", en: "Time-based revalidation" },
      { bn: "On-demand revalidation", en: "On-demand revalidation" },
      { bn: "revalidatePath() / revalidateTag()", en: "revalidatePath() / revalidateTag()" },
      { bn: "Cache tags ও invalidation", en: "Cache tags & invalidation" },
      { bn: "Dynamic functions — cookies(), headers()", en: "Dynamic functions — cookies(), headers()" },
      { bn: "Dynamic rendering-এর সাথে cache interaction", en: "Cache interaction with dynamic rendering" },
    ],
  },
  {
    no: "03",
    slug: "server-actions",
    title: { bn: "সার্ভার অ্যাকশন", en: "Server Actions" },
    summary: {
      bn: "Form থেকে database পর্যন্ত — mutation-এর পুরো পথ।",
      en: "The full path from form to database — and back to the UI.",
    },
    topics: [
      { bn: "Server Actions ও \"use server\"", en: 'Server Actions & "use server"' },
      { bn: "Form Actions", en: "Form Actions" },
      { bn: "Server-side mutation", en: "Server-side mutation" },
      { bn: "Form validation", en: "Form validation" },
      { bn: "Progressive enhancement", en: "Progressive enhancement" },
      { bn: "useActionState", en: "useActionState" },
      { bn: "useFormStatus", en: "useFormStatus" },
      { bn: "Error handling", en: "Error handling" },
      { bn: "Server Action-এ authentication", en: "Authentication inside Server Actions" },
      { bn: "Authorization ও security", en: "Authorization & security" },
      { bn: "Mutation-এর পরে revalidation", en: "Revalidation after mutation" },
      { bn: "Optimistic UI", en: "Optimistic UI" },
    ],
  },
  {
    no: "04",
    slug: "routing-architecture",
    title: { bn: "রাউটিং আর্কিটেকচার", en: "Routing Architecture" },
    summary: {
      bn: "শুধু routing না — complex routing architecture।",
      en: "Not just routing — complex routing architecture.",
    },
    topics: [
      { bn: "Nested Routes", en: "Nested Routes" },
      { bn: "Dynamic Routes", en: "Dynamic Routes" },
      { bn: "Catch-all ও Optional Catch-all", en: "Catch-all & Optional Catch-all" },
      { bn: "Route Groups", en: "Route Groups" },
      { bn: "Parallel Routes", en: "Parallel Routes" },
      { bn: "Intercepting Routes", en: "Intercepting Routes" },
      { bn: "Layout hierarchy ও Template", en: "Layout hierarchy & Template" },
      { bn: "Loading UI", en: "Loading UI" },
      { bn: "Error UI", en: "Error UI" },
      { bn: "Not Found ও notFound()", en: "Not Found & notFound()" },
      { bn: "redirect() / permanentRedirect()", en: "redirect() / permanentRedirect()" },
      { bn: "Modal Routing", en: "Modal Routing" },
    ],
  },
  {
    no: "05",
    slug: "middleware-proxy",
    title: { bn: "মিডলওয়্যার ও প্রক্সি", en: "Middleware & Proxy" },
    summary: {
      bn: "Next.js-এর request lifecycle বোঝা।",
      en: "Understanding the Next.js request lifecycle.",
    },
    topics: [
      { bn: "Middleware / Proxy concepts", en: "Middleware / Proxy concepts" },
      { bn: "Request interception", en: "Request interception" },
      { bn: "Authentication checks", en: "Authentication checks" },
      { bn: "Authorization", en: "Authorization" },
      { bn: "Redirect ও Rewrite", en: "Redirect & Rewrite" },
      { bn: "Headers manipulation", en: "Headers manipulation" },
      { bn: "Cookies", en: "Cookies" },
      { bn: "Route matching", en: "Route matching" },
      { bn: "Edge runtime considerations", en: "Edge runtime considerations" },
    ],
  },
  {
    no: "06",
    slug: "auth",
    title: { bn: "অথেনটিকেশন ও অথরাইজেশন", en: "Authentication & Authorization" },
    summary: {
      bn: "Login থেকে permission — protected route পর্যন্ত।",
      en: "From login to permission to protected route.",
    },
    topics: [
      { bn: "Authentication vs Authorization", en: "Authentication vs Authorization" },
      { bn: "Session-based auth", en: "Session-based auth" },
      { bn: "JWT", en: "JWT" },
      { bn: "HTTP-only / Secure cookies, SameSite", en: "HTTP-only / Secure cookies, SameSite" },
      { bn: "OAuth ও Google authentication", en: "OAuth & Google authentication" },
      { bn: "Role-Based Access Control (RBAC)", en: "Role-Based Access Control (RBAC)" },
      { bn: "Permission-Based Access Control", en: "Permission-Based Access Control" },
      { bn: "Route protection", en: "Route protection" },
      { bn: "Server-side authorization", en: "Server-side authorization" },
      { bn: "Client-side UI permission", en: "Client-side UI permission" },
      { bn: "Admin authentication architecture", en: "Admin authentication architecture" },
    ],
  },
  {
    no: "07",
    slug: "database-architecture",
    title: { bn: "ডাটাবেস আর্কিটেকচার", en: "Database Architecture" },
    summary: {
      bn: "কখন Server Component থেকে সরাসরি DB, আর কখন API layer দরকার?",
      en: "When to hit the DB from a Server Component, and when you need an API layer.",
    },
    topics: [
      { bn: "ORM — Prisma / Drizzle", en: "ORM — Prisma / Drizzle" },
      { bn: "PostgreSQL", en: "PostgreSQL" },
      { bn: "Connection management ও pooling", en: "Connection management & pooling" },
      { bn: "Transactions", en: "Transactions" },
      { bn: "Database indexes", en: "Database indexes" },
      { bn: "Pagination ও cursor pagination", en: "Pagination & cursor pagination" },
      { bn: "N+1 problem", en: "N+1 problem" },
      { bn: "Query optimization", en: "Query optimization" },
      { bn: "Migrations ও seed data", en: "Migrations & seed data" },
      { bn: "Server-only database access", en: "Server-only database access" },
    ],
  },
  {
    no: "08",
    slug: "api-architecture",
    title: { bn: "এপিআই আর্কিটেকচার", en: "API Architecture" },
    summary: {
      bn: "Next.js-এর backend capabilities।",
      en: "The backend capabilities of Next.js.",
    },
    topics: [
      { bn: "Route Handlers", en: "Route Handlers" },
      { bn: "GET / POST / PUT / PATCH / DELETE", en: "GET / POST / PUT / PATCH / DELETE" },
      { bn: "Request / Response", en: "Request / Response" },
      { bn: "Validation", en: "Validation" },
      { bn: "Error handling", en: "Error handling" },
      { bn: "Authentication ও Authorization", en: "Authentication & Authorization" },
      { bn: "Rate limiting", en: "Rate limiting" },
      { bn: "Pagination", en: "Pagination" },
      { bn: "API versioning", en: "API versioning" },
      { bn: "Webhooks", en: "Webhooks" },
      { bn: "File upload", en: "File upload" },
      { bn: "Streaming responses", en: "Streaming responses" },
    ],
  },
  {
    no: "09",
    slug: "performance-engineering",
    title: { bn: "পারফরম্যান্স ইঞ্জিনিয়ারিং", en: "Performance Engineering" },
    summary: {
      bn: "এখান থেকেই senior-level Next.js শুরু।",
      en: "Where senior-level Next.js begins.",
    },
    topics: [
      { bn: "Re-render analysis", en: "Re-render analysis" },
      { bn: "memo / useMemo / useCallback", en: "memo / useMemo / useCallback" },
      { bn: "React Compiler", en: "React Compiler" },
      { bn: "Component splitting", en: "Component splitting" },
      { bn: "Performance-এর জন্য Server Components", en: "Server Components for performance" },
      { bn: "Code splitting ও dynamic imports", en: "Code splitting & dynamic imports" },
      { bn: "Lazy loading", en: "Lazy loading" },
      { bn: "Bundle analysis ও tree shaking", en: "Bundle analysis & tree shaking" },
      { bn: "optimizePackageImports", en: "optimizePackageImports" },
      { bn: "Image / Font / Script optimization", en: "Image / Font / Script optimization" },
      { bn: "Streaming ও Suspense boundaries", en: "Streaming & Suspense boundaries" },
    ],
  },
  {
    no: "10",
    slug: "bundle-optimization",
    title: { bn: "বান্ডল অপটিমাইজেশন", en: "Bundle Optimization" },
    summary: {
      bn: "Library author-দের জন্য সবচেয়ে গুরুত্বপূর্ণ অধ্যায়।",
      en: "The most important chapter if you ship a library.",
    },
    topics: [
      { bn: "Tree shaking ও dead code elimination", en: "Tree shaking & dead code elimination" },
      { bn: "ESM vs CJS", en: "ESM vs CJS" },
      { bn: "Bundle splitting ও chunking", en: "Bundle splitting & chunking" },
      { bn: "Dynamic imports", en: "Dynamic imports" },
      { bn: "Package exports ও sideEffects", en: "Package exports & sideEffects" },
      { bn: "package.json optimization", en: "package.json optimization" },
      { bn: "Dependency analysis", en: "Dependency analysis" },
      { bn: "Bundle analyzer", en: "Bundle analyzer" },
      { bn: "JavaScript ও CSS bundle size", en: "JavaScript & CSS bundle size" },
      { bn: "Duplicate dependencies", en: "Duplicate dependencies" },
    ],
  },
  {
    no: "11",
    slug: "css-architecture",
    title: { bn: "সিএসএস আর্কিটেকচার", en: "CSS Architecture" },
    summary: {
      bn: "Production-level styling ও design token architecture।",
      en: "Production-level styling and design token architecture.",
    },
    topics: [
      { bn: "Tailwind architecture", en: "Tailwind architecture" },
      { bn: "CSS Modules ও Global CSS", en: "CSS Modules & Global CSS" },
      { bn: "CSS Layers", en: "CSS Layers" },
      { bn: "CSS variables ও design tokens", en: "CSS variables & design tokens" },
      { bn: "Theme architecture ও dark mode", en: "Theme architecture & dark mode" },
      { bn: "CSS tree shaking", en: "CSS tree shaking" },
      { bn: "Critical CSS", en: "Critical CSS" },
      { bn: "CSS ordering ও style duplication", en: "CSS ordering & style duplication" },
      { bn: "Component-level CSS", en: "Component-level CSS" },
    ],
  },
  {
    no: "12",
    slug: "seo",
    title: { bn: "এসইও", en: "SEO" },
    summary: {
      bn: "Metadata API থেকে structured data পর্যন্ত।",
      en: "From the Metadata API to structured data.",
    },
    topics: [
      { bn: "Metadata API", en: "Metadata API" },
      { bn: "generateMetadata() ও dynamic metadata", en: "generateMetadata() & dynamic metadata" },
      { bn: "Open Graph", en: "Open Graph" },
      { bn: "Twitter/X cards", en: "Twitter/X cards" },
      { bn: "Canonical URL", en: "Canonical URL" },
      { bn: "Robots ও Sitemap", en: "Robots & Sitemap" },
      { bn: "Structured data / JSON-LD", en: "Structured data / JSON-LD" },
      { bn: "Multi-language SEO", en: "Multi-language SEO" },
    ],
  },
  {
    no: "13",
    slug: "internationalization",
    title: { bn: "ইন্টারন্যাশনালাইজেশন", en: "Internationalization" },
    summary: {
      bn: "একাধিক ভাষা, একাধিক locale — একই codebase-এ।",
      en: "Many languages, many locales — one codebase.",
    },
    topics: [
      { bn: "i18n architecture", en: "i18n architecture" },
      { bn: "Locale routing", en: "Locale routing" },
      { bn: "Language detection", en: "Language detection" },
      { bn: "Translation architecture", en: "Translation architecture" },
      { bn: "RTL", en: "RTL" },
      { bn: "Localized metadata ও URLs", en: "Localized metadata & URLs" },
      { bn: "Currency / date formatting", en: "Currency / date formatting" },
    ],
  },
  {
    no: "14",
    slug: "error-handling",
    title: { bn: "এরর হ্যান্ডলিং", en: "Error Handling" },
    summary: {
      bn: "একটা route-এর problem যেন পুরো application ধ্বংস না করে।",
      en: "One broken route should never take the whole app down.",
    },
    topics: [
      { bn: "Error Boundaries", en: "Error Boundaries" },
      { bn: "error.tsx ও global error", en: "error.tsx & global error" },
      { bn: "not-found.tsx", en: "not-found.tsx" },
      { bn: "API errors", en: "API errors" },
      { bn: "Server Action errors", en: "Server Action errors" },
      { bn: "Validation errors", en: "Validation errors" },
      { bn: "Expected vs unexpected errors", en: "Expected vs unexpected errors" },
      { bn: "Logging ও error monitoring", en: "Logging & error monitoring" },
      { bn: "Graceful degradation", en: "Graceful degradation" },
    ],
  },
  {
    no: "15",
    slug: "security",
    title: { bn: "সিকিউরিটি", en: "Security" },
    summary: {
      bn: "এটা skip করলে production-level বলা যাবে না।",
      en: "Skip this and it is not production-level.",
    },
    topics: [
      { bn: "XSS", en: "XSS" },
      { bn: "CSRF", en: "CSRF" },
      { bn: "SQL Injection", en: "SQL Injection" },
      { bn: "Authentication ও authorization security", en: "Authentication & authorization security" },
      { bn: "Cookie security", en: "Cookie security" },
      { bn: "Environment variables ও secret management", en: "Environment variables & secret management" },
      { bn: "Server-only secrets", en: "Server-only secrets" },
      { bn: "CORS", en: "CORS" },
      { bn: "Rate limiting", en: "Rate limiting" },
      { bn: "Input validation", en: "Input validation" },
      { bn: "File upload security", en: "File upload security" },
      { bn: "Dependency vulnerabilities", en: "Dependency vulnerabilities" },
      { bn: "Security headers ও CSP", en: "Security headers & CSP" },
    ],
  },
  {
    no: "16",
    slug: "environment-deployment",
    title: { bn: "এনভায়রনমেন্ট ও ডেপ্লয়মেন্ট", en: "Environment & Deployment" },
    summary: {
      bn: "Build থেকে production runtime পর্যন্ত।",
      en: "From build to production runtime.",
    },
    topics: [
      { bn: ".env / .env.local / .env.production", en: ".env / .env.local / .env.production" },
      { bn: "Build-time vs runtime variables", en: "Build-time vs runtime variables" },
      { bn: "Production build", en: "Production build" },
      { bn: "Static export", en: "Static export" },
      { bn: "Server deployment", en: "Server deployment" },
      { bn: "Edge runtime vs Node.js runtime", en: "Edge runtime vs Node.js runtime" },
      { bn: "Serverless functions", en: "Serverless functions" },
      { bn: "CDN ও caching", en: "CDN & caching" },
      { bn: "Deployment previews", en: "Deployment previews" },
      { bn: "Build failures ও runtime errors", en: "Build failures & runtime errors" },
    ],
  },
  {
    no: "17",
    slug: "observability",
    title: { bn: "অবজারভেবিলিটি", en: "Observability" },
    summary: {
      bn: "Production-এ কী ঘটছে সেটা আসলে দেখতে পাওয়া।",
      en: "Actually seeing what happens in production.",
    },
    topics: [
      { bn: "Logging ও structured logging", en: "Logging & structured logging" },
      { bn: "Error tracking", en: "Error tracking" },
      { bn: "Performance monitoring", en: "Performance monitoring" },
      { bn: "Web Vitals — LCP, CLS, INP", en: "Web Vitals — LCP, CLS, INP" },
      { bn: "Server timing", en: "Server timing" },
      { bn: "Request tracing", en: "Request tracing" },
      { bn: "Production debugging", en: "Production debugging" },
    ],
  },
  {
    no: "18",
    slug: "testing",
    title: { bn: "টেস্টিং", en: "Testing" },
    summary: {
      bn: "Unit থেকে visual regression পর্যন্ত।",
      en: "From unit tests to visual regression.",
    },
    topics: [
      { bn: "Unit — Vitest / Jest", en: "Unit — Vitest / Jest" },
      { bn: "Component — React Testing Library", en: "Component — React Testing Library" },
      { bn: "E2E — Playwright", en: "E2E — Playwright" },
      { bn: "Server Component testing", en: "Server Component testing" },
      { bn: "Server Action testing", en: "Server Action testing" },
      { bn: "API testing", en: "API testing" },
      { bn: "Authentication flow testing", en: "Authentication flow testing" },
      { bn: "Visual regression testing", en: "Visual regression testing" },
    ],
  },
  {
    no: "19",
    slug: "code-organization",
    title: { bn: "কোড অর্গানাইজেশন", en: "Code Organization" },
    summary: {
      bn: "Feature-based structure, boundaries আর monorepo।",
      en: "Feature-based structure, boundaries, and monorepos.",
    },
    topics: [
      { bn: "Feature-based architecture", en: "Feature-based architecture" },
      { bn: "Domain-driven structure", en: "Domain-driven structure" },
      { bn: "Component architecture", en: "Component architecture" },
      { bn: "Server / client separation", en: "Server / client separation" },
      { bn: "Shared utilities", en: "Shared utilities" },
      { bn: "Service layer", en: "Service layer" },
      { bn: "Repository pattern", en: "Repository pattern" },
      { bn: "Validation layer", en: "Validation layer" },
      { bn: "API layer ও database layer", en: "API layer & database layer" },
      { bn: "Dependency boundaries", en: "Dependency boundaries" },
      { bn: "Monorepo ও Turborepo", en: "Monorepo & Turborepo" },
      { bn: "Shared packages", en: "Shared packages" },
    ],
  },
  {
    no: "20",
    slug: "advanced-react",
    title: { bn: "অ্যাডভান্সড রিঅ্যাক্ট", en: "Advanced React" },
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
      { bn: "State architecture", en: "State architecture" },
      { bn: "Context performance", en: "Context performance" },
      { bn: "External stores", en: "External stores" },
    ],
  },
  {
    no: "21",
    slug: "advanced-caching",
    title: { bn: "অ্যাডভান্সড ক্যাশিং", en: "Advanced Caching" },
    summary: {
      bn: "Request → Data Cache → Full Route Cache → Router Cache → Browser।",
      en: "Request → Data Cache → Full Route Cache → Router Cache → Browser.",
    },
    topics: [
      { bn: "Cache invalidation", en: "Cache invalidation" },
      { bn: "Cache revalidation", en: "Cache revalidation" },
      { bn: "Cache tags", en: "Cache tags" },
      { bn: "ISR", en: "ISR" },
      { bn: "Static generation", en: "Static generation" },
      { bn: "Dynamic rendering", en: "Dynamic rendering" },
      { bn: "Request memoization", en: "Request memoization" },
      { bn: "Stale data ও cache consistency", en: "Stale data & cache consistency" },
      { bn: "revalidateTag / revalidatePath", en: "revalidateTag / revalidatePath" },
    ],
  },
  {
    no: "22",
    slug: "large-scale-nextjs",
    title: { bn: "লার্জ-স্কেল Next.js", en: "Large-Scale Next.js" },
    summary: {
      bn: "Multi-tenant, real-time আর distributed system-এর দিকে।",
      en: "Toward multi-tenant, real-time, and distributed systems.",
    },
    topics: [
      { bn: "Monorepo ও Turborepo", en: "Monorepo & Turborepo" },
      { bn: "Micro-frontends", en: "Micro-frontends" },
      { bn: "Multi-tenant architecture", en: "Multi-tenant architecture" },
      { bn: "Feature flags ও A/B testing", en: "Feature flags & A/B testing" },
      { bn: "Background jobs ও queues", en: "Background jobs & queues" },
      { bn: "Webhooks", en: "Webhooks" },
      { bn: "Real-time applications", en: "Real-time applications" },
      { bn: "WebSockets ও Server-Sent Events", en: "WebSockets & Server-Sent Events" },
      { bn: "Rate limiting", en: "Rate limiting" },
      { bn: "Distributed caching", en: "Distributed caching" },
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
