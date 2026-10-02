// GUIDE: copies the email address to the clipboard. mailto: links often do
// nothing on recruiters' machines (no mail app configured), so this is the
// reliable path. The label change is announced via aria-live, and the
// confirmation resets itself after two seconds.

"use client";

import { Check, Copy } from "lucide-react";
import { useEffect, useState } from "react";

export default function CopyEmail({ email }: { email: string }) {
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!copied) return;
    const timer = setTimeout(() => setCopied(false), 2000);
    return () => clearTimeout(timer);
  }, [copied]);

  async function copy() {
    try {
      await navigator.clipboard.writeText(email);
      setCopied(true);
    } catch {
      // clipboard blocked: the address is still shown on the page to select
    }
  }

  return (
    <button
      type="button"
      onClick={copy}
      className="focus-ring inline-flex h-11 items-center gap-2 rounded-full border border-line px-5 text-sm font-medium text-ink transition-colors duration-200 hover:bg-ink/5 active:scale-[0.98]"
    >
      {copied ? (
        <Check className="size-4 text-accent-ink" aria-hidden />
      ) : (
        <Copy className="size-4" aria-hidden />
      )}
      <span aria-live="polite">{copied ? "Copied" : "Copy Email"}</span>
    </button>
  );
}
