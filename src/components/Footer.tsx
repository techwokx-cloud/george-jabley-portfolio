import { footer, site } from "../data/content";
import { Social } from "../lib/icons";

export default function Footer() {
  return (
    <footer className="footer">
      <div className="flogo">
        GJ<i>.</i>
      </div>
      <div className="name">{site.name}</div>
      <i className="fsep" />
      <div className="tag">{footer.tagline}</div>
      <div className="soc">
        {footer.social.map((s) => (
          <a key={s.label} href={s.href} aria-label={s.label} target="_blank" rel="noreferrer">
            <Social icon={s.icon} size={s.icon === "linkedin" ? 19 : 22} />
          </a>
        ))}
      </div>
      <div className="copy2">{footer.copyright}</div>
    </footer>
  );
}
