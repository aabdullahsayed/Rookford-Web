import React from "react";

export function Editorial({ goTo }) {
  return (
    <section>
      <div className="wrap edit">
        <div className="edit-art rv">
          <svg viewBox="0 0 400 500" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
            <circle cx="270" cy="190" r="86" fill="#eee8d8" opacity=".9" />
            <path d="M0 330h60l8-40h60l8 40h70l10-70h80l10 70h134v170H0z" fill="#625b50" opacity=".7" />
            <path d="M0 390h110l10-44h90l10 44h80l12-60h88v170H0z" fill="#37342f" />
            <g transform="translate(150 244)">
              <path d="M0 52C34 78 116 78 150 52C130 34 112 32 75 32C38 32 20 34 0 52Z" fill="#2b1a12" />
              <path d="M26 40C22 -10 44 -34 62 -28Q75 -20 88 -28C106 -34 128 -10 124 40Z" fill="#3a2418" />
              <path d="M25 28C50 38 100 38 125 28L124 40C100 48 50 48 26 40Z" fill="#8d8272" />
            </g>
          </svg>
          <span className="tag">Plate Nº 12 — Dusk on the delta</span>
        </div>
        <div className="edit-copy">
          <span className="sec-num">03 / From the Journal</span>
          <h2 className="h-lg rv d1">Not made to<br /><em>stay new.</em></h2>
          <p className="drop rv d1">
            Rookford began with a simple idea: a pair of jeans should get better the harder you
            work in them. We partner with mills in Bangladesh — heir to a textile legacy that
            gave the world Dhaka muslin, once called “woven air” — where skilled hands still run
            shuttle looms the slow way.
          </p>
          <p className="rv d2">
            Bangladesh is now one of the world’s great denim workshops. Low-tension weaving
            gives each yard its own uneven, imperfect character. Rope-dyed yarn leaves the heart
            of every thread undyed so that, with wear, the cloth fades from midnight to the
            pale blue of an open sky.
          </p>
          <div className="pull rv d2">“Buy it once. Wear it hard. Bring it back when it needs mending.”</div>
          <a href="#journal" className="link rv d3" onClick={(e) => { e.preventDefault(); goTo("#journal"); }}>
            Read the story <span className="arrow">→</span>
          </a>
        </div>
      </div>
    </section>
  );
}
