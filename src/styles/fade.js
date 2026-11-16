export default `/* ============ FADE ============ */
.fade{background:var(--indigo);color:var(--paper);position:relative;overflow:hidden}
.fade::before{
  content:"";position:absolute;inset:0;
  background:repeating-linear-gradient(115deg,rgba(255,255,255,.025) 0 2px,rgba(0,0,0,.05) 2px 4px);
  pointer-events:none;
}
.fade .eyebrow{color:var(--saddle)}
.fade .eyebrow::before{background:var(--saddle)}
.fade .h-lg em{color:var(--saddle)}
.fade-grid{
  display:grid;grid-template-columns:1fr 1fr;gap:clamp(40px,7vw,120px);
  align-items:center;position:relative;
}
.fade-stage{
  display:grid;place-items:center;background:rgba(255,255,255,.03);
  border:1px solid rgba(255,255,255,.1);padding:44px;aspect-ratio:1/1.1;
}
.fade-stage svg{height:100%;max-height:480px;width:auto}
.fade-copy h2{margin:20px 0 24px}
.fade-copy p.lead{
  color:rgba(234,232,227,.78);max-width:460px;min-height:5.2em;
  transition:opacity .4s var(--ease-smooth);line-height:1.7;
}
.stage-name{
  font-family:var(--serif);font-style:italic;font-weight:300;
  font-size:30px;margin-top:36px;color:var(--saddle);
}
.range{margin-top:26px}
input[type=range]{-webkit-appearance:none;appearance:none;width:100%;height:28px;background:transparent;cursor:pointer}
input[type=range]::-webkit-slider-runnable-track{height:1px;background:rgba(234,232,227,.35)}
input[type=range]::-moz-range-track{height:1px;background:rgba(234,232,227,.35)}
input[type=range]::-webkit-slider-thumb{
  -webkit-appearance:none;width:22px;height:22px;border-radius:50%;
  background:var(--saddle);border:3px solid var(--indigo);
  box-shadow:0 0 0 1px var(--saddle);margin-top:-10px;
  transition:transform .25s var(--ease-out);
}
input[type=range]::-webkit-slider-thumb:hover{transform:scale(1.15)}
input[type=range]::-moz-range-thumb{
  width:16px;height:16px;border-radius:50%;background:var(--saddle);
  border:3px solid var(--indigo);box-shadow:0 0 0 1px var(--saddle);
}
.range-lbl{
  display:flex;justify-content:space-between;font-size:10px;letter-spacing:.2em;
  text-transform:uppercase;color:rgba(234,232,227,.55);margin-top:8px;
}
.range-val{font-family:var(--display);font-weight:600;font-size:58px;line-height:1;letter-spacing:-.02em}
.range-val small{
  font-size:13px;letter-spacing:.22em;text-transform:uppercase;
  font-family:var(--sans);margin-left:10px;color:rgba(234,232,227,.55);
  font-weight:500;
}
@media(max-width:860px){.fade-grid{grid-template-columns:1fr}}

`;
