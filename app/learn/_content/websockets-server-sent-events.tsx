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
      bn: "নোটিফিকেশনের জন্যও সকেট",
      en: "A socket even for notifications",
    },
  },
  {
    id: "architecture",
    label: {
      bn: "দুই প্রোটোকলের গঠন",
      en: "How the two protocols differ",
    },
  },
  {
    id: "mechanisms",
    label: {
      bn: "৩টি নির্বাচনী রুল",
      en: "Three selection rules",
    },
  },
  {
    id: "implementation",
    label: {
      bn: "SSE hook ও backoff সহ socket manager",
      en: "An SSE hook & a backoff socket manager",
    },
  },
  {
    id: "matrix",
    label: { bn: "SSE vs WebSocket", en: "SSE vs WebSocket" },
  },
  {
    id: "takeaway",
    label: { bn: "Production Takeaways", en: "Production takeaways" },
  },
];

export default function WebsocketsServerSentEvents() {
  return (
    <article className="doc-prose">
      {/* ── The problem ───────────────────────────────────────────────── */}
      <H2 id="the-problem" anchorOnly>
        নোটিফিকেশনের জন্যও সকেট
      </H2>

      <p>
        বিকেল ৪:১০। লাইভ কমিউনিটি চ্যাট আর অ্যানালিটিক্স নোটিফিকেশন — দুটোর জন্যই ভুলু ভাই একগাদা ভারী
        WebSocket হ্যান্ডলার বসিয়ে দিয়েছেন। মোবাইল নেটওয়ার্কে ঢুকলেই কানেকশন ড্রপ করছে, অটো-রিকানেক্ট
        হতে গিয়ে ব্যাটারি শেষ, আর ৫০০ জন ইউজার একসাথে ঢুকলে সার্ভারের মেমোরি ফুরিয়ে যাচ্ছে।
      </p>

      <Line name="ভুলু ভাই">
        ফাহিম! সার্ভার থেকে পাঠানো ছোট ছোট নোটিফিকেশনের জন্যও যদি এতগুলো WebSocket হ্যান্ডশেক ধরে
        রাখতে হয়, তবে সার্ভারের মেমোরি টিকবে কী করে? সকেটের বিকল্প কি কিছুই নেই?
      </Line>

      <Line name="ফাহিম">
        ভুলু ভাই! আপনি ভুল কাজের জন্য ভুল প্রোটোকল বেছেছেন। ডাটা যদি শুধু সার্ভার থেকে ক্লায়েন্টে যায়,
        তবে <strong>SSE</strong> অনেক হালকা, সহজ, আর রিকানেকশন ব্রাউজার নিজেই সামলায়। ফুল-ডুপ্লেক্স
        সত্যিই দরকার হলে — যেমন লাইভ চ্যাট — কেবল তখনই WebSocket।
      </Line>

      <Line name="নেক্সট-ভাই">
        একদম! আর মনে রাখবেন — একটি অ্যাপে দুটোই থাকতে পারে। নোটিফিকেশন SSE-তে, চ্যাট WebSocket-এ।
        প্রশ্নটা &ldquo;কোনটা ভালো&rdquo; নয়, &ldquo;এই ফিচারে ডাটা কোন দিকে যাচ্ছে&rdquo;।
      </Line>

      {/* ── Architecture ──────────────────────────────────────────────── */}
      <H2 id="architecture">১. Protocol Architecture</H2>

      <Diagram>{`┌─────────────────────────────────────────────────────────────────────────────┐
│                 WEBSOCKETS vs SERVER-SENT EVENTS (SSE)                      │
└─────────────────────────────────────────────────────────────────────────────┘

  1. WEBSOCKETS — full duplex, two-way
     [ CLIENT ] ────── HTTP upgrade handshake (101) ──────► [ SERVER ]
     [ CLIENT ] ◄─────────── frames, both ways ───────────► [ SERVER ]
     one long-lived TCP connection, framed messages, text or binary

  2. SERVER-SENT EVENTS — one-way server push
     [ CLIENT ] ────── ordinary GET, Accept: text/event-stream ──► [ SERVER ]
     [ CLIENT ] ◄────────── a never-ending chunked response ────── [ SERVER ]
     plain HTTP, UTF-8 text only, reconnection handled by the browser

  the wire format is the whole difference — and it decides everything else`}</Diagram>

      {/* ── Mechanisms ────────────────────────────────────────────────── */}
      <H2 id="mechanisms">২. কোর নির্বাচনী রুল</H2>

      <p>
        <strong>Direction decides the protocol:</strong> ডাটা শুধু সার্ভার থেকে আসছে — লাইভ স্কোর,
        নোটিফিকেশন, স্টক টিকার, AI টেক্সট স্ট্রিমিং? তাহলে SSE। ব্রাউজার আর সার্ভার দুই দিকেই ঘন ঘন
        বার্তা পাঠাচ্ছে — চ্যাট, মাল্টিপ্লেয়ার, কোলাবোরেটিভ এডিটিং? তখন WebSocket।
      </p>

      <p>
        <strong>HTTP/2 removes the old SSE limit:</strong> HTTP/1.1-এ এক ডোমেইনে ব্রাউজার সর্বোচ্চ
        ছয়টি কানেকশন খুলতে পারে, তাই SSE-র বদনাম হয়েছিল। HTTP/2-তে সেই সীমা নেই — একই কানেকশনে বহু
        স্ট্রিম মাল্টিপ্লেক্স হয়, আর ওভারহেড প্রায় শূন্য।
      </p>

      <p>
        <strong>Reconnection is free in one and manual in the other:</strong> SSE-তে ব্রাউজার নিজেই
        রিকানেক্ট করে, আর <code>Last-Event-ID</code> হেডার দিয়ে কোথা থেকে ছেদ পড়েছিল সেটিও জানিয়ে
        দেয়। WebSocket-এ রিকানেকশন আর backoff লজিক পুরোটাই আপনার লিখতে হবে — না লিখলে হাজার ক্লায়েন্ট
        একসাথে ফিরে এসে নিজের সার্ভারকেই DDoS করবে।
      </p>

      {/* ── Implementation ────────────────────────────────────────────── */}
      <H2 id="implementation">৩. Production Code Implementation</H2>

      <H3>🟢 Pattern 1 — resilient SSE hook</H3>

      <CodeBlock filename="src/shared/hooks/useServerSentEvents.ts">{`// 🟢 PRODUCTION PATTERN: a named-event SSE hook that always cleans up
'use client';

import { useEffect, useRef, useState } from 'react';

interface SSEOptions<T> {
  url: string;
  /** the server's event name, e.g. event: update */
  eventName?: string;
  onMessage: (data: T) => void;
  onError?: (error: Event) => void;
}

export function useServerSentEvents<T>({
  url,
  eventName = 'update',
  onMessage,
  onError,
}: SSEOptions<T>) {
  const [isConnected, setIsConnected] = useState(false);

  // 🟢 keep the callbacks in a ref so a new inline function on every render
  //    does not tear down and rebuild the connection
  const handlers = useRef({ onMessage, onError });
  handlers.current = { onMessage, onError };

  useEffect(() => {
    const es = new EventSource(url, { withCredentials: true });

    es.onopen = () => setIsConnected(true);

    // named events keep several streams apart on one connection
    es.addEventListener(eventName, (event) => {
      try {
        handlers.current.onMessage(JSON.parse((event as MessageEvent).data) as T);
      } catch {
        // one malformed frame must not kill the subscription
      }
    });

    es.onerror = (err) => {
      setIsConnected(false);
      handlers.current.onError?.(err);
      // 🟢 nothing to do here: the browser reconnects on its own,
      //    with its own backoff, and resumes from Last-Event-ID
    };

    return () => {
      es.close();
      setIsConnected(false);
    };
  }, [url, eventName]);

  return { isConnected };
}`}</CodeBlock>

      <H3>🟢 Pattern 2 — WebSocket manager with exponential backoff</H3>

      <CodeBlock filename="src/lib/websocket/SocketManager.ts">{`// 🟢 PRODUCTION PATTERN: everything SSE gives you free, written by hand
type MessageCallback = (payload: unknown) => void;

export class SocketManager {
  private socket: WebSocket | null = null;
  private listeners = new Map<string, Set<MessageCallback>>();
  private reconnectAttempts = 0;
  private closedByUs = false;

  private readonly maxReconnectAttempts = 6;
  private readonly baseDelay = 1000;

  constructor(private url: string) {}

  connect() {
    if (this.socket?.readyState === WebSocket.OPEN) return;

    this.closedByUs = false;
    this.socket = new WebSocket(this.url);

    this.socket.onopen = () => {
      this.reconnectAttempts = 0; // a successful connect resets the backoff
    };

    this.socket.onmessage = (event) => {
      try {
        const { channel, payload } = JSON.parse(event.data);
        this.listeners.get(channel)?.forEach((cb) => cb(payload));
      } catch {
        // ignore malformed frames rather than dropping the connection
      }
    };

    this.socket.onclose = () => {
      if (!this.closedByUs) this.scheduleReconnect();
    };
  }

  subscribe(channel: string, callback: MessageCallback) {
    if (!this.listeners.has(channel)) this.listeners.set(channel, new Set());
    this.listeners.get(channel)!.add(callback);

    // the caller gets an unsubscribe function, so a component can clean up
    return () => {
      this.listeners.get(channel)?.delete(callback);
    };
  }

  send(channel: string, payload: unknown) {
    if (this.socket?.readyState !== WebSocket.OPEN) return false;
    this.socket.send(JSON.stringify({ channel, payload }));
    return true;
  }

  private scheduleReconnect() {
    if (this.reconnectAttempts >= this.maxReconnectAttempts) return;

    this.reconnectAttempts += 1;

    // 🟢 exponential backoff PLUS jitter. Without the jitter every client
    //    that dropped together comes back together — and takes you down again.
    const backoff = this.baseDelay * 2 ** (this.reconnectAttempts - 1);
    const jitter = Math.random() * backoff * 0.3;

    setTimeout(() => this.connect(), backoff + jitter);
  }

  disconnect() {
    this.closedByUs = true;
    this.socket?.close();
    this.socket = null;
    this.listeners.clear();
  }
}`}</CodeBlock>

      <p>
        দুটো ফাইল পাশাপাশি রাখলে পার্থক্যটা পরিষ্কার হয়: SSE hook-এ রিকানেকশনের কোনো কোডই নেই, আর
        WebSocket manager-এর প্রায় অর্ধেকই তাই। ওই কোডটুকু না লিখতে হওয়াই SSE বেছে নেওয়ার আসল কারণ।
      </p>

      {/* ── Matrix ────────────────────────────────────────────────────── */}
      <H2 id="matrix">৪. SSE vs WebSocket Matrix</H2>

      <Table
        head={["দিক", "Server-Sent Events", "WebSockets"]}
        rows={[
          ["ডাটা প্রবাহ", "একমুখী — সার্ভার → ক্লায়েন্ট", "দ্বিমুখী 🟢"],
          ["প্রোটোকল", "সাধারণ HTTP / HTTP/2 🟢", "WSS — আলাদা প্রোটোকল"],
          [
            "রিকানেকশন",
            "ব্রাউজারে বিল্ট-ইন, Last-Event-ID সহ 🟢",
            "নিজে backoff লিখতে হয় 🔴",
          ],
          [
            "প্রক্সি ও ফায়ারওয়াল",
            "পোর্ট ৪৪৩-এ সাধারণ HTTP, সমস্যা নেই 🟢",
            "কিছু প্রক্সিতে upgrade ব্লক হয়",
          ],
          ["পেলোড", "শুধু UTF-8 টেক্সট", "টেক্সট ও বাইনারি 🟢"],
          [
            "স্কেল",
            "HTTP/2-তে বহু স্ট্রিম এক কানেকশনে 🟢",
            "প্রতি কানেকশনে মেমোরি বরাদ্দ",
          ],
        ]}
      />

      <Line name="ভুলু ভাই">
        অসাধারণ ফাহিম! নোটিফিকেশনের ভারী সকেট কোড ফেলে দিয়ে SSE বসিয়েছি, আর চ্যাটের সকেটে backoff
        যোগ করেছি। সার্ভারের র‍্যাম এখন ফাঁকা, আর মোবাইলে কানেকশন ড্রপ করলেও ব্যাটারি খাচ্ছে না!
      </Line>

      {/* ── Takeaways ─────────────────────────────────────────────────── */}
      <H2 id="takeaway">Production Takeaways</H2>

      <Note>
        <ul>
          <li>
            <strong>Default to SSE for feeds:</strong> নোটিফিকেশন, মেট্রিক্স আর AI রেসপন্স
            স্ট্রিমিংয়ে WebSocket অপ্রয়োজনীয় — SSE-ই যথেষ্ট এবং অনেক সস্তা।
          </li>
          <li>
            <strong>Backoff with jitter:</strong> সকেট ড্রপ করলে সাথে সাথে রিকানেক্ট করবেন না।
            exponential backoff-এর সাথে র‍্যান্ডম jitter দিন, নইলে সব ক্লায়েন্ট একসাথে ফিরে এসে
            সার্ভার ফেলে দেবে।
          </li>
          <li>
            <strong>Unsubscribe on unmount:</strong> কাস্টম hook বা manager — দুই ক্ষেত্রেই
            আনমাউন্টে কানেকশন ও লিসেনার ছাড়তে হবে, নইলে প্রতিটি নেভিগেশনে একটি করে লিক জমবে।
          </li>
        </ul>
      </Note>
    </article>
  );
}
