// The email is shown as readable text, not only behind a mailto: link, since
// mailto: often doesn't open anything on a recruiter's machine. <CopyEmail> is
// the only part that ships JS.

import { ArrowUpRight, Download } from "lucide-react";
import { FaGithub, FaLinkedin } from "react-icons/fa";
import { LOCATION } from "@/app/_lib/data";
import CopyEmail from "./CopyEmail";

const EMAIL = "jethrosiloe26@gmail.com";

const profiles = [
  { href: "https://github.com/jetsil2311", label: "GitHub", icon: FaGithub },
  { href: "https://linkedin.com/in/jethrocruz", label: "LinkedIn", icon: FaLinkedin },
  { href: "/cv.pdf", label: "Download CV", icon: Download },
];

export default function Contact() {
  return (
    <section id="contact" data-world="base" aria-labelledby="contact-title" className="scroll-mt-20 pb-20 sm:pb-28">
      <div className="reveal mx-auto max-w-[1500px] border-t border-line px-5 pt-16 sm:px-8 sm:pt-24">
        <h2 id="contact-title" className="max-w-4xl text-[clamp(2.25rem,5vw,4.75rem)] leading-[1.04] font-medium tracking-[-0.03em] text-balance">
          Hiring a fullstack developer?
        </h2>
        <p className="mt-5 max-w-[48ch] text-lg leading-relaxed text-pretty text-muted">
          I&apos;m based in {LOCATION} and open to remote roles. Email is the fastest way to reach me.
        </p>

        <a
          href={`mailto:${EMAIL}`}
          className="group focus-ring mt-10 inline-flex max-w-full items-center gap-3 rounded-sm text-[clamp(1.375rem,4.4vw,3.75rem)] font-medium tracking-[-0.025em] break-all text-ink underline decoration-line decoration-2 underline-offset-[0.2em] transition-colors duration-200 hover:decoration-ink"
        >
          {EMAIL}
          <ArrowUpRight
            className="size-6 shrink-0 transition-transform duration-300 ease-out-expo group-hover:translate-x-0.5 group-hover:-translate-y-0.5 sm:size-9"
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
                className="focus-ring glass inline-flex h-11 items-center gap-2 rounded-full px-5 text-sm font-medium text-ink"
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
