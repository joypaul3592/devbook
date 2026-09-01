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
      bn: "হাইপ দেখে সিদ্ধান্ত",
      en: "Deciding by hype",
    },
  },
  {
    id: "architecture",
    label: {
      bn: "ডিসিশন পাইপলাইন",
      en: "The decision pipeline",
    },
  },
  {
    id: "mechanisms",
    label: {
      bn: "৪টি ডিসিশন পিলার",
      en: "Four decision pillars",
    },
  },
  {
    id: "implementation",
    label: {
      bn: "একটি বাস্তব ADR",
      en: "A real ADR, end to end",
    },
  },
  {
    id: "matrix",
    label: { bn: "কোন কাঠামো কখন", en: "Which architecture, when" },
  },
  {
    id: "takeaway",
    label: { bn: "Production Takeaways", en: "Production takeaways" },
  },
];

export default function LargeApplicationArchitectureDecisionMaking() {
  return (
    <article className="doc-prose">
      {/* ── The problem ───────────────────────────────────────────────── */}
      <H2 id="the-problem" anchorOnly>
        হাইপ দেখে সিদ্ধান্ত
      </H2>

      <p>
        সন্ধ্যা ৬:০০। টিমের CTO ভুলু ভাইকে বললেন: &ldquo;আমাদের আপকামিং রিয়েল-টাইম অ্যানালিটিক্স
        প্ল্যাটফর্মে মিলিয়নের বেশি ইউজার থাকবে। মোনোরিপো দিয়ে এগোব নাকি আলাদা রিপোজিটরি?
        মাইক্রো-ফ্রন্টএন্ড লাগবে নাকি মডুলার মনোলিথ? ক্যাশিংয়ের জন্য Redis বসাব নাকি Next.js data
        cache?&rdquo; ভুলু ভাই কোনটা ছেড়ে কোনটা ধরবেন বুঝতে পারছেন না।
      </p>

      <Line name="ভুলু ভাই">
        ফাহিম! বড় অ্যাপের আর্কিটেকচার কীভাবে ঠিক করব? সোশ্যাল মিডিয়ায় একেকজন একেক হাইপ তোলে — কেউ
        বলে মাইক্রো-ফ্রন্টএন্ড ছাড়া এন্টারপ্রাইজ হয় না, কেউ বলে মোনোরিপোই সেরা!
      </Line>

      <Line name="ফাহিম">
        ভুলু ভাই! এন্টারপ্রাইজ আর্কিটেকচারে &ldquo;সেরা&rdquo; বলে কিছু নেই — সবই trade-off। হাইপ বা
        ব্যক্তিগত পছন্দের ভিত্তিতে বড় সিদ্ধান্ত নেওয়াই সবচেয়ে বড় আর্কিটেকচারাল পাপ। দরকার একটি
        পরিষ্কার <strong>Architecture Decision Record</strong> আর একটি সিস্টেমেটিক ইভালুয়েশন
        ফ্রেমওয়ার্ক।
      </Line>

      <Line name="নেক্সট-ভাই">
        একদম! আর সবচেয়ে গুরুত্বপূর্ণ প্রশ্নটা প্রযুক্তির নয় — টিমের। কত জন মানুষ, কতগুলো অ্যাপ, আর
        কত ঘন ঘন তারা একে অপরের পথে দাঁড়াচ্ছে। উত্তরটা সেখান থেকেই আসে।
      </Line>

      {/* ── Architecture ──────────────────────────────────────────────── */}
      <H2 id="architecture">১. Architecture Decision Pipeline</H2>

      <Diagram>{`┌─────────────────────────────────────────────────────────────────────────────┐
│                    ARCHITECTURE DECISION MAKING PIPELINE                    │
└─────────────────────────────────────────────────────────────────────────────┘

  [ identify the problem ]        ── what actually hurts today?
                 │
                 ▼
  [ evaluate options & trade-offs ] ── team size, speed, complexity, cost
                 │
                 ▼
  [ draft an ADR ]               ── context, options, decision, consequences
                 │
                 ▼
  [ team review ]                ── challenge the assumptions, not the author
                 │
                 ▼
  [ implement & enforce ]        ── lint rules, CI checks, codeowners
                 │
                 ▼
  [ periodic audit ]             ── revisit as the business scales

  a decision nobody wrote down is a decision the next hire will simply undo`}</Diagram>

      {/* ── Mechanisms ────────────────────────────────────────────────── */}
      <H2 id="mechanisms">২. কোর ডিসিশন পিলার</H2>

      <p>
        <strong>Architecture Decision Record:</strong> যেকোনো বড় পরিবর্তনের সিদ্ধান্ত একটি
        ভার্সন-কন্ট্রোলড markdown ফাইলে লিখুন। ছয় মাস পরে নতুন কেউ এলে সে জানবে সিদ্ধান্তটা কেন
        নেওয়া হয়েছিল — আর সবচেয়ে গুরুত্বপূর্ণ, কোন বিকল্পগুলো <em>বাদ</em> দেওয়া হয়েছিল, কেন।
      </p>

      <p>
        <strong>Modular monolith first:</strong> শুরুতেই মাইক্রো-ফ্রন্টএন্ড যোগ করা
        ওভার-ইঞ্জিনিয়ারিং। আগে একটি কোডবেজে কড়া feature boundary দিয়ে মডুলার মনোলিথ বানান। টিম ও
        সিস্টেম সত্যিই বিশাল না হওয়া পর্যন্ত সেখানেই থাকুন — বাউন্ডারি ঠিক থাকলে পরে ভাগ করা সহজ,
        উল্টোটা নয়।
      </p>

      <p>
        <strong>Monorepo when you have many apps:</strong> একাধিক অ্যাপ (admin, customer, partner)
        আর শেয়ার্ড প্যাকেজ (ডিজাইন সিস্টেম, utils) থাকলে Turborepo বা Nx বেছে নিন। একটিমাত্র অ্যাপের
        জন্য মোনোরিপো নিছক বাড়তি জটিলতা।
      </p>

      <p>
        <strong>Trade-offs over trends:</strong> যেকোনো প্রযুক্তি গ্রহণের আগে তিনটি প্রশ্ন — এটি কি
        ডেভেলপমেন্ট স্পিড বাড়াবে? প্রোডাকশন পারফরম্যান্স উন্নত করবে? আর কতটা স্থায়ী জটিলতা যোগ
        করবে? তৃতীয় প্রশ্নের উত্তর সাধারণত সবচেয়ে কম আলোচিত, অথচ সবচেয়ে ব্যয়বহুল।
      </p>

      {/* ── Implementation ────────────────────────────────────────────── */}
      <H2 id="implementation">৩. একটি বাস্তব ADR</H2>

      <H3>🟢 Production pattern — স্ট্যান্ডার্ড ADR টেমপ্লেট</H3>

      <CodeBlock
        label="Markdown"
        filename="docs/adr/0004-adopt-turborepo-monorepo.md"
      >{`# ADR 0004: Adopting Turborepo for the monorepo

- Status:   Approved
- Deciders: Salehin (frontend architect), Fahim (tech lead)
- Date:     2026-09-02

## Context and problem statement

The platform is now three Next.js applications:

1. Main web portal   (apps/web)
2. Admin dashboard   (apps/admin)
3. Partner portal    (apps/partner)

UI components, API interface types and Tailwind configuration are duplicated
across three repositories. The copies have drifted, and two releases in the last
quarter shipped with mismatched button and form styling.

## Decision drivers

- One shared design system, consumed identically by all three apps
- End-to-end type safety across shared backend contracts
- CI that does not rebuild applications no source change could have touched

## Considered options

1. Polyrepo with private npm packages
2. Turborepo monorepo
3. Nx workspace

## Decision outcome

Chosen: option 2, Turborepo.

Option 1 keeps repositories independent, but a design system change would need
a publish, three version bumps and three PRs — the drift we are trying to fix.
Option 3 is more capable than option 2, but its generators and plugin model are
more machinery than three Next.js apps need today.

### Positive consequences

- Code sharing through workspace symlinks, with no publish step
- Remote build caching cuts pipeline time substantially
- One design system, enforced by the fact that there is only one copy

### Negative consequences

- Onboarding now includes understanding the workspace dependency graph
- The repository is larger to clone
- A bad change to a shared package can break all three apps at once,
  so shared packages need stricter review than app code

## Compliance

- Task graph defined in turbo.json
- Feature boundary violations fail the PR check (see ADR 0003)

## Revisit when

Any app needs an independent release cadence, or the team passes roughly
thirty engineers — whichever comes first.`}</CodeBlock>

      <p>
        লক্ষ করুন <em>negative consequences</em> আর <em>revisit when</em> — একটি ADR-এর সবচেয়ে
        মূল্যবান অংশ এই দুটোই। যে ডকুমেন্টে কেবল সুবিধার তালিকা থাকে, সেটি সিদ্ধান্ত নয়, বিজ্ঞাপন।
      </p>

      <CodeBlock label="JSON" filename="turbo.json">{`{
  "$schema": "https://turbo.build/schema.json",
  "tasks": {
    "build": {
      // 🟢 an app builds only after the packages it depends on
      "dependsOn": ["^build"],
      "outputs": [".next/**", "!.next/cache/**", "dist/**"]
    },
    "lint": {},
    "test": {
      "dependsOn": ["^build"]
    },
    "dev": {
      "cache": false,
      "persistent": true
    }
  }
}`}</CodeBlock>

      {/* ── Matrix ────────────────────────────────────────────────────── */}
      <H2 id="matrix">৪. Architecture Strategy Matrix</H2>

      <Table
        head={["অ্যাপ্রোচ", "কখন উপযুক্ত", "সুবিধা", "ট্রেড-অফ"]}
        rows={[
          [
            "Modular monolith",
            "একটি প্রোডাক্ট, ছোট থেকে মাঝারি টিম",
            "সহজ নেভিগেশন, দ্রুত ডেপ্লয় 🟢",
            "টিম বড় হলে বিল্ড টাইম বাড়ে",
          ],
          [
            "Monorepo (Turborepo)",
            "একাধিক অ্যাপ + শেয়ার্ড ডিজাইন সিস্টেম 🟢",
            "কোড শেয়ারিং, টাইপ সেফটি, ক্যাশড বিল্ড",
            "ওয়ার্কস্পেস শেখার খরচ",
          ],
          [
            "Micro-frontends",
            "বহু স্বাধীন টিম, আলাদা রিলিজ সাইকেল",
            "টিম সম্পূর্ণ স্বাধীনভাবে ডেপ্লয় করে",
            "নেটওয়ার্ক ওভারহেড, ফ্র্যাগমেন্টেশন 🔴",
          ],
          [
            "Edge vs serverless",
            "জিও-ডিস্ট্রিবিউটেড ডায়নামিক রেন্ডারিং",
            "কম latency, স্কেলেবিলিটি 🟢",
            "কোল্ড স্টার্ট, DB pooling চ্যালেঞ্জ",
          ],
        ]}
      />

      <Line name="ভুলু ভাই">
        ফ্যান্টাস্টিক ফাহিম! এখন পুরো ব্যাপারটা পরিষ্কার। হাইপ দেখে ঝাঁপ না দিয়ে আগে ADR লিখে
        trade-off বিশ্লেষণ করব, আর প্রজেক্টের বর্তমান স্কেল অনুযায়ী মডুলার মোনোরিপোই বেছে নেব।
      </Line>

      <Line name="নেক্সট-ভাই">
        অভিনন্দন ভুলু ভাই! স্কেলেবল Next.js আর্কিটেকচার অধ্যায়ের সবগুলো টপিক সম্পন্ন হলো — আপনি এখন
        যেকোনো এন্টারপ্রাইজ প্রজেক্টের কাঠামো ডিজাইন করতে প্রস্তুত।
      </Line>

      {/* ── Takeaways ─────────────────────────────────────────────────── */}
      <H2 id="takeaway">Production Takeaways</H2>

      <Note>
        <ul>
          <li>
            <strong>Write the ADR before the code:</strong> বড় পরিবর্তনের আগে ADR ড্রাফট করুন — আর
            বাদ দেওয়া বিকল্পগুলো কেন বাদ পড়ল, সেটাও লিখুন।
          </li>
          <li>
            <strong>Modular monolith first:</strong> আগেভাগেই মাইক্রো-ফ্রন্টএন্ডের জটিলতায় যাবেন
            না। কড়া বাউন্ডারিসহ মনোলিথ দিয়ে শুরু করুন — পরে ভাগ করা তখন সহজ।
          </li>
          <li>
            <strong>Decide with metrics:</strong> LCP, bundle size, CI build time — সংখ্যা দিয়ে
            সিদ্ধান্তের সাফল্য মাপুন, অনুমান দিয়ে নয়।
          </li>
        </ul>
      </Note>
    </article>
  );
}
