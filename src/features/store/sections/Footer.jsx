import React from "react";
// Import the logo directly from your assets folder
import logo from "../../../assets/logo.png"; 

export function Footer({ goTo }) {
  const handleAdminRoute = (e) => {
    e.preventDefault();
    // Clean routing to the admin panel
    window.history.pushState({}, "", "/admin");
    window.dispatchEvent(new Event("popstate"));
  };

  return (
    <footer>
      {/* Top Rope Detail */}
      <div className="rope" />
      
      <div className="wrap">
        <div className="f-grid">
          
          {/* Brand, Logo & Socials */}
          <div className="f-brand">
            <div className="f-logo-wrap">
              {/* Using the new logo.png */}
              <img src={logo} alt="Rookford Logo" />
            </div>
            <p>
              Selvedge denim woven in Bangladesh.<br />
              Made to be worn, mended and handed down.
            </p>
            
            <div className="f-socials">
              <a href="https://instagram.com/rookfordapparel" target="_blank" rel="noreferrer" aria-label="Instagram" className="soc ig">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><rect x="2" y="2" width="20" height="20" rx="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/></svg>
              </a>
              <a href="https://twitter.com" target="_blank" rel="noreferrer" aria-label="X (Twitter)" className="soc tw">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M4 4l16 16M20 4L4 20"/></svg>
              </a>
              <a href="https://facebook.com/rookfordapparel" target="_blank" rel="noreferrer" aria-label="Facebook" className="soc fb">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/></svg>
              </a>
              <a href="https://pinterest.com" target="_blank" rel="noreferrer" aria-label="Pinterest" className="soc pin">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M12 2a10 10 0 0 0-3.6 19.3 9.9 9.9 0 0 1 2.4-4.7c.2.2 1.2.8 2.6.8a4.6 4.6 0 0 0 4.6-4.8 4.3 4.3 0 0 0-4.4-4.2 4 4 0 0 0-4 4 3 3 0 0 0 2 2.8 1.5 1.5 0 0 0 1.9-1.2 3.6 3.6 0 0 1 .3-1.5 1 1 0 0 1 1.3-.6c1.6 0 2.2 1.3 2.2 2.5 0 2-1.4 3.6-3.4 3.6-2.6 0-4.2-2-4.2-4.6a6 6 0 0 1 6.3-5.7c3 0 5.4 2 5.4 5.2 0 3.5-2.2 6.2-5.2 6.2a3.9 3.9 0 0 1-2.1-.7 9.9 9.9 0 0 1-1.2 4.7A10 10 0 1 0 12 2z"/></svg>
              </a>
            </div>
          </div>

          {/* Links - Shop */}
          <div className="f-col">
            <h5>Shop</h5>
            <a href="#shop" onClick={(e) => { e.preventDefault(); goTo("#shop", "Jeans"); }}>Jeans</a>
            <a href="#shop" onClick={(e) => { e.preventDefault(); goTo("#shop", "Jackets"); }}>Jackets</a>
            <a href="#shop" onClick={(e) => { e.preventDefault(); goTo("#shop", "Shirts"); }}>Shirts</a>
            <a href="#shop" onClick={(e) => { e.preventDefault(); goTo("#shop", "Headwear"); }}>Headwear</a>
          </div>

          {/* Links - Care */}
          <div className="f-col">
            <h5>Care</h5>
            <a href="#fade" onClick={(e) => { e.preventDefault(); goTo("#fade"); }}>Fade Guide</a>
            <a href="#craft" onClick={(e) => { e.preventDefault(); goTo("#craft"); }}>Hemming</a>
            <a href="#craft" onClick={(e) => { e.preventDefault(); goTo("#craft"); }}>Repairs</a>
            <a href="#journal" onClick={(e) => { e.preventDefault(); goTo("#journal"); }}>Washing</a>
          </div>

          {/* Links - Company */}
          <div className="f-col">
            <h5>Company</h5>
            <a href="#craft" onClick={(e) => { e.preventDefault(); goTo("#craft"); }}>Our Craft</a>
            <a href="#journal" onClick={(e) => { e.preventDefault(); goTo("#journal"); }}>Journal</a>
            <a href="#lookbook" onClick={(e) => { e.preventDefault(); goTo("#lookbook"); }}>Lookbook</a>
            <a href="/admin" onClick={handleAdminRoute} style={{ color: "var(--saddle)" }}>Admin Portal</a>
          </div>

        </div>

        {/* Bottom Copyright Bar */}
        <div className="f-bot">
          <span>© 2026 Rookford Frontier Denim Co.</span>
          <span>Made in Bangladesh</span>
        </div>
      </div>
    </footer>
  );
}