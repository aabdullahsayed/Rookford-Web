export default `/* ============ JOURNAL ============ */
.jgrid{display:grid;grid-template-columns:1.4fr 1fr 1fr;gap:32px}
.post{display:flex;flex-direction:column;gap:18px;cursor:pointer}
.post .pic{aspect-ratio:4/3;position:relative;overflow:hidden}
.post:first-child .pic{aspect-ratio:4/4.2}
.post .pic div{position:absolute;inset:0;transition:transform 1.1s var(--ease-editorial)}
.post:hover .pic div{transform:scale(1.05)}
.post h3{
  font-family:var(--serif);font-weight:300;font-size:clamp(22px,2.2vw,32px);
  line-height:1.15;letter-spacing:-.015em;
}
.post p{font-size:14px;color:var(--ink-2);line-height:1.65}
.post .meta{font-size:10.5px;letter-spacing:.2em;text-transform:uppercase;color:var(--saddle-d);font-weight:500}
@media(max-width:860px){.jgrid{grid-template-columns:1fr}}

`;
