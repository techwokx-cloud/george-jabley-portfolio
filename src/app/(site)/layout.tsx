import Preloader from "../../components/Preloader";
import ContactModal from "../../components/ContactModal";
import IntroModal from "../../components/IntroModal";
import { getSiteFiles } from "../../lib/credentials";
import AutoTour from "../../components/AutoTour";
import Curtains from "../../components/Curtains";
import MotionRoot from "../../components/MotionRoot";
import CustomCursor from "../../components/CustomCursor";

export default async function SiteLayout({ children }: { children: React.ReactNode }) {
  const files = await getSiteFiles();
  return (
    <>
      <a href="#about" className="skip">Skip to content</a>
      <Preloader />
      <CustomCursor />
      <MotionRoot />
      <Curtains />
      <AutoTour />
      <ContactModal />
      <IntroModal url={files.intro} />
      {children}
    </>
  );
}
