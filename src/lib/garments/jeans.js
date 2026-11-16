import { rivet, shade, stitchP, wrapG } from "./engine";

const JOUT =
  "M52 14H148C152 40 156 62 157 92C159 150 164 222 164 272L109 272C107 222 103 166 100 120C97 166 93 222 91 272L36 272C36 222 41 150 43 92C44 62 48 40 52 14Z";

export function jeans(col, extra) {
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
