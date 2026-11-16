export default `/* ============ LOOKBOOK ============ */
.look{overflow:hidden;padding-bottom:clamp(60px,8vw,110px)}
.rail{
  display:flex;gap:24px;overflow-x:auto;scroll-snap-type:x mandatory;
  padding:0 max(24px,calc((100vw - 1320px)/2)) 24px;scrollbar-width:none;cursor:grab;
}
.rail::-webkit-scrollbar{display:none}
.rail.drag{cursor:grabbing;scroll-snap-type:none}
.lk{
  flex:0 0 clamp(280px,30vw,400px);aspect-ratio:3/4.3;scroll-snap-align:start;
  position:relative;overflow:hidden;color:var(--paper);padding:28px;
  display:flex;flex-direction:column;justify-content:space-between;user-select:none;
}
.lk::before{content:"";position:absolute;inset:0;background:var(--bg);z-index:-2}
.lk::after{
  content:"";position:absolute;inset:0;z-index:-1;
  background:repeating-linear-gradient(115deg,rgba(255,255,255,.05) 0 2px,rgba(0,0,0,.07) 2px 4px);
}
.lk .n{font-family:var(--serif);font-weight:300;font-size:112px;line-height:.8;letter-spacing:-.04em;opacity:.88}
.lk h4{font-family:var(--display);text-transform:uppercase;font-weight:700;font-size:36px;line-height:.92;letter-spacing:-.005em}
.lk p{font-size:13px;opacity:.8;margin-top:10px;line-height:1.5}
.lk svg{position:absolute;left:0;right:0;bottom:0;width:100%;z-index:-1;opacity:.9}
.rail-ctl{display:flex;gap:10px}
.rbtn{
  width:50px;height:50px;border:1px solid var(--ink);display:grid;place-items:center;
  transition:background .35s var(--ease-smooth),color .35s var(--ease-smooth);
}
.rbtn:hover{background:var(--ink);color:var(--paper)}
.rbtn svg{width:18px;height:18px;stroke:currentColor;fill:none;stroke-width:1.5}

`;
