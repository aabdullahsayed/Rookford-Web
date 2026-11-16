export default `/* ============ COLLECTIONS ============ */
.cols{display:grid;grid-template-columns:repeat(12,1fr);gap:24px}
.col-card{
  position:relative;overflow:hidden;min-height:540px;display:flex;
  flex-direction:column;justify-content:flex-end;padding:32px;color:var(--paper);
  isolation:isolate;
}
.col-card::before{
  content:"";position:absolute;inset:0;z-index:-2;
  transition:transform 1.4s var(--ease-editorial);
}
.col-card::after{
  content:"";position:absolute;inset:0;z-index:-1;
  background:repeating-linear-gradient(115deg,rgba(255,255,255,.05) 0 2px,rgba(0,0,0,.08) 2px 4px),
             linear-gradient(to top,rgba(10,14,22,.7),transparent 55%);
}
.col-card:hover::before{transform:scale(1.05)}
.c1{grid-column:span 7}.c1::before{background:linear-gradient(160deg,#4b5561,#1c2127)}
.c2{grid-column:span 5}.c2::before{background:linear-gradient(160deg,#a8a296,#625b50)}
.c3{grid-column:span 5}.c3::before{background:linear-gradient(160deg,#9ca3aa,#555d66)}
.c4{grid-column:span 7}.c4::before{background:linear-gradient(160deg,#4a4c50,#16171a)}
.col-card .num{
  position:absolute;top:26px;left:32px;font-family:var(--serif);
  font-size:12px;letter-spacing:.28em;opacity:.75;
}
.col-card h3{
  font-family:var(--display);text-transform:uppercase;font-weight:700;
  letter-spacing:-.01em;font-size:clamp(42px,4.6vw,70px);line-height:.9;
}
.col-card p{font-size:14px;opacity:.85;margin:12px 0 22px;max-width:340px;line-height:1.6}
.col-card .link{align-self:flex-start;color:var(--paper);border-color:rgba(234,232,227,.6)}
.col-card .ghostshape{
  position:absolute;right:-30px;top:32px;width:54%;opacity:.14;z-index:-1;
  transition:transform 1.2s var(--ease-editorial);
}
.col-card:hover .ghostshape{transform:translateY(-12px) rotate(-2deg)}
@media(max-width:800px){
  .c1,.c2,.c3,.c4{grid-column:span 12;min-height:400px;padding:28px}
  .cols{gap:16px}
}

`;
