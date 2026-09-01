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
      bn: "৫০টা টেস্ট পাস, সাইট ভাঙা",
      en: "Fifty passing tests, a broken site",
    },
  },
  {
    id: "architecture",
    label: {
      bn: "MSW-র নেটওয়ার্ক ইন্টারসেপশন",
      en: "MSW network interception",
    },
  },
  {
    id: "mechanisms",
    label: {
      bn: "৪টি আর্কিটেকচারাল কনসেপ্ট",
      en: "Four architectural concepts",
    },
  },
  {
    id: "implementation",
    label: {
      bn: "MSW v2 handler, server ও runtime override",
      en: "MSW v2 handlers, server & overrides",
    },
  },
  {
    id: "matrix",
    label: {
      bn: "global.fetch mock vs MSW",
      en: "Mocking global.fetch vs MSW",
    },
  },
  {
    id: "takeaway",
    label: { bn: "Production Takeaways", en: "Production takeaways" },
  },
];

export default function MockingMsw() {
  return (
    <article className="doc-prose">
      {/* ── The problem ───────────────────────────────────────────────── */}
      <H2 id="the-problem" anchorOnly>
        ৫০টা টেস্ট পাস, সাইট ভাঙা
      </H2>

      <p>
        বিকেল ৪:১৫। ভুলু ভাই ল্যাপটপ চাপড়াচ্ছেন। তার প্রজেক্টে ৫০টি টেস্টে{" "}
        <code>global.fetch = vi.fn()</code> দিয়ে API মক করা ছিল। আজ ব্যাকএন্ড টিম{" "}
        <code>/api/v1/products</code> বদলে <code>/api/v2/products</code> করে দিয়েছে। টেস্ট রান করতেই
        দেখা গেল — ৫০টিই পাস! অথচ সাইট ব্রাউজারে চালু করলেই ফাটছে।
      </p>

      <Line name="ভুলু ভাই">
        ফাহিম! আমার টেস্ট ফ্রেমওয়ার্ক আমাকে ধোঁকা দিচ্ছে! <code>global.fetch = vi.fn()</code>{" "}
        সরাসরি JavaScript ফাংশনটাই ওভাররাইড করে ফেক ডাটা রিটার্ন করছে — কোন URL-এ রিকোয়েস্ট যাচ্ছে,
        কী হেডার যাচ্ছে, কিছুই ভ্যালিডেট হচ্ছে না। ব্যাকএন্ড ছাড়া রিয়ালিস্টিক টেস্টের উপায় কী?
      </Line>

      <Line name="ফাহিম">
        ভুলু ভাই! গ্লোবাল ফাংশন মক করার দিন শেষ! এর প্রফেশনাল সমাধান <code>MSW</code> (Mock Service
        Worker) — এটি অ্যাপ্লিকেশনের ফাংশন ওভাররাইড না করে <strong>নেটওয়ার্ক লেয়ারে</strong> বসে
        সত্যিকারের HTTP রিকোয়েস্ট ইন্টারসেপ্ট করে।
      </Line>

      <Line name="নেক্সট-ভাই">
        ঠিক ধরেছ! MSW v2 ব্রাউজারে Service Worker API আর Node.js টেস্ট এনভায়রনমেন্টে{" "}
        <code>node:http</code> interceptor ব্যবহার করে। ফলে আপনার ক্লায়েন্ট ও সার্ভার কম্পোনেন্ট মনে
        করে তারা সত্যিকারের সার্ভারের সাথেই কথা বলছে — আর একই handler আপনি Vitest, Playwright এবং
        local dev-এ শেয়ার করতে পারবেন!
      </Line>

      {/* ── Architecture ──────────────────────────────────────────────── */}
      <H2 id="architecture">১. MSW Network Interception Flow</H2>

      <Diagram>{`┌─────────────────────────────────────────────────────────────────────────────┐
│                       MSW NETWORK INTERCEPTION FLOW                         │
└─────────────────────────────────────────────────────────────────────────────┘

 [Next.js app / Vitest runner]
              │
              ▼
    fetch('/api/v2/products')  ───────► the real HTTP / network layer
                                              │
                                              ▼
                                 ┌─────────────────────────┐
                                 │  MSW interceptor engine │
                                 └────────────┬────────────┘
                                              │
                     does the URL match a handler for /api/v2/products?
                                ┌─────────────┴─────────────┐
                                │                           │
                             [YES]                        [NO]
                                │                           │
                                ▼                           ▼
                   return the mocked response      pass through to the real
                     HttpResponse.json()           network — or fail loudly`}</Diagram>

      {/* ── Mechanisms ────────────────────────────────────────────────── */}
      <H2 id="mechanisms">২. কোর আর্কিটেকচারাল কনসেপ্ট</H2>

      <p>
        <strong>Network-level interception:</strong> <code>fetch</code> বা <code>axios</code>-এর
        ইমপ্লিমেন্টেশন মক করার বদলে MSW রিকোয়েস্ট লেভেলে ইন্টারসেপ্ট করে। ফলে অ্যাপ্লিকেশনের ডাটা
        ফেচিং কোডে এক লাইনও না বদলে রিয়ালিস্টিক টেস্ট করা যায় — আর ভুল URL সাথে সাথেই ধরা পড়ে।
      </p>

      <p>
        <strong>MSW v2 syntax:</strong> v2-তে <code>rest.get()</code>-এর জায়গায়{" "}
        <code>http.get()</code>, <code>http.post()</code> এবং রেসপন্সের জন্য{" "}
        <code>HttpResponse.json()</code> ও <code>HttpResponse.error()</code> ব্যবহার করা হয় — সবই
        স্ট্যান্ডার্ড web <code>Request</code>/<code>Response</code> অবজেক্টের ওপর।
      </p>

      <p>
        <strong>Single source of truth:</strong> একটিমাত্র <code>handlers.ts</code> ফাইলে সব
        এন্ডপয়েন্টের মক ডেফিনিশন থাকে, যা Vitest, Playwright এবং local dev — তিন জায়গাতেই পুনরায়
        ব্যবহার হয়। API চুক্তি বদলালে একটাই ফাইল বদলাতে হয়।
      </p>

      <p>
        <strong>Node server vs browser worker:</strong> Vitest / Jest এবং Server Component টেস্টিংয়ে{" "}
        <code>setupServer</code> (<code>msw/node</code>) ব্যবহার হয়; Playwright E2E ও ব্রাউজার
        ডেভেলপমেন্টে <code>setupWorker</code> (<code>msw/browser</code>)।
      </p>

      {/* ── Implementation ────────────────────────────────────────────── */}
      <H2 id="implementation">৩. Production Code Implementation</H2>

      <H3>❌ Anti-pattern — global.fetch ওভাররাইড</H3>

      <CodeBlock filename="src/__tests__/ProductList.bad.test.tsx">{`// 🔴 POOR PRACTICE: overriding global.fetch directly
// Threat: never validates URL, method or headers — a false positive machine.

import { render, screen } from '@testing-library/react';
import { vi } from 'vitest';
import ProductList from '../ProductList';

test('bad fetch mock', async () => {
  // ❌ answers every request the same way, whatever the URL
  global.fetch = vi.fn().mockResolvedValue({
    ok: true,
    json: async () => [{ id: 1, name: 'Fake Laptop' }],
  } as Response);

  render(<ProductList />);

  // ❌ even if the component calls /wrong-api, this test still passes
  expect(await screen.findByText('Fake Laptop')).toBeInTheDocument();
});`}</CodeBlock>

      <H3>🟢 Production pattern — MSW v2 with shared handlers</H3>

      <p>
        <strong>Step 1 — কেন্দ্রীয় handler ফাইল।</strong>
      </p>

      <CodeBlock filename="src/mocks/handlers.ts">{`// 🟢 PRODUCTION PATTERN: one place that describes the API contract
import { http, HttpResponse } from 'msw';

export interface Product {
  id: string;
  title: string;
  price: number;
}

export const mockProducts: Product[] = [
  { id: 'p1', title: 'MacBook Pro M3', price: 1999 },
  { id: 'p2', title: 'Logitech MX Master 3S', price: 99 },
];

export const handlers = [
  http.get('https://api.example.com/api/v2/products', ({ request }) => {
    // 🟢 the request is real, so headers can actually be asserted on
    const authHeader = request.headers.get('Authorization');

    if (!authHeader) {
      return HttpResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    return HttpResponse.json(mockProducts, { status: 200 });
  }),

  http.post('https://api.example.com/api/v2/products', async ({ request }) => {
    const newProduct = (await request.json()) as Product;
    return HttpResponse.json({ ...newProduct, id: 'p3' }, { status: 201 });
  }),
];`}</CodeBlock>

      <p>
        <strong>Step 2 — Node (Vitest / RSC) সার্ভার।</strong>
      </p>

      <CodeBlock filename="src/mocks/server.ts">{`// 🟢 PRODUCTION PATTERN: the Node interceptor, shared by every test file
import { setupServer } from 'msw/node';
import { handlers } from './handlers';

export const server = setupServer(...handlers);`}</CodeBlock>

      <p>
        <strong>Step 3 — গ্লোবাল লাইফসাইকেল hook।</strong>
      </p>

      <CodeBlock filename="vitest.setup.ts">{`// 🟢 PRODUCTION PATTERN: a clean MSW lifecycle around the whole suite
import { beforeAll, afterEach, afterAll } from 'vitest';
import { server } from './src/mocks/server';

// 🟢 'error' means an unmocked request fails the test instead of slipping through
beforeAll(() => server.listen({ onUnhandledRequest: 'error' }));

// drop any per-test overrides so tests never leak into each other
afterEach(() => server.resetHandlers());

afterAll(() => server.close());`}</CodeBlock>

      <p>
        <strong>Step 4 — runtime override দিয়ে error path টেস্ট।</strong>
      </p>

      <CodeBlock filename="src/__tests__/ProductList.test.tsx">{`// 🟢 PRODUCTION PATTERN: the happy path from shared handlers, edge cases inline
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { http, HttpResponse } from 'msw';
import { server } from '../mocks/server';
import ProductList from '../ProductList';

describe('ProductList with MSW', () => {
  it('renders the products returned by the API', async () => {
    render(<ProductList token="valid_token" />);

    // MSW intercepts the real fetch to https://api.example.com/api/v2/products
    expect(await screen.findByText('MacBook Pro M3')).toBeInTheDocument();
    expect(screen.getByText('$1999')).toBeInTheDocument();
  });

  it('renders the error state on a 500', async () => {
    // 🟢 RUNTIME OVERRIDE: only for this test — afterEach resets it
    server.use(
      http.get('https://api.example.com/api/v2/products', () => {
        return new HttpResponse(null, { status: 500 });
      }),
    );

    render(<ProductList token="valid_token" />);

    expect(await screen.findByText(/failed to load products/i)).toBeInTheDocument();
  });
});`}</CodeBlock>

      {/* ── Matrix ────────────────────────────────────────────────────── */}
      <H2 id="matrix">৪. Traditional fetch mocking vs MSW v2</H2>

      <Table
        head={["বৈশিষ্ট্য", "vi.fn() / jest-fetch-mock", "MSW v2"]}
        rows={[
          [
            "ইন্টারসেপশন লেয়ার",
            "JavaScript ফাংশন ওভাররাইড 🔴",
            "আসল নেটওয়ার্ক লেয়ার — Service Worker / node:http 🟢",
          ],
          [
            "URL ও header ভ্যালিডেশন",
            "ম্যানুয়ালি চেক করতে হয়, সহজেই স্কিপ হয় 🔴",
            "রিয়েল HTTP রিকোয়েস্টেই ভ্যালিডেট হয় 🟢",
          ],
          [
            "Handler শেয়ারিং",
            "টেস্টে ছড়ানো, শেয়ার করা কঠিন",
            "Unit, E2E ও dev server-এ একই handler 🟢",
          ],
          [
            "Server Component (RSC)",
            "ক্লায়েন্ট মকিংয়ের ঝামেলা থাকে",
            "msw/node দিয়ে সার্ভার fetch-ও ইন্টারসেপ্ট হয় 🟢",
          ],
          [
            "নির্ভরযোগ্যতা",
            "false positive-এর উচ্চ ঝুঁকি 🔴",
            "চুক্তি না মিললে টেস্ট ফেইল করে 🟢",
          ],
        ]}
      />

      <Line name="ভুলু ভাই">
        জোস ফাহিম! এখন ডাটা ফেচিং কোড না ছুঁয়ে, <code>fetch</code> না ভেঙে নেটওয়ার্ক লেভেলের ১০০%
        অ্যাকুরেট মকিং সম্ভব — ব্যাকএন্ড ছাড়াই টেস্ট একেবারে রিয়ালিস্টিক!
      </Line>

      {/* ── Takeaways ─────────────────────────────────────────────────── */}
      <H2 id="takeaway">Production Takeaways</H2>

      <Note>
        <ul>
          <li>
            <strong>Stop mocking global.fetch:</strong> <code>vi.fn()</code> দিয়ে fetch মক করলে ভুল
            URL কখনো ধরা পড়ে না — MSW ব্যবহার করুন, যাতে URL, method আর header সত্যিকারের মতো
            ভ্যালিডেট হয়।
          </li>
          <li>
            <strong>Use server.use() for edge cases:</strong> সাধারণ রেসপন্স কেন্দ্রীয়{" "}
            <code>handlers.ts</code>-এ রাখুন; 500 error বা timeout-এর মতো বিশেষ কেস টেস্টের ভেতরে{" "}
            <code>server.use()</code> দিয়ে ওভাররাইড করুন।
          </li>
          <li>
            <strong>Set onUnhandledRequest: &lsquo;error&rsquo;:</strong> কোনো আন-মকড API কল যেন টেস্ট
            চলাকালে অলক্ষে গলে না যায় — সেটআপেই কড়া করে রাখুন।
          </li>
        </ul>
      </Note>
    </article>
  );
}
