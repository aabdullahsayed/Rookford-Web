export default `/* ============ CHECKOUT ============ */
.co{
  position:fixed;inset:0;z-index:130;background:var(--paper);overflow:auto;
  transform:translateY(100%);
  transition:transform .65s var(--ease-editorial),visibility 0s .65s;visibility:hidden;
}
.co.on{transform:none;visibility:visible;transition:transform .65s var(--ease-editorial)}
.co-head{border-bottom:1px solid var(--line);background:var(--paper);position:sticky;top:0;z-index:2}
.co-head-in{display:grid;grid-template-columns:1fr auto 1fr;align-items:center;height:80px}
.co-head .logo{font-size:22px}
.co-head .eyebrow{text-align:right;justify-self:end}
.co-grid{
  display:grid;grid-template-columns:minmax(0,1.35fr) minmax(0,1fr);
  gap:clamp(40px,5vw,88px);padding:56px 0 96px;align-items:start;
}
.steps{list-style:none;display:flex;gap:32px;margin-bottom:44px;flex-wrap:wrap}
.steps li{
  display:flex;align-items:center;gap:12px;font-size:11px;letter-spacing:.18em;
  text-transform:uppercase;color:var(--ink-2);font-weight:500;
}
.steps li span{
  width:26px;height:26px;border:1px solid var(--line);border-radius:50%;
  display:grid;place-items:center;font-size:11px;
  transition:background .4s var(--ease-smooth),color .4s var(--ease-smooth),border-color .4s var(--ease-smooth);
}
.steps li.on{color:var(--ink)}
.steps li.on span{background:var(--ink);color:var(--paper);border-color:var(--ink)}
.steps li.done span{background:var(--saddle-d);color:#fff;border-color:var(--saddle-d)}
.co-h{
  font-family:var(--display);text-transform:uppercase;font-weight:700;
  font-size:clamp(28px,6vw,64px);line-height:.92;letter-spacing:-.015em;
}
.co-p{color:var(--ink-2);margin:16px 0 32px;max-width:520px;line-height:1.7}
.co-sub{
  font-size:11px;letter-spacing:.24em;text-transform:uppercase;font-weight:600;
  margin:40px 0 16px;padding-top:24px;border-top:1px solid var(--line);
}
.fgrid{display:grid;grid-template-columns:1fr 1fr;gap:20px 18px}
.fld{display:flex;flex-direction:column;gap:8px}
.fld.full{grid-column:1/-1}
.fld label{font-size:10.5px;letter-spacing:.18em;text-transform:uppercase;font-weight:600;color:var(--ink-2)}
.fld label i{color:var(--rust);font-style:normal}
.fld input,.fld select,.fld textarea{
  width:100%;background:var(--cream);border:1px solid var(--line);border-radius:0;
  padding:14px 16px;font:inherit;font-size:16px;color:var(--ink);outline:0;
  transition:border-color .3s var(--ease-smooth);appearance:none;
}
.fld textarea{resize:vertical;min-height:96px}
.fld input:focus,.fld select:focus,.fld textarea:focus{border-color:var(--ink)}
.fld.bad input{border-color:var(--rust)}
.fld .err{color:var(--rust);font-size:12px}
.cnt-s{align-self:flex-end;font-size:11px;color:var(--ink-2)}
.opts{display:grid;gap:12px}
.opt{
  display:flex;gap:16px;align-items:flex-start;padding:18px 20px;
  border:1px solid var(--line);background:var(--cream);cursor:pointer;
  transition:border-color .3s var(--ease-smooth);position:relative;
}
.opt:hover{border-color:var(--ink-2)}
.opt.on{border-color:var(--ink);box-shadow:inset 0 0 0 1px var(--ink)}
.opt input{position:absolute;opacity:0;pointer-events:none}
.opt .rd{
  width:18px;height:18px;border:1.5px solid var(--ink-2);border-radius:50%;
  flex:none;margin-top:2px;position:relative;
  transition:border-color .3s var(--ease-smooth);
}
.opt.on .rd{border-color:var(--ink)}
.opt.on .rd::after{content:"";position:absolute;inset:3px;border-radius:50%;background:var(--ink)}
.opt b{display:block;font-weight:600;font-size:15px}
.opt small{color:var(--ink-2);font-size:13px;line-height:1.5;display:block;margin-top:3px}
.chk{display:flex;gap:12px;align-items:center;font-size:14px;cursor:pointer;margin:20px 0 10px}
.chk input{width:18px;height:18px;accent-color:var(--ink)}
.chk.bad{color:var(--rust)}
.co-nav{display:flex;justify-content:space-between;gap:16px;margin-top:48px;flex-wrap:wrap}
.co-side{position:sticky;top:106px;background:var(--cream);border:1px solid var(--line);padding:28px}
.side-h{
  display:flex;justify-content:space-between;align-items:center;
  border-bottom:1px solid var(--ink);padding-bottom:16px;margin-bottom:8px;
  font-size:11px;letter-spacing:.2em;text-transform:uppercase;font-weight:600;
}
.side-h .link{font-size:10.5px}
.s-it{
  display:grid;grid-template-columns:56px 1fr auto;gap:16px;
  padding:16px 0;border-bottom:1px solid var(--line);align-items:center;font-size:14px;
}
.s-it .th{position:relative;background:var(--paper-2);aspect-ratio:1;padding:6px;display:grid;place-items:center}
.s-it .q{
  position:absolute;top:-6px;right:-6px;background:var(--ink);color:var(--paper);
  font-size:10px;min-width:18px;height:18px;border-radius:9px;display:grid;place-items:center;
  font-weight:600;
}
.s-it small{display:block;color:var(--ink-2);font-size:12px}
.s-it .nt{font-style:italic;color:var(--saddle-d)}
.co-side .tot{padding:6px 0}
.rv-grid{display:grid;grid-template-columns:1fr 1fr;gap:18px}
.rv-card{border:1px solid var(--line);background:var(--cream);padding:22px;font-size:14px;line-height:1.7}
.rv-card.full{grid-column:1/-1}
.rv-h{
  display:flex;justify-content:space-between;margin-bottom:12px;
  font-size:10.5px;letter-spacing:.2em;text-transform:uppercase;font-weight:600;
}
.rv-h .link{font-size:10.5px}
.co-done{grid-column:1/-1;text-align:center;padding:36px 0}
.co-done .tick{
  width:68px;height:68px;border-radius:50%;border:1px solid var(--ink);
  margin:0 auto 28px;display:grid;place-items:center;
}
.co-done .tick svg{
  width:28px;stroke:var(--ink);fill:none;stroke-width:1.6;
  stroke-dasharray:30;stroke-dashoffset:30;animation:draw .9s .2s var(--ease-editorial) forwards;
}
@keyframes draw{to{stroke-dashoffset:0}}
@media(max-width:900px){
  .co-grid{grid-template-columns:1fr;padding-top:32px}
  .co-side{position:static;order:-1}
  .fgrid,.rv-grid{grid-template-columns:1fr}
  .co-head-in{grid-template-columns:auto 1fr}
  .co-head .eyebrow{display:none}
  .co-head .logo{justify-self:end}
}

`;
