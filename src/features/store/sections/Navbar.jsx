import React from "react";

export function Navbar({ cart, goTo, openBag, scrolled, setCat, setMenuOpen, setSearchOpen, wish }) {
  return (
    <header className={`nav${scrolled ? " scrolled" : ""}`} id="nav">
      <div className="wrap nav-in">
        <button className="ico burger" aria-label="Open menu" onClick={() => setMenuOpen(true)}>
          <svg viewBox="0 0 24 24"><path d="M3 8h18M3 16h18" /></svg>
        </button>

        <nav className="nav-links" aria-label="Primary">
          <a href="#shop" onClick={(e) => { e.preventDefault(); goTo("#shop", "all"); }}>Shop</a>
          <a href="#collections" onClick={(e) => { e.preventDefault(); goTo("#collections"); }}>Collections</a>
          <a href="#fade" onClick={(e) => { e.preventDefault(); goTo("#fade"); }}>Fade Guide</a>
          <a href="#journal" onClick={(e) => { e.preventDefault(); goTo("#journal"); }}>Journal</a>
        </nav>

        <a href="#top" className="logo" aria-label="Rookford home" onClick={(e) => { e.preventDefault(); window.scrollTo({ top: 0, behavior: "smooth" }); }}>
          ROOKFORD
        </a>

        <div className="nav-tools">
          <button className="ico" aria-label="Search" onClick={() => setSearchOpen(true)}>
            <svg viewBox="0 0 24 24"><circle cx="11" cy="11" r="6.5" /><path d="m20 20-4.2-4.2" /></svg>
          </button>
          <button className="ico" aria-label="Saved items" onClick={() => { setCat("saved"); goTo("#shop"); }}>
            <svg viewBox="0 0 24 24"><path d="M12 20s-7.5-4.6-7.5-10.2A4.3 4.3 0 0 1 12 7.3a4.3 4.3 0 0 1 7.5 2.5C19.5 15.4 12 20 12 20Z" /></svg>
            <span className="cnt" data-n={wish.length}>{wish.length || ""}</span>
          </button>
          <button className="ico" aria-label="Open bag" onClick={openBag}>
            <svg viewBox="0 0 24 24"><path d="M5 8h14l-1 12H6L5 8Z" /><path d="M9 8V6.5a3 3 0 0 1 6 0V8" /></svg>
            <span className="cnt" data-n={cart.reduce((a, l) => a + l.qty, 0)}>
              {cart.reduce((a, l) => a + l.qty, 0) || ""}
            </span>
          </button>
        </div>
      </div>
    </header>
  );
}
