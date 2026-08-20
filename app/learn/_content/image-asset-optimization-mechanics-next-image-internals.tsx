import { CodeBlock, Diagram, H2, Line, Note } from "@/components/learn/DocParts";
import type { Bi } from "@/lib/curriculum";

/** Section anchors — consumed by the "on this page" rail. */
export const headings: { id: string; label: Bi }[] = [
  {
    id: "the-problem",
    label: { bn: "লেআউট ধপাস করে নামছে", en: "The layout keeps jumping" },
  },
  {
    id: "how-it-works",
    label: { bn: "next/image ভেতরে কী করে", en: "What next/image does inside" },
  },
  {
    id: "priority",
    label: { bn: "priority — LCP ইমেজ", en: "priority — the LCP image" },
  },
  {
    id: "sizes-fill",
    label: { bn: "fill ও sizes দিয়ে রেসপন্সিভ", en: "Responsive with fill and sizes" },
  },
  {
    id: "blur",
    label: { bn: "Blur placeholder", en: "Blur placeholder" },
  },
  {
    id: "takeaway",
    label: { bn: "Production Takeaways", en: "Production takeaways" },
  },
];

export default function ImageOptimization() {
  return (
    <article className="doc-prose">
      {/* ── The problem ───────────────────────────────────────────────── */}
      <H2 id="the-problem" anchorOnly>
        লেআউট ধপাস করে নামছে
      </H2>

      <p>
        দুপুর বেলা। ভুলু ভাই ল্যাপটপের মনিটরে চোখ রেখে কপাল ঘষছেন। সাইট লোড হতে গিয়ে
        মূল ব্যানার ইমেজটা ধুপ করে নিচে নেমে পেজের লেআউট ভেঙে দিল!
      </p>

      <Line name="ভুলু ভাই">
        নেক্সট-ভাই, ইমেজ অপটিমাইজেশন নিয়ে আমি আর পারছি না! ক্লায়েন্ট থেকে ৫ মেগাবাইটের
        একটা ব্যানারের ছবি দিয়েছে। আমি ওটা স্বাভাবিক <code>&lt;img&gt;</code> ট্যাগ
        দিয়ে বসিয়েছি। এখন সাইট লোড হওয়ার সময় ছবিটা আস্তে আস্তে ওপর থেকে আসে, আর
        টেক্সটগুলো ধপাস করে নিচে লাফ দিয়ে নেমে পড়ে! Google Lighthouse আমাকে{" "}
        <strong>Cumulative Layout Shift (CLS)</strong> আর{" "}
        <strong>LCP (Largest Contentful Paint)</strong>-এ ফেল করিয়ে লাল কালিতে দাগ
        মেরে দিয়েছে!
      </Line>

      <Line name="নেক্সট-ভাই">
        (হেসে কফিতে চুমুক দিয়ে) ভুলু, তুই তো রিয়েল-ওয়ার্ল্ড ক্লায়েন্ট-সাইড ইউআই-এর
        সবচেয়ে জঘন্য প্রবলেম <strong>Layout Shift</strong>-এর মধ্যে পড়েছিস! ব্রাউজার
        যখন ইমেজের আসল সাইজ (Width &amp; Height) আগে থেকে জানে না, তখন সে ইমেজ লোড
        হওয়ার পর পেজের বাকি কন্টেন্টকে ধাক্কা দিয়ে নিচে নামিয়ে দেয়।
      </Line>

      <Line name="ভুলু ভাই">
        সেই জন্যই তো আমি{" "}
        <code>&lt;img src=&quot;…&quot; width={"{1200}"} height={"{600}"} /&gt;</code>{" "}
        বসিয়ে দিলাম! তাও দেখি মোবাইলে গেলে ছবি স্ক্রিন ভেঙে বাইরে চলে যায়! আবার সাইট
        স্লোই থেকে যায়!
      </Line>

      {/* ── How it works ──────────────────────────────────────────────── */}
      <H2 id="how-it-works">১. next/image ভেতরে আসলে কী করে</H2>

      <Line name="নেক্সট-ভাই">
        কারণ প্লেইন <code>&lt;img&gt;</code> ট্যাগ কোনো রেসপন্সিভ অপটিমাইজেশন, আধুনিক
        ফর্মেট রূপান্তর (WebP/AVIF), বা লেজি-লোডিং হ্যান্ডেল করে না! প্রোডাকশন-লেভেলে
        তোকে Next.js-এর ইন-বিল্ট <code>next/image</code>-এর ইন্টারনাল মেকানিজম বুঝতে
        হবে।
      </Line>

      <Diagram>{`[5MB PNG Banner] ---> [Next.js Image Optimizer Server / Edge]
                               │
            ├── Converts to Modern AVIF/WebP Format
            ├── Resizes dynamically based on user's device (\`sizes\`)
            └── Reserves Exact Layout Space (Zero Layout Shift / 0 CLS!)`}</Diagram>

      <Line name="ভুলু ভাই">
        <code>next/image</code> তো ব্যবহার করছিলাম ভাই, কিন্তু ওটার প্রপ্সগুলো (
        <code>fill</code>, <code>priority</code>, <code>sizes</code>,{" "}
        <code>placeholder</code>) নিয়ে আমি চরম কনফিউশনে আছি! কোনটা কখন দিব?
      </Line>

      <Line name="নেক্সট-ভাই">
        শোন! প্রোডাকশনে ইমেজ হ্যান্ডেল করার গোল্ডেন রুলগুলো মনে রাখবি।
      </Line>

      {/* ── priority ──────────────────────────────────────────────────── */}
      <H2 id="priority">২. Above-the-Fold বনাম Below-the-Fold</H2>

      <Line name="নেক্সট-ভাই">
        তোর পেজের একদম ওপরে যে ব্যানার বা হিরো ইমেজ থাকে (যা ইউজার ঢুকেই আগে দেখে),
        সেটার পারফর্মেন্স উন্নত করতে তোকে অবশ্যই <code>priority</code> প্রপ্স দিতে হবে!
      </Line>

      <CodeBlock filename="HeroBanner.tsx">{`// ✅ Hero Image / LCP Element (মাস্ট priority প্রপ দিতে হবে!)
<Image
  src="/hero-banner.jpg"
  alt="Hero Banner"
  width={1200}
  height={600}
  priority // ⚡ Browser-কে বলে দেয় এটা সবচেয়ে আগে ডাউনলোড করো (Preload)
/>`}</CodeBlock>

      <Line name="ভুলু ভাই">
        আর যদি পেজের নিচের দিকে ১০-১২টা প্রোডাক্ট ইমেজ থাকে?
      </Line>

      <Line name="নেক্সট-ভাই">
        সেগুলোতে খবরদার <code>priority</code> দিবি না! <code>next/image</code>{" "}
        বাই-ডিফল্ট সেগুলোকে Lazy Load করবে। অর্থাৎ ইউজার স্ক্রোল করে নিচে না যাওয়া
        পর্যন্ত ওই ছবিগুলোর জন্য ব্রাউজার একটা নেটওয়ার্ক রিকোয়েস্টও করবে না!
      </Line>

      <Note>
        <p>
          <code>priority</code> একটা দুর্লভ সম্পদ — পেজে সাধারণত{" "}
          <strong>একটাই</strong> LCP এলিমেন্ট থাকে। সব ছবিতে বসিয়ে দিলে কোনোটাই আর
          অগ্রাধিকার পায় না, ফলে উল্টো LCP খারাপ হয়।
        </p>
      </Note>

      {/* ── sizes & fill ──────────────────────────────────────────────── */}
      <H2 id="sizes-fill">৩. fill ও sizes দিয়ে রেসপন্সিভ ইমেজ</H2>

      <Line name="ভুলু ভাই">
        ভাই, ধর আমার ইমেজের ফিক্সড <code>width</code> আর <code>height</code> জানা নাই,
        ওটা কার্ডের প্যারেন্ট ডিভের (Parent Div) ওপর নির্ভর করে রেসপন্সিভ হবে। তখন কী
        করব?
      </Line>

      <Line name="নেক্সট-ভাই">
        তখন ব্যবহার করবি <code>fill</code> প্রপ্স, সাথে প্যারেন্ট ডিভে{" "}
        <code>position: relative</code> দিবি। তবে সবচেয়ে ইম্পর্টেন্ট হলো{" "}
        <code>sizes</code> প্রপ্স ব্যবহার করা! তুই যদি <code>sizes</code> না দিস,
        Next.js ধরে নেবে মোবাইল স্ক্রিনেও ইউজারের ডেস্কটপ সাইজের 4K ইমেজ দরকার, আর বিশাল
        ইমেজ ফাইল ডাউনলোড করাবে!
      </Line>

      <CodeBlock filename="ProductCard.tsx">{`// ✅ Responsive Card Image Architecture
<div className="relative w-full h-64">
  <Image
    src={product.imageUrl}
    alt={product.title}
    fill
    // ⚡ স্ক্রিন অনুযায়ী ছোট/বড় ফাইল পাঠাবে
    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
    className="object-cover"
  />
</div>`}</CodeBlock>

      {/* ── blur ──────────────────────────────────────────────────────── */}
      <H2 id="blur">৪. Blur Placeholder দিয়ে Zero Layout Shift</H2>

      <Line name="ভুলু ভাই">
        আচ্ছা নেক্সট-ভাই, নেটওয়ার্ক স্লো থাকলেও যাতে ইমেজ খালি না মনে হয় বা লেআউট না
        লাফায়, সেটার কোনো ট্রিক আছে?
      </Line>

      <Line name="নেক্সট-ভাই">
        অবশ্যই! তুই যদি লোকাল ইমেজ ব্যবহার করিস, <code>placeholder=&quot;blur&quot;</code>{" "}
        দিলে Next.js বিল্ড-টাইমেই খুব ছোট একটা ব্লার ইমেজ শ্যাডো বানিয়ে ফেলে, যা
        নেটওয়ার্ক স্লো হলেও ইনস্ট্যান্ট ইউআই তুলে ধরে।
      </Line>

      <CodeBlock filename="Hero.tsx">{`import heroImg from '@/public/hero.png';

// ✅ Seamless Blur Loading Effect
<Image src={heroImg} alt="Hero" placeholder="blur" />`}</CodeBlock>

      <Note>
        <p>
          স্ট্যাটিক ইমপোর্ট করলে Next.js বিল্ড টাইমেই ছবির width/height জেনে যায়, তাই
          তোকে হাতে দিতে হয় না — আর জায়গাটাও আগেই রিজার্ভ হয়ে যায়। রিমোট URL-এর
          ক্ষেত্রে সেটা সম্ভব না, তাই সেখানে <code>width</code>/<code>height</code> বা{" "}
          <code>fill</code> নিজে দিতে হয়, আর ব্লারের জন্য{" "}
          <code>blurDataURL</code> লাগে।
        </p>
      </Note>

      <Line name="ভুলু ভাই">
        (ল্যাপটপের স্ক্রিনে হিরো ব্যানার ঠিক করতে করতে) ওয়াও ভাই! আমি{" "}
        <code>priority</code> দেওয়াতে আর প্রপার <code>sizes</code> ডিফাইন করাতে আমার
        LCP টাইম ২.৮ সেকেন্ড থেকে কমে সোজা ৮০০ মিলি-সেকেন্ডে চলে আসলো! আর এক চুলও লেআউট
        শিফটিং (CLS) হচ্ছে না!
      </Line>

      <Line name="নেক্সট-ভাই">
        বিঙ্গো! ইমেজ হলো সাইটের ৭০% নেটওয়ার্ক ওয়েট। ইমেজ সঠিক সাইজে ও সঠিক স্ট্র্যাটেজিতে
        সার্ভ করতে পারলে তোর ফ্রন্টএন্ড হবে আল্ট্রা-ফাস্ট!
      </Line>

      {/* ── Takeaway ──────────────────────────────────────────────────── */}
      <H2 id="takeaway">💡 Production Frontend Takeaways</H2>

      <ul>
        <li>
          <strong>LCP Optimization:</strong> স্ক্রিনের উপরের মূল ছবিতে{" "}
          <code>priority</code> প্রপ্স ব্যবহার করলে ব্রাউজার সেটিকে হাই-প্রায়োরিটিতে
          প্রি-লোড করে।
        </li>
        <li>
          <strong>Responsive Control:</strong> <code>fill</code> প্রপ্স ব্যবহারের সময়
          অবশ্যই ব্রাউজার ভিউপোর্টের উপর ভিত্তি করে <code>sizes</code> ডিফাইন করা উচিত,
          নাহলে অতিরিক্ত ভারী ইমেজ ডাউনলোড হবে।
        </li>
        <li>
          <strong>Zero CLS:</strong> <code>next/image</code> ইমেজের অ্যাসপেক্ট রেশিও
          এবং স্পেস আগে থেকেই রিজার্ভ করে রাখে, ফলে র‍্যান্ডম ইউআই জাম্প বা কন্টেন্ট
          শিফটিং প্রতিরোধ করা সম্ভব হয়।
        </li>
      </ul>
    </article>
  );
}
