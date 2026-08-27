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
      bn: "Invalid hook call — অথচ কোড ঠিক",
      en: "Invalid hook call — with correct code",
    },
  },
  {
    id: "architecture",
    label: {
      bn: "Nested duplicate বনাম flat tree",
      en: "Nested duplicates vs a flat tree",
    },
  },
  {
    id: "steps",
    label: {
      bn: "ডিটেক্ট ও সমাধানের ৩টি ধাপ",
      en: "Three steps to detect and fix",
    },
  },
  {
    id: "implementation",
    label: {
      bn: "Audit ও overrides কনফিগারেশন",
      en: "Audit & overrides configuration",
    },
  },
  {
    id: "matrix",
    label: { bn: "Deduplication Command Matrix", en: "Deduplication command matrix" },
  },
  {
    id: "takeaway",
    label: { bn: "Production Takeaways", en: "Production takeaways" },
  },
];

export default function DuplicateDependencies() {
  return (
    <article className="doc-prose">
      {/* ── The problem ───────────────────────────────────────────────── */}
      <H2 id="the-problem" anchorOnly>
        Invalid hook call — অথচ কোড ঠিক
      </H2>

      <p>
        সন্ধ্যা ৭:১৫। ভুলু ভাই তার অ্যাপের প্রোডাকশন বান্ডল টেস্ট করার সময় হঠাৎ কনসোলে একটি অদ্ভুত
        এরর দেখলেন — <code>Warning: Invalid hook call. Hooks can only be called inside of the body
        of a function component!</code> অথচ সব রিঅ্যাক্ট হুক সঠিকভাবে লেখা রয়েছে। বান্ডল
        অ্যানালাইজারে গিয়ে দেখলেন — <code>node_modules</code>-এর গভীরে <code>react</code> ও{" "}
        <code>lodash</code>-এর ২টি আলাদা ভার্সন দুটো আলাদা সাব-ডিপেন্ডেন্সির ভেতরে ডুপ্লিকেট হিসেবে
        লোড হয়ে বসে আছে।
      </p>

      <Line name="ভুলু ভাই">
        ফাহিম! আমার <code>package.json</code>-এ তো <code>react</code> ও <code>lodash</code>-এর একটা
        করেই ভার্সন লেখা আছে! তাহলে বান্ডলে একই প্যাকেজ ২-৩ বার ভিন্ন ভিন্ন ভার্সনে কীভাবে ঢুকে পড়ল?
        আর এজন্যই বা অ্যাপ হুকস এরর দিয়ে ক্র্যাশ করছে কেন?
      </Line>

      <Line name="ফাহিম">
        ভুলু ভাই! এই সমস্যার নাম <strong>Transitive Dependency Duplication</strong>! আপনি সরাসরি যে
        প্যাকেজগুলো ইনস্টল করেন, সেগুলোর নিজস্ব কিছু সাব-ডিপেন্ডেন্সি থাকে। লাইব্রেরি A যদি{" "}
        <code>lodash@4.17.15</code> চায় আর লাইব্রেরি B যদি <code>lodash@4.17.21</code> চায়, তবে NPM{" "}
        <code>node_modules</code>-এর ভেতরে আলাদা নেস্টেড ফোল্ডার বানিয়ে দুটো ভার্সনই লোড করে নেয়।
      </Line>

      <Line name="নেক্সট-ভাই">
        একদম! এবং React বা Zustand-এর মতো স্টেট ম্যানেজমেন্ট লাইব্রেরির একাধিক ভার্সন ব্রাউজারে লোড
        হলে সিঙ্গেলটন মেমরি কনটেক্সট ভেঙে যায়। Next.js 15-এ বান্ডল সাইজ ছোট ও বাগ-ফ্রি রাখতে এই
        Duplicate Packages ডিটেক্ট করা এবং <code>package.json</code>-এর <code>overrides</code> /{" "}
        <code>resolutions</code> দিয়ে সেগুলোকে একটি একক ভার্সনে ফোর্স করা অত্যন্ত জরুরি।
      </Line>

      {/* ── Architecture ──────────────────────────────────────────────── */}
      <H2 id="architecture">১. Duplicate vs. Deduplicated node_modules Architecture</H2>

      <Diagram>{`┌─────────────────────────────────────────────────────────────────────────┐
│              NESTED DUPLICATES VS. FLAT DEDUPLICATED TREE               │
└─────────────────────────────────────────────────────────────────────────┘

 ❌ NESTED DUPLICATE DEPENDENCIES (broken singletons & a heavy bundle)
 node_modules/
 ├── react (v19.0.0) ──► used by your main app
 ├── lib-a/
 │   └── node_modules/
 │       └── react (v18.2.0) ──► 🔴 duplicate React loaded in the bundle!
 └── lib-b/
     └── node_modules/
         └── lodash (v4.17.15) ──► 🔴 duplicate Lodash copy loaded!

───────────────────────────────────────────────────────────────────────────

 🟢 DEDUPLICATED FLAT TREE (forced via overrides / npm dedupe)
 node_modules/
 ├── react (v19.0.0) ──► shared globally across every package
 └── lodash (v4.17.21) ──► a single unified instance`}</Diagram>

      {/* ── Steps ─────────────────────────────────────────────────────── */}
      <H2 id="steps">২. ডুপ্লিকেট ডিপেন্ডেন্সি ডিটেক্ট ও সমাধানের ৩টি ধাপ</H2>

      <p>
        <strong>Detection (শনাক্তকরণ):</strong> <code>npm ls &lt;package-name&gt;</code> দিয়ে
        ডিপেন্ডেন্সি ট্রিতে একটি নির্দিষ্ট প্যাকেজ কত জায়গায় কী কী ভার্সনে ইনস্টল আছে তা দেখা যায়।
        বিল্ড-টাইমে চেক করতে <code>duplicate-package-checker-webpack-plugin</code> ব্যবহার করা যায়।
      </p>

      <p>
        <strong>Standard deduplication:</strong> দুটি প্যাকেজের ভার্সন যদি SemVer রেঞ্জের মধ্যে মিলে
        যায় (যেমন <code>^4.17.0</code> ও <code>^4.17.21</code>), তবে <code>npm dedupe</code> বা{" "}
        <code>pnpm dedupe</code> চালালেই প্যাকেজ ম্যানেজার অতিরিক্ত নেস্টেড ডুপ্লিকেট রিমুভ করে
        ডিরেক্টরিকে ফ্ল্যাট করে দেয়।
      </p>

      <p>
        <strong>Explicit version overriding:</strong> কোনো থার্ড-পার্টি সাব-ডিপেন্ডেন্সি জেদ ধরে
        পুরোনো ভার্সন দাবি করলে <code>package.json</code>-এর <code>overrides</code> (NPM),{" "}
        <code>resolutions</code> (Yarn) বা <code>pnpm.overrides</code> ব্যবহার করে পুরো প্রজেক্টে একটি
        নির্দিষ্ট সিঙ্গেল ভার্সন ফোর্স করা যায়।
      </p>

      {/* ── Implementation ────────────────────────────────────────────── */}
      <H2 id="implementation">৩. Production Code &amp; Configuration Implementation</H2>

      <H3>Step 1 — ডুপ্লিকেট প্যাকেজ শনাক্তকরণ (terminal audit)</H3>

      <CodeBlock label="Bash" filename="audit.sh">{`# Inspect how many versions of react exist inside node_modules
npm ls react

# Output:
# my-next-app@1.0.0
# ├── react@19.0.0
# └─┬ heavy-legacy-table@2.1.0
#   └── react@18.3.1  <-- 🔴 DANGER: duplicate React instance detected!`}</CodeBlock>

      <H3>❌ Step 2 — Anti-pattern: ডুপ্লিকেট উপেক্ষা করা</H3>

      <CodeBlock label="JSON" filename="package.json">{`// 🔴 POOR PRACTICE: unmanaged dependencies causing nested bundle duplicates
{
  "name": "my-next-app",
  "dependencies": {
    "next": "15.0.0",
    "react": "^19.0.0",
    "react-dom": "^19.0.0",
    "heavy-legacy-table": "^2.1.0",
    "lodash": "^4.17.21"
  }
}`}</CodeBlock>

      <H3>🟢 Step 3 — Production pattern: overrides দিয়ে single instance ফোর্স করা</H3>

      <CodeBlock label="JSON" filename="package.json">{`// 🟢 PRODUCTION PATTERN: deduplicate & override transitive sub-dependencies
{
  "name": "my-next-app",
  "version": "1.0.0",
  "scripts": {
    "build": "next build",
    "dedupe:check": "npm ls lodash react",
    "dedupe:fix": "npm dedupe"
  },
  "dependencies": {
    "next": "15.0.0",
    "react": "^19.0.0",
    "react-dom": "^19.0.0",
    "heavy-legacy-table": "^2.1.0",
    "lodash": "^4.17.21"
  },
  "overrides": {
    "react": "$react",
    "react-dom": "$react-dom",
    "lodash": "^4.17.21"
  },
  "pnpm": {
    "overrides": {
      "react": "$react",
      "react-dom": "$react-dom",
      "lodash": "^4.17.21"
    }
  }
}`}</CodeBlock>

      <Note>
        <p>
          <code>&quot;react&quot;: &quot;$react&quot;</code> সিনট্যাক্সটি প্যাকেজ ম্যানেজারকে নির্দেশ
          করে — &quot;সাব-ডিপেন্ডেন্সিগুলো যা-ই দাবি করুক না কেন, রুট <code>package.json</code>-এ
          ঘোষিত React ভার্সনটিকেই পুরো প্রজেক্টে বাধ্যতামূলকভাবে ব্যবহার করো।&quot;
        </p>
      </Note>

      {/* ── Matrix ────────────────────────────────────────────────────── */}
      <H2 id="matrix">৪. Package Manager Deduplication Command Matrix</H2>

      <Table
        head={["প্যাকেজ ম্যানেজার", "ডিডুপ্লিকেট কমান্ড", "ফোর্স ওভাররাইড অপশন", "বৈশিষ্ট্য"]}
        rows={[
          [
            "NPM (v8+)",
            <code key="c">npm dedupe</code>,
            <code key="c">{'"overrides": { "pkg": "ver" }'}</code>,
            "নেটিভ সাপোর্ট, বাড়তি প্লাগইন ছাড়াই কাজ করে",
          ],
          [
            "PNPM",
            <code key="c">pnpm dedupe</code>,
            <code key="c">{'"pnpm": { "overrides": { ... } }'}</code>,
            "সেরা 🟢 — symlink ব্যবহারের কারণে ডুপ্লিকেট ২%-এর নিচে থাকে",
          ],
          [
            "Yarn (v1 / Classic)",
            <code key="c">npx yarn-deduplicate</code>,
            <code key="c">{'"resolutions": { "pkg": "ver" }'}</code>,
            "lockfile পুনর্গঠন করে ভার্সন সিঙ্ক করে",
          ],
          [
            "Yarn (Berry v2+)",
            <code key="c">yarn dedupe</code>,
            <code key="c">{'"resolutions": { "pkg": "ver" }'}</code>,
            "আধুনিক zero-install মেকানিজম সাপোর্ট করে",
          ],
        ]}
      />

      <Line name="ভুলু ভাই">
        দুর্দান্ত! <code>npm ls react</code> দিয়ে ধরে ফেললাম কোন লাইব্রেরি ঝামেলা করছিল, তারপর{" "}
        <code>overrides</code>-এ <code>&quot;$react&quot;</code> বসিয়ে দিতেই পুরো প্রজেক্টে একটা
        সিঙ্গেল রিঅ্যাক্ট ভার্সন ফিক্স হয়ে গেল! বাগও হাওয়া, আর বান্ডল সাইজও কমে গেল।
      </Line>

      {/* ── Takeaways ─────────────────────────────────────────────────── */}
      <H2 id="takeaway">Production Takeaways</H2>

      <Note>
        <ul>
          <li>
            <strong>Audit React &amp; core context packages first:</strong> <code>react</code>,{" "}
            <code>react-dom</code>, <code>zustand</code>, <code>@tanstack/react-query</code>-এর একাধিক
            ভার্সন থাকলে রান-টাইম ক্র্যাশ নিশ্চিত। <code>npm ls react</code> দিয়ে নিয়মিত পরীক্ষা
            করুন।
          </li>
          <li>
            <strong>Leverage overrides for security &amp; size:</strong> কোনো সাব-ডিপেন্ডেন্সি পুরোনো
            নিরাপত্তা-ত্রুটিযুক্ত প্যাকেজ ব্যবহার করলে কাস্টম <code>overrides</code> দিয়ে তাকে নতুন
            নিরাপদ ভার্সনে তুলে দিন।
          </li>
          <li>
            <strong>Use PNPM for automatic deduplication:</strong> সম্ভব হলে PNPM ব্যবহার করুন — এর
            কনটেন্ট-অ্যাড্রেসড ফাইল-স্টোর প্রজেক্টের সব ডুপ্লিকেট প্যাকেজকে স্বয়ংক্রিয়ভাবে একটি
            symlink কপির অধীনে নিয়ে আসে।
          </li>
        </ul>
      </Note>
    </article>
  );
}
