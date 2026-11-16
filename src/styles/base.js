export default `
@font-face {
  font-family: 'Redaction 35';
  src: url('https://cdn.jsdelivr.net/gh/motaen/redaction/fonts/web/Redaction35-Regular.woff2') format('woff2');
  font-weight: normal;
  font-style: normal;
}

:root{
  --paper:#eae8e3;--paper-2:#dcd9d2;--cream:#f4f2ed;--ink:#16181b;--ink-2:#5a6068;
  --indigo:#1a1f26;--indigo-2:#2b323a;--saddle:#a97a4b;--saddle-d:#7a5331;--rust:#98402c;
  --line:#c9c6bf;--line-2:#b8b4aa;
  --serif:'Redaction 35',Georgia,'Times New Roman',serif;
  --sans:'Inter Tight','Helvetica Neue',Arial,sans-serif;
  --display:'Redaction 35','Oswald','Arial Narrow',serif;
  --ease:cubic-bezier(.22,1,.36,1);
  --ease-out:cubic-bezier(.16,1,.3,1);
  --ease-editorial:cubic-bezier(.19,1,.22,1);
  --ease-smooth:cubic-bezier(.4,0,.2,1);
}
*{box-sizing:border-box;margin:0;padding:0}
html{scroll-behavior:smooth;-webkit-text-size-adjust:100%}
body{background:var(--paper);color:var(--ink);font-family:var(--sans);font-size:16px;line-height:1.55;
  -webkit-font-smoothing:antialiased;-moz-osx-font-smoothing:grayscale;
  font-feature-settings:"ss01","cv11";overflow-x:hidden}
img,svg{display:block;max-width:100%}
button{font:inherit;color:inherit;background:none;border:0;cursor:pointer}
a{color:inherit;text-decoration:none}
::selection{background:var(--ink);color:var(--paper)}
:focus-visible{outline:1.5px solid var(--ink);outline-offset:4px}
.wrap{width:min(1320px,100% - 40px);margin-inline:auto}

/* ============ TYPOGRAPHY ============ */
.eyebrow{
  font-size:10px;letter-spacing:.28em;text-transform:uppercase;font-weight:600;
  color:var(--saddle-d);display:inline-flex;align-items:center;gap:12px;
}
.eyebrow::before{content:"";width:20px;height:1px;background:var(--saddle-d);opacity:.6}
.eyebrow.bare::before{display:none}

.h-xl{
  font-family:var(--display);font-weight:700;text-transform:uppercase;
  font-size:clamp(48px,12vw,196px);line-height:.82;letter-spacing:-.02em;
}
.h-lg{
  font-family:var(--display);text-transform:uppercase;font-weight:600;
  font-size:clamp(34px,8vw,100px);line-height:.86;letter-spacing:-.015em;
}
.h-md{font-family:var(--serif);font-weight:400;font-size:clamp(22px,5vw,34px);line-height:1.1}
em{font-style:italic;font-weight:300}
.h-xl em,.h-lg em{
  font-family:var(--serif);font-weight:300;text-transform:none;
  letter-spacing:-.03em;font-size:.84em;
}
.rule{height:1px;background:var(--line);border:0;margin:0}

/* ============ BUTTONS ============ */
.btn{
  display:inline-flex;align-items:center;gap:14px;padding:18px 30px;
  font-size:11px;letter-spacing:.2em;text-transform:uppercase;font-weight:600;
  border:1px solid var(--ink);position:relative;overflow:hidden;
  transition:background .5s var(--ease-editorial),color .5s var(--ease-editorial),border-color .5s var(--ease-editorial);
}
.btn.solid{background:var(--ink);color:var(--paper)}
.btn.solid:hover{background:var(--saddle-d);border-color:var(--saddle-d)}
.btn.solid[disabled]{opacity:.55;cursor:not-allowed}
.btn.ghost{background:transparent}
.btn.ghost:hover{background:var(--ink);color:var(--paper)}
.btn.light{border-color:rgba(234,232,227,.5);color:var(--paper);background:transparent}
.btn.light:hover{background:var(--paper);color:var(--ink);border-color:var(--paper)}
.arrow{display:inline-block;transition:transform .55s var(--ease-editorial)}
.btn:hover .arrow,.link:hover .arrow{transform:translateX(6px)}
.link{
  font-size:11px;letter-spacing:.18em;text-transform:uppercase;font-weight:600;
  border-bottom:1px solid currentColor;padding-bottom:5px;display:inline-flex;gap:10px;
  transition:opacity .3s var(--ease-smooth),border-color .4s var(--ease-editorial);
}
.link:hover{opacity:.65}

/* ============ REVEALS ============ */
.rv{opacity:0;transform:translateY(28px);transition:opacity 1s var(--ease-editorial),transform 1s var(--ease-editorial)}
.rv.in{opacity:1;transform:none}
.d1{transition-delay:.09s}.d2{transition-delay:.18s}.d3{transition-delay:.27s}
@media (prefers-reduced-motion:reduce){
  .rv{opacity:1;transform:none;transition:none}
  *{animation:none!important;scroll-behavior:auto!important}
}

`;
