import { CodeBlock, Diagram, H2, Line, Note } from "@/components/learn/DocParts";
import type { Bi } from "@/lib/curriculum";

/** Section anchors — consumed by the "on this page" rail. */
export const headings: { id: string; label: Bi }[] = [
  {
    id: "the-problem",
    label: { bn: "এক প্রোডাক্ট, পাঁচ পেজ", en: "One product, five pages" },
  },
  {
    id: "tag-idea",
    label: { bn: "ট্যাগের আইডিয়া", en: "The idea behind tags" },
  },
  {
    id: "cachetag",
    label: { bn: "cacheTag() দিয়ে ট্যাগ লাগানো", en: "Attaching tags with cacheTag()" },
  },
  {
    id: "server-action",
    label: { bn: "Server Action-এ সার্জিক্যাল পার্জ", en: "Surgical purge in a Server Action" },
  },
  {
    id: "tag-layers",
    label: { bn: "ট্যাগের তিন স্তর", en: "Three layers of tags" },
  },
  {
    id: "takeaway",
    label: { bn: "Production Takeaways", en: "Production takeaways" },
  },
];

export default function TagBasedInvalidation() {
  return (
    <article className="doc-prose">
      {/* ── The problem ───────────────────────────────────────────────── */}
      <H2 id="the-problem" anchorOnly>
        এক প্রোডাক্ট, পাঁচ পেজ
      </H2>

      <p>
        দুপুর গড়াল। ভুলু ভাই ল্যাপটপে তাঁর তৈরি ই-কমার্স প্ল্যাটফর্মের অ্যাডমিন প্যানেল আর
        ফ্রন্টএন্ড শপ পেজ পাশাপাশি খুলে গভীর চিন্তায় মগ্ন।
      </p>

      <Line name="ভুলু ভাই">
        নেক্সট-ভাই! আমি একটা বিশাল আর্কিটেকচারাল ঝামেলার মধ্যে পড়েছি। আমার ই-কমার্স সাইটে
        একটা প্রোডাক্ট (ধরো: &ldquo;M1 MacMini&rdquo;) একই সাথে কয়েক জায়গায় দেখায় — মূল{" "}
        <code>/products/m1-macmini</code> পেজে, হোমপেজের Featured Section-এ, ক্যাটাগরি
        পেজ <code>/category/electronics</code>-এ, এমনকি সার্চ বা ফিল্টারিং লিস্টের
        ভেতরেও!
      </Line>

      <Line name="ভুলু ভাই">
        এখন অ্যাডমিন প্যানেল থেকে যখন কেউ ওই প্রোডাক্টের দাম বা স্টক আপডেট করে, আমি যদি{" "}
        <code>revalidatePath()</code> ব্যবহার করি — তবে কি আমাকে চার-পাঁচটা পেজের প্যাথ
        ধরে ধরে আলাদা করে রিভ্যালিডেট করতে হবে?! আর নতুন কোনো জায়গায় ওই প্রোডাক্ট দেখালে
        সেখানেও প্যাথ যোগ করতে যেতে হবে?! এটা তো কোড মেইনটেইন করা অসম্ভব করে তুলবে!
      </Line>

      <Line name="নেক্সট-ভাই">
        (হেসে কফিতে চুমুক দিয়ে) একদম ঠিক ধরেছিস ভুলু! প্যাথ-বেসড রিভ্যালিডেশন (
        <code>revalidatePath</code>) হলো খুবই শ্যালো বা এক-মাত্রিক টেকনিক। পুরো
        এন্টারপ্রাইজ সিস্টেমে যেখানে ডাটা রিলেশনাল — একই ডাটা একাধিক ভিউ বা পেজে ছড়ানো —
        সেখানে প্যাথ ধরে ক্লিয়ার করা একটা জঘন্য আর্কিটেকচারাল অ্যান্টি-প্যাটার্ন! এর
        একমাত্র এন্টারপ্রাইজ সলিউশন হলো{" "}
        <strong>Tag-based Cache Invalidation Architecture</strong>।
      </Line>

      <Diagram>{`                    ┌──────────────────────────────┐
                    │      Product Data Source     │
                    │   Tags: ['product-101',      │
                    │          'category-tech',    │
                    │          'brand-apple']      │
                    └──────────────┬───────────────┘
                                   │
         ┌─────────────────────────┼─────────────────────────┐
         ▼                         ▼                         ▼
[/products/m1-macmini]     [/category/tech]             [Home Featured]
  (Subscribed to Tag)     (Subscribed to Tag)        (Subscribed to Tag)
         │                         │                         │
         └─────────────────────────┼─────────────────────────┘
                                   │
                                   ▼
          revalidateTag('product-101') Called from Server Action
                                   │
                                   ▼ ⚡
            SURGICAL PURGE: All 3 UI Views Invalidate Instantly!`}</Diagram>

      {/* ── Tag idea ──────────────────────────────────────────────────── */}
      <H2 id="tag-idea">১. ট্যাগের আইডিয়া</H2>

      <Line name="ভুলু ভাই">
        (চোখ বড় বড় করে) ট্যাগের আইডিয়াটা কী ভাই?! একটু খোলসা করে বলো তো!
      </Line>

      <Line name="নেক্সট-ভাই">
        আইডিয়াটা খুব সিম্পল! তুই যখন কোনো ডাটা ফেচ করবি বা ক্যাশ করবি, তখন প্যাথ নিয়ে
        চিন্তা না করে ওই ডাটার গায়ে ১টা বা একাধিক পাবলিশ-সাবস্ক্রাইব লেবেল (Tag) লাগিয়ে
        দিবি। যেমন ম্যাকমিনির ডাটা ফেচ করার সময় ট্যাগ লাগালি —{" "}
        <code>product-101</code> (নির্দিষ্ট প্রোডাক্ট), <code>category-electronics</code>{" "}
        (ক্যাটাগরি), <code>brand-apple</code> (ব্র্যান্ড)।
      </Line>

      <Line name="নেক্সট-ভাই">
        এখন সাইটের ৫০টা পেজেও যদি এই ডাটা ব্যবহার হয়, তোর কিচ্ছু যায় আসে না! অ্যাডমিন
        প্যানেল থেকে যখন ম্যাকমিনি আপডেট হবে, তুই জাস্ট ডাকবি{" "}
        <code>revalidateTag(&apos;product-101&apos;)</code>! মুহূর্তের মধ্যে পুরো
        অ্যাপ্লিকেশনের যেখানে যেখানে <code>product-101</code> ট্যাগযুক্ত ক্যাশড ডাটা ছিল,
        সার্জিক্যাল নিখুঁততায় শুধু সেই ডাটাটুকু মুছে ফ্রেশ হয়ে যাবে!
      </Line>

      {/* ── cacheTag ──────────────────────────────────────────────────── */}
      <H2 id="cachetag">২. cacheTag() দিয়ে ট্যাগ লাগানো</H2>

      <Line name="ভুলু ভাই">
        (উত্তেজিত হয়ে) ওয়াও ভাই! তারমানে প্যাথ যেখানেই হোক, ট্যাগ মিললেই ক্যাশ পার্জ হয়ে
        যাবে! কিন্তু Next.js 16-এর নতুন <code>&apos;use cache&apos;</code>{" "}
        আর্কিটেকচারে এই ট্যাগিং কীভাবে লেখে?
      </Line>

      <Line name="নেক্সট-ভাই">
        Next.js 16-এর Dynamic I/O আর <code>&apos;use cache&apos;</code>-এর সাথে তোকে
        ব্যবহার করতে হবে <code>cacheTag()</code> হেলপার:
      </Line>

      <CodeBlock filename="lib/data-access/products.ts">{`import { cacheLife, cacheTag } from 'next/cache';

export async function getProductBySlug(slug: string) {
  'use cache';

  // ১. ক্যাশ লাইফ সেট করা
  cacheLife('days');

  const product = await db.product.findUnique({ where: { slug } });

  if (product) {
    // ⚡ গ্র্যানুলার সার্জিক্যাল ট্যাগ অ্যাটাচ করা
    cacheTag(
      'products',                      // গ্লোবাল ট্যাগ
      \`product-\${product.id}\`,         // স্পেসিফিক আইডি ট্যাগ
      \`category-\${product.categoryId}\` // রিলেশনাল ক্যাটাগরি ট্যাগ
    );
  }

  return product;
}`}</CodeBlock>

      {/* ── Server Action ─────────────────────────────────────────────── */}
      <H2 id="server-action">৩. Server Action-এ সার্জিক্যাল পার্জ</H2>

      <Line name="নেক্সট-ভাই">
        এখন তোর অ্যাডমিন প্যানেলে যখন প্রোডাক্টের প্রাইস চেঞ্জ হবে, তুই শুধু নির্দিষ্ট ট্যাগ
        ট্রিগার করবি:
      </Line>

      <CodeBlock filename="app/actions/product-actions.ts">{`'use server'

import { revalidateTag } from 'next/cache';

export async function updateProductPrice(productId: string, newPrice: number) {
  // ১. ডাটাবেজে মিউটেশন
  await db.product.update({
    where: { id: productId },
    data: { price: newPrice }
  });

  // ⚡ সার্জিক্যাল ইনভ্যালিডেশন: শুধু এই প্রোডাক্টের ক্যাশ ফ্ল্যাশ হবে!
  revalidateTag(\`product-\${productId}\`);
}`}</CodeBlock>

      {/* ── Tag layers ────────────────────────────────────────────────── */}
      <H2 id="tag-layers">৪. ট্যাগের তিন স্তর</H2>

      <Line name="ভুলু ভাই">
        (চিন্তা করে) নেক্সট-ভাই! আরেকটা সিনারিও চিন্তা করো — ধরো কোনো দোকানদার নতুন একটা
        প্রোডাক্ট অ্যাড করল, অথবা অ্যাপল ব্র্যান্ডের সব প্রোডাক্টে ১০% ডিসকাউন্ট দিল! তখন
        আমি কীভাবে ইনভ্যালিডেট করব?
      </Line>

      <Line name="নেক্সট-ভাই">
        ট্যাগ আর্কিটেকচারের বিউটিই এখানে! নতুন প্রোডাক্ট অ্যাড হলে ক্যাটাগরি পেজে সেটা
        দেখানোর জন্য ডাকবি ➔ <code>revalidateTag(&apos;category-tech&apos;)</code>। আর
        পুরো অ্যাপল ব্র্যান্ডের ডিসকাউন্ট চেঞ্জ হলে অ্যাপলের সব প্রোডাক্ট এক ক্লিকে
        রিফ্রেশ করতে ডাকবি ➔ <code>revalidateTag(&apos;brand-apple&apos;)</code>।
      </Line>

      <Line name="ভুলু ভাই">(খাতায় এঁকে) অসাম! তারমানে:</Line>

      <ul>
        <li>
          <code>product-$&#123;id&#125;</code>: আইডি-বেসড অ্যাটমিক ট্যাগ।
        </li>
        <li>
          <code>category-$&#123;id&#125;</code>: গ্রুপ বা ক্যাটাগরি ট্যাগ।
        </li>
        <li>
          <code>products</code>: গ্লোবাল মাস্টার ট্যাগ (পুরো ই-কমার্সের সব প্রোডাক্ট
          একবারে ক্লিয়ার করার জন্য)।
        </li>
      </ul>

      <Note>
        <p>
          গ্লোবাল মাস্টার ট্যাগটা রাখা দরকার, কিন্তু ডাকা দরকার খুব কম — ওটা মারা মানে
          পুরো ক্যাটালগের ক্যাশ একসাথে উড়ে যাওয়া, আর তার পরের রিকোয়েস্টগুলো সরাসরি
          ডাটাবেজে গিয়ে পড়া।
        </p>
      </Note>

      <Line name="নেক্সট-ভাই">
        পারফেক্ট! প্যাথ আর্কিটেকচার হলো পেজ-ডিপেন্ডেন্ট, আর ট্যাগ আর্কিটেকচার হলো{" "}
        <strong>Data-Driven &amp; Domain-Centric</strong>। এন্টারপ্রাইজ সিস্টেমে
        ট্যাগ-বেসড ইনভ্যালিডেশন ব্যবহার করলে ক্যাশ পারফরম্যান্স থাকে সর্বোচ্চ, অথচ স্টেল
        ডাটার ১% ঝুঁকিও থাকে না!
      </Line>

      {/* ── Takeaway ──────────────────────────────────────────────────── */}
      <H2 id="takeaway">💡 Production Engineering Takeaways</H2>

      <ul>
        <li>
          <strong>Domain-Centric Invalidation:</strong> <code>revalidatePath</code>-এর ওপর
          নির্ভর না করে ডাটা মডেল অনুযায়ী <code>cacheTag</code> ব্যবহার করা এন্টারপ্রাইজ
          আর্কিটেকচারের প্রধান শর্ত।
        </li>
        <li>
          <strong>Multi-Layered Tagging:</strong> প্রতিটা ক্যাশড ডাটার সাথে Primary ID,
          Group/Relational ID, আর Global Type ID — তিন স্তরের ট্যাগ অ্যাটাচ করা উচিত।
        </li>
        <li>
          <strong>Surgical Precision:</strong> <code>revalidateTag()</code> শুধুমাত্র ওই
          নির্দিষ্ট ট্যাগের আন্ডারে থাকা ক্যাশ ইনভ্যালিডেট করে, বাকি অ্যাপ্লিকেশনের ক্যাশ
          অক্ষত রেখে সার্ভার ওভারহেড কমায়।
        </li>
      </ul>
    </article>
  );
}
