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
      bn: ".env বদলেও পুরোনো URL-ই যাচ্ছে",
      en: "Changed .env, still the old URL",
    },
  },
  {
    id: "architecture",
    label: {
      bn: "Inlining বনাম runtime evaluation",
      en: "Inlining vs runtime evaluation",
    },
  },
  {
    id: "mechanisms",
    label: { bn: "৩টি আর্কিটেকচারাল কনসেপ্ট", en: "Three architectural concepts" },
  },
  {
    id: "implementation",
    label: {
      bn: "force-dynamic ও Docker ARG",
      en: "force-dynamic & Docker ARG",
    },
  },
  {
    id: "matrix",
    label: { bn: "Build-time vs Runtime", en: "Build-time vs runtime" },
  },
  {
    id: "takeaway",
    label: { bn: "Production Takeaways", en: "Production takeaways" },
  },
];

export default function BuildTimeVsRuntimeVariables() {
  return (
    <article className="doc-prose">
      {/* ── The problem ───────────────────────────────────────────────── */}
      <H2 id="the-problem" anchorOnly>
        .env বদলেও পুরোনো URL-ই যাচ্ছে
      </H2>

      <p>
        সকাল ১১:৩০। ভুলু ভাই ডকার কনটেইনারের মাধ্যমে প্রোডাকশন VPS-এ প্রজেক্ট ডেপ্লয় করেছেন। স্টেজিং
        API URL বদলে প্রোডাকশন লাইভ API URL সেট করার জন্য তিনি কনটেইনারের <code>.env</code> ফাইল
        আপডেট করে কনটেইনার রিস্টার্ট করলেন। কিন্তু অবাক কাণ্ড — ব্রাউজারে অ্যাপটি এখনও স্টেজিং
        API-তেই রিকোয়েস্ট পাঠাচ্ছে!
      </p>

      <Line name="ভুলু ভাই">
        ফাহিম! সার্ভারে ডকার কনটেইনারের <code>.env</code> ফাইলের API URL বদলে রিস্টার্ট দিলাম, তাও
        ব্রাউজার থেকে পুরনো স্টেজিং API-তে রিকোয়েস্ট যাচ্ছে কেন?
      </Line>

      <Line name="ফাহিম">
        ভুলু ভাই! কারণ ওই ভ্যারিয়েবলটি একটি <strong>build-time variable</strong> ছিল! Next.js বিল্ড
        হওয়ার সময় ক্লায়েন্ট বান্ডেল ও স্ট্যাটিক পেজের ভেতর ওই ভ্যালুটি চিরতরে বসিয়ে (inline) দিয়েছে!
        কনটেইনার রিস্টার্ট দিলে ভ্যারিয়েবল রি-রিড হয় না, কারণ কোডটাই বিল্ডের সময় বদলে গেছে।
      </Line>

      <Line name="নেক্সট-ভাই">
        একদম! Build-time variable (<code>NEXT_PUBLIC_</code> বা স্ট্যাটিক রেন্ডার্ড পেজ){" "}
        <code>npm run build</code> চলাকালীনই কোডে টেক্সট হিসেবে রিপ্লেস হয়ে যায়। আর runtime variable
        (ডাইনামিক রাউট, Server Action, route handler) প্রতিবার ইউজারের রিকোয়েস্ট আসার সময় রিড করা হয়!
      </Line>

      {/* ── Architecture ──────────────────────────────────────────────── */}
      <H2 id="architecture">১. Build-time vs Runtime Evaluation</H2>

      <Diagram>{`┌─────────────────────────────────────────────────────────────────────────────┐
│               BUILD-TIME vs RUNTIME VARIABLE EVALUATION                     │
└─────────────────────────────────────────────────────────────────────────────┘

 [1] BUILD-TIME INLINING  (npm run build)
 ─────────────────────────────────────────
 .env  →  NEXT_PUBLIC_API_URL="https://api.staging.com"
               │
               ▼
 the compiler replaces process.env.NEXT_PUBLIC_API_URL
 with the literal string, inside the JS bundle
               │
               ▼
 output: const url = "https://api.staging.com";
 🔴 immutable after the build — only a rebuild changes it


 [2] RUNTIME EVALUATION  (a request, in production)
 ─────────────────────────────────────────────────
 request → dynamic server route (force-dynamic / Server Action / route handler)
               │
               ▼
 the server reads the live Node.js process environment:
 const secret = process.env.PAYMENT_SECRET;
 🟢 picks up a new value on container restart`}</Diagram>

      {/* ── Mechanisms ────────────────────────────────────────────────── */}
      <H2 id="mechanisms">২. কোর আর্কিটেকচারাল কনসেপ্ট</H2>

      <p>
        <strong>Build-time inlining:</strong> ক্লায়েন্ট কম্পোনেন্টে ব্যবহৃত সব{" "}
        <code>NEXT_PUBLIC_</code> ভ্যারিয়েবল বিল্ড টাইমে বান্ডেলে হার্ডকোড হয়ে যায়। স্ট্যাটিক্যালি
        জেনারেটেড পেজ প্রাক-রেন্ডারের সময় সার্ভার-সাইড ভ্যারিয়েবলও বিল্ডের মুহূর্তের ভ্যালু ধরে ফেলে।
        ফলে <code>.env</code> বদলালেও নতুন বিল্ড ছাড়া কিছুই বদলাবে না।
      </p>

      <p>
        <strong>Runtime evaluation:</strong> রাউটটি ডাইনামিক হলে (<code>headers()</code>,{" "}
        <code>cookies()</code>, বা <code>export const dynamic = &apos;force-dynamic&apos;</code>)
        Next.js প্রতি রিকোয়েস্টে <code>process.env</code> থেকে তাজা ভ্যালু রিড করে। Server Actions ও
        route handler সবসময় রানটাইমে পড়ে।
      </p>

      <p>
        <strong>The Docker gotcha:</strong> Dockerfile-এ <code>ARG</code> (build argument) এবং{" "}
        <code>ENV</code>-এর পার্থক্য মাথায় রাখা জরুরি। <code>NEXT_PUBLIC_</code> ভ্যারিয়েবলগুলোর জন্য
        ইমেজ বিল্ড করার সময়েই <code>--build-arg</code> দিয়ে ভ্যালু পাস করতে হয়।
      </p>

      {/* ── Implementation ────────────────────────────────────────────── */}
      <H2 id="implementation">৩. Production Code Implementation</H2>

      <H3>❌ Anti-pattern — expecting runtime updates from inlined values</H3>

      <CodeBlock filename="app/config-test/page.tsx">{`// 🔴 POOR PRACTICE: expecting statically rendered code to track .env changes

export default function ConfigPage() {
  // ❌ pitfall 1: NEXT_PUBLIC_ is inlined during the build.
  // changing .env on the VPS without rebuilding changes nothing here.
  const clientUrl = process.env.NEXT_PUBLIC_API_URL;

  // ❌ pitfall 2: even without the prefix — this page is statically generated,
  // so SERVER_SECRET is captured at build time too.
  const serverSecret = process.env.SERVER_SECRET;

  return (
    <div>
      <p>API: {clientUrl}</p>
      <p>Secret preview: {serverSecret?.slice(0, 3)}</p>
    </div>
  );
}`}</CodeBlock>

      <H3>🟢 Production pattern — forcing runtime evaluation</H3>

      <p>
        <strong>Step 1 — সত্যিকারের runtime রাউট।</strong>
      </p>

      <CodeBlock filename="app/api/runtime-config/route.ts">{`// 🟢 PRODUCTION PATTERN: guaranteed request-time evaluation
import { NextResponse } from 'next/server';

// 🟢 stops Next.js from caching or baking this route during the build
export const dynamic = 'force-dynamic';

export async function GET() {
  // 🟢 read fresh from the container's environment on every request
  const runtimeDbHost = process.env.DATABASE_HOST;
  const runtimeFeatureFlag = process.env.ENABLE_NEW_FEATURE === 'true';

  return NextResponse.json({
    dbHost: runtimeDbHost,
    featureEnabled: runtimeFeatureFlag,
    timestamp: new Date().toISOString(),
  });
}`}</CodeBlock>

      <p>
        <strong>Step 2 — Dockerfile-এ দুই ধরনের ভ্যারিয়েবল।</strong>
      </p>

      <CodeBlock filename="Dockerfile">{`# 🟢 PRODUCTION PATTERN: build-time ARG vs runtime ENV, handled separately
FROM node:20-alpine AS builder
WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .

# 🟢 BUILD-TIME: NEXT_PUBLIC_ values must exist BEFORE 'npm run build' runs,
# because that is the moment they get inlined into the bundle.
ARG NEXT_PUBLIC_APP_URL
ARG NEXT_PUBLIC_STRIPE_KEY

ENV NEXT_PUBLIC_APP_URL=$NEXT_PUBLIC_APP_URL
ENV NEXT_PUBLIC_STRIPE_KEY=$NEXT_PUBLIC_STRIPE_KEY

RUN npm run build

# ── runner stage ────────────────────────────────────────────────
FROM node:20-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production

COPY --from=builder /app/public ./public
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static

# 🟢 RUNTIME: DATABASE_URL and other secrets are injected at 'docker run' time,
# never baked into the image.
CMD ["node", "server.js"]`}</CodeBlock>

      <p>
        <strong>Step 3 — বিল্ড ও রান কমান্ড।</strong>
      </p>

      <CodeBlock filename="terminal">{`# build-time values go in as --build-arg
docker build \\
  --build-arg NEXT_PUBLIC_APP_URL=https://app.example.com \\
  --build-arg NEXT_PUBLIC_STRIPE_KEY=pk_live_xxx \\
  -t my-next-app .

# runtime secrets go in at start-up, and can change on the next restart
docker run -d \\
  -e DATABASE_URL="postgresql://…" \\
  -e ENABLE_NEW_FEATURE=true \\
  -p 3000:3000 my-next-app`}</CodeBlock>

      {/* ── Matrix ────────────────────────────────────────────────────── */}
      <H2 id="matrix">৪. Build-time vs Runtime Variables</H2>

      <Table
        head={["বৈশিষ্ট্য", "Build-time variables", "Runtime variables"]}
        rows={[
          [
            "কখন মূল্যায়িত হয়",
            "npm run build চলার সময়",
            "রিকোয়েস্ট আসার মুহূর্তে",
          ],
          [
            "উদাহরণ",
            "NEXT_PUBLIC_*, SSG/ISR পেজের ডেটা",
            "Server Actions, route handlers, force-dynamic",
          ],
          [
            ".env বদলালে",
            "অবশ্যই rebuild করতে হবে 🔴",
            "কনটেইনার রিস্টার্ট দিলেই আপডেট 🟢",
          ],
          [
            "সিকিউরিটি",
            "ক্লায়েন্ট বান্ডেলে এক্সপোজড হওয়ার ঝুঁকি 🟡",
            "সার্ভার মেমরিতে সীমাবদ্ধ 🟢",
          ],
          [
            "Docker-এ পাসিং",
            "ARG + --build-arg",
            "docker run -e বা compose environment",
          ],
        ]}
      />

      <Line name="ভুলু ভাই">
        এখন আর জীবনেও ডকার কনটেইনারে আটকাব না ফাহিম! বুঝে গেছি — <code>NEXT_PUBLIC_</code> ভ্যারিয়েবল
        পাল্টাতে হলে ইমেজ রি-বিল্ড করতে হবে, কিন্তু রানটাইম সার্ভার ভ্যারিয়েবলগুলো রিস্টার্ট দিলেই নতুন
        ভ্যালু পেয়ে যাবে!
      </Line>

      {/* ── Takeaways ─────────────────────────────────────────────────── */}
      <H2 id="takeaway">Production Takeaways</H2>

      <Note>
        <ul>
          <li>
            <strong>NEXT_PUBLIC_ is always build-time:</strong> ব্রাউজারে ব্যবহারযোগ্য যেকোনো ভ্যারিয়েবল
            বিল্ড টাইমে ইনলাইন হয়ে যায় — কনটেইনার রিস্টার্ট দিয়ে এটি কখনো পরিবর্তন করা যাবে না।
          </li>
          <li>
            <strong>Force dynamic for live configs:</strong> যেসব রাউটে একদম লেটেস্ট এনভায়রনমেন্ট
            ভ্যালু প্রয়োজন, সেখানে <code>export const dynamic = &apos;force-dynamic&apos;</code> দিয়ে
            request-time evaluation নিশ্চিত করুন।
          </li>
          <li>
            <strong>Pass ARG in Docker builds:</strong> CI/CD পাইপলাইনে ক্লায়েন্ট ভ্যারিয়েবলগুলোর জন্য{" "}
            <code>docker build --build-arg</code> ব্যবহার নিশ্চিত করুন — নাহলে বান্ডেলে খালি স্ট্রিং
            ইনলাইন হয়ে যাবে।
          </li>
        </ul>
      </Note>
    </article>
  );
}
