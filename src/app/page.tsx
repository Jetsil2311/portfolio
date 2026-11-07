// A single scrollable page. The sections are Server Components; only the demos
// and the small observers that drive the page's color ship JS.

import Nav from "@/app/_components/Nav";
import Hero from "@/app/_components/Hero";
import WorldObserver from "@/app/_components/WorldObserver";
import ChapterKaapeh from "@/app/_components/ChapterKaapeh";
import ChapterNativa from "@/app/_components/ChapterNativa";
import ChapterTally from "@/app/_components/ChapterTally";
import ChapterStride from "@/app/_components/ChapterStride";
import ChapterCodeher from "@/app/_components/ChapterCodeher";
import Toolbox from "@/app/_components/Toolbox";
import Experience from "@/app/_components/Experience";
import Contact from "@/app/_components/Contact";
import Footer from "@/app/_components/Footer";

export default function Home() {
  return (
    <>
      <Nav />
      <WorldObserver />
      <main id="main" className="flex flex-col">
        <Hero />
        <div id="projects" className="scroll-mt-24">
          <ChapterKaapeh />
          <ChapterNativa />
          <ChapterTally />
          <ChapterStride />
          <ChapterCodeher />
        </div>
        <Toolbox />
        <Experience />
        <Contact />
      </main>
      <Footer />
    </>
  );
}
