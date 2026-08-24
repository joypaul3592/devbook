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
      bn: "Flash of Unauthenticated Content",
      en: "Flash of unauthenticated content",
    },
  },
  {
    id: "architecture",
    label: {
      bn: "Server-side Redirect আর্কিটেকচার",
      en: "Server-side redirect architecture",
    },
  },
  {
    id: "matrix",
    label: {
      bn: "redirect বনাম permanentRedirect",
      en: "redirect vs permanentRedirect",
    },
  },
  {
    id: "implementation",
    label: { bn: "প্রোডাকশন ইমপ্লিমেন্টেশন", en: "Production implementation" },
  },
  {
    id: "takeaway",
    label: { bn: "Production Takeaways", en: "Production takeaways" },
  },
];

export default function ServerSideNavigationControl() {
  return (
    <article className="doc-prose">
      {/* ── The problem ───────────────────────────────────────────────── */}
      <H2 id="the-problem" anchorOnly>
        Flash of Unauthenticated Content
      </H2>

      <p>
        রাত ৪:৪৫। ভুলু ভাই একটি প্রটেক্টেড ইউজার প্রোফাইল পেজ তৈরি করছেন। আন-অথেন্টিকেটেড ইউজার
        ঢুকলে তাকে লগইন পেজে পাঠানোর জন্য তিনি পুরো পেজটিকে ক্লায়েন্ট কম্পোনেন্ট বানিয়ে{" "}
        <code>useEffect</code>-এর ভেতরে <code>router.push(&apos;/login&apos;)</code> বসালেন।
        ফলাফল — ইউজার লগইন ছাড়া ঢুকলে ১ সেকেন্ডের জন্য সিক্রেট ড্যাশবোর্ড UI স্ক্রিনে ভেসে উঠে,
        তারপর রিডাইরেক্ট হয়!
      </p>

      <Line name="ভুলু ভাই">
        ফাহিম! ক্লায়েন্ট সাইডে <code>useRouter().push()</code> দিলে তো পেজ রেন্ডার হওয়ার পর
        রিডাইরেক্ট হয়! কিন্তু আমি চাই ইউজার সার্ভার থেকে কোনো HTML রেন্ডার হওয়ার আগেই ব্লক হয়ে
        সোজা লগইন পেজে চলে যাক। সার্ভার কম্পোনেন্ট থেকে নেভিগেট করার কোনো উপায় আছে?
      </Line>

      <Line name="ফাহিম">
        ভুলু ভাই! আপনি সিকিউরিটি থ্রেট তৈরি করে ফেলেছেন! ক্লায়েন্ট সাইড রিডাইরেক্ট দিয়ে কখনো
        সার্ভার সাইড সিকিউরিটি গার্ড দেওয়া যায় না। সার্ভার কম্পোনেন্ট, সার্ভার অ্যাকশন আর রুট
        হ্যান্ডলারের জন্য Next.js-এর স্পেশাল ফাংশন হলো <code>redirect()</code> এবং{" "}
        <code>permanentRedirect()</code>।
      </Line>

      <Line name="নেক্সট-ভাই">
        একদম সঠিক! App Router-এ Server-side Navigation Control অ্যাপের সিকিউরিটি ও SEO-র প্রধান
        স্তম্ভ। কখন কোনটা ব্যবহার করতে হয় আর ভেতরে কী মেকানিজম কাজ করে — সেটা জানা জরুরি।
      </Line>

      {/* ── Architecture ──────────────────────────────────────────────── */}
      <H2 id="architecture">১. Server-side Redirect আর্কিটেকচার</H2>

      <Diagram>{`┌─────────────────────────────────────────────────────────────────────────┐
│                   SERVER-SIDE REDIRECT EXECUTION FLOW                   │
└─────────────────────────────────────────────────────────────────────────┘
                                     │
    [1. Client requests URL] ───▶ GET /dashboard/settings
                                     │
    [2. Server execution]    ───▶ Server Component / Action checks the auth session
                                     │
    [3. Condition failed]    ───▶ Triggers redirect('/login')
                                  (throws a special NEXT_REDIRECT error internally)
                                     │
    [4. Response sent]       ───▶ Returns HTTP 307 / 303 immediately
                                  (no sensitive HTML reaches the client DOM)
                                     │
    [5. Client browser]      ───▶ Seamlessly navigates to /login`}</Diagram>

      {/* ── Matrix ────────────────────────────────────────────────────── */}
      <H2 id="matrix">২. redirect() বনাম permanentRedirect()</H2>

      <Table
        head={[
          "ফিচার",
          <code key="r">redirect()</code>,
          <code key="p">permanentRedirect()</code>,
        ]}
        rows={[
          [
            "HTTP status code",
            "307 (Temporary Redirect) / 303 (Server Actions)",
            "308 (Permanent Redirect)",
          ],
          [
            "Browser caching",
            "ব্রাউজার এই রিডাইরেক্ট ক্যাশ করে না",
            "ব্রাউজার ও সার্চ ইঞ্জিন স্থায়ীভাবে ক্যাশ করে",
          ],
          [
            "SEO context",
            "সার্চ ইঞ্জিনকে বলে: কনটেন্ট সাময়িকভাবে অন্য URL-এ আছে",
            "সার্চ ইঞ্জিনকে বলে: পুরোনো URL আর নেই, নতুনটা ইনডেক্স করো",
          ],
          [
            "Primary use case",
            "Auth guard, form post-submit, dynamic link",
            "URL structure change, domain migration, slug change",
          ],
        ]}
      />

      {/* ── Implementation ────────────────────────────────────────────── */}
      <H2 id="implementation">৩. প্রোডাকশন ইমপ্লিমেন্টেশন</H2>

      <H3>A — Server Component auth guard</H3>

      <CodeBlock filename="app/dashboard/page.tsx">{`import { redirect } from 'next/navigation';
import { getSession } from '@/lib/auth';

export default async function DashboardPage() {
  const session = await getSession();

  // Server guard: render nothing at all if the user is not authenticated
  if (!session?.user) {
    // Issues HTTP 307 immediately and halts further server component rendering
    redirect('/login?callbackUrl=/dashboard');
  }

  return (
    <main className="min-h-screen bg-slate-950 text-slate-100 p-8">
      <h1 className="text-2xl font-bold">Welcome back, {session.user.name}</h1>
      <p className="text-slate-400 mt-2">Sensitive user data layer</p>
    </main>
  );
}`}</CodeBlock>

      <H3>B — redirect() আর try/catch-এর ফাঁদ</H3>

      <p>
        Next.js-এ <code>redirect()</code> একটি ইন্টারনাল JavaScript error (
        <code>NEXT_REDIRECT</code>) থ্রো করে কাজ করে। তাই এটিকে সরাসরি <code>try</code> ব্লকের
        ভেতরে রাখলে <code>catch</code> ব্লক ভুলবশত রিডাইরেক্টটিকেই আটকে ফেলে!
      </p>

      <CodeBlock filename="app/actions/submit.ts">{`// WRONG: redirect inside the try block
import { redirect } from 'next/navigation';

export async function submitData() {
  try {
    // API operations...
    redirect('/success'); // caught by the catch block below!
  } catch (error) {
    console.error(error); // this swallows the redirect as if it were a failure
  }
}

// CORRECT: redirect outside the try/catch
export async function submitDataCorrect() {
  let isSuccess = false;

  try {
    // API operations...
    isSuccess = true;
  } catch (error) {
    console.error('Database insertion failed:', error);
    return { error: 'Failed to process request' };
  }

  // Always invoke redirect OUTSIDE the try/catch block
  if (isSuccess) {
    redirect('/success');
  }
}`}</CodeBlock>

      <Note>
        <p>
          <strong>⚠️ সতর্কতা:</strong> কোনো কারণে <code>try/catch</code>-এর ভেতরেই রাখতে হলে{" "}
          <code>catch</code> ব্লকে <code>isRedirectError(error)</code> চেক করে এররটি
          রি-থ্রো করতে হবে, নাহলে রিডাইরেক্ট কখনোই ঘটবে না।
        </p>
      </Note>

      <H3>C — SEO slug migration-এ permanentRedirect()</H3>

      <CodeBlock filename="app/old-blog/[slug]/page.tsx">{`import { permanentRedirect } from 'next/navigation';

interface PageProps {
  params: Promise<{ slug: string }>;
}

export default async function OldBlogPage({ params }: PageProps) {
  const { slug } = await params;

  // Permanently redirect (HTTP 308) from the old URL structure to the new one
  permanentRedirect(\`/posts/\${slug}\`);
}`}</CodeBlock>

      <Line name="ভুলু ভাই">
        মারাত্মক একটা জিনিস শিখলাম! আগে আমার প্রোটেক্টেড পেজ ১ সেকেন্ডের জন্য ভেসে উঠে ফ্ল্যাশ
        মারত। এখন সার্ভার থেকেই <code>redirect()</code> মেরে দেওয়ায় একদম ক্লিন রিডাইরেক্ট হয়ে
        যাচ্ছে!
      </Line>

      {/* ── Takeaways ─────────────────────────────────────────────────── */}
      <H2 id="takeaway">Production Takeaways</H2>

      <Note>
        <ul>
          <li>
            <strong>Zero flash of content:</strong> অথেন্টিকেশন ও পারমিশন রিডাইরেক্টে ক্লায়েন্ট
            সাইড <code>useRouter().push()</code> নয় — সবসময় সার্ভার কম্পোনেন্টে{" "}
            <code>redirect()</code> ব্যবহার করুন।
          </li>
          <li>
            <strong>Beware of try/catch:</strong> <code>redirect()</code> ইন্টারনালি{" "}
            <code>NEXT_REDIRECT</code> এরর দিয়ে কাজ করে। তাই <code>try/catch</code> ব্লকের
            ভেতরে লিখবেন না, বা লিখলে <code>isRedirectError(error)</code> চেক করে রি-থ্রো করুন।
          </li>
          <li>
            <strong>permanentRedirect for SEO mutations:</strong> ক্যাটাগরি বা পোস্টের স্লাগ
            স্থায়ীভাবে বদলালে 308 রেসপন্সের জন্য <code>permanentRedirect()</code> ব্যবহার করুন —
            এতে গুগল আগের পেজের link juice নতুন পেজে ট্রান্সফার করে।
          </li>
        </ul>
      </Note>
    </article>
  );
}
