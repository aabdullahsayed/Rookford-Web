export default `/* ============ SHOP ============ */
.shop{background:var(--cream);border-block:1px solid var(--line)}
.toolbar{
  display:flex;justify-content:space-between;gap:24px;align-items:center;
  flex-wrap:wrap;border-block:1px solid var(--line);padding:16px 0;margin-bottom:44px;
}
.tabs{display:flex;gap:2px;flex-wrap:wrap}
.tab{
  padding:10px 18px;font-size:11px;letter-spacing:.18em;text-transform:uppercase;
  font-weight:500;border:1px solid transparent;
  transition:background .3s var(--ease-smooth),color .3s var(--ease-smooth),border-color .3s var(--ease-smooth);
}
.tab:hover{border-color:var(--line)}
.tab.on{background:var(--ink);color:var(--paper);border-color:var(--ink)}
.tools-r{display:flex;gap:20px;align-items:center;font-size:11px;letter-spacing:.16em;text-transform:uppercase;color:var(--ink-2)}
select.sort{
  background:transparent;border:0;border-bottom:1px solid var(--ink);
  padding:8px 24px 8px 0;font:inherit;font-size:11px;letter-spacing:.16em;
  text-transform:uppercase;cursor:pointer;appearance:none;color:var(--ink);font-weight:500;
  transition:border-color .3s var(--ease-smooth);
}
select.sort:hover{border-color:var(--saddle-d)}

.grid{display:grid;grid-template-columns:repeat(4,1fr);gap:48px 24px}
@media(max-width:1100px){.grid{grid-template-columns:repeat(3,1fr)}}
@media(max-width:760px){.grid{grid-template-columns:repeat(2,1fr);gap:32px 14px}}

.card{animation:cardin .7s var(--ease-editorial) both}
@keyframes cardin{from{opacity:0;transform:translateY(20px)}to{opacity:1;transform:none}}
.media{
  position:relative;aspect-ratio:4/5;overflow:hidden;background:var(--paper-2);
  cursor:pointer;
  transition:box-shadow .7s var(--ease-smooth),transform .5s var(--ease-out);
}
.card:hover .media{box-shadow:0 40px 60px -40px rgba(20,24,31,.42)}
.media::before{
  content:"";position:absolute;left:0;right:0;bottom:0;height:24%;
  background:linear-gradient(to bottom,rgba(40,38,34,0),rgba(40,38,34,.18));
  pointer-events:none;
}
.media .g{
  position:absolute;inset:7% 10%;display:grid;place-items:center;
  transition:transform 1.1s var(--ease-editorial);
}
.media .g svg{width:100%;height:100%;filter:drop-shadow(0 8px 10px rgba(20,24,31,.12))}
.card:hover .media .g{transform:scale(1.05) translateY(-8px)}

.badge{
  position:absolute;top:14px;left:14px;background:var(--paper);
  padding:5px 11px;font-size:10px;letter-spacing:.2em;text-transform:uppercase;
  font-weight:600;z-index:2;
}
.badge.low{background:var(--rust);color:#fff}

.wish{
  position:absolute;top:8px;right:8px;width:40px;height:40px;
  display:grid;place-items:center;z-index:2;
  transition:transform .3s var(--ease-out);
}
.wish svg{width:18px;height:18px;fill:transparent;stroke:var(--ink);stroke-width:1.4;transition:all .3s var(--ease-smooth)}
.wish:hover{transform:scale(1.12)}
.wish.on svg{fill:var(--rust);stroke:var(--rust)}

.quick{
  position:absolute;left:12px;right:12px;bottom:12px;
  background:rgba(244,242,237,.97);padding:14px;
  transform:translateY(calc(100% + 16px));
  transition:transform .5s var(--ease-editorial);z-index:3;
}
.card:hover .quick,.card:focus-within .quick{transform:none}
@media(hover:none){
  .quick{transform:none;position:static;background:transparent;padding:12px 0 0}
  .media{overflow:visible}
}
.quick small{
  display:block;font-size:10px;letter-spacing:.2em;text-transform:uppercase;
  color:var(--ink-2);margin-bottom:10px;font-weight:500;
}
.chips{display:flex;gap:6px;flex-wrap:wrap}
.chip{
  min-width:38px;height:34px;padding:0 10px;border:1px solid var(--line);
  font-size:11.5px;font-weight:500;
  transition:background .25s var(--ease-smooth),color .25s var(--ease-smooth),border-color .25s var(--ease-smooth);
  background:var(--cream);
}
.chip:hover,.chip.on{background:var(--ink);color:var(--paper);border-color:var(--ink)}

.info{padding-top:18px;display:grid;gap:6px}
.info .row{display:flex;justify-content:space-between;gap:12px;align-items:baseline}
.info h3{font-family:var(--serif);font-weight:400;font-size:19px;line-height:1.25;letter-spacing:-.005em}
.info .price{font-size:14.5px;font-weight:500;white-space:nowrap;letter-spacing:.01em}
.info .cat{font-size:10.5px;letter-spacing:.18em;text-transform:uppercase;color:var(--ink-2);font-weight:500}
.sw{display:flex;gap:10px;margin-top:10px;align-items:center}
.sw button{
  width:15px;height:15px;border-radius:50%;border:1px solid rgba(20,23,27,.22);
  position:relative;transition:transform .3s var(--ease-out);
}
.sw button:hover{transform:scale(1.2)}
.sw button.on::after{content:"";position:absolute;inset:-4px;border:1px solid var(--ink);border-radius:50%}

.empty{grid-column:1/-1;text-align:center;padding:100px 0;color:var(--ink-2)}
.empty h3{font-family:var(--display);text-transform:uppercase;font-size:32px;color:var(--ink);margin-bottom:10px;letter-spacing:-.01em}

`;
