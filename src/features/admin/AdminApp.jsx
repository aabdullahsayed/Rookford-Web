import React, { useState } from "react";
import { AdminLogin } from "./AdminLogin";
import { AdminOrders } from "./AdminOrders";
import { AdminProducts } from "./AdminProducts";
import { store } from "../../lib/helpers";

export function AdminApp({ onExit }) {
  const [token, setToken] = useState(() => store.get("rf_admin_token", ""));
  const [view, setView] = useState("dashboard");

  // 💡 Add state for your dashboard stats (currently empty/zero)
  const [stats, setStats] = useState({
    revenue: 0,
    orders: 0,
    products: 0
  });

  if (!token) {
    return (
      <AdminLogin
        onLogin={(t) => { setToken(t); store.set("rf_admin_token", t); }}
        onExit={onExit}
      />
    );
  }

  // --- Minimalist ERP Icons ---
  const IconDashboard = () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/></svg>;
  const IconProducts = () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/><polyline points="3.27 6.96 12 12.01 20.73 6.96"/><line x1="12" y1="22.08" x2="12" y2="12"/></svg>;
  const IconOrders = () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/></svg>;
  const IconExit = () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>;
  const IconLogout = () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M18.36 6.64a9 9 0 1 1-12.73 0"/><line x1="12" y1="2" x2="12" y2="12"/></svg>;

  return (
    <div className="erp-shell">
      
      {/* DESKTOP SIDEBAR */}
      <aside className="erp-side">
        <div className="erp-brand">
          ROOKFORD <span>Admin</span>
        </div>
        
        <nav className="erp-nav">
          <button className={view === "dashboard" ? "on" : ""} onClick={() => setView("dashboard")}>
            <IconDashboard /> Dashboard
          </button>
          <button className={view === "products" ? "on" : ""} onClick={() => setView("products")}>
            <IconProducts /> Products
          </button>
          <button className={view === "orders" ? "on" : ""} onClick={() => setView("orders")}>
            <IconOrders /> Orders
          </button>
        </nav>

        <div className="erp-side-bottom">
          <button className="erp-link" onClick={onExit}>
            <IconExit /> Back to Store
          </button>
          <button className="erp-link" onClick={() => { setToken(""); store.set("rf_admin_token", ""); }}>
            <IconLogout /> Sign Out
          </button>
        </div>
      </aside>

      {/* MAIN CONTENT AREA */}
      <main className="erp-main">
        <header className="erp-topbar">
          <h1 className="erp-page-title">
            {view === "dashboard" && "Overview"}
            {view === "products" && "Inventory"}
            {view === "orders" && "Orders"}
          </h1>
          <div className="erp-user">
            <span className="erp-avatar">A</span>
          </div>
        </header>

        <div className="erp-content">
          {view === "dashboard" && (
            <div className="erp-dashboard">
              <div className="erp-card">
                <span>Total Revenue</span>
                {/* 💡 Fixed: Using dynamic state instead of hardcoded $12,450 */}
                <b>{stats.revenue > 0 ? `$${stats.revenue.toLocaleString()}` : "—"}</b>
                <small className="up">Waiting for data</small>
              </div>
              <div className="erp-card">
                <span>Orders</span>
                {/* 💡 Fixed: Using dynamic state instead of hardcoded 84 */}
                <b>{stats.orders > 0 ? stats.orders : "—"}</b>
                <small className="up">Waiting for data</small>
              </div>
              <div className="erp-card">
                <span>Active Products</span>
                {/* 💡 Fixed: Using dynamic state instead of hardcoded 24 */}
                <b>{stats.products > 0 ? stats.products : "—"}</b>
                <small>Waiting for data</small>
              </div>
            </div>
          )}

          {view === "products" && <AdminProducts token={token} />}
          {view === "orders" && <AdminOrders />}
        </div>
      </main>

      {/* MOBILE BOTTOM NAVIGATION */}
      <nav className="erp-bottom-nav">
        <button className={view === "dashboard" ? "on" : ""} onClick={() => setView("dashboard")}>
          <IconDashboard /> <span>Home</span>
        </button>
        <button className={view === "products" ? "on" : ""} onClick={() => setView("products")}>
          <IconProducts /> <span>Products</span>
        </button>
        <button className={view === "orders" ? "on" : ""} onClick={() => setView("orders")}>
          <IconOrders /> <span>Orders</span>
        </button>
      </nav>

    </div>
  );
}