// GUIDE: a tiny Client Component that turns the mouse position into CSS
// variables on its own element, so pointer effects can be written as plain
// Tailwind/CSS (see `parallax`, `text-shine` and `spotlight` in globals.css):
//   --mx / --my  pointer position in px, relative to this element
//   --px / --py  the same, normalized to -1..1 (center = 0)
// It never touches React state: the values are written straight to the DOM
// once per animation frame, so moving the mouse doesn't re-render anything.
// Children stay Server Components; only this wrapper ships JS.
//
// Mouse only: touch and pen pointers are ignored, so nothing "sticks" after
// a tap on mobile.

"use client";

import { useRef, type PointerEvent, type ReactNode } from "react";

type Props = {
  as?: "div" | "section" | "li";
  id?: string;
  className?: string;
  "aria-labelledby"?: string;
  children: ReactNode;
};

export default function PointerSurface({ as: Tag = "div", children, ...rest }: Props) {
  const frame = useRef(0);

  function track(event: PointerEvent<HTMLElement>) {
    if (event.pointerType !== "mouse") return;
    const el = event.currentTarget;
    const { clientX, clientY } = event;

    cancelAnimationFrame(frame.current);
    frame.current = requestAnimationFrame(() => {
      const rect = el.getBoundingClientRect();
      const x = clientX - rect.left;
      const y = clientY - rect.top;
      el.style.setProperty("--mx", `${x.toFixed(1)}px`);
      el.style.setProperty("--my", `${y.toFixed(1)}px`);
      el.style.setProperty("--px", ((x / rect.width) * 2 - 1).toFixed(3));
      el.style.setProperty("--py", ((y / rect.height) * 2 - 1).toFixed(3));
    });
  }

  function reset(event: PointerEvent<HTMLElement>) {
    cancelAnimationFrame(frame.current);
    event.currentTarget.style.setProperty("--px", "0");
    event.currentTarget.style.setProperty("--py", "0");
  }

  return (
    <Tag onPointerMove={track} onPointerLeave={reset} {...rest}>
      {children}
    </Tag>
  );
}
