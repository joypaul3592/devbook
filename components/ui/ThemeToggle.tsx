"use client";

import { cn } from "@/lib/utils";
import { useTheme } from "@/components/providers/ThemeProvider";

export function ThemeToggle() {
  const { setTheme, resolvedTheme } = useTheme();

  const revealTheme = (nextTheme: "light" | "dark") => {
    if (typeof window === "undefined") {
      setTheme(nextTheme);
      return;
    }

    const doc = document as Document & {
      startViewTransition?: (callback: () => void) => { ready: Promise<void> };
    };

    if (!doc.startViewTransition) {
      setTheme(nextTheme);
      return;
    }

    doc.startViewTransition(() => {
      setTheme(nextTheme);
    });
  };

  const cycleTheme = () => {
    // Simple toggle between light and dark only
    if (resolvedTheme === "light") {
      revealTheme("dark");
    } else {
      revealTheme("light");
    }
  };

  return (
    <button
      onClick={cycleTheme}
      className={cn(
        "relative w-8 h-8 rounded-full flex items-center justify-center cursor-pointer",
        "text-p-ink-3 hover:text-p-ink hover:bg-p-surface-2",
        "transition-all duration-200",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-p-green",
      )}
      title={resolvedTheme === "light" ? "অন্ধকার মোড" : "আলো মোড"}
      aria-label={resolvedTheme === "light" ? "Switch to dark mode" : "Switch to light mode"}
    >
      {/* Sun */}
      <svg
        width="15" height="15" viewBox="0 0 15 15" fill="none"
        className={cn(
          "absolute transition-all duration-300",
          resolvedTheme === "light" ? "opacity-100 rotate-0 scale-100" : "opacity-0 rotate-90 scale-75"
        )}
      >
        <path
          d="M7.5 1.5a.5.5 0 01.5.5v1a.5.5 0 01-1 0V2a.5.5 0 01.5-.5zm0 10a.5.5 0 01.5.5v1a.5.5 0 01-1 0v-1a.5.5 0 01.5-.5zm5.5-4a.5.5 0 010 1h-1a.5.5 0 010-1h1zm-11 0a.5.5 0 010 1H1a.5.5 0 010-1h1zM4.46 4.46a.5.5 0 010 .707l-.707.707a.5.5 0 01-.707-.707L3.753 4.46a.5.5 0 01.707 0zm7.787 7.787a.5.5 0 010 .707l-.707.707a.5.5 0 01-.707-.707l.707-.707a.5.5 0 01.707 0zM4.46 11.54a.5.5 0 01.707 0l.707.707a.5.5 0 11-.707.707l-.707-.707a.5.5 0 010-.707zM12.247 3.753a.5.5 0 01.707 0l.707.707a.5.5 0 01-.707.707l-.707-.707a.5.5 0 010-.707zM7.5 5a2.5 2.5 0 100 5 2.5 2.5 0 000-5z"
          fill="currentColor" fillRule="evenodd" clipRule="evenodd"
        />
      </svg>
      {/* Moon */}
      <svg
        width="13" height="13" viewBox="0 0 13 13" fill="none"
        className={cn(
          "absolute transition-all duration-300",
          resolvedTheme === "dark" ? "opacity-100 rotate-0 scale-100" : "opacity-0 -rotate-90 scale-75"
        )}
      >
        <path
          d="M6.76 1a.5.5 0 01.47.33 5.5 5.5 0 006.44 6.44.5.5 0 01.33.87 6.5 6.5 0 11-7.57-7.57A.5.5 0 016.76 1z"
          fill="currentColor" fillRule="evenodd" clipRule="evenodd"
        />
      </svg>
    </button>
  );
}
