import React from "react";
import { Stat } from "../components/Stat";

export function Craft() {
  return (
    <section className="craft" id="craft">
      <div className="wrap">
        <div className="sec-head">
          <div>
            <span className="sec-num">06 / The Craft</span>
            <h2 className="h-lg rv d1">Slow cloth.<br /><em>Honest work.</em></h2>
          </div>
        </div>
        <div className="stats">
          <Stat n={15.5} dec={1} label="Ounce selvedge" note="Heavy, dense twill that holds its shape." />
          <Stat n={29} sup="in" label="Shuttle width" note="Narrow bolts mean true self-edge on every seam." delay="d1" />
          <Stat n={16} label="Indigo dips" note="Rope-dyed for a deep, ringed core." delay="d2" />
          <Stat n={100} sup="%" label="Repairable" note="Darned, patched and re-stitched, forever." delay="d3" />
        </div>
        <div className="promises">
          <div className="promise rv">
            <div className="ic"><svg viewBox="0 0 24 24"><path d="M4 18c3-8 6-8 8-4s5 4 8-6" /><path d="M3 21h18" /></svg></div>
            <h4>Chainstitch hemming</h4>
            <p>Free on every pair, to your inseam, on a vintage Union Special.</p>
          </div>
          <div className="promise rv d1">
            <div className="ic"><svg viewBox="0 0 24 24"><path d="M12 3l2.6 5.6 6 .7-4.5 4.1 1.3 6L12 16.4 6.6 19.4l1.3-6L3.4 9.3l6-.7L12 3Z" /></svg></div>
            <h4>Lifetime repairs</h4>
            <p>Every piece is numbered. Send it back and we’ll mend it, no charge.</p>
          </div>
          <div className="promise rv d2">
            <div className="ic"><svg viewBox="0 0 24 24"><path d="M3 12h13l-4-4M16 12l-4 4" /><path d="M19 5v14" /></svg></div>
            <h4>Free returns, 30 days</h4>
            <p>Unworn and uncut? Send them back, we’ll cover the postage.</p>
          </div>
        </div>
      </div>
    </section>
  );
}
