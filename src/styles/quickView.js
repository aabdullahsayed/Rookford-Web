export default `/* ============ QUICK VIEW MODAL ============ */
.modal{
  position:fixed;inset:0;z-index:120;display:grid;place-items:center;padding:20px;
  opacity:0;pointer-events:none;transition:opacity .4s var(--ease-smooth);
}
.modal.on{opacity:1;pointer-events:auto}
.m-box{
  background:var(--cream);width:min(1020px,100%);max-height:92vh;overflow:auto;
  display:grid;grid-template-columns:1fr 1fr;
  transform:translateY(28px) scale(.98);
  transition:transform .6s var(--ease-editorial);position:relative;
}
.modal.on .m-box{transform:none}
.m-media{
  background:var(--paper-2);display:grid;place-items:center;padding:56px;
  min-height:420px;position:relative;perspective:1000px;overflow:hidden;
  background:radial-gradient(120% 70% at 50% 30%,#f4f2ed,#dad9d3 62%,#c6c5be);
}
.m-media svg{
  width:100%;max-width:380px;
  filter:drop-shadow(0 24px 24px rgba(20,24,31,.16));
  transform:rotateY(var(--qy,0deg)) rotateX(var(--qx,0deg));
  transition:transform .25s ease-out;position:relative;
}
.m-hint{
  position:absolute;bottom:16px;left:0;right:0;text-align:center;font-size:10px;
  letter-spacing:.22em;text-transform:uppercase;color:var(--ink-2);font-weight:500;
}
.m-info{padding:48px 44px 40px;display:flex;flex-direction:column;gap:22px}
.m-info h2{
  font-family:var(--display);font-weight:700;text-transform:uppercase;
  font-size:clamp(36px,4vw,56px);line-height:.92;letter-spacing:-.015em;
}
.m-info .price{font-size:20px;font-weight:500;letter-spacing:.005em}
.m-info .desc{color:var(--ink-2);font-size:15px;line-height:1.7}
.m-x{position:absolute;top:10px;right:10px;z-index:3;background:var(--cream)}
.lbl{
  display:flex;justify-content:space-between;font-size:10.5px;letter-spacing:.2em;
  text-transform:uppercase;margin-bottom:12px;font-weight:600;
}
.lbl a{text-decoration:underline;color:var(--ink-2);cursor:pointer}
.lbl.err{color:var(--rust)}
.m-act{display:flex;gap:12px}
.m-act .btn{flex:1;justify-content:center}
details{border-top:1px solid var(--line);padding:16px 0;font-size:14px}
details:last-of-type{border-bottom:1px solid var(--line)}
summary{
  cursor:pointer;font-size:11px;letter-spacing:.2em;text-transform:uppercase;
  font-weight:600;list-style:none;display:flex;justify-content:space-between;
}
summary::-webkit-details-marker{display:none}
summary::after{content:"+";font-size:16px;line-height:1;transition:transform .3s var(--ease-smooth)}
details[open] summary::after{content:"–"}
details p{margin-top:12px;color:var(--ink-2);line-height:1.7}
.shake{animation:shake .4s var(--ease-smooth)}
@keyframes shake{25%{transform:translateX(-6px)}75%{transform:translateX(6px)}}
@media(max-width:800px){
  .m-box{grid-template-columns:1fr}
  .m-media{min-height:320px;padding:36px}
  .m-info{padding:32px 26px}
}

`;
