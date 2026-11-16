export default `/* ============ REVIEWS ============ */
.rev{text-align:center;background:var(--cream);border-block:1px solid var(--line)}
.stars{color:var(--saddle);letter-spacing:.32em;font-size:14px;margin-bottom:32px}
.rev blockquote{
  font-family:var(--serif);font-weight:300;font-size:clamp(26px,3.6vw,52px);
  line-height:1.15;letter-spacing:-.02em;max-width:980px;margin:0 auto;
  min-height:3.5em;transition:opacity .5s var(--ease-smooth);
}
.rev cite{
  display:block;margin-top:32px;font-style:normal;font-size:11px;
  letter-spacing:.24em;text-transform:uppercase;color:var(--ink-2);font-weight:500;
}
.dots{display:flex;gap:12px;justify-content:center;margin-top:40px}
.dots button{width:36px;height:1px;background:var(--line);transition:background .4s var(--ease-smooth)}
.dots button.on{background:var(--ink)}

`;
