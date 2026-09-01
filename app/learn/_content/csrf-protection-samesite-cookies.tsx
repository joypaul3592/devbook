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
      bn: "বাইরের সাইট থেকে ফান্ড ট্রান্সফার",
      en: "A fund transfer from someone else's site",
    },
  },
  {
    id: "architecture",
    label: {
      bn: "SameSite defense আর্কিটেকচার",
      en: "The SameSite defense architecture",
    },
  },
  {
    id: "mechanisms",
    label: { bn: "৪টি আর্কিটেকচারাল কনসেপ্ট", en: "Four architectural concepts" },
  },
  {
    id: "implementation",
    label: {
      bn: "Secure কুকি ও origin গার্ড",
      en: "Secure cookies & origin guards",
    },
  },
  {
    id: "matrix",
    label: { bn: "Security Feature Matrix", en: "Security feature matrix" },
  },
  {
    id: "takeaway",
    label: { bn: "Production Takeaways", en: "Production takeaways" },
  },
];

export default function CsrfProtectionSameSiteCookies() {
  return (
    <article className="doc-prose">
      {/* ── The problem ───────────────────────────────────────────────── */}
      <H2 id="the-problem" anchorOnly>
        বাইরের সাইট থেকে ফান্ড ট্রান্সফার
      </H2>

      <p>
        রাত ৭:৪৫। ভুলু ভাই হঠাৎ একটি নতুন সিকিউরিটি বাগ রিপোর্ট পেয়ে কপালে হাত দিয়ে বসে আছেন! একজন
        সিকিউরিটি অ্যানালিস্ট দেখিয়েছেন যে ইউজার লগইন থাকা অবস্থায় কোনো ক্ষতিকর বাহ্যিক ওয়েবসাইটে (যেমন{" "}
        <code>attacker-site.com</code>) একটি ফিশিং বাটনে ক্লিক করলেই ব্যাকগ্রাউন্ডে ভুলু ভাইয়ের
        অ্যাপে ফান্ড ট্রান্সফারের অ্যাকশন ট্রিগার হয়ে যাচ্ছে! ব্রাউজার স্বয়ংক্রিয়ভাবে অরিজিনাল সাইটের
        সেশন কুকি পাঠিয়ে দিচ্ছে, আর অ্যাপ ভাবছে ইউজার নিজেই বাটন চেপেছে।
      </p>

      <Line name="ভুলু ভাই">
        ফাহিম! এ তো মহা বিপদ! অন্য সাইট থেকে ফর্ম সাবমিট করলেও ব্রাউজার কীভাবে আমাদের সেশন কুকি পাঠিয়ে
        দিচ্ছে? কুকি দিয়ে তো শুধু আমাদের সাইটেই রিকোয়েস্ট যাওয়ার কথা! এই CSRF অ্যাটাক বন্ধ করার উপায়
        কী?
      </Line>

      <Line name="ফাহিম">
        ভুলু ভাই! ট্রেডিশনাল ব্রাউজার কুকি অরিজিন বিবেচনা না করেই যেকোনো ক্রস-সাইট রিকোয়েস্টে কুকি
        যুক্ত করে দেয় — যদি না আপনি কুকিতে <code>SameSite</code> attribute সঠিকভাবে কনফিগার করেন! আর
        API বা ফর্মে origin validation না থাকলে এই অ্যাটাক সাকসেসফুল হয়ে যায়।
      </Line>

      <Line name="নেক্সট-ভাই">
        একদম! App Router-এ Server Actions-এর জন্য ডিফল্টভাবেই <code>Origin</code> ও{" "}
        <code>Host</code> হেডার কম্পেয়ার করে বিল্ট-ইন CSRF defense দেওয়া থাকে! কিন্তু কাস্টম Route
        Handler বা সেশন ম্যানেজমেন্টের ক্ষেত্রে কুকিতে <code>SameSite=Lax</code> বা{" "}
        <code>Strict</code> এবং <code>HttpOnly</code> ব্যবহার করা বাধ্যতামূলক!
      </Line>

      {/* ── Architecture ──────────────────────────────────────────────── */}
      <H2 id="architecture">১. CSRF Attack Flow &amp; SameSite Defense Architecture</H2>

      <Diagram>{`┌─────────────────────────────────────────────────────────────────────────────┐
│                 CSRF ATTACK VS SAMESITE COOKIE DEFENSE                      │
└─────────────────────────────────────────────────────────────────────────────┘

 Attacker site (attacker.com)
         │
         │ (1) the user clicks a malicious button
         ▼
 Forged request ──► POST https://my-bank.com/api/transfer
                         │
                         ├── without SameSite: the browser attaches the session cookie 🔴
                         │
                         └── with SameSite=Lax/Strict: the browser withholds it        🟢
                                                         │
                                                         ▼
                                          Next.js server / action guard
                                          ├── compares Origin against Host
                                          └── ❌ 403 Forbidden — request rejected`}</Diagram>

      {/* ── Mechanisms ────────────────────────────────────────────────── */}
      <H2 id="mechanisms">২. কোর আর্কিটেকচারাল কনসেপ্ট</H2>

      <p>
        <strong>SameSite=Lax (the modern default):</strong> থার্ড-পার্টি ক্রস-সাইট রিকোয়েস্টে (যেমন
        বাইরের সাইট থেকে POST ফর্ম সাবমিশন) কুকি সেন্ড হবে না। শুধুমাত্র টপ-লেভেল নেভিগেশনে (সাধারণ
        লিংক ক্লিক) কুকি যাবে।
      </p>

      <p>
        <strong>SameSite=Strict:</strong> বাহ্যিক কোনো ওয়েবসাইট থেকে লিংক ধরে আসলেও কুকি সেন্ড হবে না।
        সর্বোচ্চ সিকিউরিটি দেয়, তবে অন্য সাইট থেকে লিংকে ক্লিক করে এলে ইউজার লগইন সেশন সরাসরি পাবে না
        — তাই UX-এ প্রভাব পড়ে।
      </p>

      <p>
        <strong>HttpOnly &amp; Secure:</strong> <code>HttpOnly</code> ব্যবহারের ফলে JavaScript (
        <code>document.cookie</code>) দিয়ে কুকি চুরি প্রতিরোধ করা যায়, আর <code>Secure</code> ফ্ল্যাগ
        নিশ্চিত করে কুকি কেবল HTTPS এনক্রিপ্টেড কানেকশনে ট্রান্সফার হবে।
      </p>

      <p>
        <strong>Built-in Server Action protection:</strong> কোনো Server Action এক্সিকিউট হওয়ার সময়
        Next.js ব্রাউজারের পাঠানো <code>Origin</code> হেডার এবং অ্যাপের <code>Host</code> (বা{" "}
        <code>X-Forwarded-Host</code>) মিলিয়ে দেখে। ম্যাচ না করলে রিকোয়েস্ট অটোমেটিক রিজেক্ট হয়। কাস্টম
        route handler-এ এই চেকটি আপনাকে নিজে লিখতে হবে।
      </p>

      {/* ── Implementation ────────────────────────────────────────────── */}
      <H2 id="implementation">৩. Production Code Implementation</H2>

      <H3>❌ Anti-pattern — permissive cookies and an unguarded API route</H3>

      <CodeBlock filename="app/api/transfer/route.ts">{`// 🔴 POOR PRACTICE: vulnerable to CSRF — no origin check, permissive cookie policy

import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  // ❌ vulnerability 1: no Origin or Referer header check
  // ❌ vulnerability 2: relies on a cookie set with SameSite=None or no flags at all

  const body = await request.json();
  // perform the financial transfer…

  return NextResponse.json({ success: true, message: 'Transfer completed' });
}`}</CodeBlock>

      <H3>🟢 Production pattern — secure session cookies with origin-guarded routes</H3>

      <p>
        <strong>Step 1 — secure session কুকি সেট করা।</strong>
      </p>

      <CodeBlock filename="actions/auth.ts">{`// 🟢 PRODUCTION PATTERN: Secure, HttpOnly, SameSite session cookies
'use server';

import { cookies } from 'next/headers';

export async function createSessionAction(token: string) {
  const cookieStore = await cookies();

  cookieStore.set('session_token', token, {
    httpOnly: true, // 🟢 blocks XSS cookie theft via JS
    secure: process.env.NODE_ENV === 'production', // 🟢 HTTPS only in production
    sameSite: 'lax', // 🟢 blocks CSRF on cross-site POSTs
    maxAge: 60 * 60 * 24 * 7, // 7 days
    path: '/',
  });

  return { success: true };
}`}</CodeBlock>

      <p>
        <strong>Step 2 — কাস্টম API-এর জন্য origin গার্ড।</strong>
      </p>

      <CodeBlock filename="middleware.ts">{`// 🟢 PRODUCTION PATTERN: CSRF origin verification for API routes
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  // only state-changing methods need this guard
  if (['POST', 'PUT', 'DELETE', 'PATCH'].includes(request.method)) {
    const originHeader = request.headers.get('origin');
    const hostHeader = request.headers.get('host');

    // browsers always send Origin on cross-origin state-changing requests
    if (originHeader) {
      const originUrl = new URL(originHeader);

      // 🟢 reject when the request origin does not match the app host
      if (originUrl.host !== hostHeader) {
        return NextResponse.json(
          { error: 'CSRF blocked: invalid origin' },
          { status: 403 }
        );
      }
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: '/api/:path*',
};`}</CodeBlock>

      <p>
        <strong>Step 3 — Server Action-এর বিল্ট-ইন গার্ড কাজে লাগানো।</strong>
      </p>

      <CodeBlock filename="actions/transfer.ts">{`// 🟢 PRODUCTION PATTERN: Server Actions carry CSRF protection out of the box
'use server';

import { cookies } from 'next/headers';

export async function transferFundsAction(formData: FormData) {
  // Next.js validates Origin against Host before this body ever runs
  const cookieStore = await cookies();
  const sessionToken = cookieStore.get('session_token')?.value;

  if (!sessionToken) {
    throw new Error('Unauthorized');
  }

  const amount = formData.get('amount');
  const recipient = formData.get('recipient');

  // process the transfer securely…
  return { success: true, message: \`Transferred \${amount} to \${recipient}\` };
}`}</CodeBlock>

      {/* ── Matrix ────────────────────────────────────────────────────── */}
      <H2 id="matrix">৪. Security Feature Matrix</H2>

      <Table
        head={["মেকানিজম", "CSRF প্রতিরোধে ভূমিকা", "XSS প্রতিরোধে ভূমিকা", "Next.js সাপোর্ট"]}
        rows={[
          [
            "SameSite=Lax cookie",
            "উচ্চ — cross-site POST কুকি ব্লক করে 🟢",
            "পরোক্ষ ⚪",
            "cookies().set() ডিফল্ট স্ট্যান্ডার্ড 🟢",
          ],
          [
            "SameSite=Strict cookie",
            "সর্বোচ্চ — সব cross-site ব্লক করে 🟢",
            "পরোক্ষ ⚪",
            "ব্যবহারযোগ্য, তবে UX প্রভাবিত হয় 🟡",
          ],
          [
            "HttpOnly flag",
            "পরোক্ষ ⚪",
            "সর্বোচ্চ — JS অ্যাক্সেস বন্ধ করে 🟢",
            "cookies().set() ফ্ল্যাগ 🟢",
          ],
          [
            "Server Action native guard",
            "স্বয়ংক্রিয় origin checking 🟢",
            "এনকোডেড প্রোটেকশন 🟢",
            "App Router-এ out-of-the-box 🟢",
          ],
        ]}
      />

      <Line name="ভুলু ভাই">
        এখন একদম পরিষ্কার ফাহিম! কুকিতে <code>SameSite=Lax</code> ও <code>HttpOnly</code> সেট করায় আর
        Server Action-এর বিল্ট-ইন origin checking থাকায় এখন থার্ড-পার্টি কোনো সাইট থেকে আমাদের অ্যাপে
        ফেইক রিকোয়েস্ট পাঠানোর পথ পুরোপুরি বন্ধ!
      </Line>

      {/* ── Takeaways ─────────────────────────────────────────────────── */}
      <H2 id="takeaway">Production Takeaways</H2>

      <Note>
        <ul>
          <li>
            <strong>Always set SameSite=Lax or Strict:</strong> অ্যাপের সমস্ত সেশন কুকিতে বাধ্যতামূলকভাবে{" "}
            <code>httpOnly: true</code> এবং <code>sameSite: &apos;lax&apos;</code> ব্যবহার নিশ্চিত করুন।
          </li>
          <li>
            <strong>Prefer Server Actions for mutations:</strong> স্টেট-চেঞ্জিং অপারেশনে ফর্ম
            সাবমিশনের জন্য Server Actions ব্যবহার করলে বিল্ট-ইন CSRF প্রোটেকশন এমনিতেই পাওয়া যায়।
          </li>
          <li>
            <strong>Verify origin in route handlers:</strong> কাস্টম API route handler ব্যবহার করলে
            মিডলওয়্যারে বা হ্যান্ডলারের ভেতরে <code>Origin</code> বনাম <code>Host</code> মিলিয়ে
            রিকোয়েস্ট ভ্যালিডেট করুন।
          </li>
        </ul>
      </Note>
    </article>
  );
}
