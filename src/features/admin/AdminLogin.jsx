import React, { useState } from "react";
import { API } from "../../lib/api";

export function AdminLogin({ onLogin, onExit }) {
  const [email, setEmail] = useState("admin@rookford.com");
  const [pw, setPw] = useState("");
  const [err, setErr] = useState("");
  const [busy, setBusy] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    setBusy(true);
    setErr("");
    try {
      const res = await fetch(API.adminLogin, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password: pw }),
      });
      if (!res.ok) throw new Error("Invalid credentials");
      const data = await res.json();
      onLogin(data.token || data.accessToken || "demo-token");
    } catch {
      if (email === "admin@rookford.com" && pw === "admin") onLogin("demo-token");
      else setErr("Invalid email or password");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="admin-login">
      <form className="admin-login-card" onSubmit={submit}>
        <div className="admin-brand">ROOKFORD</div>
        <p className="admin-kicker">Admin Console</p>
        <h1>Sign in</h1>
        <p className="admin-sub">Manage products, orders and the shop.</p>
        {err && <div className="admin-err">{err}</div>}
        <div className="fld">
          <label>Email</label>
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
        </div>
        <div className="fld">
          <label>Password</label>
          <input type="password" value={pw} onChange={(e) => setPw(e.target.value)} required />
        </div>
        <button className="btn solid" type="submit" disabled={busy} style={{ width: "100%", justifyContent: "center", marginTop: 8 }}>
          {busy ? "Signing in…" : "Sign in →"}
        </button>
        <div style={{ textAlign: "center", marginTop: 18 }}>
          <button type="button" className="link" onClick={onExit}>← Back to store</button>
        </div>
        <div className="admin-hint">Demo: admin@rookford.com / admin</div>
      </form>
    </div>
  );
}
