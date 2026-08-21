import type { Metadata } from "next";
import { LearnIndex } from "@/components/learn/LearnIndex";

export const metadata: Metadata = {
  title: "Next.js-এর মানচিত্র",
  description:
    "তেইশটি অধ্যায়ে production-level Next.js — architecture থেকে scale পর্যন্ত।",
};

export default function LearnPage() {
  return <LearnIndex />;
}
