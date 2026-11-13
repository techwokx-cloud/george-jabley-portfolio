import Header from "../../components/Header";
import Hero from "../../components/Hero";
import About from "../../components/About";
import Journey from "../../components/Journey";
import Work from "../../components/Work";
import CaseStudy from "../../components/CaseStudy";
import Credentials from "../../components/Credentials";
import Stack from "../../components/Stack";
import Footer from "../../components/Footer";
import { getCredentials, getResumeUrl } from "../../lib/credentials";
import { featuredFor, getProjects, weekNumber } from "../../lib/projects";

export const revalidate = 60; // re-check projects (and the weekly featured pick) every minute

export default async function Page() {
  const [projects, creds, resume] = await Promise.all([getProjects(), getCredentials(), getResumeUrl()]);
  const featured = featuredFor(projects);
  return (
    <main>
      <div style={{ position: "relative" }}>
        <Header />
        <Hero />
      </div>
      <About />
      <Journey projects={projects} resume={resume} />
      <Work projects={projects} />
      <CaseStudy project={featured} week={weekNumber()} />
      <Credentials items={creds} />
      <Stack />
      <Footer />
    </main>
  );
}
