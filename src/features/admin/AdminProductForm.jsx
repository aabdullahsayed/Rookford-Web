import React, { useState } from "react";

export function AdminProductForm({ product, onSave, onCancel }) {
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
