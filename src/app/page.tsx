import { Hero } from "@/components/sections/hero";
import { Stack } from "@/components/sections/stack";
import { Projects } from "@/components/sections/projects";
import { Experience } from "@/components/sections/experience";
import { Education } from "@/components/sections/education";
import { Contact } from "@/components/sections/contact";
import { Footer } from "@/components/footer";
import { getGithubRepos } from "@/lib/github";

export default async function Home() {
  const repos = await getGithubRepos();

  return (
    <main
      style={{
        position: "relative",
        zIndex: 1,
        maxWidth: 1160,
        margin: "0 auto",
        padding: "0 clamp(20px, 5vw, 56px)",
      }}
    >
      <Hero />
      <Stack />
      <Projects />
      <Experience />
      <Education repos={repos} />
      <Contact />
      <Footer />
    </main>
  );
}
