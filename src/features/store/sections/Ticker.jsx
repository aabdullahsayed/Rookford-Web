import React from "react";
import { TICKER } from "../../../lib/constants";

export function Ticker() {
  return (
    <div className="ticker" aria-hidden="true">
      <div className="ticker-track">
        {[...TICKER, ...TICKER].map((w, i) => (
          <span key={i}>{w}<i>★</i></span>
        ))}
      </div>
    </div>
  );
}
