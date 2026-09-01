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
      bn: "async component render() করা যাচ্ছে না",
      en: "render() cannot take an async component",
    },
  },
  {
    id: "architecture",
    label: {
      bn: "RSC টেস্টিং আর্কিটেকচার",
      en: "The RSC testing architecture",
    },
  },
  {
    id: "mechanisms",
    label: {
      bn: "৩টি আর্কিটেকচারাল কনসেপ্ট",
      en: "Three architectural concepts",
    },
  },
  {
    id: "implementation",
    label: {
      bn: "RSC resolve করে RTL-এ পাস করা",
      en: "Resolve the RSC, then hand it to RTL",
    },
  },
  {
    id: "matrix",
    label: {
      bn: "কোন স্ট্র্যাটেজি কখন",
      en: "Which strategy, when",
    },
  },
  {
    id: "takeaway",
    label: { bn: "Production Takeaways", en: "Production takeaways" },
  },
];

export default function ServerComponentTesting() {
  return (
    <article className="doc-prose">
      {/* ── The problem ───────────────────────────────────────────────── */}
      <H2 id="the-problem" anchorOnly>
        async component render() করা যাচ্ছে না
      </H2>

      <p>
        দুপুর ২:৩০। ভুলু ভাই স্ক্রিনের দিকে হাঁ করে তাকিয়ে আছেন। তিনি একটি React Server Component-এর
        ভেতরে সরাসরি <code>await fetch(...)</code> আর <code>cookies()</code> ব্যবহার করেছেন। এখন
        Vitest দিয়ে টেস্ট রান করলেই কনসোলে লাল রঙে ভেসে উঠছে —{" "}
        <em>async/await component cannot be rendered with React Testing Library</em>।
      </p>

      <Line name="ভুলু ভাই">
        ফাহিম! এ কেমন মুসিবত? Client Component তো সুন্দর <code>render(&lt;Component /&gt;)</code>{" "}
        দিয়ে টেস্ট করে ফেললাম! কিন্তু Server Component-এর আগে <code>async</code> থাকায়{" "}
        <code>render()</code> কাজ করছে না কেন?
      </Line>

      <Line name="ফাহিম">
        ভুলু ভাই! কারণ RSC ব্রাউজারে বা স্ট্যান্ডার্ড ক্লায়েন্ট React রানটাইমে সরাসরি এক্সিকিউট হয় না।
        RSC শুধু Node.js সার্ভার পরিবেশে রান করে JSX/RSC payload জেনারেট করে — তাই ক্লায়েন্ট টেস্টিং
        লাইব্রেরির সাধারণ <code>render()</code> একটি async কম্পোনেন্ট সরাসরি সাপোর্ট করে না।
      </Line>

      <Line name="নেক্সট-ভাই">
        একদম! RSC টেস্ট করার দুটি আধুনিক অ্যাপ্রোচ আছে — <strong>(১)</strong> RSC-কে একটি pure async
        function হিসেবে কল করে এর রিটার্ন করা JSX আউটপুট পরীক্ষা করা, আর <strong>(২)</strong>{" "}
        Playwright দিয়ে আসল Next.js সার্ভার চালিয়ে HTTP লেভেলে পুরো ট্রি টেস্ট করা — যেটা RSC-র জন্য
        সবচেয়ে বিশ্বস্ত।
      </Line>

      {/* ── Architecture ──────────────────────────────────────────────── */}
      <H2 id="architecture">১. RSC Execution &amp; Testing Architecture</H2>

      <Diagram>{`┌─────────────────────────────────────────────────────────────────────────────┐
│                    SERVER COMPONENT TESTING ARCHITECTURE                    │
└─────────────────────────────────────────────────────────────────────────────┘

 [RSC unit test] ──► call  await AsyncServerComponent(props)  in Node.js
                             │
                             ▼
                 [mock the server dependencies]
                 ├─ next/headers   → cookies(), headers()
                 └─ data layer     → db.query(), fetch()
                             │
                             ▼
                 [evaluate the returned JSX node]
                 └─ render(await AsyncServerComponent(props))

                                 OR

 [RSC E2E test]  ──► [Playwright] ──► real HTTP request to the Next.js server
                                              │
                                              ▼
                                 executes the full RSC tree on the server`}</Diagram>

      {/* ── Mechanisms ────────────────────────────────────────────────── */}
      <H2 id="mechanisms">২. কোর আর্কিটেকচারাল কনসেপ্ট</H2>

      <p>
        <strong>RSC-র asynchronous nature:</strong> RSC সরাসরি <code>async/await</code> সাপোর্ট করে —
        database query বা external API fetch কম্পোনেন্টের ভেতরেই হয়। এটি কোনো browser hook (
        <code>useState</code>, <code>useEffect</code>) রি-রেন্ডার করে না, তাই টেস্টে
        &ldquo;interaction&rdquo; বলে কিছু নেই — শুধু ইনপুট আর আউটপুট।
      </p>

      <p>
        <strong>Server environment dependencies:</strong> RSC প্রায়ই <code>next/headers</code>, DB
        client (Prisma, Drizzle) বা environment variable-এর ওপর নির্ভর করে। Node টেস্ট রানারে এগুলোর
        গ্লোবাল কনটেক্সট থাকে না, তাই Vitest দিয়ে মক করে নিতে হয়।
      </p>

      <p>
        <strong>Unit vs integration boundary:</strong> একক কম্পোনেন্টের ডাটা ট্রান্সফরমেশন ও JSX ট্রি
        দ্রুত যাচাই করতে হলে async resolution যথেষ্ট। কিন্তু Suspense boundary, streaming বা আসল
        ডাটাবেস জড়িত থাকলে Playwright E2E-ই একমাত্র বিশ্বাসযোগ্য উত্তর দেয়।
      </p>

      {/* ── Implementation ────────────────────────────────────────────── */}
      <H2 id="implementation">৩. Production Code Implementation</H2>

      <H3>❌ Anti-pattern — RSC-কে client component ভেবে render করা</H3>

      <CodeBlock filename="app/users/__tests__/UserProfile.bad.test.tsx">{`// 🔴 POOR PRACTICE: handing an async RSC straight to RTL's render()
import { render } from '@testing-library/react';
import UserProfile from '../UserProfile';

test('bad RSC test', () => {
  // ❌ FAILS: render() has no way to await the component's promise
  render(<UserProfile userId="123" />);
});`}</CodeBlock>

      <H3>🟢 Production pattern — resolve first, then render</H3>

      <p>
        <strong>Step 1 — টার্গেট Server Component।</strong>
      </p>

      <CodeBlock filename="app/users/UserProfile.tsx">{`// 🟢 PRODUCTION PATTERN: a modern React Server Component
import { cookies } from 'next/headers';

interface UserProfileProps {
  userId: string;
}

// 🟢 the data layer is exported separately, so it can be tested on its own
export async function fetchUserData(id: string) {
  const res = await fetch(\`https://api.example.com/users/\${id}\`, {
    headers: { Authorization: 'Bearer token' },
  });

  if (!res.ok) throw new Error('Failed to fetch user');
  return res.json();
}

export default async function UserProfile({ userId }: UserProfileProps) {
  const cookieStore = await cookies();
  const theme = cookieStore.get('theme')?.value || 'light';
  const user = await fetchUserData(userId);

  return (
    <section data-theme={theme} aria-label="User Profile">
      <h2>{user.name}</h2>
      <p>Email: {user.email}</p>
      <span role="status">{user.role}</span>
    </section>
  );
}`}</CodeBlock>

      <p>
        <strong>Step 2 — mock করা headers ও fetch সহ RSC ইউনিট টেস্ট।</strong>
      </p>

      <CodeBlock filename="app/users/__tests__/UserProfile.test.tsx">{`// 🟢 PRODUCTION PATTERN: an async RSC unit test with mocked server deps
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import UserProfile from '../UserProfile';

// next/headers has no Node global outside a request — mock it
vi.mock('next/headers', () => ({
  cookies: vi.fn().mockResolvedValue({
    get: vi.fn((key: string) => (key === 'theme' ? { value: 'dark' } : undefined)),
  }),
}));

describe('RSC: UserProfile', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it('renders the user details returned by the data layer', async () => {
    const mockUser = { name: 'Zubayer Salehin', email: 'zubayer@example.com', role: 'Admin' };

    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({
      ok: true,
      json: async () => mockUser,
    }));

    // 🟢 resolve the component's promise FIRST — it is just an async function
    const ResolvedRSC = await UserProfile({ userId: 'usr_101' });

    // then render the plain JSX tree it returned
    render(ResolvedRSC);

    expect(screen.getByRole('heading', { name: 'Zubayer Salehin' })).toBeInTheDocument();
    expect(screen.getByText('Email: zubayer@example.com')).toBeInTheDocument();
    expect(screen.getByRole('status')).toHaveTextContent('Admin');
  });

  it('reads the theme from the server cookie', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({ name: 'Test User', email: 'test@example.com', role: 'User' }),
    }));

    const ResolvedRSC = await UserProfile({ userId: 'usr_102' });
    const { container } = render(ResolvedRSC);

    expect(container.querySelector('section')).toHaveAttribute('data-theme', 'dark');
  });
});`}</CodeBlock>

      {/* ── Matrix ────────────────────────────────────────────────────── */}
      <H2 id="matrix">৪. Server Component Testing Strategy Matrix</H2>

      <Table
        head={["স্ট্র্যাটেজি", "উপযুক্ত ক্ষেত্র", "সুবিধা", "সীমাবদ্ধতা"]}
        rows={[
          [
            "RSC async resolution (Vitest)",
            "একক Server Component-এর লজিক ও JSX ট্রি",
            "অত্যন্ত দ্রুত, কোনো সার্ভার লাগে না 🟢",
            "ক্লায়েন্ট ইন্টারঅ্যাকশন টেস্ট করা যায় না",
          ],
          [
            "Playwright E2E",
            "RSC + Client Component পেজ ইন্টিগ্রেশন",
            "১০০% বাস্তবসম্মত, আসল সার্ভার রান করে 🟢",
            "রান হতে বেশি সময় নেয়",
          ],
          [
            "Data layer test",
            "RSC-র ভেতরের fetchUserData() বা DB সার্ভিস",
            "সার্ভার কোড থেকে লজিক আলাদা করে টেস্ট করা সহজ",
            "UI রেন্ডারিং নিশ্চিত করে না",
          ],
        ]}
      />

      <Line name="ভুলু ভাই">
        ফাটাফাটি ফাহিম! আমি ভেবেছিলাম RSC হয়তো টেস্টই করা যায় না। এখন দেখছি{" "}
        <code>await Component(props)</code> লিখে রেজাল্ট রিভলভ করে RTL-এ পাস করলেই সার্ভার
        কম্পোনেন্টের ইউনিট টেস্ট পানির মতো সহজ!
      </Line>

      {/* ── Takeaways ─────────────────────────────────────────────────── */}
      <H2 id="takeaway">Production Takeaways</H2>

      <Note>
        <ul>
          <li>
            <strong>Acknowledge RSC asynchrony:</strong> <code>render(&lt;RSC /&gt;)</code> নয় —{" "}
            <code>const Resolved = await RSC(props)</code> লিখে JSX রিভলভ করার পর{" "}
            <code>render(Resolved)</code> ব্যবহার করুন।
          </li>
          <li>
            <strong>Mock the server utilities:</strong> <code>cookies()</code>,{" "}
            <code>headers()</code> বা <code>redirect()</code> Node গ্লোবালে নেই — Vitest দিয়ে{" "}
            <code>next/headers</code> ও <code>next/navigation</code> মক করে নিন।
          </li>
          <li>
            <strong>Combine with Playwright:</strong> যেখানে Suspense boundary, streaming বা আসল
            ডাটাবেস জড়িত, সেখানে E2E টেস্টই একমাত্র নির্ভরযোগ্য সমাধান — ইউনিট টেস্ট তার বিকল্প নয়।
          </li>
        </ul>
      </Note>
    </article>
  );
}
