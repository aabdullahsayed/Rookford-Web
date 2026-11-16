import { hanger, pearl, shade, stitchP, wrapG } from "./engine";

const SHOUT =
  "M72 26C82 34 90 38 100 38C110 38 118 34 128 26L168 46C174 56 180 120 185 192L158 198C155 160 151 130 150 100C150 150 150 205 148 250L52 250C50 205 50 150 50 100C49 130 45 160 42 198L15 192C20 120 26 56 32 46Z";

export function shirt(col) {
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
