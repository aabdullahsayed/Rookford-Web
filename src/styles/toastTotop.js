export default `/* ============ TOAST & TOTOP ============ */
.toast{
  position:fixed;left:50%;bottom:32px;transform:translate(-50%,40px);
  background:var(--ink);color:var(--paper);padding:16px 24px;
  font-size:13px;letter-spacing:.04em;z-index:200;opacity:0;pointer-events:none;
  transition:opacity .5s var(--ease-editorial),transform .5s var(--ease-editorial);
  display:flex;gap:16px;align-items:center;max-width:calc(100% - 32px);
}
.toast.on{opacity:1;transform:translate(-50%,0);pointer-events:auto}
.toast button{
  text-decoration:underline;font-size:11px;letter-spacing:.16em;
  text-transform:uppercase;color:var(--saddle);font-weight:500;
}
.totop{
  position:fixed;right:24px;bottom:28px;width:46px;height:46px;
  border:1px solid var(--ink);background:var(--paper);display:grid;place-items:center;
  z-index:50;opacity:0;pointer-events:none;
  transition:opacity .4s var(--ease-smooth),background .3s var(--ease-smooth),color .3s var(--ease-smooth);
}
.totop.on{opacity:1;pointer-events:auto}
.totop:hover{background:var(--ink);color:var(--paper)}
.totop svg{width:16px;stroke:currentColor;fill:none;stroke-width:1.6}
.sr{position:absolute;width:1px;height:1px;overflow:hidden;clip:rect(0 0 0 0)}
[hidden]{display:none!important}

`;
