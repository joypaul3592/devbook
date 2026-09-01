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
      bn: "থার্ড-পার্টি API ডাউন, টেস্ট লাল",
      en: "A third party is down, CI is red",
    },
  },
  {
    id: "architecture",
    label: {
      bn: "Interceptor কোথায় বসে",
      en: "Where the interceptor sits",
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
      bn: "Latency, 401 আর 500 সিমুলেট করা",
      en: "Simulating latency, 401s and 500s",
    },
  },
  {
    id: "matrix",
    label: { bn: "MSW vs fetch mock vs Nock", en: "MSW vs fetch mock vs Nock" },
  },
  {
    id: "takeaway",
    label: { bn: "Production Takeaways", en: "Production takeaways" },
  },
];

export default function MockingExternalApis() {
  return (
    <article className="doc-prose">
      {/* ── The problem ───────────────────────────────────────────────── */}
      <H2 id="the-problem" anchorOnly>
        থার্ড-পার্টি API ডাউন, টেস্ট লাল
      </H2>

      <p>
        বিকেল ৪:১৫। ভুলু ভাই কপালে হাত দিয়ে বসে আছেন। তিনি একটি স্পোর্টস ডাটা ড্যাশবোর্ড আর পেমেন্ট
        চেকআউট কম্পোনেন্ট টেস্ট করছিলেন। কিন্তু টেস্ট রান করলেই থার্ড-পার্টি API-এর rate limit (429)
        খাচ্ছে, স্লো নেটওয়ার্কে টেস্ট টাইমআউট হচ্ছে, আর CI-তে রিয়েল API key না থাকায় সব ফেইল মারছে।
      </p>

      <Line name="ভুলু ভাই">
        ফাহিম! টেস্টের উদ্দেশ্য তো আমার অ্যাপের লজিক যাচাই করা — থার্ড-পার্টি API ডাউন থাকলে বা
        ইন্টারনেট স্লো হলে আমার Vitest কেন ফেইল মারবে?
      </Line>

      <Line name="ফাহিম">
        ভুলু ভাই! ইউনিট ও ইন্টিগ্রেশন টেস্টে কখনোই লাইভ এক্সটার্নাল API কল করা উচিত নয়। MSW নেটওয়ার্ক
        লেয়ারে ইন্টারসেপ্টর বসিয়ে দেয় — আপনার অ্যাপ টেরও পাবে না যে সে রিয়েল সার্ভারে যাচ্ছে না। আর
        সবচেয়ে বড় কথা, এখন আপনি এমন সব পরিস্থিতি টেস্ট করতে পারবেন যা রিয়েল API-তে ইচ্ছে করে ঘটানোই
        যায় না।
      </Line>

      <Line name="নেক্সট-ভাই">
        একদম! আগের টপিকে আমরা MSW-র মূল সেটআপ দেখেছি। আজ দেখব এক্সটার্নাল নির্ভরতার আসল কাজটা —{" "}
        <strong>latency, 401, 429 আর 500 ইচ্ছেমতো সিমুলেট করা</strong>, RSC ও Server Action সহ, আর
        Nock-এর মতো বিকল্পের সাথে তুলনা।
      </Line>

      {/* ── Architecture ──────────────────────────────────────────────── */}
      <H2 id="architecture">১. MSW Interceptor Placement</H2>

      <Diagram>{`┌─────────────────────────────────────────────────────────────────────────────┐
│                       MSW NETWORK INTERCEPTOR FLOW                          │
└─────────────────────────────────────────────────────────────────────────────┘

 Next.js app (RSC / server action / client)
              │
              ▼
    fetch('https://api.example.com/v1/sports')
                                  │
                                  ▼
                      [MSW network interceptor]
                                  │
                       ┌──────────┴──────────┐
                       │  a matching handler? │
                       └──────────┬──────────┘
                                  │
                         ┌────────┴────────┐
                      [YES]               [NO]
                         │                 │
                         ▼                 ▼
          return the mock HttpResponse   onUnhandledRequest: 'error'
                         │                 └─► the test fails loudly 🟢
                         ▼
              the app receives it as an ordinary response`}</Diagram>

      {/* ── Mechanisms ────────────────────────────────────────────────── */}
      <H2 id="mechanisms">২. কোর আর্কিটেকচারাল কনসেপ্ট</H2>

      <p>
        <strong>Implementation-agnostic mocking:</strong> <code>vi.mock(&lsquo;axios&rsquo;)</code>{" "}
        বা <code>global.fetch = vi.fn()</code> অ্যাপের ইন্টারনাল ইমপ্লিমেন্টেশন মক করে। MSW আসল HTTP
        লেয়ারে বসে — তাই <code>fetch</code> থেকে <code>axios</code>-এ, বা raw fetch থেকে
        react-query-তে সরালেও টেস্ট কোডে এক লাইনও বদলাতে হয় না।
      </p>

      <p>
        <strong>Node vs browser interceptor:</strong> Vitest / RSC টেস্টিংয়ে{" "}
        <code>msw/node</code>-এর <code>setupServer</code>, আর ব্রাউজার বা Storybook-এ{" "}
        <code>msw/browser</code>-এর <code>setupWorker</code>। handler ফাইল দুই জায়গায় একই থাকে।
      </p>

      <p>
        <strong>Simulating what you cannot cause:</strong> রিয়েল API-কে ইচ্ছে করে 500 ফেরত দিতে বলা
        যায় না। MSW-তে <code>delay()</code>, <code>HttpResponse.error()</code> বা status code দিয়ে
        loading state, timeout, rate limit — সব পথই টেস্ট করা যায়।
      </p>

      <p>
        <strong>Contract drift detection:</strong> handler-এ URL, method আর header লেখা থাকে বলে
        ব্যাকএন্ড এন্ডপয়েন্ট বদলালে টেস্ট সাথে সাথে লাল হয় — আর{" "}
        <code>onUnhandledRequest: &lsquo;error&rsquo;</code> নিশ্চিত করে কোনো কল অলক্ষে ইন্টারনেটে
        চলে না যায়।
      </p>

      {/* ── Implementation ────────────────────────────────────────────── */}
      <H2 id="implementation">৩. Production Code Implementation</H2>

      <H3>❌ Anti-pattern — global.fetch monkey-patching</H3>

      <CodeBlock filename="src/__tests__/user.bad.test.ts">{`// 🔴 POOR PRACTICE: patching a global, and coupling the test to the client
import { test, vi, expect } from 'vitest';

test('fetches user details poorly', async () => {
  // ❌ mutating global state; every URL gets the same answer
  global.fetch = vi.fn().mockResolvedValue({
    json: async () => ({ id: '1', name: 'Zubayer' }),
  } as Response);

  // ❌ switch to axios, or add a required header, and this mock silently lies
});`}</CodeBlock>

      <H3>🟢 Production pattern — handlers that model the real contract</H3>

      <p>
        <strong>Step 1 — auth, validation আর latency সহ handler।</strong>
      </p>

      <CodeBlock filename="src/mocks/handlers.ts">{`// 🟢 PRODUCTION PATTERN: MSW v2 handlers that behave like the real service
import { http, HttpResponse, delay } from 'msw';

export const handlers = [
  http.get('https://api.example.com/v1/user', async ({ request }) => {
    const authHeader = request.headers.get('Authorization');

    // 🟢 the auth contract is enforced here, so a missing header is caught
    if (!authHeader) {
      return new HttpResponse(null, { status: 401, statusText: 'Unauthorized' });
    }

    return HttpResponse.json({
      id: 'usr_101',
      name: 'Zubayer Salehin',
      role: 'Frontend Architect',
    });
  }),

  http.post('https://api.example.com/v1/payout', async ({ request }) => {
    const body = (await request.json()) as { amount: number };

    // 🟢 real latency, so loading states are actually observable in tests
    await delay(100);

    if (body.amount <= 0) {
      return HttpResponse.json(
        { error: 'Amount must be greater than zero' },
        { status: 400 },
      );
    }

    return HttpResponse.json({ success: true, transactionId: 'tx_9921' }, { status: 201 });
  }),
];`}</CodeBlock>

      <p>
        <strong>Step 2 — Node interceptor ও লাইফসাইকেল।</strong>
      </p>

      <CodeBlock filename="src/mocks/node.ts">{`import { setupServer } from 'msw/node';
import { handlers } from './handlers';

// the Node interceptor — used by Vitest and by RSC tests alike
export const server = setupServer(...handlers);`}</CodeBlock>

      <CodeBlock filename="vitest.setup.ts">{`import { beforeAll, afterEach, afterAll } from 'vitest';
import { server } from './src/mocks/node';

// 🟢 'error' turns a forgotten mock into a failing test, not a silent live call
beforeAll(() => server.listen({ onUnhandledRequest: 'error' }));

// drop per-test overrides so nothing leaks between tests
afterEach(() => server.resetHandlers());

afterAll(() => server.close());`}</CodeBlock>

      <p>
        <strong>Step 3 — loading, success আর failure — তিন পথই।</strong>
      </p>

      <CodeBlock filename="components/__tests__/UserProfile.test.tsx">{`// 🟢 PRODUCTION PATTERN: the happy path from handlers, failures overridden inline
import { render, screen, waitFor } from '@testing-library/react';
import { expect, test } from 'vitest';
import { http, HttpResponse, delay } from 'msw';
import { server } from '@/mocks/node';
import { UserProfile } from '../UserProfile';

test('renders the profile returned by the API', async () => {
  render(<UserProfile />);

  // the handler's delay() makes this loading assertion meaningful
  expect(screen.getByText(/loading/i)).toBeInTheDocument();

  await waitFor(() => {
    expect(screen.getByRole('heading', { name: /zubayer salehin/i })).toBeInTheDocument();
  });
});

test('handles a 500 gracefully', async () => {
  // 🟢 RUNTIME OVERRIDE: a server crash you could never trigger for real
  server.use(
    http.get('https://api.example.com/v1/user', () => {
      return new HttpResponse(null, { status: 500 });
    }),
  );

  render(<UserProfile />);

  await waitFor(() => {
    expect(screen.getByText(/failed to load profile/i)).toBeInTheDocument();
  });
});

test('shows the rate-limit message on a 429', async () => {
  server.use(
    http.get('https://api.example.com/v1/user', async () => {
      await delay(50);
      return HttpResponse.json({ error: 'Too many requests' }, { status: 429 });
    }),
  );

  render(<UserProfile />);

  await waitFor(() => {
    expect(screen.getByText(/too many requests/i)).toBeInTheDocument();
  });
});`}</CodeBlock>

      {/* ── Matrix ────────────────────────────────────────────────────── */}
      <H2 id="matrix">৪. API Mocking Approach Matrix</H2>

      <Table
        head={["বৈশিষ্ট্য", "MSW", "Manual fetch mock", "Nock"]}
        rows={[
          [
            "ইন্টারসেপশন লেভেল",
            "নেটওয়ার্ক লেয়ার — worker / node interceptor 🟢",
            "কোড লেভেল — JS অবজেক্ট প্যাচিং 🔴",
            "Node HTTP মডিউল লেভেল",
          ],
          [
            "Client-agnostic",
            "fetch, axios, react-query — সবেই কাজ করে 🟢",
            "শুধু গ্লোবাল fetch 🔴",
            "শুধু Node, ব্রাউজারে নয়",
          ],
          [
            "RSC ও client শেয়ারিং",
            "একই handler দুই জায়গায় 🟢",
            "আলাদা জটিল সেটআপ লাগে",
            "ব্রাউজারে কাজ করে না 🔴",
          ],
          [
            "Error ও delay সিমুলেশন",
            "delay(), HttpResponse দিয়ে সহজ 🟢",
            "ম্যানুয়াল promise রেজোলিউশন",
            "মাঝারি",
          ],
          [
            "রিফ্যাক্টর সহনশীলতা",
            "অসাধারণ 🟢",
            "ক্লায়েন্ট বদলালেই টেস্ট ভাঙে 🔴",
            "মাঝারি",
          ],
        ]}
      />

      <Line name="ভুলু ভাই">
        ফাটাফাটি ফাহিম! এখন থার্ড-পার্টি API সার্ভার ডাউন থাকলেও টেস্ট এক সেকেন্ডে গ্রিন হয়ে যাচ্ছে —
        এমনকি সার্ভার crash করলে অ্যাপ কেমন আচরণ করবে, সেটাও এক লাইনের <code>server.use()</code>{" "}
        দিয়ে টেস্ট করে ফেললাম!
      </Line>

      {/* ── Takeaways ─────────────────────────────────────────────────── */}
      <H2 id="takeaway">Production Takeaways</H2>

      <Note>
        <ul>
          <li>
            <strong>Mock at the network boundary:</strong> অ্যাপের ক্লাস বা ফাংশন নয় — HTTP
            বাউন্ডারিতে মক করুন, তাহলে ডাটা ক্লায়েন্ট বদলালেও টেস্ট টিকে থাকবে।
          </li>
          <li>
            <strong>Always resetHandlers():</strong> প্রতিটি টেস্টের পর রিসেট করুন, নয়তো এক টেস্টের{" "}
            <code>server.use()</code> ওভাররাইড পরের টেস্টকে বিভ্রান্ত করবে।
          </li>
          <li>
            <strong>Catch unhandled requests:</strong>{" "}
            <code>onUnhandledRequest: &lsquo;error&rsquo;</code> সেট করে রাখুন — কোনো এক্সটার্নাল কল
            যেন টেস্ট চলাকালে সত্যি ইন্টারনেটে না যায়।
          </li>
        </ul>
      </Note>
    </article>
  );
}
