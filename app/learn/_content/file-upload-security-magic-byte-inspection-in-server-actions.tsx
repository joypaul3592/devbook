import {
  CodeBlock,
  Diagram,
  H2,
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
      bn: "exe ফাইলের নাম avatar.png",
      en: "An .exe called avatar.png",
    },
  },
  {
    id: "mental-model",
    label: { bn: "Magic Byte ইন্সপেকশন", en: "Magic byte inspection" },
  },
  {
    id: "signatures",
    label: { bn: "পরিচিত সিগনেচার", en: "Known signatures" },
  },
  {
    id: "validator",
    label: { bn: "Step A — ভ্যালিডেটর হেল্পার", en: "Step A — the validator" },
  },
  {
    id: "action",
    label: { bn: "Step B — সিকিউর আপলোড অ্যাকশন", en: "Step B — the upload action" },
  },
  {
    id: "form",
    label: { bn: "Step C — আপলোড ফর্ম", en: "Step C — the upload form" },
  },
  {
    id: "takeaway",
    label: { bn: "Production Takeaways", en: "Production takeaways" },
  },
];

export default function FileUploadSecurity() {
  return (
    <article className="doc-prose">
      {/* ── The problem ───────────────────────────────────────────────── */}
      <H2 id="the-problem" anchorOnly>
        exe ফাইলের নাম avatar.png
      </H2>

      <p>
        বিকাল ৪:১০। ভুলু ভাই প্রোফাইল পিকচার আপলোডের ফিচার যুক্ত করেছেন —{" "}
        <code>formData.get(&apos;file&apos;)</code> দিয়ে ফাইল নিয়ে এক্সটেনশন আর MIME Type চেক
        করে প্রসেস করছেন। কিন্তু ফাহিম একটি <code>malicious.exe</code> ফাইলের নাম বদলে{" "}
        <code>avatar.png</code> দিয়ে আপলোড করে দিল — আর সার্ভার সেটাকে আসল ছবি মনে করে
        একসেপ্ট করে নিল!
      </p>

      <Line name="ভুলু ভাই">
        (আতঙ্কিত হয়ে) আমি তো <code>file.name.endsWith(&apos;.png&apos;)</code> আর{" "}
        <code>file.type === &apos;image/png&apos;</code> দিয়ে চেক করেছিলাম! এটা কীভাবে
        বাইপাস হলো?
      </Line>

      <Line name="নেক্সট-ভাই">
        (হেসে) ভুলু, ফাইল এক্সটেনশন আর ব্রাউজার-প্রেরিত <code>file.type</code> কেবল
        মেটাডেটা — যে কেউ এক ক্লিকে ফেক করতে পারে! কোনো ফাইলের আসল পরিচয় থাকে তার শুরুর
        কয়েক বাইটে — যাকে বলে <strong>Magic Bytes</strong> বা File Signatures।
      </Line>

      {/* ── Mental model ──────────────────────────────────────────────── */}
      <H2 id="mental-model">১. Magic Byte ইন্সপেকশন</H2>

      <Diagram>{`[ User uploaded file buffer ]
           │
           ▼
┌────────────────────────────────────────────────────────┐
│ 🔍 Read the first 4–8 bytes (hex signature)            │
│    e.g. 89 50 4E 47 0D 0A 1A 0A                        │
└────────────────────────────────────────────────────────┘
           │ Match against known magic bytes
           ├──────────────────────────────┐
           ▼ (valid signature)            ▼ (invalid signature)
┌─────────────────────────────┐ ┌─────────────────────────────┐
│ 🟢 Verify extension & size  │ │ 🔴 Block immediately        │
└─────────────────────────────┘ └─────────────────────────────┘
           │                              │
           ▼                              ▼
┌─────────────────────────────┐ ┌─────────────────────────────┐
│ 💾 Upload to cloud / disk   │ │ 🚫 Return an error response │
└─────────────────────────────┘ └─────────────────────────────┘`}</Diagram>

      {/* ── Signatures ────────────────────────────────────────────────── */}
      <H2 id="signatures">২. পরিচিত সিগনেচার</H2>

      <Table
        head={["ফাইল ফরম্যাট", "Hex Signature", "Offset"]}
        rows={[
          ["PNG", <code key="png">89 50 4E 47 0D 0A 1A 0A</code>, "0"],
          ["JPEG / JPG", <code key="jpg">FF D8 FF</code>, "0"],
          ["PDF", <code key="pdf">25 50 44 46 (%PDF)</code>, "0"],
          ["GIF", <code key="gif">47 49 46 38 (GIF8)</code>, "0"],
          ["WEBP", <code key="webp">57 45 42 50 (WEBP)</code>, "8"],
          ["ZIP / DOCX / XLSX", <code key="zip">50 4B 03 04</code>, "0"],
        ]}
      />

      {/* ── Validator ─────────────────────────────────────────────────── */}
      <H2 id="validator">৩. Step A — ভ্যালিডেটর হেল্পার</H2>

      <CodeBlock filename="lib/file-security.ts">{`export type AllowedFileType = 'png' | 'jpeg' | 'pdf';

// Known-good file signatures
const MAGIC_NUMBERS: Record<AllowedFileType, number[][]> = {
  png: [[0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]],
  jpeg: [
    [0xff, 0xd8, 0xff, 0xe0],
    [0xff, 0xd8, 0xff, 0xe1],
    [0xff, 0xd8, 0xff, 0xee],
  ],
  pdf: [[0x25, 0x50, 0x44, 0x46]], // %PDF
};

/** Reads the binary header and matches it against the expected signature */
export async function validateMagicBytes(
  file: File,
  expectedType: AllowedFileType,
): Promise<boolean> {
  // 1. Read only the first 8 bytes — memory efficient
  const buffer = await file.slice(0, 8).arrayBuffer();
  const header = new Uint8Array(buffer);

  const signatures = MAGIC_NUMBERS[expectedType];
  if (!signatures) return false;

  // 2. Compare the header against every known signature
  return signatures.some((signature) =>
    signature.every((byte, index) => header[index] === byte),
  );
}

/** Randomised, traversal-proof filename */
export function sanitizeFilename(filename: string): string {
  // Strips path traversal and double extensions (../../malicious.php.png)
  const cleanName = filename.replace(/[^a-zA-Z0-9.-]/g, '_');
  const ext = cleanName.split('.').pop()?.toLowerCase();

  return \`\${crypto.randomUUID()}.\${ext}\`;
}`}</CodeBlock>

      {/* ── Action ────────────────────────────────────────────────────── */}
      <H2 id="action">৪. Step B — সিকিউর আপলোড অ্যাকশন</H2>

      <CodeBlock filename="app/actions/upload-actions.ts">{`'use server';

import { z } from 'zod';
import {
  validateMagicBytes,
  sanitizeFilename,
  type AllowedFileType,
} from '@/lib/file-security';

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5 MB

const uploadSchema = z.object({
  file: z
    .custom<File>((val) => val instanceof File, 'ফাইল প্রদান করা বাধ্যতামূলক।')
    .refine((file) => file.size <= MAX_FILE_SIZE, 'ফাইলের সাইজ সর্বোচ্চ ৫ মেগাবাইট।'),
});

export interface UploadResponse {
  success: boolean;
  message: string;
  filePath?: string;
}

export async function uploadDocumentAction(
  prevState: UploadResponse,
  formData: FormData,
): Promise<UploadResponse> {
  try {
    // Step 1 — Zod boundary & size validation
    const validation = uploadSchema.safeParse({ file: formData.get('document') });
    if (!validation.success) {
      return { success: false, message: validation.error.issues[0].message };
    }

    const file = validation.data.file;

    // Step 2 — determine the expected type from the extension
    const extension = file.name.split('.').pop()?.toLowerCase() as AllowedFileType;
    if (!['png', 'jpeg', 'pdf'].includes(extension)) {
      return {
        success: false,
        message: 'শুধুমাত্র PNG, JPEG ও PDF আপলোড করার অনুমতি আছে।',
      };
    }

    // Step 3 — deep inspection via magic bytes
    const isValidBinary = await validateMagicBytes(file, extension);
    if (!isValidBinary) {
      console.warn(\`[SECURITY ALERT] Spoofed file detected: \${file.name}\`);
      return {
        success: false,
        message: 'সিকিউরিটি অ্যালার্ট: অবৈধ ফাইল সিগনেচার সনাক্ত হয়েছে!',
      };
    }

    // Step 4 — sanitise the filename and store the file
    const secureFileName = sanitizeFilename(file.name);
    // (Upload to S3 / R2 / disk here)
    console.log(\`[Upload success] saved as \${secureFileName}\`);

    return {
      success: true,
      message: 'ফাইল সফলভাবে ভ্যালিডেশন পেরিয়ে আপলোড হয়েছে!',
      filePath: \`/uploads/\${secureFileName}\`,
    };
  } catch (error) {
    console.error('[FILE UPLOAD ERROR]:', error);
    return { success: false, message: 'ফাইল আপলোড প্রসেসিং ব্যর্থ হয়েছে।' };
  }
}`}</CodeBlock>

      {/* ── Form ──────────────────────────────────────────────────────── */}
      <H2 id="form">৫. Step C — আপলোড ফর্ম</H2>

      <CodeBlock filename="app/upload/upload-form.tsx">{`'use client';

import { useActionState } from 'react';
import { uploadDocumentAction, type UploadResponse } from '../actions/upload-actions';

const initialState: UploadResponse = { success: false, message: '' };

export function FileUploadForm() {
  const [state, formAction, isPending] = useActionState(uploadDocumentAction, initialState);

  return (
    <form action={formAction} className="space-y-4">
      <label className="text-sm font-semibold text-slate-300">
        ডকুমেন্ট বা ছবি বেছে নিন (সর্বোচ্চ ৫ MB)
      </label>
      <input
        type="file"
        name="document"
        accept=".png,.jpeg,.jpg,.pdf"
        className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-sm"
      />

      {state.message && (
        <div
          className={state.success
            ? 'p-3 rounded-xl text-xs border bg-emerald-950/40 border-emerald-500/30 text-emerald-300'
            : 'p-3 rounded-xl text-xs border bg-red-950/40 border-red-500/30 text-red-300'}
        >
          {state.message}
        </div>
      )}

      <button
        type="submit"
        disabled={isPending}
        className="w-full py-3 bg-blue-600 hover:bg-blue-500 disabled:bg-slate-800 text-white font-semibold rounded-xl"
      >
        {isPending ? 'বাইনারি চেকিং ও আপলোড হচ্ছে…' : 'আপলোড করুন'}
      </button>
    </form>
  );
}`}</CodeBlock>

      <Line name="ভুলু ভাই">
        (শিহরিত হয়ে) অসাধারণ! এবার কোনো হ্যাকার এক্সটেনশন <code>.png</code> বানিয়ে ভেতরে
        ক্ষতিকর স্ক্রিপ্ট পাঠালেও <code>validateMagicBytes</code> প্রথম কয়েকটা বাইট পড়েই
        ভুয়া ফাইল ধরে ফেলবে!
      </Line>

      {/* ── Takeaways ─────────────────────────────────────────────────── */}
      <H2 id="takeaway">Production Takeaways</H2>

      <Note>
        <ul>
          <li>
            <strong>Never Trust MIME Types:</strong> ক্লায়েন্ট থেকে পাঠানো{" "}
            <code>file.type</code> বা ফাইলের নাম সম্পূর্ণ অনিরাপদ — সবসময় বাফারের প্রথম ৪–৮
            বাইট পড়ে Magic Number চেক করুন।
          </li>
          <li>
            <strong>Memory-Efficient Slicing:</strong> বড় ফাইল পুরোটা মেমরিতে না তুলে{" "}
            <code>file.slice(0, 8)</code> ব্যবহার করুন — এতে RAM বাঁচে আর DoS ঝুঁকি কমে।
          </li>
          <li>
            <strong>Randomised Filename:</strong> অরিজিনাল নামে সেভ করা Path Traversal ও
            overwrite ঝুঁকি তৈরি করে — সবসময় <code>crypto.randomUUID()</code> ব্যবহার করুন।
          </li>
          <li>
            <strong>Isolate Static Storage:</strong> আপলোড করা ফাইল কখনো সার্ভারের
            এক্সিকিউটেবল ডিরেক্টরিতে রাখবেন না — S3, R2 বা ডেডিকেটেড অবজেক্ট স্টোরেজে পাঠান।
          </li>
        </ul>
      </Note>
    </article>
  );
}
