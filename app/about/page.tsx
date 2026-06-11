import type { Metadata } from "next";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { FadeIn } from "@/components/motion/FadeIn";
import { Button } from "@/components/ui/Button";

export const metadata: Metadata = {
  title: "পরিচয়",
  description: "আমার সম্পর্কে — একজন বাংলাদেশী ওয়েব ডেভেলপার।",
};

const timeline = [
  { year: "২০২৪", event: "ফ্রিল্যান্সিং শুরু করলাম। প্রথম বড় client project।" },
  { year: "২০২৩", event: "React এবং TypeScript-এ গভীরভাবে ডুব দিলাম।" },
  { year: "২০২২", event: "প্রথম open source contribution। অনেক ছোট, কিন্তু অনেক গর্বের।" },
  { year: "২০২১", event: "Next.js আবিষ্কার করলাম। সব বদলে গেল।" },
  { year: "২০২০", event: "প্রোগ্রামিং শুরু। HTML, CSS, JavaScript — এই পথের শুরু।" },
];

const skills = [
  { category: "Frontend", items: ["React", "Next.js", "TypeScript", "Tailwind CSS", "Framer Motion"] },
  { category: "Backend", items: ["Node.js", "Express", "PostgreSQL", "Prisma", "REST APIs"] },
  { category: "টুলস", items: ["Git", "VS Code", "Figma", "Vercel", "GitHub Actions"] },
  { category: "শিখছি", items: ["Rust", "System Design", "Database Internals"] },
];

export default function AboutPage() {
  return (
    <>
      <Header />

      <main id="main-content" className="pt-24 pb-24">
        <div className="nb-container">
          {/* Hero */}
          <FadeIn>
            <div className="py-14 max-w-2xl">
              <div className="flex items-start gap-6 mb-8">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-nb-accent/30 to-nb-accent-2/30 border-2 border-nb-border flex items-center justify-center shrink-0">
                  <span className="font-serif text-2xl text-nb-accent italic">জ</span>
                </div>
                <div>
                  <h1 className="font-serif text-3xl text-nb-text mb-1">DevBook</h1>
                  <p className="font-bengali text-nb-muted text-sm">ওয়েব ডেভেলপার · বাংলাদেশ</p>
                </div>
              </div>

              <div className="space-y-4 font-bengali text-nb-muted leading-relaxed">
                <p>
                  আমি একজন বাংলাদেশী ওয়েব ডেভেলপার। React, Next.js, এবং TypeScript আমার প্রতিদিনের
                  সঙ্গী। কোড লেখার পাশাপাশি বাংলায় টেকনোলজি নিয়ে লেখা আমার আরেকটি প্যাশন।
                </p>
                <p>
                  এই ব্লগটা আমার ডিজিটাল নোটবুক। যা শিখি, যা ভাঙি, যা আবিষ্কার করি — সব
                  এখানে বাংলায় লিখে রাখি। কারণ আমি বিশ্বাস করি, মাতৃভাষায় শেখা সবচেয়ে গভীর।
                </p>
                <p>
                  বর্তমানে Next.js App Router, Design Systems, এবং TypeScript-এর advanced patterns
                  নিয়ে কাজ করছি।
                </p>
              </div>

              <div className="flex gap-3 mt-8">
                <Button href="/articles" variant="primary">লেখা পড়ুন</Button>
                <Button href="/contact" variant="secondary">যোগাযোগ</Button>
              </div>
            </div>
          </FadeIn>

          {/* Skills */}
          <FadeIn delay={0.1}>
            <div className="border-t border-nb-border pt-14 mb-14">
              <div className="nb-rule mb-10"><span>দক্ষতা</span></div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                {skills.map((group) => (
                  <div key={group.category}>
                    <h3 className="font-bengali text-xs text-nb-subtle uppercase tracking-widest mb-3">
                      {group.category}
                    </h3>
                    <ul className="space-y-1.5">
                      {group.items.map((skill) => (
                        <li key={skill} className="flex items-center gap-2">
                          <div className="w-1 h-1 rounded-full bg-nb-accent shrink-0" />
                          <span className="font-sans text-sm text-nb-muted">{skill}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>
          </FadeIn>

          {/* Timeline */}
          <FadeIn delay={0.15}>
            <div className="border-t border-nb-border pt-14 max-w-xl">
              <div className="nb-rule mb-10"><span>যাত্রা</span></div>
              <div className="relative">
                <div className="absolute left-[52px] top-2 bottom-0 w-px bg-nb-border-2" />
                <div className="space-y-8">
                  {timeline.map((item) => (
                    <div key={item.year} className="flex gap-4 items-start">
                      <span className="font-sans text-xs font-semibold text-nb-subtle w-12 shrink-0 pt-0.5 text-right">
                        {item.year}
                      </span>
                      <div className="w-2 h-2 rounded-full bg-nb-accent shrink-0 mt-1.5 relative z-10" />
                      <p className="font-bengali text-sm text-nb-muted leading-relaxed">{item.event}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </FadeIn>
        </div>
      </main>

      <Footer />
    </>
  );
}
