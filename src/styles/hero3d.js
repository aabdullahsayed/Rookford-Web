export default `/* ============ HERO 3D HANG ============ */
.hero-3d{position:absolute;inset:0;perspective:1200px;pointer-events:none;z-index:2}
.hero-3d .rod{
  position:absolute;left:0;right:0;top:6%;height:11px;
  background:linear-gradient(#b3b7bd,#5b6068 55%,#2c2f35);
  box-shadow:0 16px 26px rgba(0,0,0,.38);
}
.hang-rot{
  position:absolute;left:50%;top:calc(6% + 6px);width:clamp(210px,44%,330px);
  transform:translateX(-50%) rotateY(var(--ry,0deg)) rotateX(var(--rx,0deg));
  transform-style:preserve-3d;transition:transform .6s var(--ease-smooth);
}
.hang3d{position:relative;transform-origin:50% 0;animation:sway 7s ease-in-out infinite alternate}
@keyframes sway{from{transform:rotate(-1.4deg)}to{transform:rotate(1.4deg)}}
.hang3d>svg,.hang3d .jeans3d svg{width:100%;height:auto;display:block}
.hang3d .hk{position:relative;z-index:2}
.hang3d .jeans3d{margin-top:-16%;filter:drop-shadow(16px 30px 24px rgba(0,0,0,.45))}
.tag3d{
  position:absolute;left:59%;top:14%;width:20%;transform-origin:50% 0;
  animation:swing 4.6s ease-in-out infinite alternate;z-index:3;
}
@keyframes swing{from{transform:rotate(-7deg) rotateY(-14deg)}to{transform:rotate(6deg) rotateY(14deg)}}
.tag3d .str{height:30px;width:1.5px;background:#2b1a0e;margin:0 auto}
.tag3d .lea{
  aspect-ratio:3/4.3;background:linear-gradient(135deg,#b08048,#6a4220);
  border:1px dashed rgba(245,235,215,.55);border-radius:6px 6px 3px 3px;
  box-shadow:inset 0 1px 1px rgba(255,255,255,.3),0 8px 14px rgba(0,0,0,.4);
  display:flex;flex-direction:column;align-items:center;justify-content:center;
  gap:3px;color:#f3e6cf;font:600 8px/1.35 var(--sans);letter-spacing:.14em;
  text-align:center;padding:6px 4px;position:relative;
}
.tag3d .lea::before{
  content:"";position:absolute;top:5px;left:50%;width:6px;height:6px;
  margin-left:-3px;border-radius:50%;background:#2b1a0e;
}
.tag3d .lea b{font-family:var(--display);font-size:20px;letter-spacing:.1em;display:block;margin-top:8px}
@media(prefers-reduced-motion:reduce){.hang3d,.tag3d{animation:none}}

`;
