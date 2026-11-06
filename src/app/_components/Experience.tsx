import { experience } from "@/app/_lib/data";

export default function Experience() {
  return (
    <section id="experience" data-world="base" aria-labelledby="experience-title" className="scroll-mt-20 pb-24 sm:pb-32">
      <div className="mx-auto grid max-w-[1500px] gap-8 border-t border-line px-5 pt-12 sm:px-8 lg:grid-cols-12">
        <div className="lg:col-span-5">
          <h2 id="experience-title" className="text-3xl font-medium tracking-[-0.025em] sm:text-4xl">
            Experience
          </h2>
        </div>
        <div className="lg:col-span-7">
          <p className="text-2xl font-medium tracking-[-0.02em]">
            {experience.role}, {experience.organization}
          </p>
          <p className="mt-1 text-muted tabular-nums">{experience.period}</p>
          <ul className="mt-6 space-y-4">
            {experience.highlights.map((point) => (
              <li key={point} className="max-w-[62ch] text-lg leading-relaxed text-pretty text-muted">
                {point}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
