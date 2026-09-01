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
      bn: "document.cookie দিয়ে সেশন চুরি",
      en: "A session stolen via document.cookie",
    },
  },
  {
    id: "architecture",
    label: {
      bn: "Hardened cookie পাইপলাইন",
      en: "The hardened cookie pipeline",
    },
  },
  {
    id: "mechanisms",
    label: { bn: "৩টি আর্কিটেকচারাল কনসেপ্ট", en: "Three architectural concepts" },
  },
  {
    id: "implementation",
    label: {
      bn: "Secure cookie ইউটিলিটি",
      en: "The secure cookie utility",
    },
  },
  {
    id: "matrix",
    label: { bn: "Cookie Attributes Matrix", en: "Cookie attributes matrix" },
  },
  {
    id: "takeaway",
    label: { bn: "Production Takeaways", en: "Production takeaways" },
  },
];

export default function CookieSecurity() {
  return (
    <article className="doc-prose">
      {/* ── The problem ───────────────────────────────────────────────── */}
      <H2 id="the-problem" anchorOnly>
        document.cookie দিয়ে সেশন চুরি
      </H2>

      <p>
        বিকাল ৫:৪৫। ভুলু ভাই তার ল্যাপটপের সামনে হতভম্ব হয়ে বসে আছেন! এক ইউজার অভিযোগ করেছেন যে তার
        অ্যাকাউন্ট হ্যাক হয়েছে — অথচ তিনি কোনো ফিশিং লিংকেও ক্লিক করেননি। ইনভেস্টিগেট করতে গিয়ে দেখা
        গেল, ক্লায়েন্ট-সাইড কোনো থার্ড-পার্টি লাইব্রেরির কোড সুযোগ বুঝে <code>document.cookie</code>{" "}
        রিড করে ইউজারের সেশন টোকেন চুরি করে হ্যাকারের সার্ভারে পাঠিয়ে দিয়েছে!
      </p>

      <Line name="ভুলু ভাই">
        ফাহিম! ব্রাউজারের জাভাস্ক্রিপ্ট কোড কীভাবে ইউজারের অথেনটিকেশন সেশন কুকি পড়ে ফেলতে পারল? আমি
        তো কুকিতেই সেশন ডাটা সেভ করছিলাম! এটা বন্ধ করার উপায় কী?
      </Line>

      <Line name="ফাহিম">
        ভুলু ভাই! আপনি কুকি সেট করার সময় নিরাপত্তা ফ্ল্যাগগুলো ডিফাইন করেননি! কুকিতে যদি{" "}
        <code>HttpOnly</code>, <code>Secure</code> এবং <code>SameSite</code> ফ্ল্যাগ না থাকে, তবে
        জাভাস্ক্রিপ্ট কোড তা সহজেই রিড করতে পারে এবং আন-এনক্রিপ্টেড HTTP নেটওয়ার্কে কুকি লিক হয়ে যায়!
      </Line>

      <Line name="নেক্সট-ভাই">
        একদম! App Router-এ সেশন ম্যানেজমেন্টের প্রধান চাবিকাঠি হলো hardened cookie policy।{" "}
        <code>next/headers</code>-এর <code>cookies()</code> API বা <code>NextResponse</code>-এর
        মাধ্যমে <code>HttpOnly</code>, <code>Secure</code>, <code>SameSite=Lax</code> এবং{" "}
        <code>__Host-</code> প্রিফিক্স কনফিগার করলে ব্রাউজারের জাভাস্ক্রিপ্ট তো দূরে থাক, কোনো
        ম্যালিশিয়াস সাবডোমেইনও সেই কুকি স্পর্শ করতে পারবে না!
      </Line>

      {/* ── Architecture ──────────────────────────────────────────────── */}
      <H2 id="architecture">১. Hardened Cookie Pipeline Architecture</H2>

      <Diagram>{`┌─────────────────────────────────────────────────────────────────────────────┐
│                   SECURE COOKIE DEFENSE PIPELINE                            │
└─────────────────────────────────────────────────────────────────────────────┘

 Server response: Set-Cookie: __Host-session=xyz123; …
                               │
                               ▼
 ┌───────────────────────────────────────────────────────────────────────────┐
 │ Browser enforcement layer (strict cookie attributes)                      │
 └───────────────────────────────────────────────────────────────────────────┘
   ├── 🟢 HttpOnly       ──► blocks document.cookie access      (XSS proof)
   ├── 🟢 Secure         ──► transmits only over HTTPS          (MITM proof)
   ├── 🟢 SameSite=Lax   ──► blocks cross-site cookie leakage   (CSRF proof)
   └── 🟢 __Host- prefix ──► locks the cookie to the exact host, forces path="/"
                               │
        ┌──────────────────────┴──────────────────────┐
        ▼                                             ▼
 ❌ client JS (XSS / extension)              🟢 Next.js server (RSC / action)
 document.cookie returns nothing              reads the token from the request header`}</Diagram>

      {/* ── Mechanisms ────────────────────────────────────────────────── */}
      <H2 id="mechanisms">২. কোর আর্কিটেকচারাল কনসেপ্ট</H2>

      <p>
        <strong>HttpOnly (XSS defense):</strong> কুকিতে <code>httpOnly: true</code> সেট করলে ব্রাউজারের
        জাভাস্ক্রিপ্ট (<code>document.cookie</code>) দিয়ে সেটি পড়া অসম্ভব হয়ে যায়। ফলে অ্যাপে কোনো XSS
        অরক্ষিত থাকলেও হ্যাকার সেশন কুকি চুরি করতে পারে না।
      </p>

      <p>
        <strong>Secure &amp; SameSite:</strong> <code>secure: true</code> ব্রাউজারকে নির্দেশ দেয় কুকিটি
        যেন কেবল এনক্রিপ্টেড HTTPS প্রোটোকলে পাঠানো হয়। <code>sameSite: &apos;lax&apos;</code> বা{" "}
        <code>&apos;strict&apos;</code> থার্ড-পার্টি সাইট থেকে আসা রিকোয়েস্টে কুকি পাঠাতে বাধা দেয় —
        CSRF অ্যাটাক প্রতিরোধ করে।
      </p>

      <p>
        <strong>Domain lock with the __Host- prefix:</strong> কুকির নামের সামনে <code>__Host-</code>{" "}
        জুড়ে দিলে ব্রাউজার বাধ্য করে যে কুকিতে <code>secure: true</code> থাকতে হবে, কোনো সাবডোমেইন
        এটি ওভাররাইট বা রিড করতে পারবে না, এবং <code>path</code> অবশ্যই <code>/</code> হতে হবে।
      </p>

      {/* ── Implementation ────────────────────────────────────────────── */}
      <H2 id="implementation">৩. Production Code Implementation</H2>

      <H3>❌ Anti-pattern — weak cookie options</H3>

      <CodeBlock filename="app/api/auth/login/route.ts">{`// 🔴 POOR PRACTICE: highly vulnerable cookie configuration
// leaves the session exposed to XSS, CSRF, and MITM

import { NextResponse } from 'next/server';

export async function POST() {
  const response = NextResponse.json({ success: true });

  // ❌ readable via document.cookie, travels over plain HTTP, no CSRF guard
  response.cookies.set('session_token', 'secret_jwt_token_123', {
    httpOnly: false, // danger: readable by XSS scripts
    secure: false, // danger: transmitted over plain HTTP
    sameSite: 'none', // danger: sent on cross-site requests
  });

  return response;
}`}</CodeBlock>

      <H3>🟢 Production pattern — a hardened cookie utility</H3>

      <p>
        <strong>Step 1 — কুকি সিকিউরিটি হেল্পার।</strong>
      </p>

      <CodeBlock filename="lib/auth/cookie.ts">{`// 🟢 PRODUCTION PATTERN: hardened cookie policy
import { cookies } from 'next/headers';

const IS_PRODUCTION = process.env.NODE_ENV === 'production';

// 🟢 the __Host- prefix locks the cookie to the exact top-level host
export const SESSION_COOKIE_NAME = IS_PRODUCTION ? '__Host-session' : 'dev_session';

export async function setSecureSessionCookie(token: string) {
  const cookieStore = await cookies();

  cookieStore.set(SESSION_COOKIE_NAME, token, {
    // 1. 🟢 block client-side JS access (XSS mitigation)
    httpOnly: true,

    // 2. 🟢 enforce HTTPS in production (MITM mitigation)
    secure: IS_PRODUCTION,

    // 3. 🟢 block cross-site request forgery (CSRF mitigation)
    sameSite: 'lax',

    // 4. 🟢 scope the cookie to the domain root — required by __Host-
    path: '/',

    // 5. 🟢 expiry (7 days)
    maxAge: 60 * 60 * 24 * 7,
  });
}

export async function clearSessionCookie() {
  const cookieStore = await cookies();
  cookieStore.delete(SESSION_COOKIE_NAME);
}`}</CodeBlock>

      <p>
        <strong>Step 2 — লগইন হ্যান্ডলারে ব্যবহার।</strong>
      </p>

      <CodeBlock filename="app/api/auth/login/route.ts">{`// 🟢 using the secure cookie setter in an auth endpoint
import { NextResponse } from 'next/server';
import { setSecureSessionCookie } from '@/lib/auth/cookie';

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json();

    // authentication logic (hash comparison, rate limiting, …)
    if (email === 'admin@app.com' && password === 'secure_pass') {
      const generatedJwtToken = 'encrypted_jwt_payload_xyz890';

      // 🟢 store the token in a hardened cookie
      await setSecureSessionCookie(generatedJwtToken);

      return NextResponse.json({ message: 'Login successful' });
    }

    return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
  } catch {
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}`}</CodeBlock>

      {/* ── Matrix ────────────────────────────────────────────────────── */}
      <H2 id="matrix">৪. Cookie Security Attributes Matrix</H2>

      <Table
        head={["ফ্ল্যাগ", "কাজ ও উদ্দেশ্য", "মিস করলে ঝুঁকি", "প্রোডাকশন সুপারিশ"]}
        rows={[
          [
            "httpOnly",
            "ক্লায়েন্ট-সাইড JS অ্যাক্সেস ব্লক করে",
            "XSS স্ক্রিপ্ট দিয়ে সেশন টোকেন চুরি 🔴",
            "সবসময় true 🟢",
          ],
          [
            "secure",
            "কেবল এনক্রিপ্টেড HTTPS-এ কুকি পাঠায়",
            "প্লেইন নেটওয়ার্কে MITM অ্যাটাক 🔴",
            "প্রোডাকশনে বাধ্যতামূলক 🟢",
          ],
          [
            "sameSite",
            "ক্রস-সাইট রিকোয়েস্টে কুকি পাঠানো নিয়ন্ত্রণ করে",
            "CSRF অ্যাটাকে অ্যাকাউন্ট হাইজ্যাক 🔴",
            "'lax' বা 'strict' 🟢",
          ],
          [
            "__Host- prefix",
            "কুকিকে নির্দিষ্ট হোস্ট ও path=/ এ লক করে",
            "সাবডোমেইন ট্যাম্পারিং ও কুকি পয়জনিং 🔴",
            "প্রোডাকশনে ব্যবহার করুন 🟢",
          ],
        ]}
      />

      <Line name="ভুলু ভাই">
        অসাধারণ ফাহিম! <code>HttpOnly</code>, <code>SameSite</code> আর <code>__Host-</code> ফ্ল্যাগগুলো
        ব্যবহার করার পর এখন ব্রাউজারে <code>document.cookie</code> কল করলে সেশন কুকির কোনো পাত্তাই
        পাওয়া যাচ্ছে না! সেশন এখন সম্পূর্ণ সুরক্ষিত।
      </Line>

      {/* ── Takeaways ─────────────────────────────────────────────────── */}
      <H2 id="takeaway">Production Takeaways</H2>

      <Note>
        <ul>
          <li>
            <strong>Always enforce httpOnly: true:</strong> সংবেদনশীল কোনো অথেনটিকেশন টোকেন বা সেশন
            আইডি কখনো এমন প্লেইন কুকিতে রাখবেন না যা জাভাস্ক্রিপ্ট পড়তে পারে।
          </li>
          <li>
            <strong>Leverage __Host- prefixes:</strong> প্রোডাকশনে কুকির ডোমেইন-স্কোপ শক্ত করতে কুকির
            নামের শুরুতে <code>__Host-</code> যোগ করুন।
          </li>
          <li>
            <strong>Make the secure flag environment-aware:</strong> লোকাল ডেভেলপমেন্টে (HTTP) কাজ
            করার জন্য <code>secure: process.env.NODE_ENV === &apos;production&apos;</code> শর্ত
            ব্যবহার করুন।
          </li>
        </ul>
      </Note>
    </article>
  );
}
