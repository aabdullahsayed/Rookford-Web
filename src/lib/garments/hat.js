import { stitchP, wrapG } from "./engine";

export function hat(col) {
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
