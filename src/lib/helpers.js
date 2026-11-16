

/* ====================================================================
   HELPERS
   ==================================================================== */
export const money = (n) => "$" + (Math.round(n * 100) / 100).toFixed(n % 1 ? 2 : 0);
export const esc = (s) =>
  String(s == null ? "" : s).replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));

export const store = {
  get(k, d) { try { const v = localStorage.getItem(k); return v ? JSON.parse(v) : d; } catch { return d; } },
  set(k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch {} },
};

export const DEFAULT_COLOR = { name: "Natural", b: "#222c3a", s: "#c79a62" };
export const GARMENT_TYPES = ["jeans", "jacket", "shirt", "hat"];

export function guessType(cat = "") {
  const c = String(cat).toLowerCase();
  if (c.includes("jean") || c.includes("denim")) return "jeans";
  if (c.includes("jacket") || c.includes("coat") || c.includes("outer")) return "jacket";
  if (c.includes("shirt")) return "shirt";
  if (c.includes("hat") || c.includes("head")) return "hat";
  return "jeans";
}

export function normalizeProduct(p, i) {
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
