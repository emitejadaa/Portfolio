import { Reveal } from "@/components/reveal";
import { GithubStats } from "@/components/github-stats";
import { Hero } from "@/components/sections/hero";
import { Projects } from "@/components/sections/projects";
import { Experience } from "@/components/sections/experience";
import { Skills } from "@/components/sections/skills";
import { Education } from "@/components/sections/education";
import { Contact } from "@/components/sections/contact";

export default function Home() {
  return (
    <main className="mx-auto flex max-w-6xl flex-col gap-20 px-6 py-12 lg:px-10 lg:py-16">
      <Hero />

      <Reveal>
        <GithubStats />
      </Reveal>

      <Projects />
      <Experience />
      <Skills />
      <Education />

      <Reveal>
        <Contact />
      </Reveal>
    </main>
  );
}
