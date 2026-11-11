import type { Metadata } from "next";
import "@fontsource-variable/plus-jakarta-sans";
import "@fontsource-variable/inter";
import "@fontsource-variable/fraunces";
import "./globals.css";
import { site } from "../data/content";
import Preloader from "../components/Preloader";
import MotionRoot from "../components/MotionRoot";
import CustomCursor from "../components/CustomCursor";

export const metadata: Metadata = {
  title: site.title,
  description: site.description,
};

// Runs before first paint. Marks the page as motion-capable and decides whether to show the
// preloader. Hard failsafe: after 5s everything is revealed, whatever happens.
const bootScript = `(function(d){var c=d.documentElement;c.classList.add('js');var show=false;try{show=!matchMedia('(prefers-reduced-motion: reduce)').matches&&!sessionStorage.getItem('gj_pre')}catch(e){}if(show){c.classList.add('loading')}else{c.classList.add('ready')}setTimeout(function(){c.classList.remove('loading');c.classList.add('ready')},5000)})(document)`;

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: bootScript }} />
      </head>
      <body>
        <a href="#about" className="skip">Skip to content</a>
        <Preloader />
        <CustomCursor />
        <MotionRoot />
        {children}
      </body>
    </html>
  );
}
