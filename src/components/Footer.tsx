import { footer, site } from "../data/content";
import { Social } from "../lib/icons";
import MotionToggle from "./MotionToggle";

export default function Footer() {
  return (
    <footer className="footer" data-reveal>
      <div className="flogo">
        GJ<i>.</i>
      </div>
      <div className="name">{site.name}</div>
      <i className="fsep" />
      <div className="tag">{footer.tagline}</div>
      <div className="soc">
        {footer.social.map((s) =>
          s.href ? (
            <a key={s.label} href={s.href} aria-label={s.label} target="_blank" rel="noopener noreferrer">
              <Social icon={s.icon} size={s.icon === "linkedin" ? 19 : 22} />
            </a>
          ) : (
            <span key={s.label} className="soon" role="img" aria-label={`${s.label} (link coming soon)`} title="Link coming soon">
              <Social icon={s.icon} size={s.icon === "linkedin" ? 19 : 22} />
            </span>
          )
        )}
      </div>
      <div className="copy2">{footer.copyright}</div>
      <MotionToggle />
    </footer>
  );
}
