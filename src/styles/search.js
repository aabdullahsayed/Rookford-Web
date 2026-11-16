export default `/* ============ SEARCH ============ */
.search{
  position:fixed;inset:0;background:var(--paper);z-index:120;
  padding:110px 0 40px;transform:translateY(-100%);
  transition:transform .6s var(--ease-editorial);overflow:auto;
}
.search.on{transform:none}
.search .x{position:absolute;top:20px;right:24px}
.search input{
  width:100%;font-family:var(--serif);font-weight:300;
  font-size:clamp(24px,6vw,84px);border:0;border-bottom:1px solid var(--ink);
  background:transparent;padding:12px 0 20px;outline:0;
  letter-spacing:-.02em;color:var(--ink);
}
.search input::placeholder{color:#b0ab9c}
.s-res{display:grid;grid-template-columns:repeat(auto-fill,minmax(210px,1fr));gap:24px;margin-top:44px}
.s-hit{
  display:grid;grid-template-columns:70px 1fr;gap:16px;align-items:center;
  text-align:left;padding:12px;border:1px solid var(--line);background:var(--cream);
  transition:border-color .3s var(--ease-smooth);
}
.s-hit:hover{border-color:var(--ink)}
.s-hit .t{background:var(--paper-2);aspect-ratio:1;padding:6px;display:grid;place-items:center}
.s-hit b{font-family:var(--serif);font-weight:400;font-size:16px;display:block;line-height:1.25}
.s-hit span{font-size:12px;color:var(--ink-2)}
.sugg{
  margin-top:24px;display:flex;gap:10px;flex-wrap:wrap;align-items:center;
  font-size:11px;letter-spacing:.16em;text-transform:uppercase;color:var(--ink-2);
  font-weight:500;
}
.sugg button{
  border:1px solid var(--line);padding:8px 16px;
  transition:border-color .3s var(--ease-smooth),color .3s var(--ease-smooth);
}
.sugg button:hover{border-color:var(--ink);color:var(--ink)}

`;
