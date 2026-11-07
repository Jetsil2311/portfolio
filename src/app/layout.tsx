import type { Metadata, Viewport } from "next";
import {
  Bricolage_Grotesque,
  Familjen_Grotesk,
  Fredoka,
  Fraunces,
  Geist_Mono,
  JetBrains_Mono,
  Montserrat,
  Nunito,
} from "next/font/google";
import "./globals.css";
import { themeInitScript } from "./_lib/theme";
import GlassPointer from "./_components/GlassPointer";
import LiquidLens from "./_components/LiquidLens";

// Familjen Grotesk is the page's own voice. Geist Mono is the tools layer.
// The rest are the projects' real typefaces: Fredoka and Nunito (Bubble
// Kaapeh's menu), Bricolage Grotesque (Tally). Nativa's menu uses Georgia and
// Stride uses the iOS system font, so those two load nothing. Montserrat,
// Fraunces and JetBrains Mono are CODEHER's.
const familjen = Familjen_Grotesk({ variable: "--font-familjen", subsets: ["latin"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"], preload: false });
const fredoka = Fredoka({ variable: "--font-fredoka", subsets: ["latin"] });
const nunito = Nunito({ variable: "--font-nunito", subsets: ["latin"], preload: false });
const bricolage = Bricolage_Grotesque({ variable: "--font-bricolage", subsets: ["latin"] });
const montserrat = Montserrat({ variable: "--font-montserrat", subsets: ["latin"] });
const fraunces = Fraunces({ variable: "--font-fraunces", subsets: ["latin"], style: "italic", preload: false });
const jetbrains = JetBrains_Mono({ variable: "--font-jetbrains", subsets: ["latin"], preload: false });

export const metadata: Metadata = {
  title: "Jethro Cruz | Fullstack Developer",
  description:
    "Fullstack developer based in Estado de México, México, who designs and builds what runs Bubble Kaapeh, Nativa, Tally, Stride and CODEHER. Try the real components on this page.",
};

// theme-color is intentionally not set here: the inline theme script owns that
// tag so it can follow the manual light/dark switch (see _lib/theme.ts).
export const viewport: Viewport = {
  colorScheme: "light dark",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    // suppressHydrationWarning: the inline script sets data-theme on <html>
    // before React hydrates, and the world observer sets data-world after.
    <html
      lang="en"
      suppressHydrationWarning
      className={`${familjen.variable} ${geistMono.variable} ${fredoka.variable} ${nunito.variable} ${bricolage.variable} ${montserrat.variable} ${fraunces.variable} ${jetbrains.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col font-sans selection:bg-pop selection:text-on-pop">
        <script dangerouslySetInnerHTML={{ __html: themeInitScript }} />
        <a
          href="#main"
          className="focus-ring fixed top-3 left-3 z-50 -translate-y-20 rounded-full bg-ink px-4 py-2 text-sm font-medium text-canvas transition-transform focus-visible:translate-y-0"
        >
          Skip to content
        </a>
        <LiquidLens />
        <GlassPointer />
        {children}
      </body>
    </html>
  );
}
