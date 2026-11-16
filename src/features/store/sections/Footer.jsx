import React from "react";

export function Footer({ goTo, logoNode }) {
  return (
    <footer>
      <div className="wrap">
        <div className="f-top">
          <div>
            {logoNode}
            <p>
              Selvedge denim woven in Bangladesh. Made to be worn, mended and handed down.
            </p>
          </div>
          <div className="f-col">
            <h5>Shop</h5>
            <a href="#shop" onClick={(e) => { e.preventDefault(); goTo("#shop", "Jeans"); }}>Jeans</a>
            <a href="#shop" onClick={(e) => { e.preventDefault(); goTo("#shop", "Jackets"); }}>Jackets</a>
            <a href="#shop" onClick={(e) => { e.preventDefault(); goTo("#shop", "Shirts"); }}>Shirts</a>
            <a href="#shop" onClick={(e) => { e.preventDefault(); goTo("#shop", "Headwear"); }}>Headwear</a>
          </div>
          <div className="f-col">
            <h5>Care</h5>
            <a href="#fade" onClick={(e) => { e.preventDefault(); goTo("#fade"); }}>Fade guide</a>
            <a href="#craft" onClick={(e) => { e.preventDefault(); goTo("#craft"); }}>Hemming</a>
            <a href="#craft" onClick={(e) => { e.preventDefault(); goTo("#craft"); }}>Repairs</a>
            <a href="#journal" onClick={(e) => { e.preventDefault(); goTo("#journal"); }}>Washing</a>
          </div>
          <div className="f-col">
            <h5>Company</h5>
            <a href="#craft" onClick={(e) => { e.preventDefault(); goTo("#craft"); }}>Our craft</a>
            <a href="#journal" onClick={(e) => { e.preventDefault(); goTo("#journal"); }}>Journal</a>
            <a href="#lookbook" onClick={(e) => { e.preventDefault(); goTo("#lookbook"); }}>Lookbook</a>
            <a href="#admin" onClick={(e) => { e.preventDefault(); window.location.hash = "admin"; }}>
              Admin
            </a>
          </div>
        </div>
        <div className="f-bot">
          <span>© 2026 Rookford Frontier Denim Co.</span>
          <span>Made in Bangladesh</span>
        </div>
      </div>
    </footer>
  );
}
