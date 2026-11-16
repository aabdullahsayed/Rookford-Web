export default `/* ============ ANNOUNCEMENT ============ */
.ann{
  background:var(--indigo);color:var(--paper);
  font-size:10px;letter-spacing:.3em;text-transform:uppercase;text-align:center;
  padding:11px 16px;position:relative;z-index:61;height:38px;overflow:hidden;
}
.ann span{opacity:0;position:absolute;left:0;right:0;transition:opacity .7s var(--ease-smooth)}
.ann span.on{opacity:1}

/* ============ NAV ============ */
header.nav{
  position:sticky;top:0;z-index:60;
  background:rgba(234,232,227,.86);
  backdrop-filter:blur(20px) saturate(1.1);
  -webkit-backdrop-filter:blur(20px) saturate(1.1);
  border-bottom:1px solid transparent;
  transition:border-color .4s var(--ease-smooth),background .4s var(--ease-smooth);
}
header.nav.scrolled{border-color:var(--line);background:rgba(234,232,227,.94)}
.nav-in{display:grid;grid-template-columns:1fr auto 1fr;align-items:center;height:78px}
.nav-links{display:flex;gap:36px}
.nav-links a{
  font-size:11px;letter-spacing:.18em;text-transform:uppercase;font-weight:500;
  position:relative;padding:8px 0;transition:color .3s var(--ease-smooth);
}
.nav-links a::after{
  content:"";position:absolute;left:0;right:100%;bottom:2px;height:1px;
  background:var(--ink);transition:right .5s var(--ease-editorial);
}
.nav-links a:hover::after{right:0}
.logo{
  font-family:'Redaction 35','Oswald','Arial Narrow',serif;font-weight:700;
  font-size:28px;letter-spacing:.36em;text-indent:.36em;text-align:center;line-height:1;
  text-transform:uppercase;
}
.nav-tools{display:flex;justify-content:flex-end;gap:4px;align-items:center}
.ico{
  position:relative;width:44px;height:44px;display:grid;place-items:center;
  transition:color .3s var(--ease-smooth),transform .3s var(--ease-out);
}
.ico:hover{color:var(--saddle-d)}
.ico svg{width:19px;height:19px;fill:none;stroke:currentColor;stroke-width:1.4;stroke-linecap:round;stroke-linejoin:round}
.cnt{
  position:absolute;top:2px;right:0;min-width:16px;height:16px;border-radius:8px;
  background:var(--saddle-d);color:#fff;font-size:9.5px;font-weight:600;
  display:grid;place-items:center;padding:0 4px;
  transition:transform .4s var(--ease-out);
}
.cnt:empty,.cnt[data-n="0"]{display:none}
.burger{display:none}
@media(max-width:900px){
  .nav-links{display:none}.burger{display:grid}
  .nav-in{grid-template-columns:auto 1fr auto;height:64px}
  .logo{font-size:20px;letter-spacing:.3em;text-indent:.3em}
}
.mnav{
  position:fixed;inset:0;background:var(--indigo);color:var(--paper);z-index:90;
  display:flex;flex-direction:column;justify-content:center;padding:40px;gap:10px;
  transform:translateY(-100%);transition:transform .65s var(--ease-editorial);
}
.mnav.open{transform:none}
.mnav a{
  font-family:var(--display);font-weight:700;text-transform:uppercase;
  font-size:clamp(38px,11vw,64px);line-height:1.1;
}
.mnav .x{position:absolute;top:20px;right:20px;color:var(--paper)}

`;
