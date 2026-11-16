export default `/* ============ ADMIN ============ */
.admin-shell{min-height:100vh;display:grid;grid-template-columns:240px 1fr;background:var(--paper)}
@media(max-width:900px){.admin-shell{grid-template-columns:1fr}}
.admin-side{background:var(--ink);color:var(--paper);padding:26px;display:flex;flex-direction:column;gap:14px}
.admin-brand-side{font-family:var(--display);font-weight:700;font-size:22px;letter-spacing:.3em;line-height:1;text-transform:uppercase}
.admin-tag{font-family:var(--sans);font-size:10px;letter-spacing:.4em;color:var(--saddle);text-transform:uppercase;font-weight:600}
.admin-nav{display:flex;flex-direction:column;gap:2px;margin-top:16px}
.admin-nav button{
  text-align:left;padding:12px 16px;color:rgba(234,232,227,.7);font-size:11.5px;
  letter-spacing:.14em;text-transform:uppercase;border-left:2px solid transparent;
  transition:background .3s var(--ease-smooth),color .3s var(--ease-smooth),border-color .3s var(--ease-smooth);
}
.admin-nav button:hover{color:#fff;background:rgba(255,255,255,.05)}
.admin-nav button.on{color:#fff;border-left-color:var(--saddle);background:rgba(255,255,255,.06)}
.admin-exit{
  text-align:left;color:rgba(234,232,227,.65);font-size:11.5px;letter-spacing:.14em;
  text-transform:uppercase;border-bottom:1px solid transparent;padding:4px 0;
  transition:color .3s var(--ease-smooth);
}
.admin-exit:hover{color:#fff}
.admin-main{padding:32px clamp(20px,4vw,56px);overflow:hidden}
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
.admin-login{min-height:100vh;display:grid;place-items:center;padding:40px 20px;background:radial-gradient(ellipse at top,#1a1f26,#0e1218)}
.admin-login-card{
  width:100%;max-width:400px;background:var(--cream);
  padding:clamp(28px,5vw,44px);box-shadow:0 40px 100px -40px rgba(0,0,0,.6);
}
.admin-brand{
  font-family:var(--display);font-weight:700;font-size:24px;letter-spacing:.3em;
  text-indent:.3em;text-align:center;text-transform:uppercase;color:var(--ink);
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
