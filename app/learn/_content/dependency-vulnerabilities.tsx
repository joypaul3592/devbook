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
      bn: "নিজের কোড সিকিউর, তবু CVE অ্যালার্ট",
      en: "Clean code, five CVE alerts",
    },
  },
  {
    id: "architecture",
    label: {
      bn: "Supply chain defense পাইপলাইন",
      en: "The supply chain defense pipeline",
    },
  },
  {
    id: "mechanisms",
    label: { bn: "৩টি আর্কিটেকচারাল কনসেপ্ট", en: "Three architectural concepts" },
  },
  {
    id: "implementation",
    label: {
      bn: "overrides ও CI audit gate",
      en: "overrides & the CI audit gate",
    },
  },
  {
    id: "matrix",
    label: { bn: "Dependency Defense Comparison", en: "Dependency defense comparison" },
  },
  {
    id: "takeaway",
    label: { bn: "Production Takeaways", en: "Production takeaways" },
  },
];

export default function DependencyVulnerabilities() {
  return (
    <article className="doc-prose">
      {/* ── The problem ───────────────────────────────────────────────── */}
      <H2 id="the-problem" anchorOnly>
        নিজের কোড সিকিউর, তবু CVE অ্যালার্ট
      </H2>

      <p>
        রাত ৯:১৫। ভুলু ভাই ল্যাপটপ বন্ধ করতে যাচ্ছিলেন, ঠিক তখনই GitHub থেকে পর পর ৫টি রেড নোটিফিকেশন
        ইমেইল এলো — <em>Critical security vulnerability found in your repository dependencies!</em>{" "}
        ব্যাকগ্রাউন্ডে ব্যবহৃত একটি জনপ্রিয় থার্ড-পার্টি ডাটা-পার্সিং লাইব্রেরির পুরোনো ভার্সনে remote
        code execution (RCE) এবং prototype pollution বাগ পাওয়া গেছে!
      </p>

      <Line name="ভুলু ভাই">
        ফাহিম! আমি তো আমার নিজের লেখা সব কোড সিকিউর বানিয়েছি! কোনো XSS বা CSRF-এর সুযোগ রাখিনি! তাহলে
        আমার অ্যাপে আবার সিকিউরিটি হোল আসলো কোত্থেকে?
      </Line>

      <Line name="ফাহিম">
        ভুলু ভাই! আধুনিক ডেভেলপমেন্টে আমরা শত শত NPM প্যাকেজের ওপর নির্ভর করি। আপনার সরাসরি ইনস্টল করা
        ২০টি প্যাকেজের পেছনে প্রায় ১,০০০টিরও বেশি transitive dependency ব্যাকগ্রাউন্ডে ইনস্টল হয়ে
        থাকে! এই লাইব্রেরিগুলোর কোনো একটিতে সিকিউরিটি বাগ থাকলে সেটাকেই হ্যাকাররা অ্যাপ হ্যাক করার কাজে
        ব্যবহার করে — যা supply chain attack নামে পরিচিত।
      </Line>

      <Line name="নেক্সট-ভাই">
        একদম! অ্যাপ্লিকেশনকে supply chain vulnerability থেকে মুক্ত রাখতে automated security scanning
        (Dependabot), CI/CD audit pipeline (<code>npm audit</code>), এবং{" "}
        <code>package.json</code>-এর <code>overrides</code> ফিল্ড ব্যবহার করতে হবে!
      </Line>

      {/* ── Architecture ──────────────────────────────────────────────── */}
      <H2 id="architecture">১. Dependency Attack Vector &amp; CI/CD Defense Pipeline</H2>

      <Diagram>{`┌─────────────────────────────────────────────────────────────────────────────┐
│                 NPM SUPPLY CHAIN DEFENSE PIPELINE                           │
└─────────────────────────────────────────────────────────────────────────────┘

 package.json
         │
         ├── direct dependency      (next, react)
         └── transitive dependency  (sub-library-xyz v1.0.0 — ❌ vulnerable to RCE)
                         │
                         ▼
   ┌───────────────────────────────────────────────────────────┐
   │ CI/CD pipeline guard (GitHub Actions + npm audit)         │
   └───────────────────────────────────────────────────────────┘
                         │
        ┌────────────────┴────────────────┐
        ▼                                 ▼
 ❌ high/critical CVE found         🟢 safe or overridden
 ├── fails the CI build             ├── overrides pins sub-library-xyz to v1.0.4
 ├── blocks the deployment          └── build approved for production 🟢
 └── prevents exploitation`}</Diagram>

      {/* ── Mechanisms ────────────────────────────────────────────────── */}
      <H2 id="mechanisms">২. কোর আর্কিটেকচারাল কনসেপ্ট</H2>

      <p>
        <strong>Direct vs transitive dependencies:</strong> direct হলো যেগুলো আপনি নিজে{" "}
        <code>npm install</code> করে নামিয়েছেন। transitive হলো সেই প্যাকেজগুলো চালানোর জন্য
        ব্যাকগ্রাউন্ডে স্বয়ংক্রিয়ভাবে ইনস্টল হওয়া সাব-ডিপেনডেন্সি — বেশিরভাগ হাই-প্রোফাইল অ্যাটাক এই
        পরোক্ষ প্যাকেজগুলো থেকেই ঘটে।
      </p>

      <p>
        <strong>Supply chain attacks &amp; known CVEs:</strong> আক্রমণকারীরা জনপ্রিয় ওপেন-সোর্স
        লাইব্রেরির ওনারশিপ নিয়ে ম্যালিশিয়াস কোড ইনজেক্ট করতে পারে, অথবা পুরোনো ভার্সনের সুপরিচিত
        ত্রুটি (CVE) স্ক্যান করে অ্যাপে ঢোকার চেষ্টা করে।
      </p>

      <p>
        <strong>Sub-dependency patching via overrides:</strong> কোনো সাব-ডিপেনডেন্সিতে বাগ থাকলে এবং
        মেইন প্যাকেজের মেইনটেইনার আপডেট দিতে দেরি করলে, <code>package.json</code>-এর{" "}
        <code>overrides</code> (npm) বা <code>resolutions</code> (Yarn/pnpm) ফিল্ড দিয়ে জোর করে
        সিকিউর ভার্সন এনফোর্স করা যায়।
      </p>

      {/* ── Implementation ────────────────────────────────────────────── */}
      <H2 id="implementation">৩. Production Code Implementation</H2>

      <H3>❌ Anti-pattern — loose ranges and ignored audit warnings</H3>

      <CodeBlock filename="package.json">{`// 🔴 POOR PRACTICE: loose dependency ranges with no override policy
// sub-dependencies can float onto a compromised version automatically

{
  "name": "my-vulnerable-app",
  "dependencies": {
    "next": "latest",        // ❌ the 'latest' tag destroys build determinism
    "some-parser": "^1.0.0", // ❌ caret pulls in un-audited minor/patch updates
    "vulnerable-lib": "*"    // ❌ accepts any version, including compromised releases
  }
  // ❌ no "overrides" block, so nested transitive bugs stay unpatched
}`}</CodeBlock>

      <H3>🟢 Production pattern — pinned versions, forced overrides, CI gate</H3>

      <p>
        <strong>Step 1 — transitive বাগ প্যাচ করা।</strong>
      </p>

      <CodeBlock filename="package.json">{`{
  "name": "my-secure-next-app",
  "version": "1.0.0",
  "private": true,
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "security:check": "npm audit --audit-level=high"
  },
  "dependencies": {
    "next": "15.0.3",
    "react": "19.0.0",
    "react-dom": "19.0.0",
    "zod": "^3.23.8"
  },
  "devDependencies": {
    "typescript": "^5.6.3"
  },
  "overrides": {
    "vulnerable-nested-package": "2.1.4"
  }
}`}</CodeBlock>

      <p>
        <strong>Step 2 — CI security audit gate।</strong>
      </p>

      <CodeBlock filename=".github/workflows/security-audit.yml">{`# 🟢 PRODUCTION PATTERN: block vulnerable deployments in GitHub Actions
name: Security Audit Pipeline

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

jobs:
  audit:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout source
        uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '20.x'
          cache: 'npm'

      - name: Clean install from the lockfile
        run: npm ci

      - name: Run the vulnerability audit
        # 🟢 fails the build on any HIGH or CRITICAL finding
        run: npm audit --audit-level=high`}</CodeBlock>

      {/* ── Matrix ────────────────────────────────────────────────────── */}
      <H2 id="matrix">৪. Dependency Defense Strategy Comparison</H2>

      <Table
        head={[
          "পদ্ধতি",
          "Manual npm update",
          "Dependabot / Renovate",
          "CI audit gate + overrides",
        ]}
        rows={[
          [
            "Automation speed",
            "স্লো ও ম্যানুয়াল 🔴",
            "হাই — অটোমেটিক PR তৈরি করে 🟢",
            "ইনস্ট্যান্ট — বিল্ড ব্লক করে দেয় 🟢",
          ],
          [
            "Transitive fix",
            "শুধু ডিরেক্ট প্যাকেজ আপডেট করে 🟡",
            "সাব-প্যাকেজে সবসময় কাজ করে না 🟡",
            "ফোর্সড ফিক্স (overrides) 🟢",
          ],
          [
            "Production risk reduction",
            "কম 🔴",
            "মাঝারি 🟡",
            "সর্বোচ্চ — ভালনারেবল কোড প্রোডাকশনে যেতে পারে না 🟢",
          ],
        ]}
      />

      <Line name="ভুলু ভাই">
        দুর্দান্ত সমাধান ফাহিম! <code>package.json</code>-এ <code>overrides</code> বসিয়ে ক্ষতিকর
        সাব-প্যাকেজ ভার্সন ফিক্স করে দিলাম আর GitHub Actions-এ <code>npm audit</code> যোগ করে দিলাম!
        এখন আর কোনো ভালনারেবল প্যাকেজ ঢুকতে পারবে না।
      </Line>

      {/* ── Takeaways ─────────────────────────────────────────────────── */}
      <H2 id="takeaway">Production Takeaways</H2>

      <Note>
        <ul>
          <li>
            <strong>Enforce lockfile consistency:</strong> CI/CD পাইপলাইনে সবসময়{" "}
            <code>npm install</code>-এর পরিবর্তে <code>npm ci</code> ব্যবহার করুন, যেন{" "}
            <code>package-lock.json</code> অনুসারেই হুবহু ডিপেনডেন্সি ইনস্টল হয়।
          </li>
          <li>
            <strong>Use overrides for unpatched sub-dependencies:</strong> মেইন প্যাকেজ আপডেট না
            হওয়া পর্যন্ত অপেক্ষা না করে <code>overrides</code> ব্লক দিয়ে transitive বাগ প্যাচ করুন।
          </li>
          <li>
            <strong>Fail CI on high/critical CVEs:</strong> <code>npm audit --audit-level=high</code>{" "}
            রান করুন, যাতে হাই বা ক্রিটিক্যাল বাগ পাওয়া গেলে সাথে সাথে বিল্ড ক্যান্সেল হয়।
          </li>
        </ul>
      </Note>
    </article>
  );
}
