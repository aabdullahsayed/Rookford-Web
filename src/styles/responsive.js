export default `/* ============ RESPONSIVE < 600px ============ */
@media(max-width:600px){
  .wrap{width:calc(100% - 32px)}
  .f-top{grid-template-columns:1fr;gap:36px}
  .f-top > div:first-child{grid-column:1/-1}
  .hero-meta{flex-direction:column;gap:20px}
  .stats{grid-template-columns:1fr}
  .stat{border-right:none !important;border-bottom:1px solid var(--line);padding:28px 0 !important}
  .stat:last-child{border-bottom:none}
  .grid{gap:20px 10px}
  .hero-art{min-height:56vh}
  .hero-badge{width:78px;height:78px;right:12px;bottom:12px}
  .hero-cap{font-size:9px;max-width:140px;left:12px;bottom:12px;line-height:1.55}
  .co-head-in{grid-template-columns:1fr auto}
  .co-head .link{display:none}
  .co-head .logo{justify-self:start}
  .m-media{padding:32px;min-height:260px}
  .m-info h2{font-size:28px}
  .tools-r{width:100%;justify-content:space-between;margin-top:12px}
  .nav-in{height:60px}
  .sec-head .h-lg{margin-top:12px}
  .promises{grid-template-columns:1fr;gap:32px}
  .checkout-co-grid{grid-template-columns:1fr}
}
`;
