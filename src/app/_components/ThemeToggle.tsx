// GUIDE: the only Client Component in the nav, because it needs an onClick.
// It holds no React state: the current theme lives on <html data-theme>,
// which the inline script in layout.tsx sets before paint. Reading it from
// the DOM on click (instead of mirroring it in useState) means the server and
// client render identical markup, so there's no hydration mismatch and no
// flash. Which icon shows is decided by CSS via the `dark:` variant.

"use client";

import { Moon, Sun } from "lucide-react";
import { THEME_COLORS, THEME_STORAGE_KEY, type Theme } from "@/app/_lib/theme";

export default function ThemeToggle() {
  function toggleTheme() {
    const root = document.documentElement;
    const next: Theme = root.dataset.theme === "dark" ? "light" : "dark";

    const apply = () => {
      root.dataset.theme = next;
      document
        .querySelector('meta[name="theme-color"]')
        ?.setAttribute("content", THEME_COLORS[next]);
    };

    try {
      localStorage.setItem(THEME_STORAGE_KEY, next);
    } catch {
      // storage blocked (private mode etc.): the switch still works for this visit
    }

    // Crossfade the whole page where the View Transitions API exists,
    // unless the visitor prefers reduced motion.
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!reduceMotion && document.startViewTransition) {
      document.startViewTransition(apply);
    } else {
      apply();
    }
  }

  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label="Toggle dark mode"
      title="Toggle dark mode"
      className="focus-ring flex size-9 shrink-0 items-center justify-center rounded-full text-muted transition-colors duration-200 hover:bg-ink/5 hover:text-ink active:scale-95"
    >
      <Sun className="hidden size-4 dark:block" aria-hidden />
      <Moon className="size-4 dark:hidden" aria-hidden />
    </button>
  );
}
