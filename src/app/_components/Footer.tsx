export default function Footer() {
  return (
    <footer className="border-t border-line">
      <div className="mx-auto flex max-w-6xl flex-col gap-2 px-5 py-8 text-sm text-subtle sm:flex-row sm:items-center sm:justify-between sm:px-8">
        <p>© {new Date().getFullYear()} Jethro Siloe Cruz Castillo</p>
        <p>Built with Next.js and Tailwind CSS</p>
      </div>
    </footer>
  );
}
