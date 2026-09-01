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
      bn: "setInterval-এ সার্ভার ডাউন",
      en: "setInterval took the server down",
    },
  },
  {
    id: "architecture",
    label: {
      bn: "Serverless-এ রিয়েল-টাইম",
      en: "Real-time under serverless",
    },
  },
  {
    id: "mechanisms",
    label: {
      bn: "৪টি রিয়েল-টাইম রুল",
      en: "Four real-time rules",
    },
  },
  {
    id: "implementation",
    label: {
      bn: "SSE স্ট্রিম ও ক্লিন ক্লায়েন্ট hook",
      en: "An SSE stream & a clean hook",
    },
  },
  {
    id: "matrix",
    label: { bn: "ট্রান্সপোর্ট প্রোটোকল তুলনা", en: "Transport protocols" },
  },
  {
    id: "takeaway",
    label: { bn: "Production Takeaways", en: "Production takeaways" },
  },
];

export default function RealTimeApplications() {
  return (
    <article className="doc-prose">
      {/* ── The problem ───────────────────────────────────────────────── */}
      <H2 id="the-problem" anchorOnly>
        setInterval-এ সার্ভার ডাউন
      </H2>

      <p>
        দুপুর ৩:৩০। লাইভ স্পোর্টস ড্যাশবোর্ডে ইউজাররা রিয়েল-টাইমে স্কোর পাচ্ছেন না। ভুলু ভাই প্রথমে
        ক্লায়েন্টে <code>setInterval()</code> দিয়ে প্রতি ৩ সেকেন্ডে API কল করেছিলেন — সার্ভার CPU
        ১০০%। এরপর Route Handler-এর ভেতরে Socket.io সার্ভার বসানোর চেষ্টা করতেই ডেপ্লয়মেন্ট ফেল।
      </p>

      <Line name="ভুলু ভাই">
        ফাহিম! <code>setInterval</code> দিলে সার্ভার ডাউন, আর Route Handler-এ Socket.io চালাতে গেলে
        কানেকশন টিকছেই না! সার্ভারলেস ফাংশন তো কয়েক সেকেন্ড পরেই বন্ধ হয়ে যায় — তাহলে পারসিস্টেন্ট
        কানেকশন ধরে রাখব কীভাবে?
      </Line>

      <Line name="ফাহিম">
        ভুলু ভাই! আপনি serverless vs stateful ট্র্যাপে পড়েছেন। সার্ভারলেস রানটাইম stateless — এখানে
        স্থায়ী কোনো সকেট প্রসেস ধরে রাখা যায় না। রিয়েল-টাইম করতে হলে তিন স্তরের আর্কিটেকচার লাগে —
        event producer, event broker, আর client listener।
      </Line>

      <Line name="নেক্সট-ভাই">
        একদম! আর সব জায়গায় ভারী WebSocket লাগেও না। শুধু সার্ভার থেকে ক্লায়েন্টে ডাটা পুশ করতে হলে
        (লাইভ স্কোর, নোটিফিকেশন) নেটিভ <strong>Server-Sent Events</strong>-ই সবচেয়ে বুদ্ধিমান পছন্দ —
        এটি শুধুই HTTP, আর রিকানেকশন ব্রাউজার নিজেই সামলায়।
      </Line>

      {/* ── Architecture ──────────────────────────────────────────────── */}
      <H2 id="architecture">১. Serverless Real-time Architecture</H2>

      <Diagram>{`┌─────────────────────────────────────────────────────────────────────────────┐
│               SERVERLESS REAL-TIME ARCHITECTURE (PUB / SUB)                 │
└─────────────────────────────────────────────────────────────────────────────┘

  [ ROUTE HANDLER / SERVER ACTION ] ──► publishes an event (score updated)
                         │
                         ▼
              [ EVENT BROKER — the stateful part ]
              Redis pub/sub · Pusher · Ably · a standalone WS server
                         │
        ┌────────────────┴────────────────┐
        ▼                                 ▼
  [ CLIENT 1 ]                      [ CLIENT 2 ]
  subscribes over SSE / WS          subscribes over SSE / WS

  the broker holds the connections; the serverless function never does`}</Diagram>

      {/* ── Mechanisms ────────────────────────────────────────────────── */}
      <H2 id="mechanisms">২. কোর রিয়েল-টাইম রুল</H2>

      <p>
        <strong>No stateful socket server in a route handler:</strong> সার্ভারলেস প্ল্যাটফর্মে
        রিকোয়েস্ট শেষ হলে ফাংশন ইনস্ট্যান্স মরে যায়, আর তার সাথে আপনার <code>io</code> অবজেক্টও।
        একাধিক ইনস্ট্যান্স থাকলে তারা একে অপরের কানেকশনও দেখতে পায় না। স্থায়ী কানেকশনের জন্য
        এক্সটার্নাল broker লাগবেই।
      </p>

      <p>
        <strong>Match the protocol to the direction:</strong> শুধু সার্ভার → ক্লায়েন্ট (স্কোর,
        নোটিফিকেশন, স্টক প্রাইস) হলে SSE; দুই দিকেই লাগলে (চ্যাট, মাল্টিপ্লেয়ার, কোলাবোরেটিভ
        এডিটিং) WebSocket। ভুল প্রোটোকল বাছাই মানে বিনা কারণে দ্বিগুণ জটিলতা।
      </p>

      <p>
        <strong>Optimistic UI with reconciliation:</strong> ইউজার কোনো অ্যাকশন নিলে সাথে সাথে UI
        আপডেট দেখান, তারপর broker থেকে ব্রডকাস্ট এলে সেটিকে সত্য ধরে মিলিয়ে নিন।
      </p>

      <p>
        <strong>Always clean up:</strong> কম্পোনেন্ট আনমাউন্ট হলে কানেকশন ক্লোজ করতে হবে। না করলে
        SPA নেভিগেশনে প্রতিবার একটি করে নতুন কানেকশন জমতে থাকবে — ক্লায়েন্টে মেমোরি লিক, সার্ভারে
        হাজার হাজার খোলা স্ট্রিম।
      </p>

      {/* ── Implementation ────────────────────────────────────────────── */}
      <H2 id="implementation">৩. Production Code Implementation</H2>

      <H3>❌ Anti-pattern — route handler-এ সকেট সার্ভার</H3>

      <CodeBlock filename="src/app/api/socket/route.ts">{`// 🔴 POOR PRACTICE: a stateful socket server inside a stateless function
import { Server } from 'socket.io';

let io: Server;

export async function GET() {
  // ❌ this instance dies with the request, and a second concurrent instance
  //    would have its own 'io' that knows nothing about the first one's clients
  if (!io) {
    io = new Server();
    io.on('connection', (socket) => {
      console.log('Client connected:', socket.id);
    });
  }

  return new Response('Socket initialized');
}`}</CodeBlock>

      <H3>🟢 Production pattern — নেটিভ SSE স্ট্রিম</H3>

      <p>
        <strong>Step 1 — স্ট্রিমিং route handler।</strong>
      </p>

      <CodeBlock filename="src/app/api/live-scores/route.ts">{`// 🟢 PRODUCTION PATTERN: a plain HTTP stream — no library, no socket server
import type { NextRequest } from 'next/server';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  const encoder = new TextEncoder();

  const stream = new ReadableStream({
    async start(controller) {
      const send = (payload: unknown) => {
        // the SSE wire format: 'data: <json>' followed by a blank line
        controller.enqueue(encoder.encode(\`data: \${JSON.stringify(payload)}\\n\\n\`));
      };

      send({ message: 'Connected to the live feed' });

      // in production this is a broker subscription, not a timer
      const interval = setInterval(() => {
        send({
          matchId: 'm-101',
          score: '2 - 1',
          timestamp: new Date().toISOString(),
        });
      }, 3000);

      // 🟢 a heartbeat comment keeps proxies from closing an idle stream
      const heartbeat = setInterval(() => {
        controller.enqueue(encoder.encode(': keep-alive\\n\\n'));
      }, 15000);

      // 🟢 without this, the timers outlive the client and leak forever
      req.signal.addEventListener('abort', () => {
        clearInterval(interval);
        clearInterval(heartbeat);
        controller.close();
      });
    },
  });

  return new Response(stream, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache, no-transform',
      Connection: 'keep-alive',
    },
  });
}`}</CodeBlock>

      <p>
        <strong>Step 2 — ক্লিনআপসহ ক্লায়েন্ট hook।</strong>
      </p>

      <CodeBlock filename="src/shared/hooks/useLiveScore.ts">{`// 🟢 PRODUCTION PATTERN: one subscription, always closed on unmount
'use client';

import { useEffect, useState } from 'react';

interface ScoreUpdate {
  matchId: string;
  score: string;
  timestamp: string;
}

export function useLiveScore() {
  const [data, setData] = useState<ScoreUpdate | null>(null);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    // EventSource reconnects on its own — that is most of why SSE is pleasant
    const eventSource = new EventSource('/api/live-scores');

    eventSource.onopen = () => setIsConnected(true);

    eventSource.onmessage = (event) => {
      try {
        setData(JSON.parse(event.data) as ScoreUpdate);
      } catch {
        // a malformed frame should not tear down the whole subscription
      }
    };

    eventSource.onerror = () => setIsConnected(false);

    // 🟢 MANDATORY: without this, every navigation leaves a stream open
    return () => {
      eventSource.close();
    };
  }, []);

  return { data, isConnected };
}`}</CodeBlock>

      <p>
        একাধিক সার্ভার ইনস্ট্যান্সে স্কেল করার সময় <code>setInterval</code>-এর জায়গায় Redis
        pub/sub subscription বসবে — তখন যেকোনো ইনস্ট্যান্সের প্রকাশ করা ইভেন্ট সব ক্লায়েন্টের কাছে
        পৌঁছাবে, তারা যে ইনস্ট্যান্সেই যুক্ত থাকুক।
      </p>

      {/* ── Matrix ────────────────────────────────────────────────────── */}
      <H2 id="matrix">৪. Transport Protocol Matrix</H2>

      <Table
        head={["দিক", "Short polling", "SSE", "WebSocket"]}
        rows={[
          [
            "দিক (direction)",
            "ক্লায়েন্ট টানে",
            "সার্ভার পুশ করে (একমুখী) 🟢",
            "দুই দিকেই 🟢",
          ],
          [
            "প্রোটোকল",
            "HTTP, উচ্চ ওভারহেড 🔴",
            "HTTP স্ট্রিম, কম ওভারহেড 🟢",
            "আলাদা WS ফ্রেম, খুব কম",
          ],
          [
            "Serverless উপযোগিতা",
            "চলে, কিন্তু ব্যয়বহুল",
            "স্ট্রিম হিসেবে চলে 🟢",
            "এক্সটার্নাল broker লাগে 🔴",
          ],
          [
            "রিকানেকশন",
            "নিজে লিখতে হয়",
            "ব্রাউজারে বিল্ট-ইন 🟢",
            "লাইব্রেরি বা নিজে",
          ],
          [
            "উপযুক্ত ক্ষেত্র",
            "কম গুরুত্বপূর্ণ ড্যাশবোর্ড",
            "লাইভ স্কোর, নোটিফিকেশন",
            "চ্যাট, গেম, কোলাবোরেশন",
          ],
        ]}
      />

      <Line name="ভুলু ভাই">
        অসাধারণ ফাহিম! আমি ভাবতাম রিয়েল-টাইম মানেই Socket.io। অথচ একমুখী আপডেটের জন্য নেটিভ SSE
        দিয়েই কোনো এক্সটার্নাল ডিপেন্ডেন্সি ছাড়া চমৎকার স্ট্রিম চলছে!
      </Line>

      {/* ── Takeaways ─────────────────────────────────────────────────── */}
      <H2 id="takeaway">Production Takeaways</H2>

      <Note>
        <ul>
          <li>
            <strong>SSE for one-way streams:</strong> একমুখী ডাটার জন্য WebSocket-এর জটিলতায় যাবেন
            না — নেটিভ SSE-ই যথেষ্ট, আর রিকানেকশন বিনামূল্যে পাবেন।
          </li>
          <li>
            <strong>Put the state in a broker:</strong> সার্ভারলেসে স্থায়ী কানেকশন রাখতে Redis
            pub/sub, Pusher বা Ably ব্যবহার করুন — ফাংশনের ভেতরে নয়।
          </li>
          <li>
            <strong>Clean up both ends:</strong> ক্লায়েন্টে <code>eventSource.close()</code>,
            সার্ভারে <code>req.signal</code>-এর abort handler — দুটোর একটিও বাদ পড়লে লিক অনিবার্য।
          </li>
        </ul>
      </Note>
    </article>
  );
}
