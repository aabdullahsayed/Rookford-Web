import React from "react";
import { garment } from "../../../lib/garments";

export function Hero({ goTo, hangRotRef, heroArtRef }) {
  return (
    <section className="hero">
      <div className="hero-copy">
        <div className="hero-top">
          <span className="eyebrow">Fall / Winter 2026 — Issue Nº 07</span>
          <span className="pill">The Frontier Issue</span>
        </div>
        <div>
          <h1 className="h-xl rv">Built for<br />the <em>long haul.</em></h1>
          <p className="hero-sub rv d1">
            Shuttle-loom selvedge denim, cut straight and sewn to outlast the trail. Rigid,
            honest, and built to fade into something that’s only yours.
          </p>
          <div className="hero-cta rv d2">
            <a href="#shop" className="btn solid" onClick={(e) => { e.preventDefault(); goTo("#shop", "all"); }}>
              Shop the collection <span className="arrow">→</span>
            </a>
            <a href="#fade" className="btn ghost" onClick={(e) => { e.preventDefault(); goTo("#fade"); }}>
              See how it fades
            </a>
          </div>
        </div>
        <div className="hero-meta rv d3">
          <div><b>15.5<small style={{ fontSize: 14 }}>oz</small></b><span>Selvedge twill</span></div>
          <div><b>1980s</b><span>Denim heritage</span></div>
          <div><b>∞</b><span>Free repairs</span></div>
        </div>
      </div>

      <div className="hero-art" ref={heroArtRef}>
        <div
          style={{ position: "absolute", inset: 0 }}
          dangerouslySetInnerHTML={{
            __html: `<svg class="scene" viewBox="0 0 800 900" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
<defs>
<linearGradient id="sky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#1b2027"/><stop offset=".45" stop-color="#3f4a58"/><stop offset=".72" stop-color="#8e8b85"/><stop offset="1" stop-color="#cfc9bb"/></linearGradient>
<radialGradient id="sun" cx=".5" cy=".5" r=".5"><stop offset="0" stop-color="#f3eee0"/><stop offset=".55" stop-color="#e3dccb"/><stop offset="1" stop-color="#e3dccb" stop-opacity="0"/></radialGradient>
</defs>
<rect width="800" height="900" fill="url(#sky)"/>
<g class="layer" data-d="6"><circle cx="540" cy="560" r="230" fill="url(#sun)" opacity=".9"/><circle cx="540" cy="560" r="82" fill="#eee8d8"/></g>
<g class="layer" data-d="10" fill="#d9d4c8" opacity=".5"><path d="M0 650h150l10-40h60l10 40h90l8-70h70l10 70h140l10-30h90l10 30h152v250H0z"/></g>
<g class="layer" data-d="16"><path d="M0 700h90l8-60h80l10 60h70l14-110h110l14 110h110l12-45h90l10 45h192v200H0z" fill="#6f6a62" opacity=".85"/></g>
<g class="layer" data-d="26"><path d="M0 760h120l10-50h100l10 50h110l12-90h130l12 90h110l10-30h60l10 30h116v140H0z" fill="#37342f"/></g>
<g class="layer" data-d="40"><path d="M0 830h800v70H0z" fill="#1b130f"/>
<g stroke="#1b130f" stroke-width="5" fill="none" stroke-linecap="round"><path d="M40 830V760M140 830V762M240 830V758M340 830V764M440 830V760M540 830V762M640 830V758M740 830V764"/><path d="M20 776H760M20 796H760" stroke-width="2.5"/></g></g>
</svg>`,
          }}
        />
        <div className="twill" />

        <div className="hero-3d" aria-hidden="true">
          <div className="rod" />
          <div className="hang-rot" ref={hangRotRef}>
            <div className="hang3d">
              <svg className="hk" viewBox="0 0 200 70">
                <defs>
                  <linearGradient id="hkW" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0" stopColor="#c79a62" />
                    <stop offset="0.55" stopColor="#94673a" />
                    <stop offset="1" stopColor="#5a3719" />
                  </linearGradient>
                  <linearGradient id="hkM" x1="0" y1="0" x2="1" y2="0">
                    <stop offset="0" stopColor="#6d7279" />
                    <stop offset="0.45" stopColor="#d4d7db" />
                    <stop offset="1" stopColor="#5a5f66" />
                  </linearGradient>
                </defs>
                <path d="M100 0V15" stroke="url(#hkM)" strokeWidth="3" fill="none" />
                <circle cx="100" cy="17" r="4" fill="none" stroke="url(#hkM)" strokeWidth="2.4" />
                <rect x="28" y="24" width="144" height="10" rx="5" fill="url(#hkW)" />
                <rect x="30" y="25" width="140" height="2.4" rx="1.2" fill="#fff" opacity=".28" />
                <path d="M50 34V58Q50 62 54 62H67V56H58V34Z" fill="url(#hkM)" />
                <path d="M150 34V58Q150 62 146 62H133V56H142V34Z" fill="url(#hkM)" />
              </svg>
              <div
                className="jeans3d"
                dangerouslySetInnerHTML={{ __html: garment("jeans", { b: "#222c3a", s: "#c79a62" }) }}
              />
              <div className="tag3d">
                <div className="str" />
                <div className="lea">
                  <span><b>R</b>No. 1<br />15.5 OZ</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="hero-cap">
          Cut from 15.5oz sulfur-dyed selvedge.<br />Woven in Bangladesh.
        </div>

        <div className="hero-badge" aria-hidden="true">
          <svg viewBox="0 0 140 140">
            <defs>
              <path id="badgeArc" d="M 22,70 A 48,48 0 0,1 118,70" fill="none" />
            </defs>
            <circle cx="70" cy="70" r="66" fill="none" stroke="currentColor" strokeWidth="1.6" />
            <circle cx="70" cy="70" r="60" fill="none" stroke="currentColor" strokeWidth="0.6" opacity=".5" />
            <text fontFamily="'Barlow Condensed',sans-serif" fontWeight="700" fontSize="13" letterSpacing="3.6" fill="currentColor">
              <textPath href="#badgeArc" startOffset="50%" textAnchor="middle">ROOKFORD</textPath>
            </text>
            <path d="M70 50 l4.9 11.3 12.3 0.9 -9.4 8 3 12.1 -10.8 -6.4 -10.8 6.4 3 -12.1 -9.4 -8 12.3 -0.9 z" fill="currentColor" />
            <text x="70" y="98" textAnchor="middle" fontFamily="'Barlow Condensed',sans-serif" fontWeight="600" fontSize="8" letterSpacing="2.8" fill="currentColor">EST. 1968</text>
            <text x="70" y="110" textAnchor="middle" fontFamily="'Barlow Condensed',sans-serif" fontWeight="500" fontSize="5.5" letterSpacing="2.4" fill="currentColor" opacity=".6">DHAKA · BANGLADESH</text>
          </svg>
        </div>
      </div>
    </section>
  );
}
