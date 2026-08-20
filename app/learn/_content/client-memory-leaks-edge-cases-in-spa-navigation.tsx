import { CodeBlock, Diagram, H2, Line, Note } from "@/components/learn/DocParts";
import type { Bi } from "@/lib/curriculum";

/** Section anchors — consumed by the "on this page" rail. */
export const headings: { id: string; label: Bi }[] = [
  {
    id: "the-problem",
    label: { bn: "মেমরি গ্রাফ শুধু উপরে ওঠে", en: "The memory graph only climbs" },
  },
  {
    id: "why-it-leaks",
    label: { bn: "SPA-তে মেমরি কেন জমে", en: "Why SPAs accumulate memory" },
  },
  {
    id: "listeners",
    label: { bn: "Listener ও Interval", en: "Listeners and intervals" },
  },
  {
    id: "sockets",
    label: { bn: "ঝুলে থাকা WebSocket", en: "Dangling WebSockets" },
  },
  {
    id: "aborting",
    label: { bn: "AbortController", en: "AbortController" },
  },
  {
    id: "takeaway",
    label: { bn: "Production Takeaways", en: "Production takeaways" },
  },
];

export default function ClientMemoryLeaks() {
  return (
    <article className="doc-prose">
      {/* ── The problem ───────────────────────────────────────────────── */}
      <H2 id="the-problem" anchorOnly>
        মেমরি গ্রাফ শুধু উপরে ওঠে
      </H2>

      <p>
        সন্ধ্যার সময়। ভুলু ভাই ল্যাপটপের মনিটরে ব্রাউজারের Task Manager আর Performance
        Tab খুলে হতাশ হয়ে বসে আছেন। সাইটের মেমরি গ্রাফ সোজা উপরের দিকে উঠছে, কমার কোনো
        নামই নেই!
      </p>

      <Line name="ভুলু ভাই">
        নেক্সট-ভাই! আমি তো পুরো মহাবিপদে পড়েছি! ড্যাশবোর্ডের সাইটটা যখন প্রথম ওপেন করি,
        তখন ব্রাউজারে মেমরি খরচ হয় মাত্র ১৫০ মেগাবাইট। কিন্তু ইউজার যখন ১-২ ঘণ্টা ধরে
        বিভিন্ন ট্যাবে আর পেজে নেভিগেট করতে থাকে, মেমরি বাড়তে বাড়তে ১.৫ জিবি পার হয়ে
        যায়! একপর্যায়ে ব্রাউজারের ট্যাব পুরো হ্যাং হয়ে{" "}
        <em>&quot;Aw, Snap! Out of Memory&quot;</em> এরর দিয়ে ক্র্যাশ করছে!
      </Line>

      <Line name="নেক্সট-ভাই">
        (কফির মগটা নামিয়ে রেখে সোজা হয়ে বসে) হুম! ভুলু, তুই তোর ফ্রন্টএন্ড অ্যাপ্লিকেশনে
        নীরব ঘাতক <strong>Client-Side Memory Leak</strong> তৈরি করে বসে আছিস!
      </Line>

      {/* ── Why it leaks ──────────────────────────────────────────────── */}
      <H2 id="why-it-leaks">১. SPA-তে মেমরি কেন জমে</H2>

      <Line name="ভুলু ভাই">
        মেমরি লিক?! কিন্তু আমি তো সাইট রিলোড ছাড়াই App Router-এর ক্লায়েন্ট সাইড নেভিগেশন
        (<code>&lt;Link&gt;</code> আর <code>router.push</code>) দিয়ে ঝড়ের বেগে পেজ চেঞ্জ
        করছিলাম! পেজ তো চেঞ্জ হয়ে যাচ্ছে, আগের পেজের জাভাস্ক্রিপ্ট ব্রাউজার মেমরিতে আটকে
        থাকে কীভাবে ভাই?!
      </Line>

      <Line name="নেক্সট-ভাই">
        ওখানেই তো আসল টুইস্ট! তুই যখন Single Page Application (SPA) স্টাইলে নেভিগেট
        করিস, ব্রাউজারের উইন্ডো কিন্তু কখনো ট্রাডিশনাল ওয়েবসাইটের মতো রিফ্রেশ বা ক্লিয়ার
        হয় না। তুই যদি কোনো ক্লায়েন্ট কম্পোনেন্ট unmount হওয়ার সময় ব্রাউজারের ইভেন্ট
        লিসেনার, টাইমার, বা গ্লোবাল সাবস্ক্রিপশন ক্লিয়ার না করিস — ব্রাউজারের গার্বেজ
        কালেক্টর (Garbage Collector) ওই পুরোনো ডেড-কম্পোনেন্টের অবজেক্টগুলোকে মেমরি থেকে
        ডিলিট করতে পারে না!
      </Line>

      <Diagram>{`[Page A (Mounted)] ---> Creates Global Event Listener / Interval
         │
         ▼ (SPA Soft Navigation via Client Link)
[Page B (Mounted)] ---> Page A Unmounts, BUT Event Listener STAYS in Browser Memory!
         │
         ▼ (Repeated 50 times)
🚨 BROWSER TAB MEMORY BLOATS TO 1.5GB -> TAB CRASHES!`}</Diagram>

      <Note>
        <p>
          কারণটা গার্বেজ কালেক্টরের নিয়মেই লেখা: সে শুধু ওই অবজেক্টই মোছে যার দিকে আর
          কোনো রেফারেন্স নেই। <code>window</code> একটা লিসেনার ধরে রেখেছে মানে সেই
          ফাংশনটা এখনো জীবিত — আর ক্লোজারের সূত্রে তার সাথে পুরো কম্পোনেন্টের state,
          props, DOM নোড সবই আটকে থাকে।
        </p>
      </Note>

      <Line name="ভুলু ভাই">
        (চোখ কপালে তুলে) বলিস কী ভাই?! পেজ আনমাউন্ট হয়ে যাওয়ার পরও ব্রাউজার ব্যাকগ্রাউন্ডে
        ওই ইভেন্ট লিসেনারগুলো ধরে রাখে?!
      </Line>

      <Line name="নেক্সট-ভাই">
        অবশ্যই ধরে রাখে! ফ্রন্টএন্ডে ৩টা মারাত্মক ভুলের কারণে এই মেমরি লিক সবচেয়ে বেশি
        হয়।
      </Line>

      {/* ── Listeners ─────────────────────────────────────────────────── */}
      <H2 id="listeners">২. Uncleaned Event Listeners ও Intervals</H2>

      <Line name="ভুলু ভাই">
        আমি তো উইন্ডো স্ক্রোল ব্যাক-টু-টপ বা উইন্ডো রিসাইজ ডিটেক্ট করার জন্য{" "}
        <code>useEffect</code>-এ <code>window.addEventListener(&apos;scroll&apos;, …)</code>{" "}
        লিখে রেখেছিলাম!
      </Line>

      <Line name="নেক্সট-ভাই">
        আর তুই ওই ইফেক্ট থেকে কোনো <strong>Cleanup Function</strong> রিটার্ন করিসনি!
        যতবার ইউজার অন্য রাউটে গেছে আর ফিরে এসেছে, ততবার একটা করে নতুন ইভেন্ট লিসেনার
        মেমরিতে যোগ হয়েছে!
      </Line>

      <CodeBlock filename="useWindowSize.ts">{`// ❌ ভুলু ভাইয়ের মেমরি লিক কোড
useEffect(() => {
  window.addEventListener('resize', handleResize);
  // 💥 Cleanup Function নেই! Component Unmount হলেও লিসেনার মেমরিতে লিক করবে!
}, []);

// ✅ প্রোডাকশন-রেডি Clean Code
useEffect(() => {
  window.addEventListener('resize', handleResize);

  return () => {
    window.removeEventListener('resize', handleResize); // ⚡ Garbage Collector frees memory!
  };
}, []);`}</CodeBlock>

      <Note>
        <p>
          একই নিয়ম <code>setInterval</code>, <code>setTimeout</code>,{" "}
          <code>IntersectionObserver</code>, <code>ResizeObserver</code> — সবার জন্য।
          যা কিছু তুই &quot;চালু&quot; করিস, ইফেক্টের রিটার্নে সেটাই &quot;বন্ধ&quot;
          করতে হবে।
        </p>
      </Note>

      {/* ── Sockets ───────────────────────────────────────────────────── */}
      <H2 id="sockets">৩. ঝুলে থাকা WebSocket ও SSE সাবস্ক্রিপশন</H2>

      <Line name="ভুলু ভাই">
        ভাই, আমার তো নোটিফিকেশনের জন্য একটা Real-time WebSocket কানেকশন ছিল!
      </Line>

      <Line name="নেক্সট-ভাই">
        যদি কোনো চাইল্ড ক্লায়েন্ট কম্পোনেন্টে সকেট কানেকশন দিস আর আনমাউন্ট করার সময়{" "}
        <code>socket.disconnect()</code> না ডাকিস, ব্যাকগ্রাউন্ডে অনবরত ডেটা স্ট্রিমিং
        হতে থাকবে এবং পুরোনো ক্লায়েন্ট স্টেটের মেমরি লিক হতে থাকবে!
      </Line>

      <CodeBlock filename="NotificationFeed.tsx">{`// ✅ সকেট খুললে সকেট বন্ধও করতে হবে
useEffect(() => {
  const socket = io('/notifications');
  socket.on('message', handleMessage);

  return () => {
    socket.off('message', handleMessage);
    socket.disconnect(); // ⚡ কানেকশন আর তার বাফার দুটোই ছেড়ে দেয়
  };
}, []);`}</CodeBlock>

      {/* ── Aborting ──────────────────────────────────────────────────── */}
      <H2 id="aborting">৪. Uncancelled Fetch ও AbortController</H2>

      <Line name="ভুলু ভাই">
        আর যদি কোনো ভারী এপিআই ফেচ রিকোয়েস্ট ব্যাকএন্ডে পেন্ডিং থাকা অবস্থায় ইউজার ধুপ
        করে অন্য পেজে চলে যায়?
      </Line>

      <Line name="নেক্সট-ভাই">
        তখন ওই ফেচ রিকোয়েস্ট রেসপন্স এনে এমন এক স্টেট ডেলিভার করার চেষ্টা করবে যা DOM-এ
        আর অস্তিত্বই রাখে না! ফ্রন্টএন্ডে এসব অনাথ রিকোয়েস্ট ক্যানসেল করতে সবসময়{" "}
        <code>AbortController</code> ব্যবহার করতে হবে।
      </Line>

      <CodeBlock filename="useHeavyData.ts">{`// ✅ Abort Signal Pattern to Cancel Pending Fetches
useEffect(() => {
  const controller = new AbortController();

  async function fetchData() {
    try {
      const res = await fetch('/api/heavy-data', { signal: controller.signal });
      const data = await res.json();
      setData(data);
    } catch (err) {
      if (err.name !== 'AbortError') console.error(err);
    }
  }

  fetchData();

  return () => {
    controller.abort(); // ⚡ পেজ ছেড়ে চলে গেলে সাথে সাথে নেটওয়ার্ক রিকোয়েস্ট কিল করে দেবে!
  };
}, []);`}</CodeBlock>

      <Line name="ভুলু ভাই">
        (ব্রাউজারের DevTools-এ Memory Tab খুলে Heap Snapshot চেক করতে করতে) ওরে বাপ্পরে!
        আমি তো ক্লিনআপ ফাংশন ছাড়াই ২০টা জায়গায় <code>setInterval</code> আর সকেট কানেকশন
        বসিয়ে রেখেছিলাম!
      </Line>

      <Line name="নেক্সট-ভাই">
        হা হা! এখন সব জায়গায় ক্লিনআপ মার আর <code>AbortController</code> বসিয়ে দে —
        দেখবি দীর্ঘ ১০ ঘণ্টা সাইট চালালেও মেমরি ১৫০ মেগাবাইটের ওপর ১ বাইটও বাড়বে না!
      </Line>

      <Note>
        <p>
          লিক ধরার সবচেয়ে নির্ভরযোগ্য উপায় — DevTools → Memory → Heap Snapshot নে,
          তারপর একই দুই রাউটের মধ্যে ৫-১০ বার আসা-যাওয়া কর, আবার একটা snapshot নে। দুটো
          তুলনা করলে যে detached DOM নোড বা listener-এর সংখ্যা প্রতিবার বাড়ছে, সেটাই
          তোর লিক।
        </p>
      </Note>

      {/* ── Takeaway ──────────────────────────────────────────────────── */}
      <H2 id="takeaway">💡 Production Frontend Takeaways</H2>

      <ul>
        <li>
          <strong>SPA Lifecycle Memory Retention:</strong> SPA ক্লায়েন্ট নেভিগেশনে
          ব্রাউজার রিফ্রেশ হয় না, তাই unmounted কম্পোনেন্টের অনাথ ইভেন্ট লিসেনার বা
          গ্লোবাল স্টেট মেমরিতে জমে লিক তৈরি করে।
        </li>
        <li>
          <strong>Mandatory Cleanup:</strong> প্রতিটি <code>useEffect</code>-এ থাকা
          টাইমার, ইভেন্ট লিসেনার বা ড্র্যাগ-ড্রপ ইন্টারঅ্যাকশনে রিটার্ন ক্লিনআপ ফাংশন লেখা
          আবশ্যক।
        </li>
        <li>
          <strong>Network Abortion:</strong> ইউজার পেজ থেকে নেভিগেট করে চলে গেলে পেন্ডিং
          নেটওয়ার্ক রিকোয়েস্ট কিল করতে <code>AbortController</code> ব্যবহার করা ফ্রন্টএন্ড
          মেমরি ম্যানেজমেন্টের প্রধান নিয়ম।
        </li>
      </ul>

      <Note>
        <p>
          <strong>চ্যাপ্টার ১ সম্পূর্ণ।</strong> Next.js Frontend Architecture-এর ১০টি
          প্রোডাকশন-লেভেল টপিক ভুলু ভাই আর নেক্সট-ভাইয়ের আড্ডার মাধ্যমে কভার করা হলো —
          RSC Payload থেকে শুরু করে মেমরি লিক পর্যন্ত।
        </p>
      </Note>
    </article>
  );
}
