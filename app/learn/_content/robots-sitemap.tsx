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
    label: { bn: "অ্যাডমিন পেজ ইনডেক্সড", en: "The admin page got indexed" },
  },
  {
    id: "architecture",
    label: { bn: "Crawler discovery flow", en: "The crawler discovery flow" },
  },
  {
    id: "mechanisms",
    label: { bn: "৩টি আর্কিটেকচারাল কনসেপ্ট", en: "Three architectural concepts" },
  },
  {
    id: "implementation",
    label: { bn: "robots.ts ও sitemap.ts", en: "robots.ts & sitemap.ts" },
  },
  {
    id: "matrix",
    label: { bn: "Robots vs Sitemap", en: "Robots vs sitemap" },
  },
  {
    id: "takeaway",
    label: { bn: "Production Takeaways", en: "Production takeaways" },
  },
];

export default function RobotsSitemap() {
  return (
    <article className="doc-prose">
      {/* ── The problem ───────────────────────────────────────────────── */}
      <H2 id="the-problem" anchorOnly>
        অ্যাডমিন পেজ ইনডেক্সড
      </H2>

      <p>
        রাত ১২:১৫। ভুলু ভাইয়ের প্ল্যাটফর্মে প্রতিদিন ৫০টি নতুন ব্লগ পোস্ট আর ১০০টি প্রোডাক্ট আপডেট
        হচ্ছে, কিন্তু নতুন পেজগুলো ইনডেক্সই হচ্ছে না — অথচ হিডেন <code>/admin/dashboard</code> সার্চ
        রেজাল্টে শো করছে।
      </p>

      <Line name="ভুলু ভাই">
        ফাহিম! গুগল আমার সিক্রেট অ্যাডমিন পেজ ক্রল করে ফেলে কীভাবে? আর যে পেজগুলো ইনডেক্স হওয়া দরকার,
        সেগুলো ক্রলার খুঁজেই পাচ্ছে না কেন?
      </Line>

      <Line name="ফাহিম">
        ভুলু ভাই! ক্রলার নিয়ন্ত্রণে দুটি গেটওয়ে আছে — <code>robots.txt</code> সাইটের গার্ড, যা বলে
        কোথায় প্রবেশ নিষেধ; আর <code>sitemap.xml</code> সাইটের নেভিগেশন ম্যাপ, যা গুরুত্বপূর্ণ ও আপডেট
        হওয়া URL-এর তালিকা দেয়।
      </Line>

      <Line name="নেক্সট-ভাই">
        একদম! আগে <code>/public</code>-এ স্ট্যাটিক <code>sitemap.xml</code> রাখা হতো, যা ডাইনামিক ডেটার
        সাথে সিঙ্ক থাকত না। App Router-এ <code>app/robots.ts</code> ও <code>app/sitemap.ts</code> দিয়ে
        টাইপ-সেফভাবে সার্ভার ডাটাবেজ থেকে রিয়েল-টাইম সাইটম্যাপ জেনারেট করা যায়।
      </Line>

      {/* ── Architecture ──────────────────────────────────────────────── */}
      <H2 id="architecture">১. Robots &amp; Sitemap Crawler Pipeline</H2>

      <Diagram>{`┌─────────────────────────────────────────────────────────────────────────┐
│                   SEARCH ENGINE CRAWLER DISCOVERY FLOW                  │
└─────────────────────────────────────────────────────────────────────────┘

 crawler (e.g. Googlebot) hits the site
                          │
                          ▼
             fetches /robots.txt first
                          │
         ┌────────────────┴────────────────┐
         ▼                                 ▼
 checks access rules                 locates the sitemap link
 ├── Disallow: /admin/ ❌             └── Sitemap: https://site.com/sitemap.xml
 └── Allow: /products/ 🟢                        │
                                                 ▼
                                       fetches /sitemap.xml
                                                 │
                                   ┌─────────────┴─────────────┐
                                   ▼                           ▼
                            discovers /blog/1          discovers /products/shoes
                                   │                           │
                                   └─────────────┬─────────────┘
                                                 ▼
                                    efficient indexing queue 🚀`}</Diagram>

      {/* ── Mechanisms ────────────────────────────────────────────────── */}
      <H2 id="mechanisms">২. কোর আর্কিটেকচারাল কনসেপ্ট</H2>

      <p>
        <strong>Directive-based crawling control:</strong> <code>robots.txt</code> মূলত crawl budget
        অপটিমাইজ করে — প্রাইভেট রুট (<code>/admin</code>, <code>/api</code>), ফিল্টার URL বা সংবেদনশীল
        পাথ ক্রল করা থেকে বটকে বিরত রাখে।
      </p>

      <p>
        <strong>Automated URL discovery:</strong> সাইটম্যাপ প্রতিটি পেজের URL,{" "}
        <code>lastModified</code>, <code>changeFrequency</code> ও <code>priority</code> জানিয়ে
        ইনডেক্সিং দ্রুত করে।
      </p>

      <p>
        <strong>File-based routing convention:</strong> <code>app/robots.ts</code> বানালে Next.js
        স্বয়ংক্রিয়ভাবে <code>/robots.txt</code> রুট রেন্ডার করে; একইভাবে <code>app/sitemap.ts</code>{" "}
        থেকে <code>/sitemap.xml</code> তৈরি হয়।
      </p>

      {/* ── Implementation ────────────────────────────────────────────── */}
      <H2 id="implementation">৩. Production Code Implementation</H2>

      <H3>❌ Anti-pattern — a static XML file in /public</H3>

      <CodeBlock filename="public/sitemap.xml">{`<!-- 🔴 POOR PRACTICE: a hand-maintained static sitemap -->
<!-- new database entries (products, blog posts) never appear here on their own -->
<!-- it needs manual edits or a separate build script to stay accurate -->
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url><loc>https://techstore.com/</loc></url>
  <url><loc>https://techstore.com/about</loc></url>
</urlset>`}</CodeBlock>

      <H3>🟢 Production pattern — dynamic, type-safe robots and sitemap</H3>

      <CodeBlock filename="app/robots.ts">{`import type { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://techstore.com';

  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: [
          '/admin/',    // ❌ keep the admin panel out of the index
          '/api/',      // ❌ internal endpoints
          '/checkout/', // ❌ user checkout sessions
          '/*?*sort=',  // ❌ duplicate sorted/filtered URLs
        ],
      },
      {
        userAgent: 'BadBotName',
        disallow: '/', // ❌ block a known bad crawler entirely
      },
    ],
    // 🟢 points crawlers straight at the generated sitemap
    sitemap: \`\${baseUrl}/sitemap.xml\`,
  };
}`}</CodeBlock>

      <CodeBlock filename="app/sitemap.ts">{`import type { MetadataRoute } from 'next';
import { getAllProducts } from '@/lib/db/products';
import { getAllBlogPosts } from '@/lib/db/blog';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://techstore.com';

  // 1. fetch live data from the database or API
  const [products, posts] = await Promise.all([
    getAllProducts(),
    getAllBlogPosts(),
  ]);

  // 2. dynamic product entries
  const productEntries: MetadataRoute.Sitemap = products.map((product) => ({
    url: \`\${baseUrl}/products/\${product.slug}\`,
    lastModified: new Date(product.updatedAt),
    changeFrequency: 'daily',
    priority: 0.8,
  }));

  // 3. dynamic blog entries
  const blogEntries: MetadataRoute.Sitemap = posts.map((post) => ({
    url: \`\${baseUrl}/blog/\${post.slug}\`,
    lastModified: new Date(post.updatedAt),
    changeFrequency: 'weekly',
    priority: 0.7,
  }));

  // 4. the static core routes
  const staticEntries: MetadataRoute.Sitemap = [
    { url: baseUrl, lastModified: new Date(), changeFrequency: 'always', priority: 1 },
    {
      url: \`\${baseUrl}/about\`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.5,
    },
    {
      url: \`\${baseUrl}/contact\`,
      lastModified: new Date(),
      changeFrequency: 'yearly',
      priority: 0.3,
    },
  ];

  return [...staticEntries, ...productEntries, ...blogEntries];
}`}</CodeBlock>

      {/* ── Matrix ────────────────────────────────────────────────────── */}
      <H2 id="matrix">৪. Robots vs. Sitemap</H2>

      <Table
        head={["বৈশিষ্ট্য", "robots.ts (/robots.txt)", "sitemap.ts (/sitemap.xml)"]}
        rows={[
          [
            "মূল উদ্দেশ্য",
            "ক্রলারের অ্যাক্সেস কন্ট্রোল",
            "ইনডেক্সযোগ্য পেজের ক্যাটালগ",
          ],
          [
            "সিকিউরিটি রোল",
            "প্রাইভেট রুট ক্রল হওয়া থেকে বাঁচায়",
            "কেবল পাবলিক পেজ অন্তর্ভুক্ত থাকে",
          ],
          ["প্রভাব", "crawl budget সাশ্রয় করে", "ইনডেক্সিং কভারেজ বাড়ায় 🚀"],
          [
            "রিটার্ন টাইপ",
            <code key="c">MetadataRoute.Robots</code>,
            <code key="d">MetadataRoute.Sitemap</code>,
          ],
        ]}
      />

      <Line name="ভুলু ভাই">
        ফ্যান্টাস্টিক ফাহিম! <code>app/robots.ts</code> আর <code>app/sitemap.ts</code> বানানোর পর
        ডাটাবেজের সব নতুন প্রোডাক্ট অটোমেটিক সাইটম্যাপে চলে এসেছে, আর <code>/admin</code>-এ বটের এন্ট্রিও
        রুখে দেওয়া গেছে।
      </Line>

      {/* ── Takeaways ─────────────────────────────────────────────────── */}
      <H2 id="takeaway">Production Takeaways</H2>

      <Note>
        <ul>
          <li>
            <strong>robots.txt is not security:</strong> এখানে ব্লক করা মানেই পেজটি গোপন নয় — URL জানা
            থাকলে যে কেউ ঢুকতে পারবে। প্রকৃত সুরক্ষার জন্য middleware বা authentication গার্ড ব্যবহার
            করুন।
          </li>
          <li>
            <strong>Paginate large sitemaps:</strong> ৫০,০০০+ URL থাকলে{" "}
            <code>generateSitemaps</code> দিয়ে সাইটম্যাপ একাধিক খণ্ডে ভাগ করুন।
          </li>
          <li>
            <strong>Keep the base URL environment-aware:</strong> হার্ডকোড না করে{" "}
            <code>process.env.NEXT_PUBLIC_SITE_URL</code> ব্যবহার করুন, যাতে staging ও production-এ
            সঠিক ডোমেইন যায়।
          </li>
        </ul>
      </Note>
    </article>
  );
}
