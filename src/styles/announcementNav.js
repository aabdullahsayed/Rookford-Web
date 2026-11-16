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

.nav-in{display:grid;grid-template-columns:1fr auto 1fr;align-items:center;height:64px}

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
  font-family:'BBH Bogle','Redaction 35','Oswald','Arial Narrow',serif;
  font-weight:400;
  font-size:34px;
  letter-spacing:.05em;
  text-indent:.05em;
  text-align:center;
  line-height:1;
  text-transform:uppercase;
}

/* ============ PREMIUM 3D NAV TOOLS ============ */
.nav-tools{
  display:flex;justify-content:flex-end;gap:6px;align-items:center;
}
.ico{
  position:relative;width:44px;height:44px;display:grid;place-items:center;
  border-radius:50%;background:transparent;
  transition:all .4s cubic-bezier(.16,1,.3,1);
  box-shadow:0 0 0 rgba(0,0,0,0); 
}
.ico:hover{
  background:rgba(234,232,227,.95);
  box-shadow:0 6px 16px rgba(20,24,31,.04), inset 0 1px 0 rgba(255,255,255,.8);
  transform:translateY(-2px);
}
.ico:active{
  transform:translateY(0) scale(.95);
  box-shadow:inset 0 2px 4px rgba(20,24,31,.08);
}
.ico svg{
  width:20px;height:20px;fill:none;stroke:var(--ink);stroke-width:1.5;
  stroke-linecap:round;stroke-linejoin:round;
  filter:drop-shadow(0 1px 1px rgba(20,24,31,.1));
  transition:transform .4s cubic-bezier(.16,1,.3,1);
}
.ico:hover svg{transform:scale(1.05)}

/* 3D Badge Bubble */
.cnt{
  position:absolute;top:2px;right:2px;min-width:18px;height:18px;border-radius:9px;
  background:var(--saddle-d);color:#fff;font-size:10px;font-weight:600;
  display:grid;place-items:center;padding:0 5px;
  box-shadow:0 2px 6px rgba(122,83,49,.4), inset 0 1px 1px rgba(255,255,255,.4);
  border:1px solid rgba(255,255,255,.15);
  transition:all .4s cubic-bezier(.16,1,.3,1);
}
.ico:hover .cnt{
  transform:scale(1.1) translateY(-2px);
  box-shadow:0 4px 10px rgba(122,83,49,.5), inset 0 1px 1px rgba(255,255,255,.4);
}
.cnt:empty,.cnt[data-n="0"]{display:none}

/* ============ MOBILE HAMBURGER ============ */
.burger{display:none}
@media(max-width:900px){
  .nav-links{display:none}
  .burger{
    display:grid;
    margin-left:-10px;
  }
  .burger svg{
    stroke-width:1.8;
    width:22px;
    height:22px;
  }
  .nav-in{grid-template-columns:auto 1fr auto;height:56px}
  .logo{font-size:24px;letter-spacing:.05em;text-indent:.05em}
}

/* ============ TRANSPARENT EDITORIAL MOBILE NAV ============ */
.mnav-scrim{
  position:fixed;inset:0;z-index:85;background:transparent;
  opacity:0;pointer-events:none;transition:opacity .4s var(--ease-smooth);
}
.mnav-scrim.open{opacity:1;pointer-events:auto}

.mnav{
  position:fixed;
  top:64px; /* Sits just below the 56px mobile header */
  left:0;right:0;
  z-index:90;
  
  /* Dark transparent glass - NO borders, NO rounded corners, NO shadow */
  background:rgba(26, 31, 38, 0.9); 
  backdrop-filter:blur(24px) saturate(1.2);
  -webkit-backdrop-filter:blur(24px) saturate(1.2);
  
  display:flex;flex-direction:column;
  padding:16px 0 24px;
  
  /* Smooth drop-down animation */
  opacity:0;visibility:hidden;
  transform:translateY(-12px);
  transition:all .4s var(--ease-editorial);
}

.mnav.open{
  opacity:1;visibility:visible;
  transform:translateY(0);
}

/* The Links */
.mnav a{
  font-family:var(--serif);
  font-size:22px; /* Smaller, highly readable, thumb-friendly */
  font-weight:400;
  color:var(--paper);
  padding:18px 32px; /* Big tap targets for mobile UX */
  display:flex;
  align-items:baseline;
  gap:16px;
  border-bottom:1px solid rgba(255,255,255,.06);
  transition:all .3s var(--ease-smooth);
}

.mnav a:last-of-type{
  border-bottom:0;
}

/* Tap/Hover effect */
.mnav a:active, .mnav a:hover{
  background:rgba(255,255,255,.05);
  padding-left:40px; /* Editorial slide */
  color:var(--saddle);
}

/* The tiny editorial numbers */
.mnav a span.num{
  font-family:var(--sans);
  font-size:10px;
  letter-spacing:.2em;
  color:var(--saddle);
  opacity:0.8;
}

/* The Close Button */
.mnav .x{
  position:absolute;
  top:12px;right:16px;
  color:rgba(234,232,227,.6);
  width:36px;height:36px;
  border-radius:50%;
  transition:color .3s;
}
.mnav .x:hover{
  color:var(--paper);
  background:rgba(255,255,255,.1);
}
`;