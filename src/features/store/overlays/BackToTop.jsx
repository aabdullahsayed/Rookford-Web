import React from "react";

export function BackToTop({ showTop }) {
  return (
    <button
      className={`totop${showTop ? " on" : ""}`}
      aria-label="Back to top"
      onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
    >
      <svg viewBox="0 0 24 24"><path d="M12 19V5M5 12l7-7 7 7" /></svg>
    </button>
  );
}
