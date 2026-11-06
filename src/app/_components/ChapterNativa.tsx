import Image from "next/image";
import { LIVE, type Region } from "@/app/_lib/data";
import ProjectLinks from "./ProjectLinks";
import SourceNote from "./SourceNote";
import TicketPrinter from "./TicketPrinter";
import XRay from "./XRay";

const REGIONS: Region[] = [
  { x: 0.9, y: 11.2, w: 89.8, h: 3.3, label: "menu sections", note: "Thirteen sections, each edited by staff without touching code." },
  { x: 6.2, y: 17, w: 21, h: 25.6, label: "Cloudinary", note: "Staff upload a photo; it comes back sized for the card." },
  { x: 7.1, y: 53.4, w: 19.2, h: 3.1, label: "React cart", note: "Options, sizes and prices flow into one cart line." },
  { x: 0, y: 89.6, w: 100, h: 10.4, label: "promotions", note: "Scheduled from the admin and shown to every open menu." },
  { x: 95.6, y: 92.8, w: 3.5, h: 5.8, label: "orders to POS", note: "A customer's order lands on the register in real time with Firebase." },
];

export default function ChapterNativa() {
  return (
    <article id="nativa" data-world="nativa" className="scroll-mt-20 pt-28 pb-24 sm:pt-40 sm:pb-36">
      <div className="mx-auto max-w-[1500px] px-5 sm:px-8">
        <header className="grid items-end gap-10 lg:grid-cols-12">
          <div className="lg:col-span-8">
          <h2 className="sr-only">Nativa</h2>
          <Image src="/work/nativa-logo.svg" alt="" width={120} height={120} unoptimized className="size-24 sm:size-28" />
          <p className="mt-8 font-nat text-[clamp(2.25rem,5vw,4.75rem)] leading-[1.06] tracking-tight text-balance">
            The register talks to the <em>printer</em> directly.
          </p>
          <p className="mt-6 max-w-[58ch] font-nat text-lg leading-relaxed text-muted">
            Nativa needed a POS tailored to how the restaurant works. Tickets go straight from the browser to the thermal printer over WebUSB, as raw ESC/POS bytes. No print dialog in the way of a busy shift.
          </p>
          <ProjectLinks name="Nativa" live={LIVE.nativa} className="mt-6 font-nat" />
          </div>
          <div className="relative hidden aspect-[3/4] overflow-hidden rounded-[2rem] shadow-[0_30px_60px_-30px_#0f435899] lg:col-span-4 lg:block">
            <Image src="/work/nat-phone.webp" alt="" fill sizes="30vw" className="object-cover object-bottom" />
          </div>
        </header>

        <div className="mt-14 sm:mt-20">
          <TicketPrinter />
          <div className="mt-6">
            <SourceNote>
              Items and prices are from Nativa&apos;s live menu. The columns, IVA split and printer commands are the POS&apos;s own printing code. Only the last step, sending bytes to a USB device, is left out.
            </SourceNote>
          </div>
        </div>

        <div className="mt-24 sm:mt-40">
          <XRay
            src="/work/nat-desk.webp"
            alt="The Nativa menu: photographed drinks on petrol blue cards over cream, with a section bar above"
            width={1440}
            height={900}
            regions={REGIONS}
            title="the Nativa menu"
          />
        </div>
      </div>
    </article>
  );
}
