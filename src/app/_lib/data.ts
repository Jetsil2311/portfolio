// GUIDE: This is a plain data module, not a Next.js special file — the
// `_lib` folder name starts with an underscore, which marks it a "private
// folder" (see node_modules/next/dist/docs/01-app/01-getting-started/02-project-structure.md
// under "Private folders"). Next.js's router ignores anything in `_lib`, so
// it's a safe place to colocate non-route code (data, helpers, types) right
// next to the page that uses it, without accidentally creating a route.
//
// TODO: fill in your real projects / experience / skills below. Keep the
// shapes (the `type`s) as-is so the section components typecheck, or extend
// them as you need.
//
// LEVEL UP: once you have real content, this is the natural place to fetch
// it instead of hardcoding it — e.g. read from a local JSON/MDX file, or
// `await fetch(...)` from a CMS inside an `async` Server Component. Since
// page.tsx and these section components render on the server by default,
// you can `await` data directly in them with no client-side loading state.
// Docs: node_modules/next/dist/docs/01-app/01-getting-started/06-fetching-data.md

export type Project = {
  id: string;
  title: string;
  description: string;
  category: string;
  stack: string[];
  image: string;
  href?: string; // live demo / case study link
  repoHref?: string; // source code link
};

export type ExperienceItem = {
  id: string;
  role: string;
  organization: string;
  period: string; // e.g. "2023 — Present"
  highlights: string[]; // bullet points — what you actually did
  stack: string[]; // tech badges, e.g. ["React", "Firebase"]
};

export type SkillGroup = {
  category: string; // e.g. "Frontend", "Backend", "Tooling"
  items: {
    title: string;
    important: boolean;
  }[];
};

// TODO: replace with your real projects.
export const projects: Project[] = [
  {
    id: "1",
    title: "Stride Mobility",
    description: "Developed a fully functional iOS Mobility App designed to promote walking amongst young people",
    category: "Fullstack Mobile App",
    stack: ["React Native", "NativeWind", "Supabase", "Javascript"],
    image: "/projects/strideapp.png",
    repoHref: "https://github.com/Jetsil2311/stride"
  },
  {
    id: "2",
    title: "Bubble Kaapeh",
    description: "Designed branding identity and developed a website for a local bubble tea shop.",
    category: "Fullstack & Design",
    stack: ["React", "Tailwind CSS", "JavaScript", "HTML", "CSS"],
    image: "/projects/bubblekaapeh.png",
    href: "https://bubblekaapeh.vercel.app/",
    repoHref: "https://github.com/Jetsil2311/bk-menu-app",
  },
  {
    id: "3",
    title: "Nativa POS",
    description: "Tailored a POS System for a local restaurant.",
    category: "Fullstack",
    stack: ["React", "Tailwind CSS", "Firebase", "Javascript", "HTML", "CSS"],
    image: "/projects/nativa.png",
    href: "https://nativa-menu.vercel.app/"
  },
  {
    id: "4",
    title: "Drug Awereness Website",
    description: "Designed a website to reduce drug consumption amongst teenagers.",
    category: "Frontend",
    stack: ["React", "Tailwind CSS"],
    image: "/projects/pec.png",
    href: "https://pec-three.vercel.app/"
  }
];

// TODO: replace with your real work / internship / freelance history.
export const experience: ExperienceItem[] = [
  {
    id: "1",
    role: "Fullstack Developer",
    organization: "Freelance",
    period: "Feb 2026 - Present",
    highlights: [
      "Designed and built two production SaaS platforms using React, Express, and NativeWind, enabling local businesses to accept online orders.",
      "Developed a React.js digital menu platform with an ordering system for Bubble Kaapeh, deployed on Vercel and serving 5+ restaurant/café clients",
      "Designed ordering platform + POS system tailored for Nativa"
    ],
    stack: ["React", "Tailwind CSS", "Firebase"],
  }
];

// TODO: replace with the technologies you actually want recruiters to see.
export const skills: SkillGroup[] = [
  {
    category: "Frontend",
    items: [
      { title: "React", important: true },
      { title: "Next.js", important: true },
      { title: "Tailwind CSS", important: true },
      { title: "Typescript", important: false },
      { title: "HTML", important: false },
      { title: "CSS", important: false }
    ]
  },
  {
    category: "Backend",
    items: [
      { title: "Node.js", important: true },
      { title: "Express", important: true },
      { title: "MongoDB", important: true },
      { title: "PostgreSQL", important: false },
      { title: "MySQL", important: false },
      { title: "REST APIs", important: false },
    ],
  },
];
