export default `

/* ====================================================================
   1. NEW ERP SHELL (SIDEBAR, TOPBAR, MOBILE BOTTOM NAV)
   ==================================================================== */

.erp-shell {
  display: flex;
  min-height: 100vh;
  background: var(--paper);
}

/* --- DESKTOP SIDEBAR --- */
.erp-side {
  width: 260px;
  background: var(--indigo);
  color: var(--paper);
  display: flex;
  flex-direction: column;
  padding: 24px;
  border-right: 1px solid rgba(255,255,255,0.05);
}

.erp-brand {
  font-family: var(--brand);
  font-size: 20px;
  letter-spacing: .06em;
  margin-bottom: 40px;
  display: flex;
  align-items: center;
  gap: 8px;
}
.erp-brand span {
  font-family: var(--sans);
  font-size: 10px;
  text-transform: uppercase;
  letter-spacing: .1em;
  background: rgba(255,255,255,0.1);
  padding: 4px 8px;
  border-radius: 4px;
  color: var(--saddle);
}

.erp-nav {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.erp-nav button, .erp-link {
  display: flex;
  align-items: center;
  gap: 12px;
  width: 100%;
  padding: 12px 16px;
  border-radius: 8px;
  font-size: 13px;
  font-weight: 500;
  color: rgba(234,232,227,0.6);
  text-align: left;
  transition: all .2s var(--ease-smooth);
}
.erp-nav button svg, .erp-link svg {
  width: 18px; height: 18px;
  opacity: 0.7;
}

.erp-nav button:hover, .erp-link:hover {
  background: rgba(255,255,255,0.05);
  color: var(--paper);
}

.erp-nav button.on {
  background: var(--saddle);
  color: #fff;
}
.erp-nav button.on svg { opacity: 1; }

.erp-side-bottom {
  margin-top: auto;
  display: flex;
  flex-direction: column;
  gap: 4px;
  border-top: 1px solid rgba(255,255,255,0.1);
  padding-top: 16px;
}

/* --- MAIN CONTENT AREA --- */
.erp-main {
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.erp-topbar {
  height: 72px;
  background: var(--cream);
  border-bottom: 1px solid var(--line);
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 32px;
}

.erp-page-title {
  font-family: var(--display);
  font-size: 24px;
  text-transform: uppercase;
  letter-spacing: -.01em;
  color: var(--ink);
}

.erp-avatar {
  width: 32px; height: 32px;
  background: var(--ink);
  color: var(--paper);
  border-radius: 50%;
  display: grid;
  place-items: center;
  font-size: 14px;
  font-weight: 600;
}

.erp-content {
  padding: 32px;
  overflow-y: auto;
  flex: 1;
}

/* --- DASHBOARD CARDS --- */
.erp-dashboard {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 24px;
  margin-bottom: 32px;
}
.erp-card {
  background: var(--cream);
  border: 1px solid var(--line);
  padding: 24px;
  border-radius: 12px;
  display: flex;
  flex-direction: column;
  gap: 8px;
}
.erp-card span {
  font-size: 11px;
  text-transform: uppercase;
  letter-spacing: .1em;
  color: var(--ink-2);
}
.erp-card b {
  font-family: var(--display);
  font-size: 32px;
  color: var(--ink);
  line-height: 1;
}
.erp-card small {
  font-size: 12px;
  color: var(--ink-2);
}
.erp-card small.up { color: #2e7d32; }

/* --- MOBILE BOTTOM NAVIGATION --- */
.erp-bottom-nav {
  display: none; /* Hidden on desktop */
}


/* ====================================================================
   2. RESPONSIVE (TABLET & MOBILE)
   ==================================================================== */

@media (max-width: 900px) {
  /* Hide Desktop Sidebar */
  .erp-side { display: none; }
  
  /* Make room for bottom nav */
  .erp-content { padding: 20px 16px 100px 16px; }
  
  .erp-topbar { height: 60px; padding: 0 20px; }
  .erp-page-title { font-size: 20px; }

  .erp-dashboard {
    grid-template-columns: 1fr; /* Stack dashboard cards */
    gap: 16px;
  }

  /* SHOW MOBILE BOTTOM NAV */
  .erp-bottom-nav {
    display: flex;
    position: fixed;
    bottom: 0; left: 0; right: 0;
    background: rgba(244, 242, 237, 0.95);
    backdrop-filter: blur(16px);
    -webkit-backdrop-filter: blur(16px);
    border-top: 1px solid var(--line);
    z-index: 100;
    padding-bottom: env(safe-area-inset-bottom); /* iOS safe area */
  }

  .erp-bottom-nav button {
    flex: 1;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 6px;
    padding: 12px 0;
    color: var(--ink-2);
    font-size: 10px;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: .08em;
    transition: color .2s;
  }

  .erp-bottom-nav button svg {
    width: 22px; height: 22px;
    stroke-width: 1.5;
  }

  .erp-bottom-nav button.on { color: var(--ink); }
  .erp-bottom-nav button.on svg { stroke: var(--saddle); }
}


/* ====================================================================
   3. EXISTING INNER PAGES (LOGIN, TABLES, FORMS)
   ==================================================================== */

.admin-head{display:flex;justify-content:space-between;align-items:center;gap:16px;margin-bottom:28px;flex-wrap:wrap}
.admin-h1{font-family:var(--display);font-size:clamp(28px,4vw,44px);font-weight:700;text-transform:uppercase;line-height:1;letter-spacing:-.01em}
.admin-table{width:100%;border-collapse:collapse;background:var(--cream);border:1px solid var(--line)}
.admin-table th,.admin-table td{padding:14px 16px;text-align:left;border-bottom:1px solid var(--line);font-size:13px}
.admin-table th{background:var(--paper-2);font-size:10.5px;letter-spacing:.16em;text-transform:uppercase;font-weight:600}
.admin-table tr:hover td{background:var(--paper)}

@media(max-width:760px){
  .admin-table{font-size:12px}
  .admin-table th,.admin-table td{padding:10px 8px}
  .admin-table th:nth-child(n+4),.admin-table td:nth-child(n+4){display:none}
}

.admin-empty{padding:64px 20px;text-align:center;color:var(--ink-2);background:var(--cream);border:1px solid var(--line)}
.admin-form{background:var(--cream);border:1px solid var(--line);padding:clamp(20px,3vw,36px);display:grid;gap:18px}
.admin-form .fgrid{display:grid;grid-template-columns:repeat(2,1fr);gap:16px}
@media(max-width:640px){.admin-form .fgrid{grid-template-columns:1fr}}
.admin-form .fld{display:flex;flex-direction:column;gap:6px}
.admin-form label{font-size:10.5px;letter-spacing:.16em;text-transform:uppercase;font-weight:600;color:var(--ink-2)}
.admin-form input,.admin-form select,.admin-form textarea{width:100%;padding:11px 14px;font:inherit;font-size:16px;border:1px solid var(--line);background:var(--paper);outline:0;transition:border-color .3s var(--ease-smooth)}
.admin-form input:focus,.admin-form select:focus,.admin-form textarea:focus{border-color:var(--ink)}
.admin-badge{
  display:inline-block;padding:4px 12px;font-size:10px;letter-spacing:.14em;
  text-transform:uppercase;background:var(--line);color:var(--ink);border-radius:12px;font-weight:600;
}
.admin-actions{display:flex;gap:10px;flex-wrap:wrap}

/* LOGIN SCREEN */
.admin-login{min-height:100vh;display:grid;place-items:center;padding:40px 20px;background:radial-gradient(ellipse at top,#1a1f26,#0e1218)}
.admin-login-card{
  width:100%;max-width:400px;background:var(--cream);
  padding:clamp(28px,5vw,44px);box-shadow:0 40px 100px -40px rgba(0,0,0,.6);
}
.admin-brand{
  font-family:var(--brand);font-weight:700;font-size:24px;letter-spacing:.06em;
  text-indent:.06em;text-align:center;text-transform:uppercase;color:var(--ink);
}
.admin-kicker{
  font-size:10px;letter-spacing:.42em;text-transform:uppercase;
  color:var(--saddle-d);text-align:center;margin:8px 0 24px;font-weight:600;
}
.admin-login-card h1{font-family:var(--display);font-size:32px;font-weight:700;text-transform:uppercase;text-align:center;margin-bottom:8px;letter-spacing:-.01em}
.admin-sub{font-size:13px;color:var(--ink-2);text-align:center;margin-bottom:28px;line-height:1.6}
.admin-login-card .fld{display:flex;flex-direction:column;gap:8px;margin-bottom:16px}
.admin-login-card label{font-size:10.5px;letter-spacing:.16em;text-transform:uppercase;color:var(--ink-2);font-weight:600}
.admin-login-card input{padding:13px 14px;border:1px solid var(--line);background:var(--paper);font:inherit;font-size:16px;transition:border-color .3s var(--ease-smooth)}
.admin-login-card input:focus{outline:0;border-color:var(--ink)}
.admin-err{background:#f5e6e2;color:var(--rust);padding:12px 16px;font-size:13px;margin-bottom:16px;border:1px solid #e5c5bd}
.admin-hint{text-align:center;margin-top:18px;font-size:11px;color:var(--ink-2)}

`;