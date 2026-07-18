import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

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
  // TODO: replace with your name / role, e.g. "Jane Doe — Fullstack Developer"
  title: "Jethro Cruz — Fullstack Developer",
  // TODO: one sentence recruiters (and search engines) will actually read
  description: "Fullstack Developer with a passion for building web solutions.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
