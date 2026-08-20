import { CodeBlock, Diagram, H2, Line, Note } from "@/components/learn/DocParts";
import type { Bi } from "@/lib/curriculum";

/** Section anchors — consumed by the "on this page" rail. */
export const headings: { id: string; label: Bi }[] = [
  {
    id: "oom-crash",
    label: { bn: "১ জিবি ফাইলে সার্ভার ডাউন", en: "A 1GB file takes the server down" },
  },
  {
    id: "three-patterns",
    label: { bn: "১. তিনটা আপলোড প্যাটার্ন", en: "1. Three upload patterns" },
  },
  {
    id: "streaming",
    label: { bn: "২. Stream হ্যান্ডলিং", en: "2. Stream handling" },
  },
  {
    id: "presigned",
    label: { bn: "৩. Presigned URL", en: "3. Presigned URLs" },
  },
  {
    id: "takeaway",
    label: { bn: "Production Takeaways", en: "Production takeaways" },
  },
];

export default function FileUploadStreaming() {
  return (
    <article className="doc-prose">
      {/* ── OOM crash ─────────────────────────────────────────────────── */}
      <H2 id="oom-crash" anchorOnly>
        ১ জিবি ফাইলে সার্ভার ডাউন
      </H2>

      <p>
        পরদিন দুপুর। ভুলু ভাই তাঁর প্রজেক্টে ১ জিবির একটা ভিডিও ফাইল ফর্ম দিয়ে আপলোড করার
        চেষ্টা করছেন। কিন্তু সাবমিট বাটনে ক্লিক করতেই ব্রাউজার ফ্রিজ হয়ে পুরো পেজ
        নট-রেসপন্ডিং দেখাচ্ছে! কিছুক্ষণ পর Node.js ব্যাকএন্ডে Out of Memory মেসেজ দিয়ে
        সার্ভার ডাউন হয়ে গেল!
      </p>

      <Line name="ভুলু ভাই">
        (মাথায় হাত দিয়ে) নেক্সট-ভাই! সর্বনাশ হয়ে গেছে! ইউজার প্রোফাইল পিকচারের ছোট ইমেজ
        ফাইল (৫০০ KB) আপলোড করার সময় Server Action দিয়ে সব ঠিকঠাকই কাজ করছিল। কিন্তু আজকে
        একটা বড় ফাইল আপলোড করতে যেতেই সার্ভার মেমরি ফুল হয়ে ক্র্যাশ মারলো কেন?!
      </Line>

      <Line name="নেক্সট-ভাই">
        (কফি কাপ সরিয়ে রেখে) কারণ তুই বিশাল সাইজের পুরো ফাইলটাকে একবারে মেমরিতে লোড করে
        প্রসেস করতে চেয়েছিস, ভুলু! Server Action-এ যখন তুই প্লেইন{" "}
        <code>FormData.get(&apos;file&apos;)</code> ব্যবহার করিস, তখন ডিফল্টভাবে পুরো
        ফাইলটা Node.js প্রসেসের RAM-এ বাফার হিসেবে জমে থাকে। এখন ১০ জন ইউজার যদি একসাথে
        ৫০০ মেগাবাইটের ফাইল আপলোড করে, তবে ৫ জিবি মেমরি এক মুহূর্তে শেষ হয়ে সার্ভার OOM
        ক্র্যাশ করবেই!
      </Line>

      <Line name="ভুলু ভাই">
        (আতঙ্কিত হয়ে) তাহলে বিশাল ফাইল বা ভিডিও ফাইল নিরাপদে আপলোড করার উপায় কী ভাই?!
      </Line>

      <Line name="নেক্সট-ভাই">
        সমাধান হলো — <strong>Stream Handling &amp; Direct-to-Cloud Uploads</strong>!
        মেমরিতে ফাইল জমা না করে ফাইলকে ছোট ছোট চাঙ্কে ভাগ করে স্ট্রিম করে ক্লাউড স্টোরেজে
        (AWS S3, Cloudinary, বা Vercel Blob) পাঠিয়ে দিতে হবে!
      </Line>

      {/* ── Three patterns ────────────────────────────────────────────── */}
      <H2 id="three-patterns">১. তিনটা আপলোড প্যাটার্ন</H2>

      <Diagram>{`Pattern A: In-Memory Upload (small files, < 4MB)
[Client File] ──(FormData)──► [Node.js RAM Buffer] ──► [Disk / S3]   ⚠️ Heavy RAM usage!

Pattern B: Stream Handling via Server Action (medium files, < 50MB)
[Client File] ──(Stream chunks)──► [Server Action Pipeline] ──► [S3 / Cloudinary]   ✅ Low RAM

Pattern C: Presigned URL / Direct-to-Cloud (large files, > 50MB)
[Client] ──(1. Get presigned URL via Action)──► [Server]
[Client] ───────(2. Direct HTTP PUT stream)───────► [Cloud Storage]   🚀 Zero server load!`}</Diagram>

      {/* ── Streaming ─────────────────────────────────────────────────── */}
      <H2 id="streaming">২. Stream হ্যান্ডলিং</H2>

      <Line name="নেক্সট-ভাই">
        তুই যদি মাঝারি সাইজের ফাইল (৫–৫০ মেগাবাইট) Server Action দিয়ে ক্লাউডে পাঠাতে চাস,
        তবে ফাইল অবজেক্টের Web <code>ReadableStream</code>-কে Node.js স্ট্রিমে কনভার্ট করে
        মেমরি-অপটিমাইজড পাইপলাইন বানাতে হবে:
      </Line>

      <CodeBlock filename="app/actions/upload.ts">{`'use server'

import { Readable } from 'node:stream';
import { ActionResult } from '@/types/action-result';

export async function uploadFileStream(
  formData: FormData
): Promise<ActionResult<{ fileUrl: string }>> {
  const file = formData.get('file') as File | null;

  if (!file || file.size === 0) {
    return { success: false, error: 'কোনো ফাইল সিলেক্ট করা হয়নি!' };
  }

  // 1. Validation (size & MIME type)
  const MAX_SIZE = 20 * 1024 * 1024; // 20 MB
  if (file.size > MAX_SIZE) {
    return { success: false, error: 'ফাইল সাইজ ২০ মেগাবাইটের বেশি হওয়া যাবে না!' };
  }

  try {
    // ⚡ 2. Convert the Web ReadableStream into a Node.js Readable —
    // this is what keeps the whole file out of RAM.
    const webStream = file.stream();
    const nodeStream = Readable.fromWeb(webStream as any);

    // ⚡ 3. Pipe straight into the cloud SDK
    const uploadResult = await cloudStorageUploadStream(nodeStream, file.name);

    return {
      success: true,
      data: { fileUrl: uploadResult.url },
      message: 'ফাইল সফলভাবে স্ট্রিম আপলোড হয়েছে!',
    };
  } catch (error) {
    console.error('Upload Error:', error);
    return { success: false, error: 'ফাইল আপলোড ব্যর্থ হয়েছে!' };
  }
}`}</CodeBlock>

      <Note>
        <p>
          একটা সূক্ষ্ম ব্যাপার: Server Action-এ পৌঁছানোর আগেই Next.js পুরো রিকোয়েস্ট বডি
          পার্স করে ফেলে, তাই <code>file.stream()</code> মূল লাভটা দেয় ফাইল থেকে ক্লাউডে
          পাঠানোর ধাপে — <code>file.arrayBuffer()</code> ডাকলে ওখানে আরেকটা পুরো কপি RAM-এ
          বসত। সত্যিকারের এন্ড-টু-এন্ড স্ট্রিমিং চাইলে Pattern C-ই একমাত্র উত্তর। এজন্যই
          Server Action-এর বডি সাইজ লিমিটও (<code>bodySizeLimit</code>) ডিফল্টে ছোট রাখা
          হয়।
        </p>
      </Note>

      {/* ── Presigned ─────────────────────────────────────────────────── */}
      <H2 id="presigned">৩. Presigned URL</H2>

      <Line name="ভুলু ভাই">
        কিন্তু নেক্সট-ভাই! যদি ১০০ মেগাবাইট বা ১ গিগাবাইটের বিশাল ভিডিও ফাইল হয়, তবে কি
        সেটা Server Action-এর ভেতর দিয়ে পাঠানো বুদ্ধিমানের কাজ হবে?
      </Line>

      <Line name="নেক্সট-ভাই">
        একদমই না! বড় ফাইলের ক্ষেত্রে Server Action-কে শুধু সিকিউরিটি চেকার হিসেবে ব্যবহার
        করবি, ফাইল ট্রান্সফারের জন্য নয়! ক্লায়েন্ট অ্যাকশন ডাকবে — &quot;আমি একটা ভিডিও
        আপলোড করতে চাই, আমাকে একটা সাইন করা আপলোড লিংক দাও।&quot; অ্যাকশন ক্লাউড স্টোরেজ
        থেকে একটা শর্ট-লিভড presigned URL এনে ক্লায়েন্টকে দেবে, আর ক্লায়েন্ট ব্রাউজার
        সরাসরি সেই URL-এ ফাইল পুশ করবে। ফলাফল: তোর Next.js সার্ভারে ১ মেগাবাইটও মেমরি লোড
        পড়বে না!
      </Line>

      <CodeBlock filename="app/actions/presigned.ts">{`'use server'

export async function getPresignedUploadUrl(fileName: string, fileType: string) {
  // 1. Authenticate the session FIRST — this URL is a write capability.
  const session = await auth();
  if (!session) throw new Error('Unauthorized');

  // 2. Generate a short-lived signed upload URL scoped to this user's prefix
  const signedUrl = await s3.getSignedUrl('putObject', {
    Bucket: 'my-bucket',
    Key: \`uploads/\${session.user.id}/\${fileName}\`,
    ContentType: fileType,
    Expires: 60, // seconds
  });

  return { success: true, signedUrl };
}`}</CodeBlock>

      <Line name="ভুলু ভাই">(উচ্ছ্বসিত হয়ে) দারুণ কনসেপ্ট নেক্সট-ভাই!</Line>

      <ul>
        <li>ছোট ফাইল হলে সাধারণ FormData দিয়ে আপলোড করা সহজ।</li>
        <li>
          মাঝারি ফাইলের ক্ষেত্রে <code>file.stream()</code> দিয়ে Node.js Readable বানিয়ে
          মেমরি ক্র্যাশ ঠেকানো যায়।
        </li>
        <li>
          আর বড় ফাইলের ক্ষেত্রে Server Action দিয়ে presigned URL এনে ক্লায়েন্ট থেকে
          সরাসরি ক্লাউডে আপলোড করাই মেমরি ও নেটওয়ার্ক সাশ্রয়ী প্রোডাকশন আর্কিটেকচার!
        </li>
      </ul>

      <Line name="নেক্সট-ভাই">
        একদম বিঙ্গো! এই ৩টা প্যাটার্ন জানা থাকলে ফাইল আপলোড নিয়ে তোকে আর কোনো দিন
        প্রোডাকশন ক্র্যাশের কবলে পড়তে হবে না!
      </Line>

      {/* ── Takeaway ──────────────────────────────────────────────────── */}
      <H2 id="takeaway">💡 Production Engineering Takeaways</H2>

      <ul>
        <li>
          <strong>Avoid Full File Buffering:</strong> মেমরি স্যাচুরেশন আর Node.js OOM
          ক্র্যাশ এড়াতে <code>file.arrayBuffer()</code> এড়িয়ে <code>file.stream()</code>{" "}
          ব্যবহার করা উচিত।
        </li>
        <li>
          <strong>Stream Conversion:</strong> Web standard <code>ReadableStream</code>-কে{" "}
          <code>Readable.fromWeb()</code> দিয়ে Node.js স্ট্রিমে কনভার্ট করে ক্লাউড SDK-তে
          পাইপলাইন তৈরি করা স্ট্যান্ডার্ড প্র্যাকটিস।
        </li>
        <li>
          <strong>Presigned URL Offloading:</strong> বড় ফাইলের ক্ষেত্রে Server Action দিয়ে
          ফাইল না পাঠিয়ে presigned upload URL ব্যবহার করে ট্রান্সফারের দায়িত্ব ক্লায়েন্ট
          ব্রাউজারে শিফট করাই শ্রেয়।
        </li>
      </ul>
    </article>
  );
}
