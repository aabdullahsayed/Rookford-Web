export default `/* ============ HERO ============ */
.hero{
  display:grid;grid-template-columns:minmax(0,1fr) minmax(0,1.05fr);
  min-height:calc(100vh - 116px);min-height:calc(100svh - 116px);
  border-bottom:1px solid var(--line);padding:0;
}
.hero-copy{
  display:flex;flex-direction:column;justify-content:space-between;
  padding:clamp(32px,5vw,72px) clamp(24px,4vw,64px) clamp(28px,3.5vw,52px) max(20px,calc((100vw - 1320px)/2));
  gap:44px;
}
.hero-top{display:flex;justify-content:space-between;align-items:center;gap:16px}
.hero-top .pill{
  border:1px solid var(--ink);padding:7px 14px;font-size:10px;
  letter-spacing:.24em;text-transform:uppercase;font-weight:500;
}
.hero h1 em{color:var(--saddle-d)}
.hero-sub{max-width:440px;color:var(--ink-2);font-size:17px;line-height:1.6;margin-top:32px;letter-spacing:.005em}
.hero-cta{display:flex;gap:12px;flex-wrap:wrap;margin-top:40px}
.hero-meta{
  display:flex;gap:48px;border-top:1px solid var(--line);
  padding-top:22px;flex-wrap:wrap;
}
.hero-meta div b{
  display:block;font-family:var(--display);font-weight:600;font-size:38px;line-height:1;
  letter-spacing:-.02em;
}
.hero-meta div span{
  font-size:10px;letter-spacing:.2em;text-transform:uppercase;
  color:var(--ink-2);display:block;margin-top:6px;font-weight:500;
}
.hero-art{position:relative;overflow:hidden;background:var(--indigo)}
.hero-art svg.scene{position:absolute;inset:-4%;width:108%;height:108%;max-width:none}
.hero-art .layer{transition:transform .8s var(--ease-smooth);will-change:transform}
.twill{
  position:absolute;inset:0;pointer-events:none;mix-blend-mode:soft-light;opacity:.65;
  background:repeating-linear-gradient(115deg,rgba(255,255,255,.07) 0 2px,rgba(0,0,0,.09) 2px 4px);
}
.hero-badge{
  position:absolute;right:32px;bottom:32px;width:144px;height:144px;
  color:var(--paper);z-index:3;
}
.hero-badge svg{width:100%;height:100%}
.hero-cap{
  position:absolute;left:32px;bottom:32px;color:var(--paper);
  font-size:10px;letter-spacing:.24em;text-transform:uppercase;
  max-width:260px;line-height:1.8;z-index:3;
}
@media(max-width:900px){
  .hero{grid-template-columns:1fr;min-height:0}
  .hero-art{min-height:62vh;order:-1}
  .hero-copy{padding:36px 20px;gap:32px}
  .hero-badge{width:86px;height:86px;right:16px;bottom:16px}
  .hero-cap{left:16px;bottom:16px;max-width:160px;font-size:9px;line-height:1.55}
  .hero-meta{gap:28px}
  .hero-meta div b{font-size:32px}
}

`;
