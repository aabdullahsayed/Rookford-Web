import React from "react";
import { HeartIcon } from "../components/HeartIcon";
import { FREE_SHIPPING, INS } from "../../../lib/constants";
import { garment } from "../../../lib/garments";
import { DEFAULT_COLOR, money } from "../../../lib/helpers";

export function QuickView({ addToCart, onQvLeave, onQvMove, qv, qvBoxRef, setBagOpen, setQv, setSel, toast, toggleWish, wish }) {
  return (
    <div className={`modal${qv ? " on" : ""}`} role="dialog" aria-modal="true" aria-label="Product details">
      <div className="m-box" ref={qvBoxRef} onPointerMove={onQvMove} onPointerLeave={onQvLeave}>
        {qv && (
          <>
            <button
              className="ico m-x"
              aria-label="Close"
              onClick={() => setQv(null)}
              style={{ position: "absolute", top: 10, right: 10, zIndex: 3, background: "var(--cream)" }}
            >
              <svg viewBox="0 0 24 24"><path d="M5 5l14 14M19 5 5 19" /></svg>
            </button>
            <div className="m-media">
              <div dangerouslySetInnerHTML={{ __html: garment(qv.product.type, qv.product.colors[qv.ci] || DEFAULT_COLOR) }} />
              <span className="m-hint">Move your cursor to rotate · 3D preview</span>
            </div>
            <div className="m-info">
              <div>
                <span className="eyebrow bare">{qv.product.cat}{qv.product.badge ? " · " + qv.product.badge : ""}</span>
                <h2 style={{ marginTop: 14 }}>{qv.product.name}</h2>
              </div>
              <div className="price">{money(qv.product.price * qv.qty)}</div>
              {qv.product.desc ? <p className="desc">{qv.product.desc}</p> : null}
              <div>
                <div className="lbl"><span>Colour — {(qv.product.colors[qv.ci] || DEFAULT_COLOR).name}</span></div>
                <div className="sw" style={{ margin: 0, gap: 12 }}>
                  {qv.product.colors.map((c, j) => (
                    <button
                      key={j}
                      className={j === qv.ci ? "on" : ""}
                      style={{ background: c.b, width: 24, height: 24 }}
                      aria-label={c.name}
                      onClick={() => { setQv((s) => ({ ...s, ci: j })); setSel((prev) => ({ ...prev, [qv.product.id]: j })); }}
                    />
                  ))}
                </div>
              </div>
              <div>
                <div className={`lbl${qv.sizeError ? " err shake" : ""}`}>
                  <span>{qv.sizeError ? "Please select a size" : "Size"}</span>
                  <a onClick={() => toast(qv.product.type === "jeans"
                    ? "Waist in inches. Raw denim shrinks ~3–4% — buy true to size."
                    : "Size down for a closer fit; true to size for layering.")}>Size guide</a>
                </div>
                <div className="chips">
                  {qv.product.sizes.map((z) => (
                    <button
                      key={z}
                      className={`chip${z === qv.size ? " on" : ""}`}
                      onClick={() => setQv((s) => ({ ...s, size: z, sizeError: false }))}
                    >
                      {z}
                    </button>
                  ))}
                </div>
              </div>
              {qv.product.type === "jeans" && (
                <div>
                  <div className="lbl"><span>Inseam — free chainstitch hem</span></div>
                  <div className="chips">
                    {INS.map((z) => (
                      <button key={z} className={`chip${z === qv.ins ? " on" : ""}`} onClick={() => setQv((s) => ({ ...s, ins: z }))}>
                        {z}
                      </button>
                    ))}
                  </div>
                </div>
              )}
              <div>
                <div className="lbl">
                  <span>Special request <span style={{ textTransform: "none", letterSpacing: 0, color: "var(--ink-2)", fontWeight: 400 }}>(optional)</span></span>
                </div>
                <input
                  className="qnote"
                  maxLength={120}
                  placeholder="Hem length, monogram, patch placement…"
                  value={qv.note}
                  onChange={(e) => setQv((s) => ({ ...s, note: e.target.value }))}
                />
              </div>
              <div className="m-act">
                <span className="qty" style={{ alignSelf: "stretch" }}>
                  <button aria-label="Decrease" onClick={() => setQv((s) => ({ ...s, qty: Math.max(1, s.qty - 1) }))}>–</button>
                  <span style={{ display: "grid", placeItems: "center" }}>{qv.qty}</span>
                  <button aria-label="Increase" onClick={() => setQv((s) => ({ ...s, qty: Math.min(9, s.qty + 1) }))}>+</button>
                </span>
                <button
                  className="btn solid"
                  onClick={() => {
                    if (!qv.size) { setQv((s) => ({ ...s, sizeError: true })); return; }
                    addToCart(qv.product, qv.ci, qv.size, qv.qty, { ins: qv.ins, note: qv.note });
                    setQv(null);
                    setBagOpen(true);
                  }}
                >
                  Add to bag — {money(qv.product.price * qv.qty)}
                </button>
                <button
                  className="ico"
                  aria-label="Save"
                  style={{ border: "1px solid var(--line)" }}
                  onClick={() => toggleWish(qv.product.id)}
                >
                  <HeartIcon filled={wish.includes(qv.product.id)} />
                </button>
              </div>
              <div>
                {qv.product.fabric && <details open><summary>Fabric</summary><p>{qv.product.fabric}</p></details>}
                {qv.product.fit && <details><summary>Fit</summary><p>{qv.product.fit}</p></details>}
                <details>
                  <summary>Shipping &amp; care</summary>
                  <p>Free shipping over {money(FREE_SHIPPING)}. Free 30-day returns. Free chainstitch hemming and lifetime repairs. Made in Bangladesh.</p>
                </details>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
