import { useEffect, useRef } from "react";
import gsap from "gsap";
import { Logo } from "./Nav.jsx";

// The white logo splits into red, green and blue copies that fan out and blend (screen)
// on hover, then fold back into the white logo when the pointer leaves.
const channels = [
  { color: "#ff0000", x: -5, y: 0, rotate: -18 },
  { color: "#00ff00", x: 0, y: 5, rotate: 18 },
  { color: "#0000ff", x: 5, y: -1, rotate: 0 },
];

export default function LogoRGB({ size = 54, hit = "1.75rem" }) {
  const root = useRef(null);

  useEffect(() => {
    if (!window.matchMedia("(hover: hover)").matches) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const el = root.current;
    const base = el.querySelector(".logo-rgb__base");
    const copies = el.querySelectorAll(".logo-rgb__c");

    const enter = () => {
      gsap.to(base, { opacity: 0, duration: 0.2, overwrite: true });
      copies.forEach((c, i) => {
        const ch = channels[i];
        gsap.to(c, {
          opacity: 1, scale: 1.35, x: ch.x, y: ch.y, rotate: ch.rotate,
          duration: 0.8, ease: "elastic.out(1, 0.6)", overwrite: true,
        });
      });
    };
    const leave = () => {
      gsap.to(copies, { opacity: 0, scale: 1, x: 0, y: 0, rotate: 0, duration: 0.45, ease: "power3.inOut", overwrite: true });
      gsap.to(base, { opacity: 1, duration: 0.3, delay: 0.25, overwrite: true });
    };
    el.addEventListener("pointerenter", enter);
    el.addEventListener("pointerleave", leave);
    return () => {
      el.removeEventListener("pointerenter", enter);
      el.removeEventListener("pointerleave", leave);
    };
  }, []);

  return (
    <div className="logo-hit" ref={root} style={{ "--hit": hit }}>
      <div className="logo-stack" style={{ "--size": `${size}px` }}>
        <Logo className="logo-rgb__base" />
        {channels.map((c) => (
          <span key={c.color} className="logo-rgb__c" style={{ color: c.color }}>
            <Logo />
          </span>
        ))}
      </div>
    </div>
  );
}
