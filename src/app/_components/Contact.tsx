// GUIDE: Links (email, GitHub, LinkedIn) plus a copy-to-clipboard button.
// Server Component; only <CopyEmail> ships JS. The email is also shown as
// readable text, not only behind a mailto: link, since mailto: often
// doesn't open anything on a recruiter's machine.
//
// LEVEL UP: for an actual contact *form*, use a Server Action: an async
// function marked "use server" passed straight to <form action={...}>.
// Docs: node_modules/next/dist/docs/01-app/01-getting-started/07-mutating-data.md

import { ArrowUpRight } from "lucide-react";
import { FaGithub, FaLinkedin } from "react-icons/fa";
import CopyEmail from "./CopyEmail";

const EMAIL = "jethrosiloe26@gmail.com";

const profiles = [
  { href: "https://github.com/jetsil2311", label: "GitHub", icon: FaGithub },
  { href: "https://linkedin.com/in/jethrocruz", label: "LinkedIn", icon: FaLinkedin },
];

export default function Contact() {
  return (
    <section
      id="contact"
      aria-labelledby="contact-title"
      className="scroll-mt-24 border-t border-line py-24 sm:py-32"
    >
      <div className="reveal mx-auto max-w-6xl px-5 sm:px-8">
        <h2
          id="contact-title"
          className="max-w-3xl text-4xl font-semibold tracking-tighter text-balance text-ink sm:text-6xl"
        >
          Hiring a fullstack developer?
        </h2>
        <p className="mt-5 max-w-[48ch] text-lg leading-relaxed text-pretty text-muted">
          I&apos;m open to remote fullstack roles. Email is the fastest way to
          reach me, or find my work on GitHub and LinkedIn.
        </p>

        <a
          href={`mailto:${EMAIL}`}
          className="group focus-ring mt-10 inline-flex max-w-full items-center gap-3 rounded-sm text-2xl font-medium tracking-tight break-all text-ink underline decoration-line decoration-2 underline-offset-8 transition-colors duration-200 hover:decoration-accent sm:text-4xl"
        >
          {EMAIL}
          <ArrowUpRight
            className="size-6 shrink-0 text-accent-ink transition-transform duration-300 ease-out-expo group-hover:translate-x-0.5 group-hover:-translate-y-0.5 sm:size-8"
            aria-hidden
          />
        </a>

        <ul className="mt-10 flex flex-wrap gap-3">
          <li>
            <CopyEmail email={EMAIL} />
          </li>
          {profiles.map(({ href, label, icon: Icon }) => (
            <li key={label}>
              <a
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                className="focus-ring inline-flex h-11 items-center gap-2 rounded-full border border-line px-5 text-sm font-medium text-ink transition-colors duration-200 hover:bg-ink/5"
              >
                <Icon className="size-4" aria-hidden />
                {label}
              </a>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
