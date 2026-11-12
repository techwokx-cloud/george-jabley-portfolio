import type { Metadata } from "next";
import "@fontsource-variable/plus-jakarta-sans";
import "@fontsource-variable/inter";
import "@fontsource-variable/fraunces";
import "./globals.css";
import { site } from "../data/content";

export const metadata: Metadata = {
  title: site.title,
  description: site.description,
};

// Runs before first paint. Marks the page as motion-capable and decides whether to show the
// preloader. Hard failsafe: after 5s everything is revealed, whatever happens.
const bootScript = `(function(d){var c=d.documentElement;c.classList.add('js');var off=false,show=false;try{var m=/[?&]motion=(on|off)/.exec(location.search);if(m){localStorage.setItem('gj_motion',m[1])}off=localStorage.getItem('gj_motion')==='off';show=!off&&!sessionStorage.getItem('gj_pre')&&!/^\\/admin/.test(location.pathname)}catch(e){}if(off){c.classList.add('reduce-motion')}if(show){c.classList.add('loading')}else{c.classList.add('ready')}setTimeout(function(){c.classList.remove('loading');c.classList.add('ready')},5000)})(document)`;

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: bootScript }} />
      </head>
      <body>{children}</body>
    </html>
  );
}
