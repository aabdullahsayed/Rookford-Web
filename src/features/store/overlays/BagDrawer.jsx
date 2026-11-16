import React from "react";
import { LineNote } from "../components/LineNote";
import { FREE_SHIPPING } from "../../../lib/constants";
import { garment } from "../../../lib/garments";
import { money } from "../../../lib/helpers";

export function BagDrawer({ applyPromo, bagOpen, cart, goTo, openCheckout, promoInput, removeLine, setBagOpen, setLineNote, setPromoInput, totals, updateQty }) {
  return (
    <aside className={`drawer${bagOpen ? " on" : ""}`} aria-label="Shopping bag" aria-hidden={!bagOpen}>
      <div className="d-head">
        <h3>
          Your bag <span style={{ fontSize: 15, color: "var(--ink-2)" }}>
            {cart.length ? `(${cart.reduce((a, l) => a + l.qty, 0)})` : ""}
          </span>
        </h3>
        <button className="ico" aria-label="Close bag" onClick={() => setBagOpen(false)}>
          <svg viewBox="0 0 24 24"><path d="M5 5l14 14M19 5 5 19" /></svg>
        </button>
      </div>
      <div className="ship">
        {cart.length
          ? (totals.tot >= FREE_SHIPPING
              ? <b>You’ve unlocked free shipping</b>
              : <>You’re <b>{money(FREE_SHIPPING - totals.tot)}</b> away from free shipping</>)
          : <>Free shipping over {money(FREE_SHIPPING)}</>}
        <div className="bar">
          <i style={{ width: `${Math.min(100, (totals.tot / FREE_SHIPPING) * 100)}%` }} />
        </div>
      </div>
      <div className="d-body">
        {!cart.length ? (
          <div className="d-empty">
            <div className="h-md">Your bag is empty.</div>
            <p>Good denim is worth the wait. Let’s find yours.</p>
            <div style={{ marginTop: 32 }}>
              <button className="btn solid" onClick={() => { setBagOpen(false); goTo("#shop"); }}>
                Start shopping <span className="arrow">→</span>
              </button>
            </div>
          </div>
        ) : (
          cart.map((l, i) => (
            <div className="line" key={l.key}>
              <div className="th" dangerouslySetInnerHTML={{ __html: garment(l.type, l.color) }} />
              <div>
                <h4>{l.name}</h4>
                <div className="sub">{l.color.name} · Size {l.size}{l.ins ? " · Inseam " + l.ins : ""}</div>
                {l.note ? <div className="lnote">“{l.note}”</div> : null}
                <div className="lr">
                  <div>
                    <span className="qty">
                      <button aria-label="Decrease" onClick={() => updateQty(i, -1)}>–</button>
                      <span>{l.qty}</span>
                      <button aria-label="Increase" onClick={() => updateQty(i, 1)}>+</button>
                    </span>
                    <button className="rm" onClick={() => removeLine(i)}>Remove</button>
                  </div>
                  <b>{money(l.price * l.qty)}</b>
                </div>
                <LineNote value={l.note} onChange={(v) => setLineNote(i, v)} />
              </div>
            </div>
          ))
        )}
      </div>
      {cart.length > 0 && (
        <div className="d-foot">
          <div className="promo">
            <input
              placeholder="Promo code"
              aria-label="Promo code"
              value={promoInput}
              onChange={(e) => setPromoInput(e.target.value)}
            />
            <button onClick={applyPromo}>Apply</button>
          </div>
          <div className="tot"><span>Subtotal</span><span>{money(totals.sub)}</span></div>
          {totals.disc > 0 && (
            <div className="tot"><span>WEST10 (−10%)</span><span>−{money(totals.disc)}</span></div>
          )}
          <div className="tot">
            <span>Shipping</span>
            <span>{totals.tot >= FREE_SHIPPING ? "Free" : "Calculated at checkout"}</span>
          </div>
          <div className="tot big"><span>Total</span><span>{money(totals.tot)}</span></div>
          <button className="btn solid" onClick={openCheckout}>
            Checkout <span className="arrow">→</span>
          </button>
          <small>Chainstitch hemming included. Duties handled for you. Made in Bangladesh.</small>
        </div>
      )}
    </aside>
  );
}
