import Preloader from "../../components/Preloader";
import ContactModal from "../../components/ContactModal";
import MotionRoot from "../../components/MotionRoot";
import CustomCursor from "../../components/CustomCursor";

export default function SiteLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <a href="#about" className="skip">Skip to content</a>
      <Preloader />
      <CustomCursor />
      <MotionRoot />
      <ContactModal />
      {children}
    </>
  );
}
