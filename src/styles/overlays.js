export default `/* ============ OVERLAYS ============ */
.scrim{
  position:fixed;inset:0;background:rgba(14,19,28,.5);
  backdrop-filter:blur(4px);z-index:100;opacity:0;pointer-events:none;
  transition:opacity .45s var(--ease-smooth);
}
.scrim.on{opacity:1;pointer-events:auto}

.drawer{
  position:fixed;top:0;right:0;bottom:0;width:min(470px,100%);
  background:var(--cream);z-index:110;display:flex;flex-direction:column;
  transform:translateX(102%);transition:transform .6s var(--ease-editorial);
}
.drawer.on{transform:none}
.d-head{
  display:flex;justify-content:space-between;align-items:center;
  padding:24px 30px;border-bottom:1px solid var(--line);
}
.d-head h3{font-family:var(--serif);font-weight:400;font-size:26px}
.ship{padding:20px 30px;border-bottom:1px solid var(--line);font-size:13px;line-height:1.6}
.ship .bar{height:2px;background:var(--line);margin-top:12px;position:relative;overflow:hidden}
.ship .bar i{position:absolute;left:0;top:0;bottom:0;background:var(--saddle-d);transition:width .7s var(--ease-editorial)}
.d-body{flex:1;overflow-y:auto;padding:8px 30px}
.line{display:grid;grid-template-columns:84px 1fr;gap:18px;padding:22px 0;border-bottom:1px solid var(--line)}
.line .th{background:var(--paper-2);aspect-ratio:4/5;display:grid;place-items:center;padding:8px}
.line h4{font-family:var(--serif);font-weight:400;font-size:17px;line-height:1.25}
.line .sub{font-size:12px;color:var(--ink-2);margin-top:4px}
.line .lr{display:flex;justify-content:space-between;align-items:center;margin-top:14px}
.qty{display:inline-flex;border:1px solid var(--line);align-items:center}
.qty button{width:30px;height:30px;font-size:16px;transition:background .2s var(--ease-smooth)}
.qty button:hover{background:var(--paper-2)}
.qty span{min-width:26px;text-align:center;font-size:13px;font-weight:500}
.rm{
  font-size:10.5px;letter-spacing:.16em;text-transform:uppercase;color:var(--ink-2);
  text-decoration:underline;margin-left:14px;font-weight:500;
}
.d-empty{text-align:center;padding:90px 10px;color:var(--ink-2)}
.d-empty .h-md{color:var(--ink);margin-bottom:12px}
.d-foot{border-top:1px solid var(--line);padding:24px 30px 28px;background:var(--paper)}
.promo{display:flex;gap:8px;margin-bottom:18px}
.promo input{
  flex:1;min-width:0;border:1px solid var(--line);background:var(--cream);
  padding:12px 14px;font:inherit;font-size:16px;letter-spacing:.12em;
  text-transform:uppercase;outline:0;
  transition:border-color .3s var(--ease-smooth);
}
.promo input:focus{border-color:var(--ink)}
.promo button{
  padding:0 18px;border:1px solid var(--ink);font-size:10.5px;
  letter-spacing:.2em;text-transform:uppercase;font-weight:600;
  transition:background .3s var(--ease-smooth),color .3s var(--ease-smooth);
}
.promo button:hover{background:var(--ink);color:var(--paper)}
.tot{display:flex;justify-content:space-between;font-size:14px;padding:5px 0;color:var(--ink-2)}
.tot.big{
  font-family:var(--serif);font-size:24px;color:var(--ink);
  padding-top:14px;margin-top:10px;border-top:1px solid var(--line);
}
.d-foot .btn{width:100%;justify-content:center;margin-top:18px}
.d-foot small{display:block;text-align:center;font-size:11px;color:var(--ink-2);margin-top:14px;line-height:1.6}
.ln-row{display:none;margin-top:12px}.ln-row.on{display:block}
.ln-row input,.qnote{
  width:100%;border:1px solid var(--line);background:var(--paper);
  padding:12px 14px;font:inherit;font-size:16px;outline:0;
  transition:border-color .3s var(--ease-smooth);
}
.ln-row input:focus,.qnote:focus{border-color:var(--ink)}
.lnote{font-style:italic;font-size:12px;color:var(--saddle-d);margin-top:6px}

`;
