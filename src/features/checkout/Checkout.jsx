import React, { useEffect, useRef, useState } from "react";
import { API } from "../../lib/api";
import { COUNTRIES, FREE_SHIPPING, PAY, SHIP } from "../../lib/constants";
import { garment } from "../../lib/garments";
import { esc, money, store } from "../../lib/helpers";

export function Checkout({ open, cart, totals, onClose, onEditBag }) {
  const [cust, setCust] = useState(() => store.get("rf_cust", { country: "Bangladesh", contact: "Email" }));
  const [opt, setOpt] = useState({ ship: "std", pay: "card", hem: "", gift: false, giftMsg: "", notes: "", terms: false });
  const [step, setStep] = useState(1);
  const [errs, setErrs] = useState({});
  const [placing, setPlacing] = useState(false);
  const [done, setDone] = useState(null);
  const [apiError, setApiError] = useState("");
  const scrollRef = useRef(null);

  useEffect(() => {
    if (!open) return;
    setStep(1);
    setErrs({});
    setDone(null);
    setApiError("");
    if (scrollRef.current) scrollRef.current.scrollTop = 0;
  }, [open]);

  useEffect(() => { store.set("rf_cust", cust); }, [cust]);

  const shipCost = opt.ship === "std" ? (totals.tot >= FREE_SHIPPING ? 0 : SHIP.std.p) : SHIP[opt.ship].p;
  const fee = PAY[opt.pay].f;
  const total = totals.tot + shipCost + fee;
  const scrollTop = () => scrollRef.current && scrollRef.current.scrollTo({ top: 0, behavior: "smooth" });
  const setField = (k, v) => setCust((c) => ({ ...c, [k]: v }));

  const validate1 = () => {
    const e = {};
    const v = (k) => (cust[k] || "").trim();
    if (!v("fn")) e.fn = "Enter your first name";
    if (!v("ln")) e.ln = "Enter your last name";
    if (!/^\S+@\S+\.\S+$/.test(v("email"))) e.email = "Enter a valid email address";
    if (!/^[+()\d][\d\s().-]{6,}$/.test(v("phone"))) e.phone = "Enter a valid phone number";
    if (v("a1").length < 4) e.a1 = "Enter your street address";
    if (!v("city")) e.city = "Enter your city";
    if (!v("zip")) e.zip = "Enter your postal code";
    return e;
  };

  const next = () => {
    if (step === 1) {
      const e = validate1();
      setErrs(e);
      if (Object.keys(e).length) return;
      setStep(2);
    } else if (step === 2) setStep(3);
    scrollTop();
  };

  const placeOrder = async () => {
    if (!opt.terms) { setErrs((p) => ({ ...p, terms: true })); return; }
    setPlacing(true);
    setApiError("");
    const payload = {
      customer: { ...cust },
      delivery: SHIP[opt.ship].n,
      payment: PAY[opt.pay].n,
      hemming: opt.hem,
      notes: opt.notes,
      gift: opt.gift ? opt.giftMsg || "(no message)" : "",
      items: cart.map((l) => ({
        productId: l.productId,
        name: l.name,
        colour: l.color.name,
        size: l.size,
        inseam: l.ins || "",
        note: l.note || "",
        qty: l.qty,
        price: l.price,
      })),
      totals: { subtotal: totals.sub, discount: totals.disc, shipping: shipCost, fees: fee, total },
    };
    try {
      const res = await fetch(API.orders, {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error(res.status);
      const data = await res.json().catch(() => ({}));
      setDone({ ...payload, no: data.orderNumber || data.no || data.id || "—", date: new Date().toISOString() });
      scrollTop();
    } catch {
      setApiError("We couldn't reach the order service. Please try again.");
    } finally {
      setPlacing(false);
    }
  };

  const fld = (k, label, o = {}) => {
    const { req, type = "text", ph = "", full, ac = "", max = 80 } = o;
    return (
      <div className={`fld${full ? " full" : ""}${errs[k] ? " bad" : ""}`}>
        <label htmlFor={`f_${k}`}>
          {label}
          {req ? <i> *</i> : null}
        </label>
        <input
          id={`f_${k}`}
          type={type}
          value={cust[k] || ""}
          placeholder={ph}
          autoComplete={ac}
          maxLength={max}
          onChange={(e) => {
            setField(k, e.target.value);
            if (errs[k]) setErrs((p) => { const n = { ...p }; delete n[k]; return n; });
          }}
        />
        <small className="err">{errs[k] || ""}</small>
      </div>
    );
  };

  const radios = (name, obj) =>
    Object.entries(obj).map(([k, v]) => (
      <label className={`opt${opt[name] === k ? " on" : ""}`} key={k}>
        <input
          type="radio"
          name={name}
          value={k}
          checked={opt[name] === k}
          onChange={() => setOpt((o) => ({ ...o, [name]: k }))}
        />
        <span className="rd" />
        <span>
          <b>{v.n}</b>
          <small>{v.t}</small>
        </span>
      </label>
    ));

  const side = (
    <aside className="co-side">
      <div className="side-h">
        <span>Order summary</span>
        <button className="link" type="button" onClick={onEditBag}>Edit bag</button>
      </div>
      {cart.map((l) => (
        <div className="s-it" key={l.key}>
          <div className="th">
            <span dangerouslySetInnerHTML={{ __html: garment(l.type, l.color) }} />
            <span className="q">{l.qty}</span>
          </div>
          <div>
            <b>{l.name}</b>
            <small>{l.color.name} · {l.size}{l.ins ? " · " + l.ins : ""}</small>
            {l.note ? <small className="nt">“{l.note}”</small> : null}
          </div>
          <span>{money(l.price * l.qty)}</span>
        </div>
      ))}
      <div style={{ paddingTop: 12 }}>
        <div className="tot"><span>Subtotal</span><span>{money(totals.sub)}</span></div>
        {totals.disc > 0 && <div className="tot"><span>Promo (−10%)</span><span>−{money(totals.disc)}</span></div>}
        <div className="tot"><span>Shipping</span><span>{shipCost ? money(shipCost) : "Free"}</span></div>
        {fee > 0 && <div className="tot"><span>Cash on delivery</span><span>{money(fee)}</span></div>}
        <div className="tot big"><span>Total</span><span>{money(total)}</span></div>
      </div>
    </aside>
  );

  let main;
  if (done) {
    main = (
      <div className="co-done">
        <div className="tick"><svg viewBox="0 0 24 24"><path d="M5 12.5l4.5 4.5L19 7.5" /></svg></div>
        <span className="eyebrow">Order confirmed</span>
        <h2 className="co-h" style={{ margin: "14px 0" }}>Thank you, {done.customer.fn}.</h2>
        <p className="co-p" style={{ marginInline: "auto" }}>
          Order <b>{done.no}</b> is in. Details are on their way to <b>{done.customer.email}</b>
          {done.hemming ? ", and your hemming notes have gone to the bench" : ""}.
        </p>
        <div className="rv-card" style={{ textAlign: "left", maxWidth: 560, margin: "28px auto" }}>
          {done.items.map((i, idx) => (
            <div key={idx}>
              <div style={{ display: "flex", justifyContent: "space-between", gap: 16 }}>
                <span>{i.qty} × {i.name} <span style={{ color: "var(--ink-2)" }}>— {i.colour}, {i.size}{i.inseam ? ", " + i.inseam : ""}</span></span>
                <b>{money(i.price * i.qty)}</b>
              </div>
              {i.note ? <div className="lnote">“{i.note}”</div> : null}
            </div>
          ))}
          <div style={{ borderTop: "1px solid var(--line)", marginTop: 12, paddingTop: 12, display: "flex", justifyContent: "space-between" }}>
            <span>{done.delivery} · {done.payment}</span>
            <b>Total {money(done.totals.total)}</b>
          </div>
        </div>
        <div className="co-nav" style={{ justifyContent: "center" }}>
          <button className="btn ghost" type="button" onClick={onEditBag}>Back to bag</button>
          <button className="btn solid" type="button" onClick={onClose}>Continue shopping <span className="arrow">→</span></button>
        </div>
      </div>
    );
  } else if (step === 1) {
    main = (
      <>
        <h2 className="co-h">Who’s it for?</h2>
        <p className="co-p">Tell us where to send your order. We’ll only use these details for your delivery and updates.</p>
        <div className="fgrid">
          {fld("fn", "First name", { req: 1, ac: "given-name" })}
          {fld("ln", "Last name", { req: 1, ac: "family-name" })}
          {fld("email", "Email", { req: 1, type: "email", ac: "email", ph: "you@example.com" })}
          {fld("phone", "Phone number", { req: 1, type: "tel", ac: "tel", ph: "+880 1XXX XXX XXX" })}
          {fld("wa", "WhatsApp number (optional)", { type: "tel", full: 1, ph: "If different from phone" })}
        </div>
        <h3 className="co-sub">Delivery address</h3>
        <div className="fgrid">
          <div className="fld full">
            <label htmlFor="f_country">Country <i>*</i></label>
            <select id="f_country" value={cust.country} onChange={(e) => setField("country", e.target.value)}>
              {COUNTRIES.map((c) => <option key={c}>{c}</option>)}
            </select>
          </div>
          {fld("a1", "Street address", { req: 1, full: 1, ac: "address-line1", max: 120 })}
          {fld("a2", "Apartment, suite, floor (optional)", { full: 1, ac: "address-line2", max: 120 })}
          {fld("city", "City / Town", { req: 1, ac: "address-level2" })}
          {fld("region", "State / Region / District", { ac: "address-level1" })}
          {fld("zip", "Postal code", { req: 1, ac: "postal-code", max: 16 })}
          {fld("landmark", "Landmark or delivery instructions (optional)", { full: 1, max: 160, ph: "Near the post office, ring twice, leave with the doorman…" })}
          <div className="fld full">
            <label>Best way to reach you</label>
            <div className="chips">
              {["Email", "Phone call", "WhatsApp", "SMS"].map((c) => (
                <button type="button" key={c} className={`chip${cust.contact === c ? " on" : ""}`} onClick={() => setField("contact", c)}>{c}</button>
              ))}
            </div>
          </div>
        </div>
        <div className="co-nav">
          <button className="btn ghost" type="button" onClick={onEditBag}>← Back to bag</button>
          <button className="btn solid" type="button" onClick={next}>Continue to delivery <span className="arrow">→</span></button>
        </div>
      </>
    );
  } else if (step === 2) {
    main = (
      <>
        <h2 className="co-h">Delivery &amp; your notes</h2>
        <p className="co-p">Choose how it reaches you, and tell us anything that makes the order right.</p>
        <h3 className="co-sub" style={{ marginTop: 0, border: 0, padding: 0 }}>Delivery method</h3>
        <div className="opts">{radios("ship", SHIP)}</div>
        <h3 className="co-sub">Payment</h3>
        <div className="opts">{radios("pay", PAY)}</div>
        <p style={{ fontSize: 12, color: "var(--ink-2)", marginTop: 10 }}>No card details are collected on this page.</p>
        <h3 className="co-sub">Hemming &amp; customisation</h3>
        <div className="fld full">
          <label htmlFor="o_hem">Hemming, alterations or custom requests</label>
          <textarea
            id="o_hem"
            rows={3}
            maxLength={400}
            placeholder="e.g. Hem the No. 1 to a 31 in inseam in ecru thread, monogram R.K. on the back pocket…"
            value={opt.hem}
            onChange={(e) => setOpt((o) => ({ ...o, hem: e.target.value }))}
          />
          <small className="cnt-s">{opt.hem.length}/400</small>
        </div>
        <h3 className="co-sub">Anything else?</h3>
        <div className="fld full">
          <label htmlFor="o_notes">Order comments</label>
          <textarea
            id="o_notes"
            rows={3}
            maxLength={500}
            placeholder="Delivery timing, packaging preferences, gate codes, a question for the team…"
            value={opt.notes}
            onChange={(e) => setOpt((o) => ({ ...o, notes: e.target.value }))}
          />
          <small className="cnt-s">{opt.notes.length}/500</small>
        </div>
        <label className="chk">
          <input type="checkbox" checked={opt.gift} onChange={(e) => setOpt((o) => ({ ...o, gift: e.target.checked }))} /> This order is a gift
        </label>
        {opt.gift && (
          <div className="fld full">
            <label htmlFor="o_gm">Gift message</label>
            <textarea
              id="o_gm"
              rows={2}
              maxLength={200}
              placeholder="Printed on a card — no prices shown."
              value={opt.giftMsg}
              onChange={(e) => setOpt((o) => ({ ...o, giftMsg: e.target.value }))}
            />
          </div>
        )}
        <div className="co-nav">
          <button className="btn ghost" type="button" onClick={() => { setStep(1); scrollTop(); }}>← Back</button>
          <button className="btn solid" type="button" onClick={next}>Review order <span className="arrow">→</span></button>
        </div>
      </>
    );
  } else {
    const addr = [cust.a1, cust.a2, [cust.city, cust.region].filter(Boolean).join(", ") + " " + (cust.zip || ""), cust.country, cust.landmark ? "Note: " + cust.landmark : ""]
      .filter((x) => x && String(x).trim())
      .map((x, i) => <React.Fragment key={i}>{x}<br /></React.Fragment>);
    main = (
      <>
        <h2 className="co-h">Review &amp; place order</h2>
        <p className="co-p">One last look. You can edit anything before you confirm.</p>
        <div className="rv-grid">
          <div className="rv-card">
            <div className="rv-h"><span>Contact</span><button className="link" type="button" onClick={() => { setStep(1); scrollTop(); }}>Edit</button></div>
            <b>{cust.fn} {cust.ln}</b><br />{cust.email}<br />{cust.phone}
            {cust.wa ? <><br />WhatsApp: {cust.wa}</> : null}
            <br /><span style={{ color: "var(--ink-2)" }}>Prefers: {cust.contact}</span>
          </div>
          <div className="rv-card">
            <div className="rv-h"><span>Ship to</span><button className="link" type="button" onClick={() => { setStep(1); scrollTop(); }}>Edit</button></div>
            {addr}
          </div>
          <div className="rv-card">
            <div className="rv-h"><span>Delivery &amp; payment</span><button className="link" type="button" onClick={() => { setStep(2); scrollTop(); }}>Edit</button></div>
            <b>{SHIP[opt.ship].n}</b> — {shipCost ? money(shipCost) : "Free"}<br />
            {PAY[opt.pay].n}{fee ? " — " + money(fee) : ""}
          </div>
          <div className="rv-card">
            <div className="rv-h"><span>Hemming &amp; notes</span><button className="link" type="button" onClick={() => { setStep(2); scrollTop(); }}>Edit</button></div>
            <b>Custom:</b> {opt.hem ? esc(opt.hem) : <span style={{ color: "var(--ink-2)" }}>None</span>}<br />
            <b>Comments:</b> {opt.notes ? esc(opt.notes) : <span style={{ color: "var(--ink-2)" }}>None</span>}
            {opt.gift ? <><br /><b>Gift message:</b> {opt.giftMsg ? esc(opt.giftMsg) : "(no message)"}</> : null}
          </div>
        </div>
        <label className={`chk terms${errs.terms ? " bad" : ""}`}>
          <input
            type="checkbox"
            checked={opt.terms}
            onChange={(e) => {
              setOpt((o) => ({ ...o, terms: e.target.checked }));
              if (e.target.checked) setErrs((p) => { const n = { ...p }; delete n.terms; return n; });
            }}
          /> I agree to the terms of sale and the 30-day returns policy.
        </label>
        {apiError && <p style={{ color: "var(--rust)", fontSize: 13, marginTop: 8 }}>{apiError}</p>}
        <div className="co-nav">
          <button className="btn ghost" type="button" onClick={() => { setStep(2); scrollTop(); }}>← Back</button>
          <button className="btn solid" type="button" onClick={placeOrder} disabled={placing}>
            {placing ? "Placing order…" : `Place order — ${money(total)}`}
          </button>
        </div>
      </>
    );
  }

  return (
    <div className={`co${open ? " on" : ""}`} role="dialog" aria-modal="true" aria-label="Checkout" ref={scrollRef}>
      <div className="co-head">
        <div className="wrap co-head-in">
          <button className="link" style={{ justifySelf: "start" }} type="button" onClick={onEditBag}>← Back to bag</button>
          <span className="logo">ROOKFORD</span>
          <span className="eyebrow">Secure checkout</span>
        </div>
      </div>
      <div className="wrap co-grid">
        <div className="co-main">
          <ol className="steps">
            {["Your details", "Delivery & notes", "Review"].map((t, i) => (
              <li key={t} className={i + 1 === step ? "on" : i + 1 < step ? "done" : ""}>
                <span>{i + 1 < step ? "✓" : i + 1}</span>{t}
              </li>
            ))}
          </ol>
          {main}
        </div>
        {done ? null : side}
      </div>
    </div>
  );
}
