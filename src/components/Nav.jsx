import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import gsap from "gsap";
import LogoRGB from "./LogoRGB.jsx";

export function Logo({ className = "" }) {
  return (
    <svg className={`logo ${className}`.trim()} viewBox="0 0 64 64" aria-hidden="true">
      <g fill="currentColor">
        {[0, 45, 90, 135].map((r) => (
          <path key={r} transform={`rotate(${r} 32 32)`} d="M32 4c5 10 5 18 0 28-5-10-5-18 0-28zM32 60c-5-10-5-18 0-28 5 10 5 18 0 28z" />
        ))}
      </g>
    </svg>
  );
}

const links = [
  { label: "Project", to: "/work" },
  { label: "About", to: "/#about" },
  { label: "Contact", to: "/#contact" },
];

const reduce = () => window.matchMedia("(prefers-reduced-motion: reduce)").matches;

export default function Nav() {
  const [open, setOpen] = useState(false);
  const panel = useRef(null);
  const btn = useRef(null);
  const closeBtn = useRef(null);
  const first = useRef(true);

  const close = () => {
    document.body.style.overflow = "";
    setOpen(false);
  };

  useEffect(() => {
    if (!open) return;
    document.body.style.overflow = "hidden";
    closeBtn.current?.focus();
    const onKey = (e) => e.key === "Escape" && close();
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open]);

  useLayoutEffect(() => {
    const el = panel.current;
    if (first.current) { first.current = false; return; }
    if (reduce()) {
      el.style.visibility = open ? "visible" : "hidden";
      el.style.clipPath = "none";
      if (!open) btn.current?.focus();
      return;
    }
    const tl = gsap.timeline();
    if (open) {
      tl.set(el, { visibility: "visible" })
        .fromTo(el, { clipPath: "inset(0 0 100% 0)" }, { clipPath: "inset(0 0 0% 0)", duration: 0.7, ease: "power4.inOut" })
        .fromTo(".menu__link span", { yPercent: 115 }, { yPercent: 0, duration: 0.8, stagger: 0.08, ease: "power4.out" }, "-=0.3");
    } else {
      tl.to(el, { clipPath: "inset(0 0 100% 0)", duration: 0.5, ease: "power4.inOut" })
        .set(el, { visibility: "hidden" });
      btn.current?.focus();
    }
    return () => tl.kill();
  }, [open]);

  return (
    <>
      <header className="nav">
        <Link to="/" aria-label="Kyle Portfolio home" className="nav__logo">
          <LogoRGB size={40} hit="1rem" />
        </Link>
        <button
          ref={btn}
          className="nav__menu"
          aria-expanded={open}
          aria-controls="site-menu"
          onClick={() => setOpen(true)}
        >
          Menu <i aria-hidden="true" />
        </button>
      </header>

      <div id="site-menu" className="menu" ref={panel} role="dialog" aria-modal="true" aria-label="Menu" aria-hidden={!open}>
        <button ref={closeBtn} className="nav__menu menu__close" onClick={close} tabIndex={open ? 0 : -1}>
          Close <b aria-hidden="true">&times;</b>
        </button>
        <nav aria-label="Primary">
          {links.map((l) => (
            <Link key={l.label} to={l.to} className="menu__link" onClick={close} tabIndex={open ? 0 : -1}>
              <span>{l.label}</span>
            </Link>
          ))}
        </nav>
      </div>
    </>
  );
}
