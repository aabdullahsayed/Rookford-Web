export default `/* ============ TICKER ============ */
.ticker{background:var(--ink);color:var(--paper);overflow:hidden;white-space:nowrap;padding:18px 0}
.ticker-track{display:inline-flex;animation:tick 46s linear infinite}
.ticker:hover .ticker-track{animation-play-state:paused}
.ticker span{
  font-family:var(--serif);font-style:italic;font-weight:300;font-size:22px;
  padding:0 30px;display:inline-flex;align-items:center;gap:56px;
}
.ticker i{font-style:normal;color:var(--saddle);font-size:14px;opacity:.7}
@keyframes tick{to{transform:translateX(-50%)}}

/* ============ SECTIONS ============ */
section{padding:clamp(80px,11vw,160px) 0}
.sec-head{
  display:flex;justify-content:space-between;align-items:flex-end;gap:40px;
  margin-bottom:clamp(40px,5vw,72px);flex-wrap:wrap;
}
.sec-head .eyebrow{display:block;margin-bottom:18px}
.sec-head .h-lg em{color:var(--saddle-d)}
.sec-num{
  font-family:var(--serif);font-size:12px;letter-spacing:.24em;
  color:var(--saddle-d);display:block;margin-bottom:20px;
}

`;
