import type { Metadata } from "next";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { FadeIn, FadeInStagger, FadeInChild } from "@/components/motion/FadeIn";
import { projects } from "@/lib/data";
import { cn } from "@/lib/utils";

export const metadata: Metadata = {
  title: "প্রজেক্ট",
  description: "আমার তৈরি প্রজেক্টসমূহ।",
};

const statusLabel = {
  active: { label: "সক্রিয়", color: "text-nb-accent bg-nb-accent/10 border-nb-accent/20" },
  wip: { label: "চলমান", color: "text-amber-600 bg-amber-500/10 border-amber-500/20 dark:text-amber-400" },
  archived: { label: "সংরক্ষিত", color: "text-nb-muted bg-nb-surface-2 border-nb-border" },
};

export default function ProjectsPage() {
  return (
    <>
      <Header />

      <main id="main-content" className="pt-24 pb-24">
        <div className="nb-container">
          <FadeIn>
            <div className="py-12 border-b border-nb-border mb-12">
              <div className="flex items-center gap-3 mb-4">
                <div className="nb-reading-marker" />
                <span className="font-bengali text-xs text-nb-subtle tracking-widest uppercase">নির্মাণশালা</span>
              </div>
              <h1 className="font-serif text-3xl md:text-4xl text-nb-text mb-3">প্রজেক্ট</h1>
              <p className="font-bengali text-nb-muted leading-relaxed">
                যা তৈরি করেছি, করছি, এবং করতে চাই।
              </p>
            </div>
          </FadeIn>

          <FadeInStagger className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {projects.map((project) => {
              const status = statusLabel[project.status];
              return (
                <FadeInChild key={project.slug}>
                  <div className="group rounded-xl border border-nb-border bg-nb-surface overflow-hidden hover:border-nb-accent/30 hover:shadow-[var(--nb-shadow)] transition-all duration-300 flex flex-col">
                    <div className={cn("h-24 bg-gradient-to-br", project.gradient)} />
                    <div className="p-5 flex-1 flex flex-col">
                      <div className="flex items-start justify-between mb-2">
                        <h3 className="font-sans font-semibold text-nb-text text-sm group-hover:text-nb-accent transition-colors">
                          {project.name}
                        </h3>
                        <span className={cn("text-[10px] font-medium px-2 py-0.5 rounded-full border shrink-0 ml-2", status.color)}>
                          {status.label}
                        </span>
                      </div>
                      <p className="font-bengali text-xs text-nb-muted leading-relaxed mb-4 flex-1">
                        {project.description}
                      </p>
                      <div className="flex flex-wrap gap-1.5 mb-4">
                        {project.tech.map((t) => (
                          <span key={t} className="font-sans text-[10px] text-nb-subtle bg-nb-surface-2 border border-nb-border px-2 py-0.5 rounded-full">
                            {t}
                          </span>
                        ))}
                      </div>
                      <div className="flex items-center gap-3 pt-3 border-t border-nb-border-2">
                        <span className="nb-timestamp">{project.year}</span>
                        {project.github && (
                          <a href={project.github} target="_blank" rel="noopener noreferrer"
                            className="font-sans text-xs text-nb-muted hover:text-nb-text transition-colors ml-auto flex items-center gap-1">
                            GitHub
                            <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                              <path d="M2 2h6v6M8 2L2 8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                            </svg>
                          </a>
                        )}
                      </div>
                    </div>
                  </div>
                </FadeInChild>
              );
            })}
          </FadeInStagger>
        </div>
      </main>

      <Footer />
    </>
  );
}
