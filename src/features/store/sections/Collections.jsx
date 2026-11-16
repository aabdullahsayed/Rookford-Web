import React from "react";

export function Collections({ goTo }) {
  return (
    <section id="collections">
      <div className="wrap">
        <div className="sec-head">
          <div>
            <span className="sec-num">01 / Collections</span>
            <h2 className="h-lg rv d1">Four ways to<br /><em>wear the west.</em></h2>
          </div>
          <a href="#shop" className="link rv" onClick={(e) => { e.preventDefault(); goTo("#shop", "all"); }}>
            View everything <span className="arrow">→</span>
          </a>
        </div>
        <div className="cols">
          {[
            { cls: "c1", num: "I", title: "Raw Selvedge Jeans", copy: "Unwashed, uncut and unapologetic. Break them in on your own terms.", cat: "Jeans", link: "Shop jeans", path: "M50 12H150L162 272H108L100 108L92 272H38Z", vb: "0 0 200 280" },
            { cls: "c2", num: "II", title: "Outerwear", copy: "Chore coats and truckers in canvas-stiff denim.", cat: "Jackets", link: "Shop jackets", path: "M72 28L100 38L128 28L172 50L192 214L162 220L152 112L150 238H50L48 112L38 220L8 214L28 50Z", vb: "0 0 200 280" },
            { cls: "c3", num: "III", title: "Western Shirts", copy: "Sawtooth pockets and pearl snaps, lighter weights.", cat: "Shirts", link: "Shop shirts", path: "M74 24L100 34L126 24L168 46L184 190L158 196L150 100L148 246H52L50 100L42 196L16 190L32 46Z", vb: "0 0 200 280" },
            { cls: "c4", num: "IV", title: "Hats & Goods", copy: "Felt, leather and everything you’ll need for the road.", cat: "Headwear", link: "Shop headwear", path: "M10 150C40 185 160 185 190 150C170 130 150 128 100 128C50 128 30 130 10 150Z", vb: "0 0 200 200" },
          ].map((c, i) => (
            <a
              key={c.cls}
              href="#shop"
              className={`col-card ${c.cls} rv${i % 2 ? " d1" : ""}`}
              onClick={(e) => { e.preventDefault(); goTo("#shop", c.cat); }}
            >
              <span className="num">{c.num}</span>
              <svg className="ghostshape" viewBox={c.vb} fill="#fff"><path d={c.path} /></svg>
              <h3>{c.title}</h3>
              <p>{c.copy}</p>
              <span className="link">{c.link} <span className="arrow">→</span></span>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
