import React from "react";

export function MobileNav({ goTo, menuOpen, setMenuOpen }) {
  return (
    <>
      {/* Click outside to close */}
      <div 
        className={`mnav-scrim${menuOpen ? " open" : ""}`} 
        onClick={() => setMenuOpen(false)} 
      />

      <nav className={`mnav${menuOpen ? " open" : ""}`} aria-label="Mobile">
        <button className="ico x" aria-label="Close menu" onClick={() => setMenuOpen(false)}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <path d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        <a href="#shop" onClick={(e) => { e.preventDefault(); goTo("#shop", "all"); setMenuOpen(false); }}>
          <span className="num">01</span> Shop
        </a>
        
        <a href="#collections" onClick={(e) => { e.preventDefault(); goTo("#collections"); setMenuOpen(false); }}>
          <span className="num">02</span> Collections
        </a>
        
        <a href="#fade" onClick={(e) => { e.preventDefault(); goTo("#fade"); setMenuOpen(false); }}>
          <span className="num">03</span> Fade Guide
        </a>
        
        <a href="#lookbook" onClick={(e) => { e.preventDefault(); goTo("#lookbook"); setMenuOpen(false); }}>
          <span className="num">04</span> Lookbook
        </a>
        
        <a href="#journal" onClick={(e) => { e.preventDefault(); goTo("#journal"); setMenuOpen(false); }}>
          <span className="num">05</span> Journal
        </a>
      </nav>
    </>
  );
}