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
      bn: "তিন রিপো, এক বাটন, তিন কপি",
      en: "Three repos, one button, three copies",
    },
  },
  {
    id: "architecture",
    label: {
      bn: "Turborepo-র কাঠামো",
      en: "The shape of a Turborepo",
    },
  },
  {
    id: "mechanisms",
    label: {
      bn: "৩টি আর্কিটেকচারাল কনসেপ্ট",
      en: "Three architectural concepts",
    },
  },
  {
    id: "implementation",
    label: {
      bn: "Workspace, pipeline ও shared package",
      en: "Workspaces, pipelines, shared packages",
    },
  },
  {
    id: "matrix",
    label: { bn: "Polyrepo vs monorepo", en: "Polyrepo vs monorepo" },
  },
  {
    id: "takeaway",
    label: { bn: "Production Takeaways", en: "Production takeaways" },
  },
];

export default function MonorepoTurborepo() {
  return (
    <article className="doc-prose">
      {/* ── The problem ───────────────────────────────────────────────── */}
      <H2 id="the-problem" anchorOnly>
        তিন রিপো, এক বাটন, তিন কপি
      </H2>

      <p>
        সকাল ১০:১৫। নতুন একটা Admin Dashboard যোগ করতে গিয়ে ভুলু ভাই আলাদা একটি Git repository
        খুলেছেন। কিন্তু এখন মূল অ্যাপ আর এডমিন অ্যাপের মধ্যে একই UI বাটন, হেডার আর Tailwind config
        কপি-পেস্ট করতে করতে তিনি দিশেহারা। তার ওপর প্রাইভেট npm প্যাকেজের ভার্সন না মেলায় এডমিন
        প্যানেলে বাটন ক্লিক করলে পেজ ক্র্যাশ করছে।
      </p>

      <Line name="ভুলু ভাই">
        ফাহিম! মূল অ্যাপের ডিজাইনে ছোট একটা পরিবর্তন করলে এডমিন আর পার্টনার পোর্টালেও গিয়ে ম্যানুয়ালি
        ফাইল কপি করতে হচ্ছে! আর টেস্ট করতে গেলে তিনটা আলাদা এডিটর উইন্ডো খুলে তিনবার{" "}
        <code>npm run dev</code> চালাতে হয়।
      </Line>

      <Line name="ফাহিম">
        ভুলু ভাই! আপনি polyrepo ট্র্যাপে আটকে গেছেন। আলাদা রিপোজিটরি মানে কোড ডুপ্লিকেশন আর dependency
        version nightmare। সমাধান হলো একটি রিপোজিটরিতে একাধিক অ্যাপ ও শেয়ার্ড প্যাকেজ রাখা — অর্থাৎ{" "}
        <strong>monorepo</strong>। আর সেটিকে দ্রুত বিল্ড ও ক্যাশ করার সেরা টুল{" "}
        <strong>Turborepo</strong>।
      </Line>

      <Line name="নেক্সট-ভাই">
        একদম! Turborepo <code>workspace:*</code> প্রোটোকল দিয়ে জিরো-ওভারহেডে কোড শেয়ার করে, আর স্মার্ট
        task caching দিয়ে অপরিবর্তিত প্যাকেজ পুনরায় বিল্ড করাই বন্ধ করে দেয়।
      </Line>

      {/* ── Architecture ──────────────────────────────────────────────── */}
      <H2 id="architecture">১. Turborepo Structure</H2>

      <Diagram>{`┌─────────────────────────────────────────────────────────────────────────────┐
│                       TURBOREPO MONOREPO STRUCTURE                          │
└─────────────────────────────────────────────────────────────────────────────┘

  my-enterprise-app/
  ├── apps/
  │   ├── web/                  ──► Next.js main portal      (port 3000)
  │   ├── admin/                ──► Next.js admin dashboard  (port 3001)
  │   └── partner/              ──► Next.js partner portal   (port 3002)
  │
  ├── packages/                 ──► SHARED INTERNAL PACKAGES
  │   ├── ui/                   ──► @repo/ui                 design system
  │   ├── typescript-config/    ──► @repo/typescript-config   shared tsconfig
  │   └── eslint-config/        ──► @repo/eslint-config       shared rules
  │
  ├── package.json              ──► workspace declaration
  └── turbo.json                ──► task graph and cache rules

  one PR can change a shared package and all three apps together`}</Diagram>

      {/* ── Mechanisms ────────────────────────────────────────────────── */}
      <H2 id="mechanisms">২. কোর আর্কিটেকচারাল কনসেপ্ট</H2>

      <p>
        <strong>Workspace protocol:</strong> লোকাল প্যাকেজ ব্যবহার করতে npm registry-তে প্রাইভেট
        প্যাকেজ পাবলিশ করার দরকার নেই। <code>package.json</code>-এ{" "}
        <code>&quot;@repo/ui&quot;: &quot;workspace:*&quot;</code> লিখলেই প্যাকেজ ম্যানেজার লোকাল
        ফোল্ডারটিকে সরাসরি symlink করে দেয় — কোনো publish, কোনো ভার্সন বাম্প নেই।
      </p>

      <p>
        <strong>Task graph &amp; caching:</strong> <code>turbo.json</code>-এ বলে দেওয়া হয় কোন
        টাস্ক কার ওপর নির্ভরশীল। <code>dependsOn: [&quot;^build&quot;]</code>-এর{" "}
        <code>^</code> মানে &ldquo;আগে আমার dependency-গুলো&rdquo;। আর কোনো প্যাকেজের ইনপুট না
        বদলালে Turborepo আগের আউটপুট ক্যাশ থেকে ফিরিয়ে দেয় — কাজটা আবার করে না।
      </p>

      <p>
        <strong>Strict package boundaries:</strong> প্রতিটি প্যাকেজের নিজস্ব{" "}
        <code>package.json</code> থাকবে, আর সে কেবল তার <code>exports</code> ফিল্ডে ঘোষিত পথ দিয়েই
        বাইরের সাথে কথা বলবে। এটিই আগের অধ্যায়ের public API barrier — এবার প্যাকেজ লেভেলে।
      </p>

      {/* ── Implementation ────────────────────────────────────────────── */}
      <H2 id="implementation">৩. Production Code Implementation</H2>

      <H3>🟢 Step 1 — root কনফিগারেশন</H3>

      <CodeBlock label="JSON" filename="package.json">{`{
  "name": "my-enterprise-app",
  "private": true,
  "workspaces": ["apps/*", "packages/*"],
  "scripts": {
    "build": "turbo build",
    "dev": "turbo dev",
    "lint": "turbo lint"
  },
  "devDependencies": {
    "turbo": "^2.0.0"
  }
}`}</CodeBlock>

      <CodeBlock label="JSON" filename="turbo.json">{`{
  "$schema": "https://turbo.build/schema.json",
  "tasks": {
    "build": {
      // 🟢 '^build' means: build my dependencies first
      "dependsOn": ["^build"],
      "inputs": ["$TURBO_DEFAULT$", ".env*"],
      "outputs": [".next/**", "!.next/cache/**", "dist/**"]
    },
    "lint": {},
    "test": {
      "dependsOn": ["^build"]
    },
    "dev": {
      // 🟢 a dev server is never cacheable and never exits
      "cache": false,
      "persistent": true
    }
  }
}`}</CodeBlock>

      <H3>🟢 Step 2 — শেয়ার্ড UI প্যাকেজ</H3>

      <CodeBlock label="JSON" filename="packages/ui/package.json">{`{
  "name": "@repo/ui",
  "version": "0.0.0",
  "private": true,
  "exports": {
    // 🟢 only these paths exist to the outside world
    "./button": "./src/button.tsx",
    "./card": "./src/card.tsx"
  },
  "peerDependencies": {
    "react": "^19.0.0"
  }
}`}</CodeBlock>

      <CodeBlock filename="packages/ui/src/button.tsx">{`import * as React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary';
  children: React.ReactNode;
}

export function Button({ variant = 'primary', children, ...props }: ButtonProps) {
  const base = 'px-4 py-2 rounded font-medium transition-colors';

  const variants = {
    primary: 'bg-blue-600 text-white hover:bg-blue-700',
    secondary: 'bg-slate-200 text-slate-800 hover:bg-slate-300',
  };

  return (
    <button className={\`\${base} \${variants[variant]}\`} {...props}>
      {children}
    </button>
  );
}`}</CodeBlock>

      <H3>🟢 Step 3 — অ্যাপ সেটি ব্যবহার করে</H3>

      <CodeBlock label="JSON" filename="apps/web/package.json">{`{
  "name": "web",
  "private": true,
  "dependencies": {
    // 🟢 a symlink to ../../packages/ui — no registry, no version drift
    "@repo/ui": "workspace:*",
    "next": "^15.0.0",
    "react": "^19.0.0"
  }
}`}</CodeBlock>

      <CodeBlock filename="apps/web/app/page.tsx">{`import { Button } from '@repo/ui/button';

export default function HomePage() {
  return (
    <main className="space-y-4 p-8">
      <h1 className="text-2xl font-bold">Main Sports Portal</h1>
      <Button variant="primary">Live Updates</Button>
    </main>
  );
}`}</CodeBlock>

      <p>
        Next.js যদি প্যাকেজের সোর্স TypeScript সরাসরি পড়ে, তাহলে অ্যাপের কনফিগে সেটিকে ট্রান্সপাইল
        করতে বলে দিতে হয় — নইলে বিল্ড টাইমে সিনট্যাক্স এরর আসবে।
      </p>

      <CodeBlock filename="apps/web/next.config.ts">{`import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  // 🟢 compile workspace packages that ship source, not build output
  transpilePackages: ['@repo/ui'],
};

export default nextConfig;`}</CodeBlock>

      {/* ── Matrix ────────────────────────────────────────────────────── */}
      <H2 id="matrix">৪. Polyrepo vs Turborepo Monorepo</H2>

      <Table
        head={["দিক", "Polyrepo", "Turborepo monorepo"]}
        rows={[
          [
            "কোড শেয়ারিং",
            "publish → version bump → install 🔴",
            "workspace:* দিয়ে সরাসরি 🟢",
          ],
          [
            "রিফ্যাক্টরিং",
            "একাধিক রিপোতে আলাদা PR",
            "একটি PR-এ প্যাকেজ ও অ্যাপ একসাথে 🟢",
          ],
          [
            "CI বিল্ড টাইম",
            "প্রতিবার সবকিছু নতুন করে 🔴",
            "অপরিবর্তিত প্যাকেজ ক্যাশ থেকে 🟢",
          ],
          [
            "টাইপ সেফটি",
            "অ্যাপগুলোর মধ্যে টাইপ সিঙ্ক রাখা কঠিন",
            "ক্রস-অ্যাপ টাইপ সেফটি বিল্ট-ইন 🟢",
          ],
          [
            "ঝুঁকি",
            "ড্রিফট — কপিগুলো ধীরে ধীরে আলাদা হয়ে যায়",
            "শেয়ার্ড প্যাকেজে খারাপ চেঞ্জ সব অ্যাপ ভাঙে",
          ],
        ]}
      />

      <Line name="ভুলু ভাই">
        অসাধারণ ফাহিম! আগে তিন রিপোর ভার্সন মেলাতে পুরো দিন যেত — এখন একই কোডবেজে তিনটা অ্যাপই
        টাইপ-সেফলি চলছে, আর দ্বিতীয়বার বিল্ড দিলে টার্বো ক্যাশ থেকেই দিয়ে দিচ্ছে!
      </Line>

      {/* ── Takeaways ─────────────────────────────────────────────────── */}
      <H2 id="takeaway">Production Takeaways</H2>

      <Note>
        <ul>
          <li>
            <strong>Use workspace:* for internal packages:</strong> লোকাল প্যাকেজের জন্য কখনো
            ভার্সন নম্বর লিখবেন না — symlink-ই যথেষ্ট।
          </li>
          <li>
            <strong>Declare the task graph honestly:</strong>{" "}
            <code>dependsOn: [&quot;^build&quot;]</code> আর সঠিক <code>outputs</code> না দিলে
            ক্যাশিং হয় কাজ করবে না, নয় ভুল আউটপুট দেবে।
          </li>
          <li>
            <strong>Keep shared packages small and pure:</strong> <code>packages/</code>-এর কোড
            যত সাধারণ, তত বেশি অ্যাপে নির্ভয়ে ব্যবহার করা যায় — আর একটি খারাপ চেঞ্জে তত কম ভাঙে।
          </li>
        </ul>
      </Note>
    </article>
  );
}
