// GUIDE: Simplest version: just links (email, GitHub, LinkedIn) — a Server
// Component, no JS needed.
//
// LEVEL UP: if you want an actual contact *form* (fields + submit), that's
// where Next.js Server Actions shine: write an async function, mark it
// `"use server"`, pass it straight to a <form action={...}>, and Next.js
// handles the POST/mutation for you with no separate API route or client-side
// fetch call. Docs: node_modules/next/dist/docs/01-app/01-getting-started/07-mutating-data.md

import { Mail } from "lucide-react";
import { FaGithub, FaLinkedin } from "react-icons/fa";
import { SectionHeader } from "./SectionHeader";

// Same glass-button treatment as Projects.tsx's repo/demo icon links, so the
// GitHub/LinkedIn buttons here read as the same material, not a one-off.
const GLASS = "border border-white/10 bg-white/5 backdrop-blur-md";
const ICON_GLOW = "hover:shadow-[0_0_20px_3px_var(--color-accent)]/35";

export default function Contact() {
  return (
    <section
      id="contact"
      className="relative scroll-mt-16 px-6 py-24 sm:px-8"
    >
      {/* Ambient glows — continues the alternating corner rhythm from
          Hero/Projects/Experience down the page. */}
      <div className="pointer-events-none absolute -top-20 -left-20 h-150 w-150 rounded-full bg-orange-500 opacity-15 blur-[200px]" />
      <div className="pointer-events-none absolute -bottom-20 -right-20 h-150 w-150 rounded-full bg-purple-600 opacity-15 blur-[200px]" />

      {/* Padding lives on the section, not this div, and this div carries no
          horizontal padding of its own — same split as Experience.tsx — so
          both sections' max-w-6xl boxes land on identical edges and their
          (text-right) SectionHeaders line up horizontally. */}
      <div className="relative mx-auto max-w-6xl">
        <SectionHeader>Contact Me</SectionHeader>

        {/* TODO: swap in your real pitch */}
        <p className="mt-4 max-w-xl text-zinc-300">
          Open to remote fullstack roles and new opportunities — reach out directly
          or find me on GitHub and LinkedIn.
        </p>

        <div className="mt-6 flex flex-wrap items-center gap-4">
          {/* TODO: swap in your real email */}
          <a
            href="mailto:jethrosiloe26@gmail.com"
            className="flex items-center gap-2 rounded-full bg-purple-600 px-5 py-2.5 text-sm font-medium text-white shadow-[0_0_20px_rgba(152.19,15.74,250.25,0.8)] transition-all duration-500 ease-out hover:px-6 hover:py-2 hover:shadow-[0_0_35px_rgba(152.19,15.74,250.25,1)]"
          >
            <Mail className="h-4 w-4" />
            Send an Email
          </a>

          {/* TODO: swap in your real GitHub URL */}
          <a
            href="https://github.com/jetsil2311"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="View GitHub profile"
            className={`
              flex h-11 w-11 items-center justify-center rounded-full
              ${GLASS} text-slate-200
              transition-all duration-300 ease-out
              hover:border-accent/60 hover:bg-accent/15 hover:text-accent
              ${ICON_GLOW}
              focus-visible:outline-2 focus-visible:outline-accent
            `}
          >
            <FaGithub className="h-5 w-5" />
          </a>

          {/* TODO: swap in your real LinkedIn URL */}
          <a
            href="https://linkedin.com/in/jethrocruz"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="View LinkedIn profile"
            className={`
              flex h-11 w-11 items-center justify-center rounded-full
              ${GLASS} text-slate-200
              transition-all duration-300 ease-out
              hover:border-accent/60 hover:bg-accent/15 hover:text-accent
              ${ICON_GLOW}
              focus-visible:outline-2 focus-visible:outline-accent
            `}
          >
            <FaLinkedin className="h-5 w-5" />
          </a>
        </div>
      </div>
    </section>
  );
}
