export default `/* ============ CRAFT ============ */
.craft{background:var(--paper-2);border-block:1px solid var(--line)}
.stats{display:grid;grid-template-columns:repeat(4,1fr);border-top:1px solid var(--ink)}
.stat{padding:36px 28px 12px 28px;border-right:1px solid var(--line)}
.stat:first-child{padding-left:0}
.stat:last-child{border-right:0}
.stat b{
  font-family:var(--display);font-weight:600;
  font-size:clamp(44px,5.4vw,88px);line-height:1;letter-spacing:-.03em;display:block;
}
.stat b sup{font-size:.34em;vertical-align:top;margin-left:4px;letter-spacing:.1em}
.stat span{
  font-size:11px;letter-spacing:.18em;text-transform:uppercase;
  color:var(--ink-2);display:block;margin-top:12px;font-weight:500;
}
.stat p{font-size:14px;color:var(--ink-2);margin-top:12px;max-width:240px;line-height:1.65}

.promises{display:grid;grid-template-columns:repeat(3,1fr);gap:48px;margin-top:80px}
.promise .ic{
  width:46px;height:46px;border:1px solid var(--ink);border-radius:50%;
  display:grid;place-items:center;margin-bottom:22px;
}
.promise .ic svg{width:18px;height:18px;stroke:var(--ink);fill:none;stroke-width:1.4;stroke-linecap:round;stroke-linejoin:round}
.promise h4{font-family:var(--serif);font-weight:400;font-size:22px;margin-bottom:10px;letter-spacing:-.005em}
.promise p{color:var(--ink-2);font-size:15px;line-height:1.65}

`;
