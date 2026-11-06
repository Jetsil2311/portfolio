import Image from "next/image";
import { LIVE, REPOS, type Region } from "@/app/_lib/data";
import DrinkLab from "./DrinkLab";
import ProjectLinks from "./ProjectLinks";
import SourceNote from "./SourceNote";
import XRay from "./XRay";

const REGIONS: Region[] = [
  { x: 38.3, y: 15, w: 23.4, h: 67, label: "carousel + Cloudinary", note: "Promos are Firestore documents the owner edits. Cloudinary URL transforms frame every upload at 9:16." },
  { x: 6.5, y: 2.5, w: 11.7, h: 6.5, label: "brand", note: "Logo, colors and type, designed by me." },
  { x: 64, y: 2.7, w: 29.2, h: 6.2, label: "React Router", note: "Filtered views of the menu with their own URLs." },
  { x: 11.3, y: 91.5, w: 11.5, h: 5, label: "#arma-tu-bebida", note: "A shareable link straight into the drink builder above." },
  { x: 23.4, y: 91.5, w: 65.5, h: 5, label: "Firestore sections", tagLeft: true, note: "Sections and products update live from the admin, no deploy." },
  { x: 94, y: 90.4, w: 4.6, h: 7.4, label: "web_orders + WhatsApp", note: "The cart saves a validated order, then opens WhatsApp with it written out." },
];

export default function ChapterKaapeh() {
  return (
    <article id="bk" data-world="bk" className="scroll-mt-20 pt-28 pb-24 sm:pt-40 sm:pb-36">
      <div className="mx-auto max-w-[1500px] px-5 sm:px-8">
        <header className="grid items-end gap-8 lg:grid-cols-12">
          <div className="lg:col-span-7">
            <h2 className="sr-only">Bubble Kaapeh</h2>
            {/* the logo file is drawn in cream, it lives on the brown */}
            <Image src="/work/bk-logo.svg" alt="" width={766} height={260} unoptimized className="h-auto w-[min(70vw,24rem)]" />
            <p className="mt-8 font-bk text-[clamp(2.25rem,5vw,4.75rem)] leading-[1.04] font-semibold tracking-tight text-balance">
              It started as a menu. Now it runs the café.
            </p>
          </div>
          <div className="lg:col-span-5">
            <p className="max-w-[46ch] font-bk-body text-lg leading-relaxed font-semibold text-muted">
              I drew the brand, then built the ordering menu, register, kitchen board, stock and finance behind it. The platform now serves 5+ cafés and restaurants.
            </p>
            <ProjectLinks name="Bubble Kaapeh" live={LIVE.bk} repo={REPOS.bk} className="mt-6 font-bk-body" />
          </div>
        </header>

        <div className="mt-14 sm:mt-20">
          <DrinkLab />
          <div className="mt-4">
            <SourceNote
              href={`${REPOS.bk}/blob/main/src/components/drinkBuilder/DrinkCup.jsx`}
              file="DrinkCup.jsx"
            >
              Running code, not a recording. This is the cup from the production menu. There, one Firestore document defines every step, price and color.
            </SourceNote>
          </div>
        </div>

        {/* the brand out in the world */}
        <div className="reveal mt-24 grid grid-cols-2 gap-3 sm:mt-36 sm:gap-4 lg:grid-cols-12">
          <div className="relative col-span-2 aspect-4/3 overflow-hidden rounded-[2rem] lg:col-span-6 lg:aspect-auto">
            <Image src="/work/bk-cafe.webp" alt="The Bubble Kaapeh café, with its logo chalked on the wall" fill sizes="(min-width: 1024px) 50vw, 100vw" className="object-cover" />
          </div>
          <div className="relative aspect-9/16 overflow-hidden rounded-[2rem] lg:col-span-3">
            <Image src="/work/poster-taro.webp" alt="Cloudy Taro promo poster" fill sizes="(min-width: 1024px) 25vw, 50vw" className="object-cover" />
          </div>
          <div className="relative aspect-9/16 overflow-hidden rounded-[2rem] lg:col-span-3 lg:mt-16 lg:-mb-16">
            <Image src="/work/poster-matcha.webp" alt="Matcha Blossom promo poster" fill sizes="(min-width: 1024px) 25vw, 50vw" className="object-cover" />
          </div>
        </div>

        <div className="mt-24 sm:mt-44">
          <XRay
            src="/work/bk-desk.webp"
            alt="The Bubble Kaapeh menu: a poster carousel on brown under the logo, with a category bar below"
            width={1440}
            height={900}
            regions={REGIONS}
            title="the Bubble Kaapeh menu"
          />
        </div>
      </div>
    </article>
  );
}
