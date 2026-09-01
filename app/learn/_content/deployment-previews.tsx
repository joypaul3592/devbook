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
      bn: "অসম্পূর্ণ ফিচার সোজা প্রোডাকশনে",
      en: "An unfinished feature, live",
    },
  },
  {
    id: "architecture",
    label: {
      bn: "Preview ওয়ার্কফ্লো লাইফসাইকেল",
      en: "The preview workflow lifecycle",
    },
  },
  {
    id: "mechanisms",
    label: { bn: "৪টি আর্কিটেকচারাল কনসেপ্ট", en: "Four architectural concepts" },
  },
  {
    id: "implementation",
    label: {
      bn: "ডাইনামিক base URL রেজলভার",
      en: "A dynamic base URL resolver",
    },
  },
  {
    id: "matrix",
    label: { bn: "Production vs Preview", en: "Production vs preview" },
  },
  {
    id: "takeaway",
    label: { bn: "Production Takeaways", en: "Production takeaways" },
  },
];

export default function DeploymentPreviews() {
  return (
    <article className="doc-prose">
      {/* ── The problem ───────────────────────────────────────────────── */}
      <H2 id="the-problem" anchorOnly>
        অসম্পূর্ণ ফিচার সোজা প্রোডাকশনে
      </H2>

      <p>
        সন্ধ্যা ৭:৩০। ভুলু ভাই তার নতুন ফিচার রিডিজাইন করে ক্লায়েন্টকে দেখানোর জন্য সরাসরি{" "}
        <code>main</code> ব্রাঞ্চে পুশ দিয়ে দিলেন। ক্লায়েন্ট পরিবর্তন দেখে পছন্দ করলেন না এবং কারেকশন
        চাইলেন। কিন্তু ততক্ষণে এই অসম্পূর্ণ কোড লাইভ প্রোডাকশনে চলে যাওয়ায় রিয়েল ইউজাররা ভাঙা ডিজাইন
        দেখা শুরু করেছে।
      </p>

      <Line name="ভুলু ভাই">
        ফাহিম! ক্লায়েন্ট বা QA টিমকে নতুন ফিচার মার্জ করার আগেই টেস্ট করতে দেখানোর কি কোনো নিরাপদ উপায়
        নেই? বারবার সরাসরি লাইভে ডেপ্লয় করা তো মারাত্মক ঝুঁকিপূর্ণ!
      </Line>

      <Line name="ফাহিম">
        ভুলু ভাই! এর জন্যই deployment previews! গিটহাবে কোনো ফিচারের জন্য PR ওপেন করলেই সাথে সাথে একটি
        ইউনিক, সিকিউর লাইভ টেস্ট URL তৈরি হয়ে যায়। <code>main</code> ব্রাঞ্চে মার্জ না হওয়া পর্যন্ত
        এটি একদম আইসোলেটেড থাকে।
      </Line>

      <Line name="নেক্সট-ভাই">
        একদম! Deployment preview ব্যবহার করলে প্রোডাকশন ডাটাবেস বা লাইভ ট্রাফিকে কোনো প্রভাব না ফেলে
        টিম মেম্বার, ডিজাইনার ও ক্লায়েন্ট সরাসরি ওই প্রিভিউ লিংকে গিয়ে ফিচার টেস্ট ও কমেন্ট করতে
        পারে!
      </Line>

      {/* ── Architecture ──────────────────────────────────────────────── */}
      <H2 id="architecture">১. Deployment Previews Workflow</H2>

      <Diagram>{`┌─────────────────────────────────────────────────────────────────────────────┐
│                   DEPLOYMENT PREVIEWS WORKFLOW                              │
└─────────────────────────────────────────────────────────────────────────────┘

 git checkout -b feature/new-cart
                               │
                               ▼
 open a pull request on GitHub
                               │
                               ▼
 ┌───────────────────────────────────────────────────────────┐
 │ AUTOMATED PREVIEW ENGINE (Vercel / Netlify / your CI)     │
 │ ├─ 1. detects the PR branch, spawns an isolated build     │
 │ ├─ 2. connects to the staging / branch database           │
 │ └─ 3. mints a unique preview URL                          │
 │      my-app-git-feature-new-cart-org.vercel.app           │
 └─────────────────────────────┬─────────────────────────────┘
                               ▼
 team / QA / client review the live URL and leave feedback
                               │
         ┌─────────────────────┴─────────────────────┐
         ▼ approved 🟢                               ▼ changes requested 🔴
 merge into main                            push fixes to the branch
         │                                  (the preview URL updates itself)
         ▼
 production deployment
 (the preview environment is destroyed on merge)`}</Diagram>

      {/* ── Mechanisms ────────────────────────────────────────────────── */}
      <H2 id="mechanisms">২. কোর আর্কিটেকচারাল কনসেপ্ট</H2>

      <p>
        <strong>Ephemeral staging environments:</strong> প্রতিটি PR-এর জন্য একটি আলাদা প্রোডাকশন-লাইক
        ইনস্ট্যান্স তৈরি হয়। এটি ততদিনই বেঁচে থাকে যতদিন PR ওপেন থাকে — মার্জ বা ক্লোজ হলে পরিবেশটি
        অটোমেটিক ধ্বংস হয়ে যায়।
      </p>

      <p>
        <strong>Environment &amp; secrets isolation:</strong> সবচেয়ে বড় বিপদ হলো ভুলবশত প্রোডাকশন
        ডাটাবেসে টেস্ট ডাটা ঢোকানো! প্ল্যাটফর্মে preview environment variables আলাদা সেট করতে হয়,
        যাতে প্রিভিউ বিল্ড কেবল টেস্ট বা স্টেজিং ডাটাবেসের সাথে কানেক্ট করে।
      </p>

      <p>
        <strong>Dynamic host handling:</strong> প্রিভিউ ডোমেইন প্রতিবার বদলায়, তাই OAuth রিডাইরেক্ট,
        webhook callback বা absolute URL তৈরির জন্য অ্যাপে ডাইনামিক হোস্ট রিড করার মেকানিজম থাকতে হয়
        — হার্ডকোড করা ডোমেইন প্রিভিউতে ভেঙে যাবে।
      </p>

      <p>
        <strong>Database branching:</strong> আধুনিক ক্লাউড ডাটাবেস (Neon, Supabase, PlanetScale) PR
        ওপেন হওয়ার সাথে সাথে ডাটাবেসেরও একটি স্পিন-অফ branch তৈরি করে দেয়। ফলে টেস্ট ডাটা মূল
        প্রোডাকশন ডাটাবেসকে বিন্দুমাত্র প্রভাবিত করে না।
      </p>

      {/* ── Implementation ────────────────────────────────────────────── */}
      <H2 id="implementation">৩. Production Code Implementation</H2>

      <H3>❌ Anti-pattern — a hardcoded domain and shared production secrets</H3>

      <CodeBlock filename="lib/auth-config.ts">{`// 🔴 POOR PRACTICE: a static domain in every environment
// testing auth in a preview will bounce the user back into production

export function getAuthRedirectUrl() {
  // ❌ always production, even from a preview deployment
  return 'https://myproduct.com/api/auth/callback';
}`}</CodeBlock>

      <H3>🟢 Production pattern — dynamic URLs and isolated environments</H3>

      <p>
        <strong>Step 1 — base URL রেজলভার।</strong>
      </p>

      <CodeBlock filename="lib/site-url.ts">{`// 🟢 PRODUCTION PATTERN: one resolver for local, preview and production

export function getBaseUrl(): string {
  // 1. in the browser, the current origin is always correct
  if (typeof window !== 'undefined') return window.location.origin;

  // 2. production: the stable, user-facing domain
  if (
    process.env.VERCEL_ENV === 'production' &&
    process.env.VERCEL_PROJECT_PRODUCTION_URL
  ) {
    return \`https://\${process.env.VERCEL_PROJECT_PRODUCTION_URL}\`;
  }

  // 3. preview: the per-deployment URL the platform injects
  if (process.env.VERCEL_URL) {
    return \`https://\${process.env.VERCEL_URL}\`;
  }

  // 4. local development
  return \`http://localhost:\${process.env.PORT || 3000}\`;
}`}</CodeBlock>

      <p>
        <strong>Step 2 — OAuth callback-এ ব্যবহার।</strong>
      </p>

      <CodeBlock filename="actions/auth.ts">{`// 🟢 PRODUCTION PATTERN: callbacks that follow the deployment they run in
'use server';

import { redirect } from 'next/navigation';
import { getBaseUrl } from '@/lib/site-url';

export async function loginWithOAuth(provider: 'github' | 'google') {
  const baseUrl = getBaseUrl();

  // 🟢 resolves to the preview URL in a preview, production URL in production
  const callbackUrl = \`\${baseUrl}/api/auth/callback/\${provider}\`;

  const authUrl =
    \`https://provider.com/oauth/authorize\` +
    \`?client_id=\${process.env.OAUTH_CLIENT_ID}\` +
    \`&redirect_uri=\${encodeURIComponent(callbackUrl)}\`;

  redirect(authUrl);
}`}</CodeBlock>

      <p>
        <strong>Step 3 — প্রিভিউ যেন ইনডেক্স না হয়।</strong>
      </p>

      <CodeBlock filename="app/robots.ts">{`// 🟢 PRODUCTION PATTERN: keep preview deployments out of search results
import type { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  const isProduction = process.env.VERCEL_ENV === 'production';

  // 🟢 a preview URL indexed by Google is a real SEO incident —
  // duplicate content competing with your own production pages
  if (!isProduction) {
    return { rules: { userAgent: '*', disallow: '/' } };
  }

  return {
    rules: { userAgent: '*', allow: '/' },
    sitemap: 'https://myproduct.com/sitemap.xml',
  };
}`}</CodeBlock>

      {/* ── Matrix ────────────────────────────────────────────────────── */}
      <H2 id="matrix">৪. Production vs Preview Environment</H2>

      <Table
        head={["বৈশিষ্ট্য", "Production environment", "Preview environment"]}
        rows={[
          [
            "ডোমেইন",
            "স্থায়ী (myproduct.com)",
            "ডাইনামিক (myproduct-git-feat.vercel.app)",
          ],
          [
            "লাইফস্প্যান",
            "সবসময় রানিং",
            "PR খোলা থাকা পর্যন্ত — ephemeral 🟢",
          ],
          [
            "ডাটাবেস টার্গেট",
            "production database",
            "staging / DB branch / test DB 🟢",
          ],
          [
            "উদ্দেশ্য",
            "রিয়েল ইউজারদের সার্ভিস দেওয়া",
            "কোড রিভিউ, QA টেস্ট, ক্লায়েন্ট ডেমো 🟢",
          ],
          ["অ্যাক্সেস কন্ট্রোল", "পাবলিক", "পাসওয়ার্ড বা SSO দিয়ে প্রোটেক্টেড 🟢"],
        ]}
      />

      <Line name="ভুলু ভাই">
        কনসেপ্ট পুরোপুরি ক্লিয়ার ফাহিম! এখন বুঝেছি, লাইভ প্রজেক্ট না ভেঙে নিশ্চিন্তে কাজ করার একমাত্র
        উপায় হলো প্রতিটি PR-এর জন্য অটোমেটিক deployment preview লিংক ব্যবহার করা!
      </Line>

      {/* ── Takeaways ─────────────────────────────────────────────────── */}
      <H2 id="takeaway">Production Takeaways</H2>

      <Note>
        <ul>
          <li>
            <strong>Protect preview deployments:</strong> ক্লায়েন্ট বা ইন্টারনাল প্রজেক্টের প্রিভিউ লিংক
            যেন সার্চ ইঞ্জিনে ইনডেক্স না হয় — <code>robots.ts</code>-এ ডিসঅ্যালো করুন এবং
            প্ল্যাটফর্মে password protection এনাবল রাখুন।
          </li>
          <li>
            <strong>Never point previews to the production DB:</strong> প্রিভিউ এনভায়রনমেন্টের জন্য
            আলাদা ডাটাবেস ক্রেডেনশিয়াল সেট করে রাখুন — নাহলে QA-র টেস্ট অর্ডার আসল ইনভেন্টরি থেকে
            কেটে নেবে।
          </li>
          <li>
            <strong>Resolve URLs dynamically:</strong> absolute URL কখনো হার্ডকোড করবেন না — একটি{" "}
            <code>getBaseUrl()</code> হেল্পার দিয়ে তিন এনভায়রনমেন্টেই সঠিক ডোমেইন রেজলভ করুন।
          </li>
        </ul>
      </Note>
    </article>
  );
}
