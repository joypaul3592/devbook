import type { Metadata } from "next";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { FadeIn } from "@/components/motion/FadeIn";
import { ContactForm } from "@/components/blog/ContactForm";

export const metadata: Metadata = {
  title: "যোগাযোগ",
  description: "আমার সাথে যোগাযোগ করুন।",
};

export default function ContactPage() {
  return (
    <>
      <Header />

      <main id="main-content" className="pt-24 pb-24">
        <div className="nb-container">
          <FadeIn>
            <div className="py-12 border-b border-nb-border mb-14">
              <div className="flex items-center gap-3 mb-4">
                <div className="nb-reading-marker" />
                <span className="font-bengali text-xs text-nb-subtle tracking-widest uppercase">যোগাযোগ</span>
              </div>
              <h1 className="font-serif text-3xl md:text-4xl text-nb-text mb-3">কথা বলুন</h1>
              <p className="font-bengali text-nb-muted leading-relaxed max-w-lg">
                প্রশ্ন, মন্তব্য, অথবা শুধু হ্যালো বলতে চাইলে — আমি সবসময় শুনতে প্রস্তুত।
              </p>
            </div>
          </FadeIn>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-start">
            {/* Contact form */}
            <FadeIn delay={0.1}>
              <ContactForm />
            </FadeIn>

            {/* Social links */}
            <FadeIn delay={0.2}>
              <div className="space-y-6">
                <div>
                  <h2 className="font-bengali text-sm font-semibold text-nb-text mb-4 pb-2 border-b border-nb-border">
                    অন্য মাধ্যমে
                  </h2>
                  <div className="space-y-3">
                    {[
                      { name: "Email", value: "hello@devbook.dev", href: "mailto:hello@devbook.dev" },
                      { name: "GitHub", value: "@devbook", href: "https://github.com" },
                      { name: "Twitter / X", value: "@devbook_bn", href: "https://twitter.com" },
                      { name: "LinkedIn", value: "DevBook", href: "https://linkedin.com" },
                    ].map((social) => (
                      <a
                        key={social.name}
                        href={social.href}
                        target={social.href.startsWith("http") ? "_blank" : undefined}
                        rel={social.href.startsWith("http") ? "noopener noreferrer" : undefined}
                        className="flex items-center justify-between py-2.5 px-3 rounded-lg border border-nb-border-2 hover:border-nb-border hover:bg-nb-surface transition-all duration-200 group"
                      >
                        <span className="font-sans text-xs text-nb-muted">{social.name}</span>
                        <span className="font-sans text-xs text-nb-text group-hover:text-nb-accent transition-colors">{social.value}</span>
                      </a>
                    ))}
                  </div>
                </div>

                <div className="nb-callout">
                  <p className="font-bengali text-sm text-nb-muted leading-relaxed">
                    সাধারণত ২৪–৪৮ ঘণ্টার মধ্যে জবাব দিই। বাংলা বা ইংরেজি
                    যেকোনো ভাষায় লিখতে পারেন।
                  </p>
                </div>
              </div>
            </FadeIn>
          </div>
        </div>
      </main>

      <Footer />
    </>
  );
}
