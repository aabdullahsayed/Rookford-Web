import { hanger, rivet, shade, stitchP, wrapG } from "./engine";

const JKOUT =
  "M70 26C82 34 90 40 100 40C110 40 118 34 130 26L172 48C180 60 186 140 192 212L163 219C158 180 154 140 152 112C152 150 152 200 150 244L50 244C48 200 48 150 48 112C46 140 42 180 37 219L8 212C14 140 20 60 28 48Z";

export function jacket(col) {
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
