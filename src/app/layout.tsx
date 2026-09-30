import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { themeInitScript } from "./_lib/theme";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

// GUIDE: `layout.tsx` at the root of `app/` is the Root Layout — it's required,
// renders once, and wraps every page. Put things here that truly belong on
// every route: <html>/<body>, global fonts, global CSS, and default <head>
// metadata. Since this portfolio is a single page, you likely won't add more
// layouts, but if you ever add nested routes (e.g. app/blog/), you can drop
// another layout.tsx inside that folder and it nests inside this one.
//
// `metadata` is a special exported const Next.js reads to build the <head>
// tags for you (title, description, OG tags, etc.) — no <Header> component
// needed. Docs: node_modules/next/dist/docs/01-app/01-getting-started/14-metadata-and-og-images.md
export const metadata: Metadata = {
  title: "Jethro Cruz | Fullstack Developer",
  description:
    "Fullstack developer building production React, Next.js and Node apps for real businesses: ordering platforms, POS systems and iOS apps.",
};

// `viewport` is the sibling of `metadata` for <meta name="viewport">.
// theme-color is intentionally not set here: the inline theme script owns
// that tag so it can follow the manual light/dark switch (see _lib/theme.ts).
export const viewport: Viewport = {
  colorScheme: "light dark",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    // suppressHydrationWarning: the inline theme script adds `data-theme` to
    // <html> before React hydrates, so the server HTML intentionally differs
    // on this one element (and only its attributes; children are unaffected).
    <html
      lang="en"
      suppressHydrationWarning
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col bg-canvas font-sans text-ink selection:bg-accent selection:text-on-accent">
        <script dangerouslySetInnerHTML={{ __html: themeInitScript }} />
        <a
          href="#main"
          className="focus-ring fixed top-3 left-3 z-50 -translate-y-20 rounded-full bg-ink px-4 py-2 text-sm font-medium text-canvas transition-transform focus-visible:translate-y-0"
        >
          Skip to content
        </a>
        {children}
      </body>
    </html>
  );
}
