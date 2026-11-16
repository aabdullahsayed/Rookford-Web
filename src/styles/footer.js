export default `/* ============ PREMIUM EDITORIAL FOOTER ============ */
footer {
  background: var(--indigo);
  color: var(--paper);
  /* Added top padding since the giant text is gone */
  padding: 80px 0 36px 0;
  position: relative;
  overflow: hidden;
}

.rope {
  position: absolute;
  top: 0; left: 0; right: 0;
  height: 6px;
  background: repeating-linear-gradient(135deg,var(--saddle) 0 6px,#d9a56a 6px 9px,var(--saddle-d) 9px 12px);
  opacity: .9;
}

/* Main Grid Layout */
.f-grid {
  display: grid;
  grid-template-columns: 2fr 1fr 1fr 1fr;
  gap: 60px;
  padding-bottom: 72px;
}

/* Logo Styling */
.f-logo-wrap {
  max-width: 140px; /* Constrains the logo size */
  margin-bottom: 28px;
}
.f-logo-wrap img {
  width: 100%;
  height: auto;
  display: block;
  border-radius: 6px; /* Softens the square edges */
  box-shadow: 0 10px 30px rgba(0,0,0,0.4); /* Premium lift off the background */
}

.f-brand p {
  color: rgba(234,232,227,.5);
  font-family: var(--sans);
  font-size: 13px;
  max-width: 260px;
  line-height: 1.8;
  letter-spacing: 0.02em;
}

/* Social Icons */
.f-socials {
  display: flex;
  gap: 12px;
  margin-top: 32px;
}
.soc {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  border: 1px solid rgba(234,232,227,.15);
  display: grid;
  place-items: center;
  color: rgba(234,232,227,.7);
  transition: all .4s var(--ease-editorial);
}
.soc svg { width: 16px; height: 16px; }

.soc:hover {
  color: #fff;
  transform: translateY(-4px);
  /* Real Brand Colors on Hover */
}
.soc.ig:hover { background: linear-gradient(45deg, #f09433 0%,#e6683c 25%,#dc2743 50%,#cc2366 75%,#bc1888 100%); border-color: transparent; }
.soc.tw:hover { background: #000; border-color: #333; }
.soc.fb:hover { background: #1877F2; border-color: transparent; }
.soc.pin:hover { background: #E60023; border-color: transparent; }

/* Navigation Links Columns */
.f-col {
  display: flex;
  flex-direction: column; /* Forces vertical stacking */
  gap: 14px;
}
.f-col h5 {
  font-family: var(--sans);
  font-size: 10px;
  letter-spacing: .2em;
  text-transform: uppercase;
  color: var(--saddle);
  margin-bottom: 8px;
  font-weight: 600;
}
.f-col a {
  font-family: var(--sans);
  font-size: 13px;
  letter-spacing: .05em;
  text-transform: uppercase;
  color: rgba(234,232,227,.6);
  text-decoration: none;
  transition: all .3s var(--ease-smooth);
  display: inline-block;
  width: fit-content;
}
.f-col a:hover {
  color: #fff;
  transform: translateX(6px); /* Smooth slide right effect */
}

/* Bottom Bar */
.f-bot {
  display: flex;
  justify-content: space-between;
  gap: 24px;
  flex-wrap: wrap;
  padding-top: 32px;
  border-top: 1px solid rgba(234,232,227,.1);
  font-family: var(--sans);
  font-size: 11px;
  letter-spacing: .1em;
  text-transform: uppercase;
  color: rgba(234,232,227,.4);
}

/* Mobile Responsive */
@media(max-width:900px) {
  .f-grid {
    grid-template-columns: 1fr 1fr;
    gap: 40px;
  }
  .f-brand {
    grid-column: 1 / -1;
    align-items: flex-start;
  }
  .f-bot { flex-direction: column; align-items: center; text-align: center; }
}
`;
