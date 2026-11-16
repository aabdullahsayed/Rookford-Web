import React from "react";

export function MobileNav({ goTo, menuOpen, setMenuOpen }) {
  return (
    <nav className={`mnav${menuOpen ? " open" : ""}`} aria-label="Mobile">
      <button className="ico x" aria-label="Close menu" onClick={() => setMenuOpen(false)}>
        <svg viewBox="0 0 24 24"><path d="M5 5l14 14M19 5 5 19" /></svg>
      </button>
      <a href="#shop" onClick={(e) => { e.preventDefault(); goTo("#shop", "all"); }}>Shop</a>
      <a href="#collections" onClick={(e) => { e.preventDefault(); goTo("#collections"); }}>Collections</a>
      <a href="#fade" onClick={(e) => { e.preventDefault(); goTo("#fade"); }}>Fade Guide</a>
      <a href="#lookbook" onClick={(e) => { e.preventDefault(); goTo("#lookbook"); }}>Lookbook</a>
      <a href="#journal" onClick={(e) => { e.preventDefault(); goTo("#journal"); }}>Journal</a>
    </nav>
  );
}
