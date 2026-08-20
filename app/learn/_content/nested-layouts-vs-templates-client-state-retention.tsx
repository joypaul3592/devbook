import { CodeBlock, Diagram, H2, H3, Line, Note } from "@/components/learn/DocParts";
import type { Bi } from "@/lib/curriculum";

/** Section anchors — consumed by the "on this page" rail. */
export const headings: { id: string; label: Bi }[] = [
  {
    id: "the-problem",
    label: { bn: "পুরনো স্টেট চিপকে থাকে", en: "The old state keeps sticking" },
  },
  {
    id: "state-retention",
    label: { bn: "layout.tsx — স্টেট কেন থেকে যায়", en: "Why layout.tsx keeps state" },
  },
  {
    id: "template",
    label: { bn: "template.tsx — ফ্রেশ মাউন্ট", en: "template.tsx — a fresh mount" },
  },
  {
    id: "when-which",
    label: { bn: "কখন কোনটা", en: "Which one, when" },
  },
  {
    id: "takeaway",
    label: { bn: "Production Takeaways", en: "Production takeaways" },
  },
];

export default function LayoutsVsTemplates() {
  return (
    <article className="doc-prose">
      {/* ── The problem ───────────────────────────────────────────────── */}
      <H2 id="the-problem" anchorOnly>
        পুরনো স্টেট চিপকে থাকে
      </H2>

      <p>
        দুপুর গড়াল। ভুলু ভাই ল্যাপটপে টেস্ট রান চালাচ্ছেন, আর ক্ষণে ক্ষণে চেয়ারে লাফিয়ে
        উঠছেন!
      </p>

      <Line name="ভুলু ভাই">
        নেক্সট-ভাই! App Router-এর এই রহস্যের কোনো কুলকিনারাই পাচ্ছি না! আমি একটা
        মাল্টি-স্টেপ ফর্ম (Multi-Step Form) বা ড্যাশবোর্ড ফিল্টার বানিয়েছিলাম।
        ভেবেছিলাম ইউজার যখন সাব-রাউটগুলোতে নেভিগেট করবে (যেমন{" "}
        <code>/dashboard/analytics</code> থেকে <code>/dashboard/reports</code>), তখন
        পেজটা ফ্রেশ রি-লোড হবে। কিন্তু দেখি আগের রাউটের ইনপুট বক্সে লেখা টেক্সট, ফিল্টার
        স্টেট আর স্ক্রোল পজিশন — সব আগের মতোই রয়ে গেছে! নতুন রাউটে গিয়েও পুরনো স্টেট
        চিপকে বসে থাকে কেন ভাই?!
      </Line>

      <Line name="নেক্সট-ভাই">
        (হেসে কফিতে চুমুক দিয়ে) হা হা! ভুলু, তুই তো App Router-এর আর্কিটেকচারাল ম্যাজিক
        দেখে অবাক হচ্ছিস! তুই নিশ্চয়ই এই রাউটিংয়ের জন্য <code>layout.tsx</code> ব্যবহার
        করেছিস?
      </Line>

      <Line name="ভুলু ভাই">
        হ্যাঁ! আমি তো <code>app/dashboard/layout.tsx</code> বানিয়েছিলাম। সব সাব-পেজের
        কমন জিনিসপত্র তো ওখানেই রাখার নিয়ম, তাই না?
      </Line>

      {/* ── State retention ───────────────────────────────────────────── */}
      <H2 id="state-retention">১. layout.tsx — স্টেট কেন থেকে যায়</H2>

      <Line name="নেক্সট-ভাই">
        একদম ঠিক! কিন্তু তুই যেটাকে &apos;সমস্যা&apos; ভাবছিস, ওটাই কিন্তু{" "}
        <code>layout.tsx</code>-এর সবচেয়ে বড় পাওয়ার! এটাকে বলে{" "}
        <strong>Client State Retention Across Navigation</strong>।
      </Line>

      <Line name="ভুলু ভাই">স্টেট রিটেনশন মানে?!</Line>

      <Line name="নেক্সট-ভাই">
        শোন, Next.js App Router-এ যখন তুই এক রাউট থেকে অন্য রাউটে নেভিগেট করিস:
      </Line>

      <ul>
        <li>
          <strong>
            <code>layout.tsx</code>
          </strong>{" "}
          — এটি কখনো unmount হয় না! এর রেন্ডারিং স্টেট, React স্টেট (
          <code>useState</code>), DOM স্ক্রোল পজিশন আর ক্লায়েন্ট সাইড কম্পোনেন্টগুলো
          মেমরিতে স্থায়ী থাকে। শুধু এর ভেতরের <code>{"{children}"}</code> অংশটুকু বদলে
          যায়!
        </li>
        <li>
          <strong>
            <code>template.tsx</code>
          </strong>{" "}
          — এটি নেভিগেট করার সাথে সাথে পুরোপুরি unmount হয় এবং নতুন রাউটে গিয়ে আবার
          fresh mount হয়! এর ভেতরের সব স্টেট রিক্রিয়েট হয় আর React ইফেক্টগুলো (
          <code>useEffect</code>) নতুন করে ফায়ার করে।
        </li>
      </ul>

      <Diagram>{`[Navigation: /dashboard/analytics ➔ /dashboard/reports]

┌────────────────────────────────────────────────────────┐
│ dashboard/layout.tsx (PERSISTENT / NO RE-MOUNT)        │
│  ├── Sidebar / Navbar (State Retained! 🔒)             │
│  │                                                     │
│  └── ┌──────────────────────────────────────────────┐  │
│      │ children (Changes dynamically)               │  │
│      │   ├── analytics/page.tsx  (Unmounts ❌)      │  │
│      │   └── reports/page.tsx    (Mounts ✅)        │  │
│      └──────────────────────────────────────────────┘  │
└────────────────────────────────────────────────────────┘`}</Diagram>

      <Line name="ভুলু ভাই">
        (চোখ কপালে তুলে) আহারে! তারমানে লেআউট পেজ পরিবর্তন করলেও সাইডবার বা ফিল্টার
        ড্রপডাউনকে নতুন করে রেন্ডারই করায় না?!
      </Line>

      <Line name="নেক্সট-ভাই">
        এক্সাক্টলি! যার ফলে পারফর্মেন্স হয় সুপার-ফাস্ট, আর অহেতুক হাইড্রেশন বা CPU কস্ট
        বেঁচে যায়।
      </Line>

      {/* ── Template ──────────────────────────────────────────────────── */}
      <H2 id="template">২. template.tsx — প্রতিবার ফ্রেশ মাউন্ট</H2>

      <Line name="ভুলু ভাই">
        কিন্তু নেক্সট-ভাই, আমার এমন এক জায়গা দরকার যেখানে ইউজার পেজ চেঞ্জ করলেই পুরনো সব
        স্টেট রিসেট হতে হবে! যেমন অ্যানিমেশন আবার শুরু হবে (Enter/Exit Animations with
        Framer Motion), নতুন করে Analytics Event ট্র্যাক হবে, বা ফর্মের ডাটা ক্লিয়ার
        হবে! সেখানে আমি কী করব?
      </Line>

      <Line name="নেক্সট-ভাই">
        ঠিক ওই সিনারিওগুলোর জন্যই তো জন্ম হয়েছে <code>template.tsx</code>-এর! তুই যদি{" "}
        <code>layout.tsx</code>-এর বদলে একই ফোল্ডারে <code>template.tsx</code> ফাইল
        বানিয়ে দিস, Next.js তখন বুঝে নেবে — &quot;ওহ! এই রাউটের প্রতি নেভিগেশনে আমাকে
        একদম নতুন করে রি-রেন্ডার মারতে হবে এবং নতুন DOM Tree বানাতে হবে!&quot;
      </Line>

      <CodeBlock filename="app/dashboard/template.tsx">{`// app/dashboard/template.tsx
// ⚡ এটি প্রতিবার রাউট চেঞ্জ হলে ফ্রেশ মাউন্ট হবে!
export default function Template({ children }: { children: React.ReactNode }) {
  return (
    <div className="animate-fade-in">
      {children}
    </div>
  );
}`}</CodeBlock>

      <Note>
        <p>
          ভেতরের মেকানিজমটা আসলে খুব সাদামাটা — Next.js প্রতি নেভিগেশনে template-কে একটা
          নতুন React <code>key</code> দেয়। key বদলালে React পুরনো সাবট্রি ফেলে দিয়ে নতুন
          একটা বানায়, তাই স্টেট আর ইফেক্ট সব শূন্য থেকে শুরু হয়।
        </p>
      </Note>

      {/* ── When which ────────────────────────────────────────────────── */}
      <H2 id="when-which">৩. প্রোডাকশনে কখন কোনটা</H2>

      <Line name="ভুলু ভাই">
        (একটু ভেবে) আচ্ছা নেক্সট-ভাই, প্রোডাকশনে আমি কখন <code>layout.tsx</code> আর কখন{" "}
        <code>template.tsx</code> ব্যবহার করব? দুইটার সঠিক ইউজ কেস কী?
      </Line>

      <Line name="নেক্সট-ভাই">সিদ্ধান্তটা খুব সিম্পল:</Line>

      <H3>layout.tsx ব্যবহার করবি যখন —</H3>

      <ul>
        <li>
          সাইডবার, নেভবার বা গ্লোবাল সার্চ প্লেসহোল্ডার থাকবে, যা পেজ চেঞ্জ হলেও আগের
          অবস্থায় রাখা দরকার।
        </li>
        <li>
          সাব-রাউটগুলোর মধ্যে ক্লায়েন্ট মেমরি বা ইউজার ইনপুট স্টেট বয়ে নিয়ে যেতে চাস।
        </li>
        <li>অপ্রয়োজনীয় রি-রেন্ডার বন্ধ করে স্পিড বাড়াতে চাস।</li>
      </ul>

      <H3>template.tsx ব্যবহার করবি যখন —</H3>

      <ul>
        <li>
          রাউট চেঞ্জে CSS বা Framer Motion-এর এন্টার-এক্সিট অ্যানিমেশন ট্রিগার করতে চাস।
        </li>
        <li>
          পেজ লোডে <code>useEffect</code> দিয়ে অ্যানালিটিক্স বা ইভেন্ট ট্র্যাক করতে চাস
          (যা লেআউটে একবারের বেশি ট্রিগার হয় না)।
        </li>
        <li>
          ইউজারের সাব-রাউট নেভিগেশনে পূর্বের কোনো স্টেট বা ফিল্টার ক্যাশ রাখতে চাস না —
          একদম ফ্রেশ স্টার্ট দরকার!
        </li>
      </ul>

      <Note>
        <p>
          সন্দেহ হলে <code>layout.tsx</code>-ই ডিফল্ট। <code>template.tsx</code> মানেই
          প্রতি নেভিগেশনে পুরো সাবট্রি রি-মাউন্ট — অপ্রয়োজনে ব্যবহার করলে ক্লায়েন্ট
          রিসোর্স নষ্ট হয়।
        </p>
      </Note>

      <Line name="ভুলু ভাই">
        (স্ক্রিনের দিকে তাকিয়ে) জোস ভাই! আমি পেজ অ্যানিমেশনের জন্য এতদিন{" "}
        <code>layout.tsx</code>-এর ভেতরে থার্ড পার্টি হ্যাক চালাচ্ছিলাম, আর বারবার
        অ্যানিমেশন না পেয়ে মাথা ঠুকছিলাম! এখন বুঝেছি কোথায় টেমপ্লেট আর কোথায় লেআউট
        বসাতে হবে!
      </Line>

      <Line name="নেক্সট-ভাই">
        বিঙ্গো! এই স্টেট পারসিস্টেন্স আর লাইফসাইকেল মেকানিজম বুঝতে পারলেই তোকে আর
        ক্লায়েন্ট-সাইড অনাকাঙ্ক্ষিত বাগ বা স্টেট লিক নিয়ে চিন্তা করতে হবে না!
      </Line>

      {/* ── Takeaway ──────────────────────────────────────────────────── */}
      <H2 id="takeaway">💡 Production Frontend Takeaways</H2>

      <ul>
        <li>
          <strong>Layout State Persistence:</strong> <code>layout.tsx</code>{" "}
          সাব-রাউটিংয়ের সময় unmount হয় না; এটি DOM স্টেট, রেন্ডার লাইফসাইকেল এবং{" "}
          <code>{"{children}"}</code> ছাড়া বাকি সব ক্লায়েন্ট স্টেট বজায় রাখে।
        </li>
        <li>
          <strong>Template Fresh Lifecycle:</strong> <code>template.tsx</code> প্রতিবার
          রাউট নেভিগেশনে নতুন key তৈরি করে রি-মাউন্ট হয়, যা পেজ অ্যানিমেশন এবং
          ট্র্যাকিংয়ের জন্য আর্কিটেকচারালি উপযুক্ত।
        </li>
        <li>
          <strong>Performance Impact:</strong> অপ্রয়োজনে <code>template.tsx</code>{" "}
          ব্যবহার করলে চাইল্ড কম্পোনেন্ট বারবার রি-মাউন্ট হয়ে ক্লায়েন্ট রিসোর্স অপচয় হতে
          পারে, তাই ডিফল্ট হিসেবে <code>layout.tsx</code>-কেই অগ্রাধিকার দেওয়া উচিত।
        </li>
      </ul>
    </article>
  );
}
