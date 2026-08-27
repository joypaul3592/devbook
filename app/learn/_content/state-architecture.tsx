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
      bn: "সব স্টেট এক গ্লোবাল স্টোরে",
      en: "Everything in one global store",
    },
  },
  {
    id: "architecture",
    label: { bn: "স্টেট পার্টিশনিং ম্যাপ", en: "The state partitioning map" },
  },
  {
    id: "foundations",
    label: { bn: "আর্কিটেকচারের ৪টি স্তম্ভ", en: "Four architectural pillars" },
  },
  {
    id: "implementation",
    label: {
      bn: "ডুপ্লিকেট স্টেট বনাম ক্লিন লেয়ারিং",
      en: "Duplicated state vs clean layering",
    },
  },
  {
    id: "matrix",
    label: { bn: "State Classification Matrix", en: "State classification matrix" },
  },
  {
    id: "takeaway",
    label: { bn: "Production Takeaways", en: "Production takeaways" },
  },
];

export default function StateArchitecture() {
  return (
    <article className="doc-prose">
      {/* ── The problem ───────────────────────────────────────────────── */}
      <H2 id="the-problem" anchorOnly>
        সব স্টেট এক গ্লোবাল স্টোরে
      </H2>

      <p>
        রাত ১০:১৫। ভুলু ভাইয়ের ড্যাশবোর্ডে সার্চ বক্সে একটা অক্ষর টাইপ করলেই সব চার্ট, টেবিল আর
        মোডাল রি-রেন্ডার হয়ে হ্যাং করছে। কারণ খুঁজতে গিয়ে দেখা গেল — ইনপুট টেক্সট, ফিল্টার লিস্ট,
        ইউজার প্রেফারেন্স, এমনকি সার্ভার থেকে আসা ২০০০ আইটেমের API রেসপন্স — সবই একটাই বিশাল
        Zustand স্টোরে, আর প্রতিটি কেস <code>useEffect</code> দিয়ে সিঙ্ক করা।
      </p>

      <Line name="ভুলু ভাই">
        ফাহিম! সব স্টেট এক জায়গায় রাখলে কোড পরিচ্ছন্ন থাকবে ভেবেছিলাম। কিন্তু সামান্য একটা ইনপুট
        বদলালেই পুরো অ্যাপের পারফরম্যান্স ধসে যাচ্ছে কেন?
      </Line>

      <Line name="ফাহিম">
        ভুলু ভাই! সব স্টেট গ্লোবাল স্টোরে রাখা মারাত্মক ভুল। মূল নিয়ম হলো{" "}
        <strong>state co-location</strong> — স্টেট ঠিক সেখানেই থাকবে যেখানে ব্যবহৃত হয়। আর যা
        হিসাব করে বের করা যায়, তা কখনোই স্টেটে রাখতে নেই — সেটিই <strong>derived state</strong>।
      </Line>

      <Line name="নেক্সট-ভাই">
        সবচেয়ে বড় নিয়ম হলো <strong>server state আর client state আলাদা রাখা</strong>। সার্ভার ডেটা
        ক্যাশ করবে RTK Query বা TanStack Query, আর Zustand শুধু UI স্টেট (ড্রয়ার খোলা/বন্ধ, থিম)
        ম্যানেজ করবে। সার্ভারের ডেটা টেনে এনে Zustand-এ কপি করার দরকার নেই।
      </Line>

      {/* ── Architecture ──────────────────────────────────────────────── */}
      <H2 id="architecture">১. State Partitioning Map</H2>

      <Diagram>{`┌─────────────────────────────────────────────────────────────────────────┐
│                       MODERN REACT STATE ARCHITECTURE                   │
└─────────────────────────────────────────────────────────────────────────┘

                          ┌──────────────────┐
                          │   application    │
                          └────────┬─────────┘
                                   │
       ┌───────────────────────────┴───────────────────────────┐
       ▼                                                       ▼
[SERVER STATE]                                        [CLIENT UI STATE]
RTK Query / TanStack Query                            local or global store
├─ network API responses                              │
├─ automatic caching & invalidation                   ├─▶ local (useState / useActionState)
└─ shared, refetchable server data                    │   └─ form inputs, accordion open/close
                                                      │
                                                      └─▶ global (Zustand)
                                                          └─ sidebar, theme, cart UI
                                                                   │
                                                                   ▼
                                                          [DERIVED STATE]
                                                          computed during render / useMemo
                                                          └─ filtered lists, totals`}</Diagram>

      {/* ── Foundations ───────────────────────────────────────────────── */}
      <H2 id="foundations">২. আর্কিটেকচারের ৪টি স্তম্ভ</H2>

      <Note>
        <ul>
          <li>
            <strong>State co-location:</strong> যে স্টেট শুধু একটি ফর্ম বা ড্রপডাউনে লাগে, সেটি
            গ্লোবাল স্টোরে দেবেন না। স্টেট ট্রি-র যত নিচে থাকবে, রি-রেন্ডারের পরিধি তত ছোট।
          </li>
          <li>
            <strong>Derived state:</strong> <code>firstName</code> ও <code>lastName</code> স্টেটে
            থাকলে <code>fullName</code> নামে তৃতীয় স্টেট বানাবেন না। সার্চ ফিল্টারের রেজাল্টও
            আলাদা স্টেটে নয় — রেন্ডারের সময় হিসাব করুন বা <code>useMemo</code> করুন।
          </li>
          <li>
            <strong>Server / client separation:</strong> RTK Query সার্ভার রেসপন্স নিজেই ক্যাশে
            রাখে। সেই ডেটা <code>useEffect</code> দিয়ে টেনে Zustand-এ সেট করা মানে দুই সোর্স অফ
            ট্রুথ — stale ডেটা অনিবার্য।
          </li>
          <li>
            <strong>Atomic selectors:</strong> Zustand থেকে পুরো অবজেক্ট না নিয়ে নির্দিষ্ট ফিল্ড
            সাবস্ক্রাইব করুন, যাতে অন্য ফিল্ড বদলালে কম্পোনেন্ট রি-রেন্ডার না হয়।
          </li>
        </ul>
      </Note>

      {/* ── Implementation ────────────────────────────────────────────── */}
      <H2 id="implementation">৩. ডুপ্লিকেট স্টেট বনাম ক্লিন লেয়ারিং</H2>

      <H3>❌ Anti-pattern — derived state + ম্যানুয়াল সিঙ্ক</H3>

      <CodeBlock filename="app/users/_components/bad-user-list.tsx">{`'use client';

import { useEffect, useState } from 'react';

export function BadUserList({ rawUsers }: { rawUsers: User[] }) {
  const [search, setSearch] = useState('');

  // Anti-pattern: derived data kept in state
  const [filteredUsers, setFilteredUsers] = useState<User[]>([]);

  // Anti-pattern: an effect whose only job is to mirror another value
  useEffect(() => {
    setFilteredUsers(
      rawUsers.filter((u) => u.name.toLowerCase().includes(search.toLowerCase())),
    );
  }, [search, rawUsers]);

  return (
    <div>
      <input value={search} onChange={(e) => setSearch(e.target.value)} />
      {filteredUsers.map((u) => (
        <div key={u.id}>{u.name}</div>
      ))}
    </div>
  );
}`}</CodeBlock>

      <H3>🟢 Fix — RTK Query (server) + Zustand (UI) + derived state</H3>

      <CodeBlock filename="store/use-ui-store.ts">{`import { create } from 'zustand';

interface UIState {
  searchQuery: string;
  isSidebarOpen: boolean;
  setSearchQuery: (query: string) => void;
  toggleSidebar: () => void;
}

// Client UI state only — no server data lives here
export const useUIStore = create<UIState>((set) => ({
  searchQuery: '',
  isSidebarOpen: false,
  setSearchQuery: (query) => set({ searchQuery: query }),
  toggleSidebar: () => set((state) => ({ isSidebarOpen: !state.isSidebarOpen })),
}));`}</CodeBlock>

      <CodeBlock filename="app/users/user-dashboard.tsx">{`'use client';

import { useMemo } from 'react';
import { useGetUsersQuery } from '@/store/api/user-api'; // RTK Query
import { useUIStore } from '@/store/use-ui-store';       // Zustand

export function UserDashboard() {
  // 1. Server state — owned by the query cache
  const { data: users = [], isLoading, isError } = useGetUsersQuery();

  // 2. Client UI state — subscribed atomically, field by field
  const searchQuery = useUIStore((state) => state.searchQuery);
  const setSearchQuery = useUIStore((state) => state.setSearchQuery);

  // 3. Derived state — computed, never stored
  const filteredUsers = useMemo(() => {
    if (!searchQuery.trim()) return users;
    return users.filter((user) =>
      user.name.toLowerCase().includes(searchQuery.toLowerCase()),
    );
  }, [users, searchQuery]);

  if (isLoading) return <div className="p-4 text-slate-400">Loading users...</div>;
  if (isError) return <div className="p-4 text-rose-400">Failed to fetch.</div>;

  return (
    <div className="p-6 bg-slate-950 border border-slate-800 rounded-2xl max-w-xl mx-auto space-y-4">
      <input
        type="text"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        placeholder="Filter users..."
        className="w-full px-4 py-2 bg-slate-900 border border-slate-800 rounded-xl text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
      />

      <div className="text-xs text-slate-400 font-medium">
        Showing {filteredUsers.length} of {users.length} users
      </div>

      <ul className="space-y-2">
        {filteredUsers.map((user) => (
          <li
            key={user.id}
            className="p-3 bg-slate-900 border border-slate-800/60 rounded-xl text-slate-200 text-sm flex justify-between items-center"
          >
            <span>{user.name}</span>
            <span className="text-xs bg-slate-800 px-2.5 py-1 rounded-md text-slate-400">
              {user.role}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}`}</CodeBlock>

      {/* ── Matrix ────────────────────────────────────────────────────── */}
      <H2 id="matrix">৪. State Classification Matrix</H2>

      <Table
        head={["স্টেটের ধরন", "টুল / হুক", "উদাহরণ", "সাধারণ ভুল"]}
        rows={[
          [
            "Local UI state",
            <>
              <code>useState</code>, <code>useActionState</code>
            </>,
            "মোডাল খোলা/বন্ধ, ইনপুট ভ্যালু",
            "এগুলো গ্লোবাল স্টোরে তুলে দেওয়া",
          ],
          [
            "Global UI state",
            "Zustand, React Context",
            "ড্রয়ার টগল, ডার্ক মোড, থিম",
            "এর ভেতরে সার্ভার ডেটা সিঙ্ক করে রাখা",
          ],
          [
            "Server state",
            "RTK Query, TanStack Query",
            "ইউজার প্রোফাইল, অর্ডার লিস্ট",
            "কোয়েরির ডেটা ম্যানুয়ালি Zustand-এ কপি করা",
          ],
          [
            "Derived state",
            <>
              ইনলাইন হিসাব, <code>useMemo</code>
            </>,
            "ফিল্টার করা লিস্ট, মোট দাম",
            <>
              <code>useState</code> + <code>useEffect</code> দিয়ে হাতে আপডেট করা
            </>,
          ],
        ]}
      />

      <Line name="ভুলু ভাই">
        পরিষ্কার! সার্ভার ডেটার জন্য RTK Query, UI ড্রয়ার আর থিমের জন্য Zustand, আর ফিল্টার করা
        রেজাল্ট <code>useMemo</code> — এভাবে ভাগ করার পর ড্যাশবোর্ড স্মুথ হয়ে গেছে।
      </Line>

      {/* ── Takeaways ─────────────────────────────────────────────────── */}
      <H2 id="takeaway">Production Takeaways</H2>

      <Note>
        <ul>
          <li>
            <strong>Calculate, don&apos;t re-store:</strong> যা বিদ্যমান স্টেট থেকে হিসাব করে পাওয়া
            যায় (total, filtered array, full name), তার জন্য নতুন স্টেট বা এফেক্ট লিখবেন না।
          </li>
          <li>
            <strong>Never duplicate server data:</strong> সার্ভার স্টেট single source of truth —
            সরাসরি কোয়েরি ক্যাশ থেকে পড়ুন, ক্লায়েন্ট স্টোরে কপি রাখবেন না।
          </li>
          <li>
            <strong>Use fine-grained selectors:</strong>{" "}
            <code>const &#123; search &#125; = useUIStore()</code> নয় —{" "}
            <code>useUIStore((s) =&gt; s.search)</code> লিখুন, তাহলে স্টোরের অন্য ফিল্ড বদলালেও
            কম্পোনেন্ট রি-রেন্ডার হবে না।
          </li>
        </ul>
      </Note>
    </article>
  );
}
