// GUIDE: The first thing a recruiter sees. Keep it to: who you are, what you
// build, and a link to scroll/jump to Projects or Contact. This is a Server
// Component by default — it renders to HTML on the server/at build time, so
// this text is visible to search engines and in "view source" with no JS
// required. Good for anything that isn't interactive.

import { Download } from "lucide-react";

export default function Hero() {
  return (
    <section
      id="hero"
      className="relative flex min-h-[70vh] scroll-mt-16 flex-col items-center pt-28 justify-center gap-4 text-center"
    >

            
      {/* Purple glow - top right */}
      <div className="absolute top-0 right-0 w-150 h-150 bg-purple-600 rounded-full opacity-15 pointer-events-none" 
        style={{ filter: 'blur(200px)' }}
      />
      
      {/* Salmon glow - bottom left */}
      <div className="absolute bottom-0 left-0 w-150 h-150 bg-orange-500 rounded-full opacity-15 pointer-events-none" 
        style={{ filter: 'blur(250px)' }}
      />

      {/* TODO: your name */}
      <h1 className="text-4xl font-semibold tracking-tight sm:text-6xl " 
        style={{
          textShadow: '0 0 30px rgba(168, 85, 247, 0.8), 0 0 60px rgba(168, 85, 247, 0.4)'
      }}
      >
        Jethro Siloe Cruz Castillo
      </h1>
      {/* TODO: one-line pitch, e.g. "Fullstack developer building fast, accessible web apps." */}
      <p className="max-w-xl mt-3 text-xl font-semibold text-zinc-600 dark:text-purple-400">
        Fullstack Web Developer
      </p>
      <p className="max-w-xl text-lg text-zinc-600 dark:text-slate-400">
        Building fullstack solutions that solve real problems. 
        From mobile apps to web platforms, I focus on clean code and user experience.
      </p>
      <div className="flex gap-12 items-center justify-center">
      <a
        href="#projects"
        className="mt-4 rounded-full bg-foreground px-5 py-2.5 hover:px-6 hover:py-2 text-sm font-medium text-background shadow-[0_0_20px_rgba(226,232,240,0.5)] hover:shadow-[0_0_35px_rgba(226,232,240,0.6)] transition-all duration-500 ease-out "
      >
        View my work
      </a>
      <a
        href="/cv.pdf"
        target="_blank"
        rel="noopener noreferrer"
        className="mt-4 rounded-full bg-purple-600 px-5 py-2.5 hover:px-6 hover:py-2 text-sm font-medium shadow-[0_0_20px_rgba(152.19,15.74,250.25,0.8)] hover:shadow-[0_0_35px_rgba(152.19,15.74,250.25,1)] transition-all duration-500 ease-out flex items-center gap-2 whitespace-nowrap"
      >
        Download CV 
        <Download className="w-4 hover:w-5" />
      </a>
      </div>
    </section>
  );
}
