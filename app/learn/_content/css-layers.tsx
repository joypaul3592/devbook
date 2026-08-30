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
    label: { bn: "Specificity war ও !important", en: "Specificity wars & !important" },
  },
  {
    id: "architecture",
    label: { bn: "Layer priority order", en: "Layer priority order" },
  },
  {
    id: "mechanisms",
    label: { bn: "৩টি আর্কিটেকচারাল কনসেপ্ট", en: "Three architectural concepts" },
  },
  {
    id: "implementation",
    label: { bn: "@layer দিয়ে ক্লিন ক্যাসকেড", en: "A clean cascade with @layer" },
  },
  {
    id: "matrix",
    label: { bn: "Traditional vs @layer", en: "Traditional vs @layer" },
  },
  {
    id: "takeaway",
    label: { bn: "Production Takeaways", en: "Production takeaways" },
  },
];

export default function CssLayers() {
  return (
    <article className="doc-prose">
      {/* ── The problem ───────────────────────────────────────────────── */}
      <H2 id="the-problem" anchorOnly>
        Specificity war ও !important
      </H2>

      <p>
        দুপুর ১২:১০। ভুলু ভাই একটি বাটনের স্টাইল বদলাতে <code>!important</code> বসিয়েছেন, কিন্তু আগের
        সপ্তাহে আরেক ডেভেলপার <code>div.container &gt; form .btn.primary</code> ধরনের চার স্তরের ভারী
        সিলেক্টর লিখে রেখেছিলেন — ফলে তার স্টাইল কাজই করছে না।
      </p>

      <Line name="ভুলু ভাই">
        ফাহিম! CSS specificity নিয়ে বেঁচে থাকাই কঠিন হয়ে পড়েছে! সিলেক্টর বড় করতে করতে এখন{" "}
        <code>body div#app .wrapper button.btn.primary</code> লিখতে হচ্ছে, নয়তো বাধ্য হয়ে{" "}
        <code>!important</code>। এর চেয়ে ক্লিন কোনো আধুনিক সমাধান নেই?
      </Line>

      <Line name="ফাহিম">
        ভুলু ভাই! আধুনিকতম সমাধান হলো CSS Cascade Layers (<code>@layer</code>)। এতদিন অগ্রাধিকার নির্ভর
        করত সিলেক্টরের আইডি/ক্লাস/এলিমেন্টের গণিতের ওপর; <code>@layer</code> আসার পর সিলেক্টর কত ভারী
        তা নিয়ে মারামারি করতে হয় না — আপনি লেয়ার ডিফাইন করে দিলেই ব্রাউজার জানে কোন লেয়ার জিতবে।
      </Line>

      <Line name="নেক্সট-ভাই">
        একদম! Tailwind-এর ব্যাকবোনই এই <code>@layer base</code>, <code>@layer components</code>,{" "}
        <code>@layer utilities</code>। আজ শিখব কীভাবে নেটিভ <code>@layer</code> দিয়ে specificity war
        চিরতরে বন্ধ করা যায়।
      </Line>

      {/* ── Architecture ──────────────────────────────────────────────── */}
      <H2 id="architecture">১. How CSS Layers Control the Cascade</H2>

      <Diagram>{`┌─────────────────────────────────────────────────────────────────────────┐
│                     CSS CASCADE LAYERS PRIORITY ORDER                   │
└─────────────────────────────────────────────────────────────────────────┘

 lowest priority                                          highest priority
 ┌─────────────┐   ┌───────────────┐   ┌──────────────────┐   ┌────────────────┐
 │ @layer reset│──►│ @layer base   │──►│ @layer components│──►│@layer utilities│
 └─────────────┘   └───────────────┘   └──────────────────┘   └────────────────┘
  (resets/norms)    (element rules)     (buttons, cards)        (overrides)

 💡 RULE: a higher layer ALWAYS wins, regardless of selector complexity.
    A plain .btn in @layer utilities beats body #app .btn in @layer base.`}</Diagram>

      {/* ── Mechanisms ────────────────────────────────────────────────── */}
      <H2 id="mechanisms">২. কোর আর্কিটেকচারাল কনসেপ্ট</H2>

      <p>
        <strong>Specificity override order:</strong> উঁচু লেয়ারের স্টাইল ডিফল্টভাবেই নিচু লেয়ারের
        স্টাইলকে ওভাররাইড করে — এমনকি নিচের লেয়ারের সিলেক্টর আইডি বা একাধিক ক্লাস দিয়ে ভারী হলেও।
      </p>

      <p>
        <strong>Explicit layer declaration order:</strong> ফাইলের একদম ওপরে{" "}
        <code>@layer reset, base, components, utilities;</code> লিখে অর্ডার ডিফাইন করে দিলে নিচে কোড যে
        ক্রমেই লেখা হোক, ক্যাসকেড অর্ডার অপরিবর্তিত থাকে।
      </p>

      <p>
        <strong>Unlayered styles priority:</strong> যেসব স্টাইল কোনো <code>@layer</code>-এর ভেতরে নেই,
        ব্রাউজার সেগুলোকে সব লেয়ারের চেয়ে বেশি অগ্রাধিকার দেয় — তাই লিগ্যাসি CSS মাইগ্রেট করার সময় এটি
        মাথায় রাখতে হয়।
      </p>

      {/* ── Implementation ────────────────────────────────────────────── */}
      <H2 id="implementation">৩. Production Code Implementation</H2>

      <H3>❌ Anti-pattern — selector wars and !important abuse</H3>

      <CodeBlock filename="app/legacy.css">{`/* 🔴 POOR PRACTICE: the specificity war forces ever-longer selectors */

button.btn {
  background-color: #3b82f6;
  padding: 10px 20px;
  border-radius: 4px;
}

/* a heavier selector, just to win */
div.container form.user-form button.btn {
  background-color: #10b981;
}

/* the frustrated developer reaches for !important */
.text-danger {
  color: #ef4444 !important; /* ❌ destroys the cascade architecture */
}`}</CodeBlock>

      <H3>🟢 Production pattern — an explicit cascade with @layer</H3>

      <CodeBlock filename="app/globals.css">{`/* 🟢 1. declare the layer order, lowest to highest priority */
@layer reset, base, components, utilities;

/* -------------------------------------------------- */
/* LAYER 1: RESET (lowest priority)                   */
/* -------------------------------------------------- */
@layer reset {
  *,
  *::before,
  *::after {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
  }
}

/* -------------------------------------------------- */
/* LAYER 2: BASE (element defaults)                   */
/* -------------------------------------------------- */
@layer base {
  /* even this heavy selector loses to a plain class in a higher layer */
  body #app div.main-container button {
    font-family: inherit;
    background-color: #94a3b8;
    border: none;
    cursor: pointer;
  }

  h1,
  h2,
  h3 {
    color: #0f172a;
  }
}

/* -------------------------------------------------- */
/* LAYER 3: COMPONENTS (reusable UI)                  */
/* -------------------------------------------------- */
@layer components {
  /* 🟢 this simple class beats the heavy selector in the base layer */
  .btn-primary {
    background-color: #2563eb;
    color: #ffffff;
    padding: 0.5rem 1rem;
    border-radius: 0.375rem;
  }

  .card {
    background-color: #ffffff;
    border: 1px solid #e2e8f0;
    border-radius: 0.5rem;
    padding: 1.5rem;
  }
}

/* -------------------------------------------------- */
/* LAYER 4: UTILITIES (highest priority)              */
/* -------------------------------------------------- */
@layer utilities {
  /* 🟢 a single utility overrides component and base styles — no !important */
  .bg-danger {
    background-color: #dc2626;
  }

  .hidden {
    display: none;
  }
}`}</CodeBlock>

      <CodeBlock filename="app/page.tsx">{`export default function LayersDemoPage() {
  return (
    <main className="p-8 space-y-4">
      <h1 className="text-2xl font-bold">CSS Layers Demo</h1>

      {/*
        This button takes .btn-primary from the components layer and
        .bg-danger from the utilities layer.
        Result: the background is red (#dc2626) — with no !important.
      */}
      <button className="btn-primary bg-danger">Danger action</button>
    </main>
  );
}`}</CodeBlock>

      {/* ── Matrix ────────────────────────────────────────────────────── */}
      <H2 id="matrix">৪. Traditional CSS vs. CSS @layer</H2>

      <Table
        head={["বৈশিষ্ট্য", "Traditional specificity", "Native @layer"]}
        rows={[
          [
            "Priority determinant",
            "সিলেক্টরের ওজন (id, class, tag) 🔴",
            "ডিফাইন করা লেয়ার অর্ডার 🟢",
          ],
          [
            "Override mechanism",
            <span key="c">
              বড় সিলেক্টর বা <code>!important</code> 🔴
            </span>,
            "উঁচু লেয়ারের সিঙ্গেল ক্লাস 🟢",
          ],
          [
            "Architecture scaling",
            "কোড বাড়লেই জট লেগে যায় 🔴",
            "গ্লোবাল ও মডিউল স্টাইল ক্লিন থাকে 🟢",
          ],
          [
            "Third-party integration",
            "লাইব্রেরির স্টাইল ওভাররাইড কঠিন 🔴",
            "লেয়ারে র‍্যাপ করে স্যান্ডবক্স করা যায় 🟢",
          ],
        ]}
      />

      <Line name="ভুলু ভাই">
        অসাম ফাহিম! <code>@layer</code> ব্যবহার করায় আর চার লেভেলের ভারী সিলেক্টর লিখতে হচ্ছে না —
        একটা সিম্পল ইউটিলিটি ক্লাস দিয়েই base ও components লেয়ারের স্টাইল ওভাররাইড হয়ে যাচ্ছে, কোনো{" "}
        <code>!important</code> ছাড়াই।
      </Line>

      {/* ── Takeaways ─────────────────────────────────────────────────── */}
      <H2 id="takeaway">Production Takeaways</H2>

      <Note>
        <ul>
          <li>
            <strong>Declare the order at the top:</strong> CSS ফাইলের শুরুতেই{" "}
            <code>@layer reset, base, components, utilities;</code> লিখে অর্ডার ঠিক করে নিন।
          </li>
          <li>
            <strong>Never use !important for overrides:</strong> ক্যাসকেড লেয়ার থাকলে{" "}
            <code>!important</code>-এর দরকারই পড়ে না — প্রয়োজনীয় ওভাররাইড <code>utilities</code>{" "}
            লেয়ারে রাখুন।
          </li>
          <li>
            <strong>Wrap third-party CSS in a layer:</strong>{" "}
            <code>@import &quot;library.css&quot; layer(third-party);</code> লিখলে আপনার কাস্টম লেয়ার
            সহজেই লাইব্রেরির স্টাইল ওভাররাইড করতে পারে।
          </li>
        </ul>
      </Note>
    </article>
  );
}
