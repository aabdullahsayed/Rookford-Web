import React from "react";

export function Lookbook({ railBy, railRef }) {
  return (
    <section className="look" id="lookbook">
      <div className="wrap">
        <div className="sec-head">
          <div>
            <span className="sec-num">05 / Lookbook</span>
            <h2 className="h-lg rv d1">Chapters from<br /><em>the road.</em></h2>
          </div>
          <div className="rail-ctl rv">
            <button className="rbtn" aria-label="Previous" onClick={() => railBy(-1)}>
              <svg viewBox="0 0 24 24"><path d="M15 5l-7 7 7 7" /></svg>
            </button>
            <button className="rbtn" aria-label="Next" onClick={() => railBy(1)}>
              <svg viewBox="0 0 24 24"><path d="M9 5l7 7-7 7" /></svg>
            </button>
          </div>
        </div>
      </div>
      <div className="rail" ref={railRef}>
        {[
          { n: "01", bg: "linear-gradient(170deg,#444e5a,#1b2027)", h: "First light, Dhaka", p: "Raw straight jeans with the Marshal chore coat.", fill: "#0a111d", d: "M0 120V70h50l8-24h40l8 24h60l8-40h60l8 40h58v50z" },
          { n: "02", bg: "linear-gradient(170deg,#b3ac9d,#625b50)", h: "Dust & diesel", p: "Saddle tan canvas, ecru relaxed denim, bone felt hat.", fill: "#3a2214", d: "M0 120V80h70l10-30h50l10 30h70l8-44h82v84z" },
          { n: "03", bg: "linear-gradient(170deg,#aab2ba,#59626d)", h: "Blue hour", p: "Dusk-wash western shirts layered over raw indigo.", fill: "#1a2a44", d: "M0 120V60h60l12-30h50l8 30h80l10-34h80v94z" },
          { n: "04", bg: "linear-gradient(170deg,#4a4e57,#14161a)", h: "Night shift", p: "Washed black everything. Quiet, heavy, uncompromising.", fill: "#000", d: "M0 120V76h80l10-36h46l10 36h60l12-50h82v94z" },
          { n: "05", bg: "linear-gradient(170deg,#8d8272,#453f36)", h: "Homestead", p: "Rust canvas trucker, sawtooth shirt, and a pair of boots.", fill: "#2b170a", d: "M0 120V84h50l10-24h60l10 24h60l12-52h98v88z" },
        ].map((l) => (
          <article className="lk" key={l.n} style={{ "--bg": l.bg }}>
            <span className="n">{l.n}</span>
            <div><h4>{l.h}</h4><p>{l.p}</p></div>
            <svg viewBox="0 0 300 120" fill={l.fill} opacity=".6"><path d={l.d} /></svg>
          </article>
        ))}
      </div>
    </section>
  );
}
