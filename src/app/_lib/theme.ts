// GUIDE: shared by layout.tsx (the inline script below) and ThemeToggle.tsx.
// The actual colors live in globals.css; this file only decides which theme
// is active by setting `data-theme` on <html>.

export type Theme = "light" | "dark";

export const THEME_STORAGE_KEY = "theme";

// Browser chrome color (mobile address bar), mirrors --canvas in globals.css.
// <meta name="theme-color"> can't read CSS variables, so these are literal.
// The script below owns that single meta tag (instead of Next's `viewport`
// export), so a manual theme choice can't be overridden by a media-query
// version of the tag.
export const THEME_COLORS: Record<Theme, string> = {
  light: "#f8f7f5",
  dark: "#121110",
};

// Runs as an inline <script> before the page paints, so a stored "light"
// choice never flashes dark (or vice versa) while React loads. With no stored
// choice it follows the OS setting, including live changes to it.
export const themeInitScript = `(function () {
  try {
    var root = document.documentElement;
    var media = window.matchMedia("(prefers-color-scheme: dark)");
    var colors = ${JSON.stringify(THEME_COLORS)};
    var apply = function (theme) {
      root.dataset.theme = theme;
      var meta = document.querySelector('meta[name="theme-color"]');
      if (!meta) {
        meta = document.createElement("meta");
        meta.setAttribute("name", "theme-color");
        document.head.appendChild(meta);
      }
      meta.setAttribute("content", colors[theme]);
    };
    var stored = localStorage.getItem("${THEME_STORAGE_KEY}");
    apply(stored === "light" || stored === "dark" ? stored : media.matches ? "dark" : "light");
    media.addEventListener("change", function (event) {
      if (!localStorage.getItem("${THEME_STORAGE_KEY}")) apply(event.matches ? "dark" : "light");
    });
  } catch (error) {}
})();`;
