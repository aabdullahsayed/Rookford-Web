import React, { useEffect, useState } from "react";
import { AdminProductForm } from "./AdminProductForm";
import { API, getJSON } from "../../lib/api";
import { money, normalizeProduct } from "../../lib/helpers";

export function AdminProducts({ token }) {
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
