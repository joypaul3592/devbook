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
      bn: "ক্লিক না করেই ইমেইল বদলে গেল",
      en: "The email changed without a click",
    },
  },
  {
    id: "architecture",
    label: {
      bn: "CSRF attack ও defense আর্কিটেকচার",
      en: "CSRF attack & defense architecture",
    },
  },
  {
    id: "mechanisms",
    label: { bn: "৩টি আর্কিটেকচারাল কনসেপ্ট", en: "Three architectural concepts" },
  },
  {
    id: "implementation",
    label: {
      bn: "Origin check ও anti-CSRF টোকেন",
      en: "Origin checks & anti-CSRF tokens",
    },
  },
  {
    id: "matrix",
    label: { bn: "CSRF Defense Comparison", en: "CSRF defense comparison" },
  },
  {
    id: "takeaway",
    label: { bn: "Production Takeaways", en: "Production takeaways" },
  },
];

export default function CsrfProtection() {
  return (
    <article className="doc-prose">
      {/* ── The problem ───────────────────────────────────────────────── */}
      <H2 id="the-problem" anchorOnly>
        ক্লিক না করেই ইমেইল বদলে গেল
      </H2>

      <p>
        বিকাল ৪:১৫। ভুলু ভাই তার অ্যাকাউন্টে লগইন থাকা অবস্থায় ব্রাউজারের অন্য ট্যাবে একটি অচেনা
        ওয়েবসাইট ব্রাউজ করছিলেন। হঠাৎ খেয়াল করলেন — তার ই-কমার্স সাইটের ইমেইল অটোমেটিক চেঞ্জ হয়ে অন্য
        কারো ইমেইল বসে গেছে! ভুলু ভাই নিজের সাইটে কোনো বাটনে ক্লিক না করা সত্ত্বেও ব্যাকগ্রাউন্ডে
        ক্ষতিকর ওয়েবসাইট থেকে একটি অনভিপ্রেত POST রিকোয়েস্ট চলে এসে তার ইমেইল বদলে দিয়ে গেছে।
      </p>

      <Line name="ভুলু ভাই">
        ফাহিম! আমি তো আমার সাইটে কোনো ক্লিকই করিনি! অন্য সাইটে ভিজিট করতেই আমার অ্যাকাউন্টের ইমেইল
        চেঞ্জ হয়ে গেল কীভাবে? আমার ব্রাউজারে তো সেশন কুকি সেভ করাই ছিল — তাহলে অন্য ট্যাবের ওয়েবসাইট
        থেকে পাঠানো রিকোয়েস্ট আমার সার্ভার নির্বিচারে একসেপ্ট করল কেন?
      </Line>

      <Line name="ফাহিম">
        ভুলু ভাই! এটাকেই বলে CSRF (Cross-Site Request Forgery) অ্যাটাক! ক্ষতিকর কোনো ওয়েবসাইট আপনার
        ব্যাকগ্রাউন্ডে একটি হিডেন ফর্ম সাবমিট করিয়ে দিয়েছিল। ব্রাউজার ডিফল্ট আচরণ অনুযায়ী আপনার
        সাইটের সেশন কুকিগুলো ওই রিকোয়েস্টের সাথে সার্ভারে পাঠিয়ে দিয়েছে, আর সার্ভার মনে করেছে
        রিকোয়েস্টটি আপনি নিজেই পাঠিয়েছেন!
      </Line>

      <Line name="নেক্সট-ভাই">
        একদম! App Router-এর Server Actions বাই-ডিফল্ট Origin হেডার চেক করে কিছু সুরক্ষা দেয় সত্যি,
        কিন্তু কাস্টম API Route, webhook handler বা অসংরক্ষিত কুকি কনফিগারেশন থাকলে SameSite cookie
        attribute, Origin/Referer verification এবং anti-CSRF token pattern ব্যবহার করা বাধ্যতামূলক!
      </Line>

      {/* ── Architecture ──────────────────────────────────────────────── */}
      <H2 id="architecture">১. CSRF Attack Vector &amp; Defense Architecture</H2>

      <Diagram>{`┌─────────────────────────────────────────────────────────────────────────────┐
│                 CSRF ATTACK VS PROTECTED ARCHITECTURE                       │
└─────────────────────────────────────────────────────────────────────────────┘

 Malicious site (evil.com) ──► hidden POST form to yoursite.com/api/change-email
                                             │
                                             ▼
 User's browser auto-attaches the session cookie for yoursite.com
                                             │
                                             ▼
                    Next.js Server Action / API route guard
                                             │
               ┌─────────────────────────────┴─────────────────────────────┐
               ▼                                                           ▼
 ❌ unprotected route                                        🟢 protected guard
 ├── blindly trusts the incoming cookie                      ├── 1. validates Origin / Referer
 └── email changed to attacker@evil.com 🔴                   ├── 2. relies on SameSite=Lax/Strict
                                                             ├── 3. verifies the anti-CSRF token
                                                             └── blocks the request (403) 🟢`}</Diagram>

      {/* ── Mechanisms ────────────────────────────────────────────────── */}
      <H2 id="mechanisms">২. কোর আর্কিটেকচারাল কনসেপ্ট</H2>

      <p>
        <strong>SameSite cookie policy:</strong> কুকি সেট করার সময় <code>SameSite=Lax</code> বা{" "}
        <code>SameSite=Strict</code> ফ্ল্যাগ দিলে ব্রাউজার অন্য কোনো থার্ড-পার্টি সাইট থেকে শুরু হওয়া
        POST রিকোয়েস্টে ওই কুকি সংযুক্ত করতে দেয় না।
      </p>

      <p>
        <strong>Origin &amp; Referer verification:</strong> প্রতিটি স্টেট-চেঞ্জিং রিকোয়েস্টের (POST,
        PUT, DELETE) <code>Origin</code> অথবা <code>Referer</code> হেডার সার্ভার ডোমেইনের সাথে মিলছে
        কিনা তা কঠোরভাবে যাচাই করা।
      </p>

      <p>
        <strong>Double-submit cookie pattern:</strong> সার্ভার থেকে ক্রিপ্টোগ্রাফিকালি সিকিউর একটি
        র‍্যান্ডম টোকেন তৈরি করে ইউজারের কুকি এবং ফর্ম পেলোড/হেডারে পাঠানো হয়। সাবমিটের সময় সার্ভার
        চেক করে পেলোডের টোকেন আর কুকির টোকেন হুবহু ম্যাচ করে কিনা।
      </p>

      {/* ── Implementation ────────────────────────────────────────────── */}
      <H2 id="implementation">৩. Production Code Implementation</H2>

      <H3>❌ Anti-pattern — an unprotected state-changing route</H3>

      <CodeBlock filename="app/api/change-email/route.ts">{`// 🔴 POOR PRACTICE: accepts cross-site requests blindly
// high risk of CSRF-driven email or password hijack

import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function POST(request: Request) {
  const cookieStore = await cookies();
  const sessionToken = cookieStore.get('session_id')?.value;

  // ❌ trusts the cookie without checking Origin or a CSRF token
  if (!sessionToken) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { newEmail } = await request.json();
  // update the email in the DB…

  return NextResponse.json({ success: true });
}`}</CodeBlock>

      <H3>🟢 Production pattern — origin checking with an anti-CSRF token</H3>

      <p>
        <strong>Step 1 — CSRF হেল্পার ইউটিলিটি।</strong>
      </p>

      <CodeBlock filename="lib/security/csrf.ts">{`// 🟢 PRODUCTION PATTERN: origin verification & anti-CSRF token engine
import { headers } from 'next/headers';
import crypto from 'crypto';

/** Validates the request Origin against the trusted host. */
export async function verifyOrigin(allowedHost: string): Promise<boolean> {
  const headerList = await headers();
  const origin = headerList.get('origin');
  const referer = headerList.get('referer');

  const targetUrl = origin || referer;
  if (!targetUrl) return false; // block when both are missing

  try {
    return new URL(targetUrl).host === allowedHost;
  } catch {
    return false;
  }
}

/** Generates an anti-CSRF token. */
export function generateCsrfToken(): string {
  return crypto.randomBytes(32).toString('hex');
}`}</CodeBlock>

      <p>
        <strong>Step 2 — প্রোটেক্টেড API রুট।</strong>
      </p>

      <CodeBlock filename="app/api/change-email/route.ts">{`// 🟢 PRODUCTION PATTERN: multi-layer CSRF-protected endpoint
import { NextResponse } from 'next/server';
import { cookies, headers } from 'next/headers';
import { verifyOrigin } from '@/lib/security/csrf';

export async function POST(request: Request) {
  const headerList = await headers();
  const currentHost = headerList.get('host');

  // 1. 🟢 guard one: verify the Origin header
  if (!currentHost || !(await verifyOrigin(currentHost))) {
    return NextResponse.json(
      { error: 'CSRF blocked: invalid origin' },
      { status: 403 }
    );
  }

  // 2. 🟢 guard two: double-submit anti-CSRF token match
  const cookieStore = await cookies();
  const csrfCookie = cookieStore.get('csrf_token')?.value;
  const csrfHeader = headerList.get('x-csrf-token');

  if (!csrfCookie || !csrfHeader || csrfCookie !== csrfHeader) {
    return NextResponse.json(
      { error: 'CSRF blocked: token mismatch' },
      { status: 403 }
    );
  }

  // 3. only now is the mutation safe to run
  const { newEmail } = await request.json();
  // safe DB update…

  return NextResponse.json({ message: 'Email updated successfully' });
}`}</CodeBlock>

      {/* ── Matrix ────────────────────────────────────────────────────── */}
      <H2 id="matrix">৪. CSRF Defense Strategy Comparison</H2>

      <Table
        head={[
          "পদ্ধতি",
          "Cookie only (no defense)",
          "SameSite=Lax cookie",
          "Origin check + anti-CSRF token",
        ]}
        rows={[
          [
            "Cross-site attack defense",
            "কোনো প্রতিরোধ নেই 🔴",
            "সাধারণ POST ফর্ম অ্যাটাক আটকায় 🟡",
            "সম্পূর্ণ প্রোটেক্টেড 🟢",
          ],
          [
            "Legacy browser support",
            "কাজ করে না 🔴",
            "পুরনো ব্রাউজারে SameSite ইগনোর হতে পারে 🟡",
            "ব্রাউজার-নিরপেক্ষ সুরক্ষা 🟢",
          ],
          ["Implementation cost", "শূন্য 🟢", "সহজ 🟢", "মাঝারি 🟢"],
          [
            "Use case",
            "সুপারিশকৃত নয়",
            "রিড-অনলি বা সাধারণ অ্যাপ",
            "ফিনটেক, ই-কমার্স, স্পর্শকাতর অ্যাকশন",
          ],
        ]}
      />

      <Line name="ভুলু ভাই">
        দুর্দান্ত ফাহিম! SameSite কুকি আর <code>verifyOrigin</code> ওয়াচডগ বসানোর পর এখন অন্য কোনো
        ওয়েবসাইট থেকে পাঠানো ম্যালিশিয়াস POST রিকোয়েস্ট সোজা ৪০৩ Forbidden হয়ে ব্লক হয়ে যাচ্ছে!
      </Line>

      {/* ── Takeaways ─────────────────────────────────────────────────── */}
      <H2 id="takeaway">Production Takeaways</H2>

      <Note>
        <ul>
          <li>
            <strong>Set SameSite on session cookies:</strong> অথেনটিকেশন কুকিতে অবশ্যই{" "}
            <code>sameSite: &apos;lax&apos;</code> বা <code>&apos;strict&apos;</code> এবং{" "}
            <code>httpOnly: true</code> ফ্ল্যাগ ব্যবহার করুন।
          </li>
          <li>
            <strong>Verify the request origin:</strong> সার্ভার-সাইডের প্রতিটি স্টেট-চেঞ্জিং
            রিকোয়েস্টে <code>Origin</code> ও <code>Referer</code> হেডার যাচাই করুন।
          </li>
          <li>
            <strong>Protect custom API endpoints:</strong> Server Actions কিছু চেক স্বয়ংক্রিয়ভাবে
            করলেও কাস্টম রুট হ্যান্ডলারে (<code>/api/*</code>) ম্যানুয়ালি টোকেন ও অরিজিন গার্ড বসানো
            আবশ্যক।
          </li>
        </ul>
      </Note>
    </article>
  );
}
