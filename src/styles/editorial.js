export default `/* ============ EDITORIAL ============ */
.edit{display:grid;grid-template-columns:5fr 6fr;gap:clamp(40px,7vw,120px);align-items:center}
.edit-art{position:relative;aspect-ratio:4/5;background:linear-gradient(170deg,#dedcd5,#a9a396 60%,#6a6356);overflow:hidden}
.edit-art svg{position:absolute;inset:0;width:100%;height:100%}
.edit-art .tag{
  position:absolute;left:22px;bottom:22px;background:var(--paper);
  padding:10px 16px;font-size:10px;letter-spacing:.24em;text-transform:uppercase;
  font-weight:500;
}
.edit-copy .h-lg{margin:22px 0 32px}
.edit-copy p{color:var(--ink-2);max-width:520px;margin-bottom:20px;font-size:16px;line-height:1.75}
.edit-copy p.drop::first-letter{
  font-family:var(--serif);float:left;font-size:82px;line-height:.78;
  padding:10px 14px 0 0;color:var(--saddle-d);font-weight:300;
}
.pull{
  border-left:2px solid var(--saddle);padding:6px 0 6px 28px;margin:40px 0;
  font-family:var(--serif);font-style:italic;font-weight:300;
  font-size:clamp(22px,2.4vw,32px);line-height:1.28;max-width:520px;letter-spacing:-.01em;
}
@media(max-width:860px){.edit{grid-template-columns:1fr}}

`;
