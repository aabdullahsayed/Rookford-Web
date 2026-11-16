import React, { useEffect, useState } from "react";
import { API, getJSON } from "../../lib/api";
import { money } from "../../lib/helpers";

export function AdminOrders() {
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
