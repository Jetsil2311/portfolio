// GUIDE: the nav's section links, with a pill that slides to the section
// currently in view (scroll-spy). Client Component because it observes the
// page. It uses IntersectionObserver rather than a scroll listener: the
// browser reports when a section crosses the middle of the viewport, so no
// work happens per scroll frame. The pill is positioned by writing styles to
// it directly (no extra re-render), and only `translate`, `width` and
// `opacity` animate.

"use client";

import { useEffect, useRef, useState } from "react";

const links = [
  { id: "skills", label: "Skills" },
  { id: "projects", label: "Projects" },
  { id: "experience", label: "Experience" },
  { id: "contact", label: "Contact" },
];

export default function NavLinks() {
  const [active, setActive] = useState<string | null>(null);
  const listRef = useRef<HTMLUListElement>(null);
  const pillRef = useRef<HTMLSpanElement>(null);

  // which section is in the middle band of the viewport ("hero" = none)
  useEffect(() => {
    const ids = ["hero", ...links.map((link) => link.id)];
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setActive(entry.target.id === "hero" ? null : entry.target.id);
          }
        }
      },
      { rootMargin: "-45% 0px -54% 0px" },
    );
    for (const id of ids) {
      const section = document.getElementById(id);
      if (section) observer.observe(section);
    }
    return () => observer.disconnect();
  }, []);

  // move the pill under the active link; re-measure when the list resizes
  useEffect(() => {
    const list = listRef.current;
    const pill = pillRef.current;
    if (!list || !pill) return;

    const place = () => {
      const link = active
        ? list.querySelector<HTMLAnchorElement>(`a[href="#${active}"]`)
        : null;
      if (!link) {
        pill.style.opacity = "0";
        return;
      }
      pill.style.translate = `${link.offsetLeft}px 0`;
      pill.style.width = `${link.offsetWidth}px`;
      pill.style.opacity = "1";
    };

    place();
    const resize = new ResizeObserver(place);
    resize.observe(list);
    return () => resize.disconnect();
  }, [active]);

  return (
    <ul ref={listRef} className="relative flex items-center">
      <span
        ref={pillRef}
        aria-hidden
        className="absolute inset-y-0 left-0 rounded-full bg-ink/8 opacity-0 transition-[translate,width,opacity] duration-500 ease-out-expo motion-reduce:transition-none"
      />
      {links.map((link) => (
        // no `relative` here: the links must measure their offset from the
        // <ul> (the pill's container), not from their own <li>
        <li key={link.id}>
          <a
            href={`#${link.id}`}
            aria-current={active === link.id ? "true" : undefined}
            className="focus-ring relative block rounded-full px-1.5 py-2 text-[0.8125rem] text-muted transition-colors duration-200 hover:text-ink aria-[current]:text-ink sm:px-3.5 sm:text-sm"
          >
            {link.label}
          </a>
        </li>
      ))}
    </ul>
  );
}
