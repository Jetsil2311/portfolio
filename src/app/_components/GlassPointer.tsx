// One delegated listener for every glass control: it writes the pointer's
// position onto whichever `.glass` is under it, and globals.css draws the
// highlight there. No React state, so moving the mouse renders nothing.

"use client";

import { useEffect } from "react";

export default function GlassPointer() {
  useEffect(() => {
    let frame = 0;
    const move = (event: PointerEvent) => {
      if (event.pointerType !== "mouse") return;
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        const el = (event.target as Element | null)?.closest?.<HTMLElement>(".glass");
        if (!el) return;
        const rect = el.getBoundingClientRect();
        el.style.setProperty("--gx", `${event.clientX - rect.left}px`);
        el.style.setProperty("--gy", `${event.clientY - rect.top}px`);
      });
    };
    document.addEventListener("pointermove", move, { passive: true });
    return () => {
      document.removeEventListener("pointermove", move);
      cancelAnimationFrame(frame);
    };
  }, []);

  return null;
}
