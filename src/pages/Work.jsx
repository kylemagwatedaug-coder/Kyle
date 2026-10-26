import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import gsap from "gsap";
import Cover from "../components/Cover.jsx";
import { projects } from "../data/projects.js";

const wrap = (n) => (n + projects.length) % projects.length;

export default function Work() {
  const navigate = useNavigate();
  const [index, setIndex] = useState(0);
  const dir = useRef(1);
  const first = useRef(true);
  const stage = useRef(null);
  const touchX = useRef(null);

  const go = useCallback((step) => {
    dir.current = step;
    setIndex((i) => wrap(i + step));
  }, []);

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === "ArrowRight") go(1);
      if (e.key === "ArrowLeft") go(-1);
      if (e.key === "Escape") navigate("/");
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [go, navigate]);

  // Animate on every change; the first run is the page-load reveal.
  useLayoutEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const d = dir.current;
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: "power3.out" } });
      tl.fromTo(
        ".stage__main",
        { clipPath: d > 0 ? "inset(0 0 0 100%)" : "inset(0 100% 0 0)" },
        { clipPath: "inset(0 0 0 0%)", duration: first.current ? 1.2 : 0.8 }
      )
        .fromTo(".stage__side", { x: d * 40, opacity: 0 }, { x: 0, opacity: 1, duration: 0.8 }, 0)
        .fromTo(".title .char", { yPercent: 110 }, { yPercent: 0, duration: 0.9, stagger: 0.04 }, 0.15)
        .fromTo(".brackets span", { scale: 1.12, opacity: 0 }, { scale: 1, opacity: 1, duration: 0.6 }, 0.2);
      if (first.current) {
        tl.from(".bar > *", { opacity: 0, y: 14, duration: 0.6, stagger: 0.08 }, 0.5);
        first.current = false;
      }
    }, stage);
    return () => ctx.revert();
  }, [index]);

  const p = projects[index];
  const prev = projects[wrap(index - 1)];
  const next = projects[wrap(index + 1)];

  const onTouchStart = (e) => (touchX.current = e.touches[0].clientX);
  const onTouchEnd = (e) => {
    if (touchX.current == null) return;
    const dx = e.changedTouches[0].clientX - touchX.current;
    if (Math.abs(dx) > 50) go(dx < 0 ? 1 : -1);
    touchX.current = null;
  };

  return (
    <main className="work" onTouchStart={onTouchStart} onTouchEnd={onTouchEnd}>
      <header className="work__top">
        <Link to="/" className="work__brand">Kyle Portfolio</Link>
        <p className="work__meta" aria-live="polite">{p.kind}, {p.year}</p>
        <nav className="work__nav" aria-label="Primary">
          <Link to="/">Home</Link>
          <Link to="/#about">About</Link>
        </nav>
      </header>

      <div className="stage" ref={stage}>
        <button className="stage__side stage__side--l" onClick={() => go(-1)} aria-label={`Previous project: ${prev.name}`}>
          <Cover hue={prev.hue} image={prev.image} />
        </button>

        <div className="stage__center">
          <div className="brackets" aria-hidden="true"><span /><span /><span /><span /></div>
          <Link to={`/work/${p.slug}`} className="stage__main" aria-label={`Open ${p.name}`}>
            <Cover hue={p.hue} image={p.image} label={p.name} />
          </Link>
          <h1 className="title" aria-label={p.name} style={{ "--k": p.title.length * 0.68 }}>
            {p.title.split("").map((c, i) => (
              <span className="char-mask" key={`${p.slug}-${i}`} aria-hidden="true">
                <span className="char">{c}</span>
              </span>
            ))}
          </h1>
        </div>

        <button className="stage__side stage__side--r" onClick={() => go(1)} aria-label={`Next project: ${next.name}`}>
          <Cover hue={next.hue} image={next.image} />
        </button>
      </div>

      <div className="bar">
        <Link to="/" className="round" aria-label="Close project index">&times;</Link>
        <Link to={`/work/${p.slug}`} className="pill pill--orange">Explore</Link>
        <span className="count" aria-hidden="true">{index + 1} / {projects.length}</span>
      </div>
    </main>
  );
}
