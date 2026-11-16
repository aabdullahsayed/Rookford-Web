export default `/* ============ FILM GRAIN ============ */
body::after{
  content:"";position:fixed;inset:0;pointer-events:none;z-index:999;
  opacity:.06;mix-blend-mode:multiply;
  background-image:url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='160' height='160'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='.9' numOctaves='2' stitchTiles='stitch'/></filter><rect width='100%' height='100%' filter='url(%23n)'/></svg>");
}

`;
