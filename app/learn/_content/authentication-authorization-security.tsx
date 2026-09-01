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
      bn: "URL টাইপ করেই অ্যাডমিন প্যানেল",
      en: "The admin panel, one URL away",
    },
  },
  {
    id: "architecture",
    label: {
      bn: "Dual-layer auth ও RBAC আর্কিটেকচার",
      en: "Dual-layer auth & RBAC architecture",
    },
  },
  {
    id: "mechanisms",
    label: { bn: "৩টি আর্কিটেকচারাল কনসেপ্ট", en: "Three architectural concepts" },
  },
  {
    id: "implementation",
    label: {
      bn: "Middleware গার্ড ও secure action",
      en: "Middleware guards & secure actions",
    },
  },
  {
    id: "matrix",
    label: { bn: "AuthN & AuthZ Comparison", en: "AuthN & AuthZ comparison" },
  },
  {
    id: "takeaway",
    label: { bn: "Production Takeaways", en: "Production takeaways" },
  },
];

export default function AuthenticationAuthorizationSecurity() {
  return (
    <article className="doc-prose">
      {/* ── The problem ───────────────────────────────────────────────── */}
      <H2 id="the-problem" anchorOnly>
        URL টাইপ করেই অ্যাডমিন প্যানেল
      </H2>

      <p>
        বিকাল ৫:০০। ভুলু ভাই তার ল্যাপটপ স্ক্রিনে তাকিয়ে একদম হতবাক। এক সাধারণ ইউজার অ্যাকাউন্টে লগইন
        করে অ্যাড্রেস বারে ভুলবশত <code>/admin/dashboard</code> টাইপ করতেই পুরো অ্যাডমিন প্যানেল খুলে
        গেল! শুধু তাই নয়, API রিকোয়েস্টে নিজের <code>userId: &quot;102&quot;</code>-এর জায়গায়{" "}
        <code>userId: &quot;101&quot;</code> বসাতেই সাইটের অন্য ইউজারের প্রাইভেট অর্ডার ডাটা চলে এলো!
      </p>

      <Line name="ভুলু ভাই">
        ফাহিম! এ কী কাণ্ড! আমি তো নেভিগেশন বারে অ্যাডমিন ড্যাশবোর্ডের লিংক শুধু অ্যাডমিনদের জন্যই
        দৃশ্যমান করেছিলাম! আর ইউজার আইডি দিয়ে অন্য ইউজারের ডাটা কীভাবে অ্যাক্সেস করা যাচ্ছে? আমাদের
        অথেনটিকেশন তো কাজ করছিল!
      </Line>

      <Line name="ফাহিম">
        ভুলু ভাই! ক্লায়েন্ট-সাইডে বোতাম বা লিংক লুকিয়ে রাখা মানেই সিকিউরিটি নয়! আপনি authentication
        (ইউজার কে?) করেছিলেন, কিন্তু authorization (ইউজারের এই কাজ করার অনুমতি আছে কিনা?) চেক করতে ভুলে
        গিয়েছিলেন! এটি মারাত্মক broken access control (BOLA/IDOR) বা দুর্বল রোল ম্যানেজমেন্টের ফল।
      </Line>

      <Line name="নেক্সট-ভাই">
        একদম! App Router-এ ক্লায়েন্ট-সাইড চেক সম্পূর্ণ অরক্ষিত। defense-in-depth নীতি অনুসরণ করতে হবে:{" "}
        <code>middleware.ts</code>-এ edge-level রুট গার্ড, এবং Server Components / Server Actions-এর
        ভেতরে কঠোর session ও role-based (RBAC) যাচাইকরণ থাকতে হবে!
      </Line>

      {/* ── Architecture ──────────────────────────────────────────────── */}
      <H2 id="architecture">১. Dual-Layer Auth &amp; RBAC Security Architecture</H2>

      <Diagram>{`┌─────────────────────────────────────────────────────────────────────────────┐
│             NEXT.JS DUAL-LAYER AUTHENTICATION & AUTHORIZATION               │
└─────────────────────────────────────────────────────────────────────────────┘

 Client request: POST /api/orders/delete  (with session cookie)
                               │
                               ▼
 ┌───────────────────────────────────────────────────────────┐
 │ Layer 1 — Edge Middleware (middleware.ts)                 │
 └───────────────────────────────────────────────────────────┘
   ├── 1. reads and decrypts the HttpOnly session cookie
   ├── 2. checks token expiry and signature
   └── 3. redirects to /login when unauthenticated 🟢
                               │
                               ▼ (passed the edge guard)
 ┌───────────────────────────────────────────────────────────┐
 │ Layer 2 — Server Action / RSC authorization guard         │
 └───────────────────────────────────────────────────────────┘
   ├── 1. extracts currentUserId & role from the session
   ├── 2. verifies resource ownership (order.userId === currentUserId)
   └── 3. enforces the role check (role === 'ADMIN')
                               │
        ┌──────────────────────┴──────────────────────┐
        ▼                                             ▼
 ❌ access denied (403 Forbidden)            🟢 action executed safely
 (editing another user's data)                 (valid owner or admin)`}</Diagram>

      {/* ── Mechanisms ────────────────────────────────────────────────── */}
      <H2 id="mechanisms">২. কোর আর্কিটেকচারাল কনসেপ্ট</H2>

      <p>
        <strong>Authentication vs authorization:</strong> AuthN হলো ইউজারের পরিচয় যাচাই করা (ইমেইল ও
        পাসওয়ার্ড দিয়ে যাচাই যে সে &quot;রহিম&quot;)। AuthZ হলো ওই ইউজারের নির্দিষ্ট রিসোর্সে প্রবেশ
        বা মিউটেশনের অধিকার আছে কিনা তা নির্ধারণ করা।
      </p>

      <p>
        <strong>Defense-in-depth:</strong> শুধু মিডলওয়্যারে পেজ ব্লক করাই যথেষ্ট নয়। প্রতিটি Server
        Action, route handler এবং data fetching ফাংশনের ভেতর ডাটাবেজে রিড/রাইট করার আগে পুনরায়
        ইউজারের সেশন এবং পারমিশন চেক করা।
      </p>

      <p>
        <strong>BOLA / IDOR prevention:</strong> ক্লায়েন্ট থেকে আসা <code>id</code> বা{" "}
        <code>userId</code>-কে চোখ বন্ধ করে বিশ্বাস না করা। সেশন থেকে আসা অথেনটিকেটেড আইডির সাথে
        ডাটাবেজের রিসোর্স ওনারশিপ মিলিয়ে দেখা (
        <code>resource.userId === session.user.id</code>)।
      </p>

      {/* ── Implementation ────────────────────────────────────────────── */}
      <H2 id="implementation">৩. Production Code Implementation</H2>

      <H3>❌ Anti-pattern — client-only role check and an open server action</H3>

      <CodeBlock filename="actions/order.ts">{`// 🔴 POOR PRACTICE: vulnerable to access-control bypass and IDOR
// anyone can call this Server Action with any payload

'use server';

import { db } from '@/lib/db';

// ❌ takes userId and orderId straight from the client, checks no session or role
export async function deleteOrderUnsafe(orderId: string, targetUserId: string) {
  // an attacker can send any orderId and delete someone else's order
  await db.order.delete({
    where: {
      id: orderId,
      userId: targetUserId, // trusted raw client input
    },
  });

  return { success: true };
}`}</CodeBlock>

      <H3>🟢 Production pattern — edge middleware plus an RBAC server action</H3>

      <p>
        <strong>Step 1 — এজ মিডলওয়্যার রুট গার্ড।</strong>
      </p>

      <CodeBlock filename="middleware.ts">{`// 🟢 PRODUCTION PATTERN: global route protection in middleware
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { verifySessionToken } from '@/lib/auth/session';

export async function middleware(request: NextRequest) {
  const sessionCookie = request.cookies.get('session_token')?.value;
  const { pathname } = request.nextUrl;

  const isAdminRoute = pathname.startsWith('/admin');
  const isDashboardRoute = pathname.startsWith('/dashboard');

  if (isAdminRoute || isDashboardRoute) {
    // 1. verify the cookie and token integrity
    const session = await verifySessionToken(sessionCookie);

    if (!session) {
      const loginUrl = new URL('/login', request.url);
      loginUrl.searchParams.set('from', pathname);
      return NextResponse.redirect(loginUrl);
    }

    // 2. role-based access control at the edge
    if (isAdminRoute && session.user.role !== 'ADMIN') {
      return NextResponse.redirect(new URL('/403-unauthorized', request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*', '/dashboard/:path*'],
};`}</CodeBlock>

      <p>
        <strong>Step 2 — authorization গার্ডসহ Server Action।</strong>
      </p>

      <CodeBlock filename="actions/order.ts">{`// 🟢 PRODUCTION PATTERN: defense-in-depth authorization guard
'use server';

import { cookies } from 'next/headers';
import { db } from '@/lib/db';
import { verifySessionToken } from '@/lib/auth/session';

export async function deleteOrder(orderId: string) {
  // 1. 🟢 authenticate from the server-side cookie — never from an argument
  const cookieStore = await cookies();
  const sessionCookie = cookieStore.get('session_token')?.value;
  const session = await verifySessionToken(sessionCookie);

  if (!session) {
    throw new Error('401 Unauthorized: session invalid or expired');
  }

  // 2. 🟢 load the target resource so ownership can be checked
  const order = await db.order.findUnique({ where: { id: orderId } });

  if (!order) {
    throw new Error('404 Not Found: order does not exist');
  }

  // 3. 🟢 authorization guard — owner or admin only
  const isOwner = order.userId === session.user.id;
  const isAdmin = session.user.role === 'ADMIN';

  if (!isOwner && !isAdmin) {
    console.warn(\`SECURITY: user \${session.user.id} tried to delete order \${orderId}\`);
    throw new Error('403 Forbidden: you cannot delete this resource');
  }

  // 4. 🟢 safe execution
  await db.order.delete({ where: { id: orderId } });

  return { success: true, message: 'Order successfully deleted' };
}`}</CodeBlock>

      {/* ── Matrix ────────────────────────────────────────────────────── */}
      <H2 id="matrix">৪. AuthN &amp; AuthZ Guard Comparison</H2>

      <Table
        head={[
          "সিকিউরিটি লেভেল",
          "Client-side check only",
          "Middleware guard only",
          "Dual-layer (middleware + action guard)",
        ]}
        rows={[
          [
            "URL bypass risk",
            "অত্যন্ত ঝুঁকিপূর্ণ 🔴",
            "সুরক্ষিত 🟢",
            "সম্পূর্ণ সুরক্ষিত 🟢",
          ],
          [
            "Direct API / action hijack",
            "সহজে বাইপাস করা যায় 🔴",
            "অরক্ষিত 🔴",
            "জিরো-ট্রাস্ট বাইপাস প্রুফ 🟢",
          ],
          [
            "BOLA / IDOR protection",
            "কোনো সুরক্ষা নেই 🔴",
            "নেই 🔴",
            "রিসোর্স ওনারশিপ ভ্যালিডেটেড 🟢",
          ],
          ["Industry rating", "অনিরাপদ 🔴", "আংশিক 🟡", "প্রোডাকশন-গ্রেড সেরা চর্চা 🟢"],
        ]}
      />

      <Line name="ভুলু ভাই">
        অসাধারণ ফাহিম! মিডলওয়্যারের সাথে সার্ভার অ্যাকশনে সেশন আর ওনারশিপ চেক বসানোর পর এখন আর কেউ
        ডিরেক্ট URL মেরে বা আইডি চেঞ্জ করে অন্যের ডাটায় হাত দিতে পারবে না!
      </Line>

      {/* ── Takeaways ─────────────────────────────────────────────────── */}
      <H2 id="takeaway">Production Takeaways</H2>

      <Note>
        <ul>
          <li>
            <strong>Never trust UI visibility:</strong> ক্লায়েন্ট-সাইড স্টেট দিয়ে বাটন বা লিংক লুকিয়ে
            রাখলে তা কেবল UX নিশ্চিত করে, সিকিউরিটি নয়।
          </li>
          <li>
            <strong>Always enforce server-side authorization:</strong> প্রতিবার ডাটাবেজ মিউটেশন বা
            সংবেদনশীল ডাটা পড়ার সময় সার্ভার-সাইড সেশন থেকে ওনারশিপ এবং রোল মেলাতে হবে।
          </li>
          <li>
            <strong>Use defense-in-depth:</strong> <code>middleware.ts</code>-কে রাউটিং গার্ড হিসেবে
            ব্যবহার করুন, আর Server Actions / route handler-কে ফাইন-গ্রেইনড রিসোর্স পারমিশন গার্ড
            হিসেবে।
          </li>
        </ul>
      </Note>
    </article>
  );
}
