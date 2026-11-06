// Watches which section crosses the middle of the viewport and applies its
// `data-world` to <html>. globals.css does the rest: the color tokens are
// registered properties, so the entire page animates to the new values.
// IntersectionObserver means no work per scroll frame.

"use client";

import { useEffect } from "react";

export function applyWorld(world: string) {
  const root = document.documentElement;
  if (root.dataset.world === world) return;
  root.dataset.world = world;
  const canvas = getComputedStyle(root).getPropertyValue("--canvas");
  // the browser bar follows the world, using the target value once it settles
  window.setTimeout(() => {
    const value = getComputedStyle(root).getPropertyValue("--canvas").trim() || canvas;
    document.querySelector('meta[name="theme-color"]')?.setAttribute("content", value);
  }, 950);
}

export default function WorldObserver() {
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          const world = (entry.target as HTMLElement).dataset.world;
          if (entry.isIntersecting && world) applyWorld(world);
        }
      },
      { rootMargin: "-50% 0px -49.9% 0px" },
    );
    document.querySelectorAll("[data-world]").forEach((section) => {
      if (section !== document.documentElement) observer.observe(section);
    });
    return () => observer.disconnect();
  }, []);

  return null;
}
