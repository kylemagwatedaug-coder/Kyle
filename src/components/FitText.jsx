import { useLayoutEffect, useRef } from "react";

// Scales a single line of text so it always spans the full container width.
export default function FitText({ children, className = "" }) {
  const wrap = useRef(null);
  const text = useRef(null);

  useLayoutEffect(() => {
    const fit = () => {
      if (!wrap.current || !text.current) return;
      const w = wrap.current.clientWidth;
      text.current.style.fontSize = "100px";
      const tw = text.current.scrollWidth;
      text.current.style.fontSize = (100 * w) / tw + "px";
    };
    fit();
    document.fonts?.ready.then(fit);
    window.addEventListener("resize", fit);
    return () => window.removeEventListener("resize", fit);
  }, [children]);

  return (
    <div ref={wrap} className={"fit " + className}>
      <span ref={text} className="fit__text">{children}</span>
    </div>
  );
}
