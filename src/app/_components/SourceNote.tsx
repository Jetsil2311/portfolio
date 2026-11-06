// Small tools-layer caption under a demo. Says what is real and links to it.

import type { ReactNode } from "react";

export default function SourceNote({ href, file, children }: { href?: string; file?: string; children: ReactNode }) {
  return (
    <p className="max-w-[72ch] font-mono text-xs leading-relaxed text-muted">
      {children}
      {file && (
        <>
          {" "}
          {href ? (
            <a
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              className="focus-ring rounded-sm text-ink underline decoration-line underline-offset-3 transition-colors hover:decoration-ink"
            >
              {file}
            </a>
          ) : (
            <span className="text-ink">{file}</span>
          )}
        </>
      )}
    </p>
  );
}
