// GUIDE: This is the section recruiters scan for stack fit. It reads its
// data from `_lib/data.ts` (the `skills` array) instead of hardcoding markup
// per skill — fill that array in once and this component just renders it.
// Still a Server Component: mapping over an array to render JSX needs no
// client-side JS.

import { skills } from "@/app/_lib/data";

// Repeats each category's item list this many times to build the scroll
// track. Must match the `/ 6` divisor in the `.animate-scroll` keyframes
// in globals.css — keeping the track this many copies wide (rather than
// the usual 2) guarantees it's still wider than the viewport at
// full-screen width, so no blank gap ever appears after the last pill.
const SKILL_TRACK_REPEAT = 6;

export default function Skills() {
  return (
    <section id="skills" className="scroll-mt-16 px-6  pb-20">
      {/* TODO: populate `skills` in src/app/_lib/data.ts */}
      <div className="mt-6 flex flex-col gap-6">
        {/* odd:/even: here target real siblings (these category divs), then
            set --skill-direction via a custom property so the nested ul
            (which is always alone in its own wrapper, so nth-child on IT
            would always read "1st child") can inherit which way to scroll */}
        {skills.map((group) => (
          <div
            key={group.category}
            className="odd:[--skill-direction:scroll] even:[--skill-direction:scroll-opposite]"
          >
            {/* full-bleed breakout: spans the whole viewport width
                regardless of the padding/centering on the section above */}
            <div className="relative mt-2 w-screen ml-[calc(50%-50vw)] carousel-container">
              <ul className="flex w-max flex-nowrap gap-2 animate-scroll">
                {Array.from({ length: SKILL_TRACK_REPEAT }, () => group.items)
                  .flat()
                  .map((item, i) => (
                  <li
                    key={`${item.title}-${i}`}
                    className={`
                      shrink-0 rounded-full border border-black/10 px-3 py-1 text-sm dark:border-white/10
                      hover:text-white transition-all text-slate-200 overflow-visible
                      ${item.important && 'bg-purple-600/20 shadow-xl/30 shadow-purple-600 '} `}
                  >
                    {item.title}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
