import { useLayoutEffect, useRef } from "react";
import gsap from "gsap";

// Full-screen 0 to 100 counter. Calls onReveal as the panel starts lifting, onDone when it is gone.
export default function Loader({ onReveal, onDone }) {
  const root = useRef(null);
  const num = useRef(null);

  useLayoutEffect(() => {
    document.body.style.overflow = "hidden";
    const counter = { v: 0 };
    const ctx = gsap.context(() => {
      gsap
        .timeline({ onComplete: () => { document.body.style.overflow = ""; onDone(); } })
        .to(counter, {
          v: 100,
          duration: 2.4,
          ease: "power2.inOut",
          onUpdate: () => { if (num.current) num.current.textContent = Math.round(counter.v); },
        })
        .to(num.current, { opacity: 0, duration: 0.25 }, "+=0.15")
        .add(() => onReveal(), "-=0.05")
        .to(root.current, { yPercent: -100, duration: 1, ease: "power4.inOut" });
    }, root);
    return () => { ctx.revert(); document.body.style.overflow = ""; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="loader" ref={root} role="status" aria-label="Loading">
      <span className="loader__num" ref={num}>0</span>
    </div>
  );
}
