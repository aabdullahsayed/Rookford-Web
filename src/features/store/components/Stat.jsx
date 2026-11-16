import React, { useEffect, useRef } from "react";

export function Stat({ n, dec = 0, sup, label, note, delay }) {
  const ref = useRef(null);
  useEffect(() => {
    const el = ref.current;
    if (!el || !("IntersectionObserver" in window)) return;
    const io = new IntersectionObserver(
      (entries) => {
        if (!entries[0].isIntersecting) return;
        io.disconnect();
        const t0 = performance.now();
        const dur = 1400;
        const tick = (t) => {
          const k = Math.min(1, (t - t0) / dur);
          const e = 1 - Math.pow(1 - k, 3);
          if (el.firstChild) el.firstChild.textContent = (n * e).toFixed(dec);
          if (k < 1) requestAnimationFrame(tick);
        };
        requestAnimationFrame(tick);
      },
      { threshold: 0.3 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, [n, dec]);
  return (
    <div className={`stat rv${delay ? " " + delay : ""}`}>
      <b ref={ref}>
        <span>0</span>
        {sup ? <sup>{sup}</sup> : null}
      </b>
      <span>{label}</span>
      <p>{note}</p>
    </div>
  );
}
