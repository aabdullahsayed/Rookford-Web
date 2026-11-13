import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";

/* ====================================================================
   BACKEND
   ==================================================================== */
const API = {
  products: "/api/products",
  reviews: "/api/reviews",
  journal: "/api/journal",
  orders: "/api/orders",
  adminLogin: "/api/admin/login",
};

async function getJSON(url, fallback) {
  try {
    const res = await fetch(url, { headers: { Accept: "application/json" } });
    if (!res.ok) throw new Error(res.status);
    const data = await res.json();
    if (Array.isArray(data)) return data;
    if (Array.isArray(data?.items)) return data.items;
    if (Array.isArray(data?.data)) return data.data;
    return fallback;
  } catch {
    return fallback;
  }
}

/* ====================================================================
   CONSTANTS
   ==================================================================== */
const LOGO_SRC = "/logo.png";
const FREE_SHIPPING = 250;
const INS = ["Uncut (34 in)", "32 in", "30 in", "Custom — see note"];
const SHIP = {
  std: { n: "Standard delivery", t: "5–9 business days · free over $250, otherwise $15", p: 15 },
  exp: { n: "Express delivery", t: "2–4 business days · $35", p: 35 },
  pick: { n: "Studio pickup", t: "SoHo atelier · ready in 48 hours · free", p: 0 },
};
const PAY = {
  card: { n: "Card payment", t: "A secure payment link is sent once you confirm", f: 0 },
  cod: { n: "Cash on delivery", t: "Pay on arrival · +$5 handling", f: 5 },
  bank: { n: "Bank / mobile wallet", t: "Transfer details sent by email", f: 0 },
};
const COUNTRIES = [
  "United States", "Canada", "United Kingdom", "Australia", "Germany", "France",
  "Italy", "Japan", "Singapore", "United Arab Emirates", "India", "Bangladesh", "Other",
];
const ANNOUNCEMENTS = [
  "Free worldwide shipping over $250",
  "Complimentary chainstitch hemming on every pair",
  "Repaired for life at our workshop",
];
const TICKER = [
  "Shuttle-loom selvedge", "Woven in Kojima", "Free chainstitch hemming",
  "Copper hardware", "Repaired for life", "Raw, rigid, real", "Made to be worn hard",
];

/* ====================================================================
   HELPERS
   ==================================================================== */
const money = (n) => "$" + (Math.round(n * 100) / 100).toFixed(n % 1 ? 2 : 0);
const esc = (s) =>
  String(s == null ? "" : s).replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));

const store = {
  get(k, d) { try { const v = localStorage.getItem(k); return v ? JSON.parse(v) : d; } catch { return d; } },
  set(k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch {} },
};

const DEFAULT_COLOR = { name: "Natural", b: "#222c3a", s: "#c79a62" };
const GARMENT_TYPES = ["jeans", "jacket", "shirt", "hat"];

function guessType(cat = "") {
  const c = String(cat).toLowerCase();
  if (c.includes("jean") || c.includes("denim")) return "jeans";
  if (c.includes("jacket") || c.includes("coat") || c.includes("outer")) return "jacket";
  if (c.includes("shirt")) return "shirt";
  if (c.includes("hat") || c.includes("head")) return "hat";
  return "jeans";
}

function normalizeProduct(p, i) {
  const type = GARMENT_TYPES.includes(p.type) ? p.type : guessType(p.cat || p.category);
  const rawColors = p.colors || p.colorways || [];
  const colors = (Array.isArray(rawColors) && rawColors.length ? rawColors : [{}]).map((c, ci) => ({
    name: c.name || c.label || DEFAULT_COLOR.name,
    b: c.body || c.hex || c.base || DEFAULT_COLOR.b,
    s: c.stitch || c.accent || DEFAULT_COLOR.s,
    _i: ci,
  }));
  const sizes = Array.isArray(p.sizes) && p.sizes.length
    ? p.sizes.map(String)
    : type === "jeans" ? ["28", "29", "30", "31", "32", "33", "34", "36", "38"]
    : type === "hat" ? ["S", "M", "L"] : ["S", "M", "L", "XL"];
  return {
    id: p.id ?? p._id ?? i,
    name: p.name || "Untitled",
    cat: p.cat || p.category || "Shop",
    price: Number(p.price) || 0,
    type,
    badge: p.badge || "",
    desc: p.desc || p.description || "",
    fabric: p.fabric || "",
    fit: p.fit || "",
    colors, sizes,
  };
}

/* ====================================================================
   GARMENT ILLUSTRATION ENGINE
   ==================================================================== */
let GU = 0;
const hx = (h) => [1, 3, 5].map((i) => parseInt(h.slice(i, i + 2), 16));
const toHex = (a) => "#" + a.map((v) => Math.max(0, Math.min(255, Math.round(v))).toString(16).padStart(2, "0")).join("");
const shade = (h, t) => (t < 0 ? toHex(hx(h).map((v) => v * (1 + t))) : toHex(hx(h).map((v) => v + (255 - v) * t)));
const stops = (a, c) => a.map((x) => `<stop offset="${x[0]}" stop-color="${c}" stop-opacity="${x[1]}"/>`).join("");
const stitchP = (d, s, w) =>
  `<path d="${d}" transform="translate(.5 .9)" fill="none" stroke="#000" stroke-opacity=".38" stroke-width="${w || 1.5}" stroke-dasharray="3.6 3" stroke-linecap="round"/><path d="${d}" fill="none" stroke="${s}" stroke-width="${w || 1.5}" stroke-dasharray="3.6 3" stroke-linecap="round"/>`;
const rivet = (u, x, y, r) =>
  `<circle cx="${x + 0.5}" cy="${y + 1}" r="${r + 0.7}" fill="#000" opacity=".32"/><circle cx="${x}" cy="${y}" r="${r}" fill="url(#rv${u})"/><circle cx="${x - r * 0.3}" cy="${y - r * 0.35}" r="${r * 0.28}" fill="#fff" opacity=".6"/>`;
const pearl = (u, x, y, r) =>
  `<circle cx="${x + 0.4}" cy="${y + 0.9}" r="${r + 0.5}" fill="#000" opacity=".3"/><circle cx="${x}" cy="${y}" r="${r}" fill="url(#pl${u})"/><circle cx="${x}" cy="${y}" r="${r * 0.55}" fill="none" stroke="#000" stroke-opacity=".18" stroke-width=".7"/>`;

function wrapG(o) {
  const u = ++GU;
  const [w, h] = o.vb;
  const y0 = o.y0 || 0;
  const b = o.body;
  const s = o.s;
  const outs = [].concat(o.out);
  const lum = (hx(b)[0] * 0.3 + hx(b)[1] * 0.59 + hx(b)[2] * 0.11) / 255;
  const txA = (o.txo || 0.4) * (lum > 0.62 ? 0.3 : lum > 0.45 ? 0.6 : 1);
  const R = `x="0" y="${y0}" width="${w}" height="${h}"`;
  const FU = `filterUnits="userSpaceOnUse" x="0" y="${y0}" width="${w}" height="${h}"`;
  return `<svg viewBox="0 ${y0} ${w} ${h}" aria-hidden="true"><defs>
<linearGradient id="sd${u}" gradientUnits="userSpaceOnUse" x1="0" y1="0" x2="${w}" y2="0">${stops(o.dark, "#000")}</linearGradient>
<linearGradient id="lt${u}" gradientUnits="userSpaceOnUse" x1="0" y1="0" x2="${w}" y2="0">${stops(o.light, "#fff")}</linearGradient>
<linearGradient id="vt${u}" gradientUnits="userSpaceOnUse" x1="0" y1="${y0}" x2="0" y2="${y0 + h}"><stop offset="0" stop-color="#fff" stop-opacity=".12"/><stop offset=".45" stop-color="#000" stop-opacity="0"/><stop offset="1" stop-color="#000" stop-opacity=".2"/></linearGradient>
<linearGradient id="wd${u}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#c79a62"/><stop offset=".5" stop-color="#9a6b3e"/><stop offset="1" stop-color="#5e3a1c"/></linearGradient>
<radialGradient id="rv${u}" cx=".35" cy=".3" r=".8"><stop offset="0" stop-color="${shade(s, 0.55)}"/><stop offset=".5" stop-color="${s}"/><stop offset="1" stop-color="${shade(s, -0.6)}"/></radialGradient>
<radialGradient id="pl${u}" cx=".35" cy=".3" r=".8"><stop offset="0" stop-color="#fff"/><stop offset=".6" stop-color="#e6dfcf"/><stop offset="1" stop-color="#9c9484"/></radialGradient>
<pattern id="tw${u}" width="3.2" height="3.2" patternUnits="userSpaceOnUse" patternTransform="rotate(58)"><rect width="1.2" height="3.2" fill="#fff" opacity=".12"/><rect x="1.7" width=".9" height="3.2" fill="#000" opacity=".1"/></pattern>
<filter id="tx${u}" ${FU}><feTurbulence type="fractalNoise" baseFrequency="${o.bf || ".8 .14"}" numOctaves="2" seed="${(u % 9) + 1}"/><feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 2.6 0 0 0 -1.05"/></filter>
<filter id="bl${u}" ${FU}><feGaussianBlur stdDeviation="1.3"/></filter>
<filter id="fs${u}" ${FU}><feGaussianBlur stdDeviation="5"/></filter>
<clipPath id="cp${u}">${outs.map((d) => `<path d="${d}"/>`).join("")}</clipPath></defs>
<ellipse cx="${w / 2}" cy="${o.fy}" rx="${o.frx}" ry="${o.fry || 7}" fill="#000" opacity="${o.fo || 0.34}" filter="url(#fs${u})"/>
${o.back ? o.back(u) : ""}
${outs.map((d) => `<path d="${d}" fill="${b}"/>`).join("")}
<g clip-path="url(#cp${u})"><rect ${R} fill="url(#sd${u})"/><rect ${R} fill="url(#lt${u})"/><rect ${R} fill="url(#vt${u})"/><rect ${R} filter="url(#tx${u})" opacity="${txA}"/>${o.tw === false ? "" : `<rect ${R} fill="url(#tw${u})"/>`}<g filter="url(#bl${u})">${o.folds || ""}</g>${o.inner ? o.inner(u) : ""}</g>
${outs.map((d) => `<path d="${d}" fill="none" stroke="#000" stroke-opacity=".3" stroke-width="1"/>`).join("")}
${o.top ? o.top(u) : ""}</svg>`;
}

const hanger = (u) =>
  `<path d="M100 -9C104 -9 107 -6 107 -2C107 3 102 4 100 9" fill="none" stroke="#6d7279" stroke-width="2.4" stroke-linecap="round"/><path d="M100 8L10 52Q7 54 7 57V59L100 16L193 59V57Q193 54 190 52Z" fill="url(#wd${u})"/><path d="M100 8L10 52" stroke="#fff" stroke-opacity=".28" fill="none"/>`;

const JOUT =
  "M52 14H148C152 40 156 62 157 92C159 150 164 222 164 272L109 272C107 222 103 166 100 120C97 166 93 222 91 272L36 272C36 222 41 150 43 92C44 62 48 40 52 14Z";

function jeans(col, extra) {
  const b = col.b, s = col.s, k = "#000";
  return wrapG({
    vb: [200, 284], body: b, s, out: JOUT, fy: 279, frx: 62,
    dark: [[0, 0.3], [0.17, 0.3], [0.22, 0.16], [0.335, 0.02], [0.44, 0.18], [0.5, 0.4], [0.56, 0.18], [0.665, 0.02], [0.78, 0.16], [0.83, 0.3], [1, 0.3]],
    light: [[0, 0], [0.2, 0], [0.26, 0.1], [0.335, 0.2], [0.42, 0.05], [0.5, 0], [0.58, 0.05], [0.665, 0.2], [0.74, 0.1], [0.8, 0], [1, 0]],
    folds: `<g fill="none" stroke-linecap="round"><path d="M100 36V118" stroke="${k}" stroke-opacity=".28" stroke-width="2.6"/><path d="M100 120C90 146 82 176 78 204" stroke="${k}" stroke-opacity=".14" stroke-width="5"/><path d="M100 120C110 146 118 176 122 204" stroke="${k}" stroke-opacity=".14" stroke-width="5"/><path d="M50 100C62 114 80 120 97 121" stroke="${k}" stroke-opacity=".16" stroke-width="5"/><path d="M150 100C138 114 120 120 103 121" stroke="${k}" stroke-opacity=".16" stroke-width="5"/><path d="M44 190C60 199 78 199 92 190" stroke="${k}" stroke-opacity=".16" stroke-width="3.2"/><path d="M44 185C60 194 78 194 92 185" stroke="#fff" stroke-opacity=".14" stroke-width="2.2"/><path d="M108 190C122 199 140 199 157 190" stroke="${k}" stroke-opacity=".16" stroke-width="3.2"/><path d="M108 185C122 194 140 194 157 185" stroke="#fff" stroke-opacity=".14" stroke-width="2.2"/><path d="M38 236C58 244 76 244 91 236M38 226C58 234 76 234 91 226" stroke="${k}" stroke-opacity=".12" stroke-width="2.4"/><path d="M109 236C124 244 142 244 163 236M109 226C124 234 142 234 163 226" stroke="${k}" stroke-opacity=".12" stroke-width="2.4"/></g>`,
    inner: (u) =>
      `<path d="M52 14H148L150.6 34H49.4Z" fill="${k}" opacity=".2"/><path d="M52 14.8H148" stroke="#fff" stroke-opacity=".25" fill="none"/><path d="M49.4 34H150.6" stroke="${k}" stroke-opacity=".4" stroke-width="1.3" fill="none"/>
<path d="M36 251C58 258 76 258 92 251L92 273L36 273Z" fill="#fff" opacity=".07"/><path d="M108 251C124 258 144 258 164 251L164 273L108 273Z" fill="#fff" opacity=".07"/>
<path d="M36 251C58 258 76 258 92 251" fill="none" stroke="${k}" stroke-opacity=".4" stroke-width="1.6"/><path d="M108 251C124 258 144 258 164 251" fill="none" stroke="${k}" stroke-opacity=".4" stroke-width="1.6"/>
<rect x="30" y="268" width="66" height="5" fill="#f1ece0"/><rect x="104" y="268" width="66" height="5" fill="#f1ece0"/><path d="M30 270.4H96M104 270.4H170" stroke="#b3261e" stroke-width=".9"/>${extra || ""}`,
    top: (u) =>
      [59, 79, 119, 139]
        .map((x) => `<rect x="${x - 2.5}" y="10" width="5" height="26" rx="1.2" fill="${shade(b, -0.1)}" stroke="${k}" stroke-opacity=".35" stroke-width=".7"/><path d="M${x - 1.2} 12V34" stroke="#fff" stroke-opacity=".2" fill="none"/>`)
        .join("") +
      stitchP("M53 19H147", s, 1.1) + stitchP("M51 30H149", s, 1.1) +
      stitchP("M100 36V104C100 113 94 116 89 113", s) +
      `<path d="M52 34C62 44 74 58 78 82" fill="none" stroke="${k}" stroke-opacity=".4" stroke-width="1.4"/><path d="M148 34C138 44 126 58 122 82" fill="none" stroke="${k}" stroke-opacity=".4" stroke-width="1.4"/>` +
      stitchP("M54.5 35C64 45 76 59 80.5 82", s) + stitchP("M145.5 35C136 45 124 59 119.5 82", s) +
      rivet(u, 78, 83, 3.1) + rivet(u, 122, 83, 3.1) +
      `<circle cx="100.5" cy="25" r="5.6" fill="${k}" opacity=".3"/><circle cx="100" cy="24" r="5.1" fill="url(#rv${u})"/><circle cx="100" cy="24" r="3.1" fill="none" stroke="${k}" stroke-opacity=".3" stroke-width=".8"/>` +
      stitchP("M36 254C58 261 76 261 92 254", s, 1.2) + stitchP("M108 254C124 261 144 261 164 254", s, 1.2),
  });
}

const JKOUT =
  "M70 26C82 34 90 40 100 40C110 40 118 34 130 26L172 48C180 60 186 140 192 212L163 219C158 180 154 140 152 112C152 150 152 200 150 244L50 244C48 200 48 150 48 112C46 140 42 180 37 219L8 212C14 140 20 60 28 48Z";

function jacket(col) {
  const b = col.b, s = col.s, k = "#000";
  return wrapG({
    vb: [200, 296], y0: -12, body: b, s, out: JKOUT, fy: 279, frx: 66, fo: 0.2,
    dark: [[0, 0.3], [0.05, 0.3], [0.1, 0.2], [0.17, 0.05], [0.23, 0.22], [0.3, 0.1], [0.4, 0.04], [0.5, 0.16], [0.6, 0.04], [0.7, 0.1], [0.77, 0.22], [0.83, 0.05], [0.9, 0.2], [0.95, 0.3], [1, 0.3]],
    light: [[0, 0], [0.12, 0.08], [0.18, 0.14], [0.3, 0.1], [0.4, 0.14], [0.46, 0.02], [0.54, 0.02], [0.6, 0.14], [0.7, 0.1], [0.82, 0.14], [0.88, 0.08], [1, 0]],
    back: (u) => hanger(u) + `<path d="M66 24C80 17 120 17 134 24C130 31 118 37 100 37C82 37 70 31 66 24Z" fill="${shade(b, -0.22)}"/>`,
    folds: `<g fill="none" stroke-linecap="round"><path d="M48 112C44 130 40 160 38 190" stroke="${k}" stroke-opacity=".2" stroke-width="5"/><path d="M152 112C156 130 160 160 162 190" stroke="${k}" stroke-opacity=".2" stroke-width="5"/><path d="M14 150C22 158 32 160 40 155M14 160C22 168 32 170 40 165" stroke="${k}" stroke-opacity=".16" stroke-width="3"/><path d="M186 150C178 158 168 160 160 155M186 160C178 168 168 170 160 165" stroke="${k}" stroke-opacity=".16" stroke-width="3"/><path d="M62 72C80 86 92 82 98 68M138 72C120 86 108 82 102 68" stroke="${k}" stroke-opacity=".12" stroke-width="4"/><path d="M56 190C80 198 120 198 144 190" stroke="${k}" stroke-opacity=".12" stroke-width="4"/><path d="M62 160C70 168 84 170 94 164" stroke="#fff" stroke-opacity=".1" stroke-width="3"/></g>`,
    inner: (u) =>
      `<path d="M70 26L100 40L86 68L60 46Z" fill="${k}" opacity=".2"/><path d="M130 26L100 40L114 68L140 46Z" fill="${k}" opacity=".12"/><path d="M60 46L86 68M140 46L114 68" stroke="${k}" stroke-opacity=".35" stroke-width="1.2" fill="none"/><rect x="94" y="40" width="12" height="204" fill="${k}" opacity=".08"/><path d="M50 234H150V244H50Z" fill="${k}" opacity=".1"/><path d="M58 98H92V111L75 118L58 111Z" fill="${k}" opacity=".15"/><path d="M108 98H142V111L125 118L108 111Z" fill="${k}" opacity=".15"/><path d="M58 111V138H92V111M108 111V138H142V111" fill="#fff" fill-opacity=".03" stroke="${k}" stroke-opacity=".3" stroke-width="1"/><path d="M9 202L39 209L37.5 220L8 213Z" fill="${k}" opacity=".15"/><path d="M191 202L161 209L162.5 220L192 213Z" fill="${k}" opacity=".15"/>` +
      stitchP("M94 44V244", s, 1.1) + stitchP("M106 44V244", s, 1.1) + stitchP("M50 234H150", s, 1.2) +
      stitchP("M72 31L34 52", s, 1.1) + stitchP("M128 31L166 52", s, 1.1) +
      stitchP("M60 100.5H90V110L75 116L60 110Z", s, 1.1) + stitchP("M110 100.5H140V110L125 116L110 110Z", s, 1.1) +
      stitchP("M9 205L39 212", s, 1.1) + stitchP("M191 205L161 212", s, 1.1),
    top: (u) =>
      [64, 104, 144, 184, 224]
        .map((y) => `<circle cx="100.5" cy="${y + 0.9}" r="5" fill="${k}" opacity=".3"/><circle cx="100" cy="${y}" r="4.6" fill="url(#rv${u})"/><circle cx="100" cy="${y}" r="2.6" fill="none" stroke="${k}" stroke-opacity=".3" stroke-width=".8"/>`)
        .join("") + rivet(u, 75, 114, 2.3) + rivet(u, 125, 114, 2.3),
  });
}

const SHOUT =
  "M72 26C82 34 90 38 100 38C110 38 118 34 128 26L168 46C174 56 180 120 185 192L158 198C155 160 151 130 150 100C150 150 150 205 148 250L52 250C50 205 50 150 50 100C49 130 45 160 42 198L15 192C20 120 26 56 32 46Z";

function shirt(col) {
  const b = col.b, s = col.s, k = "#000";
  return wrapG({
    vb: [200, 296], y0: -12, body: b, s, out: SHOUT, fy: 279, frx: 62, fo: 0.2, txo: 0.34,
    dark: [[0, 0.26], [0.08, 0.26], [0.13, 0.14], [0.2, 0.04], [0.25, 0.2], [0.32, 0.06], [0.42, 0.03], [0.5, 0.12], [0.58, 0.03], [0.68, 0.06], [0.75, 0.2], [0.8, 0.04], [0.87, 0.14], [0.92, 0.26], [1, 0.26]],
    light: [[0, 0], [0.12, 0.06], [0.2, 0.12], [0.32, 0.1], [0.4, 0.12], [0.5, 0.02], [0.6, 0.12], [0.68, 0.1], [0.8, 0.12], [0.88, 0.06], [1, 0]],
    back: (u) => hanger(u) + `<path d="M68 24C82 17 118 17 132 24C128 30 116 35 100 35C84 35 72 30 68 24Z" fill="${shade(b, -0.4)}"/>`,
    folds: `<g fill="none" stroke-linecap="round"><path d="M50 100C47 140 47 190 50 238" stroke="${k}" stroke-opacity=".16" stroke-width="5"/><path d="M150 100C153 140 153 190 150 238" stroke="${k}" stroke-opacity=".16" stroke-width="5"/><path d="M60 150C80 160 120 160 140 150" stroke="${k}" stroke-opacity=".1" stroke-width="5"/><path d="M60 190C80 198 120 198 140 190" stroke="${k}" stroke-opacity=".1" stroke-width="5"/><path d="M62 170C72 178 86 180 94 174" stroke="#fff" stroke-opacity=".12" stroke-width="3"/><path d="M22 120C28 130 34 150 40 168M178 120C172 130 166 150 160 168" stroke="${k}" stroke-opacity=".14" stroke-width="4"/></g>`,
    inner: (u) =>
      `<path d="M72 26L100 38L90 62L64 46Z" fill="${k}" opacity=".16"/><path d="M128 26L100 38L110 62L136 46Z" fill="${k}" opacity=".08"/><path d="M64 46L90 62M136 46L110 62" stroke="${k}" stroke-opacity=".3" stroke-width="1.1" fill="none"/><rect x="95" y="38" width="10" height="212" fill="${k}" opacity=".07"/><path d="M58 104H92V126L75 136L58 126Z" fill="${k}" opacity=".13"/><path d="M108 104H142V126L125 136L108 126Z" fill="${k}" opacity=".13"/><path d="M15.6 182L41.4 188L42 198L15 192Z" fill="${k}" opacity=".12"/><path d="M184.4 182L158.6 188L158 198L185 192Z" fill="${k}" opacity=".12"/>` +
      stitchP("M52 62L100 86L148 62", s, 1.1) +
      stitchP("M60.5 107H89.5V124L75 132L60.5 124Z", s, 1.1) +
      stitchP("M110.5 107H139.5V124L125 132L110.5 124Z", s, 1.1) +
      stitchP("M52 242H148", s, 1.1) + stitchP("M16 186L41 192", s, 1) + stitchP("M184 186L159 192", s, 1),
    top: (u) =>
      [66, 98, 130, 162, 194, 226].map((y) => pearl(u, 100, y, 3.2)).join("") +
      pearl(u, 75, 129, 2.3) + pearl(u, 125, 129, 2.3) + pearl(u, 28, 190, 2.4) + pearl(u, 172, 190, 2.4),
  });
}

function hat(col) {
  const b = col.b, s = col.s, k = "#000";
  return wrapG({
    vb: [200, 200], body: b, s, fy: 186, frx: 80, fo: 0.3, tw: false, bf: "1.3 1.3", txo: 0.5,
    out: [
      "M6 138C38 178 162 178 194 138C174 114 150 112 100 112C50 112 26 114 6 138Z",
      "M50 126C42 56 68 24 92 32Q100 42 108 32C132 24 158 56 150 126Z",
    ],
    dark: [[0, 0.3], [0.1, 0.26], [0.25, 0.08], [0.4, 0.02], [0.5, 0.1], [0.6, 0.02], [0.75, 0.08], [0.9, 0.26], [1, 0.3]],
    light: [[0, 0], [0.2, 0], [0.32, 0.12], [0.42, 0.08], [0.5, 0], [0.62, 0.1], [0.72, 0.1], [0.85, 0], [1, 0]],
    folds: `<g fill="none" stroke-linecap="round"><path d="M100 34V80" stroke="${k}" stroke-opacity=".42" stroke-width="5"/><path d="M72 42C64 70 64 98 66 120" stroke="${k}" stroke-opacity=".2" stroke-width="6"/><path d="M128 42C136 70 136 98 134 120" stroke="${k}" stroke-opacity=".2" stroke-width="6"/><path d="M82 40C77 70 77 98 79 118" stroke="#fff" stroke-opacity=".14" stroke-width="5"/><path d="M118 40C123 70 123 98 121 118" stroke="#fff" stroke-opacity=".1" stroke-width="5"/></g>`,
    inner: (u) =>
      `<ellipse cx="100" cy="128" rx="54" ry="9" fill="${k}" opacity=".22"/><path d="M6 138C38 178 162 178 194 138C190 146 170 168 100 170C30 168 10 146 6 138Z" fill="${k}" opacity=".2"/><ellipse cx="100" cy="140" rx="70" ry="10" fill="#fff" opacity=".06"/><path d="M49.5 110C78 122 122 122 150.5 110L151 126C122 138 78 138 49 126Z" fill="${s}"/><path d="M49.5 110C78 122 122 122 150.5 110L151 126C122 138 78 138 49 126Z" fill="url(#vt${u})"/><path d="M49.5 110C78 122 122 122 150.5 110" stroke="#fff" stroke-opacity=".3" fill="none"/><path d="M49 126C78 138 122 138 151 126" stroke="${k}" stroke-opacity=".45" fill="none"/>`,
    top: (u) =>
      stitchP("M12 139C44 172 156 172 188 139", s, 1.1) +
      `<rect x="90" y="118" width="20" height="13" rx="1.6" fill="none" stroke="url(#rv${u})" stroke-width="2.4"/><rect x="95" y="122" width="10" height="5" fill="none" stroke="${k}" stroke-opacity=".3" stroke-width=".8"/>`,
  });
}

function garment(type, color, extra) {
  const c = color && color.b ? color : DEFAULT_COLOR;
  if (type === "jeans") return jeans(c, extra);
  if (type === "jacket") return jacket(c);
  if (type === "shirt") return shirt(c);
  if (type === "hat") return hat(c);
  return jeans(c, extra);
}

/* ====================================================================
   SMALL COMPONENTS
   ==================================================================== */
const HeartIcon = ({ filled }) => (
  <svg viewBox="0 0 24 24" style={filled ? { fill: "#9b3a26", stroke: "#9b3a26" } : undefined}>
    <path d="M12 20s-7.5-4.6-7.5-10.2A4.3 4.3 0 0 1 12 7.3a4.3 4.3 0 0 1 7.5 2.5C19.5 15.4 12 20 12 20Z" />
  </svg>
);

function Stat({ n, dec = 0, sup, label, note, delay }) {
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

function LineNote({ value, onChange }) {
  const [open, setOpen] = useState(false);
  return (
    <>
      <button
        className="rm"
        style={{ margin: "10px 0 0", display: "inline-block" }}
        onClick={() => setOpen((o) => !o)}
      >
        {value ? "Edit note" : "+ Add note / hem request"}
      </button>
      {open && (
        <div className="ln-row on">
          <input
            maxLength={120}
            value={value}
            placeholder="e.g. hem to 31 in, monogram R.K."
            onChange={(e) => onChange(e.target.value)}
            autoFocus
          />
        </div>
      )}
    </>
  );
}

/* ====================================================================
   CHECKOUT
   ==================================================================== */
function Checkout({ open, cart, totals, onClose, onEditBag }) {
  const [cust, setCust] = useState(() => store.get("rf_cust", { country: "United States", contact: "Email" }));
  const [opt, setOpt] = useState({ ship: "std", pay: "card", hem: "", gift: false, giftMsg: "", notes: "", terms: false });
  const [step, setStep] = useState(1);
  const [errs, setErrs] = useState({});
  const [placing, setPlacing] = useState(false);
  const [done, setDone] = useState(null);
  const [apiError, setApiError] = useState("");
  const scrollRef = useRef(null);

  useEffect(() => {
    if (!open) return;
    setStep(1);
    setErrs({});
    setDone(null);
    setApiError("");
    if (scrollRef.current) scrollRef.current.scrollTop = 0;
  }, [open]);

  useEffect(() => { store.set("rf_cust", cust); }, [cust]);

  const shipCost = opt.ship === "std" ? (totals.tot >= FREE_SHIPPING ? 0 : SHIP.std.p) : SHIP[opt.ship].p;
  const fee = PAY[opt.pay].f;
  const total = totals.tot + shipCost + fee;
  const scrollTop = () => scrollRef.current && scrollRef.current.scrollTo({ top: 0, behavior: "smooth" });
  const setField = (k, v) => setCust((c) => ({ ...c, [k]: v }));

  const validate1 = () => {
    const e = {};
    const v = (k) => (cust[k] || "").trim();
    if (!v("fn")) e.fn = "Enter your first name";
    if (!v("ln")) e.ln = "Enter your last name";
    if (!/^\S+@\S+\.\S+$/.test(v("email"))) e.email = "Enter a valid email address";
    if (!/^[+()\d][\d\s().-]{6,}$/.test(v("phone"))) e.phone = "Enter a valid phone number";
    if (v("a1").length < 4) e.a1 = "Enter your street address";
    if (!v("city")) e.city = "Enter your city";
    if (!v("zip")) e.zip = "Enter your postal code";
    return e;
  };

  const next = () => {
    if (step === 1) {
      const e = validate1();
      setErrs(e);
      if (Object.keys(e).length) return;
      setStep(2);
    } else if (step === 2) setStep(3);
    scrollTop();
  };

  const placeOrder = async () => {
    if (!opt.terms) { setErrs((p) => ({ ...p, terms: true })); return; }
    setPlacing(true);
    setApiError("");
    const payload = {
      customer: { ...cust },
      delivery: SHIP[opt.ship].n,
      payment: PAY[opt.pay].n,
      hemming: opt.hem,
      notes: opt.notes,
      gift: opt.gift ? opt.giftMsg || "(no message)" : "",
      items: cart.map((l) => ({
        productId: l.productId,
        name: l.name,
        colour: l.color.name,
        size: l.size,
        inseam: l.ins || "",
        note: l.note || "",
        qty: l.qty,
        price: l.price,
      })),
      totals: { subtotal: totals.sub, discount: totals.disc, shipping: shipCost, fees: fee, total },
    };
    try {
      const res = await fetch(API.orders, {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error(res.status);
      const data = await res.json().catch(() => ({}));
      setDone({ ...payload, no: data.orderNumber || data.no || data.id || "—", date: new Date().toISOString() });
      scrollTop();
    } catch {
      setApiError("We couldn't reach the order service. Please try again.");
    } finally {
      setPlacing(false);
    }
  };

  const fld = (k, label, o = {}) => {
    const { req, type = "text", ph = "", full, ac = "", max = 80 } = o;
    return (
      <div className={`fld${full ? " full" : ""}${errs[k] ? " bad" : ""}`}>
        <label htmlFor={`f_${k}`}>
          {label}
          {req ? <i> *</i> : null}
        </label>
        <input
          id={`f_${k}`}
          type={type}
          value={cust[k] || ""}
          placeholder={ph}
          autoComplete={ac}
          maxLength={max}
          onChange={(e) => {
            setField(k, e.target.value);
            if (errs[k]) setErrs((p) => { const n = { ...p }; delete n[k]; return n; });
          }}
        />
        <small className="err">{errs[k] || ""}</small>
      </div>
    );
  };

  const radios = (name, obj) =>
    Object.entries(obj).map(([k, v]) => (
      <label className={`opt${opt[name] === k ? " on" : ""}`} key={k}>
        <input
          type="radio"
          name={name}
          value={k}
          checked={opt[name] === k}
          onChange={() => setOpt((o) => ({ ...o, [name]: k }))}
        />
        <span className="rd" />
        <span>
          <b>{v.n}</b>
          <small>{v.t}</small>
        </span>
      </label>
    ));

  const side = (
    <aside className="co-side">
      <div className="side-h">
        <span>Order summary</span>
        <button className="link" type="button" onClick={onEditBag}>Edit bag</button>
      </div>
      {cart.map((l) => (
        <div className="s-it" key={l.key}>
          <div className="th">
            <span dangerouslySetInnerHTML={{ __html: garment(l.type, l.color) }} />
            <span className="q">{l.qty}</span>
          </div>
          <div>
            <b>{l.name}</b>
            <small>{l.color.name} · {l.size}{l.ins ? " · " + l.ins : ""}</small>
            {l.note ? <small className="nt">“{l.note}”</small> : null}
          </div>
          <span>{money(l.price * l.qty)}</span>
        </div>
      ))}
      <div style={{ paddingTop: 12 }}>
        <div className="tot"><span>Subtotal</span><span>{money(totals.sub)}</span></div>
        {totals.disc > 0 && <div className="tot"><span>Promo (−10%)</span><span>−{money(totals.disc)}</span></div>}
        <div className="tot"><span>Shipping</span><span>{shipCost ? money(shipCost) : "Free"}</span></div>
        {fee > 0 && <div className="tot"><span>Cash on delivery</span><span>{money(fee)}</span></div>}
        <div className="tot big"><span>Total</span><span>{money(total)}</span></div>
      </div>
    </aside>
  );

  let main;
  if (done) {
    main = (
      <div className="co-done">
        <div className="tick"><svg viewBox="0 0 24 24"><path d="M5 12.5l4.5 4.5L19 7.5" /></svg></div>
        <span className="eyebrow">Order confirmed</span>
        <h2 className="co-h" style={{ margin: "14px 0" }}>Thank you, {done.customer.fn}.</h2>
        <p className="co-p" style={{ marginInline: "auto" }}>
          Order <b>{done.no}</b> is in. Details are on their way to <b>{done.customer.email}</b>
          {done.hemming ? ", and your hemming notes have gone to the bench" : ""}.
        </p>
        <div className="rv-card" style={{ textAlign: "left", maxWidth: 560, margin: "28px auto" }}>
          {done.items.map((i, idx) => (
            <div key={idx}>
              <div style={{ display: "flex", justifyContent: "space-between", gap: 16 }}>
                <span>{i.qty} × {i.name} <span style={{ color: "var(--ink-2)" }}>— {i.colour}, {i.size}{i.inseam ? ", " + i.inseam : ""}</span></span>
                <b>{money(i.price * i.qty)}</b>
              </div>
              {i.note ? <div className="lnote">“{i.note}”</div> : null}
            </div>
          ))}
          <div style={{ borderTop: "1px solid var(--line)", marginTop: 12, paddingTop: 12, display: "flex", justifyContent: "space-between" }}>
            <span>{done.delivery} · {done.payment}</span>
            <b>Total {money(done.totals.total)}</b>
          </div>
        </div>
        <div className="co-nav" style={{ justifyContent: "center" }}>
          <button className="btn ghost" type="button" onClick={onEditBag}>Back to bag</button>
          <button className="btn solid" type="button" onClick={onClose}>Continue shopping <span className="arrow">→</span></button>
        </div>
      </div>
    );
  } else if (step === 1) {
    main = (
      <>
        <h2 className="co-h">Who’s it for?</h2>
        <p className="co-p">Tell us where to send your order. We’ll only use these details for your delivery and updates.</p>
        <div className="fgrid">
          {fld("fn", "First name", { req: 1, ac: "given-name" })}
          {fld("ln", "Last name", { req: 1, ac: "family-name" })}
          {fld("email", "Email", { req: 1, type: "email", ac: "email", ph: "you@example.com" })}
          {fld("phone", "Phone number", { req: 1, type: "tel", ac: "tel", ph: "+1 555 000 0000" })}
          {fld("wa", "WhatsApp number (optional)", { type: "tel", full: 1, ph: "If different from phone" })}
        </div>
        <h3 className="co-sub">Delivery address</h3>
        <div className="fgrid">
          <div className="fld full">
            <label htmlFor="f_country">Country <i>*</i></label>
            <select id="f_country" value={cust.country} onChange={(e) => setField("country", e.target.value)}>
              {COUNTRIES.map((c) => <option key={c}>{c}</option>)}
            </select>
          </div>
          {fld("a1", "Street address", { req: 1, full: 1, ac: "address-line1", max: 120 })}
          {fld("a2", "Apartment, suite, floor (optional)", { full: 1, ac: "address-line2", max: 120 })}
          {fld("city", "City / Town", { req: 1, ac: "address-level2" })}
          {fld("region", "State / Region / District", { ac: "address-level1" })}
          {fld("zip", "Postal code", { req: 1, ac: "postal-code", max: 16 })}
          {fld("landmark", "Landmark or delivery instructions (optional)", { full: 1, max: 160, ph: "Near the post office, ring twice, leave with the doorman…" })}
          <div className="fld full">
            <label>Best way to reach you</label>
            <div className="chips">
              {["Email", "Phone call", "WhatsApp", "SMS"].map((c) => (
                <button type="button" key={c} className={`chip${cust.contact === c ? " on" : ""}`} onClick={() => setField("contact", c)}>{c}</button>
              ))}
            </div>
          </div>
        </div>
        <div className="co-nav">
          <button className="btn ghost" type="button" onClick={onEditBag}>← Back to bag</button>
          <button className="btn solid" type="button" onClick={next}>Continue to delivery <span className="arrow">→</span></button>
        </div>
      </>
    );
  } else if (step === 2) {
    main = (
      <>
        <h2 className="co-h">Delivery &amp; your notes</h2>
        <p className="co-p">Choose how it reaches you, and tell us anything that makes the order right.</p>
        <h3 className="co-sub" style={{ marginTop: 0, border: 0, padding: 0 }}>Delivery method</h3>
        <div className="opts">{radios("ship", SHIP)}</div>
        <h3 className="co-sub">Payment</h3>
        <div className="opts">{radios("pay", PAY)}</div>
        <p style={{ fontSize: 12, color: "var(--ink-2)", marginTop: 10 }}>No card details are collected on this page.</p>
        <h3 className="co-sub">Hemming &amp; customisation</h3>
        <div className="fld full">
          <label htmlFor="o_hem">Hemming, alterations or custom requests</label>
          <textarea
            id="o_hem"
            rows={3}
            maxLength={400}
            placeholder="e.g. Hem the No. 1 to a 31 in inseam in ecru thread, monogram R.K. on the back pocket…"
            value={opt.hem}
            onChange={(e) => setOpt((o) => ({ ...o, hem: e.target.value }))}
          />
          <small className="cnt-s">{opt.hem.length}/400</small>
        </div>
        <h3 className="co-sub">Anything else?</h3>
        <div className="fld full">
          <label htmlFor="o_notes">Order comments</label>
          <textarea
            id="o_notes"
            rows={3}
            maxLength={500}
            placeholder="Delivery timing, packaging preferences, gate codes, a question for the team…"
            value={opt.notes}
            onChange={(e) => setOpt((o) => ({ ...o, notes: e.target.value }))}
          />
          <small className="cnt-s">{opt.notes.length}/500</small>
        </div>
        <label className="chk">
          <input type="checkbox" checked={opt.gift} onChange={(e) => setOpt((o) => ({ ...o, gift: e.target.checked }))} /> This order is a gift
        </label>
        {opt.gift && (
          <div className="fld full">
            <label htmlFor="o_gm">Gift message</label>
            <textarea
              id="o_gm"
              rows={2}
              maxLength={200}
              placeholder="Printed on a card — no prices shown."
              value={opt.giftMsg}
              onChange={(e) => setOpt((o) => ({ ...o, giftMsg: e.target.value }))}
            />
          </div>
        )}
        <div className="co-nav">
          <button className="btn ghost" type="button" onClick={() => { setStep(1); scrollTop(); }}>← Back</button>
          <button className="btn solid" type="button" onClick={next}>Review order <span className="arrow">→</span></button>
        </div>
      </>
    );
  } else {
    const addr = [cust.a1, cust.a2, [cust.city, cust.region].filter(Boolean).join(", ") + " " + (cust.zip || ""), cust.country, cust.landmark ? "Note: " + cust.landmark : ""]
      .filter((x) => x && String(x).trim())
      .map((x, i) => <React.Fragment key={i}>{x}<br /></React.Fragment>);
    main = (
      <>
        <h2 className="co-h">Review &amp; place order</h2>
        <p className="co-p">One last look. You can edit anything before you confirm.</p>
        <div className="rv-grid">
          <div className="rv-card">
            <div className="rv-h"><span>Contact</span><button className="link" type="button" onClick={() => { setStep(1); scrollTop(); }}>Edit</button></div>
            <b>{cust.fn} {cust.ln}</b><br />{cust.email}<br />{cust.phone}
            {cust.wa ? <><br />WhatsApp: {cust.wa}</> : null}
            <br /><span style={{ color: "var(--ink-2)" }}>Prefers: {cust.contact}</span>
          </div>
          <div className="rv-card">
            <div className="rv-h"><span>Ship to</span><button className="link" type="button" onClick={() => { setStep(1); scrollTop(); }}>Edit</button></div>
            {addr}
          </div>
          <div className="rv-card">
            <div className="rv-h"><span>Delivery &amp; payment</span><button className="link" type="button" onClick={() => { setStep(2); scrollTop(); }}>Edit</button></div>
            <b>{SHIP[opt.ship].n}</b> — {shipCost ? money(shipCost) : "Free"}<br />
            {PAY[opt.pay].n}{fee ? " — " + money(fee) : ""}
          </div>
          <div className="rv-card">
            <div className="rv-h"><span>Hemming &amp; notes</span><button className="link" type="button" onClick={() => { setStep(2); scrollTop(); }}>Edit</button></div>
            <b>Custom:</b> {opt.hem ? esc(opt.hem) : <span style={{ color: "var(--ink-2)" }}>None</span>}<br />
            <b>Comments:</b> {opt.notes ? esc(opt.notes) : <span style={{ color: "var(--ink-2)" }}>None</span>}
            {opt.gift ? <><br /><b>Gift message:</b> {opt.giftMsg ? esc(opt.giftMsg) : "(no message)"}</> : null}
          </div>
        </div>
        <label className={`chk terms${errs.terms ? " bad" : ""}`}>
          <input
            type="checkbox"
            checked={opt.terms}
            onChange={(e) => {
              setOpt((o) => ({ ...o, terms: e.target.checked }));
              if (e.target.checked) setErrs((p) => { const n = { ...p }; delete n.terms; return n; });
            }}
          /> I agree to the terms of sale and the 30-day returns policy.
        </label>
        {apiError && <p style={{ color: "var(--rust)", fontSize: 13, marginTop: 8 }}>{apiError}</p>}
        <div className="co-nav">
          <button className="btn ghost" type="button" onClick={() => { setStep(2); scrollTop(); }}>← Back</button>
          <button className="btn solid" type="button" onClick={placeOrder} disabled={placing}>
            {placing ? "Placing order…" : `Place order — ${money(total)}`}
          </button>
        </div>
      </>
    );
  }

  return (
    <div className={`co${open ? " on" : ""}`} role="dialog" aria-modal="true" aria-label="Checkout" ref={scrollRef}>
      <div className="co-head">
        <div className="wrap co-head-in">
          <button className="link" style={{ justifySelf: "start" }} type="button" onClick={onEditBag}>← Back to bag</button>
          <span className="logo">ROOKFORD</span>
          <span className="eyebrow">Secure checkout</span>
        </div>
      </div>
      <div className="wrap co-grid">
        <div className="co-main">
          <ol className="steps">
            {["Your details", "Delivery & notes", "Review"].map((t, i) => (
              <li key={t} className={i + 1 === step ? "on" : i + 1 < step ? "done" : ""}>
                <span>{i + 1 < step ? "✓" : i + 1}</span>{t}
              </li>
            ))}
          </ol>
          {main}
        </div>
        {done ? null : side}
      </div>
    </div>
  );
}

/* ====================================================================
   ADMIN
   ==================================================================== */
function AdminLogin({ onLogin, onExit }) {
  const [email, setEmail] = useState("admin@rookford.com");
  const [pw, setPw] = useState("");
  const [err, setErr] = useState("");
  const [busy, setBusy] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    setBusy(true);
    setErr("");
    try {
      const res = await fetch(API.adminLogin, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password: pw }),
      });
      if (!res.ok) throw new Error("Invalid credentials");
      const data = await res.json();
      onLogin(data.token || data.accessToken || "demo-token");
    } catch {
      if (email === "admin@rookford.com" && pw === "admin") onLogin("demo-token");
      else setErr("Invalid email or password");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="admin-login">
      <form className="admin-login-card" onSubmit={submit}>
        <div className="admin-brand">ROOKFORD</div>
        <p className="admin-kicker">Admin Console</p>
        <h1>Sign in</h1>
        <p className="admin-sub">Manage products, orders and the shop.</p>
        {err && <div className="admin-err">{err}</div>}
        <div className="fld">
          <label>Email</label>
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
        </div>
        <div className="fld">
          <label>Password</label>
          <input type="password" value={pw} onChange={(e) => setPw(e.target.value)} required />
        </div>
        <button className="btn solid" type="submit" disabled={busy} style={{ width: "100%", justifyContent: "center", marginTop: 8 }}>
          {busy ? "Signing in…" : "Sign in →"}
        </button>
        <div style={{ textAlign: "center", marginTop: 18 }}>
          <button type="button" className="link" onClick={onExit}>← Back to store</button>
        </div>
        <div className="admin-hint">Demo: admin@rookford.com / admin</div>
      </form>
    </div>
  );
}

function AdminProductForm({ product, onSave, onCancel }) {
  const [data, setData] = useState(
    product || {
      name: "",
      cat: "Jeans",
      price: 0,
      type: "jeans",
      desc: "",
      fabric: "",
      fit: "",
      badge: "",
      sizes: ["S", "M", "L"],
      colors: [{ name: "Raw Indigo", b: "#222c3a", s: "#c79a62" }],
    }
  );
  const upd = (k, v) => setData((d) => ({ ...d, [k]: v }));

  return (
    <div>
      <div className="admin-head">
        <h1 className="admin-h1">{product ? "Edit product" : "New product"}</h1>
        <div className="admin-actions">
          <button className="btn ghost" onClick={onCancel}>Cancel</button>
          <button className="btn solid" onClick={() => onSave(data)}>Save</button>
        </div>
      </div>
      <div className="admin-form">
        <div className="fgrid">
          <div className="fld"><label>Name</label><input value={data.name} onChange={(e) => upd("name", e.target.value)} /></div>
          <div className="fld">
            <label>Category</label>
            <select value={data.cat} onChange={(e) => upd("cat", e.target.value)}>
              <option>Jeans</option><option>Jackets</option><option>Shirts</option><option>Headwear</option>
            </select>
          </div>
          <div className="fld"><label>Price ($)</label><input type="number" value={data.price} onChange={(e) => upd("price", +e.target.value)} /></div>
          <div className="fld">
            <label>Type</label>
            <select value={data.type} onChange={(e) => upd("type", e.target.value)}>
              <option value="jeans">Jeans</option><option value="jacket">Jacket</option>
              <option value="shirt">Shirt</option><option value="hat">Hat</option>
            </select>
          </div>
          <div className="fld"><label>Badge (optional)</label><input value={data.badge} onChange={(e) => upd("badge", e.target.value)} placeholder="New / Bestseller" /></div>
          <div className="fld"><label>Sizes (comma separated)</label><input value={data.sizes.join(",")} onChange={(e) => upd("sizes", e.target.value.split(",").map((s) => s.trim()).filter(Boolean))} /></div>
        </div>
        <div className="fld"><label>Description</label><textarea rows={3} value={data.desc} onChange={(e) => upd("desc", e.target.value)} /></div>
        <div className="fgrid">
          <div className="fld"><label>Fabric</label><input value={data.fabric} onChange={(e) => upd("fabric", e.target.value)} /></div>
          <div className="fld"><label>Fit</label><input value={data.fit} onChange={(e) => upd("fit", e.target.value)} /></div>
        </div>
        <div>
          <label style={{ fontSize: 11, letterSpacing: ".16em", textTransform: "uppercase", fontWeight: 500, color: "var(--ink-2)" }}>Colors</label>
          {data.colors.map((c, i) => (
            <div key={i} className="fgrid" style={{ marginTop: 10, gridTemplateColumns: "1fr auto auto auto" }}>
              <input value={c.name} onChange={(e) => { const n = [...data.colors]; n[i] = { ...n[i], name: e.target.value }; upd("colors", n); }} placeholder="Name" />
              <input type="color" value={c.b} onChange={(e) => { const n = [...data.colors]; n[i] = { ...n[i], b: e.target.value }; upd("colors", n); }} style={{ width: 50, padding: 4 }} />
              <input type="color" value={c.s} onChange={(e) => { const n = [...data.colors]; n[i] = { ...n[i], s: e.target.value }; upd("colors", n); }} style={{ width: 50, padding: 4 }} />
              <button type="button" onClick={() => upd("colors", data.colors.filter((_, j) => j !== i))}>×</button>
            </div>
          ))}
          <button type="button" className="link" style={{ marginTop: 10 }} onClick={() => upd("colors", [...data.colors, { name: "New", b: "#333", s: "#ddd" }])}>+ Add color</button>
        </div>
      </div>
    </div>
  );
}

function AdminProducts({ token }) {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(null);

  const load = async () => {
    setLoading(true);
    const list = await getJSON(API.products, []);
    setProducts(list.map(normalizeProduct));
    setLoading(false);
  };
  useEffect(() => { load(); }, []);

  if (editing !== null) {
    return (
      <AdminProductForm
        product={editing === "new" ? null : products.find((p) => p.id === editing)}
        onSave={async (data) => {
          const isNew = editing === "new";
          const url = isNew ? API.products : `${API.products}/${editing}`;
          try {
            await fetch(url, {
              method: isNew ? "POST" : "PUT",
              headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
              body: JSON.stringify(data),
            });
          } catch (e) {
            console.warn("Demo mode: product saved locally only", e);
          }
          setEditing(null);
          load();
        }}
        onCancel={() => setEditing(null)}
      />
    );
  }

  return (
    <>
      <div className="admin-head">
        <h1 className="admin-h1">Products</h1>
        <button className="btn solid" onClick={() => setEditing("new")}>+ Add product</button>
      </div>
      {loading ? (
        <div className="admin-empty">Loading…</div>
      ) : !products.length ? (
        <div className="admin-empty">No products yet. Add your first one.</div>
      ) : (
        <table className="admin-table">
          <thead>
            <tr><th>Name</th><th>Category</th><th>Price</th><th>Sizes</th><th>Colors</th><th></th></tr>
          </thead>
          <tbody>
            {products.map((p) => (
              <tr key={p.id}>
                <td><b>{p.name}</b></td>
                <td>{p.cat}</td>
                <td>{money(p.price)}</td>
                <td>{p.sizes.join(", ")}</td>
                <td>{p.colors.length}</td>
                <td style={{ textAlign: "right" }}>
                  <button className="link" onClick={() => setEditing(p.id)}>Edit</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </>
  );
}

function AdminOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sel, setSel] = useState(null);

  useEffect(() => {
    (async () => {
      const list = await getJSON(API.orders, []);
      setOrders(list);
      setLoading(false);
    })();
  }, []);

  if (sel) {
    const o = orders.find((x) => (x.no || x.id) === sel);
    if (!o) return null;
    return (
      <div>
        <div className="admin-head">
          <h1 className="admin-h1">Order {o.no || o.id}</h1>
          <button className="btn ghost" onClick={() => setSel(null)}>← Back</button>
        </div>
        <div className="admin-form">
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
            <div>
              <b>Customer</b><br />
              {o.customer?.fn} {o.customer?.ln}<br />
              {o.customer?.email}<br />
              {o.customer?.phone}
            </div>
            <div>
              <b>Ship to</b><br />
              {o.customer?.a1}<br />
              {o.customer?.city}, {o.customer?.zip}<br />
              {o.customer?.country}
            </div>
          </div>
          <div>
            <b>Items</b>
            {(o.items || []).map((i, idx) => (
              <div key={idx} style={{ display: "flex", justifyContent: "space-between", padding: "8px 0", borderBottom: "1px solid var(--line)" }}>
                <span>{i.qty} × {i.name} <small>{i.colour} / {i.size}</small></span>
                <b>{money(i.price * i.qty)}</b>
              </div>
            ))}
          </div>
          <div><b>Total</b> {money(o.totals?.total || 0)} · {o.delivery} · {o.payment}</div>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="admin-head"><h1 className="admin-h1">Orders</h1></div>
      {loading ? (
        <div className="admin-empty">Loading…</div>
      ) : !orders.length ? (
        <div className="admin-empty">No orders yet. Orders placed on the storefront appear here.</div>
      ) : (
        <table className="admin-table">
          <thead>
            <tr><th>Order</th><th>Date</th><th>Customer</th><th>Total</th><th>Status</th><th></th></tr>
          </thead>
          <tbody>
            {orders.map((o) => (
              <tr key={o.no || o.id}>
                <td><b>{o.no || o.id}</b></td>
                <td>{o.date ? new Date(o.date).toLocaleDateString() : "—"}</td>
                <td>{o.customer?.fn} {o.customer?.ln}</td>
                <td>{money(o.totals?.total || 0)}</td>
                <td><span className="admin-badge">{o.status || "pending"}</span></td>
                <td style={{ textAlign: "right" }}>
                  <button className="link" onClick={() => setSel(o.no || o.id)}>View</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </>
  );
}

function AdminApp({ onExit }) {
  const [token, setToken] = useState(() => store.get("rf_admin_token", ""));
  const [view, setView] = useState("products");

  if (!token) {
    return (
      <AdminLogin
        onLogin={(t) => { setToken(t); store.set("rf_admin_token", t); }}
        onExit={onExit}
      />
    );
  }

  return (
    <div className="admin-shell">
      <aside className="admin-side">
        <div className="admin-brand-side">ROOKFORD</div>
        <div className="admin-tag">Admin</div>
        <nav className="admin-nav">
          <button className={view === "products" ? "on" : ""} onClick={() => setView("products")}>Products</button>
          <button className={view === "orders" ? "on" : ""} onClick={() => setView("orders")}>Orders</button>
        </nav>
        <div style={{ marginTop: "auto", display: "flex", flexDirection: "column", gap: 10 }}>
          <button className="admin-exit" onClick={onExit}>← Back to store</button>
          <button className="admin-exit" onClick={() => { setToken(""); store.set("rf_admin_token", ""); }}>
            Sign out
          </button>
        </div>
      </aside>
      <main className="admin-main">
        {view === "products" && <AdminProducts token={token} />}
        {view === "orders" && <AdminOrders />}
      </main>
    </div>
  );
}

/* ====================================================================
   CSS
   ==================================================================== */
const CSS = `
:root{--paper:#e6e5e1;--paper-2:#d8d7d2;--cream:#efeeea;--ink:#14171b;--ink-2:#4a4f56;--indigo:#1f252c;--indigo-2:#2f3842;--saddle:#a8794d;--saddle-d:#7a5230;--rust:#9b3a26;--line:#c2c1bb;--serif:'Fraunces',Georgia,'Times New Roman',serif;--sans:'Inter Tight','Helvetica Neue',Arial,sans-serif;--display:'Barlow Condensed','Oswald','Arial Narrow',sans-serif;--ease:cubic-bezier(.22,.8,.24,1)}
*{box-sizing:border-box;margin:0;padding:0}
html{scroll-behavior:smooth;-webkit-text-size-adjust:100%}
body{background:var(--paper);color:var(--ink);font-family:var(--sans);font-size:16px;line-height:1.55;-webkit-font-smoothing:antialiased;overflow-x:hidden}
img,svg{display:block;max-width:100%}
button{font:inherit;color:inherit;background:none;border:0;cursor:pointer}
a{color:inherit;text-decoration:none}
::selection{background:var(--indigo);color:var(--paper)}
:focus-visible{outline:2px solid var(--saddle);outline-offset:3px}
.wrap{width:min(1320px,100% - 32px);margin-inline:auto}
.eyebrow{font-size:11px;letter-spacing:.22em;text-transform:uppercase;font-weight:500;color:var(--saddle-d)}
.h-xl{font-family:var(--display);font-weight:700;text-transform:uppercase;font-size:clamp(40px,11vw,176px);line-height:.84;letter-spacing:-.005em}
.h-lg{font-family:var(--display);text-transform:uppercase;font-weight:600;font-size:clamp(32px,8vw,96px);line-height:.88}
.h-md{font-family:var(--serif);font-weight:400;font-size:clamp(22px,5vw,34px);line-height:1.1}
em{font-style:italic;font-weight:300}
.h-xl em,.h-lg em{font-family:var(--serif);font-weight:300;text-transform:none;letter-spacing:-.03em;font-size:.84em}
.btn{display:inline-flex;align-items:center;gap:12px;padding:16px 28px;font-size:12px;letter-spacing:.16em;text-transform:uppercase;font-weight:600;border:1.5px solid var(--ink);transition:all .35s var(--ease);position:relative;overflow:hidden}
.btn.solid{background:var(--ink);color:var(--paper)}
.btn.solid:hover{background:var(--saddle-d);border-color:var(--saddle-d)}
.btn.solid[disabled]{opacity:.6;cursor:not-allowed}
.btn.ghost:hover{background:var(--ink);color:var(--paper)}
.btn.light{border-color:var(--paper);color:var(--paper)}
.btn.light:hover{background:var(--paper);color:var(--ink)}
.arrow{display:inline-block;transition:transform .35s var(--ease)}
.btn:hover .arrow,.link:hover .arrow{transform:translateX(5px)}
.link{font-size:12px;letter-spacing:.16em;text-transform:uppercase;font-weight:500;border-bottom:1px solid currentColor;padding-bottom:4px;display:inline-flex;gap:10px}

.rv{opacity:0;transform:translateY(28px);transition:opacity .9s var(--ease),transform .9s var(--ease)}
.rv.in{opacity:1;transform:none}
.d1{transition-delay:.08s}.d2{transition-delay:.16s}.d3{transition-delay:.24s}
@media (prefers-reduced-motion:reduce){.rv{opacity:1;transform:none;transition:none}*{animation:none!important;scroll-behavior:auto!important}}

.ann{background:var(--indigo);color:var(--paper);font-size:11px;letter-spacing:.2em;text-transform:uppercase;text-align:center;padding:10px 16px;position:relative;z-index:61;height:36px;overflow:hidden}
.ann span{opacity:0;position:absolute;left:0;right:0;transition:opacity .6s}
.ann span.on{opacity:1}

header.nav{position:sticky;top:0;z-index:60;background:rgba(230,229,225,.9);backdrop-filter:blur(14px);-webkit-backdrop-filter:blur(14px);border-bottom:1px solid transparent;transition:border-color .3s}
header.nav.scrolled{border-color:var(--line)}
.nav-in{display:grid;grid-template-columns:1fr auto 1fr;align-items:center;height:72px}
.nav-links{display:flex;gap:32px}
.nav-links a{font-size:12px;letter-spacing:.16em;text-transform:uppercase;font-weight:500;position:relative;padding:6px 0}
.nav-links a::after{content:"";position:absolute;left:0;right:100%;bottom:0;height:1px;background:var(--ink);transition:right .35s var(--ease)}
.nav-links a:hover::after{right:0}
.logo{font-family:var(--display);font-weight:700;font-size:30px;letter-spacing:.34em;text-indent:.34em;text-align:center;line-height:1;text-transform:uppercase}
.nav-tools{display:flex;justify-content:flex-end;gap:6px;align-items:center}
.ico{position:relative;width:42px;height:42px;display:grid;place-items:center;transition:color .2s}
.ico:hover{color:var(--saddle-d)}
.ico svg{width:20px;height:20px;fill:none;stroke:currentColor;stroke-width:1.5;stroke-linecap:round;stroke-linejoin:round}
.cnt{position:absolute;top:3px;right:1px;min-width:17px;height:17px;border-radius:9px;background:var(--saddle-d);color:#fff;font-size:10px;font-weight:600;display:grid;place-items:center;padding:0 4px;transition:transform .3s var(--ease)}
.cnt.bump{transform:scale(1.5)}
.cnt:empty,.cnt[data-n="0"]{display:none}
.burger{display:none}
@media(max-width:900px){.nav-links{display:none}.burger{display:grid}.nav-in{grid-template-columns:auto 1fr auto}.logo{font-size:22px;letter-spacing:.28em;text-indent:.28em}}
.mnav{position:fixed;inset:0;background:var(--indigo);color:var(--paper);z-index:90;display:flex;flex-direction:column;justify-content:center;padding:40px;gap:8px;transform:translateY(-100%);transition:transform .6s var(--ease)}
.mnav.open{transform:none}
.mnav a{font-family:var(--display);font-weight:700;text-transform:uppercase;font-size:clamp(38px,11vw,64px);line-height:1.15}
.mnav .x{position:absolute;top:20px;right:20px;color:var(--paper)}

.hero{display:grid;grid-template-columns:minmax(0,1fr) minmax(0,1.05fr);min-height:calc(100vh - 108px);min-height:calc(100svh - 108px);border-bottom:1px solid var(--line);padding:0}
.hero-copy{display:flex;flex-direction:column;justify-content:space-between;padding:clamp(28px,4vw,64px) clamp(24px,4vw,64px) clamp(28px,3vw,48px) max(24px,calc((100vw - 1320px)/2));gap:40px}
.hero-top{display:flex;justify-content:space-between;align-items:center;gap:16px}
.hero-top .pill{border:1px solid var(--ink);padding:6px 14px;font-size:10px;letter-spacing:.2em;text-transform:uppercase}
.hero h1 em{color:var(--saddle-d)}
.hero-sub{max-width:440px;color:var(--ink-2);font-size:17px;margin-top:28px}
.hero-cta{display:flex;gap:14px;flex-wrap:wrap;margin-top:36px}
.hero-meta{display:flex;gap:40px;border-top:1px solid var(--line);padding-top:20px;flex-wrap:wrap}
.hero-meta div b{display:block;font-family:var(--display);font-weight:600;font-size:36px;line-height:1}
.hero-meta div span{font-size:11px;letter-spacing:.14em;text-transform:uppercase;color:var(--ink-2)}
.hero-art{position:relative;overflow:hidden;background:var(--indigo)}
.hero-art svg.scene{position:absolute;inset:-4%;width:108%;height:108%;max-width:none}
.hero-art .layer{transition:transform .6s var(--ease);will-change:transform}
.twill{position:absolute;inset:0;pointer-events:none;mix-blend-mode:soft-light;opacity:.7;background:repeating-linear-gradient(115deg,rgba(255,255,255,.07) 0 2px,rgba(0,0,0,.09) 2px 4px)}

/* ── Cowboy brand stamp badge ── */
.hero-badge{position:absolute;right:28px;bottom:28px;width:152px;height:152px;color:var(--paper);z-index:3}
.hero-badge svg{width:100%;height:100%;display:block}
.hero-cap{position:absolute;left:28px;bottom:28px;color:var(--paper);font-size:11px;letter-spacing:.2em;text-transform:uppercase;max-width:240px;line-height:1.7;z-index:3}
@media(max-width:900px){
  .hero{grid-template-columns:1fr;min-height:0}
  .hero-art{min-height:62vh;order:-1}
  .hero-copy{padding:32px 24px}
  .hero-badge{width:90px;height:90px;right:16px;bottom:16px}
  .hero-cap{left:16px;bottom:16px;max-width:160px;font-size:9.5px;line-height:1.5}
}

.ticker{background:var(--ink);color:var(--paper);overflow:hidden;white-space:nowrap;padding:16px 0}
.ticker-track{display:inline-flex;animation:tick 42s linear infinite}
.ticker:hover .ticker-track{animation-play-state:paused}
.ticker span{font-family:var(--serif);font-style:italic;font-weight:300;font-size:22px;padding:0 28px;display:inline-flex;align-items:center;gap:56px}
.ticker i{font-style:normal;color:var(--saddle);font-size:16px}
@keyframes tick{to{transform:translateX(-50%)}}

section{padding:clamp(72px,9vw,140px) 0}
.sec-head{display:flex;justify-content:space-between;align-items:flex-end;gap:32px;margin-bottom:clamp(32px,4vw,56px);flex-wrap:wrap}
.sec-head .eyebrow{display:block;margin-bottom:14px}

.cols{display:grid;grid-template-columns:repeat(12,1fr);gap:20px}
.col-card{position:relative;overflow:hidden;min-height:520px;display:flex;flex-direction:column;justify-content:flex-end;padding:28px;color:var(--paper);isolation:isolate}
.col-card::before{content:"";position:absolute;inset:0;z-index:-2;transition:transform 1.2s var(--ease)}
.col-card::after{content:"";position:absolute;inset:0;z-index:-1;background:repeating-linear-gradient(115deg,rgba(255,255,255,.05) 0 2px,rgba(0,0,0,.08) 2px 4px),linear-gradient(to top,rgba(10,14,22,.65),transparent 60%)}
.col-card:hover::before{transform:scale(1.06)}
.c1{grid-column:span 7}.c1::before{background:linear-gradient(160deg,#4b5561,#1c2127)}
.c2{grid-column:span 5}.c2::before{background:linear-gradient(160deg,#a8a296,#625b50)}
.c3{grid-column:span 5}.c3::before{background:linear-gradient(160deg,#9ca3aa,#555d66)}
.c4{grid-column:span 7}.c4::before{background:linear-gradient(160deg,#4a4c50,#16171a)}
.col-card .num{position:absolute;top:22px;left:28px;font-family:var(--serif);font-size:13px;letter-spacing:.2em;opacity:.8}
.col-card h3{font-family:var(--display);text-transform:uppercase;font-weight:700;letter-spacing:.01em;font-size:clamp(42px,4.8vw,72px);line-height:.9}
.col-card p{font-size:14px;opacity:.85;margin:10px 0 18px;max-width:340px}
.col-card .link{align-self:flex-start}
.col-card .ghostshape{position:absolute;right:-30px;top:30px;width:56%;opacity:.16;z-index:-1;transition:transform 1s var(--ease)}
.col-card:hover .ghostshape{transform:translateY(-10px) rotate(-3deg)}
@media(max-width:800px){.c1,.c2,.c3,.c4{grid-column:span 12;min-height:380px}}

.shop{background:var(--cream);border-block:1px solid var(--line)}
.toolbar{display:flex;justify-content:space-between;gap:20px;align-items:center;flex-wrap:wrap;border-block:1px solid var(--line);padding:14px 0;margin-bottom:36px}
.tabs{display:flex;gap:6px;flex-wrap:wrap}
.tab{padding:10px 18px;font-size:12px;letter-spacing:.14em;text-transform:uppercase;font-weight:500;border:1px solid transparent;transition:all .25s}
.tab:hover{border-color:var(--line)}
.tab.on{background:var(--ink);color:var(--paper)}
.tools-r{display:flex;gap:18px;align-items:center;font-size:12px;letter-spacing:.1em;text-transform:uppercase}
select.sort{background:transparent;border:0;border-bottom:1px solid var(--ink);padding:6px 20px 6px 0;font:inherit;letter-spacing:.1em;text-transform:uppercase;cursor:pointer;appearance:none}
.grid{display:grid;grid-template-columns:repeat(4,1fr);gap:40px 22px}
@media(max-width:1100px){.grid{grid-template-columns:repeat(3,1fr)}}
@media(max-width:760px){.grid{grid-template-columns:repeat(2,1fr);gap:28px 12px}}
.card{animation:cardin .6s var(--ease) both}
@keyframes cardin{from{opacity:0;transform:translateY(18px)}to{opacity:1;transform:none}}
.media{position:relative;aspect-ratio:4/5;overflow:hidden;background:var(--paper-2);cursor:pointer;transform:perspective(1000px) rotateX(var(--rx,0deg)) rotateY(var(--ry,0deg));transition:transform .3s var(--ease),box-shadow .4s}
.card:hover .media{box-shadow:0 34px 40px -26px rgba(20,24,31,.5)}
.media::before{content:"";position:absolute;left:0;right:0;bottom:0;height:24%;background:linear-gradient(to bottom,rgba(40,38,34,0),rgba(40,38,34,.16));pointer-events:none}
.media .g{position:absolute;inset:7% 10%;display:grid;place-items:center;transition:transform .9s var(--ease);translate:var(--tx,0px) var(--ty,0px)}
.media .g svg{width:100%;height:100%;filter:drop-shadow(0 6px 8px rgba(20,24,31,.12))}
.card:hover .media .g{transform:scale(1.06) translateY(-6px)}
.badge{position:absolute;top:12px;left:12px;background:var(--paper);padding:4px 10px;font-size:10px;letter-spacing:.18em;text-transform:uppercase;font-weight:600;z-index:2}
.badge.low{background:var(--rust);color:#fff}
.wish{position:absolute;top:6px;right:6px;width:40px;height:40px;display:grid;place-items:center;z-index:2;transition:transform .3s var(--ease)}
.wish svg{width:19px;height:19px;fill:transparent;stroke:var(--ink);stroke-width:1.5;transition:all .25s}
.wish:hover{transform:scale(1.15)}
.wish.on svg{fill:var(--rust);stroke:var(--rust)}
.quick{position:absolute;left:10px;right:10px;bottom:10px;background:rgba(239,238,234,.96);padding:12px;transform:translateY(calc(100% + 14px));transition:transform .5s var(--ease);z-index:3}
.card:hover .quick,.card:focus-within .quick{transform:none}
@media(hover:none){.quick{transform:none;position:static;background:transparent;padding:10px 0 0}.media{overflow:visible}}
.quick small{display:block;font-size:10px;letter-spacing:.18em;text-transform:uppercase;color:var(--ink-2);margin-bottom:8px}
.chips{display:flex;gap:5px;flex-wrap:wrap}
.chip{min-width:36px;height:34px;padding:0 8px;border:1px solid var(--line);font-size:12px;font-weight:500;transition:all .2s;background:var(--cream)}
.chip:hover,.chip.on{background:var(--ink);color:var(--paper);border-color:var(--ink)}
.info{padding-top:16px;display:grid;gap:4px}
.info .row{display:flex;justify-content:space-between;gap:12px;align-items:baseline}
.info h3{font-family:var(--serif);font-weight:400;font-size:19px;line-height:1.2}
.info .price{font-size:15px;font-weight:500;white-space:nowrap}
.info .cat{font-size:11px;letter-spacing:.16em;text-transform:uppercase;color:var(--ink-2)}
.sw{display:flex;gap:8px;margin-top:8px;align-items:center}
.sw button{width:16px;height:16px;border-radius:50%;border:1px solid rgba(20,23,27,.25);position:relative;transition:transform .2s}
.sw button:hover{transform:scale(1.25)}
.sw button.on::after{content:"";position:absolute;inset:-4px;border:1px solid var(--ink);border-radius:50%}
.empty{grid-column:1/-1;text-align:center;padding:80px 0;color:var(--ink-2)}
.empty h3{font-family:var(--display);text-transform:uppercase;font-size:30px;color:var(--ink);margin-bottom:8px}

.edit{display:grid;grid-template-columns:5fr 6fr;gap:clamp(32px,6vw,100px);align-items:center}
.edit-art{position:relative;aspect-ratio:4/5;background:linear-gradient(170deg,#dedcd5,#a9a396 60%,#6a6356);overflow:hidden}
.edit-art svg{position:absolute;inset:0;width:100%;height:100%}
.edit-art .tag{position:absolute;left:20px;bottom:20px;background:var(--paper);padding:10px 16px;font-size:10px;letter-spacing:.2em;text-transform:uppercase}
.edit-copy .h-lg{margin:18px 0 28px}
.edit-copy p{color:var(--ink-2);max-width:520px;margin-bottom:18px}
.edit-copy p.drop::first-letter{font-family:var(--serif);float:left;font-size:78px;line-height:.78;padding:8px 12px 0 0;color:var(--saddle-d);font-weight:300}
.pull{border-left:2px solid var(--saddle);padding:4px 0 4px 24px;margin:34px 0;font-family:var(--serif);font-style:italic;font-weight:300;font-size:clamp(22px,2.4vw,32px);line-height:1.25;max-width:520px}
@media(max-width:860px){.edit{grid-template-columns:1fr}}

.fade{background:var(--indigo);color:var(--paper);position:relative;overflow:hidden}
.fade::before{content:"";position:absolute;inset:0;background:repeating-linear-gradient(115deg,rgba(255,255,255,.025) 0 2px,rgba(0,0,0,.05) 2px 4px);pointer-events:none}
.fade .eyebrow{color:var(--saddle)}
.fade-grid{display:grid;grid-template-columns:1fr 1fr;gap:clamp(32px,6vw,100px);align-items:center;position:relative}
.fade-stage{display:grid;place-items:center;background:rgba(255,255,255,.04);border:1px solid rgba(255,255,255,.12);padding:40px;aspect-ratio:1/1.1}
.fade-stage svg{height:100%;max-height:480px;width:auto}
.fade-copy h2{margin:16px 0 20px}
.fade-copy p.lead{color:rgba(230,229,225,.75);max-width:460px;min-height:5.2em;transition:opacity .3s}
.stage-name{font-family:var(--serif);font-style:italic;font-weight:300;font-size:30px;margin-top:34px;color:var(--saddle)}
.range{margin-top:22px}
input[type=range]{-webkit-appearance:none;appearance:none;width:100%;height:28px;background:transparent;cursor:pointer}
input[type=range]::-webkit-slider-runnable-track{height:1px;background:rgba(230,229,225,.4)}
input[type=range]::-moz-range-track{height:1px;background:rgba(230,229,225,.4)}
input[type=range]::-webkit-slider-thumb{-webkit-appearance:none;width:22px;height:22px;border-radius:50%;background:var(--saddle);border:3px solid var(--indigo);box-shadow:0 0 0 1px var(--saddle);margin-top:-10px}
input[type=range]::-moz-range-thumb{width:16px;height:16px;border-radius:50%;background:var(--saddle);border:3px solid var(--indigo);box-shadow:0 0 0 1px var(--saddle)}
.range-lbl{display:flex;justify-content:space-between;font-size:10px;letter-spacing:.18em;text-transform:uppercase;color:rgba(230,229,225,.6);margin-top:6px}
.range-val{font-family:var(--display);font-weight:600;font-size:56px;line-height:1}
.range-val small{font-size:14px;letter-spacing:.18em;text-transform:uppercase;font-family:var(--sans);margin-left:8px;color:rgba(230,229,225,.6)}
@media(max-width:860px){.fade-grid{grid-template-columns:1fr}}

.look{overflow:hidden;padding-bottom:clamp(56px,7vw,100px)}
.rail{display:flex;gap:20px;overflow-x:auto;scroll-snap-type:x mandatory;padding:0 max(24px,calc((100vw - 1320px)/2)) 20px;scrollbar-width:none;cursor:grab}
.rail::-webkit-scrollbar{display:none}
.rail.drag{cursor:grabbing;scroll-snap-type:none}
.lk{flex:0 0 clamp(270px,30vw,400px);aspect-ratio:3/4.3;scroll-snap-align:start;position:relative;overflow:hidden;color:var(--paper);padding:24px;display:flex;flex-direction:column;justify-content:space-between;user-select:none}
.lk::before{content:"";position:absolute;inset:0;background:var(--bg);z-index:-2}
.lk::after{content:"";position:absolute;inset:0;z-index:-1;background:repeating-linear-gradient(115deg,rgba(255,255,255,.05) 0 2px,rgba(0,0,0,.07) 2px 4px)}
.lk .n{font-family:var(--serif);font-weight:300;font-size:110px;line-height:.8;letter-spacing:-.04em;opacity:.9}
.lk h4{font-family:var(--display);text-transform:uppercase;font-weight:700;font-size:36px;line-height:.92}
.lk p{font-size:13px;opacity:.8;margin-top:8px}
.lk svg{position:absolute;left:0;right:0;bottom:0;width:100%;z-index:-1;opacity:.9}
.rail-ctl{display:flex;gap:10px}
.rbtn{width:52px;height:52px;border:1px solid var(--ink);display:grid;place-items:center;transition:all .25s}
.rbtn:hover{background:var(--ink);color:var(--paper)}
.rbtn svg{width:18px;height:18px;stroke:currentColor;fill:none;stroke-width:1.5}

.craft{background:var(--paper-2);border-block:1px solid var(--line)}
.stats{display:grid;grid-template-columns:repeat(4,1fr);border-top:1px solid var(--ink)}
.stat{padding:32px 24px 8px 24px;border-right:1px solid var(--line)}
.stat:first-child{padding-left:0}.stat:last-child{border-right:0}
.stat b{font-family:var(--display);font-weight:600;font-size:clamp(44px,5.4vw,84px);line-height:1;letter-spacing:-.03em;display:block}
.stat b sup{font-size:.35em;vertical-align:top;margin-left:4px;letter-spacing:.1em}
.stat span{font-size:12px;letter-spacing:.14em;text-transform:uppercase;color:var(--ink-2);display:block;margin-top:10px}
.stat p{font-size:14px;color:var(--ink-2);margin-top:10px;max-width:240px}
.promises{display:grid;grid-template-columns:repeat(3,1fr);gap:40px;margin-top:72px}
.promise .ic{width:46px;height:46px;border:1px solid var(--ink);border-radius:50%;display:grid;place-items:center;margin-bottom:20px}
.promise .ic svg{width:20px;height:20px;stroke:var(--ink);fill:none;stroke-width:1.4;stroke-linecap:round;stroke-linejoin:round}
.promise h4{font-family:var(--serif);font-weight:400;font-size:22px;margin-bottom:8px}
.promise p{color:var(--ink-2);font-size:15px}

.jgrid{display:grid;grid-template-columns:1.4fr 1fr 1fr;gap:28px}
.post{display:flex;flex-direction:column;gap:16px;cursor:pointer}
.post .pic{aspect-ratio:4/3;position:relative;overflow:hidden}
.post:first-child .pic{aspect-ratio:4/4.2}
.post .pic div{position:absolute;inset:0;transition:transform 1s var(--ease)}
.post:hover .pic div{transform:scale(1.06)}
.post h3{font-family:var(--serif);font-weight:300;font-size:clamp(22px,2.2vw,32px);line-height:1.1;letter-spacing:-.01em}
.post p{font-size:14px;color:var(--ink-2)}
.post .meta{font-size:11px;letter-spacing:.16em;text-transform:uppercase;color:var(--saddle-d)}
@media(max-width:860px){.jgrid{grid-template-columns:1fr}}

.rev{text-align:center;background:var(--cream);border-block:1px solid var(--line)}
.stars{color:var(--saddle);letter-spacing:.3em;font-size:14px;margin-bottom:28px}
.rev blockquote{font-family:var(--serif);font-weight:300;font-size:clamp(26px,3.6vw,52px);line-height:1.15;letter-spacing:-.02em;max-width:980px;margin:0 auto;min-height:3.5em;transition:opacity .4s}
.rev cite{display:block;margin-top:28px;font-style:normal;font-size:12px;letter-spacing:.18em;text-transform:uppercase;color:var(--ink-2)}
.dots{display:flex;gap:10px;justify-content:center;margin-top:36px}
.dots button{width:34px;height:2px;background:var(--line);transition:background .3s}
.dots button.on{background:var(--ink)}

.news{background:var(--paper-2);color:var(--ink);border-block:1px solid var(--line);text-align:center}
.news h2{max-width:760px;margin:16px auto 20px}
.news p{max-width:460px;margin:0 auto 36px;opacity:.85}
.news .eyebrow{color:var(--saddle-d)}
.nform{display:flex;max-width:520px;margin:0 auto;border-bottom:1.5px solid var(--ink)}
.nform input{flex:1;background:transparent;border:0;color:var(--ink);font:inherit;font-size:16px;padding:16px 0;outline:0}
.nform input::placeholder{color:#7b8087}
.nform button{font-size:12px;letter-spacing:.18em;text-transform:uppercase;font-weight:500;padding:0 6px 0 20px}
.nmsg{margin-top:18px;font-size:13px;letter-spacing:.06em;min-height:22px}

footer{background:var(--ink);color:var(--paper);padding:88px 0 32px}
.f-top{display:grid;grid-template-columns:1.6fr repeat(3,1fr);gap:48px;padding-bottom:64px;border-bottom:1px solid rgba(230,229,225,.15)}
.f-top p{color:rgba(230,229,225,.6);font-size:14px;max-width:320px;margin-top:18px}
.f-logo{display:block;height:auto;max-height:84px;width:auto;max-width:250px;object-fit:contain;margin:0 0 18px}
.f-wordmark{font-family:var(--display);font-weight:700;font-size:40px;letter-spacing:.32em;text-transform:uppercase;line-height:1;margin-bottom:16px}
.f-col h5{font-size:11px;letter-spacing:.2em;text-transform:uppercase;color:var(--saddle);margin-bottom:18px;font-weight:500}
.f-col a{display:block;font-size:14px;color:rgba(230,229,225,.75);padding:5px 0;transition:color .2s,padding .25s}
.f-col a:hover{color:#fff;padding-left:6px}
.f-bot{display:flex;justify-content:space-between;gap:20px;flex-wrap:wrap;padding-top:28px;font-size:12px;color:rgba(230,229,225,.5);letter-spacing:.06em}
.rope{height:8px;background:repeating-linear-gradient(135deg,var(--saddle) 0 6px,#d9a56a 6px 9px,var(--saddle-d) 9px 12px);opacity:.9}
@media(max-width:860px){.f-top{grid-template-columns:1fr 1fr}.f-top>div:first-child{grid-column:1/-1}}

.scrim{position:fixed;inset:0;background:rgba(14,19,28,.55);backdrop-filter:blur(3px);z-index:100;opacity:0;pointer-events:none;transition:opacity .4s}
.scrim.on{opacity:1;pointer-events:auto}
.drawer{position:fixed;top:0;right:0;bottom:0;width:min(470px,100%);background:var(--cream);z-index:110;display:flex;flex-direction:column;transform:translateX(102%);transition:transform .55s var(--ease)}
.drawer.on{transform:none}
.d-head{display:flex;justify-content:space-between;align-items:center;padding:22px 28px;border-bottom:1px solid var(--line)}
.d-head h3{font-family:var(--serif);font-weight:400;font-size:26px}
.ship{padding:18px 28px;border-bottom:1px solid var(--line);font-size:13px}
.ship .bar{height:3px;background:var(--line);margin-top:10px;position:relative;overflow:hidden}
.ship .bar i{position:absolute;left:0;top:0;bottom:0;background:var(--saddle-d);transition:width .6s var(--ease)}
.d-body{flex:1;overflow-y:auto;padding:8px 28px}
.line{display:grid;grid-template-columns:84px 1fr;gap:16px;padding:20px 0;border-bottom:1px solid var(--line)}
.line .th{background:var(--paper-2);aspect-ratio:4/5;display:grid;place-items:center;padding:8px}
.line h4{font-family:var(--serif);font-weight:400;font-size:17px;line-height:1.2}
.line .sub{font-size:12px;color:var(--ink-2);margin-top:2px}
.line .lr{display:flex;justify-content:space-between;align-items:center;margin-top:12px}
.qty{display:inline-flex;border:1px solid var(--line);align-items:center}
.qty button{width:30px;height:30px;font-size:16px}
.qty button:hover{background:var(--paper-2)}
.qty span{min-width:26px;text-align:center;font-size:13px;font-weight:500}
.rm{font-size:11px;letter-spacing:.12em;text-transform:uppercase;color:var(--ink-2);text-decoration:underline;margin-left:12px}
.d-empty{text-align:center;padding:80px 10px;color:var(--ink-2)}
.d-empty .h-md{color:var(--ink);margin-bottom:10px}
.d-foot{border-top:1px solid var(--line);padding:22px 28px 26px;background:var(--paper)}
.promo{display:flex;gap:8px;margin-bottom:16px}
.promo input{flex:1;min-width:0;border:1px solid var(--line);background:var(--cream);padding:11px 12px;font:inherit;font-size:16px;letter-spacing:.1em;text-transform:uppercase;outline:0}
.promo input:focus{border-color:var(--ink)}
.promo button{padding:0 16px;border:1px solid var(--ink);font-size:11px;letter-spacing:.16em;text-transform:uppercase;font-weight:500}
.promo button:hover{background:var(--ink);color:var(--paper)}
.tot{display:flex;justify-content:space-between;font-size:14px;padding:4px 0;color:var(--ink-2)}
.tot.big{font-family:var(--serif);font-size:24px;color:var(--ink);padding-top:12px;margin-top:8px;border-top:1px solid var(--line)}
.d-foot .btn{width:100%;justify-content:center;margin-top:16px}
.d-foot small{display:block;text-align:center;font-size:11px;color:var(--ink-2);margin-top:12px}
.ln-row{display:none;margin-top:10px}.ln-row.on{display:block}
.ln-row input,.qnote{width:100%;border:1px solid var(--line);background:var(--paper);padding:11px 12px;font:inherit;font-size:16px;outline:0}
.ln-row input:focus,.qnote:focus{border-color:var(--ink)}
.lnote{font-style:italic;font-size:12px;color:var(--saddle-d);margin-top:4px}

.modal{position:fixed;inset:0;z-index:120;display:grid;place-items:center;padding:20px;opacity:0;pointer-events:none;transition:opacity .35s}
.modal.on{opacity:1;pointer-events:auto}
.m-box{background:var(--cream);width:min(1020px,100%);max-height:92vh;overflow:auto;display:grid;grid-template-columns:1fr 1fr;transform:translateY(24px) scale(.98);transition:transform .5s var(--ease);position:relative}
.modal.on .m-box{transform:none}
.m-media{background:var(--paper-2);display:grid;place-items:center;padding:56px;min-height:420px;position:relative;perspective:1000px;overflow:hidden;background:radial-gradient(120% 70% at 50% 30%,#f2f1ed,#dad9d3 62%,#c6c5be)}
.m-media svg{width:100%;max-width:380px;filter:drop-shadow(0 22px 22px rgba(20,24,31,.18));transform:rotateY(var(--qy,0deg)) rotateX(var(--qx,0deg));transition:transform .2s ease-out;position:relative}
.m-hint{position:absolute;bottom:14px;left:0;right:0;text-align:center;font-size:10px;letter-spacing:.2em;text-transform:uppercase;color:var(--ink-2)}
.m-info{padding:44px 40px 36px;display:flex;flex-direction:column;gap:20px}
.m-info h2{font-family:var(--display);font-weight:700;text-transform:uppercase;font-size:clamp(36px,4vw,56px);line-height:.92}
.m-info .price{font-size:20px;font-weight:500}
.m-info .desc{color:var(--ink-2);font-size:15px}
.m-x{position:absolute;top:10px;right:10px;z-index:3;background:var(--cream)}
.lbl{display:flex;justify-content:space-between;font-size:11px;letter-spacing:.18em;text-transform:uppercase;margin-bottom:10px;font-weight:500}
.lbl a{text-decoration:underline;color:var(--ink-2);cursor:pointer}
.lbl.err{color:var(--rust)}
.m-act{display:flex;gap:12px}
.m-act .btn{flex:1;justify-content:center}
details{border-top:1px solid var(--line);padding:14px 0;font-size:14px}
details:last-of-type{border-bottom:1px solid var(--line)}
summary{cursor:pointer;font-size:12px;letter-spacing:.16em;text-transform:uppercase;font-weight:500;list-style:none;display:flex;justify-content:space-between}
summary::-webkit-details-marker{display:none}
summary::after{content:"+";font-size:16px;line-height:1}
details[open] summary::after{content:"–"}
details p{margin-top:10px;color:var(--ink-2)}
.shake{animation:shake .4s}
@keyframes shake{25%{transform:translateX(-6px)}75%{transform:translateX(6px)}}
@media(max-width:800px){.m-box{grid-template-columns:1fr}.m-media{min-height:320px;padding:36px}.m-info{padding:28px 24px}}

.search{position:fixed;inset:0;background:var(--paper);z-index:120;padding:100px 0 40px;transform:translateY(-100%);transition:transform .55s var(--ease);overflow:auto}
.search.on{transform:none}
.search .x{position:absolute;top:20px;right:24px}
.search input{width:100%;font-family:var(--serif);font-weight:300;font-size:clamp(24px,6vw,84px);border:0;border-bottom:1px solid var(--ink);background:transparent;padding:10px 0 18px;outline:0;letter-spacing:-.02em;color:var(--ink)}
.search input::placeholder{color:#b6ad9c}
.s-res{display:grid;grid-template-columns:repeat(auto-fill,minmax(210px,1fr));gap:22px;margin-top:40px}
.s-hit{display:grid;grid-template-columns:70px 1fr;gap:14px;align-items:center;text-align:left;padding:10px;border:1px solid var(--line);background:var(--cream);transition:border-color .2s}
.s-hit:hover{border-color:var(--ink)}
.s-hit .t{background:var(--paper-2);aspect-ratio:1;padding:6px;display:grid;place-items:center}
.s-hit b{font-family:var(--serif);font-weight:400;font-size:16px;display:block;line-height:1.2}
.s-hit span{font-size:12px;color:var(--ink-2)}
.sugg{margin-top:22px;display:flex;gap:10px;flex-wrap:wrap;align-items:center;font-size:12px;letter-spacing:.14em;text-transform:uppercase;color:var(--ink-2)}
.sugg button{border:1px solid var(--line);padding:7px 14px}
.sugg button:hover{border-color:var(--ink);color:var(--ink)}

.toast{position:fixed;left:50%;bottom:28px;transform:translate(-50%,40px);background:var(--ink);color:var(--paper);padding:14px 22px;font-size:13px;letter-spacing:.04em;z-index:200;opacity:0;pointer-events:none;transition:all .45s var(--ease);display:flex;gap:14px;align-items:center;max-width:calc(100% - 32px)}
.toast.on{opacity:1;transform:translate(-50%,0);pointer-events:auto}
.toast button{text-decoration:underline;font-size:11px;letter-spacing:.14em;text-transform:uppercase;color:var(--saddle)}
.totop{position:fixed;right:20px;bottom:24px;width:46px;height:46px;border:1px solid var(--ink);background:var(--paper);display:grid;place-items:center;z-index:50;opacity:0;pointer-events:none;transition:all .3s}
.totop.on{opacity:1;pointer-events:auto}
.totop:hover{background:var(--ink);color:var(--paper)}
.totop svg{width:16px;stroke:currentColor;fill:none;stroke-width:1.6}
.sr{position:absolute;width:1px;height:1px;overflow:hidden;clip:rect(0 0 0 0)}
[hidden]{display:none!important}

.co{position:fixed;inset:0;z-index:130;background:var(--paper);overflow:auto;transform:translateY(100%);transition:transform .6s var(--ease),visibility 0s .6s;visibility:hidden}
.co.on{transform:none;visibility:visible;transition:transform .6s var(--ease)}
.co-head{border-bottom:1px solid var(--line);background:var(--paper);position:sticky;top:0;z-index:2}
.co-head-in{display:grid;grid-template-columns:1fr auto 1fr;align-items:center;height:76px}
.co-head .logo{font-size:24px}
.co-head .eyebrow{text-align:right}
.co-grid{display:grid;grid-template-columns:minmax(0,1.35fr) minmax(0,1fr);gap:clamp(32px,5vw,80px);padding:48px 0 96px;align-items:start}
.steps{list-style:none;display:flex;gap:28px;margin-bottom:36px;flex-wrap:wrap}
.steps li{display:flex;align-items:center;gap:10px;font-size:12px;letter-spacing:.16em;text-transform:uppercase;color:var(--ink-2);font-weight:500}
.steps li span{width:26px;height:26px;border:1px solid var(--line);border-radius:50%;display:grid;place-items:center;font-size:11px}
.steps li.on{color:var(--ink)}.steps li.on span{background:var(--ink);color:var(--paper);border-color:var(--ink)}
.steps li.done span{background:var(--saddle-d);color:#fff;border-color:var(--saddle-d)}
.co-h{font-family:var(--display);text-transform:uppercase;font-weight:700;font-size:clamp(28px,6vw,64px);line-height:.92}
.co-p{color:var(--ink-2);margin:12px 0 28px;max-width:520px}
.co-sub{font-size:12px;letter-spacing:.2em;text-transform:uppercase;font-weight:600;margin:34px 0 14px;padding-top:22px;border-top:1px solid var(--line)}
.fgrid{display:grid;grid-template-columns:1fr 1fr;gap:18px 16px}
.fld{display:flex;flex-direction:column;gap:6px}.fld.full{grid-column:1/-1}
.fld label{font-size:11px;letter-spacing:.16em;text-transform:uppercase;font-weight:500;color:var(--ink-2)}
.fld label i{color:var(--rust);font-style:normal}
.fld input,.fld select,.fld textarea{width:100%;background:var(--cream);border:1px solid var(--line);border-radius:0;padding:14px;font:inherit;font-size:16px;color:var(--ink);outline:0;transition:border-color .2s;appearance:none}
.fld textarea{resize:vertical;min-height:96px}
.fld input:focus,.fld select:focus,.fld textarea:focus{border-color:var(--ink)}
.fld.bad input{border-color:var(--rust)}
.fld .err{color:var(--rust);font-size:12px}
.cnt-s{align-self:flex-end;font-size:11px;color:var(--ink-2)}
.opts{display:grid;gap:10px}
.opt{display:flex;gap:14px;align-items:flex-start;padding:16px 18px;border:1px solid var(--line);background:var(--cream);cursor:pointer;transition:border-color .2s;position:relative}
.opt:hover{border-color:var(--ink-2)}.opt.on{border-color:var(--ink);box-shadow:inset 0 0 0 1px var(--ink)}
.opt input{position:absolute;opacity:0;pointer-events:none}
.opt .rd{width:18px;height:18px;border:1.5px solid var(--ink-2);border-radius:50%;flex:none;margin-top:2px;position:relative}
.opt.on .rd::after{content:"";position:absolute;inset:3px;border-radius:50%;background:var(--ink)}
.opt b{display:block;font-weight:600;font-size:15px}.opt small{color:var(--ink-2);font-size:13px}
.chk{display:flex;gap:12px;align-items:center;font-size:14px;cursor:pointer;margin:18px 0 8px}
.chk input{width:18px;height:18px;accent-color:var(--ink)}
.chk.bad{color:var(--rust)}
.co-nav{display:flex;justify-content:space-between;gap:14px;margin-top:40px;flex-wrap:wrap}
.co-side{position:sticky;top:100px;background:var(--cream);border:1px solid var(--line);padding:26px}
.side-h{display:flex;justify-content:space-between;align-items:center;border-bottom:1px solid var(--ink);padding-bottom:14px;margin-bottom:6px;font-size:12px;letter-spacing:.18em;text-transform:uppercase;font-weight:600}
.side-h .link{font-size:11px}
.s-it{display:grid;grid-template-columns:56px 1fr auto;gap:14px;padding:14px 0;border-bottom:1px solid var(--line);align-items:center;font-size:14px}
.s-it .th{position:relative;background:var(--paper-2);aspect-ratio:1;padding:6px;display:grid;place-items:center}
.s-it .q{position:absolute;top:-6px;right:-6px;background:var(--ink);color:var(--paper);font-size:10px;min-width:18px;height:18px;border-radius:9px;display:grid;place-items:center}
.s-it small{display:block;color:var(--ink-2);font-size:12px}.s-it .nt{font-style:italic;color:var(--saddle-d)}
.co-side .tot{padding:5px 0}
.rv-grid{display:grid;grid-template-columns:1fr 1fr;gap:16px}
.rv-card{border:1px solid var(--line);background:var(--cream);padding:20px;font-size:14px;line-height:1.65}.rv-card.full{grid-column:1/-1}
.rv-h{display:flex;justify-content:space-between;margin-bottom:10px;font-size:11px;letter-spacing:.18em;text-transform:uppercase;font-weight:600}
.rv-h .link{font-size:11px}
.co-done{grid-column:1/-1;text-align:center;padding:30px 0}
.co-done .tick{width:68px;height:68px;border-radius:50%;border:1px solid var(--ink);margin:0 auto 26px;display:grid;place-items:center}
.co-done .tick svg{width:28px;stroke:var(--ink);fill:none;stroke-width:1.6;stroke-dasharray:30;stroke-dashoffset:30;animation:draw .8s .2s var(--ease) forwards}
@keyframes draw{to{stroke-dashoffset:0}}
@media(max-width:900px){.co-grid{grid-template-columns:1fr;padding-top:28px}.co-side{position:static;order:-1}.fgrid,.rv-grid{grid-template-columns:1fr}.co-head-in{grid-template-columns:auto 1fr}.co-head .eyebrow{display:none}.co-head .logo{justify-self:end}}

.hero-3d{position:absolute;inset:0;perspective:1200px;pointer-events:none;z-index:2}
.hero-3d .rod{position:absolute;left:0;right:0;top:6%;height:11px;background:linear-gradient(#b3b7bd,#5b6068 55%,#2c2f35);box-shadow:0 16px 26px rgba(0,0,0,.38)}
.hang-rot{position:absolute;left:50%;top:calc(6% + 6px);width:clamp(210px,44%,330px);transform:translateX(-50%) rotateY(var(--ry,0deg)) rotateX(var(--rx,0deg));transform-style:preserve-3d;transition:transform .5s var(--ease)}
.hang3d{position:relative;transform-origin:50% 0;animation:sway 7s ease-in-out infinite alternate}
@keyframes sway{from{transform:rotate(-1.4deg)}to{transform:rotate(1.4deg)}}
.hang3d>svg,.hang3d .jeans3d svg{width:100%;height:auto;display:block}
.hang3d .hk{position:relative;z-index:2}
.hang3d .jeans3d{margin-top:-16%;filter:drop-shadow(16px 30px 24px rgba(0,0,0,.45))}
.tag3d{position:absolute;left:59%;top:14%;width:20%;transform-origin:50% 0;animation:swing 4.6s ease-in-out infinite alternate;z-index:3}
@keyframes swing{from{transform:rotate(-7deg) rotateY(-14deg)}to{transform:rotate(6deg) rotateY(14deg)}}
.tag3d .str{height:30px;width:1.5px;background:#2b1a0e;margin:0 auto}
.tag3d .lea{aspect-ratio:3/4.3;background:linear-gradient(135deg,#b08048,#6a4220);border:1px dashed rgba(245,235,215,.55);border-radius:6px 6px 3px 3px;box-shadow:inset 0 1px 1px rgba(255,255,255,.3),0 8px 14px rgba(0,0,0,.4);display:flex;flex-direction:column;align-items:center;justify-content:center;gap:3px;color:#f3e6cf;font:600 8px/1.35 var(--sans);letter-spacing:.14em;text-align:center;padding:6px 4px;position:relative}
.tag3d .lea::before{content:"";position:absolute;top:5px;left:50%;width:6px;height:6px;margin-left:-3px;border-radius:50%;background:#2b1a0e}
.tag3d .lea b{font-family:var(--display);font-size:20px;letter-spacing:.1em;display:block;margin-top:8px}
@media(prefers-reduced-motion:reduce){.hang3d,.tag3d{animation:none}}

body::after{content:"";position:fixed;inset:0;pointer-events:none;z-index:999;opacity:.07;mix-blend-mode:multiply;background-image:url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='160' height='160'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='.9' numOctaves='2' stitchTiles='stitch'/></filter><rect width='100%' height='100%' filter='url(%23n)'/></svg>")}

/* Admin */
.admin-shell{min-height:100vh;display:grid;grid-template-columns:240px 1fr;background:var(--paper)}
@media(max-width:900px){.admin-shell{grid-template-columns:1fr}}
.admin-side{background:var(--ink);color:var(--paper);padding:24px;display:flex;flex-direction:column;gap:14px}
.admin-brand-side{font-family:var(--display);font-weight:700;font-size:22px;letter-spacing:.3em;line-height:1;text-transform:uppercase}
.admin-tag{font-family:var(--sans);font-size:10px;letter-spacing:.4em;color:var(--saddle);text-transform:uppercase;font-weight:600}
.admin-nav{display:flex;flex-direction:column;gap:2px;margin-top:14px}
.admin-nav button{text-align:left;padding:11px 14px;color:rgba(230,229,225,.7);font-size:12px;letter-spacing:.1em;text-transform:uppercase;border-left:2px solid transparent;transition:all .2s}
.admin-nav button:hover{color:#fff;background:rgba(255,255,255,.05)}
.admin-nav button.on{color:#fff;border-left-color:var(--saddle);background:rgba(255,255,255,.06)}
.admin-exit{text-align:left;color:rgba(230,229,225,.65);font-size:12px;letter-spacing:.1em;text-transform:uppercase;border-bottom:1px solid transparent;padding:4px 0;transition:color .2s}
.admin-exit:hover{color:#fff}
.admin-main{padding:28px clamp(20px,4vw,48px);overflow:hidden}
.admin-head{display:flex;justify-content:space-between;align-items:center;gap:16px;margin-bottom:24px;flex-wrap:wrap}
.admin-h1{font-family:var(--display);font-size:clamp(28px,4vw,44px);font-weight:700;text-transform:uppercase;line-height:1}
.admin-table{width:100%;border-collapse:collapse;background:var(--cream);border:1px solid var(--line)}
.admin-table th,.admin-table td{padding:12px 14px;text-align:left;border-bottom:1px solid var(--line);font-size:13px}
.admin-table th{background:var(--paper-2);font-size:11px;letter-spacing:.14em;text-transform:uppercase;font-weight:600}
.admin-table tr:hover td{background:var(--paper)}
@media(max-width:760px){.admin-table{font-size:12px}.admin-table th,.admin-table td{padding:10px 8px}.admin-table th:nth-child(n+4),.admin-table td:nth-child(n+4){display:none}}
.admin-empty{padding:60px 20px;text-align:center;color:var(--ink-2);background:var(--cream);border:1px solid var(--line)}
.admin-form{background:var(--cream);border:1px solid var(--line);padding:clamp(18px,3vw,32px);display:grid;gap:16px}
.admin-form .fgrid{display:grid;grid-template-columns:repeat(2,1fr);gap:14px}
@media(max-width:640px){.admin-form .fgrid{grid-template-columns:1fr}}
.admin-form .fld{display:flex;flex-direction:column;gap:5px}
.admin-form label{font-size:11px;letter-spacing:.14em;text-transform:uppercase;font-weight:500;color:var(--ink-2)}
.admin-form input,.admin-form select,.admin-form textarea{width:100%;padding:10px 12px;font:inherit;font-size:16px;border:1px solid var(--line);background:var(--paper);outline:0}
.admin-form input:focus,.admin-form select:focus,.admin-form textarea:focus{border-color:var(--ink)}
.admin-badge{display:inline-block;padding:3px 10px;font-size:10px;letter-spacing:.1em;text-transform:uppercase;background:var(--line);color:var(--ink);border-radius:10px}
.admin-actions{display:flex;gap:8px;flex-wrap:wrap}
.admin-login{min-height:100vh;display:grid;place-items:center;padding:40px 20px;background:radial-gradient(ellipse at top,#1f252c,#14171b)}
.admin-login-card{width:100%;max-width:400px;background:var(--cream);padding:clamp(28px,5vw,44px);box-shadow:0 30px 80px -30px rgba(0,0,0,.5)}
.admin-brand{font-family:var(--display);font-weight:700;font-size:24px;letter-spacing:.3em;text-indent:.3em;text-align:center;text-transform:uppercase;color:var(--ink)}
.admin-kicker{font-size:10px;letter-spacing:.42em;text-transform:uppercase;color:var(--saddle-d);text-align:center;margin:6px 0 22px;font-weight:600}
.admin-login-card h1{font-family:var(--display);font-size:32px;font-weight:700;text-transform:uppercase;text-align:center;margin-bottom:6px}
.admin-sub{font-size:13px;color:var(--ink-2);text-align:center;margin-bottom:24px}
.admin-login-card .fld{display:flex;flex-direction:column;gap:6px;margin-bottom:14px}
.admin-login-card label{font-size:11px;letter-spacing:.14em;text-transform:uppercase;color:var(--ink-2);font-weight:500}
.admin-login-card input{padding:12px;border:1px solid var(--line);background:var(--paper);font:inherit;font-size:16px}
.admin-login-card input:focus{outline:0;border-color:var(--ink)}
.admin-err{background:#f4e4e0;color:var(--rust);padding:10px 14px;font-size:13px;margin-bottom:14px;border:1px solid #e5c5bd}
.admin-hint{text-align:center;margin-top:16px;font-size:11px;color:var(--ink-2)}

/* EXTRA RESPONSIVE FIXES FOR < 600px */
@media(max-width:600px){
  .f-top { grid-template-columns: 1fr; gap: 32px; }
  .f-top > div:first-child { grid-column: 1/-1; }
  .hero-meta { flex-direction: column; gap: 16px; }
  .stats { grid-template-columns: 1fr; }
  .stat { border-right: none !important; border-bottom: 1px solid var(--line); padding: 24px 0 !important; }
  .stat:last-child { border-bottom: none; }
  .grid { gap: 16px 8px; }
  .hero-art { min-height: 55vh; }
  .hero-badge { width: 80px; height: 80px; right: 12px; bottom: 12px; }
  .hero-cap { font-size: 9px; max-width: 140px; left: 12px; bottom: 12px; }
  .co-head-in { grid-template-columns: 1fr auto; }
  .co-head .link { display: none; }
  .co-head .logo { justify-self: start; }
  .m-media { padding: 30px; min-height: 260px; }
  .m-info h2 { font-size: 28px; }
  .tools-r { width: 100%; justify-content: space-between; margin-top: 10px; }
  .nav-in { height: 60px; }
  .sec-head .h-lg { margin-top: 8px; }
}
`;

/* ====================================================================
   MAIN
   ==================================================================== */
export default function RookfordStore() {
  const [route, setRoute] = useState(() => {
    if (typeof window === "undefined") return "store";
    return window.location.hash === "#admin" ? "admin" : "store";
  });

  // Inject meta viewport for mobile layout handling in sandboxes (CodeSandbox/CodePen)
  useEffect(() => {
    if (typeof document !== 'undefined' && !document.querySelector("meta[name='viewport']")) {
      const meta = document.createElement("meta");
      meta.name = "viewport";
      meta.content = "width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no";
      document.head.appendChild(meta);
    }
  }, []);

  useEffect(() => {
    const onHash = () => setRoute(window.location.hash === "#admin" ? "admin" : "store");
    window.addEventListener("hashchange", onHash);
    return () => window.removeEventListener("hashchange", onHash);
  }, []);

  /* ------------------------------------------------------------------
     ADMIN ROUTE
  ------------------------------------------------------------------ */
  if (route === "admin") {
    return (
      <>
        <style dangerouslySetInnerHTML={{ __html: CSS }} />
        <AdminApp onExit={() => { window.location.hash = ""; setRoute("store"); }} />
      </>
    );
  }

  /* ------------------------------------------------------------------
     STORE STATE
  ------------------------------------------------------------------ */
  const [products, setProducts] = useState([]);
  const [productsLoading, setProductsLoading] = useState(true);
  const [reviews, setReviews] = useState([]);
  const [posts, setPosts] = useState([]);

  const [annIdx, setAnnIdx] = useState(0);
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [cat, setCat] = useState("all");
  const [sort, setSort] = useState("feat");
  const [sel, setSel] = useState({});
  const [wish, setWish] = useState(() => store.get("rf_wish", []));
  const [cart, setCart] = useState(() => store.get("rf_cart", []));
  const [promo, setPromo] = useState(() => store.get("rf_promo", ""));
  const [promoInput, setPromoInput] = useState("");
  const [bagOpen, setBagOpen] = useState(false);
  const [qv, setQv] = useState(null);
  const [searchOpen, setSearchOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [checkoutOpen, setCheckoutOpen] = useState(false);
  const [toastState, setToastState] = useState({ msg: "", showBtn: false, on: false });
  const [showTop, setShowTop] = useState(false);
  const [fadeMonths, setFadeMonths] = useState(0);
  const [revIdx, setRevIdx] = useState(0);
  const [logoOk, setLogoOk] = useState(true);
  const [email, setEmail] = useState("");
  const [newsMsg, setNewsMsg] = useState("");

  const toastTimer = useRef(null);
  const railRef = useRef(null);
  const heroArtRef = useRef(null);
  const hangRotRef = useRef(null);
  const qvBoxRef = useRef(null);

  /* Load data from backend */
  useEffect(() => {
    let alive = true;
    (async () => {
      const [p, r, j] = await Promise.all([
        getJSON(API.products, []),
        getJSON(API.reviews, []),
        getJSON(API.journal, []),
      ]);
      if (!alive) return;
      setProducts(p.map(normalizeProduct));
      setReviews(r);
      setPosts(j);
      setProductsLoading(false);
    })();
    return () => { alive = false; };
  }, []);

  useEffect(() => {
    if (!products.length) return;
    setSel((prev) => {
      const next = { ...prev };
      products.forEach((p) => {
        if (next[p.id] == null || next[p.id] >= p.colors.length) next[p.id] = 0;
      });
      return next;
    });
  }, [products]);

  useEffect(() => { store.set("rf_wish", wish); }, [wish]);
  useEffect(() => { store.set("rf_cart", cart); }, [cart]);
  useEffect(() => { store.set("rf_promo", promo); }, [promo]);

  useEffect(() => {
    const lock = bagOpen || !!qv || searchOpen || checkoutOpen;
    document.body.style.overflow = lock ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [bagOpen, qv, searchOpen, checkoutOpen]);

  const toast = useCallback((msg, showBtn = false) => {
    setToastState({ msg, showBtn, on: true });
    clearTimeout(toastTimer.current);
    toastTimer.current = setTimeout(() => setToastState((t) => ({ ...t, on: false })), 3200);
  }, []);

  useEffect(() => {
    const id = setInterval(() => setAnnIdx((i) => (i + 1) % ANNOUNCEMENTS.length), 3800);
    return () => clearInterval(id);
  }, []);

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 10);
      setShowTop(window.scrollY > 900);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const els = document.querySelectorAll(".rv:not(.in)");
    if (!("IntersectionObserver" in window)) {
      els.forEach((e) => e.classList.add("in"));
      return;
    }
    const io = new IntersectionObserver((entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); }
      });
    }, { threshold: 0.12 });
    els.forEach((e) => io.observe(e));
    return () => io.disconnect();
  }, [products, reviews, posts]);

  useEffect(() => {
    const art = heroArtRef.current;
    if (!art) return;
    const layers = Array.from(art.querySelectorAll(".layer"));
    const onMove = (e) => {
      const r = art.getBoundingClientRect();
      const x = (e.clientX - r.left) / r.width - 0.5;
      const y = (e.clientY - r.top) / r.height - 0.5;
      layers.forEach((l) => {
        const d = +l.dataset.d;
        l.style.transform = `translate(${-x * d}px,${-y * d * 0.5}px)`;
      });
      if (hangRotRef.current) {
        hangRotRef.current.style.setProperty("--ry", x * 28 + "deg");
        hangRotRef.current.style.setProperty("--rx", -y * 8 + "deg");
      }
    };
    const onLeave = () => {
      layers.forEach((l) => { l.style.transform = ""; });
      if (hangRotRef.current) {
        hangRotRef.current.style.setProperty("--ry", "0deg");
        hangRotRef.current.style.setProperty("--rx", "0deg");
      }
    };
    art.addEventListener("mousemove", onMove);
    art.addEventListener("mouseleave", onLeave);
    return () => {
      art.removeEventListener("mousemove", onMove);
      art.removeEventListener("mouseleave", onLeave);
    };
  }, []);

  const onQvMove = (e) => {
    const box = qvBoxRef.current;
    if (!box) return;
    const m = e.target.closest && e.target.closest(".m-media");
    if (!m) return;
    const r = m.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width - 0.5;
    const y = (e.clientY - r.top) / r.height - 0.5;
    m.style.setProperty("--qy", x * 46 + "deg");
    m.style.setProperty("--qx", -y * 14 + "deg");
  };
  const onQvLeave = () => {
    const m = qvBoxRef.current && qvBoxRef.current.querySelector(".m-media");
    if (m) { m.style.setProperty("--qy", "0deg"); m.style.setProperty("--qx", "0deg"); }
  };

  const closeAll = useCallback(() => {
    setBagOpen(false);
    setQv(null);
    setSearchOpen(false);
    setCheckoutOpen(false);
    setMenuOpen(false);
  }, []);

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === "Escape") closeAll();
      const tag = document.activeElement && document.activeElement.tagName;
      if (((e.key === "/") || (e.key === "k" && (e.metaKey || e.ctrlKey))) && !/INPUT|TEXTAREA/.test(tag)) {
        e.preventDefault();
        setSearchOpen(true);
      }
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [closeAll]);

  const visible = useMemo(() => {
    let list = products.slice();
    if (cat === "saved") list = list.filter((p) => wish.includes(p.id));
    else if (cat !== "all") list = list.filter((p) => p.cat === cat);
    if (sort === "lo") list.sort((a, b) => a.price - b.price);
    if (sort === "hi") list.sort((a, b) => b.price - a.price);
    return list;
  }, [products, cat, sort, wish]);

  const totals = useMemo(() => {
    const sub = cart.reduce((a, l) => a + l.price * l.qty, 0);
    const disc = String(promo).toUpperCase() === "WEST10" ? sub * 0.1 : 0;
    return { sub, disc, tot: sub - disc };
  }, [cart, promo]);

  const searchResults = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return products.slice(0, 4);
    return products.filter((p) =>
      (p.name + " " + p.cat + " " + p.type + " " + p.colors.map((c) => c.name).join(" "))
        .toLowerCase()
        .includes(q)
    );
  }, [products, query]);

  const lineKey = (l) => [l.productId, l.color.name, l.size, l.ins || "", l.note || ""].join("|");

  const addToCart = useCallback((product, colorIndex, size, qty = 1, opts = {}) => {
    const color = product.colors[colorIndex] || DEFAULT_COLOR;
    const ins = product.type === "jeans" ? (opts.ins || INS[0]) : "";
    const note = (opts.note || "").trim();
    const line = {
      productId: product.id,
      name: product.name,
      type: product.type,
      price: product.price,
      color: { name: color.name, b: color.b, s: color.s },
      size, ins, note, qty,
    };
    line.key = lineKey(line);
    setCart((prev) => {
      const i = prev.findIndex((l) => l.key === line.key);
      if (i > -1) {
        const next = prev.slice();
        next[i] = { ...next[i], qty: next[i].qty + qty };
        return next;
      }
      return [...prev, line];
    });
    if (opts.openBag) setBagOpen(true);
    else toast(product.name + " added to bag", true);
  }, [toast]);

  const updateQty = (idx, delta) =>
    setCart((prev) => {
      const next = prev.slice();
      next[idx] = { ...next[idx], qty: next[idx].qty + delta };
      if (next[idx].qty < 1) next.splice(idx, 1);
      return next;
    });

  const removeLine = (idx) => setCart((prev) => prev.filter((_, i) => i !== idx));
  const setLineNote = (idx, note) =>
    setCart((prev) => {
      const next = prev.slice();
      next[idx] = { ...next[idx], note };
      next[idx].key = lineKey(next[idx]);
      return next;
    });

  const toggleWish = (id) => {
    setWish((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));
    toast(wish.includes(id) ? "Removed from saved" : "Saved — find it under “Saved ♥”");
  };

  const goTo = (hash, category) => {
    if (category) setCat(category);
    setMenuOpen(false);
    const el = document.querySelector(hash);
    if (el) el.scrollIntoView({ behavior: "smooth" });
  };

  const openQV = (product) =>
    setQv({ product, ci: sel[product.id] ?? 0, size: "", qty: 1, ins: INS[0], note: "", sizeError: false });

  const openBag = () => { closeAll(); setBagOpen(true); };
  const openCheckout = () => {
    if (!cart.length) { toast("Your bag is empty"); return; }
    setBagOpen(false);
    setCheckoutOpen(true);
  };

  const fadeStages = useMemo(() => [
    [0, "Loomstate", "Inky, saturated, crisp as cardboard. Deep indigo with no memory yet. Wear them daily and resist the washing machine."],
    [6, "First memory", "Creases begin to set at the knees and lap. Honeycombs appear behind the legs as the dye starts to break."],
    [18, "Stories in the cloth", "Whiskers deepen and the first white core shows at the pockets. The fabric softens and starts to move with you."],
    [36, "High contrast", "Stark pale ridges against midnight valleys. Every habit you have is now written into the denim."],
    [60, "Relic", "Sky-blue, sun-bleached and glove-soft. Patched, darned and entirely yours."],
  ], []);

  const fadeIndex = useMemo(() => {
    let k = 0;
    fadeStages.forEach((s, i) => { if (fadeMonths >= s[0]) k = i; });
    return k;
  }, [fadeMonths, fadeStages]);

  const fadeSvg = useMemo(() => {
    const lerp = (a, b, t) => a + (b - a) * t;
    const hex = (h) => [1, 3, 5].map((i) => parseInt(h.slice(i, i + 2), 16));
    const mix = (a, b, t) =>
      "#" + hex(a).map((v, i) => Math.round(lerp(v, hex(b)[i], t)).toString(16).padStart(2, "0")).join("");
    const t = fadeMonths / 60;
    const e = Math.pow(t, 0.8);
    const body = mix("#1f2937", "#aab1b9", e);
    const st = mix("#d29a58", "#f1ddb8", e * 0.6);
    const w = Math.min(1, e * 1.4);
    const hn = Math.min(1, Math.max(0, (e - 0.1) * 1.5));
    const fx =
      `<g stroke="#eef4fa" stroke-linecap="round" fill="none" opacity="${w * 0.8}" stroke-width="1.2"><path d="M48 44Q72 56 80 74M47 54Q70 64 79 80M48 64Q70 72 78 86"/><path d="M152 44Q128 56 120 74M153 54Q130 64 121 80M152 64Q130 72 122 86"/><path d="M52 188Q74 198 90 186M48 198Q72 210 90 196M54 176Q74 184 90 174"/><path d="M148 188Q126 198 110 186M152 198Q128 210 110 196M146 176Q126 184 110 174"/></g>` +
      `<g fill="#eef4fa" opacity="${hn * 0.5}"><ellipse cx="68" cy="132" rx="22" ry="11"/><ellipse cx="132" cy="132" rx="22" ry="11"/><ellipse cx="64" cy="238" rx="18" ry="5"/><ellipse cx="136" cy="238" rx="18" ry="5"/></g>` +
      `<g fill="#f8fcff" opacity="${Math.max(0, t - 0.45) * 1.1}"><rect x="108" y="44" width="30" height="36" rx="3" opacity=".5"/></g>`;
    return garment("jeans", { b: body, s: st }, fx);
  }, [fadeMonths]);

  useEffect(() => {
    if (reviews.length < 2) return;
    const id = setInterval(() => setRevIdx((i) => (i + 1) % reviews.length), 6000);
    return () => clearInterval(id);
  }, [reviews]);

  const railBy = (dir) => {
    const rail = railRef.current;
    if (!rail) return;
    const first = rail.querySelector(".lk");
    const step = first ? first.getBoundingClientRect().width + 20 : 320;
    rail.scrollBy({ left: dir * step, behavior: "smooth" });
  };

  useEffect(() => {
    const rail = railRef.current;
    if (!rail) return;
    let down = false, sx = 0, sl = 0;
    const onDown = (e) => {
      if (e.pointerType !== "mouse") return;
      down = true; sx = e.clientX; sl = rail.scrollLeft;
    };
    const onMove = (e) => {
      if (!down) return;
      const dx = e.clientX - sx;
      if (Math.abs(dx) > 4) rail.classList.add("drag");
      rail.scrollLeft = sl - dx;
    };
    const onUp = () => { down = false; rail.classList.remove("drag"); };
    rail.addEventListener("pointerdown", onDown);
    window.addEventListener("pointermove", onMove);
    window.addEventListener("pointerup", onUp);
    return () => {
      rail.removeEventListener("pointerdown", onDown);
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerup", onUp);
    };
  }, []);

  const onSubscribe = (e) => {
    e.preventDefault();
    if (!/^\S+@\S+\.\S+$/.test(email.trim())) {
      setNewsMsg("Please enter a valid email address.");
      return;
    }
    setNewsMsg("Welcome to the Dispatch. Use code WEST10 for 10% off your first order.");
    setEmail("");
    setPromo("WEST10");
  };

  const applyPromo = () => {
    const v = promoInput.trim().toUpperCase();
    if (!v) { toast("Enter a code"); return; }
    if (v === "WEST10") { setPromo(v); toast("Promo applied — 10% off"); }
    else toast("That code isn’t valid");
  };

  const logoNode = logoOk
    ? <img className="f-logo" src={LOGO_SRC} alt="Rookford" onError={() => setLogoOk(false)} />
    : <div className="f-wordmark">ROOKFORD</div>;

  return (
    <div className="rf">
      <style dangerouslySetInnerHTML={{ __html: CSS }} />

      {/* ANNOUNCEMENT */}
      <div className="ann" role="status">
        {ANNOUNCEMENTS.map((a, i) => (
          <span key={a} className={i === annIdx ? "on" : ""}>{a}</span>
        ))}
      </div>

      {/* NAV */}
      <header className={`nav${scrolled ? " scrolled" : ""}`} id="nav">
        <div className="wrap nav-in">
          <button className="ico burger" aria-label="Open menu" onClick={() => setMenuOpen(true)}>
            <svg viewBox="0 0 24 24"><path d="M3 8h18M3 16h18" /></svg>
          </button>

          <nav className="nav-links" aria-label="Primary">
            <a href="#shop" onClick={(e) => { e.preventDefault(); goTo("#shop", "all"); }}>Shop</a>
            <a href="#collections" onClick={(e) => { e.preventDefault(); goTo("#collections"); }}>Collections</a>
            <a href="#fade" onClick={(e) => { e.preventDefault(); goTo("#fade"); }}>Fade Guide</a>
            <a href="#journal" onClick={(e) => { e.preventDefault(); goTo("#journal"); }}>Journal</a>
          </nav>

          <a href="#top" className="logo" aria-label="Rookford home" onClick={(e) => { e.preventDefault(); window.scrollTo({ top: 0, behavior: "smooth" }); }}>
            ROOKFORD
          </a>

          <div className="nav-tools">
            <button className="ico" aria-label="Search" onClick={() => setSearchOpen(true)}>
              <svg viewBox="0 0 24 24"><circle cx="11" cy="11" r="6.5" /><path d="m20 20-4.2-4.2" /></svg>
            </button>
            <button className="ico" aria-label="Saved items" onClick={() => { setCat("saved"); goTo("#shop"); }}>
              <svg viewBox="0 0 24 24"><path d="M12 20s-7.5-4.6-7.5-10.2A4.3 4.3 0 0 1 12 7.3a4.3 4.3 0 0 1 7.5 2.5C19.5 15.4 12 20 12 20Z" /></svg>
              <span className="cnt" data-n={wish.length}>{wish.length || ""}</span>
            </button>
            <button className="ico" aria-label="Open bag" onClick={openBag}>
              <svg viewBox="0 0 24 24"><path d="M5 8h14l-1 12H6L5 8Z" /><path d="M9 8V6.5a3 3 0 0 1 6 0V8" /></svg>
              <span className="cnt" data-n={cart.reduce((a, l) => a + l.qty, 0)}>
                {cart.reduce((a, l) => a + l.qty, 0) || ""}
              </span>
            </button>
          </div>
        </div>
      </header>

      {/* MOBILE NAV */}
      <nav className={`mnav${menuOpen ? " open" : ""}`} aria-label="Mobile">
        <button className="ico x" aria-label="Close menu" onClick={() => setMenuOpen(false)}>
          <svg viewBox="0 0 24 24"><path d="M5 5l14 14M19 5 5 19" /></svg>
        </button>
        <a href="#shop" onClick={(e) => { e.preventDefault(); goTo("#shop", "all"); }}>Shop</a>
        <a href="#collections" onClick={(e) => { e.preventDefault(); goTo("#collections"); }}>Collections</a>
        <a href="#fade" onClick={(e) => { e.preventDefault(); goTo("#fade"); }}>Fade Guide</a>
        <a href="#lookbook" onClick={(e) => { e.preventDefault(); goTo("#lookbook"); }}>Lookbook</a>
        <a href="#journal" onClick={(e) => { e.preventDefault(); goTo("#journal"); }}>Journal</a>
      </nav>

      <main id="top">
        {/* HERO */}
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
              <div><b>1968</b><span>Toyoda looms</span></div>
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

            {/* Hanging jeans 3D */}
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
              Cut from 15.5oz sulfur-dyed selvedge.<br />Woven in Kojima. Finished in SoHo.
            </div>

            {/* COWBOY BRAND STAMP */}
            <div className="hero-badge" aria-hidden="true">
              <svg viewBox="0 0 140 140">
                <defs>
                  <path id="badgeArc" d="M 22,70 A 48,48 0 0,1 118,70" fill="none" />
                </defs>
                <circle cx="70" cy="70" r="66" fill="none" stroke="currentColor" strokeWidth="1.6" />
                <circle cx="70" cy="70" r="60" fill="none" stroke="currentColor" strokeWidth="0.6" opacity=".5" />
                <text
                  fontFamily="'Barlow Condensed',sans-serif"
                  fontWeight="700"
                  fontSize="13"
                  letterSpacing="3.6"
                  fill="currentColor"
                >
                  <textPath href="#badgeArc" startOffset="50%" textAnchor="middle">ROOKFORD</textPath>
                </text>
                {/* 5-point star */}
                <path
                  d="M70 50 l4.9 11.3 12.3 0.9 -9.4 8 3 12.1 -10.8 -6.4 -10.8 6.4 3 -12.1 -9.4 -8 12.3 -0.9 z"
                  fill="currentColor"
                />
                <text
                  x="70" y="98" textAnchor="middle"
                  fontFamily="'Barlow Condensed',sans-serif"
                  fontWeight="600" fontSize="8" letterSpacing="2.8" fill="currentColor"
                >EST. 1968</text>
                <text
                  x="70" y="110" textAnchor="middle"
                  fontFamily="'Barlow Condensed',sans-serif"
                  fontWeight="500" fontSize="5.5" letterSpacing="2.4" fill="currentColor" opacity=".6"
                >KOJIMA · JAPAN</text>
              </svg>
            </div>
          </div>
        </section>

        {/* TICKER */}
        <div className="ticker" aria-hidden="true">
          <div className="ticker-track">
            {[...TICKER, ...TICKER].map((w, i) => (
              <span key={i}>{w}<i>★</i></span>
            ))}
          </div>
        </div>

        {/* COLLECTIONS */}
        <section id="collections">
          <div className="wrap">
            <div className="sec-head">
              <div>
                <span className="eyebrow rv">The Collections</span>
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

        {/* SHOP */}
        <section className="shop" id="shop">
          <div className="wrap">
            <div className="sec-head">
              <div>
                <span className="eyebrow rv">The Shop</span>
                <h2 className="h-lg rv d1">Ready to <em>ride out.</em></h2>
              </div>
              <p className="rv d2" style={{ maxWidth: 340, color: "var(--ink-2)", fontSize: 15 }}>
                Every piece ships with a lifetime repair tag. Hover for quick add, or open any piece for
                sizing and details.
              </p>
            </div>
            <div className="toolbar">
              <div className="tabs" role="tablist">
                {[["all", "All"], ["Jeans", "Jeans"], ["Jackets", "Jackets"], ["Shirts", "Shirts"], ["Headwear", "Headwear"], ["saved", "Saved ♥"]].map(([k, label]) => (
                  <button
                    key={k}
                    className={`tab${cat === k ? " on" : ""}`}
                    role="tab"
                    aria-selected={cat === k}
                    onClick={() => setCat(k)}
                  >
                    {label}
                  </button>
                ))}
              </div>
              <div className="tools-r">
                <span>{visible.length}{visible.length === 1 ? " piece" : " pieces"}</span>
                <label className="sr" htmlFor="sort">Sort</label>
                <select className="sort" id="sort" value={sort} onChange={(e) => setSort(e.target.value)}>
                  <option value="feat">Featured</option>
                  <option value="lo">Price: low–high</option>
                  <option value="hi">Price: high–low</option>
                </select>
              </div>
            </div>

            <div className="grid">
              {productsLoading ? (
                <div className="empty"><p>Loading the rail…</p></div>
              ) : !visible.length ? (
                <div className="empty">
                  <h3>{cat === "saved" ? "Nothing saved yet." : "No pieces found."}</h3>
                  <p>{cat === "saved" ? "Tap the heart on any piece to save it here." : "Try another category."}</p>
                </div>
              ) : (
                visible.map((p, i) => {
                  const ci = sel[p.id] ?? 0;
                  const color = p.colors[ci] || DEFAULT_COLOR;
                  const saved = wish.includes(p.id);
                  return (
                    <article className="card" key={p.id} style={{ animationDelay: `${i * 50}ms` }}>
                      <div
                        className="media"
                        style={{ background: "radial-gradient(120% 70% at 50% 28%,#f2f1ed 0%,#dddcd6 58%,#c8c7bf 100%)" }}
                        onClick={() => openQV(p)}
                      >
                        {p.badge ? (
                          <span className={`badge${/low/i.test(p.badge) ? " low" : ""}`}>{p.badge}</span>
                        ) : null}
                        <button
                          className={`wish${saved ? " on" : ""}`}
                          aria-label={`Save ${p.name}`}
                          aria-pressed={saved}
                          onClick={(e) => { e.stopPropagation(); toggleWish(p.id); }}
                        >
                          <HeartIcon filled={saved} />
                        </button>
                        <div className="g" dangerouslySetInnerHTML={{ __html: garment(p.type, color) }} />
                        <div className="quick">
                          <small>Quick add — select size</small>
                          <div className="chips">
                            {p.sizes.map((s) => (
                              <button
                                key={s}
                                className="chip"
                                onClick={(e) => { e.stopPropagation(); addToCart(p, ci, s, 1, { openBag: true }); }}
                              >
                                {s}
                              </button>
                            ))}
                          </div>
                        </div>
                      </div>
                      <div className="info">
                        <div className="row">
                          <h3>{p.name}</h3>
                          <span className="price">{money(p.price)}</span>
                        </div>
                        <span className="cat">{p.cat} · {color.name}</span>
                        <div className="sw">
                          {p.colors.map((c, j) => (
                            <button
                              key={j}
                              className={j === ci ? "on" : ""}
                              style={{ background: c.b }}
                              aria-label={c.name}
                              onClick={() => setSel((prev) => ({ ...prev, [p.id]: j }))}
                            />
                          ))}
                        </div>
                      </div>
                    </article>
                  );
                })
              )}
            </div>
          </div>
        </section>

        {/* EDITORIAL */}
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
              <span className="tag">Plate Nº 12 — Dusk on the mesa</span>
            </div>
            <div className="edit-copy">
              <span className="eyebrow rv">From the Journal</span>
              <h2 className="h-lg rv d1">Not made to<br /><em>stay new.</em></h2>
              <p className="drop rv d1">
                Rookford began with a simple idea: a pair of jeans should get better the harder you work
                in them. We found a mill in Kojima still running Toyoda shuttle looms from 1968 and asked
                them to weave slowly, the way it used to be done.
              </p>
              <p className="rv d2">
                Low-tension weaving gives each yard its own uneven, imperfect character. Rope-dyed yarn
                leaves the heart of every thread undyed so that, with wear, the cloth fades from midnight
                to the pale blue of an open sky.
              </p>
              <div className="pull rv d2">“Buy it once. Wear it hard. Bring it back when it needs mending.”</div>
              <a href="#journal" className="link rv d3" onClick={(e) => { e.preventDefault(); goTo("#journal"); }}>
                Read the story <span className="arrow">→</span>
              </a>
            </div>
          </div>
        </section>

        {/* FADE */}
        <section className="fade" id="fade">
          <div className="wrap fade-grid">
            <div className="fade-stage rv">
              <div dangerouslySetInnerHTML={{ __html: fadeSvg }} />
            </div>
            <div className="fade-copy">
              <span className="eyebrow rv">The Fade Guide</span>
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
              <div style={{ marginTop: 36 }}>
                <a href="#shop" className="btn light" onClick={(e) => { e.preventDefault(); goTo("#shop", "Jeans"); }}>
                  Start your fade <span className="arrow">→</span>
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* LOOKBOOK */}
        <section className="look" id="lookbook">
          <div className="wrap">
            <div className="sec-head">
              <div>
                <span className="eyebrow rv">Lookbook</span>
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
              { n: "01", bg: "linear-gradient(170deg,#444e5a,#1b2027)", h: "First light, Marfa", p: "Raw straight jeans with the Marshal chore coat.", fill: "#0a111d", d: "M0 120V70h50l8-24h40l8 24h60l8-40h60l8 40h58v50z" },
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

        {/* CRAFT */}
        <section className="craft" id="craft">
          <div className="wrap">
            <div className="sec-head">
              <div>
                <span className="eyebrow rv">The Craft</span>
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

        {/* JOURNAL */}
        <section id="journal">
          <div className="wrap">
            <div className="sec-head">
              <div>
                <span className="eyebrow rv">The Journal</span>
                <h2 className="h-lg rv d1">Stories, <em>stitched.</em></h2>
              </div>
              <a href="#" className="link rv" onClick={(e) => e.preventDefault()}>
                All stories <span className="arrow">→</span>
              </a>
            </div>
            {posts.length ? (
              <div className="jgrid">
                {posts.map((post, i) => (
                  <article className={`post rv${i ? " d" + i : ""}`} key={post.id ?? i}>
                    <div className="pic">
                      <div style={{ background: post.cover || "linear-gradient(160deg,#4b5561,#1b2027)" }} />
                    </div>
                    {post.meta ? <span className="meta">{post.meta}</span> : null}
                    <h3>{post.title || post.name}</h3>
                    {post.excerpt ? <p>{post.excerpt}</p> : null}
                  </article>
                ))}
              </div>
            ) : (
              <div className="empty"><p>Stories are on their way from the workshop.</p></div>
            )}
          </div>
        </section>

        {/* REVIEWS */}
        {reviews.length > 0 && (
          <section className="rev">
            <div className="wrap">
              <div className="stars rv">★ ★ ★ ★ ★</div>
              <blockquote className="rv">“{reviews[revIdx]?.quote || ""}”</blockquote>
              <cite>{reviews[revIdx]?.author || ""}</cite>
              <div className="dots">
                {reviews.map((_, k) => (
                  <button
                    key={k}
                    className={k === revIdx ? "on" : ""}
                    aria-label={`Review ${k + 1}`}
                    onClick={() => setRevIdx(k)}
                  />
                ))}
              </div>
            </div>
          </section>
        )}

        {/* NEWSLETTER */}
        <section className="news">
          <div className="wrap">
            <span className="eyebrow rv">The Dispatch</span>
            <h2 className="h-lg rv d1">Letters from the <em>loom.</em></h2>
            <p className="rv d2">
              New bolts, quiet restocks and the occasional story. Join and get 10% off your first order
              with code <b>WEST10</b>.
            </p>
            <form className="nform rv d3" onSubmit={onSubscribe} noValidate>
              <input
                type="email"
                placeholder="Your email address"
                aria-label="Email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              <button type="submit">Subscribe →</button>
            </form>
            <div className="nmsg" aria-live="polite">{newsMsg}</div>
          </div>
        </section>
      </main>

      {/* FOOTER */}
      <footer>
        <div className="wrap">
          <div className="f-top">
            <div>
              {logoNode}
              <p>
                Selvedge denim woven in Kojima and finished by hand in SoHo. Made to be worn, mended and
                handed down.
              </p>
            </div>
            <div className="f-col">
              <h5>Shop</h5>
              <a href="#shop" onClick={(e) => { e.preventDefault(); goTo("#shop", "Jeans"); }}>Jeans</a>
              <a href="#shop" onClick={(e) => { e.preventDefault(); goTo("#shop", "Jackets"); }}>Jackets</a>
              <a href="#shop" onClick={(e) => { e.preventDefault(); goTo("#shop", "Shirts"); }}>Shirts</a>
              <a href="#shop" onClick={(e) => { e.preventDefault(); goTo("#shop", "Headwear"); }}>Headwear</a>
            </div>
            <div className="f-col">
              <h5>Care</h5>
              <a href="#fade" onClick={(e) => { e.preventDefault(); goTo("#fade"); }}>Fade guide</a>
              <a href="#craft" onClick={(e) => { e.preventDefault(); goTo("#craft"); }}>Hemming</a>
              <a href="#craft" onClick={(e) => { e.preventDefault(); goTo("#craft"); }}>Repairs</a>
              <a href="#journal" onClick={(e) => { e.preventDefault(); goTo("#journal"); }}>Washing</a>
            </div>
            <div className="f-col">
              <h5>Company</h5>
              <a href="#craft" onClick={(e) => { e.preventDefault(); goTo("#craft"); }}>Our craft</a>
              <a href="#journal" onClick={(e) => { e.preventDefault(); goTo("#journal"); }}>Journal</a>
              <a href="#lookbook" onClick={(e) => { e.preventDefault(); goTo("#lookbook"); }}>Lookbook</a>
              <a href="#admin" onClick={(e) => { e.preventDefault(); window.location.hash = "admin"; setRoute("admin"); }}>
                Admin
              </a>
            </div>
          </div>
          <div className="f-bot">
            <span>© 2026 Rookford Frontier Denim Co.</span>
            <span>Woven in Kojima · Finished in SoHo</span>
          </div>
        </div>
      </footer>
      <div className="rope" aria-hidden="true" />

      {/* OVERLAYS */}
      <div className={`scrim${bagOpen || qv || searchOpen || checkoutOpen ? " on" : ""}`} onClick={closeAll} />

      {/* BAG DRAWER */}
      <aside className={`drawer${bagOpen ? " on" : ""}`} aria-label="Shopping bag" aria-hidden={!bagOpen}>
        <div className="d-head">
          <h3>
            Your bag <span style={{ fontSize: 15, color: "var(--ink-2)" }}>
              {cart.length ? `(${cart.reduce((a, l) => a + l.qty, 0)})` : ""}
            </span>
          </h3>
          <button className="ico" aria-label="Close bag" onClick={() => setBagOpen(false)}>
            <svg viewBox="0 0 24 24"><path d="M5 5l14 14M19 5 5 19" /></svg>
          </button>
        </div>
        <div className="ship">
          {cart.length
            ? (totals.tot >= FREE_SHIPPING
                ? <b>You’ve unlocked free worldwide shipping</b>
                : <>You’re <b>{money(FREE_SHIPPING - totals.tot)}</b> away from free shipping</>)
            : <>Free worldwide shipping over {money(FREE_SHIPPING)}</>}
          <div className="bar">
            <i style={{ width: `${Math.min(100, (totals.tot / FREE_SHIPPING) * 100)}%` }} />
          </div>
        </div>
        <div className="d-body">
          {!cart.length ? (
            <div className="d-empty">
              <div className="h-md">Your bag is empty.</div>
              <p>Good denim is worth the wait. Let’s find yours.</p>
              <div style={{ marginTop: 28 }}>
                <button className="btn solid" onClick={() => { setBagOpen(false); goTo("#shop"); }}>
                  Start shopping <span className="arrow">→</span>
                </button>
              </div>
            </div>
          ) : (
            cart.map((l, i) => (
              <div className="line" key={l.key}>
                <div className="th" dangerouslySetInnerHTML={{ __html: garment(l.type, l.color) }} />
                <div>
                  <h4>{l.name}</h4>
                  <div className="sub">{l.color.name} · Size {l.size}{l.ins ? " · Inseam " + l.ins : ""}</div>
                  {l.note ? <div className="lnote">“{l.note}”</div> : null}
                  <div className="lr">
                    <div>
                      <span className="qty">
                        <button aria-label="Decrease" onClick={() => updateQty(i, -1)}>–</button>
                        <span>{l.qty}</span>
                        <button aria-label="Increase" onClick={() => updateQty(i, 1)}>+</button>
                      </span>
                      <button className="rm" onClick={() => removeLine(i)}>Remove</button>
                    </div>
                    <b>{money(l.price * l.qty)}</b>
                  </div>
                  <LineNote value={l.note} onChange={(v) => setLineNote(i, v)} />
                </div>
              </div>
            ))
          )}
        </div>
        {cart.length > 0 && (
          <div className="d-foot">
            <div className="promo">
              <input
                placeholder="Promo code"
                aria-label="Promo code"
                value={promoInput}
                onChange={(e) => setPromoInput(e.target.value)}
              />
              <button onClick={applyPromo}>Apply</button>
            </div>
            <div className="tot"><span>Subtotal</span><span>{money(totals.sub)}</span></div>
            {totals.disc > 0 && (
              <div className="tot"><span>WEST10 (−10%)</span><span>−{money(totals.disc)}</span></div>
            )}
            <div className="tot">
              <span>Shipping</span>
              <span>{totals.tot >= FREE_SHIPPING ? "Free" : "Calculated at checkout"}</span>
            </div>
            <div className="tot big"><span>Total</span><span>{money(totals.tot)}</span></div>
            <button className="btn solid" onClick={openCheckout}>
              Checkout <span className="arrow">→</span>
            </button>
            <small>Chainstitch hemming included. Duties handled for you.</small>
          </div>
        )}
      </aside>

      {/* QUICK VIEW */}
      <div className={`modal${qv ? " on" : ""}`} role="dialog" aria-modal="true" aria-label="Product details">
        <div className="m-box" ref={qvBoxRef} onPointerMove={onQvMove} onPointerLeave={onQvLeave}>
          {qv && (
            <>
              <button
                className="ico m-x"
                aria-label="Close"
                onClick={() => setQv(null)}
                style={{ position: "absolute", top: 10, right: 10, zIndex: 3, background: "var(--cream)" }}
              >
                <svg viewBox="0 0 24 24"><path d="M5 5l14 14M19 5 5 19" /></svg>
              </button>
              <div className="m-media">
                <div dangerouslySetInnerHTML={{ __html: garment(qv.product.type, qv.product.colors[qv.ci] || DEFAULT_COLOR) }} />
                <span className="m-hint">Move your cursor to rotate · 3D preview</span>
              </div>
              <div className="m-info">
                <div>
                  <span className="eyebrow">{qv.product.cat}{qv.product.badge ? " · " + qv.product.badge : ""}</span>
                  <h2 style={{ marginTop: 10 }}>{qv.product.name}</h2>
                </div>
                <div className="price">{money(qv.product.price * qv.qty)}</div>
                {qv.product.desc ? <p className="desc">{qv.product.desc}</p> : null}
                <div>
                  <div className="lbl"><span>Colour — {(qv.product.colors[qv.ci] || DEFAULT_COLOR).name}</span></div>
                  <div className="sw" style={{ margin: 0, gap: 12 }}>
                    {qv.product.colors.map((c, j) => (
                      <button
                        key={j}
                        className={j === qv.ci ? "on" : ""}
                        style={{ background: c.b, width: 24, height: 24 }}
                        aria-label={c.name}
                        onClick={() => { setQv((s) => ({ ...s, ci: j })); setSel((prev) => ({ ...prev, [qv.product.id]: j })); }}
                      />
                    ))}
                  </div>
                </div>
                <div>
                  <div className={`lbl${qv.sizeError ? " err shake" : ""}`}>
                    <span>{qv.sizeError ? "Please select a size" : "Size"}</span>
                    <a onClick={() => toast(qv.product.type === "jeans"
                      ? "Waist in inches. Raw denim shrinks ~3–4% — buy true to size."
                      : "Size down for a closer fit; true to size for layering.")}>Size guide</a>
                  </div>
                  <div className="chips">
                    {qv.product.sizes.map((z) => (
                      <button
                        key={z}
                        className={`chip${z === qv.size ? " on" : ""}`}
                        onClick={() => setQv((s) => ({ ...s, size: z, sizeError: false }))}
                      >
                        {z}
                      </button>
                    ))}
                  </div>
                </div>
                {qv.product.type === "jeans" && (
                  <div>
                    <div className="lbl"><span>Inseam — free chainstitch hem</span></div>
                    <div className="chips">
                      {INS.map((z) => (
                        <button key={z} className={`chip${z === qv.ins ? " on" : ""}`} onClick={() => setQv((s) => ({ ...s, ins: z }))}>
                          {z}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
                <div>
                  <div className="lbl">
                    <span>Special request <span style={{ textTransform: "none", letterSpacing: 0, color: "var(--ink-2)" }}>(optional)</span></span>
                  </div>
                  <input
                    className="qnote"
                    maxLength={120}
                    placeholder="Hem length, monogram, patch placement…"
                    value={qv.note}
                    onChange={(e) => setQv((s) => ({ ...s, note: e.target.value }))}
                  />
                </div>
                <div className="m-act">
                  <span className="qty" style={{ alignSelf: "stretch" }}>
                    <button aria-label="Decrease" onClick={() => setQv((s) => ({ ...s, qty: Math.max(1, s.qty - 1) }))}>–</button>
                    <span style={{ display: "grid", placeItems: "center" }}>{qv.qty}</span>
                    <button aria-label="Increase" onClick={() => setQv((s) => ({ ...s, qty: Math.min(9, s.qty + 1) }))}>+</button>
                  </span>
                  <button
                    className="btn solid"
                    onClick={() => {
                      if (!qv.size) { setQv((s) => ({ ...s, sizeError: true })); return; }
                      addToCart(qv.product, qv.ci, qv.size, qv.qty, { ins: qv.ins, note: qv.note });
                      setQv(null);
                      setBagOpen(true);
                    }}
                  >
                    Add to bag — {money(qv.product.price * qv.qty)}
                  </button>
                  <button
                    className="ico"
                    aria-label="Save"
                    style={{ border: "1px solid var(--line)" }}
                    onClick={() => toggleWish(qv.product.id)}
                  >
                    <HeartIcon filled={wish.includes(qv.product.id)} />
                  </button>
                </div>
                <div>
                  {qv.product.fabric && <details open><summary>Fabric</summary><p>{qv.product.fabric}</p></details>}
                  {qv.product.fit && <details><summary>Fit</summary><p>{qv.product.fit}</p></details>}
                  <details>
                    <summary>Shipping &amp; care</summary>
                    <p>Free worldwide over {money(FREE_SHIPPING)}. Free 30-day returns. Free chainstitch hemming and lifetime repairs.</p>
                  </details>
                </div>
              </div>
            </>
          )}
        </div>
      </div>

      {/* SEARCH */}
      <div className={`search${searchOpen ? " on" : ""}`} role="dialog" aria-label="Search">
        <button className="ico x" aria-label="Close search" onClick={() => setSearchOpen(false)}>
          <svg viewBox="0 0 24 24"><path d="M5 5l14 14M19 5 5 19" /></svg>
        </button>
        <div className="wrap">
          <input
            type="search"
            placeholder="Search jeans, jackets, hats…"
            autoComplete="off"
            aria-label="Search products"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            autoFocus
          />
          <div className="sugg">
            <span>Try</span>
            {["Raw indigo", "Chore", "Black", "Hat"].map((s) => (
              <button key={s} onClick={() => setQuery(s)}>{s}</button>
            ))}
          </div>
          <div className="s-res">
            {searchResults.length ? (
              searchResults.map((p) => (
                <button className="s-hit" key={p.id} onClick={() => { setSearchOpen(false); setTimeout(() => openQV(p), 200); }}>
                  <div className="t" dangerouslySetInnerHTML={{ __html: garment(p.type, p.colors[0] || DEFAULT_COLOR) }} />
                  <div><b>{p.name}</b><span>{p.cat} · {money(p.price)}</span></div>
                </button>
              ))
            ) : (
              <p style={{ color: "var(--ink-2)" }}>Nothing found for “{query}”.</p>
            )}
          </div>
        </div>
      </div>

      {/* CHECKOUT */}
      <Checkout
        open={checkoutOpen}
        cart={cart}
        totals={totals}
        onClose={() => { setCheckoutOpen(false); goTo("#shop"); }}
        onEditBag={() => { setCheckoutOpen(false); setBagOpen(true); }}
      />

      {/* TOAST */}
      <div className={`toast${toastState.on ? " on" : ""}`} role="status">
        <span>{toastState.msg}</span>
        {toastState.showBtn && <button onClick={openBag}>View bag</button>}
      </div>

      {/* BACK TO TOP */}
      <button
        className={`totop${showTop ? " on" : ""}`}
        aria-label="Back to top"
        onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
      >
        <svg viewBox="0 0 24 24"><path d="M12 19V5M5 12l7-7 7 7" /></svg>
      </button>
    </div>
  );
}