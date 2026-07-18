// GUIDE: `app/page.tsx` is a Next.js special file — putting a `page.tsx`
// directly inside `app/` makes it the component rendered at `/`. There's
// no separate router config to touch; the file's *location* in `app/` is
// the route. Docs: node_modules/next/dist/docs/01-app/03-api-reference/03-file-conventions/page.md
//
// Since this is a single scrollable page, "routing" is basically done: one
// page.tsx, composed of section components that live in `_components/`
// (underscore-prefixed = private folder, opted out of routing — see the
// guide comment in `_lib/data.ts`). Each section is its own file so it's
// easy to find, edit, and eventually make interactive independently.
//
// This file (and every section it renders) is a Server Component by
// default — no "use client" directive anywhere yet. That's the right
// starting point: it means zero extra JS shipped to the browser for a page
// that's currently just text and links. Only reach for "use client" on the
// specific component that needs it (state, effects, event handlers, browser
// APIs) — see the note at the top of Nav.tsx for a concrete example of when
// that'll happen. Docs: node_modules/next/dist/docs/01-app/01-getting-started/05-server-and-client-components.md

import Nav from "@/app/_components/Nav";
import Hero from "@/app/_components/Hero";
import About from "@/app/_components/About";
import Skills from "@/app/_components/Skills";
import Projects from "@/app/_components/Projects";
import Experience from "@/app/_components/Experience";
import Contact from "@/app/_components/Contact";
import Footer from "@/app/_components/Footer";

export default function Home() {
  return (
    <>
      <Nav />
      <main className="flex flex-col">
        <Hero />
        <Skills />
        <Projects />
        <Experience />
        <Contact />
      </main>
      <Footer />
    </>
  );
}
