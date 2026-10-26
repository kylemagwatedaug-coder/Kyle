import { profile } from "../data/profile.js";

export default function Footer() {
  return (
    <footer className="footer">
      <span>&copy; {new Date().getFullYear()} {profile.name}</span>
      <ul className="footer__social">
        {profile.socials.map((s) => (
          <li key={s.label}>
            <a href={s.href} target="_blank" rel="noreferrer">{s.label}</a>
          </li>
        ))}
      </ul>
    </footer>
  );
}
