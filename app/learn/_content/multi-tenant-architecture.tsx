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
      bn: "তিন ক্লায়েন্ট, তিন কপি?",
      en: "Three clients, three copies?",
    },
  },
  {
    id: "architecture",
    label: {
      bn: "Tenant রাউটিং পাইপলাইন",
      en: "The tenant routing pipeline",
    },
  },
  {
    id: "mechanisms",
    label: {
      bn: "৩টি মাল্টি-টেন্যান্ট রুল",
      en: "Three multi-tenant rules",
    },
  },
  {
    id: "implementation",
    label: {
      bn: "Middleware rewrite ও data isolation",
      en: "Middleware rewrites & data isolation",
    },
  },
  {
    id: "matrix",
    label: { bn: "ডাটাবেস আইসোলেশন কৌশল", en: "Database isolation strategies" },
  },
  {
    id: "takeaway",
    label: { bn: "Production Takeaways", en: "Production takeaways" },
  },
];

export default function MultiTenantArchitecture() {
  return (
    <article className="doc-prose">
      {/* ── The problem ───────────────────────────────────────────────── */}
      <H2 id="the-problem" anchorOnly>
        তিন ক্লায়েন্ট, তিন কপি?
      </H2>

      <p>
        দুপুর ১২:৩০। নতুন ব্যবসায়িক দাবি এসেছে — একই স্পোর্টস প্ল্যাটফর্ম দিয়ে তিনটি আলাদা কর্পোরেট
        ক্লায়েন্টকে সার্ভিস দিতে হবে: <code>alpha.mysports.com</code>,{" "}
        <code>beta.mysports.com</code> আর একটি কাস্টম ডোমেইন <code>gametime.com</code>। প্রতিটির
        ব্র্যান্ড কালার, লোগো, ডাটা আইসোলেশন আর ফিচার সেট আলাদা।
      </p>

      <Line name="ভুলু ভাই">
        ফাহিম! আমি কি তিনটা আলাদা প্রজেক্ট কপি করব? কিন্তু কাল যদি মূল ফিচারে একটা বাগ ফিক্স করি,
        তাহলে কি তিন জায়গায় গিয়ে আলাদা ডেপ্লয় দিতে হবে?
      </Line>

      <Line name="ফাহিম">
        ভুলু ভাই! খবরদার কপি করবেন না! এর সমাধান <strong>multi-tenant architecture</strong> —
        সোর্স কোড আর ডেপ্লয়মেন্ট একটিই থাকবে, কিন্তু রিকোয়েস্টের hostname দেখে সিস্টেম রানটাইমে ঠিক
        করবে কোন লোগো, কোন থিম আর কোন ক্লায়েন্টের ডাটা দেখাতে হবে।
      </Line>

      <Line name="নেক্সট-ভাই">
        একদম! App Router-এ এর সেরা হাতিয়ার <code>middleware.ts</code> আর ডাইনামিক rewrite। তবে মনে
        রাখবেন — সবচেয়ে কঠিন অংশটা রাউটিং নয়, <strong>ডাটা আইসোলেশন</strong>। ওখানে একটা ভুল মানে
        এক ক্লায়েন্টের ডাটা অন্যের চোখে পড়া।
      </Line>

      {/* ── Architecture ──────────────────────────────────────────────── */}
      <H2 id="architecture">১. Multi-Tenant Routing Pipeline</H2>

      <Diagram>{`┌─────────────────────────────────────────────────────────────────────────────┐
│                    NEXT.JS MULTI-TENANT ROUTING PIPELINE                    │
└─────────────────────────────────────────────────────────────────────────────┘

    [ alpha.mysports.com ]              [ gametime.com — custom domain ]
                 │                                   │
                 └─────────────────┬─────────────────┘
                                   ▼
                    [ MIDDLEWARE — middleware.ts ]
                      • read the Host header
                      • resolve host → tenant slug (from an edge cache)
                      • rewrite internally, URL unchanged in the browser
                                   │
                                   ▼
                    app/[tenant]/matches/page.tsx
                                   │
          ┌────────────────────────┴────────────────────────┐
          ▼                                                 ▼
┌───────────────────────────┐                   ┌───────────────────────────┐
│      TENANT: ALPHA        │                   │     TENANT: GAMETIME      │
│  red theme, alpha logo    │                   │  blue theme, own logo     │
│  every query: tenant_1    │                   │  every query: tenant_2    │
└───────────────────────────┘                   └───────────────────────────┘`}</Diagram>

      {/* ── Mechanisms ────────────────────────────────────────────────── */}
      <H2 id="mechanisms">২. কোর মাল্টি-টেন্যান্ট রুল</H2>

      <p>
        <strong>Host-based rewriting:</strong> ইউজারের ব্রাউজারে URL অপরিবর্তিত রেখে middleware
        অভ্যন্তরীণভাবে রিকোয়েস্টকে <code>/[tenant]/...</code> রাউটে rewrite করবে। ইউজার কখনো জানবে
        না যে ভেতরে একটি ডাইনামিক সেগমেন্ট আছে।
      </p>

      <p>
        <strong>Strict data isolation:</strong> প্রতিটি কোয়েরিতে <code>tenantId</code> ফিল্টার
        থাকতেই হবে। মানুষের মনে রাখার ওপর ভরসা করবেন না — ORM extension বা database-এর row level
        security দিয়ে ফিল্টারটি স্বয়ংক্রিয় করুন। একটি ভুলে যাওয়া <code>where</code> এখানে
        নীরব ডাটা ব্রিচ।
      </p>

      <p>
        <strong>Dynamic branding via CSS variables:</strong> প্রতি tenant-এর জন্য আলাদা CSS ফাইল
        বিল্ড না করে CSS custom property দিয়ে রেন্ডার টাইমে কালার ইনজেক্ট করুন — তখন হাজার tenant-ও
        একই বান্ডেলে চলে।
      </p>

      {/* ── Implementation ────────────────────────────────────────────── */}
      <H2 id="implementation">৩. Production Code Implementation</H2>

      <H3>🟢 Step 1 — middleware দিয়ে tenant resolution</H3>

      <CodeBlock filename="src/middleware.ts">{`// 🟢 PRODUCTION PATTERN: resolve the tenant at the edge, rewrite invisibly
import { NextResponse, type NextRequest } from 'next/server';

const MAIN_DOMAIN = process.env.NEXT_PUBLIC_MAIN_DOMAIN ?? 'mysports.com';

export async function middleware(req: NextRequest) {
  const url = req.nextUrl;
  const hostname = (req.headers.get('host') ?? '').split(':')[0];

  let tenantSlug = '';

  // case 1 — a subdomain: alpha.mysports.com
  if (hostname.endsWith(\`.\${MAIN_DOMAIN}\`)) {
    tenantSlug = hostname.replace(\`.\${MAIN_DOMAIN}\`, '');
  }
  // case 2 — a custom domain: gametime.com
  else if (hostname !== MAIN_DOMAIN && !hostname.includes('localhost')) {
    // 🟢 an edge KV lookup, never a database round trip on every request
    tenantSlug = (await lookupCustomDomain(hostname)) ?? '';
  }

  // the apex domain and www are the marketing site, not a tenant
  if (!tenantSlug || tenantSlug === 'www') {
    return NextResponse.next();
  }

  // 🟢 the internal route shape must not be reachable from outside
  if (url.pathname.startsWith(\`/\${tenantSlug}\`)) {
    return NextResponse.redirect(new URL('/', req.url));
  }

  url.pathname = \`/\${tenantSlug}\${url.pathname}\`;

  const response = NextResponse.rewrite(url);
  response.headers.set('x-tenant-slug', tenantSlug);
  return response;
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};`}</CodeBlock>

      <H3>🟢 Step 2 — ORM লেভেলে আইসোলেশন বাধ্যতামূলক</H3>

      <CodeBlock filename="src/lib/tenant-db.ts">{`// 🟢 PRODUCTION PATTERN: the filter is applied by the client, not by the caller
import { PrismaClient } from '@prisma/client';

const base = new PrismaClient();

/**
 * Returns a client whose every query on a tenant-scoped model is filtered by
 * tenantId. A developer who forgets the where clause still cannot read another
 * tenant's rows — the isolation does not depend on anyone remembering it.
 */
export function tenantDb(tenantId: string) {
  return base.$extends({
    query: {
      match: {
        async $allOperations({ args, query }) {
          args.where = { ...args.where, tenantId };
          return query(args);
        },
      },
    },
  });
}`}</CodeBlock>

      <H3>🟢 Step 3 — tenant-aware পেজ</H3>

      <CodeBlock filename="src/app/[tenant]/page.tsx">{`// 🟢 PRODUCTION PATTERN: branding and data both scoped to one tenant
import type { CSSProperties } from 'react';
import { notFound } from 'next/navigation';
import { db } from '@/lib/db';
import { tenantDb } from '@/lib/tenant-db';
import { TenantHeader } from '@/components/tenant/TenantHeader';

interface TenantPageProps {
  params: Promise<{ tenant: string }>;
}

export default async function TenantHomePage({ params }: TenantPageProps) {
  const { tenant: slug } = await params;

  const tenant = await db.tenant.findUnique({ where: { slug } });
  if (!tenant) notFound();

  // 🟢 a scoped client: this query cannot reach another tenant's rows
  const matches = await tenantDb(tenant.id).match.findMany({
    where: { status: 'LIVE' },
  });

  return (
    <div
      className="min-h-screen"
      // 🟢 one bundle serves every tenant; only these values differ
      style={{ '--primary-color': tenant.primaryColor } as CSSProperties}
    >
      <TenantHeader name={tenant.name} logo={tenant.logoUrl} />

      <main className="mx-auto max-w-5xl p-6">
        <h1 className="mb-4 text-2xl font-bold">Live matches — {tenant.name}</h1>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          {matches.map((match) => (
            <div
              key={match.id}
              className="rounded border border-[var(--primary-color)] p-4 shadow-sm"
            >
              <h2 className="font-semibold">{match.title}</h2>
              <span className="text-sm text-slate-500">{match.score}</span>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}`}</CodeBlock>

      {/* ── Matrix ────────────────────────────────────────────────────── */}
      <H2 id="matrix">৪. Database Isolation Strategies</H2>

      <Table
        head={["কৌশল", "ডাটাবেস মডেল", "সুবিধা", "ট্রেড-অফ"]}
        rows={[
          [
            "Shared DB, shared schema",
            "সব tenant এক টেবিলে, tenantId কলাম",
            "সবচেয়ে সস্তা, মাইগ্রেশন একবারেই 🟢",
            "একটি ভুল কোয়েরিতে ডাটা লিক 🔴",
          ],
          [
            "Shared DB, separate schema",
            "প্রতি tenant-এর আলাদা schema",
            "তুলনামূলক নিরাপদ, ব্যাকআপ সহজ",
            "মাইগ্রেশন প্রতি schema-তে চালাতে হয়",
          ],
          [
            "Database per tenant",
            "প্রতি tenant-এর আলাদা DB",
            "সর্বোচ্চ আইসোলেশন 🟢",
            "খরচ বেশি, connection pooling কঠিন 🔴",
          ],
        ]}
      />

      <Line name="ভুলু ভাই">
        মাইন্ড ব্লোয়িং ফাহিম! আমি ভাবছিলাম তিনটা প্রজেক্ট খুলতে হবে। অথচ একটাই কোডবেজ দিয়ে middleware
        আর rewrite ব্যবহার করে শত শত ক্লায়েন্টকে নিজস্ব ডোমেইন ও ব্র্যান্ডিং সহ সার্ভিস দেওয়া যাবে!
      </Line>

      {/* ── Takeaways ─────────────────────────────────────────────────── */}
      <H2 id="takeaway">Production Takeaways</H2>

      <Note>
        <ul>
          <li>
            <strong>Automate the tenantId filter:</strong> ORM extension বা row level security
            দিয়ে ফিল্টারটি বাধ্যতামূলক করুন — মানুষের মনে রাখার ওপর ডাটা আইসোলেশন ছাড়বেন না।
          </li>
          <li>
            <strong>Cache the domain lookup at the edge:</strong> middleware-এ প্রতি রিকোয়েস্টে
            ডাটাবেস কল করবেন না; <code>domain → tenant</code> ম্যাপিং edge KV-তে রাখুন।
          </li>
          <li>
            <strong>Brand with CSS variables:</strong> tenant-প্রতি আলাদা স্টাইলশিট বিল্ড না করে
            custom property দিয়ে থিম ইনজেক্ট করুন — তখন tenant যোগ করা নিছক একটি DB row।
          </li>
        </ul>
      </Note>
    </article>
  );
}
