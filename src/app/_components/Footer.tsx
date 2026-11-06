export default function Footer() {
  return (
    <footer data-world="base">
      <div className="mx-auto flex max-w-[1500px] flex-col gap-2 px-5 pb-8 text-sm text-muted sm:flex-row sm:items-center sm:justify-between sm:px-8">
        <p>© {new Date().getFullYear()} Jethro Siloe Cruz Castillo</p>
        <p>Built with Next.js and Tailwind CSS. No animation library, just CSS.</p>
      </div>
    </footer>
  );
}
