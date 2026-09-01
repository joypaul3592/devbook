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
      bn: "বিজনেস রুল ফ্রেমওয়ার্কে আটকে গেছে",
      en: "Business rules welded to the framework",
    },
  },
  {
    id: "architecture",
    label: {
      bn: "চারটি লেয়ার",
      en: "The four layers",
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
      bn: "Entity, use case ও thin adapter",
      en: "Entities, use cases, thin adapters",
    },
  },
  {
    id: "matrix",
    label: {
      bn: "Feature-based vs domain-driven",
      en: "Feature-based vs domain-driven",
    },
  },
  {
    id: "takeaway",
    label: { bn: "Production Takeaways", en: "Production takeaways" },
  },
];

export default function DomainDrivenStructure() {
  return (
    <article className="doc-prose">
      {/* ── The problem ───────────────────────────────────────────────── */}
      <H2 id="the-problem" anchorOnly>
        বিজনেস রুল ফ্রেমওয়ার্কে আটকে গেছে
      </H2>

      <p>
        সকাল ১১:১৫। কাল রাতে ফিচার-বেজড ফোল্ডার স্ট্রাকচার বানিয়ে ভুলু ভাই বেশ খুশি ছিলেন। কিন্তু আজ
        ওয়ালেট সিস্টেমের বিজনেস লজিক লিখতে গিয়ে আবার বিপদ — ব্যালেন্স ভ্যালিডেশন, ক্যাশআউট কমিশন আর
        ট্যাক্স কাটার নিয়ম কিছু server action-এ, কিছু কম্পোনেন্টে, কিছু API রাউটে ছড়িয়ে গেছে।
      </p>

      <Line name="ভুলু ভাই">
        ফাহিম! ফাইলগুলো গোছানো হয়েছে সত্য, কিন্তু আমার বিজনেস রুলগুলো তো Next.js-এর সাথে একদম জড়িয়ে
        গেছে! কাল যদি ব্যাকএন্ড আলাদা সার্ভিসে নিতে হয়, সব রুল আবার নতুন করে লিখতে হবে?
      </Line>

      <Line name="ফাহিম">
        ভুলু ভাই! এখানেই আসে <strong>domain-driven structure</strong>। ফিচার আর্কিটেকচার দেখে
        &ldquo;UI কীভাবে সংগঠিত&rdquo;, আর ডোমেইন-ড্রিভেন স্ট্রাকচার দেখে &ldquo;বিজনেসের মূল
        নিয়মগুলো কোথায় থাকে&rdquo;। এখানে Next.js শুধুই একটি রেন্ডারিং প্ল্যাটফর্ম — আসল খেলা খেলে
        ডোমেইন লেয়ার।
      </Line>

      <Line name="নেক্সট-ভাই">
        একদম! বড় এন্টারপ্রাইজ অ্যাপে core business rules-কে framework, UI আর infrastructure — তিনটি
        থেকেই সম্পূর্ণ আইসোলেটেড রাখা হয়। ফলে ORM বা পেমেন্ট গেটওয়ে বদলালেও বিজনেস লজিকে হাত দিতে হয়
        না।
      </Line>

      {/* ── Architecture ──────────────────────────────────────────────── */}
      <H2 id="architecture">১. Layered Domain Architecture</H2>

      <Diagram>{`┌─────────────────────────────────────────────────────────────────────────────┐
│                 DOMAIN-DRIVEN ARCHITECTURE FOR NEXT.JS                      │
└─────────────────────────────────────────────────────────────────────────────┘

  [ PRESENTATION ]   ──► Next.js App Router, React components, server actions
            │              knows about the framework; knows nothing about rules
            ▼
  [ APPLICATION ]    ──► use cases, orchestration  (WithdrawFundsUseCase)
            │              knows the domain; knows nothing about Next.js
            ▼
  [ DOMAIN ]         ──► entities, value objects, pure business rules
  (pure TS, zero deps)   (Wallet, Money, calculateWithdrawalFee)
            ▲
            │  via interfaces (ports), never concrete classes
  [ INFRASTRUCTURE ] ──► Prisma / Drizzle, payment gateways, API clients

  the arrow into the domain always points inward — the domain imports nothing`}</Diagram>

      {/* ── Mechanisms ────────────────────────────────────────────────── */}
      <H2 id="mechanisms">২. কোর আর্কিটেকচারাল কনসেপ্ট</H2>

      <p>
        <strong>Pure domain layer:</strong> ডোমেইন লেয়ারে <code>next/headers</code>,{" "}
        <code>useState</code> বা কোনো ORM ইমপোর্ট করা যাবে না। এটি প্লেইন TypeScript — শুধু বিজনেসের
        আসল নিয়ম ধারণ করে। এই একটি নিয়ম মানলেই ডোমেইন টেস্ট মিলিসেকেন্ডে চলে, কোনো mock ছাড়াই।
      </p>

      <p>
        <strong>Entity ও value object:</strong> <em>Entity</em> হলো অনন্য আইডি বিশিষ্ট বিজনেস অবজেক্ট
        (<code>Wallet</code>) যা সময়ের সাথে স্টেট বদলায়। <em>Value object</em> ইমিউটেবল, শুধু একটি
        মান নির্দেশ করে (<code>Money</code>) — আর নিজের বৈধতা নিজেই নিশ্চিত করে।
      </p>

      <p>
        <strong>Application use case:</strong> ইউজারের একটি নির্দিষ্ট উদ্দেশ্যের পুরো প্রবাহ (
        <code>WithdrawFundsUseCase</code>) — এটি ডোমেইন অবজেক্ট ব্যবহার করে কাজ সম্পন্ন করে, কিন্তু
        নিজে কোনো রুল জানে না।
      </p>

      <p>
        <strong>Decoupled infrastructure:</strong> ডাটাবেস বা এক্সটার্নাল সার্ভিস একটি{" "}
        <em>interface</em>-এর মাধ্যমে ডোমেইনের সাথে যুক্ত হয় (ports &amp; adapters)। Prisma থেকে
        Drizzle-এ গেলে শুধু একটি adapter ক্লাস বদলায়, ডোমেইনে এক লাইনও নয়।
      </p>

      {/* ── Implementation ────────────────────────────────────────────── */}
      <H2 id="implementation">৩. Production Code Implementation</H2>

      <H3>❌ Anti-pattern — server action-এর ভেতরেই সব</H3>

      <CodeBlock filename="src/app/actions/wallet.ts">{`// 🔴 POOR PRACTICE: business rules fused with Next.js and the ORM
'use server';

import { db } from '@/lib/db';

export async function handleWithdrawal(userId: string, amount: number) {
  const wallet = await db.wallet.findUnique({ where: { userId } });

  // ❌ the rules live here, so they cannot be tested, reused, or found again
  if (wallet.balance < amount) throw new Error('Insufficient balance');
  if (amount > 50000) throw new Error('Exceeds daily limit');

  const tax = amount * 0.05; // ❌ a business constant buried in a route handler
  const finalAmount = amount - tax;

  await db.wallet.update({
    where: { userId },
    data: { balance: wallet.balance - amount },
  });
}`}</CodeBlock>

      <H3>🟢 Production pattern — decoupled domain</H3>

      <p>
        <strong>Step 1 — পিওর ডোমেইন entity ও রুল।</strong>
      </p>

      <CodeBlock filename="src/domain/wallet/entities/Wallet.ts">{`// 🟢 PRODUCTION PATTERN: pure TypeScript — zero Next.js, React or ORM imports

export class Money {
  constructor(
    public readonly amount: number,
    public readonly currency: string = 'BDT',
  ) {
    // 🟢 a value object that cannot exist in an invalid state
    if (amount < 0) throw new Error('Money amount cannot be negative');
  }
}

export class Wallet {
  constructor(
    public readonly id: string,
    public readonly userId: string,
    private balanceAmount: number,
  ) {}

  get balance(): number {
    return this.balanceAmount;
  }

  // 🟢 the rule lives with the data it governs — one place to read, one to change
  public calculateWithdrawalFee(amount: number): number {
    if (amount > 50_000) {
      throw new Error('Transaction exceeds the daily withdrawal limit of 50,000 BDT');
    }

    const TAX_RATE = 0.05;
    return amount * TAX_RATE;
  }

  public deductBalance(amount: number): void {
    if (this.balanceAmount < amount) {
      throw new Error('Insufficient wallet balance for this transaction');
    }
    this.balanceAmount -= amount;
  }
}`}</CodeBlock>

      <p>
        <strong>Step 2 — use case, একটি interface-এর ওপর দাঁড়িয়ে।</strong>
      </p>

      <CodeBlock filename="src/domain/wallet/use-cases/WithdrawFunds.ts">{`// 🟢 PRODUCTION PATTERN: orchestration that knows the domain, not the database
import { Wallet } from '../entities/Wallet';

// 🟢 the port: the domain declares what it needs, infrastructure supplies it
export interface WalletRepository {
  findById(userId: string): Promise<Wallet>;
  save(wallet: Wallet): Promise<void>;
}

export class WithdrawFundsUseCase {
  constructor(private walletRepo: WalletRepository) {}

  async execute(userId: string, amount: number) {
    const wallet = await this.walletRepo.findById(userId);

    const fee = wallet.calculateWithdrawalFee(amount);
    const totalDeduction = amount + fee;

    wallet.deductBalance(totalDeduction);

    await this.walletRepo.save(wallet);

    return { success: true, fee, remainingBalance: wallet.balance };
  }
}`}</CodeBlock>

      <p>
        <strong>Step 3 — Next.js শুধু একটি পাতলা adapter।</strong>
      </p>

      <CodeBlock filename="src/app/actions/wallet.ts">{`// 🟢 PRODUCTION PATTERN: the framework layer only translates in and out
'use server';

import { WithdrawFundsUseCase } from '@/domain/wallet/use-cases/WithdrawFunds';
import { PrismaWalletRepository } from '@/infrastructure/repositories/PrismaWalletRepository';

export async function withdrawAction(formData: FormData) {
  const userId = formData.get('userId') as string;
  const amount = Number(formData.get('amount'));

  // the adapter satisfying the port — swap Prisma for Drizzle here, nowhere else
  const useCase = new WithdrawFundsUseCase(new PrismaWalletRepository());

  try {
    const result = await useCase.execute(userId, amount);
    return { success: true, data: result };
  } catch (error) {
    return { success: false, error: (error as Error).message };
  }
}`}</CodeBlock>

      <p>
        এর সবচেয়ে বড় সুবিধা টেস্টে দেখা যায় — ডোমেইন টেস্টে কোনো ডাটাবেস, কোনো mock, কোনো Next.js
        রানটাইম লাগে না।
      </p>

      <CodeBlock filename="src/domain/wallet/__tests__/Wallet.test.ts">{`import { describe, it, expect } from 'vitest';
import { Wallet } from '../entities/Wallet';

describe('Wallet withdrawal rules', () => {
  it('charges 5% on a valid withdrawal', () => {
    const wallet = new Wallet('w1', 'usr_1', 10_000);
    expect(wallet.calculateWithdrawalFee(1_000)).toBe(50);
  });

  it('rejects anything over the daily limit', () => {
    const wallet = new Wallet('w1', 'usr_1', 100_000);
    expect(() => wallet.calculateWithdrawalFee(60_000)).toThrowError(/daily withdrawal limit/);
  });
});`}</CodeBlock>

      {/* ── Matrix ────────────────────────────────────────────────────── */}
      <H2 id="matrix">৪. Feature-based vs Domain-driven</H2>

      <Table
        head={["দিক", "Feature-based", "Domain-driven"]}
        rows={[
          [
            "মূল ফোকাস",
            "UI, view ও কম্পোনেন্ট সংগঠন",
            "কোর বিজনেস লজিক ও রুল সুরক্ষা 🟢",
          ],
          [
            "Next.js নির্ভরতা",
            "মাঝারি — App Router ও context সহ",
            "ডোমেইন লেয়ারে শূন্য 🟢",
          ],
          [
            "জটিলতা",
            "ছোট থেকে মাঝারি অ্যাপে সেরা 🟢",
            "জটিল এন্টারপ্রাইজ লজিকে সেরা",
          ],
          [
            "Testability",
            "কম্পোনেন্ট ও RSC টেস্টিং",
            "পিওর ইউনিট টেস্ট, mock ছাড়াই 🟢",
          ],
          [
            "উপযুক্ততা",
            "SaaS, e-commerce, dashboard",
            "FinTech, billing, ERP, calculation engine",
          ],
        ]}
      />

      <Line name="ভুলু ভাই">
        দারুণ ফাহিম! এখন ওয়ালেটের নিয়মগুলো এক জায়গায়, আর সেগুলো টেস্ট করতে ডাটাবেসও লাগছে না। Next.js
        বদলালেও বিজনেস লজিক অক্ষত থাকবে!
      </Line>

      {/* ── Takeaways ─────────────────────────────────────────────────── */}
      <H2 id="takeaway">Production Takeaways</H2>

      <Note>
        <ul>
          <li>
            <strong>Keep the core domain pure:</strong> <code>src/domain/</code>-এ কখনো React,
            Next.js বা কোনো ORM ইমপোর্ট করবেন না — এই একটি নিয়মই বাকি সব সুবিধার উৎস।
          </li>
          <li>
            <strong>Use cases for multi-step workflows:</strong> পেমেন্ট, পেআউট, সাবস্ক্রিপশন
            পরিবর্তনের মতো লজিক সরাসরি server action-এ না লিখে use case ক্লাসে রাখুন।
          </li>
          <li>
            <strong>Apply it selectively:</strong> পুরো অ্যাপে নয় — শুধু জটিল অংশে (billing, wallet
            engine)। বাকি জায়গায় ফিচার-বেজড কাঠামোই যথেষ্ট, নইলে boilerplate-ই মূল খরচ হয়ে দাঁড়াবে।
          </li>
        </ul>
      </Note>
    </article>
  );
}
