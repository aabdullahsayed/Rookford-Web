import React from "react";
import { garment } from "../../../lib/garments";
import { DEFAULT_COLOR, money } from "../../../lib/helpers";

export function SearchOverlay({ openQV, query, searchOpen, searchResults, setQuery, setSearchOpen }) {
  return (
    <div className={`search${searchOpen ? " on" : ""}`} role="dialog" aria-label="Search">
      <button className="ico x" aria-label="Close search" onClick={() => setSearchOpen(false)}>
        <svg viewBox="0 0 24 24"><path d="M5 5l14 14M19 5 5 19" /></svg>
      </button>
      <div className="wrap">
        <input
          type="search"
          placeholder="Search jeans, jackets, hats…"
          autoComplete="off"
          aria-label="Search products"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          autoFocus
        />
        <div className="sugg">
          <span>Try</span>
          {["Raw indigo", "Chore", "Black", "Hat"].map((s) => (
            <button key={s} onClick={() => setQuery(s)}>{s}</button>
          ))}
        </div>
        <div className="s-res">
          {searchResults.length ? (
            searchResults.map((p) => (
              <button className="s-hit" key={p.id} onClick={() => { setSearchOpen(false); setTimeout(() => openQV(p), 200); }}>
                <div className="t" dangerouslySetInnerHTML={{ __html: garment(p.type, p.colors[0] || DEFAULT_COLOR) }} />
                <div><b>{p.name}</b><span>{p.cat} · {money(p.price)}</span></div>
              </button>
            ))
          ) : (
            <p style={{ color: "var(--ink-2)" }}>Nothing found for “{query}”.</p>
          )}
        </div>
      </div>
    </div>
  );
}
