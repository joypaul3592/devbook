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
      bn: "এক টিমের ভুলে পুরো সাইট ডাউন",
      en: "One team's mistake, everyone's outage",
    },
  },
  {
    id: "architecture",
    label: {
      bn: "Multi-zone আর্কিটেকচার",
      en: "The multi-zone architecture",
    },
  },
  {
    id: "mechanisms",
    label: {
      bn: "৩টি জোন রুল",
      en: "Three zone rules",
    },
  },
  {
    id: "implementation",
    label: {
      bn: "Rewrite, basePath ও cross-zone নেভিগেশন",
      en: "Rewrites, basePath, cross-zone links",
    },
  },
  {
    id: "matrix",
    label: { bn: "Monolith vs multi-zone", en: "Monolith vs multi-zone" },
  },
  {
    id: "takeaway",
    label: { bn: "Production Takeaways", en: "Production takeaways" },
  },
];

export default function MicroFrontends() {
  return (
    <article className="doc-prose">
      {/* ── The problem ───────────────────────────────────────────────── */}
      <H2 id="the-problem" anchorOnly>
        এক টিমের ভুলে পুরো সাইট ডাউন
      </H2>

      <p>
        সকাল ১১:১৫। আজ এক ভয়াবহ কাণ্ড ঘটেছে — &ldquo;স্পোর্টস স্কোর&rdquo; টিমের এক ডেভেলপার ছোট
        একটা CSS আর request param চেঞ্জ পুশ করেছিলেন। সেই ধাক্কায় পুরো &ldquo;অ্যালার্ট ও
        নোটিফিকেশন&rdquo; মডিউল ক্র্যাশ করেছে। মনোলিথ ডেপ্লয় হতে সময় লাগে ২০ মিনিট, আর একটা টিমের
        ভুলে পুরো কোম্পানির সিস্টেম বন্ধ।
      </p>

      <Line name="ভুলু ভাই">
        ফাহিম! বড় টিমে একটা মনোলিথ কোডবেজ মেইনটেইন করা নরক হয়ে দাঁড়িয়েছে! স্কোর টিম ফিচার ডেপ্লয়
        করতে চাইলে অ্যানালিটিক্স টিমের গ্রিন সিগন্যালের জন্য ঘণ্টার পর ঘণ্টা অপেক্ষা করতে হয়।
      </Line>

      <Line name="ফাহিম">
        ভুলু ভাই! এর আর্কিটেকচারাল সমাধান <strong>micro-frontends</strong>। ব্যাকএন্ডে যেমন মনোলিথ
        ভেঙে মাইক্রো-সার্ভিস হয়, তেমনি ফ্রন্টএন্ডেও বিশাল অ্যাপকে একাধিক স্বাধীন অ্যাপে ভাগ করা যায় —
        প্রতিটি টিম নিজের অ্যাপ আলাদাভাবে বিল্ড, টেস্ট আর ডেপ্লয় করবে।
      </Line>

      <Line name="নেক্সট-ভাই">
        একদম! App Router-এ এটি করার সবচেয়ে পরিচ্ছন্ন উপায় হলো{" "}
        <strong>Multi-Zones</strong> — rewrite দিয়ে একাধিক স্বাধীন Next.js অ্যাপকে ইউজারের কাছে একটিই
        সাইট হিসেবে দেখানো। তবে সাবধান — এটি সমাধানের চেয়ে সংগঠনের প্রশ্ন বেশি।
      </Line>

      {/* ── Architecture ──────────────────────────────────────────────── */}
      <H2 id="architecture">১. Multi-Zones Architecture</H2>

      <Diagram>{`┌─────────────────────────────────────────────────────────────────────────────┐
│                     NEXT.JS MULTI-ZONES ARCHITECTURE                        │
└─────────────────────────────────────────────────────────────────────────────┘

                               [ USER BROWSER ]
                                      │
                                 my-sports.com
                                      ▼
                        [ SHELL ZONE — main Next.js app ]
                          owns /, the nav, and the rewrites
                                      │
            ┌─────────────────────────┴─────────────────────────┐
            │ /scores/*                                          │ /analytics/*
            ▼                                                    ▼
┌───────────────────────────┐                       ┌───────────────────────────┐
│    ZONE 1: SCORES APP     │                       │   ZONE 2: ANALYTICS APP   │
│  standalone Next.js       │                       │  standalone Next.js       │
│  • deploys on its own     │                       │  • deploys on its own     │
│  • owned by team A        │                       │  • owned by team B        │
│  • basePath: /scores      │                       │  • basePath: /analytics   │
└───────────────────────────┘                       └───────────────────────────┘

  one zone's broken deploy leaves the others untouched`}</Diagram>

      {/* ── Mechanisms ────────────────────────────────────────────────── */}
      <H2 id="mechanisms">২. কোর জোন রুল</H2>

      <p>
        <strong>Independent deployment:</strong> প্রতিটি zone-এর নিজস্ব রিপো বা ওয়ার্কস্পেস, নিজস্ব
        CI পাইপলাইন। স্কোর অ্যাপ আপডেট হলে শুধু সেটিই ডেপ্লয় হবে — অ্যানালিটিক্স রিবিল্ড করার
        প্রয়োজনই নেই। এটিই micro-frontend-এর একমাত্র আসল প্রতিশ্রুতি; বাকি সবই এর খরচ।
      </p>

      <p>
        <strong>Asset prefix isolation:</strong> প্রতিটি সাব-অ্যাপে নির্দিষ্ট{" "}
        <code>basePath</code> ও <code>assetPrefix</code> সেট করতে হবে। নইলে দুই অ্যাপের{" "}
        <code>_next/static</code> পরস্পরকে ওভাররাইট করবে, আর ইউজার একটি অ্যাপের JS দিয়ে অন্যটি
        চালানোর চেষ্টা করবে।
      </p>

      <p>
        <strong>Hard navigation across zones:</strong> এক zone থেকে অন্য zone-এ যেতে{" "}
        <code>next/link</code> ব্যবহার করা যাবে না — ক্লায়েন্ট রাউটার তখন অন্য অ্যাপের রাউট নিজের ভেবে
        হাতড়াবে। নেটিভ <code>&lt;a&gt;</code> ট্যাগ দিয়ে সম্পূর্ণ পেজ লোড হতে দিন, যাতে নতুন
        রানটাইম ঠিকভাবে বুট হয়।
      </p>

      {/* ── Implementation ────────────────────────────────────────────── */}
      <H2 id="implementation">৩. Production Code Implementation</H2>

      <H3>🟢 Step 1 — shell অ্যাপের rewrite</H3>

      <CodeBlock filename="apps/shell/next.config.ts">{`// 🟢 PRODUCTION PATTERN: the shell proxies each path prefix to its own app
import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  async rewrites() {
    return [
      // both the bare path and everything under it must be forwarded
      {
        source: '/scores',
        destination: \`\${process.env.SCORES_APP_URL}/scores\`,
      },
      {
        source: '/scores/:path*',
        destination: \`\${process.env.SCORES_APP_URL}/scores/:path*\`,
      },

      {
        source: '/analytics',
        destination: \`\${process.env.ANALYTICS_APP_URL}/analytics\`,
      },
      {
        source: '/analytics/:path*',
        destination: \`\${process.env.ANALYTICS_APP_URL}/analytics/:path*\`,
      },

      // 🟢 easily forgotten, and the zone silently 404s its own assets
      {
        source: '/scores-static/:path*',
        destination: \`\${process.env.SCORES_APP_URL}/scores-static/:path*\`,
      },
    ];
  },
};

export default nextConfig;`}</CodeBlock>

      <H3>🟢 Step 2 — স্বাধীন সাব-অ্যাপ</H3>

      <CodeBlock filename="apps/scores/next.config.ts">{`// 🟢 PRODUCTION PATTERN: every route and asset of this zone is namespaced
import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  // every route in this app now lives under /scores
  basePath: '/scores',

  // 🟢 a distinct asset prefix, so two zones never fight over _next/static
  assetPrefix: '/scores-static',
};

export default nextConfig;`}</CodeBlock>

      <H3>🟢 Step 3 — cross-zone নেভিগেশন</H3>

      <CodeBlock filename="packages/ui/src/zone-link.tsx">{`// 🟢 PRODUCTION PATTERN: same zone routes softly, another zone loads fully
'use client';

import Link from 'next/link';
import type { ReactNode } from 'react';

interface ZoneLinkProps {
  href: string;
  /** true when the target lives in a different Next.js application */
  crossZone?: boolean;
  children: ReactNode;
  className?: string;
}

export function ZoneLink({ href, crossZone = false, children, className }: ZoneLinkProps) {
  // 🟢 a plain anchor: the browser discards this runtime and boots the other app.
  //    next/link here would try to prefetch a route this app does not have.
  if (crossZone) {
    return (
      <a href={href} className={className}>
        {children}
      </a>
    );
  }

  return (
    <Link href={href} className={className}>
      {children}
    </Link>
  );
}`}</CodeBlock>

      <p>
        শেয়ার্ড অথেনটিকেশনের জন্য কুকি অ্যাপেক্স ডোমেইনে সেট করতে হবে (
        <code>.my-sports.com</code>), নইলে প্রতিটি zone আলাদা করে লগইন চাইবে — আর ইউজারের কাছে
        &ldquo;একটাই সাইট&rdquo;-এর ভ্রমটি সাথে সাথেই ভেঙে যাবে।
      </p>

      {/* ── Matrix ────────────────────────────────────────────────────── */}
      <H2 id="matrix">৪. Monolith vs Multi-Zones</H2>

      <Table
        head={["দিক", "Monolith", "Multi-zones"]}
        rows={[
          [
            "ডেপ্লয়মেন্ট আইসোলেশন",
            "শূন্য — এক চেঞ্জে পুরো অ্যাপ 🔴",
            "প্রতিটি zone স্বাধীন 🟢",
          ],
          [
            "টিম ওনারশিপ",
            "মার্জ কনফ্লিক্ট ও অপেক্ষা",
            "স্বাধীন কোডবেজ, স্বাধীন রিলিজ 🟢",
          ],
          [
            "Blast radius",
            "একটি এররে পুরো সাইট ডাউন 🔴",
            "এরর একটি zone-এই সীমাবদ্ধ 🟢",
          ],
          [
            "সেটআপ জটিলতা",
            "খুব সহজ 🟢",
            "প্রক্সি, কুকি, asset prefix — সবই কনফিগার করতে হয় 🔴",
          ],
          [
            "নেভিগেশন",
            "সব সফট, ইনস্ট্যান্ট 🟢",
            "cross-zone মানে পুরো পেজ লোড",
          ],
        ]}
      />

      <Line name="ভুলু ভাই">
        দারুণ ফাহিম! এখন স্কোর টিম নিজেদের অ্যাপ যখন খুশি ডেপ্লয় করতে পারবে, আর তাদের কোনো ভুলে
        নোটিফিকেশন মডিউল আর ডাউন হবে না।
      </Line>

      {/* ── Takeaways ─────────────────────────────────────────────────── */}
      <H2 id="takeaway">Production Takeaways</H2>

      <Note>
        <ul>
          <li>
            <strong>Don&rsquo;t adopt prematurely:</strong> এটি সাংগঠনিক সমস্যার সমাধান, টেকনিক্যাল
            নয়। টিম যতক্ষণ একে অপরের রিলিজ আটকাচ্ছে না, ততক্ষণ মডুলার মনোলিথই ভালো।
          </li>
          <li>
            <strong>Namespace every asset:</strong> প্রতিটি zone-এ আলাদা <code>basePath</code> ও{" "}
            <code>assetPrefix</code> দিন, আর shell-এ asset পথটিও rewrite করতে ভুলবেন না।
          </li>
          <li>
            <strong>Share auth at the apex domain:</strong> কুকি{" "}
            <code>.my-sports.com</code>-এ সেট করুন — নইলে প্রতিটি zone আলাদা সাইটের মতো আচরণ করবে।
          </li>
        </ul>
      </Note>
    </article>
  );
}
