import type { ReactNode } from "react";
// import { Header } from "@/components/layout/Header";
import { LearnShell } from "@/components/learn/LearnShell";

/* Height of the sticky site header above this section.
   Header রেন্ডার করলে "3.75rem" করে দাও — sidebar আর TOC ওই মাপে নিচে বসবে। */
const HEADER_H = "0rem";

export default function LearnLayout({ children }: { children: ReactNode }) {
  return (
    <>
      {/* <Header /> */}
      <main
        id="main-content"
        className="flex-1 flex"
        style={{ ["--learn-top" as string]: HEADER_H }}
      >
        <LearnShell>{children}</LearnShell>
      </main>
    </>
  );
}
