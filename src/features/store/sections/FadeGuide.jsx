import React from "react";

export function FadeGuide({ fadeIndex, fadeMonths, fadeStages, fadeSvg, goTo, setFadeMonths }) {
  return (
    <section className="fade" id="fade">
      <div className="wrap fade-grid">
        <div className="fade-stage rv">
          <div dangerouslySetInnerHTML={{ __html: fadeSvg }} />
        </div>
        <div className="fade-copy">
          <span className="sec-num" style={{ color: "var(--saddle)" }}>04 / The Fade Guide</span>
          <h2 className="h-lg rv d1">Watch them<br /><em>become yours.</em></h2>
          <p className="lead">{fadeStages[fadeIndex][2]}</p>
          <div className="stage-name">{fadeStages[fadeIndex][1]}</div>
          <div className="range rv d2">
            <div className="range-val">{fadeMonths}<small>months of wear</small></div>
            <input
              type="range"
              min="0"
              max="60"
              value={fadeMonths}
              aria-label="Months of wear"
              onChange={(e) => setFadeMonths(+e.target.value)}
            />
            <div className="range-lbl"><span>Day one</span><span>Year 1</span><span>Year 3</span><span>Year 5</span></div>
          </div>
          <div style={{ marginTop: 40 }}>
            <a href="#shop" className="btn light" onClick={(e) => { e.preventDefault(); goTo("#shop", "Jeans"); }}>
              Start your fade <span className="arrow">→</span>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
