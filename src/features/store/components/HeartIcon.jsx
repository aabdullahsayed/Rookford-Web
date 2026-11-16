import React from "react";

export const HeartIcon = ({ filled }) => (
  <svg viewBox="0 0 24 24" style={filled ? { fill: "#9b3a26", stroke: "#9b3a26" } : undefined}>
    <path d="M12 20s-7.5-4.6-7.5-10.2A4.3 4.3 0 0 1 12 7.3a4.3 4.3 0 0 1 7.5 2.5C19.5 15.4 12 20 12 20Z" />
  </svg>
);
