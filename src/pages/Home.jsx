import { useLayoutEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Nav from "../components/Nav.jsx";
import GlitchWord from "../components/GlitchWord.jsx";
import LogoRGB from "../components/LogoRGB.jsx";
import Footer from "../components/Footer.jsx";
import Loader from "../components/Loader.jsx";
import { profile } from "../data/profile.js";

gsap.registerPlugin(ScrollTrigger);

const WORD = "Kyle Portfolio";
const reduceMotion = () => window.matchMedia("(prefers-reduced-motion: reduce)").matches;
// The loader plays once per page load, not every time you come back to Home.
let loaderPlayed = false;

export default function Home() {
  const root = useRef(null);
  const skip = loaderPlayed || reduceMotion();
  const [loading, setLoading] = useState(!skip);
  const [ready, setReady] = useState(skip);

  // Hero: hidden while the loader runs, then text rises out of its masks.
  useLayoutEffect(() => {
    if (reduceMotion()) return;
    const ctx = gsap.context(() => {
      const hidden = { yPercent: 150 };
      if (!ready) {
        gsap.set(".intro .char", hidden);
        gsap.set(".nav__logo, .nav__menu", { opacity: 0 });
        gsap.set(".hero__img", { scale: 1.12 });
        return;
      }
      // The effect cleanup reverts the hidden state above, so animate from it explicitly.
      gsap
        .timeline({ defaults: { ease: "power4.out" } })
        .fromTo(".hero__img", { scale: 1.12 }, { scale: 1, duration: 2, ease: "power3.out" }, 0)
        .fromTo(".intro .char", hidden, { yPercent: 0, duration: 1.2, stagger: 0.05 }, 0)
        .fromTo(".nav__logo, .nav__menu", { opacity: 0 }, { opacity: 1, duration: 0.6, stagger: 0.08 }, 0.5);
    }, root);
    return () => ctx.revert();
  }, [ready]);

  // Scroll reveals for the dark block: text rises and fades in as it enters the viewport.
  useLayoutEffect(() => {
    if (reduceMotion()) return;
    const ctx = gsap.context(() => {
      gsap.from(".dark__mark .logo-hit", {
        opacity: 0, y: 40, rotate: -45, duration: 1.2, ease: "power3.out",
        scrollTrigger: { trigger: ".dark__mark", start: "top 90%" },
      });
      gsap.utils.toArray(".dark__grid").forEach((row) => {
        gsap.from(row.querySelectorAll("h2, .prose > *"), {
          opacity: 0, y: 48, duration: 1, ease: "power3.out", stagger: 0.12,
          scrollTrigger: { trigger: row, start: "top 85%" },
        });
      });
      gsap.from(".footer", {
        opacity: 0, y: 24, duration: 0.9, ease: "power3.out",
        scrollTrigger: { trigger: ".footer", start: "top 98%" },
      });
    }, root);
    return () => ctx.revert();
  }, []);

  const handleReveal = () => setReady(true);
  const handleDone = () => {
    loaderPlayed = true;
    setLoading(false);
    ScrollTrigger.refresh();
  };

  return (
    <div ref={root}>
      {loading && <Loader onReveal={handleReveal} onDone={handleDone} />}

      <section className="intro hero" aria-label="Introduction">
        <div className="hero__bg" aria-hidden="true">
          <img className="hero__img" src="/profile.png" alt="" width="408" height="612" fetchpriority="high" draggable="false" />
          <div className="hero__shade" />
        </div>
        <Nav />
        <h1 className="hero__name" aria-label={WORD}>
          <GlitchWord lines={["Kyle", "Portfolio"]} />
        </h1>
      </section>

      <section className="dark">
        <div className="dark__mark"><LogoRGB /></div>

        <div className="dark__grid" id="about">
          <h2>About</h2>
          <div className="prose">
            {profile.about.map((p) => <p key={p}>{p}</p>)}
            <p className="prose__muted">{profile.learning}</p>
          </div>
        </div>

        <div className="dark__grid" id="work">
          <h2>Projects</h2>
          <div className="prose">
            <p>A capstone and three small React and GSAP experiments, collected in one index.</p>
            <Link className="pill" to="/work">Open the project index</Link>
          </div>
        </div>

        <div className="dark__grid" id="contact">
          <h2>Contact</h2>
          <div className="prose">
            <p><a href={`mailto:${profile.email}`}>{profile.email}</a></p>
            <ul className="links">
              {profile.socials.map((s) => (
                <li key={s.label}><a href={s.href} target="_blank" rel="noreferrer">{s.label}</a></li>
              ))}
            </ul>
          </div>
        </div>

        <Footer />
      </section>
    </div>
  );
}
