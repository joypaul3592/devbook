import type { Article, Category, JournalEntry, Series, Project } from "./types";

export const categories: Category[] = [
  {
    slug: "web-development",
    name: "ওয়েব ডেভেলপমেন্ট",
    nameEn: "Web Development",
    description: "আধুনিক ওয়েব তৈরির কলাকৌশল, পারফরম্যান্স, এবং বেস্ট প্র্যাকটিস।",
    count: 12,
    gradient: "from-emerald-500/20 to-teal-500/10",
  },
  {
    slug: "react",
    name: "React",
    nameEn: "React",
    description: "React-এর গভীরে — হুকস, কম্পোজিশন, পারফরম্যান্স অপ্টিমাইজেশন।",
    count: 9,
    gradient: "from-cyan-500/20 to-blue-500/10",
  },
  {
    slug: "nextjs",
    name: "Next.js",
    nameEn: "Next.js",
    description: "App Router, Server Components, Streaming এবং আধুনিক Next.js প্যাটার্ন।",
    count: 7,
    gradient: "from-slate-500/20 to-gray-500/10",
  },
  {
    slug: "typescript",
    name: "TypeScript",
    nameEn: "TypeScript",
    description: "Type safety, advanced patterns, এবং টাইপস্ক্রিপ্টের সর্বোচ্চ ব্যবহার।",
    count: 8,
    gradient: "from-blue-500/20 to-indigo-500/10",
  },
  {
    slug: "open-source",
    name: "ওপেন সোর্স",
    nameEn: "Open Source",
    description: "ওপেন সোর্সে অবদান, কমিউনিটি, এবং সফটওয়্যার শেয়ার করার অভিজ্ঞতা।",
    count: 4,
    gradient: "from-purple-500/20 to-violet-500/10",
  },
  {
    slug: "career",
    name: "ক্যারিয়ার",
    nameEn: "Career",
    description: "ডেভেলপার হিসেবে বেড়ে ওঠা, লার্নিং প্যাথ, এবং প্রফেশনাল গ্রোথ।",
    count: 6,
    gradient: "from-amber-500/20 to-orange-500/10",
  },
  {
    slug: "personal-notes",
    name: "ব্যক্তিগত নোটস",
    nameEn: "Personal Notes",
    description: "ডেভেলপমেন্ট জীবনের ব্যক্তিগত অভিজ্ঞতা, চিন্তা, এবং উপলব্ধি।",
    count: 5,
    gradient: "from-rose-500/20 to-pink-500/10",
  },
  {
    slug: "ui-ux",
    name: "UI/UX",
    nameEn: "UI/UX",
    description: "ডিজাইন সিস্টেম, ইউজার এক্সপেরিয়েন্স, এবং সুন্দর ইন্টারফেস তৈরি।",
    count: 5,
    gradient: "from-fuchsia-500/20 to-pink-500/10",
  },
  {
    slug: "productivity",
    name: "প্রোডাক্টিভিটি",
    nameEn: "Productivity",
    description: "ডেভেলপারদের জন্য কাজের ফ্লো, টুলস, এবং ফোকাস বাড়ানোর কৌশল।",
    count: 3,
    gradient: "from-lime-500/20 to-green-500/10",
  },
];

export const articles: Article[] = [
  {
    slug: "nextjs-app-router-deep-dive",
    title: "Next.js App Router-এর গভীরে: Server Components থেকে Streaming পর্যন্ত",
    titleEn: "Deep Dive into Next.js App Router",
    excerpt:
      "App Router শুধু একটা রাউটিং সিস্টেম নয়। এটা React-এর সার্ভার কম্পোনেন্ট আর্কিটেকচারের উপর নির্মিত একটা সম্পূর্ণ নতুন চিন্তার ধরন। আমি গত তিন মাস ধরে এটা নিয়ে কাজ করে যা শিখেছি তাই এখানে শেয়ার করছি।",
    category: "Next.js",
    categorySlug: "nextjs",
    tags: ["Next.js", "React", "Server Components", "App Router"],
    publishedAt: "2026-06-05",
    readingTime: 12,
    coverGradient: "from-slate-800 via-slate-700 to-slate-900",
    featured: true,
    series: "Mastering Next.js",
    seriesSlug: "mastering-nextjs",
    seriesPart: 3,
  },
  {
    slug: "typescript-utility-types",
    title: "TypeScript-এর Utility Types: আমার প্রতিদিনের অস্ত্রাগার",
    titleEn: "TypeScript Utility Types: My Daily Arsenal",
    excerpt:
      "Partial, Required, Pick, Omit, Record — এগুলো শুধু টাইপ হেল্পার নয়, এগুলো আপনার কোডকে self-documenting করে তোলে। প্রতিটা ইউটিলিটি টাইপ কোথায় এবং কেন ব্যবহার করবেন তার বাস্তব উদাহরণ।",
    category: "TypeScript",
    categorySlug: "typescript",
    tags: ["TypeScript", "Type Safety", "Utility Types"],
    publishedAt: "2026-05-28",
    readingTime: 8,
    coverGradient: "from-blue-900 via-blue-800 to-indigo-900",
    featured: false,
  },
  {
    slug: "react-hooks-mental-model",
    title: "React Hooks-এর মানসিক মডেল: useEffect আসলে কী করে?",
    titleEn: "React Hooks Mental Model: What Does useEffect Actually Do?",
    excerpt:
      "বেশিরভাগ ডেভেলপার useEffect-কে 'lifecycle method-এর বিকল্প' হিসেবে ভাবেন। কিন্তু এটা সম্পূর্ণ ভুল মানসিক মডেল। useEffect হলো 'synchronization mechanism'। এই পার্থক্য বুঝলে আপনার অনেক bug দূর হয়ে যাবে।",
    category: "React",
    categorySlug: "react",
    tags: ["React", "Hooks", "useEffect", "Mental Model"],
    publishedAt: "2026-05-20",
    readingTime: 10,
    coverGradient: "from-cyan-900 via-cyan-800 to-teal-900",
    featured: false,
  },
  {
    slug: "css-container-queries",
    title: "CSS Container Queries: Responsive Design-এর নতুন যুগ",
    titleEn: "CSS Container Queries: The New Era of Responsive Design",
    excerpt:
      "Viewport-based responsive design-এর দিন শেষ হতে চলেছে। Container queries দিয়ে এখন কম্পোনেন্ট নিজেই তার পরিবেশ বুঝতে পারে। Tailwind CSS-এ কীভাবে ব্যবহার করবেন তার সম্পূর্ণ গাইড।",
    category: "ওয়েব ডেভেলপমেন্ট",
    categorySlug: "web-development",
    tags: ["CSS", "Container Queries", "Responsive Design", "Tailwind"],
    publishedAt: "2026-05-14",
    readingTime: 7,
    coverGradient: "from-emerald-900 via-green-800 to-teal-900",
    featured: false,
  },
  {
    slug: "open-source-contribution-guide",
    title: "প্রথম ওপেন সোর্স Contribution: ভয় দূর করার সম্পূর্ণ গাইড",
    titleEn: "First Open Source Contribution: Complete Fear-Removal Guide",
    excerpt:
      "আমার প্রথম PR merge হওয়ার দিন আমি কতটা উত্তেজিত ছিলাম সেটা ভাষায় বলতে পারব না। কিন্তু সেই পয়েন্টে পৌঁছাতে যা যা বাধা ছিল, সেগুলো কাটিয়ে উঠতে আপনাকে সাহায্য করতে চাই।",
    category: "ওপেন সোর্স",
    categorySlug: "open-source",
    tags: ["Open Source", "GitHub", "Git", "Community"],
    publishedAt: "2026-05-08",
    readingTime: 9,
    coverGradient: "from-violet-900 via-purple-800 to-fuchsia-900",
    featured: false,
  },
  {
    slug: "design-system-from-scratch",
    title: "Design System শূন্য থেকে: একজন Developer-এর দৃষ্টিকোণ",
    titleEn: "Design System from Scratch: A Developer's Perspective",
    excerpt:
      "UI লাইব্রেরি ব্যবহার না করে নিজের design system তৈরি করলে আসলে কতটা কঠিন? Tailwind CSS v4, CVA, এবং TypeScript দিয়ে আমি কীভাবে এই সাইটের সম্পূর্ণ component library বানালাম।",
    category: "UI/UX",
    categorySlug: "ui-ux",
    tags: ["Design System", "Tailwind CSS", "CVA", "Components"],
    publishedAt: "2026-04-30",
    readingTime: 11,
    coverGradient: "from-fuchsia-900 via-pink-800 to-rose-900",
    featured: false,
  },
];

export const journalEntries: JournalEntry[] = [
  {
    id: "j-001",
    date: "2026-06-10",
    content:
      "আজকে Turbopack নিয়ে কাজ করতে গিয়ে বুঝলাম, build speed শুধু সংখ্যা নয় — এটা developer experience-এর একটা মূল অংশ। Fast feedback loop মানে বেশি experiment, মানে ভালো কোড।",
    tags: ["Turbopack", "DX", "Performance"],
    type: "discovery",
  },
  {
    id: "j-002",
    date: "2026-06-08",
    content:
      "React 19-এর `use()` API একটা গেম-চেঞ্জার। Promise-কে সরাসরি component-এ unwrap করা যাচ্ছে Suspense-এর সাথে। এটা async patterns সম্পূর্ণ নতুনভাবে লেখার সুযোগ দিচ্ছে।",
    tags: ["React 19", "Suspense", "Async"],
    type: "thought",
  },
  {
    id: "j-003",
    date: "2026-06-05",
    content:
      "এই ব্লগের navigation component শেষ করলাম আজ। Framer Motion দিয়ে mobile menu-র animation লিখতে গিয়ে বুঝলাম, ভালো animation মানে 'দেখা যায় না' — সেটাই সেরা।",
    tags: ["Animation", "Framer Motion", "UX"],
    type: "build",
  },
  {
    id: "j-004",
    date: "2026-06-02",
    content:
      "TypeScript-এর `satisfies` operator নিয়ে একটা বড় 'aha moment' হলো। Type assertion আর type annotation-এর মাঝামাঝি একটা perfect middle ground। এটা নিয়ে একটা আর্টিকেল লিখতে হবে।",
    tags: ["TypeScript", "satisfies", "Type Safety"],
    type: "note",
  },
  {
    id: "j-005",
    date: "2026-05-29",
    content:
      "Web Animations API নিয়ে experiment করলাম। CSS animations vs JavaScript animations কখন কোনটা — এই প্রশ্নের উত্তর আসলে 'compositor thread'-এর ধারণা বুঝলে পরিষ্কার হয়ে যায়।",
    tags: ["Web Animations", "Performance", "CSS"],
    type: "experiment",
  },
];

export const series: Series[] = [
  {
    slug: "mastering-nextjs",
    title: "Next.js আয়ত্তে আনুন",
    titleEn: "Mastering Next.js",
    description:
      "App Router থেকে শুরু করে Production deployment পর্যন্ত — Next.js-এর সম্পূর্ণ যাত্রা।",
    gradient: "from-slate-800 to-slate-900",
    totalParts: 6,
    parts: [
      { part: 1, title: "App Router পরিচিতি", slug: "nextjs-app-router-intro", published: true },
      { part: 2, title: "Server vs Client Components", slug: "nextjs-server-client", published: true },
      { part: 3, title: "Server Components থেকে Streaming পর্যন্ত", slug: "nextjs-app-router-deep-dive", published: true },
      { part: 4, title: "Data Fetching Patterns", slug: "nextjs-data-fetching", published: false },
      { part: 5, title: "Authentication & Authorization", slug: "nextjs-auth", published: false },
      { part: 6, title: "Production Deployment", slug: "nextjs-production", published: false },
    ],
  },
  {
    slug: "typescript-mastery",
    title: "TypeScript দক্ষতা",
    titleEn: "TypeScript Mastery",
    description:
      "TypeScript-এর বেসিক থেকে অ্যাডভান্সড ট্যাকটিক্স — type-safe কোড লেখার সম্পূর্ণ গাইড।",
    gradient: "from-blue-800 to-indigo-900",
    totalParts: 5,
    parts: [
      { part: 1, title: "Type System ভিত্তি", slug: "ts-foundations", published: true },
      { part: 2, title: "Generics গভীরে", slug: "ts-generics", published: true },
      { part: 3, title: "Utility Types অস্ত্রাগার", slug: "typescript-utility-types", published: true },
      { part: 4, title: "Conditional Types", slug: "ts-conditional", published: false },
      { part: 5, title: "Template Literal Types", slug: "ts-template-literals", published: false },
    ],
  },
];

export const projects: Project[] = [
  {
    slug: "devbook",
    name: "DevBook",
    description: "এই ব্লগ সাইটটি নিজেই একটি প্রজেক্ট — Next.js, Tailwind CSS v4, এবং MDX দিয়ে তৈরি।",
    tech: ["Next.js", "TypeScript", "Tailwind CSS v4", "Framer Motion", "MDX"],
    github: "https://github.com",
    status: "active",
    year: 2026,
    gradient: "from-slate-800 to-slate-900",
  },
  {
    slug: "bangla-ui",
    name: "Bangla UI",
    description: "বাংলা ভাষার জন্য অপ্টিমাইজড React component library — Bengali typography প্রথম।",
    tech: ["React", "TypeScript", "Storybook", "Rollup"],
    github: "https://github.com",
    status: "wip",
    year: 2026,
    gradient: "from-emerald-800 to-teal-900",
  },
  {
    slug: "type-safe-env",
    name: "type-safe-env",
    description: "Environment variables-কে TypeScript দিয়ে validate এবং type-safe করার ছোট utility।",
    tech: ["TypeScript", "Zod", "Node.js"],
    github: "https://github.com",
    status: "active",
    year: 2025,
    gradient: "from-blue-800 to-indigo-900",
  },
];

export function getArticleBySlug(slug: string): Article | undefined {
  return articles.find((a) => a.slug === slug);
}

export function getArticlesByCategory(categorySlug: string): Article[] {
  return articles.filter((a) => a.categorySlug === categorySlug);
}

export function getFeaturedArticle(): Article | undefined {
  return articles.find((a) => a.featured);
}

export function getLatestArticles(count = 5): Article[] {
  return [...articles]
    .sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime())
    .slice(0, count);
}

export function getCategoryBySlug(slug: string): Category | undefined {
  return categories.find((c) => c.slug === slug);
}

export function getSeriesBySlug(slug: string): Series | undefined {
  return series.find((s) => s.slug === slug);
}

export function formatDate(dateStr: string, locale = "bn-BD"): string {
  return new Date(dateStr).toLocaleDateString(locale, {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}
