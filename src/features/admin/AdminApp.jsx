import React, { useState } from "react";
import { AdminLogin } from "./AdminLogin";
import { AdminOrders } from "./AdminOrders";
import { AdminProducts } from "./AdminProducts";
import { store } from "../../lib/helpers";

export function AdminApp({ onExit }) {
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
