import { useEffect, useRef } from "react";
import gsap from "gsap";

// The name. On hover, a circle around the cursor is replaced by a copy that is sliced into
// horizontal strips (an SVG displacement filter whose noise only varies vertically), and the
// strips keep re-shuffling left and right while the pointer stays on the name.
export default function GlitchWord({ lines }) {
  const wm = useRef(null);
  const turb = useRef(null);
  const disp = useRef(null);

  useEffect(() => {
    const canHover = window.matchMedia("(hover: hover)").matches;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!canHover || reduce) return;

    const el = wm.current;
    const amount = { v: 0 };
    let last = 0;
    let active = false;

    const apply = () => disp.current?.setAttribute("scale", amount.v.toFixed(1));
    const shuffle = (t) => {
      if (!active || t - last < 0.07) return;
      last = t;
      turb.current?.setAttribute("baseFrequency", `0 ${(0.012 + Math.random() * 0.05).toFixed(4)}`);
      turb.current?.setAttribute("seed", String(Math.floor(Math.random() * 100)));
    };
    const move = (e) => {
      const r = el.getBoundingClientRect();
      el.style.setProperty("--mx", `${e.clientX - r.left}px`);
      el.style.setProperty("--my", `${e.clientY - r.top}px`);
    };
    const enter = (e) => {
      move(e);
      active = true;
      el.classList.add("is-glitch");
      gsap.ticker.add(shuffle);
      gsap.to(amount, { v: 100, duration: 0.35, ease: "power2.out", onUpdate: apply, overwrite: true });
    };
    const leave = () => {
      active = false;
      gsap.to(amount, {
        v: 0, duration: 0.4, ease: "power2.in", onUpdate: apply, overwrite: true,
        onComplete: () => { el.classList.remove("is-glitch"); gsap.ticker.remove(shuffle); },
      });
    };

    el.addEventListener("pointerenter", enter);
    el.addEventListener("pointermove", move);
    el.addEventListener("pointerleave", leave);
    return () => {
      el.removeEventListener("pointerenter", enter);
      el.removeEventListener("pointermove", move);
      el.removeEventListener("pointerleave", leave);
      gsap.ticker.remove(shuffle);
      gsap.killTweensOf(amount);
    };
  }, []);

  const markup = lines.map((line, li) => (
    <span className="name__line" key={li}>
      {line.split("").map((c, i) => (
        <span className="char-mask" key={i} aria-hidden="true">
          <span className="char">{c}</span>
        </span>
      ))}
    </span>
  ));

  return (
    <div className="wm" ref={wm}>
      <svg width="0" height="0" aria-hidden="true" focusable="false" style={{ position: "absolute" }}>
        <filter id="wm-glitch" x="-10%" y="-10%" width="120%" height="120%" colorInterpolationFilters="sRGB">
          <feTurbulence ref={turb} type="fractalNoise" baseFrequency="0 0.03" numOctaves="1" seed="3" result="noise" />
          <feDisplacementMap ref={disp} in="SourceGraphic" in2="noise" scale="0" xChannelSelector="R" yChannelSelector="R" />
        </filter>
      </svg>
      <div className="wm__base name">{markup}</div>
      <div className="wm__glitch name" aria-hidden="true">{markup}</div>
    </div>
  );
}
