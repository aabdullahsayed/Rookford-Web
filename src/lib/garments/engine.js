

let GU = 0;
export const hx = (h) => [1, 3, 5].map((i) => parseInt(h.slice(i, i + 2), 16));
export const toHex = (a) => "#" + a.map((v) => Math.max(0, Math.min(255, Math.round(v))).toString(16).padStart(2, "0")).join("");
export const shade = (h, t) => (t < 0 ? toHex(hx(h).map((v) => v * (1 + t))) : toHex(hx(h).map((v) => v + (255 - v) * t)));
export const stops = (a, c) => a.map((x) => `<stop offset="${x[0]}" stop-color="${c}" stop-opacity="${x[1]}"/>`).join("");
export const stitchP = (d, s, w) =>
  `<path d="${d}" transform="translate(.5 .9)" fill="none" stroke="#000" stroke-opacity=".38" stroke-width="${w || 1.5}" stroke-dasharray="3.6 3" stroke-linecap="round"/><path d="${d}" fill="none" stroke="${s}" stroke-width="${w || 1.5}" stroke-dasharray="3.6 3" stroke-linecap="round"/>`;
export const rivet = (u, x, y, r) =>
  `<circle cx="${x + 0.5}" cy="${y + 1}" r="${r + 0.7}" fill="#000" opacity=".32"/><circle cx="${x}" cy="${y}" r="${r}" fill="url(#rv${u})"/><circle cx="${x - r * 0.3}" cy="${y - r * 0.35}" r="${r * 0.28}" fill="#fff" opacity=".6"/>`;
export const pearl = (u, x, y, r) =>
  `<circle cx="${x + 0.4}" cy="${y + 0.9}" r="${r + 0.5}" fill="#000" opacity=".3"/><circle cx="${x}" cy="${y}" r="${r}" fill="url(#pl${u})"/><circle cx="${x}" cy="${y}" r="${r * 0.55}" fill="none" stroke="#000" stroke-opacity=".18" stroke-width=".7"/>`;

export function wrapG(o) {
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

export const hanger = (u) =>
  `<path d="M100 -9C104 -9 107 -6 107 -2C107 3 102 4 100 9" fill="none" stroke="#6d7279" stroke-width="2.4" stroke-linecap="round"/><path d="M100 8L10 52Q7 54 7 57V59L100 16L193 59V57Q193 54 190 52Z" fill="url(#wd${u})"/><path d="M100 8L10 52" stroke="#fff" stroke-opacity=".28" fill="none"/>`;
