import Header from "../components/Header";
import Hero from "../components/Hero";
import About from "../components/About";
import Work from "../components/Work";
import CaseStudy from "../components/CaseStudy";
import Stack from "../components/Stack";
import Footer from "../components/Footer";

export default function Page() {
  return (
    <main>
      <div style={{ position: "relative" }}>
        <Header />
        <Hero />
      </div>
      <About />
      <Work />
      <CaseStudy />
      <Stack />
      <Footer />
    </main>
  );
}
