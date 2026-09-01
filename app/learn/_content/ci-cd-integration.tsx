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
      bn: "SSH দিয়ে ফাইল কপি, সাইট ডাউন",
      en: "Copied a file over SSH, site down",
    },
  },
  {
    id: "architecture",
    label: {
      bn: "CI/CD পাইপলাইন আর্কিটেকচার",
      en: "The CI/CD pipeline architecture",
    },
  },
  {
    id: "mechanisms",
    label: { bn: "৩টি আর্কিটেকচারাল কনসেপ্ট", en: "Three architectural concepts" },
  },
  {
    id: "implementation",
    label: {
      bn: "GitHub Actions ওয়ার্কফ্লো",
      en: "The GitHub Actions workflow",
    },
  },
  {
    id: "matrix",
    label: { bn: "Platform Comparison", en: "Platform comparison" },
  },
  {
    id: "takeaway",
    label: { bn: "Production Takeaways", en: "Production takeaways" },
  },
];

export default function CiCdIntegration() {
  return (
    <article className="doc-prose">
      {/* ── The problem ───────────────────────────────────────────────── */}
      <H2 id="the-problem" anchorOnly>
        SSH দিয়ে ফাইল কপি, সাইট ডাউন
      </H2>

      <p>
        সন্ধ্যা ৬:০০। ভুলু ভাই লোকাল মেশিনে কোড চেঞ্জ করে ম্যানুয়ালি SSH দিয়ে VPS সার্ভারে ফাইল কপি
        করে দিচ্ছিলেন! কিন্তু একটি ফাইলে ভুল সেমিকোলন থাকার কারণে পুরো লাইভ ওয়েবসাইট মুহূর্তের মধ্যে
        ব্ল্যাঙ্ক হয়ে গেল। তাছাড়া টিম মেম্বাররা টাইপ এররসহ কোড <code>main</code> ব্রাঞ্চে মার্জ করায়
        প্রোডাকশন বিল্ড পুরোপুরি ক্র্যাশ করেছে।
      </p>

      <Line name="ভুলু ভাই">
        ফাহিম! আমি তো কেবল একটা ছোট স্পেলিং ঠিক করে ফাইল সার্ভারে পাঠালাম, সাইট ডাউন হয়ে গেল কেন? আর
        টিম মেম্বাররা ভুল কোড মার্জ করলে ডেপ্লয় অটোমেটিক আটকানোর কোনো উপায় নেই?
      </Line>

      <Line name="ফাহিম">
        ভুলু ভাই! ম্যানুয়ালি ফাইল কপি করা বা টেস্ট ছাড়া সরাসরি মেইন ব্রাঞ্চে কোড পাঠানো একদম আত্মঘাতী!
        আপনার প্রজেক্টে CI/CD pipeline বসাতে হবে — পুশ করার সাথে সাথেই অটোমেটিক লিন্টিং, টাইপ-চেকিং ও
        বিল্ড টেস্ট হবে। সব পাস করলেই কেবল সাইট ডেপ্লয় হবে।
      </Line>

      <Line name="নেক্সট-ভাই">
        একদম! Vercel-এর জিরো-কনফিগ CI/CD অথবা GitHub Actions দিয়ে ডকার ইমেজ বানিয়ে কন্টেইনার
        রেজিস্ট্রিতে পুশ করার অটোমেটিক পাইপলাইন তৈরি করাই আধুনিক প্রোডাকশন আর্কিটেকচারের গোল্ড
        স্ট্যান্ডার্ড!
      </Line>

      {/* ── Architecture ──────────────────────────────────────────────── */}
      <H2 id="architecture">১. CI/CD Pipeline Architecture</H2>

      <Diagram>{`┌─────────────────────────────────────────────────────────────────────────────┐
│                    NEXT.JS AUTOMATED CI/CD PIPELINE                         │
└─────────────────────────────────────────────────────────────────────────────┘

 git push / PR opened
                       │
                       ▼
 ┌───────────────────────────────────────────────────────────┐
 │ CONTINUOUS INTEGRATION                                    │
 │ ├─ 1. ESLint            (npm run lint)                    │
 │ ├─ 2. type check        (tsc --noEmit)                    │ 🔴 fails the PR on error
 │ └─ 3. tests             (npm test)                        │
 └─────────────────────────────┬─────────────────────────────┘
                               │ all green 🟢
                               ▼
 ┌───────────────────────────────────────────────────────────┐
 │ CONTINUOUS DEPLOYMENT                                     │
 │ ├─ option A: Vercel auto-deploy (preview + production)    │
 │ └─ option B: GitHub Actions + Docker                      │
 │       ├─ build the image (output: 'standalone')           │
 │       ├─ push to GHCR / Docker Hub                        │
 │       └─ SSH to the VPS and restart the container         │
 └───────────────────────────────────────────────────────────┘`}</Diagram>

      {/* ── Mechanisms ────────────────────────────────────────────────── */}
      <H2 id="mechanisms">২. কোর আর্কিটেকচারাল কনসেপ্ট</H2>

      <p>
        <strong>CI guardrails:</strong> গিটহাবে PR ওপেন বা আপডেট হলে CI সার্ভার স্বয়ংক্রিয়ভাবে কোড
        স্ক্যান করে — <code>next lint</code>, <code>tsc --noEmit</code>, এবং টেস্ট। একটি টেস্টও ফেল
        করলে PR ব্লক হয়ে যায় এবং প্রোডাকশনে ভুল কোড যাওয়া রোধ হয়।
      </p>

      <p>
        <strong>CD automation:</strong> Vercel গিটহাবের সাথে কানেক্ট করলে প্রতি ব্রাঞ্চে অটোমেটিক
        preview এবং <code>main</code>-এ মার্জ হলে production deployment করে। সেলফ-হোস্টেড ক্ষেত্রে
        GitHub Actions রানার ডকার ইমেজ বিল্ড করে রেজিস্ট্রিতে পুশ করে এবং SSH দিয়ে কন্টেইনার রিস্টার্ট
        করে।
      </p>

      <p>
        <strong>Build caching:</strong> প্রতিটি CI রানে পুরো <code>node_modules</code> রি-ডাউনলোড করা
        সময়সাপেক্ষ। <code>.next/cache</code> এবং npm cache রি-ইউজ করলে CI বিল্ড টাইম ১০ মিনিট থেকে
        নেমে ১-২ মিনিটে আসতে পারে।
      </p>

      {/* ── Implementation ────────────────────────────────────────────── */}
      <H2 id="implementation">৩. Production Code Implementation</H2>

      <H3>❌ Anti-pattern — manual deployment with no checks</H3>

      <CodeBlock filename="terminal">{`# 🔴 POOR PRACTICE: deploying by hand, with no automated gate

npm run build   # if it passes locally, ship it — right?

ssh root@vps-ip "cd /var/www && git pull && npm run build && pm2 restart all"
# ❌ no test gate, and the live server is building — CPU spikes and the site
#    is degraded for the whole duration of the build`}</CodeBlock>

      <H3>🟢 Production pattern — a full GitHub Actions pipeline</H3>

      <p>
        <strong>Step 1 — CI ও CD ওয়ার্কফ্লো।</strong>
      </p>

      <CodeBlock filename=".github/workflows/ci-cd.yml">{`name: Next.js Production CI/CD

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

jobs:
  # ── CI: lint, type-check, test ────────────────────────────────
  verify:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: 'npm'

      - name: Cache the Next.js build output
        uses: actions/cache@v4
        with:
          path: |
            ~/.npm
            \${{ github.workspace }}/.next/cache
          key: \${{ runner.os }}-nextjs-\${{ hashFiles('**/package-lock.json') }}
          restore-keys: |
            \${{ runner.os }}-nextjs-

      - run: npm ci
      - run: npm run lint
      - run: npx tsc --noEmit

  # ── CD: build and ship, only from main ────────────────────────
  deploy:
    needs: verify
    if: github.ref == 'refs/heads/main' && github.event_name == 'push'
    runs-on: ubuntu-latest

    steps:
      - uses: actions/checkout@v4

      - uses: docker/setup-buildx-action@v3

      - name: Log in to GHCR
        uses: docker/login-action@v3
        with:
          registry: ghcr.io
          username: \${{ github.actor }}
          password: \${{ secrets.GITHUB_TOKEN }}

      - name: Build and push the image
        uses: docker/build-push-action@v5
        with:
          context: .
          push: true
          tags: ghcr.io/\${{ github.repository }}/next-app:\${{ github.sha }}
          # NEXT_PUBLIC_ values must be present at BUILD time — they get inlined
          build-args: |
            NEXT_PUBLIC_APP_URL=\${{ secrets.NEXT_PUBLIC_APP_URL }}
          cache-from: type=gha
          cache-to: type=gha,mode=max

      - name: Deploy to the VPS
        uses: appleboy/ssh-action@v1.0.3
        with:
          host: \${{ secrets.VPS_HOST }}
          username: \${{ secrets.VPS_USERNAME }}
          key: \${{ secrets.VPS_SSH_KEY }}
          script: |
            IMAGE=ghcr.io/\${{ github.repository }}/next-app:\${{ github.sha }}
            docker pull $IMAGE
            docker stop next-production || true
            docker rm next-production || true
            docker run -d \\
              --name next-production \\
              --restart always \\
              -p 3000:3000 \\
              -e DATABASE_URL="\${{ secrets.DATABASE_URL }}" \\
              $IMAGE`}</CodeBlock>

      <p>
        <strong>Step 2 — ব্রাঞ্চ প্রোটেকশন (রিপো সেটিংস)।</strong>
      </p>

      <CodeBlock filename="GitHub → Settings → Branches → main">{`# 🟢 the workflow alone does not block a merge — this rule does

Require a pull request before merging          ✓
Require status checks to pass before merging   ✓
  └─ required check: verify
Require branches to be up to date before merging ✓`}</CodeBlock>

      {/* ── Matrix ────────────────────────────────────────────────────── */}
      <H2 id="matrix">৪. CI/CD Platform Comparison</H2>

      <Table
        head={["বৈশিষ্ট্য", "Vercel platform CI/CD", "GitHub Actions + self-hosted VPS"]}
        rows={[
          [
            "কনফিগারেশন",
            "জিরো কনফিগ, plug & play 🟢",
            "YAML ও ডকার কনফিগ লিখতে হয় 🟡",
          ],
          [
            "Preview deployment",
            "প্রতি PR-এ স্বয়ংক্রিয় URL 🟢",
            "কাস্টম ডোমেইন/পোর্টে সেট করতে হয় 🟡",
          ],
          [
            "খরচ",
            "ট্রাফিকের সাথে স্কেল করে 🟡",
            "VPS-এর ফিক্সড খরচ 🟢",
          ],
          [
            "নিয়ন্ত্রণ",
            "প্ল্যাটফর্ম নির্ভর 🟡",
            "১০০% সার্ভার ও ডাটা কন্ট্রোল 🟢",
          ],
        ]}
      />

      <Line name="ভুলু ভাই">
        ফ্যান্টাস্টিক ফাহিম! এখন বুঝেছি CI/CD পাইপলাইন ছাড়া প্রোডাকশনে হাত দেওয়া কতটা বিপজ্জনক। GitHub
        Actions সেট থাকলে ভুল কোড কেউ মার্জই করতে পারবে না, আর মার্জ হলে অটোমেটিক সিকিউর ডেপ্লয়মেন্ট
        হয়ে যাবে!
      </Line>

      {/* ── Takeaways ─────────────────────────────────────────────────── */}
      <H2 id="takeaway">Production Takeaways</H2>

      <Note>
        <ul>
          <li>
            <strong>Enforce branch protection rules:</strong> ওয়ার্কফ্লো লেখাই যথেষ্ট নয় — রিপোর
            Settings → Branches-এ <em>require status checks to pass</em> অন না করলে ফেল করা CI
            সত্ত্বেও মার্জ করা যাবে।
          </li>
          <li>
            <strong>Never hardcode secrets in a workflow:</strong> API key, SSH key বা DB URL সবসময়
            রিপোর encrypted secrets-এ রাখুন — ওয়ার্কফ্লো ফাইল পাবলিক রিপোতে সবাই পড়তে পারে।
          </li>
          <li>
            <strong>Tag images by commit SHA:</strong> শুধু <code>:latest</code> ট্যাগ ব্যবহার করলে
            রোলব্যাক করার কিছু থাকে না — কমিট SHA দিয়ে ট্যাগ করলে যেকোনো পুরোনো ভার্সনে ফিরে যাওয়া
            যায়।
          </li>
        </ul>
      </Note>
    </article>
  );
}
