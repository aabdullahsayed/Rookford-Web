export default `/* ============ FOOTER ============ */
footer{background:var(--ink);color:var(--paper);padding:96px 0 36px}
.f-top{
  display:grid;grid-template-columns:1.6fr repeat(3,1fr);gap:56px;
  padding-bottom:72px;border-bottom:1px solid rgba(234,232,227,.15);
}
.f-top p{color:rgba(234,232,227,.62);font-size:14px;max-width:320px;margin-top:22px;line-height:1.7}
.f-logo{display:block;height:auto;max-height:84px;width:auto;max-width:250px;object-fit:contain;margin:0 0 20px}
.f-wordmark{
  font-family:var(--display);font-weight:700;font-size:38px;
  letter-spacing:.34em;text-transform:uppercase;line-height:1;margin-bottom:18px;
}
.f-col h5{
  font-size:10.5px;letter-spacing:.24em;text-transform:uppercase;
  color:var(--saddle);margin-bottom:22px;font-weight:600;
}
.f-col a{
  display:block;font-size:14px;color:rgba(234,232,227,.72);padding:6px 0;
  transition:color .3s var(--ease-smooth),padding .35s var(--ease-editorial);
}
.f-col a:hover{color:#fff;padding-left:8px}
.f-bot{
  display:flex;justify-content:space-between;gap:24px;flex-wrap:wrap;
  padding-top:32px;font-size:11.5px;color:rgba(234,232,227,.5);letter-spacing:.08em;
}
.rope{
  height:6px;
  background:repeating-linear-gradient(135deg,var(--saddle) 0 6px,#d9a56a 6px 9px,var(--saddle-d) 9px 12px);
  opacity:.9;
}
@media(max-width:860px){
  .f-top{grid-template-columns:1fr 1fr;gap:36px;padding-bottom:56px}
  .f-top>div:first-child{grid-column:1/-1}
}

`;
