import Header from "../../components/Header";
import Hero from "../../components/Hero";
import About from "../../components/About";
import Journey from "../../components/Journey";
import Work from "../../components/Work";
import CaseStudy from "../../components/CaseStudy";
import Stack from "../../components/Stack";
import Footer from "../../components/Footer";
import { featuredFor, getProjects, weekNumber } from "../../lib/projects";

export const revalidate = 60; // re-check projects (and the weekly featured pick) every minute

export default async function Page() {
  const projects = await getProjects();
  const featured = featuredFor(projects);
  return (
    <main>
      <div style={{ position: "relative" }}>
        <Header />
        <Hero />
      </div>
      <About />
      <Journey projects={projects} />
      <Work projects={projects} />
      <CaseStudy project={featured} week={weekNumber()} />
      <Stack />
      <Footer />
    </main>
  );
}
