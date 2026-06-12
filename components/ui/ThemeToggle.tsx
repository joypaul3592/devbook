"use client";

import { cn } from "@/lib/utils";
import { useTheme } from "@/components/providers/ThemeProvider";
import { SunIcon, MoonIcon } from "@/components/icons/Icons";

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
        "relative size-8 rounded-[11px] flex items-center justify-center cursor-pointer",
        "bg-secondary ",
        "border border-border dark:border-border-dark hover:border-gray-medium",
        "transition-all duration-200",
        "focus:outline-none focus-visible:ring-2 focus-visible:ring-primary",
      )}
      title={`Current: ${resolvedTheme}`}
      aria-label="Toggle theme"
    >
      {/* Sun Icon */}
      <SunIcon
        className={cn(
          "size-4.5 absolute transition-all duration-300 text-black",
          resolvedTheme === "light"
            ? "opacity-100 rotate-0 scale-100"
            : "opacity-0 rotate-90 scale-0",
        )}
      />

      {/* Moon Icon */}
      <MoonIcon
        className={cn(
          "size-4 absolute transition-all duration-300",
          resolvedTheme === "dark"
            ? "opacity-100 rotate-0 scale-100"
            : "opacity-0 -rotate-90 scale-0",
        )}
      />
    </button>
  );
}
