import type { Metadata } from "next";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { FadeIn } from "@/components/motion/FadeIn";

export const metadata: Metadata = {
  title: "টুলস ও সেটআপ",
  description: "আমি যে টুলস, হার্ডওয়্যার, এবং সফটওয়্যার ব্যবহার করি।",
};

const usesSections = [
  {
    title: "হার্ডওয়্যার",
    items: [
      { name: "MacBook Pro M2", desc: "মূল কাজের মেশিন। অবিশ্বাস্য পারফরম্যান্স।" },
      { name: "আইফোন ১৫", desc: "ফটো, নোটস, এবং সবসময়ের সঙ্গী।" },
      { name: "AirPods Pro", desc: "Noise cancellation ছাড়া কোড লেখা কল্পনাও করি না।" },
    ],
  },
  {
    title: "এডিটর",
    items: [
      { name: "VS Code", desc: "প্রতিদিনের এডিটর। Vim keybindings সহ।" },
      { name: "Cursor", desc: "AI-assisted coding-এর জন্য। Claude-powered।" },
      { name: "Neovim", desc: "Terminal-এ ছোট edits-এর জন্য।" },
    ],
  },
  {
    title: "টার্মিনাল",
    items: [
      { name: "Warp", desc: "Modern terminal। AI features আছে।" },
      { name: "Oh My Zsh", desc: "Zsh কনফিগারেশনের জন্য।" },
      { name: "Starship", desc: "Beautiful prompt।" },
    ],
  },
  {
    title: "ডিজাইন",
    items: [
      { name: "Figma", desc: "UI design এবং prototyping।" },
      { name: "Excalidraw", desc: "দ্রুত ডায়াগ্রাম আঁকার জন্য।" },
    ],
  },
  {
    title: "অ্যাপস",
    items: [
      { name: "Notion", desc: "নোটস, planning, এবং জ্ঞান সংরক্ষণ।" },
      { name: "Linear", desc: "প্রজেক্ট ট্র্যাকিং।" },
      { name: "Raycast", desc: "Spotlight-এর বিকল্প। অনেক বেশি শক্তিশালী।" },
      { name: "Arc Browser", desc: "প্রিয় ব্রাউজার।" },
    ],
  },
];

export default function UsesPage() {
  return (
    <>
      <Header />

      <main id="main-content" className="pt-24 pb-24">
        <div className="nb-container">
          <FadeIn>
            <div className="py-12 border-b border-nb-border mb-14">
              <div className="flex items-center gap-3 mb-4">
                <div className="nb-reading-marker" />
                <span className="font-bengali text-xs text-nb-subtle tracking-widest uppercase">সরঞ্জাম</span>
              </div>
              <h1 className="font-serif text-3xl md:text-4xl text-nb-text mb-3">টুলস ও সেটআপ</h1>
              <p className="font-bengali text-nb-muted leading-relaxed">
                আমার ডেভেলপমেন্ট পরিবেশ এবং প্রতিদিনের সঙ্গী যন্ত্রপাতি।
              </p>
            </div>
          </FadeIn>

          <div className="max-w-2xl space-y-12">
            {usesSections.map((section, i) => (
              <FadeIn key={section.title} delay={i * 0.08}>
                <div>
                  <h2 className="font-bengali text-sm font-semibold text-nb-text mb-5 pb-2 border-b border-nb-border">
                    {section.title}
                  </h2>
                  <div className="space-y-4">
                    {section.items.map((item) => (
                      <div key={item.name} className="flex gap-4">
                        <div className="w-1.5 h-1.5 rounded-full bg-nb-accent mt-2.5 shrink-0" />
                        <div>
                          <h3 className="font-sans text-sm font-medium text-nb-text">{item.name}</h3>
                          <p className="font-bengali text-xs text-nb-muted leading-relaxed mt-0.5">{item.desc}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </main>

      <Footer />
    </>
  );
}
