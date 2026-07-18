// GUIDE: A short bio. Nothing Next.js-specific here — just a Server
// Component rendering static text. `scroll-mt-16` on every section offsets
// the scroll target so the sticky <Nav> doesn't cover the section heading
// when you jump to it via an anchor link.

export default function About() {
  return (
    <section id="about" className="mx-auto max-w-3xl scroll-mt-16 px-6 py-24">
      <h2 className="text-2xl font-semibold">About</h2>
      {/* TODO: 2-4 sentences — background, what you're focused on now, what you're looking for */}
      <p className="mt-4 text-zinc-600 dark:text-zinc-400">
        TODO: write your bio.
      </p>
    </section>
  );
}
