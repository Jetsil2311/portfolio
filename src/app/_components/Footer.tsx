export default function Footer() {
  return (
    <footer className="border-t border-black/10 py-8 text-center text-sm text-zinc-500 dark:border-white/10">
      {/* TODO: your name + year, or remove entirely */}
      <p>© {new Date().getFullYear()} Jethro Siloe Cruz Castillo. All rights reserved</p>
    </footer>
  );
}
