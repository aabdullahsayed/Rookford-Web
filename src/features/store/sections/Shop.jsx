import React from "react";
import { HeartIcon } from "../components/HeartIcon";
import { garment } from "../../../lib/garments";
import { DEFAULT_COLOR, money } from "../../../lib/helpers";

export function Shop({ addToCart, cat, openQV, productsLoading, sel, setCat, setSel, setSort, sort, toggleWish, visible, wish }) {
  return (
    <section className="shop" id="shop">
      <div className="wrap">
        <div className="sec-head">
          <div>
            <span className="sec-num">02 / The Shop</span>
            <h2 className="h-lg rv d1">Ready to <em>ride out.</em></h2>
          </div>
          <p className="rv d2" style={{ maxWidth: 340, color: "var(--ink-2)", fontSize: 15, lineHeight: 1.7 }}>
            Every piece ships with a lifetime repair tag. Hover for quick add, or open any piece for
            sizing and details.
          </p>
        </div>
        <div className="toolbar">
          <div className="tabs" role="tablist">
            {[["all", "All"], ["Jeans", "Jeans"], ["Jackets", "Jackets"], ["Shirts", "Shirts"], ["Headwear", "Headwear"], ["saved", "Saved ♥"]].map(([k, label]) => (
              <button
                key={k}
                className={`tab${cat === k ? " on" : ""}`}
                role="tab"
                aria-selected={cat === k}
                onClick={() => setCat(k)}
              >
                {label}
              </button>
            ))}
          </div>
          <div className="tools-r">
            <span>{visible.length}{visible.length === 1 ? " piece" : " pieces"}</span>
            <label className="sr" htmlFor="sort">Sort</label>
            <select className="sort" id="sort" value={sort} onChange={(e) => setSort(e.target.value)}>
              <option value="feat">Featured</option>
              <option value="lo">Price: low–high</option>
              <option value="hi">Price: high–low</option>
            </select>
          </div>
        </div>

        <div className="grid">
          {productsLoading ? (
            <div className="empty"><p>Loading the rail…</p></div>
          ) : !visible.length ? (
            <div className="empty">
              <h3>{cat === "saved" ? "Nothing saved yet." : "No pieces found."}</h3>
              <p>{cat === "saved" ? "Tap the heart on any piece to save it here." : "Try another category."}</p>
            </div>
          ) : (
            visible.map((p, i) => {
              const ci = sel[p.id] ?? 0;
              const color = p.colors[ci] || DEFAULT_COLOR;
              const saved = wish.includes(p.id);
              return (
                <article className="card" key={p.id} style={{ animationDelay: `${i * 50}ms` }}>
                  <div
                    className="media"
                    style={{ background: "radial-gradient(120% 70% at 50% 28%,#f5f3ee 0%,#dddcd6 58%,#c8c7bf 100%)" }}
                    onClick={() => openQV(p)}
                  >
                    {p.badge ? (
                      <span className={`badge${/low/i.test(p.badge) ? " low" : ""}`}>{p.badge}</span>
                    ) : null}
                    <button
                      className={`wish${saved ? " on" : ""}`}
                      aria-label={`Save ${p.name}`}
                      aria-pressed={saved}
                      onClick={(e) => { e.stopPropagation(); toggleWish(p.id); }}
                    >
                      <HeartIcon filled={saved} />
                    </button>
                    <div className="g" dangerouslySetInnerHTML={{ __html: garment(p.type, color) }} />
                    <div className="quick">
                      <small>Quick add — select size</small>
                      <div className="chips">
                        {p.sizes.map((s) => (
                          <button
                            key={s}
                            className="chip"
                            onClick={(e) => { e.stopPropagation(); addToCart(p, ci, s, 1, { openBag: true }); }}
                          >
                            {s}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                  <div className="info">
                    <div className="row">
                      <h3>{p.name}</h3>
                      <span className="price">{money(p.price)}</span>
                    </div>
                    <span className="cat">{p.cat} · {color.name}</span>
                    <div className="sw">
                      {p.colors.map((c, j) => (
                        <button
                          key={j}
                          className={j === ci ? "on" : ""}
                          style={{ background: c.b }}
                          aria-label={c.name}
                          onClick={() => setSel((prev) => ({ ...prev, [p.id]: j }))}
                        />
                      ))}
                    </div>
                  </div>
                </article>
              );
            })
          )}
        </div>
      </div>
    </section>
  );
}
