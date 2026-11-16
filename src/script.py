#!/usr/bin/env python3
"""Create empty placeholder files in src/ (directories already exist)."""

from pathlib import Path

ROOT = Path("src")

FILES = [
    # root
    "styles.js",
    "App.jsx",

    # pages
    "pages/Home.jsx",
    "pages/Admin.jsx",

    # lib
    "lib/api.js",
    "lib/constants.js",
    "lib/helpers.js",
    "lib/garment.js",

    # hooks
    "hooks/useStoreData.js",
    "hooks/useScrollReveal.js",

    # context
    "context/StoreContext.jsx",

    # layout
    "components/layout/Announcement.jsx",
    "components/layout/Navbar.jsx",
    "components/layout/MobileMenu.jsx",
    "components/layout/Ticker.jsx",
    "components/layout/Footer.jsx",
    "components/layout/SearchOverlay.jsx",
    "components/layout/Toast.jsx",
    "components/layout/BackToTop.jsx",

    # hero
    "components/hero/Hero.jsx",

    # sections
    "components/sections/CollectionsSection.jsx",
    "components/sections/ShopSection.jsx",
    "components/sections/EditorialSection.jsx",
    "components/sections/FadeSection.jsx",
    "components/sections/LookbookSection.jsx",
    "components/sections/CraftSection.jsx",
    "components/sections/JournalSection.jsx",
    "components/sections/ReviewsSection.jsx",
    "components/sections/NewsletterSection.jsx",

    # product
    "components/product/ProductCard.jsx",
    "components/product/QuickView.jsx",

    # cart
    "components/cart/CartDrawer.jsx",
    "components/cart/LineNote.jsx",

    # checkout
    "components/checkout/Checkout.jsx",

    # ui
    "components/ui/HeartIcon.jsx",
    "components/ui/Stat.jsx",
    "components/ui/Scrim.jsx",

    # admin
    "admin/AdminApp.jsx",
    "admin/AdminLogin.jsx",
    "admin/AdminProducts.jsx",
    "admin/AdminProductForm.jsx",
    "admin/AdminOrders.jsx",
]

if __name__ == "__main__":
    for rel in FILES:
        p = ROOT / rel
        p.parent.mkdir(parents=True, exist_ok=True)
        p.touch(exist_ok=True)
        print(f"  ✓ {p}")
    print(f"\nCreated {len(FILES)} empty files under {ROOT}/")